
export default {
  title: { fa: 'منوی برشت', en: 'Beresht Menu' },
  subtitle: null,
  sections: [
    {
      title: { fa: 'بر پایه اسپرسو', en: 'Espresso Based' },
      items: [
  { name: { fa: 'اسپرسو', en: 'Espresso' }, description: { fa: 'اساس قهوه غلیظ', en: 'Intense coffee shot' }, price: { fa: '۱۴۵', en: '145' }, image: '/images/medium/menu-beresht-1.jpg' },
  { name: { fa: 'آمریکانو', en: 'Americano' }, description: { fa: 'اسپرسو رقیق‌شده', en: 'Espresso with hot water' }, price: { fa: '۱۲۵', en: '125' }, image: '/images/medium/menu-beresht-2.jpg' },
  { name: { fa: 'کاپوچینو', en: 'Cappuccino' }, description: { fa: 'شیر کف‌دار و اسپرسو', en: 'Espresso with foamed milk' }, price: { fa: '۱۹۰', en: '190' }, image: '/images/medium/menu-beresht-3.jpg' },
  { name: { fa: 'لاته', en: 'Latte' }, description: { fa: 'لاته کلاسیک', en: 'Espresso with steamed milk' }, price: { fa: '۲۱۰', en: '210' }, image: '/images/medium/menu-beresht-4.jpg' },
  { name: { fa: 'ماکیاتو', en: 'Macchiato' }, description: { fa: 'فقط نقطه‌ای از فوم شیر', en: 'Espresso marked with milk' }, price: { fa: '۱۶۰', en: '160' }, image: '/images/medium/menu-beresht-4.jpg' },
  { name: { fa: 'موکا', en: 'Mocha' }, description: { fa: 'قهوه و شکلات', en: 'Chocolate & coffee' }, price: { fa: '۲۱۰', en: '210' }, image: '/images/medium/menu-beresht-5.jpg' }
      ]
    },
    {
      title: { fa: 'بر پایه شیر', en: 'Milk Based' },
      items: [
  { name: { fa: 'لاته تیریامیسو', en: 'Tiramisu Latte' }, description: { fa: 'لاته با طعم تیرامیسو', en: 'Latte with tiramisu notes' }, price: { fa: '۲۸۰', en: '280' }, image: '/images/medium/menu-beresht-6.jpg' },
  { name: { fa: 'فرنی', en: 'Ferni' }, description: { fa: 'دسر سنتی', en: 'Traditional dessert' }, price: { fa: '۱۱۰', en: '110' }, image: '/images/medium/menu-beresht-7.jpg' },
  { name: { fa: 'شیر گیاهی', en: 'Plant Milk' }, description: { fa: 'گزینه‌های گیاهی', en: 'Oat/Almond option' }, price: { fa: '۷۵', en: '75' }, image: '/images/medium/menu-beresht-8.jpg' }
      ]
    },
    {
      title: { fa: 'دمنوش‌ها و چای‌ها', en: 'Infusions & Teas' },
      items: [
  { name: { fa: 'چای سیاه', en: 'Black Tea' }, description: { fa: 'سرو سرد/گرم', en: 'Served hot/cold' }, price: { fa: '۱۳۵', en: '135' }, image: '/images/medium/menu-beresht-8.jpg' },
  { name: { fa: 'ماچا', en: 'Matcha' }, description: { fa: 'چای سبز پودر شده', en: 'Ceremonial matcha' }, price: { fa: '۲۷۰', en: '270' }, image: '/images/medium/menu-madi-1.jpg' },
  { name: { fa: 'دمنوش زنجبیل و دارچین', en: 'Ginger & Cinnamon' }, description: { fa: 'گرم کننده', en: 'Warming infusion' }, price: { fa: '۱۷۵', en: '175' }, image: '/images/medium/menu-madi-2.jpg' }
      ]
    },
    {
      title: { fa: 'ویژه‌ها', en: 'Specials' },
      items: [
  { name: { fa: 'هات چاکلت', en: 'Hot Chocolate' }, description: { fa: 'شکلات داغ', en: 'Rich hot chocolate' }, price: { fa: '۱۹۵', en: '195' }, image: '/images/medium/menu-beresht-3.jpg' },
  { name: { fa: 'هات پینات', en: 'Hot Peanut' }, description: { fa: 'شیک مخصوص', en: 'Signature peanut drink' }, price: { fa: '۲۱۰', en: '210' }, image: '/images/medium/menu-beresht-4.jpg' }
      ]
    }
  ],

  // Today's fresh items — separate object to allow pages to render a focused menu.
  todays: {
    title: { fa: 'آیتم‌های تازه امروز', en: "Today's Fresh" },
    sections: [
      {
        title: { fa: 'پخته‌های روز', en: 'Baked Today' },
        items: [
          { name: { fa: 'کیک و شیرینی', en: 'Cakes & Pastries' }, description: { fa: 'شیرینی تازه، کره‌ای', en: 'Fresh pastries, buttery' }, price: { fa: '۲۳۰', en: '230' }, image: '/images/medium/menu-madi-5.jpg' },
          { name: { fa: 'کرواسان با بادام', en: 'Almond Croissant' }, description: { fa: 'کرواسان پر از بادام', en: 'Flaky almond croissant' }, price: { fa: '۲۱۰', en: '210' }, image: '/images/medium/menu-madi-3.jpg' },
          { name: { fa: 'کرواسان شکلاتی', en: 'Chocolate Croissant' }, description: { fa: 'شکلات تلخ', en: 'Dark chocolate croissant' }, price: { fa: '۱۸۰', en: '180' }, image: '/images/medium/menu-madi-4.jpg' },
          { name: { fa: 'رول دارچین', en: 'Cinnamon Roll' }, description: { fa: 'رول گرم دارچین', en: 'Warm cinnamon roll' }, price: { fa: '۱۲۵', en: '125' }, image: '/images/medium/menu-beresht-4.jpg' },
          { name: { fa: 'کوکی دوبل شکلات', en: 'Double Chocolate Cookie' }, description: { fa: 'کوکی شکلاتی غنی', en: 'Rich chocolate cookie' }, price: { fa: '۱۲۵', en: '125' }, image: '/images/medium/menu-beresht-5.jpg' }
        ]
      },
      {
        title: { fa: 'صبحانه‌ها', en: 'Breakfasts' },
        items: [
          { name: { fa: 'ساندویچ تخم‌مرغ و مرغ', en: 'Egg & Chicken Sandwich' }, description: { fa: 'صبحانه پروتئینی گرم', en: 'Warm protein breakfast' }, price: { fa: '۲۴۵', en: '245' }, image: '/images/medium/menu-beresht-2.jpg' },
          { name: { fa: 'بار پروتئینی', en: 'Protein Bar' }, description: { fa: 'انرژی‌زا و سالم', en: 'Energy-boosting bar' }, price: { fa: '۲۵۰', en: '250' }, image: '/images/medium/menu-beresht-7.jpg' },
          { name: { fa: 'کروسان خامه‌مربا', en: 'Cream & Jam Croissant' }, description: { fa: 'کروسان خانگی با خامه و مربا', en: 'Homemade croissant with cream & jam' }, price: { fa: '۱۵۰', en: '150' }, image: '/images/medium/menu-madi-5.jpg' }
        ]
      }
    ]
  }
}
