import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ acceptable: true, reason: null, reply: null }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are a community moderator for a cricket app (LBPL - Local Box Premier League).
Your role is to:
- Detect abusive, offensive, or toxic messages
- Detect spam or irrelevant messages
- Help answer simple, common questions politely

Be calm and respectful.
Do not argue with users.
Do not generate long replies.

Respond ONLY in this exact JSON format:
{
  "acceptable": true/false,
  "reason": "short reason if not acceptable, null otherwise",
  "reply": "short helpful reply if it's a common question, null otherwise"
}

Keep replies under 2 lines. Be strict about hate speech, profanity, and spam.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `User message: "${message}"\n\nDecide:\n- Is this message acceptable? (Yes / No)\n- If No, give a short reason\n- If it is a common question, give a short helpful reply\nKeep replies under 2 lines.` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(
          JSON.stringify({ acceptable: true, reason: null, reply: null, error: "Rate limit" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(
          JSON.stringify({ acceptable: true, reason: null, reply: null, error: "Payment required" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      // Default to acceptable if AI fails
      return new Response(
        JSON.stringify({ acceptable: true, reason: null, reply: null }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || "";
    
    // Parse the JSON response from AI
    let result = { acceptable: true, reason: null, reply: null };
    
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Default to acceptable if parsing fails
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Moderation error:", error);
    // Default to acceptable if there's an error
    return new Response(
      JSON.stringify({ acceptable: true, reason: null, reply: null, error: error instanceof Error ? error.message : "Unknown error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
