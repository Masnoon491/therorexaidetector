import { Shield } from "lucide-react";

const TopNav = () => {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center px-8">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-foreground flex items-center justify-center">
          <Shield className="w-5 h-5 text-card" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold tracking-tight text-foreground leading-tight">
            Theorex AI
          </span>
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
            Text Detector
          </span>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
