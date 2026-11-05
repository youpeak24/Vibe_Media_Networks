import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Opportunities from "./components/Opportunities";
import Services from "./components/Services";
import Process from "./components/Process";
import FAQSection from "./components/FAQSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-gold-100 selection:text-gold-900">
      {/* Top Fixed Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />

        {/* Agency Profile & Overview */}
        <About />

        {/* Active Careers, Telecalling, WFH & Freelance Opportunities */}
        <Opportunities />

        {/* Core Capabilities & Operations */}
        <Services />

        {/* 4-Step Application & Onboarding Process */}
        <Process />

        {/* Frequently Asked Questions */}
        <FAQSection />

        {/* Official Contact & Application Form (Nodemailer Backend Connected) */}
        <ContactSection />
      </main>

      {/* Footers */}
      <Footer />
    </div>
  );
}
