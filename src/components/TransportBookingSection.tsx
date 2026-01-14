import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plane, Train, Bus, Car, Ship, Plus, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const transportTypes = [
  { icon: Plane, name: "Flight", color: "from-blue-500 to-cyan-500" },
  { icon: Train, name: "Train", color: "from-orange-500 to-red-500" },
  { icon: Bus, name: "Bus", color: "from-green-500 to-emerald-500" },
  { icon: Car, name: "Car", color: "from-purple-500 to-pink-500" },
  { icon: Ship, name: "Cruise", color: "from-teal-500 to-blue-500" },
];

interface Booking {
  id: string;
  type: string;
  from: string;
  to: string;
  date: string;
  notes: string;
  image?: string;
}

const TransportBookingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedType, setSelectedType] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    notes: "",
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
    if (!formData.from || !formData.to || !formData.date) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const newBooking: Booking = {
      id: Date.now().toString(),
      type: selectedType,
      ...formData,
    };
    
    setBookings(prev => [...prev, newBooking]);
    setFormData({ from: "", to: "", date: "", notes: "", image: "" });
    setIsDialogOpen(false);
    toast.success(`${selectedType} booking added successfully!`);
  };

  const handleTransportClick = (typeName: string) => {
    setSelectedType(typeName);
    setIsDialogOpen(true);
  };

  const removeBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
    toast.success("Booking removed");
  };

  return (
    <section id="transport" className="py-24 bg-background relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold tracking-wider uppercase text-sm">
            Book Your Transport
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Travel <span className="text-gradient">Your Way</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Book flights, trains, buses, cars, and cruises all in one place
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12"
        >
          {transportTypes.map((transport, index) => (
            <Dialog key={transport.name} open={isDialogOpen && selectedType === transport.name} onOpenChange={(open) => {
              if (!open) setIsDialogOpen(false);
            }}>
              <DialogTrigger asChild>
                <Card
                  className="p-6 cursor-pointer hover:shadow-elevated transition-all duration-300 hover:-translate-y-2 group border-border/50 bg-card/50 backdrop-blur-sm"
                  onClick={() => handleTransportClick(transport.name)}
                >
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${transport.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <transport.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-center font-semibold">{transport.name}</h3>
                  <p className="text-center text-xs text-muted-foreground mt-1">Click to book</p>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <transport.icon className="w-5 h-5" />
                    Book {transport.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="from">From *</Label>
                      <Input
                        id="from"
                        placeholder="Departure"
                        value={formData.from}
                        onChange={(e) => setFormData(prev => ({ ...prev, from: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="to">To *</Label>
                      <Input
                        id="to"
                        placeholder="Destination"
                        value={formData.to}
                        onChange={(e) => setFormData(prev => ({ ...prev, to: e.target.value }))}
                      />
                    </div>
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
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special requirements..."
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Upload Ticket/Document</Label>
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
                    Add Booking
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </motion.div>

        {bookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8"
          >
            <h3 className="text-xl font-semibold mb-4">Your Bookings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookings.map((booking) => (
                <Card key={booking.id} className="p-4 relative group">
                  <button
                    onClick={() => removeBooking(booking.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-destructive" />
                  </button>
                  {booking.image && (
                    <img src={booking.image} alt="Ticket" className="w-full h-32 object-cover rounded-lg mb-3" />
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium px-2 py-1 bg-primary/10 rounded-full">{booking.type}</span>
                  </div>
                  <p className="font-semibold">{booking.from} → {booking.to}</p>
                  <p className="text-sm text-muted-foreground">{booking.date}</p>
                  {booking.notes && <p className="text-sm mt-2">{booking.notes}</p>}
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default TransportBookingSection;
