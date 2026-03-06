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
import { Check, Loader2, ShieldAlert, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useAdminRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [inventory, setInventory] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth?mode=login");
    if (!authLoading && !roleLoading && !isAdmin && user) navigate("/");
  }, [authLoading, roleLoading, isAdmin, user, navigate]);

  const fetchInventory = async () => {
    const { data } = await supabase
      .from("api_inventory")
      .select("remaining_credits")
      .limit(1)
      .maybeSingle();
    if (data) setInventory(data.remaining_credits);
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

  useEffect(() => {
    if (isAdmin) {
      fetchTransactions();
      fetchInventory();
    }
  }, [isAdmin]);

  const handleApprove = async (tx: Transaction) => {
    if (inventory !== null && inventory < tx.credits) {
      toast({ title: "Insufficient API Inventory", description: `Need ${tx.credits} credits but only ${inventory} remaining.`, variant: "destructive" });
      return;
    }

    setApprovingId(tx.id);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // 1. Update transaction status
    const { error: txError } = await supabase
      .from("payment_transactions")
      .update({
        status: "approved",
        approved_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
      })
      .eq("id", tx.id);

    if (txError) {
      toast({ title: "Error", description: txError.message, variant: "destructive" });
      setApprovingId(null);
      return;
    }

    // 2. Add credits to user (triggers realtime update to sidebar)
    const { data: currentCredits } = await supabase
      .from("user_credits")
      .select("balance")
      .eq("user_id", tx.user_id)
      .maybeSingle();

    const newBalance = (currentCredits?.balance || 0) + tx.credits;

    const { error: creditError } = await supabase
      .from("user_credits")
      .update({
        balance: newBalance,
        expires_at: expiresAt.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq("user_id", tx.user_id);

    if (creditError) {
      toast({ title: "Credit update failed", description: creditError.message, variant: "destructive" });
      setApprovingId(null);
      return;
    }

    // 3. Deduct from API inventory
    if (inventory !== null) {
      const newInventory = inventory - tx.credits;
      await supabase
        .from("api_inventory")
        .update({ remaining_credits: newInventory, updated_at: now.toISOString() })
        .not("id", "is", null); // update the singleton row
      setInventory(newInventory);
    }

    toast({ title: "Approved", description: `${tx.credits} credits added. Expires ${expiresAt.toLocaleDateString()}.` });
    setApprovingId(null);
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
          <h1 className="text-2xl font-extrabold text-foreground">Admin — Payment Verification</h1>
        </div>

        {/* API Inventory Card */}
        <div className="mb-6 rounded-lg border border-border bg-card p-5 flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Database className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Remaining API Inventory</p>
            <p className="text-2xl font-extrabold text-foreground font-mono tabular-nums">
              {inventory !== null ? inventory.toLocaleString() : "—"}{" "}
              <span className="text-sm font-medium text-muted-foreground">/ 15,000 credits</span>
            </p>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {loading ? (
            <div className="p-8 flex justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No payment transactions yet.
            </div>
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
                      {new Date(tx.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-foreground max-w-[200px] truncate">
                      {tx.user_email}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-foreground">
                      {tx.trx_id}
                    </TableCell>
                    <TableCell className="text-sm">{tx.plan_name}</TableCell>
                    <TableCell className="text-sm font-semibold">{tx.amount_bdt} TK</TableCell>
                    <TableCell className="text-sm font-bold text-primary">{tx.credits}</TableCell>
                    <TableCell>
                      <Badge
                        variant={tx.status === "approved" ? "default" : "secondary"}
                        className={tx.status === "approved" ? "bg-primary text-primary-foreground" : "bg-warning/10 text-warning"}
                      >
                        {tx.status === "approved" ? "Approved" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {tx.status === "pending" ? (
                        <Button
                          size="sm"
                          onClick={() => handleApprove(tx)}
                          disabled={approvingId === tx.id}
                          className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          {approvingId === tx.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Check className="w-3.5 h-3.5" />
                          )}
                          Approve
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Expires {tx.expires_at ? new Date(tx.expires_at).toLocaleDateString() : "—"}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
