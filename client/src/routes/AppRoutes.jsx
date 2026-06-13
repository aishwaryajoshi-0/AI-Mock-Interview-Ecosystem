// MODIFIED
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Interview from "../pages/Interview";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Recommendations from "../pages/Recommendations";
import Admin from "../pages/Admin";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.INTERVIEW} element={<ProtectedRoute><Interview /></ProtectedRoute>} />
        <Route path={ROUTES.DASHBOARD} element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        {/* NEW: Learning Recommendation Engine */}
        <Route path={ROUTES.RECOMMENDATIONS} element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
        <Route path={ROUTES.PROFILE} element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path={ROUTES.ADMIN} element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
