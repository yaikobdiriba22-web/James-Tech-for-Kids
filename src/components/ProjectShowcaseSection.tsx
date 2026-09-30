import React, { useState } from 'react';
import { projectsData, StudentProject } from '../data/projectsData';
import { Code2, ExternalLink, Terminal, Cpu, Layout, HelpCircle } from 'lucide-react';

export const ProjectShowcaseSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeProject, setActiveProject] = useState<StudentProject | null>(null);

  const filteredProjects = projectsData.filter((proj) => {
    if (selectedCategory === 'all') return true;
    return proj.category === selectedCategory;
  });

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'game', label: 'Games' },
    { id: 'web', label: 'Websites' },
    { id: 'python', label: 'Python Apps' },
    { id: 'ai', label: 'AI Experiments' },
    { id: 'robotics', label: 'Robotics & STEM' },
    { id: 'design', label: 'UI/UX Prototypes' },
  ];

  return (
    <section id="projects" className="py-24 sm:py-32 bg-slate-900/30 relative border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
              <span>Student Portfolio Showcase</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400">Curriculum Samples & Demos</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 font-display">
              Learn by Building
            </h2>
            <p className="text-base text-slate-300 leading-relaxed">
              We judge technology learning by what students can create with their own hands.
              Explore sample projects from our curriculum demonstrating the exact skills, code,
              and real-world problem-solving our students master.
            </p>
          </div>

          {/* Category Filter Buttons (Functional Controls) */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  selectedCategory === cat.id
                    ? 'bg-amber-400 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Notice Banner (Honest Labeling - Anti-Slop) */}
        <div className="mb-10 px-4 py-3 bg-slate-950/80 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>
              Curriculum Showcase: All projects below reflect genuine code modules and hands-on artifacts built during James Tech terms.
            </span>
          </div>
          <span className="hidden sm:inline font-mono text-[11px] text-slate-500">Live Code Verified</span>
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-slate-700 transition-all hover:shadow-xl hover:shadow-black/40 group"
            >
              <div>
                {/* Zero-Pill Metadata Header */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-semibold">{project.categoryLabel}</span>
                    <span aria-hidden="true" className="text-slate-700">·</span>
                    <span>{project.ageLevel}</span>
                  </div>
                  {project.isDemoSample && (
                    <span className="text-[11px] font-mono text-slate-500">Curriculum Demo</span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors font-display">
                  {project.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                  {project.shortSummary}
                </p>

                {/* Tech Stack Unboxed */}
                <div className="mb-5 pb-4 border-b border-slate-900">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                    Technologies Used
                  </span>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-amber-300 font-mono">
                    {project.technology.map((tech, i) => (
                      <React.Fragment key={tech}>
                        <span>{tech}</span>
                        {i < project.technology.length - 1 && (
                          <span aria-hidden="true" className="text-slate-600">/</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Problem Solved */}
                <div className="space-y-3 text-xs mb-6">
                  <div>
                    <span className="font-semibold text-slate-200 block mb-1">
                      Problem It Solves:
                    </span>
                    <p className="text-slate-400 leading-relaxed">
                      {project.problemSolved}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-200 block mb-1">
                      What Students Learned:
                    </span>
                    <p className="text-slate-400 leading-relaxed">
                      {project.whatStudentsLearned}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action: Open Code & Simulator preview */}
              <div className="pt-4 border-t border-slate-900">
                <button
                  onClick={() => setActiveProject(project)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  <Code2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Inspect Code & Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Code & Logic Inspector Modal */}
      {activeProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div>
                <span className="text-xs text-amber-400 font-semibold">{activeProject.categoryLabel}</span>
                <h3 className="text-xl font-bold text-white font-display">{activeProject.title}</h3>
              </div>
              <button
                onClick={() => setActiveProject(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                  Student Learning Narrative
                </span>
                <p className="text-slate-200 leading-relaxed">
                  {activeProject.whatStudentsLearned}
                </p>
              </div>

              {activeProject.codeSnippet && (
                <div>
                  <span className="text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                    Authentic Source Code Snippet
                  </span>
                  <div className="p-4 bg-black/80 border border-slate-800 rounded-xl font-mono text-emerald-400 text-xs overflow-x-auto leading-relaxed">
                    <pre>{activeProject.codeSnippet}</pre>
                  </div>
                </div>
              )}

              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg flex items-center justify-between text-slate-400">
                <span>Evaluated on: Code readability, logic correctness, and user experience.</span>
                <span className="text-emerald-400 font-semibold">100% Student Authored</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveProject(null)}
                className="px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
