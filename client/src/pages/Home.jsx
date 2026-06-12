import { Link } from "react-router-dom";
import { ArrowRight, Shield, Clock3, BarChart3, Sparkles } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { ROUTES } from "../constants/routes";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
        <section className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
              <Sparkles size={18} /> AI-powered interview coaching
            </p>
            <h1 className="mt-8 text-5xl font-semibold tracking-tight text-slate-900">Practice better interviews with live feedback and data-driven progress.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Prepare for technical and behavioral interviews with real mock sessions, score tracking, and personalized coaching insights.</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to={ROUTES.REGISTER} className="inline-flex items-center rounded-3xl bg-brand-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-brand-700">
                Get started
                <ArrowRight size={18} />
              </Link>
              <Link to={ROUTES.LOGIN} className="inline-flex items-center rounded-3xl border border-slate-200 bg-white px-6 py-4 text-base font-semibold text-slate-700 transition hover:bg-slate-50">
                Sign in
              </Link>
            </div>
          </div>
          <div className="rounded-[2.5rem] bg-white p-8 shadow-soft">
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                { icon: Shield, title: "Secure sessions", description: "Encrypted practice interviews with protected user flow." },
                { icon: Clock3, title: "Real-time timer", description: "Stay on track with countdown timers and pacing cues." },
                { icon: BarChart3, title: "Progress reports", description: "Track skill growth across multiple sessions." },
                { icon: Sparkles, title: "Smart feedback", description: "Receive structured guidance that helps you improve." },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-slate-200 p-5">
                  <item.icon className="h-6 w-6 text-brand-600" />
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="mt-20 grid gap-10 lg:grid-cols-3">
          {[
            { title: "How it works", text: "Choose a mock interview, answer questions and get instant evaluation." },
            { title: "Why it matters", text: "Build confidence, surface improvement areas, and sharpen delivery." },
            { title: "What you get", text: "Live webcam review, score tracking, and custom feedback insights." },
          ].map((item) => (
            <article key={item.title} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
              <h2 className="text-xl font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-4 text-slate-600">{item.text}</p>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
