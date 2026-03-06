import { Download, Bot, ShieldCheck, FileWarning, AlertTriangle, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ScanResults } from "@/types/scan";

/* ─── Risk tier helper ─── */
function getRiskTier(pct: number) {
  if (pct <= 14) return { label: "CLEAN", bg: "bg-primary", text: "text-primary-foreground" };
  if (pct <= 39) return { label: "LOW", bg: "bg-[hsl(100,50%,45%)]", text: "text-primary-foreground" };
  if (pct <= 59) return { label: "MEDIUM", bg: "bg-[hsl(var(--warning))]", text: "text-primary-foreground" };
  if (pct <= 84) return { label: "HIGH", bg: "bg-destructive", text: "text-destructive-foreground" };
  return { label: "VERY HIGH", bg: "bg-[hsl(4,74%,38%)]", text: "text-destructive-foreground" };
}

/* ─── Circular Gauge ─── */
function CircularGauge({ value, label, color }: { value: number; label: string; color: "danger" | "success" }) {
  const pct = Math.round(value * 100);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const strokeColor = color === "danger" ? "hsl(var(--destructive))" : "hsl(var(--primary))";
  const textColor = color === "danger" ? "text-destructive" : "text-primary";

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
  if (pct <= 14) { grade = "A"; gradeColor = "bg-primary text-primary-foreground"; }
  else if (pct <= 39) { grade = "B"; gradeColor = "bg-[hsl(100,50%,45%)] text-primary-foreground"; }
  else if (pct <= 59) { grade = "C"; gradeColor = "bg-[hsl(var(--warning))] text-primary-foreground"; }
  else if (pct <= 84) { grade = "D"; gradeColor = "bg-destructive text-destructive-foreground"; }
  else { grade = "F"; gradeColor = "bg-[hsl(4,74%,38%)] text-destructive-foreground"; }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-16 h-16 rounded-lg ${gradeColor} flex items-center justify-center`}>
        <span className="text-3xl font-extrabold">{grade}</span>
      </div>
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Risk Grade</span>
    </div>
  );
}

/* ─── Grading Legend ─── */
const gradeLegend = [
  { grade: "A", label: "VERIFIED CLEAN", range: "0–14%", desc: "Human Authentic", bg: "bg-primary", text: "text-primary-foreground" },
  { grade: "B", label: "LOW RISK", range: "15–39%", desc: "Likely Human", bg: "bg-[hsl(100,50%,45%)]", text: "text-primary-foreground" },
  { grade: "C", label: "MODERATE RISK", range: "40–59%", desc: "Mixed Content", bg: "bg-[hsl(var(--warning))]", text: "text-primary-foreground" },
  { grade: "D", label: "HIGH RISK", range: "60–84%", desc: "Likely AI", bg: "bg-destructive", text: "text-destructive-foreground" },
  { grade: "F", label: "CRITICAL RISK", range: "85–100%", desc: "AI Generated", bg: "bg-[hsl(4,74%,38%)]", text: "text-destructive-foreground" },
];

function GradingLegend() {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center gap-2 mb-5">
        <Award className="w-4 h-4 text-primary" />
        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Grading Legend</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {gradeLegend.map((g) => (
          <div key={g.grade} className="flex flex-col items-center gap-2 p-4 rounded-md bg-secondary border border-border">
            <div className={`w-10 h-10 rounded-md ${g.bg} ${g.text} flex items-center justify-center`}>
              <span className="text-xl font-extrabold">{g.grade}</span>
            </div>
            <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">{g.label}</span>
            <span className="text-[10px] font-mono text-muted-foreground">{g.range}</span>
            <span className="text-[10px] text-muted-foreground text-center">{g.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Sentence Heatmap ─── */
function SentenceHeatmap({ blocks }: { blocks: { text: string; fake: number; real: number }[] }) {
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-secondary">
            <th className="text-left py-2.5 px-3 font-semibold text-muted-foreground uppercase tracking-wider w-16">#</th>
            <th className="text-left py-2.5 px-3 font-semibold text-muted-foreground uppercase tracking-wider">Sentence</th>
            <th className="text-center py-2.5 px-3 font-semibold text-muted-foreground uppercase tracking-wider w-20">AI %</th>
            <th className="text-center py-2.5 px-3 font-semibold text-muted-foreground uppercase tracking-wider w-24">Risk</th>
          </tr>
        </thead>
        <tbody>
          {blocks.map((block, i) => {
            const pct = Math.round(block.fake * 100);
            const tier = getRiskTier(pct);
            const rowBg = i % 2 === 0 ? "bg-card" : "bg-secondary/50";
            return (
              <tr key={i} className={`${rowBg} border-t border-border`}>
                <td className="py-2.5 px-3 font-mono text-muted-foreground">{i + 1}</td>
                <td className="py-2.5 px-3 text-foreground/80 leading-relaxed">{block.text}</td>
                <td className="py-2.5 px-3 text-center font-mono font-bold text-foreground">{pct}%</td>
                <td className="py-2.5 px-3 text-center">
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md ${tier.bg} ${tier.text}`}>
                    {tier.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Stat Card ─── */
function StatCard({ label, value, icon: Icon }: { label: string; value: string | number; icon: React.ElementType }) {
  return (
    <div className="bg-secondary rounded-lg p-4 flex items-center gap-3 border border-border">
      <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
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
    "           THEOREX CONSULTING              ",
    "      AI AUTHENTICITY INTELLIGENCE         ",
    "            ANALYSIS REPORT                ",
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
        const pct = Math.round(b.fake * 100);
        const tier = getRiskTier(pct);
        lines.push(`    ${i + 1}. [${tier.label} ${pct}%] ${b.text}`);
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
    if (results.readability.wordCount != null) lines.push(`  Word Count:  ${results.readability.wordCount}`);
    if (results.readability.sentenceCount != null) lines.push(`  Sentences:   ${results.readability.sentenceCount}`);
    if (results.readability.avgReadingTime != null) lines.push(`  Avg Reading: ${results.readability.avgReadingTime}s`);
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
  lines.push("  Generated by Theorex Consulting          ");
  lines.push("  AI Authenticity Intelligence              ");
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
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-foreground tracking-tight">Analysis Report</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Scanned on {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <Button
          onClick={() => downloadReport(results)}
          variant="outline"
          className="gap-2 font-semibold border-border text-foreground hover:bg-secondary"
        >
          <Download className="w-4 h-4" />
          Download Report
        </Button>
      </div>

      {/* AI Detection — Gauges + Grade */}
      {results.ai && (
        <div className="bg-card rounded-lg border border-border p-6">
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
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Sentence Heatmap</h3>
          </div>
          <div className="flex items-center gap-4 mb-4 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-primary" /> Clean</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[hsl(100,50%,45%)]" /> Low</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[hsl(var(--warning))]" /> Medium</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-destructive" /> High</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[hsl(4,74%,38%)]" /> Very High</span>
          </div>
          <SentenceHeatmap blocks={results.ai.blocks} />
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {results.plagiarism && (
          <StatCard label="Plagiarism" value={`${Math.round(results.plagiarism.score)}%`} icon={FileWarning} />
        )}
        {results.readability?.wordCount != null && (
          <StatCard label="Word Count" value={results.readability.wordCount} icon={Bot} />
        )}
        {results.readability?.sentenceCount != null && (
          <StatCard label="Sentences" value={results.readability.sentenceCount} icon={Bot} />
        )}
      </div>

      {/* Grading Legend */}
      <GradingLegend />

      {/* Fact Check */}
      {results.facts && results.facts.length > 0 && (
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Fact Check</h3>
          </div>
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {results.facts.map((f, i) => (
              <div key={i} className="p-3 rounded-md bg-secondary border border-border">
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
