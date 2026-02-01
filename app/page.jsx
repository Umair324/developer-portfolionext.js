'use client';

import AboutOurApps from "@/sections/about-our-apps";
import GetInTouch from "@/sections/get-in-touch";
import HeroSection from "@/sections/hero-section";
import OurLatestCreation from "@/sections/our-latest-creation";
import OurTestimonials from "@/sections/our-testimonials";
import CallToAction from "@/sections/subscribe-newsletter";
import SubscribeNewsletter from "@/sections/subscribe-newsletter";
import TrustedCompanies from "@/sections/trusted-companies";

export default function Page() {
    return (
        <main className="px-6 md:px-16 lg:px-24 xl:px-32">
            <HeroSection />
            <AboutOurApps />
            <OurLatestCreation />
            <OurTestimonials />
            <TrustedCompanies />
            <GetInTouch />
            <CallToAction />
        </main>
    );
}