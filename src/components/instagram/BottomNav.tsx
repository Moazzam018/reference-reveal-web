import { motion } from "framer-motion";
import { Home, Search, PlusSquare, Film, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrollActive, setScrollActive] = useState<string | null>(null);
  
  // Section IDs mapped to nav items for scroll-spy on home page
  const sectionToNavMap: Record<string, string> = {
    "hero": "home",
    "problem": "home",
    "features": "search",
    "pricing": "search",
    "architecture": "reels",
    "cta": "profile",
  };

  const handleScroll = useCallback(() => {
    if (location.pathname !== "/" && location.pathname !== "/features") {
      setScrollActive(null);
      return;
    }

    const sections = ["hero", "problem", "features", "pricing", "architecture", "cta"];
    const scrollPosition = window.scrollY + window.innerHeight / 3;

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = document.getElementById(sections[i]);
      if (section && section.offsetTop <= scrollPosition) {
        setScrollActive(sectionToNavMap[sections[i]]);
        return;
      }
    }
    setScrollActive("home");
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "/features") {
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll(); // Initial check
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setScrollActive(null);
    }
  }, [location.pathname, handleScroll]);

  const getActiveFromPath = () => {
    const path = location.pathname;
    if (path === "/" || path === "/features") return scrollActive || "home";
    if (path === "/transport" || path === "/plan" || path === "/book") return "search";
    if (path === "/create") return "create";
    if (path === "/reels") return "reels";
    if (path === "/auth" || path === "/memories" || path === "/meetups" || path === "/budget-estimator") return "profile";
    return "home";
  };

  const active = getActiveFromPath();

  const navItems = [
    { id: "home", icon: Home, label: "Home", path: "/" },
    { id: "search", icon: Search, label: "Search", path: "/transport" },
    { id: "create", icon: PlusSquare, label: "Create", path: "/create" },
    { id: "reels", icon: Film, label: "Reels", path: "/reels" },
    { id: "profile", icon: User, label: "Profile", path: "/memories" },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border safe-area-bottom"
    >
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center w-16 h-full transition-colors duration-300 ${
              active === item.id ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            <motion.div
              animate={{ 
                scale: active === item.id ? 1.1 : 1,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <item.icon
                className={`w-6 h-6 ${item.id === "create" ? "stroke-[1.5]" : ""}`}
                fill={active === item.id && item.id !== "create" ? "currentColor" : "none"}
              />
            </motion.div>
            {active === item.id && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute bottom-1 w-1 h-1 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </motion.nav>
  );
};

export default BottomNav;
