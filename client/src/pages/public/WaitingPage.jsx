import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Users, Sparkles, ArrowLeft, Bell, Mail } from 'lucide-react';

const WaitingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-slate-900 dark:text-white flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl relative z-10 text-center"
      >
        {/* Logo */}
        <Link to="/" className="inline-block text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-600 mb-8">
          ZNYCK
        </Link>

        {/* Main Content */}
        <div className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl border border-slate-200 dark:border-gray-800 rounded-3xl p-12 shadow-2xl transition-all duration-300">
          
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <Clock className="text-white" size={40} />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold mb-4 text-slate-900 dark:text-white"
          >
            We're Launching Soon!
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-slate-600 dark:text-gray-400 mb-8 leading-relaxed"
          >
            You're in the queue for early access to ZNYCK Pay. 
            <br />
            We're putting the finishing touches on something amazing.
          </motion.p>

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid md:grid-cols-3 gap-6 mb-10"
          >
            <div className="flex flex-col items-center p-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-3">
                <Sparkles className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Seamless Payments</h3>
              <p className="text-sm text-slate-600 dark:text-gray-400 text-center">
                Lightning-fast payment processing with multiple providers
              </p>
            </div>

            <div className="flex flex-col items-center p-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-3">
                <Users className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Developer First</h3>
              <p className="text-sm text-slate-600 dark:text-gray-400 text-center">
                Built by developers, for developers with powerful APIs
              </p>
            </div>

            <div className="flex flex-col items-center p-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-3">
                <Bell className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Real-time Updates</h3>
              <p className="text-sm text-slate-600 dark:text-gray-400 text-center">
                Instant notifications and comprehensive analytics
              </p>
            </div>
          </motion.div>

          {/* Queue Status */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <Users className="text-indigo-600 dark:text-indigo-400" size={20} />
              <span className="font-semibold text-indigo-900 dark:text-indigo-300">Queue Position</span>
            </div>
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
              #1,247
            </div>
            <p className="text-sm text-indigo-700 dark:text-indigo-300">
              You'll be notified when it's your turn
            </p>
          </motion.div>

          {/* Email Notification */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-2 text-slate-600 dark:text-gray-400 mb-8"
          >
            <Mail size={16} />
            <span className="text-sm">We'll email you when access is ready</span>
          </motion.div>

          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </motion.div>
        </div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-sm text-slate-500 dark:text-gray-500 mt-8"
        >
          Questions? Contact us at{' '}
          <a href="mailto:hello@znyck.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            hello@znyck.com
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default WaitingPage;