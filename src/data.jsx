import { Layout, Database, Smartphone, Code2 } from 'lucide-react';

export const skillCategories = [
  { title: "Frontend", icon: <Layout size={18} />, skills: ["React.js", "Next.js", "Tailwind CSS", "TypeScript", "Redux"] },
  { title: "Backend", icon: <Database size={18} />, skills: ["Node.js", "Express", "ASP.NET Core", "REST API", "PHP"] },
  { title: "Mobile", icon: <Smartphone size={18} />, skills: ["React Native", "Expo", "App Store Optimization", "Android/iOS"] },
  { title: "Core", icon: <Code2 size={18} />, skills: ["MongoDB", "SQL Server", "Git/GitHub", "Docker", "AWS"] }
];

export const projectCategories = ['All', 'MERN', 'Mobile', 'Security'];

export const projects = [
  {
    id: "01",
    title: "VitalSync",
    tag: "SYSTEM_MONITOR",
    category: "MERN",
    desc: "AI-DRIVEN REMOTE HEALTH MONITORING SYSTEM. REAL-TIME TELEMETRY AND AUTOMATED CLINICAL ALERTS.",
    stack: ["MERN", "AI/ML", "SOCKET.IO"],
    color: "border-emerald-500/30"
  },
  {
    id: "02",
    title: "Aegis DRM",
    tag: "SECURITY_PROTOCOL",
    category: "Security",
    desc: "DIGITAL RIGHTS MANAGEMENT ARCHITECTURE. ENCRYPTED CONTENT DISTRIBUTION AND LICENSE ENFORCEMENT.",
    stack: ["ASP.NET CORE", "SQL SERVER", "AZURE"],
    color: "border-blue-500/30"
  },
  {
    id: "03",
    title: "NexStep AI",
    tag: "MOBILE_LOGIC",
    category: "Mobile",
    desc: "AI-POWERED CAREER PATHWAY ENGINE. PREDICTIVE LOGIC FOR OPTIMAL LEARNING TRAJECTORIES.",
    stack: ["REACT NATIVE", "TENSORFLOW", "FIREBASE"],
    color: "border-purple-500/30"
  },
  {
    id: "04",
    title: "SwiftTask",
    tag: "REALTIME_COLLAB",
    category: "MERN",
    desc: "REAL-TIME COLLABORATION PLATFORM WITH LIVE DOCUMENT EDITING AND INSTANT MESSAGING.",
    stack: ["REACT", "SOCKET.IO", "EXPRESS", "MONGODB"],
    color: "border-amber-500/30"
  }
];
