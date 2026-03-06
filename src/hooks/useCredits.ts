import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useCredits() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBalance = useCallback(async () => {
    setLoading(true);

    if (!user) {
      setBalance(null);
      setExpiresAt(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("user_credits")
        .select("balance, expires_at")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        setBalance(null);
        setExpiresAt(null);
        return;
      }

      if (!data) {
        await supabase
          .from("user_credits")
          .upsert({ user_id: user.id }, { onConflict: "user_id", ignoreDuplicates: true });
        setBalance(0);
        setExpiresAt(null);
        return;
      }

      const isExpired = data.expires_at ? new Date(data.expires_at).getTime() <= Date.now() : false;

      if (isExpired && data.balance !== 0) {
        await supabase
          .from("user_credits")
          .update({ balance: 0, updated_at: new Date().toISOString() })
          .eq("user_id", user.id);
        setBalance(0);
      } else {
        setBalance(data.balance);
      }

      setExpiresAt(data.expires_at);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      setTimeout(() => {
        void fetchBalance();
      }, 0);
    });

    return () => subscription.unsubscribe();
  }, [fetchBalance]);

  // Subscribe to realtime changes on user_credits
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`user_credits_${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_credits", filter: `user_id=eq.${user.id}` },
        () => {
          void fetchBalance();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchBalance]);

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
