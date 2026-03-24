import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../../api';

const static_card_style = 'rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5';

export default function IssuesNewPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('Getting your location (required)...');

    try {
      // Auto-fetch geolocation
      let location;
      try {
        const position = await new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by your browser"));
          } else {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 15000 });
          }
        });
        location = { lat: position.coords.latitude, lng: position.coords.longitude };
      } catch (geoError) {
        throw new Error('Failed to get location. Please enable location permissions in your browser.');
      }

      let photoKey = null;
      if (photo) {
        setMessage('Uploading photo evidence...');
        const uploadMeta = await api.post('/v1/issues/images/upload-url', { file_name: photo.name });
        if (uploadMeta.data.signed_upload_url) {
          await axios.put(uploadMeta.data.signed_upload_url, photo, { headers: { 'Content-Type': photo.type || 'application/octet-stream' } });
          photoKey = uploadMeta.data.photo_key;
        } else {
           // Proceed without image if signed URL fails, but warn.
        }
      }

      setMessage('Submitting report...');
      const response = await api.post('/v1/issues', {
        title,
        description,
        location,
        photo_key: photoKey,
      });

      navigate(`/home/issues/${response.data.id}`);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.detail || error.message || 'Failed to submit issue.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">New Report</p>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Report a New Issue</h1>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          Describe the civic issue you've encountered. Your location will be automatically attached.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={`${static_card_style} space-y-4`}>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 block">Title</label>
          <input
            className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm transition-colors focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            placeholder="Brief summary of the issue..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            minLength={3}
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 block">Description</label>
          <textarea
            className="h-32 w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 transition-colors focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            placeholder="Describe the issue in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            minLength={5}
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 block">Photo Evidence (Optional)</label>
          <input className="block w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-sky-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-sky-700 hover:file:bg-sky-100" type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
        </div>

        {message && (
          <p className={`text-sm rounded-lg px-3 py-2 ${message.includes('Failed') ? 'text-amber-700 bg-amber-50 ring-1 ring-amber-100' : 'text-sky-700 bg-sky-50 ring-1 ring-sky-100'}`}>
            {message}
          </p>
        )}

        <button
          disabled={loading}
          className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800 disabled:opacity-50 active:scale-[0.98]"
        >
          {loading ? 'Processing...' : 'Submit Issue'}
        </button>
      </form>
    </div>
  );
}
