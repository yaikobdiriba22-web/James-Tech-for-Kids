export interface StudentProject {
  id: string;
  title: string;
  category: 'game' | 'web' | 'python' | 'ai' | 'robotics' | 'design';
  categoryLabel: string;
  ageLevel: string;
  studentLevel: string;
  technology: string[];
  problemSolved: string;
  whatStudentsLearned: string;
  shortSummary: string;
  isDemoSample: boolean;
  codeSnippet?: string;
  previewType: 'code' | 'interactive' | 'circuit' | 'ui';
}

export const projectsData: StudentProject[] = [
  {
    id: 'solar-defender-game',
    title: 'Solar Defender 2D Arcade',
    category: 'game',
    categoryLabel: 'Scratch & Game Dev',
    ageLevel: 'Ages 8–10',
    studentLevel: 'Beginner Cohort',
    technology: ['MIT Scratch 3.0', 'Broadcast Logic', 'Physics Coordinates'],
    problemSolved:
      'Creates a fun, engaging way for younger peers to learn about asteroid hazards and orbital mechanics while practicing keyboard coordination.',
    whatStudentsLearned:
      'Cartesian (X, Y) coordinates, velocity variables, sprite collision detection, score states, and broadcasting triggers between scenes.',
    shortSummary:
      'A space survival arcade game where players pilot a spaceship to deflect space debris and collect fuel cells.',
    isDemoSample: true,
    codeSnippet: `when green flag clicked
set [score v] to [0]
forever
  if <key [space v] pressed?> then
    create clone of [Laser v]
    play sound [LaserBlast v]
    wait (0.2) secs
  end
end`,
    previewType: 'code',
  },
  {
    id: 'community-market-portal',
    title: 'Addis Fresh Farmers Showcase',
    category: 'web',
    categoryLabel: 'Web Development',
    ageLevel: 'Ages 12–14',
    studentLevel: 'Intermediate Track',
    technology: ['HTML5 Semantic', 'CSS Grid & Flexbox', 'JavaScript DOM'],
    problemSolved:
      'Provides local small-scale agricultural producers with a clean, mobile-accessible online storefront to display seasonal produce and contact details.',
    whatStudentsLearned:
      'Semantic document markup, mobile responsiveness without frameworks, asynchronous product card rendering, and accessible form validation.',
    shortSummary:
      'Responsive web portal featuring farm produce catalogs, interactive price filters, and direct WhatsApp merchant inquiry links.',
    isDemoSample: true,
    codeSnippet: `// Dynamic Filter by Category
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const selectedCategory = e.target.dataset.category;
    renderProducts(selectedCategory);
  });
});`,
    previewType: 'interactive',
  },
  {
    id: 'study-companion-bot',
    title: 'Smart Student Study & Flashcard CLI',
    category: 'python',
    categoryLabel: 'Python Programming',
    ageLevel: 'Ages 11–15',
    studentLevel: 'Intermediate Track',
    technology: ['Python 3', 'File I/O', 'Dictionary Data Structures'],
    problemSolved:
      'Assists students in memorizing science and history definitions with an active recall testing engine that tracks difficulty frequencies.',
    whatStudentsLearned:
      'Python functions, dictionary manipulation, reading/writing local JSON files, calculating accuracy percentages, and modular code architecture.',
    shortSummary:
      'Interactive command-line tool that quizzes learners on revision topics, monitors weak areas, and rewards daily study streaks.',
    isDemoSample: true,
    codeSnippet: `def evaluate_answer(user_input, correct_term, score_tracker):
    similarity = user_input.strip().lower() == correct_term.lower()
    if similarity:
        score_tracker["streak"] += 1
        print("✓ Brilliant! Streak is now:", score_tracker["streak"])
        return True
    score_tracker["needs_review"].append(correct_term)
    return False`,
    previewType: 'code',
  },
  {
    id: 'waste-classifier-model',
    title: 'EcoSort Visual Waste Classifier',
    category: 'ai',
    categoryLabel: 'AI & Emerging Tech',
    ageLevel: 'Ages 13–16',
    studentLevel: 'Advanced Track',
    technology: ['TensorFlow.js', 'Teachable Machine', 'Computer Vision'],
    problemSolved:
      'Reduces recyclable contamination by classifying common waste items (plastic, paper, organic, e-waste) instantly through a camera stream.',
    whatStudentsLearned:
      'Data preparation and diversity, model overfitting vs generalization, confidence thresholding, and ethical AI deployment for civic environments.',
    shortSummary:
      'Computer vision classification model that identifies waste categories in real time and displays disposal instructions.',
    isDemoSample: true,
    codeSnippet: `async function classifyStream(videoElement) {
  const predictions = await model.classify(videoElement);
  const topResult = predictions[0];
  if (topResult.probability > 0.85) {
    updateBinIndicator(topResult.className);
  }
}`,
    previewType: 'interactive',
  },
  {
    id: 'smart-plant-waterer',
    title: 'Autonomous Agro-STEM Soil Guardian',
    category: 'robotics',
    categoryLabel: 'Robotics & STEM',
    ageLevel: 'Ages 9–14',
    studentLevel: 'Hands-on Track',
    technology: ['Arduino C++', 'Capacitive Soil Sensor', 'Submersible 5V Pump'],
    problemSolved:
      'Prevents domestic and classroom plants from drying out during holiday breaks while conserving water through automated soil-moisture thresholds.',
    whatStudentsLearned:
      'Analog voltage readings, relay switch triggering, circuit schematics, hardware safety, and algorithmic hysteresis loops.',
    shortSummary:
      'Microcontroller-driven system that measures soil hydration every hour and activates a precision pump when moisture dips below 25%.',
    isDemoSample: true,
    codeSnippet: `void loop() {
  int moisture = analogRead(SOIL_PIN);
  if (moisture < DRY_THRESHOLD) {
    digitalWrite(PUMP_PIN, HIGH);
    delay(2500); // Pulse water
    digitalWrite(PUMP_PIN, LOW);
  }
  delay(10000);
}`,
    previewType: 'circuit',
  },
  {
    id: 'book-bridge-app-ui',
    title: 'BookBridge Youth Library App',
    category: 'design',
    categoryLabel: 'UI/UX & Digital Design',
    ageLevel: 'Ages 10–16',
    studentLevel: 'Creative Track',
    technology: ['Figma', 'Design Systems', 'Micro-Interactions'],
    problemSolved:
      'Solves the friction students face when searching for and reserving supplementary reading materials in community youth centers.',
    whatStudentsLearned:
      'User journey mapping, 8px grid spacing, color contrast ratios (WCAG AA), component variants, and interactive prototype animations.',
    shortSummary:
      'A complete mobile application UX prototype featuring reading logs, book sharing between friends, and gamified reading badges.',
    isDemoSample: true,
    codeSnippet: `/* Design System Token Sample */
:root {
  --color-brand-primary: #0284c7;
  --color-surface-card: #ffffff;
  --radius-container: 16px;
  --font-heading: 'Outfit', sans-serif;
}`,
    previewType: 'ui',
  },
];
