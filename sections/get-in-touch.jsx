"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertCircle, Check, Copy, Loader2, Mail, MessageSquare, Send, User } from "lucide-react";
import SectionHeading from "@/components/section-heading";

const EMAIL = "umairrindoffical@gmail.com";
// free key from https://web3forms.com  ->  put it in .env.local as NEXT_PUBLIC_WEB3FORMS_KEY
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
const MAX = 600;

/* ---------- one input with icon, floating label, animated gradient border ---------- */
function Field({ Icon, label, name, type = "text", value, onChange, error, textarea, rows, maxLength }) {
    const base =
        "peer w-full bg-transparent pl-11 pr-4 pt-6 pb-2 text-sm text-white outline-none placeholder-transparent";
    const labelCls =
        `pointer-events-none absolute left-11 text-sm text-slate-500 transition-all duration-200
         ${textarea ? "top-5" : "top-1/2 -translate-y-1/2"}
         peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-indigo-300
         peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px]`;
    return (
        <div>
            <div className={`rounded-xl p-px transition-all duration-300 focus-within:bg-gradient-to-r focus-within:from-indigo-500 focus-within:via-cyan-400 focus-within:to-violet-500 focus-within:shadow-[0_0_28px_rgba(99,102,241,0.35)] ${error ? "bg-red-500/60" : "bg-white/10"}`}>
                <div className="relative rounded-[11px] bg-[#07070f]/90">
                    <Icon className={`pointer-events-none absolute left-4 size-4 text-slate-500 transition-colors peer-focus:text-indigo-300 ${textarea ? "top-5" : "top-1/2 -translate-y-1/2"}`} />
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

function CopyEmail() {
    const [copied, setCopied] = useState(false);
    const copy = async () => {
        try { await navigator.clipboard.writeText(EMAIL); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* ignore */ }
    };
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-indigo-500/20 text-indigo-300"><Mail className="size-5" /></span>
            <div className="min-w-0 text-left">
                <p className="text-[11px] text-slate-400">Email me directly</p>
                <a href={`mailto:${EMAIL}`} className="block truncate text-sm font-medium text-white hover:text-indigo-300">{EMAIL}</a>
            </div>
            <motion.button type="button" onClick={copy} whileTap={{ scale: 0.85 }} aria-label="Copy email"
                className="ml-auto grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 transition hover:border-indigo-400">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span key={copied ? "c" : "n"} initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ duration: 0.15 }}>
                        {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
                    </motion.span>
                </AnimatePresence>
            </motion.button>
        </div>
    );
}

function Success({ onReset, reduce }) {
    return (
        <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="flex min-h-[380px] flex-col items-center justify-center text-center">
            <div className="relative grid size-24 place-items-center">
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
            <h3 className="mt-6 text-2xl font-semibold">Message sent!</h3>
            <p className="mt-2 max-w-xs text-sm text-slate-400">Thanks for reaching out. I’ll read your message and get back to you soon.</p>
            <motion.button onClick={onReset} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="mt-6 rounded-full border border-white/15 bg-white/5 px-6 py-2.5 text-sm transition hover:border-indigo-400">
                Send another message
            </motion.button>
        </motion.div>
    );
}

