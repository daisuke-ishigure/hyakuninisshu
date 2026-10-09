/* --------------------------------------------
天皇の略系図（tenno-keizu.html・英語版 tenno-keizu_en.html）
系図データから SVG を組み立て、ボタンで系統ごとに絞り込む
英語版は js/tenno-keizu_en.js（window.TK_EN）を先に読み込む。TK_EN があると、名前・氏の札・線の文字・ツールチップ・
ボタン・説明文を英語にし、名前の幅を英字の字幅（TK_EN.widths）で見積もる。系図のデータと生没年（期間のスライダー）は日本語のものをそのまま使う
描き方は藤原氏の略系図（js/fujiwara-keizu.js）と同じ。スタイルも css/fujiwara-keizu.css を共用する
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
    k: 天皇（青字）。t: 何代目の天皇か（名前の上の青い札とツールチップに出す。重祚は '46·48' のように文字列で）
    p: 百人一首の歌番号（番号バッジ＋歌のページへのリンク）
    pre: 名前の前の赤枠 / sub: 賜姓された氏などの札（名前の下） / note: 名前の後ろの注記
    band: 一列に続く子孫（子が1人ずつ）の下にまたがる札
    dash: 親との間を点線（系譜不明・異説・数代省略）で結ぶ
    lbl: 親との間の線に書く文字（例：「系譜不明」「実父説」）
    adopt: 親の養子。親との間の線に「養子」と書く
    wife: 妻（{ n, p }）。本人の下に並べて縦の「＝」でつなぐ
    spouse: この人物は親の妻（js/fujiwara-keizu.js と同じ）
    marry: 別の系統にいる配偶者の名前。その人物（本人より上の段に置くこと）と本人を同じ列にそろえ、縦の「＝」で結ぶ
           配偶者の列が本人より左なら本人を右へ、右なら配偶者を右へずらす。＝が間の段の人物と重ならないよう、並び順に注意
    id: 絞り込みの起点 / key: ツールチップを探す名前（同じ名前が2人いるときだけ。省略時は名前）
    hidden: 名前を出さない人物（起点で、子どうしを線だけで結ぶ）
    ※ツールチップの文面は js/tenno-keizu-tooltips.js にまとめています
    ※画像版の系図との違い：平真材（「直材」を訂正）、志貴皇子は持統天皇の子ではなく天智天皇の子
  */
  function N(n, o, c) {
    var node = o || {};
    node.n = n;
    node.c = c || [];
    return node;
  }

  // 天智天皇と天武天皇は兄弟。親は表示せず、2人を線だけで結ぶ（hidden）
  var TREE = N('', { hidden: 1 }, [
    N('天智', { k: 1, t: 38, p: 1, id: 'tenji' }, [
      N('弘文', { k: 1, t: 39 }),
      N('志貴皇子', {}, [
        N('光仁', { k: 1, t: 49 }, [
          N('桓武', { k: 1, t: 50, id: 'kanmu' }, [
            N('平城', { k: 1, t: 51 }, [
              N('阿保親王', { sub: '在原氏', id: 'ariwara' }, [
                N('在原行平', { p: 16 }),
                N('在原業平', { p: 17 })
              ])
            ]),
            N('嵯峨', { k: 1, t: 52, id: 'saga' }, [
              N('仁明', { k: 1, t: 54 }, [
                N('文徳', { k: 1, t: 55 }, [
                  N('清和', { k: 1, t: 56 }, [
                    N('陽成', { k: 1, t: 57, p: 13 }, [
                      N('元良親王', { p: 20 })
                    ]),
                    N('貞純親王', { id: 'seiwagenji' }, [
                      N('源経基', { sub: '清和源氏' }, [
                        N('源満仲', {}, [
                          N('源頼光', {}, [
                            N('源頼国', {}, [
                              N('源頼綱', {}, [
                                N('源仲政', {}, [
                                  N('源頼政', {}, [
                                    N('二条院讃岐', { p: 92 })
                                  ])
                                ])
                              ])
                            ]),
                            // 相模は頼光の養女（実父は不詳）
                            N('相模', { p: 65, lbl: '養女' })
                          ]),
                          N('源頼信', {}, [
                            N('源頼義', {}, [
                              N('源義家', {}, [
                                N('源義親', {}, [
                                  N('源為義', {}, [
                                    N('源義朝', {}, [
                                      N('源頼朝', {}, [
                                        N('源実朝', { p: 93 })
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
                    N('貞元親王', { id: 'seiwagenji2' }, [
                      N('源兼信', { sub: '清和源氏' }, [
                        N('源重之', { p: 48 })
                      ])
                    ])
                  ])
                ]),
                N('光孝', { k: 1, t: 58, p: 15, id: 'koko' }, [
                  N('宇多', { k: 1, t: 59 }, [
                    N('醍醐', { k: 1, t: 60 }, [
                      N('朱雀', { k: 1, t: 61 }),
                      // 徽子女王（斎宮女御）は叔父にあたる村上天皇の女御
                      N('重明親王', {}, [
                        N('徽子女王')
                      ]),
                      N('村上', { k: 1, t: 62 }, [
                        N('冷泉', { k: 1, t: 63 }, [
                          N('三条', { k: 1, t: 67, p: 68 }, [
                            N('敦明親王', { id: 'sanjogenji' }, [
                              N('源基平', { sub: '三条源氏' }, [
                                N('行尊', { p: 66 })
                              ])
                            ])
                          ]),
                          N('花山', { k: 1, t: 65 })
                        ]),
                        N('円融', { k: 1, t: 64 }, [
                          // 一条天皇の后：上に藤原定子、下に藤原彰子（spouse）。子はそれぞれの后の下に置く
                          N('一条', { k: 1, t: 66 }, [
                            N('藤原定子', { spouse: 1 }, [
                              N('脩子内親王')
                            ]),
                            N('藤原彰子', { spouse: 1 }, [
                              N('後一条', { k: 1, t: 68 }),
                              N('後朱雀', { k: 1, t: 69 }, [
                                N('後冷泉', { k: 1, t: 70 }),
                                N('祐子内親王'),
                                N('後三条', { k: 1, t: 71 }, [
                                  N('白河', { k: 1, t: 72 }, [
                                    N('堀河', { k: 1, t: 73 }, [
                                      // 鳥羽天皇の后：上に待賢門院（藤原璋子）、下に美福門院（藤原得子）
                                      N('鳥羽', { k: 1, t: 74 }, [
                                        N('待賢門院', { spouse: 1 }, [
                                          N('崇徳', { k: 1, t: 75, p: 77, wife: { n: '皇嘉門院' } }),
                                          N('後白河', { k: 1, t: 77 }, [
                                            N('二条', { k: 1, t: 78 }, [
                                              N('六条', { k: 1, t: 79 })
                                            ]),
                                            N('殷富門院'),
                                            N('以仁王'),
                                            N('高倉', { k: 1, t: 80 }, [
                                              N('安徳', { k: 1, t: 81 }),
                                              N('後鳥羽', { k: 1, t: 82, p: 99 }, [
                                                N('土御門', { k: 1, t: 83 }),
                                                N('順徳', { k: 1, t: 84, p: 100 })
                                              ])
                                            ]),
                                            N('式子内親王', { p: 89 })
                                          ])
                                        ]),
                                        N('美福門院', { spouse: 1 }, [
                                          N('近衛', { k: 1, t: 76 })
                                        ])
                                      ])
                                    ])
                                  ])
                                ])
                              ])
                            ])
                          ])
                        ]),
                        N('具平親王', { id: 'murakamigenji' }, [
                          N('源師房', { sub: '村上源氏' }, [
                            N('源顕房', {}, [
                              N('源顕仲', {}, [
                                N('待賢門院堀河', { p: 80 })
                              ])
                            ]),
                            N('源師忠', {}, [
                              N('源師隆', {}, [
                                N('源俊隆', {}, [
                                  N('皇嘉門院別当', { p: 88 })
                                ])
                              ])
                            ])
                          ])
                        ])
                      ])
                    ]),
                    // 妻の伊勢（百人一首19番）との子が中務
                    N('敦慶親王', { wife: { n: '伊勢', p: 19 } }, [
                      N('中務')
                    ]),
                    N('敦実親王', { id: 'udagenji' }, [
                      N('源雅信', { sub: '宇多源氏' }, [
                        N('源時中', {}, [
                          N('源朝任', {}, [
                            N('源師良', {}, [
                              N('源俊輔', {}, [
                                N('源兼昌', { p: 78 })
                              ])
                            ])
                          ])
                        ])
                      ]),
                      N('源重信', { sub: '宇多源氏' }, [
                        N('源道方', {}, [
                          N('源経信', { p: 71 }, [
                            N('源俊頼', { p: 74 }, [
                              N('俊恵', { p: 85 })
                            ])
                          ])
                        ])
                      ])
                    ])
                  ]),
                  N('是忠親王', { id: 'koretada' }, [
                    N('源宗于', { p: 28, sub: '光孝源氏' }),
                    N('興我王', {}, [
                      N('篤行王', {}, [
                        N('平兼盛', { p: 40, sub: '光孝平氏' }, [
                          N('赤染衛門', { p: 59, dash: 1, lbl: '実父説' })
                        ])
                      ])
                    ])
                  ]),
                  // 光孝天皇の第十四皇子。信明は中務の夫の一人
                  N('源国紀', { sub: '光孝源氏', id: 'kuninori' }, [
                    N('源公忠', {}, [
                      N('源信明')
                    ])
                  ])
                ])
              ]),
              N('源融', { p: 14, sub: '嵯峨源氏', id: 'sagagenji' }),
              N('源弘', { sub: '嵯峨源氏', id: 'sagagenji2' }, [
                N('源希', {}, [
                  N('源等', { p: 39 })
                ])
              ]),
              N('源定', { sub: '嵯峨源氏', id: 'sagagenji3' }, [
                N('源至', {}, [
                  N('源挙', {}, [
                    N('源順')
                  ])
                ])
              ])
            ]),
            N('淳和', { k: 1, t: 53 }),
            N('葛原親王', { id: 'kanmuheishi' }, [
              N('高棟王', { sub: '桓武平氏' }, [
                N('平惟範', {}, [
                  N('平時望', {}, [
                    N('平真材', {}, [
                      N('平親信', {}, [
                        N('平重義', {}, [
                          N('平棟仲', {}, [
                            N('周防内侍', { p: 67 })
                          ])
                        ])
                      ])
                    ])
                  ])
                ])
              ])
            ]),
            N('良岑安世', { sub: '良岑氏', id: 'yoshimine' }, [
              N('遍昭', { p: 12 }, [
                N('素性', { p: 21 })
              ])
            ])
          ])
        ])
      ]),
      // 草壁皇子の妃。草壁の列までずらして、持統の上から＝でつなぐ
      N('元明', { k: 1, t: 43 }),
      // 天武天皇の皇后。天武の真上に来るよう、天智の子の最後に置く
      N('持統', { k: 1, t: 41, p: 2 })
    ]),
    N('天武', { k: 1, t: 40, id: 'tenmu', marry: '持統' }, [
      // 天武天皇と持統天皇の子。妃は天智天皇の皇女・元明天皇
      N('草壁皇子', { marry: '元明' }, [
        N('文武', { k: 1, t: 42 }, [
          N('聖武', { k: 1, t: 45 }, [
            // 孝謙天皇が重祚して称徳天皇となった（同じ人物）
            N('孝謙・称徳', { k: 1, t: '46·48' })
          ])
        ]),
        N('元正', { k: 1, t: 44 })
      ]),
      // 貞代王の父は不明。子の有雄王は天武天皇の五世孫とされる
      N('舎人親王', { id: 'kiyohara' }, [
        N('淳仁', { k: 1, t: 47 }),
        N('貞代王', { dash: 1, lbl: '系譜不明' }, [
          N('清原有雄', { sub: '清原氏' }, [
            N('清原通雄', {}, [
              N('清原海雄', {}, [
                N('清原房則', {}, [
                  N('清原深養父', { p: 36 }, [
                    N('清原春光', {}, [
                      N('清原元輔', { p: 42 }, [
                        N('清少納言', { p: 62 })
                      ])
                    ])
                  ])
                ])
              ])
            ])
          ])
        ])
      ]),
      N('長皇子', { id: 'funya' }, [
        N('文室大市', { sub: '文室氏' }, [
          N('文屋康秀', { p: 22, dash: 1, lbl: '系譜不明' }, [
            N('文屋朝康', { p: 37 })
          ])
        ])
      ]),
      N('高市皇子', { id: 'takashina' }, [
        N('長屋王', {}, [
          N('桑田王', {}, [
            N('磯部王', {}, [
              N('石見王', {}, [
                N('高階峯緒', { sub: '高階氏' }, [
                  N('高階茂範', {}, [
                    N('高階師尚', {}, [
                      N('高階良臣', {}, [
                        N('高階成忠', {}, [
                          N('儀同三司母', { p: 54 })
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
      N('大津皇子')
    ])
  ]);

  /* ---------- 絞り込み ----------
    roots: 起点（id）の子孫すべてと、起点までの祖先を表示
    pick:  条件に合う人物と、その祖先だけを表示
    keep:  roots のとき、祖先のうち名前を残す人物。それ以外の祖先は省略し、点線（数代省略）でつなぐ
  */
  var FILTERS = {
    all: { label: '全体', desc: '天智天皇（第38代）と弟の天武天皇から、百人一首最後の歌人・順徳院（第84代）までの歴代天皇と、百人一首の歌人につながる主な人物を表示しています。' },
    tenno: { label: '天皇', pick: function (d) { return !!d.k; }, desc: 'この系図に登場する天皇を表示しています。壬申の乱（672年）ののち皇位は天武天皇の系統が継ぎましたが、称徳天皇のあと天智天皇の孫・光仁天皇が即位し、以後は天智天皇の系統に戻りました。' },
    tennoPoets: { label: '天皇の歌人', pick: function (d) { return !!d.k && !!d.p; }, desc: '百人一首には、天智天皇・持統天皇・陽成院・光孝天皇・三条院・崇徳院・後鳥羽院・順徳院の8人の天皇の歌が選ばれています。1番・2番の親子と、99番・100番の親子で始まり、終わるのも百人一首の特徴です。' },
    tenji: { label: '天智天皇の系統', roots: ['tenji'], desc: '天智天皇の子孫。天智天皇の孫・光仁天皇と、その子・桓武天皇から平安時代の天皇が続き、多くの皇族が源・平などの氏を賜って臣下となりました。' },
    tenmu: { label: '天武天皇の系統', roots: ['tenmu'], desc: '天武天皇の子孫。持統天皇との子・草壁皇子の系統から文武・元正・聖武・孝謙（称徳）天皇が、舎人親王の子から淳仁天皇が出ました。また、舎人親王・長皇子・高市皇子の子孫から清原氏・文室氏・高階氏が出て、百人一首の歌人も生まれました。' },
    ariwara: { label: '在原氏', roots: ['ariwara'], desc: '平城天皇の皇子・阿保親王の子の行平・業平らが、在原朝臣の姓を賜って臣籍に下りました。' },
    yoshimine: { label: '良岑氏', roots: ['yoshimine'], desc: '桓武天皇の皇子・安世が良岑朝臣の姓を賜って臣籍に下りました。安世の子が僧正遍昭（俗名・良岑宗貞）、その子が素性法師です。' },
    kanmuheishi: { label: '桓武平氏', roots: ['kanmuheishi'], desc: '桓武天皇の皇子・葛原親王の子の高棟王が平朝臣の姓を賜りました。高棟王の子孫は公家として続き、周防内侍もこの系統の出身です。' },
    sagagenji: { label: '嵯峨源氏', roots: ['sagagenji', 'sagagenji2', 'sagagenji3'], desc: '嵯峨天皇は多くの皇子・皇女に源朝臣の姓を与えて臣籍に下しました。これが賜姓源氏の始まりです。' },
    seiwagenji: { label: '清和源氏', roots: ['seiwagenji', 'seiwagenji2'], desc: '清和天皇の子孫の源氏。貞純親王の子・経基の子孫からは頼光・頼信などの武士が出て、頼信の子孫の頼朝が鎌倉幕府を開きました。' },
    koko: { label: '光孝天皇の系統', roots: ['koretada', 'kuninori'], desc: '光孝天皇の皇子・是忠親王と源国紀の子孫。是忠親王の子の源宗于（光孝源氏）や、曾孫とされる平兼盛（光孝平氏）、国紀の子孫の源公忠・信明父子（ともに三十六歌仙）が出ました。' },
    udagenji: { label: '宇多源氏', roots: ['udagenji'], desc: '宇多天皇の皇子・敦実親王の子の雅信・重信らが源朝臣の姓を賜りました。重信の子孫の経信・俊頼・俊恵は三代続けて百人一首に選ばれています。' },
    murakamigenji: { label: '村上源氏', roots: ['murakamigenji'], desc: '村上天皇の皇子・具平親王の子の師房が源朝臣の姓を賜りました。村上源氏は公家として栄え、のちに久我家などの家が分かれました。' },
    sanjogenji: { label: '三条源氏', roots: ['sanjogenji'], desc: '三条天皇の皇子・敦明親王（小一条院）の子の基平らが源朝臣の姓を賜って臣籍に下りました。敦明親王は皇太子となりましたが、藤原道長の圧力でその地位を退いています。基平の子が大僧正行尊です。' },
    kiyohara: { label: '清原氏', roots: ['kiyohara'], desc: '天武天皇の皇子・舎人親王の子孫の清原氏。深養父（清少納言の曾祖父）・元輔（清少納言の父）・清少納言の3人が百人一首に選ばれています。' },
    funya: { label: '文室氏', roots: ['funya'], desc: '天武天皇の皇子・長皇子の子の智努王・大市王の兄弟が、文室真人の姓を賜って臣籍に下りました。百人一首の文屋康秀・朝康父子はこの一族とされますが、系譜ははっきりしていません。' },
    takashina: { label: '高階氏', roots: ['takashina'], desc: '天武天皇の皇子・高市皇子の子孫。長屋王の子孫の峯緒が高階真人の姓を賜りました。高階成忠の娘・貴子（儀同三司母）は藤原道隆の妻となり、中宮定子や伊周を生みました。' },
    poets: { label: '百人一首の歌人', pick: function (d) { return !!d.p || !!(d.wife && d.wife.p); }, desc: 'この系図に登場する百人一首の歌人を表示しています。赤い番号をクリックすると歌のページへ移動します。' }
  };

  /* ---------- 英語版（js/tenno-keizu_en.js）。js/fujiwara-keizu.js と同じ ---------- */
  var EN = window.TK_EN || null;
  if (EN) {
    Object.keys(FILTERS).forEach(function (k) {
      var t = EN.filters[k];
      if (t) { FILTERS[k].label = t.label; FILTERS[k].desc = t.desc; }
    });
  }
  // 表示する名前（英語版は TK_EN.names。妻 { n, p } にも使う）
  function nameOf(d) { return EN ? (EN.names[d.key || d.n] || d.n) : d.n; }
  // 氏の札・線の文字など（英語版は TK_EN.labels）
  function lab(s) { return EN ? (EN.labels[s] || s) : s; }
  // 文字列の幅。日本語は全角1文字＝文字サイズ、英語は英字の字幅（TK_EN.widths、1000＝文字サイズ）で見積もる
  function textW(s, size) {
    s = String(s);
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
    js/fujiwara-keizu.js と同じ仕組み。生没年は、ふだんはツールチップ（js/tenno-keizu-tooltips.js）の「生没年：〇〇年～〇〇年」から読み取る。
    生年がわからない人物は、少なくとも YEAR_SPAN 年は生きていたものとする：
      没年がわかる → 没年の YEAR_SPAN 年前から没年まで（記録がもっと前からあれば、そこから）
      没年もわからない → 最初の記録の年から YEAR_SPAN 年後まで
    生没年がまったくわからない人物（源兼信・源俊輔・源師良・貞代王・清原通雄・清原海雄・清原房則・清原春光・磯部王・石見王・高階茂範）は
    期間の判定から外す（祖先としてだけ薄く出る）。

    LIFE … ツールチップに生没年が無い・「不明」などの人物を、ja.wikipedia・コトバンクの記録で補ったもの（キーはツールチップを探す名前）
      [年1, 年2, 種類]  種類 'life' … 生年～没年
                        'death' … 生きていたことが確かな最初の年（記録・子の誕生など）～没年
                        'record' … 記録に現れる最初の年～最後の年（没年は不明） */
  var YEAR_SPAN = 20;
  var LIFE = {
    '源顕仲': [1064, 1138, 'life'],       // 生年は1058年、または1064年
    '赤染衛門': [964, 1041, 'life'],      // 生年は956年頃（957～964年とする見方も）。没年は1041年以後
    '高階師尚': [864, 916, 'life'],       // 864～916年とされるが不詳
    '源義親': [1101, 1108, 'death'],      // 1101年 対馬守
    '貞元親王': [873, 910, 'death'],      // 873年 親王宣下
    '篤行王': [886, 910, 'death'],        // 平篤行。886年 臣籍降下
    '源国紀': [884, 909, 'death'],        // 884年 臣籍降下
    '源挙': [910, 930, 'death'],          // 子・源順が911年生まれ。930年に急死
    '清原有雄': [828, 858, 'death'],
    '文屋康秀': [860, 885, 'death'],      // 860年 中判事。没年は885年と推定
    '源仲政': [1095, 1135, 'record'],     // 1095年 六位蔵人～保延年間（1135～1141年）に引退
    '待賢門院堀河': [1126, 1150, 'record'], // 歌合・久安百首
    '源俊隆': [1118, 1132, 'record'],
    '皇嘉門院別当': [1175, 1182, 'record'],
    '源兼昌': [1100, 1128, 'record'],     // 1100年の歌合～1128年頃まで生存
    '興我王': [860, 886, 'record'],
    '源至': [851, 886, 'record'],
    '平重義': [998, 1026, 'record'],
    '平棟仲': [1018, 1041, 'record'],
    '素性': [909, 909, 'record'],         // 909年に醍醐天皇の前で歌を詠んだ
    '清原深養父': [908, 930, 'record'],
    '文屋朝康': [892, 902, 'record'],
    '高階峯緒': [844, 868, 'record']
  };

  // 人物（ツールチップを探す名前）の [生きていたとみなす最初の年, 最後の年]。わからなければ null
  function lifeSpan(name) {
    var life = LIFE[name];
    if (!life) {
      var t = (window.TK_TOOLTIPS || {})[name] || [];
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
    if (d.hidden) return false;
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
  var ADOPT_EXTRA = 30; // 養子・lbl のとき、線の上に文字を書くための追加の間隔
  var BADGE_R = 10;     // 歌番号バッジの半径
  var PAD = 16;
  var TNO_TOP = 25;     // 代数の札の上端（名前の中心から上へ）
  var TNO_H = 13;       // 代数の札の高さ
  var TNO_EXTRA = 16;   // 代数の札を載せる行の上に空ける余白
  var COUPLE = 18;      // 夫婦を上下に並べるとき、中心（＝の位置）から各名前までの距離
  var SVGNS = 'http://www.w3.org/2000/svg';

  // 代数の札の幅
  function tnoWidth(d) {
    return String(d.t).length * 6.3 + 6;
  }

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
    if (d.hidden) {
      v.preW = v.nameX = v.mainW = v.textW = v.w = 0;
      return;
    }
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

  // 最初の子をたどった末端（子孫の一番上の段にいる人物）
  function firstLeaf(v) {
    while (v.c.length && !v.c[0].d.spouse) v = v.c[0];
    return v;
  }

  function extraGap(cv) {
    var label = edgeLabel(cv.d);
    // 英語版は文字が長いので、日本語の4文字（40px）より長い分だけ間隔を広げる
    var extra = !label ? 0 : EN ? ADOPT_EXTRA + Math.max(0, textW(label, 10) - 40) : ADOPT_EXTRA;
    return (cv.dash ? DASH_EXTRA : 0) + extra;
  }

  // 親から子への線に書く文字（養子・「五代略」など）
  function edgeLabel(d) {
    if (EN) return d.adopt ? EN.ui.adopt : (d.lbl ? lab(d.lbl) : '');
    return d.adopt ? '養子' : (d.lbl || '');
  }

  /* marry で配偶者のほうを右へずらすときは、ずらす位置が決まってから配置をやり直す
     align: 人物（データ）→ その人物を置く最小の x */
  function layout(root) {
    var align = new Map();
    var lay;
    for (var i = 0; i < 3; i++) {
      lay = layoutOnce(root, align);
      var changed = false;
      lay.nodes.forEach(function (v) {
        if (v.mate && v.mate.x < v.x) {
          align.set(v.mate.d, v.x);
          changed = true;
        }
      });
      if (!changed) break;
    }
    return lay;
  }

  function layoutOnce(root, align) {
    var cursor = PAD;
    var nodes = [];
    var tnoPadAt = -1; // 代数の札の余白を最後に足した位置（同じ位置で二重に足さない）
    function place(v, x, inheritSub) {
      measure(v);
      if (align.has(v.d)) x = Math.max(x, align.get(v.d));
      // marry：配偶者と同じ列にそろえる（配偶者が表示されているときだけ）
      var mate = v.d.marry ? nodes.filter(function (n) { return n.d.n === v.d.marry; })[0] : null;
      v.mate = mate || null;
      if (mate) {
        x = Math.max(x, mate.x);
        cursor += 16; // ＝を引く間を空ける（本人の上には代数の札も載る）
      }
      v.x = x;
      nodes.push(v);
      // 天皇は名前の上に代数の札が載るので、上の行と重ならないよう余白を取る
      if (v.d.t && cursor !== tnoPadAt) {
        cursor += TNO_EXTRA;
        tnoPadAt = cursor;
      }
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
        // marry のときは配偶者に近づけるため、子孫の一番上の段（最初の子をたどった末端）にそろえる
        v.y = mate ? firstLeaf(v).inY : (v.c[0].inY + v.c[v.c.length - 1].inY) / 2;
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
      v.spineX = v.nameX + Math.max(textW(nameOf(v.d), FS) / 2, v.d.t ? tnoWidth(v.d) + 4 : 0);
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
      // 天皇は名前の上に代数の札が載るので、上の妻との間を広げる
      v.y = v.inY = eqA + COUPLE + (v.d.t ? TNO_EXTRA : 0);
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
    // 空の属性は付けない（style="" などが残ると、VS Code の CSS チェックで「空のルールセット」と警告される）
    for (var k in attrs) {
      if (attrs[k] === '' || attrs[k] === undefined || attrs[k] === null) continue;
      e.setAttribute(k, attrs[k]);
    }
    if (parent) parent.appendChild(e);
    return e;
  }

  function drawEdges(g, v) {
    if (!v.c.length) return;
    if (v.spineX !== undefined) return drawSpouseEdges(g, v);
    var cls = 'fk-edge' + (v.mode === 'ctx' ? ' is-ctx' : '');
    // 夫婦は縦の「＝」の中央から、それ以外は名前の右端から線を出す
    var startX = v.d.hidden ? v.x + v.w + GAP / 2 : v.d.wife ? v.x + v.eqX + 2 : v.x + v.textW + 3;
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
      var label = edgeLabel(cv.d);
      if (label) {
        // 「養子」「五代略」などは親から子への線の中央に置く（子が1人なら親の右端から、複数なら縦線から子まで）
        var lineStart = kids.length === 1 ? fromX : barX;
        var midX = (lineStart + cv.x - 3) / 2;
        el('text', { class: 'fk-adopt' + (cv.mode === 'ctx' ? ' is-ctx' : ''), x: midX, y: cv.inY - 6 }, g).textContent = label;
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
    文面は js/tenno-keizu-tooltips.js（window.TK_TOOLTIPS）に書いたとおりに出す。
    そこに無い人物は名前（天皇は「〇〇天皇」）に、代数・歌番号の行を自動で付ける */
  function tooltipLines(d) {
    var tips = EN ? EN.tips : (window.TK_TOOLTIPS || {});
    var t = tips[d.key || d.n];
    if (t && t.length) return t;
    if (EN) {
      var en = [d.k ? fmt(EN.ui.fallbackEmperor, { name: nameOf(d) }) : fmt(EN.ui.fallbackTitle, { name: nameOf(d) })];
      if (d.p) en.push(fmt(EN.ui.fallbackPoet, { p: d.p }));
      return en;
    }
    var lines = [d.k ? d.n + '天皇' : d.n];
    if (d.t) lines.push('第' + d.t + '代天皇');
    if (d.p) lines.push('百人一首' + d.p + '番の歌人');
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

  /* 氏の札（在原氏・清和源氏など）から、その系統の絞り込みボタンを探す
    本人か、いちばん近い祖先の id を起点（roots）にしているボタン。天皇まで上ったらそこで止める
    （三条源氏などを「天智天皇の系統」のような大きなくくりにつながないため）。見つからなければ null */
  function filterKeyFor(d) {
    for (var a = d; a; a = a.parent) {
      if (a !== d && a.k) return null;
      if (!a.id) continue;
      if (FILTERS[a.id] && FILTERS[a.id].roots && FILTERS[a.id].roots.indexOf(a.id) >= 0) return a.id;
      for (var key in FILTERS) {
        if (FILTERS[key].roots && FILTERS[key].roots.indexOf(a.id) >= 0) return key;
      }
    }
    return null;
  }

  // 札をクリックすると、その系統のボタンを押したのと同じように絞り込む（js/fujiwara-keizu.js と同じ）
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
    if (d.hidden) return;
    var title = d.p ? poemTitle(tooltipLines(d)[0], d.p) : tooltipLines(d)[0];

    var cls = 'fk-node' + (v.mode === 'ctx' ? ' is-ctx' : '') + (d.k ? ' is-tenno' : '') + (d.p ? ' is-poet' : '');
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
      // 3桁（100番）は円に収まるよう文字を小さくする
      el('text', { class: 'fk-badge-num', x: v.badgeCx, y: 0.5, style: d.p >= 100 ? 'font-size:8.5px' : '' }, target).textContent = d.p;
    }
    if (d.t) {
      // 天皇の代数：名前の一文字目の上に、青い四角に白い数字で小さく載せる
      var tw = tnoWidth(d);
      el('rect', { class: 'fk-tno-box', x: v.nameX, y: -TNO_TOP, width: tw, height: TNO_H, rx: 1.5 }, node);
      el('text', { class: 'fk-tno', x: v.nameX + tw / 2, y: -TNO_TOP + TNO_H / 2 + 0.5 }, node).textContent = d.t;
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

  // marry：真上の配偶者と本人の名前の間を縦の「＝」で結ぶ
  function drawMarry(g, v) {
    var m = v.mate;
    var ex = v.x + v.nameX + Math.min(textW(nameOf(v.d), FS), textW(nameOf(m.d), FS)) / 2;
    var ctx = v.mode === 'ctx' || m.mode === 'ctx' ? ' is-ctx' : '';
    drawEq(g, ex, m.inY + 9, v.inY - (v.d.t ? TNO_TOP : 9) - 2, 'fk-edge fk-eq' + ctx);
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
    if (!d.hidden) {
      [d.key || d.n].concat(d.wife ? [d.wife.n] : []).forEach(function (name) {
        var s = lifeSpan(name);
        if (!s) return;
        YEAR_MIN = Math.min(YEAR_MIN, Math.floor(s[0] / 10) * 10);
        YEAR_MAX = Math.max(YEAR_MAX, Math.ceil(s[1] / 10) * 10);
      });
    }
    d.c.forEach(scanYears);
  })(TREE);

  var state = { filter: 'all', scale: 1, years: [YEAR_MIN, YEAR_MAX] };
  var current = null; // { svg, width, height }
  var tips = [];       // tippy のインスタンス（描き直すたびに破棄する）

  function yearActive() {
    return state.years[0] > YEAR_MIN || state.years[1] < YEAR_MAX;
  }

  // 期間のスライダーが全期間でなければ、選んでいる系統の絞り込みに「その期間に生きていた」条件を重ねる
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
    if (!view || !view.c.length) {
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
      'aria-label': EN ? fmt(EN.ui.svgLabel, { label: filter.label }) : '天皇の略系図（' + filter.label + '）',
      class: 'fk-svg'
    });
    drawEdges(el('g', { class: 'fk-edges' }, svg), view);
    var nodesG = el('g', {}, svg);
    lay.nodes.forEach(function (v) { drawNode(nodesG, v); });
    lay.nodes.forEach(function (v) { if (v.d.band) drawBand(nodesG, v); });
    lay.nodes.forEach(function (v) { if (v.mate) drawMarry(nodesG, v); });

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

  /* 期間のスライダー（つまみ2つ：始まりの年・終わりの年）。js/fujiwara-keizu.js と同じ
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

  // 系図の中の氏の札（在原氏・清和源氏など）：ボタンと同じく絞り込む。
  // トグル：すでにその系統で絞り込んでいるときにもう一度押すと、全体に戻す
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

  // URL の #seiwagenji などで初期表示の系統を指定できる
  var hash = location.hash.replace('#', '');
  if (FILTERS[hash]) state.filter = hash;
  if (window.matchMedia('(max-width: 750px)').matches) state.scale = 0.8;
  render();
})();
