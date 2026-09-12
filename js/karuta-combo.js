(function () {
      'use strict';

      /* ── コンボ + スコア状態 ── */
      let combo = 0;
      let totalScore = 0;
      let correctCount = 0;
      let _gameTotalCards = 0;
      let maxCombo = 0;
      let speedCounts = { fast: 0, medium: 0, normal: 0, slow: 0 };
      let comboBonus = 0;
      let speedBonus = 0;

      /* ── コンボ倍率（kimariji.html と同一仕様） ── */
      function getComboMultiplier(c) {
        if (c >= 10) return 2.0;
        if (c >= 5) return 1.5;
        if (c >= 3) return 1.25;
        return 1.0;
      }

      /* ── スピード倍率（早取りボーナス） ── */
      function getSpeedMultiplier(ms) {
        if (ms < 2000) return 2.0;
        if (ms < 5000) return 1.5;
        if (ms < 10000) return 1.25;
        return 1.0;
      }

      /* ── 称号メッセージ ── */
      function getComboTitle(c) {
        if (c === 15) return '神のごとし';
        if (c === 10) return 'いとめでたし';
        if (c === 5) return 'あはれ、みごとなり';
        if (c === 3) return 'おみごと';
        return null;
      }

      /* ── HUD を #operatin_area の直後に挿入 ── */
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

      /* ── HUD 更新 ── */
      function updateComboHUD(bounce) {
        const countEl = document.getElementById('combo-count');
        const labelEl = document.getElementById('combo-label');
        const multEl = document.getElementById('combo-multiplier');
        if (!countEl) return;
        if (combo <= 0) {
          countEl.textContent = '';
          if (labelEl) labelEl.textContent = totalScore > 0 ? 'Score: ' + totalScore : '';
          if (multEl) multEl.textContent = '';
          return;
        }
        const mult = getComboMultiplier(combo);
        countEl.textContent = combo + ' 連続正解';
        if (labelEl) labelEl.textContent = 'Score: ' + totalScore;
        if (multEl) multEl.textContent = mult > 1.0 ? '\xd7' + mult.toFixed(2) : '';
        if (bounce) {
          countEl.classList.remove('bounce');
          void countEl.offsetWidth;
          countEl.classList.add('bounce');
        }
      }

      /* ── 称号フラッシュ ── */
      function showComboTitle(text) {
        const el = document.getElementById('combo-title');
        if (!el) return;
        el.textContent = text;
        el.classList.remove('show');
        void el.offsetWidth;
        el.classList.add('show');
      }

      /* ── コンボブレイク演出 ── */
      function showComboBreak(lost) {
        const old = document.getElementById('combo-break-overlay');
        if (old) old.remove();
        const overlay = document.createElement('div');
        overlay.id = 'combo-break-overlay';
        overlay.innerHTML =
          '<div id="combo-break-text">連続正解\n途絶えたり…</div>' +
          '<div id="combo-break-lost">' + lost + '連続、消えました</div>';
        document.body.appendChild(overlay);
        setTimeout(function () {
          overlay.classList.add('fade-out');
          setTimeout(function () { overlay.remove(); }, 350);
        }, 650);
      }

      /* ── スコアフロート ── */
      function spawnScoreFloat(el, pts, label) {
        const rect = el.getBoundingClientRect();
        const floatEl = document.createElement('span');
        floatEl.className = 'score-float';
        floatEl.textContent = label ? '+' + pts + ' ' + label : '+' + pts;
        floatEl.style.left = (rect.left + rect.width / 2 - 40) + 'px';
        floatEl.style.top = (rect.top - 10) + 'px';
        document.body.appendChild(floatEl);
        setTimeout(function () { floatEl.remove(); }, 950);
      }

      /* ── リセット（ゲーム開始・リプレイ時） ── */
      function resetCombo() {
        combo = 0;
        totalScore = 0;
        correctCount = 0;
        maxCombo = 0;
        speedCounts = { fast: 0, medium: 0, normal: 0, slow: 0 };
        comboBonus = 0;
        speedBonus = 0;
        updateComboHUD(false);
      }

      /* ── ゲーム終了時：スコア表示 + Firebase 保存 ── */
      function injectScoreDisplay(resultEl) {
        if (document.getElementById('karuta-score-display')) return;

        const baseScore = correctCount * 100;

        /* TOTAL SCORE ボックス */
        const scoreDiv = document.createElement('div');
        scoreDiv.id = 'karuta-score-display';
        scoreDiv.style.textAlign = 'center';
        scoreDiv.innerHTML =
          '<div style="margin:16px auto 12px;padding:14px 24px;' +
          'background:linear-gradient(135deg,#fdf8e8,#f5ead0);' +
          'border:2px solid #D4AF37;border-radius:12px;' +
          'display:inline-block;min-width:220px;">' +
          '<div style="font-size:0.8rem;color:#888;letter-spacing:0.08em;margin-bottom:4px;">TOTAL SCORE</div>' +
          '<div style="font-size:2.6rem;font-weight:900;color:#B82343;' +
          'font-family:\'Noto Sans JP\',sans-serif;line-height:1;">' +
          totalScore.toLocaleString() +
          '</div>' +
          '<div style="font-size:0.75rem;color:#aaa;margin-top:4px;">' +
          '正解: ' + correctCount + ' / ' + _gameTotalCards + ' 枚' +
          '</div>' +
          '</div>';

        const firstChild = resultEl.firstElementChild;
        if (firstChild && firstChild.nextSibling) {
          resultEl.insertBefore(scoreDiv, firstChild.nextSibling);
        } else {
          resultEl.appendChild(scoreDiv);
        }

        /* スコア内訳 */
        var bdRows =
          '<tr>' +
          '<td style="padding:3px 10px;color:#666;">ベーススコア</td>' +
          '<td style="padding:3px 10px;text-align:right;color:#333;">' + baseScore.toLocaleString() + ' pt</td>' +
          '<td style="padding:3px 6px;font-size:0.7rem;color:#bbb;">100pt \xd7 ' + correctCount + ' 枚</td>' +
          '</tr>' +
          (comboBonus > 0
            ? '<tr>' +
            '<td style="padding:3px 10px;color:#666;">コンボボーナス</td>' +
            '<td style="padding:3px 10px;text-align:right;color:#e07020;font-weight:bold;">+' + comboBonus.toLocaleString() + ' pt</td>' +
            '<td></td>' +
            '</tr>'
            : '') +
          (speedBonus > 0
            ? '<tr>' +
            '<td style="padding:3px 10px;color:#666;">タイムボーナス</td>' +
            '<td style="padding:3px 10px;text-align:right;color:#2080c0;font-weight:bold;">+' + speedBonus.toLocaleString() + ' pt</td>' +
            '<td></td>' +
            '</tr>'
            : '');
        var spRows =
          (speedCounts.fast > 0 ? '<tr><td style="padding:2px 10px;color:#888;">⚡ 2秒以内</td><td style="padding:2px 10px;text-align:right;">' + speedCounts.fast + ' 枚</td></tr>' : '') +
          (speedCounts.medium > 0 ? '<tr><td style="padding:2px 10px;color:#888;">2〜5秒</td><td style="padding:2px 10px;text-align:right;">' + speedCounts.medium + ' 枚</td></tr>' : '') +
          (speedCounts.normal > 0 ? '<tr><td style="padding:2px 10px;color:#888;">5〜10秒</td><td style="padding:2px 10px;text-align:right;">' + speedCounts.normal + ' 枚</td></tr>' : '') +
          (speedCounts.slow > 0 ? '<tr><td style="padding:2px 10px;color:#888;">10秒以上</td><td style="padding:2px 10px;text-align:right;">' + speedCounts.slow + ' 枚</td></tr>' : '');

        const breakdownDiv = document.createElement('div');
        breakdownDiv.id = 'karuta-score-breakdown';
        breakdownDiv.style.cssText =
          'max-width:340px;margin:0 auto 16px;padding:10px 6px 6px;' +
          'background:#fafaf5;border:1px solid #e8e0c8;border-radius:8px;' +
          'font-family:\'Noto Sans JP\',sans-serif;font-size:0.82rem;color:#444;';
        breakdownDiv.innerHTML =
          '<div style="font-size:0.68rem;font-weight:bold;color:#aaa;letter-spacing:0.12em;' +
          'text-align:center;margin-bottom:8px;">スコア内訳</div>' +
          '<table style="width:100%;border-collapse:collapse;line-height:1.8;">' + bdRows + '</table>' +
          '<div style="border-top:1px solid #e0d8c0;margin:8px 4px;"></div>' +
          '<table style="width:100%;border-collapse:collapse;">' + spRows +
          '<tr><td style="padding:2px 10px;color:#888;">最大コンボ</td>' +
          '<td style="padding:2px 10px;text-align:right;">' + maxCombo + ' 連続</td></tr>' +
          '</table>' +
          '<details style="margin-top:10px;">' +
          '<summary style="font-size:0.72rem;color:#bbb;text-align:center;cursor:pointer;' +
          'list-style:none;-webkit-appearance:none;user-select:none;">' +
          '計算方法 ▸' +
          '</summary>' +
          '<div style="margin-top:8px;font-size:0.75rem;color:#666;line-height:2;">' +
          '<div style="font-weight:bold;color:#e07020;margin-bottom:2px;">コンボボーナス</div>' +
          '<table style="width:100%;border-collapse:collapse;font-size:0.72rem;">' +
          '<tr><td style="padding:1px 10px;color:#888;">3連続以上</td><td style="text-align:right;">\xd71.25</td></tr>' +
          '<tr><td style="padding:1px 10px;color:#888;">5連続以上</td><td style="text-align:right;">\xd71.50</td></tr>' +
          '<tr><td style="padding:1px 10px;color:#888;">10連続以上</td><td style="text-align:right;">\xd72.00</td></tr>' +
          '</table>' +
          '<div style="font-weight:bold;color:#2080c0;margin:8px 0 2px;">タイムボーナス（読み上げ開始からの時間）</div>' +
          '<table style="width:100%;border-collapse:collapse;font-size:0.72rem;">' +
          '<tr><td style="padding:1px 10px;color:#888;">2秒以内</td><td style="text-align:right;">\xd72.00</td></tr>' +
          '<tr><td style="padding:1px 10px;color:#888;">2〜5秒</td><td style="text-align:right;">\xd71.50</td></tr>' +
          '<tr><td style="padding:1px 10px;color:#888;">5〜10秒</td><td style="text-align:right;">\xd71.25</td></tr>' +
          '<tr><td style="padding:1px 10px;color:#888;">10秒以上</td><td style="text-align:right;">\xd71.00</td></tr>' +
          '</table>' +
          '<div style="margin-top:8px;padding:6px 8px;background:#f0ebe0;border-radius:4px;' +
          'font-size:0.7rem;color:#888;text-align:center;">' +
          '1枚のスコア = 100pt \xd7 コンボ倍率 \xd7 タイム倍率' +
          '</div>' +
          '</div>' +
          '</details>';

        scoreDiv.insertAdjacentElement('afterend', breakdownDiv);

        const saveDiv = document.createElement('div');
        saveDiv.id = 'karuta-save-result';
        saveDiv.style.maxWidth = '400px';
        saveDiv.style.margin = '0 auto';
        resultEl.appendChild(saveDiv);

        if (window.KarutaAuth) {
          window.KarutaAuth.renderSaveResult('karuta-save-result', {
            totalScore: totalScore,
            correctAnswers: correctCount,
            totalQuestions: _gameTotalCards,
            color: 'karuta',
            lang: 'ja',
            skipCumulative: true
          });
        }
      }

      function applyPatch() {
        const container = document.getElementById('karuta_container');
        if (!container) return;

        ensureHUD();

        /* 認証エリア + ランキング（ゲーム開始前に表示） */
        if (window.KarutaAuth) {
          window.KarutaAuth.renderAuthArea('karuta-auth-area', 'ja');
          window.KarutaAuth.renderLeaderboard('karuta-leaderboard-area', 'ja', 'gameScore_karuta', 'かるたゲーム ランキング TOP 10');
        }

        /* ゲーム開始時に枚数をキャプチャ */
        var startBtn = document.getElementById('start_button');
        if (startBtn) {
          startBtn.addEventListener('click', function () {
            var sel = document.getElementById('cardCountSelector');
            _gameTotalCards = sel ? parseInt(sel.value, 10) || 0 : 0;
          }, true);
        }

        /* MutationObserver でカードの class 変化を監視 */
        const observer = new MutationObserver(function (mutations) {
          try {
            mutations.forEach(function (mut) {
              if (mut.type !== 'attributes' || mut.attributeName !== 'class') return;
              const el = mut.target;
              if (!el.classList.contains('karuta_card')) return;

              /* ─ 正解: correct-pop ─ */
              if (el.classList.contains('correct-pop') && !el.dataset.comboHandled) {
                el.dataset.comboHandled = '1';
                combo++;
                correctCount++;
                if (combo > maxCombo) maxCombo = combo;
                const comboMult = getComboMultiplier(combo);
                const speedMs = window._karutaCardStartTime ? Date.now() - window._karutaCardStartTime : 99999;
                const speedMult = getSpeedMultiplier(speedMs);
                if (speedMult >= 2.0) speedCounts.fast++;
                else if (speedMult >= 1.5) speedCounts.medium++;
                else if (speedMult >= 1.25) speedCounts.normal++;
                else speedCounts.slow++;
                const totalMult = comboMult * speedMult;
                const comboGained = Math.round(100 * comboMult);
                const gained = Math.round(100 * totalMult);
                comboBonus += comboGained - 100;
                speedBonus += gained - comboGained;
                totalScore += gained;
                updateComboHUD(true);
                var floatLabel = totalMult > 1.0
                  ? (speedMult > 1.0 ? '⚡\xd7' : '\xd7') + totalMult.toFixed(2)
                  : null;
                spawnScoreFloat(el, gained, floatLabel);
                const title = getComboTitle(combo);
                if (title) showComboTitle(title);
              }

              /* ─ お手付き: wrong-flash ─ */
              if (el.classList.contains('wrong-flash') && !el.dataset.comboFaulted) {
                el.dataset.comboFaulted = '1';
                if (combo >= 1) showComboBreak(combo);
                combo = 0;
                updateComboHUD(false);
              }
            });
          } catch (e) { console.warn('[combo patch]', e); }
        });

        observer.observe(container, {
          subtree: true, attributes: true, attributeFilter: ['class']
        });

        /* カード再配置時にリセット */
        const containerObserver = new MutationObserver(function (mutations) {
          const hasAddedCards = mutations.some(function (m) {
            return Array.from(m.addedNodes).some(function (n) {
              return n.nodeType === 1 && n.classList && n.classList.contains('karuta_card');
            });
          });
          if (hasAddedCards) resetCombo();
        });
        containerObserver.observe(container, { childList: true });

        /* finishGame をラップしてスコア表示を注入 */
        if (typeof window.finishGame === 'function') {
          var _origFinishGame = window.finishGame;
          window.finishGame = function () {
            _origFinishGame.apply(this, arguments);
            var resultEl = document.getElementById('result_text');
            if (resultEl) setTimeout(function () { injectScoreDisplay(resultEl); }, 50);
          };
        }
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { setTimeout(applyPatch, 0); });
      } else {
        setTimeout(applyPatch, 0);
      }
    })();
