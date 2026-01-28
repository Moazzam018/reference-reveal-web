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
  MapPin,
  Users,
  Sparkles,
  Train,
  Plane,
  Car,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const indianCities = [
  { id: "delhi", name: "Delhi", state: "Delhi", image: "🏛️" },
  { id: "mumbai", name: "Mumbai", state: "Maharashtra", image: "🌆" },
  { id: "jaipur", name: "Jaipur", state: "Rajasthan", image: "🏰" },
  { id: "goa", name: "Goa", state: "Goa", image: "🏖️" },
  { id: "kerala", name: "Kerala", state: "Kerala", image: "🌴" },
  { id: "varanasi", name: "Varanasi", state: "Uttar Pradesh", image: "🕉️" },
  { id: "agra", name: "Agra", state: "Uttar Pradesh", image: "🕌" },
  { id: "udaipur", name: "Udaipur", state: "Rajasthan", image: "🏯" },
  { id: "bangalore", name: "Bangalore", state: "Karnataka", image: "💻" },
  { id: "chennai", name: "Chennai", state: "Tamil Nadu", image: "🛕" },
  { id: "kolkata", name: "Kolkata", state: "West Bengal", image: "🌉" },
  { id: "hyderabad", name: "Hyderabad", state: "Telangana", image: "🍗" },
  { id: "amritsar", name: "Amritsar", state: "Punjab", image: "🙏" },
  { id: "rishikesh", name: "Rishikesh", state: "Uttarakhand", image: "🧘" },
  { id: "shimla", name: "Shimla", state: "Himachal Pradesh", image: "🏔️" },
  { id: "manali", name: "Manali", state: "Himachal Pradesh", image: "❄️" },
  { id: "darjeeling", name: "Darjeeling", state: "West Bengal", image: "🍵" },
  { id: "mysore", name: "Mysore", state: "Karnataka", image: "👑" },
];

const TripPlanner = () => {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [travelers, setTravelers] = useState("1");
  const [travelMode, setTravelMode] = useState<string>("");

  const handlePlanTrip = () => {
    navigate("/budget-estimator", {
      state: {
        origin,
        destination,
        startDate,
        endDate,
        travelers,
        travelMode,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display text-xl font-bold">Plan Your Journey</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Where will your next{" "}
            <span className="text-gradient-primary">adventure</span> take you?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose from India's most beautiful destinations and let us help you
            plan the perfect trip.
          </p>
        </motion.div>

        {/* Popular Cities Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h3 className="font-display text-xl font-semibold mb-6">
            Popular Destinations
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {indianCities.slice(0, 12).map((city, index) => (
              <motion.button
                key={city.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDestination(city.id)}
                className={cn(
                  "p-4 rounded-2xl border-2 transition-all text-center",
                  destination === city.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                )}
              >
                <span className="text-3xl mb-2 block">{city.image}</span>
                <span className="font-medium text-sm">{city.name}</span>
                <span className="text-xs text-muted-foreground block">
                  {city.state}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Trip Details Form */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-3xl border border-border p-6 md:p-8 mb-8"
        >
          <h3 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Trip Details
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Origin */}
            <div className="space-y-2">
              <Label>From</Label>
              <Select value={origin} onValueChange={setOrigin}>
                <SelectTrigger>
                  <SelectValue placeholder="Select origin city" />
                </SelectTrigger>
                <SelectContent>
                  {indianCities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.image} {city.name}, {city.state}
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
                    <SelectItem key={city.id} value={city.id}>
                      {city.image} {city.name}, {city.state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Travelers */}
            <div className="space-y-2">
              <Label>Number of Travelers</Label>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-muted-foreground" />
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  className="w-24"
                />
                <span className="text-muted-foreground">travelers</span>
              </div>
            </div>

            {/* Travel Mode */}
            <div className="space-y-2">
              <Label>Preferred Travel Mode</Label>
              <div className="flex gap-2">
                {[
                  { id: "train", icon: Train, label: "Train" },
                  { id: "flight", icon: Plane, label: "Flight" },
                  { id: "car", icon: Car, label: "Car" },
                ].map((mode) => (
                  <Button
                    key={mode.id}
                    type="button"
                    variant={travelMode === mode.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTravelMode(mode.id)}
                    className="flex-1"
                  >
                    <mode.icon className="w-4 h-4 mr-1" />
                    {mode.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            variant="hero"
            size="xl"
            onClick={handlePlanTrip}
            disabled={!origin || !destination}
            className="group"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Get AI Budget Estimate
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="outline"
            size="xl"
            onClick={() => navigate("/book")}
          >
            Skip to Booking
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default TripPlanner;
