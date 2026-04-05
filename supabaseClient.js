import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL = `${import.meta.env.VITE_SUPABASE_URL ?? ""}`.trim();
export const SUPABASE_KEY = `${import.meta.env.VITE_SUPABASE_ANON_KEY ?? ""}`.trim();

function lortuAuthBiltegia() {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    return window.sessionStorage;
  } catch (_errorea) {
    return undefined;
  }
}

export function supabaseKonfiguratutaDago() {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}

export const supabase = supabaseKonfiguratutaDago()
  ? createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        storage: lortuAuthBiltegia(),
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export function lortuSupabaseHeaders() {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
  };
}
