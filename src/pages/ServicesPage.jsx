import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

/* ================= SERVICES ================= */
const services = [
  "Martial Arts",
  "Team Ball Sports",
  "Racket Sports",
  "Fitness",
  "Target & Precision Sports",
  "Equestrian Sports",
  "Adventure & Outdoor Sports",
  "Ice Sports",
  "Wellness",
  "Dance",
  "Play School",
];

const serviceImages = {
  "Martial Arts": "/images/martial-arts.jpg",
  "Team Ball Sports": "/images/team-ball-sports.jpg",
  "Racket Sports": "/images/racket-sports.jpg",
  "Fitness": "/images/fitness.jpg",
  "Target & Precision Sports": "/images/target-precision-sports.jpg",
  "Equestrian Sports": "/images/equestrian-sports.jpg",
  "Adventure & Outdoor Sports": "/images/adventure-outdoor-sports.jpg",
  "Ice Sports": "/images/ice-sports.jpg",
  "Wellness": "/images/wellness.jpg",
  "Dance": "/images/dance.jpg",
  "Play School": "/images/play-school.jpg",
};

/* ================= ROUTES ================= */
const serviceRoutes = {
  "Martial Arts": "/services/martial-arts",
  "Team Ball Sports": "/services/teamball",
  "Racket Sports": "/services/racketsports",
  "Fitness": "/services/fitness",
  "Target & Precision Sports": "/services/target-precision-sports",
  "Equestrian Sports": "/services/equestrian-sports",
  "Adventure & Outdoor Sports": "/services/adventure-outdoor-sports",
  "Ice Sports": "/services/ice-sports",
  "Wellness": "/services/wellness",
  "Dance": "/services/dance",
  "Play School": "/services/play-school",
};

const ServicesPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, []);


  return (
    <div className="w-full font-sans bg-white">
      {/* ================= HEADER ================= */}
      <section className="px-6 md:px-16 py-12">
        <h1 className="text-4xl font-bold text-orange-600 mb-3 text-center">
          Our Categories
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-center">
          Explore a wide range of sports, fitness, and wellness programs guided
          by expert trainers and institutes.
        </p>
      </section>

      {/* ================= SERVICES GRID ================= */}
      <section className="px-6 md:px-16 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service) => (
            <motion.div
              key={service}
              whileHover={{ scale: 1.06 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              onClick={() => navigate(serviceRoutes[service])}
              className="h-[420px] bg-black rounded-[40px] p-6 flex flex-col justify-between cursor-pointer shadow-xl"
            >
              {/* IMAGE */}
              <div className="flex justify-center mt-4">
                <div className="w-56 h-56 bg-orange-500 rounded-3xl overflow-hidden">
                  <img
                    src={serviceImages[service]}
                    alt={service}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* TITLE */}
              <h3 className="text-2xl text-center font-semibold text-orange-500 mt-6">
                {service}
              </h3>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
