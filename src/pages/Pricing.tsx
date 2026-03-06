import { useState } from "react";
import { Check, Mail, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { PaymentSubmitDialog } from "@/components/PaymentSubmitDialog";

interface Plan {
  name: string;
  price: string;
  words: string;
  credits: number;
  recommended?: boolean;
}

const individualPlans: Plan[] = [
  { name: "Micro", price: "500", words: "5,000", credits: 50 },
  { name: "Basic", price: "1,500", words: "15,000", credits: 150 },
  { name: "Standard", price: "3,000", words: "30,000", credits: 300 },
  { name: "Writer", price: "5,000", words: "50,000", credits: 500 },
  { name: "Pro", price: "8,000", words: "100,000", credits: 1000, recommended: true },
];

const corporatePlans: Plan[] = [
  { name: "Growth", price: "12,000", words: "150,000", credits: 1500 },
  { name: "Team", price: "20,000", words: "300,000", credits: 3000 },
  { name: "Business", price: "35,000", words: "500,000", credits: 5000 },
  { name: "Agency", price: "60,000", words: "1,000,000", credits: 10000, recommended: true },
  { name: "Heavy User", price: "100,000", words: "2,000,000", credits: 20000 },
];

const features = [
  "Audit-Grade PDF Report Generation",
  "AI Sentence Heatmap & Depth Analysis",
  "Professional 'Authenticity Certificate'",
];

const PricingCard = ({ plan, onGetStarted }: { plan: Plan; onGetStarted: (planName: string) => void }) => (
  <div
    className={`relative rounded-2xl border bg-white flex flex-col transition-all duration-200 ${
      plan.recommended
        ? "border-[#00B894] shadow-[0_8px_30px_-8px_rgba(0,184,148,0.18)] scale-[1.03] z-10"
        : "border-[#E2E8F0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
    }`}
  >
    {plan.recommended && (
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
        <span className="inline-block bg-[#00B894] text-white text-[11px] font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-sm">
          Recommended
        </span>
      </div>
    )}

    <div className="p-6 pb-4 text-center border-b border-[#F1F3F5]">
      <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "#636e72" }}>
        {plan.name}
      </h3>

      <div className="mb-1">
        <span className="text-4xl font-extrabold tracking-tight" style={{ color: "#2D3436" }}>
          {plan.price}
        </span>
        <span className="text-base font-semibold ml-1" style={{ color: "#2D3436" }}>
          TK
        </span>
        <span className="text-sm font-medium ml-1" style={{ color: "#636e72" }}>
          / month
        </span>
      </div>

      <p className="text-[11px] font-medium tracking-wide uppercase" style={{ color: "#b2bec3" }}>
        Billed Monthly • 30 Day Validity
      </p>
    </div>

    <div className="p-6 pt-4 flex flex-col flex-1">
      <div className="mb-5 space-y-2">
        <div className="flex items-center justify-between text-sm rounded-lg px-3 py-2" style={{ background: "#F8F9FA" }}>
          <span style={{ color: "#636e72" }}>Monthly Words</span>
          <span className="font-bold" style={{ color: "#2D3436" }}>{plan.words}</span>
        </div>
        <div className="flex items-center justify-between text-sm rounded-lg px-3 py-2" style={{ background: "#F8F9FA" }}>
          <span style={{ color: "#636e72" }}>Credits</span>
          <span className="font-bold" style={{ color: "#00B894" }}>{plan.credits.toLocaleString()}</span>
        </div>
        <p className="text-[10px] text-center" style={{ color: "#b2bec3" }}>
          1 Credit = 100 Words
        </p>
      </div>

      <ul className="space-y-3 mb-6 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-[13px] leading-snug" style={{ color: "#2D3436" }}>
            <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#00B894" }} strokeWidth={2.5} />
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={() => onGetStarted(plan.name)}
        className={`w-full py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
          plan.recommended ? "hover:opacity-90" : "hover:bg-[#00B894] hover:text-white hover:border-[#00B894]"
        }`}
        style={
          plan.recommended
            ? { background: "#00B894", color: "#fff" }
            : { border: "2px solid #00B894", color: "#00B894", background: "transparent" }
        }
      >
        Get Started <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

const Pricing = () => {
  const [tab, setTab] = useState<"individual" | "corporate">("individual");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const plans = tab === "individual" ? individualPlans : corporatePlans;

  const handleGetStarted = (planName: string) => {
    if (!user) {
      navigate("/auth?mode=signup");
      return;
    }
    setSelectedPlan(planName);
    setPaymentOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F8F9FA" }}>
      <TopNav />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-14">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-1.5" style={{ color: "#2D3436" }}>
          Transparent Pricing
        </h1>
        <p className="text-center text-sm mb-10" style={{ color: "#636e72" }}>
          Pay monthly, scan at your pace. All credits valid for 30 days.
        </p>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-full p-1 border border-[#E2E8F0]" style={{ background: "#fff" }}>
            {(["individual", "corporate"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="relative px-7 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                style={
                  tab === t
                    ? { background: "#00B894", color: "#fff" }
                    : { color: "#2D3436" }
                }
              >
                {t === "individual" ? "Individual" : "Corporate"}
              </button>
            ))}
          </div>
        </div>

        {/* Plan Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 items-start">
          {plans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} onGetStarted={handleGetStarted} />
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-14 max-w-2xl mx-auto text-center space-y-2">
          <p className="text-xs leading-relaxed" style={{ color: "#b2bec3" }}>
            Credits reset at the end of each billing cycle. Ensure all audits are completed within the 30-day period.
          </p>
          <p className="text-sm flex items-center justify-center gap-1.5" style={{ color: "#636e72" }}>
            <Mail className="w-4 h-4" style={{ color: "#00B894" }} />
            Contact{" "}
            <a
              href="mailto:salestheorex@gmail.com"
              className="font-semibold underline underline-offset-2"
              style={{ color: "#00B894" }}
            >
              salestheorex@gmail.com
            </a>{" "}
            for Enterprise customizations.
          </p>
        </div>
      </main>

      <Footer />
      <PaymentSubmitDialog open={paymentOpen} onOpenChange={setPaymentOpen} preselectedPlan={selectedPlan} />
    </div>
  );
};

export default Pricing;
