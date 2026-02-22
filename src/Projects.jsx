import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, useMotionValue, useTransform, useInView } from 'framer-motion';
import { Eye, Code2, Rocket, X, ExternalLink, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE_URL = '/api';

const ProjectCard = ({ project, idx, onOpen }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const y = useMotionValue(0);
  const rotateZ = useTransform(y, [-100, 100], [-2, 2]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: idx * 0.06, type: 'spring', stiffness: 110 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (rect) y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => y.set(0)}
      style={{ rotateZ }}
      className="group cursor-pointer"
      onClick={() => onOpen(project)}
    >
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800/60 hover:border-lime-500/40 transition-transform duration-300 shadow-lg">
        <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-900">
          {project.image ? (
            <img src={project.image} alt={project.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-8">
              <Code2 className="w-16 h-16 text-zinc-700" />
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-lime-500/10 text-lime-300 border border-lime-500/20">{project.category}</span>
            <div className="text-slate-400 text-sm font-medium">{project.tag || ''}</div>
          </div>

          <h3 className="mt-3 text-lg sm:text-xl font-extrabold text-white leading-tight line-clamp-2">{project.title}</h3>
          <p className="mt-2 text-sm text-slate-300 line-clamp-2">{project.description || project.desc}</p>

          {project.tech && (
            <div className="mt-3 flex flex-wrap gap-2">
              {(Array.isArray(project.tech) ? project.tech : JSON.parse(project.tech || '[]')).slice(0, 4).map((t, i) => (
                <span key={i} className="px-2 py-0.5 text-xs bg-white/6 text-white rounded-md">{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

function Modal({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!project) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <motion.div initial={{ y: 20, scale: 0.98 }} animate={{ y: 0, scale: 1 }} transition={{ duration: 0.28 }} className="relative z-50 max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="w-2/5 hidden md:block">
            {project.image ? <img src={project.image} alt={project.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-zinc-800 flex items-center justify-center p-8"><Code2 className="w-20 h-20 text-zinc-600" /></div>}
          </div>
          <div className="p-6 w-full">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold">{project.title}</h2>
                <p className="text-sm text-slate-400 mt-1">{project.category} • {project.tag}</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-md bg-white/5 hover:bg-white/8">
                <X />
              </button>
            </div>

            <p className="mt-4 text-slate-300 leading-relaxed">{project.longDescription || project.description || project.desc}</p>

            {project.tech && (
              <div className="mt-5 flex flex-wrap gap-2">
                {(Array.isArray(project.tech) ? project.tech : JSON.parse(project.tech || '[]')).map((t, i) => (
                  <span key={i} className="px-3 py-1 bg-white/6 text-white text-sm rounded-lg">{t}</span>
                ))}
              </div>
            )}

            <div className="mt-6 flex items-center gap-3">
              {project.link && (
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-400 text-slate-900 rounded-md font-semibold">
                  <ExternalLink /> Visit
                </a>
              )}
              {project.repo && (
                <a href={project.repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-md">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303..."/></svg>
                  Source
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/projects`);
        const json = await res.json();
        if (!mounted) return;
        if (json && json.success) setProjects(json.data);
        else if (Array.isArray(json)) setProjects(json);
      } catch (err) {
        console.warn('Could not fetch projects, using fallback from data.jsx if available');
      }
    };
    fetchProjects();
    return () => { mounted = false; };
  }, []);

  const categories = useMemo(() => ['All', ...Array.from(new Set(projects.map(p => p.category).filter(Boolean)))], [projects]);

  const filtered = useMemo(() => {
    return projects.filter(p => {
      if (activeCategory !== 'All' && p.category !== activeCategory) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (p.title || '').toLowerCase().includes(q) || (p.description || p.desc || '').toLowerCase().includes(q) || (p.tag || '').toLowerCase().includes(q);
    });
  }, [projects, activeCategory, query]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-lime-400 rounded-lg" />
              <div className="absolute inset-1 bg-slate-900 rounded" />
              <span className="relative font-bold text-lg text-transparent bg-clip-text bg-gradient-to-br from-lime-300 to-emerald-400">M</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-bold text-sm tracking-wide">MUSAMMIL</span>
              <span className="text-xs text-emerald-400 font-semibold -mt-0.5">DEV</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-2">
            <Link to="/" className="px-4 py-2 text-sm text-slate-300 hover:text-white">Home</Link>
            <Link to="/about" className="px-4 py-2 text-sm text-slate-300 hover:text-white">About</Link>
            <Link to="/projects" className="px-4 py-2 text-sm font-semibold rounded-full bg-emerald-400 text-slate-900">Projects</Link>
            <Link to="/feedback" className="px-4 py-2 text-sm text-slate-300 hover:text-white">Reviews</Link>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <a href="mailto:musammilvilayil@gmail.com" className="px-4 py-2 bg-emerald-400 text-slate-900 rounded-lg font-semibold text-sm">Let's Talk</a>
          </div>
        </div>
      </nav>

      <main className="min-h-screen pt-20 py-16 bg-[#09090b] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold">Recent Projects</h1>
              <p className="text-slate-400 mt-2">Explore selected work — click any card to view details.</p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-3 text-slate-400" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects..." className="pl-10 pr-4 py-2 w-full bg-slate-800/60 border border-slate-700 rounded-lg text-sm focus:outline-none" />
              </div>
            </div>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto py-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold ${activeCategory === cat ? 'bg-emerald-400 text-slate-900' : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <ProjectCard key={p._id || p.id || i} project={p} idx={i} onOpen={setSelected} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-slate-800/40 rounded-2xl border border-slate-700/40">
            <Rocket className="w-20 h-20 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No projects match your search.</p>
          </div>
        )}
      </div>

      {selected && <Modal project={selected} onClose={() => setSelected(null)} />}
    </main>
  );
}
