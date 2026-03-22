import React, { useState } from 'react';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';

export default function FAQ() {
    const [searchQuery, setSearchQuery] = useState('');
    const [openIndex, setOpenIndex] = useState(null);

    const categories = [
        {
            name: 'Getting Started',
            icon: '🚀',
            faqs: [
                {
                    question: 'How do I create an account on CivicEase?',
                    answer: 'Currently, CivicEase operates with a simplified demo mode. You can toggle between Citizen and Admin roles using the button in the top-right corner. In the full version, you\'ll be able to register using your government-issued ID and email address.'
                },
                {
                    question: 'Is CivicEase free to use?',
                    answer: 'Yes, CivicEase is completely free for all citizens. This is a government initiative aimed at improving civic engagement and transparency at no cost to the public.'
                },
                {
                    question: 'What types of issues can I report?',
                    answer: 'You can report various civic issues including road damage, sanitation problems, street lighting issues, water supply problems, park maintenance, public safety concerns, and more. Our AI categorizes your complaint automatically.'
                }
            ]
        },
        {
            name: 'Reporting Issues',
            icon: '📝',
            faqs: [
                {
                    question: 'Do I need to upload a photo with my complaint?',
                    answer: 'Yes, a photo is required as it helps authorities better understand the issue and prioritize response. Clear, well-lit photos showing the problem from multiple angles are most helpful.'
                },
                {
                    question: 'How long does it take to get a response?',
                    answer: 'Most complaints are acknowledged within 24-48 hours. Resolution time varies based on the complexity and severity of the issue, but our average response time is 2.4 hours for acknowledgment and 5-7 days for resolution.'
                },
                {
                    question: 'Can I report issues anonymously?',
                    answer: 'While you need to be logged in to track your complaint, your personal information is kept confidential and only shared with relevant authorities. Your name is not publicly displayed with the complaint.'
                },
                {
                    question: 'What happens after I submit a complaint?',
                    answer: 'After submission, you receive a unique tracking ID. The complaint is automatically categorized and routed to the appropriate department. You\'ll receive real-time updates as authorities work on resolving the issue.'
                }
            ]
        },
        {
            name: 'Tracking & Updates',
            icon: '📊',
            faqs: [
                {
                    question: 'How do I track my complaint status?',
                    answer: 'Navigate to "My Complaints" from the dashboard. You\'ll see all your submitted complaints with their current status: Pending, Working, Solved, or Invalid. Click on any complaint for detailed information.'
                },
                {
                    question: 'Will I receive notifications about my complaint?',
                    answer: 'Yes, you\'ll receive notifications via email and in-app alerts whenever there\'s a status update on your complaint. You can customize notification preferences in your account settings.'
                },
                {
                    question: 'What do the different status labels mean?',
                    answer: 'Pending: Complaint received, awaiting review. Working: Authorities are actively addressing the issue. Solved: Issue has been resolved with proof uploaded. Invalid: Complaint was determined to be spam or duplicate.'
                }
            ]
        },
        {
            name: 'For Authorities',
            icon: '👨‍💼',
            faqs: [
                {
                    question: 'How do I access the admin dashboard?',
                    answer: 'Government officials are provided with admin credentials. Use the role toggle in the demo version, or log in with your official credentials in the production system to access the admin dashboard.'
                },
                {
                    question: 'How are complaints assigned to departments?',
                    answer: 'Our AI automatically categorizes complaints based on the description and routes them to the appropriate department. Admins can manually reassign if needed.'
                },
                {
                    question: 'What information should I include when marking an issue as resolved?',
                    answer: 'When resolving an issue, upload clear photos showing the completed work, provide a detailed comment explaining what was done, and ensure the resolution date is accurate. This creates a transparent audit trail.'
                }
            ]
        },
        {
            name: 'Technical Support',
            icon: '🔧',
            faqs: [
                {
                    question: 'What browsers are supported?',
                    answer: 'CivicEase works best on modern browsers including Chrome, Firefox, Safari, and Edge (latest versions). We recommend keeping your browser updated for the best experience.'
                },
                {
                    question: 'Can I use CivicEase on my mobile phone?',
                    answer: 'Yes! CivicEase is fully responsive and works seamlessly on smartphones and tablets. You can even use your phone\'s camera to capture and upload photos directly.'
                },
                {
                    question: 'What should I do if I encounter an error?',
                    answer: 'Try refreshing the page first. If the issue persists, clear your browser cache or try a different browser. For persistent technical issues, contact our support team through the Contact page.'
                },
                {
                    question: 'Is my data secure?',
                    answer: 'Yes, we use government-grade encryption and security protocols. All data is stored on secure servers, and we comply with national data protection regulations. Read our Privacy Policy for more details.'
                }
            ]
        },
        {
            name: 'Account & Privacy',
            icon: '🔒',
            faqs: [
                {
                    question: 'How is my personal information used?',
                    answer: 'Your information is used solely for complaint tracking and communication. We never share your data with third parties. See our Privacy Policy for complete details.'
                },
                {
                    question: 'Can I delete my account?',
                    answer: 'Yes, you can request account deletion by contacting support. Note that complaint records may be retained for administrative purposes as required by law.'
                },
                {
                    question: 'How do I update my contact information?',
                    answer: 'Log in to your account and navigate to Settings. You can update your email, phone number, and notification preferences there.'
                }
            ]
        }
    ];

    const filteredCategories = categories.map(category => ({
        ...category,
        faqs: category.faqs.filter(faq =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.faqs.length > 0);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 py-20 sm:py-28 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <HelpCircle className="w-16 h-16 text-cyan-400 mx-auto mb-6" />

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
                        Frequently Asked
                        <br />
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            Questions
                        </span>
                    </h1>

                    <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-10">
                        Find answers to common questions about using CivicEase
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search for answers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/95 backdrop-blur-sm border-2 border-white/20 text-slate-900 placeholder:text-slate-400 shadow-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="py-20 bg-gradient-to-b from-white to-slate-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {filteredCategories.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-700 mb-2">No results found</h3>
                            <p className="text-slate-500">Try searching with different keywords</p>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {filteredCategories.map((category, catIdx) => (
                                <div key={catIdx}>
                                    {/* Category Header */}
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="text-4xl">{category.icon}</span>
                                        <h2 className="text-3xl font-black text-slate-900">
                                            {category.name}
                                        </h2>
                                    </div>

                                    {/* FAQs */}
                                    <div className="space-y-4">
                                        {category.faqs.map((faq, faqIdx) => {
                                            const globalIndex = `${catIdx}-${faqIdx}`;
                                            const isOpen = openIndex === globalIndex;

                                            return (
                                                <div
                                                    key={faqIdx}
                                                    className="bg-white border border-slate-200/60 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                                                >
                                                    <button
                                                        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                                                        className="w-full flex items-center justify-between gap-4 p-6 text-left hover:bg-slate-50 transition-colors"
                                                    >
                                                        <span className="font-bold text-lg text-slate-900 pr-4">
                                                            {faq.question}
                                                        </span>
                                                        <ChevronDown
                                                            className={`w-6 h-6 text-blue-600 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''
                                                                }`}
                                                        />
                                                    </button>

                                                    {isOpen && (
                                                        <div className="px-6 pb-6 pt-2">
                                                            <div className="pl-4 border-l-4 border-blue-500">
                                                                <p className="text-slate-600 leading-relaxed">
                                                                    {faq.answer}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Still Have Questions */}
            <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10"></div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
                        Still Have Questions?
                    </h2>

                    <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                        Our support team is here to help you with any questions or concerns
                    </p>

                    <a
                        href="/contact"
                        className="inline-flex items-center gap-2 px-10 py-5 rounded-xl text-blue-900 text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 transition-all"
                    >
                        Contact Support
                    </a>
                </div>
            </section>
        </div>
    );
}
