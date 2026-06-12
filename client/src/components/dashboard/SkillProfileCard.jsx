import { motion } from "framer-motion";
import Badge from "../ui/Badge";
import ProgressBar from "./ProgressBar";

const topics = [
  ["DBMS", "dbms_score"],
  ["OOPS", "oops_score"],
  ["OS", "os_score"],
  ["CN", "cn_score"],
  ["DSA", "dsa_score"],
  ["HR", "hr_score"],
  ["Aptitude", "aptitude_score"],
];

const SkillProfileCard = ({ profile }) => {
  if (!profile) return null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Skill Profile</h2>
        <Badge variant={profile.overall_level === "advanced" ? "success" : profile.overall_level === "intermediate" ? "warning" : "info"}>
          {profile.overall_level}
        </Badge>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {topics.map(([label, key]) => (
          <motion.div key={key} variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
            <ProgressBar title={label} value={Math.round(profile[key] || 0)} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SkillProfileCard;
