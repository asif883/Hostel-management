import { useForm } from "react-hook-form";
import useMembersData from "../Hooks/useMembersData";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const Update = () => {
    const {id} = useParams()
 
    const navigate = useNavigate()

    const {
        handleSubmit,
        register,
        formState:{errors}
    } =useForm()
    const members = useMembersData()

    const handleUpdate = ( data ) =>{
        const name = data.name 
        const date = data.date 
        const amount = parseFloat(data.amount) 
        const updateInfo = {name , date, amount}
         
        axios.patch(`https://hostel-management-server-ten.vercel.app/update/${id}` , updateInfo)
        .then(res =>{
            if(res.data.modifiedCount){
                Swal.fire({
                    title: 'Success!',
                    text: 'Updated Successfully',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                    
                  }); 
               navigate('/dashboard/deposit-money')
            }
          
        })
        
    }
    return (
        <div className="p-10">
            <form className="flex gap-4 flex-col md:flex-row" onSubmit={handleSubmit(handleUpdate)}>
                    <input className="border border-gray-400 p-3 rounded-xl" placeholder="Date" type="date" {...register('date', {required: true})} />
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
                   
                    <input className="border border-gray-400 p-3 rounded-xl" placeholder="Amount" type="text" {...register("amount" , {required: true})} />
                    {errors.amount && (
                    <span className="text-red-500 text-sm">{errors.amount.message}</span>
                    )}
                    <input type="submit" value='Update'  className=" bg-[#4470CC] text-white p-3 rounded-xl"/>
                </form>
        </div>
    );
};

export default Update;