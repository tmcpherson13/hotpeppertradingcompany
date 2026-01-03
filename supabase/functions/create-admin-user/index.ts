import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateAdminRequest {
  email: string;
  displayName: string;
  sendWelcomeEmail?: boolean;
}

function generateSecurePassword(length: number = 16): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=';
  const allChars = uppercase + lowercase + numbers + special;

  let password = '';
  
  // Ensure at least one of each type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify the caller is an admin
    const authHeader = req.headers.get("Authorization");
    console.log("Auth header present:", !!authHeader);
    
    if (!authHeader) {
      console.log("No auth header provided");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract the JWT token from the Authorization header
    const token = authHeader.replace(/^Bearer\s+/i, "");
    console.log("Token length:", token.length);

    if (!token || token.length < 50) {
      console.log("Invalid or missing token");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create a client to verify the user's token
    const userClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Pass the token explicitly to getUser()
    const { data: { user: callerUser }, error: authError } = await userClient.auth.getUser(token);
    console.log("Auth result:", { userId: callerUser?.id, error: authError?.message });
    
    if (authError || !callerUser) {
      console.log("Auth failed:", authError?.message);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use service role client to check admin status (bypasses RLS)
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Check if caller is admin using service role client
    const { data: roleData, error: roleError } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", callerUser.id)
      .eq("role", "admin")
      .maybeSingle();

    console.log("Role check:", { roleData, roleError: roleError?.message });

    if (roleError || !roleData) {
      console.log("Admin check failed:", roleError?.message || "No admin role found");
      return new Response(
        JSON.stringify({ error: "Forbidden: Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const { email, displayName, sendWelcomeEmail }: CreateAdminRequest = await req.json();

    if (!email || !displayName) {
      return new Response(
        JSON.stringify({ error: "Email and display name are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check for duplicate email before creating
    const { data: existingUsers, error: listError } = await adminClient.auth.admin.listUsers();
    
    if (listError) {
      console.error("Error listing users:", listError);
    } else {
      const emailExists = existingUsers?.users?.some(u => u.email?.toLowerCase() === email.toLowerCase());
      if (emailExists) {
        console.log("Duplicate email found:", email);
        return new Response(
          JSON.stringify({ error: "duplicate_email", message: "An account with this email already exists" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Generate a secure temporary password
    const temporaryPassword = generateSecurePassword(16);

    // Create the new user
    const { data: newUserData, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: { display_name: displayName },
    });

    if (createError) {
      console.error("Error creating user:", createError);
      return new Response(
        JSON.stringify({ error: createError.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const newUserId = newUserData.user.id;

    // The handle_new_user trigger should have created profile and user_roles
    // But we need to update the role to admin
    const { error: updateRoleError } = await adminClient
      .from("user_roles")
      .update({ role: "admin" })
      .eq("user_id", newUserId);

    if (updateRoleError) {
      console.error("Error updating role:", updateRoleError);
    }

    // Create pending_password_changes record
    const { error: pendingError } = await adminClient
      .from("pending_password_changes")
      .insert({
        user_id: newUserId,
        created_by: callerUser.id,
      });

    if (pendingError) {
      console.error("Error creating pending password change:", pendingError);
    }

    // Track email status for response
    let emailSent = false;
    let emailError: string | null = null;

    // Send welcome email if requested and RESEND_API_KEY is configured
    if (sendWelcomeEmail) {
      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      if (resendApiKey) {
        try {
          // Get the origin from request headers for correct app URL
          const origin = req.headers.get("origin") || "https://lovable.dev";
          const loginUrl = `${origin}/admin`;
          
          console.log("Sending welcome email to:", email, "with login URL:", loginUrl);

          const emailResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${resendApiKey}`,
            },
            body: JSON.stringify({
              from: "Hot Pepper Trading Company <noreply@hotpeppertradingcompany.com>",
              to: [email],
              subject: "Welcome to the Hot Pepper Trading Company Administration",
              html: `
                <h1>Welcome, ${displayName}!</h1>
                <p>You have been granted administrator access to the Hot Pepper Trading Company.</p>
                <h2>Your Login Credentials</h2>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Temporary Password:</strong> ${temporaryPassword}</p>
                <p><strong>Login URL:</strong> <a href="${loginUrl}">${loginUrl}</a></p>
                <p><em>You will be required to change your password upon first login.</em></p>
                <hr>
                <p>If you have any questions, please contact your administrator.</p>
                <p>Regards,<br>Hot Pepper Trading Company</p>
              `,
            }),
          });

          if (emailResponse.ok) {
            emailSent = true;
            console.log("Welcome email sent successfully to:", email);
          } else {
            const errorBody = await emailResponse.text();
            emailError = `Email API error: ${emailResponse.status}`;
            console.error("Email send failed:", errorBody);
          }
        } catch (err: any) {
          emailError = err.message || "Failed to send email";
          console.error("Error sending welcome email:", err);
        }
      } else {
        emailError = "RESEND_API_KEY not configured";
        console.log("RESEND_API_KEY not configured, skipping email");
      }
    }

    // Log the action to audit log with email status
    const { error: auditError } = await adminClient
      .from("admin_audit_log")
      .insert({
        performed_by: callerUser.id,
        action: "admin_created",
        target_type: "user",
        target_id: newUserId,
        details: { 
          email, 
          display_name: displayName,
          email_sent: emailSent,
          email_error: emailError,
        },
      });

    if (auditError) {
      console.error("Error logging audit:", auditError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        userId: newUserId,
        email,
        temporaryPassword,
        emailSent,
        emailError,
        message: emailSent ? "Admin created and welcome email sent" : "Admin created successfully",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in create-admin-user:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
