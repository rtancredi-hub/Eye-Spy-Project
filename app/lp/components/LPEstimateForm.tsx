"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { type Service } from "../../lib/types";
import { trackConversion } from "../../lib/analytics/trackConversion";

interface FormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  serviceType: string;
  message: string;
  website: string; // honeypot — humans leave this blank
}

type FormErrors = Partial<Record<keyof FormData, string>>;

// Shared estimate form for every /lp/* landing page (area + service
// landing pages, and any future ones). Submits to /api/estimate (Resend)
// and fires a Google Ads conversion event on submit — see docs/GOOGLE-TAG.md.
export default function LPEstimateForm({
  services,
  defaultService = "",
  successMessage = "we'll be in touch within 1 business day.",
  idPrefix = "lp",
  variant = "dark",
}: {
  services: Service[];
  defaultService?: string;
  successMessage?: string;
  // Keeps field ids unique when a page renders more than one form.
  idPrefix?: string;
  // "light" for forms on a white card (service LPs); area LPs stay dark.
  variant?: "dark" | "light";
}) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    address: "",
    serviceType: defaultService,
    message: "",
    website: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.serviceType) newErrors.serviceType = "Please select a service";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Submission failed");
      }
      trackConversion();
      setIsSubmitted(true);
    } catch {
      setSubmitError("Something went wrong — please try again or call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const t =
    variant === "light"
      ? {
          input: "bg-[#eceef2] text-brand-base placeholder:text-slate-500 focus:border-brand-accent focus:bg-white",
          border: "border-slate-300",
          label: "text-slate-600 font-semibold",
          optional: "text-slate-500",
          error: "text-red-600",
          heading: "text-brand-base",
          body: "text-slate-600",
          buttonHover: "hover:bg-brand-base hover:text-white",
          note: "text-slate-500",
        }
      : {
          input: "bg-brand-base text-white placeholder:text-slate-500 focus:border-brand-accent/70",
          border: "border-white/15",
          label: "text-slate-300",
          optional: "text-slate-400",
          error: "text-red-400",
          heading: "text-white",
          body: "text-slate-400",
          buttonHover: "hover:bg-white",
          note: "text-slate-400",
        };

  const inputClass = `w-full border px-4 py-3 rounded-sm text-sm outline-none transition-colors duration-200 ${t.input}`;
  const labelClass = `block text-xs uppercase tracking-widest mb-2 ${t.label}`;
  const fieldId = (name: string) => `${idPrefix}-${name}`;

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center text-center py-10 gap-4">
        <CheckCircle className="text-brand-accent" size={44} />
        <h3 className={`text-2xl font-bold ${t.heading}`} style={{ fontFamily: "var(--font-rajdhani)" }}>
          Request Received!
        </h3>
        <p className={`${t.body} leading-relaxed`} style={{ fontFamily: "var(--font-dm-sans)" }}>
          Thanks {formData.name.split(" ")[0]} — {successMessage}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <input
        type="text"
        name="website"
        value={formData.website}
        onChange={handleChange}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] w-px h-px overflow-hidden"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={fieldId("name")} className={labelClass} style={{ fontFamily: "var(--font-rajdhani)" }}>
            Full Name
          </label>
          <input
            id={fieldId("name")}
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Smith"
            className={`${inputClass} ${errors.name ? "border-red-500/50" : t.border}`}
            style={{ fontFamily: "var(--font-dm-sans)" }}
          />
          {errors.name && <p className={`${t.error} text-xs mt-1`}>{errors.name}</p>}
        </div>
        <div>
          <label htmlFor={fieldId("phone")} className={labelClass} style={{ fontFamily: "var(--font-rajdhani)" }}>
            Phone Number
          </label>
          <input
            id={fieldId("phone")}
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(555) 000-0000"
            className={`${inputClass} ${errors.phone ? "border-red-500/50" : t.border}`}
            style={{ fontFamily: "var(--font-dm-sans)" }}
          />
          {errors.phone && <p className={`${t.error} text-xs mt-1`}>{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label htmlFor={fieldId("email")} className={labelClass} style={{ fontFamily: "var(--font-rajdhani)" }}>
          Email Address
        </label>
        <input
          id={fieldId("email")}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john@example.com"
          className={`${inputClass} ${errors.email ? "border-red-500/50" : t.border}`}
          style={{ fontFamily: "var(--font-dm-sans)" }}
        />
        {errors.email && <p className={`${t.error} text-xs mt-1`}>{errors.email}</p>}
      </div>

      <div>
        <label htmlFor={fieldId("address")} className={labelClass} style={{ fontFamily: "var(--font-rajdhani)" }}>
          Property Address
        </label>
        <input
          id={fieldId("address")}
          name="address"
          type="text"
          value={formData.address}
          onChange={handleChange}
          placeholder="123 Main St, City, State"
          className={`${inputClass} ${errors.address ? "border-red-500/50" : t.border}`}
          style={{ fontFamily: "var(--font-dm-sans)" }}
        />
        {errors.address && <p className={`${t.error} text-xs mt-1`}>{errors.address}</p>}
      </div>

      <div>
        <label htmlFor={fieldId("service")} className={labelClass} style={{ fontFamily: "var(--font-rajdhani)" }}>
          Service Needed
        </label>
        <select
          id={fieldId("service")}
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          className={`${inputClass} ${errors.serviceType ? "border-red-500/50" : t.border}`}
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          <option value="" disabled>
            Select a service...
          </option>
          {services.map((s) => (
            <option key={s._id} value={s.slug}>
              {s.title}
            </option>
          ))}
        </select>
        {errors.serviceType && <p className={`${t.error} text-xs mt-1`}>{errors.serviceType}</p>}
      </div>

      <div>
        <label htmlFor={fieldId("message")} className={labelClass} style={{ fontFamily: "var(--font-rajdhani)" }}>
          Additional Details <span className={`${t.optional} normal-case tracking-normal font-sans`}>(optional)</span>
        </label>
        <textarea
          id={fieldId("message")}
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us about your property, any specific concerns, or questions..."
          rows={3}
          className={`${inputClass} ${t.border} resize-none`}
          style={{ fontFamily: "var(--font-dm-sans)" }}
        />
      </div>

      {submitError && (
        <p className={`${t.error} text-sm text-center`}>{submitError}</p>
      )}

      <div className="relative isolate mt-2">
      {/* Soft pulsing glow behind the submit button */}
      <span
        className="absolute -inset-1 -z-10 rounded-sm bg-brand-accent/40 blur-md animate-pulse motion-reduce:animate-none"
        aria-hidden
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className={`group w-full flex items-center justify-center gap-3 bg-brand-accent text-brand-base font-bold px-8 py-4 rounded-sm text-sm uppercase tracking-widest ${t.buttonHover} transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed`}
        style={{ fontFamily: "var(--font-rajdhani)" }}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            Submitting
            <span className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1 h-1 rounded-full bg-brand-base animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </span>
          </span>
        ) : (
          <>
            Get My Free Estimate
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
          </>
        )}
      </button>
      </div>

      <p className={`${t.note} text-xs text-center`} style={{ fontFamily: "var(--font-dm-sans)" }}>
        No spam. No commitment. Response within 1 business day.
      </p>
    </form>
  );
}
