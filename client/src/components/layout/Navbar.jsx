import { Link, NavLink } from "react-router-dom";
// MODIFIED
import { BookOpen, LogOut, Menu, Sparkles } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link to={ROUTES.HOME} className="flex items-center gap-2 text-lg font-semibold text-brand-600">
          <Sparkles size={24} />
          <span>MockInterview</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink className={({ isActive }) => isActive ? "font-semibold text-brand-600" : "text-slate-600 hover:text-slate-900"} to={ROUTES.HOME}>Home</NavLink>
          <NavLink className={({ isActive }) => isActive ? "font-semibold text-brand-600" : "text-slate-600 hover:text-slate-900"} to={ROUTES.DASHBOARD}>Dashboard</NavLink>
          <NavLink className={({ isActive }) => isActive ? "font-semibold text-brand-600" : "text-slate-600 hover:text-slate-900"} to={ROUTES.INTERVIEW}>Interview</NavLink>
          {/* NEW: Learning Recommendation Engine */}
          <NavLink className={({ isActive }) => isActive ? "inline-flex items-center gap-1 font-semibold text-brand-600" : "inline-flex items-center gap-1 text-slate-600 hover:text-slate-900"} to={ROUTES.RECOMMENDATIONS}><BookOpen size={16} /> Learning Path</NavLink>
          <NavLink className={({ isActive }) => isActive ? "font-semibold text-brand-600" : "text-slate-600 hover:text-slate-900"} to={ROUTES.ADMIN}>Admin</NavLink>
        </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="hidden rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700 md:inline-block">{user?.name || "Candidate"}</span>
              <button onClick={logout} className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <div className="hidden items-center gap-3 md:flex">
              <Link className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50" to={ROUTES.LOGIN}>Login</Link>
              <Link className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700" to={ROUTES.REGISTER}>Register</Link>
            </div>
          )}
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 md:hidden">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
