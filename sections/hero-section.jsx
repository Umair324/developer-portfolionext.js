"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { Download, ArrowRight, Smartphone, GitBranch } from "lucide-react";

const RESUME = "/assets/resume.pdf"; // apni resume file ka path yahan likhein
const ROLES = ["React Developer", "Frontend Engineer", "Node.js Builder", "UI Craftsman"];
const STACK = ["React", "Next.js", "JavaScript", "Redux", "Node.js", "Express", "MongoDB", "REST APIs", "Tailwind", "Framer Motion", "GitHub"];

const STARS = [
    { left: "5%", top: "8%", delay: 0 }, { left: "40%", top: "4%", delay: 3.2 },
    { left: "65%", top: "10%", delay: 6 }, { left: "20%", top: "22%", delay: 9 },
];

function useTypewriter(words) {
    const [text, setText] = useState("");
    const [i, setI] = useState(0);
    const [del, setDel] = useState(false);
    useEffect(() => {
        const word = words[i % words.length];
        let t;
        if (!del && text === word) t = setTimeout(() => setDel(true), 1400);
        else if (del && text === "") { setDel(false); setI((v) => v + 1); }
        else t = setTimeout(() => setText(word.slice(0, text.length + (del ? -1 : 1))), del ? 40 : 85);
        return () => clearTimeout(t);
    }, [text, del, i, words]);
    return text;
}

const Word = ({ children, delay }) => (
    <motion.span className="inline-block"
        initial={{ y: 60, opacity: 0, filter: "blur(12px)", rotateX: -60 }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)", rotateX: 0 }}
        transition={{ delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
        {children}
    </motion.span>
);

const Shimmer = ({ children, reduce }) => (
    <motion.span className="inline-block bg-clip-text text-transparent"
        style={{ backgroundImage: "linear-gradient(110deg,#fff 40%,#a5b4fc 50%,#fff 60%)", backgroundSize: "250% 100%" }}
        animate={reduce ? {} : { backgroundPosition: ["200% 0", "-100% 0"] }}
        transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2, ease: "linear" }}>
        {children}
    </motion.span>
);

function Magnetic({ children }) {
    const x = useSpring(0, { stiffness: 200, damping: 15 });
    const y = useSpring(0, { stiffness: 200, damping: 15 });
    const ref = useRef(null);
    return (
        <motion.div ref={ref} style={{ x, y }}
            onMouseMove={(e) => {
                const r = ref.current.getBoundingClientRect();
                x.set((e.clientX - (r.left + r.width / 2)) * 0.3);
                y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
            }}
            onMouseLeave={() => { x.set(0); y.set(0); }}>
            {children}
        </motion.div>
    );
}

const TW = "M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z";
const txt = { textAnchor: "middle", fontFamily: "sans-serif", fontWeight: 800 };

