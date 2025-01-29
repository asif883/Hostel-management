import { useForm } from "react-hook-form";
import useMembersData from "../Hooks/useMembersData";
import PageTitle from "../SharedItems/PageTitile";
import axios from "axios";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

const DailyMeal = () => {
     const members = useMembersData()
     const [meals, setMeals] = useState([])

      const {
        handleSubmit,
        register,
      }=useForm()

    const handleMealData = (data) =>{
       const name = data.option 
       const date = data.date
       const meal = parseFloat(data.meal) 
       const mealData = { name , date , meal }

       axios.post('http://localhost:3000/add-meal' , mealData)
        .then(res =>{
            if(res.data.insertedId){
                Swal.fire({
                    title: 'Success!',
                    text: 'Meal added Successfully',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                    
                }); 
                  window.location.reload()
            }
          
        })
 
    }

    useEffect(()=>{
        fetch('http://localhost:3000/daily-meal')
        .then( res => res.json())
        .then( data => setMeals(data))
    },[])
    return (
        <div className="p-3 md:px-10">
            <PageTitle
                heading="daily meal"
            ></PageTitle>
            <form className="flex gap-4 flex-col md:flex-row" onSubmit={handleSubmit(handleMealData)}>
                <select className="select border-[#4470CC] w-full max-w-xs"
                  {...register("option", { required: true})}
                >
                    <option disabled selected>Select member</option>
                     {
                        members?.map((member) =>
                            <option value={member?.name} key={member?.id}>{member?.name}</option>
                        )
                     }
                </select>
                <input className="border border-[#4470CC] p-3 rounded-xl" placeholder="Date" type="date" {...register('date', {required: true})} />
                <input className="border border-[#4470CC] p-2 rounded-xl" placeholder="Meal" type="text" {...register("meal" , {required: true})} />
                <input type="submit" value='Add'  className=" bg-[#4470CC] text-white p-3 rounded-xl"/>
            </form>
            <div className="overflow-x-auto mt-4">
                            <table className="table">
                                {/* head */}
                                <thead>
                                <tr className="bg-gray-100 rounded-md text-lg text-gray-800">
                                    
                                    <th>Name</th>
                                    <th></th>
                                    <th>Meal</th>
                                    <th>Date</th>
                                </tr>
                                </thead>
                                <tbody>
                                {/* row 1 */}
                                {
                                    meals?.map((meal) =>
                                        <tr key={meal?._id} className="font-semibold text-sm md:text-lg">
                                    <td>{meal?.name}</td>
                                    <td></td>
                                    <td>{meal.meal}</td>
                                    <td>
                                      {meal?.date}
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

export default DailyMeal;