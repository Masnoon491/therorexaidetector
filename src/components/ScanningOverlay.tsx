import { Shield } from "lucide-react";
import { useEffect, useState } from "react";

const STATUS_MESSAGES = [
  "Initializing AI detection engine…",
  "Analyzing sentence structures…",
  "Running plagiarism cross-reference…",
  "Evaluating readability metrics…",
  "Checking grammar & spelling…",
  "Verifying factual claims…",
  "Computing confidence scores…",
  "Generating detailed report…",
];

interface ScanningOverlayProps {
  isScanning: boolean;
}

const ScanningOverlay = ({ isScanning }: ScanningOverlayProps) => {
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isScanning) {
      setMsgIndex(0);
      setProgress(0);
      return;
    }

    const msgInterval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 2200);

    const progInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + Math.random() * 8 + 2, 92));
    }, 400);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progInterval);
    };
  }, [isScanning]);

  if (!isScanning) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md">
      <div className="flex flex-col items-center gap-8 max-w-sm text-center">
        {/* Animated shield */}
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[hsl(var(--teal))] to-[hsl(var(--teal-glow))] flex items-center justify-center shadow-2xl shadow-[hsl(var(--teal))/0.3] animate-pulse-glow">
            <Shield className="w-12 h-12 text-primary-foreground" />
          </div>
          {/* Orbiting ring */}
          <div className="absolute inset-[-12px] rounded-3xl border-2 border-primary/20 animate-spin-slow" />
          <div className="absolute inset-[-6px] rounded-2xl border border-primary/10 animate-spin-slow" style={{ animationDirection: "reverse", animationDuration: "5s" }} />
        </div>

        {/* Status message */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">{STATUS_MESSAGES[msgIndex]}</p>
          <p className="text-xs text-muted-foreground">This may take up to 60 seconds</p>
        </div>

        {/* Progress bar */}
        <div className="w-72">
          <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-[hsl(var(--teal-glow))] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 font-mono">{Math.round(progress)}%</p>
        </div>
      </div>
    </div>
  );
};

export default ScanningOverlay;
