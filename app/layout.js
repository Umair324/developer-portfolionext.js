import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import LenisScroll from "@/components/lenis-scroll";
import Footer from "@/components/footer";
import SiteBackground from "@/components/SiteBackground";

const poppins = Poppins({
    subsets: ["latin"],
    variable: "--font-poppins",
    weight: ["400", "500", "600", "700"],
    display: "swap",
});

export const metadata = {
    title: "Porfolio",
    description: "Developer's Portfolio",
   icons: {
        icon: "/icon.png", // This points to your new icon
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                 <SiteBackground />
                <Navbar />
                {children}
                <Footer />
            </body>
        </html>
    );
}
