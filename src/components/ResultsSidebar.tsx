import { Bot, User, BookOpen, FileWarning, SpellCheck, ShieldCheck } from "lucide-react";
import type { ScanResults } from "@/pages/Index";

function SkeletonBar({ width }: { width: string }) {
  return <div className="animate-shimmer rounded h-4" style={{ width }} />;
}

function ScoreGauge({ value, label, isAi }: { value: number; label: string; isAi?: boolean }) {
  const pct = Math.round(value * 100);
  const isHigh = pct >= 60;
  const colorClass = isAi
    ? (isHigh ? "text-destructive" : "text-[hsl(var(--success))]")
    : (isHigh ? "text-[hsl(var(--success))]" : "text-destructive");
  const barColorClass = isAi
    ? (isHigh ? "bg-destructive" : "bg-[hsl(var(--success))]")
    : (isHigh ? "bg-[hsl(var(--success))]" : "bg-destructive");

  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-xs font-medium text-sidebar-foreground/60">{label}</span>
        <span className={`text-2xl font-extrabold tabular-nums ${colorClass}`}>{pct}%</span>
      </div>
      <div className="w-full h-2 rounded-full bg-sidebar-accent overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${barColorClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

interface ResultsSidebarProps {
  results: ScanResults | null;
  isScanning: boolean;
}

const ResultsSidebar = ({ results, isScanning }: ResultsSidebarProps) => {
  return (
    <aside className="w-[360px] lg:w-[420px] bg-sidebar-background text-sidebar-foreground flex flex-col border-l border-sidebar-border">
      {/* Header */}
      <div className="px-6 py-5 border-b border-sidebar-border">
        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-sidebar-foreground/50">
          Analysis Results
        </h3>
      </div>

      <div className="flex-1 px-5 py-5 space-y-4 overflow-y-auto">
        {/* AI Detection Card */}
        <div className="bg-sidebar-accent rounded-xl p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <Bot className="w-4 h-4 text-sidebar-foreground/60" />
            <span className="text-xs font-bold uppercase tracking-wider text-sidebar-foreground/60">AI Detection</span>
          </div>
          {isScanning ? (
            <div className="space-y-3"><SkeletonBar width="80%" /><SkeletonBar width="60%" /></div>
          ) : results?.ai ? (
            <div className="space-y-4">
              <ScoreGauge value={results.ai.score} label="AI Probability" isAi />
              <ScoreGauge value={results.ai.originalScore} label="Human Probability" />
            </div>
          ) : (
            <p className="text-sm text-sidebar-foreground/30">Awaiting scan</p>
          )}
        </div>

        {/* Block-by-Block Analysis */}
        {results?.ai?.blocks && results.ai.blocks.length > 0 && (
          <div className="bg-sidebar-accent rounded-xl p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <Bot className="w-4 h-4 text-sidebar-foreground/60" />
              <span className="text-xs font-bold uppercase tracking-wider text-sidebar-foreground/60">Block Analysis</span>
            </div>
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {results.ai.blocks.map((block, i) => {
                const pct = Math.round(block.fake * 100);
                const isHigh = pct >= 70;
                const isMed = pct >= 40;
                const barColor = isHigh ? "bg-destructive" : isMed ? "bg-[hsl(var(--warning))]" : "bg-[hsl(var(--success))]";
                const textColor = isHigh ? "text-destructive" : isMed ? "text-[hsl(var(--warning))]" : "text-[hsl(var(--success))]";
                return (
                  <div key={i} className="rounded-lg p-3 bg-sidebar-background/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold text-sidebar-foreground/40 uppercase">Block {i + 1}</span>
                      <span className={`text-xs font-bold tabular-nums ${textColor}`}>{pct}% AI</span>
                    </div>
                    <div className="w-full h-1 rounded-full bg-sidebar-background overflow-hidden mb-1.5">
                      <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-[11px] text-sidebar-foreground/40 line-clamp-2 leading-relaxed">{block.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Plagiarism */}
        <div className="bg-sidebar-accent rounded-xl p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <FileWarning className="w-4 h-4 text-sidebar-foreground/60" />
            <span className="text-xs font-bold uppercase tracking-wider text-sidebar-foreground/60">Plagiarism</span>
          </div>
          {isScanning ? (
            <SkeletonBar width="50%" />
          ) : results?.plagiarism ? (
            <div>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-extrabold tabular-nums ${results.plagiarism.score >= 30 ? "text-destructive" : "text-[hsl(var(--success))]"}`}>
                  {Math.round(results.plagiarism.score)}%
                </span>
                <span className="text-xs text-sidebar-foreground/40">similarity</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-sidebar-foreground/30">Awaiting scan</p>
          )}
        </div>

        {/* Readability */}
        <div className="bg-sidebar-accent rounded-xl p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <BookOpen className="w-4 h-4 text-sidebar-foreground/60" />
            <span className="text-xs font-bold uppercase tracking-wider text-sidebar-foreground/60">Readability</span>
          </div>
          {isScanning ? (
            <div className="space-y-2"><SkeletonBar width="70%" /><SkeletonBar width="40%" /></div>
          ) : results?.readability ? (
            <div className="grid grid-cols-2 gap-3">
              {results.readability.fleschReadingEase != null && (
                <div>
                  <p className="text-lg font-extrabold text-sidebar-foreground">{results.readability.fleschReadingEase}</p>
                  <p className="text-[10px] text-sidebar-foreground/40 uppercase">Flesch Ease</p>
                </div>
              )}
              {results.readability.fleschGradeLevel != null && (
                <div>
                  <p className="text-lg font-extrabold text-sidebar-foreground">{results.readability.fleschGradeLevel}</p>
                  <p className="text-[10px] text-sidebar-foreground/40 uppercase">Grade Level</p>
                </div>
              )}
              {results.readability.gunningFoxIndex != null && (
                <div>
                  <p className="text-lg font-extrabold text-sidebar-foreground">{results.readability.gunningFoxIndex}</p>
                  <p className="text-[10px] text-sidebar-foreground/40 uppercase">Gunning Fog</p>
                </div>
              )}
              {results.readability.smogIndex != null && (
                <div>
                  <p className="text-lg font-extrabold text-sidebar-foreground">{results.readability.smogIndex}</p>
                  <p className="text-[10px] text-sidebar-foreground/40 uppercase">SMOG Index</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-sidebar-foreground/30">Awaiting scan</p>
          )}
        </div>

        {/* Grammar */}
        {results?.grammar && results.grammar.length > 0 && (
          <div className="bg-sidebar-accent rounded-xl p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <SpellCheck className="w-4 h-4 text-sidebar-foreground/60" />
              <span className="text-xs font-bold uppercase tracking-wider text-sidebar-foreground/60">
                Grammar ({results.grammar.length} issue{results.grammar.length !== 1 ? "s" : ""})
              </span>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {results.grammar.map((m, i) => (
                <div key={i} className="rounded-lg p-2.5 bg-sidebar-background/50">
                  <p className="text-[11px] text-sidebar-foreground/70 leading-relaxed">{m.message}</p>
                  {m.replacements.length > 0 && (
                    <p className="text-[10px] text-[hsl(var(--success))] mt-1">
                      → {m.replacements.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fact Check */}
        {results?.facts && results.facts.length > 0 && (
          <div className="bg-sidebar-accent rounded-xl p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <ShieldCheck className="w-4 h-4 text-sidebar-foreground/60" />
              <span className="text-xs font-bold uppercase tracking-wider text-sidebar-foreground/60">Fact Check</span>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {results.facts.map((f, i) => (
                <div key={i} className="rounded-lg p-2.5 bg-sidebar-background/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-semibold text-sidebar-foreground/40 uppercase">Claim {i + 1}</span>
                    <span className={`text-[10px] font-bold ${f.truthfulness === "0%" ? "text-sidebar-foreground/30" : "text-[hsl(var(--warning))]"}`}>
                      {f.truthfulness} verified
                    </span>
                  </div>
                  <p className="text-[11px] text-sidebar-foreground/50 line-clamp-2">{f.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="px-6 py-3 border-t border-sidebar-border">
        <p className="text-[10px] text-sidebar-foreground/30 text-center uppercase tracking-wider">
          {results ? "Scan complete" : "Scan content to see results"}
        </p>
      </div>
    </aside>
  );
};

export default ResultsSidebar;
