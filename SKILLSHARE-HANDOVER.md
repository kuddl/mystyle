# Handover: Skillshare-Setup auf einem weiteren MacBook

> **An den Agenten, der das liest:** Du richtest auf diesem Rechner das gleiche Skillshare-Setup ein wie auf dem ersten MacBook des Users. Der User möchte, dass **alles Alte entfernt** und das Setup **sauber aus dem Git-Repo** neu aufgebaut wird. Arbeite die Phasen der Reihe nach ab. **Vor jedem Löschen zeigst du dem User, was du gefunden hast, und fragst nach seinem Okay.** Sprich mit dem User Deutsch.

---

## 0. Zielbild (was am Ende stehen soll)

| Thema | Entscheidung |
|---|---|
| Tools | **Pi** (Haupttool) und **VS Code mit GitHub Copilot**. Kein Claude, kein Cursor, kein OpenCode, keine Copilot CLI. |
| Skills-Quelle | Zentral in `~/.config/skillshare/skills/`, in Unterordnern nach Thema und Herkunft (`core/`, `extensions/`, `_matt-pocock/` …). |
| Globale Skills | **Keine.** `targets: {}`, d.h. `~/.agents/skills/`, `~/.pi/agent/skills/` und `~/.copilot/skills/` bleiben leer. |
| Skills in Projekten | Nur pro Projekt, über `projects:` in der globalen `config.yaml` (**„Many Projects, One Config“**). Target `universal` (→ `<projekt>/.agents/skills/`), Modus **`merge`** (ein Symlink pro Skill), Auswahl über `include`-Filter. **Kein** `.skillshare/`-Ordner in den Projekten. |
| MCP-Server | Zentral definiert, **alle mit `global: false`**, `mcp.targets: [pi, vscode]`. Aktivierung pro Projekt über `mcp.projects.<pfad>.use: [...]`. |
| Projekt-Git | Verlinkte Skills und Projekt-MCP-Dateien gehören **nicht** in die Projekt-Repos → globale Git-Ignore. |
| Sync zwischen Rechnern | Git-Repo `git@github.com:kuddl/skillshare.git`, `git_root: root` (= ganzes `~/.config/skillshare/` ist das Repo). |
| Bedienung | CLI `skillshare`, Desktop-App **Skillshare**, Herdr-Mod (optional). |

### Wichtig: Was ist im Git-Repo, was nicht?
- **Im Repo:** `skills/core/create-branch`, `skills/extensions/chrome-extensions`, `skills/.metadata.json` (merkt sich das Tracked Repo `_matt-pocock`), `.gitignore`.
- **Nicht im Repo (absichtlich, so macht es Skillshare):**
  - `config.yaml`: Skillshare trägt sie bei `git_root: root` selbst in die `.gitignore` ein, weil jeder Rechner eigene Pfade und Targets hat. **Nicht dagegen ankämpfen.** Du baust sie auf diesem Rechner neu auf (Vorlage unten).
  - `skills/_matt-pocock/`: Der Klon eines Tracked Repos wird ignoriert und mit `skillshare install` (ohne Argumente) aus `.metadata.json` wiederhergestellt.
- **MCP-Server:** Falls im Repo eine Datei `mcp.yaml` liegt (siehe Phase 4, Variante A), kommen die Server-Definitionen aus dem Repo. Sonst nimmst du die Definitionen aus diesem Dokument (Variante B).

---

## Phase 1: Bestandsaufnahme (nur lesen, nichts ändern)

1. Version und Installation prüfen:
   ```bash
   which skillshare && skillshare version
   brew list --formula | grep skillshare; brew list --cask | grep skillshare-app
   ```
2. Bestehende Skillshare-Installation anschauen:
   ```bash
   ls -la ~/.config/skillshare 2>/dev/null
   cat ~/.config/skillshare/config.yaml 2>/dev/null
   git -C ~/.config/skillshare remote -v 2>/dev/null
   git -C ~/.config/skillshare status --short 2>/dev/null | head -40
   ```
