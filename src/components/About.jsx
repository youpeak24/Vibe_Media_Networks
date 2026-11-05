import React from "react";
import {
  Target,
  Users,
  Sparkles,
  Award,
  CheckCircle,
  Shield,
  ArrowRight,
} from "lucide-react";
import { AGENCY } from "../utils/constants";

export default function About() {
  return (
    <section
      id="about"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200/60 relative"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Agency Overview Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-slate-50 border border-slate-200/80 p-8 shadow-card">
              <div className="w-12 h-12 rounded-2xl bg-gold-100 border border-gold-300 flex items-center justify-center text-gold-700 mb-6">
                <Award className="w-6 h-6" />
              </div>

              <h3 className="text-2xl font-bold text-slate-900 font-display">
                Agency Purpose & Vision
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                "We cultivate a dynamic media environment where creators gain
                sustainable brand sponsorships, brands discover genuine audience
                reach, and talented individuals find fulfilling remote and
                part-time careers."
              </p>

              <div className="mt-6 pt-6 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-base font-bold text-slate-900 font-display">
                    {AGENCY.name}
                  </div>
                  <div className="text-xs text-gold-700 font-semibold">
                    {AGENCY.tagline}
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-200/70 text-slate-800">
                  {AGENCY.location}
                </span>
              </div>

              {/* Pillars */}
              <div className="mt-6 grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                  <span>Creator Scouting</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                  <span>Brand Campaigns</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                  <span>Telecalling Roles</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                  <span>Remote WFH Careers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Mission and Scope */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-50 border border-gold-200 text-gold-800 text-xs font-bold uppercase tracking-wider mb-4">
              About The Agency
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight leading-tight">
              Driving Digital Media Growth & <br className="hidden sm:block" />
              <span className="text-gold-gradient">
                Empowering Emerging Talent
              </span>
            </h2>

            <div className="mt-6 space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>
                <strong>Vibe Media Networks</strong> operates as a full-service
                Digital Talent & Media Scouting Agency. We specialize in
                scouting digital creators across video platforms, managing
                influencer marketing activations, and creating decentralized
                employment opportunities.
              </p>
              <p>
                Headquartered in <strong>Tamil Nadu, India</strong>, our talent
                and candidate network spans pan-India. We provide comprehensive
                infrastructure for brands seeking authentic reach and candidates
                seeking flexible work-from-home, telecalling, part-time, and
                freelancing positions.
              </p>
              <p>
                To maintain transparent and streamlined communication, all
                creator inquiries, partnership proposals, and job applications
                are processed exclusively through our centralized online contact
                gateway.
              </p>
            </div>

            {/* Quick action */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2"
              >
                <span>Submit Inquiry or Application</span>
                <ArrowRight className="w-4 h-4 text-gold-400" />
              </a>

              <a
                href="#services"
                className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all"
              >
                View Services & Divisions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
