import SectionTitle from "@/components/section-title";
import { motion } from "framer-motion";
import Link from "next/link";

export default function OurTestimonials() {
    const projects = [
 {
            title: "Restaurant Management",
            description: "A system designed to manage restaurant operations.",
            image: "/assets/umr.jpg",
            slug: "/projects/dashboard",
            github: "https://github.com/Umair324/Food-Resturant-site",
            live: "https://food-resturant-site.vercel.app/",
        },
        {
            title: "Netflix Demo",
            description: "Netflix Demo with a modern, responsive user interface.",
            image: "/assets/net.jpg",
            slug: "/projects/saas-landing",
            github: "https://github.com/Umair324/Netflex_Site",
            live: "https://my-netflex-site.netlify.app/",
        },
        {
            title: "Chat App",
            description: "Real-time chat application interface",
            image: "/assets/pr.jpg",
            slug: "/projects/dashboard",
            github: "https://github.com/Umair324/ChatApp-Front-End",
            live: "https://disney-demo-gvah.vercel.app/",
        },
         {
            title: "Portfolio",
            description: "A modern portfolio focused on clean design and real projects.",
            image: "/assets/por.jpg",
            slug: "/projects/dashboard",
            github: "https://github.com/Umair324/developer-portfolio",
            live: "https://developer-portfolio-green-ten.vercel.app/",
        },
        {
            title: "Crypto App",
            description: "A cryptocurrency app designed for monitoring prices and trends.",
            image: "/assets/umai.jpg",
            slug: "/projects/dashboard",
            github: "https://github.com/Umair324/ChatApp-Front-End",
            live: "https://disney-demo-gvah.vercel.app/",
        },
          {
            title: "Personal blog",
            description: "A personal vlogging website for publishing video content.",
            image: "/assets/vle.jpg",
            slug: "/projects/dashboard",
            github: "https://github.com/Umair324/personal-siteme",
            live: "https://my-vloging-site.netlify.app/",
        },
    ];

    return (
        <section className="flex flex-col items-center" id="testimonials">
            <SectionTitle
                title="My Creations"
                description="A selection of projects reflecting precision, creativity, and modern development."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-18 max-w-6xl mx-auto">
                {projects.map((project, index) => (
                    <motion.div
                        key={`${project.title}-${index}`}
                        className="group relative overflow-hidden rounded-xl border border-slate-800"
                        initial={{ y: 120, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{
                            delay: index * 0.15,
                            type: "spring",
                            stiffness: 260,
                            damping: 30,
                        }}
                    >
                        <Link href={project.slug} className="absolute inset-0 z-0" />
                       
                        <img
                            src={project.image}
                            alt={project.title}
                            className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />

                        <div className="absolute inset-0 z-10 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                            <h3 className="text-lg font-semibold text-white">
                                {project.title}
                            </h3>
                            <p className="text-sm text-gray-300 mt-2">
                                {project.description}
                            </p>

                            <div className="flex gap-3 mt-4">
                                <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="px-4 py-2 text-sm rounded-md bg-white/10 text-white border border-white/20 hover:bg-white/20 transition"
                                >
                                    GitHub
                                </a>

                                <a
                                    href={project.live}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="px-4 py-2 text-sm rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 hover:bg-indigo-500/30 transition"
                                >
                                    Live View
                                </a>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
