import { useForm } from "react-hook-form";
import { MdDeleteOutline } from "react-icons/md";
import { IoAddCircleOutline, IoTrashOutline } from "react-icons/io5";
import { TbCurrencyTaka } from "react-icons/tb";
import PageTitle from "../SharedItems/PageTitile";
import { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const BASE_URL = "https://hostel-management-server-ten.vercel.app";

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-5 py-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
    <td className="px-5 py-4"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
    <td className="px-5 py-4"><div className="h-4 bg-slate-200 rounded w-16"></div></td>
    <td className="px-5 py-4 text-center"><div className="h-6 w-6 bg-slate-200 rounded-full mx-auto"></div></td>
  </tr>
);

const Utility = () => {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [utilityCost, setUtilityCost] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingAll, setDeletingAll] = useState(false);

  const { handleSubmit, register, reset } = useForm();

  const fetchData = useCallback(() => {
    setLoading(true);
    fetch(`${BASE_URL}/utility-cost`)
      .then((res) => res.json())
      .then((data) => {
        setTotal(data.totalCost ?? 0);
        setUtilityCost(data.utilityCost ?? []);
      })
      .catch(() => Swal.fire("Error", "Failed to load utility data.", "error"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleUtilityData = async (data) => {
    setSubmitting(true);
    const utilityCostData = {
      date: data.date,
      name: data.name,
      cost: parseFloat(data.cost),
    };
    try {
      const res = await axios.post(`${BASE_URL}/add-utility-cost`, utilityCostData);
      if (res.data.insertedId) {
        Swal.fire({ title: "Added!", text: "Utility cost added successfully.", icon: "success", confirmButtonColor: "#3b5fc0", timer: 1500, showConfirmButton: false });
        reset();
        fetchData();
      }
    } catch {
      Swal.fire("Error", "Failed to add utility cost.", "error");
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
          const res = await axios.delete(`${BASE_URL}/utility-cost/${id}`);
          if (res.data.deletedCount > 0) {
            Swal.fire({ title: "Deleted!", icon: "success", confirmButtonColor: "#3b5fc0", timer: 1500, showConfirmButton: false });
            fetchData();
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
      title: "Delete all utility costs?",
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
          const res = await axios.delete(`${BASE_URL}/delete-all-utility`);
          if (res.data.deletedCount > 0) {
            setUtilityCost([]);
            setTotal(0);
            Swal.fire({ title: "Cleared!", text: "All utility costs removed.", icon: "success", confirmButtonColor: "#3b5fc0", timer: 1500, showConfirmButton: false });
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
      <PageTitle heading="Utility Costs" />

      {/* ── Form Card ── */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-8">
        <h2 className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-4">
          Add New Expense
        </h2>
        <form className="flex flex-col md:flex-row gap-3" onSubmit={handleSubmit(handleUtilityData)}>
          <input
            className="flex-1 border border-gray-300 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all p-3 rounded-xl outline-none text-gray-700 placeholder-gray-400 text-sm"
            placeholder="Date"
            type="date"
            {...register("date", { required: true })}
          />
          <input
            className="flex-1 border border-gray-300 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all p-3 rounded-xl outline-none text-gray-700 placeholder-gray-400 text-sm"
            placeholder="Name of the cost"
            type="text"
            {...register("name", { required: true })}
          />
          <input
            className="flex-1 border border-gray-300 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all p-3 rounded-xl outline-none text-gray-700 placeholder-gray-400 text-sm"
            placeholder="Amount (tk)"
            type="number"
            step="0.01"
            {...register("cost", { required: true })}
          />
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 bg-[#3b5fc0] hover:bg-[#2f4ea8] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md min-w-[100px]"
          >
            {submitting ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <><IoAddCircleOutline size={18} />Add</>
            )}
          </button>
        </form>
      </div>

      {/* ── Delete All ── */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDeleteAll}
          disabled={deletingAll || utilityCost.length === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
        >
          {deletingAll ? (
            <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <IoTrashOutline size={16} />
          )}
          Delete All
        </button>
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-5 py-4 text-left text-[11px] font-bold text-slate-400 tracking-widest uppercase">Date</th>
                <th className="px-5 py-4 text-left text-[11px] font-bold text-slate-400 tracking-widest uppercase">Name</th>
                <th className="px-5 py-4 text-left text-[11px] font-bold text-slate-400 tracking-widest uppercase">Cost (tk)</th>
                <th className="px-5 py-4 text-center text-[11px] font-bold text-slate-400 tracking-widest uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : utilityCost.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-gray-400">
                    No utility costs added yet.
                  </td>
                </tr>
              ) : (
                utilityCost.map((utility) => (
                  <tr key={utility?._id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-5 py-4 text-gray-500 font-medium">{utility?.date}</td>
                    <td className="px-5 py-4 font-semibold text-gray-800">{utility?.name}</td>
                    <td className="px-5 py-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-sm font-bold text-blue-700 bg-[#f0f4ff]">
                        {utility?.cost} tk
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => handleDelete(utility?._id)}
                        disabled={deletingId === utility?._id}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full text-red-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-40 transition-all"
                      >
                        {deletingId === utility?._id ? (
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

        {/* Total footer */}
        {!loading && (
          <div className="flex items-center justify-end gap-2 px-6 py-4 bg-[#f0f4ff] border-t border-blue-100">
            <TbCurrencyTaka size={22} className="text-[#3b5fc0]" />
            <span className="text-lg font-bold text-[#3b5fc0]">
              Total: {total} tk
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Utility;