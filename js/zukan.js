const THEME_LABELS = {
    autumn: { label: '秋', icon: '' },
    summer: { label: '夏', icon: '' },
    spring: { label: '春', icon: '' },
    winter: { label: '冬', icon: '' },
    love: { label: '恋', icon: '' },
    travel: { label: '旅', icon: '' },
    farewell: { label: '別れ', icon: '' },
    misc: { label: 'その他', icon: '' },
};

const ERA_LABELS = {
    1: '飛鳥・奈良',
    2: '平安前期',
    3: '平安中期',
    4: '平安後期',
    5: '鎌倉',
};

// kajin-kanshoku.html の「最高位階」と kanshoku_salary.html の位階別推定年収（換算方法・定数はkanshoku_salary.htmlと共通）を
// もとに算出した、歌人ごとの最高推定年収（万円単位）。位階が「―」「不明」「三品」の場合はnull。
// 従三位は参考資料に該当データがないため、正三位と正四位の中間値（約1億2,991万円）を参考値として採用。
const ESTIMATED_INCOME_BY_NUMBER = {
    1: null, 2: null, 3: null, 4: null, 5: null, 6: "約1億2,991万円", 7: null, 8: null, 9: null, 10: null,
    11: "約2億1,525万円", 12: null, 13: null, 14: "約3億2,745万円", 15: null, 16: "約2億1,525万円", 17: "約3,715万円", 18: "約3,715万円", 19: null, 20: null,
    21: null, 22: null, 23: "約1,771万円", 24: "約2億8,854万円", 25: "約2億8,854万円", 26: "約4億7,483万円", 27: "約1億2,991万円", 28: "約4,456万円", 29: null, 30: "約130万円",
    31: "約1,771万円", 32: null, 33: null, 34: null, 35: "約1,771万円", 36: "約1,771万円", 37: "約1,771万円", 38: null, 39: "約3,715万円", 40: "約1,771万円",
    41: null, 42: "約1,771万円", 43: "約1億2,991万円", 44: "約1億2,991万円", 45: "約3億2,745万円", 46: null, 47: null, 48: "約1,771万円", 49: "約3,715万円", 50: "約1,771万円",
    51: "約3,715万円", 52: "約3,715万円", 53: null, 54: null, 55: "約3億2,745万円", 56: null, 57: null, 58: "約1億2,991万円", 59: null, 60: null,
    61: null, 62: null, 63: "約1億2,991万円", 64: "約2億1,525万円", 65: null, 66: null, 67: null, 68: null, 69: null, 70: null,
    71: "約3億2,745万円", 72: null, 73: "約3億2,745万円", 74: "約3,715万円", 75: "約1,771万円", 76: "約4億2,522万円", 77: null, 78: "約1,771万円", 79: "約2億1,525万円", 80: null,
    81: "約3億2,745万円", 82: "約1,771万円", 83: "約2億1,525万円", 84: "約4,456万円", 85: null, 86: "約1,771万円", 87: "約1,771万円", 88: null, 89: null, 90: null,
    91: "約4億2,522万円", 92: null, 93: "約3億2,745万円", 94: "約2億1,525万円", 95: null, 96: "約4億2,522万円", 97: "約3億2,745万円", 98: "約2億8,854万円", 99: null, 100: null,
};

// kajin-kanshoku.html の「最高位階」列。「―」「不明」の場合はnull（未判明として表示しない）。
const RANK_BY_NUMBER = {
    1: null, 2: null, 3: null, 4: null, 5: null, 6: "従三位", 7: null, 8: null, 9: null, 10: null,
    11: "正三位", 12: null, 13: null, 14: "正二位", 15: null, 16: "正三位", 17: "従四位上", 18: "従四位上", 19: null, 20: "三品",
    21: null, 22: null, 23: "従五位下", 24: "従二位", 25: "従二位", 26: "正一位", 27: "従三位", 28: "正四位下", 29: null, 30: "正六位上",
    31: "従五位下", 32: null, 33: null, 34: null, 35: "従五位上", 36: "従五位下", 37: "従五位下", 38: null, 39: "従四位上", 40: "従五位上",
    41: null, 42: "従五位上", 43: "従三位", 44: "従三位", 45: "正二位", 46: null, 47: null, 48: "従五位下", 49: "従四位上", 50: "従五位上",
    51: "従四位上", 52: "従四位上", 53: null, 54: null, 55: "正二位", 56: null, 57: null, 58: "従三位", 59: null, 60: null,
    61: null, 62: null, 63: "従三位", 64: "正三位", 65: null, 66: null, 67: null, 68: null, 69: null, 70: null,
    71: "正二位", 72: null, 73: "正二位", 74: "従四位上", 75: "従五位上", 76: "従一位", 77: null, 78: "従五位下", 79: "正三位", 80: null,
    81: "正二位", 82: "従五位上", 83: "正三位", 84: "正四位下", 85: null, 86: "従五位下", 87: "従五位上", 88: null, 89: "三品", 90: null,
    91: "従一位", 92: null, 93: "正二位", 94: "正三位", 95: null, 96: "従一位", 97: "正二位", 98: "従二位", 99: null, 100: null,
};

// ─── Helpers ─────────────────────────────────────────────────

