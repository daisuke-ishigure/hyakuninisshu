/* Hyakunin Isshu Relationship Diagram (English)
   Data: network-data_en.json / Style: network-diagram.css */
(async function () {
      const svg = document.getElementById('hyakunin-network');

      // データを外部JSONから読み込む
      let networkConfig;
      try {
        const res = await fetch('js/network-data_en.json?20260719-10');
        if (!res.ok) throw new Error('HTTP ' + res.status);
        networkConfig = await res.json();
      } catch (err) {
        console.error('Failed to load network-data_en.json:', err);
        const msg = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        msg.setAttribute('x', '20'); msg.setAttribute('y', '40');
        msg.setAttribute('font-size', '14'); msg.setAttribute('fill', '#c0392b');
        msg.textContent = 'Failed to load the diagram data (if viewing via file://, please use a local server).';
        svg.appendChild(msg);
        return;
      }

      let poetStates = [...networkConfig.poets];
      let draggingId = null;
      let selectedId = null;
      let dragOffset = { x: 0, y: 0 };
      let dragMoved = false;
      let editMode = false;   // 調整モード（ONのときだけドラッグ可能）

      // 関係線の曲がり量（bend）を調整モードでドラッグ調整するための状態
      let draggingRelIndex = null;
      let relDragMoved = false;

      // ダブルクリックでフォーカスした歌人と、直接つながりのある歌人だけを表示するモード
      let focusedId = null;
      let focusRelatedIds = null;      // Set<id> | null（null=フォーカスなし＝全員表示）
      let focusSnapshot = null;        // フォーカス開始時点の x 座標（Map<id, x>）。余白クリックで復元する
      let pendingClickId = null;       // ダブルクリック判定用（シングルクリックの遅延実行タイマー）
      let pendingClickTimer = null;

      // スマホのピンチ操作（2本指以上）を検知するためのポインター数カウンター。
      // ピンチ操作中に指が触れた場所がノードや余白と判定されて、意図せず
      // フォーカスモードの切替・解除が起きてしまわないようにするために使う。
      let activePointerCount = 0;
      let wasMultiTouch = false; // 2本指以上が同時に触れたことのある一連の操作かどうか（全部の指が離れるまで保持）
      window.addEventListener('pointerdown', () => {
        activePointerCount++;
        if (activePointerCount > 1) wasMultiTouch = true;
      }, { capture: true });
      window.addEventListener('pointerup', () => {
        activePointerCount = Math.max(0, activePointerCount - 1);
        if (activePointerCount === 0) wasMultiTouch = false;
      }, { capture: true });
      window.addEventListener('pointercancel', () => {
        activePointerCount = Math.max(0, activePointerCount - 1);
        if (activePointerCount === 0) wasMultiTouch = false;
      }, { capture: true });

      // フォーカスモード中のピンチイン・ピンチアウト（＋パン）用の状態
      // （タッチのみが対象。CSSの touch-action:none でブラウザ標準のピンチズームを
      //   止めている分、拡大縮小・移動そのものは自前で実装する）
      const activeTouches = new Map(); // pointerId -> {x, y}（クライアント座標）
      let pinchState = null;           // ピンチ開始時点のスナップショット
      let zoomScale = 1;
      let zoomTranslate = { x: 0, y: 0 }; // svg 自身の左上を基準にしたパン量(px)
      const ZOOM_MIN = 1, ZOOM_MAX = 3;

      function resetZoom() {
        zoomScale = 1;
        zoomTranslate = { x: 0, y: 0 };
        pinchState = null;
        activeTouches.clear();
        svg.style.transform = '';
        svg.style.transformOrigin = '';
      }

      function applyZoomTransform() {
        svg.style.transformOrigin = '0 0';
        svg.style.transform = `translate(${zoomTranslate.x}px, ${zoomTranslate.y}px) scale(${zoomScale})`;
      }

      // transform を一時的に外して、レイアウト上の（＝拡大縮小前の）矩形を取得する。
      // CSS の transform はレイアウトに影響しないため、これは常に安定して取れる。
      function getBaseRect() {
        const prevTransform = svg.style.transform;
        svg.style.transform = 'none';
        const rect = svg.getBoundingClientRect();
        svg.style.transform = prevTransform;
        return rect;
      }

      function isVisible(id) {
        return focusRelatedIds === null || focusRelatedIds.has(id);
      }

      const NODE_H   = 36;   // ノードの高さ
      const FONT_SIZE = 13;  // フォントサイズ(px)
      const PAD_X    = 10;   // 左右パディング(px)
      const SVG_W    = 1000; // 図の横幅（viewBox基準）。section幅の拡大に合わせてノードを左右に広げるため800→1000

      // 英語版はラテン文字の幅が文字ごとにバラバラで日本語のような概算(CHAR_W)が使えないため、
      // 非表示のSVGテキストで実際の描画幅を計測してノード幅に使う（同じ文字列は再計測しない）
      const measureSvg = ns('svg');
      measureSvg.style.position = 'absolute';
      measureSvg.style.visibility = 'hidden';
      measureSvg.style.left = '-9999px';
      measureSvg.style.top = '-9999px';
      const measureTextEl = ns('text');
      measureTextEl.setAttribute('font-size', String(FONT_SIZE));
      measureTextEl.setAttribute('font-family', "'Noto Sans JP', sans-serif");
      measureSvg.appendChild(measureTextEl);
      document.body.appendChild(measureSvg);

      const textWidthCache = new Map();
      function measureTextWidth(str, fontSize = FONT_SIZE) {
        const key = fontSize + '|' + str;
        let w = textWidthCache.get(key);
        if (w === undefined) {
          measureTextEl.setAttribute('font-size', String(fontSize));
          measureTextEl.textContent = str;
          w = measureTextEl.getComputedTextLength();
          textWidthCache.set(key, w);
        }
        return w;
      }

      const MAX_LINE_W = 150; // これを超える幅になる名前は単語区切りで改行する
      const LINE_H = FONT_SIZE + 2; // 行の高さ(px)
      const PAD_Y  = 4;             // 上下の余白(px)

      // ラベルが長い場合、単語（スペース）区切りで自動的に最大2行まで折り返す
      // （3行以上になる場合は2行目以降を1行にまとめる）。
      // network-data_en.json の poet.name に "\n" を入れておくと、その位置で
      // 手動で改行される（自動折り返しより優先。行数の制限もかからず、3行以上でも
      // nodeHeight() がノードの高さを広げて収める）。
      const wrapCache = new Map();
      function wrapLabel(label) {
        let lines = wrapCache.get(label);
        if (lines) return lines;
        if (label.includes('\n')) {
          lines = label.split('\n');
        } else if (measureTextWidth(label) <= MAX_LINE_W) {
          lines = [label];
        } else {
          const words = label.split(' ');
          lines = [];
          let current = '';
          for (const word of words) {
            const candidate = current ? current + ' ' + word : word;
            if (current && measureTextWidth(candidate) > MAX_LINE_W) {
              lines.push(current);
              current = word;
            } else {
              current = candidate;
            }
          }
          if (current) lines.push(current);
          if (lines.length > 2) lines = [lines[0], lines.slice(1).join(' ')];
        }
        wrapCache.set(label, lines);
        return lines;
      }

      const DEFAULT_SPACING = networkConfig.eraSpacing ?? 80;
      const START_Y         = networkConfig.eraStartY  ?? 60;

      // eras に y を自動付与
      // 各時代に "spacing" を指定するとその時代と次の時代の間隔になる（省略時は eraSpacing）
      networkConfig.eras.forEach((era, i) => {
        if (i === 0) {
          era.y = START_Y;
        } else {
          const prev    = networkConfig.eras[i - 1];
          const spacing = prev.spacing ?? DEFAULT_SPACING;
          era.y = prev.y + spacing;
        }
      });

      const ROW_GAP = networkConfig.rowGap ?? 50;  // 同じ時代内の行間隔

      // 各時代の最大 row 数を集計し、spacing が足りるよう再計算
      // （spacing は前の時代の全行分を包含できる高さになる）
      networkConfig.eras.forEach(era => {
        const rows = networkConfig.poets
          .filter(p => p.era === era.id)
          .reduce((max, p) => Math.max(max, (p.row ?? 0) + 1), 1);
        era.maxRows = rows;
      });

      // spacing を行数に応じて自動拡張（明示指定がある場合はそちら優先）
      networkConfig.eras.forEach((era, i) => {
        if (i === 0) return;
        const prev = networkConfig.eras[i - 1];
        if (prev.spacing == null) {
          prev._computedSpacing = DEFAULT_SPACING + (prev.maxRows - 1) * ROW_GAP;
        } else {
          prev._computedSpacing = prev.spacing;
        }
      });

      // y を再計算（_computedSpacing を使用）
      networkConfig.eras.forEach((era, i) => {
        if (i === 0) { era.y = START_Y; return; }
        const prev = networkConfig.eras[i - 1];
        era.y = prev.y + (prev._computedSpacing ?? DEFAULT_SPACING);
      });

      // SVG の高さを最後の時代の y・行数から自動計算
      // （3行以上に折り返される名前があっても切れないよう、実際のノード高の最大値を使う）
      const lastEra = networkConfig.eras[networkConfig.eras.length - 1];
      const maxNodeH = Math.max(NODE_H, ...networkConfig.poets.map(p => nodeHeight(p)));
      const totalH  = lastEra.y + (lastEra.maxRows - 1) * ROW_GAP + maxNodeH + 40;
      svg.setAttribute('height', totalH);
      svg.setAttribute('viewBox', `0 0 ${SVG_W} ${totalH}`);

      // 関係タイプごとのスタイル定義（色・凡例名・破線パターン）
      // ここを変えれば凡例も自動で追従します
      const relationshipStyles = {
        'parent-child':    { color: '#e74c3c', legend: 'Parent–child',                     dash: null  },
        'blother':         { color: '#e67e22', legend: 'Siblings',                          dash: null  },
        'sofu-mago':       { color: '#8e44ad', legend: 'Grandparent–grandchild',           dash: null  },
        'sosofu-himago':   { color: '#6c5ce7', legend: 'Great-grandparent–great-grandchild', dash: null  },
        'teacher-student': { color: '#00897b', legend: 'Teacher–student / Poetic sage',    dash: '7,4' },
        'love':            { color: '#ff3d77', legend: 'Romance',                           dash: null  },
        'influence':       { color: '#2e9e5b', legend: 'Influence',                         dash: '4,4' },
        'friend':          { color: '#1273b5', legend: 'Association',                       dash: '4,4' },
        'rival':           { color: '#5f6a72', legend: 'Rival',                             dash: '2,4' },
        'cousin':          { color: '#c48a2e', legend: 'Cousins',                           dash: '7,4' },
        'ancestor':        { color: '#795548', legend: 'Ancestor',                          dash: '10,4' },
        'dream':           { color: '#7b68ee', legend: 'Dream apparition',                  dash: '1,4' },
        'worship':         { color: '#b8860b', legend: 'Revered as',                        dash: '3,2' },
        'uncle-nephew':    { color: '#d17b3a', legend: 'Uncle–nephew',                     dash: '6,3' },
        'depicted':        { color: '#546e7a', legend: 'Legend',                            dash: '5,2,1,2' },
        'rokkasen':        { color: '#00acc1', legend: 'Rokkasen (Six Poetry Immortals)',    dash: '3,3'  },
        'compiler':        { color: '#7e57c2', legend: 'Fellow compilers',                  dash: '2,6'  },
        'honkadori':       { color: '#00838f', legend: 'Honkadori (poetic allusion)',        dash: '4,1'  },
        'in-law-brother':  { color: '#7cb342', legend: 'Brothers-in-law',                    dash: '6,2,2,2' },
        'lord-vassal':     { color: '#ad1457', legend: 'Lord–vassal',                      dash: '8,2'  },
        'pilgrimage':      { color: '#558b2f', legend: 'Pilgrimage',                        dash: '5,3,1,3', arrow: true },
        'separation':      { color: '#943126', legend: 'Torn apart',                        dash: '6,2,1,2', arrow: true }
      };
      const FALLBACK_STYLE = { color: '#999', legend: 'Other', dash: null };

      function styleOf(type) {
        return relationshipStyles[type] || FALLBACK_STYLE;
      }

      // 凡例を実際に使われている関係タイプから自動生成（色ズレ防止）
      (function buildLegend() {
        const legendEl = document.getElementById('network-legend');
        if (!legendEl) return;
        const usedTypes = [...new Set(networkConfig.relationships.map(r => r.type))];
        usedTypes.forEach(type => {
          const s = styleOf(type);
          const item = document.createElement('div');
          item.className = 'legend-item';
          const line = document.createElement('div');
          line.className = 'legend-color-line';
          if (s.dash) {
            // 破線は CSS グラデーションで簡易表現
            line.style.background = `repeating-linear-gradient(90deg, ${s.color} 0 5px, transparent 5px 9px)`;
          } else {
            line.style.background = s.color;
          }
          const span = document.createElement('span');
          span.textContent = s.legend;
          item.appendChild(line);
          item.appendChild(span);
          legendEl.appendChild(item);
        });
      })();

      // ノード幅を名前の実測幅から計算（英語版）
      function nodeWidth(poet) {
        const label = poet.num + '. ' + poet.name;
        const lines = wrapLabel(label);
        const maxLineW = Math.max(...lines.map(l => measureTextWidth(l)));
        return maxLineW + PAD_X * 2;
      }

      // ノードの高さ。名前が3行以上に折り返される場合はNODE_Hより高くする
      function nodeHeight(poet) {
        const label = poet.num + '. ' + poet.name;
        const lines = wrapLabel(label);
        return Math.max(NODE_H, lines.length * LINE_H + PAD_Y * 2);
      }

      function getEraY(eraId) {
        const era = networkConfig.eras.find(e => e.id === eraId);
        return era ? era.y : 0;
      }

      // row を考慮した歌人のy座標。
      // フォーカスモード中にドラッグした縦方向のズレ（dragDY、一時的なもので
      // 元に戻すと解除される）があればそれも加味する。
      function getPoetY(poet) {
        return getEraY(poet.era) + (poet.row ?? 0) * ROW_GAP + (poet.dragDY ?? 0);
      }

      function ns(tag) {
        return document.createElementNS('http://www.w3.org/2000/svg', tag);
      }

      // 関係線の始点・終点・方向ベクトルを計算する（render() と曲がり量のドラッグ調整の両方で使う）
      function relEndpoints(rel) {
        const fp = poetStates.find(p => p.id === rel.from);
        const tp = poetStates.find(p => p.id === rel.to);
        if (!fp || !tp) return null;
        const x1 = fp.x + nodeWidth(fp) / 2;
        const y1 = getPoetY(fp) + nodeHeight(fp) / 2;
        const x2 = tp.x + nodeWidth(tp) / 2;
        const y2 = getPoetY(tp) + nodeHeight(tp) / 2;
        const dx = x2 - x1, dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const px = -dy / len, py = dx / len;
        return { fp, tp, x1, y1, x2, y2, dx, dy, len, px, py };
      }

      // 時代ごとの背景帯の色（区切りが視覚的にひと目でわかるように）
      const eraBgColors = {
        'nara_asuka':   '#fdf3e7',
        'early-heian':  '#eef5ec',
        'middle-heian': '#fef9e7',
        'late-heian':   '#f3ecf5',
        'kamakura':     '#eaf2f5'
      };
      const FALLBACK_BG = '#f5f5f5';

      // 区切り線の位置（時代ラベル側でも使うので先にまとめて計算）
      const eraDividerYs = networkConfig.eras.map((era, i) => {
        const nextEra = networkConfig.eras[i + 1];
        return nextEra ? nextEra.y - 8 : totalH - 8;
      });

      function render() {
        // 調整モード、またはフォーカスモード中はノードをドラッグできるため、
        // スマホでページスクロールに奪われないよう touch-action を切り替える
        svg.classList.toggle('draggable', editMode || focusedId !== null);

        svg.innerHTML = '';

        // 矢印つきの関係（聖地巡礼など「向き」のある関係）用のマーカー定義。
        // 色ごとに別マーカーが必要なので、矢印を使う関係タイプの分だけ用意する。
        const defs = ns('defs');
        Object.entries(relationshipStyles).forEach(([type, style]) => {
          const usesArrow = style.arrow || networkConfig.relationships.some(r => r.type === type && r.arrow);
          if (!usesArrow) return;
          const marker = ns('marker');
          marker.setAttribute('id', `arrow-${type}`);
          marker.setAttribute('viewBox', '0 0 10 10');
          marker.setAttribute('refX', '9');
          marker.setAttribute('refY', '5');
          marker.setAttribute('markerWidth', '6');
          marker.setAttribute('markerHeight', '6');
          marker.setAttribute('orient', 'auto-start-reverse');
          const arrowShape = ns('path');
          arrowShape.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
          arrowShape.setAttribute('fill', style.color);
          marker.appendChild(arrowShape);
          defs.appendChild(marker);
        });
        svg.appendChild(defs);

        // 時代ごとの背景帯（隙間なく塗り分ける）
        networkConfig.eras.forEach((era, i) => {
          const bandTop    = i === 0 ? 0 : eraDividerYs[i - 1];
          const bandBottom = eraDividerYs[i];
          const bg = ns('rect');
          bg.setAttribute('x', '0');
          bg.setAttribute('y', bandTop);
          bg.setAttribute('width', String(SVG_W));
          bg.setAttribute('height', Math.max(0, bandBottom - bandTop));
          bg.setAttribute('fill', eraBgColors[era.id] || FALLBACK_BG);
          svg.appendChild(bg);
        });

        // 時代ラベルと区切り線
        networkConfig.eras.forEach((era, i) => {
          // この時代の上端と下端を求める
          const eraTop    = era.y;
          const eraBottom = era.y + (era.maxRows - 1) * ROW_GAP + NODE_H;
          const dividerY  = eraDividerYs[i];

          // 区切り線（時代の下端）
          const line = ns('line');
          line.setAttribute('x1', '0');
          line.setAttribute('y1', dividerY);
          line.setAttribute('x2', String(SVG_W));
          line.setAttribute('y2', dividerY);
          line.setAttribute('stroke', '#e0e0e0');
          line.setAttribute('stroke-dasharray', '5,5');
          line.setAttribute('opacity', '0.6');
          svg.appendChild(line);

          // 縦書きラベル：時代の天地中央に配置
          const centerY = (eraTop + eraBottom) / 2;
          const text = ns('text');
          text.setAttribute('x', '14');
          text.setAttribute('y', centerY);
          text.setAttribute('font-size', '11');
          text.setAttribute('fill', '#aaa');
          text.setAttribute('font-weight', 'bold');
          text.setAttribute('text-anchor', 'middle');
          text.setAttribute('dominant-baseline', 'central');
          text.setAttribute('writing-mode', 'tb');
          text.setAttribute('letter-spacing', '2');
          text.textContent = era.name;
          svg.appendChild(text);

          // クリックで時代の解説を表示するための当たり判定
          // （縦書き文字そのものは細くクリックしづらいので、帯状に広く取る）
          const bandTop = i === 0 ? 0 : eraDividerYs[i - 1];
          const hitRect = ns('rect');
          hitRect.setAttribute('x', '0');
          hitRect.setAttribute('y', bandTop);
          hitRect.setAttribute('width', '30');
          hitRect.setAttribute('height', Math.max(0, dividerY - bandTop));
          hitRect.setAttribute('fill', 'transparent');
          hitRect.style.cursor = 'pointer';
          hitRect.addEventListener('click', (e) => showEraTooltip(era, e.clientX, e.clientY));
          svg.appendChild(hitRect);
        });

        // 関係線（ベジェ曲線でノードを避ける）
        // ラベルはノードより前面の別グループに描き、白フチ付きで重なっても読めるようにする
        const linesGroup   = ns('g');
        const labelsGroup  = ns('g');
        const handlesGroup = ns('g'); // 調整モード中、曲がり量をドラッグ調整するためのハンドル
        const placedLabelBoxes = []; // 既に配置したラベルの矩形。後続のラベルが重ならないよう避ける
        networkConfig.relationships.forEach((rel, relIndex) => {
          const geo = relEndpoints(rel);
          if (!geo) return;
          const { fp, tp, x1, y1, x2, y2, dx, dy, len, px, py } = geo;
          if (!isVisible(fp.id) || !isVisible(tp.id)) return; // フォーカス外は非表示

          // 曲がり量: rel.bend を指定すれば手動で確実に制御できる（負値で逆側に曲がる。
          // 調整モードでハンドルをドラッグしても設定される）
          let offsetCandidates;
          if (rel.bend != null) {
            offsetCandidates = [rel.bend];
          } else {
            // 自動: まず他のノードと重ならない最低限の曲がり量を求める
            let baseOffset = 0;
            poetStates.forEach(p => {
              if (p.id === fp.id || p.id === tp.id) return;
              if (!isVisible(p.id)) return;
              const nx = p.x + nodeWidth(p) / 2;
              const ny = getPoetY(p) + nodeHeight(p) / 2;
              const t = ((nx - x1) * dx + (ny - y1) * dy) / (len * len);
              if (t < 0.05 || t > 0.95) return;
              const closestX = x1 + t * dx;
              const closestY = y1 + t * dy;
              const dist = Math.sqrt((nx - closestX) ** 2 + (ny - closestY) ** 2);
              const threshold = nodeWidth(p) / 2 + 18;
              if (dist < threshold) {
                baseOffset = Math.max(baseOffset, threshold - dist + 30);
              }
            });
            if (baseOffset < 22) baseOffset = 22; // 最低限の曲がりを持たせる
            // ラベルがノードや他のラベルと重なる場合に備え、曲がり量を段階的に増やした候補と
            // 反対側に曲げる候補も用意し、後でラベルの衝突が最も少ない組み合わせを選ぶ
            offsetCandidates = [
              baseOffset, baseOffset + 25, baseOffset + 50, baseOffset + 80, baseOffset + 110,
              -baseOffset, -(baseOffset + 25), -(baseOffset + 50), -(baseOffset + 80)
            ];
          }

          const style = styleOf(rel.type);
          const showArrow = rel.arrow ?? style.arrow;

          // ラベル位置: rel.labelT（0〜1）で線上の位置を手動指定できる（省略時は中点 0.5）。
          // 歌人が増えて線が密になったため、指定位置が無関係なノードと重なる場合は
          // 曲線上の別の位置や、曲がり量そのものを変えて自動的に回避する。
          const labelCandidates = [];
          if (rel.labelT != null) labelCandidates.push(rel.labelT);
          [0.5, 0.35, 0.65, 0.25, 0.75, 0.15, 0.85, 0.08, 0.92, 0.42, 0.58].forEach(t => {
            if (!labelCandidates.includes(t)) labelCandidates.push(t);
          });

          const labelHalfW = measureTextWidth(rel.label, 10) / 2 + 6;
          const labelHalfH = 10;

          // 曲がり量とラベル位置(t)の組み合わせのうち、衝突が最も少ないものを選ぶ
          let offset = offsetCandidates[0], lx, ly, bestCollisions = Infinity;
          searchOffsets:
          for (const candidateOffset of offsetCandidates) {
            const ccx = (x1 + x2) / 2 + px * candidateOffset;
            const ccy = (y1 + y2) / 2 + py * candidateOffset;
            for (const t of labelCandidates) {
              const mt = 1 - t;
              const clx = mt * mt * x1 + 2 * mt * t * ccx + t * t * x2;
              const cly = mt * mt * y1 + 2 * mt * t * ccy + t * t * y2;
              // ラベルは無関係なノードだけでなく、線の両端（自分自身のノード）とも
              // 重ならないようにする（短い関係線では特に起こりやすい）
              let collisions = 0;
              poetStates.forEach(p => {
                if (!isVisible(p.id)) return;
                const pw = nodeWidth(p);
                const px1 = p.x, px2 = p.x + pw;
                const py1 = getPoetY(p) - 8, py2 = getPoetY(p) + nodeHeight(p) - 8;
                if (clx + labelHalfW > px1 && clx - labelHalfW < px2 &&
                    cly + labelHalfH > py1 && cly - labelHalfH < py2) {
                  collisions++;
                }
              });
              // 既に配置済みの他の関係ラベルとも重ならないようにする
              placedLabelBoxes.forEach(b => {
                if (clx + labelHalfW > b.x1 && clx - labelHalfW < b.x2 &&
                    cly + labelHalfH > b.y1 && cly - labelHalfH < b.y2) {
                  collisions++;
                }
              });
              if (collisions < bestCollisions) {
                bestCollisions = collisions;
                offset = candidateOffset;
                lx = clx; ly = cly;
              }
              if (collisions === 0) break searchOffsets;
            }
          }
          placedLabelBoxes.push({ x1: lx - labelHalfW, x2: lx + labelHalfW, y1: ly - labelHalfH - 8, y2: ly + labelHalfH - 8 });

          const cx = (x1 + x2) / 2 + px * offset;
          const cy = (y1 + y2) / 2 + py * offset;

          // 矢印つきの関係は、矢尻がノードの下に隠れないよう、
          // 曲線の進入方向とノードの矩形境界との交点のすぐ外側で止める
          let pathEndX = x2, pathEndY = y2;
          if (showArrow) {
            const edx = x2 - cx, edy = y2 - cy;
            const elen = Math.sqrt(edx * edx + edy * edy) || 1;
            const ux = edx / elen, uy = edy / elen;
            const hw = nodeWidth(tp) / 2, hh = nodeHeight(tp) / 2;
            const margin = 6;
            const tEdge = Math.min(
              ux !== 0 ? hw / Math.abs(ux) : Infinity,
              uy !== 0 ? hh / Math.abs(uy) : Infinity
            );
            const pullBack = tEdge + margin;
            pathEndX = x2 - ux * pullBack;
            pathEndY = y2 - uy * pullBack;
          }

          const path = ns('path');
          path.setAttribute('d', `M ${x1} ${y1} Q ${cx} ${cy} ${pathEndX} ${pathEndY}`);
          path.setAttribute('stroke', style.color);
          path.setAttribute('stroke-width', '2.2');
          path.setAttribute('stroke-linecap', 'round');
          if (style.dash) path.setAttribute('stroke-dasharray', style.dash);
          if (showArrow) path.setAttribute('marker-end', `url(#arrow-${rel.type})`);
          path.setAttribute('fill', 'none');
          path.setAttribute('opacity', '0.85');
          linesGroup.appendChild(path);

          // 調整モード中は曲線の制御点にドラッグ用ハンドルを表示する
          // （ドラッグすると rel.bend が設定され、以後は自動計算より優先される）
          if (editMode) {
            const handle = ns('circle');
            handle.setAttribute('cx', cx);
            handle.setAttribute('cy', cy);
            handle.setAttribute('r', draggingRelIndex === relIndex ? '8' : '6');
            handle.setAttribute('fill', rel.bend != null ? '#e74c3c' : '#ffffff');
            handle.setAttribute('stroke', style.color);
            handle.setAttribute('stroke-width', '2');
            handle.setAttribute('opacity', '0.9');
            handle.style.cursor = 'grab';
            handle.addEventListener('pointerdown', (e) => handleBendPointerDown(e, relIndex));
            handlesGroup.appendChild(handle);
          }

          const label = ns('text');
          label.setAttribute('x', lx);
          label.setAttribute('y', ly - 8);
          label.setAttribute('font-size', '10');
          label.setAttribute('fill', style.color);
          label.setAttribute('text-anchor', 'middle');
          label.setAttribute('dominant-baseline', 'central');
          label.setAttribute('font-weight', 'bold');
          label.setAttribute('pointer-events', 'none');
          // 白フチ（halo）で背景に何があっても読めるようにする
          label.setAttribute('stroke', '#ffffff');
          label.setAttribute('stroke-width', '3.5');
          label.setAttribute('stroke-linejoin', 'round');
          label.setAttribute('paint-order', 'stroke');
          label.textContent = rel.label;
          labelsGroup.appendChild(label);
        });
        svg.appendChild(linesGroup);

        // 歌人ノード
        poetStates.forEach(poet => {
          if (!isVisible(poet.id)) return; // フォーカスモード中はつながりのない歌人を隠す

          const eraY   = getPoetY(poet);
          const isActive = draggingId === poet.id || selectedId === poet.id || focusedId === poet.id;
          const nw     = nodeWidth(poet);
          const nh     = nodeHeight(poet);   // 3行以上に折り返される場合はNODE_Hより高くする
          const nx     = poet.x;             // rect の左端（x は左端基準）
          const ny     = eraY;               // rect の上端

          const fillColor   = isActive ? '#FF6B6B' : poet.female ? '#e8559a' : '#3498db';
          const strokeColor = isActive ? '#e74c3c' : poet.female ? '#c0397a' : '#2980b9';

          // ノードグループ
          const g = ns('g');
          g.classList.add('poet-node'); // 余白クリック判定用の目印
          g.style.cursor = (editMode || focusedId !== null) ? 'grab' : 'pointer';
          g.addEventListener('pointerdown', (e) => handlePointerDown(e, poet.id));

          // 背景矩形
          const rect = ns('rect');
          rect.setAttribute('x', nx);
          rect.setAttribute('y', ny);
          rect.setAttribute('width', nw);
          rect.setAttribute('height', nh);
          rect.setAttribute('rx', '8');
          rect.setAttribute('fill', fillColor);
          rect.setAttribute('stroke', strokeColor);
          rect.setAttribute('stroke-width', isActive ? '2' : '1.5');
          rect.setAttribute('opacity', isActive ? '1' : '0.85');
          g.appendChild(rect);

          // ラベル: "1. Emperor Tenji"（長い名前は単語区切りで複数行に折り返す）
          const label = poet.num + '. ' + poet.name;
          const lines = wrapLabel(label);
          const text = ns('text');
          text.setAttribute('x', nx + nw / 2);
          text.setAttribute('y', ny + nh / 2);
          text.setAttribute('font-size', FONT_SIZE);
          text.setAttribute('font-family', "'Noto Sans JP', sans-serif");
          text.setAttribute('fill', 'white');
          text.setAttribute('text-anchor', 'middle');
          text.setAttribute('dominant-baseline', 'central');
          text.setAttribute('pointer-events', 'none');
          text.setAttribute('font-weight', isActive ? 'bold' : 'normal');
          lines.forEach((line, i) => {
            const tspan = ns('tspan');
            tspan.setAttribute('x', nx + nw / 2);
            tspan.setAttribute('dy', i === 0 ? -(lines.length - 1) * LINE_H / 2 : LINE_H);
            tspan.textContent = line;
            text.appendChild(tspan);
          });
          g.appendChild(text);

          svg.appendChild(g);
        });

        // 関係ラベルを最後に追加 → ノードや線の上に表示され、隠れない
        svg.appendChild(labelsGroup);
        // 曲がり量のドラッグハンドルはさらに最前面に（ラベルやノードの下に隠れてクリックできなくなるのを防ぐ）
        svg.appendChild(handlesGroup);
      }

      /* ===== 座標変換 =====
         SVGは viewBox SVG_W px幅を width:100% で表示しているため、
         実表示幅との比率で換算しないとドラッグ位置がズレる */
      function toSvgX(clientX) {
        const rect = svg.getBoundingClientRect();
        return (clientX - rect.left) * (SVG_W / rect.width);
      }
      function toSvgY(clientY) {
        const rect = svg.getBoundingClientRect();
        return (clientY - rect.top) * (totalH / rect.height);
      }

      function handlePointerDown(e, poetId) {
        // ピンチ操作（2本指以上）の一部であれば、ノードのドラッグは開始しない
        if (e.pointerType === 'touch' && activeTouches.size >= 2) return;
        const poet = poetStates.find(p => p.id === poetId);
        if (!poet) return;
        draggingId = poetId;
        dragMoved  = false;
        dragOffset = {
          x: toSvgX(e.clientX) - poet.x,
          y: toSvgY(e.clientY) - getPoetY(poet)
        };
        try { svg.setPointerCapture(e.pointerId); } catch (_) {}
        e.preventDefault();
      }

      // 曲がり量調整ハンドルのドラッグ開始（調整モード中のみ）
      function handleBendPointerDown(e, relIndex) {
        if (!editMode) return;
        draggingRelIndex = relIndex;
        relDragMoved = false;
        try { svg.setPointerCapture(e.pointerId); } catch (_) {}
        e.preventDefault();
        e.stopPropagation(); // 背後のノード等のpointerdownを誘発しないようにする
      }

      function handlePointerMove(e) {
        if (draggingRelIndex !== null) {
          const rel = networkConfig.relationships[draggingRelIndex];
          const geo = relEndpoints(rel);
          if (geo) {
            const { x1, y1, x2, y2, px, py } = geo;
            const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
            const pointerX = toSvgX(e.clientX), pointerY = toSvgY(e.clientY);
            // ポインター位置を垂直方向(px,py)に投影した距離が新しい曲がり量になる
            const newOffset = (pointerX - mx) * px + (pointerY - my) * py;
            if (Math.abs(newOffset - (rel.bend ?? 0)) > 1) relDragMoved = true;
            rel.bend = Math.round(newOffset);
            if (readoutEl) readoutEl.textContent = `${rel.label}  bend: ${rel.bend}`;
            render();
          }
          return;
        }
        if (draggingId === null) return;
        if (activeTouches.size >= 2) return; // ピンチ操作中はノードのドラッグを行わない
        // 通常モードではドラッグ無効（クリック＝和歌表示のみ）。
        // ただし調整モード、またはフォーカスモード中は一時的な並べ替えのためドラッグを許可する。
        if (!editMode && focusedId === null) return;
        const poet = poetStates.find(p => p.id === draggingId);
        if (!poet) return;
        let newX = toSvgX(e.clientX) - dragOffset.x;
        // 画面外にはみ出さないようクランプ
        newX = Math.max(0, Math.min(SVG_W - nodeWidth(poet), newX));
        if (Math.abs(newX - poet.x) > 3) dragMoved = true;
        poet.x = Math.round(newX);

        // フォーカスモード中は縦方向・斜め方向にも自由に動かせる
        // （一時的な表示調整。余白のダブルタップで元の位置に戻る）
        if (focusedId !== null) {
          const baseY = getEraY(poet.era) + (poet.row ?? 0) * ROW_GAP;
          let newDY = toSvgY(e.clientY) - dragOffset.y - baseY;
          newDY = Math.max(-baseY, Math.min(totalH - nodeHeight(poet) - baseY, newDY));
          if (Math.abs(newDY - (poet.dragDY ?? 0)) > 3) dragMoved = true;
          poet.dragDY = Math.round(newDY);
        }

        updateReadout(poet);
        render();
      }

      const DBLCLICK_MS = 320; // この間隔内に同じ歌人を2回クリックしたらダブルクリック扱い

      function handlePointerUp(e) {
        if (draggingRelIndex !== null) {
          if (relDragMoved) refreshJsonOutput();
          draggingRelIndex = null;
          return;
        }
        if (wasMultiTouch) {
          // ピンチ操作（2本指以上）の一部だったタップはクリックとして扱わない。
          // 保留中のダブルクリック判定もキャンセルしておく。
          if (pendingClickTimer !== null) {
            clearTimeout(pendingClickTimer);
            pendingClickTimer = null;
            pendingClickId = null;
          }
          draggingId = null;
          return;
        }
        if (draggingId !== null && !dragMoved) {
          // ドラッグせずに離した → クリック扱い
          const clickedId = draggingId;
          const clickedPoet = poetStates.find(p => p.id === clickedId);
          const clientX = e ? e.clientX : 0;
          const clientY = e ? e.clientY : 0;

          if (pendingClickTimer !== null && pendingClickId === clickedId) {
            // 同じ歌人への2回目のクリック → ダブルクリック（フォーカスモード切替）
            clearTimeout(pendingClickTimer);
            pendingClickTimer = null;
            pendingClickId = null;
            enterFocusMode(clickedId);
          } else {
            // 1回目のクリック → ダブルクリック待ちのため少し遅らせてから通常のクリック処理を行う
            if (pendingClickTimer !== null) clearTimeout(pendingClickTimer);
            pendingClickId = clickedId;
            pendingClickTimer = setTimeout(() => {
              pendingClickTimer = null;
              pendingClickId = null;
              if (selectedId === clickedId) {
                selectedId = null;
                hidePoetTooltip();
              } else {
                selectedId = clickedId;
                if (clickedPoet) showPoetTooltip(clickedPoet, clientX, clientY);
              }
              render();
            }, DBLCLICK_MS);
          }
        } else if (draggingId !== null && dragMoved) {
          // ドラッグ完了 → エクスポート欄を最新化（調整モード時のみ）
          refreshJsonOutput();
        }
        draggingId = null;
      }

      // ダブルクリックした歌人と、直接つながりのある歌人だけを表示する
      function enterFocusMode(id) {
        focusedId = id;
        const related = new Set([id]);
        networkConfig.relationships.forEach(r => {
          if (r.from === id) related.add(r.to);
          if (r.to === id) related.add(r.from);
        });
        focusRelatedIds = related;
        focusSnapshot = new Map(poetStates.map(p => [p.id, p.x]));
        resetZoom();
        selectedId = null;
        hidePoetTooltip();
        render();
      }

      // ツールチップを閉じて選択を解除するだけの軽い後始末（誤操作のリスクが低いので即座に行う）
      function closeTooltipAndDeselect() {
        let changed = false;
        if (selectedId !== null) {
          selectedId = null;
          changed = true;
        }
        hidePoetTooltip();
        if (changed) render();
      }

      // フォーカスモードを解除して全員表示に戻し、フォーカス中に動かしたノードも元の位置に戻す
      function exitFocusMode() {
        if (focusedId === null) return;
        focusedId = null;
        focusRelatedIds = null;
        if (focusSnapshot) {
          poetStates.forEach(p => {
            if (focusSnapshot.has(p.id)) p.x = focusSnapshot.get(p.id);
          });
          focusSnapshot = null;
        }
        // 縦方向のドラッグのズレも元に戻す
        poetStates.forEach(p => { p.dragDY = 0; });
        resetZoom();
        render();
      }

      svg.addEventListener('pointermove',  handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);

      // フォーカスモード中のピンチイン・ピンチアウト＋パン（タッチのみ）。
      // 2本指になった時点で、進行中の単指ドラッグがあれば中断して競合を避ける。
      // 指の間隔の変化で拡大率を、指の中間点の移動でパン量を同時に決める
      // （地図アプリなどと同じ、ピンチしながら任意の場所へ動かせる方式）。
      svg.addEventListener('pointerdown', (e) => {
        if (e.pointerType !== 'touch') return;
        activeTouches.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (activeTouches.size === 2 && focusedId !== null) {
          // 進行中の単指ドラッグがあれば中断する（ポインターキャプチャは解放しなくても、
          // draggingId を null にすれば handlePointerMove 側で無視されるため実害はない）
          draggingId = null;
          const pts = [...activeTouches.values()];
          const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
          const midX = (pts[0].x + pts[1].x) / 2;
          const midY = (pts[0].y + pts[1].y) / 2;
          pinchState = {
            baseRect: getBaseRect(),
            initialDist: dist || 1,
            initialMid: { x: midX, y: midY },
            initialScale: zoomScale,
            initialTranslate: { x: zoomTranslate.x, y: zoomTranslate.y }
          };
        }
      }, { capture: true });

      svg.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'touch') return;
        if (!activeTouches.has(e.pointerId)) return;
        activeTouches.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (activeTouches.size === 2 && pinchState) {
          const pts = [...activeTouches.values()];
          const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
          const midX = (pts[0].x + pts[1].x) / 2;
          const midY = (pts[0].y + pts[1].y) / 2;

          const newScale = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX,
            pinchState.initialScale * (dist / pinchState.initialDist)));

          // ピンチ開始時の中間点の「真下にあったコンテンツ上の点」が、
          // 指を動かした後も指の中間点の真下にあり続けるように平行移動量を求める
          const { baseRect, initialMid, initialScale, initialTranslate } = pinchState;
          const localX0 = (initialMid.x - baseRect.left - initialTranslate.x) / initialScale;
          const localY0 = (initialMid.y - baseRect.top - initialTranslate.y) / initialScale;

          zoomScale = newScale;
          zoomTranslate = {
            x: (midX - baseRect.left) - localX0 * newScale,
            y: (midY - baseRect.top) - localY0 * newScale
          };
          applyZoomTransform();
        }
      }, { capture: true });

      function releaseTouch(e) {
        if (e.pointerType !== 'touch') return;
        activeTouches.delete(e.pointerId);
        if (activeTouches.size < 2) pinchState = null;
      }
      window.addEventListener('pointerup', releaseTouch, { capture: true });
      window.addEventListener('pointercancel', releaseTouch, { capture: true });

      // 余白（歌人ノード以外）を押したときの処理。
      // click イベントは setPointerCapture 中にターゲットが svg 自身へ
      // 再割り当てされることがあるため、ここでは pointerdown で直接判定する。
      // ・ツールチップを閉じる/選択解除は誤操作の心配がないので1回のタップで即実行
      // ・フォーカスモードの解除は、うっかり触れて元に戻ってしまわないよう
      //   余白をダブルタップ（ダブルクリック）したときだけ実行する
      let pendingBlankClickTimer = null;
      svg.addEventListener('pointerdown', (e) => {
        if (e.target.closest('.poet-node')) return;

        if (wasMultiTouch) {
          // ピンチ操作（2本指以上）で指が余白に触れても、タップとしては扱わない。
          // 保留中のダブルタップ判定もキャンセルし、ピンチの片方の指が単独の
          // タップと誤認されてフォーカスモードが解除されないようにする。
          if (pendingBlankClickTimer !== null) {
            clearTimeout(pendingBlankClickTimer);
            pendingBlankClickTimer = null;
          }
          return;
        }

        closeTooltipAndDeselect();

        if (focusedId === null) return;

        if (pendingBlankClickTimer !== null) {
          clearTimeout(pendingBlankClickTimer);
          pendingBlankClickTimer = null;
          exitFocusMode();
        } else {
          pendingBlankClickTimer = setTimeout(() => {
            pendingBlankClickTimer = null;
          }, DBLCLICK_MS);
        }
      });

      /* ===== 調整モード UI ===== */
      // 調整ツールは通常非表示。以下のいずれかのときだけ表示する:
      //   ・URLに ?edit=1 を付けてアクセス（本番サーバーでも調整可能）
      //   ・file:// で直接開いている（ローカル作業中）
      //   ・localhost / 127.0.0.1（ローカルサーバー）
      const showAdjustTools =
        new URLSearchParams(window.location.search).get('edit') === '1' ||
        window.location.protocol === 'file:' ||
        ['localhost', '127.0.0.1'].includes(window.location.hostname);

      const adjustToolbar = document.getElementById('adjust-toolbar');
      if (showAdjustTools && adjustToolbar) {
        adjustToolbar.style.display = 'flex';
      }

      const toggleBtn  = document.getElementById('toggle-edit');
      const adjustPanel = document.getElementById('adjust-panel');
      const readoutEl  = document.getElementById('drag-readout');
      const jsonOutput = document.getElementById('json-output');
      const copyBtn    = document.getElementById('copy-json');
      const saveBtn    = document.getElementById('save-file');
      let savedFileHandle = null; // File System Access APIのファイルハンドル（一度選べば同じセッション内は再利用し、再度ダイアログを出さない）

      function updateReadout(poet) {
        if (readoutEl) readoutEl.textContent = `${poet.num}. ${poet.name}  x: ${poet.x}`;
      }

      // 貼り付け用JSONを生成（計算で付与した y / maxRows 等は含めない）
      function buildExportJson() {
        const cleanEras = networkConfig.eras.map(e => {
          const o = { id: e.id, name: e.name };
          if (e.subtitle != null) o.subtitle = e.subtitle;
          if (e.description != null) o.description = e.description;
          if (e.spacing != null) o.spacing = e.spacing;
          return o;
        });
        const cleanPoets = poetStates.map(p => {
          const o = { id: p.id, num: p.num, name: p.name, era: p.era, x: Math.round(p.x), row: p.row ?? 0 };
          if (p.female) o.female = true;
          return o;
        });
        const obj = {
          eraSpacing: networkConfig.eraSpacing,
          eraStartY:  networkConfig.eraStartY,
          rowGap:     networkConfig.rowGap,
          eras: cleanEras,
          poets: cleanPoets,
          relationships: networkConfig.relationships,
          poems: networkConfig.poems
        };
        return JSON.stringify(obj, null, 2);
      }

      function refreshJsonOutput() {
        if (editMode && jsonOutput) jsonOutput.value = buildExportJson();
      }

      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          editMode = !editMode;
          draggingRelIndex = null; // モード切替中にドラッグ中だった場合の後始末
          toggleBtn.textContent = editMode ? '🔧 Adjust Mode ON' : '🔧 Adjust Mode OFF';
          toggleBtn.classList.toggle('active', editMode);
          adjustPanel.style.display = editMode ? 'block' : 'none';
          svg.classList.toggle('editing', editMode);
          if (readoutEl) readoutEl.textContent = '';
          refreshJsonOutput();
          render();
        });
      }

      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          const json = buildExportJson();
          jsonOutput.value = json;
          const done = () => {
            copyBtn.textContent = '✅ Copied';
            setTimeout(() => { copyBtn.textContent = '📋 Copy Coordinates'; }, 1800);
          };
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(json).then(done).catch(() => {
              jsonOutput.select();
              document.execCommand('copy');
              done();
            });
          } else {
            jsonOutput.select();
            document.execCommand('copy');
            done();
          }
        });
      }

      // 調整結果を network-data_en.json に直接上書き保存する（Chrome/Edge等のFile System Access API対応ブラウザのみ）。
      // 初回はファイル選択ダイアログで js/network-data_en.json を選んでもらう必要がある
      // （ブラウザがどのファイルへの書き込みを許可するか、ユーザー自身に選ばせる仕組みのため）。
      // 以後は同じページを開いている間、そのハンドルを再利用して確認なしで上書きする。
      // 未対応ブラウザ（Firefox・Safari等）ではファイルのダウンロードにフォールバックする。
      async function saveJsonToFile() {
        const json = buildExportJson();
        if (window.showSaveFilePicker) {
          try {
            if (!savedFileHandle) {
              savedFileHandle = await window.showSaveFilePicker({
                suggestedName: 'network-data_en.json',
                types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }]
              });
            }
            const writable = await savedFileHandle.createWritable();
            await writable.write(json);
            await writable.close();
            return true;
          } catch (err) {
            if (err && err.name === 'AbortError') return false; // ダイアログをキャンセルした
            console.error('ファイルへの保存に失敗しました:', err);
            savedFileHandle = null;
            return false;
          }
        }
        // フォールバック: ダウンロードとして保存し、js/network-data_en.json に手動で上書きしてもらう
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'network-data_en.json';
        a.click();
        URL.revokeObjectURL(url);
        return true;
      }

      if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
          jsonOutput.value = buildExportJson();
          const ok = await saveJsonToFile();
          if (ok) {
            saveBtn.textContent = '✅ Saved';
            setTimeout(() => { saveBtn.textContent = '💾 Save to file'; }, 1800);
          }
        });
      }

      render();

      /* ===== 和歌データ（network-data.json の poems から） ===== */
      const poemData = networkConfig.poems || {};

      /* ===== ツールチップ処理 ===== */
      const tipEl = document.getElementById('poet-tooltip');
      let tipTargetUrl = null;

      // クリック位置を基準に、画面からはみ出さないようツールチップを配置する（歌人・時代解説で共通）
      function positionTooltip(clientX, clientY) {
        tipEl.style.left = '-9999px';
        tipEl.style.top  = '-9999px';
        tipEl.style.display = 'block';
        requestAnimationFrame(() => {
          const tw = tipEl.offsetWidth, th = tipEl.offsetHeight;
          const vw = window.innerWidth,  vh = window.innerHeight;
          const m = 12;
          let tx = clientX + 18, ty = clientY - 18;
          if (tx + tw > vw - m) tx = clientX - tw - 18;
          if (tx < m)           tx = m;
          if (ty + th > vh - m) ty = clientY - th - 18;
          if (ty < m)           ty = m;
          tipEl.style.left = tx + 'px';
          tipEl.style.top  = ty + 'px';
        });
      }

      function showPoetTooltip(poet, clientX, clientY) {
        const poem = poemData[poet.num];
        if (!poem) return;
        tipTargetUrl = `/gokunarabe_${String(poet.num).padStart(2, '0')}_en.html`;
        tipEl.innerHTML =
          `<div style="font-size:.7rem;color:#c2b99a;margin-bottom:4px">No.${poet.num}　${poet.name}</div>` +
          `<div style="font-family:'Noto Serif JP',serif;font-size:.9rem;line-height:1.8;">${poem.first}<br>${poem.second}</div>` +
          `<div class="tip-hint">Tap / click to view the poem page →</div>`;
        positionTooltip(clientX, clientY);
      }

      // 時代の見出し（左端の縦書き文字）をクリックしたときの解説表示
      function showEraTooltip(era, clientX, clientY) {
        tipTargetUrl = null; // 時代解説はリンク先を持たないのでクリックしても遷移しない
        tipEl.innerHTML =
          `<div style="font-family:'Noto Serif JP',serif;font-size:1rem;font-weight:bold;margin-bottom:4px">${era.name}</div>` +
          (era.subtitle ? `<div style="font-size:.78rem;color:#c2b99a;margin-bottom:6px">${era.subtitle}</div>` : '') +
          (era.description ? `<div style="font-size:.85rem;line-height:1.7;">${era.description}</div>` : '');
        positionTooltip(clientX, clientY);
      }

      function hidePoetTooltip() {
        tipEl.style.display = 'none';
        tipTargetUrl = null;
      }

      // tooltip クリックでページ遷移
      tipEl.addEventListener('click', () => { if (tipTargetUrl) window.location.href = tipTargetUrl; });

      // 相関図の外（ページの他の場所）を押したら tooltip を閉じ、フォーカスモードも解除する。
      // 図の外への遷移は誤操作の可能性が低いため、こちらは1回で即座に元に戻す。
      // click イベントの合成に頼らず pointerdown で直接判定する（余白クリックの判定と同じ考え方）。
      document.addEventListener('pointerdown', (e) => {
        if (!e.target.closest('#hyakunin-network') && !e.target.closest('#poet-tooltip')) {
          closeTooltipAndDeselect();
          exitFocusMode();
        }
      });

    })();
