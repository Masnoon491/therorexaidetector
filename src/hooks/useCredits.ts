import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useCredits() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBalance = useCallback(async () => {
    if (!user) { setBalance(null); setExpiresAt(null); setLoading(false); return; }
    const { data } = await supabase
      .from("user_credits")
      .select("balance, expires_at")
      .eq("user_id", user.id)
      .maybeSingle();
    if (data) {
      // Check if credits have expired
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        // Expire the credits
        await supabase
          .from("user_credits")
          .update({ balance: 0, updated_at: new Date().toISOString() })
          .eq("user_id", user.id);
        setBalance(0);
        setExpiresAt(data.expires_at);
      } else {
        setBalance(data.balance);
        setExpiresAt(data.expires_at);
      }
    } else {
      await supabase.from("user_credits").insert({ user_id: user.id, balance: 0 });
      setBalance(0);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchBalance(); }, [fetchBalance]);

  // Subscribe to realtime changes on user_credits
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`user_credits_${user.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "user_credits", filter: `user_id=eq.${user.id}` },
        (payload) => {
          const newData = payload.new as any;
          setBalance(newData.balance);
          setExpiresAt(newData.expires_at);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const daysRemaining = expiresAt
    ? Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  const deductCredits = async (amount: number) => {
    if (!user || balance === null) return false;
    if (balance < amount) return false;
    const newBalance = balance - amount;
    const { error } = await supabase
      .from("user_credits")
      .update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);
    if (error) return false;
    setBalance(newBalance);
    return true;
  };

  return { balance, loading, daysRemaining, expiresAt, deductCredits, refetch: fetchBalance };
}

export function calculateCredits(wordCount: number): number {
  return Math.ceil(wordCount / 100) * 2;
}
