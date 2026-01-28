import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Plus,
  Heart,
  MessageCircle,
  Grid3X3,
  LayoutList,
  Sparkles,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import BottomNav from "@/components/instagram/BottomNav";
import { useToast } from "@/hooks/use-toast";

interface Memory {
  id: string;
  image: string;
  caption: string;
  location: string;
  date: string;
  likes: number;
  isLiked: boolean;
}

const initialMemories: Memory[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600",
    caption: "The Taj at dawn 🌅",
    location: "Agra, India",
    date: "Jan 15, 2026",
    likes: 234,
    isLiked: false,
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600",
    caption: "Floating through paradise",
    location: "Kerala Backwaters",
    date: "Jan 10, 2026",
    likes: 189,
    isLiked: true,
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600",
    caption: "Beach vibes only 🏖️",
    location: "Goa",
    date: "Jan 5, 2026",
    likes: 456,
    isLiked: false,
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600",
    caption: "Pink City magic",
    location: "Jaipur",
    date: "Dec 28, 2025",
    likes: 312,
    isLiked: true,
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=600",
    caption: "Temple serenity 🙏",
    location: "Varanasi",
    date: "Dec 20, 2025",
    likes: 278,
    isLiked: false,
  },
  {
    id: "6",
    image: "https://images.unsplash.com/photo-1585116938581-b3a1c9cd6a75?w=600",
    caption: "Mountain calling",
    location: "Manali",
    date: "Dec 15, 2025",
    likes: 423,
    isLiked: false,
  },
];

const Memories = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [memories, setMemories] = useState<Memory[]>(initialMemories);
  const [viewMode, setViewMode] = useState<"grid" | "feed">("grid");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleLike = (id: string) => {
    setMemories(memories.map(m => 
      m.id === id 
        ? { ...m, isLiked: !m.isLiked, likes: m.isLiked ? m.likes - 1 : m.likes + 1 }
        : m
    ));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-display text-lg font-bold">Memories</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode(viewMode === "grid" ? "feed" : "grid")}
            >
              {viewMode === "grid" ? <LayoutList className="w-5 h-5" /> : <Grid3X3 className="w-5 h-5" />}
            </Button>
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="hero">
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a Memory</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Photo</Label>
                    <div className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors">
                      <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Tap to upload</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Caption</Label>
                    <Textarea placeholder="What's this memory about?" />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input placeholder="Where was this?" />
                  </div>
                  <Button className="w-full" onClick={() => {
                    setIsUploadOpen(false);
                    toast({ title: "Memory saved! 📸" });
                  }}>
                    Save Memory
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4">
        {/* Grid View */}
        {viewMode === "grid" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-3 gap-1"
          >
            {memories.map((memory, index) => (
              <motion.button
                key={memory.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedImage(memory.id)}
                className="aspect-square relative group overflow-hidden"
              >
                <img
                  src={memory.image}
                  alt={memory.caption}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <span className="text-white flex items-center gap-1">
                    <Heart className="w-5 h-5" fill="white" /> {memory.likes}
                  </span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          /* Feed View */
          <div className="space-y-6 max-w-lg mx-auto">
            {memories.map((memory, index) => (
              <motion.article
                key={memory.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl border border-border overflow-hidden"
              >
                <div className="aspect-square">
                  <img
                    src={memory.image}
                    alt={memory.caption}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-4">
                      <button onClick={() => handleLike(memory.id)}>
                        <Heart
                          className={`w-6 h-6 ${memory.isLiked ? 'text-red-500' : 'text-foreground'}`}
                          fill={memory.isLiked ? "currentColor" : "none"}
                        />
                      </button>
                      <MessageCircle className="w-6 h-6" />
                    </div>
                  </div>
                  <p className="font-medium">{memory.likes} likes</p>
                  <p className="text-sm mt-1">
                    <span className="font-medium">{memory.caption}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {memory.location} • {memory.date}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* AI Generate Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="fixed bottom-20 right-4"
        >
          <Button
            variant="hero"
            size="lg"
            className="rounded-full shadow-lg"
            onClick={() => navigate("/create")}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            AI Generate
          </Button>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Memories;
