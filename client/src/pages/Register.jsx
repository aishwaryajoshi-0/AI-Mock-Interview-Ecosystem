import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import RegisterForm from "../components/auth/RegisterForm";
import Card from "../components/ui/Card";
import Navbar from "../components/layout/Navbar";

const Register = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto flex min-h-[calc(100vh-96px)] max-w-4xl items-center justify-center px-4 py-16 sm:px-6">
        <Card className="w-full max-w-xl">
          <div className="mb-8 space-y-3 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Create account</p>
            <h1 className="text-3xl font-semibold text-slate-900">Start your training journey</h1>
            <p className="text-sm text-slate-600">Sign up for guided mock interviews and performance analytics.</p>
          </div>
          <RegisterForm />
          <p className="mt-6 text-center text-sm text-slate-600">
            Already registered? <Link className="font-semibold text-brand-600 hover:text-brand-700" to={ROUTES.LOGIN}>Login</Link>
          </p>
        </Card>
      </main>
    </div>
  );
};

export default Register;
