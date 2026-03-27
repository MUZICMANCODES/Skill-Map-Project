import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full py-8 mt-auto border-t border-white/5 bg-background/50">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Built by</span>
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]">
            MAHROOS KARIPPATHODIKA
          </span>
        </div>
        <p className="text-xs text-muted-foreground/60">
          Empowering your future with AI-driven pathways.
        </p>
      </div>
    </footer>
  );
}
