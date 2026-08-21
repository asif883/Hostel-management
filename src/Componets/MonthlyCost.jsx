import { useEffect, useState } from "react";
import PageTitle from "../SharedItems/PageTitile";
import useMembersData from "../Hooks/useMembersData";

const BASE_URL = "https://hostel-management-server-ten.vercel.app";
const MEAL_MEMBERS = ["Asif", "Latif", "Ebadul", "Moklesur", "Shobuj", "Mahmudur"];
const HOME_RENT = 2500;

const formatMoney = (amount) => `${amount.toFixed(2)} tk`;
const normalizeName = (name) => String(name ?? "").trim().toLowerCase();

const MonthlyCost = () => {
	const members = useMembersData();
	const [data, setData] = useState({ deposits: [], dailyCosts: [], utilities: [], meals: [] });
	const [loading, setLoading] = useState(true);
	const currentDate = new Date();
	const month = currentDate.getMonth();
	const year = currentDate.getFullYear();
	const monthName = currentDate.toLocaleDateString("en-US", { month: "long" });

	useEffect(() => {
		Promise.all([
			fetch(`${BASE_URL}/deposit-money`).then((response) => response.json()),
			fetch(`${BASE_URL}/daily-cost`).then((response) => response.json()),
			fetch(`${BASE_URL}/utility-cost`).then((response) => response.json()),
			fetch(`${BASE_URL}/daily-meal`).then((response) => response.json()),
		])
			.then(([deposits, dailyCosts, utilities, meals]) => {
				setData({
					deposits: Array.isArray(deposits) ? deposits : deposits?.value ?? [],
					dailyCosts: dailyCosts?.dailyCost ?? [],
					utilities: utilities?.utilityCost ?? [],
					meals: meals?.meals ?? [],
				});
			})
			.catch(() => setData({ deposits: [], dailyCosts: [], utilities: [], meals: [] }))
			.finally(() => setLoading(false));
	}, []);

	const isCurrentMonth = (date) => {
		const dateValue = String(date ?? "").slice(0, 10);
		const [dateYear, dateMonth] = dateValue.split("-").map(Number);
		return dateYear === year && dateMonth === month + 1;
	};

	const monthlyDeposits = data.deposits.filter((deposit) => isCurrentMonth(deposit?.date));
	const monthlyDailyCosts = data.dailyCosts.filter((cost) => isCurrentMonth(cost?.date));
	const monthlyUtilities = data.utilities.filter((cost) => isCurrentMonth(cost?.date));
	const monthlyMeals = data.meals.filter((day) => isCurrentMonth(day?.date));
	const dailyCostTotal = monthlyDailyCosts.reduce((sum, cost) => sum + (parseFloat(cost?.cost) || 0), 0);
	const utilityTotal = monthlyUtilities.reduce((sum, cost) => sum + (parseFloat(cost?.cost) || 0), 0);
	const totalMeals = monthlyMeals.reduce(
		(sum, day) => sum + (day?.meals ?? []).reduce((dayTotal, meal) => dayTotal + (parseFloat(meal) || 0), 0),
		0
	);
	const mealRate = totalMeals > 0 ? dailyCostTotal / totalMeals : 0;
	const utilityPerMember = utilityTotal / MEAL_MEMBERS.length;
	const memberRecords = Array.isArray(members) ? members : members?.value ?? [];
	const memberNames = MEAL_MEMBERS.map((shortName) => (
		memberRecords.find((member) => normalizeName(member?.name).includes(normalizeName(shortName)))?.name?.trim() || shortName
	));

	const rows = memberNames.map((name, index) => {
		const mealCount = monthlyMeals.reduce((sum, day) => sum + (parseFloat(day?.meals?.[index]) || 0), 0);
		const deposit = monthlyDeposits.reduce((sum, item) => (
			(normalizeName(item?.name).includes(normalizeName(name)) || normalizeName(name).includes(normalizeName(item?.name)))
				? sum + (parseFloat(item?.amount) || 0)
				: sum
		), 0);
		const mealCost = mealCount * mealRate;
		const totalCost = mealCost + utilityPerMember + HOME_RENT;
		return { name, deposit, mealCost, utility: utilityPerMember, totalCost, balance: deposit - totalCost };
	});

	return (
		<div className="px-4 md:px-8 pb-16 ">
			<PageTitle heading="Monthly Cost" />
			<p className="-mt-5 mb-7 text-sm font-semibold text-slate-500">{monthName} {year}</p>

			{/* Summary Cards */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-7">
				<div className="bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200 rounded-2xl p-4 md:p-5 shadow-sm">
					<p className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-amber-600">Food Cost</p>
					<p className="mt-1 md:mt-2 text-xl md:text-2xl font-black text-amber-700">{formatMoney(dailyCostTotal)}</p>
					<p className="mt-0.5 text-[10px] md:text-xs text-amber-400 font-medium">This month</p>
				</div>

				<div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 rounded-2xl p-4 md:p-5 shadow-sm">
					<p className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-emerald-600">Total Meal</p>
					<p className="mt-1 md:mt-2 text-xl md:text-2xl font-black text-emerald-700">{totalMeals.toFixed(1)}</p>
					<p className="mt-0.5 text-[10px] md:text-xs text-emerald-400 font-medium">This month</p>
				</div>

				<div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-2xl p-4 md:p-5 shadow-sm">
					<p className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-blue-600">Meal Rate</p>
					<p className="mt-1 md:mt-2 text-xl md:text-2xl font-black text-blue-700">{formatMoney(mealRate)}</p>
					<p className="mt-0.5 text-[10px] md:text-xs text-blue-400 font-medium">Per meal</p>
				</div>
			
				
				<div className="bg-gradient-to-br from-violet-50 to-violet-100/50 border border-violet-200 rounded-2xl p-4 md:p-5 shadow-sm">
					<p className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-violet-600">Total Utility Cost</p>
					<p className="mt-1 md:mt-2 text-xl md:text-2xl font-black text-violet-700">{formatMoney(utilityTotal)}</p>
					<p className="mt-0.5 text-[10px] md:text-xs text-violet-400 font-medium">This month</p>
				</div>
			</div>

			{/* Table */}
			<div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full  text-sm">
						<thead>
							<tr className="bg-gradient-to-r from-[#1a3a7a] to-[#2a5298] text-white">
								<th className="px-4 md:px-5 py-3 md:py-4 text-left font-semibold text-xs md:text-sm tracking-wider">
									Member
								</th>
								<th className="px-4 md:px-5 py-3 md:py-4 text-right font-semibold text-xs md:text-sm tracking-wider">
									Deposit
								</th>
								<th className="px-4 md:px-5 py-3 md:py-4 text-right font-semibold text-xs md:text-sm tracking-wider">
									Meal Cost
								</th>
								<th className="px-4 md:px-5 py-3 md:py-4 text-right font-semibold text-xs md:text-sm tracking-wider">
									Utility
								</th>
								<th className="px-4 md:px-5 py-3 md:py-4 text-right font-semibold text-xs md:text-sm tracking-wider">
								Home Rent
								</th>
								<th className="px-4 md:px-5 py-3 md:py-4 text-right font-semibold text-xs md:text-sm tracking-wider">
									Total Cost
								</th>
								<th className="px-4 md:px-5 py-3 md:py-4 text-right font-semibold text-xs md:text-sm tracking-wider">
									Due / Gets
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{loading ? (
								<tr>
									<td colSpan={7} className="px-5 py-14 text-center text-slate-400 font-medium">
										<div className="flex items-center justify-center gap-3">
											<svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
											Loading monthly costs...
										</div>
									</td>
								</tr>
							) : rows.length === 0 ? (
								<tr>
									<td colSpan={7} className="px-5 py-14 text-center text-slate-400 font-medium">
										No members found.
									</td>
								</tr>
							) : (
								rows.map((row, idx) => (
									<tr 
										key={row.name} 
										className={`hover:bg-blue-50/60 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
									>
										<td className="px-4 md:px-5 py-3 md:py-4 font-semibold text-slate-800 text-sm md:text-base">
											{row.name}
										</td>
										<td className="px-4 md:px-5 py-3 md:py-4 text-right  text-slate-700 text-sm font-bold">
											{formatMoney(row.deposit)}
										</td>
										<td className="px-4 md:px-5 py-3 md:py-4 text-right font-bold text-slate-700 text-sm">
											{formatMoney(row.mealCost)}
										</td>
										<td className="px-4 md:px-5 py-3 md:py-4 text-right font-bold text-slate-700 text-sm">
											{formatMoney(row.utility)}
										</td>
										<td className="px-4 md:px-5 py-3 md:py-4 text-right font-bold text-slate-700 text-sm">
											{formatMoney(HOME_RENT)}
										</td>
										<td className="px-4 md:px-5 py-3 md:py-4 text-right font-bold text-slate-900 text-sm">
											{formatMoney(row.totalCost)}
										</td>
										<td className={`px-4 md:px-5 py-3 md:py-4 text-right font-bold text-sm`}>
											{row.balance < 0 ? (
												<span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
													<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
													</svg>
													Due {formatMoney(Math.abs(row.balance))}
												</span>
											) : (
												<span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
													<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
													</svg>
													Gets {formatMoney(row.balance)}
												</span>
											)}
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				{/* Footer with summary */}
				{!loading && rows.length > 0 && (
					<div className="border-t border-gray-200 bg-slate-50/80 px-4 md:px-5 py-3 md:py-4 flex items-center justify-end text-xs md:text-sm">
						<span className="text-slate-500 font-medium">
							Net Due: <span className="font-bold text-red-600">
								{formatMoney(rows.reduce((sum, row) => sum + (row.balance < 0 ? Math.abs(row.balance) : 0), 0))}
							</span>
						</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default MonthlyCost;