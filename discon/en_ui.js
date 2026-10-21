/**
 * en_ui.js
 * Replaces all common Japanese UI strings with English equivalents.
 * Include this file in every _en.html page.
 * No changes needed to individual HTML files for UI text.
 */
document.addEventListener('DOMContentLoaded', function () {

  // ── Helper ──────────────────────────────────────────────
  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }
  function setHTML(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }
  function setAttr(id, attr, val) {
    const el = document.getElementById(id);
    if (el) el.setAttribute(attr, val);
  }

  // ── Theme selector ───────────────────────────────────────
  const themeLabel = document.getElementById('themeSelector-label');
  if (themeLabel) themeLabel.textContent = 'Theme:';

  const themeMap = {
    'テーマを選ぶ': 'Select a theme',
    '春': 'Spring',
    '夏': 'Summer',
    '秋': 'Autumn',
    '冬': 'Winter',
    '恋': 'Love',
    '旅': 'Travel',
    '別離': 'Parting',
    '雑': 'Miscellaneous',
  };
  const themeSelector = document.getElementById('themeSelector');
  if (themeSelector) {
    Array.from(themeSelector.options).forEach(opt => {
      if (themeMap[opt.text]) opt.text = themeMap[opt.text];
    });
  }

  // ── Poet selector ────────────────────────────────────────
  const poetLabel = document.getElementById('jsonSelector-label');
  if (poetLabel) poetLabel.textContent = 'Poet:';

  // ── Audio credit ─────────────────────────────────────────
  setHTML('audio-credit',
    'Audio: NHK Creative Library<br><small>* Audio may not play in silent mode.</small>');

  // ── Card toggle ──────────────────────────────────────────
  const toggle2label = document.getElementById('toggle2-label');
  if (toggle2label) toggle2label.textContent = 'Card type:';

  // Yomifuda / Torifuda labels (sibling <p> tags in .checkbox1)
  const checkbox1 = document.querySelector('.checkbox1');
  if (checkbox1) {
    const ps = checkbox1.querySelectorAll('div:first-child p');
    if (ps[0]) ps[0].textContent = 'Yomifuda';
    if (ps[1]) ps[1].textContent = 'Torifuda';
    const audioPs = checkbox1.querySelectorAll('div:last-child p');
    if (audioPs[0]) audioPs[0].textContent = 'Japanese';
  }

  // ── Kimariji label ───────────────────────────────────────
  // (the kimariji text is poem-specific so left as-is)

  // ── Bottom navigation ────────────────────────────────────
  setText('next2_arrow', 'Next poem →');
  setText('back2_arrow', '← Previous poem');

  // ── Page top ─────────────────────────────────────────────
  const pageTop = document.getElementById('page-top');
  if (pageTop) {
    const a = pageTop.querySelector('a');
    if (a) a.textContent = 'Back to top';
  }

  // ── Poem number label ────────────────────────────────────
  // e.g. "1番歌" → "Poem No. 1"
  const utabangou = document.getElementById('utabangou');
  if (utabangou) {
    utabangou.textContent = utabangou.textContent
      .replace(/(\d+)番歌/, 'Poem No. $1');
  }

  // ── Explanation section DT labels ────────────────────────
  const dtMap = {
    '現代語訳': 'Modern Translation',
    '解説': 'Commentary',
    'どんな人？': 'Who Was This Poet?',
    '語句・豆知識': 'Vocabulary & Notes',
    '句切れ': 'Caesura',
    '修辞法': 'Rhetorical Devices',
    '出典': 'Source',
  };
  document.querySelectorAll('.explanation dt, .words dt.title').forEach(dt => {
    const trimmed = dt.textContent.trim();
    if (dtMap[trimmed]) dt.textContent = dtMap[trimmed];
  });

  // ── Author / source line inside dd ───────────────────────
  // "作者：" → "Poet: "  /  "出典：" → "Source: "
  document.querySelectorAll('.explanation dd .small, .words dd .small').forEach(el => {
    el.innerHTML = el.innerHTML
      .replace('作者：', 'Poet: ')
      .replace('出典：', 'Source: ');
  });

  // ── Quote headings (原文 / 現代語訳) ─────────────────────
  document.querySelectorAll('q h4').forEach(h4 => {
    if (h4.textContent === '原文') h4.textContent = 'Original Text';
    if (h4.textContent === '現代語訳') h4.textContent = 'Translation';
    if (h4.textContent === '書き下し文') h4.textContent = 'Classical Japanese Text';
  });

  // ── Accordion toggle hint ─────────────────────────────────
  document.querySelectorAll('.accordion-header').forEach(h => {
    h.innerHTML = h.innerHTML
      .replace('（クリックで開閉します。）', '(Click to expand/collapse)');
  });

  // ── Figcaption date strings ───────────────────────────────
  document.querySelectorAll('figcaption small').forEach(el => {
    el.textContent = el.textContent
      .replace(/（撮影日：(\d+)年(\d+)月(\d+)日）/, '(Photo: $1/$2/$3)')
      .replace(/（撮影日：(.+?)、場所：(.+?)）/, '(Photo: $1; Location: $2)');
  });

  // ── "詳細を見る →" style links ───────────────────────────
  document.querySelectorAll('a').forEach(a => {
    if (a.textContent.trim() === '詳細を見る →') a.textContent = 'View details →';
    if (a.textContent.trim() === '地図へのリンク') a.textContent = 'View on map';
  });

});