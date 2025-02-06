import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { MdDeleteOutline } from "react-icons/md";
import Swal from "sweetalert2";
import PageTitle from "../SharedItems/PageTitile";
import Loading from "./Loading";
const DailyCost = () => {
    const [total , setTotal] = useState()
    const [dailyCost, setDailyCost] = useState()
    const [loading , setLoading] = useState(true)
    
    const {
        handleSubmit,
        register
    } = useForm()

    const handleData =(data)=>{
        const date = data.date
        const cost = parseFloat( data.cost )
        const dailyCost = { date , cost}
        
        axios.post('https://hostel-management-server-ten.vercel.app/add-daily-cost' , dailyCost)
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
        fetch('https://hostel-management-server-ten.vercel.app/daily-cost')
        .then( res => res.json())
        .then ( data => {
            setTotal(data.totalCost)
            setDailyCost(data.dailyCost)
            setLoading(false)
        })
    },[])

    const handleDelete = (id)=>{
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
          }).then((result) => {
         
            if(result.isConfirmed){
                axios.delete(`https://hostel-management-server-ten.vercel.app/daily-cost/${id}`)
                .then( res =>{
                    if(res.data.deletedCount > 0 ){
                        Swal.fire({
                            title: "Deleted!",
                            text: "The cost has been deleted.",
                            icon: "success"
                          });
                     }
                window.location.reload()
                })
            }

        })   
    }
    const handleDeleteAll = ()=>{
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
          }).then((result) => {
         
            if(result.isConfirmed){
                axios.delete(`https://hostel-management-server-ten.vercel.app/delete-all-cost`)
                .then( res =>{
                    if(res.data.deletedCount > 0 ){
                        Swal.fire({
                            title: "Deleted!",
                            text: "All cost has been deleted.",
                            icon: "success"
                          });
                     }
                  setDailyCost([])
                  setTotal('')
                })
            }

        })   
    }
    return (
        <div className="px-8">
            <PageTitle
                heading="Daily Cost"
            ></PageTitle>
            <div >
              <form className="flex gap-4 flex-col md:flex-row" onSubmit={handleSubmit(handleData)}>
                <input className="border border-gray-400 p-3 rounded-xl" placeholder="Date" type="date" {...register('date', {required: true})} />
                <input className="border border-gray-400 p-3 rounded-xl" placeholder="Cost" type="text" {...register("cost" , {required: true})} />
                <input type="submit" value='Add'  className=" bg-[#4470CC] text-white p-3 rounded-xl"/>
             </form>
              
            </div>

            {
                loading ?
                <>
                    <Loading/>
                </> : 
              <div className="overflow-x-auto mt-10">
                <table className="table">
                    {/* head */}
                    <thead>
                    <tr className="bg-blue-100 rounded-md text-lg text-gray-800">
                        
                        <th>Date</th>
                        <th></th>
                        <th>Cost</th>
                        <th></th>
                        <th></th>
                        <th>Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/* row 1 */}
                    {
                        dailyCost?.map((cost) => 
                            <tr key={cost?._id} className="font-semibold text-sm md:text-lg border-b-2 border-gray-200 pb-1">
                        
                        <td>{cost?.date}</td>
                        <td></td>
                        <td>{cost?.cost} tk</td>
                        <td></td>
                        <td></td>
                        <td>
                           <button onClick={()=> handleDelete(cost?._id)}>
                                <MdDeleteOutline size={24}/>
                           </button>
                        </td>
                       
                    </tr>    
                        )
                    }    
                    </tbody>
                   
                   
                </table>
                <h1 className="text-xl font-semibold text-blue-900 mt-8">Total Cost: {total} tk</h1>
                <div>
                    <button onClick={handleDeleteAll} className="btn btn-error text-white rounded-md mt-6">Delete All</button>
               </div>
            </div>
            }
        </div>
    );
};

export default DailyCost;