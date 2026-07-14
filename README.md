<div align="center">

# toolnova.tools

### Free, browser-based PDF, OCR, calculator and converter tools — no signup, no uploads, no watermarks.

[![Live Site](https://img.shields.io/badge/Live-toolnova.tools-4f63d2?style=for-the-badge)](https://toolnova.tools)
[![License](https://img.shields.io/badge/License-MIT-0ba87e?style=for-the-badge)](LICENSE)
[![Made with HTML/CSS/JS](https://img.shields.io/badge/Built%20with-HTML%20%2F%20CSS%20%2F%20JS-e07a20?style=for-the-badge)]()

[**🌐 Visit toolnova.tools →**](https://toolnova.tools)

</div>

---

## What is toolnova.tools?

toolnova.tools is a collection of **35+ free online tools** — PDF conversion and editing, OCR, calculators, generators, and unit converters — that run **entirely in your browser**. Most tools never upload your files to a server: everything happens locally on your own device using client-side JavaScript.

No account. No signup. No watermarks. No artificial limits.

## Why it's different

Most "free" online tool sites quietly upload your file to a server, or push you toward a paid plan halfway through the task. toolnova.tools was built to avoid both:

- **Privacy-first** — PDF merge, split, compress, rotate, sign, and text-editing tools process files locally in your browser via [pdf-lib](https://pdf-lib.js.org/) and [pdf.js](https://mozilla.github.io/pdf.js/). Your document never leaves your device.
- **No paywall tricks** — every tool is fully usable for free, with no "upgrade to unlock" gates.
- **Fast** — a static site with no backend means near-instant load times and no server round-trips for most operations.

## Tools included

**PDF**
PDF ↔ Word, PDF ↔ JPG/PNG, PDF ↔ Excel, PDF ↔ Text, Merge, Split, Compress, Rotate, Delete/Extract Pages, Sign PDF, Add Text to PDF

**OCR**
Image to Text, Scan PDF to Text

**Generators**
QR Code Generator, Password Generator, Lorem Ipsum Generator, Screen Recorder, HTML to MP4

**Calculators**
Age, BMI, BMR, Calorie (TDEE), Tip, Discount, Loan, Water Intake

**Converters**
Unit Converter, Currency Converter, Text Case Converter, Word Counter, Color Code Converter

Full list always up to date at **[toolnova.tools](https://toolnova.tools)**.

## Tech stack

- Plain HTML / CSS / JavaScript — no framework, no build step
- [pdf-lib](https://pdf-lib.js.org/) — client-side PDF creation and editing
- [pdf.js](https://mozilla.github.io/pdf.js/) — client-side PDF rendering and text extraction
- [Tesseract.js](https://tesseract.projectnaptha.com/) — client-side OCR
- Hosted on **GitHub Pages**

## Project structure

```
toolnova.tools/
├── index.html              # Main app — all tools live here as modals
├── blog/                   # 20+ guide articles
├── *.html                  # Individual SEO landing pages, one per tool
├── sitemap.xml
├── robots.txt
└── ads.txt
```

Every tool also has its own dedicated landing page (e.g. `/age-calculator.html`, `/pdf-to-word.html`) with a full description, FAQ, and structured data — the actual tool itself lives in `index.html` and opens as a modal, reachable from any landing page via `/?tool=<key>`.

## Running locally

No build step needed — it's a static site.

```bash
git clone https://github.com/<your-username>/toolnova.tools.git
cd toolnova.tools
# open index.html directly, or serve it:
python3 -m http.server 8000
```

## Contributing

Found a bug or have a tool idea? Open an issue or a pull request — feedback and contributions are welcome.

## License

MIT — free to use, modify, and share.

---

<div align="center">
Built as a solo side project. If you find it useful, a ⭐ on this repo helps others discover it too.
</div>
