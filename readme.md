# PDF QuickCheck

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Offline](https://img.shields.io/badge/works-offline-success)
![No%20Tracking](https://img.shields.io/badge/no%20tracking-100%25%20local-informational)

**PDF QuickCheck** is a modern, client-side web application for **offline static PDF analysis**.  
It helps identify potentially dangerous PDF features, extract metadata and URLs, and calculate a heuristic risk score — **without uploading files**.

The entire analysis runs locally in the browser.

---

## ✨ Features

- 📄 **Offline PDF analysis** (no uploads, no tracking)
- 🔍 Detects common **PDF risk indicators**, including:
  - JavaScript (`/JS`, `/JavaScript`)
  - OpenAction / AA
  - Launch actions
  - Embedded files
  - AcroForm / XFA
  - RichMedia / annotations
  - Object streams (`ObjStm`, `XRef`)
  - Encryption
- 🗜 **FlateDecode stream inflation** (best-effort, offline)
- 🔗 Extracts **URLs and mailto links**
- 🧠 **Heuristic risk score** (Low / Medium / High)
- 📑 Context view with raw hit snippets
- 💾 Export results as **JSON** or **CSV**
- 🎨 Modern **Dark / Light theme**, portfolio-style UI
- ♿ Accessible modals (focus trap, ESC, keyboard support)

---

## 🧠 How It Works

PDF QuickCheck performs a **static byte-level inspection** of the PDF file:

1. Reads the raw PDF byte stream
2. Extracts metadata (size, SHA-256, PDF version)
3. Scans for known risky markers
4. Attempts to **inflate `/FlateDecode` streams** using the browser’s  
   `DecompressionStream('deflate')` API (if supported)
5. Aggregates findings into:
   - Indicator table
   - Context snippets
   - URL list
   - Risk score

> ⚠️ This is **not a sandbox or malware detector**.  
> It is a **first-level triage and inspection tool**.

---

## 🌐 Browser Support

| Feature | Support |
|------|--------|
| Core analysis | All modern browsers |
| FlateDecode inflation | Chromium-based browsers (Chrome, Edge, Brave) |
| Dark / Light theme | All modern browsers |

If `DecompressionStream` is not available, the app still works — but compressed content may not be visible.

---

## 🚀 Getting Started

### Option 1: Local HTTP Server (recommended)

```bash
cd pdf-quickcheck
python -m http.server 8080
```

Open in browser:  
`http://localhost:8080`

> Some browsers restrict File APIs when opening files directly (`file://`).

---

### Option 2: VS Code Live Server

1. Open the project folder in VS Code
2. Install **Live Server**
3. Right-click `index.html` → **Open with Live Server**

---

## 📁 Project Structure

```
pdf-quickcheck/
├── index.html
├── assets/
│   ├── css/
│   │   ├── theme.css
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   ├── fonts/
│   │   ├── inter/
│   │   └── montserrat/
│   └── img/
│       ├── logo-nh-glow.svg
│       └── favicon.svg
```

---

## 🔐 Privacy & Security

- ❌ No cookies
- ❌ No tracking
- ❌ No uploads
- ✅ All processing happens locally
- ✅ Works fully offline after load

---

## ⚠️ Limitations

- Not all PDF streams can be decoded (e.g. `LZWDecode`, `ASCII85Decode`)
- Heuristic scoring — **not a definitive security verdict**
- Heavily obfuscated PDFs may hide indicators

For deep forensic analysis, combine with tools like:
- `pdfid.py`
- `pdf-parser.py`
- Malware sandboxes

---

## 🧩 Roadmap Ideas (Optional)

- Additional stream decoders
- More granular risk scoring
- IPv4 / URL reputation checks (offline lists)
- Language switch (EN / DE)
- Drag-select context highlighting

---

## 📜 License

This project is provided for **educational and defensive security purposes**.

Licensed under the **MIT License** – see `LICENSE` for details.

---

## 👤 Author

**Nils Höppner**  
Portfolio-style security tooling & infrastructure projects

---

> If you use this tool in production environments, always combine it with
> dynamic analysis and organizational security processes.
