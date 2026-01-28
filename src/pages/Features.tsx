import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Plane,
  Train,
  Hotel,
  Camera,
  Users,
  Sparkles,
  MapPin,
  Calendar,
  CreditCard,
  Shield,
  Zap,
  Heart,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Budget Estimator",
    description: "Get instant, personalized budget estimates for any trip using our advanced AI. Know exactly what to expect before you go.",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    icon: Plane,
    title: "Multi-Modal Booking",
    description: "Book flights, trains, buses, and cars all in one place. Compare prices across platforms instantly.",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: MapPin,
    title: "18+ Indian Cities",
    description: "From the Taj Mahal in Agra to the backwaters of Kerala, explore India's most beautiful destinations.",
    color: "bg-green-500/10 text-green-500",
  },
  {
    icon: Users,
    title: "Social Meetups",
    description: "Connect with fellow travelers. Join group trips, share experiences, and make lifelong friends.",
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    icon: Camera,
    title: "Travel Reels",
    description: "Share your journey through short videos. Inspire others and get inspired by authentic travel content.",
    color: "bg-pink-500/10 text-pink-500",
  },
  {
    icon: Hotel,
    title: "Accommodation Finder",
    description: "From luxury resorts to budget hostels, find the perfect place to stay with verified reviews.",
    color: "bg-teal-500/10 text-teal-500",
  },
  {
    icon: Calendar,
    title: "Trip Planner",
    description: "Plan your entire trip with our intuitive planner. Set dates, manage itineraries, and stay organized.",
    color: "bg-indigo-500/10 text-indigo-500",
  },
  {
    icon: CreditCard,
    title: "Best Price Guarantee",
    description: "We compare prices across multiple platforms to ensure you always get the best deal.",
    color: "bg-yellow-500/10 text-yellow-600",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Your transactions are protected with bank-grade security. Travel with peace of mind.",
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    icon: Zap,
    title: "Instant Confirmations",
    description: "Get booking confirmations instantly. No waiting, no uncertainty—just book and go.",
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    icon: Heart,
    title: "Memory Gallery",
    description: "Upload and preserve your travel memories. Create beautiful galleries with AI-enhanced photos.",
    color: "bg-rose-500/10 text-rose-500",
  },
  {
    icon: Train,
    title: "IRCTC Integration",
    description: "Book Indian Railways tickets directly. Real-time availability and PNR tracking included.",
    color: "bg-red-500/10 text-red-500",
  },
];

const Features = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display text-xl font-bold">Features</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
            Everything you need to{" "}
            <span className="text-gradient-primary">travel smarter</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Traverly combines booking, planning, and social features into one
            seamless experience. Here's what makes us different.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow"
            >
              <div
                className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}
              >
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Button
            variant="hero"
            size="xl"
            onClick={() => navigate("/plan")}
            className="group"
          >
            Start Planning Your Trip
            <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default Features;
