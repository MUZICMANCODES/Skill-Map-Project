import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Map, Target, Briefcase, ChevronRight, Sparkles } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [, setLocation] = useLocation();
  const { login } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) return;
    
    // Simple localStorage mock auth
    const userName = isLogin ? (email.split("@")[0] || "User") : name;
    login(userName, email);
    setLocation("/");
  };

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* LEFT PANEL - BRANDING */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12 lg:p-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] z-0" />
        
        {/* Animated Background Image from requirements.yaml */}
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0 mix-blend-overlay"
        >
          <img 
            src={`${import.meta.env.BASE_URL}images/auth-bg.png`}
            alt="Abstract 3D shapes" 
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Floating elements overlay */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] mix-blend-screen" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
              <Map className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-display font-bold text-3xl tracking-tight text-white">
              SkillMap
            </h1>
          </div>
          
          <h2 className="text-5xl font-display font-bold leading-[1.1] text-white mb-6">
            Map your future with <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-400">AI-powered</span> pathways.
          </h2>
          <p className="text-lg text-white/70 max-w-md">
            Discover personalized skills, real-world projects, and a step-by-step roadmap to achieve your career goals.
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <p className="text-white/90 font-medium text-lg">Personalized skill recommendations</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-accent" />
            </div>
            <p className="text-white/90 font-medium text-lg">Real-world project ideas</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Map className="w-5 h-5 text-pink-400" />
            </div>
            <p className="text-white/90 font-medium text-lg">Step-by-step tailored roadmap</p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl">
              <Map className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-display font-bold text-3xl tracking-tight">
              SkillMap
            </h1>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8 sm:p-10 rounded-[2rem]"
          >
            <div className="flex items-center gap-4 mb-8 p-1 bg-white/5 rounded-xl">
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={cn(
                  "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all",
                  !isLogin ? "bg-white/10 text-white shadow-sm" : "text-muted-foreground hover:text-white"
                )}
              >
                Register
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={cn(
                  "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all",
                  isLogin ? "bg-white/10 text-white shadow-sm" : "text-muted-foreground hover:text-white"
                )}
              >
                Sign In
              </button>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold font-display mb-2">
                {isLogin ? "Welcome back" : "Create an account"}
              </h3>
              <p className="text-muted-foreground text-sm">
                {isLogin ? "Enter your details to access your roadmap." : "Start mapping your personalized career journey today."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-medium text-white/80">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl bg-background border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      required={!isLogin}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full mt-6 group relative overflow-hidden rounded-xl bg-white text-black font-semibold py-3.5 px-4 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <div className="flex items-center justify-center gap-2">
                  <span>{isLogin ? "Sign In" : "Get Started"}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
