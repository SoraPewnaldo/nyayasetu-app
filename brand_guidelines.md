# NyayaSetu Brand & Design Guidelines

## 1. Core Identity & Vibe

**"Modern Justice"** - NyayaSetu's design language fuses the serious, authoritative nature of legal tech with the cutting-edge, cyberpunk-adjacent aesthetic of privacy-first, on-device AI.
It feels secure, futuristic, and highly highly premium.

## 2. Color Palette

The interface relies on a deep, almost pitch-black canvas, illuminated by stark neon accents to guide user attention and convey different states.

### Base Colors

- **Space Black:** `#000000` (Primary Background)
- **Void Gray:** `bg-gray-900` / `bg-white/[0.02]` (Card Backgrounds, subtle dividers)
- **Text Primary:** `#ffffff` (Headings, primary readable text)
- **Text Secondary:** `text-gray-400` / `text-gray-500` (Explanatory text, metadata)

### Neon Accents

- **Cyan/Teal:** `#00d4ff` (Primary Brand Color. Used for primary actions, AI presence, "Get Started" buttons, Triage highlights, positive states.)
- **Electric Purple:** `text-purple-400` / `border-purple-500` (Secondary Action Color. Used heavily in the Lawyer Matching and Profile sections to define human connection and premium services.)
- **Ruby Red:** `text-red-500` / `bg-red-600` (Emergency Color. Intense, pulsating red used exclusively for the SOS button and high-priority alerts.)
- **Emerald Green:** `text-emerald-500` (Verification Color. Used for "Verified Legal Aid" tags, privacy/encryption badges (e.g., "E2E Encrypted").)
- **Hot Pink:** `text-pink-500` (Community Color. Used for the anonymous community "Bustis" to differentiate community features from AI or Professional features.)

## 3. Typography

The application uses a dual-font strategy to balance editorial authority with technical precision.

- **Primary/Headings (Sans-Serif):**
  - Standard Tailwind `font-sans` (System fonts like Inter, Roboto)
  - _Usage:_ Used for large, bold hero text (e.g., "We're Building Justice Locally") and primary card titles. It should be crisp, heavy (`font-bold`), and tightly tracked (`tracking-tight` or `tracking-tighter`).
- **Secondary/Technical (Monospace):**
  - Standard Tailwind `font-mono` (System fonts like SF Mono, Consolas)
  - _Usage:_ Used for system statuses, tags, metadata, button text, and small labels. It must ALWAYS be `uppercase`, small (`text-xs` or `text-sm`), and heavily tracked/spaced out (`tracking-widest` or `tracking-[0.2em]`).

## 4. UI Components & Motifs

### Glass & Borders

- We avoid solid filled cards. Most containers use a nearly transparent white fill (`bg-white/[0.02]`) with a sharp, faint white border (`border-white/10`).
- Hover states often illuminate the border with a specific section's accent color (e.g., `hover:border-[#00d4ff]/50`).

### Buttons

- **Action Buttons:** Often outlined (`border border-gray-700`), filled with a translucent blur (`bg-black/40 backdrop-blur-md`), and featuring uppercase monospace text.
- **Primary Buttons (like Get Started):** Feature a solid, fully-saturated accent block (like the cyan `+` icon box) to draw the eye immediately.

### Backgrounds

- Solid black is supplemented by localized, screen-blended radial gradients (e.g., `radial-gradient(circle at 20px 20px...`).
- **Spline 3D:** The Landing Page utilizes an interactive isometric 3D scene (`scene-clean.splinecode`) rendered via WebGL to create depth without clutter.

### Geometry / "The Console Aesthetic"

- The UI often mimics a futuristic terminal. Elements like slashes (`\`) are used as breadcrumb dividers (e.g., `System \ Triage`).
- Brackets `[ ]` and caret symbols `>` are used to frame technical data or denote AI actions.
