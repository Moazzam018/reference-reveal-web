import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, MapPin, Calendar, Plus, Upload, X, Heart, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import travelersImage from "@/assets/travelers-meetup.jpg";

interface Meetup {
  id: string;
  title: string;
  location: string;
  date: string;
  description: string;
  image?: string;
  attendees: number;
}

const SocialMeetupsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [meetups, setMeetups] = useState<Meetup[]>([
    {
      id: "1",
      title: "Backpackers Brunch",
      location: "Goa, India",
      date: "2026-02-15",
      description: "Meet fellow travelers over breakfast by the beach!",
      image: travelersImage,
      attendees: 12,
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    date: "",
    description: "",
    image: "",
  });

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
    if (!formData.title || !formData.location || !formData.date) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const newMeetup: Meetup = {
      id: Date.now().toString(),
      ...formData,
      attendees: 1,
    };
    
    setMeetups(prev => [...prev, newMeetup]);
    setFormData({ title: "", location: "", date: "", description: "", image: "" });
    setIsDialogOpen(false);
    toast.success("Meetup created successfully!");
  };

  const removeMeetup = (id: string) => {
    setMeetups(prev => prev.filter(m => m.id !== id));
    toast.success("Meetup removed");
  };

  const joinMeetup = (id: string) => {
    setMeetups(prev => prev.map(m => 
      m.id === id ? { ...m, attendees: m.attendees + 1 } : m
    ));
    toast.success("You've joined the meetup!");
  };

  return (
    <section id="meetups" className="py-24 bg-gradient-warm relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold tracking-wider uppercase text-sm">
            Connect & Explore
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Social <span className="text-gradient">Meetups</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Connect with fellow travelers, share experiences, and create memories together
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
                Create a Meetup
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Create New Meetup
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Meetup name"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="Where is it happening?"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell travelers what to expect..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Cover Image</Label>
                  <div className="mt-2">
                    <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                      <Upload className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {formData.image ? "Image uploaded" : "Click to upload"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                </div>
                <Button onClick={handleSubmit} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Meetup
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
          {meetups.map((meetup, index) => (
            <motion.div
              key={meetup.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card className="overflow-hidden group cursor-pointer hover:shadow-elevated transition-all duration-300 relative">
                <button
                  onClick={() => removeMeetup(meetup.id)}
                  className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 rounded-full p-1"
                >
                  <X className="w-4 h-4 text-destructive" />
                </button>
                <div className="relative h-48 overflow-hidden">
                  {meetup.image ? (
                    <img
                      src={meetup.image}
                      alt={meetup.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <Users className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{meetup.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4" />
                    {meetup.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Calendar className="w-4 h-4" />
                    {meetup.date}
                  </div>
                  {meetup.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{meetup.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <Heart className="w-4 h-4" />
                        {meetup.attendees}
                      </button>
                      <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                    <Button size="sm" onClick={() => joinMeetup(meetup.id)}>
                      Join
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SocialMeetupsSection;
