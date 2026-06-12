import Badge from "../ui/Badge";

const CompanyProfileCard = ({ profile }) => {
  if (!profile) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{profile.company}</h3>
          <p className="text-sm text-slate-500">{profile.role}</p>
        </div>
        <Badge variant="info">Active</Badge>
      </div>
      <div className="mt-5 space-y-4">
        <div>
          <p className="mb-2 text-sm font-medium text-slate-700">Difficulty</p>
          <div className="flex h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="bg-emerald-500" style={{ width: `${profile.difficulty_easy}%` }} />
            <div className="bg-amber-500" style={{ width: `${profile.difficulty_medium}%` }} />
            <div className="bg-rose-500" style={{ width: `${profile.difficulty_hard}%` }} />
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-slate-700">Interview split</p>
          <div className="flex h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="bg-sky-500" style={{ width: `${profile.behavioral_weight}%` }} />
            <div className="bg-violet-500" style={{ width: `${profile.technical_weight}%` }} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {(profile.favorite_topics || []).map((topic) => <Badge key={topic} variant="warning">{topic}</Badge>)}
        </div>
        <p className="text-sm italic text-slate-600">{profile.special_notes}</p>
      </div>
    </div>
  );
};

export default CompanyProfileCard;
