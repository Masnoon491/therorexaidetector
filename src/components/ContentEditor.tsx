import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Trash2, Loader2, FileText, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { calculateCredits } from "@/hooks/useCredits";
import mammoth from "mammoth";

interface ContentEditorProps {
  onTextChange?: (text: string) => void;
  onDocNameChange?: (name: string) => void;
  onContextConfirmChange?: (confirmed: boolean) => void;
  maxWords?: number;
}

export interface ContentEditorRef {
  getText: () => string;
  getDocumentName: () => string;
  isContextConfirmed: () => boolean;
  clear: () => void;
}

async function extractTextFromDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

async function extractTextFromPdf(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item: any) => item.str).join(" ");
    pages.push(text);
  }
  return pages.join("\n\n");
}

async function extractTextFromFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".docx") || name.endsWith(".doc")) return extractTextFromDocx(file);
  if (name.endsWith(".pdf")) return extractTextFromPdf(file);
  return file.text();
}

function truncateToWordLimit(text: string, limit: number): { text: string; truncated: boolean } {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= limit) return { text, truncated: false };
  return { text: words.slice(0, limit).join(" "), truncated: true };
}

function stripExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, "");
}

const ContentEditor = forwardRef<ContentEditorRef, ContentEditorProps>(
  ({ onTextChange, onDocNameChange, onContextConfirmChange, maxWords = 10000 }, ref) => {
    const [text, setText] = useState("");
    const [documentName, setDocumentName] = useState("");
    const [contextConfirmed, setContextConfirmed] = useState(false);
    const [importing, setImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const creditsRequired = calculateCredits(wordCount);

    useImperativeHandle(ref, () => ({
      getText: () => text,
      getDocumentName: () => documentName,
      isContextConfirmed: () => contextConfirmed,
      clear: () => {
        setText("");
        setDocumentName("");
        setContextConfirmed(false);
        onTextChange?.("");
        onDocNameChange?.("");
        onContextConfirmChange?.(false);
      },
    }));

    const handleDocNameChange = (val: string) => {
      setDocumentName(val);
      onDocNameChange?.(val);
    };

    const handleContextConfirm = (checked: boolean) => {
      setContextConfirmed(checked);
      onContextConfirmChange?.(checked);
    };

    const handleChange = (val: string) => {
      const words = val.trim().split(/\s+/).filter(Boolean);
      if (words.length > maxWords) {
        const truncated = words.slice(0, maxWords).join(" ");
        setText(truncated);
        onTextChange?.(truncated);
        return;
      }
      setText(val);
      onTextChange?.(val);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const validExts = /\.(txt|pdf|doc|docx)$/i;
      if (!validExts.test(file.name)) {
        toast({ title: "Invalid File Type", description: "Please upload a PDF, Word, or TXT file.", variant: "destructive" });
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setImporting(true);
      try {
        const raw = await extractTextFromFile(file);
        const cleaned = raw.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "").trim();
        if (!cleaned || cleaned.length < 10) {
          toast({ title: "No Text Found", description: "Could not extract readable text from this file. Try a different format.", variant: "destructive" });
          return;
        }
        const { text: finalText, truncated } = truncateToWordLimit(cleaned, maxWords);
        handleChange(finalText);
        if (!documentName.trim()) handleDocNameChange(stripExtension(file.name));
        if (truncated) toast({ title: "Document Truncated", description: `Document truncated to the first ${maxWords.toLocaleString()} words.` });
      } catch (err: any) {
        console.error("File import error:", err);
        toast({ title: "Import Failed", description: "Could not read the file. Please try a different format.", variant: "destructive" });
      } finally {
        setImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };

    return (
      <div className="flex flex-col h-full">
        {/* Document Name */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-card">
          <FileText className="w-4 h-4 text-primary shrink-0" />
          <Input
            value={documentName}
            onChange={(e) => handleDocNameChange(e.target.value)}
            placeholder="Document Name (required)"
            className="h-8 text-sm font-medium border-none shadow-none bg-transparent focus-visible:ring-0 px-1 placeholder:text-muted-foreground/50"
            maxLength={150}
            required
            aria-required="true"
          />
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-card">
          <input ref={fileInputRef} type="file" accept=".txt,.pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" />
          <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} disabled={importing} className="gap-1.5 text-xs font-semibold text-foreground hover:bg-secondary">
            {importing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            {importing ? "Importing…" : "Import"}
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" size="icon" onClick={() => handleChange("")} className="w-8 h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* ═══ ATTENTION: Scanning Rules ═══ */}
        <div className="px-4 py-3 border-b-2 border-[hsl(var(--navy,210_29%_17%))] bg-primary/10">
          <div className="flex items-start gap-2.5 mb-3">
            <ShieldAlert className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-xs font-extrabold uppercase tracking-wider text-foreground">
              Attention — Scanning Rules
            </p>
          </div>
          <div className="space-y-2.5 text-[11px] leading-relaxed text-foreground/80">
            <p>
              <span className="font-bold text-destructive">⚠️ CRITICAL:</span>{" "}
              Minimum <span className="font-extrabold text-foreground">200 words</span> required for AI Analysis. Quality detection requires data volume.
            </p>
            <p>
              <span className="font-bold text-destructive">🚨 STOP:</span>{" "}
              Never scan fragments. If your document is 5,000 words and you only scan 200, the result will be a <span className="font-bold text-foreground">False Positive</span>. The AI requires the <span className="font-extrabold text-foreground">ENTIRE context</span> to provide a perfect report.
            </p>
            <p>
              <span className="font-bold text-[hsl(var(--warning))]">⚡ NOTE:</span>{" "}
              Mixed content (AI + Human) or text edited with software tools can trigger false signals. Apply human judgment to all results.
            </p>
          </div>

          {/* Mandatory confirmation checkbox */}
          <label className="flex items-center gap-2.5 mt-3 pt-3 border-t border-primary/20 cursor-pointer select-none">
            <Checkbox
              checked={contextConfirmed}
              onCheckedChange={(c) => handleContextConfirm(c === true)}
              className="border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <span className="text-[11px] font-semibold text-foreground">
              I have provided the full document context for an accurate audit.
            </span>
          </label>
        </div>

        {/* Editor */}
        <div className="flex-1 relative">
          <textarea
            value={text}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Paste your full document here (minimum 200 words)…"
            className="w-full h-full min-h-[400px] resize-none p-5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/50 focus:outline-none bg-card"
            style={{ fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif", color: '#2D3436' }}
          />
        </div>

        {/* Footer status bar */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-secondary/50 text-xs text-muted-foreground">
          <span className="font-mono tabular-nums">
            {wordCount.toLocaleString()} words ({creditsRequired} credits)
            {wordCount > 0 && wordCount < 200 && (
              <span className="ml-2 text-destructive font-semibold">— {200 - wordCount} more words needed</span>
            )}
          </span>
        </div>
      </div>
    );
  }
);

ContentEditor.displayName = "ContentEditor";

export default ContentEditor;
