"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import { type Service } from "../lib/types";
import { FALLBACK_SERVICES } from "../config/site";

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

export default function EstimateForm({
  services = FALLBACK_SERVICES,
  initialService = "",
}: {
  services?: Service[];
  initialService?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    address: "",
    serviceType: initialService,
    message: "",
    website: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const handleSelectService = (e: Event) => {
      const service = (e as CustomEvent<string>).detail;
      setFormData((prev) => ({ ...prev, serviceType: service }));
    };
    window.addEventListener("select-service", handleSelectService);
    return () => window.removeEventListener("select-service", handleSelectService);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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
    if (!formData.serviceType)
      newErrors.serviceType = "Please select a service type";
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
      setIsSubmitted(true);
    } catch {
      setSubmitError(
        "Something went wrong — please try again or call us directly.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  // Field label with PORT prefix in monospaced style
  const PortLabel = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
    <label
      htmlFor={htmlFor}
      className="flex items-center gap-2 text-xs mb-2"
      style={{ fontFamily: "var(--font-rajdhani)" }}
    >
      <span className="font-mono text-orange-700/60 tracking-widest uppercase text-[9px]">PORT /</span>
      <span className="uppercase tracking-widest text-text-secondary">{children}</span>
    </label>
  );

  const inputClass =
    `w-full bg-white border px-4 py-3 rounded-sm text-text-primary text-sm outline-none transition-colors duration-200 placeholder:text-text-subtle` +
    ` focus:border-brand-accent/40`;

  if (isSubmitted) {
    return (
      <section
        id="estimate-form"
        className="scroll-mt-20 relative bg-page py-24 overflow-hidden"
      >
        <div className="max-w-2xl mx-auto px-6 md:px-16 flex flex-col items-center text-center">
          <CheckCircle className="text-orange-700 mb-6" size={48} />
          <h2
            className="text-4xl font-bold text-text-primary mb-4"
            style={{ fontFamily: "var(--font-rajdhani)" }}
          >
            Request Received!
          </h2>
          <p
            className="text-text-secondary text-lg leading-relaxed"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Thanks {formData.name.split(" ")[0]} — we'll review your request and
            reach out within 1 business day to schedule your free estimate.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="estimate-form"
      ref={sectionRef}
      className="scroll-mt-24 relative bg-page py-24 overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(239,107,77,0.04) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative max-w-2xl mx-auto px-6 md:px-16"
      >
        {/* Heading */}
        <div className="flex flex-col items-center text-center mb-12">
          {/* Cable label tag — FORM-INIT identifier */}
          <div className="inline-flex items-center gap-1 mb-4 border border-brand-accent/40 bg-brand-accent/5 px-2 py-0.5 rounded-xs" aria-hidden="true">
            <span className="text-orange-700/80 font-mono text-[10px] tracking-widest uppercase">
              FORM-INIT / NO OBLIGATION
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold text-text-primary mb-4"
            style={{ fontFamily: "var(--font-rajdhani)" }}
          >
            Get a Free Estimate
          </h2>
          <p
            className="text-text-secondary text-lg max-w-xl"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Fill out the form below and we'll get back to you within 1 business
            day.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-5"
        >
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <PortLabel htmlFor="name">Full Name</PortLabel>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Smith"
                className={`${inputClass} ${errors.name ? "border-red-500/50" : "border-slate-200"}`}
                style={{ fontFamily: "var(--font-dm-sans)" }}
              />
              {errors.name && (
                <p className="text-text-error text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <PortLabel htmlFor="phone">Phone Number</PortLabel>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 000-0000"
                className={`${inputClass} ${errors.phone ? "border-red-500/50" : "border-slate-200"}`}
                style={{ fontFamily: "var(--font-dm-sans)" }}
              />
              {errors.phone && (
                <p className="text-text-error text-xs mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          <div>
            <PortLabel htmlFor="email">Email Address</PortLabel>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={`${inputClass} ${errors.email ? "border-red-500/50" : "border-slate-200"}`}
              style={{ fontFamily: "var(--font-dm-sans)" }}
            />
            {errors.email && (
              <p className="text-text-error text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <PortLabel htmlFor="address">Property Address</PortLabel>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main St, City, State"
              className={`${inputClass} ${errors.address ? "border-red-500/50" : "border-slate-200"}`}
              style={{ fontFamily: "var(--font-dm-sans)" }}
            />
            {errors.address && (
              <p className="text-text-error text-xs mt-1">{errors.address}</p>
            )}
          </div>

          <div>
            <PortLabel htmlFor="serviceType">Service Type</PortLabel>
            <select
              id="serviceType"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              className={`${inputClass} ${errors.serviceType ? "border-red-500/50" : "border-slate-200"}`}
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              <option value="" disabled>
                Select a service...
              </option>
              {services.map((service) => (
                <option key={service._id} value={service.slug}>
                  {service.title}
                </option>
              ))}
            </select>
            {errors.serviceType && (
              <p className="text-text-error text-xs mt-1">{errors.serviceType}</p>
            )}
          </div>

          <div>
            <PortLabel htmlFor="message">
              <>
                Additional Details{" "}
                <span className="text-text-subtle normal-case tracking-normal font-sans text-xs">(optional)</span>
              </>
            </PortLabel>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your property, any specific concerns, or questions..."
              rows={4}
              className={`${inputClass} border-slate-200 resize-none`}
              style={{ fontFamily: "var(--font-dm-sans)" }}
            />
          </div>

          {submitError && (
            <p className="text-text-error text-sm text-center">{submitError}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="group flex items-center justify-center gap-3 bg-brand-accent text-brand-base font-bold px-8 py-4 rounded-sm text-sm uppercase tracking-widest hover:bg-brand-base hover:text-white transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            style={{ fontFamily: "var(--font-rajdhani)" }}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                Submitting
                <span className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1 h-1 rounded-full bg-page animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </span>
              </span>
            ) : (
              <>
                Request Free Estimate
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </>
            )}
          </button>

          <p
            className="text-text-subtle text-xs text-center"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            No spam. No commitment. We'll contact you to schedule a convenient
            time.
          </p>
        </form>
      </motion.div>
    </section>
  );
}
