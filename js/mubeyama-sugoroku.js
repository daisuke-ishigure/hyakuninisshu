/* ==========================================================
   百人一首 宝集め双六
   ひとり用すごろく本体スクリプト
   ========================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     データ定義
  --------------------------------------------------------- */

  // 百人一首100人、全員分の○×クイズ（1番〜100番）。
  // 配列はpoemNum順（1〜100）に並んでおり、QUIZ_DB[poemNum-1]で直接引ける。
  // Nコマ目にはこの配列のN番目（＝N番の歌人）のクイズが出題され、正解しないと先に進めない。
  const QUIZ_DB = [
    {
      poemNum: 1, poet: "天智天皇", quizzes: [
        { q: "天智天皇は中臣鎌足に「藤原」の姓を授けた。", answer: true, explain: "天智天皇は中臣鎌足に「藤原」の姓を授けたとされます。その子孫である藤原氏は、特に平安時代中期に摂関政治を行い、大きな権力を握りました。" },
      ]
    },
    {
      poemNum: 2, poet: "持統天皇", quizzes: [
        { q: "持統天皇は、藤原京を完成させた。", answer: true, explain: "持統天皇が完成させた藤原京が含まれる「飛鳥・藤原の宮都」は2026年に世界遺産に登録されました。" },
      ]
    },
    {
      poemNum: 3, poet: "柿本人麻呂", quizzes: [
        { q: "柿本人麻呂は「歌聖」とも呼ばれる『万葉集』を代表する歌人である。", answer: true, explain: "人麻呂は後世「歌聖」と称され、優れた歌人として長く尊敬されてきました。" },
      ]
    },
    {
      poemNum: 4, poet: "山部赤人", quizzes: [
        { q: "山部赤人は、恋の歌を得意とした歌人として知られている。", answer: false, explain: "実際は富士山など雄大な自然を詠んだ叙景歌で知られ、柿本人麻呂と並ぶ「歌聖」と称されました。" },
      ]
    },
    {
      poemNum: 5, poet: "猿丸大夫", quizzes: [
        { q: "猿丸大夫は、生没年や経歴がはっきりと伝わっている歌人である。", answer: false, explain: "猿丸大夫は、確かな経歴を伝える史料がほとんどなく、生没年もわかっていません。実在自体を疑う説もある、謎の多い歌人です。" },
      ]
    },
    {
      poemNum: 6, poet: "中納言家持", quizzes: [
        { q: "中納言家持（大伴家持）は、『万葉集』の編纂に関わったとされる人物である。", answer: true, explain: "家持は『万葉集』の成立に深く関わったとされる、奈良時代を代表する歌人です。" },
      ]
    },
    {
      poemNum: 7, poet: "阿倍仲麻呂", quizzes: [
        { q: "阿倍仲麻呂は、平安時代の歌人で、生涯のほとんどを京都で過ごした。", answer: false, explain: "仲麻呂は奈良時代の歌人です。遣唐使として唐に渡り、長安で長く暮らしました。" }
      ]
    },
    {
      poemNum: 8, poet: "喜撰法師", quizzes: [
        { q: "喜撰法師は、百人一首の歌によると、奈良の吉野山に住んでいた。", answer: false, explain: "喜撰法師は「わが庵は 都のたつみ しかぞ住む…」と詠み、平安京の東南（辰巳）にあたる宇治に庵を構えて住んでいたと伝えられています。" },
      ]
    },
    {
      poemNum: 9, poet: "小野小町", quizzes: [
        { q: "『古今和歌集』に最も多くの歌が収められている女性歌人は、小野小町である。", answer: false, explain: "『古今和歌集』に収められた歌が女性歌人で最も多いのは、22首の伊勢です。小野小町は18首で、伊勢に次ぐ多さです。" },]
    },
    {
      poemNum: 10, poet: "蝉丸", quizzes: [
        { q: "蝉丸は、目が不自由な琵琶の名手だったと伝えられている。", answer: true, explain: "蝉丸は盲目の琵琶法師として伝説化された人物です。" },
      ]
    },
    {
      poemNum: 11, poet: "参議篁", quizzes: [
        { q: "参議篁（小野篁）は、島流しにされたことがある。", answer: true, explain: "小野篁は遣唐副使に任命されましたが、遣唐使船への乗船を拒み、遣唐使を風刺した漢詩を作ったことなどから問題となり、隠岐国へ配流されたことがあります。" },
      ]
    },
    {
      poemNum: 12, poet: "僧正遍昭", quizzes: [
        { q: "僧正遍昭は、生涯を通じて出家せず、俗人のまま歌人として活躍した。", answer: false, explain: "実際は出家して僧正の位にまで昇った人物で、出家前は美男の貴公子として知られました。" },
      ]
    },
    {
      poemNum: 13, poet: "陽成院", quizzes: [
        { q: "陽成院は、穏やかな人柄で知られ、晩年まで在位した天皇である。", answer: false, explain: "陽成天皇は宮中での粗暴な振る舞いが伝えられ、17歳で退位したとされています。" },
      ]
    },
    {
      poemNum: 14, poet: "源融", quizzes: [
        { q: "河原左大臣（源融）は、陽成天皇の退位に際して、自ら天皇になりたいと申し出たことがある。", answer: true, explain: "河原左大臣（源融）は自ら皇位継承の候補に値すると主張したことがあります。ただし、藤原基経から「臣籍降下（皇族の身分から外れて臣下に下ること）した者が即位した例はない」として一蹴されました。" }
      ]
    },
    {
      poemNum: 15, poet: "光孝天皇", quizzes: [
        { q: "光孝天皇は、幼少期に即位した天皇である。", answer: false, explain: "実際は55歳という当時としては高齢での即位でした。" },
      ]
    },
    {
      poemNum: 16, poet: "中納言行平", quizzes: [
        { q: "在原行平は、和歌だけを得意とし、政治には積極的に関わらなかった。", answer: false, explain: "在原行平は、和歌だけでなく学問や漢詩にも優れ、因幡国では地方官として活躍しました。帰京後は国政にも携わり、中納言にまで昇進しました。" },
      ]
    },
    {
      poemNum: 17, poet: "在原業平", quizzes: [
        { q: "在原業平は、『伊勢物語』の主人公のモデルにされたと考えられている。", answer: true, explain: "『伊勢物語』の主人公とされる「昔男」は、在原業平をモデルとしたと考えられています。" },
      ]
    },
    {
      poemNum: 18, poet: "藤原敏行", quizzes: [
        { q: "藤原敏行は、和歌だけが得意で、書は苦手だった。", answer: false, explain: "藤原敏行は和歌だけでなく、能書家（書の名手）としても知られ、平安時代に名を残しました。" },]
    },
    {
      poemNum: 19, poet: "伊勢", quizzes: [
        { q: "伊勢は、古今和歌集において女性歌人の中で最も多くの歌が収められている。", answer: true, explain: "伊勢は『古今和歌集』に22首が収められており、女性歌人では最多の入集数です。" }
      ]
    },
    {
      poemNum: 20, poet: "元良親王", quizzes: [
        { q: "元良親王は、陽成天皇の第一皇子で、恋多き人物として知られた。", answer: true, explain: "元良親王は陽成天皇の第一皇子で、情熱的な恋歌を多く残しました。多くの女性のもとを一夜ごとに渡り歩いたとされ、「一夜めぐりの君」とも呼ばれる恋多き皇子です。" },
      ]
    },
    {
      poemNum: 21, poet: "素性法師", quizzes: [
        { q: "素性法師は、自身の意思で僧侶になった。", answer: false, explain: "素性法師は、同じく百人一首の12番に選ばれている父の僧正遍昭によって半ば無理やり出家させられたことが知られています。" }
      ]
    },
    {
      poemNum: 22, poet: "文屋康秀", quizzes: [
        { q: "文屋康秀は、小野小町に三河国へ赴く際、一緒に来ないかと誘う歌を贈ったことがある。", answer: true, explain: "『古今和歌集』には、文屋康秀が三河国へ赴く際、小野小町に同行を誘う歌を贈ったことが記されています。小町もそれに返歌をしていますが、実際に同行したかどうかは記されていません。" },
      ]
    },
    {
      poemNum: 23, poet: "大江千里", quizzes: [
        { q: "大江千里の百人一首の歌は、月を見て秋の物悲しさを詠んだ歌である。", answer: true, explain: "「月見れば ちぢに物こそ 悲しけれ わが身ひとつの 秋にはあらねど」は、月を見ると、あれこれと物悲しくなる、自分一人だけの秋ではないのに、という意味の歌です。大江千里は、漢詩文に通じた学者でもありました。" },]
    },
    {
      poemNum: 24, poet: "菅原道真", quizzes: [
        { q: "菅原道真は死後、怨霊になったと恐れられたことがある。", answer: true, explain: "道真は政変で不遇の最期を迎えました。その後、清涼殿への落雷事件などがあった際、道真の怨霊の仕業と恐れられました。日本三大怨霊の一人に数えられています。" },
      ]
    },
    {
      poemNum: 25, poet: "三条右大臣", quizzes: [
        { q: "三条右大臣（藤原定方）の百人一首の歌は、恋の歌である。", answer: true, explain: "「名にし負はば 逢坂山のさねかづら…」は、人に知られずにあなたに会う方法があればいいのに、と詠んだ恋の歌です。" },
      ]
    },
    {
      poemNum: 26, poet: "貞信公", quizzes: [
        { q: "貞信公（藤原忠平）は、菅原道真を大宰府へ左遷した人物である。", answer: false, explain: "道真を左遷したのは、忠平の兄の藤原時平です。忠平は道真と親交があったと伝えられています。貞信公とは、忠平の<ruby>諡<rt>おくりな</rt></ruby>（高い身分の人が生前の功績などを称え、死後に送られる名前）です。" },]
    },
    {
      poemNum: 27, poet: "中納言兼輔", quizzes: [
        { q: "中納言兼輔（藤原兼輔）は、紫式部の曽祖父にあたる人物である。", answer: true, explain: "藤原兼輔は紫式部の曽祖父にあたります。藤原兼輔の子孫は代々学者・歌人として活躍し、紫式部もその血を引いています。" },
      ]
    },
    {
      poemNum: 28, poet: "源宗于朝臣", quizzes: [
        { q: "源宗于朝臣は、光孝天皇の孫にあたる人物である。", answer: true, explain: "源宗于は光孝天皇の孫にあたりますが、臣籍降下（皇族の身分から外れて臣下に下ること）し、「源」の姓を賜りました" },
      ]
    },
    {
      poemNum: 29, poet: "凡河内躬恒", quizzes: [
        { q: "凡河内躬恒は、『土佐日記』の作者である。", answer: false, explain: "『土佐日記』の作者は紀貫之（35番）です。凡河内躬恒は、その紀貫之らとともに『古今和歌集』の撰者を務めた歌人です。" },
      ]
    },
    {
      poemNum: 30, poet: "壬生忠岑", quizzes: [
        { q: "壬生忠岑は、『新古今和歌集』の撰者の一人である。", answer: false, explain: "壬生忠岑は、紀貫之・紀友則・凡河内躬恒とともに『古今和歌集』の撰者を務めました。壬生忠見の父にあたります。" },
      ]
    },
    {
      poemNum: 31, poet: "坂上是則", quizzes: [
        { q: "坂上是則の百人一首の歌は、吉野の桜を詠んだ歌である。", answer: false, explain: "坂上是則の歌は桜ではなく、雪を詠んだ歌です。「朝ぼらけ 有明の月と 見るまでに 吉野の里に ふれる白雪」と、吉野の里に降り積もった白雪を、明け方の月の光かと見まちがえた様子を詠んでいます。吉野は、現代では桜の名所として有名ですが、平安時代には雪の名所としても知られていました。" },]
    },
    {
      poemNum: 32, poet: "春道列樹", quizzes: [
        { q: "春道列樹の百人一首の歌は、春を詠んだものである。", answer: false, explain: "春道列樹の百人一首の歌は、紅葉を詠んだ秋の歌です。" },
      ]
    },
    {
      poemNum: 33, poet: "紀友則", quizzes: [
        { q: "紀友則は、古今和歌集の撰者として選ばれたが、完成する前に亡くなった。", answer: true, explain: "紀友則は古今和歌集の完成を見届けることができず、途中で亡くなりました。" },
      ]
    },
    {
      poemNum: 34, poet: "藤原興風", quizzes: [
        { q: "藤原興風の百人一首の歌は、長く生きられたことのめでたさを詠んだものである。", answer: false, explain: "この歌は長寿を喜んでいるのではなく、長く生きすぎたために親しい友人が先立ち、一人取り残されてしまった孤独と寂しさを詠んだものです。" },
      ]
    },
    {
      poemNum: 35, poet: "紀貫之", quizzes: [
        { q: "紀貫之は、『土佐日記』の作者である。", answer: true, explain: "貫之は『古今和歌集』の撰者であると同時に、仮名文学の傑作『土佐日記』の作者でもあります。" },
      ]
    },
    {
      poemNum: 36, poet: "清原深養父", quizzes: [
        { q: "清原深養父の百人一首の歌は、夏の短い夜を詠んだ歌である。", answer: true, explain: "「夏の夜は まだ宵ながら 明けぬるを 雲のいづこに 月宿るらむ」は、夏の夜があまりに短く、まだ宵のうちに明けてしまった、月は雲のどこに宿っているのだろう、と詠んだ歌です。" },
      ]
    },
    {
      poemNum: 37, poet: "文屋朝康", quizzes: [
        { q: "文屋朝康は、文屋康秀の子で、親子そろって百人一首に選ばれている。", answer: true, explain: "六歌仙の一人・文屋康秀の子とされ、親子で百人一首に選ばれています。" },
      ]
    },
    {
      poemNum: 38, poet: "右近", quizzes: [
        { q: "右近は、摂政・関白を務めた男性の公卿である。", answer: false, explain: "右近は宮中に仕えた女流歌人で、女房として活躍しました。右近の名前の由来は父親が「右近衛少将」という官職に就いていたことに由来しています。" },
      ]
    },
    {
      poemNum: 39, poet: "参議等", quizzes: [
        { q: "参議等の歌は、秘めていた恋心があふれてしまうことを詠んだ恋の歌である。", answer: true, explain: "「浅茅生の 小野の篠原 忍ぶれど…」の歌は、じっと隠してきたのに、それでも抑えきれないほど恋しい、という気持ちを詠んでいます。" },
      ]
    },
    {
      poemNum: 40, poet: "平兼盛", quizzes: [
        { q: "平兼盛は、有名な歌合で壬生忠見と対決し、勝ったと伝えられている。", answer: true, explain: "天徳四年内裏歌合で、平兼盛の「忍ぶれど」と壬生忠見の「恋すてふ」が競われ、兼盛の歌が勝ったという逸話が有名です。" },
      ]
    },
    {
      poemNum: 41, poet: "壬生忠見", quizzes: [
        { q: "壬生忠見は、歌合で平兼盛に負けたと伝えられている。", answer: true, explain: "天徳内裏歌合で、忠見と兼盛は「恋」の歌を競いました。村上天皇が兼盛の歌「しのぶれど…」を口ずさんだことから、兼盛の勝ちになったと伝えられています。" },]
    },
    {
      poemNum: 42, poet: "清原元輔", quizzes: [
        { q: "清原元輔は、清少納言の父である。", answer: true, explain: "清少納言は966年頃の生まれとされ、父の清原元輔は当時59歳頃でした。" },
      ]
    },
    {
      poemNum: 43, poet: "権中納言敦忠", quizzes: [
        { q: "権中納言敦忠の歌は、恋人と会ったあとのほうが、恋しい気持ちが強くなったと詠んだ歌である。", answer: true, explain: "「逢ひ見ての 後の心に くらぶれば 昔は物を 思はざりけり」は、恋人と結ばれた後の思いに比べれば、以前の悩みなど無かったようなものだ、という意味の歌です。" },
      ]
    },
    {
      poemNum: 44, poet: "中納言朝忠", quizzes: [
        { q: "中納言朝忠（藤原朝忠）は、三条右大臣（藤原定方）の子である。", answer: true, explain: "藤原朝忠は藤原定方の五男で、父子そろって百人一首に選ばれています。" },
      ]
    },
    {
      poemNum: 45, poet: "謙徳公", quizzes: [
        { q: "謙徳公は、生涯官位に恵まれず、無官のまま没した人物である。", answer: false, explain: "実際は藤原伊尹のことで、摂政にまで昇った人物です。" },
      ]
    },
    {
      poemNum: 46, poet: "曽禰好忠", quizzes: [
        { q: "曽禰好忠の歌は、かじを失った舟にたとえて、行く先のわからない恋を詠んだ歌である。", answer: true, explain: "「由良のとを 渡る舟人 かぢを絶え…」の歌は、かじをなくして行き先もわからず漂う舟に、先が見えない自分の恋をたとえています。" },
      ]
    },
    {
      poemNum: 47, poet: "恵慶法師", quizzes: [
        {
          q: "恵慶法師の歌は、人の訪れがなく荒れた宿に、秋が来たことを詠んだ歌である。",
          answer: true,
          explain: "「八重葎 しげれる宿の さびしきに 人こそ見えね 秋は来にけり」は、雑草が生い茂った寂しい家に、人は誰も来ないのに秋だけは来た、という歌です。"
        },
      ]
    },
    {
      poemNum: 48, poet: "源重之", quizzes: [
        { q: "源重之は、陸奥や筑紫など、都を離れて各地で暮らした歌人である。", answer: true, explain: "地方官として各地に赴任し、陸奥や筑紫などで暮らしました。その経験は、自然や旅情を詠んだ歌にも表れています。" },
      ]
    },
    {
      poemNum: 49, poet: "大中臣能宣", quizzes: [
        { q: "大中臣能宣は、伊勢神宮の祭主を務めた人物である。", answer: true, explain: "代々神職を務める家系の出身で、自身も伊勢神宮の祭主を務めました。" },
      ]
    },
    {
      poemNum: 50, poet: "藤原義孝", quizzes: [
        { q: "藤原義孝は、わずか21歳の若さで病没した。", answer: true, explain: "義孝は、疱瘡という疫病にかかり、21歳の若さで亡くなりました。義孝の兄が同日の朝に亡くなり、義孝は夕方に亡くなったとされています。" },
      ]
    },
    {
      poemNum: 51, poet: "藤原実方朝臣", quizzes: [
        { q: "藤原実方朝臣は、生涯を都で過ごし、地方に赴任することはなかった。", answer: false, explain: "藤原実方朝臣は、宮中で喧嘩をしたことをきっかけに、陸奥に左遷され、任地の陸奥で落馬によって亡くなったと伝えられています。" },
      ]
    },
    {
      poemNum: 52, poet: "藤原道信朝臣", quizzes: [
        {
          q: "藤原道信朝臣は、23歳で亡くなった若き歌人として知られる。", answer: true,
          explain: "藤原道信朝臣は23歳で亡くなったとされ、早世した歌人として知られています。"
        },
      ]
    },
    {
      poemNum: 53, poet: "右大将道綱母", quizzes: [
        { q: "右大将道綱母は、『蜻蛉日記』を著した人物である。", answer: true, explain: "右大将道綱母は『蜻蛉日記』の作者で、藤原兼家との結婚生活を描きました。" },
      ]
    },
    {
      poemNum: 54, poet: "儀同三司母", quizzes: [
        { q: "儀同三司母（高階貴子）は、藤原道隆の妻で、伊周・定子の母である。", answer: true, explain: "中関白家の要となった女性で、藤原伊周・中宮定子の母にあたります。" },
      ]
    },
    {
      poemNum: 55, poet: "藤原公任", quizzes: [
        { q: "藤原公任は、和歌・漢詩・音楽のすべてに秀でた「三船の才」の逸話で知られる。", answer: true, explain: "どの船（和歌・漢詩・管弦）に乗るか誉められたという有名な逸話が残っています。" },
      ]
    },
    {
      poemNum: 56, poet: "和泉式部", quizzes: [
        { q: "和泉式部には子がおらず、生涯独身だったとされる。", answer: false, explain: "和泉式部には娘・小式部内侍がおり、母娘ともに百人一首に選ばれています。" },

      ]
    },
    {
      poemNum: 57, poet: "紫式部", quizzes: [
        { q: "紫式部は『源氏物語』の作者である。", answer: true, explain: "紫式部は平安時代を代表する長編物語『源氏物語』を著しました。" },
      ]
    },
    {
      poemNum: 58, poet: "大弐三位", quizzes: [
        { q: "大弐三位は、紫式部の娘である。", answer: true, explain: "大弐三位は、『源氏物語』の作者である紫式部の一人娘です。" },
      ]
    },
    {
      poemNum: 59, poet: "赤染衛門", quizzes: [
        { q: "赤染衛門は、和歌のみを詠み、物語や歴史書の執筆には関わらなかったとされる。", answer: false, explain: "赤染衛門は優れた歌人として知られる一方、40巻ある『栄花物語』の30巻は赤染衛門が執筆したとされており、和歌だけでなく、物語作者であったと考えられます。" },
      ]
    },
    {
      poemNum: 60, poet: "小式部内侍", quizzes: [
        { q: "小式部内侍は、和泉式部の娘である。", answer: true, explain: "母・和泉式部譲りの歌才で知られ、機知に富んだ逸話も残っています。" },
      ]
    },
    {
      poemNum: 61, poet: "伊勢大輔", quizzes: [
        { q: "伊勢大輔の歌は、八重桜を詠んだ歌である。", answer: true, explain: "「いにしへの 奈良の都の 八重桜 けふ九重に にほひぬるかな」は、奈良から献上された八重桜が、宮中（九重）で美しく咲き誇るさまを詠んだ歌です。" },
      ]
    },
    {
      poemNum: 62, poet: "清少納言", quizzes: [
        { q: "清少納言は、一条天皇の皇后・定子に仕えた女房である。", answer: true, explain: "藤原道隆の娘である皇后定子に仕え、その宮廷生活を『枕草子』に生き生きと描きました。" },
      ]
    },
    {
      poemNum: 63, poet: "左京大夫道雅", quizzes: [
        { q: "左京大夫道雅は、当子内親王と密かに恋仲になり、幸せに暮らした。", answer: false, explain: "左京大夫道雅は、当子内親王と密かに恋仲になったものの、二人の関係は許されず、彼女の父である三条天皇から仲を引き裂かれた。" }
      ]
    },
    {
      poemNum: 64, poet: "権中納言定頼", quizzes: [
        { q: "権中納言定頼（藤原定頼）は、小式部内侍をからかって、歌でやりこめられたことがある。", answer: true, explain: "「母の和泉式部に代作を頼んだのでは」とからかった定頼に、小式部内侍が「大江山 いく野の道の…」と即座に詠み返し、定頼は返歌もできず逃げ出したと伝えられています。" },
      ]
    },
    {
      poemNum: 65, poet: "相模", quizzes: [
        { q: "相模という名前は、現在の神奈川県あたりの国名「相模国」に由来する。", answer: true, explain: "相模の名は、夫の大江公資が相模守として赴任した国名にちなむとされます。相模国は、現在の神奈川県の大部分にあたります。" },
      ]
    },
    {
      poemNum: 66, poet: "前大僧正行尊", quizzes: [
        { q: "前大僧正行尊は、天台宗の僧侶である。", answer: true, explain: "行尊は天台宗の僧侶で、比叡山延暦寺の最高位の役職である天台座主を務めました。" },
      ]
    },
    {
      poemNum: 67, poet: "周防内侍", quizzes: [
        { q: "周防内侍は、男性の公卿で、和歌には無縁だった。", answer: false, explain: "周防内侍は後宮に仕えた女房で、機知に富んだ歌人として知られています。" },
      ]
    },
    {
      poemNum: 68, poet: "三条院", quizzes: [
        { q: "三条院は、若くして天皇に即位し、在位期間も長かった。", answer: false, explain: "三条天皇は36歳で即位し、在位は約5年と短期でした。眼病を患い、藤原道長との対立などもあり、譲位することになりました。" },
      ]
    },
    {
      poemNum: 69, poet: "能因法師", quizzes: [
        { q: "能因法師は、陸奥へ旅したふりをするため、わざと日焼けしてから人前に出たという逸話がある。", answer: true, explain: "『都をば霞とともに立ちしかど秋風ぞ吹く白河の関』と詠んだ能因法師には、白河の関を実際に訪れたことを示すため、わざと日焼けしてから人前に出たという逸話が伝えられています。" },
      ]
    },
    {
      poemNum: 70, poet: "良暹法師", quizzes: [
        { q: "百人一首に収められた良暹法師の歌は、夏の夕暮れを詠んだ歌として有名である。", answer: false, explain: "良暹法師の歌は、秋の夕暮れの寂しさを詠んだ歌で、夏の歌ではありません。" }
      ]
    },
    {
      poemNum: 71, poet: "大納言経信", quizzes: [
        {
          q: "大納言経信（源経信）は、詩・和歌・管弦のすべてに優れ、「三舟の才」と称された。", answer: true,
          explain: "源経信は、漢詩・和歌・音楽の三つに優れた才能を持つ人物として知られ、「三舟の才」と称されました。博識でもあり、特に琵琶の名手としても知られています。"
        },
      ]
    },
    {
      poemNum: 72, poet: "祐子内親王家紀伊", quizzes: [
        { q: "祐子内親王家紀伊は、男性の歌人である。", answer: false, explain: "後朱雀天皇の皇女・祐子内親王に仕えた女房で、女流歌人です。" },
      ]
    },
    {
      poemNum: 73, poet: "権中納言匡房", quizzes: [
        { q: "権中納言匡房の歌は、高い山の峰に咲く桜を詠んだ歌である。", answer: true, explain: "「高砂の 尾の上の桜 咲きにけり 外山の霞 立たずもあらなむ」は、遠くの高い山の桜が咲いたので、手前の山の霞が立ってその姿を隠さないでほしい、と詠んだ歌です。" }
      ]
    },
    {
      poemNum: 74, poet: "源俊頼朝臣", quizzes: [
        { q: "源俊頼朝臣の歌は、山の桜が咲いた様子を詠んだ歌である。", answer: false, explain: "源俊頼朝臣の歌は桜を詠んだ歌ではなく、初瀬（長谷寺）に祈ったのに、つれない人がかえって冷たくなったと嘆く恋の歌です。" },
      ]
    },
    {
      poemNum: 75, poet: "藤原基俊", quizzes: [
        { q: "藤原基俊の百人一首の歌は、息子の出世を喜んで詠んだ歌である。", answer: false, explain: "藤原基俊の歌は、僧侶となった息子・光覚の出世がかなわないことを嘆いた歌です。息子を思う親心が込められています。" }
      ]
    },
    {
      poemNum: 76, poet: "法性寺入道前関白太政大臣", quizzes: [
        { q: "法性寺入道前関白太政大臣は、百人一首で一番長い名前である。", answer: true, explain: "百人一首には、官職や出家後の呼び名を組み合わせた歌人名があります。法性寺入道前関白太政大臣もその一つで、本名は藤原忠通です。" }
      ]
    },
    {
      poemNum: 77, poet: "崇徳院", quizzes: [
        { q: "崇徳院は、死後に怨霊になったと恐れられた。", answer: true, explain: "保元の乱に敗れて讃岐に配流され、悲劇的な最期を迎えた崇徳院は、死後、朝廷に災いをもたらす怨霊として恐れられるようになりました。日本三大怨霊の一人に数えられています。" },
      ]
    },
    {
      poemNum: 78, poet: "源兼昌", quizzes: [
        { q: "源兼昌の百人一首の歌には、ホトトギスが詠まれている。", answer: false, explain: "源兼昌の歌に詠まれているのは、ホトトギスではなく千鳥です。「淡路島 通ふ千鳥の 鳴く声に 幾夜寝覚めぬ 須磨の関守」は、淡路島から渡ってくる千鳥の声で、須磨の関守は何度目を覚ましたことか、と詠んだ歌です。" },
      ]
    },
    {
      poemNum: 79, poet: "左京大夫顕輔", quizzes: [
        { q: "左京大夫顕輔の歌は、雲の切れ間からもれる月の光を詠んだ歌である。", answer: true, explain: "「秋風に たなびく雲の 絶え間より もれ出づる月の 影のさやけさ」は、秋風に流れる雲の切れ間から、月の光が澄んで見える様子を詠んでいます。" },
      ]
    },
    {
      poemNum: 80, poet: "待賢門院堀河", quizzes: [
        { q: "待賢門院堀河が詠んだ「黒髪」の歌は、近代を代表する歌人・与謝野晶子にも影響を与えたとされる。", answer: true, explain: "待賢門院堀河の「長からむ心も知らず黒髪の…」は、後世にも愛されました。与謝野晶子もこの「黒髪」の歌を踏まえた作品を残しています。" }
      ]
    },
    {
      poemNum: 81, poet: "後徳大寺左大臣", quizzes: [
        { q: "後徳大寺左大臣の歌では、鳴いたホトトギスの姿をはっきり見ることができたと詠まれている。", answer: false, explain: "声のした方を眺めても、ホトトギスの姿は見えず、有明の月だけが残っていたと詠んでいます。" },
      ]
    },
    {
      poemNum: 82, poet: "道因法師", quizzes: [
        { q: "道因法師は、長寿を保ち、老いても和歌への執念を失わなかった人物である。", answer: true, explain: "80歳を過ぎても和歌の上達を願い、和歌の神として信仰された大阪にある住吉大社に徒歩で参詣して祈願したという逸話が残るなど、和歌への強い執念で知られています。" },
      ]
    },
    {
      poemNum: 83, poet: "皇太后宮大夫俊成", quizzes: [
        { q: "皇太后宮大夫俊成（藤原俊成）は、藤原定家の父にあたる人物である。", answer: true, explain: "藤原俊成は藤原定家の父で、親子そろって百人一首に選ばれました。" },
      ]
    },
    {
      poemNum: 84, poet: "藤原清輔朝臣", quizzes: [
        { q: "藤原清輔朝臣は、『枕草子』を著した人物である。", answer: false, explain: "『枕草子』を著したのは清少納言です。藤原清輔朝臣が著したのは、和歌の理論や逸話をまとめた歌学書『袋草紙』です。" },
      ]
    },
    {
      poemNum: 85, poet: "俊恵法師", quizzes: [
        { q: "俊恵法師は、自分の僧坊「歌林苑」に多くの歌人を集め、歌会を開いた。", answer: true, explain: "俊恵法師は、京都の白川にあった自分の僧坊を「歌林苑」と呼び、僧侶や貴族など多くの歌人が集まる歌会の場としました。『方丈記』で知られる鴨長明も、俊恵に和歌を学んだとされています。" },
      ]
    },
    {
      poemNum: 86, poet: "西行法師", quizzes: [
        { q: "西行法師は、「桜の下で春に死にたい」と願い、その歌のとおり桜の季節に亡くなったと伝えられている。", answer: true, explain: "西行は「願はくは花の下にて春死なむ」と詠み、実際に陰暦2月16日、釈尊の涅槃の日（釈尊が亡くなった日）に入寂したと伝えられています。" }
      ]
    },
    {
      poemNum: 87, poet: "寂蓮法師", quizzes: [
        { q: "寂蓮法師は、藤原俊成の養子となったが、俊成に実子・定家が生まれた後に出家した。", answer: true, explain: "寂蓮は俊成の養子となりましたが、俊成に実子の定家が生まれた後、出家したとされています。" },
      ]
    },
    {
      poemNum: 88, poet: "皇嘉門院別当", quizzes: [
        { q: "皇嘉門院別当の歌は、たった一夜の逢瀬のために、一生恋い続けるのだろうかと詠んだ恋の歌である。", answer: true, explain: "「難波江の 芦のかりねの ひと夜ゆゑ 身を尽くしてや 恋ひわたるべき」は、芦の刈り根のように短い仮寝（一夜の逢瀬）のために、身を尽くして恋い続けるのか、と詠んだ歌です。" }
      ]
    },
    {
      poemNum: 89, poet: "式子内親王", quizzes: [
        { q: "式子内親王は、生涯に一度も結婚しなかった。", answer: true, explain: "式子内親王は賀茂斎院を務めた皇女で、退下後も結婚せず、生涯独身を通しました。" },
      ]
    },
    {
      poemNum: 90, poet: "殷富門院大輔", quizzes: [
        { q: "殷富門院大輔の歌に出てくる雄島は、現在の宮城県の松島にある島である。", answer: true, explain: "雄島は、日本三景の一つとして有名な宮城県の松島にある島です。" },
      ]
    },
    {
      poemNum: 91, poet: "後京極摂政前太政大臣", quizzes: [
        { q: "後京極摂政前太政大臣（藤原良経）の百人一首の歌に詠まれた「きりぎりす」は、現在のキリギリスのことである。", answer: false, explain: "この歌の「きりぎりす」は、現在のキリギリスではなく、コオロギを指すとされています。古典では虫の呼び名が現在とは異なることがあり、現在のキリギリスは「はたおり」、現在のコオロギは「きりぎりす」と呼ばれていました。" }
      ]
    },
    {
      poemNum: 92, poet: "二条院讃岐", quizzes: [
        { q: "二条院讃岐は、百人一首に選ばれた「わが袖は 潮干に見えぬ 沖の石の…」の歌から「沖の石の讃岐」と呼ばれた。", answer: true, explain: "二条院讃岐の百人一首の歌に登場する「沖の石」にちなみ、後世に「沖の石の讃岐」と呼ばれるようになりました。" },
      ]
    },
    {
      poemNum: 93, poet: "鎌倉右大臣", quizzes: [
        { q: "鎌倉右大臣（源実朝）は、鎌倉幕府の第3代将軍である。", answer: true, explain: "源頼朝の子で、鎌倉幕府三代将軍を務めながら歌人としても活躍しました。" },
      ]
    },
    {
      poemNum: 94, poet: "参議雅経", quizzes: [
        { q: "参議雅経（藤原雅経）は、蹴鞠の家として知られる飛鳥井家の祖である。", answer: true, explain: "その子孫は代々蹴鞠の宗家・飛鳥井家として続きました。" },
      ]
    },
    {
      poemNum: 95, poet: "慈円", quizzes: [
        { q: "慈円は、朝廷と武家の対立が深まるなか、『愚管抄』を著して当時の政治に警鐘を鳴らした。", answer: true, explain: "慈円は、『愚管抄』を著し、後鳥羽上皇による幕府討伐の計画を防ごうとした意図があったとされています。" }
      ]
    },
    {
      poemNum: 96, poet: "入道前太政大臣", quizzes: [
        { q: "入道前太政大臣（西園寺公経）は、後鳥羽上皇とともに鎌倉幕府を倒そうとした。", answer: false, explain: "西園寺公経は、後鳥羽上皇の討幕計画を鎌倉幕府に知らせたとされます。承久の乱の後は朝廷と幕府の間を取り持つ公家となり、太政大臣にまで昇りました。" },
      ]
    },
    {
      poemNum: 97, poet: "藤原定家", quizzes: [
        { q: "藤原定家は、『小倉百人一首』の撰者とされている。", answer: true, explain: "『小倉百人一首』は、藤原定家が小倉山の山荘で百人の歌人から一首ずつ選んだものと伝えられています。" },
      ]
    },
    {
      poemNum: 98, poet: "従二位家隆", quizzes: [
        { q: "従二位家隆（藤原家隆）は、藤原定家と並び称された歌人である。", answer: true, explain: "藤原家隆は藤原俊成に学び、定家とともに新古今時代を代表する歌人とされました。『新古今和歌集』の撰者の一人でもあります。" },
      ]
    },
    {
      poemNum: 99, poet: "後鳥羽院", quizzes: [
        { q: "後鳥羽院は、自ら刀を鍛えるほど、刀剣を好んでいた。", answer: true, explain: "和歌をはじめ多方面の文化に通じた後鳥羽院は、刀剣にも強い関心を示し、刀工を招いて自ら鍛刀するほどでした。" },
      ]
    },
    {
      poemNum: 100, poet: "順徳院", quizzes: [
        { q: "順徳院は、承久の乱に関与せず、都で穏やかな生涯を送った。", answer: false, explain: "実際は父・後鳥羽院とともに承久の乱に関わり、佐渡に配流されました。" },
      ]
    }
  ];

  // 百人一首の原文（上の句/下の句、ルビ付きHTML）と現代語訳。poems.js のデータから抽出（poemNumで対応）。
  const POEM_DB = {
    1: { first: '<ruby>秋<rt>あき</rt></ruby>の<ruby>田<rt>た</rt></ruby>の<br>かりほの<ruby>庵<rt>いお</rt></ruby>の<br><ruby>苫<rt>とま</rt></ruby>をあらみ', second: '<ruby>我<rt>わ</rt></ruby>が<ruby>衣手<rt>ころもで</rt></ruby>は<br><ruby>露<rt>つゆ</rt></ruby>にぬれつつ', translation: '秋の田のほとりにある仮小屋は、屋根の苫の編み目が粗くて、私の袖が夜露に濡れているよ。' },
    2: { first: '<ruby>春<rt>はる</rt></ruby><ruby>過<rt>す</rt></ruby>ぎて<br><ruby>夏<rt>なつ</rt></ruby><ruby>来<rt>き</rt></ruby>にけらし<br><ruby>白妙<rt>しろたえ</rt></ruby>の', second: '<ruby>衣<rt>ころも</rt></ruby>ほす<ruby>てふ<rt>ちょう</rt></ruby><br><ruby>天<rt>あま</rt></ruby>の<ruby>香具山<rt>かぐやま</rt></ruby>', translation: '春は過ぎ去り、夏が来たようだ。夏になると衣が干されるという天の香具山に白い衣が干されているよ。' },
    3: { first: 'あしびきの<br><ruby>山鳥<rt>やまどり</rt></ruby>の<ruby>尾<rt>お</rt></ruby>の<br>しだり<ruby>尾<rt>お</rt></ruby>の', second: 'ながながし<ruby>夜<rt>よ</rt></ruby>を<br>ひとりかも<ruby>寝<rt>ね</rt></ruby><ruby>む<rt>ん</rt></ruby>', translation: '山鳥の垂れ下がる尾のように長い長い夜を独りさびしく寝るのだろうか。' },
    4: { first: '<ruby>田子<rt>たご</rt></ruby>の<ruby>浦<rt>うら</rt></ruby>に<br>うちいでてみれば<br><ruby>白妙<rt>しろたえ</rt></ruby>の', second: '<ruby>富士<rt>ふじ</rt></ruby>の<ruby>高嶺<rt>たかね</rt></ruby>に<br><ruby>雪<rt>ゆき</rt></ruby>は<ruby>降<rt>ふ</rt></ruby>りつつ', translation: '田子の浦に出てみたら、富士の高嶺に真っ白な布を被せたように雪がしきりに降っているよ。' },
    5: { first: '<ruby>奥山<rt>おくやま</rt></ruby>に<br><ruby>紅葉<rt>もみじ</rt></ruby><ruby>踏<rt>ふ</rt></ruby>み<ruby>分<rt>わ</rt></ruby>け<br><ruby>鳴<rt>な</rt></ruby>く<ruby>鹿<rt>しか</rt></ruby>の', second: '<ruby>声<rt>こえ</rt></ruby><ruby>聞<rt>き</rt></ruby>く<ruby>時<rt>とき</rt></ruby>ぞ<br><ruby>秋<rt>あき</rt></ruby>はかなしき', translation: '人里離れた奥山に紅葉を踏み分け入っていくと、鹿の鳴き声が響く。その声を聞くとき、秋はひとしお悲しく感じられる。' },
    6: { first: 'かささぎの<br><ruby>渡<rt>わた</rt></ruby>せる<ruby>橋<rt>はし</rt></ruby>に<br>おく<ruby>霜<rt>しも</rt></ruby>の', second: '<ruby>白<rt>しろ</rt></ruby>きをみれば<br><ruby>夜<rt>よ</rt></ruby>ぞふけにける', translation: 'かささぎの群れが翼を連ねて渡したという天の川に架かる橋に霜が降りている。その冴えわたっている白さを見ると、夜が深まっていくようだ。' },
    7: { first: '<ruby>天<rt>あま</rt></ruby>の<ruby>原<rt>はら</rt></ruby><br>ふりさけみれば<br><ruby>春日<rt>かすが</rt></ruby>なる', second: '<ruby>三笠<rt>みかさ</rt></ruby>の<ruby>山<rt>やま</rt></ruby>に<br><ruby>出<rt>い</rt></ruby>でし<ruby>月<rt>つき</rt></ruby>かも', translation: '遥かな大空を仰ぎ見ると月が出ていた。あの月は春日の三笠山に出ていた月と同じようだ。' },
    8: { first: 'わが<ruby>庵<rt>いお</rt></ruby>は<br><ruby>都<rt>みやこ</rt></ruby>の<ruby>辰巳<rt>たつみ</rt></ruby><br>しかぞすむ', second: '<ruby>世<rt>よ</rt></ruby>をう<ruby>ぢ<rt>じ</rt></ruby><ruby>山<rt>やま</rt></ruby>と<br><ruby>人<rt>ひと</rt></ruby>はい<ruby>ふ<rt>う</rt></ruby>なり', translation: '私の住まいは都の東南にあり、心静かに暮らしている。 世を憂いているから憂し山に移り住んだと噂する人がいるけれども。' },
    9: { first: '<ruby>花<rt>はな</rt></ruby>の<ruby>色<rt>いろ</rt></ruby>は<br>うつりにけりな<br>いた<ruby>づ<rt>ず</rt></ruby>らに', second: 'わが<ruby>身<rt>み</rt></ruby>よにふる<br>ながめせしまに', translation: '美しかった桜が長雨に打たれて空しく色褪せてしまったように私の容色も物思いをしているうちに気づいたら衰えてしまったよ。' },
    10: { first: 'これやこの<br><ruby>行<rt>ゆ</rt></ruby>くも<ruby>帰<rt>かえ</rt></ruby>るも<br>わかれては', second: 'しるもしらぬも<br><ruby>逢坂<rt>おうさか</rt></ruby>の<ruby>関<rt>せき</rt></ruby>', translation: 'これがあの、旅立つ人も帰る人も、知っている人も知らない人も別れてはまた出会うという逢坂の関であるのだなぁ。' },
    11: { first: 'わたの<ruby>原<rt>はら</rt></ruby><br><ruby>八十島<rt>やそしま</rt></ruby>かけて<br><ruby>漕<rt>こ</rt></ruby>ぎ<ruby>出<rt>い</rt></ruby>でぬと', second: '<ruby>人<rt>ひと</rt></ruby>にはつげよ<br>あまのつり<ruby>舟<rt>ぶね</rt></ruby>', translation: 'わたしが大海原の島々に向けて船出したと伝えておくれ。漁師の釣り舟よ。' },
    12: { first: '<ruby>天<rt>あま</rt></ruby>つ<ruby>風<rt>かぜ</rt></ruby><br><ruby>雲<rt>くも</rt></ruby>のかよ<ruby>ひ<rt>い</rt></ruby><ruby>路<rt>じ</rt></ruby><br><ruby>吹<rt>ふ</rt></ruby>きと<ruby>ぢ<rt>じ</rt></ruby>よ', second: 'をとめの<ruby>姿<rt>すがた</rt></ruby><br>しばしとどめ<ruby>む<rt>ん</rt></ruby>', translation: '空吹く風よ。天女が帰る雲の通り道を吹き閉じておくれ。舞姫たちをもうしばらくとどめておきたい。' },
    13: { first: '<ruby>筑波嶺<rt>つくばね</rt></ruby>の<br><ruby>峰<rt>みね</rt></ruby>より<ruby>落<rt>お</rt></ruby>つる<br>みなの<ruby>川<rt>がわ</rt></ruby>', second: 'こひぞつもりて<br><ruby>淵<rt>ふち</rt></ruby>となりぬる', translation: '筑波山から流れ落ちるみなの川。一滴の雫が集まって川となり淵に溜まるようにあなたへの愛がどんどん大きくなり、淵のように深くなりました。' },
    14: { first: '<ruby>陸奥<rt>みちのく</rt></ruby>の<br>しのぶも<ruby>ぢ<rt>じ</rt></ruby>ずり<br><ruby>誰<rt>たれ</rt></ruby>ゆ<ruby>ゑ<rt>え</rt></ruby>に', second: '<ruby>乱<rt>みだ</rt></ruby>れそめにし<br><ruby>我<rt>われ</rt></ruby>ならなくに', translation: '私の心は陸奥産のしのぶもぢずりの乱れ模様のように乱れてしまった。私のせいではありませんよ。' },
    15: { first: '<ruby>君<rt>きみ</rt></ruby>がため<br><ruby>春<rt>はる</rt></ruby>の<ruby>野<rt>の</rt></ruby>に<ruby>出<rt>い</rt></ruby>でて<br><ruby>若菜<rt>わかな</rt></ruby>つむ', second: 'わが<ruby>衣手<rt>ころもで</rt></ruby>に<br><ruby>雪<rt>ゆき</rt></ruby>は<ruby>降<rt>ふ</rt></ruby>りつつ', translation: 'あなたのために寒い春の野に出て、袖に雪がしんしんと降り続く中で若菜を摘んでいます。' },
    16: { first: '<ruby>立<rt>た</rt></ruby>ち<ruby>別<rt>わか</rt></ruby>れ<br>いなばの<ruby>山<rt>やま</rt></ruby>の<br><ruby>峰<rt>みね</rt></ruby>に<ruby>生<rt>お</rt></ruby><ruby>ふ<rt>う</rt></ruby>る', second: 'まつとし<ruby>聞<rt>き</rt></ruby>かば<br><ruby>今<rt>いま</rt></ruby><ruby>帰<rt>かえ</rt></ruby>りこ<ruby>む<rt>ん</rt></ruby>', translation: '因幡山に生えている松のようにあなたが待っていてくれると言ってくれたらすぐに戻ってきます。' },
    17: { first: 'ちはやぶる<br><ruby>神代<rt>かみよ</rt></ruby>もきかず<br><ruby>竜田川<rt>たつたがわ</rt></ruby>', second: 'から<ruby>紅<rt>くれない</rt></ruby>に<br><ruby>水<rt>みず</rt></ruby>くくるとは', translation: '神話の世界でもこんなに美しい景色はあったであろうか。紅葉が竜田川を唐紅色に絞り染め上げているよ。' },
    18: { first: '<ruby>住<rt>すみ</rt></ruby>の<ruby>江<rt>え</rt></ruby>の<br><ruby>岸<rt>きし</rt></ruby>による<ruby>波<rt>なみ</rt></ruby><br>よるさ<ruby>へ<rt>え</rt></ruby>や', second: '<ruby>夢<rt>ゆめ</rt></ruby>のかよひ<ruby>路<rt>じ</rt></ruby><br><ruby>人目<rt>ひとめ</rt></ruby>よくら<ruby>む<rt>ん</rt></ruby>', translation: '波は住之江の岸に打ち寄せるけれども、あなたは昼間だけでなく、そのうえ夜の夢の通い道さえ人目を避けて、現れてくれないのでしょうか。' },
    19: { first: '<ruby>難波潟<rt>なにわがた</rt></ruby><br>みじかき<ruby>葦<rt>あし</rt></ruby>の<br>ふしのまも', second: '<ruby>逢<rt>あ</rt></ruby><ruby>は<rt>わ</rt></ruby>でこの<ruby>世<rt>よ</rt></ruby>を<br><ruby>過<rt>す</rt></ruby>ぐしてよとや', translation: '難波潟に生えている葦の節と節の間のような短い時間さえ会いたいのにあの人は一生会わずに過ごせと言うのですか。' },
    20: { first: 'わびぬれば<br>いまはたおなじ<br><ruby>難波<rt>なにわ</rt></ruby>なる', second: 'みをつくしても<br><ruby>逢<rt>あ</rt></ruby><ruby>は<rt>わ</rt></ruby><ruby>む<rt>ん</rt></ruby>とぞ<ruby>思<rt>おも</rt></ruby><ruby>ふ<rt>う</rt></ruby>', translation: '会えなくなって、もがき苦しんでいるの今となってはもはや身を捨てたのも同じことです。<br>いっそ難波の海にある澪漂のように身を滅ぼしてもあなたに会いたい。' },
    21: { first: '<ruby>今<rt>いま</rt></ruby>こ<ruby>む<rt>ん</rt></ruby>と<br>い<ruby>ひ<rt>い</rt></ruby>しばかりに<br><ruby>長月<rt>ながつき</rt></ruby>の', second: '<ruby>有明<rt>ありあけ</rt></ruby>の<ruby>月<rt>つき</rt></ruby>を<br><ruby>待<rt>ま</rt></ruby>ち<ruby>出<rt>い</rt></ruby>でつるかな', translation: '今行くとあなたが言うので待っていたら、とうとう9月の有明の月を待ち明かすことになりましたよ。' },
    22: { first: '<ruby>吹<rt>ふ</rt></ruby>くからに<br><ruby>秋<rt>あき</rt></ruby>の<ruby>草木<rt>くさき</rt></ruby>の<br>しをるれば', second: 'むべ<ruby>山風<rt>やまかぜ</rt></ruby>を<br><ruby>嵐<rt>あらし</rt></ruby>とい<ruby>ふ<rt>う</rt></ruby>ら<ruby>む<rt>ん</rt></ruby>', translation: '山から風が吹くと秋の草木はしおれます。なるほど、だから「山」に「風」と書いて嵐と読むのでしょう。' },
    23: { first: '<ruby>月<rt>つき</rt></ruby>みれば<br>ちぢにものこそ<br><ruby>悲<rt>かな</rt></ruby>しけれ', second: 'わが<ruby>身<rt>み</rt></ruby><ruby>一<rt>ひと</rt></ruby>つの<br><ruby>秋<rt>あき</rt></ruby>にはあらねど', translation: '月を見るとあれこれと悲しくなります。私ひとりだけに訪れた秋ではないのですが。' },
    24: { first: 'このたびは<br><ruby>幣<rt>ぬさ</rt></ruby>もとりあ<ruby>へ<rt>え</rt></ruby>ず<br><ruby>手向山<rt>たむけやま</rt></ruby>', second: 'もみぢのにしき<br><ruby>神<rt>かみ</rt></ruby>のまにまに', translation: '今回の旅は急のことで、幣をご用意できませんでした。神が祀られている山の美しい紅葉を捧げるので、御心のままにお受け取りください。' },
    25: { first: '<ruby>名<rt>な</rt></ruby>にし<ruby>負<rt>お</rt></ruby>はば<br><ruby>逢坂山<rt>おうさかやま</rt></ruby>の<br>さねか<ruby>づ<rt>ず</rt></ruby>ら', second: '<ruby>人<rt>ひと</rt></ruby>にしられで<br>くるよしもがな', translation: '逢坂山の「さねかずら」。その名前どおりであるならば、さねかずらのつるにあなたを絡ませて手繰り寄せ、人に知られないで逢瀬できたらいいのにと思う。' },
    26: { first: '<ruby>小倉山<rt>おぐらやま</rt></ruby><br><ruby>峰<rt>みね</rt></ruby>のもみ<ruby>ぢ<rt>じ</rt></ruby><ruby>葉<rt>は</rt></ruby><br><ruby>心<rt>こころ</rt></ruby>あらば', second: '<ruby>今<rt>いま</rt></ruby>ひとたびの<br>みゆき<ruby>待<rt>ま</rt></ruby>たな<ruby>む<rt>ん</rt></ruby>', translation: '小倉山のもみぢ葉よ。心あらばもう一度の行幸まで散らずに待っていてほしい。' },
    27: { first: 'みかの<ruby>原<rt>はら</rt></ruby><br>わきて<ruby>流<rt>なが</rt></ruby>るる<br>い<ruby>づ<rt>ず</rt></ruby>み<ruby>川<rt>がわ</rt></ruby>', second: 'いつ<ruby>見<rt>み</rt></ruby>きとてか<br><ruby>恋<rt>こい</rt></ruby>しかるら<ruby>む<rt>ん</rt></ruby>', translation: 'みかの原を分けるように湧き出て流れるいづみ川。あなたにいつお会いしたからといってこれほどまでに恋しいのでしょう。' },
    28: { first: '<ruby>山里<rt>やまざと</rt></ruby>は<br><ruby>冬<rt>ふゆ</rt></ruby>ぞさびしさ<br>まさりける', second: '<ruby>人目<rt>ひとめ</rt></ruby>も<ruby>草<rt>くさ</rt></ruby>も<br>かれぬと<ruby>思<rt>おも</rt></ruby><ruby>へ<rt>え</rt></ruby>ば', translation: '山里は寂しいものですが、冬は一段と寂しい。訪れてくれる人もいないし、草木も枯れてしまうと思うと。' },
    29: { first: '<ruby>心当<rt>こころあ</rt></ruby>てに<br><ruby>折<rt>お</rt></ruby>らばや<ruby>折<rt>お</rt></ruby>ら<ruby>む<rt>ん</rt></ruby><br><ruby>初霜<rt>はつしも</rt></ruby>の', second: 'おきまど<ruby>は<rt>わ</rt></ruby>せる<br><ruby>白菊<rt>しらぎく</rt></ruby>の<ruby>花<rt>はな</rt></ruby>', translation: '心して手折ろうして折れるものだろうか。初霜が降りて、見分けにくくなっているほど真っ白で美しい幻想的な白菊の花を。' },
    30: { first: '<ruby>有明<rt>ありあけ</rt></ruby>の<br>つれなく<ruby>見<rt>み</rt></ruby>えし<br><ruby>別<rt>わか</rt></ruby>れより', second: 'あかつきばかり<br><ruby>憂<rt>う</rt></ruby>きものはなし', translation: 'あなたとの別れを惜しんで帰る道、有明の月はそしらぬ顔をしていました。それときからというもの暁の時間になるとつらく感じてしまいます。' },
    31: { first: '<ruby>朝<rt>あさ</rt></ruby>ぼらけ<br><ruby>有明<rt>ありあけ</rt></ruby>の<ruby>月<rt>つき</rt></ruby>と<br><ruby>見<rt>み</rt></ruby>るまでに', second: '<ruby>吉野<rt>よしの</rt></ruby>の<ruby>里<rt>さと</rt></ruby>に<br><ruby>降<rt>ふ</rt></ruby>れる<ruby>白雪<rt>しらゆき</rt></ruby>', translation: '夜がぼんやり明ける頃、吉野の里に有明の月かと思うほど明るい白雪が降り続いている。' },
    32: { first: '<ruby>山川<rt>やまがわ</rt></ruby>に<br><ruby>風<rt>かぜ</rt></ruby>のかけたる<br>しがらみは', second: '<ruby>流<rt>なが</rt></ruby>れもあ<ruby>へ<rt>え</rt></ruby>ぬ<br><ruby>紅葉<rt>もみじ</rt></ruby>なりけり', translation: '山川に風がかけたしがらみだと思ったら紅葉が流れきらずにたまっていたのだなあ。' },
    33: { first: '<ruby>久方<rt>ひさかた</rt></ruby>の<br><ruby>光<rt>ひかり</rt></ruby>のどけき<br><ruby>春<rt>はる</rt></ruby>の<ruby>日<rt>ひ</rt></ruby>に', second: 'しづ<ruby>心<rt>こころ</rt></ruby>なく<br><ruby>花<rt>はな</rt></ruby>の<ruby>散<rt>ち</rt></ruby>るら<ruby>む<rt>ん</rt></ruby>', translation: 'うららかな春の日に桜の花はどうしてせわしなく散ってしまうのでしょう。' },
    34: { first: '<ruby>誰<rt>たれ</rt></ruby>をかも<br><ruby>知<rt>し</rt></ruby>る<ruby>人<rt>ひと</rt></ruby>にせ<ruby>む<rt>ん</rt></ruby><br><ruby>高砂<rt>たかさご</rt></ruby>の', second: '<ruby>松<rt>まつ</rt></ruby>も<ruby>昔<rt>むかし</rt></ruby>の<br><ruby>友<rt>とも</rt></ruby>ならなくに', translation: '誰を心を通わせられる友にしたらいいのだろう。長く生きている高砂の松も、昔からの友ではないし。' },
    35: { first: '<ruby>人<rt>ひと</rt></ruby>はいさ<br><ruby>心<rt>こころ</rt></ruby>も<ruby>知<rt>し</rt></ruby>らず<br>ふるさとは', second: '<ruby>花<rt>はな</rt></ruby>ぞ<ruby>昔<rt>むかし</rt></ruby>の<br><ruby>香<rt>か</rt></ruby>に<ruby>匂<rt>にお</rt></ruby><ruby>ひ<rt>い</rt></ruby>ける', translation: '人の心は変わってしまうものですから、あなたの気持ちもわかりませんね。ふるさとでは、梅の花がかつてと同じように美しく咲き、香りを漂わせていますよ。' },
    36: { first: '<ruby>夏<rt>なつ</rt></ruby>の<ruby>夜<rt>よ</rt></ruby>は<br>まだ<ruby>宵<rt>よい</rt></ruby>ながら<br>あけぬるを', second: '<ruby>雲<rt>くも</rt></ruby>のいづこに<br><ruby>月<rt>つき</rt></ruby>やどるら<ruby>む<rt>ん</rt></ruby>', translation: '夏の夜というものは短く、まだ宵のうちだと思ってる間に夜が明けてしまった。月は雲のどのあたりに宿をとっているのだろう。' },
    37: { first: '<ruby>白露<rt>しらつゆ</rt></ruby>に<br><ruby>風<rt>かぜ</rt></ruby>の<ruby>吹<rt>ふ</rt></ruby>きしく<br><ruby>秋<rt>あき</rt></ruby>の<ruby>野<rt>の</rt></ruby>は', second: 'つらぬきとめぬ<br><ruby>玉<rt>たま</rt></ruby>ぞ<ruby>散<rt>ち</rt></ruby>りける', translation: '風がしきりに秋の野に吹きつけて糸を通して留めていない玉のように飛び散っているのだなあ。' },
    38: { first: '<ruby>忘<rt>わす</rt></ruby>らるる<br><ruby>身<rt>み</rt></ruby>をば<ruby>思<rt>おも</rt></ruby>はず<br><ruby>誓<rt>ちか</rt></ruby>ひてし', second: '<ruby>人<rt>ひと</rt></ruby>の<ruby>命<rt>いのち</rt></ruby>の<br><ruby>惜<rt>お</rt></ruby>しくもあるかな', translation: '忘れ去られる私は構わないのですが、私を愛すると神に誓ったあなたが神罰によって命を落とさないか案じております。' },
    39: { first: '<ruby>浅茅生<rt>あさじう</rt></ruby>の<br><ruby>小野<rt>おの</rt></ruby>の<ruby>篠原<rt>しのはら</rt></ruby><br>しのぶれど', second: 'あまりてなどか<br><ruby>人<rt>ひと</rt></ruby>の<ruby>恋<rt>こい</rt></ruby>しき', translation: '丈の低い茅の野原に生い茂る篠竹の中に私はあなたへの恋心を隠してきました。しかし、どうしてこれほどまでにあなたを恋しいのでしょうか。' },
    40: { first: '<ruby>忍<rt>しの</rt></ruby>ぶれど<br><ruby>色<rt>いろ</rt></ruby>に<ruby>出<rt>い</rt></ruby>でにけり<br><ruby>我<rt>わ</rt></ruby>が<ruby>恋<rt>こい</rt></ruby>は', second: '<ruby>物<rt>もの</rt></ruby>や<ruby>思<rt>おも</rt></ruby>ふと<br><ruby>人<rt>ひと</rt></ruby>の<ruby>問<rt>と</rt></ruby><ruby>ふ<rt>う</rt></ruby>まで', translation: '気づかれないように恋心を秘めてきましたが、顔色に出てしまっていたようです。人から物思いをしているのではないかと聞かれるまでに。' },
    41: { first: '<ruby>恋<rt>こい</rt></ruby>す<ruby>てふ<rt>ちょう</rt></ruby><br><ruby>我<rt>わ</rt></ruby>が<ruby>名<rt>な</rt></ruby>はまだき<br><ruby>立<rt>た</rt></ruby>ちにけり', second: '<ruby>人<rt>ひと</rt></ruby>しれずこそ<br><ruby>思<rt>おも</rt></ruby><ruby>ひ<rt>い</rt></ruby>そめしか', translation: '恋をしているという噂が広まってしまった。気づかれないように密かに想い始めたばかりなのに。' },
    42: { first: '<ruby>契<rt>ちぎ</rt></ruby>りきな<br>かたみに<ruby>袖<rt>そで</rt></ruby>を<br>しぼりつつ', second: '<ruby>末<rt>すえ</rt></ruby>の<ruby>松山<rt>まつやま</rt></ruby><br><ruby>波<rt>なみ</rt></ruby>こさじとは', translation: '約束しましたよね。涙に濡れた着物の袖を絞りながら、末の松山を波が決して越えないように私たちは変わらないと。' },
    43: { first: '<ruby>逢<rt>あ</rt></ruby><ruby>ひ<rt>い</rt></ruby><ruby>見<rt>み</rt></ruby>ての<br>のちの<ruby>心<rt>こころ</rt></ruby>に<br>くらぶれば', second: '<ruby>昔<rt>むかし</rt></ruby>は<ruby>物<rt>もの</rt></ruby>を<br><ruby>思<rt>おも</rt></ruby><ruby>は<rt>わ</rt></ruby>ざりけり', translation: '逢って契りを結んだ後の気持ちと比べてみたら、逢う前の物思いなんて恋のうちにも入らない。' },
    44: { first: '<ruby>逢<rt>あ</rt></ruby><ruby>ふ<rt>う</rt></ruby>ことの<br><ruby>絶<rt>た</rt></ruby>えてしなくは<br>なかなかに', second: '<ruby>人<rt>ひと</rt></ruby>をも<ruby>身<rt>み</rt></ruby>をも<br><ruby>恨<rt>うら</rt></ruby>みざらまし', translation: 'もし逢うことが全くないなら、あの人のつれなさも、我が身のいたらなさも恨まずに済んだのに。' },
    45: { first: 'あ<ruby>は<rt>わ</rt></ruby>れとも<br>い<ruby>ふ<rt>う</rt></ruby>べき人は<br><ruby>思<rt>おも</rt></ruby><ruby>ほ<rt>お</rt></ruby>えで', second: '<ruby>身<rt>み</rt></ruby>のいた<ruby>づ<rt>ず</rt></ruby>らに<br>なりぬべきかな', translation: '私に同情してくれそうな人は思い浮かばない。あなたに捨てられて私はむなしく死んでいくのでしょう。' },
    46: { first: '<ruby>由良<rt>ゆら</rt></ruby>のとを<br><ruby>渡<rt>わた</rt></ruby>る<ruby>舟人<rt>ふなびと</rt></ruby><br>か<ruby>ぢ<rt>じ</rt></ruby>を<ruby>絶<rt>た</rt></ruby>え', second: 'ゆくへも<ruby>知<rt>し</rt></ruby>らぬ<br><ruby>恋<rt>こい</rt></ruby>の<ruby>道<rt>みち</rt></ruby>かな', translation: '由良の河口を渡る船人が、櫂をなくして漂うように私の恋もどうなるかわかりません。' },
    47: { first: '<ruby>八重葎<rt>やえむぐら</rt></ruby><br>しげれる<ruby>宿<rt>やど</rt></ruby>の<br>さびしきに', second: '<ruby>人<rt>ひと</rt></ruby>こそ<ruby>見<rt>み</rt></ruby>えね<br><ruby>秋<rt>あき</rt></ruby>は<ruby>来<rt>き</rt></ruby>にけり', translation: '雑草が生い茂る荒廃した家は寂しく人が来ることはありませんが、秋はたしかにやって来たのですね。' },
    48: { first: '<ruby>風<rt>かぜ</rt></ruby>をいたみ<br><ruby>岩<rt>いわ</rt></ruby>うつ<ruby>波<rt>なみ</rt></ruby>の<br>おのれのみ', second: 'くだけて<ruby>物<rt>もの</rt></ruby>を<br><ruby>思<rt>おも</rt></ruby><ruby>ふ<rt>う</rt></ruby>ころかな', translation: '風が激しく吹くので、岩を打ち寄せる波がおのれ一人で砕けるように、私の心だけが砕かれて、物思いをするこの頃ですよ。' },
    49: { first: '<ruby>御垣守<rt>みかきもり</rt></ruby><br><ruby>衛士<rt>えじ</rt></ruby>のたく<ruby>火<rt>ひ</rt></ruby>の<br><ruby>夜<rt>よる</rt></ruby>はもえ', second: '<ruby>昼<rt>ひる</rt></ruby>は<ruby>消<rt>き</rt></ruby>えつつ<br><ruby>物<rt>もの</rt></ruby>をこそ<ruby>思<rt>おも</rt></ruby><ruby>へ<rt>え</rt></ruby>', translation: '警護の兵士が燃やす<ruby>篝火<rt>かがりび</rt></ruby>が、夜は燃えて昼は消えているように、私の恋心は夜に燃え、昼は消え入るように物思いに沈んでいます。' },
    50: { first: '<ruby>君<rt>きみ</rt></ruby>がため<br><ruby>惜<rt>お</rt></ruby>しからざりし<br>いのちさ<ruby>へ<rt>え</rt></ruby>', second: '<ruby>長<rt>なが</rt></ruby>くもがなと<br><ruby>思<rt>おも</rt></ruby><ruby>ひ<rt>い</rt></ruby>けるかな', translation: 'あなたに逢うためなら惜しくないと思った命ですが、あなたと出会って少しでも長生きしたいと思うようになりましたよ。' },
    51: { first: 'かくとだに<br>えやはいぶきの<br>さしも<ruby>草<rt>ぐさ</rt></ruby>', second: 'さしも<ruby>知<rt>し</rt></ruby>らじな<br>もゆる<ruby>思<rt>おも</rt></ruby><ruby>ひ<rt>い</rt></ruby>を', translation: 'あなたにこんなに恋焦がれていると言えるでしょうか。いえ言えませんね。伊吹山のさしも草ではありませんが、それほどまでとはご存知ないでしょう。私の（お灸のように熱い）燃える想いを。' },
    52: { first: '明けぬれば<br><ruby>暮<rt>く</rt></ruby>るるものとは<br><ruby>知<rt>く</rt></ruby>りながら', second: 'な<ruby>ほ<rt>お</rt></ruby>うらめしき<br><ruby>朝<rt>あさ</rt></ruby>ぼらけかな', translation: '夜が明けてしまえばあまたに会えるのはまた日が暮れるまで待たなければなりません。朝ぼらけが恨めしく感じられます。' },
    53: { first: '<ruby>嘆<rt>なげ</rt></ruby>きつつ<br>ひとり<ruby>寝<rt>ぬ</rt></ruby>る<ruby>夜<rt>よ</rt></ruby>の<br><ruby>明<rt>あ</rt></ruby>くる<ruby>間<rt>ま</rt></ruby>は', second: 'いかに<ruby>久<rt>ひさ</rt></ruby>しき<br>ものとかは<ruby>知<rt>し</rt></ruby>る', translation: 'あなたが来なくて嘆きながら一人で寝る夜。その夜を明かすまでの時間がどれほど長いかわかりますか。' },
    54: { first: '<ruby>忘<rt>わす</rt></ruby>れじの<br>ゆく<ruby>末<rt>すえ</rt></ruby>までは<br>かたければ', second: '<ruby>今日<rt>きょう</rt></ruby>を<ruby>限<rt>かぎ</rt></ruby>りの<br><ruby>命<rt>いのち</rt></ruby>ともがな', translation: '「ずっと忘れない」という言葉は難しい約束でしょうから、その言葉を聞いた今日限りの命だったらいいのにと思ってしまいます。' },
    55: { first: '<ruby>滝<rt>たき</rt></ruby>の<ruby>音<rt>おと</rt></ruby>は<br>たえて<ruby>久<rt>ひさ</rt></ruby>しく<br>なりぬれど', second: '<ruby>名<rt>な</rt></ruby>こそ<ruby>流<rt>なが</rt></ruby>れて<br>な<ruby>ほ<rt>お</rt></ruby><ruby>聞<rt>き</rt></ruby>こえけれ', translation: '滝の音が聞こえなくなってから久しくなりますが、その名声は今も流れ伝わっています。' },
    56: { first: 'あらざら<ruby>む<rt>ん</rt></ruby><br>この<ruby>世<rt>よ</rt></ruby>のほかの<br><ruby>思<rt>おも</rt></ruby><ruby>ひ<rt>い</rt></ruby><ruby>出<rt>で</rt></ruby>に', second: 'いまひとたびの<br><ruby>逢<rt>お</rt></ruby><ruby>ふ<rt>う</rt></ruby>こともがな', translation: 'もうすぐ私はこの世を去ってしまうことでしょう。あの世へ持っていく思い出に、もう一度あなたにお会いしたいものです。' },
    57: { first: 'めぐり<ruby>逢<rt>あ</rt></ruby><ruby>ひ<rt>い</rt></ruby>て<br><ruby>見<rt>み</rt></ruby>しやそれとも<br>わかぬ<ruby>間<rt>ま</rt></ruby>に', second: '<ruby>雲隠<rt>くもがく</rt></ruby>れにし<br><ruby>夜半<rt>よわ</rt></ruby>の<ruby>月<rt>つき</rt></ruby>かな', translation: '久しぶりにめぐり会って、それが誰かわからないうちにあなたは雲に隠れる夜半の月のように帰ってしまった。' },
    58: { first: 'ありま<ruby>山<rt>やま</rt></ruby><br><ruby>猪名<rt>いな</rt></ruby>の<ruby>笹原<rt>ささはら</rt></ruby><br><ruby>風<rt>かぜ</rt></ruby><ruby>吹<rt>ふ</rt></ruby>けば', second: 'いでそよ<ruby>人<rt>ひと</rt></ruby>を<br><ruby>忘<rt>わす</rt></ruby>れやはする', translation: '有馬山に近い猪名の笹原に風が吹きそよそよと音が響きわたります。さぁそうですよ。私があなたのことを忘れられるでしょうか。いいえ忘れられません。' },
    59: { first: 'やすら<ruby>は<rt>わ</rt></ruby>で<br><ruby>寝<rt>ね</rt></ruby>なましものを<br><ruby>小夜<rt>さよ</rt></ruby><ruby>更<rt>ふ</rt></ruby>けて', second: 'かたぶくまでの<br><ruby>月<rt>つき</rt></ruby>を<ruby>見<rt>み</rt></ruby>しかな', translation: 'あなたが来ないと分かっていたなら、ためらわずに眠りについたでしょうに。待ち続けるうちに夜が更けて、西の空に傾く月を見上げることになってしまったのです。' },
    60: { first: '<ruby>大江山<rt>おおえやま</rt></ruby><br>いく<ruby>野<rt>の</rt></ruby>の<ruby>道<rt>みち</rt></ruby>の<br><ruby>遠<rt>とお</rt></ruby>ければ', second: 'まだふみもみず<br><ruby>天<rt>あま</rt></ruby>の<ruby>橋立<rt>はしだて</rt></ruby>', translation: '大江山も（母の住む丹後に行く）生野の道も遠いので、まだ天橋立の地に足を踏み入れたこともありませんし、母からの手紙も見ておりません。' },
    61: { first: 'いにし<ruby>へ<rt>え</rt></ruby>の<br><ruby>奈良<rt>なら</rt></ruby>の<ruby>都<rt>みやこ</rt></ruby>の<br><ruby>八重桜<rt>やえざくら</rt></ruby>', second: '<ruby>けふ<rt>きょう</rt></ruby><ruby>九重<rt>ここのえ</rt></ruby>に<br><ruby>匂<rt>にお</rt></ruby><ruby>ひ<rt>い</rt></ruby>ぬるかな', translation: '古都奈良で咲き誇っていた八重桜が、今は京都の宮中で美しく咲き誇っていますよ。' },
    62: { first: '<ruby>夜<rt>よ</rt></ruby>をこめて<br><ruby>鳥<rt>とり</rt></ruby>のそらねは<br>はかるとも', second: 'よに<ruby>逢坂<rt>おうさか</rt></ruby>の<br><ruby>関<rt>せき</rt></ruby>は<ruby>許<rt>ゆる</rt></ruby>さじ', translation: '夜が明けないうちに、鶏の鳴き真似をして人をだまそうとしても、この逢坂の関は決して開きませんよ。' },
    63: { first: 'いまはただ<br><ruby>思<rt>おも</rt></ruby>ひ<ruby>絶<rt>た</rt></ruby>えな<ruby>む<rt>ん</rt></ruby><br>とばかりを', second: '<ruby>人<rt>ひと</rt></ruby>づてならで<br><ruby>言<rt>い</rt></ruby><ruby>ふ<rt>う</rt></ruby>よしもがな', translation: '逢うことが許されなくなった今となっては「あなたへの思いをあきらめましょう」とせめて人づてでなく、直接伝えられる方法があったらよいのに。' },
    64: { first: '<ruby>朝<rt>あさ</rt></ruby>ぼらけ<br><ruby>宇治<rt>うじ</rt></ruby>の<ruby>川霧<rt>かわぎり</rt></ruby><br><ruby>絶<rt>た</rt></ruby>え<ruby>絶<rt>だ</rt></ruby>えに', second: 'あら<ruby>は<rt>わ</rt></ruby>れわたる<br><ruby>瀬々<rt>せぜ</rt></ruby>の<ruby>網代木<rt>あじろぎ</rt></ruby>', translation: '夜がほんのり明けてくる頃、宇治川の朝霧が途切れ途切れになり、霧の絶え間のあちこちから現れわたる瀬々の網代木よ。' },
    65: { first: '<ruby>恨<rt>うら</rt></ruby>みわび<br>ほさぬ<ruby>袖<rt>そで</rt></ruby>だに<br>あるものを', second: '<ruby>恋<rt>こい</rt></ruby>にくちな<ruby>む<rt>ん</rt></ruby><br><ruby>名<rt>な</rt></ruby>こそをしけれ', translation: '恨む気力さえなくなり、涙に濡れて乾かすひまさえない着物の袖も残念ですが、もっと残念に感じるのは、この恋のせいで浮名が立って私の評判が朽ちてしまうことです。' },
    66: { first: 'もろともに<br>あ<ruby>は<rt>わ</rt></ruby>れと<ruby>思<rt>おも</rt></ruby><ruby>へ<rt>え</rt></ruby><br><ruby>山桜<rt>やまざくら</rt></ruby>', second: '<ruby>花<rt>はな</rt></ruby>よりほかに<br><ruby>知<rt>し</rt></ruby>る<ruby>人<rt>ひと</rt></ruby>もなし', translation: '私が懐かしく思うように、私を思っておくれ山桜よ。心を通い合わせられる相手は他にいないのだから。' },
    67: { first: '<ruby>春<rt>はる</rt></ruby>の<ruby>夜<rt>よ</rt></ruby>の<br><ruby>夢<rt>ゆめ</rt></ruby>ばかりなる<br><ruby>手枕<rt>たまくら</rt></ruby>に', second: 'か<ruby>ひ<rt>い</rt></ruby>なく<ruby>立<rt>た</rt></ruby>た<ruby>む<rt>ん</rt></ruby><br><ruby>名<rt>な</rt></ruby>こそをしけれ', translation: '春の夜の夢のような短い間でも、あなたの手枕は要りません。変な評判が立ったら困りますから。' },
    68: { first: '<ruby>心<rt>こころ</rt></ruby>にも<br>あらで<ruby>憂<rt>う</rt></ruby>き<ruby>世<rt>よ</rt></ruby>に<br>ながら<ruby>へ<rt>え</rt></ruby>ば', second: '<ruby>恋<rt>こい</rt></ruby>しかるべき<br><ruby>夜半<rt>よわ</rt></ruby>の<ruby>月<rt>つき</rt></ruby>かな', translation: 'こんな人生は生きたくなかったが、このつらい世を生き長らえたら、この夜更けの月を恋しく思い出すだろう。' },
    69: { first: '<ruby>嵐<rt>あらし</rt></ruby><ruby>吹<rt>ふ</rt></ruby>く<br><ruby>三室<rt>みむろ</rt></ruby>の<ruby>山<rt>やま</rt></ruby>の<br><ruby>紅葉<rt>もみじ</rt></ruby><ruby>葉<rt>ば</rt></ruby>は', second: '<ruby>竜田<rt>たつた</rt></ruby>の<ruby>川<rt>かわ</rt></ruby>の<br><ruby>錦<rt>にしき</rt></ruby>なりけり', translation: '嵐で吹き散った三室山のもみじが龍田川の川面をまるで錦織物のように美しく彩っているよ。' },
    70: { first: 'さびしさに<br><ruby>宿<rt>やど</rt></ruby>を<ruby>立<rt>た</rt></ruby>ち<ruby>出<rt>い</rt></ruby>でて<br>ながむれば', second: 'い<ruby>づ<rt>ず</rt></ruby>くも<ruby>同<rt>おな</rt></ruby>じ<br><ruby>秋<rt>あき</rt></ruby>の<ruby>夕<rt>ゆう</rt></ruby><ruby>暮<rt>ぐれ</rt></ruby>', translation: '寂しさに耐えかねて庵から出てみたけれど、どこも同じように寂しい秋の夕暮れだ。' },
    71: { first: '<ruby>夕<rt>ゆう</rt></ruby>されば<br><ruby>門田<rt>かどた</rt></ruby>の<ruby>稲葉<rt>いなば</rt></ruby><br>おと<ruby>づ<rt>ず</rt></ruby>れて', second: '<ruby>蘆<rt>あし</rt></ruby>のまろやに<br><ruby>秋風<rt>あきかぜ</rt></ruby>ぞ<ruby>吹<rt>ふ</rt></ruby>く', translation: '夕方になると、門前の稲の葉は音を立て、葦葺きのこの庵には秋風が吹きつけてきた。' },
    72: { first: '<ruby>音<rt>おと</rt></ruby>に<ruby>聞<rt>き</rt></ruby>く<br><ruby>高師<rt>たかし</rt></ruby>の<ruby>浜<rt>はま</rt></ruby>の<br>あだ<ruby>波<rt>なみ</rt></ruby>は', second: 'かけじや<ruby>袖<rt>そで</rt></ruby>の<br>ぬれもこそすれ', translation: '噂に聞くいたずらに立ち騒ぐ高師の浜の波にかからないようにしましょう。袖を濡らしたくありません。' },
    73: { first: '<ruby>高砂<rt>たかさご</rt></ruby>の<br><ruby>尾<rt>お</rt></ruby>の<ruby>上<rt>へ</rt></ruby>の<ruby>桜<rt>さくら</rt></ruby><br><ruby>咲<rt>さ</rt></ruby>きにけり', second: '<ruby>外山<rt>とやま</rt></ruby>の<ruby>霞<rt>かすみ</rt></ruby><br><ruby>立<rt>た</rt></ruby>たずもあらな<ruby>む<rt>ん</rt></ruby>', translation: '高い山の尾根に美しい桜が咲いたようだ。人里近くの山の霞よ、どうか立たないでほしい。美しい桜が見たいから。' },
    74: { first: '<ruby>憂<rt>う</rt></ruby>かりける<br><ruby>人<rt>ひと</rt></ruby>を<ruby>初瀬<rt>はつせ</rt></ruby>の<br><ruby>山<rt>やま</rt></ruby>おろしよ', second: 'はげしかれとは<br><ruby>祈<rt>いの</rt></ruby>らぬものを', translation: 'つれないあの人が私になびくように初瀬の観音様に祈りこそしましたが、初瀬の山おろしよ。お前のように冷たく激しくなれとは祈ってもいないのに。' },
    75: { first: '<ruby>契<rt>ちぎ</rt></ruby>りおきし<br>させもが<ruby>露<rt>つゆ</rt></ruby>を<br>いのちにて', second: 'あ<ruby>は<rt>わ</rt></ruby>れ<ruby>今年<rt>ことし</rt></ruby>の<br><ruby>秋<rt>あき</rt></ruby>もいぬめり', translation: '約束してくださった「さしも草の」の歌の露のようなありがたい言葉を命のように大切にしていたのに。ああ…今年の秋もむなしく過ぎていくようだ。' },
    76: { first: 'わたの<ruby>原<rt>はら</rt></ruby><br>こぎいでてみれば<br><ruby>久方<rt>ひさかた</rt></ruby>の', second: '<ruby>雲<rt>くも</rt></ruby><ruby>居<rt>い</rt></ruby>にま<ruby>が<rt>ご</rt></ruby><ruby>ふ<rt>う</rt></ruby><br><ruby>沖<rt>おき</rt></ruby>つ<ruby>白波<rt>しらなみ</rt></ruby>', translation: '大海原に漕ぎ出してみれば、彼方向こうの沖に白波が雲のように立っていたよ。' },
    77: { first: '<ruby>瀬<rt>せ</rt></ruby>をはやみ<br><ruby>岩<rt>いわ</rt></ruby>にせかるる<br><ruby>滝川<rt>たきがわ</rt></ruby>の', second: 'われても<ruby>末<rt>すえ</rt></ruby>に<br>あ<ruby>は<rt>わ</rt></ruby><ruby>む<rt>ん</rt></ruby>とぞ<ruby>思<rt>おも</rt></ruby><ruby>ふ<rt>う</rt></ruby>', translation: '川瀬の流れが早く、岩にせきとめられた滝川が割れてもまた合流するように、あなたと別れてもいつかはまた会いたい。' },
    78: { first: '<ruby>淡路島<rt>あわじしま</rt></ruby><br>かよ<ruby>ふ<rt>う</rt></ruby><ruby>千鳥<rt>ちどり</rt></ruby>の<br><ruby>鳴<rt>な</rt></ruby>く<ruby>声<rt>こえ</rt></ruby>に', second: '<ruby>幾夜<rt></rt></ruby><ruby>寝覚<rt>ねざ</rt></ruby>めぬ<br><ruby>須磨<rt>すま</rt></ruby>の<ruby>関守<rt>せきもり</rt></ruby>', translation: '淡路島から渡ってくる千鳥の鳴き声に、須磨の関守は幾夜目を覚ませられただろう。' },
    79: { first: '<ruby>秋風<rt>あきかぜ</rt></ruby>に<br>たなびく<ruby>雲<rt>くも</rt></ruby>の<br>たえ<ruby>間<rt>ま</rt></ruby>より', second: 'もれい<ruby>づ<rt>ず</rt></ruby>る<ruby>月<rt>つき</rt></ruby>の<br><ruby>影<rt>かげ</rt></ruby>のさやけさ', translation: '秋風にたなびく雲の切れ目から、こぼれ落ちる月の光が何と明るく澄んでいることか。' },
    80: { first: '<ruby>長<rt>なが</rt></ruby>から<ruby>む<rt>ん</rt></ruby><br><ruby>心<rt>こころ</rt></ruby>もしらず<br><ruby>黒髪<rt>くろがみ</rt></ruby>の', second: 'みだれてけさは<br><ruby>物<rt>もの</rt></ruby>をこそ<ruby>思<rt>おも</rt></ruby><ruby>へ<rt>え</rt></ruby>', translation: '末永く愛してくれるとあなたは言うけれど、心変わりするのではと気にかかって仕方がありません。お別れした今朝の私はこの黒髪のように心が乱れ、物思いに沈んでいます。' },
    81: { first: 'ほととぎす<br><ruby>鳴<rt>な</rt></ruby>きつる<ruby>方<rt>かた </rt></ruby>を<br>ながむれば', second: 'ただ<ruby>有明<rt>ありあけ</rt></ruby>の<br><ruby>月<rt>つき</rt></ruby>ぞ<ruby>残<rt>のこ</rt></ruby>れる', translation: 'ほととぎすが鳴いた方を眺めてみたけれど、姿は見えませんでした。ただほの白い月が残っていました。' },
    82: { first: '<ruby>思<rt>おも</rt></ruby><ruby>ひ<rt>い</rt></ruby>わび<br>さても<ruby>命<rt>いのち</rt></ruby>は<br>あるものを', second: '<ruby>憂<rt>う</rt></ruby>きにた<ruby>へ<rt>え</rt></ruby>ぬは<br><ruby>涙<rt>なみだ</rt></ruby>なりけり', translation: '嘆き悲しんでいながら生きているけれども、つらい思いに絶えきれないのは涙であった。' },
    83: { first: '<ruby>世<rt>よ</rt></ruby>の<ruby>中<rt>なか</rt></ruby>よ<br><ruby>道<rt>みち</rt></ruby>こそなけれ<br><ruby>思<rt>おも</rt></ruby><ruby>ひ<rt>い</rt></ruby><ruby>入<rt>い</rt></ruby>る', second: '<ruby>山<rt>やま</rt></ruby>の<ruby>奥<rt>おく</rt></ruby>にも<br><ruby>鹿<rt>しか</rt></ruby>ぞ<ruby>鳴<rt>な</rt></ruby>くなる', translation: 'つらい世の中から逃れる方法はないようだ。思い詰めて分け入ったこの山の中でさえ、哀しげに鳴く鹿の声が聞こえてくる。' },
    84: { first: '<ruby>長<rt>なが</rt></ruby>ら<ruby>へ<rt>え</rt></ruby>ば<br>またこのごろや<br>しのばれ<ruby>む<rt>ん</rt></ruby>', second: '<ruby>憂<rt>う</rt></ruby>しと<ruby>見<rt>み</rt></ruby>し<ruby>世<rt>よ</rt></ruby>ぞ<br><ruby>今<rt>いま</rt></ruby>は<ruby>恋<rt>こい</rt></ruby>しき', translation: '長く生きながらえたら、今を懐かしく思うだろう。つらいと思った世が今では懐かしく思えるのだから。' },
    85: { first: '<ruby>夜<rt>よ</rt></ruby>もすがら<br><ruby>物<rt>もの</rt></ruby><ruby>思<rt>おも</rt></ruby><ruby>ふ<rt>う</rt></ruby>ころは<br><ruby>明<rt>あ</rt></ruby>けやらで', second: '<ruby>閨<rt>ねや</rt></ruby>のひまさ<ruby>へ<rt>え</rt></ruby><br>つれなかりけり', translation: '一晩中、恋に思い悩んでいるこの頃は、いつまでも夜が明けないので、一向に光が差し込まない寝室の隙間さえも無情に感じられる。' },
    86: { first: '<ruby>嘆<rt>なげ</rt></ruby>けとて<br><ruby>月<rt>つき</rt></ruby>やは<ruby>物<rt>もの</rt></ruby>を<br><ruby>思<rt>おも</rt></ruby><ruby>は<rt>わ</rt></ruby>する', second: 'かこち<ruby>顔<rt>がお</rt></ruby>なる<br>わが<ruby>涙<rt>なみだ</rt></ruby>かな', translation: '嘆きなさいと月が私に物思いをさせるだろうか。そうではない。月のせいにするかのように流れる私の涙かな。' },
    87: { first: '<ruby>村雨<rt>むらさめ</rt></ruby>の<br><ruby>露<rt>つゆ</rt></ruby>もまだひぬ<br>まきの<ruby>葉<rt>は</rt></ruby>に', second: '<ruby>霧<rt>きり</rt></ruby>たちのぼる<br><ruby>秋<rt>あき</rt></ruby>の<ruby>夕<rt>ゆう</rt></ruby><ruby>暮<rt>ぐれ</rt></ruby>', translation: 'にわか雨の後にまだその滴が乾いていないまきの葉のあたりに、霧が立ち上る秋の夕暮れ。' },
    88: { first: '<ruby>難波江<rt>なにわえ</rt></ruby>の<br><ruby>葦<rt>あし</rt></ruby>のかりねの<br>ひとよゆ<ruby>ゑ<rt>え</rt></ruby>', second: 'みをつくしてや<br><ruby>恋<rt>こ</rt></ruby><ruby>ひ<rt>い</rt></ruby>わたるべき', translation: '難波の入り江に生えている葦を刈った根の短い一節ではありませんが、たった一晩かりそめに共寝をしたために、私はあなたに身を尽くし、恋い慕わなくてはいけないのでしょうか。' },
    89: { first: '<ruby>玉<rt>たま</rt></ruby>の<ruby>緒<rt>お</rt></ruby>よ<br><ruby>絶<rt>た</rt></ruby>えなば<ruby>絶<rt>た</rt></ruby>えね<br>ながら<ruby>へ<rt>え</rt></ruby>ば', second: '<ruby>忍<rt>しの</rt></ruby>ぶることの<br><ruby>弱<rt>よわ</rt></ruby>りもぞする', translation: '私の命よ、絶えてしまうのなら絶えてしまえ。生き長らえてしまうと恋を忍ぶ気持ちが弱って困るから。' },
    90: { first: '<ruby>見<rt>み</rt></ruby>せばやな<br><ruby>雄島<rt>おじま</rt></ruby>のあまの<br><ruby>袖<rt>そで</rt></ruby>だにも', second: 'ぬれにぞぬれし<br><ruby>色<rt>いろ</rt></ruby>はか<ruby>は<rt>わ</rt></ruby>らず', translation: 'あなたに見せたい。私の血の涙に濡れて色が変わってしまったこの袖を。あの雄島の漁師の袖でさえ、ひどく濡れても色は変わらないのに。' },
    91: { first: 'きりぎりす<br><ruby>鳴<rt>な</rt></ruby>くや<ruby>霜夜<rt>しもよ</rt></ruby>の<br>さむしろに', second: '<ruby>衣<rt>ころも</rt></ruby>かたしき<br>ひとりかも<ruby>寝<rt>ね</rt></ruby><ruby>む<rt>ん</rt></ruby>', translation: 'こんな霜の降る寒い夜にこおろぎが鳴いている。むしろの上に自分の衣だけを敷いて、私はひとり寂しく寝るのだろうか。' },
    92: { first: 'わが<ruby>袖<rt>そで</rt></ruby>は<br><ruby>潮干<rt>しおひ</rt></ruby>に<ruby>見<rt>み</rt></ruby>えぬ<br><ruby>沖<rt>おき</rt></ruby>の<ruby>石<rt>いし</rt></ruby>の', second: '<ruby>人<rt>ひと</rt></ruby>こそ<ruby>知<rt>し</rt></ruby>らね<br>かわくまもなし', translation: '人知れずあなたを思う私は引き潮の時でさえ姿を見せない沖の石のようだ。私の袖は涙で乾く暇もない。' },
    93: { first: '<ruby>世<rt>よ</rt></ruby>の<ruby>中<rt>なか</rt></ruby>は<br>つねにもがもな<br><ruby>渚<rt>なぎさ</rt></ruby>こぐ', second: 'あまの<ruby>小舟<rt>こぶね</rt></ruby>の<br><ruby>綱手<rt>つなで</rt></ruby>かなしも', translation: '世の中は、こんな風にいつまでも変わらないでいてほしい。渚を漕ぎだす漁師が小舟の綱を引く様子が愛おしく感じられるよ。' },
    94: { first: 'み<ruby>吉野<rt>よしの</rt></ruby>の<br><ruby>山<rt>やま</rt></ruby>の<ruby>秋風<rt>あきかぜ</rt></ruby><br>さ<ruby>夜<rt>よ</rt></ruby>ふけて', second: 'ふるさと<ruby>寒<rt>さむ</rt></ruby>く<br><ruby>衣<rt>ころも</rt></ruby>うつなり', translation: '吉野の山に、秋風が吹きわたり、夜更けになると、吉野の里は寒く、衣を打つ砧の音が寒々しく響く。' },
    95: { first: 'お<ruby>ほ<rt>お</rt></ruby>けなく<br><ruby>憂<rt>う</rt></ruby>き<ruby>世<rt>よ</rt></ruby>の<ruby>民<rt>たみ</rt></ruby>に<br>お<ruby>ほ<rt>お</rt></ruby><ruby>ふ<rt>う</rt></ruby>かな', second: 'わがたつ<ruby>杣<rt>そま</rt></ruby>に<br><ruby>墨染<rt>すみぞめ</rt></ruby>の<ruby>袖<rt>そで</rt></ruby>', translation: 'おこがましいけれども、このつらい悲しみに満ちた現世を生きる人々を私の袖で包んであげたい。比叡山に住みはじめた私の墨染の袖で。' },
    96: { first: '<ruby>花<rt>はな</rt></ruby>さそ<ruby>ふ<rt>う</rt></ruby><br><ruby>嵐<rt>あらし</rt></ruby>の<ruby>庭<rt>にわ</rt></ruby>の<br><ruby>雪<rt>ゆき</rt></ruby>ならで', second: 'ふりゆくものは<br>わが<ruby>身<rt>み</rt></ruby>なりけり', translation: '桜の花を誘って、散らすように嵐が吹く庭で、花は雪のように降るけれど、古くなるのは我が身であることだ。' },
    97: { first: '<ruby>来<rt>こ</rt></ruby>ぬ<ruby>人<rt>ひと</rt></ruby>を<br><ruby>松帆<rt>まつほ</rt></ruby>の<ruby>浦<rt>うら</rt></ruby>の<br><ruby>夕<rt>ゆう</rt></ruby>なぎに', second: '<ruby>焼<rt>や</rt></ruby>くやもしほの<br><ruby>身<rt>み</rt></ruby>もこがれつつ', translation: '来てくれない恋人を待っています。夕凪どきに松帆の浦で焼かれる海藻のように恋焦がれながら。' },
    98: { first: '<ruby>風<rt>かぜ</rt></ruby>そよぐ<br>ならの<ruby>小川<rt>おがわ</rt></ruby>の<br><ruby>夕<rt></rt></ruby><ruby>暮<rt>ぐれ</rt></ruby>は', second: 'みそぎぞ<ruby>夏<rt>なつ</rt></ruby>の<br>しるしなりける', translation: '風がそよそよと楢の葉を吹く。ならの小川の夕暮れは秋の気配がするけれど、<ruby>水無月祓<rt>みなづきばらえ</rt></ruby>の行事こそがまだ夏であることの<ruby>証<rt>あかし</rt></ruby>なのだなあ。' },
    99: { first: '<ruby>人<rt>ひと</rt></ruby>もをし<br><ruby>人<rt>ひと</rt></ruby>もうらめし<br>あ<ruby>ぢ<rt>じ</rt></ruby>きなく', second: '<ruby>世<rt>よ</rt></ruby>を<ruby>思<rt>おも</rt></ruby><ruby>ふ<rt>う</rt></ruby>ゆ<ruby>ゑ<rt>え</rt></ruby>に<br><ruby>物<rt>も</rt></ruby><ruby>思<rt>おも</rt></ruby><ruby>ふ<rt>う</rt></ruby><ruby>身<rt>み</rt></ruby>は', translation: '人が愛しく、人が恨めしくも感じられる。苦々しく。世の中を思うがゆえに物思いに沈む私には。' },
    100: { first: 'ももしきや<br>ふるき<ruby>軒<rt>のき</rt></ruby>ばの<br>しのぶにも', second: 'な<ruby>ほ<rt>お</rt></ruby>あまりある<br><ruby>昔<rt>むかし</rt></ruby>なりけり', translation: '宮中の古びた軒先にノキシノブが生えている。偲んでも偲びきれないのは、昔の輝かしい御代であることだ。' },
  };

  const STEP_ANIM_MS = 220;
  const QUIZ_TIME_MS = 10000;
  // 開発用モード：URLに ?dev=1 を付けたときだけ、任意のコマへクイズなしで即移動できる
  // パネルを表示する（22コマ目の演出テストなど、通常プレイでは辿り着きにくい状況を
  // 素早く再現するための開発者向けツール。一般プレイヤーには見えない）。
  const DEV_MODE = (() => {
    try { return new URLSearchParams(location.search).get('dev') === '1'; } catch (e) { return false; }
  })();
  // 0コマ目＝スタート、1〜100コマ目＝各歌番号のマス（1コマ目=1番...100コマ目=100番）、101コマ目＝ゴール＝計102マス
  const COURSE_LENGTH = 102;
  const MAX_TURNS = 150;

  // 22コマ目だけの特別ルール：通常のクイズに正解して着地したあと、もう一度サイコロを振り、
  // 出た目に応じて別のコマへワープする（このゲーム固有のルールなので takaramono-sugoroku.js には無い）。
  // 六が出たときはワープ先が無いので、通常のサイコロと同じ扱い（出た目の数だけ前に進む）にする。
  const SPECIAL_SQUARE_INDEX = 22;
  const SPECIAL_SQUARE_WARP_TABLE = { 1: 100, 2: 13, 3: 98, 4: 97, 5: 96 };

  // むべ山双六の盤面画像（1920x1311px）上での各マスの位置。ユーザーが専用のマッピングツールで
  // 手動計測した元画像ピクセル座標を、画像に対する割合(%)に変換して保持している（レスポンシブ対応のため）。
  const SQUARE_COORDS = [
    { index: 0, left: 89.375, top: 85.736, width: 2.5, height: 10.781 },
    { index: 1, left: 79.792, top: 85.634, width: 9.444, height: 10.272 },
    { index: 2, left: 73.333, top: 85.736, width: 6.181, height: 10.475 },
    { index: 3, left: 67.083, top: 85.533, width: 6.042, height: 10.577 },
    { index: 4, left: 60.764, top: 85.533, width: 6.111, height: 10.679 },
    { index: 5, left: 54.514, top: 85.431, width: 6.319, height: 10.984 },
    { index: 6, left: 48.403, top: 85.533, width: 5.903, height: 10.984 },
    { index: 7, left: 42.014, top: 85.431, width: 6.319, height: 11.187 },
    { index: 8, left: 35.764, top: 85.533, width: 5.972, height: 11.187 },
    { index: 9, left: 29.236, top: 85.634, width: 6.528, height: 11.187 },
    { index: 10, left: 22.708, top: 85.736, width: 6.389, height: 11.086 },
    { index: 11, left: 16.319, top: 85.533, width: 6.319, height: 11.187 },
    { index: 12, left: 9.514, top: 85.838, width: 6.736, height: 10.984 },
    { index: 13, left: 1.806, top: 88.075, width: 7.847, height: 8.848 },
    { index: 14, left: 1.875, top: 78.719, width: 7.708, height: 9.052 },
    { index: 15, left: 1.736, top: 69.87, width: 7.847, height: 8.543 },
    { index: 16, left: 1.597, top: 60.615, width: 7.986, height: 9.153 },
    { index: 17, left: 1.736, top: 51.462, width: 7.917, height: 8.95 },
    { index: 18, left: 1.667, top: 42.309, width: 8.056, height: 9.052 },
    { index: 19, left: 1.389, top: 32.952, width: 8.194, height: 9.153 },
    { index: 20, left: 1.458, top: 23.697, width: 8.056, height: 9.153 },
    { index: 21, left: 1.389, top: 14.544, width: 8.264, height: 9.153 },
    { index: 22, left: 17.708, top: 61.632, width: 10.069, height: 11.594 },
    { index: 23, left: 1.528, top: 2.746, width: 6.458, height: 11.696 },
    { index: 24, left: 8.125, top: 3.051, width: 6.597, height: 11.391 },
    { index: 25, left: 14.861, top: 3.153, width: 6.111, height: 11.492 },
    { index: 26, left: 21.111, top: 3.153, width: 6.458, height: 11.391 },
    { index: 27, left: 27.5, top: 3.051, width: 6.597, height: 11.492 },
    { index: 28, left: 34.167, top: 3.356, width: 6.319, height: 11.391 },
    { index: 29, left: 40.625, top: 3.153, width: 6.319, height: 11.696 },
    { index: 30, left: 47.153, top: 3.051, width: 6.181, height: 11.798 },
    { index: 31, left: 53.472, top: 3.051, width: 6.319, height: 11.391 },
    { index: 32, left: 59.861, top: 3.153, width: 6.389, height: 11.391 },
    { index: 33, left: 66.25, top: 3.051, width: 6.458, height: 11.492 },
    { index: 34, left: 72.639, top: 3.255, width: 6.458, height: 11.492 },
    { index: 35, left: 79.167, top: 3.661, width: 6.181, height: 11.289 },
    { index: 36, left: 85.417, top: 3.458, width: 6.667, height: 11.492 },
    { index: 37, left: 84.028, top: 15.256, width: 7.778, height: 9.662 },
    { index: 38, left: 83.75, top: 25.121, width: 7.917, height: 9.458 },
    { index: 39, left: 83.611, top: 34.681, width: 7.778, height: 9.458 },
    { index: 40, left: 83.75, top: 44.241, width: 7.361, height: 9.255 },
    { index: 41, left: 83.681, top: 53.699, width: 7.847, height: 9.662 },
    { index: 42, left: 83.611, top: 63.463, width: 7.847, height: 9.662 },
    { index: 43, left: 85.556, top: 73.43, width: 6.042, height: 11.696 },
    { index: 44, left: 79.097, top: 73.227, width: 6.181, height: 11.798 },
    { index: 45, left: 73.056, top: 73.328, width: 5.903, height: 11.696 },
    { index: 46, left: 66.944, top: 73.43, width: 5.972, height: 11.492 },
    { index: 47, left: 60.417, top: 73.532, width: 6.458, height: 11.594 },
    { index: 48, left: 54.306, top: 73.328, width: 6.042, height: 11.492 },
    { index: 49, left: 48.542, top: 73.43, width: 5.556, height: 11.289 },
    { index: 50, left: 42.361, top: 73.633, width: 5.972, height: 11.391 },
    { index: 51, left: 36.25, top: 73.735, width: 6.042, height: 11.187 },
    { index: 52, left: 30, top: 73.735, width: 6.042, height: 11.289 },
    { index: 53, left: 23.889, top: 73.837, width: 5.972, height: 11.289 },
    { index: 54, left: 17.639, top: 73.532, width: 5.972, height: 11.696 },
    { index: 55, left: 9.931, top: 75.464, width: 7.361, height: 9.56 },
    { index: 56, left: 9.861, top: 65.802, width: 7.639, height: 9.458 },
    { index: 57, left: 9.792, top: 56.445, width: 7.778, height: 9.255 },
    { index: 58, left: 9.861, top: 46.58, width: 7.708, height: 9.56 },
    { index: 59, left: 9.861, top: 36.918, width: 7.847, height: 9.458 },
    { index: 60, left: 9.792, top: 26.545, width: 7.708, height: 10.069 },
    { index: 61, left: 10.069, top: 14.95, width: 5.764, height: 11.492 },
    { index: 62, left: 15.972, top: 15.154, width: 5.972, height: 11.289 },
    { index: 63, left: 22.569, top: 15.256, width: 5.694, height: 11.289 },
    { index: 64, left: 28.75, top: 15.256, width: 5.764, height: 11.391 },
    { index: 65, left: 34.931, top: 15.154, width: 5.972, height: 11.594 },
    { index: 66, left: 41.042, top: 15.154, width: 6.042, height: 11.696 },
    { index: 67, left: 47.361, top: 15.357, width: 5.764, height: 11.391 },
    { index: 68, left: 53.264, top: 15.154, width: 6.181, height: 11.289 },
    { index: 69, left: 59.792, top: 14.95, width: 5.972, height: 11.492 },
    { index: 70, left: 65.903, top: 15.154, width: 5.903, height: 11.492 },
    { index: 71, left: 72.014, top: 15.256, width: 5.833, height: 11.492 },
    { index: 72, left: 77.917, top: 15.256, width: 5.764, height: 11.696 },
    { index: 73, left: 75.833, top: 27.053, width: 7.361, height: 8.95 },
    { index: 74, left: 75.833, top: 36.003, width: 7.569, height: 8.95 },
    { index: 75, left: 75.625, top: 45.258, width: 7.708, height: 9.052 },
    { index: 76, left: 75.556, top: 54.513, width: 7.778, height: 8.645 },
    { index: 77, left: 75.556, top: 63.26, width: 7.847, height: 9.458 },
    { index: 78, left: 69.792, top: 61.124, width: 5.694, height: 11.696 },
    { index: 79, left: 63.681, top: 61.327, width: 5.833, height: 11.391 },
    { index: 80, left: 57.639, top: 61.327, width: 5.833, height: 11.492 },
    { index: 81, left: 51.528, top: 61.429, width: 5.764, height: 11.391 },
    { index: 82, left: 45.486, top: 61.734, width: 5.694, height: 11.289 },
    { index: 83, left: 39.583, top: 61.734, width: 5.694, height: 11.187 },
    { index: 84, left: 33.542, top: 61.531, width: 5.764, height: 11.696 },
    { index: 85, left: 27.778, top: 61.632, width: 5.417, height: 11.696 },
    { index: 86, left: 17.847, top: 53.089, width: 8.056, height: 8.238 },
    { index: 87, left: 17.986, top: 44.444, width: 7.778, height: 8.441 },
    { index: 88, left: 17.986, top: 35.8, width: 7.708, height: 8.543 },
    { index: 89, left: 17.847, top: 26.951, width: 8.125, height: 8.747 },
    { index: 90, left: 26.042, top: 27.053, width: 5.764, height: 11.492 },
    { index: 91, left: 31.875, top: 27.155, width: 5.833, height: 11.492 },
    { index: 92, left: 37.778, top: 27.053, width: 5.694, height: 11.289 },
    { index: 93, left: 43.611, top: 27.053, width: 5.833, height: 11.492 },
    { index: 94, left: 49.514, top: 26.951, width: 5.625, height: 10.984 },
    { index: 95, left: 55.139, top: 26.748, width: 6.25, height: 11.492 },
    { index: 96, left: 61.389, top: 26.85, width: 6.042, height: 11.492 },
    { index: 97, left: 67.639, top: 27.155, width: 7.778, height: 8.035 },
    { index: 98, left: 67.639, top: 35.291, width: 7.5, height: 8.543 },
    { index: 99, left: 67.569, top: 43.936, width: 7.639, height: 7.831 },
    { index: 100, left: 67.361, top: 51.869, width: 7.847, height: 8.848 },
    { index: 101, left: 36.042, top: 38.749, width: 30.903, height: 21.866 }
  ];

  const DICE_ROTATIONS = {
    1: { x: 0, y: 0 },
    2: { x: 0, y: -90 },
    3: { x: -90, y: 0 },
    4: { x: 90, y: 0 },
    5: { x: 0, y: 90 },
    6: { x: 0, y: -180 }
  };

  // 最大5人までのローカル対戦（同じ端末で順番にプレイ）用の設定
  const MAX_PLAYERS = 5;
  const AVATAR_EMOJIS = ['🐻', '🐼', '🐰', '🐨', '🐱', '🦁', '🐶', '🦊', '🐵'];
  const PLAYER_COLORS = ['#2f7bd6', '#d64f2f', '#3fae5a', '#c9a227', '#8a4fd6'];

  /* ---------------------------------------------------------
     状態
  --------------------------------------------------------- */
  const state = {
    squares: [],
    maxTurns: MAX_TURNS,
    turnCount: 0,
    gameOver: false,
    diceRot: { x: 0, y: 0 },
    rollLocked: false,
    pendingSpecialRoll: false, // 22コマ目特別マスのボーナスサイコロ待ちかどうか
    lastHighlight: null,
    players: [],
    currentPlayerIndex: 0,
    finishedCount: 0, // ここまでにゴールしたプレイヤーの人数（着順の割り当てに使う）
    rangeStart: 0,
    rangeEnd: COURSE_LENGTH - 1
  };
  let quizTimeoutHandle = null;
  let toastTimer = null;
  let resizeHandle = null;
  // クイズに正解した直後、「次へ」ボタンだけでなくサイコロ／手番インジケーターを
  // クリックしても同じ動作（コマを進める）ができるようにするための、待機中の確定処理。
  // nullでないときだけ、サイコロ側のクリックが有効になる。
  let confirmMoveFn = null;

  // スタート画面での人数・キャラクター選択（ゲーム開始前の設定値）
  let setupCount = 1;
  let setupAvatars = AVATAR_EMOJIS.slice(0, MAX_PLAYERS);

  function makeFreshPlayer(idx, emoji) {
    return {
      id: idx,
      name: (idx + 1) + 'P',
      emoji: emoji,
      color: PLAYER_COLORS[idx % PLAYER_COLORS.length],
      pos: state.rangeStart,
      pendingTarget: null, // クイズに不正解で足止め中のとき、再挑戦すべきマス番号
      pendingInstant: false, // 再挑戦時の移動演出（ワープ扱いかどうか）
      pendingQuiz: null, // 不正解だった問題そのもの（再挑戦時に同じ問題を出すために覚えておく）
      finished: false,
      finishOrder: null, // ゴールした順（1位=1、2位=2…）。未ゴールならnull
      tokenEl: null
    };
  }

  /* ---------------------------------------------------------
     DOM参照
  --------------------------------------------------------- */
  let el = {};
  function cacheDom() {
    el = {
      startScreen: document.getElementById('sgr-start-screen'),
      gameScreen: document.getElementById('sgr-game-screen'),
      sparkleLayer: document.getElementById('sgr-sparkle-layer'),
      devPanel: document.getElementById('sgr-dev-panel'),
      devTargetInput: document.getElementById('sgr-dev-target'),
      devJumpBtn: document.getElementById('sgr-dev-jump-btn'),
      devJumpQuizBtn: document.getElementById('sgr-dev-jump-quiz-btn'),
      startBtn: document.getElementById('sgr-start-btn'),
      bestDisplay: document.getElementById('sgr-best-display'),
      countChoices: document.getElementById('sgr-count-choices'),
      rangeStartInput: document.getElementById('sgr-range-start'),
      playerSetup: document.getElementById('sgr-player-setup'),
      playersPanel: document.getElementById('sgr-players-panel'),
      turnIndicator: document.getElementById('sgr-turn-indicator'),
      layout: document.querySelector('.sgr-layout'),
      boardPanel: document.querySelector('.sgr-board-panel'),
      sidePanel: document.querySelector('.sgr-side-panel'),
      poemModal: document.getElementById('sgr-poem-modal'),
      poemSource: document.getElementById('sgr-poem-source'),
      poemText: document.getElementById('sgr-poem-text'),
      poemTranslationLabel: document.getElementById('sgr-poem-translation-label'),
      poemTranslation: document.getElementById('sgr-poem-translation'),
      poemCloseBtn: document.getElementById('sgr-poem-close'),
      boardScroll: document.getElementById('sgr-board-scroll'),
      boardImg: document.getElementById('sgr-board-img'),
      board: document.getElementById('sgr-board'),
      dice: document.getElementById('sgr-dice'),
      diceScene: document.getElementById('sgr-dice-scene'),
      diceArea: document.getElementById('sgr-dice-area'),
      quizModal: document.getElementById('sgr-quiz-modal'),
      quizTimerBar: document.getElementById('sgr-quiz-timer-bar'),
      quizSource: document.getElementById('sgr-quiz-source'),
      quizQuestion: document.getElementById('sgr-quiz-question'),
      quizChoices: document.getElementById('sgr-quiz-choices'),
      quizTrueBtn: document.getElementById('sgr-quiz-true'),
      quizFalseBtn: document.getElementById('sgr-quiz-false'),
      quizResult: document.getElementById('sgr-quiz-result'),
      quizResultText: document.getElementById('sgr-quiz-result-text'),
      quizExplain: document.getElementById('sgr-quiz-explain'),
      quizOkBtn: document.getElementById('sgr-quiz-ok'),
      gameoverPanel: document.getElementById('sgr-gameover-panel'),
      resultBanner: document.getElementById('sgr-result-banner'),
      resultCols: document.getElementById('sgr-result-cols'),
      resultBest: document.getElementById('sgr-result-best'),
      playAgainBtn: document.getElementById('sgr-play-again'),
      toast: document.getElementById('sgr-toast'),
      toastIcon: document.getElementById('sgr-toast-icon'),
      toastText: document.getElementById('sgr-toast-text')
    };
  }

  function createPlayerToken(player) {
    const span = document.createElement('span');
    span.className = 'sgr-token token-p' + player.id;
    span.textContent = player.emoji;
    span.title = player.name;
    span.style.setProperty('--sgr-player-color', player.color);
    player.tokenEl = span;
  }

  /* ---------------------------------------------------------
     人数・キャラクター選択（スタート画面）
  --------------------------------------------------------- */
  function renderPlayerSetup() {
    let html = '';
    for (let i = 0; i < setupCount; i++) {
      const chosen = setupAvatars[i];
      const buttons = AVATAR_EMOJIS.map((emoji) => {
        const takenByOther = setupAvatars.slice(0, setupCount).some((a, j) => j !== i && a === emoji);
        const selected = emoji === chosen;
        return '<button type="button" class="sgr-avatar-btn' + (selected ? ' is-selected' : '') + '" data-idx="' + i +
          '" data-emoji="' + emoji + '"' + (takenByOther ? ' disabled' : '') + '>' + emoji + '</button>';
      }).join('');
      html += '<div class="sgr-setup-row">' +
        '<div class="sgr-setup-row-head"><span class="sgr-setup-row-avatar">' + chosen + '</span><span>' + (i + 1) + 'P</span></div>' +
        '<div class="sgr-avatar-choices">' + buttons + '</div>' +
        '</div>';
    }
    el.playerSetup.innerHTML = html;
  }

  /* ---------------------------------------------------------
     ユーティリティ
  --------------------------------------------------------- */
  function toast(icon, text) {
    el.toastIcon.textContent = icon;
    el.toastText.textContent = text;
    el.toast.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.remove('is-show'), 1800);
  }

  /* ---------------------------------------------------------
     自己ベスト（localStorage）
  --------------------------------------------------------- */
  // takaramono-sugoroku.js とは別のキーを使う（同一オリジンなのでlocalStorageは共有されており、
  // 同じキーだと双方のベスト記録が混ざってしまうため）。宝物・スコアが無くなったので、
  // 自己ベストは「ゴールまでにかかった手番数（少ないほど良い）」で記録する。
  const BEST_KEY = 'sgr_mubeyama_best_turns';
  function loadBest() {
    try {
      const raw = localStorage.getItem(BEST_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function saveBest(data) {
    try { localStorage.setItem(BEST_KEY, JSON.stringify(data)); } catch (e) { /* 保存できなくても続行 */ }
  }
  function updateBestDisplay() {
    const best = loadBest();
    el.bestDisplay.textContent = best
      ? ('🏅 自己ベスト：' + best.turns + '回の手数でゴール')
      : 'まだ記録がありません';
  }

  /* ---------------------------------------------------------
     盤面生成
     0コマ目＝スタート、1〜100コマ目＝各歌番号の宝マス（Nコマ目＝N番の歌人）、101コマ目＝ゴール。
     マス番号と歌番号を完全に一致させるため、盤面はプレイのたびにランダム生成するのではなく固定。
  --------------------------------------------------------- */
  function buildCourse(total) {
    const squares = new Array(total);
    squares[0] = { index: 0, type: 'start' };
    for (let n = 1; n < total - 1; n++) {
      squares[n] = { index: n, type: 'treasure' };
    }
    squares[total - 1] = { index: total - 1, type: 'goal' };
    return squares;
  }

  // SQUARE_COORDS（画像に対する%座標）から、マスindexで引けるマップを作る
  const SQUARE_COORD_MAP = {};
  SQUARE_COORDS.forEach((c) => { SQUARE_COORD_MAP[c.index] = c; });

  // 盤面は「むべ山双六」の版画そのものを背景画像として表示し、その上に各マスと同じ位置・大きさの
  // 透明なクリック領域を%座標で重ねるだけ。スネーク型グリッドのような蛇行レイアウト計算は不要。
  function renderBoard() {
    el.board.innerHTML = '';
    state.squares.forEach((sq) => {
      const coord = SQUARE_COORD_MAP[sq.index];
      if (!coord) return;
      const div = document.createElement('div');
      div.className = 'sgr-square sgr-sq-' + sq.type;
      div.id = 'sgr-sq-' + sq.index;
      div.style.left = coord.left + '%';
      div.style.top = coord.top + '%';
      div.style.width = coord.width + '%';
      div.style.height = coord.height + '%';
      div.innerHTML =
        '<span class="sgr-sq-num">' + sq.index + '</span>' +
        '<div class="sgr-sq-tokens"></div>';
      el.board.appendChild(div);
    });
  }

  /* ---------------------------------------------------------
     盤面レイアウト（版画画像の実寸に合わせてトークン等のサイズだけ調整）
  --------------------------------------------------------- */
  // マス自体は%座標で画像に追従するので再計算不要だが、駒アイコンや数字バッジは
  // 極端に小さいマス（振り出しコマなど）に収まりきらないよう、盤面の実測幅から
  // ほどよいサイズを算出してCSS変数に反映する。
  function layoutBoard() {
    const w = el.board.offsetWidth;
    if (!w) return;
    const tokenSize = Math.max(16, Math.min(30, w * 0.032));
    const badgeSize = Math.max(9, Math.min(13, w * 0.014));
    el.board.style.setProperty('--sgr-token-size', tokenSize.toFixed(1) + 'px');
    el.board.style.setProperty('--sgr-badge-size', badgeSize.toFixed(1) + 'px');
  }

  function handleResize() {
    clearTimeout(resizeHandle);
    resizeHandle = setTimeout(() => {
      if (el.gameScreen.classList.contains('sgr-hidden')) return;
      layoutBoard();
      syncSidePanelPosition();
    }, 150);
  }

  /* ---------------------------------------------------------
     プレイヤーカード
  --------------------------------------------------------- */
  // サイドパネルのプレイヤーカードを人数分まとめて再構築する（宝物・スコアの概念は無いので
  // アバター・名前・現在のコマ位置だけを表示するシンプルなカード）
  function renderPlayersPanel() {
    el.playersPanel.innerHTML = state.players.map((p, idx) => {
      const isCurrent = !state.gameOver && idx === state.currentPlayerIndex;
      return '<div class="sgr-player-card' + (isCurrent ? ' is-current-turn' : '') + (p.finished ? ' is-finished' : '') + '">' +
        '<div class="sgr-player-head">' +
        '<span class="sgr-player-avatar" style="--sgr-player-color:' + p.color + '">' + p.emoji + '</span>' +
        '<span class="sgr-player-name">' + p.name + (p.finished ? ' 🏔️' : '') + '</span>' +
        '<span class="sgr-player-pos">📍<b id="sgr-pos-p' + idx + '">' + p.pos + '</b>コマ目</span>' +
        '</div>' +
        '</div>';
    }).join('');
  }

  // コマの位置表示だけを軽量に更新する（移動アニメーション中、1マス進むごとに呼ばれる）
  function updatePositionDisplay(player) {
    const posEl = document.getElementById('sgr-pos-p' + player.id);
    if (posEl) posEl.textContent = player.pos;
  }

  // コマをクリックすると、そのマスの歌人の歌（原文）と現代語訳をモーダル表示する
  function openPoemModal(pos) {
    const sq = state.squares[pos];
    if (sq.type === 'treasure') {
      const poem = POEM_DB[sq.index];
      const quiz = QUIZ_DB[sq.index - 1];
      el.poemSource.textContent = sq.index + '番 ' + quiz.poet;
      // 句の中の改行（<br>区切り）は半角スペースにして1行にし、上の句と下の句の間で改行する
      const flatten = (html) => html.replace(/<br>/g, ' ');
      el.poemText.innerHTML = flatten(poem.first) + '<br>' + flatten(poem.second);
      el.poemTranslation.textContent = poem.translation;
      el.poemTranslationLabel.classList.remove('sgr-hidden');
    } else if (sq.type === 'goal') {
      el.poemSource.textContent = '⛰️ 上り（ゴール）';
      el.poemText.innerHTML = '上り（ゴール）の絵は、小倉山荘の藤原定家を描いたものです。';
      el.poemTranslation.textContent = '';
      el.poemTranslationLabel.classList.add('sgr-hidden');
    } else {
      el.poemSource.textContent = '🚩 スタート地点';
      el.poemText.textContent = 'サイコロを振って百人一首の旅に出よう！';
      el.poemTranslation.textContent = '';
      el.poemTranslationLabel.classList.add('sgr-hidden');
    }
    el.poemModal.classList.remove('sgr-hidden');
  }

  function closePoemModal() {
    el.poemModal.classList.add('sgr-hidden');
  }

  /* ---------------------------------------------------------
     駒の移動・演出
  --------------------------------------------------------- */
  function placeToken(player, pos) {
    const sqEl = document.getElementById('sgr-sq-' + pos);
    if (!sqEl) return;
    const container = sqEl.querySelector('.sgr-sq-tokens');
    container.appendChild(player.tokenEl);
    player.tokenEl.classList.remove('sgr-token-hop');
    void player.tokenEl.offsetWidth;
    player.tokenEl.classList.add('sgr-token-hop');
  }

  // 今、手番中のプレイヤーがいるマスにだけリングを表示する
  function highlightSquare(pos) {
    if (state.lastHighlight) state.lastHighlight.classList.remove('sgr-sq-current-human');
    const sqEl = document.getElementById('sgr-sq-' + pos);
    if (sqEl) sqEl.classList.add('sgr-sq-current-human');
    state.lastHighlight = sqEl;
  }

  // 移動先のコマが横スクロール範囲内に収まるよう、盤面自身の横スクロール（.sgr-board-scroll）
  // だけを動かす。以前はsqEl.scrollIntoView({inline:'nearest', block:'nearest'})を使っていたが、
  // block指定があると祖先である「ページ全体（window）」まで縦スクロールの対象になってしまい、
  // ボタンを押すたびに画面が動く一因になっていた。scrollLeftを直接操作すればページの縦スクロール
  // には一切触れず、盤面の横スクロールだけを最小限（コマが余白付きで見えるまで）動かせる。
  function scrollToSquare(pos) {
    const sqEl = document.getElementById('sgr-sq-' + pos);
    const scrollEl = el.boardScroll;
    if (!sqEl || !scrollEl) return;
    const sqRect = sqEl.getBoundingClientRect();
    const containerRect = scrollEl.getBoundingClientRect();
    const margin = 24;
    if (sqRect.left < containerRect.left + margin) {
      scrollEl.scrollBy({ left: sqRect.left - containerRect.left - margin, behavior: 'smooth' });
    } else if (sqRect.right > containerRect.right - margin) {
      scrollEl.scrollBy({ left: sqRect.right - containerRect.right + margin, behavior: 'smooth' });
    }
  }

  // takaramono-sugoroku.js ではPC表示のときコマの高さに合わせて sgr-side-panel を
  // 上下スライドさせていたが、むべ山双六では「sgr-side-panelの上部は常にsgr-boardの上と揃える」
  // という指定のため、そのスライド演出は行わない（.sgr-layoutのalign-items:flex-startにより、
  // 何もtransformしなければ両カラムの上端は自然に揃う）。関数名・呼び出し箇所は互換のため残し、
  // 中身だけ「常にtransformなし」にしている。
  function syncSidePanelPosition() {
    if (el.sidePanel) el.sidePanel.style.transform = '';
  }

  function walkTo(player, targetPos, cb) {
    (function step() {
      if (player.pos === targetPos) { cb(); return; }
      player.pos += (targetPos > player.pos) ? 1 : -1;
      placeToken(player, player.pos);
      highlightSquare(player.pos);
      scrollToSquare(player.pos);
      updatePositionDisplay(player);
      syncSidePanelPosition();
      setTimeout(step, STEP_ANIM_MS);
    })();
  }

  // ワープは1マスずつの移動アニメーション（walkTo）を使わず、対象のコマへ直接一気に移動させる
  // （walkToを流用すると、遠いコマへワープする際に何十マスも1マスずつ進む演出になってしまい、
  //   「ワープ」の演出として不自然に長い待ち時間になるため）。
  function warpPlayerTo(player, targetPos, cb) {
    player.pos = targetPos;
    placeToken(player, player.pos);
    highlightSquare(player.pos);
    scrollToSquare(player.pos);
    updatePositionDisplay(player);
    syncSidePanelPosition();
    setTimeout(cb, STEP_ANIM_MS);
  }

  /* ---------------------------------------------------------
     サイコロ（3D CSSキューブ）
  --------------------------------------------------------- */
  function nextAngle(current, targetMod, spins) {
    const remainder = ((current % 360) + 360) % 360;
    const targetNorm = ((targetMod % 360) + 360) % 360;
    let diff = targetNorm - remainder;
    if (diff < 0) diff += 360;
    return current + diff + 360 * spins;
  }

  function animateDice(value, cb) {
    const spins = 2 + Math.floor(Math.random() * 2);
    const t = DICE_ROTATIONS[value];
    state.diceRot.x = nextAngle(state.diceRot.x, t.x, spins);
    state.diceRot.y = nextAngle(state.diceRot.y, t.y, spins);
    el.dice.style.transform = 'rotateX(' + state.diceRot.x + 'deg) rotateY(' + state.diceRot.y + 'deg)';
    setTimeout(cb, 820);
  }

  // 1つのマス（歌人）に複数のクイズ問題を用意できるようにしたため、出題のたびに
  // QUIZ_DB[index-1].quizzes からランダムに1問選ぶ（openQuizModalが期待するフラットな
  // {poemNum, poet, q, answer, explain} の形に組み立て直す）。
  function pickRandomQuiz(index) {
    const entry = QUIZ_DB[index - 1];
    const picked = entry.quizzes[Math.floor(Math.random() * entry.quizzes.length)];
    return { poemNum: entry.poemNum, poet: entry.poet, q: picked.q, answer: picked.answer, explain: picked.explain };
  }

  /* ---------------------------------------------------------
     マス効果の解決
  --------------------------------------------------------- */

  function attemptMoveTo(player, targetIndex, opts) {
    const instant = !!(opts && opts.instant);
    const sq = state.squares[targetIndex];

    const proceed = () => {
      const mover = instant ? warpPlayerTo : walkTo;
      mover(player, targetIndex, () => afterLanding(player, targetIndex));
    };

    if (sq.type === 'treasure') {
      // 同じマスへの再挑戦（不正解で足止め中だったマスと一致）なら、前回と同じ問題を
      // 使い回す。それ以外（初回・別マス）は新しくランダムに1問選ぶ。
      const quiz = (player.pendingTarget === targetIndex && player.pendingQuiz)
        ? player.pendingQuiz
        : pickRandomQuiz(sq.index);
      openQuizModal(quiz, (correct) => {
        if (correct) {
          player.pendingTarget = null;
          player.pendingInstant = false;
          player.pendingQuiz = null;
          proceed();
        } else {
          player.pendingTarget = targetIndex;
          player.pendingInstant = instant;
          player.pendingQuiz = quiz;
          toast('✕', '不正解…このターンは進めません。次の自分の番でもう一度挑戦');
          afterResolve();
        }
      });
    } else {
      proceed();
    }
  }

  // 目的のマスに実際に到着した後の後処理：ゴールならゴール処理、22コマ目特別マスなら
  // ボーナスサイコロを起動、それ以外は通常どおり手番を次のプレイヤーへ渡す。
  function afterLanding(player, targetIndex) {
    if (targetIndex === state.rangeEnd) {
      handleGoal(player);
    } else if (targetIndex === SPECIAL_SQUARE_INDEX) {
      triggerSpecialSquareBonus(player);
    } else {
      afterResolve();
    }
  }

  // 【開発用】?dev=1のときの2つの移動機能で共通する下ごしらえ：進行中のクイズや
  // 確定待ちの状態を強制リセットしてから、対象コマ（0〜COURSE_LENGTH-1にクランプ）を
  // 返す（開発中に割り込みで使うことを想定しているため）。
  function devPrepareJump(targetIndex) {
    const player = state.players[state.currentPlayerIndex];
    const clamped = Math.max(0, Math.min(COURSE_LENGTH - 1, targetIndex));
    clearTimeout(quizTimeoutHandle);
    confirmMoveFn = null;
    player.pendingTarget = null;
    player.pendingInstant = false;
    player.pendingQuiz = null;
    el.quizModal.classList.add('sgr-hidden');
    el.diceArea.classList.remove('sgr-hidden');
    setRollLocked(true);
    return { player, clamped };
  }

  // 【開発用】クイズ判定を挟まずに任意のコマへ即移動する。通常の移動と同じく
  // warpPlayerTo→afterLandingを経由するので、ゴール処理（桜吹雪）や22コマ目の
  // 特別演出（紅葉）もそのままテストできる。
  function devJumpToSquare(targetIndex) {
    if (!DEV_MODE || !state.players.length || state.gameOver) return;
    const { player, clamped } = devPrepareJump(targetIndex);
    warpPlayerTo(player, clamped, () => afterLanding(player, clamped));
  }

  // 【開発用】クイズ判定を経由して任意のコマへ移動する。対象がクイズマス（treasure）
  // なら通常どおりクイズが出題され、正解して初めて実際に移動する（不正解時の
  // 再挑戦フローも含め、通常プレイと同じ流れをそのまま任意のマスでテストできる）。
  // 移動自体は瞬間移動（instant: true）にして、遠いマスでも1マスずつのウォーク
  // アニメーションで待たされないようにする。
  function devJumpToSquareWithQuiz(targetIndex) {
    if (!DEV_MODE || !state.players.length || state.gameOver) return;
    const { player, clamped } = devPrepareJump(targetIndex);
    attemptMoveTo(player, clamped, { instant: true });
  }

  // 22コマ目特別マス：正解して着地した後、もう一度サイコロを振れるようにする。
  // 実際の目の判定は onRollClick → resolveSpecialSquareRoll で行う。
  function triggerSpecialSquareBonus(player) {
    state.pendingSpecialRoll = true;
    const prefix = state.players.length > 1 ? (player.emoji + ' ' + player.name + '：') : '';
    el.turnIndicator.innerHTML = prefix + '🌀 22コマ目の特別マス！<br>もう一度サイコロを振ろう';
    toast('🌀', '22コマ目の特別マス！ もう一度サイコロを振ろう');
    spawnMapleLeaves();
    setRollLocked(false);
  }

  // sgr-game-screen全体に紅葉（img/maple_leaf.webp）のパーティクルを複数波にわたって
  // ばらまき、それぞれ左右に揺れながら回転しつつ舞い落ちる演出。あわせて画面全体の
  // 金色フラッシュと、盤面を縁取るグローも重ねる。22コマ目の特別マスに止まったときの
  // 祝祭感を出すための飾り（css/fall.scssの「雪→紅葉」演出と同じ発想の、この画面専用版）。
  function spawnMapleLeaves() {
    if (!el.sparkleLayer) return;

    // 画面全体がパッと金色に光るフラッシュ
    const flash = document.createElement('div');
    flash.className = 'sgr-sparkle-flash';
    el.sparkleLayer.appendChild(flash);
    flash.addEventListener('animationend', () => flash.remove());

    // 盤面を縁取るグロー（クラスを一度外してから付け直すことで、連続発動時も
    // 毎回アニメーションが最初から再生されるようにする）
    if (el.gameScreen) {
      el.gameScreen.classList.remove('sgr-sparkle-glow');
      void el.gameScreen.offsetWidth; // 強制リフロー
      el.gameScreen.classList.add('sgr-sparkle-glow');
      setTimeout(() => el.gameScreen.classList.remove('sgr-sparkle-glow'), 2600);
    }

    const spawnWave = (count) => {
      for (let i = 0; i < count; i++) {
        const leaf = document.createElement('span');
        leaf.className = 'sgr-maple-particle';
        // fall.js（サイト共通の紅葉演出）と同じ20〜40pxのサイズ感に揃える
        const size = 20 + Math.random() * 20;
        leaf.style.width = size + 'px';
        leaf.style.height = size + 'px';
        leaf.style.left = (Math.random() * 95) + '%';
        leaf.style.setProperty('--sgr-sway', (12 + Math.random() * 14) + 'px');
        leaf.style.animationDuration = (2.2 + Math.random() * 1) + 's';
        leaf.style.animationDelay = (Math.random() * 0.3) + 's';
        el.sparkleLayer.appendChild(leaf);
        leaf.addEventListener('animationend', () => leaf.remove());
      }
    };

    // 一度にどっと出すのではなく3波に分けて次々発生させることで、より賑やかで
    // 持続感のある演出にする。ただし後続の波は次のリセット/スタートまでに間に
    // 合わないことがあるため、発火時点でゲームが終了・リセット済みなら出さない
    // （そうしないと、リセット後の新しいゲーム画面に紅葉が紛れ込んでしまう）。
    spawnWave(12);
    setTimeout(() => { if (!state.gameOver) spawnWave(9); }, 350);
    setTimeout(() => { if (!state.gameOver) spawnWave(7); }, 700);
  }

  // 22コマ目のボーナスサイコロの結果を判定する。1〜5は指定のコマへワープ、6だけは
  // ワープ先が無いので通常のサイコロと同じ扱い（出た目の数だけ前に進む）にする。
  // ワープ先・通常移動先のどちらも、他のマスと同じくクイズ正解が必要（attemptMoveTo任せ）。
  function resolveSpecialSquareRoll(value) {
    const player = state.players[state.currentPlayerIndex];
    const warpTo = SPECIAL_SQUARE_WARP_TABLE[value];
    if (warpTo === undefined) {
      // 六の目：ワープなし、通常のサイコロ処理へ
      const target = Math.min(player.pos + value, state.rangeEnd);
      el.turnIndicator.textContent = value + 'コマ進む';
      attemptMoveTo(player, target, { instant: false });
      return;
    }
    const target = Math.min(state.rangeEnd, Math.max(state.rangeStart, warpTo));
    el.turnIndicator.textContent = '🌀 目は「' + value + '」！ ' + warpTo + 'コマ目へワープ！';
    toast('🌀', '目は「' + value + '」！ ' + warpTo + 'コマ目へワープ！');
    attemptMoveTo(player, target, { instant: true });
  }

  function handleGoal(player) {
    player.finished = true;
    state.finishedCount++;
    player.finishOrder = state.finishedCount;
    toast('🏔️', player.name + ' 上り（ゴール）！');
    spawnCherryBlizzard();
    afterResolve();
  }

  // 紅葉（spawnMapleLeaves）と同じ「画面上端から舞い落ちる」方式で、桜（img/cherry.webp）
  // の花びらを降らせる「桜吹雪」演出。影は付けない。3波に分けず1回でまとめて大量発生
  // させることで「一気に」感を出す。あわせて桜色のフラッシュ・グローも重ねる。
  // ゴールに到達した瞬間（handleGoal）に発火。
  function spawnCherryBlizzard() {
    if (!el.sparkleLayer) return;

    const flash = document.createElement('div');
    flash.className = 'sgr-sparkle-flash-pink';
    el.sparkleLayer.appendChild(flash);
    flash.addEventListener('animationend', () => flash.remove());

    if (el.gameScreen) {
      el.gameScreen.classList.remove('sgr-sparkle-glow-pink');
      void el.gameScreen.offsetWidth; // 強制リフロー（連続発動時も毎回最初から再生させる）
      el.gameScreen.classList.add('sgr-sparkle-glow-pink');
      setTimeout(() => el.gameScreen.classList.remove('sgr-sparkle-glow-pink'), 2600);
    }

    const PETAL_COUNT = 90;
    // 横位置は完全なランダムだと偏り（隙間・かたまり）が出やすいので、幅を等間隔の
    // マスに分けたうえで各マス内でランダムにずらす（層化サンプリング）ことで、
    // 画面全体にまんべんなくばらけさせる。落下タイミング・速さ・揺れ幅の乱数レンジも
    // 広げて、1枚1枚がバラバラに舞っているように見せる。
    const binWidth = 95 / PETAL_COUNT;
    for (let i = 0; i < PETAL_COUNT; i++) {
      const petal = document.createElement('span');
      petal.className = 'sgr-cherry-particle';
      const size = 12 + Math.random() * 18;
      petal.style.width = size + 'px';
      petal.style.height = size + 'px';
      petal.style.left = (i * binWidth + Math.random() * binWidth) + '%';
      petal.style.setProperty('--sgr-sway', (12 + Math.random() * 40) + 'px');
      petal.style.animationDuration = (2.4 + Math.random() * 2.2) + 's';
      petal.style.animationDelay = (Math.random() * 1.8) + 's';
      el.sparkleLayer.appendChild(petal);
      petal.addEventListener('animationend', () => petal.remove());
    }
  }

  /* ---------------------------------------------------------
     ○×クイズ（sgr-dice-area の下に通常表示。モーダルではない）
  --------------------------------------------------------- */
  function openQuizModal(quiz, onFinish) {
    // 出題中はサイコロエリアをいったん隠し、スクロールが起きにくいよう縦の高さを抑える
    // （回答したら finish() 内ですぐ元に戻す）
    el.diceArea.classList.add('sgr-hidden');
    el.quizModal.classList.remove('sgr-hidden');
    el.quizChoices.classList.remove('sgr-hidden');
    el.quizResult.classList.add('sgr-hidden');
    el.quizOkBtn.textContent = '次へ';
    el.quizOkBtn.classList.remove('sgr-hidden');
    el.quizTrueBtn.disabled = false;
    el.quizFalseBtn.disabled = false;
    el.quizSource.textContent = quiz.poemNum ? ('出題：' + quiz.poemNum + '番 ' + quiz.poet) : '出題：百人一首クイズ';
    el.quizQuestion.innerHTML = quiz.q;
    // 以前はここでel.quizModal.scrollIntoView(...)を呼び、クイズが開くたびにページを
    // スクロールさせていたが、ボタンを押すたびに画面が動く原因になっていたため廃止。
    // クイズ出題中はサイコロエリアを隠して縦幅を抑えているので（openQuizModal冒頭参照）、
    // 強制スクロールしなくても大きくレイアウトが動くことはない想定。

    el.quizTimerBar.style.transition = 'none';
    el.quizTimerBar.style.width = '100%';
    void el.quizTimerBar.offsetWidth;
    el.quizTimerBar.style.transition = 'width ' + QUIZ_TIME_MS + 'ms linear';
    requestAnimationFrame(() => requestAnimationFrame(() => { el.quizTimerBar.style.width = '0%'; }));

    clearTimeout(quizTimeoutHandle);
    quizTimeoutHandle = setTimeout(() => finish(null), QUIZ_TIME_MS);

    function finish(choice) {
      clearTimeout(quizTimeoutHandle);
      // 回答したのでサイコロエリアを再表示する（正解時はここに出る「Nコマ進む」表示で進める）
      el.diceArea.classList.remove('sgr-hidden');
      // 進行中のタイムバーのアニメーションを、現在の幅で止める
      const currentWidth = getComputedStyle(el.quizTimerBar).width;
      el.quizTimerBar.style.transition = 'none';
      el.quizTimerBar.style.width = currentWidth;
      void el.quizTimerBar.offsetWidth;
      el.quizTrueBtn.disabled = true;
      el.quizFalseBtn.disabled = true;
      const correct = choice !== null && choice === quiz.answer;
      el.quizResultText.textContent = choice === null ? '⏰ 時間切れ…' : (correct ? '⭕ 正解！' : '✕ 不正解…');
      el.quizExplain.innerHTML = '解説：' + quiz.explain;
      el.quizChoices.classList.add('sgr-hidden');
      el.quizResult.classList.remove('sgr-hidden');

      const advance = () => {
        confirmMoveFn = null;
        el.diceScene.classList.add('is-disabled');
        el.turnIndicator.classList.add('is-disabled');
        el.turnIndicator.classList.remove('sgr-btn-blink');
        el.quizModal.classList.add('sgr-hidden');
        onFinish(correct);
      };
      el.quizOkBtn.onclick = advance;

      // 正解したときは、サイコロ／手番インジケーターのクリックが「次へ」の代わりになる
      // （不正解のときは対象外）。手番インジケーターを点滅させて押せる状態になったことを
      // 知らせ、「次へ」ボタン自体はもう不要なので非表示にする（不正解時は表示したまま）。
      if (correct) {
        confirmMoveFn = advance;
        el.diceScene.classList.remove('is-disabled');
        el.turnIndicator.classList.remove('is-disabled');
        el.turnIndicator.classList.add('sgr-btn-blink');
        el.quizOkBtn.classList.add('sgr-hidden');
      }
    }

    el.quizTrueBtn.onclick = () => finish(true);
    el.quizFalseBtn.onclick = () => finish(false);
  }

  /* ---------------------------------------------------------
     ターン進行
  --------------------------------------------------------- */
  function afterResolve() {
    if (state.gameOver) return;
    state.turnCount++;
    if (state.turnCount >= state.maxTurns) { forceEndGame(); return; }
    advanceTurn();
  }

  // ゴール済みのプレイヤーを飛ばして次の手番へ。全員ゴール済みならゲーム終了。
  function advanceTurn() {
    const n = state.players.length;
    for (let i = 1; i <= n; i++) {
      const idx = (state.currentPlayerIndex + i) % n;
      if (!state.players[idx].finished) {
        state.currentPlayerIndex = idx;
        startTurn();
        return;
      }
    }
    finishGame();
  }

  // サイコロが振れる状態かどうかを一括で切り替える（サイコロ本体・手番インジケーターの両方に反映）
  function setRollLocked(locked) {
    state.rollLocked = locked;
    el.diceScene.classList.toggle('is-disabled', locked);
    el.turnIndicator.classList.toggle('is-disabled', locked);
  }

  function startTurn() {
    if (state.gameOver) return;
    const player = state.players[state.currentPlayerIndex];
    renderPlayersPanel();
    highlightSquare(player.pos);
    syncSidePanelPosition();

    const prefix = state.players.length > 1 ? (player.emoji + ' ' + player.name + '：') : '';
    el.turnIndicator.textContent = prefix + (player.pendingTarget !== null
      ? ('🔁 ' + player.pendingTarget + 'コマ目のクイズに再挑戦しよう')
      : 'サイコロを振ろう！');
    setRollLocked(false);
  }

  function onRollClick() {
    // クイズに正解した直後は、サイコロ／手番インジケーターのクリックが「次へ」の代わりになる
    // （state.rollLockedは既にtrueのままなので、下の通常ガードより先にここで処理する）
    if (confirmMoveFn) {
      const fn = confirmMoveFn;
      fn();
      return;
    }

    if (state.gameOver || state.rollLocked) return;
    const player = state.players[state.currentPlayerIndex];

    // クイズに不正解で足止め中：サイコロは振り直さず、同じマス・同じクイズに再挑戦する
    if (player.pendingTarget !== null) {
      setRollLocked(true);
      // 再挑戦中も「Nコマ進む」表示に揃える（それまでの「🔁 再挑戦しよう」表示のままだと、
      // 正解時に「次へ」ボタンへ表示をミラーしたときに古い文言が出てしまうため）
      const prefix = state.players.length > 1 ? (player.emoji + ' ' + player.name + '：') : '';
      el.turnIndicator.textContent = player.pendingInstant
        ? (prefix + player.pendingTarget + 'コマ目へワープ！')
        : (prefix + (player.pendingTarget - player.pos) + 'コマ進む');
      attemptMoveTo(player, player.pendingTarget, { instant: player.pendingInstant });
      return;
    }

    setRollLocked(true);
    const value = 1 + Math.floor(Math.random() * 6);
    animateDice(value, () => {
      if (state.pendingSpecialRoll) {
        state.pendingSpecialRoll = false;
        resolveSpecialSquareRoll(value);
      } else {
        advanceByRoll(value);
      }
    });
  }

  // むべ山双六には「戻る」の選択肢が無く、出た目の数だけ必ず前に進む
  // （takaramono-sugoroku.jsにあった進む/戻るの方向選択UIはこのゲームには存在しない）。
  function advanceByRoll(value) {
    const player = state.players[state.currentPlayerIndex];
    const target = Math.min(player.pos + value, state.rangeEnd);
    const prefix = state.players.length > 1 ? (player.emoji + ' ' + player.name + '：') : '';
    el.turnIndicator.textContent = prefix + value + 'コマ進む';
    setTimeout(() => {
      attemptMoveTo(player, target, { instant: false });
    }, 500);
  }

  /* ---------------------------------------------------------
     精算所（結果）
  --------------------------------------------------------- */
  // 宝物・スコアが無いので、精算所は「ゴールした順」だけを表示するシンプルな内容にする。
  // state.turnCountは全プレイヤー共有のグローバルなターン数なので、手番数を表示してよいのは
  // 1人プレイのとき（＝プレイヤー自身の手番数と一致する）だけ。多人数プレイでは他のプレイヤーの
  // 手番も混ざって加算されているため、個々の到達手番数としては表示しない（着順だけ見せる）。
  function buildColHTML(player, opts) {
    const heading = (opts.rankLabel ? '<span class="sgr-result-rank">' + opts.rankLabel + '</span> ' : '') +
      player.emoji + ' ' + player.name + (player.finished ? ' 🏔️' : '');
    let statusLine;
    if (player.finished) {
      statusLine = opts.showTurns ? (state.turnCount + '回の手数でゴールしました！') : '上り（ゴール）！';
    } else {
      statusLine = '規定ターン数に到達（未ゴール）';
    }

    return '<div class="sgr-result-col' + (opts.isWinner ? ' is-winner' : '') + '">' +
      '<h3>' + heading + '</h3>' +
      '<p class="sgr-result-status">' + statusLine + '</p>' +
      '</div>';
  }

  function renderResult() {
    if (state.players.length === 1) {
      const player = state.players[0];
      // 自己ベストは0コマ目（スタート地点）から通しで遊んだときだけ記録・更新する。
      // 途中のマスから開始した回は手数が短くて当たり前なので対象外にする。
      const isFullCourse = state.rangeStart === 0;
      let best = loadBest();
      let isNewBest = false;

      if (player.finished && isFullCourse && (!best || state.turnCount < best.turns)) {
        isNewBest = true;
        best = { turns: state.turnCount, date: Date.now() };
        saveBest(best);
      }

      if (!player.finished) {
        el.resultBanner.textContent = '⏰ 規定ターン数に到達…（未クリア）';
      } else if (isNewBest) {
        el.resultBanner.textContent = '🎉 自己ベスト更新！';
      } else {
        el.resultBanner.textContent = '🏔️ 上り（ゴール）！';
      }

      el.resultCols.innerHTML = buildColHTML(player, { isWinner: isNewBest, rankLabel: null, showTurns: true });

      if (!player.finished) {
        el.resultBest.textContent = '未クリアのため自己ベストの対象外です。もう一度挑戦しよう。';
      } else if (isNewBest) {
        el.resultBest.textContent = '前回までの自己ベストを更新しました！';
      } else if (!isFullCourse) {
        el.resultBest.textContent = '0コマ目（スタート地点）から遊んだときだけ自己ベストの対象になります。'
          + (best ? '（現在の自己ベスト：' + best.turns + '回の手数でゴール）' : '');
      } else if (best) {
        el.resultBest.textContent = '自己ベスト：' + best.turns + '回の手数でゴール';
      } else {
        el.resultBest.textContent = '';
      }
    } else {
      // 先にゴールした順（finishOrder）に並べる。未ゴールのプレイヤーは末尾にまとめる。
      const sorted = state.players.slice().sort((a, b) => {
        if (a.finished && b.finished) return a.finishOrder - b.finishOrder;
        if (a.finished) return -1;
        if (b.finished) return 1;
        return 0;
      });
      const anyFinished = state.players.some((p) => p.finished);
      el.resultBanner.textContent = anyFinished ? '🏯 結果発表！先にゴールした順です' : '⏰ 規定ターン数に到達…（全員未ゴール）';
      el.resultCols.innerHTML = sorted.map((p) =>
        buildColHTML(p, { isWinner: p.finished && p.finishOrder === 1, rankLabel: p.finished ? (p.finishOrder + '位') : '―', showTurns: false })
      ).join('');
      el.resultBest.textContent = '';
    }

    el.gameoverPanel.classList.remove('sgr-hidden');
  }

  function finishGame() {
    if (state.gameOver) return;
    state.gameOver = true;
    setRollLocked(true);
    renderPlayersPanel();
    renderResult();
  }

  function forceEndGame() {
    if (state.gameOver) return;
    state.gameOver = true;
    setRollLocked(true);
    renderPlayersPanel();
    renderResult();
  }

  /* ---------------------------------------------------------
     ゲーム初期化・開始画面
  --------------------------------------------------------- */
  // スタート画面の「遊ぶ範囲」入力を読み取り、有効な範囲に丸め込んで state に反映する
  // （開始 < 終了、かつ 0〜COURSE_LENGTH-1 に収まるように補正。入力欄の表示も補正後の値に揃える）
  function readAndClampRange() {
    const maxIndex = COURSE_LENGTH - 1;
    let start = parseInt(el.rangeStartInput.value, 10);
    if (isNaN(start)) start = 0;
    start = Math.max(0, Math.min(maxIndex - 1, start));
    el.rangeStartInput.value = start;
    state.rangeStart = start;
    state.rangeEnd = maxIndex; // ゴールは常に固定（開始コマだけ選べる）
  }

  // 遊ぶ範囲の外側のマスを見た目で分かるように薄暗く表示する
  function applyRangeDimming() {
    state.squares.forEach((sq) => {
      const sqEl = document.getElementById('sgr-sq-' + sq.index);
      if (!sqEl) return;
      sqEl.classList.toggle('sgr-sq-out-of-range', sq.index < state.rangeStart || sq.index > state.rangeEnd);
    });
  }

  function initGame() {
    readAndClampRange();
    state.squares = buildCourse(COURSE_LENGTH);
    state.maxTurns = MAX_TURNS;
    state.turnCount = 0;
    state.gameOver = false;
    state.pendingSpecialRoll = false;
    state.finishedCount = 0;
    confirmMoveFn = null;
    el.diceArea.classList.remove('sgr-hidden');
    state.diceRot = { x: 0, y: 0 };
    el.dice.style.transition = 'none';
    el.dice.style.transform = 'rotateX(0deg) rotateY(0deg)';
    void el.dice.offsetWidth;
    el.dice.style.transition = '';

    state.players = [];
    for (let i = 0; i < setupCount; i++) {
      state.players.push(makeFreshPlayer(i, setupAvatars[i]));
    }
    state.players.forEach(createPlayerToken);
    state.currentPlayerIndex = 0;
    state.lastHighlight = null;

    renderBoard();
    applyRangeDimming();
    layoutBoard();
    renderPlayersPanel();
    state.players.forEach((p) => placeToken(p, p.pos));
    highlightSquare(state.rangeStart);

    startTurn();
  }

  function resetToStart() {
    state.gameOver = true; // 進行中のタイマー等を止める
    clearTimeout(quizTimeoutHandle);
    clearTimeout(toastTimer);
    confirmMoveFn = null;
    el.turnIndicator.classList.remove('sgr-btn-blink');
    el.quizOkBtn.classList.remove('sgr-hidden');
    el.quizChoices.classList.remove('sgr-hidden');
    el.diceArea.classList.remove('sgr-hidden');
    el.toast.classList.remove('is-show');
    // 紅葉・桜吹雪の演出が終わりきる前にリセットされることがあるため、残っている
    // パーティクル／フラッシュ要素とグロー演出を強制的に片付ける（そうしないと、
    // sgr-game-screenが非表示→再表示されたときにアニメーションが再開してしまい、
    // 次のゲーム画面に前回の演出が紛れ込んで見える不具合になる）
    if (el.sparkleLayer) el.sparkleLayer.innerHTML = '';
    el.gameScreen.classList.remove('sgr-sparkle-glow', 'sgr-sparkle-glow-pink');
    el.quizModal.classList.add('sgr-hidden');
    el.gameoverPanel.classList.add('sgr-hidden');
    el.poemModal.classList.add('sgr-hidden');
    el.gameScreen.classList.add('sgr-hidden');
    el.startScreen.classList.remove('sgr-hidden');
    if (el.sidePanel) el.sidePanel.style.transform = '';
    updateBestDisplay();
  }

  function wireEvents() {
    el.startBtn.addEventListener('click', () => {
      el.startScreen.classList.add('sgr-hidden');
      el.gameScreen.classList.remove('sgr-hidden');
      initGame();
    });
    el.playAgainBtn.addEventListener('click', resetToStart);

    // 【開発用】?dev=1のときだけパネルを表示し、任意のコマへの即移動ボタンを有効化する
    if (DEV_MODE) {
      el.devPanel.classList.remove('sgr-hidden');
      el.devJumpBtn.addEventListener('click', () => {
        const val = parseInt(el.devTargetInput.value, 10);
        if (!isNaN(val)) devJumpToSquare(val);
      });
      el.devJumpQuizBtn.addEventListener('click', () => {
        const val = parseInt(el.devTargetInput.value, 10);
        if (!isNaN(val)) devJumpToSquareWithQuiz(val);
      });
    }

    el.diceScene.addEventListener('click', onRollClick);
    el.diceScene.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        onRollClick();
      }
    });
    el.turnIndicator.addEventListener('click', onRollClick);
    el.turnIndicator.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        onRollClick();
      }
    });
    window.addEventListener('resize', handleResize);

    el.countChoices.addEventListener('click', (e) => {
      const btn = e.target.closest('.sgr-count-btn');
      if (!btn) return;
      setupCount = Number(btn.dataset.count);
      Array.prototype.forEach.call(el.countChoices.querySelectorAll('.sgr-count-btn'), (b) => {
        b.classList.toggle('is-selected', b === btn);
      });
      renderPlayerSetup();
    });

    el.playerSetup.addEventListener('click', (e) => {
      const btn = e.target.closest('.sgr-avatar-btn');
      if (!btn || btn.disabled) return;
      const idx = Number(btn.dataset.idx);
      setupAvatars[idx] = btn.dataset.emoji;
      renderPlayerSetup();
    });

    // コマをクリックすると、そのマスの歌人の歌をモーダル表示する
    el.board.addEventListener('click', (e) => {
      const sq = e.target.closest('.sgr-square');
      if (!sq) return;
      const idx = Number(sq.id.replace('sgr-sq-', ''));
      if (isNaN(idx)) return;
      openPoemModal(idx);
    });
    el.poemCloseBtn.addEventListener('click', closePoemModal);
    el.poemModal.addEventListener('click', (e) => {
      if (e.target === el.poemModal) closePoemModal(); // 背景（オーバーレイ）クリックで閉じる
    });
  }

  // 盤面の表示サイズ：標準は画面幅に合わせて全体を表示。狭い画面では「盤面を拡大」で
  // 640px幅に広げ（.is-zoomed）、横スクロールしながら各マスをタップしやすくできる。
  // 拡大したときは、手番のプレイヤーのコマがあるマスが盤面の中央に来るようにスクロールする。
  function wireBoardZoom() {
    const btn = document.getElementById('sgr-board-zoom');
    const scrollEl = el.boardScroll;
    if (!btn || !scrollEl) return;
    btn.addEventListener('click', () => {
      const zoomed = scrollEl.classList.toggle('is-zoomed');
      btn.setAttribute('aria-pressed', zoomed ? 'true' : 'false');
      btn.textContent = zoomed ? '画面幅に合わせる' : '盤面を拡大';
      // 盤面の幅が変わったので、コマ・バッジの大きさを盤面幅に合わせて計算し直す
      layoutBoard();
      if (zoomed) centerOnCurrentPlayer();
    });
  }

  function centerOnCurrentPlayer() {
    const player = state.players[state.currentPlayerIndex];
    if (!player) return;
    const sqEl = document.getElementById('sgr-sq-' + player.pos);
    const scrollEl = el.boardScroll;
    if (!sqEl || !scrollEl) return;
    const sqRect = sqEl.getBoundingClientRect();
    const containerRect = scrollEl.getBoundingClientRect();
    scrollEl.scrollLeft += (sqRect.left + sqRect.width / 2) - (containerRect.left + containerRect.width / 2);
  }

  document.addEventListener('DOMContentLoaded', () => {
    cacheDom();
    renderPlayerSetup();
    wireEvents();
    wireBoardZoom();
    updateBestDisplay();
  });
})();
