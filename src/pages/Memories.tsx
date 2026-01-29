import { motion } from "framer-motion";
import { useState, useEffect } from "react";
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
  DialogDescription,
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
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Memory {
  id: string;
  image_url: string;
  title: string | null;
  description: string | null;
  location: string | null;
  is_ai_generated: boolean;
  likes_count: number;
  created_at: string;
  isLiked?: boolean;
}

const Memories = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "feed">("grid");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newMemory, setNewMemory] = useState({ title: "", description: "", location: "", image_url: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMemories();
  }, [user]);

  const fetchMemories = async () => {
    if (!user) return;
    
    try {
      const { data: memoriesData, error: memoriesError } = await supabase
        .from("memories")
        .select("*")
        .order("created_at", { ascending: false });

      if (memoriesError) throw memoriesError;

      // Check which memories the user has liked
      const { data: likesData } = await supabase
        .from("post_likes")
        .select("memory_id")
        .eq("user_id", user.id);

      const likedMemoryIds = new Set(likesData?.map(l => l.memory_id) || []);

      setMemories((memoriesData || []).map(m => ({
        ...m,
        isLiked: likedMemoryIds.has(m.id)
      })));
    } catch (error) {
      console.error("Error fetching memories:", error);
      toast({ title: "Failed to load memories", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id: string) => {
    if (!user) return;
    
    const memory = memories.find(m => m.id === id);
    if (!memory) return;

    const isCurrentlyLiked = memory.isLiked;

    // Optimistic update
    setMemories(memories.map(m => 
      m.id === id 
        ? { ...m, isLiked: !isCurrentlyLiked, likes_count: isCurrentlyLiked ? m.likes_count - 1 : m.likes_count + 1 }
        : m
    ));

    try {
      if (isCurrentlyLiked) {
        await supabase
          .from("post_likes")
          .delete()
          .eq("user_id", user.id)
          .eq("memory_id", id);
      } else {
        await supabase
          .from("post_likes")
          .insert({ user_id: user.id, memory_id: id });
      }

      // Update likes count in memories table
      await supabase
        .from("memories")
        .update({ likes_count: isCurrentlyLiked ? memory.likes_count - 1 : memory.likes_count + 1 })
        .eq("id", id);
    } catch (error) {
      // Revert on error
      setMemories(memories.map(m => 
        m.id === id 
          ? { ...m, isLiked: isCurrentlyLiked, likes_count: memory.likes_count }
          : m
      ));
      console.error("Error updating like:", error);
    }
  };

  const handleSaveMemory = async () => {
    if (!user || !newMemory.image_url) {
      toast({ title: "Please add an image", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from("memories").insert({
        user_id: user.id,
        image_url: newMemory.image_url,
        title: newMemory.title || null,
        description: newMemory.description || null,
        location: newMemory.location || null,
        is_ai_generated: false,
      });

      if (error) throw error;

      setIsUploadOpen(false);
      setNewMemory({ title: "", description: "", location: "", image_url: "" });
      toast({ title: "Memory saved! 📸" });
      fetchMemories();
    } catch (error) {
      console.error("Error saving memory:", error);
      toast({ title: "Failed to save memory", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
                  <DialogDescription>Share a travel memory with the community</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Image URL</Label>
                    <Input
                      placeholder="https://..."
                      value={newMemory.image_url}
                      onChange={(e) => setNewMemory({ ...newMemory, image_url: e.target.value })}
                    />
                    {newMemory.image_url && (
                      <img src={newMemory.image_url} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      placeholder="Give it a title..."
                      value={newMemory.title}
                      onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="What's this memory about?"
                      value={newMemory.description}
                      onChange={(e) => setNewMemory({ ...newMemory, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      placeholder="Where was this?"
                      value={newMemory.location}
                      onChange={(e) => setNewMemory({ ...newMemory, location: e.target.value })}
                    />
                  </div>
                  <Button className="w-full" onClick={handleSaveMemory} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Save Memory
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4">
        {memories.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No memories yet</h3>
            <p className="text-muted-foreground mb-4">Start capturing your travel moments!</p>
            <Button variant="hero" onClick={() => setIsUploadOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Memory
            </Button>
          </div>
        ) : viewMode === "grid" ? (
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
                className="aspect-square relative group overflow-hidden"
              >
                <img
                  src={memory.image_url}
                  alt={memory.title || "Memory"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <span className="text-white flex items-center gap-1">
                    <Heart className="w-5 h-5" fill="white" /> {memory.likes_count}
                  </span>
                </div>
                {memory.is_ai_generated && (
                  <div className="absolute top-1 left-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    AI
                  </div>
                )}
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <div className="space-y-6 max-w-lg mx-auto">
            {memories.map((memory, index) => (
              <motion.article
                key={memory.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl border border-border overflow-hidden"
              >
                <div className="aspect-square relative">
                  <img
                    src={memory.image_url}
                    alt={memory.title || "Memory"}
                    className="w-full h-full object-cover"
                  />
                  {memory.is_ai_generated && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full">
                      AI Generated ✨
                    </div>
                  )}
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
                  <p className="font-medium">{memory.likes_count} likes</p>
                  {memory.title && (
                    <p className="text-sm mt-1">
                      <span className="font-medium">{memory.title}</span>
                    </p>
                  )}
                  {memory.description && (
                    <p className="text-sm text-muted-foreground mt-1">{memory.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {memory.location && `${memory.location} • `}{formatDate(memory.created_at)}
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
