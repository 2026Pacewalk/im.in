// Data + generation layer for the AI Invitation Maker.
//
// The wording is produced by `generateWording`. Today it runs a high-quality
// local generator (no API key required, instant, works offline). The function
// is the single swap-in point for a real LLM: replace the body with an
// Anthropic / OpenAI call that returns the same `InvitationCopy` shape and the
// rest of the app is unchanged. See app/api/ai/invitation/route.ts.

export type OccasionId =
  | "wedding"
  | "engagement"
  | "birthday"
  | "anniversary"
  | "housewarming"
  | "baby-shower"
  | "puja";

export type ToneId = "elegant" | "traditional" | "playful" | "modern" | "devotional";

export interface InvitationInput {
  occasion: OccasionId;
  tone: ToneId;
  hostNames: string; // e.g. "Aarav & Diya" or "Sharma Family"
  guestOf?: string; // e.g. "Together with their families"
  date?: string; // free text, e.g. "Sunday, 14 Dec 2026"
  time?: string; // e.g. "7:00 PM onwards"
  venue?: string; // e.g. "The Grand Ballroom, Jaipur"
  extra?: string; // any extra note the user wants woven in
}

export interface InvitationCopy {
  eyebrow: string; // small line above the names, e.g. "Together with joy"
  headline: string; // the occasion line, e.g. "Wedding Celebration"
  names: string; // the host names, cleaned
  invite: string; // the invitation sentence
  closing: string; // sign-off, e.g. "We can't wait to celebrate with you"
}

export interface ThemeDef {
  id: string;
  name: string;
  /** CSS color tokens used by the card. */
  bg: string; // outer background (gradient ok)
  panel: string; // inner panel background
  ink: string; // primary text
  accent: string; // accent / rule / ornaments
  muted: string; // secondary text
  motif: string; // emoji/symbol motif row
}

export const OCCASIONS: { id: OccasionId; label: string; icon: string }[] = [
  { id: "wedding", label: "Wedding", icon: "💍" },
  { id: "engagement", label: "Engagement", icon: "💞" },
  { id: "birthday", label: "Birthday", icon: "🎂" },
  { id: "anniversary", label: "Anniversary", icon: "🥂" },
  { id: "housewarming", label: "Housewarming", icon: "🏡" },
  { id: "baby-shower", label: "Baby Shower", icon: "🍼" },
  { id: "puja", label: "Puja / Ceremony", icon: "🪔" },
];

export const TONES: { id: ToneId; label: string }[] = [
  { id: "elegant", label: "Elegant" },
  { id: "traditional", label: "Traditional" },
  { id: "playful", label: "Playful" },
  { id: "modern", label: "Modern" },
  { id: "devotional", label: "Devotional" },
];

export const THEMES: ThemeDef[] = [
  {
    id: "royal-maroon",
    name: "Royal Maroon",
    bg: "linear-gradient(135deg,#3d0a1f,#7a1438)",
    panel: "#fdf6ec",
    ink: "#4a0e22",
    accent: "#c79a3e",
    muted: "#8a6d57",
    motif: "❁ ✦ ❁",
  },
  {
    id: "blush-floral",
    name: "Blush Floral",
    bg: "linear-gradient(135deg,#f7d9d2,#efb8c8)",
    panel: "#fffafa",
    ink: "#7a2c4a",
    accent: "#c2476b",
    muted: "#9b6b7d",
    motif: "🌸 ✿ 🌸",
  },
  {
    id: "emerald-gold",
    name: "Emerald & Gold",
    bg: "linear-gradient(135deg,#0c2b22,#11503c)",
    panel: "#f6f3e7",
    ink: "#103b2c",
    accent: "#cfa84e",
    muted: "#6f7d6a",
    motif: "❖ ✦ ❖",
  },
  {
    id: "midnight-minimal",
    name: "Midnight Minimal",
    bg: "linear-gradient(135deg,#15151f,#2a2a3a)",
    panel: "#1d1d29",
    ink: "#f4f1ea",
    accent: "#d9b15a",
    muted: "#9a98ad",
    motif: "·  ✦  ·",
  },
  {
    id: "festive-saffron",
    name: "Festive Saffron",
    bg: "linear-gradient(135deg,#7a2e00,#c2410c)",
    panel: "#fff6e9",
    ink: "#7c2d12",
    accent: "#d97706",
    muted: "#a86a3c",
    motif: "🪔 ॐ 🪔",
  },
];

