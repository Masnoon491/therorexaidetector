import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminRole } from "@/hooks/useAdminRole";
import { useNavigate } from "react-router-dom";
import TopNav from "@/components/TopNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Check, X, Loader2, ShieldAlert, Database, Users, ScanSearch, Gift, BarChart3, AlertTriangle, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatDateBD, formatDateTimeBD } from "@/utils/dateFormat";
import { useToast } from "@/hooks/use-toast";
import GiveCreditDialog from "@/components/admin/GiveCreditDialog";

interface Transaction {
  id: string;
  user_id: string;
  trx_id: string;
  plan_name: string;
  credits: number;
  amount_bdt: string;
  status: string;
  created_at: string;
  approved_at: string | null;
  expires_at: string | null;
  user_email?: string;
}

interface UserSummary {
  user_id: string;
  email: string;
  plan_name: string;
  total_purchased: number;
  total_used: number;
  current_balance: number;
  last_ip: string | null;
  activation_date: string | null;
  expiry_date: string | null;
  last_scan_date: string | null;
}

interface ScanAuditEntry {
  id: string;
  user_email: string;
  document_name: string;
  scan_date: string;
  word_count: number;
  credits_used: number;
  ai_score: number | null;
}

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useAdminRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [inventory, setInventory] = useState<{ remaining_credits: number; manual_base_stock: number; updated_at: string } | null>(null);
  const [userSummaries, setUserSummaries] = useState<UserSummary[]>([]);
  const [scanAudit, setScanAudit] = useState<ScanAuditEntry[]>([]);

  // Business summary state
  const [totalActiveSubscriptions, setTotalActiveSubscriptions] = useState(0);
  const [cumulativeUsage, setCumulativeUsage] = useState(0);

  // Stock refill
  const [refillAmount, setRefillAmount] = useState("");

  // Give Credit dialog
  const [creditDialogOpen, setCreditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth?mode=login");
    if (!authLoading && !roleLoading && !isAdmin && user) navigate("/");
  }, [authLoading, roleLoading, isAdmin, user, navigate]);

  const fetchInventory = async () => {
    const { data } = await (supabase as any)
      .from("api_inventory")
      .select("remaining_credits, manual_base_stock, updated_at")
      .limit(1)
      .maybeSingle();
    if (data) setInventory(data);
  };

  const fetchTransactions = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("payment_transactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      const userIds = [...new Set(data.map((t) => t.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, email")
        .in("id", userIds);

      const emailMap = new Map(profiles?.map((p) => [p.id, p.email]) || []);
      setTransactions(
        data.map((t) => ({ ...t, user_email: emailMap.get(t.user_id) || "Unknown" }))
      );
    }
    setLoading(false);
  };

  const fetchUserSummaries = async () => {
    // Get all profiles (every registered user)
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email, last_ip");

    if (!profiles) return;

    const allUserIds = profiles.map((p) => p.id);

    // Get approved transactions
    const { data: txData } = await supabase
      .from("payment_transactions")
      .select("user_id, credits, status, approved_at, expires_at, plan_name, created_at")
      .eq("status", "approved");

    // Get credit balances
    const { data: creditData } = await supabase
      .from("user_credits")
      .select("user_id, balance, expires_at");

    // Get scan usage from scans table
    const { data: scanData } = await supabase
      .from("scans")
      .select("user_id, credits_used, created_at");

    const emailMap = new Map(profiles.map((p) => [p.id, p.email || "Unknown"]));
    const ipMap = new Map(profiles.map((p) => [p.id, p.last_ip || null]));

    // Plan name: latest approved transaction per user
    const planMap = new Map<string, string>();
    const activationMap = new Map<string, string>();
    const expiryFromTxMap = new Map<string, string>();
    const purchasedMap = new Map<string, number>();

    txData?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    txData?.forEach((t) => {
      if (!planMap.has(t.user_id)) planMap.set(t.user_id, t.plan_name);
      purchasedMap.set(t.user_id, (purchasedMap.get(t.user_id) || 0) + t.credits);
      if (t.approved_at && (!activationMap.has(t.user_id) || t.approved_at < activationMap.get(t.user_id)!)) {
        activationMap.set(t.user_id, t.approved_at);
      }
      if (t.expires_at && (!expiryFromTxMap.has(t.user_id) || t.expires_at > expiryFromTxMap.get(t.user_id)!)) {
        expiryFromTxMap.set(t.user_id, t.expires_at);
      }
    });

    // Total used from scans
    const usedMap = new Map<string, number>();
    const lastScanMap = new Map<string, string>();
    scanData?.forEach((s) => {
      usedMap.set(s.user_id, (usedMap.get(s.user_id) || 0) + s.credits_used);
      if (!lastScanMap.has(s.user_id) || s.created_at > lastScanMap.get(s.user_id)!) {
        lastScanMap.set(s.user_id, s.created_at);
      }
    });

    const balanceMap = new Map<string, number>();
    const expiryFromCreditsMap = new Map<string, string | null>();
    creditData?.forEach((c) => {
      balanceMap.set(c.user_id, c.balance);
      expiryFromCreditsMap.set(c.user_id, c.expires_at);
    });

    // Compute business summary
    const now = new Date();
    let activeCount = 0;
    let totalUsage = 0;

    scanData?.forEach((s) => { totalUsage += s.credits_used; });

    const summaries: UserSummary[] = allUserIds.map((userId) => {
      const expiryStr = expiryFromTxMap.get(userId) || expiryFromCreditsMap.get(userId) || null;
      if (expiryStr && new Date(expiryStr) > now) activeCount++;

      return {
        user_id: userId,
        email: emailMap.get(userId) || "Unknown",
        plan_name: planMap.get(userId) || "—",
        total_purchased: purchasedMap.get(userId) || 0,
        total_used: usedMap.get(userId) || 0,
        current_balance: balanceMap.get(userId) || 0,
        last_ip: ipMap.get(userId) || null,
        activation_date: activationMap.get(userId) || null,
        expiry_date: expiryStr,
        last_scan_date: lastScanMap.get(userId) || null,
      };
    });

    setTotalActiveSubscriptions(activeCount);
    setCumulativeUsage(totalUsage);
    setUserSummaries(summaries);
  };

  const fetchScanAudit = async () => {
    const { data: scans } = await supabase
      .from("scans")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (scans) {
      const userIds = [...new Set(scans.map((s: any) => s.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, email")
        .in("id", userIds);
      const emailMap = new Map(profiles?.map((p) => [p.id, p.email || "Unknown"]) || []);

      setScanAudit(
        scans.map((s: any) => ({
          id: s.id,
          user_email: emailMap.get(s.user_id) || "Unknown",
          document_name: s.document_name || "Untitled",
          scan_date: s.created_at,
          word_count: s.word_count,
          credits_used: s.credits_used,
          ai_score: s.ai_score,
        }))
      );
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchTransactions();
      fetchInventory();
      fetchUserSummaries();
      fetchScanAudit();
    }
  }, [isAdmin]);

  // Real-time listeners
  useEffect(() => {
    if (!isAdmin) return;
    const channel = supabase
      .channel("admin_inventory")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "api_inventory" }, (payload) => {
        setInventory((payload.new as any).remaining_credits);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    const channel = supabase
      .channel("admin_transactions")
      .on("postgres_changes", { event: "*", schema: "public", table: "payment_transactions" }, () => {
        fetchTransactions();
        fetchUserSummaries();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    const channel = supabase
      .channel("admin_scans")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "scans" }, () => {
        fetchScanAudit();
        fetchUserSummaries();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    const channel = supabase
      .channel("admin_user_credits")
      .on("postgres_changes", { event: "*", schema: "public", table: "user_credits" }, () => {
        fetchUserSummaries();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [isAdmin]);

  const handleApprove = async (tx: Transaction) => {
    if (inventory !== null && inventory < tx.credits) {
      toast({ title: "Insufficient API Inventory", description: `Need ${tx.credits} credits but only ${inventory} remaining.`, variant: "destructive" });
      return;
    }

    setApprovingId(tx.id);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const { error: txError } = await supabase
      .from("payment_transactions")
      .update({ status: "approved", approved_at: now.toISOString(), expires_at: expiresAt.toISOString() })
      .eq("id", tx.id);

    if (txError) {
      toast({ title: "Error", description: txError.message, variant: "destructive" });
      setApprovingId(null);
      return;
    }

    const { data: currentCredits } = await supabase
      .from("user_credits")
      .select("balance")
      .eq("user_id", tx.user_id)
      .maybeSingle();

    const newBalance = (currentCredits?.balance || 0) + tx.credits;

    const { error: creditError } = await supabase
      .from("user_credits")
      .upsert({
        user_id: tx.user_id,
        balance: newBalance,
        expires_at: expiresAt.toISOString(),
        updated_at: now.toISOString(),
      }, { onConflict: "user_id" });

    if (creditError) {
      toast({ title: "Credit update failed", description: creditError.message, variant: "destructive" });
      setApprovingId(null);
      return;
    }

    if (inventory !== null) {
      const newInventory = inventory - tx.credits;
      await supabase
        .from("api_inventory")
        .update({ remaining_credits: newInventory, updated_at: now.toISOString() })
        .not("id", "is", null);
      setInventory(newInventory);
    }

    toast({ title: "Approved", description: `${tx.credits} credits added. Expires ${formatDateBD(expiresAt)}.` });
    setApprovingId(null);
    fetchTransactions();
    fetchUserSummaries();
  };

  const handleReject = async (tx: Transaction) => {
    setRejectingId(tx.id);
    const { error } = await supabase
      .from("payment_transactions")
      .update({ status: "rejected" })
      .eq("id", tx.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Rejected", description: `Transaction ${tx.trx_id} has been rejected.` });
    }
    setRejectingId(null);
    fetchTransactions();
  };

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNav />
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <ShieldAlert className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-extrabold text-foreground">Theorex Admin Panel</h1>
        </div>

        {/* Global Business Summary */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-card p-5 flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Subscriptions</p>
              <p className="text-2xl font-extrabold text-foreground font-mono tabular-nums">{totalActiveSubscriptions}</p>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-5 flex items-center gap-4">
            <div className="p-3 rounded-full bg-destructive/10">
              <BarChart3 className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cumulative Usage</p>
              <p className="text-2xl font-extrabold text-foreground font-mono tabular-nums">{cumulativeUsage.toLocaleString()} <span className="text-sm font-medium text-muted-foreground">credits</span></p>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-5 flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">API Credit Stock</p>
              <p className="text-2xl font-extrabold text-foreground font-mono tabular-nums">
                {inventory !== null ? inventory.toLocaleString() : "—"}{" "}
                <span className="text-sm font-medium text-muted-foreground">remaining</span>
              </p>
            </div>
          </div>
        </div>

        {/* Master User Table */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">User Management</h2>
          </div>
          <div className="bg-card rounded-lg border border-border overflow-x-auto">
            {userSummaries.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-sm">No registered users yet.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User Email</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead className="text-right">Purchased</TableHead>
                    <TableHead className="text-right">Spent</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>Last Scan</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userSummaries.map((u) => (
                    <TableRow key={u.user_id}>
                      <TableCell className="text-sm font-medium text-foreground">{u.email}</TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="outline" className="text-xs">{u.plan_name}</Badge>
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">{u.last_ip || "—"}</TableCell>
                      <TableCell className="text-sm font-bold text-right text-primary font-mono tabular-nums">{u.total_purchased}</TableCell>
                      <TableCell className="text-sm font-bold text-right text-destructive font-mono tabular-nums">{u.total_used}</TableCell>
                      <TableCell className="text-sm font-bold text-right text-foreground font-mono tabular-nums">{u.current_balance}</TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {u.expiry_date ? formatDateBD(u.expiry_date) : "—"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {u.last_scan_date ? formatDateBD(u.last_scan_date) : "—"}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-xs"
                          onClick={() => { setSelectedUser(u); setCreditDialogOpen(true); }}
                        >
                          <Gift className="w-3.5 h-3.5" /> Give Credit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        {/* Global Scan Audit */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <ScanSearch className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Global Scan Audit</h2>
          </div>
          <div className="bg-card rounded-lg border border-border overflow-x-auto">
            {scanAudit.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-sm">No scans recorded yet.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User Email</TableHead>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Scan Date</TableHead>
                    <TableHead className="text-right">Words</TableHead>
                    <TableHead className="text-right">Credits</TableHead>
                    <TableHead className="text-right">AI Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scanAudit.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="text-sm font-medium text-foreground">{s.user_email}</TableCell>
                      <TableCell className="text-sm text-foreground max-w-[180px] truncate">{s.document_name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap font-mono">{formatDateBD(s.scan_date)}</TableCell>
                      <TableCell className="text-sm font-mono tabular-nums text-right text-foreground">{s.word_count.toLocaleString()}</TableCell>
                      <TableCell className="text-sm font-bold font-mono tabular-nums text-right text-destructive">{s.credits_used}</TableCell>
                      <TableCell className="text-sm font-mono tabular-nums text-right text-foreground">
                        {s.ai_score !== null ? `${s.ai_score}%` : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        {/* Payment Transactions */}
        <h2 className="text-lg font-bold text-foreground mb-3">Payment Transactions</h2>
        <div className="bg-card rounded-lg border border-border overflow-x-auto">
          {loading ? (
            <div className="p-8 flex justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">No payment transactions yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>User Email</TableHead>
                  <TableHead>TrxID</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDateBD(tx.created_at)}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-foreground max-w-[200px] truncate">
                      {tx.user_email}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-foreground">{tx.trx_id}</TableCell>
                    <TableCell className="text-sm">{tx.plan_name}</TableCell>
                    <TableCell className="text-sm font-semibold">{tx.amount_bdt} TK</TableCell>
                    <TableCell className="text-sm font-bold text-primary">{tx.credits}</TableCell>
                    <TableCell>
                      <Badge
                        variant={tx.status === "approved" ? "default" : tx.status === "rejected" ? "destructive" : "secondary"}
                        className={
                          tx.status === "approved"
                            ? "bg-primary text-primary-foreground"
                            : tx.status === "rejected"
                            ? ""
                            : "bg-warning/10 text-warning"
                        }
                      >
                        {tx.status === "approved" ? "Approved" : tx.status === "rejected" ? "Rejected" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {tx.status === "pending" ? (
                        <div className="flex gap-1.5">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(tx)}
                            disabled={approvingId === tx.id}
                            className="gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            {approvingId === tx.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(tx)}
                            disabled={rejectingId === tx.id}
                            className="gap-1"
                          >
                            {rejectingId === tx.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
                            Reject
                          </Button>
                        </div>
                      ) : tx.status === "approved" ? (
                        <span className="text-xs text-muted-foreground">
                          Expires {tx.expires_at ? formatDateBD(tx.expires_at) : "—"}
                        </span>
                      ) : (
                        <span className="text-xs text-destructive font-medium">Rejected</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>

      {/* Give Credit Dialog */}
      {selectedUser && (
        <GiveCreditDialog
          open={creditDialogOpen}
          onOpenChange={setCreditDialogOpen}
          userId={selectedUser.user_id}
          userEmail={selectedUser.email}
          currentBalance={selectedUser.current_balance}
          onComplete={() => { fetchUserSummaries(); fetchInventory(); }}
        />
      )}
    </div>
  );
};

export default Admin;
