# Hello Foundry

Ein minimales Beispiel-Modul fuer **Foundry VTT v13**, das einen `/hello` Chat-Befehl hinzufuegt. Gedacht als Lernprojekt, um die Grundlagen der Modul-Entwicklung zu verstehen.

---

## Was das Modul kann

- Registriert zwei Einstellungen (Welt- und Client-Scope)
- Lauscht auf den `/hello` Chat-Befehl
- Postet eine Begruessungs-Nachricht (optional als Whisper)
- Ist mehrsprachig (Englisch + Deutsch)
- Gibt eine Info-Notification wenn Foundry geladen ist

---

## Ordnerstruktur

```
hello-foundry/
|-- module.json          <- Das Manifest. Ohne das laeuft nichts.
|-- scripts/
|   `-- main.js          <- Die Modul-Logik
|-- styles/
|   `-- style.css        <- Optionale CSS-Styles
|-- lang/
|   |-- en.json          <- Englische Uebersetzungen
|   `-- de.json          <- Deutsche Uebersetzungen
`-- README.md
```

---

## Die wichtigsten Konzepte

### `module.json` - Das Manifest

Das Herzstueck. Wichtige Felder:

| Feld | Bedeutung |
|------|-----------|
| `id` | Eindeutige ID, keine Leerzeichen, klein. Muss zum Ordnernamen passen. |
| `title` | Was in der Modul-Liste angezeigt wird. |
| `version` | Semantische Version (z.B. `1.0.0`). Foundry vergleicht die, um Updates zu erkennen. |
| `compatibility` | Fuer welche Foundry-Versionen das Modul getestet ist. |
| `esmodules` | ES6-JS-Dateien, die geladen werden. |
| `styles` | CSS-Dateien, die eingebunden werden. |
| `languages` | i18n-Dateien pro Sprache. |
| `manifest` | **Wichtig fuer Manifest-Installation:** URL zur `module.json` in deinem Release. |
| `download` | URL zur `module.zip` in deinem Release. |

### Hooks

Foundry feuert an wichtigen Stellen Hooks ab, an die wir uns haengen:

- `Hooks.once("init", ...)` - Ganz frueh, perfekt fuer `game.settings.register`.
- `Hooks.once("ready", ...)` - Alles geladen, Welt aktiv.
- `Hooks.on("chatMessage", ...)` - Vor jeder Chat-Eingabe. Wenn wir `false` zurueckgeben, wird die Original-Nachricht verschluckt.

### Settings

```js
game.settings.register(MODULE_ID, "greeting", {
  name: "HELLO_FOUNDRY.Settings.Greeting.Name",
  scope: "world",   // "world" oder "client"
  config: true,     // im Settings-UI sichtbar?
  type: String,
  default: "Hallo Welt!"
});
```

Gelesen mit `game.settings.get(MODULE_ID, "greeting")`.

### Lokalisierung

Statt feste Strings zu verwenden, nutzen wir Keys wie `"HELLO_FOUNDRY.Settings.Greeting.Name"`. Foundry sucht sie in den `lang/*.json` Dateien abhaengig von der gewaehlten Sprache.

---

## Lokal testen

Waehrend der Entwicklung legst du den `hello-foundry/` Ordner direkt in:

- **Windows:** `%localappdata%\FoundryVTT\Data\modules\`
- **macOS:** `~/Library/Application Support/FoundryVTT/Data/modules/`
- **Linux:** `~/.local/share/FoundryVTT/Data/modules/`

Dann Foundry neu starten, Modul in der Welt aktivieren, und in den Chat `/hello` eintippen.

> Bei The Forge geht das lokale Testen nicht direkt. Dafuer brauchst du die Manifest-URL-Methode unten - oder du installierst Foundry lokal zum Entwickeln.

---

## Deployment ueber GitHub + Manifest URL (fuer The Forge)

Das ist der Weg den du brauchst, weil The Forge nur via Manifest-URL installiert.

### 1. GitHub Repo anlegen

Lege ein neues **oeffentliches** Repo auf GitHub an, z.B. `hello-foundry`.

### 2. Platzhalter in `module.json` ersetzen

Ersetze alle Vorkommen von `DEIN-GITHUB-USER` durch deinen echten GitHub-Benutzernamen. Wichtig sind die URLs `url`, `manifest`, `download`, `bugs`, `readme`.

### 3. Dateien ins Repo pushen

```bash
cd hello-foundry
git init
git add .
git commit -m "Initial version"
git branch -M main
git remote add origin https://github.com/DEIN-GITHUB-USER/hello-foundry.git
git push -u origin main
```

### 4. Release bauen und hochladen

Foundry erwartet zwei Dateien im Release:

1. `module.json` (genau die aus dem Repo)
2. `module.zip` (eine ZIP, die **den Ordner `hello-foundry/` am Root** enthaelt)

Die ZIP kannst du so bauen (im Ordner *ueber* `hello-foundry/`):

```bash
# macOS/Linux
zip -r module.zip hello-foundry -x "*.git*"

# Windows PowerShell (aus dem Eltern-Ordner)
Compress-Archive -Path hello-foundry -DestinationPath module.zip
```

Dann auf GitHub:

1. Ins Repo gehen -> **Releases** -> **Draft a new release**
2. Tag: `v1.0.0` (muss zur `version` in der module.json passen - zumindest als Konvention)
3. Release-Titel: `v1.0.0`
4. Unten per Drag&Drop **beide Dateien** hochladen: `module.json` und `module.zip`
5. **Publish release**

### 5. Manifest-URL ermitteln

Durch die Verwendung von `/releases/latest/download/` ist deine Manifest-URL **stabil** (egal welche Version gerade latest ist):

```
https://github.com/DEIN-GITHUB-USER/hello-foundry/releases/latest/download/module.json
```

### 6. In The Forge installieren

1. Auf [forge-vtt.com](https://forge-vtt.com) einloggen
2. **The Bazaar** -> **My Modules** -> **Install Module**
3. Die Manifest-URL von oben einfuegen
4. **Install**

Foundry laedt die `module.json` ab, folgt dem `download`-Feld und installiert das ZIP.

---

## Updates veroeffentlichen

1. `version` in `module.json` erhoehen (z.B. `1.0.0` -> `1.1.0`)
2. Commit + Push
3. Neuen Release mit passendem Tag erstellen (`v1.1.0`) und wieder `module.json` + `module.zip` anhaengen
4. In Foundry/The Forge auf "Check for Updates" klicken - die neue Version sollte erkannt werden

**Wichtig:** Dadurch dass deine `manifest`-URL auf `/releases/latest/` zeigt, muessen du die URL nie aendern. Foundry vergleicht automatisch die `version`-Nummer.

---

## Naechste Schritte

Wenn du tiefer einsteigen willst:

- Eigene Dialog-Fenster mit `foundry.applications.api.ApplicationV2` (v13 API)
- Makros programmatisch anlegen
- Custom Sheets fuer Items/Actors
- Mit `libWrapper` bestehende Foundry-Funktionen ueberschreiben
- Scenen/Tokens via Hooks manipulieren (`canvasReady`, `createToken`, ...)

Die offizielle API-Doku: <https://foundryvtt.com/api/>

---

## Lizenz

MIT