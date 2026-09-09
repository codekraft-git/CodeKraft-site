import { Globe2, Smartphone, Code2, PenTool, ShieldCheck, Cloud, Workflow, Layers3 } from "lucide-react";

export const navigation = ["Home", "Services", "Projects", "Products", "Security", "About", "Contact"];
export const services = [
  { title: "Web Development", icon: Globe2, description: "Fast, accessible websites and web applications, built around your business." },
  { title: "Mobile App Development", icon: Smartphone, description: "Thoughtful mobile experiences that feel natural on every screen." },
  { title: "Software Development", icon: Code2, description: "Dependable software that solves the problems behind your daily work." },
  { title: "UI/UX Design", icon: PenTool, description: "Clear interfaces, considered interactions, and a better path for every user." },
  { title: "Cybersecurity", icon: ShieldCheck, description: "Security assessments and practical improvements to protect what you build." },
  { title: "Cloud & Infrastructure", icon: Cloud, description: "A resilient foundation for deploying, operating, and growing your products." },
  { title: "Automation", icon: Workflow, description: "Connected systems that cut repetitive work and give your team time back." },
  { title: "Custom Digital Products", icon: Layers3, description: "Your idea, shaped into a useful product and engineered for real-world use." },
];

// Illustrative studio studies, explicitly identified in the UI. Replace with
// approved client work before marketing them as shipped projects.
export const projects = [
  {
    id: "learning-platform", number: "01", title: "A clearer way to learn.", name: "Learning platform",
    category: "WEB APPLICATION · EDUCATION", technologies: ["React", "TypeScript", "PostgreSQL"],
    description: "An education platform concept that connects course discovery, learning progress, and a focused student experience.",
    overview: "A product study exploring how a learning platform can make the next step obvious. The experience brings courses, lessons, and progress into one calm, accessible workspace.",
    scope: ["Course discovery and enrollment journeys", "A focused lesson and progress experience", "Responsive interface and reusable design system"],
    approach: "Start with the learner’s goals, reduce the steps between finding a course and learning, then build a consistent foundation for mobile and desktop.",
    visual: "learning",
  },
  {
    id: "operations-workspace", number: "02", title: "Complex work. Clear thinking.", name: "Operations workspace",
    category: "PRODUCT DESIGN · BUSINESS SOFTWARE", technologies: ["Next.js", "TypeScript", "API Design"],
    description: "A business workspace concept for bringing projects, priorities, and everyday operations into focus.",
    overview: "An interface study for teams managing work across disconnected tools. The concept brings project context, active tasks, and upcoming milestones into a single structured view.",
    scope: ["Project overview and task organization", "Team priorities and milestone planning", "Accessible components and responsive layouts"],
    approach: "Make status understandable at a glance, keep context close to each action, and give teams a predictable interface as their work grows.",
    visual: "operations",
  },
] as const;

export const products = [
  { number: "01", name: "KraftFlow", category: "WORKFLOW AUTOMATION", icon: Workflow, description: "A studio concept for connecting routine tasks and turning repeatable work into dependable workflows." },
  { number: "02", name: "KraftGuard", category: "SECURITY WORKSPACE", icon: ShieldCheck, description: "A studio concept for organizing security findings, prioritizing fixes, and keeping remediation visible." },
  { number: "03", name: "KraftBase", category: "PRODUCT FOUNDATION", icon: Layers3, description: "A studio concept for a reusable application foundation with thoughtful interfaces and secure defaults." },
];
export { contactProjectTypes as projectTypes } from "@/lib/contact-validation";
