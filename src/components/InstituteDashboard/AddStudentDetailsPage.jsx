import React, { useState } from "react";
import {
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { db, secondaryAuth } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

const inputClass =
  "w-full border border-gray-300 rounded-md px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400";

const textareaClass =
  "w-full border border-gray-300 rounded-md px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400";

const DEFAULT_PASSWORD = "123456";

const AddStudentDetailsPage = () => {
  const { user, institute } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    fatherName: "",
    category: "",
    batchNumber: "",
    joinedDate: "",
    email: "",
    phone: "",
    studentFee: "",
    address: "",
  });

  const isFormValid = Object.values(formData).every(
    (value) => value.toString().trim() !== "",
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      alert("Please fill all the fields");
      return;
    }

    if (!user || institute?.role !== "institute") {
      alert("Unauthorized");
      return;
    }

    try {
      const studentCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        formData.email,
        DEFAULT_PASSWORD,
      );

      const studentUid = studentCredential.user.uid;

      await setDoc(doc(db, "students", studentUid), {
        ...formData,
        uid: studentUid,
        role: "student",
        instituteId: user.uid,
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "institutes", user.uid), {
        students: arrayUnion(studentUid),
      });

      alert("Student created successfully (Password: 123456)");

      setFormData({
        firstName: "",
        lastName: "",
        fatherName: "",
        category: "",
        batchNumber: "",
        joinedDate: "",
        email: "",
        phone: "",
        studentFee: "",
        address: "",
      });
    } catch (error) {
      console.error("Student creation failed:", error);
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
            Add Student Details
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Fill all details carefully before saving
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">
                First Name <span className="text-red-500">*</span>
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

            <div>
              <label className="block text-sm font-semibold mb-2">
                Last Name <span className="text-red-500">*</span>
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

          {/* Father Name & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Father Name <span className="text-red-500">*</span>
              </label>
              <input
                className={inputClass}
                placeholder="Enter Father Name"
                value={formData.fatherName}
                onChange={(e) =>
                  setFormData({ ...formData, fatherName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Category <span className="text-red-500">*</span>
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
          </div>

          {/* Batch Number & Joined Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Batch Number <span className="text-red-500">*</span>
              </label>
              <input
                className={inputClass}
                placeholder="Enter Batch Number"
                value={formData.batchNumber}
                onChange={(e) =>
                  setFormData({ ...formData, batchNumber: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Joined Date <span className="text-red-500">*</span>
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

          {/* Student Fee */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Student Fee <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className={inputClass}
              placeholder="Enter Student Fee"
              value={formData.studentFee}
              onChange={(e) =>
                setFormData({ ...formData, studentFee: e.target.value })
              }
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">
                E-mail <span className="text-red-500">*</span>
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

            <div>
              <label className="block text-sm font-semibold mb-2">
                Phone Number <span className="text-red-500">*</span>
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

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="3"
              className={textareaClass}
              placeholder="Enter Full Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
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
              Save Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentDetailsPage;