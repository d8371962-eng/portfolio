import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const seedDatabase = async () => {
  try {
    const db = await open({
      filename: path.join(process.cwd(), 'portfolio.db'),
      driver: sqlite3.Database
    });

    console.log('🌱 Seeding database...');

    // Seed About Profile
    const existingAbout = await db.get('SELECT * FROM about_profile ORDER BY id DESC LIMIT 1');
    if (!existingAbout) {
      await db.run(
        'INSERT INTO about_profile (profilePicture, summary, phone, email, location) VALUES (?, ?, ?, ?, ?)',
        ['/profile.webp', 
         "Creative Web Developer with foundational expertise in Java and extensive practice in full-stack architecture, API design, and data management using the MERN stack, PHP and Python/Django.",
         '+91 6282 135 504',
         'musammilvilayil@gmail.com',
         'Vilayil puthen veedu Kadappa, Mynagappally P.O, Kollam']
      );
      console.log('✅ About profile seeded');
    } else {
      // Update existing profile with profile picture
      await db.run(
        'UPDATE about_profile SET profilePicture = ? WHERE id = ?',
        ['/profile.webp', existingAbout.id]
      );
      console.log('✅ Profile picture updated');
    }

    // Seed Technical Skills
    const technicalSkills = [
      { name: 'React', category: 'technical', level: 95 },
      { name: 'JavaScript', category: 'technical', level: 92 },
      { name: 'Node.js', category: 'technical', level: 90 },
      { name: 'Python', category: 'technical', level: 88 },
      { name: 'Django', category: 'technical', level: 85 },
      { name: 'MongoDB', category: 'technical', level: 90 },
      { name: 'Express', category: 'technical', level: 88 },
      { name: 'TypeScript', category: 'technical', level: 80 },
      { name: 'Tailwind CSS', category: 'technical', level: 92 },
      { name: 'REST API', category: 'technical', level: 85 }
    ];

    for (const skill of technicalSkills) {
      const existing = await db.get('SELECT * FROM skills WHERE name = ? AND category = ?', [skill.name, skill.category]);
      if (!existing) {
        await db.run('INSERT INTO skills (name, category, level) VALUES (?, ?, ?)', [skill.name, skill.category, skill.level]);
      }
    }
    console.log('✅ Technical skills seeded');

    // Seed Soft Skills
    const softSkills = [
      { name: 'Project Management', category: 'soft', level: 85 },
      { name: 'Teamwork', category: 'soft', level: 90 },
      { name: 'Time Management', category: 'soft', level: 88 },
      { name: 'Problem-solving', category: 'soft', level: 92 },
      { name: 'Communication', category: 'soft', level: 85 },
      { name: 'Adaptability', category: 'soft', level: 80 }
    ];

    for (const skill of softSkills) {
      const existing = await db.get('SELECT * FROM skills WHERE name = ? AND category = ?', [skill.name, skill.category]);
      if (!existing) {
        await db.run('INSERT INTO skills (name, category, level) VALUES (?, ?, ?)', [skill.name, skill.category, skill.level]);
      }
    }
    console.log('✅ Soft skills seeded');

    // Seed Languages
    const languages = ['English', 'Malayalam', 'Hindi', 'Tamil'];
    for (const lang of languages) {
      const existing = await db.get('SELECT * FROM languages WHERE name = ?', [lang]);
      if (!existing) {
        await db.run('INSERT INTO languages (name) VALUES (?)', [lang]);
      }
    }
    console.log('✅ Languages seeded');

    // Seed References
    const references = [
      { name: 'Prof. Salini S', title: 'HOD of BCA Dept', institution: 'Sree Narayana College of Technology', phone: '+919497663664' },
      { name: 'Deepa Rajendran', title: 'Faculty', institution: 'Sree Narayana College of Technology', phone: '+919544871832' }
    ];

    for (const ref of references) {
      const existing = await db.get('SELECT * FROM refs WHERE name = ?', [ref.name]);
      if (!existing) {
        await db.run('INSERT INTO refs (name, title, institution, phone) VALUES (?, ?, ?, ?)', 
          [ref.name, ref.title, ref.institution, ref.phone]);
      }
    }
    console.log('✅ References seeded');

    // Seed Education
    const education = [
      { degree: "Bachelor's Degree in Computer Applications", institution: 'Sree Narayana College of Technology', year: '2023 - 2026', description: 'CGPA: 7.5' },
      { degree: 'Higher Secondary Education', institution: 'Milade Sherif Higher Secondary School', year: '2021 - 2023', description: 'Science Stream' },
      { degree: 'Secondary Education', institution: 'Govt. LVHS', year: '2021', description: '10th Grade' }
    ];

    for (const edu of education) {
      const existing = await db.get('SELECT * FROM education WHERE degree = ?', [edu.degree]);
      if (!existing) {
        await db.run('INSERT INTO education (degree, institution, year, description) VALUES (?, ?, ?, ?)', 
          [edu.degree, edu.institution, edu.year, edu.description]);
      }
    }
    console.log('✅ Education seeded');

    // Seed Experience
    const experiences = [
      { title: 'Freelance Web Developer', company: 'Self-employed', duration: '2023 - Present', description: 'Building web applications for college projects and businesses' }
    ];

    for (const exp of experiences) {
      const existing = await db.get('SELECT * FROM experience WHERE title = ?', [exp.title]);
      if (!existing) {
        await db.run('INSERT INTO experience (title, company, duration, description) VALUES (?, ?, ?, ?)', 
          [exp.title, exp.company, exp.duration, exp.description]);
      }
    }
    console.log('✅ Experience seeded');

    // Seed Projects
    const projects = [
      {
        title: 'Billing System',
        category: 'Web Development',
        description: 'A full-stack billing system with separate frontend and backend. Features include product management, customer management, billing/invoicing, and reporting.',
        tech: ['Node.js', 'Express.js', 'MongoDB', 'HTML', 'CSS', 'JavaScript'],
        image: ''
      },
      {
        title: 'Content Management System (CMS)',
        category: 'Web Development',
        description: 'A comprehensive parcel tracking and management system with customer and admin portals. Supports user management, branch management, parcel tracking, and reporting.',
        tech: ['PHP', 'HTML', 'CSS', 'JavaScript', 'MySQL'],
        image: ''
      },
      {
        title: 'Content Management Platform',
        category: 'Web Development',
        description: 'A role-based content management system with multi-user support including Admin, Creator, Consumer, Distributor, and Monitor roles.',
        tech: ['Node.js', 'Express.js', 'MongoDB', 'JWT'],
        image: ''
      },
      {
        title: 'Emergency Ambulance Hiring Portal',
        category: 'Web Development',
        description: 'A web portal for booking emergency ambulances with real-time tracking, admin dashboard for ambulance management, and comprehensive reporting system.',
        tech: ['PHP', 'HTML', 'CSS', 'Bootstrap', 'JavaScript', 'MySQL'],
        image: ''
      },
      {
        title: 'Employee Management System (EMS)',
        category: 'Web Development',
        description: 'A PHP-based employee management system for admin and employee-level users. Features include employee registration, leave management, salary management, and project assignment.',
        tech: ['PHP', 'HTML', 'CSS', 'MySQL'],
        image: ''
      },
      {
        title: 'Healthiet - Health & Diet Application',
        category: 'Web Development',
        description: 'A comprehensive health and diet management application featuring BMI calculator, calorie calculator, diet plans, workout management, mentor-mentee chat system, and recipe management.',
        tech: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Express.js', 'MongoDB', 'Firebase'],
        image: ''
      },
      {
        title: 'Helping Hand - NGO Platform',
        category: 'Web Development',
        description: 'A web-based platform for NGO management featuring donation management, event management, volunteer management, and news management.',
        tech: ['PHP', 'HTML', 'CSS', 'JavaScript', 'MySQL'],
        image: ''
      },
      {
        title: 'Job Portal',
        category: 'Web Development',
        description: 'A comprehensive job portal with separate portals for Job Seekers, Employers, and Administrators. Features include job posting, application tracking, resume management, and employer verification.',
        tech: ['PHP', 'HTML', 'CSS', 'JavaScript', 'MySQL'],
        image: ''
      },
      {
        title: 'Natural Disaster Management System',
        category: 'Web Development',
        description: 'A Django-based system for tracking and managing natural disasters including earthquakes, tsunamis, tornadoes, and volcanic eruptions with real-time data visualization.',
        tech: ['Python', 'Django', 'HTML', 'CSS', 'JavaScript', 'SQLite'],
        image: ''
      },
      {
        title: 'Office Life - HR Management System',
        category: 'Web Development',
        description: 'A Laravel-based comprehensive HR management system featuring employee management, leave tracking, expense management, project management, and performance analytics.',
        tech: ['PHP', 'Laravel', 'HTML', 'CSS', 'JavaScript', 'MySQL'],
        image: ''
      },
      {
        title: 'Product Listing App',
        category: 'Web Development',
        description: 'A simple and elegant product listing application with category filtering, product cards, and responsive design.',
        tech: ['React.js', 'Node.js', 'Express.js', 'JSON'],
        image: ''
      },
      {
        title: 'Project Center Management',
        category: 'Web Development',
        description: 'A comprehensive project management system for educational centers featuring student group management, milestone tracking, progress reporting, meeting scheduling, certificate generation, and AI-powered assistance.',
        tech: ['Node.js', 'Express.js', 'MongoDB', 'JWT', 'Socket.io'],
        image: ''
      },
      {
        title: 'Portfolio Website',
        category: 'Web Development',
        description: 'A full-stack portfolio website with modern design, contact form functionality, and admin dashboard for content management.',
        tech: ['React', 'Vite', 'Node.js', 'Express.js', 'SQLite'],
        image: ''
      },
      {
        title: 'Reporting System',
        category: 'Desktop Application',
        description: 'A comprehensive billing and reporting software with dashboard, invoice generation, and financial reports.',
        tech: ['PHP', 'HTML', 'CSS', 'JavaScript', 'MySQL'],
        image: ''
      },
      {
        title: 'Expense Tracker',
        category: 'Web Development',
        description: 'A Django-based expense tracking application with user authentication, transaction management, category filtering, and visual reports.',
        tech: ['Python', 'Django', 'HTML', 'CSS', 'JavaScript', 'SQLite'],
        image: ''
      },
      {
        title: 'AI Career Guidance Platform',
        category: 'Web Development',
        description: 'An AI-driven career guidance platform with full usage audit logging, student counseling, institution management, community features, and real-time chat.',
        tech: ['Node.js', 'Express.js', 'MongoDB', 'JWT', 'Socket.io', 'AI Integration'],
        image: ''
      },
      {
        title: 'RDMS - Request & Document Management System',
        category: 'Web Development',
        description: 'A PHP-based system for managing incident reports, incident tracking, team management, and QR code generation for document verification.',
        tech: ['PHP', 'HTML', 'CSS', 'JavaScript', 'MySQL', 'QR Code Library'],
        image: ''
      },
      {
        title: 'Cookit - Recipe Management Application',
        category: 'Web Development',
        description: 'A recipe management application with user authentication, recipe CRUD operations, search functionality, and admin dashboard.',
        tech: ['Node.js', 'Express.js', 'MongoDB', 'HTML', 'CSS', 'JavaScript'],
        image: ''
      },
      {
        title: 'Responsive Billing Software',
        category: 'Web Development',
        description: 'A comprehensive billing software for mobile shops with GST support, product management, customer management, purchase tracking, and detailed reporting.',
        tech: ['PHP', 'HTML', 'CSS', 'JavaScript', 'MySQL'],
        image: ''
      },
      {
        title: 'Smart Billing System',
        category: 'Web Development',
        description: 'A smart billing system with comprehensive features including category management, product management, sales tracking, daily/monthly reports, and user management.',
        tech: ['PHP', 'HTML', 'CSS', 'JavaScript', 'MySQL'],
        image: ''
      },
      {
        title: 'Student Management System',
        category: 'Web Development',
        description: 'A comprehensive student management system with features for attendance tracking, exam management, class management, subject management, and parent notifications.',
        tech: ['PHP', 'HTML', 'CSS', 'JavaScript', 'MySQL'],
        image: ''
      },
      {
        title: 'Healthcare Platform',
        category: 'Web Development',
        description: 'A healthcare monitoring platform with patient management, vital sign tracking, alert system, predictive analytics, proxy AI chat, and comprehensive reporting.',
        tech: ['Node.js', 'Express.js', 'MongoDB', 'React', 'Vite', 'Socket.io'],
        image: ''
      },
      {
        title: 'Weather Application',
        category: 'Web Development',
        description: 'A simple weather application displaying current weather conditions and forecasts.',
        tech: ['HTML', 'CSS', 'JavaScript', 'Weather API'],
        image: ''
      },
      {
        title: 'Secret Coder - Learning Platform',
        category: 'Web Development',
        description: 'An online learning platform with course management, assessment creation, student enrollment, gradebook, and certificate generation.',
        tech: ['PHP', 'HTML', 'CSS', 'JavaScript', 'SQLite'],
        image: ''
      },
      {
        title: 'SheShield - Women\'s Safety Application',
        category: 'Mobile Application',
        description: 'A comprehensive women\'s safety Android application with emergency SOS button, emergency contact management, location sharing, and guardian watch integration.',
        tech: ['Android (Kotlin)', 'Java', 'Firebase', 'Google Maps API'],
        image: ''
      },
      {
        title: 'Employee Management System (Version 2)',
        category: 'Web Development',
        description: 'Another version of the employee management system with enhanced features for employee registration, leave management, and project assignment.',
        tech: ['PHP', 'HTML', 'CSS', 'MySQL'],
        image: ''
      }
    ];

    // Clear existing projects and seed new ones
    await db.run('DELETE FROM projects');
    for (const project of projects) {
      await db.run(
        'INSERT INTO projects (title, category, description, tech, image) VALUES (?, ?, ?, ?, ?)',
        [project.title, project.category, project.description, JSON.stringify(project.tech), project.image]
      );
    }
    console.log('✅ Projects seeded');

    console.log('🎉 Database seeding completed!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
    process.exit(1);
  }
};

seedDatabase();
