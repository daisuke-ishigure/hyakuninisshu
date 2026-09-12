// ============================================================
// poems_en.js
// English-page equivalent of poems.js: theme/poet selector,
// reading-card / matching-card toggle, prev/next navigation,
// and Japanese + English (Porter) audio playback.
// Poem text/commentary itself stays hardcoded per NN_en.html page,
// matching how the Japanese NN.html pages already work.
// ============================================================

// Poet name (English) and theme by poem number.
// name is sourced from js/kokoro-chart-data-en.js's "poet" field;
// theme is sourced from js/zukan_en.js's POETS_RAW "theme" field.
const POET_DATA_EN = {
  1: { name: "Emperor Tenji", theme: "autumn" },
  2: { name: "Empress Jitō", theme: "summer" },
  3: { name: "Kakinomoto no Hitomaro", theme: "love" },
  4: { name: "Yamabe no Akahito", theme: "winter" },
  5: { name: "Sarumaru Dayū", theme: "autumn" },
  6: { name: "Middle Counselor Yakamochi", theme: "winter" },
  7: { name: "Abe no Nakamaro", theme: "travel" },
  8: { name: "Priest Kisen", theme: "misc" },
  9: { name: "Ono no Komachi", theme: "spring" },
  10: { name: "Semimaru", theme: "misc" },
  11: { name: "Councillor Takamura", theme: "travel" },
  12: { name: "High Priest Henjō", theme: "misc" },
  13: { name: "Retired Emperor Yōzei", theme: "love" },
  14: { name: "Minister of the Left of Kawara", theme: "love" },
  15: { name: "Emperor Kōkō", theme: "spring" },
  16: { name: "Middle Counselor Yukihira", theme: "farewell" },
  17: { name: "Ariwara no Narihira Ason", theme: "autumn" },
  18: { name: "Fujiwara no Toshiyuki Ason", theme: "love" },
  19: { name: "Ise", theme: "love" },
  20: { name: "Prince Motoyoshi", theme: "love" },
  21: { name: "Priest Sosei", theme: "love" },
  22: { name: "Fun'ya no Yasuhide", theme: "autumn" },
  23: { name: "Ōe no Chisato", theme: "autumn" },
  24: { name: "Kanke", theme: "travel" },
  25: { name: "Minister of the Right of Sanjō", theme: "love" },
  26: { name: "Teishin-kō", theme: "autumn" },
  27: { name: "Middle Counselor Kanesuke", theme: "love" },
  28: { name: "Minamoto no Muneyuki Ason", theme: "winter" },
  29: { name: "Ōshikōchi no Mitsune", theme: "autumn" },
  30: { name: "Mibu no Tadamine", theme: "love" },
  31: { name: "Sakanoue no Korenori", theme: "winter" },
  32: { name: "Harumichi no Tsuraki", theme: "autumn" },
  33: { name: "Ki no Tomonori", theme: "spring" },
  34: { name: "Fujiwara no Okikaze", theme: "misc" },
  35: { name: "Ki no Tsurayuki", theme: "spring" },
  36: { name: "Kiyohara no Fukayabu", theme: "summer" },
  37: { name: "Fun'ya no Asayasu", theme: "autumn" },
  38: { name: "Ukon", theme: "love" },
  39: { name: "Councillor Hitoshi", theme: "love" },
  40: { name: "Taira no Kanemori", theme: "love" },
  41: { name: "Mibu no Tadami", theme: "love" },
  42: { name: "Master of the Left Capital Michimasa", theme: "love" },
  43: { name: "Acting Middle Counselor Atsutada", theme: "love" },
  44: { name: "Middle Counselor Asatada", theme: "love" },
  45: { name: "Kentoku-kō", theme: "love" },
  46: { name: "Sone no Yoshitada", theme: "love" },
  47: { name: "Priest Egyō", theme: "autumn" },
  48: { name: "Minamoto no Shigeyuki", theme: "love" },
  49: { name: "Ōnakatomi no Yoshinobu Ason", theme: "love" },
  50: { name: "Fujiwara no Yoshitaka", theme: "love" },
  51: { name: "Fujiwara no Sanekata Ason", theme: "love" },
  52: { name: "Fujiwara no Michinobu Ason", theme: "love" },
  53: { name: "Mother of the Right Captain Michitsuna", theme: "love" },
  54: { name: "Mother of the Honorary Grand Minister", theme: "love" },
  55: { name: "Upper Counselor Kintō", theme: "misc" },
  56: { name: "Izumi Shikibu", theme: "love" },
  57: { name: "Murasaki Shikibu", theme: "misc" },
  58: { name: "Daini no Sanmi", theme: "love" },
  59: { name: "Akazome Emon", theme: "love" },
  60: { name: "Koshikibu no Naishi", theme: "misc" },
  61: { name: "Ise no Taifu", theme: "spring" },
  62: { name: "Sei Shōnagon", theme: "misc" },
  63: { name: "Master of the Left Capital Michimasa", theme: "love" },
  64: { name: "Acting Middle Counselor Sadayori", theme: "winter" },
  65: { name: "Sagami", theme: "love" },
  66: { name: "Senior High Priest Gyōson", theme: "misc" },
  67: { name: "Suō no Naishi", theme: "misc" },
  68: { name: "Retired Emperor Sanjō", theme: "misc" },
  69: { name: "Priest Nōin", theme: "autumn" },
  70: { name: "Priest Ryōzen", theme: "autumn" },
  71: { name: "Upper Counselor Tsunenobu", theme: "autumn" },
  72: { name: "Kii of Princess Yūshi's Household", theme: "love" },
  73: { name: "Acting Middle Counselor Masafusa", theme: "spring" },
  74: { name: "Minamoto no Toshiyori Ason", theme: "love" },
  75: { name: "Fujiwara no Mototoshi", theme: "misc" },
  76: { name: "Lay Novice of Hosshō-ji Temple, former Kampaku and Chancellor of the Realm", theme: "misc" },
  77: { name: "Retired Emperor Sutoku", theme: "love" },
  78: { name: "Minamoto no Kanemasa", theme: "winter" },
  79: { name: "Master of the Left Capital Akisuke", theme: "autumn" },
  80: { name: "Horikawa, attendant to Empress Taiken", theme: "love" },
  81: { name: "Later Tokudaiji Minister of the Left", theme: "summer" },
  82: { name: "Priest Dōin", theme: "love" },
  83: { name: "Master of the Empress Dowager's Household Toshinari", theme: "misc" },
  84: { name: "Fujiwara no Kiyosuke Ason", theme: "misc" },
  85: { name: "Priest Shun'e", theme: "love" },
  86: { name: "Priest Saigyō", theme: "love" },
  87: { name: "Priest Jakuren", theme: "autumn" },
  88: { name: "Attendant to Empress Kōka", theme: "love" },
  89: { name: "Princess Shikishi", theme: "love" },
  90: { name: "Attendant to Empress Inpu", theme: "love" },
  91: { name: "Gokyōgoku Regent and former Chancellor of the Realm", theme: "autumn" },
  92: { name: "Sanuki, attendant to retired Emperor Nijō", theme: "love" },
  93: { name: "Minister of the Right of Kamakura", theme: "travel" },
  94: { name: "Councillor Masatsune", theme: "autumn" },
  95: { name: "Former Senior High Priest Jien", theme: "misc" },
  96: { name: "Lay Novice and former Chancellor of the Realm", theme: "misc" },
  97: { name: "Acting Middle Counselor Sadaie", theme: "love" },
  98: { name: "Junior Second Rank Ietaka", theme: "summer" },
  99: { name: "Retired Emperor Go-Toba", theme: "misc" },
  100: { name: "Retired Emperor Juntoku", theme: "misc" },
};

