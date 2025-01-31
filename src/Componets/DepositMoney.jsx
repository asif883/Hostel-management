import { useForm } from "react-hook-form";
import PageTitle from "../SharedItems/PageTitile";
import useMembersData from "../Hooks/useMembersData";
import axios from "axios";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";


const DepositMoney = () => {
    const members = useMembersData()
    const [allMoney , setAllMoney] = useState([])

    const {
        handleSubmit,
        register,
        formState: { errors }
    } =useForm()
    const handleDeposit = (data)=>{
        const name = data.name 
        const date = data.date 
        const amount = parseFloat(data.amount) 
        const depositMoney = {name , date,amount}

        axios.post('https://hostel-management-server-ten.vercel.app/add-money' , depositMoney)
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
        fetch('https://hostel-management-server-ten.vercel.app/deposit-money')
        .then(res => res.json())
        .then(data => setAllMoney(data))
    }, [])

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
                axios.delete(`https://hostel-management-server-ten.vercel.app/money/${id}`)
                .then( res =>{
                    if(res.data.deletedCount > 0 ){
                        Swal.fire({
                            title: "Deleted!",
                            text: "Deposit Money has been deleted.",
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
                heading="Deposit Money"
            ></PageTitle>
                <form className="flex gap-4 flex-col md:flex-row" onSubmit={handleSubmit(handleDeposit)}>
                 <select
                    className="select select-bordered w-full max-w-xs"
                    {...register("name", { required: "This field is required" })}
                    >
                    <option value="" disabled selected>
                        Choose a Name
                    </option>
                    {
                        members?.map((member) =>
                            <option key={member?._id} value={member?.name}>{member?.name}</option>
                        )
                    }
                   
                 </select>
                    {errors.option && (
                    <span className="text-red-500 text-sm">{errors.option.message}</span>
                    )}
                    <input className="border border-gray-400 p-3 rounded-xl" placeholder="Date" type="date" {...register('date', {required: true})} />
                    <input className="border border-gray-400 p-3 rounded-xl" placeholder="Amount" type="text" {...register("amount" , {required: true})} />
                    {errors.amount && (
                    <span className="text-red-500 text-sm">{errors.amount.message}</span>
                    )}
                    <input type="submit" value='Add'  className=" bg-[#4470CC] text-white p-3 rounded-xl"/>
                </form>
                
                      <div className="overflow-x-auto mt-10">
                            <table className="table">
                                {/* head */}
                                <thead>
                                  <tr className="bg-gray-100 rounded-md text-lg text-gray-800">
                                        
                                      <th>Date</th>
                                      <th>Name</th>
                                       <th></th>
                                       <th>Amount</th>
                                       <th>Delete</th>
                                       
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {/* row 1 */}
                                     {
                                        allMoney?.map((money) => 
                                        <tr key={money?._id} className="font-semibold text-sm md:text-lg">
                                        
                                            <td>{money?.date}</td>
                                            <td>{money?.name}</td>
                                            <td></td>
                                            <td>{money?.amount} tk</td>
                                            <td>
                                                <button onClick={()=> handleDelete(money?._id)}>
                                                    <MdDeleteOutline size={24}/>
                                                </button>
                                            </td>
                                            
                                        </tr> 
                                        )
                                     }       
                                </tbody>
                                   
                                   
                            </table>
                                
               </div>
        </div>
    );
};

export default DepositMoney;