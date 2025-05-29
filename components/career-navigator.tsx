"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Code,
  Database,
  Shield,
  Smartphone,
  Cloud,
  BarChart3,
  Star,
  LogOut,
  User,
  Brain,
  TrendingUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { supabase, type UserInformation } from "@/lib/supabase"
import { ThemeToggle } from "@/components/theme-toggle"
import { SkillExpertiseAssessment } from "@/components/skill-expertise-assessment"
import { RoadmapTracker } from "@/components/roadmap-tracker"
import type { AIRecommendation } from "@/lib/ai-recommendations"

interface CareerPath {
  id: string
  title: string
  icon: React.ReactNode
  description: string
  skills: string[]
  avgSalary: string
  jobGrowth: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  roadmap: {
    phase: string
    duration: string
    skills: string[]
    projects: string[]
  }[]
}

const careerPaths: CareerPath[] = [
  {
    id: "frontend",
    title: "Frontend Developer",
    icon: <Code className="h-6 w-6" />,
    description: "Create beautiful, interactive user interfaces and web experiences",
    skills: [
      "HTML/CSS",
      "JavaScript",
      "React",
      "TypeScript",
      "UI/UX Design",
      "Responsive Design",
      "Version Control (Git)",
      "Testing Frameworks (Jest, Mocha)",
      "CSS Preprocessors (Sass, LESS)",
      "Web Performance Optimization",
    ],
    avgSalary: "$70k - $120k",
    jobGrowth: "13% (Much faster than average)",
    difficulty: "Beginner",
    roadmap: [
      {
        phase: "Foundation (0-3 months)",
        duration: "3 months",
        skills: ["HTML5 semantic elements", "CSS3 basics (box model, flexbox, grid)", "JavaScript ES6+ fundamentals (variables, control flow, functions)", "Git and GitHub basics (version control)", "Responsive design principles and media queries"],
        projects: ["Personal Portfolio", "Landing Page", "Calculator App"],
      },
      {
        phase: "Framework Mastery (3-6 months)",
        duration: "3 months",
        skills: ["React.js components, hooks, and state management (useState, useEffect)", "Client-side routing (React Router)", "Fetching and handling APIs (RESTful)", "CSS frameworks (Tailwind CSS, Bootstrap)","Component styling (CSS Modules, Styled Components)"],
        projects: ["Todo App", "Weather App", "E-commerce Frontend"],
      },
      {
        phase: "Advanced Skills (6-9 months)",
        duration: "3 months",
        skills: ["TypeScript fundamentals and integration with React", "Next.js for server-side rendering and static site generation", "Unit and integration testing (Jest, React Testing Library)", "Performance optimization techniques (code splitting, lazy loading)","Progressive Web Apps (PWA) basics"],
        projects: ["Full-stack Blog", "Real-time Chat App", "Dashboard"],
      },
      {
        phase: "Job Ready (9-12 months)",
        duration: "3 months",
        skills: ["System design basics for frontend (component architecture, state management patterns)", "Deployment pipelines (Netlify, Vercel)", "Team collaboration using Git workflows (feature branching, pull requests)", "Code review and refactoring best practices","Agile methodology basics and sprint planning"],
        projects: ["Capstone Project", "Open Source Contributions", "Interview Prep"],
      },
    ],
  },
  {
    id: "backend",
    title: "Backend Developer",
    icon: <Database className="h-6 w-6" />,
    description: "Build robust server-side applications and APIs that power applications",
    skills: [
      "Python/Java/Node.js",
      "Databases (SQL/NoSQL)",
      "APIs (RESTful, GraphQL)",
      "Cloud Services (AWS, Azure)",
      "System Design",
      "Microservices Architecture",
      "Containerization (Docker)",
      "CI/CD Tools (Jenkins, GitHub Actions)",
      "Security Best Practices",
    ],
    avgSalary: "$75k - $130k",
    jobGrowth: "22% (Much faster than average)",
    difficulty: "Intermediate",
    roadmap: [
      {
        phase: "Programming Fundamentals (0-4 months)",
        duration: "4 months",
        skills: ["One backend language (e.g., Python, Java, or Node.js) syntax and idioms", "Data structures and algorithms basics (arrays, linked lists, sorting)", "Git version control", "Linux command line basics","Basic debugging and logging"],
        projects: ["CLI Tools", "Simple Web Server", "File Processing Scripts"],
      },
      {
        phase: "Web Development (4-8 months)",
        duration: "4 months",
        skills: ["RESTful API design principles", "Database basics (SQL and NoSQL: schema design, queries)", "Authentication methods (JWT, OAuth)", "Unit and integration testing frameworks (e.g., pytest, Mocha)","Environment configuration and management"],
        projects: ["REST API", "User  Management System", "Blog Backend"],
      },
      {
        phase: "Advanced Backend (8-12 months)",
        duration: "4 months",
        skills: ["Microservices architecture patterns", "Caching strategies (Redis, Memcached)", "Message queues and async processing (RabbitMQ, Kafka)", "Containerization with Docker basics","Logging, monitoring, and alerting basics"],
        projects: ["Microservices App", "Real-time API", "Scalable Backend"],
      },
      {
        phase: "Production Ready (12-15 months)",
        duration: "3 months",
        skills: ["Cloud deployment (AWS EC2, Elastic Beanstalk, or Azure App Services)", "Infrastructure monitoring and incident management", "Security best practices (OWASP Top 10)", "Performance tuning and profiling","Continuous integration/deployment pipelines (Jenkins, GitHub Actions)"],
        projects: ["Production App", "System Design Interview", "Open Source"],
      },
    ],
  },
  {
    id: "datascience",
    title: "Data Scientist",
    icon: <BarChart3 className="h-6 w-6" />,
    description: "Extract insights from data using statistics, machine learning, and visualization",
    skills: [
      "Python/R",
      "Statistics",
      "Machine Learning",
      "SQL",
      "Data Visualization (Tableau, Power BI)",
      "Data Wrangling (Pandas, NumPy)",
      "Big Data Technologies (Hadoop, Spark)",
      "Data Mining",
      "Predictive Modeling",
    ],
    avgSalary: "$85k - $150k",
    jobGrowth: "35% (Much faster than average)",
    difficulty: "Advanced",
    roadmap: [
      {
        phase: "Math & Programming (0-4 months)",
        duration: "4 months",
        skills: ["Python fundamentals (programming basics, libraries)", "Statistics basics (mean, variance, distributions)", "Linear algebra and calculus fundamentals", "SQL querying basics for data retrieval", "Data manipulation with Pandas and NumPy"],
        projects: ["Data Analysis Projects", "Statistical Reports", "SQL Queries"],
      },
      {
        phase: "Machine Learning (4-8 months)",
        duration: "4 months",
        skills: ["Supervised and unsupervised machine learning algorithms (regression, clustering)","Feature engineering techniques","Model evaluation and validation methods","Data visualization tools and techniques (Matplotlib, Seaborn)","Using scikit-learn library"],
        projects: ["Prediction Models", "Classification Tasks", "Data Dashboards"],
      },
      {
        phase: "Advanced ML (8-12 months)",
        duration: "4 months",
        skills: ["Deep learning fundamentals (neural networks, CNNs, RNNs)","Natural language processing basics","Computer vision concepts","Big data processing tools (Hadoop, Spark basics)","Model deployment and monitoring"],
        projects: ["Neural Networks", "NLP Projects", "Image Recognition"],
      },
      {
        phase: "Industry Ready (12-18 months)",
        duration: "6 months",
        skills: ["MLOps principles (model versioning, automation)","Cloud platforms for ML (AWS SageMaker, GCP AI Platform)","A/B testing and experimental design","Business metrics understanding and communication","Building end-to-end ML pipelines"],
        projects: ["End-to-end ML Pipeline", "Business Case Studies", "Portfolio"],
      },
    ],
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity Specialist",
    icon: <Shield className="h-6 w-6" />,
    description: "Protect systems and data from cyber threats and security vulnerabilities",
    skills: [
      "Network Security",
      "Ethical Hacking",
      "Risk Assessment",
      "Compliance (GDPR, HIPAA)",
      "Incident Response",
      "Security Information and Event Management (SIEM)",
      "Firewalls and Intrusion Detection Systems",
      "Cryptography",
      "Vulnerability Assessment Tools",
    ],
    avgSalary: "$80k - $140k",
    jobGrowth: "33% (Much faster than average)",
    difficulty: "Intermediate",
    roadmap: [
      {
        phase: "Security Fundamentals (0-4 months)",
        duration: "4 months",
        skills: ["Basic networking concepts (TCP/IP, protocols, ports)","Operating system security fundamentals (Linux, Windows)","Security principles and CIA triad (Confidentiality, Integrity, Availability)","Basic command line tools and scripting","Introduction to vulnerability assessment"],
        projects: ["Network Scanning", "System Hardening", "Security Audit"],
      },
      {
        phase: "Ethical Hacking (4-8 months)",
        duration: "4 months",
        skills: ["Penetration testing methodologies and tools (Nmap, Metasploit)","Web application security (OWASP Top 10)","Cryptography basics and implementation","Vulnerability scanning and analysis","Writing penetration test reports"],
        projects: ["Pen Testing Lab", "Web App Security", "Crypto Challenges"],
      },
      {
        phase: "Advanced Security (8-12 months)",
        duration: "4 months",
        skills: ["Incident response planning and execution","Malware analysis techniques","Cloud security fundamentals","Digital forensics principles","Security architecture design concepts"],
        projects: ["Incident Response Plan", "Malware Lab", "Cloud Security Assessment"],
      },
      {
        phase: "Professional Ready (12-15 months)",
        duration: "3 months",
        skills: ["Compliance frameworks (GDPR, HIPAA)","Risk management strategies","Security certifications preparation (CISSP, CEH)","Security policy and governance development","Advanced threat modeling"],
        projects: ["Security Framework", "Certification Prep", "Capstone Project"],
      },
    ],
  },
  {
    id: "mobile",
    title: "Mobile Developer",
    icon: <Smartphone className="h-6 w-6" />,
    description: "Create native and cross-platform mobile applications for iOS and Android",
    skills: [
      "React Native/Flutter",
      "iOS/Android Development",
      "Mobile UI/UX Design",
      "App Store Optimization",
      "APIs Integration",
      "Version Control (Git)",
      "Testing Frameworks (JUnit, XCTest)",
      "Performance Optimization",
      "User  Authentication",
    ],
    avgSalary: "$75k - $125k",
    jobGrowth: "22% (Much faster than average)",
    difficulty: "Intermediate",
    roadmap: [
      {
        phase: "Mobile Basics (0-3 months)",
        duration: "3 months",
        skills: ["JavaScript/Dart fundamentals","Mobile design principles (UI/UX for mobile)","Git version control basics","Development environment setup (Android Studio, Xcode)","Basic app structure and navigation"],
        projects: ["Simple Calculator", "Weather App", "Note Taking App"],
      },
      {
        phase: "Framework Mastery (3-6 months)",
        duration: "3 months",
        skills: ["React Native or Flutter for cross-platform development","State management (Redux, Context API)","API integration and data fetching","Navigation and routing in mobile apps","Testing frameworks (JUnit, XCTest)"],
        projects: ["Social Media App", "E-commerce App", "Fitness Tracker"],
      },
      {
        phase: "Advanced Features (6-9 months)",
        duration: "3 months",
        skills: ["Push notifications and background tasks","Offline storage solutions (SQLite, AsyncStorage)","Camera and GPS integration","Performance optimization techniques","App security best practices"],
        projects: ["Chat Application", "Photo Sharing App", "Location-based App"],
      },
      {
        phase: "Production Ready (9-12 months)",
        duration: "3 months",
        skills: ["App Store deployment processes (iOS and Android)","Analytics integration (Firebase, Google Analytics)","Monetization strategies (in-app purchases, ads)","User authentication methods","Continuous integration/deployment for mobile apps"],
        projects: ["Published App", "App Store Optimization", "Portfolio"],
      },
    ],
  },
  {
    id: "devops",
    title: "DevOps Engineer",
    icon: <Cloud className="h-6 w-6" />,
    description: "Bridge development and operations through automation and infrastructure management",
    skills: [
      "Docker",
      "Kubernetes",
      "CI/CD Tools (Jenkins, GitHub Actions)",
      "Cloud Platforms (AWS, Azure, GCP)",
      "Infrastructure as Code (Terraform, Ansible)",
      "Monitoring Tools (Prometheus, Grafana)",
      "Scripting (Bash, Python)",
      "Networking Basics",
      "Security Best Practices",
    ],
    avgSalary: "$85k - $145k",
    jobGrowth: "25% (Much faster than average)",
    difficulty: "Advanced",
    roadmap: [
      {
        phase: "Foundation (0-4 months)",
        duration: "4 months",
        skills: ["Linux fundamentals and command line usage","Networking basics (TCP/IP, DNS, HTTP)","Git version control basics","Scripting basics (Bash, Python)","Cloud computing fundamentals (AWS, Azure)"],
        projects: ["Server Setup", "Automation Scripts", "Basic Monitoring"],
      },
      {
        phase: "Containerization (4-8 months)",
        duration: "4 months",
        skills: ["Docker basics (images, containers, Dockerfile)","Container orchestration with Kubernetes","Microservices architecture principles","CI/CD pipeline setup (Jenkins, GitHub Actions)","Infrastructure as Code (Terraform, Ansible)"],
        projects: ["Dockerized Apps", "K8s Cluster", "Container Registry"],
      },
      {
        phase: "CI/CD & IaC (8-12 months)",
        duration: "4 months",
        skills: ["Advanced CI/CD practices and tools","Monitoring and logging tools (Prometheus, Grafana)","Security best practices in DevOps","Automated testing strategies","Configuration management tools (Chef, Puppet)"],
        projects: ["CI/CD Pipeline", "Infrastructure Automation", "Monitoring Setup"],
      },
      {
        phase: "Production Systems (12-18 months)",
        duration: "6 months",
        skills: ["Disaster recovery planning and implementation","Performance tuning and optimization","Cost optimization strategies in cloud environments","Advanced networking concepts (VPNs, load balancers)","Collaboration and communication in Agile teams"],
        projects: ["Production Infrastructure", "Security Implementation", "Portfolio"],
      },
    ],
  },
  // BCom Career Paths
  {
    id: "corporate-finance",
    title: "Corporate Finance Analyst",
    icon: <Database className="h-6 w-6" />,
    description: "Analyze financial activities and strategies for corporations.",
    skills: [
      "Financial Modeling",
      "Budgeting",
      "Risk Management",
      "Valuation",
      "Excel Advanced",
      "Power BI",
      "Financial Reporting",
      "Data Analysis",
      "Presentation Skills",
    ],
    avgSalary: "$65k - $105k",
    jobGrowth: "7% (Average)",
    difficulty: "Intermediate",
    roadmap: [
      {
        phase: "Finance Fundamentals (0-3 months)",
        duration: "3 months",
        skills: ["Accounting principles and financial statements basics","Excel basics and financial formulas","Budgeting and forecasting","Introduction to financial analysis","Basic data visualization (charts and graphs)"],
        projects: ["Budget Report", "Financial Analysis"],
      },
      {
        phase: "Advanced Financial Analysis (3-6 months)",
        duration: "3 months",
        skills: ["Financial modeling (DCF, comparables)","Valuation techniques","Risk assessment methods","Advanced Excel skills (pivot tables, macros)","Use of Power BI or Tableau for reporting"],
        projects: ["Valuation Report", "Risk Analysis"],
      },
      {
        phase: "Professional Ready (6-12 months)",
        duration: "6 months",
        skills: ["Corporate finance strategy and decision-making","Mergers & Acquisitions basics","Investor relations fundamentals","Presentation and communication of financial information","Regulatory environment understanding"],
        projects: ["Investment Proposal", "Financial Strategy Plan"],
      },
    ],
  },
  {
    id: "investment-banking",
    title: "Investment Banker",
    icon: <Star className="h-6 w-6" />,
    description: "Advise on and facilitate financial transactions for clients.",
    skills: [
      "Financial Analysis",
      "Client Relations",
      "Market Research",
      "Negotiation",
      "Excel Advanced",
      "PowerPoint",
      "Financial Modeling",
      "Valuation Techniques",
      "Due Diligence",
    ],
    avgSalary: "$85k - $160k",
    jobGrowth: "9% (Faster than average)",
    difficulty: "Advanced",
    roadmap: [
      {
        phase: "Entry-Level Skills (0-4 months)",
        duration: "4 months",
        skills: ["Financial modeling basics","Excel advanced functions and formulas","Presentation skills (PowerPoint)","Market research techniques","Client relationship fundamentals"],
        projects: ["Pitch Deck", "Market Analysis"],
      },
      {
        phase: "Transaction Management (4-8 months)",
        duration: "4 months",
        skills: ["Deal structuring and negotiation basics","Due diligence processes","Valuation techniques (comparable company analysis, precedent transactions)","Financial analysis and reporting","Risk assessment in transactions"],
        projects: ["Deal Memo", "Due Diligence Report"],
      },
      {
        phase: "Senior Level Skills (8-12 months)",
        duration: "4 months",
        skills: ["Client management and relationship building","Regulatory compliance and reporting","Advanced financial modeling and forecasting","Strategic advisory skills","Presentation of investment proposals"],
        projects: ["Client Proposal", "Negotiation Simulation"],
      },
    ],
  },
  {
    id: "marketing-strategies",
    title: "Marketing Strategist",
    icon: <Star className="h-6 w-6" />,
    description: "Develop strategic plans to drive business growth through marketing.",
    skills: [
      "Market Research",
      "Strategy Development",
      "Brand Management",
      "Analytics",
      "SEO",
      "Content Marketing",
      "Social Media Management",
      "Email Marketing",
      "Data Analysis Tools (Google Analytics, Power BI)",
    ],
    avgSalary: "$60k - $110k",
    jobGrowth: "11% (Faster than average)",
    difficulty: "Intermediate",
    roadmap: [
      {
        phase: "Marketing Basics (0-3 months)",
        duration: "3 months",
        skills: ["Consumer behavior principles","Marketing fundamentals and concepts","Data analytics basics","Introduction to SEO","Competitive analysis techniques"],
        projects: ["Marketing Plan Draft", "Competitive Analysis"],
      },
      {
        phase: "Strategy Development (3-6 months)",
        duration: "3 months",
        skills: ["Campaign planning and execution","Brand positioning and management","Content marketing essentials","Use of analytics tools (Google Analytics, Power BI)","Social media marketing basics"],
        projects: ["Campaign Proposal", "Brand Strategy"],
      },
      {
        phase: "Advanced Marketing (6-12 months)",
        duration: "6 months",
        skills: ["Digital marketing strategies and optimization","SEO advanced techniques and tools","Email marketing campaigns","Marketing automation platforms","ROI measurement and marketing analytics reporting"],
        projects: ["Digital Campaign", "SEO Optimization Report"],
      },
    ],
  },
  {
    id: "e-commerce",
    title: "E-commerce Specialist",
    icon: <Cloud className="h-6 w-6" />,
    description: "Manage online sales platforms and improve customer shopping experience.",
    skills: [
      "Online Merchandising",
      "Customer Service",
      "SEO",
      "Digital Analytics",
      "E-commerce Platforms (Shopify, WooCommerce)",
      "Email Marketing",
      "Social Media Advertising",
      "Data Analysis Tools (Google Analytics, Power BI)",
    ],
    avgSalary: "$55k - $100k",
    jobGrowth: "14% (Faster than average)",
    difficulty: "Intermediate",
    roadmap: [
      {
        phase: "E-commerce Fundamentals (0-3 months)",
        duration: "3 months",
        skills: ["Online merchandising basics","Customer service principles","SEO basics for e-commerce","Digital marketing fundamentals","Introduction to e-commerce platforms (Shopify, WooCommerce)"],
        projects: ["Online Store Setup", "SEO Audit"],
      },
      {
        phase: "Sales Optimization (3-6 months)",
        duration: "3 months",
        skills: ["Conversion rate optimization techniques","Data analytics for e-commerce (Google Analytics)","Marketing campaign planning and execution","Customer engagement strategies","Inventory management basics"],
        projects: ["Sales Report", "Marketing Campaign"],
      },
      {
        phase: "Advanced Strategies (6-12 months)",
        duration: "6 months",
        skills: ["User experience (UX) design principles","Omnichannel marketing strategies","Advanced SEO techniques for e-commerce","Social media advertising strategies","Data analysis tools for e-commerce insights"],
        projects: ["UX Report", "Inventory System Plan"],
      },
    ],
  },
  {
    id: "supply-chain-management",
    title: "Supply Chain Manager",
    icon: <Database className="h-6 w-6" />,
    description: "Oversee and improve supply chain processes to optimize efficiency.",
    skills: [
      "Logistics",
      "Inventory Control",
      "Demand Forecasting",
      "Supplier Relations",
      "Data Analysis",
      "ERP Systems (SAP, Oracle)",
      "Lean Management",
      "Project Management",
    ],
    avgSalary: "$65k - $110k",
    jobGrowth: "8% (Average)",
    difficulty: "Intermediate",
    roadmap: [
      {
        phase: "Supply Chain Basics (0-3 months)",
        duration: "3 months",
        skills: ["Inventory management fundamentals","Logistics principles and practices","Basic data analysis skills","Supplier relationship management basics","Introduction to ERP systems (SAP, Oracle)"],
        projects: ["Inventory Report", "Logistics Plan"],
      },
      {
        phase: "Process Optimization (3-6 months)",
        duration: "3 months",
        skills: ["Demand forecasting techniques","Lean management principles","Supplier negotiation strategies","Risk management in supply chains","Data analysis for supply chain optimization"],
        projects: ["Forecast Model", "Supplier Analysis"],
      },
      {
        phase: "Advanced Management (6-12 months)",
        duration: "6 months",
        skills: ["Advanced ERP system usage","Project management skills","Supply chain strategy development","Performance measurement and KPIs","Sustainability practices in supply chain management"],
        projects: ["Process Improvement Plan", "Risk Mitigation Strategy"],
      },
    ],
  },
  {
    id: "business-analytics",
    title: "Business Analyst",
    icon: <BarChart3 className="h-6 w-6" />,
    description: "Analyze business performance and recommend solutions for growth.",
    skills: [
      "Data Analysis",
      "Process Improvement",
      "Reporting",
      "Stakeholder Communication",
      "SQL",
      "Excel Advanced",
      "Data Visualization Tools (Tableau, Power BI)",
      "Business Process Modeling",
    ],
    avgSalary: "$65k - $110k",
    jobGrowth: "11% (Faster than average)",
    difficulty: "Intermediate",
    roadmap: [
      {
        phase: "Business Fundamentals (0-3 months)",
        duration: "3 months",
        skills: ["Business process mapping and analysis","Data visualization basics (Excel, Tableau)","Stakeholder communication skills","Introduction to SQL for data retrieval","Reporting basics"],
        projects: ["Business Report", "Dashboard Creation"],
      },
      {
        phase: "Analytical Techniques (3-6 months)",
        duration: "3 months",
        skills: ["Requirement gathering and documentation","Process improvement methodologies (Lean, Six Sigma)","Advanced data analysis techniques","Use of analytical tools (Power BI, Tableau)","Business case development"],
        projects: ["SQL Queries", "Process Map"],
      },
      {
        phase: "Advanced Analytics (6-12 months)",
        duration: "6 months",
        skills: ["Predictive analytics techniques","Stakeholder management and engagement","Project management skills","Advanced SQL querying","Business process modeling"],
        projects: ["Forecast Model", "Project Plan"],
      },
    ],
  },
  {
    id: "social-researcher",
    title: "Social Researcher",
    icon: <Brain className="h-6 w-6" />,
    description: "Conduct research to understand social behaviors and trends.",
    skills: [
      "Survey Design",
      "Data Collection",
      "Statistical Analysis",
      "Report Writing",
      "Qualitative Research Methods",
      "Quantitative Research Methods",
      "Data Analysis Software (SPSS, R)",
      "Presentation Skills",
    ],
    avgSalary: "$45k - $85k",
    jobGrowth: "6% (Average)",
    difficulty: "Intermediate",
    roadmap: [
      {
        phase: "Research Basics (0-3 months)",
        duration: "3 months",
        skills: ["Research methods and design principles","Data collection techniques (surveys, interviews)","Basic statistical analysis","Report writing fundamentals","Qualitative research methods"],
        projects: ["Survey Design", "Field Study"],
      },
      {
        phase: "Data Analysis (3-6 months)",
        duration: "3 months",
        skills: ["Statistical software usage (SPSS, R)","Data visualization techniques","Writing research reports and presentations","Quantitative research methods","Ethical considerations in research"],
        projects: ["Data Report", "Presentation"],
      },
      {
        phase: "Advanced Research (6-12 months)",
        duration: "6 months",
        skills: ["Policy analysis techniques","Advanced qualitative and quantitative methods","Data interpretation and synthesis","Research project management","Communication of research findings"],
        projects: ["Research Paper", "Policy Brief"],
      },
    ],
  },
  {
    id: "cultural-analyst",
    title: "Cultural Analyst",
    icon: <Brain className="h-6 w-6" />,
    description: "Study cultural phenomena and provide insights for organizations.",
    skills: [
      "Cultural Studies",
      "Ethnography",
      "Qualitative Analysis",
      "Report Writing",
      "Data Analysis",
      "Media Analysis",
      "Presentation Skills",
      "Critical Thinking",
    ],
    avgSalary: "$50k - $90k",
    jobGrowth: "5% (Average)",
    difficulty: "Intermediate",
    roadmap: [
      {
        phase: "Foundations (0-3 months)",
        duration: "3 months",
        skills: ["Cultural theory basics","Ethnographic research methods","Qualitative analysis techniques","Report writing fundamentals","Data analysis basics"],
        projects: ["Field Notes", "Cultural Report"],
      },
      {
        phase: "Analysis Techniques (3-6 months)",
        duration: "3 months",
        skills: ["Media analysis methods","Qualitative coding techniques","Presentation skills for research findings","Critical thinking and analysis","Research ethics"],
        projects: ["Content Analysis", "Presentation"],
      },
      {
        phase: "Applied Analysis (6-12 months)",
        duration: "6 months",
        skills: ["Policy impact analysis","Cross-cultural communication skills","Consulting report writing","Advanced qualitative research methods","Data interpretation and application"],
        projects: ["Consulting Report", "Policy Recommendations"],
      },
    ],
  },
  {
    id: "public-relations",
    title: "Public Relations Specialist",
    icon: <User className="h-6 w-6" />,
    description: "Manage communication between organizations and the public.",
    skills: [
      "Media Relations",
      "Crisis Communication",
      "Event Planning",
      "Content Creation",
      "Social Media Management",
      "Writing Skills",
      "Public Speaking",
      "Analytical Skills",
    ],
    avgSalary: "$55k - $95k",
    jobGrowth: "7% (Average)",
    difficulty: "Intermediate",
    roadmap: [
      {
        phase: "PR Basics (0-3 months)",
        duration: "3 months",
        skills: ["Media writing fundamentals","Press release writing","Event management basics","Communication skills","Social media basics"],
        projects: ["Press Release", "Event Plan"],
      },
      {
        phase: "Communication Strategies (3-6 months)",
        duration: "3 months",
        skills: ["Crisis communication planning","Social media strategy development","Content creation for PR campaigns","Media relations skills","Analytical skills for PR measurement"],
        projects: ["Social Campaign", "Crisis Plan"],
      },
      {
        phase: "Advanced PR (6-12 months)",
        duration: "6 months",
        skills: ["Brand reputation management","Advanced media relations techniques","Strategic communication planning","Measurement and evaluation of PR campaigns","Stakeholder engagement strategies"],
        projects: ["Reputation Management Plan", "Media Kit"],
      },
    ],
  },
  {
    id: "content-creator",
    title: "Content Creator",
    icon: <Star className="h-6 w-6" />,
    description: "Create engaging content for various platforms.",
    skills: [
      "Writing",
      "Video Editing",
      "Social Media Management",
      "SEO",
      "Content Strategy",
      "Graphic Design",
      "Analytics Tools (Google Analytics, Power BI)",
      "Creativity",
    ],
    avgSalary: "$40k - $80k",
    jobGrowth: "15% (Faster than average)",
    difficulty: "Beginner",
    roadmap: [
      {
        phase: "Content Basics (0-3 months)",
        duration: "3 months",
        skills: ["Writing fundamentals (grammar, style)","Social media platform basics","Basic video editing skills","Content planning and strategy","SEO basics for content"],
        projects: ["Blog Posts", "Social Media Posts"],
      },
      {
        phase: "Intermediate Skills (3-6 months)",
        duration: "3 months",
        skills: ["Advanced video editing techniques","SEO for content optimization","Audience engagement strategies","Content calendar development","Analytics tools for content performance"],
        projects: ["YouTube Videos", "Podcast Episodes"],
      },
      {
        phase: "Advanced Content Creation (6-12 months)",
        duration: "6 months",
        skills: ["Content strategy development","Advanced analytics for content insights","Brand storytelling techniques","Collaboration with marketing teams","Monetization strategies for content"],
        projects: ["Content Calendar", "Analytics Report"],
      },
    ],
  },
  {
    id: "policy-development",
    title: "Policy Analyst",
    icon: <Brain className="h-6 w-6" />,
    description: "Analyze and develop policies to address community and governmental issues.",
    skills: [
      "Research",
      "Data Analysis",
      "Report Writing",
      "Stakeholder Engagement",
      "Policy Research",
      "Legislation Process",
      "Communication Skills",
      "Critical Thinking",
    ],
    avgSalary: "$55k - $100k",
    jobGrowth: "6% (Average)",
    difficulty: "Intermediate",
    roadmap: [
      {
        phase: "Policy Basics (0-3 months)",
        duration: "3 months",
        skills: ["Policy research fundamentals","Understanding the legislative process","Basic data analysis skills","Report writing basics","Stakeholder engagement fundamentals"],
        projects: ["Policy Brief", "Legislative Review"],
      },
      {
        phase: "Analysis & Development (3-6 months)",
        duration: "3 months",
        skills: ["Impact analysis techniques","Advanced data analysis methods","Communication skills for policy advocacy","Research methodologies","Policy proposal writing"],
        projects: ["Impact Analysis", "Stakeholder Report"],
      },
      {
        phase: "Advanced Policy Work (6-12 months)",
        duration: "6 months",
        skills: ["Program evaluation techniques","Policy implementation strategies","Advanced stakeholder engagement","Critical thinking and analysis","Communication of policy recommendations"],
        projects: ["Program Evaluation Report", "Policy Proposal"],
      },
    ],
  },
  {
    id: "community-engagement",
    title: "Community Engagement Coordinator",
    icon: <User className="h-6 w-6" />,
    description: "Facilitate communication and programs to connect communities and organizations.",
    skills: [
      "Event Planning",
      "Communication",
      "Volunteer Coordination",
      "Program Management",
      "Public Speaking",
      "Conflict Resolution",
      "Data Analysis",
      "Social Media Management",
    ],
    avgSalary: "$45k - $85k",
    jobGrowth: "7% (Average)",
    difficulty: "Beginner",
    roadmap: [
      {
        phase: "Community Basics (0-3 months)",
        duration: "3 months",
        skills: ["Event coordination fundamentals","Communication skills","Volunteer management basics","Program management principles","Public speaking basics"],
        projects: ["Community Event", "Outreach Plan"],
      },
      {
        phase: "Program Management (3-6 months)",
        duration: "3 months",
        skills: ["Conflict resolution strategies","Community outreach techniques","Data analysis for community needs","Strategic planning for community programs","Engagement strategy development"],
        projects: ["Volunteer Program", "Conflict Mediation"],
      },
      {
        phase: "Advanced Engagement (6-12 months)",
        duration: "6 months",
        skills: ["Grant writing skills","Advanced program evaluation techniques","Strategic planning for community initiatives","Collaboration with local organizations","Communication of community impact"],
        projects: ["Engagement Strategy", "Grant Proposal"],
      },
    ],
  },
]

