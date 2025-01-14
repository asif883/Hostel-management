import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import axios from "axios";
import Swal from "sweetalert2";



const Register = () => {
    const { CreateUser } = useAuth()
    const navigate = useNavigate()
    const {
        handleSubmit,
        register, 
        watch,
        formState: {errors}
    } = useForm()
    const handleRegister = (data)=>{
        const email = data.email
        const password = data.password 
        const name = data.name 
        const userData  ={ email , password, name }

        CreateUser(email , password)

        axios.post('http://localhost:3000/add-user', userData)
        .then(res =>{
                 if(res.data.insertedId){
                    Swal.fire({
                     title: 'Success!',
                     text: 'Your Registration Successful',
                     icon: 'success',
                     confirmButtonText: 'Ok'
                            
                    }); 
                  navigate('/dashboard/overview')
                 }
                  
                })

    }
    return (
        <div className="max-w-3xl mx-auto">
             <div className="text-center mt-8">
                <h1 className="text-4xl font-bold">
                    Please Register
                </h1>
            </div>
            <form onSubmit={handleSubmit(handleRegister)}  className="card-body">
                    <div className="form-control">
                        <label className="label ">
                            <span className="label-text text-xl font-semibold">Name</span>
                        </label>
                            
                        <input type="text" name="Name"  placeholder="Enter Your Name"className="input input-bordered border border-gray-300" {...register('name' ,{required: true})} />
                        {
                            errors.name && ( 
                                <p className='text-red-500 text-sm'>Name is required</p>
                            )
                        }
                       
                    </div>
                   
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-xl font-semibold">Email</span>
                        </label>
                        <input type="email" name='email' placeholder="email" className="input input-bordered border border-gray-300"{...register("email", {required: true})} />
                        {
                          errors.email && ( 
                              <p className='text-red-500 text-sm'>Email is required</p>
                            )
                        } 
                        
                    </div>
                    <div className="form-control relative">
                    <label className="label">
                        <span className=" label-text text-xl font-semibold">Password</span>
                    </label>
                  
                    <input
                        type="password"
                        placeholder="Enter your password"
                        className= "input input-bordered border border-gray-300"
                        {...register("password", {
                        required: "Password is required.",
                        minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters long.",
                        },
                        })}
                        
                    />
                    {
                    errors.password && <p className='text-red-500'>{
                        errors.password.message
                    }</p>
                    }
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-xl font-semibold">Confirm Password</span>
                        </label>
                        <input type='password' 
                        name='confirm-password' 
                        placeholder="Confirm Password" 
                        className= "input input-bordered border border-gray-300" 
                        {...register("confirmPassword", {
                            required: true ,
                            validate:(value)=>{
                                if(watch("password") != value){
                                    return "Your password don't match"
                                }
                            }
                        } )}
                        /> 
                          {
                            errors.confirmPassword &&(
                                <p className='text-red-500 text-sm'>Both password must match</p>
                            )
                        }           
                    </div>
                    <div className="form-control mt-6">
                    <button type='submit' className=" w-full border-2 mr-4  px-4  rounded-lg py-3 bg-gray-800 text-white  font-semibold">Register</button>
                    </div>
                    <label className="label mt-4">
                        <a className="label-text-alt text-lg text-gray-500">Already have an account? Please <Link to='/login' className="underline text-gray-800 font-semibold">Login</Link></a>
                    </label>
             </form>
        </div>
    );
};

export default Register;