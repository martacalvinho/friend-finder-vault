import { useState, useEffect } from "react";
import { AddRecommendationDialog } from "@/components/AddRecommendationDialog";
import { RecommendationCard } from "@/components/RecommendationCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Sparkles, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Recommendation {
  id: string;
  title: string;
  category: string;
  friend_name: string;
  notes: string | null;
  url: string | null;
  date: string;
  used: boolean;
}

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);

  const { data: recommendations = [], isLoading } = useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recommendations')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching recommendations:', error);
        throw error;
      }

      return data || [];
    },
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
    toast({
      title: "Signed out successfully",
      description: "Come back soon!",
    });
  };

  const handleAddRecommendation = async (newRecommendation: Omit<Recommendation, "id" | "used">) => {
    const { data, error } = await supabase
      .from('recommendations')
      .insert([{ ...newRecommendation, used: false }])
      .select()
      .single();

    if (error) {
      console.error('Error adding recommendation:', error);
      toast({
        title: "Error",
        description: "Failed to add recommendation. Please try again.",
        variant: "destructive",
      });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    toast({
      title: "Success!",
      description: "Recommendation added successfully",
    });
  };

  const handleDeleteRecommendation = async (id: string) => {
    const { error } = await supabase
      .from('recommendations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting recommendation:', error);
      toast({
        title: "Error",
        description: "Failed to delete recommendation. Please try again.",
        variant: "destructive",
      });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    toast({
      title: "Success",
      description: "Recommendation deleted successfully",
    });
  };

  const handleToggleUsed = async (id: string, used: boolean) => {
    const { error } = await supabase
      .from('recommendations')
      .update({ used })
      .eq('id', id);

    if (error) {
      console.error('Error updating recommendation:', error);
      toast({
        title: "Error",
        description: "Failed to update recommendation. Please try again.",
        variant: "destructive",
      });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['recommendations'] });
  };

  const filteredRecommendations = recommendations.filter((rec) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = 
      rec.title.toLowerCase().includes(searchTermLower) ||
      rec.friend_name.toLowerCase().includes(searchTermLower) ||
      rec.category.toLowerCase().includes(searchTermLower) ||
      (rec.notes?.toLowerCase().includes(searchTermLower) ?? false);
    const matchesCategory = selectedCategory === "all" || rec.category === selectedCategory;
    const matchesFriend = !selectedFriend || rec.friend_name === selectedFriend;
    return matchesSearch && matchesCategory && matchesFriend;
  });

  const categories = Array.from(new Set(recommendations.map((rec) => rec.category)));
  const friends = Array.from(new Set(recommendations.map((rec) => rec.friend_name)));

  const handleFriendClick = (name: string) => {
    setSelectedFriend(selectedFriend === name ? null : name);
    setSelectedCategory("all");
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5">
      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
              FriendFinds
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            </h1>
            <p className="text-gray-600">Never lose a friend's recommendation again</p>
          </div>
          <Button
            variant="ghost"
            className="hover:bg-red-100 hover:text-red-600 transition-colors"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </motion.div>

        {selectedFriend && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <p className="text-primary">
                Showing recommendations from {selectedFriend}{" "}
                <button
                  onClick={() => setSelectedFriend(null)}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  (clear)
                </button>
              </p>
            </div>
          </motion.div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search recommendations, categories, or friends..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <AddRecommendationDialog 
            onAdd={handleAddRecommendation} 
            existingCategories={categories}
          />
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredRecommendations.map((recommendation) => (
            <motion.div 
              key={recommendation.id} 
              variants={item}
              className="transform transition-all duration-300 hover:translate-y-[-5px]"
            >
              <RecommendationCard
                id={recommendation.id}
                title={recommendation.title}
                category={recommendation.category}
                friendName={recommendation.friend_name}
                notes={recommendation.notes || undefined}
                url={recommendation.url || undefined}
                date={recommendation.date}
                used={recommendation.used}
                onFriendClick={handleFriendClick}
                onDelete={handleDeleteRecommendation}
                onToggleUsed={handleToggleUsed}
              />
            </motion.div>
          ))}
          {filteredRecommendations.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-12"
            >
              <p className="text-gray-500">
                {recommendations.length === 0
                  ? "No recommendations yet! Tap the '+' button to add your first one!"
                  : "No recommendations match your search."}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Index;