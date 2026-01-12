import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from './useAuth';

export const useResidents = () => {
  const { user } = useAuth();
  const [residents, setResidents] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    inactive: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate age from birthdate
  const calculateAge = (birthdate) => {
    if (!birthdate) return null;
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Fetch all residents for the official's barangay
  const fetchResidents = async (filters = {}) => {
    if (!user?.barangayId) {
      setError('You must be assigned to a barangay to view residents');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('residents')
        .select(`
          *,
          users (
            user_id,
            full_name,
            email,
            is_verified,
            created_at
          ),
          barangays (
            barangay_id,
            barangay_name,
            municipality,
            province
          )
        `)
        .eq('barangay_id', user.barangayId)
        .order('created_at', { ascending: false });

      // Apply search filter if provided
      if (filters.search) {
        query = query.or(`users.full_name.ilike.%${filters.search}%,users.email.ilike.%${filters.search}%`);
      }

      // Apply verification status filter if provided
      if (filters.status && filters.status !== 'all') {
        if (filters.status === 'verified') {
          query = query.eq('users.is_verified', true);
        } else if (filters.status === 'pending') {
          query = query.eq('users.is_verified', false);
        }
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Transform data to match UI expectations
      const transformedData = (data || []).map((resident) => ({
        resident_id: resident.resident_id,
        user_id: resident.user_id,
        name: resident.users?.full_name || 'N/A',
        email: resident.users?.email || 'N/A',
        phone: resident.contact_number || 'N/A',
        address: resident.address || 'N/A',
        age: calculateAge(resident.birthdate),
        birthdate: resident.birthdate,
        gender: resident.gender || 'N/A',
        civil_status: resident.civil_status,
        occupation: resident.occupation,
        household_no: resident.household_no,
        status: resident.users?.is_verified ? 'verified' : 'pending',
        registeredDate: resident.created_at,
        barangay: resident.barangays,
      }));

      setResidents(transformedData);
    } catch (err) {
      console.error('Error fetching residents:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics for dashboard
  const fetchResidentStats = async () => {
    if (!user?.barangayId) return;

    try {
      // Get all residents with their user verification status
      const { data, error: statsError } = await supabase
        .from('residents')
        .select(`
          resident_id,
          users!inner (
            is_verified
          )
        `)
        .eq('barangay_id', user.barangayId);

      if (statsError) throw statsError;

      const total = data?.length || 0;
      const verified = data?.filter((r) => r.users?.is_verified === true).length || 0;
      const pending = data?.filter((r) => r.users?.is_verified === false).length || 0;

      const stats = {
        total,
        verified,
        pending,
        inactive: 0, // Can be implemented based on business logic (e.g., users who haven't logged in for X days)
      };

      setStats(stats);
      return stats;
    } catch (err) {
      console.error('Error fetching resident stats:', err);
      return null;
    }
  };

  // Get resident details by ID
  const getResidentById = async (residentId) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('residents')
        .select(`
          *,
          users (
            user_id,
            full_name,
            email,
            is_verified,
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
        .eq('resident_id', residentId)
        .single();

      if (fetchError) throw fetchError;

      return {
        ...data,
        age: calculateAge(data.birthdate),
      };
    } catch (err) {
      console.error('Error fetching resident details:', err);
      throw err;
    }
  };

  // Update resident information
  const updateResident = async (residentId, updates) => {
    try {
      setLoading(true);
      setError(null);

      const { error: updateError } = await supabase
        .from('residents')
        .update(updates)
        .eq('resident_id', residentId);

      if (updateError) throw updateError;

      // Log activity
      if (user?.id) {
        await supabase.from('activity_logs').insert([
          {
            user_id: user.id,
            action: 'resident_updated',
            details: `Updated resident information for ${residentId}`,
          },
        ]);
      }

      // Refresh residents list
      await fetchResidents();
      await fetchResidentStats();

      return { success: true };
    } catch (err) {
      console.error('Error updating resident:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete resident (soft delete by setting inactive)
  const deleteResident = async (residentId) => {
    try {
      setLoading(true);
      setError(null);

      // Note: Consider implementing soft delete based on business requirements
      const { error: deleteError } = await supabase
        .from('residents')
        .delete()
        .eq('resident_id', residentId);

      if (deleteError) throw deleteError;

      // Log activity
      if (user?.id) {
        await supabase.from('activity_logs').insert([
          {
            user_id: user.id,
            action: 'resident_deleted',
            details: `Deleted resident ${residentId}`,
          },
        ]);
      }

      // Refresh residents list
      await fetchResidents();
      await fetchResidentStats();

      return { success: true };
    } catch (err) {
      console.error('Error deleting resident:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    residents,
    stats,
    loading,
    error,
    fetchResidents,
    fetchResidentStats,
    getResidentById,
    updateResident,
    deleteResident,
  };
};