const baseURL = window.location.origin + "/";
let selectedTheme = "all";

// ----------------------------------------------
// Theme / poet selectors
// ----------------------------------------------
$("#themeSelector").on("change", function () {
  selectedTheme = $(this).val();
  updateJsonSelectorOptions();
});

function getThemePoems() {
  const list = [];
  for (let num = 1; num <= 100; num++) {
    if (selectedTheme === "all" || selectedTheme === "" || POET_DATA_EN[num].theme === selectedTheme) {
      list.push(num);
    }
  }
  return list;
}

function updateJsonSelectorOptions() {
  const list = getThemePoems();
  $("#jsonSelector").html('<option value="">Choose a poet</option>');
  list.forEach(function (num) {
    $("#jsonSelector").append(`<option value="${num}">No. ${num} · ${POET_DATA_EN[num].name}</option>`);
  });
}

$(document).ready(function () {
  updateJsonSelectorOptions();
});

function redirectToPoemPage() {
  const selectedNumber = $("#jsonSelector").val();
  if (selectedNumber) {
    window.location.href = baseURL + selectedNumber + "_en.html";
  }
}
$("#jsonSelector").on("change", redirectToPoemPage);

function getPoemNumberFromUrl() {
  const match = window.location.href.match(/\/(\d+)_en\.html/);
  return match ? parseInt(match[1]) : null;
}

$(document).ready(function () {
  const selectedNumber = getPoemNumberFromUrl();
  if (selectedNumber) {
    $("#jsonSelector").val(selectedNumber);
  }
});

// ----------------------------------------------
// Reading card / matching card toggle
// ----------------------------------------------
function saveToggleState() {
  const toggle2 = document.getElementById("toggle2");
  if (!toggle2) return;
  localStorage.setItem("toggleStateEn", toggle2.checked);
}

function applyToggleState() {
  const toggle2 = document.getElementById("toggle2");
  if (!toggle2) return;
  const toggleState = localStorage.getItem("toggleStateEn") === "true";
  const cardItems = document.querySelectorAll(".card-item");
  toggle2.checked = toggleState;
  cardItems.forEach(function (item) {
    item.classList.toggle("active", toggleState);
  });
}

