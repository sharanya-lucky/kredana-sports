import React, { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import {
  setDoc,
  doc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { db, secondaryAuth } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

const inputClass =
  "w-full border border-gray-300 rounded-md px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-0";


const labelClass = "text-sm font-semibold";

const DEFAULT_PASSWORD = "123456";

const AddTrainerDetailsPage = () => {
  const { user, institute } = useAuth();

  // ✅ FIX 1: STATES MUST BE HERE (NOT INSIDE FUNCTIONS)
  const [profileImage, setProfileImage] = useState(null);
  const [certificateImages, setCertificateImages] = useState([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    Designation: "",
    dateOfBirth: "",
    joinedDate: "",
    email: "",
    phone: "",
    certificates: "",
    monthlySalary: "",
    lpa: "",
    pfNumber: "",
    trainerId: "",
    bankName: "",
    ifscCode: "",
    accountNumber: "",
  });

  // ✅ REQUIRED FIELD VALIDATION
  const requiredFields = [
    "firstName",
    "lastName",
    "Designation",
    "joinedDate",
    "email",
    "phone",
    "monthlySalary",
    "certificates",
  ];

  const isFormValid = requiredFields.every(
    (field) => formData[field]?.toString().trim() !== ""
  );

  // ✅ FIX 2: HANDLER MUST BE OUTSIDE handleSubmit
  const handleCertificateUpload = (e) => {
    const files = Array.from(e.target.files);

    if (certificateImages.length + files.length > 3) {
      alert("You can upload a maximum of 3 certificate images only.");
      return;
    }

    setCertificateImages((prev) => [...prev, ...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      alert("Please fill all required fields");
      return;
    }

    if (!user || institute?.role !== "institute") {
      alert("Unauthorized access");
      return;
    }

    try {
      const trainerCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        formData.email,
        DEFAULT_PASSWORD
      );

      const trainerUid = trainerCredential.user.uid;
      const storage = getStorage();

      // ✅ Upload profile image
      let profileImageUrl = "";
      if (profileImage) {
        const imageRef = ref(storage, `trainers/${trainerUid}/profile.jpg`);
        await uploadBytes(imageRef, profileImage);
        profileImageUrl = await getDownloadURL(imageRef);
      }

      // ✅ Upload certificate images (max 3)
      const certificateImageUrls = [];
      for (let i = 0; i < certificateImages.length; i++) {
        const certRef = ref(
          storage,
          `trainers/${trainerUid}/certificates/${i}.jpg`
        );
        await uploadBytes(certRef, certificateImages[i]);
        const url = await getDownloadURL(certRef);
        certificateImageUrls.push(url);
      }

      await setDoc(doc(db, "InstituteTrainers", trainerUid), {
        ...formData,
        dateOfBirth: formData.dateOfBirth,
        profileImage: profileImageUrl,
        certificateImages: certificateImageUrls,
        trainerUid,
        instituteId: user.uid,
        role: "trainer",
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "institutes", user.uid), {
        trainers: arrayUnion(trainerUid),
      });

      alert("Trainer added & login created (password: 123456)");

      // ✅ RESET STATES
      setFormData({
        firstName: "",
        lastName: "",
        Designation: "",
        dateOfBirth: "",
        joinedDate: "",
        email: "",
        phone: "",
        certificates: "",
        monthlySalary: "",
        lpa: "",
        pfNumber: "",
        trainerId: "",
        bankName: "",
        ifscCode: "",
        accountNumber: "",
      });
      setProfileImage(null);
      setCertificateImages([]);
    } catch (error) {
      console.error("Trainer creation failed:", error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex justify-center items-start overflow-auto py-10 px-4">
      {/* Main Card */}
      <div className="w-full max-w-4xl bg-white text-black rounded-2xl shadow-xl p-6 sm:p-10 md:p-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-orange-500">
            Add Trainer Details
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Enter trainer information carefully before saving
          </p>
        </div>

        {/* Form */}
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* First & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>
                First Name <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                className={inputClass}
                placeholder="Enter First Name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className={labelClass}>
                Last Name <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                className={inputClass}
                placeholder="Enter Last Name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>
          </div>
          {/* Profile Image */}
          <div className="space-y-2">
            <label className={labelClass}>
              Profile Image <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full text-sm"
              onChange={(e) => setProfileImage(e.target.files[0])}
            />
          </div>



          {/* Category & Joined Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>
                Designation <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                className={inputClass}
                placeholder="Enter Designation"
                value={formData.Designation}
                onChange={(e) =>
                  setFormData({ ...formData, Designation: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className={labelClass}>
                Joined Date <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="date"
                className={inputClass}
                value={formData.joinedDate}
                onChange={(e) =>
                  setFormData({ ...formData, joinedDate: e.target.value })
                }
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>
                E-mail <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="email"
                className={inputClass}
                placeholder="Enter Email Address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className={labelClass}>
                Phone Number <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                className={inputClass}
                placeholder="Enter Phone Number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
          </div>

          {/* Date of Birth & Account Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date of Birth */}
            <div className="space-y-2">
              <label className={labelClass}>
                Date of Birth <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="date"
                className={inputClass}
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
              />
            </div>

            {/* Account Number */}
            <div className="space-y-2">
              <label className={labelClass}>Account Number (Optional)</label>
              <input
                className={inputClass}
                placeholder="Enter Account Number"
                value={formData.accountNumber}
                onChange={(e) =>
                  setFormData({ ...formData, accountNumber: e.target.value })
                }
              />
            </div>
          </div>
          {/* Salary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>
                Monthly Salary <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="number"
                className={inputClass}
                placeholder="Enter Monthly Salary"
                value={formData.monthlySalary}
                onChange={(e) =>
                  setFormData({ ...formData, monthlySalary: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className={labelClass}>LPA (Optional)</label>
              <input
                type="number"
                className={inputClass}
                placeholder="Enter LPA"
                value={formData.lpa}
                onChange={(e) =>
                  setFormData({ ...formData, lpa: e.target.value })
                }
              />
            </div>
          </div>

          {/* Trainer ID & PF */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>Trainer ID (Optional)</label>
              <input
                className={inputClass}
                placeholder="Enter Trainer ID"
                value={formData.trainerId}
                onChange={(e) =>
                  setFormData({ ...formData, trainerId: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className={labelClass}>PF Number (Optional)</label>
              <input
                className={inputClass}
                placeholder="Enter PF Number"
                value={formData.pfNumber}
                onChange={(e) =>
                  setFormData({ ...formData, pfNumber: e.target.value })
                }
              />
            </div>
          </div>

          {/* Bank */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>Bank Name (Optional)</label>
              <input
                className={inputClass}
                placeholder="Enter Bank Name"
                value={formData.bankName}
                onChange={(e) =>
                  setFormData({ ...formData, bankName: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className={labelClass}>IFSC Code (Optional)</label>
              <input
                className={inputClass}
                placeholder="Enter IFSC Code"
                value={formData.ifscCode}
                onChange={(e) =>
                  setFormData({ ...formData, ifscCode: e.target.value })
                }
              />
            </div>
          </div>


          {/* Certificates */}
          <div className="space-y-2">
            <label className={labelClass}>
              Certificates <span className="text-red-500 ml-1">*</span>
            </label>

            {/* Certificate name / description */}
            <input
              className={inputClass}
              placeholder="Enter Certificate Details"
              value={formData.certificates}
              onChange={(e) =>
                setFormData({ ...formData, certificates: e.target.value })
              }
            />

            {/* Certificate image upload */}
            <input
              type="file"
              accept="image/*"
              multiple
              className="w-full text-sm"
              onChange={handleCertificateUpload}
            />

            {/* Image count info */}
            <p className="text-xs text-gray-500">
              {certificateImages.length}/3 images selected
            </p>
          </div>


          {/* Submit */}
          <div className="pt-6 flex justify-center">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full sm:w-auto px-16 py-3 rounded-xl text-lg font-extrabold transition-all duration-300
                ${isFormValid
                  ? "bg-orange-500 text-white hover:bg-orange-600 cursor-pointer shadow-md"
                  : "bg-orange-200 text-white cursor-not-allowed"
                }`}
            >
              Save Trainer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTrainerDetailsPage;