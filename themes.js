// Mimi's UI Studio — theme data (single source of truth).
//
// Add a new theme = append one object below. Each theme needs:
//   id      unique slug (used internally)
//   name    display name
//   vibe    short mood description (used in the generated prompt)
//   colors  { bg, surface, text, muted, accent }
//   font    CSS font-family value
//   radius  default corner roundness, e.g. "12px"
//
// Later you can add other categories (buttons, templates, fonts) by giving
// objects a `category` field and adding a filter — no rewrite needed.

const THEMES = [
  {
    id: "cream-serif",
    name: "Cream & Serif",
    vibe: "warm, handcrafted, calm",
    colors: { bg: "#fdf8f4", surface: "#ffffff", text: "#3a2e28", muted: "#9e8c80", accent: "#6b5a52" },
    font: "'Georgia', serif",
    radius: "12px",
  },
  {
    id: "midnight-glow",
    name: "Midnight Glow",
    vibe: "dark, modern, sleek",
    colors: { bg: "#0f1117", surface: "#1a1d27", text: "#f2f3f7", muted: "#8b90a0", accent: "#7c9cff" },
    font: "'Inter', system-ui, sans-serif",
    radius: "14px",
  },
  {
    id: "pastel-dream",
    name: "Pastel Dream",
    vibe: "soft, playful, gentle",
    colors: { bg: "#fdf2f8", surface: "#ffffff", text: "#4a3b52", muted: "#b09bb8", accent: "#e89ac7" },
    font: "'Quicksand', system-ui, sans-serif",
    radius: "20px",
  },
  {
    id: "bold-citrus",
    name: "Bold Citrus",
    vibe: "energetic, bold, fun",
    colors: { bg: "#fffaf0", surface: "#ffffff", text: "#2b2118", muted: "#a08c6f", accent: "#ff7a18" },
    font: "'Poppins', system-ui, sans-serif",
    radius: "10px",
  },
  {
    id: "minimal-mono",
    name: "Minimal Mono",
    vibe: "minimal, clean, professional",
    colors: { bg: "#ffffff", surface: "#f6f6f6", text: "#121212", muted: "#8a8a8a", accent: "#121212" },
    font: "'Helvetica Neue', Arial, sans-serif",
    radius: "6px",
  },
  {
    id: "forest-calm",
    name: "Forest Calm",
    vibe: "natural, grounded, restful",
    colors: { bg: "#f3f6f1", surface: "#ffffff", text: "#24332a", muted: "#7d9183", accent: "#3f7d56" },
    font: "'Nunito', system-ui, sans-serif",
    radius: "14px",
  },
  {
    id: "ocean-breeze",
    name: "Ocean Breeze",
    vibe: "fresh, airy, trustworthy",
    colors: { bg: "#f0f7fb", surface: "#ffffff", text: "#173042", muted: "#7591a3", accent: "#1c91c2" },
    font: "'Inter', system-ui, sans-serif",
    radius: "12px",
  },
  {
    id: "royal-plum",
    name: "Royal Plum",
    vibe: "elegant, rich, luxurious",
    colors: { bg: "#faf6fb", surface: "#ffffff", text: "#2e1f37", muted: "#9a82a6", accent: "#7b3f9e" },
    font: "'Playfair Display', Georgia, serif",
    radius: "10px",
  },
];

// Font choices offered in the customize dropdown.
const FONT_OPTIONS = [
  { label: "Serif (Georgia)", value: "'Georgia', serif" },
  { label: "Elegant serif (Playfair)", value: "'Playfair Display', Georgia, serif" },
  { label: "Clean sans (Inter)", value: "'Inter', system-ui, sans-serif" },
  { label: "Rounded sans (Quicksand)", value: "'Quicksand', system-ui, sans-serif" },
  { label: "Friendly sans (Nunito)", value: "'Nunito', system-ui, sans-serif" },
  { label: "Geometric (Poppins)", value: "'Poppins', system-ui, sans-serif" },
  { label: "Neutral (Helvetica)", value: "'Helvetica Neue', Arial, sans-serif" },
];

// Accent swatches offered in the customize picker.
const ACCENT_OPTIONS = [
  "#6b5a52", "#7c9cff", "#e89ac7", "#ff7a18",
  "#121212", "#3f7d56", "#1c91c2", "#7b3f9e",
];
