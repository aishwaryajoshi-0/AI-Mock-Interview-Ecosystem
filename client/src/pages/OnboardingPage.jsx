import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { profileAPI } from '../api/profile';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState(null); // 'resume' or 'form'
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [skillProfile, setSkillProfile] = useState({
    primaryDomain: '',
    languages: [],
    frameworks: [],
    experienceLevel: 'Beginner',
    confidence: {
      dsa: 3,
      systemDesign: 3,
      communication: 3,
      behavioral: 3
    }
  });

  const domains = ['Web Development', 'Data Science', 'DSA', 'Mobile Development', 'DevOps', 'Machine Learning'];
  const languages = ['JavaScript', 'Python', 'Java', 'C++', 'TypeScript', 'Go', 'Rust', 'Swift'];
  const frameworks = ['React', 'Vue', 'Angular', 'Node.js', 'Django', 'Spring', 'Express', 'Next.js'];
  const experienceLevels = ['Beginner', 'Intermediate', 'Advanced'];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      toast.error('Please upload a PDF file');
    }
  };

  const handleLanguageToggle = (lang) => {
    setSkillProfile(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }));
  };

  const handleFrameworkToggle = (fw) => {
    setSkillProfile(prev => ({
      ...prev,
      frameworks: prev.frameworks.includes(fw)
        ? prev.frameworks.filter(f => f !== fw)
        : [...prev.frameworks, fw]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (method === 'resume' && !file) {
        toast.error('Please upload your resume');
        setLoading(false);
        return;
      }

      if (method === 'form' && !skillProfile.primaryDomain) {
        toast.error('Please select your primary domain');
        setLoading(false);
        return;
      }

      const data = {
        method,
        skillProfile,
        file
      };

      const response = await profileAPI.completeOnboarding(data);
      
      if (response.success) {
        toast.success('Onboarding completed successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  if (!method) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-4xl w-full">
          <h1 className="text-4xl font-bold text-slate-900 text-center mb-4">Welcome to AI Mock Interview</h1>
          <p className="text-slate-600 text-center mb-12">Let's set up your profile to personalize your interview experience</p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <button
              onClick={() => setMethod('resume')}
              className="group p-8 rounded-3xl border-2 border-slate-200 bg-white hover:border-brand-500 hover:shadow-lg transition-all duration-300"
            >
              <Upload className="w-16 h-16 text-brand-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">Upload Resume</h2>
              <p className="text-slate-600">Upload your resume and we'll automatically extract your skills and experience</p>
            </button>
            
            <button
              onClick={() => setMethod('form')}
              className="group p-8 rounded-3xl border-2 border-slate-200 bg-white hover:border-brand-500 hover:shadow-lg transition-all duration-300"
            >
              <FileText className="w-16 h-16 text-brand-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">Fill Skill Form</h2>
              <p className="text-slate-600">Manually enter your skills and experience level for a more tailored experience</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <button
          onClick={() => setMethod(null)}
          className="text-slate-600 hover:text-slate-900 mb-6 flex items-center gap-2"
        >
          ← Back to options
        </button>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          {method === 'resume' ? 'Upload Your Resume' : 'Tell Us About Your Skills'}
        </h1>
        <p className="text-slate-600 mb-8">
          {method === 'resume' 
            ? 'Upload your PDF resume and we\'ll extract your skills automatically'
            : 'Fill in your skills and experience to personalize your interview experience'
          }
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {method === 'resume' ? (
            <div className="border-2 border-dashed border-slate-300 rounded-3xl p-12 text-center hover:border-brand-500 transition-colors">
              <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="cursor-pointer"
              >
                <p className="text-slate-600 mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-slate-400">PDF files only</p>
              </label>
              {file && (
                <div className="mt-4 flex items-center justify-center gap-2 text-brand-600">
                  <CheckCircle className="w-5 h-5" />
                  <span>{file.name}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Primary Domain</label>
                <select
                  value={skillProfile.primaryDomain}
                  onChange={(e) => setSkillProfile(prev => ({ ...prev, primaryDomain: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  required
                >
                  <option value="">Select your domain</option>
                  {domains.map(domain => (
                    <option key={domain} value={domain}>{domain}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Programming Languages</label>
                <div className="flex flex-wrap gap-2">
                  {languages.map(lang => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => handleLanguageToggle(lang)}
                      className={`px-4 py-2 rounded-full border ${
                        skillProfile.languages.includes(lang)
                          ? 'bg-brand-500 text-white border-brand-500'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-brand-500'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Frameworks</label>
                <div className="flex flex-wrap gap-2">
                  {frameworks.map(fw => (
                    <button
                      key={fw}
                      type="button"
                      onClick={() => handleFrameworkToggle(fw)}
                      className={`px-4 py-2 rounded-full border ${
                        skillProfile.frameworks.includes(fw)
                          ? 'bg-brand-500 text-white border-brand-500'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-brand-500'
                      }`}
                    >
                      {fw}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Experience Level</label>
                <select
                  value={skillProfile.experienceLevel}
                  onChange={(e) => setSkillProfile(prev => ({ ...prev, experienceLevel: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                >
                  {experienceLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">Self-Rated Confidence (1-5)</label>
                {Object.keys(skillProfile.confidence).map(key => (
                  <div key={key}>
                    <label className="block text-sm text-slate-600 mb-1 capitalize">{key}</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={skillProfile.confidence[key]}
                      onChange={(e) => setSkillProfile(prev => ({
                        ...prev,
                        confidence: { ...prev.confidence, [key]: parseInt(e.target.value) }
                      }))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>1</span>
                      <span>{skillProfile.confidence[key]}</span>
                      <span>5</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Processing...' : 'Complete Onboarding'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;
