import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from './useAuth';

export const useReports = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalReports: 0,
    generatedToday: 0,
    scheduled: 0,
    downloads: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch report statistics
  const fetchReportStats = async () => {
    if (!user?.barangayId) {
      setError('You must be assigned to a barangay to view reports');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get residents count
      const { count: residentsCount } = await supabase
        .from('residents')
        .select('*', { count: 'exact', head: true })
        .eq('barangay_id', user.barangayId);

      // Get requests count
      const { count: requestsCount } = await supabase
        .from('requests')
        .select('*', { count: 'exact', head: true })
        .eq('resident_id', user.barangayId);

      // Get today's activity logs count
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { count: todayLogsCount } = await supabase
        .from('activity_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString());

      setStats({
        totalReports: 6, // Fixed number of available report types
        generatedToday: todayLogsCount || 0,
        scheduled: 2, // This could be a separate table in the future
        downloads: (residentsCount || 0) + (requestsCount || 0),
      });
    } catch (err) {
      console.error('Error fetching report stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Generate Residents Report
  const generateResidentsReport = async (dateRange = 'all', format = 'pdf') => {
    if (!user?.barangayId) {
      throw new Error('You must be assigned to a barangay');
    }

    try {
      setLoading(true);

      // Build date filter
      let dateFilter = {};
      const now = new Date();

      switch (dateRange) {
        case 'today':
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          dateFilter = { gte: today.toISOString() };
          break;
        case 'last-7-days':
          const last7Days = new Date(now.setDate(now.getDate() - 7));
          dateFilter = { gte: last7Days.toISOString() };
          break;
        case 'last-30-days':
          const last30Days = new Date(now.setDate(now.getDate() - 30));
          dateFilter = { gte: last30Days.toISOString() };
          break;
        case 'this-month':
          const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          dateFilter = { gte: thisMonth.toISOString() };
          break;
        case 'last-month':
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
          dateFilter = { gte: lastMonth.toISOString(), lte: lastMonthEnd.toISOString() };
          break;
        default:
          dateFilter = {};
      }

      // Fetch residents data
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
            province,
            region
          )
        `)
        .eq('barangay_id', user.barangayId)
        .order('created_at', { ascending: false });

      if (dateFilter.gte) {
        query = query.gte('created_at', dateFilter.gte);
      }
      if (dateFilter.lte) {
        query = query.lte('created_at', dateFilter.lte);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Log activity
      await supabase.from('activity_logs').insert([
        {
          user_id: user.id,
          action: 'report_generated',
          details: `Generated Residents Summary Report (${format.toUpperCase()}) - ${dateRange}`,
        },
      ]);

      return {
        data,
        format,
        reportType: 'residents',
        dateRange,
        generatedAt: new Date().toISOString(),
      };
    } catch (err) {
      console.error('Error generating residents report:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Generate Document Requests Report
  const generateRequestsReport = async (dateRange = 'all', format = 'pdf') => {
    if (!user?.barangayId) {
      throw new Error('You must be assigned to a barangay');
    }

    try {
      setLoading(true);

      // Build date filter
      let dateFilter = {};
      const now = new Date();

      switch (dateRange) {
        case 'today':
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          dateFilter = { gte: today.toISOString() };
          break;
        case 'last-7-days':
          const last7Days = new Date(now.setDate(now.getDate() - 7));
          dateFilter = { gte: last7Days.toISOString() };
          break;
        case 'last-30-days':
          const last30Days = new Date(now.setDate(now.getDate() - 30));
          dateFilter = { gte: last30Days.toISOString() };
          break;
        case 'this-month':
          const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          dateFilter = { gte: thisMonth.toISOString() };
          break;
        case 'last-month':
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
          dateFilter = { gte: lastMonth.toISOString(), lte: lastMonthEnd.toISOString() };
          break;
        default:
          dateFilter = {};
      }

      // Fetch requests data with residents
      let query = supabase
        .from('requests')
        .select(`
          *,
          residents!inner (
            *,
            users (
              full_name,
              email
            ),
            barangays (
              barangay_id,
              barangay_name
            )
          ),
          request_types (
            type_name,
            description
          )
        `)
        .eq('residents.barangay_id', user.barangayId)
        .order('submitted_at', { ascending: false });

      if (dateFilter.gte) {
        query = query.gte('submitted_at', dateFilter.gte);
      }
      if (dateFilter.lte) {
        query = query.lte('submitted_at', dateFilter.lte);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Log activity
      await supabase.from('activity_logs').insert([
        {
          user_id: user.id,
          action: 'report_generated',
          details: `Generated Document Requests Report (${format.toUpperCase()}) - ${dateRange}`,
        },
      ]);

      return {
        data,
        format,
        reportType: 'requests',
        dateRange,
        generatedAt: new Date().toISOString(),
      };
    } catch (err) {
      console.error('Error generating requests report:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Export data to CSV
  const exportToCSV = (data, reportType) => {
    if (!data || data.length === 0) {
      throw new Error('No data to export');
    }

    let csvContent = '';
    let headers = [];
    let rows = [];

    if (reportType === 'residents') {
      headers = ['Name', 'Email', 'Contact', 'Address', 'Gender', 'Civil Status', 'Occupation', 'Registered Date'];
      rows = data.map(resident => [
        resident.users?.full_name || 'N/A',
        resident.users?.email || 'N/A',
        resident.contact_number || 'N/A',
        resident.address || 'N/A',
        resident.gender || 'N/A',
        resident.civil_status || 'N/A',
        resident.occupation || 'N/A',
        new Date(resident.created_at).toLocaleDateString(),
      ]);
    } else if (reportType === 'requests') {
      headers = ['Resident Name', 'Request Type', 'Purpose', 'Status', 'Submitted Date', 'Reviewed Date'];
      rows = data.map(request => [
        request.residents?.users?.full_name || 'N/A',
        request.request_types?.type_name || 'N/A',
        request.purpose || 'N/A',
        request.status || 'N/A',
        new Date(request.submitted_at).toLocaleDateString(),
        request.reviewed_at ? new Date(request.reviewed_at).toLocaleDateString() : 'N/A',
      ]);
    }

    csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    return csvContent;
  };

  // Download report
  const downloadReport = (reportData) => {
    const { data, format, reportType, dateRange } = reportData;

    if (format === 'csv') {
      const csvContent = exportToCSV(data, reportType);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      const fileName = `${reportType}_report_${dateRange}_${new Date().getTime()}.csv`;

      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'pdf') {
      // For PDF, you would typically use a library like jsPDF or pdfmake
      // For now, we'll show an alert
      alert(`PDF export for ${reportType} report will be implemented with a PDF library (jsPDF/pdfmake)`);
    } else if (format === 'excel') {
      // For Excel, you would use a library like xlsx
      alert(`Excel export for ${reportType} report will be implemented with xlsx library`);
    }
  };

  return {
    stats,
    loading,
    error,
    fetchReportStats,
    generateResidentsReport,
    generateRequestsReport,
    downloadReport,
  };
};
