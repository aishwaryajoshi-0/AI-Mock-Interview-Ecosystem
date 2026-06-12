const ProgressBar = ({ title, value }) => {
  return (
    <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700">{title}</p>
        <p className="text-sm font-semibold text-slate-900">{value}%</p>
      </div>
      <div className="h-3 rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-brand-600 transition-all duration-500" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
};

export default ProgressBar;
