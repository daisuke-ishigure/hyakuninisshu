// ../js/move_script.js

// 百人一首データ（抜粋・簡略化）
// 歌人名と和歌を改行して表示するため、歌の本文データから句ごとの <br> タグを削除しています。
const hyakuninIsshu = [
    {
        poem: "<ruby>秋<rt>あき</rt></ruby>の<ruby>田<rt>た</rt></ruby>の かりほの<ruby>庵<rt>いお</rt></ruby>の <ruby>苫<rt>とま</rt></ruby>をあらみ <ruby>我<rt>わ</rt></ruby>が<ruby>衣手<rt>ころもで</rt></ruby>は <ruby>露<rt>つゆ</rt></ruby>にぬれつつ",
        meaning: "By the rice fields, in a makeshift hut with a loosely woven roof, my sleeves are wet with the night dew.",
        love: "Even when things feel lonely, holding on with patience will surely bring its reward. Stay genuine and take your time.",
        work: "This is a time when steady effort bears fruit. Do not cut corners even on unnoticed tasks — solidifying the basics will lead to great results.",
        poet: "Emperor Tenji",
        poetJa: "天智天皇",
        luck: "中吉"
    },
    {
        poem: "<ruby>春<rt>はる</rt></ruby><ruby>過<rt>す</rt></ruby>ぎて <ruby>夏<rt>なつ</rt></ruby><ruby>来<rt>きた</rt></ruby>るらし <ruby>白妙<rt>しろたえ</rt></ruby>の <ruby>衣<rt>ころも</rt></ruby><ruby>干<rt>ほ</rt></ruby>したり <ruby>天<rt>あま</rt></ruby>の<ruby>香具山<rt>かぐやま</rt></ruby>",
        meaning: "Spring has passed and summer seems to have come — white robes are said to be hung out to dry on the heavenly Mount Kagu.",
        love: "Signs of dramatic change are here. A stalled relationship may surge forward, or a new connection may emerge. Embrace the shift rather than fear it.",
        work: "Ideas and plans are moving quickly toward realization. Swift action is the key to success. Now is the time to put that long-cherished project into motion.",
        poet: "Empress Jitō",
        poetJa: "持統天皇",
        luck: "吉"
    },
    {
        poem: "あしびきの <ruby>山鳥<rt>やまどり</rt></ruby>の<ruby>尾<rt>お</rt></ruby>の しだり<ruby>尾<rt>お</rt></ruby>の ながながし<ruby>夜<rt>よ</rt></ruby>を ひとりかも<ruby>寝<rt>ね</rt></ruby><ruby>む<rt>ん</rt></ruby>",
        meaning: "As long as the trailing tail feathers of the mountain bird — through these long, long nights, must I sleep alone?",
        love: "Even when apart, hearts can still reach each other. The ache of distance only deepens the bond.",
        work: "The path to your goal is long, but do not give up. That effort will connect to a major success.",
        poet: "Kakinomoto no Hitomaro",
        poetJa: "柿本人麻呂",
        luck: "小吉"
    },
    {
        poem: "<ruby>田子<rt>たご</rt></ruby>の<ruby>浦<rt>うら</rt></ruby>に うちいでてみれば<br><ruby>白妙<rt>しろたえ</rt></ruby>の <ruby>富士<rt>ふじ</rt></ruby>の<ruby>高嶺<rt>たかね</rt></ruby>に <ruby>雪<rt>ゆき</rt></ruby>は<ruby>降<rt>ふ</rt></ruby>りつつ",
        meaning: "Going out to Tago Bay and looking around, I see snow falling ceaselessly on the high peak of Fuji, white as freshly woven cloth.",
        love: "A bright opening lies ahead — a sign of great luck. Your charm is growing and many eyes will soon turn your way.",
        work: "The hard work you have put in is paying off — this is your chance to step into the spotlight.",
        poet: "Yamabe no Akahito",
        poetJa: "山部赤人",
        luck: "大吉"
    },
    {
        poem: "<ruby>奥山<rt>おくやま</rt></ruby>に <ruby>紅葉<rt>もみじ</rt></ruby><ruby>踏<rt>ふ</rt></ruby>み<ruby>分<rt>わ</rt></ruby>け <ruby>鳴<rt>な</rt></ruby>く<ruby>鹿<rt>しか</rt></ruby>の <ruby>声<rt>こえ</rt></ruby><ruby>聞<rt>き</rt></ruby>く<ruby>時<rt>とき</rt></ruby>ぞ <ruby>秋<rt>あき</rt></ruby>はかなしき",
        meaning: "Deep in the mountains, treading through the scattered autumn leaves, I hear a deer cry. Listening to that voice, I feel the sadness of autumn all the more.",
        love: "This is a time to wait quietly rather than rush. Polish yourself, and the good news you are hoping for will come.",
        work: "Now is a good time to pause and reexamine the path you truly need to take. Following your inner voice will promise a great harvest in the future.",
        poet: "Sarumaru Dayū",
        poetJa: "猿丸太夫",
        luck: "末吉"
    },
    {
        poem: "かささぎの <ruby>渡<rt>わた</rt></ruby>せる<ruby>橋<rt>はし</rt></ruby>に おく<ruby>霜<rt>しも</rt></ruby>の <ruby>白<rt>しろ</rt></ruby>きをみれば <ruby>夜<rt>よ</rt></ruby>ぞふけにける",
        meaning: "Looking up at the Milky Way that magpies wing across — its white shimmer seems to be scattered frost. The night deepens.",
        love: "Even now, though apart, an unshakeable bond ties you together. Trusting each other is the key to deepening the relationship.",
        work: "Even on a difficult path, unseen help and support will surely appear. Stay humble and grateful, and the way forward will open.",
        poet: "Middle Counselor Yakamochi",
        poetJa: "中納言家持",
        luck: "中吉"
    },
    {
        poem: "<ruby>天<rt>あま</rt></ruby>の<ruby>原<rt>はら</rt></ruby> ふりさけみれば<br><ruby>春日<rt>かすが</rt></ruby>なる <ruby>三笠<rt>みかさ</rt></ruby>の<ruby>山<rt>やま</rt></ruby>に <ruby>出<rt>い</rt></ruby>でし<ruby>月<rt>つき</rt></ruby>かも",
        meaning: "Looking up at the vast sky, I see the moon. Is that the same moon that rose over Mount Mikasa in Kasuga, so long ago?",
        love: "Distance cannot sever a truly important connection. The effort to stay in each other's hearts will only strengthen the bond.",
        work: "When things feel chaotic, go back to the founding spirit and original purpose. Revisiting your unwavering beliefs and core values will clarify the path ahead.",
        poet: "Abe no Nakamaro",
        poetJa: "阿倍仲麻呂",
        luck: "中吉"
    },
    {
        poem: "わが<ruby>庵<rt>いお</rt></ruby>は <ruby>都<rt>みやこ</rt></ruby>の<ruby>辰巳<rt>たつみ</rt></ruby> しかぞすむ <ruby>世<rt>よ</rt></ruby>をう<ruby>ぢ<rt>じ</rt></ruby><ruby>山<rt>やま</rt></ruby>と <ruby>人<rt>ひと</rt></ruby>はい<ruby>ふ<rt>う</rt></ruby>なり",
        meaning: "My home is in the southeast of the capital, and I live here at peace. People say I moved to Mount Uji because I found the world hard to bear — but that is only what others say.",
        love: "Step back from the noise of human relationships and quietly settle your mind. Regaining inner calm will paradoxically draw important people closer.",
        work: "Mental fatigue has been building up. Rather than pushing forward, consciously take rest and restore your energy. Rest is not retreat — it is preparation for a great leap.",
        poet: "Priest Kisen",
        poetJa: "喜撰法師",
        luck: "小吉"
    },
    {
        poem: "<ruby>花<rt>はな</rt></ruby>の<ruby>色<rt>いろ</rt></ruby>は うつりにけりな いた<ruby>づ<rt>ず</rt></ruby>らに わが<ruby>身<rt>み</rt></ruby>よにふる ながめせしまに",
        meaning: "How the beauty of the cherry blossoms faded away, soaked by the long spring rains. And just like them, my own looks have faded too, lost in a haze of endless longing.",
        love: "Outward beauty fades. The depth of heart and warmth cultivated through reflection are the source of a love that never loses its color. Nurturing your inner light is the key to a lasting love.",
        work: "Even if you regret a missed opportunity, it was a valuable time for reflection and learning. Use the insight and knowledge you have gained to quietly deepen your expertise. Your inner intelligence and composure will become unshakeable confidence and lead you to success.",
        poet: "Ono no Komachi",
        poetJa: "小野小町",
        luck: "末吉"
    },
    {
        poem: "これやこの <ruby>行<rt>ゆ</rt></ruby>くも<ruby>帰<rt>かえ</rt></ruby>るも わかれては しるもしらぬも <ruby>逢坂<rt>おうさか</rt></ruby>の<ruby>関<rt>せき</rt></ruby>",
        meaning: "So this is it — the Barrier of Ōsaka, where those who leave and those who return, those who know each other and those who do not, all meet and part.",
        love: "Meeting and parting are the natural rhythm of life. Rather than clinging, accepting change with a flexible heart will bring good fortune.",
        work: "Circumstances are constantly shifting and change is swirling around you. Now is the time to stay flexible in your thinking and approach, and ride the current.",
        poet: "Semimaru",
        poetJa: "蝉丸",
        luck: "中吉"
    },
    {
        poem: "わたの<ruby>原<rt>はら</rt></ruby> <ruby>八十島<rt>やそしま</rt></ruby>かけて <ruby>漕<rt>こ</rt></ruby>ぎ<ruby>出<rt>い</rt></ruby>でぬと <ruby>人<rt>ひと</rt></ruby>にはつげよ あまのつり<ruby>舟<rt>ぶね</rt></ruby>",
        meaning: "I have set out rowing across the vast sea, heading for the many islands far away. Tell the people back home.",
        love: "Even through temporary separation or hardship, pressing forward with a strong will only deepens the bond, no matter the distance.",
        work: "Adversity is a chance to test your convictions and talents. An unbreakable spirit focused on your goal, undistracted by those around you, will lead to success.",
        poet: "Councillor Takamura",
        poetJa: "参議篁",
        luck: "末吉"
    },
    {
        poem: "<ruby>天<rt>あま</rt></ruby>つ<ruby>風<rt>かぜ</rt></ruby> <ruby>雲<rt>くも</rt></ruby>のかよ<ruby>ひ<rt>い</rt></ruby><ruby>路<rt>じ</rt></ruby> <ruby>吹<rt>ふ</rt></ruby>きと<ruby>ぢ<rt>じ</rt></ruby>よ をとめの<ruby>姿<rt>すがた</rt></ruby> しばしとどめ<ruby>む<rt>ん</rt></ruby>",
        meaning: "Heavenly wind, please close the path through the clouds! I want to keep the celestial maidens here a little longer.",
        love: "Your heart is drawn to an unrealistic romance. Plant your feet on the ground and seek harmony between ideals and reality.",
        work: "Imagination and artistic sensitivity are heightened now. Give them concrete form and things will go well.",
        poet: "High Priest Henjō",
        poetJa: "僧正遍昭",
        luck: "小吉"
    },
    {
        poem: "<ruby>筑波嶺<rt>つくばね</rt></ruby>の <ruby>峰<rt>みね</rt></ruby>より<ruby>落<rt>お</rt></ruby>つる みなの<ruby>川<rt>がわ</rt></ruby> こひぞつもりて <ruby>淵<rt>ふち</rt></ruby>となりぬる",
        meaning: "Just as the streams from the peak of Tsukuba flow down to fill the deep pools of the Mina River, so my love for you has gathered deep within me.",
        love: "Your passion for the other person may run so deep that it becomes a burden at times. Cherish your feelings while also leaving space for breathing room.",
        work: "Rather than spreading yourself thin, deep focus on a single goal will earn you remarkable results and the recognition of those around you.",
        poet: "Retired Emperor Yōzei",
        poetJa: "陽成院",
        luck: "中吉"
    },
    {
        poem: "<ruby>陸奥<rt>みちのく</rt></ruby>の しのぶも<ruby>ぢ<rt>じ</rt></ruby>ずり <ruby>誰<rt>たれ</rt></ruby>ゆ<ruby>ゑ<rt>え</rt></ruby>に <ruby>乱<rt>みだ</rt></ruby>れそめにし <ruby>我<rt>われ</rt></ruby>ならなくに",
        meaning: "For whose sake has my heart become as disordered as the tangled patterns of Shinobu-mojizuri cloth of Mutsu? It is certainly not my own doing.",
        love: "Confusion of the heart is a sign that love is beginning. Tend to that passion with care, even if you feel uncertain.",
        work: "Even in confusion there are chances to grow. Turn passion into action and creation, and the path will open.",
        poet: "Minister of the Left of Kawara",
        poetJa: "河原左大臣",
        luck: "吉"
    },
    {
        poem: "<ruby>君<rt>きみ</rt></ruby>がため <ruby>春<rt>はる</rt></ruby>の<ruby>野<rt>の</rt></ruby>に<ruby>出<rt>い</rt></ruby>でて <ruby>若菜<rt>わかな</rt></ruby>つむ わが<ruby>衣手<rt>ころもで</rt></ruby>に <ruby>雪<rt>ゆき</rt></ruby>は<ruby>降<rt>ふ</rt></ruby>りつつ",
        meaning: "Going out into the spring fields to pick young greens for you — the snow falls on my sleeves.",
        love: "Your sincere feelings are reaching the other person, and the love between you is poised to deepen further.",
        work: "The sincere effort you have put in is taking shape, and you are set to earn the trust and recognition of those around you.",
        poet: "Emperor Kōkō",
        poetJa: "光孝天皇",
        luck: "吉"
    },
    {
        poem: "<ruby>立<rt>た</rt></ruby>ち<ruby>別<rt>わか</rt></ruby>れ いなばの<ruby>山<rt>やま</rt></ruby>の <ruby>峰<rt>みね</rt></ruby>に<ruby>生<rt>お</rt></ruby><ruby>ふ<rt>う</rt></ruby>る まつとし<ruby>聞<rt>き</rt></ruby>かば <ruby>今<rt>いま</rt></ruby><ruby>帰<rt>かえ</rt></ruby>りこ<ruby>む<rt>ん</rt></ruby>",
        meaning: "I am leaving for the province of Inaba, where the pines grow on the mountain peak. If I hear that you are waiting for me, I will come back right away.",
        love: "Trust and wait, and a reunion will surely come.",
        work: "A good time for new challenges. Trust is the key to success.",
        poet: "Middle Counselor Yukihira",
        poetJa: "中納言行平",
        luck: "中吉"
    },
    {
        poem: "ちはやぶる <ruby>神代<rt>かみよ</rt></ruby>もきかず <ruby>竜田川<rt>たつたがわ</rt></ruby> から<ruby>紅<rt>くれない</rt></ruby>に <ruby>水<rt>みず</rt></ruby>くくるとは",
        meaning: "Even the ancient gods never heard of this — the Tatsuta River, dyeing its waters a deep crimson with fallen maple leaves.",
        love: "The flames of passionate romance wrap around you. Enjoy the glow of that love, even if it is fleeting.",
        work: "Talent and opportunity are arriving. Pair your passion with a cool head and solid success is within reach.",
        poet: "Ariwara no Narihira Ason",
        poetJa: "在原業平朝臣",
        luck: "吉"
    },
    {
        poem: "<ruby>住<rt>すみ</rt></ruby>の<ruby>江<rt>え</rt></ruby>の <ruby>岸<rt>きし</rt></ruby>による<ruby>波<rt>なみ</rt></ruby> よるさ<ruby>へ<rt>え</rt></ruby>や <ruby>夢<rt>ゆめ</rt></ruby>のかよひ<ruby>路<rt>じ</rt></ruby> <ruby>人目<rt>ひとめ</rt></ruby>よくら<ruby>む<rt>ん</rt></ruby>",
        meaning: "Even in my dreams, I find myself longing to go to you along the path of dreams — but do I hide from others' eyes even in the night?",
        love: "Your ideals have climbed too high. Rather than drifting on dreams, stay grounded and keep a healthy balance with reality.",
        work: "Intuition is the key to success. Trust your flashes of inspiration and act on them.",
        poet: "Fujiwara no Toshiyuki Ason",
        poetJa: "藤原敏行朝臣",
        luck: "小吉"
    },
    {
        poem: "<ruby>難波潟<rt>なにわがた</rt></ruby> みじかき<ruby>葦<rt>あし</rt></ruby>の ふしのまも <ruby>逢<rt>あ</rt></ruby><ruby>は<rt>わ</rt></ruby>でこの<ruby>世<rt>よ</rt></ruby>を <ruby>過<rt>す</rt></ruby>ぐしてよとや",
        meaning: "In this short life, even as brief as a joint of reed at Naniwa Bay, must I pass through this world without ever meeting you?",
        love: "The longing to meet, even for just a brief moment, grows stronger. Cherish the time you have with the one who matters to you.",
        work: "The challenge now is how deeply you can concentrate in limited time. Pursuing efficiency will lead to great results.",
        poet: "Ise",
        poetJa: "伊勢",
        luck: "中吉"
    },
    {
        poem: "わびぬれば いまはたおなじ <ruby>難波<rt>なにわ</rt></ruby>なる みをつくしても <ruby>逢<rt>あ</rt></ruby><ruby>は<rt>わ</rt></ruby><ruby>む<rt>ん</rt></ruby>とぞ<ruby>思<rt>おも</rt></ruby><ruby>ふ<rt>う</rt></ruby>",
        meaning: "Since things have come to this, it no longer matters. Even if I must sacrifice everything, I still want to meet you.",
        love: "Loneliness and pain may feel like they stretch on without end, but this is a time to endure. Wait quietly without rushing — time will work it out.",
        work: "Things are stalled and progress feels painfully slow. Rather than forcing movement, maintain the status quo and build inner strength — it will fuel a major leap later on.",
        poet: "Prince Motoyoshi",
        poetJa: "元良親王",
        luck: "末吉"
    },
    {
        poem: "<ruby>今<rt>いま</rt></ruby>こ<ruby>む<rt>ん</rt></ruby>と い<ruby>ひ<rt>い</rt></ruby>しばかりに <ruby>長月<rt>ながつき</rt></ruby>の <ruby>有明<rt>ありあけ</rt></ruby>の<ruby>月<rt>つき</rt></ruby>を <ruby>待<rt>ま</rt></ruby>ち<ruby>出<rt>い</rt></ruby>でつるかな",
        meaning: "Just because you said \"I will come right away\" — I waited all night for you, watching the moon of the long autumn month until it set at dawn.",
        love: "The pain of parting is only temporary. You are destined to reunite with someone precious soon. Believe in the future and there is no need to fear farewells.",
        work: "No matter how difficult the situation, a hopeful light of resolution is visible. An optimistic attitude and positive action will turn things around.",
        poet: "Priest Sosei",
        poetJa: "素性法師",
        luck: "吉"
    },
    {
        poem: "<ruby>吹<rt>ふ</rt></ruby>くからに <ruby>秋<rt>あき</rt></ruby>の<ruby>草木<rt>くさき</rt></ruby>の しをるれば むべ<ruby>山風<rt>やまかぜ</rt></ruby>を <ruby>嵐<rt>あらし</rt></ruby>とい<ruby>ふ<rt>う</rt></ruby>ら<ruby>む<rt>ん</rt></ruby>",
        meaning: "The moment the autumn wind blows, the grasses and trees wither. Now I understand why the mountain wind is called \"arashi\" — storm.",
        love: "Change is a good sign. A bright attitude and a warm smile will deepen the bond between you.",
        work: "A time of major change is coming. Stay loose rather than stiff, keep your sense of humor, and you will come through it.",
        poet: "Fun'ya no Yasuhide",
        poetJa: "文屋康秀",
        luck: "中吉"
    },
    {
        poem: "<ruby>月<rt>つき</rt></ruby>みれば ちぢにものこそ <ruby>悲<rt>かな</rt></ruby>しけれ わが<ruby>身<rt>み</rt></ruby><ruby>一<rt>ひと</rt></ruby>つの <ruby>秋<rt>あき</rt></ruby>にはあらねど",
        meaning: "When I look at the moon, a thousand thoughts rise up and fill me with sadness. Yet this autumn is not mine alone.",
        love: "You are moved by the beauty around you and inclined to lose yourself in thought. Be mindful not to overthink, and remember to take real steps forward.",
        work: "Artistic sensitivity and emotion are richly alive in you now. Honor your own sensibility and apply it to creative work or problem-solving, and success will follow.",
        poet: "Ōe no Chisato",
        poetJa: "大江千里",
        luck: "小吉"
    },
    {
        poem: "このたびは <ruby>幣<rt>ぬさ</rt></ruby>もとりあ<ruby>へ<rt>え</rt></ruby>ず <ruby>手向山<rt>たむけやま</rt></ruby> もみぢのにしき <ruby>神<rt>かみ</rt></ruby>のまにまに",
        meaning: "This time I have no offerings ready, O Tamukeyama. Please, grant me safe passage — I leave it in the hands of the gods.",
        love: "This is a time to sense the impermanence of love and life. Accepting that all things pass can paradoxically help you treasure each present moment.",
        work: "This is a time to brace yourself with the awareness that life is a journey with an eventual end. That awareness is what clarifies what must be done now and promises a fulfilling life.",
        poet: "Kanke",
        poetJa: "菅家",
        luck: "中吉"
    },
    {
        poem: "<ruby>名<rt>な</rt></ruby>にし<ruby>負<rt>お</rt></ruby>はば <ruby>逢坂山<rt>おうさかやま</rt></ruby>の さねか<ruby>づ<rt>ず</rt></ruby>ら <ruby>人<rt>ひと</rt></ruby>にしられで くるよしもがな",
        meaning: "If the name of Ōsaka carries its meaning — then let me secretly follow the vine I draw toward me, and come to you unseen.",
        love: "Unreachable ideals and longings set your heart ablaze. Use that passion as your driving force, while keeping enough calm to see the other person clearly.",
        work: "New areas of interest and fields worth deep study are emerging. Actively acquiring knowledge and experience will dramatically expand your abilities.",
        poet: "Minister of the Right of Sanjō",
        poetJa: "三条右大臣",
        luck: "中吉"
    },
    {
        poem: "<ruby>小倉山<rt>おぐらやま</rt></ruby> <ruby>峰<rt>みね</rt></ruby>のもみ<ruby>ぢ<rt>じ</rt></ruby><ruby>葉<rt>は</rt></ruby> <ruby>心<rt>こころ</rt></ruby>あらば <ruby>今<rt>いま</rt></ruby>ひとたびの みゆき<ruby>待<rt>ま</rt></ruby>たな<ruby>む<rt>ん</rt></ruby>",
        meaning: "O maple leaves of Ogura Mountain, if you have a heart — hold on a little longer, until the emperor's visit.",
        love: "Rather than rushing into action, this is a time to wait patiently for the right moment. The quiet, steady effort you have put in will bear fruit.",
        work: "A pivotal opportunity will come your way. Do not neglect your preparation for it.",
        poet: "Teishin-kō",
        poetJa: "貞信公",
        luck: "吉"
    },
    {
        poem: "みかの<ruby>原<rt>はら</rt></ruby> わきて<ruby>流<rt>なが</rt></ruby>るる い<ruby>づ<rt>ず</rt></ruby>み<ruby>川<rt>がわ</rt></ruby> いつ<ruby>見<rt>み</rt></ruby>きとてか <ruby>恋<rt>こい</rt></ruby>しかるら<ruby>む<rt>ん</rt></ruby>",
        meaning: "Like the Izumi River that wells up and flows through Mika Plain — when did I first see you, that I should long for you so?",
        love: "You feel a powerful pull you cannot quite explain. A fateful connection is beginning to stir between you and someone you have not yet grown close to, or someone you have long admired. Follow your heart rather than your head, and an unexpected romance or deep bond may unfold.",
        work: "Even without a visible trigger, a powerful impulse — I want to do this — is welling up from within. That passion is the essential message pointing you toward your path. Trust the enthusiasm rising from the bottom of your heart and act on it. Great results await in that field.",
        poet: "Middle Counselor Kanesuke",
        poetJa: "中納言兼輔",
        luck: "吉"
    },
    {
        poem: "<ruby>山里<rt>やまざと</rt></ruby>は <ruby>冬<rt>ふゆ</rt></ruby>ぞさびしさ まさりける <ruby>人目<rt>ひとめ</rt></ruby>も<ruby>草<rt>くさ</rt></ruby>も かれぬと<ruby>思<rt>おも</rt></ruby><ruby>へ<rt>え</rt></ruby>ば",
        meaning: "In a mountain village, loneliness deepens in winter. Not only people disappear — the grass too withers away.",
        love: "Not glamorous, but this is a time to nurture a true love where hearts genuinely meet. Look inward rather than at appearances.",
        work: "Now is the time to pursue the substance of things and genuine inner growth rather than being misled by surface gains or appearances. Real ability — not pretense — will bring success.",
        poet: "Minamoto no Muneyuki Ason",
        poetJa: "源宗于",
        luck: "中吉"
    },
    {
        poem: "<ruby>心当<rt>こころあ</rt></ruby>てに <ruby>折<rt>お</rt></ruby>らばや<ruby>折<rt>お</rt></ruby>ら<ruby>む<rt>ん</rt></ruby> <ruby>初霜<rt>はつしも</rt></ruby>の おきまど<ruby>は<rt>わ</rt></ruby>せる <ruby>白菊<rt>しらぎく</rt></ruby>の<ruby>花<rt>はな</rt></ruby>",
        meaning: "Shall I pick it or not? The white chrysanthemum lies hidden beneath the first frost, and I cannot tell them apart.",
        love: "The other person's heart is as hard to grasp as a white chrysanthemum in the frost. Take your time and focus on polishing your own sincerity.",
        work: "Even in confusion, trust your intuition. A pure sensitivity that sees to the heart of things will lead you to success.",
        poet: "Ōshikōchi no Mitsune",
        poetJa: "凡河内躬恒",
        luck: "小吉"
    },
    {
        poem: "<ruby>有明<rt>ありあけ</rt></ruby>の つれなく<ruby>見<rt>み</rt></ruby>えし <ruby>別<rt>わか</rt></ruby>れより あかつきばかり <ruby>憂<rt>う</rt></ruby>きものはなし",
        meaning: "Ever since that cold dawn when we parted, I have come to dread the break of day more than anything in the world.",
        love: "Look back on the past and apply its lessons to your love today.",
        work: "Past experience holds the hints you need to solve today's challenges.",
        poet: "Mibu no Tadamine",
        poetJa: "壬生忠岑",
        luck: "中吉"
    },
    {
        poem: "<ruby>朝<rt>あさ</rt></ruby>ぼらけ <ruby>有明<rt>ありあけ</rt></ruby>の<ruby>月<rt>つき</rt></ruby>と <ruby>見<rt>み</rt></ruby>るまでに <ruby>吉野<rt>よしの</rt></ruby>の<ruby>里<rt>さと</rt></ruby>に <ruby>降<rt>ふ</rt></ruby>れる<ruby>白雪<rt>しらゆき</rt></ruby>",
        meaning: "In the early morning light, the village of Yoshino is blanketed in white — it looks just like the pale glow of the dawn moon.",
        love: "Love shines clear and pure — old grudges dissolve and a new romance is ready to begin.",
        work: "The fog is clearing, bringing sharp solutions and inspiration. This is the time to make bold decisions and seize results.",
        poet: "Sakanoue no Korenori",
        poetJa: "坂上是則",
        luck: "大吉"
    },
    {
        poem: "<ruby>山川<rt>やまがわ</rt></ruby>に <ruby>風<rt>かぜ</rt></ruby>のかけたる しがらみは <ruby>流<rt>なが</rt></ruby>れもあ<ruby>へ<rt>え</rt></ruby>ぬ <ruby>紅葉<rt>もみじ</rt></ruby>なりけり",
        meaning: "The weir of fallen maple leaves, caught by the mountain wind across the stream — the water cannot flow through.",
        love: "Let the swift current of change carry you. Stay flexible and do not cling to what has passed.",
        work: "Let go of old habits and catch the new current, and success will follow.",
        poet: "Harumichi no Tsuraki",
        poetJa: "春道列樹",
        luck: "末吉"
    },
    {
        poem: "<ruby>久方<rt>ひさかた</rt></ruby>の <ruby>光<rt>ひかり</rt></ruby>のどけき <ruby>春<rt>はる</rt></ruby>の<ruby>日<rt>ひ</rt></ruby>に しづ<ruby>心<rt>こころ</rt></ruby>なく <ruby>花<rt>はな</rt></ruby>の<ruby>散<rt>ち</rt></ruby>るら<ruby>む<rt>ん</rt></ruby>",
        meaning: "In the peaceful light of a spring day, why do the cherry blossoms scatter so restlessly?",
        love: "Know the fragility of love and cherish each moment you have right now.",
        work: "In a quiet period, refine the sensitivity to see what truly matters and let it become the key to producing something of value.",
        poet: "Ki no Tomonori",
        poetJa: "紀友則",
        luck: "中吉"
    },
    {
        poem: "<ruby>誰<rt>たれ</rt></ruby>をかも <ruby>知<rt>し</rt></ruby>る<ruby>人<rt>ひと</rt></ruby>にせ<ruby>む<rt>ん</rt></ruby> <ruby>高砂<rt>たかさご</rt></ruby>の <ruby>松<rt>まつ</rt></ruby>も<ruby>昔<rt>むかし</rt></ruby>の <ruby>友<rt>とも</rt></ruby>ならなくに",
        meaning: "Who can I call a true friend now? Even the old pine of Takasago knew the friends of long ago no longer.",
        love: "Rather than longing for the past, treasure the warmth of the bonds you have today and find a deep love within them.",
        work: "Solitude is a sign of a new challenge. Now is the time to draw on your experience and wisdom to build something worthwhile.",
        poet: "Fujiwara no Okikaze",
        poetJa: "藤原興風",
        luck: "吉"
    },
    {
        poem: "<ruby>人<rt>ひと</rt></ruby>はいさ <ruby>心<rt>こころ</rt></ruby>も<ruby>知<rt>し</rt></ruby>らず ふるさとは <ruby>花<rt>はな</rt></ruby>ぞ<ruby>昔<rt>むかし</rt></ruby>の <ruby>香<rt>か</rt></ruby>に<ruby>匂<rt>にお</rt></ruby><ruby>ひ<rt>い</rt></ruby>ける",
        meaning: "I cannot know what is in your heart. But here in the old village, the plum blossoms still carry the same fragrance as before.",
        love: "Chasing the other person's feelings too hard will not serve you well. Give it some space.",
        work: "Letting every shift in a manager's thinking or organizational direction affect your footing will leave you unsteady. Finding your own unchanging axis is the path to good fortune.",
        poet: "Ki no Tsurayuki",
        poetJa: "紀貫之",
        luck: "吉"
    },
    {
        poem: "<ruby>夏<rt>なつ</rt></ruby>の<ruby>夜<rt>よ</rt></ruby>は まだ<ruby>宵<rt>よい</rt></ruby>ながら あけぬるを <ruby>雲<rt>くも</rt></ruby>のいづこに <ruby>月<rt>つき</rt></ruby>やどるら<ruby>む<rt>ん</rt></ruby>",
        meaning: "On a summer night, the day has already dawned while it still feels like early evening. Where in the clouds is the moon hiding?",
        love: "Savor each intense moment of love and keep its brilliance as a treasure in your heart.",
        work: "Even in limited time, focus completely and give everything you have, then prepare for the next goal.",
        poet: "Kiyohara no Fukayabu",
        poetJa: "清原深養父",
        luck: "吉"
    },
    {
        poem: "<ruby>白露<rt>しらつゆ</rt></ruby>に <ruby>風<rt>かぜ</rt></ruby>の<ruby>吹<rt>ふ</rt></ruby>きしく <ruby>秋<rt>あき</rt></ruby>の<ruby>野<rt>の</rt></ruby>は つらぬきとめぬ <ruby>玉<rt>たま</rt></ruby>ぞ<ruby>散<rt>ち</rt></ruby>りける",
        meaning: "In the autumn fields lashed by the wind and dew, the scattered drops look like beads of jade that cannot be strung together.",
        love: "Both love and the heart are prone to shifting now. Rather than clinging, accepting change will reveal new connections.",
        work: "The situation is in flux. Rather than clinging to your plan, staying flexible will let you seize opportunities as they appear.",
        poet: "Fun'ya no Asayasu",
        poetJa: "文屋朝康",
        luck: "中吉"
    },
    {
        poem: "<ruby>忘<rt>わす</rt></ruby>らるる <ruby>身<rt>み</rt></ruby>をば<ruby>思<rt>おも</rt></ruby>はず <ruby>誓<rt>ちか</rt></ruby>ひてし <ruby>人<rt>ひと</rt></ruby>の<ruby>命<rt>いのち</rt></ruby>の <ruby>惜<rt>お</rt></ruby>しくもあるかな",
        meaning: "I do not grieve for myself, though I am forgotten. But I worry for you — you who swore an oath. What will become of you?",
        love: "Respect the other person's freedom and destiny without interference, and honest love will find its way.",
        work: "Rather than trying to intervene in others' responsibilities or fate, taking full ownership of your own words and actions will earn you trust.",
        poet: "Ukon",
        poetJa: "右近",
        luck: "末吉"
    },
    {
        poem: "<ruby>浅茅生<rt>あさじう</rt></ruby>の <ruby>小野<rt>おの</rt></ruby>の<ruby>篠原<rt>しのはら</rt></ruby> しのぶれど<br>あまりてなどか <ruby>人<rt>ひと</rt></ruby>の<ruby>恋<rt>こい</rt></ruby>しき<br>",
        meaning: "Though I try to hide it, my longing spills over. Why is it that I cannot stop thinking of that person?",
        love: "There are feelings inside you that you can no longer contain. Expressing them honestly will turn the situation around.",
        work: "Unstoppable passion is surging from within. Channel that energy into your work and goals and you will achieve results that astonish even you.",
        poet: "Councillor Hitoshi",
        poetJa: "参議等",
        luck: "中吉"
    },
    {
        poem: "<ruby>忍<rt>しの</rt></ruby>ぶれど <ruby>色<rt>いろ</rt></ruby>に<ruby>出<rt>い</rt></ruby>でにけり <ruby>我<rt>わ</rt></ruby>が<ruby>恋<rt>こい</rt></ruby>は <ruby>物<rt>もの</rt></ruby>や<ruby>思<rt>おも</rt></ruby>ふと <ruby>人<rt>ひと</rt></ruby>の<ruby>問<rt>と</rt></ruby><ruby>ふ<rt>う</rt></ruby>まで",
        meaning: "Though I tried to keep it secret, my love showed itself on my face — to the point where people asked if something was on my mind.",
        love: "Something kept hidden or secret is coming to light. Rather than forcing a cover-up, be straightforward and open.",
        work: "Showing up with a completely open and transparent attitude will earn you the trust and cooperation of those around you.",
        poet: "Taira no Kanemori",
        poetJa: "平兼盛",
        luck: "中吉"
    },
    {
        poem: "<ruby>恋<rt>こい</rt></ruby>す<ruby>てふ<rt>ちょう</rt></ruby> <ruby>我<rt>わ</rt></ruby>が<ruby>名<rt>な</rt></ruby>はまだき <ruby>立<rt>た</rt></ruby>ちにけり <ruby>人<rt>ひと</rt></ruby>しれずこそ <ruby>思<rt>おも</rt></ruby><ruby>ひ<rt>い</rt></ruby>そめしか",
        meaning: "They say my name as a lover is already known far and wide, even before the affair began. I had kept it so quietly in my heart.",
        love: "Rumors about your love life may begin to spread. Stay focused on living your true feelings without letting gossip bother you.",
        work: "Your actions are drawing attention — for better and for worse. Be mindful to conduct yourself in a way that leaves no room for misunderstanding.",
        poet: "Mibu no Tadami",
        poetJa: "壬生忠見",
        luck: "小吉"
    },
    {
        poem: "今はただ <ruby>思<rt>おも</rt></ruby>ひ<ruby>絶<rt>た</rt></ruby>えな<ruby>む<rt>ん</rt></ruby> とばかりを <ruby>人<rt>ひと</rt></ruby>づてならで <ruby>言<rt>い</rt></ruby>ふよしもがな",
        meaning: "If only I could say it directly: all I want is to end this love. But there is no way to tell you in person.",
        love: "Rather than leaning on the past, face love with your own resolve.",
        work: "The responsibility is yours. Cut ties with the past and walk the path of your convictions — success and trust will follow.",
        poet: "Master of the Left Capital Michimasa",
        poetJa: "左京大夫道雅",
        luck: "吉"
    },
    {
        poem: "<ruby>逢<rt>あ</rt></ruby><ruby>ひ<rt>い</rt></ruby><ruby>見<rt>み</rt></ruby>ての のちの<ruby>心<rt>こころ</rt></ruby>に くらぶれば <ruby>昔<rt>むかし</rt></ruby>は<ruby>物<rt>もの</rt></ruby>を <ruby>思<rt>おも</rt></ruby>はざりけり",
        meaning: "Compared to this feeling after meeting you, the longing I felt before seems like nothing at all.",
        love: "Intense feelings are proof of passion. Living honestly with those feelings will lead you to happiness.",
        work: "Channel intense feelings into your work to heighten focus and creativity.",
        poet: "Acting Middle Counselor Atsutada",
        poetJa: "権中納言敦忠",
        luck: "中吉"
    },
    {
        poem: "<ruby>逢<rt>お</rt></ruby><ruby>ふ<rt>う</rt></ruby>ことの <ruby>絶<rt>た</rt></ruby>えてしなくは なかなかに <ruby>人<rt>ひと</rt></ruby>をも<ruby>身<rt>み</rt></ruby>をも <ruby>恨<rt>うら</rt></ruby>みざらまし",
        meaning: "If there were no meetings at all, I would not have to suffer. It is because we meet that parting brings such pain.",
        love: "Relying too much on the other person will unsettle your heart. Building your own independence leads to stability.",
        work: "Creating an environment where you can concentrate alone will let your work flow smoothly.",
        poet: "Middle Counselor Asatada",
        poetJa: "中納言朝忠",
        luck: "末吉"
    },
    {
        poem: "あ<ruby>は<rt>わ</rt></ruby>れとも い<ruby>ふ<rt>う</rt></ruby>べき人は <ruby>思<rt>おも</rt></ruby><ruby>ほ<rt>お</rt></ruby>えで <ruby>身<rt>み</rt></ruby>のいた<ruby>づ<rt>ず</rt></ruby>らに なりぬべきかな",
        meaning: "There is no one who might show even a little compassion. I feel as though my life will simply fade away, just like that.",
        love: "Do not be swayed by loneliness — noticing the support around you will bring love and hope back to life.",
        work: "Rather than being swept along by emotions, trust the help around you and open your heart — you will overcome the difficulty.",
        poet: "Kentoku-kō",
        poetJa: "謙徳公",
        luck: "末吉"
    },
    {
        poem: "<ruby>由良<rt>ゆら</rt></ruby>のとを <ruby>渡<rt>わた</rt></ruby>る<ruby>舟人<rt>ふなびと</rt></ruby> か<ruby>ぢ<rt>じ</rt></ruby>を<ruby>絶<rt>た</rt></ruby>え ゆくへも<ruby>知<rt>し</rt></ruby>らぬ <ruby>恋<rt>こい</rt></ruby>の<ruby>道<rt>みち</rt></ruby>かな",
        meaning: "Like a boatman who has lost his oar on the swift straits of Yura — I drift, not knowing where my love is taking me.",
        love: "You may tend to drift along passively. Take your time and read the situation carefully before moving.",
        work: "The path ahead is unclear and a direction is hard to pin down. If you do not rush, you will eventually find your way out of the drift.",
        poet: "Sone no Yoshitada",
        poetJa: "曽禰好忠",
        luck: "末吉"
    },
    {
        poem: "<ruby>八重葎<rt>やえむぐら</rt></ruby> しげれる<ruby>宿<rt>やど</rt></ruby>の さびしきに <ruby>人<rt>ひと</rt></ruby>こそ<ruby>見<rt>み</rt></ruby>えね <ruby>秋<rt>あき</rt></ruby>は<ruby>来<rt>き</rt></ruby>にけり",
        meaning: "Weeds grow thick around the deserted house. No one comes to visit. And yet — autumn has arrived.",
        love: "Solitary moments are a season for inner growth. Nurture your heart without rushing, and love will come to fruition.",
        work: "Even in isolation, keep making the effort and quietly building strength — results will come.",
        poet: "Priest Egyō",
        poetJa: "恵慶法師",
        luck: "小吉"
    },
    {
        poem: "<ruby>風<rt>かぜ</rt></ruby>をいたみ <ruby>岩<rt>いわ</rt></ruby>うつ<ruby>波<rt>なみ</rt></ruby>の おのれのみ くだけて<ruby>物<rt>もの</rt></ruby>を <ruby>思<rt>おも</rt></ruby><ruby>ふ<rt>う</rt></ruby>ころかな",
        meaning: "Like the waves crashing against the rocks in the fierce wind, I alone am broken to pieces by this sorrow.",
        love: "Intense emotion is proof of love. Turn pain into strength and draw future love toward you.",
        work: "Hardship is a trial. Turn a broken experience into strength and build success on a firm conviction.",
        poet: "Minamoto no Shigeyuki",
        poetJa: "源重之",
        luck: "小吉"
    },
    {
        poem: "<ruby>御垣守<rt>みかきもり</rt></ruby> <ruby>衛士<rt>えじ</rt></ruby>のたく<ruby>火<rt>ひ</rt></ruby>の <ruby>夜<rt>よる</rt></ruby>はもえ <ruby>昼<rt>ひる</rt></ruby>は<ruby>消<rt>き</rt></ruby>えつつ <ruby>物<rt>もの</rt></ruby>をこそ<ruby>思<rt>おも</rt></ruby><ruby>へ<rt>え</rt></ruby>",
        meaning: "Like the fire tended by the palace guards, I burn at night and fade in the day — lost in endless longing.",
        love: "The signs suggest that something joyful or bright is coming to an end. Accept that gracefully and turn your attention to the next chapter.",
        work: "The situation is shifting dramatically and a new era is beginning. Rather than rushing, wait for the storm to pass completely — then you will see the right moment.",
        poet: "Ōnakatomi no Yoshinobu Ason",
        poetJa: "大中臣能宣",
        luck: "吉"
    },
    {
        poem: "<ruby>君<rt>きみ</rt></ruby>がため <ruby>惜<rt>お</rt></ruby>しからざりし いのちさ<ruby>へ<rt>え</rt></ruby> <ruby>長<rt>なが</rt></ruby>くもがなと <ruby>思<rt>おも</rt></ruby><ruby>ひ<rt>い</rt></ruby>けるかな",
        meaning: "A life I once did not mind losing — now, for your sake, I wish it would last forever.",
        love: "If you have someone special, cherish them. If not, someone who makes your heart leap is on their way.",
        work: "Pour passion into the work right in front of you while also aiming for long-term results.",
        poet: "Fujiwara no Yoshitaka",
        poetJa: "藤原義孝",
        luck: "吉"
    },
    {
        poem: "かくとだに えやはいぶきの さしも<ruby>草<rt>ぐさ</rt></ruby> さしも<ruby>知<rt>し</rt></ruby>らじな もゆる<ruby>思<rt>おも</rt></ruby><ruby>ひ<rt>い</rt></ruby>を",
        meaning: "I cannot even tell you how I feel — like the smoldering fire of ibuki wormwood, my hidden love quietly burns.",
        love: "Express your warm passion with creativity and care, and you will move the other person's heart.",
        work: "Communicate your enthusiasm strategically to win empathy and cooperation and elevate your results.",
        poet: "Fujiwara no Sanekata Ason",
        poetJa: "藤原実方朝臣",
        luck: "吉"
    },
    {
        poem: "明けぬれば <ruby>暮<rt>く</rt></ruby>るるものとは <ruby>知<rt>し</rt></ruby>りながら な<ruby>ほ<rt>お</rt></ruby>うらめしき <ruby>朝<rt>あさ</rt></ruby>ぼらけかな",
        meaning: "I know that after dawn comes dusk — and yet how I resent this pale morning sky.",
        love: "There may be a temporary parting or distance, but the reunion and the strength of your bond are certain. Patience to endure the present loneliness is what is needed.",
        work: "Your goal is within reach, but this is a time of temporary waiting and preparation. Trust in a certain future and store your strength without rushing.",
        poet: "Fujiwara no Michinobu Ason",
        poetJa: "藤原道信朝臣",
        luck: "吉"
    },
    {
        poem: "<ruby>嘆<rt>なげ</rt></ruby>きつつ ひとり<ruby>寝<rt>ぬ</rt></ruby>る<ruby>夜<rt>よ</rt></ruby>の <ruby>明<rt>あ</rt></ruby>くる<ruby>間<rt>ま</rt></ruby>は いかに<ruby>久<rt>ひさ</rt></ruby>しき ものとかは<ruby>知<rt>し</rt></ruby>る",
        meaning: "Lying alone, waiting for the long night to end — how endless it feels. Does the person who left me even know?",
        love: "You are in a painful stretch where the nights feel endless, but the end of that period is just around the corner. Hold onto hope and endure.",
        work: "A long season of hardship is ending, and a new day is beginning. Draw on past experience and make a fresh start with a forward-looking spirit.",
        poet: "Mother of the Right Captain Michitsuna",
        poetJa: "右大将道綱母",
        luck: "吉"
    },
    {
        poem: "<ruby>忘<rt>わす</rt></ruby>れじの ゆく<ruby>末<rt>すえ</rt></ruby>までは かたければ <ruby>今日<rt>きょう</rt></ruby>を<ruby>限<rt>かぎ</rt></ruby>りの <ruby>命<rt>いのち</rt></ruby>ともがな",
        meaning: "The promise that you would never forget me — that is too much to ask forever. I only wish my life would end today, while the vow still holds.",
        love: "Do not worry about the future — savor the happiness of right now.",
        work: "Savor the joy of success now and let it become fuel for your next goal.",
        poet: "Mother of the Honorary Grand Minister",
        poetJa: "儀同三司母",
        luck: "吉"
    },
    {
        poem: "<ruby>滝<rt>たき</rt></ruby>の<ruby>音<rt>おと</rt></ruby>は たえて<ruby>久<rt>ひさ</rt></ruby>しく なりぬれど <ruby>名<rt>な</rt></ruby>こそ<ruby>流<rt>なが</rt></ruby>れて な<ruby>ほ<rt>お</rt></ruby><ruby>聞<rt>き</rt></ruby>こえけれ",
        meaning: "The sound of the waterfall has long since faded, but its name flows on and is still heard by the world.",
        love: "The trust built over time is the foundation of the relationship. Nurture love quietly without rushing.",
        work: "Past effort never disappears. Keep polishing yourself without rushing.",
        poet: "Upper Counselor Kintō",
        poetJa: "藤原公任",
        luck: "吉"
    },
    {
        poem: "あらざら<ruby>む<rt>ん</rt></ruby> この<ruby>世<rt>よ</rt></ruby>のほかの <ruby>思<rt>おも</rt></ruby><ruby>ひ<rt>い</rt></ruby><ruby>出<rt>で</rt></ruby>に いまひとたびの <ruby>逢<rt>お</rt></ruby><ruby>ふ<rt>う</rt></ruby>こともがな",
        meaning: "I may not be long for this world. As a memory to take beyond — let me meet you just one more time.",
        love: "Even if you feel alone, reach out actively and broaden your connections.",
        work: "Seek help from colleagues and look for a new environment to improve the situation.",
        poet: "Izumi Shikibu",
        poetJa: "和泉式部",
        luck: "吉"
    },
    {
        poem: "めぐり<ruby>逢<rt>あ</rt></ruby><ruby>ひ<rt>い</rt></ruby>て <ruby>見<rt>み</rt></ruby>しやそれとも わかぬ<ruby>間<rt>ま</rt></ruby>に <ruby>雲隠<rt>くもがく</rt></ruby>れにし <ruby>夜半<rt>よわ</rt></ruby>の<ruby>月<rt>つき</rt></ruby>かな",
        meaning: "We met for just a moment, yet I could not be sure it was really you — and then you vanished behind the clouds, like the midnight moon.",
        love: "Opportunities come and go in an instant. Value your instincts and small encounters.",
        work: "Appreciate the chance encounters and sudden insights that cross your path — holding them in your heart will connect to future results.",
        poet: "Murasaki Shikibu",
        poetJa: "紫式部",
        luck: "吉"
    },
    {
        poem: "ありま<ruby>山<rt>やま</rt></ruby> <ruby>猪名<rt>いな</rt></ruby>の<ruby>笹原<rt>ささはら</rt></ruby> <ruby>風<rt>かぜ</rt></ruby><ruby>吹<rt>ふ</rt></ruby>けば いでそよ<ruby>人<rt>ひと</rt></ruby>を <ruby>忘<rt>わす</rt></ruby>れやはする",
        meaning: "When the wind blows through the bamboo groves of Arima and Ina — of course I have not forgotten you.",
        love: "The strength to look past the other person's surface behavior and see the essence keeps love solid.",
        work: "The composure to focus on what needs to be done without being rattled by noise will generate trust and success.",
        poet: "Daini no Sanmi",
        poetJa: "大弐三位",
        luck: "吉"
    },
    {
        poem: "やすら<ruby>は<rt>わ</rt></ruby>で <ruby>寝<rt>ね</rt></ruby>なましものを <ruby>小夜<rt>さよ</rt></ruby><ruby>更<rt>ふ</rt></ruby>けて かたぶくまでの <ruby>月<rt>つき</rt></ruby>を<ruby>見<rt>み</rt></ruby>しかな",
        meaning: "I waited and waited without sleep, watching the moon sink slowly toward the horizon in the deepening night. How I regret it.",
        love: "Time spent waiting builds self-worth and draws future love closer.",
        work: "The waiting period is time for self-cultivation. Quietly build your strength and be ready for the right moment.",
        poet: "Akazome Emon",
        poetJa: "赤染衛門",
        luck: "中吉"
    },
    {
        poem: "<ruby>大江山<rt>おおえやま</rt></ruby> いく<ruby>野<rt>の</rt></ruby>の<ruby>道<rt>みち</rt></ruby>の <ruby>遠<rt>とお</rt></ruby>ければ まだふみもみず <ruby>天<rt>あま</rt></ruby>の<ruby>橋立<rt>はしだて</rt></ruby>",
        meaning: "The road to Oe Mountain and Ikuno is so long and far — I have not yet set foot on it, nor received a letter from my mother.",
        love: "No matter how difficult things get, holding onto a sense of ease and humor is the key to making love blossom.",
        work: "Your talent and ability are greater than you think. Ignore the voices around you and express that confidence boldly in your work.",
        poet: "Koshikibu no Naishi",
        poetJa: "小式部内侍",
        luck: "中吉"
    },
    {
        poem: "いにし<ruby>へ<rt>え</rt></ruby>の <ruby>奈良<rt>なら</rt></ruby>の<ruby>都<rt>みやこ</rt></ruby>の <ruby>八重桜<rt>やえざくら</rt></ruby> <ruby>けふ<rt>きょう</rt></ruby><ruby>九重<rt>ここのえ</rt></ruby>に <ruby>匂<rt>にお</rt></ruby><ruby>ひ<rt>い</rt></ruby>ぬるかな",
        meaning: "The ancient eightfold cherry blossoms of Nara — today they bloom gloriously in the ninefold imperial palace.",
        love: "Your love, like cherry blossoms in full bloom, illuminates everyone around you and will reach its finest form. Encounters and growth in vibrant, eye-catching settings are in store.",
        work: "The effort you have put in is now in full bloom — remarkable results and recognition are yours to claim. Give full rein to your natural talent and charm, and by taking the lead you will have a positive influence on the whole organization.",
        poet: "Ise no Taifu",
        poetJa: "伊勢大輔",
        luck: "大吉"
    },
    {
        poem: "<ruby>夜<rt>よ</rt></ruby>をこめて <ruby>鳥<rt>とり</rt></ruby>のそらねは はかるとも よに<ruby>逢坂<rt>おうさか</rt></ruby>の <ruby>関<rt>せき</rt></ruby>は<ruby>許<rt>ゆる</rt></ruby>さじ",
        meaning: "Even if you try to fool me with a crowing rooster in the night — I will not open the Barrier of Ōsaka for you.",
        love: "If a relationship is going nowhere or causing you pain, now is the time to draw a clear line and communicate your feelings. Decisiveness invites the next happiness.",
        work: "Now is the time to clear away past failures and concluded projects and make a fresh start. Let go of the past and step forward with a positive spirit.",
        poet: "Sei Shōnagon",
        poetJa: "清少納言",
        luck: "吉"
    },
    {
        poem: "いまはただ <ruby>思<rt>おも</rt></ruby>ひ<ruby>絶<rt>た</rt></ruby>えな<ruby>む<rt>ん</rt></ruby> とばかりを <ruby>人<rt>ひと</rt></ruby>づてならで <ruby>言<rt>い</rt></ruby><ruby>ふ<rt>う</rt></ruby>よしもがな",
        meaning: "If only I could say it directly: all I want is to end this love. But there is no way to tell you in person.",
        love: "The courage to resolve things head-on rather than letting them drag will open a new chapter.",
        work: "Problems that linger will find resolution when you take a stand yourself rather than leaving them to others, breaking the stagnation.",
        poet: "Master of the Left Capital Michimasa",
        poetJa: "左京大夫道雅",
        luck: "凶"
    },
    {
        poem: "<ruby>朝<rt>あさ</rt></ruby>ぼらけ <ruby>宇治<rt>うじ</rt></ruby>の<ruby>川霧<rt>かわぎり</rt></ruby> <ruby>絶<rt>た</rt></ruby>え<ruby>絶<rt>だ</rt></ruby>えに あら<ruby>は<rt>わ</rt></ruby>れわたる <ruby>瀬々<rt>せぜ</rt></ruby>の<ruby>網代木<rt>あじろぎ</rt></ruby>",
        meaning: "In the early dawn mist over the Uji River, here and there the wooden stakes of fish weirs begin to appear through the haze.",
        love: "The relationship is still wrapped in fog. Wait patiently and trust the sure signs that occasionally show through.",
        work: "The overall picture is unclear, but the path toward your goal is beginning to show itself in places. Move forward one step at a time.",
        poet: "Acting Middle Counselor Sadayori",
        poetJa: "権中納言定頼",
        luck: "吉"
    },
    {
        poem: "<ruby>恨<rt>うら</rt></ruby>みわび ほさぬ<ruby>袖<rt>そで</rt></ruby>だに あるものを <ruby>恋<rt>こい</rt></ruby>にくちな<ruby>む<rt>ん</rt></ruby> <ruby>名<rt>な</rt></ruby>こそをしけれ",
        meaning: "My sleeves are never dry — and I grieve not for myself, but that my name as a lover will be ruined before it is known.",
        love: "The suffering of the present will eventually be rewarded, drawing true love toward you.",
        work: "Unseen effort and steady reliability will eventually lead to honorable success.",
        poet: "Sagami",
        poetJa: "相模",
        luck: "末吉"
    },
    {
        poem: "もろともに あ<ruby>は<rt>わ</rt></ruby>れと<ruby>思<rt>おも</rt></ruby><ruby>へ<rt>え</rt></ruby> <ruby>山桜<rt>やまざくら</rt></ruby> <ruby>花<rt>はな</rt></ruby>よりほかに <ruby>知<rt>し</rt></ruby>る<ruby>人<rt>ひと</rt></ruby>もなし",
        meaning: "O mountain cherry — feel moved together with me. There is no one else here who knows me but you.",
        love: "Even in solitude, treasure the bond with the one person whose heart speaks to yours.",
        work: "Rather than being swayed by those around you, concentrate on what is genuinely valuable to you.",
        poet: "Senior High Priest Gyōson",
        poetJa: "大僧正行尊",
        luck: "吉"
    },
    {
        poem: "<ruby>春<rt>はる</rt></ruby>の<ruby>夜<rt>よ</rt></ruby>の <ruby>夢<rt>ゆめ</rt></ruby>ばかりなる <ruby>手枕<rt>たまくら</rt></ruby>に か<ruby>ひ<rt>い</rt></ruby>なく<ruby>立<rt>た</rt></ruby>た<ruby>む<rt>ん</rt></ruby> <ruby>名<rt>な</rt></ruby>こそをしけれ",
        meaning: "In the spring night, resting my head on an arm for just a brief dream — how I grieve that my name might spread for such a fleeting thing.",
        love: "Do not be swept away by charm. Hold firmly to sincerity and self-respect.",
        work: "Without being moved by others' evaluations, calmly hold true to your results and your core.",
        poet: "Suō no Naishi",
        poetJa: "周防内侍",
        luck: "大吉"
    },
    {
        poem: "<ruby>心<rt>こころ</rt></ruby>にも あらで<ruby>憂<rt>う</rt></ruby>き<ruby>世<rt>よ</rt></ruby>に ながら<ruby>へ<rt>え</rt></ruby>ば <ruby>恋<rt>こい</rt></ruby>しかるべき <ruby>夜半<rt>よわ</rt></ruby>の<ruby>月<rt>つき</rt></ruby>かな",
        meaning: "If I live on in this painful world without purpose, I am sure I will come to miss this night and its lonely moon.",
        love: "Even difficult experiences become nourishment that deepens future love.",
        work: "Even an unwilling situation is an experience that will become strength in the future.",
        poet: "Retired Emperor Sanjō",
        poetJa: "三条院",
        luck: "末吉"
    },
    {
        poem: "<ruby>嵐<rt>あらし</rt></ruby><ruby>吹<rt>ふ</rt></ruby>く <ruby>三室<rt>みむろ</rt></ruby>の<ruby>山<rt>やま</rt></ruby>の <ruby>紅葉<rt>もみじ</rt></ruby><ruby>葉<rt>ば</rt></ruby>は <ruby>竜田<rt>たつた</rt></ruby>の<ruby>川<rt>かわ</rt></ruby>の <ruby>錦<rt>にしき</rt></ruby>なりけり",
        meaning: "The storm blows through Mimuro Mountain, and the scattered maple leaves become a brocade on the Tatsuta River.",
        love: "Even hardship is a chance for the two of you to deepen your love.",
        work: "Overcoming difficulty will elevate your results and recognition.",
        poet: "Priest Nōin",
        poetJa: "能因法師",
        luck: "中吉"
    },
    {
        poem: "さびしさに <ruby>宿<rt>やど</rt></ruby>を<ruby>立<rt>た</rt></ruby>ち<ruby>出<rt>い</rt></ruby>でて ながむれば い<ruby>づ<rt>ず</rt></ruby>くも<ruby>同<rt>おな</rt></ruby>じ <ruby>秋<rt>あき</rt></ruby>の<ruby>夕<rt>ゆう</rt></ruby><ruby>暮<rt>ぐれ</rt></ruby>",
        meaning: "Feeling lonely, I stepped outside to gaze at the view — and everywhere I looked, it was the same twilight of autumn.",
        love: "This is a quiet time to face your own heart. Inner richness draws love toward you.",
        work: "Pausing to reflect inwardly will reveal wisdom and a path toward the future.",
        poet: "Priest Ryōzen",
        poetJa: "良暹法師",
        luck: "吉"
    },
    {
        poem: "<ruby>夕<rt>ゆう</rt></ruby>されば <ruby>門田<rt>かどた</rt></ruby>の<ruby>稲葉<rt>いなば</rt></ruby> おと<ruby>づ<rt>ず</rt></ruby>れて <ruby>蘆<rt>あし</rt></ruby>のまろやに <ruby>秋風<rt>あきかぜ</rt></ruby>ぞ<ruby>吹<rt>ふ</rt></ruby>く",
        meaning: "As evening falls, the breeze comes rustling through the rice stalks by the gate, and the autumn wind blows through the reed-thatched hut.",
        love: "Small changes nearby will ripple into the relationship as well. Let the natural flow carry you without rushing.",
        work: "Waves of change are inevitable. Prepare early and respond calmly, and success will follow.",
        poet: "Upper Counselor Tsunenobu",
        poetJa: "大納言経信",
        luck: "小吉"
    },
    {
        poem: "<ruby>音<rt>おと</rt></ruby>に<ruby>聞<rt>き</rt></ruby>く <ruby>高師<rt>たかし</rt></ruby>の<ruby>浜<rt>はま</rt></ruby>の あだ<ruby>波<rt>なみ</rt></ruby>は かけじや<ruby>袖<rt>そで</rt></ruby>の ぬれもこそすれ",
        meaning: "I have heard how fickle the waves at Takashi Beach are. I will not let them wet my sleeves — I will keep my heart guarded.",
        love: "Do not be swayed by appearances or gossip, and avoid rash actions.",
        work: "Do not reach for flashy temptations or talk without substance — stay on the steady path.",
        poet: "Kii of Princess Yūshi's Household",
        poetJa: "祐子内親王",
        luck: "吉"
    },
    {
        poem: "<ruby>高砂<rt>たかさご</rt></ruby>の <ruby>尾<rt>お</rt></ruby>の<ruby>上<rt>へ</rt></ruby>の<ruby>桜<rt>さくら</rt></ruby> <ruby>咲<rt>さ</rt></ruby>きにけり <ruby>外山<rt>とやま</rt></ruby>の<ruby>霞<rt>かすみ</rt></ruby> <ruby>立<rt>た</rt></ruby>たずもあらな<ruby>む<rt>ん</rt></ruby>",
        meaning: "The cherry blossoms on the high peaks of Takasago have already bloomed. Let the mist not rise over the foothills and hide them from view.",
        love: "A love built over many years has come to fruition. Guard the happiness you have now without being unsettled by worry or rumors.",
        work: "You have achieved great success. Guard those results carefully, without being misled by complacency or misleading information.",
        poet: "Acting Middle Counselor Masafusa",
        poetJa: "権中納言匡房",
        luck: "中吉"
    },
    {
        poem: "<ruby>憂<rt>う</rt></ruby>かりける <ruby>人<rt>ひと</rt></ruby>を<ruby>初瀬<rt>はつせ</rt></ruby>の <ruby>山<rt>やま</rt></ruby>おろしよ はげしかれとは <ruby>祈<rt>いの</rt></ruby>らぬものを",
        meaning: "I prayed to the storm wind of Hatsuse — but I never prayed for it to grow fiercer. Why has this person become so cold to me?",
        love: "Rather than trying to change the other person, this is a time to reflect on your own way of loving. Treat the trial as an opportunity for self-growth.",
        work: "Unexpected obstacles are a chance to review your plan and reinforce your strategy. Turn adversity into growth.",
        poet: "Minamoto no Toshiyori Ason",
        poetJa: "源俊頼",
        luck: "末吉"
    },
    {
        poem: "<ruby>契<rt>ちぎ</rt></ruby>りおきし させもが<ruby>露<rt>つゆ</rt></ruby>を いのちにて<br>あ<ruby>は<rt>わ</rt></ruby>れ<ruby>今年 <rt>ことし</rt></ruby>の <ruby>秋<rt>あき</rt></ruby>もいぬめり<br>",
        meaning: "You promised me, and I staked my life on it like the morning dew on the wormwood. But another autumn is passing, alas.",
        love: "Rather than only waiting, this is a time to build love together. Turn your passion into action and nurture the relationship yourself.",
        work: "Rather than relying on others' words, this is the time to achieve your goal through your own effort. Action creates success.",
        poet: "Fujiwara no Mototoshi",
        poetJa: "藤原基俊",
        luck: "末吉"
    },
    {
        poem: "わたの<ruby>原<rt>はら</rt></ruby> こぎいでてみれば <ruby>久方<rt>ひさかた</rt></ruby>の <ruby>雲<rt>くも</rt></ruby><ruby>居<rt>い</rt></ruby>に ま<ruby>が<rt>ご</rt></ruby><ruby>ふ<rt>う</rt></ruby> <ruby>沖<rt>おき</rt></ruby>つ<ruby>白波<rt>しらなみ</rt></ruby>",
        meaning: "Rowing out onto the open sea and looking around — the white waves far off on the water seem to blur into the clouds.",
        love: "New encounters hold great possibilities. Broaden your perspective and take one step forward.",
        work: "New challenges are the key to success. Think broadly and act with boldness.",
        poet: "Lay Novice of Hosshō-ji Temple, former Kampaku and Chancellor of the Realm",
        poetJa: "法性寺入道前太政大臣",
        luck: "大吉"
    },
    {
        poem: "<ruby>瀬<rt>せ</rt></ruby>をはやみ <ruby>岩<rt>いわ</rt></ruby>にせかるる <ruby>滝川<rt>たきがわ</rt></ruby>の われても<ruby>末<rt>すえ</rt></ruby>に あ<ruby>は<rt>わ</rt></ruby><ruby>む<rt>ん</rt></ruby>とぞ<ruby>思<rt>おも</rt></ruby><ruby>ふ<rt>う</rt></ruby>",
        meaning: "Like the river that is split by rocks and flows apart — though we are separated now, I believe we will meet again in the end.",
        love: "Even through separation or obstacles, the pledge in your heart is the true bond between you. Stay true to your conviction.",
        work: "Even when facing difficulty or a wall, holding firmly to your convictions in carrying out your plan is the key to success.",
        poet: "Retired Emperor Sutoku",
        poetJa: "崇徳院",
        luck: "末吉"
    },
    {
        poem: "<ruby>淡路島<rt>あわじしま</rt></ruby> かよ<ruby>ふ<rt>う</rt></ruby><ruby>千鳥<rt>ちどり</rt></ruby>の <ruby>鳴<rt>な</rt></ruby>く<ruby>声<rt>こえ</rt></ruby>に <ruby>幾夜<rt>いくよ</rt></ruby><ruby>寝覚<rt>ねざ</rt></ruby>めぬ <ruby>須磨<rt>すま</rt></ruby>の<ruby>関守<rt>せきもり</rt></ruby>",
        meaning: "The cry of the plovers flying between Awaji Island — how many nights have I lain awake listening to them at the Suma Barrier?",
        love: "Do not let your heart be disturbed by slow progress in the relationship. Quiet patience is what matters.",
        work: "Even in a solitary role, steady focus will lead to recognition in the end.",
        poet: "Minamoto no Kanemasa",
        poetJa: "源兼昌",
        luck: "末吉"
    },
    {
        poem: "<ruby>秋風<rt>あきかぜ</rt></ruby>に たなびく<ruby>雲<rt>くも</rt></ruby>の たえ<ruby>間<rt>ま</rt></ruby>より もれい<ruby>づ<rt>ず</rt></ruby>る<ruby>月<rt>つき</rt></ruby>の <ruby>影<rt>かげ</rt></ruby>のさやけさ",
        meaning: "Through the gaps in the clouds trailing in the autumn wind, the moonlight filters through, so clear and still.",
        love: "Misunderstandings and worries are temporary. Wait patiently and your feelings will reach the other person clearly.",
        work: "Not being understood for now is only temporary. Keep making the effort and your ability will certainly be recognized.",
        poet: "Master of the Left Capital Akisuke",
        poetJa: "左京大夫顕輔",
        luck: "中吉"
    },
    {
        poem: "<ruby>長<rt>なが</rt></ruby>から<ruby>む<rt>ん</rt></ruby> <ruby>心<rt>こころ</rt></ruby>もしらず <ruby>黒髪<rt>くろがみ</rt></ruby>の みだれてけさは <ruby>物<rt>もの</rt></ruby>をこそ<ruby>思<rt>おも</rt></ruby><ruby>へ<rt>え</rt></ruby>",
        meaning: "Not knowing whether your heart will last — I woke this morning with my long black hair in tangles, lost in thought.",
        love: "Even if your heart is confused by not knowing the other person's feelings, that is proof of deep love. Start by settling your own heart.",
        work: "Even when anxious and confused, do not rush — sorting things out one by one will lead to solid success.",
        poet: "Horikawa, attendant to Empress Taiken",
        poetJa: "待賢門院堀河",
        luck: "末吉"
    },
    {
        poem: "ほととぎす <ruby>鳴<rt>な</rt></ruby>きつる<ruby>方<rt>かた</rt></ruby>を ながむれば ただ<ruby>有明<rt>ありあけ</rt></ruby>の <ruby>月<rt>つき</rt></ruby>ぞ<ruby>残<rt>のこ</rt></ruby>れる",
        meaning: "I looked toward where the cuckoo had just called — and all that remained was the pale moon at dawn.",
        love: "Even if you have missed the moment to confess or move forward, your pure feelings and love remain. Wait without rushing for the next opportunity.",
        work: "Even if you missed an opportunity, the track record you built through effort is real. Quietly advance your next plan.",
        poet: "Later Tokudaiji Minister of the Left",
        poetJa: "後徳大寺左大臣",
        luck: "小吉"
    },
    {
        poem: "<ruby>思<rt>おも</rt></ruby><ruby>ひ<rt>い</rt></ruby>わび さても<ruby>命<rt>いのち</rt></ruby>は あるものを <ruby>憂<rt>う</rt></ruby>きにた<ruby>へ<rt>え</rt></ruby>ぬは <ruby>涙<rt>なみだ</rt></ruby>なりけり",
        meaning: "I am exhausted with sorrow, yet somehow I am still alive. What cannot endure is not my life — but my tears.",
        love: "You have endured a painful unrequited love. It is all right sometimes to let the tears fall and show your vulnerability to someone you trust.",
        work: "You are bearing a heavy burden. When you feel you have reached your limit, have the courage to rest and allow your mind and body to recover.",
        poet: "Priest Dōin",
        poetJa: "道因法師",
        luck: "末吉"
    },
    {
        poem: "<ruby>世<rt>よ</rt></ruby>の<ruby>中<rt>なか</rt></ruby>よ <ruby>道<rt>みち</rt></ruby>こそなけれ <ruby>思<rt>おも</rt></ruby><ruby>ひ<rt>い</rt></ruby><ruby>入<rt>い</rt></ruby>る <ruby>山<rt>やま</rt></ruby>の<ruby>奥<rt>おく</rt></ruby>にも <ruby>鹿<rt>しか</rt></ruby>ぞ<ruby>鳴<rt>な</rt></ruby>くなる",
        meaning: "There is no escape from this world. Even deep in the mountains, the deer cry out.",
        love: "In this lonely time, face your own heart. That time will open a new path for love to grow.",
        work: "In deep solitude, reflect inwardly and find your own unique path forward. Insight will bring the light.",
        poet: "Master of the Empress Dowager's Household Toshinari",
        poetJa: "皇太后宮大夫俊成",
        luck: "末吉"
    },
    {
        poem: "<ruby>長<rt>なが</rt></ruby>ら<ruby>へ<rt>え</rt></ruby>ば またこのごろや しのばれ<ruby>む<rt>ん</rt></ruby> <ruby>憂<rt>う</rt></ruby>しと<ruby>見<rt>み</rt></ruby>し<ruby>世<rt>よ</rt></ruby>ぞ <ruby>今<rt>いま</rt></ruby>は<ruby>恋<rt>こい</rt></ruby>しき<br>",
        meaning: "If I live on long enough, perhaps even these painful days will become dear to me, as something I once longed to leave behind.",
        love: "The painful experience you are going through now will become a cherished memory that builds the depth of your future love. Face it rather than flee, and support each other through it.",
        work: "The hardship you are going through now is a precious asset for the future. Rather than running away, stick with it persistently and results will come.",
        poet: "Fujiwara no Kiyosuke Ason",
        poetJa: "藤原清輔朝臣",
        luck: "吉"
    },
    {
        poem: "<ruby>夜<rt>よ</rt></ruby>もすがら <ruby>物<rt>もの</rt></ruby><ruby>思<rt>おも</rt></ruby><ruby>ふ<rt>う</rt></ruby>ころは <ruby>明<rt>あ</rt></ruby>けやらで <ruby>閨<rt>ねや</rt></ruby>のひまさ<ruby>へ<rt>え</rt></ruby> つれなかりけり",
        meaning: "All through the night, lost in thought, the dawn will not come. Even the crack of light through the bedroom door seems cold and distant.",
        love: "Unwavering feelings will surely become the force that moves the situation. Guard your sincere heart without rushing and a warm light will eventually shine on your love.",
        work: "There will be a dawn even in a period when effort seems unrewarded. Treat this as a time of preparation, and turn your struggles into strength.",
        poet: "Priest Shun'e",
        poetJa: "俊恵法師",
        luck: "末吉"
    },
    {
        poem: "<ruby>嘆<rt>なげ</rt></ruby>けとて <ruby>月<rt>つき</rt></ruby>やは<ruby>物<rt>もの</rt></ruby>を <ruby>思<rt>おも</rt></ruby><ruby>は<rt>わ</rt></ruby>する かこち<ruby>顔<rt>がお</rt></ruby>なる わが<ruby>涙<rt>なみだ</rt></ruby>かな",
        meaning: "Did the moon ask me to grieve? These tears on my face — it is as if I am blaming the moon for making me feel this way.",
        love: "The tears you shed are proof of your gentleness and pure love. Accept your feelings and cherish love, and you will build a good relationship with the other person.",
        work: "Worries are a sign of inner change. Looking closely at your feelings will make the path forward clear.",
        poet: "Priest Saigyō",
        poetJa: "西行法師",
        luck: "吉"
    },
    {
        poem: "<ruby>村雨<rt>むらさめ</rt></ruby>の <ruby>露<rt>つゆ</rt></ruby>もまだひぬ まきの<ruby>葉<rt>は</rt></ruby>に <ruby>霧<rt>きり</rt></ruby>たちのぼる <ruby>秋<rt>あき</rt></ruby>の<ruby>夕<rt>ゆう</rt></ruby><ruby>暮<rt>ぐれ</rt></ruby>",
        meaning: "After the passing shower, the mist rises slowly through the rain-drenched leaves of the cedar. An autumn evening.",
        love: "The clash or trouble has settled for now, but traces and uncertainty remain. Without carrying the past, wait calmly for the fog to clear.",
        work: "The difficulty has been overcome, but uncertainty continues. Without being tied to the past, make use of lessons learned, gather information actively, and hold off on action until the situation becomes clear.",
        poet: "Priest Jakuren",
        poetJa: "寂蓮法師",
        luck: "末吉"
    },
    {
        poem: "<ruby>難波江<rt>なにわえ</rt></ruby>の <ruby>葦<rt>あし</rt></ruby>のかりねの ひとよゆ<ruby>ゑ<rt>え</rt></ruby> みをつくしてや <ruby>恋<rt>こ</rt></ruby><ruby>ひ<rt>い</rt></ruby>わたるべき",
        meaning: "For just one brief night together, like the cut end of a reed at Naniwa — must I go on longing for you forever?",
        love: "A small beginning has grown into a love where you are ready to commit wholeheartedly. Channel that passion into self-growth, and you will eventually move the other person's heart.",
        work: "A small effort has grown into a calling worthy of your full devotion. Dedicate yourself wholeheartedly, and it will become a reliable guide in both your career and your life.",
        poet: "Attendant to Empress Kōka",
        poetJa: "皇嘉門院別当",
        luck: "小吉"
    },
    {
        poem: "<ruby>玉<rt>たま</rt></ruby>の<ruby>緒<rt>お</rt></ruby>よ <ruby>絶<rt>た</rt></ruby>えなば<ruby>絶<rt>た</rt></ruby>えね ながら<ruby>へ<rt>え</rt></ruby>ば <ruby>忍<rt>しの</rt></ruby>ぶることの <ruby>弱<rt>よわ</rt></ruby>りもぞする",
        meaning: "Let my life end now, if it must. For if I go on living, my power to endure this secret love may weaken.",
        love: "The strong love you hold in your heart is proof of seriousness. When you reach your limit, have the courage to be honest with yourself and choose your own future. It will become the force to protect and nurture your love.",
        work: "Your passion is testing the limits of your patience. Translate that resolve into action without hesitation — taking one step forward will become the force that turns the situation around.",
        poet: "Princess Shikishi",
        poetJa: "式子内親王",
        luck: "末吉"
    },
    {
        poem: "<ruby>見<rt>み</rt></ruby>せばやな <ruby>雄島<rt>おじま</rt></ruby>のあまの <ruby>袖<rt>そで</rt></ruby>だにも ぬれにぞぬれし <ruby>色<rt>いろ</rt></ruby>はか<ruby>は<rt>わ</rt></ruby>らず",
        meaning: "I wish I could show you — these sleeves of mine, soaked through and through with tears that never change color, never dry.",
        love: "The pain in your heart is proof of your singular, earnest love. Show your heart honestly and a deep understanding and special bond will follow.",
        work: "Unseen hardship transforms you into someone unique. The experience you gain through effort will break through the current situation and eventually earn you high recognition.",
        poet: "Attendant to Empress Inpu",
        poetJa: "殷富門院大輔",
        luck: "吉"
    },
    {
        poem: "きりぎりす <ruby>鳴<rt>な</rt></ruby>くや<ruby>霜夜<rt>しもよ</rt></ruby>の さむしろに <ruby>衣<rt>ころも</rt></ruby>かたしき ひとりかも<ruby>寝<rt>ね</rt></ruby><ruby>む<rt>ん</rt></ruby>",
        meaning: "On a cold, frosty night, the cricket cries. Lying alone with one sleeve folded beneath me — how lonely it is.",
        love: "In the harsh loneliness, taking care of yourself will eventually attract a gentle love with whom you can truly connect.",
        work: "Even without recognition from those around you, quiet perseverance will build your confidence and results for the future. The strength to endure solitude calls success toward you.",
        poet: "Gokyōgoku Regent and former Chancellor of the Realm",
        poetJa: "後京極摂政前太政大臣",
        luck: "小吉"
    },
    {
        poem: "わが<ruby>袖<rt>そで</rt></ruby>は <ruby>潮干<rt>しおひ</rt></ruby>に<ruby>見<rt>み</rt></ruby>えぬ <ruby>沖<rt>おき</rt></ruby>の<ruby>石<rt>いし</rt></ruby>の <ruby>人<rt>ひと</rt></ruby>こそ<ruby>知<rt>し</rt></ruby>らね かわくまもなし",
        meaning: "My sleeves are like a rock hidden beneath the tides — unseen by others, they are never dry.",
        love: "Hidden feelings and quiet effort will become the driving force that turns love around. Trust the strength within without rushing.",
        work: "Quiet, unseen effort will bring major results and attention in the near future.",
        poet: "Sanuki, attendant to retired Emperor Nijō",
        poetJa: "二条院讃岐",
        luck: "中吉"
    },
    {
        poem: "<ruby>世<rt>よ</rt></ruby>の<ruby>中<rt>なか</rt></ruby>は つねにもがもな <ruby>渚<rt>なぎさ</rt></ruby>こぐ あまの<ruby>小舟<rt>おぶね</rt></ruby>の <ruby>綱手<rt>つなで</rt></ruby>かなしも",
        meaning: "I wish the world could stay just as it is forever. How moving it is to watch the small fishing boats being towed along the shore.",
        love: "Even within a calm relationship, small worries can lurk. Resolve misunderstandings early and cherish everyday happiness.",
        work: "Even in stable results, do not let your guard down. While protecting what you have, prepare for change and advance your plans.",
        poet: "Minister of the Right of Kamakura",
        poetJa: "鎌倉右大臣",
        luck: "中吉"
    },
    {
        poem: "み<ruby>吉野<rt>よしの</rt></ruby>の <ruby>山<rt>やま</rt></ruby>の<ruby>秋風<rt>あきかぜ</rt></ruby> さ<ruby>夜<rt>よ</rt></ruby>ふけて ふるさと<ruby>寒<rt>さむ</rt></ruby>く <ruby>衣<rt>ころも</rt></ruby>うつなり",
        meaning: "On an autumn night, the mountain wind of Yoshino blows cold. In the old village, I can hear the sound of someone beating cloth.",
        love: "The relationship may feel a bit cool right now, but this is an important time to reflect without rushing.",
        work: "This is a time of quiet, unassuming effort. Focus on your work without rushing.",
        poet: "Councillor Masatsune",
        poetJa: "参議雅経",
        luck: "末吉"
    },
    {
        poem: "お<ruby>ほ<rt>お</rt></ruby>けなく <ruby>憂<rt>う</rt></ruby>き<ruby>世<rt>よ</rt></ruby>の<ruby>民<rt>たみ</rt></ruby>に お<ruby>ほ<rt>お</rt></ruby><ruby>ふ<rt>う</rt></ruby>かな わがたつ<ruby>杣<rt>そま</rt></ruby>に <ruby>墨染<rt>すみぞめ</rt></ruby>の<ruby>袖<rt>そで</rt></ruby>",
        meaning: "How bold it is of me — yet I spread my ink-black sleeves to shelter the people of this troubled world.",
        love: "If you lean on each other with care and affection, things will work out well.",
        work: "You may be taking on important work that supports a broader challenge. Do not overdo it — engage with it steadily and thoroughly.",
        poet: "Former Senior High Priest Jien",
        poetJa: "前大僧正慈円",
        luck: "吉"
    },
    {
        poem: "<ruby>花<rt>はな</rt></ruby>さそ<ruby>ふ<rt>う</rt></ruby> <ruby>嵐<rt>あらし</rt></ruby>の<ruby>庭<rt>にわ</rt></ruby>の <ruby>雪<rt>ゆき</rt></ruby>ならで ふりゆくものは わが<ruby>身<rt>み</rt></ruby>なりけり",
        meaning: "It is not the snow of blossoms scattered by the storm in the garden — it is I myself who am fading with the years.",
        love: "Dazzling love is fleeting. Do not be distracted by appearances — cultivate a deep and lasting bond.",
        work: "Advancement through ingratiation is ultimately hollow. Find what you truly want to do.",
        poet: "Lay Novice and former Chancellor of the Realm",
        poetJa: "入道前太政大臣",
        luck: "吉"
    },
    {
        poem: "<ruby>来<rt>こ</rt></ruby>ぬ<ruby>人<rt>ひと</rt></ruby>を <ruby>松帆<rt>まつほ</rt></ruby>の<ruby>浦<rt>うら</rt></ruby>の <ruby>夕<rt>ゆう</rt></ruby>なぎに <ruby>焼<rt>や</rt></ruby>くやもしほの <ruby>身<rt>み</rt></ruby>もこがれつつ",
        meaning: "Waiting for someone who will not come, at the quiet evening shore — like salt burned from the seaweed, I too am consumed by longing.",
        love: "Your love will surely reach the other person. Wait without rushing, and keep the flame burning.",
        work: "Channel your sense of urgency into steady preparation, and results will come in time.",
        poet: "Acting Middle Counselor Sadaie",
        poetJa: "権中納言定家",
        luck: "末吉"
    },
    {
        poem: "<ruby>風<rt>かぜ</rt></ruby>そよぐ ならの<ruby>小川<rt>おがわ</rt></ruby>の <ruby>夕<rt>ゆう</rt></ruby><ruby>暮<rt>ぐれ</rt></ruby>は みそぎぞ<ruby>夏<rt>なつ</rt></ruby>の しるしなりける",
        meaning: "The breeze rustles through the leaves of the sacred oak trees by the river at dusk. The purification rite is the only sign that summer is here.",
        love: "Even if you sense a shift in the relationship, the underlying bond has not changed. Calmly reaffirm your trust and the promises between you.",
        work: "There are signs of change, but the moment for a full move has not yet arrived. Now is the time to solidify your plans and foundation.",
        poet: "Junior Second Rank Ietaka",
        poetJa: "従二位家隆",
        luck: "吉"
    },
    {
        poem: "<ruby>人<rt>ひと</rt></ruby>もをし <ruby>人<rt>ひと</rt></ruby>もうらめし あ<ruby>ぢ<rt>じ</rt></ruby>きなく <ruby>世<rt>よ</rt></ruby>を<ruby>思<rt>おも</rt></ruby><ruby>ふ<rt>う</rt></ruby>ゆ<ruby>ゑ<rt>え</rt></ruby>に <ruby>物<rt>も</rt></ruby><ruby>思<rt>おも</rt></ruby><ruby>ふ<rt>う</rt></ruby><ruby>身<rt>み</rt></ruby>は",
        meaning: "I find people both dear and hateful. It is because I care so deeply about this troubled world that I am always lost in thought.",
        love: "Feelings of both love and resentment are proof of how seriously you care. Accepting the conflict will help you build a deep, stable love.",
        work: "Complex feelings about things are proof of deep insight. Without being ruled by emotion, looking at things from multiple angles will open a creative path forward.",
        poet: "Retired Emperor Go-Toba",
        poetJa: "後鳥羽院",
        luck: "小吉"
    },
    {
        poem: "ももしきや ふるき<ruby>軒<rt>のき</rt></ruby>ばの しのぶにも な<ruby>ほ<rt>お</rt></ruby>あまりある <ruby>昔<rt>むかし</rt></ruby>なりけり",
        meaning: "Even the ancient ferns on the old eaves of the palace — there is more than enough of the past that they call to mind.",
        love: "Memories of the past are a treasure of the heart. Supported by those recollections, turning your eyes to present connections and warmth will allow a mature love to grow.",
        work: "Past experience is the source of wisdom and courage. Efforts to build a solid footing in the present, drawing on what you have lived through, will lead to even greater flourishing in the future.",
        poet: "Retired Emperor Juntoku",
        poetJa: "順徳院",
        luck: "小吉"
    }
];

