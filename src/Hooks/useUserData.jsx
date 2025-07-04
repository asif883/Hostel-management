import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import axios from "axios";

const useUserData = () => {
    const {user} = useAuth()
   
    const [ member , setMembers ] = useState({})
    const [ loading , setLoading ] = useState(true)
    
    useEffect(()=>{
        const fetchData =()=>{
            axios.get(`https://hostel-management-server-ten.vercel.app/users/${user?.email}`)
            .then(res =>{
               setMembers(res.data);
               setLoading(false)
            })
        }
       fetchData()
    }, [user])

    return { member , loading }
};

export default useUserData;