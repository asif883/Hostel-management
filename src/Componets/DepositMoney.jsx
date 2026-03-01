import { useForm } from "react-hook-form";
import PageTitle from "../SharedItems/PageTitile";
import useMembersData from "../Hooks/useMembersData";
import axios from "axios";
import Swal from "sweetalert2";
import { useEffect, useState, useCallback } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { GrDocumentUpdate } from "react-icons/gr";
import { IoAddCircleOutline, IoTrashOutline } from "react-icons/io5";
import { TbCurrencyTaka } from "react-icons/tb";
import { Link } from "react-router-dom";

const BASE_URL = "https://hostel-management-server-ten.vercel.app";

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-5 py-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
    <td className="px-5 py-4"><div className="h-4 bg-slate-200 rounded w-28"></div></td>
    <td className="px-5 py-4"><div className="h-4 bg-slate-200 rounded w-16"></div></td>
    <td className="px-5 py-4 text-center"><div className="h-6 w-6 bg-slate-200 rounded-full mx-auto"></div></td>
    <td className="px-5 py-4 text-center"><div className="h-6 w-6 bg-slate-200 rounded-full mx-auto"></div></td>
  </tr>
);

const DepositMoney = () => {
  const members = useMembersData();
  const [loading, setLoading] = useState(true);
  const [allMoney, setAllMoney] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingAll, setDeletingAll] = useState(false);

  const { handleSubmit, register, reset, formState: { errors } } = useForm();

  const fetchData = useCallback(() => {
    setLoading(true);
    fetch(`${BASE_URL}/deposit-money`)
      .then((res) => res.json())
      .then((data) => setAllMoney(data))
      .catch(() => Swal.fire("Error", "Failed to load data.", "error"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDeposit = async (data) => {
    setSubmitting(true);
    const depositMoney = {
      name: data.name,
      date: data.date,
      amount: parseFloat(data.amount),
    };
    try {
      const res = await axios.post(`${BASE_URL}/add-money`, depositMoney);
      if (res.data.insertedId) {
        Swal.fire({ title: "Added!", text: "Deposit added successfully.", icon: "success", confirmButtonColor: "#1d4ed8", timer: 1500, showConfirmButton: false });
        reset();
        setAllMoney((prev) => [{ ...depositMoney, _id: res.data.insertedId }, ...prev]);
      }
    } catch {
      Swal.fire("Error", "Failed to add deposit.", "error");
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
          const res = await axios.delete(`${BASE_URL}/money/${id}`);
          if (res.data.deletedCount > 0) {
            setAllMoney((prev) => prev.filter((m) => m._id !== id));
            Swal.fire({ title: "Deleted!", icon: "success", confirmButtonColor: "#1d4ed8", timer: 1500, showConfirmButton: false });
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
      title: "Delete all deposits?",
      text: "This will remove every deposit permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e53e3e",
      cancelButtonColor: "#718096",
      confirmButtonText: "Yes, delete all!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeletingAll(true);
        try {
          const res = await axios.delete(`${BASE_URL}/delete-all-money`);
          if (res.data.deletedCount > 0) {
            setAllMoney([]);
            Swal.fire({ title: "Cleared!", text: "All deposits removed.", icon: "success", confirmButtonColor: "#1d4ed8", timer: 1500, showConfirmButton: false });
          }
        } catch {
          Swal.fire("Error", "Failed to delete all.", "error");
        } finally {
          setDeletingAll(false);
        }
      }
    });
  };

  const totalDeposit = allMoney.reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0);

  return (
    <div className="px-4 md:px-8 pb-16">
      <PageTitle heading="Deposit Money" />

      {/* ── Form Card ── */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 mb-8"
        style={{ boxShadow: "0 4px 24px -4px rgba(15,23,42,0.08)" }}>
        <h2 className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-4">
          Add New Deposit
        </h2>
        <form className="flex flex-col md:flex-row gap-3" onSubmit={handleSubmit(handleDeposit)}>
          <div className="flex-1">
            <select
              className="w-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all p-3 rounded-xl outline-none text-slate-700 text-sm"
              defaultValue=""
              {...register("name", { required: true })}
            >
              <option value="" disabled>Choose a Name</option>
              {members?.map((member) => (
                <option key={member?._id} value={member?.name}>{member?.name}</option>
              ))}
            </select>
            {errors.name && <p className="text-red-400 text-xs mt-1">Name is required</p>}
          </div>

          <input
            className="flex-1 border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all p-3 rounded-xl outline-none text-slate-700 text-sm"
            placeholder="Date"
            type="date"
            {...register("date", { required: true })}
          />

          <input
            className="flex-1 border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all p-3 rounded-xl outline-none text-slate-700 text-sm"
            placeholder="Amount (tk)"
            type="number"
            step="0.01"
            {...register("amount", { required: true })}
          />

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 text-white px-6 py-3 rounded-xl font-bold text-sm active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200 min-w-[100px]"
            style={{ background: "linear-gradient(135deg,#1d4ed8,#1e40af)" }}
          >
            {submitting ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <><IoAddCircleOutline size={18} />Add</>
            )}
          </button>
        </form>
      </div>

      {/* ── Delete All Button ── */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDeleteAll}
          disabled={deletingAll || allMoney.length === 0}
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

      {/* ── Table Card ── */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 4px 24px -4px rgba(15,23,42,0.08)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-5 py-4 text-left text-[11px] font-bold text-slate-400 tracking-widest uppercase">Date</th>
                <th className="px-5 py-4 text-left text-[11px] font-bold text-slate-400 tracking-widest uppercase">Name</th>
                <th className="px-5 py-4 text-left text-[11px] font-bold text-slate-400 tracking-widest uppercase">Amount</th>
                <th className="px-5 py-4 text-center text-[11px] font-bold text-slate-400 tracking-widest uppercase">Delete</th>
                <th className="px-5 py-4 text-center text-[11px] font-bold text-slate-400 tracking-widest uppercase">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : allMoney.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-14 text-slate-400">
                    <p className="text-3xl mb-2">💰</p>
                    <p className="font-medium">No deposits yet.</p>
                  </td>
                </tr>
              ) : (
                allMoney.map((money) => (
                  <tr key={money?._id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-5 py-4 text-slate-500 font-medium">{money?.date}</td>
                    <td className="px-5 py-4 font-semibold text-slate-700">{money?.name}</td>
                    <td className="px-5 py-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-sm font-bold text-blue-700 bg-[#f0f4ff]">
                        {money?.amount} tk
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => handleDelete(money?._id)}
                        disabled={deletingId === money?._id}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full text-red-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-40 transition-all"
                      >
                        {deletingId === money?._id ? (
                          <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <MdDeleteOutline size={20} />
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <Link to={`/dashboard/update/${money?._id}`}>
                        <button className="inline-flex items-center justify-center w-9 h-9 rounded-full text-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-all">
                          <GrDocumentUpdate size={16} />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer total */}
        {!loading && allMoney.length > 0 && (
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-[#f0f4ff]">
            <TbCurrencyTaka size={20} className="text-blue-700" />
            <span className="text-blue-700 font-black text-base">
              Total: {totalDeposit} tk
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositMoney;