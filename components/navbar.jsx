'use client';

import { useEffect, useState } from "react";
import { MenuIcon, XIcon, CalendarCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import img from '../public/assets/lom.png'

// "/#..." links work from every page (for example from /book-demo), not only from the home page
const navlinks = [
    { href: "/", text: "Home", id: "home" },
    { href: "/#about", text: "Meet Me", id: "about" },
    { href: "/#creations", text: "Core Skills", id: "creations" },
    { href: "/#services", text: "Services", id: "services" },
    { href: "/#testimonials", text: "Creations", id: "testimonials" },
    { href: "/#contact", text: "Let’s Talk", id: "contact" },
];

const BOOK_HREF = "/book-demo";

export default function Navbar() {
    const pathname = usePathname();
    const onHome = pathname === "/";

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [active, setActive] = useState("home");

    // scroll progress + smart hide
    const { scrollY, scrollYProgress } = useScroll();
    const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
    useMotionValueEvent(scrollY, "change", (y) => {
        const prev = scrollY.getPrevious() ?? 0;
        setScrolled(y > 20);
        setHidden(y > prev && y > 300 && !isMenuOpen);
    });

    // highlight the link of the section currently on screen (only on the home page)
    useEffect(() => {
        if (!onHome) { setActive(null); return; }
        const els = navlinks.map((l) => document.getElementById(l.id)).filter(Boolean);
        if (!els.length) return;
        const io = new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
            { rootMargin: "-45% 0px -50% 0px" }
        );
        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, [onHome]);

    // close the mobile menu whenever the page changes
    useEffect(() => { setIsMenuOpen(false); }, [pathname]);

    // lock page scroll while mobile menu is open
    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isMenuOpen]);

    return (
        <>
            <motion.header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: hidden ? -120 : 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 28 }}>
                <nav className={`relative flex w-full min-w-0 max-w-6xl items-center justify-between gap-2 rounded-full border px-2.5 py-2 backdrop-blur-xl transition-all duration-500 md:px-4 ${
                    scrolled
                        ? "border-indigo-500/30 bg-black/70 shadow-[0_10px_40px_rgba(79,70,229,0.28)]"
                        : "border-white/10 bg-white/5"
                }`}>

                    {/* logo */}
                    <Link href="/" className="group flex min-w-0 items-center gap-2 pl-1">
                        <span className="relative shrink-0">
                            <span aria-hidden="true" className="absolute inset-0 rounded-full bg-indigo-500/40 blur-lg transition-opacity group-hover:opacity-100 md:opacity-0" />
                            <Image src={img} alt="Umair Logo" width={40} className="relative h-9 w-auto object-contain transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110 sm:h-10" />
                        </span>
                        <span className="truncate bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-lg font-semibold leading-none tracking-tight text-transparent">
                            Umair
                        </span>
                    </Link>

                    {/* desktop links */}
                    <div className="hidden items-center gap-1 lg:flex">
                        {navlinks.map((link) => {
                            const isActive = active === link.id;
                            return (
                                <Link key={link.href} href={link.href}
                                    className={`relative rounded-full px-4 py-2 text-[14px] font-semibold transition-colors ${
                                        isActive ? "text-white" : "text-slate-400 hover:text-white"
                                    }`}>
                                    {isActive && (
                                        <motion.span layoutId="nav-pill" aria-hidden="true"
                                            className="absolute inset-0 rounded-full border border-indigo-400/30 bg-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.35)]"
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                                    )}
                                    <span className="relative">{link.text}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* CTA: opens the Book a Demo page */}
                    <div className="hidden lg:block">
                        <Link href={BOOK_HREF} aria-current={pathname === BOOK_HREF ? "page" : undefined}>
                            <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                className="group relative flex items-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2 text-sm font-medium text-white shadow-[0_0_24px_rgba(79,70,229,0.55)]">
                                <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                                <CalendarCheck className="relative size-4 transition-transform group-hover:scale-110" />
                                <span className="relative">Book a Demo</span>
                            </motion.span>
                        </Link>
                    </div>

                    {/* mobile toggle */}
                    <button onClick={() => setIsMenuOpen(true)} aria-label="Open menu"
                        className="grid size-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 transition active:scale-90 lg:hidden">
                        <MenuIcon className="size-5" />
                    </button>

                    {/* scroll progress */}
                    <motion.span aria-hidden="true" style={{ scaleX: progress }}
                        className="absolute inset-x-8 bottom-0 h-px origin-left bg-gradient-to-r from-indigo-500 via-cyan-400 to-violet-500" />
                </nav>
            </motion.header>

            {/* mobile menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 overflow-y-auto overflow-x-hidden bg-black/90 px-4 py-10 backdrop-blur-xl sm:gap-6 lg:hidden"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                        <motion.div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/3 size-72 -translate-x-1/2 rounded-full bg-indigo-600/30 blur-3xl sm:size-80"
                            animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity }} />

                        {navlinks.map((link, i) => (
                            <motion.div key={link.href}
                                initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                                transition={{ delay: 0.08 * i + 0.1, type: "spring", stiffness: 200, damping: 20 }}>
                                <Link href={link.href} onClick={() => setIsMenuOpen(false)}
                                    className={`relative block text-2xl font-semibold transition-colors sm:text-3xl ${
                                        active === link.id ? "text-white" : "text-slate-400 hover:text-white"
                                    }`}>
                                    {link.text}
                                </Link>
                            </motion.div>
                        ))}

                        <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                            transition={{ delay: 0.08 * navlinks.length + 0.1, type: "spring", stiffness: 200, damping: 20 }}>
                            <Link href={BOOK_HREF} onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3 text-base font-medium text-white shadow-[0_0_24px_rgba(79,70,229,0.55)]">
                                <CalendarCheck className="size-5" /> Book a Demo
                            </Link>
                        </motion.div>

                        <motion.button onClick={() => setIsMenuOpen(false)} aria-label="Close menu"
                            initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}
                            transition={{ delay: 0.5, type: "spring" }}
                            className="mt-4 grid size-12 shrink-0 place-items-center rounded-full border border-indigo-400/40 bg-indigo-500/20 text-white transition active:scale-90">
                            <XIcon className="size-5" />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}