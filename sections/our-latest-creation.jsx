import SectionTitle from "@/components/section-title";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function OurLatestCreation() {
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const sectionData = [
    {
      title: "React-Powered Interfaces",
      description:
        "Mastering React.js and Next.js to build high-performance web applications with seamless navigation and modern UI libraries.",
      image:
        "https://i.pinimg.com/1200x/cb/a0/b8/cba0b89d2bf2d96a1ed26edb5849f804.jpg",
      align: "object-center",
    },
    {
      title: "Modern Web Engineering",
      description:
        "Crafting robust web applications with a balanced blend of frontend precision and backend reliability using modern JavaScript technologies.",
      image:
        "https://i.pinimg.com/736x/7b/fd/87/7bfd875e85fbbed980e9df59bcde8579.jpg",
      align: "object-center",
    },
    {
      title: "Node.js Engineering",
      description:
        "Designing efficient backend systems with Node.js to power modern, data-driven web applications.",
      image:
        "https://i.pinimg.com/736x/86/32/c7/8632c75a281a61b786a600c303509cd0.jpg",
      align: "object-right",
    },
    {
      title: "GitHub & Version Control",
      description:
        "Managing code efficiently with GitHub through clean commits, structured workflows, and collaborative version control practices.",
      image:
        "https://i.pinimg.com/1200x/dc/16/3b/dc163b42fb863411d390c6dfba7ebf73.jpg",
      align: "object-center",
    },
    
  ];
  

  // Auto-slide ONLY on desktop
  useEffect(() => {
    if (isHovered || window.innerWidth < 1024) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % sectionData.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <section className="flex flex-col items-center px-4" id="creations">
      <SectionTitle
        title="Skills & Expertise"
        description="A curated set of technologies and tools I use to craft reliable, scalable, and modern web experiences."
      />

      {/* MOBILE / TABLET */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-5xl lg:hidden">
        {sectionData.map((data, index) => (
          <motion.div
            key={data.title}
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative h-[260px] rounded-xl overflow-hidden"
          >
            <img
              src={data.image}
              alt={data.title}
              className={`h-full w-full object-cover ${data.align}`}
            />
            <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-6 text-white">
              <h3 className="text-xl font-semibold">{data.title}</h3>
              <p className="text-sm mt-1">{data.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
{/* DESKTOP */}
<div className="hidden lg:flex items-center gap-4 w-full max-w-6xl mt-16">
  {sectionData.map((data, index) => (
    <motion.div
      key={data.title}
      onMouseEnter={() => {
        setIsHovered(true);
        setActiveIndex(index);
      }}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative h-[320px] rounded-xl overflow-hidden transition-all duration-500 cursor-pointer ${
        index === activeIndex ? "flex-[3]" : "flex-[1]"
      }`}
      initial={{ y: 100, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
    >
      <img
        src={data.image}
        alt={data.title}
        className={`h-full w-full object-cover ${data.align}`}
      />

      <div
        className={`absolute inset-0 flex flex-col justify-end p-8 text-white bg-black/50 transition-opacity duration-300 ${
          index === activeIndex ? "opacity-100" : "opacity-0"
        }`}
      >
        <h3 className="text-2xl font-semibold">{data.title}</h3>
        <p className="text-sm mt-2">{data.description}</p>
      </div>
    </motion.div>
  ))}
</div>

    </section>
  );
}
