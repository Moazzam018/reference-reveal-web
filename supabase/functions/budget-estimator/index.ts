import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Real Indian city cost data (INR per month for living costs)
const CITY_COSTS: Record<string, { rent: number; food: number; safety: number }> = {
  "Mumbai": { rent: 34896, food: 6196, safety: 2.7 },
  "Delhi": { rent: 26424, food: 4487, safety: 2.6 },
  "Bengaluru": { rent: 26667, food: 6936, safety: 6.7 },
  "Bangalore": { rent: 26667, food: 6936, safety: 6.7 },
  "Hyderabad": { rent: 25785, food: 6375, safety: 7.7 },
  "Chennai": { rent: 21323, food: 6389, safety: 4.0 },
  "Kolkata": { rent: 25710, food: 4525, safety: 4.7 },
  "Pune": { rent: 33540, food: 6563, safety: 6.0 },
  "Jaipur": { rent: 8774, food: 6625, safety: 6.7 },
  "Ahmedabad": { rent: 20881, food: 3632, safety: 7.9 },
  "Lucknow": { rent: 10047, food: 4676, safety: 6.2 },
  "Varanasi": { rent: 5212, food: 3349, safety: 3.3 },
  "Agra": { rent: 8137, food: 6470, safety: 7.6 },
  "Udaipur": { rent: 4369, food: 4887, safety: 3.2 },
  "Goa": { rent: 15000, food: 5500, safety: 6.5 },
  "Kerala": { rent: 8985, food: 7843, safety: 7.1 },
  "Manali": { rent: 6000, food: 4500, safety: 7.0 },
  "Rishikesh": { rent: 5000, food: 3500, safety: 6.5 },
  "Shimla": { rent: 7000, food: 5000, safety: 7.5 },
  "Darjeeling": { rent: 6000, food: 4800, safety: 7.0 },
  "Srinagar": { rent: 9118, food: 3320, safety: 5.1 },
  "Jodhpur": { rent: 6343, food: 5154, safety: 3.9 },
  "Amritsar": { rent: 6676, food: 3388, safety: 8.2 },
  "Mysuru": { rent: 4578, food: 5648, safety: 4.5 },
  "Mysore": { rent: 4578, food: 5648, safety: 4.5 },
  "Chandigarh": { rent: 17284, food: 6337, safety: 5.3 },
  "Kochi": { rent: 8343, food: 7878, safety: 8.2 },
  "Gangtok": { rent: 5403, food: 7405, safety: 8.7 },
  "Dehradun": { rent: 4151, food: 6937, safety: 5.5 },
  "Coorg": { rent: 6000, food: 5000, safety: 7.5 },
  "Munnar": { rent: 5000, food: 4500, safety: 7.8 },
  "Ooty": { rent: 5500, food: 4200, safety: 7.2 },
  "Andaman": { rent: 12000, food: 6500, safety: 8.0 },
  "Leh": { rent: 8000, food: 5500, safety: 7.5 },
  "Ladakh": { rent: 8000, food: 5500, safety: 7.5 },
  "Leh Ladakh": { rent: 8000, food: 5500, safety: 7.5 },
  "Jaisalmer": { rent: 5000, food: 4000, safety: 7.0 },
  "Pushkar": { rent: 4000, food: 3500, safety: 6.8 },
  "Hampi": { rent: 4000, food: 3000, safety: 7.0 },
  "Alleppey": { rent: 6000, food: 5000, safety: 7.5 },
  "Varkala": { rent: 5000, food: 4500, safety: 7.2 },
  "Kasol": { rent: 4500, food: 3800, safety: 6.0 },
  "Mcleodganj": { rent: 5000, food: 4000, safety: 7.0 },
  "Dharamshala": { rent: 5500, food: 4200, safety: 7.2 },
  "Nainital": { rent: 6000, food: 4500, safety: 7.5 },
  "Kodaikanal": { rent: 5500, food: 4200, safety: 7.0 },
  "Mahabaleshwar": { rent: 6000, food: 4800, safety: 7.3 },
  "Lonavala": { rent: 7000, food: 5000, safety: 6.8 },
  "Pondicherry": { rent: 5954, food: 4414, safety: 3.2 },
  "Ranthambore": { rent: 5000, food: 4000, safety: 7.0 },
  "Jim Corbett": { rent: 5500, food: 4500, safety: 7.2 },
  "Kaziranga": { rent: 5000, food: 4200, safety: 7.5 },
};

