// Mock data matching the exact API response structure
// This allows testing without backend CORS/CSRF issues

export const mockBereshtMenu = {
  count: 2,
  next: null,
  previous: null,
  results: [
    {
      title: {
        fa: "پخت روز",
        en: "Today's Special"
      },
      subtitle: {
        fa: "آیتم های امروز کافه میان برشت",
        en: "the menu of the today's special of the miyan Beresht cafe"
      },
      sections: [
        {
          title: {
            fa: "پخت روز",
            en: "Today's Special"
          },
          items: [
            {
              name: {
                fa: "کروسان",
                en: "Croissant"
              },
              description: {
                fa: "نان با کره هزار لایه",
                en: "a thousand folded bread with butter"
              },
              price: {
                fa: "۲۰۰",
                en: "200"
              },
              image: "http://miyan.smartcareer.ir/media/menu_items/2025/11/11/497929159_997243099204848_7284320904937585464_n.jpg"
            }
          ]
        }
      ],
      todays: {
        title: {
          fa: "آیتم‌های تازه امروز",
          en: "Today's Fresh"
        },
        sections: [
          {
            title: {
              fa: "پیشنهاد امروز",
              en: "Today's Special"
            },
            items: [
              {
                name: {
                  fa: "کروسان",
                  en: "Croissant"
                },
                description: {
                  fa: "نان با کره هزار لایه",
                  en: "a thousand folded bread with butter"
                },
                price: {
                  fa: "۲۰۰",
                  en: "200"
                },
                image: "http://miyan.smartcareer.ir/media/menu_items/2025/11/11/497929159_997243099204848_7284320904937585464_n.jpg"
              }
            ]
          }
        ]
      }
    },
    {
      title: {
        fa: "منوی اصلی",
        en: "Menu"
      },
      subtitle: {
        fa: "منوی آیتم های معمولی",
        en: "the menu of the fixed items of the miyan madi cafe"
      },
      sections: [
        {
          title: {
            fa: "بر پایه اسپرسو",
            en: "Espresso based"
          },
          items: [
            {
              name: {
                fa: "اسپرسو",
                en: "Espresso"
              },
              description: {
                fa: "عصاره غلیظ قهوه",
                en: "pressured extraction of the coffee"
              },
              price: {
                fa: "۱۱۰",
                en: "110"
              },
              image: "http://miyan.smartcareer.ir/media/menu_items/2025/11/11/482819895_17882249346249002_6548346011589827903_n_eqIulyi.jpg"
            },
            {
              name: {
                fa: "آمریکانو",
                en: "Americano"
              },
              description: {
                fa: "اسپرسو و مقداری آب داغ",
                en: "Espresso with 200ml of hot water"
              },
              price: {
                fa: "۱۱۵",
                en: "115"
              },
              image: "http://miyan.smartcareer.ir/media/menu_items/2025/11/11/491433451_17888136810249002_2022842688691045578_n_SsIALZZ.jpg"
            }
          ]
        },
        {
          title: {
            fa: "منوی سرد",
            en: "Cold items menu"
          },
          items: [
            {
              name: {
                fa: "لیموناد",
                en: "Lemonade"
              },
              description: {
                fa: "عصاره لیمو و نعنا و سودای خنک",
                en: "fresh mint and lemon juice with cold soda"
              },
              price: {
                fa: "۱۲۵",
                en: "125"
              },
              image: "http://miyan.smartcareer.ir/media/menu_items/2025/11/11/551457587_17905760205249002_2201885749886262654_n.webp"
            }
          ]
        }
      ],
      todays: {
        title: {
          fa: "آیتم‌های تازه امروز",
          en: "Today's Fresh"
        },
        sections: [
          {
            title: {
              fa: "پیشنهاد امروز",
              en: "Today's Special"
            },
            items: []
          }
        ]
      }
    }
  ]
}

