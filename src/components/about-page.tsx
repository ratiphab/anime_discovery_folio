"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Code2, Layers, MapPin, Workflow } from "lucide-react";
import type { ReactNode } from "react";

const chapters = [
  { date: "APR 2025 — PRESENT", company: "T.N. Digital Solutions", role: "Software Engineer", text: "Building banking and loan application platforms with React, Next.js, and TypeScript. Bringing complex workflows to responsive interfaces and mobile WebViews alongside backend engineers, QA, and business analysts.", tags: "Banking / Next.js / Mobile WebView" },
  { date: "JUN 2024 — MAR 2025", company: "Profess Rent and Service", role: "Software Developer", text: "Developed rental applications and dashboards across web and mobile, taking features from requirements through deployment and support. Maintained both modern React applications and legacy PHP systems.", tags: "Rental / React Native / End-to-end delivery" },
  { date: "MAY 2023 — MAY 2024", company: "CODEMONDAY", role: "Frontend Developer", text: "Created telemedicine interfaces with React, Next.js, and Material UI. Built React Native mobile features, including in-app purchase integration, in collaboration with design and backend teams.", tags: "Healthcare / Frontend / Mobile" },
  { date: "DEC 2022 — FEB 2023", company: "RentSpree Thailand", role: "Software Engineer", text: "Contributed frontend features to real estate rental platforms using React and TypeScript, and backend services with NestJS and MongoDB in an Agile team.", tags: "Real estate / NestJS / MongoDB" },
  { date: "SEP 2021 — NOV 2022", company: "Focal Solution", role: "Software Engineer", text: "Built fullstack telemedicine and doctor queue workflows with Vue.js and AdonisJS. Integrated real-time messaging, OneSignal notifications, and VOIP-related features, with API documentation for the team.", tags: "Fullstack / WebSocket / Integrations" },
];

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={false} whileInView={reduced ? undefined : { y: [24, 0], opacity: [0.6, 1] }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.65, ease: "easeOut" }}>{children}</motion.div>;
}

export function AboutPage() {
  return (
    <main className="about-page">
      <nav className="detail-nav about-nav" aria-label="Main navigation">
        <Link href="/" className="k-brand">PHLIRU<small>ผลิรู้</small></Link>
        <div><Link href="/#discover">Discover</Link><Link href="/library">Library</Link><Link href="/about" aria-current="page">About us</Link></div>
      </nav>

      <section className="about-opening" aria-labelledby="about-title">
        <Reveal>
          <p className="k-label">About us / Meet the maker</p>
          <h1 id="about-title">Hi, I’m Time<span>.</span></h1>
          <p className="about-name">Ratiphab Chinnarath <span> / </span> Software Engineer</p>
          <p className="about-intro">Hi, I’m Time. A fullstack software engineer with a frontend heart, based in Bangkok. I turn complex business workflows into thoughtful web and mobile experiences.</p>
          <p className="about-location"><MapPin size={14} /> Bangkok, Thailand <span>Building since 2021</span></p>
        </Reveal>
        <nav className="about-index" aria-label="On this page"><span>IN THIS CHAPTER</span><a href="#story">01 — The story ↗</a><a href="#toolbox">02 — The toolkit ↗</a><a href="#journey">03 — The journey ↗</a><a href="#principles">04 — The approach ↗</a></nav>
      </section>

      <section className="about-story about-section" id="story">
        <Reveal><p className="k-label">01 / The person behind the pixels</p><h2>Thoughtful interfaces.<br /><em>Solid foundations.</em></h2></Reveal>
        <Reveal className="about-prose"><p>My strongest craft is frontend development. I work mainly with React, Next.js, and TypeScript, supported by hands-on backend experience in the Node.js ecosystem.</p><p>My work spans banking, healthcare, rental management, and real estate. Across those different worlds, the challenge I enjoy is the same: understanding the workflow, making the interface clear, and building code a team can keep working with.</p><p className="about-note">PHLIRU is my anime discovery portfolio project—a small place where interface design and software engineering meet.</p></Reveal>
      </section>

      <section className="about-toolbox about-section" id="toolbox">
        <Reveal><p className="k-label">02 / Tools of the trade</p><h2>A toolkit for<br /><em>the whole journey.</em></h2></Reveal>
        <div className="about-skill-grid">
          {[{ icon: Code2, title: "The interface", subtitle: "WEB & MOBILE", tools: ["React", "Next.js", "TypeScript", "React Native", "Vue.js", "Tailwind CSS", "Ant Design", "Material UI"] }, { icon: Layers, title: "Under the surface", subtitle: "APIs & CONNECTIONS", tools: ["Node.js", "NestJS", "Express.js", "AdonisJS", "MongoDB", "REST APIs", "WebSocket"] }, { icon: Workflow, title: "Better together", subtitle: "DELIVERY & COLLABORATION", tools: ["Git", "Agile / Scrum", "Jira", "Figma", "Swagger", "Postman", "Production support"] }].map(({ icon: Icon, title, subtitle, tools }, index) => <Reveal className="about-skill-card" key={title}><div className="skill-card-index"><Icon size={26} strokeWidth={1.5} /><span>0{index + 1}</span></div><p className="k-label">{subtitle}</p><h3>{title}</h3><ul>{tools.map(tool => <li key={tool}>{tool}</li>)}</ul></Reveal>)}
        </div>
      </section>

      <section className="about-journey about-section" id="journey">
        <Reveal className="journey-heading"><p className="k-label">03 / Chapters so far</p><h2>Different worlds.<br /><em>One curious mind.</em></h2><p>From real-time healthcare systems to the details of a banking form. Every chapter adds something to the craft.</p></Reveal>
        <ol className="chapter-list">{chapters.map((chapter, index) => <li key={chapter.company}><Reveal className="chapter"><span className="chapter-number">0{chapters.length - index}</span><div><p className="chapter-date">{chapter.date}</p><h3>{chapter.company}</h3><p className="chapter-role">{chapter.role}</p><p className="chapter-description">{chapter.text}</p><p className="chapter-tags">{chapter.tags}</p></div></Reveal></li>)}</ol>
      </section>

      <section className="about-section about-principles" id="principles">
        <Reveal><p className="k-label">04 / How I work</p><h2>Care is in<br /><em>the details.</em></h2></Reveal>
        <div className="principle-grid">{[{ title: "Make complexity feel clear.", text: "Understand the business logic first. Then shape responsive interfaces around the people who use them." }, { title: "Build for the next chapter.", text: "Use reusable components, shared logic, and maintainable code that can adapt as requirements change." }, { title: "Stay close to the whole picture.", text: "Work with designers, backend engineers, QA, and business analysts—from the first requirement through production support." }].map((item, index) => <Reveal key={item.title}><span className="principle-number">0{index + 1} /</span><h3>{item.title}</h3><p>{item.text}</p></Reveal>)}</div>
        <Reveal className="about-education"><span className="k-label">The foundation</span><p>B.Sc. in Computer Science · Srinakharinwirot University</p><span>2016 — 2020</span></Reveal>
      </section>

      <section className="about-outro"><Reveal><p className="k-label">Thanks for turning the pages</p><h2>Now, find a story<br /><em>that stays with you.</em></h2><Link className="brush-button" href="/#discover">Back to the discovery <ArrowUpRight size={17} /></Link></Reveal><span className="outro-flower" aria-hidden="true">✳</span></section>
      <footer className="k-footer"><Link className="k-brand" href="/">PHLIRU<small>ผลิรู้</small></Link><p>Crafted by Ratiphab “Time” Chinnarath.</p><a href="#about-title">Back to top ↑</a></footer>
    </main>
  );
}