window.addEventListener("beforeunload", saveToggleState);
window.addEventListener("load", function () {
  applyToggleState();
  const toggle2 = document.getElementById("toggle2");
  if (!toggle2) return;
  const cardItems = document.querySelectorAll(".card-item");
  toggle2.addEventListener("change", function (event) {
    const isChecked = event.target.checked;
    cardItems.forEach(function (item) {
      if (item.classList.contains("active")) {
        setTimeout(() => { item.classList.remove("active"); }, 10);
      } else {
        item.classList.add("active");
      }
    });
  });
});

// ----------------------------------------------
// Next / previous
// Always steps to the adjacent poem number (1-100, wrapping around),
// regardless of any theme filter applied to the selectors above.
// ----------------------------------------------
$(function () {
  $("#next, #next2.bottom").on("click", function () {
    const num = getPoemNumberFromUrl();
    if (!num) return;
    const nextNum = (num % 100) + 1;
    window.location.href = baseURL + nextNum + "_en.html";
  });

  $("#back, #back2.bottom").on("click", function () {
    const num = getPoemNumberFromUrl();
    if (!num) return;
    const prevNum = ((num - 2 + 100) % 100) + 1;
    window.location.href = baseURL + prevNum + "_en.html";
  });
});

// ----------------------------------------------
// Audio playback (Japanese reading + Porter English translation)
// ----------------------------------------------
let sound, pausedTime = 0;
$("#play-pause-btn").click(function () {
  const num = getPoemNumberFromUrl();
  const audioSrc = `../sound/${num}.mp3`;

  if (!sound || sound._src !== audioSrc) {
    if (sound) { sound.off(); sound.stop(); }
    sound = new Howl({
      src: [audioSrc],
      onend: function () {
        $("#play-pause-btn").removeClass("current");
        pausedTime = 0;
      },
    });
  }

  if (!sound.playing()) {
    sound.seek(pausedTime);
    sound.play();
    $("#play-pause-btn").addClass("current");
  } else {
    pausedTime = sound.seek();
    sound.pause();
    $("#play-pause-btn").removeClass("current");
  }
});

let sound2, pausedTime2 = 0;
$("#play-pause-btn-en").click(function () {
  const num = getPoemNumberFromUrl();
  const audioSrc = `../sound/porter_${num}.mp3`;

  if (!sound2 || sound2._src !== audioSrc) {
    if (sound2) { sound2.off(); sound2.stop(); }
    sound2 = new Howl({
      src: [audioSrc],
      onend: function () {
        $("#play-pause-btn-en").removeClass("current");
        pausedTime2 = 0;
      },
    });
  }

  if (!sound2.playing()) {
    sound2.seek(pausedTime2);
    sound2.play();
    $("#play-pause-btn-en").addClass("current");
  } else {
    pausedTime2 = sound2.seek();
    sound2.pause();
    $("#play-pause-btn-en").removeClass("current");
  }
});

// ============================================================
// 掛詞・縁語・序詞・枕詞・本歌取り・歌枕マーク（.mark）— JA版 poems.js の
// .mark 機能の英語版。アイコン画像は技法名の漢字がSVGパスとして描き込まれて
// おり英語化できないため、テキストバッジ（.mark-badge）に置き換える。
// ============================================================

const TECH_DEFS_EN = {
  kakekotoba: {
    title: "Kakekotoba",
    def: "A kakekotoba is a technique that layers homophonous words — one drawn from the surrounding scenery, one from the poet's feelings — expanding the poem's world through the associations the wordplay evokes.",
  },
  engo: {
    title: "Engo",
    def: "Engo is a technique of using words that are closely related in meaning, deepening the poem's flavor through the associations these connections evoke.",
  },
  jokotoba: {
    title: "Jokotoba",
    def: "A jokotoba is a phrase placed before the word a poet truly wants to express, in order to lead into it. Each poet crafts their own jokotoba, which run seven syllables or more. There are three kinds: those built on metaphor, those that pivot into a kakekotoba, and those that repeat a sound.",
  },
  makurakotoba: {
    title: "Makurakotoba",
    def: "A makurakotoba is a five-syllable word used to lead into a specific following word, placed just before the word it introduces — smoothing the rhythm of a poem or lending it a certain mood.",
  },
  honkadori: {
    title: "Honkadori",
    def: "Honkadori is a technique of borrowing part of an older poem, drawing that poem's feeling and artistry into a new one. The honka (source poem) is as follows.",
  },
  utamakura: {
    title: "Utamakura",
    def: "An utamakura is a scenic place that appears in waka poetry.",
  },
};

const NONE_TEXT_EN = {
  kakekotoba: "This poem has no kakekotoba.",
  engo: "This poem has no engo.",
  jokotoba: "This poem has no jokotoba.",
  makurakotoba: "This poem has no makurakotoba.",
  honkadori: "This poem is not a honkadori (allusive variation).",
  utamakura: "This poem has no utamakura.",
};

