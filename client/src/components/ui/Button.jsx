const variantStyles = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500",
  secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-400",
  danger: "bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-400",
  outline: "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 focus:ring-slate-400",
};

const Button = ({ variant = "primary", className = "", children, ...props }) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
