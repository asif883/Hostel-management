import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../Hooks/useAuth";


const Login = () => {
    const {login} = useAuth()
    const navigate = useNavigate()
  
    const {
      handleSubmit,
      register,
      formState:{ errors }
    } = useForm()

    const handleLogin = (data) =>{
     
       const email = data.email
       const password = data.password

       login( email , password)
       .then(res =>{
        console.log(res);
        Swal.fire({
            title: 'Success!',
            text: 'Login Successful',
            icon: 'success',
            confirmButtonText: 'Ok'
          });
          navigate('/dashboard/overview');
    })
    .catch (error =>{
        console.error( error)
        Swal.fire({
            title: 'Error!',
            text: `${error.message}`,
            icon: 'error',
            confirmButtonText: 'Try again',
            confirmButtonColor: '#18181B'
            })
        })
    }

    
    return (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mt-8">
                <h1 className="text-4xl font-bold">
                    Please Login
                </h1>
            </div>
          <form onSubmit={handleSubmit(handleLogin)}  className="card-body">
              <div className="form-control">
              <label className="label">
                  <span className="label-text text-xl font-semibold">Email</span>
              </label>
              <input type="email" name="email" placeholder="email" className="input input-bordered border border-gray-300" {...register("email" ,{required: true})} />
              {
                errors.email && (
                    <p className='text-red-500 text-sm'> Email is required</p>
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
             
              <div className="form-control mt-6">
              <button type='submit' className="w-full border-2 mr-4  px-4  rounded-lg py-3 bg-gray-800 text-white  font-semibold">Login</button>
              </div>
              
              <label className="label">
                  <p className="label-text-alt text-lg text-gray-500">New here? Please <Link to='/register' className="underline text-gray-800 font-medium">Register</Link></p>
              </label>
      </form>
        </div>
    );
};

export default Login;