// 各歌の技法データ（poems.js の *Link を英訳して移植。キーが無い技法は「なし」扱い。
// utamakuraは utamakura_en.html への lat/lng/zoom クエリ文字列）
const MARK_DATA_EN = {
  1: { kakekotoba: "\"Kariho\" is a kakekotoba combining \"kari-io\" (a makeshift hut) and \"kariho\" (harvested ears of rice)." },
  2: { makurakotoba: "\"Shirotae no\" is a makurakotoba for anything white. In this poem it leads into \"koromo\" (robe).", utamakura: "lat=34.49569&lng=135.81847&zoom=15" },
  3: { jokotoba: "\"Ashihiki no yamadori no o no shidario no\" is the jokotoba. It leads into \"naganagashi\" (long) through a metaphor.", makurakotoba: "\"Ashihiki no\" leads into \"yama\" (mountain) or words containing it. In this poem it leads into \"yamadori\" (a mountain pheasant)." },
  4: { makurakotoba: "\"Shirotae no\" is a makurakotoba for anything white. In this poem it leads into \"Fuji.\"", utamakura: "lat=35.13569&lng=138.69272&zoom=15" },
  7: { utamakura: "lat=34.68176593790116&lng=135.84848262599226&zoom=15" },
  8: { kakekotoba: "\"Ushiyama\" is a kakekotoba combining \"Ujiyama\" (Mount Uji) and \"ushi yama\" (a mountain of sorrow). Some also read \"shika\" as a kakekotoba of \"shika\" (thus) and \"shika\" (deer).", utamakura: "lat=34.89672&lng=135.84769&zoom=15" },
  9: { kakekotoba: "\"Furu\" is a kakekotoba of \"furu\" (to fall) and \"furu\" (to pass, of time). \"Nagame\" is a kakekotoba of \"nagame\" (gazing) and \"nagame\" (long rains).", engo: "\"Furu\" and \"nagame\" (long rain) are engo." },
  10: { kakekotoba: "\"Ōsaka\" is a kakekotoba with \"au\" (to meet).", utamakura: "lat=34.99422&lng=135.85559&zoom=15" },
  13: { kakekotoba: "According to the book <em>Ogura Hyakushu Hyōshaku: An English-German Bilingual Edition</em>, \"kohi\" is explained as \"an old word for water, or else carries the meaning of love (戀).\" In other words, \"kohi\" is thought to be a kakekotoba of \"water\" and \"love.\"<br><small>(Source: Shigeharu (Shihō) Satō, <em>Ogura Hyakushu Hyōshaku: An English-German Bilingual Edition</em>, Hongō Shoin, Dec. 1904.<br>National Diet Library Digital Collections: https://dl.ndl.go.jp/pid/872971)</small>", jokotoba: "\"Tsukubane no mine yori otsuru minano-gawa\" is the jokotoba.<br>It leads into \"kohi.\"", utamakura: "lat=36.22537&lng=140.10749&zoom=20" },
  14: { jokotoba: "\"Michinoku no shinobu-mojizuri\" is the jokotoba.<br>It leads into \"midare\" (tangled) through a metaphor.", utamakura: "lat=37.77101&lng=140.51424&zoom=20" },
  16: { kakekotoba: "\"Inaba\" is a kakekotoba of \"Inaba\" (the place) and \"inaba\" (if [I] go). \"Matsu\" is a kakekotoba of \"matsu\" (pine) and \"matsu\" (to wait).", utamakura: "lat=35.475068831090105&lng=134.26616273373548&zoom=15" },
  17: { makurakotoba: "\"Chihayaburu\" is a makurakotoba leading into \"kami\" (a god) or \"Uji.\"", utamakura: "lat=34.60569500944204&lng=135.71797796638276&zoom=15" },
  18: { jokotoba: "\"Suminoe no kishi ni yoru nami\" is the jokotoba.<br>It leads into the \"yoru\" in \"yoru sae ya,\" repeating the same sound.", utamakura: "lat=34.61239&lng=135.49376&zoom=15" },
  19: { kakekotoba: "\"Fushi no ma\" is a kakekotoba of \"fushi no ma\" (the space between joints) and \"a brief moment.\"", engo: "\"Ashi\" (reed) and \"fushi\" (joint) are engo.", jokotoba: "\"Naniwagata mijikaki ashi no\" is the jokotoba.<br>It leads into \"fushi\" through a metaphor.", utamakura: "lat=34.73260027715697&lng=135.5289405219532&zoom=15" },
  20: { kakekotoba: "\"Mi o tsukushi\" is a kakekotoba of \"mi o tsukushi\" (giving everything of oneself) and \"miotsukushi\" (channel markers)." },
  22: { kakekotoba: "\"Arashi\" is a kakekotoba of \"arashi\" (storm) and \"arashi\" (lays waste)." },
  24: { kakekotoba: "\"Tabi\" is a kakekotoba of \"tabi\" (this time) and \"tabi\" (journey)." },
  25: { kakekotoba: "\"Ōsaka\" is a kakekotoba with \"au\" (to meet).<br>\"Sanekazura\" is a kakekotoba with \"sane\" (to sleep together).<br>\"Kuru\" is a kakekotoba of \"kuru\" (to come) and \"kuru\" (to reel in).", engo: "\"Sa-ne\" (sleeping together) and \"au\" (to meet) are engo.<br>\"Sanekazura\" and \"kuru\" (to reel in) are engo." },
  26: { honkadori: "<p>吉野山 岸の紅葉し 心あらば<br>まれのみゆきを 色かへて待て</p><div style=\"display:flex;justify-content:flex-end;\"><small>Kokin Rokujō, Fujiwara no Tadafusa</small></div>", utamakura: "lat=35.02361224973831&lng=135.65914892027368&zoom=15" },
  27: { kakekotoba: "\"Waki\" is a kakekotoba of \"waki\" (welling up) and \"waki\" (dividing).", engo: "\"Waki\" (welling up) and \"izumi\" (spring) are engo.", jokotoba: "\"Mika no hara wakite nagaruru izumi-gawa\" is the jokotoba. It leads into \"itsu mi,\" repeating the same sound.", utamakura: "lat=34.75938&lng=135.87191&zoom=15" },
  28: { kakekotoba: "\"Kare\" is a kakekotoba of \"kare\" (withered) and \"kare\" (drifted away).", honkadori: "<p>秋くれば 虫とともにぞ なかれぬる<br>人も草葉も 秋くれば</p><div style=\"display:flex;justify-content:flex-end;\"><small>Fujiwara no Okikaze</small></div>" },
  33: { makurakotoba: "\"Hisakata no\" leads into words connected to the heavens. In this poem it leads into \"hikari\" (light)." },
  34: { utamakura: "lat=34.74386&lng=134.80309&zoom=20" },
  39: { jokotoba: "\"Asajiu no ono no shinohara\" is the jokotoba.<br>It leads into \"shino,\" repeating the same sound.", honkadori: "<p>浅茅生の 小野の篠原 しのぶとも<br>人知るらめや いふ人なしに</p><div style=\"display:flex;justify-content:flex-end;\"><small>Kokinshū, Anonymous</small></div>" },
  42: { honkadori: "<p>君をおきて あだし心を わがもたば<br>すゑの松山 浪もこえなむ</p><div style=\"display:flex;justify-content:flex-end;\"><small>Kokinshū, Anonymous</small></div>", utamakura: "lat=38.287958179367735&lng=141.00347951203332&zoom=15" },
  46: { jokotoba: "\"Yura no to o wataru funabito kaji o tae\" is the jokotoba. It leads into \"yukue mo shiranu\" (whose way is unknown) through a metaphor.", utamakura: "lat=35.52408&lng=135.27212&zoom=15" },
  48: { jokotoba: "\"Kaze o itami iwa utsu nami no\" is the jokotoba.<br>It leads into \"onore nomi kudakete\" (breaking apart, alone) through a metaphor." },
  49: { jokotoba: "\"Mikakimori eji no taku hi no\" is the jokotoba.<br>It leads into \"yoru wa moe hiru wa kietsutsu\" (burning by night, fading by day) through a metaphor." },
  51: { kakekotoba: "\"Ibuki\" is a kakekotoba of \"Ibuki\" (the place) and \"iu\" (to say). \"Omoi\" is a kakekotoba of \"omoi\" (feeling) and \"hi\" (fire).", engo: "\"Sashimo-gusa\" (the herb), \"moyuru\" (burning), and \"hi\" (fire) are engo.", jokotoba: "\"Kaku to dani eyawa Ibuki no sashimo-gusa\" is the jokotoba. It leads into \"sashimo,\" repeating the same sound.", utamakura: "lat=36.413495521006666&lng=139.7134336618209&zoom=20" },
  55: { engo: "\"Taki\" (waterfall) and \"nagare\" (flow) are engo." },
  57: { engo: "\"Meguri\" (circling back) and \"tsuki\" (moon) are engo.<br>Since the moon waxes and wanes, it is considered deeply connected to the idea of \"meguru\" (to circle, to come around)." },
  58: { kakekotoba: "\"Soyo\" is a kakekotoba of \"soyo,\" the sound of rustling leaves, and \"soyo\" (that's right).", jokotoba: "\"Arima-yama Ina no sasahara kaze fukeba\" is the jokotoba that draws out \"soyo.\"", utamakura: "lat=34.78891&lng=135.25716&zoom=13" },
  60: { kakekotoba: "\"Ikuno\" is a kakekotoba of \"Ikuno\" (the place name) and \"iku\" (to go). \"Fumi\" is a kakekotoba of \"fumi\" (a letter) and \"fumi\" (setting foot, as on a bridge's planks).", engo: "\"Fumi\" (setting foot) and \"hashi\" (bridge) are engo.", utamakura: "lat=35.5698&lng=135.19182&zoom=15" },
  62: { kakekotoba: "\"Ōsaka\" is a kakekotoba with \"au\" (to meet).", utamakura: "lat=34.65030881058312&lng=110.93147894044522&zoom=12" },
  64: { utamakura: "lat=34.88887&lng=135.80898&zoom=15" },
  67: { kakekotoba: "\"Kaina\" is a kakekotoba of \"kainaku\" (in vain) and \"kaina\" (arm)." },
  69: { utamakura: "lat=34.60038373185413&lng=135.7151239556404&zoom=15" },
  72: { kakekotoba: "\"Takashi\" is a kakekotoba with \"takashi\" (well-known).", engo: "\"Hama\" (beach), \"nami\" (waves), and \"nure\" (getting wet) are engo.", utamakura: "lat=34.52765&lng=135.43255&zoom=15" },
  74: { utamakura: "lat=34.52658&lng=135.90872&zoom=15" },
  75: { engo: "\"Oki\" (settling, of dew) and \"tsuyu\" (dew) are engo." },
  76: { makurakotoba: "\"Hisakata no\" leads into words connected to the heavens. In this poem it leads into \"kumoi\" (the clouds)." },
  77: { kakekotoba: "\"Ware\" is a kakekotoba of \"wakare\" (split apart) and \"wakare\" (parting). \"Awa\" is a kakekotoba of \"au\" (to come together) and \"au\" (to meet).", jokotoba: "\"Se o hayami iwa ni sekaruru takigawa no\" is the jokotoba. It leads into \"warete mo sue ni awamu\" (though split apart, we will meet again) through a metaphor." },
  78: { utamakura: "lat=34.32571&lng=134.81311&zoom=10" },
  80: { engo: "\"Nagashi\" (long) and \"kurokami\" (black hair) are engo." },
  88: { kakekotoba: "\"Karine\" is a kakekotoba of \"karine\" (a brief sleep) and \"karine\" (cut-off reed stubble). \"Hitoyo\" is a kakekotoba of \"hitoyo\" (a single stalk-joint) and \"hitoyo\" (a single night). \"Mi o tsukushi\" is a kakekotoba of \"mi o tsukushi\" (giving everything of oneself) and \"miotsukushi\" (channel markers).", engo: "\"Naniwae\" (the Naniwa inlet), \"ashi\" (reed), \"karine\" (cut stubble), \"hitoyo\" (a single joint), and \"miotsukushi\" (channel markers) are engo.", jokotoba: "\"Naniwae no ashi no\" is the jokotoba. It leads into \"karine\" through a metaphor.", utamakura: "lat=34.73260027715697&lng=135.5289405219532&zoom=15" },
  89: { engo: "\"Tama no o\" (a jeweled thread), \"tae\" (breaking), \"nagarahe\" (going on living), and \"yowari\" (growing weak) are engo connected through the thread of life." },
  90: { honkadori: "<p>松島や 雄島の磯に あさりせし<br>あまの袖こそ かくはぬれしか</p><div style=\"display:flex;justify-content:flex-end;\"><small>Goshūi Wakashū, Minamoto no Shigeyuki</small></div>", utamakura: "lat=38.36534&lng=141.06252&zoom=20" },
  91: { kakekotoba: "\"Samushiro\" is a kakekotoba combining \"sa-mushiro\" (a narrow mat) and \"samushi\" (cold).", honkadori: "<p>さむしろに 衣かたしき 今宵もや<br>われを待つらむ 宇治の橋姫</p><div style=\"display:flex;justify-content:flex-end;\"><small>Kokinshū, Anonymous</small></div><p>あしびきの 山鳥の尾の しだり尾の<br>ながながし夜を ひとりかも寝む</p><div style=\"display:flex;justify-content:flex-end;\"><small>Shūi Wakashū, Kakinomoto no Hitomaro</small></div>" },
  92: { jokotoba: "\"Shiohi ni mienu oki no ishi no\" is the jokotoba.<br>It leads into \"hito koso shirane kawaku ma mo nashi\" (though no one knows, there is never a moment it is dry) through a metaphor.", honkadori: "<p>わが袖は 水の下なる 石なれや<br>人に知られで かわくまもなし</p><div style=\"display:flex;justify-content:flex-end;\"><small>Izumi Shikibu Shū, Izumi Shikibu</small></div>", utamakura: "lat=38.28683&lng=141.00333&zoom=20" },
  93: { honkadori: "<p>河の上の ゆつ岩群に 草生さず<br>常にもがもな 常処女にて</p><div style=\"display:flex;justify-content:flex-end;\"><small>Man'yōshū, Fukae no Toji</small></div><p>陸奥は いづくはあれど 塩釜の<br>浦こぐ舟の 綱手かなしも</p><div style=\"display:flex;justify-content:flex-end;\"><small>Kokinshū, Anonymous</small></div>" },
  94: { honkadori: "<p>みよしのの 山の白雪 つもるらし<br>ふるさと寒く なりまさるなり</p><div style=\"display:flex;justify-content:flex-end;\"><small>Kokin Wakashū, Sakanoue no Korenori</small></div>" },
  95: { kakekotoba: "\"Sumizome\" is a kakekotoba combining \"sumizome\" (ink-dyed robes) and \"sumizome\" (just settled in).", engo: "\"Ōfu\" (to cover) and \"sode\" (sleeve) are engo.", honkadori: "<p>阿耨多羅 三藐三菩提の 仏達<br>わが立つ杣に 冥加あらせたまえ</p><div style=\"display:flex;justify-content:flex-end;\"><small>Great Master Dengyō (Saichō)</small></div>" },
  96: { kakekotoba: "\"Furiyuku\" is a kakekotoba of \"furiyuku\" (falling) and \"furiyuku\" (growing old).", engo: "\"Hana\" (blossoms), \"yuki\" (snow), and \"furi\" (falling) are engo.", honkadori: "<p>花の色は うつりにけりな いたづらに<br>わが身よにふる ながめせしまに</p><div style=\"display:flex;justify-content:flex-end;\"><small>Kokinshū, Ono no Komachi</small></div>" },
  97: { kakekotoba: "\"Matsu\" is a kakekotoba of \"matsu\" (pine) and \"matsu\" (to wait).", engo: "\"Yaku\" (to burn), \"moshio\" (seaweed salt), and \"kogare\" (burning with longing) are engo connected through salt-making.", jokotoba: "\"Matsuho no ura no yūnagi ni yaku ya moshio no\" is the jokotoba. It leads into \"kogare\" through a metaphor.", honkadori: "<p>名寸隅の 船瀬見ゆる 淡路島 松帆の浦に 朝なぎに 玉藻刈りつつ 夕なぎに 藻塩焼きつつ 海人娘子 ありとは聞けど 見に行かむ よしのなければ ますらをの 心はなしに たをやめの 思ひたわみて たもとほり あれはそ恋ふる ふね梶をなみ</p><div style=\"display:flex;justify-content:flex-end;\"><small>Man'yōshū, Kasa no Kanamura</small></div>", utamakura: "lat=34.60925&lng=135.00183&zoom=14" },
  98: { kakekotoba: "\"Nara no Ogawa\" is a kakekotoba with \"nara\" (oak).", honkadori: "<p>夏山の 楢の葉そよぐ 夕暮れは<br>ことしも秋の ここちこそすれ</p><div style=\"display:flex;justify-content:flex-end;\"><small>Goshūi Wakashū, Minamoto no Yoritsuna</small></div><p>みそぎする ならの小川の 川風に<br>祈りぞわたる 下に絶えじと</p><div style=\"display:flex;justify-content:flex-end;\"><small>Kokin Waka Rokujō, Princess Yashiro</small></div>", utamakura: "lat=35.05966&lng=135.75297&zoom=17" },
  100: { kakekotoba: "\"Shinobu\" is a kakekotoba of \"shinobu\" (to long for) and \"shinobu-gusa\" (the felt fern)." },
};

