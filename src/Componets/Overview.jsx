import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { useEffect, useState } from "react";
import { TbCurrencyTaka } from "react-icons/tb";
import { 
  FiCalendar, 
  FiUsers, 
  FiDollarSign, 
  FiPieChart,
  FiTrendingUp,
  FiTrendingDown,
  FiUser,
  FiGrid,
  FiBarChart2,
  FiCoffee,
  FiCreditCard,
  FiActivity
} from "react-icons/fi";
import PageTitle from "../SharedItems/PageTitile";

const BASE_URL = "https://hostel-management-server-ten.vercel.app";
const MEMBERS = ["Asif", "Latif", "Ebadul", "Moklesur", "Shobuj", "Mahmud"];

const StatCardSkeleton = () => (
  <div className="animate-pulse bg-white rounded-2xl p-6 border border-slate-100">
    <div className="h-3 bg-slate-200 rounded w-20 mb-3"></div>
    <div className="h-8 bg-slate-200 rounded w-28"></div>
    <div className="h-3 bg-slate-200 rounded w-24 mt-3"></div>
  </div>
);

const StatCard = ({ icon: Icon, label, value, sub, color = "blue" }) => {
  const colorMap = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      subText: "text-blue-500",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      hover: "hover:border-blue-300"
    },
    amber: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      subText: "text-amber-500",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      hover: "hover:border-amber-300"
    },
    violet: {
      bg: "bg-violet-50",
      border: "border-violet-200",
      text: "text-violet-700",
      subText: "text-violet-500",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
      hover: "hover:border-violet-300"
    },
    emerald: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      subText: "text-emerald-500",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      hover: "hover:border-emerald-300"
    },
    rose: {
      bg: "bg-rose-50",
      border: "border-rose-200",
      text: "text-rose-700",
      subText: "text-rose-500",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
      hover: "hover:border-rose-300"
    },
    cyan: {
      bg: "bg-cyan-50",
      border: "border-cyan-200",
      text: "text-cyan-700",
      subText: "text-cyan-500",
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600",
      hover: "hover:border-cyan-300"
    },
    slate: {
      bg: "bg-slate-50",
      border: "border-slate-200",
      text: "text-slate-700",
      subText: "text-slate-500",
      iconBg: "bg-slate-100",
      iconColor: "text-slate-600",
      hover: "hover:border-slate-300"
    }
  };

  const styles = colorMap[color] || colorMap.blue;

  return (
    <div className={`rounded-2xl p-6 border ${styles.border} ${styles.bg} ${styles.hover} transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-xs font-semibold ${styles.subText} uppercase tracking-wider`}>
            {label}
          </p>
          <p className={`text-2xl font-bold ${styles.text} mt-1`}>
            {value}
          </p>
          {sub && (
            <p className={`text-xs ${styles.subText} mt-1 font-medium`}>
              {sub}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${styles.iconBg}`}>
          <Icon className={`w-5 h-5 ${styles.iconColor}`} />
        </div>
      </div>
    </div>
  );
};

const Overview = () => {
  const [dailyTotal, setDailyTotal] = useState(0);
  const [utilityTotal, setUtilityTotal] = useState(0);
  const [depositMoney, setDepositMoney] = useState([]);
  const [totalMeals, setTotalMeals] = useState(0);
  const [memberMeals, setMemberMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${BASE_URL}/deposit-money`).then(r => r.json()),
      fetch(`${BASE_URL}/daily-cost`).then(r => r.json()),
      fetch(`${BASE_URL}/utility-cost`).then(r => r.json()),
      fetch(`${BASE_URL}/daily-meal`).then(r => r.json()),
    ]).then(([deposit, daily, utility, meal]) => {
      setDepositMoney(deposit ?? []);
      setDailyTotal(daily.totalCost ?? 0);
      setUtilityTotal(utility.totalCost ?? 0);

      const meals = meal.meals ?? [];
      const total = meals.reduce((sum, day) =>
        sum + (day.meals ?? []).reduce((s, m) => s + m, 0), 0
      );
      setTotalMeals(parseFloat(total.toFixed(1)));

      const perMember = Array(6).fill(0);
      meals.forEach(day => {
        (day.meals ?? []).forEach((m, i) => {
          if (i < 6) perMember[i] += m || 0;
        });
      });
      setMemberMeals(perMember.map(m => parseFloat(m.toFixed(1))));
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const allCost = parseFloat((dailyTotal + utilityTotal).toFixed(2));
  const mealRate = totalMeals > 0 ? parseFloat((dailyTotal / totalMeals).toFixed(2)) : 0;
  const perPersonUtility = parseFloat((utilityTotal / 6).toFixed(2));

  const today = new Date();
  const fullDate = today.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const totalDeposit = depositMoney.reduce((s, m) => s + (parseFloat(m.amount) || 0), 0);
  const totalCostPerMember = MEMBERS.map((_, i) =>
    parseFloat(((memberMeals[i] ?? 0) * mealRate + perPersonUtility).toFixed(2))
  );
  
  const balanceRows = MEMBERS.map((name, index) => {
    const memberCost = totalCostPerMember[index] ?? 0;
    const depositAmount = depositMoney.reduce((sum, item) => {
      const itemName = String(item?.name || "").trim().toLowerCase();
      return itemName.includes(name.toLowerCase())
        ? sum + (parseFloat(item?.amount) || 0)
        : sum;
    }, 0);
    const balance = parseFloat((depositAmount - memberCost).toFixed(2));

    return { name, depositAmount, memberCost, balance };
  });

  const getBalanceStatus = (balance) => {
    if (balance < 500) return { label: "Low", color: "rose", icon: FiTrendingDown };
    if (balance < 1000) return { label: "Moderate", color: "amber", icon: FiPieChart };
    return { label: "Healthy", color: "emerald", icon: FiTrendingUp };
  };

  // Chart data
  const getColor = (amount) => {
    if (amount >= 2500) return "#10b981";
    if (amount <= 1500) return "#ef4444";
    return "#f59e0b";
  };

  const chartData = {
    labels: depositMoney.map(item => item?.name),
    datasets: [
      {
        label: "Amount (tk)",
        data: depositMoney.map(item => item?.amount),
        backgroundColor: depositMoney.map(item => getColor(item.amount) + "CC"),
        borderColor: depositMoney.map(item => getColor(item.amount)),
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        barPercentage: 0.7,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleColor: "#f1f5f9",
        bodyColor: "#f1f5f9",
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => ` ${ctx.raw} tk`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { 
          font: { size: 12, weight: "600" }, 
          color: "#64748b",
        },
      },
      y: {
        grid: { color: "#f1f5f9", drawBorder: false },
        ticks: { 
          font: { size: 11 }, 
          color: "#94a3b8",
          callback: (value) => value + " tk",
        },
      },
    },
  };

  // Sorting members by meal count (highest to lowest)
  const sortedMembers = MEMBERS.map((name, index) => ({
    name,
    meals: memberMeals[index] ?? 0,
    cost: totalCostPerMember[index] ?? 0,
    index
  })).sort((a, b) => b.meals - a.meals);

  const getRankColor = (rank) => {
    const colors = ["text-emerald-600", "text-blue-600", "text-amber-600", "text-violet-600", "text-rose-600", "text-slate-600"];
    return colors[rank] || "text-slate-600";
  };

  const getRankBg = (rank) => {
    const colors = ["bg-emerald-100", "bg-blue-100", "bg-amber-100", "bg-violet-100", "bg-rose-100", "bg-slate-100"];
    return colors[rank] || "bg-slate-100";
  };

  return (
    <div className="min-h-screen bg-slate-50/80 px-4 md:px-8 pb-16" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');`}</style>

      <PageTitle heading="Overview" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-xl">
            <FiCalendar className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-sm font-medium text-slate-600">{fullDate}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              icon={TbCurrencyTaka}
              label="Food expenses"
              value={`${dailyTotal} tk`}
              sub="Total Food expenses"
              color="blue"
            />
            <StatCard
              icon={FiBarChart2}
              label="Utility Cost"
              value={`${utilityTotal} tk`}
              sub="Bills & utilities"
              color="amber"
            />
            <StatCard
              icon={FiUsers}
              label="Per Person Utility"
              value={`${perPersonUtility} tk`}
              sub="Utility ÷ 6 members"
              color="violet"
            />
            <StatCard
              icon={FiPieChart}
              label="Meal Rate"
              value={`${mealRate} tk`}
              sub={`Daily cost ÷ ${totalMeals} meals`}
              color="emerald"
            />
          </>
        )}
      </div>

      {/* Meal & Cost Section - Clean Redesign */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Meal Count - Clean Table Style */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiCoffee className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Meal Count
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">Total: {totalMeals}</span>
              </div>
            </div>
            <div className="divide-y divide-slate-50">
              {sortedMembers.map((member, rank) => (
                <div 
                  key={member.index} 
                  className="px-6 py-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-6 h-6 rounded-full ${getRankBg(rank)} flex items-center justify-center text-xs font-bold ${getRankColor(rank)}`}>
                      {rank + 1}
                    </span>
                    <span className="font-medium text-slate-700 text-sm">{member.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-medium">meals</span>
                    <span className="text-sm font-bold text-slate-800 min-w-[30px] text-right tabular-nums">
                      {member.meals}
                    </span>
                    <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-700"
                        style={{ 
                          width: `${(member.meals / (sortedMembers[0]?.meals || 1)) * 100}%`,
                          opacity: member.meals === 0 ? 0.2 : 1
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Cost - Clean Table Style */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiCreditCard className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Total Cost
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">Total: {allCost} tk</span>
              </div>
            </div>
            <div className="divide-y divide-slate-50">
              {sortedMembers.map((member, rank) => {
                const percentage = allCost > 0 ? (member.cost / allCost) * 100 : 0;
                const barColors = ["bg-emerald-500", "bg-blue-500", "bg-amber-500", "bg-violet-500", "bg-rose-500", "bg-slate-500"];
                return (
                  <div 
                    key={member.index} 
                    className="px-6 py-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-6 h-6 rounded-full ${getRankBg(rank)} flex items-center justify-center text-xs font-bold ${getRankColor(rank)}`}>
                        {rank + 1}
                      </span>
                      <span className="font-medium text-slate-700 text-sm">{member.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 font-medium">cost</span>
                      <span className="text-sm font-bold text-slate-800 min-w-[60px] text-right tabular-nums">
                        {member.cost} tk
                      </span>
                      <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${barColors[rank]} rounded-full transition-all duration-700`}
                          style={{ 
                            width: `${percentage}%`,
                            opacity: member.cost === 0 ? 0.2 : 1
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Balance Status - Updated with Cost Info */}
      {!loading && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-8 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <FiActivity className="w-4 h-4 text-violet-600" />
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Balance Status
              </h3>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Healthy
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Moderate
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                Low
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {balanceRows.map((row, index) => {
              const status = getBalanceStatus(row.balance);
              const StatusIcon = status.icon;

              return (
                <div 
                  key={`${row.name}-${index}`} 
                  className={`p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${
                    status.color === "emerald" ? "border-emerald-200 bg-emerald-50/30" :
                    status.color === "amber" ? "border-amber-200 bg-amber-50/30" :
                    "border-rose-200 bg-rose-50/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                        status.color === "emerald" ? "bg-emerald-200 text-emerald-700" :
                        status.color === "amber" ? "bg-amber-200 text-amber-700" :
                        "bg-rose-200 text-rose-700"
                      }`}>
                        {row.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{row.name}</p>
                        <div className="flex items-center gap-1.5">
                          <StatusIcon className={`w-3 h-3 ${
                            status.color === "emerald" ? "text-emerald-600" :
                            status.color === "amber" ? "text-amber-600" :
                            "text-rose-600"
                          }`} />
                          <span className="text-xs text-slate-400">{status.label}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        status.color === "emerald" ? "text-emerald-600" :
                        status.color === "amber" ? "text-amber-600" :
                        "text-rose-600"
                      }`}>
                        {row.balance} tk
                      </p>
                      <div className="flex items-center justify-end gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-400">Cost:</span>
                        <span className="text-[11px] font-semibold text-slate-600">
                          {row.memberCost} tk
                        </span>
                        <span className="text-[10px] text-slate-300">|</span>
                        <span className="text-[10px] text-slate-400">Deposit:</span>
                        <span className="text-[11px] font-semibold text-slate-600">
                          {row.depositAmount} tk
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Deposit Chart */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg transition-shadow duration-300">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl">
              <FiGrid className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Deposit Money
              </h3>
              <p className="text-2xl font-bold text-slate-800 flex items-center gap-1">
                <TbCurrencyTaka className="text-blue-600" />
                {totalDeposit} tk
              </p>
            </div>
          </div>
          <div className="flex gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500"></span>
              ≥ 2500
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-500"></span>
              1500–2500
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-500"></span>
              ≤ 1500
            </span>
          </div>
        </div>

        {loading ? (
          <div className="animate-pulse h-64 bg-slate-100 rounded-xl"></div>
        ) : depositMoney.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <FiBarChart2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-medium">No deposit data yet</p>
            <p className="text-xs text-slate-400 mt-1">Deposits will appear here once added</p>
          </div>
        ) : (
          <div className="h-64">
            <Bar data={chartData} options={chartOptions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;