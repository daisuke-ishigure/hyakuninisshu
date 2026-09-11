(function () {
  /* ── KarutaAuth init + game-finish handler ── */
  if (window.KarutaAuth) {
    window.KarutaAuth.renderAuthArea('karuta-auth-area', 'en');
    window.KarutaAuth.renderLeaderboard('karuta-leaderboard-area', 'en', 'gameScore_karuta', 'Karuta Game Ranking TOP 10');
  }

  document.addEventListener('karutaEnGameFinished', function (e) {
    const { finalScore, totalCards, mistakeCount } = e.detail;
    const pts = Math.max(totalCards, Math.round(totalCards * 200 - finalScore * 10));

    const saveDiv = document.createElement('div');
    saveDiv.id = 'karuta-save-result';
    saveDiv.style.maxWidth = '400px';
    saveDiv.style.margin   = '0 auto';
    const resultEl = document.getElementById('result_text');
    if (resultEl) resultEl.appendChild(saveDiv);

    if (window.KarutaAuth) {
      window.KarutaAuth.renderSaveResult('karuta-save-result', {
        totalScore:     pts,
        correctAnswers: totalCards - mistakeCount,
        totalQuestions: totalCards,
        color:          'karuta',
        lang:           'en',
        skipCumulative: true
      });
    }
  });
})();

(function () {
  'use strict';

  /* ── Combo patch ── */
  let combo = 0;

  function getComboTitle(c) {
    if (c === 15) return 'Godlike!';
    if (c === 10) return 'Magnificent!';
    if (c ===  5) return 'Impressive!';
    if (c ===  3) return 'Well done!';
    return null;
  }

  function ensureHUD() {
    if (document.getElementById('combo-display')) return;
    const hud = document.createElement('div');
    hud.id = 'combo-display';
    hud.innerHTML =
      '<span id="combo-count"></span>' +
      '<span id="combo-label"></span>' +
      '<span id="combo-multiplier"></span>' +
      '<span id="combo-title"></span>';
    const anchor = document.getElementById('operatin_area');
    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(hud, anchor.nextSibling);
    }
  }

  function updateComboHUD(bounce) {
    const countEl = document.getElementById('combo-count');
    const labelEl = document.getElementById('combo-label');
    const multEl  = document.getElementById('combo-multiplier');
    if (!countEl) return;
    if (combo <= 0) {
      countEl.textContent = '';
      if (labelEl) labelEl.textContent = '';
      if (multEl)  multEl.textContent  = '';
      return;
    }
    countEl.textContent = combo + ' in a row!';
    if (labelEl) labelEl.textContent = '';
    if (multEl)  multEl.textContent  = '';
    if (bounce) {
      countEl.classList.remove('bounce');
      void countEl.offsetWidth;
      countEl.classList.add('bounce');
    }
  }

  function showComboTitle(text) {
    const el = document.getElementById('combo-title');
    if (!el) return;
    el.textContent = text;
    el.classList.remove('show');
    void el.offsetWidth;
    el.classList.add('show');
  }

  function showComboBreak(lost) {
    const old = document.getElementById('combo-break-overlay');
    if (old) old.remove();
    const overlay = document.createElement('div');
    overlay.id = 'combo-break-overlay';
    overlay.innerHTML =
      '<div id="combo-break-text">Combo\nBroken!</div>' +
      '<div id="combo-break-lost">' + lost + '-card streak lost</div>';
    document.body.appendChild(overlay);
    setTimeout(function () {
      overlay.classList.add('fade-out');
      setTimeout(function () { overlay.remove(); }, 350);
    }, 650);
  }

  function resetCombo() {
    combo = 0;
    updateComboHUD(false);
  }

  function applyPatch() {
    const container = document.getElementById('karuta_container');
    if (!container) return;

    ensureHUD();

    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mut) {
        if (mut.type !== 'attributes' || mut.attributeName !== 'class') return;
        const el = mut.target;
        if (!el.classList.contains('karuta_card')) return;

        if (el.classList.contains('correct-pop') && !el.dataset.comboHandled) {
          el.dataset.comboHandled = '1';
          combo++;
          updateComboHUD(true);
          const title = getComboTitle(combo);
          if (title) showComboTitle(title);
        }

        if (el.classList.contains('wrong-flash') && !el.dataset.comboFaulted) {
          el.dataset.comboFaulted = '1';
          if (combo >= 1) showComboBreak(combo);
          combo = 0;
          updateComboHUD(false);
        }
      });
    });

    observer.observe(container, {
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });

    const containerObserver = new MutationObserver(function (mutations) {
      const hasAddedCards = mutations.some(function (m) {
        return Array.from(m.addedNodes).some(function (n) {
          return n.nodeType === 1 && n.classList && n.classList.contains('karuta_card');
        });
      });
      if (hasAddedCards) resetCombo();
    });

    containerObserver.observe(container, { childList: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(applyPatch, 0);
    });
  } else {
    setTimeout(applyPatch, 0);
  }
})();
