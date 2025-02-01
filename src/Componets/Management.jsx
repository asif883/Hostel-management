import { MdDeleteOutline } from "react-icons/md";
import useMembersData from "../Hooks/useMembersData";
import PageTitle from "../SharedItems/PageTitile";
import Swal from "sweetalert2";
import axios from "axios";
import { RxCrossCircled } from "react-icons/rx";
import { SiAwssecretsmanager } from "react-icons/si";
import { BsPersonLock } from "react-icons/bs";
import { LuFileLock } from "react-icons/lu";
import { LuUsers } from "react-icons/lu";

const Management = () => {
    const members = useMembersData()

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
                axios.delete(`https://hostel-management-server-ten.vercel.app/delete-user/${id}`)
                .then( res =>{
                    if(res.data.deletedCount > 0 ){
                        Swal.fire({
                            title: "Deleted!",
                            text: "The Member has been deleted.",
                            icon: "success"
                          });
                     }
                window.location.reload()
                })
            }

        })   
    }

    const handleMakeAdmin =(id) =>{
        Swal.fire({
            title: "Are you sure?",
            text: "The User Get All Access!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Do it!"
          }).then((result) => {
         
            if(result.isConfirmed){
                axios.patch(`https://hostel-management-server-ten.vercel.app/users/admin/${id}`)
                .then( res =>{
                    if(res.data.modifiedCount > 0 ){
                        Swal.fire({
                            title: "Successful!",
                            text: "The Member is Admin Now",
                            icon: "success"
                          });
                     }
                window.location.reload()
                })
            }

        })
    }

    const handleMakeManager = (id) =>{
        Swal.fire({
            title: "Are you sure?",
            text: "The User Get All Access!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Do it!"
          }).then((result) => {
         
            if(result.isConfirmed){
                axios.patch(`https://hostel-management-server-ten.vercel.app/users/manager/${id}`)
                .then( res =>{
                    if(res.data.modifiedCount > 0 ){
                        Swal.fire({
                            title: "Successful!",
                            text: "The Member is Manager Now",
                            icon: "success"
                          });
                     }
                window.location.reload()
                })
            }

        })
    }

    const handleManagerRemove = (id) =>{
        Swal.fire({
            title: "Are you sure?",
            text: "Remove From Manager!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Do it!"
          }).then((result) => {
         
            if(result.isConfirmed){
                axios.patch(`https://hostel-management-server-ten.vercel.app/users/manager/remove/${id}`)
                .then( res =>{
                    if(res.data.modifiedCount > 0 ){
                        Swal.fire({
                            title: "Successful!",
                            text: "Confirm delete from manager",
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
                heading='All member'
            ></PageTitle>
             <div className="overflow-x-auto mt-10">
                            <table className="table">
                                {/* head */}
                                <thead>
                                <tr className="bg-blue-100 rounded-md text-lg text-gray-800">
                                    
                                    <th>Name</th>
                                    <th></th>
                                    
                                    <th>Make Admin</th>
                                    <th>Make Manager</th>
                                    <th>Remove Manager</th>
                                    <th>Delete Member</th>
                                   
                                </tr>
                                </thead>
                                <tbody>
                                {/* row 1 */}
                                {
                                    members?.map((member) => 
                                        <tr key={member?._id} className="font-semibold  border-b-2 border-blue-100 pb-1">
                                    
                                    <td>{member?.name}</td>
                                 
                                    <td></td>
                                  
                                    
                                    <td>

                                        {
                                            member?.role ==='admin' ?
                                             <>
                                                <BsPersonLock size={20}/>
                                             </> 
                                             :
                                             <button onClick={()=> handleMakeAdmin(member?._id)}>
                                             <SiAwssecretsmanager size={20}/>
                                             </button>
                                        }
                                        
                                        </td>
                                    <td>
                                        {
                                            member?.role === 'manager' ?
                                            <>
                                              <LuFileLock size={20}/>
                                            </> :
                                            <>
                                             <button onClick={()=> handleMakeManager(member?._id)}>
                                                <LuUsers size={20}/>
                                             </button>
                                            </>
                                        }
                                    </td>
                                    <td>
                                        {
                                            member?.role === 'manager' ?
                                            <>
                                                <button onClick={()=> handleManagerRemove(member?._id)}>
                                                 <RxCrossCircled size={20}/>
                                                </button>
                                            </> 
                                              :
                                            <>
                                                <LuUsers size={20}/>
                                            </>

                                        }
                                        
                                    </td>
                                    <td>
                                        <button onClick={()=>handleDelete(member?._id)}>
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

export default Management;