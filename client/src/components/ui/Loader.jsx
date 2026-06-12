const Loader = ({ fullScreen = false, label = "Loading..." }) => {
  const baseClasses = "rounded-full border-4 border-brand-300 border-t-brand-600 h-10 w-10 animate-spin";
  return (
    <div className={fullScreen ? "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40" : "flex items-center gap-3"}>
      <div className={baseClasses} />
      <span className={fullScreen ? "text-white" : "text-slate-700"}>{label}</span>
    </div>
  );
};

export default Loader;
