import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Play, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import ReelCard from "@/components/instagram/ReelCard";
import keralaImage from "@/assets/kerala-backwaters.jpg";
import jaipurImage from "@/assets/jaipur-palace.jpg";
import travelersImage from "@/assets/travelers-meetup.jpg";

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

const ShortReelsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [reels, setReels] = useState<Reel[]>([
    {
      id: "1",
      username: "wanderlust_india",
      avatar: keralaImage,
      thumbnail: keralaImage,
      caption: "Sunset at Kerala Backwaters 🌅 The most peaceful experience ever! #kerala #travel",
      likes: 2340,
      comments: 145,
      audio: "Peaceful Waves - Nature Sounds",
    },
    {
      id: "2",
      username: "pink_city_vibes",
      avatar: jaipurImage,
      thumbnail: jaipurImage,
      caption: "Pink City Magic ✨ Jaipur never fails to amaze #jaipur #rajasthan",
      likes: 1890,
      comments: 89,
      audio: "Rajasthani Folk - Traditional",
    },
    {
      id: "3",
      username: "travel_tribe",
      avatar: travelersImage,
      thumbnail: travelersImage,
      caption: "Met the most amazing people on this trip! 🌍 #travelfriends #backpacking",
      likes: 3200,
      comments: 234,
      audio: "Adventure Time - Indie",
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    caption: "",
    thumbnail: "",
    video: "",
    audio: "",
  });

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, thumbnail: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, video: url }));
      toast.success("Video uploaded!");
    }
  };

  const handleSubmit = () => {
    if (!formData.caption || !formData.thumbnail) {
      toast.error("Please add a caption and thumbnail");
      return;
    }

    const newReel: Reel = {
      id: Date.now().toString(),
      username: "you",
      avatar: formData.thumbnail,
      thumbnail: formData.thumbnail,
      video: formData.video,
      caption: formData.caption,
      likes: 0,
      comments: 0,
      audio: formData.audio || "Original Audio",
    };

    setReels(prev => [newReel, ...prev]);
    setFormData({ caption: "", thumbnail: "", video: "", audio: "" });
    setIsDialogOpen(false);
    toast.success("Reel uploaded! 🎬");
  };

  const handleLike = (id: string) => {
    setReels(prev => prev.map(r =>
      r.id === id ? { ...r, isLiked: !r.isLiked, likes: r.isLiked ? r.likes - 1 : r.likes + 1 } : r
    ));
  };

  const handleComment = (id: string) => {
    toast.info("Comments coming soon!");
  };

  const handleShare = (id: string) => {
    toast.success("Link copied to clipboard!");
  };

  return (
    <section id="reels" className="py-24 bg-background relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold tracking-wider uppercase text-sm">
            Travel Stories
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            <span className="text-gradient">Reels</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Share your travel moments in short, captivating clips
          </p>

          <Button variant="hero" size="lg" onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Create Reel
          </Button>
        </motion.div>

        {/* Reels Grid - Instagram style horizontal scroll on mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:overflow-visible"
        >
          {reels.map((reel, index) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.05 * index }}
              className="flex-shrink-0 w-[280px] md:w-auto"
            >
              <ReelCard
                reel={reel}
                onLike={handleLike}
                onComment={handleComment}
                onShare={handleShare}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Create Reel Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">Create new reel</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Thumbnail Upload */}
              <div>
                <Label>Cover Image *</Label>
                {formData.thumbnail ? (
                  <div className="relative aspect-[9/16] rounded-lg overflow-hidden mt-2">
                    <img
                      src={formData.thumbnail}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, thumbnail: "" }))}
                      className="absolute top-2 right-2 p-1 bg-background/80 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center aspect-[9/16] border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors mt-2">
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Upload cover image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleThumbnailUpload}
                    />
                  </label>
                )}
              </div>

              {/* Video Upload */}
              <div>
                <Label>Video (optional)</Label>
                <label className="flex items-center gap-2 p-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors mt-2">
                  <Play className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {formData.video ? "Video uploaded ✓" : "Add video file"}
                  </span>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleVideoUpload}
                  />
                </label>
              </div>

              {/* Caption */}
              <div>
                <Label htmlFor="caption">Caption *</Label>
                <Textarea
                  id="caption"
                  placeholder="Write a caption... #travel #adventure"
                  value={formData.caption}
                  onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
                  className="resize-none mt-2"
                  rows={3}
                />
              </div>

              {/* Audio */}
              <div>
                <Label htmlFor="audio">Audio name</Label>
                <Input
                  id="audio"
                  placeholder="Original Audio"
                  value={formData.audio}
                  onChange={(e) => setFormData(prev => ({ ...prev, audio: e.target.value }))}
                  className="mt-2"
                />
              </div>

              <Button onClick={handleSubmit} className="w-full" disabled={!formData.thumbnail}>
                Share Reel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default ShortReelsSection;