3. Globale Tool-Ordner anschauen:
   ```bash
   ls -la ~/.agents ~/.agents/skills ~/.pi/agent/skills ~/.copilot/skills ~/.claude/skills ~/.cursor/skills 2>/dev/null
   cat ~/.pi/agent/mcp.json 2>/dev/null
   cat "$HOME/Library/Application Support/Code/User/mcp.json" 2>/dev/null
   cat ~/.copilot/mcp-config.json 2>/dev/null
   cat ~/.config/opencode/opencode.json 2>/dev/null
   git config --global core.excludesfile || echo "(kein globales gitignore)"
   ```
4. **Alle Projekte unter `~/code/` scannen.** Die meisten liegen direkt unter `~/code/`. Sammelordner wie `~/code/KAIO/` und `~/code/SWICA/` (eventuell auch `__private/`, `__merkle-intern/`) haben Projekte eine Ebene tiefer, dort also eine Ebene weiter scannen:
   ```bash
   scan() {
     local d="$1" hits=""
     for p in .agents .pi .github/skills .claude .cursor .skillshare .vscode/mcp.json .mcp.json opencode.json; do
       [ -e "$d/$p" ] && hits="$hits $p"
     done
     [ -n "$hits" ] && echo "$d ->$hits"
   }
   for d in ~/code/*/; do
     d=${d%/}; scan "$d"
     for s in "$d"/*/; do [ -d "$s/.git" ] && scan "${s%/}"; done
   done
   ```
   Bei jedem Fund prüfen, ob er im Projekt-Git **eingecheckt** ist:
   ```bash
   git -C <projekt> ls-files .agents .github/skills .vscode/mcp.json .pi | head
   ```
   Achte auch auf **kaputte Ordner mit merkwürdigen Namen** (z.B. Reste von abgebrochenen CLI-Prompts wie `? Choose the agent › …`), die findest du mit `ls -la`.
5. **Dem User eine Tabelle zeigen:** Fundort · Inhalt · eingecheckt ja/nein · Vorschlag (löschen / behalten / zentral übernehmen). Fragen:
   - Gibt es auf diesem Rechner Skills, die **noch nicht im Repo** sind und die er behalten will? Die kommen dann nach `~/.config/skillshare/skills/<ordner>/`, bevor irgendetwas gelöscht wird.
   - Gibt es MCP-Server, die **nicht** in der Liste in Phase 4 stehen? Dann übernehmen.

### Regeln fürs Aufräumen
- **Eingecheckte Dateien in Projekt-Repos werden nicht angefasst** (z.B. `.github/skills/` in `SWICA/swica-frontend`, `.agents/skills/pixijs*` in `xmas-game`). Die gehören den Team-Repos. Nur mit ausdrücklichem Okay ändern.
- Nicht eingecheckte Skill-Kopien, Symlinks und `.vscode/mcp.json`/`.pi/mcp.json` aus alten Versuchen dürfen nach Okay weg.
- Projekt-Notizen wie `.ai/`-Ordner, `AGENTS.md` usw. **nicht anfassen.**

---

## Phase 2: Installieren bzw. aktualisieren

```bash
brew install skillshare                       # CLI (homebrew-core)
brew install --cask runkids/tap/skillshare-app  # Desktop-App (Tap runkids/tap)
skillshare version                            # Ziel: gleiche Version wie auf Rechner 1 (dort 0.31.0) oder neuer
```
Ist schon etwas installiert: `brew upgrade skillshare` bzw. `brew upgrade --cask skillshare-app`.

---

## Phase 3: Altes Setup entfernen und aus Git neu aufbauen

> Erst nach dem Okay des Users aus Phase 1.

1. **Alte Skillshare-Quelle sichern und wegräumen** (Backup statt `rm`, falls doch etwas fehlt):
   ```bash
   [ -d ~/.config/skillshare ] && mv ~/.config/skillshare ~/.config/skillshare.bak-$(date +%Y%m%d-%H%M)
   ```
2. **Repo frisch verbinden.** Interaktiv `skillshare init` → *„Connect my existing skillshare repo“*, oder direkt:
   ```bash
   skillshare init --remote git@github.com:kuddl/skillshare.git
   ```
   Wenn `init` nach Targets fragt: **keine globalen Skill-Targets auswählen**, die ersten Sync-Vorschläge ablehnen. Wir schreiben die `config.yaml` danach ohnehin selbst (Phase 4).
   *Falls `init` Probleme macht, manuell:*
   ```bash
   git clone git@github.com:kuddl/skillshare.git ~/.config/skillshare
   ```
