export const navigationCopy = {
  miyan: [{ name: 'MiyanLanding', path: '', label: { fa: 'خانه', en: 'Home' } }],
  miyanBeresht: [
    { name: 'MiyanBereshtLanding', path: 'beresht', label: { fa: 'خانه برشت', en: 'Beresht Home' } },
    { name: 'MiyanBereshtBaseMenu', path: 'beresht/menu', label: { fa: 'منو', en: 'Menu' } },
    { name: 'MiyanBereshtDailyMenu', path: 'beresht/daily-menu', label: { fa: 'پخت روز', en: "Today's Bake" } },
  ],
  miyanMadi: [
    { name: 'MiyanMadiLanding', path: 'madi', label: { fa: 'خانه مادی', en: 'Madi Home' } },
    { name: 'MiyanMadiBaseMenu', path: 'madi/menu', label: { fa: 'منو', en: 'Menu' } },
    { name: 'MiyanMadiDailyMenu', path: 'madi/daily-menu', label: { fa: 'پخت روز', en: "Today's Bake" } },
  ],
}

export const miyanLandingCopy = {
  hero: {
    overline: { fa: 'گروه میان', en: 'Miyan Group' },
    title: { fa: 'میانِ کار و زندگی', en: 'Between Work and Life' },
    body: {
      fa: 'میان، یک برنامه منسجم را در دو کافه پیش می‌برد؛ قهوه تازه‌رُست، پخت روزانه و ارائه حرفه‌ای',
      en: 'At Miyan, a single, focused program runs across two cafés: freshly roasted coffee, daily bakes, and professional service',
    },
  },
  heroMeta: [
    {
      label: { fa: 'تخصص‌های ما', en: 'Our disciplines' },
      value: {
        fa: 'رُست قهوه · پخت کیک و نان · سرویس و پذیرایی',
        en: 'Coffee roasting · Baking · Service',
      },
    },
    { label: { fa: 'شروع داستان ما', en: 'Since' }, value: { fa: '۱۳۹۳', en: '2014' } },
  ],
  branches: {
    overline: { fa: 'کافه‌های میان', en: 'Miyan cafés' },
    title: { fa: 'دو فضا، دو حال‌وهوا', en: 'Two spaces, two moods' },
    body: {
      fa: 'هر شعبه هویت خودش را دارد، کیفیت یکسان است و تجربه متفاوت',
      en: 'Each location has its own identity; quality remains constant while the experience changes',
    },
    cards: [
      {
        name: { fa: 'میان برشت', en: 'Miyan Beresht' },
        area: { fa: 'اصفهان · شیخ صدوق جنوبی', en: 'Isfahan · South Sheikh Sadoogh' },
        copy: {
          fa: 'محیطی مدرن با میز سوشال و حضور دائمی عطر قهوه تازه',
          en: 'A modern space with a social table and the steady presence of fresh coffee aroma',
        },
        cta: { fa: 'خانه برشت', en: 'Visit Beresht' },
        path: 'beresht',
      },
      {
        name: { fa: 'میان مادی', en: 'Miyan Madi' },
        area: { fa: 'اصفهان · چهارباغ عباسی، مادی نیاصرم', en: 'Isfahan · Chahar Bagh Abbasi, Madi Niyasarm' },
        copy: {
          fa: 'کافه‌ای کوچک، گرم و صمیمی برای لحظه‌های آرام',
          en: 'A small, warm café designed for calm, unhurried moments',
        },
        cta: { fa: 'خانه مادی', en: 'Visit Madi' },
        path: 'madi',
      },
    ],
  },
  modal: {
    overline: { fa: 'رستری میان', en: 'Miyan roastery' },
    title: { fa: 'مسیر تخصصی از دانه سبز تا فنجان', en: 'A specialist path from green bean to cup' },
    body: {
      fa: 'در رستری میان، تأمین دانه سبز، طراحی پروفایل رُست و نظارت بر کیفیت به‌صورت تخصصی انجام می‌شود',
      en: 'At Miyan roastery, green sourcing, roast profile design, and quality control are handled with precision',
    },
    accent: { fa: 'رُست روزانه · کنترل پروفایل', en: 'Daily roasting · Profile control' },
  },
  modalFocus: [
    {
      title: { fa: 'تأمین', en: 'Sourcing' },
      copy: {
        fa: 'انتخاب مستقیم دانه‌های قابل رهگیری برای تضمین کیفیت',
        en: 'Direct selection of traceable beans to guarantee quality',
      },
    },
    {
      title: { fa: 'سرویس', en: 'Service' },
      copy: {
        fa: 'تمام تیم میان با دقت و استاندارد مشترک کار می‌کنند',
        en: 'The entire Miyan team works with shared standards and care',
      },
    },
  ],
  photoStories: [
    {
      imageKey: 'miyanImg2',
      overline: { fa: 'صبح', en: 'Morning' },
      title: { fa: 'رُست تازه', en: 'Fresh roast' },
      copy: {
        fa: 'قهوه تازه‌رُست به‌طور مداوم برای عصاره‌گیری بهتر بررسی می‌شود',
        en: 'Freshly roasted coffee is constantly evaluated for better extraction',
      },
    },
    {
      imageKey: 'miyanImg1',
      overline: { fa: 'سرویس', en: 'Service' },
      title: { fa: 'کیفیت سرویس و آرامش فضا', en: 'Service quality and spatial calm' },
      copy: {
        fa: 'خدمات حرفه‌ای در فضایی آرام و متعادل',
        en: 'Professional service delivered in a calm, balanced setting',
      },
    },
  ],
}

