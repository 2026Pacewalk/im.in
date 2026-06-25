// Free Festival AI Invitation maker — bilingual (English + Hindi), local
// (no-API-key) greeting generator. 100% free, no signup, instant.

export type Lang = "en" | "hi";

export interface FestivalTheme {
  bg: string;
  panel: string;
  ink: string;
  accent: string;
  muted: string;
  motif: string;
}

export interface Festival {
  id: string;
  name: string;
  emoji: string;
  href: string;
  theme: FestivalTheme;
  headline: { en: string; hi: string };
  messages: { en: string[]; hi: string[] };
}

const T = (
  bg: string,
  ink: string,
  accent: string,
  motif: string,
  panel = "#fffaf2",
  muted = "#8a7a66"
): FestivalTheme => ({ bg, panel, ink, accent, muted, motif });

export const FESTIVALS: Festival[] = [
  {
    id: "diwali", name: "Diwali", emoji: "🪔",
    href: "/product-category/festival-wishes/diwali-wishes",
    theme: T("linear-gradient(135deg,#3a0a0a,#7a1f12)", "#5a1a0a", "#d4a017", "🪔 ✦ 🪔"),
    headline: { en: "Happy Diwali", hi: "शुभ दीपावली" },
    messages: {
      en: [
        "May the festival of lights fill your home with joy, your heart with love and your life with endless prosperity. Happy Diwali, {name}!",
        "Wishing you and your family a Diwali as bright as a thousand diyas. {name}",
      ],
      hi: [
        "यह दीपावली आपके जीवन को सुख, समृद्धि और खुशियों के उजाले से भर दे। दीपावली की हार्दिक शुभकामनाएं, {name}!",
        "आपको और आपके परिवार को दीपों के इस पर्व की ढेर सारी शुभकामनाएं। {name}",
      ],
    },
  },
  {
    id: "dhanteras", name: "Dhanteras", emoji: "🪙",
    href: "/product-category/festival-wishes/dhanteras-wishes",
    theme: T("linear-gradient(135deg,#4a2c00,#a16207)", "#5a3a0a", "#eab308", "🪙 ✦ 🪙"),
    headline: { en: "Happy Dhanteras", hi: "शुभ धनतेरस" },
    messages: {
      en: ["May Goddess Lakshmi bless your home with wealth, health and happiness this Dhanteras. {name}"],
      hi: ["माँ लक्ष्मी आपके घर में धन, सुख और समृद्धि का वास करें। धनतेरस की हार्दिक शुभकामनाएं, {name}!"],
    },
  },
  {
    id: "holi", name: "Holi", emoji: "🎨",
    href: "/product-category/festival-wishes/holi",
    theme: T("linear-gradient(135deg,#7e22ce,#db2777,#f59e0b)", "#6b21a8", "#db2777", "🎨 🌈 🎨", "#fffdf7"),
    headline: { en: "Happy Holi", hi: "शुभ होली" },
    messages: {
      en: ["May your life be as colourful as the festival itself — full of laughter and love. Happy Holi, {name}!"],
      hi: ["रंगों का यह त्योहार आपके जीवन में खुशियों के रंग भर दे। होली की हार्दिक शुभकामनाएं, {name}!"],
    },
  },
  {
    id: "navratri", name: "Navratri", emoji: "💃",
    href: "/product-category/festival-wishes/navratri",
    theme: T("linear-gradient(135deg,#9d174d,#c2410c)", "#7a1338", "#f59e0b", "💃 ✦ 🪔"),
    headline: { en: "Happy Navratri", hi: "शुभ नवरात्रि" },
    messages: {
      en: ["May Maa Durga bless you with strength, peace and prosperity. Happy Navratri, {name}!"],
      hi: ["माँ दुर्गा आपको शक्ति, सुख और समृद्धि का आशीर्वाद दें। नवरात्रि की हार्दिक शुभकामनाएं, {name}!"],
    },
  },
  {
    id: "dussehra", name: "Dussehra", emoji: "🏹",
    href: "/product-category/festival-wishes/dussehra",
    theme: T("linear-gradient(135deg,#7c2d12,#c2410c)", "#7c2d12", "#f59e0b", "🏹 ✦ 🔥"),
    headline: { en: "Happy Dussehra", hi: "शुभ दशहरा" },
    messages: {
      en: ["May the triumph of good over evil bring courage and positivity into your life. Happy Dussehra, {name}!"],
      hi: ["असत्य पर सत्य की इस जीत के साथ आपके जीवन में खुशियां आएं। दशहरा की हार्दिक शुभकामनाएं, {name}!"],
    },
  },
  {
    id: "raksha-bandhan", name: "Raksha Bandhan", emoji: "🪢",
    href: "/product-category/festival-wishes/raksha-bandhan",
    theme: T("linear-gradient(135deg,#9d174d,#e11d48)", "#881337", "#fb7185", "🪢 ❤ 🪢"),
    headline: { en: "Happy Raksha Bandhan", hi: "शुभ रक्षाबंधन" },
    messages: {
      en: ["Celebrating the unbreakable bond of love and protection. Happy Raksha Bandhan, {name}!"],
      hi: ["भाई-बहन के प्यार के इस पावन बंधन की हार्दिक शुभकामनाएं, {name}!"],
    },
  },
  {
    id: "janmashtami", name: "Krishna Janmashtami", emoji: "🦚",
    href: "/product-category/festival-wishes/krishna-janmashtami",
    theme: T("linear-gradient(135deg,#1e3a8a,#0e7490)", "#1e3a8a", "#d4a017", "🦚 🪈 🦚"),
    headline: { en: "Happy Janmashtami", hi: "जन्माष्टमी की शुभकामनाएं" },
    messages: {
      en: ["May Lord Krishna fill your life with love, wisdom and divine joy. Happy Janmashtami, {name}!"],
      hi: ["भगवान श्री कृष्ण आपके जीवन को प्रेम, ज्ञान और आनंद से भर दें। जय श्री कृष्ण, {name}!"],
    },
  },
  {
    id: "karwa-chauth", name: "Karwa Chauth", emoji: "🌙",
    href: "/product-category/festival-wishes/karwa-chauth",
    theme: T("linear-gradient(135deg,#7a1338,#be123c)", "#7a1338", "#f59e0b", "🌙 ✦ 🌙"),
    headline: { en: "Happy Karwa Chauth", hi: "करवा चौथ की शुभकामनाएं" },
    messages: {
      en: ["May your love grow stronger and shine brighter than the Karwa Chauth moon. {name}"],
      hi: ["आपका प्यार करवा चौथ के चाँद की तरह सदा चमकता रहे। करवा चौथ की शुभकामनाएं, {name}!"],
    },
  },
  {
    id: "shivaratri", name: "Maha Shivaratri", emoji: "🔱",
    href: "/product-category/festival-wishes/maha-shivaratri",
    theme: T("linear-gradient(135deg,#1e293b,#4338ca)", "#1e1b4b", "#d4a017", "🔱 ॐ 🔱"),
    headline: { en: "Happy Maha Shivaratri", hi: "महाशिवरात्रि की शुभकामनाएं" },
    messages: {
      en: ["May Lord Shiva bless you with peace, strength and good health. Har Har Mahadev, {name}!"],
      hi: ["भगवान शिव आपको सुख, शांति और उत्तम स्वास्थ्य प्रदान करें। हर हर महादेव, {name}!"],
    },
  },
  {
    id: "ganesh", name: "Ganesha Chaturthi", emoji: "🐘",
    href: "/product-category/festival-wishes/ganesha-chaturthi",
    theme: T("linear-gradient(135deg,#7c2d12,#dc2626)", "#7c2d12", "#f59e0b", "🕉 🐘 🕉"),
    headline: { en: "Happy Ganesh Chaturthi", hi: "गणेश चतुर्थी की शुभकामनाएं" },
    messages: {
      en: ["May Lord Ganesha remove all obstacles and bless you with wisdom and prosperity. Ganpati Bappa Morya, {name}!"],
      hi: ["गणपति बप्पा आपके सभी विघ्न दूर करें और सुख-समृद्धि लाएं। गणपति बप्पा मोरया, {name}!"],
    },
  },
  {
    id: "guru-nanak", name: "Guru Nanak Jayanti", emoji: "🪯",
    href: "/product-category/festival-wishes/guru-nanak-jayanti",
    theme: T("linear-gradient(135deg,#1e3a8a,#a16207)", "#1e3a8a", "#eab308", "🪯 ✦ 🪯"),
    headline: { en: "Happy Gurpurab", hi: "गुरुपर्व की शुभकामनाएं" },
    messages: {
      en: ["May Guru Nanak Dev Ji's teachings light your path with love and peace. Happy Gurpurab, {name}!"],
      hi: ["गुरु नानक देव जी की शिक्षाएं आपके जीवन को प्रेम और शांति से रोशन करें। गुरुपर्व की बधाई, {name}!"],
    },
  },
  {
    id: "eid", name: "Eid", emoji: "🌙",
    href: "/product-category/festival-wishes/eid",
    theme: T("linear-gradient(135deg,#064e3b,#047857)", "#064e3b", "#d4a017", "🌙 ✦ 🌟"),
    headline: { en: "Eid Mubarak", hi: "ईद मुबारक" },
    messages: {
      en: ["May this Eid bring peace, prosperity and happiness to you and your loved ones. Eid Mubarak, {name}!"],
      hi: ["यह ईद आपके जीवन में खुशियां, अमन और बरकत लेकर आए। ईद मुबारक, {name}!"],
    },
  },
  {
    id: "christmas", name: "Merry Christmas", emoji: "🎄",
    href: "/product-category/festival-wishes/merry-christmas-wishes",
    theme: T("linear-gradient(135deg,#7f1d1d,#14532d)", "#14532d", "#d4a017", "🎄 ❄ 🎄"),
    headline: { en: "Merry Christmas", hi: "मेरी क्रिसमस" },
    messages: {
      en: ["May your Christmas sparkle with joy, warmth and love. Merry Christmas, {name}!"],
      hi: ["क्रिसमस की खुशियां आपके जीवन को प्यार और उजाले से भर दें। मेरी क्रिसमस, {name}!"],
    },
  },
  {
    id: "new-year", name: "New Year", emoji: "🎉",
    href: "/product-category/festival-wishes/new-year",
    theme: T("linear-gradient(135deg,#0f172a,#1e293b)", "#0f172a", "#d4a017", "🎉 ✦ 🎆", "#fdfdfd"),
    headline: { en: "Happy New Year", hi: "नववर्ष की शुभकामनाएं" },
    messages: {
      en: ["May the coming year bring you new hopes, fresh starts and endless happiness. Happy New Year, {name}!"],
      hi: ["नया साल आपके लिए नई उम्मीदें और ढेर सारी खुशियां लेकर आए। नव वर्ष मंगलमय हो, {name}!"],
    },
  },
  {
    id: "lohri", name: "Lohri", emoji: "🔥",
    href: "/product-category/festival-wishes/lohri",
    theme: T("linear-gradient(135deg,#7c2d12,#ea580c)", "#7c2d12", "#facc15", "🔥 ✦ 🌾"),
    headline: { en: "Happy Lohri", hi: "लोहड़ी की शुभकामनाएं" },
    messages: {
      en: ["May the Lohri fire burn away your worries and fill your life with warmth. Happy Lohri, {name}!"],
      hi: ["लोहड़ी की आग आपके सारे दुख दूर कर जीवन में खुशियां लाए। हैप्पी लोहड़ी, {name}!"],
    },
  },
  {
    id: "pongal", name: "Pongal", emoji: "🌾",
    href: "/product-category/festival-wishes/pongal",
    theme: T("linear-gradient(135deg,#166534,#ca8a04)", "#14532d", "#eab308", "🌾 ☀ 🌾"),
    headline: { en: "Happy Pongal", hi: "पोंगल की शुभकामनाएं" },
    messages: {
      en: ["May this harvest festival bring prosperity and happiness to your home. Happy Pongal, {name}!"],
      hi: ["यह फसल पर्व आपके घर में समृद्धि और खुशहाली लाए। पोंगल की हार्दिक शुभकामनाएं, {name}!"],
    },
  },
  {
    id: "vasant-panchami", name: "Vasant Panchami", emoji: "🌼",
    href: "/product-category/festival-wishes/vasant-panchami",
    theme: T("linear-gradient(135deg,#a16207,#eab308)", "#854d0e", "#fde047", "🌼 ✦ 🌼"),
    headline: { en: "Happy Vasant Panchami", hi: "वसंत पंचमी की शुभकामनाएं" },
    messages: {
      en: ["May Goddess Saraswati bless you with wisdom and creativity. Happy Vasant Panchami, {name}!"],
      hi: ["माँ सरस्वती आपको ज्ञान और बुद्धि का आशीर्वाद दें। वसंत पंचमी की हार्दिक शुभकामनाएं, {name}!"],
    },
  },
  {
    id: "rama-navami", name: "Rama Navami", emoji: "🏹",
    href: "/product-category/festival-wishes/rama-navami",
    theme: T("linear-gradient(135deg,#7c2d12,#d97706)", "#7c2d12", "#f59e0b", "🕉 🏹 🕉"),
    headline: { en: "Happy Rama Navami", hi: "राम नवमी की शुभकामनाएं" },
    messages: {
      en: ["May Lord Rama bless you with courage, righteousness and peace. Jai Shri Ram, {name}!"],
      hi: ["भगवान श्री राम आपको साहस, धर्म और सुख प्रदान करें। जय श्री राम, {name}!"],
    },
  },
  {
    id: "republic-day", name: "Republic Day", emoji: "🇮🇳",
    href: "/product-category/festival-wishes/republic-day-of-india",
    theme: T("linear-gradient(135deg,#9a3412,#1e3a8a,#166534)", "#1e293b", "#f59e0b", "🇮🇳 ✦ 🇮🇳"),
    headline: { en: "Happy Republic Day", hi: "गणतंत्र दिवस की शुभकामनाएं" },
    messages: {
      en: ["Saluting the spirit of our great nation. Happy Republic Day, Jai Hind, {name}!"],
      hi: ["हमारे महान राष्ट्र को नमन। गणतंत्र दिवस की हार्दिक शुभकामनाएं, जय हिंद, {name}!"],
    },
  },
  {
    id: "independence-day", name: "Independence Day", emoji: "🇮🇳",
    href: "/product-category/festival-wishes/independence-day-of-india",
    theme: T("linear-gradient(135deg,#9a3412,#1e3a8a,#166534)", "#1e293b", "#f59e0b", "🇮🇳 ✦ 🇮🇳"),
    headline: { en: "Happy Independence Day", hi: "स्वतंत्रता दिवस की शुभकामनाएं" },
    messages: {
      en: ["Freedom in mind, pride in our hearts. Happy Independence Day, Jai Hind, {name}!"],
      hi: ["आज़ादी के इस पावन पर्व की हार्दिक शुभकामनाएं। जय हिंद, {name}!"],
    },
  },
  {
    id: "mothers-day", name: "Mother's Day", emoji: "💐",
    href: "/product-category/festival-wishes/mothers-day",
    theme: T("linear-gradient(135deg,#be185d,#db2777)", "#831843", "#fbcfe8", "💐 ❤ 💐"),
    headline: { en: "Happy Mother's Day", hi: "मातृ दिवस की शुभकामनाएं" },
    messages: {
      en: ["To the heart of our family — thank you for your endless love. Happy Mother's Day, {name}!"],
      hi: ["हमारे परिवार की धड़कन माँ को ढेर सारा प्यार। मातृ दिवस की शुभकामनाएं, {name}!"],
    },
  },
  {
    id: "fathers-day", name: "Father's Day", emoji: "👔",
    href: "/product-category/festival-wishes/fathers-day",
    theme: T("linear-gradient(135deg,#1e3a8a,#1d4ed8)", "#1e3a8a", "#93c5fd", "👔 ✦ 🏆"),
    headline: { en: "Happy Father's Day", hi: "पितृ दिवस की शुभकामनाएं" },
    messages: {
      en: ["To our hero and guide — thank you for everything. Happy Father's Day, {name}!"],
      hi: ["हमारे मार्गदर्शक और हीरो पापा को सलाम और ढेर सारा प्यार। {name}"],
    },
  },
  {
    id: "valentines-day", name: "Valentine's Day", emoji: "❤",
    href: "/product-category/festival-wishes/valentines-day",
    theme: T("linear-gradient(135deg,#9f1239,#db2777)", "#881337", "#fb7185", "❤ ✿ ❤"),
    headline: { en: "Happy Valentine's Day", hi: "वैलेंटाइन डे की शुभकामनाएं" },
    messages: {
      en: ["You make every day brighter. Happy Valentine's Day, {name} — with all my love."],
      hi: ["तुम मेरे हर दिन को खास बना देते हो। हैप्पी वैलेंटाइन डे, {name}!"],
    },
  },
  {
    id: "friendship-day", name: "Friendship Day", emoji: "🤝",
    href: "/product-category/festival-wishes/friendship-day",
    theme: T("linear-gradient(135deg,#0d9488,#f59e0b)", "#0f766e", "#fcd34d", "🤝 ✦ 💛"),
    headline: { en: "Happy Friendship Day", hi: "फ्रेंडशिप डे की शुभकामनाएं" },
    messages: {
      en: ["Thank you for the laughter and the bond we share. Happy Friendship Day, {name}!"],
      hi: ["हमारी दोस्ती यूँ ही हमेशा बनी रहे। फ्रेंडशिप डे मुबारक, {name}!"],
    },
  },
];

