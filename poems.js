// 提供されたJSONデータ
let poems = {
    "1": {
        "number": "1",
        "name": "<ruby>天智天皇<rt>てんじてんのう</rt></ruby>",
        "date": "626年-671年",
        "source": "後撰集 秋",
        "theme": "autumn",
        "first": "<ruby>秋<rt>あき</rt></ruby>の<ruby>田<rt>た</rt></ruby>の<br>かりほの<ruby>庵<rt>いお</rt></ruby>の<br><ruby>苫<rt>とま</rt></ruby>をあらみ",
        "second": "<ruby>我<rt>わ</rt></ruby>が<ruby>衣手<rt>ころもで</rt></ruby>は<br><ruby>露<rt>つゆ</rt></ruby>にぬれつつ",
        "torihuda": "わかころも<br>てはつゆに<br>ぬれつつ",
        "eng":"In the fall, by rice paddies,<br>A temporary hut with coarse toma roofing,<br>My sleeves have been wetting with night dew.",
        "eng_name":"The Emperor Tenji",
        "translation": "秋の田のほとりにある仮小屋は、屋根の苫の目が粗くて、私の袖が夜露に濡れているよ。",
        "background": "当時、稲の刈り入れの時期になると、田んぼの近くに仮の小屋を建てて、害獣から稲を守るために夜通しで見張りをしていました。天皇がそのような小屋で夜通し過ごし、夜露に袖を濡らす姿は、なかなか想像しにくいものです。そこで、『万葉集』の詠み人知らず（作者不明）の歌が、庶民を思いやる天智天皇の歌として伝わったと考えられています。",
        "personality": "天智天皇は、大化の改新という政治改革を行い、豪族が中心の政治から天皇が中心の政治に大きく変えました。そして、中央集権の体制を進め、後に続く平安時代の基礎を築いたため、平安時代の人々から敬われました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba.svg' alt='掛詞' class='trigger'>",
        "kakekotobaLink": "<p>「かりほ」は「仮庵」と「刈り穂」の掛詞です。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "2": {
        "number": "2",
        "name": "<ruby>持統天皇<rt>じとうてんのう</rt></ruby>",
        "date": "645年～702年",
        "source": "新古今集 夏",
        "theme": "summer",
        "first": "<ruby>春<rt>はる</rt></ruby><ruby>過<rt>す</rt></ruby>ぎて<br><ruby>夏<rt>なつ</rt></ruby><ruby>来<rt>き</rt></ruby>にけらし<br><ruby>白妙<rt>しろたえ</rt></ruby>の",
        "second": "<ruby>衣<rt>ころも</rt></ruby>ほす<ruby>てふ<rt>ちょう</rt></ruby><br><ruby>天<rt>あま</rt></ruby>の<ruby>香具山<rt>かぐやま</rt></ruby>",
        "torihuda": "ころもほす<br>てふあまの<br>かくやま",
        "eng":"Spring has fled,<br>lookes like summer is here.<br>On heavenly Mount Kaguyama,<br>where white robes are hung<br>to dry in the summer.",
        "eng_name":"Empress Jitō",
        "translation": "春は過ぎ去り、夏が来たようだ。夏になると衣が干されるという天の香具山に白い衣が干されているよ。",
        "background": "香具山は奈良県橿原市にある小高い山で、持統天皇が政治を執り行った藤原京からは東に見えました。当時、初夏に「白妙の衣」を香具山に干す風習があり、夏の訪れを知らせる風物詩だったようです。",
        "personality": "本名は<ruby>鸕野讃良<rt>うののさらら</rt></ruby>。<a href='1.html'>天智天皇（1番）</a>の娘ですが、母方の祖父は天智天皇に謀反の疑いをかけられ自害しています。古代史上最大の内乱「壬申の乱」では天智天皇の後継をめぐり、夫の天武天皇と共に戦い勝利しました。天武天皇の崩御後は、息子の<ruby>草壁皇子<rt>くさかべのみこ</rt></ruby>が夭折したため40代半ばで自らが天皇に即位。天武天皇の遺志を継ぎ、藤原京の造営、律令制度の整備などを行いました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌には掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba.svg' alt='枕詞' class='trigger'>",
        "makurakotobaLink": "<p>「白妙の」は白いものにかかる枕詞です。この歌では「衣」にかかっています。</p>",
        "utamakuraMark": "<img src='../img/mark_utamakura.svg' alt='歌枕' class='shadow trigger'>",
        "utamakuraLink": "utamakura.html?lat=34.49569&lng=135.81847&zoom=20",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "3": {
        "number": "3",
        "name": "<ruby>柿本人麻呂<rt>かきのもとひとまろ</rt></ruby>",
        "date": "生没年不詳",
        "source": "拾遺集 恋",
        "theme": "love",
        "first": "あしびきの<br><ruby>山鳥<rt>やまどり</rt></ruby>の<ruby>尾<rt>お</rt></ruby>の<br>しだり<ruby>尾<rt>お</rt></ruby>の",
        "second": "ながながし<ruby>夜<rt>よ</rt></ruby>を<br>ひとりかも<ruby>寝<rt>ね</rt></ruby><ruby>む<rt>ん</rt></ruby>",
        "torihuda": "なかなかし<br>よをひとり<br>かもねむ",
        "eng":"Shall I lie alone through the long, long night,<br>Lonely as a mountain pheasant's tail,<br>Hanging down in solitude and sorrow?",
        "eng_name":"Kakinomoto no Hitomaro",
        "translation": "山鳥の垂れ下がる尾のように長い長い夜を独りさびしく寝るのだろうか。",
        "background": "この歌は一人で寝る寂しさを山鳥の長い尾に例えて詠まれました。山鳥のつがいは昼は一緒に過ごしても、夜は谷を挟んで別々の山で過ごす習性があると考えられていました。",
        "personality": "柿本人麻呂は、朝廷に仕え、天皇の賛歌や挽歌などを詠んだことで知られています。彼は主観的な感情を表現する抒情詩に優れており、<a href='4.html'>山部赤人（4番）</a>とともに「歌聖」として賞賛され、和歌の神様として尊ばれています。彼の名前からは、「火止まる」や「人生まれる」が連想され、防火や安産のご利益がある神様としても敬われています。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌には掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba.svg' alt='序詞' class='trigger'>",
        "jokotobaLink": "<p>「あしびきの 山鳥の尾の しだり尾の」が序詞です。比喩表現で「ながながし」を修飾しています。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba.svg' alt='枕詞' class='trigger'>",
        "makurakotobaLink": "<p>「あしびきの」は山や山を含む語句にかかります。この歌では山鳥にかかっています。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "4": {
        "number": "4",
        "name": "<ruby>山部赤人<rt>やまべのあかひと</rt></ruby>",
        "date": "生没年不詳",
        "source": "新古今集 冬",
        "theme": "winter",
        "first": "<ruby>田子<rt>たご</rt></ruby>の<ruby>浦<rt>うら</rt></ruby>に<br>うちいでてみれば<br><ruby>白妙<rt>しろたえ</rt></ruby>の",
        "second": "<ruby>富士<rt>ふじ</rt></ruby>の<ruby>高嶺<rt>たかね</rt></ruby>に<br><ruby>雪<rt>ゆき</rt></ruby>は<ruby>降<rt>ふ</rt></ruby>りつつ",
        "torihuda": "ふしのたか<br>ねにゆきは<br>ふりつつ",
        "eng":"By Tago's bay,<br>I gaze at Fuji's peak,<br>Draped in white,<br>snow falling endlessly.",
        "eng_name":"Yamabe no Akahito",
        "translation": "田子の浦に出てみたら、富士の高嶺に真っ白な布を被せたように雪がしきりに降っているよ。",
        "background": "「田子の浦」は、駿河湾西沿岸（由井～蒲原付近の海岸）のことです。この辺りは山が海岸線に迫っているのですが、田子の浦に出てくると、ようやく富士山が全貌を現します。この歌は、そのときの感動を詠んだものだと思われます。当時の富士山は噴煙が上がり、今よりもさらに威厳に満ちた姿を見せていたと考えられます。",
        "personality": "山辺赤人は奈良時代の万葉歌人で、聖武天皇に仕えていました。下級官吏でしたが、自然を見事に描写する才能があり、天皇の行幸に随行して各地の自然を詠んだ多くの歌を残しています。<a href='3.html'>柿本人麻呂（3番）</a>とともに「歌聖」として称えられました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌には掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba.svg' alt='枕詞' class='trigger'>",
        "makurakotobaLink": "<p>「白妙の」は白いものにかかる枕詞です。この歌では「富士」にかかっています。</p>",
        "utamakuraMark": "<img src='../img/mark_utamakura.svg' alt='歌枕' class='shadow trigger'>",
        "utamakuraLink": "utamakura.html?lat=35.13569&amp;lng=138.69272&amp;zoom=15",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "5": {
        "number": "5",
        "name": "<ruby>猿丸太夫<rt>さるまるだゆう</rt></ruby>",
        "date": "生没年不詳",
        "source": "古今集 秋",
        "theme": "autumn",
        "first": "<ruby>奥山<rt>おくやま</rt></ruby>に<br><ruby>紅葉<rt>もみじ</rt></ruby><ruby>踏<rt>ふ</rt></ruby>み<ruby>分<rt>わ</rt></ruby>け<br><ruby>鳴<rt>な</rt></ruby>く<ruby>鹿<rt>しか</rt></ruby>の",
        "second": "<ruby>声<rt>こえ</rt></ruby><ruby>聞<rt>き</rt></ruby>く<ruby>時<rt>とき</rt></ruby>ぞ<br><ruby>秋<rt>あき</rt></ruby>はかなしき",
        "torihuda": "こゑきくと<br>きそあきは<br>かなしき",
        "eng":"Deep in the remote mountains,<br>I tread through the autumn leaves,<br>As the cry of a deer echoes.<br>When I hear that sound, autumn feels all the more sorrowful.",
        "eng_name":"Sarumaru Dayū",
        "translation": "人里離れた奥山に紅葉を踏み分け入っていくと、鹿の鳴き声が響く。その声を聞くとき、秋はひとしお悲しく感じられる。",
        "background": "古今集の詞書によると、この歌は光孝天皇の皇子・是貞親王の家の歌合で詠まれました。秋は鹿の発情期が訪れる季節。<ruby>雄鹿<rt>おじか</rt></ruby>は<ruby>雌鹿<rt>めじか</rt></ruby>を探し求めて高い声で「フィーヨー」と独特の鳴き声を上げます。この哀切な鳴き声が猿丸に秋の深まりを感じさせたようです。YouTubeに<ruby>雄鹿<rt>おじか</rt></ruby>の鳴き声を聞ける貴重な動画があります。<a href='https://youtu.be/0siOKfa8yec' target='_blank' style='color:#0047ab; text-decoration:underline; display:inline-block;' ><span style='font-weight:bold'>こちら</span></a>からぜひご覧ください。",
        "personality": "猿丸太夫は生没年や生涯は一切記録されていないため、実在していたかわからず、伝説上の歌人である可能性が指摘されています。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌には掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>"
    },
    "6": {
        "number": "6",
        "name": "<ruby>中納言家持<rt>ちゅうなごんやかもち</rt></ruby>",
        "date": "718年頃～785年",
        "source": "新古今集 冬",
        "theme": "winter",
        "first": "かささぎの<br><ruby>渡<rt>わた</rt></ruby>せる<ruby>橋<rt>はし</rt></ruby>に<br>おく<ruby>霜<rt>しも</rt></ruby>の",
        "second": "<ruby>白<rt>しろ</rt></ruby>きをみれば<br><ruby>夜<rt>よ</rt></ruby>ぞふけにける",
        "torihuda": "しろきをみ<br>れはよそふ<br>けにける",
        "eng":"The magpies' bridge across the Milky Way,<br>Frost on the palace steps gleams white,<br>Deepening the stillness of the night.",
        "eng_name":"Middle Counselor Yakamochi",
        "translation": "かささぎの群れが翼を連ねて渡したという天の川に架かる橋に霜が降りている。その冴えわたっている白さを見ると、夜が深まっていくようだ。",
        "background": "中国で生まれた七夕の伝説は奈良時代に日本に伝わったといわれています。冬の夜空に輝く天の川の煌めきを見た家持はまるで霜が降りたようだと表現しました。",
        "personality": "中納言家持（大伴家持）は、万葉集の編纂者とされています。彼は藤原氏と対立し、左遷と昇進を繰り返しながら中納言にまで昇進しました。しかし、藤原氏に藤原<ruby>種継<rt>たねつぐ</rt></ruby>暗殺と桓武天皇への謀反の嫌疑をかけられ、死後にもかかわらず官位を剥奪され、遺骨は隠岐に配流されました。それから20年後、病に臥した桓武天皇は、怨霊の祟りを恐れ、家持は恩赦され、官位が復されています。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌には掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>"
    },
    "7": {
        "number": "7",
        "name": "<ruby>阿倍仲麻呂<rt>あべのなかまろ</rt></ruby>",
        "date": "698年頃～770年",
        "source": "古今集 羇旅",
        "theme": "travel",
        "first": "<ruby>天<rt>あま</rt></ruby>の<ruby>原<rt>はら</rt></ruby><br>ふりさけみれば<br><ruby>春日<rt>かすが</rt></ruby>なる",
        "second": "<ruby>三笠<rt>みかさ</rt></ruby>の<ruby>山<rt>やま</rt></ruby>に<br><ruby>出<rt>い</rt></ruby>でし<ruby>月<rt>つき</rt></ruby>かも",
        "torihuda": "みかさのや<br>まにいでし<br>つきかも",
        "eng":"Gazing up at the distant sky, I saw the moon.<br>That moon seems the same as the one that rose over Mikasa-yama Mountain in Kasuga.",
        "eng_name":"Abe no Nakamaro",
        "translation": "遥かな大空を仰ぎ見ると月が出ていた。あの月は春日の三笠山に出ていた月と同じようだ。",
        "background": "『古今集』の詞書に「<ruby>唐土<rt>もろこし</rt></ruby>にて月を詠みける」とあります。この歌は長く唐にいた阿部仲麻呂が帰国する際、明州（現在の<ruby>寧波<rt>ニンポー</rt></ruby>市）で催された送別会で詠んだものです。三笠山では遣唐使が唐への航海の安全を祈る祭祀が行われたとされています。",
        "personality": "10代後半で留学生として遣唐使と共に唐に渡った阿部仲麻呂は、20代で科挙に合格し、要職を得て<ruby>玄宗<rt>げんそう</rt></ruby>皇帝に仕えました。優れた才能のため唐での職を離れることを許されず、50歳を過ぎてやっと帰国の途につきましたが、船が暴風雨に遭いベトナムに漂着しました。その後、長安に戻り73歳で亡くなりました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌には掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "<img src='../img/mark_utamakura.svg' alt='歌枕' class='shadow trigger'>",
        "utamakuraLink": "utamakura.html?lat=34.68176593790116&amp;lng=135.84848262599226&amp;zoom=15",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "8": {
        "number": "8",
        "name": "<ruby>喜撰法師<rt>きせんほうし</rt></ruby>",
        "date": "生没年不詳",
        "source": "古今集 雑",
        "theme": "misc",
        "first": "わが<ruby>庵<rt>いお</rt></ruby>は<br><ruby>都<rt>みやこ</rt></ruby>の<ruby>辰巳<rt>たつみ</rt></ruby><br>しかぞすむ",
        "second": "<ruby>世<rt>よ</rt></ruby>をう<ruby>ぢ<rt>じ</rt></ruby><ruby>山<rt>やま</rt></ruby>と<br><ruby>人<rt>ひと</rt></ruby>はい<ruby>ふ<rt>う</rt></ruby>なり",
        "torihuda": "よをうちや<br>まとひとは<br>いふなり",
        "eng":"In the southeast of the capital,<br>I live in tranquil peace.<br>Though some say I moved to this melancholy mountain out of sorrow for the world.",
        "eng_name":"Priest Kisen",
        "translation": "私の住まいは都の東南にあり、心静かに暮らしている。 世を憂いているから憂し山に移り住んだと噂する人がいるけれども。",
        "background": "華やかな都から離れて山で粗末な生活をする作者に対して、世間では哀れな世捨て人と噂したようです。作者はそんな世の中の評判には耳を傾けず「私は都会の喧騒から離れ、このように心静かに生活しているだけですよ」と詠んでいます。",
        "personality": "喜撰法師は、<ruby>六歌仙<rt>ろっかせん</rt></ruby>に選ばれた歌人ですが、後世に伝わる彼の歌は、この歌と万葉集に収録されたもう1首の2首のみです。このため、伝説上の人物である可能性が指摘されています。宇治山は、喜撰法師が住んでいたことにちなんで、現在では喜撰山と呼ばれています。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba.svg' alt='掛詞' class='box trigger'>",
        "kakekotobaLink": "<p>「うしやま」は「宇治山」と「憂し山」の掛詞です。一説に「しか」は「然」と「鹿」との掛詞であるといわれています。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "<img src='../img/mark_utamakura.svg' alt='歌枕' class='shadow trigger'>",
        "utamakuraLink": "utamakura.html?lat=34.89672&amp;lng=135.84769&amp;zoom=15",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "9": {
        "number": "9",
        "name": "<ruby>小野小町<rt>おののこまち</rt></ruby>",
        "date": "生没年不詳",
        "source": "古今集 春",
        "theme": "spring",
        "first": "<ruby>花<rt>はな</rt></ruby>の<ruby>色<rt>いろ</rt></ruby>は<br>うつりにけりな<br>いた<ruby>づ<rt>ず</rt></ruby>らに",
        "second": "わが<ruby>身<rt>み</rt></ruby>よにふる<br>ながめせしまに",
        "torihuda": "わかみよに<br>ふるなかめ<br>せしまに",
        "eng":"The cherry blossoms have faded in the endless rain.<br>Lost in thought, I age, my beauty and talents waning.",
        "eng_name":"Ono no Komachi",
        "translation": "美しかった桜の花は、すっかり色褪せてしまったわ。長雨が降り続いてむなしく。私も物思いに沈んでいるうちにこの世で年をとり容色や才能が衰えてしまった。",
        "background": "才色兼備の小野小町が自らの容姿、才能が衰える様子を色あせる桜に重ねて詠んだものです。",
        "personality": "小野小町の生誕は諸説ありますが<a href='11.html'>参議篁（11番）</a>の子である出羽の郡司（秋田県の郡司）小野良真の娘であるという説が有力視されています。類い稀なる美女で、日本ではクレオパトラ、楊貴妃と共に小野小町が「世界三大美人」といわれています。生没年を含め彼女の経歴はほとんど分かっていませんが、仁明天皇や文徳天皇の後宮に仕えていたと伝えられています。和歌に秀でており、技巧を凝らした歌を多く残しています。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba.svg' alt='掛詞' class='box trigger'>",
        "kakekotobaLink": "<p>「ふる」は「降る」と「経る」の掛詞です。「ながめ」は「眺め」と「長雨」の掛詞です。</p>",
        "engoMark": "<img src='../img/mark_engo.svg' alt='縁語'  class='shadow trigger'>",
        "engoLink": "<p>「降る」と「長雨」が縁語です。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "10": {
        "number": "10",
        "name": "<ruby>蝉丸<rt>せみまる</rt></ruby>",
        "date": "生没年不詳",
        "source": "後撰集 雑",
        "theme": "misc",
        "first": "これやこの<br><ruby>行<rt>ゆ</rt></ruby>くも<ruby>帰<rt>かえ</rt></ruby>るも<br>わかれては",
        "second": "しるもしらぬも<br><ruby>逢坂<rt>おうさか</rt></ruby>の<ruby>関<rt>せき</rt></ruby>",
        "torihuda": "しるもしら<br>ぬもあふさ<br>かのせき",
        "eng":"This is indeed<br>the Ausaka Barrier,<br>Where travelers part and reunite,<br>Whether known or unknown.",
        "eng_name":"Semimaru",
        "translation": "これがあの、旅立つ人も帰る人も、知っている人も知らない人も別れてはまた出会うという逢坂の関であるのだなぁ。",
        "background": "『後撰集』の詞書に「逢坂の関に庵室を作りて住み侍りけるに、行きかふ人を見て」とあります。これは、蝉丸が逢坂の関という京の都と東国を結ぶ交通の要所に小さな庵を作り、多くの人々が行き交う様子を見ていたことを表しています。この歌はリズミカルで軽やかな響きを持ちながらも「会う者は必ず別れる」という仏教の無常観に基づいて詠まれた深い意味を含んでいます。",
        "personality": "蝉丸は醍醐天皇の第四皇子でしたが、盲目であったことを理由に逢坂山に置き去りにされ、琵琶法師として生計を立てていたと言い伝えられています。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba.svg' alt='掛詞' class='box trigger'>",
        "kakekotobaLink": "<p>「逢坂」は「逢う」の掛詞です。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "<img src='../img/mark_utamakura.svg' alt='歌枕' class='shadow trigger'>",
        "utamakuraLink": "utamakura.html?lat=34.99422&amp;lng=135.85559&amp;zoom=15",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "11": {
        "number": "11",
        "name": "<ruby>参議篁<rt>さんぎたかむら</rt></ruby>",
        "date": "802年～852年",
        "source": "古今集 羇旅",
        "theme": "travel",
        "first": "わたの<ruby>原<rt>はら</rt></ruby><br><ruby>八十島<rt>やそしま</rt></ruby>かけて<br><ruby>漕<rt>こ</rt></ruby>ぎ<ruby>出<rt>い</rt></ruby>でぬと",
        "second": "<ruby>人<rt>ひと</rt></ruby>にはつげよ<br>あまのつり<ruby>舟<rt>ぶね</rt></ruby>",
        "torihuda": "ひとにはつ<br>けよあまの<br>つりふね",
        "eng":"Oh fishing boat,<br>tell them I have set sail<br>Toward the islands of the vast ocean.",
        "eng_name":"Councillor Takamura",
        "translation": "わたしが大海原の島々に向けて船出したと伝えておくれ。漁師の釣り舟よ。",
        "background": "『古今集』の詞書に「隠岐の国に流されける時に、舟に乗りて出でたつとて、京なる人のもとに遣はしける」とあります。この歌は隠岐に島流しされることになった篁が京の都に残した家族に向けて詠んだものです。",
        "personality": "参議篁の本名は小野篁で、<a href='9.html'>小野小町（9番）</a>の祖父にあたります。彼は遣唐副使として唐に向かう途中、上官から漏水した船と交換するように命じられましたが、これを拒否しました。さらに遣唐使の無能さを批判する漢詩『<ruby>西道謡<rt>さいどうよう</rt></ruby>』を作ったことで嵯峨上皇の怒りを買い、隠岐に配流され、厳しい生活を送りました。2年後には恩赦を受けて都に戻り、官職に復帰しています。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "12": {
        "number": "12",
        "name": "<ruby>僧正遍昭<rt>そうじょうへんじょう</rt></ruby>",
        "date": "816年～890年",
        "source": "古今集 雑",
        "theme": "misc",
        "first": "<ruby>天<rt>あま</rt></ruby>つ<ruby>風<rt>かぜ</rt></ruby><br><ruby>雲<rt>くも</rt></ruby>のかよ<ruby>ひ<rt>い</rt></ruby><ruby>路<rt>じ</rt></ruby><br><ruby>吹<rt>ふ</rt></ruby>きと<ruby>ぢ<rt>じ</rt></ruby>よ",
        "second": "をとめの<ruby>姿<rt>すがた</rt></ruby><br>しばしとどめ<ruby>む<rt>ん</rt></ruby>",
        "torihuda": "をとめのす<br>かたしはし<br>ととめむ",
        "eng":"Oh Wind,<br>close the cloud path of celestial maidens,<br>Let the dancers stay<br>a while longer.",
        "eng_name":"High Priest Henjō",
        "translation": "空吹く風よ。天女が帰る雲の通り道を吹き閉じておくれ。舞姫たちをもうしばらくとどめておきたい。",
        "background": "『古今集』の詞書に「<ruby>五節<rt>ごせち</rt></ruby>の<ruby>舞姫<rt>まいひめ</rt></ruby>を見てよめる」とあります。この歌は、「<ruby>五節<rt>ごせち</rt></ruby>の<ruby>舞<rt>まい</rt></ruby>」を見た遍照が舞姫たちを天女に見立てて詠んだものです。詠まれた時期は出家前の若き宮廷人だった頃だと考えられています。",
        "personality": "僧正遍昭は桓武天皇の孫で、本名は<ruby>良岑宗貞<rt>よしみねのむねさだ</rt></ruby>といいます。仁明天皇に<ruby>蔵人頭<rt>くろうどのとう</rt></ruby>として仕えていましたが、仁明天皇が急逝され、喪に服す<ruby>諒闇<rt>りょうあん</rt></ruby>という期間が終わると、同僚たちは喪が明けたことを喜びました。その様子を見た作者は世の無常を感じ、出家を決意したといわれています。後に僧の最高位「僧正」の地位に就きました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "13": {
        "number": "13",
        "name": "<ruby>陽成院<rt>ようぜいいん</rt></ruby>",
        "date": "868年～949年",
        "source": "後撰集 恋",
        "theme": "love",
        "first": "<ruby>筑波嶺<rt>つくばね</rt></ruby>の<br><ruby>峰<rt>みね</rt></ruby>より<ruby>落<rt>お</rt></ruby>つる<br>みなの<ruby>川<rt>がわ</rt></ruby>",
        "second": "こひぞつもりて<br><ruby>淵<rt>ふち</rt></ruby>となりぬる",
        "torihuda": "こひそつも<br>りてふちと<br>なりぬる",
        "eng":"From Tsukuba's peak,<br>the Minano-gawa River flows,<br>Love for you deepens<br>like a pool's repose.",
        "eng_name":"Retired Emperor Yōzei",
        "translation": "筑波山から流れ落ちるみなの川。一滴の雫が集まって川となり淵に溜まるようにあなたへの愛がどんどん大きくなり、淵のように深くなりました。",
        "background": "『後撰集』の詞書に「釣殿の皇女につかはしける」とあり、この歌は陽成院が光孝天皇の娘の<ruby>綏子<rt>すいし</rt></ruby>内親王（釣殿の皇女）に贈られ、2人は結婚しています。筑波山は、東の峰を女体山、西の峰を男体山と呼ばれており、恋情を表す歌に多く引用されています。",
        "personality": "陽成院は9歳で天皇に即位したものの、精神の病気を理由に17歳で譲位を余儀なくされました。藤原<ruby>基経<rt>もとつね</rt></ruby>の画策によって、譲位させられたのではないかといわれています。譲位後は60年余り上皇の座にありました。上皇としては、歴代で最も長く在位しました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba.svg' alt='掛詞' class='box trigger'>",
        "kakekotobaLink": "<p>『小倉百首評釈 : 英独対訳』という書籍において「「こひ」は水の古語又「戀」の義に亘れり。」と説明されています。つまり「こひ」は「水」と「恋」の掛詞になっていると考えられます。<br><small>（参考図書：佐藤重治 (芝峰) 著『小倉百首評釈 : 英独対訳』,本郷書院,明37.12. <br>国立国会図書館デジタルコレクション https://dl.ndl.go.jp/pid/872971）</small></p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba.svg' alt='序詞' class='shadow trigger'>",
        "jokotobaLink": "<p>「筑波嶺の 峰より落つる みなの川」が序詞です。<br>「こひ」にかかっています。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "<img src='../img/mark_utamakura.svg' alt='歌枕' class='shadow trigger'>",
        "utamakuraLink": "utamakura.html?lat=36.22537&lng=140.10749&zoom=20",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "14": {
        "number": "14",
        "name": "<ruby>河原左大臣<rt>かわらのさだいじん</rt></ruby>",
        "date": "822年～895年",
        "source": "古今集 恋",
        "theme": "love",
        "kotobagaki":"題知らず",
        "first": "<ruby>陸奥<rt>みちのく</rt></ruby>の<br>しのぶも<ruby>ぢ<rt>じ</rt></ruby>ずり<br><ruby>誰<rt>たれ</rt></ruby>ゆ<ruby>ゑ<rt>え</rt></ruby>に",
        "second": "<ruby>乱<rt>みだ</rt></ruby>れそめにし<br><ruby>我<rt>われ</rt></ruby>ならなくに",
        "torihuda": "みたれそめ<br>にしわれな<br>らなくに",
        "eng":"I feel my mind is<br>as disordered as<br>the shinobu-mojizuri patterns<br>produced in Mutsu.<br>but it's not my fault.",
        "eng_name":"Minister of the Left of Kawara",
        "translation": "私の心は陸奥産のしのぶもぢずりの乱れ模様のように乱れてしまった。私のせいではありませんよ。",
        "background": "この歌は、恋人への思いを抑えきれずに、乱れた気持ちを染め物の乱れ模様に例えています。",
        "personality": "河原左大臣こと<ruby>源融<rt>みなと とおる</rt></ruby>は、嵯峨天皇の皇子でしたが、<ruby>臣籍降下<rt>しんせきこうか</rt></ruby>し、皇族から臣下になりました。陽成院が退位したときは、天皇に自薦しましたが、藤原基経によって阻止されました。この失意から、融は次第に政治から身を引くようになり、京都の六条に河原院という豪華な邸宅を建て、道楽でわざわざ海水を運ばせて塩造りをしていました。その豪奢な生活ぶりから、紫式部が著した『源氏物語』の主人公「光源氏」のモデルになったといわれています。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba.svg' alt='序詞' class='shadow trigger'>",
        "jokotobaLink": "<p>「陸奥の しのぶもぢずり」が序詞です。<br>比喩表現で「乱れ」を修飾しています。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "<img src='../img/mark_utamakura.svg' alt='歌枕' class='shadow trigger'>",
        "utamakuraLink": "utamakura.html?lat=37.77101&amp;lng=140.51424&amp;zoom=20",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "15": {
        "number": "15",
        "name": "<ruby>光孝天皇<rt>こうこうてんのう</rt></ruby>",
        "date": "830年～887年",
        "source": "古今集 春",
        "theme": "spring",
        "first": "<ruby>君<rt>きみ</rt></ruby>がため<br><ruby>春<rt>はる</rt></ruby>の<ruby>野<rt>の</rt></ruby>に<ruby>出<rt>い</rt></ruby>でて<br><ruby>若菜<rt>わかな</rt></ruby>つむ",
        "second": "わが<ruby>衣手<rt>ころもで</rt></ruby>に<br><ruby>雪<rt>ゆき</rt></ruby>は<ruby>降<rt>ふ</rt></ruby>りつつ",
        "torihuda": "わかころも<br>てにゆきは<br>ふりつつ",
        "eng":"I gather young greens<br>in the cold spring field<br>for you,<br>Snow falling softly on my sleeves.",
        "eng_name":"Emperor Kōkō",
        "translation": "あなたのために寒い春の野に出て、袖に雪がしんしんと降り続く中で若菜を摘んでいます。",
        "background": "『古今集』の詞書に「仁和の帝、皇子におはしましける時、人に若菜たまひける御歌」とあり、この歌は光孝天皇が皇太子のときに誰かに若菜を贈られる際に添えられたものです。",
        "personality": "光孝天皇は<a href='13.html'>陽成院（13番）</a>が譲位したときに藤原<ruby>基経<rt>もとつね</rt></ruby>の画策によって、55歳のときに天皇に即位しました。政治を藤原基経に任せたことから、光孝天皇の代から摂関政治が始まったといわれています。光孝天皇は日本三大実録に「謙恭和潤、慈仁寛曠。」と評されており、謙虚で和やかで潤いがあるお人柄で、人に対して情け深く心が広い方だったと伝えられています。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "16": {
        "number": "16",
        "name": "<ruby>中納言行平<rt>ちゅうなごんゆきひら</rt></ruby>",
        "date": "818年～893年",
        "source": "古今集 離別",
        "theme": "farewell",
        "kotobagaki":"題しらず",
        "first": "<ruby>立<rt>た</rt></ruby>ち<ruby>別<rt>わか</rt></ruby>れ<br>いなばの<ruby>山<rt>やま</rt></ruby>の<br><ruby>峰<rt>みね</rt></ruby>に<ruby>生<rt>お</rt></ruby><ruby>ふ<rt>う</rt></ruby>る",
        "second": "まつとし<ruby>聞<rt>き</rt></ruby>かば<br><ruby>今<rt>いま</rt></ruby><ruby>帰<rt>かえ</rt></ruby>りこ<ruby>む<rt>ん</rt></ruby>",
        "torihuda": "まつとしき<br>かはいまか<br>へりこむ",
        "eng":"If you promise to wait for me like the pines on Mount Inaba,<br>I'll return to you in an instant.",
        "eng_name":"Middle Counselor Yukihira ",
        "translation": "因幡山に生えている松のようにあなたが待っていてくれると言ってくれたらすぐに戻ってきます。",
        "background": "この歌は、<ruby>因幡守<rt>いなばのかみ</rt></ruby>を任ぜられて、京から赴任地へ向かう際に、見送りに来てくれた人たちに対して詠まれたといわれています。ところで、この歌はペットを失ったときに戸口に掲げると、ペットが戻ってくるというおまじないとしても知られています。歌に込められた深い愛情と再会への強い希望がペットに伝わるのかもしれません。",
        "personality": "行平は、平城上皇の皇子・<ruby>阿保<rt>あぼ</rt></ruby>親王の第二子で<a href='17.html'>在原業平（17番）</a>の異母兄です。官僚としても有能で播磨守や信濃守、蔵人頭、太宰権帥などを経て中納言にまで昇り詰めました。63歳のときに在原氏の学問所として奨学院を設立。教育家としても熱心でした。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba.svg' alt='掛詞' class='box trigger'>",
        "kakekotobaLink": "「まつ」は「松」と「待つ」の掛詞です。",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "<img src='../img/mark_utamakura.svg' alt='歌枕' class='shadow trigger'>",
        "utamakuraLink": "utamakura.html?lat=35.475068831090105&lng=134.26616273373548&zoom=15",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "17": {
        "number": "17",
        "name": "<ruby>在原業平朝臣<rt>ありわらのなりひらあそん</rt></ruby>",
        "date": "825年～880年",
        "source": "古今集 秋",
        "theme": "autumn",
        "kotobagaki":"二条の后の春宮の御息所と申しける時に、御屏風に龍田川に紅葉流れたる形を描きけるを",
        "first": "ちはやぶる<br><ruby>神代<rt>かみよ</rt></ruby>もきかず<br><ruby>竜田川<rt>たつたがわ</rt></ruby>",
        "second": "から<ruby>紅<rt>くれない</rt></ruby>に<br><ruby>水<rt>みず</rt></ruby>くくるとは",
        "torihuda": "からくれな<br>ゐにみつく<br>くるとは",
        "eng":"Was there ever such beauty even in the realm of myths?<br>Autumn leaves dye the Tatsuta-gawa river a deep vermilion.",
        "eng_name":"Ariwara no Narihira Ason",
        "translation": "神話の世界でもこんなに美しい景色はあったであろうか。紅葉が竜田川を唐紅色に絞り染め上げているよ。",
        "background": "この歌は、藤原高子に招かれた在原業平が竜田川に紅葉が流れる屏風を前にして詠んだといわれています。以前は恋人どうしだった2人でしたが、この歌を詠んだとき、藤原高子は清和天皇の<ruby>女御<rt>にょうご</rt></ruby>になり、身分が異なる状況でした。在原業平は直接伝えられない想いをこの歌に託したと考えられています。",
        "personality": "業平は『日本三代実録』で「体貌閑麗 放縦不拘 略無才学 善作倭歌」とあり、見目麗しく、自由奔放、漢学の造詣は深くないが、和歌に秀でていたと評されています。『伊勢物語』の主人公のモデルと目されています。元皇族ですが、臣籍降下して蔵人の頭として活躍しました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba.svg' alt='枕詞' class='trigger'>",
        "makurakotobaLink": "「ちはやぶる」は「神」や「宇治」にかかる枕詞です。",
        "utamakuraMark": "<img src='../img/mark_utamakura.svg' alt='歌枕' class='shadow trigger'>",
        "utamakuraLink": "utamakura.html?lat=34.60569500944204&lng=135.71797796638276&zoom=15",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "18": {
        "number": "18",
        "name": "<ruby>藤原敏行朝臣<rt>ふじわらのとしゆきあそん</rt></ruby>",
        "date": "生年不詳～901年頃",
        "source": "古今集 恋",
        "theme": "love",
        "kotobagaki":"寛平の御時后の宮歌合の歌",
        "first": "<ruby>住<rt>すみ</rt></ruby>の<ruby>江<rt>え</rt></ruby>の<br><ruby>岸<rt>きし</rt></ruby>による<ruby>波<rt>なみ</rt></ruby><br>よるさ<ruby>へ<rt>え</rt></ruby>や",
        "second": "<ruby>夢<rt>ゆめ</rt></ruby>のかよひ<ruby>路<rt>じ</rt></ruby><br><ruby>人目<rt>ひとめ</rt></ruby>よくら<ruby>む<rt>ん</rt></ruby>",
        "torihuda": "ゆめのかよ<br>ひちひとめ<br>よくらむ",
        "eng":"Though the waves crash upon the Suminoe shore,<br>Why do you not appear, not only in daylight but also in the secret paths of my nighttime dreams?",
        "eng_name":"Fujiwara no Toshiyuki Ason",
        "translation": "波は住之江の岸に打ち寄せるけれども、あなたは昼間だけでなく、そのうえ夜の夢の通い道さえ人目を避けて、現れてくれないのでしょうか。",
        "background": "この歌は、恋人を待つ女性の立場で詠まれた歌で、せめて夢の中だけでも会いたいという内容です。中世の人々にとって夢は特別で、恋人が夢に出てこないのは、自分のことを想ってくれていないからだと考える人が多かったようです。",
        "personality": "藤原敏行は歌人だけでなく書家としても有名な人物でした。人に頼まれて多くの法華経の書写をしていましたが、魚を食べたり、女性と関係を持ったり、不浄の身のまま書写したため、地獄に落ちてしまったという逸話が『宇治拾遺物語』に描かれています。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba.svg' alt='序詞' class='shadow trigger'>",
        "jokotobaLink": "<p>「住の江の 岸による波」が序詞です。<br>「よるさへや」の「よる」にかかって、同じ音を繰り返しています。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "<img src='../img/mark_utamakura.svg' alt='歌枕' class='shadow trigger'>",
        "utamakuraLink": "utamakura.html?lat=34.61239&lng=135.49376&zoom=15",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "19": {
        "number": "19",
        "name": "<ruby>伊勢<rt>いせ</rt></ruby>",
        "date": "生没年不詳",
        "source": "新古今集 恋",
        "theme": "love",
        "first": "<ruby>難波潟<rt>なにわがた</rt></ruby><br>みじかき<ruby>葦<rt>あし</rt></ruby>の<br>ふしのまも",
        "second": "<ruby>逢<rt>あ</rt></ruby><ruby>は<rt>わ</rt></ruby>でこの<ruby>世<rt>よ</rt></ruby>を<br><ruby>過<rt>す</rt></ruby>ぐしてよとや",
        "torihuda": "あはてこの<br>よをすくし<br>てよとや",
        "eng":"Is it your wish never to meet, not even for the briefest moments as short as the joints between the reed in Naniwa Bay?",
        "eng_name":"Ise",
        "translation": "難波潟に生えている葦の節と節の間のような短い時間さえ会いたいのにあの人は一生会わずに過ごせと言うのですか。",
        "background": "『伊勢集』の詞書に「秋ごろ、うたて人の物言ひけるに」（現代語訳：秋ごろ、不愉快なことにある人が何かを言った時に）と書かれています。この歌は、かつて恋人だった仲平と破局したときの伊勢の心情を表した歌になっています。",
        "personality": "伊勢は古今集時代を代表する歌人で、恋多き女性です。藤原仲平と別れた後は宇多天皇との間に皇子を産んだことから「伊勢の<ruby>御息所<rt>みやすどころ</rt></ruby>」と呼ばれました。また、宇多天皇の皇子である<ruby>敦慶<rt>あつよし</rt></ruby>親王との間には、歌人・中務をもうけました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba.svg' alt='掛詞' class='box trigger'>",
        "kakekotobaLink": "「ふしのま」は「節の間」と「わずかな時間」の掛詞です。",
        "engoMark": "<img src='../img/mark_engo.svg' alt='縁語'  class='shadow trigger'>",
        "engoLink": "<p>「葦」と「節」は縁語です。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba.svg' alt='序詞' class='shadow trigger'>",
        "jokotobaLink": "<p>「難波潟 みじかき葦の」が序詞です。<br>比喩表現で「ふし」を修飾しています。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "<img src='../img/mark_utamakura.svg' alt='歌枕' class='shadow trigger'>",
        "utamakuraLink": "utamakura.html?lat=34.73260027715697&lng=135.5289405219532&zoom=15",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "20": {
        "number": "20",
        "name": "<ruby>元良親王<rt>もとよししんのう</rt></ruby>",
        "date": "890年～943年",
        "source": "後撰集 恋",
        "theme": "love",
        "kotobagaki":"事いできて後に、京極御息所につかはしける",
        "first": "わびぬれば<br>いまはたおなじ<br><ruby>難波<rt>なにわ</rt></ruby>なる",
        "second": "みをつくしても<br><ruby>逢<rt>あ</rt></ruby><ruby>は<rt>わ</rt></ruby><ruby>む<rt>ん</rt></ruby>とぞ<ruby>思<rt>おも</rt></ruby><ruby>ふ<rt>う</rt></ruby>",
        "torihuda": "みをつくし<br>てもあはむ<br>とそおもふ",
        "eng":"Unable to meet, the pain of separation feels like the same with my death. I'd rather to be a Miotsukushi to ruin myself unless I see my beloved.",
        "eng_name":"Prince Motoyoshi",
        "translation": "会えなくなって、もがき苦しんでいるの今となってはもはや身を捨てたのも同じことです。<br>いっそ難波の海にある澪漂のように身を滅ぼしてもあなたに会いたい。",
        "background": "後撰集の詞書に「事いできて後に、京極<ruby>御息所<rt>みやすどころ</rt></ruby>につかはしける」とあります。元良親王は宇多法皇の妃・藤原<ruby>褒子<rt>ほうし</rt></ruby>との関係が世間の噂にのぼった後、彼女にこの歌を贈りました。",
        "personality": "元良親王は父の陽成天皇が天皇譲位後に誕生。毎晩のように女性を取っ替え引っ替えしていたようで「一夜めぐりの君」というあだ名を付けられていました。その好色ぶりからか『源氏物語』の光源氏のモデルの一人ともいわれています。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba.svg' alt='掛詞' class='box trigger'>",
        "kakekotobaLink": "<p>「みをつくし」は「身を尽くし」と「澪標」の掛詞です。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "21": {
        "number": "21",
        "name": "<ruby>素性法師<rt>そせいほうし</rt></ruby>",
        "date": "生没年不詳",
        "source": "古今集 恋",
        "theme": "love",
        "first": "<ruby>今<rt>いま</rt></ruby>こ<ruby>む<rt>ん</rt></ruby>と<br>い<ruby>ひ<rt>い</rt></ruby>しばかりに<br><ruby>長月<rt>ながつき</rt></ruby>の",
        "second": "<ruby>有明<rt>ありあけ</rt></ruby>の<ruby>月<rt>つき</rt></ruby>を<br><ruby>待<rt>ま</rt></ruby>ち<ruby>出<rt>い</rt></ruby>でつるかな",
        "torihuda": "ありあけの<br>つきをまち<br><span class='mojikan'>いてつるかな</span>",
        "eng":"Since you told me to come now, I waited,<br>And now I find myself waiting through the September dawn under the moonlight.",
        "eng_name":"Priest Sosei",
        "translation": "今行くとあなたが言うので待っていたら、とうとう9月の有明の月を待ち明かすことになりましたよ。",
        "background": "この歌は女性の立場で詠まれています。長月は太陰暦の9月であるため、晩秋にあたります。待っていた期間について解釈が分かます。1つは「一晩中待ち続けた」と解釈するもので、もう1つは「気づいたら何か月も待っていた」という解釈です。百人一首の編纂者・藤原定家は古今和歌集の注釈書『<ruby>顕注<rt>けんちゅう</rt></ruby><ruby>密勘<rt>みっかん</rt></ruby>』で何カ月も待っていたと物語を感じさせる解釈をしています。",
        "personality": "素性法師は、桓武天皇のひ孫で、<a href='12.html'>僧正遍昭（12番）</a>の息子として生まれました。父は仁明天皇が崩御したときに出家しますが、同じ時期に父の勧めを受けて若くして出家しました。出家後も宮廷の歌会で活躍しています。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "22": {
        "number": "22",
        "name": "<ruby>文屋康秀<rt>ふんやのやすひで</rt></ruby>",
        "date": "生没年不詳",
        "source": "古今集 秋",
        "theme": "autumn",
        "first": "<ruby>吹<rt>ふ</rt></ruby>くからに<br><ruby>秋<rt>あき</rt></ruby>の<ruby>草木<rt>くさき</rt></ruby>の<br>しをるれば",
        "second": "むべ<ruby>山風<rt>やまかぜ</rt></ruby>を<br><ruby>嵐<rt>あらし</rt></ruby>とい<ruby>ふ<rt>う</rt></ruby>ら<ruby>む<rt>ん</rt></ruby>",
        "torihuda": "むへやまか<br>せをあらし<br>といふらむ",
        "eng":"Indeed, when the wind blows from the mountains, autumnal plants wither.<br>That's why the combination of \"mountain\" and \"wind\" is read as \"storm\" in Chinese character.",
        "eng_name":"Fun'ya no Yasuhide",
        "translation": "山から風が吹くと秋の草木はしおれます。なるほど、だから「山」に「風」と書いて嵐と読むのでしょう。",
        "background": "平安時代ではこの歌のような言葉遊びが流行していたようです。「嵐」は現在では暴風雨のことを指しますが、当時は、山から吹き下ろす風のことを嵐と呼んでいました。",
        "personality": "文屋康秀は、<a href='37.html'>文屋朝康（37番）</a>の父で、<ruby>六歌仙<rt>ろっかせん</rt></ruby>に名前を連ねています。同じく六歌仙の小野小町と親交があり、三河掾として三河国に赴任する際に、小野小町に一緒に来てほしいと誘った逸話が残っています。小野小町は「わびぬれば 身を浮草の 根を絶えて 誘う水あらば いなむとぞ思ふ」と返歌していますが、実際に一緒に行ったかはわかっていません。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba.svg' alt='掛詞' class='box trigger'>",
        "kakekotobaLink": "<p>「嵐」は「荒し」の掛詞です。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "23": {
        "number": "23",
        "name": "<ruby>大江千里<rt>おおえのちさと</rt></ruby>",
        "date": "生没年不詳",
        "source": "古今集 秋",
        "theme": "autumn",
        "first": "<ruby>月<rt>つき</rt></ruby>みれば<br>ちぢにものこそ<br><ruby>悲<rt>かな</rt></ruby>しけれ",
        "second": "わが<ruby>身<rt>み</rt></ruby><ruby>一<rt>ひと</rt></ruby>つの<br><ruby>秋<rt>あき</rt></ruby>にはあらねど",
        "torihuda": "わかみひと<br>つのあきに<br>はあらねと",
        "eng":"When I look at the moon, various feelings of sadness overwhelm me.<br>Autumn has not come upon only me.",
        "eng_name":"Ōe no Chisato",
        "translation": "月を見るとあれこれと悲しくなります。私ひとりだけに訪れた秋ではないのですが。",
        "background": "この歌は、白居易の『<ruby>白氏文集<rt>はくしもんじゅう</rt></ruby>』の詩<a href='#enshirou'>『<ruby>燕<rt>えん</rt></ruby><ruby>子<rt>し</rt></ruby><ruby>楼<rt>ろう</rt></ruby>』</a>の一節を題材に作られました。「ちぢに」の「千」、「私ひとり」の「一」という数字の大小を対応させており、漢詩特有の対句の技法を和歌に応用しています。",
        "personality": "大江千里は、参議・大江音人の子で、学者の家系に生まれました。<ruby>文章博士<rt>もんじょうはかせ</rt></ruby>で、漢籍に詳しく、和歌にも秀でていました。漢詩句を題材に和歌を詠んだ『<ruby>句題<rt>くだい</rt></ruby><ruby>和歌<rt>わか</rt></ruby>』を894年に宇多天皇に献上しています。ちょうど菅原道真が遣唐使廃止を建議した年でした。漢詩から和歌に移行しようとする時代を象徴する人物と言えそうです。官位は兵部大丞で従六位上相当で微官に終わりました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "24": {
        "number": "24",
        "name": "<ruby>菅家<rt>かんけ</rt></ruby>",
        "date": "845年～903年",
        "source": "古今集 羇旅",
        "theme": "travel",
        "first": "このたびは<br><ruby>幣<rt>ぬさ</rt></ruby>もとりあ<ruby>へ<rt>え</rt></ruby>ず<br><ruby>手向山<rt>たむけやま</rt></ruby>",
        "second": "もみぢのにしき<br><ruby>神<rt>かみ</rt></ruby>のまにまに",
        "torihuda": "もみちのに<br>しきかみの<br>まにまに",
        "eng":"Sudden journey,<br>I forgot to bring offering,<br>So I will put aside autumn leaves brocades.<br>May you accept them instead.",
        "eng_name":"Kanke",
        "translation": "今回の旅は急のことで、幣をご用意できませんでした。神が祀られている山の美しい紅葉を捧げるので、御心のままにお受け取りください。",
        "background": "この歌は、宇多上皇の御幸のときに詠まれた歌です。当時は道祖神（お地蔵様）にお参りする際に「幣」と呼ばれる紙や麻などを細く切って垂らしたものを捧げていましたが、幣を用意していなかったので、機転を利かせてきれいな紅葉を捧げたという歌です。",
        "personality": "菅家は現在では学問の神様として親しまれている菅原道真のことです。幼少期から文才に優れ、和歌や漢詩に才能を発揮し、学者出身ながら右大臣にまで出世しました。しかし、藤原時平の陰謀により、大宰府に左遷され、衣食住に窮し、その2年後に亡くなりました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba.svg' alt='掛詞' class='box trigger'>",
        "kakekotobaLink": "<p>「たび」は「度」と「旅」の掛詞です。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "25": {
        "number": "25",
        "name": "<ruby>三条右大臣<rt>さんじょうのうだいじん</rt></ruby>",
        "date": "873年～932年",
        "source": "後撰集 恋",
        "theme": "love",
        "first": "<ruby>名<rt>な</rt></ruby>にし<ruby>負<rt>お</rt></ruby>はば<br><ruby>逢坂山<rt>おうさかやま</rt></ruby>の<br>さねか<ruby>づ<rt>ず</rt></ruby>ら",
        "second": "<ruby>人<rt>ひと</rt></ruby>にしられで<br>くるよしもがな",
        "torihuda": "ひとにしら<br>れてくるよ<br>しもかな",
        "eng":"If the name \"Sane Kazura\" of Mount Ausaka-yama holds true,<br>I wish I could entwine my beloved in its vines, pull close, and meet in secret.",
        "eng_name":"Minister of the Right of Sanjō",
        "translation": "逢坂山の「さねかずら」。その名前どおりであるならば、さねかずらのつるにあなたを絡ませて手繰り寄せ、人に知られないで逢瀬できたらいいのにと思う。",
        "background": "歌に登場する「さねかずら」は「さ寝」と掛けており、一緒に夜を過ごしたいという想いが込められています。<br class='br-pc'>作者は右大臣と身分が非常に高かったので、こっそり恋人に逢いたい気持ちを歌に詠んだのかもしれません。<br class='br-pc'>歌は逢瀬の翌朝に恋人に贈られたものです。",
        "personality": "三条右大臣（藤原定方）は、<a href='44.html'>中納言朝忠（44番）</a>の父です。三条に邸宅があり、右大臣であったことから三条右大臣と呼ばれました。彼は天皇の外戚であり、右大臣にまで出世した人物です。紀貫之や凡河内躬恒の才能を認め、彼らの作家活動を支援しました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba.svg' alt='掛詞' class='box trigger'>",
        "kakekotobaLink": "「逢坂」は「逢う」との掛詞、<br>「さねかずら」は「さ寝」との掛詞、<br>「来る」は「繰る」の掛詞です。",
        "engoMark": "<img src='../img/mark_engo.svg' alt='縁語'  class='shadow trigger'>",
        "engoLink": "「さ寝」と「逢う」は縁語です。<br>「さねかずら」と「繰る」は縁語です。",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "26": {
        "number": "26",
        "name": "<ruby>貞信公<rt>ていしんこう</rt></ruby>",
        "date": "880年～949年",
        "source": "拾遺集 雑秋",
        "theme": "autumn",
        "first": "<ruby>小倉山<rt>おぐらやま</rt></ruby><br><ruby>峰<rt>みね</rt></ruby>のもみ<ruby>ぢ<rt>じ</rt></ruby><ruby>葉<rt>は</rt></ruby><br><ruby>心<rt>こころ</rt></ruby>あらば",
        "second": "<ruby>今<rt>いま</rt></ruby>ひとたびの<br>みゆき<ruby>待<rt>ま</rt></ruby>たな<ruby>む<rt>ん</rt></ruby>",
        "torihuda": "いまひとた<br>ひのみゆき<br>またなむ",
        "eng":"Oh autumn leaves<br>of Mount Ogura-yama,<br>If your heart permits, please wait without scattering until the emperor's pilgrimage.",
        "eng_name":"Teishin-kō",
        "translation": "小倉山のもみぢ葉よ。心あらばもう一度の行幸まで散らずに待っていてほしい。",
        "background": "小倉山の紅葉に感動した亭子院（宇多上皇）が皇子の醍醐天皇にも見せたいとおっしゃったときに随行していた貞信公が詠んだ歌です。",
        "personality": "貞信公（藤原忠平）は、藤原基経の末子として生まれ、朱雀天皇の摂政を務めた後、関白に就任して藤原氏の栄華を築く一翼を担いました。その人柄は温厚であり、また兄の藤原時平によって大宰府に流された菅原道真とも親交が深く、最期まで交流が続いたと伝えられています。彼は藤原氏の家格向上や政治の安定に寄与し、その功績から「貞信公」と<ruby>諡号<rt>しごう</rt></ruby>されました。<a href='45.html'>謙徳公（45番）</a>の祖父です。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "<img src='../img/mark_utamakura.svg' alt='歌枕' class='shadow trigger'>",
        "utamakuraLink": "utamakura.html?lat=35.02361224973831&lng=135.65914892027368&zoom=15",
        "honkadoriMark": "<img src='../img/mark_honkadori.svg' alt='本歌取り' class='shadow trigger'>",
        "honkadoriLink": "<p>吉野山 岸の紅葉し 心あらば<br>まれのみゆきを 色かへて待て</p><div style='display: flex; justify-content: flex-end;'><small>古今六帖　藤原忠房</small></div>",
    },
    "27": {
        "number": "27",
        "name": "<ruby>中納言兼輔<rt>ちゅうなごんかねすけ</rt></ruby>",
        "date": "877年～933年",
        "source": "新古今集 恋",
        "theme": "love",
        "first": "みかの<ruby>原<rt>はら</rt></ruby><br>わきて<ruby>流<rt>なが</rt></ruby>るる<br>い<ruby>づ<rt>ず</rt></ruby>み<ruby>川<rt>がわ</rt></ruby>",
        "second": "いつ<ruby>見<rt>み</rt></ruby>きとてか<br><ruby>恋<rt>こい</rt></ruby>しかるら<ruby>む<rt>ん</rt></ruby>",
        "torihuda": "いつみきと<br>てかこひし<br>かるらむ",
        "eng":"The Izumi-gawa river springs and flows to divide the Mikanohara.<br>Why do I miss you so much, whom I have not yet seen?",
        "eng_name":"Middle Counselor Kanesuke",
        "translation": "みかの原を分けるように湧き出て流れるいづみ川。あなたにいつお会いしたからといってこれほどまでに恋しいのでしょう。",
        "background": "「会ったことのない女性に恋をする」という恋愛は、現代では考えにくいですが、平安時代では男女が顔を合わせる機会が限られていたため、垣間見することはあったようですが、噂や評判を聞くだけで恋に落ちることは珍しくなかったようです。「みかの原」は京都府南部を流れる木津川の北岸辺り。いづみ川は木津川のことです。",
        "personality": "中納言兼輔（藤原兼輔）は、<a href='57.html'>紫式部（57番）</a>の曾祖父です。紀貫之や凡河内躬恒の才能を認め、彼らの作家活動を支援しました。賀茂川堤の近くに邸宅を構えたため「<ruby>堤中納言<rt>つつみのちゅうなごん</rt></ruby>」と呼ばれました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba.svg' alt='掛詞' class='box trigger'>",
        "kakekotobaLink": "「わき」は「湧き」と「分き」の掛詞です。",
        "engoMark": "<img src='../img/mark_engo.svg' alt='縁語'  class='shadow trigger'>",
        "engoLink": "「湧き」と「泉」が縁語です。",
        "jokotobaMark": "<img src='../img/mark_jokotoba.svg' alt='序詞' class='shadow trigger'>",
        "jokotobaLink": "「みかの原 わきて流るる いづみ川」が序詞です。「いつ見」にかかって同じ音を繰り返しています。",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "<img src='../img/mark_utamakura.svg' alt='歌枕' class='shadow trigger'>",
        "utamakuraLink": "utamakura.html?lat=34.75938&lng=135.87191&zoom=15",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "28": {
        "number": "28",
        "name": "<ruby>源宗于朝臣<rt>みなもとのむねゆきあそん</rt></ruby>",
        "date": "生年不詳～939年",
        "source": "古今集 冬",
        "theme": "winter",
        "first": "<ruby>山里<rt>やまざと</rt></ruby>は<br><ruby>冬<rt>ふゆ</rt></ruby>ぞさびしさ<br>まさりける",
        "second": "<ruby>人目<rt>ひとめ</rt></ruby>も<ruby>草<rt>くさ</rt></ruby>も<br>かれぬと<ruby>思<rt>おも</rt></ruby><ruby>へ<rt>え</rt></ruby>ば",
        "torihuda": "ひとめもく<br>さもかれぬ<br>とおもへは",
        "eng":"The mountain village is lonely, especially in winter,<br>When it grows even quieter.<br>No visitors come, and the plants wither away.",
        "eng_name":"Minamoto no Muneyuki Ason",
        "translation": "山里は寂しいものですが、冬は一段と寂しい。訪れてくれる人もいないし、草木も枯れてしまうと思うと。",
        "background": "作者は出世しない身の上を嘆いていていたことが知られており、寂しい山里にわが身を重ねていたようです。一方で、貴族の間では、山里に別荘を持つことが流行していたので、山里の寂寥感をあえて楽しんでいたということも考えられると思います。",
        "personality": "源宗于は光孝天皇の孫です。皇族として生まれながらも<ruby>臣籍降下<rt>しんせきこうか</rt></ruby>して朝廷に仕えました。宇多天皇に和歌を献上し、その才能を認められましたが、官位には恵まれなかったといわれています。皇族でも平安時代は一夫多妻制だったため、子供が多く、孫になると特別扱いされなかったようです。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba.svg' alt='掛詞' class='box trigger'>",
        "kakekotobaLink": "「かれ」は「枯れ」と「離れ」の掛詞です。",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori.svg' alt='本歌取り' class='shadow trigger'>",
        "honkadoriLink": "<p>秋くれば 虫とともにぞ なかれぬる<br>人も草葉も 秋くれば</p><div style='display: flex; justify-content: flex-end;'><small>藤原興風</small></div>",
    },
    "29": {
        "number": "29",
        "name": "<ruby>凡河内躬恒<rt>おおしこうちのみつね</rt></ruby>",
        "date": "生没年不詳",
        "source": "古今集 秋",
        "theme": "autumn",
        "first": "<ruby>心当<rt>こころあ</rt></ruby>てに<br><ruby>折<rt>お</rt></ruby>らばや<ruby>折<rt>お</rt></ruby>ら<ruby>む<rt>ん</rt></ruby><br><ruby>初霜<rt>はつしも</rt></ruby>の",
        "second": "おきまど<ruby>は<rt>わ</rt></ruby>せる<br><ruby>白菊<rt>しらぎく</rt></ruby>の<ruby>花<rt>はな</rt></ruby>",
        "torihuda": "おきまとは<br>せるしらき<br>くのはな",
        "eng":"I wonder if I can break it by trying to break it by hand with all my heart. The first frost has come, and the more difficult it is to distinguish the beautiful white chrysanthemums from the others, the more beautiful and pure white they are.",
        "translation": "心して手折ろうして折れるものだろうか。初霜が降りて、見分けにくくなっているほど真っ白で美しい幻想的な白菊の花を。",
        "background": "この歌は「心当てに」を「当てずっぽうに」と訳すか「心して」と訳すかで解釈が大きく変わります。「当てずっぽうに」と訳せば、白菊が初霜に紛れて区別がつかないことが強調されますが、「心して」と訳せば、これほど美しい白菊を手折ることなどできようかという解釈になります。",
        "personality": "凡河内躬恒は官位は高くありませんでしたが、叙景歌の才能が高く、紀貫之と並び称される当代きっての歌人です。古今和歌集の撰者にも選ばれ、三十六歌仙にも選ばれています。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "30": {
        "number": "30",
        "name": "<ruby>壬生忠岑<rt>みぶのただみね</rt></ruby>",
        "date": "生没年不詳",
        "source": "古今集 恋",
        "theme": "love",
        "first": "<ruby>有明<rt>ありあけ</rt></ruby>の<br>つれなく<ruby>見<rt>み</rt></ruby>えし<br><ruby>別<rt>わか</rt></ruby>れより",
        "second": "あかつきばかり<br><ruby>憂<rt>う</rt></ruby>きものはなし",
        "torihuda": "あかつきは<br>かりうきも<br>のはなし",
        "eng":"Reluctant to part, I walk the path home, Yet the dawn moon was indifferent. Since that moment, each dawn Brings a painful ache to my heart.",
        "eng_name":"Mibu no Tadamine",
        "translation": "あなたとの別れを惜しんで帰る道、有明の月はそしらぬ顔をしていました。それときからというもの暁の時間になるとつらく感じてしまいます。",
        "background": "この歌は、「古今集」の「逢はずして帰る恋」に収められています。当時の逢瀬は、男性が女性宅を訪れるのですが、夜明け前に男性は女性宅を後にするのが常でした。女性がつれなかったのか、女性との別れを名残惜しんでいるのに月がつれなく見えたのかで2通りの解釈ができる歌です。",
        "personality": "壬生忠岑は、警護などを担当する下級武官でしたが、歌の才能に恵まれ、宮中の歌会によく参加していました。「古今和歌集」の撰者にも抜擢されるほどの和歌の名手でした。<a href='41.html'>壬生忠見（41番）</a>の父です。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "31": {
        "number": "31",
        "name": "<ruby>坂上是則<rt>さかのうえのこれのり</rt></ruby>",
        "date": "生没年不詳",
        "source": "古今集 冬",
        "theme": "winter",
        "first": "<ruby>朝<rt>あさ</rt></ruby>ぼらけ<br><ruby>有明<rt>ありあけ</rt></ruby>の<ruby>月<rt>つき</rt></ruby>と<br><ruby>見<rt>み</rt></ruby>るまでに",
        "second": "<ruby>吉野<rt>よしの</rt></ruby>の<ruby>里<rt>さと</rt></ruby>に<br><ruby>降<rt>ふ</rt></ruby>れる<ruby>白雪<rt>しらゆき</rt></ruby>",
        "torihuda": "よしののさ<br>とにふれる<br>しらゆき",
        "eng":"Snow falls on Yoshino in the pre-dawn twilight. It is so bright that one could be mistaken for the moon being out.",
        "eng_name":"Sakanoue no Korenori",
        "translation": "夜がぼんやり明ける頃、吉野の里に有明の月かと思うほど明るい白雪が降り続いている。",
        "background": "「朝ぼらけ」は秋と冬に使われることが多い言葉で夜が明けようとする頃を指します。吉野の里（現在の奈良県吉野郡）は今では桜の名所として知られていますが、当時は雪の名所として知られていました。また、天武天皇や持統天皇が隠遁した吉野は平安時代の貴族にとって憧れの地でもあったようです。",
        "personality": "坂上是則は蝦夷征伐を果たした征夷大将軍の坂上田村麻呂の子孫です。大和権少掾として奈良県に赴任していたことがあったので、吉野にも馴染みがあったのだと考えられます。歌人として以外にも蹴鞠の名人としても知られていたようです。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "32": {
        "number": "32",
        "name": "<ruby>春道列樹<rt>はるみちのつらき</rt></ruby>",
        "date": "生年不詳～920年",
        "source": "古今集 秋",
        "theme": "autumn",
        "first": "<ruby>山川<rt>やまがわ</rt></ruby>に<br><ruby>風<rt>かぜ</rt></ruby>のかけたる<br>しがらみは",
        "second": "<ruby>流<rt>なが</rt></ruby>れもあ<ruby>へ<rt>え</rt></ruby>ぬ<br><ruby>紅葉<rt>もみじ</rt></ruby>なりけり",
        "torihuda": "なかれもあ<br>へぬもみち<br>なりけり",
        "eng":"I thought the wind had created a tangle in the mountain river.<br>But the autumn leaves did not flow, they just gathered.",
        "eng_name":"Harumichi no Tsuraki",
        "translation": "山川に風がかけたしがらみだと思ったら紅葉が流れきらずにたまっていたのだなあ。",
        "background": "古今集の詞書に「志賀の山越えにて詠める」とあり、京都から大津へ超える山道で作者が実際に渓流の景色を見て詠んだとされています。山川に紅葉が流れずに溜まっている様子を秋風が紅葉を吹き寄せて、川に美しいしがらみを作ったと詠んでいます。秋風を擬人化したところと「風がかけたしがらみ」という謎めいた要素によって、面白い歌に仕立てています。",
        "personality": "春道列樹は物部氏の子孫でした。若い頃は<ruby>文章生<rt>もんじょうしょう</rt></ruby>（大学院で研究する学生）で、漢詩の知識が豊富であったと考えられます。壱岐守に任ぜられましたが、壱岐への赴任の途上で、病に倒れて亡くなりました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "33": {
        "number": "33",
        "name": "<ruby>紀友則<rt>きのとものり</rt></ruby>",
        "date": "生年不詳～904年頃",
        "source": "古今集 春",
        "theme": "spring",
        "first": "<ruby>久方<rt>ひさかた</rt></ruby>の<br><ruby>光<rt>ひかり</rt></ruby>のどけき<br><ruby>春<rt>はる</rt></ruby>の<ruby>日<rt>ひ</rt></ruby>に",
        "second": "しづ<ruby>心<rt>こころ</rt></ruby>なく<br><ruby>花<rt>はな</rt></ruby>の<ruby>散<rt>ち</rt></ruby>るら<ruby>む<rt>ん</rt></ruby>",
        "torihuda": "しつこころ<br>なくはなの<br>ちるらむ",
        "eng":"On a tranquil spring day,<br>Why do cherry blossoms scatter so hurriedly?",
        "eng_name":"Ki no Tomonori",
        "translation": "うららかな春の日に桜の花はどうしてせわしなく散ってしまうのでしょう。",
        "background": "桜の開花は短いものです。この歌では、穏やかな春の日に優しい日差しが差し込む中、慌ただしく散る桜の儚さを詠んでいます。「しず心」とは穏やかな心のことで、この表現には二通りの解釈があります。一つは桜の心情を擬人化したもの、もう一つは桜が散る様子を見ている人々の心情を指したものです。",
        "personality": "紀友則は『土佐日記』や『古今和歌集』の仮名序を書いた<a href='/35.html'>紀貫之</a>のいとこです。彼自身も『古今和歌集』の撰者の一人でしたが、完成前に亡くなってしまいました。官位には恵まれませんでしたが、その歌の才能は高く評価され、多くの作品が勅撰和歌集に収録されています。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba.svg' alt='枕詞' class='trigger'>",
        "makurakotobaLink": "「久方の」は天体に関係のある語句を導きます。この歌では「光」を導いています。",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "34": {
        "number": "34",
        "name": "<ruby>藤原興風<rt>ふじわらのおきかぜ</rt></ruby>",
        "date": "生没年不詳",
        "source": "古今集 雑",
        "theme": "misc",
        "first": "<ruby>誰<rt>たれ</rt></ruby>をかも<br><ruby>知<rt>し</rt></ruby>る<ruby>人<rt>ひと</rt></ruby>にせ<ruby>む<rt>ん</rt></ruby><br><ruby>高砂<rt>たかさご</rt></ruby>の",
        "second": "<ruby>松<rt>まつ</rt></ruby>も<ruby>昔<rt>むかし</rt></ruby>の<br><ruby>友<rt>とも</rt></ruby>ならなくに",
        "torihuda": "まつもむか<br>しのともな<br>らなくに",
        "eng":"Who should I choose as a friend with whom to share my heart?<br>Even the long-lived pine trees of Takasago are not friends from old times.",
        "eng_name":"Fujiwara no Okikaze",
        "translation": "誰を心を通わせられる友にしたらいいのだろう。長く生きている高砂の松も、昔からの友ではないし。",
        "background": "松は常緑樹で長寿の象徴です。高砂（兵庫県高砂市）は昔から松の名所として知られていました。<br>長寿は本来おめでたいことですが、長く生きれば、心を通い合わせられた友を一人また一人と亡くすことがあります。この歌は、年老いて自分だけが取り残される孤独を詠んだものです。平安時代の平均年齢は男性が50歳、女性が40歳だったといわれています。作者は74歳のときにこの歌を詠んでいます。",
        "personality": "藤原興風は身分は高くありませんでしたが、歌人として高く評価されました。「興風集」という家集を残しています。また琴の名手としても知られていました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "<img src='../img/mark_utamakura.svg' alt='歌枕' class='shadow trigger'>",
        "utamakuraLink": "utamakura.html?lat=34.74386&lng=134.80309&zoom=20",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "35": {
        "number": "35",
        "name": "<ruby>紀貫之<rt>きのつらゆき</rt></ruby>",
        "date": "868年～945年",
        "source": "古今集 春",
        "theme": "spring",
        "first": "<ruby>人<rt>ひと</rt></ruby>はいさ<br><ruby>心<rt>こころ</rt></ruby>も<ruby>知<rt>し</rt></ruby>らず<br>ふるさとは",
        "second": "<ruby>花<rt>はな</rt></ruby>ぞ<ruby>昔<rt>むかし</rt></ruby>の<br><ruby>香<rt>か</rt></ruby>に<ruby>匂<rt>にお</rt></ruby><ruby>ひ<rt>い</rt></ruby>ける",
        "torihuda": "はなそむか<br>しのかにに<br>ほひける",
        "eng":"People's hearts change,<br>so I can't understand your feelings either.<br>Back in my hometown, the plum blossoms bloom beautifully,<br>just as they did before,<br>filling the air with their fragrance.",
        "eng_name":"Ki no Tsurayuki",
        "translation": "人の心は変わってしまうものですから、あなたの気持ちもわかりませんね。ふるさとでは、梅の花がかつてと同じように美しく咲き、香りを漂わせていますよ。",
        "background": "長谷寺にお参りに行くたびに泊まっていた宿に、数年ぶりに訪問した作者。宿屋の主人から「宿は昔から変わらずあるのにどうしてお越しにならなかったのですか」と問われた際に、作者は手折った梅の枝と一緒にこの歌を宿の主人に贈りました。",
        "personality": "紀貫之は、古今和歌集の撰者で、<ruby>仮名序<rt>かなじょ</rt></ruby>を書いたことで知られます。また、<ruby>土佐守<rt>とさのかみ</rt></ruby>だった作者が任期を満了して、帰京する55日間の紀行文『土佐日記』は、女性の立場で平仮名で書かれたことにより、後世の女性作家に多大な影響を与えました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "36": {
        "number": "36",
        "name": "<ruby>清原深養父<rt>きよはらのふかやぶ</rt></ruby>",
        "date": "生没年不詳",
        "source": "古今集 夏",
        "theme": "summer",
        "first": "<ruby>夏<rt>なつ</rt></ruby>の<ruby>夜<rt>よ</rt></ruby>は<br>まだ<ruby>宵<rt>よい</rt></ruby>ながら<br>あけぬるを",
        "second": "<ruby>雲<rt>くも</rt></ruby>のいづこに<br><ruby>月<rt>つき</rt></ruby>やどるら<ruby>む<rt>ん</rt></ruby>",
        "torihuda": "くものいつ<br>こにつきや<br>とるらむ",
        "eng":"Summer nights are short,<br>Before I realize, dawn breaks.<br>Where does the moon find its resting place amidst the clouds?",
        "eng_name":"Kiyohara no Fukayabu",
        "translation": "夏の夜というものは短く、まだ宵のうちだと思ってる間に夜が明けてしまった。月は雲のどのあたりに宿をとっているのだろう。",
        "background": "夏の夜は短いため、月が西に沈みきる前に夜が明けてしまいました。月はどこの雲に姿を隠しているのだろうとユニークな発想で歌が詠まれています。",
        "personality": "清原深養父は天武天皇の末裔でしたが、生涯官位には恵まれませんでした。彼は清少納言の曽祖父ですが、<a href='62.html'>清少納言（62番）</a>も『枕草子』の中で「夏は夜。月のころはさらなり」と綴っており、夏の月に趣を感じている点が共通しています。藤原兼輔、紀貫之、凡河内躬恒とも交流がありました。深養父が奏でる琴を聞きながら兼輔が作った歌が残されています。<a href='sanjurokkasen.html#kanesuke'>（三十六歌仙のページ）</a>",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "37": {
        "number": "37",
        "name": "<ruby>文屋朝康<rt>ふんやのあさやす</rt></ruby>",
        "date": "生没年不詳",
        "source": "後撰集 秋",
        "theme": "autumn",
        "first": "<ruby>白露<rt>しらつゆ</rt></ruby>に<br><ruby>風<rt>かぜ</rt></ruby>の<ruby>吹<rt>ふ</rt></ruby>きしく<br><ruby>秋<rt>あき</rt></ruby>の<ruby>野<rt>の</rt></ruby>は",
        "second": "つらぬきとめぬ<br><ruby>玉<rt>たま</rt></ruby>ぞ<ruby>散<rt>ち</rt></ruby>りける",
        "torihuda": "つらぬきと<br>めぬたまそ<br>ちりける",
        "eng":"The wind incessantly blows through the autumn fields,<br>Scattering like unthreaded beads, unfastened.",
        "eng_name":"Fun'ya no Asayasu",
        "translation": "風がしきりに秋の野に吹きつけて糸を通して留めていない玉のように飛び散っているのだなあ。",
        "background": "この歌は、秋の野原で風に吹き飛び散る露を真珠の玉に見立てています。日本は古くから真珠が産出されていますが、平安時代は、真珠のネックレスを身に着けることはあまりなかったようで、真珠の数珠のことを指しているのではと考えられます。露は空気中の水分が結露したもので、気温が冷え込む早朝の景色ではないかと考えられます。",
        "personality": "文屋朝康は六歌仙の一人である<a hre='22.html'>文屋康秀（22番）</a>の息子です。父と同じく生涯にわたって官位に恵まれませんでしたが、歌人として有名で多くの歌会に出席していたようです。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "38": {
        "number": "38",
        "name": "<ruby>右近<rt>うこん</rt></ruby>",
        "date": "生没年不詳",
        "source": "拾遺集 恋",
        "theme": "love",
        "first": "<ruby>忘<rt>わす</rt></ruby>らるる<br><ruby>身<rt>み</rt></ruby>をば<ruby>思<rt>おも</rt></ruby>はず<br><ruby>誓<rt>ちか</rt></ruby>ひてし",
        "second": "<ruby>人<rt>ひと</rt></ruby>の<ruby>命<rt>いのち</rt></ruby>の<br><ruby>惜<rt>お</rt></ruby>しくもあるかな",
        "torihuda": "ひとのいの<br>ちのをしく<br>もあるかな",
        "eng":"I don't mind being forgotten,<br>But I worry that you, who vowed to love me, may fall victim to divine punishment.",
        "eng_name":"Ukon",
        "translation": "忘れ去られる私は構わないのですが、私を愛すると神に誓ったあなたが神罰によって命を落とさないか案じております。",
        "background": "この歌は、神に誓って愛すると言った恋人が自分を捨てたので、神罰が下らないか心配という内容です。相手は恐怖におののいたかもしれません。『大和物語』によると、相手は<a href='43.html'>権中納言敦忠（43番）</a>でした。彼は37歳で夭折していますが、神罰が下ったのでしょうか。",
        "personality": "右近は醍醐天皇の中宮・<ruby>穏子<rt>おんし</rt></ruby>に仕えた女房です。右近という名前は、彼女の父親が右近衛少将という官職に就いていたことに由来しています。『大和物語』では、様々な男性と恋に落ちる様子が描かれており、恋多き女性だったことがわかります。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "39": {
        "number": "39",
        "name": "<ruby>参議等<rt>さんぎひとし</rt></ruby>",
        "date": "880年～951年",
        "source": "後撰集 恋",
        "theme": "love",
        "first": "<ruby>浅茅生<rt>あさじう</rt></ruby>の<br><ruby>小野<rt>おの</rt></ruby>の<ruby>篠原<rt>しのはら</rt></ruby><br>しのぶれど",
        "second": "あまりてなどか<br><ruby>人<rt>ひと</rt></ruby>の<ruby>恋<rt>こい</rt></ruby>しき",
        "torihuda": "あまりてな<br>とかひとの<br>こひしき",
        "eng":"I have hidden my love for you among the bamboo growing in the low tangled reeds.  But why do I miss you so much?",
        "translation": "丈の低い茅の野原に生い茂る篠竹の中に私はあなたへの恋心を隠してきました。しかし、どうしてこれほどまでにあなたを恋しいのでしょうか。",
        "background": "この歌は片思いをした相手を想って詠まれました。忍びきれずにあふれ出る恋心を表現しています。「浅茅生の 小野の篠原」が序詞で「忍ぶ」という言葉を導いています。「浅茅生」や「篠原」に直接的な歌の意味はないという説と恋を忍ぶ苦しい気持ちを荒涼とした風景に重ねているという説があります。",
        "personality": "参議等は、嵯峨天皇のひ孫でしたが、<ruby>臣籍降下<rt>しんせきこうか</rt></ruby>し、<ruby>源等<rt>みなもとのひとし</rt></ruby>と名乗りました。三河守、丹波守、美濃権守、備前守と地方官を歴任し、最終的に参議にまで昇り詰めました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba.svg' alt='序詞' class='shadow trigger'>",
        "jokotobaLink": "「浅茅生の 小野の篠原」が序詞です。<br>「しの」にかかって、同じ音を繰り返しています。",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori.svg' alt='本歌取り' class='shadow trigger'>",
        "honkadoriLink": "<p>浅茅生の 小野の篠原 しのぶとも<br>人知るらめや いふ人なしに</p><div style='display: flex; justify-content: flex-end;'><small>古今集　詠人知らず</small></div>",
    },
    "40": {
        "number": "40",
        "name": "<ruby>平兼盛<rt>たいらのかねもり</rt></ruby>",
        "date": "生年不詳～990年",
        "source": "拾遺集 恋",
        "theme": "love",
        "first": "<ruby>忍<rt>しの</rt></ruby>ぶれど<br><ruby>色<rt>いろ</rt></ruby>に<ruby>出<rt>い</rt></ruby>でにけり<br><ruby>我<rt>わ</rt></ruby>が<ruby>恋<rt>こい</rt></ruby>は",
        "second": "<ruby>物<rt>もの</rt></ruby>や<ruby>思<rt>おも</rt></ruby>ふと<br><ruby>人<rt>ひと</rt></ruby>の<ruby>問<rt>と</rt></ruby><ruby>ふ<rt>う</rt></ruby>まで",
        "torihuda": "ものやおも<br>ふとひとの<br>とふまて",
        "eng":"I've hidden my love, trying not to be noticed,<br>But it seems my feelings showed in my face,<br>Until someone asked if I was lost in thought.",
        "eng_name":"Taira no Kanemori",
        "translation": "気づかれないように恋心を秘めてきましたが、顔色に出てしまっていたようです。人から物思いをしているのではないかと聞かれるまでに。",
        "background": "この歌は、村上天皇が開いた<ruby>歌合<rt>うたあわせ</rt></ruby>「天徳内裏歌合」で「未逢恋」（未だ逢わざる恋）というお題に沿って詠まれました。<a href='41.html'>壬生忠見の歌（41番）</a>と接戦になりました。しかし、村上天皇が「しのぶれど～」と歌いながら口ずさんでいたことが影響し、平兼盛の歌が勝利に決まったと伝えられています。",
        "personality": "平兼盛は、光孝天皇の玄孫でしたが、<ruby>臣籍降下<rt>しんせきこうか</rt></ruby>し、平氏を名乗りました。平清盛と名前が似ていますが、平家の武士とは関係ありません。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "41": {
        "number": "41",
        "name": "<ruby>壬生忠見<rt>みぶのただみ</rt></ruby>",
        "date": "生没年不詳",
        "source": "拾遺集 恋",
        "theme": "love",
        "first": "<ruby>恋<rt>こい</rt></ruby>す<ruby>てふ<rt>ちょう</rt></ruby><br><ruby>我<rt>わ</rt></ruby>が<ruby>名<rt>な</rt></ruby>はまだき<br><ruby>立<rt>た</rt></ruby>ちにけり",
        "second": "<ruby>人<rt>ひと</rt></ruby>しれずこそ<br><ruby>思<rt>おも</rt></ruby><ruby>ひ<rt>い</rt></ruby>そめしか",
        "torihuda": "ひとしれす<br>こそおもひ<br>そめしか",
        "eng":"Rumors of my love have spread,<br>Though I only just began to secretly harbor these feelings.",
        "eng_name":"Mibu no Tadami",
        "translation": "恋をしているという噂が広まってしまった。気づかれないように密かに想い始めたばかりなのに。",
        "background": "この歌は、村上天皇が開いた<ruby>歌合<rt>うたあわせ</rt></ruby>「天徳内裏歌合」で「未逢恋」（未だ逢わざる恋）というお題に沿って詠まれました。<a href='40.html'>平兼盛（40番）</a>の歌と接戦になりましたが、村上天皇が「しのぶれど」の歌を口ずさんでいたという理由で惜しくも負けました。落胆のほどはあまりに大きく、壬生忠見は食事が喉を通らなくなり、病床に伏して身まかったと沙石集に逸話が残っています。",
        "personality": "壬生忠見は、<a href='30.html'>壬生忠岑（30番）</a>の息子にあたります。村上天皇に仕えた下級官人でした。歌の才能は父譲りで、幼少の頃から歌に秀でて、内裏よりお召しがあり、御厨子所で働き、摂津大目になりました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "42": {
        "number": "42",
        "name": "<ruby>清原元輔<rt>きよはらのもとすけ</rt></ruby>",
        "date": "908年～990年",
        "source": "後拾遺集 恋",
        "theme": "love",
        "first": "<ruby>契<rt>ちぎ</rt></ruby>りきな<br>かたみに<ruby>袖<rt>そで</rt></ruby>を<br>しぼりつつ",
        "second": "<ruby>末<rt>すえ</rt></ruby>の<ruby>松山<rt>まつやま</rt></ruby><br><ruby>波<rt>なみ</rt></ruby>こさじとは",
        "torihuda": "すゑのまつ<br>やまなみこ<br>さしとは",
        "eng":"You promised, didn\’t you?<br>That we\’d stay true, like waves never crossing Sue no Matsuyama.",
        "eng_name":"Kiyohara no Motosuke",
        "translation": "約束しましたよね。涙に濡れた着物の袖を絞りながら、末の松山を波が決して越えないように私たちは変わらないと。",
        "background": "宮城県多賀城市の海岸近くにある景勝地「末の松山」。この場所は、大きな津波が来ても乗り越えられないと言われ、昔から多くの歌に詠まれて親しまれてきました。この歌では、「末の松山」を例に挙げて、変わらない揺るぎない愛情を表現しています。",
        "personality": "清原元輔は『後撰和歌集』の編纂者としても知られています。彼は<a href='36.html'>清原深養父（36番）</a>の孫であり、娘は『枕草子』の作者として有名な<a href='62.html'>清少納言（62番）</a>です。清少納言は「父の名を汚したくないので歌は詠まない」と言うほど、父の才能を深く尊敬していたようです。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "<img src='../img/mark_utamakura.svg' alt='歌枕' class='shadow trigger'>",
        "utamakuraLink": "utamakura.html?lat=38.287958179367735&lng=141.00347951203332&zoom=15",
        "honkadoriMark": "<img src='../img/mark_honkadori.svg' alt='本歌取り' class='shadow trigger'>",
        "honkadoriLink": "<p>君をおきて あだし心を わがもたば<br>すゑの松山 浪もこえなむ</p><div style='display: flex; justify-content: flex-end;'><small>古今集　詠人知らず</small></div>",
    },
    "43": {
        "number": "43",
        "name": "<ruby>権中納言敦忠<rt>ごんちゅうなごんあつただ</rt></ruby>",
        "date": "906年～943年",
        "source": "拾遺集 恋",
        "theme": "love",
        "first": "<ruby>逢<rt>あ</rt></ruby><ruby>ひ<rt>い</rt></ruby><ruby>見<rt>み</rt></ruby>ての<br>のちの<ruby>心<rt>こころ</rt></ruby>に<br>くらぶれば",
        "second": "<ruby>昔<rt>むかし</rt></ruby>は<ruby>物<rt>もの</rt></ruby>を<br><ruby>思<rt>おも</rt></ruby><ruby>は<rt>わ</rt></ruby>ざりけり",
        "torihuda": "むかしはも<br>のをおもは<br>さりけり",
        "eng":"Compared to meeting you, the pain of being in love before meeting you seems like nothing.",
        "eng_name":"Acting Middle Counselor Atsutada",
        "translation": "逢って契りを結んだ後の気持ちと比べてみたら、逢う前の物思いなんて恋のうちにも入らない。",
        "background": "藤原公任撰の拾遺抄の詞書によると、この歌は初めて契りを結んだ女性に翌朝贈られたとあり、いわゆる<ruby>後朝<rt>きぬぎぬ</rt></ruby>の歌です。藤原敦忠は<a href='38.html'>右近（38番）</a>と恋愛関係にありましたが、敦忠は恋多き人物だったため、この歌が誰に捧げられたかはわかっていません。",
        "personality": "左大臣・藤原時平の三男として生まれ、和歌や琵琶に秀でた藤原敦忠は、若くして中納言の地位まで上り詰めました。しかし、38歳という若さで病死し、その早すぎる死は周囲に深い悲しみをもたらします。当時は、父である藤原時平が菅原道真を失脚させたことにより、道真の怨霊が敦忠に祟りをもたらしたという噂が流れました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "44": {
        "number": "44",
        "name": "<ruby>中納言朝忠<rt>ちゅうなごんあさただ</rt></ruby>",
        "date": "910年～966年",
        "source": "拾遺集 恋",
        "theme": "love",
        "first": "<ruby>逢<rt>あ</rt></ruby><ruby>ふ<rt>う</rt></ruby>ことの<br><ruby>絶<rt>た</rt></ruby>えてしなくは<br>なかなかに",
        "second": "<ruby>人<rt>ひと</rt></ruby>をも<ruby>身<rt>み</rt></ruby>をも<br><ruby>恨<rt>うら</rt></ruby>みざらまし",
        "torihuda": "ひとをもみ<br>をもうらみ<br>さらまし",
        "eng":"If we had never met, I wouldn't have to resent your coldness or my own shortcomings.",
        "eng_name":"Middle Counselor Asatada",
        "translation": "もし逢うことが全くないなら、あの人のつれなさも、我が身のいたらなさも恨まずに済んだのに。",
        "background": "この歌は、村上天皇が開いた「天徳内裏歌合」で「未逢恋」（未だ逢わざる恋）というお題に沿って詠まれました。恋が成就して、幸せな気持ちは束の間に相手の女性につれなくされた朝忠。逢わなければよかったと思いながら、相手への愛情や逢瀬の思い出が忘れられないというもどかしい気持ちが表現されています。",
        "personality": "中納言朝忠こと藤原朝忠は、<a href='25.html'>三条右大臣定方（25番）</a>の五男として生まれ、官位は従三位中納言まで昇進しました。和歌だけでなく、<ruby>笙<rt>しょう</rt></ruby>の名手としても知られていました。ところで、朝忠の娘は穆子で、孫娘は藤原道長の妻になる倫子です。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "45": {
        "number": "45",
        "name": "<ruby>謙徳公<rt>けんとくこう</rt></ruby>",
        "date": "924年～972年",
        "source": "拾遺集 恋",
        "theme": "love",
        "first": "あ<ruby>は<rt>わ</rt></ruby>れとも<br>い<ruby>ふ<rt>う</rt></ruby>べき人は<br><ruby>思<rt>おも</rt></ruby><ruby>ほ<rt>お</rt></ruby>えで",
        "second": "<ruby>身<rt>み</rt></ruby>のいた<ruby>づ<rt>ず</rt></ruby>らに<br>なりぬべきかな",
        "torihuda": "みのいたつ<br>らになりぬ<br>へきかな",
        "eng":"I can think of no one who might sympathize with me.<br>Having been abandoned by you,<br>I shall die in vain.",
        "eng_name":"Kentoku-kō",
        "translation": "私に同情してくれそうな人は思い浮かばない。あなたに捨てられて私はむなしく死んでいくのでしょう。",
        "background": "拾遺集の詞書に「一度付き合っていた女性からつれなくされて、逢ってくれなくなってしまった」とあります。失恋の痛手に弱り切った心情を吐露しつつ、せめて憐憫の情を自分にかけてほしいと哀れにも懇願しています。",
        "personality": "謙徳公は、<ruby>藤原<rt>ふじわらの</rt></ruby><ruby>伊尹<rt>これただ</rt></ruby>の<ruby>諡号<rt>しごう</rt></ruby>です。伊尹は<a href='26.html'>貞信公（26番）</a>の孫で、父親は右大臣・藤原師輔です。父親から質素倹約を遺訓されていましたが、伊尹は贅沢三昧の生活を送りました。晩年、伊尹の娘が師貞親王（後の花山天皇）を産んだことで、摂政・太政大臣にまで昇り詰めましたが、その翌年、48歳の若さで亡くなりました。<a href='50.html'>藤原義孝（50番）</a>は伊尹の三男です。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "46": {
        "number": "46",
        "name": "<ruby>曽禰好忠<rt>そねのよしただ</rt></ruby>",
        "date": "生没年不詳",
        "source": "新古今集 恋",
        "theme": "love",
        "first": "<ruby>由良<rt>ゆら</rt></ruby>のとを<br><ruby>渡<rt>わた</rt></ruby>る<ruby>舟人<rt>ふなびと</rt></ruby><br>か<ruby>ぢ<rt>じ</rt></ruby>を<ruby>絶<rt>た</rt></ruby>え",
        "second": "ゆくへも<ruby>知<rt>し</rt></ruby>らぬ<br><ruby>恋<rt>こい</rt></ruby>の<ruby>道<rt>みち</rt></ruby>かな",
        "torihuda": "ゆくへもし<br>らぬこひの<br>みちかな",
        "eng":"Like a boatman drifting without an oar at the mouth of the Yura River,<br>I too am lost, unsure of where my love will lead.",
        "eng_name":"Sone no Yoshitada",
        "translation": "由良の河口を渡る船人が、櫂をなくして漂うように私の恋もどうなるかわかりません。",
        "background": "この歌は、急峻な河口で操舵する舵を失くした船乗りのように、恋路に迷い困り果てた心境を詠んだものです。",
        "personality": "曽禰好忠は、万葉集で用いられる古語を積極的に取り入れ、和歌の表現の幅を広げようとしたり、百首単位で詠む百首歌を始めた先駆者でした。しかしながら、その斬新な作風は当時の貴族たちからは理解されず、むしろ異端と見なされました。しかし、後になって彼の歌は高く評価されました。彼は丹後掾として丹後に赴いていたため、由良川は慣れ親しんだ風景だったと考えられます。由良川は京都府舞鶴市、宮津市を流れる川で日本海に注ぎます。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba.svg' alt='序詞' class='shadow trigger'>",
        "jokotobaLink": "「由良のとを 渡る舟人 かぢを絶え」が序詞です。比喩表現で「ゆくへも知らぬ」を修飾しています。",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "<img src='../img/mark_utamakura.svg' alt='歌枕' class='shadow trigger'>",
        "utamakuraLink": "utamakura.html?lat=35.52408&lng=135.27212&zoom=15",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "47": {
        "number": "47",
        "name": "<ruby>恵慶法師<rt>えぎょうほうし</rt></ruby>",
        "date": "生没年不詳",
        "source": "拾遺集 秋",
        "theme": "autumn",
        "first": "<ruby>八重葎<rt>やえむぐら</rt></ruby><br>しげれる<ruby>宿<rt>やど</rt></ruby>の<br>さびしきに",
        "second": "<ruby>人<rt>ひと</rt></ruby>こそ<ruby>見<rt>み</rt></ruby>えね<br><ruby>秋<rt>あき</rt></ruby>は<ruby>来<rt>き</rt></ruby>にけり",
        "torihuda": "ひとこそみ<br>えねあきは<br>きにけり",
        "eng":"Though no one visits this deserted, overgrown house,<br>Autumn has certainly arrived.",
        "eng_name":"Priest Egyō",
        "translation": "雑草が生い茂る荒廃した家は寂しく人が来ることはありませんが、秋はたしかにやって来たのですね。",
        "background": "この歌は、平安時代初期の公卿である<a href='14.html'>河原左大臣（14番）</a>、源融が建てた邸宅、河原院について詠んだものです。かつてこの邸宅は源融が贅を尽くして建てた豪華な別荘でした。しかし、源融の没後100年が経つと、彼の曽孫である安法法師が河原院を寺として住んでいましたが、手入れをせず放置され、草が生い茂り荒れ果ててしまいました。安法法師の友人である恵慶法師は、その荒れ果てた河原院を歌を詠む場所として利用していたようです。",
        "personality": "恵慶法師は、播磨の国分寺の講師（僧侶の監督的な立場）を務めたようですが、詳細は不明です。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "48": {
        "number": "48",
        "name": "<ruby>源重之<rt>みなもとのしげゆき</rt></ruby>",
        "date": "生没年不詳",
        "source": "詞花集 恋",
        "theme": "love",
        "first": "<ruby>風<rt>かぜ</rt></ruby>をいたみ<br><ruby>岩<rt>いわ</rt></ruby>うつ<ruby>波<rt>なみ</rt></ruby>の<br>おのれのみ",
        "second": "くだけて<ruby>物<rt>もの</rt></ruby>を<br><ruby>思<rt>おも</rt></ruby><ruby>ふ<rt>う</rt></ruby>ころかな",
        "torihuda": "くたけても<br>のをおもふ<br>ころかな",
        "eng":"Lately, I feel battered and troubled, like waves crashing fiercely against the rocks.",
        "eng_name":"Minamoto no Shigeyuki",
        "translation": "風が激しく吹くので、岩を打ち寄せる波がおのれ一人で砕けるように、私の心だけが砕かれて、物思いをするこの頃ですよ。",
        "background": "好意を寄せる人を岩に見立て、恋をする自分を波に見立てています。どんなに熱い想いを届けても、恋する人からはまったく相手にされない切なさを詠んでいます。",
        "personality": "源重之は清和天皇のひ孫です。様々な地方官職を歴任しながら和歌を作りました。彼は冷泉天皇の皇太子時代に、百首歌『重之百首』を献上しています。この百首歌は、現存するものとしては最も古いものといわれています。同じく百首歌を作っていた曽禰好忠とも親交がありました。また、藤原実方とも交流があり、陸奥国に赴任することになった実方に従って一緒に下向しています。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba.svg' alt='序詞' class='shadow trigger'>",
        "jokotobaLink": "「風をいたみ 岩うつ波の」が序詞です。<br>比喩表現で「おのれのみ くだけて」を修飾しています。",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "49": {
        "number": "49",
        "name": "<ruby>大中臣能宣朝臣<rt>おおなかとみのよしのぶあそん</rt></ruby>",
        "date": "921年～991年",
        "source": "詞花集 恋",
        "theme": "love",
        "first": "<ruby>御垣守<rt>みかきもり</rt></ruby><br><ruby>衛士<rt>えじ</rt></ruby>のたく<ruby>火<rt>ひ</rt></ruby>の<br><ruby>夜<rt>よる</rt></ruby>はもえ",
        "second": "<ruby>昼<rt>ひる</rt></ruby>は<ruby>消<rt>き</rt></ruby>えつつ<br><ruby>物<rt>もの</rt></ruby>をこそ<ruby>思<rt>おも</rt></ruby><ruby>へ<rt>え</rt></ruby>",
        "torihuda": "ひるはきえ<br>つつものを<br>こそおもへ",
        "eng":"Like the watchmen's bonfires, burning at night and fading by day,<br>My love blazes in the night and fades into contemplation by day.",
        "eng_name":"Ōnakatomi no Yoshinobu Ason",
        "translation": "警護の兵士が燃やす<ruby>篝火<rt>かがりび</rt></ruby>が、夜は燃えて昼は消えているように、私の恋心は夜に燃え、昼は消え入るように物思いに沈んでいます。",
        "background": "<ruby>御垣守<rt>みかきもり</rt></ruby>は皇居の門を警護する役のことで、この歌では衛士（警護の兵士）にかかる枕詞として使われています。門前の<ruby>篝火<rt>かがりび</rt></ruby>を恋の炎に見立て、篝火が消える日中に逢えない切なさを歌に詠み込んでいます。",
        "personality": "大中臣能宣は、中臣鎌足の子孫で、中臣氏の出身でした。中臣氏はもともと神祇を司る一族であり、彼も神祇官の家柄に生まれ、自身も伊勢神宮の祭主をつとめました。歌人の多い家柄でもあり、<a href='61.html'>伊勢大輔（61番）</a>は彼の孫にあたります。村上天皇の命により後撰集の編纂を行った「<ruby>梨壺<rt>なしつぼ</rt></ruby>の五人」の内の一人です。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba.svg' alt='序詞' class='shadow trigger'>",
        "jokotobaLink": "「御垣守 衛士のたく火の」が序詞です。<br>比喩表現で「夜はもえ 昼は消えつつ」を修飾しています。",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "50": {
        "number": "50",
        "name": "<ruby>藤原義孝<rt>ふじわらのよしたか</rt></ruby>",
        "date": "954年～974年",
        "source": "後拾遺集 恋",
        "theme": "love",
        "first": "<ruby>君<rt>きみ</rt></ruby>がため<br><ruby>惜<rt>お</rt></ruby>しからざりし<br>いのちさ<ruby>へ<rt>え</rt></ruby>",
        "second": "<ruby>長<rt>なが</rt></ruby>くもがなと<br><ruby>思<rt>おも</rt></ruby><ruby>ひ<rt>い</rt></ruby>けるかな",
        "torihuda": "なかくもか<br>なとおもひ<br>けるかな",
        "eng":"I used to think I would die for you.<br>But now that I've met you, I find myself wanting to live a little longer.",
        "eng_name":"Fujiwara no Yoshitaka",
        "translation": "あなたに逢うためなら惜しくないと思った命ですが、あなたと出会って少しでも長生きしたいと思うようになりましたよ。",
        "background": "この歌は<ruby>後朝<rt>きぬぎぬ</rt></ruby>の歌です。逢瀬の前は恋のためなら死んでも構わないと思っていたのに、逢瀬後は少しでも長生きして添い遂げたいと思うようになったという心の変化を詠んでいます。",
        "personality": "藤原義孝は<a href='45.html'>謙徳公（45番・<ruby>藤原伊尹<rt>ふじわらのこれただ</rt></ruby>）</a>の息子で、優れた美貌と将来性を備えた青年でしたが、天然痘に罹り、21歳でこの世を去りました。彼は仏教への深い信仰心を持ち、生前は肉や魚を口にしなかったと伝えられています。義孝の長男は能書家として三蹟の一人に数えられる藤原行成です。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "51": {
        "number": "51",
        "name": "<ruby>藤原実方朝臣<rt>ふじわらのさねかたあそん</rt></ruby>",
        "date": "生年不詳～998年",
        "source": "後拾遺集 恋",
        "theme": "love",
        "first": "かくとだに<br>えやはいぶきの<br>さしも<ruby>草<rt>ぐさ</rt></ruby>",
        "second": "さしも<ruby>知<rt>し</rt></ruby>らじな<br>もゆる<ruby>思<rt>おも</rt></ruby><ruby>ひ<rt>い</rt></ruby>を",
        "torihuda": "さしもしら<br>しなもゆる<br>おもひを",
        "eng":"I can't confess how deeply I long for you.<br>You might not know the intensity of my burning passion, like hot moxibustion.",
        "eng_name":"Fujiwara no Sanekata Ason",
        "translation": "こんなに恋焦がれているということさえ言えません。伊吹山のさしも草（お灸に使われる草）ではないですが、それほどまでとはご存知ないでしょう。私の（お灸のように熱い）燃える想いを。",
        "background": "長らく心に秘めていた熱い想いを、お灸に例え、思いを寄せていた女性に捧げたのがこの歌です。",
        "personality": "藤原実方は、摂関家の流れをくむ由緒のある家柄に生まれ、優れた和歌の才能を持っていたため、将来を期待されていました。しかし、宮中で和歌を巡る口論に巻き込まれ、相手（藤原行成）の烏帽子を投げ捨てるという行為が原因で左遷されました。当時の貴族社会では、男性が公然と頭髪を晒すことは忌み嫌われており、この行動は社会的に重大な非難を浴びる結果となりました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba.svg' alt='掛詞' class='box trigger'>",
        "kakekotobaLink": "「いぶき」は「伊吹」と「言ふ」の掛詞です。「思ひ」は「思ひ」と「火」の掛詞です。",
        "engoMark": "<img src='../img/mark_engo.svg' alt='縁語'  class='shadow trigger'>",
        "engoLink": "「さしも草」、「燃ゆる」、「火」が縁語です。",
        "jokotobaMark": "<img src='../img/mark_jokotoba.svg' alt='序詞' class='shadow trigger'>",
        "jokotobaLink": "「かくとだに えやはいぶきの さしも草」が序詞です。「さしも」にかかって同じ音を繰り返しています。",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "<img src='../img/mark_utamakura.svg' alt='歌枕' class='shadow trigger'>",
        "utamakuraLink": "utamakura.html?lat=36.413495521006666&lng=139.7134336618209&zoom=20",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "52": {
        "number": "52",
        "name": "<ruby>藤原道信朝臣<rt>ふじわらのみちのぶあそん</rt></ruby>",
        "date": "972年～994年",
        "source": "後拾遺集 恋",
        "theme": "love",
        "first": "明けぬれば<br><ruby>暮<rt>く</rt></ruby>るるものとは<br><ruby>知<rt>く</rt></ruby>りながら",
        "second": "な<ruby>ほ<rt>お</rt></ruby>うらめしき<br><ruby>朝<rt>あさ</rt></ruby>ぼらけかな",
        "torihuda": "なほうらめ<br>しきあさほ<br>らけかな",
        "eng":"Once the dawn breaks, I must wait until dusk to meet again.<br>The dawn feels bitterly resented.",
        "eng_name":"Fujiwara no Michinobu Ason",
        "translation": "夜が明けてしまえばあまたに会えるのはまた日が暮れるまで待たなければなりません。朝ぼらけが恨めしく感じられます。",
        "background": "平安時代、逢瀬は夜の間に限られていました。歌には、夜が訪れれば再び逢えると知っていても、たとえ一瞬たりとも愛しい相手から離れたくないという恋心が詠まれています。",
        "personality": "藤原道信は、関白であった叔父の藤原兼家の養子として育ちました。『大鏡』では「いみじき和歌の上手にて、心にくき人に言はれ給ひし」と記され、和歌に優れ、控えめで心優しい性格の持ち主であったとされています。将来性が期待されていましたが、残念ながら天然痘に罹り、23歳という若さで逝去しました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "53": {
        "number": "53",
        "name": "<ruby>右大将道綱母<rt>うだいしょうみちつなのはは</rt></ruby>",
        "date": "937年頃～995年頃",
        "source": "拾遺集 恋",
        "theme": "love",
        "first": "<ruby>嘆<rt>なげ</rt></ruby>きつつ<br>ひとり<ruby>寝<rt>ぬ</rt></ruby>る<ruby>夜<rt>よ</rt></ruby>の<br><ruby>明<rt>あ</rt></ruby>くる<ruby>間<rt>ま</rt></ruby>は",
        "second": "いかに<ruby>久<rt>ひさ</rt></ruby>しき<br>ものとかは<ruby>知<rt>し</rt></ruby>る",
        "torihuda": "いかにひさ<br>しきものと<br>かはしる",
        "eng":"The nights I spend alone, lamenting your absence before sleep,<br>Do you know how long the time feels until dawn breaks?",
        "eng_name":"Mother of the Right Captain Michitsuna",
        "translation": "あなたが来なくて嘆きながら一人で寝る夜。その夜を明かすまでの時間がどれほど長いかわかりますか。",
        "background": "作者は藤原兼家と結婚しますが、兼家には正妻の<ruby>時姫<rt>ときひめ</rt></ruby>がいました。道綱母が第一子を出産した後、兼家はますます家庭を顧みなくなり、別の女性との関係も深めていきました。ある晩、夫が帰宅したとき、道綱母は夫を家に招き入れませんでした。翌日、色褪せた菊一輪とともにこの歌を夫に贈りました。 ",
        "personality": "右大将道綱母は関白にまで昇り詰める藤原兼家の妾（本妻ではない妻）でした。彼女が書いた日記『蜻蛉日記』には、夫の浮気に悩む心情が綴られている一方で、権力者と渡り合いながら逆境を生き抜いた誇り高い女性の気質が微妙に表れています。本朝三美人の一人です。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "54": {
        "number": "54",
        "name": "<ruby>儀同三司母<rt>ぎどうさんしのはは</rt></ruby>",
        "date": "生年不詳～996年",
        "source": "新古今集 恋",
        "theme": "love",
        "first": "<ruby>忘<rt>わす</rt></ruby>れじの<br>ゆく<ruby>末<rt>すえ</rt></ruby>までは<br>かたければ",
        "second": "<ruby>今日<rt>きょう</rt></ruby>を<ruby>限<rt>かぎ</rt></ruby>りの<br><ruby>命<rt>いのち</rt></ruby>ともがな",
        "torihuda": "けふをかき<br>りのいのち<br>ともかな",
        "eng":"The phrase \"I'll never forget you\" is a difficult promise to keep, Sometimes I wish today were the last day I heard those words.",
        "eng_name":"Mother of the Honorary Grand Minister",
        "translation": "「ずっと忘れない」という言葉は難しい約束でしょうから、その言葉を聞いた今日限りの命だったらいいのにと思ってしまいます。",
        "background": "この歌は、夫の藤原道隆が作者のもとに通い始めた頃に詠まれました。幸せの絶頂が表現されています。",
        "personality": "儀同三司母こと、高階貴子は卓越した漢詩の才能を持ち、高貴な女性でした。彼女は公卿の藤原道隆と結婚し、息子の<ruby>伊周<rt>これちか</rt></ruby>、娘の定子（後に一条天皇の后）をもうけました。しかし、夫が43歳で亡くなると一気に潮目が変わります。息子の伊周、隆家は花山法王に弓矢で襲撃事件を起こし、<ruby>大宰<rt>だざいの</rt></ruby><ruby>権師<rt>ごんのそち</rt></ruby>に左遷され、定子は落飾して尼になりました。一家は没落の運命に翻弄される中、貴子は一家の窮状を案じつつ、生涯を閉じました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "55": {
        "number": "55",
        "name": "<ruby>大納言公任<rt>だいなごんきんとう</rt></ruby>",
        "date": "996年～1041年",
        "source": "千載集 雑",
        "theme": "misc",
        "first": "<ruby>滝<rt>たき</rt></ruby>の<ruby>音<rt>おと</rt></ruby>は<br>たえて<ruby>久<rt>ひさ</rt></ruby>しく<br>なりぬれど",
        "second": "<ruby>名<rt>な</rt></ruby>こそ<ruby>流<rt>なが</rt></ruby>れて<br>な<ruby>ほ<rt>お</rt></ruby><ruby>聞<rt>き</rt></ruby>こえけれ",
        "torihuda": "なこそなか<br>れてなほき<br>こえけれ",
        "eng":"It's been a long time<br>since I heard the sound of the waterfall,<br>But its fame still flows on.",
        "eng_name":"Upper Counselor Kintō",
        "translation": "滝の音が聞こえなくなってから久しくなりますが、その名声は今も流れ伝わっています。",
        "background": "この歌は、大覚寺にある庭園の<ruby>滝殿跡<rt>たきどのあと</rt></ruby>で詠まれました。大覚寺は元々、嵯峨天皇の別荘で、庭には美しい滝がありました。公任が訪れたときには滝の水は流れていませんでしたが、彼はかつての滝の姿を思い描きながら、その評判は今も広く伝わっていると詠みました。",
        "personality": "大納言公任こと藤原公任は博学多才で漢詩、和歌、管弦楽の3つの才能を兼ね備えた「<ruby>三舟<rt>さんせき</rt></ruby>の<ruby>才<rt>さい</rt></ruby>」として知られていました。一方で、一条天皇の女御だった藤原詮子（藤原道長の姉）に対して「こちらの女御はいつ皇后になられるのか」と軽口を叩き、恨みを買ってしまうという軽率な一面もありました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo.svg' alt='縁語'  class='shadow trigger'>",
        "engoLink": "「滝」と「流れ」が縁語です。",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "56": {
        "number": "56",
        "name": "<ruby>和泉式部<rt>いずみしきぶ</rt></ruby>",
        "date": "生没年不詳",
        "source": "後拾遺集 恋",
        "theme": "love",
        "first": "あらざら<ruby>む<rt>ん</rt></ruby><br>この<ruby>世<rt>よ</rt></ruby>のほかの<br><ruby>思<rt>おも</rt></ruby><ruby>ひ<rt>い</rt></ruby><ruby>出<rt>で</rt></ruby>に",
        "second": "いまひとたびの<br><ruby>逢<rt>お</rt></ruby><ruby>ふ<rt>う</rt></ruby>こともがな",
        "torihuda": "いまひとた<br>ひのあふこ<br>ともかな",
        "eng":"Soon, I'll be leaving this world behind.<br>I wish for one more meeting with you, to take as a memory to the  heaven.",
        "eng_name":"Izumi Shikibu",
        "translation": "もうすぐ私はこの世を去ってしまうことでしょう。あの世へ持っていく思い出に、もう一度あなたにお会いしたいものです。",
        "background": "後拾遺集の詞書に「<ruby>心地<rt>ここち</rt></ruby>れいならず<ruby>侍<rt>はべ</rt></ruby>りけるころ、人のもとにつかはしける」とあり、この歌は、病床に伏した和泉式部が不安の中で恋人に向けて詠んだものです。恋人は誰を指すのかは不明です。",
        "personality": "橘道貞との間に<a href='60.html'>小式部内侍（60番）</a>を設けた後、冷泉天皇の第三皇子・<ruby>為尊<rt>ためたか</rt></ruby>親王、第四皇子・<ruby>敦道<rt>あつみち</rt></ruby>親王と恋愛関係になりました。このことで父親から縁を切られています。紫式部は和泉式部について「男女関係にだらしがない人だが、文才がある人でちょっとした言葉にも色艶が見えて魅力的である」と評価しています。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "57": {
        "number": "57",
        "name": "<ruby>紫式部<rt>むらさきしきぶ</rt></ruby>",
        "date": "970年頃～1014年頃",
        "source": "新古今集 雑",
        "theme": "misc",
        "first": "めぐり<ruby>逢<rt>あ</rt></ruby><ruby>ひ<rt>い</rt></ruby>て<br><ruby>見<rt>み</rt></ruby>しやそれとも<br>わかぬ<ruby>間<rt>ま</rt></ruby>に",
        "second": "<ruby>雲隠<rt>くもがく</rt></ruby>れにし<br><ruby>夜半<rt>よわ</rt></ruby>の<ruby>月<rt>つき</rt></ruby>かな",
        "torihuda": "くもかくれ<br>にしよはの<br>つきかな",
        "eng":"Just when I thought we had finally met again,<br>You disappeared in the blink of an eye, like the midnight moon hidden behind the clouds.",
        "eng_name":"Murasaki Shikibu",
        "translation": "久しぶりに会えたと思ったら、あなたはあっと言う間に帰ってしまわれた。雲間に隠れた夜半の月のように。",
        "background": "久しぶりに再会した幼友達と思い出話に花を咲かせたいと思った紫式部。しかし、その友人はさっさと帰ってしまいました。彼女はせっかく再会できたのにと名残り惜しみながらこの歌を詠みました。）",
        "personality": "紫式部は漢詩の素養がありましたが、幼少期に父親から「男だったらよかったのに」と嘆かれていたため、初めて宮仕えした頃は漢字の「<ruby>一<rt>いち</rt></ruby>」という文字さえ書けないふりをしていたとか。しかし、紫式部が執筆していた源氏物語が藤原道長の目に留まり、一条天皇の中宮・彰子の女房に抜擢されました。紫式部の名前は源氏物語のヒロイン「紫の上」と父の官職「式部の丞」が由来です。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo.svg' alt='縁語'  class='shadow trigger'>",
        "engoLink": "「めぐり」と「月」が縁語です。<br>月は満ち欠けする様子から「めぐる」関連が深いとされています。",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "58": {
        "number": "58",
        "name": "<ruby>大弐三位<rt>だいにのさんみ</rt></ruby>",
        "date": "999年～没年不詳",
        "source": "後拾遺集 恋",
        "theme": "love",
        "first": "ありま<ruby>山<rt>やま</rt></ruby><br><ruby>猪名<rt>いな</rt></ruby>の<ruby>笹原<rt>ささはら</rt></ruby><br><ruby>風<rt>かぜ</rt></ruby><ruby>吹<rt>ふ</rt></ruby>けば",
        "second": "いでそよ<ruby>人<rt>ひと</rt></ruby>を<br><ruby>忘<rt>わす</rt></ruby>れやはする",
        "torihuda": "いてそよひ<br>とをわすれ<br>やはする",
        "eng":"The wind gently rustles through the bamboo grass fields of Ina near Mount Arima, whispering softly.<br>Indeed, can I forget about you?<br>No, I cannot.",
        "eng_name":"Daini no Sanmi",
        "translation": "有馬山に近い猪名の笹原に風が吹きそよそよと音が響きわたります。さぁそうですよ。私があなたのことを忘れられるでしょうか。いいえ忘れられません。",
        "background": "久しく連絡の途絶えていた男性から「心変わりしたのではないか」との手紙が送られてきて、それに対する返事として生まれたのがこの歌です。",
        "personality": "大弐三位こと、<ruby>賢子<rt>かたいこ</rt></ruby>は紫式部の娘で、母の後を継いで一条天皇の中宮・彰子に仕え、後冷泉天皇の乳母を務めました。後冷泉天皇が即位すると、従三位（上級貴族）にまで出世しました。大弐三位の由来は、30代半ばで結婚した高階成章の官職が太宰大弐で位階が正三位であったことと大弐三位自身の位階が従三位であったことに由来しているといわれています。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba.svg' alt='掛詞' class='box trigger'>",
        "kakekotobaLink": "「そよ」は葉音を表す「そよ」と「そうですよ」を意味する「其よ」の掛詞です。",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba.svg' alt='序詞' class='shadow trigger'>",
        "jokotobaLink": "<p>「ありま山 猪名の笹原 風吹けば」が「そよ」を引き出す序詞になっています。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "<img src='../img/mark_utamakura.svg' alt='歌枕' class='shadow trigger'>",
        "utamakuraLink": "utamakura.html?lat=34.78891&lng=135.25716&zoom=13",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "59": {
        "number": "59",
        "name": "<ruby>赤染衛門<rt>あかぞめえもん</rt></ruby>",
        "date": "956年？～1041年？",
        "source": "後拾遺集 恋",
        "theme": "love",
        "first": "やすら<ruby>は<rt>わ</rt></ruby>で<br><ruby>寝<rt>ね</rt></ruby>なましものを<br><ruby>小夜<rt>さよ</rt></ruby><ruby>更<rt>ふ</rt></ruby>けて",
        "second": "かたぶくまでの<br><ruby>月<rt>つき</rt></ruby>を<ruby>見<rt>み</rt></ruby>しかな",
        "torihuda": "かたふくま<br>てのつきを<br>みしかな",
        "eng":"If I had known you wouldn't come, I would have slept without hesitation.<br>But as I waited, the night grew late,<br>And I found myself gazing at the moon tilting in the western sky",
        "eng_name":"Akazome Emon",
        "translation": "あなたが来ないと分かっていたなら、ためらわずに眠りについたでしょうに。待ち続けるうちに夜が更けて、西の空に傾く月を見上げることになってしまったのです。",
        "background": "後拾遺集の詞書によると、この歌は作者の姉妹のもとに通っていた藤原道隆が、ある夜、約束していた逢瀬に現れなかったため、その姉妹の代わりに詠んだものです。",
        "personality": "赤染衛門の名前は、父親が右衛門尉であったことに由来します。彼女は藤原道長の正妻である倫子に仕えました。その後、倫子の娘で一条天皇の中宮である彰子にも仕えました。この時期に紫式部や和泉式部と同僚として活躍しています。文学の才能にも恵まれ、『栄華物語』の作者としても知られています。また、大江匡衡と仲睦まじい夫婦で良妻賢母としても知られています。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "60": {
        "number": "60",
        "name": "<ruby>小式部内侍<rt>こしきぶのないし</rt></ruby>",
        "date": "生年不詳～1025年",
        "source": "金葉集 雑",
        "theme": "misc",
        "first": "<ruby>大江山<rt>おおえやま</rt></ruby><br>いく<ruby>野<rt>の</rt></ruby>の<ruby>道<rt>みち</rt></ruby>の<br><ruby>遠<rt>とお</rt></ruby>ければ",
        "second": "まだふみもみず<br><ruby>天<rt>あま</rt></ruby>の<ruby>橋立<rt>はしだて</rt></ruby>",
        "torihuda": "またふみも<br>みすあまの<br>はしたて",
        "eng":"Mount Oeyama and Ikuno road which lead to Tango where my mother lives are both distant,<br>So I have yet to set foot in the land of Amanohashidate,<br>Nor have I seen any letters from my mother.",
        "eng_name":"Koshikibu no Naishi",
        "translation": "大江山も（母の住む丹後に行く）生野の道も遠いので、まだ天橋立の地に足を踏み入れたこともありませんし、母からの手紙も見ておりません。",
        "background": "この歌は、ある歌合にて<a href='64.html'>藤原定頼（64番）</a>から「歌の名手であるお母さん（和泉式部）に歌を代筆してもらったのですか？」とからかわれて、即興で詠んだものです。藤原定頼は返歌できずに急いでその場を去ったといわれています。大江山、生野、天橋立は、母の和泉式部が住んでいた京都府北部の丹後へ向かう途中の地名です。",
        "personality": "小式部内侍は、母の<a href='56.html'>和泉式部（56番）</a>の名前を取って「小式部」という女房名で呼ばれました。母と同じく中宮・彰子に仕えましたが、20代で出産後に夭逝。『和泉式部集』には早世した娘に捧げた歌があります。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba.svg' alt='掛詞' class='box trigger'>",
        "kakekotobaLink": "「いく野」は地名の「生野」と「行く」の掛詞です。「ふみ」は手紙の「文」と橋板を踏みしめるの「踏み」の掛詞です。",
        "engoMark": "<img src='../img/mark_engo.svg' alt='縁語'  class='shadow trigger'>",
        "engoLink": "「踏み」と「橋」が縁語です。",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "<img src='../img/mark_utamakura.svg' alt='歌枕' class='shadow trigger'>",
        "utamakuraLink": "utamakura.html?lat=35.5698&lng=135.19182&zoom=15",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "61": {
        "number": "61",
        "name": "<ruby>伊勢大輔<rt>いせのたいふ</rt></ruby>",
        "date": "生没年不詳",
        "source": "詞花集 春",
        "theme": "spring",
        "kotobagaki":"一条院の御時、奈良の八重桜を、人の奉りて侍りけるを、そのおり、御前に侍りければ、その花をたまひて、歌詠めと仰せ言ありければ",
        "first": "いにし<ruby>へ<rt>え</rt></ruby>の<br><ruby>奈良<rt>なら</rt></ruby>の<ruby>都<rt>みやこ</rt></ruby>の<br><ruby>八重桜<rt>やえざくら</rt></ruby>",
        "second": "<ruby>けふ<rt>きょう</rt></ruby><ruby>九重<rt>ここのえ</rt></ruby>に<br><ruby>匂<rt>にお</rt></ruby><ruby>ひ<rt>い</rt></ruby>ぬるかな",
        "torihuda": "けふここの<br>へににほひ<br>ぬるかな",
        "eng":"Acient capital Nara's double cherry blossoms,<br>Now bloom proudly in Kyoto's imperial palace.",
        "eng_name":"Ise no Taifu",
        "translation": "古都奈良で咲き誇っていた八重桜が、今は京都の宮中で美しく咲き誇っていますよ。",
        "background": "奈良の興福寺から八重桜の一枝が宮中に献上された際、伊勢大輔が急遽その八重桜を取り入れる役目を担いました。八重桜が美しく咲き誇る様を一条天皇の栄華に見立て、「いにしえ」と「けふ」、「八重桜」と「九重」という2つの対句を用い、即興で考えたとは思えないほどの出来栄えでした。藤原清輔は『袋草子』で周囲の反応について「万人感嘆、宮中鼓動す」と記しています。",
        "personality": "伊勢大輔は、<a href='49.html'>大中臣能宣朝臣（49番）</a>の孫です。父親が伊勢神宮の神祇官の<ruby>大輔<rt>たいふ</rt></ruby>であったことが名前の由来です。中宮・彰子に仕え、<a href='56.html'>和泉式部（56番）</a>や<a href='57.html'>紫式部（57番）</a>とも交流がありました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "62": {
        "number": "62",
        "name": "<ruby>清少納言<rt>せいしょうなごん</rt></ruby>",
        "date": "生没年不詳",
        "source": "後拾遺集 雑",
        "theme": "misc",
        "first": "<ruby>夜<rt>よ</rt></ruby>をこめて<br><ruby>鳥<rt>とり</rt></ruby>のそらねは<br>はかるとも",
        "second": "よに<ruby>逢坂<rt>おうさか</rt></ruby>の<br><ruby>関<rt>せき</rt></ruby>は<ruby>許<rt>ゆる</rt></ruby>さじ",
        "torihuda": "よにあふさ<br>かのせきは<br>ゆるさし",
        "eng":"Before dawn breaks,<br>Even if you mimic the crowing of a rooster to deceive others,<br>The barrier at Ausaka Pass will never open.",
        "eng_name":"Sei Shōnagon",
        "translation": "夜が明けないうちに、鶏の鳴き真似をして人をだまそうとしても、この逢坂の関は決して開きませんよ。",
        "background": "夜明けを待たずに帰ってしまった男性が翌朝「名残惜しかったが、鶏の鳴き声に急き立てられて帰ったのです」と文を寄越しました。これに対して清少納言は<ruby>函谷関<rt>かんこくかん</rt></ruby>の話（<ruby>孟嘗君<rt>もうしょうくん</rt></ruby>が部下に鶏の鳴き真似をさせ、夜中に開門させたという中国の故事）を踏まえて、函谷関はだませても、逢坂の関はだませませんよと応じました。相手の男性は能書家で知られる藤原行成。<a href='/50.html'>藤原義孝（50番）</a>の長男です。",
        "personality": "清少納言は、<a href='36.html'>清原深養父（36番）</a>の曾孫、<a href='42.html'>清原元輔（42番）</a>の娘です。彼女は中宮・定子に仕え「春はあけぼの」の書き出しで有名な『枕草子』の作者です。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba.svg' alt='掛詞' class='box trigger'>",
        "kakekotobaLink": "「逢坂」は「逢う」の掛詞です。",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "<img src='../img/mark_utamakura.svg' alt='歌枕' class='shadow trigger'>",
        "utamakuraLink": "utamakura.html?lat=34.65030881058312&lng=110.93147894044522&zoom=12",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "63": {
        "number": "63",
        "name": "<ruby>左京大夫道雅<rt>さきょうのだいぶみちまさ</rt></ruby>",
        "date": "992年～1054年",
        "source": "後拾遺集 恋",
        "theme": "love",
        "first": "いまはただ<br><ruby>思<rt>おも</rt></ruby>ひ<ruby>絶<rt>た</rt></ruby>えな<ruby>む<rt>ん</rt></ruby><br>とばかりを",
        "second": "<ruby>人<rt>ひと</rt></ruby>づてならで<br><ruby>言<rt>い</rt></ruby><ruby>ふ<rt>う</rt></ruby>よしもがな",
        "torihuda": "ひとつてな<br>らていふよ<br>しもかな",
        "eng":"Now that we are prohibited to meet,<br>If I had a way to directly convey,<br>\"At least let's give up on our feelings for each other,\"<br>Instead of through a third party.",
        "eng_name":"Master of the Left Capital Michimasa",
        "translation": "逢うことが許されなくなった今となっては「あなたへの思いをあきらめましょう」とせめて人づてでなく、直接伝えられる方法があったらよいのに。",
        "background": "伊勢神宮の斎宮だった皇女・<ruby>当子<rt>まさこ</rt></ruby>内親王を愛した作者。しかし、この恋が明るみに出ると、彼女の父親である三条院は娘を守るために厳しい警護を敷きました。その結果、作者は愛する人に会うことさえ許されず、この辛い別れを歌に詠みました。",
        "personality": "本名：藤原通雅は、中関白家に生まれましたが、道雅の父・伊周が法皇に弓を放ったことが原因で、一族は没落していきました。通雅は自暴自棄になったのか、暴力事件を起こすなど、素行が悪く「<ruby>荒三位<rt>あらざんみ</rt></ruby>」と呼ばれました。殺人事件の黒幕に名前が挙がることもありました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "64": {
        "number": "64",
        "name": "<ruby>権中納言定頼<rt>ごんちゅうなごんさだより</rt></ruby>",
        "date": "995年～1045年",
        "source": "千載集 冬",
        "theme": "winter",
        "first": "<ruby>朝<rt>あさ</rt></ruby>ぼらけ<br><ruby>宇治<rt>うじ</rt></ruby>の<ruby>川霧<rt>かわぎり</rt></ruby><br><ruby>絶<rt>た</rt></ruby>え<ruby>絶<rt>だ</rt></ruby>えに",
        "second": "あら<ruby>は<rt>わ</rt></ruby>れわたる<br><ruby>瀬々<rt>せぜ</rt></ruby>の<ruby>網代木<rt>あじろぎ</rt></ruby>",
        "torihuda": "あらはれわ<br>たるせせの<br>あしろき",
        "eng":"As dawn gently approaches,<br>The morning mist on the Uji River intermittently breaks,<br>Revealing the Ajirogi in the shallow area.",
        "eng_name":"Acting Middle Counselor Sadayori",
        "translation": "夜がほんのり明けてくる頃、宇治川の朝霧が途切れ途切れになり、霧の絶え間のあちこちから現れわたる瀬々の網代木よ。",
        "background": "『千載集』には「宇治にまかりて侍りける時詠める」と書かれています。この歌は、定頼が宇治を訪れたときに詠まれました。冷えた川の表面から立ち上る霧に光が差し込み、霧の切れ目から見える<ruby>網代木<rt>あじろぎ</rt></ruby>は、宇治川の冬の風物詩です。<ruby>網代木<rt>あじろぎ</rt></ruby>とは、鮎の稚魚を取るために竹などを編んだざるを設置するための杭のことです。",
        "personality": "権中納言定頼は<a href='55.html'>藤原公任（55番）</a>の息子です。優れた歌人でしたが、<a href='60.html'>小式部内侍（60番）</a>に軽口を叩き、彼女の見事な返歌にやりこめられたことで、軽率な人物としても知られるようになりました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "<img src='../img/mark_utamakura.svg' alt='歌枕' class='shadow trigger'>",
        "utamakuraLink": "utamakura.html?lat=34.88887&lng=135.80898&zoom=15",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "65": {
        "number": "65",
        "name": "<ruby>相模<rt>さがみ</rt></ruby>",
        "date": "生没年不詳",
        "source": "後拾遺集 恋",
        "theme": "love",
        "first": "<ruby>恨<rt>うら</rt></ruby>みわび<br>ほさぬ<ruby>袖<rt>そで</rt></ruby>だに<br>あるものを",
        "second": "<ruby>恋<rt>こい</rt></ruby>にくちな<ruby>む<rt>ん</rt></ruby><br><ruby>名<rt>な</rt></ruby>こそをしけれ",
        "torihuda": "こひにくち<br>なむなこそ<br>をしけれ",
        "eng":"With no energy left to resent and sleeves are wet with tears, left unattended,<br>What's more unfortunate than this is the tarnishing of my reputation due to this love.",
        "eng_name":"Sagami",
        "translation": "恨む気力さえなくなり、涙に濡れて乾かすひまさえない着物の袖も残念ですが、もっと残念に感じるのは、この恋のせいで浮名が立って私の評判が朽ちてしまうことです。",
        "background": "この歌は、永承六年（815年）内裏歌合で「恋」というお題で詠まれ、勝った歌です。つらい恋から立ち直れず、自身の浮名が立つことを嘆く内容です。",
        "personality": "相模という名前は相模守をしていた<ruby>大江<rt>おおえの</rt></ruby><ruby>公資<rt>きんより</rt></ruby>と結婚したことに由来していますが、その夫とは別れてしまいました。別れた後は、一条天皇の皇女である修子内親王に仕え、奔放な恋愛人生を送りました。歌人としても高く評価され、後拾遺和歌集には、彼女の歌が40首も収録されました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "66": {
        "number": "66",
        "name": "<ruby>前大僧正行尊<rt>さきのだいそうじょうぎょうそん</rt></ruby>",
        "date": "1055年～1135年",
        "source": "金葉集 雑",
        "theme": "misc",
        "first": "もろともに<br>あ<ruby>は<rt>わ</rt></ruby>れと<ruby>思<rt>おも</rt></ruby><ruby>へ<rt>え</rt></ruby><br><ruby>山桜<rt>やまざくら</rt></ruby>",
        "second": "<ruby>花<rt>はな</rt></ruby>よりほかに<br><ruby>知<rt>し</rt></ruby>る<ruby>人<rt>ひと</rt></ruby>もなし",
        "torihuda": "はなよりほ<br>かにしるひ<br>ともなし",
        "eng":"As I long for you, O mountain cherry blossoms,<br>Please think of me in return.<br>For there is no other who can understand my heart as you do.",
        "eng_name":"Senior High Priest Gyōson",
        "translation": "私が懐かしく思うように、私を思っておくれ山桜よ。心を通い合わせられる相手は他にいないのだから。",
        "background": "『金葉集』の詞書に「大峰にて思ひがけず桜の花を見て詠める」と書かれています。大峰山で厳しい山伏修行に励んでいた行尊が、ある日山桜を見つけました。厳しい環境の中でただ一本だけ美しく咲く桜を見て、行尊は桜と自分が通じ合える存在だと感じたようです。",
        "personality": "行尊は<a href='68.html'>三条院（68番）</a>の曾孫で、10歳で父を亡くし、12歳で出家しました。円城寺で密教を学び、その後、大峰山や熊野などで山伏修行を積みました。山を神仏に見立て、厳しい修行に耐える生活を送りました。その結果、円城寺の大僧正として最高の地位にまで上り詰めました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "67": {
        "number": "67",
        "name": "<ruby>周防内侍<rt>すおうのないし</rt></ruby>",
        "date": "生没年不詳",
        "source": "千載集 雑",
        "theme": "misc",
        "first": "<ruby>春<rt>はる</rt></ruby>の<ruby>夜<rt>よ</rt></ruby>の<br><ruby>夢<rt>ゆめ</rt></ruby>ばかりなる<br><ruby>手枕<rt>たまくら</rt></ruby>に",
        "second": "か<ruby>ひ<rt>い</rt></ruby>なく<ruby>立<rt>た</rt></ruby>た<ruby>む<rt>ん</rt></ruby><br><ruby>名<rt>な</rt></ruby>こそをしけれ",
        "torihuda": "かひなくた<br>たむなこそ<br>をしけれ",
        "eng":"Even in the brief dreamlike moments of spring nights,<br>I don't need your pillow for my hand.<br>It would be troublesome if any strange rumors spread.",
        "eng_name":"Suō no Naishi",
        "translation": "春の夜の夢のような短い間でも、あなたの手枕は要りません。変な評判が立ったら困りますから。",
        "background": "二条院で人々が夜通し語らいあっていたときに作者が「眠くなったので枕がほしい」と言ったところ、大納言の藤原忠家が御簾の外からすっと手を伸ばし「枕にどうぞ」と言ってきました。このときに即興で詠み上げられたのがこの歌です。本気の恋で浮名が立つならいざ知らず、つまらないことで浮名が立つなんて許せなかったのでしょう。ちなみに藤原忠家は<a href='97.html'>藤原定家（97番）</a>の曾祖父にあたります。",
        "personality": "周防内侍の名前は父が周防守であったことに由来します。後冷泉、後三条、白河、堀河と4人もの天皇に仕え、宮廷歌人として名を馳せました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba.svg' alt='掛詞' class='box trigger'>",
        "kakekotobaLink": "「かひな」は「甲斐なく」と「腕（かいな）」の掛詞です。",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "68": {
        "number": "68",
        "name": "<ruby>三条院<rt>さんじょういん</rt></ruby>",
        "date": "976年～1017年",
        "source": "後拾遺集 雑",
        "theme": "misc",
        "first": "<ruby>心<rt>こころ</rt></ruby>にも<br>あらで<ruby>憂<rt>う</rt></ruby>き<ruby>世<rt>よ</rt></ruby>に<br>ながら<ruby>へ<rt>え</rt></ruby>ば",
        "second": "<ruby>恋<rt>こい</rt></ruby>しかるべき<br><ruby>夜半<rt>よわ</rt></ruby>の<ruby>月<rt>つき</rt></ruby>かな",
        "torihuda": "こひしかる<br>へきよはの<br>つきかな",
        "eng":"Though my life has become one I don't particularly wish to live,<br>If I manage to survive, I will surely recall this late-night moon with longing.",
        "eng_name":"Retired Emperor Sanjō",
        "translation": "こんな人生を生きたくなかった。それでも、生き延びたら、この夜更けの月を切なくも愛しく思い出すだろう。",
        "background": "この歌は、三条院が孫を天皇にしたい藤原道長から譲位を迫られた時に詠んだものです。三条院は眼の病気でほとんど見えなくなっており、失意の中でこの歌を詠みました。月の光を感じられる今を恋しく思う日が来るだろうと静かに考えていたのでしょう。この歌を詠んでから約1カ月後に退位しました。",
        "personality": "三条院は、冷泉天皇の第二皇子として生まれ、36歳で天皇に即位しました。しかし、在位期間はわずか5年でした。その間に2度も内裏が火災に見舞われ、さらに失明につながる病気にも苦しみました。譲位後、三条院は出家し、翌年に亡くなりました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "69": {
        "number": "69",
        "name": "<ruby>能因法師<rt>のういんほうし</rt></ruby>",
        "date": "988年～没年不詳",
        "source": "後拾遺集 秋",
        "theme": "autumn",
        "first": "<ruby>嵐<rt>あらし</rt></ruby><ruby>吹<rt>ふ</rt></ruby>く<br><ruby>三室<rt>みむろ</rt></ruby>の<ruby>山<rt>やま</rt></ruby>の<br><ruby>紅葉<rt>もみじ</rt></ruby><ruby>葉<rt>ば</rt></ruby>は",
        "second": "<ruby>竜田<rt>たつた</rt></ruby>の<ruby>川<rt>かわ</rt></ruby>の<br><ruby>錦<rt>にしき</rt></ruby>なりけり",
        "torihuda": "たつたのか<br>はのにしき<br>なりけり",
        "eng":"The maple leaves scattered by the storm on Mount Mimuro<br>Beautifully adorn the surface of the Tatsuta River<br>Like a brocades.",
        "eng_name":"Priest Nōin",
        "translation": "嵐で吹き散った三室山のもみじが龍田川の川面をまるで錦織物のように美しく彩っているよ。",
        "background": "この歌は、後冷泉天皇の宮中の歌合が開催されたときに「紅葉」というお題に沿って詠まれました。",
        "personality": "能因法師は<ruby>文章生<rt>もんじょうしょう</rt></ruby>でしたが、26歳で出家しました。歌枕（歌でよく詠まれる名所）を多く旅したことで有名な歌人です。あるとき「都をば霞と共に立ちしかど秋風ぞ吹く白河の関」（現代語訳:都を春の霞が出るころに旅に出たが、白川の関につく頃にはもう秋風が吹いている。）を作歌したときは、ただ発表するだけでは飽き足りないと考えたようで、実際には旅をせずに近場で日焼けをして、まるで奥州を旅してきたように装って歌を披露したという逸話が残っています。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "<img src='../img/mark_utamakura.svg' alt='歌枕' class='shadow trigger'>",
        "utamakuraLink": "utamakura.html?lat=34.60038373185413&lng=135.7151239556404&zoom=15",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "70": {
        "number": "70",
        "name": "<ruby>良暹法師<rt>りょうぜんほうし</rt></ruby>",
        "date": "生没年不詳",
        "source": "後拾遺集 秋",
        "theme": "autumn",
        "first": "さびしさに<br><ruby>宿<rt>やど</rt></ruby>を<ruby>立<rt>た</rt></ruby>ち<ruby>出<rt>い</rt></ruby>でて<br>ながむれば",
        "second": "い<ruby>づ<rt>ず</rt></ruby>くも<ruby>同<rt>おな</rt></ruby>じ<br><ruby>秋<rt>あき</rt></ruby>の<ruby>夕<rt>ゆう</rt></ruby><ruby>暮<rt>ぐれ</rt></ruby>",
        "torihuda": "いつくもお<br>なしあきの<br>ゆふくれ",
        "eng":"Unable to bear the loneliness, I stepped out of my hermitage,<br>Yet everywhere, it's the same lonely autumn dusk.",
        "eng_name":"Priest Ryōzen",
        "translation": "寂しさに耐えかねて庵から出てみたけれど、どこも同じように寂しい秋の夕暮れだ。",
        "background": "この歌は、比叡山の僧侶であった作者が京都の大原で隠棲し始めたときに詠んだといわれています。大原は自然が多く、人は少ない場所です。人恋しくなって庵を飛び出した作者ですが、秋の夕暮れの寂しさに風情を感じるようになった心情の変化を歌に詠んでいます。ちなみに「秋の夕暮」で終わる和歌は多いですが、この歌が先駆けになったとされています。",
        "personality": "良暹法師は比叡山延暦寺の僧侶となり<ruby>祇園社<rt>ぎおんしゃ</rt></ruby>（現在の八坂神社）の<ruby>別当<rt>べっとう</rt></ruby>（統括する役職）を務めた後、大原の里に人知れず暮らしていました。晩年は京都市内の雲林院というお寺で過ごしたといわれています。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "71": {
        "number": "71",
        "name": "<ruby>大納言経信<rt>だいなごんつねのぶ</rt></ruby>",
        "date": "1016年～1097年",
        "source": "金葉集 秋",
        "theme": "autumn",
        "first": "<ruby>夕<rt>ゆう</rt></ruby>されば<br><ruby>門田<rt>かどた</rt></ruby>の<ruby>稲葉<rt>いなば</rt></ruby><br>おと<ruby>づ<rt>ず</rt></ruby>れて",
        "second": "<ruby>蘆<rt>あし</rt></ruby>のまろやに<br><ruby>秋風<rt>あきかぜ</rt></ruby>ぞ<ruby>吹<rt>ふ</rt></ruby>く",
        "torihuda": "あしのまろ<br>やにあきか<br>せそふく",
        "eng":"In the evening, the rice leaves by the gate rustle,<br>While the autumn wind blows through this thatched hermitage.",
        "eng_name":"Upper Counselor Tsunenobu",
        "translation": "夕方になると、門前の稲の葉は音を立て、葦葺きのこの庵には秋風が吹きつけてきた。",
        "background": "この歌はある作者の親戚の別荘で催された歌会で「田家の秋風」というお題に沿って詠まれました。当時は田園趣味が流行し、洛外の田舎に山荘を建てる貴族が多くいたそうです。この歌は、山荘を田家に見立てて秋の音とその訪れを巧に表現しています。",
        "personality": "白河院の大堰川行幸の際に和歌、漢詩、琵琶の3つの舟に分乗し才能を競う舟遊びが行われ、遅れてきた大納言経信は、どの舟でも構わないから乗せてほしいと言って多才ぶりをアピールしたそうです。実際に和歌、漢詩、琵琶のいずれの才能にも秀でていて<a href='55.html'>藤原公任（55番）</a>と同様に「<ruby>三舟<rt>さんせき</rt></ruby>の<ruby>才<rt>さい</rt></ruby>」と称せられました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "72": {
        "number": "72",
        "name": "<ruby>祐子内親王家紀伊<rt>ゆうしないしんのうけのきい</rt></ruby>",
        "date": "生没年不詳",
        "source": "金葉集 恋",
        "theme": "love",
        "first": "<ruby>音<rt>おと</rt></ruby>に<ruby>聞<rt>き</rt></ruby>く<br><ruby>高師<rt>たかし</rt></ruby>の<ruby>浜<rt>はま</rt></ruby>の<br>あだ<ruby>波<rt>なみ</rt></ruby>は",
        "second": "かけじや<ruby>袖<rt>そで</rt></ruby>の<br>ぬれもこそすれ",
        "torihuda": "かけしやそ<br>てのぬれも<br>こそすれ",
        "eng":"Let's avoid the mischievous waves at Takashi-no-hama beach, As I don't want to wet my sleeves needlessly.",
        "eng_name":"Kii of Princess Yūshi's Household",
        "translation": "噂に聞くいたずらに立ち騒ぐ高師の浜の波にかからないようにしましょう。袖を濡らしたくありません。",
        "background": "この歌は「<ruby>堀河院<rt>ほりかわいん</rt></ruby><ruby>艶書合<rt>えんしょあわせ</rt></ruby>」で詠まれました。<ruby>艶書合<rt>えんしょあわせ</rt></ruby>とは、男性が恋の歌を送り、それに女性が返歌する形式の歌合です。29歳の藤原俊忠が「人知れぬ 思いあり その浦風に 波のよるこそ 言はまほしけれ」（現代語訳：人目につかない恋心がある。荒れ磯の浜風に寄せる波のように、夜になればお話したい）と詠んだのに対して、70歳の作者は「あだなみ（浮気者の言葉）に思いをかけません」と粋な歌で返したのでした。",
        "personality": "作者は後朱雀天皇の第一皇女・祐子内親王の<ruby>女房<rt>にょうぼう</rt></ruby>で、長く歌人として活躍しました。夫といわれる藤原重経の官職が<ruby>紀伊守<rt>きいのかみ</rt></ruby>だったことが名前の由来です。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba.svg' alt='掛詞' class='box trigger'>",
        "kakekotobaLink": "「高師」は「高し」の掛詞です。",
        "engoMark": "<img src='../img/mark_engo.svg' alt='縁語'  class='shadow trigger'>",
        "engoLink": "「浜」、「波」、「ぬれ」は縁語です。",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "<img src='../img/mark_utamakura.svg' alt='歌枕' class='shadow trigger'>",
        "utamakuraLink": "utamakura.html?lat=34.52765&lng=135.43255&zoom=15",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "73": {
        "number": "73",
        "name": "<ruby>権中納言匡房<rt>ごんちゅうなごんまさふさ</rt></ruby>",
        "date": "1041年～1111年",
        "source": "後拾遺集 春",
        "theme": "spring",
        "first": "<ruby>高砂<rt>たかさご</rt></ruby>の<br><ruby>尾<rt>お</rt></ruby>の<ruby>上<rt>へ</rt></ruby>の<ruby>桜<rt>さくら</rt></ruby><br><ruby>咲<rt>さ</rt></ruby>きにけり",
        "second": "<ruby>外山<rt>とやま</rt></ruby>の<ruby>霞<rt>かすみ</rt></ruby><br><ruby>立<rt>た</rt></ruby>たずもあらな<ruby>む<rt>ん</rt></ruby>",
        "torihuda": "とやまのか<br>すみたたす<br>もあらなむ",
        "eng":"Beautiful cherry blossoms seem to have bloomed on a high mountain ridge.<br>Oh, haze of the mountains near the village, don't block my view!<br>I want to see the beautiful cherry blossoms.",
        "eng_name":"Acting Middle Counselor Masafusa",
        "translation": "高い山の尾根に美しい桜が咲いたようだ。人里近くの山の霞よ、どうか立たないでほしい。美しい桜が見たいから。",
        "background": "この歌は内大臣藤原師通の邸宅で酒宴が催されたときに「遙かに山桜を望む」というお題に沿って詠まれたものです。",
        "personality": "権中納言匡房こと大江匡房は、<a href='59.html'>赤染衛門（59番）</a>のひ孫にあたります。代々学者を輩出する家柄で、匡房自身も幼少期から学問に優れ、16歳で<ruby>文章得業生<rt>もんじょうとくぎょうしょう</rt></ruby>（大学院で研究する学生）になりました。<ruby>有職故実<rt>ゆうそくこじつ</rt></ruby>に詳しく、後三条天皇、白河天皇、堀河天皇の教育係を務め、様々な政策を助言するブレーンとして後三条天皇に登用され、中納言にまで出世しました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "74": {
        "number": "74",
        "name": "<ruby>源俊頼朝臣<rt>みなもとのとしよりあそん</rt></ruby>",
        "date": "1055年～1129年",
        "source": "千載集 恋",
        "theme": "love",
        "first": "<ruby>憂<rt>う</rt></ruby>かりける<br><ruby>人<rt>ひと</rt></ruby>を<ruby>初瀬<rt>はつせ</rt></ruby>の<br><ruby>山<rt>やま</rt></ruby>おろしよ",
        "second": "はげしかれとは<br><ruby>祈<rt>いの</rt></ruby>らぬものを",
        "torihuda": "はけしかれ<br>とはいのら<br>ぬものを",
        "eng":"I prayed to the Kannon at Hatsuse, hoping that unkind person would show some love,<br>But oh, mountain wind of Hatsuse, I did not pray for you that my beloved would be as cold and fierce as you are.",
        "eng_name":"Minamoto no Toshiyori Ason",
        "translation": "つれないあの人が私になびくように初瀬の観音様に祈りこそしましたが、初瀬の山おろしよ。お前のように冷たく激しくなれとは祈ってもいないのに。",
        "background": "この歌は「祈れども逢わざる恋」というお題に沿って詠まれたものです。「初瀬」は奈良県桜井市にある地名のことで、観音信仰で有名な長谷寺があります。",
        "personality": "源俊頼は革新的な歌風で知られ、伝統的な歌風の<a href='75.html'>藤原基俊（75番）</a>と共に当時の歌壇の双璧でした。俊頼は、<ruby>篳篥<rt>しちりき</rt></ruby>の名手で堀河天皇のもとで<ruby>楽人<rt>がくじん</rt></ruby>として高く評価されました。和歌にも秀でており、白河院の命を受け『金葉和歌集』の撰者に携わりました。<a href='73.html'>大納言経信（73番）</a>の三男で、彼の息子には<a href='85.html'>俊恵法師（85番）</a>がおり、3代にわたって百人一首に収められています。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "<img src='../img/mark_utamakura.svg' alt='歌枕' class='shadow trigger'>",
        "utamakuraLink": "utamakura.html?lat=34.52658&lng=135.90872&zoom=15",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "75": {
        "number": "75",
        "name": "<ruby>藤原基俊<rt>ふじわらのもととし</rt></ruby>",
        "date": "1060年～1142年",
        "source": "千載集 雑",
        "theme": "misc",
        "first": "<ruby>契<rt>ちぎ</rt></ruby>りおきし<br>させもが<ruby>露<rt>つゆ</rt></ruby>を<br>いのちにて",
        "second": "あ<ruby>は<rt>わ</rt></ruby>れ<ruby>今年<rt>ことし</rt></ruby>の<br><ruby>秋<rt>あき</rt></ruby>もいぬめり",
        "torihuda": "あはれこと<br>しのあきも<br>いぬめり",
        "eng":"The precious words you promised, like dew on grass, though I cherished them as if they were my life. Ah... this year's autumn seems to pass emptily once again.",
        "eng_name":"Fujiwara no Mototoshi",
        "translation": "約束してくださった「さしも草の」の歌の露のようなありがたい言葉を命のように大切にしていたのに。ああ…今年の秋もむなしく過ぎていくようだ。",
        "background": "興福寺で僧をしている息子・<ruby>光覚<rt>こうかく</rt></ruby>が<ruby>維摩会<rt>ゆいまえ</rt></ruby>の講師になれるように<a href='76.html'>法性寺入道前関白太政大臣（76番）</a>に対して依頼したところ<a href='#shimejigahara')'>「<ruby>標茅<rt>しめじ</rt></ruby>が<ruby>原<rt>はら</rt></ruby>の」</a>とある歌の一説を返されました。作者は願いが聞き入れられたとこの言葉を当てにしていましたが、光覚は講師の選から漏れてしまいました。作者はそのことを恨んでこの歌を詠んでいます。",
        "personality": "基俊は藤原道長の曾孫でしたが官位は従五位下に終わりました。歌風は伝統的な立場を重んじ、革新的な歌風の<a href='/74.html'>源俊頼（74番）</a>と対立しましたが、二人は当時の歌壇の双璧でした。弟子に<a href='/83.html'>藤原俊成（83番）</a>がいます。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo.svg' alt='縁語'  class='shadow trigger'>",
        "engoLink": "「おき」と「露」は縁語です。",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "76": {
        "number": "76",
        "name": "<ruby>法性寺入道前関白太政大臣<rt>ほっしょうじにゅうどうさきのかんぱくだいじょうだいじん</rt></ruby>",
        "date": "1097年～1164年",
        "source": "詞花集 雑",
        "theme": "misc",
        "first": "わたの<ruby>原<rt>はら</rt></ruby><br>こぎいでてみれば<br><ruby>久方<rt>ひさかた</rt></ruby>の",
        "second": "<ruby>雲<rt>くも</rt></ruby><ruby>居<rt>い</rt></ruby>にま<ruby>が<rt>ご</rt></ruby><ruby>ふ<rt>う</rt></ruby><br><ruby>沖<rt>おき</rt></ruby>つ<ruby>白波<rt>しらなみ</rt></ruby>",
        "torihuda": "くもゐにま<br>かふおきつ<br>しらなみ",
        "eng":"Setting out into the open sea,<br>White waves stood like clouds on the distant horizon.",
        "eng_name":"Lay Novice of Hosshō-ji Temple, former Kampaku and Chancellor of the Realm",
        "translation": "大海原に漕ぎ出してみれば、彼方向こうの沖に白波が雲のように立っていたよ。",
        "background": "この歌は、崇徳院が院に即位されるときの内裏歌合で「海上の遠望」というお題に沿って詠まれました。",
        "personality": "法性寺入道前関白太政大臣こと藤原忠通は摂政関白である藤原忠実の長男として生まれました。忠通には摂関家の後継者となる息子がいなかったため、異母弟の頼長を養子にしました。しかし、後に忠通に実子が生まれたため、頼長との養子縁組を解消し、実子に家を継がせようとしました。これにより、弟の頼長との間に確執が生まれ、後に保元の乱につながりました。保元の乱では、忠通は後白河院の側について戦い、勝利を収めて藤原氏の頂点に立ちました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba.svg' alt='枕詞' class='trigger'>",
        "makurakotobaLink": "「久方の」は天体に関係のある語句を導きます。この歌では「雲居」を導いています。",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "77": {
        "number": "77",
        "name": "<ruby>崇徳院<rt>すとくいん</rt></ruby>",
        "date": "1119年～1164年",
        "source": "詞花集 恋",
        "theme": "love",
        "first": "<ruby>瀬<rt>せ</rt></ruby>をはやみ<br><ruby>岩<rt>いわ</rt></ruby>にせかるる<br><ruby>滝川<rt>たきがわ</rt></ruby>の",
        "second": "われても<ruby>末<rt>すえ</rt></ruby>に<br>あ<ruby>は<rt>わ</rt></ruby><ruby>む<rt>ん</rt></ruby>とぞ<ruby>思<rt>おも</rt></ruby><ruby>ふ<rt>う</rt></ruby>",
        "torihuda": "われてもす<br>ゑにあはむ<br>とそおもふ",
        "eng":"Because the current of the river is too swift, just as the separated waters of the Takigawa eventually reunite at the rocks, Even if we part ways, I hope to meet you again someday.",
        "eng_name":"Retired Emperor Sutoku",
        "translation": "川瀬の流れが早く、岩にせきとめられた滝川が割れてもまた合流するように、あなたと別れてもいつかはまた会いたい。",
        "background": "この歌は離れ離れになった恋人との再会を誓った歌という説と、権力を失った崇徳院がいずれ復権してみせることを誓った歌だという説があります。",
        "personality": "崇徳院は鳥羽天皇の第一皇子として5歳で即位しましたが、鳥羽上皇から崇徳院は祖父の白川院の子であるとして<ruby>叔父子<rt>おじご</rt></ruby>と呼ばれ疎まれてました。22歳でだまされて天皇を譲位させられ、息子が天皇に即位する大方の予想も阻まれました。心中に鬱積した長年の憤懣から保元の乱を起こしますが、敗れて讃岐に流され、都には一度も帰ることを許されず同地で亡くなりました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba.svg' alt='掛詞' class='box trigger'>",
        "kakekotobaLink": "「われ」は「分かれ」と「別れ」の掛詞です。「あは」は「合う」と「逢う」の掛詞です。",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba.svg' alt='序詞' class='shadow trigger'>",
        "jokotobaLink": "「瀬をはやみ 岩にせかるる 滝川の」が序詞です。比喩表現で「われても末に あはむ」を修飾しています。",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "78": {
        "number": "78",
        "name": "<ruby>源兼昌<rt>みなもとのかねまさ</rt></ruby>",
        "date": "生没年不詳",
        "source": "金葉集 冬",
        "theme": "winter",
        "first": "<ruby>淡路島<rt>あわじしま</rt></ruby><br>かよ<ruby>ふ<rt>う</rt></ruby><ruby>千鳥<rt>ちどり</rt></ruby>の<br><ruby>鳴<rt>な</rt></ruby>く<ruby>声<rt>こえ</rt></ruby>に",
        "second": "<ruby>幾夜<rt></rt></ruby><ruby>寝覚<rt>ねざ</rt></ruby>めぬ<br><ruby>須磨<rt>すま</rt></ruby>の<ruby>関守<rt>せきもり</rt></ruby>",
        "torihuda": "いくよねさ<br>めぬすまの<br>せきもり",
        "eng":"How many nights has the gatekeeper of Suma been awakened by the cries of plovers coming from Awaji Island?",
        "eng_name":"Minamoto no Kanemasa",
        "translation": "淡路島から渡ってくる千鳥の鳴き声に、須磨の関守は幾夜目を覚ませられただろう。",
        "background": "この歌は「関路の千鳥」というお題に沿って詠まれたものです。須磨は源氏物語の舞台にもなっており、官位を失い年老いた光源氏が罪を逃れて隠棲した土地でした。物語では光源氏が千鳥の声を聞いて、独り寝の寂しさを歌に詠んでいます。兼昌は光源氏の歌を踏まえて作歌したと考えられています。光源氏の歌は<a href='#genjinouta' style='font-weight:bold'>こちら</a>をご参照ください。",
        "personality": "源兼昌は、宇多天皇の末裔でありながら、官位は従五位下にとどまり微官に終わりました。しかし、歌人としてその才能を発揮しました。鳥羽天皇の勅命で編纂された『永久百首』にも出詠しています。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "<img src='../img/mark_utamakura.svg' alt='歌枕' class='shadow trigger'>",
        "utamakuraLink": "utamakura.html?lat=34.32571&lng=134.81311&zoom=10",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "79": {
        "number": "79",
        "name": "<ruby>左京大夫顕輔<rt>さきょうのだいぶあきすけ</rt></ruby>",
        "date": "1090年～1155年",
        "source": "新古今集 秋",
        "theme": "autumn",
        "first": "<ruby>秋風<rt>あきかぜ</rt></ruby>に<br>たなびく<ruby>雲<rt>くも</rt></ruby>の<br>たえ<ruby>間<rt>ま</rt></ruby>より",
        "second": "もれい<ruby>づ<rt>ず</rt></ruby>る<ruby>月<rt>つき</rt></ruby>の<br><ruby>影<rt>かげ</rt></ruby>のさやけさ",
        "torihuda": "もれいつる<br>つきのかけ<br>のさやけさ",
        "eng":"How bright and clear the moonlight spills through the clouds blown by the autumn breeze!",
        "eng_name":"Master of the Left Capital Akisuke",
        "translation": "秋風にたなびく雲の切れ目から、こぼれ落ちる月の光が何と明るく澄んでいることか。",
        "background": "この歌は、中秋の名月の美しい月を詠んだ歌です。月の光が澄み渡る様子を表した「さやけさ」という言葉が印象的です。お月見は、平安時代に唐から伝わった習慣です。秋風にたなびく雲から漏れ出ずる月は、ただ美しいだけでなく、儚さも感じさせます。",
        "personality": "左京大夫顕輔こと、藤原顕輔は、平安時代後期から鎌倉時代にかけて活躍した歌人です。六条藤家の家祖・藤原顕季の息子で、和歌の家柄に生まれました。崇徳院の命を受けて、詞花和歌集の撰者になっています。左京大夫とは左京（京の東側・内裏から見て左側）の司法、行政、警察を司る役所の長官のことです。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "80": {
        "number": "80",
        "name": "<ruby>待賢門院堀河<rt>たいけんもんいんのほりかわ</rt></ruby>",
        "date": "生没年不詳",
        "source": "千載集 恋",
        "theme": "love",
        "first": "<ruby>長<rt>なが</rt></ruby>から<ruby>む<rt>ん</rt></ruby><br><ruby>心<rt>こころ</rt></ruby>もしらず<br><ruby>黒髪<rt>くろがみ</rt></ruby>の",
        "second": "みだれてけさは<br><ruby>物<rt>もの</rt></ruby>をこそ<ruby>思<rt>おも</rt></ruby><ruby>へ<rt>え</rt></ruby>",
        "torihuda": "みたれてけ<br>さはものを<br>こそおもへ",
        "eng":"You say you'll love me forever, But I can't help worrying you'll change your mind. Since we parted this morning, my heart has been depressed as tangled as this black hair.",
        "eng_name":"Horikawa, attendant to Empress Taiken",
        "translation": "末永く愛してくれるとあなたは言うけれど、心変わりするのではと気にかかって仕方がありません。お別れした今朝の私はこの黒髪のように心が乱れ、物思いに沈んでいます。",
        "background": "この歌は、崇徳院の命により作られた「久安百首」に詠進されました。<ruby>後朝<rt>きぬぎぬ</rt></ruby>の歌への返歌として詠まれています。当時、ひたすら待つ身であった女性の気持ちをうねった黒髪に見立てて、猜疑心や切なさが妖艶に表現されています。",
        "personality": "待賢門院堀河は、崇徳院の生母である待賢門院璋子に仕え、崇徳院の時代に歌人として活躍しましたが、保元の乱により崇徳院が流刑になり、待賢門院璋子とともに堀河も出家しました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo.svg' alt='縁語'  class='shadow trigger'>",
        "engoLink": "「長し」と「黒髪」は縁語です。",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "81": {
        "number": "81",
        "name": "<ruby>後徳大寺左大臣<rt>ごとくだいじのさだいじん</rt></ruby>",
        "date": "1139年～1191年",
        "source": "千載集 夏",
        "theme": "summer",
        "first": "ほととぎす<br><ruby>鳴<rt>な</rt></ruby>きつる<ruby>方<rt>かた </rt></ruby>を<br>ながむれば",
        "second": "ただ<ruby>有明<rt>ありあけ</rt></ruby>の<br><ruby>月<rt>つき</rt></ruby>ぞ<ruby>残<rt>のこ</rt></ruby>れる",
        "torihuda": "たたありあ<br>けのつきそ<br>のこれる",
        "eng":"I looked toward the direction where the lesser cuckoo sang, But I couldn't see its form, only the faint white moon remained in the sky.",
        "eng_name":"Later Tokudaiji Minister of the Left",
        "translation": "ほととぎすが鳴いた方を眺めてみたけれど、姿は見えませんでした。ただほの白い月が残っていました。",
        "background": "この歌は「暁に<ruby>郭公<rt>ほととぎす</rt></ruby>を聞く」というお題に沿って詠まれたものです。夏の訪れを告げるほととぎすの第一声を聞くことは平安時代の人々にとって特別な風流でした。作者もほととぎすの鳴き声を待ち望んでいたのかもしれません。ただし、有明の月は恋の歌によく登場するため、逢瀬の後の帰り道で偶然鳴き声が聞こえて、この歌を詠んだのかもしれません。",
        "personality": "後徳大寺左大臣こと、藤原実定は百人一首の撰者である藤原定家のいとこで、和歌だけでなく管弦の名手としても知られていました。祖父も徳大寺左大臣だったため、後徳大寺左大臣と呼ばれたようです。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "82": {
        "number": "82",
        "name": "<ruby>道因法師<rt>どういんほうし</rt></ruby>",
        "date": "1090年～没年不詳",
        "source": "千載集 恋",
        "theme": "love",
        "first": "<ruby>思<rt>おも</rt></ruby><ruby>ひ<rt>い</rt></ruby>わび<br>さても<ruby>命<rt>いのち</rt></ruby>は<br>あるものを",
        "second": "<ruby>憂<rt>う</rt></ruby>きにた<ruby>へ<rt>え</rt></ruby>ぬは<br><ruby>涙<rt>なみだ</rt></ruby>なりけり",
        "torihuda": "うきにたへ<br>ぬはなみた<br>なりけり",
        "eng":"Living while lamenting and grieving, But unable to endure the painful thoughts and sheddered tears",
        "eng_name":"Priest Dōin",
        "translation": "嘆き悲しんでいながら生きているけれども、つらい思いに絶えきれないのは涙であった。",
        "background": "この歌は、恋人の冷たさに嘆き、失恋の苦しみを表現しています。涙を抑えきれずに心が揺れる中でも、最終的には生きていかなければならないという作者の人生観がにじみ出ています。",
        "personality": "道因法師こと、<ruby>藤原敦頼<rt>ふじわらのあつより</rt></ruby>は宮中の馬を飼育管理する「<ruby>右馬助<rt>うまのすけ</rt></ruby>」と呼ばれる役人を務めて従五位上に至りました。いい歌を詠ませてほしいと京都から歌神として信仰されていた大阪の住吉大社まで毎月徒歩でお参りしていました。80歳を過ぎて出家しますが、90歳を過ぎても歌会に出席し、講評を熱心に聞くなど、歌道に邁進したと伝えられています。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "83": {
        "number": "83",
        "name": "<ruby>皇太后宮大夫俊成<rt>こうたいごうぐうのだいぶとしなり</rt></ruby>",
        "date": "1114年～1204年",
        "source": "千載集 雑",
        "theme": "misc",
        "first": "<ruby>世<rt>よ</rt></ruby>の<ruby>中<rt>なか</rt></ruby>よ<br><ruby>道<rt>みち</rt></ruby>こそなけれ<br><ruby>思<rt>おも</rt></ruby><ruby>ひ<rt>い</rt></ruby><ruby>入<rt>い</rt></ruby>る",
        "second": "<ruby>山<rt>やま</rt></ruby>の<ruby>奥<rt>おく</rt></ruby>にも<br><ruby>鹿<rt>しか</rt></ruby>ぞ<ruby>鳴<rt>な</rt></ruby>くなる",
        "torihuda": "やまのおく<br>にもしかそ<br>なくなる",
        "eng":"It seems there's no escape from this harsh world. Even in the depths of these secluded mountains, I can hear the sorrowful cries of deer echoing.",
        "eng_name":"Master of the Empress Dowager's Household Toshinari",
        "translation": "つらい世の中から逃れる方法はないようだ。思い詰めて分け入ったこの山の中でさえ、哀しげに鳴く鹿の声が聞こえてくる。",
        "background": "俊成が27歳頃に詠んだこの歌は、平安時代の終焉が迫る時期でした。同世代の人々が出家するなどしている中、俊成もまた出家を考えて山に入ったのでしょう。しかし、山奥で雄鹿の悲しい鳴き声を聞き、悩みから逃れられる道はないと悟ったのだと考えられます。",
        "personality": "皇太后宮大夫俊成こと、藤原俊成は百人一首の撰者である藤原定家の父です。『千載集』の撰者で、歌合の判者を多くつとめました。講評で「<ruby>幽玄<rt>ゆうげん</rt></ruby>」、「<ruby>艶<rt>えん</rt></ruby>」といった言葉を多く用い、和歌にとどまらず、茶道や能楽にも影響を与えました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "84": {
        "number": "84",
        "name": "<ruby>藤原清輔朝臣<rt>ふじわらのきよすけあそん</rt></ruby>",
        "date": "1104年～1177年",
        "source": "新古今集 雑",
        "theme": "misc",
        "first": "<ruby>長<rt>なが</rt></ruby>ら<ruby>へ<rt>え</rt></ruby>ば<br>またこのごろや<br>しのばれ<ruby>む<rt>ん</rt></ruby>",
        "second": "<ruby>憂<rt>う</rt></ruby>しと<ruby>見<rt>み</rt></ruby>し<ruby>世<rt>よ</rt></ruby>ぞ<br><ruby>今<rt>いま</rt></ruby>は<ruby>恋<rt>こい</rt></ruby>しき",
        "torihuda": "うしとみし<br>よそいまは<br>こひしき",
        "eng":"If I manage to live a long life, I'll likely look back on this painful moment with nostalgia. For sometimes, we nostalgically recall the days we once found difficult.",
        "eng_name":"Fujiwara no Kiyosuke Ason",
        "translation": "長く生きながらえたら、つらいと感じている今を懐かしく振り返ることだろう。つらいと思っていた昔の日々を、懐かしく思い出すことがあるのだから。",
        "background": "この歌は、たとえつらい日々を過ごしても、振り返ってみれば思い出になるという人生観を詠んでいます。",
        "personality": "藤原清輔は詞花和歌集の撰者である<a href='79.html'>左京大夫顕輔（79番）</a>の息子です。ただし、父親と確執があったと言われており、詞花和歌集に清輔の歌は一首も採用されていません。後に二条天皇の命を受け『続詞花集』を編纂する名誉を得ますが、奏上直前に二条天皇が崩御したため、完成することはありませんでした。それでも、歌壇を牽引する存在であり、歌学書『袋草紙』を著し、藤原俊成と並ぶ歌学者として高く評価されています。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "85": {
        "number": "85",
        "name": "<ruby>俊恵法師<rt>しゅんえほうし</rt></ruby>",
        "date": "1113年～没年不詳",
        "source": "千載集 恋",
        "theme": "love",
        "first": "<ruby>夜<rt>よ</rt></ruby>もすがら<br><ruby>物<rt>もの</rt></ruby><ruby>思<rt>おも</rt></ruby><ruby>ふ<rt>う</rt></ruby>ころは<br><ruby>明<rt>あ</rt></ruby>けやらで",
        "second": "<ruby>閨<rt>ねや</rt></ruby>のひまさ<ruby>へ<rt>え</rt></ruby><br>つれなかりけり",
        "torihuda": "ねやのひま<br>さへつれな<br>かりけり",
        "eng":"In these nights of love-laden anguish, The darkness seems endless, Even the merciless gap in the bedroom where no light penetrates feels unforgiving.",
        "eng_name":"Priest Shun'e",
        "translation": "一晩中、恋に思い悩んでいるこの頃は、いつまでも夜が明けないので、一向に光が差し込まない寝室の隙間さえも無情に感じられる。",
        "background": "この歌は、愛しい男性を待ちくたびれる女性の立場に立って詠まれました。<ruby>閨<rt>ねや</rt></ruby>とは寝室のことで、「ひま」は戸の隙間のことを指しています。",
        "personality": "俊恵法師は<a href='73.html'>大納言経信（73番）</a>の孫で、<a href='74.html'>源俊頼朝臣（74番）</a>の子にあたります。父と死別し10代で出家し、大仏があることで有名な東大寺の僧になりました。後に京都の白川に移り住み、<ruby>歌林苑<rt>かりんえん</rt></ruby>と称した自宅に多くの歌人たちを招き、多くの歌会を催しました。弟子の一人に「方丈記」の著者として有名な鴨長明がいます。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "86": {
        "number": "86",
        "name": "<ruby>西行法師<rt>さいぎょうほうし</rt></ruby>",
        "date": "1118年～1190年",
        "source": "千載集 恋",
        "theme": "love",
        "first": "<ruby>嘆<rt>なげ</rt></ruby>けとて<br><ruby>月<rt>つき</rt></ruby>やは<ruby>物<rt>もの</rt></ruby>を<br><ruby>思<rt>おも</rt></ruby><ruby>は<rt>わ</rt></ruby>する",
        "second": "かこち<ruby>顔<rt>がお</rt></ruby>なる<br>わが<ruby>涙<rt>なみだ</rt></ruby>かな",
        "torihuda": "かこちかほ<br>なるわかな<br>みたかな",
        "eng":"Does the moon make me lament and ponder? No, it's not the moon. It's my tears flowing as if blaming the moon.",
        "eng_name":"Priest Saigyō",
        "translation": "嘆きなさいと月が私に物思いをさせるだろうか。そうではない。月のせいにするかのように流れる私の涙かな。",
        "background": "この歌は「月前の恋」というお題を与えられて作られたものです。「かこち顔」はかこつける顔という意味で、恋人を思って流す涙を月のせいにしている心情を詠んでいます。",
        "personality": "西行法師は、俗名を佐藤<ruby>義清<rt>のりきよ</rt></ruby>といい、鳥羽上皇に仕える<ruby>北面武士<rt>ほくめんのぶし</rt></ruby>で<ruby>左兵衛尉<rt>さひょうえのじょう</rt></ruby>でしたが、23歳のときにその職も家庭も捨てて出家しました。出家した理由は、鳥羽天皇の皇后・<ruby>待賢門院<rt>たいけんもんいん</rt></ruby>との恋に落ち、その思いを断ち切るためだったという説があります。出家後は、<ruby>漂泊<rt>ひょうはく</rt></ruby>の歌人として東北、中国、四国など各地を巡り、旅先で自然と対話して多くの和歌を詠みました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "87": {
        "number": "87",
        "name": "<ruby>寂蓮法師<rt>じゃくれんほうし</rt></ruby>",
        "date": "1139年頃～1202年",
        "source": "新古今集 秋",
        "theme": "autumn",
        "first": "<ruby>村雨<rt>むらさめ</rt></ruby>の<br><ruby>露<rt>つゆ</rt></ruby>もまだひぬ<br>まきの<ruby>葉<rt>は</rt></ruby>に",
        "second": "<ruby>霧<rt>きり</rt></ruby>たちのぼる<br><ruby>秋<rt>あき</rt></ruby>の<ruby>夕<rt>ゆう</rt></ruby><ruby>暮<rt>ぐれ</rt></ruby>",
        "torihuda": "きりたちの<br>ほるあきの<br>ゆふくれ",
        "eng":"After a passing shower, in the vicinity where the drops have yet to dry on the pine needles, Mist rises in the autumn dusk.",
        "eng_name":"Priest Jakuren",
        "translation": "にわか雨の後にまだその滴が乾いていないまきの葉のあたりに、霧が立ち上る秋の夕暮れ。",
        "background": "この歌は後鳥羽院が開催した「老若五十首歌合」で詠まれました。秋の叙景歌ですが、紅葉のような色はなく、まき（常緑樹）を詠み込んでおり、無彩色の水墨画のような静寂さが伝わってくるところが斬新だったようです。「村雨」は秋に降るにわか雨のことです。",
        "personality": "寂蓮法師は、藤原俊成の養子でしたが、俊成の実の子である藤原定家に後継ぎを譲るため、出家しました。山籠り修行を行い、諸国を行脚した後、嵯峨に移り住みました。後鳥羽院に和歌の実力を認められ、新古今和歌集の撰者に選ばれましたが、その翌年に亡くなりました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "88": {
        "number": "88",
        "name": "<ruby>皇嘉門院別当<rt>こうかもんいんのべっとう</rt></ruby>",
        "date": "生没年不詳",
        "source": "千載集 恋",
        "theme": "love",
        "first": "<ruby>難波江<rt>なにわえ</rt></ruby>の<br><ruby>葦<rt>あし</rt></ruby>のかりねの<br>ひとよゆ<ruby>ゑ<rt>え</rt></ruby>",
        "second": "みをつくしてや<br><ruby>恋<rt>こ</rt></ruby><ruby>ひ<rt>い</rt></ruby>わたるべき",
        "torihuda": "みをつくし<br>てやこひわ<br>たるへき",
        "eng":"Should I devote myself to you and yearn for your love just because we spent one night as short as the joints between the reed in Naniwa Bay which is growing in a Naniwa cove?",
        "eng_name":"Attendant to Empress Kōka",
        "translation": "難波の入り江に生えている葦を刈った根の短い一節ではありませんが、たった一晩かりそめに共寝をしたために、私はあなたに身を尽くし、恋い慕わなくてはいけないのでしょうか。",
        "background": "この歌は九条兼実の家で催された歌合で「<ruby>旅宿<rt>りょしゅく</rt></ruby>に逢ふ恋」というお題で作歌されました。当時、<ruby>難波<rt>なにわ</rt></ruby>の入り江は水上交通の要衝として栄え、旅人たちで賑わい、遊女がたくさんいる地域でした。作者はこうした遊女たちに思いを馳せて作歌したのかもしれません。",
        "personality": "皇嘉門院別当は崇徳院の皇后である皇嘉門院<ruby>聖子<rt>きよこ</rt></ruby>に仕え、別当（長官のような立場）を担当しています。女官をまとめる立場にあったようです。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba.svg' alt='掛詞' class='box trigger'>",
        "kakekotobaLink": "「かりね」は「仮寝」と「刈り根」の掛詞です。ひとよは「一節」と「一夜」の掛詞です。「みをつくし」は「身を尽くし」と「澪標」の掛詞です。",
        "engoMark": "<img src='../img/mark_engo.svg' alt='縁語'  class='shadow trigger'>",
        "engoLink": "「難波江」、「葦」、「刈り根」、「一節」、「澪標」は縁語です。",
        "jokotobaMark": "<img src='../img/mark_jokotoba.svg' alt='序詞' class='shadow trigger'>",
        "jokotobaLink": "「難波江の 葦の」は序詞です。比喩表現で「かりね」を修飾しています。",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "<img src='../img/mark_utamakura.svg' alt='歌枕' class='shadow trigger'>",
        "utamakuraLink": "utamakura.html?lat=34.73260027715697&lng=135.5289405219532&zoom=15",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "89": {
        "number": "89",
        "name": "<ruby>式子内親王<rt>しょくしないしんのう</rt></ruby>",
        "date": "1149年～1201年",
        "source": "新古今集 恋",
        "theme": "love",
        "first": "<ruby>玉<rt>たま</rt></ruby>の<ruby>緒<rt>お</rt></ruby>よ<br><ruby>絶<rt>た</rt></ruby>えなば<ruby>絶<rt>た</rt></ruby>えね<br>ながら<ruby>へ<rt>え</rt></ruby>ば",
        "second": "<ruby>忍<rt>しの</rt></ruby>ぶることの<br><ruby>弱<rt>よわ</rt></ruby>りもぞする",
        "torihuda": "しのふるこ<br>とのよわり<br>もそする",
        "eng":"If my life must cease, then let it cease. For if I were to live on, the strength to endure love may wane, And the hidden feelings of love might inadvertently reveal themselves, which I fear.",
        "eng_name":"Princess Shikishi",
        "translation": "私の命よ、絶えてしまうのなら絶えてしまえ。生き長らえてしまうと恋を忍ぶ気持ちが弱って秘めた恋心が表に出てしまうと困るから。",
        "background": "式子内親王は神に仕えた身であるがゆえに一生独身という運命を背負っていました。この歌は命がけで恋を忍ぶ気持ちを詠んだものです。",
        "personality": "式子内親王は後白河上皇の第三皇女で10歳～20歳まで賀茂斎院として神に仕え、生涯独身を貫きました。斎院退下後は妹や母が亡くなり、弟の以仁王は平氏との戦いで討ち死にしています。父の後白河天皇は平清盛と対立し、自身も呪詛の犯人に疑われるなど穏やかでない人生を送りました。それでも式子内親王は美しい恋の和歌を多く残し、多くの歌が勅撰和歌集に採られています。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo.svg' alt='縁語'  class='shadow trigger'>",
        "engoLink": "「玉の緒」、「絶え」、「ながらへ」、「弱り」は命つながりの縁語です。",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "90": {
        "number": "90",
        "name": "<ruby>殷富門院大輔<rt>いんぷもんいんのたいふ</rt></ruby>",
        "date": "生没年不詳",
        "source": "千載集 恋",
        "theme": "love",
        "first": "<ruby>見<rt>み</rt></ruby>せばやな<br><ruby>雄島<rt>おじま</rt></ruby>のあまの<br><ruby>袖<rt>そで</rt></ruby>だにも",
        "second": "ぬれにぞぬれし<br><ruby>色<rt>いろ</rt></ruby>はか<ruby>は<rt>わ</rt></ruby>らず",
        "torihuda": "ぬれにそぬ<br>れしいろは<br>かはらす",
        "eng":"I want to show you. This sleeve, soaked and stained with tears of blood. Even the sleeves of the fishermen of Ojima do not change color, despite being drenched.",
        "eng_name":"Attendant to Empress Inpu",
        "translation": "あなたに見せたい。私の血の涙に濡れて色が変わってしまったこの袖を。あの雄島の漁師の袖でさえ、ひどく濡れても色は変わらないのに。",
        "background": "当時は涙が枯れると、血の涙が出ると考えられていて、血に染まって変色した袖をあなたに見せたいという内容になっています。<ruby>紅涙<rt>こうるい</rt></ruby>という激しい怒りや悲しみを表す言葉があり、実際に症状として血の涙が出たわけではありません。雄島は日本三景の宮城県松島群島の一つで、歌枕として多くの和歌に登場します。",
        "personality": "殷富門院大輔は、後白河天皇の第一皇女で、式子内親王の姉である殷富門院に仕えました。<a href='85.html'>俊恵法師（85番）</a>の歌林苑に参加するなど、和歌に励み多くの歌を詠み、「千首大輔」と呼ばれていたようです。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "<img src='../img/mark_utamakura.svg' alt='歌枕' class='shadow trigger'>",
        "utamakuraLink": "utamakura.html?lat=38.36534&lng=141.06252&zoom=20",
        "honkadoriMark": "<img src='../img/mark_honkadori.svg' alt='本歌取り' class='shadow trigger'>",
        "honkadoriLink": "<p>松島や 雄島の磯に あさりせし<br>あまの袖こそ かくはぬれしか</p><div style='display: flex; justify-content: flex-end;'><small>後拾遺集　源重之</small></div>",
    },
    "91": {
        "number": "91",
        "name": "<ruby>後京極摂政前太政大臣<rt>ごきょうごくせっしょうさきのだいじょうだいじん</rt></ruby>",
        "date": "1169年～1206年",
        "source": "新古今集 秋",
        "theme": "autumn",
        "first": "きりぎりす<br><ruby>鳴<rt>な</rt></ruby>くや<ruby>霜夜<rt>しもよ</rt></ruby>の<br>さむしろに",
        "second": "<ruby>衣<rt>ころも</rt></ruby>かたしき<br>ひとりかも<ruby>寝<rt>ね</rt></ruby><ruby>む<rt>ん</rt></ruby>",
        "torihuda": "ころもかた<br>しきひとり<br>かもねむ",
        "eng":"On this cold night with frost falling, The crickets are still chirping. Alone, I'll sleep on a bed of straw, Covered only with my own clothes.",
        "eng_name":"Gokyōgoku Regent and former Chancellor of the Realm",
        "translation": "こんな霜の降る寒い夜にこおろぎが鳴いている。むしろの上に自分の衣だけを敷いて、私はひとり寂しく寝るのだろうか。",
        "background": "この歌は、妻を亡くした作者が秋の夜を一人で寝る寂しさを詠んでいます。当時、男女が一緒に寝るときはお互いの着物を枕がわりにして寝ていたようで、「衣かたしき」は一人寝を意味していました。",
        "personality": "後京極摂政前太政大臣こと九条良経は、<a href='76.html'>法性寺入道前関白太政大臣（76番）</a>の孫で、九条兼実の次男です。長男・良通が22歳で夭逝したため九条家を継ぎました。土御門天皇の摂政となり絶頂期を迎えますが、同年に38歳で亡くなりました。寝室で急死したため、暗殺されたともいわれています。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba.svg' alt='掛詞' class='box trigger'>",
        "kakekotobaLink": "「さむしろ」は「寒し」の掛詞です。",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori.svg' alt='本歌取り' class='shadow trigger'>",
        "honkadoriLink": "<p>さむしろに 衣かたしき 今宵もや<br>われを待つらむ 宇治の橋姫</p><div style='display: flex; justify-content: flex-end;'><small>古今集　詠人知らず</small></div><p>あしびきの 山鳥の尾の しだり尾の<br>ながながし夜を ひとりかも寝む</p><div style='display: flex; justify-content: flex-end;'><small>拾遺集　柿本人麻呂</small></div>",
    },
    "92": {
        "number": "92",
        "name": "<ruby>二条院讃岐<rt>にじょういんのさぬき</rt></ruby>",
        "date": "1141年頃～1217年頃",
        "source": "千載集 恋",
        "theme": "love",
        "first": "わが<ruby>袖<rt>そで</rt></ruby>は<br><ruby>潮干<rt>しおひ</rt></ruby>に<ruby>見<rt>み</rt></ruby>えぬ<br><ruby>沖<rt>おき</rt></ruby>の<ruby>石<rt>いし</rt></ruby>の",
        "second": "<ruby>人<rt>ひと</rt></ruby>こそ<ruby>知<rt>し</rt></ruby>らね<br>かわくまもなし",
        "torihuda": "ひとこそし<br>らねかわく<br>まもなし",
        "eng":"Unseen, I think of you, Like the offshore rocks that don't reveal themselves even at low tide. My sleeves have no time to dry from tears.",
        "eng_name":"Sanuki, attendant to retired Emperor Nijō",
        "translation": "人知れずあなたを思う私は引き潮の時でさえ姿を見せない沖の石のようだ。私の袖は涙で乾く暇もない。",
        "background": "この歌は「寄石恋（石に思いを寄せる恋）」というお題に沿って詠まれたものです。歌は評判になり、作者は「沖の石の讃岐」と呼ばれました。和泉式部の「わが袖は 水の下なる石なれや 人に知られで かわく間もなし」（私の袖は水の下の石のようです。人知れず流す涙で私の袖は乾く暇もありません。）という歌を下敷きに作歌されています。",
        "personality": "二条院讃岐は『平家物語』に登場する<ruby>鵺<rt>ぬえ</rt></ruby>退治で知られる弓矢の名手・源頼政の娘です。二条院に仕えた後、後鳥羽天皇の中宮・任子に仕えました。晩年は<ruby>以仁王<rt>もちひとおう</rt></ruby>の挙兵で父と兄を亡くし出家しています。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba.svg' alt='序詞' class='shadow trigger'>",
        "jokotobaLink": "「潮干に見えぬ 沖の石の」が序詞です。<br>比喩表現で「人こそ知らね かわくまもなし」を修飾しています。",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "<img src='../img/mark_utamakura.svg' alt='歌枕' class='shadow trigger'>",
        "utamakuraLink": "utamakura.html?lat=38.28683&lng=141.00333&zoom=20",
        "honkadoriMark": "<img src='../img/mark_honkadori.svg' alt='本歌取り' class='shadow trigger'>",
        "honkadoriLink": "<p>わが袖は 水の下なる 石なれや<br>人に知られで かわくまもなし</p><div style='display: flex; justify-content: flex-end;'><small>和泉式部集　和泉式部</small></div>",
    },
    "93": {
        "number": "93",
        "name": "<ruby>鎌倉右大臣<rt>かまくらのうだいじん</rt></ruby>",
        "date": "1192年～1219年",
        "source": "新勅撰集 羇旅",
        "theme": "travel",
        "first": "<ruby>世<rt>よ</rt></ruby>の<ruby>中<rt>なか</rt></ruby>は<br>つねにもがもな<br><ruby>渚<rt>なぎさ</rt></ruby>こぐ",
        "second": "あまの<ruby>小舟<rt>こぶね</rt></ruby>の<br><ruby>綱手<rt>つなで</rt></ruby>かなしも",
        "torihuda": "あまのをふ<br>ねのつなて<br>かなしも",
        "eng":"I wish the world would remain unchanged like this forever. The sight of fishermen setting out from the shore, pulling the ropes of their small boats, Feels so dear to me.",
        "eng_name":"Minister of the Right of Kamakura",
        "translation": "世の中は、こんな風にいつまでも変わらないでいてほしい。渚を漕ぎだす漁師が小舟の綱を引く様子が愛おしく感じられるよ。",
        "background": "この歌は、「綱手かなしも」の「かなし」は愛おしいという意味です。庶民の平和な暮らしを愛おしく見守っていた為政者としての思いが感じられます。",
        "personality": "鎌倉右大臣こと源実朝は、鎌倉幕府を開いた源頼朝と北条政子の息子です。兄の頼家の後を継ぎ、わずか12歳で第三代鎌倉幕府征夷大将軍になりました。武士を率いる立場でしたが、実朝は和歌を愛し、平和な世の中を願っていました。しかし、不幸にも28歳の若さで甥の<ruby>公暁<rt>くぎょう</rt></ruby>によって暗殺され、短い生涯を閉じました。家集『<ruby>金槐和歌集<rt>きんかいわかしゅう</rt></ruby>』を残しています。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori.svg' alt='本歌取り' class='shadow trigger'>",
        "honkadoriLink": "<p>河の上の ゆつ岩群に 草生さず<br>常にもがもな 常処女にて</p><div style='display: flex; justify-content: flex-end;'><small>万葉集　吹芡刀自</small></div>",
    },
    "94": {
        "number": "94",
        "name": "<ruby>参議雅経<rt>さんぎまさつね</rt></ruby>",
        "date": "1170年～1221年",
        "source": "新古今集 秋",
        "theme": "autumn",
        "first": "み<ruby>吉野<rt>よしの</rt></ruby>の<br><ruby>山<rt>やま</rt></ruby>の<ruby>秋風<rt>あきかぜ</rt></ruby><br>さ<ruby>夜<rt>よ</rt></ruby>ふけて",
        "second": "ふるさと<ruby>寒<rt>さむ</rt></ruby>く<br><ruby>衣<rt>ころも</rt></ruby>うつなり",
        "torihuda": "ふるさとさ<br>むくころも<br>うつなり",
        "eng":"In the mountains of Yoshino, the autumn wind blows, And as night falls, the sound of clothes being beaten on the wooden block resonates, Echoing chillingly through the ancient capital of Yoshino.",
        "eng_name":"Councillor Masatsune",
        "translation": "吉野の山に、秋風が吹きわたり、夜更けになると、古都吉野では衣を打つ砧の音が寒々しく響く。",
        "background": "当時はアイロン代わりに、水に濡らした布を木の台に置いて、<ruby>砧<rt>きぬた</rt></ruby>と呼ばれる木の棒で打ち、衣服の折り目をつけたり、艶を出したりしていました。この歌は、古今集の「み吉野の 山の白雪つもるらし ふるさと寒くなりまさるなり」（現代語訳：吉野の山では白雪が積もっているだろう、古都では寒さが増している）を本歌取りして作られました。吉野は春は桜、冬は雪の名所として知られ、歌枕としてよく和歌に登場します。",
        "personality": "参議雅経こと、藤原雅経は蹴鞠の名人で、<ruby>飛鳥井流<rt>あすかいりゅう</rt></ruby>蹴鞠を興したことで知られています。和歌は藤原俊成に師事し、『新古今集』の撰者も務めました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori.svg' alt='本歌取り' class='shadow trigger'>",
        "honkadoriLink": "<p>みよしのの 山の白雪 つもるらし<br>ふるさと寒く なりまさるなり</p><div style='display: flex; justify-content: flex-end;'><small>万葉集　詠人知らず</small></div>",
    },
    "95": {
        "number": "95",
        "name": "<ruby>前大僧正慈円<rt>さきのだいそうじょうじえん</rt></ruby>",
        "date": "1155年～1225年",
        "source": "千載集 雑",
        "theme": "misc",
        "first": "お<ruby>ほ<rt>お</rt></ruby>けなく<br><ruby>憂<rt>う</rt></ruby>き<ruby>世<rt>よ</rt></ruby>の<ruby>民<rt>たみ</rt></ruby>に<br>お<ruby>ほ<rt>お</rt></ruby><ruby>ふ<rt>う</rt></ruby>かな",
        "second": "わがたつ<ruby>杣<rt>そま</rt></ruby>に<br><ruby>墨染<rt>すみぞめ</rt></ruby>の<ruby>袖<rt>そで</rt></ruby>",
        "torihuda": "わかたつそ<br>まにすみそ<br>めのそて",
        "eng":"It may be presumptuous, but I wish to wrap the people living in this painful, sorrow-filled world with my priest's sleeves who started to live on Hiei-zan mountain. ",
        "eng_name":"Former Senior High Priest Jien",
        "translation": "おこがましいけれども、このつらい悲しみに満ちた現世を生きる人々を私の袖で包んであげたい。比叡山に住みはじめた私の墨染の袖で。",
        "background": "この歌が詠まれた当時は、繰り返される内乱、天災や疫病、飢餓で世の中が混乱していました。この歌は、仏教の力で人々を救いたいという若き僧の気概を感じさせる内容になっています。杣は、植林している山のことで、比叡山を指しています。墨染の袖は「僧侶の袖」と「住み始めた」という意味の掛詞です。",
        "personality": "前大僧正慈円は藤原忠通の息子で、幼くして出家し、4回も比叡山延暦寺の<ruby>天台座主<rt>てんだいざす</rt></ruby>（最高位）になった名僧です。『<ruby>愚管抄<rt>ぐかんしょう</rt></ruby>』という鎌倉時代初期の史論書を残したことでも有名な人物です。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba.svg' alt='掛詞' class='box trigger'>",
        "kakekotobaLink": "「墨染」は「住み初め」の掛詞です。",
        "engoMark": "<img src='../img/mark_engo.svg' alt='縁語'  class='shadow trigger'>",
        "engoLink": "「おほふ」と「袖」は縁語です。",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori.svg' alt='本歌取り' class='shadow trigger'>",
        "honkadoriLink": "<p>阿耨多羅 三藐三菩提の 仏達<br>わが立つ杣に 冥加あらせたまえ</p><div style='display: flex; justify-content: flex-end;'><small>伝教大師</small></div>",
    },
    "96": {
        "number": "96",
        "name": "<ruby>入道前太政大臣<rt>にゅうどうさきのだいじょうだいじん</rt></ruby>",
        "date": "1171年～1244年",
        "source": "新勅撰集 雑",
        "theme": "misc",
        "first": "<ruby>花<rt>はな</rt></ruby>さそ<ruby>ふ<rt>う</rt></ruby><br><ruby>嵐<rt>あらし</rt></ruby>の<ruby>庭<rt>にわ</rt></ruby>の<br><ruby>雪<rt>ゆき</rt></ruby>ならで",
        "second": "ふりゆくものは<br>わが<ruby>身<rt>み</rt></ruby>なりけり",
        "torihuda": "ふりゆくも<br>のはわかみ<br>なりけり",
        "eng":"A storm blows, enticing the cherry blossoms to scatter in the garden. Petals fall like snow, yet it's myself that grows older, not the blossoms.",
        "eng_name":"Lay Novice and former Chancellor of the Realm",
        "translation": "桜を誘って散らす嵐が吹く庭。雪のように花が降るけれど、古くなるのは私自身なのだな。",
        "background": "作者は散りゆく桜を見つつ、その光景を自身の人生に投影しているようです。栄華を極め、すべてを手に入れたとしても、老いという自然の摂理には逆らえないと感じ、その思いを歌に込めたのでしょう。",
        "personality": "入道前太政大臣こと西園寺公経は、源頼朝の姪を妻にしており、承久の乱のときに後鳥羽上皇の反乱の動きを鎌倉幕府側に密通し、幕府側につきました。この功績により、鎌倉幕府の庇護を受け、太政大臣にまで出世し、京都の北山に豪勢な西園寺を造営するなど、栄華を極めました。一方で公経は<a href='97.html'>藤原定家（97番）</a>の妻の弟にあたり、定家の後援者でもありました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba.svg' alt='掛詞' class='box trigger'>",
        "kakekotobaLink": "「ふりゆく」は「降りゆく」と「古りゆく」の掛詞です。",
        "engoMark": "<img src='../img/mark_engo.svg' alt='縁語'  class='shadow trigger'>",
        "engoLink": "「花」、「雪」、「降り」は縁語です。",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori.svg' alt='本歌取り' class='shadow trigger'>",
        "honkadoriLink": "<p>花の色は うつりにけりな いたづらに<br>わが身よにふる ながめせしまに</p><div style='display: flex; justify-content: flex-end;'><small>古今集　小野小町</small></div>",
    },
    "97": {
        "number": "97",
        "name": "<ruby>権中納言定家<rt>ごんちゅうなごんさだいえ</rt></ruby>",
        "date": "1162年～1241年",
        "source": "新勅撰集 恋",
        "theme": "love",
        "first": "<ruby>来<rt>こ</rt></ruby>ぬ<ruby>人<rt>ひと</rt></ruby>を<br><ruby>松帆<rt>まつほ</rt></ruby>の<ruby>浦<rt>うら</rt></ruby>の<br><ruby>夕<rt>ゆう</rt></ruby>なぎに",
        "second": "<ruby>焼<rt>や</rt></ruby>くやもしほの<br><ruby>身<rt>み</rt></ruby>もこがれつつ",
        "torihuda": "やくやもし<br>ほのみもこ<br>かれつつ",
        "eng":"Waiting for my beloved who will not come. Scorching myself like seaweed being burned at the shore of Matsuho-no-Ura in the evening calm",
        "eng_name":"Acting Middle Counselor Sadaie",
        "translation": "来てくれない愛しい人を待っています。夕凪どきに松帆の浦で焼かれる海藻のように少女に会いたいいう焦がしながら。",
        "background": "この歌は『万葉集』に収められた長歌にインスピレーションを得て作られました。長歌では明石の男が海を挟んだ淡路島の松帆の浦にいる藻塩を焼く少女に会いたいう内容になっています。",
        "personality": "権中納言定家は、百人一首を編纂した藤原定家のことです。彼は後『新古今和歌集』の編纂を任された和歌の大家でした。定家は古典文学の研究者でもあり『源氏物語』や『更級日記』、『伊勢物語』など多くの平安時代の作品を書き写しました。定家のおかげで現代に伝わった平安時代の文学作品が数多くあるといわれています。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba.svg' alt='掛詞' class='box trigger'>",
        "kakekotobaLink": "「まつ」は「松」と「待つ」の掛詞です。",
        "engoMark": "<img src='../img/mark_engo.svg' alt='縁語'  class='shadow trigger'>",
        "engoLink": "「焼く」、「もしを」、「こがれ」は塩焼きつながりの縁語です。",
        "jokotobaMark": "<img src='../img/mark_jokotoba.svg' alt='序詞' class='shadow trigger'>",
        "jokotobaLink": "「まつほの浦の 夕なぎに 焼くやもしほの」が序詞です。比喩表現で「こがれ」を修飾しています。",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "<img src='../img/mark_utamakura.svg' alt='歌枕' class='shadow trigger'>",
        "utamakuraLink": "utamakura.html?lat=34.60925&lng=135.00183&zoom=14",
        "honkadoriMark": "<img src='../img/mark_honkadori.svg' alt='本歌取り' class='shadow trigger'>",
        "honkadoriLink": "<p>名寸隅の 船瀬ゆ見ゆる 淡路島 松帆の浦に 朝なぎに 玉藻刈りつつ 夕なぎに 藻塩焼きつつ 海人娘子 ありとは聞けど 見に行かむ よしのなければ ますらをの 心はなしに たをやめの 思ひたわみて たもとほり あれはそ恋ふる ふね梶をなみ</p><div style='display: flex; justify-content: flex-end;'><small>万葉集　笠金村</small></div>",
    },
    "98": {
        "number": "98",
        "name": "<ruby>従二位家隆<rt>じゅにいいえたか</rt></ruby>",
        "date": "1158年～1237年",
        "source": "新勅撰集 夏",
        "theme": "summer",
        "first": "<ruby>風<rt>かぜ</rt></ruby>そよぐ<br>ならの<ruby>小川<rt>おがわ</rt></ruby>の<br><ruby>夕<rt></rt></ruby><ruby>暮<rt>ぐれ</rt></ruby>は",
        "second": "みそぎぞ<ruby>夏<rt>なつ</rt></ruby>の<br>しるしなりける",
        "torihuda": "みそきそな<br>つのしるし<br>なりける",
        "eng":"The breeze rustles through the oak leaves, and though the evening by this oak-lined stream feels like autumn, the \"Minazuki-barae\" ritual is being held, reminding me it's still summer.",
        "eng_name":"Junior Second Rank Ietaka",
        "translation": "風がそよぐ楢の葉、この楢の小川の夕暮れはすっかり秋の気配だけれども、<ruby>水無月祓<rt>みなづきばらえ</rt></ruby>の行事が行われているからまだ夏であるのだなあ。",
        "background": "この歌は、藤原道家の娘である尊子が後堀河天皇の中宮として宮中に入る際に、その嫁入り道具である屏風に添えられた和歌です。屏風には月ごとに異なる絵が描かれており、この歌はその中で６月の絵に対して贈られたものでした。",
        "personality": "従二位家隆こと、藤原家隆は<a href='83.html'>藤原俊成（83番）</a>に和歌を師事し、<a href='97.html'>藤原定家（97番）</a>の良きライバルで後鳥羽院の命を受けて作成された『新古今和歌集』（勅撰和歌集）の撰者の一人です。家隆は<a href='99.html'>後鳥羽院（99番）</a>が隠岐に配流された後も交流を続けました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba.svg' alt='掛詞' class='box trigger'>",
        "kakekotobaLink": "「ならの小川」は「楢」の掛詞です。",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "<img src='../img/mark_utamakura.svg' alt='歌枕' class='shadow trigger'>",
        "utamakuraLink": "utamakura.html?lat=35.05966&lng=135.75297&zoom=17",
        "honkadoriMark": "<img src='../img/mark_honkadori.svg' alt='本歌取り' class='shadow trigger'>",
        "honkadoriLink": "<p>夏山の 楢の葉そよぐ 夕暮れは<br>ことしも秋の ここちこそすれ</p><div style='display: flex; justify-content: flex-end;'><small>後拾遺集　源頼綱</small></div>",
    },
    "99": {
        "number": "99",
        "name": "<ruby>後鳥羽院<rt>ごとばいん</rt></ruby>",
        "date": "1180年～1239年",
        "source": "続後撰集 雑",
        "theme": "misc",
        "first": "<ruby>人<rt>ひと</rt></ruby>もをし<br><ruby>人<rt>ひと</rt></ruby>もうらめし<br>あ<ruby>ぢ<rt>じ</rt></ruby>きなく",
        "second": "<ruby>世<rt>よ</rt></ruby>を<ruby>思<rt>おも</rt></ruby><ruby>ふ<rt>う</rt></ruby>ゆ<ruby>ゑ<rt>え</rt></ruby>に<br><ruby>物<rt>も</rt></ruby><ruby>思<rt>おも</rt></ruby><ruby>ふ<rt>う</rt></ruby><ruby>身<rt>み</rt></ruby>は",
        "torihuda": "よをおもふ<br>ゆゑにもの<br>おもふみは",
        "eng":"Feeling both love and resentment towards people, I sink into contemplation due to the bitterness world.",
        "eng_name":"Retired Emperor Go-Toba",
        "translation": "人が愛しく、人が恨めしくも感じられる。苦々しく。世の中を思うがゆえに物思いに沈む私には。",
        "background": "台頭する鎌倉幕府との軋轢や弱体化する朝廷に心を砕かれた後鳥羽院が心の内を吐露した歌です。承久の乱が起きる9年前、後鳥羽院が33歳のときに詠まれました。",
        "personality": "後鳥羽院は、鎌倉時代の天皇です。譲位後、朝廷の権威を取り戻すために、鎌倉幕府の執権である北条義時を討伐しようと承久の乱を起こしました。しかし、臣下に裏切られ、戦いに敗れて隠岐（島根県）に流されました。後鳥羽院は、文武両道で、水泳、乗馬、狩猟に蹴鞠、刀剣と多方面で才能を発揮し、和歌にも非常に秀でていました。<a href='97.html'>藤原定家（97番:百人一首の撰者）</a>を高く評価し、新勅撰和歌集の撰者に任命しています。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba_none.svg' alt='掛詞'>",
        "kakekotobaLink": "<p>この歌に掛詞はありません。</p>",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    },
    "100": {
        "number": "100",
        "name": "<ruby>順徳院<rt>じゅんとくいん</rt></ruby>",
        "date": "1197年～1242年",
        "source": "続後撰集 雑",
        "theme": "misc",
        "first": "ももしきや<br>ふるき<ruby>軒<rt>のき</rt></ruby>ばの<br>しのぶにも",
        "second": "な<ruby>ほ<rt>お</rt></ruby>あまりある<br><ruby>昔<rt>むかし</rt></ruby>なりけり",
        "torihuda": "なほあまり<br>あるむかし<br>なりけり",
        "eng":"On the aged eaves of the palace, polypody thrives. Reflecting on the grandeur of the court, yet unable to fully reminisce on days gone by.",
        "eng_name":"Retired Emperor Juntoku",
        "translation": "宮中の古びた軒先にノキシノブが生えている。宮廷の栄えた頃が偲んでも偲びきれない昔であることよ。",
        "background": "この歌は、宮廷の荒廃を目の当たりにした天皇がかつて天皇自らが世を治めていた王朝時代を懐かしんで詠まれたものと考えられています。「承久の乱」が起きる5年前、順徳天皇が20歳のときに詠まれました。",
        "personality": "順徳院は、<a href='99.html'>後鳥羽院（99番）</a>の第三皇子でありながら、聡明で活発な性格が後鳥羽院に気に入られ、わずか13歳で天皇に即位。宮中の行事、しきたりなどを整理し『<ruby>禁秘抄<rt>きんぴしょう</rt></ruby>』にまとめ上げ、朝廷の存在意義を示そうとしました。しかし、25歳のときに父と起こした「承久の乱」に敗れたことで佐渡に配流され、都に帰ることも、子孫への皇位継承も叶わず46歳で崩御しました。",
        "kakekotobaMark": "<img src='../img/mark_kakekotoba.svg' alt='掛詞' class='box trigger'>",
        "kakekotobaLink": "「しのぶ」は「偲ぶ」と「忍草（ノキシノブ）」の掛詞です。",
        "engoMark": "<img src='../img/mark_engo_none.svg' alt='縁語なし'>",
        "engoLink": "<p>この歌には縁語はありません。</p>",
        "jokotobaMark": "<img src='../img/mark_jokotoba_none.svg' alt='序詞なし'>",
        "jokotobaLink": "<p>この歌には序詞はありません。</p>",
        "makurakotobaMark": "<img src='../img/mark_makurakotoba_none.svg' alt='枕詞なし'>",
        "makurakotobaLink": "<p>この歌には枕詞はありません。</p>",
        "utamakuraMark": "",
        "utamakuraLink": "",
        "honkadoriMark": "<img src='../img/mark_honkadori_none.svg' alt='本歌取りなし'>",
        "honkadoriLink": "<p>この歌は本歌取りしていません。</p>",
    }

};

// 変数selectedThemeを作成
let selectedTheme = "all"; // ページロード時に全ての詩を表示するように設定
const baseURL = "https://hyakuninisshu.com/"

// テーマが変更されたら、設定値をselectedThemeに格納する
$("#themeSelector").on("change", function () {
    selectedTheme = $(this).val();
    updateJsonSelectorOptions();
});

// 選択されたテーマの歌人を抽出する
function getThemePoems() {
    let themePoems = [];
    for (let key in poems) {
        if (poems[key].theme === selectedTheme || selectedTheme === "all" || selectedTheme === "") {
            themePoems.push(poems[key]);
        }
    }
    return themePoems;
}

// 選択されたテーマの歌人を抽出する
function updateJsonSelectorOptions() {
    let themePoems = getThemePoems();
    $("#jsonSelector").html('<option value="all">歌人を選ぶ</option>');
    themePoems.forEach(function (poem) {
        // 歌人の名前が定義されているかを確認し、定義されている場合にのみ処理を行う
        if (poem.name) {
            let strippedName = poem.name.replace(/<rt>.*?<\/rt>/g, "");
            $("#jsonSelector").append(
                `<option value="${poem.number}">${poem.number}番歌・${strippedName}</option>`
            );
        }
    });
}

// ページが読み込まれたら選択されたテーマの歌人を抽出
$(document).ready(function () {
    updateJsonSelectorOptions();
});


// jsonSelector で選択された number を記録する変数
let selectedNumber = null;

// jsonSelector で選択された number を記録し、URL を構築する関数
function redirectToPoemPage() {
    // jsonSelector で選択された number を取得
    selectedNumber = $("#jsonSelector").val();

    // selectedNumber が有効な場合、URL を構築してリダイレクトする
    if (selectedNumber) {
        let redirectUrl = baseURL + selectedNumber + ".html";
        window.location.href = redirectUrl; // ページをリダイレクト
    }
}

// jsonSelector で選択された number が変更されたら、redirectToPoemPage 関数を実行する
$("#jsonSelector").on("change", redirectToPoemPage);


////////////////////////////////////////////////////////////
// コンテンツ読み込み
////////////////////////////////////////////////////////////
$(document).ready(function () {
    // ページの URL を取得
    const url = window.location.href;

    // URL から数字部分を抽出
    const match = url.match(/(\d+)\.html/);

    // 抽出した番号をキーにして、対応するデータのnameの値を取得してコンソールに表示
    if (match) {
        const selectedNumber = match[1];
        const poemData = poems[selectedNumber];
        if (poemData && poemData.name) {

            // 札の読み込み
            const name = poemData.name
            const first = poemData.first
            const second = poemData.second
            const torihuda = poemData.torihuda
            const eng = poemData.eng
            const eng_name=poemData.eng_name
            const number = poemData.number
            const nameWithoutRubyTags = name.replace(/<ruby>(.*?)<\/ruby>/g, "$1").replace(/<rt>(.*?)<\/rt>/g, "");
            const firstWithoutRubyTags = first.replace(/<ruby>(.*?)<\/ruby>/g, "$1").replace(/<rt>(.*?)<\/rt>/g, "").replace(/<br>/g, " ");
            const secondWithoutRubyTags = second.replace(/<ruby>(.*?)<\/ruby>/g, "$1").replace(/<rt>(.*?)<\/rt>/g, "").replace(/<br>/g, " ");



            // 説明の読み込み
            const date = poemData.date
            const translation = poemData.translation
            const bg = poemData.background
            const source = poemData.source
            const personality = poemData.personality

            console.log(firstWithoutRubyTags + "\n" + secondWithoutRubyTags + "\n" + nameWithoutRubyTags);

            // 絵札（上の句・下の句の表示/非表示）
            $(document).ready(function () {
                // チェックボックスの変更を処理する関数
                function handleToggle() {
                    var toggle3Checked = $("#toggle3").is(":checked");
                    if (toggle3Checked) { /* チェックが入っている場合 */
                        $(".card-front").html(`
                            <div id="frontContent">
                                <h2 id="poemName">${name}</h2>
                                <h3 id="poemContent"">${first}<br>${second}</h3>
                                <img src="../img/${number}.svg?20240630" alt=${nameWithoutRubyTags}>
                            </div>
                        `);
                    } else { /* チェックが入っていない場合 */
                        $(".card-front").html(`
                            <div id="frontContent">
                                <h3 id="poemContent">${eng}</h3>
                                <h2 id="poemName">${eng_name}</h2>
                                <img src="../img/${number}.svg?20240630" ${nameWithoutRubyTags}>
                            </div>
                        `);
                        $("#poemContent").addClass("active");
                        /* スタイル変更 */
                        $("#frontContent").css({
                            "display": "flex",
                            "flex-direction": "column"
                        });
                        $("#poemContent").css({
                            "writing-mode": "horizontal-tb",
                            "text-align":"left",
                            "font-size":"1.3rem",
                            "font-family": "Fondamento",
                            "font-weight":"700",
                            "letter-spacing":"-0.01rem",
                            "line-height": "1.5"
                        });
                        $("#poemName").css({
                            "writing-mode": "horizontal-tb",
                            "text-align":"right",
                            "font-size":"0.8rem",
                            "font-family": "Fondamento",
                            "font-weight": "700",
                            "line-height": "1.5"
                        });
                    }
                }

                // 初期設定を実行
                handleToggle();

                // チェックボックスの変更イベントを実行
                $("#toggle3").on("change", handleToggle);
            });



            // 取り札
            $(".card-back").append(`
                <p>
                ${torihuda}
                </p>
            `);

            // マーク
            $(".explanation").append(`
                <div class='mark'></div>
            `);
            if (poemData.makurakotobaLink) {
                const makurakotobaLinkElement = `<span id='makurakotoba'>${poemData.makurakotobaMark}</span>`;
                const makurakotobaExplanation = `${poemData.makurakotobaLink}`;

                // makurakotobaLinkElementを".explanation .mark"に追加
                $(".explanation .mark").append(makurakotobaLinkElement);

                // 新しいdiv要素を作成し、その背景画像を設定
                const makurakotobaDiv = $(`<div class='makurakotoba'"><dt>枕詞</dt><dd>枕詞とは、特定の語句を導き出すための<span>5</span>文字の言葉です。導き出す語句の直前に置かれ、語調を整えたり、ある種の情緒を添えます。</dd><hr><p>${makurakotobaExplanation}</p></div>`);

                // 新しいdivを".explanation"に追加
                $(".explanation").append(makurakotobaDiv);
            }

            // 掛詞　kakekotobaLinkが空でない場合
            if (poemData.kakekotobaLink) {
                const kakekotobaLinkElement = `<span id='kakekotoba'>${poemData.kakekotobaMark}</span>`;
                const kakekotobaExplanation = `${poemData.kakekotobaLink}`;

                // kakekotobaLinkElementを".explanation .mark"に追加
                $(".explanation .mark").append(kakekotobaLinkElement);

                // 新しいdiv要素を作成し、その背景画像を設定
                const kakekotobaDiv = $(`<div class='kakekotoba'"><dt>掛詞</dt><dd>掛詞とは、同音異義語の語句（景物と心情）を重ねて用いることで、言葉の連想により世界を広げる技法です。</dd><hr><p>${kakekotobaExplanation}</p></div>`);

                // 新しいdivを".explanation"に追加
                $(".explanation").append(kakekotobaDiv);
            }


            // 縁語　engoLinkが空でない場合
            if (poemData.engoLink) {
                const engoLinkElement = `<span id='engo'>${poemData.engoMark}</span>`;
                const engoExplanation = `${poemData.engoLink}`;

                // engoLinkElementを".explanation .mark"に追加
                $(".explanation .mark").append(engoLinkElement);

                // 新しいdiv要素を作成し、その背景画像を設定
                const engoDiv = $(`<div class='engo'"><dt>縁語</dt><dd>縁語とは意味的に関連の深い語句を用いることで、言葉の連想により、味わい深いものにする技法です。</dd><hr><p>${engoExplanation}</p></div>`);

                // 新しいdivを".explanation"に追加
                $(".explanation").append(engoDiv);
            }

            // 序詞　jokotobaLinkが空でない場合
            if (poemData.jokotobaLink) {
                const jokotobaLinkElement = `<span id='jokotoba'>${poemData.jokotobaMark}</span>`;
                const jokotobaExplanation = `${poemData.jokotobaLink}`;

                // jokotobaLinkElementを".explanation .mark"に追加
                $(".explanation .mark").append(jokotobaLinkElement);

                // 新しいdiv要素を作成し、その背景画像を設定
                const jokotobaDiv = $(`<div class='jokotoba'"><dt>序詞</dt><dd>序詞とは、言いたい言葉を導き出すために前置きされる言葉のことです。序詞は歌人が独自に作成し、<span>7</span>文字以上で構成されます。比喩によるもの、掛詞にかかるもの、同音を繰り返すものの<span>3</span>種類があります。</dd><hr><p>${jokotobaExplanation}</p></div>`);

                // 新しいdivを".explanation"に追加
                $(".explanation").append(jokotobaDiv);
            }

            // 本歌取り　honkadoriLinkが空でない場合
            if (poemData.honkadoriLink) {
                let honkadoriLinkElement = `<span id='honkadori'>${poemData.honkadoriMark}</span>`;
                const honkadoriExplanation = `${poemData.honkadoriLink}`;

                // honkadoriLinkElementを".explanation .mark"に追加
                $(".explanation .mark").append(honkadoriLinkElement);

                // 新しいdiv要素を作成し、その背景画像を設定
                const honkadoriDiv = $(`<div class='honkadori'"><dt>本歌取り</dt><dd>本歌取りとは、古歌の一部を借用することで、古歌の心情や趣向を取り込む技法のことです。本歌は左記のとおりです。</dd><hr><p>${honkadoriExplanation}</p></div>`);

                // 新しいdivを".explanation"に追加
                $(".explanation").append(honkadoriDiv);
            } else {
                let honkadoriLinkElement = `<span id='honkadori'>${poemData.honkadoriMark}</span>`;
            }

            // 歌枕　utamakuraLinkが空でない場合
            if (poemData.utamakuraLink) {
                // 歌枕地図に遷移
                let utamakuraLinkElement = `<a href="${poemData.utamakuraLink}">${poemData.utamakuraMark}</a>`;
                $(".explanation .mark").append(utamakuraLinkElement);
            } else {
                let utamakuraLinkElement = `<span id='utamakura'><img src='../img/mark_utamakura_none.svg' alt='歌枕なし'></span>`;
                $(".explanation .mark").append(utamakuraLinkElement);
                // 和歌に歌枕がない説明を表示
                const utamakuraDiv = $(`<div class='utamakura'"><dt>歌枕</dt><dd>歌枕とは、和歌に登場する景勝地のことです。</dd><hr><p>この歌に歌枕はありません。</p></div>`);
                $(".explanation").append(utamakuraDiv);
            }


            // 説明
            $(".explanation").append(`
                <dl>
                    <dt id='utabangou'>${number}番歌</dt>
                    <dd>${window.innerWidth <= 760 ? first : first.replace(/<br\s*\/?>/g, " ")}<br>${window.innerWidth <= 760 ? second : second.replace(/<br\s*\/?>/g, " ")}<br>
                    <span class="small">作者：${name}（${date}）<br>出典：${source}&nbsp;</span>
                    </dd>
                </dl>
                <dl>
                    <dt>現代語訳</dt>
                    <dd>${translation}</dd>
                </dl>
                <dl>
                    <dt>解説</dt>
                    <dd>${bg}</dd>
                </dl>
                <dl>
                    <dt>どんな人？</dt>
                    <dd>${personality}</dd>
                </dl>
            `);
        } else {
            console.log("該当するデータが見つかりませんでした。");
        }
    }
});



////////////////////////////////////////////////////////////
// マークの動作
////////////////////////////////////////////////////////////
// 掛詞ボタンで表示をトグルする
$(document).on("click", "#kakekotoba", function (event) {
    event.stopPropagation();
    $(".kakekotoba").toggleClass("active");
    $(".engo, .jokotoba, .makurakotoba, .honkadori, .utamakura").removeClass("active");
});

// 縁語ボタンで表示をトグルする
$(document).on("click", "#engo", function (event) {
    event.stopPropagation();
    $(".engo").toggleClass("active");
    $(".kakekotoba, .jokotoba, .makurakotoba,.honkadori, .utamakura").removeClass("active");
});

// 序詞ボタンで表示をトグルする
$(document).on("click", "#jokotoba", function (event) {
    event.stopPropagation();
    $(".jokotoba").toggleClass("active");
    $(".kakekotoba, .engo, .makurakotoba, .honkadori, .utamakura").removeClass("active");
});

// 枕詞ボタンで表示をトグルする
$(document).on("click", "#makurakotoba", function (event) {
    event.stopPropagation();
    $(".makurakotoba").toggleClass("active");
    $(".kakekotoba, .engo, .jokotoba, .honkadori, .utamakura").removeClass("active");
});

// 本歌取りボタンで表示をトグルする
$(document).on("click", "#honkadori", function (event) {
    event.stopPropagation();
    $(".honkadori").toggleClass("active");
    $(".kakekotoba, .engo, .jokotoba, .makurakotoba, .utamakura").removeClass("active");
});

// 歌枕ボタンで表示をトグルする
$(document).on("click", "#utamakura", function (event) {
    event.stopPropagation();
    $(".utamakura").toggleClass("active");
    $(".kakekotoba, .engo, .jokotoba, .makurakotoba, .honkadori").removeClass("active");
});

// どこかをクリックしたら全ての要素から "active" クラスを削除する
$(document).on("click", function () {
    $(".kakekotoba, .engo, .jokotoba, .makurakotoba, .honkadori, .utamakura").removeClass("active");
});




////////////////////////////////////////////////////////////
// 音声再生
////////////////////////////////////////////////////////////

let sound; // 音声ファイルの再生を制御するための変数
let pausedTime = 0; // 一時停止した位置を記録する変数

$("#play-pause-btn").click(function () {
    const poemDataSet = jsonSelector.value;
    const poemData = poems[poemDataSet];
    const audioSrc = `../sound/${poemData.number}.mp3`;



    if (!sound || sound._src !== audioSrc) {
        if (sound) {
            sound.off(); // イベントリスナーをクリア
            sound.stop();
        }

        sound = new Howl({
            src: [audioSrc],
            onend: function () {
                $("#play-pause-btn").removeClass("current");
                pausedTime = 0; // 音声が終了したら pausedTime をリセット
            },
        });
    }

    if (!sound.playing()) {
        // 一時停止した位置から再生
        sound.seek(pausedTime);
        sound.play();
        $("#play-pause-btn").addClass("current");
    } else {
        // 一時停止して、再生位置を記録
        pausedTime = sound.seek();
        sound.pause();
        $("#play-pause-btn").removeClass("current");
    }
});



// ----------------------------------------------
// 歌人を選ぶとURLを遷移させる
// ----------------------------------------------


// 歌人が変更されたときにURLを更新する
$("#jsonSelector").on("change", function () {
    const selectedNumber = parseInt($(this).val());
    if (!isNaN(selectedNumber)) {
        // URLを更新してページを再読み込み
        const newUrl = baseURL + selectedNumber + ".html";
        window.location.href = newUrl;
    }
});


// ----------------------------------------------
// 遷移後もjsonSelectorの番号を維持する
// ----------------------------------------------
function getPoemNumberFromUrl() {
    const currentUrl = window.location.href;
    const regexPattern = /\/(\d+)\.html$/;
    const matches = currentUrl.match(regexPattern);
    if (matches && matches.length > 1) {
        return parseInt(matches[1]);
    } else {
        return null;
    }
}

// URLから詩の番号を取得し、jsonSelectorで選択状態にする
$(document).ready(function () {
    const selectedNumber = getPoemNumberFromUrl();
    if (!isNaN(selectedNumber)) {
        $("#jsonSelector").val(selectedNumber);
    }
});

// ----------------------------------------------
// スイッチで札を裏返すトグル（遷移前の状態を維持）
// ----------------------------------------------

function saveToggleState() {
    var toggleState = document.getElementById("toggle2").checked;
    localStorage.setItem("toggleState", toggleState);
}

// 保存された #toggle2 の状態を適用する関数
function applyToggleState() {
    var toggleState = localStorage.getItem("toggleState") === "true";
    var toggle2 = document.getElementById("toggle2");
    var cardItems = document.querySelectorAll(".card-item");

    toggle2.checked = toggleState;

    cardItems.forEach(function (item) {
        item.classList.toggle("active", toggleState);
    });
}

// ページ遷移前に #toggle2 の状態を保存する
window.addEventListener("beforeunload", saveToggleState);

// ページ遷移後に保存された #toggle2 の状態を適用する
window.addEventListener("load", function () {
    applyToggleState();

    // チェックボックスの変更イベントをリッスン
    var toggle2 = document.getElementById("toggle2");
    var cardItems = document.querySelectorAll(".card-item");

    toggle2.addEventListener("change", function (event) {
        var isChecked = event.target.checked;

        cardItems.forEach(function (item) {
            item.classList.toggle("active", isChecked);
        });
    });
});

// ----------------------------------------------
// 次へ・戻るボタン
// ----------------------------------------------
$(function () {
    // 次へボタンのクリックイベントハンドラ
    // 次へボタンのクリックイベントハンドラ
    $("#next, #next2.bottom").on("click", function (event) {
        const selectMenu = document.getElementById("jsonSelector");
        let currentOptionIndex = selectMenu.selectedIndex;

        // 次の選択肢のインデックスを計算
        let nextOptionIndex = currentOptionIndex + 1;
        if (nextOptionIndex >= selectMenu.options.length) {
            nextOptionIndex = 0;
        }


        // 現在の選択肢が"all"の場合、次の選択肢に進む（allをスキップ）
        while (selectMenu.options[nextOptionIndex].value === "all") {
            nextOptionIndex++;
            if (nextOptionIndex >= selectMenu.options.length) {
                nextOptionIndex = 0;
            }
        }

        // 次の選択肢に設定
        selectMenu.selectedIndex = nextOptionIndex;
        const changeEvent = new Event("change");
        selectMenu.dispatchEvent(changeEvent);
    });

    // 戻るボタンのクリックイベントハンドラ
    $("#back, #back2.bottom").on("click", function (event) {
        const selectMenu = document.getElementById("jsonSelector");
        let currentOptionIndex = selectMenu.selectedIndex;

        // 前の選択肢のインデックスを計算
        let previousOptionIndex = currentOptionIndex - 1;
        if (previousOptionIndex < 0) {
            previousOptionIndex = selectMenu.options.length - 1;
        }

        // 現在の選択肢が"all"の場合、前の選択肢に戻る（allをスキップ）
        while (selectMenu.options[previousOptionIndex].value === "all") {
            previousOptionIndex--;
            if (previousOptionIndex < 0) {
                previousOptionIndex = selectMenu.options.length - 1;
            }
        }

        // 前の選択肢に設定
        selectMenu.selectedIndex = previousOptionIndex;
        const changeEvent = new Event("change");
        selectMenu.dispatchEvent(changeEvent);
    });

});



// ----------------------------------------------
// トップに戻る
// ----------------------------------------------
$(function () {
    var pagetop = $("#page-top");
    pagetop.hide();
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            pagetop.fadeIn();
        } else {
            pagetop.fadeOut();
        }
    });
    pagetop.click(function () {
        $("html,body").animate({ scrollTop: 0 }, 800);
        return false;
    });
});

// ----------------------------------------------
// スマホの自動スクロール
// ----------------------------------------------

window.onload = function () {
    if (window.innerWidth <= 640 && window.location.hash === "") {
        window.scroll({
            top: 248,
            behavior: 'smooth'
        });
    }
};
// ----------------------------------------------
// EdgeのURL対応
// ----------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
    let currentUrl = window.location.href;
    
    if (currentUrl.endsWith('#!')) {
        let newUrl = currentUrl.slice(0, -2); // -2は「#!」の長さ
                window.location.replace(newUrl);
    }
});

// ----------------------------------------------
// animate.cssのInview連携
// ----------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
$(document).ready(function() {
    $('.trigger').on('inview', function(event, isInView) {
      if (isInView) {
        $(this).addClass('animate__animated animate__bounce');
      }
      else{
        $(this).removeClass('animate__animated animate__bounce');
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
    $(document).ready(function() {
        $('.trigger-left').on('inview', function(event, isInView) {
          if (isInView) {
            $(this).addClass('animate__animated animate__fadeInLeft');
          }
          else{
            $(this).removeClass('animate__animated animate__fadeInLeft');
          }
        });
      });
    });