export const miyanBereshtLandingCopy = {
  hero: {
    overline: { fa: 'میان برشت', en: 'Miyan Beresht' },
    title: { fa: 'مجموعه‌ای منظم و هماهنگ', en: 'A composed and coordinated space' },
    body: {
      fa: 'میان برشت، قلب رستری میان؛ سرویس دقیق، قهوه تازه و دسرهای ظریف',
      en: 'Miyan Beresht is the heart of our roastery, defined by precise service, fresh coffee, and refined desserts',
    },
  },
  marqueeWords: [
    { fa: 'خارج', en: 'Out' },
    { fa: 'از', en: 'of the' },
    { fa: 'چهارچوب', en: 'Box' },
  ],
  experience: {
    title: { fa: 'سالن آرام و مدرن', en: 'A calm, modern room' },
    paragraphs: [
      {
        fa: 'نور گرم روی سطوح سنگی پخش می‌شود و ریتم فضا را آرام می‌کند',
        en: 'Warm light spreads across stone surfaces, setting a calm rhythm for the room',
      },
      {
        fa: 'چرم و سنگ، تعادلی از سکوت و ظرافت می‌سازند تا فنجان، بی‌عجله نوشیده شود',
        en: 'Leather and stone create a balance of quiet and refinement, inviting an unhurried cup',
      },
    ],
  },
  photoStories: [
    {
      imageKey: 'bereshtImg1',
      overline: { fa: 'رُست', en: 'Roast' },
      title: { fa: 'درام داغ', en: 'Heated drum' },
      copy: {
        fa: 'درام لورینگ در حرکت مداوم است و عطر قهوه تازه فضا را در بر می‌گیرد',
        en: 'The Loring drum stays in constant motion, filling the space with fresh coffee aroma',
      },
    },
    {
      imageKey: 'bereshtImg2',
      overline: { fa: 'سرویس', en: 'Service' },
      title: { fa: 'میز سنگی', en: 'Stone counter' },
      copy: {
        fa: 'قهوه و شیرینی با دقت، کنار هم روی سنگ سرو می‌شوند',
        en: 'Coffee and pastry are carefully served together on stone',
      },
    },
    {
      imageKey: 'bereshtImg3',
      overline: { fa: 'عطر', en: 'Aroma' },
      title: { fa: 'هاله قهوه', en: 'Coffee halo' },
      copy: {
        fa: 'بخار اسپرسو در نور خطی، حالتی معلق و گرم می‌سازد',
        en: 'Espresso steam meets linear light, creating a warm, suspended moment',
      },
    },
    {
      imageKey: 'bereshtImg4',
      overline: { fa: 'جفت‌سازی', en: 'Pairing' },
      title: { fa: 'همراه قهوه', en: 'Alongside coffee' },
      copy: {
        fa: 'دسر سبک در کنار اسپرسو، با تعادلی دقیق از طعم',
        en: 'A light dessert paired with espresso in a precise balance of flavor',
      },
    },
  ],
  location: {
    overline: { fa: 'آدرس و مسیر', en: 'Address & route' },
    title: { fa: 'میان برشت، اصفهان', en: 'Miyan Beresht, Isfahan' },
    body: {
      fa: 'کافه و رستری میان برشت در اصفهان، شیخ صدوق جنوبی؛ فضای حرفه‌ای',
      en: 'Miyan Beresht roastery café is located on South Sheikh Sadoogh in Isfahan, offering a professional setting',
    },
    addressLines: {
      fa: ['اصفهان، خیابان شیخ صدوق جنوبی', 'کافه میان برشت'],
      en: ['Isfahan, South Sheikh Sadoogh Avenue', 'Miyan Beresht Café'],
    },
    hours: { fa: 'هر روز ۰۷:۳۰ تا ۲۲:۳۰', en: 'Daily 07:30 to 22:30' },
    phone: { fa: '۰۳۱ ۶۶۶ ۸۸ ۹۹', en: '+98 31 666 88 99' },
    coordinates: { fa: '۳۲٫۶۱۷۷۳۷ شمالی · ۵۱٫۶۷۰۳۳۲ شرقی', en: '32.617737 N · 51.670332 E' },
    mapCenter: { lat: 32.617737, lng: 51.670332 },
    mapZoom: 16,
    mapLabel: { fa: 'اصفهان', en: 'Isfahan' },
    cta: { fa: 'مشاهده مسیر', en: 'View route' },
  },
}

