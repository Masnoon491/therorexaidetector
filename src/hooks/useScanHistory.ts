import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ScanHistoryEntry {
  id: string;
  user_id: string;
  document_name: string;
  ai_score: number;
  human_score: number;
  risk_assessment: string;
  word_count: number;
  credits_used: number;
  created_at: string;
}

export function useScanHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<ScanHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    if (!user) {
      setHistory([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("scans")
      .select("id,user_id,document_name,ai_score,human_score,risk_assessment,word_count,credits_used,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Failed to fetch scan history:", error);
      setHistory([]);
    } else {
      setHistory((data as ScanHistoryEntry[]) || []);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`scans_${user.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "scans", filter: `user_id=eq.${user.id}` },
        () => fetchHistory(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchHistory]);

  return { history, loading, refetch: fetchHistory };
}
