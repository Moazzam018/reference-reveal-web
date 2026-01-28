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
  MapPin,
  Calendar,
  Users,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";
import BottomNav from "@/components/instagram/BottomNav";
import { useToast } from "@/hooks/use-toast";

interface Meetup {
  id: string;
  title: string;
  location: string;
  date: string;
  description: string;
  image: string;
  host: { name: string; avatar: string };
  attendees: number;
  isJoined: boolean;
}

const initialMeetups: Meetup[] = [
  {
    id: "1",
    title: "Backpackers Meetup in Goa",
    location: "Anjuna Beach, Goa",
    date: "Feb 15, 2026",
    description: "Join fellow travelers for sunset drinks and stories!",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600",
    host: { name: "Priya Sharma", avatar: "https://i.pravatar.cc/150?img=1" },
    attendees: 24,
    isJoined: false,
  },
  {
    id: "2",
    title: "Heritage Walk in Jaipur",
    location: "Hawa Mahal, Jaipur",
    date: "Feb 20, 2026",
    description: "Explore the Pink City's hidden gems with local guides",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600",
    host: { name: "Rahul Verma", avatar: "https://i.pravatar.cc/150?img=3" },
    attendees: 18,
    isJoined: true,
  },
  {
    id: "3",
    title: "Kerala Houseboat Experience",
    location: "Alleppey Backwaters",
    date: "Mar 5, 2026",
    description: "Overnight stay in traditional houseboats with local cuisine",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600",
    host: { name: "Anjali Nair", avatar: "https://i.pravatar.cc/150?img=5" },
    attendees: 12,
    isJoined: false,
  },
];

const Meetups = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [meetups, setMeetups] = useState<Meetup[]>(initialMeetups);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newMeetup, setNewMeetup] = useState({
    title: "",
    location: "",
    date: "",
    description: "",
  });

  const handleJoin = (id: string) => {
    setMeetups(meetups.map(m => 
      m.id === id 
        ? { ...m, isJoined: !m.isJoined, attendees: m.isJoined ? m.attendees - 1 : m.attendees + 1 }
        : m
    ));
    toast({
      title: meetups.find(m => m.id === id)?.isJoined ? "Left meetup" : "Joined meetup! 🎉",
    });
  };

  const handleCreate = () => {
    const meetup: Meetup = {
      id: Date.now().toString(),
      ...newMeetup,
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600",
      host: { name: "You", avatar: "https://i.pravatar.cc/150?img=10" },
      attendees: 1,
      isJoined: true,
    };
    setMeetups([meetup, ...meetups]);
    setIsCreateOpen(false);
    setNewMeetup({ title: "", location: "", date: "", description: "" });
    toast({ title: "Meetup created! 🎊" });
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
            <h1 className="font-display text-lg font-bold">Meetups</h1>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="hero">
                <Plus className="w-4 h-4 mr-1" />
                Create
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a Meetup</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    placeholder="Backpackers meetup..."
                    value={newMeetup.title}
                    onChange={(e) => setNewMeetup({ ...newMeetup, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    placeholder="Anjuna Beach, Goa"
                    value={newMeetup.location}
                    onChange={(e) => setNewMeetup({ ...newMeetup, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={newMeetup.date}
                    onChange={(e) => setNewMeetup({ ...newMeetup, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="What's the plan?"
                    value={newMeetup.description}
                    onChange={(e) => setNewMeetup({ ...newMeetup, description: e.target.value })}
                  />
                </div>
                <Button className="w-full" onClick={handleCreate}>
                  Create Meetup
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Meetup Cards */}
        <div className="space-y-4">
          {meetups.map((meetup, index) => (
            <motion.article
              key={meetup.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl border border-border overflow-hidden"
            >
              {/* Image */}
              <div className="relative aspect-video">
                <img
                  src={meetup.image}
                  alt={meetup.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <img
                    src={meetup.host.avatar}
                    alt={meetup.host.name}
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                  <span className="text-white text-sm font-medium drop-shadow-lg">
                    {meetup.host.name}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-display text-lg font-semibold mb-2">{meetup.title}</h3>
                
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {meetup.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {meetup.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {meetup.attendees} going
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-4">{meetup.description}</p>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                      <Heart className="w-5 h-5" />
                    </button>
                    <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                      <MessageCircle className="w-5 h-5" />
                    </button>
                    <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                  <Button
                    variant={meetup.isJoined ? "outline" : "hero"}
                    size="sm"
                    onClick={() => handleJoin(meetup.id)}
                  >
                    {meetup.isJoined ? "Joined ✓" : "Join"}
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Meetups;
