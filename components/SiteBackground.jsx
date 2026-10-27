"use client";
import { useEffect } from "react";

// deterministic (no Math.random) so server and client HTML match
const DOTS = Array.from({ length: 32 }, (_, i) => ({
    left: (i * 37) % 100,
    top: (i * 53) % 100,
    size: (i % 3) + 1.5,
    dur: 8 + ((i * 7) % 10),
    delay: -((i * 13) % 10),
}));

export default function SiteBackground() {
    // mouse + scroll feed CSS variables (no React re-renders)
    useEffect(() => {
        const root = document.documentElement;
        let raf;
        const move = (e) => {
            root.style.setProperty("--mx", `${e.clientX}px`);
            root.style.setProperty("--my", `${e.clientY}px`);
        };
        const scroll = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => root.style.setProperty("--sy", String(window.scrollY)));
        };
        window.addEventListener("mousemove", move, { passive: true });
        window.addEventListener("scroll", scroll, { passive: true });
        scroll();
        return () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("scroll", scroll);
            cancelAnimationFrame(raf);
        };
    }, []);

    const parallax = (k) => ({ transform: `translateY(calc(var(--sy, 0) * ${k}px))` });

    return (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black">
            {/* top indigo wash */}
            <div className="absolute inset-0"
                style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(79,70,229,0.2), transparent 70%)" }} />

            {/* aurora blobs (outer = scroll parallax, inner = drift) */}
            <div className="absolute -left-40 top-10" style={parallax(-0.08)}>
                <div className="size-[28rem] animate-drift-a rounded-full bg-indigo-600/25 blur-3xl" />
            </div>
            <div className="absolute -right-32 top-1/3" style={parallax(-0.14)}>
                <div className="size-[26rem] animate-drift-b rounded-full bg-cyan-500/15 blur-3xl" />
            </div>
            <div className="absolute bottom-0 left-1/3" style={parallax(-0.05)}>
                <div className="size-[30rem] animate-drift-c rounded-full bg-violet-600/20 blur-3xl" />
            </div>

            {/* drifting dot grid */}
            <div className="absolute inset-0 animate-grid-flow opacity-30"
                style={{
                    backgroundImage: "radial-gradient(#818cf8 1.2px, transparent 1.4px)",
                    backgroundSize: "34px 34px",
                    WebkitMask: "radial-gradient(ellipse at center, #000 20%, transparent 75%)",
                    mask: "radial-gradient(ellipse at center, #000 20%, transparent 75%)",
                }} />

            {/* floating particles */}
            {DOTS.map((d, i) => (
                <span key={i} className="absolute animate-float-up rounded-full bg-indigo-300"
                    style={{ left: `${d.left}%`, top: `${d.top}%`, width: d.size, height: d.size, animationDuration: `${d.dur}s`, animationDelay: `${d.delay}s` }} />
            ))}

            {/* mouse spotlight */}
            <div className="absolute inset-0"
                style={{ background: "radial-gradient(600px circle at var(--mx, 50%) var(--my, 30%), rgba(99,102,241,0.13), transparent 60%)" }} />

            {/* soft vignette */}
            <div className="absolute inset-0"
                style={{ background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.65) 100%)" }} />
        </div>
    );
}