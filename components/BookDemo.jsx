"use client";
import { useEffect, useMemo, useState } from "react";
import SectionHeading from "@/components/section-heading";
import { AnimatePresence, motion, useAnimation, useReducedMotion } from "framer-motion";
import {
    AlertCircle, ArrowLeft, ArrowRight, Building2, CalendarCheck, CalendarDays, Check, ChevronLeft, ChevronRight,
    Clock, Copy, Download, Globe, Loader2, Mail, MessageCircle, Phone, Presentation, Rocket, Send, Sparkles, User, Video, Zap,
} from "lucide-react";

/* ====================================================================
   SETTINGS  (edit these)
   ==================================================================== */
const OWNER_EMAIL = "umairrindoffical@gmail.com";
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY; // same free key as the contact form
const OWNER_TZ = "UTC";                         // YOUR timezone name, e.g. "Europe/London" or "Asia/Dubai"
const WORK = { days: [1, 2, 3, 4, 5], start: 9, end: 17 }; // Mon–Fri, 09:00–17:00 in OWNER_TZ (0 = Sunday)
const STEP_MIN = 30;       // a start time every 30 minutes
const DAYS_AHEAD = 28;     // how far ahead people can book
const MIN_NOTICE_HOURS = 4; // earliest bookable time from now
const MAX_NOTES = 500;

const TYPES = [
    { id: "intro", title: "Quick Intro Call", min: 15, Icon: Zap, color: "#38bdf8", desc: "Share your idea and see if we’re a good fit." },
    { id: "demo", title: "Project Demo", min: 30, Icon: Presentation, color: "#a78bfa", desc: "A live walkthrough of relevant work and a plan for yours." },
    { id: "deep", title: "Deep-Dive Session", min: 45, Icon: Rocket, color: "#f472b6", desc: "Detailed scoping: tech choices, timeline and next steps." },
];
const PLATFORMS = [
    { id: "meet", label: "Google Meet", Icon: Video },
    { id: "zoom", label: "Zoom", Icon: Video },
    { id: "whatsapp", label: "WhatsApp call", Icon: MessageCircle },
    { id: "phone", label: "Phone call", Icon: Phone },
];
const INTERESTS = ["Business website", "Web app / SaaS", "E-commerce store", "Mobile app", "Backend / API", "Redesign / revamp", "Performance & SEO", "Not sure yet"];
const STEPS = [
    { label: "Demo type", Icon: Sparkles },
    { label: "Date & time", Icon: CalendarDays },
    { label: "Your details", Icon: User },
    { label: "Confirm", Icon: CalendarCheck },
];

/* ====================================================================
   Time-zone helpers (no libraries)
   ==================================================================== */
const pad = (n) => String(n).padStart(2, "0");

function tzOffsetMs(ts, tz) {
    const parts = Object.fromEntries(
        new Intl.DateTimeFormat("en-US", {
            timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit",
            hour: "2-digit", minute: "2-digit", second: "2-digit",
        }).formatToParts(new Date(ts)).map((p) => [p.type, p.value])
    );
    const asUtc = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
    return asUtc - Math.floor(ts / 1000) * 1000;
}
function zonedToUtc(y, m, d, h, mi, tz) {
    const guess = Date.UTC(y, m - 1, d, h, mi);
    let utc = guess - tzOffsetMs(guess, tz);
    utc = guess - tzOffsetMs(utc, tz); // second pass handles DST edges
    return utc;
}
const dayKey = (ts, tz) => new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(ts);
const fmtTime = (ts, tz) => new Intl.DateTimeFormat(undefined, { timeZone: tz, hour: "numeric", minute: "2-digit" }).format(ts);
const fmtDate = (ts, tz, o = { weekday: "long", day: "numeric", month: "long", year: "numeric" }) =>
    new Intl.DateTimeFormat(undefined, { timeZone: tz, ...o }).format(ts);

// every possible start time (as a real instant) for the next DAYS_AHEAD days, from the owner's weekly schedule
function buildSlots() {
    const today = Object.fromEntries(
        new Intl.DateTimeFormat("en-US", { timeZone: OWNER_TZ, year: "numeric", month: "2-digit", day: "2-digit" })
            .formatToParts(new Date()).map((p) => [p.type, p.value])
    );
    const out = [];
    for (let i = 0; i <= DAYS_AHEAD; i++) {
        const d = new Date(Date.UTC(+today.year, +today.month - 1, +today.day + i));
        if (!WORK.days.includes(d.getUTCDay())) continue;
        for (let mins = WORK.start * 60; mins < WORK.end * 60; mins += STEP_MIN) {
            const ts = zonedToUtc(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), Math.floor(mins / 60), mins % 60, OWNER_TZ);
            out.push({ ts, ownerMin: mins });
        }
    }
    return out;
}

