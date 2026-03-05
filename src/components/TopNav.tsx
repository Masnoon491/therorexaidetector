import { Shield } from "lucide-react";

const TopNav = () => {
  return (
    <header className="h-auto border-b border-border bg-card sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col items-center gap-1">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-extrabold tracking-tight text-[hsl(var(--navy))]">
              THEOREX
            </span>
            <span className="text-lg font-semibold text-primary">
              Consulting
            </span>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground tracking-wide">
          AI Authenticity Intelligence • Promoting Transparency Over Mere Detection
        </p>
      </div>
    </header>
  );
};

export default TopNav;
