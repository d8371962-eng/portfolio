import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useInView } from 'framer-motion';
import { 
  Github, Mail, Linkedin, Globe, Code2, Terminal,
  X, Send, Layers, Zap, ArrowRight, Camera,
  Database, Smartphone, Loader2, CheckCircle2,
  Briefcase, MapPin, Cloud, Menu, Star, Rocket, BadgeCheck,
  ExternalLink, Eye, Facebook, MessageCircle, Phone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import About from './About'; // Import the About component

const API_BASE_URL = '/api';

const USER_DATA = {
  name: "Muhammad Musammil A",
  initial: "M",
  role: "Freelance Web Developer",
  heroTitle: "Building Digital Products",
  heroSubtitle: "I create stunning web applications that help students and businesses grow",
  email: "musammilvilayil@gmail.com",
  phone: "+91 6282 135 504",
  location: "Vilayil puthen veedu Kadappa, Mynagappally P.O, Kollam",
  profilePicture: "",
  profileSummary: "Creative Web Developer with foundational expertise in Java and extensive practice in full-stack architecture, API design, and data management using the MERN stack, PHP and Python/Django.",
  socials: {
    github: "https://github.com/musammilvilayil",
    linkedin: "https://www.linkedin.com/in/muhammad-musammil-a-646882280/",
    twitter: "https://twitter.com",
    instagram: "https://www.instagram.com/zzamilh._____/",
    facebook: "https://www.facebook.com/profile.php?id=100092330804407",
    whatsapp: "https://wa.me/6282135504"
  },
  languages: ["English", "Malayalam"],
  softSkills: ["Project Management", "Teamwork", "Time Management", "Problem-solving"],
  mainProject: {
    title: "ProjexifyAI-Powered Multi-Center Project Marketplace",
    description: "AI-Powered Multi-Center Project Marketplace"
  },
  education: [
    {
      degree: "Bachelor's Degree in Computer Applications",
      institution: "Sree Narayana College of Technology",
      year: "2023 - 2026"
    },
    {
      degree: "Higher Secondary Education",
      institution: "Milade Sherif Higher Secondary School",
      location: "Mynagappally, Kollam",
      year: "2021 - 2023"
    },
    {
      degree: "Secondary Education",
      institution: "Govt. LVHS",
      location: "Kadappa, Mynagappally, Kollam",
      year: "2021"
    }
  ],
  references: [
    {
      name: "Prof. Salini S",
      title: "HOD of BCA Dept",
      institution: "Sree Narayana College of Technology",
      phone: "+919497663664"
    },
    {
      name: "Deepa Rajendran",
      title: "Faculty",
      institution: "Sree Narayana College of Technology",
      phone: "+919544871832"
    }
  ]
};

const TECH_STACK = [
  { name: "React", icon: <Code2 />, level: 95, color: "from-blue-500 to-cyan-500" },
  { name: "JavaScript", icon: <Code2 />, level: 92, color: "from-yellow-500 to-orange-500" },
  { name: "Node.js", icon: <Terminal />, level: 90, color: "from-green-500 to-emerald-500" },
  { name: "Python", icon: <Zap />, level: 88, color: "from-purple-500 to-pink-500" },
  { name: "Django", icon: <Layers />, level: 85, color: "from-green-600 to-teal-500" },
  { name: "MongoDB", icon: <Database />, level: 90, color: "from-green-400 to-emerald-600" }
];

const SERVICES = [
  {
    id: 1,
    title: "Web Development",
    description: "Custom websites and web applications built with modern technologies",
    icon: <Code2 />,
    color: "bg-blue-500",
    features: ["Custom Websites", "Web Apps", "E-commerce", "API Development"]
  },
  {
    id: 2,
    title: "College Projects",
    description: "Professional academic projects for MCA, BCA, and engineering students",
    icon: <Briefcase />,
    color: "bg-purple-500",
    features: ["MCA/BCA Projects", "IEEE Papers", "Research Work", "Source Code"]
  },
  {
    id: 3,
    title: "Mobile Apps",
    description: "Cross-platform mobile applications for iOS and Android",
    icon: <Smartphone />,
    color: "bg-pink-500",
    features: ["React Native", "iOS & Android", "App Store", "Push Notifications"]
  },
  {
    id: 4,
    title: "Consulting",
    description: "Expert guidance on technology decisions and implementation",
    icon: <Cloud />,
    color: "bg-emerald-500",
    features: ["Tech Strategy", "Code Review", "Performance", "Cloud Setup"]
  }
];

const FloatingOrb = ({ className, delay = 0, size = "normal" }) => {
  const sizes = {
    small: { width: 200, height: 200 },
    normal: { width: 400, height: 400 },
    large: { width: 600, height: 600 }
  };
  
  return (
    <motion.div
      animate={{ 
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.15, 1],
        rotate: [0, 5, 0],
      }}
      transition={{ 
        duration: 8,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut"
      }}
      className={`absolute rounded-full blur-3xl ${className}`}
      style={{ width: sizes[size].width, height: sizes[size].height }}
    />
  );
};

// Tilt Card Component for mouse-following tilt effect
const TiltCard = ({ children, className = "", perspective = 1000 }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-15, 15]);
  
  const rotateXSpring = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const rotateYSpring = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        transformStyle: "preserve-3d",
        perspective: perspective,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Mouse cursor follower
