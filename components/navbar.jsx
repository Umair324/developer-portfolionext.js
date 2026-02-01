'use client';

import { useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import img from '../public/assets/lom.png'
export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navlinks = [
        {
            href: "/",
            text: "Home",
        },
        {
            href: "#about",
            text: "Meet Me",
        },
         {
            href: "#creations",
            text: "Core Skills",
        },
        {
            href: "#testimonials",
            text: "Creations",
        },
        {
            href: "#contact",
            text: "Let’s Talk",
        },
    ];
    return (
        <>
            <motion.nav className="sticky top-0 z-50 flex items-center justify-between w-full h-18 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}>
                    <a href="/" className="flex items-center">
  <Image
    src={img}
    alt="Umair Logo"
    width={55}
    className=" object-contain"
  />
  <span className="text-lg font-semibold tracking-tight leading-none ">
    Umair
  </span>
</a>

                <div className="hidden lg:flex items-center gap-8 text-[15px] font-bold transition duration-500">
                    {navlinks.map((link) => (
                        <Link key={link.href} href={link.href} className="hover:text-slate-300 transition">
                            {link.text}
                        </Link>
                    ))}
                </div>

                <div className="hidden lg:block space-x-3">
                    <Link href={'/#contact'}>
                    <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-md active:scale-95">
                        Get In Touch
                    </button>
                    </Link>
                </div>
                <button onClick={() => setIsMenuOpen(true)} className="lg:hidden active:scale-90 transition">
                    <MenuIcon className="size-6.5" />
                </button>
            </motion.nav>
            <div className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 lg:hidden transition-transform duration-400 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                {navlinks.map((link) => (
                    <Link key={link.href} href={link.href} onNavigate={() => setIsMenuOpen(false)}>
                        {link.text}
                    </Link>
                ))}
                <button onClick={() => setIsMenuOpen(false)} className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-slate-100 hover:bg-slate-200 transition text-black rounded-md flex">
                    <XIcon />
                </button>
            </div>
        </>
    );
}