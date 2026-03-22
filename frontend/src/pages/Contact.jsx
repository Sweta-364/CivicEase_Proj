import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // In production, this would send to backend
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        }, 3000);
    };

    const contactInfo = [
        {
            icon: Mail,
            title: 'Email Us',
            details: 'support@civicease.gov.in',
            subdetails: 'We respond within 24 hours',
            color: 'blue'
        },
        {
            icon: Phone,
            title: 'Call Us',
            details: '1800-123-4567',
            subdetails: 'Toll-free helpline',
            color: 'emerald'
        },
        {
            icon: MapPin,
            title: 'Visit Us',
            details: 'Ministry of Urban Development',
            subdetails: 'New Delhi, India - 110001',
            color: 'amber'
        },
        {
            icon: Clock,
            title: 'Working Hours',
            details: 'Mon - Fri: 9:00 AM - 6:00 PM',
            subdetails: 'Sat: 9:00 AM - 1:00 PM',
            color: 'cyan'
        }
    ];

    const departments = [
        { name: 'Technical Support', email: 'tech@civicease.gov.in' },
        { name: 'General Inquiries', email: 'info@civicease.gov.in' },
        { name: 'Media Relations', email: 'media@civicease.gov.in' },
        { name: 'Partnership Opportunities', email: 'partnerships@civicease.gov.in' }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 py-20 sm:py-28 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Mail className="w-16 h-16 text-cyan-400 mx-auto mb-6" />

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
                        Get In
                        <br />
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            Touch
                        </span>
                    </h1>

                    <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                        We're here to help. Reach out to us for support, feedback, or inquiries
                    </p>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactInfo.map((info, idx) => {
                            const Icon = info.icon;
                            return (
                                <div
                                    key={idx}
                                    className="group bg-gradient-to-br from-white to-slate-50 border border-slate-200/60 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all text-center"
                                >
                                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br from-${info.color}-500 to-${info.color}-600 text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-6 h-6" />
                                    </div>

                                    <h3 className="font-bold text-lg text-slate-900 mb-2">
                                        {info.title}
                                    </h3>

                                    <p className="text-slate-700 font-semibold mb-1">
                                        {info.details}
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        {info.subdetails}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Contact Form & Map */}
            <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div>
                            <div className="mb-8">
                                <h2 className="text-4xl font-black text-slate-900 mb-4">
                                    Send Us a Message
                                </h2>
                                <p className="text-lg text-slate-600">
                                    Fill out the form below and we'll get back to you as soon as possible
                                </p>
                            </div>

                            {submitted ? (
                                <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 border border-emerald-200/60 rounded-2xl p-10 text-center">
                                    <div className="inline-flex p-4 rounded-full bg-emerald-500 text-white mb-4">
                                        <CheckCircle className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                        Message Sent!
                                    </h3>
                                    <p className="text-slate-600">
                                        Thank you for contacting us. We'll respond within 24 hours.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 outline-none transition-all"
                                                placeholder="John Doe"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 outline-none transition-all"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 outline-none transition-all"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                Subject *
                                            </label>
                                            <select
                                                required
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 outline-none transition-all"
                                            >
                                                <option value="">Select a subject</option>
                                                <option value="technical">Technical Support</option>
                                                <option value="general">General Inquiry</option>
                                                <option value="feedback">Feedback</option>
                                                <option value="partnership">Partnership</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            required
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            rows="6"
                                            className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 outline-none resize-none transition-all"
                                            placeholder="Tell us how we can help you..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white text-base font-bold bg-gradient-to-r from-blue-600 to-cyan-600 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-[1.02] transition-all"
                                    >
                                        <Send className="w-5 h-5" />
                                        Send Message
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Map & Departments */}
                        <div className="space-y-8">
                            {/* Map Placeholder */}
                            <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg">
                                <div className="aspect-video bg-slate-100 relative">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.0266034!2d77.20902931508078!3d28.626137982422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd371d97c9d1%3A0x5b1b2c8f5e4c3d2a!2sIndia%20Gate!5e0!3m2!1sen!2sin!4v1234567890"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        title="Office Location"
                                    ></iframe>
                                </div>
                            </div>

                            {/* Department Contacts */}
                            <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200/60 rounded-2xl p-8">
                                <h3 className="text-2xl font-black text-slate-900 mb-6">
                                    Department Contacts
                                </h3>

                                <div className="space-y-4">
                                    {departments.map((dept, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between p-4 bg-white border border-slate-200/60 rounded-xl hover:shadow-md transition-all"
                                        >
                                            <div>
                                                <h4 className="font-bold text-slate-900 mb-1">
                                                    {dept.name}
                                                </h4>
                                                <a
                                                    href={`mailto:${dept.email}`}
                                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                                >
                                                    {dept.email}
                                                </a>
                                            </div>
                                            <Mail className="w-5 h-5 text-slate-400" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
