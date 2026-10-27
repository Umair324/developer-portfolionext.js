"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView, useMotionValue, useReducedMotion } from "framer-motion";
import Link from "next/link";
import {
    ArrowUpRight, Bug, Boxes, Check, ChevronDown, Cloud, Database, Gauge, Globe, Layers,
    Layout, LayoutDashboard, MonitorSmartphone, MousePointerClick, PenTool, Plug, RefreshCw, Rocket,
    Search, Server, ShieldCheck, ShoppingCart, Smartphone, Sparkles, Wrench, X,
} from "lucide-react";
import SectionHeading from "@/components/section-heading";
import AutoSlider from "@/components/auto-slider";

/* ============================== DATA ============================== */
const CATS = [
    { id: "all", label: "All", color: "#818cf8" },
    { id: "frontend", label: "Frontend", color: "#38bdf8" },
    { id: "backend", label: "Backend", color: "#34d399" },
    { id: "fullstack", label: "Full Stack", color: "#a78bfa" },
    { id: "ecommerce", label: "E-commerce", color: "#f472b6" },
    { id: "mobile", label: "Mobile & PWA", color: "#fbbf24" },
    { id: "performance", label: "Performance & SEO", color: "#f97316" },
    { id: "support", label: "Support & DevOps", color: "#22d3ee" },
];
const catColor = (id) => CATS.find((c) => c.id === id)?.color ?? "#818cf8";

