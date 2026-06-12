import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "../constants/routes";
import Navbar from "../components/layout/Navbar";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto flex min-h-[calc(100vh-96px)] items-center justify-center px-4 py-16 sm:px-6">
        <div className="max-w-xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-soft">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-600">404 error</p>
          <h1 className="mt-6 text-4xl font-semibold text-slate-900">Page not found</h1>
          <p className="mt-4 text-slate-600">The page you are looking for does not exist or may have been moved.</p>
          <Link to={ROUTES.HOME} className="mt-8 inline-flex items-center gap-2 rounded-3xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">
            <ArrowLeft size={18} /> Return home
          </Link>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
