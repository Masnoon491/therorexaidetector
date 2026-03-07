import { useState } from "react";
import { History, FileText, Search, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useScanHistory } from "@/hooks/useScanHistory";
import { formatDateTimeBD } from "@/utils/dateFormat";

function getRiskLabel(risk: string | null | undefined, aiScore: number) {
  if (risk && risk.trim()) return risk;
  if (aiScore > 70) return "High Risk";
  if (aiScore < 30) return "Low Risk";
  return "Moderate Risk";
}

function getRiskBadgeClass(risk: string) {
  if (risk === "Low Risk") return "bg-primary/15 text-primary border border-primary/30";
  if (risk === "High Risk") return "bg-destructive/15 text-destructive border border-destructive/30";
  return "bg-secondary text-secondary-foreground border border-border";
}

const ScanHistoryPanel = () => {
  const { history, loading } = useScanHistory();
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? history.filter((entry) => entry.document_name.toLowerCase().includes(search.trim().toLowerCase()))
    : history;

  const totalCreditsSpent = history.reduce((sum, entry) => sum + entry.credits_used, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          Scan History
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          View your past AI scans and identity risk results.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
          <CreditCard className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Credits Spent</p>
          <p className="text-2xl font-extrabold text-foreground tabular-nums">{totalCreditsSpent.toLocaleString()}</p>
        </div>
      </div>

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
            {search.trim() ? "Try a different search term." : "Run your first AI scan to see results here."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border border-border bg-card">
          <Table className="text-xs">
            <TableHeader>
              <TableRow className="bg-secondary hover:bg-secondary">
                <TableHead className="h-10 px-3 font-semibold uppercase tracking-wider">Document Name</TableHead>
                <TableHead className="h-10 px-3 font-semibold uppercase tracking-wider">Date & Time (GMT+6)</TableHead>
                <TableHead className="h-10 px-3 text-center font-semibold uppercase tracking-wider">AI Score</TableHead>
                <TableHead className="h-10 px-3 text-center font-semibold uppercase tracking-wider">Risk</TableHead>
                <TableHead className="h-10 px-3 text-center font-semibold uppercase tracking-wider">Credits Spent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((entry) => {
                const riskLabel = getRiskLabel(entry.risk_assessment, entry.ai_score);
                return (
                  <TableRow key={entry.id}>
                    <TableCell className="py-2.5 px-3 font-semibold text-foreground max-w-[260px] truncate">
                      {entry.document_name}
                    </TableCell>
                    <TableCell className="py-2.5 px-3 text-muted-foreground font-mono text-[11px]">
                      {formatDateTimeBD(entry.created_at)}
                    </TableCell>
                    <TableCell className="py-2.5 px-3 text-center">
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary/15 text-primary border border-primary/30">
                        {entry.ai_score}%
                      </span>
                    </TableCell>
                    <TableCell className="py-2.5 px-3 text-center">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md ${getRiskBadgeClass(riskLabel)}`}>
                        {riskLabel}
                      </span>
                    </TableCell>
                    <TableCell className="py-2.5 px-3 text-center font-mono text-muted-foreground">
                      {entry.credits_used}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ScanHistoryPanel;
