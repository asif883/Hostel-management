import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../Layout/Dashboard";
import Overview from "../Componets/Overview";
import AllMember from "../Componets/AllMember";
import DailyCost from "../Componets/DailyCost";
import Utility from "../Componets/Utility";
import DailyMeal from "../Componets/DailyMeal";
import DepositMoney from "../Componets/DepositMoney";
import Management from "../Componets/Management";
import Profile from "../Componets/Profile";
import Login from "../Pages/Login";
import Register from "../Pages/Register";

const router = createBrowserRouter([
    {
        path:'/',
        element: <Dashboard/>,
        children:[
            {
                path:'/dashboard/overview',
                element: <Overview/>
            },
            {
                path:'/dashboard/all-member',
                element:<AllMember/>
            },
            {
                path:'/dashboard/daily-cost',
                element:<DailyCost/>
            },
            {
                path: '/dashboard/utility',
                element: <Utility/>
            },
            {
                path: '/dashboard/daily-meal',
                element: <DailyMeal/>
            }
            ,
            {
                path: '/dashboard/deposit-money',
                element: <DepositMoney/>
            }
            ,
            {
                path: '/dashboard/management',
                element: <Management/>
            }
            ,
            {
                path: '/dashboard/profile',
                element: <Profile/>
            }
        ]
    },
    {
        path: '/login',
        element: <Login/>
    }
    ,
    {
        path: '/register',
        element: <Register/>
    }
])

export default router;