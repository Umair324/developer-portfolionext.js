"use client";
import SectionHeading from "@/components/section-heading";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// EDIT HERE: tag, bullets, links and media of each project.
// Media priority: video (best, a screen recording in /public/assets) > embed:true (live site inside the frame) > image (gentle zoom).
// Leave github / live as "" and that button is hidden.
const projects = [
    {
        tag: "AI MOBILE APP · UI/UX",
        title: "Smarter AI Fog Care",
        description: "Smarter AI Fog Care is an AI vehicle radar and fleet monitoring mobile app designed for safer driving in fog and low visibility, with 360° detection, heavy truck alerts and a live fleet map.",
        points: [
            "360° AI vehicle radar with heavy truck alerts and collision warnings",
            "Live fleet map and real-time vehicle system status",
            "Dark, high-contrast mobile UI/UX built for night and fog driving",
        ],
        video: "",
        embed: false,
        image: "/assets/smarter-ai-fog-care.jpg",
        alt: "Smarter AI Fog Care mobile app UI/UX case study: vehicle radar, heavy truck alert, collision warning and fleet map screens",
        github: "", // TODO: add the GitHub link when you have it
        live: "",   // TODO: add the live link when you have it
    },
    {
        tag: "UI CLONE",
        title: "Netflix Demo",
        description: "Netflix Demo is a responsive Netflix-style streaming website built with a modern, clean user interface.",
        points: ["Movie rows and hero banner", "Fully responsive layout", "Deployed live on Netlify"],
        video: "",
        embed: false,
        image: "/assets/net.jpg",
        alt: "Netflix clone demo website with hero banner and movie rows",
        github: "https://github.com/Umair324/Netflex_Site",
        live: "https://my-netflex-site.netlify.app/",
    },
    {
        tag: "REAL-TIME",
        title: "Chat App",
        description: "Real-time chat application interface with a clean, modern messaging layout.",
        points: ["Modern chat interface", "Built with React", "Front-end repository on GitHub"],
        video: "",
        embed: false,
        image: "/assets/pr.jpg",
        alt: "Real-time chat app interface built with React",
        github: "https://github.com/Umair324/ChatApp-Front-End",
        live: "https://disney-demo-gvah.vercel.app/", // TODO: check, this looks like the wrong live link
    },
    {
        tag: "MARKETPLACE · FULL STACK",
        title: "Johi Mobile Mart",
        description: "Johi Mobile Mart is a mobile phone marketplace where people can buy and sell new and used phones, with search filters, PTA-approved listings, seller chat and an admin dashboard.",
        points: [
            "Buy phones with brand, price and PTA filters, plus call and WhatsApp seller buttons",
            "Step-by-step Sell Your Phone listing form and buyer-seller messaging",
            "User dashboard and admin panel to manage listings, users and reports",
        ],
        video: "",
        embed: false,
        image: "/assets/johi-mobile-mart.jpg",
        alt: "Johi Mobile Mart marketplace UI/UX case study: buy mobile, product detail, sell your phone, chat and dashboards",
        github: "https://github.com/Umair324/JohiMobileMart",
        live: "https://www.johimobilemart.online/",
    },
    {
        tag: "CRYPTO DASHBOARD",
        title: "XCrypto App",
        description: "XCrypto is a cryptocurrency tracking dashboard with live coin prices, market cap and supply data, and interactive price charts from 24 hours to 365 days.",
        points: [
            "Coin overview with 24h range, market cap, supply, all-time high and low",
            "Interactive price analytics chart with 24h, 7d, 30d, 365d and max ranges",
            "Explore and browse coins with paginated lists, responsive on mobile",
        ],
        video: "",
        embed: false,
        image: "/assets/xcrypto-dashboard.jpg",
        alt: "XCrypto cryptocurrency tracking dashboard: landing page, coin overview, price analytics chart and coin list",
        // TODO: these two links are the Shopping App for now. Replace them with the XCrypto links when you have them.
        github: "https://github.com/Umair324/Shopping-App-FullStack",
        live: "https://shopping-app-full-stack.vercel.app/",
    },
    {
        tag: "RESTAURANT WEBSITE",
        title: "Café Kaccho & Restaurants",
        description: "Café Kaccho is a responsive restaurant website for a Kashmiri chai café, with an online menu, photo gallery, brand story, location map and easy ordering through WhatsApp.",
        points: [
            "Authentic Kashmiri menu with easy ordering via WhatsApp",
            "Story, gallery, location and opening hours pages",
            "Mobile-friendly, fast and deployed live on Vercel",
        ],
        video: "",
        embed: false,
        image: "/assets/cafe-kaccho.jpg",
        alt: "Café Kaccho restaurant website UI/UX case study: home, story, menu, gallery, location and mobile pages",
        github: "https://github.com/Umair324/cafeKachho",
        live: "https://cafe-kachho.vercel.app/",
    },
];

