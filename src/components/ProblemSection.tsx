import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Smartphone, Camera, Users, Calculator, X } from "lucide-react";

const problems = [
  {
    icon: Smartphone,
    title: "Juggling Multiple Platforms",
    description: "Switching between booking apps for flights, trains, and hotels.",
  },
  {
    icon: Camera,
    title: "Lost Memories",
    description: "Photos scattered across your camera roll with no organization.",
  },
  {
    icon: Users,
    title: "Disconnected Travelers",
    description: "Struggling to find and connect with fellow explorers.",
  },
  {
    icon: Calculator,
    title: "Manual Planning",
    description: "Piecing together itineraries and tracking expenses by hand.",
  },
];

const ProblemSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="problem" className="py-24 bg-gradient-warm relative overflow-hidden" ref={ref}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            The Problem
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
            The Modern Traveler's{" "}
            <span className="text-gradient-primary">Dilemma</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Today's traveler navigates a fragmented digital landscape. Planning,
            booking, sharing, and connecting each require a different app.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-2 border border-border h-full">
                <div className="relative mb-6">
                  <div className="w-14 h-14 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <problem.icon className="w-7 h-7 text-destructive" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center">
                    <X className="w-4 h-4 text-destructive" />
                  </div>
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">
                  {problem.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {problem.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
