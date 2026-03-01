import { Outlet } from "react-router-dom";
import DashboardNav from "../Componets/DashboardNav";
import { RiMenu2Line } from "react-icons/ri";
import Loading from "../Componets/Loading";
import useUserData from "../Hooks/useUserData";

const Dashboard = () => {
  const { loading } = useUserData();
  if (loading) return <Loading />;

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-slate-50">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      {/* ── Main Content ── */}
      <div className="drawer-content flex flex-col min-h-screen">

        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-100 sticky top-0 z-20"
          style={{ boxShadow: "0 1px 8px rgba(15,23,42,0.06)" }}>
          <label
            htmlFor="my-drawer-2"
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer transition-all"
          >
            <RiMenu2Line size={20} />
          </label>
          <span className="font-black text-slate-800 text-base">Royal Bachelor</span>
        </div>

        {/* Page content */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>

      {/* ── Sidebar ── */}
      <div className="drawer-side z-30">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay" />
        <div className="min-h-full w-72 bg-white border-r border-slate-100"
          style={{ boxShadow: "2px 0 16px rgba(15,23,42,0.06)" }}>
          <DashboardNav />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;