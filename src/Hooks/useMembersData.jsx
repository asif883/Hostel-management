import { useEffect, useState } from "react";

const useMembersData = () => {
    const [ members , setMembers ] = useState([])

    useEffect(()=>{
        fetch('https://hostel-management-server-ten.vercel.app/users')
        .then( res => res.json())
        .then( data => setMembers(data))
    }, [])

    return members;
};

export default useMembersData;