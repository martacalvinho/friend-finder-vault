import { motion } from "framer-motion";
import { LogOut, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

interface DashboardHeaderProps {
  onSignOut: () => void;
}

export const DashboardHeader = ({ onSignOut }: DashboardHeaderProps) => {
  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex justify-between items-center mb-8 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 p-6 rounded-2xl"
    >
      <div className="text-center flex-1">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center justify-center gap-2">
          FriendFinds
          <Sparkles className="h-8 w-8 text-primary animate-pulse" />
        </h1>
        <p className="text-gray-600 dark:text-gray-300">Never lose a friend's recommendation again</p>
      </div>
      <Button
        variant="ghost"
        className="hover:bg-red-100 hover:text-red-600 transition-colors"
        onClick={onSignOut}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    </motion.div>
  );
};