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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
          className="min-h-screen flex items-center justify-center relative overflow-hidden"
        >
          {/* Animated background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] [mask-image:radial-gradient(white,transparent_85%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-[500px] w-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            </div>
          </div>

          <div className="w-full max-w-md p-8 relative z-10">
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="flex items-center justify-center gap-2 mb-8"
            >
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%] animate-gradient">
                Welcome Back
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/30"
            >
              <Auth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: 'rgb(var(--primary))',
                        brandAccent: 'rgb(var(--primary))',
                      },
                    },
                  },
                  className: {
                    container: 'w-full',
                    button: 'w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:opacity-90',
                    input: 'w-full px-4 py-2 rounded-lg border bg-background transition-all duration-200 focus:ring-2 focus:ring-primary/50',
                  },
                }}
                providers={[]}
              />

              <button
                onClick={() => setShowAuth(false)}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ← Back to home
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Login;