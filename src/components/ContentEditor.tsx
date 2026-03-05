import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScanSearch, Upload, FileText, Coins } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { calculateCredits } from "@/hooks/useCredits";

const MAX_WORDS = 10000;

interface ContentEditorProps {
  onScan: (text: string) => void;
  isScanning: boolean;
}

async function extractTextFromFile(file: File): Promise<string> {
  if (file.name.endsWith(".txt")) {
    return file.text();
  }
  // For PDF/DOCX, read as text (basic extraction)
  return file.text();
}

const ContentEditor = ({ onScan, isScanning }: ContentEditorProps) => {
  const [text, setText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const wordPercent = Math.min((wordCount / MAX_WORDS) * 100, 100);
  const creditsRequired = calculateCredits(wordCount);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "text/plain",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validTypes.includes(file.type) && !file.name.match(/\.(txt|pdf|doc|docx)$/i)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF, Word, or TXT file.",
        variant: "destructive",
      });
      return;
    }

    try {
      const content = await extractTextFromFile(file);
      const fileWordCount = content.trim().split(/\s+/).filter(Boolean).length;
      
      if (fileWordCount > MAX_WORDS) {
        toast({
          title: "Limit Exceeded",
          description: "Please upload a document with 10,000 words or fewer for a single audit.",
          variant: "destructive",
        });
        return;
      }

      setText(content);
    } catch {
      toast({
        title: "Import Failed",
        description: "Could not read the file. Please try a different format.",
        variant: "destructive",
      });
    }

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-extrabold text-foreground tracking-tight">
            Content Analysis
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Paste or import text to detect AI-generated content, plagiarism, and more.
          </p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="gap-1.5 text-xs font-semibold border-border text-foreground hover:bg-secondary"
          >
            <Upload className="w-3.5 h-3.5" />
            Import File
          </Button>
        </div>
      </div>

      <div className="flex-1 relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your content here…"
          className="w-full h-full min-h-[300px] resize-none rounded-md border border-border bg-card p-5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all font-sans"
        />
      </div>

      {/* Live Audit Estimate Bar */}
      <div className="mt-4 p-3 rounded-md bg-[hsl(var(--stat-bg))] border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Word count */}
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Words:</span>
              <span className={`text-xs font-bold font-mono tabular-nums ${wordCount > MAX_WORDS ? 'text-destructive' : 'text-foreground'}`}>
                {wordCount.toLocaleString()}
              </span>
            </div>
            {/* Credit cost */}
            <div className="flex items-center gap-2">
              <Coins className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs text-muted-foreground">Credits Required:</span>
              <span className="text-xs font-bold font-mono tabular-nums text-foreground">
                {creditsRequired}
              </span>
            </div>
            {/* Progress */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${wordCount > MAX_WORDS ? 'bg-destructive' : 'bg-primary/60'}`}
                  style={{ width: `${wordPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground font-mono tabular-nums">
                {wordCount.toLocaleString()}/{MAX_WORDS.toLocaleString()}
              </span>
            </div>
          </div>

          <Button
            onClick={() => onScan(text)}
            disabled={wordCount < 10 || wordCount > MAX_WORDS || isScanning}
            className="gap-2 font-bold bg-foreground text-background hover:bg-foreground/90 transition-colors shadow-sm px-6"
          >
            <ScanSearch className="w-4 h-4" />
            {isScanning ? "Scanning…" : "Start AI Audit"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;
