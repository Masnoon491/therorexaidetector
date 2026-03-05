import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { calculateCredits } from "@/hooks/useCredits";

const MAX_WORDS = 10000;

interface ContentEditorProps {
  onTextChange?: (text: string) => void;
}

export interface ContentEditorRef {
  getText: () => string;
  clear: () => void;
}

async function extractTextFromFile(file: File): Promise<string> {
  return file.text();
}

const ContentEditor = forwardRef<ContentEditorRef, ContentEditorProps>(({ onTextChange }, ref) => {
  const [text, setText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const creditsRequired = calculateCredits(wordCount);

  useImperativeHandle(ref, () => ({
    getText: () => text,
    clear: () => { setText(""); onTextChange?.(""); },
  }));

  const handleChange = (val: string) => {
    setText(val);
    onTextChange?.(val);
  };

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
      toast({ title: "Invalid File Type", description: "Please upload a PDF, Word, or TXT file.", variant: "destructive" });
      return;
    }

    try {
      const content = await extractTextFromFile(file);
      const fileWordCount = content.trim().split(/\s+/).filter(Boolean).length;

      if (fileWordCount > MAX_WORDS) {
        toast({ title: "Limit Exceeded", description: "Please upload a document with 10,000 words or fewer for a single audit.", variant: "destructive" });
        return;
      }

      handleChange(content);
    } catch {
      toast({ title: "Import Failed", description: "Could not read the file. Please try a different format.", variant: "destructive" });
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-card">
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.pdf,.doc,.docx"
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="gap-1.5 text-xs font-semibold text-foreground hover:bg-secondary"
        >
          <Upload className="w-3.5 h-3.5" />
          Import
        </Button>

        <div className="flex-1" />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleChange("")}
          className="w-8 h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        <textarea
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Add at least 100 words..."
          className="w-full h-full min-h-[400px] resize-none p-5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/50 focus:outline-none bg-card font-sans"
        />
      </div>

      {/* Footer status bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-secondary/50 text-xs text-muted-foreground">
        <span className="font-mono tabular-nums">
          {wordCount.toLocaleString()} words ({creditsRequired} credits)
        </span>
      </div>
    </div>
  );
});

ContentEditor.displayName = "ContentEditor";

export default ContentEditor;
