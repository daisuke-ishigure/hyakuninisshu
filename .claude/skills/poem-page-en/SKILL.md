---
name: poem-page-en
description: Conventions for the English poem pages (N_en.html, 1–100) — translating content from the Japanese page N.html, keeping the explanation box free of a scrollbar, appendix/family tree/timeline format, and the CSS/JS the English pages share. Use whenever creating, translating, or editing any N_en.html, or when adding content from N.html to its English version.
---

# English poem pages (N_en.html)

Each `N_en.html` is the English version of `N.html`. Content is **translated from the Japanese page**, never invented: do not add facts that are not on the JA page. If a fact on the JA page needs checking, use only ja.wikipedia.org and kotobank.jp. If the JA page looks wrong (typo, contradicting another page), translate it as written and tell the user instead of silently "fixing" it.

## Writing style

- **Plain English** for a general reader who knows nothing about Japanese history. Short sentences, common words; explain Japanese terms in a few words the first time (e.g. "*honkadori*, borrowing from an older poem").
- Romanize with macrons (Ōtsu, Jitō, Man'yōshū). Emperors: "Emperor Tenji", women rulers "Empress Jitō". Princes: "Prince Ōama".
- Siblings: write "younger brother" / "elder sister" etc. when the JA text says so; don't guess.

## The explanation box (`.explanation`): no scrollbar on PC

On PC (≥1001px) `.explanation` is exactly as tall as the card column (≈880px) and scrolls if its content is longer. **The page should not need that scrollbar.**

- Write **Commentary** and **About the Poet** as short as possible: translate the JA 解説 / どんな人？ concisely, keeping the key points and dropping padding, repetition, and side details. Aim for roughly 40–70 words each; the poem, verse translation and modern translation above them take most of the box.
- Headnotes (詞書): quote briefly, or summarize in one clause, rather than quoting the whole headnote and then paraphrasing it.
- After editing, **check that nothing overflows**: open the page at 1280px wide and compare `.explanation`'s `scrollHeight` with its `clientHeight` (they must be equal). Shorten further if it still overflows.

## Labels and formats

- Section titles on the page: "Poem N", "English Verse Translation", "Modern Translation", "Commentary", "About the Poet", "Poem Illustration", "<Poet>: A Short Timeline", "<Poet>'s Family Tree", "Appendix", "Links".
- Quoted poems in the appendix: the label above the Japanese text is **"In Japanese"**, above the translation **"In English"** (never "Original"). Keep the Japanese text with its `<ruby>`; put the source in `<span class="shutten">` as `<em>Collection</em>, Author`. The `<q>` holding the Japanese text gets `class="quote-ja"` (makes it bold via `poems_en.css`): `<q class="quote-ja"><h3 class="was-h4">In Japanese</h3>…`.
- Short timeline (`.nenpyo-section`, translated from the JA 略年表): years as plain numbers; 「〇〇年頃」→ `c. 708`; 「不明」→ `Unknown`; 「以前／以降」→ `Before 1025` / `After 1000`; 「備考」→ `Notes` with a `<ul>`. Thirty-Six / Six Immortal Poets notes are plain text (no EN pages to link to).
- Appendix accordion timeline: `date-is='645 (age 19)'`.
- Links to Wikimedia Commons (image credits) always open in a new tab: `target="_blank" rel="noopener"`.
- Photo dates: "(Photo taken August 15, 2025)". Image `alt`/`data-title` in English; lightbox `data-lightbox` group in romaji (e.g. `jito`).
- JA tooltip spans (`<span class="tippy …">`) have no English tooltips: drop the span and explain the term inline if needed.
- Don't add: the grammar panel (品詞分解と文法), links to pages that have no English version (check the file exists, e.g. `kakekotoba-game-00N_en.html`, `mubeyama-sugoroku` has none), or the bottom prev/next arrows (removed site-wide).

## Family tree (相関図)

Copy the JA chart data (`<div class="kd-chart">` JSON) into the EN page, add `"lang": "en"`, and widen the x positions for the longer English names. Names and tooltips come from `js/keizu-tips_en.js` (`KD_TIPS_EN`, keyed by the Japanese `n`) — add any missing people there (translate the tooltip that the JA page shows). Then run `node _tools/build-keizu.mjs`. Legend/zoom labels in English (see `1_en.html`). Details in CLAUDE.md.

Marriage lines (＝) must always be straight **vertical** lines — no bent `eqs` and no horizontal ＝. When a man has more wives than fit directly above/below him, draw several straight vertical `eqs` (two points each) side by side under his name, shift the nearer wife slightly right, and run the line to the farther wife down past her left edge (see `16.html` / `16_en.html`: Kanmu, Kudara no Nagatsugu, Fujiwara no Tabiko). The one agreed exception is `65.html` (Go-Suzaku ＝ Fujiwara no Genshi, `c-gosuzaku3`), which keeps its bent line; `65_en.html` should copy it as is.

## Shared files and cache busters

- Fonts on English pages: body text **Noto Sans** (set for all `html[lang="en"]` pages in `style.css`), headings Playfair Display, Japanese text falls back to Noto Serif JP. A font change changes text length — re-check the explanation box for overflow afterwards.
- Changes that only affect English pages must not touch the Japanese pages: when such a change is in `style.css`, bump its cache buster only on the `lang="en"` pages.
- English pages share `css/poems_en.css` and `js/poems_en.js`. Put English-only layout/typography fixes there (not in `style.css`) unless the user asks otherwise.
- After editing any CSS/JS, bump its `?YYYYMMDD-NN` on **every** HTML that loads it (`poems_en.js` is also loaded by `index_en.html`).
- Required includes when a page gets an appendix/family tree: `accordion.css`, `timeline.css`, `swiper-bundle.min.css`, `fujiwara-keizu.css`, `lightbox.css` (+ `lightbox.js`), and at the bottom `accordion.js`, swiper init, `popper.min.js`, `tippy.umd.min.js`, `keizu-tips_en.js`, `keizu-diagram.js` (copy the block from `1_en.html` / `2_en.html`).
- Validate tag balance after large edits, and render the page (headless Edge works) to check layout.
