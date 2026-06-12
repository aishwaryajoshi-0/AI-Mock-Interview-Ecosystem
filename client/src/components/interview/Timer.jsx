import useTimer from "../../hooks/useTimer";

const Timer = ({ initialSeconds = 300, onFinish }) => {
  const { formatted, seconds, status, isActive, start, pause, reset } = useTimer(initialSeconds, onFinish);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Countdown</p>
          <h3 className="mt-2 text-3xl font-semibold text-slate-900">{formatted}</h3>
        </div>
        <div className={`rounded-2xl px-3 py-2 text-sm font-semibold ${status === "danger" ? "bg-rose-100 text-rose-700" : status === "warning" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
          {status === "danger" ? "Finishing" : status === "warning" ? "Almost there" : "On track"}
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button onClick={isActive ? pause : start} className="rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">
          {isActive ? "Pause" : "Start"}
        </button>
        <button onClick={() => reset(initialSeconds)} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50">Reset</button>
      </div>
      <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-brand-600" style={{ width: `${Math.max(0, (seconds / initialSeconds) * 100)}%` }} />
      </div>
    </div>
  );
};

export default Timer;