$(document).ready(function () {
  const num = getPoemNumberFromUrl();
  if (!num) return;
  const marks = MARK_DATA_EN[num] || {};

  $(".explanation").prepend("<div class='mark'></div>");
  const $mark = $(".explanation .mark");

  ["makurakotoba", "kakekotoba", "engo", "jokotoba", "honkadori"].forEach(function (tech) {
    const has = !!marks[tech];
    const def = TECH_DEFS_EN[tech];
    $mark.append(
      `<span id='${tech}' class='mark-badge${has ? " has-badge" : " none-badge"}'>${def.title}</span>`
    );
    const body = has ? marks[tech] : `<p>${NONE_TEXT_EN[tech]}</p>`;
    $(".explanation").append(
      `<div class='${tech}'><dt>${def.title}</dt><dd>${def.def}</dd><hr>${has ? "<p>" + body + "</p>" : body}</div>`
    );
  });

  // 歌枕：ありなら地図ページへのリンク、なしならクリックでポップアップ表示するバッジ
  if (marks.utamakura) {
    $mark.append(
      `<a id='utamakura' href='utamakura_en.html?${marks.utamakura}' class='mark-badge has-badge'>${TECH_DEFS_EN.utamakura.title}</a>`
    );
  } else {
    $mark.append(`<span id='utamakura' class='mark-badge none-badge'>${TECH_DEFS_EN.utamakura.title}</span>`);
    $(".explanation").append(
      `<div class='utamakura'><dt>${TECH_DEFS_EN.utamakura.title}</dt><dd>${TECH_DEFS_EN.utamakura.def}</dd><hr><p>${NONE_TEXT_EN.utamakura}</p></div>`
    );
  }
});

