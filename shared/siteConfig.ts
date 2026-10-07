/**
 * Cafe Eleganza - Master Site Configuration
 * All client details editable and overridable from the Admin Settings panel.
 * Fields marked "// CLIENT TO CONFIRM" are safe working defaults.
 */

export interface DeliveryZone {
  id: string;
  name: string;
  polygon: [number, number][]; // [lat, lng]
  fee: number;
  minOrder: number;
  etaMinutes: string;
  active: boolean;
}

export interface DayHours {
  open: string;
  close: string;
  closed: boolean;
}

export interface SiteConfig {
  brandName: string;
  brandNameUr: string;
  tagline: string;
  taglineUr: string;
  subTagline: string;
  logoUrl?: string;
  faviconUrl?: string;
  phone: string; // (041) 5240034
  whatsappNumber: string; // CLIENT TO CONFIRM
  instagramUrl: string; // CLIENT TO CONFIRM
  facebookUrl: string; // CLIENT TO CONFIRM
  email: string; // CLIENT TO CONFIRM
  address: string;
  addressUr: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  googleRating: number;
  reviewsCount: number;
  priceRange: string;
  openingHours: {
    monday: DayHours;
    tuesday: DayHours;
    wednesday: DayHours;
    thursday: DayHours;
    friday: DayHours;
    saturday: DayHours;
    sunday: DayHours;
  };
  gstRate: number; // default 16%
  gstEnabled: boolean;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  minOrderDelivery: number;
  deliveryZones: DeliveryZone[];
  slotCapacity: number;
  reservationSlotMinutes: number;
  orderCancelWindowMinutes: number;
  loyaltyPointsPerRs100: number; // default 5
  loyaltyPointValueRs: number; // default 1
  tableCount: number;
  currency: string;
  currencySymbol: string;
  timezone: string;
  pauseOnlineOrdering: boolean;
  pauseDeliveryOnly: boolean;
  announcementBanner: {
    enabled: boolean;
    textEn: string;
    textUr: string;
    link?: string;
  };
  orderNotificationEmails: string[]; // CLIENT TO CONFIRM
  orderNotificationWhatsApp?: string; // CLIENT TO CONFIRM
  telegramSettings?: {
    enabled: boolean;
    botToken?: string;
    chatId?: string;
  };
  googleAnalyticsId?: string; // CLIENT TO CONFIRM
  sentryDsn?: string; // CLIENT TO CONFIRM
  heroTitle: string;
  heroTitleUr: string;
  heroSub: string;
  heroSubUr: string;
  heroImageOverride?: string;
  galleryImages: {
    id: string;
    url: string;
    title: string;
    category: string;
  }[];
  ownerName: string; // CLIENT TO CONFIRM
  legalBusinessName: string; // CLIENT TO CONFIRM
  ntnStrn?: string; // CLIENT TO CONFIRM
  supportContact: string;
}

