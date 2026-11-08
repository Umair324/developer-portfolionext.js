"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView, useMotionTemplate, useMotionValue, useReducedMotion } from "framer-motion";
import SectionHeading from "@/components/section-heading";


const PHOTO = "/assets/me.png"
const stack = ["React.js", "Next.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "Vue.js", "React Native", "JavaScript ES6", "GitHub"];
const langs = [["English", "Conversational"], ["Urdu", "Native"], ["Sindhi", "Native"], ["Seraiki", "Advanced"]];

// newest first. Edit the text freely.
const jobs = [
    { role: "Junior Full Stack Developer", org: "IcreativeZ", when: "Present", current: true,
      text: "Building features across the front end and back end of live projects." },
    { role: "Web Developer", org: "Mean3", when: "2024", type: "1-year contract",
      text: "Collaborative development, bug fixing and testing." },
    { role: "Front-End Developer", org: "Aime, Edinburgh", when: "2023", type: "Internship · 4 months",
      text: "Hands-on front-end development as part of the team." },
];

// shown when you hover (or tap) the Projects tile. Add or remove names here.
const PROJECT_NAMES = [
    "Restaurant Management System", "Agency Website", "E-commerce App", "Chat App",
    "Trading Site", "Mobile Mart Trading Website", "Tailor App", "Cafe Website",
];

function Tile({ className = "", delay = 0, children, ...rest }) {
    const mx = useMotionValue(-300);
    const my = useMotionValue(-300);
    const glow = useMotionTemplate`radial-gradient(220px circle at ${mx}px ${my}px, rgba(99,102,241,0.22), transparent 70%)`;
    return (
        <motion.div
            {...rest}
            onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                mx.set(e.clientX - r.left);
                my.set(e.clientY - r.top);
            }}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay, type: "spring", stiffness: 120, damping: 18 }}
            className={`relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 ${className}`}
        >
            <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: glow }} />
            <div className="relative h-full">{children}</div>
        </motion.div>
    );
}

function Counter({ to, suffix = "" }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });
    const [n, setN] = useState(0);
    useEffect(() => {
        if (!inView) return;
        const c = animate(0, to, { duration: 1.6, ease: "easeOut", onUpdate: (v) => setN(Math.round(v)) });
        return () => c.stop();
    }, [inView, to]);
    return <span ref={ref}>{n}{suffix}</span>;
}

const Label = ({ children }) => <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-400">{children}</p>;