/** Strip all HTML tags and collapse whitespace */
function stripTags(html) {
    return (html || '')
        .replace(/<br\s*\/?>/gi, '\u3000')
        .replace(/<rt>.*?<\/rt>/g, '')
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

/** Extract only the rt (furigana) text from a name string */
function extractRt(html) {
    return [...(html || '').matchAll(/<rt>(.*?)<\/rt>/g)]
        .map(m => m[1]).join('');
}

/** Extract only the base (non-rt) kanji text from a name string */
function extractBase(html) {
    return (html || '')
        .replace(/<rt>.*?<\/rt>/g, '')
        .replace(/<[^>]+>/g, '')
        .trim();
}

/**
 * 和歌全体をひらがな読みに変換する（検索用）。
 * <ruby>漢字<rt>よみ</rt></ruby>はよみに置き換え、ruby外の地の文
 * （すでにひらがなの助詞など）はそのまま残す。
 */
function extractYomiFull(html) {
    return (html || '')
        .replace(/<br\s*\/?>/gi, '')
        .replace(/<ruby>.*?<rt>(.*?)<\/rt><\/ruby>/g, '$1')
        .replace(/<[^>]+>/g, '')
        .trim();
}

/** Map first hiragana character to 行 row name */
function gojuuonRow(yomi) {
    // 濁音・半濁音を清音に変換
    const normalized = yomi.replace(/[ぁ-ん]/g, c => {
        const dakuten = 'がぎぐげござじずぜぞだぢづでどばびぶべぼ';
        const seion = 'かきくけこさしすせそたちつてとはひふへほ';
        const handaku = 'ぱぴぷぺぽ';
        const ha = 'はひふへほ';
        const d = dakuten.indexOf(c);
        if (d !== -1) return seion[d];
        const h = handaku.indexOf(c);
        if (h !== -1) return ha[h];
        return c;
    });
    const c = normalized[0];
    if ('あいうえお'.includes(c)) return 'あ行';
    if ('かきくけこ'.includes(c)) return 'か行';
    if ('さしすせそ'.includes(c)) return 'さ行';
    if ('たちつてと'.includes(c)) return 'た行';
    if ('なにぬねの'.includes(c)) return 'な行';
    if ('はひふへほ'.includes(c)) return 'は行';
    if ('まみむめも'.includes(c)) return 'ま行';
    if ('やゆよ'.includes(c)) return 'や行';
    if ('らりるれろ'.includes(c)) return 'ら行';
    if ('わをん'.includes(c)) return 'わ行';
    return 'その他';
}

/* 手動による時代設定 */
function getEraNum(poet) {
    if (poet.era !== undefined) return poet.era;
    return eraNumFromNum(poet.n);
}

/* 時代の特定 */
function eraNumFromNum(n) {
    if (n <= 7) return 1;
    if (n <= 45) return 2;
    if (n <= 71) return 3;
    if (n <= 86) return 4;
    return 5;
}

/* 歌人データ */
const POETS_RAW = [
    {
        n: 1, name: '<ruby>天智天皇<rt>てんじてんのう</rt></ruby>', date: '626年～671年', theme: 'autumn',
        poem: '<ruby>秋<rt>あき</rt></ruby>の<ruby>田<rt>た</rt></ruby>の…', job: '天皇', source: '後撰集', outline: '大改革を成し遂げた天皇', img: 'img/z01.webp',
    },
    {
        n: 2, name: '<ruby>持統天皇<rt>じとうてんのう</rt></ruby>', date: '645年～702年', theme: 'summer',
        poem: '<ruby>春<rt>はる</rt></ruby><ruby>過<rt>す</rt></ruby>ぎて…', job: '天皇', source: '新古今集', outline: '朝廷を主導した女帝', img: 'img/z02.webp',
    },
    {
        n: 3, name: '<ruby>柿本人麻呂<rt>かきのもとひとまろ</rt></ruby>', date: '生没年不詳', era: 1, theme: 'love',
        poem: 'あしびきの…', job: '官人', source: '拾遺集', outline: '不遇な最期を遂げた和歌の神様', img: 'img/z03.webp',
    },
    {
        n: 4, name: '<ruby>山部赤人<rt>やまべのあかひと</rt></ruby>', date: '生没年不詳', theme: 'winter',
        poem: '<ruby>田子<rt>たご</rt></ruby>の<ruby>浦<rt>うら</rt></ruby>に…', job: '官人', source: '新古今集', outline: '自然を詠んだ叙景歌の名手', img: 'img/z04.webp',
    },
    {
        n: 5, name: '<ruby>猿丸太夫<rt>さるまるだゆう</rt></ruby>', date: '生没年不詳', theme: 'autumn',
        poem: '<ruby>奥山<rt>おくやま</rt></ruby>に…', job: '伝説', source: '古今集', outline: '伝説に包まれた歌人', img: 'img/z05.webp',
    },
    {
        n: 6, name: '<ruby>中納言家持<rt>ちゅうなごんやかもち</rt></ruby>', date: '718年頃～785年', theme: 'winter',
        poem: 'かささぎの…', job: '公卿', source: '新古今集', outline: '万葉集編纂の中心人物', img: 'img/z06.webp',
    },
    {
        n: 7, name: '<ruby>阿倍仲麻呂<rt>あべのなかまろ</rt></ruby>', date: '698年頃～770年', theme: 'travel',
        poem: '<ruby>天<rt>あま</rt></ruby>の<ruby>原<rt>はら</rt></ruby>…', job: 'その他', source: '古今集', outline: '唐に渡り帰らぬ人となった天才官僚', img: 'img/z07.webp',
    },
    {
        n: 8, name: '<ruby>喜撰法師<rt>きせんほうし</rt></ruby>', date: '生没年不詳', theme: 'misc',
        poem: 'わが<ruby>庵<rt>いお</rt></ruby>は…', job: '僧侶', source: '古今集', outline: '俗世を離れて生きた宇治の仙人', img: 'img/z08.webp',
    },
    {
        n: 9, name: '<ruby>小野小町<rt>おののこまち</rt></ruby>', date: '生没年不詳', theme: 'spring',
        poem: '<ruby>花<rt>はな</rt></ruby>の<ruby>色<rt>いろ</rt></ruby>は…', job: '女房', source: '古今集', outline: '衰えゆく美を憂えた絶世の美女', img: 'img/z09.webp',
    },
    {
        n: 10, name: '<ruby>蝉丸<rt>せみまる</rt></ruby>', date: '生没年不詳', theme: 'misc',
        poem: 'これやこの…', job: '伝説', source: '後撰集', outline: '出会いと別れを見つめた琵琶法師', img: 'img/z10.webp',
    },
    {
        n: 11, name: '<ruby>参議篁<rt>さんぎたかむら</rt></ruby>', date: '802年～852年', theme: 'travel',
        poem: 'わたの<ruby>原<rt>はら</rt></ruby><br><ruby>八十島<rt>やそしま</rt></ruby>かけて…', job: '公卿', source: '古今集', outline: '流刑にあった反骨の宮廷官人', img: 'img/z11.webp',
    },
    {
        n: 12, name: '<ruby>僧正遍昭<rt>そうじょうへんじょう</rt></ruby>', date: '816年～890年', theme: 'misc',
        poem: '<ruby>天<rt>あま</rt></ruby>つ<ruby>風<rt>かぜ</rt></ruby>…', job: '僧侶', source: '古今集', outline: '宮廷官人から出家した僧', img: 'img/z12.webp',
    },
    {
        n: 13, name: '<ruby>陽成院<rt>ようぜいいん</rt></ruby>', date: '868年～949年', theme: 'love',
        poem: '<ruby>筑波嶺<rt>つくばね</rt></ruby>の…', job: '天皇', source: '後撰集', outline: '奇行で知られた天皇', img: 'img/z13.webp',
    },
    {
        n: 14, name: '<ruby>河原左大臣<rt>かわらのさだいじん</rt></ruby>', date: '822年～895年', theme: 'love',
        poem: '<ruby>陸奥<rt>みちのく</rt></ruby>の…', job: '公卿', source: '古今集', outline: '贅の限りを尽くした公卿', img: 'img/z14.webp',
    },
    {
        n: 15, name: '<ruby>光孝天皇<rt>こうこうてんのう</rt></ruby>', date: '830年～887年', theme: 'spring',
        poem: '<ruby>君<rt>きみ</rt></ruby>がため<br><ruby>春<rt>はる</rt></ruby>の<ruby>野<rt>の</rt></ruby>に<ruby>出<rt>い</rt></ruby>でて…', job: '天皇', source: '古今集', outline: '庶民的な暮らしを好んだ天皇', img: 'img/z15.webp',
    },
    {
        n: 16, name: '<ruby>中納言行平<rt>ちゅうなごんゆきひら</rt></ruby>', date: '818年～893年', theme: 'farewell',
        poem: '<ruby>立<rt>た</rt></ruby>ち<ruby>別<rt>わか</rt></ruby>れ…', job: '公卿', source: '古今集', outline: '律儀な宮廷官人', img: 'img/z16.webp',
    },
    {
        n: 17, name: '<ruby>在原業平朝臣<rt>ありわらのなりひらあそん</rt></ruby>', date: '825年～880年', theme: 'autumn',
        poem: 'ちはやぶる…', job: '貴族', source: '古今集', outline: '平安随一のプレイボーイ歌人', img: 'img/z17.webp',
    },
    {
        n: 18, name: '<ruby>藤原敏行朝臣<rt>ふじわらのとしゆきあそん</rt></ruby>', date: '生年不詳～901年頃', theme: 'love',
        poem: '<ruby>住<rt>すみ</rt></ruby>の<ruby>江<rt>え</rt></ruby>の…', job: '貴族', source: '古今集', outline: '早逝した天才書家', img: 'img/z18.webp',
    },
    {
        n: 19, name: '<ruby>伊勢<rt>いせ</rt></ruby>', date: '生没年不詳', theme: 'love',
        poem: '<ruby>難波潟<rt>なにわがた</rt></ruby>…', job: '女房', source: '新古今集', outline: '親子二代の帝に愛された宮廷歌人', img: 'img/z19.webp',
    },
    {
        n: 20, name: '<ruby>元良親王<rt>もとよししんのう</rt></ruby>', date: '890年～943年', theme: 'love',
        poem: 'わびぬれば…', job: '皇族', source: '後撰集', outline: '失意の境遇にあった親王', img: 'img/z20.webp',
    },
    {
        n: 21, name: '<ruby>素性法師<rt>そせいほうし</rt></ruby>', date: '生没年不詳', theme: 'love',
        poem: '<ruby>今<rt>いま</rt></ruby>こ<ruby>む<rt>ん</rt></ruby>と…', job: '僧侶', source: '古今集', outline: '恋歌に優れた歌僧', img: 'img/z21.webp',
    },
    {
        n: 22, name: '<ruby>文屋康秀<rt>ふんやのやすひで</rt></ruby>', date: '生没年不詳', theme: 'autumn',
        poem: '<ruby>吹<rt>ふ</rt></ruby>くからに…', job: '貴族', source: '古今集', outline: '機知に富んだ六歌仙の歌人', img: 'img/z22.webp',
    },
    {
        n: 23, name: '<ruby>大江千里<rt>おおえのちさと</rt></ruby>', date: '生没年不詳', theme: 'autumn',
        poem: '<ruby>月<rt>つき</rt></ruby>みれば…', job: '貴族', source: '古今集', outline: '漢詩に通じた下級官人', img: 'img/z23.webp',
    },
    {
        n: 24, name: '<ruby>菅家<rt>かんけ</rt></ruby>', date: '845年～903年', theme: 'travel',
        poem: 'このたびは…', job: '公卿', source: '古今集', outline: '学問の神となった天才官僚', img: 'img/z24.webp',
    },
    {
        n: 25, name: '<ruby>三条右大臣<rt>さんじょうのうだいじん</rt></ruby>', date: '873年～932年', theme: 'love',
        poem: '<ruby>名<rt>な</rt></ruby>にし<ruby>負<rt>お</rt></ruby>はば', job: '公卿', source: '後撰集', outline: '古今集編纂を後援した公卿', img: 'img/z25.webp',
    },
    {
        n: 26, name: '<ruby>貞信公<rt>ていしんこう</rt></ruby>', date: '880年～949年', theme: 'autumn',
        poem: '<ruby>小倉山<rt>おぐらやま</rt></ruby>…', job: '公卿', source: '拾遺集', outline: '朝廷を支えた穏健な公卿', img: 'img/z26.webp',
    },
    {
        n: 27, name: '<ruby>中納言兼輔<rt>ちゅうなごんかねすけ</rt></ruby>', date: '877年～933年', theme: 'love',
        poem: 'みかの<ruby>原<rt>はら</rt></ruby>…', job: '公卿', source: '新古今集', outline: '紫式部の曾祖父にあたる歌人', img: 'img/z27.webp',
    },
    {
        n: 28, name: '<ruby>源宗于朝臣<rt>みなもとのむねゆきあそん</rt></ruby>', date: '生年不詳～939年', theme: 'winter',
        poem: '<ruby>山里<rt>やまざと</rt></ruby>は…', job: '貴族', source: '古今集', outline: '皇子から臣籍降下した歌人', img: 'img/z28.webp',
    },
    {
        n: 29, name: '<ruby>凡河内躬恒<rt>おおしこうちのみつね</rt></ruby>', date: '生没年不詳', theme: 'autumn',
        poem: '<ruby>心当<rt>こころあ</rt></ruby>てに…', job: '官人', source: '古今集', outline: '古今和歌集を編んだ三十六歌仙', img: 'img/z29.webp',
    },
    {
        n: 30, name: '<ruby>壬生忠岑<rt>みぶのただみね</rt></ruby>', date: '生没年不詳', theme: 'love',
        poem: '<ruby>有明<rt>ありあけ</rt></ruby>の…', job: '貴族', source: '古今集', outline: '藤原定家が絶賛した歌人', img: 'img/z30.webp',
    },
    {
        n: 31, name: '<ruby>坂上是則<rt>さかのうえのこれのり</rt></ruby>', date: '生没年不詳', theme: 'winter',
        poem: '<ruby>朝<rt>あさ</rt></ruby>ぼらけ<br><ruby>有明<rt>ありあけ</rt></ruby>の<ruby>月<rt>つき</rt></ruby>と…', job: '貴族', source: '古今集', outline: '蹴鞠に秀でた歌人', img: 'img/z31.webp',
    },
    {
        n: 32, name: '<ruby>春道列樹<rt>はるみちのつらき</rt></ruby>', date: '生年不詳～920年', theme: 'autumn',
        poem: '<ruby>山川<rt>やまがわ</rt></ruby>に…', job: '官人', source: '古今集', outline: '古代豪族の末裔ながら下級官人', img: 'img/z32.webp',
    },
    {
        n: 33, name: '<ruby>紀友則<rt>きのとものり</rt></ruby>', date: '生年不詳～904年頃', theme: 'spring',
        poem: '<ruby>久方<rt>ひさかた</rt></ruby>の…', job: '官人', source: '古今集', outline: '古今集完成を見ずに亡くなった撰者', img: 'img/z33.webp',
    },
    {
        n: 34, name: '<ruby>藤原興風<rt>ふじわらのおきかぜ</rt></ruby>', date: '生没年不詳', theme: 'misc',
        poem: '<ruby>誰<rt>たれ</rt></ruby>をかも…', job: '官人', source: '古今集', outline: '老境の孤独を詠んだ歌人', img: 'img/z34.webp',
    },
    {
        n: 35, name: '<ruby>紀貫之<rt>きのつらゆき</rt></ruby>', date: '868年～945年', theme: 'spring',
        poem: '<ruby>人<rt>ひと</rt></ruby>はいさ…', job: '貴族', source: '古今集', outline: '和歌の型を築いた歌人', img: 'img/z35.webp',
    },
    {
        n: 36, name: '<ruby>清原深養父<rt>きよはらのふかやぶ</rt></ruby>', date: '生没年不詳', theme: 'summer',
        poem: '<ruby>夏<rt>なつ</rt></ruby>の<ruby>夜<rt>よ</rt></ruby>は…', job: '貴族', source: '古今集', outline: 'やさしい情趣の歌人', img: 'img/z36.webp',
    },
    {
        n: 37, name: '<ruby>文屋朝康<rt>ふんやのあさやす</rt></ruby>', date: '生没年不詳', theme: 'autumn',
        poem: '<ruby>白露<rt>しらつゆ</rt></ruby>に…', job: '官人', source: '後撰集', outline: '官位は低くも歌で名を残した歌人', img: 'img/z37.webp',
    },
    {
        n: 38, name: '<ruby>右近<rt>うこん</rt></ruby>', date: '生没年不詳', theme: 'love',
        poem: '<ruby>忘<rt>わす</rt></ruby>らるる…', job: '女房', source: '拾遺集', outline: '裏切られた恋を詠んだ女流歌人', img: 'img/z38.webp',
    },
    {
        n: 39, name: '<ruby>参議等<rt>さんぎひとし</rt></ruby>', date: '880年～951年', theme: 'love',
        poem: '<ruby>浅茅生<rt>あさじう</rt></ruby>の…', job: '公卿', source: '後撰集', outline: '嵯峨源氏の名門歌人', img: 'img/z39.webp',
    },
    {
        n: 40, name: '<ruby>平兼盛<rt>たいらのかねもり</rt></ruby>', date: '生年不詳～990年', theme: 'love',
        poem: '<ruby>忍<rt>しの</rt></ruby>ぶれど…', job: '貴族', source: '拾遺集', outline: '天徳内裏歌合で名を上げた歌人', img: 'img/z40.webp',
    },
    {
        n: 41, name: '<ruby>壬生忠見<rt>みぶのただみ</rt></ruby>', date: '生没年不詳', theme: 'love',
        poem: '<ruby>恋<rt>こい</rt></ruby>す<ruby>てふ<rt>ちょう</rt></ruby>…', job: '官人', source: '拾遺集', outline: '天徳内裏歌合で敗れた悲運の歌人', img: 'img/z41.webp',
    },
    {
        n: 42, name: '<ruby>清原元輔<rt>きよはらのもとすけ</rt></ruby>', date: '908年～990年', theme: 'love',
        poem: '<ruby>契<rt>ちぎ</rt></ruby>りきな…', job: '貴族', source: '後拾遺集', outline: '清少納言の父にあたる歌人', img: 'img/z42.webp',
    },
    {
        n: 43, name: '<ruby>権中納言敦忠<rt>ごんちゅうなごんあつただ</rt></ruby>', date: '906年～943年', theme: 'love',
        poem: '<ruby>逢<rt>あ</rt></ruby><ruby>ひ<rt>い</rt></ruby><ruby>見<rt>み</rt></ruby>ての…', job: '公卿', source: '拾遺集', outline: '恋多き貴公子', img: 'img/z43.webp',
    },
    {
        n: 44, name: '<ruby>中納言朝忠<rt>ちゅうなごんあさただ</rt></ruby>', date: '910年～966年', theme: 'love',
        poem: '<ruby>逢<rt>あ</rt></ruby><ruby>ふ<rt>う</rt></ruby>ことの…', job: '公卿', source: '拾遺集', outline: '笙に秀でた宮廷歌人', img: 'img/z44.webp',
    },
    {
        n: 45, name: '<ruby>謙徳公<rt>けんとくこう</rt></ruby>', date: '924年～972年', theme: 'love',
        poem: 'あ<ruby>は<rt>わ</rt></ruby>れとも…', job: '公卿', source: '拾遺集', outline: '権力を得ても恋は実らなかった公卿', img: 'img/z45.webp',
    },
    {
        n: 46, name: '<ruby>曽禰好忠<rt>そねのよしただ</rt></ruby>', date: '生没年不詳', theme: 'love',
        poem: '<ruby>由良<rt>ゆら</rt></ruby>のとを…', job: '官人', source: '新古今集', outline: '新進気鋭の異色歌人', img: 'img/z46.webp',
    },
    {
        n: 47, name: '<ruby>恵慶法師<rt>えぎょうほうし</rt></ruby>', date: '生没年不詳', theme: 'autumn',
        poem: '<ruby>八重葎<rt>やえむぐら</rt></ruby>…', job: '僧侶', source: '拾遺集', outline: '歌壇の中心で活躍した歌僧', img: 'img/z47.webp',
    },
    {
        n: 48, name: '<ruby>源重之<rt>みなもとのしげゆき</rt></ruby>', date: '生没年不詳', theme: 'love',
        poem: '<ruby>風<rt>かぜ</rt></ruby>をいたみ…', job: '貴族', source: '詞花集', outline: '高貴な生まれながら地方官として生きた歌人', img: 'img/z48.webp',
    },
    {
        n: 49, name: '<ruby>大中臣能宣朝臣<rt>おおなかとみのよしのぶあそん</rt></ruby>', date: '921年～991年', theme: 'love',
        poem: '<ruby>御垣守<rt>みかきもり</rt></ruby>…', job: '貴族', source: '詞花集', outline: '伊勢神宮の祭主を務めた歌人', img: 'img/z49.webp',
    },
    {
        n: 50, name: '<ruby>藤原義孝<rt>ふじわらのよしたか</rt></ruby>', date: '954年～974年', theme: 'love',
        poem: '<ruby>君<rt>きみ</rt></ruby>がため<br><ruby>惜<rt>お</rt></ruby>しからざりし…', job: '貴族', source: '後拾遺集', outline: '夭折した純朴な貴公子', img: 'img/z50.webp',
    },
    {
        n: 51, name: '<ruby>藤原実方朝臣<rt>ふじわらのさねかたあそん</rt></ruby>', date: '生年不詳～998年', theme: 'love',
        poem: 'かくとだに…', job: '貴族', source: '後拾遺集', outline: '陸奥に左遷された宮廷の貴公子', img: 'img/z51.webp',
    },
    {
        n: 52, name: '<ruby>藤原道信朝臣<rt>ふじわらのみちのぶあそん</rt></ruby>', date: '972年～994年', theme: 'love',
        poem: '明けぬれば…', job: '貴族', source: '後拾遺集', outline: '早世した宮廷歌人', img: 'img/z52.webp',
    },
    {
        n: 53, name: '<ruby>右大将道綱母<rt>うだいしょうみちつなのはは</rt></ruby>', date: '937年頃～995年頃', theme: 'love',
        poem: '<ruby>嘆<rt>なげ</rt></ruby>きつつ…', job: 'その他', source: '拾遺集', outline: '結婚生活の苦悩を綴った女性歌人', img: 'img/z53.webp',
    },
    {
        n: 54, name: '<ruby>儀同三司母<rt>ぎどうさんしのはは</rt></ruby>', date: '生年不詳～996年', theme: 'love',
        poem: '<ruby>忘<rt>わす</rt></ruby>れじの…', job: '女房', source: '千載集', outline: '中関白家の栄枯盛衰を見た女流歌人', img: 'img/z54.webp',
    },
    {
        n: 55, name: '<ruby>大納言公任<rt>だいなごんきんとう</rt></ruby>', date: '966年～1041年', theme: 'misc',
        poem: '<ruby>滝<rt>たき</rt></ruby>の<ruby>音<rt>おと</rt></ruby>は…', job: '公卿', source: '千載集', outline: '多才な文化人', img: 'img/z55.webp',
    },
    {
        n: 56, name: '<ruby>和泉式部<rt>いずみしきぶ</rt></ruby>', date: '生没年不詳', theme: 'love',
        poem: 'あらざら<ruby>む<rt>ん</rt></ruby>…', job: '女房', source: '後拾遺集', outline: '恋多き天性の歌人', img: 'img/z56.webp',
    },
    {
        n: 57, name: '<ruby>紫式部<rt>むらさきしきぶ</rt></ruby>', date: '970年頃～1014年頃', theme: 'misc',
        poem: 'めぐり<ruby>逢<rt>あ</rt></ruby><ruby>ひ<rt>い</rt></ruby>て…', job: '女房', source: '新古今集', outline: '世界最古の女流長編作家', img: 'img/z57.webp',
    },
    {
        n: 58, name: '<ruby>大弐三位<rt>だいにのさんみ</rt></ruby>', date: '999年～没年不詳', theme: 'love',
        poem: 'ありま<ruby>山<rt>やま</rt></ruby>…', job: '女房', source: '後拾遺集', outline: '劇的な出世を遂げた女流歌人', img: 'img/z58.webp',
    },
    {
        n: 59, name: '<ruby>赤染衛門<rt>あかぞめえもん</rt></ruby>', date: '956年？～1041年？', theme: 'love',
        poem: 'やすら<ruby>は<rt>わ</rt></ruby>で…', job: '女房', source: '後拾遺集', outline: '学識豊かな女流歌人', img: 'img/z59.webp',
    },
    {
        n: 60, name: '<ruby>小式部内侍<rt>こしきぶのないし</rt></ruby>', date: '生年不詳～1025年', theme: 'misc',
        poem: '<ruby>大江山<rt>おおえやま</rt></ruby>…', job: '女房', source: '金葉集', outline: '機知に富んだ即興歌人', img: 'img/z60.webp',
    },
    {
        n: 61, name: '<ruby>伊勢大輔<rt>いせのたいふ</rt></ruby>', date: '生没年不詳', theme: 'spring',
        poem: 'いにし<ruby>へ<rt>え</rt></ruby>の…', job: '女房', source: '詞花集', outline: '宮中をどよめかせた当意即妙の歌人', img: 'img/z61.webp',
    },
    {
        n: 62, name: '<ruby>清少納言<rt>せいしょうなごん</rt></ruby>', date: '生没年不詳', theme: 'misc',
        poem: '<ruby>夜<rt>よ</rt></ruby>をこめて…', job: '女房', source: '後拾遺集', outline: '中宮定子を支えた女流作家', img: 'img/z62.webp',
    },
    {
        n: 63, name: '<ruby>左京大夫道雅<rt>さきょうのだいぶみちまさ</rt></ruby>', date: '992年～1054年', theme: 'love',
        poem: 'いまはただ…', job: '貴族', source: '後拾遺集', outline: '悪三位と呼ばれた斜陽貴族', img: 'img/z63.webp',
    },
    {
        n: 64, name: '<ruby>権中納言定頼<rt>ごんちゅうなごんさだより</rt></ruby>', date: '995年～1045年', theme: 'winter',
        poem: '<ruby>朝<rt>あさ</rt></ruby>ぼらけ<br><ruby>宇治<rt>うじ</rt></ruby>の<ruby>川霧<rt>かわぎり</rt></ruby>…', job: '公卿', source: '千載集', outline: '小式部内侍に機知を試みた貴族', img: 'img/z64.webp',
    },
    {
        n: 65, name: '<ruby>相模<rt>さがみ</rt></ruby>', date: '生没年不詳', theme: 'love',
        poem: '<ruby>恨<rt>うら</rt></ruby>みわび…', job: '女房', source: '後拾遺集', outline: '宮廷歌壇をリードした女性歌人', img: 'img/z65.webp',
    },
    {
        n: 66, name: '<ruby>前大僧正行尊<rt>さきのだいそうじょうぎょうそん</rt></ruby>', date: '1055年～1135年', theme: 'misc',
        poem: 'もろともに…', job: '僧侶', source: '金葉集', outline: '修験道で鍛えた孤高の歌人', img: 'img/z66.webp',
    },
    {
        n: 67, name: '<ruby>周防内侍<rt>すおうのないし</rt></ruby>', date: '生没年不詳', theme: 'misc',
        poem: '<ruby>春<rt>はる</rt></ruby>の<ruby>夜<rt>よ</rt></ruby>の…', job: '女房', source: '千載集', outline: '当意即妙に貴族をあしらった女流歌人', img: 'img/z67.webp',
    },
    {
        n: 68, name: '<ruby>三条院<rt>さんじょういん</rt></ruby>', date: '976年～1017年', theme: 'misc',
        poem: '<ruby>心<rt>こころ</rt></ruby>にも…', job: '天皇', source: '後拾遺集', outline: '道長の圧力に抗った天皇', img: 'img/z68.webp',
    },
    {
        n: 69, name: '<ruby>能因法師<rt>のういんほうし</rt></ruby>', date: '988年～没年不詳', theme: 'autumn',
        poem: '<ruby>嵐<rt>あらし</rt></ruby><ruby>吹<rt>ふ</rt></ruby>く…', job: '僧侶', source: '後拾遺集', outline: '歌枕を愛した数寄者', img: 'img/z69.webp',
    },
    {
        n: 70, name: '<ruby>良暹法師<rt>りょうぜんほうし</rt></ruby>', date: '生没年不詳', theme: 'autumn',
        poem: 'さびしさに…', job: '僧侶', source: '後拾遺集', outline: '大原に隠棲した歌僧', img: 'img/z70.webp',
    },
    {
        n: 71, name: '<ruby>大納言経信<rt>だいなごんつねのぶ</rt></ruby>', date: '1016年～1097年', theme: 'autumn',
        poem: '<ruby>夕<rt>ゆう</rt></ruby>されば…', job: '公卿', source: '金葉集', outline: '藤原公任と並ぶ多彩な文化人', img: 'img/z71.webp',
    },
    {
        n: 72, name: '<ruby>祐子内親王家紀伊<rt>ゆうしないしんのうけのきい</rt></ruby>', date: '生没年不詳', theme: 'love',
        poem: '<ruby>音<rt>おと</rt></ruby>に<ruby>聞<rt>き</rt></ruby>く…', job: '女房', source: '金葉集', outline: '若い貴族に言い寄られた老境の歌人', img: 'img/z72.webp',
    },
    {
        n: 73, name: '<ruby>権中納言匡房<rt>ごんちゅうなごんまさふさ</rt></ruby>', date: '1041年～1111年', theme: 'spring',
        poem: '<ruby>高砂<rt>たかさご</rt></ruby>の…', job: '公卿', source: '後拾遺集', outline: '三代の天皇の師となった漢学の大家', img: 'img/z73.webp',
    },
    {
        n: 74, name: '<ruby>源俊頼朝臣<rt>みなもとのとしよりあそん</rt></ruby>', date: '1055年～1129年', theme: 'love',
        poem: '<ruby>憂<rt>う</rt></ruby>かりける…', job: '貴族', source: '千載集', outline: '微官ながら歌壇をリードした歌人', img: 'img/z74.webp',
    },
    {
        n: 75, name: '<ruby>藤原基俊<rt>ふじわらのもととし</rt></ruby>', date: '1060年～1142年', theme: 'misc',
        poem: '<ruby>契<rt>ちぎ</rt></ruby>りおきし…', job: '貴族', source: '千載集', outline: '伝統的歌風を好んだ歌人', img: 'img/z75.webp',
    },
    {
        n: 76, name: '<ruby>法性寺入道<rt>ほっしょうじにゅうどう</rt></ruby><br><ruby>前関白太政大臣<rt>さきのかんぱくだいじょうだいじん</rt></ruby>', date: '1097年～1164年', theme: 'misc',
        poem: 'わたの<ruby>原<rt>はら</rt></ruby>…', job: '僧侶', source: '詞花集', outline: '世渡り上手な公卿歌人', img: 'img/z76.webp',
    },
    {
        n: 77, name: '<ruby>崇徳院<rt>すとくいん</rt></ruby>', date: '1119年～1164年', theme: 'love',
        poem: '<ruby>瀬<rt>せ</rt></ruby>をはやみ…', job: '天皇', source: '詞花集', outline: '怨霊と恐れられた天皇', img: 'img/z77.webp',
    },
    {
        n: 78, name: '<ruby>源兼昌<rt>みなもとのかねまさ</rt></ruby>', date: '生没年不詳', theme: 'winter',
        poem: '<ruby>淡路島<rt>あわじしま</rt></ruby>…', job: '貴族', source: '金葉集', outline: '不遇を源氏物語の世界観に重ねた歌人', img: 'img/z78.webp',
    },
    {
        n: 79, name: '<ruby>左京大夫顕輔<rt>さきょうのだいぶあきすけ</rt></ruby>', date: '1090年～1155年', theme: 'autumn',
        poem: '<ruby>秋風<rt>あきかぜ</rt></ruby>に…', job: '貴族', source: '新古今集', outline: '父との確執に悩んだ歌人', img: 'img/z79.webp',
    },
    {
        n: 80, name: '<ruby>待賢門院堀河<rt>たいけんもんいんのほりかわ</rt></ruby>', date: '生没年不詳', theme: 'love',
        poem: '<ruby>長<rt>なが</rt></ruby>から<ruby>む<rt>ん</rt></ruby>…', job: '女房', source: '千載集', outline: '艶やかな恋歌を詠んだ女房歌人', img: 'img/z80.webp',
    },
    {
        n: 81, name: '<ruby>後徳大寺左大臣<rt>ごとくだいじのさだいじん</rt></ruby>', date: '1139年～1191年', theme: 'summer',
        poem: 'ほととぎす…', job: '公卿', source: '千載集', outline: '風雅を愛した管弦の名手', img: 'img/z81.webp',
    },
    {
        n: 82, name: '<ruby>道因法師<rt>どういんほうし</rt></ruby>', date: '1090年～没年不詳', theme: 'love',
        poem: '<ruby>思<rt>おも</rt></ruby><ruby>ひ<rt>い</rt></ruby>わび…', job: '僧侶', source: '千載集', outline: '晩年まで和歌に情熱を燃やした歌人', img: 'img/z82.webp',
    },
    {
        n: 83, name: '<ruby>皇太后宮大夫俊成<rt>こうたいごうぐうのだいぶとしなり</rt></ruby>', date: '1114年～1204年', theme: 'misc',
        poem: '<ruby>世<rt>よ</rt></ruby>の<ruby>中<rt>なか</rt></ruby>よ…', job: '公卿', source: '千載集', outline: '幽玄を追求した歌人', img: 'img/z83.webp',
    },
    {
        n: 84, name: '<ruby>藤原清輔朝臣<rt>ふじわらのきよすけあそん</rt></ruby>', date: '1104年～1177年', theme: 'misc',
        poem: '<ruby>長<rt>なが</rt></ruby>ら<ruby>へ<rt>え</rt></ruby>ば…', job: '貴族', source: '新古今集', outline: '大器晩成の歌学者', img: 'img/z84.webp',
    },
    {
        n: 85, name: '<ruby>俊恵法師<rt>しゅんえほうし</rt></ruby>', date: '1113年～没年不詳', theme: 'love',
        poem: '<ruby>夜<rt>よ</rt></ruby>もすがら…', job: '僧侶', source: '千載集', outline: '鴨長明の師となった歌僧', img: 'img/z85.webp',
    },
    {
        n: 86, name: '<ruby>西行法師<rt>さいぎょうほうし</rt></ruby>', date: '1118年～1190年', theme: 'love',
        poem: '<ruby>嘆<rt>なげ</rt></ruby>けとて…', job: '僧侶', source: '千載集', outline: 'エリート武士から突然出家した漂泊の歌人', img: 'img/z86.webp',
    },
    {
        n: 87, name: '<ruby>寂蓮法師<rt>じゃくれんほうし</rt></ruby>', date: '1139年頃～1202年', theme: 'autumn',
        poem: '<ruby>村雨<rt>むらさめ</rt></ruby>の…', job: '僧侶', source: '新古今集', outline: '新古今集の完成を見ずに世を去った歌僧', img: 'img/z87.webp',
    },
    {
        n: 88, name: '<ruby>皇嘉門院別当<rt>こうかもんいんのべっとう</rt></ruby>', date: '生没年不詳', theme: 'love',
        poem: '<ruby>難波江<rt>なにわえ</rt></ruby>の…', job: '女房', source: '千載集', outline: '宮廷女房を取り仕切った女官', img: 'img/z88.webp',
    },
    {
        n: 89, name: '<ruby>式子内親王<rt>しょくしないしんのう</rt></ruby>', date: '1149年～1201年', theme: 'love',
        poem: '<ruby>玉<rt>たま</rt></ruby>の<ruby>緒<rt>お</rt></ruby>よ…', job: '皇族', source: '新古今集', outline: '気品と孤独をたたえた皇女歌人', img: 'img/z89.webp',
    },
    {
        n: 90, name: '<ruby>殷富門院大輔<rt>いんぷもんいんのたいふ</rt></ruby>', date: '生没年不詳', theme: 'love',
        poem: '<ruby>見<rt>み</rt></ruby>せばやな…', job: '女房', source: '千載集', outline: '多くの歌を詠んだ女房歌人', img: 'img/z90.webp',
    },
    {
        n: 91, name: '<ruby>後京極摂政前太政大臣<rt>ごきょうごくせっしょうさきのだいじょうだいじん</rt></ruby>', date: '1169年～1206年', theme: 'autumn',
        poem: 'きりぎりす…', job: '公卿', source: '新古今集', outline: '頂点を極めた夜に消えた公卿', img: 'img/z91.webp',
    },
    {
        n: 92, name: '<ruby>二条院讃岐<rt>にじょういんのさぬき</rt></ruby>', date: '1141年頃～1217年頃', theme: 'love',
        poem: 'わが<ruby>袖<rt>そで</rt></ruby>は…', job: '女房', source: '千載集', outline: '源平の荒波を耐え抜いた女房歌人', img: 'img/z92.webp',
    },
    {
        n: 93, name: '<ruby>鎌倉右大臣<rt>かまくらのうだいじん</rt></ruby>', date: '1192年～1219年', theme: 'travel',
        poem: '<ruby>世<rt>よ</rt></ruby>の<ruby>中<rt>なか</rt></ruby>は…', job: '公卿', source: '新勅撰集', outline: '血塗られた鎌倉で平和を夢見た将軍', img: 'img/z93.webp',
    },
    {
        n: 94, name: '<ruby>参議雅経<rt>さんぎまさつね</rt></ruby>', date: '1170年～1221年', theme: 'autumn',
        poem: 'み<ruby>吉野<rt>よしの</rt></ruby>の…', job: '公卿', source: '新古今集', outline: '雅な『鞠』を家業とした公卿', img: 'img/z94.webp',
    },
    {
        n: 95, name: '<ruby>前大僧正慈円<rt>さきのだいそうじょうじえん</rt></ruby>', date: '1155年～1225年', theme: 'misc',
        poem: 'お<ruby>ほ<rt>お</rt></ruby>けなく…', job: '僧侶', source: '千載集', outline: '乱世を祈りで救おうとした慈悲の僧侶', img: 'img/z95.webp',
    },
    {
        n: 96, name: '<ruby>入道前太政大臣<rt>にゅうどうさきのだいじょうだいじん</rt></ruby>', date: '1171年～1244年', theme: 'misc',
        poem: '<ruby>花<rt>はな</rt></ruby>さそ<ruby>ふ<rt>う</rt></ruby>…', job: '公卿', source: '新勅撰集', outline: '鎌倉幕府と結んだ策士公卿', img: 'img/z96.webp',
    },
    {
        n: 97, name: '<ruby>権中納言定家<rt>ごんちゅうなごんさだいえ</rt></ruby>', date: '1162年～1241年', theme: 'love',
        poem: '<ruby>来<rt>こ</rt></ruby>ぬ<ruby>人<rt>ひと</rt></ruby>を…', job: '公卿', source: '新勅撰集', outline: '百人一首を編んだ公卿', img: 'img/z97.webp',
    },
    {
        n: 98, name: '<ruby>従二位家隆<rt>じゅにいいえたか</rt></ruby>', date: '1158年～1237年', theme: 'summer',
        poem: '<ruby>風<rt>かぜ</rt></ruby>そよぐ…', job: '公卿', source: '新勅撰集', outline: '定家と並び歌壇をリードした温厚な歌人', img: 'img/z98.webp',
    },
    {
        n: 99, name: '<ruby>後鳥羽院<rt>ごとばいん</rt></ruby>', date: '1180年～1239年', theme: 'misc',
        poem: '<ruby>人<rt>ひと</rt></ruby>もをし…', job: '天皇', source: '続後撰集', outline: '承久の乱を起こした天皇', img: 'img/z99.webp',
    },
    {
        n: 100, name: '<ruby>順徳院<rt>じゅんとくいん</rt></ruby>', date: '1197年～1242年', theme: 'misc',
        poem: 'ももしきや…', job: '天皇', source: '続後撰集', outline: '父の悲願に身を投じた天皇', img: 'img/z100.webp',
    },
];

// Build the full POETS array with derived fields
const POETS = POETS_RAW.map(p => {
    const eraNum = getEraNum(p);
    return {
        number: p.n,
        nameHtml: p.name,
        name: extractBase(p.name),
        yomi: extractRt(p.name),
        date: p.date,
        era: ERA_LABELS[eraNum],
        eraNum,
        theme: p.theme,
        // p.poemはカード上部に表示していた頃の一部省略プレビュー用テキスト
        // （末尾が「…」で切れている）なので、検索対象にするには不十分。
        // poems.js（歌人図鑑の縦書き和歌と同じデータソース）から全文を使う。
        // 漢字表記とひらがな読みの両方を連結しておき、どちらで検索してもヒットするようにする。
        poemText: (() => {
            const full = typeof poems !== 'undefined' ? poems[String(p.n)] : null;
            if (!full) return stripTags(p.poem);
            const combined = `${full.first}${full.second}`;
            return `${stripTags(combined)} ${extractYomiFull(combined)}`;
        })(),
        job: p.job,
        source: p.source || '',
        outline: p.outline || '',
        img: p.img || '',
    };
});

// ─── State ───────────────────────────────────────────────────

const state = {
    sortMode: 'number',   // 'number' | 'yomi' | 'era'
    filterTheme: null,       // null | theme key
    filterEra: null,       // null | eraNum (1-5)
    filterJob: null,
    filterSource: null,
    searchQuery: '',
};

// ─── Render Helpers ──────────────────────────────────────────

// 縦書きの和歌（.kokoro-panel-poem）の幅・高さを、ブラウザ側の自動計算
// （width:fit-content / height:auto）に頼らず、句の数・文字数から直接
// 計算したem値で明示的に指定するためのヘルパー。
// 一部の実機ブラウザ（iOS Chrome＝WebKit）で、writing-mode:vertical-rlの
// 要素に対するfit-content/autoのサイズ計算が正しく機能せず、和歌が右に
// ずれたり、句の途中で意図しない折り返しが起きる不具合が実際に確認された
// ための対策（Chromium・Playwright上のWebKitでは再現しないため、
// ブラウザ側の計算を信用せず数値を明示するアプローチに切り替えている）。
function poemInlineStyle(poemData) {
    if (!poemData) return '';
    const segments = `${poemData.first}<br>${poemData.second}`.split('<br>');
    const numColumns = segments.length;
    const maxChars = Math.max(...segments.map(seg => {
        const stripped = seg.replace(/<rt>.*?<\/rt>/g, '').replace(/<\/?ruby>/g, '');
        return Array.from(stripped).length; // サロゲートペア対応
    }));
    // 幅：句の数 × 行間（縦書きでは句と句の間隔＝1列分の幅）
    const widthEm = (numColumns * 2.2).toFixed(2);
    // 高さ：最長句の文字数 × 1文字あたりの目安（全100首中最長の8文字で
    // 11.2em、元の固定値11emと同等以上の余裕を持たせている）
    const heightEm = (maxChars * 1.4).toFixed(2);
    return ` style="width:${widthEm}em;height:${heightEm}em;"`;
}

function buildCard(poet) {
    // クリックしなくても心のチャート・和歌・心境をすべてのカードに常時表示するため、
    // カード自体は元通り<a>で歌のページへのリンクにする
    const a = document.createElement('a');
    a.className = 'poet-card';
    a.href = `/${poet.number}.html`;
    a.dataset.number = poet.number;
    a.dataset.yomi = poet.yomi;
    a.dataset.theme = poet.theme;
    a.dataset.era = poet.eraNum;

    const theme = THEME_LABELS[poet.theme] || THEME_LABELS.misc;
    const jobText = poet.job ? poet.job : '—';
    const sourceText = poet.source ? poet.source : '—';
    const extraImg = `img/c_${String(poet.number).padStart(3, '0')}.webp`;
    const estimatedIncome = ESTIMATED_INCOME_BY_NUMBER[poet.number];
    const incomeValue = estimatedIncome ? estimatedIncome.replace(/^約/, '') : '不明';
    const incomeText = `<br>（推定年収：${incomeValue}）`;
    const rank = RANK_BY_NUMBER[poet.number];
    const rankText = rank ? `、位階：${rank}` : '';

    const kokoro = window.KOKORO_CHART_DATA && window.KOKORO_CHART_DATA[poet.number];
    const poemData = typeof poems !== 'undefined' ? poems[String(poet.number)] : null;

    a.innerHTML = `
    <span class="card-number">${poet.number}</span>
    <div class="card-img">${poet.img ? `<img src="${poet.img}" alt="${poet.name}" loading="lazy">` : ''}</div>
    <div class="card-body">
      <div class="card-meta"><span class="card-job">職業：${jobText}${rankText}${incomeText}</span></div>
      <div class="card-name">${poet.nameHtml}</div>
      <div class="card-date">${poet.era}</div>
      <div class="card-date">${poet.date}</div>
      ${poet.outline ? `<div class="card-outline">${poet.outline}</div>` : ''}
      <div class="card-poem"><span class="card-theme" data-theme="${poet.theme}">${theme.icon} ${theme.label}</span>（${sourceText}）</div>
      ${extraImg ? `<img class="card-extra-img" src="${extraImg}" alt="${poet.name}" loading="lazy">` : ''}
      ${kokoro ? `
      <div class="kokoro-panel">
        <div class="emotion-chart">
          <div class="kokoro-panel-text">
            <h3 class="kokoro-panel-poem-title">和歌</h3>
            <div class="kokoro-panel-poem"${poemInlineStyle(poemData)}>${poemData ? `${poemData.first}<br>${poemData.second}` : ''}</div>
            <h3 class="kokoro-panel-quotes-title">歌人の心境</h3>
            <div class="kokoro-panel-quotes">${kokoro.quotes.map(q => `<p>${q}</p>`).join('')}</div>
          </div>
          <div class="radarChartWrapper"><canvas class="radarChart"></canvas></div>
        </div>
      </div>` : ''}
    </div>`;

    return a;
}

// ─── 心のチャート（トグルせず、すべてのカードに常時表示） ─────────
// Chart.jsのインスタンス生成は1枚あたり約10ms、100枚同時に作ると1秒以上かかり
// 体感速度を大きく落とすため、IntersectionObserverで画面に近づいたカードから
// 順次生成する（画面外の残りは生成そのものを後回しにする）。
// ※ グリッドのレイアウト・subgridでの行揃えはcanvasの中身ではなく
//   .radarChartWrapperのCSS（aspect-ratio）だけで決まるため、
//   チャート生成を後回しにしてもレイアウトのずれ・ガタつきは発生しない。

let chartInstances = [];
let chartObserver = null;

const AXES_JA = ['愛情', '孤独', '情熱', '哀愁', '無常', '自然'];

// スマホでは軸ラベル（愛情・孤独など）が読みにくいため、幅768px以下では文字を大きくする
function getPointLabelFontSize() {
    return window.matchMedia('(max-width: 768px)').matches ? 13 : 10;
}

function renderOneChart(canvas) {
    if (canvas.dataset.chartRendered) return;
    const card = canvas.closest('.poet-card');
    const data = card && window.KOKORO_CHART_DATA && window.KOKORO_CHART_DATA[card.dataset.number];
    if (!data) return;
    const scores = data.scores || {};
    canvas.dataset.chartRendered = '1';

    const chart = new Chart(canvas, {
        type: 'radar',
        data: {
            labels: AXES_JA,
            datasets: [{
                data: AXES_JA.map(a => scores[a] ?? 0),
                fill: true,
                borderColor: 'rgba(160, 50, 70, 1)',
                backgroundColor: 'rgba(160, 50, 70, 0.2)',
                borderWidth: 1,
                pointBackgroundColor: 'rgba(184, 35, 67, 1)',
                pointRadius: 2,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false, // 100枚を同時表示するため、個別のアニメーションはオフにする
            plugins: { legend: { display: false } },
            scales: {
                r: {
                    pointLabels: { color: '#222', font: { size: getPointLabelFontSize() } },
                    min: 0, max: 5,
                    ticks: { display: false },
                    grid: { color: 'rgba(0,0,0,0.1)' },
                    angleLines: { color: 'rgba(0,0,0,0.1)' },
                },
            },
        },
    });
    chartInstances.push(chart);
}

function renderAllCharts() {
    // グリッドを作り直すたびに、前回分のChartインスタンスと監視を破棄してから作り直す
    chartInstances.forEach(c => c.destroy());
    chartInstances = [];
    if (chartObserver) chartObserver.disconnect();

    const canvases = document.querySelectorAll('.radarChart');

    if (!('IntersectionObserver' in window)) {
        // 非対応環境ではフォールバックとして即座に全件描画する
        canvases.forEach(renderOneChart);
        return;
    }

    // rootMarginで画面の上下600px手前から先読みしておくことで、
    // 実際にスクロールで見える頃には描画が完了しているようにする
    chartObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            renderOneChart(entry.target);
            observer.unobserve(entry.target);
        });
    }, { rootMargin: '600px 0px' });

    canvases.forEach(canvas => chartObserver.observe(canvas));
}

