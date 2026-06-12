import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useMemoryStore } from "../../store/memorySlice";

const MemoryRadar = () => {
  const { memory } = useMemoryStore();
  const progressByTopic = new Map((memory?.learningProgress || []).map((item) => [
    item.topic,
    item.scoreHistory?.length ? item.scoreHistory.reduce((sum, score) => sum + score, 0) / item.scoreHistory.length : 0,
  ]));
  const data = (memory?.exposureHistory || []).map((item) => ({
    topic: item.topic,
    exposure: item.count,
    avgScore: Math.round(progressByTopic.get(item.topic) || 0),
  }));

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
      <h2 className="text-xl font-semibold text-slate-900">Interview Memory</h2>
      <div className="mt-4 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="topic" />
            <PolarRadiusAxis />
            <Tooltip />
            <Legend />
            <Radar name="Exposure" dataKey="exposure" stroke="#2563eb" fill="#2563eb" fillOpacity={0.25} />
            <Radar name="Avg Score" dataKey="avgScore" stroke="#16a34a" fill="#16a34a" fillOpacity={0.2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MemoryRadar;
