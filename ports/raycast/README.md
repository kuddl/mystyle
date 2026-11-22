# Raycast Theme: mystyle

Raycast unterstützt Custom Themes für Raycast Pro Abonnenten oder Custom Icons/Styling in Extensions.

## 1. Raycast Pro Theme (Deeplink / Theme Creator)

Raycast Themes nutzen einen URL-Schema-Deeplink oder den Raycast Theme Explorer (`https://themes.ray.so`).

### Farbzuordnung für Raycast:

| Raycast Token | Mystyle Semantic Token | Hex Code |
| :--- | :--- | :--- |
| **Background** | `background.default` | `#1a1b26` |
| **Background (Secondary)** | `background.surface` | `#24283b` |
| **Text** | `foreground.default` | `#c0caf5` |
| **Text (Secondary / Muted)** | `foreground.muted` | `#787c99` |
| **Selection / Active Item** | `selection.bg` | `#33467c` |
| **Accent / Highlight** | `roles.accent` | `#7aa2f7` |
| **Red / Error** | `roles.danger` | `#f7768e` |
| **Orange / Warning** | `roles.warning` | `#e0af68` |
| **Yellow** | `accents.yellow` | `#e0af68` |
| **Green / Success** | `roles.success` | `#9ece6a` |
| **Blue / Info** | `roles.info` | `#7dcfff` |
| **Purple** | `roles.accent_secondary`| `#bb9af7` |

---

## 2. Raycast Theme JSON Export

```json
{
  "name": "mystyle Dark",
  "author": "Tobias Sailer",
  "version": "1",
  "appearance": "dark",
  "colors": {
    "background": "#1A1B26",
    "backgroundSecondary": "#24283B",
    "text": "#C0CAF5",
    "selection": "#33467C",
    "loader": "#7AA2F7",
    "red": "#F7768E",
    "orange": "#FF9E64",
    "yellow": "#E0AF68",
    "green": "#9ECE6A",
    "magenta": "#F778BA",
    "purple": "#BB9AF7",
    "blue": "#7DCFFF",
    "cyan": "#73DACA"
  }
}
```

---

## 3. Direkter Raycast Deeplink

Ein Raycast Theme kann über eine `raycast://theme?...` URL direkt importiert werden.

Sobald du deine genauen Wunschfarben festgelegt hast, können wir diesen Deeplink für einen 1-Klick-Import generieren.
