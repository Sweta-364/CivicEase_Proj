import { useEffect, useState } from 'react';
import api from '../../api';

const static_card_style = 'rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5';

export default function AdminClustersPage() {
  const [clusters, setClusters] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function load() {
      const response = await api.get('/v1/clusters');
      setClusters(response.data ?? []);
    }
    load().catch((error) => console.error(error));
  }, []);

  async function loadDetail(id) {
    const response = await api.get(`/v1/clusters/${id}`);
    setSelected(response.data);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Administration</p>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Issue Clusters</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <div className={`${static_card_style} space-y-2 max-h-[600px] overflow-y-auto`}>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Clusters</p>
          {clusters.map((cluster) => (
            <button
              key={cluster.id}
              className={`block w-full rounded-xl p-4 text-left text-sm transition-all duration-200 ${
                selected?.id === cluster.id
                  ? 'bg-sky-50 ring-1 ring-sky-200 shadow-sm'
                  : 'bg-gray-50 ring-1 ring-gray-100 hover:bg-gray-100'
              }`}
              onClick={() => loadDetail(cluster.id)}
            >
              <p className="font-bold text-gray-900">Cluster #{cluster.id}</p>
              <p className="text-xs text-gray-500 mt-1">Affected: {cluster.affected_count}</p>
            </button>
          ))}
        </div>

        <div className={static_card_style}>
          {!selected && <p className="text-sm text-gray-500">Select a cluster to view details.</p>}
          {selected && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-gray-900">Cluster #{selected.id}</h2>
              <p className="text-sm text-gray-700 leading-relaxed">{selected.representative_text}</p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Centroid: {selected.centroid_latitude}, {selected.centroid_longitude}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Issues in Cluster</p>
                <div className="space-y-2">
                  {(selected.issues ?? []).map((issue) => (
                    <div key={issue.issue_id} className="rounded-xl bg-gray-50 px-4 py-3 ring-1 ring-gray-200">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-gray-900">Issue #{issue.issue_id}</p>
                        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800 ring-1 ring-sky-100">
                          Similarity: {issue.similarity_score.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
