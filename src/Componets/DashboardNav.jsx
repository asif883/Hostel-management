import { NavLink } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaBasketShopping  } from "react-icons/fa6";
// import { CgProfile } from "react-icons/cg";
import { IoFastFoodOutline } from "react-icons/io5";
// import { MdOutlineManageAccounts } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import { LuUsersRound } from "react-icons/lu";
import { PiHandDepositBold } from "react-icons/pi";
import { BsMotherboard } from "react-icons/bs";
import '../CSS/dashNav.css';
import useAuth from "../Hooks/useAuth";


const Routes = [
  {
    id: 1,
    label: "Overview",
    icon: <LuLayoutDashboard />,
    link: "/dashboard/overview",
  },
  {
    id: 2,
    label: "All Member",
    icon: < LuUsersRound/>,
    link: "/dashboard/all-member",
  },
 
  {
    id: 3,
    label: "Daily Cost",
    icon: <FaBasketShopping/>,
    link: "/dashboard/daily-cost",
  },
  {
    id: 5,
    label: "Utility Cost",
    icon: <BsMotherboard/>,
    link: "/dashboard/utility",
  },
  {
    id: 4,
    label: "Daily Meal",
    icon: <IoFastFoodOutline/>,
    link: "/dashboard/daily-meal",
  },
  {
    id: 7,
    label: "Deposit Money",
    icon: <PiHandDepositBold/>,
    link: "/dashboard/deposit-money",
  },
  // {
  //   id: 6,
  //   label: "Profile",
  //   icon: <CgProfile size={18}/>,
  //   link: "/dashboard/profile",
  // },
  // {
  //   id: 8,
  //   label: "Management",
  //   icon: <MdOutlineManageAccounts/>,
  //   link: "/dashboard/management",
  // },
];

const DashboardNav = () => {
  const { logout }= useAuth()

  const handleLogout =()=>{
    logout()
  }
  return (
    <div className="p-4">
      <div className="text-center border-b border-gray-300 pb-4">
        <p className="text-center text-3xl font-bold text-gray-800 ">
        Royal Bachelor
        </p>
      </div>
      <div className="py-6 space-y-3 ">
        {Routes.map((route) => (
          <NavLink
            className="flex items-center gap-2 text-[#444546] font-semibold border border-gray-300 rounded-xl px-5 py-2"
            to={route.link}
            key={route.id}
          >
            {route.icon && <span>{route.icon}</span>}
            {route.label}
          </NavLink>
        ))}
         <button onClick={()=> handleLogout()} className="flex items-center gap-2 text-[#444546] font-semibold border border-gray-300 rounded-xl px-5 py-2 w-full">
          <CiLogout/>  Logout
         </button>
      </div>
    </div>
  );
};

export default DashboardNav;