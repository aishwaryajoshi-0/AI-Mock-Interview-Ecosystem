// MODIFIED
import Badge from "../ui/Badge";

const QuestionCard = ({ question, isFollowUp = false }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Question {question.index}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{question.title}</h3>
        </div>
        <div className="flex gap-2">
          {isFollowUp && <Badge variant="warning">Follow-Up</Badge>}
          <Badge variant="info">{question.category}</Badge>
        </div>
      </div>
      <p className="text-slate-700 leading-relaxed">{question.text}</p>
    </div>
  );
};

export default QuestionCard;
