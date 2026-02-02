import React, { useState } from "react";
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
  "w-full border border-gray-300 rounded-md px-4 py-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400";

const labelClass = "text-sm font-semibold";

const DEFAULT_PASSWORD = "123456";

const AddTrainerDetailsPage = () => {
  const { user, institute } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    category: "",
    joinedDate: "",
    email: "",
    phone: "",
    certificates: "",
    monthlySalary: "",
    lpa: "",

    // ✅ New Optional Fields
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
    "category",
    "joinedDate",
    "email",
    "phone",
    "monthlySalary",
    "certificates",
  ];

  const isFormValid = requiredFields.every(
    (field) => formData[field]?.toString().trim() !== "",
  );

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
        DEFAULT_PASSWORD,
      );

      const trainerUid = trainerCredential.user.uid;

      await setDoc(doc(db, "InstituteTrainers", trainerUid), {
        ...formData,
        trainerUid,
        instituteId: user.uid,
        role: "trainer",
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "institutes", user.uid), {
        trainers: arrayUnion(trainerUid),
      });

      alert("Trainer added & login created (password: 123456)");

      setFormData({
        firstName: "",
        lastName: "",
        category: "",
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

          {/* Category & Joined Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>
                Category <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                className={inputClass}
                placeholder="Enter Category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
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
              <label className={labelClass}>Trainer ID</label>
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
              <label className={labelClass}>PF Number</label>
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
              <label className={labelClass}>Bank Name</label>
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
              <label className={labelClass}>IFSC Code</label>
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

          {/* Account Number */}
          <div className="space-y-2">
            <label className={labelClass}>Account Number</label>
            <input
              className={inputClass}
              placeholder="Enter Account Number"
              value={formData.accountNumber}
              onChange={(e) =>
                setFormData({ ...formData, accountNumber: e.target.value })
              }
            />
          </div>

          {/* Certificates */}
          <div className="space-y-2">
            <label className={labelClass}>
              Certificates <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              className={inputClass}
              placeholder="Enter Certificates"
              value={formData.certificates}
              onChange={(e) =>
                setFormData({ ...formData, certificates: e.target.value })
              }
            />
          </div>

          {/* Submit */}
          <div className="pt-6 flex justify-center">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full sm:w-auto px-16 py-3 rounded-xl text-lg font-extrabold transition-all duration-300
                ${
                  isFormValid
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