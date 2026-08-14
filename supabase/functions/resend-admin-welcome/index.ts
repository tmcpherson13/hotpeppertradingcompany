import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ResendWelcomeRequest {
  userId: string;
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
    
    if (authError || !callerUser) {
      console.log("Auth failed:", authError?.message);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use service role client (bypasses RLS)
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Check if caller is admin
    const { data: roleData, error: roleError } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", callerUser.id)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError || !roleData) {
      console.log("Admin check failed:", roleError?.message || "No admin role found");
      return new Response(
        JSON.stringify({ error: "Forbidden: Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const { userId }: ResendWelcomeRequest = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the target user's information
    const { data: targetUserData, error: getUserError } = await adminClient.auth.admin.getUserById(userId);
    
    if (getUserError || !targetUserData?.user) {
      console.error("Error getting user:", getUserError);
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const targetUser = targetUserData.user;
    const email = targetUser.email;
    const displayName = targetUser.user_metadata?.display_name || email?.split('@')[0] || 'Administrator';

    if (!email) {
      return new Response(
        JSON.stringify({ error: "User has no email address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate a new secure temporary password
    const temporaryPassword = generateSecurePassword(16);

    // Update user's password
    const { error: updateError } = await adminClient.auth.admin.updateUserById(userId, {
      password: temporaryPassword,
    });

    if (updateError) {
      console.error("Error updating password:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to reset password" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Upsert pending_password_changes record to force password change on next login
    const { error: pendingError } = await adminClient
      .from("pending_password_changes")
      .upsert(
        { user_id: userId, created_by: callerUser.id },
        { onConflict: 'user_id' }
      );

    if (pendingError) {
      console.error("Error upserting pending password change:", pendingError);
    }

    // Track email status
    let emailSent = false;
    let emailError: string | null = null;

    // Send welcome email
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (resendApiKey) {
      try {
        // Get the origin from request headers for correct app URL.
        // Fall back to the production site (SITE_URL secret, else the domain).
        const origin = req.headers.get("origin") || Deno.env.get("SITE_URL") || "https://hotpeppertradingcompany.com";
        const loginUrl = `${origin}/admin`;
        
        console.log("Resending welcome email to:", email, "with login URL:", loginUrl);

        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Hot Pepper Trading Company <noreply@hotpeppertradingcompany.com>",
            to: [email],
            subject: "Your Password Has Been Reset - Hot Pepper Trading Company",
            html: `
              <h1>Hello, ${displayName}!</h1>
              <p>Your administrator password has been reset.</p>
              <h2>Your New Login Credentials</h2>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>New Temporary Password:</strong> ${temporaryPassword}</p>
              <p><strong>Login URL:</strong> <a href="${loginUrl}">${loginUrl}</a></p>
              <p><em>You will be required to change your password upon login.</em></p>
              <hr>
              <p>If you did not request this reset, please contact your administrator immediately.</p>
              <p>Regards,<br>Hot Pepper Trading Company</p>
            `,
          }),
        });

        if (emailResponse.ok) {
          emailSent = true;
          console.log("Welcome email resent successfully to:", email);
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

    // Log the action to audit log
    const { error: auditError } = await adminClient
      .from("admin_audit_log")
      .insert({
        performed_by: callerUser.id,
        action: "welcome_email_resent",
        target_type: "user",
        target_id: userId,
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
        userId,
        email,
        temporaryPassword,
        emailSent,
        emailError,
        message: emailSent
          ? "Welcome email resent successfully"
          : "Password reset (email not sent)",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in resend-admin-welcome:", error);
    return new Response(
      JSON.stringify({ error: "An internal error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
