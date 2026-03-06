import { forwardRef } from "react";
import { Mail, MessageCircle } from "lucide-react";

const Footer = forwardRef<HTMLElement>((_, ref) => {
  return (
    <footer ref={ref} className="border-t border-border bg-card mt-12">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col items-center gap-3 text-center">
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-extrabold tracking-tight text-foreground">
            THEOREX
          </span>
          <span className="text-sm font-bold text-primary">
            AI Detector
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground tracking-wide">
          AI Authenticity Intelligence • Promoting Transparency Over Mere Detection
        </p>
        <div className="flex items-center gap-6 mt-2">
          <a
            href="https://wa.me/8801819185751"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-primary transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            01819185751
          </a>
          <span className="text-muted-foreground/40">|</span>
          <a
            href="mailto:salestheorex@gmail.com"
            className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-primary transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            salestheorex@gmail.com
          </a>
        </div>
        <p className="text-[10px] text-muted-foreground/50 mt-3">
          © {new Date().getFullYear()} Theorex Consulting. All rights reserved.
        </p>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
