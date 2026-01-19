import React from 'react';
import { motion } from 'framer-motion';

export default function UserSpace() {
    return (
        <div className="min-h-screen bg-[#0f1117] text-white flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
            >
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">🚀</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-200">User Space</h1>
                <p className="text-gray-500 mt-2">This page is intentionally empty.</p>
            </motion.div>
        </div>
    );
}
