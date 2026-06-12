// MODIFIED
import { formatDate } from "../../utils/formatDate";

const SessionHistory = ({ sessions = [] }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Reports</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">Session history</h3>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Domain</th>
              {/* NEW: Company Intelligence */}
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sessions.map((session) => (
              <tr key={session.id} className="hover:bg-slate-50">
                <td className="px-4 py-4 font-medium text-slate-900">{formatDate(session.date)}</td>
                <td className="px-4 py-4">{session.domain}</td>
                {/* NEW: Company Intelligence */}
                <td className="px-4 py-4">{session.targetCompany || "-"}</td>
                <td className="px-4 py-4">{session.targetRole || "-"}</td>
                <td className="px-4 py-4">{session.score}%</td>
                <td className="px-4 py-4">{session.status}</td>
              </tr>
            ))}
            {!sessions.length && (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-slate-500">No interview sessions yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SessionHistory;
