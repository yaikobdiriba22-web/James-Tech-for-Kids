export type Language = 'en' | 'om' | 'am';

export interface TranslationDict {
  nav: {
    home: string;
    about: string;
    programs: string;
    projects: string;
    parents: string;
    faq: string;
    contact: string;
    enrollNow: string;
  };
  hero: {
    tagline: string;
    headline: string;
    subheadline: string;
    exploreBtn: string;
    enrollBtn: string;
    badge: string;
  };
  about: {
    title: string;
    subtitle: string;
    quote: string;
    learnTitle: string;
    learnDesc: string;
    buildTitle: string;
    buildDesc: string;
    growTitle: string;
    growDesc: string;
  };
  programs: {
    title: string;
    subtitle: string;
    viewDetails: string;
    filterAll: string;
  };
}

export const translations: Record<Language, TranslationDict> = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      programs: 'Programs',
      projects: 'Projects',
      parents: 'Parents',
      faq: 'FAQ',
      contact: 'Contact',
      enrollNow: 'Enroll Now',
    },
    hero: {
      tagline: 'Technology Academy for Ages 7–16',
      headline: 'Building Future Generations Through Technology',
      subheadline:
        'Empowering young learners ages 7–16 to learn technology, solve problems, build real projects, and create with confidence.',
      exploreBtn: 'Explore Programs',
      enrollBtn: 'Enroll Now',
      badge: 'Practical Hands-on Learning',
    },
    about: {
      title: 'About James Tech',
      subtitle: 'Moving young minds from digital consumers to innovative creators.',
      quote:
        'We do not want young people to only consume technology. We want them to understand it, create with it, and use it to solve problems.',
      learnTitle: 'LEARN',
      learnDesc: 'Build strong technology foundations with clear, structured curriculum.',
      buildTitle: 'BUILD',
      buildDesc: 'Turn theoretical knowledge into real web apps, games, code, and robotics.',
      growTitle: 'GROW',
      growDesc: 'Develop resilience, problem-solving, digital ethics, and lasting confidence.',
    },
    programs: {
      title: 'Programs Designed for Young Creators',
      subtitle:
        'Age-appropriate, practical technology learning designed to help students move from curiosity to creation.',
      viewDetails: 'View Program Details',
      filterAll: 'All Programs',
    },
  },
  om: {
    nav: {
      home: 'Fuula Dura',
      about: 'Waa\'ee Keenya',
      programs: 'Sagantaalee',
      projects: 'Piroojektiiwwan',
      parents: 'Maatiiwwaniif',
      faq: 'Gaaffilee',
      contact: 'Nu Qunnamaa',
      enrollNow: 'Amma Galmaa\'aa',
    },
    hero: {
      tagline: 'Akaadaamii Teeknooloojii Waggaa 7–16',
      headline: 'Dhaloota Boruu Teeknooloojiin Ijaaruu',
      subheadline:
        'Daa\'immanii fi dargaggoota umrii 7–16 teeknooloojii akka barataniif, rakkoo furaniifi piroojektiiwwan qabatamaa akka ijaaraniif humneessuu.',
      exploreBtn: 'Sagantaalee Daawwadhaa',
      enrollBtn: 'Amma Galmaa\'aa',
      badge: 'Barumsa Qabatamaa fi Harkaatiin',
    },
    about: {
      title: 'Waa\'ee James Tech',
      subtitle: 'Sammuu dargaggootaa fayyadamtoota irraa gara uumtota teeknooloojiitti jijjiiruu.',
      quote:
        'Dargaggoonni teeknooloojii qofa akka fayyadaman hin barbaannu. Akka hubatan, ittiin uumaniifi rakkoolee ittiin furan barbaanna.',
      learnTitle: 'BARADHAA',
      learnDesc: 'Bu\'uura teeknooloojii cimaa qajeelfama ifa ta\'een ijaaraa.',
      buildTitle: 'IJAARAA',
      buildDesc: 'Beekumsa qabatamaa gara weebsaayitii, taphoota fi roobootiitti jijjiiraa.',
      growTitle: 'GUDDADHA',
      growDesc: 'Dandeettii furmaata rakkoo, ofitti amanummaa fi kalaqa horadhaa.',
    },
    programs: {
      title: 'Sagantaalee Dargaggoota Uumtotaaf Qophaa\'an',
      subtitle:
        'Barumsa teeknooloojii umriin wal simu kan barattoota fedhii qorannoo irraa gara uumuutti ceesisu.',
      viewDetails: 'Bal\'ina Sagantaa Ilaalaa',
      filterAll: 'Sagantaalee Hunda',
    },
  },
  am: {
    nav: {
      home: 'ዋና ገጽ',
      about: 'ስለ እኛ',
      programs: 'ፕሮግራሞች',
      projects: 'ፕሮጀክቶች',
      parents: 'ለወላጆች',
      faq: 'ጥያቄዎች',
      contact: 'ያግኙን',
      enrollNow: 'አሁኑኑ ይመዝገቡ',
    },
    hero: {
      tagline: 'የቴክኖሎጂ አካዳሚ ከ7–16 ዓመት',
      headline: 'የነገውን ትውልድ በቴክኖሎጂ መገንባት',
      subheadline:
        'ከ7–16 ዓመት ዕድሜ ያላቸው ወጣቶች ቴክኖሎጂን እንዲማሩ፣ ችግሮችን እንዲፈቱ እና እውነተኛ ፕሮጀክቶችን በራስ መተማመን እንዲፈጥሩ እናበረታታለን።',
      exploreBtn: 'ፕሮግራሞችን ይመልከቱ',
      enrollBtn: 'አሁኑኑ ይመዝገቡ',
      badge: 'ተግባራዊ የተግባር ትምህርት',
    },
    about: {
      title: 'ስለ ጄምስ ቴክ (James Tech)',
      subtitle: 'ወጣቶችን ከቴክኖሎጂ ተጠቃሚነት ወደ ፈጣሪነት ማሸጋገር።',
      quote:
        'ወጣቶች ቴክኖሎጂን ብቻ እንዲጠቀሙ አንፈልግም። እንዲረዱት፣ በእርሱ እንዲፈጥሩ እና ችግሮችን እንዲፈቱበት እንፈልጋለን።',
      learnTitle: 'ይማሩ',
      learnDesc: 'ጠንካራ የቴክኖሎጂ መሰረት ግልጽ በሆነ ስርዓተ-ትምህርት ይገንቡ።',
      buildTitle: 'ይገንቡ',
      buildDesc: 'የንድፈ ሃሳብ እውቀትን ወደ እውነተኛ ድረ-ገጾች፣ ጨዋታዎች እና ሮቦቲክስ ይለውጡ።',
      growTitle: 'ያድጉ',
      growDesc: 'የችግር አፈታት ችሎታን፣ ዲጂታል ስነ-ምግባርን እና ፅኑ በራስ መተማመንን ያዳብሩ።',
    },
    programs: {
      title: 'ለወጣት ፈጣሪዎች የተዘጋጁ ፕሮግራሞች',
      subtitle:
        'ተማሪዎች ከመጓጓት ወደ ፈጠራ እንዲሸጋገሩ የተዘጋጀ ተግባራዊ እና እድሜን ያገናዘበ የቴክኖሎጂ ትምህርት።',
      viewDetails: 'ዝርዝሩን ይመልከቱ',
      filterAll: 'ሁሉም ፕሮግራሞች',
    },
  },
};
