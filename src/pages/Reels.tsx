import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Music2,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import BottomNav from "@/components/instagram/BottomNav";

interface Reel {
  id: string;
  video: string;
  thumbnail: string;
  user: { name: string; avatar: string; handle: string };
  caption: string;
  song: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

const reelsData: Reel[] = [
  {
    id: "1",
    video: "",
    thumbnail: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400",
    user: { name: "Travel Diaries", avatar: "https://i.pravatar.cc/150?img=1", handle: "@traveldiaries" },
    caption: "Sunrise at Taj Mahal 🕌✨ #Agra #India #Travel",
    song: "Kun Faya Kun - A.R. Rahman",
    likes: 12400,
    comments: 234,
    isLiked: false,
  },
  {
    id: "2",
    video: "",
    thumbnail: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400",
    user: { name: "Kerala Explorer", avatar: "https://i.pravatar.cc/150?img=3", handle: "@keralaexplorer" },
    caption: "Backwaters of Alleppey 🌴💚 Pure magic!",
    song: "Malare - Vijay Yesudas",
    likes: 8900,
    comments: 156,
    isLiked: true,
  },
  {
    id: "3",
    video: "",
    thumbnail: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400",
    user: { name: "Beach Bum", avatar: "https://i.pravatar.cc/150?img=5", handle: "@beachbumindia" },
    caption: "Goa sunsets hit different 🌅🏖️",
    song: "Tum Hi Ho - Arijit Singh",
    likes: 15600,
    comments: 342,
    isLiked: false,
  },
  {
    id: "4",
    video: "",
    thumbnail: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400",
    user: { name: "Rajasthan Tales", avatar: "https://i.pravatar.cc/150?img=7", handle: "@rajasthantales" },
    caption: "Hawa Mahal, the Palace of Winds 🏰",
    song: "Ghoomar - Shreya Ghoshal",
    likes: 9800,
    comments: 189,
    isLiked: false,
  },
];

const Reels = () => {
  const navigate = useNavigate();
  const [reels, setReels] = useState<Reel[]>(reelsData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const handleLike = (id: string) => {
    setReels(reels.map(r => 
      r.id === id 
        ? { ...r, isLiked: !r.isLiked, likes: r.isLiked ? r.likes - 1 : r.likes + 1 }
        : r
    ));
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const currentReel = reels[currentIndex];

  return (
    <div className="min-h-screen bg-black pb-16">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/80 to-transparent">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Button variant="ghost" size="icon" className="text-white" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display text-lg font-bold text-white">Reels</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Reels Container */}
      <div className="h-screen snap-y snap-mandatory overflow-y-scroll scrollbar-hide">
        {reels.map((reel, index) => (
          <div
            key={reel.id}
            className="h-screen snap-start relative flex items-center justify-center"
          >
            {/* Background Image/Video */}
            <div className="absolute inset-0">
              <img
                src={reel.thumbnail}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Play/Pause Overlay */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 z-10 flex items-center justify-center"
            >
              <AnimatePresence>
                {!isPlaying && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="w-20 h-20 rounded-full bg-black/50 flex items-center justify-center"
                  >
                    <Play className="w-10 h-10 text-white ml-1" fill="white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Right Side Actions */}
            <div className="absolute right-4 bottom-32 z-20 flex flex-col items-center gap-6">
              <button onClick={() => handleLike(reel.id)} className="flex flex-col items-center">
                <motion.div
                  whileTap={{ scale: 1.3 }}
                  className={`w-12 h-12 rounded-full bg-black/30 flex items-center justify-center ${reel.isLiked ? 'text-red-500' : 'text-white'}`}
                >
                  <Heart className="w-7 h-7" fill={reel.isLiked ? "currentColor" : "none"} />
                </motion.div>
                <span className="text-white text-xs mt-1">{formatNumber(reel.likes)}</span>
              </button>
              
              <button className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center text-white">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <span className="text-white text-xs mt-1">{formatNumber(reel.comments)}</span>
              </button>
              
              <button className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center text-white">
                  <Share2 className="w-7 h-7" />
                </div>
                <span className="text-white text-xs mt-1">Share</span>
              </button>

              <button onClick={() => setIsMuted(!isMuted)}>
                <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center text-white">
                  {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </div>
              </button>
            </div>

            {/* Bottom Info */}
            <div className="absolute left-4 right-20 bottom-24 z-20">
              {/* User */}
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={reel.user.avatar}
                  alt={reel.user.name}
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <div>
                  <p className="text-white font-semibold">{reel.user.name}</p>
                  <p className="text-white/70 text-sm">{reel.user.handle}</p>
                </div>
                <Button size="sm" variant="outline" className="ml-2 text-white border-white hover:bg-white/20">
                  Follow
                </Button>
              </div>

              {/* Caption */}
              <p className="text-white text-sm mb-3">{reel.caption}</p>

              {/* Song */}
              <div className="flex items-center gap-2">
                <Music2 className="w-4 h-4 text-white" />
                <p className="text-white/80 text-xs">{reel.song}</p>
              </div>
            </div>

            {/* Progress Indicators */}
            <div className="absolute top-16 left-4 right-4 flex gap-1">
              {reels.map((_, i) => (
                <div
                  key={i}
                  className={`h-0.5 flex-1 rounded-full ${i === index ? 'bg-white' : 'bg-white/30'}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default Reels;
