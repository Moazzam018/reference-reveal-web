import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Plus, Upload, X, Heart, MessageCircle, Share2, Pause } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import keralaImage from "@/assets/kerala-backwaters.jpg";
import jaipurImage from "@/assets/jaipur-palace.jpg";

interface Reel {
  id: string;
  title: string;
  location: string;
  thumbnail: string;
  video?: string;
  likes: number;
  comments: number;
  isPlaying?: boolean;
}

const ShortReelsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [reels, setReels] = useState<Reel[]>([
    {
      id: "1",
      title: "Sunset at Kerala Backwaters",
      location: "Kerala, India",
      thumbnail: keralaImage,
      likes: 234,
      comments: 45,
    },
    {
      id: "2",
      title: "Pink City Magic",
      location: "Jaipur, India",
      thumbnail: jaipurImage,
      likes: 189,
      comments: 32,
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    thumbnail: "",
    video: "",
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
    if (!formData.title || !formData.thumbnail) {
      toast.error("Please add a title and thumbnail");
      return;
    }
    
    const newReel: Reel = {
      id: Date.now().toString(),
      title: formData.title,
      location: formData.location || "Unknown Location",
      thumbnail: formData.thumbnail,
      video: formData.video,
      likes: 0,
      comments: 0,
    };
    
    setReels(prev => [newReel, ...prev]);
    setFormData({ title: "", location: "", thumbnail: "", video: "" });
    setIsDialogOpen(false);
    toast.success("Reel uploaded successfully!");
  };

  const removeReel = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setReels(prev => prev.filter(r => r.id !== id));
    toast.success("Reel removed");
  };

  const likeReel = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setReels(prev => prev.map(r => 
      r.id === id ? { ...r, likes: r.likes + 1 } : r
    ));
  };

  const openReel = (reel: Reel) => {
    setSelectedReel(reel);
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
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold tracking-wider uppercase text-sm">
            Travel Stories
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Short <span className="text-gradient">Reels</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Share your travel moments in short, captivating clips
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" size="xl" className="group">
                <Plus className="w-5 h-5 mr-2" />
                Upload Reel
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Upload New Reel
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Give your reel a title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Where was this recorded?"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Thumbnail *</Label>
                  <div className="mt-2">
                    <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                      <Upload className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {formData.thumbnail ? "Thumbnail uploaded" : "Upload thumbnail image"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleThumbnailUpload}
                      />
                    </label>
                    {formData.thumbnail && (
                      <img src={formData.thumbnail} alt="Thumbnail" className="mt-2 w-full h-32 object-cover rounded-lg" />
                    )}
                  </div>
                </div>
                <div>
                  <Label>Video (Optional)</Label>
                  <div className="mt-2">
                    <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                      <Play className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {formData.video ? "Video uploaded" : "Upload video file"}
                      </span>
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={handleVideoUpload}
                      />
                    </label>
                  </div>
                </div>
                <Button onClick={handleSubmit} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Reel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {reels.map((reel, index) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <Card
                className="relative aspect-[9/16] overflow-hidden group cursor-pointer"
                onClick={() => openReel(reel)}
              >
                <button
                  onClick={(e) => removeReel(reel.id, e)}
                  className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 rounded-full p-1"
                >
                  <X className="w-4 h-4 text-destructive" />
                </button>
                <img
                  src={reel.thumbnail}
                  alt={reel.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
                    <Play className="w-8 h-8 text-primary-foreground ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2">{reel.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{reel.location}</p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => likeReel(reel.id, e)}
                      className="flex items-center gap-1 text-xs hover:text-primary transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      {reel.likes}
                    </button>
                    <button className="flex items-center gap-1 text-xs hover:text-primary transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      {reel.comments}
                    </button>
                    <button className="flex items-center gap-1 text-xs hover:text-primary transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Full Screen Reel Viewer */}
        <Dialog open={!!selectedReel} onOpenChange={() => setSelectedReel(null)}>
          <DialogContent className="max-w-sm p-0 overflow-hidden bg-background/95 backdrop-blur-xl">
            {selectedReel && (
              <div className="relative aspect-[9/16]">
                {selectedReel.video ? (
                  <video
                    src={selectedReel.video}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={selectedReel.thumbnail}
                    alt={selectedReel.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-bold text-lg mb-2">{selectedReel.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedReel.location}</p>
                </div>
                <div className="absolute right-4 bottom-24 flex flex-col gap-4">
                  <button className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-background/50 backdrop-blur flex items-center justify-center">
                      <Heart className="w-5 h-5" />
                    </div>
                    <span className="text-xs">{selectedReel.likes}</span>
                  </button>
                  <button className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-background/50 backdrop-blur flex items-center justify-center">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <span className="text-xs">{selectedReel.comments}</span>
                  </button>
                  <button className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-background/50 backdrop-blur flex items-center justify-center">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <span className="text-xs">Share</span>
                  </button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default ShortReelsSection;
