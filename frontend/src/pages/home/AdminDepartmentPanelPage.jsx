import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';
import axios from 'axios';
import { Skeleton } from '../../components/Skeletons';
import { User, Phone, Briefcase, Camera, Loader2, CheckCircle2, Eye, CheckCircle, ChevronDown } from 'lucide-react';

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
  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState('');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [uploadingId, setUploadingId] = useState(null);
  const [formIsUploading, setFormIsUploading] = useState(false);

  async function requestUploadMeta(url, fileName) {
    try {
      const postResponse = await api.post(url, { file_name: fileName });
      return postResponse.data;
    } catch (requestError) {
      if (requestError?.response?.status !== 405) throw requestError;
      const getResponse = await api.get(url, { params: { file_name: fileName } });
      return getResponse.data;
    }
  }

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
      setFormIsUploading(true);
      
      let photo_key = null;
      if (photo) {
        const meta = await requestUploadMeta(`/v1/departments/${departmentId}/people/photo-upload-url`, photo.name);
        await axios.put(meta.signed_upload_url, photo, {
          headers: { 'Content-Type': photo.type || 'application/octet-stream' }
        });
        photo_key = meta.photo_key;
      }

      await api.post(`/v1/departments/${departmentId}/people`, {
        name,
        email: email || null,
        phone: phone || null,
        designation: designation || null,
        photo_key: photo_key,
      });
      setName('');
      setEmail('');
      setPhone('');
      setDesignation('');
      setPhoto(null);
      await loadPanel();
    } catch (actionError) {
      setError(actionError?.response?.data?.detail || 'Failed to add person.');
    } finally {
      setFormIsUploading(false);
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

  async function handleEmployeePhotoUpload(personId, file) {
    if (!file) return;
    try {
      setUploadingId(personId);
      const meta = await requestUploadMeta(`/v1/departments/${departmentId}/people/${personId}/photo-upload-url`, file.name);
      await axios.put(meta.signed_upload_url, file, {
        headers: { 'Content-Type': file.type || 'application/octet-stream' }
      });
      await api.post(`/v1/departments/${departmentId}/people/${personId}/photo-confirm`, { photo_key: meta.photo_key });
      await loadPanel();
    } catch (err) {
      setError('Failed to upload employee photo.');
    } finally {
      setUploadingId(null);
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
  const pendingReviewIssues = issues.filter(i => i.status === 'pending_review');
  const activeIssues = issues.filter(i => i.status !== 'pending_review' && i.status !== 'resolved');
  const resolvedIssues = issues.filter(i => i.status === 'resolved');

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
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Department Employees</p>
          <form onSubmit={addPerson} className="space-y-3">
            <input
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              placeholder="Employee name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
            <input
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              placeholder="Sign-in email for employee panel access"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                placeholder="Phone (optional)"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
              <input
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                placeholder="Designation"
                value={designation}
                onChange={(event) => setDesignation(event.target.value)}
              />
            </div>
            <p className="text-xs text-gray-500">
              Use the employee&apos;s real sign-in email. When the same person logs in with that email, they can open the employee panel and see issues assigned to them.
            </p>
            <div className="flex items-center gap-3">
              <div 
                onClick={() => document.getElementById('new-employee-photo').click()}
                className={`h-12 w-12 rounded-xl shrink-0 flex items-center justify-center cursor-pointer border-2 border-dashed transition-all ${photo ? 'border-sky-500 bg-sky-50' : 'border-gray-300 bg-gray-50 hover:border-sky-300 hover:bg-white'}`}
              >
                {photo ? (
                  <img src={URL.createObjectURL(photo)} alt="Preview" className="h-full w-full object-cover rounded-lg" />
                ) : (
                  <Camera className="h-5 w-5 text-gray-400" />
                )}
                <input 
                  type="file" 
                  id="new-employee-photo" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
                />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 mb-1">Employee Photo (optional)</p>
                <p className="text-[10px] text-gray-400">Click to select a profile picture</p>
              </div>
            </div>

            <button 
              disabled={formIsUploading}
              className="w-full rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-sky-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {formIsUploading && <Loader2 className="h-4 w-4 animate-spin" />}
              {formIsUploading ? 'Uploading & Adding...' : 'Add Employee'}
            </button>
          </form>

          <div className="space-y-2">
            {people.length === 0 && <p className="text-sm text-gray-500">No people added yet.</p>}
            {people.map((person) => (
              <div key={person.id} className="flex items-center justify-between rounded-xl bg-gray-50 p-3 ring-1 ring-gray-100">
                <div className="flex items-center gap-3">
                  <div 
                    onClick={() => !uploadingId && document.getElementById(`photo-${person.id}`).click()}
                    className="h-10 w-10 rounded-full bg-gray-200 shrink-0 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity ring-1 ring-black/5"
                  >
                    {uploadingId === person.id ? (
                      <div className="h-full w-full flex items-center justify-center bg-gray-100">
                        <Loader2 className="h-4 w-4 animate-spin text-sky-600" />
                      </div>
                    ) : person.photo_url ? (
                      <img src={person.photo_url} alt={person.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-sky-50 text-sky-600">
                        <Camera className="h-4 w-4" />
                      </div>
                    )}
                    <input 
                      type="file" 
                      id={`photo-${person.id}`} 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => handleEmployeePhotoUpload(person.id, e.target.files[0])}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{person.name}</p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                      {person.designation && <span className="text-[10px] bg-sky-100 text-sky-700 font-bold px-1.5 py-0.5 rounded-sm uppercase">{person.designation}</span>}
                      {person.phone && <span className="text-[10px] text-gray-500 font-medium">| {person.phone}</span>}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5">{person.email || 'No email'}</p>
                  </div>
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

        <div className="space-y-6">
          {resolvedIssues.length > 0 && (
            <div className="flex justify-end gap-3">
              <button 
                className="group flex items-center gap-2.5 rounded-full border border-gray-100 bg-white/50 px-4 py-2 text-[11px] font-bold uppercase tracking-tight text-gray-500 shadow-sm backdrop-blur-sm transition-all hover:border-emerald-200 hover:bg-emerald-50/80 hover:text-emerald-700 active:scale-95"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-[10px] text-gray-600 transition-colors group-hover:bg-emerald-100 group-hover:text-emerald-700">
                  {resolvedIssues.length}
                </div>
                Resolved issues
                <ChevronDown className="h-3.5 w-3.5 opacity-40 transition-transform group-hover:translate-y-0.5" />
              </button>
            </div>
          )}

          {/* Pending Review Section */}
          {pendingReviewIssues.length > 0 && (
            <div className={`${static_card_style} border-2 border-sky-500/20 bg-sky-50/10 space-y-4`}>
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-sky-700 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Pending Review ({pendingReviewIssues.length})
                </p>
                <span className="text-[10px] font-medium text-sky-600 bg-sky-100 px-2 py-0.5 rounded-full">Requires Approval</span>
              </div>
              
              <div className="space-y-4">
                {pendingReviewIssues.map((issue) => (
                  <div key={issue.id} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/5 hover:ring-sky-500/30 transition-all">
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <div>
                        <h4 className="text-base font-bold text-gray-900">{issueTitle(issue)}</h4>
                        <p className="text-xs text-gray-500 mt-1">Assigned to: {assigneeLabel(issue)}</p>
                      </div>
                      <button
                        onClick={() => updateIssueStatus(issue.id, 'resolved')}
                        className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition-all active:scale-95"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Approve & Resolve
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Resolution Proof</p>
                        {issue.resolution_photo_url ? (
                          <div className="aspect-4/3 rounded-lg overflow-hidden ring-1 ring-black/5">
                            <img src={issue.resolution_photo_url} alt="Proof" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="aspect-4/3 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No image provided</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Completion Note</p>
                        <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-700 italic border border-gray-100 min-h-[100px]">
                          {issue.resolution_note || "No note provided by employee."}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <p className="text-[10px] font-medium text-gray-500">Submitted in: {issue.priority_level.toUpperCase()}</p>
                      <button 
                         onClick={() => updateIssueStatus(issue.id, 'in_progress')}
                         className="text-[10px] font-bold text-amber-600 hover:text-amber-700 uppercase tracking-wider"
                      >
                        Reject & Send Back
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Issues Section */}
          <div className={`${static_card_style} space-y-3`}>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Active Issues ({activeIssues.length})</p>
            {activeIssues.length === 0 && <p className="text-sm text-gray-500">No active issues assigned to this department yet.</p>}
            {activeIssues.map((issue) => (
              <div key={issue.id} className="rounded-xl bg-gray-50 p-4 ring-1 ring-gray-100 relative overflow-hidden">
                {issue.reporter_is_verified && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-bl-lg flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="h-2.5 w-2.5" />
                    Verified
                  </div>
                )}
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
                <div className="mt-2 flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    issue.status === 'in_progress' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'
                  }`}>
                    {issue.status.replace('_', ' ')}
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Priority: {issue.priority_level} | Assigned To: {assigneeLabel(issue)}
                  </p>
                </div>
                
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
                  {issue.status !== 'in_progress' && (
                    <button
                      onClick={() => updateIssueStatus(issue.id, 'in_progress')}
                      className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-white hover:bg-amber-400"
                    >
                      Mark In Progress
                    </button>
                  )}
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
    </div>
  );
}
