import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, MapPin, Image as ImageIcon } from "lucide-react";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    image: string;
    caption: string;
    location: string;
  }) => void;
}

const CreatePostDialog = ({ open, onOpenChange, onSubmit }: CreatePostDialogProps) => {
  const [formData, setFormData] = useState({
    image: "",
    caption: "",
    location: "",
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
    onSubmit(formData);
    setFormData({ image: "", caption: "", location: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center">Create new post</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Image Upload */}
          <div>
            {formData.image ? (
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                  className="absolute top-2 right-2 px-3 py-1 bg-background/80 backdrop-blur rounded-full text-sm"
                >
                  Change
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
                <span className="text-muted-foreground mb-2">Drag photos here</span>
                <Button variant="secondary" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Select from computer
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>

          {/* Caption */}
          <div>
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              placeholder="Write a caption..."
              value={formData.caption}
              onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
              className="resize-none"
              rows={3}
            />
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location">Add location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="location"
                placeholder="Add location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>

          {/* Submit */}
          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={!formData.image}
          >
            Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
