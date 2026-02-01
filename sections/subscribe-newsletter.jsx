import SectionTitle from "@/components/section-title";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="flex flex-col items-center" id="action">
      <SectionTitle
        title="Let’s build something great together"
        description="Have a project in mind or looking for a frontend developer? I’m open to freelance, full-time, and collaboration opportunities."
      />

      <motion.div
        className="relative mt-10 max-w-3xl w-full overflow-hidden rounded-3xl border border-indigo-900 bg-gradient-to-br from-[#401B98]/10 to-[#180027]/20 p-10 text-center"
        initial={{ y: 120, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 300, damping: 60 }}
      >
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 size-72 bg-indigo-500/30 blur-[160px]" />
        </div>

        <h2 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent">
          Ready to start your next project?
        </h2>

        <p className="mt-4 text-slate-400 max-w-xl mx-auto">
          Let’s turn your ideas into fast, modern, and user-friendly web experiences.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="#contact"
            className="rounded-full bg-indigo-600 px-8 py-3 text-sm font-medium text-white hover:bg-indigo-700 active:scale-95 transition"
          >
            Contact Me
          </Link>

          <Link
            href="#testimonials"
            className="rounded-full border border-white/15 px-8 py-3 text-sm text-white/80 hover:bg-white/5 transition"
          >
            View Projects
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
