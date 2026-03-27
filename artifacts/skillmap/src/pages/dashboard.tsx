import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Briefcase, Map, RefreshCw, RotateCcw, Clock, Award, CheckCircle, ExternalLink } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useAuthStore, useResultStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type Tab = "skills" | "projects" | "roadmap";

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuthStore();
  const { results, clearResults } = useResultStore();
  const [activeTab, setActiveTab] = useState<Tab>("skills");

  useEffect(() => {
    if (!user) {
      setLocation("/login");
    } else if (!results) {
      setLocation("/onboarding");
    }
  }, [user, results, setLocation]);

  if (!user || !results) return null;

  const handleStartOver = () => {
    clearResults();
    setLocation("/onboarding");
  };

  const tabs = [
    { id: "skills", label: "Skills to Learn", icon: BookOpen },
    { id: "projects", label: "Project Ideas", icon: Briefcase },
    { id: "roadmap", label: "Step-by-Step Roadmap", icon: Map },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background pt-20">
      <Navbar />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 md:py-12">
        {/* Header & Summary */}
        <div className="mb-12 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
                Your AI-Powered <span className="text-gradient">Pathway</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {results.summary}
              </p>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setLocation("/onboarding")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </button>
              <button
                onClick={handleStartOver}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-colors text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Start Over
              </button>
            </div>
          </div>
        </div>

        {/* Custom Tabs */}
        <div className="flex w-full overflow-x-auto hide-scrollbar gap-2 mb-8 border-b border-white/10 pb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={cn(
                  "relative flex items-center gap-2 px-6 py-4 font-medium text-sm transition-colors whitespace-nowrap",
                  isActive ? "text-white" : "text-muted-foreground hover:text-white/80"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive && "text-primary")} />
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 inset-x-0 h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "skills" && (
              <motion.div 
                variants={containerVariants} 
                initial="hidden" 
                animate="show" 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {results.skills.map((skill, idx) => (
                  <motion.div key={idx} variants={itemVariants} className="glass-card rounded-2xl p-6 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{skill.emoji}</span>
                        <h3 className="font-display font-bold text-xl">{skill.name}</h3>
                      </div>
                      <span className={cn(
                        "text-xs font-bold px-2.5 py-1 rounded-full border",
                        skill.difficulty.toLowerCase() === "beginner" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                        skill.difficulty.toLowerCase() === "advanced" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                        "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      )}>
                        {skill.difficulty}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-6 flex-1">
                      {skill.why_for_you}
                    </p>

                    <div className="flex items-center gap-2 text-xs font-medium text-white/80 mb-4 bg-white/5 w-fit px-3 py-1.5 rounded-lg border border-white/10">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      {skill.time_to_learn}
                    </div>

                    <div className="space-y-3 border-t border-white/10 pt-4">
                      <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider">Recommended Resources</h4>
                      <ul className="space-y-2">
                        {skill.resources.map((res, rIdx) => (
                          <li key={rIdx} className="flex flex-col gap-0.5 group cursor-pointer">
                            <span className="text-sm font-medium group-hover:text-primary transition-colors flex items-center gap-1.5">
                              {res.title} <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </span>
                            <span className="text-xs text-muted-foreground">{res.type}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === "projects" && (
              <motion.div 
                variants={containerVariants} 
                initial="hidden" 
                animate="show" 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {results.projects.map((project, idx) => (
                  <motion.div key={idx} variants={itemVariants} className="glass-card rounded-2xl p-6 md:p-8 flex flex-col h-full">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      <h3 className="font-display font-bold text-2xl">{project.title}</h3>
                      <span className={cn(
                        "text-xs font-bold px-2.5 py-1 rounded-full border whitespace-nowrap w-fit",
                        project.difficulty.toLowerCase() === "beginner" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                        project.difficulty.toLowerCase() === "advanced" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                        "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      )}>
                        {project.difficulty}
                      </span>
                    </div>

                    <p className="text-muted-foreground mb-6 leading-relaxed flex-1">
                      {project.description}
                    </p>

                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
                      <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Award className="w-4 h-4" /> Why do this?
                      </h4>
                      <p className="text-sm text-white/90">{project.why_for_you}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.skills_built.map((skill, sIdx) => (
                        <span key={sIdx} className="px-3 py-1 text-xs font-medium bg-white/10 rounded-full border border-white/5">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-sm font-medium text-white/80 mt-auto">
                      <Clock className="w-4 h-4 text-accent" />
                      Estimated timeline: {project.timeline}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === "roadmap" && (
              <motion.div 
                variants={containerVariants} 
                initial="hidden" 
                animate="show" 
                className="space-y-6 relative before:absolute before:inset-y-0 before:left-[27px] md:before:left-1/2 md:before:-ml-px before:w-0.5 before:bg-white/10"
              >
                {results.roadmap.map((phase, idx) => (
                  <motion.div key={idx} variants={itemVariants} className="relative flex flex-col md:flex-row items-start md:items-center gap-8 group">
                    
                    {/* Timeline Node */}
                    <div className="absolute left-[20px] md:left-1/2 md:-ml-[8px] w-4 h-4 rounded-full bg-primary ring-4 ring-background z-10 group-hover:scale-125 transition-transform" />
                    
                    {/* Content (Alternating sides on desktop) */}
                    <div className={cn(
                      "w-full md:w-1/2 pl-14 md:pl-0",
                      idx % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 md:ml-auto"
                    )}>
                      <div className="glass-card p-6 md:p-8 rounded-2xl relative">
                        <div className={cn(
                          "absolute top-6 w-0 h-0 border-y-8 border-y-transparent",
                          idx % 2 === 0 
                            ? "hidden md:block -right-4 border-l-[16px] border-l-white/10" 
                            : "hidden md:block -left-4 border-r-[16px] border-r-white/10"
                        )} />
                        
                        <div className={cn(
                          "flex items-center gap-3 mb-2",
                          idx % 2 === 0 ? "md:justify-end" : "justify-start"
                        )}>
                          <span className="text-primary font-bold text-sm tracking-wider uppercase">{phase.phase}</span>
                          <span className="px-2 py-0.5 rounded text-xs bg-white/10 text-white/80">{phase.duration}</span>
                        </div>
                        
                        <h3 className="font-display font-bold text-2xl mb-4">{phase.focus}</h3>
                        
                        <ul className={cn(
                          "space-y-3",
                          idx % 2 === 0 ? "md:items-end" : "items-start"
                        )}>
                          {phase.milestones.map((milestone, mIdx) => (
                            <li key={mIdx} className={cn(
                              "flex gap-3 text-sm text-muted-foreground",
                              idx % 2 === 0 ? "md:flex-row-reverse" : "flex-row"
                            )}>
                              <CheckCircle className="w-5 h-5 text-accent shrink-0" />
                              <span className={cn(idx % 2 === 0 && "md:text-right")}>{milestone}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      
      <Footer />
    </div>
  );
}
