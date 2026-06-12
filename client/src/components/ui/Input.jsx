import clsx from "clsx";

const Input = ({ label, error, icon, className, ...props }) => {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label && <span className="mb-2 block">{label}</span>}
      <div className="relative">
        {icon && <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>}
        <input
          className={clsx(
            "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100",
            icon && "pl-12",
            error && "border-rose-400 focus:border-rose-500 focus:ring-rose-100",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
    </label>
  );
};

export default Input;
