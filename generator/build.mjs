#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const flavorsDir = path.join(rootDir, 'palette', 'flavors');
const portsDir = path.join(rootDir, 'ports');

const flavorFiles = ['obsidian.json', 'natty.json', 'arcane.json'];
const flavors = flavorFiles.map((file) =>
  JSON.parse(fs.readFileSync(path.join(flavorsDir, file), 'utf8'))
);

// Build Raycast Themes + Deeplinks
const raycastDir = path.join(portsDir, 'raycast');
fs.mkdirSync(raycastDir, { recursive: true });

// Remove legacy file if present
const legacyRaycast = path.join(raycastDir, 'raycast-theme.json');
if (fs.existsSync(legacyRaycast)) fs.unlinkSync(legacyRaycast);

const raycastLinks = [];

for (const flavor of flavors) {
  const c = flavor.colors;
  const raycastTheme = {
    $schema: 'https://www.raycast.com/schemas/theme.json',
    author: 'Tobias Sailer',
    name: flavor.name,
    version: '1',
    appearance: 'dark',
    colors: {
      background: c.bg,
      backgroundSecondary: c.bg_surface,
      text: c.fg,
      selection: c.semantic.primary,
      loader: c.accents.mint,
      red: c.accents.red,
      orange: c.accents.orange,
      yellow: c.accents.yellow,
      green: c.accents.mint,
      blue: c.accents.cyan,
      purple: c.accents.violet,
      magenta: c.accents.pink
    }
  };

  const outPath = path.join(raycastDir, `${flavor.slug}.json`);
  fs.writeFileSync(outPath, JSON.stringify(raycastTheme, null, 2) + '\n');

  // Raycast URL format:
  // raycast://customWindow/importTheme?theme=<encoded JSON> or raycast.com theme studio URL
  const colorList = [
    c.bg,
    c.bg_surface,
    c.fg,
    c.semantic.primary,
    c.accents.mint,
    c.accents.red,
    c.accents.orange,
    c.accents.yellow,
    c.accents.mint,
    c.accents.cyan,
    c.accents.violet,
    c.accents.pink
  ].join(',');

  const query = new URLSearchParams({
    version: '1',
    name: flavor.name,
    author: 'Tobias Sailer',
    appearance: 'dark',
    colors: colorList
  });

  const themesRaySoLink = `https://themes.ray.so?${query.toString()}`;
  const raycastDeeplink = `raycast://theme?${query.toString()}`;

  raycastLinks.push({
    flavor,
    file: `${flavor.slug}.json`,
    themesRaySoLink,
    raycastDeeplink
  });
}

const raycastReadme = `# Raycast Themes — Axolotl Suite

Alle 3 Flavors der **Axolotl** Theme-Suite für Raycast:

${raycastLinks
  .map(
    ({ flavor, file, themesRaySoLink, raycastDeeplink }) => `## ${flavor.name} (\`${file}\`)
${flavor.description}

- **Background**: \`${flavor.colors.bg}\` / \`${flavor.colors.bg_surface}\`
- **Primary / Selection**: \`${flavor.colors.semantic.primary}\`
- **Mint / Loader**: \`${flavor.colors.accents.mint}\`
- **Pink**: \`${flavor.colors.accents.pink}\`
- **Cyan**: \`${flavor.colors.accents.cyan}\`
- **Violet**: \`${flavor.colors.accents.violet}\`
- **1-Klick Direkt-Import in Raycast**: [\`${raycastDeeplink}\`](${raycastDeeplink})
- **Web-Vorschau (themes.ray.so)**: [In Raycast Theme Studio öffnen](${themesRaySoLink})
`
  )
  .join('\n')}
`;

fs.writeFileSync(path.join(raycastDir, 'README.md'), raycastReadme);
console.log('Generated Raycast themes for:', flavors.map((f) => f.name).join(', '));

// Build Herdr Ports
const herdrDir = path.join(portsDir, 'herdr');
fs.mkdirSync(herdrDir, { recursive: true });

const herdrSnippets = [];

for (const flavor of flavors) {
  const c = flavor.colors;
  // Map Axolotl tokens to Herdr theme tokens:
  // Herdr base theme = "catppuccin" or "dracula"
  // Custom overrides:
  // sidebar_bg: navigation sidebar background
  // active_row_bg: highlighted item in sidebar
  // selection_bg: selected area / row
  // panel_bg: main terminal pane background (or reset for terminal passthrough)
  // accent: active border / focus / primary highlight
  // surface0 / surface1 / surface_dim / overlay0 / overlay1
  // text / subtext0
  // red / green / yellow / blue / mauve / peach / teal
  const tomlSnippet = `# Herdr Theme: ${flavor.name}
