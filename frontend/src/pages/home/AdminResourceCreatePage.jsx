import { useEffect, useState } from 'react';
import api from '../../api';
import { useAuth } from '../../context/useAuth';
import { getDepartmentAdminIds, isMainAdmin } from '../../lib/auth';

const static_card_style = 'rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5';

export default function AdminResourceCreatePage() {
  const { appUser } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ title: '', link_url: '', thumbnail_url: '', department_id: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/v1/departments').then((res) => setDepartments(res.data ?? [])).catch((error) => console.error(error));
  }, []);

  async function submit(event) {
    event.preventDefault();
    setMessage('');

    const payload = {
      title: form.title,
      link_url: form.link_url,
      thumbnail_url: form.thumbnail_url || null,
      department_id: form.department_id ? Number(form.department_id) : null,
    };

    if (!isMainAdmin(appUser) && !payload.department_id) {
      const ids = getDepartmentAdminIds(appUser);
      if (ids.length > 0) payload.department_id = ids[0];
    }

    try {
      await api.post('/v1/resources', payload);
      setForm({ title: '', link_url: '', thumbnail_url: '', department_id: '' });
      setMessage('Resource published successfully.');
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.detail || 'Failed to publish resource.');
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Administration</p>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Publish Resource</h1>
      </div>

      <form onSubmit={submit} className={`${static_card_style} space-y-4`}>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 block">Title</label>
          <input
            className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm transition-colors focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            placeholder="Resource title"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 block">Link URL</label>
          <input
            className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm transition-colors focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            placeholder="https://..."
            value={form.link_url}
            onChange={(e) => setForm((prev) => ({ ...prev, link_url: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 block">Thumbnail URL (optional)</label>
          <input
            className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm transition-colors focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            placeholder="https://..."
            value={form.thumbnail_url}
            onChange={(e) => setForm((prev) => ({ ...prev, thumbnail_url: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 block">Department</label>
          <select
            className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm transition-colors focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            value={form.department_id}
            onChange={(e) => setForm((prev) => ({ ...prev, department_id: e.target.value }))}
          >
            <option value="">All departments (main admin only)</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>{department.name}</option>
            ))}
          </select>
        </div>
        <button className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800 active:scale-[0.98]">
          Publish
        </button>
      </form>

      {message && (
        <div className={`${static_card_style} text-sm ${message.includes('success') ? 'text-emerald-700 bg-emerald-50 ring-emerald-100' : 'text-amber-700 bg-amber-50 ring-amber-100'}`}>
          {message}
        </div>
      )}
    </div>
  );
}
