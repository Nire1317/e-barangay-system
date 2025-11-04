import { useState, useEffect, useCallback } from "react";
import { supabase } from "../services/supabaseClient";

export const useRequests = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all requests
  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("requests")
        .select(
          `
          request_id,
          purpose,
          status,
          submitted_at,
          reviewed_at,
          remarks,
          resident_id,
          residents!inner (
            contact_number,
            user_id,
            users!inner (
              full_name
            )
          ),
          request_types!inner (
            type_name
          ),
          reviewer:users!reviewed_by (
            full_name
          )
        `
        )
        .order("submitted_at", { ascending: false });

      if (fetchError) throw fetchError;

      // Transform the data
      const transformedRequests =
        data?.map((request) => ({
          request_id: request.request_id,
          resident_name: request.residents.users.full_name,
          contact_number: request.residents.contact_number,
          type_name: request.request_types.type_name,
          purpose: request.purpose,
          status: request.status,
          submitted_at: request.submitted_at,
          reviewed_by: request.reviewer?.full_name,
          reviewer_name: request.reviewer?.full_name,
          reviewed_at: request.reviewed_at,
          remarks: request.remarks,
        })) || [];

      setRequests(transformedRequests);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Approve a request
  const approveRequest = useCallback(
    async (requestId) => {
      try {
        const { data: userData } = await supabase.auth.getUser();

        const { error: updateError } = await supabase
          .from("requests")
          .update({
            status: "Approved",
            reviewed_by: userData?.user?.id,
            reviewed_at: new Date().toISOString(),
          })
          .eq("request_id", requestId);

        if (updateError) throw updateError;

        // Log activity
        await supabase.from("activity_logs").insert({
          user_id: userData?.user?.id,
          action: "Request Approved",
          details: `Approved request ${requestId}`,
        });

        // Refresh requests
        await fetchRequests();

        return { success: true };
      } catch (err) {
        console.error("Error approving request:", err);
        return { success: false, error: err.message };
      }
    },
    [fetchRequests]
  );

  // Deny a request
  const denyRequest = useCallback(
    async (requestId) => {
      try {
        const { data: userData } = await supabase.auth.getUser();

        const { error: updateError } = await supabase
          .from("requests")
          .update({
            status: "Denied",
            reviewed_by: userData?.user?.id,
            reviewed_at: new Date().toISOString(),
          })
          .eq("request_id", requestId);

        if (updateError) throw updateError;

        // Log activity
        await supabase.from("activity_logs").insert({
          user_id: userData?.user?.id,
          action: "Request Denied",
          details: `Denied request ${requestId}`,
        });

        // Refresh requests
        await fetchRequests();

        return { success: true };
      } catch (err) {
        console.error("Error denying request:", err);
        return { success: false, error: err.message };
      }
    },
    [fetchRequests]
  );

  // Update request status (generic)
  const updateRequestStatus = useCallback(
    async (requestId, status, remarks = null) => {
      try {
        const { data: userData } = await supabase.auth.getUser();

        const updateData = {
          status,
          reviewed_by: userData?.user?.id,
          reviewed_at: new Date().toISOString(),
        };

        if (remarks) {
          updateData.remarks = remarks;
        }

        const { error: updateError } = await supabase
          .from("requests")
          .update(updateData)
          .eq("request_id", requestId);

        if (updateError) throw updateError;

        // Log activity
        await supabase.from("activity_logs").insert({
          user_id: userData?.user?.id,
          action: `Request ${status}`,
          details: `Updated request ${requestId} to ${status}`,
        });

        // Refresh requests
        await fetchRequests();

        return { success: true };
      } catch (err) {
        console.error("Error updating request:", err);
        return { success: false, error: err.message };
      }
    },
    [fetchRequests]
  );

  // Get statistics
  const getStats = useCallback(() => {
    return {
      total: requests.length,
      pending: requests.filter((r) => r.status === "Pending").length,
      approved: requests.filter((r) => r.status === "Approved").length,
      denied: requests.filter((r) => r.status === "Denied").length,
      completed: requests.filter((r) => r.status === "Completed").length,
    };
  }, [requests]);

  // Initial fetch
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return {
    requests,
    isLoading,
    error,
    fetchRequests,
    approveRequest,
    denyRequest,
    updateRequestStatus,
    getStats,
  };
};