3. **Tracked Repos wiederherstellen** (holt `_matt-pocock` laut `.metadata.json`):
   ```bash
   skillshare install
   ```
   Der Audit meldet bei Matt Pocock einige HIGH/LOW-Findings, aber nichts CRITICAL. Das war auf Rechner 1 genauso und ist okay.
4. **Globale Altlasten leeren** (nach Okay):
   ```bash
   rm -rf ~/.agents/skills/* ~/.agents/skills/.skillshare-manifest.json ~/.agents/.skill-lock.json
   # ~/.pi/agent/skills/, ~/.copilot/skills/ sollen leer sein
   ```
   Alte MCP-Einträge in Pi, VS Code, Copilot und OpenCode **nicht von Hand löschen**. Das macht `skillshare sync mcp` in Phase 5 (es entfernt die Einträge, die Skillshare selbst geschrieben hat, und legt Backups an). Einträge, die Skillshare nicht kennt, mit dem User klären.

---

## Phase 4: `config.yaml` schreiben

Datei: `~/.config/skillshare/config.yaml`. **Pfade mit `~` schreiben** (die App schreibt sie beim Speichern eventuell wieder absolut, das ist okay).

### Variante A: Im Repo liegt eine `mcp.yaml` (bevorzugt)
Dann **nur** `sources.mcp` setzen und **kein** `mcp.servers` in `config.yaml` (beides gleichzeitig verweigert Skillshare):
```yaml
sources:
  skills: ~/.config/skillshare/skills
  agents: ~/.config/skillshare/agents
  mcp: ./mcp.yaml
```
und unten beim `mcp:`-Block nur `targets` und `projects` übernehmen.

### Variante B: Keine `mcp.yaml` im Repo → diese Vorlage komplett übernehmen
```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/runkids/skillshare/main/schemas/config.schema.json

sources:
  skills: ~/.config/skillshare/skills
  agents: ~/.config/skillshare/agents

git_root: root
mode: merge

# Keine globalen Skills, alles nur pro Projekt
targets: {}

mcp:
  targets:
    - pi
    - vscode
  servers:
    chrome-devtools:
      global: false
      command: npx
      args: [-y, chrome-devtools-mcp]
      piOptions:
        description: Chrome DevTools Protocol for browser control, debugging, and automation
    chrome-devtools-local:
      global: false
      command: npx
      args: [chrome-devtools-mcp@latest, --browserUrl=http://127.0.0.1:9222]
    cloudflare:
      global: false
      url: https://mcp.cloudflare.com/mcp
    next-devtools:
      global: false
      command: npx
      args: [-y, next-devtools-mcp@latest]
      piOptions:
        description: 'Next.js DevTools: Dev-Server-Diagnose, Routen, Logs und Next.js-Doku'
    nuxt:
      global: false
      url: https://nuxt.com/mcp
      piOptions:
        description: Offizielle Nuxt-Dokumentation und Nuxt-Modul-Suche
    raycast-docs:
      global: false
      url: https://developers.raycast.com/~gitbook/mcp
    shadcn:
      global: false
      command: npx
      args: [shadcn@latest, mcp]

  # MCP pro Projekt (nur Projekte eintragen, die auf DIESEM Rechner existieren!)
  projects:
    ~/code/xmas-game:
      use: [chrome-devtools, cloudflare]
    ~/code/SWICA/swica-frontend:
      use: [chrome-devtools, next-devtools]
    ~/code/raycast_extensions:
      use: [raycast-docs, next-devtools]

# Skills pro Projekt (nur Projekte eintragen, die auf DIESEM Rechner existieren!)
projects:
  ~/code/xmas-game:
    targets: [universal]
    skills:
      mode: merge
      include:
        - '*wayfinder*'
        - '*grill*'
        - core__create-branch
  ~/code/SWICA/swica-frontend:
    targets: [universal]
    skills:
      mode: merge
      include:
        - _matt-pocock__skills__engineering__ask-matt
        - _matt-pocock__skills__engineering__code-review
        - _matt-pocock__skills__engineering__codebase-design
        - _matt-pocock__skills__engineering__diagnosing-bugs
        - _matt-pocock__skills__engineering__pr
        - _matt-pocock__skills__engineering__wayfinder
        - _matt-pocock__skills__productivity__grill-me
        - _matt-pocock__skills__productivity__grilling
        - _matt-pocock__skills__productivity__teach
        - core__create-branch
  ~/code/raycast_extensions:
    targets: [universal]
    skills:
      mode: merge
      include:
        - '*wayfinder*'
        - _matt-pocock__skills__engineering__ask-matt
        - _matt-pocock__skills__engineering__code-review

ignore:
  - .DS_Store
  - .git/
  - __pycache__/

audit:
  block_threshold: CRITICAL
```

