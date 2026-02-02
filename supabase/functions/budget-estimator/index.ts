import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Real accommodation costs per night (INR) from travel_cost.csv data
// Format: { budget: [min, max], midRange: [min, max], luxury: [min, max] }
const ACCOMMODATION_DATA: Record<string, { budget: [number, number]; midRange: [number, number]; luxury: [number, number] }> = {
  "Manali": { budget: [500, 2000], midRange: [2500, 5000], luxury: [6000, 15000] },
  "Leh Ladakh": { budget: [700, 2000], midRange: [2500, 5000], luxury: [6000, 15000] },
  "Leh": { budget: [700, 2000], midRange: [2500, 5000], luxury: [6000, 15000] },
  "Ladakh": { budget: [700, 2000], midRange: [2500, 5000], luxury: [6000, 15000] },
  "Coorg": { budget: [800, 2500], midRange: [3000, 6000], luxury: [7000, 18000] },
  "Andaman": { budget: [1000, 3000], midRange: [4000, 8000], luxury: [10000, 25000] },
  "Lakshadweep": { budget: [2000, 5000], midRange: [6000, 15000], luxury: [18000, 40000] },
  "Goa": { budget: [800, 2500], midRange: [3000, 6000], luxury: [8000, 20000] },
  "Udaipur": { budget: [800, 2500], midRange: [3000, 8000], luxury: [10000, 30000] },
  "Srinagar": { budget: [500, 2000], midRange: [2500, 5000], luxury: [6000, 18000] },
  "Gangtok": { budget: [500, 2000], midRange: [2500, 5000], luxury: [6000, 12000] },
  "Munnar": { budget: [800, 2500], midRange: [3000, 6000], luxury: [8000, 18000] },
  "Varkala": { budget: [500, 2000], midRange: [2500, 5000], luxury: [6000, 15000] },
  "Mcleodganj": { budget: [500, 2000], midRange: [2000, 4000], luxury: [5000, 12000] },
  "Rishikesh": { budget: [400, 1500], midRange: [2000, 4000], luxury: [5000, 12000] },
  "Alleppey": { budget: [800, 2500], midRange: [3000, 6000], luxury: [8000, 20000] },
  "Darjeeling": { budget: [500, 2000], midRange: [2500, 5000], luxury: [6000, 15000] },
  "Nainital": { budget: [500, 2000], midRange: [2500, 5000], luxury: [6000, 15000] },
  "Shimla": { budget: [800, 2500], midRange: [3000, 6000], luxury: [8000, 18000] },
  "Ooty": { budget: [500, 2000], midRange: [2500, 5000], luxury: [6000, 15000] },
  "Jaipur": { budget: [500, 2500], midRange: [3000, 8000], luxury: [10000, 25000] },
  "Lonavala": { budget: [800, 2500], midRange: [3000, 6000], luxury: [8000, 18000] },
  "Mussoorie": { budget: [500, 2000], midRange: [2500, 5000], luxury: [6000, 15000] },
  "Kodaikanal": { budget: [500, 2000], midRange: [2500, 5000], luxury: [6000, 15000] },
  "Varanasi": { budget: [400, 1500], midRange: [2000, 5000], luxury: [6000, 15000] },
  "Mumbai": { budget: [1200, 3500], midRange: [4000, 8000], luxury: [12000, 35000] },
  "Agra": { budget: [500, 2500], midRange: [3000, 6000], luxury: [8000, 20000] },
  "Kolkata": { budget: [800, 2500], midRange: [3000, 6000], luxury: [8000, 18000] },
  "Jodhpur": { budget: [500, 2500], midRange: [3000, 8000], luxury: [10000, 25000] },
  "Bangalore": { budget: [800, 2500], midRange: [3000, 6000], luxury: [8000, 20000] },
  "Bengaluru": { budget: [800, 2500], midRange: [3000, 6000], luxury: [8000, 20000] },
  "Amritsar": { budget: [400, 1500], midRange: [2000, 4000], luxury: [5000, 12000] },
  "Delhi": { budget: [600, 2500], midRange: [3000, 7000], luxury: [10000, 30000] },
  "Jaisalmer": { budget: [800, 2500], midRange: [3000, 6000], luxury: [8000, 20000] },
  "Hyderabad": { budget: [600, 2000], midRange: [2500, 5000], luxury: [7000, 18000] },
  "Pondicherry": { budget: [500, 2000], midRange: [2500, 5000], luxury: [6000, 15000] },
  "Chennai": { budget: [600, 2000], midRange: [2500, 5000], luxury: [7000, 18000] },
  "Haridwar": { budget: [400, 1500], midRange: [2000, 4000], luxury: [5000, 12000] },
  "Pune": { budget: [800, 2500], midRange: [3000, 6000], luxury: [8000, 18000] },
  "Kochi": { budget: [600, 2000], midRange: [2500, 5000], luxury: [7000, 18000] },
  "Kerala": { budget: [800, 2500], midRange: [3500, 7000], luxury: [10000, 25000] },
  "Mysore": { budget: [500, 2000], midRange: [2500, 5000], luxury: [6000, 15000] },
  "Mysuru": { budget: [500, 2000], midRange: [2500, 5000], luxury: [6000, 15000] },
  "Chandigarh": { budget: [600, 2000], midRange: [2500, 5000], luxury: [7000, 15000] },
  "Hampi": { budget: [400, 1500], midRange: [1500, 3000], luxury: [4000, 10000] },
  "Pushkar": { budget: [400, 1500], midRange: [2000, 4000], luxury: [5000, 12000] },
  "Kasol": { budget: [400, 1500], midRange: [2000, 4000], luxury: [5000, 10000] },
  "Dharamshala": { budget: [500, 2000], midRange: [2500, 5000], luxury: [6000, 12000] },
  "default": { budget: [500, 2000], midRange: [2500, 5500], luxury: [7000, 18000] },
};

