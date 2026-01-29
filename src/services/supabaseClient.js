// src/services/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// Load environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Throw an error if they are missing
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase environment variables are missing. " +
    "Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file or in Vercel dashboard."
  );
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper: get current user's role
export const getCurrentUserRole = async () => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("users")
    .select("role")
    .eq("user_id", user.id)
    .single();

  return data?.role || null;
};

// Helper: check if user is official
export const isUserOfficial = async () => {
  const role = await getCurrentUserRole();
  return role === "official";
};
