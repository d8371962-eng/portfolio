import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Award, GraduationCap, Briefcase, Languages, Code2, Users } from 'lucide-react';

const API_BASE_URL = '/api';

const GradientText = ({ children, className = "" }) => (
  <span className={`bg-gradient-to-r from-emerald-400 to-lime-400 bg-clip-text text-transparent ${className}`}>
    {children}
  </span>
);

const About = () => {
  const [aboutData, setAboutData] = useState({
    profilePicture: '',
    summary: '',
    phone: '',
    email: '',
    location: ''
  });
  const [skills, setSkills] = useState({ soft: [], technical: [] });
  const [languages, setLanguages] = useState([]);
  const [references, setReferences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const [aboutRes, skillsRes, langsRes, refsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/about`),
        fetch(`${API_BASE_URL}/skills`),
        fetch(`${API_BASE_URL}/languages`),
        fetch(`${API_BASE_URL}/references`)
      ]);

      const aboutJson = await aboutRes.json();
      const skillsJson = await skillsRes.json();
      const langsJson = await langsRes.json();
      const refsJson = await refsRes.json();

      if (aboutJson.data) {
        setAboutData({
          profilePicture: aboutJson.data.profilePicture || '',
          summary: aboutJson.data.summary || '',
          phone: aboutJson.data.phone || '',
          email: aboutJson.data.email || '',
          location: aboutJson.data.location || ''
        });
      }

      const allSkills = skillsJson.data || [];
      setSkills({
        soft: allSkills.filter(s => s.category === 'soft').map(s => s.name),
        technical: allSkills.filter(s => s.category === 'technical').map(s => s.name)
      });

      setLanguages(langsJson.data ? langsJson.data.map(l => l.name) : []);
      setReferences(refsJson.data || []);
    } catch (err) {
      console.error('Error fetching about data:', err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-pulse text-lime-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white selection:bg-emerald-500/30">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Roboto:wght@300;400;500;700&display=swap');
        body { font-family: 'Roboto', sans-serif; background-color: #09090b; }
        h1, h2, h3, h4, h5, h6 { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; }
      `}</style>

      {/* Header */}
      <div className="relative bg-gradient-to-b from-emerald-500/10 to-slate-950 py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              About <GradientText>Me</GradientText>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Get to know more about me and my professional journey
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left Column - Profile */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-3xl p-8 sticky top-24">
              {/* Profile Picture */}
              <div className="relative mb-8">
                {aboutData.profilePicture ? (
                  <img 
                    src={aboutData.profilePicture} 
                    alt="Profile" 
                    className="w-full aspect-square object-cover rounded-3xl"
                  />
                ) : (
                  <div className="w-full aspect-square bg-zinc-800 rounded-3xl flex items-center justify-center">
                    <Users size={64} className="text-zinc-600" />
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Phone size={20} className="text-lime-400" />
                  Contact
                </h3>
                {aboutData.phone && (
                  <p className="text-zinc-400 flex items-center gap-2">
                    <span className="text-zinc-500">Phone:</span> {aboutData.phone}
                  </p>
                )}
                {aboutData.email && (
                  <p className="text-zinc-400 flex items-center gap-2">
                    <span className="text-zinc-500">Email:</span> {aboutData.email}
                  </p>
                )}
                {aboutData.location && (
                  <p className="text-zinc-400 flex items-center gap-2">
                    <MapPin size={18} className="text-lime-400" />
                    {aboutData.location}
                  </p>
                )}
              </div>

              {/* Languages */}
              {languages.length > 0 && (
                <div className="mt-8 pt-8 border-t border-zinc-800">
                  <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                    <Languages size={20} className="text-lime-400" />
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((lang, idx) => (
                      <span key={idx} className="px-4 py-2 bg-zinc-800 rounded-full text-sm">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Summary */}
            {aboutData.summary && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-zinc-900/50 border border-zinc-800/50 rounded-3xl p-8"
              >
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Users size={24} className="text-lime-400" />
                  Profile
                </h3>
                <p className="text-zinc-300 leading-relaxed text-lg">
                  {aboutData.summary}
                </p>
              </motion.div>
            )}

            {/* Soft Skills */}
            {skills.soft.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-zinc-900/50 border border-zinc-800/50 rounded-3xl p-8"
              >
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Award size={24} className="text-lime-400" />
                  Soft Skills
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {skills.soft.map((skill, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + idx * 0.05 }}
                      className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-xl"
                    >
                      <div className="w-2 h-2 bg-lime-400 rounded-full" />
                      <span className="text-lg">{skill}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* References */}
            {references.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-zinc-900/50 border border-zinc-800/50 rounded-3xl p-8"
              >
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Users size={24} className="text-lime-400" />
                  References
                </h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  {references.map((ref, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + idx * 0.1 }}
                      className="p-6 bg-zinc-800/50 rounded-2xl"
                    >
                      <h4 className="text-lg font-bold text-lime-400">{ref.name}</h4>
                      {ref.title && <p className="text-zinc-400">{ref.title}</p>}
                      {ref.institution && <p className="text-zinc-500 text-sm">{ref.institution}</p>}
                      {ref.phone && <p className="text-zinc-400 text-sm mt-2">{ref.phone}</p>}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
