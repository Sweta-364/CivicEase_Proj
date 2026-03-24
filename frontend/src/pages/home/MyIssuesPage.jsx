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

export default function MyIssuesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await api.get('/v1/issues/me');
        setItems(response.data.items ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p className="text-sm text-gray-500 animate-pulse-glow">Loading issues...</p>;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Your Reports</p>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">My Issues</h1>
      </div>

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
              <p className="text-sm font-bold text-gray-900 line-clamp-2">{issue.description}</p>
              {statusBadge(issue.status)}
            </div>
            <p className="mt-3 text-xs font-medium uppercase tracking-wider text-gray-400">
              Priority: {issue.priority_level?.toUpperCase()} · Department: {issue.department_id ?? 'Unassigned'}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
