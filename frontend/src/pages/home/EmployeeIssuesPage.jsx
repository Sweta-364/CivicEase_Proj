import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

const static_card_style = 'rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5';

function statusBadge(status) {
  const map = {
    in_progress: { label: 'In Progress', cls: 'bg-amber-50 text-amber-800 ring-amber-100' },
    resolved: { label: 'Resolved', cls: 'bg-emerald-50 text-emerald-800 ring-emerald-100' },
  };
  const info = map[status] || { label: 'Open', cls: 'bg-sky-50 text-sky-800 ring-sky-100' };
  return (
    <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ring-1 ${info.cls}`}>
      {info.label}
    </span>
  );
}

function formatDepartmentLabel(issue) {
  if (issue.department_name) return issue.department_name;
  if (issue.department_id != null) return `Department #${issue.department_id}`;
  return 'Unassigned department';
}

export default function EmployeeIssuesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setError('');
        const response = await api.get('/v1/employee/issues');
        setItems(response.data.items ?? []);
      } catch (loadError) {
        setError(loadError?.response?.data?.detail || 'Failed to load assigned issues.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p className="text-sm text-gray-500 animate-pulse-glow">Loading assigned issues...</p>;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Employee Panel</p>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Assigned Issues</h1>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          These complaints were assigned to you by your department admin. Open any issue to upload work proof after it is completed.
        </p>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {items.length === 0 && !error && (
        <div className={`${static_card_style} flex flex-col items-center justify-center p-12 text-center`}>
          <p className="text-sm font-medium text-gray-500">No issues are assigned to you yet.</p>
        </div>
      )}

      <div className="space-y-4">
        {items.map((issue) => (
          <Link
            key={issue.id}
            to={`/employee/issues/${issue.id}`}
            className={`${static_card_style} block transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-gray-900">{issue.title || `Issue #${issue.id}`}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {formatDepartmentLabel(issue)} | Assigned to {issue.assigned_person_name || 'You'}
                </p>
              </div>
              {statusBadge(issue.status)}
            </div>

            <p className="mt-3 text-sm text-gray-600 line-clamp-3">{issue.description}</p>

            {issue.photo_urls?.length > 0 && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {issue.photo_urls.slice(0, 2).map((url) => (
                  <img
                    key={url}
                    src={url}
                    alt="Original issue evidence"
                    className="h-36 w-full rounded-xl object-cover ring-1 ring-black/5"
                  />
                ))}
              </div>
            )}

            {issue.resolution_photo_url && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                Completion proof uploaded successfully.
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
