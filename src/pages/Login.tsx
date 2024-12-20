import { useState, useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { LandingHero } from "@/components/LandingHero";

const Login = () => {
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <AnimatePresence mode="wait">
      {!showAuth ? (
        <LandingHero onGetStarted={() => setShowAuth(true)} />
      ) : (
        <motion.div
          key="auth"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5"
        >
          <div className="container max-w-md mx-auto pt-16 px-4">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center mb-8"
            >
              <button
                onClick={() => setShowAuth(false)}
                className="text-sm text-gray-600 hover:text-gray-800 mb-4 transition-colors"
              >
                ← Back to home
              </button>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Welcome to FriendFinds
              </h1>
              <p className="text-gray-600 dark:text-gray-300">Sign in to start organizing your recommendations</p>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg"
            >
              <Auth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: '#4A90E2',
                        brandAccent: '#82C3A6',
                      },
                    },
                  },
                }}
                providers={[]}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Login;