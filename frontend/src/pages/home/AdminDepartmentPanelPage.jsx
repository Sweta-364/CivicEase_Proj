import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';
import { Skeleton } from '../../components/Skeletons';

const static_card_style = 'rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5';

function issueTitle(issue) {
  return issue.title || `Issue #${issue.id}`;
}

function assigneeLabel(issue) {
  if (issue.assigned_person_name) return issue.assigned_person_name;
  if (issue.assigned_person_id != null) return `Unknown Person (#${issue.assigned_person_id})`;
  return 'Unassigned';
}

export default function AdminDepartmentPanelPage() {
  const { departmentId } = useParams();
  const [panel, setPanel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  async function loadPanel() {
    const response = await api.get(`/v1/departments/${departmentId}/panel`);
    setPanel(response.data);
  }

  useEffect(() => {
    async function load() {
      try {
        setError('');
        await loadPanel();
      } catch (loadError) {
        setError(loadError?.response?.data?.detail || 'Failed to load department panel.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [departmentId]);

  async function addPerson(event) {
    event.preventDefault();
    try {
      setError('');
      await api.post(`/v1/departments/${departmentId}/people`, {
        name,
        email: email || null,
      });
      setName('');
      setEmail('');
      await loadPanel();
    } catch (actionError) {
      setError(actionError?.response?.data?.detail || 'Failed to add person.');
    }
  }

  async function deletePerson(personId) {
    const confirmed = window.confirm('Delete this person from the department?');
    if (!confirmed) return;
    try {
      setError('');
      await api.delete(`/v1/departments/${departmentId}/people/${personId}`);
      await loadPanel();
    } catch (actionError) {
      setError(actionError?.response?.data?.detail || 'Failed to delete person.');
    }
  }

  async function assignIssue(issueId, personId) {
    if (!personId) return;
    try {
      setError('');
      await api.post(`/v1/departments/${departmentId}/issues/${issueId}/assignee`, { person_id: Number(personId) });
      await loadPanel();
    } catch (actionError) {
      setError(actionError?.response?.data?.detail || 'Failed to assign person.');
    }
  }

  async function updateIssueStatus(issueId, status) {
    try {
      setError('');
      await api.patch(`/v1/issues/${issueId}/status`, { status, note: null });
      await loadPanel();
    } catch (actionError) {
      setError(actionError?.response?.data?.detail || 'Failed to update issue status.');
    }
  }

  if (loading) return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-8 w-2/5" />
        <Skeleton className="h-4 w-3/5" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5 space-y-4">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-9 w-24 rounded-xl" />
          {[1, 2].map((i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5 space-y-3">
          <Skeleton className="h-3 w-32" />
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
      </div>
    </div>
  );
  if (!panel) return <p className="text-sm text-red-600">Department panel not found.</p>;

  const people = panel.people ?? [];
  const issues = panel.issues ?? [];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Department Panel</p>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{panel.department?.name || `Department #${departmentId}`}</h1>
        <p className="mt-2 text-sm text-gray-600">{panel.department?.description}</p>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className={`${static_card_style} space-y-4`}>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Available People</p>
          <form onSubmit={addPerson} className="space-y-3">
            <input
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              placeholder="Person name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
            <input
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              placeholder="Email (optional)"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <button className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-gray-800">
              Add Person
            </button>
          </form>

          <div className="space-y-2">
            {people.length === 0 && <p className="text-sm text-gray-500">No people added yet.</p>}
            {people.map((person) => (
              <div key={person.id} className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2.5 ring-1 ring-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{person.name}</p>
                  <p className="text-xs text-gray-500">{person.email || 'No email'}</p>
                </div>
                <button
                  onClick={() => deletePerson(person.id)}
                  className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-500"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={`${static_card_style} space-y-3`}>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Department Issues</p>
          {issues.length === 0 && <p className="text-sm text-gray-500">No issues assigned to this department yet.</p>}
          {issues.map((issue) => (
            <div key={issue.id} className="rounded-xl bg-gray-50 p-4 ring-1 ring-gray-100">
              <p className="text-sm font-bold text-gray-900">{issueTitle(issue)}</p>
              <p className="mt-1 text-xs text-gray-600 whitespace-pre-wrap">{issue.description}</p>
              {issue.photo_urls?.length > 0 && (
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {issue.photo_urls.map((url) => (
                    <img
                      key={url}
                      src={url}
                      alt="Issue evidence"
                      className="h-28 w-full rounded-lg object-cover ring-1 ring-black/5"
                    />
                  ))}
                </div>
              )}
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Status: {issue.status} | Priority: {issue.priority_level}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Assigned To: {assigneeLabel(issue)}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <select
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700"
                  defaultValue=""
                  onChange={(event) => assignIssue(issue.id, event.target.value)}
                >
                  <option value="" disabled>
                    Assign person
                  </option>
                  {people.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => updateIssueStatus(issue.id, 'in_progress')}
                  className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-white hover:bg-amber-400"
                >
                  Mark In Progress
                </button>
                <button
                  onClick={() => updateIssueStatus(issue.id, 'resolved')}
                  className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-500"
                >
                  Mark Resolved
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
