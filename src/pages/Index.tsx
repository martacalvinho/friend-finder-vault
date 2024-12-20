import { useState } from "react";
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

interface Recommendation {
  id: number;
  title: string;
  category: string;
  friendName: string;
  notes: string;
  url?: string;
  date: string;
}

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
    toast({
      title: "Signed out successfully",
      description: "Come back soon!",
    });
  };

  const handleAddRecommendation = (newRecommendation: Omit<Recommendation, "id">) => {
    setRecommendations([
      { ...newRecommendation, id: Date.now() },
      ...recommendations,
    ]);
  };

  const filteredRecommendations = recommendations.filter((rec) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = 
      rec.title.toLowerCase().includes(searchTermLower) ||
      rec.friendName.toLowerCase().includes(searchTermLower) ||
      rec.category.toLowerCase().includes(searchTermLower) ||
      rec.notes.toLowerCase().includes(searchTermLower);
    const matchesCategory = selectedCategory === "all" || rec.category === selectedCategory;
    const matchesFriend = !selectedFriend || rec.friendName === selectedFriend;
    return matchesSearch && matchesCategory && matchesFriend;
  });

  const categories = Array.from(new Set(recommendations.map((rec) => rec.category)));
  const friends = Array.from(new Set(recommendations.map((rec) => rec.friendName)));

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
                title={recommendation.title}
                category={recommendation.category}
                friendName={recommendation.friendName}
                notes={recommendation.notes}
                url={recommendation.url}
                date={recommendation.date}
                onFriendClick={handleFriendClick}
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
                  ? "No recommendations yet. Add your first one!"
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
