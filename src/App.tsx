/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TrustImpactSection } from './components/TrustImpactSection';
import { AboutSection } from './components/AboutSection';
import { ProgramsSection } from './components/ProgramsSection';
import { ProgramDetailModal } from './components/ProgramDetailModal';
import { LearningPathSection } from './components/LearningPathSection';
import { ProjectShowcaseSection } from './components/ProjectShowcaseSection';
import { MethodologySection } from './components/MethodologySection';
import { WhyJamesTechSection } from './components/WhyJamesTechSection';
import { ParentsSection } from './components/ParentsSection';
import { InstructorsSection } from './components/InstructorsSection';
import { PricingSection } from './components/PricingSection';
import { FAQSection } from './components/FAQSection';
import { EnrollmentSection } from './components/EnrollmentSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { Program } from './data/programsData';
import { Language } from './data/i18n';
import { ScrollReveal } from './components/ScrollReveal';
import { AuthPage } from './auth/AuthPage';
import { Dashboard } from './auth/Dashboard';
import { ProtectedRoute } from './auth/ProtectedRoute';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [enrollProgramId, setEnrollProgramId] = useState<string | undefined>(undefined);
  const [contactSubject, setContactSubject] = useState<string | undefined>(undefined);

  const path = window.location.pathname;
  if (path === '/login') return <AuthPage mode="login" />;
  if (path === '/signup') return <AuthPage mode="signup" />;
  if (path === '/dashboard') return <ProtectedRoute><Dashboard /></ProtectedRoute>;

  const handleOpenEnroll = (programId?: string) => {
    if (programId) setEnrollProgramId(programId);
    document.getElementById('enrollment')?.scrollIntoView({ behavior: 'smooth' });
  };
  const handleOpenContact = (subject?: string) => {
    if (subject) setContactSubject(subject);
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-400 selection:text-slate-950 font-sans">
      <Navbar currentLang={currentLang} onSelectLang={setCurrentLang} onOpenEnroll={() => handleOpenEnroll()} />
      <main>
        <HeroSection currentLang={currentLang} onOpenEnroll={() => handleOpenEnroll()} />
        <ScrollReveal delay={100}><TrustImpactSection /></ScrollReveal>
        <ScrollReveal delay={150}><AboutSection currentLang={currentLang} /></ScrollReveal>
        <ScrollReveal delay={150}><ProgramsSection currentLang={currentLang} onSelectProgram={setSelectedProgram} onOpenEnroll={handleOpenEnroll} /></ScrollReveal>
        <ScrollReveal delay={150}><LearningPathSection /></ScrollReveal>
        <ScrollReveal delay={150}><ProjectShowcaseSection /></ScrollReveal>
        <ScrollReveal delay={150}><MethodologySection /></ScrollReveal>
        <ScrollReveal delay={150}><WhyJamesTechSection /></ScrollReveal>
        <ScrollReveal delay={150}><ParentsSection onOpenContact={() => handleOpenContact('Inquiry from Parents Section')} onOpenEnroll={() => handleOpenEnroll()} /></ScrollReveal>
        <ScrollReveal delay={150}><InstructorsSection /></ScrollReveal>
        <ScrollReveal delay={150}><PricingSection onOpenContact={handleOpenContact} onOpenEnroll={handleOpenEnroll} /></ScrollReveal>
        <ScrollReveal delay={150}><FAQSection /></ScrollReveal>
        <ScrollReveal delay={150}><EnrollmentSection initialProgramId={enrollProgramId} /></ScrollReveal>
        <ScrollReveal delay={150}><ContactSection initialSubject={contactSubject} /></ScrollReveal>
      </main>
      <ProgramDetailModal program={selectedProgram} onClose={() => setSelectedProgram(null)} onEnroll={(pId) => { setSelectedProgram(null); handleOpenEnroll(pId); }} />
      <Footer />
    </div>
  );
}