// Daily food costs per person (INR) - actual travel costs not living costs
const FOOD_COSTS = {
  budget: { min: 300, max: 600 },      // Street food, dhabas, basic meals
  midRange: { min: 800, max: 1500 },   // Restaurants, cafes, mixed dining
  luxury: { min: 2000, max: 4000 },    // Fine dining, hotel restaurants
};

// Daily local transport per person (INR)
const LOCAL_TRANSPORT = {
  budget: { min: 100, max: 250 },      // Public buses, shared autos
  midRange: { min: 400, max: 800 },    // Mix of Ola/Uber and autos
  luxury: { min: 1500, max: 3000 },    // Private car, AC cabs
};

// Inter-city transport base costs (one-way, INR) - varies by distance
const INTERCITY_TRANSPORT = {
  budget: { train: 500, bus: 400 },
  midRange: { train: 1500, flight: 4000 },
  luxury: { train: 3000, flight: 8000 },
};

// Route-based transport multipliers (approximate distance tiers)
const ROUTE_DISTANCES: Record<string, Record<string, number>> = {
  "Delhi": { "Mumbai": 1.8, "Jaipur": 0.8, "Agra": 0.6, "Varanasi": 1.2, "Goa": 2.2, "Kerala": 2.5, "Manali": 1.0, "Shimla": 0.8, "Udaipur": 1.1, "Amritsar": 0.9, "Rishikesh": 0.7, "Leh Ladakh": 2.0 },
  "Mumbai": { "Delhi": 1.8, "Goa": 0.9, "Pune": 0.5, "Jaipur": 1.5, "Bangalore": 1.4, "Hyderabad": 1.1, "Kerala": 1.8, "Kolkata": 2.2 },
  "Bangalore": { "Mumbai": 1.4, "Kerala": 0.8, "Chennai": 0.6, "Goa": 1.0, "Hyderabad": 0.9, "Mysore": 0.4, "Coorg": 0.5, "Hampi": 0.6 },
  "Kolkata": { "Delhi": 2.0, "Darjeeling": 0.9, "Gangtok": 1.0, "Varanasi": 1.0, "Chennai": 2.0, "Mumbai": 2.2 },
  "Chennai": { "Bangalore": 0.6, "Kerala": 1.0, "Pondicherry": 0.4, "Hyderabad": 0.9, "Mumbai": 1.8, "Ooty": 0.8 },
  "Hyderabad": { "Mumbai": 1.1, "Bangalore": 0.9, "Chennai": 0.9, "Goa": 1.3, "Delhi": 1.8 },
  "Jaipur": { "Delhi": 0.8, "Udaipur": 0.7, "Jodhpur": 0.6, "Jaisalmer": 0.9, "Agra": 0.7, "Pushkar": 0.4 },
  "default": { "default": 1.0 },
};

