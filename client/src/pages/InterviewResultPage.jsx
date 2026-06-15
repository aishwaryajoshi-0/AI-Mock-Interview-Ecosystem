import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { interviewAPI } from '../api/interview';
import { progressAPI } from '../api/progress';
import { ROUTES } from '../constants/routes';

const InterviewResultPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  const [session, setSession] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, [sessionId]);

  const loadResults = async () => {
    try {
      const [sessionResponse, feedbackResponse] = await Promise.all([
        interviewAPI.getSessionById(sessionId),
        progressAPI.getSessionFeedback(sessionId)
      ]);

      if (sessionResponse.success) {
        setSession(sessionResponse.data.session);
      }
      if (feedbackResponse.success) {
        setFeedbacks(feedbackResponse.data.feedbacks);
      }
    } catch (error) {
      toast.error('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const getVerdictIcon = (verdict) => {
    switch (verdict) {
      case 'correct':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'incorrect':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getVerdictBadge = (verdict) => {
    switch (verdict) {
      case 'correct':
        return 'bg-green-100 text-green-700';
      case 'incorrect':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const handleRetake = () => {
    navigate(ROUTES.INTERVIEW_SELECT);
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading results...</div>
      </div>
    );
  }

  const score = session?.overallScore || 0;
  const scoreColor = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(ROUTES.DASHBOARD)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <button
            onClick={handleRetake}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors"
          >
            <RotateCcw size={20} />
            Retake Similar Interview
          </button>
        </div>

        {/* Score Overview */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-soft mb-8">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <div className="text-center">
                <p className="text-sm text-slate-500 mb-2">Overall Score</p>
                <p className={`text-5xl font-bold ${scoreColor}`}>
                  {Math.round(score)}%
                </p>
              </div>
            </div>
            <div className="md:col-span-3 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Interview Type</p>
                  <p className="font-semibold text-slate-900 capitalize">{session?.type || 'Technical'}</p>
                </div>
                {session?.company && (
                  <div>
                    <p className="text-sm text-slate-500">Company</p>
                    <p className="font-semibold text-slate-900 capitalize">{session.company}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-500">Difficulty</p>
                  <p className="font-semibold text-slate-900 capitalize">{session?.difficulty || 'Medium'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Duration</p>
                  <p className="font-semibold text-slate-900">{formatDuration(session?.duration || 0)}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500">Date</p>
                <p className="font-semibold text-slate-900">
                  {new Date(session?.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Question Breakdown */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Question Breakdown</h2>
          
          {feedbacks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-soft text-center">
              <p className="text-slate-600">No feedback available yet. Evaluation may still be in progress.</p>
            </div>
          ) : (
            feedbacks.map((feedback, index) => (
              <div key={feedback._id || index} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium text-slate-500">Question {index + 1}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getVerdictBadge(feedback.verdict)}`}>
                        {feedback.verdict?.toUpperCase() || 'PARTIAL'}
                      </span>
                    </div>
                    <p className="text-slate-900 font-medium mb-2">
                      {feedback.questionId?.text || 'Question text not available'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getVerdictIcon(feedback.verdict)}
                    <span className="text-2xl font-bold text-slate-900">
                      {Math.round(feedback.finalScore || 0)}%
                    </span>
                  </div>
                </div>

                {/* User's Answer */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-slate-700 mb-2">Your Answer</p>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-slate-700">{feedback.transcript || 'No transcript available'}</p>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-slate-500">Content</p>
                    <p className="font-semibold text-slate-900">{Math.round(feedback.contentScore || 0)}%</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-slate-500">Keywords</p>
                    <p className="font-semibold text-slate-900">{Math.round(feedback.keywordScore || 0)}%</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-slate-500">Confidence</p>
                    <p className="font-semibold text-slate-900">{Math.round(feedback.confidenceScore || 0)}%</p>
                  </div>
                </div>

                {/* Suggestion */}
                {feedback.suggestion && (
                  <div className="bg-brand-50 rounded-xl p-4">
                    <p className="text-sm font-medium text-brand-900 mb-1">Suggestion</p>
                    <p className="text-sm text-brand-700">{feedback.suggestion}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate(ROUTES.DASHBOARD)}
            className="flex-1 py-4 px-6 bg-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-300 transition-colors"
          >
            Back to Dashboard
          </button>
          <button
            onClick={handleRetake}
            className="flex-1 py-4 px-6 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors"
          >
            Retake Similar Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewResultPage;
