import { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import useMembersData from "../Hooks/useMembersData";
import PageTitle from "../SharedItems/PageTitile";
import Swal from "sweetalert2";
import axios from "axios";

const BASE_URL = "https://hostel-management-server-ten.vercel.app";

const AVATAR_BG = ["#1d4ed8","#0369a1","#0f766e","#7c3aed","#b45309","#be185d"];

const ROLE_BADGE = {
  admin:   "bg-purple-100 text-purple-700",
  manager: "bg-blue-100 text-blue-700",
  member:  "bg-slate-100 text-slate-500",
};

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-slate-200 flex-shrink-0" />
        <div className="h-4 bg-slate-200 rounded w-28" />
      </div>
    </td>
    <td className="px-5 py-4"><div className="h-6 bg-slate-200 rounded-full w-16" /></td>
    <td className="px-5 py-4"><div className="h-8 bg-slate-200 rounded-xl w-28" /></td>
    <td className="px-5 py-4"><div className="h-8 bg-slate-200 rounded-xl w-28" /></td>
    <td className="px-5 py-4 text-center"><div className="h-8 w-8 bg-slate-200 rounded-full mx-auto" /></td>
  </tr>
);

const Management = () => {
  const members = useMembersData();
  const [loadingId, setLoadingId] = useState(null);
  const loading = !members;

  const confirm = (title, text) =>
    Swal.fire({
      title, text, icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1d4ed8",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, do it!",
    });

  const success = (text) =>
    Swal.fire({ title: "Done!", text, icon: "success", confirmButtonColor: "#1d4ed8", timer: 1500, showConfirmButton: false });

  const handleDelete = async (id) => {
    const result = await confirm("Delete member?", "This cannot be undone!");
    if (!result.isConfirmed) return;
    setLoadingId(id + "_delete");
    try {
      const res = await axios.delete(`${BASE_URL}/delete-user/${id}`);
      if (res.data.deletedCount > 0) success("Member has been deleted.");
      window.location.reload();
    } finally { setLoadingId(null); }
  };

  const handleMakeAdmin = async (id) => {
    const result = await confirm("Make Admin?", "This user will get full access.");
    if (!result.isConfirmed) return;
    setLoadingId(id + "_admin");
    try {
      const res = await axios.patch(`${BASE_URL}/users/admin/${id}`);
      if (res.data.modifiedCount > 0) success("Member is now an Admin.");
      window.location.reload();
    } finally { setLoadingId(null); }
  };

  const handleMakeManager = async (id) => {
    const result = await confirm("Make Manager?", "This user will get manager access.");
    if (!result.isConfirmed) return;
    setLoadingId(id + "_manager");
    try {
      const res = await axios.patch(`${BASE_URL}/users/manager/${id}`);
      if (res.data.modifiedCount > 0) success("Member is now a Manager.");
      window.location.reload();
    } finally { setLoadingId(null); }
  };

  const handleManagerRemove = async (id) => {
    const result = await confirm("Remove Manager?", "This user will lose manager access.");
    if (!result.isConfirmed) return;
    setLoadingId(id + "_remove");
    try {
      const res = await axios.patch(`${BASE_URL}/users/manager/remove/${id}`);
      if (res.data.modifiedCount > 0) success("Manager role removed.");
      window.location.reload();
    } finally { setLoadingId(null); }
  };

  const Spinner = () => (
    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
  );

  return (
    <div className="px-4 md:px-8 pb-16">
      <PageTitle heading="Management" />

      <div
        className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
        style={{ boxShadow: "0 4px 24px -4px rgba(15,23,42,0.08)" }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <p className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">Members</p>
          {!loading && (
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
              {members.length} total
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-5 py-4 text-left text-[11px] font-bold text-slate-400 tracking-widest uppercase">Member</th>
                <th className="px-5 py-4 text-left text-[11px] font-bold text-slate-400 tracking-widest uppercase">Role</th>
                <th className="px-5 py-4 text-center text-[11px] font-bold text-slate-400 tracking-widest uppercase">Admin</th>
                <th className="px-5 py-4 text-center text-[11px] font-bold text-slate-400 tracking-widest uppercase">Manager</th>
                <th className="px-5 py-4 text-center text-[11px] font-bold text-slate-400 tracking-widest uppercase">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-14 text-slate-400">No members found.</td>
                </tr>
              ) : (
                members.map((member, idx) => (
                  <tr key={member?._id} className="hover:bg-blue-50/20 transition-colors">

                    {/* Name + Avatar */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                          style={{ background: AVATAR_BG[idx % AVATAR_BG.length] }}
                        >
                          {member?.name?.charAt(0)?.toUpperCase()}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-800">{member?.name}</p>
                          <p className="text-xs text-slate-400 truncate max-w-[150px]">{member?.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role badge */}
                    <td className="px-5 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${ROLE_BADGE[member?.role] ?? ROLE_BADGE.member}`}>
                        {member?.role ?? "member"}
                      </span>
                    </td>

                    {/* Make Admin */}
                    <td className="px-5 py-4 text-center">
                      {member?.role === "admin" ? (
                        <span className="text-xs text-purple-400 font-semibold">Admin ✓</span>
                      ) : (
                        <button
                          onClick={() => handleMakeAdmin(member?._id)}
                          disabled={!!loadingId}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-purple-600 border border-purple-200 hover:bg-purple-50 disabled:opacity-40 active:scale-95 transition-all flex items-center gap-1 mx-auto"
                        >
                          {loadingId === member?._id + "_admin" ? <Spinner /> : "Make Admin"}
                        </button>
                      )}
                    </td>

                    {/* Make / Remove Manager */}
                    <td className="px-5 py-4 text-center">
                      {member?.role === "manager" ? (
                        <button
                          onClick={() => handleManagerRemove(member?._id)}
                          disabled={!!loadingId}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-500 border border-red-200 hover:bg-red-50 disabled:opacity-40 active:scale-95 transition-all flex items-center gap-1 mx-auto"
                        >
                          {loadingId === member?._id + "_remove" ? <Spinner /> : "Remove"}
                        </button>
                      ) : member?.role === "admin" ? (
                        <span className="text-xs text-slate-300 font-semibold">—</span>
                      ) : (
                        <button
                          onClick={() => handleMakeManager(member?._id)}
                          disabled={!!loadingId}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 border border-blue-200 hover:bg-blue-50 disabled:opacity-40 active:scale-95 transition-all flex items-center gap-1 mx-auto"
                        >
                          {loadingId === member?._id + "_manager" ? <Spinner /> : "Make Manager"}
                        </button>
                      )}
                    </td>

                    {/* Delete */}
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => handleDelete(member?._id)}
                        disabled={!!loadingId}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full text-red-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-40 transition-all"
                      >
                        {loadingId === member?._id + "_delete" ? <Spinner /> : <MdDeleteOutline size={20} />}
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Management;