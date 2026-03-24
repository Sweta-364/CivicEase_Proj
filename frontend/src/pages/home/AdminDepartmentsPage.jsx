import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

const static_card_style = 'rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5';

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [actionError, setActionError] = useState('');

  async function load() {
    const response = await api.get('/v1/departments');
    setDepartments(response.data ?? []);
  }

  useEffect(() => {
    load().catch((error) => console.error(error));
  }, []);

  async function createDepartment(event) {
    event.preventDefault();
    setActionError('');
    await api.post('/v1/departments', { name, description });
    setName('');
    setDescription('');
    await load();
  }

  async function toggleActive(department) {
    setActionError('');
    await api.patch(`/v1/departments/${department.id}`, { is_active: !department.is_active });
    await load();
  }

  async function deleteDepartment(department) {
    const confirmed = window.confirm(`Delete "${department.name}" permanently?`);
    if (!confirmed) return;
    setActionError('');
    try {
      await api.delete(`/v1/departments/${department.id}`);
      await load();
    } catch (error) {
      const detail = error?.response?.data?.detail || 'Failed to delete department.';
      setActionError(detail);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Administration</p>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Department Management</h1>
      </div>

      <form onSubmit={createDepartment} className={`${static_card_style} space-y-4`}>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Create Department</p>
        <input
          className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm transition-colors focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          placeholder="Department name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          className="h-24 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm transition-colors focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          placeholder="Department description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800 active:scale-[0.98]">
          Create Department
        </button>
      </form>

      <div className="space-y-3">
        {actionError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {actionError}
          </div>
        )}
        {departments.map((department) => (
          <div key={department.id} className={`${static_card_style} flex items-center justify-between`}>
            <div>
              <p className="text-sm font-bold text-gray-900">{department.name}</p>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed">{department.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={`/admin/departments/${department.id}`}
                className="shrink-0 rounded-xl bg-sky-600 px-4 py-2.5 text-xs font-bold text-white transition-all duration-200 hover:bg-sky-500 active:scale-[0.98]"
              >
                Open Panel
              </Link>
              <button
                onClick={() => toggleActive(department)}
                className="shrink-0 rounded-xl bg-white ring-1 ring-gray-200 px-4 py-2.5 text-xs font-bold text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:shadow-sm active:scale-[0.98]"
              >
                {department.is_active ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => deleteDepartment(department)}
                className="shrink-0 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white transition-all duration-200 hover:bg-red-500 active:scale-[0.98]"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
