import { useState, useRef } from "react";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import ContentEditor, { ContentEditorRef } from "@/components/ContentEditor";
import ResultsPanel from "@/components/ResultsPanel";
import ScanningOverlay from "@/components/ScanningOverlay";
import ScanHistoryPanel from "@/components/ScanHistoryPanel";
import ScanOptionsPanel, { ScanOptions } from "@/components/ScanOptionsPanel";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth, getFreeWordsUsed, addFreeWordsUsed, FREE_WORD_LIMIT } from "@/contexts/AuthContext";
import { useCredits, calculateCredits } from "@/hooks/useCredits";
import { useScanHistory } from "@/hooks/useScanHistory";

/* ─── Data Types ─── */
export interface AiBlock { text: string; fake: number; real: number; }
export interface GrammarMatch { message: string; shortMessage: string; offset: number; length: number; replacements: string[]; }
export interface FactCheck { fact: string; truthfulness: string; explanation: string; }
export interface ScanResults {
  ai?: { score: number; originalScore: number; classification: string; blocks: AiBlock[]; };
  plagiarism?: { score: number };
  readability?: { fleschReadingEase?: number; fleschGradeLevel?: number; gunningFoxIndex?: number; smogIndex?: number; avgReadingTime?: number; sentenceCount?: number; wordCount?: number; };
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
        blocks.push({ text: b.text || "", fake: Number(b.result?.fake ?? b.fake ?? 0), real: Number(b.result?.real ?? b.real ?? 0) });
      }
    }
    normalized.ai = { score: Number(aiConf || 0), originalScore: Number(origConf || 0), classification, blocks };
  }
  if (r?.plagiarism?.score != null) normalized.plagiarism = { score: Number(r.plagiarism.score) };
  if (r?.readability) {
    const rd = r.readability.readability || {};
    const ts = r.readability.text_stats || {};
    normalized.readability = { fleschReadingEase: rd.fleschReadingEase, fleschGradeLevel: rd.fleschGradeLevel, gunningFoxIndex: rd.gunningFoxIndex, smogIndex: rd.smogIndex, avgReadingTime: ts.averageReadingTime, sentenceCount: ts.sentenceCount, wordCount: ts.uniqueWordCount };
  }
  if (Array.isArray(r?.grammarSpelling?.matches)) {
    normalized.grammar = r.grammarSpelling.matches.map((m: any) => ({ message: m.message || "", shortMessage: m.shortMessage || "", offset: m.offset || 0, length: m.length || 0, replacements: Array.isArray(m.replacements) ? m.replacements.slice(0, 3).map((rep: any) => (typeof rep === "string" ? rep : rep.value || "")) : [] }));
  }
  if (Array.isArray(r?.facts)) {
    normalized.facts = r.facts.map((f: any) => ({ fact: f.fact || "", truthfulness: f.truthfulness || "0%", explanation: f.explanation || "" }));
  }
  return normalized;
}

