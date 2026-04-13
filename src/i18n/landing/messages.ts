/**
 * Landing page copy for EN / RU / UZ.
 * Arrays (steps, dashboards, experts, demo metadata) are duplicated per locale.
 */

export type LandingLocale = 'en' | 'ru' | 'uz';

export const LANDING_LOCALES: LandingLocale[] = ['en', 'ru', 'uz'];

export const DEFAULT_LANDING_LOCALE: LandingLocale = 'en';

export const STORAGE_KEY_LANDING_LOCALE = 'aida-landing-locale';

export type DemoSegmentMsg = { speaker: number; text: string };

export type LandingMessages = {
  header: { nav: { home: string; howItWorks: string; aboutUs: string } };
  footer: { copyright: string };
  cta: { titleLine1: string; titleLine2: string; subtitle: string; button: string };
  bookDemo: {
    title: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    submit: string;
    closeAria: string;
    successTitle: string;
    successBody: string;
    bookAnother: string;
  };
  hero: {
    line1: string;
    line2: string;
    cta: string;
    slides: { title: string; text: string }[];
  };
  steps: {
    sectionTitle: string;
    sectionSubtitle: string;
    items: { id: string; title: string; description: string; className: string }[];
  };
  industries: {
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    labels: string[];
  };
  worksBanner: {
    titleBefore: string;
    titleHighlight: string;
    subtitle: string;
    float1: string;
    float2: string;
    float3: string;
    float4: string;
  };
  analysis: {
    sectionTitle: string;
    demoTitle: string;
    demoEyebrow: string;
    demoHint: string;
    segments: DemoSegmentMsg[];
  };
  dashboards: {
    title: string;
    subtitle: string;
    items: { title: string; text: string; image: string }[];
  };
  experts: {
    eyebrow: string;
    title: string;
    subtitle: string;
    tips: { title: string; text: string; image: string }[];
  };
  about: {
    eyebrow: string;
    titleAbout: string;
    titleUs: string;
    phoneLabel: string;
    emailLabel: string;
    addressLabel: string;
    addressLine1: string;
    addressLine2: string;
    leaders: { name: string; bio: string; image: string; top: boolean }[];
  };
};

const dashboardImages = [
  '/landing/img/dashboards-img1.png',
  '/landing/img/dashboards-img2.png',
  '/landing/img/dashboards-img3.png',
];

const expertImages = [
  '/landing/img/experts-img2.jpg',
  '/landing/img/experts-img3.jpg',
  '/landing/img/experts-img4.jpg',
  '/landing/img/experts-img5.jpg',
  '/landing/img/experts-img6.jpg',
  '/landing/img/experts-img1.jpg',
];

function attachImages<T extends { image: string }>(items: Omit<T, 'image'>[], images: string[]): T[] {
  return items.map((item, i) => ({ ...item, image: images[i] ?? images[0] })) as T[];
}

const stepClassNames = ['step1', 'step2', 'step3', 'step4'] as const;

