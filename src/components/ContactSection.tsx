import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import {
  ADMIN_EMAIL,
  ADMIN_PHONE,
  ADMIN_PHONE_DISPLAY,
  generateContactGmail,
  generateContactMailto,
  generateContactWhatsApp,
  formatContactText,
  ContactPayload,
} from '../services/emailService';
import { submitContactMessage } from '../lib/database';

interface ContactSectionProps {
  initialSubject?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ initialSubject }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(initialSubject || '');
  const [message, setMessage] = useState('');
  
  // Real-time touched & validation tracking
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submittedPayload, setSubmittedPayload] = useState<ContactPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formAttempted, setFormAttempted] = useState(false);

  // Field-level validation rules
  const getNameError = () => {
    if (!name.trim()) return 'Your full name is required';
    if (name.trim().length < 2) return 'Please enter at least 2 characters';
    return null;
  };

  const getEmailError = () => {
    if (!email.trim()) return 'Email address is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return 'Please enter a valid email format (e.g. name@example.com)';
    }
    return null;
  };

  const getMessageError = () => {
    if (!message.trim()) return 'Message is required';
    if (message.trim().length < 10) {
      return `Please enter at least 10 characters (${10 - message.trim().length} more needed)`;
    }
    return null;
  };

  const nameErr = getNameError();
  const emailErr = getEmailError();
  const messageErr = getMessageError();

  const isFormValid = !nameErr && !emailErr && !messageErr;

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormAttempted(true);
    setTouched({
      name: true,
      email: true,
      message: true,
    });

    if (!isFormValid) return;

    setLoading(true);

    const payload: ContactPayload = {
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    };

    // Save locally
    try {
      const existing = JSON.parse(localStorage.getItem('james_tech_inquiries') || '[]');
      existing.push({
        ...payload,
        submittedAt: new Date().toISOString(),
      });
      localStorage.setItem('james_tech_inquiries', JSON.stringify(existing));
    } catch (err) {
      console.error('LocalStorage write error', err);
    }

    // Call database service (saves to Supabase contact_messages and calls backend route)
    await submitContactMessage({
      name: payload.name,
      email: payload.email,
      subject: payload.subject,
      message: payload.message,
    });

    // Direct auto-trigger to open user's email composer addressed to yaikobdiriba22@gmail.com
    const gmailUrl = generateContactGmail(payload);
    try {
      window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    } catch {
      window.location.href = generateContactMailto(payload);
    }

    setSubmittedPayload(payload);
    setLoading(false);
  };

  const handleCopyMessage = () => {
    if (!submittedPayload) return;
    const text = formatContactText(submittedPayload);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleReset = () => {
    setSubmittedPayload(null);
    setFormAttempted(false);
    setTouched({});
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <section id="contact" className="py-24 sm:py-32 bg-slate-900/30 relative border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Direct Info & Channels */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
              <span>Direct Inquiries</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500">Reach Out</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-6 font-display">
              Get in Touch with James Tech
            </h2>
            <p className="text-base text-slate-300 leading-relaxed mb-8">
              Have questions about program schedules, campus visits, or student evaluations?
              Your messages go directly to Director Yaikob Diriba for an immediate personal response.
            </p>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Direct Email
                  </span>
                  <a
                    href={`mailto:${ADMIN_EMAIL}`}
                    className="text-sm font-semibold text-white hover:text-amber-400 transition-colors"
                  >
                    {ADMIN_EMAIL}
                  </a>
                  <p className="text-[11px] text-slate-500 mt-0.5">Monitored directly for immediate reply</p>
                </div>
              </div>

              {/* Phone / WhatsApp */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Phone & WhatsApp Direct Line
                  </span>
                  <a
                    href={`tel:${ADMIN_PHONE}`}
                    className="text-sm font-semibold text-white hover:text-emerald-400 transition-colors block"
                  >
                    {ADMIN_PHONE_DISPLAY}
                  </a>
                  <a
                    href={`https://wa.me/${ADMIN_PHONE.replace('+', '')}?text=${encodeURIComponent(
                      'Hello Director Yaikob! I would like to inquire about James Tech Academy programs.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:underline mt-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Chat Directly on WhatsApp (+251 922 067 302)</span>
                  </a>
                </div>
              </div>

              {/* Campus Location */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Academy Campus & Labs
                  </span>
                  <p className="text-sm font-semibold text-white">Addis Ababa, Ethiopia</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Campus visits available by appointment</p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Operating Schedule
                  </span>
                  <p className="text-xs text-slate-300">
                    Weekdays: 8:30 AM – 6:00 PM <br />
                    Saturdays & Sundays: 9:00 AM – 5:00 PM (Active Cohorts)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form with Real-time Validation */}
          <div className="lg:col-span-7">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8">
              {submittedPayload ? (
                <div className="py-8 text-center space-y-5 animate-in fade-in duration-200">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-white font-display">
                      Message Prepared for Director!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
                      Thank you, <strong className="text-white">{submittedPayload.name}</strong>. Your message is prepared directly for director Yaikob Diriba at <strong className="text-amber-400">{ADMIN_EMAIL}</strong>.
                    </p>
                  </div>

                  {/* Dispatch Action Panel */}
                  <div className="p-5 rounded-2xl bg-amber-400/5 border border-amber-400/30 text-left max-w-lg mx-auto space-y-3">
                    <span className="text-xs font-bold text-amber-300 block">
                      Choose Your Preferred Sending Method:
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <a
                        href={generateContactGmail(submittedPayload)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 p-3 text-xs font-bold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md active:scale-95"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Send via Gmail Web</span>
                      </a>

                      <a
                        href={generateContactMailto(submittedPayload)}
                        className="flex items-center justify-center gap-2 p-3 text-xs font-bold uppercase tracking-wider text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all active:scale-95"
                      >
                        <Mail className="w-4 h-4 text-amber-400" />
                        <span>Send via Mail App</span>
                      </a>

                      <a
                        href={generateContactWhatsApp(submittedPayload.name, submittedPayload.subject || '', submittedPayload.message)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 p-3 text-xs font-bold uppercase tracking-wider text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md active:scale-95"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Send on WhatsApp</span>
                      </a>

                      <button
                        onClick={handleCopyMessage}
                        className="flex items-center justify-center gap-2 p-3 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all active:scale-95 cursor-pointer"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        <span>{copied ? 'Copied to Clipboard!' : 'Copy Message Text'}</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2">
                      Replies are sent directly to your email (<strong>{submittedPayload.email}</strong>).
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleReset}
                      className="text-xs text-slate-400 hover:text-white underline transition-colors cursor-pointer"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div>
                    <h3 className="text-lg font-bold text-white font-display">
                      Send an Inquiry Directly to Director Yaikob Diriba
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Delivered directly to {ADMIN_EMAIL} for an immediate personal response.
                    </p>
                  </div>

                  {/* Real-time Validation Summary Alert if submitted with invalid fields */}
                  {formAttempted && !isFormValid && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Please resolve the highlighted fields:</span>
                        <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-300">
                          {nameErr && <li>Full name is required.</li>}
                          {emailErr && <li>Valid email address is required.</li>}
                          {messageErr && <li>Message requires at least 10 characters.</li>}
                        </ul>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Your Full Name <span className="text-amber-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="contact-name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          onBlur={() => handleBlur('name')}
                          placeholder="e.g. Yaikob Diriba"
                          aria-invalid={(touched.name || formAttempted) && !!nameErr}
                          className={`w-full bg-slate-900 border rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                            (touched.name || formAttempted) && nameErr
                              ? 'border-rose-500 bg-rose-950/10 focus:border-rose-500 focus:ring-rose-500'
                              : touched.name && !nameErr
                              ? 'border-emerald-500/80 bg-emerald-950/10 focus:border-emerald-400 focus:ring-emerald-400'
                              : 'border-slate-800 focus:border-amber-400 focus:ring-amber-400'
                          }`}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          {(touched.name || formAttempted) && nameErr ? (
                            <AlertCircle className="w-4 h-4 text-rose-400" />
                          ) : touched.name && !nameErr ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : null}
                        </div>
                      </div>
                      {(touched.name || formAttempted) && nameErr ? (
                        <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{nameErr}</span>
                        </p>
                      ) : touched.name && !nameErr ? (
                        <p className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1">
                          <Check className="w-3 h-3 shrink-0" />
                          <span>Name validated</span>
                        </p>
                      ) : null}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Email Address <span className="text-amber-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="contact-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onBlur={() => handleBlur('email')}
                          placeholder="you@example.com"
                          aria-invalid={(touched.email || formAttempted) && !!emailErr}
                          className={`w-full bg-slate-900 border rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                            (touched.email || formAttempted) && emailErr
                              ? 'border-rose-500 bg-rose-950/10 focus:border-rose-500 focus:ring-rose-500'
                              : touched.email && !emailErr
                              ? 'border-emerald-500/80 bg-emerald-950/10 focus:border-emerald-400 focus:ring-emerald-400'
                              : 'border-slate-800 focus:border-amber-400 focus:ring-amber-400'
                          }`}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          {(touched.email || formAttempted) && emailErr ? (
                            <AlertCircle className="w-4 h-4 text-rose-400" />
                          ) : touched.email && !emailErr ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : null}
                        </div>
                      </div>
                      {(touched.email || formAttempted) && emailErr ? (
                        <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{emailErr}</span>
                        </p>
                      ) : touched.email && !emailErr ? (
                        <p className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1">
                          <Check className="w-3 h-3 shrink-0" />
                          <span>Valid email format</span>
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. In-Person Lab Availability or Weekend Schedules"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="contact-message" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                        Message <span className="text-amber-400">*</span>
                      </label>
                      <span className={`text-[11px] font-mono ${
                        message.trim().length >= 10 ? 'text-emerald-400' : 'text-slate-500'
                      }`}>
                        {message.trim().length} / 10 min chars
                      </span>
                    </div>
                    <div className="relative">
                      <textarea
                        id="contact-message"
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onBlur={() => handleBlur('message')}
                        placeholder="How can we assist you and your student?"
                        aria-invalid={(touched.message || formAttempted) && !!messageErr}
                        className={`w-full bg-slate-900 border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                          (touched.message || formAttempted) && messageErr
                            ? 'border-rose-500 bg-rose-950/10 focus:border-rose-500 focus:ring-rose-500'
                            : touched.message && !messageErr
                            ? 'border-emerald-500/80 bg-emerald-950/10 focus:border-emerald-400 focus:ring-emerald-400'
                            : 'border-slate-800 focus:border-amber-400 focus:ring-amber-400'
                        }`}
                      />
                    </div>
                    {(touched.message || formAttempted) && messageErr ? (
                      <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{messageErr}</span>
                      </p>
                    ) : touched.message && !messageErr ? (
                      <p className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3 shrink-0" />
                        <span>Message meets length requirement</span>
                      </p>
                    ) : null}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 text-xs font-semibold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-xl transition-colors shadow-sm cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? 'Preparing...' : `Send Directly to ${ADMIN_EMAIL}`}</span>
                  </button>
                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 mt-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Dispatches directly to Director Yaikob Diriba ({ADMIN_EMAIL}).</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
