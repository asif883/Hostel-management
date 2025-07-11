import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { useEffect, useState } from "react";

const Overview = () => {
  const [total , setTotal] = useState()
  const [loading , setLoading] = useState(true)
  const [utilityTotal , setUtilityTotal] = useState()
  const [depositMoney , setDepositMoney] = useState([])
  
  useEffect(()=>{
    fetch('https://hostel-management-server-ten.vercel.app/deposit-money')
    .then(res => res.json())
    .then(data => {
      setDepositMoney(data)
      setLoading(false)
    })
  }, [])

  const getColor = (amount) => {
    if (amount >= 2500) return "#4CAF50"; // Green
    if (amount <= 1500) return "#FF0000"; // Red
    return "#FFD700"; // Yellow
  };

  const dietBreakdownData = { 
    labels: depositMoney.map(item => item?.name),
    datasets: [
      {
        data: depositMoney.map(item => item?.amount),
        backgroundColor: depositMoney.map(item => getColor(item.amount)),
      },
    ],
  };
   
  useEffect(()=>{
          fetch('https://hostel-management-server-ten.vercel.app/daily-cost')
          .then( res => res.json())
          .then ( data => {
              setTotal(data.totalCost)
              setLoading(false)
          })
      },[])

  useEffect(()=>{
          fetch('https://hostel-management-server-ten.vercel.app/utility-cost')
          .then( res => res.json())
          .then ( data => {
              setUtilityTotal(data.totalCost)
              setLoading(false)
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
          <p className="text-2xl font-semibold"> 
            {
              loading ? <><span className="loading loading-dots loading-md"></span></> : <> {total} tk</>
            }
            </p>
          
        </div>
        <div className="card bg-secondary text-white p-4">
          <h3 className="text-lg font-bold">Utility Cost</h3>
          <p className="text-2xl font-semibold">{
              loading ? <><span className="loading loading-dots loading-md"></span></> : <> {utilityTotal} tk</>
            }</p>
       
        </div>
      
        <div className="card bg-info text-white p-4">
          <h3 className="text-lg font-bold">Mess Members</h3>
          <p className="text-3xl">7</p>
         
        </div>
      </div>


      {/* Charts Section */}
      <div className="mb-6 max-w-4xl">
        {
          loading ? <div className="flex items-start justify-center"><span className="loading loading-bars loading-lg"></span></div>
          : 
          <div>
            <h3 className="font-bold mb-2 text-center sm:text-left">
            Deposit Money 
            </h3>
            <Bar data={dietBreakdownData} />
          </div>
        }
      </div>
    </div>
  );
};

export default Overview;