function getTodayString() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getTodayResult() {
    if (localStorage.getItem('omikuji_en_date') === getTodayString()) {
        const idx = parseInt(localStorage.getItem('omikuji_en_result_index'), 10);
        if (!isNaN(idx) && idx >= 0 && idx < hyakuninIsshu.length) {
            return { result: hyakuninIsshu[idx], index: idx };
        }
    }
    return null;
}

function saveTodayResult(index) {
    localStorage.setItem('omikuji_en_date', getTodayString());
    localStorage.setItem('omikuji_en_result_index', String(index));
}

// 開発モード：URLに ?dev=1 を付けると、1日の回数制限なしで何度でも引けるようになる
// （本日の結果はlocalStorageに保存されないため、開発モードを外せば通常の1日1回制限に戻る）
const DEV_MODE = new URLSearchParams(location.search).has('dev');
if (DEV_MODE) {
    console.info('[omikuji] Dev mode enabled: no daily draw limit.');
}

/* ── ローマ字変換（gokunarabe.js と同じロジック） ── */
const _H2R = (function () {
    const t = {};
    'きゃkya きゅkyu きょkyo しゃsha しゅshu しょsho ちゃcha ちゅchu ちょcho にゃnya にゅnyu にょnyo ひゃhya ひゅhyu ひょhyo みゃmya みゅmyu みょmyo りゃrya りゅryu りょryo ぎゃgya ぎゅgyu ぎょgyo じゃja じゅju じょjo びゃbya びゅbyu びょbyo ぴゃpya ぴゅpyu ぴょpyo'
        .split(' ').forEach(s => { t[s.slice(0, 2)] = s.slice(2); });
    'あa いi うu えe おo かka きki くku けke こko さsa しshi すsu せse そso たta ちchi つtsu てte とto なna にni ぬnu ねne のno はha ひhi ふfu へhe ほho まma みmi むmu めme もmo やya ゆyu よyo らra りri るru れre ろro わwa ゐwi ゑwe をwo んn がga ぎgi ぐgu げge ごgo ざza じji ずzu ぜze ぞzo だda ぢji づzu でde どdo ばba びbi ぶbu べbe ぼbo ぱpa ぴpi ぷpu ぺpe ぽpo'
        .split(' ').forEach(s => { t[s[0]] = s.slice(1); });
    return t;
})();