// Accommodation costs per night by travel style (INR)
const ACCOMMODATION_COSTS: Record<string, { budget: { min: number; max: number }; midRange: { min: number; max: number }; luxury: { min: number; max: number } }> = {
  "Manali": { budget: { min: 500, max: 2000 }, midRange: { min: 2000, max: 5000 }, luxury: { min: 5000, max: 15000 } },
  "Leh Ladakh": { budget: { min: 700, max: 2000 }, midRange: { min: 2000, max: 5000 }, luxury: { min: 5000, max: 15000 } },
  "Coorg": { budget: { min: 800, max: 2500 }, midRange: { min: 2500, max: 6000 }, luxury: { min: 6000, max: 18000 } },
  "Andaman": { budget: { min: 1000, max: 3000 }, midRange: { min: 3000, max: 8000 }, luxury: { min: 8000, max: 25000 } },
  "Lakshadweep": { budget: { min: 2000, max: 5000 }, midRange: { min: 5000, max: 15000 }, luxury: { min: 15000, max: 40000 } },
  "Goa": { budget: { min: 500, max: 2000 }, midRange: { min: 2000, max: 6000 }, luxury: { min: 6000, max: 20000 } },
  "Udaipur": { budget: { min: 800, max: 2500 }, midRange: { min: 2500, max: 8000 }, luxury: { min: 8000, max: 30000 } },
  "Srinagar": { budget: { min: 500, max: 2000 }, midRange: { min: 2000, max: 5000 }, luxury: { min: 5000, max: 18000 } },
  "Gangtok": { budget: { min: 500, max: 2000 }, midRange: { min: 2000, max: 5000 }, luxury: { min: 5000, max: 12000 } },
  "Munnar": { budget: { min: 800, max: 2500 }, midRange: { min: 2500, max: 6000 }, luxury: { min: 6000, max: 18000 } },
  "Rishikesh": { budget: { min: 400, max: 1500 }, midRange: { min: 1500, max: 4000 }, luxury: { min: 4000, max: 12000 } },
  "Darjeeling": { budget: { min: 500, max: 2000 }, midRange: { min: 2000, max: 5000 }, luxury: { min: 5000, max: 15000 } },
  "Shimla": { budget: { min: 800, max: 2500 }, midRange: { min: 2500, max: 6000 }, luxury: { min: 6000, max: 18000 } },
  "Jaipur": { budget: { min: 500, max: 2000 }, midRange: { min: 2000, max: 6000 }, luxury: { min: 6000, max: 25000 } },
  "Mumbai": { budget: { min: 1000, max: 3000 }, midRange: { min: 3000, max: 8000 }, luxury: { min: 8000, max: 30000 } },
  "Delhi": { budget: { min: 500, max: 2000 }, midRange: { min: 2000, max: 6000 }, luxury: { min: 6000, max: 25000 } },
  "Agra": { budget: { min: 500, max: 2000 }, midRange: { min: 2000, max: 6000 }, luxury: { min: 6000, max: 20000 } },
  "Kolkata": { budget: { min: 800, max: 2500 }, midRange: { min: 2500, max: 6000 }, luxury: { min: 6000, max: 18000 } },
  "Varanasi": { budget: { min: 500, max: 1800 }, midRange: { min: 1800, max: 5000 }, luxury: { min: 5000, max: 15000 } },
  "Kerala": { budget: { min: 800, max: 2500 }, midRange: { min: 2500, max: 7000 }, luxury: { min: 7000, max: 25000 } },
  "default": { budget: { min: 500, max: 2000 }, midRange: { min: 2000, max: 6000 }, luxury: { min: 6000, max: 18000 } },
};

// Transport costs per day (INR)
const TRANSPORT_COSTS = {
  budget: { local: 150, intercity: 500 },
  midRange: { local: 400, intercity: 1500 },
  luxury: { local: 1500, intercity: 5000 },
};

// Activity costs per day (INR)
const ACTIVITY_COSTS = {
  budget: 300,
  midRange: 800,
  luxury: 2500,
};

// Food costs per day (INR)
const FOOD_MULTIPLIER = {
  budget: 0.5,    // Street food, local eateries
  midRange: 1.0,  // Restaurants, cafes
  luxury: 2.5,    // Fine dining, hotels
};

function getCityData(destination: string) {
  const normalizedDest = destination.trim();
  return CITY_COSTS[normalizedDest] || CITY_COSTS["default"] || { rent: 8000, food: 5000, safety: 6.0 };
}

function getAccommodationCosts(destination: string) {
  const normalizedDest = destination.trim();
  return ACCOMMODATION_COSTS[normalizedDest] || ACCOMMODATION_COSTS["default"];
}

