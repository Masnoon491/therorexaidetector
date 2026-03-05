import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScanSearch } from "lucide-react";

const MAX_CHARS = 5000;

interface ContentEditorProps {
  onScan: (text: string) => void;
  isScanning: boolean;
}

const ContentEditor = ({ onScan, isScanning }: ContentEditorProps) => {
  const [text, setText] = useState("");

  const charCount = text.length;
  const charPercent = Math.min((charCount / MAX_CHARS) * 100, 100);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-foreground">Analyze Content</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Paste your text below to detect AI-generated content, plagiarism, and more.
        </p>
      </div>

      <div className="flex-1 relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
          placeholder="Paste or type your content here…"
          className="w-full h-full min-h-[400px] resize-none rounded-xl border border-border bg-card p-5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-shadow"
        />
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-3">
          <div className="w-32 h-1.5 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-foreground transition-all duration-300"
              style={{ width: `${charPercent}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground font-medium tabular-nums">
            {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
          </span>
        </div>

        <Button
          onClick={() => onScan(text)}
          disabled={charCount < 50 || isScanning}
          className="gap-2 font-semibold"
        >
          <ScanSearch className="w-4 h-4" />
          {isScanning ? "Scanning…" : "Scan Content"}
        </Button>
      </div>
    </div>
  );
};

export default ContentEditor;
