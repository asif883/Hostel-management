import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useMembersData from "../Hooks/useMembersData";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { IoSaveOutline, IoArrowBackOutline } from "react-icons/io5";

const BASE_URL = "https://hostel-management-server-ten.vercel.app";

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const members = useMembersData();
  const [submitting, setSubmitting] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const { handleSubmit, register, reset, formState: { errors } } = useForm();

  // Fetch existing data and pre-fill form
  useEffect(() => {
    fetch(`${BASE_URL}/money/${id}`)
      .then((res) => res.json())
      .then((data) => {
        reset({
          name: data.name,
          date: data.date,
          amount: data.amount,
        });
      })
      .catch(() => Swal.fire("Error", "Failed to load deposit data.", "error"))
      .finally(() => setFetchLoading(false));
  }, [id, reset]);

  const handleUpdate = async (data) => {
    setSubmitting(true);
    const updateInfo = {
      name: data.name,
      date: data.date,
      amount: parseFloat(data.amount),
    };

    try {
      const res = await axios.patch(`${BASE_URL}/update/${id}`, updateInfo);
      if (res.data.modifiedCount) {
        Swal.fire({
          title: "Updated!",
          text: "Deposit updated successfully.",
          icon: "success",
          confirmButtonColor: "#1d4ed8",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/dashboard/deposit-money");
      }
    } catch {
      Swal.fire("Error", "Failed to update.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-4 md:px-8 pb-16">
      {/* Back button */}
      <button
        onClick={() => navigate("/dashboard/deposit-money")}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-semibold mt-6 mb-6 transition-colors"
      >
        <IoArrowBackOutline size={18} />
        Back to Deposits
      </button>

      {/* Card */}
      <div
        className="bg-white rounded-2xl border border-slate-100 overflow-hidden max-w-xl"
        style={{ boxShadow: "0 4px 24px -4px rgba(15,23,42,0.08)" }}
      >
        {/* Header */}
        <div
          className="px-6 py-5"
          style={{ background: "linear-gradient(135deg,#1d4ed8 0%,#1e40af 100%)" }}
        >
          <p className="text-blue-200 text-[11px] font-bold tracking-widest uppercase mb-0.5">
            Edit Entry
          </p>
          <h2 className="text-white font-black text-xl">Update Deposit</h2>
        </div>

        {/* Form */}
        {fetchLoading ? (
          <div className="p-6 space-y-5 animate-pulse">
            <div>
              <div className="h-3 bg-slate-200 rounded w-24 mb-2" />
              <div className="h-11 bg-slate-100 rounded-xl" />
            </div>
            <div>
              <div className="h-3 bg-slate-200 rounded w-16 mb-2" />
              <div className="h-11 bg-slate-100 rounded-xl" />
            </div>
            <div>
              <div className="h-3 bg-slate-200 rounded w-20 mb-2" />
              <div className="h-11 bg-slate-100 rounded-xl" />
            </div>
            <div className="h-12 bg-slate-100 rounded-xl" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleUpdate)} className="p-6 flex flex-col gap-5">

            {/* Name */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 tracking-widest uppercase block mb-1.5">
                Member Name
              </label>
              <select
                className="w-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all p-3 rounded-xl outline-none text-slate-800 text-sm font-medium"
                {...register("name", { required: "Name is required" })}
              >
                <option value="" disabled>Choose a Name</option>
                {members?.map((member) => (
                  <option key={member?._id} value={member?.name}>{member?.name}</option>
                ))}
              </select>
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Date */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 tracking-widest uppercase block mb-1.5">
                Date
              </label>
              <input
                type="date"
                className="w-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all p-3 rounded-xl outline-none text-slate-800 text-sm font-medium"
                {...register("date", { required: true })}
              />
            </div>

            {/* Amount */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 tracking-widest uppercase block mb-1.5">
                Amount (tk)
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all p-3 rounded-xl outline-none text-slate-800 text-sm font-medium"
                {...register("amount", { required: "Amount is required" })}
              />
              {errors.amount && <p className="text-red-400 text-xs mt-1">{errors.amount.message}</p>}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => navigate("/dashboard/deposit-money")}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 text-white py-3 rounded-xl font-bold text-sm active:scale-95 disabled:opacity-60 transition-all"
                style={{ background: "linear-gradient(135deg,#1d4ed8,#1e40af)" }}
              >
                {submitting ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><IoSaveOutline size={17} /> Save Changes</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Update;