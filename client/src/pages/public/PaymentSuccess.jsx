import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PaymentSuccess() {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(2);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate(-1); // Go back to previous page (product page)
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                </motion.div>

                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Payment Successful!</h1>
                <p className="text-slate-600 dark:text-gray-400 mb-8">
                    Your transaction has been completed successfully.
                </p>

                <div className="flex items-center justify-center space-x-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                    <div className="w-4 h-4 border-2 border-slate-300 dark:border-slate-600 border-t-blue-600 rounded-full animate-spin"></div>
                    <span>Redirecting in {timeLeft} seconds...</span>
                </div>

                <button
                    onClick={() => navigate(-1)}
                    className="mt-8 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold flex items-center justify-center mx-auto space-x-1"
                >
                    <span>Return now</span>
                    <ArrowRight size={16} />
                </button>
            </motion.div>
        </div>
    );
}
