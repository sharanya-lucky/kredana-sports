import React from "react";
import { Search, Users, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Racket = () => {
  const navigate = useNavigate();

  const categories = [
    "Tennis",
    "Badminton",
    "Pickleball",
    "Soft Tennis",
    "Padel Tennis",
    "Speedminton",
  ];

  /* ================= CATEGORY IMAGES (PUBLIC FOLDER - JPEG) ================= */
  const categoryImages = {
    Tennis: "/images/tennis.jpeg",
    Badminton: "/images/badminton.jpeg",
    Pickleball: "/images/pickleball.jpeg",
    "Soft Tennis": "/images/soft-tennis.jpeg",
    "Padel Tennis": "/images/padel-tennis.jpeg",
    Speedminton: "/images/speedminton.jpeg",
  };

  const handleViewTrainers = () => {
    navigate("/viewTrainers?category=Racket");
  };

  const handleViewInstitutes = () => {
    navigate("/viewInstitutes?category=Racket");
  };

  return (
    <div className="font-sans bg-gray-50 text-gray-800">
      {/* ================= HERO SECTION ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
          Master the Court
        </h2>

        <p className="text-gray-600 max-w-2xl mx-auto mb-10">
          Sharpen your focus, power, and passion with dynamic racket sports.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
          <button
            onClick={handleViewTrainers}
            className="flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition"
          >
            <Users size={18} /> View Trainers
          </button>

          <button
            onClick={handleViewInstitutes}
            className="flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition"
          >
            <Building2 size={18} /> View Institutes
          </button>
        </div>

        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search for Institutes and Trainers"
            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
      </section>

      {/* ================= RACKET SPORTS CATEGORIES ================= */}
      <section className="max-w-7xl mx-auto px-6 pt-0 pb-16">
        <h3 className="text-3xl font-bold text-orange-600 mb-8 text-center">
          Racket Sports
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {categories.map((item) => (
            <div
              key={item}
              onClick={() =>
                navigate(`/viewTrainers?category=${encodeURIComponent(item)}`)
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
            Get started with your racket sports journey in three simple steps.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white rounded-xl p-8 shadow hover:shadow-lg transition">
              <div className="w-14 h-14 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <Users />
              </div>
              <h4 className="font-bold text-lg mb-3">Find Your Trainers</h4>
              <p className="text-gray-600 mb-6">
                Discover certified coaches for your favorite racket sport.
              </p>
              
            </div>

            <div className="bg-white rounded-xl p-8 shadow hover:shadow-lg transition">
              <div className="w-14 h-14 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 />
              </div>
              <h4 className="font-bold text-lg mb-3">Find Your Institutes</h4>
              <p className="text-gray-600 mb-6">
                Explore academies with professional racket training facilities.
              </p>
             
            </div>

            <div className="bg-white rounded-xl p-8 shadow hover:shadow-lg transition">
              <div className="w-14 h-14 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                ⚡
              </div>
              <h4 className="font-bold text-lg mb-3">Start Training</h4>
              <p className="text-gray-600 mb-6">
                Perfect your technique and dominate the court.
              </p>
              
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Racket;
