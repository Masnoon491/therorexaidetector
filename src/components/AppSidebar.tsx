import { FileText, History, Coins, CreditCard } from "lucide-react";
import { useCredits } from "@/hooks/useCredits";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

interface AppSidebarProps {
  activeView: "editor" | "history";
  onViewChange: (view: "editor" | "history") => void;
}

export function AppSidebar({ activeView, onViewChange }: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { balance } = useCredits();
  const { user } = useAuth();

  const navItems = [
    { title: "Editor", icon: FileText, view: "editor" as const },
    { title: "Scan History", icon: History, view: "history" as const },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-card">
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground px-4">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => onViewChange(item.view)}
                    className={`mx-2 rounded-md transition-colors ${
                      activeView === item.view
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {!collapsed && <span className="text-sm">{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Balance section */}
        {user && (
          <SidebarGroup className="mt-auto">
            <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground px-4">
              Balance
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className={`mx-3 rounded-lg border border-border bg-[hsl(var(--stat-bg))] p-4 ${collapsed ? "p-2" : ""}`}>
                {!collapsed ? (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <Coins className="w-4 h-4 text-primary" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Available Credits
                      </span>
                    </div>
                    <p className="text-2xl font-extrabold text-foreground font-mono tabular-nums">
                      {balance ?? "—"}
                    </p>
                    <Button
                      size="sm"
                      className="w-full mt-3 gap-1.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      Buy Credits
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <Coins className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold text-foreground font-mono">{balance ?? "—"}</span>
                  </div>
                )}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
