---
description: 指定した範囲の英語版 gokunarabe ページ（gokunarabe_NN_en.html）を新規作成する。引数に作成したい番号範囲を渡す（例: /gokunarabe-en 51-60）。
---

# gokunarabe 英語版ページ一括作成スキル

## 概要

引数で指定された番号範囲の `gokunarabe_NN_en.html` を作成する。  
テンプレートは `gokunarabe_27_en.html`（最新フォーマット）を参照すること。  
詳細な仕様は `_gokunarabe_en_guide.md` を参照。

---

## 手順

### Step 1 — 対象番号の確認

引数から作成する番号範囲を確認する（例: `51-75` → 51〜75番）。  
対象が多い場合（10以上）は **8〜10番ずつ** に分割してエージェントを並列起動する。

### Step 2 — 日本語版からデータ収集

対象番号の日本語版 `gokunarabe_NN.html` を読み込み、KAKE_CONFIG セクション（offset: 120, limit: 60）から以下を取得する：

- `waka` 配列（`text` と `html` の両フィールド、rubyタグ含む）
- `bubblePosThank` の top/left
- `bubblePosThank3` の top/left
- `nekoTail` と `bubbleTail`

英語歌人名は `js/poet-index.js` の `POETS` 配列（[番号, 日本語名, 英語名]）から取得する。

### Step 3 — 英語コンテンツを準備

各ページに必要な英語コンテンツ：

| 項目 | 内容 |
|------|------|
| `bubbleText` | 英語の短い名言。**`\n` を2個**入れて3行に（→ `bubblePosThank3` が使われる） |
| Meaning | 和歌の英訳（1〜2文） |
| Commentary P1 | 解説段落1（情景・言葉の意味・掛詞など） |
| Commentary P2 | 解説段落2（歌人の背景・歴史的文脈） |
| completeBody | `'A word from [英語歌人名] 🎤'` |

### Step 4 — エージェントを並列起動して作成

各エージェントに以下を渡す：

```
作業ディレクトリ: c:\Users\USER\Documents\百人一首_20260125\

【テンプレート】
gokunarabe_27_en.html を最初に読み込み、構造を完全に踏襲すること。

【各ファイルの固定ルール】
- <html lang="en">
- breadcrumb: kajin-zukan_en.html → "Hyakunin Isshu Poet Encyclopedia"
- pageSuffix: '_en'
- bubbleHorizontal: true（bubbleText の直前に配置）
- debug: true（★デフォルトは true。吹き出し位置調整後に false に変更する）
- bubblePos: { top: '22%', left: '20%', transform: 'translateX(-50%)' }（固定プレースホルダー）
- bubblePosThank / bubblePosThank3 にも transform: 'translateX(-50%)' を追加
- bubbleTail: 'top-left'（★デフォルト。日本語版が 'left'/'right' でも英語版は 'top-left' を使う）
- initBody: テンプレートから完全コピー（curly apostrophe ' を保持）
- .site-title: 英語ページでも **日本語のまま** `時雨の百人一首` を使う（`Shigure no Hyakunin Isshu` に変えない）
  - `<title>` タグ末尾と `.footer-copy` は `Shigure no Hyakunin Isshu` でよい（site-title のみ日本語）
- figureSrc: img/NN.svg（ゼロ埋めなし）
- z-img: img/zNN.webp（2桁ゼロ埋め）
- detail-btn: NN_en.html（ゼロ埋めなし）
- lang-wrapper: gokunarabe_NN.html ↔ gokunarabe_NN_en.html
- footer: &copy;2023 Shigure no Hyakunin Isshu
- scripts: gsap → gokunarabe.js → tippy.js → poet-index.js → wordcloud.js
```

### Step 5 — 完了後の確認・一括修正

作成完了後に **以下の PowerShell を必ず実行**し、3つの既知問題を一括修正する。

```powershell
$enc = [System.Text.Encoding]::UTF8
$dir = "c:\Users\USER\Documents\百人一首_20260125"

# ★ 修正対象の番号範囲を指定（例: 51..75）
$range = 51..75

$range | ForEach-Object {
    $n = "{0:D2}" -f $_
    $file = "$dir\gokunarabe_${n}_en.html"
    if (-not (Test-Path $file)) { return }
    $c = [System.IO.File]::ReadAllText($file, $enc)
    $orig = $c

    # 1) debug: false → debug: true
    $c = $c -replace "debug: false", "debug: true"

    # 2) bubbleTail: 'left'/'right'/'top' → 'top-left'
    #    （日本語版から引き継いだ値を英語版デフォルトに統一）
    $c = $c -replace "bubbleTail: 'left'",  "bubbleTail: 'top-left'"
    $c = $c -replace "bubbleTail: 'right'", "bubbleTail: 'top-left'"
    $c = $c -replace "bubbleTail: 'top'",   "bubbleTail: 'top-left'"

    # 3) .site-title: "Shigure no Hyakunin Isshu" → 日本語 "時雨の百人一首"
    #    （<title> タグや footer-copy は英語のままでよい。site-title のみ日本語）
    $c = $c -replace '(<a href="https://hyakuninisshu\.sakura\.ne\.jp/">)Shigure no Hyakunin Isshu(</a>)', '${1}時雨の百人一首${2}'

    # 4) initBody の straight apostrophe (U+0027) → curly (U+2019)
    #    エージェントが it's を it's と書くことがある
    $straight = [char]0x0027
    $curly    = [char]0x2019
    $old_ap = "If it" + $straight + "s too difficult"
    $new_ap = "If it" + $curly    + "s too difficult"
    $c = $c.Replace($old_ap, $new_ap)

    if ($c -ne $orig) {
        [System.IO.File]::WriteAllText($file, $c, $enc)
        Write-Host "fixed: gokunarabe_${n}_en.html"
    } else {
        Write-Host "ok:    gokunarabe_${n}_en.html"
    }
}
```

