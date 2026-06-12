import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const Admin = () => {
  const [questions, setQuestions] = useState([
    { id: "q1", domain: "Behavioral", question: "Tell me about a time you led a team.", difficulty: "Medium" },
    { id: "q2", domain: "Technical", question: "Explain a technical challenge you solved.", difficulty: "Hard" },
    { id: "q3", domain: "Product", question: "How do you prioritize competing deadlines?", difficulty: "Medium" },
  ]);

  const [filter, setFilter] = useState("All");
  const filteredQuestions = useMemo(
    () => questions.filter((item) => filter === "All" || item.domain === filter),
    [filter, questions]
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 xl:grid-cols-[280px_1fr]">
        <Sidebar />
        <section className="space-y-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-500">Question bank</p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">Admin panel</h1>
              </div>
              <Button variant="primary">
                <Plus size={16} /> Add question
              </Button>
            </div>
          </div>

          <Card>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">Filter by domain</p>
                <select value={filter} onChange={(e) => setFilter(e.target.value)} className="mt-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm">
                  {['All', 'Behavioral', 'Technical', 'Product'].map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-4">Domain</th>
                    <th className="px-4 py-4">Question</th>
                    <th className="px-4 py-4">Difficulty</th>
                    <th className="px-4 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredQuestions.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 font-medium text-slate-900">{item.domain}</td>
                      <td className="px-4 py-4">{item.question}</td>
                      <td className="px-4 py-4">{item.difficulty}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <button className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-200"><Pencil size={14} /> Edit</button>
                          <button className="inline-flex items-center gap-2 rounded-2xl bg-rose-100 px-3 py-2 text-sm text-rose-700 transition hover:bg-rose-200"><Trash2 size={14} /> Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Admin;
