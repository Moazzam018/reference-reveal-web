import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, Grid3X3, Bookmark } from "lucide-react";
import { toast } from "sonner";
import StoriesBar from "@/components/instagram/StoriesBar";
import PostCard from "@/components/instagram/PostCard";
import CreatePostDialog from "@/components/instagram/CreatePostDialog";
import heroImage from "@/assets/hero-train.jpg";
import keralaImage from "@/assets/kerala-backwaters.jpg";
import jaipurImage from "@/assets/jaipur-palace.jpg";
import travelersImage from "@/assets/travelers-meetup.jpg";

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

interface Story {
  id: string;
  username: string;
  avatar: string;
  hasUnread?: boolean;
}

const MemoryGallerySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [viewMode, setViewMode] = useState<'feed' | 'grid'>('feed');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [stories] = useState<Story[]>([
    { id: "1", username: "kerala_dreams", avatar: keralaImage, hasUnread: true },
    { id: "2", username: "jaipur_tales", avatar: jaipurImage, hasUnread: true },
    { id: "3", username: "train_journeys", avatar: heroImage, hasUnread: false },
    { id: "4", username: "backpackers", avatar: travelersImage, hasUnread: true },
  ]);

  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      username: "wanderlust_express",
      avatar: heroImage,
      image: heroImage,
      caption: "There's something magical about train journeys through the mountains 🚂✨ The mist, the curves, the endless views... #traintravel #india #wanderlust",
      location: "Himalayan Railways",
      likes: 1562,
      comments: 89,
      timeAgo: "2 hours ago",
    },
    {
      id: "2",
      username: "kerala_backwaters",
      avatar: keralaImage,
      image: keralaImage,
      caption: "Floating through paradise 🌴 Kerala's backwaters are a dream come true. The houseboat experience is something everyone should try at least once! #kerala #backwaters #incredibleindia",
      location: "Alleppey, Kerala",
      likes: 2341,
      comments: 156,
      timeAgo: "5 hours ago",
    },
    {
      id: "3",
      username: "pink_city_diaries",
      avatar: jaipurImage,
      image: jaipurImage,
      caption: "Lost in the grandeur of Jaipur 🏰 Every corner tells a story of royalty and heritage. The architecture here is absolutely breathtaking! #jaipur #rajasthan #heritage",
      location: "Jaipur, Rajasthan",
      likes: 1893,
      comments: 67,
      timeAgo: "1 day ago",
    },
  ]);

  const handleLike = (id: string) => {
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p
    ));
  };

  const handleSave = (id: string) => {
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, isSaved: !p.isSaved } : p
    ));
    toast.success("Saved to collection");
  };

  const handleComment = (id: string) => {
    toast.info("Comments coming soon!");
  };

  const handleShare = (id: string) => {
    toast.success("Link copied!");
  };

  const handleDelete = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    toast.success("Post deleted");
  };

  const handleCreatePost = (data: { image: string; caption: string; location: string }) => {
    if (!data.image) {
      toast.error("Please add an image");
      return;
    }

    const newPost: Post = {
      id: Date.now().toString(),
      username: "you",
      avatar: data.image,
      image: data.image,
      caption: data.caption,
      location: data.location,
      likes: 0,
      comments: 0,
      timeAgo: "Just now",
    };

    setPosts(prev => [newPost, ...prev]);
    setIsCreateDialogOpen(false);
    toast.success("Posted! 📸");
  };

  const handleViewStory = (story: Story) => {
    toast.info(`Viewing ${story.username}'s story`);
  };

  return (
    <section id="memories" className="py-24 bg-card relative overflow-hidden" ref={ref}>
      <div className="container mx-auto px-4 relative z-10 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <span className="text-primary font-semibold tracking-wider uppercase text-sm">
            Your Feed
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Memory <span className="text-gradient">Gallery</span>
          </h2>
        </motion.div>

        {/* Stories Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 p-4 bg-background rounded-xl border border-border"
        >
          <StoriesBar
            stories={stories}
            onAddStory={() => setIsCreateDialogOpen(true)}
            onViewStory={handleViewStory}
          />
        </motion.div>

        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex items-center justify-between mb-6"
        >
          <Button variant="hero" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'feed' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('feed')}
            >
              <Bookmark className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Posts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={viewMode === 'feed' ? 'space-y-6' : 'grid grid-cols-3 gap-1'}
        >
          {posts.map((post, index) => (
            viewMode === 'feed' ? (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.05 * index }}
              >
                <PostCard
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                  onShare={handleShare}
                  onSave={handleSave}
                  onDelete={handleDelete}
                />
              </motion.div>
            ) : (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.03 * index }}
                className="aspect-square cursor-pointer overflow-hidden"
                onClick={() => setViewMode('feed')}
              >
                <img
                  src={post.image}
                  alt={post.caption}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </motion.div>
            )
          ))}
        </motion.div>

        {/* Create Post Dialog */}
        <CreatePostDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={handleCreatePost}
        />
      </div>
    </section>
  );
};

export default MemoryGallerySection;
