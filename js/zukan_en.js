const THEME_LABELS = {
    autumn: { label: 'Autumn', icon: '' },
    summer: { label: 'Summer', icon: '' },
    spring: { label: 'Spring', icon: '' },
    winter: { label: 'Winter', icon: '' },
    love: { label: 'Love', icon: '' },
    travel: { label: 'Travel', icon: '' },
    farewell: { label: 'Parting', icon: '' },
    misc: { label: 'Misc.', icon: '' },
};

const ERA_LABELS = {
    1: 'Asuka · Nara',
    2: 'Early Heian',
    3: 'Mid Heian',
    4: 'Late Heian',
    5: 'Kamakura',
};

const JOB_LABELS_EN = {
    '天皇': 'Emperor',
    '皇族': 'Imperial family',
    '公卿': 'Senior noble',
    '貴族': 'Aristocrat',
    '官人': 'Official',
    '僧侶': 'Monk',
    '女房': 'Court lady',
    '伝説': 'Legendary',
    'その他': 'Other',
};

// Display names for anthology sources (filter values remain Japanese for matching)
const SOURCE_DISPLAY = {
    '古今集': 'Kokinshū',
    '後撰集': 'Gosen Wakashū',
    '拾遺集': 'Shūi Wakashū',
    '後拾遺集': 'Goshūi Wakashū',
    '金葉集': "Kin'yō Wakashū",
    '詞花集': 'Shika Wakashū',
    '千載集': 'Senzai Wakashū',
    '新古今集': 'Shin Kokinshū',
    '新勅撰集': 'Shin Chokusen Wakashū',
    '続後撰集': 'Shoku Gosen Wakashū',
};

// Estimated annual income by poet number, based on the highest court rank the poet
// ever reached (see kajin-kanshoku.html) and the rank-based income figures on
// kanshoku_salary.html (conversion method and constants shared with that page).
// null when the rank is "―", "unknown", or "sanpon" (no source data).
// For 従三位 (no source data), the midpoint between 正三位 and 正四位 is used as a reference value.
const ESTIMATED_INCOME_BY_NUMBER = {
    1: null, 2: null, 3: null, 4: null, 5: null, 6: "approx. ¥130 million", 7: null, 8: null, 9: null, 10: null,
    11: "approx. ¥215 million", 12: null, 13: null, 14: "approx. ¥327 million", 15: null, 16: "approx. ¥215 million", 17: "approx. ¥37.1 million", 18: "approx. ¥37.1 million", 19: null, 20: null,
    21: null, 22: null, 23: "approx. ¥17.7 million", 24: "approx. ¥289 million", 25: "approx. ¥289 million", 26: "approx. ¥475 million", 27: "approx. ¥130 million", 28: "approx. ¥44.6 million", 29: null, 30: "approx. ¥1.3 million",
    31: "approx. ¥17.7 million", 32: null, 33: null, 34: null, 35: "approx. ¥17.7 million", 36: "approx. ¥17.7 million", 37: "approx. ¥17.7 million", 38: null, 39: "approx. ¥37.1 million", 40: "approx. ¥17.7 million",
    41: null, 42: "approx. ¥17.7 million", 43: "approx. ¥130 million", 44: "approx. ¥130 million", 45: "approx. ¥327 million", 46: null, 47: null, 48: "approx. ¥17.7 million", 49: "approx. ¥37.1 million", 50: "approx. ¥17.7 million",
    51: "approx. ¥37.1 million", 52: "approx. ¥37.1 million", 53: null, 54: null, 55: "approx. ¥327 million", 56: null, 57: null, 58: "approx. ¥130 million", 59: null, 60: null,
    61: null, 62: null, 63: "approx. ¥130 million", 64: "approx. ¥215 million", 65: null, 66: null, 67: null, 68: null, 69: null, 70: null,
    71: "approx. ¥327 million", 72: null, 73: "approx. ¥327 million", 74: "approx. ¥37.1 million", 75: "approx. ¥17.7 million", 76: "approx. ¥425 million", 77: null, 78: "approx. ¥17.7 million", 79: "approx. ¥215 million", 80: null,
    81: "approx. ¥327 million", 82: "approx. ¥17.7 million", 83: "approx. ¥215 million", 84: "approx. ¥44.6 million", 85: null, 86: "approx. ¥17.7 million", 87: "approx. ¥17.7 million", 88: null, 89: null, 90: null,
    91: "approx. ¥425 million", 92: null, 93: "approx. ¥327 million", 94: "approx. ¥215 million", 95: null, 96: "approx. ¥425 million", 97: "approx. ¥327 million", 98: "approx. ¥289 million", 99: null, 100: null,
};

// Highest court rank by poet number, from kajin-kanshoku.html. null when the rank is "―" or "unknown".
const RANK_BY_NUMBER = {
    1: null, 2: null, 3: null, 4: null, 5: null, 6: "Junior Third Rank", 7: null, 8: null, 9: null, 10: null,
    11: "Senior Third Rank", 12: null, 13: null, 14: "Senior Second Rank", 15: null, 16: "Senior Third Rank", 17: "Junior Fourth Rank, Upper Grade", 18: "Junior Fourth Rank, Upper Grade", 19: null, 20: "Sanpon (3rd Princely Rank)",
    21: null, 22: null, 23: "Junior Fifth Rank, Lower Grade", 24: "Junior Second Rank", 25: "Junior Second Rank", 26: "Senior First Rank", 27: "Junior Third Rank", 28: "Senior Fourth Rank, Lower Grade", 29: null, 30: "Senior Sixth Rank, Upper Grade",
    31: "Junior Fifth Rank, Lower Grade", 32: null, 33: null, 34: null, 35: "Junior Fifth Rank, Upper Grade", 36: "Junior Fifth Rank, Lower Grade", 37: "Junior Fifth Rank, Lower Grade", 38: null, 39: "Junior Fourth Rank, Upper Grade", 40: "Junior Fifth Rank, Upper Grade",
    41: null, 42: "Junior Fifth Rank, Upper Grade", 43: "Junior Third Rank", 44: "Junior Third Rank", 45: "Senior Second Rank", 46: null, 47: null, 48: "Junior Fifth Rank, Lower Grade", 49: "Junior Fourth Rank, Upper Grade", 50: "Junior Fifth Rank, Upper Grade",
    51: "Junior Fourth Rank, Upper Grade", 52: "Junior Fourth Rank, Upper Grade", 53: null, 54: null, 55: "Senior Second Rank", 56: null, 57: null, 58: "Junior Third Rank", 59: null, 60: null,
    61: null, 62: null, 63: "Junior Third Rank", 64: "Senior Third Rank", 65: null, 66: null, 67: null, 68: null, 69: null, 70: null,
    71: "Senior Second Rank", 72: null, 73: "Senior Second Rank", 74: "Junior Fourth Rank, Upper Grade", 75: "Junior Fifth Rank, Upper Grade", 76: "Junior First Rank", 77: null, 78: "Junior Fifth Rank, Lower Grade", 79: "Senior Third Rank", 80: null,
    81: "Senior Second Rank", 82: "Junior Fifth Rank, Upper Grade", 83: "Senior Third Rank", 84: "Senior Fourth Rank, Lower Grade", 85: null, 86: "Junior Fifth Rank, Lower Grade", 87: "Junior Fifth Rank, Upper Grade", 88: null, 89: "Sanpon (3rd Princely Rank)", 90: null,
    91: "Junior First Rank", 92: null, 93: "Senior Second Rank", 94: "Senior Third Rank", 95: null, 96: "Junior First Rank", 97: "Senior Second Rank", 98: "Junior Second Rank", 99: null, 100: null,
};

