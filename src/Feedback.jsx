import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Send, Loader2, CheckCircle2, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GradientText = ({ children, className = "" }) => (
  <span className={`bg-gradient-to-r from-emerald-400 to-lime-400 bg-clip-text text-transparent ${className}`}>
    {children}
  </span>
);

const FloatingOrb = ({ className, delay = 0 }) => (
  <motion.div
    animate={{ 
      y: [0, -20, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{ 
      duration: 6,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut"
    }}
    className={`absolute rounded-full blur-3xl ${className}`}
  />
);

// Confetti particle component for success animation
const ConfettiParticle = ({ index }) => {
  const colors = ['#10b981', '#84cc16', '#fbbf24', '#f472b6', '#38bdf8'];
  const randomX = Math.random() * 400 - 200;
  const randomDelay = Math.random() * 0.5;
  const color = colors[index % colors.length];
  
  return (
    <motion.div
      initial={{ opacity: 1, y: 0, scale: 1 }}
      animate={{ 
        opacity: 0,
        y: -200 - Math.random() * 100,
        x: randomX,
        rotate: Math.random() * 360,
        scale: 0
      }}
      transition={{ 
        duration: 1.5 + Math.random() * 0.5, 
        delay: randomDelay,
        ease: "easeOut"
      }}
      className="absolute w-3 h-3 rounded-full"
      style={{ backgroundColor: color, left: '50%', top: '50%' }}
    />
  );
};

export default function Feedback() {
  const [feedbackData, setFeedbackData] = useState({ 
    clientName: '', clientRole: '', clientCompany: '', feedbackText: '', rating: 5, projectTitle: '' 
  });
  const [feedbackStatus, setFeedbackStatus] = useState('idle');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!feedbackData.clientName.trim()) {
      newErrors.clientName = 'Name is required';
    }
    if (!feedbackData.feedbackText.trim()) {
      newErrors.feedbackText = 'Feedback is required';
    }
    if (feedbackData.feedbackText.trim().length < 10) {
      newErrors.feedbackText = 'Feedback must be at least 10 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setFeedbackStatus('loading');
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData),
      });
      setFeedbackStatus('success');
      setFeedbackData({ clientName: '', clientRole: '', clientCompany: '', feedbackText: '', rating: 5, projectTitle: '' });
      setTimeout(() => {
        setFeedbackStatus('idle');
        navigate('/');
      }, 3000);
    } catch (err) {
      setFeedbackStatus('error');
      setTimeout(() => setFeedbackStatus('idle'), 3000);
    }
  };

  // Staggered animation variants for form fields
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white selection:bg-emerald-500/30 flex items-center justify-center">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Roboto:wght@300;400;500;700&display=swap');
        body { font-family: 'Roboto', sans-serif; }
        h1, h2, h3, h4, h5, h6 { font-family: 'Poppins', sans-serif; }
      `}</style>

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <FloatingOrb className="w-[600px] h-[600px] bg-emerald-500/10 -top-40 -left-40" delay={0} />
        <FloatingOrb className="w-[500px] h-[500px] bg-lime-500/10 bottom-0 right-0" delay={2} />
      </div>

      <main className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl mx-auto">
          {/* Page Title */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10 sm:mb-12 lg:mb-16"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-5">
              Leave a <GradientText>Review</GradientText>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
              Had a great experience working with me? Share your feedback!
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 sm:p-8 lg:p-12 bg-slate-800/40 backdrop-blur-sm border border-slate-700/40 rounded-2xl lg:rounded-3xl shadow-lg shadow-black/20"
          >
            <motion.form 
              onSubmit={handleFeedbackSubmit} 
              className="space-y-6 sm:space-y-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Name and Role Row */}
              <motion.div variants={fieldVariants} className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                <div className="space-y-2 sm:space-y-3">
                  <label className="text-sm sm:text-base lg:text-lg font-medium text-slate-200">Your Name *</label>
                  <motion.input 
                    type="text" 
                    value={feedbackData.clientName}
                    onChange={(e) => {
                      setFeedbackData({...feedbackData, clientName: e.target.value});
                      if (errors.clientName) setErrors({...errors, clientName: ''});
                    }}
                    placeholder="Enter your name"
                    required
                    whileFocus={{ scale: 1.01 }}
                    className={`w-full px-4 sm:px-5 lg:px-6 py-3 sm:py-4 lg:py-5 bg-slate-700/40 border rounded-xl sm:rounded-2xl lg:rounded-3xl text-sm sm:text-base lg:text-lg text-white placeholder:text-slate-600 focus:outline-none transition-all hover:border-emerald-500/40 backdrop-blur-sm ${
                      errors.clientName ? 'border-red-500' : 'border-slate-600/40 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20'
                    }`}
                  />
                  {errors.clientName && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-xs sm:text-sm"
                    >
                      {errors.clientName}
                    </motion.p>
                  )}
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <label className="text-sm sm:text-base lg:text-lg font-medium text-slate-200">Your Role</label>
                  <motion.input 
                    type="text" 
                    value={feedbackData.clientRole}
                    onChange={(e) => setFeedbackData({...feedbackData, clientRole: e.target.value})}
                    placeholder="e.g. Student, Client"
                    whileFocus={{ scale: 1.01 }}
                    className="w-full px-4 sm:px-5 lg:px-6 py-3 sm:py-4 lg:py-5 bg-slate-700/40 border border-slate-600/40 rounded-xl sm:rounded-2xl lg:rounded-3xl text-sm sm:text-base lg:text-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all hover:border-slate-500/40 backdrop-blur-sm"
                  />
                </div>
              </motion.div>

              {/* Company Field */}
              <motion.div variants={fieldVariants} className="space-y-2 sm:space-y-3">
                <label className="text-sm sm:text-base lg:text-lg font-medium text-slate-200">Company (Optional)</label>
                <motion.input 
                  type="text" 
                  value={feedbackData.clientCompany}
                  onChange={(e) => setFeedbackData({...feedbackData, clientCompany: e.target.value})}
                  placeholder="Your company name"
                  whileFocus={{ scale: 1.01 }}
                  className="w-full px-4 sm:px-5 lg:px-6 py-3 sm:py-4 lg:py-5 bg-slate-700/40 border border-slate-600/40 rounded-xl sm:rounded-2xl lg:rounded-3xl text-sm sm:text-base lg:text-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all hover:border-slate-500/40 backdrop-blur-sm"
                />
              </motion.div>

              {/* Star Rating */}
              <motion.div variants={fieldVariants} className="space-y-4">
                <label className="text-base sm:text-lg font-medium text-slate-200">Your Rating</label>
                <div className="flex gap-2 sm:gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button 
                      key={star} 
                      type="button" 
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setFeedbackData({...feedbackData, rating: star})}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="focus:outline-none p-1 sm:p-2"
                    >
                      <Star 
                        size={32}
                        className={`w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 transition-all duration-200 ${
                          star <= (hoveredStar || feedbackData.rating) 
                            ? "text-emerald-400 fill-emerald-400 scale-110" 
                            : "text-slate-600 hover:text-slate-400"
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>
                <motion.p 
                  key={hoveredStar || feedbackData.rating}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-slate-400 text-sm"
                >
                  {hoveredStar === 5 || feedbackData.rating === 5 && !hoveredStar ? '⭐⭐⭐⭐⭐ Excellent!' :
                   hoveredStar === 4 || feedbackData.rating === 4 && !hoveredStar ? '⭐⭐⭐⭐ Great!' :
                   hoveredStar === 3 || feedbackData.rating === 3 && !hoveredStar ? '⭐⭐⭐ Good' :
                   hoveredStar === 2 || feedbackData.rating === 2 && !hoveredStar ? '⭐⭐ Fair' :
                   hoveredStar === 1 || feedbackData.rating === 1 && !hoveredStar ? '⭐ Poor' : '⭐ Click to rate'}
                </motion.p>
              </motion.div>

              {/* Feedback Textarea */}
              <motion.div variants={fieldVariants} className="space-y-2 sm:space-y-3">
                <label className="text-sm sm:text-base lg:text-lg font-medium text-slate-200">Your Feedback *</label>
                <motion.textarea 
                  rows="5"
                  value={feedbackData.feedbackText}
                  onChange={(e) => {
                    setFeedbackData({...feedbackData, feedbackText: e.target.value});
                    if (errors.feedbackText) setErrors({...errors, feedbackText: ''});
                  }}
                  placeholder="Share your experience working with me..."
                  required
                  whileFocus={{ scale: 1.01 }}
                  className={`w-full px-4 sm:px-5 lg:px-6 py-3 sm:py-4 lg:py-5 bg-slate-700/40 border rounded-xl sm:rounded-2xl lg:rounded-3xl text-sm sm:text-base lg:text-lg text-white placeholder:text-slate-600 focus:outline-none transition-all resize-none backdrop-blur-sm ${
                    errors.feedbackText ? 'border-red-500' : 'border-slate-600/40 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 hover:border-slate-500/40'
                  }`}
                />
                {errors.feedbackText && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs sm:text-sm"
                  >
                    {errors.feedbackText}
                  </motion.p>
                )}
              </motion.div>

