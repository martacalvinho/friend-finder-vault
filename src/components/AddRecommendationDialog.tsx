import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const defaultCategories = [
  "Plumbers",
  "Electricians",
  "Restaurants",
  "Doctors",
  "Mechanics",
  "Others",
];

interface AddRecommendationDialogProps {
  onAdd: (recommendation: {
    title: string;
    category: string;
    friendName: string;
    notes: string;
    url?: string;
    date: string;
  }) => void;
  existingCategories: string[];
}

export function AddRecommendationDialog({ onAdd, existingCategories }: AddRecommendationDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [friendName, setFriendName] = useState("");
  const [notes, setNotes] = useState("");
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const allCategories = Array.from(new Set([...defaultCategories, ...existingCategories]));
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = category === "Others" ? customCategory : category;
    
    if (!title || !finalCategory || !friendName) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    onAdd({ 
      title, 
      category: finalCategory, 
      friendName, 
      notes,
      url: url || undefined,
      date: today
    });
    setOpen(false);
    resetForm();
    toast({
      title: "Success!",
      description: "Recommendation added successfully",
    });
  };

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setCustomCategory("");
    setFriendName("");
    setNotes("");
    setUrl("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Recommendation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Recommendation</DialogTitle>
          <DialogDescription>Add a recommendation from a friend</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Joe's Plumbing"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {allCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {category === "Others" && (
              <div className="mt-2">
                <Input
                  placeholder="Enter custom category"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="friendName">Friend's Name</Label>
            <Input
              id="friendName"
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">Website (optional)</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Great service, reasonable prices..."
            />
          </div>
          <Button type="submit" className="w-full">Add Recommendation</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}