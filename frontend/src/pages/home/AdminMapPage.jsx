import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import api from '../../api';

// Fix for leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function MapBounds({ issues }) {
  const map = useMap();
  useEffect(() => {
    if (issues && issues.length > 0) {
      // Calculate bounds considering only valid coordinates
      const validIssues = issues.filter(i => i.latitude && i.longitude);
      if (validIssues.length > 0) {
        const bounds = L.latLngBounds(validIssues.map(i => [i.latitude, i.longitude]));
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 18 });
      }
    }
  }, [issues, map]);
  return null;
}

export default function AdminMapPage() {
  const [issues, setIssues] = useState([]);
  const [clusters, setClusters] = useState([]);
  const CLUSTER_RADIUS = 40;

  useEffect(() => {
    async function load() {
      try {
        const [issuesRes, clustersRes] = await Promise.all([
          api.get('/v1/issues'),
          api.get('/v1/clusters')
        ]);
        setIssues(issuesRes.data?.items ?? issuesRes.data ?? []);
        setClusters(clustersRes.data ?? []);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  const defaultCenter = [17.064068, 74.282535]; // N 17° 3' 50.645'' / E 74° 16' 57.127''

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Administration</p>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Issues Map</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/cluster-map"
            className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-gray-800 transition-colors"
          >
            Cluster Map
          </Link>
          <Link
            to="/admin/issues"
            className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Back to List
          </Link>
        </div>
      </div>

      <div className="flex-1 rounded-xl overflow-hidden ring-1 ring-black/5 shadow-sm border border-gray-200 z-0 relative">
        <MapContainer center={defaultCenter} zoom={16} className="w-full h-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapBounds issues={issues} />

          {clusters.filter(c => c.centroid_latitude && c.centroid_longitude).map(cluster => (
            <Circle
              key={`cluster-${cluster.id}`}
              center={[cluster.centroid_latitude, cluster.centroid_longitude]}
              radius={CLUSTER_RADIUS}
              pathOptions={{ fillColor: '#fb7185', fillOpacity: 0.35, color: '#e11d48', weight: 2 }}
            >
              <Popup>
                <div className="p-1 min-w-[150px]">
                  <p className="font-bold text-sm">Cluster #{cluster.id}</p>
                  <p className="text-xs text-gray-600 mt-1">Affected Issues: <span className="font-semibold">{cluster.affected_count}</span></p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{cluster.representative_text}</p>
                </div>
              </Popup>
            </Circle>
          ))}

          {issues.filter(i => i.latitude && i.longitude).map(issue => (
            <Marker key={`issue-${issue.id}`} position={[issue.latitude, issue.longitude]}>
              <Popup>
                <div className="p-1 max-w-[200px]">
                  <p className="font-bold text-sm mb-1">{issue.title || `Issue #${issue.id}`}</p>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{issue.description}</p>
                  <div className="flex flex-wrap gap-1">
                    <span className="bg-blue-50 text-blue-700 ring-1 ring-blue-600/20 text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase">{issue.status}</span>
                    <span className="bg-orange-50 text-orange-700 ring-1 ring-orange-600/20 text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase">{issue.priority_level}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
