import { useForm } from "react-hook-form";
import { MdDeleteOutline } from "react-icons/md";
const Utility = () => {
    const {
        handleSubmit,
        register
    } = useForm()
    const handleData =(data)=>{
        const date = data.date
        const cost = parseFloat( data.cost )
        const dailyCost = { date , cost}
        console.log(dailyCost);
    }
    return (
        <div className="px-8">
            <div className="my-8">
                <h1 className="text-3xl font-semibold text-blue-700 ">Utility</h1>
            </div>
            <form className="flex gap-4 flex-col md:flex-row" onSubmit={handleSubmit(handleData)}>
                <input className="border border-gray-400 p-3 rounded-xl" placeholder="Date" type="date" {...register('date', {required: true})} />
                <input className="border border-gray-400 p-3 rounded-xl" placeholder="Cost" type="text" {...register("cost" , {required: true})} />
                <input type="submit" value='Add'  className=" bg-[#4470CC] text-white p-3 rounded-xl"/>
            </form>

            <div className="overflow-x-auto mt-10">
                <table className="table">
                    {/* head */}
                    <thead>
                    <tr className="bg-gray-100 rounded-md text-lg text-gray-800">
                        
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
                    <tr className="font-semibold text-sm md:text-lg">
                        
                        <td>1-1-25</td>
                        <td></td>
                        <td>100 tk</td>
                        <td></td>
                        <td></td>
                        <td>
                           <button>
                                <MdDeleteOutline size={24}/>
                           </button>
                        </td>
                       
                    </tr>        
                    </tbody>
                   
                   
                </table>
                <h1 className="text-xl font-semibold text-blue-900 mt-8">Total Cost: 100 tk</h1>
            </div>
        </div>
    );
};

export default Utility;