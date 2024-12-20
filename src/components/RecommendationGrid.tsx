import { motion } from "framer-motion";
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
  onFriendClick: (name: string) => void;
  onDelete: (id: string) => void;
  onToggleUsed: (id: string, used: boolean) => void;
}

export const RecommendationGrid = ({
  recommendations,
  onFriendClick,
  onDelete,
  onToggleUsed
}: RecommendationGridProps) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {recommendations.map((recommendation) => (
        <motion.div 
          key={recommendation.id} 
          className="transform transition-all duration-300 hover:translate-y-[-5px]"
        >
          <RecommendationCard
            {...recommendation}
            onFriendClick={onFriendClick}
            onDelete={onDelete}
            onToggleUsed={onToggleUsed}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};