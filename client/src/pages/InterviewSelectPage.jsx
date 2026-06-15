import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Code, Users, Building, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { interviewAPI } from '../api/interview';
import { ROUTES } from '../constants/routes';

const InterviewSelectPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');
  const [numQuestions, setNumQuestions] = useState(5);

  const interviewTypes = [
    { id: 'hr', label: 'HR/Behavioral', icon: Users, description: 'Behavioral and HR questions' },
    { id: 'technical', label: 'Technical', icon: Code, description: 'Technical and system design questions' },
    { id: 'dsa', label: 'DSA', icon: Code, description: 'Data structures and algorithms' },
    { id: 'company-specific', label: 'Company-Specific', icon: Building, description: 'Questions from specific companies' },
  ];

  const companies = [
    { id: 'amazon', label: 'Amazon' },
    { id: 'microsoft', label: 'Microsoft' },
    { id: 'deshaw', label: 'DE Shaw' },
  ];

  const difficulties = ['easy', 'medium', 'hard'];
  const questionCounts = [5, 10, 15];

  const handleStartInterview = async () => {
    if (!selectedType) {
      toast.error('Please select an interview type');
      return;
    }

    if (selectedType === 'company-specific' && !selectedCompany) {
      toast.error('Please select a company');
      return;
    }

    setLoading(true);

    try {
      const data = {
        type: selectedType,
        company: selectedType === 'company-specific' ? selectedCompany : null,
        difficulty,
        numQuestions,
        domain: selectedType === 'company-specific' ? 'General' : selectedType
      };

      const response = await interviewAPI.startSession(data);

      if (response.success) {
        const sessionId = response.data.session._id;
        navigate(`${ROUTES.INTERVIEW_SESSION.replace(':sessionId', sessionId)}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Start New Interview</h1>
        <p className="text-slate-600 mb-8">Select your interview preferences to begin</p>

        {/* Interview Type Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Interview Type</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {interviewTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => {
                    setSelectedType(type.id);
                    if (type.id !== 'company-specific') {
                      setSelectedCompany(null);
                    }
                  }}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    selectedType === type.id
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <Icon className={`w-8 h-8 mb-3 ${selectedType === type.id ? 'text-brand-500' : 'text-slate-400'}`} />
                  <h3 className="font-semibold text-slate-900">{type.label}</h3>
                  <p className="text-sm text-slate-600 mt-1">{type.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Company Selection (only for company-specific) */}
        {selectedType === 'company-specific' && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Select Company</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {companies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => setSelectedCompany(company.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedCompany === company.id
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <Briefcase className={`w-6 h-6 mx-auto mb-2 ${selectedCompany === company.id ? 'text-brand-500' : 'text-slate-400'}`} />
                  <span className="font-medium text-slate-900">{company.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Difficulty Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Difficulty Level</h2>
          <div className="flex gap-4">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`px-6 py-3 rounded-xl border-2 font-medium transition-all capitalize ${
                  difficulty === diff
                    ? 'border-brand-500 bg-brand-500 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Number of Questions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Number of Questions</h2>
          <div className="flex gap-4">
            {questionCounts.map((count) => (
              <button
                key={count}
                onClick={() => setNumQuestions(count)}
                className={`px-6 py-3 rounded-xl border-2 font-medium transition-all ${
                  numQuestions === count
                    ? 'border-brand-500 bg-brand-500 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartInterview}
          disabled={loading || !selectedType}
          className="w-full py-4 px-6 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? 'Starting Interview...' : 'Start Interview'}
          {!loading && <ArrowRight size={20} />}
        </button>
      </div>
    </div>
  );
};

export default InterviewSelectPage;
