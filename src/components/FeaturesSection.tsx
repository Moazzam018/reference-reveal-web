import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CalendarDays, Camera, Users, Film, Check } from "lucide-react";
import jaipurImage from "@/assets/jaipur-palace.jpg";
import keralaImage from "@/assets/kerala-backwaters.jpg";
import meetupImage from "@/assets/travelers-meetup.jpg";

const features = [
  {
    icon: CalendarDays,
    title: "Book & Plan",
    subtitle: "Smart, multi-modal travel planning and booking.",
    description:
      "Set your budget and preferences—Traverly suggests day-by-day plans. Find the best combination of flights, trains, and buses, all in one place.",
    points: [
      "Smart Itinerary Generator",
      "Multi-Modal Search",
      "Integrated Expense Tracking",
    ],
    image: jaipurImage,
    gradient: "from-primary to-accent",
  },
  {
    icon: Camera,
    title: "Photo Journal",
    subtitle: "An automated, visual diary of your travels.",
    description:
      "Forget manually organizing photos. Traverly's Photo Journal creates a rich, visual diary of your journey as it happens.",
    points: [
      "Auto-Geotagging",
      "Visual Travel Diary",
      "Highlighted Stats & Memories",
    ],
    image: keralaImage,
    gradient: "from-secondary to-primary",
  },
  {
    icon: Users,
    title: "Social Meetups",
    subtitle: "A built-in community to connect on the go.",
    description:
      "Travel is about connection. Find fellow travelers and locals to share experiences and create new adventures together.",
    points: [
      "Discover Travelers Nearby",
      "Propose & Join Activities",
      "Secure In-App Chat",
    ],
    image: meetupImage,
    gradient: "from-accent to-secondary",
  },
  {
    icon: Film,
    title: "Travel Reels",
    subtitle: "Cinematic, shareable stories of your adventures.",
    description:
      "The app automatically assembles photos and videos into a shareable, cinematic Trip Reel, turning your memories into a compelling narrative.",
    points: [
      "Auto-Assembled Trip Reels",
      "One-Tap Sharing",
      "Cinematic Templates",
    ],
    image: keralaImage,
    gradient: "from-primary to-secondary",
  },
];

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="features"
      className="py-24 bg-background relative overflow-hidden"
      ref={ref}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            The Solution
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
            The Four Pillars of{" "}
            <span className="text-gradient-primary">Traverly</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            One app for the entire journey. We integrate planning, booking,
            social networking, and media-sharing.
          </p>
        </motion.div>

        <div className="space-y-32">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } items-center gap-12 lg:gap-20`}
            >
              {/* Image */}
              <div className="flex-1 w-full">
                <div className="relative group">
                  <div
                    className={`absolute -inset-4 bg-gradient-to-r ${feature.gradient} rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500`}
                  />
                  <div className="relative rounded-2xl overflow-hidden shadow-elevated">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-80 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />

                    {/* Floating icon */}
                    <div
                      className={`absolute top-6 left-6 w-14 h-14 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-glow`}
                    >
                      <feature.icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 w-full">
                <h3 className="font-display text-3xl md:text-4xl font-bold mb-3">
                  {feature.title}
                </h3>
                <p className="text-primary font-medium mb-4">
                  {feature.subtitle}
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  {feature.description}
                </p>
                <ul className="space-y-4">
                  {feature.points.map((point, pointIndex) => (
                    <li
                      key={pointIndex}
                      className="flex items-center gap-3 text-foreground"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