// Daily activities per person (INR)
const ACTIVITIES = {
  budget: { min: 200, max: 400 },      // Free attractions, basic entry fees
  midRange: { min: 600, max: 1200 },   // Guided tours, major attractions
  luxury: { min: 2000, max: 4000 },    // Private tours, premium experiences
};

// City-specific cost multipliers (based on india_cost_quality_dataset.csv)
const CITY_MULTIPLIERS: Record<string, number> = {
  "Mumbai": 1.4,
  "Delhi": 1.2,
  "Bengaluru": 1.15,
  "Bangalore": 1.15,
  "Pune": 1.2,
  "Chennai": 1.1,
  "Hyderabad": 1.05,
  "Kolkata": 1.0,
  "Goa": 1.25,
  "Jaipur": 0.9,
  "Udaipur": 0.95,
  "Kerala": 1.1,
  "Manali": 0.85,
  "Shimla": 0.9,
  "Rishikesh": 0.75,
  "Varanasi": 0.7,
  "Agra": 0.85,
  "Leh Ladakh": 1.3,
  "Andaman": 1.35,
  "Lakshadweep": 1.5,
  "default": 1.0,
};

// Safety scores from data
const SAFETY_SCORES: Record<string, number> = {
  "Mumbai": 2.7,
  "Delhi": 2.6,
  "Bengaluru": 6.7,
  "Hyderabad": 7.7,
  "Ahmedabad": 7.9,
  "Chennai": 4.0,
  "Kolkata": 4.7,
  "Pune": 6.0,
  "Jaipur": 6.7,
  "Goa": 6.5,
  "Varanasi": 3.3,
  "Agra": 7.6,
  "Udaipur": 3.2,
  "Amritsar": 8.2,
  "Srinagar": 5.1,
  "Gangtok": 8.7,
  "Rishikesh": 6.5,
  "default": 6.0,
};

function getAccommodationData(destination: string) {
  return ACCOMMODATION_DATA[destination] || ACCOMMODATION_DATA["default"];
}

function getCityMultiplier(destination: string): number {
  return CITY_MULTIPLIERS[destination] || CITY_MULTIPLIERS["default"];
}

function getSafetyScore(destination: string): number {
  return SAFETY_SCORES[destination] || SAFETY_SCORES["default"];
}

function getAverage(min: number, max: number): number {
  return Math.round((min + max) / 2);
}

function getRouteMultiplier(origin: string, destination: string): number {
  const originRoutes = ROUTE_DISTANCES[origin] || ROUTE_DISTANCES["default"];
  return originRoutes[destination] || originRoutes["default"] || 1.0;
}

