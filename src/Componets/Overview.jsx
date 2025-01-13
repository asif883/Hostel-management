import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { useEffect, useState } from "react";

const Overview = () => {
  const [total , setTotal] = useState()
  const [utilityTotal , setUtilityTotal] = useState()

  const dietBreakdownData = {
    labels: ["Asif", "Mamun", "Moku", "Ebadul", "Shobuj", "Hasan", "Milon"],
    datasets: [
      {
        data: [4500, 3000, 3500,4000,2500,2000,2800],
        backgroundColor: ["#4CAF50", "#FF7043", "#42A5F5"],
      },
    ],
  };
   
  useEffect(()=>{
          fetch('http://localhost:3000/daily-cost')
          .then( res => res.json())
          .then ( data => {
              setTotal(data.totalCost)
          })
      },[])

  useEffect(()=>{
          fetch('http://localhost:3000/utility-cost')
          .then( res => res.json())
          .then ( data => {
              setUtilityTotal(data.totalCost)
          })
      },[])

  

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
        Overview Dashboard
      </h1>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="card bg-primary text-white p-4">
          <h3 className="text-lg font-bold">Total Cost</h3>
          <p className="text-2xl font-semibold">{total} tk</p>
          
        </div>
        <div className="card bg-secondary text-white p-4">
          <h3 className="text-lg font-bold">Utility Cost</h3>
          <p className="text-2xl font-semibold">{utilityTotal} tk</p>
       
        </div>
      
        <div className="card bg-info text-white p-4">
          <h3 className="text-lg font-bold">Mess Members</h3>
          <p className="text-3xl">7</p>
         
        </div>
      </div>


      {/* Charts Section */}
      <div className="mb-6 max-w-4xl">
        <div>
          <h3 className="font-bold mb-2 text-center sm:text-left">
           Deposit Money 
          </h3>
          <Bar data={dietBreakdownData} />
        </div>
      </div>
    </div>
  );
};

export default Overview;