import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion, AnimatePresence } from 'framer-motion';

const StripeCheckoutForm = ({ onSuccess, onError }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required',
            confirmParams: {
                return_url: window.location.href,
            },
        });

        if (error) {
            setMessage(error.message);
            onError(error.message);
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            onSuccess(paymentIntent);
        } else {
            setMessage(`Payment Status: ${paymentIntent?.status}`);
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement />
            {message && <div className="text-red-500 text-sm">{message}</div>}
            <button
                disabled={isProcessing || !stripe || !elements}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold disabled:opacity-50 flex justify-center items-center"
            >
                {isProcessing ? <Loader2 className="animate-spin" /> : "Pay Now"}
            </button>
        </form>
    );
};

export default function StripePaymentModal({ isOpen, onClose, config, onSuccess }) {
    // config should have { key, clientSecret }
    const [stripePromise] = useState(() => loadStripe(config.key));

    const options = {
        clientSecret: config.clientSecret,
        appearance: { theme: 'stripe' },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Secure Payment</h3>
                            <p className="text-sm text-gray-500">Powered by Stripe</p>
                        </div>

                        {config.clientSecret && (
                            <Elements stripe={stripePromise} options={options}>
                                <StripeCheckoutForm
                                    onSuccess={(pi) => {
                                        onSuccess(pi);
                                        onClose();
                                    }}
                                    onError={(msg) => console.error(msg)}
                                />
                            </Elements>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
