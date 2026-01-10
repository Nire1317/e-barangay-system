import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from './useAuth';

export const useBarangayRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all available barangays
  const fetchBarangays = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('barangays')
        .select('*')
        .order('barangay_name', { ascending: true });

      if (fetchError) throw fetchError;

      setBarangays(data || []);
    } catch (err) {
      console.error('Error fetching barangays:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's barangay requests
  const fetchUserRequests = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('barangay_requests')
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
        .order('requested_at', { ascending: false });

      if (fetchError) throw fetchError;

      setRequests(data || []);
    } catch (err) {
      console.error('Error fetching user requests:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Check if user already has a pending or approved request for a barangay
  const checkExistingRequest = async (barangayId) => {
    if (!user?.id) return null;

    try {
      const { data, error: checkError } = await supabase
        .from('barangay_requests')
        .select('*')
        .eq('user_id', user.id)
        .eq('barangay_id', barangayId)
        .in('status', ['Pending', 'Approved'])
        .maybeSingle();

      if (checkError) throw checkError;

      return data;
    } catch (err) {
      console.error('Error checking existing request:', err);
      return null;
    }
  };

  // Submit a new barangay request
  const submitRequest = async (barangayId) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      setLoading(true);
      setError(null);

      // Check for existing request
      const existingRequest = await checkExistingRequest(barangayId);
      if (existingRequest) {
        throw new Error(
          `You already have a ${existingRequest.status.toLowerCase()} request for this barangay`
        );
      }

      const { data, error: insertError } = await supabase
        .from('barangay_requests')
        .insert([
          {
            user_id: user.id,
            barangay_id: barangayId,
            status: 'Pending',
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // Log activity
      await supabase.from('activity_logs').insert([
        {
          user_id: user.id,
          action: 'barangay_request_submitted',
          details: `Submitted request to join barangay ${barangayId}`,
        },
      ]);

      // Refresh requests list
      await fetchUserRequests();

      return data;
    } catch (err) {
      console.error('Error submitting request:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancel a pending request
  const cancelRequest = async (requestId) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      setLoading(true);
      setError(null);

      // Verify the request belongs to the user and is pending
      const { data: request, error: fetchError } = await supabase
        .from('barangay_requests')
        .select('*')
        .eq('request_id', requestId)
        .eq('user_id', user.id)
        .eq('status', 'Pending')
        .single();

      if (fetchError) throw fetchError;
      if (!request) throw new Error('Request not found or cannot be cancelled');

      // Delete the request
      const { error: deleteError } = await supabase
        .from('barangay_requests')
        .delete()
        .eq('request_id', requestId);

      if (deleteError) throw deleteError;

      // Log activity
      await supabase.from('activity_logs').insert([
        {
          user_id: user.id,
          action: 'barangay_request_cancelled',
          details: `Cancelled request ${requestId}`,
        },
      ]);

      // Refresh requests list
      await fetchUserRequests();
    } catch (err) {
      console.error('Error cancelling request:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Search barangays by name, municipality, province, or region
  const searchBarangays = async (searchTerm) => {
    try {
      setLoading(true);
      setError(null);

      if (!searchTerm || searchTerm.trim() === '') {
        await fetchBarangays();
        return;
      }

      const searchLower = searchTerm.toLowerCase();

      const { data, error: searchError } = await supabase
        .from('barangays')
        .select('*')
        .or(
          `barangay_name.ilike.%${searchLower}%,municipality.ilike.%${searchLower}%,province.ilike.%${searchLower}%,region.ilike.%${searchLower}%`
        )
        .order('barangay_name', { ascending: true });

      if (searchError) throw searchError;

      setBarangays(data || []);
    } catch (err) {
      console.error('Error searching barangays:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter barangays by region or province
  const filterBarangays = async (filters) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from('barangays').select('*');

      if (filters.region) {
        query = query.eq('region', filters.region);
      }

      if (filters.province) {
        query = query.eq('province', filters.province);
      }

      if (filters.municipality) {
        query = query.eq('municipality', filters.municipality);
      }

      query = query.order('barangay_name', { ascending: true });

      const { data, error: filterError } = await query;

      if (filterError) throw filterError;

      setBarangays(data || []);
    } catch (err) {
      console.error('Error filtering barangays:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get unique regions, provinces, and municipalities for filters
  const getFilterOptions = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('barangays')
        .select('region, province, municipality');

      if (fetchError) throw fetchError;

      const regions = [...new Set(data.map((b) => b.region))].sort();
      const provinces = [...new Set(data.map((b) => b.province))].sort();
      const municipalities = [...new Set(data.map((b) => b.municipality))].sort();

      return { regions, provinces, municipalities };
    } catch (err) {
      console.error('Error fetching filter options:', err);
      return { regions: [], provinces: [], municipalities: [] };
    }
  };

  return {
    requests,
    barangays,
    loading,
    error,
    fetchBarangays,
    fetchUserRequests,
    submitRequest,
    cancelRequest,
    searchBarangays,
    filterBarangays,
    getFilterOptions,
    checkExistingRequest,
  };
};
