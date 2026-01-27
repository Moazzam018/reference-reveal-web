import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MapPin, Calendar, Plus, Upload, X, Heart, MessageCircle, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import travelersImage from "@/assets/travelers-meetup.jpg";
import keralaImage from "@/assets/kerala-backwaters.jpg";
import jaipurImage from "@/assets/jaipur-palace.jpg";

interface Meetup {
  id: string;
  title: string;
  location: string;
  date: string;
  description: string;
  image: string;
  host: {
    name: string;
    avatar: string;
  };
  attendees: {
    avatar: string;
  }[];
  maxAttendees: number;
  isJoined?: boolean;
}

const SocialMeetupsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [meetups, setMeetups] = useState<Meetup[]>([
    {
      id: "1",
      title: "Backpackers Brunch 🥐",
      location: "Goa, India",
      date: "2026-02-15",
      description: "Meet fellow travelers over breakfast by the beach! Share stories, tips, and make new friends.",
      image: travelersImage,
      host: { name: "travel_tribe", avatar: travelersImage },
      attendees: [
        { avatar: keralaImage },
        { avatar: jaipurImage },
        { avatar: travelersImage },
      ],
      maxAttendees: 20,
    },
    {
      id: "2",
      title: "Sunset Kayaking Adventure 🛶",
      location: "Alleppey, Kerala",
      date: "2026-02-20",
      description: "Join us for a magical evening kayaking through the backwaters as the sun sets.",
      image: keralaImage,
      host: { name: "kerala_explorer", avatar: keralaImage },
      attendees: [
        { avatar: travelersImage },
        { avatar: jaipurImage },
      ],
      maxAttendees: 12,
    },
    {
      id: "3",
      title: "Heritage Walk & Photography 📸",
      location: "Jaipur, Rajasthan",
      date: "2026-02-25",
      description: "Explore the hidden gems of the Pink City with fellow photography enthusiasts.",
      image: jaipurImage,
      host: { name: "jaipur_tales", avatar: jaipurImage },
      attendees: [
        { avatar: keralaImage },
        { avatar: travelersImage },
        { avatar: jaipurImage },
        { avatar: keralaImage },
      ],
      maxAttendees: 15,
    },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    date: "",
    description: "",
    image: "",
    maxAttendees: 10,
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
      title: formData.title,
      location: formData.location,
      date: formData.date,
      description: formData.description,
      image: formData.image || travelersImage,
      host: { name: "you", avatar: formData.image || travelersImage },
      attendees: [],
      maxAttendees: formData.maxAttendees,
    };

    setMeetups(prev => [newMeetup, ...prev]);
    setFormData({ title: "", location: "", date: "", description: "", image: "", maxAttendees: 10 });
    setIsDialogOpen(false);
    toast.success("Meetup created! 🎉");
  };

  const handleJoin = (id: string) => {
    setMeetups(prev => prev.map(m =>
      m.id === id ? {
        ...m,
        isJoined: !m.isJoined,
        attendees: m.isJoined
          ? m.attendees.slice(0, -1)
          : [...m.attendees, { avatar: travelersImage }]
      } : m
    ));
    const meetup = meetups.find(m => m.id === id);
    if (meetup?.isJoined) {
      toast.success("Left the meetup");
    } else {
      toast.success("You're in! 🎉");
    }
  };

  const handleDelete = (id: string) => {
    setMeetups(prev => prev.filter(m => m.id !== id));
    toast.success("Meetup deleted");
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
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold tracking-wider uppercase text-sm">
            Connect & Explore
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Social <span className="text-gradient">Meetups</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Join local events, meet fellow travelers, and create memories together
          </p>

          <Button variant="hero" size="lg" onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Host a Meetup
          </Button>
        </motion.div>

        {/* Meetups Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {meetups.map((meetup, index) => (
            <motion.div
              key={meetup.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.05 * index }}
              className="bg-card rounded-2xl overflow-hidden border border-border shadow-soft group"
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={meetup.image}
                  alt={meetup.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(meetup.id)}
                  className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4 text-destructive" />
                </button>

                {/* Date badge */}
                <div className="absolute top-3 left-3 px-3 py-1.5 bg-background/90 backdrop-blur-sm rounded-lg">
                  <p className="text-xs font-medium">{new Date(meetup.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Host */}
                <div className="flex items-center gap-2 mb-3">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={meetup.host.avatar} />
                    <AvatarFallback>{meetup.host.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">Hosted by <span className="font-medium text-foreground">{meetup.host.name}</span></span>
                </div>

                <h3 className="font-bold text-lg mb-2">{meetup.title}</h3>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <MapPin className="w-4 h-4" />
                  {meetup.location}
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{meetup.description}</p>

                {/* Attendees & Join */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex -space-x-2">
                      {meetup.attendees.slice(0, 4).map((attendee, i) => (
                        <Avatar key={i} className="w-8 h-8 border-2 border-background">
                          <AvatarImage src={attendee.avatar} />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    {meetup.attendees.length > 4 && (
                      <span className="ml-2 text-sm text-muted-foreground">+{meetup.attendees.length - 4}</span>
                    )}
                    <span className="ml-3 text-xs text-muted-foreground">
                      {meetup.attendees.length}/{meetup.maxAttendees} joined
                    </span>
                  </div>

                  <Button
                    size="sm"
                    variant={meetup.isJoined ? "outline" : "default"}
                    onClick={() => handleJoin(meetup.id)}
                    className="gap-1"
                  >
                    {meetup.isJoined ? (
                      <>Joined</>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Join
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Create Meetup Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">Host a Meetup</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Image */}
              <div>
                <Label>Cover Photo</Label>
                {formData.image ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden mt-2">
                    <img src={formData.image} alt="Cover" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                      className="absolute top-2 right-2 p-1 bg-background/80 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors mt-2">
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Add cover photo</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
              </div>

              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Beach sunset hangout 🌅"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="Goa, India"
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
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell travelers what to expect..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="max">Max attendees</Label>
                <Input
                  id="max"
                  type="number"
                  min={2}
                  max={100}
                  value={formData.maxAttendees}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxAttendees: parseInt(e.target.value) || 10 }))}
                />
              </div>

              <Button onClick={handleSubmit} className="w-full">
                Create Meetup
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default SocialMeetupsSection;
