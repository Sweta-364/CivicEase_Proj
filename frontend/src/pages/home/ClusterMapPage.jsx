import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import api from '../../api';

const DEPT_COLORS = [
  { fill: '#3b82f6', border: '#1d4ed8' },
  { fill: '#10b981', border: '#047857' },
  { fill: '#f59e0b', border: '#b45309' },
  { fill: '#8b5cf6', border: '#6d28d9' },
  { fill: '#ef4444', border: '#b91c1c' },
  { fill: '#ec4899', border: '#be185d' },
  { fill: '#14b8a6', border: '#0f766e' },
  { fill: '#f97316', border: '#c2410c' },
];

function clusterColor(clusterId) {
  return DEPT_COLORS[clusterId % DEPT_COLORS.length];
}

function MapBounds({ clusters }) {
  const map = useMap();
  useEffect(() => {
    const valid = clusters.filter(c => c.centroid_latitude && c.centroid_longitude);
    if (valid.length > 0) {
      const bounds = L.latLngBounds(valid.map(c => [c.centroid_latitude, c.centroid_longitude]));
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 18 });
    }
  }, [clusters, map]);
  return null;
}

function ClusterPanel({ cluster, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setDetail(null);
    api.get(`/v1/clusters/${cluster.id}`)
      .then(res => setDetail(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [cluster.id]);

  return (
    <div className="absolute top-0 right-0 z-1000 h-full w-80 bg-white shadow-2xl border-l border-gray-200 flex flex-col overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between shrink-0">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-0.5">Issue Cluster #{cluster.id}</p>
          <p className="text-sm font-bold text-gray-900 leading-snug line-clamp-3">{cluster.representative_text}</p>
        </div>
        <button onClick={onClose} className="ml-2 shrink-0 text-gray-400 hover:text-gray-700 transition-colors text-xl font-bold leading-none mt-0.5">×</button>
      </div>

      <div className="px-5 py-3 border-b border-gray-100 shrink-0">
        <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs font-semibold">
          {cluster.affected_count} issue{cluster.affected_count !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex flex-col gap-3 p-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-xl bg-gray-50 p-4 animate-pulse h-20" />
            ))}
          </div>
        )}
        {!loading && detail && (
          <div className="p-4 space-y-2">
            {detail.issues.map(member => (
              <IssueCard key={member.issue_id} issueId={member.issue_id} similarityScore={member.similarity_score} />
            ))}
          </div>
        )}
        {!loading && !detail && (
          <p className="text-sm text-red-500 p-5">Failed to load cluster details.</p>
        )}
      </div>
    </div>
  );
}

function IssueCard({ issueId, similarityScore }) {
  const [issue, setIssue] = useState(null);

  useEffect(() => {
    api.get(`/v1/issues/${issueId}`).then(res => setIssue(res.data)).catch(console.error);
  }, [issueId]);

  if (!issue) return <div className="rounded-xl bg-gray-50 p-3 h-16 animate-pulse" />;

  const statusColors = {
    open: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    in_progress: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    resolved: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  };
  const priorityColors = {
    p0: 'bg-red-50 text-red-700 ring-red-600/20',
    p1: 'bg-orange-50 text-orange-700 ring-orange-600/20',
    p2: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
    p3: 'bg-gray-50 text-gray-600 ring-gray-200',
  };

  return (
    <div className="rounded-xl bg-gray-50 ring-1 ring-gray-200 p-3 space-y-2">
      <p className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">{issue.title || `Issue #${issue.id}`}</p>
      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{issue.description}</p>
      <div className="flex flex-wrap gap-1 items-center">
        <span className={`ring-1 text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase ${statusColors[issue.status] || 'bg-gray-50 text-gray-600 ring-gray-200'}`}>
          {issue.status}
        </span>
        <span className={`ring-1 text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase ${priorityColors[issue.priority_level] || 'bg-gray-50 text-gray-600 ring-gray-200'}`}>
          {issue.priority_level}
        </span>
        {issue.department_name && (
          <span className="ring-1 ring-purple-600/20 text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase bg-purple-50 text-purple-700">
            {issue.department_name}
          </span>
        )}
        <span className="ml-auto text-[10px] text-gray-400 font-mono">#{issueId}</span>
      </div>
    </div>
  );
}

export default function ClusterMapPage() {
  const [clusters, setClusters] = useState([]);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const CLUSTER_RADIUS = 40;
  const defaultCenter = [17.064068, 74.282535];

  useEffect(() => {
    api.get('/v1/clusters').then(res => setClusters(res.data ?? [])).catch(console.error);
  }, []);

  return (
    <div className="space-y-4 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Administration</p>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Cluster Map</h1>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-xs text-gray-400">{clusters.length} cluster{clusters.length !== 1 ? 's' : ''}</p>
          <Link to="/admin/map" className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-200 transition-colors">
            Issue Map
          </Link>
          <Link to="/admin/issues" className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-200 transition-colors">
            Back to List
          </Link>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 shrink-0">
        {clusters.map(c => {
          const col = clusterColor(c.id);
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCluster(c)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all border ${
                selectedCluster?.id === c.id
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: col.fill }} />
              Cluster #{c.id} ({c.affected_count})
            </button>
          );
        })}
      </div>

      <div className="flex-1 rounded-xl overflow-hidden ring-1 ring-black/5 shadow-sm border border-gray-200 z-0 relative">
        <MapContainer center={defaultCenter} zoom={16} className="w-full h-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapBounds clusters={clusters} />

          {clusters.filter(c => c.centroid_latitude && c.centroid_longitude).map(cluster => {
            const col = clusterColor(cluster.id);
            const isSelected = selectedCluster?.id === cluster.id;
            return (
              <Circle
                key={`cluster-${cluster.id}`}
                center={[cluster.centroid_latitude, cluster.centroid_longitude]}
                radius={CLUSTER_RADIUS}
                pathOptions={{
                  fillColor: col.fill,
                  fillOpacity: isSelected ? 0.65 : 0.35,
                  color: col.border,
                  weight: isSelected ? 3 : 2,
                }}
                eventHandlers={{ click: () => setSelectedCluster(cluster) }}
              />
            );
          })}
        </MapContainer>

        {selectedCluster && (
          <ClusterPanel cluster={selectedCluster} onClose={() => setSelectedCluster(null)} />
        )}
      </div>
    </div>
  );
}
