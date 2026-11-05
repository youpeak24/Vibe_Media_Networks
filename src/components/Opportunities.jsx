import React from "react";
import {
  PhoneCall,
  Megaphone,
  Clock,
  Laptop,
  PenTool,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { OPPORTUNITY_CATEGORIES } from "../utils/constants";

const OPPORTUNITY_ITEMS = [
  {
    title: "Marketing & Brand Partnerships",
    icon: Megaphone,
    tag: "Brand Deals & Campaigns",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    desc: "Coordinating high-impact influencer marketing campaigns, brand matchmaking, social promotions, and partnership management.",
    requirements: [
      "Brand campaign coordination",
      "Influencer pitching & negotiations",
      "Campaign performance tracking",
    ],
  },
  {
    title: "Telecalling & Client Outreach",
    icon: PhoneCall,
    tag: "Active Vacancies",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    desc: "Direct communication with digital creators, commercial brands, and agency partners to explain collaboration terms and set up meetings.",
    requirements: [
      "Good verbal communication skills",
      "Creator / Client relationship outreach",
      "Flexible day or evening shifts",
    ],
  },
  {
    title: "Part-Time Job Vacancies",
    icon: Clock,
    tag: "Flexible Hours",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    desc: "Flexible part-time roles suited for students, professionals, or homemakers looking to earn while contributing to digital media operations.",
    requirements: [
      "3–5 hours daily availability",
      "Basic computer & smartphone proficiency",
      "Task-oriented execution",
    ],
  },
  {
    title: "Work From Home (WFH) Vacancies",
    icon: Laptop,
    tag: "100% Remote",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    desc: "Completely remote positions across India covering digital research, talent data entry, lead verification, and customer assistance.",
    requirements: [
      "Stable internet & computer/mobile setup",
      "Self-motivated remote work ethic",
      "Available across all Indian states",
    ],
  },
  {
    title: "Freelancing Jobs & Gigs",
    icon: PenTool,
    tag: "Project Based",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    desc: "Project-based assignments for freelance video editors, graphic designers, copywriters, and content strategists.",
    requirements: [
      "Portfolio of past work or sample edits",
      "Turnaround time commitment",
      "Competitive per-project payouts",
    ],
  },
];

export default function Opportunities() {
  return (
    <section
      id="opportunities"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200/60 relative"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-50 border border-gold-200 text-gold-800 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Active Career & Collaboration Pathways
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight">
            Careers, Remote Roles &{" "}
            <span className="text-gold-gradient">Opportunities</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            Explore our open vacancies and freelance opportunities. All
            applications must be submitted directly through our official form
            below.
          </p>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {OPPORTUNITY_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl p-6 bg-slate-50/70 border border-slate-200/80 hover:border-gold-400 shadow-sm hover:shadow-card transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-sm">
                      <Icon className="w-6 h-6 text-gold-600" />
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${item.badgeColor}`}
                    >
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 font-display mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5">
                    {item.desc}
                  </p>

                  <div className="space-y-2 mb-6">
                    {item.requirements.map((req, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-xs text-slate-700 font-medium"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href="#contact"
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-900 hover:text-white border border-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Apply for this Role</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