// マークの動作（JA版 poems.js と同じクラス/挙動をそのまま利用）
$(document).on("click", "#kakekotoba", function (event) {
  event.stopPropagation();
  $(".kakekotoba").toggleClass("active");
  $(".engo, .jokotoba, .makurakotoba, .honkadori, .utamakura").removeClass("active");
});
$(document).on("click", "#engo", function (event) {
  event.stopPropagation();
  $(".engo").toggleClass("active");
  $(".kakekotoba, .jokotoba, .makurakotoba, .honkadori, .utamakura").removeClass("active");
});
$(document).on("click", "#jokotoba", function (event) {
  event.stopPropagation();
  $(".jokotoba").toggleClass("active");
  $(".kakekotoba, .engo, .makurakotoba, .honkadori, .utamakura").removeClass("active");
});
$(document).on("click", "#makurakotoba", function (event) {
  event.stopPropagation();
  $(".makurakotoba").toggleClass("active");
  $(".kakekotoba, .engo, .jokotoba, .honkadori, .utamakura").removeClass("active");
});
$(document).on("click", "#honkadori", function (event) {
  event.stopPropagation();
  $(".honkadori").toggleClass("active");
  $(".kakekotoba, .engo, .jokotoba, .makurakotoba, .utamakura").removeClass("active");
});
$(document).on("click", "#utamakura", function (event) {
  event.stopPropagation();
  $(".utamakura").toggleClass("active");
  $(".kakekotoba, .engo, .jokotoba, .makurakotoba, .honkadori").removeClass("active");
});
$(document).on("click", function () {
  $(".kakekotoba, .engo, .jokotoba, .makurakotoba, .honkadori, .utamakura").removeClass("active");
});

