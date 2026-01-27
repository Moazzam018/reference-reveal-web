import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Post {
  id: string;
  username: string;
  avatar: string;
  image: string;
  caption: string;
  location?: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  isSaved?: boolean;
  timeAgo: string;
}

interface PostCardProps {
  post: Post;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
  onShare: (id: string) => void;
  onSave: (id: string) => void;
  onDelete?: (id: string) => void;
}

const PostCard = ({ post, onLike, onComment, onShare, onSave, onDelete }: PostCardProps) => {
  const [showHeart, setShowHeart] = useState(false);

  const handleDoubleClick = () => {
    if (!post.isLiked) {
      onLike(post.id);
    }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-lg overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8 ring-2 ring-primary/50">
            <AvatarImage src={post.avatar} />
            <AvatarFallback>{post.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{post.username}</p>
            {post.location && (
              <p className="text-xs text-muted-foreground">{post.location}</p>
            )}
          </div>
        </div>
        <button 
          onClick={() => onDelete?.(post.id)}
          className="p-1 hover:bg-muted rounded-full transition-colors"
        >
          <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Image with double-tap like */}
      <div 
        className="relative aspect-square cursor-pointer"
        onDoubleClick={handleDoubleClick}
      >
        <img
          src={post.image}
          alt={post.caption}
          className="w-full h-full object-cover"
        />
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Heart className="w-24 h-24 text-white fill-white drop-shadow-lg" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onLike(post.id)}
              className="hover:opacity-60 transition-opacity"
            >
              <Heart className={`w-6 h-6 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onComment(post.id)}
              className="hover:opacity-60 transition-opacity"
            >
              <MessageCircle className="w-6 h-6" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onShare(post.id)}
              className="hover:opacity-60 transition-opacity"
            >
              <Send className="w-6 h-6" />
            </motion.button>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onSave(post.id)}
            className="hover:opacity-60 transition-opacity"
          >
            <Bookmark className={`w-6 h-6 ${post.isSaved ? 'fill-foreground' : ''}`} />
          </motion.button>
        </div>

        {/* Likes */}
        <p className="text-sm font-semibold mb-1">{post.likes.toLocaleString()} likes</p>

        {/* Caption */}
        <p className="text-sm">
          <span className="font-semibold mr-1">{post.username}</span>
          {post.caption}
        </p>

        {/* Comments link */}
        {post.comments > 0 && (
          <button 
            onClick={() => onComment(post.id)}
            className="text-sm text-muted-foreground mt-1"
          >
            View all {post.comments} comments
          </button>
        )}

        {/* Time */}
        <p className="text-xs text-muted-foreground mt-2">{post.timeAgo}</p>
      </div>
    </motion.div>
  );
};

export default PostCard;
