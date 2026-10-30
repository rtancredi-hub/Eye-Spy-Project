"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { siteConfig } from "@/app/config/site";
import { type SiteSettings, type ContactPageData } from "@/app/lib/types";

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  website: string; // honeypot — humans leave this blank
}

type ContactErrors = Partial<Record<keyof ContactForm, string>>;

export default function ContactClient({
  settings,
  contactData,
}: {
  settings: SiteSettings;
  contactData: ContactPageData;
}) {
  const formRef = useRef<HTMLElement>(null);
  const infoRef = useRef<HTMLElement>(null);
  const formInView = useInView(formRef, { once: true, amount: 0.1 });
  const infoInView = useInView(infoRef, { once: true, amount: 0.2 });

  const searchParams = useSearchParams();

  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
    website: "",
  });

  useEffect(() => {
    const s = searchParams.get("service");
    if (s) setFormData((prev) => ({ ...prev, service: s }));
  }, [searchParams]);

  const [errors, setErrors] = useState<ContactErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): ContactErrors => {
    const newErrors: ContactErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";
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
      const res = await fetch("/api/contact", {
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

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.12,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    }),
  };

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  const inputClass = `w-full bg-white border px-4 py-3 rounded-sm text-brand-base text-sm outline-none transition-colors duration-200 placeholder:text-slate-500 focus:border-brand-accent/50`;
  const labelClass = `block text-xs uppercase tracking-widest text-slate-600 mb-2`;

  const contactItems = [
    {
      icon: <Phone size={18} />,
      label: "Phone",
      value: settings.phone,
      href: siteConfig.phoneHref,
    },
    {
      icon: <Mail size={18} />,
      label: "Email",
      value: settings.email,
      href: siteConfig.emailHref,
    },
    {
      icon: <MapPin size={18} />,
      label: "Address",
      value: settings.address,
      href: null,
    },
    {
      icon: <Clock size={18} />,
      label: "Hours",
      value: `${settings.hours.weekdays} · ${settings.hours.saturday}`,
      href: null,
    },
  ];

  const successBody = contactData.successBody
    ? contactData.successBody.replace("{name}", formData.name.split(" ")[0])
    : `Thanks ${formData.name.split(" ")[0]} — we'll get back to you within 1 business day.`;

  return (
    <main className="bg-page">
      {/* ── HERO BANNER ───────────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(239,107,77,0.08) 0%, transparent 70%)",
          }}
          aria-hidden
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/15 to-transparent" />

        <div className="relative max-w-4xl mx-auto px-6 md:px-16 flex flex-col items-center text-center">
          <motion.p
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-orange-700 text-xs uppercase tracking-widest mb-6"
            style={{ fontFamily: "var(--font-rajdhani)" }}
          >
            {contactData.heroEyebrow ?? "Get In Touch"}
          </motion.p>
          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-6xl font-bold text-brand-base leading-tight mb-6"
            style={{ fontFamily: "var(--font-rajdhani)" }}
          >
            {contactData.heroHeadingLine1 ?? "We'd Love to"}
            <br />
            <span
              style={{
                background:
                  "linear-gradient(90deg, var(--brand-accent) 0%, var(--brand-accent-light) 60%, var(--brand-accent-lighter) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {contactData.heroHeadingLine2 ?? "Hear From You."}
            </span>
          </motion.h1>
          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-slate-600 text-lg max-w-xl leading-relaxed"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {contactData.heroSubtitle ??
              "Have a question, want to schedule a site visit, or just want to talk through your options? We're here."}
          </motion.p>
        </div>
      </section>

      {/* ── MAIN CONTENT: FORM + INFO ──────────────────────────────────────── */}
      <section className="relative bg-page-alt py-24 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/15 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/15 to-transparent" />

        <div className="max-w-6xl mx-auto px-6 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* ── LEFT: CONTACT FORM ──────────────────────────────────────── */}
          <section ref={formRef}>
            <motion.div
              initial="hidden"
              animate={formInView ? "visible" : "hidden"}
              variants={containerVariants}
            >
              <motion.h2
                variants={itemVariants}
                className="text-3xl font-bold text-brand-base mb-8"
                style={{ fontFamily: "var(--font-rajdhani)" }}
              >
                {contactData.formHeading ?? "Send Us a Message"}
              </motion.h2>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-start gap-4 py-12"
                >
                  <CheckCircle className="text-orange-700" size={40} />
                  <h3
                    className="text-2xl font-bold text-brand-base"
                    style={{ fontFamily: "var(--font-rajdhani)" }}
                  >
                    {contactData.successHeading ?? "Message Sent!"}
                  </h3>
                  <p
                    className="text-slate-600 leading-relaxed"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    {successBody}
                  </p>
                </motion.div>
              ) : (
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
                  <motion.div variants={itemVariants}>
                    <label
                      htmlFor="name"
                      className={labelClass}
                      style={{ fontFamily: "var(--font-rajdhani)" }}
                    >
                      Full Name
                    </label>
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
                      <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                    )}
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                  >
                    <div>
                      <label
                        htmlFor="email"
                        className={labelClass}
                        style={{ fontFamily: "var(--font-rajdhani)" }}
                      >
                        Email
                      </label>
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
                        <p className="text-red-400 text-xs mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className={labelClass}
                        style={{ fontFamily: "var(--font-rajdhani)" }}
                      >
                        Phone{" "}
                        <span className="text-slate-500 normal-case tracking-normal">
                          (optional)
                        </span>
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(555) 000-0000"
                        className={`${inputClass} border-slate-200`}
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label
                      htmlFor="service"
                      className={labelClass}
                      style={{ fontFamily: "var(--font-rajdhani)" }}
                    >
                      Service of Interest{" "}
                      <span className="text-slate-500 normal-case tracking-normal">
                        (optional)
                      </span>
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className={`${inputClass} border-slate-200`}
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      <option value="">Select a service...</option>
                      {siteConfig.services.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label
                      htmlFor="message"
                      className={labelClass}
                      style={{ fontFamily: "var(--font-rajdhani)" }}
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="What can we help you with?"
                      rows={5}
                      className={`${inputClass} ${errors.message ? "border-red-500/50" : "border-slate-200"} resize-none`}
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    />
                    {errors.message && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.message}
                      </p>
                    )}
                  </motion.div>

                  {submitError && (
                    <motion.p
                      variants={itemVariants}
                      className="text-red-400 text-sm text-center"
                    >
                      {submitError}
                    </motion.p>
                  )}

                  <motion.div variants={itemVariants}>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group flex items-center gap-3 bg-brand-accent text-brand-base font-bold px-8 py-4 rounded-sm text-sm uppercase tracking-widest hover:bg-brand-base hover:text-white transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ fontFamily: "var(--font-rajdhani)" }}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          Sending
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
                          Send Message
                          <ArrowRight
                            size={16}
                            className="group-hover:translate-x-1 transition-transform duration-200"
                          />
                        </>
                      )}
                    </button>
                  </motion.div>
                </form>
              )}
            </motion.div>
          </section>

          {/* ── RIGHT: CONTACT INFO ─────────────────────────────────────── */}
          <section ref={infoRef}>
            <motion.div
              initial="hidden"
              animate={infoInView ? "visible" : "hidden"}
              variants={containerVariants}
              className="flex flex-col gap-6"
            >
              <motion.h2
                variants={itemVariants}
                className="text-3xl font-bold text-brand-base mb-2"
                style={{ fontFamily: "var(--font-rajdhani)" }}
              >
                {contactData.infoHeading ?? "Contact Information"}
              </motion.h2>

              {contactItems.map((item) => (
                <motion.div
                  key={item.label}
                  variants={itemVariants}
                  className="flex items-start gap-4 p-5 rounded-sm border border-slate-200 bg-white"
                >
                  <span className="shrink-0 w-10 h-10 rounded-full bg-brand-accent/10 text-orange-700 flex items-center justify-center">
                    {item.icon}
                  </span>
                  <div>
                    <p
                      className="text-xs uppercase tracking-widest text-slate-600 mb-1"
                      style={{ fontFamily: "var(--font-rajdhani)" }}
                    >
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-brand-base hover:text-orange-700 transition-colors duration-200 text-sm"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p
                        className="text-brand-base text-sm"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {item.value}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}

              <motion.div
                variants={itemVariants}
                className="p-5 rounded-sm border border-brand-accent/10 bg-brand-accent/5 mt-2"
              >
                <p
                  className="text-orange-700 text-xs uppercase tracking-widest mb-2"
                  style={{ fontFamily: "var(--font-rajdhani)" }}
                >
                  {contactData.serviceAreaLabel ?? "Service Area"}
                </p>
                <p
                  className="text-slate-600 text-sm leading-relaxed"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  {settings.serviceArea}.{" "}
                  {contactData.serviceAreaNote ??
                    "Not sure if we cover your area? Give us a call and we'll let you know."}
                </p>
              </motion.div>
            </motion.div>
          </section>
        </div>
      </section>
    </main>
  );
}
