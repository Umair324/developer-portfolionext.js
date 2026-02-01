import SectionTitle from "@/components/section-title";
import { motion } from "framer-motion";
import {
  Linkedin,
  Twitter,
  Instagram,
  Github,
  Youtube,
  Facebook
} from "lucide-react";

export default function SocialMediaPresence() {
  const socials = [
    { name: "LinkedIn", icon: Linkedin, link: "https://www.linkedin.com/in/umair-rind-654a742a0/" },
    { name: "Twitter", icon: Twitter, link: "https://x.com/rasheed_um38752" },
    { name: "Instagram", icon: Instagram, link: "https://www.instagram.com/umair__rind/" },
    { name: "GitHub", icon: Github, link: "https://github.com/Umair324" },
    { name: "YouTube", icon: Youtube, link: "https://www.youtube.com/@umairrind-z9n" },
    { name: "Facebook", icon: Facebook, link: "https://www.facebook.com/share/17mioabxUw/?mibextid=wwXIfr" },
  ];

  return (
    <section className="flex flex-col items-center">
      <SectionTitle
        title="Connect with me"
        description="Stay updated and connected with me across my social media platforms."
      />

      <motion.div
        className="relative max-w-5xl py-20 mt-18 md:w-full overflow-hidden mx-2 md:mx-auto border border-indigo-900 flex flex-col md:flex-row items-center justify-center gap-20 bg-gradient-to-br from-[#401B98]/5 to-[#180027]/10 rounded-3xl p-6 md:p-14 text-white"
        initial={{ y: 150, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 320, damping: 70 }}
      >
        {/* glow */}
        <div className="absolute pointer-events-none top-10 -z-1 left-20 size-64 bg-gradient-to-br from-[#536DFF] to-[#4F39F6]/60 blur-[180px]" />
        <div className="absolute pointer-events-none bottom-10 -z-1 right-20 size-64 bg-gradient-to-br from-[#536DFF] to-[#4F39F6]/60 blur-[180px]" />

        {/* Left Content */}
        <div className="flex flex-col items-center md:items-start max-md:text-center">
          <span className="rounded-full text-sm px-4 py-1 text-indigo-300 bg-indigo-200/15">
            SOCIAL PRESENCE
          </span>

          <h1 className="text-3xl font-medium max-w-xl mt-5 bg-gradient-to-r from-white to-[#b6abff] text-transparent bg-clip-text">
            I'm active where my community is.
          </h1>

          <p className="text-base text-slate-400 max-w-lg mt-4">
            Follow me on social media for updates, insights, and behind-the-scenes
            content from me.
          </p>
        </div>

        {/* Social Icons */}
        <div className="grid grid-cols-3 gap-6 mt-10 md:mt-0">
          {socials.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.link}
                target="_blank"
                className="group flex items-center justify-center size-20 rounded-2xl border border-white/10 bg-white/5 hover:bg-indigo-500/10 hover:border-indigo-400 transition"
              >
                <Icon className="size-8 text-white/80 group-hover:text-indigo-400 transition" />
              </a>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
