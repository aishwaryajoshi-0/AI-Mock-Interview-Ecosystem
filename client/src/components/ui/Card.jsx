const Card = ({ className = "", children }) => {
  return (
    <div className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-soft ${className}`}>
      {children}
    </div>
  );
};

export default Card;
