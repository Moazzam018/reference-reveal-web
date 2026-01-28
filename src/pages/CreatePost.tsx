import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Image as ImageIcon,
  Video,
  Users,
  MapPin,
  Sparkles,
  Send,
  X,
  Camera,
  Loader2,
} from "lucide-react";
import BottomNav from "@/components/instagram/BottomNav";
import { useToast } from "@/hooks/use-toast";

type PostType = "photo" | "reel" | "meetup" | "ai";

const CreatePost = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [postType, setPostType] = useState<PostType>("photo");
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const postTypes = [
    { id: "photo" as PostType, icon: ImageIcon, label: "Photo", color: "bg-pink-500" },
    { id: "reel" as PostType, icon: Video, label: "Reel", color: "bg-purple-500" },
    { id: "meetup" as PostType, icon: Users, label: "Meetup", color: "bg-blue-500" },
    { id: "ai" as PostType, icon: Sparkles, label: "AI Image", color: "bg-gradient-to-r from-pink-500 to-purple-500" },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) {
      toast({ title: "Please enter a prompt", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setGeneratedImage("https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600");
    setIsGenerating(false);
    toast({ title: "AI image generated! ✨" });
  };

  const handlePost = () => {
    toast({ title: "Posted successfully! 🎉" });
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <X className="w-5 h-5" />
            </Button>
            <h1 className="font-display text-lg font-bold">Create</h1>
          </div>
          <Button
            size="sm"
            variant="hero"
            onClick={handlePost}
            disabled={!selectedImage && !generatedImage && postType !== "meetup"}
          >
            <Send className="w-4 h-4 mr-1" />
            Post
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Post Type Selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 mb-6 overflow-x-auto pb-2"
        >
          {postTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setPostType(type.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all ${
                postType === type.id
                  ? `${type.color} text-white`
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <type.icon className="w-5 h-5" />
              {type.label}
            </button>
          ))}
        </motion.div>

        {/* Photo/Reel Upload */}
        {(postType === "photo" || postType === "reel") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Image Preview/Upload */}
            <div className="relative">
              {selectedImage ? (
                <div className="relative aspect-square rounded-2xl overflow-hidden">
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                    onClick={() => setSelectedImage(null)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <label className="block aspect-square border-2 border-dashed border-border rounded-2xl cursor-pointer hover:border-primary transition-colors">
                  <div className="h-full flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium">Tap to upload</p>
                      <p className="text-sm text-muted-foreground">
                        {postType === "photo" ? "Photos" : "Videos"} up to 50MB
                      </p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept={postType === "photo" ? "image/*" : "video/*"}
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>

            {/* Caption */}
            <div className="space-y-2">
              <Label>Caption</Label>
              <Textarea
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={3}
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label>Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Add location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* AI Image Generation */}
        {postType === "ai" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-semibold">AI Image Generator</h3>
                  <p className="text-sm text-muted-foreground">Describe your dream travel image</p>
                </div>
              </div>

              <div className="space-y-4">
                <Textarea
                  placeholder="A serene sunrise over the Taj Mahal with misty gardens..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={4}
                />
                <Button
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
            </div>

            {/* Generated Image Preview */}
            {generatedImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-square rounded-2xl overflow-hidden"
              >
                <img src={generatedImage} alt="AI Generated" className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full">
                  AI Generated ✨
                </div>
              </motion.div>
            )}

            {/* Caption for AI */}
            {generatedImage && (
              <div className="space-y-2">
                <Label>Caption</Label>
                <Textarea
                  placeholder="Add a caption to your AI creation..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </motion.div>
        )}

        {/* Meetup Creation */}
        {postType === "meetup" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label>Meetup Title</Label>
              <Input placeholder="Backpackers meetup in Goa..." />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input placeholder="Anjuna Beach, Goa" />
            </div>
            <div className="space-y-2">
              <Label>Date & Time</Label>
              <Input type="datetime-local" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="What's the plan? What should people bring?" rows={4} />
            </div>
            <div className="space-y-2">
              <Label>Cover Photo (Optional)</Label>
              <label className="block h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary transition-colors">
                <div className="h-full flex items-center justify-center gap-2 text-muted-foreground">
                  <ImageIcon className="w-5 h-5" />
                  <span>Add cover photo</span>
                </div>
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>
          </motion.div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default CreatePost;
