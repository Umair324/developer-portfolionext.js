import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import LenisScroll from "@/components/lenis-scroll";
import Footer from "@/components/footer";
import SiteBackground from "@/components/SiteBackground";

const poppins = Poppins({
    subsets: ["latin"],
    variable: "--font-poppins-next",
    weight: ["400", "500", "600", "700"],
    display: "swap",
});

export const metadata = {
    title: "Portfolio",
    description: "Developer's Portfolio",
    icons: {
        icon: "/icon.png",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={poppins.variable}>
            <body>
                <SiteBackground />
                <LenisScroll />
                <Navbar />
                {children}
                <Footer />
            </body>
        </html>
    );
}