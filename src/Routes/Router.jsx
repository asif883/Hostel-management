import Dashboard from "../Layout/Dashboard";
import Overview from "../Componets/Overview";
import AllMember from "../Componets/AllMember";
import DailyCost from "../Componets/DailyCost";
import Utility from "../Componets/Utility";
import DepositMoney from "../Componets/DepositMoney";
import Management from "../Componets/Management";
import Profile from "../Componets/Profile";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import PrivateRoute from "./PrivateRoute";
import MealTracker from "../Componets/meal";

import { createHashRouter } from "react-router-dom"; 
import Update from "../Componets/Update";
const router = createHashRouter([
    {
        path: '/',
        element: <PrivateRoute><Dashboard/></PrivateRoute>,
        children: [
            { path: '/dashboard/overview', element: <Overview/> },
            { path: '/dashboard/all-member', element: <AllMember/> },
            { path: '/dashboard/daily-cost', element: <DailyCost/> },
            { path: '/dashboard/utility', element: <Utility/> },
            { path: '/dashboard/daily-meal', element: <MealTracker/> },
            { path: '/dashboard/deposit-money', element: <DepositMoney/> },
            { path: '/dashboard/management', element: <Management/> },
            { path: '/dashboard/profile', element: <Profile/> },
            { path: '/dashboard/update/:id', element: <Update/> }
        ]
    },
    { path: '/login', element: <Login/> },
    { path: '/register', element: <Register/> }
]);

export default router;