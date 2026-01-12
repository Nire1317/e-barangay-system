import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from './useAuth';

export const useOfficialVerifications = () => {
  const { user } = useAuth();
  const [verifications, setVerifications] = useState([]);
  const [userVerification, setUserVerification] = useState(null);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user's own verification request
  const fetchUserVerification = async () => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('official_verifications')
        .select(`
          *,
          barangays (
            barangay_id,
            barangay_name,
            municipality,
            province,
            region
          )
        `)
        .eq('user_id', user.id)
        .order('requested_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      setUserVerification(data);
    } catch (err) {
      console.error('Error fetching user verification:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Submit verification request
  const submitVerification = async (barangayId, proofDocumentUrl) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    if (!barangayId) {
      throw new Error('Barangay selection is required');
    }

    if (!proofDocumentUrl) {
      throw new Error('Proof document is required');
    }

    try {
      setLoading(true);
      setError(null);

      // Check if user already has a pending verification
      const { data: existing } = await supabase
        .from('official_verifications')
        .select('verification_id, verification_status')
        .eq('user_id', user.id)
        .eq('verification_status', 'Pending')
        .single();

      if (existing) {
        throw new Error('You already have a pending verification request');
      }

      // Insert new verification request
      const { data, error: insertError } = await supabase
        .from('official_verifications')
        .insert([
          {
            user_id: user.id,
            barangay_id: barangayId,
            proof_document_url: proofDocumentUrl,
            verification_status: 'Pending',
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // Log activity
      await supabase.from('activity_logs').insert([
        {
          user_id: user.id,
          action: 'official_verification_requested',
          details: `Requested official verification for barangay ${barangayId}`,
        },
      ]);

      await fetchUserVerification();
      return { success: true, data };
    } catch (err) {
      console.error('Error submitting verification:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancel pending verification request
  const cancelVerification = async (verificationId) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('official_verifications')
        .delete()
        .eq('verification_id', verificationId)
        .eq('user_id', user.id)
        .eq('verification_status', 'Pending');

      if (deleteError) throw deleteError;

      // Log activity
      await supabase.from('activity_logs').insert([
        {
          user_id: user.id,
          action: 'official_verification_cancelled',
          details: `Cancelled verification request ${verificationId}`,
        },
      ]);

      await fetchUserVerification();
      return { success: true };
    } catch (err) {
      console.error('Error cancelling verification:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch all verification requests (for officials/admins)
  const fetchAllVerifications = async (filters = {}) => {
    if (!user?.barangayId) {
      setError('You must be assigned to a barangay to view verifications');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('official_verifications')
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

      // Apply status filter
      if (filters.status && filters.status !== 'all') {
        query = query.eq('verification_status', filters.status);
      }

      // Apply date range filter
      if (filters.startDate) {
        query = query.gte('requested_at', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('requested_at', filters.endDate);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setVerifications(data || []);
    } catch (err) {
      console.error('Error fetching verifications:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch verification statistics
  const fetchVerificationStats = async () => {
    if (!user?.barangayId) return;

    try {
      const { data, error: statsError } = await supabase
        .from('official_verifications')
        .select('verification_status')
        .eq('barangay_id', user.barangayId);

      if (statsError) throw statsError;

      const stats = {
        pending: data.filter((v) => v.verification_status === 'Pending').length,
        approved: data.filter((v) => v.verification_status === 'Approved').length,
        rejected: data.filter((v) => v.verification_status === 'Rejected').length,
        total: data.length,
      };

      setStats(stats);
      return stats;
    } catch (err) {
      console.error('Error fetching verification stats:', err);
      return null;
    }
  };

  // Approve verification request
  const approveVerification = async (verificationId) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      setLoading(true);
      setError(null);

      // Get verification details
      const { data: verification, error: fetchError } = await supabase
        .from('official_verifications')
        .select('*, users(user_id, email, full_name)')
        .eq('verification_id', verificationId)
        .eq('verification_status', 'Pending')
        .single();

      if (fetchError) throw fetchError;
      if (!verification) throw new Error('Verification not found or already processed');

      // Update verification status
      const { error: updateError } = await supabase
        .from('official_verifications')
        .update({
          verification_status: 'Approved',
          reviewed_at: new Date().toISOString(),
        })
        .eq('verification_id', verificationId);

      if (updateError) throw updateError;

      // Update user role to official
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({
          role: 'official',
          is_verified: true,
        })
        .eq('user_id', verification.user_id);

      if (userUpdateError) throw userUpdateError;

      // Log activity
      await supabase.from('activity_logs').insert([
        {
          user_id: user.id,
          action: 'official_verification_approved',
          details: `Approved official verification ${verificationId} for user ${verification.users?.full_name || verification.user_id}`,
        },
      ]);

      await fetchAllVerifications();
      await fetchVerificationStats();

      return { success: true };
    } catch (err) {
      console.error('Error approving verification:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reject verification request
  const rejectVerification = async (verificationId, reason) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    if (!reason || reason.trim() === '') {
      throw new Error('Rejection reason is required');
    }

    try {
      setLoading(true);
      setError(null);

      // Get verification details
      const { data: verification, error: fetchError } = await supabase
        .from('official_verifications')
        .select('*, users(user_id, email, full_name)')
        .eq('verification_id', verificationId)
        .eq('verification_status', 'Pending')
        .single();

      if (fetchError) throw fetchError;
      if (!verification) throw new Error('Verification not found or already processed');

      // Update verification status
      const { error: updateError } = await supabase
        .from('official_verifications')
        .update({
          verification_status: 'Rejected',
          reviewed_at: new Date().toISOString(),
          rejection_reason: reason,
        })
        .eq('verification_id', verificationId);

      if (updateError) throw updateError;

      // Log activity
      await supabase.from('activity_logs').insert([
        {
          user_id: user.id,
          action: 'official_verification_rejected',
          details: `Rejected official verification ${verificationId} for user ${verification.users?.full_name || verification.user_id}. Reason: ${reason}`,
        },
      ]);

      await fetchAllVerifications();
      await fetchVerificationStats();

      return { success: true };
    } catch (err) {
      console.error('Error rejecting verification:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    verifications,
    userVerification,
    stats,
    loading,
    error,
    fetchUserVerification,
    submitVerification,
    cancelVerification,
    fetchAllVerifications,
    fetchVerificationStats,
    approveVerification,
    rejectVerification,
  };
};
