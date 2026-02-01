'use client';
import Image from "next/image";
 import { Code2, Zap, Layers } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
    return (
        <motion.footer className="px-6 md:px-16 lg:px-24 xl:px-32 w-full text-sm text-slate-400 mt-40"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14">
                <div className="sm:col-span-2 lg:col-span-1">
                    <a href="/" className="flex items-center gap-1">
  <Image
    className="h-9 w-auto"
    src="/assets/lom.png"
    width={138}
    height={36}
    alt="logo"
  />
  <span className="text-white font-semibold text-lg tracking-wide">
    Umair
  </span>
</a>

                    <p className="text-sm/7 mt-6">Frontend developer specializing in modern web technologies, building performant, accessible, and maintainable interfaces.</p>
                </div>
                <div className="flex flex-col lg:items-center lg:justify-center">
                    <div className="flex flex-col text-sm space-y-2.5">
                        <h2 className="font-semibold mb-5 text-white">Portfolio</h2>
                        <a className="hover:text-slate-500 transition" href="/">Home</a>
                        <a className="hover:text-slate-500 transition" href="#about">Meet me<span className="text-xs text-white bg-indigo-600 rounded-md ml-2 px-2 py-1">Let’s connect !</span></a>
                        <a className="hover:text-slate-500 transition" href="#creations">Core Skills</a>
                        <a className="hover:text-slate-500 transition" href="#action">contact me</a>
                    </div>
                </div>
                  <div>
  <h2 className="font-semibold text-white mb-5">What I Focus On</h2>

  <div className="space-y-4 text-sm text-slate-400 max-w-sm">
    <div className="flex items-start gap-3">
      <Code2 className="size-5 text-indigo-400 mt-0.5" />
      <p className="hover:text-slate-500 transition">Clean, scalable frontend code.</p>
    </div>

    <div className="flex items-start gap-3">
      <Zap className="size-5 text-indigo-400 mt-0.5" />
      <p  className="hover:text-slate-500 transition">Fast, user-focused interfaces.</p>
    </div>

    <div className="flex items-start gap-3">
      <Layers className="size-5 text-indigo-400 mt-0.5" />
      <p  className="hover:text-slate-500 transition">Reusable, modern UI systems.</p>
    </div>
  </div>
                 </div>

            </div>
            <p className="py-4 text-center border-t mt-6 border-slate-700">
                @2026-All Right Reserved by umair.
            </p>
        </motion.footer>
    );
};