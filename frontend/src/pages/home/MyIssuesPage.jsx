import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

const static_card_style = 'rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5';
const ISSUE_REFRESH_KEY = 'civicease_issue_refresh_token';

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
  if (issue.department_id == null) return 'Unassigned';
  if (issue.department_name) return `${issue.department_name} (#${issue.department_id})`;
  return `Unknown Department (#${issue.department_id})`;
}

function formatAssigneeLabel(issue) {
  if (issue.assigned_person_name) return issue.assigned_person_name;
  if (issue.assigned_person_id != null) return `Unknown Person (#${issue.assigned_person_id})`;
  return 'Not assigned';
}

export default function MyIssuesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadIssues({ background = false } = {}) {
    if (!background) {
      setLoading(true);
    }
    setError('');

    try {
      const response = await api.get('/v1/issues/me');
      setItems(response.data.items ?? []);
    } catch (loadError) {
      console.error(loadError);
      setError(loadError?.response?.data?.detail || 'Failed to load your issues.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadIssues();

    function handleFocus() {
      void loadIssues({ background: true });
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        void loadIssues({ background: true });
      }
    }

    function handleStorage(event) {
      if (event.key === ISSUE_REFRESH_KEY) {
        void loadIssues({ background: true });
      }
    }

    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleStorage);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorage);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  if (loading) return <p className="text-sm text-gray-500 animate-pulse-glow">Loading issues...</p>;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Your Reports</p>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">My Issues</h1>
      </div>

      {error && (
        <div className={`${static_card_style} border border-red-200 bg-red-50 text-sm text-red-700`}>
          {error}
        </div>
      )}

      {items.length === 0 && (
        <div className={`${static_card_style} flex flex-col items-center justify-center p-12 text-center`}>
          <p className="text-sm font-medium text-gray-500">No issues yet. Start by reporting a civic issue.</p>
        </div>
      )}

      <div className="space-y-3">
        {items.map((issue) => (
          <Link
            key={issue.id}
            to={`/home/issues/${issue.id}`}
            className={`${static_card_style} block transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-bold text-gray-900 line-clamp-2">{issue.title || `Issue #${issue.id}`}</p>
              {statusBadge(issue.status)}
            </div>

            {issue.photo_urls?.length > 0 && (
              <div className="mt-3 overflow-hidden rounded-lg bg-gray-100 max-h-48 relative ring-1 ring-black/5">
                <img src={issue.photo_urls[0]} alt="Issue thumbnail" className="w-full object-cover" />
              </div>
            )}

            <p className="mt-3 text-sm text-gray-600 line-clamp-2">{issue.description}</p>
            <p className="mt-3 text-xs font-medium uppercase tracking-wider text-gray-400">
              Priority: {issue.priority_level?.toUpperCase()} | Department: {formatDepartmentLabel(issue)}
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-gray-400">
              Assigned Person: {formatAssigneeLabel(issue)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
