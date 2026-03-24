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
                    <IssueDropdown key={issue.issue_id} issueId={issue.issue_id} similarityScore={issue.similarity_score} />
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

function IssueDropdown({ issueId, similarityScore }) {
  const [expanded, setExpanded] = useState(false);
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (expanded && !issue && !loading) {
      setLoading(true);
      api.get(`/v1/issues/${issueId}`)
        .then((res) => setIssue(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [expanded, issueId, issue, loading]);

  return (
    <div className="rounded-xl bg-gray-50 ring-1 ring-gray-200 overflow-hidden transition-all duration-200">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <p className="text-sm font-bold text-gray-900">Issue #{issueId}</p>
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800 ring-1 ring-sky-100">
            Similarity: {similarityScore.toFixed(2)}
          </span>
        </div>
        <span className="text-gray-400 text-xs font-bold">{expanded ? 'HIDE' : 'SHOW'} DETAILS</span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-white">
          {loading && <p className="text-xs text-gray-500 animate-pulse">Loading details...</p>}
          {!loading && !issue && <p className="text-xs text-red-500">Failed to load issue details.</p>}
          {!loading && issue && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{issue.title || 'Untitled'}</h3>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-blue-700 ring-1 ring-blue-600/20">
                    Status: {issue.status}
                  </span>
                  <span className="rounded-full bg-orange-50 px-2.5 py-1 font-semibold text-orange-700 ring-1 ring-orange-600/20">
                    Priority: {issue.priority_level}
                  </span>
                  {issue.department_name && (
                    <span className="rounded-full bg-purple-50 px-2.5 py-1 font-semibold text-purple-700 ring-1 ring-purple-600/20">
                      Dept: {issue.department_name}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg ring-1 ring-gray-200">
                {issue.description}
              </p>

              {issue.photo_urls?.length > 0 && (
                <div className="grid gap-3 grid-cols-2">
                  {issue.photo_urls.map((url) => (
                    <img key={url} src={url} alt="Issue evidence" className="w-full h-32 object-cover rounded-xl ring-1 ring-black/5 shadow-sm" />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
