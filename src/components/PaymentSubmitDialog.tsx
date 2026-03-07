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
import { Loader2, Copy, Check } from "lucide-react";
import bkashLogo from "@/assets/bkash-logo.png";

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

const BKASH_NUMBER = "01819185751";
const TRXID_REGEX = /^[A-Za-z0-9]{10}$/;

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
  const [copied, setCopied] = useState(false);

  const plan = allPlans.find((p) => p.name === selectedPlan);
  const isValidTrxId = TRXID_REGEX.test(trxId.trim());

  const handleCopyNumber = async () => {
    await navigator.clipboard.writeText(BKASH_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!user || !isValidTrxId || !plan) return;
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

      // Fire-and-forget: notify admin via email
      supabase.functions.invoke("notify-payment", {
        body: {
          userEmail: user.email,
          planName: plan.name,
          trxId: trxId.trim(),
          amountBdt: plan.price,
          credits: plan.credits,
        },
      }).catch(() => {/* silent – don't block UX */});

      setTrxId("");
      setSelectedPlan("");
      onOpenChange(false);
    }
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        {/* bKash branded header */}
        <div className="px-6 pt-5 pb-4 border-b" style={{ borderColor: "#D12053" }}>
          <div className="flex items-center gap-3 mb-2">
            <img src={bkashLogo} alt="bKash" className="h-8 w-auto" />
            <div>
              <DialogHeader className="p-0 space-y-0">
                <DialogTitle className="text-foreground text-base">Payment via bKash</DialogTitle>
              </DialogHeader>
            </div>
          </div>
          <DialogDescription className="text-[13px] text-muted-foreground mt-1">
            Complete payment via bKash personal account then submit your Transaction ID.
          </DialogDescription>
        </div>

        <div className="px-6 pb-6 space-y-4">
          {/* Plan Selector */}
          <div className="space-y-2 pt-2">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Select Plan</Label>
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

          {/* Dynamic Plan Info & Instructions */}
          {plan && (
            <div className="rounded-lg border p-4 space-y-3" style={{ borderColor: "#D12053", background: "rgba(209,32,83,0.04)" }}>
              <p className="text-sm font-bold text-foreground text-center">
                Purchase {plan.name} Plan — {plan.price} TK
              </p>

              {/* bKash Number with Copy */}
              <button
                onClick={handleCopyNumber}
                className="w-full flex items-center justify-center gap-2 rounded-md bg-background border border-border px-3 py-2.5 hover:bg-secondary transition-colors cursor-pointer"
              >
                <span className="font-mono font-bold text-foreground tracking-wider text-base">{BKASH_NUMBER}</span>
                <span className="text-[10px] text-muted-foreground">(Personal)</span>
                {copied ? (
                  <Check className="w-4 h-4 text-primary shrink-0" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
              </button>

              {/* Instructions */}
              <ol className="space-y-2 text-[13px] text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <span className="shrink-0 w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center mt-0.5 text-white" style={{ background: "#D12053" }}>1</span>
                  <span>Send <span className="font-bold text-foreground">{plan.price} BDT</span> using <span className="font-semibold text-foreground">"Send Money"</span>.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="shrink-0 w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center mt-0.5 text-white" style={{ background: "#D12053" }}>2</span>
                  <span>Copy the <span className="font-semibold text-foreground">Transaction ID (TrxID)</span>.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="shrink-0 w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center mt-0.5 text-white" style={{ background: "#D12053" }}>3</span>
                  <span>Paste it below and submit.</span>
                </li>
              </ol>

              <p className="text-[11px] text-center text-muted-foreground">
                {plan.credits} Credits • 30 Day Validity
              </p>
            </div>
          )}

          {/* TrxID Input */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Transaction ID (TrxID)</Label>
            <Input
              placeholder="e.g., 9H7D..."
              value={trxId}
              onChange={(e) => setTrxId(e.target.value.toUpperCase())}
              maxLength={10}
              className="font-mono tracking-wider"
            />
            {trxId.length > 0 && !isValidTrxId && (
              <p className="text-[11px] text-destructive">TrxID must be exactly 10 alphanumeric characters.</p>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!isValidTrxId || !plan || submitting}
            className="w-full font-bold"
            style={{ background: "#D12053", color: "#fff" }}
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Submit for Verification
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