// ============================================================
// .explanation 内の歌の下にローマ字表記を追加
// list_en.js の hiraganaToRomaji をそのまま流用し、hyakunin.json の
// yomihuda（かな読み）から生成する。
// ============================================================

function hiraganaToRomajiForPoem(str) {
  if (!str) return "";
  const map = {
    'あ':'a','い':'i','う':'u','え':'e','お':'o',
    'か':'ka','き':'ki','く':'ku','け':'ke','こ':'ko',
    'さ':'sa','し':'shi','す':'su','せ':'se','そ':'so',
    'た':'ta','ち':'chi','つ':'tsu','て':'te','と':'to',
    'な':'na','に':'ni','ぬ':'nu','ね':'ne','の':'no',
    'は':'ha','ひ':'hi','ふ':'fu','へ':'he','ほ':'ho',
    'ま':'ma','み':'mi','む':'mu','め':'me','も':'mo',
    'や':'ya','ゆ':'yu','よ':'yo',
    'ら':'ra','り':'ri','る':'ru','れ':'re','ろ':'ro',
    'わ':'wa','ゐ':'i','ゑ':'e','を':'o','ん':'n',
    'が':'ga','ぎ':'gi','ぐ':'gu','げ':'ge','ご':'go',
    'ざ':'za','じ':'ji','ず':'zu','ぜ':'ze','ぞ':'zo',
    'だ':'da','ぢ':'ji','づ':'zu','で':'de','ど':'do',
    'ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo',
    'ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po',
    'きゃ':'kya','きゅ':'kyu','きょ':'kyo',
    'しゃ':'sha','しゅ':'shu','しょ':'sho',
    'ちゃ':'cha','ちゅ':'chu','ちょ':'cho',
    'にゃ':'nya','にゅ':'nyu','にょ':'nyo',
    'ひゃ':'hya','ひゅ':'hyu','ひょ':'hyo',
    'みゃ':'mya','みゅ':'myu','みょ':'myo',
    'りゃ':'rya','りゅ':'ryu','りょ':'ryo',
    'ぎゃ':'gya','ぎゅ':'gyu','ぎょ':'gyo',
    'じゃ':'ja','じゅ':'ju','じょ':'jo',
    'びゃ':'bya','びゅ':'byu','びょ':'byo',
    'ぴゃ':'pya','ぴゅ':'pyu','ぴょ':'pyo',
    'っ':'',
  };
  let result = '';
  let i = 0;
  while (i < str.length) {
    const two = str.slice(i, i + 2);
    if (map[two]) { result += map[two]; i += 2; continue; }
    const one = str[i];
    if (one === 'っ') {
      const next = str.slice(i + 1, i + 3);
      const nextR = map[next] || map[str[i + 1]] || '';
      result += nextR[0] || '';
    } else {
      result += map[one] || one;
    }
    i++;
  }
  return result;
}

function yomihudaToRomajiPartsForPoem(yomihuda) {
  if (!yomihuda) return { first: '', second: '' };
  const lines = yomihuda.replace(/<br\s*\/?>/g, "\n").replace(/<[^>]+>/g, "").split("\n");
  return {
    first: lines.slice(0, 3).map(hiraganaToRomajiForPoem).join(' '),
    second: lines.slice(3).map(hiraganaToRomajiForPoem).join(' '),
  };
}

fetch("../js/hyakunin.json?04")
  .then((r) => r.json())
  .then((data) => {
    const num = getPoemNumberFromUrl();
    if (!num) return;
    const p = data[String(num)];
    if (!p || !p.yomihuda) return;
    const romaji = yomihudaToRomajiPartsForPoem(p.yomihuda);
    const line = [romaji.first, romaji.second].filter(Boolean).join("<br>");
    if (!line) return;
    const $small = $("#utabangou").next("dd").find("span.small").first();
    if ($small.length) {
      $small.before(`<span class="romaji-line">${line}</span><br>`);
    }
  })
  .catch(() => {});