function calculateBudget(
  origin: string,
  destination: string,
  days: number,
  travelers: number,
  travelStyle: "budget" | "mid-range" | "luxury"
) {
  const styleKey = travelStyle === "mid-range" ? "midRange" : travelStyle;
  const multiplier = getCityMultiplier(destination);
  const routeMultiplier = getRouteMultiplier(origin, destination);
  const accommodationData = getAccommodationData(destination);

  // Accommodation (per room, assuming 2 travelers share)
  const roomsNeeded = Math.ceil(travelers / 2);
  const accRange = accommodationData[styleKey];
  const dailyAccommodation = getAverage(accRange[0], accRange[1]) * multiplier;
  const totalAccommodation = Math.round(dailyAccommodation * days * roomsNeeded);

  // Food (per person per day)
  const foodRange = FOOD_COSTS[styleKey];
  const dailyFood = getAverage(foodRange.min, foodRange.max) * multiplier;
  const totalFood = Math.round(dailyFood * days * travelers);

  // Local Transport (per person per day)
  const localTransportRange = LOCAL_TRANSPORT[styleKey];
  const dailyLocalTransport = getAverage(localTransportRange.min, localTransportRange.max) * multiplier;
  const totalLocalTransport = Math.round(dailyLocalTransport * days * travelers);

  // Inter-city transport (round trip) - now considers route distance
  const intercityData = INTERCITY_TRANSPORT[styleKey];
  const intercityMode = styleKey === "luxury" ? "flight" : (styleKey === "midRange" ? "train" : "train");
  const baseCost = intercityData[intercityMode as keyof typeof intercityData] || intercityData.train;
  const intercityCost = Math.round(baseCost * routeMultiplier);
  const totalIntercity = Math.round(intercityCost * 2 * travelers); // Round trip

  const totalTransport = totalLocalTransport + totalIntercity;

  // Activities (per person per day)
  const activitiesRange = ACTIVITIES[styleKey];
  const dailyActivities = getAverage(activitiesRange.min, activitiesRange.max) * multiplier;
  const totalActivities = Math.round(dailyActivities * days * travelers);

  // Miscellaneous (12% of subtotal for tips, emergencies, souvenirs)
  const subtotal = totalAccommodation + totalFood + totalTransport + totalActivities;
  const miscellaneous = Math.round(subtotal * 0.12);

  const total = subtotal + miscellaneous;

  return {
    transport: totalTransport,
    accommodation: totalAccommodation,
    food: totalFood,
    activities: totalActivities,
    miscellaneous,
    total,
    perPerson: Math.round(total / travelers),
    perDay: Math.round(total / days),
  };
}

function generateTips(destination: string, travelStyle: string, days: number): string[] {
  const tips: string[] = [];
  const safetyScore = getSafetyScore(destination);

  if (travelStyle === "budget") {
    tips.push(`Book hostels or guesthouses in ${destination} - save up to 60% on accommodation`);
    tips.push("Use Sleeper class trains and state transport buses for intercity travel");
    tips.push("Eat at local dhabas and street food stalls for authentic and affordable meals (₹50-150/meal)");
    tips.push("Book IRCTC Tatkal tickets 1 day before travel for last-minute budget options");
    tips.push("Download offline maps and use public WiFi to save on mobile data");
  } else if (travelStyle === "mid-range") {
    tips.push(`Book 3-star hotels through MakeMyTrip, Goibibo, or OYO for deals in ${destination}`);
    tips.push("Mix Ola/Uber rides with local autos for cost-effective city transport");
    tips.push("Try local restaurants for lunch and hotel dining for dinner");
    tips.push("Book combo tickets for multiple attractions where available");
    tips.push("Travel during weekdays for lower hotel rates (up to 30% savings)");
  } else {
    tips.push(`Book heritage hotels or 5-star properties in ${destination} for authentic luxury`);
    tips.push("Hire a private car with driver for comfortable day trips (₹2500-4000/day)");
    tips.push("Pre-book fine dining experiences and spa treatments");
    tips.push("Consider business class trains or premium economy flights");
    tips.push("Book private guided tours for personalized monument visits");
  }

  if (safetyScore < 5) {
    tips.push(`⚠️ ${destination} safety tip: Keep valuables secure and avoid isolated areas after dark`);
  }

  if (days >= 7) {
    tips.push("Extended trip tip: Negotiate weekly rates at hotels for 15-20% discount");
  }

  return tips.slice(0, 6);
}

