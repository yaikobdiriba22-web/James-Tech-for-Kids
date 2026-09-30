export interface Mentor {
  id: string;
  role: string;
  focusArea: string;
  experienceHighlight: string;
  teachingPhilosophy: string;
}

export const mentorsData: Mentor[] = [
  {
    id: 'lead-instructor',
    role: 'Lead Technology & Software Mentor',
    focusArea: 'Python, Computational Thinking & Algorithms',
    experienceHighlight: 'Software engineering educator passionate about youth technology literacy in East Africa.',
    teachingPhilosophy:
      'Code is not just syntax—it is a superpower that allows young minds to bring their wildest imaginations into reality.',
  },
  {
    id: 'robotics-mentor',
    role: 'Robotics & Hardware Engineering Mentor',
    focusArea: 'Embedded Circuits, Microcontrollers & STEM Automation',
    experienceHighlight: 'Hands-on hardware tinkerer and maker specializing in educational electronics.',
    teachingPhilosophy:
      'When children see an LED light up or a rover move because of code they wrote, that is the exact spark of engineering confidence.',
  },
  {
    id: 'web-mentor',
    role: 'Web Architecture & Interactive Media Mentor',
    focusArea: 'HTML5, Modern CSS, JavaScript & Digital Literacy',
    experienceHighlight: 'Frontend developer and youth coding mentor guiding students from web basics to live online deployment.',
    teachingPhilosophy:
      'Every young person should know how to build their own piece of the web instead of just browsing what others create.',
  },
  {
    id: 'design-mentor',
    role: 'UI/UX Design & Creative Technology Mentor',
    focusArea: 'Design Thinking, Figma Prototyping & Empathy in Tech',
    experienceHighlight: 'Product designer helping young creators observe user problems and craft human-centered digital solutions.',
    teachingPhilosophy:
      'Empathy and design thinking teach young innovators that technology is only truly great when it makes life easier for people.',
  },
];