// Remove any service you don't offer, or edit the text freely.
const SERVICES = [
    { id: "frontend-dev", cat: "frontend", Icon: Layout, title: "Frontend Development",
      desc: "Fast, accessible and pixel-perfect interfaces built with React and Next.js.",
      tags: ["React", "Next.js", "Tailwind"],
      includes: ["Component-based architecture", "Responsive on every device", "State management (Redux / Context)", "Reusable UI libraries"] },
    { id: "landing", cat: "frontend", Icon: Globe, title: "Landing Pages & Business Sites",
      desc: "High-converting, fast-loading websites that present your brand with clarity.",
      tags: ["Responsive", "SEO-ready", "Fast"],
      includes: ["Custom design implementation", "Contact forms & lead capture", "Analytics setup", "Hosting-ready delivery"] },
    { id: "portfolio", cat: "frontend", Icon: Sparkles, title: "Portfolio & Personal Websites",
      desc: "Standout personal sites with smooth animations that tell your story.",
      tags: ["Animations", "Dark mode", "Showcase"],
      includes: ["Unique layout & branding", "Project showcase sections", "Micro-interactions", "Resume / CV download"] },
    { id: "webapps", cat: "frontend", Icon: LayoutDashboard, title: "Web Apps & Dashboards",
      desc: "Interactive single-page apps, admin panels and data dashboards.",
      tags: ["SPA", "Charts", "Real-time"],
      includes: ["Charts & data tables", "Role-based views", "Real-time updates", "Clean state handling"] },
    { id: "motion", cat: "frontend", Icon: MousePointerClick, title: "Animated & Interactive UI",
      desc: "Smooth motion design that makes your product feel alive.",
      tags: ["Framer Motion", "Scroll effects", "SVG"],
      includes: ["Page & scroll animations", "Hover & gesture interactions", "SVG & canvas effects", "Performance-friendly motion"] },
    { id: "design2code", cat: "frontend", Icon: PenTool, title: "Design to Code",
      desc: "Figma and XD designs turned into clean, pixel-perfect code.",
      tags: ["Figma", "Pixel-perfect", "Components"],
      includes: ["Design-system setup", "Pixel-accurate layouts", "Responsive breakpoints", "Hand-off friendly code"] },

    { id: "api", cat: "backend", Icon: Server, title: "Backend & REST APIs",
      desc: "Secure, scalable server-side logic with Node.js and Express.",
      tags: ["Node.js", "Express", "REST"],
      includes: ["Scalable API architecture", "Validation & error handling", "Docs (Postman / Swagger)", "Rate limiting & logging"] },
    { id: "database", cat: "backend", Icon: Database, title: "Database Design & Integration",
      desc: "Well-structured data layers that stay fast as you grow.",
      tags: ["MongoDB", "Schemas", "Queries"],
      includes: ["Schema modelling", "Indexing & optimisation", "Migrations & backups", "Secure connections"] },
    { id: "auth", cat: "backend", Icon: ShieldCheck, title: "Authentication & Security",
      desc: "Safe login systems and protection against common attacks.",
      tags: ["JWT", "OAuth", "Roles"],
      includes: ["Login / signup flows", "Social login (Google, GitHub)", "Roles & permissions", "Input sanitisation & hardening"] },
    { id: "integrations", cat: "backend", Icon: Plug, title: "Integrations & Payments",
      desc: "Connect your product to the tools and payment systems you rely on.",
      tags: ["Stripe", "Webhooks", "3rd-party APIs"],
      includes: ["Payment gateway setup", "Email & SMS services", "Webhooks & automation", "Maps, analytics & CRM"] },

    { id: "mern", cat: "fullstack", Icon: Layers, title: "Full-Stack MERN Applications",
      desc: "Complete products built end to end: database, API and interface.",
      tags: ["MongoDB", "Express", "React", "Node"],
      includes: ["End-to-end feature delivery", "API and UI built together", "Deployment included", "Clean, documented code"] },
    { id: "saas", cat: "fullstack", Icon: Rocket, title: "SaaS & MVP Development",
      desc: "Launch your idea fast with a solid, scalable first version.",
      tags: ["MVP", "Subscriptions", "Scalable"],
      includes: ["Feature scoping", "Subscription & billing", "User management", "Iterative releases"] },
    { id: "admin", cat: "fullstack", Icon: Boxes, title: "Admin Panels & CMS",
      desc: "Custom admin panels and headless CMS so you can manage content easily.",
      tags: ["Headless CMS", "CRUD", "Roles"],
      includes: ["Custom admin dashboard", "Headless CMS integration", "Media management", "Role-based access"] },

    { id: "store", cat: "ecommerce", Icon: ShoppingCart, title: "E-commerce Stores",
      desc: "Online stores with smooth browsing, cart and secure checkout.",
      tags: ["Cart", "Checkout", "Payments"],
      includes: ["Product catalogue & filters", "Cart & secure checkout", "Order management", "Inventory & coupons"] },

    { id: "mobile", cat: "mobile", Icon: Smartphone, title: "Mobile App Development",
      desc: "Smooth, app-like experiences for phones and tablets.",
      tags: ["Cross-platform", "UI/UX", "API ready"],
      includes: ["Cross-platform build", "Native-feel navigation & gestures", "Backend / API connection", "Store-ready guidance"] },
    { id: "pwa", cat: "mobile", Icon: MonitorSmartphone, title: "Progressive Web Apps",
      desc: "Installable, offline-ready web apps that behave like native apps.",
      tags: ["PWA", "Offline", "Push"],
      includes: ["Installable app experience", "Offline support", "Push notifications", "Fast loading"] },

    { id: "speed", cat: "performance", Icon: Gauge, title: "Performance Optimization",
      desc: "Make your site load faster and score higher on Core Web Vitals.",
      tags: ["Lighthouse", "Core Web Vitals", "Caching"],
      includes: ["Lighthouse audit & fixes", "Image & bundle optimisation", "Lazy loading & caching", "Core Web Vitals tuning"] },
    { id: "seo", cat: "performance", Icon: Search, title: "SEO & Accessibility",
      desc: "Be found on search engines and usable by everyone.",
      tags: ["Technical SEO", "WCAG", "Meta"],
      includes: ["Meta, OG & schema markup", "Semantic, accessible HTML", "Sitemaps & robots", "Keyboard & screen-reader support"] },

    { id: "bugs", cat: "support", Icon: Bug, title: "Bug Fixing & Refactoring",
      desc: "Find and fix issues, and clean up messy code before it slows you down.",
      tags: ["Debugging", "Code review", "Cleanup"],
      includes: ["Find & fix issues quickly", "Code review & cleanup", "Refactor legacy code", "Upgrade dependencies"] },
    { id: "deploy", cat: "support", Icon: Cloud, title: "Deployment & Hosting",
      desc: "Get your project live on reliable hosting with a proper pipeline.",
      tags: ["Vercel", "CI/CD", "Domains"],
      includes: ["Vercel / Netlify / VPS deployment", "Domain & SSL setup", "CI/CD pipelines", "Environment management"] },
    { id: "maintenance", cat: "support", Icon: Wrench, title: "Maintenance & Support",
      desc: "Ongoing updates and fixes so your website stays healthy.",
      tags: ["Updates", "Monitoring", "Support"],
      includes: ["Regular updates", "Monitoring & fixes", "Content changes", "Priority support"] },
    { id: "migration", cat: "support", Icon: RefreshCw, title: "Migration & Redesign",
      desc: "Move to a modern stack or give an old site a fresh look.",
      tags: ["React", "Next.js", "Redesign"],
      includes: ["Migrate to React / Next.js", "Redesign existing sites", "Version upgrades", "Smooth, safe launches"] },
];

