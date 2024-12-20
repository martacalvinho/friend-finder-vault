import { useState, useMemo, useEffect } from "react";
import { AddRecommendationDialog } from "@/components/AddRecommendationDialog";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SearchFilters } from "@/components/SearchFilters";
import { RecommendationGrid } from "@/components/RecommendationGrid";
import { Button } from "@/components/ui/button";

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
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/login");
      }
    });

    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription?.unsubscribe();
  }, [navigate]);

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

  const friends = useMemo(() => {
    const uniqueFriends = new Set(recommendations.map(rec => rec.friend_name));
    return Array.from(uniqueFriends).filter(Boolean).sort();
  }, [recommendations]);

  const filteredRecommendations = useMemo(() => {
    return recommendations.filter(rec => {
      const searchMatch = !searchTerm || 
        rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rec.notes?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        rec.friend_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.category.toLowerCase().includes(searchTerm.toLowerCase());

      const categoryMatch = selectedCategory === "all" || rec.category === selectedCategory;

      const statusMatch = selectedStatus === "all" || 
        (selectedStatus === "used" && rec.used) ||
        (selectedStatus === "unused" && !rec.used);

      const friendMatch = !selectedFriend || rec.friend_name === selectedFriend;

      const dateMatch = (!startDate || new Date(rec.date) >= startDate) &&
        (!endDate || new Date(rec.date) <= endDate);

      return searchMatch && categoryMatch && statusMatch && friendMatch && dateMatch;
    });
  }, [recommendations, searchTerm, selectedCategory, selectedStatus, selectedFriend, startDate, endDate]);

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleSignOut = async () => {
    try {
      // First clear all queries
      queryClient.clear();
      
      // Then sign out
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Force navigation to login
      window.location.href = '/login';
      
      toast({
        title: "Signed out successfully",
        description: "Come back soon!",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive",
      });
    }
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

  const handleFriendClick = (friendName: string) => {
    setSelectedFriend(friendName === selectedFriend ? null : friendName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5">
      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <DashboardHeader onSignOut={handleSignOut} />
        
        {selectedFriend && (
          <div className="mb-4 px-4 py-2 bg-primary/10 rounded-lg inline-flex items-center gap-2">
            <span>Showing recommendations from {selectedFriend}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedFriend(null)}
              className="hover:bg-primary/20"
            >
              Clear filter
            </Button>
          </div>
        )}

        <div className="mb-8">
          <SearchFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            selectedFriend={selectedFriend}
            onFriendChange={setSelectedFriend}
            startDate={startDate}
            endDate={endDate}
            onDateChange={handleDateChange}
            friends={friends}
          />
        </div>

        <RecommendationGrid
          recommendations={filteredRecommendations}
          isLoading={isLoading}
          onRecommendationClick={(id) => {
            const recommendation = recommendations.find(r => r.id === id);
            if (recommendation) {
              supabase
                .from('recommendations')
                .update({ used: !recommendation.used })
                .eq('id', id)
                .then(() => {
                  queryClient.invalidateQueries(['recommendations']);
                  toast({
                    title: recommendation.used ? "Marked as not used" : "Marked as used",
                    description: `${recommendation.title} has been updated.`,
                  });
                });
            }
          }}
          onDelete={handleDeleteRecommendation}
          onFriendClick={handleFriendClick}
        />

        <AddRecommendationDialog 
          onAdd={handleAddRecommendation}
          existingCategories={Array.from(new Set(recommendations.map(rec => rec.category)))}
        />
      </div>
    </div>
  );
};

export default Index;
