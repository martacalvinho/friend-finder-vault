import { useState } from "react";
import { AddRecommendationDialog } from "@/components/AddRecommendationDialog";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SearchFilters } from "@/components/SearchFilters";
import { RecommendationGrid } from "@/components/RecommendationGrid";
import { motion } from "framer-motion";

interface Recommendation {
  id: string;
  title: string;
  category: string;
  friend_name: string;
  notes: string | null;
  url: string | null;
  date: string;
  used: boolean;
  user_id: string;
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

  const handleFriendClick = (name: string) => {
    setSelectedFriend(selectedFriend === name ? null : name);
    setSelectedCategory("all");
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
        <DashboardHeader onSignOut={handleSignOut} />

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
          <SearchFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories}
            selectedFriend={selectedFriend}
          />
          <AddRecommendationDialog 
            onAdd={handleAddRecommendation} 
            existingCategories={categories}
          />
        </div>

        <RecommendationGrid
          recommendations={filteredRecommendations}
          onFriendClick={handleFriendClick}
          onDelete={handleDeleteRecommendation}
          onToggleUsed={handleToggleUsed}
        />

        {filteredRecommendations.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <p className="text-gray-500">
              {recommendations.length === 0
                ? "No recommendations yet! Tap the '+' button to add your first one!"
                : "No recommendations match your search."}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Index;