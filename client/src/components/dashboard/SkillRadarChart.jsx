import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";

const SkillRadarChart = ({ profile }) => {
  const data = [
    { topic: "DBMS", score: profile?.dbms_score || 0 },
    { topic: "OOPS", score: profile?.oops_score || 0 },
    { topic: "OS", score: profile?.os_score || 0 },
    { topic: "CN", score: profile?.cn_score || 0 },
    { topic: "DSA", score: profile?.dsa_score || 0 },
    { topic: "HR", score: profile?.hr_score || 0 },
    { topic: "Aptitude", score: profile?.aptitude_score || 0 },
  ];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
      <h2 className="text-xl font-semibold text-slate-900">Skill Radar</h2>
      <div className="mt-4 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="topic" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Tooltip />
            <Radar name="Score" dataKey="score" stroke="#2563eb" fill="#2563eb" fillOpacity={0.3} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SkillRadarChart;