function useCountdown(ts) {
    const [now, setNow] = useState(null);
    useEffect(() => {
        if (!ts) return;
        setNow(Date.now());
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, [ts]);
    if (!ts || !now) return null;
    const diff = Math.max(0, ts - now);
    return { d: Math.floor(diff / 864e5), h: Math.floor(diff / 36e5) % 24, m: Math.floor(diff / 6e4) % 60, s: Math.floor(diff / 1e3) % 60 };
}

/* calendar-file helpers */
const icsDate = (ts) => new Date(ts).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
function googleLink({ title, start, end, details, tz }) {
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${icsDate(start)}/${icsDate(end)}&details=${encodeURIComponent(details)}&ctz=${encodeURIComponent(tz)}`;
}
function downloadIcs({ title, start, end, details }) {
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Demo Booking//EN", "BEGIN:VEVENT",
        `UID:${start}@demo-booking`, `DTSTAMP:${icsDate(Date.now())}`, `DTSTART:${icsDate(start)}`, `DTEND:${icsDate(end)}`,
        `SUMMARY:${title}`, `DESCRIPTION:${details.replace(/\n/g, "\\n")}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "demo-booking.ics" });
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ====================================================================
   Small UI pieces
   ==================================================================== */
function Field({ Icon, label, name, type = "text", value, onChange, error, textarea, rows, maxLength }) {
    const base = "peer w-full bg-transparent pl-11 pr-4 pt-6 pb-2 text-sm text-white outline-none placeholder-transparent";
    const labelCls = `pointer-events-none absolute left-11 text-sm text-slate-500 transition-all duration-200
        ${textarea ? "top-5" : "top-1/2 -translate-y-1/2"}
        peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-indigo-300
        peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px]`;
    return (
        <div>
            <div className={`rounded-xl p-px transition-all duration-300 focus-within:bg-gradient-to-r focus-within:from-indigo-500 focus-within:via-cyan-400 focus-within:to-violet-500 focus-within:shadow-[0_0_28px_rgba(99,102,241,0.35)] ${error ? "bg-red-500/60" : "bg-white/10"}`}>
                <div className="relative rounded-[11px] bg-[#07070f]/90">
                    <Icon className={`pointer-events-none absolute left-4 size-4 text-slate-500 ${textarea ? "top-5" : "top-1/2 -translate-y-1/2"}`} />
                    {textarea ? (
                        <textarea id={name} name={name} rows={rows} value={value} onChange={onChange} maxLength={maxLength} placeholder=" " className={`${base} resize-none`} />
                    ) : (
                        <input id={name} name={name} type={type} value={value} onChange={onChange} placeholder=" " autoComplete={name} className={base} />
                    )}
                    <label htmlFor={name} className={labelCls}>{label}</label>
                </div>
            </div>
            <AnimatePresence>
                {error && (
                    <motion.p initial={{ opacity: 0, y: -6, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
                        <AlertCircle className="size-3.5" /> {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}

function Stepper({ step, onJump }) {
    return (
        <div className="relative mx-auto flex max-w-2xl items-start justify-between">
            <div className="absolute left-[12.5%] right-[12.5%] top-5 h-px bg-white/10" />
            <motion.div className="absolute left-[12.5%] top-5 h-px bg-gradient-to-r from-indigo-500 to-cyan-400"
                animate={{ width: `${(step / (STEPS.length - 1)) * 75}%` }} transition={{ type: "spring", stiffness: 120, damping: 20 }} />
            {STEPS.map((s, i) => {
                const done = i < step, active = i === step;
                return (
                    <button key={s.label} type="button" disabled={i > step} onClick={() => onJump(i)} className="relative z-10 flex w-1/4 flex-col items-center gap-2">
                        <motion.span animate={{ scale: active ? 1.15 : 1 }}
                            className={`grid size-10 place-items-center rounded-full border transition-colors ${
                                active ? "border-indigo-400 bg-indigo-600 shadow-[0_0_24px_rgba(99,102,241,0.7)]"
                                : done ? "border-emerald-400/60 bg-emerald-500/20 text-emerald-300" : "border-white/15 bg-[#07070f] text-slate-500"}`}>
                            {done ? <Check className="size-4" /> : <s.Icon className="size-4" />}
                        </motion.span>
                        <span className={`text-[11px] font-medium md:text-xs ${active ? "text-white" : "text-slate-500"}`}>{s.label}</span>
                    </button>
                );
            })}
        </div>
    );
}

function Confetti() {
    const colors = ["#818cf8", "#22d3ee", "#a78bfa", "#f472b6", "#34d399", "#fbbf24"];
    return (
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-24 z-20">
            {Array.from({ length: 32 }, (_, i) => {
                const a = (i / 32) * Math.PI * 2, r = 110 + (i % 5) * 28;
                return (
                    <motion.span key={i} className="absolute size-2 rounded-sm"
                        style={{ background: colors[i % colors.length] }}
                        initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
                        animate={{ x: Math.cos(a) * r, y: Math.sin(a) * r + 60, opacity: 0, scale: 0.4, rotate: 360 + i * 20 }}
                        transition={{ duration: 1.6 + (i % 4) * 0.2, ease: "easeOut" }} />
                );
            })}
        </div>
    );
}

/* ====================================================================
   Page
   ==================================================================== */
export default function BookDemo() {
    const prefersReduce = useReducedMotion();
    const [mounted, setMounted] = useState(false);
    const reduce = mounted ? prefersReduce : false;

    const [step, setStep] = useState(0);
    const [dir, setDir] = useState(1);
    const shake = useAnimation();

    const [type, setType] = useState("demo");
    const [platform, setPlatform] = useState("meet");
    const [interests, setInterests] = useState([]);

    const [tz, setTz] = useState("UTC");
    const [tzList, setTzList] = useState([]);
    const [month, setMonth] = useState(null);
    const [dateKey, setDateKey] = useState(null);
    const [slotTs, setSlotTs] = useState(null);

    const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", notes: "", botcheck: "" });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState("idle"); // idle | sending | success | error
    const [serverError, setServerError] = useState("");
    const [booked, setBooked] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setMounted(true);
        const detected = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
        setTz(detected);
        const list = typeof Intl.supportedValuesOf === "function" ? Intl.supportedValuesOf("timeZone") : [];
        setTzList(list.includes(detected) ? list : [detected, ...list]);
    }, []);

    const typeObj = TYPES.find((t) => t.id === type);
    const platformObj = PLATFORMS.find((p) => p.id === platform);
    const dur = typeObj.min;

    const allSlots = useMemo(() => (mounted ? buildSlots() : []), [mounted]);
    const valid = useMemo(() => {
        const earliest = Date.now() + MIN_NOTICE_HOURS * 36e5;
        return allSlots.filter((s) => s.ownerMin + dur <= WORK.end * 60 && s.ts > earliest);
    }, [allSlots, dur]);
    const byDay = useMemo(() => {
        const m = new Map();
        valid.forEach((s) => { const k = dayKey(s.ts, tz); if (!m.has(k)) m.set(k, []); m.get(k).push(s); });
        return m;
    }, [valid, tz]);
    const keys = useMemo(() => [...byDay.keys()].sort(), [byDay]);

    // keep calendar + selection consistent when type / timezone change
    useEffect(() => {
        if (!keys.length) return;
        if (!month) { const [y, m] = keys[0].split("-"); setMonth({ y: +y, m: +m - 1 }); }
        if (dateKey && !byDay.has(dateKey)) { setDateKey(null); setSlotTs(null); }
        else if (slotTs && !valid.some((s) => s.ts === slotTs)) setSlotTs(null);
    }, [keys, byDay, valid]); // eslint-disable-line react-hooks/exhaustive-deps

    const countdown = useCountdown(slotTs);

    /* ---------- calendar maths ---------- */
    const firstKey = keys[0], lastKey = keys[keys.length - 1];
    const monthIdx = month ? month.y * 12 + month.m : 0;
    const minIdx = firstKey ? +firstKey.slice(0, 4) * 12 + +firstKey.slice(5, 7) - 1 : 0;
    const maxIdx = lastKey ? +lastKey.slice(0, 4) * 12 + +lastKey.slice(5, 7) - 1 : 0;
    const goMonth = (n) => { const idx = monthIdx + n; setMonth({ y: Math.floor(idx / 12), m: idx % 12 }); };
    const todayKey = mounted ? dayKey(Date.now(), tz) : "";

    /* ---------- validation + navigation ---------- */
    const setF = (k) => (e) => {
        setForm((f) => ({ ...f, [k]: e.target.value }));
        if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
    };
    const validate = (s) => {
        const er = {};
        if (s === 1 && !slotTs) er.slot = "Please pick a date and a time";
        if (s === 2) {
            if (form.name.trim().length < 2) er.name = "Please enter your name";
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) er.email = "Enter a valid email address";
            if (form.phone && form.phone.replace(/\D/g, "").length < 6) er.phone = "Enter a valid phone number";
        }
        setErrors(er);
        if (Object.keys(er).length) { shake.start({ x: [0, -8, 8, -6, 6, 0], transition: { duration: 0.4 } }); return false; }
        return true;
    };
    const go = (n) => { setDir(n > step ? 1 : -1); setStep(n); };
    const next = () => { if (validate(step)) go(step + 1); };

    const toggleInterest = (x) => setInterests((l) => (l.includes(x) ? l.filter((i) => i !== x) : [...l, x]));

    const summary = () => {
        const start = slotTs, end = slotTs + dur * 60000;
        const title = `${typeObj.title} with Umair`;
        const details = [
            `${typeObj.title} (${dur} min) via ${platformObj.label}`,
            interests.length ? `Topics: ${interests.join(", ")}` : "",
            form.notes ? `Notes: ${form.notes}` : "",
            `Questions? ${OWNER_EMAIL}`,
        ].filter(Boolean).join("\n");
        return { start, end, title, details, tz };
    };

    const submit = async () => {
        if (form.botcheck) return;
        if (!ACCESS_KEY) {
            setServerError("Form key missing. Add NEXT_PUBLIC_WEB3FORMS_KEY to .env.local and restart the server.");
            setStatus("error");
            return;
        }
        setStatus("sending"); setServerError("");
        const s = summary();
        try {
            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({
                    access_key: ACCESS_KEY,
                    subject: `New demo booking: ${form.name} · ${fmtDate(slotTs, OWNER_TZ, { day: "numeric", month: "short" })} ${fmtTime(slotTs, OWNER_TZ)}`,
                    from_name: "Demo booking",
                    name: form.name, email: form.email, phone: form.phone || "-", company: form.company || "-",
                    demo_type: `${typeObj.title} (${dur} min)`, platform: platformObj.label,
                    interested_in: interests.join(", ") || "-",
                    time_for_visitor: `${fmtDate(slotTs, tz)} at ${fmtTime(slotTs, tz)} (${tz})`,
                    time_for_you: `${fmtDate(slotTs, OWNER_TZ)} at ${fmtTime(slotTs, OWNER_TZ)} (${OWNER_TZ})`,
                    start_utc: new Date(slotTs).toISOString(),
                    notes: form.notes || "-",
                }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message || "Something went wrong");
            setBooked({ ...s, type: typeObj, platform: platformObj, name: form.name, email: form.email });
            setStatus("success");
        } catch (err) {
            setServerError(err.message || "Could not send your request. Please try again.");
            setStatus("error");
        }
    };

    const copySummary = async () => {
        const b = booked;
        const text = `${b.title}\n${fmtDate(b.start, b.tz)} at ${fmtTime(b.start, b.tz)} (${b.tz})\n${b.type.min} min · ${b.platform.label}`;
        try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* ignore */ }
    };

    const reset = () => {
        setStatus("idle"); setBooked(null); setStep(0); setDir(1); setSlotTs(null); setDateKey(null);
        setForm({ name: "", email: "", phone: "", company: "", notes: "", botcheck: "" }); setInterests([]);
    };

    const outline = { WebkitTextStroke: "1.5px #a5b4fc", color: "transparent" };
    const big = { fontSize: "clamp(26px, 5.5vw, 60px)" };
    const variants = {
        enter: (d) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (d) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
    };

    /* ---------- calendar cells ---------- */
    const cells = [];
    if (month) {
        const first = new Date(Date.UTC(month.y, month.m, 1));
        const offset = (first.getUTCDay() + 6) % 7; // Monday first
        const days = new Date(Date.UTC(month.y, month.m + 1, 0)).getUTCDate();
        for (let i = 0; i < offset; i++) cells.push(null);
        for (let d = 1; d <= days; d++) cells.push(`${month.y}-${pad(month.m + 1)}-${pad(d)}`);
    }
    const monthLabel = month ? new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric", timeZone: "UTC" }).format(Date.UTC(month.y, month.m, 1)) : "";
    const daySlots = dateKey ? [...(byDay.get(dateKey) || [])].sort((a, b) => a.ts - b.ts) : [];

    return (
        <main className="relative flex justify-center px-4 pb-24 pt-32">
            <div className="relative w-full max-w-6xl">

                {/* ---------- title ---------- */}
                <div className="relative z-10 text-center">
                    <motion.span initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
                        className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-widest text-indigo-300 backdrop-blur-md">
                        <span className="relative flex size-2">
                            <motion.span className="absolute inline-flex size-full rounded-full bg-emerald-400" animate={{ scale: [1, 2.6], opacity: [0.7, 0] }} transition={{ duration: 1.6, repeat: Infinity }} />
                            <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                        </span>
                        SCHEDULE A CALL
                    </motion.span> 
                    <p className="mx-auto mt-4 max-w-xl text-sm text-slate-300">
                        Pick a time that suits you and tell me about your project. I’ll confirm your booking by email.
                    </p>
                </div>

                {status !== "success" && <div className="mt-12"><Stepper step={step} onJump={go} /></div>}

                <div className="relative mt-10">
                    <AnimatePresence mode="wait">
                        {status === "success" && booked ? (
                            /* ================= SUCCESS ================= */
                            <motion.div key="ok" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                                className="relative mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-md">
                                {!reduce && <Confetti />}
                                <div className="relative mx-auto grid size-24 place-items-center">
                                    {!reduce && [0, 1].map((i) => (
                                        <motion.span key={i} className="absolute inset-0 rounded-full border border-emerald-400/50"
                                            animate={{ scale: [1, 2], opacity: [0.6, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i }} />
                                    ))}
                                    <svg viewBox="0 0 52 52" className="size-24" fill="none">
                                        <motion.circle cx="26" cy="26" r="24" stroke="#34d399" strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
                                        <motion.path d="M15 27l8 8 14-16" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.5 }} />
                                    </svg>
                                </div>
                                <h2 className="mt-6 text-2xl font-semibold">Request received, {booked.name.split(" ")[0]}!</h2>
                                <p className="mt-2 text-sm text-slate-400">I’ll confirm your demo by email at <b className="text-slate-200">{booked.email}</b> shortly.</p>

                                <div className="mt-6 space-y-2 rounded-2xl border border-white/10 bg-black/30 p-4 text-left text-sm">
                                    <p className="flex items-center gap-2"><CalendarDays className="size-4 text-indigo-300" /> {fmtDate(booked.start, booked.tz)}</p>
                                    <p className="flex items-center gap-2"><Clock className="size-4 text-indigo-300" /> {fmtTime(booked.start, booked.tz)} – {fmtTime(booked.end, booked.tz)} ({booked.tz})</p>
                                    <p className="flex items-center gap-2"><booked.platform.Icon className="size-4 text-indigo-300" /> {booked.type.title} · {booked.platform.label}</p>
                                </div>

                                <div className="mt-6 flex flex-wrap justify-center gap-3">
                                    <motion.a href={googleLink(booked)} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-[0_0_24px_rgba(79,70,229,0.5)]">
                                        <CalendarDays className="size-4" /> Add to Google Calendar
                                    </motion.a>
                                    <motion.button type="button" onClick={() => downloadIcs(booked)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm transition hover:border-indigo-400">
                                        <Download className="size-4" /> Download .ics
                                    </motion.button>
                                    <motion.button type="button" onClick={copySummary} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm transition hover:border-indigo-400">
                                        {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />} {copied ? "Copied" : "Copy details"}
                                    </motion.button>
                                </div>
                                <button type="button" onClick={reset} className="mt-6 text-sm text-slate-400 underline-offset-4 hover:text-white hover:underline">Book another demo</button>
                            </motion.div>
                        ) : (
                            /* ================= WIZARD ================= */
                            <motion.div key="wizard" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">

                                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md md:p-8">
                                    <motion.div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent"
                                        animate={reduce ? {} : { opacity: [0.3, 1, 0.3] }} transition={{ duration: 3, repeat: Infinity }} />

                                    <AnimatePresence mode="wait" custom={dir} initial={false}>
                                        <motion.div key={step} custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.28 }}>

                                            {/* ---------- STEP 0: type ---------- */}
                                            {step === 0 && (
                                                <div className="space-y-8">
                                                    <div>
                                                        <h2 className="text-xl font-semibold">What kind of session do you need?</h2>
                                                        <div className="mt-4 grid gap-3 md:grid-cols-3">
                                                            {TYPES.map((t) => {
                                                                const sel = type === t.id;
                                                                return (
                                                                    <motion.button key={t.id} type="button" onClick={() => setType(t.id)} whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }}
                                                                        className="relative rounded-2xl border p-4 text-left transition-colors"
                                                                        style={{ borderColor: sel ? t.color : "rgba(255,255,255,0.1)", background: sel ? `${t.color}18` : "rgba(255,255,255,0.03)", boxShadow: sel ? `0 0 28px ${t.color}40` : "none" }}>
                                                                        <span className="grid size-10 place-items-center rounded-xl" style={{ background: `${t.color}25`, color: t.color }}><t.Icon className="size-5" /></span>
                                                                        <p className="mt-3 font-semibold">{t.title}</p>
                                                                        <p className="mt-1 text-xs leading-relaxed text-slate-400">{t.desc}</p>
                                                                        <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[11px]"><Clock className="size-3" /> {t.min} min</span>
                                                                        <AnimatePresence>
                                                                            {sel && (
                                                                                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                                                                                    className="absolute right-3 top-3 grid size-6 place-items-center rounded-full text-black" style={{ background: t.color }}>
                                                                                    <Check className="size-3.5" />
                                                                                </motion.span>
                                                                            )}
                                                                        </AnimatePresence>
                                                                    </motion.button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h3 className="text-sm font-medium text-slate-300">Preferred platform</h3>
                                                        <div className="mt-3 flex flex-wrap gap-2">
                                                            {PLATFORMS.map((p) => {
                                                                const sel = platform === p.id;
                                                                return (
                                                                    <motion.button key={p.id} type="button" onClick={() => setPlatform(p.id)} whileTap={{ scale: 0.94 }}
                                                                        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${sel ? "border-indigo-400 bg-indigo-500/20 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]" : "border-white/10 bg-white/5 text-slate-300 hover:border-indigo-400/50"}`}>
                                                                        <p.Icon className="size-4" /> {p.label}
                                                                    </motion.button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h3 className="text-sm font-medium text-slate-300">What are you interested in? <span className="text-slate-500">(optional)</span></h3>
                                                        <div className="mt-3 flex flex-wrap gap-2">
                                                            {INTERESTS.map((x) => {
                                                                const sel = interests.includes(x);
                                                                return (
                                                                    <motion.button key={x} type="button" onClick={() => toggleInterest(x)} whileTap={{ scale: 0.94 }}
                                                                        className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${sel ? "border-cyan-400/60 bg-cyan-500/15 text-white" : "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/40"}`}>
                                                                        <AnimatePresence initial={false}>{sel && <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: 16, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="overflow-hidden"><Check className="size-4 text-cyan-300" /></motion.span>}</AnimatePresence>
                                                                        {x}
                                                                    </motion.button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* ---------- STEP 1: date & time ---------- */}
                                            {step === 1 && (
                                                <div>
                                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                                        <h2 className="text-xl font-semibold">Pick a date & time</h2>
                                                        <label className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
                                                            <Globe className="size-4 text-indigo-300" />
                                                            <select value={tz} onChange={(e) => setTz(e.target.value)} aria-label="Time zone"
                                                                className="max-w-[200px] cursor-pointer bg-transparent text-xs outline-none">
                                                                {(tzList.length ? tzList : [tz]).map((z) => <option key={z} value={z} className="bg-[#07070f]">{z.replace(/_/g, " ")}</option>)}
                                                            </select>
                                                        </label>
                                                    </div>

                                                    {!mounted || !month ? (
                                                        <div className="mt-6 grid gap-6 md:grid-cols-2">
                                                            <div className="h-72 animate-pulse rounded-2xl bg-white/5" /><div className="h-72 animate-pulse rounded-2xl bg-white/5" />
                                                        </div>
                                                    ) : (
                                                        <div className="mt-6 grid gap-6 md:grid-cols-2">
                                                            {/* calendar */}
                                                            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                                                                <div className="mb-3 flex items-center justify-between">
                                                                    <button type="button" aria-label="Previous month" disabled={monthIdx <= minIdx} onClick={() => goMonth(-1)}
                                                                        className="grid size-8 place-items-center rounded-full border border-white/10 transition enabled:hover:border-indigo-400 disabled:opacity-30"><ChevronLeft className="size-4" /></button>
                                                                    <AnimatePresence mode="wait" initial={false}>
                                                                        <motion.span key={monthLabel} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="text-sm font-semibold">{monthLabel}</motion.span>
                                                                    </AnimatePresence>
                                                                    <button type="button" aria-label="Next month" disabled={monthIdx >= maxIdx} onClick={() => goMonth(1)}
                                                                        className="grid size-8 place-items-center rounded-full border border-white/10 transition enabled:hover:border-indigo-400 disabled:opacity-30"><ChevronRight className="size-4" /></button>
                                                                </div>
                                                                <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-slate-500">
                                                                    {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => <span key={d} className="py-1">{d}</span>)}
                                                                </div>
                                                                <div className="mt-1 grid grid-cols-7 gap-1">
                                                                    {cells.map((k, i) => {
                                                                        if (!k) return <span key={`e${i}`} />;
                                                                        const enabled = byDay.has(k), sel = dateKey === k, isToday = k === todayKey;
                                                                        return (
                                                                            <motion.button key={k} type="button" disabled={!enabled}
                                                                                onClick={() => { setDateKey(k); setSlotTs(null); setErrors({}); }}
                                                                                whileHover={enabled ? { scale: 1.12 } : {}} whileTap={enabled ? { scale: 0.9 } : {}}
                                                                                className={`relative aspect-square rounded-lg text-sm transition-colors ${
                                                                                    sel ? "bg-indigo-600 font-semibold text-white shadow-[0_0_18px_rgba(99,102,241,0.7)]"
                                                                                    : enabled ? "bg-white/5 text-white hover:bg-indigo-500/25" : "text-slate-600"} ${isToday && !sel ? "ring-1 ring-indigo-400/60" : ""}`}>
                                                                                {+k.slice(8)}
                                                                                {enabled && !sel && <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-emerald-400" />}
                                                                            </motion.button>
                                                                        );
                                                                    })}
                                                                </div>
                                                                <p className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500"><span className="size-1.5 rounded-full bg-emerald-400" /> Available day</p>
                                                            </div>

                                                            {/* slots */}
                                                            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                                                                <AnimatePresence mode="wait" initial={false}>
                                                                    {!dateKey ? (
                                                                        <motion.div key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                                            className="grid h-full min-h-[240px] place-items-center text-center text-sm text-slate-500">
                                                                            <div><CalendarDays className="mx-auto mb-3 size-8 text-slate-600" />Select a day to see available times</div>
                                                                        </motion.div>
                                                                    ) : (
                                                                        <motion.div key={dateKey} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                                                            <p className="mb-3 text-sm font-semibold">{fmtDate(daySlots[0].ts, tz, { weekday: "long", day: "numeric", month: "long" })}</p>
                                                                            <div className="grid max-h-[300px] grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
                                                                                {daySlots.map((s, i) => {
                                                                                    const sel = slotTs === s.ts;
                                                                                    return (
                                                                                        <motion.button key={s.ts} type="button" onClick={() => { setSlotTs(s.ts); setErrors({}); }}
                                                                                            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: Math.min(i, 12) * 0.03 }}
                                                                                            whileHover={{ y: -2 }} whileTap={{ scale: 0.94 }}
                                                                                            className={`rounded-lg border px-2 py-2 text-sm transition-colors ${sel ? "border-indigo-400 bg-indigo-600 font-semibold text-white shadow-[0_0_18px_rgba(99,102,241,0.6)]" : "border-white/10 bg-white/5 hover:border-indigo-400/60"}`}>
                                                                                            {fmtTime(s.ts, tz)}
                                                                                        </motion.button>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {mounted && keys.length === 0 && <p className="mt-6 text-center text-sm text-slate-400">No times available right now. Please email <a className="text-indigo-300 underline" href={`mailto:${OWNER_EMAIL}`}>{OWNER_EMAIL}</a>.</p>}
                                                    <AnimatePresence>{errors.slot && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 flex items-center gap-1.5 text-sm text-red-400"><AlertCircle className="size-4" /> {errors.slot}</motion.p>}</AnimatePresence>
                                                </div>
                                            )}

                                            {/* ---------- STEP 2: details ---------- */}
                                            {step === 2 && (
                                                <div>
                                                    <h2 className="text-xl font-semibold">Tell me about you</h2>
                                                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                                        <Field Icon={User} label="Your name" name="name" value={form.name} onChange={setF("name")} error={errors.name} />
                                                        <Field Icon={Mail} label="Email address" name="email" type="email" value={form.email} onChange={setF("email")} error={errors.email} />
                                                        <Field Icon={Phone} label="Phone / WhatsApp (optional)" name="phone" type="tel" value={form.phone} onChange={setF("phone")} error={errors.phone} />
                                                        <Field Icon={Building2} label="Company (optional)" name="company" value={form.company} onChange={setF("company")} />
                                                        <div className="sm:col-span-2">
                                                            <Field Icon={Send} label="What would you like to discuss? (optional)" name="notes" textarea rows={5} maxLength={MAX_NOTES} value={form.notes} onChange={setF("notes")} />
                                                            <p className="mt-1.5 text-right text-[11px] text-slate-500">{form.notes.length}/{MAX_NOTES}</p>
                                                        </div>
                                                        <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" value={form.botcheck} onChange={setF("botcheck")} className="hidden" aria-hidden="true" />
                                                    </div>
                                                </div>
                                            )}

                                            {/* ---------- STEP 3: review ---------- */}
                                            {step === 3 && (
                                                <div>
                                                    <h2 className="text-xl font-semibold">Review & confirm</h2>
                                                    <div className="mt-5 divide-y divide-white/10 rounded-2xl border border-white/10 bg-black/20">
                                                        {[
                                                            { l: "Session", v: `${typeObj.title} · ${dur} min`, s: 0 },
                                                            { l: "Platform", v: platformObj.label, s: 0 },
                                                            { l: "When", v: `${fmtDate(slotTs, tz)} · ${fmtTime(slotTs, tz)} (${tz})`, s: 1 },
                                                            { l: "Name", v: form.name, s: 2 },
                                                            { l: "Email", v: form.email, s: 2 },
                                                            ...(form.phone ? [{ l: "Phone", v: form.phone, s: 2 }] : []),
                                                            ...(interests.length ? [{ l: "Interested in", v: interests.join(", "), s: 0 }] : []),
                                                            ...(form.notes ? [{ l: "Notes", v: form.notes, s: 2 }] : []),
                                                        ].map((r, i) => (
                                                            <motion.div key={r.l} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                                                className="flex items-start justify-between gap-4 px-4 py-3 text-sm">
                                                                <span className="w-28 shrink-0 text-slate-400">{r.l}</span>
                                                                <span className="flex-1 break-words text-slate-100">{r.v}</span>
                                                                <button type="button" onClick={() => go(r.s)} className="text-xs text-indigo-300 hover:underline">Edit</button>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                    <p className="mt-4 text-xs text-slate-500">By confirming, you agree to be contacted by email about this booking.</p>
                                                    <AnimatePresence>
                                                        {status === "error" && (
                                                            <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                                                className="mt-4 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                                                                <AlertCircle className="mt-0.5 size-4 shrink-0" /> {serverError}
                                                            </motion.p>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>

                                    {/* nav buttons */}
                                    <div className="mt-8 flex items-center justify-between">
                                        <button type="button" onClick={() => go(step - 1)} disabled={step === 0 || status === "sending"}
                                            className="flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm transition enabled:hover:border-indigo-400 disabled:invisible">
                                            <ArrowLeft className="size-4" /> Back
                                        </button>
                                        {step < 3 ? (
                                            <motion.button type="button" onClick={next} animate={shake} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                                className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-2.5 text-sm font-medium text-white shadow-[0_0_28px_rgba(79,70,229,0.5)]">
                                                <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                                                <span className="relative">Continue</span><ArrowRight className="relative size-4 transition-transform group-hover:translate-x-1" />
                                            </motion.button>
                                        ) : (
                                            <motion.button type="button" onClick={submit} disabled={status === "sending"} whileHover={status === "sending" ? {} : { scale: 1.05 }} whileTap={status === "sending" ? {} : { scale: 0.95 }}
                                                className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-7 py-2.5 text-sm font-semibold text-black shadow-[0_0_28px_rgba(16,185,129,0.5)] disabled:opacity-80">
                                                <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                                                <span className="relative">{status === "sending" ? "Booking..." : "Confirm booking"}</span>
                                                {status === "sending" ? <Loader2 className="relative size-4 animate-spin" /> : <CalendarCheck className="relative size-4" />}
                                            </motion.button>
                                        )}
                                    </div>
                                </div>

                                {/* ---------- live summary ---------- */}
                                <aside className="space-y-4 lg:sticky lg:top-28">
                                    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md">
                                        <p className="text-xs font-semibold tracking-widest text-slate-400">YOUR DEMO</p>
                                        <div className="mt-4 flex items-center gap-3">
                                            <motion.span key={type} initial={{ scale: 0.6, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                                                className="grid size-11 place-items-center rounded-xl" style={{ background: `${typeObj.color}25`, color: typeObj.color }}><typeObj.Icon className="size-5" /></motion.span>
                                            <div>
                                                <p className="font-semibold leading-tight">{typeObj.title}</p>
                                                <p className="text-xs text-slate-400">{dur} min · {platformObj.label}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
                                            <AnimatePresence mode="wait" initial={false}>
                                                {slotTs ? (
                                                    <motion.div key={slotTs} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2">
                                                        <p className="flex items-center gap-2"><CalendarDays className="size-4 text-indigo-300" /> {fmtDate(slotTs, tz, { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</p>
                                                        <p className="flex items-center gap-2"><Clock className="size-4 text-indigo-300" /> {fmtTime(slotTs, tz)} – {fmtTime(slotTs + dur * 60000, tz)}</p>
                                                        <p className="flex items-center gap-2 text-xs text-slate-400"><Globe className="size-4" /> {tz.replace(/_/g, " ")}</p>
                                                    </motion.div>
                                                ) : (
                                                    <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-slate-500">No time selected yet</motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {countdown && (
                                            <div className="mt-4 border-t border-white/10 pt-4">
                                                <p className="text-[11px] text-slate-400">Starts in</p>
                                                <div className="mt-2 grid grid-cols-4 gap-2 text-center">
                                                    {[["d", "days"], ["h", "hrs"], ["m", "min"], ["s", "sec"]].map(([k, l]) => (
                                                        <div key={k} className="rounded-lg bg-black/30 py-2">
                                                            <div className="text-lg font-semibold tabular-nums">{pad(countdown[k])}</div>
                                                            <div className="text-[10px] text-slate-500">{l}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md">
                                        <p className="text-xs font-semibold tracking-widest text-slate-400">WHAT TO EXPECT</p>
                                        <ul className="mt-4 space-y-3 text-sm text-slate-300">
                                            {["A quick intro and understanding your goals", "A walkthrough of relevant work", "Ideas, rough timeline and next steps"].map((x, i) => (
                                                <motion.li key={x} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.12 }} className="flex items-start gap-2.5">
                                                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-emerald-500/20 text-emerald-300"><Check className="size-3" /></span>{x}
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>
                                </aside>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </main>
    );
}