**Projekte anpassen:** Die Projektliste oben ist der Stand von Rechner 1. Prüfe mit `ls -d ~/code/...`, welche Projekte es hier gibt. Nicht vorhandene Projekte weglassen. Für weitere Projekte den User fragen, welche Skills/MCP-Server er dort will (oder später selbst per GUI / `/suggest-skills`).

### Wie die Skill-Namen in `include` funktionieren
- Unterordner werden beim Sync mit `__` flachgeklopft: `skills/core/create-branch` → `core__create-branch`, `skills/_matt-pocock/skills/engineering/wayfinder` → `_matt-pocock__skills__engineering__wayfinder`.
- `include` ist eine **Whitelist**: leer = **alle** Skills (das will der User nicht!). Wildcards gehen: `'*grill*'`, `'core__*'`.
- Exakte Namen zeigt `skillshare list --no-tui`.

---

## Phase 5: Sync

```bash
skillshare doctor
skillshare sync --dry-run
skillshare sync mcp --dry-run
```
Vorschau dem User zeigen, dann:
```bash
skillshare sync
skillshare sync mcp
```
Erwartung:
- `skillshare status` → Targets nur `<projekt>@universal`, **keine** globalen Targets.
- In jedem Projekt liegen unter `.agents/skills/` nur die per `include` gewählten Symlinks (plus eventuell eingecheckte Projekt-Skills, die bleiben unangetastet).
- `~/.pi/agent/mcp.json` und VS-Code-User-`mcp.json` enthalten **keine** Skillshare-Server mehr (alles `global: false`). Projekt-MCP liegt in `<projekt>/.pi/mcp.json` und `<projekt>/.vscode/mcp.json`.
- Ein zweites `skillshare sync mcp` meldet alles als `unchanged`.

---

## Phase 6: Globale Git-Ignore für die Projekte

Damit Symlinks und Projekt-MCP-Dateien nicht in den Projekt-Repos landen:

```bash
cat >> ~/.gitignore_global <<'EOF'
# Skillshare local project links & project MCP configs
.agents/skills/
.pi/mcp.json
.vscode/mcp.json
EOF
git config --global core.excludesfile ~/.gitignore_global
```
Vorher prüfen, ob `core.excludesfile` schon auf eine andere Datei zeigt. Dann dort ergänzen statt eine neue Datei anzulegen. Bereits eingecheckte Dateien (z.B. `.vscode/mcp.json` in SWICA) sind davon nicht betroffen.

Check: `git -C ~/code/xmas-game status --short` sollte nach dem Sync sauber sein.

---

## Phase 7: Pi-Prompt `/suggest-skills`

Datei `~/.pi/agent/prompts/suggest-skills.md` anlegen (liegt nicht im Skillshare-Repo):

````markdown
---
description: Suggest relevant Skillshare skills and MCP servers for the current project
argument-hint: "[optional focus or task]"
---
Inspect the current project in `cwd` and recommend relevant skills and opt-in MCP servers from my central Skillshare library (`~/.config/skillshare/`).

Focus / task context (if provided): ${@:-general project setup}

