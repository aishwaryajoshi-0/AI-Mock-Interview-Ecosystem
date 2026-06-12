import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const ScoreChart = ({ data }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Performance</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">Score history</h3>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 12 }} />
            <YAxis tick={{ fill: "#64748b", fontSize: 12 }} domain={[0, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#3d6dff" strokeWidth={4} dot={{ fill: "#1d4ed8" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ScoreChart;
