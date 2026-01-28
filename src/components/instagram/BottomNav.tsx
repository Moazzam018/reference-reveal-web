import { motion } from "framer-motion";
import { Home, Search, PlusSquare, Film, User } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface BottomNavProps {
  onCreateClick?: () => void;
}

const BottomNav = ({ onCreateClick }: BottomNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getActiveFromPath = () => {
    const path = location.pathname;
    if (path === "/") return "home";
    if (path === "/book" || path === "/plan") return "search";
    if (path === "/features") return "reels";
    if (path === "/auth" || path === "/budget-estimator") return "profile";
    return "home";
  };

  const [active, setActive] = useState(getActiveFromPath());

  const navItems = [
    { id: "home", icon: Home, label: "Home", action: () => navigate("/") },
    { id: "search", icon: Search, label: "Search", action: () => navigate("/plan") },
    { id: "create", icon: PlusSquare, label: "Create", action: onCreateClick || (() => navigate("/book")) },
    { id: "reels", icon: Film, label: "Reels", action: () => navigate("/features") },
    { id: "profile", icon: User, label: "Profile", action: () => navigate("/auth") },
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
            onClick={() => {
              setActive(item.id);
              item.action?.();
            }}
            className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${
              active === item.id ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            <item.icon
              className={`w-6 h-6 ${item.id === "create" ? "stroke-[1.5]" : ""}`}
              fill={active === item.id && item.id !== "create" ? "currentColor" : "none"}
            />
          </motion.button>
        ))}
      </div>
    </motion.nav>
  );
};

export default BottomNav;
