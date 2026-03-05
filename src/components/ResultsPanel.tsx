import { Download, Bot, ShieldCheck, BookOpen, SpellCheck, FileWarning, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ScanResults } from "@/pages/Index";

/* ─── Circular Gauge ─── */
function CircularGauge({ value, label, color }: { value: number; label: string; color: "danger" | "success" }) {
  const pct = Math.round(value * 100);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const strokeColor = color === "danger" ? "hsl(var(--destructive))" : "hsl(var(--success))";
  const textColor = color === "danger" ? "text-destructive" : "text-[hsl(var(--success))]";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
          <circle
            cx="48" cy="48" r={radius} fill="none"
            stroke={strokeColor} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="animate-gauge transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-extrabold font-mono tabular-nums ${textColor}`}>{pct}%</span>
        </div>
      </div>
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
    </div>
  );
}

/* ─── Grade Badge ─── */
function GradeBadge({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  let grade: string;
  let gradeColor: string;
  if (pct <= 15) { grade = "A"; gradeColor = "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]"; }
  else if (pct <= 30) { grade = "B"; gradeColor = "bg-[hsl(var(--success))]/80 text-[hsl(var(--success-foreground))]"; }
  else if (pct <= 50) { grade = "C"; gradeColor = "bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))]"; }
  else if (pct <= 75) { grade = "D"; gradeColor = "bg-destructive/80 text-destructive-foreground"; }
  else { grade = "F"; gradeColor = "bg-destructive text-destructive-foreground"; }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-16 h-16 rounded-2xl ${gradeColor} flex items-center justify-center shadow-lg`}>
        <span className="text-3xl font-extrabold">{grade}</span>
      </div>
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Risk Grade</span>
    </div>
  );
}

/* ─── Sentence Heatmap ─── */
function SentenceHeatmap({ blocks }: { blocks: { text: string; fake: number; real: number }[] }) {
  return (
    <div className="space-y-1">
      {blocks.map((block, i) => {
        const pct = Math.round(block.fake * 100);
        let bg: string;
        let border: string;
        let badge: string;
        if (pct >= 70) {
          bg = "bg-destructive/10"; border = "border-destructive/30"; badge = "bg-destructive text-destructive-foreground";
        } else if (pct >= 40) {
          bg = "bg-[hsl(var(--warning))]/10"; border = "border-[hsl(var(--warning))]/30"; badge = "bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))]";
        } else {
          bg = "bg-[hsl(var(--success))]/10"; border = "border-[hsl(var(--success))]/30"; badge = "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]";
        }
        return (
          <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${bg} ${border} transition-all hover:opacity-90`}>
            <span className={`shrink-0 mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-md ${badge}`}>
              {pct}%
            </span>
            <p className="text-xs text-foreground/80 leading-relaxed">{block.text}</p>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Stat Card ─── */
function StatCard({ label, value, icon: Icon }: { label: string; value: string | number; icon: React.ElementType }) {
  return (
    <div className="bg-muted/50 rounded-xl p-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="text-lg font-extrabold text-foreground font-mono tabular-nums">{value}</p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{label}</p>
      </div>
    </div>
  );
}

/* ─── Download Report ─── */
function downloadReport(results: ScanResults) {
  const lines: string[] = [
    "═══════════════════════════════════════════",
    "           THEOREX AI TEXT DETECTOR         ",
    "              ANALYSIS REPORT               ",
    "═══════════════════════════════════════════",
    "",
    `Date: ${new Date().toLocaleString()}`,
    "",
    "───────────────────────────────────────────",
    "  AI DETECTION",
    "───────────────────────────────────────────",
  ];

  if (results.ai) {
    lines.push(`  AI Risk Score:      ${Math.round(results.ai.score * 100)}%`);
    lines.push(`  Human Originality:  ${Math.round(results.ai.originalScore * 100)}%`);
    lines.push(`  Classification:     ${results.ai.classification}`);
    lines.push("");
    if (results.ai.blocks.length > 0) {
      lines.push("  SENTENCE-LEVEL ANALYSIS:");
      results.ai.blocks.forEach((b, i) => {
        lines.push(`    [${Math.round(b.fake * 100)}% AI] ${b.text}`);
      });
    }
  }

  if (results.plagiarism) {
    lines.push("");
    lines.push("───────────────────────────────────────────");
    lines.push("  PLAGIARISM");
    lines.push("───────────────────────────────────────────");
    lines.push(`  Similarity Score: ${Math.round(results.plagiarism.score)}%`);
  }

  if (results.readability) {
    lines.push("");
    lines.push("───────────────────────────────────────────");
    lines.push("  READABILITY");
    lines.push("───────────────────────────────────────────");
    if (results.readability.fleschReadingEase != null) lines.push(`  Flesch Reading Ease:  ${results.readability.fleschReadingEase}`);
    if (results.readability.fleschGradeLevel != null) lines.push(`  Flesch Grade Level:   ${results.readability.fleschGradeLevel}`);
    if (results.readability.gunningFoxIndex != null) lines.push(`  Gunning Fog Index:    ${results.readability.gunningFoxIndex}`);
    if (results.readability.smogIndex != null) lines.push(`  SMOG Index:           ${results.readability.smogIndex}`);
  }

  if (results.grammar && results.grammar.length > 0) {
    lines.push("");
    lines.push("───────────────────────────────────────────");
    lines.push(`  GRAMMAR & SPELLING (${results.grammar.length} issues)`);
    lines.push("───────────────────────────────────────────");
    results.grammar.forEach((m) => {
      lines.push(`  • ${m.message}`);
      if (m.replacements.length) lines.push(`    Suggestion: ${m.replacements.join(", ")}`);
    });
  }

  if (results.facts && results.facts.length > 0) {
    lines.push("");
    lines.push("───────────────────────────────────────────");
    lines.push("  FACT CHECK");
    lines.push("───────────────────────────────────────────");
    results.facts.forEach((f) => {
      lines.push(`  [${f.truthfulness}] ${f.fact}`);
      lines.push(`    → ${f.explanation}`);
    });
  }

  lines.push("");
  lines.push("═══════════════════════════════════════════");
  lines.push("  Generated by Theorex AI Text Detector    ");
  lines.push("═══════════════════════════════════════════");

  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `theorex-report-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ─── Main Results Panel ─── */
interface ResultsPanelProps {
  results: ScanResults | null;
}

const ResultsPanel = ({ results }: ResultsPanelProps) => {
  if (!results) return null;

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-foreground tracking-tight">Analysis Report</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Scanned on {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <Button
          onClick={() => downloadReport(results)}
          variant="outline"
          className="gap-2 font-semibold border-primary/30 text-primary hover:bg-primary/10"
        >
          <Download className="w-4 h-4" />
          Download Report
        </Button>
      </div>

      {/* AI Detection — Gauges + Grade */}
      {results.ai && (
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center gap-2 mb-6">
            <Bot className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">AI Detection</h3>
          </div>
          <div className="flex items-center justify-around flex-wrap gap-6">
            <CircularGauge value={results.ai.score} label="AI Risk" color="danger" />
            <CircularGauge value={results.ai.originalScore} label="Human Originality" color="success" />
            <GradeBadge score={results.ai.score} />
          </div>
        </div>
      )}

      {/* Sentence Heatmap */}
      {results.ai?.blocks && results.ai.blocks.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Sentence Heatmap</h3>
          </div>
          <div className="flex items-center gap-4 mb-4 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[hsl(var(--success))]" /> Human</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[hsl(var(--warning))]" /> Mixed</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-destructive" /> AI Generated</span>
          </div>
          <SentenceHeatmap blocks={results.ai.blocks} />
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {results.plagiarism && (
          <StatCard label="Plagiarism" value={`${Math.round(results.plagiarism.score)}%`} icon={FileWarning} />
        )}
        {results.readability?.fleschReadingEase != null && (
          <StatCard label="Flesch Ease" value={results.readability.fleschReadingEase} icon={BookOpen} />
        )}
        {results.readability?.fleschGradeLevel != null && (
          <StatCard label="Grade Level" value={results.readability.fleschGradeLevel} icon={BookOpen} />
        )}
        {results.readability?.gunningFoxIndex != null && (
          <StatCard label="Gunning Fog" value={results.readability.gunningFoxIndex} icon={BookOpen} />
        )}
        {results.readability?.smogIndex != null && (
          <StatCard label="SMOG Index" value={results.readability.smogIndex} icon={BookOpen} />
        )}
        {results.grammar && (
          <StatCard label="Grammar Issues" value={results.grammar.length} icon={SpellCheck} />
        )}
      </div>

      {/* Grammar Details */}
      {results.grammar && results.grammar.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <SpellCheck className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Grammar & Spelling</h3>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {results.grammar.map((m, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/50 border border-border">
                <p className="text-xs text-foreground/80">{m.message}</p>
                {m.replacements.length > 0 && (
                  <p className="text-[10px] text-[hsl(var(--success))] mt-1 font-medium">→ {m.replacements.join(", ")}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fact Check */}
      {results.facts && results.facts.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Fact Check</h3>
          </div>
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {results.facts.map((f, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Claim {i + 1}</span>
                  <span className={`text-[10px] font-bold ${f.truthfulness === "0%" ? "text-muted-foreground" : "text-[hsl(var(--warning))]"}`}>
                    {f.truthfulness} verified
                  </span>
                </div>
                <p className="text-xs text-foreground/60 leading-relaxed">{f.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsPanel;
