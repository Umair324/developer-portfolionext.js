"use client";
import { motion, useReducedMotion } from "framer-motion";

export default function SectionHeading({ title, description }) {
    const reduce = useReducedMotion();
    const base = "block font-black uppercase leading-[0.95] tracking-tighter text-[clamp(32px,8vw,88px)]";
    const ghost = (x, y, color) => ({ WebkitTextStroke: `1.5px ${color}`, color: "transparent", x, y });
    return (
        <div className="relative w-full text-center px-4 py-12">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0"
                style={{
                    backgroundImage: "radial-gradient(rgba(165,180,252,0.22) 1.3px, transparent 1.5px)",
                    backgroundSize: "34px 34px",
                    maskImage: "radial-gradient(ellipse at center, #000 40%, transparent 85%)",
                    WebkitMaskImage: "radial-gradient(ellipse at center, #000 40%, transparent 85%)",
                }} />
            <h2 className="relative inline-block max-w-full">
                <motion.span aria-hidden="true" className={`${base} absolute inset-0 select-none`} style={ghost(-4, -4, "#a5b4fc")}
                    animate={reduce ? {} : { x: [-4, -1, -4], y: [-4, -2, -4] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>{title}</motion.span>
                <motion.span aria-hidden="true" className={`${base} absolute inset-0 select-none`} style={ghost(4, 4, "#6366f1")}
                    animate={reduce ? {} : { x: [4, 1, 4], y: [4, 2, 4] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>{title}</motion.span>
                <span className={`${base} relative text-white`}>{title}</span>
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl text-sm md:text-base text-slate-200">{description}</p>
        </div>
    );
}