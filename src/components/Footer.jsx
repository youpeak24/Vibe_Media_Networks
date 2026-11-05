import React from "react";
import { ArrowUp, MapPin, ShieldCheck, Send } from "lucide-react";
import VibeLogo from "./VibeLogo";
import { AGENCY } from "../utils/constants";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0B1320] text-slate-300 pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          {/* Col 1: Logo & Agency Info */}
          <div className="md:col-span-5 space-y-4">
            <VibeLogo size="default" variant="dark" />
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm font-medium">
              <strong className="text-white">{AGENCY.name}</strong> is a premier
              Digital Talent & Media Scouting Agency. Driving talent
              acquisition, influencer marketing campaigns, and remote career
              opportunities.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-gold-400" />
              <span>
                {AGENCY.location} • {AGENCY.coverage}
              </span>
            </div>
          </div>

          {/* Col 2: Navigation links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-white text-xs font-bold font-display uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a
                  href="#about"
                  className="text-slate-300 hover:text-gold-300 transition-colors font-medium"
                >
                  About Agency
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-slate-300 hover:text-gold-300 transition-colors font-medium"
                >
                  Services & Operations
                </a>
              </li>
              <li>
                <a
                  href="#opportunities"
                  className="text-slate-300 hover:text-gold-300 transition-colors font-medium"
                >
                  Careers & Vacancies
                </a>
              </li>
              <li>
                <a
                  href="#process"
                  className="text-slate-300 hover:text-gold-300 transition-colors font-medium"
                >
                  Application Process
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-slate-300 hover:text-gold-300 transition-colors font-medium"
                >
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-slate-300 hover:text-gold-300 transition-colors font-medium"
                >
                  Official Contact Portal
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Communication Policy */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-white text-xs font-bold font-display uppercase tracking-wider">
              Official Communication
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              To ensure all applications, talent submissions, and brand
              inquiries are securely recorded and tracked, all contact is
              processed exclusively through our online gateway.
            </p>
            <div className="pt-2">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-gold-300 text-xs font-bold border border-slate-700 transition-all"
              >
                <Send className="w-3.5 h-3.5 text-gold-400" />
                <span>Open Contact & Application Form</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} {AGENCY.name}. All rights reserved. •
            Digital Talent & Media Scouting Agency
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all text-xs font-semibold cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-gold-400" />
          </button>
        </div>
      </div>
    </footer>
  );
}