export const landingMessages: Record<LandingLocale, LandingMessages> = {
  en: {
    header: {
      nav: { home: 'Home', howItWorks: 'How It Works', aboutUs: 'About Us' },
    },
    footer: { copyright: '© 2026 AIDA Sales. All rights reserved.' },
    cta: {
      titleLine1: 'Turn your conversations into',
      titleLine2: 'business growth',
      subtitle: 'Book a personalized demo and explore how AIDA drives quality, control, and performance',
      button: 'Book Demo',
    },
    bookDemo: {
      title: 'Book a demo',
      nameLabel: 'Your name',
      namePlaceholder: 'Full name',
      phoneLabel: 'Phone',
      phonePlaceholder: '+998 …',
      emailLabel: 'Email',
      emailPlaceholder: 'you@company.com',
      submit: 'Send request',
      closeAria: 'Close',
      successTitle: 'Request sent',
      successBody: 'We will contact you shortly.',
      bookAnother: 'Send another request',
    },
    hero: {
      line1: 'Tools',
      line2: 'to increase',
      cta: 'Book Demo',
      slides: [
        {
          title: 'Tools to increase Sales',
          text:
            'We help banks, telecom and government to improve their service — turn every conversation into success',
        },
        {
          title: 'Tools to increase AI to upgrade Skills',
          text:
            'Empower your team with hints — help agents navigate complex dialogues with confidence.',
        },
        {
          title: 'Tools to increase Insights to control Quality',
          text:
            "Get full visibility into your team's dialogues — make data-driven decisions to train your staff effectively.",
        },
      ],
    },
    steps: {
      sectionTitle: '4 Steps to Success',
      sectionSubtitle: 'From voice to insight. From insight to action',
      items: [
        {
          id: '01.',
          title: 'Record your conversations',
          description:
            'Recording uses both built-in workstation tools and dedicated AIDA Sales microphones',
          className: stepClassNames[0],
        },
        {
          id: '02.',
          title: 'Transcribe and diarize',
          description:
            'AIDA Sales models handle Uzbek, Russian, English and mixed speech — even in noisy, complex dialogs',
          className: stepClassNames[1],
        },
        {
          id: '03.',
          title: 'Analyze & customize dashboards',
          description:
            'Dashboards match your industry and goals. Layer scripts and tasks for Commerce, CX, HR, and more',
          className: stepClassNames[2],
        },
        {
          id: '04.',
          title: 'Smart tips for managers every day',
          description:
            'Dynamic, personalized coaching tips grounded in modern service methods and your company standards',
          className: stepClassNames[3],
        },
      ],
    },
    industries: {
      titleLine1: 'Built for industries',
      titleLine2: 'with the highest standards',
      subtitle:
        'When service quality, control, and conversation analytics matter — AIDA Sales delivers where results are critical',
      labels: [
        'Public Sector',
        'Insurance Companies',
        'Sales Teams',
        'Tour Operators & Travel Agencies',
        'Telecom Operators',
        'Banks & FinTech',
      ],
    },
    worksBanner: {
      titleBefore: 'Turn every call into a',
      titleHighlight: 'growth opportunity',
      subtitle:
        "AIDA analyzes your team's customer communications and helps improve service quality at every stage",
      float1: 'Call Recording',
      float2: 'Transcribe & Diarize',
      float3: 'Smart Tips',
      float4: 'Dashboards',
    },
    analysis: {
      sectionTitle: 'Listen to a call analysis example',
      demoTitle: 'Demo recording of a customer conversation',
      demoEyebrow: 'Sample playback',
      demoHint: 'Sample MP3 playback. Below is a diarized transcript excerpt (several dialogs).',
      segments: [{ speaker: 0, text: 'Demo' }],
    },
    dashboards: {
      title: 'Dashboards for every role',
      subtitle: 'AIDA provides personalized control panels for different organizational levels',
      items: attachImages(
        [
          {
            title: '01. Sales Manager Dashboard',
            text: 'Personal Performance Navigator. Eliminating subjectivity. Sales reps identify script gaps and stress-points before their managers do.',
          },
          {
            title: '02. C-level Dashboard',
            text: 'Systemic Issue Detector. Automated analysis of conversations topics and sentiment. Pinpoint exactly where the business is losing money and customer loyalty.',
          },
          {
            title: '03. CX Dashboard',
            text: 'Reputation Control Center. A global view of brand health. Monitor Net Promoter Score (NPS) and market language segmentation in one click.',
          },
        ],
        dashboardImages
      ),
    },
    experts: {
      eyebrow: 'Advice from experts',
      title: 'Learn every day',
      subtitle: 'Best practices from top managers to boost communication efficiency',
      tips: attachImages(
        [
          {
            title: 'Focus on results',
            text: 'Talk about value for the customer, rather than product features',
          },
          {
            title: 'Summarize agreements',
            text: 'At the end of the call, clearly state the next steps and deadlines',
          },
          {
            title: 'Ask open-ended questions',
            text: 'Instead of "Does this suit you?" ask "How do you envision solving this task?"',
          },
          {
            title: 'Empathy in conversation',
            text: 'Acknowledge the customer\'s feelings: "I understand how important this is to you"',
          },
          {
            title: 'Analyze your calls',
            text: 'Listen to 2–3 of your conversations weekly and look for points of improvement',
          },
          {
            title: 'Active listening',
            text: 'Let the customer speak. Listen 70% of the time, speak 30%',
          },
        ],
        expertImages
      ),
    },
    about: {
      eyebrow: 'Leadership',
      titleAbout: 'About',
      titleUs: 'Us',
      phoneLabel: 'Phone:',
      emailLabel: 'Email:',
      addressLabel: 'Address:',
      addressLine1: 'Tashkent,',
      addressLine2: 'Bakhodir St., 44a',
      leaders: [
        {
          name: 'Alexander Kornilov, CEO',
          bio: 'Entrepreneur and strategist. 13 years in e‑commerce; expert in scaling products and launching successful startups.',
          image: '/landing/img/alex.jpg',
          top: false,
        },
        {
          name: 'Gleb Lyubimov, CCO',
          bio: 'Product manager with 10 years in IT. Strong at processes and growing technology products.',
          image: '/landing/img/about-us-img2.jpg',
          top: true,
        },
        {
          name: 'Sardor, CTO',
          bio: 'Deep tech engineer with 15 years of experience. Author of unique AI solutions and local LLMs.',
          image: '/landing/img/about-us-img1.jpg',
          top: false,
        },
      ],
    },
  },

  ru: {
    header: {
      nav: { home: 'Главная', howItWorks: 'Как это работает', aboutUs: 'О нас' },
    },
    footer: { copyright: '© 2026 AIDA Sales. Все права защищены.' },
    cta: {
      titleLine1: 'Превратите разговоры в',
      titleLine2: 'рост бизнеса',
      subtitle:
        'Запишитесь на персональную демонстрацию и узнайте, как AIDA повышает качество, контроль и эффективность',
      button: 'Записаться на демо',
    },
    bookDemo: {
      title: 'Запись на демо',
      nameLabel: 'Ваше имя',
      namePlaceholder: 'Как к вам обращаться',
      phoneLabel: 'Телефон',
      phonePlaceholder: '+998 …',
      emailLabel: 'Email',
      emailPlaceholder: 'you@company.com',
      submit: 'Отправить заявку',
      closeAria: 'Закрыть',
      successTitle: 'Заявка отправлена',
      successBody: 'Мы свяжемся с вами в ближайшее время.',
      bookAnother: 'Отправить ещё одну заявку',
    },
    hero: {
      line1: 'Инструменты',
      line2: 'для роста',
      cta: 'Записаться на демо',
      slides: [
        {
          title: 'Инструменты для роста продаж',
          text:
            'Мы помогаем банкам, телеком-операторам и госорганам улучшать сервис — превращая каждый диалог в успех.',
        },
        {
          title: 'ИИ для прокачки навыков',
          text:
            'Дайте команде суфлер: помогайте операторам уверенно вести сложные диалоги с помощью подсказок в реальном времени.',
        },
        {
          title: 'Аналитика для контроля качества',
          text:
            'Получите полную прозрачность звонков: принимайте решения на основе данных для эффективного обучения сотрудников.',
        },
      ],
    },
    steps: {
      sectionTitle: '4 шага к успеху',
      sectionSubtitle: 'От голоса к инсайту. От инсайта к действию',
      items: [
        {
          id: '01.',
          title: 'Записывайте разговоры',
          description:
            'Запись ведётся штатными средствами рабочего места и специальными микрофонами AIDA Sales',
          className: stepClassNames[0],
        },
        {
          id: '02.',
          title: 'Транскрибация и диаризация',
          description:
            'Модели AIDA Sales работают с узбекским, русским, английским и смешанной речью — даже при шуме и сложном контексте',
          className: stepClassNames[1],
        },
        {
          id: '03.',
          title: 'Анализ и настраиваемые дашборды',
          description:
            'Дашборды под отрасль и задачи. Скрипты и цели для Commerce, CX, HR и других подразделений',
          className: stepClassNames[2],
        },
        {
          id: '04.',
          title: 'Умные советы менеджерам каждый день',
          description:
            'Динамичные персональные подсказки на основе современных практик сервиса и стандартов вашей компании',
          className: stepClassNames[3],
        },
      ],
    },
    industries: {
      titleLine1: 'Создано для отраслей',
      titleLine2: 'с самыми высокими стандартами',
      subtitle:
        'Когда важны качество сервиса, контроль и аналитика разговоров — AIDA Sales даёт результат там, где это критично',
      labels: [
        'Госсектор',
        'Страховые компании',
        'Отделы продаж',
        'Туроператоры и турагентства',
        'Телеком‑операторы',
        'Банки и FinTech',
      ],
    },
    worksBanner: {
      titleBefore: 'Превратите каждый звонок в',
      titleHighlight: 'возможность роста',
      subtitle:
        'AIDA анализирует коммуникации с клиентами и помогает улучшать качество сервиса на каждом этапе',
      float1: 'Запись звонков',
      float2: 'Транскрибация и диаризация',
      float3: 'Умные советы',
      float4: 'Дашборды',
    },
    analysis: {
      sectionTitle: 'Пример анализа звонка',
      demoTitle: 'Демозапись разговора с клиентом',
      demoEyebrow: 'Демо воспроизведение',
      demoHint: 'Демо воспроизводится из MP3. Ниже — фрагмент транскрипта с разметкой по спикерам (несколько диалогов).',
      segments: [{ speaker: 0, text: 'Демо' }],
    },
    dashboards: {
      title: 'Дашборды для каждой роли',
      subtitle: 'Персональные панели управления для разных уровней организации',
      items: attachImages(
        [
          {
            title: '01. Дашборд sales‑менеджера',
            text: 'Навигатор личной эффективности. Исключите человеческий фактор. Менеджер видит свои ошибки в скриптах и стресс-точки раньше, чем их заметит РОП.',
          },
          {
            title: '02. Дашборд для C‑level',
            text: 'Детектор системных проблем. Автоматический анализ тем обращений и уровня негатива. Находим, где бизнес теряет деньги и лояльность клиентов.',
          },
          {
            title: '03. CX‑дашборд',
            text: 'Пульт управления репутацией. Глобальный взгляд на здоровье бренда. Контроль лояльности (NPS) и языковая сегментация рынка в один клик.',
          },
        ],
        dashboardImages
      ),
    },
    experts: {
      eyebrow: 'Советы экспертов',
      title: 'Учитесь каждый день',
      subtitle: 'Лучшие практики от топ‑менеджеров для эффективных коммуникаций',
      tips: attachImages(
        [
          {
            title: 'Фокус на результате',
            text: 'Говорите о ценности для клиента, а не только о функциях продукта',
          },
          {
            title: 'Фиксируйте договорённости',
            text: 'В конце звонка чётко назовите следующие шаги и сроки',
          },
          {
            title: 'Задавайте открытые вопросы',
            text: 'Вместо «Вам подходит?» спросите «Как вы видите решение этой задачи?»',
          },
          {
            title: 'Эмпатия в диалоге',
            text: 'Признайте чувства клиента: «Я понимаю, насколько это важно для вас»',
          },
          {
            title: 'Разбирайте свои звонки',
            text: 'Прослушивайте 2–3 разговора в неделю и ищите точки роста',
          },
          {
            title: 'Активное слушание',
            text: 'Дайте клиенту говорить. Слушайте 70% времени, говорите 30%',
          },
        ],
        expertImages
      ),
    },
    about: {
      eyebrow: 'Команда',
      titleAbout: 'О',
      titleUs: 'нас',
      phoneLabel: 'Телефон:',
      emailLabel: 'Email:',
      addressLabel: 'Адрес:',
      addressLine1: 'г. Ташкент,',
      addressLine2: 'ул. Баходыра, 44а',
      leaders: [
        {
          name: 'Александр Корнилов, CEO',
          bio: 'Предприниматель и стратег. 13 лет в e‑commerce, эксперт по кратному росту продуктов и запуску стартапов.',
          image: '/landing/img/about-us-img1.jpg',
          top: false,
        },
        {
          name: 'Глеб Любимов, CCO',
          bio: 'Продакт‑менеджер с 10‑летним опытом в IT. Сильный в процессах и развитии технологических продуктов.',
          image: '/landing/img/about-us-img2.jpg',
          top: true,
        },
        {
          name: 'Сардор, CTO',
          bio: 'Deep Tech инженер с 15‑летним опытом. Автор уникальных AI‑решений и локальных LLM.',
          image: '/landing/img/about-us-img1.jpg',
          top: false,
        },
      ],
    },
  },

  uz: {
    header: {
      nav: { home: 'Bosh sahifa', howItWorks: 'Qanday ishlaydi', aboutUs: 'Biz haqimizda' },
    },
    footer: { copyright: '© 2026 AIDA Sales. Barcha huquqlar himoyalangan.' },
    cta: {
      titleLine1: 'Suhbatlaringizni',
      titleLine2: 'biznes o‘simiga aylantiring',
      subtitle:
        'Shaxsiy demo bron qiling va AIDA sifat, nazorat va samaradorlikni qanday oshirishini ko‘ring',
      button: 'Demoga yozilish',
    },
    bookDemo: {
      title: 'Demoga yozilish',
      nameLabel: 'Ismingiz',
      namePlaceholder: 'To‘liq ism',
      phoneLabel: 'Telefon',
      phonePlaceholder: '+998 …',
      emailLabel: 'Email',
      emailPlaceholder: 'you@company.com',
      submit: 'So‘rov yuborish',
      closeAria: 'Yopish',
      successTitle: 'So‘rov yuborildi',
      successBody: 'Tez orada siz bilan bog‘lanamiz.',
      bookAnother: 'Yana so‘rov yuborish',
    },
    hero: {
      line1: 'Sotuvlarni',
      line2: 'oshirish vositalari',
      cta: 'Demoga yozilish',
      slides: [
        {
          title: 'Sotuvlarni oshirish vositalari',
          text:
            'Biz banklar, telekom va davlat tashkilotlariga xizmat ko‘rsatish sifatini yaxshilashda yordam beramiz — har bir muloqotni muvaffaqiyatga aylantiring.',
        },
        {
          title: 'Ko‘nikmalarni oshirish uchun AI',
          text:
            'Jamoangizga yordamchi bering — operatorlarga murakkab muloqotlarni ishonch bilan olib borishda yordam bering.',
        },
        {
          title: 'Sifat nazorati uchun tahlillar',
          text:
            'Muloqotlarning to‘liq shaffofligiga erishing — xodimlarni samarali o‘qitish uchun ma’lumotlarga asoslangan qarorlar qabul qiling.',
        },
      ],
    },
    steps: {
      sectionTitle: 'Muvaffaqiyatga 4 qadam',
      sectionSubtitle: 'Ovozdan tushunchaga. Tushunchadan harakatga',
      items: [
        {
          id: '01.',
          title: 'Suhbatlarni yozib oling',
          description:
            'Yozuv ishchi stansiya vositalari va maxsus AIDA Sales mikrofonlari orqali amalga oshiriladi',
          className: stepClassNames[0],
        },
        {
          id: '02.',
          title: 'Transkripsiya va diarizatsiya',
          description:
            'AIDA Sales modellari o‘zbek, rus, ingliz va aralash nutqni shovqin va murakkab kontekstda ham qayta ishlaydi',
          className: stepClassNames[1],
        },
        {
          id: '03.',
          title: 'Tahlil va moslashtirilgan dashboardlar',
          description:
            'Dashboardlar soha va maqsadlarga mos. Commerce, CX, HR va boshqa bo‘limlar uchun skriptlar va vazifalar',
          className: stepClassNames[2],
        },
        {
          id: '04.',
          title: 'Har kuni menejerlar uchun aqlli maslahatlar',
          description:
            'Zamonaviy servis amaliyoti va kompaniya standartlariga asoslangan dinamik, shaxsiylashtirilgan maslahatlar',
          className: stepClassNames[3],
        },
      ],
    },
    industries: {
      titleLine1: 'Eng yuqori standartli',
      titleLine2: 'sohalar uchun qurilgan',
      subtitle:
        'Xizmat sifati, nazorat va suhbat analitikasi muhim bo‘lsa — AIDA Sales natija talab qilinadigan joyda yordam beradi',
      labels: [
        'Davlat sektori',
        'Sug‘urta kompaniyalari',
        'Sotuv jamoalari',
        'Tur operatorlari va agentliklar',
        'Telekom operatorlar',
        'Banklar va FinTech',
      ],
    },
    worksBanner: {
      titleBefore: 'Har bir qo‘ng‘iroqni',
      titleHighlight: 'o‘sish imkoniyatiga',
      subtitle:
        'AIDA jamoangizning mijoz bilan muloqotini tahlil qiladi va xizmat sifati har bosqichda yaxshilanishiga yordam beradi',
      float1: 'Qo‘ng‘iroq yozuvi',
      float2: 'Transkripsiya va diarizatsiya',
      float3: 'Aqlli maslahatlar',
      float4: 'Dashboardlar',
    },
    analysis: {
      sectionTitle: 'Qo‘ng‘iroq tahlili namunasini tinglang',
      demoTitle: 'Mijoz suhbati demo yozuvi',
      demoEyebrow: 'Namuna ijrosi',
      demoHint: 'Namuna MP3 orqali ijro etiladi. Pastda — bir nechta suhbat bo‘yicha transkript (spikerlar ajratilgan).',
      segments: [{ speaker: 0, text: 'Demo' }],
    },
    dashboards: {
      title: 'Har bir rol uchun dashboardlar',
      subtitle: 'Turli tashkilot darajalari uchun shaxsiylashtirilgan boshqaruv panellari',
      items: attachImages(
        [
          {
            title: '01. Sales menejer dashboard',
            text: "Shaxsiy samaradorlik navigatori. Inson omilini chetlashtiramiz. Menejer skriptlardagi xatolar va stress nuqtalarini rahbaridan oldinroq ko'radi.",
          },
          {
            title: '02. C-level dashboard',
            text: "Tizimli muammolar detektori. Murojaat mavzulari va negativ darajasini avtomatik tahlil qilish. Biznes qayerda pul va mijozlar ishonchini yo'qotayotganini aniqlaymiz.",
          },
          {
            title: '03. CX dashboard',
            text: " Obro'-etibor boshqaruv paneli. Brend holatiga global qarash. Bir tugma orqali NPS sodiqlik indeksi va bozorning til segmentatsiyasini nazorat qiling.",
          },
        ],
        dashboardImages
      ),
    },
    experts: {
      eyebrow: 'Mutaxassislar maslahati',
      title: 'Har kuni o‘rganing',
      subtitle: 'Muloqot samaradorligini oshirish uchun yetakchi menejerlar amaliyoti',
      tips: attachImages(
        [
          {
            title: 'Natijaga e’tibor',
            text: 'Mijoz uchun qiymat haqingda gapiring, faqat mahsulot xususiyatlari emas',
          },
          {
            title: 'Kelishuvlarni qisqacha',
            text: 'Qo‘ng‘iroq oxirida keyingi qadamlar va muddatlarni aniq ayting',
          },
          {
            title: 'Ochiq savollar',
            text: '“Sizga mosmi?” o‘rniga “Bu vazifani qanday yechasiz?” deb so‘rang',
          },
          {
            title: 'Suhbatda empatiya',
            text: 'Mijozning hissini tan oling: “Bu siz uchun qanchalik muhimligini tushunaman”',
          },
          {
            title: 'Qo‘ng‘iroqlarni tahlil qiling',
            text: 'Haftasiga 2–3 ta suhbatni tinglang va yaxshilanish nuqtalarini qidiring',
          },
          {
            title: 'Faol tinglash',
            text: 'Mijozga gapirishga imkon bering. 70% vaqtingizni tinglashga, 30%ni gapirishga',
          },
        ],
        expertImages
      ),
    },
    about: {
      eyebrow: 'Jamoa',
      titleAbout: 'Biz',
      titleUs: 'haqimizda',
      phoneLabel: 'Telefon:',
      emailLabel: 'Email:',
      addressLabel: 'Manzil:',
      addressLine1: 'Toshkent sh.,',
      addressLine2: 'Bahodir ko‘chasi, 44a',
      leaders: [
        {
          name: 'Aleksandr Kornilov, CEO',
          bio: 'Tadbirkor va strateg. 13 yil e‑commerce’da; mahsulotlarni o‘sirish va startaplarni ishga tushirish bo‘yicha mutaxassis.',
          image: '/landing/img/alex.jpg',
          top: false,
        },
        {
          name: 'Gleb Lyubimov, CCO',
          bio: '10 yillik IT tajribasiga ega product menejer. Jarayonlar va texnologik mahsulotlarni rivojlantirishda kuchli.',
          image: '/landing/img/about-us-img2.jpg',
          top: true,
        },
        {
          name: 'Sardor, CTO',
          bio: '15 yillik tajribaga ega Deep Tech muhandisi. Noyob AI yechimlari va mahalliy LLM muallifi.',
          image: '/landing/img/about-us-img1.jpg',
          top: false,
        },
      ],
    },
  },
};

export function getLandingMessages(locale: LandingLocale): LandingMessages {
  return landingMessages[locale] ?? landingMessages[DEFAULT_LANDING_LOCALE];
}