const ICON = {
    react: (
        <motion.svg viewBox="0 0 44 44" className="size-full" fill="none" stroke="#61dafb" strokeWidth="2"
            animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }}>
            <circle cx="22" cy="22" r="3" fill="#61dafb" stroke="none" />
            {[0, 60, 120].map((a) => <ellipse key={a} cx="22" cy="22" rx="19" ry="7.5" transform={`rotate(${a} 22 22)`} />)}
        </motion.svg>
    ),
    node: (
        <svg viewBox="0 0 44 44" className="size-full">
            <polygon points="22,2 40,12 40,32 22,42 4,32 4,12" fill="#3c873a" />
            <text x="22" y="27" fontSize="13" fill="#fff" {...txt}>JS</text>
        </svg>
    ),
    tailwind: <svg viewBox="0 0 54 33" className="size-full" fill="#38bdf8"><path d={TW} /></svg>,
    next: (
        <svg viewBox="0 0 44 44" className="size-full">
            <circle cx="22" cy="22" r="20" fill="#fff" />
            <text x="22" y="30" fontSize="24" fill="#000" {...txt}>N</text>
        </svg>
    ),
    js: (
        <svg viewBox="0 0 44 44" className="size-full">
            <rect x="3" y="3" width="38" height="38" rx="5" fill="#f7df1e" />
            <text x="38" y="38" fontSize="17" fill="#000" {...txt} textAnchor="end">JS</text>
        </svg>
    ),
    mongo: (
        <svg viewBox="0 0 44 44" className="size-full">
            <path d="M22 2c6 8 11 14 11 22 0 7-5 13-11 17-6-4-11-10-11-17C11 16 16 10 22 2z" fill="#47a248" />
            <path d="M22 14v26" stroke="#b7e4c7" strokeWidth="1.5" />
        </svg>
    ),
    redux: (
        <svg viewBox="0 0 44 44" className="size-full" fill="none" stroke="#764abc" strokeWidth="3.5" strokeLinecap="round">
            <circle cx="14" cy="32" r="4" fill="#764abc" /><circle cx="32" cy="32" r="4" fill="#764abc" /><circle cx="22" cy="12" r="4" fill="#764abc" />
            <path d="M22 16c-6 4-8 8-8 12M22 16c6 4 8 8 8 12M18 32h8" />
        </svg>
    ),
    mobile: (
        <motion.div className="size-full" animate={{ rotate: [-8, 8, -8] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
            <Smartphone className="size-full" stroke="#a78bfa" strokeWidth={1.6} />
        </motion.div>
    ),
    git: <GitBranch className="size-full" stroke="#f97316" strokeWidth={1.8} />,
    html: (
        <svg viewBox="0 0 44 44" className="size-full">
            <polygon points="6,4 38,4 35,36 22,41 9,36" fill="#e44d26" />
            <text x="22" y="28" fontSize="18" fill="#fff" {...txt}>5</text>
        </svg>
    ),
    css: (
        <svg viewBox="0 0 44 44" className="size-full">
            <polygon points="6,4 38,4 35,36 22,41 9,36" fill="#1572b6" />
            <text x="22" y="28" fontSize="18" fill="#fff" {...txt}>3</text>
        </svg>
    ),
    express: (
        <svg viewBox="0 0 44 44" className="size-full">
            <text x="22" y="30" fontSize="22" fill="#e5e7eb" fontFamily="monospace" fontWeight="700" textAnchor="middle">ex</text>
        </svg>
    ),
    api: (
        <svg viewBox="0 0 44 44" className="size-full" fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 10c-4 0-4 4-4 6v3c0 2-2 3-4 3 2 0 4 1 4 3v3c0 2 0 6 4 6M30 10c4 0 4 4 4 6v3c0 2 2 3 4 3-2 0-4 1-4 3v3c0 2 0 6-4 6" />
        </svg>
    ),
};

// left/top in %, size in px, depth = mouse parallax strength, o = opacity, mobile = also show on small screens
const LOGOS = [
    { label: "React.js", icon: ICON.react, color: "#61dafb", left: 9, top: 17, size: 92, depth: 40, o: 0.85, dur: 6, mobile: true },
    { label: "Node.js", icon: ICON.node, color: "#3c873a", left: 88, top: 19, size: 90, depth: -40, o: 0.85, dur: 7, mobile: true },
    { label: "Tailwind CSS", icon: ICON.tailwind, color: "#38bdf8", left: 14, top: 47, size: 100, depth: 30, o: 0.85, dur: 6.5, mobile: true },
    { label: "Next.js", icon: ICON.next, color: "#ffffff", left: 82, top: 47, size: 80, depth: -30, o: 0.75, dur: 8 },
    { label: "JavaScript", icon: ICON.js, color: "#f7df1e", left: 7, top: 76, size: 84, depth: 25, o: 0.8, dur: 7.5, mobile: true },
    { label: "MongoDB", icon: ICON.mongo, color: "#47a248", left: 91, top: 77, size: 86, depth: -25, o: 0.8, dur: 6.8, mobile: true },
    { label: "Redux", icon: ICON.redux, color: "#764abc", left: 27, top: 10, size: 72, depth: 20, o: 0.65, dur: 7.2 },
    { label: "Mobile Apps", icon: ICON.mobile, color: "#a78bfa", left: 72, top: 9, size: 92, depth: -35, o: 0.85, dur: 5.5, mobile: true },
    { label: "Git & GitHub", icon: ICON.git, color: "#f97316", left: 25, top: 80, size: 80, depth: 35, o: 0.75, dur: 6.3 },
    { label: "HTML5", icon: ICON.html, color: "#e44d26", left: 71, top: 81, size: 74, depth: -35, o: 0.7, dur: 7.8 },
    { label: "CSS3", icon: ICON.css, color: "#1572b6", left: 41, top: 6, size: 64, depth: 22, o: 0.55, dur: 8.4 },
    { label: "Express", icon: ICON.express, color: "#9ca3af", left: 60, top: 5, size: 66, depth: -22, o: 0.55, dur: 6.9 },
    { label: "REST APIs", icon: ICON.api, color: "#22d3ee", left: 94, top: 58, size: 66, depth: -28, o: 0.6, dur: 7.1 },
    // small blurred "far" layer for depth
    { icon: ICON.react, color: "#61dafb", left: 21, top: 30, size: 44, depth: 12, o: 0.28, dur: 9, far: true },
    { icon: ICON.tailwind, color: "#38bdf8", left: 79, top: 31, size: 46, depth: -12, o: 0.28, dur: 10, far: true },
    { icon: ICON.node, color: "#3c873a", left: 11, top: 62, size: 42, depth: 14, o: 0.28, dur: 9.5, far: true },
    { icon: ICON.mobile, color: "#a78bfa", left: 85, top: 64, size: 42, depth: -14, o: 0.28, dur: 11, far: true },
];

function LogoTile({ l, i, sx, sy, reduce }) {
    const x = useTransform(sx, (v) => v * l.depth);
    const y = useTransform(sy, (v) => v * l.depth);
    return (
        <motion.div aria-hidden="true" style={{ left: `${l.left}%`, top: `${l.top}%`, x, y }}
            className={`pointer-events-none absolute -z-10 ${l.mobile ? "" : "hidden md:block"}`}>
            <motion.div
                initial={{ opacity: 0, scale: 0.3 }}
                animate={reduce ? { opacity: l.o, scale: 1 } : { opacity: l.o, scale: 1, y: [0, -18, 0], x: [0, 8, 0], rotate: [-4, 4, -4] }}
                transition={{
                    opacity: { delay: 0.3 + i * 0.1, duration: 0.8 },
                    scale: { delay: 0.3 + i * 0.1, type: "spring" },
                    y: { duration: l.dur, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 },
                    x: { duration: l.dur * 1.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 },
                    rotate: { duration: l.dur * 1.1, repeat: Infinity, ease: "easeInOut" },
                }}>
                <div className={`flex -translate-x-1/2 -translate-y-1/2 scale-[0.72] flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md md:scale-100 ${l.far ? "blur-[1.5px]" : ""}`}
                    style={{ width: l.size, height: l.size, boxShadow: `0 0 40px ${l.color}40, inset 0 0 20px ${l.color}15` }}>
                    <div style={{ width: l.size * 0.46, height: l.size * 0.46 }}>{l.icon}</div>
                    {l.label && <span className="text-[10px] font-medium text-slate-200">{l.label}</span>}
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function Hero() {
    const prefersReduce = useReducedMotion();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const reduce = mounted ? prefersReduce : false; // same on server + first client render
    const role = useTypewriter(ROLES);

    const px = useMotionValue(-200), py = useMotionValue(-200); // px for cursor ring
    const nx = useMotionValue(0), ny = useMotionValue(0);     // -0.5..0.5 for parallax
    const sx = useSpring(nx, { stiffness: 50, damping: 15 });
    const sy = useSpring(ny, { stiffness: 50, damping: 15 });
    const rx = useSpring(px, { stiffness: 150, damping: 20 });
    const ry = useSpring(py, { stiffness: 150, damping: 20 });
    const tiltX = useTransform(sy, (v) => v * -6);
    const tiltY = useTransform(sx, (v) => v * 6);
    const ox = useTransform(sx, (v) => v * -40);
    const oy = useTransform(sy, (v) => v * -40);

    const onMove = (e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
        nx.set(fx - 0.5); ny.set(fy - 0.5);
        px.set(e.clientX - r.left); py.set(e.clientY - r.top);
    };

    const ringMask = "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))";

    return (
        <section id="home" onMouseMove={onMove}
            className="relative isolate ml-[calc(50%-50vw)] flex min-h-screen w-screen items-center justify-center overflow-x-clip bg-transparent px-4 pt-28 pb-40 text-white">

            {/* ORB: absolute, centered behind content */}
            <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[min(94vw,780px)] -translate-x-1/2 -translate-y-1/2 opacity-[0.1]">
                <motion.div className="absolute inset-0" style={{ x: ox, y: oy }}>

                    {/* ripple halos */}
                    {[0, 1, 2].map((i) => (
                        <motion.span key={i} className="absolute inset-[10%] rounded-full border border-indigo-400/40"
                            animate={reduce ? { opacity: 0.2 } : { scale: [1, 1.5], opacity: [0.45, 0] }}
                            transition={{ duration: 6, repeat: Infinity, delay: i * 2, ease: "easeOut" }} />
                    ))}

                    {/* core orb: swirling aurora inside glass sphere */}
                    <motion.div className="absolute inset-[10%]"
                        animate={reduce ? {} : { scale: [1, 1.03, 1], y: [0, -10, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
                        <div className="absolute inset-0 overflow-hidden rounded-full bg-[#05050f]"
                            style={{ boxShadow: "0 0 140px rgba(79,70,229,0.55), inset 0 0 90px rgba(129,140,248,0.35)" }}>
                            {/* swirling colours */}
                            <motion.div className="absolute -inset-1/4 opacity-80 blur-2xl"
                                style={{ background: "conic-gradient(from 0deg,#4f46e5,#22d3ee,#8b5cf6,#0b0b2a,#ec4899,#4f46e5)" }}
                                animate={reduce ? {} : { rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} />
                            <motion.div className="absolute -inset-1/4 opacity-50 blur-3xl mix-blend-screen"
                                style={{ background: "conic-gradient(from 180deg,transparent,#6366f1,transparent,#22d3ee,transparent)" }}
                                animate={reduce ? {} : { rotate: -360 }} transition={{ duration: 26, repeat: Infinity, ease: "linear" }} />
                            {/* dark centre keeps the text readable */}
                            <div className="absolute inset-0"
                                style={{ background: "radial-gradient(circle, rgba(0,0,0,0.93) 34%, rgba(5,5,15,0.65) 58%, rgba(5,5,15,0.1) 100%)" }} />
                            {/* breathing inner rings */}
                            {[0.62, 0.8].map((sz, i) => (
                                <motion.span key={sz} className="absolute left-1/2 top-1/2 rounded-full border border-indigo-300/20"
                                    style={{ width: `${sz * 100}%`, height: `${sz * 100}%`, marginLeft: `${-sz * 50}%`, marginTop: `${-sz * 50}%` }}
                                    animate={reduce ? {} : { scale: [1, 1.06, 1], opacity: [0.3, 0.9, 0.3] }}
                                    transition={{ duration: 4, repeat: Infinity, delay: i * 1.5, ease: "easeInOut" }} />
                            ))}
                            {/* twinkling stars */}
                            {[[18, 30], [30, 70], [72, 24], [80, 62], [52, 84], [60, 12], [12, 55], [88, 40]].map(([l, t], i) => (
                                <motion.span key={i} className="absolute size-1 rounded-full bg-white"
                                    style={{ left: `${l}%`, top: `${t}%` }}
                                    animate={reduce ? { opacity: 0.5 } : { opacity: [0.1, 1, 0.1], scale: [0.8, 1.8, 0.8] }}
                                    transition={{ duration: 2.5 + (i % 3), repeat: Infinity, delay: i * 0.4 }} />
                            ))}
                        </div>
                    </motion.div>

                    {/* spinning bright edge */}
                    <motion.span className="absolute inset-[10%] rounded-full"
                        style={{ background: "conic-gradient(from 0deg, transparent 0 55%, #818cf8 75%, #fff 80%, transparent 90%)", WebkitMask: ringMask, mask: ringMask }}
                        animate={reduce ? {} : { rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />

                    {/* HUD tick ring */}
                    <motion.svg viewBox="0 0 400 400" className="absolute inset-[10%]" fill="none"
                        animate={reduce ? {} : { rotate: 360 }} transition={{ duration: 70, repeat: Infinity, ease: "linear" }}>
                        {Array.from({ length: 72 }, (_, i) => (
                            <line key={i} x1="200" y1="10" x2="200" y2={i % 6 === 0 ? 26 : 18}
                                transform={`rotate(${i * 5} 200 200)`} stroke="#a5b4fc" strokeOpacity={i % 6 === 0 ? 0.7 : 0.3} />
                        ))}
                    </motion.svg>

                    {/* circular text */}
                    <motion.svg viewBox="0 0 400 400" className="absolute inset-[10%]"
                        animate={reduce ? {} : { rotate: -360 }} transition={{ duration: 55, repeat: Infinity, ease: "linear" }}>
                        <path id="orbText" d="M200,200 m-160,0 a160,160 0 1,1 320,0 a160,160 0 1,1 -320,0" fill="none" />
                        <text fontSize="11" letterSpacing="5" fill="#c7d2fe" opacity="0.65" fontWeight="600">
                            <textPath href="#orbText">REACT • NEXT.JS • NODE.JS • EXPRESS • MONGODB • REDUX • REST APIs • </textPath>
                        </text>
                    </motion.svg>

                    {/* orbit ring 1 (clockwise) + planet */}
                    <motion.div className="absolute inset-[2%] rounded-full border border-dashed border-indigo-400/30"
                        animate={reduce ? {} : { rotate: 360 }} transition={{ duration: 28, repeat: Infinity, ease: "linear" }}>
                        <span className="absolute -top-2 left-1/2 size-4 -translate-x-1/2 rounded-full bg-indigo-300"
                            style={{ boxShadow: "0 0 24px 6px rgba(165,180,252,0.8)" }} />
                        {[
                            { t: "</>", cls: "left-[-5%] top-[46%]" },
                            { t: "{ }", cls: "right-[-4%] bottom-[24%]" },
                        ].map((p) => (
                            <span key={p.t} className={`absolute ${p.cls}`}>
                                <motion.span className="flex items-center rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 font-mono text-xs font-bold text-indigo-100 backdrop-blur-md"
                                    animate={reduce ? {} : { rotate: -360 }} transition={{ duration: 28, repeat: Infinity, ease: "linear" }}>
                                    {p.t}
                                </motion.span>
                            </span>
                        ))}
                    </motion.div>

                    {/* orbit ring 2 (counter-clockwise) + planet */}
                    <motion.div className="absolute -inset-[5%] rounded-full border border-cyan-300/20"
                        animate={reduce ? {} : { rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
                        <span className="absolute -bottom-1.5 left-[30%] size-3 rounded-full bg-cyan-300"
                            style={{ boxShadow: "0 0 20px 5px rgba(103,232,249,0.7)" }} />
                        <span className="absolute right-[8%] top-[18%] size-2 rounded-full bg-violet-300"
                            style={{ boxShadow: "0 0 14px 4px rgba(196,181,253,0.7)" }} />
                    </motion.div>

                    {/* tilted orbit ring 3 */}
                    <motion.div className="absolute inset-[-12%] rounded-full border border-white/10"
                        style={{ rotateX: 70 }}
                        animate={reduce ? {} : { rotateZ: 360 }} transition={{ duration: 34, repeat: Infinity, ease: "linear" }}>
                        <span className="absolute left-1/2 top-0 size-2.5 -translate-x-1/2 rounded-full bg-white"
                            style={{ boxShadow: "0 0 18px 4px rgba(255,255,255,0.7)" }} />
                    </motion.div>
                </motion.div>
            </div>

            {/* cursor ring */}
            <motion.div aria-hidden="true" className="pointer-events-none absolute left-0 top-0 -ml-5 -mt-5 hidden size-10 rounded-full border border-indigo-400/60 md:block"
                style={{ x: rx, y: ry }} />

            {/* shooting stars */}
            {!reduce && STARS.map((s, i) => (
                <motion.span key={i} aria-hidden="true" className="pointer-events-none absolute -z-10 h-px w-28 bg-gradient-to-r from-transparent to-white"
                    style={{ left: s.left, top: s.top, rotate: 30 }}
                    animate={{ x: [0, 420], y: [0, 242], opacity: [0, 1, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 10, delay: s.delay, ease: "easeIn" }} />
            ))}

            {/* skill logos: fills the whole hero, floats + mouse parallax */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-6 md:inset-x-12 lg:inset-x-16 bottom-20 top-24 -z-10">
                {LOGOS.map((l, i) => <LogoTile key={i} l={l} i={i} sx={sx} sy={sy} reduce={reduce} />)}
            </div>

            {/* content (tilts with mouse) */}
            <motion.div className="relative z-10 flex max-w-4xl flex-col items-center text-center [perspective:1000px]"
                style={reduce ? undefined : { rotateX: tiltX, rotateY: tiltY }}>

                {/* badge with spinning border */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                    className="relative mb-8 overflow-hidden rounded-full p-px">
                    <motion.span aria-hidden="true" className="absolute -inset-full"
                        style={{ background: "conic-gradient(from 0deg, transparent 0 60%, #818cf8 85%, transparent)" }}
                        animate={reduce ? {} : { rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
                    <span className="relative inline-flex items-center gap-2.5 rounded-full bg-black px-4 py-1.5 text-sm">
                        <span className="relative flex size-2.5">
                            <motion.span className="absolute inline-flex size-full rounded-full bg-emerald-400"
                                animate={{ scale: [1, 2.6], opacity: [0.7, 0] }} transition={{ duration: 1.6, repeat: Infinity }} />
                            <span className="relative inline-flex size-2.5 rounded-full bg-emerald-400" />
                        </span>
                        Bring your idea to life
                    </span>
                </motion.div>

                {/* same text, same size as before. Only the outline lines (like About Me / Connect With Me) are added behind it */}
                <h1 className="relative text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                    {[{ x: -4, y: -4, color: "#a5b4fc", dur: 4 }, { x: 4, y: 4, color: "#6366f1", dur: 5 }].map((g, k) => (
                        <motion.span key={k} aria-hidden="true" className="pointer-events-none absolute inset-0 select-none"
                            style={{ WebkitTextStroke: `1.5px ${g.color}`, color: "transparent" }}
                            initial={{ opacity: 0, x: g.x, y: g.y }}
                            animate={reduce ? { opacity: 1 } : { opacity: 1, x: [g.x, g.x * 0.25, g.x], y: [g.y, g.y * 0.5, g.y] }}
                            transition={{
                                opacity: { delay: 1, duration: 0.6 },
                                x: { duration: g.dur, repeat: Infinity, ease: "easeInOut" },
                                y: { duration: g.dur, repeat: Infinity, ease: "easeInOut" },
                            }}>
                            I’m Umair,<br />building web experiences.
                        </motion.span>
                    ))}
                    <span className="relative">
                        <Word delay={0.15}>I’m</Word>{" "}
                        <Word delay={0.25}>
                            <motion.span className="inline-block bg-clip-text text-transparent"
                                style={{ backgroundImage: "linear-gradient(90deg,#fff,#a5b4fc,#6366f1,#22d3ee,#fff)", backgroundSize: "250% 100%" }}
                                animate={reduce ? {} : { backgroundPosition: ["0% 0%", "250% 0%"] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}>
                                Umair,
                            </motion.span>
                        </Word>
                        <br />
                        {["building", "web", "experiences."].map((w, i) => (
                            <span key={w}><Word delay={0.4 + i * 0.12}><Shimmer reduce={reduce}>{w}</Shimmer></Word>{i < 2 && " "}</span>
                        ))}
                    </span>
                </h1>

                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                    className="mt-6 h-8 text-lg font-medium text-indigo-300 md:text-xl">
                    <span className="text-slate-400">I’m a </span>{role}
                    <motion.span aria-hidden="true" className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[3px] bg-indigo-300"
                        animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.9, repeat: Infinity }} />
                </motion.p>

                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.7 }}
                    className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 md:text-base">
                    Delivering polished digital experiences through modern tools, attention to detail, and purposeful development.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.7 }}
                    className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
                    <Magnetic>
                        <motion.a href={RESUME} download whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
                            className="group relative flex items-center gap-2 overflow-hidden rounded-lg bg-indigo-600 px-7 py-3.5 text-sm font-medium shadow-[0_0_30px_rgba(79,70,229,0.5)]">
                            <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                            <span className="relative">Download Resume</span>
                            <motion.span className="relative" animate={reduce ? {} : { y: [0, 3, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
                                <Download className="size-4" />
                            </motion.span>
                        </motion.a>
                    </Magnetic>
                    <Magnetic>
                        <motion.a href="#action" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
                            className="group flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-medium backdrop-blur-md transition-colors hover:border-indigo-400 hover:bg-indigo-500/10">
                            Get in touch
                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                        </motion.a>
                    </Magnetic>
                </motion.div>
            </motion.div>

            {/* scroll indicator */}
            <motion.a href="#about" aria-label="Scroll down" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
                className="absolute bottom-24 left-1/2 -translate-x-1/2">
                <span className="flex h-10 w-6 justify-center rounded-full border border-white/30 pt-2">
                    <motion.span className="h-2 w-1 rounded-full bg-white"
                        animate={reduce ? {} : { y: [0, 14, 0], opacity: [1, 0.2, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
                </span>
            </motion.a>

            {/* tech marquee */}
            {/* <div aria-hidden="true" className="absolute inset-x-0 bottom-0 overflow-hidden border-t border-white/10 bg-black/40 py-4 backdrop-blur-sm"
                style={{ WebkitMask: "linear-gradient(90deg,transparent,#000 15%,#000 85%,transparent)", mask: "linear-gradient(90deg,transparent,#000 15%,#000 85%,transparent)" }}>
                <motion.div className="flex w-max gap-10 text-sm font-medium text-slate-400"
                    animate={reduce ? {} : { x: ["0%", "-50%"] }} transition={{ duration: 28, repeat: Infinity, ease: "linear" }}>
                    {[...STACK, ...STACK].map((s, i) => (
                        <span key={i} className="flex items-center gap-10 whitespace-nowrap">
                            {s}<span className="size-1 rounded-full bg-indigo-500" />
                        </span>
                    ))}
                </motion.div>
            </div> */}
        </section>
    );
}