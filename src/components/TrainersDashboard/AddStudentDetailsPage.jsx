import React, { useState } from "react";
import { db, auth } from "../../firebase";
import { v4 as uuidv4 } from "uuid"; 
import { useNavigate } from "react-router-dom";
import {
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";

const AddStudentDetailsPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  // ✅ Success Message State
  const [successMessage, setSuccessMessage] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    category: "",
    joinedDate: "",
    email: "",
    phoneNumber: "",
    feeAmount: "",
  });

  // ✅ FORM VALIDATION (ALL FIELDS REQUIRED)
  const isFormValid =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.category.trim() &&
    form.joinedDate.trim() &&
    form.email.trim() &&
    form.phoneNumber.trim() &&
    form.feeAmount.trim();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isFormValid) {
    alert("Please fill all required fields");
    return;
  }

  setSuccessMessage("");
  const trainer = auth.currentUser;
  if (!trainer) {
    alert("Trainer not logged in");
    return;
  }

  try {
    setLoading(true);
    const studentUID = uuidv4();

    await setDoc(doc(db, "trainerstudents", studentUID), {
      firstName: form.firstName,
      lastName: form.lastName,
      category: form.category,
      joinedDate: form.joinedDate,
      email: form.email,
      phoneNumber: form.phoneNumber,
      feeAmount: Number(form.feeAmount),
      trainerUID: trainer.uid,
      studentUID: studentUID,
      role: "student",
      createdAt: serverTimestamp(),
    });

    await updateDoc(doc(db, "trainers", trainer.uid), {
      students: arrayUnion(studentUID),
    });

    setSuccessMessage("Student added successfully 🎉");
    setForm({
      firstName: "",
      lastName: "",
      category: "",
      joinedDate: "",
      email: "",
      phoneNumber: "",
      feeAmount: "",
    });

    navigate("/trainers/dashboard"); // ✅ Navigate after success
  } catch (error) {
    console.error(error);
    alert(error.message);
  } finally {
    setLoading(false);
  }
}; // <-- handleSubmit ends here

  return (
    <div className="min-h-screen flex items-center justify-center bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-6 text-gray-900">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl px-6 sm:px-10 py-8 sm:py-10 transition-colors">
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-8 text-orange-500 dark:text-white text-center sm:text-left">
          Add Student Details
        </h1>

        {/* ✅ Success Message Display */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-lg bg-green-100 text-green-700 font-semibold">
            {successMessage}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* First & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="font-semibold">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>

            <div>
              <label className="font-semibold">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>
          </div>

          {/* Category & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="font-semibold">
                Category <span className="text-red-500">*</span>
              </label>
              <input
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>

            <div>
              <label className="font-semibold">
                Joined Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="joinedDate"
                value={form.joinedDate}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="font-semibold">
                E-mail <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>

            <div>
              <label className="font-semibold">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                name="phoneNumber"
                placeholder="Phone Number"
                value={form.phoneNumber}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>
          </div>

          {/* Fee Amount */}
          <div>
            <label className="font-semibold">
              Fee Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="feeAmount"
              placeholder="Fee Amount"
              value={form.feeAmount}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className={`w-full sm:w-auto px-16 py-3 rounded-md font-extrabold transition
               ${isFormValid
                  ? "bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
                  : "bg-orange-200 text-white cursor-not-allowed"
                }`}
            >
              {loading ? "Saving..." : "Save"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentDetailsPage;