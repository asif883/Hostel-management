import { useForm } from "react-hook-form";
import { MdDeleteOutline } from "react-icons/md";
import PageTitle from "../SharedItems/PageTitile";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Loading from "./Loading";
const Utility = () => {
    const [total , setTotal] = useState()
    const [loading , setLoading] = useState(true)
    const [utilityCost, setUtilityCost] = useState()

    const {
        handleSubmit,
        register
    } = useForm()
    const handleUtilityData =(data)=>{
        const date = data.date
        const name = data.name
        const cost = parseFloat( data.cost )
        const utilityCost = { date , name ,cost }
        axios.post('https://hostel-management-server-ten.vercel.app/add-utility-cost' , utilityCost)
        .then(res =>{
            if(res.data.insertedId){
                Swal.fire({
                    title: 'Success!',
                    text: 'Daily Cost added Successfully',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                    
                  }); 
                  window.location.reload()
            }
          
        })
    }
    useEffect(()=>{
            fetch('https://hostel-management-server-ten.vercel.app/utility-cost')
            .then( res => res.json())
            .then ( data => {
                setTotal(data.totalCost)
                setUtilityCost(data.utilityCost)
                setLoading(false)
            })
        },[])
        const handleDelete = (id)=>{
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert the user!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
              }).then((result) => {
             
                if(result.isConfirmed){
                    axios.delete(`https://hostel-management-server-ten.vercel.app/utility-cost/${id}`)
                    .then( res =>{
                        if(res.data.deletedCount > 0 ){
                            Swal.fire({
                                title: "Deleted!",
                                text: "Utility cost has been deleted.",
                                icon: "success"
                              });
                         }
                    window.location.reload()
                    })
                }
    
            })   
        }
    return (
        <div className="px-8">
             <PageTitle
                heading='Utility'
             ></PageTitle>
            <form className="flex gap-4 flex-col md:flex-row" onSubmit={handleSubmit(handleUtilityData)}>
                <input className="border border-gray-400 p-3 rounded-xl" placeholder="Date" type="date" {...register('date', {required: true})} />
                <input className="border border-gray-400 p-3 rounded-xl" placeholder="Name of the Cost" type="text" {...register('name', {required: true})} />
                <input className="border border-gray-400 p-3 rounded-xl" placeholder="Cost" type="text" {...register("cost" , {required: true})} />
                <input type="submit" value='Add'  className=" bg-[#4470CC] text-white p-3 rounded-xl"/>
            </form>

            {
                loading ? <Loading/>
                :
                <div className="overflow-x-auto mt-10">
                <table className="table">
                    {/* head */}
                    <thead>
                    <tr className="bg-gray-100 rounded-md text-lg text-gray-800">
                        
                        <th>Date</th>
                        <th>Name</th>
                        <th>Cost</th>
                        <th></th>
                        <th></th>
                        <th>Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/* row 1 */}
                     {
                        utilityCost?.map((utility) => 
                        <tr key={utility?._id} className="font-semibold text-sm md:text-lg">
                        
                            <td>{utility?.date}</td>
                            <td>{utility?.name}</td>
                            <td>{utility?.cost}</td>
                            <td></td>
                            <td></td>
                            <td>
                            <button onClick={()=> handleDelete(utility?._id)}>
                                    <MdDeleteOutline size={24}/>
                            </button>
                            </td>
                       
                        </tr> 
                        )
                     }       
                    </tbody>
                   
                   
                </table>
                <h1 className="text-xl font-semibold text-blue-900 mt-8">Total Cost: {total} tk</h1>
                </div>
            }
        </div>
    );
};

export default Utility;