import React from 'react';
import { Link } from 'react-router-dom';
import {
    Wrench,
    Lightbulb,
    Droplet,
    Trees,
    Shield,
    Building2,
    AlertTriangle,
    Trash2,
    ArrowRight,
    CheckCircle
} from 'lucide-react';

export default function Services() {
    const services = [
        {
            icon: Wrench,
            title: 'Roads & Infrastructure',
            description: 'Report potholes, damaged roads, broken pavements, and infrastructure issues',
            features: ['Pothole reporting', 'Pavement damage', 'Road signage issues', 'Bridge maintenance'],
            color: 'blue',
            stats: { reports: '2,341', avgTime: '5 days' }
        },
        {
            icon: Trash2,
            title: 'Sanitation & Waste',
            description: 'Issues related to garbage collection, waste management, and cleanliness',
            features: ['Missed collections', 'Illegal dumping', 'Overflowing bins', 'Street cleaning'],
            color: 'emerald',
            stats: { reports: '1,892', avgTime: '2 days' }
        },
        {
            icon: Lightbulb,
            title: 'Street Lighting',
            description: 'Report non-functional street lights, damaged poles, and lighting issues',
            features: ['Broken lights', 'Flickering bulbs', 'Damaged poles', 'Dark spots'],
            color: 'amber',
            stats: { reports: '1,456', avgTime: '3 days' }
        },
        {
            icon: Droplet,
            title: 'Water Supply',
            description: 'Water leakage, supply issues, contamination, and drainage problems',
            features: ['Pipe leakage', 'No water supply', 'Water quality', 'Drainage blocks'],
            color: 'cyan',
            stats: { reports: '987', avgTime: '4 days' }
        },
        {
            icon: Trees,
            title: 'Parks & Recreation',
            description: 'Maintenance of parks, playgrounds, and public recreational spaces',
            features: ['Equipment damage', 'Landscaping', 'Safety hazards', 'Cleanliness'],
            color: 'green',
            stats: { reports: '654', avgTime: '6 days' }
        },
        {
            icon: Shield,
            title: 'Public Safety',
            description: 'Safety concerns, hazards, and security-related issues in public areas',
            features: ['Safety hazards', 'Missing signs', 'Unsafe structures', 'Security concerns'],
            color: 'red',
            stats: { reports: '543', avgTime: '1 day' }
        },
        {
            icon: Building2,
            title: 'Public Buildings',
            description: 'Issues with government buildings, community centers, and public facilities',
            features: ['Building damage', 'Accessibility', 'Facility maintenance', 'Cleanliness'],
            color: 'purple',
            stats: { reports: '432', avgTime: '7 days' }
        },
        {
            icon: AlertTriangle,
            title: 'Emergency Services',
            description: 'Urgent issues requiring immediate attention and rapid response',
            features: ['Urgent hazards', 'Public health', 'Critical infrastructure', 'Emergency access'],
            color: 'orange',
            stats: { reports: '234', avgTime: '12 hrs' }
        }
    ];

    const process = [
        { step: '1', title: 'Identify', description: 'Spot a civic issue in your area' },
        { step: '2', title: 'Report', description: 'Submit with photo and details' },
        { step: '3', title: 'Track', description: 'Monitor progress in real-time' },
        { step: '4', title: 'Verify', description: 'Confirm resolution with proof' }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 py-20 sm:py-28 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/20 border border-cyan-400/30 text-cyan-300 text-sm font-bold mb-6 backdrop-blur-sm">
                        <Wrench className="w-4 h-4" />
                        Civic Services
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
                        Our
                        <br />
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            Services
                        </span>
                    </h1>

                    <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                        Comprehensive civic issue reporting across multiple service categories
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">
                            What Can You Report?
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            We handle a wide range of civic issues to keep your community safe and well-maintained
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {services.map((service, idx) => {
                            const Icon = service.icon;
                            return (
                                <div
                                    key={idx}
                                    className="group bg-gradient-to-br from-white to-slate-50 border border-slate-200/60 rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-2 transition-all"
                                >
                                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br from-${service.color}-500 to-${service.color}-600 text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-6 h-6" />
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                                        {service.title}
                                    </h3>

                                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                                        {service.description}
                                    </p>

                                    <div className="space-y-2 mb-4">
                                        {service.features.map((feature, fIdx) => (
                                            <div key={fIdx} className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                                <span className="text-xs text-slate-600">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-xs text-slate-500 mb-1">Total Reports</div>
                                            <div className="text-lg font-black text-slate-900">{service.stats.reports}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500 mb-1">Avg. Time</div>
                                            <div className="text-lg font-black text-slate-900">{service.stats.avgTime}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">
                            Simple 4-Step Process
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            From identification to resolution, we make it easy
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {process.map((item, idx) => (
                            <div key={idx} className="relative text-center">
                                {/* Connector line */}
                                {idx < process.length - 1 && (
                                    <div className="hidden md:block absolute top-12 left-1/2 w-full h-1 bg-gradient-to-r from-blue-200 to-cyan-200 -z-10"></div>
                                )}

                                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 text-white text-3xl font-black mb-4 shadow-xl">
                                    {item.step}
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-2">
                                    {item.title}
                                </h3>

                                <p className="text-slate-600">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            to="/how-it-works"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-blue-700 text-base font-bold bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200/60 hover:shadow-lg hover:border-blue-300 transition-all"
                        >
                            Learn More About Our Process
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 rounded-3xl overflow-hidden relative">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517090504586-fde19ea6066f?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10"></div>

                        <div className="relative px-8 py-16 sm:p-16">
                            <div className="text-center mb-12">
                                <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
                                    Our Impact
                                </h2>
                                <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                                    Making a real difference in communities across the nation
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {[
                                    { value: '12,847', label: 'Issues Resolved', icon: CheckCircle },
                                    { value: '45,231', label: 'Active Citizens', icon: Shield },
                                    { value: '2.4 hrs', label: 'Avg Response', icon: Lightbulb },
                                    { value: '94%', label: 'Satisfaction', icon: Building2 }
                                ].map((stat, idx) => {
                                    const Icon = stat.icon;
                                    return (
                                        <div key={idx} className="text-center">
                                            <Icon className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                                            <div className="text-5xl font-black text-white mb-2">
                                                {stat.value}
                                            </div>
                                            <div className="text-blue-200 font-semibold">
                                                {stat.label}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6">
                        Ready to Report an Issue?
                    </h2>

                    <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
                        Help us build better communities by reporting civic issues in your area
                    </p>

                    <Link
                        to="/report"
                        className="inline-flex items-center gap-2 px-10 py-5 rounded-xl text-white text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all"
                    >
                        Report an Issue Now
                        <ArrowRight className="w-6 h-6" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