// スクロールバーのドラッグやEndキーなど、一気に大きくジャンプするスクロールでは
// IntersectionObserverの通知が間に合わず未描画のまま取りこぼすことがあるため、
// スクロール時に画面付近の未描画canvasを直接チェックする保険を掛けておく。
let fallbackCheckScheduled = false;
function scheduleFallbackChartCheck() {
    if (fallbackCheckScheduled) return;
    fallbackCheckScheduled = true;
    requestAnimationFrame(() => {
        fallbackCheckScheduled = false;
        const remaining = document.querySelectorAll('.radarChart:not([data-chart-rendered])');
        if (remaining.length === 0) return;
        const viewH = window.innerHeight;
        remaining.forEach(canvas => {
            const rect = canvas.getBoundingClientRect();
            if (rect.bottom > -600 && rect.top < viewH + 600) {
                renderOneChart(canvas);
                if (chartObserver) chartObserver.unobserve(canvas);
            }
        });
    });
}
window.addEventListener('scroll', scheduleFallbackChartCheck, { passive: true });


function buildSectionHeader(text) {
    const div = document.createElement('div');
    div.className = 'section-header';
    div.textContent = text;
    return div;
}

// ─── Render ──────────────────────────────────────────────────

function render() {
    const grid = document.getElementById('poet-grid');
    const count = document.getElementById('result-count');
    const query = state.searchQuery.trim();

    // 1. Filter
    let list = POETS.filter(p => {
        if (state.filterTheme && p.theme !== state.filterTheme) return false;
        if (state.filterEra && p.eraNum !== state.filterEra) return false;
        if (state.filterJob && p.job !== state.filterJob) return false;
        if (state.filterSource && p.source !== state.filterSource) return false;
        if (query) {
            const q = query.toLowerCase();
            if (!p.name.includes(q) &&
                !p.yomi.includes(q) &&
                !p.poemText.includes(q)) return false;
        }
        return true;
    });

    // 2. Sort
    if (state.sortMode === 'yomi') {
        list = [...list].sort((a, b) => a.yomi.localeCompare(b.yomi, 'ja'));
    } else if (state.sortMode === 'era') {
        list = [...list].sort((a, b) => a.eraNum - b.eraNum || a.number - b.number);
    } else {
        list = [...list].sort((a, b) => a.number - b.number);
    }

    // 3. Build DOM with section headers
    const frag = document.createDocumentFragment();
    let currentSection = null;

    list.forEach(poet => {
        let sectionKey = null;
        if (state.sortMode === 'yomi') {
            sectionKey = gojuuonRow(poet.yomi);
        } else if (state.sortMode === 'era') {
            sectionKey = poet.era;
        }

        if (sectionKey && sectionKey !== currentSection) {
            currentSection = sectionKey;
            frag.appendChild(buildSectionHeader(sectionKey));
        }
        frag.appendChild(buildCard(poet));
    });

    grid.innerHTML = '';
    grid.appendChild(frag);

    // Update count
    count.textContent = `${list.length} 人`;

    // クリックしなくても、すべてのカードに心のチャートを常時表示する
    renderAllCharts();
}

