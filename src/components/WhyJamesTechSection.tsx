import React from 'react';
import { Layers, Sparkles, Code, Brain, Users2, Rocket } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const WhyJamesTechSection: React.FC = () => {
  const benefits = [
    {
      icon: Layers,
      title: 'Project-Based Learning',
      description:
        'Students do not just study theory; they write real code, solder hardware, and build portfolios they can showcase anywhere.',
    },
    {
      icon: Sparkles,
      title: 'Age-Appropriate Curriculum',
      description:
        'Our tracks are calibrated carefully to childhood developmental phases, advancing seamlessly from visual blocks to text syntax.',
    },
    {
      icon: Code,
      title: 'Practical Technology Skills',
      description:
        'Curriculum rooted in industry standards: Python, modern HTML/CSS/JavaScript, microcontrollers, and responsible AI tools.',
    },
    {
      icon: Brain,
      title: 'Creative Problem Solving',
      description:
        'We teach debugging as a mindset: breaking hard obstacles into smaller components, testing hypotheses, and persisting through errors.',
    },
    {
      icon: Users2,
      title: 'Mentor Guidance',
      description:
        'Dedicated mentors maintaining an intentional 1:8 student ratio so no learner gets left behind or lost in the background.',
    },
    {
      icon: Rocket,
      title: 'Future-Ready Learning',
      description:
        'Preparing African youth not merely for school exams, but to be innovators, software engineers, and digital entrepreneurs.',
    },
  ];

  return (
    <section className="py-24 bg-slate-900/40 relative border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
            <span>Why Families Choose Us</span>
            <span aria-hidden="true">·</span>
            <span>Distinction</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4 font-display">
            The James Tech Advantage
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Our academy is built with deliberate educational architecture to nurture high-competence,
            self-reliant technology creators.
          </p>
        </div>

        {/* 6 Benefit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <ScrollReveal key={benefit.title} delay={(idx % 3) * 80} className="h-full flex">
                <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-7 flex flex-col justify-between hover:border-slate-700 transition-colors group">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2.5 font-display">
                      {benefit.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
