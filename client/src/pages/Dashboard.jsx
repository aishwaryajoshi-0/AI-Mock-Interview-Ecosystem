// MODIFIED
import { useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
import ScoreChart from "../components/dashboard/ScoreChart";
import ProgressBar from "../components/dashboard/ProgressBar";
import SessionHistory from "../components/dashboard/SessionHistory";
import MemoryRadar from "../components/dashboard/MemoryRadar";
import TopicTrendCard from "../components/dashboard/TopicTrendCard";
import SkillRadarChart from "../components/dashboard/SkillRadarChart";
import SkillProfileCard from "../components/dashboard/SkillProfileCard";
import RecommendationSummaryCard from "../components/dashboard/RecommendationSummaryCard";
import { useMemoryStore } from "../store/memorySlice";
import { useSkillStore } from "../store/skillSlice";
import { useRecommendationStore } from "../store/recommendationSlice";
import useAuth from "../hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();
  const userId = user?._id || user?.id;
  const { memory, fetchMemory } = useMemoryStore();
  const { profile, fetchProfile } = useSkillStore();
  const { recommendations, fetchRecommendations } = useRecommendationStore();

  useEffect(() => {
    if (userId) {
      fetchMemory(userId);
      fetchProfile(userId);
      fetchRecommendations(userId);
    }
  }, [fetchMemory, fetchProfile, fetchRecommendations, userId]);

  const sessionData = [
    { id: "1", date: "Jan 16", score: 74, domain: "Behavioral", status: "Completed", targetCompany: "Amazon", targetRole: "SDE-1" },
    { id: "2", date: "Jan 22", score: 81, domain: "Technical", status: "Completed", targetCompany: null, targetRole: null },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 xl:grid-cols-[280px_1fr]">
        <Sidebar />
        <section className="space-y-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
            <p className="text-sm text-slate-500">Welcome back</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Your performance dashboard</h1>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Latest score</p>
              <p className="mt-4 text-4xl font-semibold text-slate-900">93%</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Level</p>
              <p className="mt-4 text-2xl font-semibold text-slate-900">{profile?.overall_level || "Beginner"}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Topics seen</p>
              <p className="mt-4 text-2xl font-semibold text-slate-900">{memory?.coveredTopics?.length || 0}</p>
            </div>
          </div>

          <ScoreChart data={[
            { date: "Jan 10", score: 68 },
            { date: "Jan 17", score: 74 },
            { date: "Jan 24", score: 81 },
            { date: "Jan 31", score: 88 },
            { date: "Feb 07", score: 93 },
          ]} />

          {/* NEW: Interview Memory System */}
          <MemoryRadar />
          <div className="grid gap-4 md:grid-cols-2">
            {(memory?.learningProgress || []).map((topic) => <TopicTrendCard key={topic.topic} {...topic} />)}
          </div>

          {/* NEW: User Skill Profile */}
          <div className="grid gap-6 lg:grid-cols-2">
            <SkillRadarChart profile={profile} />
            <SkillProfileCard profile={profile} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
              <h2 className="mb-6 text-xl font-semibold text-slate-900">Area progress</h2>
              <div className="space-y-4">
                <ProgressBar title="Communication" value={84} />
                <ProgressBar title="Technical skills" value={76} />
                <ProgressBar title="Leadership" value={69} />
              </div>
            </div>
            <SessionHistory sessions={sessionData} />
          </div>

          {/* NEW: Learning Recommendation Engine */}
          <RecommendationSummaryCard recommendations={recommendations.slice(0, 2)} />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
