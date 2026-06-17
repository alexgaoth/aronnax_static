# Aronnax Lab — Design System

## Concept

**Gruvbox Cold Dark.** The palette derives from the Gruvbox dark theme (as seen in Zed),
but shifts the warm brown hues toward cold blue-gray to evoke the underwater domain.
The result is a terminal / research-institute aesthetic — disciplined, dense, minimal.

Named after Professor Pierre Aronnax from Jules Verne's *20,000 Leagues Under the Sea*.

---

## Color Palette

### Backgrounds

| Token          | Hex       | Tailwind class  | Usage                          |
|----------------|-----------|-----------------|--------------------------------|
| `bg-hard`      | `#1b2028` | `bg-grv-hard`   | Page background (darkest)      |
| `bg-base`      | `#232b34` | `bg-grv-base`   | Main surface                   |
| `bg-soft`      | `#293240` | `bg-grv-soft`   | Sidebar, section alternates    |
| `bg-card`      | `#2e3a48` | `bg-grv-card`   | Card / panel backgrounds       |
| `bg-hover`     | `#374554` | `bg-grv-hover`  | Hover state, elevated cards    |
| `border`       | `#3e4e5e` | `border-grv-b`  | Default borders                |
| `border-light` | `#4e6070` | `border-grv-b2` | Lighter dividers               |

### Foreground

| Token    | Hex       | Tailwind class  | Usage                      |
|----------|-----------|-----------------|----------------------------|
| `fg`     | `#d8cdb8` | `text-grv-fg`   | Primary text               |
| `fg-2`   | `#b8b0a0` | `text-grv-fg2`  | Secondary text             |
| `fg-3`   | `#8a8480` | `text-grv-fg3`  | Muted text, annotations    |
| `fg-4`   | `#666260` | `text-grv-fg4`  | Very muted, placeholders   |

### Accents (Cold)

| Token        | Hex       | Tailwind class    | Usage                              |
|--------------|-----------|-------------------|------------------------------------|
| `aqua`       | `#5f9ea8` | `text-grv-aqua`   | Primary accent (cold Gruvbox aqua) |
| `aqua-light` | `#78b4c0` | `text-grv-aqua2`  | Hover, highlights                  |
| `blue`       | `#476f82` | `text-grv-blue`   | Secondary accent                   |
| `teal`       | `#4d8870` | `text-grv-teal`   | Tertiary accent                    |
| `amber`      | `#c89a3c` | `text-grv-amber`  | Warnings · use sparingly           |

---

## Typography

| Role      | Font             | Weight       | Notes                             |
|-----------|------------------|--------------|-----------------------------------|
| Display   | Space Grotesk    | 700          | Section headings                  |
| Body      | Inter            | 400 / 500    | Readable body text                |
| Mono      | System monospace | 400 / 600    | Data, code, labels, section IDs   |

---

## Component Rules

### Borders
- Use `border-grv-b` (1px solid `#3e4e5e`) by default.
- On hover: `border-grv-aqua` (`#5f9ea8`). No glow, no blur.

### Cards
```
bg-grv-card border border-grv-b hover:border-grv-aqua hover:bg-grv-hover
transition-colors duration-200
```

### Section Labels
```
font-mono text-[0.65rem] tracking-[0.18em] uppercase text-grv-aqua
border-l-2 border-grv-aqua pl-2.5
```
No chip background. No glow. Left-border accent only.

### Buttons — Primary
```
bg-grv-aqua text-grv-hard text-xs font-bold tracking-widest uppercase
px-7 py-3 hover:bg-grv-aqua2 transition-colors duration-200
```

### Buttons — Secondary (outline)
```
border border-grv-b text-grv-fg2 text-xs font-bold tracking-widest uppercase
px-7 py-3 hover:border-grv-aqua hover:text-grv-fg transition-colors duration-200
```

### Horizontal Rules
```
border-none h-px bg-grv-b  (flat, no glow)
```

---

## Forbidden

- `text-shadow` / `box-shadow` glow effects
- Neon-bright or saturated accent colors
- Sonar ring animations in hero
- Gradient text (use `text-grv-aqua` solid instead)
- All-caps marketing headings as primary content copy
- Excessive animation — motion should be functional, not decorative

---

## Grid / Background Pattern

Graph-paper grid at very low opacity — evokes a lab notebook or oscilloscope screen.

```css
background-image:
  linear-gradient(rgba(95,158,168,0.04) 1px, transparent 1px),
  linear-gradient(90deg, rgba(95,158,168,0.04) 1px, transparent 1px);
background-size: 48px 48px;
```

---

## References

- [Gruvbox](https://github.com/morhetz/gruvbox) — Pavel Pertsev
- [Zed Gruvbox Dark theme](https://zed.dev/extensions/gruvbox)
- [Jules Verne — 20,000 Leagues Under the Sea](https://en.wikipedia.org/wiki/Twenty_Thousand_Leagues_Under_the_Seas)
