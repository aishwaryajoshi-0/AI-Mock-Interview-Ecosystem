// MODIFIED
import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import OnboardingPage from "../pages/OnboardingPage";
import InterviewSelectPage from "../pages/InterviewSelectPage";
import InterviewSessionPage from "../pages/InterviewSessionPage";
import InterviewResultPage from "../pages/InterviewResultPage";
import Dashboard from "../pages/Dashboard";
import ProgressionPage from "../pages/ProgressionPage";
import Profile from "../pages/Profile";
import Recommendations from "../pages/Recommendations";
import Admin from "../pages/Admin";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import { profileAPI } from "../api/profile";

const OnboardingGuard = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const response = await profileAPI.getProfile();
      if (response.success && response.data.onboardingComplete) {
        setOnboardingComplete(true);
      }
    } catch (error) {
      console.error('Failed to check onboarding status');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  }

  if (!onboardingComplete) {
    return <Navigate to={ROUTES.ONBOARDING} replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.ONBOARDING} element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
        
        {/* Dashboard Routes wrapped in DashboardLayout */}
        <Route element={<ProtectedRoute><OnboardingGuard><DashboardLayout /></OnboardingGuard></ProtectedRoute>}>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.PROGRESSION} element={<ProgressionPage />} />
          <Route path={ROUTES.INTERVIEW_SELECT} element={<InterviewSelectPage />} />
          <Route path={ROUTES.INTERVIEW_SESSION} element={<InterviewSessionPage />} />
          <Route path={ROUTES.INTERVIEW_RESULT} element={<InterviewResultPage />} />
          <Route path={ROUTES.RECOMMENDATIONS} element={<Recommendations />} />
          <Route path={ROUTES.PROFILE} element={<Profile />} />
          <Route path={ROUTES.ADMIN} element={<Admin />} />
        </Route>
        
        {/* Legacy Interview Route - redirect to select */}
        <Route path={ROUTES.INTERVIEW} element={<ProtectedRoute><Navigate to={ROUTES.INTERVIEW_SELECT} replace /></ProtectedRoute>} />
        
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
