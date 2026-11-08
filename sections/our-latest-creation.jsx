"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import SectionHeading from "@/components/section-heading";

/* ---------- animated card backgrounds (no images, no lines/shine) ---------- */
const svgCls = "absolute inset-0 size-full";

function BgReact() {
    return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1230] to-[#1e1b4b]">
            <svg viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice" className={svgCls} fill="none">
                <g stroke="#67e8f9" strokeWidth="1.5">
                    <animateTransform attributeName="transform" type="rotate" from="0 100 105" to="360 100 105" dur="22s" repeatCount="indefinite" />
                    {[0, 60, 120].map((a, i) => (
                        <g key={a} transform={`rotate(${a} 100 105)`}>
                            <ellipse cx="100" cy="105" rx="78" ry="30" strokeOpacity="0.55" />
                            <circle r="3.5" fill="#a5f3fc" stroke="none">
                                <animateMotion dur={`${3 + i}s`} repeatCount="indefinite"
                                    path="M22 105 a78 30 0 1 0 156 0 a78 30 0 1 0 -156 0" />
                            </circle>
                        </g>
                    ))}
                </g>
                <circle cx="100" cy="105" r="9" fill="#67e8f9">
                    <animate attributeName="r" values="9;13;9" dur="2.4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.7;1;0.7" dur="2.4s" repeatCount="indefinite" />
                </circle>
            </svg>
        </div>
    );
}

function BgStack() {
    const layers = [
        { off: 0, fill: "#6366f1" },
        { off: 28, fill: "#8b5cf6" },
        { off: 56, fill: "#22d3ee" },
    ];
    return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#120d2e] to-[#0a0a14]">
            <svg viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice" className={svgCls}>
                {layers.map((l, i) => (
                    <g key={i} transform={`translate(0 ${l.off})`}>
                        <polygon points="100,40 165,72 100,104 35,72" fill={l.fill} fillOpacity="0.4" stroke={l.fill} strokeOpacity="0.85" strokeWidth="1">
                            <animateTransform attributeName="transform" type="translate"
                                values="0 0; 0 -10; 0 0" dur="3.2s" begin={`${i * 0.35}s`} repeatCount="indefinite" />
                        </polygon>
                    </g>
                ))}
            </svg>
        </div>
    );
}

function BgNode() {
    const nodes = [[40, 40], [110, 25], [165, 70], [70, 105], [135, 125], [30, 150]];
    const edges = [[0, 1], [1, 2], [0, 3], [1, 3], [2, 4], [3, 4], [3, 5]];
    return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#06231a] to-[#0a0a14]">
            <svg viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice" className={svgCls}>
                {edges.map(([a, b], i) => (
                    <g key={i}>
                        <line x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke="#34d399" strokeOpacity="0.25" />
                        <circle r="2.4" fill="#a7f3d0" opacity="0">
                            <animate attributeName="cx" values={`${nodes[a][0]};${nodes[b][0]}`} dur="2.4s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
                            <animate attributeName="cy" values={`${nodes[a][1]};${nodes[b][1]}`} dur="2.4s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0;1;0" dur="2.4s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
                        </circle>
                    </g>
                ))}
                {nodes.map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r="5" fill="#10b981">
                        <animate attributeName="r" values="5;8;5" dur="2.2s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
                    </circle>
                ))}
            </svg>
        </div>
    );
}

function BgGit({ reduce }) {
    const branch = "M70 20 C70 60 130 60 130 100 C130 140 70 140 70 180";
    return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#1f0f2e] to-[#0a0a14]">
            <svg viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice" className={svgCls} fill="none" strokeLinecap="round">
                <line x1="70" y1="20" x2="70" y2="180" stroke="#f472b6" strokeOpacity="0.35" strokeWidth="2" />
                <path d={branch} stroke="#a78bfa" strokeOpacity="0.25" strokeWidth="2" />
                <motion.path d={branch} stroke="#a78bfa" strokeWidth="2.5"
                    initial={{ pathLength: 0 }}
                    animate={reduce ? { pathLength: 1 } : { pathLength: [0, 1, 1, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 0.85, 1] }} />
                {[[70, 20], [70, 100], [70, 180], [130, 100]].map(([x, y], i) => (
                    <motion.circle key={i} cx={x} cy={y} r="6" fill="#0a0a14" stroke="#f472b6" strokeWidth="2.5"
                        animate={reduce ? {} : { scale: [1, 1.25, 1] }}
                        style={{ transformBox: "fill-box", transformOrigin: "center" }}
                        transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.5 }} />
                ))}
            </svg>
        </div>
    );
}

