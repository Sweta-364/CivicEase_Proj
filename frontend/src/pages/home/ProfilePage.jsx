import { useState, useRef } from 'react';
import { useAuth } from '../../context/useAuth';
import api from '../../api';
import axios from 'axios';
import { User, Phone, Briefcase, Camera, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const static_card_style = 'rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/5';

function VerificationBadge({ isVerified }) {
  if (isVerified) {
    return (
      <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Verified Reporter
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 ring-1 ring-amber-600/20 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
      <AlertCircle className="h-3.5 w-3.5" />
      Unverified Profile
    </div>
  );
}

export default function ProfilePage() {
  const { appUser, setAppUser } = useAuth();
  const [phone, setPhone] = useState(appUser?.phone || '');
  const [designation, setDesignation] = useState(appUser?.designation || '');
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  async function handleUpdateProfile(e) {
    e.preventDefault();
    try {
      setBusy(true);
      setMessage({ type: '', text: '' });
      const res = await api.patch('/v1/users/me', { phone, designation });
      setAppUser(res.data);
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to update profile.' });
    } finally {
      setBusy(false);
    }
  }

  async function handleIdentityUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setMessage({ type: 'info', text: 'Preparing upload...' });

      // 1. Get signed URL
      const meta = await api.post('/v1/users/me/identity-upload-url', { file_name: file.name });
      
      // 2. Upload to storage
      setMessage({ type: 'info', text: 'Uploading identity card...' });
      await axios.put(meta.data.signed_upload_url, file, {
        headers: { 'Content-Type': file.type || 'application/octet-stream' }
      });

      // 3. Confirm with backend
      setMessage({ type: 'info', text: 'Finalizing verification...' });
      const res = await api.post('/v1/users/me/identity-confirm', { photo_key: meta.data.photo_key });
      
      setAppUser(res.data);
      setMessage({ type: 'success', text: 'Identity card uploaded! Your profile is now verified.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Verification upload failed. Please try again.' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 mt-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">My account</p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Profile Settings</h1>
          <p className="mt-2 text-sm text-gray-600">Manage your identity and contact information.</p>
        </div>
        <VerificationBadge isVerified={appUser?.is_verified} />
      </div>

      {message.text && (
        <div className={`rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-3 animate-in fade-in slide-in-from-top-2 border ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 
          message.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' : 
          'bg-sky-50 text-sky-800 border-sky-200'
        }`}>
          {message.type === 'info' && <Loader2 className="h-4 w-4 animate-spin" />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Basic Info Card */}
        <div className={`${static_card_style} md:col-span-2 space-y-8`}>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 shadow-inner">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{appUser?.display_name || 'CivicEase User'}</h2>
              <p className="text-sm text-gray-500 font-medium">{appUser?.email}</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all"
                  placeholder="+91 00000 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                  <Briefcase className="h-3.5 w-3.5" />
                  Designation
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all"
                  placeholder="e.g. Student, Social Worker"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50"
            >
              {busy ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Verification Card */}
        <div className={`${static_card_style} space-y-6`}>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Identity Check</h3>
            <p className="text-xs font-medium text-gray-500 mt-1 leading-relaxed">
              Verify your profile to gain a "Verified Reporter" badge on all your reported issues.
            </p>
          </div>

          {appUser?.identity_card_url ? (
            <div className="space-y-4">
               <div className="aspect-4/3 rounded-xl overflow-hidden ring-1 ring-black/5 bg-gray-100">
                  <img src={appUser.identity_card_url} alt="Identity Card" className="w-full h-full object-cover" />
               </div>
               <p className="text-[10px] text-center font-bold text-gray-400 uppercase tracking-widest">Document Uploaded</p>
            </div>
          ) : (
            <div 
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`group aspect-4/3 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer hover:bg-white hover:border-sky-300 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="h-10 w-10 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 group-hover:bg-sky-100 transition-colors">
                {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
              </div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center px-4">
                {uploading ? 'Uploading...' : 'Click to upload ID Card'}
              </p>
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleIdentityUpload}
                disabled={uploading}
              />
            </div>
          )}
          
          <div className="rounded-xl bg-sky-50 p-4 border border-sky-100">
            <p className="text-xs text-sky-800 leading-relaxed font-medium">
              Verified reports are prioritized by administrators and increase the credibility of your submissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
