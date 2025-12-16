import React, { useState } from "react";
import { Mail, Phone, MapPin, Calendar, User } from "lucide-react";

const UsersPage = () => {
  // Your account data
  const [myAccount, setMyAccount] = useState({
    firstName: "Juan",
    lastName: "Dela Cruz",
    email: "[juan.delacruz@email.com](mailto:juan.delacruz@email.com)",
    phone: "0917-123-4567",
    address: "Blk 5 Lot 3, Maharlika St., Kurong Kurong",
    role: "admin",
    status: "active",
    dateRegistered: "2024-01-15",
    lastActive: "2024-11-07",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMyAccount((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    alert("Profile updated successfully!");
    setIsEditing(false);
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: "bg-purple-100 text-purple-800 border-purple-300",
      staff: "bg-blue-100 text-blue-800 border-blue-300",
      resident: "bg-green-100 text-green-800 border-green-300",
    };
    return styles[role] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getStatusBadge = (status) => {
    return status === "active"
      ? "bg-green-100 text-green-800 border-green-300"
      : "bg-gray-100 text-gray-500 border-gray-300";
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Page Header */}{" "}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        {" "}
        <h2 className="text-2xl font-bold text-gray-800">My Account</h2>{" "}
        <p className="text-gray-600 mt-1">Manage your account information</p>{" "}
      </div>
      {/* Account Details Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {myAccount.firstName[0]}
            {myAccount.lastName[0]}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {myAccount.firstName} {myAccount.lastName}
            </h3>
            <p className="text-gray-600">{myAccount.role.toUpperCase()}</p>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border mt-2 ${getStatusBadge(
                myAccount.status
              )}`}
            >
              {myAccount.status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-gray-600 text-sm">Email</p>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={myAccount.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            ) : (
              <p className="flex items-center gap-2 text-gray-800">
                <Mail className="w-4 h-4 text-gray-400" /> {myAccount.email}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-gray-600 text-sm">Phone</p>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={myAccount.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            ) : (
              <p className="flex items-center gap-2 text-gray-800">
                <Phone className="w-4 h-4 text-gray-400" /> {myAccount.phone}
              </p>
            )}
          </div>
          <div className="space-y-2 md:col-span-2">
            <p className="text-gray-600 text-sm">Address</p>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={myAccount.address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            ) : (
              <p className="flex items-center gap-2 text-gray-800">
                <MapPin className="w-4 h-4 text-gray-400" /> {myAccount.address}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-gray-600 text-sm">Date Registered</p>
            <p className="flex items-center gap-2 text-gray-800">
              <Calendar className="w-4 h-4 text-gray-400" />{" "}
              {myAccount.dateRegistered}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-gray-600 text-sm">Last Active</p>
            <p className="flex items-center gap-2 text-gray-800">
              <Calendar className="w-4 h-4 text-gray-400" />{" "}
              {myAccount.lastActive}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Save
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
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
