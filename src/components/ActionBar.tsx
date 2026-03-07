import { Bot, FileUp, DownloadCloud, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ActionBarProps {
  onImport: () => void;
  onScan: () => void;
  onDownload: () => void;
  isImporting: boolean;
  isScanning: boolean;
  isGeneratingPdf: boolean;
  scanDisabled: boolean;
  downloadDisabled: boolean;
  isExpired: boolean;
}

const ActionBar = ({
  onImport,
  onScan,
  onDownload,
  isImporting,
  isScanning,
  isGeneratingPdf,
  scanDisabled,
  downloadDisabled,
  isExpired,
}: ActionBarProps) => {
  const scanReady = !scanDisabled;

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4 px-4 py-4 border-t-2 border-border bg-card">
      {/* Import Document — Left */}
      <Button
        variant="outline"
        onClick={onImport}
        disabled={isImporting}
        className="gap-2 font-semibold h-12 text-sm border-navy text-foreground hover:bg-secondary transition-all duration-200 hover:shadow-lg hover:scale-105 md:flex-1"
        aria-label="Import document"
      >
        {isImporting ? (
          <Loader2 className="w-4.5 h-4.5 animate-spin" />
        ) : (
          <FileUp className="w-4.5 h-4.5" />
        )}
        {isImporting ? "Importing…" : "Import Document"}
      </Button>

      {/* Scan Now — Center Hero */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="md:flex-[1.3]">
              <Button
                onClick={onScan}
                disabled={scanDisabled}
                className={`w-full gap-2.5 font-bold h-14 text-base bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:shadow-xl hover:scale-105 ${
                  scanReady ? "animate-pulse-subtle" : ""
                }`}
                aria-label="Start AI authenticity scan"
              >
                {isScanning ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Bot className="w-5 h-5" />
                )}
                {isScanning
                  ? "Scanning…"
                  : isExpired
                  ? "Credits Expired"
                  : "Scan Now"}
              </Button>
            </div>
          </TooltipTrigger>
          {scanDisabled && !isScanning && (
            <TooltipContent side="top" className="max-w-xs text-xs">
              Scan full context (min 200 words) to unlock report
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      {/* Download Report — Right */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="md:flex-1">
              <Button
                onClick={onDownload}
                disabled={downloadDisabled}
                className="w-full gap-2 font-bold h-12 text-sm bg-navy text-navy-foreground hover:bg-navy/90 transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:opacity-40"
                aria-label="Generate certified audit report PDF"
              >
                {isGeneratingPdf ? (
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                ) : (
                  <DownloadCloud className="w-4.5 h-4.5" />
                )}
                {isGeneratingPdf
                  ? "Generating…"
                  : "Download Report"}
              </Button>
            </div>
          </TooltipTrigger>
          {downloadDisabled && (
            <TooltipContent side="top" className="max-w-xs text-xs">
              Scan full context (min 200 words) to unlock report
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ActionBar;