function calculateBudget(
  destination: string,
  days: number,
  travelers: number,
  travelStyle: "budget" | "mid-range" | "luxury"
) {
  const cityData = getCityData(destination);
  const accommodationData = getAccommodationCosts(destination);
  
  const styleKey = travelStyle === "mid-range" ? "midRange" : travelStyle;
  
  // Calculate daily food cost (monthly cost / 30, adjusted for style)
  const dailyFoodCost = (cityData.food / 30) * FOOD_MULTIPLIER[styleKey];
  const totalFood = Math.round(dailyFoodCost * days * travelers);
  
  // Calculate accommodation (average of min/max for the style)
  const accRange = accommodationData[styleKey];
  const avgAccommodation = (accRange.min + accRange.max) / 2;
  const totalAccommodation = Math.round(avgAccommodation * days);
  
  // Calculate transport
  const transportCosts = TRANSPORT_COSTS[styleKey];
  const totalTransport = Math.round((transportCosts.local * days + transportCosts.intercity * 2) * travelers);
  
  // Calculate activities
  const totalActivities = Math.round(ACTIVITY_COSTS[styleKey] * days * travelers);
  
  // Miscellaneous (10-15% of subtotal)
  const subtotal = totalFood + totalAccommodation + totalTransport + totalActivities;
  const miscellaneous = Math.round(subtotal * 0.12);
  
  const total = subtotal + miscellaneous;
  
  return {
    transport: totalTransport,
    accommodation: totalAccommodation,
    food: totalFood,
    activities: totalActivities,
    miscellaneous,
    total,
    safetyScore: cityData.safety,
  };
}

function generateTips(destination: string, travelStyle: string, budget: ReturnType<typeof calculateBudget>) {
  const tips: string[] = [];
  
  if (travelStyle === "budget") {
    tips.push(`Stay in hostels or guesthouses to save up to 60% on accommodation in ${destination}`);
    tips.push("Use public transport like buses and shared autos instead of private cabs");
    tips.push("Eat at local dhabas and street food stalls for authentic and affordable meals");
    tips.push("Book train tickets in advance on IRCTC for best prices");
    tips.push("Visit attractions during off-peak hours to avoid crowds and sometimes get discounts");
  } else if (travelStyle === "mid-range") {
    tips.push(`Book 3-star hotels through apps like MakeMyTrip or Goibibo for deals in ${destination}`);
    tips.push("Mix local transport with occasional Ola/Uber for convenience");
    tips.push("Try a mix of restaurant meals and local street food for the best experience");
    tips.push("Book combo tickets for multiple attractions where available");
    tips.push("Consider traveling during shoulder season for better rates");
  } else {
    tips.push(`Book heritage hotels or luxury resorts in ${destination} for an authentic experience`);
    tips.push("Hire a private car with driver for comfortable sightseeing");
    tips.push("Pre-book fine dining experiences at top-rated restaurants");
    tips.push("Consider private tours for personalized experiences at monuments");
    tips.push("Book business class trains or flights for long-distance travel");
  }
  
  if (budget.safetyScore < 5) {
    tips.push(`Note: Be extra cautious in ${destination} - keep valuables secure and avoid isolated areas at night`);
  }
  
  return tips;
}

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

    // Calculate budget using real data
    const calculatedBudget = calculateBudget(
      destination,
      days,
      travelers,
      travelStyle as "budget" | "mid-range" | "luxury"
    );
    
    const tips = generateTips(destination, travelStyle, calculatedBudget);

    const systemPrompt = `You are an expert Indian travel budget planner. You've been provided with accurate budget calculations based on real 2024-2025 data.

The pre-calculated budget for ${destination} (${days} days, ${travelers} travelers, ${travelStyle} style) is:
- Transport: ₹${calculatedBudget.transport.toLocaleString("en-IN")}
- Accommodation: ₹${calculatedBudget.accommodation.toLocaleString("en-IN")}
- Food: ₹${calculatedBudget.food.toLocaleString("en-IN")}
- Activities: ₹${calculatedBudget.activities.toLocaleString("en-IN")}
- Miscellaneous: ₹${calculatedBudget.miscellaneous.toLocaleString("en-IN")}
- Total: ₹${calculatedBudget.total.toLocaleString("en-IN")}

IMPORTANT: You MUST respond with ONLY a valid JSON object using these EXACT calculated values. The JSON must follow this structure:
{
  "transport": ${calculatedBudget.transport},
  "accommodation": ${calculatedBudget.accommodation},
  "food": ${calculatedBudget.food},
  "activities": ${calculatedBudget.activities},
  "miscellaneous": ${calculatedBudget.miscellaneous},
  "total": ${calculatedBudget.total},
  "tips": ${JSON.stringify(tips)},
  "dayByDay": ["Day 1: Arrive and explore local area...", "Day 2: Visit main attractions..."]
}

Add a brief dayByDay array with ${days} entries describing suggested activities for each day in ${destination}. Keep each day description under 100 characters.`;

    const userPrompt = `Generate the budget JSON for ${destination}, India trip with the pre-calculated values. Add realistic day-by-day suggestions for ${days} days of ${travelStyle} travel.`;

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
