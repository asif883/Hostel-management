import { NavLink } from "react-router-dom";
import { LuLayoutDashboard, LuUsersRound } from "react-icons/lu";
import { FaBasketShopping } from "react-icons/fa6";
import { IoFastFoodOutline } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import { PiHandDepositBold } from "react-icons/pi";
import { BsMotherboard } from "react-icons/bs";
import { MdOutlineManageAccounts } from "react-icons/md";
import useAuth from "../Hooks/useAuth";
import useUserData from "../Hooks/useUserData";

const normalRoutes = [
  { id: 1, label: "Overview",      icon: <LuLayoutDashboard size={17}/>, link: "/dashboard/overview" },
  { id: 2, label: "All Member",    icon: <LuUsersRound size={17}/>,      link: "/dashboard/all-member" },
];

const managerRoutes = [
  { id: 1, label: "Overview",      icon: <LuLayoutDashboard size={17}/>, link: "/dashboard/overview" },
  { id: 2, label: "All Member",    icon: <LuUsersRound size={17}/>,      link: "/dashboard/all-member" },
  { id: 3, label: "Daily Cost",    icon: <FaBasketShopping size={17}/>,  link: "/dashboard/daily-cost" },
  { id: 4, label: "Utility Cost",  icon: <BsMotherboard size={17}/>,     link: "/dashboard/utility" },
  { id: 5, label: "Daily Meal",    icon: <IoFastFoodOutline size={17}/>, link: "/dashboard/daily-meal" },
  { id: 6, label: "Deposit Money", icon: <PiHandDepositBold size={17}/>, link: "/dashboard/deposit-money" },
];

const adminRoutes = [
  ...managerRoutes,
  { id: 7, label: "Management", icon: <MdOutlineManageAccounts size={17}/>, link: "/dashboard/management" },
];

const routesByRole = {
  admin:   adminRoutes,
  manager: managerRoutes,
  member:  normalRoutes,
};

const ROLE_BADGE = {
  admin:   "bg-purple-100 text-purple-700",
  manager: "bg-blue-100 text-blue-700",
  member:  "bg-slate-100 text-slate-500",
};

const DashboardNav = () => {
  const { member } = useUserData();
  const { logout } = useAuth();
  const role = member?.role ?? "member";
  const routes = routesByRole[role] ?? normalRoutes;

  return (
    <div
      className="h-full flex flex-col bg-white border-r border-slate-100"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;900&display=swap');`}</style>

      {/* ── Brand ── */}
      <div className="px-6 py-6 border-b border-slate-100">
        <p className="text-center text-slate-800 font-black text-2xl tracking-tight leading-none">
          Royal Bachelor
        </p>
      </div>

      {/* ── Role badge ── */}
      <div className="px-6 pt-5 pb-1">
        <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full capitalize ${ROLE_BADGE[role]}`}>
          {role}
        </span>
      </div>

      {/* ── Nav Links ── */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {routes.map((route) => (
          <NavLink
            key={route.id}
            to={route.link}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? "bg-[#f0f4ff] text-[#1d4ed8]"
                  : "text-slate-800 hover:bg-slate-50 hover:text-slate-800"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? "text-[#1d4ed8]" : "text-slate-400"}>
                  {route.icon}
                </span>
                {route.label}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#1d4ed8]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Logout ── */}
      <div className="px-3 pb-6 border-t border-slate-100 pt-3">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-500 w-full transition-all"
        >
          <CiLogout size={17} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardNav;