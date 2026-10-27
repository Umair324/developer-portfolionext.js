"use client";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Linkedin, Twitter, Instagram, Github, Youtube, Facebook, ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/section-heading";

const socials = [
    { name: "LinkedIn", icon: Linkedin, color: "#3b82f6", link: "https://www.linkedin.com/in/umair-rind-654a742a0/" },
    { name: "Twitter", icon: Twitter, color: "#e5e7eb", link: "https://x.com/rasheed_um38752" },
    { name: "Instagram", icon: Instagram, color: "#ec4899", link: "https://www.instagram.com/umair__rind/" },
    { name: "GitHub", icon: Github, color: "#a78bfa", link: "https://github.com/Umair324" },
    { name: "YouTube", icon: Youtube, color: "#ef4444", link: "https://www.youtube.com/@umairrind-z9n" },
    { name: "Facebook", icon: Facebook, color: "#60a5fa", link: "https://www.facebook.com/share/17mioabxUw/?mibextid=wwXIfr" },
];

// 3 icons on the inner ring, 3 on the outer ring
const INNER = [socials[0], socials[3], socials[1]];
const OUTER = [socials[2], socials[4], socials[5]];

const TWINKLE = Array.from({ length: 14 }, (_, i) => ({
    left: (i * 41) % 100, top: (i * 59) % 100, size: (i % 3) + 1.5, delay: (i * 0.45) % 4,
}));

const round = (n) => Number(n.toFixed(2));

function OrbitIcon({ item, angle, dur, ringDir, reduce, size }) {
    const rad = (angle * Math.PI) / 180;
    const left = round(50 + 50 * Math.sin(rad));
    const top = round(50 - 50 * Math.cos(rad));
    const Icon = item.icon;
    return (
        <a href={item.link} target="_blank" rel="noopener noreferrer" aria-label={item.name} tabIndex={-1}
            className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${left}%`, top: `${top}%` }}>
            {/* counter-rotate so the icon always stays upright */}
            <motion.span className="relative block"
                animate={reduce ? {} : { rotate: ringDir === 1 ? -360 : 360 }}
                transition={{ duration: dur, repeat: Infinity, ease: "linear" }}>
                <motion.span whileHover={{ scale: 1.3 }} whileTap={{ scale: 0.92 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="grid place-items-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md transition-colors group-hover:border-[var(--c)]"
                    style={{ "--c": item.color, width: size, height: size, boxShadow: `0 0 28px ${item.color}35` }}>
                    <Icon className="size-1/2 text-white/85 transition-colors group-hover:text-[var(--c)]" />
                </motion.span>
                <span className="pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/80 px-2 py-0.5 text-[10px] font-medium opacity-0 transition-opacity group-hover:opacity-100">
                    {item.name}
                </span>
            </motion.span>
        </a>
    );
}

function Orbit({ reduce }) {
    return (
        <motion.div className="relative mx-auto aspect-square w-[min(88vw,420px)]"
            animate={reduce ? {} : { y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>

            {/* glow behind */}
            <motion.div aria-hidden="true" className="pointer-events-none absolute inset-[15%] rounded-full bg-indigo-600/35 blur-3xl"
                animate={reduce ? {} : { scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 5, repeat: Infinity }} />

            {/* ripples from the centre */}
            {[0, 1, 2].map((i) => (
                <motion.span key={i} aria-hidden="true" className="pointer-events-none absolute inset-[38%] rounded-full border border-indigo-400/40"
                    animate={reduce ? { opacity: 0.2 } : { scale: [1, 3.2], opacity: [0.5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, delay: i * 2, ease: "easeOut" }} />
            ))}

            {/* outer ring (counter-clockwise) */}
            <motion.div className="absolute inset-0 rounded-full border border-dashed border-indigo-400/30"
                animate={reduce ? {} : { rotate: -360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }}>
                {OUTER.map((it, i) => (
                    <OrbitIcon key={it.name} item={it} angle={i * 120 + 60} dur={50} ringDir={-1} reduce={reduce} size={60} />
                ))}
            </motion.div>

            {/* inner ring (clockwise) */}
            <motion.div className="absolute inset-[24%] rounded-full border border-indigo-300/25"
                animate={reduce ? {} : { rotate: 360 }} transition={{ duration: 34, repeat: Infinity, ease: "linear" }}>
                {INNER.map((it, i) => (
                    <OrbitIcon key={it.name} item={it} angle={i * 120} dur={34} ringDir={1} reduce={reduce} size={54} />
                ))}
            </motion.div>

            {/* spinning bright arc */}
            <motion.span aria-hidden="true" className="pointer-events-none absolute inset-[24%] rounded-full"
                style={{
                    background: "conic-gradient(from 0deg, transparent 0 70%, #818cf8 90%, #fff 95%, transparent)",
                    WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px))",
                    mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px))",
                }}
                animate={reduce ? {} : { rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} />

            {/* core */}
            <motion.div className="absolute inset-[40%] z-10 grid place-items-center rounded-full border border-indigo-300/40 text-lg font-black tracking-tight"
                style={{ background: "radial-gradient(circle at 30% 30%, #818cf8, #4f46e5 55%, #1e1b4b)", boxShadow: "0 0 40px rgba(99,102,241,0.7), inset 0 0 20px rgba(255,255,255,0.25)" }}
                animate={reduce ? {} : { scale: [1, 1.08, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                UR
            </motion.div>

            {/* twinkles */}
            {TWINKLE.map((t, i) => (
                <motion.span key={i} aria-hidden="true" className="pointer-events-none absolute rounded-full bg-indigo-200"
                    style={{ left: `${t.left}%`, top: `${t.top}%`, width: t.size, height: t.size }}
                    animate={reduce ? { opacity: 0.4 } : { opacity: [0.1, 0.9, 0.1], scale: [0.8, 1.6, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity, delay: t.delay }} />
            ))}
        </motion.div>
    );
}

const Word = ({ children, delay }) => (
    <motion.span className="inline-block"
        initial={{ y: 40, opacity: 0, filter: "blur(10px)" }}
        whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
        {children}
    </motion.span>
);

export default function SocialMediaPresence() {
    const prefersReduce = useReducedMotion();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const reduce = mounted ? prefersReduce : false;

    const words = ["I’m", "active", "where", "my", "community", "is."];

    return (
        <section className="flex justify-center px-4 mt-28 overflow-x-clip" id="social">
            <div className="relative w-full max-w-7xl md:px-6">

                {/* shared heading (same style as About Me and Get In Touch) */}
                <SectionHeading title="Connect With Me" description="Stay updated and connected with me across my social media platforms." />

                <div className="mt-14 grid items-center gap-14 md:grid-cols-2">

                    {/* left content */}
                    <div className="flex flex-col items-center max-md:text-center md:items-start">
                        {/* badge with spinning border */}
                        <motion.div initial={{ opacity: 0, y: -16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            className="relative overflow-hidden rounded-full p-px">
                            <motion.span aria-hidden="true" className="absolute -inset-full"
                                style={{ background: "conic-gradient(from 0deg, transparent 0 60%, #818cf8 85%, transparent)" }}
                                animate={reduce ? {} : { rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
                            <span className="relative inline-flex items-center gap-2 rounded-full bg-black px-4 py-1.5 text-xs font-semibold tracking-widest text-indigo-300">
                                <span className="relative flex size-2">
                                    <motion.span className="absolute inline-flex size-full rounded-full bg-emerald-400"
                                        animate={{ scale: [1, 2.6], opacity: [0.7, 0] }} transition={{ duration: 1.6, repeat: Infinity }} />
                                    <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                                </span>
                                SOCIAL PRESENCE
                            </span>
                        </motion.div>

                        <h3 className="mt-6 max-w-xl text-3xl font-semibold leading-tight md:text-4xl">
                            {words.map((w, i) => (
                                <span key={w}>
                                    <Word delay={0.1 + i * 0.1}>
                                        {w === "community" ? (
                                            <motion.span className="inline-block bg-clip-text text-transparent"
                                                style={{ backgroundImage: "linear-gradient(90deg,#fff,#a5b4fc,#6366f1,#22d3ee,#fff)", backgroundSize: "250% 100%" }}
                                                animate={reduce ? {} : { backgroundPosition: ["0% 0%", "250% 0%"] }}
                                                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}>
                                                {w}
                                            </motion.span>
                                        ) : w}
                                    </Word>{" "}
                                </span>
                            ))}
                        </h3>

                        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6, duration: 0.7 }}
                            className="mt-4 max-w-lg text-base text-slate-400">
                            Follow me on social media for updates, insights, and behind-the-scenes content from me.
                        </motion.p>

                        {/* pill links */}
                        <div className="mt-8 flex max-w-lg flex-wrap justify-center gap-3 md:justify-start">
                            {socials.map((s, i) => {
                                const Icon = s.icon;
                                return (
                                    <motion.a key={s.name} href={s.link} target="_blank" rel="noopener noreferrer"
                                        initial={{ opacity: 0, y: 24, scale: 0.9 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }}
                                        transition={{ delay: 0.7 + i * 0.08, type: "spring", stiffness: 200, damping: 18 }}
                                        whileHover={{ y: -5, scale: 1.06 }} whileTap={{ scale: 0.95 }}
                                        className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur-md transition-[border-color,box-shadow] hover:border-[var(--c)] hover:shadow-[0_0_24px_-4px_var(--c)]"
                                        style={{ "--c": s.color }}>
                                        <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                                        <Icon className="relative size-4 transition-colors group-hover:text-[var(--c)]" />
                                        <span className="relative">{s.name}</span>
                                        <ArrowUpRight className="relative size-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                                    </motion.a>
                                );
                            })}
                        </div>
                    </div>

                    {/* orbit */}
                    <motion.div initial={{ opacity: 0, scale: 0.7, rotate: -20 }} whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: true, amount: 0.2 }} transition={{ type: "spring", stiffness: 80, damping: 16, delay: 0.2 }}>
                        <Orbit reduce={reduce} />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}