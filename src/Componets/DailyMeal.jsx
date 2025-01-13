import PageTitle from "../SharedItems/PageTitile";

const DailyMeal = () => {
    return (
        <div className="p-3 md:px-10">
            <PageTitle
                heading="daily meal"
            ></PageTitle>
            <div className="overflow-x-auto ">
                            <table className="table">
                                {/* head */}
                                <thead>
                                <tr className="bg-gray-100 rounded-md text-lg text-gray-800">
                                    
                                    <th>Name</th>
                                    <th></th>
                                    <th>Total Meal</th>
                                    <th>Add Meal</th>
                                </tr>
                                </thead>
                                <tbody>
                                {/* row 1 */}
                                <tr className="font-semibold text-sm md:text-lg">
                                    
                                    <td>Name</td>
                                    <td></td>
                                    <td>10</td>
                                                                                                        
                                    <td>
                                      <input className="border rounded-lg border-[#4470CC] p-2 w-10" type="text" />
                                      <input type="submit" value='Add' className="bg-[#4470CC] text-white p-2 rounded-xl ml-1" />
                                    </td>
                                   
                                </tr>        
                                </tbody>
                               
                               
                            </table>
                          
                        </div>
        </div>
    );
};

export default DailyMeal;