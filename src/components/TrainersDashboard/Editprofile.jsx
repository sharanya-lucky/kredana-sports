import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import {
  Save,
  Plus,
  Trash2,
  Award,
  IndianRupee,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";

/* ---------------- CATEGORY CONFIG ---------------- */
const CATEGORY_MAP = {
  "Martial Arts": ["Karate", "Taekwondo", "Boxing", "Wrestling", "Fencing", "Kendo"],
  Fitness: [
    "Strength / Muscular Fitness",
    "Muscular Endurance",
    "Flexibility Fitness",
    "Balance & Stability",
    "Skill / Performance Fitness",
  ],
  "Equestrian Sports": [
    "Dressage",
    "Show Jumping",
    "Eventing",
    "Cross Country",
    "Endurance Riding",
    "Polo",
    "Horse Racing",
    "Para-Equestrian",
  ],
  "Adventure & Outdoor Sports": [
    "Rock Climbing",
    "Trekking",
    "Camping",
    "Kayaking",
    "Paragliding",
    "Surfing",
    "Mountain Biking",
    "Ziplining",
  ],
  "Team Ball Sports": [
    "Football",
    "Hockey",
    "Basketball",
    "Handball",
    "Rugby",
    "American Football",
    "Water Polo",
    "Lacrosse",
  ],
  "Racket Sports": [
    "Tennis",
    "Badminton",
    "Pickleball",
    "Soft Tennis",
    "Padel Tennis",
    "Speedminton",
  ],
  "Target Precision Sports": [
    "Archery",
    "Shooting",
    "Darts",
    "Bowling",
    "Golf",
    "Billiards",
    "Bocce",
    "Lawn Bowls",
  ],
  "Ice Sports": [
    "Ice Skating",
    "Figure Skating",
    "Ice Hockey",
    "Speed Skating",
    "Short Track Skating",
    "Ice Dancing",
    "Curling",
    "Synchronized Skating",
  ],
  Dance: [
    "Classical Dance",
    "Contemporary Dance",
    "Hip-Hop Dance",
    "Folk Dance",
    "Western Dance",
    "Latin Dance",
    "Fitness Dance",
    "Creative & Kids Dance",
  ],
  Wellness: [
    "Physical Wellness",
    "Mental Wellness",
    "Social Wellness",
    "Emotional Wellness",
    "Spiritual Wellness",
    "Lifestyle Wellness",
  ],
  "Play School": [
    "Pre-Nursery",
    "Nursery",
    "LKG",
    "UKG",
    "Day Care",
    "Activity Based Learning",
  ],
};

export default function TrainerEditProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    trainerName: "",
    profit: "",
    about: "",
    description: "",
    categories: [],
    subCategories: {},
    facilities: "",
    achievements: [""],
    studentsCount: "",
    experience: "",
    timings: "",
    website: "",
    phone: "",
    locationName: "",
  });

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      setLoading(false);
      return;
    }

    const fetchTrainer = async () => {
      try {
        const snap = await getDoc(doc(db, "trainers", uid));
        if (snap.exists()) {
          setForm((prev) => ({
            ...prev,
            ...snap.data(),
            achievements: snap.data().achievements || [""],
            categories: snap.data().categories || [],
            subCategories: snap.data().subCategories || {},
          }));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTrainer();
  }, []);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const toggleCategory = (cat) => {
    setForm((prev) => {
      const exists = prev.categories.includes(cat);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((c) => c !== cat)
          : [...prev.categories, cat],
        subCategories: exists
          ? Object.fromEntries(
              Object.entries(prev.subCategories).filter(([k]) => k !== cat)
            )
          : prev.subCategories,
      };
    });
  };

  const toggleSubCategory = (cat, sub) => {
    setForm((prev) => {
      const current = prev.subCategories[cat] || [];
      return {
        ...prev,
        subCategories: {
          ...prev.subCategories,
          [cat]: current.includes(sub)
            ? current.filter((s) => s !== sub)
            : [...current, sub],
        },
      };
    });
  };

  const saveProfile = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    setSaving(true);
    await updateDoc(doc(db, "trainers", uid), {
      ...form,
      updatedAt: serverTimestamp(),
    });
    setSaving(false);
    alert("Profile Updated Successfully");
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 text-[#5D3A09]"
    >
      {/* HEADER */}
      <div className="flex items-center gap-3">
       
        <h1 className="text-3xl font-extrabold text-orange-500">
          Edit Trainer Profile 
        </h1>
      </div>

      {/* BASIC INFO */}
      <section className="grid md:grid-cols-2 gap-6 bg-gray-100 rounded-2xl p-6 border border-gray-300">
        {[
          ["trainerName", "Trainer Name"],
          ["profit", "Monthly Profit (₹)"],
          ["experience", "Years of Experience"],
          ["studentsCount", "Total Students"],
        ].map(([name, placeholder]) => (
          <input
            key={name}
            name={name}
            value={form[name]}
            onChange={handleChange}
            placeholder={placeholder}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-400 outline-none"
          />
        ))}
      </section>

      {/* ABOUT */}
      <section className="bg-gray-100 p-6 rounded-2xl border border-gray300 space-y-4">
        <textarea
          name="about"
          value={form.about}
          onChange={handleChange}
          placeholder="About Trainer"
          className="w-full bg-white border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-400 outline-none"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Training Description"
          className="w-full bg-white border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-400 outline-none"
        />
      </section>

      {/* CATEGORIES */}
      <section className="bg-gray-100 p-6 rounded-2xl border border-gray-300">
        <h2 className="font-bold text-orange-500 mb-4">
          Categories & Sub Categories
        </h2>

        {Object.keys(CATEGORY_MAP).map((cat) => (
          <div key={cat} className="mb-4">
            <label className="flex items-center gap-2 font-semibold">
              <input
                type="checkbox"
                className="accent-orange-500"
                checked={form.categories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              {cat}
            </label>

            {form.categories.includes(cat) && (
              <div className="ml-6 mt-2 flex flex-wrap gap-3">
                {CATEGORY_MAP[cat].map((sub) => (
                  <label
                    key={sub}
                    className="bg-white border border-orange-300 rounded-md px-3 py-1.5 text-sm flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      className="accent-orange-500"
                      checked={(form.subCategories[cat] || []).includes(sub)}
                      onChange={() => toggleSubCategory(cat, sub)}
                    />
                    {sub}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>

      {/* FACILITIES */}
      <section className="bg-gray-100 p-6 rounded-2xl border border-gray-300">
        <textarea
          name="facilities"
          value={form.facilities}
          onChange={handleChange}
          placeholder="Facilities Provided (ex: gym, equipment, parking...)"
          className="w-full bg-white border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-400 outline-none"
        />
      </section>

      {/* ACHIEVEMENTS */}
      <section className="bg-gray-100 p-6 rounded-2xl border border-gray-300">
        <h2 className="font-bold flex items-center gap-2 text-gray-500">
          <Award /> Achievements
        </h2>

        {form.achievements.map((a, i) => (
          <div key={i} className="flex gap-2 mt-2">
            <input
              value={a}
              onChange={(e) => {
                const arr = [...form.achievements];
                arr[i] = e.target.value;
                setForm({ ...form, achievements: arr });
              }}
              className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2"
            />
            <Trash2
              className="cursor-pointer text-black-500"
              onClick={() =>
                setForm({
                  ...form,
                  achievements: form.achievements.filter((_, idx) => idx !== i),
                })
              }
            />
          </div>
        ))}

        <button
          onClick={() =>
            setForm({ ...form, achievements: [...form.achievements, ""] })
          }
          className="mt-3 text-gray-500 flex items-center gap-1 font-semibold"
        >
          <Plus size={16} /> Add Achievement
        </button>
      </section>

      {/* TIMINGS */}
      <section className="grid md:grid-cols-2 gap-6 bg-gray-100 p-6 rounded-2xl border border-gray-300">
        <input
          name="timings"
          value={form.timings}
          onChange={handleChange}
          placeholder="Available Timings (ex: 6 AM - 9 PM)"
          className="bg-white border border-gray-300 rounded-lg px-4 py-2"
        />
        <div className="flex items-center gap-2 text-gray-700">
          <MapPin size={18} />
          {form.locationName}
        </div>
      </section>

      {/* SAVE */}
      <div className="flex justify-end">
        <button
          onClick={saveProfile}
          disabled={saving}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl flex items-center gap-2 font-semibold"
        >
          <Save />
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </motion.div>
  );
}
