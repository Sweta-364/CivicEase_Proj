import React from 'react';
import { Target, Eye, Heart, Users, Award, Globe, Shield, Zap } from 'lucide-react';

export default function About() {
    const values = [
        {
            icon: Shield,
            title: 'Transparency',
            description: 'Every action is tracked and visible to citizens, ensuring complete accountability in governance.'
        },
        {
            icon: Zap,
            title: 'Efficiency',
            description: 'Streamlined processes and AI-powered categorization ensure rapid response to civic issues.'
        },
        {
            icon: Heart,
            title: 'Community First',
            description: 'Built with citizens at the center, empowering communities to actively participate in governance.'
        },
        {
            icon: Globe,
            title: 'Accessibility',
            description: 'Available 24/7 from any device, making civic engagement accessible to everyone.'
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 py-20 sm:py-28 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/20 border border-cyan-400/30 text-cyan-300 text-sm font-bold mb-6 backdrop-blur-sm">
                        <Award className="w-4 h-4" />
                        About CivicEase
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
                        Transforming Civic
                        <br />
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            Engagement
                        </span>
                    </h1>

                    <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                        A government initiative leveraging technology to create transparent,
                        efficient, and citizen-centric governance
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Mission */}
                        <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200/60 rounded-3xl p-10 hover:shadow-2xl transition-all">
                            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white mb-6 shadow-lg group-hover:scale-110 transition-transform">
                                <Target className="w-10 h-10" />
                            </div>

                            <h2 className="text-3xl font-black text-slate-900 mb-4">Our Mission</h2>

                            <p className="text-lg text-slate-700 leading-relaxed mb-6">
                                To empower citizens with a unified, transparent platform for reporting and tracking
                                civic issues, fostering accountability and rapid response in governance.
                            </p>

                            <ul className="space-y-3">
                                {[
                                    'Enable seamless citizen-government communication',
                                    'Ensure transparency in issue resolution',
                                    'Reduce response time for civic problems',
                                    'Build trust through verified outcomes'
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-slate-700 font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Vision */}
                        <div className="group bg-gradient-to-br from-emerald-50 to-cyan-50 border border-emerald-200/60 rounded-3xl p-10 hover:shadow-2xl transition-all">
                            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-cyan-600 text-white mb-6 shadow-lg group-hover:scale-110 transition-transform">
                                <Eye className="w-10 h-10" />
                            </div>

                            <h2 className="text-3xl font-black text-slate-900 mb-4">Our Vision</h2>

                            <p className="text-lg text-slate-700 leading-relaxed mb-6">
                                To create a future where every citizen actively participates in building better
                                communities through technology-enabled, transparent, and efficient governance.
                            </p>

                            <ul className="space-y-3">
                                {[
                                    'Smart cities with proactive maintenance',
                                    'AI-driven predictive issue detection',
                                    'Zero-tolerance for unresolved complaints',
                                    'National standard for civic engagement'
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-slate-700 font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">
                            Our Core Values
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            The principles that guide everything we do
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, idx) => {
                            const Icon = value.icon;
                            return (
                                <div
                                    key={idx}
                                    className="bg-white border border-slate-200/60 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all"
                                >
                                    <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white mb-6 shadow-lg">
                                        <Icon className="w-8 h-8" />
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                                        {value.title}
                                    </h3>

                                    <p className="text-slate-600 leading-relaxed">
                                        {value.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Timeline */}

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10"></div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Users className="w-16 h-16 text-cyan-400 mx-auto mb-6" />

                    <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
                        Join Our Mission
                    </h2>

                    <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                        Be part of the movement to create transparent, efficient, and citizen-centric governance
                    </p>
                </div>
            </section>
        </div>
    );
}
