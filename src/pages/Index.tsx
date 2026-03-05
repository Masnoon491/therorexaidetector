import { useState } from "react";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import ContentEditor from "@/components/ContentEditor";
import ResultsPanel from "@/components/ResultsPanel";
import ScanningOverlay from "@/components/ScanningOverlay";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface AiBlock {
  text: string;
  fake: number;
  real: number;
}

export interface GrammarMatch {
  message: string;
  shortMessage: string;
  offset: number;
  length: number;
  replacements: string[];
}

export interface FactCheck {
  fact: string;
  truthfulness: string;
  explanation: string;
}

export interface ScanResults {
  ai?: {
    score: number;
    originalScore: number;
    classification: string;
    blocks: AiBlock[];
  };
  plagiarism?: { score: number };
  readability?: {
    fleschReadingEase?: number;
    fleschGradeLevel?: number;
    gunningFoxIndex?: number;
    smogIndex?: number;
    avgReadingTime?: number;
    sentenceCount?: number;
    wordCount?: number;
  };
  grammar?: GrammarMatch[];
  facts?: FactCheck[];
}

function normalizeResponse(data: any): ScanResults {
  const r = data?.results || data;
  const normalized: ScanResults = {};

  if (r?.ai) {
    const aiConf = r.ai.confidence?.AI ?? r.ai.score;
    const origConf = r.ai.confidence?.Original ?? (1 - (aiConf || 0));
    const classification = r.ai.classification?.AI === 1 ? "AI" : "Original";

    const blocks: AiBlock[] = [];
    if (Array.isArray(r.ai.blocks)) {
      for (const b of r.ai.blocks) {
        blocks.push({
          text: b.text || "",
          fake: Number(b.result?.fake ?? b.fake ?? 0),
          real: Number(b.result?.real ?? b.real ?? 0),
        });
      }
    }

    normalized.ai = { score: Number(aiConf || 0), originalScore: Number(origConf || 0), classification, blocks };
  }

  if (r?.plagiarism?.score != null) {
    normalized.plagiarism = { score: Number(r.plagiarism.score) };
  }

  if (r?.readability) {
    const rd = r.readability.readability || {};
    const ts = r.readability.text_stats || {};
    normalized.readability = {
      fleschReadingEase: rd.fleschReadingEase,
      fleschGradeLevel: rd.fleschGradeLevel,
      gunningFoxIndex: rd.gunningFoxIndex,
      smogIndex: rd.smogIndex,
      avgReadingTime: ts.averageReadingTime,
      sentenceCount: ts.sentenceCount,
      wordCount: ts.uniqueWordCount,
    };
  }

  if (Array.isArray(r?.grammarSpelling?.matches)) {
    normalized.grammar = r.grammarSpelling.matches.map((m: any) => ({
      message: m.message || "",
      shortMessage: m.shortMessage || "",
      offset: m.offset || 0,
      length: m.length || 0,
      replacements: Array.isArray(m.replacements)
        ? m.replacements.slice(0, 3).map((rep: any) => (typeof rep === "string" ? rep : rep.value || ""))
        : [],
    }));
  }

  if (Array.isArray(r?.facts)) {
    normalized.facts = r.facts.map((f: any) => ({
      fact: f.fact || "",
      truthfulness: f.truthfulness || "0%",
      explanation: f.explanation || "",
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
    <div className="min-h-screen bg-background flex flex-col">
      <TopNav />
      <ScanningOverlay isScanning={isScanning} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 space-y-8">
        <div className="bg-card rounded-2xl border border-border p-6 lg:p-8 shadow-sm">
          <ContentEditor onScan={handleScan} isScanning={isScanning} />
        </div>
        <ResultsPanel results={results} />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
