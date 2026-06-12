import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, ChevronDown, ChevronUp, Code, FileText, Play } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import ProgressBar from "../components/dashboard/ProgressBar";
import { useRecommendationStore } from "../store/recommendationSlice";
import { useSkillStore } from "../store/skillSlice";
import useAuth from "../hooks/useAuth";
import { ROUTES } from "../constants/routes";

const iconByType = {
  video: Play,
  article: FileText,
  practice: Code,
  course: BookOpen,
};

const Recommendations = () => {
  const { user } = useAuth();
  const userId = user?._id || user?.id;
  const { recommendations, fetchRecommendations, markResourceDone, markTaskDone } = useRecommendationStore();
  const { profile, fetchProfile } = useSkillStore();
  const [openTopic, setOpenTopic] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchRecommendations(userId);
      fetchProfile(userId);
    }
  }, [fetchProfile, fetchRecommendations, userId]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 xl:grid-cols-[280px_1fr]">
        <Sidebar />
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
            <div>
              <p className="text-sm text-slate-500">Your Learning Path</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Recommended practice</h1>
            </div>
            <Badge variant="info">{profile?.overall_level || "beginner"}</Badge>
          </div>

          {!recommendations.length && (
            <div className="grid place-items-center rounded-lg border border-slate-200 bg-white p-12 text-center shadow-soft">
              <BookOpen size={40} className="text-brand-600" />
              <h2 className="mt-4 text-xl font-semibold text-slate-900">Complete an interview to get recommendations</h2>
              <a className="mt-5 inline-flex rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white" href={ROUTES.INTERVIEW}>Start interview</a>
            </div>
          )}

          {recommendations.map((rec) => {
            const resourceDone = rec.resources?.filter((item) => item.isCompleted).length || 0;
            const resourceTotal = rec.resources?.length || 0;
            const planDone = rec.weeklyPlan?.filter((item) => item.isCompleted).length || 0;
            return (
              <motion.div key={rec._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-2xl font-semibold text-slate-900">{rec.weakTopic}</h2>
                  <Badge variant="warning">{resourceDone}/{resourceTotal} resources</Badge>
                </div>
                <div className="mt-5">
                  <ProgressBar title="Resource completion" value={resourceTotal ? Math.round((resourceDone / resourceTotal) * 100) : 0} />
                </div>
                <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }} className="mt-5 space-y-3">
                  {(rec.resources || []).map((resource, index) => {
                    const Icon = iconByType[resource.type] || BookOpen;
                    return (
                      <motion.div key={`${resource.title}-${index}`} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                        <Icon size={18} className="text-brand-600" />
                        <a className={`flex-1 text-sm font-medium ${resource.isCompleted ? "text-slate-400 line-through" : "text-slate-800"}`} href={resource.url} target="_blank" rel="noreferrer">{resource.title}</a>
                        <input type="checkbox" checked={resource.isCompleted} onChange={() => markResourceDone(rec._id, index)} />
                      </motion.div>
                    );
                  })}
                </motion.div>
                <button className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700" onClick={() => setOpenTopic(openTopic === rec._id ? null : rec._id)}>
                  Practice Questions {openTopic === rec._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openTopic === rec._id && (
                  <motion.ol initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700">
                    {(rec.practiceQuestions || []).map((question) => <li key={question}>{question}</li>)}
                  </motion.ol>
                )}
                <div className="mt-6">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">7-Day Plan</h3>
                    <span className="text-sm text-slate-500">{planDone}/7</span>
                  </div>
                  <div className="space-y-2">
                    {(rec.weeklyPlan || []).map((task) => (
                      <label key={task.day} className={`flex items-center gap-3 rounded-lg p-3 text-sm ${task.isCompleted ? "bg-emerald-50 text-emerald-800" : task.day === 1 ? "bg-sky-50 text-sky-800" : "bg-slate-50 text-slate-700"}`}>
                        <input type="checkbox" checked={task.isCompleted} onChange={() => markTaskDone(rec._id, task.day)} />
                        <span className="font-semibold">Day {task.day}</span>
                        <span>{task.task}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.section>
      </main>
    </div>
  );
};

export default Recommendations;