const COUNTRIES = [
    // Asia
    ["pk", "Pakistan", "Asia"], ["in", "India", "Asia"], ["ae", "United Arab Emirates", "Asia"], ["sa", "Saudi Arabia", "Asia"],
    ["qa", "Qatar", "Asia"], ["kw", "Kuwait", "Asia"], ["bh", "Bahrain", "Asia"], ["om", "Oman", "Asia"], ["jo", "Jordan", "Asia"],
    ["tr", "Türkiye", "Asia"], ["sg", "Singapore", "Asia"], ["my", "Malaysia", "Asia"], ["id", "Indonesia", "Asia"], ["jp", "Japan", "Asia"],
    ["kr", "South Korea", "Asia"], ["bd", "Bangladesh", "Asia"], ["lk", "Sri Lanka", "Asia"], ["th", "Thailand", "Asia"],
    ["vn", "Vietnam", "Asia"], ["ph", "Philippines", "Asia"],
    // Europe
    ["gb", "United Kingdom", "Europe"], ["de", "Germany", "Europe"], ["fr", "France", "Europe"], ["nl", "Netherlands", "Europe"],
    ["es", "Spain", "Europe"], ["it", "Italy", "Europe"], ["se", "Sweden", "Europe"], ["no", "Norway", "Europe"], ["dk", "Denmark", "Europe"],
    ["fi", "Finland", "Europe"], ["ch", "Switzerland", "Europe"], ["at", "Austria", "Europe"], ["be", "Belgium", "Europe"],
    ["ie", "Ireland", "Europe"], ["pl", "Poland", "Europe"], ["pt", "Portugal", "Europe"], ["gr", "Greece", "Europe"],
    ["cz", "Czechia", "Europe"], ["ro", "Romania", "Europe"], ["hu", "Hungary", "Europe"], ["ua", "Ukraine", "Europe"],
    ["ee", "Estonia", "Europe"], ["lt", "Lithuania", "Europe"],
    // Americas
    ["us", "United States", "North America"], ["ca", "Canada", "North America"], ["mx", "Mexico", "North America"],
    ["br", "Brazil", "South America"], ["ar", "Argentina", "South America"], ["cl", "Chile", "South America"],
    ["co", "Colombia", "South America"], ["pe", "Peru", "South America"], ["uy", "Uruguay", "South America"],
    // Africa
    ["za", "South Africa", "Africa"], ["ng", "Nigeria", "Africa"], ["ke", "Kenya", "Africa"], ["eg", "Egypt", "Africa"],
    ["ma", "Morocco", "Africa"], ["gh", "Ghana", "Africa"], ["tn", "Tunisia", "Africa"],
    // Oceania
    ["au", "Australia", "Oceania"], ["nz", "New Zealand", "Oceania"],
].map(([code, name, region]) => ({ code, name, region }));
const REGIONS = ["All", "Asia", "Europe", "North America", "South America", "Africa", "Oceania"];

