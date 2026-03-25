import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import api from '../../api';

const static_card_style = 'rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5';

function statusBadge(status) {
  const map = {
    in_progress: { label: 'In Progress', cls: 'bg-amber-50 text-amber-800 ring-amber-100' },
    pending_review: { label: 'Pending Review', cls: 'bg-sky-50 text-sky-800 ring-sky-100' },
    resolved: { label: 'Resolved', cls: 'bg-emerald-50 text-emerald-800 ring-emerald-100' },
  };
  const info = map[status] || { label: 'Open', cls: 'bg-gray-50 text-gray-800 ring-gray-100' };
  return (
    <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ring-1 ${info.cls}`}>
      {info.label}
    </span>
  );
}

function formatTimestamp(value) {
  if (!value) return 'Pending';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Pending';
  return date.toLocaleString();
}

export default function EmployeeIssueDetailPage() {
  const { issueId } = useParams();
  const fileInputRef = useRef(null);
  const [issue, setIssue] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function loadIssue() {
    const response = await api.get(`/v1/employee/issues/${issueId}`);
    setIssue(response.data);
  }

  useEffect(() => {
    async function load() {
      try {
        setError('');
        await loadIssue();
      } catch (loadError) {
        setError(loadError?.response?.data?.detail || 'Failed to load the assigned issue.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [issueId]);

  async function handleStartWork() {
    try {
      setBusy(true);
      setError('');
      setMessage('Marking the issue as in progress...');
      const response = await api.post(`/v1/employee/issues/${issueId}/start`);
      setIssue(response.data);
      setMessage('Issue marked as in progress.');
    } catch (actionError) {
      setError(actionError?.response?.data?.detail || 'Failed to update issue status.');
      setMessage('');
    } finally {
      setBusy(false);
    }
  }

  async function handleComplete(event) {
    event.preventDefault();
    if (!photo) {
      setError('Please choose one completion image before submitting.');
      return;
    }

    try {
      setBusy(true);
      setError('');
      setMessage('Preparing proof upload...');

      const uploadMeta = await api.post(`/v1/employee/issues/${issueId}/proof-upload-url`, {
        file_name: photo.name,
      });

      if (!uploadMeta.data.signed_upload_url) {
        throw new Error('Failed to prepare proof upload. Please try again.');
      }

      setMessage('Uploading completion proof...');
      await axios.put(uploadMeta.data.signed_upload_url, photo, {
        headers: { 'Content-Type': photo.type || 'application/octet-stream' },
      });

      setMessage('Submitting resolution...');
      const response = await api.post(`/v1/employee/issues/${issueId}/complete`, {
        photo_key: uploadMeta.data.photo_key,
        note: note || null,
      });

      setIssue(response.data);
      setPhoto(null);
      setNote('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setMessage('Work submitted for review successfully.');
    } catch (actionError) {
      setError(actionError?.response?.data?.detail || actionError.message || 'Failed to submit work.');
      setMessage('');
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p className="text-sm text-gray-500 animate-pulse-glow">Loading assigned issue...</p>;
  if (!issue) return <p className="text-sm text-red-600">Assigned issue not found.</p>;

  const canSubmit = issue.status !== 'resolved' && issue.status !== 'pending_review';

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Employee Issue</p>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{issue.title || `Issue #${issue.id}`}</h1>
          <p className="mt-2 text-sm text-gray-600 leading-relaxed">
            {issue.status === 'pending_review' 
              ? 'Your work has been submitted and is currently being reviewed by the department.'
              : 'Upload one image after the work is done so the complaint can be sent for review.'}
          </p>
        </div>
        {statusBadge(issue.status)}
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {message && <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">{message}</div>}

      <div className={static_card_style}>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{issue.description}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600">
            Priority: {issue.priority_level}
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600">
            Department: {issue.department_name || issue.department_id || 'Unassigned'}
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600">
            Assigned: {issue.assigned_person_name || 'You'}
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600">
            Location: {issue.latitude}, {issue.longitude}
          </span>
        </div>
      </div>

      {issue.photo_urls?.length > 0 && (
        <div className={static_card_style}>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Original Evidence</p>
          <div className="grid gap-4 md:grid-cols-2">
            {issue.photo_urls.map((url) => (
              <img
                key={url}
                src={url}
                alt="Original issue evidence"
                className="w-full rounded-2xl object-cover ring-1 ring-black/5 shadow-sm"
              />
            ))}
          </div>
        </div>
      )}

      {canSubmit && (
        <div className={`${static_card_style} space-y-4`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Work Update</p>
              <p className="text-sm text-gray-600">Start the work if needed, then upload one completion image and submit for review.</p>
            </div>
            {issue.status === 'open' && (
              <button
                onClick={handleStartWork}
                disabled={busy}
                className="rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-amber-400 disabled:opacity-50"
              >
                {busy ? 'Updating...' : 'Mark In Progress'}
              </button>
            )}
          </div>

          <form onSubmit={handleComplete} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 block">Completion Image</label>
              <input
                ref={fileInputRef}
                className="block w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-sky-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-sky-700 hover:file:bg-sky-100"
                type="file"
                accept="image/*"
                onChange={(event) => setPhoto(event.target.files?.[0] ?? null)}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 block">Completion Note</label>
              <textarea
                className="h-28 w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 transition-colors focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                placeholder="Optional note about the completed work..."
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-sky-500 disabled:opacity-50"
            >
              {busy ? 'Processing...' : 'Upload Proof & Submit for Review'}
            </button>
          </form>
        </div>
      )}

      {(issue.resolution_photo_url || issue.status === 'pending_review') && (
        <div className={`${static_card_style} space-y-4`}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Completion Proof</p>
            <h2 className="text-lg font-bold text-gray-900">
              {issue.status === 'pending_review' ? 'Submitted Work' : 'Resolved Update'}
            </h2>
          </div>
          {issue.resolution_photo_url && (
            <img
              src={issue.resolution_photo_url}
              alt="Resolution proof"
              className="w-full rounded-2xl object-cover ring-1 ring-black/5 shadow-sm"
            />
          )}
          {issue.resolution_note && (
            <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700 ring-1 ring-gray-100">
              {issue.resolution_note}
            </div>
          )}
          {issue.resolved_at && (
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Resolved At: {formatTimestamp(issue.resolved_at)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
