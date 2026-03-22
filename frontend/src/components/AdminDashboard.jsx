import React, { useEffect, useState } from 'react';
import api, { getImageUrl } from '../api';

const StatusBadge = ({ status }) => {
  const colors = {
    Pending: 'bg-gradient-to-r from-amber-50 to-amber-100/80 text-amber-700 ring-1 ring-inset ring-amber-600/20',
    Working: 'bg-gradient-to-r from-blue-50 to-blue-100/80 text-blue-700 ring-1 ring-inset ring-blue-600/20',
    Solved: 'bg-gradient-to-r from-emerald-50 to-emerald-100/80 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
    Invalid: 'bg-gradient-to-r from-red-50 to-red-100/80 text-red-700 ring-1 ring-inset ring-red-600/20',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${colors[status]}`}
    >
      {status}
    </span>
  );
};

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [proofImage, setProofImage] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await api.get('/complaints/');
    setComplaints(res.data);
  };

  const handleUpdateStatus = async (status) => {
    setLoading(true);

    const data = new FormData();
    data.append('new_status', status);
    if (comment) data.append('admin_comment', comment);
    if (proofImage && status === 'Solved') data.append('proof_image', proofImage);

    try {
      await api.patch(`/complaints/${selectedTicket.id}/status`, data);
      await loadData();
      setSelectedTicket(null);
      setProofImage(null);
      setComment('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50/30 to-white p-4 sm:p-6 lg:p-8">

      {/* Page Header */}
      <div className="max-w-[1600px] mx-auto mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">Admin Dashboard</h1>
        <p className="text-sm text-slate-500">Manage and resolve citizen complaints</p>
      </div>

      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-5 lg:gap-6 h-auto lg:h-[calc(100vh-180px)]">

        {/* ================= LEFT PANEL: Ticket List ================= */}
        <div className="w-full lg:w-[380px] xl:w-[420px] flex flex-col backdrop-blur-xl bg-white/90 border border-slate-200/60 rounded-2xl shadow-lg overflow-hidden">

          <div className="px-5 py-4 border-b border-slate-200/80 bg-gradient-to-r from-white to-slate-50/50">
            <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              All Tickets <span className="ml-1.5 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">{complaints.length}</span>
            </h2>
          </div>

          <div className="overflow-y-auto flex-1 p-3 space-y-2">

            {complaints.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedTicket(c)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200 border group
                  ${selectedTicket?.id === c.id
                    ? 'bg-gradient-to-br from-blue-50 to-cyan-50/50 shadow-md border-blue-300/60 ring-2 ring-blue-200/50'
                    : 'bg-white/70 hover:bg-white hover:shadow-md border-slate-200/40 hover:border-blue-200/60'}
                `}
              >
                <div className="flex justify-between items-start mb-2.5">
                  <StatusBadge status={c.status} />
                  <span className="text-[10px] font-medium text-slate-400 mt-0.5">
                    {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-800 truncate mb-1 group-hover:text-blue-700 transition-colors">
                  {c.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {c.description}
                </p>
              </button>
            ))}

          </div>
        </div>

        {/* ================= RIGHT PANEL: Ticket Details ================= */}
        <div className="flex-1 backdrop-blur-xl bg-white/90 border border-slate-200/60 rounded-2xl shadow-lg p-6 sm:p-8 overflow-y-auto">

          {selectedTicket ? (
            <div className="space-y-6">

              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 pb-6 border-b border-slate-200/80">
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 mb-3">
                    <StatusBadge status={selectedTicket.status} />
                    <span className="text-[10px] font-mono font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                      ID #{selectedTicket.id}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                    {selectedTicket.title}
                  </h1>
                </div>

                <span className="inline-flex items-center text-xs bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 px-4 py-2 rounded-xl font-bold border border-blue-200/40 shadow-sm">
                  {selectedTicket.category}
                </span>
              </div>


              {/* Content Grid */}
              <div className="grid lg:grid-cols-5 gap-6">

                {/* LEFT SIDE: Details */}
                <div className="lg:col-span-3 space-y-5">

                  <div>
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                      Description
                    </h3>

                    <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-xl border border-slate-200/60 p-5 text-sm text-slate-700 leading-relaxed shadow-sm">
                      {selectedTicket.description}
                    </div>
                  </div>

                  {selectedTicket.image_url && (
                    <div>
                      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                        Evidence Photo
                      </h3>

                      <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200/60 aspect-video bg-slate-100">
                        <img
                          src={getImageUrl(selectedTicket.image_url)}
                          className="w-full h-full object-cover"
                          alt="evidence"
                        />
                      </div>
                    </div>
                  )}
                </div>


                {/* RIGHT SIDE: Actions Panel */}
                <div className="lg:col-span-2">
                  <div className="bg-gradient-to-br from-white via-slate-50/30 to-slate-50 rounded-2xl border border-slate-200/60 p-5 shadow-md space-y-4 sticky top-0">

                    <h3 className="text-sm font-bold text-slate-800 mb-1">
                      Update Status
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">Take action on this ticket</p>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-2 block">
                        Admin Comment
                      </label>
                      <textarea
                        rows="3"
                        placeholder="Add internal notes or resolution details..."
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white shadow-sm focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 outline-none text-sm resize-none transition-all"
                      />
                    </div>

                    <button
                      onClick={() => handleUpdateStatus('Working')}
                      disabled={loading || selectedTicket.status === 'Working'}
                      className="w-full py-3 px-4 rounded-lg bg-white border-2 border-slate-300 text-slate-700 text-sm font-bold hover:bg-slate-50 hover:border-slate-400 hover:shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Mark In Progress
                    </button>

                    <button
                      onClick={() => handleUpdateStatus('Invalid')}
                      disabled={loading || selectedTicket.status === 'Invalid'}
                      className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-red-50 to-red-100/80 text-red-700 border-2 border-red-200 text-sm font-bold hover:from-red-100 hover:to-red-200/80 hover:shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Mark Invalid
                    </button>

                    <div className="pt-4 border-t border-slate-200 space-y-3">
                      <label className="text-xs font-semibold text-slate-600 block mb-2">
                        Upload Proof (Required for Solved)
                      </label>

                      <input
                        type="file"
                        onChange={e => setProofImage(e.target.files[0])}
                        className="w-full text-xs text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 file:cursor-pointer file:transition-colors border border-slate-200 rounded-lg bg-white cursor-pointer"
                      />

                      <button
                        onClick={() => handleUpdateStatus('Solved')}
                        disabled={loading || !proofImage}
                        className="w-full py-3.5 px-4 rounded-lg text-white text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {loading ? 'Processing...' : 'Mark as Solved'}
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-700 mb-1">No Ticket Selected</h3>
              <p className="text-sm text-slate-400">Select a ticket from the list to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
