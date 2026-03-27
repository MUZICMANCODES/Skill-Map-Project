import { Link, useLocation } from "wouter";
import { Map, LogOut, User } from "lucide-react";
import { useAuthStore, useResultStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, logout } = useAuthStore();
  const { clearResults } = useResultStore();
  const [, setLocation] = useLocation();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    clearResults();
    setLocation("/login");
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-20 border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all">
            <Map className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">
            Skill<span className="text-primary">Map</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground/80">
              Welcome, <span className="text-foreground">{user.name}</span>
            </span>
          </div>
          
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
              "text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
            )}
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
