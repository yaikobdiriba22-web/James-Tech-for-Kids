export interface ProgramCurriculumWeek {
  week: string;
  topic: string;
  activities: string[];
}

export interface Program {
  id: string;
  title: string;
  ageRange: string;
  minAge: number;
  maxAge: number;
  difficulty: 'Beginner' | 'Beginner to Intermediate' | 'Intermediate' | 'Intermediate to Advanced';
  category: 'coding' | 'web' | 'hardware' | 'ai' | 'design';
  shortDesc: string;
  image: string;
  skillsLearned: string[];
  exampleProjects: string[];
  overview: string;
  whoItIsFor: string;
  duration: string;
  learningObjectives: string[];
  curriculum: ProgramCurriculumWeek[];
  expectedOutcomes: string[];
  requiredEquipment: string;
  faq: { question: string; answer: string }[];
}

export const programs: Program[] = [
  {
    id: 'scratch-game-dev',
    title: 'Scratch & Game Development',
    ageRange: 'Ages 7–10',
    minAge: 7,
    maxAge: 10,
    difficulty: 'Beginner',
    category: 'coding',
    shortDesc:
      'Learn programming concepts through visual coding, creativity, storytelling, and game development.',
    image: '/src/assets/images/program_digital_creativity_1790772282000.jpg',
    skillsLearned: [
      'Visual Block Coding',
      'Sequencing & Loops',
      'Event Handling',
      'Game Logic & Mechanics',
      'Storyboarding & Creative Animation',
    ],
    exampleProjects: [
      'Interactive Animated Storybook',
      'Maze Runner Adventure Game',
      'Catch-the-Coin Arcade',
      'Musical Instrument Simulation',
    ],
    overview:
      'Designed specifically for curious young minds taking their very first steps into computing. Using MIT Scratch, students learn core computer science logic visually without syntax frustration, unlocking confidence by turning ideas into playable games and animated adventures.',
    whoItIsFor:
      'Children ages 7 to 10 with zero previous coding experience who love games, storytelling, drawing, and interactive discovery.',
    duration: '10 Weeks · 2 Sessions / Week · 90 min per session',
    learningObjectives: [
      'Understand how algorithms and sequential commands instruct computers.',
      'Master loops, if/else conditionals, and broadcast events.',
      'Design original sprites, backdrops, and multi-level game mechanics.',
      'Practice debugging and testing code systematically.',
    ],
    curriculum: [
      {
        week: 'Weeks 1–2',
        topic: 'Introduction to Creative Computing & Scratch Workspace',
        activities: [
          'Navigating sprites, coordinates, and stages',
          'First sequence: Animating a dancing character with sound',
        ],
      },
      {
        week: 'Weeks 3–4',
        topic: 'Motion, Keyboard Controls & Game Loops',
        activities: [
          'Building arrow-key movement and boundary collisions',
          'Creating a maze escape challenge with score tracking',
        ],
      },
      {
        week: 'Weeks 5–6',
        topic: 'Variables, Scores & Conditional Logic',
        activities: [
          'Health bars, timers, and game-over states',
          'Developing a timed fruit-catching arcade game',
        ],
      },
      {
        week: 'Weeks 7–8',
        topic: 'Interactive Storytelling & Broadcast Messages',
        activities: [
          'Multi-scene digital comic with dialogues and voice recordings',
          'Connecting sprites with broadcast message triggers',
        ],
      },
      {
        week: 'Weeks 9–10',
        topic: 'Capstone Game Production & Showcase',
        activities: [
          'Planning, building, and polishing an original capstone game',
          'Presenting and play-testing with parents and peers',
        ],
      },
    ],
    expectedOutcomes: [
      'Confidence to break down complex logic into step-by-step algorithms.',
      'Portfolio of 4 playable games and interactive animations.',
      'Strong readiness for text-based languages like Python and Web development.',
    ],
    requiredEquipment:
      'Laptop or desktop computer (Windows, Mac, Chromebook, or Linux) with internet connection and working browser.',
    faq: [
      {
        question: 'Does my 7-year-old need typing skills?',
        answer:
          'No prior typing speed is required. Scratch utilizes visual drag-and-drop block coding, making it ideal for young children while still teaching genuine computer science concepts.',
      },
      {
        question: 'Can parents see the projects built?',
        answer:
          'Yes! Every project is saved to the student’s James Tech digital portfolio with shareable links for family and school teachers.',
      },
    ],
  },
  {
    id: 'web-development',
    title: 'Web Development',
    ageRange: 'Ages 10–16',
    minAge: 10,
    maxAge: 16,
    difficulty: 'Beginner to Intermediate',
    category: 'web',
    shortDesc:
      'Learn how websites work and build real responsive websites using modern web technologies: HTML, CSS, and JavaScript.',
    image: '/src/assets/images/program_web_python_1790772270285.jpg',
    skillsLearned: [
      'HTML5 Semantic Structure',
      'CSS3 & Flexbox Layouts',
      'Responsive Mobile-First Design',
      'JavaScript DOM Manipulation',
      'Publishing & Web Hosting',
    ],
    exampleProjects: [
      'Personal Bio & Portfolio Website',
      'Interactive Quiz Application',
      'Community Causes Landing Page',
      'School Science Fair Project Showcase',
    ],
    overview:
      'The web is the world’s most accessible software platform. In this track, students move from users of the internet to web builders. They learn semantic markup, modern CSS styling, interactive scripting, and publish live, accessible sites to the internet.',
    whoItIsFor:
      'Students ages 10 to 16 who want to create their own websites, understand internet infrastructure, or build digital projects for school and passions.',
    duration: '12 Weeks · 2 Sessions / Week · 90 min per session',
    learningObjectives: [
      'Structure clean web pages using semantic HTML5 elements.',
      'Style layouts with responsive CSS, modern colors, and typography.',
      'Add dynamic interactivity, event listeners, and user inputs with JavaScript.',
      'Deploy live projects online using version control and static hosting.',
    ],
    curriculum: [
      {
        week: 'Weeks 1–3',
        topic: 'Foundations of the Web & Semantic HTML5',
        activities: [
          'How the internet works: servers, browsers, and URLs',
          'Document structure, headings, links, images, and audio/video',
          'Building a structured personal profile web page',
        ],
      },
      {
        week: 'Weeks 4–6',
        topic: 'Styling with Modern CSS & Responsive Layouts',
        activities: [
          'Colors, typography, box model, margins, and padding',
          'Modern layouts with CSS Flexbox and media queries for mobile devices',
          'Styling a community cause campaign website',
        ],
      },
      {
        week: 'Weeks 7–9',
        topic: 'Interactive Web with JavaScript',
        activities: [
          'Variables, functions, and event listeners',
          'DOM manipulation: changing content, theme toggles, and form validation',
          'Building an interactive trivia quiz with live scoring',
        ],
      },
      {
        week: 'Weeks 10–12',
        topic: 'Capstone Project, Deployment & Live Showcase',
        activities: [
          'Designing and coding a multi-page personal or community website',
          'Publishing live to the web and presenting at Demo Day',
        ],
      },
    ],
    expectedOutcomes: [
      'Live online portfolio accessible via custom web URL.',
      'Solid command of HTML5, CSS3, and JavaScript fundamentals.',
      'Clear understanding of web accessibility, UX, and mobile responsiveness.',
    ],
    requiredEquipment:
      'Laptop or desktop computer (Windows, Mac, or Linux) with VS Code (or browser-based editor) and internet access.',
    faq: [
      {
        question: 'Do students build real websites or just mockups?',
        answer:
          'Students write authentic HTML, CSS, and JavaScript from scratch and deploy genuine, live websites on the internet that friends and family can visit on phones and computers.',
      },
    ],
  },
  {
    id: 'python-programming',
    title: 'Python Programming',
    ageRange: 'Ages 11–16',
    minAge: 11,
    maxAge: 16,
    difficulty: 'Intermediate',
    category: 'coding',
    shortDesc:
      'Develop programming logic and problem-solving skills using Python, the world’s most versatile programming language.',
    image: '/src/assets/images/program_web_python_1790772270285.jpg',
    skillsLearned: [
      'Variables & Data Types',
      'Conditionals & Boolean Logic',
      'Loops & Iteration',
      'Functions & Modular Code',
      'Data Structures (Lists & Dictionaries)',
      'Algorithmic Problem Solving',
    ],
    exampleProjects: [
      'Text-Based Adventure RPG Game',
      'Smart Student Expense & Savings Calculator',
      'Password Strength Evaluator & Generator',
      'Automated Weather & Trivia Fetcher',
    ],
    overview:
      'Python powers data science, machine learning, robotics, and major tech platforms. In this course, middle and high school students build computational thinking rigor. They write clean, readable code and solve real-world problems through programmatic logic.',
    whoItIsFor:
      'Youth ages 11 to 16 interested in software development, data science, mathematics, or advancing from visual block coding to professional text coding.',
    duration: '12 Weeks · 2 Sessions / Week · 90 min per session',
    learningObjectives: [
      'Master core programming concepts applicable to all modern languages.',
      'Write clean, modular code with reusable functions.',
      'Handle user inputs, file handling, and basic error handling.',
      'Develop algorithmic thinking to solve computational math and logic puzzles.',
    ],
    curriculum: [
      {
        week: 'Weeks 1–3',
        topic: 'Python Basics, Variables & Operators',
        activities: [
          'Setting up Python environment and interactive REPL',
          'Strings, integers, floats, arithmetic, and user input',
          'Mini-project: Interactive Mad Libs story generator',
        ],
      },
      {
        week: 'Weeks 4–6',
        topic: 'Conditionals, Loops & Game Logic',
        activities: [
          'If, elif, else branches and boolean expressions',
          'While loops, for loops, and range iteration',
          'Mini-project: Number guessing game and Rock-Paper-Scissors AI',
        ],
      },
      {
        week: 'Weeks 7–9',
        topic: 'Functions, Lists & Dictionaries',
        activities: [
          'Writing parameterized functions with return values',
          'Organizing data with lists, indexing, slicing, and dictionaries',
          'Mini-project: Student grade tracker and flashcard trainer',
        ],
      },
      {
        week: 'Weeks 10–12',
        topic: 'Object-Oriented Basics, Capstone & Presentation',
        activities: [
          'Intro to classes and clean code architecture',
          'Building an original capstone console application',
          'Code review, documentation, and live showcase',
        ],
      },
    ],
    expectedOutcomes: [
      'Ability to write structured Python scripts independently.',
      'Strong problem-solving mindset applicable to STEM school subjects.',
      'Foundation for advanced topics like AI, Data Science, and competitive coding.',
    ],
    requiredEquipment:
      'Computer with Windows 10/11, macOS, or Linux, capable of running Python 3 and a code editor.',
    faq: [
      {
        question: 'Is Python too difficult for a beginner?',
        answer:
          'Python is famous for its clean, English-like syntax. We start with tangible, relatable exercises and build step-by-step so students never feel overwhelmed.',
      },
    ],
  },
  {
    id: 'ai-emerging-tech',
    title: 'AI & Emerging Technology',
    ageRange: 'Ages 12–16',
    minAge: 12,
    maxAge: 16,
    difficulty: 'Intermediate to Advanced',
    category: 'ai',
    shortDesc:
      'Introduce students to artificial intelligence, emerging technologies, digital creativity, and responsible technology use.',
    image: '/src/assets/images/hero_young_coders_1790772247820.jpg',
    skillsLearned: [
      'Core AI & Machine Learning Concepts',
      'Training Data & Bias Awareness',
      'Generative AI & Prompt Engineering',
      'Computer Vision Basics',
      'AI Ethics & Responsible Digital Citizenship',
    ],
    exampleProjects: [
      'Image Classifier for Eco-Waste Recycling',
      'Custom Subject-Specific AI Study Tutor',
      'Ethical AI Impact Presentation for Schools',
      'Audio & Speech Recognition Mini-App',
    ],
    overview:
      'Artificial intelligence is reshaping every industry. Instead of passive consumers of AI chatbots, James Tech students learn how neural networks learn, how data influences models, how to use AI tools as creative amplifiers, and how to champion ethical, responsible digital futures.',
    whoItIsFor:
      'Teenagers ages 12 to 16 curious about how AI works behind the scenes, how to build with smart tools, and what the future of technology holds.',
    duration: '10 Weeks · 2 Sessions / Week · 90 min per session',
    learningObjectives: [
      'Demystify artificial intelligence: supervised learning, neural networks, and LLMs.',
      'Train lightweight machine learning models using Teachable Machine and Python.',
      'Formulate effective prompt structures for research, coding, and creative problem solving.',
      'Critically analyze data bias, privacy, copyright, and ethical implications.',
    ],
    curriculum: [
      {
        week: 'Weeks 1–2',
        topic: 'What is AI? Human Intelligence vs Machine Logic',
        activities: [
          'History and types of AI: Narrow vs General',
          'Data: the fuel of machine learning; supervised vs unsupervised',
        ],
      },
      {
        week: 'Weeks 3–4',
        topic: 'Computer Vision & Teachable Machines',
        activities: [
          'Collecting training datasets with webcams',
          'Training a visual model to classify objects or hand gestures',
        ],
      },
      {
        week: 'Weeks 5–6',
        topic: 'Language Models & Generative AI',
        activities: [
          'How token prediction and transformers work in simple terms',
          'Prompt engineering techniques for learning and coding assistance',
        ],
      },
      {
        week: 'Weeks 7–8',
        topic: 'Ethics, Bias & Digital Responsibility',
        activities: [
          'Case studies on facial recognition bias and algorithmic fairness',
          'Intellectual property, privacy, and digital safety for youth',
        ],
      },
      {
        week: 'Weeks 9–10',
        topic: 'Capstone AI Solution for Local Community',
        activities: [
          'Designing an AI-assisted tool solving an environmental or community need',
          'Final capstone presentation and ethical evaluation',
        ],
      },
    ],
    expectedOutcomes: [
      'Deep conceptual clarity on how AI models learn and make predictions.',
      'Hands-on experience training and deploying custom ML prototypes.',
      'Responsible digital literacy and leadership skills.',
    ],
    requiredEquipment:
      'Computer with webcam, microphone, modern web browser, and stable internet.',
    faq: [
      {
        question: 'Does this program teach kids to just prompt ChatGPT?',
        answer:
          'No. We teach foundational machine learning concepts—how models are trained, dataset collection, computer vision, algorithmic bias, and programmatic integration with code.',
      },
    ],
  },
  {
    id: 'robotics-stem',
    title: 'Robotics & STEM',
    ageRange: 'Ages 8–16',
    minAge: 8,
    maxAge: 16,
    difficulty: 'Beginner to Intermediate',
    category: 'hardware',
    shortDesc:
      'Combine technology, engineering, creativity, and problem solving through practical STEM activities and physical computing.',
    image: '/src/assets/images/program_robotics_stem_1790772259629.jpg',
    skillsLearned: [
      'Circuit Fundamentals & Breadboarding',
      'Microcontroller Programming (Arduino / Micro:bit)',
      'Sensors (Ultrasonic, Light, Temperature)',
      'Actuators & Motor Control',
      'Engineering Design Process',
    ],
    exampleProjects: [
      'Smart Automatic Plant Watering Monitor',
      'Autonomous Obstacle-Avoiding Rover Car',
      'Burglar Alarm with Motion & Light Sensor',
      'Digital Temperature & Climate Station',
    ],
    overview:
      'Where software meets the physical world. In Robotics & STEM, students wire electronic components, read sensor inputs, control motors, and program microcontrollers to solve tangible challenges in agriculture, home automation, and mobility.',
    whoItIsFor:
      'Hands-on learners ages 8 to 16 who love building things, tinkering with electronics, mechanics, and physical inventions.',
    duration: '12 Weeks · 2 Sessions / Week · 90 min per session',
    learningObjectives: [
      'Understand electrical circuits, voltage, current, resistance, and ground.',
      'Program microcontrollers to read analog/digital sensor inputs.',
      'Drive DC motors, servos, and LEDs based on real-time sensory data.',
      'Apply the engineering design cycle: prototype, test, iterate, and refine.',
    ],
    curriculum: [
      {
        week: 'Weeks 1–3',
        topic: 'Electricity, Circuits & Microcontroller Intro',
        activities: [
          'Breadboards, LEDs, resistors, and Ohm’s Law hands-on experiments',
          'Connecting microcontroller to computer and writing first blink code',
        ],
      },
      {
        week: 'Weeks 4–6',
        topic: 'Sensors: Giving Computers Senses',
        activities: [
          'Light-dependent resistors (LDR), push buttons, and buzzers',
          'Ultrasonic distance sensors for measuring proximity',
          'Mini-project: Smart intruder alarm system',
        ],
      },
      {
        week: 'Weeks 7–9',
        topic: 'Motors, Movement & Automation',
        activities: [
          'Servo motors and DC motor drivers (H-Bridge)',
          'Building chassis, wheels, and speed regulation',
          'Mini-project: Obstacle-navigating robotic vehicle',
        ],
      },
      {
        week: 'Weeks 10–12',
        topic: 'STEM Capstone Challenge & Live Testing',
        activities: [
          'Team engineering challenge: solving a real-world local problem',
          'Live robot arena test and student presentation',
        ],
      },
    ],
    expectedOutcomes: [
      'Comfort working with physical electronic components and wiring.',
      'Ability to code hardware microcontrollers to respond to real physical signals.',
      'Completed physical STEM invention and engineering logbook.',
    ],
    requiredEquipment:
      'In-person cohorts use James Tech lab hardware kits. Online cohorts receive equipment guidance or utilize interactive browser-based circuit simulators (Tinkercad Circuits).',
    faq: [
      {
        question: 'Do we need to buy expensive robotics parts before starting?',
        answer:
          'For in-person programs at our academy, all robotics kits, components, and tools are provided. For online learners, we provide a curated hardware kit checklist or use free high-fidelity online simulators.',
      },
    ],
  },
  {
    id: 'ui-ux-digital-creativity',
    title: 'UI/UX & Digital Creativity',
    ageRange: 'Ages 8–16',
    minAge: 8,
    maxAge: 16,
    difficulty: 'Beginner',
    category: 'design',
    shortDesc:
      'Teach students how to think creatively and design useful, intuitive digital experiences and interfaces.',
    image: '/src/assets/images/program_digital_creativity_1790772282000.jpg',
    skillsLearned: [
      'Design Thinking & User Research',
      'Wireframing & Information Architecture',
      'Visual UI Design (Color, Typography, Grids)',
      'Interactive Prototyping',
      'Usability Testing & Feedback Loops',
    ],
    exampleProjects: [
      'Mobile App Prototype for Kids Book Club',
      'School Canteen Ordering Experience',
      'Digital Poster & Brand Identity Package',
      'Gamified Fitness Tracker UI Wireframe',
    ],
    overview:
      'Great technology requires great design. This track teaches young creators how to observe user needs, sketch wireframes, choose harmonious color schemes, and create interactive clickable prototypes using industry-standard design tools like Figma.',
    whoItIsFor:
      'Creative youth ages 8 to 16 with an eye for visual art, drawing, user empathy, or those who want to complement coding with digital product design.',
    duration: '10 Weeks · 2 Sessions / Week · 90 min per session',
    learningObjectives: [
      'Apply the 5 stages of Design Thinking: Empathize, Define, Ideate, Prototype, Test.',
      'Master visual hierarchy, accessibility contrast, and typography rules.',
      'Build clickable, animated mobile and web interactive prototypes.',
      'Conduct usability tests and iterate designs based on user feedback.',
    ],
    curriculum: [
      {
        week: 'Weeks 1–2',
        topic: 'What is UX vs UI? The Creative Problem Solver',
        activities: [
          'Deconstructing popular apps kids use daily (why is TikTok or Roblox easy to use?)',
          'Paper sketching and low-fidelity wireframing exercises',
        ],
      },
      {
        week: 'Weeks 3–4',
        topic: 'Mastering Digital Design Tools (Figma Fundamentals)',
        activities: [
          'Frames, shapes, vector tools, and typography',
          'Creating icon sets and button states (hover, pressed)',
        ],
      },
      {
        week: 'Weeks 5–6',
        topic: 'Color Theory, Typography & Visual Design',
        activities: [
          'Contrast ratios and accessibility for all users',
          'Designing high-fidelity screens for a youth educational mobile app',
        ],
      },
      {
        week: 'Weeks 7–8',
        topic: 'Interactive Prototyping & Micro-Animations',
        activities: [
          'Connecting screens with transitions, smart animate, and overlays',
          'Creating realistic mobile phone flows you can test on an actual phone',
        ],
      },
      {
        week: 'Weeks 9–10',
        topic: 'Usability Testing & Capstone Design Showcase',
        activities: [
          'Testing prototypes with peers and parents, recording observations',
          'Pitching product design solutions at the James Tech Design Showcase',
        ],
      },
    ],
    expectedOutcomes: [
      'Professional Figma design portfolio with clickable app prototypes.',
      'Empathetic, user-centered problem solving mindset.',
      'Preparation for careers in product design, web design, and creative tech.',
    ],
    requiredEquipment:
      'Laptop or desktop computer with web browser (Figma runs smoothly in Chrome, Edge, Safari, Firefox).',
    faq: [
      {
        question: 'Is coding required for the UI/UX track?',
        answer:
          'No prior coding is required. This track focuses on design thinking, visual problem solving, and clickable prototyping, serving as a perfect partner skill to software engineering.',
      },
    ],
  },
];
