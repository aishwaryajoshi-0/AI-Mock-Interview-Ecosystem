// MODIFIED
import { useMemo, useRef, useState } from "react";
import { ArrowRight, Briefcase, Circle } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import QuestionCard from "../components/interview/QuestionCard";
import VideoFeed from "../components/interview/VideoFeed";
import Timer from "../components/interview/Timer";
import FeedbackPanel from "../components/interview/FeedbackPanel";
import Card from "../components/ui/Card";
import CompanySelector from "../components/interview/CompanySelector";
import FollowUpBanner from "../components/interview/FollowUpBanner";
import DifficultyIndicator from "../components/interview/DifficultyIndicator";
import { useInterviewStore } from "../store/interviewSlice";

const Interview = () => {
  const previousDifficulty = useRef("medium");
  const {
    targetCompany,
    targetRole,
    setCompanyTarget,
    currentDifficulty,
    setDifficulty,
    pendingFollowUp,
    setPendingFollowUp,
    clearFollowUp,
  } = useInterviewStore();
  const [isFollowUpMode, setIsFollowUpMode] = useState(false);
  const [sessionFeedback] = useState({
    overallScore: 82,
    status: "Strong",
    strengths: ["Clear structure", "Strong examples"],
    improvements: ["Shorten answers", "Use more metrics"],
    keywords: ["impact", "leadership", "collaboration"],
  });

  const question = useMemo(
    () => pendingFollowUp && isFollowUpMode
      ? { index: 1, category: "Follow-up", title: "Follow-up", text: pendingFollowUp.text || pendingFollowUp }
      : { index: 1, category: "Behavioral", title: "Tell me about a time you solved a difficult problem.", text: "Describe the challenge, your approach, the outcome, and the lessons learned." },
    [isFollowUpMode, pendingFollowUp]
  );

  if (!targetCompany) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
          {/* NEW: Company Intelligence */}
          <CompanySelector onConfirm={(company, role, profile) => setCompanyTarget(company, role, profile)} />
        </main>
      </div>
    );
  }

  const mockSubmit = () => {
    previousDifficulty.current = currentDifficulty;
    setDifficulty(currentDifficulty === "medium" ? "hard" : currentDifficulty);
    setPendingFollowUp({ text: "Which tradeoff mattered most in your chosen approach?", isFollowUp: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
            <div className="text-sm font-semibold text-slate-700">{targetCompany} / {targetRole}</div>
            {/* NEW: Adaptive Difficulty + Follow-Up Question Engine */}
            <DifficultyIndicator difficulty={currentDifficulty} previousDifficulty={previousDifficulty.current} />
          </div>
          <VideoFeed emotion="Engaged" />
          <FollowUpBanner
            followUpQuestion={pendingFollowUp}
            onAnswer={() => setIsFollowUpMode(true)}
            onSkip={() => {
              setIsFollowUpMode(false);
              clearFollowUp();
            }}
          />
          <QuestionCard question={question} isFollowUp={isFollowUpMode} />
          <Card className="flex flex-wrap gap-4 p-6">
            {["Submit answer", "Skip question", "Mark for review"].map((action) => (
              <button key={action} onClick={action === "Submit answer" ? mockSubmit : undefined} className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">
                <Circle size={16} /> {action}
              </button>
            ))}
          </Card>
        </div>

        <div className="space-y-6">
          <Timer initialSeconds={420} onFinish={() => console.log("Interview finished")}/>
          <FeedbackPanel feedback={sessionFeedback} />
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <Briefcase size={24} className="text-brand-600" />
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Next milestone</p>
                <h3 className="text-lg font-semibold text-slate-900">Complete the final scenario</h3>
              </div>
            </div>
            <p className="mt-4 text-slate-600">Finish your mock interview by answering the final question and requesting a full performance report.</p>
            <button className="mt-6 inline-flex items-center gap-2 rounded-3xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">
              Continue session <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Interview;