# Place or paste this into ~/.config/herdr/config.toml

[theme]
name = "catppuccin"
auto_switch = false

[theme.custom]
sidebar_bg = "${c.bg_surface}"
active_row_bg = "${c.bg_elevated}"
selection_bg = "${c.bg_selection}"
panel_bg = "${c.bg}"
accent = "${c.semantic.primary}"
text = "${c.fg}"
subtext0 = "${c.fg_secondary}"
surface_dim = "${c.bg_surface}"
surface0 = "${c.bg_elevated}"
surface1 = "${c.border}"
overlay0 = "${c.fg_muted}"
overlay1 = "${c.fg_secondary}"

# Status & Accent Colors
green = "${c.accents.mint}"
red = "${c.accents.red}"
yellow = "${c.accents.yellow}"
blue = "${c.accents.cyan}"
mauve = "${c.accents.violet}"
peach = "${c.accents.orange}"
teal = "${c.ansi.normal.cyan}"
`;

  const tomlFile = `${flavor.slug}.toml`;
  fs.writeFileSync(path.join(herdrDir, tomlFile), tomlSnippet);

  herdrSnippets.push({
    flavor,
    file: tomlFile,
    tomlSnippet
  });
}

const herdrReadme = `# Herdr Themes — Axolotl Suite

Custom Themes für [Herdr](https://herdr.dev) (Terminal Workspace Manager für AI Coding Agents).

## Installation

Kopiere den gewünschten Block in deine Herdr-Konfigurationsdatei:
\`\`\`bash
~/.config/herdr/config.toml
\`\`\`

Danach kannst du die Konfiguration im laufenden Herdr-Server neuladen mit:
\`\`\`bash
herdr server reload-config
\`\`\`
*(oder in Herdr über \`<prefix> + Shift + R\`)*

---

${herdrSnippets
  .map(
    ({ flavor, file, tomlSnippet }) => `### ${flavor.name} (\`${file}\`)
*${flavor.description}*

\`\`\`toml
${tomlSnippet.trim()}
\`\`\`
`
  )
  .join('\n---\n\n')}
`;

fs.writeFileSync(path.join(herdrDir, 'README.md'), herdrReadme);
console.log('Generated Herdr CLI/TUI themes for:', flavors.map((f) => f.name).join(', '));

// Build Herdr Desktop App Ports (~/.config/herdr-app/themes/<flavor>.json)
const herdrAppDir = path.join(portsDir, 'herdr-app');
fs.mkdirSync(herdrAppDir, { recursive: true });

for (const flavor of flavors) {
  const c = flavor.colors;
  const ansi = [
    c.ansi.normal.black,
    c.ansi.normal.red,
    c.ansi.normal.green,
    c.ansi.normal.yellow,
    c.ansi.normal.blue,
    c.ansi.normal.magenta,
    c.ansi.normal.cyan,
    c.ansi.normal.white,
    c.ansi.bright.black,
    c.ansi.bright.red,
    c.ansi.bright.green,
    c.ansi.bright.yellow,
    c.ansi.bright.blue,
    c.ansi.bright.magenta,
    c.ansi.bright.cyan,
    c.ansi.bright.white
  ];

  const appTheme = {
    background: c.bg,
    foreground: c.fg,
    selection: c.bg_selection,
    cursor: c.cursor,
    ansi,
    colors: {
      background: c.bg,
      foreground: c.fg,
      canvas: c.bg === '#09090B' ? '#070708' : c.bg === '#0C0E16' ? '#090B12' : '#0A0810',
      chrome: c.bg_surface,
      surface: c.bg_surface,
      popover: c.bg_elevated,
      raised: c.bg_elevated,
      hover: c.bg_selection,
      selected: c.bg_selection,
      border: c.border,
      input: c.semantic.primary,
      muted: c.fg_muted,
      dim: c.ansi.bright.black,
      accent: c.semantic.primary,
      accent_foreground: '#FFFFFF',
      solid: c.semantic.primary,
      solid_foreground: '#FFFFFF',
      ring: c.semantic.primary,
      working: c.accents.yellow,
      blocked: c.accents.red,
      done: c.accents.mint,
      idle: c.fg_muted,
      unknown: c.ansi.bright.black
    }
  };

  const appThemeFile = `${flavor.slug}.json`;
  fs.writeFileSync(path.join(herdrAppDir, appThemeFile), JSON.stringify(appTheme, null, 2) + '\n');
}

const herdrAppReadme = `# Herdr Desktop App Themes — Axolotl Suite

