import { MdDeleteOutline } from "react-icons/md";
import useMembersData from "../Hooks/useMembersData";
import PageTitle from "../SharedItems/PageTitile";
import Swal from "sweetalert2";
import axios from "axios";

const AllMember = () => {
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
                axios.delete(`http://localhost:3000/delete-user/${id}`)
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
                                    <th></th>
                                    <th>Email</th>
                                    <th>Delete</th>
                                   
                                </tr>
                                </thead>
                                <tbody>
                                {/* row 1 */}
                                {
                                    members?.map((member) => 
                                        <tr key={member?._id} className="font-semibold text-sm md:text-lg border-b-2 border-blue-100 pb-1">
                                    
                                    <td>{member?.name}</td>
                                    <td></td>
                                    <td></td>
                                  
                                    <td>{member?.email}</td>
                                    
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

export default AllMember;