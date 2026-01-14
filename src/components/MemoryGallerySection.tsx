import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Image as ImageIcon, Plus, Upload, X, Sparkles, MapPin, Calendar, Heart } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import heroImage from "@/assets/hero-train.jpg";
import keralaImage from "@/assets/kerala-backwaters.jpg";
import jaipurImage from "@/assets/jaipur-palace.jpg";

interface Memory {
  id: string;
  title: string;
  location: string;
  date: string;
  description: string;
  image: string;
  isAiGenerated?: boolean;
  likes: number;
}

const MemoryGallerySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [memories, setMemories] = useState<Memory[]>([
    {
      id: "1",
      title: "Journey Through the Mountains",
      location: "Himalayan Railways",
      date: "2026-01-10",
      description: "A breathtaking train ride through misty mountains",
      image: heroImage,
      isAiGenerated: false,
      likes: 156,
    },
    {
      id: "2",
      title: "Peaceful Backwaters",
      location: "Kerala, India",
      date: "2026-01-08",
      description: "Serene moments on a houseboat",
      image: keralaImage,
      isAiGenerated: false,
      likes: 98,
    },
    {
      id: "3",
      title: "Royal Heritage",
      location: "Jaipur, India",
      date: "2026-01-05",
      description: "Exploring the grandeur of Rajasthani palaces",
      image: jaipurImage,
      isAiGenerated: false,
      likes: 124,
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    date: "",
    description: "",
    image: "",
  });
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.image) {
      toast.error("Please add a title and image");
      return;
    }
    
    const newMemory: Memory = {
      id: Date.now().toString(),
      title: formData.title,
      location: formData.location || "Unknown Location",
      date: formData.date || new Date().toISOString().split('T')[0],
      description: formData.description,
      image: formData.image,
      isAiGenerated: false,
      likes: 0,
    };
    
    setMemories(prev => [newMemory, ...prev]);
    setFormData({ title: "", location: "", date: "", description: "", image: "" });
    setIsDialogOpen(false);
    toast.success("Memory added to your gallery!");
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please describe the image you want to generate");
      return;
    }
    
    setIsGenerating(true);
    // Simulate AI generation - in production, this would call an AI image API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For demo, use one of the existing images
    const demoImages = [heroImage, keralaImage, jaipurImage];
    const randomImage = demoImages[Math.floor(Math.random() * demoImages.length)];
    
    const newMemory: Memory = {
      id: Date.now().toString(),
      title: `AI: ${aiPrompt.substring(0, 30)}...`,
      location: "AI Generated",
      date: new Date().toISOString().split('T')[0],
      description: aiPrompt,
      image: randomImage,
      isAiGenerated: true,
      likes: 0,
    };
    
    setMemories(prev => [newMemory, ...prev]);
    setAiPrompt("");
    setIsAiDialogOpen(false);
    setIsGenerating(false);
    toast.success("AI image generated and added to your gallery!");
  };

  const removeMemory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMemories(prev => prev.filter(m => m.id !== id));
    toast.success("Memory removed");
  };

  const likeMemory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMemories(prev => prev.map(m => 
      m.id === id ? { ...m, likes: m.likes + 1 } : m
    ));
  };

  return (
    <section id="memories" className="py-24 bg-gradient-ocean relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary-foreground/80 font-semibold tracking-wider uppercase text-sm">
            Cherish Forever
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 text-primary-foreground">
            Memory <span className="text-secondary">Gallery</span>
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Upload your travel photos or create stunning AI-generated images
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center gap-4 mb-12 flex-wrap"
        >
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="xl" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 group">
                <Upload className="w-5 h-5 mr-2" />
                Upload Memory
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Upload New Memory
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Name your memory"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="Where was this?"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell the story behind this memory..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Photo *</Label>
                  <div className="mt-2">
                    <label className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                      <Upload className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {formData.image ? "Image uploaded" : "Click to upload your photo"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                    {formData.image && (
                      <img src={formData.image} alt="Preview" className="mt-2 w-full h-40 object-cover rounded-lg" />
                    )}
                  </div>
                </div>
                <Button onClick={handleSubmit} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Gallery
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="glass" size="xl" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 group">
                <Sparkles className="w-5 h-5 mr-2" />
                Generate with AI
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  AI Image Generator
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="prompt">Describe your dream travel scene</Label>
                  <Textarea
                    id="prompt"
                    placeholder="A serene beach at sunset with palm trees, golden sand, and calm turquoise waters..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Our AI will create a stunning travel image based on your description
                </p>
                <Button onClick={handleAiGenerate} className="w-full" disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 mr-2"
                      >
                        <Sparkles className="w-4 h-4" />
                      </motion.div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Image
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {memories.map((memory, index) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -8 }}
            >
              <Card
                className="overflow-hidden group cursor-pointer bg-card/90 backdrop-blur-sm border-primary-foreground/10"
                onClick={() => setSelectedMemory(memory)}
              >
                <button
                  onClick={(e) => removeMemory(memory.id, e)}
                  className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 rounded-full p-1"
                >
                  <X className="w-4 h-4 text-destructive" />
                </button>
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={memory.image}
                    alt={memory.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {memory.isAiGenerated && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-primary/90 text-primary-foreground text-xs rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      AI Generated
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">{memory.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <MapPin className="w-4 h-4" />
                    {memory.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Calendar className="w-4 h-4" />
                    {memory.date}
                  </div>
                  {memory.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{memory.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={(e) => likeMemory(memory.id, e)}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      {memory.likes}
                    </button>
                    <span className="text-xs text-muted-foreground">Click to view</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Memory Viewer Dialog */}
        <Dialog open={!!selectedMemory} onOpenChange={() => setSelectedMemory(null)}>
          <DialogContent className="max-w-3xl p-0 overflow-hidden">
            {selectedMemory && (
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-square md:aspect-auto">
                  <img
                    src={selectedMemory.image}
                    alt={selectedMemory.title}
                    className="w-full h-full object-cover"
                  />
                  {selectedMemory.isAiGenerated && (
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-primary/90 text-primary-foreground text-sm rounded-full flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      AI Generated
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4">{selectedMemory.title}</h2>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-5 h-5" />
                      {selectedMemory.location}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-5 h-5" />
                      {selectedMemory.date}
                    </div>
                  </div>
                  {selectedMemory.description && (
                    <p className="text-muted-foreground leading-relaxed">{selectedMemory.description}</p>
                  )}
                  <div className="mt-6 pt-6 border-t">
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                      <Heart className="w-5 h-5" />
                      {selectedMemory.likes} likes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default MemoryGallerySection;
