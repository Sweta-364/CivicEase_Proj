import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../../api';

const static_card_style = 'rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5';

export default function IssuesNewPage() {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let photoKey = null;
      if (photo) {
        const uploadMeta = await api.post('/v1/issues/images/upload-url', { file_name: photo.name });
        if (uploadMeta.data.signed_upload_url) {
          await axios.put(uploadMeta.data.signed_upload_url, photo, { headers: { 'Content-Type': photo.type || 'application/octet-stream' } });
          photoKey = uploadMeta.data.photo_key;
        } else {
          setMessage('Storage upload is unavailable; issue will be submitted without image.');
        }
      }

      const response = await api.post('/v1/issues', {
        description,
        location: { lat: Number(lat), lng: Number(lng) },
        photo_key: photoKey,
      });

      navigate(`/home/issues/${response.data.id}`);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.detail || 'Failed to submit issue.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">New Report</p>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Report a New Issue</h1>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">Describe the civic issue you've encountered and provide location details.</p>
      </div>

      <form onSubmit={handleSubmit} className={`${static_card_style} space-y-4`}>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 block">Description</label>
          <textarea
            className="h-40 w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 transition-colors focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            placeholder="Describe the issue in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 block">Location</label>
          <div className="grid gap-3 md:grid-cols-2">
            <input className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm transition-colors focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20" type="number" step="any" placeholder="Latitude" value={lat} onChange={(e) => setLat(e.target.value)} required />
            <input className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm transition-colors focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20" type="number" step="any" placeholder="Longitude" value={lng} onChange={(e) => setLng(e.target.value)} required />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 block">Photo Evidence</label>
          <input className="block w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-sky-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-sky-700 hover:file:bg-sky-100" type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
        </div>

        {message && <p className="text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2">{message}</p>}

        <button
          disabled={loading}
          className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800 disabled:opacity-50 active:scale-[0.98]"
        >
          {loading ? 'Submitting...' : 'Submit Issue'}
        </button>
      </form>
    </div>
  );
}
