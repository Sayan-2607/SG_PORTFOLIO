import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Search,
  User,
  Menu,
  X,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Code,
  Award,
  Briefcase,
  Copy,
  Check,
  ChevronRight,
  ArrowDown,
  Sparkles,
  Layers,
  Terminal,
  MousePointer
} from 'lucide-react';

// Register ScrollTrigger with GSAP
gsap.registerPlugin(ScrollTrigger);

// Procedural SVG Spider Web Component
const SpiderWeb = ({ origin = "top-left", className = "", style = {} }) => {
  const rings = 6;
  const radials = 10;
  const paths = [];
  
  let cx, cy;
  if (origin === "top-left") { cx = 0; cy = 0; }
  else if (origin === "top-right") { cx = 300; cy = 0; }
  else { cx = 150; cy = 150; }
  
  // Radial lines
  for (let i = 0; i <= radials; i++) {
    const angle = (i * (Math.PI / 2)) / radials;
    const angleRad = origin === "top-left" 
      ? angle 
      : origin === "top-right" 
        ? Math.PI - angle 
        : (i * 2 * Math.PI) / radials;
    const x2 = cx + Math.cos(angleRad) * 450;
    const y2 = cy + Math.sin(angleRad) * 450;
    paths.push(
      <line 
        key={`radial-${i}`} 
        x1={cx} 
        y1={cy} 
        x2={x2} 
        y2={y2} 
        stroke="currentColor" 
        strokeWidth="0.75" 
        opacity="0.25" 
      />
    );
  }
  
  // Saggy concentric rings
  for (let r = 1; r <= rings; r++) {
    const radius = r * 50;
    let d = "";
    for (let i = 0; i <= radials; i++) {
      const angle = (i * (Math.PI / 2)) / radials;
      const angleRad = origin === "top-left" 
        ? angle 
        : origin === "top-right" 
          ? Math.PI - angle 
          : (i * 2 * Math.PI) / radials;
      
      const x = cx + Math.cos(angleRad) * radius;
      const y = cy + Math.sin(angleRad) * radius;
      
      if (i === 0) {
        d += `M ${x} ${y}`;
      } else {
        const prevAngle = ((i - 1) * (Math.PI / 2)) / radials;
        const prevAngleRad = origin === "top-left" 
          ? prevAngle 
          : origin === "top-right" 
            ? Math.PI - prevAngle 
            : ((i - 1) * 2 * Math.PI) / radials;
        const midAngle = (angleRad + prevAngleRad) / 2;
        const midRadius = radius * 0.93; // Sag factor
        const mx = cx + Math.cos(midAngle) * midRadius;
        const my = cy + Math.sin(midAngle) * midRadius;
        d += ` Q ${mx} ${my}, ${x} ${y}`;
      }
    }
    paths.push(
      <path 
        key={`ring-${r}`} 
        d={d} 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="0.75" 
        opacity="0.3" 
      />
    );
  }
  
  return (
    <svg 
      viewBox="0 0 300 300" 
      className={`w-72 h-72 pointer-events-none select-none ${className}`} 
      style={style}
    >
      {paths}
    </svg>
  );
};

// Interactive Canvas Web component
const InteractiveWebCanvas = ({ color = "rgba(139, 0, 0, 0.12)", hoverColor = "rgba(220, 38, 38, 0.65)", isDark = false }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;
    
    const nodes = [];
    const nodeCount = Math.min(35, Math.floor((width * height) / 30000));
    const mouse = { x: null, y: null, radius: 160 };
    
    class Node {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.radius = Math.random() * 2 + 1;
        this.baseRadius = this.radius;
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
        
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x += (dx / dist) * force * 0.7;
            this.y += (dy / dist) * force * 0.7;
            this.radius = this.baseRadius + force * 1.5;
          } else {
            this.radius = this.baseRadius;
          }
        }
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(239, 68, 68, 0.4)' : color;
        ctx.fill();
      }
    }
    
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new Node());
    }
    
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };
    
    const parentContainer = canvas.closest('.hero-mask-container') || window;
    parentContainer.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);
    
    const drawWeb = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Subtle background grid
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)';
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      
      nodes.forEach(node => {
        node.update();
        node.draw();
      });
      
      ctx.lineWidth = 0.6;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            const opacity = (1 - dist / 120) * 0.15;
            ctx.strokeStyle = isDark ? `rgba(239, 68, 68, ${opacity * 1.5})` : `rgba(139, 0, 0, ${opacity})`;
            ctx.stroke();
          }
        }
        
        if (mouse.x !== null && mouse.y !== null) {
          const dx = nodes[i].x - mouse.x;
          const dy = nodes[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            const opacity = (1 - dist / mouse.radius) * 0.35;
            ctx.strokeStyle = isDark ? `rgba(239, 68, 68, ${opacity * 1.2})` : `rgba(220, 38, 38, ${opacity})`;
            ctx.stroke();
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(drawWeb);
    };
    
    drawWeb();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      parentContainer.removeEventListener('mousemove', handleMouseMove);
      canvas?.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, [color, hoverColor, isDark]);
  
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
};

