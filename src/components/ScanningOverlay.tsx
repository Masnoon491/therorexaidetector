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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-8 max-w-sm text-center">
        {/* Animated shield */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-lg animate-pulse-glow">
            <Shield className="w-10 h-10 text-primary-foreground" />
          </div>
          <div className="absolute inset-[-10px] rounded-3xl border-2 border-primary/20 animate-spin-slow" />
        </div>

        {/* Status message */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">{STATUS_MESSAGES[msgIndex]}</p>
          <p className="text-xs text-muted-foreground">This may take up to 60 seconds</p>
        </div>

        {/* Progress bar */}
        <div className="w-64">
          <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
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
