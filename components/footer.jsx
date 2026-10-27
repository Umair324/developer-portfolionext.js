'use client';
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
    ArrowUp, ArrowUpRight, CalendarCheck, Clock, Code2, Facebook, Github, Instagram, Layers, Linkedin, Mail, Twitter, Youtube, Zap,
} from "lucide-react";

const EMAIL = "umairrindoffical@gmail.com";
const TZ = "Asia/Karachi"; // your time zone, shown as "My local time"

const SOCIALS = [
    { name: "LinkedIn", icon: Linkedin, color: "#3b82f6", link: "https://www.linkedin.com/in/umair-rind-654a742a0/" },
    { name: "GitHub", icon: Github, color: "#a78bfa", link: "https://github.com/Umair324" },
    { name: "Instagram", icon: Instagram, color: "#ec4899", link: "https://www.instagram.com/umair__rind/" },
    { name: "Twitter", icon: Twitter, color: "#e5e7eb", link: "https://x.com/rasheed_um38752" },
    { name: "YouTube", icon: Youtube, color: "#ef4444", link: "https://www.youtube.com/@umairrind-z9n" },
    { name: "Facebook", icon: Facebook, color: "#60a5fa", link: "https://www.facebook.com/share/17mioabxUw/?mibextid=wwXIfr" },
];

// "/#..." links work from every page (for example from /book-demo)
const NAVIGATE = [
    { href: "/", text: "Home" },
    { href: "/#about", text: "Meet me", badge: "Let’s connect !" },
    { href: "/#creations", text: "Core Skills" },
    { href: "/#testimonials", text: "Creations" },
];
const EXPLORE = [
    { href: "/#services", text: "Services" },
    { href: "/book-demo", text: "Book a Demo" },
    { href: "/#contact", text: "Let’s Talk" },
    { href: "/#action", text: "Contact me" },
];
const FOCUS = [
    { Icon: Code2, text: "Clean, scalable frontend code." },
    { Icon: Zap, text: "Fast, user-focused interfaces." },
    { Icon: Layers, text: "Reusable, modern UI systems." },
];

/* The layout is plain CSS, so it never depends on Tailwind's cache */
const CSS = `
.ft-top{display:grid;gap:3rem 2.5rem;grid-template-columns:1fr}
@media (min-width:640px){.ft-top{grid-template-columns:1fr 1fr}}
@media (min-width:1024px){.ft-top{grid-template-columns:1.5fr 1fr 1fr 1.3fr}}
.ft-stack{display:flex;flex-direction:column;align-items:flex-start;gap:.9rem}
.ft-cards{display:grid;gap:1rem;grid-template-columns:1fr}
@media (min-width:768px){.ft-cards{grid-template-columns:repeat(3,1fr)}}
.ft-block{margin-top:4rem}
`;

function FooterLink({ href, children, badge }) {
    return (
        <Link href={href} className="group inline-flex w-fit items-center gap-2 text-slate-400 transition-colors hover:text-white">
            <span className="relative">
                {children}
                <span aria-hidden="true" className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-indigo-400 transition-transform duration-300 group-hover:scale-x-100" />
            </span>
            {badge && <span className="rounded-md bg-indigo-600 px-2 py-1 text-xs text-white">{badge}</span>}
            <ArrowUpRight className="size-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
        </Link>
    );
}

function LocalTime() {
    const [t, setT] = useState("");
    useEffect(() => {
        const f = () => setT(new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit" }).format(new Date()));
        f();
        const id = setInterval(f, 30000);
        return () => clearInterval(id);
    }, []);
    return <span className="tabular-nums">{t || "--:--"}</span>;
}

const colHead = "mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-white";
const rise = (delay = 0) => ({
    initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, delay },
});

