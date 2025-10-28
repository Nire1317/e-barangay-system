// src/services/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get current user's role
export const getCurrentUserRole = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("users")
    .select("role")
    .eq("user_id", user.id)
    .single();

  return data?.role || null;
};

// Helper function to check if user is official
export const isUserOfficial = async () => {
  const role = await getCurrentUserRole();
  return role === "official";
};
