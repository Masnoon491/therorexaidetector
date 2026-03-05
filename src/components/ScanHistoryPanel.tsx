import { History, FileText } from "lucide-react";
import { useScanHistory } from "@/hooks/useScanHistory";

function getRiskLabel(score: number | null) {
  if (score === null) return { label: "N/A", className: "bg-muted text-muted-foreground" };
  const pct = Math.round(score * 100);
  if (pct <= 14) return { label: "CLEAN", className: "bg-primary text-primary-foreground" };
  if (pct <= 39) return { label: "LOW", className: "bg-[hsl(100,50%,45%)] text-primary-foreground" };
  if (pct <= 59) return { label: "MEDIUM", className: "bg-[hsl(var(--warning))] text-primary-foreground" };
  if (pct <= 84) return { label: "HIGH", className: "bg-destructive text-destructive-foreground" };
  return { label: "VERY HIGH", className: "bg-[hsl(4,74%,38%)] text-destructive-foreground" };
}

const ScanHistoryPanel = () => {
  const { history, loading } = useScanHistory();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          Scan History
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          View your past AI text audits and results.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-md animate-shimmer" />
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <FileText className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm font-semibold text-muted-foreground">No scans yet</p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Run your first AI audit to see results here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-secondary">
                <th className="text-left py-2.5 px-3 font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="text-left py-2.5 px-3 font-semibold text-muted-foreground uppercase tracking-wider">Title</th>
                <th className="text-center py-2.5 px-3 font-semibold text-muted-foreground uppercase tracking-wider">Words</th>
                <th className="text-center py-2.5 px-3 font-semibold text-muted-foreground uppercase tracking-wider">AI Score</th>
                <th className="text-center py-2.5 px-3 font-semibold text-muted-foreground uppercase tracking-wider">Risk</th>
                <th className="text-center py-2.5 px-3 font-semibold text-muted-foreground uppercase tracking-wider">Credits</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry, i) => {
                const risk = getRiskLabel(entry.ai_score);
                const rowBg = i % 2 === 0 ? "bg-card" : "bg-secondary/50";
                return (
                  <tr key={entry.id} className={`${rowBg} border-t border-border`}>
                    <td className="py-2.5 px-3 text-muted-foreground font-mono">
                      {new Date(entry.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </td>
                    <td className="py-2.5 px-3 text-foreground font-medium max-w-[200px] truncate">
                      {entry.title}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-foreground">
                      {entry.word_count.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-foreground">
                      {entry.ai_score !== null ? `${Math.round(entry.ai_score * 100)}%` : "—"}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md ${risk.className}`}>
                        {risk.label}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-muted-foreground">
                      {entry.credits_used}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ScanHistoryPanel;
