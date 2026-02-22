import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useInView } from 'framer-motion';
import { Eye, Code2, Rocket, X, ExternalLink, Search, Layout, Layers, Terminal, ArrowLeft, ArrowUpRight } from 'lucide-react';

const API_BASE_URL = '/api';

const SkeletonCard = () => (
  <motion.div
    animate={{ opacity: [0.6, 1, 0.6] }}
    transition={{ duration: 1.5, repeat: Infinity }}
    className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800"
  >
    <div className="aspect-video w-full bg-slate-800" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-slate-800 rounded w-2/3" />
      <div className="h-3 bg-slate-800 rounded w-full" />
      <div className="h-3 bg-slate-800 rounded w-4/5" />
      <div className="flex gap-2 pt-2">
        <div className="h-6 bg-slate-800 rounded-md w-16" />
        <div className="h-6 bg-slate-800 rounded-md w-16" />
      </div>
    </div>
  </motion.div>
);

const ProjectCard = ({ project, idx, onOpen }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - left) / width);
    mouseY.set((e.clientY - top) / height);
  };

  const rotateX = useTransform(mouseY, [0, 1], [10, -10]);
  const rotateY = useTransform(mouseX, [0, 1], [-10, 10]);
  const brightness = useTransform(mouseY, [0, 1], [1.2, 0.8]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseX.set(0.5); mouseY.set(0.5); }}
      style={{ rotateX, rotateY, perspective: 1200 }}
      className="group relative h-full cursor-pointer"
      onClick={() => onOpen(project)}
    >
      <div className="relative h-full bg-slate-900/40 backdrop-blur-md border border-white/5 group-hover:border-emerald-500/30 rounded-3xl overflow-hidden transition-all duration-500 flex flex-col shadow-2xl group-hover:shadow-emerald-500/10">
        
        {/* Animated Glow Border */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-[-1px] bg-gradient-to-br from-emerald-500/20 via-transparent to-cyan-500/20 rounded-3xl" />
        </div>

        {/* Visual Header */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-800">
          <motion.div style={{ filter: `brightness(${brightness})` }} className="w-full h-full">
            {project.image ? (
              <img 
                src={project.image} 
                alt={project.title} 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                <Terminal className="w-16 h-16 text-slate-700/50" />
              </div>
            )}
          </motion.div>
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
          
          {/* Project Type Badge */}
          <div className="absolute top-4 left-4">
             <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full bg-white/10 backdrop-blur-md text-white border border-white/10 group-hover:bg-emerald-500 group-hover:text-slate-950 group-hover:border-emerald-400 transition-all duration-300">
                {project.category || 'Module'}
             </span>
          </div>

          {/* Hover Action Indicator */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
            <div className="bg-emerald-500 text-slate-950 p-4 rounded-full shadow-xl">
              <ArrowUpRight size={24} strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col flex-grow relative z-10">
          <h3 className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors mb-2 tracking-tight">
            {project.title}
          </h3>
          
          <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-6 group-hover:text-slate-300 transition-colors">
            {project.description || project.desc}
          </p>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-2 mt-auto">
            {(Array.isArray(project.tech) ? project.tech : JSON.parse(project.tech || '[]')).slice(0, 3).map((t, i) => (
              <span key={i} className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-slate-800/50 text-slate-400 border border-slate-700/50 group-hover:border-emerald-500/20 group-hover:text-emerald-300 transition-all">
                {t}
              </span>
            ))}
            {(Array.isArray(project.tech) ? project.tech : JSON.parse(project.tech || '[]')).length > 3 && (
              <span className="text-[10px] text-slate-600 font-bold self-center ml-1">
                +{(Array.isArray(project.tech) ? project.tech : JSON.parse(project.tech || '[]')).length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Modal = ({ project, onClose }) => {
  if (!project) return null;
  const techStack = Array.isArray(project.tech) ? project.tech : JSON.parse(project.tech || '[]');

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
      >
        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl" onClick={onClose} />
        
        <motion.div 
          initial={{ y: 100, opacity: 0, scale: 0.95 }} 
          animate={{ y: 0, opacity: 1, scale: 1 }} 
          exit={{ y: 100, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl bg-slate-900 border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl overflow-y-auto max-h-[90vh]"
        >
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 z-20 p-3 rounded-full bg-slate-800/80 hover:bg-emerald-500 text-white transition-all border border-white/10 group shadow-lg"
          >
            <X size={20} />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-5 h-72 lg:h-auto overflow-hidden relative bg-slate-800">
              {project.image ? (
                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-900">
                  <Terminal size={64} className="text-slate-700"/>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900 via-transparent to-transparent" />
            </div>

            <div className="lg:col-span-7 p-8 sm:p-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">{project.category || 'Innovation'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{project.difficulty || 'Advanced'}</span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 tracking-tight leading-none">{project.title}</h2>
              <p className="text-slate-300 leading-relaxed mb-10 text-xl font-medium opacity-90">
                {project.longDescription || project.description || project.desc}
              </p>

              <div className="space-y-10">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-5 flex items-center gap-2">
                    <Layers size={14} className="text-emerald-500" /> Technology Stack
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {techStack.map((t, i) => (
                      <span key={i} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 border border-white/5 text-sm font-bold hover:border-emerald-500/50 transition-colors">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95">
                      <Eye size={20} strokeWidth={3} /> Live Preview
                    </a>
                  )}
                  {project.repo && (
                    <a href={project.repo} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-2xl border border-white/10 transition-all active:scale-95">
                      <Code2 size={20} strokeWidth={3} /> View Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/projects`);
        const json = await res.json();
        if (!mounted) return;
        if (json && json.success) {
          setProjects(json.data || []);
        }
      } catch (err) {
        console.warn('API fetch failed.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProjects();
    return () => { mounted = false; };
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(projects.map(p => p.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter(p => {
      const matchesCat = activeCategory === 'All' || p.category === activeCategory;
      const searchStr = `${p.title} ${p.description || p.desc} ${Array.isArray(p.tech) ? p.tech.join(' ') : (p.tech || '')}`.toLowerCase();
      const matchesSearch = searchStr.includes(query.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [projects, activeCategory, query]);

  return (
    <div className="min-h-screen bg-[#020202] text-slate-200 selection:bg-emerald-500 selection:text-slate-900 overflow-x-hidden">
      
      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-8 left-8 z-[50]"
      >
        <a
          href="/"
          className="group flex items-center gap-3 px-5 py-3 bg-slate-900/50 backdrop-blur-2xl border border-white/5 rounded-2xl text-white font-black text-xs uppercase tracking-widest hover:border-emerald-500/50 hover:bg-emerald-500 hover:text-slate-950 transition-all duration-500 shadow-2xl"
        >
          <ArrowLeft size={16} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
          <span>Return Home</span>
        </a>
      </motion.div>

      {/* Decorative Lights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 blur-[150px] rounded-full opacity-50" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-500/10 blur-[150px] rounded-full opacity-50" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        
        {/* Hero Header */}
        <header className="mb-20 lg:mb-28 text-center lg:text-left max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8"
          >
            <Rocket size={14} strokeWidth={3} /> Engineering Showcase
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl sm:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]"
          >
            Digital <br className="hidden sm:block" /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500">Masterpieces.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-xl lg:text-2xl leading-relaxed max-w-2xl font-medium"
          >
            Pushing the boundaries of what's possible on the web through rigorous engineering and visionary design.
          </motion.p>
        </header>

        {/* Enhanced Controls Bar */}
        <div className="sticky top-8 z-40 mb-16 flex flex-col lg:flex-row gap-5 lg:items-center justify-between p-3 lg:p-4 bg-slate-900/30 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-2xl">
          <div className="flex-1 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} strokeWidth={2.5} />
            <input
              type="text"
              placeholder="Search by mission, tech or category..."
              className="w-full pl-16 pr-6 py-4 bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 text-sm font-bold uppercase tracking-wider"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-2 lg:px-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-8 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
                  activeCategory === cat 
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_30px_rgba(16,185,129,0.3)] scale-105' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {loading ? (
            Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : filtered.length > 0 ? (
            filtered.map((project, idx) => (
              <ProjectCard 
                key={project._id || project.id} 
                project={project} 
                idx={idx} 
                onOpen={setSelected}
              />
            ))
          ) : (
            <div className="col-span-full py-40 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl">
                <Search size={40} className="text-slate-700" strokeWidth={3} />
              </div>
              <h3 className="text-3xl font-black text-white mb-3 tracking-tight uppercase">System Error</h3>
              <p className="text-slate-500 text-lg font-bold">No projects found for current parameters.</p>
            </div>
          )}
        </div>

        {/* Minimal Footer */}
        <footer className="mt-40 pt-16 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">
             Est. 2024 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> All Rights Reserved
          </div>
          <div className="flex gap-8">
            {['Github', 'LinkedIn', 'Twitter'].map(link => (
              <a key={link} href="#" className="text-slate-500 hover:text-emerald-400 text-[10px] font-black uppercase tracking-widest transition-colors">
                {link}
              </a>
            ))}
          </div>
        </footer>
      </div>

      <Modal project={selected} onClose={() => setSelected(null)} />

      {/* Global CSS Overrides */}
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 100 900;
          font-display: swap;
          src: url(https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGkyMZhrib2Bg-4.woff2) format('woff2');
        }
        body { font-family: 'Inter', sans-serif; }
      `}} />
    </div>
  );
}