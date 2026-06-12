import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { ROUTES } from "../../constants/routes";

const RecommendationSummaryCard = ({ recommendations = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
      <div className="flex items-center gap-3">
        <BookOpen className="text-brand-600" size={22} />
        <h2 className="text-xl font-semibold text-slate-900">Learning Path</h2>
      </div>
      <div className="mt-5 space-y-4">
        {recommendations.length ? recommendations.map((rec) => {
          const total = rec.resources?.length || 0;
          const done = rec.resources?.filter((item) => item.isCompleted).length || 0;
          const pct = total ? Math.round((done / total) * 100) : 0;
          return (
            <div key={rec._id || rec.weakTopic} className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
              <div>
                <p className="font-semibold text-slate-900">{rec.weakTopic}</p>
                <p className="text-sm text-slate-500">{done}/{total} resources complete</p>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-full border-4 border-brand-200 text-sm font-semibold text-brand-700">{pct}%</div>
            </div>
          );
        }) : <p className="text-sm text-slate-500">Complete an interview to unlock</p>}
      </div>
      <Button className="mt-5 w-full" onClick={() => navigate(ROUTES.RECOMMENDATIONS)}>View Full Plan</Button>
    </div>
  );
};

export default RecommendationSummaryCard;
