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
import { useScanHistory } from "@/hooks/useScanHistory";
import type { ScanResults } from "@/types/scan";
import { normalizeResponse } from "@/utils/normalizeResponse";

const Dashboard = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<ScanResults | null>(null);
  const [activeView, setActiveView] = useState<"editor" | "history" | "payments" | "settings">("editor");
  const [scanOptions, setScanOptions] = useState<ScanOptions>({ aiScore: true, plagiarism: true, readability: false });
  const [currentWordCount, setCurrentWordCount] = useState(0);
  const editorRef = useRef<ContentEditorRef>(null);
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const { balance, deductCredits, refetch: refetchCredits } = useCredits();
  const { logScan } = useScanHistory();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/auth?mode=login");
  }, [user, loading, navigate]);

  const handleNewScan = () => {
    setResults(null);
    setActiveView("editor");
    editorRef.current?.clear();
  };

  const handleScan = async () => {
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

      await deductCredits(creditsNeeded);
      refetchCredits();

      const normalized = normalizeResponse(data);
      setResults(normalized);

      // Capture IP for tracking
      let ipAddress: string | null = null;
      try {
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipRes.json();
        ipAddress = ipData.ip;
        await supabase.from("profiles").update({ last_ip: ipAddress } as any).eq("id", user!.id);
      } catch { /* IP capture is best-effort */ }

      await logScan({ title: `Scan - ${new Date().toLocaleString()}`, word_count: wordCount, ai_score: normalized.ai?.score ?? null, plagiarism_score: normalized.plagiarism?.score ?? null, credits_used: creditsNeeded, ip_address: ipAddress } as any);
    } catch (err: any) {
      toast({ title: "Scan Failed", description: err.message || "Something went wrong.", variant: "destructive" });
    } finally {
      setIsScanning(false);
    }
  };

  if (loading) return null;
  if (!user) return null;

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
                      <ContentEditor ref={editorRef} onTextChange={(t) => setCurrentWordCount(t.trim() === "" ? 0 : t.trim().split(/\s+/).length)} />
                    </div>
                  </div>
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
                    <ResultsPanel results={results} />
                  </div>
                </div>
              )}

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
};

export default Dashboard;
