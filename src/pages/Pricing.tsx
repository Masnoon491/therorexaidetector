import { useState } from "react";
import { Check, Mail } from "lucide-react";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";

interface Plan {
  name: string;
  price: string;
  words: string;
  recommended?: boolean;
}

const individualPlans: Plan[] = [
  { name: "Micro", price: "500", words: "5,000" },
  { name: "Starter", price: "1,500", words: "15,000" },
  { name: "Standard", price: "3,000", words: "30,000" },
  { name: "Plus", price: "5,000", words: "50,000" },
  { name: "Pro", price: "8,000", words: "100,000", recommended: true },
];

const corporatePlans: Plan[] = [
  { name: "Growth", price: "12,000", words: "150,000" },
  { name: "Business", price: "20,000", words: "300,000" },
  { name: "Agency", price: "35,000", words: "500,000", recommended: true },
  { name: "Enterprise", price: "60,000", words: "1,000,000" },
  { name: "Heavy User", price: "100,000", words: "2,000,000" },
];

const features = [
  "Audit-Grade PDF Reports",
  "Sentence Heatmap",
  "30-Day Credit Validity",
];

const PricingCard = ({ plan }: { plan: Plan }) => (
  <div
    className={`relative rounded-xl border-2 p-6 flex flex-col items-center text-center transition-shadow ${
      plan.recommended
        ? "border-[hsl(160,100%,36%)] shadow-lg shadow-[hsl(160,100%,36%)]/10"
        : "border-border bg-card shadow-sm"
    }`}
    style={{ background: "#FFFFFF" }}
  >
    {plan.recommended && (
      <Badge className="absolute -top-3 bg-[hsl(160,100%,36%)] text-white border-0 px-3 py-1 text-xs font-semibold tracking-wide">
        Recommended
      </Badge>
    )}

    <h3 className="text-lg font-bold mt-2" style={{ color: "#2D3436" }}>
      {plan.name}
    </h3>

    <div className="mt-4 mb-1">
      <span className="text-4xl font-extrabold tracking-tight" style={{ color: "#2D3436" }}>
        {plan.price}
      </span>
      <span className="text-base font-medium ml-1" style={{ color: "#636e72" }}>
        TK
      </span>
    </div>

    <p className="text-sm font-medium mb-5" style={{ color: "#636e72" }}>
      {plan.words} Words
    </p>

    <ul className="space-y-3 w-full text-left mb-6">
      {features.map((f) => (
        <li key={f} className="flex items-start gap-2 text-sm" style={{ color: "#2D3436" }}>
          <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#00B894" }} />
          {f}
        </li>
      ))}
    </ul>

    <button
      className={`w-full py-2.5 rounded-lg text-sm font-bold transition-colors ${
        plan.recommended
          ? "text-white hover:opacity-90"
          : "border-2 hover:opacity-80"
      }`}
      style={
        plan.recommended
          ? { background: "#00B894", color: "#fff" }
          : { borderColor: "#00B894", color: "#00B894" }
      }
    >
      Get Started
    </button>
  </div>
);

const Pricing = () => {
  const [tab, setTab] = useState<"individual" | "corporate">("individual");
  const plans = tab === "individual" ? individualPlans : corporatePlans;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F8F9FA" }}>
      <TopNav />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-2" style={{ color: "#2D3436" }}>
          Choose Your Plan
        </h1>
        <p className="text-center text-sm mb-8" style={{ color: "#636e72" }}>
          Pay once, scan at your pace. All credits valid for 30 days.
        </p>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-full p-1" style={{ background: "#e9ecef" }}>
            {(["individual", "corporate"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-6 py-2 rounded-full text-sm font-semibold transition-all"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {plans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm flex items-center justify-center gap-2" style={{ color: "#636e72" }}>
            <Mail className="w-4 h-4" />
            Looking for more?{" "}
            <a
              href="mailto:salestheorex@gmail.com"
              className="font-semibold underline underline-offset-2"
              style={{ color: "#00B894" }}
            >
              Contact salestheorex@gmail.com
            </a>{" "}
            for Custom Enterprise solutions.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
