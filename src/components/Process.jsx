import React from "react";
import { PROCESS_STEPS } from "../utils/constants";
import { ArrowRight, Zap, Send } from "lucide-react";

export default function Process() {
  return (
    <section
      id="process"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50/70 border-b border-slate-200/60 relative"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-50 border border-gold-200 text-gold-800 text-xs font-bold uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5" />
            Application & Partnership Process
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight">
            How We Onboard &{" "}
            <span className="text-gold-gradient">Collaborate</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            A structured, 4-step framework for candidate onboarding, brand
            campaigns, and creator representation.
          </p>
        </div>

        {/* 4-Step Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESS_STEPS.map((step, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Step Number */}
                <div className="text-3xl font-extrabold font-display text-gold-600 mb-4">
                  {step.step}
                </div>

                {/* Step Title */}
                <h3 className="text-lg font-bold text-slate-900 font-display mb-2">
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Indicator */}
              <div className="w-2 h-2 rounded-full bg-gold-400 mt-6" />
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-card flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
              Ready to submit your application or inquiry?
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Fill out the official form below to route your request directly to
              our team.
            </p>
          </div>
          <a
            href="#contact"
            className="shrink-0 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2"
          >
            <span>Proceed to Form</span>
            <ArrowRight className="w-4 h-4 text-gold-400" />
          </a>
        </div>
      </div>
    </section>
  );
}