function BgMobile() {
    return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1038] to-[#0a0a14]">
            <svg viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice" className={svgCls} fill="none">
                {/* signal rings around the phone */}
                {[0, 1].map((i) => (
                    <circle key={i} cx="100" cy="105" r="50" stroke="#a78bfa" strokeWidth="1.2" opacity="0">
                        <animate attributeName="r" values="50;110" dur="3.6s" begin={`${i * 1.8}s`} repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.55;0" dur="3.6s" begin={`${i * 1.8}s`} repeatCount="indefinite" />
                    </circle>
                ))}

                {/* floating phone */}
                <g>
                    <animateTransform attributeName="transform" type="translate" values="0 0; 0 -9; 0 0" dur="3.2s" repeatCount="indefinite" />
                    <rect x="62" y="40" width="76" height="130" rx="13" fill="#0f0a24" stroke="#a78bfa" strokeWidth="2" />
                    <rect x="88" y="45" width="24" height="4" rx="2" fill="#a78bfa" opacity="0.6" />

                    {/* header + avatar */}
                    <circle cx="76" cy="64" r="6" fill="#8b5cf6" />
                    <rect x="87" y="60" width="34" height="3" rx="1.5" fill="#c4b5fd" opacity="0.8" />
                    <rect x="87" y="66" width="22" height="3" rx="1.5" fill="#7c6bb5" opacity="0.7" />

                    {/* animated content bars */}
                    {[84, 96, 108].map((y, i) => (
                        <rect key={y} x="70" y={y} width="30" height="6" rx="3" fill={i === 1 ? "#22d3ee" : "#6366f1"} opacity="0.85">
                            <animate attributeName="width" values="30;58;30" dur="2.6s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
                        </rect>
                    ))}

                    {/* app tiles */}
                    {[[70, 124], [92, 124], [114, 124]].map(([x, y], i) => (
                        <rect key={x} x={x} y={y} width="16" height="16" rx="4" fill={["#8b5cf6", "#22d3ee", "#ec4899"][i]} opacity="0.8">
                            <animate attributeName="opacity" values="0.45;1;0.45" dur="2.2s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
                        </rect>
                    ))}

                    {/* bottom nav with moving active dot */}
                    <circle cx="80" cy="157" r="2" fill="#7c6bb5" />
                    <circle cx="100" cy="157" r="2" fill="#7c6bb5" />
                    <circle cx="120" cy="157" r="2" fill="#7c6bb5" />
                    <circle cy="157" r="3.2" fill="#22d3ee">
                        <animate attributeName="cx" values="80;100;120;100;80" dur="4s" repeatCount="indefinite" />
                    </circle>

                    {/* notification badge */}
                    <circle cx="132" cy="58" r="4" fill="#ef4444">
                        <animate attributeName="r" values="4;6;4" dur="1.6s" repeatCount="indefinite" />
                    </circle>
                </g>

                {/* sparkles */}
                {[[40, 70], [160, 90], [46, 150], [158, 160]].map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r="2" fill="#c4b5fd">
                        <animate attributeName="opacity" values="0.1;1;0.1" dur="2.4s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
                    </circle>
                ))}
            </svg>
        </div>
    );
}

const sectionData = [
    { label: "FRONTEND", title: "React-Powered Interfaces", Bg: BgReact, left: "11%", top: 100, rot: -18,
      description: "Mastering React.js and Next.js to build high-performance web applications with seamless navigation and modern UI libraries." },
    { label: "MOBILE", title: "Mobile App Development", Bg: BgMobile, left: "30.5%", top: 38, rot: -8,
      description: "Building smooth, responsive mobile app experiences with modern tools, from clean UI to fast performance on every device." },
    { label: "FULL STACK", title: "Modern Web Engineering", Bg: BgStack, left: "50%", top: 0, rot: 0,
      description: "Crafting robust web applications with a balanced blend of frontend precision and backend reliability using modern JavaScript technologies." },
    { label: "BACKEND", title: "Node.js Engineering", Bg: BgNode, left: "69.5%", top: 38, rot: 8,
      description: "Designing efficient backend systems with Node.js to power modern, data-driven web applications." },
    { label: "WORKFLOW", title: "GitHub & Version Control", Bg: BgGit, left: "89%", top: 100, rot: 18,
      description: "Managing code efficiently with GitHub through clean commits, structured workflows, and collaborative version control practices." },
];

