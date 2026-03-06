import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ScanHistoryEntry {
  id: string;
  title: string;
  word_count: number;
  ai_score: number | null;
  plagiarism_score: number | null;
  credits_used: number;
  created_at: string;
}

export function useScanHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<ScanHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    if (!user) { setHistory([]); setLoading(false); return; }
    const { data } = await supabase
      .from("scan_history")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    setHistory((data as ScanHistoryEntry[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  // Realtime: auto-refresh when new scans are inserted for this user
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`scan_history_${user.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "scan_history", filter: `user_id=eq.${user.id}` },
        () => { fetchHistory(); }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, fetchHistory]);

  const logScan = async (entry: {
    title: string;
    word_count: number;
    ai_score?: number;
    plagiarism_score?: number;
    credits_used: number;
  }) => {
    if (!user) return;
    await supabase.from("scan_history").insert({
      user_id: user.id,
      ...entry,
    });
    // Realtime will trigger fetchHistory automatically
  };

  return { history, loading, logScan, refetch: fetchHistory };
}
