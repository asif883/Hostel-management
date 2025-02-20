import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Loading from "./Loading";


const API_URL = "https://hostel-management-server-ten.vercel.app"; 

const members =['Asif', 'Mamun', 'Ebadul', 'Moku', 'Shobuj', 'Milon', 'Hasan'];

const MealTracker = () => {
  const [loading , setLoading] = useState(true)
  const [meals, setMeals] = useState([]);
   
  

  // Fetch Data from Backend
  const fetchMeals = async () => {
    try {
        const response = await fetch("https://hostel-management-server-ten.vercel.app/daily-meal");
        const data = await response.json();
        
        
        
        if (!Array.isArray(data.meals)) {
           
            setMeals([]); 
        } else {
            setMeals(data.meals)
            setLoading(false)
        }
    } catch (error) {
        console.error("Error fetching meals:", error);
        setMeals([]);
    }
};


  useEffect(() => {
    fetchMeals();
  }, []);

  // Handle Meal Input Change
  const handleMealChange = (index, memberIndex, value) => {
    const updatedMeals = [...meals];
    updatedMeals[index].meals[memberIndex] = value ? parseFloat(value) : 0;
    setMeals(updatedMeals);
  };

  // Save Meal Data
  const saveMeal = async (index) => {
    try {
      const response = await fetch(`${API_URL}/add-meal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(meals[index]),
      });

      if (response.ok) {
        Swal.fire("Success", "Meal saved successfully!", "success");
        fetchMeals(); // Refresh Data
      }
    } catch (error) {
      console.error("Error saving meals:", error);
    }
  };

  // Delete All Meals
  const deleteAllMeals = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete all meal records!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete all!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${API_URL}/delete-all-meals`, {
            method: "DELETE",
          });

          const data = await response.json();
          if (data.success) {
            Swal.fire("Deleted!", "All meals have been deleted.", "success");
            setMeals([]); // Clear frontend data
          } else {
            Swal.fire("Error", "Failed to delete meals!", "error");
          }
        } catch (error) {
          console.error("Error deleting meals:", error);
        }
      }
    });
  };

  // Add New Row
  const addNewRow = () => {
    const newDate = new Date();
    const formattedDate = newDate.toISOString().split("T")[0]; // YYYY-MM-DD format

    const newDay = {
      date: formattedDate,
      meals: Array(7).fill(0),
    };

    setMeals([...meals, newDay]);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Meal Tracker</h2>

      <div className="flex gap-4">
        <button onClick={addNewRow} className="btn btn-primary mb-4">
          + Add New Day
        </button>

        <button onClick={deleteAllMeals} className="btn btn-error mb-4">
          🗑 Delete All Meals
        </button>
      </div>

      {
        loading ? <Loading/>
        :
        <div className="overflow-x-auto">
        <table className="table w-full border">
          <thead>
            <tr className="text-sm">
              <th>Date</th>
              {members.map((member, index) => (
                <th key={index}>{member}</th>
              ))}
              <th>Total Meals</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {meals?.map((day, index) => (
              <tr  key={index} className="border text-sm">
                <td className="p-2">{day.date}</td>
                {day.meals.map((meal, memberIndex) => (
                  <td key={memberIndex} className="p-2">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      className="input input-sm w-16"
                      value={meal}
                      onChange={(e) => handleMealChange(index, memberIndex, e.target.value)}
                    />
                  </td>
                ))}
                <td className="font-bold p-2">
                  {day.meals.reduce((sum, meal) => sum + meal, 0).toFixed(1)}
                </td>
                <td>
                  <button className="btn btn-sm btn-primary" onClick={() => saveMeal(index)}>
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          {/* Calculate and display total meals for each member */}
          <tfoot>
            <tr className="font-bold text-sm text-gray-800">
              <td className="p-2">Total</td>
              {members.map((_, memberIndex) => (
                <td key={memberIndex} className="p-2">
                  {meals.reduce((sum, day) => sum + (day.meals[memberIndex] || 0), 0).toFixed(1)}
                </td>
              ))}
              <td className="p-2">
                {meals.reduce((total, day) => total + day.meals.reduce((sum, meal) => sum + meal, 0), 0).toFixed(1)}
              </td>
              <td></td>
            </tr>
          </tfoot>

        </table>
      </div>
      }
    </div>
  );
};

export default MealTracker;