function useDesktop() {
    const [d, setD] = useState(true);
    useEffect(() => {
        const m = window.matchMedia("(min-width:768px)");
        const f = () => setD(m.matches);
        f();
        m.addEventListener("change", f);
        return () => m.removeEventListener("change", f);
    }, []);
    return d;
}

function Card({ c, reduce }) {
    const Bg = c.Bg;
    return (
        <div className="size-full relative overflow-hidden bg-[#0a0a14] text-white">
            <Bg reduce={reduce} />
            <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
            <div className="relative z-10 size-full p-4 flex flex-col justify-between">
                <span className="text-[10px] tracking-[0.2em] font-bold opacity-80">{c.label}</span>
                <div>
                    <h3 className="font-bold leading-tight text-lg md:text-xl mb-2">{c.title}</h3>
                    <p className="leading-relaxed text-[12px] md:text-[13px] opacity-90">{c.description}</p>
                </div>
            </div>
        </div>
    );
}

export default function OurLatestCreation() {
    const reduce = useReducedMotion();
    const desktop = useDesktop();
    const scrollerRef = useRef(null);
    const pausedRef = useRef(false);
    const resumeTimer = useRef(null);

    /* mobile auto-slider: har 3 sec mein next card center par aata hai */
    useEffect(() => {
        if (desktop || reduce) return;
        const el = scrollerRef.current;
        if (!el) return;

        const id = setInterval(() => {
            if (pausedRef.current) return;
            const cards = Array.from(el.children);
            if (!cards.length) return;
            const center = el.scrollLeft + el.clientWidth / 2;

            // abhi center ke sabse kareeb kaunsa card hai
            let current = 0;
            let best = Infinity;
            cards.forEach((c, i) => {
                const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
                if (d < best) { best = d; current = i; }
            });

            const next = cards[(current + 1) % cards.length];
            el.scrollTo({
                left: next.offsetLeft - (el.clientWidth - next.offsetWidth) / 2,
                behavior: "smooth",
            });
        }, 3000);

        return () => clearInterval(id);
    }, [desktop, reduce]);

    // cleanup resume timer on unmount
    useEffect(() => () => clearTimeout(resumeTimer.current), []);

    const pause = () => {
        pausedRef.current = true;
        clearTimeout(resumeTimer.current);
    };
    const resume = () => {
        clearTimeout(resumeTimer.current);
        resumeTimer.current = setTimeout(() => { pausedRef.current = false; }, 2500);
    };

    return (
        <section className="flex justify-center mt-28 px-4 overflow-x-clip" id="creations">
            <div className="relative w-full max-w-7xl text-white px-5 md:px-6 pb-12">

                {/* shared heading (same style as every other section) */}
                <SectionHeading
                    title="Skills & Expertise"
                    description="A curated set of technologies and tools I use to craft reliable, scalable, and modern web experiences."
                />

                {/* cards */}
                <div
                    ref={scrollerRef}
                    onTouchStart={pause}
                    onTouchEnd={resume}
                    onMouseEnter={pause}
                    onMouseLeave={resume}
                    className="relative z-10 mt-10 -mx-5 flex gap-4 overflow-x-auto overflow-y-hidden snap-x snap-mandatory
                               px-[calc(50%-8rem)] py-6 scroll-smooth
                               [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
                               md:mx-0 md:block md:overflow-visible md:px-0 md:py-0 md:h-[500px]">
                    {sectionData.map((c, i) => (
                        <motion.div key={c.title}
                            className="shrink-0 snap-center w-64 aspect-[3/4.4] md:absolute md:w-[20%] md:-translate-x-1/2 hover:z-30"
                            style={desktop ? { left: c.left, top: c.top } : undefined}
                            initial={desktop ? { y: 200, opacity: 0, rotate: 0 } : { opacity: 0 }}
                            whileInView={desktop ? { y: 0, opacity: 1, rotate: c.rot } : { opacity: 1 }}
                            viewport={{ once: true, amount: 0.2 }}
                            whileHover={desktop ? { y: -22, rotate: 0, scale: 1.08 } : undefined}
                            transition={{ delay: i * 0.12, type: "spring", stiffness: 110, damping: 16 }}>
                            <motion.div className="size-full overflow-hidden rounded-2xl shadow-[0_18px_40px_rgba(79,70,229,0.35)]"
                                animate={reduce ? {} : { y: [0, -8, 0] }}
                                transition={{ duration: 4 + i * 0.6, repeat: Infinity, ease: "easeInOut" }}>
                                <Card c={c} reduce={reduce} />
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}