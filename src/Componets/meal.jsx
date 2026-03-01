import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { IoAddCircleOutline, IoTrashOutline, IoCloseOutline, IoSaveOutline } from "react-icons/io5";
import { MdEditNote } from "react-icons/md";
import PageTitle from "../SharedItems/PageTitile";

const API_URL = "https://hostel-management-server-ten.vercel.app";

const MEMBERS = ["Asif", "Mamun", "Ebadul", "Moku", "Shobuj", "Milon"];

const MEMBER_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-green-100 text-green-700",
  "bg-yellow-100 text-yellow-700",
  "bg-pink-100 text-pink-700",
  "bg-orange-100 text-orange-700",
];

const SkeletonTable = () => (
  <div className="animate-pulse space-y-3 mt-4">
    <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="h-12 bg-slate-100 rounded-xl w-full"></div>
    ))}
  </div>
);

// ── Update Modal ──
const UpdateModal = ({ day, dayIndex, onClose, onSave }) => {
  const [editData, setEditData] = useState({
    date: day.date,
    meals: [...day.meals],
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (memberIndex, value) => {
    const updated = [...editData.meals];
    updated[memberIndex] = value ? parseFloat(value) : 0;
    setEditData((prev) => ({ ...prev, meals: updated }));
  };

  const rowTotal = editData.meals.reduce((sum, m) => sum + m, 0);

  const handleSave = async () => {
    setSaving(true);
    await onSave(dayIndex, editData);
    setSaving(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#f0f4ff] rounded-t-2xl">
          <div className="flex items-center gap-2">
            <MdEditNote size={22} className="text-[#3b5fc0]" />
            <h3 className="font-bold text-[#3b5fc0] text-lg">Update Meal Entry</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-blue-100 transition-colors text-gray-500 hover:text-gray-800"
          >
            <IoCloseOutline size={22} />
          </button>
        </div>

        {/* Date */}
        <div className="px-6 pt-5 pb-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
            Date
          </label>
          <input
            type="date"
            value={editData.date}
            onChange={(e) => setEditData((prev) => ({ ...prev, date: e.target.value }))}
            className="w-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none rounded-xl px-4 py-2.5 text-sm transition-all"
          />
        </div>

        {/* Meal Inputs Grid */}
        <div className="px-6 py-4 grid grid-cols-2 gap-3">
          {MEMBERS.map((member, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100"
            >
              <span className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${MEMBER_COLORS[i]}`}>
                {member}
              </span>
              <input
                type="number"
                step="0.5"
                min="0"
                value={editData.meals[i]}
                onChange={(e) => handleChange(i, e.target.value)}
                className="w-full text-center border border-gray-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none rounded-lg px-2 py-1 text-sm transition-all"
              />
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between bg-[#f0f4ff] rounded-xl px-4 py-3">
            <span className="text-sm font-semibold text-gray-600">Total Meals</span>
            <span className="text-lg font-bold text-[#3b5fc0]">{rowTotal.toFixed(1)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all text-gray-600 py-2.5 rounded-xl font-semibold text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 bg-[#3b5fc0] hover:bg-[#2f4ea8] active:scale-95 disabled:opacity-60 transition-all text-white py-2.5 rounded-xl font-semibold text-sm"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <IoSaveOutline size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ──
const MealTracker = () => {
  const [loading, setLoading] = useState(true);
  const [meals, setMeals] = useState([]);
  const [savingIndex, setSavingIndex] = useState(null);
  const [deletingAll, setDeletingAll] = useState(false);
  const [updateModal, setUpdateModal] = useState(null); // { index, day }

  const fetchMeals = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/daily-meal`);
      const data = await response.json();
      setMeals(Array.isArray(data.meals) ? data.meals : []);
    } catch (error) {
      console.error("Error fetching meals:", error);
      setMeals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const handleMealChange = (index, memberIndex, value) => {
    const updatedMeals = [...meals];
    updatedMeals[index].meals[memberIndex] = value ? parseFloat(value) : 0;
    setMeals(updatedMeals);
  };

  const saveMeal = async (index) => {
    setSavingIndex(index);
    try {
      const response = await fetch(`${API_URL}/add-meal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(meals[index]),
      });
      if (response.ok) {
        Swal.fire({ title: "Saved!", text: "Meal saved successfully.", icon: "success", confirmButtonColor: "#3b5fc0" });
        fetchMeals();
      }
    } catch {
      Swal.fire("Error", "Failed to save meal.", "error");
    } finally {
      setSavingIndex(null);
    }
  };

  // Modal থেকে update call
  const handleUpdate = async (index, editData) => {
    try {
      const mealId = meals[index]?._id;
      const url = mealId ? `${API_URL}/update-meal/${mealId}` : `${API_URL}/add-meal`;
      const method = mealId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        Swal.fire({ title: "Updated!", text: "Meal updated successfully.", icon: "success", confirmButtonColor: "#3b5fc0" });
        fetchMeals();
      } else {
        Swal.fire("Error", "Failed to update meal.", "error");
      }
    } catch {
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  const deleteAllMeals = () => {
    Swal.fire({
      title: "Delete all meals?",
      text: "This will remove every meal record permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e53e3e",
      cancelButtonColor: "#718096",
      confirmButtonText: "Yes, delete all!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeletingAll(true);
        try {
          const response = await fetch(`${API_URL}/delete-all-meals`, { method: "DELETE" });
          const data = await response.json();
          if (data.success) {
            setMeals([]);
            Swal.fire({ title: "Cleared!", text: "All meals deleted.", icon: "success", confirmButtonColor: "#3b5fc0" });
          } else {
            Swal.fire("Error", "Failed to delete meals.", "error");
          }
        } catch (error) {
          console.error(error);
        } finally {
          setDeletingAll(false);
        }
      }
    });
  };

  const addNewRow = () => {
    const formattedDate = new Date().toISOString().split("T")[0];
    setMeals([{ date: formattedDate, meals: Array(MEMBERS.length).fill(0) }, ...meals]);
  };

  const grandTotal = meals.reduce(
    (total, day) => total + day.meals.reduce((sum, meal) => sum + meal, 0),
    0
  );

  return (
    <div className="px-4 md:px-8 pb-16">
      <PageTitle heading="Meal Tracker" />

      {/* Action Bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={addNewRow}
          className="flex items-center gap-2 bg-[#3b5fc0] hover:bg-[#2f4ea8] active:scale-95 transition-all text-white px-5 py-2.5 rounded-xl font-semibold shadow-md text-sm"
        >
          <IoAddCircleOutline size={18} />
          Add New Day
        </button>

        <button
          onClick={deleteAllMeals}
          disabled={deletingAll || meals.length === 0}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-white px-5 py-2.5 rounded-xl font-semibold text-sm"
        >
          {deletingAll ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <IoTrashOutline size={16} />
          )}
          Delete All
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6"><SkeletonTable /></div>
        ) : meals.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            No meal records yet. Add a new day to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f0f4ff] text-left">
                  <th className="px-4 py-4 font-semibold text-[#3b5fc0] sticky left-0 bg-[#f0f4ff] min-w-[110px]">
                    Date
                  </th>
                  {MEMBERS.map((member, i) => (
                    <th key={i} className="px-3 py-4 font-semibold text-center min-w-[80px]">
                      <span className={`px-2 py-1 rounded-full text-sm font-bold}`}>
                        {member}
                      </span>
                    </th>
                  ))}
                  <th className="px-4 py-4 font-semibold text-[#3b5fc0] text-center min-w-[80px]">Total</th>
                  <th className="px-4 py-4 font-semibold text-[#3b5fc0] text-center min-w-[150px]">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {meals.map((day, index) => (
                  <tr key={index} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 py-3 text-gray-600 font-medium sticky left-0 bg-white">
                      {day.date}
                    </td>
                    {day.meals.map((meal, memberIndex) => (
                      <td key={memberIndex} className="px-3 py-3 text-center">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          className="w-16 text-center border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none rounded-lg px-2 py-1.5 text-sm transition-all"
                          value={meal}
                          onChange={(e) => handleMealChange(index, memberIndex, e.target.value)}
                        />
                      </td>
                    ))}
                    <td className="px-4 py-3 text-center">
                      <span className="font-bold text-[#3b5fc0]">
                        {day.meals.reduce((sum, m) => sum + m, 0).toFixed(1)}
                      </span>
                    </td>
                    {/* Action buttons */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => saveMeal(index)}
                          disabled={savingIndex === index}
                          className="flex items-center justify-center gap-1 bg-[#3b5fc0] hover:bg-[#2f4ea8] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all text-white px-3 py-1.5 rounded-lg text-xs font-semibold min-w-[50px]"
                        >
                          {savingIndex === index ? (
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : "Save"}
                        </button>

                        <button
                          onClick={() => setUpdateModal({ index, day })}
                          className="flex items-center justify-center gap-1 bg-amber-400 hover:bg-amber-500 active:scale-95 transition-all text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
                        >
                          <MdEditNote size={15} />
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr className="bg-[#f0f4ff] font-bold text-sm border-t-2 border-blue-100">
                  <td className="px-4 py-4 text-[#3b5fc0] sticky left-0 bg-[#f0f4ff]">Total</td>
                  {MEMBERS.map((_, memberIndex) => (
                    <td key={memberIndex} className="px-3 py-4 text-center text-gray-700">
                      {meals.reduce((sum, day) => sum + (day.meals[memberIndex] || 0), 0).toFixed(1)}
                    </td>
                  ))}
                  <td className="px-4 py-4 text-center text-[#3b5fc0]">{grandTotal.toFixed(1)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Update Modal */}
      {updateModal && (
        <UpdateModal
          day={updateModal.day}
          dayIndex={updateModal.index}
          onClose={() => setUpdateModal(null)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
};

export default MealTracker;