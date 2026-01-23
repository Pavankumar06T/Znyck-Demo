import React, { useState } from 'react';
import { Check, ChevronRight, ChevronLeft, Upload, Building2, User, FileText, X, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Steps = [
    { id: 1, title: 'Basic Details', icon: User, description: 'Personal Info & Contact' },
    { id: 2, title: 'Business Details', icon: Building2, description: 'Organization & Banking' },
    { id: 3, title: 'KYC Details', icon: FileText, description: 'Identity Verification' }
];

export default function OnboardingModal({ isOpen, onClose, onComplete }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [error, setError] = useState('');

    // Initial State with some pre-filled data (simulating user profile)
    const [formData, setFormData] = useState({
        // Step 1
        contactNumber: '+91 9003797774',
        fullName: 'Pavankumar',
        nickName: '',
        country: '',
        // Step 2
        orgName: '',
        orgWebsite: '',
        businessAddress: '',
        pan: '',
        gst: '',
        bankAccount: '',
        ifsc: '',
        // Step 3
        idProof: null,
        addressProof: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError(''); // Clear error on typing
    };

    const validateStep = (step) => {
        if (step === 1) {
            if (!formData.contactNumber || !formData.fullName || !formData.nickName || !formData.country) {
                return "Please fill in all Basic Details fields.";
            }
        }
        if (step === 2) {
            if (!formData.orgName || !formData.businessAddress || !formData.orgWebsite || !formData.pan || !formData.bankAccount || !formData.ifsc) {
                return "Please fill in all Business & Bank Details.";
            }
        }
        // Step 3 validation can be lax or strict depending on requirement, usually checking if files exist
        // For this demo, we can assume optional or mandatory. Let's make it mandatory visually but pass for demo if needed.
        return null;
    };

    const handleNext = () => {
        const validationError = validateStep(currentStep);
        if (validationError) {
            setError(validationError);
            return;
        }

        if (currentStep < 3) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Final Step - Complete
            onComplete();
            onClose();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
            setError('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-[#1c1f2e] w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[600px] border border-slate-200 dark:border-white/10"
            >

                {/* Left Sidebar: Progress */}
                <div className="w-full md:w-1/3 bg-slate-50 dark:bg-[#151722] p-8 border-r border-slate-200 dark:border-white/10 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">Z</div>
                            <span className="font-bold text-lg text-slate-900 dark:text-white">Onboarding</span>
                        </div>

                        <div className="space-y-6">
                            {Steps.map((step) => {
                                const isActive = step.id === currentStep;
                                const isCompleted = step.id < currentStep;

                                return (
                                    <div key={step.id} className="relative pl-8">
                                        {/* Line */}
                                        {step.id !== Steps.length && (
                                            <div className={`absolute left-[11px] top-8 h-10 w-0.5 ${isCompleted ? 'bg-green-500' : 'bg-slate-200 dark:bg-white/10'}`} />
                                        )}

                                        {/* Icon Dot */}
                                        <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-slate-50 dark:ring-[#151722] z-10 transition-colors ${isCompleted ? 'bg-green-500 text-white' :
                                                isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-gray-500'
                                            }`}>
                                            {isCompleted ? <Check size={14} /> : step.id}
                                        </div>

                                        <div>
                                            <h4 className={`text-sm font-semibold transition-colors ${isActive || isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-gray-500'}`}>
                                                {step.title}
                                            </h4>
                                            <p className="text-xs text-slate-500 dark:text-gray-500 mt-0.5">{step.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="text-xs text-slate-500 dark:text-gray-600">
                        Need help? <a href="#" className="text-blue-500 hover:underline">Contact Support</a>
                    </div>
                </div>

                {/* Right Content: Forms */}
                <div className="flex-1 flex flex-col relative bg-white dark:bg-[#1c1f2e]">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors text-slate-500 dark:text-gray-400 z-10">
                        <X size={20} />
                    </button>

                    <div className="flex-1 p-8 md:p-12 overflow-y-auto">
                        <div className="max-w-lg mx-auto">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                {Steps[currentStep - 1].title}
                            </h2>
                            <p className="text-slate-500 dark:text-gray-400 mb-6">
                                Please provide your details to verify your identity.
                            </p>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm flex items-center gap-2"
                                >
                                    <AlertCircle size={16} />
                                    <span>{error}</span>
                                </motion.div>
                            )}

                            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">

                                {currentStep === 1 && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 dark:bg-[#0f1117] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-2">Nickname</label>
                                            <input
                                                type="text"
                                                name="nickName"
                                                value={formData.nickName}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 dark:bg-[#0f1117] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                                placeholder="Johnny"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-2">Contact Number</label>
                                            <input
                                                type="text"
                                                name="contactNumber"
                                                value={formData.contactNumber}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 dark:bg-[#0f1117] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                                placeholder="+91 0000000000"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-2">Country</label>
                                            <input
                                                type="text"
                                                name="country"
                                                value={formData.country}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 dark:bg-[#0f1117] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                                placeholder="India"
                                            />
                                        </div>
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-2">Organization Name</label>
                                            <input
                                                type="text"
                                                name="orgName"
                                                value={formData.orgName}
                                                onChange={handleChange}
                                                placeholder="Znyck Tech Pvt Ltd"
                                                className="w-full bg-slate-50 dark:bg-[#0f1117] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-2">Organization Website</label>
                                            <input
                                                type="url"
                                                name="orgWebsite"
                                                value={formData.orgWebsite}
                                                onChange={handleChange}
                                                placeholder="https://znyck.com"
                                                className="w-full bg-slate-50 dark:bg-[#0f1117] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-blue-600 dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-2">Business Address</label>
                                            <textarea
                                                name="businessAddress"
                                                value={formData.businessAddress}
                                                onChange={handleChange}
                                                rows="2"
                                                placeholder="#123, Tech Park, Bangalore..."
                                                className="w-full bg-slate-50 dark:bg-[#0f1117] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-2">PAN Number</label>
                                            <input
                                                type="text"
                                                name="pan"
                                                value={formData.pan}
                                                onChange={handleChange}
                                                placeholder="ABCDE1234F"
                                                className="w-full bg-slate-50 dark:bg-[#0f1117] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all uppercase placeholder:normal-case"
                                            />
                                        </div>

                                        <div className="pt-4 border-t border-slate-200 dark:border-white/5">
                                            <h5 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Bank Account Details</h5>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-2">Account Number</label>
                                                    <input
                                                        type="text"
                                                        name="bankAccount"
                                                        value={formData.bankAccount}
                                                        onChange={handleChange}
                                                        placeholder="0000 0000 0000"
                                                        className="w-full bg-slate-50 dark:bg-[#0f1117] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-2">IFSC Code</label>
                                                    <input
                                                        type="text"
                                                        name="ifsc"
                                                        value={formData.ifsc}
                                                        onChange={handleChange}
                                                        placeholder="HDFC0001234"
                                                        className="w-full bg-slate-50 dark:bg-[#0f1117] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all uppercase"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 3 && (
                                    <div className="space-y-6">
                                        <div className="p-4 border border-dashed border-slate-300 dark:border-white/20 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer text-center">
                                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600 dark:text-blue-400">
                                                <Upload size={20} />
                                            </div>
                                            <h4 className="font-semibold text-slate-900 dark:text-white">Upload ID Proof</h4>
                                            <p className="text-xs text-slate-500 dark:text-gray-500 mt-1">Aadhaar, Passport or Driving License</p>
                                        </div>

                                        <div className="p-4 border border-dashed border-slate-300 dark:border-white/20 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer text-center">
                                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600 dark:text-blue-400">
                                                <Upload size={20} />
                                            </div>
                                            <h4 className="font-semibold text-slate-900 dark:text-white">Upload Business Proof</h4>
                                            <p className="text-xs text-slate-500 dark:text-gray-500 mt-1">GST Certificate or Document</p>
                                        </div>
                                    </div>
                                )}

                                <div className="pt-6 flex items-center gap-3">
                                    {currentStep > 1 && (
                                        <button
                                            type="button"
                                            onClick={handleBack}
                                            className="px-6 py-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-all text-sm uppercase tracking-wide flex items-center justify-center gap-2"
                                        >
                                            <ChevronLeft size={18} />
                                            <span>Back</span>
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/25 transition-all text-sm uppercase tracking-wide flex items-center justify-center gap-2"
                                    >
                                        <span>{currentStep === 3 ? 'Complete Verification' : 'Continue'}</span>
                                        <ChevronRight size={18} />
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