// helps Google understand the list of projects
const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Web and mobile app projects by Umair Rind",
    itemListElement: projects.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
            "@type": "CreativeWork",
            name: p.title,
            description: p.description,
            author: { "@type": "Person", name: "Umair Rind" },
            ...(p.live ? { url: p.live } : {}),
        },
    })),
};

function Media({ p }) {
    if (p.video) return <video src={p.video} autoPlay muted loop playsInline aria-label={p.alt} className="size-full object-cover" />;
    if (p.embed)
        return (
            <iframe src={p.live} title={`${p.title} live preview`} loading="lazy" tabIndex={-1}
                className="origin-top-left pointer-events-none border-0 bg-white"
                style={{ width: "200%", height: "200%", transform: "scale(0.5)" }} />
        );
    return (
        <a href={p.image} target="_blank" rel="noopener noreferrer" aria-label={`Open the full ${p.title} preview`} className="block size-full cursor-zoom-in">
            <motion.img src={p.image} alt={p.alt || `${p.title} preview`} loading="lazy" className="size-full object-cover"
                animate={{ scale: [1, 1.07, 1], x: ["0%", "-1.5%", "0%"], y: ["0%", "-1%", "0%"] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />
        </a>
    );
}

function Step({ p, i }) {
    const ref = useRef(null);
    const inView = useInView(ref, { margin: "200px" });
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const scale = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0.88, 1, 1, 0.94]);
    const flip = i % 2 === 1;
    const num = String(i + 1).padStart(2, "0");

    return (
        <article ref={ref} className="relative grid md:grid-cols-2 items-center gap-8 md:gap-20 min-h-[75vh] py-14">
            <motion.div
                className={flip ? "md:order-2" : ""}
                initial={{ opacity: 0, x: flip ? 60 : -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
            >
                <span aria-hidden="true" className="block text-7xl md:text-9xl font-bold leading-none select-none text-transparent"
                    style={{ WebkitTextStroke: "2px rgba(79,70,229,0.55)" }}>{num}</span>
                <p className="mt-4 text-xs font-semibold tracking-widest text-indigo-400">{p.tag}</p>
                <h3 className="mt-2 text-2xl md:text-3xl font-semibold">{p.title}</h3>
                <p className="mt-3 text-slate-400 max-w-md">{p.description}</p>
                <ul className="mt-6 ml-1 border-l border-indigo-500/40 space-y-4 max-w-md">
                    {p.points.map((pt) => (
                        <li key={pt} className="relative pl-6 text-slate-300">
                            <span className="absolute -left-[5px] top-1.5 size-2.5 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" />
                            {pt}
                        </li>
                    ))}
                </ul>
                {(p.live || p.github) && (
                    <div className="flex gap-3 mt-8">
                        {p.live && (
                            <a href={p.live} target="_blank" rel="noopener noreferrer" aria-label={`View ${p.title} live`}
                                className="px-5 py-2.5 rounded-full text-sm bg-indigo-600 hover:bg-indigo-500 transition">Live View ↗</a>
                        )}
                        {p.github && (
                            <a href={p.github} target="_blank" rel="noopener noreferrer" aria-label={`${p.title} source code on GitHub`}
                                className="px-5 py-2.5 rounded-full text-sm border border-white/25 hover:bg-white/10 transition">GitHub</a>
                        )}
                    </div>
                )}
            </motion.div>

            <motion.div style={{ scale }} className={flip ? "md:order-1" : ""}>
                <div className="p-[3px] rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-400 to-purple-500 shadow-[0_0_60px_rgba(59,130,246,0.35)]">
                    <div className="rounded-[14px] bg-black overflow-hidden aspect-video">{inView && <Media p={p} />}</div>
                </div>
            </motion.div>
        </article>
    );
}

export default function OurTestimonials() {
    return (
        <section className="flex flex-col items-center" id="testimonials">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <SectionHeading
                title="My Creations"
                description="A selection of web apps, marketplaces and mobile app designs reflecting precision, creativity, and modern development."
            />
            <div className="relative w-full max-w-6xl mx-auto mt-12">
                <div aria-hidden="true" className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-indigo-500/40 to-transparent" />
                {projects.map((p, i) => (
                    <Step key={p.title} p={p} i={i} />
                ))}
            </div>
        </section>
    );
}