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

// Helper function to map career titles to IDs
const mapCareerTitleToId = (title: string): string | null => {
  const mapping: Record<string, string> = {
    "Frontend Developer": "frontend",
    "Backend Developer": "backend",
    "Data Scientist": "datascience",
    "Cybersecurity Specialist": "cybersecurity",
    "Mobile Developer": "mobile",
    "DevOps Engineer": "devops",
    "Corporate Finance Analyst": "corporate-finance",
    "Investment Banker": "investment-banking",
    "Marketing Strategist": "marketing-strategies",
    "E-commerce Specialist": "e-commerce",
    "Supply Chain Manager": "supply-chain-management",
    "Business Analyst": "business-analytics",
    "Social Researcher": "social-researcher",
    "Cultural Analyst": "cultural-analyst",
    "Public Relations Specialist": "public-relations",
    "Content Creator": "content-creator",
    "Policy Analyst": "policy-development",
    "Community Engagement Coordinator": "community-engagement",
  }

  return mapping[title] || null
}

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
      "Accessibility",
      "Cross-browser Compatibility",
      "State Management",
      "Form Handling",
      "Build Tools",
      "WebSockets",
      "CI/CD",
      "Interview Prep",
    ],
    avgSalary: "$70k - $120k",
    jobGrowth: "13% (Much faster than average)",
    difficulty: "Beginner",
    roadmap: [
      {
        phase: "Foundation (0-3 months)",
        duration: "3 months",
        skills: [
          "HTML5 semantic elements",
          "CSS3 basics (box model, flexbox, grid)",
          "JavaScript ES6+ fundamentals (variables, control flow, functions)",
          "Git and GitHub basics (version control)",
          "Responsive design principles and media queries",
          "Accessibility (a11y) fundamentals",
          "Cross-browser compatibility basics",
        ],
        projects: ["Personal Portfolio", "Landing Page", "Calculator App"],
      },
      {
        phase: "Framework Mastery (3-6 months)",
        duration: "3 months",
        skills: [
          "React.js components, hooks, and state management (useState, useEffect)",
          "Client-side routing (React Router)",
          "Fetching and handling APIs (RESTful)",
          "CSS frameworks (Tailwind CSS, Bootstrap)",
          "Component styling (CSS Modules, Styled Components)",
          "State Management with Redux or Zustand",
          "Handling forms (Formik, React Hook Form)",
        ],
        projects: ["Todo App", "Weather App", "E-commerce Frontend"],
      },
      {
        phase: "Advanced Skills (6-9 months)",
        duration: "3 months",
        skills: [
          "TypeScript fundamentals and integration with React",
          "Next.js for server-side rendering and static site generation",
          "Unit and integration testing (Jest, React Testing Library)",
          "Performance optimization techniques (code splitting, lazy loading)",
          "Progressive Web Apps (PWA) basics",
          "Modern build tools (Vite, Webpack)",
          "WebSockets for real-time UI (basic usage)",
        ],
        projects: ["Full-stack Blog", "Real-time Chat App", "Dashboard"],
      },
      {
        phase: "Job Ready (9-12 months)",
        duration: "3 months",
        skills: [
          "System design basics for frontend (component architecture, state management patterns)",
          "Deployment pipelines (Netlify, Vercel)",
          "Team collaboration using Git workflows (feature branching, pull requests)",
          "Code review and refactoring best practices",
          "Agile methodology basics and sprint planning",
          "CI/CD basics for frontend (GitHub Actions, Vercel)",
          "Interview prep and whiteboarding with UI challenges",
        ],
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
      "Web Frameworks",
      "Routing",
      "Full-Stack Frameworks",
      "ORMs and Migrations",
      "Framework Deployment",
      "Serverless Concepts",
    ],
    avgSalary: "$75k - $130k",
    jobGrowth: "22% (Much faster than average)",
    difficulty: "Intermediate",
    roadmap: [
      {
        phase: "Programming Fundamentals (0–4 months)",
        duration: "4 months",
        skills: [
          "One backend language (e.g., Python, Java, or Node.js) syntax and idioms",
          "Data structures and algorithms basics (arrays, linked lists, sorting)",
          "Git version control",
          "Linux command line basics",
          "Basic debugging and logging",
          "Understanding code modularity and functions",
          "Basic shell scripting and automation",
        ],
        projects: ["CLI Tools", "Simple Web Server", "File Processing Scripts"],
      },
      {
        phase: "Web Development (4–8 months)",
        duration: "4 months",
        skills: [
          "RESTful API design principles",
          "Database basics (SQL and NoSQL: schema design, queries)",
          "Authentication methods (JWT, OAuth)",
          "Unit and integration testing frameworks (e.g., pytest, Mocha)",
          "Environment configuration and management",
          "Postman or Insomnia for API testing",
          "Basic MVC and service layer design patterns",
          "Intro to Web Frameworks: Express.js (Node), Flask (Python)",
          "Routing, middleware, and request/response lifecycle",
        ],
        projects: ["REST API", "User Management System", "Blog Backend"],
      },
      {
        phase: "Advanced Backend (8–12 months)",
        duration: "4 months",
        skills: [
          "Microservices architecture patterns",
          "Caching strategies (Redis, Memcached)",
          "Message queues and async processing (RabbitMQ, Kafka)",
          "Containerization with Docker basics",
          "Logging, monitoring, and alerting basics",
          "Rate limiting and API throttling",
          "Error handling and resilience patterns (circuit breaker, retries)",
          "Full-stack frameworks: Django (Python), Next.js (Node)",
          "ORMs and migrations: Sequelize (Node), SQLAlchemy, Django ORM",
        ],
        projects: ["Microservices App", "Real-time API", "Scalable Backend"],
      },
      {
        phase: "Production Ready (12–15 months)",
        duration: "3 months",
        skills: [
          "Cloud deployment (AWS EC2, Elastic Beanstalk, or Azure App Services)",
          "Infrastructure monitoring and incident management",
          "Security best practices (OWASP Top 10)",
          "Performance tuning and profiling",
          "Continuous integration/deployment pipelines (Jenkins, GitHub Actions)",
          "Container orchestration with Kubernetes basics",
          "Observability with tools like Prometheus/Grafana",
          "Framework deployment & scaling: Django (Gunicorn + Nginx), Express (PM2), Next.js SSR static export",
          "Serverless & edge function concepts (e.g., Vercel, Cloud Functions)",
        ],
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
      "ML Frameworks",
      "ML Apps",
      "Model Serialization",
      "GPU Acceleration",
      "ML Pipelines",
      "ML APIs",
    ],
    avgSalary: "$85k - $150k",
    jobGrowth: "35% (Much faster than average)",
    difficulty: "Advanced",
    roadmap: [
      {
        phase: "Math & Programming (0–4 months)",
        duration: "4 months",
        skills: [
          "Python fundamentals (syntax, functions, loops, OOP)",
          "Core Python libraries (NumPy, Pandas)",
          "Statistics basics (mean, variance, distributions, z-score)",
          "Linear algebra (vectors, matrices, dot products)",
          "Calculus basics (gradients, partial derivatives, optimization)",
          "SQL querying basics for data retrieval and filtering",
          "Exploratory Data Analysis (EDA) foundations",
        ],
        projects: ["Data Cleaning & Exploration", "Statistical Reports with Pandas", "SQL Analytics Dashboard"],
      },
      {
        phase: "Machine Learning (4–8 months)",
        duration: "4 months",
        skills: [
          "Supervised & unsupervised learning (regression, classification, clustering)",
          "Feature engineering and preprocessing pipelines",
          "Model evaluation (confusion matrix, AUC-ROC, cross-validation)",
          "Data visualization (Matplotlib, Seaborn, Plotly)",
          "ML with scikit-learn: model training, hyperparameter tuning",
          "Intro to ML frameworks: TensorFlow & PyTorch basics",
          "Building simple ML apps with Streamlit or Gradio",
        ],
        projects: [
          "Regression Model for Housing Prices",
          "Customer Segmentation using Clustering",
          "Streamlit ML Dashboard",
        ],
      },
      {
        phase: "Advanced ML (8–12 months)",
        duration: "4 months",
        skills: [
          "Deep learning (neural networks, CNNs, RNNs) using TensorFlow/Keras or PyTorch",
          "Transfer learning and fine-tuning models",
          "Natural Language Processing (NLP) with spaCy & Hugging Face Transformers",
          "Computer vision with OpenCV and CNNs",
          "Big data handling with PySpark / Dask",
          "Model serialization & serving (ONNX, TorchScript)",
          "GPU acceleration and optimization (CUDA basics)",
        ],
        projects: [
          "Sentiment Analysis with Transformers",
          "Image Classification with CNN",
          "Real-time Object Detection App",
        ],
      },
      {
        phase: "Industry Ready (12–18 months)",
        duration: "6 months",
        skills: [
          "MLOps tools (MLflow for model tracking, DVC for data versioning)",
          "End-to-end pipeline building with Airflow or Prefect",
          "Containerization & deployment (Docker, FastAPI + Gunicorn)",
          "Cloud platforms for ML (AWS SageMaker, GCP Vertex AI, Azure ML)",
          "A/B testing and statistical experimentation",
          "Model monitoring and retraining workflows",
          "CI/CD for ML pipelines (GitHub Actions, GitLab CI)",
          "Building production-grade ML APIs and dashboards",
        ],
        projects: [
          "End-to-End ML Pipeline with Cloud Deployment",
          "Model Monitoring Dashboard",
          "Business KPI Forecasting App",
        ],
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
      "Packet Inspection",
      "Testing Environments",
      "Web App Testing",
      "Pentesting Environment",
      "Log Analysis",
      "Threat Intelligence",
      "GRC Tools",
      "Cloud Security Platforms",
    ],
    avgSalary: "$80k - $140k",
    jobGrowth: "33% (Much faster than average)",
    difficulty: "Intermediate",
    roadmap: [
      {
        phase: "Security Fundamentals (0–4 months)",
        duration: "4 months",
        skills: [
          "Basic networking (TCP/IP, UDP, DNS, DHCP, protocols, ports)",
          "Operating system security basics (Linux hardening, Windows policies)",
          "CIA Triad: Confidentiality, Integrity, Availability",
          "Command-line utilities (Netstat, Nmap, Whois, Curl)",
          "Introduction to vulnerability assessment",
          "Wireshark for packet inspection",
          "VirtualBox/VMware for isolated testing environments",
        ],
        projects: ["Network Scanning with Nmap", "System Hardening Checklist", "Security Audit on Local Machine"],
      },
      {
        phase: "Ethical Hacking (4–8 months)",
        duration: "4 months",
        skills: [
          "Penetration testing with tools (Nmap, Metasploit, Nikto)",
          "Web app security: OWASP Top 10 (XSS, SQLi, CSRF, etc.)",
          "Cryptography basics (AES, RSA, hashing, TLS)",
          "Vulnerability scanning (Nessus, OpenVAS)",
          "Exploit development basics",
          "Burp Suite for web app testing",
          "Kali Linux as a pentesting environment",
        ],
        projects: [
          "CTF (Capture the Flag) Challenges",
          "Web App Security Testing with Burp Suite",
          "Encryption/Decryption Scripts with Python",
        ],
      },
      {
        phase: "Advanced Security (8–12 months)",
        duration: "4 months",
        skills: [
          "Incident response process & tools (Volatility, CyberChef)",
          "Basic malware reverse engineering (strings, static/dynamic analysis)",
          "Cloud security practices (IAM, encryption, S3 permissions)",
          "Digital forensics (disk imaging, memory analysis)",
          "Security architecture & segmentation design",
          "SIEM tools: Splunk, Graylog for log analysis",
          "Threat intelligence tools: VirusTotal, Shodan",
        ],
        projects: [
          "Simulated Incident Response Drill",
          "Malware Behavior Analysis",
          "Cloud Security Audit using AWS Well-Architected Tool",
        ],
      },
      {
        phase: "Professional Ready (12–15 months)",
        duration: "3 months",
        skills: [
          "Compliance & legal frameworks (GDPR, HIPAA, PCI-DSS)",
          "Risk assessment & mitigation strategies",
          "Security certifications (CISSP, CEH, CompTIA Security+)",
          "Policy writing and security governance",
          "Advanced threat modeling (STRIDE, DREAD)",
          "GRC tools: OpenSCAP, Lynis",
          "Cloud security platforms: AWS Security Hub, Azure Defender",
        ],
        projects: [
          "Security Documentation & Governance Playbook",
          "Compliance Checklist (GDPR, HIPAA)",
          "Capstone Project: Enterprise Security Strategy",
        ],
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
      "User Authentication",
      "Emulators & Simulators",
      "Debugging Tools",
      "Styling Components",
      "Build Creation",
      "SQLite",
      "Background Services",
      "Deep Linking",
      "Crash Reporting",
      "App Store Optimization",
    ],
    avgSalary: "$75k - $125k",
    jobGrowth: "22% (Much faster than average)",
    difficulty: "Intermediate",
    roadmap: [
      {
        phase: "Mobile Basics (0–3 months)",
        duration: "3 months",
        skills: [
          "JavaScript (for React Native) or Dart (for Flutter) fundamentals",
          "Mobile UI/UX principles (Material Design, Human Interface Guidelines)",
          "Git version control and GitHub workflows",
          "Setting up development environments (Android Studio, Xcode, VS Code)",
          "App architecture basics and screen navigation",
          "Emulators & simulators configuration",
          "Debugging tools (Flutter DevTools, Chrome DevTools)",
        ],
        projects: ["Simple Calculator", "Weather App", "Note Taking App"],
      },
      {
        phase: "Framework Mastery (3–6 months)",
        duration: "3 months",
        skills: [
          "Cross-platform development with Flutter or React Native",
          "State management: Redux, Bloc (Flutter), or Context API",
          "HTTP requests & data fetching using Axios (RN) or Dio (Flutter)",
          "Navigation and routing: React Navigation or Flutter Navigator",
          "Unit and widget testing (Jest, Flutter Test)",
          "Styling components (Styled Components, Flutter Widgets)",
          "Debug builds and release builds creation",
        ],
        projects: ["Social Media App", "E-commerce App", "Fitness Tracker"],
      },
      {
        phase: "Advanced Features (6–9 months)",
        duration: "3 months",
        skills: [
          "Push notifications (Firebase Cloud Messaging, OneSignal)",
          "Offline data storage: SQLite, Hive (Flutter), AsyncStorage (React Native)",
          "Accessing device hardware (Camera, GPS, Biometrics)",
          "App performance optimization (lazy loading, rendering efficiency)",
          "App security: secure storage, input validation, code obfuscation",
          "Background services (WorkManager, background fetch)",
          "Deep linking and dynamic links",
        ],
        projects: ["Chat Application", "Photo Sharing App", "Location-based App"],
      },
      {
        phase: "Production Ready (9–12 months)",
        duration: "3 months",
        skills: [
          "App Store & Play Store deployment (Play Console, App Store Connect)",
          "Analytics integration (Firebase Analytics, Mixpanel)",
          "Monetization: in-app purchases, AdMob, RevenueCat",
          "Authentication using Firebase Auth, OAuth, or custom JWT",
          "CI/CD for mobile using Fastlane, Codemagic, GitHub Actions",
          "Crash reporting (Sentry, Firebase Crashlytics)",
          "App Store Optimization (ASO) techniques",
        ],
        projects: ["Published App", "App Store Optimization", "Portfolio Showcase"],
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
      "Remote Access Tools",
      "Process Monitoring",
      "Helm",
      "Container Registry",
      "Service Mesh",
      "Secrets Management",
      "Incident Response",
      "Blue/Green Deployments",
    ],
    avgSalary: "$85k - $145k",
    jobGrowth: "25% (Much faster than average)",
    difficulty: "Advanced",
    roadmap: [
      {
        phase: "Foundation (0–4 months)",
        duration: "4 months",
        skills: [
          "Linux fundamentals and command line usage (Ubuntu, CentOS)",
          "Networking basics (TCP/IP, DNS, HTTP, Load Balancing)",
          "Git and GitHub for version control and collaboration",
          "Basic scripting: Bash, Python",
          "Cloud computing foundations (AWS Free Tier, Azure Fundamentals)",
          "SSH, SCP, and remote access tools",
          "File system management and process monitoring",
        ],
        projects: [
          "Server Setup on Cloud",
          "Automation Scripts for File Backup",
          "Basic System Monitoring using shell scripts",
        ],
      },
      {
        phase: "Containerization (4–8 months)",
        duration: "4 months",
        skills: [
          "Docker (containers, Dockerfiles, docker-compose)",
          "Kubernetes basics (kubectl, pods, deployments, services)",
          "Understanding microservices deployment patterns",
          "CI/CD setup using Jenkins or GitHub Actions",
          "Infrastructure as Code using Terraform or Ansible",
          "Helm for Kubernetes package management",
          "Docker Hub and GitHub Container Registry (GHCR)",
        ],
        projects: [
          "Multi-Container App with Docker Compose",
          "Deploy Microservices on Minikube or k3s",
          "Publish Images to Docker Hub or GHCR",
        ],
      },
      {
        phase: "CI/CD & IaC (8–12 months)",
        duration: "4 months",
        skills: [
          "Advanced CI/CD (GitLab CI/CD, Jenkins Pipelines, GitHub Actions Matrix)",
          "Observability with Prometheus + Grafana, Loki (Logging)",
          "DevSecOps practices and secrets management (Vault, SOPS)",
          "Test automation integration in CI/CD workflows",
          "Configuration management (Chef, Puppet, SaltStack)",
          "Service mesh introduction (Istio, Linkerd)",
          "Secrets management and env protection",
        ],
        projects: [
          "End-to-End CI/CD Pipeline",
          "Infrastructure Provisioning with Terraform",
          "Monitoring Setup for Production Replica",
        ],
      },
      {
        phase: "Production Systems (12–18 months)",
        duration: "6 months",
        skills: [
          "Disaster recovery planning (snapshots, backups, blue-green deployments)",
          "Cloud cost optimization (auto-scaling, reserved instances, FinOps basics)",
          "Advanced networking (NAT, VPNs, Load Balancers, Service Discovery)",
          "Production security hardening (IAM, security groups, audit logs)",
          "Team workflows in Agile/Scrum (JIRA, Confluence)",
          "Incident response and runbooks",
          "Blue/Green and Canary Deployments",
        ],
        projects: [
          "Production-Ready Multi-Zone Architecture",
          "Cloud Cost Analyzer Dashboard",
          "Disaster Recovery Simulation & Response Plan",
        ],
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
      "FP&A Software",
      "Tax Awareness",
      "Cost Management",
      "Scenario Analysis",
      "Treasury Management",
      "Sustainability Reporting",
      "Collaboration Tools",
      "Data Visualization",
      "Cost Optimization",
    ],
    avgSalary: "$65k - $105k",
    jobGrowth: "7% (Average)",
    difficulty: "Intermediate",
    roadmap: [
      {
        phase: "Finance Fundamentals (0-3 months)",
        duration: "3 months",
        skills: [
          "Accounting principles and financial statements basics",
          "Excel basics and financial formulas",
          "Budgeting and forecasting",
          "Introduction to financial analysis",
          "Basic data visualization (charts and graphs)",
          "FP&A software introduction (Adaptive Insights, Anaplan)",
          "Tax and regulatory environment awareness",
          "Cost management tools basics",
        ],
        projects: ["Budget Report", "Financial Analysis"],
      },
      {
        phase: "Advanced Financial Analysis (3-6 months)",
        duration: "3 months",
        skills: [
          "Financial modeling (DCF, comparables)",
          "Valuation techniques",
          "Risk assessment methods",
          "Advanced Excel skills (pivot tables, macros)",
          "Use of Power BI or Tableau for reporting",
          "Scenario and sensitivity analysis using Excel and tools",
          "Treasury management basics (cash flow forecasting)",
          "Sustainability reporting fundamentals",
        ],
        projects: ["Valuation Report", "Risk Analysis"],
      },
      {
        phase: "Professional Ready (6-12 months)",
        duration: "6 months",
        skills: [
          "Corporate finance strategy and decision-making",
          "Mergers & Acquisitions basics",
          "Investor relations fundamentals",
          "Presentation and communication of financial information",
          "Regulatory environment understanding",
          "Cross-functional collaboration tools (MS Teams, Slack, Jira)",
          "Advanced data visualization dashboards",
          "Cost optimization and tax strategy integration",
        ],
        projects: ["Investment Proposal", "Financial Strategy Plan"],
      },
      {
        phase: "Executive Skills (12-15 months)",
        duration: "3 months",
        skills: [
          "Leadership and financial team management",
          "Advanced corporate governance",
          "Strategic financial planning",
          "M&A deal leadership and negotiations",
          "Global financial regulatory trends",
          "Advanced FP&A and financial systems mastery",
          "Stakeholder communication and influence",
          "Sustainability and ESG reporting leadership",
        ],
        projects: ["Corporate Strategy Plan", "Executive Financial Presentation"],
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
      "Financial Technology",
      "Excel Tools",
      "ESG Investing",
      "Data Analysis",
      "RegTech Tools",
      "CRM Platforms",
      "Data Storytelling",
      "ESG Integration",
      "Fintech Innovations",
      "Sustainability Financing",
    ],
    avgSalary: "$85k - $160k",
    jobGrowth: "9% (Faster than average)",
    difficulty: "Advanced",
    roadmap: [
      {
        phase: "Entry-Level Skills (0-4 months)",
        duration: "4 months",
        skills: [
          "Financial modeling basics",
          "Excel advanced functions and formulas",
          "Presentation skills (PowerPoint)",
          "Market research techniques",
          "Client relationship fundamentals",
          "Financial technology familiarity (blockchain basics, digital assets)",
          "Advanced Excel tools (Power Query, Power Pivot)",
          "Pitch automation tools",
          "ESG (Environmental, Social, Governance) investing basics",
        ],
        projects: ["Pitch Deck", "Market Analysis"],
      },
      {
        phase: "Transaction Management (4-8 months)",
        duration: "4 months",
        skills: [
          "Deal structuring and negotiation basics",
          "Due diligence processes",
          "Valuation techniques (comparable company analysis, precedent transactions)",
          "Financial analysis and reporting",
          "Risk assessment in transactions",
          "Data analysis with Python or R",
          "RegTech tools (compliance automation software)",
          "Deal sourcing and pipeline management using CRM platforms",
          "Soft skills: Emotional intelligence, negotiation under pressure",
        ],
        projects: ["Deal Memo", "Due Diligence Report"],
      },
      {
        phase: "Senior Level Skills (8-12 months)",
        duration: "4 months",
        skills: [
          "Client management and relationship building",
          "Regulatory compliance and reporting",
          "Advanced financial modeling and forecasting",
          "Strategic advisory skills",
          "Presentation of investment proposals",
          "Storytelling with data for investor presentations",
          "ESG investing integration in advisory",
          "Advanced negotiation and leadership skills",
        ],
        projects: ["Client Proposal", "Negotiation Simulation"],
      },
      {
        phase: "Leadership & Strategy (12-15 months)",
        duration: "3 months",
        skills: [
          "Leading deal teams and managing client portfolios",
          "Strategic business development and market positioning",
          "Advanced risk management and mitigation strategies",
          "Capital markets and financing structuring",
          "Mentorship and talent development",
          "Regulatory strategy and lobbying insights",
          "Innovations in fintech impacting investment banking",
          "Sustainability-linked financing and green bonds expertise",
        ],
        projects: ["Strategic Growth Plan", "Leadership Case Study", "Mentorship Program"],
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
      "Marketing Platforms",
      "CRM Tools",
      "Digital Marketing",
      "Marketing Automation",
      "ROI Measurement",
      "A/B Testing",
      "Video Marketing",
      "Marketing Analytics",
      "Cross-Channel Campaigns",
      "Customer Lifecycle",
      "Strategic Innovation",
    ],
    avgSalary: "$60k - $110k",
    jobGrowth: "11% (Faster than average)",
    difficulty: "Intermediate",
    roadmap: [
      {
        phase: "Marketing Basics (0-3 months)",
        duration: "3 months",
        skills: [
          "Consumer behavior principles",
          "Marketing fundamentals and concepts",
          "Data analytics basics using Excel and Google Sheets",
          "Introduction to SEO (Google Search Console, Moz)",
          "Competitive analysis techniques",
          "Basics of marketing platforms like HubSpot or Mailchimp",
          "Fundamentals of content creation tools (Canva, Adobe Spark)",
        ],
        projects: ["Marketing Plan Draft", "Competitive Analysis"],
      },
      {
        phase: "Strategy Development (3-6 months)",
        duration: "3 months",
        skills: [
          "Campaign planning and execution",
          "Brand positioning and management",
          "Content marketing essentials (blogging platforms, CMS basics like WordPress)",
          "Use of analytics tools (Google Analytics, Power BI, Tableau)",
          "Social media marketing basics (Facebook Ads Manager, Instagram Insights)",
          "Introduction to CRM tools (Salesforce, HubSpot CRM)",
        ],
        projects: ["Campaign Proposal", "Brand Strategy"],
      },
      {
        phase: "Advanced Marketing (6-12 months)",
        duration: "6 months",
        skills: [
          "Digital marketing strategies and optimization",
          "SEO advanced techniques and tools (Ahrefs, SEMrush)",
          "Email marketing campaigns using platforms like Mailchimp, SendGrid",
          "Marketing automation platforms (Marketo, HubSpot Automation)",
          "ROI measurement and marketing analytics reporting (Google Data Studio, Power BI)",
          "A/B testing and conversion rate optimization (Optimizely, Google Optimize)",
          "Advanced social media strategies (LinkedIn Ads, TikTok Ads)",
          "Basic knowledge of video marketing and editing tools (Adobe Premiere Pro, Final Cut Pro)",
        ],
        projects: ["Digital Campaign", "SEO Optimization Report"],
      },
      {
        phase: "Marketing Leadership & Analytics (12-15 months)",
        duration: "3 months",
        skills: [
          "Advanced marketing analytics and attribution modeling (Mixpanel, Amplitude)",
          "Cross-channel campaign orchestration and budget allocation",
          "Customer lifecycle and journey mapping (UXCam, Hotjar)",
          "Team leadership and stakeholder communication",
          "Advanced data visualization and storytelling with tools like Tableau, Power BI",
          "Strategic marketing innovation and emerging tech (AI-driven marketing tools like Jasper, ChatGPT for content)",
          "Privacy compliance and data governance (GDPR, CCPA)",
        ],
        projects: ["Integrated Marketing Strategy", "Leadership Presentation", "Marketing Dashboard"],
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
      "Payment Gateways",
      "Product Photography",
      "Conversion Rate Optimization",
      "Customer Engagement",
      "Inventory Management",
      "A/B Testing",
      "CRM Systems",
      "User Experience (UX)",
      "Omnichannel Marketing",
      "Personalization",
      "Logistics",
      "Customer Segmentation",
      "Marketing Automation",
      "Customer Support",
      "Growth Hacking",
      "Data Privacy",
      "Financial Modeling",
      "Team Leadership",
    ],
    avgSalary: "$55k - $100k",
    jobGrowth: "14% (Faster than average)",
    difficulty: "Intermediate",
    roadmap: [
      {
        phase: "E-commerce Fundamentals (0-3 months)",
        duration: "3 months",
        skills: [
          "Online merchandising basics",
          "Customer service principles",
          "SEO basics for e-commerce",
          "Digital marketing fundamentals",
          "Introduction to e-commerce platforms (Shopify, WooCommerce)",
          "Basics of payment gateways and checkout flow (Stripe, PayPal)",
          "Introduction to basic product photography and image editing (Canva, Adobe Photoshop)",
        ],
        projects: ["Online Store Setup", "SEO Audit"],
      },
      {
        phase: "Sales Optimization (3-6 months)",
        duration: "3 months",
        skills: [
          "Conversion rate optimization techniques",
          "Data analytics for e-commerce (Google Analytics, Hotjar)",
          "Marketing campaign planning and execution",
          "Customer engagement strategies (email marketing with Mailchimp, Klaviyo)",
          "Inventory management basics",
          "A/B testing for product pages (Optimizely, Google Optimize)",
          "Use of CRM systems for customer retention (HubSpot, Salesforce)",
        ],
        projects: ["Sales Report", "Marketing Campaign"],
      },
      {
        phase: "Advanced Strategies (6-12 months)",
        duration: "6 months",
        skills: [
          "User experience (UX) design principles",
          "Omnichannel marketing strategies",
          "Advanced SEO techniques for e-commerce (Ahrefs, SEMrush)",
          "Social media advertising strategies (Facebook Ads Manager, TikTok Ads)",
          "Data analysis tools for e-commerce insights (Power BI, Tableau)",
          "Personalization and recommendation engines basics",
          "Understanding logistics and supply chain management software (ShipStation, TradeGecko)",
        ],
        projects: ["UX Report", "Inventory System Plan"],
      },
      {
        phase: "E-commerce Leadership & Growth (12-15 months)",
        duration: "3 months",
        skills: [
          "Advanced customer segmentation and targeting (Segment, Google Analytics 4)",
          "Scaling marketing automation and workflows (HubSpot, Marketo)",
          "Omnichannel customer support and chatbots (Zendesk, Drift)",
          "Growth hacking strategies and viral marketing",
          "Data privacy and security compliance (PCI-DSS, GDPR)",
          "Financial modeling for e-commerce businesses",
          "Team leadership and cross-functional collaboration",
        ],
        projects: ["Growth Strategy Plan", "Leadership Presentation", "Automated Marketing Workflow"],
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
      "Supply Chain Software",
      "Transportation Management",
      "Forecasting Techniques",
      "Supplier Negotiation",
      "Risk Management",
      "Six Sigma",
      "Warehouse Management",
      "Supply Chain Strategy",
      "Performance Measurement",
      "Sustainability Practices",
      "Network Design",
      "Blockchain",
      "Digital Transformation",
      "AI Applications",
      "Change Management",
      "Global Trade",
      "Circular Supply Chains",
      "Vendor Management",
    ],
    avgSalary: "$65k - $110k",
    jobGrowth: "8% (Average)",
    difficulty: "Intermediate",
    roadmap: [
      {
        phase: "Supply Chain Basics (0-3 months)",
        duration: "3 months",
        skills: [
          "Inventory management fundamentals",
          "Logistics principles and practices",
          "Basic data analysis skills (Excel, SQL basics)",
          "Supplier relationship management basics",
          "Introduction to ERP systems (SAP, Oracle)",
          "Introduction to supply chain software tools (Fishbowl, NetSuite)",
          "Basics of transportation management systems (TMS)",
        ],
        projects: ["Inventory Report", "Logistics Plan"],
      },
      {
        phase: "Process Optimization (3-6 months)",
        duration: "3 months",
        skills: [
          "Demand forecasting techniques (using Excel, R, or Python)",
          "Lean management principles",
          "Supplier negotiation strategies",
          "Risk management in supply chains",
          "Data analysis for supply chain optimization (Power BI, Tableau)",
          "Introduction to Six Sigma concepts",
          "Basics of warehouse management systems (WMS)",
        ],
        projects: ["Forecast Model", "Supplier Analysis"],
      },
      {
        phase: "Advanced Management (6-12 months)",
        duration: "6 months",
        skills: [
          "Advanced ERP system usage (SAP modules, Oracle SCM Cloud)",
          "Project management skills (using MS Project, Jira)",
          "Supply chain strategy development",
          "Performance measurement and KPIs",
          "Sustainability practices in supply chain management",
          "Supply chain network design and optimization",
          "Introduction to blockchain in supply chain",
        ],
        projects: ["Process Improvement Plan", "Risk Mitigation Strategy"],
      },
      {
        phase: "Leadership & Innovation in Supply Chain (12-15 months)",
        duration: "3 months",
        skills: [
          "Supply chain digital transformation and automation (RPA tools like UiPath)",
          "Advanced analytics and AI applications in supply chains",
          "Change management and leadership skills",
          "Global trade compliance and regulations",
          "Sustainable and circular supply chain models",
          "Vendor and contract management software (Coupa, Ivalua)",
          "Cross-functional team collaboration and communication",
        ],
        projects: ["Digital Transformation Roadmap", "Sustainability Initiative", "Leadership Case Study"],
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
      "Business Process Mapping",
      "Requirement Gathering",
      "Analytical Techniques",
      "Business Case Development",
      "Data Storytelling",
      "Predictive Analytics",
      "Stakeholder Management",
      "Project Management",
      "Business Process Modeling (BPMN)",
      "R or Python",
      "Dashboard Automation",
      "Change Management",
      "Strategic Business Analysis",
      "Business Architecture",
    ],
    avgSalary: "$65k - $110k",
    jobGrowth: "11% (Faster than average)",
    difficulty: "Intermediate",
    roadmap: [
      {
        phase: "Business Fundamentals (0-3 months)",
        duration: "3 months",
        skills: [
          "Business process mapping and analysis",
          "Data visualization basics (Excel, Tableau)",
          "Stakeholder communication skills",
          "Introduction to SQL for data retrieval",
          "Reporting basics",
          "Introduction to tools like Microsoft Visio and Lucidchart",
          "Basic knowledge of CRM systems (Salesforce basics)",
        ],
        projects: ["Business Report", "Dashboard Creation"],
      },
      {
        phase: "Analytical Techniques (3-6 months)",
        duration: "3 months",
        skills: [
          "Requirement gathering and documentation",
          "Process improvement methodologies (Lean, Six Sigma)",
          "Advanced data analysis techniques",
          "Use of analytical tools (Power BI, Tableau)",
          "Business case development",
          "Data storytelling and presentation skills",
          "Familiarity with JIRA or Confluence for requirement tracking",
        ],
        projects: ["SQL Queries", "Process Map"],
      },
      {
        phase: "Advanced Analytics (6-12 months)",
        duration: "6 months",
        skills: [
          "Predictive analytics techniques",
          "Stakeholder management and engagement",
          "Project management skills (Agile, Scrum basics)",
          "Advanced SQL querying",
          "Business process modeling (BPMN)",
          "Introduction to R or Python for data analysis",
          "Use of dashboard automation tools (Power Automate, Zapier)",
        ],
        projects: ["Forecast Model", "Project Plan"],
      },
      {
        phase: "Leadership & Strategic Impact (12-15 months)",
        duration: "3 months",
        skills: [
          "Change management and organizational behavior",
          "Strategic business analysis and planning",
          "Advanced stakeholder engagement and conflict resolution",
          "Business architecture and capability mapping",
          "Use of advanced BA tools (Enterprise Architect, Balsamiq)",
          "Developing business strategy alignment",
          "Cross-team collaboration and leadership skills",
        ],
        projects: ["Strategic Plan", "Leadership Case Study", "Portfolio Presentation"],
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
      "Policy Analysis",
      "Research Project Management",
      "Communication of Research",
      "Grant Writing",
      "Systematic Review",
      "Academic Publishing",
      "Research Ethics",
      "Supervising Research",
      "Science Communication",
      "LaTeX",
      "Data Sharing",
    ],
    avgSalary: "$45k - $85k",
    jobGrowth: "6% (Average)",
    difficulty: "Intermediate",
    roadmap: [
      {
        phase: "Research Basics (0-3 months)",
        duration: "3 months",
        skills: [
          "Research methods and design principles",
          "Data collection techniques (surveys, interviews)",
          "Basic statistical analysis",
          "Report writing fundamentals",
          "Qualitative research methods",
          "Introduction to tools like Microsoft Excel and Google Forms for data collection",
          "Basics of reference management tools (Zotero, Mendeley)",
        ],
        projects: ["Survey Design", "Field Study"],
      },
      {
        phase: "Data Analysis (3-6 months)",
        duration: "3 months",
        skills: [
          "Statistical software usage (SPSS, R)",
          "Data visualization techniques",
          "Writing research reports and presentations",
          "Quantitative research methods",
          "Ethical considerations in research",
          "Introduction to Python for data analysis (Pandas, Matplotlib)",
          "Use of qualitative analysis software (NVivo, ATLAS.ti)",
        ],
        projects: ["Data Report", "Presentation"],
      },
      {
        phase: "Advanced Research (6-12 months)",
        duration: "6 months",
        skills: [
          "Policy analysis techniques",
          "Advanced qualitative and quantitative methods",
          "Data interpretation and synthesis",
          "Research project management",
          "Communication of research findings",
          "Grant writing basics",
          "Systematic review and meta-analysis methods",
        ],
        projects: ["Research Paper", "Policy Brief"],
      },
      {
        phase: "Leadership & Publication (12-15 months)",
        duration: "3 months",
        skills: [
          "Academic publishing processes and journal selection",
          "Research ethics and compliance management",
          "Supervising research teams",
          "Advanced grant proposal writing",
          "Science communication to non-expert audiences",
          "Using LaTeX for professional document preparation",
          "Data sharing and open science practices",
        ],
        projects: ["Published Paper", "Research Symposium Presentation"],
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
      "Policy Impact Analysis",
      "Cross-Cultural Communication",
      "Consulting Report Writing",
      "Qualitative Coding",
      "Research Ethics",
      "Visualization Tools",
      "Audio/Video Editing",
      "Advocacy",
      "Workshop Facilitation",
      "Collaborative Tools",
      "Science Communication",
    ],
    avgSalary: "$50k - $90k",
    jobGrowth: "5% (Average)",
    difficulty: "Intermediate",
    roadmap: [
      {
        phase: "Foundations (0-3 months)",
        duration: "3 months",
        skills: [
          "Cultural theory basics",
          "Ethnographic research methods",
          "Qualitative analysis techniques",
          "Report writing fundamentals",
          "Data analysis basics",
          "Introduction to qualitative data software (NVivo, MAXQDA)",
          "Basic use of Microsoft Excel or Google Sheets for data organization",
        ],
        projects: ["Field Notes", "Cultural Report"],
      },
      {
        phase: "Analysis Techniques (3-6 months)",
        duration: "3 months",
        skills: [
          "Media analysis methods",
          "Qualitative coding techniques",
          "Presentation skills for research findings",
          "Critical thinking and analysis",
          "Research ethics",
          "Using visualization tools (Tableau, Power BI) for cultural data",
          "Basic audio/video editing tools for media analysis (Audacity, Adobe Premiere Rush)",
        ],
        projects: ["Content Analysis", "Presentation"],
      },
      {
        phase: "Applied Analysis (6-12 months)",
        duration: "6 months",
        skills: [
          "Policy impact analysis",
          "Cross-cultural communication skills",
          "Consulting report writing",
          "Advanced qualitative research methods",
          "Data interpretation and application",
          "Grant writing basics",
          "Advanced data visualization (D3.js, R ggplot2)",
        ],
        projects: ["Consulting Report", "Policy Recommendations"],
      },
      {
        phase: "Leadership & Advocacy (12-15 months)",
        duration: "3 months",
        skills: [
          "Leading cultural research projects",
          "Advocacy and policy influencing techniques",
          "Publishing and disseminating research findings",
          "Workshop and training facilitation",
          "Use of collaborative tools (Slack, Trello, Miro) for team projects",
          "Science communication for public engagement",
        ],
        projects: ["Published Article", "Advocacy Campaign"],
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
      "Media Writing",
      "Press Release Writing",
      "Event Management",
      "Social Media Basics",
      "PR Tools",
      "Content Design",
      "Social Media Strategy",
      "PR Campaigns",
      "Brand Reputation Management",
      "Strategic Communication",
      "Stakeholder Engagement",
      "Digital PR",
      "Influencer Marketing",
      "Crisis Simulation",
    ],
    avgSalary: "$55k - $95k",
    jobGrowth: "7% (Average)",
    difficulty: "Intermediate",
    roadmap: [
      {
        phase: "PR Basics (0-3 months)",
        duration: "3 months",
        skills: [
          "Media writing fundamentals",
          "Press release writing",
          "Event management basics",
          "Communication skills",
          "Social media basics",
          "Using PR tools like Cision or Meltwater for media monitoring",
          "Basic Canva or Adobe Express for content design",
        ],
        projects: ["Press Release", "Event Plan"],
      },
      {
        phase: "Communication Strategies (3-6 months)",
        duration: "3 months",
        skills: [
          "Crisis communication planning",
          "Social media strategy development",
          "Content creation for PR campaigns",
          "Media relations skills",
          "Analytical skills for PR measurement",
          "Using Hootsuite or Buffer for social media scheduling and analytics",
          "Google Analytics basics for campaign tracking",
        ],
        projects: ["Social Campaign", "Crisis Plan"],
      },
      {
        phase: "Advanced PR (6-12 months)",
        duration: "6 months",
        skills: [
          "Brand reputation management",
          "Advanced media relations techniques",
          "Strategic communication planning",
          "Measurement and evaluation of PR campaigns",
          "Stakeholder engagement strategies",
          "Advanced use of media monitoring platforms (Mention, Brandwatch)",
          "SEO basics for PR content optimization",
        ],
        projects: ["Reputation Management Plan", "Media Kit"],
      },
      {
        phase: "Digital & Leadership in PR (12-15 months)",
        duration: "3 months",
        skills: [
          "Leading PR teams and campaigns",
          "Integration of digital PR and influencer marketing",
          "Crisis simulation and response leadership",
          "Advanced data-driven PR strategies",
          "Using collaboration tools (Slack, Trello) for PR project management",
          "Video content creation and editing (Adobe Premiere Pro, Final Cut Pro)",
        ],
        projects: ["Digital PR Campaign", "Leadership Presentation"],
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
      "Writing Fundamentals",
      "Social Media Platforms",
      "Video Editing Skills",
      "Content Planning",
      "Graphics Creation",
      "Audience Engagement",
      "Content Calendar",
      "Content Performance",
      "Brand Storytelling",
      "Marketing Teams",
      "Monetization Strategies",
      "Content Management Systems",
      "A/B Testing",
      "Content Leadership",
      "AI Tools",
      "Voice Search Optimization",
      "Video Live Streaming",
    ],
    avgSalary: "$40k - $80k",
    jobGrowth: "15% (Faster than average)",
    difficulty: "Beginner",
    roadmap: [
      {
        phase: "Content Basics (0-3 months)",
        duration: "3 months",
        skills: [
          "Writing fundamentals (grammar, style)",
          "Social media platform basics",
          "Basic video editing skills",
          "Content planning and strategy",
          "SEO basics for content",
          "Using Canva or Adobe Spark for graphics creation",
          "Basic use of video editors like iMovie or Shotcut",
        ],
        projects: ["Blog Posts", "Social Media Posts"],
      },
      {
        phase: "Intermediate Skills (3-6 months)",
        duration: "3 months",
        skills: [
          "Advanced video editing techniques",
          "SEO for content optimization",
          "Audience engagement strategies",
          "Content calendar development",
          "Analytics tools for content performance",
          "Using tools like Google Analytics and TubeBuddy",
          "Intermediate use of Adobe Premiere Pro or DaVinci Resolve",
        ],
        projects: ["YouTube Videos", "Podcast Episodes"],
      },
      {
        phase: "Advanced Content Creation (6-12 months)",
        duration: "6 months",
        skills: [
          "Content strategy development",
          "Advanced analytics for content insights",
          "Brand storytelling techniques",
          "Collaboration with marketing teams",
          "Monetization strategies for content",
          "Using content management systems (WordPress, HubSpot)",
          "A/B testing tools for content optimization (Optimizely, VWO)",
        ],
        projects: ["Content Calendar", "Analytics Report"],
      },
      {
        phase: "Content Leadership & Emerging Tech (12-15 months)",
        duration: "3 months",
        skills: [
          "Leading content teams and projects",
          "Incorporating AI tools for content creation (ChatGPT, Jasper.ai)",
          "Advanced SEO and voice search optimization",
          "Video live streaming and webinar production",
          "Data-driven decision making for content",
          "Using project management tools (Asana, Trello)",
        ],
        projects: ["Content Leadership Plan", "Emerging Tech Demo"],
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
      "Policy Research",
      "Legislative Process",
      "Impact Analysis",
      "Policy Advocacy",
      "Research Methodologies",
      "Policy Proposal Writing",
      "Program Evaluation",
      "Policy Implementation",
      "Policy Recommendations",
      "Project Management",
      "Policy Simulation",
      "Policy Design",
      "Digital Advocacy",
    ],
    avgSalary: "$55k - $100k",
    jobGrowth: "6% (Average)",
    difficulty: "Intermediate",
    roadmap: [
      {
        phase: "Policy Basics (0-3 months)",
        duration: "3 months",
        skills: [
          "Policy research fundamentals",
          "Understanding the legislative process",
          "Basic data analysis skills",
          "Report writing basics",
          "Stakeholder engagement fundamentals",
          "Using data tools like Excel and Google Sheets",
          "Familiarity with online legislative tracking tools (e.g., GovTrack)",
        ],
        projects: ["Policy Brief", "Legislative Review"],
      },
      {
        phase: "Analysis & Development (3-6 months)",
        duration: "3 months",
        skills: [
          "Impact analysis techniques",
          "Advanced data analysis methods",
          "Communication skills for policy advocacy",
          "Research methodologies",
          "Policy proposal writing",
          "Using statistical software (R, Stata) for policy data",
          "Policy visualization tools (Tableau, Power BI)",
        ],
        projects: ["Impact Analysis", "Stakeholder Report"],
      },
      {
        phase: "Advanced Policy Work (6-12 months)",
        duration: "6 months",
        skills: [
          "Program evaluation techniques",
          "Policy implementation strategies",
          "Advanced stakeholder engagement",
          "Critical thinking and analysis",
          "Communication of policy recommendations",
          "Project management tools (Asana, Trello)",
          "Policy simulation and modeling tools (Simul8, AnyLogic)",
        ],
        projects: ["Program Evaluation Report", "Policy Proposal"],
      },
      {
        phase: "Policy Leadership & Innovation (12-15 months)",
        duration: "3 months",
        skills: [
          "Leading policy teams and projects",
          "Incorporating AI and data science in policy design",
          "Digital advocacy and public engagement strategies",
          "Evaluating emerging policy issues (climate, tech regulation)",
          "Advanced communication and negotiation skills",
          "Using collaboration platforms (Slack, Microsoft Teams)",
        ],
        projects: ["Policy Leadership Plan", "Innovative Policy Project"],
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
      "Event Coordination",
      "Volunteer Management",
      "Program Management",
      "Community Outreach",
      "Strategic Planning",
      "Engagement Strategy",
      "Grant Writing",
      "Program Evaluation",
      "Community Initiatives",
      "Local Organizations",
      "Community Impact",
      "Digital Advocacy",
      "Fundraising",
      "Donor Engagement",
      "Stakeholder Communication",
    ],
    avgSalary: "$45k - $85k",
    jobGrowth: "7% (Average)",
    difficulty: "Beginner",
    roadmap: [
      {
        phase: "Community Basics (0-3 months)",
        duration: "3 months",
        skills: [
          "Event coordination fundamentals",
          "Communication skills",
          "Volunteer management basics",
          "Program management principles",
          "Public speaking basics",
          "Using event management tools (Eventbrite, Meetup)",
          "Basic CRM software usage (Salesforce, HubSpot)",
        ],
        projects: ["Community Event", "Outreach Plan"],
      },
      {
        phase: "Program Management (3-6 months)",
        duration: "3 months",
        skills: [
          "Conflict resolution strategies",
          "Community outreach techniques",
          "Data analysis for community needs",
          "Strategic planning for community programs",
          "Engagement strategy development",
          "Using data tools (Excel, Google Sheets)",
          "Project management software (Trello, Asana)",
        ],
        projects: ["Volunteer Program", "Conflict Mediation"],
      },
      {
        phase: "Advanced Engagement (6-12 months)",
        duration: "6 months",
        skills: [
          "Grant writing skills",
          "Advanced program evaluation techniques",
          "Strategic planning for community initiatives",
          "Collaboration with local organizations",
          "Communication of community impact",
          "Using survey and feedback tools (SurveyMonkey, Google Forms)",
          "Social media management platforms (Hootsuite, Buffer)",
        ],
        projects: ["Engagement Strategy", "Grant Proposal"],
      },
      {
        phase: "Community Leadership & Digital Advocacy (12-15 months)",
        duration: "3 months",
        skills: [
          "Leading community programs and teams",
          "Digital advocacy and campaign management",
          "Fundraising strategies and donor engagement",
          "Advanced stakeholder communication",
          "Leveraging analytics for community impact",
          "Collaboration and communication tools (Slack, Microsoft Teams)",
        ],
        projects: ["Leadership Plan", "Digital Advocacy Campaign"],
      },
    ],
  },
]

interface CareerNavigatorProps {
  onSignOut: () => void
}

export function CareerNavigator({ onSignOut }: CareerNavigatorProps) {
  const [currentStep, setCurrentStep] = useState<"expertise-assessment" | "recommendations" | "roadmap">(
    "recommendations",
  )
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
      const availableCourses = [
        "Community Engagement Coordinator",
        "Policy Analyst",
        "Content Creator",
        "Public Relations Specialist",
        "Cultural Analyst",
        "Social Researcher",
        "Business Analyst",
        "Supply Chain Manager",
        "E-commerce Specialist",
        "Marketing Strategist",
        "Investment Banker",
        "Corporate Finance Analyst",
        "Mobile Developer",
        "DevOps Engineer",
        "Cybersecurity Specialist",
        "Data Scientist",
        "Backend Developer",
        "Frontend Developer",
      ]

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
          availableCourses: availableCourses,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        let finalRecommendations = data.recommendations.filter((rec) => availableCourses.includes(rec.careerPath))

        // If we have less than 3 recommendations, add interest-based ones
        if (finalRecommendations.length < 3) {
          const interestBasedRecommendations = generateInterestBasedRecommendations(
            user,
            availableCourses,
            finalRecommendations,
          )
          finalRecommendations = [...finalRecommendations, ...interestBasedRecommendations]
        }

        // Limit to 3 recommendations
        setAiRecommendations(finalRecommendations.slice(0, 3))
      }
    } catch (error) {
      console.error("Error getting AI recommendations:", error)
    } finally {
      setAiLoading(false)
    }
  }

  // Add this new function to generate interest-based recommendations
  const generateInterestBasedRecommendations = (
    user: UserInformation,
    availableCourses: string[],
    existingRecs: any[],
  ) => {
    const existingCareerPaths = existingRecs.map((rec) => rec.careerPath)
    const interests = user.interests?.toLowerCase() || ""
    const educationField = user.education_field.toLowerCase()
    const userSkills = user.skills.map((skill) => skill.toLowerCase())

    const careerMappings = [
      {
        career: "Frontend Developer",
        interestKeywords: ["web development", "frontend", "ui/ux", "design", "user interface"],
        skillKeywords: ["html", "css", "javascript", "react", "vue", "angular", "typescript"],
        reasoning:
          "Your combination of web development interests and frontend skills makes this an excellent career match.",
      },
      {
        career: "Backend Developer",
        interestKeywords: ["backend", "server", "api", "database", "system architecture"],
        skillKeywords: ["python", "java", "node.js", "sql", "mongodb", "postgresql", "express"],
        reasoning:
          "Your technical interests and backend programming skills align perfectly with server-side development.",
      },
      {
        career: "Data Scientist",
        interestKeywords: ["data science", "machine learning", "ai", "analytics", "statistics", "research"],
        skillKeywords: ["python", "r", "sql", "pandas", "numpy", "machine learning", "statistics", "data analysis"],
        reasoning:
          "Your data-focused interests combined with analytical and programming skills make data science ideal.",
      },
      {
        career: "Cybersecurity Specialist",
        interestKeywords: ["cybersecurity", "security", "ethical hacking", "network security", "privacy"],
        skillKeywords: ["linux", "networking", "security", "penetration testing", "cryptography", "firewall"],
        reasoning: "Your security interests and technical skills provide a strong foundation for cybersecurity work.",
      },
      {
        career: "Mobile Developer",
        interestKeywords: ["mobile", "app development", "android", "ios", "mobile apps"],
        skillKeywords: ["react native", "flutter", "swift", "kotlin", "java", "dart", "mobile development"],
        reasoning: "Your mobile development interests and relevant programming skills align with mobile app creation.",
      },
      {
        career: "DevOps Engineer",
        interestKeywords: ["devops", "cloud", "automation", "infrastructure", "deployment"],
        skillKeywords: ["docker", "kubernetes", "aws", "azure", "jenkins", "git", "linux", "automation"],
        reasoning: "Your infrastructure interests and automation skills make DevOps an excellent career path.",
      },
      {
        career: "Investment Banker",
        interestKeywords: ["finance", "investment", "banking", "financial markets", "trading"],
        skillKeywords: ["financial analysis", "excel", "financial modeling", "accounting", "economics"],
        reasoning:
          "Your financial interests combined with analytical and business skills suit investment banking well.",
      },
      {
        career: "Corporate Finance Analyst",
        interestKeywords: ["corporate finance", "financial analysis", "budgeting", "financial planning"],
        skillKeywords: ["excel", "financial modeling", "accounting", "data analysis", "financial analysis"],
        reasoning: "Your finance interests and analytical skills align perfectly with corporate financial analysis.",
      },
      {
        career: "Marketing Strategist",
        interestKeywords: ["marketing", "digital marketing", "brand management", "strategy", "advertising"],
        skillKeywords: ["marketing", "seo", "social media", "analytics", "content creation", "advertising"],
        reasoning: "Your marketing interests and relevant skills make strategic marketing an excellent fit.",
      },
      {
        career: "E-commerce Specialist",
        interestKeywords: ["e-commerce", "online business", "digital sales", "retail", "online marketing"],
        skillKeywords: ["digital marketing", "seo", "analytics", "customer service", "online sales"],
        reasoning: "Your e-commerce interests and digital skills align well with online business management.",
      },
      {
        career: "Supply Chain Manager",
        interestKeywords: ["supply chain", "logistics", "operations", "inventory", "procurement"],
        skillKeywords: ["data analysis", "project management", "logistics", "inventory management", "excel"],
        reasoning: "Your operational interests and analytical skills suit supply chain optimization perfectly.",
      },
      {
        career: "Business Analyst",
        interestKeywords: ["business analysis", "process improvement", "data analysis", "consulting"],
        skillKeywords: ["data analysis", "excel", "sql", "business analysis", "project management", "reporting"],
        reasoning: "Your analytical interests and data skills make business analysis an ideal career choice.",
      },
      {
        career: "Content Creator",
        interestKeywords: ["content creation", "writing", "blogging", "social media", "video", "creative"],
        skillKeywords: ["writing", "social media", "video editing", "content creation", "seo", "marketing"],
        reasoning: "Your creative interests and content skills align perfectly with content creation careers.",
      },
      {
        career: "Public Relations Specialist",
        interestKeywords: ["public relations", "communications", "media relations", "marketing", "branding"],
        skillKeywords: ["communication", "writing", "social media", "marketing", "public speaking"],
        reasoning: "Your communication interests and relevant skills make PR an excellent career match.",
      },
      {
        career: "Social Researcher",
        interestKeywords: ["social research", "sociology", "human behavior", "research", "psychology"],
        skillKeywords: ["research", "data analysis", "statistics", "survey design", "writing", "spss"],
        reasoning: "Your research interests and analytical skills align well with social research methodologies.",
      },
      {
        career: "Cultural Analyst",
        interestKeywords: ["cultural analysis", "anthropology", "cultural studies", "sociology", "research"],
        skillKeywords: ["research", "writing", "data analysis", "cultural studies", "qualitative analysis"],
        reasoning: "Your cultural interests and research skills make cultural analysis a strong career fit.",
      },
      {
        career: "Policy Analyst",
        interestKeywords: ["policy", "government", "public policy", "legislation", "politics", "governance"],
        skillKeywords: ["research", "data analysis", "writing", "policy analysis", "statistics", "communication"],
        reasoning: "Your policy interests and analytical skills align perfectly with policy development and analysis.",
      },
      {
        career: "Community Engagement Coordinator",
        interestKeywords: ["community", "volunteer", "social work", "engagement", "nonprofit", "outreach"],
        skillKeywords: ["communication", "event planning", "project management", "social media", "public speaking"],
        reasoning: "Your community interests and interpersonal skills make community engagement an ideal career.",
      },
    ]

    const matchedCareers = []

    // Score each career based on interest + skill alignment
    for (const mapping of careerMappings) {
      if (availableCourses.includes(mapping.career) && !existingCareerPaths.includes(mapping.career)) {
        let score = 0
        let interestMatch = false
        let skillMatch = false

        // Check interest alignment (30 points max)
        const interestMatches = mapping.interestKeywords.filter((keyword) => interests.includes(keyword))
        if (interestMatches.length > 0) {
          interestMatch = true
          score += Math.min(30, interestMatches.length * 10)
        }

        // Check skill alignment (50 points max)
        const skillMatches = mapping.skillKeywords.filter((keyword) =>
          userSkills.some((userSkill) => userSkill.includes(keyword) || keyword.includes(userSkill)),
        )
        if (skillMatches.length > 0) {
          skillMatch = true
          score += Math.min(50, skillMatches.length * 10)
        }

        // Education field bonus (20 points max)
        if (educationField.includes("computer") || educationField.includes("information")) {
          if (
            [
              "Frontend Developer",
              "Backend Developer",
              "Data Scientist",
              "Cybersecurity Specialist",
              "Mobile Developer",
              "DevOps Engineer",
            ].includes(mapping.career)
          ) {
            score += 15
          }
        }
        if (educationField.includes("commerce") || educationField.includes("business")) {
          if (
            [
              "Business Analyst",
              "Marketing Strategist",
              "E-commerce Specialist",
              "Supply Chain Manager",
              "Corporate Finance Analyst",
              "Investment Banker",
            ].includes(mapping.career)
          ) {
            score += 15
          }
        }
        if (educationField.includes("arts") || educationField.includes("humanities")) {
          if (
            [
              "Content Creator",
              "Social Researcher",
              "Cultural Analyst",
              "Public Relations Specialist",
              "Policy Analyst",
              "Community Engagement Coordinator",
            ].includes(mapping.career)
          ) {
            score += 15
          }
        }

        // Only include careers that have both interest AND skill alignment (minimum threshold)
        if (interestMatch && skillMatch && score >= 40) {
          const strengthAreas = []
          const skillGaps = []

          // Determine strengths based on matches
          if (interestMatches.length > 0) {
            strengthAreas.push("Strong interest alignment")
          }
          if (skillMatches.length >= 2) {
            strengthAreas.push("Relevant technical skills")
          } else if (skillMatches.length === 1) {
            strengthAreas.push("Some relevant skills")
          }

          // Determine skill gaps
          const missingSkills = mapping.skillKeywords.filter(
            (keyword) => !userSkills.some((userSkill) => userSkill.includes(keyword) || keyword.includes(userSkill)),
          )
          if (missingSkills.length > 0) {
            skillGaps.push(...missingSkills.slice(0, 3))
          }

          matchedCareers.push({
            careerPath: mapping.career,
            matchScore: Math.min(95, 60 + Math.floor(score * 0.5)), // Convert to percentage (60-95%)
            reasoning: mapping.reasoning,
            strengthAreas: strengthAreas.length > 0 ? strengthAreas : ["Interest in the field"],
            skillGaps: skillGaps.length > 0 ? skillGaps : ["Industry-specific experience"],
            nextSteps: [
              "Research the field thoroughly",
              `Build projects using ${skillMatches.slice(0, 2).join(" and ")}`,
              "Connect with professionals in the field",
            ],
            timelineEstimate:
              skillMatches.length >= 2 ? "3-6 months to build proficiency" : "6-12 months to develop required skills",
            score: score,
          })
        }
      }
    }

    // Sort by score and return top 2
    return matchedCareers
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map(({ score, ...career }) => career) // Remove score from final result
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
        "business-analytics",
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
        "community-engagement",
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