Custom Themes für die [Herdr Desktop App](https://herdr.dev).

## Installation

Kopiere die Theme-Dateien in den Theme-Ordner der Desktop-App:
\`\`\`bash
cp ports/herdr-app/*.json ~/.config/herdr-app/themes/
\`\`\`

Oder aktiviere ein Theme direkt per CLI:
\`\`\`bash
./bin/axolotl apply herdr-app arcane
# oder
./bin/axolotl apply herdr-app obsidian
# oder
./bin/axolotl apply herdr-app natty
\`\`\`

Alternativ kannst du das Theme in Herdr per Command Palette (\`Cmd+Shift+P\`) oder in den Einstellungen (**Settings → Theme**) auswählen.
`;

fs.writeFileSync(path.join(herdrAppDir, 'README.md'), herdrAppReadme);
console.log('Generated Herdr Desktop App themes for:', flavors.map((f) => f.name).join(', '));

// Build Pi Coding Agent Themes (~/.pi/agent/themes/<flavor>.json)
const piDir = path.join(portsDir, 'pi');
fs.mkdirSync(piDir, { recursive: true });

for (const flavor of flavors) {
  const c = flavor.colors;
  const piTheme = {
    $schema: 'https://pi.dev/schemas/theme.schema.json',
    name: flavor.slug,
    appearance: 'dark',
    vars: {
      bg: c.bg,
      bg_surface: c.bg_surface,
      bg_elevated: c.bg_elevated,
      selection: c.bg_selection,
      text: c.fg,
      secondary: c.fg_secondary,
      muted: c.fg_muted,
      primary: c.semantic.primary,
      secondaryAccent: c.semantic.secondary,
      mint: c.accents.mint,
      pink: c.accents.pink,
      cyan: c.accents.cyan,
      violet: c.accents.violet,
      yellow: c.accents.yellow,
      red: c.accents.red,
      orange: c.accents.orange,
      purple: c.accents.purple,
      border: c.border,
      borderAccent: c.border_active
    },
    colors: {
      accent: 'primary',
      border: 'border',
      borderAccent: 'borderAccent',
      borderMuted: 'border',
      success: 'mint',
      error: 'red',
      warning: 'yellow',
      muted: 'muted',
      dim: 'muted',
      text: 'text',
      thinkingText: 'secondary',
      selectedBg: 'selection',
      scrollbarTrack: 'bg_surface',
      scrollbarThumb: 'muted',
      searchMatchBg: 'selection',
      searchMatchText: 'text',
      userMessageBg: 'bg_surface',
      userMessageText: 'text',
      customMessageBg: 'bg_elevated',
      customMessageText: 'text',
      customMessageLabel: 'accent',
      toolPendingBg: 'bg_surface',
      toolSuccessBg: 'bg_surface',
      toolErrorBg: 'bg_surface',
      toolTitle: 'text',
      toolOutput: 'secondary',
      mdHeading: 'primary',
      mdLink: 'cyan',
      mdLinkUrl: 'muted',
      mdCode: 'pink',
      mdCodeBlock: 'mint',
      mdCodeBlockBorder: 'border',
      mdQuote: 'secondary',
      mdQuoteBorder: 'primary',
      mdHr: 'border',
      mdListBullet: 'violet',
      toolDiffAdded: 'mint',
      toolDiffRemoved: 'red',
      toolDiffContext: 'muted',
      syntaxComment: 'muted',
      syntaxKeyword: 'pink',
      syntaxFunction: 'cyan',
      syntaxVariable: 'primary',
      syntaxString: 'mint',
      syntaxNumber: 'yellow',
      syntaxType: 'purple',
      syntaxOperator: 'violet',
      syntaxPunctuation: 'secondary',
      thinkingOff: 'muted',
      thinkingMinimal: 'secondary',
      thinkingLow: 'cyan',
      thinkingMedium: 'violet',
      thinkingHigh: 'pink',
      thinkingXhigh: 'red',
      thinkingMax: 'orange',
      bashMode: 'mint'
    },
    export: {
      pageBg: c.bg,
      cardBg: c.bg_surface,
      infoBg: c.bg_elevated
    }
  };

  const piThemeFile = `${flavor.slug}.json`;
  fs.writeFileSync(path.join(piDir, piThemeFile), JSON.stringify(piTheme, null, 2) + '\n');
}

const piReadme = `# Pi Coding Agent Themes — Axolotl Suite

Themes für den [Pi Coding Agent](https://pi.dev).

## Installation

Kopiere die Theme-Dateien in deinen globalen Pi Theme-Ordner:
\`\`\`bash
mkdir -p ~/.pi/agent/themes
cp ports/pi/*.json ~/.pi/agent/themes/
\`\`\`

Oder verwende das Axolotl CLI:
\`\`\`bash
./bin/axolotl apply pi arcane
# oder
./bin/axolotl apply pi obsidian
# oder
./bin/axolotl apply pi natty
\`\`\`

In Pi kannst du das Theme jederzeit über \`/settings\` → **Theme** auswählen oder per CLI starten mit:
\`\`\`bash
pi --use-theme axolotl-arcane
\`\`\`
`;

fs.writeFileSync(path.join(piDir, 'README.md'), piReadme);
console.log('Generated Pi Coding Agent themes for:', flavors.map((f) => f.name).join(', '));

// Build VS Code Extension Ports (ports/vscode/)
const vscodeDir = path.join(portsDir, 'vscode');
const vscodeThemesDir = path.join(vscodeDir, 'themes');
fs.mkdirSync(vscodeThemesDir, { recursive: true });

// Copy icon from assets
const iconSrc = path.join(rootDir, 'assets', 'icons', 'icon-64.png');
if (fs.existsSync(iconSrc)) {
  fs.copyFileSync(iconSrc, path.join(vscodeDir, 'icon.png'));
}

const vscodeThemesMeta = [];

for (const flavor of flavors) {
  const c = flavor.colors;
  const themeFileName = `${flavor.slug}-color-theme.json`;
  const themePath = path.join(vscodeThemesDir, themeFileName);

  const vsTheme = {
    name: flavor.name,
    type: 'dark',
    colors: {
      // Activity Bar
      'activityBar.background': c.bg_surface,
      'activityBar.foreground': c.fg,
      'activityBar.inactiveForeground': c.fg_muted,
      'activityBar.border': c.border,
      'activityBarBadge.background': c.semantic.primary,
      'activityBarBadge.foreground': '#FFFFFF',

      // Side Bar
      'sideBar.background': c.bg_surface,
      'sideBar.foreground': c.fg_secondary,
      'sideBar.border': c.border,
      'sideBarTitle.foreground': c.fg,
      'sideBarSectionHeader.background': c.bg_surface,
      'sideBarSectionHeader.foreground': c.fg,
      'sideBarSectionHeader.border': c.border,

      // Editor & Syntax Background
      'editor.background': c.bg,
      'editor.foreground': c.fg,
      'editorCursor.foreground': c.cursor,
      'editor.lineHighlightBackground': c.bg_surface,
      'editor.selectionBackground': `${c.bg_selection}B0`,
      'editor.selectionHighlightBackground': `${c.bg_selection}60`,
      'editor.wordHighlightBackground': `${c.bg_selection}80`,
      'editor.wordHighlightStrongBackground': `${c.bg_selection}B0`,
      'editor.findMatchBackground': `${c.semantic.primary}40`,
      'editor.findMatchHighlightBackground': `${c.semantic.secondary}30`,
      'editorLineNumber.foreground': c.fg_muted,
      'editorLineNumber.activeForeground': c.fg,
      'editorIndentGuide.background1': c.border,
      'editorIndentGuide.activeBackground1': c.border_active,
      'editorWhitespace.foreground': `${c.fg_muted}40`,
      'editorLink.activeForeground': c.accents.cyan,
      'editorError.foreground': c.semantic.danger,
      'editorWarning.foreground': c.semantic.warning,
      'editorInfo.foreground': c.semantic.info,

      // Tabs
      'editorGroupHeader.tabsBackground': c.bg_surface,
      'tab.activeBackground': c.bg,
      'tab.activeForeground': c.fg,
      'tab.inactiveBackground': c.bg_surface,
      'tab.inactiveForeground': c.fg_muted,
      'tab.border': c.border,
      'tab.activeBorder': c.border_active,

      // Title Bar
      'titleBar.activeBackground': c.bg_surface,
      'titleBar.activeForeground': c.fg,
      'titleBar.inactiveBackground': c.bg_surface,
      'titleBar.inactiveForeground': c.fg_muted,
      'titleBar.border': c.border,

      // Status Bar
      'statusBar.background': c.bg_surface,
      'statusBar.foreground': c.fg_secondary,
      'statusBar.border': c.border,
      'statusBar.debuggingBackground': c.semantic.primary,
      'statusBar.debuggingForeground': '#FFFFFF',
      'statusBar.noFolderBackground': c.bg_surface,

      // Popovers & Widgets
      'editorWidget.background': c.bg_elevated,
      'editorWidget.border': c.border,
      'editorHoverWidget.background': c.bg_elevated,
      'editorHoverWidget.border': c.border,
      'dropdown.background': c.bg_elevated,
      'dropdown.border': c.border,
      'dropdown.foreground': c.fg,
      'input.background': c.bg_elevated,
      'input.border': c.border,
      'input.foreground': c.fg,
      'input.placeholderForeground': c.fg_muted,
      'inputOption.activeBorder': c.semantic.primary,

      // Lists & Trees
      'list.activeSelectionBackground': c.bg_selection,
      'list.activeSelectionForeground': c.fg,
      'list.inactiveSelectionBackground': `${c.bg_selection}80`,
      'list.inactiveSelectionForeground': c.fg,
      'list.hoverBackground': `${c.bg_selection}50`,
      'list.hoverForeground': c.fg,
      'list.focusBackground': c.bg_selection,
      'list.highlightForeground': c.semantic.primary,

      // Scrollbar
      'scrollbarSlider.background': `${c.fg_muted}30`,
      'scrollbarSlider.hoverBackground': `${c.fg_muted}50`,
      'scrollbarSlider.activeBackground': `${c.fg_muted}80`,

      // Badges & Buttons
      'badge.background': c.semantic.primary,
      'badge.foreground': '#FFFFFF',
      'button.background': c.semantic.primary,
      'button.foreground': '#FFFFFF',
      'button.hoverBackground': c.accents.mint,

      // Git Decorations
      'gitDecoration.modifiedResourceForeground': c.accents.pink,
      'gitDecoration.deletedResourceForeground': c.accents.red,
      'gitDecoration.untrackedResourceForeground': c.accents.mint,
      'gitDecoration.ignoredResourceForeground': c.fg_muted,
      'gitDecoration.conflictingResourceForeground': c.accents.yellow,

      // Integrated Terminal
      'terminal.background': c.bg,
      'terminal.foreground': c.fg,
      'terminal.ansiBlack': c.ansi.normal.black,
      'terminal.ansiRed': c.ansi.normal.red,
      'terminal.ansiGreen': c.ansi.normal.green,
      'terminal.ansiYellow': c.ansi.normal.yellow,
      'terminal.ansiBlue': c.ansi.normal.blue,
      'terminal.ansiMagenta': c.ansi.normal.magenta,
      'terminal.ansiCyan': c.ansi.normal.cyan,
      'terminal.ansiWhite': c.ansi.normal.white,
      'terminal.ansiBrightBlack': c.ansi.bright.black,
      'terminal.ansiBrightRed': c.ansi.bright.red,
      'terminal.ansiBrightGreen': c.ansi.bright.green,
      'terminal.ansiBrightYellow': c.ansi.bright.yellow,
      'terminal.ansiBrightBlue': c.ansi.bright.blue,
      'terminal.ansiBrightMagenta': c.ansi.bright.magenta,
      'terminal.ansiBrightCyan': c.ansi.bright.cyan,
      'terminal.ansiBrightWhite': c.ansi.bright.white
    },
    tokenColors: [
      {
        name: 'Comments',
        scope: ['comment', 'punctuation.definition.comment'],
        settings: {
          foreground: c.semantic.comment,
          fontStyle: 'italic'
        }
      },
      {
        name: 'Keywords & Operators',
        scope: ['keyword', 'keyword.control', 'keyword.operator.new', 'keyword.operator.expression'],
        settings: {
          foreground: c.semantic.keyword
        }
      },
      {
        name: 'Storage & Types',
        scope: ['storage', 'storage.type', 'storage.modifier', 'support.type', 'entity.name.type'],
        settings: {
          foreground: c.semantic.type,
          fontStyle: 'italic'
        }
      },
      {
        name: 'Functions & Methods',
        scope: ['entity.name.function', 'support.function', 'variable.function', 'meta.function-call'],
        settings: {
          foreground: c.semantic.function
        }
      },
      {
        name: 'Strings & Template Expressions',
        scope: ['string', 'string.template', 'punctuation.definition.string'],
        settings: {
          foreground: c.semantic.string
        }
      },
      {
        name: 'Numbers & Constants',
        scope: ['constant.numeric', 'constant.language', 'constant.character', 'support.constant'],
        settings: {
          foreground: c.semantic.constant
        }
      },
      {
        name: 'Variables & Parameters',
        scope: ['variable', 'variable.other', 'variable.parameter'],
        settings: {
          foreground: c.fg
        }
      },
      {
        name: 'HTML/JSX Tags',
        scope: ['entity.name.tag', 'punctuation.definition.tag'],
        settings: {
          foreground: c.semantic.keyword
        }
      },
      {
        name: 'HTML/JSX Attributes',
        scope: ['entity.other.attribute-name'],
        settings: {
          foreground: c.accents.yellow,
          fontStyle: 'italic'
        }
      },
      {
        name: 'Punctuation & Delimiters',
        scope: ['punctuation', 'punctuation.separator', 'punctuation.terminator', 'meta.brace'],
        settings: {
          foreground: c.fg_secondary
        }
      },
      {
        name: 'JSON/Object Keys',
        scope: ['support.type.property-name', 'entity.name.tag.yaml', 'constant.other.object.key.js'],
        settings: {
          foreground: c.accents.cyan
        }
      }
    ]
  };

  fs.writeFileSync(themePath, JSON.stringify(vsTheme, null, 2) + '\n');
  vscodeThemesMeta.push({
    label: flavor.name,
    uiTheme: 'vs-dark',
    path: `./themes/${themeFileName}`
  });
}

// Generate VS Code Extension package.json
const vscodePkg = {
  name: 'axolotl-theme',
  displayName: 'Axolotl Theme Suite',
  description: 'True pitch black, abyssal navy, and velvet indigo themes featuring Wizard Mint, Sky Cyan, Electric Violet, and Natty Pink.',
  version: '0.1.0',
  publisher: 'kuddl',
  author: 'Tobias Sailer',
  icon: 'icon.png',
  license: 'MIT',
  repository: {
    type: 'git',
    url: 'https://github.com/kuddl/mystyle'
  },
  engines: {
    vscode: '^1.70.0'
  },
  categories: ['Themes'],
  keywords: ['theme', 'dark', 'axolotl', 'natty', 'snazzy', 'obsidian', 'arcane', 'mint'],
  contributes: {
    themes: vscodeThemesMeta
  }
};

fs.writeFileSync(path.join(vscodeDir, 'package.json'), JSON.stringify(vscodePkg, null, 2) + '\n');

const vscodeReadme = `# Axolotl Theme Suite for VS Code

Die offizielle **Axolotl** Theme-Suite für Visual Studio Code.

Beinhaltet alle 3 Flavors:
- **Axolotl Obsidian:** True pitch-black (\`#09090B\`) mit leuchtendem Wizard Mint (\`#6AE5B5\`).
- **Axolotl Natty:** Deep abyssal navy (\`#0C0E16\`) angelehnt an das legendäre Natty-Theme mit Natty Pink (\`#FF75B5\`).
- **Axolotl Arcane:** Velvet Indigo (\`#0D0B14\`) mit Electric Violet (\`#7C4DFF\`) und Mint.

## Schnelle lokale Installation

Verlinke die Extension direkt in dein VS Code Extensions-Verzeichnis:
\`\`\`bash
ln -s "$(pwd)/ports/vscode" ~/.vscode/extensions/axolotl-theme
\`\`\`

Oder nutze das Axolotl CLI:
\`\`\`bash
./bin/axolotl apply vscode natty     # oder obsidian / arcane
\`\`\`
`;

fs.writeFileSync(path.join(vscodeDir, 'README.md'), vscodeReadme);
console.log('Generated VS Code extension for:', flavors.map((f) => f.name).join(', '));




