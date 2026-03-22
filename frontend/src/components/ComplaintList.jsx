import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, CheckCircle2 } from 'lucide-react';
import api, { getImageUrl } from '../api';

const statusStyles = {
  Pending: 'bg-gradient-to-r from-amber-50 to-amber-100/80 text-amber-700 ring-1 ring-inset ring-amber-600/20',
  Working: 'bg-gradient-to-r from-blue-50 to-blue-100/80 text-blue-700 ring-1 ring-inset ring-blue-600/20',
  Solved: 'bg-gradient-to-r from-emerald-50 to-emerald-100/80 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
  Invalid: 'bg-gradient-to-r from-red-50 to-red-100/80 text-red-700 ring-1 ring-inset ring-red-600/20',
};

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=2000&q=80',
      tagline: 'Empowering Communities, One Report at a Time.'
    },
    {
      url: 'https://images.unsplash.com/photo-1517090504586-fde19ea6066f?auto=format&fit=crop&w=2000&q=80',
      tagline: 'Better Neighborhoods Through Faster Response.'
    },
    {
      url: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=2000&q=80',
      tagline: 'Your Voice for a Better City Environment.'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative -mt-8 sm:-mt-12 -mx-4 sm:-mx-6 lg:-mx-8 h-[40vh] md:h-[65vh] overflow-hidden mb-12 shadow-2xl transition-all duration-500">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
        >
          <img
            src={slide.url}
            alt={`Slide ${index}`}
            className="w-full h-full object-cover transition-transform duration-[10s] ease-linear scale-110"
            style={{ transform: index === currentSlide ? 'scale(1)' : 'scale(1.1)' }}
          />
          {/* Professional Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-blue-900/20 to-slate-900/70" />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
        <h1 className="text-5xl md:text-8xl font-black text-white mb-4 tracking-tighter drop-shadow-2xl animate-fade-in">
          Civic<span className="text-cyan-400">Ease</span>
        </h1>
        <div className="h-1.5 w-32 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mb-8 shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
        <p className="text-lg md:text-3xl text-blue-50 font-semibold max-w-3xl leading-relaxed drop-shadow-lg transition-all duration-700 opacity-90">
          {slides[currentSlide].tagline}
        </p>

        {/* Carousel Indicators */}
        <div className="absolute bottom-10 flex gap-3 pointer-events-auto">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 transition-all duration-300 rounded-full ${index === currentSlide ? 'w-12 bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]' : 'w-4 bg-white/30 hover:bg-white/60'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default function ComplaintList({ userId }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, [userId]);

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/complaints/');
      const myComplaints = res.data.filter(c => c.user_id === userId);
      setComplaints(myComplaints.reverse());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20">
      <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-sm text-slate-500 font-medium">Loading your complaints...</p>
    </div>
  );

  return (
    <div>
      {/* Hero Section */}
      <HeroCarousel />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">My Complaints</h1>
          <p className="text-slate-500 text-sm sm:text-base">Track and manage your reported issues</p>
        </div>
        <Link
          to="/report"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" strokeWidth={3} />
          Report New Issue
        </Link>
      </div>

      {/* Complaints Grid */}
      <div className="space-y-6">
        {complaints.length === 0 ? (
          <div className="text-center py-24 backdrop-blur-xl bg-white/90 rounded-2xl border border-slate-200/60 shadow-lg px-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-1">No Complaints Yet</h3>
            <p className="text-sm text-slate-400 mb-8 max-w-xs mx-auto">You haven't filed any complaints yet. Start by reporting an issue in your community.</p>
            <Link
              to="/report"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-blue-700 text-sm font-bold bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/60 hover:shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Report Your First Issue
            </Link>
          </div>
        ) : (
          complaints.map((c) => (
            <div
              key={c.id}
              className="group backdrop-blur-xl bg-white/95 border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row gap-6 p-6">
                {/* Image Section */}
                {c.image_url && (
                  <div className="shrink-0">
                    <div className="relative w-full sm:w-44 h-44 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/60 shadow-inner">
                      <img
                        src={getImageUrl(c.image_url)}
                        alt="Evidence"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    </div>
                  </div>
                )}

                {/* Content Section */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    {/* Header with Category and Status */}
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
                      <span className="inline-flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200/50">
                        {c.category}
                      </span>
                      <span
                        className={`inline-flex items-center px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyles[c.status] || 'bg-gray-100 text-gray-600'}`}
                      >
                        {c.status}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-xl sm:text-2xl text-slate-900 group-hover:text-blue-700 transition-colors mb-3 leading-tight tracking-tight">
                      {c.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-4">
                      {c.description}
                    </p>
                  </div>

                  {/* Footer with Date and Verification */}
                  <div className="mt-auto pt-5 border-t border-slate-100 flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-xs text-slate-500 font-semibold">
                        {new Date(c.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    {c.status === 'Solved' && (
                      <span className="inline-flex items-center gap-2 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full shadow-sm border border-emerald-100/50">
                        <CheckCircle2 className="w-4 h-4" />
                        VERIFIED RESOLUTION
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
