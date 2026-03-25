import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';
import { IssueDetailSkeleton } from '../../components/Skeletons';

const static_card_style = 'rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5';

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

export default function IssueDetailPage() {
  const { issueId } = useParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await api.get(`/v1/issues/${issueId}`);
        setIssue(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [issueId]);

  if (loading) return <IssueDetailSkeleton />;
  if (!issue) return <p className="text-sm text-red-600">Issue not found or access denied.</p>;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Issue #{issue.id}</p>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{issue.title || 'Untitled Issue'}</h1>
      </div>

      <div className={static_card_style}>
        <p className="text-sm text-gray-700 leading-relaxed">{issue.description}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600">
            Status: {issue.status}
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600">
            Priority: {issue.priority_level}
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600">
            Department: {formatDepartmentLabel(issue)}
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600">
            Assigned Person: {formatAssigneeLabel(issue)}
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600">
            Location: {issue.latitude}, {issue.longitude}
          </span>
        </div>
      </div>

      {issue.photo_urls?.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {issue.photo_urls.map((url) => (
            <img key={url} src={url} alt="Issue evidence" className="w-full rounded-2xl ring-1 ring-black/5 object-cover shadow-sm" />
          ))}
        </div>
      )}

      {issue.photo_keys?.length > 0 && (
        <div className={static_card_style}>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Photo Keys</p>
          <ul className="space-y-2">
            {issue.photo_keys.map((key) => (
              <li key={key} className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600 ring-1 ring-gray-200">{key}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
