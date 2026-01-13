import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Calendar, Loader, AlertCircle, CheckCircle } from "lucide-react";

//Note: This is just a experimental thats why the supabase init is here.
// i dont know how to do it properly with the current project structure.
// Please refactor this part later.
const SUPABASE_URL = 'https://ubektynslrflctveqiut.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViZWt0eW5zbHJmbGN0dmVxaXV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MzIyNDEsImV4cCI6MjA3NzEwODI0MX0.VMPxOfxSICFJLqcxBbTHFhCr4TyxIbDrBih6GuvdRrM';

let supabase = null;

// Initialize Supabase client
const initSupabase = async () => {
  if (!supabase) {
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabase;
};

const UsersPage = () => {
  const [myAccount, setMyAccount] = useState({
    id: null,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    status: "",
    dateRegistered: "",
    lastActive: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [userId, setUserId] = useState(null);

  // --- Fetch Auth User & Table Data ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const client = await initSupabase();

        // Get the authenticated user
        const { data: { user }, error: authError } = await client.auth.getUser();
        if (authError) throw authError;
        if (!user) {
          setError("You are not logged in.");
          setLoading(false);
          return;
        }

        setUserId(user.id);

        // Fetch user data from "users" table
        const { data, error: fetchError } = await client
          .from('users')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (fetchError && fetchError.code === 'PGRST116') {
          await createDefaultUser(user.id);
          return;
        } else if (fetchError) {
          throw fetchError;
        }

        setMyAccount({
          id: data.id,
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          role: data.role || 'resident',
          status: data.status || 'active',
          dateRegistered: data.date_registered || new Date().toISOString().split('T')[0],
          lastActive: data.last_active || new Date().toISOString().split('T')[0],
        });

      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err.message || 'Failed to fetch user.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // --- Create Default User ---
  const createDefaultUser = async (uid) => {
    try {
      const client = await initSupabase();

      const defaultUser = {
        user_id: uid,
        first_name: 'Juan',
        last_name: 'Dela Cruz',
        email: 'juan.delacruz@email.com',
        phone: '0917-123-4567',
        address: 'Blk 5 Lot 3, Maharlika St., Kurong Kurong',
        role: 'resident',
        status: 'active',
        date_registered: new Date().toISOString().split('T')[0],
        last_active: new Date().toISOString().split('T')[0]
      };

      const { data, error: insertError } = await client
        .from('users')
        .insert([defaultUser])
        .select()
        .single();

      if (insertError) throw insertError;

      setMyAccount({
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        role: data.role,
        status: data.status,
        dateRegistered: data.date_registered,
        lastActive: data.last_active,
      });

    } catch (err) {
      console.error('Error creating default user:', err);
      setError(err.message || 'Failed to create default user.');
    }
  };

  // --- Handle Input Change ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMyAccount(prev => ({ ...prev, [name]: value }));
    setError(null);
    setSuccessMessage(null);
  };

  // --- Save Changes ---
  const handleSave = async () => {
    try {
      setSaving(true);
      const client = await initSupabase();

      const { error: updateError } = await client
        .from('users')
        .update({
          first_name: myAccount.firstName,
          last_name: myAccount.lastName,
          email: myAccount.email,
          phone: myAccount.phone,
          address: myAccount.address,
          last_active: new Date().toISOString().split('T')[0]
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (updateError) throw updateError;

      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(null), 3000);

    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  // const getRoleBadge = (role) => {
  //   const styles = {
  //     admin: "bg-purple-100 text-purple-800 border-purple-300",
  //     staff: "bg-blue-100 text-blue-800 border-blue-300",
  //     resident: "bg-green-100 text-green-800 border-green-300",
  //   };
  //   return styles[role] || "bg-gray-100 text-gray-800 border-gray-300";
  // };

  // const getStatusBadge = (status) => {
  //   return status === "active"
  //     ? "bg-green-100 text-green-800 border-green-300"
  //     : "bg-gray-100 text-gray-500 border-gray-300";
  // };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading account information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Success */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-sm text-green-800">{successMessage}</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Account</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          {/* <div>
            <p className="text-gray-600 text-sm font-semibold">First Name</p>
            {isEditing ? (
              <input
                name="firstName"
                value={myAccount.firstName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            ) : (
              <p className="text-gray-800">{myAccount.firstName}</p>
            )}
          </div> */}

          {/* Last Name */}
          {/* <div>
            <p className="text-gray-600 text-sm font-semibold">Last Name</p>
            {isEditing ? (
              <input
                name="lastName"
                value={myAccount.lastName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            ) : (
              <p className="text-gray-800">{myAccount.lastName}</p>
            )}
          </div> */}

          {/* Email */}
          <div>
            <p className="text-gray-600 text-sm font-semibold">Email</p>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={myAccount.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            ) : (
              <p className="text-gray-800 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" /> {myAccount.email}
              </p>
            )}
          </div>

          {/* Phone */}
          {/* <div>
            <p className="text-gray-600 text-sm font-semibold">Phone</p>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={myAccount.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            ) : (
              <p className="text-gray-800 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" /> {myAccount.phone}
              </p>
            )}
          </div> */}

          {/* Address */}
          {/* <div className="md:col-span-2">
            <p className="text-gray-600 text-sm font-semibold">Address</p>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={myAccount.address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            ) : (
              <p className="text-gray-800 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" /> {myAccount.address}
              </p>
            )}
          </div> */}

          {/* Date Registered */}
          <div>
            <p className="text-gray-600 text-sm font-semibold">Date Registered</p>
            <p className="text-gray-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" /> {myAccount.dateRegistered}
            </p>
          </div>

          {/* Last Active */}
          <div>
            <p className="text-gray-600 text-sm font-semibold">Last Active</p>
            <p className="text-gray-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" /> {myAccount.lastActive}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                disabled={saving}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
              >
                {saving ? <Loader className="w-4 h-4 animate-spin" /> : 'Save Changes'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
