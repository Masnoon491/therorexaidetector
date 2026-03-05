import { Shield } from "lucide-react";

const TopNav = () => {
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto h-full flex items-center px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--teal))] to-[hsl(var(--teal-glow))] flex items-center justify-center shadow-lg shadow-[hsl(var(--teal))/0.2]">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-extrabold tracking-tight text-foreground leading-none">
              THEOREX
            </span>
            <span className="text-[10px] font-semibold text-primary uppercase tracking-[0.2em] mt-0.5">
              AI Text Detector
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
