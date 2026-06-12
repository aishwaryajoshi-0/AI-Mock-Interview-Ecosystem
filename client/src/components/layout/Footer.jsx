import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-slate-500">© {new Date().getFullYear()} MockInterview. All rights reserved.</p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <Link className="hover:text-slate-900" to={ROUTES.HOME}>Home</Link>
          <Link className="hover:text-slate-900" to={ROUTES.DASHBOARD}>Dashboard</Link>
          <Link className="hover:text-slate-900" to={ROUTES.ADMIN}>Admin</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
