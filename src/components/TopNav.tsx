import { Mail, MessageCircle, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const TopNav = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold tracking-tight text-foreground">
              THEOREX
            </span>
            <span className="text-xl font-bold text-primary">
              Consulting
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground tracking-wide mt-0.5">
            AI Authenticity Intelligence • Promoting Transparency Over Mere Detection
          </p>
        </div>

        {/* Right side: contact + auth */}
        <div className="flex items-center gap-5">
          {/* Contact - hidden on small screens */}
          <div className="hidden md:flex items-center gap-5">
            <a
              href="https://wa.me/8801819185751"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-primary transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              01819185751
            </a>
            <a
              href="mailto:salestheorex@gmail.com"
              className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              salestheorex@gmail.com
            </a>
          </div>

          {/* Auth buttons */}
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="hidden sm:inline text-xs font-medium text-foreground max-w-[120px] truncate">
                  {user.email}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/auth")}
                className="text-xs font-semibold border-foreground/20 text-foreground hover:bg-muted"
              >
                Login
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/auth")}
                className="text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNav;
