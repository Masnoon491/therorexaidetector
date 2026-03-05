import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useCredits() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBalance = useCallback(async () => {
    if (!user) { setBalance(null); setLoading(false); return; }
    const { data } = await supabase
      .from("user_credits")
      .select("balance")
      .eq("user_id", user.id)
      .maybeSingle();
    if (data) setBalance(data.balance);
    else {
      // Create initial credits row if missing (for users created before trigger)
      await supabase.from("user_credits").insert({ user_id: user.id, balance: 100 });
      setBalance(100);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchBalance(); }, [fetchBalance]);

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

  return { balance, loading, deductCredits, refetch: fetchBalance };
}

export function calculateCredits(wordCount: number): number {
  return Math.ceil(wordCount / 100) * 2;
}
