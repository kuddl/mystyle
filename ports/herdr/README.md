# Herdr Themes — Axolotl Suite

Custom Themes für [Herdr](https://herdr.dev) (Terminal Workspace Manager für AI Coding Agents).

## Installation

Kopiere den gewünschten Block in deine Herdr-Konfigurationsdatei:
```bash
~/.config/herdr/config.toml
```

Danach kannst du die Konfiguration im laufenden Herdr-Server neuladen mit:
```bash
herdr server reload-config
```
*(oder in Herdr über `<prefix> + Shift + R`)*

---

### Axolotl Obsidian (`axolotl-obsidian.toml`)
*True pitch-black (#09090B) with glowing Wizard Mint, Sky Cyan, Electric Violet, and Natty Pink.*

```toml
# Herdr Theme: Axolotl Obsidian
# Place or paste this into ~/.config/herdr/config.toml

[theme]
name = "catppuccin"
auto_switch = false

[theme.custom]
sidebar_bg = "#121217"
active_row_bg = "#191922"
selection_bg = "#221D3A"
panel_bg = "#09090B"
accent = "#6AE5B5"
text = "#F4F4F6"
subtext0 = "#A1A1AA"
surface_dim = "#121217"
surface0 = "#191922"
surface1 = "#23232E"
overlay0 = "#6E7185"
overlay1 = "#A1A1AA"

# Status & Accent Colors
green = "#6AE5B5"
red = "#FF5C77"
yellow = "#F3F99D"
blue = "#56B7EC"
mauve = "#5E26F6"
peach = "#FFA666"
teal = "#5ECAD6"
```

---

### Axolotl Natty (`axolotl-natty.toml`)
*Deep abyssal carbon-navy (#0C0E16) led by punchy Natty Pink, Snazzy Mint, Ice Cyan, and Electric Violet.*

```toml
# Herdr Theme: Axolotl Natty
# Place or paste this into ~/.config/herdr/config.toml

[theme]
name = "catppuccin"
auto_switch = false

[theme.custom]
sidebar_bg = "#141824"
active_row_bg = "#1C2233"
selection_bg = "#261E3F"
panel_bg = "#0C0E16"
accent = "#FF75B5"
text = "#EEFFFF"
subtext0 = "#B7C5D3"
surface_dim = "#141824"
surface0 = "#1C2233"
surface1 = "#232A40"
overlay0 = "#6E7C91"
overlay1 = "#B7C5D3"

# Status & Accent Colors
green = "#5AF78E"
red = "#FF5C57"
yellow = "#F3F99D"
blue = "#89DDFF"
mauve = "#7C3AED"
peach = "#FFB86C"
teal = "#89DDFF"
```

---

### Axolotl Arcane (`axolotl-arcane.toml`)
*Velvet indigo-black (#0D0B14) with violet undertones, glowing Mint, Sky Blue, and Natty Pink.*

```toml
# Herdr Theme: Axolotl Arcane
# Place or paste this into ~/.config/herdr/config.toml

[theme]
name = "catppuccin"
auto_switch = false

[theme.custom]
sidebar_bg = "#161324"
active_row_bg = "#1E1930"
selection_bg = "#281E42"
panel_bg = "#0D0B14"
accent = "#7C4DFF"
text = "#F0EEFF"
subtext0 = "#CFCBE2"
surface_dim = "#161324"
surface0 = "#1E1930"
surface1 = "#2A2440"
overlay0 = "#746E96"
overlay1 = "#CFCBE2"

# Status & Accent Colors
green = "#72F1B8"
red = "#FF6384"
yellow = "#FFE699"
blue = "#68C3F8"
mauve = "#7C4DFF"
peach = "#FFAB70"
teal = "#7EE2ED"
```

