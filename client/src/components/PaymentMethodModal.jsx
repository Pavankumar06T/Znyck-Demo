import React, { useState, useEffect } from 'react';
import { X, CreditCard, Globe, Zap, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PaymentMethodModal({ isOpen, onClose, product, onSelect }) {
    const [selectedMethod, setSelectedMethod] = useState(null);

    // Default Selection Logic
    useEffect(() => {
        if (isOpen && product) {
            if (product.currency === 'INR') {
                setSelectedMethod('razorpay');
            } else {
                setSelectedMethod('stripe');
            }
        }
    }, [isOpen, product]);

    const handleConfirm = () => {
        if (selectedMethod) {
            onSelect(selectedMethod);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        className="bg-[#1c1f2e] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-black/20 p-6 border-b border-white/5 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Zap className="text-blue-500 fill-blue-500" size={20} />
                                    Znyck Pay
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">Secure Payment Gateway</p>
                            </div>
                            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-400 text-sm mb-4">
                                Select a payment method for <span className="text-white font-medium">{product?.name}</span> ({product?.currency} {(product?.price / 100).toFixed(2)})
                            </p>

                            <div className="space-y-3">
                                {/* Razorpay Option */}
                                <div
                                    onClick={() => setSelectedMethod('razorpay')}
                                    className={`relative p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${selectedMethod === 'razorpay'
                                        ? 'bg-blue-600/10 border-blue-500 ring-1 ring-blue-500/50'
                                        : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                                        }`}
                                >
                                    <div className="w-10 h-10 rounded-lg bg-[#0c2444] flex items-center justify-center shrink-0">
                                        <Globe className="text-blue-400" size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-bold text-white">Razorpay</h4>
                                            {product?.currency === 'INR' && <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">RECOMMENDED</span>}
                                        </div>
                                        <p className="text-xs text-gray-500">Local Indian payments only. Netbanking, UPI, Cards.</p>
                                    </div>
                                    {selectedMethod === 'razorpay' && <CheckCircle2 className="text-blue-500" size={20} />}
                                </div>

                                {/* Stripe Option */}
                                <div
                                    onClick={() => setSelectedMethod('stripe')}
                                    className={`relative p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${selectedMethod === 'stripe'
                                        ? 'bg-purple-600/10 border-purple-500 ring-1 ring-purple-500/50'
                                        : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                                        }`}
                                >
                                    <div className="w-10 h-10 rounded-lg bg-[#2e1f5e] flex items-center justify-center shrink-0">
                                        <CreditCard className="text-purple-400" size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-bold text-white">Stripe</h4>
                                            {product?.currency !== 'INR' && <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">RECOMMENDED</span>}
                                        </div>
                                        <p className="text-xs text-gray-500">International cards & global payments.</p>
                                    </div>
                                    {selectedMethod === 'stripe' && <CheckCircle2 className="text-purple-500" size={20} />}
                                </div>
                            </div>

                            <button
                                onClick={handleConfirm}
                                disabled={!selectedMethod}
                                className="w-full mt-8 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Proceed to Pay
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
