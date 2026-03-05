import { Mail, MessageCircle } from "lucide-react";

const TopNav = () => {
  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold tracking-tight text-foreground">
              THEOREX
            </span>
            <span className="text-xl font-bold text-primary">
              Consulting
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground tracking-wide mt-0.5">
            AI Authenticity Intelligence • Promoting Transparency Over Mere Detection
          </p>
        </div>

        {/* Contact */}
        <div className="hidden sm:flex items-center gap-5">
          <a
            href="https://wa.me/8801819185751"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-primary transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            01819185751
          </a>
          <a
            href="mailto:salestheorex@gmail.com"
            className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-primary transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            salestheorex@gmail.com
          </a>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
