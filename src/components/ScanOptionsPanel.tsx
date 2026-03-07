import { Bot, FileWarning, BookOpen, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

/* Mini half-circle gauge */
function MiniGauge({ color }: { color: string }) {
  return (
    <svg width="64" height="36" viewBox="0 0 64 36">
      <path d="M 6 34 A 26 26 0 0 1 58 34" fill="none" stroke="hsl(var(--muted))" strokeWidth="5" strokeLinecap="round" />
      <path d="M 6 34 A 26 26 0 0 1 32 8" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.25" />
    </svg>
  );
}

export interface ScanOptions {
  aiScore: boolean;
  plagiarism: boolean;
  readability: boolean;
}

interface ScanOptionsPanelProps {
  options: ScanOptions;
  onOptionsChange: (options: ScanOptions) => void;
  onScan: () => void;
  isScanning: boolean;
  wordCount: number;
  disabled?: boolean;
  hasDocName?: boolean;
  contextConfirmed?: boolean;
}

function ScanOptionCard({
  checked,
  onToggle,
  title,
  subtitle,
  gaugeColor,
}: {
  checked: boolean;
  onToggle: () => void;
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  gaugeColor: string;
}) {
  return (
    <div
      onClick={onToggle}
      className={`relative flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
        checked ? "border-primary bg-primary/5" : "border-border bg-card hover:border-muted-foreground/30"
      }`}
    >
      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${checked ? "bg-primary border-primary" : "border-muted-foreground/40 bg-card"}`}>
        {checked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {subtitle && (
          <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
            {subtitle}
            <Info className="w-3 h-3 text-muted-foreground/50" />
          </p>
        )}
      </div>
      <div className="shrink-0">
        <MiniGauge color={gaugeColor} />
      </div>
    </div>
  );
}

const ScanOptionsPanel = ({ options, onOptionsChange, onScan, isScanning, wordCount, disabled, hasDocName = true, contextConfirmed = false }: ScanOptionsPanelProps) => {
  const selectedCount = [options.aiScore, options.plagiarism, options.readability].filter(Boolean).length;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border">
        <p className="text-xs font-semibold text-primary text-right">
          {selectedCount} / 3 Scan Types Selected
        </p>
      </div>

      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        <ScanOptionCard checked={options.aiScore} onToggle={() => onOptionsChange({ ...options, aiScore: !options.aiScore })} icon={Bot} title="AI Score" subtitle="Model: Lite 1.0.2" gaugeColor="hsl(var(--destructive))" />
        <ScanOptionCard checked={options.plagiarism} onToggle={() => onOptionsChange({ ...options, plagiarism: !options.plagiarism })} icon={FileWarning} title="Plagiarism Score" subtitle="Enter urls to exclude" gaugeColor="hsl(var(--primary))" />
        <ScanOptionCard checked={options.readability} onToggle={() => onOptionsChange({ ...options, readability: !options.readability })} icon={BookOpen} title="Readability Score" subtitle="" gaugeColor="hsl(var(--warning))" />
      </div>

      <div className="p-4 border-t border-border">
        <p className="text-[11px] text-muted-foreground text-center">
          Use the <span className="font-semibold text-primary">Scan for AI</span> button below the editor to start scanning.
        </p>
      </div>
    </div>
  );
};

export default ScanOptionsPanel;
