import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPrograms } from '../lib/database';
import { Program } from '../data/programsData';
import { ProgramDetailModal } from '../components/ProgramDetailModal';
import { Search, ArrowRight, Check, Code, Globe, Bot, Cpu, Sparkles, Filter } from 'lucide-react';

export const ProgramsPage: React.FC = () => {
  const navigate = useNavigate();
  const [programsList, setProgramsList] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeAge, setActiveAge] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchPrograms();
      setProgramsList(data);
      setLoading(false);
    }
    load();
  }, []);

  const getProgramIcon = (category: string) => {
    switch (category) {
      case 'coding':
        return Code;
      case 'web':
        return Globe;
      case 'python':
        return Sparkles;
      case 'robotics':
        return Cpu;
      case 'ai':
        return Bot;
      default:
        return Code;
    }
  };

  const filtered = programsList.filter((p) => {
    const matchCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchAge =
      activeAge === 'all' ||
      (activeAge === '7-10' && (p.ageRange.includes('7') || p.ageRange.includes('8') || p.ageRange.includes('10'))) ||
      (activeAge === '10-12' && (p.ageRange.includes('10') || p.ageRange.includes('11') || p.ageRange.includes('12'))) ||
      (activeAge === '12-16' && (p.ageRange.includes('12') || p.ageRange.includes('16') || p.ageRange.includes('14')));

    const matchSearch =
      !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.skillsLearned.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchCategory && matchAge && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curriculum Directory</span>
            <span aria-hidden="true">·</span>
            <span>Ages 7–16</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 font-display">
            Explore All Learning Programs
          </h1>
          <p className="text-base text-slate-300 leading-relaxed">
            From MIT Scratch to full-stack web engineering and Python problem-solving, our calibrated tracks nurture confidence and computational mastery.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-12 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tracks, skills, languages..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>

            {/* Age Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
              <span className="text-xs text-slate-400 shrink-0 mr-1">Age:</span>
              {[
                { id: 'all', label: 'All Ages' },
                { id: '7-10', label: '7–10 Yrs' },
                { id: '10-12', label: '10–12 Yrs' },
                { id: '12-16', label: '12–16 Yrs' },
              ].map((age) => (
                <button
                  key={age.id}
                  onClick={() => setActiveAge(age.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeAge === age.id
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {age.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-800/80">
            {[
              { id: 'all', label: 'All Subjects' },
              { id: 'coding', label: 'Scratch & Visual' },
              { id: 'web', label: 'Web Development' },
              { id: 'python', label: 'Python' },
              { id: 'robotics', label: 'Robotics & STEM' },
              { id: 'ai', label: 'AI & Data' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Programs Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-500 text-sm">Loading available technology tracks...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
            <h3 className="text-base font-bold text-white mb-2">No matching programs found</h3>
            <p className="text-xs text-slate-400 mb-4">Try clearing your search query or filters.</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setActiveAge('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((program) => {
              const Icon = getProgramIcon(program.category);
              return (
                <div
                  key={program.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all duration-300 hover:shadow-2xl group"
                >
                  <div>
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950 border-b border-slate-800">
                      <img
                        src={program.image}
                        alt={program.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      <div className="absolute top-4 left-4 w-9 h-9 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-amber-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold text-white border border-white/10">
                        {program.ageRange}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-2.5">
                        <span className="text-amber-400 font-semibold">{program.difficulty}</span>
                        <span>·</span>
                        <span>{program.duration}</span>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors font-display">
                        {program.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                        {program.shortDesc}
                      </p>

                      <div className="space-y-1.5 mb-6">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                          Core Competencies
                        </span>
                        {program.skillsLearned.slice(0, 3).map((skill) => (
                          <div key={skill} className="flex items-center gap-2 text-xs text-slate-300">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-slate-800/80 flex items-center gap-3">
                    <button
                      onClick={() => setSelectedProgram(program)}
                      className="flex-1 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        navigate('/dashboard');
                      }}
                      className="px-4 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-md cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>Enroll</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Program Details Modal */}
      <ProgramDetailModal
        program={selectedProgram}
        onClose={() => setSelectedProgram(null)}
        onEnroll={() => {
          setSelectedProgram(null);
          navigate('/dashboard');
        }}
      />
    </div>
  );
};
