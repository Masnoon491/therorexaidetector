import { useState } from "react";
import TopNav from "@/components/TopNav";
import ContentEditor from "@/components/ContentEditor";
import ResultsSidebar from "@/components/ResultsSidebar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ScanResults {
  ai?: { score: number };
  plagiarism?: { score: number };
  readability?: { grade?: string; score?: number };
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
        body: {
          content: text,
          title: `Scan - ${new Date().toLocaleString()}`,
        },
      });

      if (error) throw new Error(error.message);

      if (data?.isRateLimit) {
        toast({
          title: "Rate Limited",
          description: "Too many requests. Please wait a moment and try again.",
          variant: "destructive",
        });
        return;
      }

      if (data?.error) throw new Error(data.error);

      setResults(data);
    } catch (err: any) {
      toast({
        title: "Scan Failed",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
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
