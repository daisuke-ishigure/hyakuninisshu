/* 語句・文法の対話パネル：GRAMMAR_DATA を読み込み、原文（縦書き）の語をタップすると解説パネル（横書き）を更新する */
(function () {
  const data = window.GRAMMAR_DATA && window.GRAMMAR_DATA[window.POEM_NUM];
  const poemEl = document.getElementById("grammarPoem");
  const panelEl = document.getElementById("grammarPanel");
  if (!data || !poemEl || !panelEl) return;

  data.parts.forEach((part) => {
    const partEl = document.createElement("div");
    partEl.className = "gp-part";
    partEl.setAttribute("aria-label", part.label);
    part.phrases.forEach((phrase) => {
      const phraseEl = document.createElement("span");
      phraseEl.className = "gp-phrase";
      phrase.forEach((wordIdx) => {
        const w = data.words[wordIdx];
        const span = document.createElement("span");
        span.className = "gw";
        span.textContent = w.text;
        span.dataset.widx = String(wordIdx);
        span.tabIndex = 0;
        span.setAttribute("role", "button");
        phraseEl.appendChild(span);
      });
      partEl.appendChild(phraseEl);
    });
    poemEl.appendChild(partEl);
  });

  function renderPanel(w) {
    let tableHtml = "";
    let katsuyouLabel = "";
    let hasTable = false;
    if (w.paradigm && window.KATSUYOU_PARADIGMS[w.paradigm]) {
      hasTable = true;
      const p = window.KATSUYOU_PARADIGMS[w.paradigm];
      const currentIdx = window.KATSUYOU_FORM_NAMES.indexOf(w.form);
      let rows = "";
      p.forms.forEach((f, i) => {
        const cls = i === currentIdx ? ' class="gp-current"' : "";
        const variants = f.split(",");
        const cell = variants.length > 1
          ? `<div class="gp-form-multi">${variants.map((v) => `<span>${v}</span>`).join("")}</div>`
          : f;
        rows += `<tr${cls}><td>${cell}</td><th>${window.KATSUYOU_FORM_NAMES[i]}</th></tr>`;
      });
      tableHtml = `<table class="gp-katsuyou-table">${rows}</table>`;
      katsuyouLabel = `<p class="gp-katsuyou-label">活用表：<b>${p.label}</b></p>`;
    }
    const typeForm = w.type || w.form
      ? `<p class="gp-typeform">${[w.type, w.form].filter(Boolean).join("・")}</p>`
      : "";
    const imgHtml = w.img
      ? `<figure class="gp-figure">
          <img class="gp-img" src="${w.img}" alt="${w.imgAlt || w.text}" loading="lazy">
          ${w.imgCaption ? `<figcaption class="gp-img-caption">${w.imgCaption}</figcaption>` : ""}
        </figure>`
      : "";
    panelEl.innerHTML = `
      <div class="gp-body${hasTable ? " has-table" : ""}">
        ${hasTable ? `<div class="gp-katsuyou">${tableHtml}</div>` : ""}
        <div class="gp-right">
          <div class="gp-head">
            <span class="gp-word">${w.text}</span>
            <span class="gp-pos">${w.pos}</span>
          </div>
          ${typeForm}
          ${katsuyouLabel}
          ${imgHtml}
          <p class="gp-note">${w.note}</p>
        </div>
      </div>`;
  }

  function selectWord(idx) {
    poemEl.querySelectorAll(".gw").forEach((el) => el.classList.remove("active"));
    const target = poemEl.querySelector(`.gw[data-widx="${idx}"]`);
    if (target) target.classList.add("active");
    renderPanel(data.words[idx]);
  }

  poemEl.addEventListener("click", (e) => {
    const target = e.target.closest(".gw");
    if (!target) return;
    selectWord(Number(target.dataset.widx));
  });
  poemEl.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("gw")) {
      e.preventDefault();
      selectWord(Number(e.target.dataset.widx));
    }
  });

  selectWord(0);
})();
