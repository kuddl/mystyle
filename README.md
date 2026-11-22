# mystyle

Persönliches Design-System und Farbschema für Terminal-Apps, TUIs, Editoren und Tools.

## Philosophie

- **Single Source of Truth**: Kernfarben und semantische Rollen werden zentral in `palette/` definiert.
- **Ports & Formate**: Bereitstellung von Theme-Dateien für verschiedene Apps in `ports/`.
- **Einfache Einbindung**: Konfigurationen können direkt in die jeweiligen App-Configs eingebunden oder verlinkt werden.

## Ziel-Apps

- [x] **Raycast** (Theme / Extension Styling)
- [ ] **Ghostty** (Terminal Emulator)
- [ ] **Pi** (Coding Agent TUI / Themes)
- [ ] **VS Code** (Editor Theme)
- [ ] **Lazygit** (Git TUI)
- [ ] **Lazydocker** (Docker TUI)
- [ ] **Herdr** (Tooling / TUI)

## Struktur

```text
mystyle/
├── palette/          # Farbdefinitionen & semantische Rollen (JSON / YAML)
│   ├── palette.json  # Rohe Farbwerte (Hex, RGB)
│   └── semantic.json # Semantische Rollen (bg, fg, accent, etc.)
├── ports/            # App-spezifische Themes
│   ├── raycast/      # Raycast Theme Links & JSON Export
│   ├── ghostty/      # Ghostty Config-Snippet
│   ├── pi/           # Pi Custom Theme
│   ├── vscode/       # VS Code Theme Extension / JSON
│   ├── lazygit/      # Lazygit Theme Snippet
│   ├── lazydocker/   # Lazydocker Theme Snippet
│   └── herdr/        # Herdr Theme Config
└── generator/        # (Optional) Skripte zum Erzeugen von Port-Configs
```
