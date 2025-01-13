import { useForm } from "react-hook-form";
import PageTitle from "../SharedItems/PageTitile";


const DepositMoney = () => {
    const {
        handleSubmit,
        register,
        formState: { errors }
    } =useForm()
    const handleDeposit = (data)=>{
        const name = data.name 
        const amount = parseFloat(data.amount) 
        console.log(name , amount);
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
                    <option value="name1">Option 1</option>
                    <option value="name2">Option 2</option>
                    <option value="name3">Option 3</option>
                 </select>
                    {errors.option && (
                    <span className="text-red-500 text-sm">{errors.option.message}</span>
                    )}
                    <input className="border border-gray-400 p-3 rounded-xl" placeholder="Amount" type="text" {...register("amount" , {required: true})} />
                    {errors.amount && (
                    <span className="text-red-500 text-sm">{errors.amount.message}</span>
                    )}
                    <input type="submit" value='Add'  className=" bg-[#4470CC] text-white p-3 rounded-xl"/>

                </form>
        </div>
    );
};

export default DepositMoney;