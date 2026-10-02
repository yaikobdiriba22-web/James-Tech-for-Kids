import React from 'react';
import { ContactSection } from '../components/ContactSection';
import { Sparkles, MapPin, Mail, Phone, Clock, MessageCircle } from 'lucide-react';
import { ADMIN_EMAIL, ADMIN_PHONE, ADMIN_PHONE_DISPLAY } from '../services/emailService';

export const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Connect with James Tech</span>
            <span aria-hidden="true">·</span>
            <span>Director Yaikob Diriba</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 font-display">
            Let&apos;s Build Your Child&apos;s Tech Future
          </h1>
          <p className="text-base text-slate-300 leading-relaxed">
            Have questions regarding age evaluation, schedule options, or laboratory sessions? Reach out directly and receive immediate consultation.
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-4">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Director Email
            </span>
            <a
              href={`mailto:${ADMIN_EMAIL}`}
              className="text-sm font-semibold text-white hover:text-amber-400 transition-colors truncate block"
            >
              {ADMIN_EMAIL}
            </a>
            <p className="text-[11px] text-slate-500 mt-1">Directly monitored</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <Phone className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Phone Line
            </span>
            <a
              href={`tel:${ADMIN_PHONE}`}
              className="text-sm font-semibold text-white hover:text-emerald-400 transition-colors block"
            >
              {ADMIN_PHONE_DISPLAY}
            </a>
            <p className="text-[11px] text-slate-500 mt-1">Mon–Sun 8:30AM–6PM</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              WhatsApp Direct
            </span>
            <a
              href={`https://wa.me/${ADMIN_PHONE.replace('+', '')}?text=${encodeURIComponent(
                'Hello Director Yaikob! I would like to inquire about James Tech Academy programs.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-emerald-400 hover:underline block"
            >
              Chat on WhatsApp
            </a>
            <p className="text-[11px] text-slate-500 mt-1">Immediate replies</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-left">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Campus & Labs
            </span>
            <span className="text-sm font-semibold text-white block">
              Addis Ababa, Ethiopia
            </span>
            <p className="text-[11px] text-slate-500 mt-1">Visits by appointment</p>
          </div>
        </div>

        {/* Embedded Contact Form Component */}
        <ContactSection />
      </div>
    </div>
  );
};
