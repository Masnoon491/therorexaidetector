import { useState } from "react";
import { Check, Mail, ArrowRight, Shield, FileSearch, BarChart3, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PaymentSubmitDialog } from "@/components/PaymentSubmitDialog";
import LandingNav from "@/components/LandingNav";
import Footer from "@/components/Footer";

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
    className={`relative rounded-2xl border flex flex-col transition-all duration-200 ${
      plan.recommended
        ? "border-primary shadow-[0_8px_30px_-8px_hsl(var(--primary)/0.18)] scale-[1.03] z-10"
        : "border-border shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
    }`}
    style={{ background: "#fff" }}
  >
    {plan.recommended && (
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
        <span className="inline-block bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-sm">
          Recommended
        </span>
      </div>
    )}

    <div className="p-6 pb-4 text-center border-b border-border">
      <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-muted-foreground">
        {plan.name}
      </h3>
      <div className="mb-1">
        <span className="text-4xl font-extrabold tracking-tight text-foreground">{plan.price}</span>
        <span className="text-base font-semibold ml-1 text-foreground">TK</span>
        <span className="text-sm font-medium ml-1 text-muted-foreground">/ month</span>
      </div>
      <p className="text-[11px] font-medium tracking-wide uppercase text-muted-foreground/60">
        Billed Monthly • 30 Day Validity
      </p>
    </div>

    <div className="p-6 pt-4 flex flex-col flex-1">
      <div className="mb-5 space-y-2">
        <div className="flex items-center justify-between text-sm rounded-lg px-3 py-2 bg-secondary">
          <span className="text-muted-foreground">Monthly Words</span>
          <span className="font-bold text-foreground">{plan.words}</span>
        </div>
        <div className="flex items-center justify-between text-sm rounded-lg px-3 py-2 bg-secondary">
          <span className="text-muted-foreground">Credits</span>
          <span className="font-bold text-primary">{plan.credits.toLocaleString()}</span>
        </div>
        <p className="text-[10px] text-center text-muted-foreground/60">1 Credit = 100 Words</p>
      </div>

      <ul className="space-y-3 mb-6 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-[13px] leading-snug text-foreground">
            <Check className="w-4 h-4 mt-0.5 shrink-0 text-primary" strokeWidth={2.5} />
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={() => onGetStarted(plan.name)}
        className={`w-full py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
          plan.recommended
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground"
        }`}
      >
        Get Started <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

const Landing = () => {
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
    <div className="min-h-screen flex flex-col bg-background">
      <LandingNav />

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ background: "#FFFFFF" }}>
        {/* Subtle geometric accents */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-secondary/60" />
          <div className="absolute bottom-0 -left-16 w-64 h-64 rounded-full bg-secondary/40" />
          <div className="absolute top-1/2 right-1/4 w-40 h-40 rotate-45 border border-border/40" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 py-24 sm:py-32 text-center">
          <div className="flex items-baseline justify-center gap-2 mb-4">
            <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              THEOREX
            </span>
            <span className="text-4xl sm:text-5xl font-bold text-primary">
              Consulting
            </span>
          </div>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
            Welcome to the future of content authenticity. We promote transparency over mere detection.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigate(user ? "/dashboard" : "/auth?mode=signup")}
              className="px-8 py-3 rounded-lg text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {user ? "Go to Dashboard" : "Get Started Free"}
            </button>
            <a
              href="#pricing"
              className="px-8 py-3 rounded-lg text-sm font-bold border-2 border-foreground/20 text-foreground hover:bg-secondary transition-colors"
            >
              View Pricing
            </a>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="border-y border-border bg-card">
        <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Shield, title: "AI Detection", desc: "Industry-leading accuracy with sentence-level heatmaps" },
            { icon: FileSearch, title: "Plagiarism Scan", desc: "Cross-reference against billions of web sources" },
            { icon: BarChart3, title: "Readability Audit", desc: "Flesch, Gunning-Fog, SMOG indices in one report" },
            { icon: Award, title: "Authenticity Certificate", desc: "Professional PDF certificates for compliance" },
          ].map((f) => (
            <div key={f.title} className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-1.5 text-foreground">
            Transparent Pricing
          </h2>
          <p className="text-center text-sm mb-10 text-muted-foreground">
            Pay monthly, scan at your pace. All credits valid for 30 days.
          </p>

          {/* Tab Switcher */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex rounded-full p-1 border border-border bg-card">
              {(["individual", "corporate"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`relative px-7 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    tab === t
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground"
                  }`}
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
            <p className="text-xs leading-relaxed text-muted-foreground/60">
              Credits reset at the end of each billing cycle. Ensure all audits are completed within the 30-day period.
            </p>
            <p className="text-sm flex items-center justify-center gap-1.5 text-muted-foreground">
              <Mail className="w-4 h-4 text-primary" />
              Contact{" "}
              <a href="mailto:salestheorex@gmail.com" className="font-semibold underline underline-offset-2 text-primary">
                salestheorex@gmail.com
              </a>{" "}
              for Enterprise customizations.
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <PaymentSubmitDialog open={paymentOpen} onOpenChange={setPaymentOpen} preselectedPlan={selectedPlan} />
    </div>
  );
};

export default Landing;
