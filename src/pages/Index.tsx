import { useState } from "react";
import { AddRecommendationDialog } from "@/components/AddRecommendationDialog";
import { RecommendationCard } from "@/components/RecommendationCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

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
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);

  const handleAddRecommendation = (newRecommendation: Omit<Recommendation, "id">) => {
    setRecommendations([
      ...recommendations,
      { ...newRecommendation, id: Date.now() },
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">FriendFinds</h1>
          <p className="text-gray-600">Never lose a friend's recommendation again</p>
          {selectedFriend && (
            <p className="mt-4 text-primary">
              Showing recommendations from {selectedFriend}{" "}
              <button
                onClick={() => setSelectedFriend(null)}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                (clear)
              </button>
            </p>
          )}
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecommendations.map((recommendation) => (
            <RecommendationCard
              key={recommendation.id}
              title={recommendation.title}
              category={recommendation.category}
              friendName={recommendation.friendName}
              notes={recommendation.notes}
              url={recommendation.url}
              date={recommendation.date}
              onFriendClick={handleFriendClick}
            />
          ))}
          {filteredRecommendations.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">
                {recommendations.length === 0
                  ? "No recommendations yet. Add your first one!"
                  : "No recommendations match your search."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;