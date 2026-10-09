/* --------------------------------------------
藤原氏の略系図（fujiwara-keizu.html・英語版 fujiwara-keizu_en.html）
系図データから SVG を組み立て、ボタンで家ごとに絞り込む
英語版は js/fujiwara-keizu_en.js（window.FK_EN）を先に読み込む。FK_EN があると、名前・家名などの札・ツールチップ・
ボタン・説明文を英語にし、名前の幅を英字の字幅（FK_EN.widths）で見積もる。系図のデータと生没年（期間のスライダー）は日本語のものをそのまま使う
-------------------------------------------- */
(function () {
  'use strict';

  // 系図のツールチップは一度に1つだけ表示する。interactive のため、となりの人物に移っても前のツールチップがしばらく残るので、
  // 新しく開くときに前のものを閉じる（ページのほかのツールチップには触れない）
  var openTip = null;
  function showOnlyThis(inst) {
    if (openTip && openTip !== inst) openTip.hide();
    openTip = inst;
  }
  function forgetTip(inst) {
    if (openTip === inst) openTip = null;
  }

  /* ---------- 系図データ ----------
    n: 名前 / c: 子
    k: 摂政・関白になった者（青字）
    p: 百人一首の歌番号（番号バッジ＋歌のページへのリンク）
    pre: 家名（名前の前の赤枠。「家」は付けない：近衛・九条・花山院・西園寺・徳大寺など） / sub: 家名などの札（名前の下） / note: 名前の後ろの注記
    band: 一列に続く子孫（子が1人ずつ）の下にまたがる札（例：奥州藤原氏の4代）
    dash: 親との間を点線（数代省略）で結ぶ
    adopt: 親の養子。親との間の線に「養子」と書く
    wife: 妻（{ n, p }）。本人の下に並べて縦の「＝」でつなぎ、子への線は「＝」から出す（妻が1人で子が全員その妻の子のとき）
    spouse: この人物は親の妻。妻が2人いるときは、夫の子に妻を並べ、その妻の子に子を入れる。
            1人目の妻を夫の上、2人目を夫の下に置き、夫との間の「＝」からそれぞれの子へ線を出す
    id: 絞り込みの起点 / key: ツールチップを探す名前（同じ名前が2人いるときだけ。省略時は名前）
    ※ツールチップの文面は js/fujiwara-keizu-tooltips.js にまとめています
  */
  function N(n, o, c) {
    var node = o || {};
    node.n = n;
    node.c = c || [];
    return node;
  }

  var TREE = N('鎌足', {}, [
    N('不比等', {}, [
      N('武智麻呂', { sub: '南家', id: 'nanke' }, [
        N('仲麻呂', { note: '恵美押勝' }),
        N('巨勢麻呂', {}, [
          N('真作', {}, [
            N('村田', {}, [
              N('富士麻呂', {}, [
                N('敏行', { p: 18 })
              ])
            ]),
            N('三成', {}, [
              N('岳雄', {}, [
                N('千乗', {}, [
                  N('季縄', {}, [
                    N('右近', { p: 38 })
                  ])
                ])
              ])
            ])
          ])
        ])
      ]),
      N('房前', { sub: '北家', id: 'hokke' }, [
        N('真楯', {}, [
          N('内麻呂', {}, [
            N('真夏', {}, [
              N('濱雄', {}, [
                N('家宗', {}, [
                  N('継蔭', {}, [
                    N('伊勢', { p: 19 })
                  ])
                ])
              ])
            ]),
            N('冬嗣', {}, [
              N('長良', {}, [N('高子')]),
              N('良房', { k: 1, id: 'sekkan' }, [
                N('基経', { k: 1 }, [
                  N('時平', {}, [N('敦忠', { p: 43 })]),
                  N('兼平'),
                  N('仲平'),
                  N('忠平', { k: 1, p: 26 }, [
                    N('実頼', { k: 1, sub: '小野宮流', id: 'onomiya' }, [
                      N('頼忠', { k: 1 }, [
                        N('公任', { p: 55 }, [
                          N('定頼', { p: 64 })
                        ])
                      ]),
                      N('斉敏', {}, [
                        N('高遠'),
                        N('実資', {})
                      ])
                    ]),
                    N('師輔', { sub: '九条流', id: 'kujo' }, [
                      N('伊尹', { k: 1, p: 45 }, [
                        N('義孝', { p: 50 }, [N('行成')])
                      ]),
                      N('兼通', { k: 1 }, [N('顕光')]),
                      N('安子'),
                      N('兼家', { k: 1 }, [
                        N('時姫', { spouse: 1 }, [
                          N('道隆', { k: 1, wife: { n: '儀同三司母', p: 54 } }, [
                            N('伊周', {}, [
                              N('道雅', { p: 63 })
                            ]),
                            N('定子'),
                            N('隆家')
                          ]),
                          N('道兼', { k: 1 }),
                          N('詮子'),
                          N('道長', { k: 1, sub: '御堂流', id: 'mido' }, [
                            N('彰子'),
                            N('頼通', { k: 1 }, [
                              N('師実', { k: 1, sub: '花山院流', id: 'kazanin' }, [
                                N('師通', { k: 1 }, [
                                  N('忠実', { k: 1 }, [
                                    N('忠通', { k: 1, p: 76 }, [
                                      N('基実', { k: 1, pre: '近衛', id: 'konoe' }, [
                                        N('基通', { k: 1 }, [
                                          N('家実', { k: 1 }, [
                                            N('兼経', { k: 1 }),
                                            N('兼平', { k: 1, pre: '鷹司', key: '鷹司兼平' })
                                          ])
                                        ])
                                      ]),
                                      N('基房', { k: 1 }),
                                      N('兼実', { k: 1, pre: '九条', id: 'kujoke' }, [
                                        N('良経', { k: 1, p: 91 }, [
                                          N('道家', { k: 1 }, [
                                            N('良実', { k: 1, pre: '二条' }),
                                            N('教実', { k: 1 }),
                                            N('実経', { k: 1, pre: '一条' }),
                                            N('頼経', { sub: '鎌倉将軍', id: 'shogun' })
                                          ])
                                        ])
                                      ]),
                                      N('慈円', { p: 95 })
                                    ]),
                                    N('頼長')
                                  ])
                                ]),
                                N('家忠', { pre: '花山院' }),
                                N('忠教', {}, [
                                  N('頼輔', {}, [
                                    N('頼経', { key: '難波頼経' }, [
                                      N('雅経', { p: 94 })
                                    ])
                                  ])
                                ])
                              ])
                            ]),
                            N('頼宗', { sub: '中御門流', id: 'nakamikado' }, [
                              N('俊家', {}, [
                                N('宗俊', {}, [N('宗忠')]),
                                N('基俊', { p: 75 })
                              ]),
                              N('能長')
                            ]),
                            N('教通', { k: 1 }, [N('信長')]),
                            N('長家', { sub: '御子左流', id: 'mikohidari' }, [
                              N('忠家', {}, [
                                N('俊忠', {}, [
                                  N('俊成', { p: 83 }, [
                                    N('定家', { p: 97 })
                                  ]),
                                  N('俊海', {}, [
                                    N('定長', { p: 87 }, [
                                      N('家隆', { p: 98, adopt: 1 })
                                    ])
                                  ])
                                ])
                              ])
                            ])
                          ])
                        ]),
                        N('道綱母', { spouse: 1, p: 53 }, [
                          N('道綱', {})
                        ])
                      ]),
                      N('為光', {}, [N('道信', { p: 52 })]),
                      N('公季', { sub: '閑院流', id: 'kanin' }, [
                        N('実成', {}, [
                          N('公成', {}, [
                            N('実季', {}, [
                              N('公実', {}, [
                                N('通季', { pre: '西園寺', id: 'saionji' }, [
                                  N('公通', {}, [
                                    N('実宗', {}, [
                                      N('公経', { p: 96 })
                                    ])
                                  ])
                                ]),
                                N('実能', { pre: '徳大寺', id: 'tokudaiji' }, [
                                  N('公能', {}, [
                                    N('実定', { p: 81 })
                                  ])
                                ])
                              ])
                            ])
                          ])
                        ])
                      ])
                    ]),
                    N('師尹', {}, [
                      N('定時', {}, [N('実方', { p: 51 })])
                    ])
                  ]),
                  N('穏子')
                ])
              ]),
              N('良相'),
              N('良門', {}, [
                N('高藤', { sub: '勧修寺流', id: 'kajuji' }, [
                  N('定方', { p: 25 }, [
                    N('朝頼', {}, [
                      N('道因', { p: 82, dash: 1 })
                    ]),
                    N('朝忠', { p: 44 })
                  ]),
                  N('信成', { dash: 1 }, [
                    N('殷富門院大輔', { p: 90 })
                  ])
                ]),
                N('利基', {}, [
                  N('兼輔', { p: 27 }, [
                    N('雅正', {}, [
                      N('為時', {}, [
                        N('紫式部', { p: 57 }, [
                          N('賢子', { p: 58 })
                        ])
                      ])
                    ])
                  ])
                ])
              ]),
              N('良世')
            ])
          ])
        ]),
        N('魚名', { sub: '魚名流', id: 'uona' }, [
          N('末茂', {}, [
            N('総継', {}, [
              N('直道', {}, [
                N('連茂', {}, [
                  N('佐忠', {}, [
                    N('時明', {}, [
                      N('頼任', {}, [
                        N('隆経', {}, [
                          N('顕季', { sub: '六条藤家', id: 'rokujo' }, [
                            N('顕輔', { p: 79 }, [
                              N('清輔', { p: 84 })
                            ])
                          ])
                        ])
                      ])
                    ])
                  ])
                ])
              ])
            ])
          ]),
          N('藤成', {}, [
            N('豊沢', {}, [
              N('村雄', {}, [
                N('秀郷', {}, [
                  N('清衡', { dash: 1, band: '奥州藤原氏', id: 'oshu' }, [
                    N('基衡', {}, [N('秀衡', {}, [N('泰衡')])])
                  ]),
                  // 佐藤氏：秀郷の6世の孫・公清から
                  N('公清', { dash: 1, pre: '佐藤', id: 'sato' }, [
                    N('季清', {}, [
                      N('康清', {}, [
                        N('西行', { p: 86 })
                      ])
                    ])
                  ])
                ])
              ])
            ])
          ])
        ])
      ]),
      N('宇合', { sub: '式家', id: 'shikike' }, [
        N('清成', {}, [N('種継', {}, [N('仲成'), N('薬子')])]),
        N('百川', {}, [N('緒嗣')])
      ]),
      N('麻呂', { sub: '京家', id: 'kyoke' }, [
        N('興風', { p: 34, dash: 1 })
      ]),
      N('光明皇后')
    ])
  ]);

  /* ---------- 絞り込み ----------
    roots: 起点（id）の子孫すべてと、起点までの祖先を表示
    pick:  条件に合う人物と、その祖先だけを表示
    keep:  roots のとき、祖先のうち名前を残す人物。それ以外の祖先は省略し、点線（数代省略）でつなぐ
  */
  var FILTERS = {
    all: { label: '全体', desc: '藤原鎌足から鎌倉時代の五摂家までの主な人物を表示しています。' },
    nanke: { label: '南家', roots: ['nanke'], desc: '不比等の長男・武智麻呂に始まる家。奈良時代に藤原仲麻呂（恵美押勝）が権勢をふるいましたが、恵美押勝の乱（764年）で勢力を失いました。' },
    hokke: { label: '北家', roots: ['hokke'], desc: '不比等の次男・房前に始まる家。冬嗣・良房以降、摂政・関白の地位を独占し、四家のなかで最も栄えました。' },
    shikike: { label: '式家', roots: ['shikike'], desc: '不比等の三男・宇合に始まる家。百川は光仁天皇の擁立に関わり、種継は長岡京の造営を主導しましたが、薬子の変（810年）で仲成・薬子が倒れ、勢いを失いました。' },
    kyoke: { label: '京家', roots: ['kyoke'], desc: '不比等の四男・麻呂に始まる家。四家のなかでは振るいませんでした。百人一首34番の藤原興風は京家の出身です。' },
    sekkan: { label: '摂関家', roots: ['sekkan'], desc: '良房が人臣で初めて摂政となり、養子の基経が初めて関白となりました。以後、その子孫が摂政・関白を受け継いでいきます。' },
    onomiya: { label: '小野宮流', roots: ['onomiya'], desc: '忠平の長男・実頼の系統。有職故実に通じた家で、実資は日記『小右記』を残しました。' },
    kujo: { label: '九条流', roots: ['kujo'], desc: '忠平の次男・師輔の系統。娘の安子が村上天皇の中宮となり、その子孫が摂関家の主流となりました。' },
    mido: { label: '御堂流', roots: ['mido'], desc: '道長の系統。道長・頼通父子の時代に摂関政治は全盛期を迎えました。' },
    nakamikado: { label: '中御門流', roots: ['nakamikado'], desc: '道長の子・右大臣頼宗の子孫の系統で、松木家（中御門家）を宗家とします。中御門家は頼宗の孫・宗俊を祖とし、その子・宗忠が中御門に居を構えたことにちなむ家号です。宗忠は「中御門右大臣」と号し、日記『中右記』を残しました。' },
    kazanin: { label: '花山院流', roots: ['kazanin'], desc: '師実の子孫の系統で、師実流とも呼ばれます。その嫡流が、師実の次男・家忠（花山院左大臣）を祖とする花山院家です。' },
    mikohidari: { label: '御子左家', roots: ['mikohidari'], desc: '御子左家の由来：醍醐天皇の皇子で左大臣だった源兼明は「御子左大臣」と呼ばれており、その邸宅は「御子左第」と呼ばれていました。藤原道長の六男・長家がこの邸宅を受け継いだことから、長家の子孫である藤原俊成・藤原定家らの家系は、後に邸宅の名にちなみ「御子左家」と呼ばれるようになりました。' },
    kanin: { label: '閑院流', roots: ['kanin'], desc: '師輔の十一男・公季に始まる系統。公季の邸宅「閑院」にちなむ名で、のちに三条・西園寺・徳大寺などの家が分かれました。' },
    saionji: { label: '西園寺', roots: ['saionji'], desc: '閑院流の家。権大納言・藤原公実の三男・通季を祖とし、4代の公経が同家の実質的な家祖とされます。公経は百人一首96番の入道前太政大臣です。' },
    tokudaiji: { label: '徳大寺', roots: ['tokudaiji'], desc: '閑院流の家。権大納言・藤原公実の五男・実能が衣笠岡に徳大寺を建立して「徳大寺左大臣」と称され、家の祖となりました。3代の実定は百人一首81番の後徳大寺左大臣です。' },
    gosekke: { label: '五摂家', roots: ['konoe', 'kujoke'], desc: '忠通の子の基実から近衛家、兼実から九条家がおこり、のちに近衛家から鷹司家、九条家から二条家・一条家が分かれて五摂家となりました。' },
    shogun: { label: '鎌倉将軍', roots: ['shogun'], desc: '九条道家の子・頼経は鎌倉幕府の4代将軍に迎えられ、子の頼嗣が5代将軍となりました（摂家将軍）。' },
    kajuji: { label: '勧修寺流', roots: ['kajuji'], desc: '良門の子・高藤に始まる系統。高藤の娘・胤子を母とする醍醐天皇が建てた勧修寺にちなむ名です。' },
    uona: { label: '魚名流', roots: ['uona'], desc: '房前の五男・魚名に始まる系統。子孫からは藤原秀郷や六条藤家などが出ました。' },
    rokujo: { label: '六条藤家', roots: ['rokujo'], desc: '顕季に始まる歌道の家。顕輔・清輔と続き、御子左家と並ぶ歌壇の名門となりました。' },
    oshu: { label: '奥州藤原氏', roots: ['oshu'], keep: ['魚名', '秀郷'], desc: '藤原秀郷の子孫とされる一族。清衡・基衡・秀衡・泰衡の四代にわたって平泉を拠点に栄えましたが、1189年に源頼朝に滅ぼされました。' },
    sato: { label: '佐藤', roots: ['sato'], keep: ['魚名', '秀郷'], desc: '藤原秀郷の子孫の一流。秀郷から数えて6世の孫・公清と、その子・季清、孫・康清がみな左衛門尉を務めたことから、「左衛門尉」の「左」と「藤原」の「藤」をとって佐藤と称したとされます（諸説あり）。康清の子・義清が、百人一首86番の西行法師です。' },
    poets: { label: '百人一首の歌人', pick: function (d) { return !!d.p || !!(d.wife && d.wife.p); }, desc: 'この系図に登場する百人一首の歌人を表示しています。赤い番号をクリックすると歌のページへ移動します。' }
  };

  /* ---------- 英語版（js/fujiwara-keizu_en.js） ---------- */
  var EN = window.FK_EN || null;
  if (EN) {
    Object.keys(FILTERS).forEach(function (k) {
      var t = EN.filters[k];
      if (t) { FILTERS[k].label = t.label; FILTERS[k].desc = t.desc; }
    });
  }
  // 表示する名前（英語版は FK_EN.names。妻 { n, p } にも使う）
  function nameOf(d) { return EN ? (EN.names[d.key || d.n] || d.n) : d.n; }
  // 家名・札・注記・band の文字（英語版は FK_EN.labels）
  function lab(s) { return EN ? (EN.labels[s] || s) : s; }
  // 文字列の幅。日本語は全角1文字＝文字サイズ、英語は英字の字幅（FK_EN.widths、1000＝文字サイズ）で見積もる
  function textW(s, size) {
    if (!EN) return s.length * size;
    var w = 0;
    for (var i = 0; i < s.length; i++) {
      // 長音記号つきの文字（ō など）は元の文字の幅
      var c = s.charAt(i).normalize ? s.charAt(i).normalize('NFD').charAt(0) : s.charAt(i);
      w += EN.widths[c] || (/\d/.test(c) ? 572 : 632);
    }
    return w * size / 1000;
  }
  function fmt(t, o) { return t.replace(/\{(\w+)\}/g, function (m, k) { return o[k]; }); }
  function poemHref(p) { return '/' + p + (EN ? '_en' : '') + '.html'; }
  function poemTitle(name, p) { return EN ? fmt(EN.ui.poemTitle, { name: name, p: p }) : name + '（百人一首' + p + '番）'; }

  /* ---------- 生存期間で絞り込む（スライダー） ----------
    生没年は、ふだんはツールチップ（js/fujiwara-keizu-tooltips.js）の「生没年：〇〇年～〇〇年」から読み取る。
    生年がわからない人物は、少なくとも YEAR_SPAN 年は生きていたものとする：
      没年がわかる → 没年の YEAR_SPAN 年前から没年まで（記録がもっと前からあれば、そこから）
      没年もわからない → 最初の記録の年から YEAR_SPAN 年後まで
    生没年がまったくわからない人物（俊海・定時・良門・信成・連茂・佐藤公清・季清・康清）は期間の判定から外す（祖先としてだけ薄く出る）。

    LIFE … ツールチップの生没年が「不明」などの人物を、ja.wikipedia・コトバンクの記録で補ったもの（キーはツールチップを探す名前）
      [年1, 年2, 種類]  種類 'life' … 生年～没年
                        'death' … 生きていたことが確かな最初の年（記録・子の誕生など）～没年
                        'record' … 記録に現れる最初の年～最後の年（没年は不明） */
  var YEAR_SPAN = 20;
  var LIFE = {
    '紫式部': [978, 1014, 'life'],       // 生年は970～978年、没年は1014～1031年の諸説。どの説でも生きていた期間
    '儀同三司母': [956, 996, 'death'],   // 高階貴子。没時「四十代と推定」
    '巨勢麻呂': [740, 764, 'death'],     // 740年 従五位下
    '敏行': [866, 901, 'death'],         // 866年 少内記。没年は901年
    '岳雄': [841, 847, 'death'],         // 841年 従五位下
    '季縄': [919, 919, 'death'],
    '濱雄': [826, 840, 'death'],         // 826年 従五位下
    '時姫': [953, 980, 'death'],         // 長男・道隆が953年生まれ
    '難波頼経': [1166, 1217, 'death'],   // 1166年 壱岐守
    '実方': [973, 999, 'death'],         // 973年 叙爵
    '雅正': [948, 961, 'death'],         // 子・為時が949年頃生まれ
    '佐忠': [945, 973, 'death'],         // 945年 六位蔵人。没年は973年頃
    '時明': [972, 998, 'death'],         // 972年 六位蔵人。没年は998年？
    '頼任': [1030, 1030, 'death'],
    '隆経': [1054, 1072, 'death'],       // 子・顕季が1055年生まれ。没年は1072年頃
    '豊沢': [887, 887, 'death'],
    '村雄': [887, 932, 'death'],         // 887年 従五位下
    '薬子': [810, 810, 'death'],
    '真作': [784, 784, 'record'],        // 784年 従五位下
    '村田': [816, 816, 'record'],        // 816年 従五位下
    '千乗': [864, 882, 'record'],        // 864年 従五位下～882年 木工頭
    '右近': [960, 966, 'record'],        // 960～966年の歌合に出詠
    '継蔭': [871, 891, 'record'],        // 871年 文章生～891年 大和守
    '朝頼': [925, 946, 'record'],
    '利基': [860, 894, 'record'],
    '末茂': [777, 790, 'record'],
    '総継': [811, 811, 'record'],        // 811年 叙爵
    '直道': [843, 863, 'record'],
    '興風': [900, 914, 'record']
  };

  // 人物（ツールチップを探す名前）の [生きていたとみなす最初の年, 最後の年]。わからなければ null
  function lifeSpan(name) {
    var life = LIFE[name];
    if (!life) {
      var t = (window.FK_TOOLTIPS || {})[name] || [];
      var line = t.filter(function (s) { return /^生没年：/.test(s); })[0];
      if (!line) return null;
      var parts = line.replace(/^生没年：/, '').split('～');
      var b = (parts[0] || '').match(/(\d{3,4})年/);
      var d = (parts[1] || '').match(/(\d{3,4})年/);
      if (b && d) life = [+b[1], +d[1], 'life'];
      else if (d) life = [+d[1], +d[1], 'death'];
      else if (b) life = [+b[1], +b[1], 'record'];
      else return null;
    }
    if (life[2] === 'life') return [life[0], life[1]];
    if (life[2] === 'death') return [Math.min(life[0], life[1] - YEAR_SPAN), life[1]];
    return [life[0], Math.max(life[1], life[0] + YEAR_SPAN)];
  }

  // 人物（妻を並べている人物は妻も）が、期間 [from, to] のどこかで生きていたか
  function aliveIn(d, from, to) {
    return [d.key || d.n].concat(d.wife ? [d.wife.n] : []).some(function (name) {
      var s = lifeSpan(name);
      return !!s && s[0] <= to && s[1] >= from;
    });
  }

  /* ---------- 寸法 ---------- */
  var FS = 15;          // 名前の文字サイズ（全角1文字の幅とみなす）
  var NOTE_FS = 11;     // 注記・家名の文字サイズ
  var ROW = 32;         // 1行の高さ
  var SUB = 18;         // 名前の下に札を出すときの追加の高さ
  var GAP = 32;         // 親と子の間隔
  var DASH_EXTRA = 28;  // 点線（数代省略）のときの追加の間隔
  var ADOPT_EXTRA = 30; // 養子のとき、線の上に「養子」と書くための追加の間隔
  var BADGE_R = 10;     // 歌番号バッジの半径
  var PAD = 16;
  var COUPLE = 18;      // 夫婦を上下に並べるとき、中心（＝の位置）から各名前までの距離
  var SVGNS = 'http://www.w3.org/2000/svg';

  /* ---------- 前処理：親子関係と id の索引 ---------- */
  var byId = {};
  (function index(node, parent) {
    node.parent = parent;
    if (node.id) byId[node.id] = node;
    node.c.forEach(function (ch) { index(ch, node); });
  })(TREE, null);

  function ancestors(node) {
    var list = [];
    for (var a = node.parent; a; a = a.parent) list.push(a);
    return list;
  }

  /* 表示する木（view）を作る。mode: 'on'（通常）/ 'ctx'（祖先・薄く表示） */
  function buildView(filter) {
    var show = new Map(); // node -> mode
    var collapse = new Set(); // 省略する祖先（keep に無いもの）

    if (filter.roots) {
      filter.roots.forEach(function (id) {
        var root = byId[id];
        (function mark(d) {
          show.set(d, 'on');
          d.c.forEach(mark);
        })(root);
        ancestors(root).forEach(function (a) {
          if (show.has(a)) return;
          if (filter.keep && filter.keep.indexOf(a.n) < 0) collapse.add(a);
          else show.set(a, 'ctx');
        });
      });
    } else if (filter.pick) {
      (function scan(d) {
        if (filter.pick(d)) {
          show.set(d, 'on');
          ancestors(d).forEach(function (a) { if (!show.has(a)) show.set(a, 'ctx'); });
        }
        d.c.forEach(scan);
      })(TREE);
    }

    // 表示する人物の view を配列で返す。省略する祖先は飛ばして子を直接つなぎ、点線にする
    function build(d, skipped) {
      var mode = filter.roots || filter.pick ? show.get(d) : 'on';
      if (!mode) {
        if (!collapse.has(d)) return [];
        return d.c.reduce(function (list, ch) { return list.concat(build(ch, true)); }, []);
      }
      var v = { d: d, mode: mode, dash: !!d.dash || !!skipped, c: [] };
      d.c.forEach(function (ch) { v.c = v.c.concat(build(ch, false)); });
      return [v];
    }
    return build(TREE, false)[0];
  }

  /* ---------- 配置 ---------- */
  function measure(v) {
    var d = v.d;
    var w = 0;
    v.preW = d.pre ? textW(lab(d.pre), NOTE_FS) + 8 : 0;
    if (v.preW) w += v.preW + 4;
    v.nameX = w;
    w += textW(nameOf(d), FS);
    if (d.note) { v.noteX = w + 2; w += (EN ? textW(' (' + lab(d.note) + ')', NOTE_FS) : (d.note.length + 2) * NOTE_FS) + 2; }
    if (d.p) { v.badgeCx = w + 4 + BADGE_R; w += 4 + BADGE_R * 2; }
    v.mainW = w;
    // 妻：本人の真下に名前（と歌番号バッジ）を並べ、本人の名前の中央から縦の「＝」を下ろす
    if (d.wife) {
      v.eqX = v.nameX + textW(nameOf(d), FS) / 2;
      var ww = v.nameX + textW(nameOf(d.wife), FS);
      if (d.wife.p) { v.wifeBadgeCx = ww + 4 + BADGE_R; ww += 4 + BADGE_R * 2; }
      v.wifeW = ww;
      w = Math.max(w, ww);
    }
    v.textW = w; // 名前・注記・バッジの右端（子への線はここから引く）
    // 名前の下の札（家名など）が名前より幅広いときは、その分だけ子との間隔を空ける
    if (d.sub) w = Math.max(w, v.nameX + textW(lab(d.sub), NOTE_FS) + 12 + 4);
    v.w = w;
  }

  function extraGap(cv) {
    return (cv.dash ? DASH_EXTRA : 0) + (cv.d.adopt ? ADOPT_EXTRA : 0);
  }

  function layout(root) {
    var cursor = PAD;
    var nodes = [];
    function place(v, x, inheritSub) {
      measure(v);
      v.x = x;
      nodes.push(v);
      // 妻が2人：1人目を夫の上、2人目を夫の下に置く（placeWives）
      if (v.c.some(function (cv) { return cv.d.spouse; })) {
        placeWives(v, x);
        return;
      }
      var single = v.c.length === 1;
      var couple = !!v.d.wife;
      if (!v.c.length) {
        var h = ROW + (v.d.sub || v.d.band || inheritSub ? SUB : 0) + (couple ? COUPLE * 2 : 0);
        v.y = cursor + h / 2;
        cursor += h;
      } else {
        // 夫婦は上下に1段ずつ広がるので、子の並びの前後に余白を取る
        if (couple) cursor += COUPLE;
        var childX = x + v.w + GAP;
        v.c.forEach(function (cv) {
          place(cv, childX + extraGap(cv), single && (inheritSub || !!v.d.sub || !!v.d.band));
        });
        if (couple) cursor += COUPLE;
        // 子への線は各人物の inY（夫婦なら夫の段）に届くので、その中央に置く
        v.y = (v.c[0].inY + v.c[v.c.length - 1].inY) / 2;
      }
      // y: 子への線を出す高さ（夫婦なら＝の中央）／ inY: 親からの線を受ける高さ（夫婦なら夫の段）
      if (couple) {
        v.inY = v.y - COUPLE;
      } else {
        v.inY = v.y;
      }
    }
    place(root, PAD, false);

    /* 妻が2人いる夫の配置
         時姫            ← 1人目の妻（上）
          ‖──┬ 道隆      ← ＝A：1人目の妻の子へ
         兼家    …
          ‖──── 道綱     ← ＝B：2人目の妻の子へ
         道綱母          ← 2人目の妻（下）
       ＝A は1人目の妻の子の並びの一番下にそろえ、＝B の線が＝A の子の縦線と重ならないようにする */
    function placeWives(v, x) {
      var wives = v.c.filter(function (cv) { return cv.d.spouse; });
      var w0 = wives[0];
      var w1 = wives[1];
      v.spineX = v.nameX + textW(nameOf(v.d), FS) / 2;
      var colW = v.w;
      wives.forEach(function (w) {
        measure(w);
        w.x = x + v.nameX;
        nodes.push(w);
        colW = Math.max(colW, v.nameX + w.w);
      });
      v.colW = colW;
      var childX = x + colW + GAP;
      var placeKids = function (w) {
        w.c.forEach(function (cv) { place(cv, childX + extraGap(cv), false); });
      };

      // 1人目の妻と、その子
      cursor += COUPLE;
      placeKids(w0);
      var eqA = w0.c.length ? w0.c[w0.c.length - 1].inY : cursor + COUPLE;
      w0.y = w0.inY = eqA - COUPLE;
      v.eqA = eqA;
      v.y = v.inY = eqA + COUPLE;
      cursor = Math.max(cursor, v.y + ROW / 2 + (v.d.sub ? SUB : 0));
      if (!w1) return;

      // 2人目の妻と、その子。子が全員末端なら＝B の高さにそろえて詰め、そうでなければ下に続ける
      var eqB = v.y + COUPLE;
      v.eqB = eqB;
      w1.y = w1.inY = eqB + COUPLE;
      var compact = w1.c.length && w1.c.every(function (cv) { return !cv.c.length && !cv.d.wife; }) &&
        !(w0.c.length && (w0.c[w0.c.length - 1].d.wife));
      var saved = cursor;
      if (compact) {
        // ＝B の高さを中心に並べる。ただし1人目の妻の最後の子（とその札）とは1段以上離す
        var lastA = w0.c[w0.c.length - 1];
        var minTop = lastA ? lastA.inY + ROW / 2 + (lastA.d.sub ? SUB : 0) : 0;
        cursor = Math.max(eqB - w1.c.length * ROW / 2, minTop);
      }
      placeKids(w1);
      cursor = Math.max(saved, cursor, w1.y + ROW / 2);
    }

    var maxX = 0;
    nodes.forEach(function (v) {
      var right = v.x + v.w;
      if (right > maxX) maxX = right;
    });
    return { nodes: nodes, width: Math.ceil(maxX + PAD), height: Math.ceil(cursor + PAD) };
  }

  /* ---------- 描画 ---------- */
  function el(name, attrs, parent) {
    var e = document.createElementNS(SVGNS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  function drawEdges(g, v) {
    if (!v.c.length) return;
    if (v.spineX !== undefined) return drawSpouseEdges(g, v);
    var cls = 'fk-edge' + (v.mode === 'ctx' ? ' is-ctx' : '');
    // 夫婦は縦の「＝」の中央から、それ以外は名前の右端から線を出す
    var startX = v.d.wife ? v.x + v.eqX + 2 : v.x + v.textW + 3;
    drawBranch(g, startX, v.y, v.x + v.w + GAP / 2, v.c, cls);
  }

  // 親から子へ：fromX,fromY から横線を barX まで引き、縦線で子を束ねて各子へ横線を引く
  function drawBranch(g, fromX, fromY, barX, kids, cls) {
    el('path', { d: 'M' + fromX + ' ' + fromY + 'H' + barX, class: cls }, g);
    var topY = Math.min(fromY, kids[0].inY);
    var bottomY = Math.max(fromY, kids[kids.length - 1].inY);
    if (bottomY > topY) el('path', { d: 'M' + barX + ' ' + topY + 'V' + bottomY, class: cls }, g);
    kids.forEach(function (cv) {
      var c = 'fk-edge' + (cv.mode === 'ctx' ? ' is-ctx' : '') + (cv.dash ? ' is-dash' : '');
      el('path', { d: 'M' + barX + ' ' + cv.inY + 'H' + (cv.x - 3), class: c }, g);
      if (cv.d.adopt) {
        // 「養子」は親から子への線の中央に置く（子が1人なら親の右端から、複数なら縦線から子まで）
        var lineStart = kids.length === 1 ? fromX : barX;
        var midX = (lineStart + cv.x - 3) / 2;
        el('text', { class: 'fk-adopt' + (cv.mode === 'ctx' ? ' is-ctx' : ''), x: midX, y: cv.inY - 6 }, g).textContent = EN ? EN.ui.adopt : '養子';
      }
      drawEdges(g, cv);
    });
  }

  // 縦の「＝」（二重線）
  function drawEq(g, x, y1, y2, cls) {
    el('path', { d: 'M' + (x - 2) + ' ' + y1 + 'V' + y2 + 'M' + (x + 2) + ' ' + y1 + 'V' + y2, class: cls }, g);
  }

  // 妻が2人：夫と各妻の間に「＝」を引き、その中ほどから各妻の子へ線を出す
  function drawSpouseEdges(g, v) {
    var sx = v.x + v.spineX;
    var barX = v.x + v.colW + GAP / 2;
    var wives = v.c.filter(function (cv) { return cv.d.spouse; });
    [[wives[0], v.eqA, wives[0] && wives[0].y, v.y], [wives[1], v.eqB, v.y + (v.d.sub ? 19 : 0), wives[1] && wives[1].y]]
      .forEach(function (a) {
        var w = a[0];
        if (!w) return;
        var cls = 'fk-edge' + (w.mode === 'ctx' ? ' is-ctx' : '');
        drawEq(g, sx, a[2] + 9, a[3] - 9, cls);
        if (w.c.length) drawBranch(g, sx + 2, a[1], barX, w.c, cls);
      });
  }

  /* ツールチップ（tippy.js）の中身。他のページ（js/tooltips.js）と同じく「h3 見出し＋説明」の形にする
    文面は js/fujiwara-keizu-tooltips.js（window.FK_TOOLTIPS）に書いたとおりに出す。
    そこに無い人物は「藤原＋名前」に、歌番号・摂政関白の行を自動で付ける */
  function tooltipLines(d) {
    var tips = EN ? EN.tips : (window.FK_TOOLTIPS || {});
    var t = tips[d.key || d.n];
    if (t && t.length) return t;
    if (EN) {
      var en = [fmt(EN.ui.fallbackTitle, { name: nameOf(d) })];
      if (d.p) en.push(fmt(EN.ui.fallbackPoet, { p: d.p }));
      if (d.k) en.push(EN.ui.fallbackKanpaku);
      return en;
    }
    var lines = ['藤原' + d.n];
    if (d.p) lines.push('百人一首' + d.p + '番の歌人');
    if (d.k) lines.push('摂政・関白になった人物');
    return lines;
  }

  // 「項目：本文」の行は、項目と本文を分けて、本文が折り返しても「：」の後ろにそろうようにする（css/fujiwara-keizu.css の .fk-tip-label）
  function tipLineHtml(line, cls) {
    // 英語版は「Label: 本文」
    var m = EN ? line.match(/^([^:<]{1,40}: )([\s\S]*)$/) : line.match(/^([^：<]{1,8}：)([\s\S]*)$/);
    var body = m ? '<span class="fk-tip-label">' + m[1] + '</span><span class="fk-tip-body">' + m[2] + '</span>' : line;
    return '<div class="fk-tip-line' + (cls ? ' ' + cls : '') + (m ? ' has-label' : '') + '">' + body + '</div>';
  }

  // 説明は1行ずつ div にする。1行まるごと <u>…</u> で囲んだ行は、見出しの下と同じ幅いっぱいの罫線にする
  function tooltipHtml(d) {
    var lines = tooltipLines(d);
    var body = lines.slice(1).map(function (line) {
      var m = line.match(/^<u>(.*)<\/u>$/);
      return m ? tipLineHtml(m[1], 'is-rule') : tipLineHtml(line);
    });
    // 歌人のツールチップの中に歌のページへのリンクのボタンを置く（PC・スマホとも）
    if (d.p) {
      body.push('<a class="fk-tip-link" href="' + poemHref(d.p) + '">' + (EN ? fmt(EN.ui.poemLink, { p: d.p }) : d.p + '番の歌のページへ') + '</a>');
    }
    return '<h3>' + lines[0] + '</h3>' + body.join('');
  }

  /* 家名の札（北家・九条流・近衛など）から、その家の絞り込みボタンを探す
    本人か、いちばん近い祖先の id を起点（FILTERS のキー、または roots）にしているボタン。見つからなければ null */
  function filterKeyFor(d) {
    for (var a = d; a; a = a.parent) {
      if (!a.id) continue;
      if (FILTERS[a.id] && FILTERS[a.id].roots) return a.id;
      for (var key in FILTERS) {
        if (FILTERS[key].roots && FILTERS[key].roots.indexOf(a.id) >= 0) return key;
      }
    }
    return null;
  }

  // 札をクリックすると、その家のボタンを押したのと同じように絞り込む
  function tagGroup(parent, d) {
    var key = filterKeyFor(d);
    if (!key) return parent;
    var on = state.filter === key;
    return el('g', {
      class: 'fk-tag' + (on ? ' is-on' : ''),
      'data-filter': key,
      role: 'button',
      tabindex: 0,
      'aria-pressed': on ? 'true' : 'false',
      'aria-label': EN ? (on ? EN.ui.tagOff : fmt(EN.ui.tagOn, { label: FILTERS[key].label })) : (on ? '全体の表示に戻す' : FILTERS[key].label + 'で絞り込む')
    }, parent);
  }

  function drawNode(g, v) {
    var d = v.d;
    var title = d.p ? poemTitle(tooltipLines(d)[0], d.p) : tooltipLines(d)[0];

    var cls = 'fk-node' + (v.mode === 'ctx' ? ' is-ctx' : '') + (d.k ? ' is-kanpaku' : '') + (d.p ? ' is-poet' : '');
    var node = el('g', { class: cls, transform: 'translate(' + v.x + ',' + v.inY + ')' }, g);
    node.setAttribute('data-tippy-content', tooltipHtml(d));

    if (d.pre) {
      var preTag = tagGroup(node, d);
      el('rect', { class: 'fk-pre-box', x: 0, y: -9, width: v.preW, height: 18, rx: 2 }, preTag);
      el('text', { class: 'fk-pre', x: v.preW / 2, y: 0.5 }, preTag).textContent = lab(d.pre);
    }

    // 歌人は名前とバッジをまとめて歌のページへのリンクにする
    // ホバーで名前の背景に色を付ける（歌人以外も）。歌人はリンクにする
    var target = d.p
      ? el('a', { href: poemHref(d.p), 'aria-label': title }, node)
      : el('g', { class: 'fk-main' }, node);
    el('rect', { class: 'fk-hit', x: v.nameX - 2, y: -13, width: v.mainW - v.nameX + 4, height: 26 }, target);
    el('text', { class: 'fk-name', x: v.nameX, y: 0.5 }, target).textContent = nameOf(d);
    if (d.note) {
      el('text', { class: 'fk-note', x: v.noteX, y: 1 }, target).textContent = EN ? ' (' + lab(d.note) + ')' : '（' + d.note + '）';
    }
    if (d.p) {
      el('circle', { class: 'fk-badge', cx: v.badgeCx, cy: 0, r: BADGE_R }, target);
      el('text', { class: 'fk-badge-num', x: v.badgeCx, y: 0.5 }, target).textContent = d.p;
    }
    if (d.sub) {
      // 札の幅は measure() で人物の幅に含めてあるので、子への線（縦線）とは重ならない
      var sw = textW(lab(d.sub), NOTE_FS) + 12;
      var subTag = tagGroup(node, d);
      el('rect', { class: 'fk-sub-box', x: v.nameX, y: 11, width: sw, height: 16, rx: 8 }, subTag);
      el('text', { class: 'fk-sub', x: v.nameX + sw / 2, y: 19.5 }, subTag).textContent = lab(d.sub);
    }
    if (d.wife) drawWife(g, v);
  }

  // band：本人から、子が1人ずつ続く最後の子孫までの下に、1本の札をまたがらせる
  function drawBand(g, v) {
    var last = v;
    while (last.c.length === 1 && !last.c[0].d.spouse) last = last.c[0];
    var x1 = v.x + v.nameX - 2;
    var x2 = last.x + last.textW + 2;
    var ctx = v.mode === 'ctx' ? ' is-ctx' : '';
    var band = tagGroup(el('g', { class: 'fk-node' + ctx }, g), v.d);
    el('rect', { class: 'fk-sub-box', x: x1, y: v.inY + 11, width: x2 - x1, height: 16, rx: 8 }, band);
    el('text', { class: 'fk-sub', x: (x1 + x2) / 2, y: v.inY + 19.5 }, band).textContent = lab(v.d.band);
  }

  // 妻は本人の真下に、本人とは別の g で描く（本人のツールチップと重ならないように）
  // 本人と妻の間は縦の「＝」（二重線）でつなぐ
  function drawWife(g, v) {
    var w = v.d.wife;
    var ctx = v.mode === 'ctx' ? ' is-ctx' : '';
    var ex = v.x + v.eqX;
    var y1 = v.y - COUPLE + 9;
    var y2 = v.y + COUPLE - 9;
    el('path', { d: 'M' + (ex - 2) + ' ' + y1 + 'V' + y2 + 'M' + (ex + 2) + ' ' + y1 + 'V' + y2, class: 'fk-edge fk-eq' + ctx }, g);
    var node = el('g', {
      class: 'fk-node fk-wife' + ctx + (w.p ? ' is-poet' : ''),
      transform: 'translate(' + (v.x + v.nameX) + ',' + (v.y + COUPLE) + ')'
    }, g);
    node.setAttribute('data-tippy-content', tooltipHtml(w));
    var target = w.p
      ? el('a', { href: poemHref(w.p), 'aria-label': poemTitle(tooltipLines(w)[0], w.p) }, node)
      : el('g', { class: 'fk-main' }, node);
    el('rect', { class: 'fk-hit', x: -2, y: -13, width: v.wifeW - v.nameX + 4, height: 26 }, target);
    el('text', { class: 'fk-name', x: 0, y: 0.5 }, target).textContent = nameOf(w);
    if (w.p) {
      var cx = v.wifeBadgeCx - v.nameX;
      el('circle', { class: 'fk-badge', cx: cx, cy: 0, r: BADGE_R }, target);
      el('text', { class: 'fk-badge-num', x: cx, y: 0.5 }, target).textContent = w.p;
    }
  }

  /* ---------- 画面 ---------- */
  var chart = document.getElementById('fkChart');
  if (!chart) return;
  var descEl = document.getElementById('fkDesc');
  var filterBox = document.getElementById('fkFilters');
  var zoomLabel = document.getElementById('fkZoomLabel');

  // 期間のスライダーの範囲：系図の人物の生存期間がすべて入るよう、10年単位で切る
  var YEAR_MIN = Infinity;
  var YEAR_MAX = -Infinity;
  (function scanYears(d) {
    [d.key || d.n].concat(d.wife ? [d.wife.n] : []).forEach(function (name) {
      var s = lifeSpan(name);
      if (!s) return;
      YEAR_MIN = Math.min(YEAR_MIN, Math.floor(s[0] / 10) * 10);
      YEAR_MAX = Math.max(YEAR_MAX, Math.ceil(s[1] / 10) * 10);
    });
    d.c.forEach(scanYears);
  })(TREE);

  var state = { filter: 'all', scale: 1, years: [YEAR_MIN, YEAR_MAX] };
  var current = null; // { svg, width, height }
  var tips = [];       // tippy のインスタンス（描き直すたびに破棄する）

  function yearActive() {
    return state.years[0] > YEAR_MIN || state.years[1] < YEAR_MAX;
  }

  // 期間のスライダーが全期間でなければ、選んでいる家の絞り込みに「その期間に生きていた」条件を重ねる
  function currentFilter() {
    var base = FILTERS[state.filter];
    if (!yearActive()) return base;
    var from = state.years[0];
    var to = state.years[1];
    var inBase = base.pick || (base.roots
      ? function (d) {
        return base.roots.some(function (id) {
          for (var a = d; a; a = a.parent) if (a === byId[id]) return true;
          return false;
        });
      }
      : function () { return true; });
    return {
      label: EN ? base.label + ', ' + fmt(EN.ui.years, { from: from, to: to }) : base.label + '・' + from + '年～' + to + '年',
      pick: function (d) { return inBase(d) && aliveIn(d, from, to); },
      desc: base.desc + (EN ? fmt(EN.ui.yearsDesc, { from: from, to: to }) : ' そのうち、' + from + '年～' + to + '年に生きていた人物を表示しています。')
    };
  }

  function applyScale() {
    if (!current) return;
    current.svg.setAttribute('width', Math.round(current.width * state.scale));
    current.svg.setAttribute('height', Math.round(current.height * state.scale));
    zoomLabel.textContent = Math.round(state.scale * 100) + '%';
  }

  function render() {
    var filter = currentFilter();
    var view = buildView(filter);
    if (!view) {
      // 期間内に生きていた人物がいない
      tips.forEach(function (t) { t.destroy(); });
      tips = [];
      var empty = document.createElement('p');
      empty.className = 'fk-empty';
      empty.textContent = EN ? EN.ui.empty : 'この期間に生きていた人物は、系図にいません。';
      chart.replaceChildren(empty);
      current = null;
      descEl.textContent = filter.desc;
      markFilterButtons();
      return;
    }
    var lay = layout(view);

    var svg = el('svg', {
      viewBox: '0 0 ' + lay.width + ' ' + lay.height,
      role: 'img',
      'aria-label': EN ? fmt(EN.ui.svgLabel, { label: filter.label }) : '藤原氏の略系図（' + filter.label + '）',
      class: 'fk-svg'
    });
    drawEdges(el('g', { class: 'fk-edges' }, svg), view);
    var nodesG = el('g', {}, svg);
    lay.nodes.forEach(function (v) { drawNode(nodesG, v); });
    lay.nodes.forEach(function (v) { if (v.d.band) drawBand(nodesG, v); });

    tips.forEach(function (t) { t.destroy(); });
    chart.replaceChildren(svg);
    if (window.tippy) {
      // theme: 'fk' … 系図のツールチップだけに効くスタイル（css/fujiwara-keizu.css の [data-theme~="fk"]）
      // ツールチップの中のリンクのボタンを押せるよう、マウスがツールチップに移っても閉じないようにする（PC・スマホとも）。
      // interactive は body に置かないと SVG の中に入ってしまう。斜めに動かしても途中で消えないよう、周りの余白を広めにとる
      var opts = { allowHTML: true, theme: 'fk', interactive: true, interactiveBorder: 20, appendTo: document.body,
        onShow: showOnlyThis, onHidden: forgetTip, onDestroy: forgetTip,
        // 位置は名前の四角（.fk-hit）に合わせる。ノード全体だと、上の代数の札や下の札の分だけツールチップが離れてしまう
        onCreate: function (inst) {
          var hit = inst.reference.querySelector('.fk-hit');
          if (hit) inst.setProps({ getReferenceClientRect: function () { return hit.getBoundingClientRect(); } });
        }
      };
      tips = tippy(svg.querySelectorAll('[data-tippy-content]'), opts);
    }
    current = { svg: svg, width: lay.width, height: lay.height };
    applyScale();

    // 絞り込み時は、表示対象の先頭が見える位置までスクロールする
    var firstOn = lay.nodes.filter(function (v) { return v.mode === 'on'; })[0];
    chart.scrollLeft = (state.filter === 'all' && !yearActive()) || !firstOn ? 0 : Math.max(0, (firstOn.x - 60) * state.scale);
    chart.scrollTop = 0;

    descEl.textContent = filter.desc;
    markFilterButtons();
  }

  function markFilterButtons() {
    Array.prototype.forEach.call(filterBox.querySelectorAll('button'), function (b) {
      b.setAttribute('aria-pressed', b.dataset.filter === state.filter ? 'true' : 'false');
    });
  }

  /* 期間のスライダー（つまみ2つ：始まりの年・終わりの年）
    動かしている間は描き直しを1フレームに1回にまとめる。全期間に戻すと、通常の表示（期間の条件なし）になる */
  var yearFromEl = document.getElementById('fkYearFrom');
  var yearToEl = document.getElementById('fkYearTo');
  var yearTextEl = document.getElementById('fkYearText');
  var yearRangeEl = document.getElementById('fkYearRange');
  var yearResetEl = document.getElementById('fkYearReset');
  var yearFrame = 0;

  function showYears() {
    yearFromEl.value = state.years[0];
    yearToEl.value = state.years[1];
    yearTextEl.textContent = EN ? fmt(EN.ui.years, { from: state.years[0], to: state.years[1] }) : state.years[0] + '年～' + state.years[1] + '年';
    // つまみの間の帯（css/fujiwara-keizu.css の --from / --to）
    if (yearRangeEl.style.setProperty) {
      yearRangeEl.style.setProperty('--from', (state.years[0] - YEAR_MIN) / (YEAR_MAX - YEAR_MIN) * 100 + '%');
      yearRangeEl.style.setProperty('--to', (state.years[1] - YEAR_MIN) / (YEAR_MAX - YEAR_MIN) * 100 + '%');
    }
    yearResetEl.disabled = !yearActive();
  }

  function setYears(from, to) {
    state.years = [Math.min(from, to), Math.max(from, to)];
    showYears();
    if (yearFrame) return;
    var later = function () {
      yearFrame = 0;
      render();
    };
    yearFrame = window.requestAnimationFrame ? window.requestAnimationFrame(later) : setTimeout(later, 16);
  }

  [yearFromEl, yearToEl].forEach(function (input) {
    input.min = YEAR_MIN;
    input.max = YEAR_MAX;
    input.step = 1;
  });
  // つまみが追い越さないよう、もう一方の値で止める
  yearFromEl.addEventListener('input', function () {
    var v = Math.min(+yearFromEl.value, state.years[1]);
    setYears(v, state.years[1]);
  });
  yearToEl.addEventListener('input', function () {
    var v = Math.max(+yearToEl.value, state.years[0]);
    setYears(state.years[0], v);
  });
  yearResetEl.addEventListener('click', function () { setYears(YEAR_MIN, YEAR_MAX); });
  showYears();

  // 絞り込みボタンを生成
  Object.keys(FILTERS).forEach(function (key) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'fk-filter';
    b.dataset.filter = key;
    b.textContent = FILTERS[key].label;
    filterBox.appendChild(b);
  });

  function setFilter(key) {
    state.filter = key;
    try { history.replaceState(null, '', state.filter === 'all' ? location.pathname : '#' + state.filter); } catch (err) { /* noop */ }
    render();
  }

  filterBox.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-filter]');
    if (!b) return;
    setFilter(b.dataset.filter);
  });

  // 系図の中の家名の札（北家・九条流・近衛など）：ボタンと同じく絞り込む。
  // トグル：すでにその家で絞り込んでいるときにもう一度押すと、全体に戻す
  function toggleTag(tag) {
    var key = tag.getAttribute('data-filter');
    setFilter(state.filter === key ? 'all' : key);
    keepChartInView();
  }

  // 絞り込みで系図の高さが変わると、系図が画面の上に外れて見えなくなることがある。
  // 系図の上端が画面の上に出ている（または画面の下のほうにある）ときは、上端が見える位置までスクロールする
  function keepChartInView() {
    var top = chart.getBoundingClientRect().top;
    if (top >= 0 && top <= window.innerHeight * 0.5) return;
    window.scrollTo({ top: window.scrollY + top - 12, behavior: 'smooth' });
  }
  chart.addEventListener('click', function (e) {
    var tag = e.target.closest('.fk-tag');
    if (tag) toggleTag(tag);
  });
  chart.addEventListener('keydown', function (e) {
    var tag = e.target.closest && e.target.closest('.fk-tag');
    if (!tag || (e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault();
    toggleTag(tag);
  });

  function setScale(s) {
    state.scale = Math.min(2, Math.max(0.3, Math.round(s * 100) / 100));
    applyScale();
  }
  document.getElementById('fkZoomIn').addEventListener('click', function () { setScale(state.scale + 0.1); });
  document.getElementById('fkZoomOut').addEventListener('click', function () { setScale(state.scale - 0.1); });
  document.getElementById('fkZoomReset').addEventListener('click', function () { setScale(1); });
  document.getElementById('fkZoomFit').addEventListener('click', function () {
    if (current) setScale((chart.clientWidth - 4) / current.width);
  });

  /* ---------- マウスのドラッグで移動 ----------
    横は枠内（scrollLeft）、縦は枠の高さが auto なのでページごと動かす。
    タッチ操作はブラウザ標準のスワイプに任せる。
  */
  var drag = null;
  chart.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    e.preventDefault(); // 文字選択・リンクのドラッグを防ぐ
    drag = { x: e.clientX, y: e.clientY, left: chart.scrollLeft, top: window.scrollY, moved: false };
  });
  window.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var dx = e.clientX - drag.x;
    var dy = e.clientY - drag.y;
    if (!drag.moved) {
      if (Math.abs(dx) + Math.abs(dy) < 5) return; // わずかな動きはクリック扱い
      drag.moved = true;
      chart.classList.add('is-dragging');
    }
    chart.scrollLeft = drag.left - dx;
    window.scrollTo(window.scrollX, drag.top - dy);
  });
  window.addEventListener('pointerup', function () {
    if (!drag) return;
    if (drag.moved) {
      chart.classList.remove('is-dragging');
      // ドラッグ直後のクリックで歌のページへ移動しないようにする
      var block = function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
      };
      chart.addEventListener('click', block, true);
      // 枠の外で離したときは click が来ないので、次の操作に残さない
      setTimeout(function () { chart.removeEventListener('click', block, true); }, 0);
    }
    drag = null;
  });
  chart.addEventListener('dragstart', function (e) { e.preventDefault(); });

  // 歌人をクリック・タップしてもすぐには移動せず、ツールチップを開くだけにする（移動はツールチップの中のボタンから。PC・スマホとも）。
  // キーボードの Enter（detail が 0）では、そのまま歌のページへ移動する
  chart.addEventListener('click', function (e) {
    if (e.detail > 0 && e.target.closest('a')) e.preventDefault();
  });

  // URL の #nanke などで初期表示の家を指定できる
  var hash = location.hash.replace('#', '');
  if (FILTERS[hash]) state.filter = hash;
  if (window.matchMedia('(max-width: 750px)').matches) state.scale = 0.8;
  render();
})();
