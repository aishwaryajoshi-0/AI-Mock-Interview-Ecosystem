import Badge from "../ui/Badge";

const FeedbackPanel = ({ feedback }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Review</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">Feedback summary</h3>
        </div>
        <Badge variant={feedback?.overallScore >= 80 ? "success" : feedback?.overallScore >= 60 ? "warning" : "danger"}>
          {feedback?.status || "Awaiting"}
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Score</p>
          <p className="mt-2 text-4xl font-semibold text-slate-900">{feedback?.overallScore ?? "--"}%</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 rounded-3xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">Strengths</p>
            <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
              {feedback?.strengths?.map((item) => (
                <li key={item}>{item}</li>
              )) || <li>Strong structure and tone</li>}
            </ul>
          </div>
          <div className="space-y-2 rounded-3xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">Improvements</p>
            <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
              {feedback?.improvements?.map((item) => (
                <li key={item}>{item}</li>
              )) || <li>Use more concise examples</li>}
            </ul>
          </div>
        </div>

        <div className="rounded-3xl bg-brand-50 p-4">
          <p className="text-sm font-semibold text-brand-900">Keywords to emphasize</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {feedback?.keywords?.map((keyword) => (
              <Badge key={keyword} variant="info">{keyword}</Badge>
            )) || ["leadership", "communication", "results"].map((keyword) => (
              <Badge key={keyword} variant="info">{keyword}</Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPanel;