function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedText, setCopiedText] = useState("");
  
  // Hero reveal mouse-mask coordinates
  const [heroMouse, setHeroMouse] = useState({ x: 0, y: 0, isHovering: false });

  // Refs for GSAP and Navigation
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const experienceRef = useRef(null);
  const projectsRef = useRef(null);
  const achievementsRef = useRef(null);
  const contactRef = useRef(null);

  const leftWebRef = useRef(null);
  const rightWebRef = useRef(null);
  const hangingProfileRef = useRef(null);
  const aboutHeadingRef = useRef(null);
  const aboutParagraphsRef = useRef(null);
  const aboutPillsRef = useRef(null);

  const cvTimelineNodes = useRef([]);
  const projectCardsRef = useRef([]);
  const achievementCardsRef = useRef([]);

  const sectionKeys = ["hero", "about", "experience", "projects", "achievements", "contact"];

  // Data mapping
  const skills = [
    "Python", "C++", "JavaScript", "TypeScript", "React.js", "Next.js", "Node.js", 
    "Express.js", "MongoDB", "MySQL", "Firebase", "OpenCV", "YOLOv5", 
    "DeepSORT", "MediaPipe", "Docker", "Microsoft Azure", "REST APIs"
  ];

  const experiences = [
    {
      role: "Quantum Imaging Research Intern",
      company: "Qmet Tech, IIT Bombay",
      program: "PARIMANA, National Quantum Mission",
      period: "Apr 2026 – May 2026",
      points: [
        "Competitively selected out of a nationwide applicant pool for PARIMANA under India's National Quantum Mission.",
        "Engineered quantum-enhanced image-processing pipelines for autonomous-perception systems, improving feature-extraction robustness by 15% over classical baselines.",
        "Benchmarked vision and image-analysis methods across 3+ research datasets; authored standard workflows adopted by the research team."
      ],
      tag: "Quantum Vision"
    },
    {
      role: "Software Development Engineer Intern",
      company: "National Council of Science Museums (NCSM), Ministry of Culture",
      period: "May 2025 – Jul 2025",
      points: [
        "Designed and shipped a real-time museum analytics platform (YOLOv5, OpenCV, DeepSORT, MediaPipe) processing 8+ live feeds for 1,000+ daily visitors.",
        "Built visitor-tracking, occupancy heatmaps, and anomaly-detection alerts with live operational dashboards, cutting manual monitoring effort by 60%.",
        "Automated smart museum lighting and HVAC systems via occupancy-driven IoT triggers, cutting operational energy costs by 30%."
      ],
      tag: "Computer Vision & IoT"
    },
    {
      role: "Quantum Computing & Full-Stack Lead",
      company: "Kinetex Lab KIIT",
      period: "Sep 2024 – Present",
      points: [
        "Led a 100+ member technology society and spearheaded optimization research.",
        "Organized 10+ hackathons/workshops and improved project delivery efficiency by 15%.",
        "Authored 2 peer-reviewed publications and internal reports."
      ],
      tag: "Leadership & Research"
    }
  ];

  const projects = [
    {
      id: "musealytics",
      title: "Musealytics",
      subtitle: "AI-Powered Museum CCTV Analytics",
      tech: "Python, OpenCV, Flask, Next.js",
      problem: "Museums lacked real-time visibility into visitor density and dwell time across exhibit zones, relying on manual counts.",
      solution: "Built a multi-camera computer vision pipeline achieving 90%+ detection accuracy for crowd density, dwell time, and anomaly tracking. Shipped real-time heatmaps and live Flask + Next.js analytics dashboards. Validated in production at NCSM.",
      link: "https://github.com/Sayan-2607"
    },
    {
      id: "metronav",
      title: "MetroNav",
      subtitle: "Crowd-Intelligence & Smart Ticketing",
      tech: "Python, Next.js, Firebase, OpenCV, ML",
      problem: "Commuters had no visibility into coach-level crowding, causing uneven passenger loading and boarding delays.",
      solution: "Developed an ML-based crowd-prediction model generating bogie-wise heatmaps to forecast coach congestion. Shipped smart ticket booking with coach selection and live train tracking, successfully balancing passenger load.",
      link: "https://github.com/PratyzB15/Metronav"
    },
    {
      id: "narishakti",
      title: "Narishakti",
      subtitle: "Smart & Inclusive Women's Health",
      tech: "React Native, MongoDB, Node.js",
      problem: "Lack of localized, accessible, and offline-first health tracking tools for women in rural and semi-urban areas.",
      solution: "Developed a comprehensive healthcare ecosystem featuring AI symptom checkers, 12-language voice assistance, local community help directories, and emergency SOS alerts. Earned top hackathon wins.",
      link: "https://github.com/Sayan-2607"
    },
    {
      id: "hrerp",
      title: "HR ERP Portal",
      subtitle: "Enterprise HR Management Platform",
      tech: "React.js, Node.js, Express.js, MySQL",
      problem: "Fragmented employee management workflows, manual payroll, and inconsistent attendance logs.",
      solution: "Engineered a secure full-stack HR ERP portal automating employee lifecycle stages, attendance tracking, leave requests, and payroll calculations. Implemented JWT role-based controls and optimized MySQL schema queries.",
      link: "https://github.com/Sayan-2607"
    }
  ];

  const achievements = [
    {
      title: "Winner, Bis-Nexus Hackathon 2025",
      desc: "Won 1st Place out of 200+ competing teams, building a real-world product prototype validated by the Bureau of Indian Standards (BIS)."
    },
    {
      title: "Best Research Paper Awards",
      desc: "Received Best Paper at 2 international conferences, including ICAECT 2025, for research in computer vision and occupancy analytics."
    },
    {
      title: "Top 5,000 / 25,000+ teams",
      desc: "Ranked in the top percentile in the government-led Build with India Hackathon, evaluated on cloud scalability and robustness."
    },
    {
      title: "13+ National Hackathons",
      desc: "Achieved 5+ national first-place wins and 8+ runner-up finishes across state, inter-university, and national engineering challenges."
    },
    {
      title: "100+ LeetCode Solved",
      desc: "Strong algorithmic foundations, solving various data structures, recursion, dynamic programming, and graph problems."
    },
    {
      title: "Microsoft Azure Challenge",
      desc: "Completed the Microsoft Build 2024 Azure & Cloud Skills Challenge, covering cloud-native containerization and security."
    }
  ];

  // Mouse mask movement handler
  const handleHeroMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setHeroMouse({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      isHovering: true
    });
  };

  // Clipboard copy handler
  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(""), 2000);
  };

  // Scroll to section function
  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance timeline
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" }
      });

      // Background webs drop in with elastic easing
      tl.fromTo([leftWebRef.current, rightWebRef.current], 
        { y: -300, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.6, ease: "elastic.out(1, 0.75)" }
      );

      // Hero content slide-in
      tl.from(".hero-slide-el", {
        y: 80,
        opacity: 0,
        stagger: 0.15,
        duration: 1.2,
      }, "-=1.0");

      // Hanging profile drops from ceiling
      if (hangingProfileRef.current) {
        tl.fromTo(hangingProfileRef.current,
          { y: -700, opacity: 0 },
          { y: 0, opacity: 1, duration: 2.2, ease: "elastic.out(0.8, 0.55)" },
          "-=0.8"
        );
      }

      // About text reveals (clip-path and 3D rotation)
      if (aboutHeadingRef.current) {
        tl.fromTo(aboutHeadingRef.current,
          { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)" },
          { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)", duration: 1.2 },
          "-=1.2"
        );
      }

      const paragraphs = aboutParagraphsRef.current?.children;
      if (paragraphs) {
        tl.fromTo(paragraphs,
          { y: 40, opacity: 0, rotationX: -45, transformOrigin: "bottom center" },
          { y: 0, opacity: 1, rotationX: 0, duration: 1.0, stagger: 0.2, ease: "back.out(1.2)" },
          "-=0.8"
        );
      }

      // Tech pills scale stagger
      const pills = aboutPillsRef.current?.children;
      if (pills) {
        tl.fromTo(pills,
          { scale: 0.5, opacity: 0, y: 15 },
          { scale: 1, opacity: 1, y: 0, duration: 0.8, stagger: 0.05, ease: "back.out(1.5)" },
          "-=0.6"
        );
      }

      // 2. Loop Ambient Animations
      // Swing the hanging profile container
      if (hangingProfileRef.current) {
        gsap.to(hangingProfileRef.current, {
          rotation: 2.2,
          transformOrigin: "top center",
          duration: 2.8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1
        });
      }

      // Slow rotating corner webs
      if (leftWebRef.current) {
        gsap.to(leftWebRef.current, {
          rotation: 3,
          duration: 15,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1
        });
      }
      if (rightWebRef.current) {
        gsap.to(rightWebRef.current, {
          rotation: -3,
          duration: 15,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1
        });
      }

      // Floating tech pills
      if (pills) {
        Array.from(pills).forEach((pill, i) => {
          gsap.to(pill, {
            y: -6,
            duration: 1.8 + Math.random() * 0.8,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: i * 0.08
          });
        });
      }

      // 3. ScrollTrigger for Timeline section
      if (cvTimelineNodes.current.length > 0) {
        cvTimelineNodes.current.forEach((node) => {
          if (!node) return;
          gsap.fromTo(node,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 1.0,
              scrollTrigger: {
                trigger: node,
                start: "top 80%",
                toggleActions: "play none none none"
              }
            }
          );
        });
      }

      // ScrollTrigger for Project Cards
      if (projectCardsRef.current.length > 0) {
        projectCardsRef.current.forEach((card) => {
          if (!card) return;
          gsap.fromTo(card,
            { opacity: 0, scale: 0.93, y: 40 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 1.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none"
              }
            }
          );
        });
      }

      // ScrollTrigger for Achievement Accolades
      if (achievementCardsRef.current.length > 0) {
        gsap.fromTo(achievementCardsRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            scrollTrigger: {
              trigger: achievementCardsRef.current[0],
              start: "top 90%",
              toggleActions: "play none none none"
            }
          }
        );
      }

      // Breathing glow for hanging avatar image outline
      gsap.to(".hanging-profile-border", {
        boxShadow: "0 0 25px rgba(220, 38, 38, 0.4)",
        borderColor: "rgba(220, 38, 38, 0.8)",
        duration: 2.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });

    });

    return () => ctx.revert();
  }, []);

  // Search logic across the resume data
  const searchResults = [];
  if (searchQuery.trim().length > 0) {
    const query = searchQuery.toLowerCase();
    
    // Search skills
    skills.forEach(skill => {
      if (skill.toLowerCase().includes(query)) {
        searchResults.push({ type: "skill", title: skill, section: "about", detail: "Technology Stack" });
      }
    });

    // Search experience
    experiences.forEach(exp => {
      if (exp.role.toLowerCase().includes(query) || exp.company.toLowerCase().includes(query) || exp.program?.toLowerCase().includes(query) || exp.points.some(p => p.toLowerCase().includes(query))) {
        searchResults.push({ type: "experience", title: exp.role, section: "experience", detail: exp.company });
      }
    });

    // Search projects
    projects.forEach(p => {
      if (p.title.toLowerCase().includes(query) || p.subtitle.toLowerCase().includes(query) || p.tech.toLowerCase().includes(query) || p.solution.toLowerCase().includes(query)) {
        searchResults.push({ type: "project", title: p.title, section: "projects", detail: p.subtitle });
      }
    });

    // Search achievements
    achievements.forEach(a => {
      if (a.title.toLowerCase().includes(query) || a.desc.toLowerCase().includes(query)) {
        searchResults.push({ type: "achievement", title: a.title, section: "achievements", detail: a.desc });
      }
    });
  }

  return (
    <div className="relative bg-bg-light text-text-dark font-sans selection:bg-accent-red selection:text-white min-h-screen">
      
      {/* BACKGROUND DECORATIVE GRIDS & WEBS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-40" />
        
        {/* Suspended Corner Webs (Stays fixed / rotates) */}
        <div ref={leftWebRef} className="absolute -top-12 -left-12 text-black/10 origin-top-left z-1">
          <SpiderWeb origin="top-left" />
          <div className="w-[1px] h-36 bg-black/15 absolute top-0 left-0" />
        </div>
        
        <div ref={rightWebRef} className="absolute -top-12 -right-12 text-black/10 origin-top-right z-1">
          <SpiderWeb origin="top-right" />
          <div className="w-[1px] h-36 bg-black/15 absolute top-0 right-0" />
        </div>
      </div>

      {/* HEADER / NAVIGATION */}
      <header className="sticky top-0 z-40 glass-panel border-b border-black/5 px-4 sm:px-8 py-3.5 flex justify-between items-center transition-all duration-300">
        <div 
          onClick={() => scrollToSection("hero")}
          className="text-lg md:text-xl font-syne font-extrabold tracking-widest text-text-dark hover:text-accent-bright transition-colors cursor-pointer flex items-center gap-2"
        >
          <span>SAYAN</span>
          <span className="font-light text-text-muted">GHOSH</span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent-bright animate-pulse hidden md:inline-block" />
        </div>

        {/* Links */}
        <nav className="hidden lg:flex items-center gap-8 font-syne text-xs uppercase font-bold tracking-widest text-text-muted">
          {sectionKeys.map((key) => (
            <button
              key={key}
              onClick={() => scrollToSection(key)}
              className="hover:text-accent-bright hover:scale-105 active:scale-95 transition-all py-1.5 relative group"
            >
              {key}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent-bright transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </nav>

        {/* Right Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-black/5 bg-white/40 hover:bg-white text-xs font-semibold tracking-wider transition-all hover:scale-105"
            title="Search resume"
          >
            <Search size={14} className="text-text-muted" />
            <span className="hidden sm:inline">Search</span>
          </button>

          <button
            onClick={() => setProfileOpen(true)}
            className="w-9 h-9 rounded-full bg-black text-white hover:bg-accent-bright hover:scale-105 transition-all flex items-center justify-center shadow-md cursor-pointer"
            title="Profile details"
          >
            <User size={15} />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-full border border-black/5 bg-white/40 flex items-center justify-center text-text-dark z-50 hover:bg-white transition-colors"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {mobileMenuOpen && (
          <div className="absolute top-[65px] left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg border-b border-black/5 p-4 flex flex-col gap-2.5 z-30 font-syne text-xs uppercase tracking-wider font-bold text-text-dark">
            {sectionKeys.map((key) => (
              <button
                key={key}
                onClick={() => scrollToSection(key)}
                className="w-full text-left py-3 px-4 rounded-xl hover:bg-black/5 hover:text-accent-bright transition-all"
              >
                {key}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* HERO SECTION: Interactive Mouse Mask Reveal */}
      <section 
        id="hero" 
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={() => setHeroMouse(prev => ({ ...prev, isHovering: false }))}
        className="hero-mask-container relative h-[calc(100vh-65px)] flex flex-col justify-center items-center px-6 md:px-16 overflow-hidden z-10"
      >
        <InteractiveWebCanvas />

        {/* Light Mode Layer (Visible by default) */}
        <div className="max-w-6xl w-full text-center flex flex-col items-center justify-center z-10 pointer-events-auto">
          <div className="hero-slide-el inline-flex items-center gap-2 border border-black/10 bg-white/80 rounded-full py-1.5 px-4 mb-6 shadow-sm">
            <Sparkles size={12} className="text-accent-bright animate-pulse" />
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-text-muted">AI/ML & Computer Vision SDE</span>
          </div>

          <h1 className="hero-slide-el text-6xl sm:text-7xl md:text-9xl font-syne font-extrabold tracking-tighter leading-none text-text-dark mb-4 select-none">
            SAYAN GHOSH
          </h1>

          <p className="hero-slide-el text-sm md:text-lg text-text-muted max-w-2xl font-serif italic tracking-wide leading-relaxed mb-10">
            Selected for PARIMANA under IIT Bombay & National Quantum Mission. Shipped real-time production analytics systems for the Ministry of Culture.
          </p>

          <div className="hero-slide-el flex flex-wrap items-center justify-center gap-4">
            <button 
              onClick={() => scrollToSection("about")}
              className="bg-black hover:bg-accent-bright text-white font-syne text-xs uppercase font-extrabold tracking-widest px-8 py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              Explore Portfolio
              <ArrowDown size={14} />
            </button>
            <button 
              onClick={() => scrollToSection("contact")}
              className="bg-white hover:bg-neutral-50 text-text-dark border border-black/10 font-syne text-xs uppercase font-extrabold tracking-widest px-8 py-4 rounded-full transition-all duration-300 shadow-sm hover:scale-105 active:scale-95"
            >
              Get In Touch
            </button>
          </div>
        </div>

        {/* Hero Interactive Mouse-Mask Layer (Reveals a dark, glowing red spider-web realm) */}
        <div 
          className="hero-mask-overlay absolute inset-0 bg-neutral-950 flex flex-col justify-center items-center px-6 md:px-16 overflow-hidden z-20 pointer-events-none select-none transition-opacity duration-300"
          style={{
            clipPath: heroMouse.isHovering 
              ? `circle(170px at ${heroMouse.x}px ${heroMouse.y}px)` 
              : 'circle(0px at 0px 0px)',
            opacity: heroMouse.isHovering ? 1 : 0
          }}
        >
          <InteractiveWebCanvas isDark={true} />
          
          <div className="max-w-6xl w-full text-center flex flex-col items-center justify-center z-10">
            <div className="inline-flex items-center gap-2 border border-red-500/30 bg-red-500/10 rounded-full py-1.5 px-4 mb-6">
              <Terminal size={12} className="text-red-500 animate-pulse" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-red-400">CONNECTING THE NODES...</span>
            </div>

            <h1 className="text-6xl sm:text-7xl md:text-9xl font-syne font-extrabold tracking-tighter leading-none text-red-600 mb-4">
              SAYAN GHOSH
            </h1>

            <p className="text-sm md:text-lg text-red-200 max-w-2xl font-serif italic tracking-wide leading-relaxed mb-10">
              Developing autonomous intelligence and low-latency computer vision pipelines.
            </p>
          </div>
        </div>

        <div className="absolute bottom-6 flex flex-col items-center justify-center gap-1.5 opacity-50 z-10 select-none">
          <MousePointer size={14} className="animate-bounce" />
          <span className="text-[9px] uppercase tracking-widest font-bold">Move cursor to reveal the network</span>
        </div>
      </section>

      {/* ABOUT / SUSPENDED AVATAR SECTION */}
      <section 
        id="about" 
        ref={aboutRef}
        className="relative min-h-screen py-20 px-6 md:px-16 border-t border-black/5 bg-neutral-50 overflow-hidden flex items-center"
      >
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Heading and 3D Paragraphs */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4 text-accent-bright font-syne text-[10px] md:text-xs font-bold uppercase tracking-widest">
              <span>🕷️</span>
              <span>ABOUT ME</span>
            </div>
            
            <h2 
              ref={aboutHeadingRef}
              className="text-4xl md:text-6xl font-syne font-extrabold tracking-tight leading-none mb-8 uppercase text-text-dark select-none clip-text italic"
            >
              REVEALING <span className="text-accent-bright font-light serif">PATTERNS</span> IN COMPLEX SYSTEMS.
            </h2>
            
            <div ref={aboutParagraphsRef} className="space-y-6 text-text-muted leading-relaxed font-serif text-base md:text-lg max-w-2xl mb-10 perspective-1000">
              <p className="transform origin-bottom">
                I am a Computer Science & Engineering undergraduate at the Kalinga Institute of Industrial Technology, currently maintaining a **CGPA of 8.28 / 10**. My focus lies at the intersection of Artificial Intelligence, Computer Vision, and Full-Stack Engineering.
              </p>
              <p className="transform origin-bottom">
                From selected quantum imaging research at **IIT Bombay** under the National Quantum Mission to designing and deploying visitor tracking analytics live in production for the **Ministry of Culture (NCSM)**, I specialize in engineering low-latency systems that parse the physical world.
              </p>
              <p className="transform origin-bottom">
                I'm a competitive builder, having won **5+ national hackathons (including Bis-Nexus 2025)** and received **2 Best Research Paper awards** for computer-vision and IoT integration models.
              </p>
            </div>

            {/* Staggered Technology Stack Pills */}
            <div>
              <h4 className="font-syne text-xs uppercase font-extrabold tracking-wider text-text-dark mb-4">TECHNOLOGIES & TOOLKIT</h4>
              <div ref={aboutPillsRef} className="flex flex-wrap gap-2.5 max-w-2xl">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-semibold px-4 py-2 bg-white rounded-full border border-black/5 text-text-muted transition-all duration-300 hover:border-accent-bright hover:bg-accent-bright hover:text-white hover:shadow-md cursor-default select-none"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Suspended Pendulum Profile Image */}
          <div className="lg:col-span-5 flex flex-col items-center justify-start h-full pt-10 lg:pt-0 relative">
            
            {/* The Ceiling Hook Point */}
            <div className="absolute top-0 w-3 h-3 bg-black rounded-full shadow-inner z-10 hidden lg:block" />
            
            {/* The Swinger Container */}
            <div 
              ref={hangingProfileRef} 
              className="flex flex-col items-center origin-top relative select-none"
            >
              {/* Suspended Thread */}
              <div className="w-[1.2px] bg-accent-bright/40 h-44 md:h-64 origin-top" />
              
              {/* Circular profile image and glowing container */}
              <div className="relative group cursor-pointer mt-[-2px] active:scale-95 transition-transform duration-300">
                
                {/* Accent Pulsing Outlines */}
                <div className="absolute inset-0 rounded-full border-[6px] border-black/5 scale-105 pointer-events-none" />
                <div className="absolute inset-0 rounded-full border-[1px] border-accent-bright/15 scale-110 animate-ping pointer-events-none" />

                {/* Main circular frame */}
                <div className="hanging-profile-border w-52 h-52 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 border-black/80 bg-neutral-200 transition-all duration-500 glow-red relative">
                  
                  {/* Profile image (grayscale default, colored on hover) */}
                  <img 
                    src="/sayan_profile.jpg" 
                    alt="Sayan Ghosh" 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-105 group-hover:scale-100 transition-all duration-500 ease-out"
                  />
                  
                  {/* Subtle spider web overlay visible on hover */}
                  <div className="absolute inset-0 bg-accent-red/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-multiply flex items-center justify-center">
                    <SpiderWeb origin="center" className="w-44 h-44 opacity-25 text-white" />
                  </div>
                </div>

                {/* Suspended Pendant Tag */}
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-black text-white text-[10px] font-syne uppercase tracking-widest font-extrabold py-1 px-4 rounded-full shadow-lg border border-white/10 group-hover:bg-accent-bright transition-colors duration-300">
                  Sayan Ghosh
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* EXPERIENCE TIMELINE SECTION */}
      <section 
        id="experience" 
        ref={experienceRef}
        className="relative py-24 px-6 md:px-16 border-t border-black/5 bg-white overflow-hidden"
      >
        <div className="max-w-6xl mx-auto relative">
          
          <div className="text-center mb-16">
            <div className="flex justify-center items-center gap-2 mb-3 text-accent-bright font-syne text-[10px] md:text-xs font-bold uppercase tracking-widest">
              <span>🕸️</span>
              <span>PROFESSIONAL TIMELINE</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-syne font-extrabold tracking-tight uppercase text-text-dark">
              ENGINEERING RESEARCH & EXPERIENCES
            </h2>
          </div>

          {/* Timeline center line */}
          <div className="timeline-line h-[80%]" />

          {/* Timeline Nodes */}
          <div className="space-y-16 relative">
            {experiences.map((exp, index) => {
              const isEven = index % 2 === 0;
              return (
                <div 
                  key={exp.company}
                  ref={el => cvTimelineNodes.current[index] = el}
                  id={`experience-node-${index}`}
                  className="flex flex-col md:flex-row items-center justify-between relative md:space-x-8"
                >
                  {/* Left Side spacer/content */}
                  <div className={`w-full md:w-5/12 flex ${isEven ? 'justify-end' : 'order-last justify-start'}`}>
                    {isEven && (
                      <div className="glass-panel hover:shadow-lg hover:border-accent-bright/20 p-6 rounded-2xl border border-black/5 transition-all duration-300 w-full relative group">
                        <div className="absolute top-4 left-4 text-xs font-bold tracking-widest font-syne text-accent-bright uppercase bg-accent-bright/5 px-2.5 py-0.5 rounded">
                          {exp.tag}
                        </div>
                        <span className="block text-right text-xs font-bold text-text-muted mb-8 font-syne uppercase tracking-wider">{exp.period}</span>
                        <h3 className="text-xl font-bold font-syne text-text-dark mb-1 group-hover:text-accent-bright transition-colors">{exp.role}</h3>
                        <h4 className="text-sm font-semibold text-text-muted mb-4 font-syne">{exp.company}</h4>
                        {exp.program && <p className="text-xs font-serif italic text-accent-bright font-bold mb-4">{exp.program}</p>}
                        <ul className="space-y-2 text-sm text-text-muted font-serif leading-relaxed text-left list-disc list-inside">
                          {exp.points.map((pt, pIdx) => (
                            <li key={pIdx} className="pl-1 text-justify">{pt}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Node Dot */}
                  <div className="w-10 h-10 rounded-full border-4 border-white bg-black hover:bg-accent-bright hover:scale-110 active:scale-90 transition-all shadow-md z-10 flex items-center justify-center cursor-pointer my-4 md:my-0 group glow-red">
                    <Briefcase size={12} className="text-white group-hover:rotate-12 transition-transform" />
                  </div>

                  {/* Right Side spacer/content */}
                  <div className={`w-full md:w-5/12 flex ${!isEven ? 'justify-start' : 'order-first justify-end'}`}>
                    {!isEven && (
                      <div className="glass-panel hover:shadow-lg hover:border-accent-bright/20 p-6 rounded-2xl border border-black/5 transition-all duration-300 w-full relative group">
                        <div className="absolute top-4 left-4 text-xs font-bold tracking-widest font-syne text-accent-bright uppercase bg-accent-bright/5 px-2.5 py-0.5 rounded">
                          {exp.tag}
                        </div>
                        <span className="block text-right text-xs font-bold text-text-muted mb-8 font-syne uppercase tracking-wider">{exp.period}</span>
                        <h3 className="text-xl font-bold font-syne text-text-dark mb-1 group-hover:text-accent-bright transition-colors">{exp.role}</h3>
                        <h4 className="text-sm font-semibold text-text-muted mb-4 font-syne">{exp.company}</h4>
                        {exp.program && <p className="text-xs font-serif italic text-accent-bright font-bold mb-4">{exp.program}</p>}
                        <ul className="space-y-2 text-sm text-text-muted font-serif leading-relaxed text-left list-disc list-inside">
                          {exp.points.map((pt, pIdx) => (
                            <li key={pIdx} className="pl-1 text-justify">{pt}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* PROJECTS GRID SECTION */}
      <section 
        id="projects" 
        ref={projectsRef}
        className="relative py-24 px-6 md:px-16 border-t border-black/5 bg-neutral-50 overflow-hidden"
      >
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3 text-accent-bright font-syne text-[10px] md:text-xs font-bold uppercase tracking-widest">
                <span>🕸️</span>
                <span>FEATURED WORK</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-syne font-extrabold tracking-tight uppercase text-text-dark">
                PRODUCTION DEPLOYMENTS & CV ENGINES
              </h2>
            </div>
            <a 
              href="https://github.com/Sayan-2607" 
              target="_blank" 
              rel="noreferrer"
              className="group font-syne text-xs uppercase font-extrabold tracking-widest text-text-dark hover:text-accent-bright flex items-center gap-1.5 transition-colors border border-black/10 px-5 py-3.5 bg-white rounded-full shadow-sm"
            >
              See All Repositories
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((proj, idx) => (
              <div
                key={proj.id}
                ref={el => projectCardsRef.current[idx] = el}
                id={`project-card-${proj.id}`}
                className="glass-panel rounded-3xl border border-black/5 p-6 md:p-8 flex flex-col justify-between hover:shadow-xl hover:border-accent-bright/10 hover:scale-[1.01] transition-all duration-300 relative group overflow-hidden"
              >
                {/* Subtle web decoration inside card hover */}
                <SpiderWeb 
                  origin="top-right" 
                  className="absolute -top-16 -right-16 text-accent-bright/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-44 h-44" 
                />

                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-syne uppercase font-bold tracking-widest text-accent-bright bg-accent-bright/5 px-3 py-1 rounded-full border border-accent-bright/10">
                      {proj.tech.split(',').slice(0, 2).join(',')}
                    </span>
                    
                    <a 
                      href={proj.link} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-text-muted hover:text-accent-bright transition-colors p-1.5 rounded-full hover:bg-neutral-100"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>

                  <h3 className="text-2xl font-syne font-extrabold tracking-tight text-text-dark mb-1 group-hover:text-accent-bright transition-colors">
                    {proj.title}
                  </h3>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-text-muted mb-6">
                    {proj.subtitle}
                  </h4>

                  {/* Problem & Solution design */}
                  <div className="space-y-4 mb-8 text-sm leading-relaxed">
                    <div className="border-l-2 border-red-800/35 pl-3">
                      <span className="block text-[10px] font-syne font-extrabold text-text-muted tracking-wider uppercase mb-1">THE PROBLEM:</span>
                      <p className="text-text-muted font-serif">{proj.problem}</p>
                    </div>
                    <div className="border-l-2 border-accent-bright pl-3">
                      <span className="block text-[10px] font-syne font-extrabold text-accent-bright tracking-wider uppercase mb-1">THE SOLUTION:</span>
                      <p className="text-text-dark font-serif">{proj.solution}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-black/5 flex items-center justify-between text-xs text-text-muted font-syne font-bold uppercase tracking-wider mt-auto">
                  <span>Stack: {proj.tech}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ACHIEVEMENTS STATS GRID */}
      <section 
        id="achievements" 
        ref={achievementsRef}
        className="relative py-24 px-6 md:px-16 border-t border-black/5 bg-white overflow-hidden"
      >
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-16">
            <div className="flex justify-center items-center gap-2 mb-3 text-accent-bright font-syne text-[10px] md:text-xs font-bold uppercase tracking-widest">
              <span>🕸️</span>
              <span>HONORS & RECONGNITIONS</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-syne font-extrabold tracking-tight uppercase text-text-dark">
              HACKATHON TRIUMPHS & PUBLICATIONS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((ach, idx) => (
              <div
                key={ach.title}
                ref={el => achievementCardsRef.current[idx] = el}
                id={`achievement-card-${idx}`}
                className="glass-panel p-6 rounded-2xl border border-black/5 hover:border-accent-bright/10 hover:shadow-lg transition-all duration-300 relative group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-accent-bright/5 text-accent-bright flex items-center justify-center mb-4 group-hover:bg-accent-bright group-hover:text-white transition-colors duration-300">
                    <Award size={18} />
                  </div>
                  
                  <h3 className="text-lg font-bold font-syne text-text-dark tracking-tight mb-2 group-hover:text-accent-bright transition-colors">
                    {ach.title}
                  </h3>
                  <p className="text-sm text-text-muted font-serif leading-relaxed">
                    {ach.desc}
                  </p>
                </div>
                
                <span className="block w-full h-[1.5px] bg-black/5 group-hover:bg-accent-bright transition-all duration-300 mt-6" />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CONTACT SECTION & FOOTER */}
      <section 
        id="contact" 
        ref={contactRef}
        className="relative py-24 px-6 md:px-16 border-t border-black/5 bg-neutral-900 text-white overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        {/* Suspended Red Web background */}
        <SpiderWeb origin="top-left" className="absolute -top-16 -left-16 text-red-500/10 w-96 h-96 pointer-events-none" />
        <SpiderWeb origin="top-right" className="absolute -bottom-16 -right-16 text-red-500/10 w-96 h-96 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left coordinate details */}
            <div className="lg:col-span-6">
              <div className="flex items-center gap-2 mb-4 text-red-500 font-syne text-[10px] md:text-xs font-bold uppercase tracking-widest">
                <span>🕸️</span>
                <span>GET IN TOUCH</span>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-syne font-extrabold tracking-tight leading-none mb-6 uppercase text-white">
                LET'S BUILD THE <span className="text-red-500 font-light serif italic">NEXT</span> NODE.
              </h2>
              
              <p className="text-sm md:text-base text-neutral-400 font-serif leading-relaxed mb-10 max-w-lg">
                I am actively seeking SDE, AI-ML, or Full-Stack developer positions where I can apply low-latency computer vision, real-time analytics pipelines, and secure web application development. Let's collaborate.
              </p>

              {/* Coordinates List */}
              <div className="space-y-4">
                
                {/* Email row */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-red-500/20 hover:bg-white/10 transition-all group">
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-red-500" />
                    <div>
                      <span className="block text-[9px] uppercase tracking-widest font-bold text-neutral-400 font-syne">Email Address</span>
                      <a href="mailto:sg777631@gmail.com" className="text-sm text-neutral-200 hover:text-white font-medium">sg777631@gmail.com</a>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleCopy("sg777631@gmail.com", "email")}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition-colors"
                    title="Copy Email"
                  >
                    {copiedText === "email" ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  </button>
                </div>

                {/* Phone row */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-red-500/20 hover:bg-white/10 transition-all group">
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-red-500" />
                    <div>
                      <span className="block text-[9px] uppercase tracking-widest font-bold text-neutral-400 font-syne">Phone Number</span>
                      <a href="tel:+918101014362" className="text-sm text-neutral-200 hover:text-white font-medium">+91-8101014362</a>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleCopy("+91-8101014362", "phone")}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition-colors"
                    title="Copy Phone"
                  >
                    {copiedText === "phone" ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  </button>
                </div>

                {/* Location row */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                  <MapPin size={16} className="text-red-500" />
                  <div>
                    <span className="block text-[9px] uppercase tracking-widest font-bold text-neutral-400 font-syne">Coordinates</span>
                    <span className="text-sm text-neutral-200 font-medium">Bhubaneswar / Kolkata, India</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Right clean contact form */}
            <div className="lg:col-span-6 bg-white/5 border border-white/5 p-6 md:p-8 rounded-3xl backdrop-blur-md">
              <h3 className="text-xl font-bold font-syne text-white mb-6 uppercase tracking-wider">SEND AN INSTANT DECK</h3>
              
              <form onSubmit={(e) => { e.preventDefault(); alert("Message sent! Sayan will get back to you shortly."); }} className="space-y-6">
                <div>
                  <label className="block text-[9px] font-syne font-extrabold uppercase tracking-widest text-neutral-400 mb-1.5">Your Identity / Company</label>
                  <input 
                    type="text" 
                    placeholder="E.g. IIT Bombay Recruiter"
                    className="w-full bg-white/5 border-b border-white/10 focus:border-red-500 px-1 py-3 text-sm text-white focus:outline-none transition-all placeholder-neutral-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-syne font-extrabold uppercase tracking-widest text-neutral-400 mb-1.5">Direct Channels (Email / Tel)</label>
                  <input 
                    type="text" 
                    placeholder="E.g. recruiter@iitb.ac.in"
                    className="w-full bg-white/5 border-b border-white/10 focus:border-red-500 px-1 py-3 text-sm text-white focus:outline-none transition-all placeholder-neutral-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-syne font-extrabold uppercase tracking-widest text-neutral-400 mb-1.5">The Brief / Scope</label>
                  <textarea 
                    rows="3"
                    placeholder="Write a short summary about the role or project..."
                    className="w-full bg-white/5 border-b border-white/10 focus:border-red-500 px-1 py-3 text-sm text-white focus:outline-none transition-all placeholder-neutral-600 resize-none"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-white text-black font-syne font-extrabold text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-md"
                >
                  TRANSMIT SIGNAL
                </button>
              </form>
            </div>

          </div>

          {/* Social connections & credits */}
          <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500 font-syne">
            <div>
              <span>© 2026 Sayan Ghosh. All Rights Reserved.</span>
            </div>
            
            <div className="flex items-center gap-6">
              <a href="https://github.com/Sayan-2607" target="_blank" rel="noreferrer" className="hover:text-red-500 transition-colors">GitHub</a>
              <a href="https://linkedin.com/in/sayan-g-600ab5307" target="_blank" rel="noreferrer" className="hover:text-red-500 transition-colors">LinkedIn</a>
              <a href="https://leetcode.com/sayan27" target="_blank" rel="noreferrer" className="hover:text-red-500 transition-colors">LeetCode</a>
            </div>
          </div>

        </div>
      </section>

      {/* SEARCH MODAL OVERLAY */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-neutral-900 border border-white/10 p-6 md:p-8 text-white relative shadow-2xl">
            <button 
              onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-bold font-syne uppercase tracking-wider mb-4 text-white">SEARCH PORTFOLIO</h3>
            
            <div className="relative flex items-center mb-6">
              <Search className="absolute left-4 text-neutral-500" size={20} />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills, projects, timeline, or experiences..."
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 hover:bg-white/10 focus:bg-white/10 rounded-2xl border-none focus:outline-none focus:ring-1 focus:ring-red-500 text-white placeholder-neutral-500 transition-all text-sm"
              />
            </div>

            <div className="max-h-72 overflow-y-auto pr-2 space-y-3">
              {searchQuery.trim() === "" ? (
                <div className="text-center py-8 text-neutral-500 text-sm">
                  Type to query details across Sayan's research, SDE internships, hackathons, and certifications.
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-8 text-neutral-400 text-sm">
                  No matches found for "<span className="text-white font-medium">{searchQuery}</span>"
                </div>
              ) : (
                searchResults.map((result, index) => (
                  <button
                    key={`${result.type}-${index}`}
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                      scrollToSection(result.section);
                      
                      // Flash highlight of the element
                      const elementId = result.type === "experience" 
                        ? `experience-node-${experiences.findIndex(e => e.role === result.title)}`
                        : result.type === "project"
                          ? `project-card-${projects.findIndex(p => p.title === result.title)}`
                          : "";
                      if (elementId) {
                        const target = document.getElementById(elementId);
                        if (target) {
                          gsap.fromTo(target, 
                            { backgroundColor: "rgba(220,38,38,0.15)" }, 
                            { backgroundColor: "transparent", duration: 2.0 }
                          );
                        }
                      }
                    }}
                    className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-red-500/20 transition-all flex flex-col gap-1"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-syne uppercase tracking-widest text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded">
                        {result.type}
                      </span>
                      <span className="text-xs text-neutral-400 font-light uppercase tracking-wider">{result.section}</span>
                    </div>
                    <h4 className="text-base font-semibold text-white">{result.title}</h4>
                    <p className="text-xs text-neutral-400">{result.detail}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* PROFILE DETAILS DRAWER */}
      {profileOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md h-full bg-neutral-900 border-l border-white/10 text-white p-6 md:p-8 flex flex-col justify-between relative shadow-2xl overflow-y-auto">
            
            <button 
              onClick={() => setProfileOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
            >
              <X size={20} />
            </button>

            <div>
              {/* Header profile details */}
              <div className="flex flex-col items-center text-center pb-6 border-b border-white/5 mt-6">
                <div className="w-20 h-20 rounded-full border border-red-500/30 overflow-hidden mb-4 shadow-lg">
                  <img src="/sayan_profile.jpg" alt="Sayan Ghosh" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-bold font-syne text-white uppercase tracking-wider">Sayan Ghosh</h3>
                <p className="text-xs text-red-500 font-semibold tracking-widest uppercase mt-1">AI/ML & Full-Stack SDE</p>
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-2 font-serif">
                  <MapPin size={12} className="text-red-500" />
                  <span>Bhubaneswar, India</span>
                </div>
              </div>

              {/* Stats Highlights */}
              <div className="py-6 space-y-5 text-sm">
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/5 text-red-500 mt-0.5 border border-white/5">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h4 className="font-syne font-bold text-white text-xs uppercase tracking-wider">Quantum Imaging Intern</h4>
                    <p className="text-xs text-neutral-400 font-serif mt-0.5">Competitively selected under India's National Quantum Mission (PARIMANA) at IIT Bombay.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/5 text-red-500 mt-0.5 border border-white/5">
                    <Award size={16} />
                  </div>
                  <div>
                    <h4 className="font-syne font-bold text-white text-xs uppercase tracking-wider">5+ Hackathon Wins</h4>
                    <p className="text-xs text-neutral-400 font-serif mt-0.5">Winner of Bis-Nexus Hackathon 2025 and 8+ national-level runner-up finishes.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/5 text-red-500 mt-0.5 border border-white/5">
                    <Code size={16} />
                  </div>
                  <div>
                    <h4 className="font-syne font-bold text-white text-xs uppercase tracking-wider">Production Deployments</h4>
                    <p className="text-xs text-neutral-400 font-serif mt-0.5">Designed real-time CCTV crowd density tracking and occupancy IoT automation system deployed at NCSM museum exhibits.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/5 text-red-500 mt-0.5 border border-white/5">
                    <Layers size={16} />
                  </div>
                  <div>
                    <h4 className="font-syne font-bold text-white text-xs uppercase tracking-wider">B.Tech CSE Undergraduate</h4>
                    <p className="text-xs text-neutral-400 font-serif mt-0.5">KIIT University. Relevant coursework: DSA, Operating Systems, DBMS, Machine Learning, Computer Vision. CGPA: 8.28/10.00.</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick buttons */}
            <div className="pt-6 border-t border-white/5 flex flex-col gap-3 mt-6">
              <a
                href="mailto:sg777631@gmail.com"
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-syne font-extrabold text-xs uppercase tracking-widest rounded-xl text-center shadow-md transition-colors"
              >
                Hire Sayan
              </a>
              <button
                onClick={() => setProfileOpen(false)}
                className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-white font-syne font-extrabold text-xs uppercase tracking-widest rounded-xl text-center border border-white/10 transition-colors"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default App;
