import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, TrendingDown } from "lucide-react";

const platforms = [
  { name: "MakeMyTrip", price: 2700, isTraeverly: false },
  { name: "Goibibo", price: 2400, isTraeverly: false },
  { name: "Booking.com", price: 2600, isTraeverly: false },
  { name: "Traverly", price: 2400, isTraeverly: true, isBest: true },
];

const PricingComparison = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const maxPrice = Math.max(...platforms.map((p) => p.price));

  return (
    <section className="py-24 bg-gradient-warm relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Price Transparency
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
            Always the <span className="text-gradient-primary">Best Deal</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our intelligent search aggregates rates from multiple partners,
            ensuring you always find the best deal without comparing dozens of
            sites.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-card rounded-3xl shadow-elevated p-8 md:p-12 border border-border">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-display text-xl md:text-2xl font-semibold">
                Sample Mid-Range Hotel Search
              </h3>
              <span className="text-muted-foreground text-sm">per night</span>
            </div>

            <div className="space-y-4">
              {platforms.map((platform, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className={`relative rounded-xl p-4 ${
                    platform.isBest
                      ? "bg-primary/10 border-2 border-primary"
                      : "bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-semibold ${
                          platform.isBest ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {platform.name}
                      </span>
                      {platform.isBest && (
                        <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center gap-1">
                          <TrendingDown className="w-3 h-3" /> Best Price
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-lg font-bold ${
                        platform.isBest ? "text-primary" : "text-foreground"
                      }`}
                    >
                      ₹{platform.price.toLocaleString()}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={
                        isInView
                          ? { width: `${(platform.price / maxPrice) * 100}%` }
                          : {}
                      }
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className={`h-full rounded-full ${
                        platform.isBest ? "bg-gradient-sunset" : "bg-muted-foreground/30"
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <p className="text-center text-muted-foreground text-sm mt-8">
              * Prices are illustrative based on market data
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingComparison;
