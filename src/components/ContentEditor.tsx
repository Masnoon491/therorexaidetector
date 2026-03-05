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
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          Content Analysis
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Paste your text to detect AI-generated content, plagiarism, readability issues, and more.
        </p>
      </div>

      <div className="flex-1 relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
          placeholder="Paste or type your content here…"
          className="w-full h-full min-h-[340px] resize-none rounded-xl border border-border bg-card p-5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all font-sans"
        />
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-3">
          <div className="w-36 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary/60 transition-all duration-300"
              style={{ width: `${charPercent}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground font-mono tabular-nums">
            {charCount.toLocaleString()}/{MAX_CHARS.toLocaleString()}
          </span>
        </div>

        <Button
          onClick={() => onScan(text)}
          disabled={charCount < 50 || isScanning}
          className="gap-2 font-bold bg-gradient-to-r from-primary to-[hsl(var(--teal-glow))] text-primary-foreground hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 px-6"
        >
          <ScanSearch className="w-4 h-4" />
          {isScanning ? "Scanning…" : "Run Analysis"}
        </Button>
      </div>
    </div>
  );
};

export default ContentEditor;
