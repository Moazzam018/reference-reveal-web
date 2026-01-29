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
  MapPin,
  Calendar,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Loader2,
} from "lucide-react";
import BottomNav from "@/components/instagram/BottomNav";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface MeetupWithProfile {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string | null;
  description: string | null;
  image_url: string | null;
  attendees_count: number;
  max_attendees: number | null;
  user_id: string;
  created_at: string;
  isJoined?: boolean;
  host?: { full_name: string | null; avatar_url: string | null };
}

const Meetups = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [meetups, setMeetups] = useState<MeetupWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newMeetup, setNewMeetup] = useState({
    title: "",
    location: "",
    date: "",
    time: "",
    description: "",
    image_url: "",
  });

  useEffect(() => {
    fetchMeetups();
  }, [user]);

  const fetchMeetups = async () => {
    if (!user) return;

    try {
      const { data: meetupsData, error: meetupsError } = await supabase
        .from("meetups")
        .select("*")
        .order("date", { ascending: true });

      if (meetupsError) throw meetupsError;

      // Fetch user profiles for hosts
      const userIds = [...new Set((meetupsData || []).map(m => m.user_id))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url")
        .in("user_id", userIds);

      const profileMap = new Map(profilesData?.map(p => [p.user_id, p]) || []);

      // Check which meetups the user has joined
      const { data: attendeesData } = await supabase
        .from("meetup_attendees")
        .select("meetup_id")
        .eq("user_id", user.id);

      const joinedMeetupIds = new Set(attendeesData?.map(a => a.meetup_id) || []);

      setMeetups((meetupsData || []).map(m => ({
        ...m,
        isJoined: joinedMeetupIds.has(m.id),
        host: profileMap.get(m.user_id) || { full_name: "Unknown", avatar_url: null },
      })));
    } catch (error) {
      console.error("Error fetching meetups:", error);
      toast({ title: "Failed to load meetups", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (id: string) => {
    if (!user) return;

    const meetup = meetups.find(m => m.id === id);
    if (!meetup) return;

    const isCurrentlyJoined = meetup.isJoined;

    // Optimistic update
    setMeetups(meetups.map(m =>
      m.id === id
        ? { ...m, isJoined: !isCurrentlyJoined, attendees_count: isCurrentlyJoined ? m.attendees_count - 1 : m.attendees_count + 1 }
        : m
    ));

    try {
      if (isCurrentlyJoined) {
        await supabase
          .from("meetup_attendees")
          .delete()
          .eq("user_id", user.id)
          .eq("meetup_id", id);
      } else {
        await supabase
          .from("meetup_attendees")
          .insert({ user_id: user.id, meetup_id: id });
      }

      // Update attendees count
      await supabase
        .from("meetups")
        .update({ attendees_count: isCurrentlyJoined ? meetup.attendees_count - 1 : meetup.attendees_count + 1 })
        .eq("id", id);

      toast({
        title: isCurrentlyJoined ? "Left meetup" : "Joined meetup! 🎉",
      });
    } catch (error) {
      // Revert on error
      setMeetups(meetups.map(m =>
        m.id === id
          ? { ...m, isJoined: isCurrentlyJoined, attendees_count: meetup.attendees_count }
          : m
      ));
      console.error("Error updating attendance:", error);
      toast({ title: "Failed to update attendance", variant: "destructive" });
    }
  };

  const handleCreate = async () => {
    if (!user || !newMeetup.title || !newMeetup.location || !newMeetup.date) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from("meetups").insert({
        user_id: user.id,
        title: newMeetup.title,
        location: newMeetup.location,
        date: newMeetup.date,
        time: newMeetup.time || null,
        description: newMeetup.description || null,
        image_url: newMeetup.image_url || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600",
        attendees_count: 1,
      });

      if (error) throw error;

      // Auto-join the creator
      const { data: meetupData } = await supabase
        .from("meetups")
        .select("id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (meetupData) {
        await supabase.from("meetup_attendees").insert({
          user_id: user.id,
          meetup_id: meetupData.id,
        });
      }

      setIsCreateOpen(false);
      setNewMeetup({ title: "", location: "", date: "", time: "", description: "", image_url: "" });
      toast({ title: "Meetup created! 🎊" });
      fetchMeetups();
    } catch (error) {
      console.error("Error creating meetup:", error);
      toast({ title: "Failed to create meetup", variant: "destructive" });
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
                <DialogDescription>Organize a travel meetup for fellow explorers</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    placeholder="Backpackers meetup..."
                    value={newMeetup.title}
                    onChange={(e) => setNewMeetup({ ...newMeetup, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location *</Label>
                  <Input
                    placeholder="Anjuna Beach, Goa"
                    value={newMeetup.location}
                    onChange={(e) => setNewMeetup({ ...newMeetup, location: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date *</Label>
                    <Input
                      type="date"
                      value={newMeetup.date}
                      onChange={(e) => setNewMeetup({ ...newMeetup, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input
                      type="time"
                      value={newMeetup.time}
                      onChange={(e) => setNewMeetup({ ...newMeetup, time: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="What's the plan?"
                    value={newMeetup.description}
                    onChange={(e) => setNewMeetup({ ...newMeetup, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cover Image URL (optional)</Label>
                  <Input
                    placeholder="https://..."
                    value={newMeetup.image_url}
                    onChange={(e) => setNewMeetup({ ...newMeetup, image_url: e.target.value })}
                  />
                </div>
                <Button className="w-full" onClick={handleCreate} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Create Meetup
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {meetups.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No meetups yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to organize a travel meetup!</p>
            <Button variant="hero" onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Meetup
            </Button>
          </div>
        ) : (
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
                    src={meetup.image_url || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600"}
                    alt={meetup.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <img
                      src={meetup.host?.avatar_url || `https://i.pravatar.cc/150?u=${meetup.user_id}`}
                      alt={meetup.host?.full_name || "Host"}
                      className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    />
                    <span className="text-white text-sm font-medium drop-shadow-lg">
                      {meetup.host?.full_name || "Traveler"}
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
                      {formatDate(meetup.date)}
                      {meetup.time && ` at ${meetup.time}`}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {meetup.attendees_count} going
                    </span>
                  </div>

                  {meetup.description && (
                    <p className="text-sm text-muted-foreground mb-4">{meetup.description}</p>
                  )}

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
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Meetups;
