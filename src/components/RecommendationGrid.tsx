import { motion } from "framer-motion";
import { Check, Trash2, X } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { RecommendationCard } from "./RecommendationCard";

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

interface RecommendationGridProps {
  recommendations: Recommendation[];
  isLoading: boolean;
  onRecommendationClick: (id: string, used: boolean) => void;
  onDelete: (id: string) => void;
  onFriendClick: (friend_name: string) => void;
}

export const RecommendationGrid = ({
  recommendations,
  isLoading,
  onRecommendationClick,
  onDelete,
  onFriendClick,
}: RecommendationGridProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700"
      >
        <p className="text-gray-500 dark:text-gray-400">
          No recommendations found.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recommendations.map((recommendation, index) => (
        <motion.div
          key={recommendation.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <RecommendationCard
            {...recommendation}
            friendName={recommendation.friend_name}
            onFriendClick={onFriendClick}
            onDelete={onDelete}
            onToggleUsed={(id, used) => onRecommendationClick(id, used)}
          />
        </motion.div>
      ))}
    </div>
  );
};