import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import LoginForm from "../components/auth/LoginForm";
import Card from "../components/ui/Card";
import Navbar from "../components/layout/Navbar";

const Login = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto flex min-h-[calc(100vh-96px)] max-w-4xl items-center justify-center px-4 py-16 sm:px-6">
        <Card className="w-full max-w-xl">
          <div className="mb-8 space-y-3 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Welcome back</p>
            <h1 className="text-3xl font-semibold text-slate-900">Sign in to your account</h1>
            <p className="text-sm text-slate-600">Enter your email and password to access your interview dashboard.</p>
          </div>
          <LoginForm />
          <p className="mt-6 text-center text-sm text-slate-600">
            Don&apos;t have an account? <Link className="font-semibold text-brand-600 hover:text-brand-700" to={ROUTES.REGISTER}>Register</Link>
          </p>
        </Card>
      </main>
    </div>
  );
};

export default Login;