その後、抜き打ちで1ファイルを Read して以下を確認：
- `lang="en"` ✅
- `pageSuffix: '_en'` ✅
- `bubbleHorizontal: true` ✅
- `debug: true` ✅
- `bubbleTail: 'top-left'` ✅
- breadcrumb に `kajin-zukan_en.html` ✅
- waka の ruby markup が日本語版と一致 ✅
- `initBody` の `it's` が U+2019（カーリー）✅

---

## ⚠️ 既知の落とし穴（エージェントが犯しやすいミス）

| 問題 | 原因 | 対策 |
|------|------|------|
| `bubbleTail: 'top'` が残る | 日本語版が `'top'` の場合、`'left'`/`'right'` → `'top-left'` の置換に引っかからない | Step 5 の一括修正スクリプトで解決 |
| `initBody` の `it's` が U+0027 になる | エージェントがカーリーアポストロフィを維持できない | Step 5 のスクリプトで解決。エージェント指示に「curly apostrophe ' を保持」と明記済み |
| `debug: false` が残る | エージェントが指示を見落とすことがある | Step 5 のスクリプトで解決 |
| `.site-title` が英語になる | テンプレート（27_en）が "Shigure no Hyakunin Isshu" だったため、エージェントがそのまま踏襲 | Step 5 のスクリプトに修正を追加済み |

---

## 百人一首 英語歌人名リスト（参照用）

`js/poet-index.js` の POETS 配列から抜粋。不明な場合はそのファイルを Read すること。

主な歌人（51〜100）：
- 51: 藤原実方朝臣 → Fujiwara no Sanekata Ason
- 52: 藤原道信朝臣 → Fujiwara no Michinobu Ason
- 53: 右大将道綱母 → Mother of the Right Captain Michitsuna
- 54: 儀同三司母 → Mother of the Honorary Grand Minister
- 55: 大納言公任 → Upper Counselor Kintō
- 56: 和泉式部 → Izumi Shikibu
- 57: 紫式部 → Murasaki Shikibu
- 58: 大弐三位 → Daini no Sanmi
- 59: 赤染衛門 → Akazome Emon
- 60: 小式部内侍 → Koshikibu no Naishi
- 61: 伊勢大輔 → Ise no Taifu
- 62: 清少納言 → Sei Shōnagon
- 63: 左京大夫道雅 → Master of the Left Capital Michimasa
- 64: 権中納言定頼 → Acting Middle Counselor Sadayori
- 65: 相模 → Sagami
- 66: 前大僧正行尊 → Senior High Priest Gyōson
- 67: 周防内侍 → Suō no Naishi
- 68: 三条院 → Retired Emperor Sanjō
- 69: 能因法師 → Priest Nōin
- 70: 良暹法師 → Priest Ryōzen
- 71: 大納言経信 → Upper Counselor Tsunenobu
- 72: 祐子内親王家紀伊 → Kii of Princess Yūshi's Household
- 73: 権中納言匡房 → Acting Middle Counselor Masafusa
- 74: 源俊頼朝臣 → Minamoto no Toshiyori Ason
- 75: 藤原基俊 → Fujiwara no Mototoshi
- 76: 法性寺入道前関白太政大臣 → Lay Novice of Hosshō-ji Temple, former Kampaku and Chancellor
- 77: 崇徳院 → Retired Emperor Sutoku
- 78: 源兼昌 → Minamoto no Kanemasa
- 79: 左京大夫顕輔 → Master of the Left Capital Akisuke
- 80: 待賢門院堀河 → Horikawa, attendant to Empress Taiken
- 81: 後徳大寺左大臣 → Later Tokudaiji Minister of the Left
- 82: 道因法師 → Priest Dōin
- 83: 皇太后宮大夫俊成 → Master of the Empress Dowager's Household Toshinari
- 84: 藤原清輔朝臣 → Fujiwara no Kiyosuke Ason
- 85: 俊恵法師 → Priest Shun'e
- 86: 西行法師 → Priest Saigyō
- 87: 寂蓮法師 → Priest Jakuren
- 88: 皇嘉門院別当 → Attendant to Empress Kōka
- 89: 式子内親王 → Princess Shikishi
- 90: 殷富門院大輔 → Attendant to Empress Inpu
- 91: 後京極摂政前太政大臣 → Gokyōgoku Regent and former Chancellor
- 92: 二条院讃岐 → Sanuki, attendant to retired Emperor Nijō
- 93: 鎌倉右大臣 → Minister of the Right of Kamakura
- 94: 参議雅経 → Councillor Masatsune
- 95: 前大僧正慈円 → Former Senior High Priest Jien
- 96: 入道前太政大臣 → Lay Novice and former Chancellor
- 97: 権中納言定家 → Acting Middle Counselor Sadaie
- 98: 従二位家隆 → Junior Second Rank Ietaka
- 99: 後鳥羽院 → Retired Emperor Go-Toba
- 100: 順徳院 → Retired Emperor Juntoku

---

## 吹き出し位置調整について

英語版は `bubbleHorizontal: true` で幅が固定されるため、新規作成ページは `debug: true` のまま公開前に位置調整を行い、完了後に `debug: false` に変更する。  
- **`\n` 0個** → `bubblePos`  
- **`\n` 1個** → `bubblePosThank`  
- **`\n` 2個以上** → `bubblePosThank3`（今回作成した英語 bubbleText はすべてここ）

詳細手順は `_gokunarabe_en_guide.md` のセクション4を参照。
