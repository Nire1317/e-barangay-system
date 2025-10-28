import { supabase } from "./supabaseClient";

// Create new certificate request
export async function createRequest(resident_id, type_id, purpose) {
  const { data, error } = await supabase
    .from("requests")
    .insert([{ resident_id, type_id, purpose, status: "Pending" }]);
  if (error) throw error;
  return data;
}

// Get requests for a resident
export async function getResidentRequests(resident_id) {
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .eq("resident_id", resident_id)
    .order("submitted_at", { ascending: false });
  if (error) throw error;
  return data;
}

// For admin: view all requests
export async function getAllRequests() {
  const { data, error } = await supabase
    .from("requests")
    .select("*, residents(full_name, address), request_types(type_name)");
  if (error) throw error;
  return data;
}
