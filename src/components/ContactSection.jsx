import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Building2,
  MapPin,
  UserCheck,
  ShieldCheck,
} from "lucide-react";
import {
  OPPORTUNITY_CATEGORIES,
  INQUIRER_TYPES,
  WORK_MODES,
  INDIAN_STATES,
  AGENCY,
} from "../utils/constants";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    email: "",
    opportunityCategory: "Marketing & Brand Partnerships",
    inquirerType: "Job Seeker / Candidate",
    workMode: "Work From Home (Remote)",
    subject: "",
    state: "Tamil Nadu",
    district: "",
    fullAddress: "",
    content: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      let data = {};
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(
          response.status === 404
            ? "Endpoint /api/contact was not found (404). Please verify your deployment."
            : text || `Server error (${response.status})`,
        );
      }

      if (response.ok && data.success) {
        setSuccessMessage(
          data.message ||
            "Your inquiry/application has been received successfully.",
        );
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#D4AF37", "#0F172A", "#E5C05B", "#3B82F6"],
        });
        // Reset form
        setFormData({
          name: "",
          contactNumber: "",
          email: "",
          opportunityCategory: "Marketing & Brand Partnerships",
          inquirerType: "Job Seeker / Candidate",
          workMode: "Work From Home (Remote)",
          subject: "",
          state: "Tamil Nadu",
          district: "",
          fullAddress: "",
          content: "",
        });
      } else {
        setErrorMessage(
          data.error ||
            "Unable to submit your application. Please check all fields.",
        );
      }
    } catch (err) {
      console.error("Submission error:", err);
      setErrorMessage(
        err.message ||
          "Network connection error. Please ensure the backend server is running and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50/70 border-b border-slate-200/60 relative"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-50 border border-gold-200 text-gold-800 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Official Contact & Application Gateway
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-display">
            Get in Touch with{" "}
            <span className="text-gold-gradient">Vibe Media Networks</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            All candidates, content creators, and brand partners are requested
            to reach out exclusively through our official contact portal below.
          </p>
        </div>

        {/* Contact Form Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-card">
          {/* Success Banner */}
          {successMessage && (
            <div className="mb-8 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-4 animate-fade-in">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-emerald-900 font-display">
                  Submission Confirmed!
                </h4>
                <p className="text-xs sm:text-sm text-emerald-800 mt-1">
                  {successMessage}
                </p>
                <p className="text-xs text-emerald-700 mt-2 font-semibold">
                  Our team will review your application and respond within 24 to
                  48 hours.
                </p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs sm:text-sm animate-fade-in">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Submission Error:</span>{" "}
                {errorMessage}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Three Required Dropdowns */}
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-gold-100 text-gold-800 text-xs flex items-center justify-center font-bold">
                  1
                </span>
                <span>Opportunity & Engagement Details</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Dropdown 1: Opportunity Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Category / Opportunity *
                  </label>
                  <select
                    name="opportunityCategory"
                    required
                    value={formData.opportunityCategory}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:border-gold-500 focus:bg-white transition-all"
                  >
                    {OPPORTUNITY_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dropdown 2: Inquirer Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Applicant / Inquirer Type *
                  </label>
                  <select
                    name="inquirerType"
                    required
                    value={formData.inquirerType}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:border-gold-500 focus:bg-white transition-all"
                  >
                    {INQUIRER_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dropdown 3: Preferred Work Mode */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Preferred Work Mode *
                  </label>
                  <select
                    name="workMode"
                    required
                    value={formData.workMode}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:border-gold-500 focus:bg-white transition-all"
                  >
                    {WORK_MODES.map((mode) => (
                      <option key={mode} value={mode}>
                        {mode}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Contact Person Details */}
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-gold-100 text-gold-800 text-xs flex items-center justify-center font-bold">
                  2
                </span>
                <span>Personal & Contact Information</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Enter your full legal name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-gold-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Contact Number (Phone / WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-gold-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="yourname@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-gold-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Subject Line *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    placeholder="e.g. Application for Telecalling / Marketing Partnership"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-gold-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Location & Address */}
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-gold-100 text-gold-800 text-xs flex items-center justify-center font-bold">
                  3
                </span>
                <span>Location & Complete Address</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* State */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    State / Region *
                  </label>
                  <select
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:border-gold-500 focus:bg-white transition-all"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    District / City *
                  </label>
                  <input
                    type="text"
                    name="district"
                    required
                    placeholder="e.g. Chennai, Coimbatore, Bengaluru"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-gold-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Complete Full Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Complete Full Address (Door / Street / Area / Pincode) *
                </label>
                <textarea
                  name="fullAddress"
                  required
                  rows={2}
                  placeholder="Enter complete residential or business address including pincode"
                  value={formData.fullAddress}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-gold-500 focus:bg-white transition-all resize-none"
                />
              </div>
            </div>

            {/* Section 4: Content / Message */}
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-gold-100 text-gold-800 text-xs flex items-center justify-center font-bold">
                  4
                </span>
                <span>Content, Experience & Message</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Detailed Message / Qualifications / Campaign Goals *
                </label>
                <textarea
                  name="content"
                  required
                  rows={4}
                  placeholder="Provide your background, previous experience, availability hours, portfolio links, or specific campaign requirements..."
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-gold-500 focus:bg-white transition-all resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-gold-400" />
                    <span>Processing Submission...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 text-gold-400" />
                    <span>Submit Application / Inquiry</span>
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-slate-500 mt-3 font-medium">
                🔒 All submissions are securely routed to our management &
                recruiting inbox at Vibe Media Networks.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
