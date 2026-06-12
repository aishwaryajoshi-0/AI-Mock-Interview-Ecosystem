// MODIFIED
import { useEffect, useState } from "react";
import { UploadCloud, UserCircle2 } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { useSkillStore } from "../store/skillSlice";
import useAuth from "../hooks/useAuth";

const topics = [
  ["DBMS", "dbms_score"],
  ["OOPS", "oops_score"],
  ["OS", "os_score"],
  ["CN", "cn_score"],
  ["DSA", "dsa_score"],
  ["HR", "hr_score"],
  ["Aptitude", "aptitude_score"],
];

const Profile = () => {
  const { user } = useAuth();
  const userId = user?._id || user?.id;
  const { profile, fetchProfile } = useSkillStore();
  const [profileState] = useState({
    name: user?.name || "Jane Doe",
    email: user?.email || "jane.doe@example.com",
    skills: ["Communication", "Problem solving", "Leadership"],
  });

  useEffect(() => {
    if (userId) fetchProfile(userId);
  }, [fetchProfile, userId]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 xl:grid-cols-[280px_1fr]">
        <Sidebar />
        <section className="space-y-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-500">My profile</p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">Candidate information</h1>
              </div>
              <div className="inline-flex items-center gap-3 rounded-3xl bg-slate-50 px-5 py-4 text-sm text-slate-700">
                <UserCircle2 size={20} /> Account active
              </div>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-3xl bg-brand-50 p-3 text-brand-600">
                  <UserCircle2 size={24} />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Profile</p>
                  <h2 className="text-xl font-semibold text-slate-900">{profileState.name}</h2>
                </div>
              </div>
              <p className="text-sm text-slate-600">{profileState.email}</p>
              <Badge variant="info">{profile?.overall_level || "beginner"}</Badge>
            </Card>
            <Card className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-slate-900">Resume upload</h2>
              <p className="mt-3 text-sm text-slate-600">Upload an updated resume so interviewers and AI evaluation models can reference your latest experience.</p>
              <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-700">
                <p className="font-semibold text-slate-900">Upload a CV</p>
                <button className="inline-flex items-center gap-2 rounded-3xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">
                  <UploadCloud size={18} /> Upload resume
                </button>
              </div>
            </Card>
          </div>

          {/* NEW: User Skill Profile */}
          <Card>
            <h2 className="text-xl font-semibold text-slate-900">Skill breakdown</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Topic</th>
                    <th className="px-4 py-3">Score</th>
                    <th className="px-4 py-3">Sessions</th>
                    <th className="px-4 py-3">Last Updated</th>
                    <th className="px-4 py-3">Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {topics.map(([label, key]) => {
                    const score = Math.round(profile?.[key] || 0);
                    const level = score > 75 ? "advanced" : score >= 50 ? "intermediate" : "beginner";
                    return (
                      <tr key={key}>
                        <td className="px-4 py-4 font-medium text-slate-900">{label}</td>
                        <td className="px-4 py-4">{score}%</td>
                        <td className="px-4 py-4">{profile?.session_count || 0}</td>
                        <td className="px-4 py-4">{profile?.last_updated ? new Date(profile.last_updated).toLocaleDateString() : "-"}</td>
                        <td className="px-4 py-4"><Badge variant={level === "advanced" ? "success" : level === "intermediate" ? "warning" : "info"}>{level}</Badge></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Profile;
