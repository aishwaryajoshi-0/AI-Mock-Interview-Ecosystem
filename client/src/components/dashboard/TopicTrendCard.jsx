import { motion } from "framer-motion";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";
import Badge from "../ui/Badge";

const variantByTrend = {
  improving: "success",
  declining: "danger",
  stable: "info",
};

const TopicTrendCard = ({ topic, trend = "stable", scoreHistory = [] }) => {
  const data = scoreHistory.map((score, index) => ({ index: index + 1, score }));

  return (
    <motion.div
      initial={{ x: -16, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-slate-900">{topic}</h3>
        <Badge variant={variantByTrend[trend] || "info"}>{trend}</Badge>
      </div>
      <div className="mt-4 h-20">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default TopicTrendCard;