{/* Submit Button */}
              <motion.div variants={fieldVariants}>
                <motion.button 
                  type="submit" 
                  disabled={feedbackStatus === 'loading' || feedbackStatus === 'success'}
                  whileHover={feedbackStatus !== 'loading' && feedbackStatus !== 'success' ? { scale: 1.02, boxShadow: "0 0 30px rgba(16, 185, 129, 0.3)" } : {}}
                  whileTap={feedbackStatus !== 'loading' && feedbackStatus !== 'success' ? { scale: 0.98 } : {}}
                  className={`w-full py-4 sm:py-5 lg:py-6 rounded-xl sm:rounded-2xl lg:rounded-3xl text-base sm:text-lg lg:text-xl font-semibold flex items-center justify-center gap-2 sm:gap-3 transition-all relative overflow-hidden ${
                    feedbackStatus === 'success' ? 'bg-emerald-500 text-white' : 
                    feedbackStatus === 'error' ? 'bg-red-500 text-white' : 
                    'bg-gradient-to-r from-emerald-400 to-lime-400 text-slate-900 hover:shadow-lg hover:shadow-emerald-400/40'
                  }`}
                >
                  {/* Success state with confetti */}
                  <AnimatePresence>
                    {feedbackStatus === 'success' && (
                      <>
                        {[...Array(12)].map((_, i) => (
                          <ConfettiParticle key={i} index={i} />
                        ))}
                      </>
                    )}
                  </AnimatePresence>
                  
                  {feedbackStatus === 'loading' ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : feedbackStatus === 'success' ? (
                    <motion.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                      className="flex items-center gap-2"
                    >
                      <Sparkles className="animate-pulse w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" size={24} />
                      <span className="hidden sm:inline">Thank You!</span>
                      <span className="sm:hidden">Thanks!</span>
                    </motion.div>
                  ) : feedbackStatus === 'error' ? (
                    <span className="text-center">Something went wrong. Try again!</span>
                  ) : (
                    <>
                      <Send size={22} className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span className="hidden sm:inline">Submit Review</span>
                      <span className="sm:hidden">Submit</span>
                    </>
                  )}
                </motion.button>
              </motion.div>
            </motion.form>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
