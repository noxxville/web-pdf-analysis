(() => {
  "use strict";

  // =========================================================
  // DOM
  // =========================================================
  const root = document.documentElement;

  const themeToggle = document.getElementById("themeToggle");
  const yearEl = document.getElementById("year");

  const drop = document.getElementById("drop");
  const chooseBtn = document.getElementById("chooseBtn");
  const fileInput = document.getElementById("fileInput");

  const fileInfoEl = document.getElementById("fileInfo");
  const riskScoreEl = document.getElementById("riskScore");
  const indicatorsTbody = document.getElementById("indicators");
  const urlsEl = document.getElementById("urls");
  const contextEl = document.getElementById("context");

  const downloadJsonBtn = document.getElementById("downloadJson");
  const downloadCsvBtn = document.getElementById("downloadCsv");
  const downloadPdfBtn = document.getElementById("downloadPdf");
  const resetBtn = document.getElementById("resetBtn");

  // Legal Modal
  const legalOverlay = document.getElementById("legalOverlay");
  const legalModal = legalOverlay ? legalOverlay.querySelector(".legal-modal") : null;
  const legalTitle = document.getElementById("legalTitle");
  const legalBody = document.getElementById("legalBody");
  const legalClose = document.getElementById("legalClose");

  // =========================================================
  // Theme Toggle (Dark default, Light via data-theme)
  // =========================================================
  const STORAGE_KEY_THEME = "pdfqc-theme";
  const THEME_DARK = "dark";
  const THEME_LIGHT = "light";

  function applyTheme(theme) {
    if (theme === THEME_LIGHT) {
      root.setAttribute("data-theme", "light");
      if (themeToggle) themeToggle.textContent = "Theme: Dark";
    } else {
      root.removeAttribute("data-theme");
      if (themeToggle) themeToggle.textContent = "Theme: Light";
    }
  }

  const savedTheme = localStorage.getItem(STORAGE_KEY_THEME) || THEME_DARK;
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") === "light" ? THEME_LIGHT : THEME_DARK;
      const next = current === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;
      localStorage.setItem(STORAGE_KEY_THEME, next);
      applyTheme(next);
    });
  }

  // Footer Year
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // No-Cookies icon: prevent navigation if href="#"
  document.querySelectorAll('[data-nocookies="true"]').forEach((el) => {
    el.addEventListener("click", (e) => e.preventDefault());
  });

  // =========================================================
  // Legal Modal (Impressum / Datenschutz) + Focus Trap (perfektioniert)
  // =========================================================
  const LEGAL_TEXT = {
    imprint: {
      title: "Impressum",
      body:
`Angaben gemäß § 5 TMG

Nils Höppner
Deutschland

Kontakt
E-Mail: mail@example.com

Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:
Nils Höppner

Haftung für Inhalte
Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.

Haftung für Links
Diese Webseite enthält ggf. Links zu externen Webseiten Dritter. Auf deren Inhalte haben wir keinen Einfluss.`
    },
    privacy: {
      title: "Datenschutzerklärung",
      body:
`Diese Webseite verarbeitet keine personenbezogenen Daten im Sinne einer aktiven Erhebung durch den Betreiber.

Cookies / Tracking
- Es werden keine Cookies gesetzt
- Es werden keine Tracking- oder Analyse-Tools verwendet

Server-Logfiles
Der Hosting-Provider erhebt ggf. technische Server-Logfiles (z. B. IP-Adresse, Zeitpunkt, User-Agent) zur Sicherstellung des Betriebs und zur Missbrauchserkennung.

Kontaktaufnahme
Bei Kontaktaufnahme per E-Mail werden die übermittelten Daten ausschließlich zur Bearbeitung der Anfrage verwendet.

Rechte (DSGVO)
Sie haben das Recht auf Auskunft, Berichtigung und Löschung Ihrer Daten gemäß DSGVO.

Verantwortlicher
Nils Höppner`
    }
  };

  let lastActiveElement = null;

  function isModalOpen() {
    return !!(legalOverlay && !legalOverlay.classList.contains("hidden") && legalOverlay.getAttribute("aria-hidden") === "false");
  }

  function getFocusableElements(container) {
    if (!container) return [];
    const selectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ];
    return Array.from(container.querySelectorAll(selectors.join(",")))
      .filter(el => el.offsetParent !== null && !el.hasAttribute("disabled"));
  }

  function trapFocus(e) {
    if (!isModalOpen()) return;
    if (e.key !== "Tab") return;

    const focusables = getFocusableElements(legalModal);
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    // If focus escaped outside modal, bring it back.
    if (legalModal && !legalModal.contains(document.activeElement)) {
      e.preventDefault();
      (legalClose || first).focus();
      return;
    }

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
      return;
    }

    if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function openLegal(type) {
    if (!legalOverlay || !legalModal || !legalTitle || !legalBody) return;
    const data = LEGAL_TEXT[type];
    if (!data) return;

    lastActiveElement = document.activeElement;

    legalOverlay.setAttribute("role", "dialog");
    legalOverlay.setAttribute("aria-modal", "true");
    if (legalTitle.id) legalOverlay.setAttribute("aria-labelledby", legalTitle.id);
    if (legalBody.id) legalOverlay.setAttribute("aria-describedby", legalBody.id);

    legalTitle.textContent = data.title;
    legalBody.textContent = data.body;

    legalOverlay.classList.remove("hidden");
    legalOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const target = legalClose || getFocusableElements(legalModal)[0] || legalModal;
    window.requestAnimationFrame(() => {
      if (target && typeof target.focus === "function") target.focus();
    });
  }

  function closeLegal() {
    if (!legalOverlay) return;
    legalOverlay.classList.add("hidden");
    legalOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (lastActiveElement && typeof lastActiveElement.focus === "function") lastActiveElement.focus();
    lastActiveElement = null;
  }

  document.querySelectorAll("[data-legal]").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      openLegal(a.getAttribute("data-legal"));
    });
  });

  if (legalClose) legalClose.addEventListener("click", closeLegal);

  if (legalOverlay) {
    legalOverlay.addEventListener("click", (e) => {
      if (e.target === legalOverlay) closeLegal();
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isModalOpen()) closeLegal();
  });
  window.addEventListener("keydown", trapFocus);

  if (legalOverlay) closeLegal(); // hard-close on load

  // =========================================================
  // Utils (Bytes/Text/Hash/Downloads)
  // =========================================================
  function formatBytes(bytes) {
    const units = ["B", "KB", "MB", "GB"];
    let n = bytes;
    let u = 0;
    while (n >= 1024 && u < units.length - 1) {
      n /= 1024;
      u++;
    }
    return `${n.toFixed(u === 0 ? 0 : 1)} ${units[u]}`;
  }

  async function sha256Hex(arrayBuffer) {
    const hash = await crypto.subtle.digest("SHA-256", arrayBuffer);
    const b = new Uint8Array(hash);
    let out = "";
    for (const x of b) out += x.toString(16).padStart(2, "0");
    return out;
  }

  function u8ToLatin1(u8) {
    let s = "";
    const chunk = 0x8000;
    for (let i = 0; i < u8.length; i += chunk) {
      s += String.fromCharCode.apply(null, u8.subarray(i, i + chunk));
    }
    return s;
  }

  function normalizeEOL(s) {
    return s.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  }

  function safeUtf8Decode(u8) {
    try {
      return new TextDecoder("utf-8", { fatal: false }).decode(u8);
    } catch {
      return u8ToLatin1(u8);
    }
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    }[c]));
  }

  // =========================================================
  // FlateDecode inflate (offline)
  // =========================================================
  async function inflateDeflate(u8) {
    // Works in Chromium-based browsers. If missing, we skip inflate gracefully.
    if (typeof DecompressionStream === "undefined") return null;

    // Try "deflate"
    try {
      const ds = new DecompressionStream("deflate");
      const stream = new Blob([u8]).stream().pipeThrough(ds);
      const ab = await new Response(stream).arrayBuffer();
      return new Uint8Array(ab);
    } catch {
      return null;
    }
  }

  async function extractInflatedFlateStreams(pdfU8) {
    // Best-effort: Find /Filter /FlateDecode ... stream ... endstream and inflate their bytes.
    // Returns { text, streamsFound, streamsInflated, bytesInflated }
    const raw = u8ToLatin1(pdfU8);
    const outParts = [];
    let streamsFound = 0;
    let streamsInflated = 0;
    let bytesInflated = 0;

    // Guard rails
    const MAX_STREAMS = 250;
    const MAX_TOTAL_INFLATED = 12 * 1024 * 1024; // 12 MB

    // Find occurrences of "/Filter /FlateDecode ... stream(\r?\n)"
    const flateObjRegex = /\/Filter\s*\/FlateDecode[\s\S]{0,3000}?stream\r?\n/g;

    let match;
    while ((match = flateObjRegex.exec(raw)) !== null) {
      streamsFound++;
      if (streamsFound > MAX_STREAMS) break;

      const streamStart = flateObjRegex.lastIndex; // after stream\n
      // endstream often preceded by newline; keep robust
      let endIdx = raw.indexOf("\nendstream", streamStart);
      if (endIdx === -1) endIdx = raw.indexOf("\rendstream", streamStart);
      if (endIdx === -1) continue;

      const streamStr = raw.slice(streamStart, endIdx);

      // Convert string->bytes (Latin1 mapping)
      const streamU8 = new Uint8Array(streamStr.length);
      for (let i = 0; i < streamStr.length; i++) streamU8[i] = streamStr.charCodeAt(i) & 0xff;

      const inflated = await inflateDeflate(streamU8);
      if (!inflated || inflated.length === 0) continue;

      bytesInflated += inflated.length;
      if (bytesInflated > MAX_TOTAL_INFLATED) break;

      streamsInflated++;
      // Decode for regex scanning: combine UTF-8 attempt + latin fallback (robust)
      outParts.push(normalizeEOL(safeUtf8Decode(inflated)));
    }

    return {
      text: outParts.join("\n\n"),
      streamsFound,
      streamsInflated,
      bytesInflated
    };
  }

  // =========================================================
  // Analysis: markers / urls / context / risk score
  // =========================================================
  const CHECKS = [
    {
      id: "javascript",
      label: "JavaScript",
      patterns: [/\/JavaScript\b/i, /\/JS\b/i],
      weight: 30,
      hint: "JavaScript in PDFs ist ein häufig genutzter Angriffsvektor."
    },
    {
      id: "openaction",
      label: "OpenAction / AA",
      patterns: [/\/OpenAction\b/i, /\/AA\b/i],
      weight: 18,
      hint: "Automatische Aktionen beim Öffnen können missbraucht werden."
    },
    {
      id: "launch",
      label: "Launch Action",
      patterns: [/\/Launch\b/i],
      weight: 28,
      hint: "Kann externe Programme/Dateien starten."
    },
    {
      id: "embedded",
      label: "Embedded Files",
      patterns: [/\/EmbeddedFile\b/i, /\/Filespec\b/i],
      weight: 16,
      hint: "Eingebettete Dateien sind ein häufiges Delivery-Muster."
    },
    {
      id: "acroform",
      label: "AcroForm / XFA",
      patterns: [/\/AcroForm\b/i, /\/XFA\b/i],
      weight: 10,
      hint: "Formulare können komplexe Inhalte enthalten."
    },
    {
      id: "richmedia",
      label: "RichMedia / Multimedia",
      patterns: [/\/RichMedia\b/i, /\/Annot\b/i, /\/Sound\b/i, /\/Movie\b/i],
      weight: 8,
      hint: "Multimedia/Annotations erhöhen Komplexität und Angriffsfläche."
    },
    {
      id: "objstm",
      label: "ObjStm / XRef Streams",
      patterns: [/\/ObjStm\b/i, /\/XRef\b/i],
      weight: 4,
      hint: "Objekt-Streams erschweren manuelle Analyse (nicht per se bösartig)."
    },
    {
      id: "encrypt",
      label: "Encrypt",
      patterns: [/\/Encrypt\b/i],
      weight: 20,
      hint: "Verschlüsselte PDFs erschweren Analyse, können Inhalte verstecken."
    }
  ];

  function findAllMatches(text, regex, max = 50) {
    // Ensure global regex
    const r = new RegExp(regex.source, regex.flags.includes("g") ? regex.flags : (regex.flags + "g"));
    const idxs = [];
    let m;
    while ((m = r.exec(text)) !== null) {
      idxs.push({ index: m.index, match: m[0] });
      if (idxs.length >= max) break;
    }
    return idxs;
  }

  function buildContextSnippets(text, patterns, maxSnippets = 40) {
    const snippets = [];
    const WINDOW = 90;

    for (const pat of patterns) {
      const ms = findAllMatches(text, pat, 30);
      for (const hit of ms) {
        const start = Math.max(0, hit.index - WINDOW);
        const end = Math.min(text.length, hit.index + hit.match.length + WINDOW);
        const pre = text.slice(start, end);
        snippets.push(pre);
        if (snippets.length >= maxSnippets) return snippets;
      }
    }
    return snippets;
  }

  function extractUrls(text) {
    const results = new Set();

    // URLs
    const urlRe = /\bhttps?:\/\/[^\s<>"'(){}\[\]]{6,}\b/gi;
    let m;
    while ((m = urlRe.exec(text)) !== null) results.add(m[0]);

    // mailto:
    const mailtoRe = /\bmailto:[^\s<>"'(){}\[\]]{3,}\b/gi;
    while ((m = mailtoRe.exec(text)) !== null) results.add(m[0]);

    // "www."
    const wwwRe = /\bwww\.[^\s<>"'(){}\[\]]{4,}\b/gi;
    while ((m = wwwRe.exec(text)) !== null) results.add(m[0]);

    return Array.from(results).slice(0, 200);
  }

  function calcScore(checkResults, urlCount, flateInflatedCount) {
    let score = 0;

    for (const c of checkResults) {
      if (c.hit) score += c.weight;
    }

    // URLs add small risk
    if (urlCount > 0) score += Math.min(12, 2 + Math.floor(urlCount / 3));

    // If Flate streams exist but could not be inflated -> increase uncertainty
    if (flateInflatedCount === 0) score += 3;

    // Clamp 0..100
    score = Math.max(0, Math.min(100, score));
    return score;
  }

  function scoreLabel(score) {
    if (score >= 60) return { cls: "pill bad", text: `High Risk (${score}/100)` };
    if (score >= 30) return { cls: "pill warn", text: `Medium Risk (${score}/100)` };
    return { cls: "pill ok", text: `Low Risk (${score}/100)` };
  }

  function setButtonsEnabled(enabled) {
    if (downloadJsonBtn) downloadJsonBtn.disabled = !enabled;
    if (downloadCsvBtn) downloadCsvBtn.disabled = !enabled;
    if (downloadPdfBtn) downloadPdfBtn.disabled = !enabled;
    if (resetBtn) resetBtn.disabled = !enabled;
  }

  function clearOutput() {
    if (fileInfoEl) fileInfoEl.innerHTML = "";
    if (riskScoreEl) riskScoreEl.textContent = "";
    if (indicatorsTbody) indicatorsTbody.innerHTML = "";
    if (urlsEl) urlsEl.innerHTML = "";
    if (contextEl) contextEl.textContent = "";
  }

  // =========================================================
  // File handling
  // =========================================================
  let currentFile = null;
  let currentResult = null;

  async function analyzeFile(file) {
    currentFile = file;
    currentResult = null;
    clearOutput();
    setButtonsEnabled(false);

    const ab = await file.arrayBuffer();
    const u8 = new Uint8Array(ab);

    // PDF version from header
    const head = u8ToLatin1(u8.subarray(0, Math.min(u8.length, 2048)));
    const verMatch = head.match(/%PDF-(\d\.\d)/);
    const pdfVersion = verMatch ? verMatch[1] : "unbekannt";

    // Hash
    const hash = await sha256Hex(ab);

    // Raw scan text (limited for performance but still large enough)
    const rawText = normalizeEOL(u8ToLatin1(u8));

    // Inflate FlateDecode streams (if possible)
    const flate = await extractInflatedFlateStreams(u8);

    // Compose scan text
    const scanText = rawText + "\n\n-----[INFLATED_FLATE_STREAMS]-----\n\n" + (flate.text || "");

    // Run checks
    const checkResults = CHECKS.map((c) => {
      const hits = [];
      for (const p of c.patterns) {
        const ms = findAllMatches(scanText, p, 30);
        if (ms.length) hits.push(...ms);
      }
      return {
        id: c.id,
        label: c.label,
        hit: hits.length > 0,
        count: hits.length,
        weight: c.weight,
        hint: c.hint,
        patterns: c.patterns
      };
    });

    // URLs
    const urls = extractUrls(scanText);

    // Context snippets (aggregate for hits)
    const contextParts = [];
    for (const r of checkResults) {
      if (!r.hit) continue;
      const snips = buildContextSnippets(scanText, r.patterns, 8);
      for (const s of snips) {
        contextParts.push(`[${r.label}] …${s}…`);
      }
    }
    if (urls.length) {
      contextParts.push(`[URLs] ${urls.slice(0, 30).join(" | ")}`);
    }

    // Risk score
    const score = calcScore(checkResults, urls.length, flate.streamsInflated);
    const scoreMeta = scoreLabel(score);

    // Render file info
    if (fileInfoEl) {
      const info = [
        `<div><span class="tag">Datei</span> <span class="wrap">${escapeHtml(file.name)}</span></div>`,
        `<div><span class="tag">Größe</span> ${escapeHtml(formatBytes(file.size))}</div>`,
        `<div><span class="tag">SHA-256</span> <span class="mono wrap">${hash}</span></div>`,
        `<div><span class="tag">PDF-Version</span> ${escapeHtml(pdfVersion)}</div>`,
        `<div><span class="tag">FlateDecode</span> Streams gefunden: <span class="mono">${flate.streamsFound}</span> · entpackt: <span class="mono">${flate.streamsInflated}</span> · Bytes: <span class="mono">${formatBytes(flate.bytesInflated)}</span></div>`,
        (typeof DecompressionStream === "undefined")
          ? `<div><span class="tag">Hinweis</span> Dein Browser unterstützt <span class="kbd">DecompressionStream</span> nicht – FlateDecode kann nicht entpackt werden.</div>`
          : ""
      ].filter(Boolean).join("");
      fileInfoEl.innerHTML = info;
    }

    // Render score
    if (riskScoreEl) {
      riskScoreEl.innerHTML = `<span class="${scoreMeta.cls}">${escapeHtml(scoreMeta.text)}</span>`;
    }

    // Render indicators table
    if (indicatorsTbody) {
      indicatorsTbody.innerHTML = checkResults.map((r) => {
        const pill = r.hit ? `<span class="pill bad">FOUND</span>` : `<span class="pill ok">OK</span>`;
        const note = r.hit
          ? `Treffer: ${r.count} · Gewicht: ${r.weight}`
          : `Kein Treffer · Gewicht: ${r.weight}`;
        return `<tr>
          <td>${escapeHtml(r.label)}</td>
          <td>${pill}</td>
          <td class="muted">${escapeHtml(r.hint)}<div class="muted" style="margin-top:4px">${escapeHtml(note)}</div></td>
        </tr>`;
      }).join("");
    }

    // Render URLs
    if (urlsEl) {
      if (urls.length === 0) {
        urlsEl.innerHTML = `<div class="muted">Keine URLs oder Mailto-Links gefunden.</div>`;
      } else {
        urlsEl.innerHTML = urls.map((u) => {
          const href = u.startsWith("www.") ? `https://${u}` : u;
          return `<a class="wrap" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(u)}</a>`;
        }).join("");
      }
    }

    // Render context
    if (contextEl) {
      if (contextParts.length === 0) {
        contextEl.textContent =
          "Keine Roh-Treffer gefunden.\n\n" +
          "Hinweis: Viele Inhalte liegen in komprimierten Streams. " +
          "Wenn FlateDecode-Entpackung aktiv ist und trotzdem nichts erscheint, kann es sein, dass Inhalte anders kodiert sind (z. B. andere Filter, Objektströme oder Font-Glyph-Mapping).";
      } else {
        contextEl.textContent = contextParts.slice(0, 80).join("\n\n");
      }
    }

    currentResult = {
      meta: {
        name: file.name,
        sizeBytes: file.size,
        sha256: hash,
        pdfVersion,
        flate: {
          streamsFound: flate.streamsFound,
          streamsInflated: flate.streamsInflated,
          bytesInflated: flate.bytesInflated,
          decompressionStreamAvailable: typeof DecompressionStream !== "undefined"
        }
      },
      score: { value: score, label: scoreMeta.text },
      indicators: checkResults,
      urls
    };

    setButtonsEnabled(true);
  }

  function resetAll() {
    currentFile = null;
    currentResult = null;
    if (fileInput) fileInput.value = "";
    clearOutput();
    setButtonsEnabled(false);
  }

  // =========================================================
  // Downloads (JSON / CSV / Original PDF)
  // =========================================================
  function buildCsv(result) {
    const lines = [];
    lines.push(["section", "key", "value"].join(","));
    lines.push(["meta", "file", JSON.stringify(result.meta.name)].join(","));
    lines.push(["meta", "sha256", JSON.stringify(result.meta.sha256)].join(","));
    lines.push(["meta", "sizeBytes", String(result.meta.sizeBytes)].join(","));
    lines.push(["meta", "pdfVersion", JSON.stringify(result.meta.pdfVersion)].join(","));
    lines.push(["meta", "flateStreamsFound", String(result.meta.flate.streamsFound)].join(","));
    lines.push(["meta", "flateStreamsInflated", String(result.meta.flate.streamsInflated)].join(","));
    lines.push(["meta", "flateBytesInflated", String(result.meta.flate.bytesInflated)].join(","));
    lines.push(["score", "value", String(result.score.value)].join(","));
    lines.push(["score", "label", JSON.stringify(result.score.label)].join(","));

    lines.push("");
    lines.push(["indicator", "label", "hit", "count", "weight"].join(","));
    for (const i of result.indicators) {
      lines.push([
        "indicator",
        JSON.stringify(i.label),
        i.hit ? "true" : "false",
        String(i.count),
        String(i.weight)
      ].join(","));
    }

    lines.push("");
    lines.push(["urls", "value"].join(","));
    for (const u of result.urls) lines.push(["url", JSON.stringify(u)].join(","));

    return lines.join("\n");
  }

  if (downloadJsonBtn) {
    downloadJsonBtn.addEventListener("click", () => {
      if (!currentResult) return;
      const blob = new Blob([JSON.stringify(currentResult, null, 2)], { type: "application/json" });
      downloadBlob(blob, "pdf-quickcheck-result.json");
    });
  }

  if (downloadCsvBtn) {
    downloadCsvBtn.addEventListener("click", () => {
      if (!currentResult) return;
      const csv = buildCsv(currentResult);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      downloadBlob(blob, "pdf-quickcheck-result.csv");
    });
  }

  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener("click", () => {
      if (!currentFile) return;
      downloadBlob(currentFile, currentFile.name || "document.pdf");
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", resetAll);
  }

  // =========================================================
  // Dropzone / Input
  // =========================================================
  if (chooseBtn && fileInput) {
    chooseBtn.addEventListener("click", () => fileInput.click());
  }

  if (fileInput) {
    fileInput.addEventListener("change", async () => {
      const f = fileInput.files && fileInput.files[0];
      if (!f) return;
      await analyzeFile(f);
    });
  }

  if (drop) {
    // Visual drag state
    ["dragenter", "dragover"].forEach((evt) => {
      drop.addEventListener(evt, (e) => {
        e.preventDefault();
        drop.classList.add("drag");
      });
    });
    ["dragleave", "drop"].forEach((evt) => {
      drop.addEventListener(evt, (e) => {
        e.preventDefault();
        drop.classList.remove("drag");
      });
    });

    // Drop handler
    drop.addEventListener("drop", async (e) => {
      e.preventDefault();
      const dt = e.dataTransfer;
      if (!dt || !dt.files || dt.files.length === 0) return;
      const f = dt.files[0];
      if (!f) return;
      if (fileInput) fileInput.files = dt.files; // best-effort
      await analyzeFile(f);
    });

    // Keyboard: Enter/Space to open picker
    drop.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (fileInput) fileInput.click();
      }
    });
  }

  // Initial state
  resetAll();
})();
