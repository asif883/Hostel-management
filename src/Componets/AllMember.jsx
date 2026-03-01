import useMembersData from "../Hooks/useMembersData";
import PageTitle from "../SharedItems/PageTitile";

const getRoleBadge = (role) => {
  const styles = {
    admin: "bg-purple-100 text-purple-700",
    manager: "bg-blue-100 text-blue-700",
    member: "bg-green-100 text-green-700",
  };
  const key = role?.toLowerCase();
  const cls = styles[key] || "bg-gray-100 text-gray-600";
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${cls}`}>
      {role}
    </span>
  );
};

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-slate-200"></div>
        <div className="h-4 bg-slate-200 rounded w-28"></div>
      </div>
    </td>
    <td className="px-5 py-4"><div className="h-4 bg-slate-200 rounded w-40"></div></td>
    <td className="px-5 py-4"><div className="h-6 bg-slate-200 rounded-full w-16"></div></td>
  </tr>
);

const AllMember = () => {
  const members = useMembersData();
  const loading = !members;

  return (
    <div className="px-4 md:px-8 pb-16">
      <PageTitle heading="All Members" />

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <p className="text-sm text-gray-500">
            {!loading && (
              <span>
                Total{" "}
                <span className="font-bold text-[#3b5fc0]">{members.length}</span>{" "}
                member{members.length !== 1 ? "s" : ""}
              </span>
            )}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="bg-[#f0f4ff] text-[#3b5fc0] text-left">
                <th className="px-5 py-4 font-semibold">Name</th>
                <th className="px-5 py-4 font-semibold">Email</th>
                <th className="px-5 py-4 font-semibold">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-12 text-gray-400">
                    No members found.
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr
                    key={member?._id}
                    className="hover:bg-blue-50/40 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {/* Avatar with initials */}
                        <div className="w-9 h-9 rounded-full bg-[#dde8ff] text-[#3b5fc0] flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {member?.name?.charAt(0)?.toUpperCase() ?? "?"}
                        </div>
                        <span className="font-medium text-gray-800">{member?.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500">{member?.email}</td>
                    <td className="px-5 py-4">{getRoleBadge(member?.role)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllMember;