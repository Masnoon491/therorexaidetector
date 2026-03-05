import { useState } from "react";
import TopNav from "@/components/TopNav";
import ContentEditor from "@/components/ContentEditor";
import ResultsSidebar from "@/components/ResultsSidebar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface AiBlock {
  text: string;
  score: number;
}

export interface ScanResults {
  ai?: { score: number };
  plagiarism?: { score: number };
  readability?: { grade?: string; score?: number };
  aiBlocks?: AiBlock[];
}

function normalizeResponse(data: any): ScanResults {
  const r = data?.results || data;
  const normalized: ScanResults = {};

  // AI score
  const aiConf = r?.ai?.confidence?.AI ?? r?.ai?.score;
  if (aiConf != null) {
    normalized.ai = { score: Number(aiConf) };
  }

  // Plagiarism
  const plagScore = r?.plagiarism?.score;
  if (plagScore != null) {
    normalized.plagiarism = { score: Number(plagScore) };
  }

  // Readability
  const readGrade = r?.readability?.readability?.fleschGradeLevel ?? r?.readability?.grade;
  const readScore = r?.readability?.readability?.fleschScore ?? r?.readability?.score;
  if (readGrade != null || readScore != null) {
    normalized.readability = {
      grade: readGrade != null ? String(readGrade) : undefined,
      score: readScore != null ? Number(readScore) : undefined,
    };
  }

  // Block-by-block AI highlights
  const blocks = r?.ai?.blocks || r?.ai?.sentences || r?.ai?.paragraphs;
  if (Array.isArray(blocks) && blocks.length > 0) {
    normalized.aiBlocks = blocks.map((b: any) => ({
      text: b.text || b.sentence || b.content || "",
      score: Number(b.score ?? b.confidence?.AI ?? b.ai ?? 0),
    }));
  }

  return normalized;
}

const Index = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<ScanResults | null>(null);
  const { toast } = useToast();

  const handleScan = async (text: string) => {
    setIsScanning(true);
    setResults(null);

    try {
      const { data, error } = await supabase.functions.invoke("scan-content", {
        body: { content: text, title: `Scan - ${new Date().toLocaleString()}` },
      });

      if (error) throw new Error(error.message);

      if (data?.isRateLimit) {
        toast({ title: "Rate Limited", description: "Too many requests. Please wait a moment and try again.", variant: "destructive" });
        return;
      }

      if (data?.error) {
        const msg = typeof data.error === "string" ? data.error : JSON.stringify(data.details || data.error);
        throw new Error(msg);
      }

      setResults(normalizeResponse(data));
    } catch (err: any) {
      toast({ title: "Scan Failed", description: err.message || "Something went wrong.", variant: "destructive" });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <ContentEditor onScan={handleScan} isScanning={isScanning} />
        </main>
        <ResultsSidebar results={results} isScanning={isScanning} />
      </div>
    </div>
  );
};

export default Index;
