import React from "react";
import { Search, Users, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PlaySchoolPage = () => {
  const navigate = useNavigate();

  /* ================= PLAY SCHOOL SUB-CATEGORIES ================= */
  const categories = [
    "Pre-Nursery",
    "Nursery",
    "LKG",
    "UKG",
    "Day Care",
    "Activity Based Learning",
  ];

  /* ================= CATEGORY IMAGES (PUBLIC FOLDER - JPEG) ================= */
  const categoryImages = {
    "Pre-Nursery": "/images/pre-nursery.jpeg",
    Nursery: "/images/nursery.jpeg",
    LKG: "/images/lkg.jpeg",
    UKG: "/images/ukg.jpeg",
    "Day Care": "/images/day-care.jpeg",
    "Activity Based Learning": "/images/activity-learning.jpeg",
  };

  /* ================= HANDLERS ================= */
  const handleViewTrainers = () => {
    navigate("/viewtrainers?category=Play School");
  };

  const handleViewInstitutes = () => {
    navigate("/viewinstitutes?category=Play School");
  };

  return (
    <div className="font-sans bg-gray-50 text-gray-800">
      {/* ================= HERO SECTION ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
          Building Bright Futures from the Start
        </h2>

        <p className="text-gray-600 max-w-2xl mx-auto mb-10">
          Nurturing young minds through fun, care, and early childhood education.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
          <button
            onClick={handleViewTrainers}
            className="flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition"
          >
            <Users size={18} /> View Teachers
          </button>

          <button
            onClick={handleViewInstitutes}
            className="flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition"
          >
            <Building2 size={18} /> View Play Schools
          </button>
        </div>

        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search for Play Schools and Teachers"
            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
      </section>

      {/* ================= PLAY SCHOOL CATEGORIES ================= */}
      <section className="max-w-7xl mx-auto px-6 pt-0 pb-16">
        <h3 className="text-3xl font-bold text-orange-600 mb-8 text-center">
          Play School Programs
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {categories.map((item) => (
            <div
              key={item}
              onClick={() =>
                navigate(
                  `/viewinstitutes?category=${encodeURIComponent(item)}`
                )
              }
              className="bg-black rounded-[2.5rem] p-6 flex flex-col items-center cursor-pointer hover:scale-105 transition"
            >
              {/* IMAGE */}
              <div className="w-48 h-32 rounded-2xl overflow-hidden mb-6">
                <img
                  src={categoryImages[item]}
                  alt={item}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* TITLE */}
              <h4 className="text-orange-500 text-xl font-semibold text-center mt-auto">
                {item}
              </h4>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-orange-100 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-4">How it Works</h3>
          <p className="text-gray-600 mb-12">
            Start your child’s learning journey in three simple steps.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white rounded-xl p-8 shadow hover:shadow-lg transition">
              <div className="w-14 h-14 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <Users />
              </div>
              <h4 className="font-bold text-lg mb-3">Find Teachers</h4>
              <p className="text-gray-600 mb-6">
                Discover trained and caring teachers for early education.
              </p>
             
            </div>

            <div className="bg-white rounded-xl p-8 shadow hover:shadow-lg transition">
              <div className="w-14 h-14 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 />
              </div>
              <h4 className="font-bold text-lg mb-3">Choose Play School</h4>
              <p className="text-gray-600 mb-6">
                Compare top-rated play schools with safe and joyful environments.
              </p>
             
            </div>

            <div className="bg-white rounded-xl p-8 shadow hover:shadow-lg transition">
              <div className="w-14 h-14 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                🎒
              </div>
              <h4 className="font-bold text-lg mb-3">Begin Learning</h4>
              <p className="text-gray-600 mb-6">
                Enroll your child and start a joyful learning experience.
              </p>
             
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlaySchoolPage;