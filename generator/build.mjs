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
  raycastLinks.push({
    flavor,
    file: `${flavor.slug}.json`,
    themesRaySoLink
  });
}

const raycastReadme = `# Raycast Themes — Axolotl Suite

Alle 3 Flavors der **Axolotl** Theme-Suite für Raycast:

${raycastLinks
  .map(
    ({ flavor, file, themesRaySoLink }) => `## ${flavor.name} (\`${file}\`)
${flavor.description}

- **Background**: \`${flavor.colors.bg}\` / \`${flavor.colors.bg_surface}\`
- **Primary / Selection**: \`${flavor.colors.semantic.primary}\`
- **Mint / Loader**: \`${flavor.colors.accents.mint}\`
- **Pink**: \`${flavor.colors.accents.pink}\`
- **Cyan**: \`${flavor.colors.accents.cyan}\`
- **Violet**: \`${flavor.colors.accents.violet}\`
- **Vorschau & 1-Klick Import (themes.ray.so)**: [In Raycast öffnen](${themesRaySoLink})
`
  )
  .join('\n')}
`;

fs.writeFileSync(path.join(raycastDir, 'README.md'), raycastReadme);
console.log('Generated Raycast themes for:', flavors.map((f) => f.name).join(', '));
