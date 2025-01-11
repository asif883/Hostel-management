import { Outlet } from "react-router-dom";
import DashboardNav from "../Componets/DashboardNav";
import { RiMenu2Line } from "react-icons/ri";


const Dashboard = () => {
    return (
        <div>
            <div className="drawer lg:drawer-open">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    
                    <label htmlFor="my-drawer-2" className="btn  drawer-button lg:hidden">
                    <RiMenu2Line size={24}/>
                    </label>
                    <Outlet/>
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="bg-gray-50 min-h-full w-80 p-4">
                      <DashboardNav/>
                    </ul>
                </div>
             </div>
        </div>
    );
};

export default Dashboard;