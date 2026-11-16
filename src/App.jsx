import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Opportunities from "./components/Opportunities";
import Services from "./components/Services";
import Process from "./components/Process";
import FAQSection from "./components/FAQSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import Chatbot from "./components/chatbot/Chatbot";
import { chatConfig } from "./components/chatbot/chatConfig";

export default function App() {
  // Tells the chat assistant which section of the single-page site the visitor is on.
  const [hash, setHash] = useState("");
  useEffect(() => {
    const update = () => setHash(window.location.hash);
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

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

      {/* Floating AI chat assistant (Groq) */}
      <Chatbot config={chatConfig} page={`/${hash}`} />
    </div>
  );
}
