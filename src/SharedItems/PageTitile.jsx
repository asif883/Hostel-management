/* eslint-disable react/prop-types */

const PageTitle = ({ heading }) => {
  return (
    <div className="my-8">
      <h1
        className="text-2xl md:text-3xl font-black text-slate-800 capitalize tracking-tight"
      >
        {heading}
      </h1>
      <div className="mt-2 flex items-center gap-2">
        <span className="h-1 w-8 rounded-full bg-[#1d4ed8] inline-block" />
        <span className="h-1 w-3 rounded-full bg-blue-300 inline-block" />
        <span className="h-1 w-1.5 rounded-full bg-blue-200 inline-block" />
      </div>
    </div>
  );
};

export default PageTitle;