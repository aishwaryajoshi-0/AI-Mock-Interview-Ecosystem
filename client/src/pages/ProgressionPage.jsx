import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Eye, Calendar, Clock, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { progressAPI } from '../api/progress';
import { ROUTES } from '../constants/routes';

const ProgressionPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalSessions: 0,
    averageScore: 0,
    scoresByType: {},
    domainScores: {},
    strongestSkill: null,
    weakestSkill: null,
    scoreOverTime: [],
    sessionHistory: []
  });

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      const response = await progressAPI.getProgressOverview();
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      toast.error('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0m';
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading progress data...</div>
      </div>
    );
  }

  // Prepare chart data
  const scoreOverTimeData = data.scoreOverTime.map(item => ({
    date: formatDate(item.date),
    score: Math.round(item.score),
    type: item.type
  }));

  const scoresByTypeData = Object.entries(data.scoresByType).map(([type, data]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    score: Math.round(data.averageScore),
    count: data.count
  }));

  const domainScoresData = Object.entries(data.domainScores).map(([domain, score]) => ({
    domain,
    score: Math.round(score)
  }));

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Your Progress</h1>
          <p className="text-slate-600">Track your interview performance over time</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft">
            <div className="flex items-center gap-3 mb-2">
              <Eye className="w-5 h-5 text-brand-500" />
              <p className="text-sm text-slate-500">Total Sessions</p>
            </div>
            <p className="text-3xl font-bold text-slate-900">{data.totalSessions}</p>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-brand-500" />
              <p className="text-sm text-slate-500">Average Score</p>
            </div>
            <p className="text-3xl font-bold text-slate-900">{Math.round(data.averageScore)}%</p>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <p className="text-sm text-slate-500">Strongest Skill</p>
            </div>
            <p className="text-lg font-bold text-slate-900 capitalize">
              {data.strongestSkill || 'N/A'}
            </p>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-red-500" />
              <p className="text-sm text-slate-500">Weakest Skill</p>
            </div>
            <p className="text-lg font-bold text-slate-900 capitalize">
              {data.weakestSkill || 'N/A'}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Score Over Time */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Score Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={scoreOverTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Scores by Type */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Average Score by Interview Type</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoresByTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Domain Performance */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Performance by Domain</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={domainScoresData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="domain" type="category" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Session History */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Session History</h2>
          
          {data.sessionHistory.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600">No sessions completed yet</p>
              <button
                onClick={() => navigate(ROUTES.INTERVIEW_SELECT)}
                className="mt-4 px-6 py-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors"
              >
                Start Your First Interview
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Company</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Difficulty</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Score</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Duration</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.sessionHistory.map((session) => (
                    <tr key={session.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 text-sm text-slate-700">
                        {formatDate(session.date)}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-700 capitalize">
                        {session.type}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-700 capitalize">
                        {session.company || '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-700 capitalize">
                        {session.difficulty}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-slate-900">
                        {Math.round(session.score)}%
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-700">
                        {formatDuration(session.duration)}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => navigate(`${ROUTES.INTERVIEW_RESULT.replace(':sessionId', session.id)}`)}
                          className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressionPage;
