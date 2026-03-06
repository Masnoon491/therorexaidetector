import { Mail, MessageCircle, LogOut, User, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminRole } from "@/hooks/useAdminRole";
import { usePendingCount } from "@/hooks/usePendingCount";
import { Button } from "@/components/ui/button";

const LandingNav = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { isAdmin } = useAdminRole();
  const pendingCount = usePendingCount();

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold tracking-tight text-foreground">THEOREX</span>
            <span className="text-xl font-bold text-primary">Consulting</span>
          </div>
          <p className="text-[10px] text-muted-foreground tracking-wide mt-0.5">
            AI Authenticity Intelligence
          </p>
        </a>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </a>
          <a href="mailto:salestheorex@gmail.com" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </a>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Admin badge */}
          {isAdmin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin")}
              className="relative gap-1.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[16px] h-4 px-1 text-[9px] font-bold rounded-full bg-destructive text-destructive-foreground">
                  {pendingCount}
                </span>
              )}
            </Button>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="text-xs font-semibold border-primary text-primary hover:bg-primary/10"
              >
                Dashboard
              </Button>
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-xs font-medium text-foreground max-w-[120px] truncate">
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
                onClick={() => navigate("/auth?mode=login")}
                className="text-xs font-semibold border-foreground/20 text-foreground hover:bg-muted"
              >
                Login
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/auth?mode=signup")}
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

export default LandingNav;
