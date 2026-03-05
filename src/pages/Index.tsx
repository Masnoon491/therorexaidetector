import { useState } from "react";
import TopNav from "@/components/TopNav";
import ContentEditor from "@/components/ContentEditor";
import ResultsSidebar from "@/components/ResultsSidebar";

const Index = () => {
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = (text: string) => {
    setIsScanning(true);
    // Placeholder — will integrate real scanning later
    setTimeout(() => setIsScanning(false), 2000);
  };

  return (
    <div className="flex flex-col h-screen">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <ContentEditor onScan={handleScan} isScanning={isScanning} />
        </main>
        <ResultsSidebar />
      </div>
    </div>
  );
};

export default Index;
