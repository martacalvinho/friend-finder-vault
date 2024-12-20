import { motion } from "framer-motion";
import { ArrowRight, BookMarked, Share2, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

interface LandingHeroProps {
  onGetStarted: () => void;
}

export const LandingHero = ({ onGetStarted }: LandingHeroProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] [mask-image:radial-gradient(white,transparent_85%)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-[300px] w-[300px] bg-primary/30 rounded-full blur-[100px] animate-pulse" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto space-y-8 relative z-10"
      >
        <motion.div
          className="flex items-center justify-center gap-3 mb-6"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <h1 className="text-5xl sm:text-7xl font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%] animate-gradient">
              FriendFinds
            </span>
          </h1>
          <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 text-primary animate-sparkle" />
        </motion.div>

        <motion.h2
          className="text-2xl sm:text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Never Lose a Friend's Recommendation Again
        </motion.h2>

        <motion.p
          className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          The perfect place to store and organize all those amazing recommendations from your friends -
          from books and movies to restaurants and travel spots.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
        >
          {[
            {
              icon: <BookMarked className="h-8 w-8" />,
              title: "Save Everything",
              description: "Keep all recommendations in one organized space",
            },
            {
              icon: <Share2 className="h-8 w-8" />,
              title: "Easy Access",
              description: "Find what you need when you need it",
            },
            {
              icon: <Sparkles className="h-8 w-8" />,
              title: "Never Forget",
              description: "Track and remember every great suggestion",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="group relative p-6 rounded-2xl bg-white/5 border border-gray-200 dark:border-gray-800 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              whileHover={{ y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <Button
            onClick={onGetStarted}
            size="lg"
            className="group relative px-8 py-6 text-lg hover:scale-105 transition-all duration-300 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};