interface CareerNavigatorProps {
  onSignOut: () => void
}

export function CareerNavigator({ onSignOut }: CareerNavigatorProps) {
  const [currentStep, setCurrentStep] = useState<"expertise-assessment" | "recommendations" | "roadmap">("recommendations")
  const [userInfo, setUserInfo] = useState<UserInformation | null>(null)
  const [selectedPaths, setSelectedPaths] = useState<string[]>([])
  const [selectedPath, setSelectedPath] = useState<CareerPath | null>(null)
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    fetchUserInfo()
  }, [])

  const fetchUserInfo = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase.from("user_information").select("*").eq("id", user.id).single()
        if (error) throw error
        setUserInfo(data)

        if (!data.skill_expertise || Object.keys(data.skill_expertise).length === 0) {
          setCurrentStep("expertise-assessment")
        } else {
          setCurrentStep("recommendations")
          generateRecommendations(data)
          getAIRecommendations(data, user.id)
        }
      }
    } catch (error) {
      console.error("Error fetching user info:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleExpertiseComplete = async (expertise: Record<string, string>) => {
    if (userInfo) {
      const updatedUserInfo = { ...userInfo, skill_expertise: expertise }
      setUserInfo(updatedUserInfo)
      setCurrentStep("recommendations")
      generateRecommendations(updatedUserInfo)

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        getAIRecommendations(updatedUserInfo, user.id)
      }
    }
  }

  const getAIRecommendations = async (user: UserInformation, userId: string) => {
    setAiLoading(true)
    try {
      const response = await fetch("/api/ai-recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userProfile: {
            name: user.name,
            age: user.age,
            education_field: user.education_field,
            study_year: user.study_year,
            skills: user.skills,
            skill_expertise: user.skill_expertise || {},
            interests: user.interests || "",
            career_goals: user.career_goals || "",
            experience_level: user.experience_level || "",
            availability_hours_per_week: user.availability_hours_per_week || 10,
          },
          userId: userId,
        }),
      })
      if (response.ok) {
        const data = await response.json()
        setAiRecommendations(data.recommendations)
      }
    } catch (error) {
      console.error("Error getting AI recommendations:", error)
    } finally {
      setAiLoading(false)
    }
  }

  const generateRecommendations = (user: UserInformation) => {
    const suggested: string[] = []
    const userSkills = user.skills.map((skill) => skill.toLowerCase())
    const educationField = user.education_field.toLowerCase()
    const interests = user.interests?.toLowerCase() || ""

    if (interests.includes("web development") || interests.includes("ui/ux")) {
      suggested.push("frontend")
    }
    if (
      interests.includes("data science") ||
      interests.includes("machine learning") ||
      interests.includes("artificial intelligence")
    ) {
      suggested.push("datascience")
    }
    if (interests.includes("cybersecurity")) {
      suggested.push("cybersecurity")
    }
    if (interests.includes("mobile")) {
      suggested.push("mobile")
    }
    if (interests.includes("devops") || interests.includes("cloud")) {
      suggested.push("devops")
    }
    if (
      interests.includes("accounting") ||
      interests.includes("finance") ||
      interests.includes("business") ||
      interests.includes("corporate finance") ||
      interests.includes("investment banking") ||
      interests.includes("marketing strategies") ||
      interests.includes("e-commerce") ||
      interests.includes("supply chain management") ||
      interests.includes("business analytics")
    ) {
      suggested.push(
        "accounting",
        "corporate-finance",
        "investment-banking",
        "marketing-strategies",
        "e-commerce",
        "supply-chain-management",
        "business-analytics"
      )
    }
    if (
      interests.includes("content creation") ||
      interests.includes("writing") ||
      interests.includes("media") ||
      interests.includes("social research") ||
      interests.includes("cultural analysis") ||
      interests.includes("public relations") ||
      interests.includes("policy development") ||
      interests.includes("community engagement")
    ) {
      suggested.push(
        "content-creator",
        "social-researcher",
        "cultural-analyst",
        "public-relations",
        "policy-development",
        "community-engagement"
      )
    }

    if (educationField.includes("computer") || educationField.includes("information")) {
      if (!suggested.includes("frontend")) suggested.push("frontend")
      if (!suggested.includes("backend")) suggested.push("backend")
    }
    if (educationField.includes("commerce") || educationField.includes("business")) {
      if (!suggested.includes("accounting")) suggested.push("accounting")
      if (!suggested.includes("corporate-finance")) suggested.push("corporate-finance")
      if (!suggested.includes("investment-banking")) suggested.push("investment-banking")
      if (!suggested.includes("marketing-strategies")) suggested.push("marketing-strategies")
      if (!suggested.includes("e-commerce")) suggested.push("e-commerce")
      if (!suggested.includes("supply-chain-management")) suggested.push("supply-chain-management")
      if (!suggested.includes("business-analytics")) suggested.push("business-analytics")
    }
    if (educationField.includes("arts") || educationField.includes("humanities")) {
      if (!suggested.includes("content-creator")) suggested.push("content-creator")
      if (!suggested.includes("social-researcher")) suggested.push("social-researcher")
      if (!suggested.includes("cultural-analyst")) suggested.push("cultural-analyst")
      if (!suggested.includes("public-relations")) suggested.push("public-relations")
      if (!suggested.includes("policy-development")) suggested.push("policy-development")
      if (!suggested.includes("community-engagement")) suggested.push("community-engagement")
    }

    if (userSkills.some((skill) => ["html", "css", "javascript", "react"].includes(skill))) {
      if (!suggested.includes("frontend")) suggested.push("frontend")
    }
    if (userSkills.some((skill) => ["python", "java", "sql", "node.js"].includes(skill))) {
      if (!suggested.includes("backend")) suggested.push("backend")
      if (!suggested.includes("datascience")) suggested.push("datascience")
    }
    if (userSkills.some((skill) => ["cybersecurity", "linux"].includes(skill))) {
      if (!suggested.includes("cybersecurity")) suggested.push("cybersecurity")
    }
    if (userSkills.some((skill) => ["mobile", "android", "ios"].includes(skill))) {
      if (!suggested.includes("mobile")) suggested.push("mobile")
    }
    if (userSkills.some((skill) => ["cloud", "devops", "docker"].includes(skill))) {
      if (!suggested.includes("devops")) suggested.push("devops")
    }
    if (userSkills.some((skill) => ["data analysis", "machine learning", "statistics"].includes(skill))) {
      if (!suggested.includes("datascience")) suggested.push("datascience")
    }
    if (userSkills.some((skill) => ["accounting", "finance"].includes(skill))) {
      if (!suggested.includes("accounting")) suggested.push("accounting")
      if (!suggested.includes("corporate-finance")) suggested.push("corporate-finance")
    }
    if (userSkills.some((skill) => ["marketing", "advertising"].includes(skill))) {
      if (!suggested.includes("marketing")) suggested.push("marketing")
      if (!suggested.includes("marketing-strategies")) suggested.push("marketing-strategies")
    }
    if (userSkills.some((skill) => ["investment banking"].includes(skill))) {
      if (!suggested.includes("investment-banking")) suggested.push("investment-banking")
    }
    if (userSkills.some((skill) => ["e-commerce"].includes(skill))) {
      if (!suggested.includes("e-commerce")) suggested.push("e-commerce")
    }
    if (userSkills.some((skill) => ["supply chain management"].includes(skill))) {
      if (!suggested.includes("supply-chain-management")) suggested.push("supply-chain-management")
    }
    if (userSkills.some((skill) => ["business analytics"].includes(skill))) {
      if (!suggested.includes("business-analytics")) suggested.push("business-analytics")
    }
    if (userSkills.some((skill) => ["social research"].includes(skill))) {
      if (!suggested.includes("social-researcher")) suggested.push("social-researcher")
    }
    if (userSkills.some((skill) => ["cultural analysis"].includes(skill))) {
      if (!suggested.includes("cultural-analyst")) suggested.push("cultural-analyst")
    }
    if (userSkills.some((skill) => ["public relations"].includes(skill))) {
      if (!suggested.includes("public-relations")) suggested.push("public-relations")
    }
    if (userSkills.some((skill) => ["policy development"].includes(skill))) {
      if (!suggested.includes("policy-development")) suggested.push("policy-development")
    }
    if (userSkills.some((skill) => ["community engagement"].includes(skill))) {
      if (!suggested.includes("community-engagement")) suggested.push("community-engagement")
    }

    if (suggested.length < 3) {
      const remaining = careerPaths
        .filter((path) => !suggested.includes(path.id))
        .slice(0, 3 - suggested.length)
        .map((path) => path.id)
      suggested.push(...remaining)
    }

    setSelectedPaths(suggested)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (currentStep === "expertise-assessment" && userInfo) {
    return <SkillExpertiseAssessment userInfo={userInfo} onComplete={handleExpertiseComplete} />
  }

  if (currentStep === "roadmap" && selectedPath && userInfo) {
    return (
      <RoadmapTracker
        selectedPath={selectedPath}
        userInfo={userInfo}
        onBack={() => setCurrentStep("recommendations")}
        onSignOut={onSignOut}
      />
    )
  }

  if (currentStep === "recommendations") {
    const recommendedPaths = careerPaths.filter((path) => selectedPaths.includes(path.id))
    const otherPaths = careerPaths.filter((path) => !selectedPaths.includes(path.id))

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header with user info and controls */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {userInfo?.name}!</h1>
              <p className="text-gray-600 dark:text-gray-300">Here are your personalized career recommendations</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <User className="h-4 w-4" />
                <span>
                  {userInfo?.education_field} - Year {userInfo?.study_year}
                </span>
              </div>
              <ThemeToggle />
              <Button onClick={onSignOut} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {aiRecommendations.length > 0 && (
            <Card className="mb-8 border-2 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                  <Brain className="h-5 w-5" />
                  AI-Powered Career Recommendations
                </CardTitle>
                <CardDescription>Personalized suggestions based on your skill expertise analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
                  {aiRecommendations.map((rec, index) => (
                    <Card key={index} className="border border-purple-100 dark:border-purple-900">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{rec.careerPath}</CardTitle>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            <span className={`font-bold ${getMatchScoreColor(rec.matchScore)}`}>{rec.matchScore}%</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-gray-600 dark:text-gray-300">{rec.reasoning}</p>

                        {rec.strengthAreas && rec.strengthAreas.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2 flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              Your Strengths:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {rec.strengthAreas.map((strength, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs bg-green-100 text-green-800">
                                  {strength}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {rec.skillGaps && rec.skillGaps.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3 text-orange-600" />
                              Skills to Develop:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {rec.skillGaps.map((gap, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                                  {gap}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <p className="text-sm font-medium mb-2">Next Steps:</p>
                          <ul className="text-sm space-y-1">
                            {rec.nextSteps.map((step, stepIndex) => (
                              <li key={stepIndex} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="text-sm">
                            <strong>Timeline:</strong> {rec.timelineEstimate}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {aiLoading && (
            <Card className="mb-8 border-2 border-purple-200 dark:border-purple-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                  <span className="text-purple-700 dark:text-purple-300">Getting AI recommendations...</span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {userInfo?.skills && userInfo.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {userInfo.skills.map((skill) => {
                      const expertise = userInfo.skill_expertise?.[skill] || "beginner"
                      return (
                        <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                          {skill}
                          <span className="text-xs opacity-70">({expertise})</span>
                        </Badge>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {userInfo?.interests && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Interests</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">{userInfo.interests}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Recommended for You
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedPaths.map((path) => (
                <Card
                  key={path.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-blue-200 dark:border-blue-800"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {path.icon}
                        <CardTitle className="text-lg">{path.title}</CardTitle>
                      </div>
                      <Badge className={getDifficultyColor(path.difficulty)}>{path.difficulty}</Badge>
                    </div>
                    <CardDescription>{path.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Key Skills:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {path.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {path.skills.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{path.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-sm">
                        <p>
                          <strong>Salary:</strong> {path.avgSalary}
                        </p>
                        <p>
                          <strong>Growth:</strong> {path.jobGrowth}
                        </p>
                      </div>
                      <Button
                        onClick={() => {
                          setSelectedPath(path)
                          setCurrentStep("roadmap")
                        }}
                        className="w-full"
                      >
                        View Learning Roadmap
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Other Career Paths to Explore</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherPaths.map((path) => (
                <Card key={path.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {path.icon}
                        <CardTitle className="text-lg">{path.title}</CardTitle>
                      </div>
                      <Badge className={getDifficultyColor(path.difficulty)}>{path.difficulty}</Badge>
                    </div>
                    <CardDescription>{path.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Key Skills:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {path.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {path.skills.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{path.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-sm">
                        <p>
                          <strong>Salary:</strong> {path.avgSalary}
                        </p>
                        <p>
                          <strong>Growth:</strong> {path.jobGrowth}
                        </p>
                      </div>
                      <Button
                        onClick={() => {
                          setSelectedPath(path)
                          setCurrentStep("roadmap")
                        }}
                        variant="outline"
                        className="w-full"
                      >
                        View Learning Roadmap
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
