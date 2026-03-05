import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import ContentEditor from "@/components/ContentEditor";
import ResultsPanel from "@/components/ResultsPanel";
import ScanningOverlay from "@/components/ScanningOverlay";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth, getFreeWordsUsed, addFreeWordsUsed, FREE_WORD_LIMIT } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

/* ─── Data Types ─── */
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
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleScan = async (text: string) => {
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

    if (!user) {
      const used = getFreeWordsUsed();
      if (used + wordCount > FREE_WORD_LIMIT) {
        const remaining = Math.max(0, FREE_WORD_LIMIT - used);
        toast({
          title: "Free limit reached",
          description: remaining > 0
            ? `You have ${remaining} free words remaining. This text has ${wordCount} words. Please register for unlimited scans.`
            : "You've used your free 1,000 words. Please register for unlimited scans.",
          variant: "destructive",
        });
        return;
      }
    }

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

      if (!user) {
        addFreeWordsUsed(wordCount);
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
        {/* User bar */}
        <div className="flex items-center justify-between">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{user.email}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Unlimited Scans</p>
              </div>
            </div>
          ) : (
            <div />
          )}

          {user ? (
            <Button variant="outline" size="sm" onClick={signOut} className="gap-1.5 text-xs">
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </Button>
          ) : (
            <Button size="sm" onClick={() => navigate("/auth")} className="gap-1.5 text-xs font-bold">
              <User className="w-3.5 h-3.5" />
              Sign In / Register
            </Button>
          )}
        </div>

        <div className="bg-card rounded-lg border border-border p-6 lg:p-8" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <ContentEditor onScan={handleScan} isScanning={isScanning} />
        </div>
        <ResultsPanel results={results} />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
