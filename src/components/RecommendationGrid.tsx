import { motion } from "framer-motion";
import { Check, Trash2, X } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";

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
  onRecommendationClick: (id: string) => void;
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
          <Card className="group relative h-full bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <Badge 
                    variant={recommendation.used ? "default" : "secondary"}
                    className="mb-2"
                  >
                    {recommendation.category}
                  </Badge>
                  <CardTitle className="line-clamp-2">{recommendation.title}</CardTitle>
                </div>
                <div className="flex gap-2">
                  {recommendation.url && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(recommendation.url, '_blank');
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-500 hover:text-primary"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(recommendation.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pb-3">
              {recommendation.notes && (
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-2">
                  {recommendation.notes}
                </p>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span 
                  className="font-medium text-primary cursor-pointer hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFriendClick(recommendation.friend_name);
                  }}
                >
                  {recommendation.friend_name}
                </span>
                <span>•</span>
                <span>{new Date(recommendation.date).toLocaleDateString()}</span>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                variant="ghost"
                className="w-full justify-between hover:bg-primary/5"
                onClick={(e) => {
                  e.stopPropagation();
                  onRecommendationClick(recommendation.id);
                }}
              >
                <span>Mark as {recommendation.used ? 'not used' : 'used'}</span>
                {recommendation.used ? (
                  <X className="h-4 w-4 ml-2" />
                ) : (
                  <Check className="h-4 w-4 ml-2" />
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};