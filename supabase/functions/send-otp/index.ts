import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const resendApiKey = Deno.env.get("RESEND_API_KEY")!;

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check rate limiting - 1 OTP per minute per email
    const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();
    const { data: recentOtp } = await supabase
      .from("email_otps")
      .select("id")
      .eq("email", email.toLowerCase())
      .gte("created_at", oneMinuteAgo)
      .limit(1);

    if (recentOtp && recentOtp.length > 0) {
      return new Response(
        JSON.stringify({ error: "Please wait 1 minute before requesting another OTP" }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate OTP
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes

    // Store OTP in database
    const { error: insertError } = await supabase
      .from("email_otps")
      .insert({
        email: email.toLowerCase(),
        otp,
        expires_at: expiresAt,
      });

    if (insertError) {
      console.error("Error storing OTP:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to generate OTP" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send OTP via Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "LBPL Official <noreply@lbplofficial.com>",
        to: [email],
        subject: "Your LBPL Login Code",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background-color: #0A1325; color: #ffffff; margin: 0; padding: 0; }
              .container { max-width: 500px; margin: 0 auto; padding: 40px 20px; text-align: center; }
              .logo { font-size: 28px; font-weight: bold; color: #F9C846; margin-bottom: 30px; }
              .otp-box { background: linear-gradient(135deg, #1a2a4a, #0f1b35); border: 2px solid #F9C846; border-radius: 12px; padding: 30px; margin: 20px 0; }
              .otp-code { font-size: 42px; font-weight: bold; color: #F9C846; letter-spacing: 8px; margin: 20px 0; }
              .message { color: #a0aec0; font-size: 14px; line-height: 1.6; margin: 20px 0; }
              .footer { color: #718096; font-size: 12px; margin-top: 30px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="logo">🏏 LBPL Community</div>
              <div class="otp-box">
                <p style="color: #F9C846; margin: 0 0 15px 0;">Your Login Code</p>
                <div class="otp-code">${otp}</div>
                <p class="message">Enter this code to verify your email and access the LBPL Community.</p>
              </div>
              <p class="message">This code expires in 5 minutes.</p>
              <p class="footer">If you didn't request this code, you can safely ignore this email.</p>
            </div>
          </body>
          </html>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error("Error sending email:", errorData);
      return new Response(
        JSON.stringify({ error: "Failed to send OTP email" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`OTP sent successfully to ${email}`);
    return new Response(
      JSON.stringify({ success: true, message: "OTP sent successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error in send-otp function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
