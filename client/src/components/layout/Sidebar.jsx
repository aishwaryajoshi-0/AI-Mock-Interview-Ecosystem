import { Link } from "react-router-dom";
// MODIFIED
import { Activity, BookOpen, FileText, LayoutDashboard, ShieldCheck } from "lucide-react";
import { ROUTES } from "../../constants/routes";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, path: ROUTES.DASHBOARD },
  { label: "Interview", icon: Activity, path: ROUTES.INTERVIEW },
  // NEW: Learning Recommendation Engine
  { label: "Learning Path", icon: BookOpen, path: ROUTES.RECOMMENDATIONS },
  { label: "Profile", icon: FileText, path: ROUTES.PROFILE },
  { label: "Admin", icon: ShieldCheck, path: ROUTES.ADMIN },
];

const Sidebar = () => {
  return (
    <aside className="hidden w-72 shrink-0 space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft xl:block">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Workspace</p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-900">Interview Center</h2>
      </div>
      <nav className="space-y-3">
        {items.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <item.icon size={18} />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="rounded-3xl bg-brand-50 p-5 text-slate-700">
        <p className="text-sm font-semibold text-brand-900">Advanced AI review</p>
        <p className="mt-3 text-sm text-slate-600">Track performance, sharpen your skills, and manage sessions from one dashboard.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
