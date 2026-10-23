// ../js/move_script.js

// 百人一首データ（抜粋・簡略化）
// 歌人名と和歌を改行して表示するため、歌の本文データから句ごとの <br> タグを削除しています。
const hyakuninIsshu = [
    {
        poem: "<ruby>秋<rt>あき</rt></ruby>の<ruby>田<rt>た</rt></ruby>の かりほの<ruby>庵<rt>いお</rt></ruby>の <ruby>苫<rt>とま</rt></ruby>をあらみ <ruby>我<rt>わ</rt></ruby>が<ruby>衣手<rt>ころもで</rt></ruby>は <ruby>露<rt>つゆ</rt></ruby>にぬれつつ",
        meaning: "By the rice fields, in a makeshift hut with a loosely woven roof, my sleeves are wet with the night dew.",
        story: "As Prince Naka no Ōe, Emperor Tenji struck down Soga no Iruka in the Isshi Incident and drove the Taika Reforms. He survived a crushing defeat at the Battle of Baekgang, moved the capital to Ōmi, and devoted himself to building the nation's institutions. This poem is loved as the emperor's sympathy for the farmers whose sleeves grew wet with night dew as they kept watch in their rough huts in the rice fields.",
        love: "Quiet compassion for another's hardships moves hearts more than flowery words. Put yourself in their place and try to understand how they feel.",
        work: "Even great reforms are built one steady step at a time. Don't let setbacks discourage you, and never cut corners on unseen tasks or the groundwork — that is what leads to great results.",
        poet: "Emperor Tenji",
        poetJa: "天智天皇",
        luck: "中吉"
    },
    {
        poem: "<ruby>春<rt>はる</rt></ruby><ruby>過<rt>す</rt></ruby>ぎて <ruby>夏<rt>なつ</rt></ruby><ruby>来<rt>き</rt></ruby>にけらし <ruby>白妙<rt>しろたえ</rt></ruby>の <ruby>衣<rt>ころも</rt></ruby>ほす<ruby>てふ<rt>ちょう</rt></ruby> <ruby>天<rt>あま</rt></ruby>の<ruby>香具山<rt>かぐやま</rt></ruby>",
        meaning: "Spring has passed and summer seems to have come — white robes are said to be hung out to dry on the heavenly Mount Kagu.",
        story: "Daughter of Emperor Tenji, Empress Jitō fought through the Jinshin War beside her husband, Emperor Tenmu. After losing both her husband and her son, she took the throne herself, built the Fujiwara capital, and carried on the work of nation-building. This poem vividly captures the change from spring to summer in the pure white robes hung out to dry on Mount Kagu.",
        love: "A change in your surroundings is a sign that your relationship is moving to a new stage. Don't cling to the past; take the next step as naturally as the seasons change.",
        work: "This is a time to inherit the hopes of someone dear and shape them with your own hands. Act without hesitation, and the plans you have been nurturing will move forward all at once.",
        poet: "Empress Jitō",
        poetJa: "持統天皇",
        luck: "吉"
    },
    {
        poem: "あしびきの <ruby>山鳥<rt>やまどり</rt></ruby>の<ruby>尾<rt>お</rt></ruby>の しだり<ruby>尾<rt>お</rt></ruby>の ながながし<ruby>夜<rt>よ</rt></ruby>を ひとりかも<ruby>寝<rt>ね</rt></ruby><ruby>む<rt>ん</rt></ruby>",
        meaning: "As long as the trailing tail feathers of the mountain bird — through these long, long nights, must I sleep alone?",
        story: "Kakinomoto no Hitomaro is the great poet of the Man'yōshū, revered with Yamabe no Akahito as a \"sage of poetry.\" He composed elegies for members of the imperial family at Empress Jitō's court, and later came to be worshipped as a god of poetry at shrines across Japan. This poem laments a long autumn night spent alone, as long as the trailing tail of the mountain pheasant.",
        love: "The lonely nights may seem endless right now. Yet that loneliness shows how much you care for someone. Turn your time alone into time to grow, and a connection will come your way.",
        work: "However long the road to your goal, keep polishing your craft and, like Hitomaro, you will one day be recognized as a master. Steady perseverance is your greatest strength.",
        poet: "Kakinomoto no Hitomaro",
        poetJa: "柿本人麻呂",
        luck: "小吉"
    },
    {
        poem: "<ruby>田子<rt>たご</rt></ruby>の<ruby>浦<rt>うら</rt></ruby>に うちいでてみれば<br><ruby>白妙<rt>しろたえ</rt></ruby>の <ruby>富士<rt>ふじ</rt></ruby>の<ruby>高嶺<rt>たかね</rt></ruby>に <ruby>雪<rt>ゆき</rt></ruby>は<ruby>降<rt>ふ</rt></ruby>りつつ",
        meaning: "Going out to Tago Bay and looking around, I see snow falling ceaselessly on the high peak of Fuji, white as freshly woven cloth.",
        story: "Yamabe no Akahito, a Nara-period poet, was praised alongside Hitomaro as one of the two great masters of the Man'yōshū. He was not a high-ranking official, but he accompanied Emperor Shōmu on his journeys and made his name with poems that portray the beauty of nature just as it is. This poem, describing the majestic snow-covered Mount Fuji seen from Tago Bay, is one of the finest in the Hyakunin Isshu.",
        love: "A sign of great fortune, as if the view suddenly opened up before you. Your natural, unpretentious charm will shine and draw many admiring eyes.",
        work: "True skill is always recognized, whatever your rank or title. Your efforts are about to be rewarded — this is your chance to step into the spotlight.",
        poet: "Yamabe no Akahito",
        poetJa: "山部赤人",
        luck: "大吉"
    },
    {
        poem: "<ruby>奥山<rt>おくやま</rt></ruby>に <ruby>紅葉<rt>もみじ</rt></ruby><ruby>踏<rt>ふ</rt></ruby>み<ruby>分<rt>わ</rt></ruby>け <ruby>鳴<rt>な</rt></ruby>く<ruby>鹿<rt>しか</rt></ruby>の <ruby>声<rt>こえ</rt></ruby><ruby>聞<rt>き</rt></ruby>く<ruby>時<rt>とき</rt></ruby>ぞ <ruby>秋<rt>あき</rt></ruby>はかなしき",
        meaning: "Deep in the mountains, treading through the scattered autumn leaves, I hear a deer cry. Listening to that voice, I feel the sadness of autumn all the more.",
        story: "Though counted among the Thirty-Six Immortal Poets, Sarumaru Dayū is a legendary poet wrapped in mystery. Some say he was a descendant of Prince Shōtoku, others that he was Kakinomoto no Hitomaro himself — many theories have been handed down. This poem feels the deep sadness of autumn in the cry of a deer treading through fallen maple leaves deep in the mountains.",
        love: "It is hard to read the other person's heart right now, and that can be frustrating. Rather than rushing for an answer, wait quietly and work on yourself; good news will come in time.",
        work: "It is the work you leave behind, more than your name or title, that people remember. This is a good moment to pause and reconsider which path you truly want to follow.",
        poet: "Sarumaru Dayū",
        poetJa: "猿丸太夫",
        luck: "末吉"
    },
    {
        poem: "かささぎの <ruby>渡<rt>わた</rt></ruby>せる<ruby>橋<rt>はし</rt></ruby>に おく<ruby>霜<rt>しも</rt></ruby>の <ruby>白<rt>しろ</rt></ruby>きをみれば <ruby>夜<rt>よ</rt></ruby>ぞふけにける",
        meaning: "Looking up at the Milky Way that magpies wing across — its white shimmer seems to be scattered frost. The night deepens.",
        story: "Born into the distinguished Ōtomo clan, Ōtomo no Yakamochi is believed to have played a major role in compiling the Man'yōshū. His life had many ups and downs — he was caught up in power struggles and sent to distant posts — yet he left a wealth of poems, especially from his years as governor of Etchū, and finally rose to Middle Counselor. This poem senses the deepening night in the whiteness of the frost on the magpie bridge of the Tanabata legend.",
        love: "Just as the Tanabata lovers trust in their once-a-year reunion, your bond continues even when you are apart. A heart that believes and waits is the key to deepening your relationship.",
        work: "Even when things don't go your way, what you keep building will become a great asset later. Like Yakamochi, who wrote so many fine poems far from the capital, give your best wherever you are.",
        poet: "Middle Counselor Yakamochi",
        poetJa: "中納言家持",
        luck: "中吉"
    },
    {
        poem: "<ruby>天<rt>あま</rt></ruby>の<ruby>原<rt>はら</rt></ruby> ふりさけみれば<br><ruby>春日<rt>かすが</rt></ruby>なる <ruby>三笠<rt>みかさ</rt></ruby>の<ruby>山<rt>やま</rt></ruby>に <ruby>出<rt>い</rt></ruby>でし<ruby>月<rt>つき</rt></ruby>かも",
        meaning: "Looking up at the vast sky, I see the moon. Is that the same moon that rose over Mount Mikasa in Kasuga, so long ago?",
        story: "Abe no Nakamaro crossed to Tang China as a young student and rose to be an official at the Tang court. He became friends with Li Bai and Wang Wei, but the ship taking him home was blown off course by a storm, and he never returned to Japan, ending his life in China. In this poem, the moon he gazed at in a foreign land overlaps with the moon over Mount Mikasa in his hometown of Nara.",
        love: "Even far apart, your hearts are connected, as if you were both looking up at the same moon. Don't let the distance defeat you; making the effort to share your feelings will strengthen your bond.",
        work: "Even in new surroundings, your ability and your connections with people will support you. When you are unsure, return to your starting point, as Nakamaro remembered the moon of home.",
        poet: "Abe no Nakamaro",
        poetJa: "安倍仲麻呂",
        luck: "中吉"
    },
    {
        poem: "わが<ruby>庵<rt>いお</rt></ruby>は <ruby>都<rt>みやこ</rt></ruby>の<ruby>辰巳<rt>たつみ</rt></ruby> しかぞすむ <ruby>世<rt>よ</rt></ruby>をう<ruby>ぢ<rt>じ</rt></ruby><ruby>山<rt>やま</rt></ruby>と <ruby>人<rt>ひと</rt></ruby>はい<ruby>ふ<rt>う</rt></ruby>なり",
        meaning: "My home is in the southeast of the capital, and I live here at peace. People say I moved to Mount Uji because I found the world hard to bear — but that is only what others say.",
        story: "One of the Six Poetic Immortals, Priest Kisen left the capital and built a hermitage on Mount Uji. Only this one poem can be surely attributed to him, yet with that single poem his name has lived on for more than a thousand years. In it, he says that although people gossip that he has fled from a gloomy world, he is living calmly southeast of the capital.",
        love: "Don't be swayed by gossip; value your own pace. Only when your heart is at peace will your bonds with the people you love grow deeper.",
        work: "Choose a way of working you are satisfied with, rather than one that pleases others. Rest is also a way forward. Once you have restored your mind and body, even a single piece of work can make your name.",
        poet: "Priest Kisen",
        poetJa: "喜撰法師",
        luck: "小吉"
    },
    {
        poem: "<ruby>花<rt>はな</rt></ruby>の<ruby>色<rt>いろ</rt></ruby>は うつりにけりな いた<ruby>づ<rt>ず</rt></ruby>らに わが<ruby>身<rt>み</rt></ruby>よにふる ながめせしまに",
        meaning: "How the beauty of the cherry blossoms faded away, soaked by the long spring rains. And just like them, my own looks have faded too, lost in a haze of endless longing.",
        story: "The only woman among the Six Poetic Immortals, Ono no Komachi was celebrated as a woman of matchless beauty. Many stories have been handed down about her, from the legend of Captain Fukakusa, who courted her for a hundred nights, to tales of her falling into poverty in old age. In this poem, she likens the cherry blossoms faded by the long rains to the time of her own life that slipped away while she was lost in thought.",
        love: "Youth and beauty may fade, but the depth of heart you have grown through reflection never does. Cultivating your inner charm leads to a love that lasts.",
        work: "Even if you feel you have wasted time, the days you spent worrying have sharpened your sensitivity. Make that experience a strength that only you possess.",
        poet: "Ono no Komachi",
        poetJa: "小野小町",
        luck: "末吉"
    },
    {
        poem: "これやこの <ruby>行<rt>ゆ</rt></ruby>くも<ruby>帰<rt>かえ</rt></ruby>るも わかれては しるもしらぬも <ruby>逢坂<rt>おうさか</rt></ruby>の<ruby>関<rt>せき</rt></ruby>",
        meaning: "So this is it — the Barrier of Ōsaka, where those who leave and those who return, those who know each other and those who do not, all meet and part.",
        story: "Semimaru is said to have been a blind master of the biwa lute who lived in a hut at the Ōsaka Barrier. Some say he was the son of an emperor, and a story tells how the courtier Minamoto no Hiromasa visited him for three years to learn his secret melodies. This poem describes the Ōsaka Barrier, where people come and go, meeting and parting.",
        love: "Meetings and partings are part of life. A gentle heart that does not hold back those who leave, and treasures those newly met, will bring good connections.",
        work: "With genuine skill, people will seek you out from far away. Even as things change around you, keep honing your craft and the way will open.",
        poet: "Semimaru",
        poetJa: "蝉丸",
        luck: "中吉"
    },
    {
        poem: "わたの<ruby>原<rt>はら</rt></ruby> <ruby>八十島<rt>やそしま</rt></ruby>かけて <ruby>漕<rt>こ</rt></ruby>ぎ<ruby>出<rt>い</rt></ruby>でぬと <ruby>人<rt>ひと</rt></ruby>にはつげよ あまのつり<ruby>舟<rt>ぶね</rt></ruby>",
        meaning: "I have set out rowing across the vast sea, heading for the many islands far away. Tell the people back home.",
        story: "Chosen as deputy envoy to Tang China, Ono no Takamura refused to board when he was about to be put on a damaged ship for the chief envoy's convenience. He then wrote a poem satirizing the court, which so angered Retired Emperor Saga that he was exiled to the Oki Islands. This poem was composed at the time of that exile. Takamura was later pardoned, returned to the capital, and rose all the way to Councillor.",
        love: "Standing by your principles may distance you from people for a while. Even so, your honesty will be understood in time. Keep telling the people you love how you feel, even from far away.",
        work: "Sometimes you need the courage to say that something unfair is wrong. If you keep sharpening your skills without growing bitter, even in adversity, the day will come when you are recognized again, just like Takamura.",
        poet: "Councillor Takamura",
        poetJa: "参議篁",
        luck: "末吉"
    },
    {
        poem: "<ruby>天<rt>あま</rt></ruby>つ<ruby>風<rt>かぜ</rt></ruby> <ruby>雲<rt>くも</rt></ruby>のかよ<ruby>ひ<rt>い</rt></ruby><ruby>路<rt>じ</rt></ruby> <ruby>吹<rt>ふ</rt></ruby>きと<ruby>ぢ<rt>じ</rt></ruby>よ をとめの<ruby>姿<rt>すがた</rt></ruby> しばしとどめ<ruby>む<rt>ん</rt></ruby>",
        meaning: "Heavenly wind, please close the path through the clouds! I want to keep the celestial maidens here a little longer.",
        story: "Yoshimine no Munesada, a grandson of Emperor Kanmu, was a trusted Head Chamberlain to Emperor Ninmyō. When the emperor died he became a monk named Henjō, and later rose to sōjō, the highest rank of the Buddhist clergy. He wrote this poem before he became a monk, captivated by the beauty of dancers who moved like heavenly maidens and wishing he could keep them there a little longer.",
        love: "It is natural to be captivated by beauty. Cherish that flutter of the heart, and think about how to convey it to the other person; your romance will move forward.",
        work: "Even when a major turning point comes, your past experience is never wasted. Just as Munesada reached the top as a monk, you can shine on a new path too.",
        poet: "High Priest Henjō",
        poetJa: "僧正遍昭",
        luck: "小吉"
    },
    {
        poem: "<ruby>筑波嶺<rt>つくばね</rt></ruby>の <ruby>峰<rt>みね</rt></ruby>より<ruby>落<rt>お</rt></ruby>つる みなの<ruby>川<rt>がわ</rt></ruby> こひぞつもりて <ruby>淵<rt>ふち</rt></ruby>となりぬる",
        meaning: "Just as the streams from the peak of Tsukuba flow down to fill the deep pools of the Mina River, so my love for you has gathered deep within me.",
        story: "Emperor Yōzei came to the throne at the age of nine, but an incident at the palace led Fujiwara no Mototsune to force him to abdicate. Although he gave up the throne while still young, he lived on as a retired emperor for more than sixty years. This poem describes a love growing deeper, just as drops falling from the peak of Mount Tsukuba gather into a deep pool.",
        love: "Even small feelings, piled up over time, become a deep love. Don't rush; cherish the small exchanges of each day.",
        work: "A stumble in your youth does not mean your life is over. Focus deeply on one goal and build little by little; it will add up to a great achievement.",
        poet: "Retired Emperor Yōzei",
        poetJa: "陽成院",
        luck: "中吉"
    },
    {
        poem: "<ruby>陸奥<rt>みちのく</rt></ruby>の しのぶも<ruby>ぢ<rt>じ</rt></ruby>ずり <ruby>誰<rt>たれ</rt></ruby>ゆ<ruby>ゑ<rt>え</rt></ruby>に <ruby>乱<rt>みだ</rt></ruby>れそめにし <ruby>我<rt>われ</rt></ruby>ならなくに",
        meaning: "For whose sake has my heart become as disordered as the tangled patterns of Shinobu-mojizuri cloth of Mutsu? It is certainly not my own doing.",
        story: "Born a son of Emperor Saga, Minamoto no Tōru rose to Minister of the Left. A man of refined taste, he recreated the scenery of Shiogama in Michinoku in the garden of his Kyoto mansion, Kawara-no-in, and is said to have had seawater carried in so salt could be boiled there. He is considered one of the models for Hikaru Genji in The Tale of Genji. This poem compares a heart thrown into turmoil by love to the tangled pattern of shinobu-mojizuri cloth from Michinoku.",
        love: "A heart in turmoil is a sign that love is beginning. Even if you feel confused, accept that feeling honestly and nurture it with care.",
        work: "A playful spirit and a sense of beauty are real strengths. Turn your passion into action and creation, and a path that is truly yours will open.",
        poet: "Minister of the Left of Kawara",
        poetJa: "河原左大臣",
        luck: "吉"
    },
    {
        poem: "<ruby>君<rt>きみ</rt></ruby>がため <ruby>春<rt>はる</rt></ruby>の<ruby>野<rt>の</rt></ruby>に<ruby>出<rt>い</rt></ruby>でて <ruby>若菜<rt>わかな</rt></ruby>つむ わが<ruby>衣手<rt>ころもで</rt></ruby>に <ruby>雪<rt>ゆき</rt></ruby>は<ruby>降<rt>ふ</rt></ruby>りつつ",
        meaning: "Going out into the spring fields to pick young greens for you — the snow falls on my sleeves.",
        story: "After Emperor Yōzei abdicated, Emperor Kōkō was put forward by Fujiwara no Mototsune and came to the throne at the age of fifty-five. Known for his gentle, cultured character, he revived court events that had fallen out of use. This poem was sent with young spring greens, picked in a field under falling snow, filled with his feelings for the person who received them.",
        love: "Your sincere thoughtfulness will reach the other person, and your love will grow deeper. Small gifts and kind gestures bring great joy.",
        work: "A chance you have waited long for is the reward of steady, sincere effort. It's fine to bloom late. The trust of those around you will bring you an important role.",
        poet: "Emperor Kōkō",
        poetJa: "光孝天皇",
        luck: "吉"
    },
    {
        poem: "<ruby>立<rt>た</rt></ruby>ち<ruby>別<rt>わか</rt></ruby>れ いなばの<ruby>山<rt>やま</rt></ruby>の <ruby>峰<rt>みね</rt></ruby>に<ruby>生<rt>お</rt></ruby><ruby>ふ<rt>う</rt></ruby>る まつとし<ruby>聞<rt>き</rt></ruby>かば <ruby>今<rt>いま</rt></ruby><ruby>帰<rt>かえ</rt></ruby>りこ<ruby>む<rt>ん</rt></ruby>",
        meaning: "I am leaving for the province of Inaba, where the pines grow on the mountain peak. If I hear that you are waiting for me, I will come back right away.",
        story: "The elder brother of Ariwara no Narihira, Ariwara no Yukihira served in provincial posts and other offices before rising to Middle Counselor. Legend says he once lived in Suma, and he is said to have invented the suma-goto, a one-stringed zither. He wrote this poem when leaving to take up his post as governor of Inaba: \"If I hear that you are waiting, I will come straight back.\"",
        love: "Even when you are apart, the words \"I'm waiting for you\" keep you connected. Believe and wait, and the time to meet again will come.",
        work: "A good time to take on a new place or department. Wherever you go, valuing a place to come home to and colleagues you can trust is the key to success.",
        poet: "Middle Counselor Yukihira",
        poetJa: "中納言行平",
        luck: "中吉"
    },
    {
        poem: "ちはやぶる <ruby>神代<rt>かみよ</rt></ruby>もきかず <ruby>竜田川<rt>たつたがわ</rt></ruby> から<ruby>紅<rt>くれない</rt></ruby>に <ruby>水<rt>みず</rt></ruby>くくるとは",
        meaning: "Even the ancient gods never heard of this — the Tatsuta River, dyeing its waters a deep crimson with fallen maple leaves.",
        story: "A grandson of Emperor Heizei, Ariwara no Narihira is thought to be the model for the hero of The Tales of Ise. Handsome and free-spirited, he is the subject of many stories, including a romance with a woman who later became an empress and a journey to the eastern provinces. This poem praises the beauty of maple leaves dyeing the Tatsuta River a brilliant crimson — a sight unknown even in the age of the gods.",
        love: "The flame of passionate love surrounds you. Even if it breaks the rules, expressing your feelings from the heart will dye the other person's heart in brilliant colors.",
        work: "A time when unconventional ideas shine. Add a touch of calm to your passion and you will achieve solid success.",
        poet: "Ariwara no Narihira Ason",
        poetJa: "在原業平朝臣",
        luck: "吉"
    },
    {
        poem: "<ruby>住<rt>すみ</rt></ruby>の<ruby>江<rt>え</rt></ruby>の <ruby>岸<rt>きし</rt></ruby>による<ruby>波<rt>なみ</rt></ruby> よるさ<ruby>へ<rt>え</rt></ruby>や <ruby>夢<rt>ゆめ</rt></ruby>のかよひ<ruby>路<rt>じ</rt></ruby> <ruby>人目<rt>ひとめ</rt></ruby>よくら<ruby>む<rt>ん</rt></ruby>",
        meaning: "Even in my dreams, I find myself longing to go to you along the path of dreams — but do I hide from others' eyes even in the night?",
        story: "One of the Thirty-Six Immortal Poets, Fujiwara no Toshiyuki was also famous as a master calligrapher. He is said to have written the plaque for the great hall of the palace, yet a tale also says he suffered in hell because he copied many Lotus Sutras without first purifying himself. This poem longs for a lover who, avoiding people's eyes, will not come even along the path of dreams.",
        love: "You want to meet, yet cannot — even in dreams you seem to miss each other. Are you keeping your distance out of shyness or concern for what others think? Take a small step toward them, and the relationship will begin to move.",
        work: "It matters to work carefully and wholeheartedly, not just to get through a lot of tasks. Don't worry too much about how others see you; say what you think frankly, and the way will open.",
        poet: "Fujiwara no Toshiyuki Ason",
        poetJa: "藤原敏行朝臣",
        luck: "小吉"
    },
    {
        poem: "<ruby>難波潟<rt>なにわがた</rt></ruby> みじかき<ruby>葦<rt>あし</rt></ruby>の ふしのまも <ruby>逢<rt>あ</rt></ruby><ruby>は<rt>わ</rt></ruby>でこの<ruby>世<rt>よ</rt></ruby>を <ruby>過<rt>す</rt></ruby>ぐしてよとや",
        meaning: "In this short life, even as brief as a joint of reed at Naniwa Bay, must I pass through this world without ever meeting you?",
        story: "Ise served Empress Onshi, consort of Emperor Uda, and was known for her passionate love poems. She lost her love affair with Fujiwara no Nakahira, and bore Emperor Uda a son who died in infancy — a life of loves and partings. More of her poems were chosen for the Kokin Wakashū than those of any other woman. In this poem, she asks a cold lover whether he means for her to end her life without meeting him for even the briefest moment.",
        love: "You want to meet, even for the briefest moment. Now is the time to put that earnest wish into words without holding back. Put time with the person you love above everything else.",
        work: "You are being tested on how well you can focus within limited time. Like Ise, who turned painful experiences into the power of expression, shaping your feelings into form will produce great results.",
        poet: "Ise",
        poetJa: "伊勢",
        luck: "中吉"
    },
    {
        poem: "わびぬれば いまはたおなじ <ruby>難波<rt>なにわ</rt></ruby>なる みをつくしても <ruby>逢<rt>あ</rt></ruby><ruby>は<rt>わ</rt></ruby><ruby>む<rt>ん</rt></ruby>とぞ<ruby>思<rt>おも</rt></ruby><ruby>ふ<rt>う</rt></ruby>",
        meaning: "Since things have come to this, it no longer matters. Even if I must sacrifice everything, I still want to meet you.",
        story: "A son of Emperor Yōzei, Prince Motoyoshi was known as a romantic man of refined tastes. His love affair with Kyōgoku no Miyasudokoro, a consort of Retired Emperor Uda, became known to all and caused a great scandal. This poem was written when the affair came to light: \"I want to see you, even if it ruins me.\"",
        love: "A secret or a rumor may come to light and cause you pain. If your feelings are true, make up your mind and face things sincerely. It is also important to wait for time to heal.",
        work: "Things are stalled and not moving as you hoped. Instead of forcing them, protect what you have and build your inner strength; it will lead to a leap forward later.",
        poet: "Prince Motoyoshi",
        poetJa: "元良親王",
        luck: "末吉"
    },
    {
        poem: "<ruby>今<rt>いま</rt></ruby>こ<ruby>む<rt>ん</rt></ruby>と い<ruby>ひ<rt>い</rt></ruby>しばかりに <ruby>長月<rt>ながつき</rt></ruby>の <ruby>有明<rt>ありあけ</rt></ruby>の<ruby>月<rt>つき</rt></ruby>を <ruby>待<rt>ま</rt></ruby>ち<ruby>出<rt>い</rt></ruby>でつるかな",
        meaning: "Just because you said \"I will come right away\" — I waited all night for you, watching the moon of the long autumn month until it set at dawn.",
        story: "The son of High Priest Henjō, Priest Sosei became a monk like his father and made his name through poetry. He was often invited to Emperor Uda's poetry contests and was chosen as one of the Thirty-Six Immortal Poets. This love poem is written from the point of view of a woman who trusted a lover's promise to \"come right away,\" waited all night, and ended up watching the autumn moon until dawn.",
        love: "Faithfully trusting a promise and waiting is a beautiful thing — but waiting alone only lets time slip by. Look at what the other person does rather than what they say, and share your own feelings honestly too.",
        work: "Counting too much on other people's promises or replies will make you miss your chance. Set a deadline, follow up, and take the first step yourself to move things forward.",
        poet: "Priest Sosei",
        poetJa: "素性法師",
        luck: "末吉"
    },
    {
        poem: "<ruby>吹<rt>ふ</rt></ruby>くからに <ruby>秋<rt>あき</rt></ruby>の<ruby>草木<rt>くさき</rt></ruby>の しをるれば むべ<ruby>山風<rt>やまかぜ</rt></ruby>を <ruby>嵐<rt>あらし</rt></ruby>とい<ruby>ふ<rt>う</rt></ruby>ら<ruby>む<rt>ん</rt></ruby>",
        meaning: "The moment the autumn wind blows, the grasses and trees wither. Now I understand why the mountain wind is called \"arashi\" — storm.",
        story: "Though one of the Six Poetic Immortals, Fun'ya no Yasuhide spent his whole life in low-ranking posts. He was close to Ono no Komachi, and a story tells how, when leaving for a provincial post, he invited her to come along. This poem is a play on characters: put \"mountain\" (山) and \"wind\" (風) together and you get \"storm\" (嵐).",
        love: "A casual invitation or a joke may bring an unexpected connection. Brightness and smiles will bring the two of you closer.",
        work: "A time of big changes. Don't fuss over titles; with humor and quick wit as your weapons, you can get through any situation.",
        poet: "Fun'ya no Yasuhide",
        poetJa: "文屋康秀",
        luck: "中吉"
    },
    {
        poem: "<ruby>月<rt>つき</rt></ruby>みれば ちぢにものこそ <ruby>悲<rt>かな</rt></ruby>しけれ わが<ruby>身<rt>み</rt></ruby><ruby>一<rt>ひと</rt></ruby>つの <ruby>秋<rt>あき</rt></ruby>にはあらねど",
        meaning: "When I look at the moon, a thousand thoughts rise up and fill me with sadness. Yet this autumn is not mine alone.",
        story: "Born into a family of Chinese-classics scholars, Ōe no Chisato presented Emperor Uda with the Kudai Waka, a collection that turned lines of Chinese poetry into waka. He was a poet who brought his learning in Chinese verse into Japanese poetry. This poem says that gazing at the autumn moon fills him with countless sorrows — even though autumn has not come to him alone.",
        love: "You may find yourself lost in thought more often, but that sensitivity is part of your charm. If you start overthinking, step outside and try putting your feelings into words.",
        work: "The key to success is finding ways to turn what you have learned into something new. Try expressing the wisdom of those who came before you in your own words.",
        poet: "Ōe no Chisato",
        poetJa: "大江千里",
        luck: "小吉"
    },
    {
        poem: "このたびは <ruby>幣<rt>ぬさ</rt></ruby>もとりあ<ruby>へ<rt>え</rt></ruby>ず <ruby>手向山<rt>たむけやま</rt></ruby> もみぢのにしき <ruby>神<rt>かみ</rt></ruby>のまにまに",
        meaning: "This time, setting out in haste, I could not bring any offerings. O god of Mount Tamuke, please accept instead this brocade of autumn leaves, as you will.",
        story: "From a family of scholars, Sugawara no Michizane was highly valued by Emperor Uda and rose to Minister of the Right. But slander by Fujiwara no Tokihira had him demoted to Dazaifu in Kyushu, where he died. After his death he was worshipped as Tenjin, and today he is beloved as the god of learning. In this poem, unable to prepare offerings for a sudden journey, he offers the maple leaves of Mount Tamuke to the gods instead.",
        love: "You don't need a special gift or perfect preparation. Express your feelings wholeheartedly with whatever you have now, and your sincerity will reach them.",
        work: "Even when you are not fully prepared, making the most of what is at hand will open the way. Flexibility and sincerity will win the trust of those around you.",
        poet: "Kanke",
        poetJa: "菅家",
        luck: "中吉"
    },
    {
        poem: "<ruby>名<rt>な</rt></ruby>にし<ruby>負<rt>お</rt></ruby>はば <ruby>逢坂山<rt>おうさかやま</rt></ruby>の さねか<ruby>づ<rt>ず</rt></ruby>ら <ruby>人<rt>ひと</rt></ruby>にしられで くるよしもがな",
        meaning: "If the name of Ōsaka carries its meaning — then let me secretly follow the vine I draw toward me, and come to you unseen.",
        story: "Fujiwara no Sadakata, an uncle of Emperor Daigo, rose to Minister of the Right. Skilled in poetry and music, he was also a patron who supported poets such as Ki no Tsurayuki and Ōshikōchi no Mitsune. In this love poem, he wishes he could draw his beloved to him unseen, like the sanekazura vine of Mount Ōsaka, whose name echoes the word for \"to meet.\"",
        love: "Try finding a subtle way to let your hidden feelings reach the other person. A light touch, like a play on words, will close the distance between you.",
        work: "A time when you shine by supporting others and drawing out their talents. Cheering on the people around you will, in time, raise your own standing too.",
        poet: "Minister of the Right of Sanjō",
        poetJa: "三条右大臣",
        luck: "中吉"
    },
    {
        poem: "<ruby>小倉山<rt>おぐらやま</rt></ruby> <ruby>峰<rt>みね</rt></ruby>のもみ<ruby>ぢ<rt>じ</rt></ruby><ruby>葉<rt>は</rt></ruby> <ruby>心<rt>こころ</rt></ruby>あらば <ruby>今<rt>いま</rt></ruby>ひとたびの みゆき<ruby>待<rt>ま</rt></ruby>たな<ruby>む<rt>ん</rt></ruby>",
        meaning: "O maple leaves of Ogura Mountain, if you have a heart — hold on a little longer, until the emperor's visit.",
        story: "After his elder brother Tokihira died, Fujiwara no Tadahira took over the government and led the court for many years as Regent and Kampaku. He weathered crises such as Taira no Masakado's rebellion, and his descendants became the family that served as regents for generations. In this poem, he calls to the maple leaves of Mount Ogura: \"Wait without falling until the emperor visits once more.\"",
        love: "Rather than rushing into action, wait for the right moment. Thoughtful consideration for the other person will help a good relationship last.",
        work: "A chance that could be a major turning point is coming. Like Tadahira, who took over from his brother, prepare well now so that you can rise to the role when it comes.",
        poet: "Teishin-kō",
        poetJa: "貞信公",
        luck: "吉"
    },
    {
        poem: "みかの<ruby>原<rt>はら</rt></ruby> わきて<ruby>流<rt>なが</rt></ruby>るる い<ruby>づ<rt>ず</rt></ruby>み<ruby>川<rt>がわ</rt></ruby> いつ<ruby>見<rt>み</rt></ruby>きとてか <ruby>恋<rt>こい</rt></ruby>しかるら<ruby>む<rt>ん</rt></ruby>",
        meaning: "Like the Izumi River that wells up and flows through Mika Plain — when did I first see you, that I should long for you so?",
        story: "Fujiwara no Kanesuke built his mansion on the bank of the Kamo River and was called the \"Middle Counselor of the Embankment.\" Together with his cousin Fujiwara no Sadakata, he was at the center of the poetry world, and poets such as Ki no Tsurayuki gathered at his house. He was an ancestor of Murasaki Shikibu. This poem wonders why he longs so much for someone he has never even met.",
        love: "A time when you feel a strong attraction you cannot explain. Don't reason it out — follow the voice of your heart, and a fateful connection will begin to move.",
        work: "People who can create a place where others naturally gather are strong. From exchanges with friends and colleagues, you will see what you truly want to do.",
        poet: "Middle Counselor Kanesuke",
        poetJa: "中納言兼輔",
        luck: "吉"
    },
    {
        poem: "<ruby>山里<rt>やまざと</rt></ruby>は <ruby>冬<rt>ふゆ</rt></ruby>ぞさびしさ まさりける <ruby>人目<rt>ひとめ</rt></ruby>も<ruby>草<rt>くさ</rt></ruby>も かれぬと<ruby>思<rt>おも</rt></ruby><ruby>へ<rt>え</rt></ruby>ば",
        meaning: "In a mountain village, loneliness deepens in winter. Not only people disappear — the grass too withers away.",
        story: "Born a grandson of Emperor Kōkō, Minamoto no Muneyuki left the imperial family and took the Minamoto surname. A story tells how, unable to win promotion, he expressed his frustration in a poem to Emperor Uda, but his feelings never got through. This poem describes the loneliness of a mountain village in winter, when no one visits and the grasses and trees have withered.",
        love: "The real ones are the people who stay by your side when you are lonely, even without glamour. Value a quiet relationship where your hearts connect over a showy one.",
        work: "Even when you are not getting the recognition you hoped for, what you keep doing without growing bitter becomes your strength. Like Muneyuki, who returned to the capital after years in the provinces, steady steps will open the way.",
        poet: "Minamoto no Muneyuki Ason",
        poetJa: "源宗于朝臣",
        luck: "中吉"
    },
    {
        poem: "<ruby>心当<rt>こころあ</rt></ruby>てに <ruby>折<rt>お</rt></ruby>らばや<ruby>折<rt>お</rt></ruby>ら<ruby>む<rt>ん</rt></ruby> <ruby>初霜<rt>はつしも</rt></ruby>の おきまど<ruby>は<rt>わ</rt></ruby>せる <ruby>白菊<rt>しらぎく</rt></ruby>の<ruby>花<rt>はな</rt></ruby>",
        meaning: "Shall I pick it or not? The white chrysanthemum lies hidden beneath the first frost, and I cannot tell them apart.",
        story: "Though a low-ranking provincial official, Ōshikōchi no Mitsune was chosen with Ki no Tsurayuki and others to compile the Kokin Wakashū. A master of quick wit, he is said to have answered a question from Emperor Daigo with a brilliant impromptu poem. In this poem, he wonders whether he might pick a white chrysanthemum by guesswork, when the first frost has made it impossible to tell the flower from the frost.",
        love: "The other person's heart is as hard to make out as white chrysanthemums under the first frost. Don't jump to conclusions; look closely and gently confirm their feelings.",
        work: "In confusion, quick wit and intuition shine. This is a time when you can carve out your own path through ability, regardless of rank or background.",
        poet: "Ōshikōchi no Mitsune",
        poetJa: "凡河内躬恒",
        luck: "小吉"
    },
    {
        poem: "<ruby>有明<rt>ありあけ</rt></ruby>の つれなく<ruby>見<rt>み</rt></ruby>えし <ruby>別<rt>わか</rt></ruby>れより あかつきばかり <ruby>憂<rt>う</rt></ruby>きものはなし",
        meaning: "Ever since that cold dawn when we parted, I have come to dread the break of day more than anything in the world.",
        story: "Though a low-ranking military officer, Mibu no Tadamine was chosen as one of the compilers of the Kokin Wakashū. Fujiwara no Sadaie later praised his poems highly, and his son Tadami also became a famous poet. In this poem, he cannot forget the dawn moon of the morning he parted coldly from his love, and says nothing has been more painful to him since than the break of day.",
        love: "The memory of a painful parting may still linger in your heart. Look back and use what you learned from it in your love now.",
        work: "Your past experience holds the hint to solving today's problems. Whatever your position, the skills you have polished will surely be recognized.",
        poet: "Mibu no Tadamine",
        poetJa: "壬生忠岑",
        luck: "中吉"
    },
    {
        poem: "<ruby>朝<rt>あさ</rt></ruby>ぼらけ <ruby>有明<rt>ありあけ</rt></ruby>の<ruby>月<rt>つき</rt></ruby>と <ruby>見<rt>み</rt></ruby>るまでに <ruby>吉野<rt>よしの</rt></ruby>の<ruby>里<rt>さと</rt></ruby>に <ruby>降<rt>ふ</rt></ruby>れる<ruby>白雪<rt>しらゆき</rt></ruby>",
        meaning: "In the early morning light, the village of Yoshino is blanketed in white — it looks just like the pale glow of the dawn moon.",
        story: "Sakanoue no Korenori served in provincial posts in Yamato and elsewhere. He was also a master of kemari, the courtly kickball game, and a story tells how he kept the ball in the air for 206 kicks in front of Emperor Daigo and was rewarded for it. This poem describes the white snow piled on the village of Yoshino at dawn, so bright he mistook it for the light of the moon.",
        love: "A lucky sign that your heart will be clear and a new love will begin. As if old grudges were covered with white snow, you can step forward with a light heart.",
        work: "Keep doing what you are good at, and you will be highly regarded in unexpected places. The confusion lifts and a clear answer appears. Make bold decisions.",
        poet: "Sakanoue no Korenori",
        poetJa: "坂上是則",
        luck: "大吉"
    },
    {
        poem: "<ruby>山川<rt>やまがわ</rt></ruby>に <ruby>風<rt>かぜ</rt></ruby>のかけたる しがらみは <ruby>流<rt>なが</rt></ruby>れもあ<ruby>へ<rt>え</rt></ruby>ぬ <ruby>紅葉<rt>もみじ</rt></ruby>なりけり",
        meaning: "The weir of fallen maple leaves, caught by the mountain wind across the stream — the water cannot flow through.",
        story: "Harumichi no Tsuraki rose from student of letters to official, and is said to have died before taking up his appointment as governor of Iki. Few of his poems survive, yet this single poem earned him a place in the Hyakunin Isshu. In it, he realizes that the weir the wind has built across the mountain stream is made of maple leaves that cannot flow on.",
        love: "Your feelings may have piled up inside, keeping you from moving forward. But just as maple leaves held back by a weir make a beautiful scene, there is meaning in pausing now. Put those pent-up feelings into words, little by little.",
        work: "Even when things seem stuck, valuable things gather where the flow stops. Rather than forcing them along, sort out the piled-up tasks one by one, and a new current will begin.",
        poet: "Harumichi no Tsuraki",
        poetJa: "春道列樹",
        luck: "末吉"
    },
    {
        poem: "<ruby>久方<rt>ひさかた</rt></ruby>の <ruby>光<rt>ひかり</rt></ruby>のどけき <ruby>春<rt>はる</rt></ruby>の<ruby>日<rt>ひ</rt></ruby>に しづ<ruby>心<rt>こころ</rt></ruby>なく <ruby>花<rt>はな</rt></ruby>の<ruby>散<rt>ち</rt></ruby>るら<ruby>む<rt>ん</rt></ruby>",
        meaning: "In the peaceful light of a spring day, why do the cherry blossoms scatter so restlessly?",
        story: "A cousin of Ki no Tsurayuki, Ki no Tomonori was a late bloomer who is said to have held no office until he was past forty. He was chosen as a compiler of the Kokin Wakashū but died before it was finished. This poem asks why, on a calm and sunny spring day, the cherry blossoms scatter so restlessly.",
        love: "Because you know how fleeting love can be, the present moment becomes all the more precious. Cherish the time you have together.",
        work: "It's fine to bloom late. The strength you have built up will surely flower. Don't rush for results; put your heart into what you can do now.",
        poet: "Ki no Tomonori",
        poetJa: "紀友則",
        luck: "中吉"
    },
    {
        poem: "<ruby>誰<rt>たれ</rt></ruby>をかも <ruby>知<rt>し</rt></ruby>る<ruby>人<rt>ひと</rt></ruby>にせ<ruby>む<rt>ん</rt></ruby> <ruby>高砂<rt>たかさご</rt></ruby>の <ruby>松<rt>まつ</rt></ruby>も<ruby>昔<rt>むかし</rt></ruby>の <ruby>友<rt>とも</rt></ruby>ならなくに",
        meaning: "Who can I call a true friend now? Even the old pine of Takasago knew the friends of long ago no longer.",
        story: "While serving as a provincial official, Fujiwara no Okikaze was counted among the leading poets of the Kokin Wakashū era. He often took part in poetry contests and is said to have excelled at music as well. This poem speaks of the loneliness of old age: his old friends are gone, and even the ancient pine of Takasago is no friend from long ago.",
        love: "Rather than longing for the past, value the bonds with the people beside you now. Open your heart to new encounters, too, and warm relationships will grow.",
        work: "When you feel alone is exactly the time to make new allies. Passing on your experience and wisdom to the next generation will produce work of real value.",
        poet: "Fujiwara no Okikaze",
        poetJa: "藤原興風",
        luck: "吉"
    },
    {
        poem: "<ruby>人<rt>ひと</rt></ruby>はいさ <ruby>心<rt>こころ</rt></ruby>も<ruby>知<rt>し</rt></ruby>らず ふるさとは <ruby>花<rt>はな</rt></ruby>ぞ<ruby>昔<rt>むかし</rt></ruby>の <ruby>香<rt>か</rt></ruby>に<ruby>匂<rt>にお</rt></ruby><ruby>ひ<rt>い</rt></ruby>ける",
        meaning: "I cannot know what is in your heart. But here in the old village, the plum blossoms still carry the same fragrance as before.",
        story: "Ki no Tsurayuki led the compilation of the Kokin Wakashū and wrote its kana preface. After the age of sixty he became governor of Tosa, and recorded his journey back to the capital in the Tosa Diary. In this poem, visiting a village after a long absence, he says that people's hearts may change, but the plum blossoms bloom with the same fragrance as long ago.",
        love: "Don't chase the other person's feelings too hard; value your own unchanging sincerity. When the season comes round again, the flowers will bloom and give off their scent once more.",
        work: "If you swing between joy and worry over your boss's views or company policy, you will lose your footing. Like Tsurayuki, who took on a new role and wrote a masterpiece after sixty, keep your own center.",
        poet: "Ki no Tsurayuki",
        poetJa: "紀貫之",
        luck: "吉"
    },
    {
        poem: "<ruby>夏<rt>なつ</rt></ruby>の<ruby>夜<rt>よ</rt></ruby>は まだ<ruby>宵<rt>よい</rt></ruby>ながら あけぬるを <ruby>雲<rt>くも</rt></ruby>のいづこに <ruby>月<rt>つき</rt></ruby>やどるら<ruby>む<rt>ん</rt></ruby>",
        meaning: "On a summer night, the day has already dawned while it still feels like early evening. Where in the clouds is the moon hiding?",
        story: "Kiyohara no Fukayabu, known as a master of the koto, was an ancestor of Sei Shōnagon. In his later years he is said to have built the temple Fudaraku-ji north of the capital and lived there in seclusion. In this poem, on a short summer night, dawn breaks while he still thinks it is evening, and he wonders where in the clouds the moon has found lodging.",
        love: "The happiest times pass in a flash. Savor every moment of love and keep its glow as a treasure in your heart.",
        work: "Even in a short time, you can achieve great results if you focus. Master what you love, and it will become a treasure for life.",
        poet: "Kiyohara no Fukayabu",
        poetJa: "清原深養父",
        luck: "吉"
    },
    {
        poem: "<ruby>白露<rt>しらつゆ</rt></ruby>に <ruby>風<rt>かぜ</rt></ruby>の<ruby>吹<rt>ふ</rt></ruby>きしく <ruby>秋<rt>あき</rt></ruby>の<ruby>野<rt>の</rt></ruby>は つらぬきとめぬ <ruby>玉<rt>たま</rt></ruby>ぞ<ruby>散<rt>ち</rt></ruby>りける",
        meaning: "In the autumn fields lashed by the wind and dew, the scattered drops look like beads of jade that cannot be strung together.",
        story: "The son of Fun'ya no Yasuhide, Fun'ya no Asayasu left only a handful of poems, yet this one earned him a place in the Hyakunin Isshu. He was active in poetry contests just before the Kokin Wakashū was compiled. This poem likens white dew blown by the wind across autumn fields to jewels scattering from a string that holds them no longer.",
        love: "A time when love and hearts change easily. Rather than trying to hold on, accept the change, and new connections will come into view.",
        work: "Things are in flux. Even if you produce few results, leave one that truly shines, and it will become your signature work.",
        poet: "Fun'ya no Asayasu",
        poetJa: "文屋朝康",
        luck: "中吉"
    },
    {
        poem: "<ruby>忘<rt>わす</rt></ruby>らるる <ruby>身<rt>み</rt></ruby>をば<ruby>思<rt>おも</rt></ruby>はず <ruby>誓<rt>ちか</rt></ruby>ひてし <ruby>人<rt>ひと</rt></ruby>の<ruby>命<rt>いのち</rt></ruby>の <ruby>惜<rt>お</rt></ruby>しくもあるかな",
        meaning: "I do not grieve for myself, though I am forgotten. But I worry for you — you who swore an oath. What will become of you?",
        story: "Ukon was a lady-in-waiting to Empress Onshi, consort of Emperor Daigo. She is said to have had love affairs with many noblemen, including Prince Motoyoshi and Fujiwara no Atsutada. In this poem, to a lover who swore by the gods to love her forever and then changed his heart, she says: \"I don't mind being forgotten, but I fear for your life, now that you have broken your vow.\"",
        love: "Even if you feel betrayed, don't be consumed by resentment; have the grace to respect the other person's freedom. Keep your love sincere, and your next romance will surely bear fruit.",
        work: "Don't take on other people's promises and responsibilities. Taking responsibility for your own words and actions will raise the trust people place in you.",
        poet: "Ukon",
        poetJa: "右近",
        luck: "末吉"
    },
    {
        poem: "<ruby>浅茅生<rt>あさじう</rt></ruby>の <ruby>小野<rt>おの</rt></ruby>の<ruby>篠原<rt>しのはら</rt></ruby> しのぶれど<br>あまりてなどか <ruby>人<rt>ひと</rt></ruby>の<ruby>恋<rt>こい</rt></ruby>しき<br>",
        meaning: "Though I try to hide it, my longing spills over. Why is it that I cannot stop thinking of that person?",
        story: "From the Saga Genji line, Minamoto no Hitoshi served many years in the provinces before rising to Councillor. Few of his poems survive in the imperial anthologies, yet this one earned him a place in the Hyakunin Isshu. Based on a poem in the Kokin Wakashū, it speaks of a love he cannot hide, however hard he tries.",
        love: "Feelings you can no longer hold back are about to overflow. Telling them honestly will turn the situation around.",
        work: "Steady accumulation bears great fruit, even if late. Pour the passion welling up inside you into your goals, and you will achieve surprising results.",
        poet: "Councillor Hitoshi",
        poetJa: "参議等",
        luck: "中吉"
    },
    {
        poem: "<ruby>忍<rt>しの</rt></ruby>ぶれど <ruby>色<rt>いろ</rt></ruby>に<ruby>出<rt>い</rt></ruby>でにけり <ruby>我<rt>わ</rt></ruby>が<ruby>恋<rt>こい</rt></ruby>は <ruby>物<rt>もの</rt></ruby>や<ruby>思<rt>おも</rt></ruby>ふと <ruby>人<rt>ひと</rt></ruby>の<ruby>問<rt>と</rt></ruby><ruby>ふ<rt>う</rt></ruby>まで",
        meaning: "Though I tried to keep it secret, my love showed itself on my face — to the point where people asked if something was on my mind.",
        story: "Taira no Kanemori was one of the Thirty-Six Immortal Poets. At the Imperial Palace Poetry Contest of 960, he was matched against Mibu no Tadami's poem \"Koi su chō.\" The judge could not decide between them, but when Emperor Murakami was heard softly reciting this poem, \"Shinoburedo,\" Kanemori was declared the winner — a legendary match. The poem says that the love he had hidden has shown itself in his face.",
        love: "Feelings you have kept secret are showing on their own. Don't try to hide them; you will do better by being honest.",
        work: "When skills are evenly matched, what naturally stays in people's hearts wins. Being open and straightforward will win you the support of those around you.",
        poet: "Taira no Kanemori",
        poetJa: "平兼盛",
        luck: "中吉"
    },
    {
        poem: "<ruby>恋<rt>こい</rt></ruby>す<ruby>てふ<rt>ちょう</rt></ruby> <ruby>我<rt>わ</rt></ruby>が<ruby>名<rt>な</rt></ruby>はまだき <ruby>立<rt>た</rt></ruby>ちにけり <ruby>人<rt>ひと</rt></ruby>しれずこそ <ruby>思<rt>おも</rt></ruby><ruby>ひ<rt>い</rt></ruby>そめしか",
        meaning: "They say my name as a lover is already known far and wide, even before the affair began. I had kept it so quietly in my heart.",
        story: "The son of Mibu no Tadamine, Mibu no Tadami was summoned to the palace as a child for his gift for poetry — but, the story goes, his family was so poor he had no carriage to ride. At the Imperial Palace Poetry Contest of 960 he competed against Taira no Kanemori with this poem and narrowly lost. It was such a famous match that a tale even arose that he grieved so much over the defeat he could no longer eat. This poem says that rumors of his love have already spread, though he had only just begun to love in secret.",
        love: "A love you have kept hidden may unexpectedly become known. Don't be shaken by rumors; stay true to your feelings, and your real heart will come across.",
        work: "Even when you give everything, the result can be decided by a hair. Don't be too discouraged by a loss; use the experience in your next challenge. The sight of someone giving their all always stays in someone's heart.",
        poet: "Mibu no Tadami",
        poetJa: "壬生忠見",
        luck: "小吉"
    },
    {
        poem: "<ruby>契<rt>ちぎ</rt></ruby>りきな かたみに<ruby>袖<rt>そで</rt></ruby>を しぼりつつ <ruby>末<rt>すえ</rt></ruby>の<ruby>松山<rt>まつやま</rt></ruby> <ruby>波<rt>なみ</rt></ruby>こさじとは",
        meaning: "We promised each other, wringing out our tear-soaked sleeves, that our love would last forever, never to be swept away like the waves beyond Suenomatsu.",
        story: "The father of Sei Shōnagon, Kiyohara no Motosuke was one of the \"Five Men of the Pear Chamber\" in Emperor Murakami's time, who compiled the Gosen Wakashū and worked to read and annotate the Man'yōshū. At seventy-nine he became governor of Higo, went to his post, and ended his life there. There is also a comic story that when he fell from his horse at the Kamo Festival, his cap came off, and he stood there with his bald head showing, making long excuses to the crowd until they burst out laughing. This poem laments a lover's change of heart: \"Didn't we swear our hearts would never change, as surely as the waves would never cross Mount Sue-no-Matsu?\"",
        love: "Even a solemn vow can be undone when hearts change. Rather than blaming the other person, hold on to your own sincerity. Build trust not just with words, but with what you do each day.",
        work: "Relying on verbal promises alone can lead to unexpected misunderstandings. Confirm important agreements and put them in writing. The spirit of Motosuke, who took on a new role at any age, will help your relationships of trust last.",
        poet: "Kiyohara no Motosuke",
        poetJa: "清原元輔",
        luck: "小吉"
    },
    {
        poem: "<ruby>逢<rt>あ</rt></ruby><ruby>ひ<rt>い</rt></ruby><ruby>見<rt>み</rt></ruby>ての のちの<ruby>心<rt>こころ</rt></ruby>に くらぶれば <ruby>昔<rt>むかし</rt></ruby>は<ruby>物<rt>もの</rt></ruby>を <ruby>思<rt>おも</rt></ruby>はざりけり",
        meaning: "Compared to this feeling after meeting you, the longing I felt before seems like nothing at all.",
        story: "A son of Minister of the Left Fujiwara no Tokihira, Fujiwara no Atsutada was blessed with good looks and excelled at poetry and music. He rose to Acting Middle Counselor but died young, at thirty-eight. This poem says that, compared with the depth of his feelings after he and his love became one, the longing he felt before they met was nothing at all.",
        love: "When feelings are returned, love grows deeper and more intense. Accept that passion straightforwardly, and you will find happiness.",
        work: "Taking one step further makes earlier worries look small. Put your strong feelings into your work and raise your focus and creativity.",
        poet: "Middle Counselor Atsutada",
        poetJa: "中納言敦忠",
        luck: "中吉"
    },
    {
        poem: "<ruby>逢<rt>お</rt></ruby><ruby>ふ<rt>う</rt></ruby>ことの <ruby>絶<rt>た</rt></ruby>えてしなくは なかなかに <ruby>人<rt>ひと</rt></ruby>をも<ruby>身<rt>み</rt></ruby>をも <ruby>恨<rt>うら</rt></ruby>みざらまし",
        meaning: "If there were no meetings at all, I would not have to suffer. It is because we meet that parting brings such pain.",
        story: "A son of Minister of the Right Fujiwara no Sadakata, Fujiwara no Asatada was also known as a master of the flute and the shō. At the Imperial Palace Poetry Contest of 960 he won five of his six rounds, and he later rose to Middle Counselor. This poem says that if there were no such thing as love at all, he would not have to resent his beloved's coldness or his own fate.",
        love: "The bigger your expectations, the more it hurts when they are not met. Don't ask too much of the other person; make time to fill your own heart, too.",
        work: "Focusing on your field of strength will bring solid results. Set up an environment where you can concentrate on your own, and your work will go smoothly.",
        poet: "Middle Counselor Asatada",
        poetJa: "中納言朝忠",
        luck: "末吉"
    },
    {
        poem: "あ<ruby>は<rt>わ</rt></ruby>れとも い<ruby>ふ<rt>う</rt></ruby>べき人は <ruby>思<rt>おも</rt></ruby><ruby>ほ<rt>お</rt></ruby>えで <ruby>身<rt>み</rt></ruby>のいた<ruby>づ<rt>ず</rt></ruby>らに なりぬべきかな",
        meaning: "There is no one who might show even a little compassion. I feel as though my life will simply fade away, just like that.",
        story: "The eldest son of Minister of the Right Fujiwara no Morosuke, Fujiwara no Koretada rose all the way to Regent and Chancellor of the Realm. As head of the Poetry Bureau he led the \"Five Men of the Pear Chamber,\" but he loved a lavish life and died at forty-nine. In this love poem, he appeals to a cold lover: \"I can think of no one who would pity me, and so I will die in vain.\"",
        love: "When loneliness threatens to overwhelm you, look to the support around you. Showing your vulnerable side can sometimes move the other person's heart.",
        work: "Rank and glamour can't fulfill you without emotional support. Don't be carried away by your feelings; trust the help of those around you and open your heart to overcome difficulties.",
        poet: "Kentoku-kō",
        poetJa: "謙徳公",
        luck: "末吉"
    },
    {
        poem: "<ruby>由良<rt>ゆら</rt></ruby>のとを <ruby>渡<rt>わた</rt></ruby>る<ruby>舟人<rt>ふなびと</rt></ruby> か<ruby>ぢ<rt>じ</rt></ruby>を<ruby>絶<rt>た</rt></ruby>え ゆくへも<ruby>知<rt>し</rt></ruby>らぬ <ruby>恋<rt>こい</rt></ruby>の<ruby>道<rt>みち</rt></ruby>かな",
        meaning: "Like a boatman who has lost his oar on the swift straits of Yura — I drift, not knowing where my love is taking me.",
        story: "Sone no Yoshitada served for years as a provincial official in Tango and was nicknamed \"Sotan.\" Stubborn and proud, he was isolated in the poetry world, and a story tells how he pushed his way into a banquet of Retired Emperor En'yū without an invitation and was thrown out. Even so, his innovative style — such as the Maitsuki-shū, which covered a whole year in 360 poems — was highly praised by later poets. This poem compares a love whose course he cannot see to a boat that has lost its oar and drifts.",
        love: "A time when you can't see where love is heading and tend to drift. Don't rush into action; take a careful look at the situation.",
        work: "Even without a clear outlook, if you stick to your own way, you will be recognized someday. When others don't understand you, that is exactly the time to refine your own ideas.",
        poet: "Sone no Yoshitada",
        poetJa: "曾禰好忠",
        luck: "末吉"
    },
    {
        poem: "<ruby>八重葎<rt>やえむぐら</rt></ruby> しげれる<ruby>宿<rt>やど</rt></ruby>の さびしきに <ruby>人<rt>ひと</rt></ruby>こそ<ruby>見<rt>み</rt></ruby>えね <ruby>秋<rt>あき</rt></ruby>は<ruby>来<rt>き</rt></ruby>にけり",
        meaning: "Weeds grow thick around the deserted house. No one comes to visit. And yet — autumn has arrived.",
        story: "Priest Egyō served at the provincial temple of Harima. He mixed with poets of his day, such as Ōnakatomi no Yoshinobu and Kiyohara no Motosuke, and accompanied Emperor Kazan on his pilgrimage to Kumano. This poem says that no one comes to visit a ruined house overgrown with creeping weeds — yet autumn alone has come.",
        love: "Time alone is also a time for the heart to grow. Nurture your inner self without rushing, and love will bear fruit, as surely as the seasons come round.",
        work: "Even if it feels like people are drifting away, your connections have not vanished. Quietly building up your strength will lead to results.",
        poet: "Priest Egyō",
        poetJa: "恵慶法師",
        luck: "小吉"
    },
    {
        poem: "<ruby>風<rt>かぜ</rt></ruby>をいたみ <ruby>岩<rt>いわ</rt></ruby>うつ<ruby>波<rt>なみ</rt></ruby>の おのれのみ くだけて<ruby>物<rt>もの</rt></ruby>を <ruby>思<rt>おも</rt></ruby><ruby>ふ<rt>う</rt></ruby>ころかな",
        meaning: "Like the waves crashing against the rocks in the fierce wind, I alone am broken to pieces by this sorrow.",
        story: "From the Seiwa Genji line, Minamoto no Shigeyuki moved from post to post as a provincial governor in Sagami, Shinano, Hyūga, Higo, and elsewhere. The \"Shigeyuki Hundred Poems\" he presented to the crown prince is considered the oldest surviving hundred-poem sequence. In his last years he went to Michinoku, relying on his friend Fujiwara no Sanekata, and died there. This poem says that, like waves that break on a rock in a fierce wind, he alone is shattered by love these days.",
        love: "A time when the pain of one-sided love threatens to break your heart. That pain is proof of how seriously you love. Turn it into strength and draw a future love toward you.",
        work: "Even when you are not rewarded as you hoped, efforts to try new forms leave a lasting mark. Take hardship as a test, and build success with firm conviction.",
        poet: "Minamoto no Shigeyuki",
        poetJa: "源重之",
        luck: "小吉"
    },
    {
        poem: "<ruby>御垣守<rt>みかきもり</rt></ruby> <ruby>衛士<rt>えじ</rt></ruby>のたく<ruby>火<rt>ひ</rt></ruby>の <ruby>夜<rt>よる</rt></ruby>はもえ <ruby>昼<rt>ひる</rt></ruby>は<ruby>消<rt>き</rt></ruby>えつつ <ruby>物<rt>もの</rt></ruby>をこそ<ruby>思<rt>おも</rt></ruby><ruby>へ<rt>え</rt></ruby>",
        meaning: "Like the fire tended by the palace guards, I burn at night and fade in the day — lost in endless longing.",
        story: "Ōnakatomi no Yoshinobu was born into a family of priests who served as chief priests of the Ise Shrine. Chosen as one of the \"Five Men of the Pear Chamber,\" he worked hard to compile the Gosen Wakashū and to read and annotate the Man'yōshū. This poem describes a love that blazes up by night and sinks away by day, like the watch fires kept by the palace gate guards.",
        love: "Burning by night and sinking by day — your feelings rise and fall sharply now. Those waves are proof that you are serious. Don't decide on a passing impulse; share your feelings when you are calm.",
        work: "Your motivation tends to come in big waves. Push ahead when you are in the mood, and rest and regroup when you are not. Once you find your rhythm, your results will steady.",
        poet: "Ōnakatomi no Yoshinobu Ason",
        poetJa: "大中臣能宣朝臣",
        luck: "吉"
    },
    {
        poem: "<ruby>君<rt>きみ</rt></ruby>がため <ruby>惜<rt>お</rt></ruby>しからざりし いのちさ<ruby>へ<rt>え</rt></ruby> <ruby>長<rt>なが</rt></ruby>くもがなと <ruby>思<rt>おも</rt></ruby><ruby>ひ<rt>い</rt></ruby>けるかな",
        meaning: "A life I once did not mind losing — now, for your sake, I wish it would last forever.",
        story: "A son of Regent Fujiwara no Koretada, Fujiwara no Yoshitaka had beauty that was highly praised in the Great Mirror. He was also deeply devoted to Buddhism, but at twenty-one he caught smallpox and died on the same day as his elder brother. This poem says that he once thought he would give his life just to meet her, but now that they have met, he wishes to live a long life.",
        love: "Meeting someone precious makes you want to live a long life together. Treasure the bond you have now and build up your time together.",
        work: "A time to think about how to keep going, not just burn brightly for a moment. Pour your heart into the work in front of you while setting long-term goals.",
        poet: "Fujiwara no Yoshitaka",
        poetJa: "藤原義孝",
        luck: "吉"
    },
    {
        poem: "かくとだに えやはいぶきの さしも<ruby>草<rt>ぐさ</rt></ruby> さしも<ruby>知<rt>し</rt></ruby>らじな もゆる<ruby>思<rt>おも</rt></ruby><ruby>ひ<rt>い</rt></ruby>を",
        meaning: "I cannot even tell you how I feel — like the smoldering fire of ibuki wormwood, my hidden love quietly burns.",
        story: "Fujiwara no Sanekata was a glamorous man of taste, said to have had a relationship with Sei Shōnagon. A story tells how, after a quarrel in which he threw down Fujiwara no Yukinari's cap, Emperor Ichijō sent him off as governor of Michinoku, telling him to \"go and see the famous poetic places.\" After he died in a fall from his horse there, a legend even arose that he was reborn as a sparrow. This poem says: \"You do not know how my love burns, like the moxa grass of Mount Ibuki.\"",
        love: "Even burning feelings won't reach the other person unless you share them. Don't rush; show your warm passion thoughtfully and you can move their heart.",
        work: "Enthusiasm matters, but getting emotional can lead to unexpected mistakes. Communicate your feelings strategically to win understanding and cooperation.",
        poet: "Fujiwara no Sanekata Ason",
        poetJa: "藤原実方朝臣",
        luck: "吉"
    },
    {
        poem: "明けぬれば <ruby>暮<rt>く</rt></ruby>るるものとは <ruby>知<rt>し</rt></ruby>りながら な<ruby>ほ<rt>お</rt></ruby>うらめしき <ruby>朝<rt>あさ</rt></ruby>ぼらけかな",
        meaning: "I know that after dawn comes dusk — and yet how I resent this pale morning sky.",
        story: "A son of Chancellor of the Realm Fujiwara no Tamemitsu, Fujiwara no Michinobu was later adopted by Fujiwara no Kaneie. A modest young nobleman praised as a master of poetry, he died young at twenty-three. This poem says that even though he knows night will fall again after the dawn and they will meet again, the morning of parting is still hateful.",
        love: "Even if there is a temporary separation or distance, a relationship in which you trust you will meet again is the real thing. Turn today's loneliness into the joy of looking forward to your next meeting.",
        work: "Your goal is within reach, but a little more patience is needed. Trust in a sure future and build up your strength without rushing.",
        poet: "Fujiwara no Michinobu Ason",
        poetJa: "藤原道信朝臣",
        luck: "吉"
    },
    {
        poem: "<ruby>嘆<rt>なげ</rt></ruby>きつつ ひとり<ruby>寝<rt>ぬ</rt></ruby>る<ruby>夜<rt>よ</rt></ruby>の <ruby>明<rt>あ</rt></ruby>くる<ruby>間<rt>ま</rt></ruby>は いかに<ruby>久<rt>ひさ</rt></ruby>しき ものとかは<ruby>知<rt>し</rt></ruby>る",
        meaning: "Lying alone, waiting for the long night to end — how endless it feels. Does the person who left me even know?",
        story: "The Mother of Michitsuna is known as the author of the Kagerō Diary. Her husband, Fujiwara no Kaneie, had other wives, and in her diary she wrote of the pain of waiting for a husband who went to visit other women. Her son Michitsuna later became Captain of the Right Palace Guards, and she is known by this name as his mother. In this poem she asks her husband: \"Do you know how long a night can be for one who sleeps alone and sighs until dawn?\"",
        love: "If you are carrying the pain of waiting, don't hold it in too long; put your feelings into words. The end of this hard time is just around the corner.",
        work: "Like Michitsuna's mother, who left her painful feelings in the form of a diary, this is a time to turn experience into strength. A long hardship is ending, and you can make a positive fresh start.",
        poet: "Mother of the Right Captain Michitsuna",
        poetJa: "右大将道綱母",
        luck: "吉"
    },
    {
        poem: "<ruby>忘<rt>わす</rt></ruby>れじの ゆく<ruby>末<rt>すえ</rt></ruby>までは かたければ <ruby>今日<rt>きょう</rt></ruby>を<ruby>限<rt>かぎ</rt></ruby>りの <ruby>命<rt>いのち</rt></ruby>ともがな",
        meaning: "The promise that you would never forget me — that is too much to ask forever. I only wish my life would end today, while the vow still holds.",
        story: "Takashina no Takako excelled at Chinese learning, served at court, and became the wife of Fujiwara no Michitaka. Her daughter Teishi became Empress to Emperor Ichijō, but after her husband died, her family fell suddenly from power — her son Korechika was exiled — and she herself died that same year. This poem was written when her romance with Michitaka began: she wishes her life would end today, the day she heard the words \"I will never forget you.\"",
        love: "When you are at the height of happiness, the future can make you anxious. Don't worry too much about what's ahead; savor the happiness of now.",
        work: "Enjoy the joy of success honestly and turn it into energy for your next goal. When things are going well, don't forget to secure your footing.",
        poet: "Mother of the Honorary Grand Minister",
        poetJa: "儀同三司母",
        luck: "吉"
    },
    {
        poem: "<ruby>滝<rt>たき</rt></ruby>の<ruby>音<rt>おと</rt></ruby>は たえて<ruby>久<rt>ひさ</rt></ruby>しく なりぬれど <ruby>名<rt>な</rt></ruby>こそ<ruby>流<rt>なが</rt></ruby>れて な<ruby>ほ<rt>お</rt></ruby><ruby>聞<rt>き</rt></ruby>こえけれ",
        meaning: "The sound of the waterfall has long since faded, but its name flows on and is still heard by the world.",
        story: "Fujiwara no Kintō excelled at waka, Chinese poetry, and music alike. He is known for the \"Three Boats\" story: at Fujiwara no Michinaga's boating party he rode in the waka boat and was praised, yet lamented, \"If only I had ridden in the Chinese-poetry boat, I would have won even greater fame.\" He compiled the Wakan Rōeishū and also chose the poets who became the basis of the Thirty-Six Immortal Poets. This poem says that although the waterfall has long since fallen silent, its fame flows on to this day.",
        love: "Trust built up over a long time is the foundation of your relationship. Value quietly accumulated feelings over flashiness.",
        work: "Even with talent, your worth is not decided by how fast you are promoted. The work you build up will be remembered as a lasting reputation. Keep improving yourself without rushing.",
        poet: "Upper Counselor Kintō",
        poetJa: "大納言公任",
        luck: "吉"
    },
    {
        poem: "あらざら<ruby>む<rt>ん</rt></ruby> この<ruby>世<rt>よ</rt></ruby>のほかの <ruby>思<rt>おも</rt></ruby><ruby>ひ<rt>い</rt></ruby><ruby>出<rt>で</rt></ruby>に いまひとたびの <ruby>逢<rt>お</rt></ruby><ruby>ふ<rt>う</rt></ruby>こともがな",
        meaning: "I may not be long for this world. As a memory to take beyond — let me meet you just one more time.",
        story: "Izumi Shikibu is known for her passionate love poems. She loved Prince Tametaka and then his younger brother, Prince Atsumichi, a romance portrayed in the Izumi Shikibu Diary. She later served Empress Shōshi, and also knew the grief of losing her daughter, Koshikibu no Naishi. In this poem, near the end of her life, she wishes to see her beloved just once more, as a memory to take into the next world.",
        love: "If there is someone you long to see once more, don't put it off. The feelings you would regret leaving unsaid are exactly the ones to share honestly now.",
        work: "Now is the time to tackle what you have been saving for 'someday.' Keep in mind that time is limited, and start with what truly matters.",
        poet: "Izumi Shikibu",
        poetJa: "和泉式部",
        luck: "吉"
    },
    {
        poem: "めぐり<ruby>逢<rt>あ</rt></ruby><ruby>ひ<rt>い</rt></ruby>て <ruby>見<rt>み</rt></ruby>しやそれとも わかぬ<ruby>間<rt>ま</rt></ruby>に <ruby>雲隠<rt>くもがく</rt></ruby>れにし <ruby>夜半<rt>よわ</rt></ruby>の<ruby>月<rt>つき</rt></ruby>かな",
        meaning: "We met for just a moment, yet I could not be sure it was really you — and then you vanished behind the clouds, like the midnight moon.",
        story: "Murasaki Shikibu is known as the author of The Tale of Genji. She lost her husband, Fujiwara no Nobutaka, only a few years after their marriage, then served Empress Shōshi, consort of Emperor Ichijō, and recorded court life in the Murasaki Shikibu Diary. This poem says that, meeting someone again after a long time, she could hardly tell whether it was really them before they left — like the midnight moon slipping behind the clouds.",
        love: "Chances slip by in an instant. Treasure every reunion and every small encounter with all your heart.",
        work: "Keeping chance discoveries and encounters in mind will lead to a great work in the future. Write down your flashes of inspiration right away.",
        poet: "Murasaki Shikibu",
        poetJa: "紫式部",
        luck: "吉"
    },
    {
        poem: "ありま<ruby>山<rt>やま</rt></ruby> <ruby>猪名<rt>いな</rt></ruby>の<ruby>笹原<rt>ささはら</rt></ruby> <ruby>風<rt>かぜ</rt></ruby><ruby>吹<rt>ふ</rt></ruby>けば いでそよ<ruby>人<rt>ひと</rt></ruby>を <ruby>忘<rt>わす</rt></ruby>れやはする",
        meaning: "When the wind blows through the bamboo groves of Arima and Ina — of course I have not forgotten you.",
        story: "Fujiwara no Kenshi was the daughter of Murasaki Shikibu. Like her mother she served Empress Shōshi, and later became nurse to Emperor Go-Reizei, rising to Junior Third Rank. She stayed active for a long time, taking part in poetry contests until she was nearly eighty — a talented woman equal to her mother. In this poem, a reply to a lover who had stopped visiting, she says: \"Why, that's just it — how could I ever forget you?\"",
        love: "Don't be swayed by what the other person says or does; state your own feelings clearly. Inner strength will make your love secure.",
        work: "Even if you are compared with a great senior or family member, you have your own path. Calm focus on what you need to do, undisturbed by noise, will bring trust and success.",
        poet: "Daini no Sanmi",
        poetJa: "大弐三位",
        luck: "吉"
    },
    {
        poem: "やすら<ruby>は<rt>わ</rt></ruby>で <ruby>寝<rt>ね</rt></ruby>なましものを <ruby>小夜<rt>さよ</rt></ruby><ruby>更<rt>ふ</rt></ruby>けて かたぶくまでの <ruby>月<rt>つき</rt></ruby>を<ruby>見<rt>み</rt></ruby>しかな",
        meaning: "I waited and waited without sleep, watching the moon sink slowly toward the horizon in the deepening night. How I regret it.",
        story: "Akazome Emon was known for her loving marriage to the scholar Ōe no Masahira. She served Michinaga's wife Rinshi and their daughter Shōshi, and was close to Murasaki Shikibu and Izumi Shikibu. This poem was written on behalf of her sisters, who waited for Fujiwara no Michitaka but he never came: \"Had I known you would not come, I would have gone to sleep — instead I waited until the moon was sinking.\"",
        love: "Surely there is someone who understands the frustration of waiting. Don't keep it all to yourself; try talking about your feelings with someone you trust.",
        work: "Being able to put other people's feelings into words is a great strength of yours. A role supporting those around you will raise the trust people place in you.",
        poet: "Akazome Emon",
        poetJa: "赤染衛門",
        luck: "中吉"
    },
    {
        poem: "<ruby>大江山<rt>おおえやま</rt></ruby> いく<ruby>野<rt>の</rt></ruby>の<ruby>道<rt>みち</rt></ruby>の <ruby>遠<rt>とお</rt></ruby>ければ まだふみもみず <ruby>天<rt>あま</rt></ruby>の<ruby>橋立<rt>はしだて</rt></ruby>",
        meaning: "The road to Oe Mountain and Ikuno is so long and far — I have not yet set foot on it, nor received a letter from my mother.",
        story: "Koshikibu no Naishi, the daughter of Izumi Shikibu, served Empress Shōshi alongside her mother. Before a poetry contest, Fujiwara no Sadayori teased her, suggesting her mother would compose her poem for her — and she instantly answered with this \"Ōeyama\" poem and put him in his place. Using clever wordplay, the poem says that the road to Tango, where her mother lives, is far, and she has neither set foot on Amanohashidate nor seen a letter from her mother.",
        love: "Whatever the situation, keeping your composure and sense of humor is the key to making love blossom.",
        work: "Even if people say you are riding on your parents' coattails, showing your true ability will turn opinions around. Your talent is greater than you think. Express it with confidence.",
        poet: "Koshikibu no Naishi",
        poetJa: "小式部内侍",
        luck: "中吉"
    },
    {
        poem: "いにし<ruby>へ<rt>え</rt></ruby>の <ruby>奈良<rt>なら</rt></ruby>の<ruby>都<rt>みやこ</rt></ruby>の <ruby>八重桜<rt>やえざくら</rt></ruby> <ruby>けふ<rt>きょう</rt></ruby><ruby>九重<rt>ここのえ</rt></ruby>に <ruby>匂<rt>にお</rt></ruby><ruby>ひ<rt>い</rt></ruby>ぬるかな",
        meaning: "The ancient eightfold cherry blossoms of Nara — today they bloom gloriously in the ninefold imperial palace.",
        story: "Born into the Ōnakatomi family of distinguished Shinto priests, Ise no Taifu served Empress Shōshi. When double-flowered cherry blossoms were presented from Nara, her senior Murasaki Shikibu handed the honor of receiving them to her, the newcomer, and at Fujiwara no Michinaga's urging she composed this poem on the spot. \"The double cherries of the old capital Nara bloom today in the Ninefold Palace\" — the brilliant poem amazed Shōshi and everyone present.",
        love: "Like cherries in full bloom, your charm lights up everyone around you. Expect encounters and progress in glamorous settings, and love will bear fruit in the best possible way.",
        work: "An important role may unexpectedly come your way. If a chance is handed to you, answer it with everything you have, without hesitation. You will exceed expectations and suddenly find yourself in the spotlight.",
        poet: "Ise no Taifu",
        poetJa: "伊勢大輔",
        luck: "大吉"
    },
    {
        poem: "<ruby>夜<rt>よ</rt></ruby>をこめて <ruby>鳥<rt>とり</rt></ruby>のそらねは はかるとも よに<ruby>逢坂<rt>おうさか</rt></ruby>の <ruby>関<rt>せき</rt></ruby>は<ruby>許<rt>ゆる</rt></ruby>さじ",
        meaning: "Even if you try to fool me with a crowing rooster in the night — I will not open the Barrier of Ōsaka for you.",
        story: "The daughter of Kiyohara no Motosuke, Sei Shōnagon served Empress Teishi and wrote The Pillow Book. With her quick, witty conversation, she was a favorite at court. In this poem, written in an exchange with Fujiwara no Yukinari, she draws on an old Chinese story to answer him back: \"You may trick a barrier-keeper by imitating a rooster before dawn, but my Ōsaka Barrier will never open.\"",
        love: "A time to state your intentions clearly, without being carried away by sweet words or games. Say it with wit and humor, and your relationship may grow even deeper.",
        work: "Knowledge and quick thinking are your greatest weapons. Put your learning to use in conversation, and people will respect you and trust you more.",
        poet: "Sei Shōnagon",
        poetJa: "清少納言",
        luck: "吉"
    },
    {
        poem: "いまはただ <ruby>思<rt>おも</rt></ruby>ひ<ruby>絶<rt>た</rt></ruby>えな<ruby>む<rt>ん</rt></ruby> とばかりを <ruby>人<rt>ひと</rt></ruby>づてならで <ruby>言<rt>い</rt></ruby><ruby>ふ<rt>う</rt></ruby>よしもがな",
        meaning: "If only I could say it directly: all I want is to end this love. But there is no way to tell you in person.",
        story: "Born into the distinguished Naka-no-Kanpaku family, Fujiwara no Michimasa saw his family fall from power after the death of his grandfather Michitaka and the downfall of his father Korechika. He fell in love with Princess Masako, a former Ise Priestess and daughter of Retired Emperor Sanjō, but the retired emperor's anger tore them apart. He wrote this poem after they were forbidden to meet, wishing he could at least tell her goodbye in person. Afterward his violent behavior earned him the nickname \"the Rough Third Rank.\"",
        love: "Opposition or circumstances may keep you from meeting or speaking as you wish. Don't go through others; face things sincerely in your own words — that is the way to leave no regrets.",
        work: "If you give up because things aren't going well, you will only damage your reputation further. Draw a line under your feelings and focus on putting your conduct back in order.",
        poet: "Master of the Left Capital Michimasa",
        poetJa: "左京大夫道雅",
        luck: "凶"
    },
    {
        poem: "<ruby>朝<rt>あさ</rt></ruby>ぼらけ <ruby>宇治<rt>うじ</rt></ruby>の<ruby>川霧<rt>かわぎり</rt></ruby> <ruby>絶<rt>た</rt></ruby>え<ruby>絶<rt>だ</rt></ruby>えに あら<ruby>は<rt>わ</rt></ruby>れわたる <ruby>瀬々<rt>せぜ</rt></ruby>の<ruby>網代木<rt>あじろぎ</rt></ruby>",
        meaning: "In the early dawn mist over the Uji River, here and there the wooden stakes of fish weirs begin to appear through the haze.",
        story: "The son of Fujiwara no Kintō, Fujiwara no Sadayori was a handsome man who excelled at music and calligraphy. He is the very man who teased Koshikibu no Naishi and was neatly put in his place by her \"Ōeyama\" poem. This poem describes dawn on the Uji River, where the morning mist clears in patches, revealing the stakes of the fishing weirs one after another.",
        love: "Your relationship is still in the mist. Don't rush; trust the sure signs you glimpse from time to time and wait. Choose your words carefully so that a light joke doesn't hurt anyone.",
        work: "Even if you can't see the whole picture yet, the path is gradually coming into view. With the openness to learn from mistakes, you can move forward one sure step at a time.",
        poet: "Middle Counselor Sadayori",
        poetJa: "中納言定頼",
        luck: "吉"
    },
    {
        poem: "<ruby>恨<rt>うら</rt></ruby>みわび ほさぬ<ruby>袖<rt>そで</rt></ruby>だに あるものを <ruby>恋<rt>こい</rt></ruby>にくちな<ruby>む<rt>ん</rt></ruby> <ruby>名<rt>な</rt></ruby>こそをしけれ",
        meaning: "My sleeves are never dry — and I grieve not for myself, but that my name as a lover will be ruined before it is known.",
        story: "The poet Sagami took her name from her husband, Ōe no Kimiyori, governor of Sagami. Troubled by his change of heart, she eventually separated from him. She went on to serve imperial princesses and became one of the leading women poets of her age, active in many poetry contests. This poem says that she has no strength left even to resent her cold lover, her sleeves never dry from tears — and on top of that, it is a shame to see her reputation ruined by rumors of love.",
        love: "Your present pain will be rewarded in time. Those who have known painful love develop an eye for true love.",
        work: "Rather than feeling down about your reputation, concentrate on sharpening your skills. Unseen effort and steadiness will eventually lead to honorable success.",
        poet: "Sagami",
        poetJa: "相模",
        luck: "末吉"
    },
    {
        poem: "もろともに あ<ruby>は<rt>わ</rt></ruby>れと<ruby>思<rt>おも</rt></ruby><ruby>へ<rt>え</rt></ruby> <ruby>山桜<rt>やまざくら</rt></ruby> <ruby>花<rt>はな</rt></ruby>よりほかに <ruby>知<rt>し</rt></ruby>る<ruby>人<rt>ひと</rt></ruby>もなし",
        meaning: "O mountain cherry — feel moved together with me. There is no one else here who knows me but you.",
        story: "Gyōson was a mountain ascetic who trained in the steep mountains of Ōmine, Katsuragi, and Kumano. Famous for the power of his prayers, he became a personal chaplain to Emperor Toba and later rose to Senior High Priest. In this poem, he calls to a mountain cherry tree he met deep in the mountains: \"Feel fondly toward me, as I do toward you — for I have no one else to share my heart with.\"",
        love: "Even if you walk a lonely path, there is surely someone whose heart can connect with yours. They may be few, but cherish the bond with that one person.",
        work: "Like Gyōson after his harsh training, this is a time to work on your own, quietly and steadily. Don't be distracted by others; focus on what is truly valuable to you.",
        poet: "Senior High Priest Gyōson",
        poetJa: "大僧正行尊",
        luck: "吉"
    },
    {
        poem: "<ruby>春<rt>はる</rt></ruby>の<ruby>夜<rt>よ</rt></ruby>の <ruby>夢<rt>ゆめ</rt></ruby>ばかりなる <ruby>手枕<rt>たまくら</rt></ruby>に か<ruby>ひ<rt>い</rt></ruby>なく<ruby>立<rt>た</rt></ruby>た<ruby>む<rt>ん</rt></ruby> <ruby>名<rt>な</rt></ruby>こそをしけれ",
        meaning: "In the spring night, resting my head on an arm for just a brief dream — how I grieve that my name might spread for such a fleeting thing.",
        story: "Suō no Naishi served four emperors, from Go-Reizei to Horikawa. One spring night, staying up late at the palace, she murmured, \"I wish I had a pillow,\" and Fujiwara no Tadaie slipped his arm under the blind for her. In this poem she deftly turned him down: \"What a shame to have pointless rumors spread over an arm-pillow as fleeting as a spring night's dream.\"",
        love: "Have the composure not to jump at sweet invitations. Deflect them gracefully with humor, and your charm and dignity will shine all the more.",
        work: "Don't be swayed by others' opinions or rumors; calmly stand by your own results. The people trusted for a long time are those who combine quick wit with restraint.",
        poet: "Suō no Naishi",
        poetJa: "周防内侍",
        luck: "吉"
    },
    {
        poem: "<ruby>心<rt>こころ</rt></ruby>にも あらで<ruby>憂<rt>う</rt></ruby>き<ruby>世<rt>よ</rt></ruby>に ながら<ruby>へ<rt>え</rt></ruby>ば <ruby>恋<rt>こい</rt></ruby>しかるべき <ruby>夜半<rt>よわ</rt></ruby>の<ruby>月<rt>つき</rt></ruby>かな",
        meaning: "If I live on in this painful world without purpose, I am sure I will come to miss this night and its lonely moon.",
        story: "Emperor Sanjō finally came to the throne at thirty-six. But he clashed with Fujiwara no Michinaga, suffered from an eye disease, and was forced to abdicate after only about five years. This poem is known as his reflection around the time of his abdication: if he goes on living in this painful world against his will, he will surely look back fondly on tonight's moon.",
        love: "Someday, even painful experiences will become fond memories. Living today with care will nourish a deeper love in the future.",
        work: "Even in an unwanted situation, what you see and learn today will stay with you and become strength for the future. Accept gracefully what is beyond your control.",
        poet: "Retired Emperor Sanjō",
        poetJa: "三条院",
        luck: "末吉"
    },
    {
        poem: "<ruby>嵐<rt>あらし</rt></ruby><ruby>吹<rt>ふ</rt></ruby>く <ruby>三室<rt>みむろ</rt></ruby>の<ruby>山<rt>やま</rt></ruby>の <ruby>紅葉<rt>もみじ</rt></ruby><ruby>葉<rt>ば</rt></ruby>は <ruby>竜田<rt>たつた</rt></ruby>の<ruby>川<rt>かわ</rt></ruby>の <ruby>錦<rt>にしき</rt></ruby>なりけり",
        meaning: "The storm blows through Mimuro Mountain, and the scattered maple leaves become a brocade on the Tatsuta River.",
        story: "Priest Nōin became a monk at about twenty-six and wandered the provinces as a traveling poet. He loved the famous poetic places so much that, according to an amusing story, he shut himself up at home and got a suntan so he could present his poem on the Shirakawa Barrier as if he had composed it on the road. This poem describes the autumn leaves of Mount Mimuro, blown down by the storm, decorating the surface of the Tatsuta River like brocade.",
        love: "Even stormy trials, once they have passed, become memories that color your love.",
        work: "If you work with a strong sense of your own style, it becomes your personality. Beyond the difficulties you overcome, brocade-like results and recognition await.",
        poet: "Priest Nōin",
        poetJa: "能因法師",
        luck: "中吉"
    },
    {
        poem: "さびしさに <ruby>宿<rt>やど</rt></ruby>を<ruby>立<rt>た</rt></ruby>ち<ruby>出<rt>い</rt></ruby>でて ながむれば い<ruby>づ<rt>ず</rt></ruby>くも<ruby>同<rt>おな</rt></ruby>じ <ruby>秋<rt>あき</rt></ruby>の<ruby>夕<rt>ゆう</rt></ruby><ruby>暮<rt>ぐれ</rt></ruby>",
        meaning: "Feeling lonely, I stepped outside to gaze at the view — and everywhere I looked, it was the same twilight of autumn.",
        story: "Priest Ryōzen was a monk of Mount Hiei who served as steward of the Gion Shrine and is said to have later lived in seclusion at Ōhara in Kyoto. In this poem, unable to bear his loneliness, he steps out of his hut and looks around, only to find that the autumn evening is just as lonely everywhere.",
        love: "A quiet time to face your own heart. Because you know loneliness, you notice the warmth of others. Inner richness draws love to you.",
        work: "Changing your surroundings doesn't necessarily make your worries disappear. Pausing to reflect will reveal wisdom and a path for the future.",
        poet: "Priest Ryōzen",
        poetJa: "良暹法師",
        luck: "吉"
    },
    {
        poem: "<ruby>夕<rt>ゆう</rt></ruby>されば <ruby>門田<rt>かどた</rt></ruby>の<ruby>稲葉<rt>いなば</rt></ruby> おと<ruby>づ<rt>ず</rt></ruby>れて <ruby>蘆<rt>あし</rt></ruby>のまろやに <ruby>秋風<rt>あきかぜ</rt></ruby>ぞ<ruby>吹<rt>ふ</rt></ruby>く",
        meaning: "As evening falls, the breeze comes rustling through the rice stalks by the gate, and the autumn wind blows through the reed-thatched hut.",
        story: "Minamoto no Tsunenobu excelled at waka, Chinese poetry, and music, and his versatility was compared to that of Fujiwara no Kintō. He rose to Upper Counselor, and in his late seventies went to Kyushu as Acting Governor-General of Dazaifu, where he died at eighty-two. This poem depicts autumn in the countryside: in the evening, the autumn wind rustles the rice leaves by the gate and blows into the reed-thatched hut.",
        love: "Changes close to home may affect your relationship too. Don't rush; go with the natural flow and enjoy the changing seasons together.",
        work: "The winds of change can't be avoided. With the spirit to take on new roles at any age, prepare early and respond calmly, and you will seize success.",
        poet: "Upper Counselor Tsunenobu",
        poetJa: "大納言経信",
        luck: "小吉"
    },
    {
        poem: "<ruby>音<rt>おと</rt></ruby>に<ruby>聞<rt>き</rt></ruby>く <ruby>高師<rt>たかし</rt></ruby>の<ruby>浜<rt>はま</rt></ruby>の あだ<ruby>波<rt>なみ</rt></ruby>は かけじや<ruby>袖<rt>そで</rt></ruby>の ぬれもこそすれ",
        meaning: "I have heard how fickle the waves at Takashi Beach are. I will not let them wet my sleeves — I will keep my heart guarded.",
        story: "Kii was a lady-in-waiting to Princess Yūshi, daughter of Emperor Go-Suzaku, and a long-active poet who took part in poetry contests for more than fifty years. In this poem, written at a contest of love poems, she answered a love poem from Fujiwara no Toshitada with a brilliant comeback: \"I won't be caught by the famously fickle waves of Takashi Beach — I'd rather not get my sleeves wet.\"",
        love: "Don't be fooled by looks or a good reputation; see the person's true nature. Have the strength to turn down a casual invitation firmly, with a touch of humor.",
        work: "A time to avoid flashy temptations and empty talk and to move ahead steadily. Those who stay at the top for a long time have calm judgment.",
        poet: "Kii of Princess Yūshi's Household",
        poetJa: "祐子内親王家紀伊",
        luck: "吉"
    },
    {
        poem: "<ruby>高砂<rt>たかさご</rt></ruby>の <ruby>尾<rt>お</rt></ruby>の<ruby>上<rt>へ</rt></ruby>の<ruby>桜<rt>さくら</rt></ruby> <ruby>咲<rt>さ</rt></ruby>きにけり <ruby>外山<rt>とやま</rt></ruby>の<ruby>霞<rt>かすみ</rt></ruby> <ruby>立<rt>た</rt></ruby>たずもあらな<ruby>む<rt>ん</rt></ruby>",
        meaning: "The cherry blossoms on the high peaks of Takasago have already bloomed. Let the mist not rise over the foothills and hide them from view.",
        story: "Born into a family of scholars, Ōe no Masafusa was called a child prodigy from an early age. He served three emperors — Go-Sanjō, Shirakawa, and Horikawa — and rose to Acting Middle Counselor. A story even says he taught military strategy to the warrior Minamoto no Yoshiie. This poem asks the mist of the hills near the village not to hide the cherry blossoms blooming on the high mountain far away.",
        love: "Long-held feelings are finally bearing fruit. Protect your hard-won happiness so it isn't clouded by worry or rumors.",
        work: "When you have achieved something great, watch out for complacency and noise. An attitude of continual learning will make your success secure.",
        poet: "Acting Middle Counselor Masafusa",
        poetJa: "権中納言匡房",
        luck: "中吉"
    },
    {
        poem: "<ruby>憂<rt>う</rt></ruby>かりける <ruby>人<rt>ひと</rt></ruby>を<ruby>初瀬<rt>はつせ</rt></ruby>の <ruby>山<rt>やま</rt></ruby>おろしよ はげしかれとは <ruby>祈<rt>いの</rt></ruby>らぬものを",
        meaning: "I prayed to the storm wind of Hatsuse — but I never prayed for it to grow fiercer. Why has this person become so cold to me?",
        story: "The son of Minamoto no Tsunenobu, Minamoto no Toshiyori served Emperor Horikawa as a master of the hichiriki flute. On the orders of Retired Emperor Shirakawa he compiled the Kin'yō Wakashū. He was an innovative poet who constantly created new expressions, yet his court rank never rose very high. This poem says that he prayed to the Kannon of Hatsuse for his cold beloved to turn to him — but he never prayed for her to grow as harsh as the mountain wind of Hatsuse.",
        love: "Rather than praying for the other person to change, this is a time to reconsider the shape of your own love. Use the trial as a chance to grow.",
        work: "New challenges are not always understood right away. An unexpected obstacle is a chance to review your plans and strengthen your strategy.",
        poet: "Minamoto no Toshiyori Ason",
        poetJa: "源俊頼朝臣",
        luck: "末吉"
    },
    {
        poem: "<ruby>契<rt>ちぎ</rt></ruby>りおきし させもが<ruby>露<rt>つゆ</rt></ruby>を いのちにて<br>あ<ruby>は<rt>わ</rt></ruby>れ<ruby>今年 <rt>ことし</rt></ruby>の <ruby>秋<rt>あき</rt></ruby>もいぬめり<br>",
        meaning: "You promised me, and I staked my life on it like the morning dew on the wormwood. But another autumn is passing, alas.",
        story: "Though from a distinguished family as a great-grandson of Fujiwara no Michinaga, Fujiwara no Mototoshi stayed at a low rank, perhaps because he was proud of his learning and neglected his duties. With his traditional style he became a leading figure of the poetry world alongside the innovator Minamoto no Toshiyori, and later taught Fujiwara no Toshinari. This poem laments that he held a promise he relied on as dear as life itself, yet this autumn too is passing in vain.",
        love: "This is a time to build love together, not just to wait. Turn your passion into action and nurture the relationship yourself.",
        work: "Even with ability, your attitude alone can change how you are judged. Don't rely too much on others' promises; reach your goals humbly, through your own efforts.",
        poet: "Fujiwara no Mototoshi",
        poetJa: "藤原基俊",
        luck: "末吉"
    },
    {
        poem: "わたの<ruby>原<rt>はら</rt></ruby> こぎいでてみれば <ruby>久方<rt>ひさかた</rt></ruby>の <ruby>雲<rt>くも</rt></ruby><ruby>居<rt>い</rt></ruby>に ま<ruby>が<rt>ご</rt></ruby><ruby>ふ<rt>う</rt></ruby> <ruby>沖<rt>おき</rt></ruby>つ<ruby>白波<rt>しらなみ</rt></ruby>",
        meaning: "Rowing out onto the open sea and looking around — the white waves far off on the water seem to blur into the clouds.",
        story: "Fujiwara no Tadamichi served as regent and Kampaku for a total of thirty-seven years. He fought bitterly with his father Tadazane and his younger brother Yorinaga and came out on the winning side of the Hōgen Rebellion. He was also famed as a calligrapher, and his style is called the Hosshō-ji school. This poem describes a grand scene: rowing out onto the open sea, he sees white waves far offshore that could be mistaken for clouds.",
        love: "New encounters hold great possibilities. Keep a wide view and take a bold step forward.",
        work: "Good fortune for big challenges, like rowing out onto the open sea. Even if there are hard struggles, settle in and tackle them, and you can stay at the forefront for a long time.",
        poet: "Lay Novice of Hosshō-ji Temple, former Kampaku and Chancellor of the Realm",
        poetJa: "法性寺入道前関白太政大臣",
        luck: "大吉"
    },
    {
        poem: "<ruby>瀬<rt>せ</rt></ruby>をはやみ <ruby>岩<rt>いわ</rt></ruby>にせかるる <ruby>滝川<rt>たきがわ</rt></ruby>の われても<ruby>末<rt>すえ</rt></ruby>に あ<ruby>は<rt>わ</rt></ruby><ruby>む<rt>ん</rt></ruby>とぞ<ruby>思<rt>おも</rt></ruby><ruby>ふ<rt>う</rt></ruby>",
        meaning: "Like the river that is split by rocks and flows apart — though we are separated now, I believe we will meet again in the end.",
        story: "Emperor Sutoku came to the throne as a small child, only to be forced to abdicate by his father, Retired Emperor Toba. After Toba's death he fought Emperor Go-Shirakawa in the Hōgen Rebellion, lost, and was exiled to Sanuki, dying there without ever returning to the capital. Though later feared as one of Japan's three great vengeful spirits, he deeply loved poetry and commissioned the Shika Wakashū. This poem says that, like a rapid stream split by a rock that joins again, he will surely meet his love again someday, even though they are parted.",
        love: "Even with separation or obstacles, a strong wish to meet again keeps you connected. Stay true to your conviction.",
        work: "A fate that won't go your way may unsettle you. Don't be caught up in anger or resentment; pour your passion into what truly matters, and your paths will join again.",
        poet: "Retired Emperor Sutoku",
        poetJa: "崇徳院",
        luck: "末吉"
    },
    {
        poem: "<ruby>淡路島<rt>あわじしま</rt></ruby> かよ<ruby>ふ<rt>う</rt></ruby><ruby>千鳥<rt>ちどり</rt></ruby>の <ruby>鳴<rt>な</rt></ruby>く<ruby>声<rt>こえ</rt></ruby>に <ruby>幾夜<rt>いくよ</rt></ruby><ruby>寝覚<rt>ねざ</rt></ruby>めぬ <ruby>須磨<rt>すま</rt></ruby>の<ruby>関守<rt>せきもり</rt></ruby>",
        meaning: "The cry of the plovers flying between Awaji Island — how many nights have I lain awake listening to them at the Suma Barrier?",
        story: "Though of low rank, Minamoto no Kanemasa often showed his skill at the poetry contests of Emperor Horikawa's time. Only about seven of his poems survive in the imperial anthologies, yet this one earned him a place in the Hyakunin Isshu, and a monument to it still stands in Suma Ward, Kobe. In this poem, he wonders how many nights the guard of the Suma Barrier has been woken by the cries of plovers flying over from Awaji Island.",
        love: "Don't be troubled by a relationship that moves slowly; quiet patience is important. Small messages that arrive night after night will grow into a deep bond.",
        work: "Even in an inconspicuous role, steady service leads to recognition in the end. Sometimes a single achievement is remembered for a long time.",
        poet: "Minamoto no Kanemasa",
        poetJa: "源兼昌",
        luck: "末吉"
    },
    {
        poem: "<ruby>秋風<rt>あきかぜ</rt></ruby>に たなびく<ruby>雲<rt>くも</rt></ruby>の たえ<ruby>間<rt>ま</rt></ruby>より もれい<ruby>づ<rt>ず</rt></ruby>る<ruby>月<rt>つき</rt></ruby>の <ruby>影<rt>かげ</rt></ruby>のさやけさ",
        meaning: "Through the gaps in the clouds trailing in the autumn wind, the moonlight filters through, so clear and still.",
        story: "Fujiwara no Akisuke was born into the Rokujō Tōke, a family of poets. He was a close aide of Retired Emperor Shirakawa, but slander got him barred from the palace for a time. Later pardoned, he became Master of the Left Capital and compiled the Shika Wakashū on the orders of Retired Emperor Sutoku. This poem describes the clear, pure beauty of moonlight shining through a break in clouds trailing on the autumn wind.",
        love: "Misunderstandings and worries are only temporary. Just as the moon appears through a break in the clouds, wait without rushing, and your feelings will come through clearly.",
        work: "Even if you are judged unfairly, it is only temporary. Keep working hard, and your ability will surely be recognized and an important role will come your way.",
        poet: "Master of the Left Capital Akisuke",
        poetJa: "左京大夫顕輔",
        luck: "中吉"
    },
    {
        poem: "<ruby>長<rt>なが</rt></ruby>から<ruby>む<rt>ん</rt></ruby> <ruby>心<rt>こころ</rt></ruby>もしらず <ruby>黒髪<rt>くろがみ</rt></ruby>の みだれてけさは <ruby>物<rt>もの</rt></ruby>をこそ<ruby>思<rt>おも</rt></ruby><ruby>へ<rt>え</rt></ruby>",
        meaning: "Not knowing whether your heart will last — I woke this morning with my long black hair in tangles, lost in thought.",
        story: "Horikawa was a lady-in-waiting to Taikenmon'in, the empress of Emperor Toba. After losing her husband, she became a nun when her mistress did, and exchanged poems with Saigyō. This love poem, written for the Kyūan Hundred-Poem Sequence, says: \"I cannot know whether your heart will love me for long, and this morning, after we parted, my heart is as tangled as my black hair.\"",
        love: "A time when you can't read the other person's feelings and your heart is in turmoil. That is proof of deep love. First, settle your own heart.",
        work: "Even if you feel anxious and confused, sorting things out one by one without rushing will lead to solid results. Connections with people you trust will support you.",
        poet: "Horikawa, attendant to Empress Taiken",
        poetJa: "待賢門院堀川",
        luck: "末吉"
    },
    {
        poem: "ほととぎす <ruby>鳴<rt>な</rt></ruby>きつる<ruby>方<rt>かた</rt></ruby>を ながむれば ただ<ruby>有明<rt>ありあけ</rt></ruby>の <ruby>月<rt>つき</rt></ruby>ぞ<ruby>残<rt>のこ</rt></ruby>れる",
        meaning: "I looked toward where the cuckoo had just called — and all that remained was the pale moon at dawn.",
        story: "Though born into the distinguished Tokudaiji family, Fujiwara no Sanesada went about twelve years without office while the Taira clan held power. He eventually returned as Upper Counselor and finally rose to Minister of the Left. The Tale of the Heike even tells how he won his long-desired post of Captain of the Palace Guards by making a pilgrimage to Itsukushima Shrine, which the Taira held dear. This poem says that, looking toward where the cuckoo called, he saw no bird — only the moon lingering at dawn.",
        love: "Even if you feel you have missed your chance, your pure feelings and love remain. Don't rush; wait for the next opportunity.",
        work: "However long the lean years, if you don't grow bitter, a chance for a comeback will come. When needed, use your wits and draw on the help of those around you.",
        poet: "Later Tokudaiji Minister of the Left",
        poetJa: "後徳大寺左大臣",
        luck: "小吉"
    },
    {
        poem: "<ruby>思<rt>おも</rt></ruby><ruby>ひ<rt>い</rt></ruby>わび さても<ruby>命<rt>いのち</rt></ruby>は あるものを <ruby>憂<rt>う</rt></ruby>きにた<ruby>へ<rt>え</rt></ruby>ぬは <ruby>涙<rt>なみだ</rt></ruby>なりけり",
        meaning: "I am exhausted with sorrow, yet somehow I am still alive. What cannot endure is not my life — but my tears.",
        story: "No one could match Priest Dōin's passion for poetry. Even in his seventies and eighties he walked to Sumiyoshi Shrine every month to pray, \"Let me compose good poems,\" and at poetry gatherings he listened so intently that he would not miss a single word of the critiques. There is even a story that after his death, delighted that his poems had been chosen for the Senzai Wakashū, he appeared in a dream of its compiler, Fujiwara no Toshinari. This poem says that though his life goes on as he pines for a cold lover, what cannot bear the pain and spills over is his tears.",
        love: "You have endured a painful one-sided love. Let yourself cry sometimes, and heal your heart by showing your vulnerable side to someone you trust.",
        work: "A passion for learning, whatever your age, always bears fruit. If you feel you have reached your limit under pressure, have the courage to rest and restore your mind and body.",
        poet: "Priest Dōin",
        poetJa: "道因法師",
        luck: "末吉"
    },
    {
        poem: "<ruby>世<rt>よ</rt></ruby>の<ruby>中<rt>なか</rt></ruby>よ <ruby>道<rt>みち</rt></ruby>こそなけれ <ruby>思<rt>おも</rt></ruby><ruby>ひ<rt>い</rt></ruby><ruby>入<rt>い</rt></ruby>る <ruby>山<rt>やま</rt></ruby>の<ruby>奥<rt>おく</rt></ruby>にも <ruby>鹿<rt>しか</rt></ruby>ぞ<ruby>鳴<rt>な</rt></ruby>くなる",
        meaning: "There is no escape from this world. Even deep in the mountains, the deer cry out.",
        story: "The father of Fujiwara no Sadaie, Fujiwara no Toshinari compiled the Senzai Wakashū and was the leading figure of the poetry world. He brought the aesthetic ideal of yūgen into waka and lived to ninety-one. The Tale of the Heike tells how Taira no Tadanori, fleeing the capital, turned back to entrust his poems to Toshinari. This poem says there is no escape from this painful world — even deep in the mountains where he has fled in despair, a deer cries sorrowfully.",
        love: "Now, while you feel alone, is the time to face your own heart. That time will open a new path to nurturing love.",
        work: "Even when you feel there is no escape, looking deeply into your present pain will give rise to your own expression and answers. In the long run, that experience will make you a master.",
        poet: "Master of the Empress Dowager's Household Toshinari",
        poetJa: "皇太后宮大夫俊成",
        luck: "末吉"
    },
    {
        poem: "<ruby>長<rt>なが</rt></ruby>ら<ruby>へ<rt>え</rt></ruby>ば またこのごろや しのばれ<ruby>む<rt>ん</rt></ruby> <ruby>憂<rt>う</rt></ruby>しと<ruby>見<rt>み</rt></ruby>し<ruby>世<rt>よ</rt></ruby>ぞ <ruby>今<rt>いま</rt></ruby>は<ruby>恋<rt>こい</rt></ruby>しき<br>",
        meaning: "If I live on long enough, perhaps even these painful days will become dear to me, as something I once longed to leave behind.",
        story: "Though born into the Rokujō Tōke, a family of poets, Fujiwara no Kiyosuke did not get along with his father Akisuke and stayed at a low rank until his late forties. The anthology he compiled on Emperor Nijō's orders never became an imperial anthology because the emperor died. Even so, he left many works on poetics and became a great scholar of poetry, rivaling Fujiwara no Toshinari. This poem says that if he lives on, he may come to miss even today's pain — for the past he once thought painful is dear to him now.",
        love: "Today's hard experience will become a memory that deepens your love in the future. Don't run away; support each other and get through it together.",
        work: "Even if your efforts go unrewarded for a while, what you have built up never disappears. Today's hardship is a precious asset for the future. Keep at it, and you will see results.",
        poet: "Fujiwara no Kiyosuke Ason",
        poetJa: "藤原清輔朝臣",
        luck: "吉"
    },
    {
        poem: "<ruby>夜<rt>よ</rt></ruby>もすがら <ruby>物<rt>もの</rt></ruby><ruby>思<rt>おも</rt></ruby><ruby>ふ<rt>う</rt></ruby>ころは <ruby>明<rt>あ</rt></ruby>けやらで <ruby>閨<rt>ねや</rt></ruby>のひまさ<ruby>へ<rt>え</rt></ruby> つれなかりけり",
        meaning: "All through the night, lost in thought, the dawn will not come. Even the crack of light through the bedroom door seems cold and distant.",
        story: "The son of Minamoto no Toshiyori, Shun'e became a monk at Tōdai-ji. After losing his father at seventeen he stayed away from poetry for about twenty years, but began composing again after forty, named his quarters \"Karin-en\" (Grove of Poems), and hosted gatherings where many poets met. His disciples included Kamo no Chōmei, author of An Account of My Hut. This love poem says that these nights, spent brooding all night long, dawn never seems to come, and even the gap in the bedroom door seems cruel.",
        love: "Single-minded love always has the power to move things. Don't rush; keep your sincere feelings, and in time a warm light will shine on your love.",
        work: "Even after a long break, it's never too late to start again. Even in times when effort goes unrewarded, dawn always comes.",
        poet: "Priest Shun'e",
        poetJa: "俊恵法師",
        luck: "末吉"
    },
    {
        poem: "<ruby>嘆<rt>なげ</rt></ruby>けとて <ruby>月<rt>つき</rt></ruby>やは<ruby>物<rt>もの</rt></ruby>を <ruby>思<rt>おも</rt></ruby><ruby>は<rt>わ</rt></ruby>する かこち<ruby>顔<rt>がお</rt></ruby>なる わが<ruby>涙<rt>なみだ</rt></ruby>かな",
        meaning: "Did the moon ask me to grieve? These tears on my face — it is as if I am blaming the moon for making me feel this way.",
        story: "Though Satō Norikiyo was an elite warrior in the service of Retired Emperor Toba, he became a monk at twenty-three, taking the name Saigyō. He traveled the provinces composing poems, and more of his poems were chosen for the Shin Kokin Wakashū than anyone else's. Just as he wrote, \"I wish to die in spring beneath the blossoms,\" he is said to have died in cherry-blossom season. This poem says the moon does not make him sad — yet his tears fall as if the moon were to blame.",
        love: "The tears you shed are proof of your kindness and pure love. Accept your feelings honestly, and you can build a good relationship.",
        work: "The courage to leave a secure path can make a new talent blossom. Worries are a sign that your heart is changing. Reexamining your feelings will show you the way forward.",
        poet: "Priest Saigyō",
        poetJa: "西行法師",
        luck: "吉"
    },
    {
        poem: "<ruby>村雨<rt>むらさめ</rt></ruby>の <ruby>露<rt>つゆ</rt></ruby>もまだひぬ まきの<ruby>葉<rt>は</rt></ruby>に <ruby>霧<rt>きり</rt></ruby>たちのぼる <ruby>秋<rt>あき</rt></ruby>の<ruby>夕<rt>ゆう</rt></ruby><ruby>暮<rt>ぐれ</rt></ruby>",
        meaning: "After the passing shower, the mist rises slowly through the rain-drenched leaves of the cedar. An autumn evening.",
        story: "A nephew of Fujiwara no Toshinari, Jakuren was adopted as his son. He became a monk in his thirties and devoted himself to poetry under Toshinari. His talent was recognized by Retired Emperor Go-Toba and he was chosen as a compiler of the Shin Kokin Wakashū, but he died before it was finished. This poem describes an autumn evening when, after a passing shower, mist rises around the leaves of the cedars and cypresses still wet with raindrops.",
        love: "The clashes and troubles have settled, but some uncertainty remains. Don't dwell on the past; wait quietly for the mist to clear.",
        work: "Even if your position changes, the skills you have honed will be recognized. While things stay uncertain, gather information calmly and prepare until the situation becomes clear.",
        poet: "Priest Jakuren",
        poetJa: "寂蓮法師",
        luck: "末吉"
    },
    {
        poem: "<ruby>難波江<rt>なにわえ</rt></ruby>の <ruby>葦<rt>あし</rt></ruby>のかりねの ひとよゆ<ruby>ゑ<rt>え</rt></ruby> みをつくしてや <ruby>恋<rt>こ</rt></ruby><ruby>ひ<rt>い</rt></ruby>わたるべき",
        meaning: "For just one brief night together, like the cut end of a reed at Naniwa — must I go on longing for you forever?",
        story: "Kōkamon'in no Bettō was a lady-in-waiting to Kōkamon'in, the empress of Retired Emperor Sutoku. She was active at poetry contests held at the home of Kujō Kanezane, Kōkamon'in's younger brother. This poem asks whether, for a single night's love at an inn — as short as a joint of reed cut at Naniwa Bay — she must devote her whole self to loving him, like the channel markers of Naniwa.",
        love: "A love that began with a small spark is growing into serious feelings. Turn that passion into strength for your own growth, and in time it will move the other person's heart.",
        work: "A small project is developing into a theme worth giving your all. Trust your enthusiasm and give it everything; it will bring solid results and a guide for your life.",
        poet: "Attendant to Empress Kōka",
        poetJa: "皇嘉門院別当",
        luck: "小吉"
    },
    {
        poem: "<ruby>玉<rt>たま</rt></ruby>の<ruby>緒<rt>お</rt></ruby>よ <ruby>絶<rt>た</rt></ruby>えなば<ruby>絶<rt>た</rt></ruby>えね ながら<ruby>へ<rt>え</rt></ruby>ば <ruby>忍<rt>しの</rt></ruby>ぶることの <ruby>弱<rt>よわ</rt></ruby>りもぞする",
        meaning: "Let my life end now, if it must. For if I go on living, my power to endure this secret love may weaken.",
        story: "A daughter of Emperor Go-Shirakawa, Princess Shikishi served for about ten years as Kamo Priestess at the Kamo Shrines. She never married, studied poetry under Fujiwara no Toshinari, and became one of the leading women poets of the Shin Kokin Wakashū. A legend of a secret love with Toshinari's son, Fujiwara no Sadaie, also arose and became the subject of the Noh play Teika. This poem says: \"My life, if you must end, then end — for if I live on, my strength to hide this love will weaken and it will be known.\"",
        love: "The strong love you hold in your heart is proof of how serious you are. When you reach your limit, be honest with yourself and have the courage to choose your own future.",
        work: "Your passion is about to exceed the limits of your patience. Shaping the feelings you have held back into a work or an action will give you the power to turn things around.",
        poet: "Princess Shikishi",
        poetJa: "式子内親王",
        luck: "末吉"
    },
    {
        poem: "<ruby>見<rt>み</rt></ruby>せばやな <ruby>雄島<rt>おじま</rt></ruby>のあまの <ruby>袖<rt>そで</rt></ruby>だにも ぬれにぞぬれし <ruby>色<rt>いろ</rt></ruby>はか<ruby>は<rt>わ</rt></ruby>らず",
        meaning: "I wish I could show you — these sleeves of mine, soaked through and through with tears that never change color, never dry.",
        story: "A lady-in-waiting to Inpumon'in, a daughter of Emperor Go-Shirakawa, Inpumon'in no Taifu composed so many poems that she was called \"Taifu of a Thousand Poems.\" She mixed with the great poets of her day, such as Fujiwara no Sadaie and Saigyō. This poem says: \"Even the sleeves of the fishermen of Ojima, however wet, do not change color — how I wish I could show you my sleeves, stained by tears of blood.\"",
        love: "The pain in your heart is proof of your earnest love. Show your heart honestly, and you will gain deep understanding and a special bond.",
        work: "Doing a great deal builds true skill. Hardship and experience no one sees will break through your situation and eventually earn high praise.",
        poet: "Attendant to Empress Inpu",
        poetJa: "殷富門院大輔",
        luck: "吉"
    },
    {
        poem: "きりぎりす <ruby>鳴<rt>な</rt></ruby>くや<ruby>霜夜<rt>しもよ</rt></ruby>の さむしろに <ruby>衣<rt>ころも</rt></ruby>かたしき ひとりかも<ruby>寝<rt>ね</rt></ruby><ruby>む<rt>ん</rt></ruby>",
        meaning: "On a cold, frosty night, the cricket cries. Lying alone with one sleeve folded beneath me — how lonely it is.",
        story: "The son of Kujō Kanezane, Kujō Yoshitsune rose to Regent and Chancellor of the Realm. He wrote the kana preface of the Shin Kokin Wakashū and left his name in calligraphy as the founder of the Gokyōgoku style, but died suddenly at the young age of thirty-eight. This poem asks: on a frosty night when the crickets cry, must I sleep alone, with only one sleeve of my robe spread on a cold straw mat?",
        love: "In harsh loneliness, taking care of yourself will eventually draw a gentle love with whom you can truly connect.",
        work: "Even when blessed with rank and talent, everyone carries some loneliness. Whatever others think, steady effort will build your future confidence and results.",
        poet: "Gokyōgoku Regent and former Chancellor of the Realm",
        poetJa: "後京極摂政前太政大臣",
        luck: "小吉"
    },
    {
        poem: "わが<ruby>袖<rt>そで</rt></ruby>は <ruby>潮干<rt>しおひ</rt></ruby>に<ruby>見<rt>み</rt></ruby>えぬ <ruby>沖<rt>おき</rt></ruby>の<ruby>石<rt>いし</rt></ruby>の <ruby>人<rt>ひと</rt></ruby>こそ<ruby>知<rt>し</rt></ruby>らね かわくまもなし",
        meaning: "My sleeves are like a rock hidden beneath the tides — unseen by others, they are never dry.",
        story: "The daughter of the warrior-poet Minamoto no Yorimasa, Nijōin no Sanuki served Emperor Nijō. Her father raised an army against the Taira and was defeated, but Sanuki went on to flourish as a poet and also served the empress of Emperor Go-Toba. Because of this poem she came to be called \"Sanuki of the Rock in the Offing.\" It says: \"Like a rock in the offing, unseen even at low tide, unknown to anyone, my sleeves are never dry from tears.\"",
        love: "Hidden feelings and quiet effort will become the driving force that turns love around. Don't rush; trust the strength within you.",
        work: "Steady effort where no one is watching will soon bring great results and attention. Aim for a piece of work that becomes your signature.",
        poet: "Sanuki, attendant to retired Emperor Nijō",
        poetJa: "二条院讃岐",
        luck: "中吉"
    },
    {
        poem: "<ruby>世<rt>よ</rt></ruby>の<ruby>中<rt>なか</rt></ruby>は つねにもがもな <ruby>渚<rt>なぎさ</rt></ruby>こぐ あまの<ruby>小舟<rt>おぶね</rt></ruby>の <ruby>綱手<rt>つなで</rt></ruby>かなしも",
        meaning: "I wish the world could stay just as it is forever. How moving it is to watch the small fishing boats being towed along the shore.",
        story: "The son of Minamoto no Yoritomo, Minamoto no Sanetomo became the third shogun of the Kamakura shogunate at twelve. He studied poetry under Fujiwara no Sadaie and became the first warrior to rise to Minister of the Right, but at twenty-eight he was assassinated by his nephew Kugyō at Tsurugaoka Hachiman Shrine. This poem says: \"I wish the world could stay like this forever — how dear is the sight of the fishermen pulling their little boats along the shore.\"",
        love: "Even in a peaceful love, worries lie hidden. Clear up small changes and misunderstandings early, and treasure the happiness of everyday life.",
        work: "Don't let your guard down, even when results are steady. Protect what you have while moving your plans forward in preparation for change. Ordinary days are a priceless treasure.",
        poet: "Minister of the Right of Kamakura",
        poetJa: "鎌倉右大臣",
        luck: "中吉"
    },
    {
        poem: "み<ruby>吉野<rt>よしの</rt></ruby>の <ruby>山<rt>やま</rt></ruby>の<ruby>秋風<rt>あきかぜ</rt></ruby> さ<ruby>夜<rt>よ</rt></ruby>ふけて ふるさと<ruby>寒<rt>さむ</rt></ruby>く <ruby>衣<rt>ころも</rt></ruby>うつなり",
        meaning: "On an autumn night, the mountain wind of Yoshino blows cold. In the old village, I can hear the sound of someone beating cloth.",
        story: "Asukai Masatsune, a master of kemari, is considered the founder of the Asukai school of the game. When his father was punished, he was implicated and sent to Kamakura, but Minamoto no Yoritomo took a liking to his talent for poetry and kemari and treated him generously. After returning to the capital he became a close aide of Retired Emperor Go-Toba and was chosen as one of the compilers of the Shin Kokin Wakashū. This poem says that as the autumn wind blows over Mount Yoshino and the night deepens, the old capital village grows cold, and the sound of cloth being beaten on fulling blocks can be heard.",
        love: "A time when your relationship may seem to cool. Don't rush; this is an important time to take a fresh look at it.",
        work: "Even in adversity, what you are good at will open the way. Precisely because this is a time of quiet, unnoticed effort, sharpen your strengths.",
        poet: "Councillor Masatsune",
        poetJa: "参議雅経",
        luck: "末吉"
    },
    {
        poem: "お<ruby>ほ<rt>お</rt></ruby>けなく <ruby>憂<rt>う</rt></ruby>き<ruby>世<rt>よ</rt></ruby>の<ruby>民<rt>たみ</rt></ruby>に お<ruby>ほ<rt>お</rt></ruby><ruby>ふ<rt>う</rt></ruby>かな わがたつ<ruby>杣<rt>そま</rt></ruby>に <ruby>墨染<rt>すみぞめ</rt></ruby>の<ruby>袖<rt>そで</rt></ruby>",
        meaning: "How bold it is of me — yet I spread my ink-black sleeves to shelter the people of this troubled world.",
        story: "The younger brother of Regent Kujō Kanezane, Jien served four times as head of the Tendai school. He wrote the history Gukanshō and is said to have warned Retired Emperor Go-Toba against his plan to overthrow the shogunate. This poem expresses his resolve as a monk: \"Though it is presumptuous of me, I wish to wrap the people of this troubled world in the black sleeves of my robe, now that I have come to live on Mount Hiei.\"",
        love: "If you have the kind of love that stays close and embraces the other person, things will go well.",
        work: "You may be facing a big task that serves society and the people around you. Keep your aims high, and work on it steadily without pushing yourself too hard.",
        poet: "Former Senior High Priest Jien",
        poetJa: "前大僧正慈円",
        luck: "吉"
    },
    {
        poem: "<ruby>花<rt>はな</rt></ruby>さそ<ruby>ふ<rt>う</rt></ruby> <ruby>嵐<rt>あらし</rt></ruby>の<ruby>庭<rt>にわ</rt></ruby>の <ruby>雪<rt>ゆき</rt></ruby>ならで ふりゆくものは わが<ruby>身<rt>み</rt></ruby>なりけり",
        meaning: "It is not the snow of blossoms scattered by the storm in the garden — it is I myself who am fading with the years.",
        story: "Saionji Kintsune had family ties with Minamoto no Yoritomo's relatives and close connections with the Kamakura shogunate. During the Jōkyū War he was imprisoned by Retired Emperor Go-Toba yet still passed information to the shogunate, and after the war he rose to Chancellor of the Realm and held great power at court. He enjoyed such glory that he built the temple Saionji in Kitayama, Kyoto, while a noble of his day called him \"a treacherous minister of the age.\" At the peak of that life, watching the blossoms fall, he lamented his old age in this poem: \"what grows old is I myself.\"",
        love: "Attracting people with status or glamour doesn't guarantee a satisfied heart. Value whether you can be your natural self together, more than titles or conditions.",
        work: "Even if you rise by going along with the powerful, in the end you are left with the question, \"What have I done with my life?\" Don't chase only praise and position; spend your time on what you truly want to do.",
        poet: "Lay Novice and former Chancellor of the Realm",
        poetJa: "入道前太政大臣",
        luck: "吉"
    },
    {
        poem: "<ruby>来<rt>こ</rt></ruby>ぬ<ruby>人<rt>ひと</rt></ruby>を <ruby>松帆<rt>まつほ</rt></ruby>の<ruby>浦<rt>うら</rt></ruby>の <ruby>夕<rt>ゆう</rt></ruby>なぎに <ruby>焼<rt>や</rt></ruby>くやもしほの <ruby>身<rt>み</rt></ruby>もこがれつつ",
        meaning: "Waiting for someone who will not come, at the quiet evening shore — like salt burned from the seaweed, I too am consumed by longing.",
        story: "The son of Fujiwara no Toshinari, Fujiwara no Sadaie compiled the Shin Kokin Wakashū and is said to have selected this Ogura Hyakunin Isshu. He had a short temper: he was once expelled from court for a time after a fight in the palace, and he angered Retired Emperor Go-Toba and was shut out of poetry gatherings for a while. During that time he copied many classics by hand and preserved them for later generations. This poem says that, waiting for a lover who does not come, he burns with longing like the salt-making seaweed burned in the evening calm at Matsuho Bay.",
        love: "Your love will surely reach the other person. Don't rush; keep the flame alive and keep waiting.",
        work: "Even when you can't shine as you would like, pouring your passion into steady preparation can become a great work that lasts for generations. Turn impatience into strength.",
        poet: "Acting Middle Counselor Sadaie",
        poetJa: "権中納言定家",
        luck: "末吉"
    },
    {
        poem: "<ruby>風<rt>かぜ</rt></ruby>そよぐ ならの<ruby>小川<rt>おがわ</rt></ruby>の <ruby>夕<rt>ゆう</rt></ruby><ruby>暮<rt>ぐれ</rt></ruby>は みそぎぞ<ruby>夏<rt>なつ</rt></ruby>の しるしなりける",
        meaning: "The breeze rustles through the leaves of the sacred oak trees by the river at dusk. The purification rite is the only sign that summer is here.",
        story: "Fujiwara no Ietaka studied under Fujiwara no Toshinari and was ranked alongside Fujiwara no Sadaie. He is said to have composed about 60,000 poems in his life, and was one of the compilers of the Shin Kokin Wakashū. After Retired Emperor Go-Toba was exiled to Oki following the Jōkyū War, he kept sending poems to him far away. This poem says that the evening by the Nara Stream, with the wind rustling the oak leaves, feels like autumn — but the purification rite shows it is still summer.",
        love: "Even if you sense a change in your relationship, the underlying bond is unchanged. Even if the other person is far away, keep sending your unchanging feelings.",
        work: "There are signs of change, but the real season hasn't arrived yet. For now, build your skill through practice and strengthen your plans and foundations.",
        poet: "Junior Second Rank Ietaka",
        poetJa: "従二位家隆",
        luck: "吉"
    },
    {
        poem: "<ruby>人<rt>ひと</rt></ruby>もをし <ruby>人<rt>ひと</rt></ruby>もうらめし あ<ruby>ぢ<rt>じ</rt></ruby>きなく <ruby>世<rt>よ</rt></ruby>を<ruby>思<rt>おも</rt></ruby><ruby>ふ<rt>う</rt></ruby>ゆ<ruby>ゑ<rt>え</rt></ruby>に <ruby>物<rt>も</rt></ruby><ruby>思<rt>おも</rt></ruby><ruby>ふ<rt>う</rt></ruby><ruby>身<rt>み</rt></ruby>は",
        meaning: "I find people both dear and hateful. It is because I care so deeply about this troubled world that I am always lost in thought.",
        story: "Retired Emperor Go-Toba came to the throne without the Three Sacred Treasures and later led the court through cloistered rule. He personally led the creation of the Shin Kokin Wakashū and was so versatile that he was also known for his involvement in sword-making. But he was defeated by the Kamakura shogunate in the Jōkyū War, exiled to Oki, and died there. This poem says that people seem dear, and also hateful, to one like him, who broods in sorrow over a world that does not go as he wishes.",
        love: "Feeling both love and resentment is proof that you are serious about the other person. Accepting that conflict will let you build a deep and stable love.",
        work: "You may grow frustrated with a world that won't go your way. Rather than gambling on emotion, look at things from many angles and calmly wait for the right moment; that is what opens the way.",
        poet: "Retired Emperor Go-Toba",
        poetJa: "後鳥羽院",
        luck: "小吉"
    },
    {
        poem: "ももしきや ふるき<ruby>軒<rt>のき</rt></ruby>ばの しのぶにも な<ruby>ほ<rt>お</rt></ruby>あまりある <ruby>昔<rt>むかし</rt></ruby>なりけり",
        meaning: "Even the ancient ferns on the old eaves of the palace — there is more than enough of the past that they call to mind.",
        story: "The son of Retired Emperor Go-Toba, Emperor Juntoku came to the throne at fourteen. He studied poetry under Fujiwara no Sadaie and wrote the Kinpishō, a guide to court customs, and the Yakumo Mishō, a treatise on poetry. He joined his father in the Jōkyū War, was defeated, and was exiled to Sado, where he spent about twenty-one years. This, the last poem of the Hyakunin Isshu, says that seeing the ferns of remembrance growing on the old palace eaves, what he cannot stop longing for is the good old days.",
        love: "Memories of the past are treasures of the heart. Supported by them, turning your eyes to the bonds and warmth of today will help you nurture a mature love.",
        work: "Past experience is a source of wisdom and courage. Rather than just looking back fondly, record what you have learned and pass it on; it will bear great fruit in the future.",
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

// おみくじは1日に何度でも引けるが、同じ日に引いた場合は何度引いても同じ結果になる
// （その日の最初の結果をlocalStorageに保存し、2回目以降はそれを使う）。
// 開発モード：URLに ?dev=1 を付けると、毎回ランダムに引き直せる（結果は保存しない）
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

function initOmikuji() {
    // 開発モード中はひと目でわかるようにバッジを表示
    if (DEV_MODE) {
        const badge = document.createElement('div');
        badge.textContent = 'DEV MODE: no daily limit';
        badge.style.cssText = 'position:fixed;top:0;left:0;z-index:9999;background:#b82343;color:#fff;font-size:12px;padding:4px 10px;font-family:sans-serif;';
        document.body.appendChild(badge);
    }

    // 必要なDOM要素の取得
    const drawButton = document.getElementById('draw-button');
    if (!drawButton) return; // おみくじのマークアップが無いページでは何もしない
    const omikujiBox = document.getElementById('omikuji-box');
    const omikujiContainer = document.getElementById('omikuji-container');
    const resultArea = document.getElementById('result-area');
    const resetButton = document.getElementById('reset-button');

    // 説明文・セクション・言語切り替えの要素を取得
    const omikujiExplanation = document.querySelectorAll('.omikuji-explanation');
    const hiddenOnResult = document.querySelectorAll('.section, p.lang-wrapper');
    const omikujiStickWrap = document.getElementById('omikuji-stick-wrap');
    const omikujiStickNumber = document.getElementById('omikuji-stick-number');
    const omikujiImageFront = document.getElementById('omikuji-image-front');
    const omikujiImageBack  = document.getElementById('omikuji-image-back');

    // 結果表示要素
    const wakaPoem = document.getElementById('waka-poem');
    const wakaMeaning = document.getElementById('waka-meaning');
    const wakaStory = document.getElementById('waka-story'); // 歌人と歌の背景（無いページ・データでは使わない）
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
        wakaStory && wakaStory.closest('.interpretation-section'),
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
        wakaMeaning.textContent = result.meaning;
        if (wakaStory) {
            wakaStory.textContent = result.story || '';
            // 背景の文がまだ無い首では、見出しごと隠す
            wakaStory.closest('.interpretation-section').style.display = result.story ? '' : 'none';
        }
        wakaLuck.textContent = `Today's Fortune: ${luckMap[result.luck] || result.luck}`;
        // 英語の下に、日本語の運勢（大吉・中吉など）を1行で添える
        const luckJa = document.createElement('span');
        luckJa.className = 'luck-ja';
        luckJa.lang = 'ja';
        luckJa.textContent = result.luck;
        wakaLuck.appendChild(luckJa);
        interpLove.textContent = result.love;
        interpWork.textContent = result.work;
        if (poemLinkBtn) poemLinkBtn.href = `${index + 1}_en.html`;

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
        // 同じ日に引いた場合は、何度引いても同じ結果にする（その日の初回だけランダムに決めて保存）
        const todayResult = DEV_MODE ? null : getTodayResult();
        const randomIndex = todayResult ? todayResult.index : Math.floor(Math.random() * hyakuninIsshu.length);
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
                        if (!DEV_MODE && !todayResult) {
                            saveTodayResult(randomIndex);
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

        // 何度でも引けるので、ボタンは常に再表示
        drawButton.style.display = '';
    });
}

// 通常は DOMContentLoaded で初期化。index.html では後から読み込むので、その時点で即初期化する
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOmikuji);
} else {
    initOmikuji();
}