const CursorFollower = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };
    
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      style={{
        translateX: cursorXSpring,
        translateY: cursorYSpring,
      }}
      className="fixed top-0 left-0 w-8 h-8 border-2 border-lime-400/50 rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
    />
  );
};

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// Floating Animated Orbs
const FloatingOrbs = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    <motion.div
      animate={{ 
        y: [0, -30, 0],
        x: [0, 20, 0],
      }}
      transition={{ 
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute top-10 left-10 w-72 h-72 bg-lime-500/10 rounded-full blur-3xl"
    />
    <motion.div
      animate={{ 
        y: [0, 30, 0],
        x: [0, -20, 0],
      }}
      transition={{ 
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1
      }}
      className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
    />
    <motion.div
      animate={{ 
        y: [0, 20, 0],
      }}
      transition={{ 
        duration: 12,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2
      }}
      className="absolute top-1/2 right-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"
    />
  </div>
);

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 2 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      setDisplayValue(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{displayValue}</span>;
};

const GradientText = ({ children, className = "" }) => (
  <span className={`bg-gradient-to-r from-emerald-400 to-lime-400 bg-clip-text text-transparent ${className}`}>
    {children}
  </span>
);

const FeatureCard = ({ icon, title, description, color, idx }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ 
        duration: 0.6, 
        delay: idx * 0.15,
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      whileHover={{ y: -12, scale: 1.03 }}
      className="group relative p-8 sm:p-9 lg:p-10 bg-gradient-to-br from-slate-800/40 to-slate-900/30 backdrop-blur-lg border border-slate-700/50 rounded-2xl sm:rounded-3xl hover:border-emerald-500/50 transition-all duration-500 overflow-hidden shadow-xl shadow-black/30"
    >
      {/* Animated gradient glow on hover */}
      <div className={`absolute -inset-1 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-2xl`} />
      
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl sm:rounded-3xl`} />
      <div className="relative z-10">
        <motion.div 
          whileHover={{ rotate: 360, scale: 1.12 }}
          transition={{ duration: 0.7, type: "spring" }}
          className={`w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 ${color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 sm:mb-7 lg:mb-8 group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-black/40`}
        >
          {React.cloneElement(icon, { className: "w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-white" })}
        </motion.div>
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4 lg:mb-5 group-hover:text-emerald-300 transition-colors duration-300 tracking-tight">{title}</h3>
        <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed group-hover:text-slate-100 transition-colors duration-300">{description}</p>
        
        {/* Arrow appears on hover */}
        <motion.div 
          initial={{ opacity: 0, x: -15, y: -10 }}
          whileHover={{ opacity: 1, x: 0, y: 0 }}
          className="absolute bottom-8 right-8"
        >
          <ArrowRight className="w-6 h-6 text-emerald-400 group-hover:translate-x-2 transition-transform" />
        </motion.div>
      </div>
    </motion.div>
  );
};

const FeedbackCard = ({ item, idx }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, scale: 0.9 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay: idx * 0.12, type: "spring", stiffness: 100 }}
    viewport={{ once: true }}
    whileHover={{ y: -8, boxShadow: "0 30px 80px rgba(16, 185, 129, 0.25)" }}
    className="group relative p-8 sm:p-9 lg:p-10 bg-gradient-to-br from-slate-800/40 to-slate-900/30 backdrop-blur-lg border border-slate-700/50 hover:border-emerald-500/50 rounded-2xl sm:rounded-3xl transition-all duration-300 overflow-hidden shadow-xl shadow-black/30"
  >
    {/* Hover glow effect */}
    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-lime-500/20 opacity-0 group-hover:opacity-40 transition-opacity duration-500 blur-2xl -z-10" />
    
    <motion.div 
      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 mb-6 sm:mb-7"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <motion.div 
        className="w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 bg-gradient-to-br from-emerald-400 to-lime-400 rounded-full flex items-center justify-center text-slate-900 font-bold text-xl sm:text-2xl lg:text-3xl flex-shrink-0 shadow-xl shadow-emerald-400/40 ring-2 ring-emerald-400/30"
        whileHover={{ scale: 1.15, rotate: 8 }}
      >
        {item.clientName.charAt(0)}
      </motion.div>
      <div className="min-w-0 flex-1">
        <h4 className="text-base sm:text-lg lg:text-xl font-bold text-white truncate">{item.clientName}</h4>
        <p className="text-slate-400 text-xs sm:text-sm lg:text-base truncate">{item.clientRole}{item.clientCompany && ` at ${item.clientCompany}`}</p>
      </div>
    </motion.div>
    
    <motion.div 
      className="flex gap-1.5 mb-5 sm:mb-6 lg:mb-7"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.15 }}
    >
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.35, rotate: 15 }}
          whileTap={{ scale: 0.85 }}
        >
          <Star size={19} className={`sm:w-5 lg:w-6 transition-all ${i < item.rating ? "text-emerald-400 fill-emerald-400" : "text-slate-700"}`} />
        </motion.div>
      ))}
    </motion.div>
    
    <motion.p 
      className="text-slate-300 leading-relaxed text-sm sm:text-base lg:text-lg font-medium italic"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.2 }}
    >
      "{item.feedbackText}"
    </motion.p>
  </motion.div>
);

const SkillBar = ({ tech, idx }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8, y: 40 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ 
        delay: idx * 0.12, 
        duration: 0.6,
        type: "spring",
        stiffness: 110
      }}
      whileHover={{ scale: 1.08, y: -6 }}
      className="group relative flex flex-col items-center justify-center gap-3 sm:gap-3.5 p-7 sm:p-8 lg:p-10 bg-gradient-to-br from-slate-800/40 to-slate-900/30 backdrop-blur-lg border border-slate-700/50 rounded-2xl sm:rounded-3xl text-center hover:border-emerald-500/50 transition-all duration-300 shadow-xl shadow-black/30"
    >
      {/* Glow effect on hover */}
      <div className={`absolute -inset-1 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-25 transition-opacity duration-500 blur-2xl`} />
      
      <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl sm:rounded-3xl`} />
      <div className="relative z-10 flex flex-col items-center w-full">
        <motion.div 
          whileHover={{ rotate: 360, scale: 1.15 }}
          transition={{ duration: 0.8, type: "spring" }}
          className={`p-4 sm:p-5 lg:p-6 bg-gradient-to-br ${tech.color} rounded-xl shadow-xl shadow-black/40 group-hover:shadow-2xl transition-shadow duration-300 mb-2`}
        >
          {React.cloneElement(tech.icon, { className: "w-7 h-7 sm:w-8 sm:h-8 lg:w-11 lg:h-11 text-white" })}
        </motion.div>
        <span className="font-bold text-white text-sm sm:text-base lg:text-xl mt-3 group-hover:text-emerald-300 transition-colors duration-300 tracking-wide">{tech.name}</span>
        <motion.span 
          className="text-emerald-400 font-black text-xl sm:text-2xl lg:text-3xl mt-2 sm:mt-2.5 group-hover:text-lime-300 transition-colors duration-300"
          whileHover={{ scale: 1.25 }}
        >
          {tech.level}%
        </motion.span>
        
        {/* Animated Progress Bar */}
        <div className="w-full mt-4 sm:mt-5 lg:mt-6 bg-slate-700/40 rounded-full h-2.5 sm:h-3 overflow-hidden border border-slate-600/30">
          <motion.div
            className={`h-full bg-gradient-to-r ${tech.color} rounded-full shadow-lg shadow-black/20`}
            initial={{ width: 0 }}
            animate={isInView ? { width: `${tech.level}%` } : { width: 0 }}
            transition={{ delay: idx * 0.15 + 0.4, duration: 0.9, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

const ProjectCard = ({ project, idx }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const y = useMotionValue(0);
  const rotateZ = useTransform(y, [-100, 100], [-2, 2]);
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, scale: 0.93 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ 
        duration: 0.7, 
        delay: idx * 0.15,
        type: "spring",
        stiffness: 90,
        damping: 20
      }}
      whileHover={{ y: -12, scale: 1.02 }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (rect) y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => y.set(0)}
      style={{ rotateZ }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[4/5] rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800/60 hover:border-lime-500/40 transition-all duration-500 shadow-2xl shadow-black/40">
        {/* Animated border glow */}
        <motion.div 
          className="absolute -inset-1 bg-gradient-to-r from-lime-500/30 via-emerald-500/30 to-cyan-500/30 opacity-0 group-hover:opacity-60 transition-opacity duration-500 blur-xl"
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        {project.image ? (
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-115"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
            <Code2 className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 text-zinc-700" />
          </div>
        )}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          whileHover={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        >
          <motion.span 
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.93 }}
            className="px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-lime-400 to-emerald-500 text-black font-bold text-sm sm:text-base rounded-full flex items-center gap-2.5 shadow-2xl shadow-lime-400/40 tracking-wide"
          >
            <Eye size={18} className="sm:w-5 sm:h-5" /> View Project
          </motion.span>
        </motion.div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7 lg:p-9 bg-gradient-to-t from-black via-black/80 to-transparent">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="inline-block px-4 sm:px-5 py-1.5 sm:py-2 bg-lime-500/25 text-lime-300 text-xs sm:text-sm font-bold rounded-full mb-3 sm:mb-4 group-hover:bg-lime-500/40 transition-all duration-300 tracking-wide border border-lime-500/30"
          >
            {project.category}
          </motion.span>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white mb-2 sm:mb-3 group-hover:text-lime-300 transition-colors duration-300 line-clamp-2 leading-tight">{project.title}</h3>
          <p className="text-zinc-300 text-xs sm:text-sm lg:text-base line-clamp-2 group-hover:text-zinc-100 transition-colors duration-300 font-medium">{project.description}</p>
          {project.tech && (
            <motion.div 
              className="flex flex-wrap gap-2 sm:gap-2.5 mt-4 sm:mt-5"
              initial={{ opacity: 0, y: 15 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {(Array.isArray(project.tech) ? project.tech : JSON.parse(project.tech || '[]')).slice(0, 3).map((t, i) => (
                <motion.span
                  key={i} 
                  whileHover={{ scale: 1.12, y: -2 }}
                  className="px-3 sm:px-4 py-1 sm:py-1.5 bg-white/15 text-white text-xs sm:text-sm rounded-lg sm:rounded-xl group-hover:bg-lime-500/30 group-hover:text-lime-200 transition-all duration-300 backdrop-blur-sm font-medium border border-white/10 group-hover:border-lime-500/30"
                >
                  {t}
                </motion.span>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [feedback, setFeedback] = useState([]);
  const [projects, setProjects] = useState([]);
  const [about, setAbout] = useState({
    profilePicture: 'public/profile.webp',
    text: "Creative Web Developer with foundational expertise in Java and extensive practice in full-stack architecture, API design, and data management using the MERN stack, PHP and Python/Django."
  });
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Calculate scroll progress
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? winScroll / height : 0;
      setScrollProgress(scrolled);

      // Detect active section
      const sections = ['home', 'about', 'services', 'projects', 'reviews', 'contact'];
      for (let section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          if (top < window.innerHeight / 2 && bottom > window.innerHeight / 2) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feedbackRes, projectsRes, aboutRes] = await Promise.all([
          fetch(`${API_BASE_URL}/feedback`),
          fetch(`${API_BASE_URL}/projects`),
          fetch(`${API_BASE_URL}/about`)
        ]);
        const feedbackJson = await feedbackRes.json();
        const projectsJson = await projectsRes.json();
        const aboutJson = await aboutRes.json();

        if (feedbackJson.success) setFeedback(feedbackJson.data);
        if (projectsJson.success) setProjects(projectsJson.data);
        if (aboutJson.success) setAbout(aboutJson.data);
      } catch (err) {
        console.log('Using local data');
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setStatus('loading');
    try {
      await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: formData.name, text: `${formData.email}: ${formData.message}`, userId: 'anonymous' }),
      });
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-emerald-500/30">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Roboto:wght@300;400;500;700&display=swap');
        body { font-family: 'Roboto', sans-serif; background-color: #09090b; }
        h1, h2, h3, h4, h5, h6 { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* Background Effects */}
      <FloatingOrbs />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-slate-950/90 backdrop-blur-2xl border-b border-slate-700/40 shadow-2xl shadow-black/40' : 'bg-transparent border-b border-transparent'}`}>
        {/* Scroll Progress Bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-400 via-lime-400 to-emerald-400 rounded-full shadow-lg shadow-emerald-400/50"
          style={{ width: `${scrollProgress * 100}%` }}
          transition={{ ease: "easeOut" }}
        />
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <motion.a 
            href="#home"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-12 h-12 sm:w-13 sm:h-13 flex items-center justify-center">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-lime-400 to-emerald-500 rounded-xl opacity-100 group-hover:opacity-90 transition-opacity shadow-lg shadow-emerald-400/30" />
              {/* Inner dark background */}
              <div className="absolute inset-1 bg-slate-900 rounded-lg" />
              {/* Logo text */}
              <span className="relative font-bold text-xl text-transparent bg-clip-text bg-gradient-to-br from-lime-300 to-emerald-400">{USER_DATA.initial}</span>
            </div>
            
            <div className="hidden sm:flex flex-col">
              <span className="font-bold text-sm tracking-wide text-white">MUSAMMIL</span>
              <span className="text-xs text-emerald-400 font-semibold tracking-wider -mt-0.5">DEV</span>
            </div>
          </motion.a>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-0.5 bg-slate-900/60 backdrop-blur-lg rounded-full px-2 py-2 border border-slate-700/40 shadow-xl shadow-black/30">
            {['Home', 'About', 'Services', 'Projects', 'Reviews', 'Contact'].map((item) => (
              <motion.a 
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`px-6 py-2 text-sm font-semibold rounded-full transition-all duration-300 relative group ${activeSection === item.toLowerCase() ? 'text-white bg-gradient-to-r from-emerald-500/40 to-lime-500/30 shadow-lg shadow-emerald-500/25 border border-emerald-400/50' : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border border-transparent'}`}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {item}
                <motion.span 
                  className="absolute -bottom-1.5 left-6 right-6 h-1 bg-gradient-to-r from-emerald-400 to-lime-400 rounded-full blur-sm"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: activeSection === item.toLowerCase() ? 1 : 0, opacity: activeSection === item.toLowerCase() ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </div>

          {/* Let's Talk Button - Visible on all screen sizes */}
          <motion.a 
            href={USER_DATA.socials.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.15, y: -5, boxShadow: "0 25px 60px rgba(16, 185, 129, 0.6)" }}
            whileTap={{ scale: 0.92 }}
            className="px-6 sm:px-9 py-3 sm:py-3.5 text-sm sm:text-base font-bold bg-gradient-to-r from-emerald-400 to-lime-400 text-slate-950 rounded-full shadow-lg shadow-emerald-400/30 hover:shadow-2xl hover:shadow-emerald-400/60 transition-all duration-300 border border-emerald-300/50 relative overflow-hidden group font-semibold tracking-wide"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-lime-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <span className="relative flex items-center gap-2.5">
              <MessageCircle size={19} className="group-hover:scale-110 transition-transform" />
              <span>Let's Talk</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ArrowRight size={17} />
              </motion.div>
            </span>
          </motion.a>

        </div>
      </nav>


    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative pt-[70px] sm:pt-[80px]"
    >
      {/* Background Effects */}
      <FloatingOrbs />

      {/* Hero Section */}
        <section id="home" className="relative min-h-screen flex items-center pt-20 pb-16 xs:pt-24 sm:pt-28 md:pt-32 lg:pt-32 xs:pb-20 sm:pb-24 md:pb-32 overflow-hidden">
          <div className="w-full px-3 xs:px-4 sm:px-6 md:px-7 lg:px-8 py-8 xs:py-12 sm:py-20 md:py-24 lg:py-32 max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-5xl"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-1.5 xs:gap-2 sm:gap-3 px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 bg-slate-800/50 rounded-full border border-slate-700/50 mb-4 xs:mb-6 sm:mb-8 md:mb-10 backdrop-blur-sm"
              >
                <span className="w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-2.5 sm:h-2.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs sm:text-sm text-slate-300 font-medium">Available for projects</span>
              </motion.div>
              
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight mb-4 xs:mb-5 sm:mb-6 md:mb-8 lg:mb-10 tracking-tight">
                Crafting <GradientText className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl">Digital<br/>Experiences</GradientText><br/>
                That Matter
              </h1>
              
              <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-slate-400 max-w-2xl leading-relaxed mb-6 xs:mb-7 sm:mb-8 md:mb-10 lg:mb-16 font-medium">
                {USER_DATA.heroSubtitle}
              </p>
              
              <div className="flex flex-col xs:flex-row flex-wrap gap-3 xs:gap-4 sm:gap-5 mb-8 xs:mb-10 sm:mb-12 lg:mb-20">
                <motion.a 
                  href="#projects" 
                  whileHover={{ scale: 1.05, boxShadow: "0 30px 60px rgba(16, 185, 129, 0.4)" }}
                  whileTap={{ scale: 0.93 }}
                  className="inline-flex items-center justify-center gap-2 xs:gap-2.5 sm:gap-3 px-6 xs:px-8 sm:px-10 md:px-12 py-3.5 xs:py-4 sm:py-4.5 md:py-5.5 bg-gradient-to-r from-emerald-400 to-lime-400 text-slate-950 font-bold rounded-full hover:shadow-2xl transition-all duration-300 border border-emerald-300/60 shadow-lg shadow-emerald-400/30 text-sm xs:text-base sm:text-base md:text-base tracking-wide touch-target min-h-[44px] xs:min-h-[48px]"
                >
                  View My Work <ArrowRight size={18} className="xs:w-5 xs:h-5 sm:w-5 sm:h-5" />
                </motion.a>
                <motion.a 
                  href="#contact"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(30, 41, 59, 0.9)", borderColor: "rgba(16, 185, 129, 0.6)" }}
                  whileTap={{ scale: 0.93 }}
                  className="inline-flex items-center justify-center gap-2 xs:gap-2.5 sm:gap-3 px-6 xs:px-8 sm:px-10 md:px-12 py-3.5 xs:py-4 sm:py-4.5 md:py-5.5 bg-slate-800/70 border border-slate-700/60 text-white font-bold rounded-full hover:border-emerald-500/40 hover:shadow-lg hover:shadow-slate-900/30 transition-all duration-300 backdrop-blur-sm text-sm xs:text-base sm:text-base md:text-base tracking-wide touch-target min-h-[44px] xs:min-h-[48px]"
                >
                  Start Project
                </motion.a>
              </div>
              
              <div className="flex flex-col xs:flex-row items-start xs:items-center gap-4 xs:gap-6 sm:gap-10 md:gap-12 pt-6 xs:pt-8 sm:pt-10 md:pt-12 border-t border-slate-700/30">
                <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 text-slate-400">
                  <MapPin size={18} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
                  <span className="text-xs xs:text-sm sm:text-base md:text-lg">{USER_DATA.location}</span>
                </div>
                <div className="flex items-center gap-2.5 xs:gap-3 sm:gap-4 md:gap-5 flex-wrap">
                  {Object.entries(USER_DATA.socials).map(([platform, url]) => (
                    <motion.a 
                      key={platform} 
                      href={url}
                      whileHover={{ scale: 1.15, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2.5 xs:p-3 sm:p-3.5 md:p-4 bg-slate-800/50 hover:bg-emerald-500/20 rounded-full text-slate-400 hover:text-emerald-400 transition-all border border-slate-700/30 hover:border-emerald-500/30 touch-target min-w-[40px] min-h-[40px] flex items-center justify-center"
                    >
                      {platform === 'github' && <Github size={18} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6" />}
                      {platform === 'linkedin' && <Linkedin size={18} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6" />}
                      {platform === 'twitter' && <Globe size={18} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6" />}
                      {platform === 'instagram' && <Camera size={18} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6" />}
                      {platform === 'facebook' && <Facebook size={18} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6" />}
                      {platform === 'whatsapp' && <MessageCircle size={18} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6" />}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-12 xs:py-16 sm:py-20 md:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10 xs:mb-12 sm:mb-16 md:mb-20 lg:mb-28 text-center"
            >
              <motion.span 
                className="inline-block text-emerald-400 font-bold tracking-widest uppercase text-xs px-4 xs:px-5 py-2 xs:py-2.5 bg-emerald-400/10 rounded-full border border-emerald-400/30 mb-4 xs:mb-5 sm:mb-6 md:mb-8 text-[10px] xs:text-xs sm:text-xs"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(16, 185, 129, 0.15)" }}
              >
                About Me
              </motion.span>
              <h2 className="text-3xl xs:text-3.5xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mt-4 xs:mt-5 sm:mt-6 md:mt-8 leading-tight tracking-tight">Freelance <GradientText>Web Developer</GradientText></h2>
            </motion.div>

            <About about={about} />

            <div className="grid lg:grid-cols-2 gap-6 xs:gap-8 sm:gap-10 md:gap-16 lg:gap-24 items-center">
              <div className="space-y-6 sm:space-y-8 lg:space-y-10">
                <p className="text-sm xs:text-base sm:text-lg md:text-xl text-zinc-300 leading-relaxed">
                  I'm a passionate <span className="bg-gradient-to-r from-emerald-400 to-lime-400 bg-clip-text text-transparent font-bold">Full-Stack Developer</span> dedicated to creating exceptional digital experiences. With expertise across the MERN stack, Python/Django, and modern cloud technologies, I transform complex ideas into elegant, scalable solutions.
                </p>
                <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
                  Over the past year, I've partnered with college students and forward-thinking businesses to build production-grade applications. My approach combines clean architecture, performance optimization, and intuitive user interfaces—ensuring every project exceeds expectations.
                </p>
                <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
                  Whether you're launching a startup, completing an academic project, or scaling an existing platform, I bring a meticulous attention to detail and a commitment to excellence to every engagement.
                </p>
                <div className="p-4 xs:p-5 sm:p-6 md:p-8 lg:p-10 bg-gradient-to-br from-emerald-500/10 to-lime-500/10 backdrop-blur-sm border border-emerald-500/30 rounded-xl sm:rounded-2xl lg:rounded-3xl">
                  <h4 className="text-base xs:text-lg font-bold text-white mb-3 xs:mb-4 sm:mb-5">What I Specialize In</h4>
                  <ul className="space-y-2 xs:space-y-2.5 sm:space-y-3 md:space-y-4 lg:space-y-5">
                    {['Full-Stack Architecture & API Design', 'MERN Stack & Modern React Patterns', 'Python/Django & Backend Excellence', 'Database Design & Optimization', 'Cloud Solutions & DevOps', 'College Projects & Academic Excellence'].map((item, i) => (
                      <li key={i} className="flex items-center gap-2.5 xs:gap-3 sm:gap-4 text-zinc-200 text-xs xs:text-sm sm:text-base md:text-lg">
                        <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-lime-400 rounded-full flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {TECH_STACK.map((tech, idx) => (
                  <SkillBar key={idx} tech={tech} idx={idx} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Resume/About Section */}
        <section id="resume" className="py-12 xs:py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-b from-transparent via-slate-800/10 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10 xs:mb-12 sm:mb-16 md:mb-20 lg:mb-28 text-center"
            >
              <motion.span 
                className="inline-block text-emerald-400 font-bold tracking-widest uppercase text-xs px-4 xs:px-5 py-2 xs:py-2.5 bg-emerald-400/10 rounded-full border border-emerald-400/30 mb-4 xs:mb-5 sm:mb-6 md:mb-8"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(16, 185, 129, 0.15)" }}
              >
                Detailed Profile
              </motion.span>
              <h2 className="text-3xl xs:text-3.5xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mt-4 xs:mt-5 sm:mt-6 md:mt-8 leading-tight tracking-tight">My <GradientText>Resume</GradientText></h2>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6 xs:gap-8 sm:gap-10 md:gap-12 lg:gap-20">
              {/* Left Column - Profile & Contact */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6 xs:space-y-7 sm:space-y-8 md:space-y-10"
              >
                {/* Profile Picture */}
                {USER_DATA.profilePicture && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="rounded-2xl overflow-hidden border-2 border-lime-500/30 hover:border-lime-500/60 transition-all"
                  >
                    <img src={USER_DATA.profilePicture} alt={USER_DATA.name} className="w-full aspect-square object-cover" />
                  </motion.div>
                )}

                {/* Contact Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="space-y-4 sm:space-y-5 p-6 sm:p-8 bg-gradient-to-br from-zinc-900/80 to-zinc-800/40 border border-zinc-800/50 rounded-2xl"
                >
                  <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider">Contact</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start gap-3 sm:gap-4 text-sm sm:text-base">
                      <Mail size={20} className="text-lime-400 mt-1 flex-shrink-0" />
                      <a href={`mailto:${USER_DATA.email}`} className="text-zinc-300 hover:text-lime-400 transition-colors break-all">
                        {USER_DATA.email}
                      </a>
                    </div>
                    <div className="flex items-start gap-3 sm:gap-4 text-sm sm:text-base">
                      <Phone size={20} className="text-lime-400 mt-1 flex-shrink-0" />
                      <a href={`tel:${USER_DATA.phone.replace(/\s/g, '')}`} className="text-zinc-300 hover:text-lime-400 transition-colors">
                        {USER_DATA.phone}
                      </a>
                    </div>
                    <div className="flex items-start gap-3 sm:gap-4 text-sm sm:text-base">
                      <MapPin size={20} className="text-lime-400 mt-1 flex-shrink-0" />
                      <span className="text-zinc-300">{USER_DATA.location}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Languages Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4 sm:space-y-5 p-6 sm:p-8 bg-gradient-to-br from-zinc-900/80 to-zinc-800/40 border border-zinc-800/50 rounded-2xl"
                >
                  <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider">Languages</h3>
                  <div className="space-y-2 sm:space-y-3">
                    {USER_DATA.languages.map((language, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.25 + idx * 0.05 }}
                        className="flex items-center gap-2 text-sm sm:text-base text-zinc-300"
                      >
                        <div className="w-2 h-2 bg-lime-400 rounded-full"></div>
                        {language}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Soft Skills Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4 sm:space-y-5 p-6 sm:p-8 bg-gradient-to-br from-zinc-900/80 to-zinc-800/40 border border-zinc-800/50 rounded-2xl"
                >
                  <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider">Soft Skills</h3>
                  <div className="space-y-2 sm:space-y-3">
                    {USER_DATA.softSkills.map((skill, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.35 + idx * 0.05 }}
                        className="flex items-center gap-2 text-sm sm:text-base text-zinc-300"
                      >
                        <Star size={16} className="text-emerald-400" />
                        {skill}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* References Section */}
                {USER_DATA.references && USER_DATA.references.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4 sm:space-y-5 p-6 sm:p-8 bg-gradient-to-br from-zinc-900/80 to-zinc-800/40 border border-zinc-800/50 rounded-2xl"
                  >
                    <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider">References</h3>
                    <div className="space-y-4 sm:space-y-5">
                      {USER_DATA.references.map((ref, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.45 + idx * 0.05 }}
                          className="pb-4 border-b border-zinc-700/50 last:border-b-0 last:pb-0"
                        >
                          <p className="font-semibold text-white text-sm sm:text-base">{ref.name}</p>
                          <p className="text-xs sm:text-sm text-lime-400">{ref.title}</p>
                          <p className="text-xs sm:text-sm text-zinc-400 mt-1">{ref.institution}</p>
                          {ref.phone && (
                            <a href={`tel:${ref.phone.replace(/\s/g, '')}`} className="text-xs sm:text-sm text-emerald-400 hover:text-emerald-300 transition-colors mt-2 block">
                              {ref.phone}
                            </a>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Right Column - Education, Skills & Experience */}
              <div className="lg:col-span-2 space-y-8 sm:space-y-10">
                {/* Profile Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="space-y-4 sm:space-y-5"
                >
                  <h3 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">Profile</h3>
                  <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
                    {USER_DATA.profileSummary}
                  </p>
                </motion.div>

                {/* Education Section */}
                {USER_DATA.education && USER_DATA.education.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4 sm:space-y-5"
                  >
                    <h3 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">Education</h3>
                    <div className="space-y-4 sm:space-y-6">
                      {USER_DATA.education.map((edu, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.25 + idx * 0.1 }}
                          className="pl-4 sm:pl-6 border-l-2 border-lime-500/30 hover:border-lime-500/60 transition-all"
                        >
                          <p className="text-xs sm:text-sm text-lime-400 font-semibold uppercase tracking-wider">{edu.year}</p>
                          <p className="text-lg sm:text-xl font-bold text-white mt-1 sm:mt-2">{edu.degree}</p>
                          <p className="text-sm sm:text-base text-zinc-400 mt-1 sm:mt-2">{edu.institution}</p>
                          {edu.location && <p className="text-xs sm:text-sm text-zinc-500 mt-1">{edu.location}</p>}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}


              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-12 xs:py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-b from-slate-800/10 via-transparent to-slate-800/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10 xs:mb-12 sm:mb-16 md:mb-20 lg:mb-28 text-center"
            >
              <motion.span 
                className="inline-block text-emerald-400 font-bold tracking-widest uppercase text-xs px-4 xs:px-5 py-2 xs:py-2.5 bg-emerald-400/10 rounded-full border border-emerald-400/30 mb-4 xs:mb-5 sm:mb-6 md:mb-8"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(16, 185, 129, 0.15)" }}
              >
                What I Do
              </motion.span>
              <h2 className="text-3xl xs:text-3.5xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mt-4 xs:mt-5 sm:mt-6 md:mt-8 leading-tight tracking-tight">My <GradientText>Services</GradientText></h2>
            </motion.div>

            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-5 sm:gap-6 md:gap-8 lg:gap-10">
              {SERVICES.map((service, idx) => (
                <FeatureCard key={service.id} {...service} />
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="py-12 xs:py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-r from-emerald-950/20 via-slate-900 to-lime-950/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 md:gap-8 lg:gap-10"
            >
              {[
                { number: 30, label: 'Projects Completed', suffix: '+' },
                { number: 100, label: 'Clients Satisfied', suffix: '%' },
                { number: 2, label: 'Years of Experience', suffix: '+' }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.12 }}
                  whileHover={{ scale: 1.08, y: -8 }}
                  className="p-6 xs:p-7 sm:p-8 md:p-9 lg:p-11 bg-gradient-to-br from-slate-800/50 to-slate-900/40 backdrop-blur-lg border border-slate-700/50 rounded-xl sm:rounded-2xl lg:rounded-3xl text-center hover:border-emerald-500/50 transition-all duration-300 group shadow-xl shadow-black/30 touch-target"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/10 to-lime-500/10 opacity-0 group-hover:opacity-40 transition-opacity duration-500 blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl" />
                  <div className="text-4xl xs:text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-emerald-400 to-lime-400 bg-clip-text text-transparent mb-3 xs:mb-4 sm:mb-5 md:mb-6 lg:mb-8 group-hover:scale-110 transition-transform tracking-tight">
                    <AnimatedCounter value={stat.number} duration={2} />{stat.suffix}
                  </div>
                  <p className="text-slate-300 text-xs xs:text-sm sm:text-base md:text-base lg:text-lg font-semibold group-hover:text-slate-100 transition-colors tracking-wide">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-12 xs:py-16 sm:py-20 md:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10 xs:mb-12 sm:mb-16 md:mb-20 lg:mb-28 text-center"
            >
              <motion.span 
                className="inline-block text-emerald-400 font-bold tracking-widest uppercase text-xs px-4 xs:px-5 py-2 xs:py-2.5 bg-emerald-400/10 rounded-full border border-emerald-400/30 mb-4 xs:mb-5 sm:mb-6 md:mb-8"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(16, 185, 129, 0.15)" }}
              >
                Portfolio
              </motion.span>
              <h2 className="text-3xl xs:text-3.5xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mt-4 xs:mt-5 sm:mt-6 md:mt-8 leading-tight tracking-tight">Recent <GradientText>Projects</GradientText></h2>
            </motion.div>

            {projects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xs:gap-7 sm:gap-8 md:gap-10 lg:gap-12">
                {projects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 sm:py-32 bg-slate-800/40 rounded-2xl lg:rounded-3xl border border-slate-700/40">
                <Rocket className="w-24 h-24 text-slate-700 mx-auto mb-8" />
                <p className="text-slate-400 text-2xl">Projects coming soon...</p>
              </div>
            )}
          </div>
        </section>

        {/* Reviews Section */}
        <section id="reviews" className="py-12 xs:py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-b from-slate-800/10 via-transparent to-slate-800/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10 xs:mb-12 sm:mb-16 md:mb-20 lg:mb-28 text-center"
            >
              <motion.span 
                className="inline-block text-emerald-400 font-bold tracking-widest uppercase text-xs px-4 xs:px-5 py-2 xs:py-2.5 bg-emerald-400/10 rounded-full border border-emerald-400/30 mb-4 xs:mb-5 sm:mb-6 md:mb-8"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(16, 185, 129, 0.15)" }}
              >
                Testimonials
              </motion.span>
              <h2 className="text-3xl xs:text-3.5xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mt-4 xs:mt-5 sm:mt-6 md:mt-8 leading-tight tracking-tight">Client <GradientText>Reviews</GradientText></h2>
            </motion.div>

            {feedback.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 xs:gap-7 sm:gap-8 md:gap-10 lg:gap-10">
                  {feedback.slice(0, 3).map((item, idx) => (
                    <FeedbackCard key={item._id || idx} item={item} idx={idx} />
                  ))}
                </div>
                <div className="text-center mt-12 sm:mt-16">
                  <Link to="/feedback" className="inline-flex items-center gap-4 px-10 py-6 bg-slate-800/60 border border-slate-700/50 text-white font-semibold rounded-xl hover:border-emerald-500/30 transition-colors">
                    Leave a Review <ArrowRight size={22} />
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-32">
                <p className="text-slate-400 text-2xl">No reviews yet. Be my first client!</p>
                <Link to="/feedback" className="inline-flex items-center gap-4 px-10 py-6 bg-emerald-400 text-slate-900 font-semibold rounded-xl mt-8 hover:bg-emerald-300 transition-colors">
                  Leave a Review
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-12 xs:py-16 sm:py-20 md:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto px-3 xs:px-4 sm:px-6 md:px-7 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10 xs:mb-12 sm:mb-14 md:mb-18 lg:mb-24 text-center"
            >
              <motion.span 
                className="inline-block text-emerald-400 font-bold tracking-widest uppercase text-xs px-4 xs:px-5 py-2 xs:py-2.5 bg-emerald-400/10 rounded-full border border-emerald-400/30 mb-4 xs:mb-5 sm:mb-6 md:mb-8"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(16, 185, 129, 0.15)" }}
              >
                Get In Touch
              </motion.span>
              <h2 className="text-3xl xs:text-3.5xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mt-4 xs:mt-5 sm:mt-6 md:mt-8 leading-tight tracking-tight">Let's Work <GradientText>Together</GradientText></h2>
              <p className="text-sm xs:text-base sm:text-lg md:text-xl text-slate-400 mt-6 xs:mt-7 sm:mt-8 md:mt-10 max-w-2xl mx-auto leading-relaxed font-medium">
                Have a project in mind? I'd love to hear about it. Let's discuss how I can help bring your ideas to life.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-6 xs:p-7 sm:p-8 md:p-10 lg:p-12 bg-gradient-to-br from-slate-800/50 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl shadow-black/30 relative overflow-hidden"
            >
              {/* Decorative background */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10" />
                <form onSubmit={handleSubmit} className="space-y-5 xs:space-y-6 sm:space-y-7 md:space-y-8 lg:space-y-9">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xs:gap-5 sm:gap-5 md:gap-6 lg:gap-8">
                    {[
                      { label: 'Name', type: 'text', field: 'name', placeholder: 'Your name' },
                      { label: 'Email', type: 'email', field: 'email', placeholder: 'your@email.com' }
                    ].map((inputField, idx) => (
                      <motion.div 
                        key={idx}
                        className="space-y-2 xs:space-y-2.5 sm:space-y-2.5 md:space-y-3"
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <label className="text-xs sm:text-xs md:text-sm font-bold text-slate-200 uppercase tracking-widest block">{inputField.label}</label>
                        <motion.input 
                          type={inputField.type}
                          value={formData[inputField.field]}
                          onChange={(e) => setFormData({...formData, [inputField.field]: e.target.value})}
                          placeholder={inputField.placeholder}
                          required
                          whileFocus={{ scale: 1.02, boxShadow: "0 0 20px rgba(16, 185, 129, 0.2)" }}
                          className="w-full px-4 xs:px-5 sm:px-5 md:px-6 py-3 xs:py-3.5 sm:py-3.5 md:py-4 bg-slate-700/50 border border-slate-600/50 hover:border-slate-500/60 rounded-lg sm:rounded-lg md:rounded-xl lg:rounded-2xl text-white text-sm sm:text-sm md:text-base placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all duration-300 backdrop-blur-sm font-medium touch-target min-h-[44px]"
                        />
                      </motion.div>
                    ))}
                  </div>
                  <motion.div 
                    className="space-y-2 xs:space-y-2.5 sm:space-y-2.5 md:space-y-3"
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="text-xs sm:text-xs md:text-sm font-bold text-slate-200 uppercase tracking-widest block">Message</label>
                    <motion.textarea 
                      rows="5" 
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Tell me about your project..."
                      required
                      whileFocus={{ scale: 1.01, boxShadow: "0 0 20px rgba(16, 185, 129, 0.2)" }}
                      className="w-full px-4 xs:px-5 sm:px-5 md:px-6 py-3 xs:py-3.5 sm:py-3.5 md:py-4 bg-slate-700/50 border border-slate-600/50 hover:border-slate-500/60 rounded-lg sm:rounded-lg md:rounded-xl lg:rounded-2xl text-white text-sm sm:text-sm md:text-base placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all duration-300 resize-none backdrop-blur-sm font-medium touch-target"
                    />
                  </motion.div>
                  <motion.button 
                    type="submit" 
                    disabled={status === 'loading' || status === 'success'}
                    whileHover={status !== 'loading' && status !== 'success' ? { scale: 1.03, boxShadow: "0 0 40px rgba(16, 185, 129, 0.4)" } : {}}
                    whileTap={status !== 'loading' && status !== 'success' ? { scale: 0.97 } : {}}
                    className={`w-full py-4 xs:py-4.5 sm:py-5 md:py-5.5 lg:py-6.5 rounded-lg sm:rounded-lg md:rounded-xl lg:rounded-2xl text-sm xs:text-base sm:text-base md:text-lg font-bold flex items-center justify-center gap-2.5 xs:gap-3 sm:gap-3 md:gap-4 transition-all tracking-wide touch-target min-h-[44px] ${
                      status === 'success' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40' : 
                      status === 'error' ? 'bg-red-500 text-white shadow-lg shadow-red-500/40' : 
                      'bg-gradient-to-r from-emerald-400 to-lime-400 text-slate-950 hover:shadow-2xl hover:shadow-emerald-400/50 disabled:opacity-60 shadow-lg shadow-emerald-400/30'
                    }`}
                  >
                    {status === 'loading' ? <Loader2 className="animate-spin" size={22} /> : 
                     status === 'success' ? <><CheckCircle2 size={22} /> <span className="hidden xs:inline">Message Sent!</span></> : 
                     <><Send size={22} /> <span className="hidden xs:inline">Send Message</span></>}
                  </motion.button>
                </form>
            </motion.div>
          </div>
        </section>


      </motion.main>

      <footer className="py-10 xs:py-12 sm:py-14 md:py-16 lg:py-20 border-t border-slate-700/40 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent backdrop-blur-sm px-3 xs:px-4 sm:px-6 md:px-7 lg:px-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col xs:flex-row justify-between items-center gap-4 xs:gap-5 sm:gap-6 md:gap-8 lg:gap-10"
          >
            <motion.div 
              className="text-center xs:text-left"
              whileHover={{ scale: 1.05 }}
            >
              <p className="font-bold text-base xs:text-lg sm:text-xl text-white">{USER_DATA.name}</p>
              <p className="text-xs xs:text-xs sm:text-sm text-slate-400 mt-1 xs:mt-1.5 sm:mt-2 uppercase tracking-wider">© 2026 {USER_DATA.name}. All rights reserved.</p>
            </motion.div>
            <motion.div 
              className="flex gap-2.5 xs:gap-3 sm:gap-4 md:gap-5 flex-wrap justify-center xs:justify-end"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {Object.entries(USER_DATA.socials).map(([platform, url], idx) => (
                <motion.a 
                  key={platform} 
                  href={url} 
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 xs:p-3 sm:p-3.5 md:p-4 bg-slate-800/50 hover:bg-emerald-500/20 rounded-full text-slate-400 hover:text-emerald-400 transition-all border border-slate-700/30 hover:border-emerald-500/30 touch-target min-w-[40px] min-h-[40px] flex items-center justify-center"
                >
                  {platform === 'github' && <Github size={18} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6" />}
                  {platform === 'linkedin' && <Linkedin size={18} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6" />}
                  {platform === 'twitter' && <Globe size={18} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6" />}
                  {platform === 'instagram' && <Camera size={18} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6" />}
                  {platform === 'facebook' && <Facebook size={18} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6" />}
                  {platform === 'whatsapp' && <MessageCircle size={18} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6" />}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