const Index = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<ScanResults | null>(null);
  const [activeView, setActiveView] = useState<"editor" | "history">("editor");
  const [scanOptions, setScanOptions] = useState<ScanOptions>({ aiScore: true, plagiarism: true, readability: false });
  const [currentWordCount, setCurrentWordCount] = useState(0);
  const editorRef = useRef<ContentEditorRef>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { balance, deductCredits, refetch: refetchCredits } = useCredits();
  const { logScan } = useScanHistory();

  const handleNewScan = () => {
    setResults(null);
    setActiveView("editor");
    editorRef.current?.clear();
  };

  const handleScan = async () => {
    const text = editorRef.current?.getText() || "";
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const creditsNeeded = calculateCredits(wordCount);

    if (!user) {
      const used = getFreeWordsUsed();
      if (used + wordCount > FREE_WORD_LIMIT) {
        const remaining = Math.max(0, FREE_WORD_LIMIT - used);
        toast({ title: "Free limit reached", description: remaining > 0 ? `You have ${remaining} free words remaining. Please register for unlimited scans.` : "You've used your free 1,000 words. Please register for unlimited scans.", variant: "destructive" });
        return;
      }
    } else {
      if (balance !== null && balance < creditsNeeded) {
        toast({ title: "Insufficient Credits", description: `This scan requires ${creditsNeeded} credits but you only have ${balance}. Please purchase more credits.`, variant: "destructive" });
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
      if (data?.isRateLimit) { toast({ title: "Rate Limited", description: "Too many requests. Please wait.", variant: "destructive" }); return; }
      if (data?.error) { throw new Error(typeof data.error === "string" ? data.error : JSON.stringify(data.details || data.error)); }

      if (!user) { addFreeWordsUsed(wordCount); }
      else { await deductCredits(creditsNeeded); refetchCredits(); }

      const normalized = normalizeResponse(data);
      setResults(normalized);

      if (user) {
        await logScan({ title: `Scan - ${new Date().toLocaleString()}`, word_count: wordCount, ai_score: normalized.ai?.score ?? null, plagiarism_score: normalized.plagiarism?.score ?? null, credits_used: creditsNeeded });
      }
    } catch (err: any) {
      toast({ title: "Scan Failed", description: err.message || "Something went wrong.", variant: "destructive" });
    } finally {
      setIsScanning(false);
    }
  };

  /* ─── Logged-in three-column layout ─── */
  if (user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <TopNav />
        <ScanningOverlay isScanning={isScanning} />

        <div className="flex-1 flex">
          <SidebarProvider>
            <div className="min-h-0 flex w-full">
              <AppSidebar activeView={activeView} onViewChange={setActiveView} onNewScan={handleNewScan} />

              <div className="flex-1 flex flex-col min-w-0">
                <div className="h-10 flex items-center border-b border-border bg-card px-2">
                  <SidebarTrigger />
                </div>

                {activeView === "editor" ? (
                  <div className="flex-1 flex">
                    {/* Center: Editor */}
                    <div className="flex-1 flex flex-col min-w-0 border-r border-border">
                      <div className="flex-1">
                        <ContentEditor ref={editorRef} onTextChange={(t) => setCurrentWordCount(t.trim() === "" ? 0 : t.trim().split(/\s+/).length)} />
                      </div>
                    </div>

                    {/* Right: Scan Options */}
                    <div className="w-72 shrink-0 bg-card border-l border-border hidden lg:flex flex-col">
                      <ScanOptionsPanel
                        options={scanOptions}
                        onOptionsChange={setScanOptions}
                        onScan={handleScan}
                        isScanning={isScanning}
                        wordCount={currentWordCount}
                      />
                    </div>
                  </div>
                ) : (
                  <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
                    <ScanHistoryPanel />
                  </main>
                )}

                {/* Results below editor */}
                {activeView === "editor" && results && (
                  <div className="border-t border-border">
                    <div className="max-w-4xl mx-auto w-full px-6 py-8">
                      <ResultsPanel results={results} />
                    </div>
                  </div>
                )}

                {/* Mobile scan button */}
                {activeView === "editor" && (
                  <div className="lg:hidden p-4 border-t border-border bg-card">
                    <button
                      onClick={handleScan}
                      disabled={currentWordCount < 100 || isScanning}
                      className="w-full py-3 rounded-lg font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                      {isScanning ? "Scanning…" : "Scan"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </SidebarProvider>
        </div>

        <Footer />
      </div>
    );
  }

  /* ─── Logged-out simple layout ─── */
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNav />
      <ScanningOverlay isScanning={isScanning} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 space-y-8">
        <div className="bg-card rounded-lg border border-border overflow-hidden" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <ContentEditor ref={editorRef} onTextChange={(t) => setCurrentWordCount(t.trim() === "" ? 0 : t.trim().split(/\s+/).length)} />
        </div>

        {/* Simple scan button for non-logged in */}
        <div className="flex justify-center">
          <button
            onClick={handleScan}
            disabled={currentWordCount < 100 || isScanning}
            className="px-8 py-3 rounded-lg font-bold text-sm bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 transition-colors"
          >
            {isScanning ? "Scanning…" : "Start AI Audit"}
          </button>
        </div>

        <ResultsPanel results={results} />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