// ---------------------------------------------------------------------------
// Local wording generator
// ---------------------------------------------------------------------------

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.floor(seed * arr.length) % arr.length];
}

const HEADLINES: Record<OccasionId, string[]> = {
  wedding: ["The Wedding Celebration", "Are Getting Married", "Wedding Invitation"],
  engagement: ["The Engagement", "Ring Ceremony", "Engagement Celebration"],
  birthday: ["Birthday Celebration", "It's My Birthday!", "Join the Birthday Bash"],
  anniversary: ["Anniversary Celebration", "Years of Togetherness", "Our Anniversary"],
  housewarming: ["Griha Pravesh", "Housewarming Ceremony", "Our New Home"],
  "baby-shower": ["Baby Shower", "A Little One is Coming", "Godh Bharai"],
  puja: ["Puja Invitation", "Sacred Ceremony", "Blessings & Prayers"],
};

const EYEBROWS: Record<ToneId, string[]> = {
  elegant: ["Together with great joy", "With hearts full of love", "Cordially invite you to"],
  traditional: ["With the blessings of elders", "Shubh Vivah", "With family blessings"],
  playful: ["Guess what — it's happening!", "Let's celebrate together", "You're officially invited"],
  modern: ["Save the date", "We're celebrating", "Join us"],
  devotional: ["By divine grace", "With prayers and devotion", "Seeking your blessings"],
};

const INVITES: Record<ToneId, string[]> = {
  elegant: [
    "request the pleasure of your company to celebrate this joyous occasion",
    "warmly invite you to share in an evening of love and togetherness",
  ],
  traditional: [
    "request your gracious presence along with your family to bless the occasion",
    "cordially invite you to grace the ceremony with your blessings",
  ],
  playful: [
    "would love for you to join the fun, the food and the festivities",
    "are throwing a celebration and it just won't be the same without you",
  ],
  modern: [
    "would love for you to join us for a celebration to remember",
    "are getting together to celebrate — and you're on the list",
  ],
  devotional: [
    "humbly request your presence to seek blessings and partake in the prasad",
    "invite you to join the prayers and receive divine blessings together",
  ],
};

const CLOSINGS: Record<ToneId, string[]> = {
  elegant: ["We can't wait to celebrate with you.", "Your presence will make it complete."],
  traditional: ["Your blessings mean the world to us.", "We seek your warm blessings."],
  playful: ["See you there — don't be late!", "Come hungry, leave happy!"],
  modern: ["Let's make memories.", "RSVP and see you soon."],
  devotional: ["May the divine bless us all.", "Your blessings are our strength."],
};

/** Produce invitation copy. `variant` (0..1) lets "regenerate" change results. */
export function generateWording(
  input: InvitationInput,
  variant = 0.42
): InvitationCopy {
  const s = (variant + 0.137) % 1;
  const names = (input.hostNames || "Our Family").trim();
  const headline =
    pick(HEADLINES[input.occasion] || HEADLINES.wedding, s) ;
  let invite = pick(INVITES[input.tone] || INVITES.elegant, s);
  if (input.extra && input.extra.trim()) {
    invite += `. ${input.extra.trim()}`;
  }
  return {
    eyebrow: input.guestOf?.trim() || pick(EYEBROWS[input.tone] || EYEBROWS.elegant, s),
    headline,
    names,
    invite,
    closing: pick(CLOSINGS[input.tone] || CLOSINGS.elegant, s),
  };
}
