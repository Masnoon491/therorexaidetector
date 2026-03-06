import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

const WORD_LIMIT_KEY = "theorex_free_words_used";
const AUTH_STORAGE_PATTERNS = ["supabase.auth.token", "sb-", "supabase", "auth-token", "pkce"];

function clearAuthStorage() {
  const clearMatchingKeys = (storage: Storage) => {
    const keysToRemove: string[] = [];
    for (let i = 0; i < storage.length; i += 1) {
      const key = storage.key(i);
      if (!key) continue;
      const lower = key.toLowerCase();
      const shouldRemove = AUTH_STORAGE_PATTERNS.some((pattern) => lower.includes(pattern));
      if (shouldRemove) keysToRemove.push(key);
    }
    keysToRemove.forEach((key) => storage.removeItem(key));
  };

  clearMatchingKeys(localStorage);
  clearMatchingKeys(sessionStorage);
}

function getPreferredDisplayName(user: User): string | null {
  const metadata = user.user_metadata as Record<string, unknown> | undefined;
  const fullName = typeof metadata?.full_name === "string" ? metadata.full_name : null;
  const name = typeof metadata?.name === "string" ? metadata.name : null;
  if (fullName) return fullName;
  if (name) return name;
  return user.email ? user.email.split("@")[0] : null;
}

export function getFreeWordsUsed(): number {
  return parseInt(localStorage.getItem(WORD_LIMIT_KEY) || "0", 10);
}

export function addFreeWordsUsed(count: number) {
  const current = getFreeWordsUsed();
  localStorage.setItem(WORD_LIMIT_KEY, String(current + count));
}

export const FREE_WORD_LIMIT = 100;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const ensureUserBootstrap = async (nextSession: Session) => {
    const currentUser = nextSession.user;
    if (!currentUser) return;

    let ipAddress: string | null = null;
    try {
      const ipRes = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipRes.json();
      ipAddress = ipData.ip || null;
    } catch {
      // best-effort
    }

    await supabase
      .from("profiles")
      .upsert(
        {
          id: currentUser.id,
          email: currentUser.email ?? null,
          display_name: getPreferredDisplayName(currentUser),
          last_ip: ipAddress,
        },
        { onConflict: "id" },
      );

    await supabase
      .from("user_credits")
      .upsert({ user_id: currentUser.id }, { onConflict: "user_id", ignoreDuplicates: true });
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);

      if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && nextSession?.user) {
        setTimeout(() => {
          void ensureUserBootstrap(nextSession);
        }, 0);
      }

      if (event === "SIGNED_OUT") {
        clearAuthStorage();
      }
    });

    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setLoading(false);

      if (initialSession?.user) {
        setTimeout(() => {
          void ensureUserBootstrap(initialSession);
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Sign-out failed:", error);
    } finally {
      setUser(null);
      setSession(null);
      clearAuthStorage();
      window.location.href = "/";
    }
  };

  return <AuthContext.Provider value={{ user, session, loading, signOut }}>{children}</AuthContext.Provider>;
}

