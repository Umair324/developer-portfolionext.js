import SectionTitle from "@/components/section-title";
import { motion } from "framer-motion";

export default function AboutOurApps() {
    return (
        <section className="flex flex-col items-center" id="about">
            <SectionTitle
                title="Meet Me"
                description="Meet the mind shaping thoughtful, modern digital experiences"
            />

            <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-8 md:px-0 mt-18">
                
                {/* LEFT COLUMN — LARGE INTRO TEXT */}
                <motion.div
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 320, damping: 70 }}
                >
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-slate-100 leading-tight">
        Hi. I’m Umair,<br />
        Welcome  explore my work and experience.
    </h2>

                </motion.div>

              <motion.div
    initial={{ y: 50, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ delay: 0.15, type: "spring", stiffness: 320, damping: 70 }}
    className="space-y-8 relative"
>
    {/* PREMIUM DECORATIVE ACCENT */}
    <div className="hidden md:block absolute -left-6 top-2 bottom-2 w-[1px] bg-gradient-to-b from-transparent via-slate-700 to-transparent" />

    <p className="text-slate-400 text-[15px] md:text-[17px] leading-[1.8] font-light">
        Specializing in <span className="text-slate-100 font-semibold tracking-tight">React.js, Next.js, and the MERN stack</span>, 
        I bridge the gap between complex logic and elegant design. My approach centers on 
        <span className="text-slate-200 font-medium italic"> scalable architecture</span>, 
        ensuring that every line of code is as efficient as it is maintainable.
    </p>

    {/* THE PREMIUM CREATIVE QUOTE */}
    <div className="pt-4 flex flex-col gap-2">
        <span className="text-[10px] uppercase tracking-[0.4em] text-blue-500/80 font-bold">
            The Philosophy
        </span>
        <blockquote className="text-slate-500 text-sm md:text-base italic border-l-2 border-slate-800 pl-4 py-1">
            "Design is the visual language of trust; <span className="text-slate-400">code is the voice that makes it real."</span>
        </blockquote>
    </div>
</motion.div>
            </div>
        </section>
    );
}