Steps:
1. Briefly inspect the current project (e.g. `package.json`, `pom.xml`, `README.md`, top-level files) to understand the tech stack and conventions.
2. Check what is already active in this project (`.agents/skills/`, `.pi/mcp.json`, `.vscode/mcp.json`).
3. Run `skillshare list --no-tui` and read `~/.config/skillshare/config.yaml` to see all available central skills (including tracked repos) and opt-in MCP servers (`global: false`).
4. Recommend only the most relevant **additional skills** and **opt-in MCP servers** for this project (and the focus above), with a short one-line reason for each. Group into:
   - **Recommended Skills** (with their flattened Skillshare filter name)
   - **Recommended MCP Servers** (from `mcp.servers`)
5. **Do not modify anything yet.** Ask me which ones I want to enable. Once I confirm:
   - Register the project (if not yet in `projects:` in `~/.config/skillshare/config.yaml`) using target `universal` and mode `merge`, or update its `include` list.
   - Add any confirmed opt-in MCP servers under `mcp.projects` (`use: [...]`).
   - Run `skillshare sync` (and `skillshare sync mcp` if MCP servers changed) and remind me to run `/reload` in Pi so newly linked skills are loaded.
````

Danach in laufenden Pi-Sessions `/reload`.

---

## Phase 8 (optional): Herdr-Mod

Wenn Herdr installiert ist und `~/.config/herdr-app/mods/skillshare/` fehlt, Prompt aus der Doku verwenden:
> Read ~/.config/herdr-app/AGENTS.md, then add this mod from https://github.com/runkids/skillshare/tree/main/herdr/skillshare-mod. Follow its RECIPE.md: add only the skillshare toggle and panel to my current layout, preserving my status bar, usage meters and all other customizations. Reuse existing skillshare nodes instead of duplicating them.

Hinweis an den User: Das Panel zeigt immer **Global** (alle Skills der Bibliothek). Einen Projekt-Umschalter gibt es nur bei Projekten mit eigenem `.skillshare/`, und die nutzen wir bewusst nicht. Projekt-Filter pflegt er in der Desktop-App unter **Projects**.

---

## Phase 9: Abschluss-Check & Übergabe an den User

```bash
skillshare status
skillshare list --no-tui
skillshare project list
skillshare sync --dry-run      # sollte nichts mehr zu tun haben
skillshare sync mcp --dry-run  # sollte alles "unchanged" melden
git -C ~/.config/skillshare status --short
```
- Hat sich im Repo etwas geändert (z.B. neue lokale Skills aus Phase 1, `.metadata.json`), mit dem User committen: `skillshare push -m "..."` bzw. später immer `skillshare push --pull -m "..."` (beide Richtungen). Oder in der App über **Git Sync**, im Herdr-Panel über **Sync both ways**.
- Backup-Ordner `~/.config/skillshare.bak-*` erst löschen, wenn der User zufrieden ist.

---

## Spickzettel für den Alltag

| Aufgabe | CLI | GUI |
|---|---|---|
| Skill-Sammlung zentral installieren (updatebar) | `skillshare install <owner>/<repo> --track --name <name>` → landet in `skills/_<name>/` | Skills → **Install** |
| Einzelne Skills in einen Ordner | `skillshare install <owner>/<repo> -s skill1,skill2 --into <ordner>` | Install-Dialog |
| Projekt anlegen | `skillshare project add ~/code/<p> --target universal --skills-mode merge --skills-include '<name>'` | Projects → **Add project** (Checkbox „Also add each checkout inside this folder“ **aus** lassen, die ist nur für Sammelordner mit mehreren Repos) |
| Skills im Projekt ändern | `skillshare project edit <p> --skills-include '<name>'` | Projects → `<p>` → Filters → **Include** (nicht 40× Exclude!) |
| MCP im Projekt aktivieren | `mcp.projects.<pfad>.use: [...]` in `config.yaml` | Projects → `<p>` → **MCP** → Opt-in servers |
| Anwenden | `skillshare sync` + `skillshare sync mcp` | **Sync** (`⌘S`) |
| Tracked Repos updaten | `skillshare check` / `skillshare update --all` | Herdr: *Update available* |
| Zwischen Rechnern syncen | `skillshare push --pull -m "..."` | Git Sync / *Sync both ways* |
| Vorschläge für ein Projekt | – | In Pi: `/suggest-skills [fokus]` |
| Sync-Modus | immer **`merge`** (Symlink pro Skill, lokale Projekt-Skills bleiben unberührt) | |
