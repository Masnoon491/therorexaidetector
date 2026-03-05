import { Shield } from "lucide-react";

const TopNav = () => {
  return (
    <header className="h-14 border-b border-border bg-surface flex items-center px-6">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Shield className="w-4.5 h-4.5 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold tracking-tight text-foreground">
          Theorex AI Text Detector
        </span>
      </div>
    </header>
  );
};

export default TopNav;
