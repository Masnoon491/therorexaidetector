import { useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Plan {
  name: string;
  price: string;
  words: string;
  credits: number;
  recommended?: boolean;
}

const features = [
  "Audit-Grade PDF Report Generation",
  "AI Sentence Heatmap & Depth Analysis",
  "Professional 'Authenticity Certificate'",
];

const PricingCard = ({
  plan,
  onGetStarted,
}: {
  plan: Plan;
  onGetStarted: (planName: string) => void;
}) => {
  const isMobile = useIsMobile();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [shimmerPos, setShimmerPos] = useState({ x: 50, y: 50 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), {
    stiffness: 300,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), {
    stiffness: 300,
    damping: 20,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isMobile || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(nx);
      mouseY.set(ny);
      setShimmerPos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    },
    [isMobile, mouseX, mouseY]
  );

  const handleMouseEnter = () => {
    if (!isMobile) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={
        isMobile
          ? undefined
          : {
              rotateX,
              rotateY,
              transformPerspective: 800,
            }
      }
      whileHover={isMobile ? undefined : { scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative rounded-2xl flex flex-col overflow-hidden ${
        plan.recommended ? "z-10" : ""
      }`}
    >
      {/* Animated gradient border for recommended plans */}
      {plan.recommended && (
        <div className="absolute inset-0 rounded-2xl pricing-gradient-border -z-10" />
      )}

      {/* Outer border wrapper */}
      <div
        className={`absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none ${
          plan.recommended
            ? ""
            : isHovered
            ? "ring-2 ring-primary"
            : "ring-1 ring-border"
        }`}
      />

      {/* Shimmer / spotlight overlay */}
      {!isMobile && isHovered && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none z-20 opacity-40 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 180px at ${shimmerPos.x}% ${shimmerPos.y}%, hsl(160 100% 36% / 0.12), transparent 70%)`,
          }}
        />
      )}

      {/* Card body */}
      <div
        className={`relative rounded-2xl bg-card flex flex-col flex-1 transition-shadow duration-300 ${
          plan.recommended
            ? "shadow-[0_8px_30px_-8px_hsl(160_100%_36%/0.18)]"
            : isHovered
            ? "shadow-[0_20px_25px_-5px_rgb(0_0_0/0.1),0_8px_10px_-6px_rgb(0_0_0/0.1)]"
            : "shadow-[0_2px_8px_rgb(0_0_0/0.04)]"
        }`}
      >
        {plan.recommended && (
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30">
            <span className="inline-block bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-sm">
              Recommended
            </span>
          </div>
        )}

        <div className="p-6 pb-4 text-center border-b border-border/50">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-muted-foreground">
            {plan.name}
          </h3>

          <div className="mb-1">
            <span className="text-4xl font-extrabold tracking-tight text-foreground">
              {plan.price}
            </span>
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
            className={`w-full py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-1.5 transition-all duration-300 ${
              plan.recommended
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : isHovered
                ? "bg-primary text-primary-foreground shadow-md animate-pulse-subtle"
                : "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground"
            }`}
          >
            Get Started <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PricingCard;
