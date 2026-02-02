import { motion, AnimatePresence } from "framer-motion";
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
  CreditCard,
  MapPin,
  Users,
  Sparkles,
  ArrowRight,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const transportModes = [
  { id: "flight", icon: Plane, name: "Flight", description: "Fastest way to travel", gradient: "from-blue-500 to-cyan-400" },
  { id: "train", icon: Train, name: "Train", description: "Scenic & comfortable", gradient: "from-orange-500 to-amber-400" },
  { id: "bus", icon: Bus, name: "Bus", description: "Budget-friendly option", gradient: "from-green-500 to-emerald-400" },
  { id: "car", icon: Car, name: "Car Rental", description: "Freedom to explore", gradient: "from-purple-500 to-pink-400" },
  { id: "cruise", icon: Ship, name: "Cruise", description: "Luxury sea travel", gradient: "from-teal-500 to-blue-400" },
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
  const [step, setStep] = useState(1);

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

  const canProceedToStep2 = selectedMode !== "";
  const canBook = origin && destination && date;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-display text-xl font-bold">Book Your Journey</h1>
              <p className="text-xs text-muted-foreground">Step {step} of 2</p>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
              step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              {step > 1 ? <Check className="w-4 h-4" /> : "1"}
            </div>
            <div className={cn("w-8 h-1 rounded-full transition-all", step > 1 ? "bg-primary" : "bg-muted")} />
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
              step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              2
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.section
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Hero Section */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">Choose Your Adventure</span>
                </motion.div>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
                  How would you like to <span className="text-gradient-primary">travel</span>?
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Select your preferred mode of transport for an unforgettable journey across India
                </p>
              </div>

              {/* Transport Mode Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {transportModes.map((mode, index) => (
                  <motion.button
                    key={mode.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMode(mode.id)}
                    className={cn(
                      "relative p-6 rounded-3xl border-2 transition-all duration-300 text-left overflow-hidden group",
                      selectedMode === mode.id
                        ? "border-primary bg-primary/5 shadow-elevated"
                        : "border-border/50 hover:border-primary/50 hover:shadow-soft bg-card/50"
                    )}
                  >
                    {/* Background gradient on hover/select */}
                    <div className={cn(
                      "absolute inset-0 opacity-0 transition-opacity duration-300 bg-gradient-to-br",
                      mode.gradient,
                      selectedMode === mode.id ? "opacity-10" : "group-hover:opacity-5"
                    )} />
                    
                    {/* Selected indicator */}
                    {selectedMode === mode.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </motion.div>
                    )}
                    
                    <div className="relative z-10">
                      <div className={cn(
                        "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110",
                        mode.gradient
                      )}>
                        <mode.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{mode.name}</h3>
                      <p className="text-sm text-muted-foreground">{mode.description}</p>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Continue Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center pt-4"
              >
                <Button
                  variant="hero"
                  size="xl"
                  onClick={() => setStep(2)}
                  disabled={!canProceedToStep2}
                  className="min-w-[200px] gap-2"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </motion.div>
            </motion.section>
          )}

          {step === 2 && (
            <motion.section
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Selected Transport Display */}
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center justify-between bg-card/80 backdrop-blur-sm rounded-2xl p-4 border border-border/50"
              >
                <div className="flex items-center gap-4">
                  {(() => {
                    const mode = transportModes.find(m => m.id === selectedMode);
                    if (!mode) return null;
                    return (
                      <>
                        <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center", mode.gradient)}>
                          <mode.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold">{mode.name}</p>
                          <p className="text-sm text-muted-foreground">{mode.description}</p>
                        </div>
                      </>
                    );
                  })()}
                </div>
                <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                  Change
                </Button>
              </motion.div>

              {/* Booking Form */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-card/80 backdrop-blur-sm rounded-3xl border border-border/50 p-6 md:p-8 shadow-soft"
              >
                <h3 className="font-display text-2xl font-semibold mb-6 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-primary" />
                  Trip Details
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Origin */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center text-xs font-bold">A</span>
                      From
                    </Label>
                    <Select value={origin} onValueChange={setOrigin}>
                      <SelectTrigger className="h-12 rounded-xl">
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
                    <Label className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-red-500/10 text-red-600 flex items-center justify-center text-xs font-bold">B</span>
                      To
                    </Label>
                    <Select value={destination} onValueChange={setDestination}>
                      <SelectTrigger className="h-12 rounded-xl">
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
                    <Label className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-primary" />
                      Travel Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full h-12 justify-start text-left font-normal rounded-xl",
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
                    <Label className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      Passengers
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={passengers}
                      onChange={(e) => setPassengers(e.target.value)}
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>

                {/* Route visualization */}
                {origin && destination && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-primary/5 via-accent/10 to-primary/5 border border-primary/20"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">From</p>
                        <p className="font-display font-semibold text-lg">{origin}</p>
                      </div>
                      <div className="flex-1 flex items-center justify-center px-4">
                        <div className="h-0.5 flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-2">
                          {(() => {
                            const mode = transportModes.find(m => m.id === selectedMode);
                            return mode ? <mode.icon className="w-5 h-5 text-primary" /> : null;
                          })()}
                        </div>
                        <div className="h-0.5 flex-1 bg-gradient-to-l from-primary/50 to-transparent" />
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">To</p>
                        <p className="font-display font-semibold text-lg">{destination}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Book Button */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setStep(1)}
                    className="rounded-xl"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    variant="hero"
                    size="xl"
                    className="flex-1 rounded-xl"
                    onClick={handleBook}
                    disabled={isBooking || !canBook}
                  >
                    {isBooking ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2"
                      >
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Processing...
                      </motion.div>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Book Now
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-3 justify-center"
              >
                <Button variant="ghost" onClick={() => navigate("/plan")} className="rounded-full">
                  Back to Trip Planner
                </Button>
                <Button variant="ghost" onClick={() => navigate("/budget-estimator")} className="rounded-full">
                  Get Budget Estimate
                </Button>
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default BookTrip;
