import { motion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";

const level = { easy: 1, medium: 2, hard: 3 };
const styles = {
  easy: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-rose-100 text-rose-700",
};

const DifficultyIndicator = ({ difficulty = "medium", previousDifficulty }) => {
  const increased = previousDifficulty && level[difficulty] > level[previousDifficulty];
  const decreased = previousDifficulty && level[difficulty] < level[previousDifficulty];

  return (
    <motion.div key={difficulty} initial={{ scale: 0.92 }} animate={{ scale: 1 }} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${styles[difficulty]}`}>
      {increased && <TrendingUp size={16} />}
      {decreased && <TrendingDown size={16} />}
      {difficulty}
    </motion.div>
  );
};

export default DifficultyIndicator;
