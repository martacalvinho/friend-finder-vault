import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SearchFilters } from "@/components/SearchFilters";
import { RecommendationGrid } from "@/components/RecommendationGrid";
import { AddRecommendationDialog } from "@/components/AddRecommendationDialog";
import { button as Button } from "@/components/ui/button";
import { useRecommendations } from "@/hooks/useRecommendations";

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

  const {
    recommendations,
    isLoading,
    handleAddRecommendation,
    handleDeleteRecommendation,
    handleToggleUsed,
  } = useRecommendations();

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
      queryClient.clear();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
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
          onRecommendationClick={handleToggleUsed}
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