function _kanaToRomaji(kana) {
    let r = '', i = 0;
    while (i < kana.length) {
        if (kana[i] === 'っ') {
            const nx = _H2R[kana.slice(i + 1, i + 3)] || _H2R[kana[i + 1]] || '';
            r += nx ? nx[0] : '';
            i++; continue;
        }
        const two = _H2R[kana.slice(i, i + 2)];
        if (two) { r += two; i += 2; continue; }
        r += _H2R[kana[i]] || kana[i];
        i++;
    }
    return r;
}

function _htmlToRomaji(html) {
    // ruby を読み仮名に置換し、<br> 以外のタグを除去
    const withBr = html
        .replace(/<ruby>[^<]*<rt>([^<]*)<\/rt>([^<]*)<\/ruby>/g, '$1$2')
        .replace(/<(?!br\b)[^>]+>/gi, '');
    // <br> で区切ってから各フレーズをローマ字変換し、<br> で再結合
    return withBr.split(/<br\s*\/?>/i).map(seg => _kanaToRomaji(seg.trim())).join('<br>');
}

document.addEventListener('DOMContentLoaded', () => {
    // 開発モード中はひと目でわかるようにバッジを表示
    if (DEV_MODE) {
        const badge = document.createElement('div');
        badge.textContent = 'DEV MODE: no daily limit';
        badge.style.cssText = 'position:fixed;top:0;left:0;z-index:9999;background:#b82343;color:#fff;font-size:12px;padding:4px 10px;font-family:sans-serif;';
        document.body.appendChild(badge);
    }

    // 必要なDOM要素の取得
    const drawButton = document.getElementById('draw-button');
    const omikujiBox = document.getElementById('omikuji-box');
    const omikujiContainer = document.getElementById('omikuji-container');
    const resultArea = document.getElementById('result-area');
    const resetButton = document.getElementById('reset-button');

    // 説明文・セクション・言語切り替えの要素を取得
    const omikujiExplanation = document.querySelectorAll('.omikuji-explanation');
    const hiddenOnResult = document.querySelectorAll('.section, p.lang-wrapper');
    const alreadyDrawnMsg = document.getElementById('already-drawn-msg');
    const omikujiStickWrap = document.getElementById('omikuji-stick-wrap');
    const omikujiStickNumber = document.getElementById('omikuji-stick-number');
    const omikujiImageFront = document.getElementById('omikuji-image-front');
    const omikujiImageBack  = document.getElementById('omikuji-image-back');

    // 結果表示要素
    const wakaPoem = document.getElementById('waka-poem');
    const wakaMeaning = document.getElementById('waka-meaning');
    const interpLove = document.getElementById('interp-love');
    const interpWork = document.getElementById('interp-work');
    const wakaTitle = document.getElementById('waka-title');
    const wakaLuck = document.getElementById('waka-luck');
    const poetImage = document.getElementById('poet-image');
    const wakaCardImage = document.getElementById('waka-card-image');
    const poetNameDisplay = document.getElementById('poet-name-display');
    const romajiBtn = document.getElementById('romaji-toggle-btn');
    const poemLinkBtn = document.getElementById('poem-link-btn');
    let romajiOn = false;

    // フェードインさせる要素のリストを定義 (表示順)
    // 配列でまとめた項目は同じタイミングで一緒にフェードインする
    const fadingElements = [
        wakaTitle,
        [wakaPoem, wakaCardImage].filter(Boolean),
        wakaMeaning && wakaMeaning.closest('.interpretation-section'),
        wakaLuck,
        resultArea && resultArea.querySelector('hr'),
        interpLove && interpLove.closest('.interpretation-section'),
        interpWork && interpWork.closest('.interpretation-section'),
        resultArea && resultArea.querySelector('.result-btn-group')
    ].filter(Boolean);

    // PC表示時のみ、.waka-card-imageの高さを#waka-poemの実測値に合わせる（モバイルはCSSのheight:autoに任せる）
    function syncCardImageHeight() {
        if (!wakaCardImage || !wakaPoem) return;
        if (window.matchMedia('(min-width: 750px)').matches) {
            wakaCardImage.style.height = `${wakaPoem.getBoundingClientRect().height}px`;
        } else {
            wakaCardImage.style.height = '';
        }
    }
    window.addEventListener('resize', syncCardImageHeight);

    /**
     * 結果の内容をセットし、要素を順番にフェードイン表示する
     * @param {object} result - 選ばれた百人一首のデータ
     */
    const luckMap = {
        '大吉': 'Great Fortune',
        '中吉': 'Good Fortune',
        '吉':   'Fortune',
        '小吉': 'Minor Fortune',
        '末吉': 'Modest Fortune',
        '凶':   'Misfortune'
    };

    // Show Romaji ボタン
    if (romajiBtn) {
        romajiBtn.addEventListener('click', () => {
            romajiOn = !romajiOn;
            romajiBtn.textContent = romajiOn ? 'Hide Romaji' : 'Show Romaji';
            romajiBtn.classList.toggle('active', romajiOn);
            const bodySpan = wakaPoem.querySelector('.waka-body');
            if (bodySpan) {
                bodySpan.innerHTML = romajiOn
                    ? _htmlToRomaji(wakaPoem.dataset.originalHtml || '')
                    : (wakaPoem.dataset.originalHtml || '');
            }
            wakaPoem.classList.toggle('romaji-mode', romajiOn);

            // ローマ字切り替えで和歌の高さが変わるため、画像の高さも追従させる
            syncCardImageHeight();
        });
    }

    function displayResultAndFadeIn(result, index) {
        // 歌人画像・歌人名をセット
        const poemNum = String(index + 1).padStart(2, '0');
        poetImage.src = `img/z${poemNum}.webp`;
        poetImage.alt = result.poet;
        if (poetNameDisplay) poetNameDisplay.textContent = result.poet;

        const poemNum3 = String(index + 1).padStart(3, '0');
        if (wakaCardImage) {
            wakaCardImage.src = `img/c_${poemNum3}.webp`;
            wakaCardImage.alt = `Image for poem No. ${index + 1} by ${result.poet}`;
        }

        // waka-poem は日本語のみ（ローマ字切り替え対応のため元HTMLを保存）
        const wakaBodyWithBreaks = result.poem.replace(/ /g, '<br>');
        wakaPoem.dataset.originalHtml = wakaBodyWithBreaks;
        wakaPoem.innerHTML = `
            <span class="waka-body">${wakaBodyWithBreaks}</span>
            <span class="poet-name">${result.poetJa}</span>
            <span class="poem-number">No. ${index + 1}</span>
        `;
        // ローマ字モードをリセット
        romajiOn = false;
        wakaPoem.classList.remove('romaji-mode');
        if (romajiBtn) {
            romajiBtn.textContent = 'Show Romaji';
            romajiBtn.classList.remove('active');
        }
        wakaMeaning.textContent = `\n${result.meaning}`;
        wakaLuck.textContent = `Today's Fortune: ${luckMap[result.luck] || result.luck}`;
        interpLove.textContent = result.love;
        interpWork.textContent = result.work;
        if (poemLinkBtn) poemLinkBtn.href = `gokunarabe_${index + 1}_en.html`;

        // 表示切替
        resultArea.classList.remove('hidden');
        omikujiContainer.classList.add('hidden');
        omikujiExplanation.forEach(el => el.classList.add('hidden'));
        hiddenOnResult.forEach(el => el.classList.add('hidden'));

        // 画像の高さを和歌の実測の高さに合わせる（表示された直後に測定）
        syncCardImageHeight();

        // 中身は opacity:0 でリセット（紙の中身は最初見えない）
        fadingElements.forEach(item => {
            (Array.isArray(item) ? item : [item]).forEach(el => el.classList.remove('show-item'));
        });
        resultArea.classList.remove('paper-sliding', 'paper-blooming');

        // スクロール
        requestAnimationFrame(() => {
            resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        // フェーズ1: するする（紙が上から伸びてくる）0.65s
        resultArea.classList.add('paper-sliding');

        setTimeout(() => {
            // フェーズ2: ふわっ（紙が少し膨らんで落ち着く）0.5s
            resultArea.classList.remove('paper-sliding');
            resultArea.classList.add('paper-blooming');

            setTimeout(() => {
                resultArea.classList.remove('paper-blooming');

                // フェーズ3: 中身が順番にフェードイン
                let delay = 100;
                const interval = 300;
                fadingElements.forEach(item => {
                    const els = Array.isArray(item) ? item : [item];
                    setTimeout(() => els.forEach(el => el.classList.add('show-item')), delay);
                    delay += interval;
                });
            }, 500);
        }, 650);
    }

    // おみくじを引くボタンのイベントリスナー
    drawButton.addEventListener('click', () => {
        drawButton.style.display = 'none';

        // 結果をこの時点で決定（棒に番号を表示するため）
        const randomIndex = Math.floor(Math.random() * hyakuninIsshu.length);
        const poemNumber = randomIndex + 1;
        omikujiStickNumber.textContent = `No. ${poemNumber}`;

        // フェーズ1: 箱が180°反転してコトコト揺れる (1.5s)
        omikujiBox.classList.remove('is-flipping');
        omikujiStickWrap.classList.remove('stick-out');
        omikujiContainer.classList.remove('stick-out');
        omikujiImageFront.src = 'img/omikuji_front.webp';
        omikujiImageBack.src  = 'img/omikuji_back.webp';
        requestAnimationFrame(() => {
            omikujiBox.classList.add('is-flipping');

            // 90°通過のタイミング（約140ms）で画像を入れ替え（ほぼ横向きで気づかれない）
            setTimeout(() => {
                omikujiImageFront.src = 'img/omikuji_front2.webp';
                omikujiImageBack.src  = 'img/omikuji_back2.webp';
            }, 140);

            // フェーズ2: 揺れが止まったら棒をするっと下に出す
            setTimeout(() => {
                omikujiStickWrap.classList.add('stick-out');
                omikujiContainer.classList.add('stick-out');

                // フェーズ3: 棒が出た後に結果画面へ
                setTimeout(() => {
                    try {
                        const result = hyakuninIsshu[randomIndex];
                        if (!DEV_MODE) {
                            saveTodayResult(randomIndex);
                            alreadyDrawnMsg.style.display = 'block';
                        }
                        displayResultAndFadeIn(result, randomIndex);
                    } catch (e) {
                        console.error('[omikuji] 結果表示エラー:', e);
                        drawButton.style.display = '';
                    }
                }, 1500);
            }, 1500);
        });
    });

    // 戻るボタンのイベントリスナー（結果を閉じて引く画面に戻る）
    resetButton.addEventListener('click', () => {
        // 結果エリアを非表示にし、おみくじ箱を表示
        resultArea.classList.add('hidden');
        omikujiContainer.classList.remove('hidden');

        // 箱・棒をリセット
        omikujiBox.classList.remove('is-flipping');
        omikujiStickWrap.classList.remove('stick-out');
        omikujiContainer.classList.remove('stick-out');
        omikujiStickNumber.textContent = '';
        omikujiImageFront.src = 'img/omikuji_front.webp';
        omikujiImageBack.src  = 'img/omikuji_back.webp';

        // ⭐︎追加: 説明文を表示に戻す
        omikujiExplanation.forEach(el => el.classList.remove('hidden'));
        hiddenOnResult.forEach(el => el.classList.remove('hidden'));

        // リセット時にフェードインクラスをクリアしておく
        fadingElements.forEach(item => {
            (Array.isArray(item) ? item : [item]).forEach(el => el.classList.remove('show-item'));
        });

        // ローマ字モードをリセット
        romajiOn = false;
        wakaPoem.classList.remove('romaji-mode');
        if (romajiBtn) {
            romajiBtn.textContent = 'Show Romaji';
            romajiBtn.classList.remove('active');
        }

        // 本日すでに引いている場合はボタンを非表示にしてメッセージ表示（開発モードでは常に再表示）
        if (!DEV_MODE && getTodayResult()) {
            drawButton.style.display = 'none';
            alreadyDrawnMsg.style.display = 'block';
        } else {
            drawButton.style.display = '';
            alreadyDrawnMsg.style.display = 'none';
        }
    });

    // ページ読み込み時に本日すでに引いていればボタンを非表示（開発モードでは制限なし）
    if (!DEV_MODE && getTodayResult()) {
        drawButton.style.display = 'none';
        alreadyDrawnMsg.style.display = 'block';
    }
});
