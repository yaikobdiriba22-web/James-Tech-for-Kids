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

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [enrollProgramId, setEnrollProgramId] = useState<string | undefined>(undefined);
  const [contactSubject, setContactSubject] = useState<string | undefined>(undefined);

  const handleOpenEnroll = (programId?: string) => {
    if (programId) {
      setEnrollProgramId(programId);
    }
    const enrollElem = document.getElementById('enrollment');
    if (enrollElem) {
      enrollElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenContact = (subject?: string) => {
    if (subject) {
      setContactSubject(subject);
    }
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-400 selection:text-slate-950 font-sans">
      {/* Sticky Navigation */}
      <Navbar
        currentLang={currentLang}
        onSelectLang={setCurrentLang}
        onOpenEnroll={() => handleOpenEnroll()}
      />

      <main>
        {/* Hero Section */}
        <HeroSection
          currentLang={currentLang}
          onOpenEnroll={() => handleOpenEnroll()}
        />

        {/* Compact Credibility & Impact */}
        <ScrollReveal delay={100}>
          <TrustImpactSection />
        </ScrollReveal>

        {/* About Section */}
        <ScrollReveal delay={150}>
          <AboutSection currentLang={currentLang} />
        </ScrollReveal>

        {/* Programs Section */}
        <ScrollReveal delay={150}>
          <ProgramsSection
            currentLang={currentLang}
            onSelectProgram={setSelectedProgram}
            onOpenEnroll={handleOpenEnroll}
          />
        </ScrollReveal>

        {/* Age-Based Learning Path */}
        <ScrollReveal delay={150}>
          <LearningPathSection />
        </ScrollReveal>

        {/* Project Showcase ("Learn by Building") */}
        <ScrollReveal delay={150}>
          <ProjectShowcaseSection />
        </ScrollReveal>

        {/* Learning Methodology (5 Steps) */}
        <ScrollReveal delay={150}>
          <MethodologySection />
        </ScrollReveal>

        {/* Why James Tech (6 Benefit Cards) */}
        <ScrollReveal delay={150}>
          <WhyJamesTechSection />
        </ScrollReveal>

        {/* Parents Section */}
        <ScrollReveal delay={150}>
          <ParentsSection
            onOpenContact={() => handleOpenContact('Inquiry from Parents Section')}
            onOpenEnroll={() => handleOpenEnroll()}
          />
        </ScrollReveal>

        {/* Instructors & Mentors Section */}
        <ScrollReveal delay={150}>
          <InstructorsSection />
        </ScrollReveal>

        {/* Pricing & Formats */}
        <ScrollReveal delay={150}>
          <PricingSection
            onOpenContact={handleOpenContact}
            onOpenEnroll={handleOpenEnroll}
          />
        </ScrollReveal>

        {/* FAQ Section */}
        <ScrollReveal delay={150}>
          <FAQSection />
        </ScrollReveal>

        {/* Enrollment Section */}
        <ScrollReveal delay={150}>
          <EnrollmentSection initialProgramId={enrollProgramId} />
        </ScrollReveal>

        {/* Contact Section */}
        <ScrollReveal delay={150}>
          <ContactSection initialSubject={contactSubject} />
        </ScrollReveal>
      </main>

      {/* Program Details Modal */}
      <ProgramDetailModal
        program={selectedProgram}
        onClose={() => setSelectedProgram(null)}
        onEnroll={(pId) => {
          setSelectedProgram(null);
          handleOpenEnroll(pId);
        }}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
