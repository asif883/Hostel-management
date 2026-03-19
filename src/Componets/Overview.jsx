import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { useEffect, useState } from "react";
import { TbCurrencyTaka } from "react-icons/tb";
import PageTitle from "../SharedItems/PageTitile";

const BASE_URL = "https://hostel-management-server-ten.vercel.app";
const MEMBERS = ["Asif", "Mamun", "Ebadul", "Moku", "Shobuj", "Milon"];

const StatCardSkeleton = () => (
  <div className="animate-pulse bg-white rounded-2xl p-5 border border-slate-100"
    style={{ boxShadow: "0 4px 24px -4px rgba(15,23,42,0.08)" }}>
    <div className="h-3 bg-slate-200 rounded w-24 mb-3"></div>
    <div className="h-8 bg-slate-200 rounded w-32"></div>
  </div>
);

const StatCard = ({ label, value, sub, accent = false, highlight = false }) => (
  <div
    className="rounded-2xl p-5 border flex flex-col justify-between"
    style={{
      background: accent
        ? "linear-gradient(135deg,#1d4ed8 0%,#1e40af 100%)"
        : highlight
        ? "linear-gradient(135deg,#0f766e 0%,#0d9488 100%)"
        : "white",
      borderColor: accent || highlight ? "transparent" : "#f1f5f9",
      boxShadow: accent || highlight
        ? "0 8px 24px -4px rgba(29,78,216,0.3)"
        : "0 4px 24px -4px rgba(15,23,42,0.08)",
    }}
  >
    <p className={`text-[11px] font-bold tracking-widest uppercase mb-2 ${accent || highlight ? "text-blue-200" : "text-slate-400"}`}>
      {label}
    </p>
    <p className={`text-2xl font-black ${accent || highlight ? "text-white" : "text-slate-800"}`}>
      {value}
    </p>
    {sub && (
      <p className={`text-xs mt-1 font-medium ${accent || highlight ? "text-blue-200" : "text-slate-400"}`}>
        {sub}
      </p>
    )}
  </div>
);

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

      // sum all meals
      const meals = meal.meals ?? [];
      const total = meals.reduce((sum, day) =>
        sum + (day.meals ?? []).reduce((s, m) => s + m, 0), 0
      );
      setTotalMeals(parseFloat(total.toFixed(1)));

      // per member totals
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

  const totalDeposit = depositMoney.reduce((s, m) => s + (parseFloat(m.amount) || 0), 0);

  // Chart
  const getColor = (amount) => {
    if (amount >= 2500) return "rgba(16,185,129,0.85)";
    if (amount <= 1500) return "rgba(239,68,68,0.85)";
    return "rgba(245,158,11,0.85)";
  };

  const chartData = {
    labels: depositMoney.map(item => item?.name),
    datasets: [
      {
        label: "Amount (tk)",
        data: depositMoney.map(item => item?.amount),
        backgroundColor: depositMoney.map(item => getColor(item.amount)),
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.raw} tk`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 12, weight: "600" }, color: "#64748b" },
      },
      y: {
        grid: { color: "#f1f5f9" },
        ticks: { font: { size: 11 }, color: "#94a3b8" },
      },
    },
  };

  return (
    <div className="px-4 md:px-8 pb-16" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;900&display=swap');`}</style>

      <PageTitle heading="Overview" />

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              label="Daily Cost"
              value={`${dailyTotal} tk`}
              sub="Total food expenses"
              accent
            />
            <StatCard
              label="Utility Cost"
              value={`${utilityTotal} tk`}
              sub="Bills & utilities"
            />
            <StatCard
              label="Per Person Utility"
              value={`${perPersonUtility} tk`}
              sub="Utility ÷ 6 members"
            />
            <StatCard
              label="Meal Rate"
              value={`${mealRate} tk`}
              sub={`Daily cost ÷ ${totalMeals} meals`}
              highlight
            />
          </>
        )}
      </div>

      {/* ── Meal Rate Breakdown ── */}
      {!loading && (
        <div
          className="bg-white rounded-2xl border border-slate-100 p-6 mb-8"
          style={{ boxShadow: "0 4px 24px -4px rgba(15,23,42,0.08)" }}
        >
          {/* <h3 className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-5">
            Meal Rate Breakdown
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Daily Cost", value: dailyTotal, color: "#1d4ed8", unit: " tk" },
              { label: "Total Meals", value: totalMeals, color: "#0f766e", unit: "" },
              { label: "Meal Rate", value: mealRate, color: "#b45309", unit: " tk" },
              { label: "Per Person Utility", value: perPersonUtility, color: "#7c3aed", unit: " tk" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-1 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400">{item.label}</p>
                <p className="text-xl font-black" style={{ color: item.color }}>
                  {item.value}{item.unit}
                </p>
              </div>
            ))}
          </div> */}

          {/* Per Member Meal Count */}
          <div className="mt-6">
            <p className="text-[14px] font-bold tracking-widest uppercase text-slate-700 mb-3">Meal Count Per Member</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {MEMBERS.map((name, i) => (
                <div key={i} className="flex flex-col items-center gap-1 p-3 rounded-xl border border-slate-100 bg-slate-50">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: ["#1d4ed8","#0369a1","#0f766e","#7c3aed","#b45309","#be185d"][i] }}>
                    {name.charAt(0)}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">{name}</span>
                  <span className="text-base font-black text-slate-800">{memberMeals[i] ?? 0}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Formula */}
          {/* <div className="mt-5 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-medium">Formula:</span>
            <span className="text-xs bg-slate-100 text-slate-600 font-mono px-3 py-1 rounded-lg">
              Meal Rate: {dailyTotal} ÷ {totalMeals} = {mealRate} tk/meal &nbsp;|&nbsp; Utility/Person: {utilityTotal} ÷ 6 = {perPersonUtility} tk
            </span>
          </div> */}
        </div>
      )}

      {/* ── Total Cost Per Member ── */}
      {!loading && (
        <div
          className="bg-white rounded-2xl border border-slate-100 p-6 mb-8"
          style={{ boxShadow: "0 4px 24px -4px rgba(15,23,42,0.08)" }}
        >
          <p className="text-[14px] font-bold tracking-widest uppercase text-slate-800 mb-3">Total Cost Per Member</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {MEMBERS.map((name, i) => {
              const memberCost = parseFloat(((memberMeals[i] ?? 0) * mealRate + perPersonUtility).toFixed(2));
              return (
                <div key={i} className="flex flex-col items-center gap-1 p-3 rounded-xl border border-slate-100 bg-slate-50">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: ["#1d4ed8","#0369a1","#0f766e","#7c3aed","#b45309","#be185d"][i] }}
                  >
                    {name.charAt(0)}
                  </span>
                  <span className="text-[14px] font-semibold text-slate-700">{name}</span>
                  <span className="text-base font-black text-slate-800">{memberCost} tk</span>
                </div>
              );
            })}
          </div>
          {/* formula */}
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-medium">Formula:</span>
            <span className="text-xs bg-slate-100 text-slate-600 font-mono px-3 py-1 rounded-lg">
              (Member Meals × {mealRate} tk) + {perPersonUtility} tk utility
            </span>
          </div>
        </div>
      )}

      {/* ── Deposit Chart ── */}
      <div
        className="bg-white rounded-2xl border border-slate-100 p-6"
        style={{ boxShadow: "0 4px 24px -4px rgba(15,23,42,0.08)" }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">
              Deposit Money
            </h3>
            <p className="text-slate-800 font-black text-xl mt-0.5 flex items-center gap-1">
              <TbCurrencyTaka size={20} className="text-blue-600" />
              {totalDeposit} tk
            </p>
          </div>
          {/* Legend */}
          <div className="flex gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block"></span>
              ≥ 2500
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-amber-400 inline-block"></span>
              1500–2500
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-red-500 inline-block"></span>
              ≤ 1500
            </span>
          </div>
        </div>

        {loading ? (
          <div className="animate-pulse h-48 bg-slate-100 rounded-xl"></div>
        ) : depositMoney.length === 0 ? (
          <div className="text-center py-12 text-slate-400">No deposit data yet.</div>
        ) : (
          <Bar data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
};

export default Overview;