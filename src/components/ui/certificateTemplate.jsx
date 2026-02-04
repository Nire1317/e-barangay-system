// CertificateTemplates.jsx - Complete certificate system for all request types

export const CertificateTemplates = {
  // 1. BARANGAY CLEARANCE
  "Barangay Clearance": ({ data, user }) => (
    <div className="relative w-[8.5in] min-h-[11in] mx-auto p-12 bg-white">
      {/* Watermark */}
      <img
        src="/watermark.png"
        alt="watermark"
        className="absolute opacity-10 w-[60%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <img
          src="/BagongPilipinasLogo.png"
          alt="logo"
          className="w-28 h-28 object-contain"
        />
        <div className="text-center flex-1 mx-4">
          <p className="font-semibold text-sm">Republic of the Philippines</p>
          <p className="font-semibold text-sm">Province of Isabela</p>
          <p className="font-semibold text-sm">Municipality of Roxas</p>
          <p className="font-semibold uppercase text-base">
            BARANGAY {data.barangayName || "LUNA"}
          </p>
          <p className="font-semibold text-xs mt-1">
            OFFICE OF THE PUNONG BARANGAY
          </p>
        </div>
        <img
          src="/LogoOfRoxas.png"
          alt="logo"
          className="w-64  h-64 object-contain scale-110"
        />
      </div>

      <h1 className="text-center text-3xl font-bold underline mb-8 mt-8">
        BARANGAY CLEARANCE
      </h1>

      <p className="text-sm mb-6 italic text-center">(For Individual)</p>

      {/* Addressee */}
      <div className="mb-8">
        <p className="text-sm font-semibold">TO WHOM IT MAY CONCERN:</p>
        <p className="text-sm mt-2">Greetings,</p>
      </div>

      {/* Main Content */}
      <div className="space-y-6 text-justify">
        <p className="text-base leading-relaxed indent-12">
          This is to certify that{" "}
          <span className="font-bold text-lg underline">{data.fullName}</span>,
          of legal age, Filipino citizen, and a bona fide resident of{" "}
          <span className="font-bold">{data.address}</span>, Barangay{" "}
          {data.barangayName || "Luna"}, Roxas, Isabela, is personally known to
          me to be of good moral character and law-abiding citizen.
        </p>

        <p className="text-base leading-relaxed indent-12">
          This further certifies that upon verification of records filed in this
          office, the above-named individual has{" "}
          <span className="font-bold uppercase text-lg">
            NO DEROGATORY RECORD
          </span>{" "}
          on file and has not been involved in any unlawful activities within
          the jurisdiction of this barangay.
        </p>

        <p className="text-base leading-relaxed indent-12">
          This certification is being issued upon the request of the above-named
          person for{" "}
          <span className="font-bold uppercase text-lg">
            {data.purpose || "WHATEVER LEGAL PURPOSE IT MAY SERVE"}
          </span>
          .
        </p>

        <p className="text-base leading-relaxed indent-12">
          Issued this <span className="font-bold">{new Date().getDate()}</span>
          <sup>{getOrdinalSuffix(new Date().getDate())}</sup> day of{" "}
          <span className="font-bold">
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>{" "}
          at Barangay {data.barangayName || "Luna"}, Roxas, Isabela,
          Philippines.
        </p>
      </div>

      {/* Photo and Signature */}
      <div className="grid grid-cols-2 gap-8 mt-12 mb-12">
        {data.photoUrl && (
          <div>
            <p className="text-sm font-semibold mb-2">PHOTO OF APPLICANT:</p>
            <div className="border-4 border-gray-800 w-40 h-40 overflow-hidden">
              <img
                src={data.photoUrl}
                alt="Applicant"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
        <div>
          <p className="text-sm font-semibold mb-2">SPECIMEN SIGNATURE:</p>
          <div className="border-b-2 border-gray-800 w-full h-20"></div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-12 space-y-2">
        <p className="text-sm">
          <span className="font-semibold">CTC Number:</span>{" "}
          {data.ctcNumber || "_______________"}
        </p>
        <p className="text-sm">
          <span className="font-semibold">Valid ID Type:</span>{" "}
          {data.validIdType || "_______________"}
        </p>
        <p className="text-sm">
          <span className="font-semibold">OR Number:</span> _______________
        </p>
        <p className="text-sm">
          <span className="font-semibold">Amount Paid:</span> ₱_______________
        </p>
      </div>
    </div>
  ),

  // 2. CERTIFICATE OF INDIGENCY
  "Certificate of Indigency": ({ data, user }) => (
    <div className="relative w-[8.5in] min-h-[11in] mx-auto p-12 bg-white">
      <img
        src="/watermark.png"
        alt="watermark"
        className="absolute opacity-10 w-[60%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      />

      <div className="flex justify-between items-center mb-8">
        <img
          src="/BagongPilipinasLogo.png"
          alt="logo"
          className="w-28 h-28 object-contain"
        />
        <div className="text-center flex-1 mx-4">
          <p className="font-semibold text-sm">Republic of the Philippines</p>
          <p className="font-semibold text-sm">Province of Isabela</p>
          <p className="font-semibold text-sm">Municipality of Roxas</p>
          <p className="font-semibold uppercase text-base">
            BARANGAY {data.barangayName || "LUNA"}
          </p>
          <p className="font-semibold text-xs mt-1">
            OFFICE OF THE PUNONG BARANGAY
          </p>
        </div>
        <img
          src="/LogoOfRoxas.png"
          alt="logo"
          className="w-64  h-64object-contain scale-110"
        />
      </div>

      <h1 className="text-center text-3xl font-bold underline mb-8 mt-8">
        CERTIFICATE OF INDIGENCY
      </h1>

      <div className="mb-8">
        <p className="text-sm font-semibold">TO WHOM IT MAY CONCERN:</p>
      </div>

      <div className="space-y-6 text-justify">
        <p className="text-base leading-relaxed indent-12">
          This is to certify that{" "}
          <span className="font-bold text-lg underline">{data.fullName}</span>,
          of legal age, Filipino citizen, and a permanent resident of{" "}
          <span className="font-bold">{data.address}</span>, Barangay{" "}
          {data.barangayName || "Luna"}, Roxas, Isabela, belongs to an indigent
          family in this barangay.
        </p>

        <p className="text-base leading-relaxed indent-12">
          Based on the records and investigation conducted by this office, the
          above-named individual and his/her family are among those identified
          as economically disadvantaged residents requiring assistance and
          support from government programs and services.
        </p>

        <p className="text-base leading-relaxed indent-12">
          Further, the annual income of the family does not exceed the poverty
          threshold as determined by the National Economic and Development
          Authority (NEDA) and is therefore eligible for government assistance
          programs.
        </p>

        <p className="text-base leading-relaxed indent-12">
          This certification is issued to attest to the indigent status of the
          said person and is being requested for{" "}
          <span className="font-bold uppercase text-lg">
            {data.purpose || "MEDICAL/FINANCIAL ASSISTANCE"}
          </span>
          .
        </p>

        <p className="text-base leading-relaxed indent-12">
          Issued this <span className="font-bold">{new Date().getDate()}</span>
          <sup>{getOrdinalSuffix(new Date().getDate())}</sup> day of{" "}
          <span className="font-bold">
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>{" "}
          at Barangay {data.barangayName || "Luna"}, Roxas, Isabela,
          Philippines.
        </p>
      </div>

      {data.photoUrl && (
        <div className="mt-12 mb-8">
          <p className="text-sm font-semibold mb-2">PHOTO OF BENEFICIARY:</p>
          <div className="border-4 border-gray-800 w-40 h-40 overflow-hidden">
            <img
              src={data.photoUrl}
              alt="Beneficiary"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <div className="mt-12">
        <p className="text-sm font-semibold mb-2">RIGHT THUMB MARK:</p>
        <div className="border-4 border-gray-800 w-32 h-32"></div>
      </div>
    </div>
  ),

  // 3. CERTIFICATE OF RESIDENCY
  "Certificate of Residency": ({ data, user }) => (
    <div className="relative w-[8.5in] min-h-[11in] mx-auto p-12 bg-white">
      <img
        src="/watermark.png"
        alt="watermark"
        className="absolute opacity-10 w-[60%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      />

      <div className="flex justify-between items-center mb-8">
        <img
          src="/BagongPilipinasLogo.png"
          alt="logo"
          className="w-28 h-28 object-contain"
        />
        <div className="text-center flex-1 mx-4">
          <p className="font-semibold text-sm">Republic of the Philippines</p>
          <p className="font-semibold text-sm">Province of Isabela</p>
          <p className="font-semibold text-sm">Municipality of Roxas</p>
          <p className="font-semibold uppercase text-base">
            BARANGAY {data.barangayName || "LUNA"}
          </p>
          <p className="font-semibold text-xs mt-1">
            OFFICE OF THE PUNONG BARANGAY
          </p>
        </div>
        <img
          src="/LogoOfRoxas.png"
          alt="logo"
          className="w-64  h-64 object-contain scale-110"
        />
      </div>

      <h1 className="text-center text-3xl font-bold underline mb-8 mt-8">
        CERTIFICATE OF RESIDENCY
      </h1>

      <div className="mb-8">
        <p className="text-sm font-semibold">TO WHOM IT MAY CONCERN:</p>
      </div>

      <div className="space-y-6 text-justify">
        <p className="text-base leading-relaxed indent-12">
          This is to certify that{" "}
          <span className="font-bold text-lg underline">{data.fullName}</span>,
          of legal age, Filipino citizen, is a bona fide resident of{" "}
          <span className="font-bold">{data.address}</span>, Barangay{" "}
          {data.barangayName || "Luna"}, Roxas, Isabela.
        </p>

        <p className="text-base leading-relaxed indent-12">
          According to the records on file in this office, the above-named
          person has been residing in this barangay for a considerable period of
          time and is duly registered in our barangay census and records system.
        </p>

        <p className="text-base leading-relaxed indent-12">
          Further, this is to certify that said person is known to be of good
          moral character, law-abiding, and a responsible member of this
          community who actively participates in barangay activities and
          programs.
        </p>

        <p className="text-base leading-relaxed indent-12">
          This certification is being issued upon the request of the above-named
          individual for{" "}
          <span className="font-bold uppercase text-lg">
            {data.purpose || "EMPLOYMENT/BUSINESS PURPOSES"}
          </span>
          .
        </p>

        <p className="text-base leading-relaxed indent-12">
          Issued this <span className="font-bold">{new Date().getDate()}</span>
          <sup>{getOrdinalSuffix(new Date().getDate())}</sup> day of{" "}
          <span className="font-bold">
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>{" "}
          at Barangay {data.barangayName || "Luna"}, Roxas, Isabela,
          Philippines.
        </p>
      </div>

      {data.photoUrl && (
        <div className="mt-12 mb-8">
          <p className="text-sm font-semibold mb-2">PHOTO OF RESIDENT:</p>
          <div className="border-4 border-gray-800 w-40 h-40 overflow-hidden">
            <img
              src={data.photoUrl}
              alt="Resident"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <div className="mt-12">
        <p className="text-sm font-semibold mb-2">SPECIMEN SIGNATURE:</p>
        <div className="border-b-2 border-gray-800 w-96 h-20"></div>
      </div>
    </div>
  ),

  // 4. BUSINESS PERMIT / BARANGAY BUSINESS CLEARANCE
  "Business Permit": ({ data, user }) => (
    <div className="relative w-[8.5in] min-h-[11in] mx-auto p-12 bg-white">
      <img
        src="/watermark.png"
        alt="watermark"
        className="absolute opacity-10 w-[60%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      />

      <div className="flex justify-between items-center mb-8">
        <img
          src="/BagongPilipinasLogo.png"
          alt="logo"
          className="w-28 h-28 object-contain"
        />
        <div className="text-center flex-1 mx-4">
          <p className="font-semibold text-sm">Republic of the Philippines</p>
          <p className="font-semibold text-sm">Province of Isabela</p>
          <p className="font-semibold text-sm">Municipality of Roxas</p>
          <p className="font-semibold uppercase text-base">
            BARANGAY {data.barangayName || "LUNA"}
          </p>
          <p className="font-semibold text-xs mt-1">
            OFFICE OF THE PUNONG BARANGAY
          </p>
        </div>
        <img
          src="/LogoOfRoxas.png"
          alt="logo"
          className="w-64  h-64 object-contain scale-110"
        />
      </div>

      <h1 className="text-center text-3xl font-bold underline mb-8 mt-8">
        BARANGAY BUSINESS CLEARANCE
      </h1>

      <div className="mb-8">
        <p className="text-sm font-semibold">TO WHOM IT MAY CONCERN:</p>
      </div>

      <div className="space-y-6 text-justify">
        <p className="text-base leading-relaxed indent-12">
          This is to certify that{" "}
          <span className="font-bold text-lg underline">{data.fullName}</span>,
          of legal age, Filipino citizen, and a resident of{" "}
          <span className="font-bold">{data.address}</span>, Barangay{" "}
          {data.barangayName || "Luna"}, Roxas, Isabela, has been cleared by
          this office to operate a business.
        </p>

        <p className="text-base leading-relaxed indent-12">
          This certification is issued in connection with the application for{" "}
          <span className="font-bold uppercase text-lg">
            {data.purpose || "BUSINESS PERMIT"}
          </span>
          .
        </p>

        <p className="text-base leading-relaxed indent-12">
          The proposed business establishment has been inspected and found to be
          in compliance with barangay ordinances and regulations. Further, there
          are no pending complaints or violations against the applicant in this
          barangay.
        </p>

        <p className="text-base leading-relaxed indent-12">
          This clearance is valid for one (1) year from the date of issuance and
          is issued for the sole purpose of securing a business permit from the
          Municipal Government.
        </p>

        <p className="text-base leading-relaxed indent-12">
          Issued this <span className="font-bold">{new Date().getDate()}</span>
          <sup>{getOrdinalSuffix(new Date().getDate())}</sup> day of{" "}
          <span className="font-bold">
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>{" "}
          at Barangay {data.barangayName || "Luna"}, Roxas, Isabela,
          Philippines.
        </p>
      </div>

      <div className="mt-12 space-y-2">
        <p className="text-sm">
          <span className="font-semibold">Business Name:</span> _______________
        </p>
        <p className="text-sm">
          <span className="font-semibold">Business Address:</span>{" "}
          _______________
        </p>
        <p className="text-sm">
          <span className="font-semibold">Nature of Business:</span>{" "}
          _______________
        </p>
        <p className="text-sm">
          <span className="font-semibold">OR Number:</span> _______________
        </p>
        <p className="text-sm">
          <span className="font-semibold">Amount Paid:</span> ₱_______________
        </p>
      </div>
    </div>
  ),

  // 5. GOOD MORAL CHARACTER
  "Good Moral Character": ({ data, user }) => (
    <div className="relative w-[8.5in] min-h-[11in] mx-auto p-12 bg-white">
      <img
        src="/watermark.png"
        alt="watermark"
        className="absolute opacity-10 w-[60%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      />

      <div className="flex justify-between items-center mb-8">
        <img
          src="/BagongPilipinasLogo.png"
          alt="logo"
          className="w-28 h-28 object-contain"
        />
        <div className="text-center flex-1 mx-4">
          <p className="font-semibold text-sm">Republic of the Philippines</p>
          <p className="font-semibold text-sm">Province of Isabela</p>
          <p className="font-semibold text-sm">Municipality of Roxas</p>
          <p className="font-semibold uppercase text-base">
            BARANGAY {data.barangayName || "LUNA"}
          </p>
          <p className="font-semibold text-xs mt-1">
            OFFICE OF THE PUNONG BARANGAY
          </p>
        </div>
        <img
          src="/LogoOfRoxas.png"
          alt="logo"
          className="w-64 h-64 object-contain scale-110"
        />
      </div>

      <h1 className="text-center text-3xl font-bold underline mb-8 mt-8">
        CERTIFICATE OF GOOD MORAL CHARACTER
      </h1>

      <div className="mb-8">
        <p className="text-sm font-semibold">TO WHOM IT MAY CONCERN:</p>
      </div>

      <div className="space-y-6 text-justify">
        <p className="text-base leading-relaxed indent-12">
          This is to certify that{" "}
          <span className="font-bold text-lg underline">{data.fullName}</span>,
          of legal age, Filipino citizen, and a resident of{" "}
          <span className="font-bold">{data.address}</span>, Barangay{" "}
          {data.barangayName || "Luna"}, Roxas, Isabela, is a person of good
          moral character.
        </p>

        <p className="text-base leading-relaxed indent-12">
          Based on the records and personal knowledge of this office, the
          above-named individual has demonstrated exemplary conduct and behavior
          within the community. He/She is known to be honest, trustworthy, and
          law-abiding.
        </p>

        <p className="text-base leading-relaxed indent-12">
          Further, this office certifies that the said person has not been
          involved in any criminal activities, vices, or immoral conduct that
          would tarnish his/her reputation in this community.
        </p>

        <p className="text-base leading-relaxed indent-12">
          This certification is being issued upon the request of the above-named
          person for{" "}
          <span className="font-bold uppercase text-lg">
            {data.purpose || "WHATEVER LEGAL PURPOSE IT MAY SERVE"}
          </span>
          .
        </p>

        <p className="text-base leading-relaxed indent-12">
          Issued this <span className="font-bold">{new Date().getDate()}</span>
          <sup>{getOrdinalSuffix(new Date().getDate())}</sup> day of{" "}
          <span className="font-bold">
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>{" "}
          at Barangay {data.barangayName || "Luna"}, Roxas, Isabela,
          Philippines.
        </p>
      </div>

      {data.photoUrl && (
        <div className="mt-12 mb-8">
          <p className="text-sm font-semibold mb-2">PHOTO:</p>
          <div className="border-4 border-gray-800 w-40 h-40 overflow-hidden">
            <img
              src={data.photoUrl}
              alt="Applicant"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  ),

  // 6. FIRST TIME JOB SEEKER
  "First Time Job Seeker": ({ data, user }) => (
    <div className="relative w-[8.5in] min-h-[11in] mx-auto p-12 bg-white">
      <img
        src="/watermark.png"
        alt="watermark"
        className="absolute opacity-10 w-[60%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      />

      <div className="flex justify-between items-center mb-8">
        <img
          src="/BagongPilipinasLogo.png"
          alt="logo"
          className="w-28 h-28 object-contain"
        />
        <div className="text-center flex-1 mx-4">
          <p className="font-semibold text-sm">Republic of the Philippines</p>
          <p className="font-semibold text-sm">Province of Isabela</p>
          <p className="font-semibold text-sm">Municipality of Roxas</p>
          <p className="font-semibold uppercase text-base">
            BARANGAY {data.barangayName || "LUNA"}
          </p>
          <p className="font-semibold text-xs mt-1">
            OFFICE OF THE PUNONG BARANGAY
          </p>
        </div>
        <img
          src="/LogoOfRoxas.png"
          alt="logo"
          className="w-64 h-64 object-contain scale-110"
        />
      </div>

      <h1 className="text-center text-3xl font-bold underline mb-8 mt-8">
        FIRST TIME JOB SEEKER CERTIFICATION
      </h1>
      <p className="text-center text-sm italic mb-8">
        (In compliance with R.A. 11261 - First Time Jobseekers Assistance Act)
      </p>

      <div className="mb-8">
        <p className="text-sm font-semibold">TO WHOM IT MAY CONCERN:</p>
      </div>

      <div className="space-y-6 text-justify">
        <p className="text-base leading-relaxed indent-12">
          This is to certify that{" "}
          <span className="font-bold text-lg underline">{data.fullName}</span>,
          of legal age, Filipino citizen, and a resident of{" "}
          <span className="font-bold">{data.address}</span>, Barangay{" "}
          {data.barangayName || "Luna"}, Roxas, Isabela, is a first-time job
          seeker.
        </p>

        <p className="text-base leading-relaxed indent-12">
          This certification is being issued in compliance with Republic Act No.
          11261, otherwise known as the "First Time Jobseekers Assistance Act of
          2019," which exempts first-time job seekers from certain fees and
          requirements.
        </p>

        <p className="text-base leading-relaxed indent-12">
          The above-named person is qualified to avail of the benefits under RA
          11261, which includes exemption from fees relative to securing
          documents for employment purposes.
        </p>

        <p className="text-base leading-relaxed indent-12">
          This certification shall be valid for one (1) year from the date of
          issuance and can only be used once. Any misrepresentation or false
          statement herein shall be subject to penalties under existing laws.
        </p>

        <p className="text-base leading-relaxed indent-12">
          Issued this <span className="font-bold">{new Date().getDate()}</span>
          <sup>{getOrdinalSuffix(new Date().getDate())}</sup> day of{" "}
          <span className="font-bold">
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>{" "}
          at Barangay {data.barangayName || "Luna"}, Roxas, Isabela,
          Philippines.
        </p>
      </div>

      {data.photoUrl && (
        <div className="mt-12 mb-8">
          <p className="text-sm font-semibold mb-2">PHOTO:</p>
          <div className="border-4 border-gray-800 w-40 h-40 overflow-hidden">
            <img
              src={data.photoUrl}
              alt="Job Seeker"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <div className="mt-8 p-4 border-2 border-gray-800">
        <p className="text-xs font-semibold mb-2">DECLARATION:</p>
        <p className="text-xs">
          I hereby certify that I am a first-time job seeker and that this is my
          first time to apply for employment. I understand that any false
          statement made herein is punishable by law.
        </p>
        <div className="mt-4">
          <div className="border-b-2 border-gray-800 w-64 h-16 ml-auto"></div>
          <p className="text-xs text-right mt-1">Signature of Applicant</p>
        </div>
      </div>
    </div>
  ),

  // Default template for unknown types
  default: ({ data, user }) => (
    <div className="relative w-[8.5in] min-h-[11in] mx-auto p-12 bg-white">
      <img
        src="/watermark.png"
        alt="watermark"
        className="absolute opacity-10 w-[60%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      />

      <div className="flex justify-between items-center mb-8">
        <img
          src="/BagongPilipinasLogo.png"
          alt="logo"
          className="w-28 h-28 object-contain"
        />
        <div className="text-center flex-1 mx-4">
          <p className="font-semibold text-sm">Republic of the Philippines</p>
          <p className="font-semibold text-sm">Province of Isabela</p>
          <p className="font-semibold text-sm">Municipality of Roxas</p>
          <p className="font-semibold uppercase text-base">
            BARANGAY {data.barangayName || "LUNA"}
          </p>
          <p className="font-semibold text-xs mt-1">
            OFFICE OF THE PUNONG BARANGAY
          </p>
        </div>
        <img
          src="/LogoOfRoxas.png"
          alt="logo"
          className="w-64  h-64 object-contain scale-110"
        />
      </div>

      <h1 className="text-center text-3xl font-bold underline mb-8 mt-8">
        BARANGAY CERTIFICATION
      </h1>

      <div className="mb-8">
        <p className="text-sm font-semibold">TO WHOM IT MAY CONCERN:</p>
      </div>

      <div className="space-y-6 text-justify">
        <p className="text-base leading-relaxed indent-12">
          This is to certify that{" "}
          <span className="font-bold text-lg underline">{data.fullName}</span>,
          of legal age, Filipino citizen, and a resident of{" "}
          <span className="font-bold">{data.address}</span>, Barangay{" "}
          {data.barangayName || "Luna"}, Roxas, Isabela, is personally known to
          me.
        </p>

        <p className="text-base leading-relaxed indent-12">
          This certification is being issued upon the request of the above-named
          person for{" "}
          <span className="font-bold uppercase text-lg">
            {data.purpose || "WHATEVER LEGAL PURPOSE IT MAY SERVE"}
          </span>
          .
        </p>

        <p className="text-base leading-relaxed indent-12">
          Issued this <span className="font-bold">{new Date().getDate()}</span>
          <sup>{getOrdinalSuffix(new Date().getDate())}</sup> day of{" "}
          <span className="font-bold">
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>{" "}
          at Barangay {data.barangayName || "Luna"}, Roxas, Isabela,
          Philippines.
        </p>
      </div>
    </div>
  ),
};

// Helper function for ordinal suffix
const getOrdinalSuffix = (day) => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export default CertificateTemplates;
// Export the template getter function
export const getCertificateTemplate = (typeName) => {
  return CertificateTemplates[typeName] || CertificateTemplates.default;
};
