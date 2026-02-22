import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  X, Home, Image, Folder, Mail, GraduationCap, Briefcase, 
  Plus, Edit2, Trash2, Save, Loader2, LogOut, Check, Star, User
} from 'lucide-react';

const API_BASE_URL = '/api';

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('cover');
  const [loading, setLoading] = useState(false);

  // Data states
  const [coverImage, setCoverImage] = useState('');
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [feedback, setFeedback] = useState([]);

  // Form states
  const [projectForm, setProjectForm] = useState({
    id: '', title: '', category: '', description: '', longDescription: '',
    problem: '', solution: '', tech: '', image: '', contributions: '', liveUrl: '', githubUrl: ''
  });
  const [eduForm, setEduForm] = useState({ degree: '', institution: '', year: '', description: '' });
  const [expForm, setExpForm] = useState({ title: '', company: '', duration: '', description: '' });
  const [resumeForm, setResumeForm] = useState({
    profilePicture: '',
    profileSummary: '',
    phone: '',
    email: '',
    location: '',
    languages: [],
    softSkills: [],
    technicalSkills: [],
    mainProject: { title: '', description: '' },
    references: []
  });
  const [editingId, setEditingId] = useState(null);

  // Check if we're on admin route
  if (!location.pathname.startsWith('/admin')) return null;

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }
    fetchAllData();
  }, [navigate, location.pathname]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [coverRes, projectsRes, messagesRes, eduRes, expRes, feedbackRes, aboutRes, skillsRes, langsRes, refsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/userdata`),
        fetch(`${API_BASE_URL}/projects`),
        fetch(`${API_BASE_URL}/messages`),
        fetch(`${API_BASE_URL}/education`),
        fetch(`${API_BASE_URL}/experience`),
        fetch(`${API_BASE_URL}/feedback/all`),
        fetch(`${API_BASE_URL}/about`),
        fetch(`${API_BASE_URL}/skills`),
        fetch(`${API_BASE_URL}/languages`),
        fetch(`${API_BASE_URL}/references`)
      ]);

      const coverData = await coverRes.json();
      const projectsData = await projectsRes.json();
      const messagesData = await messagesRes.json();
      const eduData = await eduRes.json();
      const expData = await expRes.json();
      const feedbackData = await feedbackRes.json();
      const aboutData = await aboutRes.json();
      const skillsData = await skillsRes.json();
      const langsData = await langsRes.json();
      const refsData = await refsRes.json();

      const coverItem = coverData.data?.find(d => d.key === 'coverImage');
      setCoverImage(coverItem?.value || '');
      setProjects(projectsData.data || []);
      setMessages(messagesData.data || []);
      setEducation(eduData.data || []);
      setExperience(expData.data || []);
      setFeedback(feedbackData.data || []);
      
      if (aboutData.data) {
        setResumeForm(prev => ({
          ...prev,
          profilePicture: aboutData.data.profilePicture || '',
          profileSummary: aboutData.data.summary || '',
          phone: aboutData.data.phone || '',
          email: aboutData.data.email || '',
          location: aboutData.data.location || ''
        }));
      }
      
      const allSkills = skillsData.data || [];
      const softSkills = allSkills.filter(s => s.category === 'soft').map(s => s.name);
      const technicalSkills = allSkills.filter(s => s.category === 'technical').map(s => s.name);
      setResumeForm(prev => ({ ...prev, softSkills, technicalSkills }));
      setResumeForm(prev => ({ ...prev, languages: langsData.data ? langsData.data.map(l => l.name) : [] }));
      setResumeForm(prev => ({ ...prev, references: refsData.data || [] }));
    } catch (err) {
      console.error('Error fetching data:', err);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  const saveCoverImage = async () => {
    try {
      await fetch(`${API_BASE_URL}/userdata`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'coverImage', value: coverImage })
      });
      alert('Cover image saved!');
    } catch (err) {
      alert('Error saving cover image');
    }
  };

  // Save About/Profile data
  const saveAboutProfile = async () => {
    try {
      await fetch(`${API_BASE_URL}/about`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profilePicture: resumeForm.profilePicture,
          summary: resumeForm.profileSummary,
          phone: resumeForm.phone,
          email: resumeForm.email,
          location: resumeForm.location
        })
      });
      alert('Profile saved!');
    } catch (err) {
      alert('Error saving profile');
    }
  };

  // Save Skills
  const saveSkills = async () => {
    try {
      // Delete existing skills first
      const existingSkills = await fetch(`${API_BASE_URL}/skills`).then(r => r.json());
      if (existingSkills.data) {
        for (const skill of existingSkills.data) {
          await fetch(`${API_BASE_URL}/skills/${skill.id}`, { method: 'DELETE' });
        }
      }
      
      // Add soft skills
      for (const skill of resumeForm.softSkills) {
        await fetch(`${API_BASE_URL}/skills`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: skill, category: 'soft', level: 50 })
        });
      }
      
      // Add technical skills
      for (const skill of resumeForm.technicalSkills) {
        await fetch(`${API_BASE_URL}/skills`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: skill, category: 'technical', level: 50 })
        });
      }
      
      alert('Skills saved!');
    } catch (err) {
      alert('Error saving skills');
    }
  };

  // Save Languages
  const saveLanguages = async () => {
    try {
      const existingLangs = await fetch(`${API_BASE_URL}/languages`).then(r => r.json());
      if (existingLangs.data) {
        for (const lang of existingLangs.data) {
          await fetch(`${API_BASE_URL}/languages/${lang.id}`, { method: 'DELETE' });
        }
      }
      
      for (const lang of resumeForm.languages) {
        await fetch(`${API_BASE_URL}/languages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: lang })
        });
      }
      
      alert('Languages saved!');
    } catch (err) {
      alert('Error saving languages');
    }
  };

  // Save all resume data
  const saveResumeData = async () => {
    await saveAboutProfile();
    await saveSkills();
    await saveLanguages();
    fetchAllData();
  };

  // Project CRUD
  const saveProject = async () => {
    const payload = {
      ...projectForm,
      tech: projectForm.tech.split(',').map(t => t.trim()),
      contributions: projectForm.contributions.split(',').map(c => c.trim())
    };
    try {
      if (editingId) {
        await fetch(`${API_BASE_URL}/projects/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch(`${API_BASE_URL}/projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      fetchAllData();
      resetProjectForm();
    } catch (err) {
      alert('Error saving project');
    }
  };

  const deleteProject = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await fetch(`${API_BASE_URL}/projects/${id}`, { method: 'DELETE' });
      fetchAllData();
    } catch (err) {
      alert('Error deleting project');
    }
  };

  const editProject = (project) => {
    setProjectForm({
      ...project,
      tech: project.tech?.join(', ') || '',
      contributions: project.contributions?.join(', ') || ''
    });
    setEditingId(project._id);
  };

  const resetProjectForm = () => {
    setProjectForm({
      id: '', title: '', category: '', description: '', longDescription: '',
      problem: '', solution: '', tech: '', image: '', contributions: '', liveUrl: '', githubUrl: ''
    });
    setEditingId(null);
  };

  // Education CRUD
  const saveEducation = async () => {
    try {
      if (editingId) {
        await fetch(`${API_BASE_URL}/education/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eduForm)
        });
      } else {
        await fetch(`${API_BASE_URL}/education`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eduForm)
        });
      }
      fetchAllData();
      setEduForm({ degree: '', institution: '', year: '', description: '' });
      setEditingId(null);
    } catch (err) {
      alert('Error saving education');
    }
  };

  const deleteEducation = async (id) => {
    if (!confirm('Delete this education?')) return;
    try {
      await fetch(`${API_BASE_URL}/education/${id}`, { method: 'DELETE' });
      fetchAllData();
    } catch (err) {
      alert('Error deleting education');
    }
  };

  // Experience CRUD
  const saveExperience = async () => {
    try {
      if (editingId) {
        await fetch(`${API_BASE_URL}/experience/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expForm)
        });
      } else {
        await fetch(`${API_BASE_URL}/experience`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expForm)
        });
      }
      fetchAllData();
      setExpForm({ title: '', company: '', duration: '', description: '' });
      setEditingId(null);
    } catch (err) {
      alert('Error saving experience');
    }
  };

  const deleteExperience = async (id) => {
    if (!confirm('Delete this experience?')) return;
    try {
      await fetch(`${API_BASE_URL}/experience/${id}`, { method: 'DELETE' });
      fetchAllData();
    } catch (err) {
      alert('Error deleting experience');
    }
  };

  // Messages
  const deleteMessage = async (id) => {
    if (!confirm('Delete this message?')) return;
    try {
      await fetch(`${API_BASE_URL}/messages/${id}`, { method: 'DELETE' });
      fetchAllData();
    } catch (err) {
      alert('Error deleting message');
    }
  };

  // Feedback Management
  const toggleFeedbackApproval = async (id, isApproved) => {
    try {
      await fetch(`${API_BASE_URL}/feedback/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: !isApproved })
      });
      fetchAllData();
    } catch (err) {
      alert('Error updating feedback');
    }
  };

  const deleteFeedback = async (id) => {
    if (!confirm('Delete this feedback?')) return;
    try {
      await fetch(`${API_BASE_URL}/feedback/${id}`, { method: 'DELETE' });
      fetchAllData();
    } catch (err) {
      alert('Error deleting feedback');
    }
  };

  const tabs = [
    { id: 'cover', icon: Image, label: 'Cover Image' },
    { id: 'resume', icon: User, label: 'Resume/About' },
    { id: 'projects', icon: Folder, label: 'Projects' },
    { id: 'messages', icon: Mail, label: 'Messages' },
    { id: 'feedback', icon: Star, label: 'Feedback' },
    { id: 'education', icon: GraduationCap, label: 'Education' },
    { id: 'experience', icon: Briefcase, label: 'Experience' }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="bg-gradient-to-r from-zinc-900 to-zinc-800 border-b border-zinc-800/50 px-6 sm:px-8 lg:px-10 py-5 sm:py-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-black tracking-tighter">Admin Dashboard</h1>
        </div>
        <button onClick={handleLogout} className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-red-500/80 hover:bg-red-600 text-white font-semibold rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base">
          <LogOut size={20} /> Logout
        </button>
      </header>

      <div className="flex min-h-[calc(100vh-80px)]">
        <aside className="w-56 sm:w-64 bg-zinc-900/50 border-r border-zinc-800 min-h-full p-4 sm:p-6 sticky top-20 max-h-[calc(100vh-80px)] overflow-y-auto">
          <nav className="space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 rounded-lg sm:rounded-xl transition-all font-medium text-sm sm:text-base ${activeTab === tab.id ? 'bg-lime-400 text-black font-bold shadow-lg' : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-white'}`}
              >
                <tab.icon size={20} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto max-h-[calc(100vh-80px)]">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="animate-spin text-lime-400" size={48} />
            </div>
          ) : (
            <>
              {activeTab === 'cover' && (
                <div className="space-y-6 sm:space-y-8 max-w-4xl">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Cover Image</h2>
                    <p className="text-sm sm:text-base text-zinc-400">Update your portfolio cover image</p>
                  </div>
                  <div className="space-y-4 sm:space-y-6 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6 sm:p-8">
                    <div className="space-y-2 sm:space-y-3">
                      <label className="block text-sm font-bold text-zinc-300 uppercase tracking-wider">Image URL</label>
                      <input
                        type="text"
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg sm:rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-white text-sm sm:text-base focus:outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 transition-all"
                        placeholder="https://..."
                      />
                    </div>
                    {coverImage && (
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
                        <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <button onClick={saveCoverImage} className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-lime-400 to-emerald-400 text-black font-bold rounded-lg sm:rounded-xl hover:shadow-lg hover:shadow-lime-400/30 transition-all">
                      <Save size={20} /> Save Cover Image
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'resume' && (
                <div className="space-y-6 sm:space-y-8 max-w-4xl">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Resume & About Me</h2>
                    <p className="text-sm sm:text-base text-zinc-400">Manage your profile picture, summary, and professional information</p>
                  </div>

                  {/* Profile Picture Section */}
                  <div className="space-y-4 sm:space-y-6 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6 sm:p-8">
                    <h3 className="text-lg sm:text-xl font-bold text-white">Profile Picture</h3>
                    <div className="space-y-2 sm:space-y-3">
                      <label className="block text-sm font-bold text-zinc-300 uppercase tracking-wider">Image URL</label>
                      <input
                        type="text"
                        value={resumeForm.profilePicture}
                        onChange={(e) => setResumeForm({...resumeForm, profilePicture: e.target.value})}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg sm:rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-white text-sm sm:text-base focus:outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 transition-all"
                        placeholder="https://... (e.g., /profile.jpg)"
                      />
                    </div>
                    {resumeForm.profilePicture && (
                      <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
                        <img src={resumeForm.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  {/* Contact Info Section */}
                  <div className="space-y-4 sm:space-y-6 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6 sm:p-8">
                    <h3 className="text-lg sm:text-xl font-bold text-white">Contact Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-zinc-300 uppercase tracking-wider mb-2">Phone</label>
                        <input
                          type="text"
                          value={resumeForm.phone}
                          onChange={(e) => setResumeForm({...resumeForm, phone: e.target.value})}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg sm:rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-white text-sm sm:text-base focus:outline-none focus:border-lime-400"
                          placeholder="+91 6282 135 504"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-zinc-300 uppercase tracking-wider mb-2">Email</label>
                        <input
                          type="email"
                          value={resumeForm.email}
                          onChange={(e) => setResumeForm({...resumeForm, email: e.target.value})}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg sm:rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-white text-sm sm:text-base focus:outline-none focus:border-lime-400"
                          placeholder="musammilvilayil@gmail.com"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-bold text-zinc-300 uppercase tracking-wider mb-2">Location</label>
                        <input
                          type="text"
                          value={resumeForm.location}
                          onChange={(e) => setResumeForm({...resumeForm, location: e.target.value})}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg sm:rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-white text-sm sm:text-base focus:outline-none focus:border-lime-400"
                          placeholder="Kadappa, Mynagappally P.O, Kollam, Kerala"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Profile Summary Section */}
                  <div className="space-y-4 sm:space-y-6 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6 sm:p-8">
                    <h3 className="text-lg sm:text-xl font-bold text-white">Profile Summary</h3>
                    <textarea
                      value={resumeForm.profileSummary}
                      onChange={(e) => setResumeForm({...resumeForm, profileSummary: e.target.value})}
                      placeholder="Write your professional summary..."
                      rows="5"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg sm:rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-white text-sm sm:text-base focus:outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 transition-all resize-none"
                    />
                  </div>

                  {/* Technical Skills Section */}
                  <div className="space-y-4 sm:space-y-6 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6 sm:p-8">
                    <h3 className="text-lg sm:text-xl font-bold text-white">Technical Skills</h3>
                    <div className="space-y-2 sm:space-y-3">
                      <input
                        type="text"
                        placeholder="Add technical skills (comma-separated: Java, Python/Django, Node.js, MERN Stack, React)"
                        value={resumeForm.technicalSkills.join(', ')}
                        onChange={(e) => setResumeForm({...resumeForm, technicalSkills: e.target.value.split(',').map(s => s.trim())})}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg sm:rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-white text-sm sm:text-base focus:outline-none focus:border-lime-400"
                      />
                    </div>
                  </div>

                  {/* Soft Skills Section */}
                  <div className="space-y-4 sm:space-y-6 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6 sm:p-8">
                    <h3 className="text-lg sm:text-xl font-bold text-white">Soft Skills</h3>
                    <div className="space-y-2 sm:space-y-3">
                      <input
                        type="text"
                        placeholder="Add soft skills (comma-separated: Project Management, Teamwork, Time Management, Problem-solving)"
                        value={resumeForm.softSkills.join(', ')}
                        onChange={(e) => setResumeForm({...resumeForm, softSkills: e.target.value.split(',').map(s => s.trim())})}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg sm:rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-white text-sm sm:text-base focus:outline-none focus:border-lime-400"
                      />
                    </div>
                  </div>

                  {/* Languages Section */}
                  <div className="space-y-4 sm:space-y-6 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6 sm:p-8">
                    <h3 className="text-lg sm:text-xl font-bold text-white">Languages</h3>
                    <div className="space-y-2 sm:space-y-3">
                      <input
                        type="text"
                        placeholder="Add languages (comma-separated: English, Malayalam)"
                        value={resumeForm.languages.join(', ')}
                        onChange={(e) => setResumeForm({...resumeForm, languages: e.target.value.split(',').map(l => l.trim())})}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg sm:rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-white text-sm sm:text-base focus:outline-none focus:border-lime-400"
                      />
                    </div>
                  </div>

                  <button onClick={saveResumeData} className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-lime-400 to-emerald-400 text-black font-bold rounded-lg sm:rounded-xl hover:shadow-lg hover:shadow-lime-400/30 transition-all">
                    <Save size={20} /> Save All Resume Information
                  </button>
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black">Projects</h2>
                    <button onClick={resetProjectForm} className="flex items-center gap-2 px-4 py-2 bg-lime-400 text-black font-bold rounded-xl">
                      <Plus size={18} /> Add Project
                    </button>
                  </div>
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-zinc-400 mb-1">ID (Optional)</label>
                        <input type="text" value={projectForm.id} onChange={(e) => setProjectForm({...projectForm, id: e.target.value})} placeholder="01" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm text-zinc-400 mb-1">Title *</label>
                        <input type="text" value={projectForm.title} onChange={(e) => setProjectForm({...projectForm, title: e.target.value})} placeholder="Project Title" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm text-zinc-400 mb-1">Category *</label>
                        <input type="text" value={projectForm.category} onChange={(e) => setProjectForm({...projectForm, category: e.target.value})} placeholder="e.g. Web Development" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm text-zinc-400 mb-1">Image URL *</label>
                        <input type="text" value={projectForm.image} onChange={(e) => setProjectForm({...projectForm, image: e.target.value})} placeholder="https://..." className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-400 mb-1">Description *</label>
                      <textarea value={projectForm.description} onChange={(e) => setProjectForm({...projectForm, description: e.target.value})} placeholder="Brief description of the project" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 h-20" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-zinc-400 mb-1">Technologies Used</label>
                        <input type="text" value={projectForm.tech} onChange={(e) => setProjectForm({...projectForm, tech: e.target.value})} placeholder="React, Node.js, MongoDB" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm text-zinc-400 mb-1">Your Contributions</label>
                        <input type="text" value={projectForm.contributions} onChange={(e) => setProjectForm({...projectForm, contributions: e.target.value})} placeholder="What you did in this project" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2" />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={saveProject} className="flex items-center gap-2 px-6 py-3 bg-lime-400 text-black font-bold rounded-xl">
                        <Save size={18} /> {editingId ? ' Update' : 'Save'} Project
                      </button>
                      {editingId && <button onClick={resetProjectForm} className="px-6 py-3 bg-zinc-800 rounded-xl">Cancel</button>}
                    </div>
                  </div>
                  <div className="grid gap-4">
                    {projects.map(project => (
                      <div key={project._id} className="flex items-center gap-4 p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl">
                        <img src={project.image} alt={project.title} className="w-20 h-20 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h3 className="font-bold">{project.title}</h3>
                          <p className="text-sm text-zinc-500">{project.category}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => editProject(project)} className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700"><Edit2 size={18} /></button>
                          <button onClick={() => deleteProject(project._id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"><Trash2 size={18} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'messages' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black">Contact Messages</h2>
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <p className="text-zinc-500">No messages yet.</p>
                    ) : (
                      messages.map(msg => (
                        <div key={msg._id} className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold">{msg.sender}</h3>
                              <p className="text-sm text-zinc-400">{msg.text}</p>
                              <p className="text-xs text-zinc-600 mt-2">{new Date(msg.timestamp).toLocaleDateString()}</p>
                            </div>
                            <button onClick={() => deleteMessage(msg._id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"><Trash2 size={18} /></button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'feedback' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black">Client Feedback</h2>
                  <div className="space-y-4">
                    {feedback.length === 0 ? (
                      <p className="text-zinc-500">No feedback submitted yet.</p>
                    ) : (
                      feedback.map(item => {
                        const itemId = item._id || item.id;
                        return (
                          <div key={itemId} className={`p-4 border rounded-xl ${item.isApproved ? 'bg-zinc-900/30 border-zinc-800' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center text-black font-bold">
                                    {item.clientName.charAt(0)}
                                  </div>
                                  <div>
                                    <h3 className="font-bold">{item.clientName}</h3>
                                    <p className="text-xs text-zinc-500">{item.clientRole}{item.clientCompany && ` at ${item.clientCompany}`}</p>
                                  </div>
                                  <div className="flex gap-1 ml-auto">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={`star-${itemId}-${i}`} size={14} className={i < item.rating ? "text-lime-400 fill-lime-400" : "text-zinc-700"} />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-sm text-zinc-400 italic">"{item.feedbackText}"</p>
                                {item.projectTitle && <p className="text-xs text-zinc-600 mt-2">Project: {item.projectTitle}</p>}
                                <p className="text-xs text-zinc-600 mt-2">
                                  Status: {item.isApproved ? <span className="text-green-400">Approved</span> : <span className="text-yellow-400">Pending</span>}
                                </p>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <button 
                                  onClick={() => toggleFeedbackApproval(itemId, item.isApproved)} 
                                  className={`p-2 rounded-lg ${item.isApproved ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`}
                                >
                                  <Check size={18} />
                                </button>
                                <button onClick={() => deleteFeedback(itemId)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30">
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'education' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black">Education</h2>
                    <button onClick={() => setEditingId(null) || setEduForm({ degree: '', institution: '', year: '', description: '' })} className="flex items-center gap-2 px-4 py-2 bg-lime-400 text-black font-bold rounded-xl">
                      <Plus size={18} /> Add Education
                    </button>
                  </div>
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" value={eduForm.degree} onChange={(e) => setEduForm({...eduForm, degree: e.target.value})} placeholder="Degree" className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2" />
                      <input type="text" value={eduForm.institution} onChange={(e) => setEduForm({...eduForm, institution: e.target.value})} placeholder="Institution" className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2" />
                      <input type="text" value={eduForm.year} onChange={(e) => setEduForm({...eduForm, year: e.target.value})} placeholder="Year" className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2" />
                    </div>
                    <button onClick={saveEducation} className="flex items-center gap-2 px-6 py-3 bg-lime-400 text-black font-bold rounded-xl">
                      <Save size={18} /> {editingId ? ' Update' : 'Save'} Education
                    </button>
                  </div>
                  <div className="space-y-4">
                    {education.map(edu => (
                      <div key={edu._id} className="flex items-center gap-4 p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl">
                        <div className="flex-1">
                          <h3 className="font-bold">{edu.degree}</h3>
                          <p className="text-sm text-zinc-500">{edu.institution} - {edu.year}</p>
                        </div>
                        <button onClick={() => { setEduForm(edu); setEditingId(edu._id); }} className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700"><Edit2 size={18} /></button>
                        <button onClick={() => deleteEducation(edu._id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"><Trash2 size={18} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'experience' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black">Experience</h2>
                    <button onClick={() => setEditingId(null) || setExpForm({ title: '', company: '', duration: '', description: '' })} className="flex items-center gap-2 px-4 py-2 bg-lime-400 text-black font-bold rounded-xl">
                      <Plus size={18} /> Add Experience
                    </button>
                  </div>
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" value={expForm.title} onChange={(e) => setExpForm({...expForm, title: e.target.value})} placeholder="Job Title" className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2" />
                      <input type="text" value={expForm.company} onChange={(e) => setExpForm({...expForm, company: e.target.value})} placeholder="Company" className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2" />
                      <input type="text" value={expForm.duration} onChange={(e) => setExpForm({...expForm, duration: e.target.value})} placeholder="Duration" className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2" />
                    </div>
                    <button onClick={saveExperience} className="flex items-center gap-2 px-6 py-3 bg-lime-400 text-black font-bold rounded-xl">
                      <Save size={18} /> {editingId ? ' Update' : 'Save'} Experience
                    </button>
                  </div>
                  <div className="space-y-4">
                    {experience.map(exp => (
                      <div key={exp._id} className="flex items-center gap-4 p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl">
                        <div className="flex-1">
                          <h3 className="font-bold">{exp.title}</h3>
                          <p className="text-sm text-zinc-500">{exp.company} - {exp.duration}</p>
                        </div>
                        <button onClick={() => { setExpForm(exp); setEditingId(exp._id); }} className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700"><Edit2 size={18} /></button>
                        <button onClick={() => deleteExperience(exp._id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"><Trash2 size={18} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
