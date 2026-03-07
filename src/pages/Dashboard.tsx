import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChangePassword } from "@/components/ChangePassword";
import TopNav from "@/components/TopNav";
import { PaymentHistory } from "@/components/PaymentHistory";
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
import { useAuth } from "@/contexts/AuthContext";
import { useCredits, calculateCredits } from "@/hooks/useCredits";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ScanResults } from "@/types/scan";
import { normalizeResponse } from "@/utils/normalizeResponse";

const Dashboard = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<ScanResults | null>(null);
  const [activeView, setActiveView] = useState<"editor" | "history" | "payments" | "settings">("editor");
  const [scanOptions, setScanOptions] = useState<ScanOptions>({ aiScore: true, plagiarism: true, readability: false });
  const [currentWordCount, setCurrentWordCount] = useState(0);
  const [currentDocName, setCurrentDocName] = useState("");
  const [contextConfirmed, setContextConfirmed] = useState(false);
  const [lastScanMeta, setLastScanMeta] = useState<{ wordCount: number; creditsUsed: number; ipAddress: string | null; documentName: string }>({ wordCount: 0, creditsUsed: 0, ipAddress: null, documentName: "" });
  const editorRef = useRef<ContentEditorRef>(null);
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const { balance, daysRemaining, deductCredits, refetch: refetchCredits } = useCredits();
  const navigate = useNavigate();

  const isExpired = daysRemaining !== null && daysRemaining === 0;

  useEffect(() => {
    if (!loading && !user) navigate("/auth?mode=login");
  }, [user, loading, navigate]);

  const handleNewScan = () => {
    setResults(null);
    setActiveView("editor");
    editorRef.current?.clear();
  };

  const handleScan = async () => {
    if (isExpired) {
      toast({ title: "Credits Expired", description: "Your credits have expired. Please purchase a new plan.", variant: "destructive" });
      return;
    }

    const text = editorRef.current?.getText() || "";
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const creditsNeeded = calculateCredits(wordCount);

    if (balance !== null && balance < creditsNeeded) {
      toast({ title: "Insufficient Credits", description: `This scan requires ${creditsNeeded} credits but you only have ${balance}. Please purchase more credits.`, variant: "destructive" });
      return;
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

      const normalized = normalizeResponse(data);
      setResults(normalized);

      const aiScore = Math.max(0, Math.min(100, Math.round((normalized.ai?.score ?? 0) * 100)));
      const humanScore = Math.max(0, Math.min(100, 100 - aiScore));
      const riskAssessment = aiScore > 70 ? "High Risk" : aiScore < 30 ? "Low Risk" : "Moderate Risk";

      let ipAddress: string | null = null;
      try {
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipRes.json();
        ipAddress = ipData.ip;
        await supabase.from("profiles").update({ last_ip: ipAddress } as any).eq("id", user!.id);
      } catch {
        /* IP capture is best-effort */
      }

      const docName = editorRef.current?.getDocumentName() || "Untitled Document";
      setLastScanMeta({ wordCount, creditsUsed: creditsNeeded, ipAddress, documentName: docName });

      const { error: insertError } = await (supabase as any).from("scans").insert({
        user_id: user!.id,
        document_name: docName,
        ai_score: aiScore,
        human_score: humanScore,
        word_count: wordCount,
        credits_used: creditsNeeded,
        risk_assessment: riskAssessment,
      });
      if (insertError) throw new Error(insertError.message);

      await deductCredits(creditsNeeded);
      refetchCredits();

      toast({ title: "Scan saved to history", description: `${wordCount} words scanned using ${creditsNeeded} credits.` });
    } catch (err: any) {
      toast({ title: "Scan Failed", description: err.message || "Something went wrong.", variant: "destructive" });
    } finally {
      setIsScanning(false);
    }
  };

  if (loading) return null;
  if (!user) return null;

  const scanDisabled = currentWordCount < 200 || isScanning || isExpired || !currentDocName.trim() || !contextConfirmed;

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
                  <div className="flex-1 flex flex-col min-w-0 border-r border-border">
                    <div className="flex-1">
                      <ContentEditor ref={editorRef} onTextChange={(t) => setCurrentWordCount(t.trim() === "" ? 0 : t.trim().split(/\s+/).length)} onDocNameChange={setCurrentDocName} onContextConfirmChange={setContextConfirmed} />
                    </div>
                    {/* Primary Scan CTA below editor */}
                    <div className="flex justify-end px-4 py-3 border-t border-border bg-card">
                      <Button
                        onClick={handleScan}
                        disabled={scanDisabled}
                        className={`gap-2 font-bold h-12 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
                          !scanDisabled ? "animate-pulse-subtle" : ""
                        }`}
                        aria-label="Start AI authenticity scan"
                      >
                        <Bot className="w-5 h-5" />
                        {isScanning ? "Scanning…" : isExpired ? "Credits Expired" : "Scan"}
                      </Button>
                    </div>
                  </div>
                  <div className="w-72 shrink-0 bg-card border-l border-border hidden lg:flex flex-col">
                    <ScanOptionsPanel
                      options={scanOptions}
                      onOptionsChange={setScanOptions}
                      onScan={handleScan}
                      isScanning={isScanning}
                      wordCount={currentWordCount}
                      disabled={isExpired}
                      hasDocName={!!currentDocName.trim()}
                      contextConfirmed={contextConfirmed}
                    />
                  </div>
                </div>
              ) : activeView === "history" ? (
                <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
                  <ScanHistoryPanel />
                </main>
              ) : activeView === "payments" ? (
                <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
                  <PaymentHistory />
                </main>
              ) : activeView === "settings" ? (
                <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
                  <h1 className="text-xl font-extrabold text-foreground tracking-tight mb-6">Account Settings</h1>
                  <ChangePassword />
                </main>
              ) : null}

              {activeView === "editor" && results && (
                <div className="border-t border-border">
                  <div className="max-w-4xl mx-auto w-full px-6 py-8">
                    <ResultsPanel results={results} wordCount={lastScanMeta.wordCount} creditsUsed={lastScanMeta.creditsUsed} ipAddress={lastScanMeta.ipAddress} documentName={lastScanMeta.documentName} />
                  </div>
                </div>
              )}

              {activeView === "editor" && (
                <div className="lg:hidden p-4 border-t border-border bg-card">
                  <Button
                    onClick={handleScan}
                    disabled={scanDisabled}
                    className={`w-full gap-2 font-bold h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
                      !scanDisabled ? "animate-pulse-subtle" : ""
                    }`}
                    aria-label="Start AI authenticity scan"
                  >
                    <Bot className="w-5 h-5" />
                    {isScanning ? "Scanning…" : isExpired ? "Credits Expired" : "Scan"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </SidebarProvider>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
