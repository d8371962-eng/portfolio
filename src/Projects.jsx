import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, useMotionValue, useTransform, useInView } from 'framer-motion';
import { Eye, Code2, Rocket, X, ExternalLink, Search, Heart, Star, TrendingUp, ArrowUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE_URL = '/api';

const SkeletonCard = () => (
  <motion.div
    animate={{ opacity: [0.6, 1, 0.6] }}
    transition={{ duration: 1.5, repeat: Infinity }}
    className="rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/30"
  >
    <div className="aspect-[4/3] w-full bg-slate-700/50" />
    <div className="p-4 sm:p-5 space-y-3">
      <div className="h-4 bg-slate-700/50 rounded w-2/3" />
      <div className="h-3 bg-slate-700/30 rounded w-full" />
      <div className="h-3 bg-slate-700/30 rounded w-4/5" />
      <div className="flex gap-2 pt-2">
        <div className="h-6 bg-slate-700/30 rounded-md w-16" />
        <div className="h-6 bg-slate-700/30 rounded-md w-16" />
      </div>
    </div>
  </motion.div>
);

const ProjectCard = ({ project, idx, onOpen, isFavorite, onToggleFavorite }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const y = useMotionValue(0);
  const rotateZ = useTransform(y, [-100, 100], [-2, 2]);

  const stats = {
    views: project.views || Math.floor(Math.random() * 5000) + 500,
    likes: project.likes || Math.floor(Math.random() * 200) + 20,
    difficulty: project.difficulty || ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)]
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: idx * 0.08, type: 'spring', stiffness: 110 }}
      whileHover={{ y: -12, scale: 1.03 }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (rect) y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => y.set(0)}
      style={{ rotateZ }}
      className="group cursor-pointer h-full"
    >
      <div className="relative rounded-2xl overflow-hidden h-full bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/60 hover:border-emerald-500/60 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/20">
        {/* Image Section */}
        <div className="aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800 relative">
          {project.image ? (
            <img src={project.image} alt={project.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Code2 className="w-16 h-16 text-slate-600" />
            </div>
          )}
          
          {/* Stats Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.15 }}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(project._id || project.id);
              }}
              className={`p-2 rounded-lg backdrop-blur-md transition ${isFavorite ? 'bg-red-500/80' : 'bg-white/20 hover:bg-white/30'}`}
            >
              <Heart size={18} className={isFavorite ? 'fill-white text-white' : 'text-white'} />
            </motion.button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-5 flex flex-col h-[calc(100%-aspect-[4/3])]">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="inline-block px-2.5 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-emerald-500/20 to-lime-500/20 text-emerald-300 border border-emerald-400/40">
              {project.category || 'Project'}
            </span>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
              stats.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-300' :
              stats.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
              'bg-red-500/20 text-red-300'
            }`}>
              {stats.difficulty}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-extrabold text-white leading-tight line-clamp-2 mb-2">{project.title}</h3>
          <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 mb-3 flex-grow">{project.description || project.desc}</p>

          {/* Tech Stack */}
          {project.tech && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {(Array.isArray(project.tech) ? project.tech : JSON.parse(project.tech || '[]')).slice(0, 3).map((t, i) => (
                <span key={i} className="px-2 py-0.5 text-xs bg-white/8 text-slate-200 rounded-md border border-white/10">
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Stats Footer */}
          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-700/50 pt-3">
            <div className="flex gap-3">
              <div className="flex items-center gap-1">
                <Eye size={14} />
                <span>{stats.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart size={14} />
                <span>{stats.likes}</span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => onOpen(project)}
              className="text-emerald-400 hover:text-emerald-300 transition font-semibold flex items-center gap-1"
            >
              View
              <ExternalLink size={12} />
            </motion.button>
          </div>
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

  const stats = {
    views: project.views || Math.floor(Math.random() * 5000) + 500,
    likes: project.likes || Math.floor(Math.random() * 200) + 20,
    difficulty: project.difficulty || ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)]
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} transition={{ duration: 0.3 }} className="relative z-50 max-w-2xl w-full bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
          <X size={20} className="text-white" />
        </button>

        {project.image && (
          <div className="w-full h-48 sm:h-64 overflow-hidden">
            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-6 sm:p-8">
          <div className="mb-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">{project.title}</h2>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-sm rounded-full border border-emerald-400/40">
                {project.category}
              </span>
              <span className={`px-3 py-1 text-sm rounded-full ${
                stats.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-300' :
                stats.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-red-500/20 text-red-300'
              }`}>
                {stats.difficulty}
              </span>
            </div>
          </div>

          <p className="text-slate-300 leading-relaxed mb-6">{project.longDescription || project.description || project.desc}</p>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-white/5 rounded-xl border border-slate-700/50">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-emerald-400">{stats.views.toLocaleString()}</div>
              <div className="text-xs text-slate-400 mt-1">Views</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-red-400">{stats.likes}</div>
              <div className="text-xs text-slate-400 mt-1">Likes</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-yellow-400">{stats.difficulty}</div>
              <div className="text-xs text-slate-400 mt-1">Level</div>
            </div>
          </div>

          {/* Tech Stack */}
          {project.tech && (
            <div className="mb-6">
              <h3 className="font-semibold text-white mb-3">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(project.tech) ? project.tech : JSON.parse(project.tech || '[]')).map((t, i) => (
                  <span key={i} className="px-3 py-1.5 bg-gradient-to-r from-emerald-500/10 to-lime-500/10 text-slate-200 text-sm rounded-lg border border-emerald-400/30">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-400 to-lime-400 text-slate-900 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-400/50 transition">
                <Eye size={18} /> View Live
              </a>
            )}
            {project.repo && (
              <a href={project.repo} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 border border-slate-600 text-white rounded-xl font-semibold hover:bg-slate-700 transition">
                <Code2 size={18} /> View Code
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selected, setSelected] = useState(null);
  const [sortBy, setSortBy] = useState('recent');
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('projectFavorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    localStorage.setItem('projectFavorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    let mounted = true;
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/projects`);
        const json = await res.json();
        if (!mounted) return;
        if (json && json.success) setProjects(json.data);
        else if (Array.isArray(json)) setProjects(json);
      } catch (err) {
        console.warn('Could not fetch projects');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProjects();
    return () => { mounted = false; };
  }, []);

  const categories = useMemo(() => ['All', ...Array.from(new Set(projects.map(p => p.category).filter(Boolean)))], [projects]);

  const filtered = useMemo(() => {
    let result = projects.filter(p => {
      if (activeCategory !== 'All' && p.category !== activeCategory) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (p.title || '').toLowerCase().includes(q) || (p.description || p.desc || '').toLowerCase().includes(q);
    });

    // Sort
    if (sortBy === 'recent') result = result.reverse();
    else if (sortBy === 'popular') result = [...result].sort((a, b) => (b.views || 0) - (a.views || 0));
    else if (sortBy === 'trending') result = [...result].sort((a, b) => (b.likes || 0) - (a.likes || 0));

    return result;
  }, [projects, activeCategory, query, sortBy]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };


  return (
    <>
      {/* Home Navigation Button */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-6 left-6 z-50"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-lime-400 text-slate-900 rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-emerald-400/50 transition"
        >
          ← Home
        </Link>
      </motion.div>

      <main className="min-h-screen pt-12 pb-20 bg-[#09090b] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-emerald-400 to-lime-300 bg-clip-text text-transparent mb-3">Projects</h1>
            <p className="text-slate-400 max-w-2xl">Explore my portfolio of web applications, tools, and experiments. Click any card to view details.</p>
          </motion.div>

          {/* Filters & Search */}
          <div className="mb-10 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search projects..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition"
                />
              </div>

              <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg">
                <ArrowUpDown size={16} className="text-slate-400" />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent text-sm focus:outline-none cursor-pointer">
                  <option value="recent">Recent</option>
                  <option value="popular">Popular</option>
                  <option value="trending">Trending</option>
                </select>
              </motion.div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map(cat => (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition ${
                    activeCategory === cat
                      ? 'bg-gradient-to-r from-emerald-500 to-lime-400 text-slate-900 shadow-lg shadow-emerald-500/40'
                      : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 border border-slate-700/40'
                  }`}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6 text-sm text-slate-400 flex items-center justify-between">
            <span>Showing {paginated.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}–{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} projects</span>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : paginated.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {paginated.map((p, i) => (
                  <ProjectCard
                    key={p._id || p.id || i}
                    project={p}
                    idx={i}
                    onOpen={setSelected}
                    isFavorite={favorites.includes(p._id || p.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="px-4 py-2 rounded-lg bg-slate-800/60 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800"
                  >
                    Prev
                  </motion.button>

                  {[...Array(totalPages)].map((_, i) => (
                    <motion.button
                      key={i + 1}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-lg font-semibold transition ${
                        currentPage === i + 1
                          ? 'bg-gradient-to-r from-emerald-500 to-lime-400 text-slate-900 shadow-lg shadow-emerald-500/40'
                          : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {i + 1}
                    </motion.button>
                  ))}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="px-4 py-2 rounded-lg bg-slate-800/60 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800"
                  >
                    Next
                  </motion.button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-slate-800/40 rounded-2xl border border-slate-700/40">
              <Rocket className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">No projects match your search.</p>
            </div>
          )}
        </div>
      </main>

      {selected && <Modal project={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
