import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [type, setType] = useState("Certificate of Indigency");
  const [purpose, setPurpose] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from("requests").insert([
      {
        resident_id: user.id,
        purpose,
        status: "Pending",
        type_id:
          type === "Certificate of Indigency" ? 1 : type === "Cedula" ? 2 : 3,
      },
    ]);

    if (error) setMessage(error.message);
    else setMessage("Request submitted successfully!");
  };

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Loading user...</p>
      </div>
    );

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Request a Certificate</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow-md w-96"
      >
        <label className="block mb-2">Select Document Type:</label>
        <select
          className="w-full mb-3 p-2 border rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option>Certificate of Indigency</option>
          <option>Cedula</option>
          <option>Barangay Clearance</option>
        </select>

        <label className="block mb-2">Purpose:</label>
        <textarea
          className="w-full mb-3 p-2 border rounded"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Submit Request
        </button>

        {message && (
          <p className="mt-3 text-center text-sm text-gray-600">{message}</p>
        )}
      </form>
    </div>
  );
}
