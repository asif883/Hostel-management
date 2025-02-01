import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import axios from "axios";

const useUserData = () => {
    const {user} = useAuth()
   
    const [ members , setMembers ] = useState({})
    
    useEffect(()=>{
        const fetchData =()=>{
            axios.get(`https://hostel-management-server-ten.vercel.app/users/${user?.email}`)
            .then(res =>{
               setMembers(res.data);
            })
        }
       fetchData()
    }, [user])

    return members;
};

export default useUserData;