// ─── Helpers ─────────────────────────────────────────────────

function stripTags(html) {
    return (html || '')
        .replace(/<br\s*\/?>/gi, '　')
        .replace(/<rt>.*?<\/rt>/g, '')
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function extractRt(html) {
    return [...(html || '').matchAll(/<rt>(.*?)<\/rt>/g)]
        .map(m => m[1]).join('');
}

function extractBase(html) {
    return (html || '')
        .replace(/<rt>.*?<\/rt>/g, '')
        .replace(/<[^>]+>/g, '')
        .trim();
}

function translateDate(date) {
    if (!date) return '';
    if (date === '生没年不詳') return 'dates unknown';
    return date
        .replace('生没年不詳', 'dates unknown')
        .replace('生年不詳', 'b. unknown')
        .replace('没年不詳', 'd. unknown')
        .replace(/年頃/g, ' (approx.)')
        .replace(/年/g, '')
        .replace(/[～\-–]/g, '–');
}

/** Map first hiragana character to English section label */
function romajiSection(yomi) {
    const normalized = yomi.replace(/[ぁ-ん]/g, c => {
        const dakuten = 'がぎぐげござじずぜぞだぢづでどばびぶべぼ';
        const seion   = 'かきくけこさしすせそたちつてとはひふへほ';
        const handaku = 'ぱぴぷぺぽ';
        const ha      = 'はひふへほ';
        const d = dakuten.indexOf(c);
        if (d !== -1) return seion[d];
        const h = handaku.indexOf(c);
        if (h !== -1) return ha[h];
        return c;
    });
    const c = normalized[0];
    if ('あいうえお'.includes(c)) return 'A';
    if ('かきくけこ'.includes(c)) return 'K';
    if ('さしすせそ'.includes(c)) return 'S';
    if ('たちつてと'.includes(c)) return 'T';
    if ('なにぬねの'.includes(c)) return 'N';
    if ('はひふへほ'.includes(c)) return 'H';
    if ('まみむめも'.includes(c)) return 'M';
    if ('やゆよ'.includes(c))     return 'Y';
    if ('らりるれろ'.includes(c)) return 'R';
    if ('わをん'.includes(c))     return 'W';
    return '—';
}

function getEraNum(poet) {
    if (poet.era !== undefined) return poet.era;
    return eraNumFromNum(poet.n);
}

function eraNumFromNum(n) {
    if (n <= 7)  return 1;
    if (n <= 45) return 2;
    if (n <= 71) return 3;
    if (n <= 86) return 4;
    return 5;
}

// ─── Poet Data ───────────────────────────────────────────────

const POETS_RAW = [
    {
        n: 1, name: '<ruby>天智天皇<rt>てんじてんのう</rt></ruby>', date: '626年～671年', theme: 'autumn',
        poem: '<ruby>秋<rt>あき</rt></ruby>の<ruby>田<rt>た</rt></ruby>の…', job: '天皇', source: '後撰集',
        outline: 'Emperor who drove the great Taika Reforms', img: 'img/z01.webp',
    },
    {
        n: 2, name: '<ruby>持統天皇<rt>じとうてんのう</rt></ruby>', date: '645年～702年', theme: 'summer',
        poem: '<ruby>春<rt>はる</rt></ruby><ruby>過<rt>す</rt></ruby>ぎて…', job: '天皇', source: '新古今集',
        outline: 'Empress who held the reins of power at court', img: 'img/z02.webp',
    },
    {
        n: 3, name: '<ruby>柿本人麻呂<rt>かきのもとひとまろ</rt></ruby>', date: 'dates unknown', era: 1, theme: 'love',
        poem: 'あしびきの…', job: '官人', source: '拾遺集',
        outline: 'Revered as the god of waka, who met a tragic end', img: 'img/z03.webp',
    },
    {
        n: 4, name: '<ruby>山部赤人<rt>やまべのあかひと</rt></ruby>', date: 'dates unknown', theme: 'winter',
        poem: '<ruby>田子<rt>たご</rt></ruby>の<ruby>浦<rt>うら</rt></ruby>に…', job: '官人', source: '新古今集',
        outline: 'Master of landscape poetry who sang of nature\'s beauty', img: 'img/z04.webp',
    },
    {
        n: 5, name: '<ruby>猿丸太夫<rt>さるまるだゆう</rt></ruby>', date: 'dates unknown', theme: 'autumn',
        poem: '<ruby>奥山<rt>おくやま</rt></ruby>に…', job: '伝説', source: '古今集',
        outline: 'A legendary poet shrouded in mystery', img: 'img/z05.webp',
    },
    {
        n: 6, name: '<ruby>中納言家持<rt>ちゅうなごんやかもち</rt></ruby>', date: '718年頃～785年', theme: 'winter',
        poem: 'かささぎの…', job: '公卿', source: '新古今集',
        outline: 'Central figure in compiling the Man\'yōshū', img: 'img/z06.webp',
    },
    {
        n: 7, name: '<ruby>阿倍仲麻呂<rt>あべのなかまろ</rt></ruby>', date: '698年頃～770年', theme: 'travel',
        poem: '<ruby>天<rt>あま</rt></ruby>の<ruby>原<rt>はら</rt></ruby>…', job: 'その他', source: '古今集',
        outline: 'Brilliant official who went to Tang China and never returned', img: 'img/z07.webp',
    },
    {
        n: 8, name: '<ruby>喜撰法師<rt>きせんほうし</rt></ruby>', date: 'dates unknown', theme: 'misc',
        poem: 'わが<ruby>庵<rt>いお</rt></ruby>は…', job: '僧侶', source: '古今集',
        outline: 'A hermit of Uji who turned his back on the world', img: 'img/z08.webp',
    },
    {
        n: 9, name: '<ruby>小野小町<rt>おののこまち</rt></ruby>', date: 'dates unknown', theme: 'spring',
        poem: '<ruby>花<rt>はな</rt></ruby>の<ruby>色<rt>いろ</rt></ruby>は…', job: '女房', source: '古今集',
        outline: 'Peerless beauty who mourned her fading youth', img: 'img/z09.webp',
    },
    {
        n: 10, name: '<ruby>蝉丸<rt>せみまる</rt></ruby>', date: 'dates unknown', theme: 'misc',
        poem: 'これやこの…', job: '伝説', source: '後撰集',
        outline: 'A lute-playing monk who observed the comings and goings of the world', img: 'img/z10.webp',
    },
    {
        n: 11, name: '<ruby>参議篁<rt>さんぎたかむら</rt></ruby>', date: '802年～852年', theme: 'travel',
        poem: 'わたの<ruby>原<rt>はら</rt></ruby><br><ruby>八十島<rt>やそしま</rt></ruby>かけて…', job: '公卿', source: '古今集',
        outline: 'A rebellious court official who was exiled for insubordination', img: 'img/z11.webp',
    },
    {
        n: 12, name: '<ruby>僧正遍昭<rt>そうじょうへんじょう</rt></ruby>', date: '816年～890年', theme: 'misc',
        poem: '<ruby>天<rt>あま</rt></ruby>つ<ruby>風<rt>かぜ</rt></ruby>…', job: '僧侶', source: '古今集',
        outline: 'A court official who renounced the world to become a Buddhist monk', img: 'img/z12.webp',
    },
    {
        n: 13, name: '<ruby>陽成院<rt>ようぜいいん</rt></ruby>', date: '868年～949年', theme: 'love',
        poem: '<ruby>筑波嶺<rt>つくばね</rt></ruby>の…', job: '天皇', source: '後撰集',
        outline: 'An emperor notorious for bizarre and erratic behavior', img: 'img/z13.webp',
    },
    {
        n: 14, name: '<ruby>河原左大臣<rt>かわらのさだいじん</rt></ruby>', date: '822年～895年', theme: 'love',
        poem: '<ruby>陸奥<rt>みちのく</rt></ruby>の…', job: '公卿', source: '古今集',
        outline: 'A court noble who spared no expense in pursuit of luxury', img: 'img/z14.webp',
    },
    {
        n: 15, name: '<ruby>光孝天皇<rt>こうこうてんのう</rt></ruby>', date: '830年～887年', theme: 'spring',
        poem: '<ruby>君<rt>きみ</rt></ruby>がため<br><ruby>春<rt>はる</rt></ruby>の<ruby>野<rt>の</rt></ruby>に<ruby>出<rt>い</rt></ruby>でて…', job: '天皇', source: '古今集',
        outline: 'An emperor known for his modest and unpretentious way of life', img: 'img/z15.webp',
    },
    {
        n: 16, name: '<ruby>中納言行平<rt>ちゅうなごんゆきひら</rt></ruby>', date: '818年～893年', theme: 'farewell',
        poem: '<ruby>立<rt>た</rt></ruby>ち<ruby>別<rt>わか</rt></ruby>れ…', job: '公卿', source: '古今集',
        outline: 'A conscientious and dutiful court official', img: 'img/z16.webp',
    },
    {
        n: 17, name: '<ruby>在原業平朝臣<rt>ありわらのなりひらあそん</rt></ruby>', date: '825年～880年', theme: 'autumn',
        poem: 'ちはやぶる…', job: '貴族', source: '古今集',
        outline: 'The greatest romantic poet of the Heian era', img: 'img/z17.webp',
    },
    {
        n: 18, name: '<ruby>藤原敏行朝臣<rt>ふじわらのとしゆきあそん</rt></ruby>', date: '生年不詳～901年頃', theme: 'love',
        poem: '<ruby>住<rt>すみ</rt></ruby>の<ruby>江<rt>え</rt></ruby>の…', job: '貴族', source: '古今集',
        outline: 'A gifted calligrapher who died young', img: 'img/z18.webp',
    },
    {
        n: 19, name: '<ruby>伊勢<rt>いせ</rt></ruby>', date: 'dates unknown', theme: 'love',
        poem: '<ruby>難波潟<rt>なにわがた</rt></ruby>…', job: '女房', source: '新古今集',
        outline: 'A court poet cherished by two successive emperors', img: 'img/z19.webp',
    },
    {
        n: 20, name: '<ruby>元良親王<rt>もとよししんのう</rt></ruby>', date: '890年～943年', theme: 'love',
        poem: 'わびぬれば…', job: '皇族', source: '後撰集',
        outline: 'A prince who lived in frustration and hardship', img: 'img/z20.webp',
    },
    {
        n: 21, name: '<ruby>素性法師<rt>そせいほうし</rt></ruby>', date: 'dates unknown', theme: 'love',
        poem: '<ruby>今<rt>いま</rt></ruby>こ<ruby>む<rt>ん</rt></ruby>と…', job: '僧侶', source: '古今集',
        outline: 'A monk renowned for his outstanding love poems', img: 'img/z21.webp',
    },
    {
        n: 22, name: '<ruby>文屋康秀<rt>ふんやのやすひで</rt></ruby>', date: 'dates unknown', theme: 'autumn',
        poem: '<ruby>吹<rt>ふ</rt></ruby>くからに…', job: '貴族', source: '古今集',
        outline: 'A witty member of the Six Poetry Immortals', img: 'img/z22.webp',
    },
    {
        n: 23, name: '<ruby>大江千里<rt>おおえのちさと</rt></ruby>', date: 'dates unknown', theme: 'autumn',
        poem: '<ruby>月<rt>つき</rt></ruby>みれば…', job: '貴族', source: '古今集',
        outline: 'A minor official well-versed in Chinese verse', img: 'img/z23.webp',
    },
    {
        n: 24, name: '<ruby>菅家<rt>かんけ</rt></ruby>', date: '845年～903年', theme: 'travel',
        poem: 'このたびは…', job: '公卿', source: '古今集',
        outline: 'A brilliant statesman later deified as the patron god of scholarship', img: 'img/z24.webp',
    },
    {
        n: 25, name: '<ruby>三条右大臣<rt>さんじょうのうだいじん</rt></ruby>', date: '873年～932年', theme: 'love',
        poem: '<ruby>名<rt>な</rt></ruby>にし<ruby>負<rt>お</rt></ruby>はば', job: '公卿', source: '後撰集',
        outline: 'A court noble who supported the compilation of the Kokinshū', img: 'img/z25.webp',
    },
    {
        n: 26, name: '<ruby>貞信公<rt>ていしんこう</rt></ruby>', date: '880年～949年', theme: 'autumn',
        poem: '<ruby>小倉山<rt>おぐらやま</rt></ruby>…', job: '公卿', source: '拾遺集',
        outline: 'A steady and moderate court noble who served the imperial house', img: 'img/z26.webp',
    },
    {
        n: 27, name: '<ruby>中納言兼輔<rt>ちゅうなごんかねすけ</rt></ruby>', date: '877年～933年', theme: 'love',
        poem: 'みかの<ruby>原<rt>はら</rt></ruby>…', job: '公卿', source: '新古今集',
        outline: 'A poet who was the great-great-grandfather of Murasaki Shikibu', img: 'img/z27.webp',
    },
    {
        n: 28, name: '<ruby>源宗于朝臣<rt>みなもとのむねゆきあそん</rt></ruby>', date: '生年不詳～939年', theme: 'winter',
        poem: '<ruby>山里<rt>やまざと</rt></ruby>は…', job: '貴族', source: '古今集',
        outline: 'An imperial son demoted to commoner status', img: 'img/z28.webp',
    },
    {
        n: 29, name: '<ruby>凡河内躬恒<rt>おおしこうちのみつね</rt></ruby>', date: 'dates unknown', theme: 'autumn',
        poem: '<ruby>心当<rt>こころあ</rt></ruby>てに…', job: '官人', source: '古今集',
        outline: 'One of the Thirty-six Poetry Immortals and a Kokinshū compiler', img: 'img/z29.webp',
    },
    {
        n: 30, name: '<ruby>壬生忠岑<rt>みぶのただみね</rt></ruby>', date: 'dates unknown', theme: 'love',
        poem: '<ruby>有明<rt>ありあけ</rt></ruby>の…', job: '貴族', source: '古今集',
        outline: 'A poet highly praised by Fujiwara no Teika', img: 'img/z30.webp',
    },
    {
        n: 31, name: '<ruby>坂上是則<rt>さかのうえのこれのり</rt></ruby>', date: 'dates unknown', theme: 'winter',
        poem: '<ruby>朝<rt>あさ</rt></ruby>ぼらけ<br><ruby>有明<rt>ありあけ</rt></ruby>の<ruby>月<rt>つき</rt></ruby>と…', job: '貴族', source: '古今集',
        outline: 'A poet who also excelled at the court sport of kemari football', img: 'img/z31.webp',
    },
    {
        n: 32, name: '<ruby>春道列樹<rt>はるみちのつらき</rt></ruby>', date: '生年不詳～920年', theme: 'autumn',
        poem: '<ruby>山川<rt>やまがわ</rt></ruby>に…', job: '官人', source: '古今集',
        outline: 'A low-ranking official descended from an ancient clan', img: 'img/z32.webp',
    },
    {
        n: 33, name: '<ruby>紀友則<rt>きのとものり</rt></ruby>', date: '生年不詳～904年頃', theme: 'spring',
        poem: '<ruby>久方<rt>ひさかた</rt></ruby>の…', job: '官人', source: '古今集',
        outline: 'A Kokinshū compiler who died before its completion', img: 'img/z33.webp',
    },
    {
        n: 34, name: '<ruby>藤原興風<rt>ふじわらのおきかぜ</rt></ruby>', date: 'dates unknown', theme: 'misc',
        poem: '<ruby>誰<rt>たれ</rt></ruby>をかも…', job: '官人', source: '古今集',
        outline: 'A poet who sang of the loneliness and isolation of old age', img: 'img/z34.webp',
    },
    {
        n: 35, name: '<ruby>紀貫之<rt>きのつらゆき</rt></ruby>', date: '868年～945年', theme: 'spring',
        poem: '<ruby>人<rt>ひと</rt></ruby>はいさ…', job: '貴族', source: '古今集',
        outline: 'The poet who shaped the classical form of waka poetry', img: 'img/z35.webp',
    },
    {
        n: 36, name: '<ruby>清原深養父<rt>きよはらのふかやぶ</rt></ruby>', date: 'dates unknown', theme: 'summer',
        poem: '<ruby>夏<rt>なつ</rt></ruby>の<ruby>夜<rt>よ</rt></ruby>は…', job: '貴族', source: '古今集',
        outline: 'A poet of gentle sensibility and graceful expression', img: 'img/z36.webp',
    },
    {
        n: 37, name: '<ruby>文屋朝康<rt>ふんやのあさやす</rt></ruby>', date: 'dates unknown', theme: 'autumn',
        poem: '<ruby>白露<rt>しらつゆ</rt></ruby>に…', job: '官人', source: '後撰集',
        outline: 'A low-ranking official who earned lasting fame through verse', img: 'img/z37.webp',
    },
    {
        n: 38, name: '<ruby>右近<rt>うこん</rt></ruby>', date: 'dates unknown', theme: 'love',
        poem: '<ruby>忘<rt>わす</rt></ruby>らるる…', job: '女房', source: '拾遺集',
        outline: 'A female poet who sang of a love that betrayed her', img: 'img/z38.webp',
    },
    {
        n: 39, name: '<ruby>参議等<rt>さんぎひとし</rt></ruby>', date: '880年～951年', theme: 'love',
        poem: '<ruby>浅茅生<rt>あさじう</rt></ruby>の…', job: '公卿', source: '後撰集',
        outline: 'A distinguished poet of the Saga Genji lineage', img: 'img/z39.webp',
    },
    {
        n: 40, name: '<ruby>平兼盛<rt>たいらのかねもり</rt></ruby>', date: '生年不詳～990年', theme: 'love',
        poem: '<ruby>忍<rt>しの</rt></ruby>ぶれど…', job: '貴族', source: '拾遺集',
        outline: 'A poet who made his name at the famous Tentoku Imperial Poetry Contest', img: 'img/z40.webp',
    },
    {
        n: 41, name: '<ruby>壬生忠見<rt>みぶのただみ</rt></ruby>', date: 'dates unknown', theme: 'love',
        poem: '<ruby>恋<rt>こい</rt></ruby>す<ruby>てふ<rt>ちょう</rt></ruby>…', job: '官人', source: '拾遺集',
        outline: 'An ill-fated poet who lost at the Tentoku Imperial Poetry Contest', img: 'img/z41.webp',
    },
    {
        n: 42, name: '<ruby>清原元輔<rt>きよはらのもとすけ</rt></ruby>', date: '908年～990年', theme: 'love',
        poem: '<ruby>契<rt>ちぎ</rt></ruby>りきな…', job: '貴族', source: '後拾遺集',
        outline: 'A poet who was the father of Sei Shōnagon', img: 'img/z42.webp',
    },
    {
        n: 43, name: '<ruby>権中納言敦忠<rt>ごんちゅうなごんあつただ</rt></ruby>', date: '906年～943年', theme: 'love',
        poem: '<ruby>逢<rt>あ</rt></ruby><ruby>ひ<rt>い</rt></ruby><ruby>見<rt>み</rt></ruby>ての…', job: '公卿', source: '拾遺集',
        outline: 'A romantic young nobleman with many loves', img: 'img/z43.webp',
    },
    {
        n: 44, name: '<ruby>中納言朝忠<rt>ちゅうなごんあさただ</rt></ruby>', date: '910年～966年', theme: 'love',
        poem: '<ruby>逢<rt>あ</rt></ruby><ruby>ふ<rt>う</rt></ruby>ことの…', job: '公卿', source: '拾遺集',
        outline: 'A court poet accomplished at playing the shō mouth organ', img: 'img/z44.webp',
    },
    {
        n: 45, name: '<ruby>謙徳公<rt>けんとくこう</rt></ruby>', date: '924年～972年', theme: 'love',
        poem: 'あ<ruby>はれ<rt>われ</rt></ruby>とも…', job: '公卿', source: '拾遺集',
        outline: 'A powerful court noble whose love was never requited', img: 'img/z45.webp',
    },
    {
        n: 46, name: '<ruby>曽禰好忠<rt>そねのよしただ</rt></ruby>', date: 'dates unknown', theme: 'love',
        poem: '<ruby>由良<rt>ゆら</rt></ruby>のとを…', job: '官人', source: '新古今集',
        outline: 'A bold and unconventional up-and-coming poet', img: 'img/z46.webp',
    },
    {
        n: 47, name: '<ruby>恵慶法師<rt>えぎょうほうし</rt></ruby>', date: 'dates unknown', theme: 'autumn',
        poem: '<ruby>八重葎<rt>やえむぐら</rt></ruby>…', job: '僧侶', source: '拾遺集',
        outline: 'A monk who was active at the heart of the poetry world', img: 'img/z47.webp',
    },
    {
        n: 48, name: '<ruby>源重之<rt>みなもとのしげゆき</rt></ruby>', date: 'dates unknown', theme: 'love',
        poem: '<ruby>風<rt>かぜ</rt></ruby>をいたみ…', job: '貴族', source: '詞花集',
        outline: 'A nobleman of high birth who served his career as a provincial governor', img: 'img/z48.webp',
    },
    {
        n: 49, name: '<ruby>大中臣能宣朝臣<rt>おおなかとみのよしのぶあそん</rt></ruby>', date: '921年～991年', theme: 'love',
        poem: '<ruby>御垣守<rt>みかきもり</rt></ruby>…', job: '貴族', source: '詞花集',
        outline: 'A poet who served as head priest of the Grand Shrine of Ise', img: 'img/z49.webp',
    },
    {
        n: 50, name: '<ruby>藤原義孝<rt>ふじわらのよしたか</rt></ruby>', date: '954年～974年', theme: 'love',
        poem: '<ruby>君<rt>きみ</rt></ruby>がため<br><ruby>惜<rt>お</rt></ruby>しからざりし…', job: '貴族', source: '後拾遺集',
        outline: 'A sincere young aristocrat who died in his prime', img: 'img/z50.webp',
    },
    {
        n: 51, name: '<ruby>藤原実方朝臣<rt>ふじわらのさねかたあそん</rt></ruby>', date: '生年不詳～998年', theme: 'love',
        poem: 'かくとだに…', job: '貴族', source: '後拾遺集',
        outline: 'A dashing courtier who was banished to the provinces', img: 'img/z51.webp',
    },
    {
        n: 52, name: '<ruby>藤原道信朝臣<rt>ふじわらのみちのぶあそん</rt></ruby>', date: '972年～994年', theme: 'love',
        poem: '明けぬれば…', job: '貴族', source: '後拾遺集',
        outline: 'A young court poet who died early', img: 'img/z52.webp',
    },
    {
        n: 53, name: '<ruby>右大将道綱母<rt>うだいしょうみちつなのはは</rt></ruby>', date: '937年頃～995年頃', theme: 'love',
        poem: '<ruby>嘆<rt>なげ</rt></ruby>きつつ…', job: 'その他', source: '拾遺集',
        outline: 'A female poet who chronicled the anguish of her married life', img: 'img/z53.webp',
    },
    {
        n: 54, name: '<ruby>儀同三司母<rt>ぎどうさんしのはは</rt></ruby>', date: '生年不詳～996年', theme: 'love',
        poem: '<ruby>忘<rt>わす</rt></ruby>れじの…', job: '女房', source: '千載集',
        outline: 'A female poet who witnessed the rise and fall of the Nakanokwanpaku clan', img: 'img/z54.webp',
    },
    {
        n: 55, name: '<ruby>大納言公任<rt>だいなごんきんとう</rt></ruby>', date: '966年～1041年', theme: 'misc',
        poem: '<ruby>滝<rt>たき</rt></ruby>の<ruby>音<rt>おと</rt></ruby>は…', job: '公卿', source: '千載集',
        outline: 'A man of many talents and wide cultural learning', img: 'img/z55.webp',
    },
    {
        n: 56, name: '<ruby>和泉式部<rt>いずみしきぶ</rt></ruby>', date: 'dates unknown', theme: 'love',
        poem: 'あらざら<ruby>む<rt>ん</rt></ruby>…', job: '女房', source: '後拾遺集',
        outline: 'A naturally gifted poet known for her passionate loves', img: 'img/z56.webp',
    },
    {
        n: 57, name: '<ruby>紫式部<rt>むらさきしきぶ</rt></ruby>', date: '970年頃～1014年頃', theme: 'misc',
        poem: 'めぐり<ruby>逢<rt>あ</rt></ruby><ruby>ひ<rt>い</rt></ruby>て…', job: '女房', source: '新古今集',
        outline: 'Author of the world\'s oldest full-length novel written by a woman', img: 'img/z57.webp',
    },
    {
        n: 58, name: '<ruby>大弐三位<rt>だいにのさんみ</rt></ruby>', date: '999年～没年不詳', theme: 'love',
        poem: 'ありま<ruby>山<rt>やま</rt></ruby>…', job: '女房', source: '後拾遺集',
        outline: 'A female poet whose social standing rose dramatically', img: 'img/z58.webp',
    },
    {
        n: 59, name: '<ruby>赤染衛門<rt>あかぞめえもん</rt></ruby>', date: '956年？～1041年？', theme: 'love',
        poem: 'やすら<ruby>は<rt>わ</rt></ruby>で…', job: '女房', source: '後拾遺集',
        outline: 'A learned and refined female poet', img: 'img/z59.webp',
    },
    {
        n: 60, name: '<ruby>小式部内侍<rt>こしきぶのないし</rt></ruby>', date: '生年不詳～1025年', theme: 'misc',
        poem: '<ruby>大江山<rt>おおえやま</rt></ruby>…', job: '女房', source: '金葉集',
        outline: 'A quick-witted poet celebrated for her brilliant impromptu verse', img: 'img/z60.webp',
    },
    {
        n: 61, name: '<ruby>伊勢大輔<rt>いせのたいふ</rt></ruby>', date: 'dates unknown', theme: 'spring',
        poem: 'いにし<ruby>へ<rt>え</rt></ruby>の…', job: '女房', source: '詞花集',
        outline: 'A court lady who astonished the palace with her off-the-cuff verse', img: 'img/z61.webp',
    },
    {
        n: 62, name: '<ruby>清少納言<rt>せいしょうなごん</rt></ruby>', date: 'dates unknown', theme: 'misc',
        poem: '<ruby>夜<rt>よ</rt></ruby>をこめて…', job: '女房', source: '後拾遺集',
        outline: 'A female author who devoted herself to supporting Empress Teishi', img: 'img/z62.webp',
    },
    {
        n: 63, name: '<ruby>左京大夫道雅<rt>さきょうのだいぶみちまさ</rt></ruby>', date: '992年～1054年', theme: 'love',
        poem: 'いまはただ…', job: '貴族', source: '後拾遺集',
        outline: 'A declining noble known as "the wicked third-rank official"', img: 'img/z63.webp',
    },
    {
        n: 64, name: '<ruby>権中納言定頼<rt>ごんちゅうなごんさだより</rt></ruby>', date: '995年～1045年', theme: 'winter',
        poem: '<ruby>朝<rt>あさ</rt></ruby>ぼらけ<br><ruby>宇治<rt>うじ</rt></ruby>の<ruby>川霧<rt>かわぎり</rt></ruby>…', job: '公卿', source: '千載集',
        outline: 'An aristocrat who tried to test Koshikibu no Naishi\'s quick wit', img: 'img/z64.webp',
    },
    {
        n: 65, name: '<ruby>相模<rt>さがみ</rt></ruby>', date: 'dates unknown', theme: 'love',
        poem: '<ruby>恨<rt>うら</rt></ruby>みわび…', job: '女房', source: '後拾遺集',
        outline: 'A female poet who stood at the forefront of the court poetry world', img: 'img/z65.webp',
    },
    {
        n: 66, name: '<ruby>前大僧正行尊<rt>さきのだいそうじょうぎょうそん</rt></ruby>', date: '1055年～1135年', theme: 'misc',
        poem: 'もろともに…', job: '僧侶', source: '金葉集',
        outline: 'A lofty hermit poet tempered by mountain ascetic practice', img: 'img/z66.webp',
    },
    {
        n: 67, name: '<ruby>周防内侍<rt>すおうのないし</rt></ruby>', date: 'dates unknown', theme: 'misc',
        poem: '<ruby>春<rt>はる</rt></ruby>の<ruby>夜<rt>よ</rt></ruby>の…', job: '女房', source: '千載集',
        outline: 'A court lady who deflected amorous nobles with sharp-tongued wit', img: 'img/z67.webp',
    },
    {
        n: 68, name: '<ruby>三条院<rt>さんじょういん</rt></ruby>', date: '976年～1017年', theme: 'misc',
        poem: '<ruby>心<rt>こころ</rt></ruby>にも…', job: '天皇', source: '後拾遺集',
        outline: 'An emperor who stood firm against pressure from Fujiwara no Michinaga', img: 'img/z68.webp',
    },
    {
        n: 69, name: '<ruby>能因法師<rt>のういんほうし</rt></ruby>', date: '988年～没年不詳', theme: 'autumn',
        poem: '<ruby>嵐<rt>あらし</rt></ruby><ruby>吹<rt>ふ</rt></ruby>く…', job: '僧侶', source: '後拾遺集',
        outline: 'A wandering monk with a deep love of celebrated poetic places', img: 'img/z69.webp',
    },
    {
        n: 70, name: '<ruby>良暹法師<rt>りょうぜんほうし</rt></ruby>', date: 'dates unknown', theme: 'autumn',
        poem: 'さびしさに…', job: '僧侶', source: '後拾遺集',
        outline: 'A Buddhist monk who lived in quiet seclusion at Ōhara', img: 'img/z70.webp',
    },
    {
        n: 71, name: '<ruby>大納言経信<rt>だいなごんつねのぶ</rt></ruby>', date: '1016年～1097年', theme: 'autumn',
        poem: '<ruby>夕<rt>ゆう</rt></ruby>されば…', job: '公卿', source: '金葉集',
        outline: 'A versatile cultural figure comparable to Dainagon Kintō', img: 'img/z71.webp',
    },
    {
        n: 72, name: '<ruby>祐子内親王家紀伊<rt>ゆうしないしんのうけのきい</rt></ruby>', date: 'dates unknown', theme: 'love',
        poem: '<ruby>音<rt>おと</rt></ruby>に<ruby>聞<rt>き</rt></ruby>く…', job: '女房', source: '金葉集',
        outline: 'An older female poet who was courted by young aristocrats', img: 'img/z72.webp',
    },
    {
        n: 73, name: '<ruby>権中納言匡房<rt>ごんちゅうなごんまさふさ</rt></ruby>', date: '1041年～1111年', theme: 'spring',
        poem: '<ruby>高砂<rt>たかさご</rt></ruby>の…', job: '公卿', source: '後拾遺集',
        outline: 'A great Sinologist who tutored three successive emperors', img: 'img/z73.webp',
    },
    {
        n: 74, name: '<ruby>源俊頼朝臣<rt>みなもとのとしよりあそん</rt></ruby>', date: '1055年～1129年', theme: 'love',
        poem: '<ruby>憂<rt>う</rt></ruby>かりける…', job: '貴族', source: '千載集',
        outline: 'A poet who led the poetry world despite his modest official rank', img: 'img/z74.webp',
    },
    {
        n: 75, name: '<ruby>藤原基俊<rt>ふじわらのもととし</rt></ruby>', date: '1060年～1142年', theme: 'misc',
        poem: '<ruby>契<rt>ちぎ</rt></ruby>りおきし…', job: '貴族', source: '千載集',
        outline: 'A poet who championed the conservative classical style', img: 'img/z75.webp',
    },
    {
        n: 76, name: '<ruby>法性寺入道前関白太政大臣<rt>ほっしょうじにゅうどうさきのかんぱくだいじょうだいじん</rt></ruby>', date: '1097年～1164年', theme: 'misc',
        poem: 'わたの<ruby>原<rt>はら</rt></ruby>…', job: '僧侶', source: '詞花集',
        outline: 'A politically adept court noble who was also an accomplished poet', img: 'img/z76.webp',
    },
    {
        n: 77, name: '<ruby>崇徳院<rt>すとくいん</rt></ruby>', date: '1119年～1164年', theme: 'love',
        poem: '<ruby>瀬<rt>せ</rt></ruby>をはやみ…', job: '天皇', source: '詞花集',
        outline: 'An emperor who was feared as a vengeful spirit after his death', img: 'img/z77.webp',
    },
    {
        n: 78, name: '<ruby>源兼昌<rt>みなもとのかねまさ</rt></ruby>', date: 'dates unknown', theme: 'winter',
        poem: '<ruby>淡路島<rt>あわじしま</rt></ruby>…', job: '貴族', source: '金葉集',
        outline: 'A poet who compared his misfortune to the world of The Tale of Genji', img: 'img/z78.webp',
    },
    {
        n: 79, name: '<ruby>左京大夫顕輔<rt>さきょうのだいぶあきすけ</rt></ruby>', date: '1090年～1155年', theme: 'autumn',
        poem: '<ruby>秋風<rt>あきかぜ</rt></ruby>に…', job: '貴族', source: '新古今集',
        outline: 'A poet whose career was troubled by conflict with his father', img: 'img/z79.webp',
    },
    {
        n: 80, name: '<ruby>待賢門院堀河<rt>たいけんもんいんのほりかわ</rt></ruby>', date: 'dates unknown', theme: 'love',
        poem: '<ruby>長<rt>なが</rt></ruby>から<ruby>む<rt>ん</rt></ruby>…', job: '女房', source: '千載集',
        outline: 'A court-lady poet who composed graceful and elegant love poems', img: 'img/z80.webp',
    },
    {
        n: 81, name: '<ruby>後徳大寺左大臣<rt>ごとくだいじのさだいじん</rt></ruby>', date: '1139年～1191年', theme: 'summer',
        poem: 'ほととぎす…', job: '公卿', source: '千載集',
        outline: 'A court noble who loved refinement and excelled at music', img: 'img/z81.webp',
    },
    {
        n: 82, name: '<ruby>道因法師<rt>どういんほうし</rt></ruby>', date: '1090年～没年不詳', theme: 'love',
        poem: '<ruby>思<rt>おも</rt></ruby><ruby>ひ<rt>い</rt></ruby>わび…', job: '僧侶', source: '千載集',
        outline: 'A poet who burned with devoted passion for waka well into old age', img: 'img/z82.webp',
    },
    {
        n: 83, name: '<ruby>皇太后宮大夫俊成<rt>こうたいごうぐうのだいぶとしなり</rt></ruby>', date: '1114年～1204年', theme: 'misc',
        poem: '<ruby>世<rt>よ</rt></ruby>の<ruby>中<rt>なか</rt></ruby>よ…', job: '公卿', source: '千載集',
        outline: 'A poet who devoted his art to the ideal of yūgen (mysterious beauty)', img: 'img/z83.webp',
    },
    {
        n: 84, name: '<ruby>藤原清輔朝臣<rt>ふじわらのきよすけあそん</rt></ruby>', date: '1104年～1177年', theme: 'misc',
        poem: '<ruby>長<rt>なが</rt></ruby>ら<ruby>へ<rt>え</rt></ruby>ば…', job: '貴族', source: '新古今集',
        outline: 'A late-blooming scholar who became a leading authority on waka', img: 'img/z84.webp',
    },
    {
        n: 85, name: '<ruby>俊恵法師<rt>しゅんえほうし</rt></ruby>', date: '1113年～没年不詳', theme: 'love',
        poem: '<ruby>夜<rt>よ</rt></ruby>もすがら…', job: '僧侶', source: '千載集',
        outline: 'A monk who became the poetry teacher of Kamo no Chōmei', img: 'img/z85.webp',
    },
    {
        n: 86, name: '<ruby>西行法師<rt>さいぎょうほうし</rt></ruby>', date: '1118年～1190年', theme: 'love',
        poem: '<ruby>嘆<rt>なげ</rt></ruby>けとて…', job: '僧侶', source: '千載集',
        outline: 'An elite warrior who suddenly renounced the world to become a wandering poet', img: 'img/z86.webp',
    },
    {
        n: 87, name: '<ruby>寂蓮法師<rt>じゃくれんほうし</rt></ruby>', date: '1139年頃～1202年', theme: 'autumn',
        poem: '<ruby>村雨<rt>むらさめ</rt></ruby>の…', job: '僧侶', source: '新古今集',
        outline: 'A monk poet who died before the Shin Kokinshū was completed', img: 'img/z87.webp',
    },
    {
        n: 88, name: '<ruby>皇嘉門院別当<rt>こうかもんいんのべっとう</rt></ruby>', date: 'dates unknown', theme: 'love',
        poem: '<ruby>難波江<rt>なにわえ</rt></ruby>の…', job: '女房', source: '千載集',
        outline: 'A senior court official who oversaw the imperial ladies-in-waiting', img: 'img/z88.webp',
    },
    {
        n: 89, name: '<ruby>式子内親王<rt>しょくしないしんのう</rt></ruby>', date: '1149年～1201年', theme: 'love',
        poem: '<ruby>玉<rt>たま</rt></ruby>の<ruby>緒<rt>お</rt></ruby>よ…', job: '皇族', source: '新古今集',
        outline: 'An imperial princess poet who embodied both dignity and solitude', img: 'img/z89.webp',
    },
    {
        n: 90, name: '<ruby>殷富門院大輔<rt>いんぷもんいんのたいふ</rt></ruby>', date: 'dates unknown', theme: 'love',
        poem: '<ruby>見<rt>み</rt></ruby>せばやな…', job: '女房', source: '千載集',
        outline: 'A prolific court-lady poet who left many poems', img: 'img/z90.webp',
    },
    {
        n: 91, name: '<ruby>後京極摂政前太政大臣<rt>ごきょうごくせっしょうさきのだいじょうだいじん</rt></ruby>', date: '1169年～1206年', theme: 'autumn',
        poem: 'きりぎりす…', job: '公卿', source: '新古今集',
        outline: 'A court noble who vanished from the world at the pinnacle of his power', img: 'img/z91.webp',
    },
    {
        n: 92, name: '<ruby>二条院讃岐<rt>にじょういんのさぬき</rt></ruby>', date: '1141年頃～1217年頃', theme: 'love',
        poem: 'わが<ruby>袖<rt>そで</rt></ruby>は…', job: '女房', source: '千載集',
        outline: 'A court-lady poet who endured the upheaval of the Genpei War', img: 'img/z92.webp',
    },
    {
        n: 93, name: '<ruby>鎌倉右大臣<rt>かまくらのうだいじん</rt></ruby>', date: '1192年～1219年', theme: 'travel',
        poem: '<ruby>世<rt>よ</rt></ruby>の<ruby>中<rt>なか</rt></ruby>は…', job: '公卿', source: '新勅撰集',
        outline: 'A shogun who dreamed of peace amid the bloodshed of Kamakura', img: 'img/z93.webp',
    },
    {
        n: 94, name: '<ruby>参議雅経<rt>さんぎまさつね</rt></ruby>', date: '1170年～1221年', theme: 'autumn',
        poem: 'み<ruby>吉野<rt>よしの</rt></ruby>の…', job: '公卿', source: '新古今集',
        outline: 'A court noble whose family tradition was the elegant art of kemari football', img: 'img/z94.webp',
    },
    {
        n: 95, name: '<ruby>前大僧正慈円<rt>さきのだいそうじょうじえん</rt></ruby>', date: '1155年～1225年', theme: 'misc',
        poem: 'お<ruby>ほ<rt>お</rt></ruby>けなく…', job: '僧侶', source: '千載集',
        outline: 'A compassionate monk who tried to save the turbulent world through prayer', img: 'img/z95.webp',
    },
    {
        n: 96, name: '<ruby>入道前太政大臣<rt>にゅうどうさきのだいじょうだいじん</rt></ruby>', date: '1171年～1244年', theme: 'misc',
        poem: '<ruby>花<rt>はな</rt></ruby>さそ<ruby>ふ<rt>う</rt></ruby>…', job: '公卿', source: '新勅撰集',
        outline: 'A shrewd court noble who allied himself with the Kamakura shogunate', img: 'img/z96.webp',
    },
    {
        n: 97, name: '<ruby>権中納言定家<rt>ごんちゅうなごんさだいえ</rt></ruby>', date: '1162年～1241年', theme: 'love',
        poem: '<ruby>来<rt>こ</rt></ruby>ぬ<ruby>人<rt>ひと</rt></ruby>を…', job: '公卿', source: '新勅撰集',
        outline: 'The court noble who compiled the Hyakunin Isshu', img: 'img/z97.webp',
    },
    {
        n: 98, name: '<ruby>従二位家隆<rt>じゅにいいえたか</rt></ruby>', date: '1158年～1237年', theme: 'summer',
        poem: '<ruby>風<rt>かぜ</rt></ruby>そよぐ…', job: '公卿', source: '新勅撰集',
        outline: 'A gentle poet who co-led the poetry world alongside Teika', img: 'img/z98.webp',
    },
    {
        n: 99, name: '<ruby>後鳥羽院<rt>ごとばいん</rt></ruby>', date: '1180年～1239年', theme: 'misc',
        poem: '<ruby>人<rt>ひと</rt></ruby>もをし…', job: '天皇', source: '続後撰集',
        outline: 'The emperor who launched the Jōkyū Disturbance against the shogunate', img: 'img/z99.webp',
    },
    {
        n: 100, name: '<ruby>順徳院<rt>じゅんとくいん</rt></ruby>', date: '1197年～1242年', theme: 'misc',
        poem: 'ももしきや…', job: '天皇', source: '続後撰集',
        outline: 'An emperor who devoted himself to his father\'s unfulfilled aspirations', img: 'img/z100.webp',
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
        // list_en.html（js/poet-index.js）の歌人データと同じ英語名（js/poet-names-en.js）を併記する。
        nameEn: (window.POET_NAMES_EN && window.POET_NAMES_EN[p.n]) || '',
        date: p.date.includes('年') ? translateDate(p.date) : p.date,
        era: ERA_LABELS[eraNum],
        eraNum,
        theme: p.theme,
        // p.poemはカード上部に表示していた頃の一部省略プレビュー用テキスト
        // （末尾が「…」で切れている）なので、検索対象にするには不十分。
        // poems.jsのeng（歌人図鑑に表示している英訳と同じデータソース）から全文を使う。
        poemText: (() => {
            const full = typeof poems !== 'undefined' ? poems[String(p.n)] : null;
            return full ? stripTags(full.eng) : stripTags(p.poem);
        })(),
        job: p.job,
        source: p.source || '',
        outline: p.outline || '',
        img: p.img || '',
    };
});

