import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Shield,
    Clock,
    Users,
    TrendingUp,
    CheckCircle2,
    ArrowRight,
    FileText,
    Bell,
    Award,
    BarChart3,
    AlertCircle
} from 'lucide-react';
import api from '../api';

export default function Home() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await api.get('/complaints/');
                // For now, showing all complaints. In production, filter by user_id
                setComplaints(response.data);
            } catch (error) {
                console.error('Error fetching complaints:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchComplaints();
    }, []);


    const features = [
        {
            icon: FileText,
            title: 'Easy Reporting',
            description: 'Submit civic issues with photos and descriptions in under 2 minutes',
            color: 'blue'
        },
        {
            icon: Bell,
            title: 'Real-time Updates',
            description: 'Get instant notifications on the status of your reported issues',
            color: 'cyan'
        },
        {
            icon: Shield,
            title: 'Transparent Process',
            description: 'Track every step from submission to resolution with full visibility',
            color: 'emerald'
        },
        {
            icon: Award,
            title: 'Verified Solutions',
            description: 'All resolutions are documented with proof and admin verification',
            color: 'amber'
        }
    ];

    const categories = [
        { name: 'Roads & Infrastructure', count: '2,341', icon: '🛣️' },
        { name: 'Sanitation & Waste', count: '1,892', icon: '♻️' },
        { name: 'Street Lighting', count: '1,456', icon: '💡' },
        { name: 'Water Supply', count: '987', icon: '💧' },
        { name: 'Parks & Recreation', count: '654', icon: '🌳' },
        { name: 'Public Safety', count: '543', icon: '🚨' }
    ];

    const getStatusBadge = (status) => {
        const styles = {
            Pending: 'bg-amber-100 text-amber-700 border-amber-200',
            Working: 'bg-blue-100 text-blue-700 border-blue-200',
            Solved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            Invalid: 'bg-red-100 text-red-700 border-red-200'
        };
        return styles[status] || styles.Pending;
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative -mt-8 sm:-mt-12 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden">
                {/* Background with gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 via-blue-900/70 to-blue-900/90"></div>
                </div>

                {/* Content */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/20 border border-cyan-400/30 text-cyan-300 text-sm font-bold mb-6 backdrop-blur-sm">
                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                            Government of India Initiative
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
                            Building Better
                            <br />
                            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                Communities Together
                            </span>
                        </h1>

                        <p className="text-xl sm:text-2xl text-blue-100 mb-10 leading-relaxed max-w-2xl">
                            A unified platform for citizens to report civic issues and track resolutions in real-time.
                            Empowering transparency and accountability in governance.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/report"
                                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-blue-900 text-base font-bold bg-gradient-to-r from-cyan-400 to-blue-400 shadow-xl shadow-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/40 hover:scale-105 transition-all"
                            >
                                Report an Issue
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link
                                to="/how-it-works"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white text-base font-bold bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:bg-white/20 hover:border-white/30 transition-all"
                            >
                                Learn How It Works
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Decorative wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg className="w-full h-12 sm:h-16 text-white" preserveAspectRatio="none" viewBox="0 0 1200 120" fill="currentColor">
                        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
                        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
                        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
                    </svg>
                </div>
            </section>


            {/* Features Section */}
            <section className="py-20 bg-gradient-to-b from-white to-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">
                            Why Choose CivicEase?
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            A modern, transparent, and efficient platform designed for the digital age of governance
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={idx}
                                    className="group relative bg-white border border-slate-200/60 rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-8 h-8" />
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                                        {feature.title}
                                    </h3>

                                    <p className="text-slate-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">
                            Service Categories
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Report issues across multiple civic service categories
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category, idx) => (
                            <div
                                key={idx}
                                className="group flex items-center gap-4 bg-gradient-to-br from-white to-slate-50 border border-slate-200/60 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer"
                            >
                                <div className="text-4xl">{category.icon}</div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                                        {category.name}
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                        {category.count} reports handled
                                    </p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* My Complaints Section */}
            <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">
                                My Complaints
                            </h2>
                            <p className="text-lg text-slate-600">
                                Track the status of your reported issues
                            </p>
                        </div>
                        <Link
                            to="/my-complaints"
                            className="hidden sm:inline-flex items-center gap-2 px-6 py-3 rounded-xl text-blue-600 text-sm font-bold bg-blue-50 border-2 border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all"
                        >
                            View All
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                            <p className="mt-4 text-slate-600">Loading your complaints...</p>
                        </div>
                    ) : complaints.length === 0 ? (
                        <div className="text-center py-16 bg-white border-2 border-dashed border-slate-200 rounded-2xl">
                            <div className="inline-flex p-4 rounded-full bg-slate-100 mb-4">
                                <AlertCircle className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No Complaints Yet</h3>
                            <p className="text-slate-600 mb-6">You haven't reported any issues yet</p>
                            <Link
                                to="/report"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-lg transition-all"
                            >
                                Report Your First Issue
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {complaints.slice(0, 6).map((complaint) => (
                                    <div
                                        key={complaint.id}
                                        className="group bg-white border border-slate-200/60 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusBadge(complaint.status)}`}>
                                                    {complaint.status}
                                                </span>
                                                <span className="text-xs text-slate-500">
                                                    {new Date(complaint.created_at).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>

                                            <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                {complaint.title}
                                            </h3>

                                            <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                                                {complaint.description}
                                            </p>

                                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                                <span className="inline-flex items-center text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">
                                                    {complaint.category}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    ID #{complaint.id}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {complaints.length > 6 && (
                                <div className="text-center mt-8">
                                    <Link
                                        to="/my-complaints"
                                        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-blue-600 text-base font-bold bg-blue-50 border-2 border-blue-200 hover:bg-blue-100 hover:border-blue-300 hover:shadow-lg transition-all"
                                    >
                                        View All {complaints.length} Complaints
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517090504586-fde19ea6066f?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10"></div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
                        Ready to Make a Difference?
                    </h2>
                    <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                        Join thousands of citizens working together to build better, safer, and cleaner communities
                    </p>

                    <Link
                        to="/report"
                        className="inline-flex items-center gap-2 px-10 py-5 rounded-xl text-blue-900 text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 transition-all"
                    >
                        Report Your First Issue
                        <ArrowRight className="w-6 h-6" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
