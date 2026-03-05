import { Mail, MessageCircle } from "lucide-react";
import { MosaicStrip } from "./TopNav";

const Footer = () => {
  return (
    <footer className="mt-12">
      <MosaicStrip />
      <div className="bg-navy">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col items-center gap-3 text-center">
          <p className="text-sm font-bold text-navy-foreground tracking-wide">
            Theorex Consulting
          </p>
          <p className="text-[11px] text-navy-foreground/50 tracking-wide">
            AI Authenticity Intelligence • Promoting Transparency Over Mere Detection
          </p>
          <div className="flex items-center gap-6 mt-2">
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] text-navy-foreground/60 hover:text-primary transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </a>
            <a
              href="mailto:contact@theorex.com"
              className="flex items-center gap-1.5 text-[11px] text-navy-foreground/60 hover:text-primary transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              contact@theorex.com
            </a>
          </div>
          <p className="text-[10px] text-navy-foreground/30 mt-3">
            © {new Date().getFullYear()} Theorex Consulting. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
