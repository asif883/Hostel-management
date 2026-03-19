const Loading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-5">
      {/* Animated dots */}
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-3 h-3 rounded-full bg-[#1d4ed8] inline-block"
            style={{
              animation: "bounce 1.2s infinite ease-in-out",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <p className="text-[16px] font-bold tracking-widest uppercase text-slate-600">
        Royal Bachelor
      </p>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Loading;