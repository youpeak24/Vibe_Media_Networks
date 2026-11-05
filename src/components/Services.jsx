import React from "react";
import {
  Sparkles,
  TrendingUp,
  Award,
  Coins,
  Check,
  ArrowRight,
} from "lucide-react";
import { SERVICES } from "../utils/constants";

const iconMap = {
  Sparkles: Sparkles,
  TrendingUp: TrendingUp,
  Award: Award,
  Coins: Coins,
};

export default function Services() {
  return (
    <section
      id="services"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50/60 border-b border-slate-200/60 relative"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-50 border border-gold-200 text-gold-800 text-xs font-bold uppercase tracking-wider mb-4">
            Agency Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight">
            Our Core Services &{" "}
            <span className="text-gold-gradient">Operations</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Discover our spectrum of digital talent management, influencer
            marketing campaigns, and decentralized employment solutions.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES.map((service) => {
            const IconComponent = iconMap[service.icon] || Sparkles;
            return (
              <div
                key={service.id}
                className="rounded-3xl p-8 bg-white border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top bar with icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-700 shadow-sm">
                      <IconComponent className="w-7 h-7" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display mb-3">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Highlight bullets */}
                  <ul className="space-y-2.5 mb-8">
                    {service.highlights.map((highlight, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium"
                      >
                        <div className="w-4 h-4 rounded-full bg-gold-100 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 text-gold-700 stroke-[3]" />
                        </div>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card CTA */}
                <a
                  href="#contact"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 text-xs sm:text-sm font-bold transition-all group/btn"
                >
                  <span>
                    Inquire or Apply for {service.title.split(" ")[0]}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
