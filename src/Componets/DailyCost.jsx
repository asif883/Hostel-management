import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { MdDeleteOutline } from "react-icons/md";
import { IoAddCircleOutline, IoTrashOutline } from "react-icons/io5";
import { TbCurrencyTaka } from "react-icons/tb";
import Swal from "sweetalert2";
import PageTitle from "../SharedItems/PageTitile";

const BASE_URL = "https://hostel-management-server-ten.vercel.app";

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-5 py-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
    <td className="px-5 py-4"><div className="h-4 bg-slate-200 rounded w-16"></div></td>
    <td className="px-5 py-4 text-center"><div className="h-6 w-6 bg-slate-200 rounded-full mx-auto"></div></td>
  </tr>
);

const DailyCost = () => {
  const [total, setTotal] = useState(0);
  const [dailyCost, setDailyCost] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingAll, setDeletingAll] = useState(false);

  const { handleSubmit, register, reset } = useForm();

  const fetchData = useCallback(() => {
    setLoading(true);
    fetch(`${BASE_URL}/daily-cost`)
      .then((res) => res.json())
      .then((data) => {
        setTotal(data.totalCost ?? 0);
        // newest first
        setDailyCost((data.dailyCost ?? []).slice().reverse());
      })
      .catch(() => Swal.fire("Error", "Failed to load data.", "error"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleData = async (data) => {
    setSubmitting(true);
    const newCost = { date: data.date, cost: parseFloat(data.cost) };

    try {
      const res = await axios.post(`${BASE_URL}/add-daily-cost`, newCost);
      if (res.data.insertedId) {
        Swal.fire({
          title: "Added!",
          text: "Daily cost added successfully.",
          icon: "success",
          confirmButtonText: "Ok",
          confirmButtonColor: "#3b5fc0",
        });
        // prepend so newest is first
        setDailyCost((prev) => [{ ...newCost, _id: res.data.insertedId }, ...prev]);
        setTotal((prev) => prev + newCost.cost);
        reset();
      }
    } catch {
      Swal.fire("Error", "Failed to add cost.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e53e3e",
      cancelButtonColor: "#718096",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeletingId(id);
        try {
          const res = await axios.delete(`${BASE_URL}/daily-cost/${id}`);
          if (res.data.deletedCount > 0) {
            const deletedCost = dailyCost.find((item) => item._id === id)?.cost || 0;
            setDailyCost((prev) => prev.filter((item) => item._id !== id));
            setTotal((prev) => prev - deletedCost);
            Swal.fire({ title: "Deleted!", text: "Cost removed.", icon: "success", confirmButtonColor: "#3b5fc0" });
          }
        } catch {
          Swal.fire("Error", "Failed to delete.", "error");
        } finally {
          setDeletingId(null);
        }
      }
    });
  };

  const handleDeleteAll = () => {
    Swal.fire({
      title: "Delete ALL costs?",
      text: "This will remove every entry permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e53e3e",
      cancelButtonColor: "#718096",
      confirmButtonText: "Yes, delete all!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeletingAll(true);
        try {
          const res = await axios.delete(`${BASE_URL}/delete-all-cost`);
          if (res.data.deletedCount > 0) {
            setDailyCost([]);
            setTotal(0);
            Swal.fire({ title: "Cleared!", text: "All costs removed.", icon: "success", confirmButtonColor: "#3b5fc0" });
          }
        } catch {
          Swal.fire("Error", "Failed to delete all.", "error");
        } finally {
          setDeletingAll(false);
        }
      }
    });
  };

  return (
    <div className="px-4 md:px-8 pb-16">
      <PageTitle heading="Daily Cost" />

      {/* ── Form Card ── */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-8">
        <h2 className="text-base font-semibold text-gray-600 mb-4 tracking-wide uppercase">
          Add New Entry
        </h2>
        <form
          className="flex flex-col md:flex-row gap-3"
          onSubmit={handleSubmit(handleData)}
        >
          <input
            className="flex-1 border border-gray-300 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all p-3 rounded-xl outline-none text-gray-700 placeholder-gray-400"
            placeholder="Date"
            type="date"
            {...register("date", { required: true })}
          />
          <input
            className="flex-1 border border-gray-300 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all p-3 rounded-xl outline-none text-gray-700 placeholder-gray-400"
            placeholder="Cost (tk)"
            type="number"
            step="0.01"
            {...register("cost", { required: true })}
          />
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 bg-[#3b5fc0] hover:bg-[#2f4ea8] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all text-white px-6 py-3 rounded-xl font-semibold shadow-md min-w-[100px]"
          >
            {submitting ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <IoAddCircleOutline size={20} />
                Add
              </>
            )}
          </button>
        </form>
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="bg-[#f0f4ff] text-[#3b5fc0] text-left">
                <th className="px-5 py-4 font-semibold">Date</th>
                <th className="px-5 py-4 font-semibold">Cost (tk)</th>
                <th className="px-5 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : dailyCost.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-12 text-gray-400">
                    No daily costs added yet.
                  </td>
                </tr>
              ) : (
                dailyCost.map((cost) => (
                  <tr key={cost?._id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-5 py-4 text-gray-600">{cost?.date}</td>
                    <td className="px-5 py-4 font-medium text-gray-800">{cost?.cost} tk</td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => handleDelete(cost?._id)}
                        disabled={deletingId === cost?._id}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full text-red-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-40 transition-all"
                      >
                        {deletingId === cost?._id ? (
                          <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <MdDeleteOutline size={20} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Footer ── */}
        {!loading && (
          <div className="flex items-center justify-between px-6 py-4 bg-[#f0f4ff] border-t border-blue-100">
            <button
              onClick={handleDeleteAll}
              disabled={deletingAll || dailyCost.length === 0}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-white px-4 py-2 rounded-xl text-sm font-semibold"
            >
              {deletingAll ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <IoTrashOutline size={16} />
              )}
              Delete All
            </button>

            <div className="flex items-center gap-2">
              <TbCurrencyTaka size={22} className="text-[#3b5fc0]" />
              <span className="text-lg font-bold text-[#3b5fc0]">
                Total: {total} tk
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyCost;