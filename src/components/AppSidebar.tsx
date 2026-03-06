import { FileText, History, Coins, CreditCard, Plus, Clock, Receipt, ShieldAlert, Settings } from "lucide-react";
import { useCredits } from "@/hooks/useCredits";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminRole } from "@/hooks/useAdminRole";
import { usePendingCount } from "@/hooks/usePendingCount";
import { useNavigate } from "react-router-dom";
import { formatDateBD } from "@/utils/dateFormat";
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
  activeView: "editor" | "history" | "payments" | "settings";
  onViewChange: (view: "editor" | "history" | "payments" | "settings") => void;
  onNewScan?: () => void;
}

export function AppSidebar({ activeView, onViewChange, onNewScan }: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { balance, daysRemaining, expiresAt } = useCredits();
  const { user } = useAuth();
  const { isAdmin } = useAdminRole();
  const pendingCount = usePendingCount();
  const navigate = useNavigate();

  const navItems = [
    { title: "Editor", icon: FileText, view: "editor" as const },
    { title: "Scan History", icon: History, view: "history" as const },
    { title: "Payments", icon: Receipt, view: "payments" as const },
    { title: "Settings", icon: Settings, view: "settings" as const },
  ];

  const wordsFromCredits = (credits: number) => (credits * 100).toLocaleString();

  const isExpired = daysRemaining !== null && daysRemaining === 0;

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-card">
      <SidebarContent className="py-4 flex flex-col h-full">
        {/* New Scan Button */}
        <div className="px-3 mb-4">
          <Button
            onClick={onNewScan}
            className={`w-full gap-2 font-bold bg-primary text-primary-foreground hover:bg-primary/90 ${collapsed ? "px-2" : ""}`}
            size={collapsed ? "icon" : "default"}
          >
            <Plus className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="text-sm">New Scan</span>}
          </Button>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground px-4">
            Scan
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

        {/* Admin Link */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => navigate("/admin")}
                    className="mx-2 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    {!collapsed && (
                      <span className="text-sm font-semibold flex items-center gap-2">
                        Admin Panel
                        {pendingCount > 0 && (
                          <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-destructive text-destructive-foreground">
                            {pendingCount}
                          </span>
                        )}
                      </span>
                    )}
                    {collapsed && pendingCount > 0 && (
                      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold rounded-full bg-destructive text-destructive-foreground">
                        {pendingCount}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Balance section at bottom */}
        {user && (
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <div className={`mx-3 rounded-lg border border-border bg-secondary p-4 ${collapsed ? "p-2" : ""}`}>
                {!collapsed ? (
                  <>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-center mb-1">
                      Balance
                    </p>
                    <p className="text-lg font-extrabold text-foreground font-mono tabular-nums text-center">
                      {balance != null ? balance.toLocaleString() : "—"} <span className="text-xs font-medium text-muted-foreground">credits</span>
                    </p>
                    {balance != null && (
                      <p className="text-[11px] text-muted-foreground text-center font-mono">
                        ({wordsFromCredits(balance)} words)
                      </p>
                    )}

                    {/* Expiry display */}
                    {expiresAt && !isExpired && (
                      <p className="text-[10px] text-muted-foreground text-center mt-1.5">
                        Expires on: {formatDateBD(expiresAt)}
                      </p>
                    )}

                    {daysRemaining !== null && daysRemaining > 0 && (
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <Clock className={`w-3 h-3 ${daysRemaining < 3 ? "text-[hsl(45,100%,51%)]" : "text-primary"}`} />
                        <span
                          className={`text-[11px] font-semibold ${
                            daysRemaining < 3 ? "text-[hsl(45,100%,51%)]" : "text-primary"
                          }`}
                        >
                          {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} left
                        </span>
                      </div>
                    )}

                    {isExpired && (
                      <p className="text-[11px] text-center font-semibold text-destructive mt-1.5">
                        Credits expired
                      </p>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate("/pricing")}
                      className="w-full mt-3 gap-1.5 text-xs font-semibold border-primary text-primary hover:bg-primary/10"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      Buy more credits
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <Coins className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold text-foreground font-mono">{balance ?? "—"}</span>
                    {daysRemaining !== null && daysRemaining > 0 && (
                      <span className={`text-[9px] font-bold ${daysRemaining < 3 ? "text-[hsl(45,100%,51%)]" : "text-primary"}`}>{daysRemaining}d</span>
                    )}
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
