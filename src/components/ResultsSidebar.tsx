import { Bot, User, BookOpen } from "lucide-react";
import type { ScanResults } from "@/pages/Index";

interface ResultItem {
  icon: React.ElementType;
  label: string;
  sublabel: string;
  getValue: (r: ScanResults) => string | null;
}

const resultSlots: ResultItem[] = [
  {
    icon: Bot,
    label: "AI Score",
    sublabel: "Probability of AI generation",
    getValue: (r) => r.ai ? `${Math.round(r.ai.score * 100)}%` : null,
  },
  {
    icon: User,
    label: "Human Score",
    sublabel: "Probability of human authorship",
    getValue: (r) => r.ai ? `${Math.round((1 - r.ai.score) * 100)}%` : null,
  },
  {
    icon: BookOpen,
    label: "Readability Grade",
    sublabel: "Flesch-Kincaid level",
    getValue: (r) => r.readability?.grade || (r.readability?.score != null ? String(r.readability.score) : null),
  },
];

function SkeletonBar({ width }: { width: string }) {
  return <div className="animate-shimmer rounded-md h-5" style={{ width }} />;
}

interface ResultsSidebarProps {
  results: ScanResults | null;
  isScanning: boolean;
}

const ResultsSidebar = ({ results, isScanning }: ResultsSidebarProps) => {
  return (
    <aside className="w-80 lg:w-96 bg-navy text-navy-foreground flex flex-col">
      <div className="px-6 py-5 border-b border-navy-light">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-navy-foreground/60">
          Analysis Results
        </h3>
      </div>

      <div className="flex-1 px-6 py-6 space-y-6">
        {resultSlots.map((slot) => {
          const value = results ? slot.getValue(results) : null;

          return (
            <div key={slot.label} className="bg-navy-light rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
                  <slot.icon className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy-foreground">{slot.label}</p>
                  <p className="text-xs text-navy-foreground/50">{slot.sublabel}</p>
                </div>
              </div>

              {isScanning ? (
                <div className="space-y-2.5">
                  <SkeletonBar width="75%" />
                  <SkeletonBar width="50%" />
                </div>
              ) : results ? (
                <p className="text-2xl font-bold text-primary">{value ?? "N/A"}</p>
              ) : (
                <p className="text-sm text-navy-foreground/40">Awaiting scan</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="px-6 py-4 border-t border-navy-light">
        <p className="text-xs text-navy-foreground/40 text-center">
          {results ? "Scan complete" : "Scan content to see detailed results"}
        </p>
      </div>
    </aside>
  );
};

export default ResultsSidebar;
