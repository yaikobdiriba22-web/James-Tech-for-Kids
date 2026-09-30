import React from 'react';
import { Cpu, Users2, Rocket, Award, ShieldCheck, HeartHandshake } from 'lucide-react';

export const TrustImpactSection: React.FC = () => {
  const credibilityItems = [
    {
      icon: Cpu,
      title: 'Hands-on Learning',
      subtitle: 'Students write code, solder circuits, and build real applications from day one.',
    },
    {
      icon: Rocket,
      title: 'Project-Based Education',
      subtitle: 'Every term culminates in a personal portfolio project students can show to the world.',
    },
    {
      icon: Users2,
      title: 'Mentor Support',
      subtitle: 'Close 1:8 mentor-to-student guidance ensuring every child receives individualized attention.',
    },
    {
      icon: Award,
      title: 'Future-Ready Skills',
      subtitle: 'Computational thinking, algorithmic logic, and ethical technology awareness.',
    },
  ];

  return (
    <section className="relative z-20 -mt-6 sm:-mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl shadow-black/40">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {credibilityItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`flex flex-col items-start ${idx !== 0 ? 'pt-6 md:pt-0 md:pl-6' : ''}`}
              >
                <div className="w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-1.5 font-display">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.subtitle}
                </p>
              </div>
            );
          })}
        </div>

        {/* Quiet Trust Bar below */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Safe, encouraging, and supervised learning environment</span>
          </div>
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            <span>Designed for beginners & aspiring advanced young developers</span>
          </div>
        </div>
      </div>
    </section>
  );
};
