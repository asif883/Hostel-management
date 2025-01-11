import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../Layout/Dashboard";
import Overview from "../Componets/Overview";

const router = createBrowserRouter([
    {
        path:'/',
        element: <Dashboard/>,
        children:[
            {
                path:'overview',
                element: <Overview/>
            }
        ]
    }
])

export default router;