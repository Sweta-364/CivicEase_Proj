import { useEffect, useState } from 'react';
import api from '../../api';
import { useAuth } from '../../context/useAuth';
import { getDepartmentAdminIds, isMainAdmin } from '../../lib/auth';
import { Link } from 'react-router-dom';

const static_card_style = 'rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5';

const STATUS_OPTIONS = [
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Resolved', value: 'resolved' },
];

export default function AdminIssuesPage() {
  const { appUser } = useAuth();
  const [issues, setIssues] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [note, setNote] = useState('');

  const selectedIssue = issues.find((i) => i.id === selectedId);

  async function load() {
    if (isMainAdmin(appUser)) {
      const response = await api.get('/v1/issues');
      setIssues(response.data.items ?? []);
      return;
    }
    const departmentIds = getDepartmentAdminIds(appUser);
    const responses = await Promise.all(departmentIds.map((id) => api.get(`/v1/departments/${id}/issues`)));
    const merged = responses.flatMap((res) => res.data.items ?? []);
    setIssues(merged);
  }

  useEffect(() => {
    if (!appUser) return;
    load().catch((error) => console.error(error));
  }, [appUser]);

  async function updateStatus(status) {
    if (!selectedId) return;
    await api.patch(`/v1/issues/${selectedId}/status`, { status, note: note || null });
    setNote('');
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Administration</p>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Issue Queue</h1>
        </div>
        <Link 
          to="/admin/map" 
          className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-gray-800 transition-colors shadow-sm"
        >
          View on Map
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <div className={`${static_card_style} space-y-2 max-h-[600px] overflow-y-auto`}>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">All Issues</p>
          {issues.map((issue) => (
            <button
              key={issue.id}
              onClick={() => setSelectedId(issue.id)}
              className={`block w-full rounded-xl p-4 text-left text-sm transition-all duration-200 ${
                selectedId === issue.id
                  ? 'bg-sky-50 ring-1 ring-sky-200 shadow-sm'
                  : 'bg-gray-50 ring-1 ring-gray-100 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="font-bold text-gray-900 line-clamp-1">{issue.title || `Issue #${issue.id}`}</p>
                <span className="text-xs text-gray-500 shrink-0 ml-2">#{issue.id}</span>
              </div>
              <p className="line-clamp-2 text-xs text-gray-600 leading-relaxed">{issue.description}</p>
            </button>
          ))}
        </div>

        <div className={static_card_style}>
          {!selectedId && <p className="text-sm text-gray-500">Select an issue to update status.</p>}
          {selectedId && selectedIssue && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedIssue.title || `Issue #${selectedIssue.id}`}</h2>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-blue-700 ring-1 ring-blue-600/20">
                      Status: {selectedIssue.status}
                    </span>
                    <span className="rounded-full bg-orange-50 px-2.5 py-1 font-semibold text-orange-700 ring-1 ring-orange-600/20">
                      Priority: {selectedIssue.priority_level}
                    </span>
                    {selectedIssue.department_name && (
                      <span className="rounded-full bg-purple-50 px-2.5 py-1 font-semibold text-purple-700 ring-1 ring-purple-600/20">
                        Dept: {selectedIssue.department_name}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg ring-1 ring-gray-200">
                  {selectedIssue.description}
                </p>

                {selectedIssue.photo_urls?.length > 0 && (
                  <div className="grid gap-3 grid-cols-2">
                    {selectedIssue.photo_urls.map((url) => (
                      <img key={url} src={url} alt="Issue evidence" className="w-full h-32 object-cover rounded-xl ring-1 ring-black/5 shadow-sm" />
                    ))}
                  </div>
                )}

                {selectedIssue.resolution_photo_url && (
                  <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Completion Proof</p>
                    <img
                      src={selectedIssue.resolution_photo_url}
                      alt="Completion proof"
                      className="w-full h-48 object-cover rounded-xl ring-1 ring-black/5 shadow-sm"
                    />
                    {selectedIssue.resolution_note && <p className="text-sm text-emerald-900">{selectedIssue.resolution_note}</p>}
                  </div>
                )}
              </div>

              <div className="h-px bg-gray-100" />

              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Update Status for <span className="text-gray-900 font-bold">#{selectedId}</span>
                </p>
              <textarea
                className="h-24 w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm transition-colors focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                placeholder="Optional note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((status) => (
                  <button
                    key={status.value}
                    onClick={() => updateStatus(status.value)}
                    className="rounded-xl bg-white ring-1 ring-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm active:scale-[0.98]"
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
