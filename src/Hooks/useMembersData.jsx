import { useEffect, useState } from "react";

const useMembersData = () => {
    const [ members , setMembers ] = useState([])

    useEffect(()=>{
        fetch('http://localhost:3000/users')
        .then( res => res.json())
        .then( data => setMembers(data))
    }, [])

    return members;
};

export default useMembersData;