import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  IndianRupee,
  Hotel,
  Utensils,
  Train,
  Camera,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TripData {
  origin?: string;
  destination?: string;
  startDate?: Date;
  endDate?: Date;
  travelers?: string;
  travelMode?: string;
}

interface BudgetBreakdown {
  transport: number;
  accommodation: number;
  food: number;
  activities: number;
  miscellaneous: number;
  total: number;
  tips: string[];
  dayByDay: string[];
}

const travelStyles = [
  { id: "budget", name: "Budget", description: "Hostels, street food, public transport" },
  { id: "mid-range", name: "Mid-Range", description: "3-star hotels, restaurants, mix of transport" },
  { id: "luxury", name: "Luxury", description: "5-star hotels, fine dining, private transport" },
];

const BudgetEstimator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const tripData = (location.state as TripData) || {};

  const [destination, setDestination] = useState(tripData.destination || "");
  const [days, setDays] = useState("5");
  const [travelers, setTravelers] = useState(tripData.travelers || "2");
  const [travelStyle, setTravelStyle] = useState("mid-range");
  const [isLoading, setIsLoading] = useState(false);
  const [budget, setBudget] = useState<BudgetBreakdown | null>(null);
  const [streamedResponse, setStreamedResponse] = useState("");

  const destinations = [
    { id: "delhi", name: "Delhi" },
    { id: "mumbai", name: "Mumbai" },
    { id: "jaipur", name: "Jaipur" },
    { id: "goa", name: "Goa" },
    { id: "kerala", name: "Kerala" },
    { id: "varanasi", name: "Varanasi" },
    { id: "agra", name: "Agra" },
    { id: "udaipur", name: "Udaipur" },
    { id: "manali", name: "Manali" },
    { id: "rishikesh", name: "Rishikesh" },
  ];

  const estimateBudget = async () => {
    if (!destination) {
      toast({
        title: "Missing destination",
        description: "Please select a destination",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setBudget(null);
    setStreamedResponse("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/budget-estimator`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            destination: destinations.find((d) => d.id === destination)?.name || destination,
            days: parseInt(days),
            travelers: parseInt(travelers),
            travelStyle,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get budget estimate");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const data = JSON.parse(line.slice(6));
              const content = data.choices?.[0]?.delta?.content;
              if (content) {
                fullText += content;
                setStreamedResponse(fullText);
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }

      // Try to parse the final response as JSON
      try {
        const jsonMatch = fullText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          setBudget(parsed);
        }
      } catch {
        // Keep showing the streamed text if JSON parsing fails
      }
    } catch (error) {
      console.error("Budget estimation error:", error);
      toast({
        title: "Error",
        description: "Failed to estimate budget. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Budget Estimator
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Input Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl border border-border p-6 md:p-8 mb-8"
        >
          <h2 className="font-display text-2xl font-bold mb-6">
            Tell us about your trip
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Destination</Label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger>
                  <SelectValue placeholder="Where are you going?" />
                </SelectTrigger>
                <SelectContent>
                  {destinations.map((dest) => (
                    <SelectItem key={dest.id} value={dest.id}>
                      {dest.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Number of Days</Label>
              <Input
                type="number"
                min="1"
                max="30"
                value={days}
                onChange={(e) => setDays(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Number of Travelers</Label>
              <Input
                type="number"
                min="1"
                max="20"
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Travel Style</Label>
              <Select value={travelStyle} onValueChange={setTravelStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {travelStyles.map((style) => (
                    <SelectItem key={style.id} value={style.id}>
                      <div>
                        <span className="font-medium">{style.name}</span>
                        <span className="text-muted-foreground text-xs ml-2">
                          {style.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            variant="hero"
            size="xl"
            className="w-full mt-8"
            onClick={estimateBudget}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                AI is calculating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Estimate My Budget
              </>
            )}
          </Button>
        </motion.section>

        {/* Results Section */}
        {(isLoading || budget || streamedResponse) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Streaming Response */}
            {isLoading && streamedResponse && (
              <div className="bg-card rounded-3xl border border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span className="font-medium">AI is thinking...</span>
                </div>
                <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                  {streamedResponse}
                </div>
              </div>
            )}

            {/* Budget Breakdown */}
            {budget && (
              <>
                {/* Total */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-gradient-sunset rounded-3xl p-8 text-center text-primary-foreground"
                >
                  <p className="text-lg opacity-80 mb-2">Estimated Total Budget</p>
                  <div className="flex items-center justify-center gap-2">
                    <IndianRupee className="w-10 h-10" />
                    <span className="font-display text-5xl md:text-6xl font-bold">
                      {budget.total.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p className="text-sm opacity-70 mt-2">
                    For {travelers} travelers, {days} days
                  </p>
                </motion.div>

                {/* Breakdown Cards */}
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: Train, label: "Transport", value: budget.transport, color: "bg-blue-500/10 text-blue-500" },
                    { icon: Hotel, label: "Stay", value: budget.accommodation, color: "bg-purple-500/10 text-purple-500" },
                    { icon: Utensils, label: "Food", value: budget.food, color: "bg-orange-500/10 text-orange-500" },
                    { icon: Camera, label: "Activities", value: budget.activities, color: "bg-green-500/10 text-green-500" },
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-card rounded-2xl border border-border p-4"
                    >
                      <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mb-3`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="font-display text-xl font-bold">
                        ₹{item.value.toLocaleString("en-IN")}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Tips */}
                {budget.tips && budget.tips.length > 0 && (
                  <div className="bg-card rounded-3xl border border-border p-6">
                    <h3 className="font-display text-lg font-semibold mb-4">
                      💡 Money-Saving Tips
                    </h3>
                    <ul className="space-y-2">
                      {budget.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={estimateBudget}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Recalculate
                  </Button>
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={() => navigate("/book")}
                  >
                    Book This Trip
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </>
            )}
          </motion.section>
        )}
      </main>
    </div>
  );
};

export default BudgetEstimator;
