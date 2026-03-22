import React from 'react';
import { Link } from 'react-router-dom';
import {
    Camera,
    Send,
    Bell,
    CheckCircle,
    ArrowRight,
    FileText,
    Shield,
    Clock,
    Award
} from 'lucide-react';

export default function HowItWorks() {
    const citizenSteps = [
        {
            icon: Camera,
            title: 'Capture the Issue',
            description: 'Take a photo of the civic problem you want to report. Clear images help authorities understand the issue better.',
            color: 'blue'
        },
        {
            icon: FileText,
            title: 'Fill Details',
            description: 'Provide a title and detailed description. Our AI automatically suggests the appropriate category for faster routing.',
            color: 'cyan'
        },
        {
            icon: Send,
            title: 'Submit Report',
            description: 'Submit your complaint with one click. You\'ll receive an instant confirmation with a unique tracking ID.',
            color: 'emerald'
        },
        {
            icon: Bell,
            title: 'Track Progress',
            description: 'Monitor real-time status updates as authorities work on your issue. Get notifications at every step.',
            color: 'amber'
        },
        {
            icon: CheckCircle,
            title: 'Verify Resolution',
            description: 'View proof of resolution with photos and comments from authorities. Provide feedback on the solution.',
            color: 'purple'
        }
    ];

    const adminSteps = [
        {
            icon: Bell,
            title: 'Receive Notification',
            description: 'Get instant alerts when new complaints are filed in your jurisdiction.',
            color: 'blue'
        },
        {
            icon: FileText,
            title: 'Review & Categorize',
            description: 'AI pre-categorizes issues, but you can review and adjust as needed.',
            color: 'cyan'
        },
        {
            icon: Clock,
            title: 'Acknowledge & Work',
            description: 'Mark issues as "Working" to inform citizens that action is underway.',
            color: 'amber'
        },
        {
            icon: Award,
            title: 'Resolve & Document',
            description: 'Upload proof of resolution with photos and detailed comments.',
            color: 'emerald'
        }
    ];

    const features = [
        {
            icon: Shield,
            title: 'Secure & Private',
            description: 'Your data is encrypted and protected with government-grade security standards.'
        },
        {
            icon: Clock,
            title: '24/7 Availability',
            description: 'Report issues anytime, anywhere. The platform never sleeps.'
        },
        {
            icon: Bell,
            title: 'Real-time Updates',
            description: 'Get instant notifications via email and in-app alerts.'
        },
        {
            icon: Award,
            title: 'Verified Outcomes',
            description: 'All resolutions are documented with photographic proof.'
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 py-20 sm:py-28 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/20 border border-cyan-400/30 text-cyan-300 text-sm font-bold mb-6 backdrop-blur-sm">
                        <FileText className="w-4 h-4" />
                        Step-by-Step Guide
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
                        How CivicEase
                        <br />
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            Works
                        </span>
                    </h1>

                    <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                        A simple, transparent process from reporting to resolution
                    </p>
                </div>
            </section>

            {/* Citizen Journey */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-bold mb-4">
                            For Citizens
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">
                            Report & Track Issues
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Five simple steps to make your voice heard
                        </p>
                    </div>

                    <div className="relative">
                        {/* Connection line for desktop */}
                        <div className="hidden lg:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-cyan-200 to-purple-200"></div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
                            {citizenSteps.map((step, idx) => {
                                const Icon = step.icon;
                                return (
                                    <div key={idx} className="relative">
                                        {/* Step number badge */}
                                        <div className={`absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-to-br from-${step.color}-600 to-${step.color}-700 text-white font-black text-lg flex items-center justify-center shadow-lg z-10`}>
                                            {idx + 1}
                                        </div>

                                        <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200/60 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-2 transition-all h-full">
                                            <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br from-${step.color}-500 to-${step.color}-600 text-white mb-6 shadow-lg`}>
                                                <Icon className="w-8 h-8" />
                                            </div>

                                            <h3 className="text-xl font-bold text-slate-900 mb-3">
                                                {step.title}
                                            </h3>

                                            <p className="text-slate-600 leading-relaxed text-sm">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center mt-12">
                        <Link
                            to="/report"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white text-base font-bold bg-gradient-to-r from-blue-600 to-cyan-600 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105 transition-all"
                        >
                            Start Reporting Now
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Admin Journey */}
            <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold mb-4">
                            For Authorities
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">
                            Manage & Resolve
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Efficient workflow for government officials
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {adminSteps.map((step, idx) => {
                            const Icon = step.icon;
                            return (
                                <div key={idx} className="relative">
                                    {/* Step number badge */}
                                    <div className={`absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-to-br from-${step.color}-600 to-${step.color}-700 text-white font-black text-lg flex items-center justify-center shadow-lg z-10`}>
                                        {idx + 1}
                                    </div>

                                    <div className="bg-white border border-slate-200/60 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-2 transition-all h-full">
                                        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br from-${step.color}-500 to-${step.color}-600 text-white mb-6 shadow-lg`}>
                                            <Icon className="w-8 h-8" />
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-900 mb-3">
                                            {step.title}
                                        </h3>

                                        <p className="text-slate-600 leading-relaxed text-sm">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">
                            Platform Features
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Built with modern technology for maximum efficiency
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={idx}
                                    className="bg-gradient-to-br from-white to-slate-50 border border-slate-200/60 rounded-2xl p-8 hover:shadow-xl transition-all text-center"
                                >
                                    <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white mb-6 shadow-lg">
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


            {/* FAQ Preview */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6">
                        Have Questions?
                    </h2>
                    <p className="text-lg text-slate-600 mb-10">
                        Check out our comprehensive FAQ section for detailed answers
                    </p>

                    <Link
                        to="/faq"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-blue-700 text-base font-bold bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200/60 hover:shadow-lg hover:border-blue-300 transition-all"
                    >
                        View All FAQs
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
