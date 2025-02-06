import useMembersData from "../Hooks/useMembersData";
import PageTitle from "../SharedItems/PageTitile";



const AllMember = () => {
    const members = useMembersData()

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
                                    <th>Role</th>
                                   
                                </tr>
                                </thead>
                                <tbody>
                                {/* row 1 */}
                                {
                                    members?.map((member) => 
                                        <tr key={member?._id} className="font-semibold  border-b-2 border-blue-100 pb-1">
                                    
                                    <td>{member?.name}</td>
                                    <td></td>
                                    <td></td>
                                  
                                    <td>{member?.email}</td>
                                    
                                    <td className="capitalize">
                                         {member?.role}
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