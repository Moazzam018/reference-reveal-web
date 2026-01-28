import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { destination, days, travelers, travelStyle } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert Indian travel budget planner. You provide accurate, realistic budget estimates for trips within India.

IMPORTANT: You MUST respond with ONLY a valid JSON object, no other text. The JSON must follow this exact structure:
{
  "transport": <number in INR>,
  "accommodation": <number in INR>,
  "food": <number in INR>,
  "activities": <number in INR>,
  "miscellaneous": <number in INR>,
  "total": <number in INR>,
  "tips": ["tip1", "tip2", "tip3"],
  "dayByDay": ["Day 1: ...", "Day 2: ..."]
}

Base your estimates on real 2024-2025 Indian travel costs:
- Budget: Hostels ₹500-1500/night, street food ₹200-400/day, trains/buses
- Mid-range: 3-star hotels ₹2000-5000/night, restaurants ₹500-1000/day, mix of transport
- Luxury: 5-star hotels ₹8000-25000/night, fine dining ₹1500-3000/day, flights/private cars

Consider:
- Destination-specific costs (Goa beaches vs Mumbai city vs Kerala backwaters)
- Seasonal price variations
- Entry fees for monuments and attractions
- Local transportation within the destination
- Tips and miscellaneous expenses (10-15% of total)`;

    const userPrompt = `Calculate a detailed travel budget for:
- Destination: ${destination}, India
- Duration: ${days} days
- Number of travelers: ${travelers}
- Travel style: ${travelStyle}

Provide realistic estimates in Indian Rupees (₹). Include 3-5 money-saving tips specific to this destination.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Budget estimator error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
