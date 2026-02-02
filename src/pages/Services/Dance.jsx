import React from "react";
import { Search, Users, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dance = () => {
  const navigate = useNavigate();

  const categories = [
    "Classical Dance",
    "Contemporary Dance",
    "Hip-Hop Dance",
    "Folk Dance",
    "Western Dance",
    "Latin Dance",
    "Fitness Dance",
    "Creative & Kids Dance",
  ];

  /* ================= CATEGORY IMAGES (PUBLIC FOLDER - JPEG) ================= */
  const categoryImages = {
    "Classical Dance": "/images/classical-dance.jpeg",
    "Contemporary Dance": "/images/contemporary-dance.jpeg",
    "Hip-Hop Dance": "/images/hip-hop-dance.jpeg",
    "Folk Dance": "/images/folk-dance.jpeg",
    "Western Dance": "/images/western-dance.jpeg",
    "Latin Dance": "/images/latin-dance.jpeg",
    "Fitness Dance": "/images/fitness-dance.jpeg",
    "Creative & Kids Dance": "/images/creative-kids-dance.jpeg",
  };

  const handleViewTrainers = () => {
    navigate("/viewTrainers?category=Dance");
  };

  const handleViewInstitutes = () => {
    navigate("/viewInstitutes?category=Dance");
  };

  return (
    <div className="font-sans bg-gray-50 text-gray-800">
      {/* ================= HERO SECTION ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
          Move with Passion and Grace
        </h2>

        <p className="text-gray-600 max-w-2xl mx-auto mb-10">
          Build rhythm, confidence, and expression through inspiring dance
          training.
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
          <Search
            className="absolute left-4 top-3.5 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search for Institutes and Trainers"
            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
      </section>

      {/* ================= DANCE CATEGORIES ================= */}
      <section className="max-w-7xl mx-auto px-6 pt-0 pb-16">
        <h3 className="text-3xl font-bold text-orange-600 mb-8 text-center">
          Dance Categories
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
            Begin your dance journey in three simple steps.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white rounded-xl p-8 shadow hover:shadow-lg transition">
              <div className="w-14 h-14 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <Users />
              </div>
              <h4 className="font-bold text-lg mb-3">Find Your Trainers</h4>
              <p className="text-gray-600 mb-6">
                Learn from experienced dance instructors across multiple styles.
              </p>
            
            </div>

            <div className="bg-white rounded-xl p-8 shadow hover:shadow-lg transition">
              <div className="w-14 h-14 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 />
              </div>
              <h4 className="font-bold text-lg mb-3">Find Your Institutes</h4>
              <p className="text-gray-600 mb-6">
                Explore studios and academies that nurture creativity and
                performance.
              </p>
             
            </div>

            <div className="bg-white rounded-xl p-8 shadow hover:shadow-lg transition">
              <div className="w-14 h-14 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                ⚡
              </div>
              <h4 className="font-bold text-lg mb-3">Start Dancing</h4>
              <p className="text-gray-600 mb-6">
                Express yourself, stay active, and grow with every step you take.
              </p>
              
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dance;
