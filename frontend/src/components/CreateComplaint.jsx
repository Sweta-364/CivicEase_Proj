import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ArrowLeft } from 'lucide-react';
import api from '../api';

export default function CreateComplaint() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    if (image) data.append('image', image);

    try {
      await api.post('/complaints/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || 'Failed to submit complaint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50/30 to-white px-4 py-8 sm:py-12">

      {/* Back Button */}
      <div className="max-w-2xl mx-auto mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-semibold transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>
      </div>

      {/* Main Card */}
      <div className="max-w-2xl mx-auto backdrop-blur-xl bg-white/95 border border-slate-200/60 rounded-2xl shadow-xl p-6 sm:p-10">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            Report an Issue
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            Help us improve your community by reporting problems with detailed information
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Image Upload Section */}
          <div>
            <label className="text-sm font-bold text-slate-700 mb-3 block">
              Evidence Photo <span className="text-red-500">*</span>
            </label>

            <label className="group relative flex flex-col items-center justify-center w-full h-64 sm:h-72 rounded-xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-white hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50/30 transition-all overflow-hidden cursor-pointer">

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                required
              />

              {preview ? (
                <div className="relative w-full h-full">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm font-semibold bg-black/50 px-4 py-2 rounded-lg">
                      Click to change
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 text-slate-400 group-hover:text-blue-600 transition-colors px-6 text-center">
                  <div className="p-5 bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all border border-slate-200">
                    <Camera className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm font-bold mb-1">
                      Click to upload photo
                    </p>
                    <p className="text-xs text-slate-400">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </label>
          </div>

          {/* Title Input */}
          <div>
            <label className="text-sm font-bold text-slate-700 mb-2 block">
              Issue Title <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              placeholder="e.g., Broken streetlight on Main Street"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-3.5 rounded-lg bg-white border-2 border-slate-300 text-slate-900 placeholder:text-slate-400 shadow-sm focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 outline-none transition-all"
            />
          </div>

          {/* Description Textarea */}
          <div>
            <label className="text-sm font-bold text-slate-700 mb-2 block">
              Detailed Description <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <textarea
                placeholder="Please provide specific details: exact location, what happened, when it occurred, severity level, and any safety concerns..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                required
                className="w-full h-44 px-4 py-3.5 rounded-lg bg-white border-2 border-slate-300 text-slate-900 placeholder:text-slate-400 shadow-sm focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 outline-none resize-none transition-all leading-relaxed"
              />

              <span className="absolute bottom-3 right-3 text-[10px] font-bold text-blue-700 bg-gradient-to-r from-blue-100 to-cyan-100 px-2.5 py-1 rounded-md border border-blue-200/40">
                AI ASSISTED
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-lg text-white text-base font-bold tracking-wide bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Report'
            )}
          </button>

        </form>
      </div>
    </div>
  );
}
