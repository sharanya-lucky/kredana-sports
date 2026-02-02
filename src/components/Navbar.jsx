import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { User } from "lucide-react";

const serviceTypes = [
  { name: "Martial Arts", path: "/services/martial-arts" },
  { name: "Team Ball Sports", path: "/services/teamball" },
  { name: "Racket Sports", path: "/services/racketsports" },
  { name: "Fitness", path: "/services/fitness" },
  {
    name: "Target & Precision Sports",
    path: "/services/target-precision-sports",
  },
  { name: "Equestrian Sports", path: "/services/equestrian-sports" },
  {
    name: "Adventure & Outdoor Sports",
    path: "/services/adventure-outdoor-sports",
  },
  { name: "Ice Sports", path: "/services/ice-sports" },
  { name: "Wellness", path: "/services/wellness" },
  { name: "Dance", path: "/services/dance" },
  { name: "Play School", path: "/services/play-school" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasActivePlan, setHasActivePlan] = useState(false);

  const navigate = useNavigate();
  const servicesRef = useRef(null);
  const userDropdownRef = useRef(null);


  /* ================= FETCH USER ROLE & PLAN ================= */
  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      // 🔹 CHECK ROLE
      const trainerSnap = await getDoc(doc(db, "trainers", currentUser.uid));
      if (trainerSnap.exists()) {
        setUserRole("trainer");
      } else {
        const instituteSnap = await getDoc(
          doc(db, "institutes", currentUser.uid),
        );
        if (instituteSnap.exists()) {
          setUserRole("institute");
        } else {
          setUserRole("user");
        }
      }
     
      // 🔹 CHECK PLAN
      const planSnap = await getDoc(doc(db, "plans", currentUser.uid));
      if (
        planSnap.exists() &&
        planSnap.data()?.currentPlan?.status === "active"
      ) {
        setHasActivePlan(true);
      } else {
        setHasActivePlan(false);
      }
    };

    fetchUserData();
  }, []);

   /* ================= USER DROPDOWN CLICK OUTSIDE ================= */
useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      userDropdownRef.current &&
      !userDropdownRef.current.contains(event.target)
    ) {
      setDropdownOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);



  /* ================= CLICK OUTSIDE HANDLER ================= */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target)) {
        setServiceOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= DASHBOARD NAVIGATION (UPDATED) ================= */

  const handleDashboardNavigation = () => {
    setDropdownOpen(false);

    // ✅ NORMAL USERS → NO PLAN CHECK
    if (userRole === "user") {
      navigate("/user/dashboard");
      return;
    }

    // 🔐 TRAINER / INSTITUTE → PLAN REQUIRED
    if (
      (userRole === "trainer" || userRole === "institute") &&
      !hasActivePlan
    ) {
      navigate("/plans");
      return;
    }

    if (userRole === "institute") {
      navigate("/institutes/dashboard");
      return;
    }

    if (userRole === "trainer") {
      navigate("/trainers/dashboard");
      return;
    }
  };

  /* ================= LOGOUT (ADDED) ================= */
  const handleLogout = async () => {
    try {
      await auth.signOut();
      setDropdownOpen(false);
      setIsOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
         {/* LOGO */}
<div
  onClick={() => navigate("/")}
  className="flex items-center gap-0 cursor-pointer"
>
  <img
    src="/Kridana logo.png"
    alt="Kridana Logo"
    className="w-16 h-16 object-contain"
  />

  <span className="text-2xl font-bold text-orange-600">
    Kridana
  </span>
</div>


          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/Landing" className="hover:text-orange-600">
              Home
            </NavLink>

            {/* SERVICES */}
            <div className="relative" ref={servicesRef}>
              <button
                onClick={() => setServiceOpen((prev) => !prev)}
                className="font-medium text-gray-700 hover:text-orange-600 flex items-center gap-1"
              >
               Categories
                <svg
                  className={`w-4 h-4 transition-transform ${
                    serviceOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {serviceOpen && (
                <div className="absolute top-10 left-0 w-56 bg-white shadow-lg rounded-lg border z-50">
                  {serviceTypes.map((service) => (
                    <NavLink
                      key={service.path}
                      to={service.path}
                      onClick={() => setServiceOpen(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                    >
                      {service.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            

            <NavLink to="/shop" className="hover:text-orange-600">
              Shop
            </NavLink>

            {/* USER */}
            {auth.currentUser && (
              <div className="relative"  ref={userDropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <User className="w-6 h-6 text-gray-700 hover:text-orange-600" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border z-50">
                    <button
                      onClick={handleDashboardNavigation}
                      className="block w-full text-left px-4 py-2 hover:bg-orange-50 hover:text-orange-600"
                    >
                      Dashboard
                    </button>

                    {/* LOGOUT (ADDED) */}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {!auth.currentUser && (
              <button
                onClick={() => navigate("/")}
                className="bg-orange-500 text-white px-5 py-2 rounded-lg"
              >
                Sign Up
              </button>
            )}
          </div>

          {/* MOBILE */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700"
          >
            ☰
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white px-6 pb-6 space-y-4">
          <NavLink to="/Landing" onClick={() => setIsOpen(false)}>
            Home
          </NavLink>

          <NavLink to="/viewTrainers" onClick={() => setIsOpen(false)}>
            Trainers
          </NavLink>

          <NavLink to="/shop" onClick={() => setIsOpen(false)}>
            Shop
          </NavLink>

          {auth.currentUser && (
            <button
              onClick={handleDashboardNavigation}
              className="block text-left w-full"
            >
              Dashboard
            </button>
          )}

          {/* LOGOUT (ADDED - MOBILE) */}
          {auth.currentUser && (
            <button
              onClick={handleLogout}
              className="block text-left w-full text-red-600"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
