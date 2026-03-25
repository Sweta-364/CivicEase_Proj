import { useEffect, useState } from 'react';
import api from '../../api';
import { ResourceGridSkeleton } from '../../components/Skeletons';

const static_card_style = 'rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5';

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [departmentId, setDepartmentId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const query = departmentId ? `?department_id=${departmentId}` : '';
        const response = await api.get(`/v1/resources${query}`);
        setResources(response.data ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [departmentId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Browse</p>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Resources</h1>
        </div>
        <input
          className="w-52 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm ring-1 ring-black/5 transition-colors focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          placeholder="Filter by department ID"
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
        />
      </div>

      {loading ? (
        <ResourceGridSkeleton count={6} />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <a
              key={resource.id}
              href={resource.link_url}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col bg-white ring-1 ring-black/5 rounded-2xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:ring-black/10 hover:-translate-y-1"
            >
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-base font-bold text-gray-900 line-clamp-2 tracking-tight group-hover:text-gray-800 transition-colors duration-200">
                  {resource.title}
                </h3>
                <div className="mt-auto pt-5 flex items-center justify-between border-t border-gray-100">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {resource.department_name ?? 'All departments'}
                  </span>
                  <span className="text-xs font-medium text-gray-500">
                    By: {resource.published_by}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {!loading && resources.length === 0 && (
        <div className={`${static_card_style} flex flex-col items-center justify-center p-12 text-center`}>
          <p className="text-sm font-medium text-gray-500">No resources found.</p>
        </div>
      )}
    </div>
  );
}
