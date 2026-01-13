import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Layers, Zap, Server, Cloud } from "lucide-react";

const architectureFeatures = [
  {
    icon: Layers,
    title: "Scales Independently",
    description:
      "Each function (bookings, media, social) can scale independently, ensuring smooth experience even during peak demand.",
  },
  {
    icon: Zap,
    title: "High Availability",
    description:
      "A containerized, load-balanced system designed for real-world reliability and uptime.",
  },
  {
    icon: Server,
    title: "Microservices Architecture",
    description:
      "Built on robust, cloud-native microservices for massive, reliable growth.",
  },
  {
    icon: Cloud,
    title: "Future-Proof",
    description:
      "API-driven modules allow for rapid development and integration of new features.",
  },
];

const ArchitectureSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="about"
      className="py-24 bg-secondary text-secondary-foreground relative overflow-hidden"
      ref={ref}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-medium text-sm uppercase tracking-wider">
            Built to Scale
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
            Designed for{" "}
            <span className="text-accent">Millions of Users</span>
          </h2>
          <p className="text-secondary-foreground/70 text-lg max-w-2xl mx-auto">
            Traverly is built on a robust, cloud-native architecture. This is
            the foundation for massive, reliable growth.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {architectureFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-secondary-foreground/5 backdrop-blur-sm rounded-2xl p-8 border border-secondary-foreground/10 h-full hover:bg-secondary-foreground/10 transition-all duration-300 hover:-translate-y-2">
                <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center mb-6 group-hover:bg-accent/30 transition-colors">
                  <feature.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-secondary-foreground/70 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArchitectureSection;
