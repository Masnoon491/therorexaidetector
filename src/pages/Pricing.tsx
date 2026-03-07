import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { PaymentSubmitDialog } from "@/components/PaymentSubmitDialog";
import PricingCard from "@/components/PricingCard";

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

      {user && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-4 flex justify-end">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Editor
          </button>
        </div>
      )}

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
