export interface FAQItem {
  id: string;
  category: 'Admissions' | 'Curriculum' | 'Equipment' | 'Parents';
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  {
    id: 'faq-age',
    category: 'Admissions',
    question: 'What ages can join James Tech?',
    answer:
      'James Tech accepts students between the ages of 7 and 16. Our programs are deliberately structured into age-appropriate tracks: Ages 7–10 (Scratch & Game Development), Ages 10–12 (Web Fundamentals & Robotics), and Ages 13–16 (Python, Full Web Development, and AI).',
  },
  {
    id: 'faq-experience',
    category: 'Admissions',
    question: 'Does my child need previous coding experience?',
    answer:
      'No previous experience is required! Most students begin in our foundational cohorts with zero prior programming background. Our instructors guide learners step-by-step from fundamental computational logic to independent creation.',
  },
  {
    id: 'faq-programs',
    category: 'Curriculum',
    question: 'What programs are available?',
    answer:
      'We offer 6 specialized learning tracks: (1) Scratch & Game Development, (2) Web Development (HTML/CSS/JavaScript), (3) Python Programming, (4) AI & Emerging Technology, (5) Robotics & STEM Hardware, and (6) UI/UX & Digital Creativity.',
  },
  {
    id: 'faq-format',
    category: 'Admissions',
    question: 'Are classes online or in person?',
    answer:
      'We offer both formats to accommodate family schedules: In-Person Academy sessions held in our technology lab (with direct access to robotics hardware kits and computers), as well as Live Interactive Online Cohorts led by real mentors with small class sizes.',
  },
  {
    id: 'faq-equipment',
    category: 'Equipment',
    question: 'What equipment is required?',
    answer:
      'For online classes: a working laptop or desktop computer (Windows, Mac, or Linux) with a webcam, microphone, and stable internet. For in-person lab cohorts at our academy, all desktop computers, microcontrollers, and electronic components are provided in class.',
  },
  {
    id: 'faq-teaching',
    category: 'Curriculum',
    question: 'How are students taught?',
    answer:
      'We use a 5-step learning methodology: Discover, Learn, Practice, Build, and Present. We reject passive lectures; every session is interactive, hands-on, and focused on writing real code, wiring circuits, or building digital prototypes under dedicated mentor guidance.',
  },
  {
    id: 'faq-projects',
    category: 'Curriculum',
    question: 'What projects will students build?',
    answer:
      'Students build genuine, functional creations: playable 2D arcade games, responsive personal portfolio websites, Python automation scripts, AI computer vision classifiers, and automated hardware robotics (such as obstacle-avoiding cars or smart plant monitors).',
  },
  {
    id: 'faq-certificates',
    category: 'Parents',
    question: 'Do students receive certificates?',
    answer:
      'Yes. Upon completing a track and successfully presenting their Capstone Project at our end-of-term Demo Day, students receive a verified James Tech Certificate of Completion recognizing their technical achievements and skills acquired.',
  },
  {
    id: 'faq-progress',
    category: 'Parents',
    question: 'How can parents track progress?',
    answer:
      'Parents receive bi-weekly progress updates, access to their student’s live digital project portfolio, and invitations to open classroom showcase sessions where students demonstrate and present their projects.',
  },
  {
    id: 'faq-enroll',
    category: 'Admissions',
    question: 'How can I enroll?',
    answer:
      'You can submit an application directly through our online Enrollment Form on this website, or contact our admissions team via phone, email, or WhatsApp. We will schedule a free introductory orientation to evaluate your student’s interests and place them in the ideal cohort.',
  },
];