export const mockMadiMenu = {
  count: 2,
  next: null,
  previous: null,
  results: [
    {
      title: {
        fa: "پخت روز",
        en: "Today's Special"
      },
      subtitle: {
        fa: "آیتم های امروز کافه میان مادی",
        en: "the Today's special Menu of the mian madi cafe"
      },
      sections: [
        {
          title: {
            fa: "بیکری",
            en: "Bakery"
          },
          items: [
            {
              name: {
                fa: "کروسان",
                en: "Croissant"
              },
              description: {
                fa: "نان هزارلایه و کره",
                en: "A Very Delicious Bread with butter"
              },
              price: {
                fa: "۲۰۰",
                en: "200"
              },
              image: "http://miyan.smartcareer.ir/media/menu_items/2025/11/11/548866717_17905037067249002_8139013935310566702_n.webp"
            }
          ]
        }
      ],
      todays: {
        title: {
          fa: "آیتم‌های تازه امروز",
          en: "Today's Fresh"
        },
        sections: [
          {
            title: {
              fa: "پیشنهاد امروز",
              en: "Today's Special"
            },
            items: [
              {
                name: {
                  fa: "کروسان",
                  en: "Croissant"
                },
                description: {
                  fa: "نان هزارلایه و کره",
                  en: "A Very Delicious Bread with butter"
                },
                price: {
                  fa: "۲۰۰",
                  en: "200"
                },
                image: "http://miyan.smartcareer.ir/media/menu_items/2025/11/11/548866717_17905037067249002_8139013935310566702_n.webp"
              }
            ]
          }
        ]
      }
    },
    {
      title: {
        fa: "منوی اصلی",
        en: "The Main Menu"
      },
      subtitle: {
        fa: "منوی آیتم های ثابت میان مادی",
        en: "the menu of the fixed items of the miyan madi cafe"
      },
      sections: [
        {
          title: {
            fa: "بر پایه اسپرسو",
            en: "Espresso based"
          },
          items: [
            {
              name: {
                fa: "اسپرسو",
                en: "Espresso"
              },
              description: {
                fa: "عصاره غلیظ قهوه",
                en: "pressurized extraction of coffee"
              },
              price: {
                fa: "۱۰۰",
                en: "100"
              },
              image: "http://miyan.smartcareer.ir/media/menu_items/2025/11/11/482819895_17882249346249002_6548346011589827903_n.jpg"
            },
            {
              name: {
                fa: "آمریکانو",
                en: "Americano"
              },
              description: {
                fa: "اسپرسو و ۲۰۰ میلی‌لیتر آب گرم",
                en: "Espresso with 200 ml of hot water"
              },
              price: {
                fa: "۱۱۰",
                en: "110"
              },
              image: "http://miyan.smartcareer.ir/media/menu_items/2025/11/11/472280488_17874638640249002_1445194500532816992_n.jpg"
            }
          ]
        },
        {
          title: {
            fa: "آیتم های سرد",
            en: "The Cold Items"
          },
          items: [
            {
              name: {
                fa: "لیموناد",
                en: "Lemonade"
              },
              description: {
                fa: "عصاره لیمو و نعنا و سودای خنک",
                en: "fresh Lemon Mint and Cold Soda"
              },
              price: {
                fa: "۱۲۰",
                en: "120"
              },
              image: "http://miyan.smartcareer.ir/media/menu_items/2025/11/11/543048801_4088036781437268_169188569054453349_n.jpg"
            }
          ]
        }
      ],
      todays: {
        title: {
          fa: "آیتم‌های تازه امروز",
          en: "Today's Fresh"
        },
        sections: [
          {
            title: {
              fa: "پیشنهاد امروز",
              en: "Today's Special"
            },
            items: []
          }
        ]
      }
    }
  ]
}

export const mockGallery = {
  count: 2,
  next: null,
  previous: null,
  results: [
    {
      id: 1,
      title_en: "The Art of Perfection",
      title_fa: "هنر بی نقص",
      image: "http://miyan.smartcareer.ir/media/gallery/532423089_17901212433249002_222626787995118818_n.jpg",
      order: 1,
      created_at: "2025-11-11T15:30:32.066014Z",
      updated_at: "2025-11-11T15:30:32.066066Z"
    },
    {
      id: 2,
      title_en: "the best material",
      title_fa: "بهترین کیفیت مواد اولیه",
      image: "http://miyan.smartcareer.ir/media/gallery/552443148_17905780305249002_8379187867742325402_n_YYB3IGe.webp",
      order: 2,
      created_at: "2025-11-11T15:31:45.464402Z",
      updated_at: "2025-11-11T15:31:45.464441Z"
    }
  ]
}
