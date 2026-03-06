import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const allPlans = [
  { name: "Micro", price: "500", credits: 50 },
  { name: "Basic", price: "1,500", credits: 150 },
  { name: "Standard", price: "3,000", credits: 300 },
  { name: "Writer", price: "5,000", credits: 500 },
  { name: "Pro", price: "8,000", credits: 1000 },
  { name: "Growth", price: "12,000", credits: 1500 },
  { name: "Team", price: "20,000", credits: 3000 },
  { name: "Business", price: "35,000", credits: 5000 },
  { name: "Agency", price: "60,000", credits: 10000 },
  { name: "Heavy User", price: "100,000", credits: 20000 },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedPlan?: string;
}

export function PaymentSubmitDialog({ open, onOpenChange, preselectedPlan }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [trxId, setTrxId] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(preselectedPlan || "");
  const [submitting, setSubmitting] = useState(false);

  const plan = allPlans.find((p) => p.name === selectedPlan);

  const handleSubmit = async () => {
    if (!user || !trxId.trim() || !plan) return;
    setSubmitting(true);

    const { error } = await supabase.from("payment_transactions").insert({
      user_id: user.id,
      trx_id: trxId.trim(),
      plan_name: plan.name,
      credits: plan.credits,
      amount_bdt: plan.price,
      status: "pending",
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Submitted!", description: "Your payment is pending admin verification." });
      setTrxId("");
      setSelectedPlan("");
      onOpenChange(false);
    }
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Submit Payment</DialogTitle>
          <DialogDescription>
            Enter your bKash/Nagad/Rocket Transaction ID after making payment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label>Select Plan</Label>
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a plan" />
              </SelectTrigger>
              <SelectContent>
                {allPlans.map((p) => (
                  <SelectItem key={p.name} value={p.name}>
                    {p.name} — {p.price} TK ({p.credits} credits)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Transaction ID (TrxID)</Label>
            <Input
              placeholder="e.g. TXN123456789"
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
            />
          </div>

          {plan && (
            <div className="rounded-lg border border-border bg-secondary p-3 text-sm space-y-1">
              <p className="text-foreground font-semibold">{plan.name} Plan</p>
              <p className="text-muted-foreground">{plan.price} TK • {plan.credits} Credits • 30 Day Validity</p>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={!trxId.trim() || !plan || submitting}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Submit for Verification
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
