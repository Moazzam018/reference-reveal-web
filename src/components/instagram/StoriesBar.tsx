import { Plus } from "lucide-react";
import { motion } from "framer-motion";

interface Story {
  id: string;
  username: string;
  avatar: string;
  hasUnread?: boolean;
}

interface StoriesBarProps {
  stories: Story[];
  onAddStory?: () => void;
  onViewStory?: (story: Story) => void;
}

const StoriesBar = ({ stories, onAddStory, onViewStory }: StoriesBarProps) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {/* Add Story Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAddStory}
        className="flex flex-col items-center gap-2 flex-shrink-0"
      >
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-primary/50">
            <Plus className="w-6 h-6 text-primary" />
          </div>
        </div>
        <span className="text-xs text-muted-foreground">Your Story</span>
      </motion.button>

      {/* Stories */}
      {stories.map((story, index) => (
        <motion.button
          key={story.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onViewStory?.(story)}
          className="flex flex-col items-center gap-2 flex-shrink-0"
        >
          <div className={`p-0.5 rounded-full ${story.hasUnread ? 'bg-gradient-to-tr from-primary via-accent to-secondary' : 'bg-muted'}`}>
            <div className="p-0.5 bg-background rounded-full">
              <img
                src={story.avatar}
                alt={story.username}
                className="w-14 h-14 rounded-full object-cover"
              />
            </div>
          </div>
          <span className="text-xs text-foreground max-w-[60px] truncate">{story.username}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default StoriesBar;
