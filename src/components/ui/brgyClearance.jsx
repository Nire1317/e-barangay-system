import { useState } from "react";

export default function BarangayClearance() {
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    purpose: "",
    dateIssued: "",
    validUntil: "",
    receiptNo: "",
  });

  const [showCertificate, setShowCertificate] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const generateCertificate = () => {
    setShowCertificate(true);
  };

  const goBack = () => {
    setShowCertificate(false);
  };

  return (
    <div className="bg-gray-200 min-h-screen p-10">
      {/* FORM PAGE */}
      {!showCertificate && (
        <div className="max-w-2xl mx-auto bg-white p-8 shadow-xl rounded-lg border">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Barangay Clearance Form
          </h1>

          <div className="grid gap-4">
            {[
              { id: "fullName", label: "Full Name" },
              { id: "address", label: "Address / Purok" },
              { id: "purpose", label: "Purpose" },
              { id: "dateIssued", label: "Date Issued", type: "date" },
              { id: "validUntil", label: "Valid Until", type: "date" },
              { id: "receiptNo", label: "Official Receipt No." },
            ].map((input) => (
              <div key={input.id}>
                <label className="font-medium">{input.label}</label>
                <input
                  id={input.id}
                  type={input.type || "text"}
                  value={formData[input.id]}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            ))}
          </div>

          <button
            onClick={generateCertificate}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Generate Certificate
          </button>
        </div>
      )}

      {/* CERTIFICATE PAGE */}
      {showCertificate && (
        <div
          id="certificate"
          className="bg-white w-[800px] mx-auto mt-10 p-10 border shadow-xl"
        >
          <div className="text-center mb-6">
            <p className="font-semibold">Republic of the Philippines</p>
            <p className="font-semibold">Province of Isabela</p>
            <p className="font-semibold">Municipality of Roxas</p>
            <p className="font-semibold">BARANGAY LUNA</p>
            <p className="font-semibold">OFFICE OF THE PUNONG BARANGAY</p>
          </div>

          <h1 className="text-center text-2xl font-bold underline mb-6">
            CLEARANCE
          </h1>
          <p className="text-center font-medium mb-10">(For Individual)</p>

          <div className="grid grid-cols-2 text-sm mb-6">
            <p>ALL OFFICERS OF THE LAW</p>
            <p className="text-right">Date: {formData.dateIssued}</p>
            <p>And to Whom It May Concern:</p>
            <p className="text-right">Clearance No.: 1</p>
          </div>

          <p className="mb-4 text-sm">This is to certify that</p>

          <p className="text-center text-xl font-bold mb-6">
            {formData.fullName}
          </p>

          <p className="text-sm mb-1">Of</p>
          <p className="text-center text-lg font-semibold mb-6">
            {formData.address}
          </p>

          <p className="text-sm mb-6">
            Whose Community Tax Certificate number appears below is a bonafide
            resident of this Barangay. This further certifies that upon
            verification of the records filed in this office, the subject
            individual was found to have:
          </p>

          <div className="text-center mb-6">
            <p className="font-bold text-lg underline">NO DEROGATORY RECORD</p>
            <p className="text-sm mt-2 text-gray-600">(Records)</p>
          </div>

          <div className="text-center mb-6">
            <p className="font-bold text-lg">{formData.purpose}</p>
            <p className="text-sm mt-2 text-gray-600">(Purpose)</p>
          </div>

          <div className="mt-10 mb-20">
            <p className="text-sm mb-4">SPECIMEN SIGNATURE</p>
            <div className="flex gap-10 justify-center mt-6">
              <div className="border-b border-gray-500 w-64"></div>
              <div className="border-b border-gray-500 w-64"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 text-sm mb-12">
            <p>
              Issued on: <b>{formData.dateIssued}</b>
            </p>
            <p className="text-right">
              Valid until: <b>{formData.validUntil}</b>
            </p>
            <p>Issued at: Luna, Roxas, Isabela</p>
            <p className="text-right">
              Official Receipt No.: <b>{formData.receiptNo}</b>
            </p>
          </div>

          <div className="grid grid-cols-2 mt-16">
            <div className="text-center">
              <p className="font-bold uppercase">HON. ROMAR V. CALAMASA</p>
              <p className="text-sm">
                Sangguniang Barangay / Officer of the Day
              </p>
            </div>

            <div className="text-center">
              <p className="font-bold uppercase">HON. JUANITO V. RAMOS</p>
              <p className="text-sm">Punong Barangay</p>
            </div>
          </div>

          <p className="text-center text-sm mt-14 font-semibold">
            Not valid without Dry Seal
          </p>

          {/* Buttons */}
          <div className="flex gap-4 justify-center mt-10 no-print">
            <button
              onClick={() => window.print()}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
            >
              Print Certificate
            </button>

            <button
              onClick={goBack}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded"
            >
              Back to Form
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
