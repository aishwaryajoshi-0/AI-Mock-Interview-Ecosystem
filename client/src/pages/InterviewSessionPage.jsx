import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mic, MicOff, Video, VideoOff, SkipForward, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { interviewAPI } from '../api/interview';
import { ROUTES } from '../constants/routes';
import useWebcam from '../hooks/useWebcam';
import useSpeechRecognition from '../hooks/useSpeechRecognition';

const InterviewSessionPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [micError, setMicError] = useState(null);

  const { videoRef, start: startWebcam, stop: stopWebcam, error: webcamError } = useWebcam();
  const { isListening, startListening, stopListening, transcript: speechTranscript } = useSpeechRecognition();

  useEffect(() => {
    loadSession();
    return () => {
      if (stopWebcam) stopWebcam();
      if (stopListening) stopListening();
    };
  }, [sessionId]);

  useEffect(() => {
    if (webcamError) {
      setCameraError(webcamError);
    }
  }, [webcamError]);

  useEffect(() => {
    if (speechTranscript) {
      setTranscript(speechTranscript);
    }
  }, [speechTranscript]);

  const loadSession = async () => {
    try {
      const response = await interviewAPI.getSessionById(sessionId);
      if (response.success) {
        setSession(response.data.session);
        setQuestions(response.data.session.questions || []);
        setLoading(false);
      }
    } catch (error) {
      toast.error('Failed to load session');
      navigate(ROUTES.INTERVIEW_SELECT);
    }
  };

  const handleStartAnswer = async () => {
    try {
      if (startWebcam) await startWebcam();
      if (startListening) await startListening();
      setIsRecording(true);
      setTranscript('');
    } catch (error) {
      if (error.name === 'NotAllowedError') {
        setMicError('Microphone access denied. Please allow microphone access to continue.');
      } else {
        toast.error('Failed to start recording');
      }
    }
  };

  const handleStopAndNext = async () => {
    if (!transcript.trim()) {
      toast.error('Please provide an answer before proceeding');
      return;
    }

    setSubmitting(true);
    setIsRecording(false);
    if (stopListening) stopListening();

    try {
      const currentQuestion = questions[currentQuestionIndex];
      await interviewAPI.submitAnswer({
        sessionId,
        questionId: currentQuestion._id,
        answer: transcript
      });

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setTranscript('');
      } else {
        await handleEndSession();
      }
    } catch (error) {
      toast.error('Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkipQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTranscript('');
      if (isRecording) {
        setIsRecording(false);
        if (stopListening) stopListening();
      }
    } else {
      await handleEndSession();
    }
  };

  const handleEndSession = async () => {
    if (stopWebcam) stopWebcam();
    if (stopListening) stopListening();

    try {
      const response = await interviewAPI.endSession({ sessionId });
      if (response.success) {
        navigate(`${ROUTES.INTERVIEW_RESULT.replace(':sessionId', sessionId)}`);
      }
    } catch (error) {
      toast.error('Failed to end session');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading session...</div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Interview Session</h1>
            <p className="text-slate-600">Question {currentQuestionIndex + 1} of {questions.length}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-slate-500">Progress</p>
              <p className="font-semibold text-slate-900">{Math.round(progress)}%</p>
            </div>
            <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Question & Answer */}
          <div className="space-y-6">
            {/* Question Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-soft">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm font-medium">
                  {session?.type || 'Technical'}
                </span>
                {session?.company && (
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                    {session.company}
                  </span>
                )}
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium capitalize">
                  {session?.difficulty || 'Medium'}
                </span>
              </div>
              
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                {currentQuestion?.text || 'Loading question...'}
              </h2>

              {/* Transcript Display */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Your Answer</label>
                <div className="min-h-[150px] p-4 bg-slate-50 rounded-xl border border-slate-200">
                  {transcript || isRecording ? (
                    <p className="text-slate-700">
                      {transcript || 'Listening...'}
                    </p>
                  ) : (
                    <p className="text-slate-400 italic">
                      Your answer will appear here as you speak...
                    </p>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-4 mt-6">
                {!isRecording ? (
                  <button
                    onClick={handleStartAnswer}
                    disabled={submitting}
                    className="flex-1 py-3 px-6 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    <Mic size={20} />
                    Start Answer
                  </button>
                ) : (
                  <button
                    onClick={handleStopAndNext}
                    disabled={submitting}
                    className="flex-1 py-3 px-6 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={20} />
                    {submitting ? 'Submitting...' : 'Stop & Next'}
                  </button>
                )}
                
                <button
                  onClick={handleSkipQuestion}
                  disabled={submitting}
                  className="py-3 px-6 bg-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <SkipForward size={20} />
                  Skip
                </button>
              </div>
            </div>

            {/* Error Messages */}
            {cameraError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-700 text-sm">{cameraError}</p>
              </div>
            )}
            {micError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-700 text-sm">{micError}</p>
              </div>
            )}
          </div>

          {/* Right Column - Webcam */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft">
              <h3 className="font-semibold text-slate-900 mb-4">Camera Feed</h3>
              
              <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden">
                {cameraError ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <VideoOff className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm opacity-75">Camera unavailable</p>
                    </div>
                  </div>
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                )}
                
                {/* Recording Indicator */}
                {isRecording && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-sm font-medium">Recording</span>
                  </div>
                )}
              </div>

              {/* Camera Controls */}
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => isRecording ? (stopListening && stopListening()) : (startListening && startListening())}
                  className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                  {isListening ? 'Mute' : 'Unmute'}
                </button>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-brand-50 rounded-2xl border border-brand-200 p-6">
              <h3 className="font-semibold text-brand-900 mb-3">Tips for a Great Answer</h3>
              <ul className="space-y-2 text-sm text-brand-700">
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <span>Speak clearly and at a moderate pace</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <span>Structure your answer with examples</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <span>Be specific and use technical terms appropriately</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <span>Maintain eye contact with the camera</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSessionPage;
