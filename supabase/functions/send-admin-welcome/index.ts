import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendWelcomeEmailRequest {
  email: string;
  displayName: string;
  temporaryPassword: string;
  loginUrl: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { email, displayName, temporaryPassword, loginUrl }: SendWelcomeEmailRequest = await req.json();

    if (!email || !displayName || !temporaryPassword) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Hot Pepper Trading Company <noreply@mcpherson13.com>",
      to: [email],
      subject: "Welcome to the Hot Pepper Trading Company Administration",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Georgia, serif; line-height: 1.6; color: #2c1810; max-width: 600px; margin: 0 auto; padding: 20px; }
            h1 { color: #722f37; border-bottom: 2px solid #c9a227; padding-bottom: 10px; }
            h2 { color: #722f37; margin-top: 30px; }
            .credentials { background: #f5f0e6; border: 1px solid #c9a227; padding: 20px; margin: 20px 0; }
            .credentials p { margin: 5px 0; }
            .password { font-family: monospace; background: #fff; padding: 8px 12px; border: 1px solid #ddd; display: inline-block; }
            .note { font-style: italic; color: #666; background: #fff3cd; padding: 10px; border-left: 4px solid #c9a227; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <h1>Welcome, ${displayName}!</h1>
          
          <p>You have been granted administrator access to the <strong>Hot Pepper Trading Company</strong>.</p>
          
          <h2>Your Login Credentials</h2>
          
          <div class="credentials">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Temporary Password:</strong></p>
            <p class="password">${temporaryPassword}</p>
          </div>
          
          <p><strong>Login URL:</strong> <a href="${loginUrl}">${loginUrl}</a></p>
          
          <div class="note">
            <strong>Important:</strong> You will be required to change your password upon first login. 
            Please choose a strong password with at least 12 characters, including uppercase, lowercase, numbers, and special characters.
          </div>
          
          <div class="footer">
            <p>If you did not expect this invitation or have any questions, please contact your administrator.</p>
            <p>Regards,<br><strong>Hot Pepper Trading Company</strong></p>
          </div>
        </body>
        </html>
      `,
      }),
    });

    console.log("Welcome email sent:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, emailResponse }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