export default function Footer() {
    const reduce = useReducedMotion();

    return (
        <motion.footer className="relative mt-40 w-full overflow-hidden px-6 text-sm text-slate-400 md:px-16 lg:px-24 xl:px-32"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}>
            <style>{CSS}</style>

            {/* glowing top line */}
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />
            <motion.div aria-hidden="true" className="absolute top-0 h-px w-1/4 bg-gradient-to-r from-transparent via-cyan-300 to-transparent"
                animate={reduce ? {} : { left: ["-25%", "100%"] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} />

            {/* background glows + dot grid */}
            <motion.div aria-hidden="true" className="pointer-events-none absolute -left-24 top-10 size-80 rounded-full bg-indigo-600/20 blur-[110px]"
                animate={reduce ? {} : { x: [0, 60, 0], y: [0, 30, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />
            <motion.div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-20 size-80 rounded-full bg-cyan-500/10 blur-[110px]"
                animate={reduce ? {} : { x: [0, -60, 0], y: [0, -30, 0] }} transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }} />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0"
                style={{
                    backgroundImage: "radial-gradient(rgba(165,180,252,0.14) 1.2px, transparent 1.4px)", backgroundSize: "32px 32px",
                    maskImage: "radial-gradient(ellipse at 50% 30%, #000 20%, transparent 75%)",
                    WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, #000 20%, transparent 75%)",
                }} />

            <div className="relative mx-auto max-w-7xl pt-16">

                {/* ===== 1. brand | navigate | explore | get in touch ===== */}
                <div className="ft-top">

                    <motion.div {...rise(0)}>
                        <Link href="/" className="group inline-flex items-center gap-2">
                            <Image className="h-9 w-auto transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110"
                                src="/assets/lom.png" width={138} height={36} alt="logo" />
                            <span className="bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-lg font-semibold tracking-wide text-transparent">Umair</span>
                        </Link>
                        <p className="mt-6 max-w-sm text-sm/7">
                            Frontend developer specializing in modern web technologies, building performant, accessible, and maintainable interfaces.
                        </p>

                        <span className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-emerald-300">
                            <span className="relative flex size-2">
                                <motion.span className="absolute inline-flex size-full rounded-full bg-emerald-400" animate={{ scale: [1, 2.6], opacity: [0.7, 0] }} transition={{ duration: 1.6, repeat: Infinity }} />
                                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                            </span>
                            OPEN TO WORK
                        </span>

                        <div className="mt-6 flex flex-wrap gap-2.5">
                            {SOCIALS.map((s, i) => {
                                const Icon = s.icon;
                                return (
                                    <motion.a key={s.name} href={s.link} target="_blank" rel="noopener noreferrer" aria-label={s.name}
                                        initial={{ opacity: 0, y: 16, scale: 0.8 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }}
                                        transition={{ delay: 0.2 + i * 0.07, type: "spring", stiffness: 220, damping: 18 }}
                                        whileHover={{ y: -5, scale: 1.1 }} whileTap={{ scale: 0.92 }}
                                        className="group grid size-10 place-items-center rounded-xl border border-white/10 bg-white/5 backdrop-blur-md transition-[border-color,box-shadow] hover:border-[var(--c)] hover:shadow-[0_0_22px_-2px_var(--c)]"
                                        style={{ "--c": s.color }}>
                                        <Icon className="size-4 text-slate-300 transition-colors group-hover:text-[var(--c)]" />
                                    </motion.a>
                                );
                            })}
                        </div>
                    </motion.div>

                    <motion.div {...rise(0.1)}>
                        <h2 className={colHead}>Navigate</h2>
                        <div className="ft-stack">
                            {NAVIGATE.map((l) => <FooterLink key={l.text} href={l.href} badge={l.badge}>{l.text}</FooterLink>)}
                        </div>
                    </motion.div>

                    <motion.div {...rise(0.2)}>
                        <h2 className={colHead}>Explore</h2>
                        <div className="ft-stack">
                            {EXPLORE.map((l) => <FooterLink key={l.text} href={l.href}>{l.text}</FooterLink>)}
                        </div>
                    </motion.div>

                    <motion.div {...rise(0.3)}>
                        <h2 className={colHead}>Get in touch</h2>
                        <div className="ft-stack">
                            <a href={`mailto:${EMAIL}`}
                                className="group flex min-w-0 max-w-full items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-md transition hover:border-indigo-400/60">
                                <Mail className="size-4 shrink-0 text-indigo-300" />
                                <span className="truncate text-slate-200">{EMAIL}</span>
                            </a>
                            <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs backdrop-blur-md">
                                <Clock className="size-4 text-cyan-300" /> My local time: <LocalTime />
                            </span>
                            <Link href="/book-demo">
                                <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                    className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-sm font-medium text-white shadow-[0_0_26px_rgba(79,70,229,0.5)]">
                                    <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                                    <CalendarCheck className="relative size-4" />
                                    <span className="relative">Book a Demo</span>
                                </motion.span>
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* ===== 2. what I focus on (3 cards in one row) ===== */}
                <div className="ft-block">
                    <motion.div {...rise(0)} className="mb-6 flex items-center gap-4">
                        <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-transparent to-white/15" />
                        <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-white">What I Focus On</h2>
                        <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-l from-transparent to-white/15" />
                    </motion.div>

                    <div className="ft-cards">
                        {FOCUS.map(({ Icon, text }, i) => (
                            <motion.div key={text} {...rise(0.1 + i * 0.1)} whileHover={{ y: -5 }}
                                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md transition-colors hover:border-indigo-400/50">
                                <span aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-indigo-500/20 blur-2xl transition-opacity duration-300 group-hover:opacity-100 sm:opacity-0" />
                                <span className="relative grid size-11 place-items-center rounded-xl border border-indigo-400/25 bg-indigo-500/10 text-indigo-300 transition group-hover:border-indigo-400/60 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                                    <Icon className="size-5" />
                                </span>
                                <p className="relative mt-4 text-base text-slate-300 transition-colors group-hover:text-white">{text}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ===== 3. big outline wordmark ===== */}
                <div aria-hidden="true" className="relative mt-16 flex select-none justify-center overflow-hidden"
                    style={{ WebkitMaskImage: "linear-gradient(to bottom, #000 55%, transparent 100%)", maskImage: "linear-gradient(to bottom, #000 55%, transparent 100%)", filter: "drop-shadow(0 0 28px rgba(99,102,241,0.35))" }}>
                    <div className="flex font-black uppercase leading-[0.9] tracking-tighter" style={{ fontSize: "clamp(72px, 21vw, 280px)" }}>
                        {"UMAIR".split("").map((ch, i) => (
                            <motion.span key={i} className="inline-block"
                                style={{ WebkitTextStroke: "2px rgba(165,180,252,0.65)", color: "transparent" }}
                                initial={{ y: "35%", opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                                transition={{ delay: i * 0.09, type: "spring", stiffness: 90, damping: 16 }}
                                whileHover={{ color: "rgba(99,102,241,0.45)" }}>
                                {ch}
                            </motion.span>
                        ))}
                    </div>
                </div>

                {/* ===== 4. bottom bar ===== */}
                <div className="relative flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-center sm:flex-row sm:text-left">
                    <p>© {new Date().getFullYear()} Umair. All rights reserved.</p>
                    <p className="text-xs text-slate-500">Built with Next.js, Tailwind CSS and Framer Motion</p>
                    <motion.button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top"
                        whileHover={{ y: -4 }} whileTap={{ scale: 0.9 }}
                        className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-slate-300 backdrop-blur-md transition hover:border-indigo-400 hover:text-white">
                        Back to top <ArrowUp className="size-3.5 transition-transform group-hover:-translate-y-0.5" />
                    </motion.button>
                </div>
            </div>
        </motion.footer>
    );
}