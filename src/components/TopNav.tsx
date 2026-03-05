import { Shield } from "lucide-react";

const MosaicStrip = () => (
  <div className="h-1.5 w-full flex">
    {/* Repeating geometric color blocks inspired by Theorex logo palette */}
    {Array.from({ length: 40 }).map((_, i) => {
      const colors = [
        "bg-[hsl(var(--primary))]",       // teal
        "bg-[hsl(var(--purple))]",         // purple
        "bg-[hsl(var(--orange))]",         // orange
        "bg-[hsl(122,39%,49%)]",           // green
        "bg-[hsl(var(--destructive))]",    // red
        "bg-[hsl(var(--warning))]",        // yellow
        "bg-[hsl(330,65%,55%)]",           // pink
        "bg-[hsl(var(--navy))]",           // navy
      ];
      return (
        <div
          key={i}
          className={`flex-1 ${colors[i % colors.length]}`}
        />
      );
    })}
  </div>
);

const TopNav = () => {
  return (
    <header className="sticky top-0 z-50">
      <div className="bg-navy">
        <div className="max-w-5xl mx-auto px-6 py-5 flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-navy-foreground">
                Theorex
              </span>
              <span className="text-xs font-semibold text-primary tracking-wide">
                AI Text Detector
              </span>
            </div>
          </div>
          <p className="text-[11px] text-navy-foreground/50 tracking-wide mt-0.5">
            AI Authenticity Intelligence • Promoting Transparency Over Mere Detection
          </p>
        </div>
      </div>
      <MosaicStrip />
    </header>
  );
};

export { MosaicStrip };
export default TopNav;
