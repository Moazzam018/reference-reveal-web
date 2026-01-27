import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Send, Music2, Play, Pause } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Reel {
  id: string;
  username: string;
  avatar: string;
  thumbnail: string;
  video?: string;
  caption: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  audio?: string;
}

interface ReelCardProps {
  reel: Reel;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
  onShare: (id: string) => void;
  isActive?: boolean;
}

const ReelCard = ({ reel, onLike, onComment, onShare, isActive = false }: ReelCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHeart, setShowHeart] = useState(false);

  const handleDoubleClick = () => {
    if (!reel.isLiked) {
      onLike(reel.id);
    }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative aspect-[9/16] bg-card rounded-2xl overflow-hidden group"
    >
      {/* Video/Image */}
      <div 
        className="absolute inset-0 cursor-pointer"
        onDoubleClick={handleDoubleClick}
        onClick={togglePlay}
      >
        {reel.video && isPlaying ? (
          <video
            src={reel.video}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <img
            src={reel.thumbnail}
            alt={reel.caption}
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Play/Pause indicator */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/20"
            >
              <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Double-tap heart */}
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <Heart className="w-24 h-24 text-white fill-white drop-shadow-lg" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none" />

      {/* Right side actions */}
      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onLike(reel.id)}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Heart className={`w-5 h-5 text-white ${reel.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </div>
          <span className="text-xs text-white font-medium">{reel.likes}</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onComment(reel.id)}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs text-white font-medium">{reel.comments}</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onShare(reel.id)}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Send className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs text-white font-medium">Share</span>
        </motion.button>

        {/* Audio disc */}
        <motion.div
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 rounded-full border-2 border-white/50 overflow-hidden mt-2"
        >
          <img
            src={reel.avatar}
            alt="Audio"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-4 left-3 right-16">
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="w-8 h-8 ring-2 ring-white/50">
            <AvatarImage src={reel.avatar} />
            <AvatarFallback>{reel.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold text-white">{reel.username}</span>
        </div>
        <p className="text-sm text-white/90 line-clamp-2">{reel.caption}</p>
        {reel.audio && (
          <div className="flex items-center gap-2 mt-2">
            <Music2 className="w-3 h-3 text-white" />
            <p className="text-xs text-white/70 truncate">{reel.audio}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ReelCard;
