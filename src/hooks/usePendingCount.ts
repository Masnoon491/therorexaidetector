import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminRole } from "@/hooks/useAdminRole";

export function usePendingCount() {
  const { isAdmin } = useAdminRole();
  const [count, setCount] = useState(0);

  const fetchCount = async () => {
    if (!isAdmin) return;
    const { count: c } = await supabase
      .from("payment_transactions")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");
    setCount(c || 0);
  };

  useEffect(() => {
    if (!isAdmin) return;
    fetchCount();
    const channel = supabase
      .channel("pending_count")
      .on("postgres_changes", { event: "*", schema: "public", table: "payment_transactions" }, () => fetchCount())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [isAdmin]);

  return count;
}