// ─── State ───────────────────────────────────────────────────

const state = {
    sortMode: 'number',
    filterTheme: null,
    filterEra: null,
    filterJob: null,
    filterSource: null,
    searchQuery: '',
};

// ─── Render Helpers ──────────────────────────────────────────

function buildCard(poet) {
    const a = document.createElement('a');
    a.className = 'poet-card';
    a.href = `/gokunarabe_${String(poet.number).padStart(2, '0')}_en.html`;
    a.dataset.number = poet.number;
    a.dataset.yomi = poet.yomi;
    a.dataset.theme = poet.theme;
    a.dataset.era = poet.eraNum;

    const theme = THEME_LABELS[poet.theme] || THEME_LABELS.misc;
    const jobText = JOB_LABELS_EN[poet.job] || poet.job || '—';
    const sourceText = SOURCE_DISPLAY[poet.source] || poet.source || '—';
    const extraImg = `img/c_${String(poet.number).padStart(3, '0')}.webp`;
    const estimatedIncome = ESTIMATED_INCOME_BY_NUMBER[poet.number];
    const incomeValue = estimatedIncome || 'Unknown';
    const incomeText = `<br>(Estimated annual income: ${incomeValue})`;
    const rank = RANK_BY_NUMBER[poet.number];
    const rankText = rank ? `, Rank: ${rank}` : '';

    const kokoro = window.KOKORO_CHART_DATA && window.KOKORO_CHART_DATA[poet.number];
    const poemData = typeof poems !== 'undefined' ? poems[String(poet.number)] : null;

    a.innerHTML = `
    <span class="card-number">${poet.number}</span>
    <div class="card-img">${poet.img ? `<img src="${poet.img}" alt="${poet.name}" loading="lazy">` : ''}</div>
    <div class="card-body">
      <div class="card-meta"><span class="card-job">Role: ${jobText}${rankText}${incomeText}</span></div>
      <div class="card-name">${poet.nameHtml}${poet.nameEn ? `<span class="card-name-en">${poet.nameEn}</span>` : ''}</div>
      <div class="card-date">${poet.era}</div>
      <div class="card-date">${poet.date}</div>
      ${poet.outline ? `<div class="card-outline">${poet.outline}</div>` : ''}
      <div class="card-poem"><span class="card-theme" data-theme="${poet.theme}">${theme.icon} ${theme.label}</span> (${sourceText})</div>
      ${extraImg ? `<img class="card-extra-img" src="${extraImg}" alt="${poet.name}" loading="lazy">` : ''}
      ${kokoro ? `
      <div class="kokoro-panel">
        <div class="emotion-chart">
          <div class="kokoro-panel-text">
            <h3 class="kokoro-panel-poem-title">The Poem</h3>
            <div class="kokoro-panel-poem">${poemData ? poemData.eng : ''}</div>
            <h3 class="kokoro-panel-quotes-title">The Poet's Feelings</h3>
            <div class="kokoro-panel-quotes">${kokoro.quotes.map(q => `<p>${q}</p>`).join('')}</div>
          </div>
          <div class="radarChartWrapper"><canvas class="radarChart"></canvas></div>
        </div>
      </div>` : ''}
    </div>`;

    return a;
}

