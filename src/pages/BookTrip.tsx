import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  ArrowLeft,
  CalendarIcon,
  Plane,
  Train,
  Bus,
  Car,
  Ship,
  Check,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const transportModes = [
  { id: "flight", icon: Plane, name: "Flight", description: "Fastest way to travel" },
  { id: "train", icon: Train, name: "Train", description: "Scenic & comfortable" },
  { id: "bus", icon: Bus, name: "Bus", description: "Budget-friendly option" },
  { id: "car", icon: Car, name: "Car Rental", description: "Freedom to explore" },
  { id: "cruise", icon: Ship, name: "Cruise", description: "Luxury sea travel" },
];

const indianCities = [
  { id: "delhi", name: "Delhi" },
  { id: "mumbai", name: "Mumbai" },
  { id: "jaipur", name: "Jaipur" },
  { id: "goa", name: "Goa" },
  { id: "kerala", name: "Kerala/Kochi" },
  { id: "varanasi", name: "Varanasi" },
  { id: "agra", name: "Agra" },
  { id: "udaipur", name: "Udaipur" },
  { id: "bangalore", name: "Bangalore" },
  { id: "chennai", name: "Chennai" },
  { id: "kolkata", name: "Kolkata" },
  { id: "hyderabad", name: "Hyderabad" },
  { id: "amritsar", name: "Amritsar" },
  { id: "rishikesh", name: "Rishikesh" },
  { id: "shimla", name: "Shimla" },
  { id: "manali", name: "Manali" },
];

const BookTrip = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMode, setSelectedMode] = useState<string>("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState<Date>();
  const [passengers, setPassengers] = useState("1");
  const [isBooking, setIsBooking] = useState(false);

  const handleBook = async () => {
    if (!selectedMode || !origin || !destination || !date) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);
    
    // Simulate booking
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    toast({
      title: "Booking Confirmed! 🎉",
      description: `Your ${selectedMode} from ${origin} to ${destination} has been booked.`,
    });
    
    setIsBooking(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display text-xl font-bold">Book Your Transport</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Transport Mode Selection */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="font-display text-2xl font-bold mb-6">
            Choose your travel mode
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {transportModes.map((mode, index) => (
              <motion.button
                key={mode.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedMode(mode.id)}
                className={cn(
                  "p-4 rounded-2xl border-2 transition-all text-center",
                  selectedMode === mode.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                )}
              >
                <mode.icon
                  className={cn(
                    "w-8 h-8 mx-auto mb-2",
                    selectedMode === mode.id ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span className="font-medium text-sm block">{mode.name}</span>
                <span className="text-xs text-muted-foreground">{mode.description}</span>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Booking Form */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-3xl border border-border p-6 md:p-8"
        >
          <h3 className="font-display text-xl font-semibold mb-6">
            Trip Details
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Origin */}
            <div className="space-y-2">
              <Label>From</Label>
              <Select value={origin} onValueChange={setOrigin}>
                <SelectTrigger>
                  <SelectValue placeholder="Select departure city" />
                </SelectTrigger>
                <SelectContent>
                  {indianCities.map((city) => (
                    <SelectItem key={city.id} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Destination */}
            <div className="space-y-2">
              <Label>To</Label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {indianCities.map((city) => (
                    <SelectItem key={city.id} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label>Travel Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="pointer-events-auto"
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Passengers */}
            <div className="space-y-2">
              <Label>Number of Passengers</Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
              />
            </div>
          </div>

          {/* Book Button */}
          <Button
            variant="hero"
            size="xl"
            className="w-full mt-8"
            onClick={handleBook}
            disabled={isBooking || !selectedMode || !origin || !destination || !date}
          >
            {isBooking ? (
              <>Processing...</>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                Book Now
              </>
            )}
          </Button>
        </motion.section>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-4 justify-center mt-8"
        >
          <Button variant="outline" onClick={() => navigate("/plan")}>
            Back to Trip Planner
          </Button>
          <Button variant="outline" onClick={() => navigate("/budget-estimator")}>
            Get Budget Estimate
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default BookTrip;