export const miyanMadiLandingCopy = {
  hero: {
    overline: { fa: 'میان مادی', en: 'Miyan Madi' },
    title: { fa: 'کافه‌ای صمیمی در اصفهان', en: 'A cozy café in Isfahan' },
    body: {
      fa: 'مادی، کافه کوچک و گرم میان است؛ قهوه روزانه، کوکی‌های سبک و گفت‌وگوهای آرام',
      en: 'Madi is Miyan’s small, warm café with daily coffee, light cookies, and unhurried conversation',
    },
  },
  atmosphere: {
    title: { fa: 'هوای صمیمی چهارباغ', en: 'The easy air of Chahar Bagh' },
    paragraphs: [
      {
        fa: 'پنجره‌ها نور چهارباغ را ملایم می‌کنند و ریتم خیابان را آهسته‌تر',
        en: 'Windows soften Chahar Bagh’s light and slow the pace of the street',
      },
      {
        fa: 'مبلمان نرم، فضا را خودمانی و راحت نگه می‌دارد',
        en: 'Soft furnishings keep the space informal and comfortable',
      },
    ],
  },
  photoStories: [
    {
      imageKey: 'madiImg1',
      overline: { fa: 'صبح', en: 'Morning' },
      title: { fa: 'شروع زود', en: 'Early start' },
      copy: {
        fa: 'اول صبح، روز با اسپرسو و کوکی گرم شروع می‌شود',
        en: 'Early mornings begin with espresso and a warm cookie',
      },
    },
    {
      imageKey: 'madiImg2',
      overline: { fa: 'شب', en: 'Night' },
      title: { fa: 'شب دنج', en: 'Cozy night' },
      copy: {
        fa: 'نور کم و فنجان‌های بعد از غروب، فضا را آرام و دنج می‌کنند',
        en: 'Low light and after-sunset cups make the space calm and cozy',
      },
    },
  ],
  location: {
    overline: { fa: 'آدرس و مسیر', en: 'Address & route' },
    title: { fa: 'مادی نیاصرم، اصفهان', en: 'Niyasarm Madi, Isfahan' },
    body: {
      fa: 'کافه میان مادی در اصفهان، چهارباغ عباسی، مادی نیاصرم',
      en: 'Miyan Madi café is located on Chahar Bagh Abbasi, Niyasarm Madi, Isfahan',
    },
    addressLines: {
      fa: ['اصفهان، چهارباغ عباسی، مادی نیاصرم', 'کافه میان مادی'],
      en: ['Isfahan, Chahar Bagh Abbasi, Niyasarm Madi', 'Miyan Madi Café'],
    },
    hours: { fa: 'هر روز ۰۷:۳۰ تا ۲۲:۳۰', en: 'Daily 07:30 to 22:30' },
    phone: { fa: '۰۳۱ ۶۶۶ ۷۷ ۸۸', en: '+98 31 666 77 88' },
    coordinates: { fa: '۳۲٫۶۴۷۶۲۴ شمالی · ۵۱٫۶۶۸۳۷۲ شرقی', en: '32.647624 N · 51.668372 E' },
    mapCenter: { lat: 32.64762442805897, lng: 51.668372361039545 },
    mapZoom: 16,
    mapLabel: { fa: 'اصفهان', en: 'Isfahan' },
    cta: { fa: 'نمایش روی نقشه', en: 'Show on map' },
  },
}

export const footerCopy = {
  about: {
    fa: 'مجموعه‌ای از کافه، رستری، بیکری و آشپزخانه جدا',
    en: 'A collection of café, roastery, bakery, and a separate kitchen',
  },
  sections: [
    {
      key: 'visit',
      title: { fa: 'بازدید', en: 'Visit' },
      links: [
        { label: { fa: 'میان برشت', en: 'Miyan Beresht' }, path: 'beresht' },
        { label: { fa: 'میان مادی', en: 'Miyan Madi' }, path: 'madi' },
      ],
    },
    {
      key: 'menus',
      title: { fa: 'منوها', en: 'Menus' },
      links: [
        { label: { fa: 'منوی برشت', en: 'Beresht Menu' }, path: 'beresht/menu' },
        { label: { fa: 'پخت روز برشت', en: "Beresht Today's Bake" }, path: 'beresht/daily-menu' },
        { label: { fa: 'منوی مادی', en: 'Madi Menu' }, path: 'madi/menu' },
        { label: { fa: 'پخت روز مادی', en: "Madi Today's Bake" }, path: 'madi/daily-menu' },
      ],
    },
    {
      key: 'contact',
      title: { fa: 'تماس', en: 'Contact' },
      links: [
        { label: { fa: 'info@miyangroup.com', en: 'info@miyangroup.com' }, href: 'mailto:info@miyangroup.com', dir: 'ltr' },
        { label: { fa: '+98 21 2244 7700', en: '+98 21 2244 7700' }, href: 'tel:+982122447700', dir: 'ltr' },
      ],
    },
  ],
}
