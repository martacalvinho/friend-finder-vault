import { motion } from "framer-motion";
import { ArrowRight, BookMarked, Share2, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

interface LandingHeroProps {
  onGetStarted: () => void;
}

export const LandingHero = ({ onGetStarted }: LandingHeroProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto space-y-6"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Unlock Your Friends' Best Kept Secrets
          </h1>
          <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-primary animate-pulse" />
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-200">
          Save & Organize Their Trusted Recommendations
        </h2>
        
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Stop losing amazing recommendations in your chat history. FriendFinds is the simple way to save, 
          organize, and access all the great things your friends suggest.
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
        >
          {[
            {
              icon: <BookMarked className="h-8 w-8 text-primary" />,
              title: "Save Everything",
              description: "Keep all those amazing recommendations - from hidden gem restaurants to must-read books - in one beautifully organized space"
            },
            {
              icon: <Share2 className="h-8 w-8 text-primary" />,
              title: "Easy Access",
              description: "Instantly find what you need, right when you need it. Search by category, keyword, or friend to quickly rediscover that perfect recommendation"
            },
            {
              icon: <Sparkles className="h-8 w-8 text-primary" />,
              title: "Never Forget",
              description: "Turn your friends' fantastic suggestions into memorable experiences. No more sifting through old messages – it's all here, ready when you are"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center gap-4">
                {feature.icon}
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <Button
            onClick={onGetStarted}
            size="lg"
            className="group text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-white rounded-full transition-all duration-300 hover:scale-105"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};