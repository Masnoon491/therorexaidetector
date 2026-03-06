import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Loader2, Receipt } from "lucide-react";
import { formatDateBD } from "@/utils/dateFormat";

interface Transaction {
  id: string;
  trx_id: string;
  plan_name: string;
  amount_bdt: string;
  credits: number;
  status: string;
  created_at: string;
  approved_at: string | null;
  expires_at: string | null;
}

export function PaymentHistory() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("payment_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setTransactions(data);
        setLoading(false);
      });
  }, [user]);

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground text-sm">
        No payment history yet.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Receipt className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Payment History</h3>
      </div>
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>TrxID</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDateBD(tx.created_at)}
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
