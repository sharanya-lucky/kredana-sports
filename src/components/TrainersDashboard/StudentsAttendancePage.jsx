import React, { useEffect, useMemo, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Pagination } from "./shared";

const StudentsAttendancePage = () => {
  const user = auth.currentUser;

  // 🔹 Today’s date
  const today = new Date().toISOString().split("T")[0];

  // 🔹 State
  const [selectedDate, setSelectedDate] = useState(today);
  const [trainerUID, setTrainerUID] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [savingStudentId, setSavingStudentId] = useState(null);

  // 🔹 Normalize date utility
  const normalizeDate = (date) => {
    if (!date) return null;

    if (date.seconds) return new Date(date.seconds * 1000).toISOString().split("T")[0];
    if (date instanceof Date) return date.toISOString().split("T")[0];

    return date.split("T")[0];
  };

  // 🔹 Resolve Trainer UID
  useEffect(() => {
    if (!user) return;

    const resolveTrainerUID = async () => {
      const trainerSnap = await getDoc(doc(db, "trainers", user.uid));
      if (trainerSnap.exists()) {
        setTrainerUID(user.uid);
        return;
      }

      const studentSnap = await getDoc(doc(db, "trainerstudents", user.uid));
      if (studentSnap.exists()) setTrainerUID(studentSnap.data().trainerUID);
    };

    resolveTrainerUID();
  }, [user]);

  // 🔹 Reset page on search
  useEffect(() => setCurrentPage(1), [search, selectedDate]);

  // 🔹 Fetch students attendance
  useEffect(() => {
    if (!trainerUID || !selectedDate) return;

    const fetchAttendance = async () => {
      const formattedDate = normalizeDate(selectedDate);
      const docId = `${trainerUID}_${formattedDate}`;
      const snap = await getDoc(doc(db, "trainerstudentsattendance", docId));

      setAttendanceData(snap.exists() ? snap.data().records || {} : {});
    };

    fetchAttendance();
  }, [trainerUID, selectedDate]);

  // 🔹 Fetch students list
  useEffect(() => {
    if (!trainerUID) return;

    const fetchStudents = async () => {
      const trainerSnap = await getDoc(doc(db, "trainers", trainerUID));
      if (!trainerSnap.exists()) {
        setStudents([]);
        setLoading(false);
        return;
      }

      const ids = trainerSnap.data().students || [];
      const list = await Promise.all(
        ids.map(async (id) => {
          const snap = await getDoc(doc(db, "trainerstudents", id));
          return snap.exists() ? { id, ...snap.data() } : null;
        })
      );

      setStudents(list.filter(Boolean));
      setLoading(false);
    };

    fetchStudents();
  }, [trainerUID]);

  // 🔹 Can edit attendance check
  const canEditAttendance = (joinedDate) => {
    const joined = normalizeDate(joinedDate);
    if (!joined) return false;
    if (!selectedDate || selectedDate > today) return false;
    return selectedDate >= joined;
  };

  // 🔹 Attendance block message
  const getBlockMessage = (joinedDate) => {
    const selected = normalizeDate(selectedDate);
    const joined = normalizeDate(joinedDate);
    if (!selected || !joined) return "";

    if (selected < joined) return "⚠️ Attendance cannot be marked before joining date";
    if (selected > today) return "⚠️ Future date attendance is not allowed";
    return "";
  };

  // 🔹 Mark attendance
  const markAttendance = async (studentUID, status, joinedDate) => {
    if (!canEditAttendance(joinedDate)) {
      setMessage(getBlockMessage(joinedDate));
      return;
    }

    try {
      setSavingStudentId(studentUID);
      setMessage("");

      const formattedDate = normalizeDate(selectedDate);
      const docId = `${trainerUID}_${formattedDate}`;

      await setDoc(
        doc(db, "trainerstudentsattendance", docId),
        {
          trainerUID,
          date: formattedDate,
          records: { [studentUID]: status },
        },
        { merge: true }
      );

      setAttendanceData((prev) => ({ ...prev, [studentUID]: status }));
      setMessage("✅ Attendance saved successfully");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update attendance");
    } finally {
      setSavingStudentId(null);
    }
  };

  // 🔹 Filter students by search & join date
  const filteredRows = useMemo(() => {
    return students.filter((s) => {
      const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
      const matchesSearch = fullName.includes(search.toLowerCase());
      const joined = normalizeDate(s.joinedDate);
      const validForDate = !joined || selectedDate >= joined;
      return matchesSearch && validForDate;
    });
  }, [students, search, selectedDate]);

  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRows.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRows, currentPage]);

  if (loading) return <div className="p-6 text-[#3F2A14]">Loading...</div>;

  return (
    <div className="h-full bg-white text-[#3F2A14] p-6 rounded-lg">
      {/* Search */}
      <div className="mb-4">
        <div className="flex items-center bg-gray-100 border border-gray-300 rounded-full px-4 py-2 w-full max-w-md">
          🔍
          <input
            placeholder="Search students by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm w-full ml-2 text-[#3F2A14] placeholder-[#A16207]"
          />
        </div>
      </div>

      {/* Heading + Date */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-extrabold text-orange-500">
          Students Attendance
        </h1>
        <input
          type="date"
          value={selectedDate}
          max={today}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setMessage("");
          }}
          className="bg-orange-500 text-white px-4 py-2 rounded-full"
        />
      </div>

      {message && <div className="mb-3 text-orange-600 font-semibold text-sm">{message}</div>}

      {/* Table */}
     <div className="overflow-x-auto bg-white rounded-lg shadow">
       <div className="grid grid-cols-5 px-4 py-3 bg-[#f9c199] text-black font-semibold">
          <div>Name</div>
          <div>Category</div>
          <div>Joined</div>
          <div className="text-center">Present</div>
          <div className="text-center">Absent</div>
        </div>

        <div className="bg-white text-black">
          {filteredRows.length === 0 ? (
            /* 🔹 NO STUDENTS ASSIGNED */
            <div className="grid grid-cols-5 px-4 py-6 border-t border-orange-200">
              <div className="col-span-5 text-center text-gray-500 font-medium text-sm">
                No students assigned
              </div>
            </div>
          ) : (
            /* 🔹 STUDENT ROWS */
            paginatedRows.map((s) => {
              const todayStatus = attendanceData[s.id];
              const editable = canEditAttendance(s.joinedDate);
              const saving = savingStudentId === s.id;

              return (
                <div
                  key={s.id}
                className="grid grid-cols-5 px-4 py-3 border-b border-gray-200 items-center text-sm hover:bg-gray-100"
                >
                  <div className="font-semibold">
                    {s.firstName} {s.lastName}
                  </div>
                  <div>{s.category || "-"}</div>
                  <div className="text-xs text-gray-500">{s.joinedDate}</div>

                  <div className="flex justify-center">
                    <button
                      disabled={!editable || saving}
                      onClick={() => markAttendance(s.id, "present", s.joinedDate)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${todayStatus === "present"
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-700"
                        }`}
                    >
                      {saving ? "Saving..." : "Present"}
                    </button>
                  </div>

                  <div className="flex justify-center">
                    <button
                      disabled={!editable || saving}
                      onClick={() => markAttendance(s.id, "absent", s.joinedDate)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${todayStatus === "absent"
                          ? "bg-red-500 text-white"
                          : "bg-gray-200 text-gray-700"
                        }`}
                    >
                      {saving ? "Saving..." : "Absent"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </div>
  );
};

export default StudentsAttendancePage;