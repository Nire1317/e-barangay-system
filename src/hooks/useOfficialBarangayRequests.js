import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from './useAuth';

export const useOfficialBarangayRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all barangay requests for the official's barangay
  const fetchBarangayRequests = async (filters = {}) => {
    if (!user?.barangayId) {
      setError('You must be assigned to a barangay to view requests');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('barangay_requests')
        .select(`
          *,
          users (
            user_id,
            email,
            full_name,
            created_at
          ),
          barangays (
            barangay_id,
            barangay_name,
            municipality,
            province,
            region
          )
        `)
        .eq('barangay_id', user.barangayId)
        .order('requested_at', { ascending: false });

      // Apply status filter if provided
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      // Apply date range filter if provided
      if (filters.startDate) {
        query = query.gte('requested_at', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('requested_at', filters.endDate);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setRequests(data || []);
    } catch (err) {
      console.error('Error fetching barangay requests:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics for dashboard
  const fetchRequestStats = async () => {
    if (!user?.barangayId) return;

    try {
      const { data, error: statsError } = await supabase
        .from('barangay_requests')
        .select('status')
        .eq('barangay_id', user.barangayId);

      if (statsError) throw statsError;

      const stats = {
        pending: data.filter((r) => r.status === 'Pending').length,
        approved: data.filter((r) => r.status === 'Approved').length,
        rejected: data.filter((r) => r.status === 'Rejected').length,
        total: data.length,
      };

      setStats(stats);
      return stats;
    } catch (err) {
      console.error('Error fetching request stats:', err);
      return null;
    }
  };

  // Approve a barangay request
  const approveRequest = async (requestId, approvedBy, notes = '') => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      setLoading(true);
      setError(null);

      // Get the request details first
      const { data: request, error: fetchError } = await supabase
        .from('barangay_requests')
        .select('*, users(user_id, email, full_name)')
        .eq('request_id', requestId)
        .eq('status', 'Pending')
        .single();

      if (fetchError) throw fetchError;
      if (!request) throw new Error('Request not found or already processed');

      // Update request status to Approved
      const { error: updateError } = await supabase
        .from('barangay_requests')
        .update({
          status: 'Approved',
          reviewed_at: new Date().toISOString(),
        })
        .eq('request_id', requestId);

      if (updateError) throw updateError;

      // Update user's barangay_id
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({
          barangay_id: request.barangay_id,
        })
        .eq('user_id', request.user_id);

      if (userUpdateError) throw userUpdateError;

      // Log activity
      await supabase.from('activity_logs').insert([
        {
          user_id: approvedBy,
          action: 'barangay_request_approved',
          details: `Approved barangay request ${requestId} for user ${request.users?.full_name || request.user_id}`,
        },
      ]);

      // Refresh requests list
      await fetchBarangayRequests();
      await fetchRequestStats();

      return { success: true };
    } catch (err) {
      console.error('Error approving request:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reject a barangay request
  const rejectRequest = async (requestId, rejectedBy, reason) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    if (!reason || reason.trim() === '') {
      throw new Error('Rejection reason is required');
    }

    try {
      setLoading(true);
      setError(null);

      // Get the request details first
      const { data: request, error: fetchError } = await supabase
        .from('barangay_requests')
        .select('*, users(user_id, email, full_name)')
        .eq('request_id', requestId)
        .eq('status', 'Pending')
        .single();

      if (fetchError) throw fetchError;
      if (!request) throw new Error('Request not found or already processed');

      // Update request status to Rejected
      const { error: updateError } = await supabase
        .from('barangay_requests')
        .update({
          status: 'Rejected',
          reviewed_at: new Date().toISOString(),
          rejection_reason: reason,
        })
        .eq('request_id', requestId);

      if (updateError) throw updateError;

      // Log activity
      await supabase.from('activity_logs').insert([
        {
          user_id: rejectedBy,
          action: 'barangay_request_rejected',
          details: `Rejected barangay request ${requestId} for user ${request.users?.full_name || request.user_id}. Reason: ${reason}`,
        },
      ]);

      // Refresh requests list
      await fetchBarangayRequests();
      await fetchRequestStats();

      return { success: true };
    } catch (err) {
      console.error('Error rejecting request:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get request details by ID
  const getRequestById = async (requestId) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('barangay_requests')
        .select(`
          *,
          users (
            user_id,
            email,
            full_name,
            created_at
          ),
          barangays (
            barangay_id,
            barangay_name,
            municipality,
            province,
            region
          )
        `)
        .eq('request_id', requestId)
        .single();

      if (fetchError) throw fetchError;

      return data;
    } catch (err) {
      console.error('Error fetching request details:', err);
      throw err;
    }
  };

  return {
    requests,
    stats,
    loading,
    error,
    fetchBarangayRequests,
    fetchRequestStats,
    approveRequest,
    rejectRequest,
    getRequestById,
  };
};