export default function GetInTouch() {
    const prefersReduce = useReducedMotion();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const reduce = mounted ? prefersReduce : false;

    const [values, setValues] = useState({ name: "", email: "", message: "", botcheck: "" });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState("idle"); // idle | sending | success | error
    const [serverError, setServerError] = useState("");
    const card = useRef(null);

    const set = (k) => (e) => {
        setValues((v) => ({ ...v, [k]: e.target.value }));
        if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
    };

    const validate = () => {
        const er = {};
        if (values.name.trim().length < 2) er.name = "Please enter your name";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) er.email = "Enter a valid email address";
        if (values.message.trim().length < 10) er.message = "Message should be at least 10 characters";
        setErrors(er);
        return Object.keys(er).length === 0;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (values.botcheck) return;            // spam bots fill the hidden field
        if (!validate()) return;
        if (!ACCESS_KEY) {
            setServerError("Form key missing. Add NEXT_PUBLIC_WEB3FORMS_KEY to .env.local and restart the server.");
            setStatus("error");
            return;
        }
        setStatus("sending"); setServerError("");
        try {
            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({
                    access_key: ACCESS_KEY,
                    subject: `New message from ${values.name} (portfolio)`,
                    from_name: "Portfolio contact form",
                    name: values.name, email: values.email, message: values.message,
                }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message || "Something went wrong");
            setStatus("success");
            setValues({ name: "", email: "", message: "", botcheck: "" });
        } catch (err) {
            setServerError(err.message || "Could not send. Please try again.");
            setStatus("error");
        }
    };

    // cursor spotlight on the form card (CSS variables, no re-render)
    const onMove = (e) => {
        const r = card.current.getBoundingClientRect();
        card.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.current.style.setProperty("--my", `${e.clientY - r.top}px`);
    };

    const sending = status === "sending";

    return (
        <section className="flex justify-center px-4 mt-28" id="contact">
            <div className="relative w-full max-w-7xl md:px-6">

                {/* shared heading (same style as About Me and Connect With Me) */}
                <SectionHeading title="Get In Touch" description="Have an idea or a project in mind? Send me a message and let’s talk about it." />

                <div className="mt-14 grid items-start gap-10 md:grid-cols-5">

                    {/* left: info */}
                    <motion.div className="flex flex-col items-center gap-6 max-md:text-center md:col-span-2 md:items-start"
                        initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 120, damping: 20 }}>

                        {/* animated mail orb */}
                        <div className="relative grid size-28 place-items-center">
                            <motion.span aria-hidden="true" className="absolute inset-0 rounded-full border border-dashed border-indigo-400/40"
                                animate={reduce ? {} : { rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} />
                            <motion.span aria-hidden="true" className="absolute inset-3 rounded-full bg-indigo-600/30 blur-xl"
                                animate={reduce ? {} : { scale: [1, 1.3, 1] }} transition={{ duration: 3, repeat: Infinity }} />
                            <motion.span className="relative grid size-16 place-items-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md"
                                animate={reduce ? {} : { y: [0, -8, 0], rotate: [-4, 4, -4] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                                <Mail className="size-7 text-indigo-200" />
                            </motion.span>
                            <motion.span aria-hidden="true" className="absolute -right-1 top-3 size-3 rounded-full bg-emerald-400"
                                animate={reduce ? {} : { scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />
                        </div>

                        <h3 className="max-w-md text-3xl font-semibold leading-tight md:text-4xl">
                            Let’s build something{" "}
                            <motion.span className="bg-clip-text text-transparent"
                                style={{ backgroundImage: "linear-gradient(90deg,#fff,#a5b4fc,#6366f1,#22d3ee,#fff)", backgroundSize: "250% 100%" }}
                                animate={reduce ? {} : { backgroundPosition: ["0% 0%", "250% 0%"] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}>
                                great
                            </motion.span>{" "}together.
                        </h3>

                        <span className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm backdrop-blur-md">
                            <span className="relative flex size-2.5">
                                <motion.span className="absolute inline-flex size-full rounded-full bg-emerald-400" animate={{ scale: [1, 2.6], opacity: [0.7, 0] }} transition={{ duration: 1.6, repeat: Infinity }} />
                                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-400" />
                            </span>
                            Open to work
                        </span>

                        <CopyEmail />
                    </motion.div>

                    {/* right: form */}
                    <motion.div ref={card} onMouseMove={onMove}
                        className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md md:col-span-3 md:p-8"
                        initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 120, damping: 20 }}>
                        <div aria-hidden="true" className="pointer-events-none absolute inset-0"
                            style={{ background: "radial-gradient(400px circle at var(--mx, 50%) var(--my, 0%), rgba(99,102,241,0.14), transparent 60%)" }} />

                        <AnimatePresence mode="wait">
                            {status === "success" ? (
                                <Success key="ok" reduce={reduce} onReset={() => setStatus("idle")} />
                            ) : (
                                <motion.form key="form" onSubmit={onSubmit} noValidate
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}
                                    className="relative grid gap-4 sm:grid-cols-2">
                                    <Field Icon={User} label="Your name" name="name" value={values.name} onChange={set("name")} error={errors.name} />
                                    <Field Icon={Mail} label="Email address" name="email" type="email" value={values.email} onChange={set("email")} error={errors.email} />
                                    <div className="sm:col-span-2">
                                        <Field Icon={MessageSquare} label="Your message" name="message" textarea rows={7} maxLength={MAX}
                                            value={values.message} onChange={set("message")} error={errors.message} />
                                        <p className="mt-1.5 text-right text-[11px] text-slate-500">{values.message.length}/{MAX}</p>
                                    </div>

                                    {/* honeypot: hidden from people, bots fill it */}
                                    <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" value={values.botcheck} onChange={set("botcheck")} className="hidden" aria-hidden="true" />

                                    <AnimatePresence>
                                        {status === "error" && (
                                            <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                                className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300 sm:col-span-2">
                                                <AlertCircle className="mt-0.5 size-4 shrink-0" /> {serverError}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>

                                    <motion.button type="submit" disabled={sending} whileHover={sending ? {} : { scale: 1.04 }} whileTap={sending ? {} : { scale: 0.96 }}
                                        className="group relative flex w-max items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-3 text-sm font-medium text-white shadow-[0_0_30px_rgba(79,70,229,0.5)] disabled:opacity-80 sm:col-span-2">
                                        <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                                        <span className="relative">{sending ? "Sending..." : "Send message"}</span>
                                        {sending ? (
                                            <Loader2 className="relative size-4 animate-spin" />
                                        ) : (
                                            <Send className="relative size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1" />
                                        )}
                                    </motion.button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}