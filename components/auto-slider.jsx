"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AutoSlider({
    children,
    reverse = false,
    speed = 0.06,
    gapPx = 12,
    arrows = false,
    fade = true,
    pauseOnHover = true,
    respectReducedMotion = false,
    reduce,
    className = "",
}) {
    const prefersReduce = useReducedMotion();
    const stopAuto = respectReducedMotion && (reduce ?? prefersReduce);

    const box = useRef(null);      // the visible window
    const track = useRef(null);    // the strip that moves
    const off = useRef(0);         // how far the strip has moved (px)
    const period = useRef(0);      // width of ONE set of children
    const copiesRef = useRef(3);
    const visible = useRef(true);
    const holdUntil = useRef(0);
    const drag = useRef({ on: false, x: 0 });
    const anim = useRef(null);
    const [copies, setCopies] = useState(3);

    // measure one set, and render enough copies to always fill the window
    useEffect(() => {
        const b = box.current, t = track.current;
        if (!b || !t) return;
        const measure = () => {
            const one = t.offsetWidth / copiesRef.current;
            if (!one) return;
            period.current = one;
            const need = Math.min(16, Math.max(3, Math.ceil((b.clientWidth + 400) / one) + 2));
            if (need !== copiesRef.current) { copiesRef.current = need; setCopies(need); }
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(b);
        ro.observe(t);
        return () => ro.disconnect();
    }, []);

    // animate only while on screen
    useEffect(() => {
        const b = box.current;
        if (!b) return;
        const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; });
        io.observe(b);
        return () => io.disconnect();
    }, []);

    // the loop
    useEffect(() => {
        let last = performance.now(), raf;
        const canHover = window.matchMedia("(hover: hover)").matches;
        const wrap = () => {
            const p = period.current;
            if (p > 0) off.current = ((off.current % p) + p) % p;
        };
        const tick = () => {
            const now = performance.now();
            const dt = Math.min(Math.max(now - last, 0), 50);
            last = now;
            const a = anim.current;
            if (a) {                                            // arrow button animation
                const k = Math.min((now - a.t0) / a.dur, 1);
                off.current = a.from + (a.to - a.from) * (1 - Math.pow(1 - k, 3));
                if (k >= 1) { anim.current = null; wrap(); }
            } else {
                const hovering = pauseOnHover && canHover && box.current?.matches(":hover");
                const auto = !stopAuto && visible.current && !hovering && !drag.current.on && now > holdUntil.current;
                if (auto) off.current += (reverse ? -1 : 1) * speed * dt;
                wrap();
            }
            if (track.current) track.current.style.transform = `translate3d(${-(period.current + off.current)}px,0,0)`;
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [stopAuto, reverse, speed, pauseOnHover]);

    const nudge = (dir) => {
        const now = performance.now();
        holdUntil.current = now + 1500;
        anim.current = { from: off.current, to: off.current + dir * 320, t0: now, dur: 450 };
    };

    const arrow =
        "absolute top-1/2 z-10 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md transition hover:border-indigo-400 hover:bg-indigo-500/30";
    const mask = "linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)";

    return (
        <div className={`relative ${className}`}>
            {arrows && (
                <>
                    <button type="button" aria-label="Slide left" onClick={() => nudge(-1)} className={`${arrow} left-1`}><ChevronLeft className="size-4" /></button>
                    <button type="button" aria-label="Slide right" onClick={() => nudge(1)} className={`${arrow} right-1`}><ChevronRight className="size-4" /></button>
                </>
            )}

            <div ref={box}
                className="cursor-grab select-none overflow-hidden active:cursor-grabbing [touch-action:pan-y]"
                style={fade ? { WebkitMask: mask, mask } : undefined}
                onPointerDown={(e) => {
                    if (e.pointerType === "mouse" && e.button !== 0) return;
                    drag.current = { on: true, x: e.clientX };
                    anim.current = null;
                    e.currentTarget.setPointerCapture(e.pointerId);
                }}
                onPointerMove={(e) => {
                    if (!drag.current.on) return;
                    off.current -= e.clientX - drag.current.x;      // follow the finger / mouse
                    drag.current.x = e.clientX;
                }}
                onPointerUp={() => { drag.current.on = false; holdUntil.current = performance.now() + 1000; }}
                onPointerCancel={() => { drag.current.on = false; holdUntil.current = performance.now() + 1000; }}
                onLostPointerCapture={() => { drag.current.on = false; }}>
                <div ref={track} className="flex w-max items-center will-change-transform" style={{ gap: gapPx, paddingRight: gapPx }}>
                    {Array.from({ length: copies }, (_, i) => (
                        <div key={i} className="contents" aria-hidden={i > 0 ? "true" : undefined}>{children}</div>
                    ))}
                </div>
            </div>
        </div>
    );
}