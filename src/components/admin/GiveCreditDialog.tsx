import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GiveCreditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userEmail: string;
  currentBalance: number;
  onComplete: () => void;
}

const GiveCreditDialog = ({ open, onOpenChange, userId, userEmail, currentBalance, onComplete }: GiveCreditDialogProps) => {
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    const credits = parseInt(amount);
    if (!credits || credits <= 0) {
      toast({ title: "Invalid amount", description: "Enter a positive number.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // 1. Upsert user_credits
    const { error: creditError } = await supabase
      .from("user_credits")
      .upsert({
        user_id: userId,
        balance: currentBalance + credits,
        expires_at: expiresAt.toISOString(),
        updated_at: now.toISOString(),
      }, { onConflict: "user_id" });

    if (creditError) {
      toast({ title: "Credit update failed", description: creditError.message, variant: "destructive" });
      setSubmitting(false);
      return;
    }

    // 2. Deduct from api_inventory
    await supabase
      .from("api_inventory")
      .update({ remaining_credits: supabase.rpc ? undefined : 0, updated_at: now.toISOString() })
      .not("id", "is", null);

    // Use a direct approach: read then update
    const { data: inv } = await supabase.from("api_inventory").select("remaining_credits").limit(1).maybeSingle();
    if (inv) {
      await supabase
        .from("api_inventory")
        .update({ remaining_credits: inv.remaining_credits - credits, updated_at: now.toISOString() })
        .not("id", "is", null);
    }

    // 3. Log as manual admin adjustment
    const { error: txError } = await supabase
      .from("payment_transactions")
      .insert({
        user_id: userId,
        trx_id: `ADMIN-${Date.now()}`,
        plan_name: "Manual Admin Adjustment",
        credits,
        amount_bdt: "0",
        status: "approved",
        approved_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
      });

    if (txError) {
      toast({ title: "Transaction log failed", description: txError.message, variant: "destructive" });
    } else {
      toast({ title: "Credits Added", description: `${credits} credits given to ${userEmail}.` });
    }

    setSubmitting(false);
    setAmount("");
    onOpenChange(false);
    onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Give Direct Credit</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          User: <span className="font-medium text-foreground">{userEmail}</span>
          <br />Current balance: <span className="font-bold text-primary">{currentBalance}</span>
        </p>
        <Input
          type="number"
          min={1}
          placeholder="Credit amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
            Add Credits
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GiveCreditDialog;
