import React from "react";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Briefcase,
  Users,
  PhoneCall,
  Laptop,
} from "lucide-react";
import VibeLogo from "./VibeLogo";
import { AGENCY } from "../utils/constants";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50 border-b border-slate-200/60 overflow-hidden">
      {/* Background ambient blurs */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-gold-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-brand-50/80 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-50 border border-gold-300/60 text-gold-800 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {AGENCY.name} • {AGENCY.tagline}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight font-display leading-[1.15]">
              Digital Talent Scouting & <br />
              <span className="text-gold-gradient">
                Media Career Opportunities
              </span>
            </h1>

            {/* Agency Statement */}
            <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              We connect digital creators with leading brands, execute
              influencer marketing campaigns, and offer active career openings
              in <strong>Marketing</strong>, <strong>Telecalling</strong>,{" "}
              <strong>Work From Home</strong>, and <strong>Freelancing</strong>{" "}
              across India.
            </p>

            {/* Opportunity Badges */}
            <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-slate-700 font-semibold">
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                <Users className="w-4 h-4 text-gold-600" />
                <span>Talent Scouting</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                <PhoneCall className="w-4 h-4 text-gold-600" />
                <span>Telecalling Vacancies</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                <Laptop className="w-4 h-4 text-gold-600" />
                <span>Work From Home</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                <Briefcase className="w-4 h-4 text-gold-600" />
                <span>Marketing & Freelance</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <a
                href="#contact"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all"
              >
                <span>Submit Application / Inquiry</span>
                <ArrowRight className="w-4 h-4 text-gold-400" />
              </a>

              <a
                href="#opportunities"
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold text-sm sm:text-base hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm"
              >
                <span>View Job Categories</span>
              </a>
            </div>
          </div>

          {/* Right Hero Column: Agency Portal Overview Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="relative bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-card hover:shadow-card-hover transition-all">
                {/* Agency Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <VibeLogo size="small" />
                  <span className="text-[10px] font-bold tracking-widest text-gold-700 uppercase px-2.5 py-1 rounded bg-gold-50 border border-gold-200">
                    AGENCY PORTAL
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-display mb-1">
                  Active Agency Divisions
                </h3>
                <p className="text-xs text-slate-500 mb-5 font-medium">
                  Select your profile category and reach out via our official
                  form:
                </p>

                {/* Division items */}
                <div className="space-y-2.5 text-xs text-slate-700 mb-6">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-800">
                      Marketing & Brand Campaigns
                    </span>
                    <span className="text-[11px] font-bold text-gold-700 bg-gold-50 px-2 py-0.5 rounded border border-gold-200">
                      Open
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-800">
                      Telecalling & Outreach Roles
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Hiring
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-800">
                      Work From Home (WFH) & Part-Time
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-800">
                      Creator Scouting & Media Rights
                    </span>
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Scouting
                    </span>
                  </div>
                </div>

                {/* Call to action */}
                <a
                  href="#contact"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-sm transition-all"
                >
                  <span>Apply or Inquire via Form</span>
                  <ArrowRight className="w-4 h-4 text-gold-400" />
                </a>

                <div className="mt-4 text-center text-[11px] text-slate-500 font-medium">
                  {AGENCY.location} • {AGENCY.coverage}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