/* ============================== helpers ============================== */
// sends a message into the contact form (GetInTouch listens for this) and scrolls to it
function requestContact(message) {
    window.dispatchEvent(new CustomEvent("prefill-contact", { detail: { message } }));
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
}

function CountUp({ to, suffix = "" }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });
    const mv = useMotionValue(0);
    const [v, setV] = useState(0);
    useEffect(() => {
        if (!inView) return;
        const c = animate(mv, to, { duration: 1.8, ease: "easeOut" });
        const u = mv.on("change", (x) => setV(Math.round(x)));
        return () => { c.stop(); u(); };
    }, [inView, to, mv]);
    return <span ref={ref}>{v}{suffix}</span>;
}

function Flag({ code, className = "" }) {
    const [failed, setFailed] = useState(false);
    if (failed) return <span className="grid h-[21px] w-[28px] place-items-center rounded-[3px] bg-white/10 text-[9px] font-bold uppercase">{code}</span>;
    return (
        <img src={`https://flagcdn.com/w40/${code}.png`} srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
            width="28" height="21" alt="" loading="lazy" onError={() => setFailed(true)}
            className={`h-[21px] w-[28px] rounded-[3px] object-cover ${className}`} />
    );
}

function FlagSlider({ items, reverse, reduce }) {
    return (
        <AutoSlider reverse={reverse} reduce={reduce}>
            {items.map((c) => (
                <div key={c.code} className="flex items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 backdrop-blur-md">
                    <Flag code={c.code} /> {c.name}
                </div>
            ))}
        </AutoSlider>
    );
}

/* ============================== service card ============================== */
function ServiceCard({ s, index }) {
    const [open, setOpen] = useState(false);
    const color = catColor(s.cat);
    const Icon = s.Icon;
    const onMove = (e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    return (
        <motion.article layout onMouseMove={onMove}
            initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 220, damping: 24, delay: Math.min(index, 8) * 0.04 }}
            whileHover={{ y: -6 }}
            className="group relative self-start overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md">

            {/* cursor spotlight */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: `radial-gradient(260px circle at var(--mx,50%) var(--my,50%), ${color}30, transparent 70%)` }} />

            <div className="relative">
                <motion.span className="grid size-12 place-items-center rounded-xl border"
                    style={{ background: `${color}22`, borderColor: `${color}55`, color }}
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }} transition={{ duration: 0.5 }}>
                    <Icon className="size-6" />
                </motion.span>

                <h3 className="mt-4 text-lg font-semibold leading-snug">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.desc}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                    {s.tags.map((t) => (
                        <span key={t} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-slate-300">{t}</span>
                    ))}
                </div>

                <AnimatePresence initial={false}>
                    {open && (
                        <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden">
                            <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
                                {s.includes.map((x, i) => (
                                    <motion.li key={x} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                                        className="flex items-start gap-2 text-sm text-slate-300">
                                        <Check className="mt-0.5 size-4 shrink-0" style={{ color }} /> {x}
                                    </motion.li>
                                ))}
                            </div>
                        </motion.ul>
                    )}
                </AnimatePresence>

                <div className="mt-5 flex items-center justify-between gap-2">
                    <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open}
                        className="flex items-center gap-1 text-xs font-medium text-slate-400 transition hover:text-white">
                        What’s included
                        <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
                    </button>

                    {/* arrow: opens the Book a Demo page */}
                    <Link href="/book-demo" aria-label={`Book a demo about ${s.title}`} className="shrink-0">
                        <motion.span whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            className="grid size-8 place-items-center rounded-full bg-indigo-600 text-white shadow-[0_0_16px_rgba(79,70,229,0.5)]">
                            <ArrowUpRight className="size-4" />
                        </motion.span>
                    </Link>
                </div>
            </div>
        </motion.article>
    );
}