function generateDayByDay(destination: string, days: number, travelStyle: string): string[] {
  const dayPlan: string[] = [];

  const attractions: Record<string, string[]> = {
    "Delhi": ["Red Fort & Chandni Chowk", "Humayun's Tomb & Lodhi Gardens", "Qutub Minar & Mehrauli", "India Gate & Rashtrapati Bhavan", "Akshardham Temple", "Connaught Place shopping"],
    "Mumbai": ["Gateway of India & Colaba", "Elephanta Caves (ferry)", "Marine Drive & Haji Ali", "Sanjay Gandhi National Park", "Bandra & Bandstand", "CST & Crawford Market"],
    "Jaipur": ["Amber Fort & Jal Mahal", "City Palace & Hawa Mahal", "Nahargarh Fort sunset", "Jantar Mantar & local markets", "Albert Hall Museum", "Johari Bazaar shopping"],
    "Goa": ["North Goa beaches", "Old Goa churches", "South Goa beaches", "Dudhsagar Falls", "Flea markets & nightlife", "Water sports & cruises"],
    "Kerala": ["Munnar tea gardens", "Alleppey houseboat", "Kochi Fort & backwaters", "Thekkady wildlife", "Varkala beach", "Kovalam & spa"],
    "Varanasi": ["Ganga Aarti at Dashashwamedh", "Boat ride at sunrise", "Sarnath Buddhist site", "Temple walk & old city", "Ramnagar Fort", "Silk shopping"],
    "Agra": ["Taj Mahal at sunrise", "Agra Fort", "Fatehpur Sikri day trip", "Mehtab Bagh sunset", "Local marble craft", "Kinari Bazaar"],
    "Udaipur": ["City Palace complex", "Lake Pichola boat ride", "Jagdish Temple & old city", "Sajjangarh Monsoon Palace", "Vintage car museum", "Local crafts shopping"],
    "Manali": ["Solang Valley adventure", "Rohtang Pass excursion", "Old Manali & cafes", "Hadimba Temple & Van Vihar", "Vashisht hot springs", "Mall Road shopping"],
    "default": ["Local sightseeing", "Main attractions", "Cultural experiences", "Local markets", "Day trip to nearby places", "Leisure & shopping"],
  };

  const destAttractions = attractions[destination] || attractions["default"];

  for (let i = 0; i < days; i++) {
    if (i === 0) {
      dayPlan.push(`Day ${i + 1}: Arrive, check-in, and explore ${destAttractions[0] || "local area"}`);
    } else if (i === days - 1) {
      dayPlan.push(`Day ${i + 1}: ${destAttractions[i % destAttractions.length] || "Final shopping"} and departure`);
    } else {
      dayPlan.push(`Day ${i + 1}: ${destAttractions[i % destAttractions.length] || `Explore local attractions`}`);
    }
  }

  return dayPlan;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { origin, destination, days, travelers, travelStyle } = await req.json();

    const originCity = origin || "Delhi"; // Default to Delhi if not provided
    console.log(`Budget calculation: ${originCity} → ${destination}, ${days} days, ${travelers} travelers, ${travelStyle} style`);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Calculate budget using real data
    const calculatedBudget = calculateBudget(
      originCity,
      destination,
      days,
      travelers,
      travelStyle as "budget" | "mid-range" | "luxury"
    );

    const tips = generateTips(destination, travelStyle, days);
    const dayByDay = generateDayByDay(destination, days, travelStyle);

    console.log("Calculated budget:", calculatedBudget);

    const systemPrompt = `You are an Indian travel budget assistant. Return ONLY a valid JSON object with no markdown or extra text.

Pre-calculated budget for trip from ${originCity} to ${destination} (${days} days, ${travelers} travelers, ${travelStyle}):
- Transport: ₹${calculatedBudget.transport.toLocaleString("en-IN")} (includes ${originCity}→${destination} round trip)
- Accommodation: ₹${calculatedBudget.accommodation.toLocaleString("en-IN")}
- Food: ₹${calculatedBudget.food.toLocaleString("en-IN")}
- Activities: ₹${calculatedBudget.activities.toLocaleString("en-IN")}
- Miscellaneous: ₹${calculatedBudget.miscellaneous.toLocaleString("en-IN")}
- Total: ₹${calculatedBudget.total.toLocaleString("en-IN")}

Return this EXACT JSON:
{
  "transport": ${calculatedBudget.transport},
  "accommodation": ${calculatedBudget.accommodation},
  "food": ${calculatedBudget.food},
  "activities": ${calculatedBudget.activities},
  "miscellaneous": ${calculatedBudget.miscellaneous},
  "total": ${calculatedBudget.total},
  "tips": ${JSON.stringify(tips)},
  "dayByDay": ${JSON.stringify(dayByDay)}
}`;

    const userPrompt = `Generate the budget JSON for trip from ${originCity} to ${destination}. Use the exact pre-calculated values.`;

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
