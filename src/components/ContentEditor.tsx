import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScanSearch } from "lucide-react";

const MAX_WORDS = 1000;

interface ContentEditorProps {
  onScan: (text: string) => void;
  isScanning: boolean;
}

const ContentEditor = ({ onScan, isScanning }: ContentEditorProps) => {
  const [text, setText] = useState("");
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const wordPercent = Math.min((wordCount / MAX_WORDS) * 100, 100);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-5">
        <h1 className="text-xl font-extrabold text-foreground tracking-tight">
          Content Analysis
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Paste your text to detect AI-generated content, plagiarism, readability issues, and more.
        </p>
      </div>

      <div className="flex-1 relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your content here…"
          className="w-full h-full min-h-[300px] resize-none rounded-lg border border-border bg-card p-5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all font-sans"
        />
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-3">
          <div className="w-32 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${wordCount > MAX_WORDS ? 'bg-destructive' : 'bg-primary/60'}`}
              style={{ width: `${wordPercent}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground font-mono tabular-nums">
            {wordCount.toLocaleString()}/{MAX_WORDS.toLocaleString()} words
          </span>
        </div>

        <Button
          onClick={() => onScan(text)}
          disabled={wordCount < 10 || wordCount > MAX_WORDS || isScanning}
          className="gap-2 font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-md px-6"
        >
          <ScanSearch className="w-4 h-4" />
          {isScanning ? "Scanning…" : "Run Analysis"}
        </Button>
      </div>
    </div>
  );
};

export default ContentEditor;