// ─── Build Filters ───────────────────────────────────────────

function buildFilters() {
    const themeContainer = document.getElementById('filter-theme');
    const eraContainer = document.getElementById('filter-era');

    // Theme filters
    const allThemeBtn = document.createElement('button');
    allThemeBtn.className = 'filter-btn is-active';
    allThemeBtn.dataset.filterTheme = '';
    allThemeBtn.textContent = 'すべて';
    themeContainer.appendChild(allThemeBtn);

    Object.entries(THEME_LABELS).forEach(([key, val]) => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.dataset.filterTheme = key;
        btn.innerHTML = `${val.icon} ${val.label}`;
        themeContainer.appendChild(btn);
    });

    // Era filters
    const allEraBtn = document.createElement('button');
    allEraBtn.className = 'filter-btn is-active';
    allEraBtn.dataset.filterEra = '';
    allEraBtn.textContent = 'すべて';
    eraContainer.appendChild(allEraBtn);

    Object.entries(ERA_LABELS).forEach(([num, label]) => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.dataset.filterEra = num;
        btn.textContent = label;
        eraContainer.appendChild(btn);
    });

    // Bind theme buttons
    themeContainer.addEventListener('click', e => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        themeContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        state.filterTheme = btn.dataset.filterTheme || null;
        render();
    });

    // Bind era buttons
    eraContainer.addEventListener('click', e => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        eraContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        state.filterEra = btn.dataset.filterEra ? Number(btn.dataset.filterEra) : null;
        render();
    });

    // Job filters
    const JOB_LABELS = ['天皇', '皇族', '公卿', '貴族', '官人', '僧侶', '女房', '伝説', 'その他'];
    const jobContainer = document.getElementById('filter-job');

    const allJobBtn = document.createElement('button');
    allJobBtn.className = 'filter-btn is-active';
    allJobBtn.dataset.filterJob = '';
    allJobBtn.textContent = 'すべて';
    jobContainer.appendChild(allJobBtn);

    JOB_LABELS.forEach(label => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.dataset.filterJob = label;
        btn.textContent = label;
        jobContainer.appendChild(btn);
    });

    jobContainer.addEventListener('click', e => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        jobContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        state.filterJob = btn.dataset.filterJob || null;
        render();
    });

    // Source filters
    const SOURCE_LABELS = [
        '古今集', '後撰集', '拾遺集', '後拾遺集',
        '金葉集', '詞花集', '千載集', '新古今集',
        '新勅撰集', '続後撰集',
    ];

    // コンテナが HTML にない場合は動的生成して挿入
    let sourceContainer = document.getElementById('filter-source');
    if (!sourceContainer) {
        const jobSection = jobContainer.closest('.filter-section') || jobContainer.parentElement;
        const section = document.createElement('div');
        section.className = 'filter-section';
        section.innerHTML = '<div class="filter-label">出典</div>';
        sourceContainer = document.createElement('div');
        sourceContainer.id = 'filter-source';
        sourceContainer.className = 'filter-group';
        section.appendChild(sourceContainer);
        jobSection.parentElement.insertBefore(section, jobSection.nextSibling);
    }

    const allSourceBtn = document.createElement('button');
    allSourceBtn.className = 'filter-btn is-active';
    allSourceBtn.dataset.filterSource = '';
    allSourceBtn.textContent = 'すべて';
    sourceContainer.appendChild(allSourceBtn);

    SOURCE_LABELS.forEach(label => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.dataset.filterSource = label;
        btn.textContent = label;
        sourceContainer.appendChild(btn);
    });

    sourceContainer.addEventListener('click', e => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        sourceContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        state.filterSource = btn.dataset.filterSource || null;
        render();
    });
}

// ─── Bind Sort Buttons ───────────────────────────────────────

function bindSortButtons() {
    const bar = document.querySelector('.sort-bar');
    if (!bar) return;
    bar.addEventListener('click', e => {
        const btn = e.target.closest('[data-sort]');
        if (!btn) return;
        bar.querySelectorAll('[data-sort]').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        state.sortMode = btn.dataset.sort;
        render();
    });
}

// ─── Bind Search ─────────────────────────────────────────────

function bindSearch() {
    const input = document.getElementById('search-input');
    if (!input) return;
    input.addEventListener('input', () => {
        state.searchQuery = input.value;
        render();
    });
}

// ─── Init ────────────────────────────────────────────────────
// 「上に戻る」ボタンは全ページ共通のjs/back-to-top.js（<script>タグ追加のみ）に移行済み。

document.addEventListener('DOMContentLoaded', () => {
    buildFilters();
    bindSortButtons();
    bindSearch();
    render();
});