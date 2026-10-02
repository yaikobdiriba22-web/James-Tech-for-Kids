import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { programs } from '../data/programsData';
import {
  CheckCircle2,
  AlertCircle,
  Send,
  Printer,
  Sparkles,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  Copy,
  Check,
  ExternalLink,
  LayoutDashboard,
} from 'lucide-react';
import {
  ADMIN_EMAIL,
  ADMIN_PHONE,
  ADMIN_PHONE_DISPLAY,
  generateEnrollmentGmail,
  generateEnrollmentMailto,
  generateEnrollmentWhatsApp,
  formatEnrollmentText,
  EnrollmentPayload,
} from '../services/emailService';
import { createEnrollment } from '../lib/database';
import { useAuth } from '../context/AuthContext';

interface EnrollmentSectionProps {
  initialProgramId?: string;
}

export const EnrollmentSection: React.FC<EnrollmentSectionProps> = ({ initialProgramId }) => {
  const { user, profile } = useAuth();

  const [parentName, setParentName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentAge, setStudentAge] = useState<string>('10');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [programId, setProgramId] = useState<string>(initialProgramId || programs[0].id);
  const [learningFormat, setLearningFormat] = useState<'in-person' | 'online'>('in-person');
  const [preferredDays, setPreferredDays] = useState<'weekends' | 'weekdays' | 'flexible'>('weekends');
  const [message, setMessage] = useState('');

  // Auto-fill from authenticated profile
  useEffect(() => {
    if (profile) {
      if (profile.full_name && !studentName) setStudentName(profile.full_name);
      if (profile.guardian_name && !parentName) setParentName(profile.guardian_name);
      if (profile.student_age) setStudentAge(String(profile.student_age));
      if (profile.phone && !phone) setPhone(profile.phone);
      if (profile.email && !email) setEmail(profile.email);
    } else if (user?.email && !email) {
      setEmail(user.email);
    }
  }, [profile, user]);

  // Touched state to control when validation messages appear
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedPayload, setSubmittedPayload] = useState<EnrollmentPayload | null>(null);
  const [copied, setCopied] = useState(false);
  const [formAttempted, setFormAttempted] = useState(false);

  // Field-level real-time validation computations
  const getParentNameError = () => {
    if (!parentName.trim()) return 'Parent / guardian full name is required';
    if (parentName.trim().length < 2) return 'Please enter at least 2 characters';
    return null;
  };

  const getStudentNameError = () => {
    if (!studentName.trim()) return 'Student full name is required';
    if (studentName.trim().length < 2) return 'Please enter at least 2 characters';
    return null;
  };

  const getStudentAgeError = () => {
    const ageNum = parseInt(studentAge, 10);
    if (isNaN(ageNum) || ageNum < 7 || ageNum > 16) {
      return 'Student age must be between 7 and 16 years';
    }
    return null;
  };

  const getPhoneError = () => {
    if (!phone.trim()) return 'Contact phone number is required';
    const cleaned = phone.replace(/[\s-]/g, '');
    if (cleaned.length < 9) return 'Please enter a valid phone number (at least 9 digits)';
    return null;
  };

  const getEmailError = () => {
    if (!email.trim()) return 'Email address is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return 'Please enter a valid email format (e.g. name@example.com)';
    }
    return null;
  };

  const parentNameErr = getParentNameError();
  const studentNameErr = getStudentNameError();
  const studentAgeErr = getStudentAgeError();
  const phoneErr = getPhoneError();
  const emailErr = getEmailError();

  const isFormValid = !parentNameErr && !studentNameErr && !studentAgeErr && !phoneErr && !emailErr;

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const selectedProg = programs.find((p) => p.id === programId) || programs[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormAttempted(true);
    setTouched({
      parentName: true,
      studentName: true,
      studentAge: true,
      phone: true,
      email: true,
    });

    if (!isFormValid) return;

    setIsSubmitting(true);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const refCode = `JT-2026-${randomSuffix}`;

    const payload: EnrollmentPayload = {
      refCode,
      parentName: parentName.trim(),
      studentName: studentName.trim(),
      studentAge,
      phone: phone.trim(),
      email: email.trim(),
      programTitle: selectedProg.title,
      learningFormat,
      preferredDays,
      message: message.trim(),
    };

    // Persist to Supabase enrollments table and dispatch to backend notification
    const result = await createEnrollment({
      userId: user?.id || null,
      programId: selectedProg.id,
      programTitle: selectedProg.title,
      format: learningFormat,
      schedule: preferredDays,
      notes: message.trim(),
      parentName: parentName.trim(),
      studentName: studentName.trim(),
      studentAge,
      phone: phone.trim(),
      email: email.trim(),
    });

    // Direct auto-trigger to open user's email client or Gmail addressed directly to yaikobdiriba22@gmail.com
    const gmailUrl = generateEnrollmentGmail(payload);
    try {
      window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    } catch {
      window.location.href = generateEnrollmentMailto(payload);
    }

    setSubmittedPayload({
      ...payload,
      refCode: result.refCode || refCode,
    });
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleCopyText = () => {
    if (!submittedPayload) return;
    const text = formatEnrollmentText(submittedPayload);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFormAttempted(false);
    setTouched({});
    setParentName('');
    setStudentName('');
    setPhone('');
    setEmail('');
    setMessage('');
    setSubmittedPayload(null);
  };

  return (
    <section id="enrollment" className="py-24 sm:py-32 bg-slate-950 relative border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Admissions Portal</span>
            <span aria-hidden="true">·</span>
            <span>Direct to Director ({ADMIN_EMAIL})</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 font-display">
            Enroll Your Young Creator
          </h2>
          <p className="text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Reserve a seat for the upcoming term. Form entries are validated in real-time and delivered directly to Director Yaikob Diriba{' '}
            (<span className="text-amber-400 font-semibold">{ADMIN_EMAIL}</span>) for immediate review and reply.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl relative">
          {isSuccess && submittedPayload ? (
            <div className="text-center py-6 space-y-6 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold block mb-1">
                  Ready to Dispatch · Ref: {submittedPayload.refCode}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
                  Enrollment Application Prepared!
                </h3>
                <p className="text-sm text-slate-300 max-w-lg mx-auto mt-2 leading-relaxed">
                  Your application for <strong className="text-amber-400">{submittedPayload.studentName}</strong> ({submittedPayload.programTitle}) is addressed directly to director Yaikob Diriba at <strong className="text-white">{ADMIN_EMAIL}</strong>.
                </p>
              </div>

              {/* Direct Dispatch Action Panel */}
              <div className="p-6 rounded-2xl bg-amber-400/5 border border-amber-400/30 text-left max-w-xl mx-auto space-y-4">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm font-display">
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>Choose Your Preferred Method to Send to Director:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={generateEnrollmentGmail(submittedPayload)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-3 text-xs font-bold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md active:scale-95"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Send via Gmail Web</span>
                  </a>

                  <a
                    href={generateEnrollmentMailto(submittedPayload)}
                    className="flex items-center justify-center gap-2 p-3 text-xs font-bold uppercase tracking-wider text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all active:scale-95"
                  >
                    <Mail className="w-4 h-4 text-amber-400" />
                    <span>Send via Mail App</span>
                  </a>

                  <a
                    href={generateEnrollmentWhatsApp(submittedPayload)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-3 text-xs font-bold uppercase tracking-wider text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send via WhatsApp (+251 922 067 302)</span>
                  </a>

                  <button
                    onClick={handleCopyText}
                    className="flex items-center justify-center gap-2 p-3 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all active:scale-95 cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied to Clipboard!' : 'Copy Application Text'}</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
                  Delivered directly to <strong>{ADMIN_EMAIL}</strong> & phone <strong>{ADMIN_PHONE_DISPLAY}</strong>. Director Yaikob will respond immediately to confirm your student&apos;s schedule.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-left text-xs max-w-md mx-auto space-y-2">
                <div className="flex justify-between border-b border-slate-900 pb-2">
                  <span className="text-slate-400">Student:</span>
                  <span className="font-semibold text-white">
                    {submittedPayload.studentName} (Age {submittedPayload.studentAge})
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-2">
                  <span className="text-slate-400">Selected Track:</span>
                  <span className="font-semibold text-amber-400">{submittedPayload.programTitle}</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-2">
                  <span className="text-slate-400">Parent Phone:</span>
                  <span className="font-semibold text-white">{submittedPayload.phone}</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-2">
                  <span className="text-slate-400">Parent Email:</span>
                  <span className="font-semibold text-white">{submittedPayload.email}</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-2">
                  <span className="text-slate-400">Format:</span>
                  <span className="font-semibold text-white capitalize">
                    {submittedPayload.learningFormat} ({submittedPayload.preferredDays})
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-400">Director:</span>
                  <span className="font-semibold text-emerald-400">
                    {ADMIN_EMAIL} ({ADMIN_PHONE_DISPLAY})
                  </span>
                </div>
              </div>

              {/* Dashboard Access CTA */}
              <div className="pt-1">
                {user ? (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>View Enrollment in Student Dashboard</span>
                  </Link>
                ) : (
                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-md"
                  >
                    <span>Create Student Account to Track Progress</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>

              {/* Utility actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href={`tel:${ADMIN_PHONE}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Call Director (+251 922 067 302)</span>
                </a>

                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleReset}
                  className="text-xs font-medium text-slate-400 hover:text-white transition-colors underline cursor-pointer"
                >
                  Submit Another Enrollment Application
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Real-time Validation Summary Alert if submitted with invalid fields */}
              {formAttempted && !isFormValid && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Please resolve the highlighted fields below:</span>
                    <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-300">
                      {parentNameErr && <li>Parent / Guardian name is required.</li>}
                      {studentNameErr && <li>Student name is required.</li>}
                      {phoneErr && <li>Phone number must be at least 9 digits.</li>}
                      {emailErr && <li>Valid parent email address is required.</li>}
                    </ul>
                  </div>
                </div>
              )}

              {/* Row 1: Parent & Student Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="parentName" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Parent / Guardian Full Name <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="parentName"
                      type="text"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      onBlur={() => handleBlur('parentName')}
                      placeholder="e.g. Yaikob Diriba"
                      aria-invalid={(touched.parentName || formAttempted) && !!parentNameErr}
                      className={`w-full bg-slate-950 border rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                        (touched.parentName || formAttempted) && parentNameErr
                          ? 'border-rose-500 bg-rose-950/10 focus:border-rose-500 focus:ring-rose-500'
                          : touched.parentName && !parentNameErr
                          ? 'border-emerald-500/80 bg-emerald-950/10 focus:border-emerald-400 focus:ring-emerald-400'
                          : 'border-slate-800 focus:border-amber-400 focus:ring-amber-400'
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      {(touched.parentName || formAttempted) && parentNameErr ? (
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                      ) : touched.parentName && !parentNameErr ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : null}
                    </div>
                  </div>
                  {(touched.parentName || formAttempted) && parentNameErr ? (
                    <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{parentNameErr}</span>
                    </p>
                  ) : touched.parentName && !parentNameErr ? (
                    <p className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3 shrink-0" />
                      <span>Name validated</span>
                    </p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="studentName" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Student Full Name <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="studentName"
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      onBlur={() => handleBlur('studentName')}
                      placeholder="e.g. Nathan Yaikob"
                      aria-invalid={(touched.studentName || formAttempted) && !!studentNameErr}
                      className={`w-full bg-slate-950 border rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                        (touched.studentName || formAttempted) && studentNameErr
                          ? 'border-rose-500 bg-rose-950/10 focus:border-rose-500 focus:ring-rose-500'
                          : touched.studentName && !studentNameErr
                          ? 'border-emerald-500/80 bg-emerald-950/10 focus:border-emerald-400 focus:ring-emerald-400'
                          : 'border-slate-800 focus:border-amber-400 focus:ring-amber-400'
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      {(touched.studentName || formAttempted) && studentNameErr ? (
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                      ) : touched.studentName && !studentNameErr ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : null}
                    </div>
                  </div>
                  {(touched.studentName || formAttempted) && studentNameErr ? (
                    <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{studentNameErr}</span>
                    </p>
                  ) : touched.studentName && !studentNameErr ? (
                    <p className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3 shrink-0" />
                      <span>Student name confirmed</span>
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Row 2: Student Age & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="studentAge" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Student Age (7–16) <span className="text-amber-400">*</span>
                  </label>
                  <select
                    id="studentAge"
                    value={studentAge}
                    onChange={(e) => {
                      setStudentAge(e.target.value);
                      handleBlur('studentAge');
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 cursor-pointer"
                  >
                    {[7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((age) => (
                      <option key={age} value={age}>
                        {age} Years Old ({age <= 10 ? 'Ages 7–10' : age <= 12 ? 'Ages 10–12' : 'Ages 13–16'})
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>Eligible for James Tech youth tracks (ages 7–16)</span>
                  </p>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Phone / WhatsApp Number <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onBlur={() => handleBlur('phone')}
                      placeholder="+251 9... or +251 7..."
                      aria-invalid={(touched.phone || formAttempted) && !!phoneErr}
                      className={`w-full bg-slate-950 border rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                        (touched.phone || formAttempted) && phoneErr
                          ? 'border-rose-500 bg-rose-950/10 focus:border-rose-500 focus:ring-rose-500'
                          : touched.phone && !phoneErr
                          ? 'border-emerald-500/80 bg-emerald-950/10 focus:border-emerald-400 focus:ring-emerald-400'
                          : 'border-slate-800 focus:border-amber-400 focus:ring-amber-400'
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      {(touched.phone || formAttempted) && phoneErr ? (
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                      ) : touched.phone && !phoneErr ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : null}
                    </div>
                  </div>
                  {(touched.phone || formAttempted) && phoneErr ? (
                    <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{phoneErr}</span>
                    </p>
                  ) : touched.phone && !phoneErr ? (
                    <p className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3 shrink-0" />
                      <span>Valid phone format</span>
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Row 3: Email & Program Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Parent Email Address <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => handleBlur('email')}
                      placeholder="parent@example.com"
                      aria-invalid={(touched.email || formAttempted) && !!emailErr}
                      className={`w-full bg-slate-950 border rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
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
                      <span>Valid email address</span>
                    </p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="programId" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Program Interested In <span className="text-amber-400">*</span>
                  </label>
                  <select
                    id="programId"
                    value={programId}
                    onChange={(e) => setProgramId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 cursor-pointer"
                  >
                    {programs.map((prog) => (
                      <option key={prog.id} value={prog.id}>
                        {prog.title} ({prog.ageRange})
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Syllabus: {selectedProg.duration}
                  </p>
                </div>
              </div>

              {/* Row 4: Format & Schedule Preference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Preferred Learning Format
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${
                        learningFormat === 'in-person'
                          ? 'bg-amber-400/10 border-amber-400/50 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="format"
                        value="in-person"
                        checked={learningFormat === 'in-person'}
                        onChange={() => setLearningFormat('in-person')}
                        className="sr-only"
                      />
                      <span className="text-xs font-medium">In-Person Campus</span>
                    </label>

                    <label
                      className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${
                        learningFormat === 'online'
                          ? 'bg-amber-400/10 border-amber-400/50 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="format"
                        value="online"
                        checked={learningFormat === 'online'}
                        onChange={() => setLearningFormat('online')}
                        className="sr-only"
                      />
                      <span className="text-xs font-medium">Live Online Cohort</span>
                    </label>
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Preferred Schedule
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {(['weekends', 'weekdays', 'flexible'] as const).map((sched) => (
                      <button
                        key={sched}
                        type="button"
                        onClick={() => setPreferredDays(sched)}
                        className={`p-2.5 rounded-xl border text-xs capitalize transition-colors cursor-pointer ${
                          preferredDays === sched
                            ? 'bg-amber-400 text-slate-950 font-bold border-amber-400'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {sched}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 5: Notes / Message */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Questions, Goals, or Learning Background (Optional)
                  </label>
                  <span className="text-[11px] font-mono text-slate-500">
                    {message.length} characters
                  </span>
                </div>
                <textarea
                  id="message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your child’s interests, prior computer experience, or specific goals..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full inline-flex items-center justify-center gap-2 py-4 px-6 text-sm font-semibold uppercase tracking-wider rounded-xl shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer ${
                    isFormValid && (touched.parentName || touched.email)
                      ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20 hover:scale-[1.01] active:scale-[0.99]'
                      : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'Preparing Application...'
                      : `Submit & Send Directly to ${ADMIN_EMAIL}`}
                  </span>
                </button>
                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 mt-3">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Real-time validated · Delivered directly to Director Yaikob Diriba ({ADMIN_EMAIL})</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
