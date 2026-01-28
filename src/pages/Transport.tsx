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
  Search,
  ArrowRightLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import BottomNav from "@/components/instagram/BottomNav";

const transportModes = [
  { id: "flight", icon: Plane, name: "Flights", color: "bg-blue-500" },
  { id: "train", icon: Train, name: "Trains", color: "bg-green-500" },
  { id: "bus", icon: Bus, name: "Buses", color: "bg-orange-500" },
  { id: "car", icon: Car, name: "Cars", color: "bg-purple-500" },
  { id: "cruise", icon: Ship, name: "Cruises", color: "bg-teal-500" },
];

const popularRoutes = [
  { from: "Delhi", to: "Mumbai", price: "₹2,499", mode: "flight" },
  { from: "Mumbai", to: "Goa", price: "₹899", mode: "train" },
  { from: "Bangalore", to: "Chennai", price: "₹499", mode: "bus" },
  { from: "Delhi", to: "Jaipur", price: "₹1,999", mode: "car" },
];

const indianCities = [
  "Delhi", "Mumbai", "Jaipur", "Goa", "Kerala", "Varanasi", "Agra", 
  "Udaipur", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Amritsar",
  "Rishikesh", "Shimla", "Manali", "Darjeeling", "Mysore"
];

const Transport = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState("flight");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState<Date>();

  const handleSearch = () => {
    navigate("/book", { state: { from, to, date, mode: selectedMode } });
  };

  const swapCities = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display text-lg font-bold">Book Transport</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Transport Mode Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide"
        >
          {transportModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all",
                selectedMode === mode.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <mode.icon className="w-4 h-4" />
              {mode.name}
            </button>
          ))}
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border border-border p-4 mb-6"
        >
          <div className="space-y-4">
            {/* From/To with Swap */}
            <div className="relative">
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">From</Label>
                  <Select value={from} onValueChange={setFrom}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianCities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">To</Label>
                  <Select value={to} onValueChange={setTo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianCities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Swap Button */}
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-background"
                onClick={swapCities}
              >
                <ArrowRightLeft className="w-4 h-4" />
              </Button>
            </div>

            {/* Date */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Date</Label>
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
                    {date ? format(date, "PPP") : "Select date"}
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

            {/* Search Button */}
            <Button
              variant="hero"
              className="w-full"
              onClick={handleSearch}
              disabled={!from || !to}
            >
              <Search className="w-4 h-4 mr-2" />
              Search {transportModes.find(m => m.id === selectedMode)?.name}
            </Button>
          </div>
        </motion.div>

        {/* Popular Routes */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-display text-lg font-semibold mb-4">Popular Routes</h2>
          <div className="space-y-3">
            {popularRoutes.map((route, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                onClick={() => {
                  setFrom(route.from);
                  setTo(route.to);
                  setSelectedMode(route.mode);
                }}
                className="w-full bg-card rounded-xl border border-border p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-white",
                    transportModes.find(m => m.id === route.mode)?.color
                  )}>
                    {(() => {
                      const Mode = transportModes.find(m => m.id === route.mode)?.icon;
                      return Mode ? <Mode className="w-5 h-5" /> : null;
                    })()}
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{route.from} → {route.to}</p>
                    <p className="text-sm text-muted-foreground">
                      {transportModes.find(m => m.id === route.mode)?.name}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-primary">{route.price}</span>
              </motion.button>
            ))}
          </div>
        </motion.section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Transport;