/* ---------- Projects tile: hover (or tap) and the project names fly out ---------- */
function ProjectsTile({ delay, reduce }) {
    const [open, setOpen] = useState(false);

    return (
        <div className={`relative ${open ? "z-30" : "z-0"}`}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }}>

            <Tile delay={delay} className="h-full cursor-pointer" tabIndex={0} role="button" aria-expanded={open}
                aria-label="Projects. Hover or tap to see project names" onClick={() => setOpen(true)}>
                <div className="flex h-full flex-col justify-between">
                    <Label>Projects</Label>
                    <p className="text-6xl font-bold bg-gradient-to-br from-white to-indigo-300 bg-clip-text text-transparent"><Counter to={50} suffix="+" /></p>
                    <div>
                        <p className="text-sm text-slate-400">Projects built and delivered</p>
                        <motion.p className="mt-1 text-[11px] text-indigo-300"
                            animate={reduce ? {} : { x: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
                            Hover or tap to explore →
                        </motion.p>
                    </div>
                </div>
            </Tile>

            {/* glowing ring while open */}
            <motion.span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-3xl border border-indigo-400/70"
                initial={false} animate={{ opacity: open ? 1 : 0, boxShadow: open ? "0 0 40px rgba(99,102,241,0.45)" : "0 0 0 rgba(99,102,241,0)" }} />

            <AnimatePresence>
                {open && (
                    <motion.div className="absolute right-0 top-full z-40 w-[min(92vw,440px)] pt-3 max-md:left-0 max-md:right-auto"
                        initial={{ opacity: 0, y: -14, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 260, damping: 22 }}>
                        <div className="relative overflow-hidden rounded-3xl border border-indigo-400/30 bg-[#0a0a14]/95 p-5 shadow-[0_24px_70px_rgba(79,70,229,0.4)] backdrop-blur-xl">
                            {/* aurora + top line that draws in */}
                            <motion.div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-indigo-600/30 blur-3xl"
                                animate={reduce ? {} : { scale: [1, 1.3, 1] }} transition={{ duration: 4, repeat: Infinity }} />
                            <motion.span aria-hidden="true" className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-indigo-400 via-cyan-300 to-violet-400"
                                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.7 }} />

                            <div className="relative flex items-center justify-between">
                                <motion.span className="bg-gradient-to-r from-white via-indigo-300 to-cyan-300 bg-clip-text text-sm font-semibold text-transparent"
                                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                                    Projects I’ve built
                                </motion.span>
                                <motion.span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300"
                                    initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, type: "spring" }}>
                                    50+
                                </motion.span>
                            </div>

                            <div className="relative mt-4 flex flex-wrap gap-2">
                                {PROJECT_NAMES.map((n, i) => (
                                    <motion.span key={n}
                                        initial={{ opacity: 0, scale: 0.3, y: 24, rotate: i % 2 ? -14 : 14 }}
                                        animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 17, delay: 0.1 + i * 0.07 }}
                                        whileHover={{ scale: 1.1, y: -3 }}
                                        className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1.5 text-xs text-slate-100 transition-colors hover:border-cyan-300/60 hover:bg-indigo-500/25">
                                        <motion.span className="inline-block"
                                            animate={reduce ? {} : { y: [0, -2.5, 0] }}
                                            transition={{ duration: 2.4 + (i % 3) * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}>
                                            {n}
                                        </motion.span>
                                    </motion.span>
                                ))}
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.3, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 17, delay: 0.1 + PROJECT_NAMES.length * 0.07 }}
                                    className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-1.5 text-xs font-medium text-white shadow-[0_0_20px_rgba(79,70,229,0.55)]">
                                    + many more
                                </motion.span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function AboutOurApps() {
    const reduce = useReducedMotion();

    return (
        <section className="flex flex-col items-center" id="about">
            <SectionHeading title="About Me" description="Meet the mind shaping thoughtful, modern digital experiences" />

            <div className="relative max-w-6xl w-full mx-auto mt-14 grid grid-cols-1 md:grid-cols-4 md:auto-rows-[minmax(170px,auto)] gap-4">
                {/* intro */}
                <Tile className="md:col-span-2 md:row-span-2" delay={0}>
                    <motion.div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-indigo-600/30 blur-3xl"
                        animate={reduce ? {} : { scale: [1, 1.25, 1] }} transition={{ duration: 8, repeat: Infinity }} />
                    <div className="relative flex h-full flex-col justify-between gap-6">
                        <Label>About</Label>
                        <div>
                            <h3 className="text-3xl md:text-5xl font-semibold leading-tight text-slate-100">
                                Hi, I’m <span className="bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">Umair</span>.<br />
                                I build fast, scalable web experiences.
                            </h3>
                            <p className="mt-5 text-slate-400 leading-relaxed max-w-lg">
                                A React.js developer with hands-on experience building scalable, responsive web applications. I work with JavaScript, React,
                                Redux and component-based architecture, integrate RESTful APIs, and build backends with Node.js, Express.js and MongoDB.
                                I focus on modular, maintainable code and smooth user experiences.
                            </p>
                        </div>
                    </div>
                </Tile>

                {/* photo */}
                <Tile className="md:row-span-2" delay={0.08}>
                    <div className="flex h-full flex-col items-center justify-center gap-4">
                        <div className="relative size-36">
                            <motion.div className="absolute -inset-1 rounded-full" style={{ background: "conic-gradient(from 0deg,#4f46e5,#22d3ee,#a855f7,#4f46e5)" }}
                                animate={reduce ? {} : { rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} />
                            <div className="absolute inset-0 grid place-items-center overflow-hidden rounded-full bg-[#0a0a14]">
                                {PHOTO ? <img src={PHOTO} alt="Umair Rind" className="size-full object-cover" />
                                    : <span className="text-4xl font-black text-indigo-300">UR</span>}
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-slate-100">Umair Rind</p>
                            <p className="text-xs text-slate-400">Junior Full Stack Developer</p>
                        </div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] text-emerald-300">
                            <span className="relative flex size-2">
                                <motion.span className="absolute inline-flex size-full rounded-full bg-emerald-400" animate={{ scale: [1, 2.6], opacity: [0.7, 0] }}
                                    transition={{ duration: 1.6, repeat: Infinity }} />
                                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                            </span>
                            Open to work
                        </span>
                    </div>
                </Tile>

                {/* stats */}
                <ProjectsTile delay={0.16} reduce={reduce} />
                <Tile delay={0.24}>
                    <div className="flex h-full flex-col justify-between">
                        <Label>Experience</Label>
                        <p className="text-6xl font-bold bg-gradient-to-br from-white to-cyan-300 bg-clip-text text-transparent"><Counter to={3} /></p>
                        <p className="text-sm text-slate-400">Roles across 3 companies</p>
                    </div>
                </Tile>

                {/* experience timeline */}
                <Tile className="md:col-span-2 md:row-span-2" delay={0.1}>
                    <Label>Experience</Label>
                    <div className="relative mt-6 pl-7">
                        <motion.div aria-hidden="true" className="absolute left-[5px] top-2 bottom-2 w-px origin-top bg-gradient-to-b from-indigo-500 to-cyan-400"
                            initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }} />
                        {jobs.map((j, i) => (
                            <motion.div key={`${j.org}-${j.role}`} className="relative pb-6 last:pb-0"
                                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.25 }}>
                                {j.current ? (
                                    <span className="absolute -left-[27px] top-1.5 flex size-3">
                                        <motion.span className="absolute inline-flex size-full rounded-full bg-emerald-400" animate={{ scale: [1, 2.6], opacity: [0.7, 0] }} transition={{ duration: 1.6, repeat: Infinity }} />
                                        <span className="relative inline-flex size-3 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
                                    </span>
                                ) : (
                                    <span className="absolute -left-[27px] top-1.5 size-3 rounded-full bg-indigo-500 shadow-[0_0_12px_#6366f1]" />
                                )}
                                <p className="flex flex-wrap items-center gap-2 text-xs text-indigo-300">
                                    {j.when}
                                    {j.current && (
                                        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-emerald-300">CURRENT</span>
                                    )}
                                </p>
                                <p className="mt-1 font-semibold text-slate-100">{j.role}</p>
                                <p className="text-sm text-slate-400">{j.org}{j.type && <span className="text-slate-500"> · {j.type}</span>}</p>
                                <p className="mt-1 text-sm text-slate-500">{j.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </Tile>

                {/* quote */}
                <Tile className="md:col-span-2" delay={0.18}>
                    <div className="flex h-full flex-col justify-center gap-2">
                        <Label>The Philosophy</Label>
                        <blockquote className="text-lg md:text-xl font-semibold leading-snug text-slate-100">
                            “Design is the visual language of trust; <span className="text-indigo-300">code is the voice that makes it real.</span>”
                        </blockquote>
                    </div>
                </Tile>

                {/* languages */}
                <Tile delay={0.22}>
                    <Label>Languages</Label>
                    <ul className="mt-4 space-y-2 text-sm">
                        {langs.map(([l, lv]) => (
                            <li key={l} className="flex justify-between gap-2"><span className="text-slate-200">{l}</span><span className="text-slate-500">{lv}</span></li>
                        ))}
                    </ul>
                </Tile>

                {/* education */}
                <Tile delay={0.26}>
                    <div className="flex h-full flex-col justify-between">
                        <Label>Education</Label>
                        <div>
                            <p className="font-semibold text-slate-100">BS Information Technology</p>
                            <p className="text-sm text-slate-400">University of Sindh</p>
                        </div>
                        <p className="text-xs text-indigo-300">2021 – 2024 · Graduated</p>
                    </div>
                </Tile>

                {/* tech marquee */}
                <Tile className="md:col-span-4 !p-4" delay={0.1}>
                    <div className="overflow-hidden" aria-label="Tech stack"
                        style={{ maskImage: "linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)", WebkitMaskImage: "linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)" }}>
                        <motion.div className="flex w-max gap-3" animate={reduce ? {} : { x: ["0%", "-50%"] }} transition={{ duration: 24, repeat: Infinity, ease: "linear" }}>
                            {[...stack, ...stack].map((t, i) => (
                                <span key={i} className="whitespace-nowrap rounded-full border border-indigo-500/30 bg-indigo-500/10 px-5 py-2 text-sm text-slate-200">{t}</span>
                            ))}
                        </motion.div>
                    </div>
                </Tile>
            </div>
        </section>
    );
}