export function getFestival(id: string): Festival | undefined {
  return FESTIVALS.find((f) => f.id === id);
}

export const DESIGNS = [
  { id: "ornate", name: "Ornate" },
  { id: "glow", name: "Glow" },
  { id: "minimal", name: "Minimal" },
] as const;
export type DesignId = (typeof DESIGNS)[number]["id"];

export const LANGS: { id: Lang; label: string }[] = [
  { id: "en", label: "English" },
  { id: "hi", label: "हिंदी" },
];

export interface FestivalGreeting {
  headline: string;
  body: string;
  sign: string;
}

/** Build a greeting locally (free, instant) in the chosen language. */
export function generateGreeting(
  festival: Festival,
  opts: { sender?: string; recipient?: string; note?: string; lang?: Lang },
  variant = 0.42
): FestivalGreeting {
  const lang: Lang = opts.lang || "en";
  const recipient = (opts.recipient || "").trim();
  const sender = (opts.sender || "").trim();
  const pool = festival.messages[lang];
  const idx = Math.floor(((variant + 0.137) % 1) * pool.length) % pool.length;

  let body = opts.note && opts.note.trim() ? opts.note.trim() : pool[idx];
  body = body.replace(/\{name\}/g, recipient);
  // Clean up a dangling ", " left when no recipient was provided.
  body = body
    .replace(/,\s*([!.])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();

  return {
    headline: festival.headline[lang],
    body,
    sign: sender ? `— ${sender}` : "",
  };
}
