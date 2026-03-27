import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, Map } from "lucide-react";
import { useAuthStore, useResultStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useGetRecommendations } from "@workspace/api-client-react";
import type { UserProfile } from "@workspace/api-client-react";
import { LoadingScreen } from "./loading";
import { useToast } from "@/hooks/use-toast";

const STEPS = [
  { id: "subject", title: "Area of Focus", subtitle: "What are you studying or working in?" },
  { id: "interests", title: "Your Interests", subtitle: "What domains or topics excite you?" },
  { id: "skills", title: "Current Skills", subtitle: "What tools or concepts do you already know?" },
  { id: "goals", title: "Your Goals", subtitle: "What do you want to achieve?" },
  { id: "time", title: "Time Commitment", subtitle: "How much time can you dedicate per week?" },
  { id: "experience", title: "Experience Level", subtitle: "How would you rate your proficiency?" }
];

export default function OnboardingPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuthStore();
  const { profile, setResults } = useResultStore();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<UserProfile>(profile || {
    subject: "",
    interests: "",
    skills: "",
    goals: "",
    timeAvailability: "",
    experienceLevel: ""
  });

  const { mutate: getRecommendations, isPending } = useGetRecommendations({
    mutation: {
      onSuccess: (data) => {
        setResults(formData, data);
        setLocation("/dashboard");
      },
      onError: (error) => {
        toast({
          title: "Generation Failed",
          description: "There was an error creating your roadmap. Please try again.",
          variant: "destructive"
        });
      }
    }
  });

  if (!user) {
    setLocation("/login");
    return null;
  }

  if (isPending) {
    return <LoadingScreen />;
  }

  const handleNext = () => {
    // Validate current step
    const currentKey = Object.keys(formData)[currentStep] as keyof UserProfile;
    if (!formData[currentKey]) {
      toast({
        title: "Required Field",
        description: "Please fill out this field to continue.",
        variant: "destructive"
      });
      return;
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      getRecommendations({ data: formData });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-0" />
      
      {/* Top Bar */}
      <div className="relative z-10 w-full px-6 py-6 flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          <Map className="w-6 h-6 text-primary" />
          <span className="font-display font-bold text-lg">SkillMap</span>
        </div>
        <div className="text-sm font-medium text-muted-foreground">
          Step {currentStep + 1} of {STEPS.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6">
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary to-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative z-10 flex flex-col items-center justify-center p-6 w-full max-w-2xl mx-auto">
        <div className="w-full glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden">
          
          <AnimatePresence mode="wait" custom={currentStep}>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-3 text-white">
                {STEPS[currentStep].title}
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                {STEPS[currentStep].subtitle}
              </p>

              {/* Form Inputs based on step */}
              {currentStep === 0 && (
                <div className="space-y-4">
                  <input 
                    type="text" autoFocus
                    placeholder="e.g., Computer Science, Digital Marketing, Data Science"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-5 py-4 text-lg rounded-2xl bg-white/5 border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    onKeyDown={e => e.key === 'Enter' && handleNext()}
                  />
                  <div className="flex flex-wrap gap-2 mt-4">
                    {["Software Engineering", "UI/UX Design", "Business Admin"].map(s => (
                      <button key={s} onClick={() => setFormData({...formData, subject: s})} className="px-4 py-2 rounded-full text-sm bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-4">
                  <textarea 
                    autoFocus
                    placeholder="e.g., I love building web apps, analyzing data, and learning about AI."
                    value={formData.interests}
                    onChange={e => setFormData({ ...formData, interests: e.target.value })}
                    className="w-full px-5 py-4 text-lg rounded-2xl bg-white/5 border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none min-h-[120px] resize-none"
                  />
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <textarea 
                    autoFocus
                    placeholder="e.g., Basic Python, HTML/CSS, some marketing experience."
                    value={formData.skills}
                    onChange={e => setFormData({ ...formData, skills: e.target.value })}
                    className="w-full px-5 py-4 text-lg rounded-2xl bg-white/5 border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none min-h-[120px] resize-none"
                  />
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <input 
                    type="text" autoFocus
                    placeholder="e.g., Get a job as a Frontend Developer in 6 months"
                    value={formData.goals}
                    onChange={e => setFormData({ ...formData, goals: e.target.value })}
                    className="w-full px-5 py-4 text-lg rounded-2xl bg-white/5 border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    onKeyDown={e => e.key === 'Enter' && handleNext()}
                  />
                </div>
              )}

              {currentStep === 4 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {["Less than 5 hours/week", "5-10 hours/week", "10-20 hours/week", "20+ hours/week"].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setFormData({ ...formData, timeAvailability: opt })}
                      className={cn(
                        "p-5 rounded-2xl border text-left transition-all duration-200",
                        formData.timeAvailability === opt 
                          ? "bg-primary/20 border-primary" 
                          : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                      )}
                    >
                      <span className="font-medium">{opt}</span>
                    </button>
                  ))}
                </div>
              )}

              {currentStep === 5 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { level: "Beginner", desc: "Just starting out" },
                    { level: "Intermediate", desc: "Have some experience" },
                    { level: "Advanced", desc: "Looking to master" }
                  ].map(opt => (
                    <button
                      key={opt.level}
                      onClick={() => setFormData({ ...formData, experienceLevel: opt.level })}
                      className={cn(
                        "p-6 rounded-2xl border text-center transition-all duration-200",
                        formData.experienceLevel === opt.level 
                          ? "bg-primary/20 border-primary scale-[1.02]" 
                          : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                      )}
                    >
                      <div className="font-bold text-lg mb-1">{opt.level}</div>
                      <div className="text-sm text-muted-foreground">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="mt-12 flex items-center justify-between">
            <button
              onClick={handleBack}
              className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all",
                currentStep === 0 
                  ? "opacity-0 pointer-events-none" 
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              )}
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {currentStep === STEPS.length - 1 ? "Generate Roadmap" : "Continue"}
              {currentStep !== STEPS.length - 1 && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