// ─── Chart of the Heart (shown on every card, not toggled) ────
// Each Chart.js instance costs roughly 10ms to create, so building all 100 at once
// blocks the main thread for over a second and makes the page feel slow to load.
// An IntersectionObserver defers chart creation until a card scrolls near the
// viewport, so only the cards actually visible on load pay that cost up front.
// (Grid layout / subgrid row-alignment depends only on .radarChartWrapper's CSS
// aspect-ratio, not on the canvas's contents, so deferring the draw never causes
// layout shift.)

let chartInstances = [];
let chartObserver = null;

// Score object keys are always Japanese (matches kokoro-chart-data*.js); only the
// displayed axis labels are translated.
const SCORE_KEYS = ['愛情', '孤独', '情熱', '哀愁', '無常', '自然'];
const LABELS = ['Romance', 'Solitude', 'Passion', 'Melancholy', 'Transience', 'Nature'];

// On mobile the axis labels are hard to read, so use a larger font under 768px.
// English labels (e.g. "Melancholy") are longer than the Japanese ones, so the
// increase is kept smaller than the JP version to avoid overlap.
function getPointLabelFontSize() {
    return window.matchMedia('(max-width: 768px)').matches ? 11 : 9;
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
            labels: LABELS,
            datasets: [{
                data: SCORE_KEYS.map(a => scores[a] ?? 0),
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
            animation: false, // many charts render over time; skip per-chart animation
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
    // Destroy the previous batch of Chart instances and observer before the grid is rebuilt
    chartInstances.forEach(c => c.destroy());
    chartInstances = [];
    if (chartObserver) chartObserver.disconnect();

    const canvases = document.querySelectorAll('.radarChart');

    if (!('IntersectionObserver' in window)) {
        // Fallback for unsupported environments: render everything immediately
        canvases.forEach(renderOneChart);
        return;
    }

    // rootMargin pre-renders charts 600px before they'd actually enter the viewport,
    // so they're already drawn by the time the user scrolls to them.
    chartObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            renderOneChart(entry.target);
            observer.unobserve(entry.target);
        });
    }, { rootMargin: '600px 0px' });

    canvases.forEach(canvas => chartObserver.observe(canvas));
}