export const defaultSiteConfig: SiteConfig = {
  brandName: "Cafe Eleganza",
  brandNameUr: "کیفے الیگانزا",
  tagline: "Remember when coffee meant staying a little longer?",
  taglineUr: "کیا آپ کو یاد ہے جب کافی کا مطلب تھوڑی دیر اور رکنا ہوتا تھا؟",
  subTagline: "The cups emptied. The afternoon stayed.",
  logoUrl: "", // Defaults to inline luxury monogram SVG if empty
  phone: "(041) 5240034",
  whatsappNumber: "+923005240034", // CLIENT TO CONFIRM
  instagramUrl: "https://instagram.com/cafeeleganza.official", // CLIENT TO CONFIRM
  facebookUrl: "https://facebook.com/cafeeleganza.fsd", // CLIENT TO CONFIRM
  email: "nexora.aiofficial001@gmail.com", // CLIENT TO CONFIRM
  address: "Green Avenue, W Canal Rd, Raza Town, Faisalabad, Punjab, Pakistan",
  addressUr: "گرین ایونیو، ویسٹ کینال روڈ، رضا ٹاؤن، فیصل آباد، پنجاب، پاکستان",
  city: "Faisalabad",
  country: "Pakistan",
  latitude: 31.4328,
  longitude: 73.1295,
  googleRating: 4.9,
  reviewsCount: 1730,
  priceRange: "Rs 2,000 - 8,000",
  openingHours: {
    monday: { open: "11:00", close: "00:00", closed: false },
    tuesday: { open: "11:00", close: "00:00", closed: false },
    wednesday: { open: "11:00", close: "00:00", closed: false },
    thursday: { open: "11:00", close: "00:00", closed: false },
    friday: { open: "11:00", close: "00:00", closed: false },
    saturday: { open: "11:00", close: "01:00", closed: false },
    sunday: { open: "11:00", close: "00:00", closed: false },
  },
  gstRate: 16,
  gstEnabled: true,
  deliveryFee: 250,
  freeDeliveryThreshold: 3000,
  minOrderDelivery: 1000,
  slotCapacity: 24,
  reservationSlotMinutes: 30,
  orderCancelWindowMinutes: 3,
  loyaltyPointsPerRs100: 5,
  loyaltyPointValueRs: 1,
  tableCount: 14,
  currency: "PKR",
  currencySymbol: "Rs ",
  timezone: "Asia/Karachi",
  pauseOnlineOrdering: false,
  pauseDeliveryOnly: false,
  announcementBanner: {
    enabled: true,
    textEn: "✨ Seasonal Feature: Try our handcrafted Ube Latte & wood-fired Spanish Pizza!",
    textUr: "✨ خصوصی ذائقہ: ہمارا دست ساز اوبے لاٹے اور ووڈ فائرڈ ہسپانوی پیزا آزمائیں!",
  },
  orderNotificationEmails: ["nexora.aiofficial001@gmail.com"], // CLIENT TO CONFIRM
  orderNotificationWhatsApp: "+923005240034", // CLIENT TO CONFIRM
  telegramSettings: {
    enabled: false,
    botToken: "", // CLIENT TO CONFIRM
    chatId: "", // CLIENT TO CONFIRM
  },
  googleAnalyticsId: "", // CLIENT TO CONFIRM
  sentryDsn: "", // CLIENT TO CONFIRM
  heroTitle: "Artisan Coffee & Culinary Sanctuary",
  heroTitleUr: "اعلیٰ کافی اور ذائقے دار دسترخوان",
  heroSub: "Experience Solarium elegance with handcrafted coolers, wood-fired delights, and slow-roasted specialty brews.",
  heroSubUr: "ہمارے سولاریم میں دست ساز کولرز، لکڑی کے تندور کا پیزا اور شاندار کافی کا لطف اٹھائیں۔",
  deliveryZones: [
    {
      id: "zone-raza-town",
      name: "Raza Town & W Canal Rd (Immediate Circle)",
      fee: 150,
      minOrder: 800,
      etaMinutes: "25-35 mins",
      active: true,
      polygon: [
        [31.425, 73.12],
        [31.44, 73.122],
        [31.442, 73.14],
        [31.424, 73.138],
      ],
    },
    {
      id: "zone-green-avenue",
      name: "Green Avenue & Canal Expressway",
      fee: 250,
      minOrder: 1200,
      etaMinutes: "35-45 mins",
      active: true,
      polygon: [
        [31.415, 73.105],
        [31.45, 73.11],
        [31.455, 73.155],
        [31.41, 73.15],
      ],
    },
    {
      id: "zone-greater-fsd",
      name: "Greater Faisalabad Sector (Kohinoor / D-Ground)",
      fee: 380,
      minOrder: 2000,
      etaMinutes: "45-60 mins",
      active: true,
      polygon: [
        [31.4, 73.08],
        [31.47, 73.085],
        [31.475, 73.17],
        [31.395, 73.165],
      ],
    },
  ],
  galleryImages: [
    {
      id: "g1",
      url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80",
      title: "Solarium Sunlit Corner",
      category: "Ambiance",
    },
    {
      id: "g2",
      url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80",
      title: "Espresso Pull",
      category: "Coffee",
    },
    {
      id: "g3",
      url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80",
      title: "Wood-Fired Pizza",
      category: "Food",
    },
    {
      id: "g4",
      url: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1000&q=80",
      title: "Handcrafted Limka Coolers",
      category: "Drinks",
    },
    {
      id: "g5",
      url: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1000&q=80",
      title: "Evening Greenhouse Glow",
      category: "Ambiance",
    },
    {
      id: "g6",
      url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80",
      title: "Signature Desserts",
      category: "Desserts",
    },
  ],
  ownerName: "Nexora AI Official", // CLIENT TO CONFIRM
  legalBusinessName: "Cafe Eleganza Solarium (Nexora Official)", // CLIENT TO CONFIRM
  ntnStrn: "NTN: 8294710-3", // CLIENT TO CONFIRM
  supportContact: "nexora.aiofficial001@gmail.com",
};
