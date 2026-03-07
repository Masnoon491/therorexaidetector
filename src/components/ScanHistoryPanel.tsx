import { useState } from "react";
import { History, FileText, Search, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useScanHistory } from "@/hooks/useScanHistory";
import { formatDateTimeBD } from "@/utils/dateFormat";

function getRiskLabel(score: number | null) {
  if (score === null) return { label: "N/A", className: "bg-muted text-muted-foreground" };
  const pct = Math.round(score * 100);
  if (pct <= 30) return { label: "Low Risk", className: "bg-[#00B894] text-white" };
  if (pct <= 70) return { label: "Moderate Risk", className: "bg-[hsl(var(--warning))] text-white" };
  return { label: "High Risk", className: "bg-destructive text-destructive-foreground" };
}

function getScoreBadgeClass(score: number | null) {
  if (score === null) return "bg-muted text-muted-foreground";
  const pct = Math.round(score * 100);
  if (pct <= 30) return "bg-[#00B894]/15 text-[#00B894] border border-[#00B894]/30";
  if (pct <= 70) return "bg-[hsl(var(--warning))]/15 text-[hsl(var(--warning))] border border-[hsl(var(--warning))]/30";
  return "bg-destructive/15 text-destructive border border-destructive/30";
}

const ScanHistoryPanel = () => {
  const { history, loading } = useScanHistory();
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? history.filter((e) => e.title.toLowerCase().includes(search.trim().toLowerCase()))
    : history;

  const totalCreditsSpent = history.reduce((sum, e) => sum + e.credits_used, 0);

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

      {/* Summary Card */}
      <div className="bg-[#1B263B] rounded-lg p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-[#00B894]/20 flex items-center justify-center shrink-0">
          <CreditCard className="w-5 h-5 text-[#00B894]" />
        </div>
        <div>
          <p className="text-xs font-medium text-white/60 uppercase tracking-wider">Total Credits Spent</p>
          <p className="text-2xl font-extrabold text-white tabular-nums">{totalCreditsSpent.toLocaleString()}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs font-medium text-white/60 uppercase tracking-wider">Total Scans</p>
          <p className="text-2xl font-extrabold text-white tabular-nums">{history.length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by document name…"
          className="pl-9 h-9 text-sm"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-md animate-shimmer" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <FileText className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm font-semibold text-muted-foreground">
            {search.trim() ? "No matching documents" : "No scans yet"}
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            {search.trim() ? "Try a different search term." : "Run your first AI audit to see results here."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-secondary">
                <th className="text-left py-2.5 px-3 font-semibold text-muted-foreground uppercase tracking-wider">Document</th>
                <th className="text-left py-2.5 px-3 font-semibold text-muted-foreground uppercase tracking-wider">Date & Time</th>
                <th className="text-center py-2.5 px-3 font-semibold text-muted-foreground uppercase tracking-wider">Words</th>
                <th className="text-center py-2.5 px-3 font-semibold text-muted-foreground uppercase tracking-wider">AI Score</th>
                <th className="text-center py-2.5 px-3 font-semibold text-muted-foreground uppercase tracking-wider">Risk Level</th>
                <th className="text-center py-2.5 px-3 font-semibold text-muted-foreground uppercase tracking-wider">Credits</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry, i) => {
                const risk = getRiskLabel(entry.ai_score);
                const scoreBadge = getScoreBadgeClass(entry.ai_score);
                const rowBg = i % 2 === 0 ? "bg-card" : "bg-secondary/50";
                return (
                  <tr key={entry.id} className={`${rowBg} border-t border-border`}>
                    <td className="py-2.5 px-3 max-w-[200px]">
                      <span className="font-bold text-[#1B263B] dark:text-foreground truncate block">{entry.title}</span>
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground font-mono text-[11px]">
                      {formatDateTimeBD(entry.created_at)}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-foreground">
                      {entry.word_count.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md ${scoreBadge}`}>
                        {entry.ai_score !== null ? `${Math.round(entry.ai_score * 100)}%` : "—"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md ${risk.className}`}>
                        {risk.label}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-muted-foreground">
                      {entry.credits_used} Credits
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