// A large, discontinuous scroll (dragging the scrollbar thumb, pressing End, etc.)
// can outrun the IntersectionObserver notifications and leave some charts unrendered,
// so also sweep nearby canvases directly whenever the page scrolls, as a safety net.
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

    let list = POETS.filter(p => {
        if (state.filterTheme && p.theme !== state.filterTheme) return false;
        if (state.filterEra && p.eraNum !== state.filterEra) return false;
        if (state.filterJob && p.job !== state.filterJob) return false;
        if (state.filterSource && p.source !== state.filterSource) return false;
        if (query) {
            const q = query.toLowerCase();
            if (!p.name.toLowerCase().includes(q) &&
                !p.yomi.includes(q) &&
                !p.poemText.toLowerCase().includes(q) &&
                !p.outline.toLowerCase().includes(q)) return false;
        }
        return true;
    });

    if (state.sortMode === 'yomi') {
        list = [...list].sort((a, b) => a.yomi.localeCompare(b.yomi, 'ja'));
    } else if (state.sortMode === 'era') {
        list = [...list].sort((a, b) => a.eraNum - b.eraNum || a.number - b.number);
    } else {
        list = [...list].sort((a, b) => a.number - b.number);
    }

    const frag = document.createDocumentFragment();
    let currentSection = null;

    list.forEach(poet => {
        let sectionKey = null;
        if (state.sortMode === 'yomi') {
            sectionKey = romajiSection(poet.yomi);
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

    count.textContent = `${list.length} poet${list.length !== 1 ? 's' : ''}`;

    // Every card shows its own Chart of the Heart; no click needed.
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
    allThemeBtn.textContent = 'All';
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
    allEraBtn.textContent = 'All';
    eraContainer.appendChild(allEraBtn);

    Object.entries(ERA_LABELS).forEach(([num, label]) => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.dataset.filterEra = num;
        btn.textContent = label;
        eraContainer.appendChild(btn);
    });

    themeContainer.addEventListener('click', e => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        themeContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        state.filterTheme = btn.dataset.filterTheme || null;
        render();
    });

    eraContainer.addEventListener('click', e => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        eraContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        state.filterEra = btn.dataset.filterEra ? Number(btn.dataset.filterEra) : null;
        render();
    });

    // Job (Rank/Occupation) filters — data values stay Japanese for matching
    const JOB_KEYS = ['天皇', '皇族', '公卿', '貴族', '官人', '僧侶', '女房', '伝説', 'その他'];
    const jobContainer = document.getElementById('filter-job');

    const allJobBtn = document.createElement('button');
    allJobBtn.className = 'filter-btn is-active';
    allJobBtn.dataset.filterJob = '';
    allJobBtn.textContent = 'All';
    jobContainer.appendChild(allJobBtn);

    JOB_KEYS.forEach(key => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.dataset.filterJob = key;
        btn.textContent = JOB_LABELS_EN[key] || key;
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

    // Source (anthology) filters — data values stay Japanese for matching
    const SOURCE_KEYS = [
        '古今集', '後撰集', '拾遺集', '後拾遺集',
        '金葉集', '詞花集', '千載集', '新古今集',
        '新勅撰集', '続後撰集',
    ];

    let sourceContainer = document.getElementById('filter-source');
    if (!sourceContainer) {
        const jobSection = jobContainer.closest('.filter-section') || jobContainer.parentElement;
        const section = document.createElement('div');
        section.className = 'filter-section';
        section.innerHTML = '<div class="filter-label">Source</div>';
        sourceContainer = document.createElement('div');
        sourceContainer.id = 'filter-source';
        sourceContainer.className = 'filter-group';
        section.appendChild(sourceContainer);
        jobSection.parentElement.insertBefore(section, jobSection.nextSibling);
    }

    const allSourceBtn = document.createElement('button');
    allSourceBtn.className = 'filter-btn is-active';
    allSourceBtn.dataset.filterSource = '';
    allSourceBtn.textContent = 'All';
    sourceContainer.appendChild(allSourceBtn);

    SOURCE_KEYS.forEach(key => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.dataset.filterSource = key;
        btn.textContent = SOURCE_DISPLAY[key] || key;
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

// Back to top button: migrated to the site-wide js/back-to-top.js (just a <script> tag).

document.addEventListener('DOMContentLoaded', () => {
    buildFilters();
    bindSortButtons();
    bindSearch();
    render();
});