/* ============================== main ============================== */
export default function Services() {
    const prefersReduce = useReducedMotion();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const reduce = mounted ? prefersReduce : false;

    const [cat, setCat] = useState("all");
    const [q, setQ] = useState("");
    const [showAll, setShowAll] = useState(false);

    const [region, setRegion] = useState("All");
    const [cq, setCq] = useState("");
    const [showAllC, setShowAllC] = useState(false);
    const [country, setCountry] = useState(null);

    const filtering = cat !== "all" || q.trim() !== "";
    const list = useMemo(() => {
        const t = q.trim().toLowerCase();
        return SERVICES.filter((s) =>
            (cat === "all" || s.cat === cat) &&
            (!t || `${s.title} ${s.desc} ${s.tags.join(" ")}`.toLowerCase().includes(t)));
    }, [cat, q]);
    const shown = filtering || showAll ? list : list.slice(0, 9);

    const clist = useMemo(() => {
        const t = cq.trim().toLowerCase();
        return COUNTRIES.filter((c) => (region === "All" || c.region === region) && (!t || c.name.toLowerCase().includes(t)));
    }, [region, cq]);
    const cfiltering = region !== "All" || cq.trim() !== "";
    const cshown = cfiltering || showAllC ? clist : clist.slice(0, 18);

    const half = Math.ceil(COUNTRIES.length / 2);

    return (
        <section className="flex justify-center px-4 mt-28" id="services">
            <div className="relative w-full max-w-7xl md:px-6">

                {/* ---------- title ---------- */}
                <SectionHeading title="Services I offer" description="Everything you need to design, build, launch and maintain a modern website or web app, all in one place." />

                {/* ---------- stats ---------- */}
                <div className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-3">
                    {[
                        { n: SERVICES.length, s: "+", l: "Services" },
                        { n: COUNTRIES.length, s: "+", l: "Countries" },
                        { n: REGIONS.length - 1, s: "", l: "Regions" },
                    ].map((x, i) => (
                        <motion.div key={x.l} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-center backdrop-blur-md">
                            <div className="bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
                                <CountUp to={x.n} suffix={x.s} />
                            </div>
                            <p className="mt-1 text-xs text-slate-400">{x.l}</p>
                        </motion.div>
                    ))}
                </div>

                {/* ---------- filter bar ---------- */}
                <div className="mt-12 flex flex-col items-center gap-4">
                    <div className="relative w-full max-w-md">
                        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search services (e.g. React, SEO, payments)"
                            className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-11 pr-10 text-sm text-white outline-none backdrop-blur-md transition focus:border-indigo-400 focus:shadow-[0_0_24px_rgba(99,102,241,0.35)]" />
                        {q && (
                            <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                                <X className="size-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap justify-center gap-2">
                        {CATS.map((c) => {
                            const count = c.id === "all" ? SERVICES.length : SERVICES.filter((s) => s.cat === c.id).length;
                            const active = cat === c.id;
                            return (
                                <button key={c.id} type="button" onClick={() => setCat(c.id)}
                                    className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${active ? "text-white" : "text-slate-400 hover:text-white"}`}>
                                    {active && (
                                        <motion.span layoutId="svc-pill" aria-hidden="true" className="absolute inset-0 rounded-full border"
                                            style={{ background: `${c.color}25`, borderColor: `${c.color}70`, boxShadow: `0 0 20px ${c.color}40` }}
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                                    )}
                                    <span className="relative flex items-center gap-1.5">
                                        {c.label}
                                        <span className="rounded-full bg-white/10 px-1.5 text-[10px]">{count}</span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ---------- service cards ---------- */}
                <motion.div layout className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence mode="popLayout">
                        {shown.map((s, i) => <ServiceCard key={s.id} s={s} index={i} />)}
                    </AnimatePresence>
                </motion.div>

                {list.length === 0 && (
                    <p className="mt-10 text-center text-slate-400">
                        No service matches “{q}”. <button className="text-indigo-300 underline" onClick={() => { setQ(""); setCat("all"); }}>Reset filters</button>
                    </p>
                )}

                {!filtering && list.length > 9 && (
                    <div className="mt-8 flex justify-center">
                        <motion.button type="button" onClick={() => setShowAll((v) => !v)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-2.5 text-sm backdrop-blur-md transition hover:border-indigo-400">
                            {showAll ? "Show fewer" : `Show all ${list.length} services`}
                            <ChevronDown className={`size-4 transition-transform ${showAll ? "rotate-180" : ""}`} />
                        </motion.button>
                    </div>
                )}

                {/* ---------- countries ---------- */}
                <div className="mt-28">
                    <div className="text-center">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-widest text-indigo-300 backdrop-blur-md">
                            <span className="relative flex size-2">
                                <motion.span className="absolute inline-flex size-full rounded-full bg-emerald-400" animate={{ scale: [1, 2.6], opacity: [0.7, 0] }} transition={{ duration: 1.6, repeat: Infinity }} />
                                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                            </span>
                            WORKING REMOTELY WORLDWIDE
                        </span>
                        <h3 className="mt-5 text-3xl font-semibold md:text-4xl">
                            Open to work in{" "}
                            <motion.span className="bg-clip-text text-transparent"
                                style={{ backgroundImage: "linear-gradient(90deg,#fff,#a5b4fc,#6366f1,#22d3ee,#fff)", backgroundSize: "250% 100%" }}
                                animate={reduce ? {} : { backgroundPosition: ["0% 0%", "250% 0%"] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}>
                                {COUNTRIES.length}+ countries
                            </motion.span>
                        </h3>
                        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">
                            I work remotely with clients and teams across time zones. Wherever you are, let’s build something together.
                        </p>
                    </div>

                    <div className="mt-8 space-y-3">
                        <FlagSlider items={COUNTRIES.slice(0, half)} reduce={reduce} />
                        <FlagSlider items={COUNTRIES.slice(half)} reverse reduce={reduce} />
                    </div>

                    <div className="mt-10 flex flex-col items-center gap-4">
                        <div className="relative w-full max-w-sm">
                            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                            <input value={cq} onChange={(e) => setCq(e.target.value)} placeholder="Find your country"
                                className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-11 pr-4 text-sm text-white outline-none backdrop-blur-md transition focus:border-indigo-400 focus:shadow-[0_0_24px_rgba(99,102,241,0.35)]" />
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                            {REGIONS.map((r) => (
                                <button key={r} type="button" onClick={() => setRegion(r)}
                                    className={`relative rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${region === r ? "text-white" : "text-slate-400 hover:text-white"}`}>
                                    {region === r && (
                                        <motion.span layoutId="region-pill" aria-hidden="true" className="absolute inset-0 rounded-full border border-indigo-400/40 bg-indigo-500/20"
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                                    )}
                                    <span className="relative">{r}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <motion.div layout className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        <AnimatePresence mode="popLayout">
                            {cshown.map((c, i) => {
                                const active = country?.code === c.code;
                                return (
                                    <motion.button key={c.code} layout type="button" onClick={() => setCountry(active ? null : c)}
                                        initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
                                        transition={{ type: "spring", stiffness: 260, damping: 22, delay: Math.min(i, 12) * 0.02 }}
                                        whileHover={{ y: -4, scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                        className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-xs backdrop-blur-md transition-colors ${
                                            active ? "border-indigo-400 bg-indigo-500/20 text-white shadow-[0_0_24px_rgba(99,102,241,0.4)]" : "border-white/10 bg-white/5 text-slate-300 hover:border-indigo-400/60"
                                        }`}>
                                        <Flag code={c.code} />
                                        <span className="truncate">{c.name}</span>
                                    </motion.button>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>

                    {clist.length === 0 && <p className="mt-8 text-center text-slate-400">No country found. I’m open to remote work anywhere, so just reach out!</p>}

                    {!cfiltering && clist.length > 18 && (
                        <div className="mt-6 flex justify-center">
                            <motion.button type="button" onClick={() => setShowAllC((v) => !v)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-2.5 text-sm backdrop-blur-md transition hover:border-indigo-400">
                                {showAllC ? "Show fewer" : `Show all ${clist.length} countries`}
                                <ChevronDown className={`size-4 transition-transform ${showAllC ? "rotate-180" : ""}`} />
                            </motion.button>
                        </div>
                    )}

                    <AnimatePresence>
                        {country && (
                            <motion.div initial={{ opacity: 0, y: 20, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                <div className="mx-auto mt-8 flex max-w-xl flex-col items-center gap-3 rounded-2xl border border-indigo-400/30 bg-indigo-500/10 px-6 py-5 text-center backdrop-blur-md sm:flex-row sm:text-left">
                                    <Flag code={country.code} />
                                    <p className="text-sm text-slate-200">Based in <b>{country.name}</b>? I’d love to hear about your project.</p>
                                    <motion.button type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                        onClick={() => requestContact(`Hi Umair, I’m reaching out from ${country.name}. I’d like to discuss a project: `)}
                                        className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white">
                                        Contact me <ArrowUpRight className="size-4" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ---------- final call to action (keeps your #action anchor) ---------- */}
                <motion.div id="action" className="relative mt-20"
                    initial={{ y: 60, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, amount: 0.2 }}
                    transition={{ type: "spring", stiffness: 160, damping: 26 }}>

                    {/* card with a spinning gradient border + mouse spotlight */}
                    <div className="group relative overflow-hidden rounded-[1.75rem] p-px"
                        onMouseMove={(e) => {
                            const r = e.currentTarget.getBoundingClientRect();
                            e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                            e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                        }}>
                        <motion.span aria-hidden="true" className="absolute -inset-full"
                            style={{ background: "conic-gradient(from 0deg, transparent 0 55%, #6366f1 72%, #22d3ee 84%, #a855f7 92%, transparent)" }}
                            animate={reduce ? {} : { rotate: 360 }} transition={{ duration: 9, repeat: Infinity, ease: "linear" }} />

                        <div className="relative overflow-hidden rounded-[calc(1.75rem-1px)] bg-[#07070f] px-6 py-9 text-center md:px-12 md:py-12">

                            {/* dot grid */}
                            <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70"
                                style={{
                                    backgroundImage: "radial-gradient(rgba(165,180,252,0.22) 1.2px, transparent 1.4px)", backgroundSize: "30px 30px",
                                    maskImage: "radial-gradient(ellipse at center, #000 30%, transparent 80%)",
                                    WebkitMaskImage: "radial-gradient(ellipse at center, #000 30%, transparent 80%)",
                                }} />

                            {/* aurora blobs */}
                            <motion.div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-indigo-600/30 blur-[100px]"
                                animate={reduce ? {} : { x: [0, 80, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
                            <motion.div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full bg-cyan-500/20 blur-[100px]"
                                animate={reduce ? {} : { x: [0, -80, 0], y: [0, -40, 0], scale: [1, 1.25, 1] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />

                            {/* mouse spotlight */}
                            <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                style={{ background: "radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgba(99,102,241,0.28), transparent 70%)" }} />

                            {/* floating tech chips */}
                            {[
                                { t: "</>", cls: "left-[5%] top-[16%]", dur: 6 },
                                { t: "{ }", cls: "right-[6%] top-[20%]", dur: 7 },
                                { t: "React", cls: "left-[8%] top-[52%]", dur: 8 },
                                { t: "Next.js", cls: "right-[8%] top-[56%]", dur: 6.5 },
                            ].map((f, i) => (
                                <motion.span key={f.t} aria-hidden="true"
                                    className={`pointer-events-none absolute hidden rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-xs font-bold text-indigo-200 backdrop-blur-md lg:block ${f.cls}`}
                                    initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                                    transition={{ delay: 0.5 + i * 0.12, type: "spring" }}>
                                    <motion.span className="block"
                                        animate={reduce ? {} : { y: [0, -12, 0], rotate: [-4, 4, -4] }} transition={{ duration: f.dur, repeat: Infinity, ease: "easeInOut" }}>
                                        {f.t}
                                    </motion.span>
                                </motion.span>
                            ))}

                            <div className="relative z-10 mx-auto max-w-3xl">
                                {/* badge */}
                                <motion.span initial={{ opacity: 0, y: -16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                                    className="inline-flex items-center gap-2.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-[11px] font-semibold tracking-widest text-emerald-300">
                                    <span className="relative flex size-2">
                                        <motion.span className="absolute inline-flex size-full rounded-full bg-emerald-400" animate={{ scale: [1, 2.6], opacity: [0.7, 0] }} transition={{ duration: 1.6, repeat: Infinity }} />
                                        <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                                    </span>
                                    OPEN TO WORK
                                </motion.span>

                                {/* heading: words slide up, the last two shimmer */}
                                <h3 className="mt-4 flex flex-wrap justify-center gap-x-3 text-2xl font-semibold leading-tight md:text-4xl">
                                    {["Ready", "to", "start", "your", "next", "project?"].map((w, i) => {
                                        const hot = i >= 4;
                                        return (
                                            <span key={w} className="inline-block overflow-hidden pb-1">
                                                <motion.span className={`inline-block ${hot ? "bg-clip-text text-transparent" : "text-white"}`}
                                                    style={hot ? { backgroundImage: "linear-gradient(90deg,#fff,#a5b4fc,#6366f1,#22d3ee,#fff)", backgroundSize: "250% 100%" } : undefined}
                                                    initial={{ y: "110%", opacity: 0 }}
                                                    whileInView={{ y: 0, opacity: 1, ...(hot && !reduce ? { backgroundPosition: ["0% 0%", "250% 0%"] } : {}) }}
                                                    viewport={{ once: true }}
                                                    transition={{
                                                        y: { delay: 0.1 + i * 0.08, type: "spring", stiffness: 140, damping: 18 },
                                                        opacity: { delay: 0.1 + i * 0.08 },
                                                        backgroundPosition: { duration: 6, repeat: Infinity, ease: "linear" },
                                                    }}>
                                                    {w}
                                                </motion.span>
                                            </span>
                                        );
                                    })}
                                </h3>

                                <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.7, duration: 0.7 }}
                                    className="mx-auto mt-3 max-w-xl text-sm text-slate-400 md:text-base">
                                    Have a project in mind or looking for a frontend developer? I’m open to freelance, full-time, and collaboration opportunities.
                                </motion.p>

                                {/* buttons */}
                                <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.9, duration: 0.7 }}
                                    className="mt-6 flex flex-wrap items-center justify-center gap-3">
                                    <Link href="#contact">
                                        <motion.span whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
                                            className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-2.5 text-sm font-medium text-white shadow-[0_0_34px_rgba(79,70,229,0.55)]">
                                            <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                                            <span className="relative">Contact Me</span>
                                            <ArrowUpRight className="relative size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                        </motion.span>
                                    </Link>
                                    <Link href="#testimonials">
                                        <motion.span whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
                                            className="flex items-center rounded-full border border-white/15 bg-white/5 px-7 py-2.5 text-sm text-white/80 backdrop-blur-md transition-colors hover:border-indigo-400 hover:bg-white/10">
                                            View Projects
                                        </motion.span>
                                    </Link>
                                </motion.div>
                            </div>

                            {/* "Let's build / talk / launch" slider */}
                            <div className="relative z-10 mt-7">
                                <AutoSlider reduce={reduce} gapPx={40} speed={0.05}>
                                    {["Let’s build", "Let’s talk", "Let’s launch"].map((t) => (
                                        <span key={t} className="flex items-center gap-10 whitespace-nowrap">
                                            <span className="text-3xl font-black uppercase tracking-tighter md:text-5xl"
                                                style={{ WebkitTextStroke: "1px rgba(165,180,252,0.5)", color: "transparent" }}>
                                                {t}
                                            </span>
                                            <span aria-hidden="true" className="size-2 rounded-full bg-indigo-400/60" />
                                        </span>
                                    ))}
                                </AutoSlider>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}