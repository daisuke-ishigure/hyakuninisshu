/* --------------------------------------------
English version of the 相関図 (family charts) on the English poem pages (N_en.html), used by js/keizu-diagram.js.
A chart is drawn in English when its data has "lang": "en".
Keys are the n (or key) of the chart data, i.e. the Japanese name, so an English page can reuse the Japanese chart data.
  n:   name shown in the chart (keep it short; for emperors, without "Emperor" — the brown text already means emperor)
  tip: tooltip lines [heading, "Label: text", ...] (same format as js/keizu-tips.js)
People without an entry here are shown with their Japanese name. After editing, run node _tools/build-keizu.mjs.
-------------------------------------------- */
window.KD_TIPS_EN = {
  // ---------- Emperors ----------
  '天智': { n: 'Tenji', tip: ['Emperor Tenji', '38th emperor', 'Lived: 626–672', 'Reign: 668–672', 'Hyakunin Isshu: Poet of Poem 1, "Aki no ta no..."', 'Note: Known as Prince Naka no Ōe before taking the throne. Carried out the Taika Reforms with Nakatomi no Kamatari'] },
  '弘文': { n: 'Kōbun', tip: ['Emperor Kōbun', '39th emperor', 'Lived: 648–672', 'Reign: 671–672', 'Family: Son of Emperor Tenji. Known as Prince Ōtomo before taking the throne', 'Note: Lost the Jinshin War to Prince Ōama (Emperor Tenmu)'] },
  '天武': { n: 'Tenmu', tip: ['Emperor Tenmu', '40th emperor', 'Lived: Unknown–686', 'Reign: 673–686', 'Family: Younger brother of Emperor Tenji', 'Note: Took the throne after winning the Jinshin War (672)'] },
  '持統': { n: 'Jitō', tip: ['Empress Jitō', '41st emperor', 'Lived: 645–703', 'Reign: 690–697', "Family: Daughter of Emperor Tenji and empress of Emperor Tenmu", 'Hyakunin Isshu: Poet of Poem 2, "Haru sugite..."', 'Note: Moved the capital to Fujiwara-kyō'] },
  '元明': { n: 'Genmei', tip: ['Empress Genmei', '43rd emperor', 'Lived: 661–721', 'Reign: 707–715', 'Family: Daughter of Emperor Tenji. Wife of Prince Kusakabe, and mother of Emperor Monmu and Empress Genshō', 'Note: Moved the capital to Heijō-kyō (710)'] },
  '文武': { n: 'Monmu', tip: ['Emperor Monmu', '42nd emperor', 'Lived: 683–707', 'Reign: 697–707', 'Family: Son of Prince Kusakabe and Empress Genmei. Grandson of Emperor Tenmu and Empress Jitō', 'Note: The Taihō Code was completed during his reign (701)'] },
  '元正': { n: 'Genshō', tip: ['Empress Genshō', '44th emperor', 'Lived: 680–748', 'Reign: 715–724', 'Family: Daughter of Prince Kusakabe and Empress Genmei. Elder sister of Emperor Monmu', 'Note: Took the throne when her mother, Empress Genmei, stepped down'] },
  '聖武': { n: 'Shōmu', tip: ['Emperor Shōmu', '45th emperor', 'Lived: 701–756', 'Reign: 724–749', 'Family: His empress was Empress Kōmyō, daughter of Fujiwara no Fuhito', 'Note: Ordered provincial temples (kokubunji) to be built and the Great Buddha of Tōdai-ji to be made'] },
  '孝謙・称徳': { n: 'Kōken / Shōtoku', tip: ['Empress Kōken / Empress Shōtoku', '46th and 48th emperor', 'Lived: 718–770', 'Reign: 749–758 (as Kōken), 764–770 (as Shōtoku)', 'Family: Daughter of Emperor Shōmu and Empress Kōmyō', 'Note: After stepping down for Emperor Junnin, she took the throne again as Empress Shōtoku. She gave great power to the monk Dōkyō'] },
  '光仁': { n: 'Kōnin', tip: ['Emperor Kōnin', '49th emperor', 'Lived: 709–782', 'Reign: 770–781', 'Family: Grandson of Emperor Tenji and son of Prince Shiki', "Note: Took the throne after Empress Shōtoku, moving the imperial line from Tenmu's descendants back to Tenji's"] },
  '桓武': { n: 'Kanmu', tip: ['Emperor Kanmu', '50th emperor', 'Lived: 737–806', 'Reign: 781–806', 'Note: Moved the capital to Nagaoka-kyō, then to Heian-kyō (794)'] },
  '平城': { n: 'Heizei', tip: ['Emperor Heizei', '51st emperor', 'Lived: 774–824', 'Reign: 806–809', 'Note: After stepping down, he became a monk following the Retired Emperor Heizei Incident (Kusuko Incident) of 810'] },
  '嵯峨': { n: 'Saga', tip: ['Emperor Saga', '52nd emperor', 'Lived: 786–842', 'Reign: 809–823', 'Note: Gave his sons and daughters the family name Minamoto (the Saga Genji)'] },
  '淳和': { n: 'Junna', tip: ['Emperor Junna', '53rd emperor', 'Lived: 786–840', 'Reign: 823–833', 'Family: Son of Emperor Kanmu and younger brother of Emperor Saga'] },
  '仁明': { n: 'Ninmyō', tip: ['Emperor Ninmyō', '54th emperor', 'Lived: 810–850', 'Reign: 833–850'] },
  '文徳': { n: 'Montoku', tip: ['Emperor Montoku', '55th emperor', 'Lived: 827–858', 'Reign: 850–858'] },
  '光孝': { n: 'Kōkō', tip: ['Emperor Kōkō', '58th emperor', 'Lived: 830–887', 'Reign: 884–887', 'Family: Son of Emperor Ninmyō', 'Hyakunin Isshu: Poet of Poem 15, "Kimi ga tame haru no no ni..."'] },
  '阿保親王': { n: 'Prince Abo', tip: ['Prince Abo', 'Lived: 792–842', 'Rank: Third Rank for princes; First Rank after death', 'Family: Son of Emperor Heizei; father of Ariwara no Yukihira and Narihira'] },
  '藤原乙牟漏': { n: 'Fujiwara no Otomuro', tip: ['Fujiwara no Otomuro', 'Lived: 760–790', 'Family: Daughter of Fujiwara no Yoshitsugu', 'Note: Empress of Emperor Kanmu; mother of Emperors Heizei and Saga'] },
  '藤原旅子': { n: 'Fujiwara no Tabiko', tip: ['Fujiwara no Tabiko', 'Lived: 759–788', 'Family: Daughter of Fujiwara no Momokawa', 'Note: A consort of Emperor Kanmu; mother of Emperor Junna'] },
  '百済永継': { n: 'Kudara no Nagatsugu', tip: ['Kudara no Nagatsugu', 'Family: Daughter of Asukabe no Natomaro', 'Note: A lady serving Emperor Kanmu and mother of Yoshimine no Yasuyo. She was also a wife of Fujiwara no Uchimaro'] },
  '早良親王': { n: 'Prince Sawara', tip: ['Prince Sawara', 'Family: Son of Emperor Kōnin and Takano no Niigasa; younger brother of Emperor Kanmu by the same mother', 'Note: Became a monk at Tōdai-ji at 11. He returned to lay life in 781 and became crown prince, but lost that position over the murder of Fujiwara no Tanetsugu and died after refusing food on the way to exile in Awaji'] },

  // ---------- The Ōtomo clan ----------
  '大伴安麻呂': { n: 'Ōtomo no Yasumaro', tip: ['Ōtomo no Yasumaro', 'Office: Upper Counselor', 'Note: Father of Ōtomo no Tabito'] },
  '大伴旅人': { n: 'Ōtomo no Tabito', tip: ['Ōtomo no Tabito', 'Family: Son of Ōtomo no Yasumaro', 'Note: Father of Ōtomo no Yakamochi and Kakimochi'] },
  '大伴書持': { n: 'Ōtomo no Kakimochi', tip: ['Ōtomo no Kakimochi', "Family: Son of Ōtomo no Tabito; Yakamochi's elder or younger brother"] },
  '大伴家持': { n: 'Ōtomo no Yakamochi', tip: ['Ōtomo no Yakamochi', 'Office: Middle Counselor', 'Rank: Junior Third Rank', 'Family: Son of Ōtomo no Tabito and Tajihi no Iratsume', 'Hyakunin Isshu: Poet of Poem 6, "Kasasagi no..."', 'Note: Died in the 8th month of 785. Blamed for the murder of Fujiwara no Tanetsugu the next month, he was refused burial and removed from the official records. He was pardoned in 806'] },
  '大伴永主': { n: 'Ōtomo no Naganushi', tip: ['Ōtomo no Naganushi', 'Family: Son of Ōtomo no Yakamochi', 'Note: Punished along with others for the murder of Fujiwara no Tanetsugu and exiled to Oki Province'] },
  '大伴古麻呂': { n: 'Ōtomo no Komaro', tip: ['Ōtomo no Komaro', 'Office: Major Controller of the Left', 'Family: There are several theories about his father; nothing is certain', 'Note: Father of Ōtomo no Tsuguhito'] },
  '大伴継人': { n: 'Ōtomo no Tsuguhito', tip: ['Ōtomo no Tsuguhito', 'Family: Son of Ōtomo no Komaro', 'Note: Beheaded as the leader of the plot to murder Fujiwara no Tanetsugu. Pardoned in 806 and given Senior Fifth Rank, Upper Grade, after death'] },
  '大伴竹良': { n: 'Ōtomo no Takeyoshi', tip: ['Ōtomo no Takeyoshi', 'Family: Some family trees show him as a son of Ōtomo no Komaro; of the same clan as Tsuguhito', 'Note: The first to be arrested for the murder of Fujiwara no Tanetsugu, and beheaded'] },
  '伴国道': { n: 'Tomo no Kunimichi', tip: ['Tomo no Kunimichi', 'Lived: 768–828', 'Family: Son of Ōtomo no Tsuguhito', 'Note: Punished along with others for the murder of Fujiwara no Tanetsugu and exiled to Sado Province. Father of Tomo no Yoshio'] },
  '伴善男': { n: 'Tomo no Yoshio', tip: ['Tomo no Yoshio', 'Office: Upper Counselor', 'Family: Son of Tomo no Kunimichi', 'Note: Exiled to Izu Province after the Ōtenmon Incident of 866'] },

  // ---------- The Ono clan ----------
  '小野妹子': { n: 'Ono no Imoko', tip: ['Ono no Imoko', 'Note: Sent to Sui China as an envoy. The family line from him down to Ono no Minemori is not clear'] },
  '小野岑守': { n: 'Ono no Minemori', tip: ['Ono no Minemori', 'Lived: 778–830', 'Family: Third son of Ono no Nagami', 'Note: Father of Ono no Takamura; said to be the great-grandfather of Ono no Komachi'] },
  '藤原敏行室': { n: "Minemori's daughter", tip: ['Daughter of Ono no Minemori', "Note: Wife of Fujiwara no Toshiyuki; Ono no Takamura's elder or younger sister"] },
  '敏行': { n: 'Fujiwara no Toshiyuki', tip: ['Fujiwara no Toshiyuki', 'Lived: Unknown–901', 'Office: Commander of the Right Military Guards', 'Rank: Junior Fourth Rank, Upper Grade', 'Hyakunin Isshu: Poet of Poem 18, "Suminoe no..."', 'Note: In the Hyakunin Isshu he is called Fujiwara no Toshiyuki Ason'] },
  '小野篁': { n: 'Ono no Takamura', tip: ['Ono no Takamura', 'Lived: 802–853', 'Office: Councillor (Sangi)', 'Family: Son of Ono no Minemori', 'Hyakunin Isshu: Poet of Poem 11, "Wata no hara yasoshima kakete..."', 'Note: One theory says he was the grandfather of Ono no Komachi and Ono no Michikaze'] },
  '小野良真': { n: 'Ono no Yoshizane', tip: ['Ono no Yoshizane', 'Family: Son of Ono no Takamura (his name is also written 良貞 or 良実)', 'Note: Said to be the father of Ono no Komachi'] },
  '小野葛絃': { n: 'Ono no Kuzuo', tip: ['Ono no Kuzuo', 'Office: Senior Assistant Governor-General of Dazaifu', 'Family: Son of Ono no Takamura', 'Note: Father of Ono no Yoshifuru and Ono no Michikaze'] },
  '小野小町': { n: 'Ono no Komachi', tip: ['Ono no Komachi', 'Hyakunin Isshu: Poet of Poem 9, "Hana no iro wa..."', 'Family: Her origins are not clear. She is usually said to be the daughter of Ono no Yoshizane, but some say she was the daughter of Ono no Takamura'] },
  '小野道風': { n: 'Ono no Michikaze', tip: ['Ono no Michikaze', 'Family: Third son of Ono no Kuzuo; grandson of Ono no Takamura', 'Note: Famous as a calligrapher, one of the Three Great Calligraphers (Sanseki)'] },

  // ---------- Around Emperor Yōzei (13.html) ----------
  '宇多': { n: 'Uda', tip: ['Emperor Uda', '59th emperor', 'Lived: 867–931', 'Reign: 887–897', 'Note: Gave Sugawara no Michizane important posts'] },
  '清和': { n: 'Seiwa', tip: ['Emperor Seiwa', '56th emperor', 'Lived: 850–881', 'Reign: 858–876', 'Note: Took the throne at 9; his grandfather on his mother\'s side, Fujiwara no Yoshifusa, ran the government'] },
  '陽成': { n: 'Yōzei', tip: ['Emperor Yōzei', '57th emperor', 'Lived: 869–949', 'Reign: 876–884', 'Hyakunin Isshu: Poet of Poem 13, "Tsukubane no..."', 'Note: In the Hyakunin Isshu he is called Retired Emperor Yōzei'] },
  '班子女王': { n: 'Princess Nakako', tip: ['Princess Nakako', 'Lived: 833–900', 'Family: Daughter of Prince Nakano', 'Note: Consort of Emperor Kōkō; mother of Emperor Uda and Prince Koretada'] },
  '綏子内親王': { n: 'Princess Suishi', tip: ['Princess Suishi', 'Family: Daughter of Emperor Kōkō; her mother was Princess Nakako', 'Note: A consort of Emperor Yōzei'] },
  '遠長の娘': { n: "Tōnaga's daughter", tip: ['Daughter of Fujiwara no Tōnaga', 'Note: A consort of Emperor Yōzei; mother of Prince Motoyoshi'] },
  '元良親王': { n: 'Prince Motoyoshi', tip: ['Prince Motoyoshi', 'Lived: 890–943', 'Rank: Third Rank for princes', 'Family: Son of Emperor Yōzei', 'Hyakunin Isshu: Poet of Poem 20, "Wabinureba..."'] },
  '源潔姫': { n: 'Kiyohime', tip: ['Minamoto no Kiyohime', 'Family: Daughter of Emperor Saga', 'Note: Wife of Fujiwara no Yoshifusa; mother of Akirakeiko'] },
  '冬嗣': { n: 'Fuyutsugu', tip: ['Fujiwara no Fuyutsugu', 'Lived: 775–826', 'Office: Minister of the Left', 'Rank: Senior Second Rank; Senior First Rank after death'] },
  '沢子': { n: 'Sawako', tip: ['Fujiwara no Sawako', 'Family: Daughter of Fujiwara no Fusatsugu', 'Note: A consort of Emperor Ninmyō and mother of Emperor Kōkō; named Empress Dowager after death'] },
  '順子': { n: 'Nobuko', tip: ['Fujiwara no Nobuko', 'Family: Daughter of Fujiwara no Fuyutsugu', 'Note: A consort of Emperor Ninmyō; mother of Emperor Montoku'] },
  '良房': { n: 'Yoshifusa', tip: ['Fujiwara no Yoshifusa', 'Lived: 804–872', 'Office: Regent (Sesshō) and Chancellor of the Realm', 'Rank: Junior First Rank; Senior First Rank after death', 'Note: The first regent in history who was not of the imperial family'] },
  '長良': { n: 'Nagara', tip: ['Fujiwara no Nagara', 'Lived: 802–856', 'Office: Acting Middle Counselor', 'Rank: Junior Second Rank; Senior First Rank after death', 'Imperial in-law: Uncle (on the mother\'s side) of Emperor Montoku; grandfather (on the mother\'s side) of Emperor Yōzei'] },
  '良門': { n: 'Yoshikado', tip: ['Fujiwara no Yoshikado', 'Lived: Unknown', 'Office: Palace guard (Udoneri)', 'Rank: Senior Sixth Rank, Upper Grade'] },
  '明子': { n: 'Akirakeiko', tip: ['Fujiwara no Akirakeiko', 'Lived: 828–900', 'Family: Daughter of Fujiwara no Yoshifusa and Minamoto no Kiyohime', 'Note: A consort of Emperor Montoku and mother of Emperor Seiwa; called the Somedono Empress'] },
  '基経': { n: 'Mototsune', tip: ['Fujiwara no Mototsune', 'Family: His birth father was Nagara; adopted by Yoshifusa', 'Lived: 836–891', 'Office: Regent, Kampaku (chief adviser), and Chancellor of the Realm', 'Rank: Junior First Rank; Senior First Rank after death', 'Note: In practice, the first Kampaku in history', "Imperial in-law: Grandfather (on the mother's side) of Emperors Suzaku and Murakami (their mother was Fujiwara no Onshi)"] },
  '国経': { n: 'Kunitsune', tip: ['Fujiwara no Kunitsune', 'Lived: 828–908', 'Family: Eldest son of Fujiwara no Nagara'] },
  '利基': { n: 'Toshimoto', tip: ['Fujiwara no Toshimoto', 'Lived: Unknown', 'Office: Middle Captain of the Right Palace Guards', 'Rank: Junior Fourth Rank, Upper Grade'] },
  '高藤': { n: 'Takafuji', tip: ['Fujiwara no Takafuji', 'Lived: 838–900', 'Office: Palace Minister', 'Rank: Senior Third Rank; Senior First Rank after death', 'Note: Founder of the Kajūji family', "Imperial in-law: Grandfather (on the mother's side) of Emperor Daigo"] },
  '高子': { n: 'Takaiko', tip: ['Fujiwara no Takaiko', 'Lived: 842–910', 'Family: A consort of Emperor Seiwa; mother of Emperor Yōzei', 'Note: Before entering the palace, she was known for her love affair with Ariwara no Narihira, told in The Tales of Ise and elsewhere'] },
  '時平': { n: 'Tokihira', tip: ['Fujiwara no Tokihira', 'Lived: 871–909', 'Office: Minister of the Left', 'Rank: Senior Second Rank; Senior First Rank after death', 'Note: Had Sugawara no Michizane sent away to Dazaifu in the Shōtai Incident'] },
  '仲平': { n: 'Nakahira', tip: ['Fujiwara no Nakahira', 'Lived: 875–945', 'Office: Minister of the Left', 'Rank: Senior Second Rank'] },
  '忠平': { n: 'Teishin-kō', tip: ['Fujiwara no Tadahira', 'Name after death: Teishin-kō', 'Lived: 880–949', 'Office: Regent and Kampaku (chief adviser)', 'Rank: Junior First Rank; Senior First Rank after death', 'Hyakunin Isshu: Poet of Poem 26, "Ogurayama..."', 'Note: In the Hyakunin Isshu he is called Teishin-kō'] },
  '定方': { n: 'Minister of the Right of Sanjō', tip: ['Fujiwara no Sadakata', 'Lived: 873–932', 'Office: Minister of the Right', 'Rank: Junior Second Rank; Junior First Rank after death', "Imperial in-law: Uncle (on the mother's side) of Emperor Daigo", 'Hyakunin Isshu: Poet of Poem 25, "Na ni shi owaba..."', 'Note: In the Hyakunin Isshu he is called the Minister of the Right of Sanjō'] },
  '褒子': { n: 'Hōshi', tip: ['Fujiwara no Hōshi', 'Family: Second daughter of Fujiwara no Tokihira', 'Note: A consort of the cloistered Emperor Uda; said to have had a secret affair with Prince Motoyoshi'] },

  // ---------- Around Minamoto no Tōru (14.html) ----------
  '醍醐': { n: 'Daigo', tip: ['Emperor Daigo', '60th emperor', 'Lived: 885–930', 'Reign: 897–930', 'Note: Ordered the compiling of the Kokin Wakashū'] },
  '橘嘉智子': { n: 'Tachibana no Kachiko', tip: ['Tachibana no Kachiko', 'Note: Empress of Emperor Saga and mother of Emperor Ninmyō; called the Danrin Empress'] },
  '大原全子': { n: 'Ōhara no Zenshi', tip: ['Ōhara no Zenshi', "Note: A consort of Emperor Saga; Minamoto no Tōru's mother"] },
  '源融': { n: 'Minamoto no Tōru', tip: ['Minamoto no Tōru', 'Lived: 822–895', 'Office: Minister of the Left', 'Rank: Junior First Rank; Senior First Rank after death', 'Family: Son of Emperor Saga', 'Hyakunin Isshu: Poet of Poem 14, "Michinoku no..."', 'Note: In the Hyakunin Isshu he is called the Minister of the Left of Kawara'] },
  '源弘': { n: 'Minamoto no Hiromu', tip: ['Minamoto no Hiromu', 'Lived: 812–863', 'Family: Son of Emperor Saga; his mother was from the Kamitsukeno family', 'Note: Founder of the Hiromu line of the Saga Genji'] },
  '源希': { n: 'Minamoto no Mare', tip: ['Minamoto no Mare', 'Lived: 849–902', 'Office: Middle Counselor', 'Rank: Junior Third Rank'] },
  '源等': { n: 'Councillor Hitoshi', tip: ['Minamoto no Hitoshi', 'Lived: 880–951', 'Office: Councillor (Sangi)', 'Rank: Senior Fourth Rank, Lower Grade', 'Hyakunin Isshu: Poet of Poem 39, "Asajiu no..."', 'Note: In the Hyakunin Isshu he is called Councillor Hitoshi'] },
  '胤子': { n: 'Taneko', tip: ['Fujiwara no Taneko', 'Lived: Unknown–896', 'Family: Daughter of Fujiwara no Takafuji and Miyaji no Ressi; elder or younger sister of Sadakuni and Sadakata (same mother)', 'Note: A consort of Emperor Uda; mother of Emperor Daigo, Prince Atsuyoshi and Prince Atsumi'] },

  // ---------- Around Emperor Kōkō (15.html) ----------
  '是忠親王': { n: 'Prince Koretada', tip: ['Prince Koretada', 'Family: Son of Emperor Kōkō; his mother was Princess Nakako', 'Note: Father of Minamoto no Muneyuki and Prince Koga'] },
  '源宗于': { n: 'Minamoto no Muneyuki', tip: ['Minamoto no Muneyuki', 'Lived: Unknown–940', 'Rank: Senior Fourth Rank, Lower Grade', 'Family: Son of Prince Koretada', 'Hyakunin Isshu: Poet of Poem 28, "Yamazato wa..."', 'Note: In the Hyakunin Isshu he is called Minamoto no Muneyuki Ason'] },
  '興我王': { n: 'Prince Koga', tip: ['Prince Koga', 'Family: Son of Prince Koretada'] },
  '平篤行': { n: 'Taira no Atsuyuki', tip: ['Taira no Atsuyuki', "Family: In the Sonpi Bunmyaku (a book of family trees), he is Prince Koga's son and Taira no Kanemori's father"] },
  '平兼盛': { n: 'Taira no Kanemori', tip: ['Taira no Kanemori', 'Hyakunin Isshu: Poet of Poem 40, "Shinoburedo..."', "Family: The Sonpi Bunmyaku makes him Taira no Atsuyuki's son, Prince Koretada's great-grandson (through Prince Koga and Atsuyuki), and Emperor Kōkō's great-great-grandson. But the dates don't fit, so some think he was the son of Prince Atsumochi, a son of Prince Koretada", 'Note: Beat Mibu no Tadami at the Poetry Contest of the Imperial Palace in 960. He was the former husband of Akazome Emon\'s mother; he is said to have claimed Akazome Emon as his own daughter and taken the matter to the police office (Kebiishi-chō) to get her back'] },

  // ---------- Around Ariwara no Narihira (17.html) ----------
  '温子': { n: 'Onshi', tip: ['Fujiwara no Onshi', 'Family: Daughter of the Kampaku (chief adviser) Fujiwara no Mototsune', "Note: A consort of Emperor Uda. She adopted Prince Atsuhito (later Emperor Daigo), the son of Fujiwara no Taneko. The poet Ise served her as a lady-in-waiting"] },

  // ---------- Around Fujiwara no Toshiyuki: the Ki clan (18.html) ----------
  '紀勝長': { n: 'Ki no Katsunaga', tip: ['Ki no Katsunaga', 'Office: Middle Counselor', 'Note: Father of Ki no Okimichi and Ki no Natora'] },
  '紀興道': { n: 'Ki no Okimichi', tip: ['Ki no Okimichi', 'Lived: Unknown–834', 'Family: Son of Ki no Katsunaga', 'Note: Father of Ki no Motomichi'] },
  '紀名虎': { n: 'Ki no Natora', tip: ['Ki no Natora', 'Office: Minister of Justice', 'Family: Son of Ki no Katsunaga', "Note: Father of Ki no Aritsune. His daughter was Fujiwara no Fujimaro's wife and Fujiwara no Toshiyuki's mother"] },
  '紀本道': { n: 'Ki no Motomichi', tip: ['Ki no Motomichi', 'Office: Governor of Shimotsuke', 'Family: Son of Ki no Okimichi', "Note: Father of Ki no Aritomo and Ki no Mochiyuki; Ki no Tsurayuki's grandfather"] },
  '富士麻呂': { n: 'Fujiwara no Fujimaro', tip: ['Fujiwara no Fujimaro', 'Lived: 804–850', 'Office: Inspector of Mutsu and Dewa', 'Rank: Junior Fourth Rank, Lower Grade'] },
  '名虎の娘': { n: "Natora's daughter", tip: ['Daughter of Ki no Natora', "Note: Fujiwara no Fujimaro's wife and Fujiwara no Toshiyuki's mother"] },
  '紀有常': { n: 'Ki no Aritsune', tip: ['Ki no Aritsune', 'Lived: 815–877', 'Family: Son of Ki no Natora', 'Note: His daughters became the wives of Ariwara no Narihira and Fujiwara no Toshiyuki'] },
  '紀有友': { n: 'Ki no Aritomo', tip: ['Ki no Aritomo', 'Lived: Unknown–880', 'Family: Son of Ki no Motomichi (some records say son of Ki no Okimichi)', 'Note: Father of Ki no Tomonori'] },
  '紀望行': { n: 'Ki no Mochiyuki', tip: ['Ki no Mochiyuki', 'Family: Son of Ki no Motomichi', 'Note: Father of Ki no Tsurayuki'] },
  '有常の娘': { n: "Aritsune's daughter", tip: ['Daughter of Ki no Aritsune', 'Note: Two sisters became the wives of Fujiwara no Toshiyuki and Ariwara no Narihira'] },
  '紀友則': { n: 'Ki no Tomonori', tip: ['Ki no Tomonori', 'Family: Son of Ki no Aritomo; cousin of Ki no Tsurayuki', 'Hyakunin Isshu: Poet of Poem 33, "Hisakata no..."', 'Note: One of the compilers of the Kokin Wakashū with Ki no Tsurayuki and Mibu no Tadamine, but he died before it was finished'] },
  '紀貫之': { n: 'Ki no Tsurayuki', tip: ['Ki no Tsurayuki', 'Rank: Junior Fifth Rank, Upper Grade', 'Family: Son of Ki no Mochiyuki; cousin of Ki no Tomonori', 'Hyakunin Isshu: Poet of Poem 35, "Hito wa isa..."', 'Note: A compiler of the Kokin Wakashū, who wrote its Japanese preface. After serving as Governor of Tosa, he wrote the Tosa Diary'] },

  // ---------- Around Ise (19.html) ----------
  '均子内親王': { n: 'Princess Kinshi', tip: ['Princess Kinshi', 'Lived: 890–910', 'Family: Daughter of Emperor Uda and Fujiwara no Onshi', 'Note: Became the wife of her half-brother, Prince Atsuyoshi'] },
  '敦慶親王': { n: 'Prince Atsuyoshi', tip: ['Prince Atsuyoshi', 'Lived: 888–930', 'Rank: Second Rank for princes', 'Family: Son of Emperor Uda; his mother was Fujiwara no Taneko', 'Note: Served as Minister of the Center (Nakatsukasa-kyō) and Minister of Ceremonies. He married Ise, and their daughter Nakatsukasa was born'] },
  '伊勢': { n: 'Ise', tip: ['Ise', 'Lived: c. 872–c. 938', 'Family: Daughter of Fujiwara no Tsugukage, Governor of Ise', 'Hyakunin Isshu: Poet of Poem 19, "Naniwagata..."', "Note: Served Emperor Uda's empress Onshi as a lady-in-waiting. After relationships with the brothers Fujiwara no Nakahira and Tokihira and with Taira no Sadafun, she was loved by Emperor Uda and bore him a son, who died young. Later she and Prince Atsuyoshi had a daughter, Nakatsukasa"] },
  '中務': { n: 'Nakatsukasa', tip: ['Nakatsukasa', 'Lived: c. 912–c. 991', 'Family: Daughter of Prince Atsuyoshi and Ise', 'Note: Called Nakatsukasa because her father, Prince Atsuyoshi, was Minister of the Center (Nakatsukasa-kyō). One of the Thirty-Six Immortal Poets. She had a close relationship with Minamoto no Saneakira (a great-grandson of Emperor Kōkō)'] },

  // ---------- Around Fun'ya no Yasuhide (22.html) ----------
  '文室大市': { n: "Fun'ya no Ōchi", tip: ["Fun'ya no Ōchi", 'Lived: 704–780', 'Office: Upper Counselor', 'Rank: Senior Second Rank', 'Family: Son of Prince Naga', 'Note: Was given the family name Fun\'ya no Mahito and left the imperial family to become a subject'] },
  '文室浄三': { n: "Fun'ya no Kiyomi", tip: ["Fun'ya no Kiyomi", 'Family: Son of Prince Naga; originally Prince Chinu', "Note: In 752, he and his younger brother, Prince Ōchi, were given the family name Fun'ya"] },
  '文室大原': { n: "Fun'ya no Ōhara", tip: ["Fun'ya no Ōhara", "Note: Father of Fun'ya no Watamaro. In 792 his family name was changed from Fun'ya no Mahito to Mimoro no Ason (Mimoro no Ōhara)"] },
  '文室綿麻呂': { n: "Fun'ya no Watamaro", tip: ["Fun'ya no Watamaro", "Family: Son of Fun'ya no Ōhara (Mimoro no Ōhara)", "Note: His family name was changed to Mimoro no Ason in 792; in 809 he was given Miyama no Ason, and then Fun'ya no Ason"] },

  // ---------- Around Ōe no Chisato: the Ōe clan (23.html) ----------
  '土師宿禰': { n: 'Haji no Sukune', tip: ['The Haji clan (Haji no Sukune)', 'Note: A clan said to descend from Nomi no Sukune. In the time of Emperor Kanmu, the Akishino, Sugawara, and Ōe (at first written 大枝, later 大江) families branched off from it'] },
  '土師真妹': { n: 'Haji no Maimo', tip: ['Haji no Maimo', 'Family: From the Haji clan', "Note: Wife of Yamato no Ototsugu, mother of Takano no Niigasa, and grandmother (on the mother's side) of Emperor Kanmu. In the 12th month of Enryaku 9 (790) she was granted Senior First Rank and the family name Ōe no Ason"] },
  '高野新笠': { n: 'Takano no Niigasa', tip: ['Takano no Niigasa', 'Family: Daughter of Yamato no Ototsugu and Haji no Maimo', 'Note: A consort of Emperor Kōnin; mother of Emperor Kanmu'] },
  '大枝諸上': { n: 'Morogami', tip: ['Ōe no Morogami', 'Family: From the Haji clan', "Note: In the 12th month of Enryaku 9 (February 791), on the first anniversary of Takano no Niigasa's death, his family name was changed from Haji no Sukune to Ōe no Ason. Grandfather of Ōe no Otondo"] },
  '大枝本主': { n: 'Motonushi', tip: ['Ōe no Motonushi', 'Office: Acting Assistant Governor of Bitchū', "Note: Father of Ōe no Otondo. Otondo's mother was a daughter of Nakatomi no Iwane, who had served Prince Abo"] },
  '大江音人': { n: 'Otondo', tip: ['Ōe no Otondo', 'Lived: 811–877', 'Office: Councillor (Sangi)', 'Family: Son of Ōe no Motonushi; some say he was a son of Prince Abo', 'Note: In 866 he changed the way the family name was written, from 大枝 to 大江. Father of Chifuru, Chisato, Tamabuchi, and others'] },
  '大江玉淵': { n: 'Tamabuchi', tip: ['Ōe no Tamabuchi', 'Family: Son of Ōe no Otondo', 'Note: Father of Ōe no Asatsuna. He adopted Shirome, a courtesan known as a poet'] },
  '大江千里': { n: 'Chisato', tip: ['Ōe no Chisato', 'Family: Son of Ōe no Otondo (some say son of Ōe no Tamabuchi)', 'Hyakunin Isshu: Poet of Poem 23, "Tsuki mireba..."', 'Note: A Confucian scholar who studied at the Daigakuryō (the court university)'] },
  '大江千古': { n: 'Chifuru', tip: ['Ōe no Chifuru', 'Lived: 866–924', 'Family: Son of Ōe no Otondo', 'Note: Father of Ōe no Koretoki'] },
  '大江朝綱': { n: 'Asatsuna', tip: ['Ōe no Asatsuna', 'Lived: 886–958', 'Office: Councillor (Sangi)', 'Family: Son of Ōe no Tamabuchi', 'Note: Called "Nochi no Gōshōkō" (the Later Councillor Ōe), as against his grandfather Otondo, "Gōshōkō." He was excellent at Chinese poetry and calligraphy'] },
  '大江維時': { n: 'Koretoki', tip: ['Ōe no Koretoki', 'Lived: 888–963', 'Office: Middle Counselor', 'Family: Son of Ōe no Chifuru', 'Note: Father of Shigemitsu and Tadamitsu'] },
  '大江斉光': { n: 'Tadamitsu', tip: ['Ōe no Tadamitsu', 'Lived: 934–987', 'Office: Councillor (Sangi)', 'Family: Son of Ōe no Koretoki'] },
  '大江重光': { n: 'Shigemitsu', tip: ['Ōe no Shigemitsu', 'Family: Son of Ōe no Koretoki', 'Note: Father of Ōe no Masahira. Some say he was also the father of Ōe no Masamune'] },
  '高階成忠': { n: 'Naritada', tip: ['Takashina no Naritada', 'Note: Father of Takashina no Takako (Mother of the Honorary Grand Minister), Akinobu, and others'] },
  '高階明順': { n: 'Akinobu', tip: ['Takashina no Akinobu', 'Lived: Unknown–1009', 'Office: Governor of Iyo', 'Family: Son of Takashina no Naritada; elder or younger brother of Takashina no Takako (Mother of the Honorary Grand Minister)', "Note: Father of Takashina no Narinobu. His daughter was Ōe no Takachika's wife"] },
  '藤原定子': { n: 'Fujiwara no Teishi', tip: ['Fujiwara no Teishi', 'Lived: 976–1001', 'Family: Daughter of Fujiwara no Michitaka and Takashina no Takako (Mother of the Honorary Grand Minister)', 'Note: Empress (chūgū) of Emperor Ichijō, later named kōgō. Sei Shōnagon served her'] },
  '大江匡衡': { n: 'Masahira', tip: ['Ōe no Masahira', 'Lived: 952–1012', 'Family: Son of Ōe no Shigemitsu', 'Note: A Professor of Letters (Monjō Hakase). His wife was Akazome Emon, and he was the father of Takachika and Gō Jijū. Some say Ōe no Masamune was his elder brother, but this is not certain'] },
  '赤染衛門': { n: 'Akazome Emon', tip: ['Akazome Emon', 'Lived: c. 956–c. 1041', 'Hyakunin Isshu: Poet of Poem 59, "Yasurawade..."', "Family: Said to be the daughter of Akazome Tokimochi, but the Fukuro Zōshi says her mother remarried Tokimochi while carrying a child by her former husband, Taira no Kanemori, and then gave birth to Akazome Emon", 'Note: Served Minamoto no Tomoko and her daughter Akiko. She and her husband, Ōe no Masahira, were known as a devoted couple'] },
  '大江雅致': { n: 'Masamune', tip: ['Ōe no Masamune', "Office: Senior Secretary of the Grand Empress Dowager's Household (serving Princess Shōshi), Head of the Carpentry Bureau, Governor of Echizen", 'Family: Some say he was a son of Ōe no Shigemitsu, others that he was the elder brother of Ōe no Masahira. One genealogy gives Shigemitsu as his father', 'Note: Father of Izumi Shikibu. One theory says her name "Shikibu" comes from his post as Shikibu-no-jō (Secretary of the Ministry of Ceremonies), which he held after studying at the court university'] },
  '平保衡の娘': { n: "Yasuhira's daughter", tip: ['Daughter of Taira no Yasuhira', "Note: Wife of Ōe no Masamune and mother of Izumi Shikibu. Said to have been Princess Shōshi's nurse (or the nurse's daughter)"] },
  '江侍従': { n: 'Gō Jijū', tip: ['Gō Jijū', 'Family: Daughter of Ōe no Masahira and Akazome Emon', 'Note: Her name was Ōe no Masako. Wife of Fujiwara no Kanefusa'] },
  '大江挙周': { n: 'Takachika', tip: ['Ōe no Takachika', 'Lived: Unknown–1046', 'Family: Son of Ōe no Masahira and Akazome Emon', "Note: His wife was Takashina no Akinobu's daughter. Father of Ōe no Narihira"] },
  '明順の娘': { n: "Akinobu's daughter", tip: ['Daughter of Takashina no Akinobu', "Note: Ōe no Takachika's wife; mother of Ōe no Narihira"] },
  '藤原保昌': { n: 'Fujiwara no Yasumasa', tip: ['Fujiwara no Yasumasa', "Note: Izumi Shikibu's second husband"] },
  '和泉式部': { n: 'Izumi Shikibu', tip: ['Izumi Shikibu', "Family: Child of Ōe no Masamune and Taira no Yasuhira's daughter", 'Hyakunin Isshu: Poet of Poem 56, "Arazaramu..."', 'Note: Married Tachibana no Michisada and gave birth to Koshikibu no Naishi. After love affairs with Prince Tametaka and Prince Atsumichi, she began serving Empress Akiko around 1009. Later she remarried, to Fujiwara no Yasumasa'] },
  '橘道貞': { n: 'Tachibana no Michisada', tip: ['Tachibana no Michisada', "Note: Izumi Shikibu's first husband and Koshikibu no Naishi's father. Izumi, the province he governed, gave Izumi Shikibu her name"] },
  '大江成衡': { n: 'Ōe no Narihira', tip: ['Ōe no Narihira', "Family: Child of Ōe no Takachika and Takashina no Akinobu's daughter", 'Note: Father of Ōe no Masafusa'] },
  '橘孝親の娘': { n: "Takachika's daughter", tip: ['Daughter of Tachibana no Takachika', "Note: Ōe no Narihira's wife; mother of Ōe no Masafusa"] },
  '小式部内侍': { n: 'Koshikibu no Naishi', tip: ['Koshikibu no Naishi', 'Family: Daughter of Tachibana no Michisada and Izumi Shikibu', 'Hyakunin Isshu: Poet of Poem 60, "Ōeyama..."', 'Note: Served Empress Akiko together with her mother. Known for her relationships with many men, including Fujiwara no Norimichi, Yorimune, Norinaga, and Sadayori; she had a son, Jōen, with Norimichi and a daughter with Norinaga. In 1025 she died, at about 28, after giving birth to a child of Fujiwara no Kinnari'] },
  '大江匡房': { n: 'Masafusa', tip: ['Ōe no Masafusa', 'Lived: 1041–1111', 'Office: Acting Middle Counselor', 'Family: Son of Ōe no Narihira; great-grandson of Ōe no Masahira and Akazome Emon', 'Hyakunin Isshu: Poet of Poem 73, "Takasago no..."', 'Note: In the Hyakunin Isshu he is called Acting Middle Counselor Masafusa'] },

  // ---------- Around Sugawara no Michizane (24.html) ----------
  '是善': { n: 'Koreyoshi', tip: ['Sugawara no Koreyoshi', 'Family: Son of Sugawara no Kiyotomo', 'Note: Father of Sugawara no Michizane and Ruishi'] },
  '類子': { n: 'Ruishi', tip: ['Sugawara no Ruishi', 'Family: Daughter of Sugawara no Koreyoshi; elder or younger sister of Michizane', 'Note: A court lady of Emperor Kōkō. Some think she was the mother of Minamoto no Nobuko'] },
  '菅原道真': { n: 'Michizane', tip: ['Sugawara no Michizane', 'Lived: 845–903', 'Office: Minister of the Right', 'Rank: Junior Second Rank', 'Hyakunin Isshu: Poet of Poem 24, "Kono tabi wa..."', 'Note: In the Hyakunin Isshu he is called Kanke. In the Shōtai Incident (901) he was sent away to Dazaifu'] },
  '島田宣来子': { n: 'Shimada no Nobukiko', tip: ['Shimada no Nobukiko', 'Family: Daughter of Shimada no Tadaomi', "Note: Sugawara no Michizane's principal wife; mother of Takami and Enshi"] },
  '橘義子': { n: 'Tachibana no Yoshiko', tip: ['Tachibana no Yoshiko', 'Family: Daughter of Tachibana no Hiromi', 'Note: She and Emperor Uda had a son, Prince Tokiyo'] },
  '衍子': { n: 'Enshi', tip: ['Sugawara no Enshi', 'Family: Daughter of Sugawara no Michizane and Shimada no Nobukiko', 'Note: Became a consort of Emperor Uda in 896'] },
  '高視': { n: 'Takami', tip: ['Sugawara no Takami', 'Lived: 876–913', 'Family: Eldest son of Sugawara no Michizane', 'Note: In the Shōtai Incident he was punished along with his father and sent away as Assistant Governor of Tosa'] },
  '斉世親王': { n: 'Prince Tokiyo', tip: ['Prince Tokiyo', 'Lived: 886–927', 'Family: Son of Emperor Uda and Tachibana no Yoshiko', "Note: His wife was Michizane's daughter Yasuko. In the Shōtai Incident he was caught up with his father-in-law Michizane, became a monk, and took the name Shinjaku"] },
  '寧子': { n: 'Yasuko', tip: ['Sugawara no Yasuko', 'Family: Third daughter of Sugawara no Michizane', "Note: Prince Tokiyo's wife; mother of Minamoto no Hideakira"] },
  '孝標': { n: 'Takasue', tip: ['Sugawara no Takasue', "Family: Son of Sugawara no Suketada; Michizane's great-great-grandson", "Note: Father of Sugawara no Takasue's Daughter"] },
  '倫寧娘': { n: "Tomoyasu's daughter", tip: ['Daughter of Fujiwara no Tomoyasu', "Note: Sugawara no Takasue's wife and mother of Sugawara no Takasue's Daughter. Her elder half-sister was the Mother of the Right Captain Michitsuna"] },
  '源英明': { n: 'Minamoto no Hideakira', tip: ['Minamoto no Hideakira', 'Lived: Unknown–939', 'Office: Middle Captain of the Left Palace Guards', 'Rank: Junior Fourth Rank, Upper Grade', 'Family: Eldest son of Prince Tokiyo; his mother was Sugawara no Yasuko', 'Note: Because his father had become a monk, his childhood was unfortunate'] },
  '源順子': { n: 'Minamoto no Nobuko', tip: ['Minamoto no Nobuko', 'Family: Said to be a daughter of Emperor Uda. Her mother is thought to be Sugawara no Enshi, but another view says her mother was Sugawara no Ruishi, a court lady of Emperor Kōkō, and that she was later adopted by Emperor Uda', "Note: Fujiwara no Tadahira's wife; mother of Fujiwara no Saneyori"] },
  '孝標女': { n: "Takasue's Daughter", tip: ["Sugawara no Takasue's Daughter", 'Lived: 1008–Unknown', "Family: Child of Sugawara no Takasue and Fujiwara no Tomoyasu's daughter; niece of the Mother of the Right Captain Michitsuna", 'Note: Author of the Sarashina Diary'] },

  // ---------- Around the Minister of the Right of Sanjō (25.html) ----------
  '房前': { n: 'Fusasaki', tip: ['Fujiwara no Fusasaki', 'Lived: 681–737', 'Office: Councillor (Sangi)', 'Rank: Senior Third Rank; Senior First Rank after death'] },
  '兼輔': { n: 'Kanesuke', tip: ['Fujiwara no Kanesuke', 'Lived: 877–933', 'Office: Acting Middle Counselor', 'Rank: Junior Third Rank', 'Hyakunin Isshu: Poet of Poem 27, "Mika no hara..."', 'Note: In the Hyakunin Isshu he is called Middle Counselor Kanesuke'] },
  '定方女': { n: "Sadakata's daughter", tip: ['Daughter of Fujiwara no Sadakata', "Note: Fujiwara no Kanesuke's wife"] },
  '師輔': { n: 'Morosuke', tip: ['Fujiwara no Morosuke', 'Lived: 909–960', 'Office: Minister of the Right', 'Rank: Senior Second Rank', 'Note: Founder of the Kujō line', "Imperial in-law: Grandfather (on the mother's side) of Emperors Reizei and En'yū"] },
  '雅正': { n: 'Masatada', tip: ['Fujiwara no Masatada', 'Lived: Unknown–961', 'Office: Governor of Suō', 'Rank: Junior Fifth Rank, Lower Grade'] },
  '朝頼': { n: 'Asayori', tip: ['Fujiwara no Asayori', 'Lived: Unknown', 'Office: Director of the Kageyushi (office checking officials leaving their posts)', 'Rank: Junior Fourth Rank, Upper Grade'] },
  '朝成': { n: 'Asahira', tip: ['Fujiwara no Asahira', 'Lived: 917–974', 'Office: Middle Counselor', 'Rank: Junior Third Rank', 'Family: Sixth son of Fujiwara no Sadakata', 'Note: Called the Middle Counselor of Sanjō. Stories of his huge appetite appear in the Konjaku Monogatarishū and elsewhere'] },
  '朝忠': { n: 'Asatada', tip: ['Fujiwara no Asatada', 'Lived: 910–967', 'Office: Middle Counselor', 'Rank: Junior Third Rank', 'Hyakunin Isshu: Poet of Poem 44, "Au koto no..."', 'Note: In the Hyakunin Isshu he is called Middle Counselor Asatada'] },
  '兼家': { n: 'Kaneie', tip: ['Fujiwara no Kaneie', 'Lived: 929–990', 'Office: Regent, Kampaku (chief adviser), and Chancellor of the Realm', 'Rank: Junior First Rank', "Imperial in-law: Grandfather (on the mother's side) of Emperor Ichijō"] },
  '為時': { n: 'Tametoki', tip: ['Fujiwara no Tametoki', 'Lived: c. 949–c. 1029', 'Office: Governor of Echigo', 'Rank: Senior Fifth Rank, Lower Grade'] },
  '為輔': { n: 'Tamesuke', tip: ['Fujiwara no Tamesuke', 'Family: Eldest son of Fujiwara no Asayori; grandson of Fujiwara no Sadakata', 'Note: Father of Nobutaka'] },
  '穆子': { n: 'Atsuko', tip: ['Fujiwara no Atsuko', 'Family: Daughter of Fujiwara no Asatada', 'Note: Principal wife of the Minister of the Left Minamoto no Masanobu; mother of Minamoto no Tomoko'] },
  '道長': { n: 'Michinaga', tip: ['Fujiwara no Michinaga', 'Lived: 966–1028', 'Office: Regent and Minister of the Left', 'Rank: Junior First Rank', "Imperial in-law: Grandfather (on the mother's side) of Emperors Go-Ichijō, Go-Suzaku, and Go-Reizei"] },
  '惟規': { n: 'Nobunori', tip: ['Fujiwara no Nobunori', 'Lived: 974?–1011', 'Family: Eldest son of Fujiwara no Tametoki; younger brother of Murasaki Shikibu'] },
  '紫式部': { n: 'Murasaki Shikibu', tip: ['Murasaki Shikibu', 'Lived: c. 970–c. 1014', 'Served: Fujiwara no Akiko, empress of Emperor Ichijō', 'Hyakunin Isshu: Poet of Poem 57, "Meguriaite..."', 'Note: Her real name is unknown. Author of The Tale of Genji'] },
  '宣孝': { n: 'Nobutaka', tip: ['Fujiwara no Nobutaka', 'Lived: Unknown–1001', 'Family: Third son of Fujiwara no Tamesuke; great-grandson of Fujiwara no Sadakata', "Note: Murasaki Shikibu's husband and Daini no Sanmi's father. He also married other women, including a daughter of Fujiwara no Asahira"] },
  '朝成女': { n: "Asahira's daughter", tip: ['Daughter of Fujiwara no Asahira', "Note: Fujiwara no Nobutaka's wife"] },
  '源倫子': { n: 'Minamoto no Tomoko', tip: ['Minamoto no Tomoko', 'Lived: 964–1053', 'Family: Daughter of the Minister of the Left Minamoto no Masanobu and Fujiwara no Atsuko; great-granddaughter of Fujiwara no Sadakata', "Note: Fujiwara no Michinaga's principal wife; mother of Yorimichi, Norimichi, Akiko, Kenshi, Ishi, and Kishi. A second cousin of Murasaki Shikibu. Akazome Emon served her"] },
  '賢子': { n: 'Daini no Sanmi', tip: ['Fujiwara no Kataiko', 'Lived: c. 999–c. 1082', 'Served: Fujiwara no Akiko, empress of Emperor Ichijō', 'Hyakunin Isshu: Poet of Poem 58, "Arimayama..."', 'Note: In the Hyakunin Isshu she is called Daini no Sanmi. She was the nurse of Emperor Go-Reizei'] },
  '彰子': { n: 'Akiko', tip: ['Fujiwara no Akiko', 'Lived: 988–1074', 'Family: Eldest daughter of Fujiwara no Michinaga and Minamoto no Tomoko', 'Note: Empress (chūgū) of Emperor Ichijō and mother of Emperors Go-Ichijō and Go-Suzaku; later called Jōtōmon-in. Hyakunin Isshu poets Murasaki Shikibu, Izumi Shikibu, Ise no Taifu, Akazome Emon, and others served her'] },

  // ---------- Around Teishin-kō (26.html) ----------
  '穏子': { n: 'Onshi', tip: ['Fujiwara no Onshi', 'Lived: 885–954', 'Family: Empress of Emperor Daigo; mother of Emperors Suzaku and Murakami'] },
  '保忠': { n: 'Yasutada', tip: ['Fujiwara no Yasutada', 'Lived: 890–936', 'Office: Upper Counselor', 'Rank: Senior Third Rank', 'Family: Eldest son of Fujiwara no Tokihira', 'Note: Said to have lived in fear of the vengeful spirit of Sugawara no Michizane, whom his father Tokihira had sent away'] },
  '実頼': { n: 'Saneyori', tip: ['Fujiwara no Saneyori', 'Lived: 900–970', 'Office: Regent and Kampaku (chief adviser)', 'Rank: Junior First Rank; Senior First Rank after death', 'Note: Founder of the Ononomiya line'] },
  '保明親王': { n: 'Prince Yasuakira', tip: ['Prince Yasuakira', 'Lived: 903–923', 'Family: Son of Emperor Daigo and Fujiwara no Onshi', "Note: Became crown prince at 2 but died at 21 without taking the throne. People whispered that it was Sugawara no Michizane's curse"] },
  '康子内親王': { n: 'Princess Yasuko', tip: ['Princess Yasuko', 'Lived: 919–957', 'Family: Daughter of Emperor Daigo and Fujiwara no Onshi', "Note: Fujiwara no Morosuke's wife; mother of Fujiwara no Kinsue"] },
  '朱雀': { n: 'Suzaku', tip: ['Emperor Suzaku', '61st emperor', 'Lived: 923–952', 'Reign: 930–946', 'Family: Son of Emperor Daigo; elder brother of Emperor Murakami', 'Note: During his reign came the revolts of Taira no Masakado and Fujiwara no Sumitomo (the Jōhei–Tengyō Rebellions)'] },
  '村上': { n: 'Murakami', tip: ['Emperor Murakami', '62nd emperor', 'Lived: 926–967', 'Reign: 946–967', 'Note: Ordered the compiling of the Gosen Wakashū'] },
  '頼忠': { n: 'Yoritada', tip: ['Fujiwara no Yoritada', 'Lived: 924–989', 'Office: Kampaku (chief adviser) and Chancellor of the Realm', 'Rank: Junior First Rank; Senior First Rank after death'] },
  '公任': { n: 'Kintō', tip: ['Fujiwara no Kintō', 'Lived: 966–1041', 'Office: Acting Upper Counselor', 'Rank: Senior Second Rank', 'Hyakunin Isshu: Poet of Poem 55, "Taki no oto wa..."', 'Note: In the Hyakunin Isshu he is called Upper Counselor Kintō. Known for his "talent for three boats" (gifted in Chinese poetry, waka, and music)'] },

  // ---------- Around Middle Counselor Kanesuke (27.html) ----------
  '桑子': { n: 'Kuwako', tip: ['Fujiwara no Kuwako', 'Family: Daughter of Fujiwara no Kanesuke', 'Note: A kōi (lower-ranking consort) of Emperor Daigo'] },
  '為信女': { n: "Tamenobu's daughter", tip: ['Daughter of Fujiwara no Tamenobu', "Note: Principal wife of Fujiwara no Tametoki; mother of Tametoki's eldest daughter, Murasaki Shikibu, and Nobunori"] },

  // ---------- Around Minamoto no Muneyuki Ason (28.html) ----------
  '源経信': { n: 'Minamoto no Tsunenobu', tip: ['Minamoto no Tsunenobu', 'Family: Son of Minamoto no Michikata; his mother was a daughter of Minamoto no Kunimori', 'Hyakunin Isshu: Poet of Poem 71, "Yū sareba..."', "Note: In the Hyakunin Isshu he is called Upper Counselor Tsunenobu. His son Minamoto no Toshiyori and grandson Shun'e were also chosen, so three generations have poems in the Hyakunin Isshu"] },
  '源俊頼': { n: 'Minamoto no Toshiyori', tip: ['Minamoto no Toshiyori', 'Lived: 1055–1129', 'Rank: Junior Fourth Rank, Upper Grade', 'Hyakunin Isshu: Poet of Poem 74, "Ukarikeru..."', 'Note: In the Hyakunin Isshu he is called Minamoto no Toshiyori Ason. Compiler of the Kin\'yō Wakashū'] },
  '俊恵': { n: "Shun'e", tip: ["Shun'e", 'Lived: 1113–c. 1191', 'Family: Son of Minamoto no Toshiyori', 'Hyakunin Isshu: Poet of Poem 85, "Yomosugara..."', "Note: In the Hyakunin Isshu he is called Priest Shun'e. Poets gathered at his temple lodging, the Karin'en"] },

  // ---------- Around Ōshikōchi no Mitsune (29.html) ----------
  '壬生忠岑': { n: 'Mibu no Tadamine', tip: ['Mibu no Tadamine', 'Lived: c. 860–c. 920', 'Office: Junior officer of the Right Gate Guards; he is also said to have served as Acting Senior Clerk of Settsu, among other posts', 'Family: Father of Mibu no Tadami', 'Hyakunin Isshu: Poet of Poem 30, "Ariake no..."', 'Note: One of the compilers of the Kokin Wakashū, and the lowest in rank among them. The Tales of Yamato says he was a bodyguard of Fujiwara no Sadakuni'] },
  '凡河内躬恒': { n: 'Ōshikōchi no Mitsune', tip: ['Ōshikōchi no Mitsune', 'Lived: c. 859–c. 925', 'Office: Held a series of provincial posts, such as Acting Junior Clerk of Kai, Acting Senior Clerk of Tanba, Acting Secretary of Izumi, and Acting Secretary of Awaji', 'Family: Son of Ōshikōchi no 諶利 (his family line is also said to be unknown)', 'Hyakunin Isshu: Poet of Poem 29, "Kokoroate ni..."', 'Note: One of the compilers of the Kokin Wakashū. He was a close friend of Ki no Tsurayuki and visited the house of Fujiwara no Kanesuke, who supported him'] },
  '凡河内諶利': { n: "Mitsune's father", tip: ['Ōshikōchi no 諶利 (reading of the name unknown)', 'Office: Acting Secretary of Awaji', 'Note: Father of Ōshikōchi no Mitsune'] },
  '凡河内恒寿': { n: "Mitsune's son", tip: ['Ōshikōchi no 恒寿 (reading of the name unknown)', 'Family: Son of Ōshikōchi no Mitsune'] },
  '凡河内勢恒': { n: "Mitsune's son", tip: ['Ōshikōchi no 勢恒 (reading of the name unknown)', 'Family: Son of Ōshikōchi no Mitsune'] },

  // ---------- Around Mibu no Tadamine (30.html) ----------
  '赤染衛門の母': { n: "Akazome Emon's mother", tip: ['Mother of Akazome Emon', 'Note: At first the wife of Taira no Kanemori, she later remarried, to Akazome Tokimochi'] },
  '赤染時用': { n: 'Akazome Tokimochi', tip: ['Akazome Tokimochi', 'Office: Governor of Ōsumi', "Note: Said to be Akazome Emon's father. He served as an officer of the Right Gate Guards (sakan, then jō), which gave his daughter her name"] },
  '壬生忠見': { n: 'Mibu no Tadami', tip: ['Mibu no Tadami', 'Lived: Unknown', 'Office: Cook in the Mizushidokoro (the palace kitchen); Senior Clerk of Settsu', 'Family: Son of Mibu no Tadamine', 'Hyakunin Isshu: Poet of Poem 41, "Koi su chō..."', 'Note: Competed against Taira no Kanemori at the Poetry Contest of the Imperial Palace in 960 and lost'] },

  // ---------- The Fujiwara clan ----------
  '不比等': { n: 'Fujiwara no Fuhito', tip: ['Fujiwara no Fuhito', 'Lived: 659–720', 'Office: Minister of the Right', 'Rank: Senior Second Rank; Senior First Rank after death', 'Family: Grandfather (on the mother\'s side) of Emperor Shōmu and Empress Kōken'] },
  '宇合': { n: 'Fujiwara no Umakai', tip: ['Fujiwara no Umakai', 'Lived: 694–737', 'Office: Councillor (Sangi)', 'Rank: Senior Third Rank', 'Note: Founder of the Shikike branch of the Fujiwara'] },
  '清成': { n: 'Fujiwara no Kiyonari', tip: ['Fujiwara no Kiyonari', 'Lived: c. 716–c. 777', 'Office: None'] },
  '種継': { n: 'Fujiwara no Tanetsugu', tip: ['Fujiwara no Tanetsugu', 'Lived: 737–785', 'Office: Middle Counselor', 'Rank: Senior Third Rank; Senior First Rank after death', 'Note: Murdered while overseeing the building of Nagaoka-kyō'] },

  // ---------- Princes ----------
  '志貴皇子': { n: 'Prince Shiki', tip: ['Prince Shiki', 'Lived: Unknown–716', 'Rank: Second Rank for princes', 'Family: Son of Emperor Tenji and father of Emperor Kōnin', "Note: A poet of the Man'yōshū"] },
  '高市皇子': { n: 'Prince Takechi', tip: ['Prince Takechi', 'Lived: 654–696', 'Rank: Jōkōichi (a court rank of the time)', 'Family: Eldest son of Emperor Tenmu', 'Note: Played a major role in the Jinshin War and became Grand Minister (Daijō-daijin). His son was Prince Nagaya'] },
  '舎人親王': { n: 'Prince Toneri', tip: ['Prince Toneri', 'Lived: 676–735', 'Rank: First Rank for princes', 'Family: Son of Emperor Tenmu', 'Note: Led the compiling of the Nihon Shoki. Ancestor of the Kiyohara clan'] },
  '長皇子': { n: 'Prince Naga', tip: ['Prince Naga', 'Lived: Unknown–715', 'Rank: First Rank for princes', 'Family: Son of Emperor Tenmu'] },
  '大津皇子': { n: 'Prince Ōtsu', tip: ['Prince Ōtsu', 'Lived: 663–686', 'Rank: Jōdaini (a court rank of the time)', "Family: Son of Emperor Tenmu. His mother was Princess Ōta, a daughter of Emperor Tenji (Empress Jitō's elder sister)", "Note: Soon after Emperor Tenmu died, he was suspected of plotting a rebellion and took his own life. His Chinese poems remain in the Kaifūsō, and his waka in the Man'yōshū"] },
  '草壁皇子': { n: 'Prince Kusakabe', tip: ['Prince Kusakabe', 'Lived: 662–689', 'Rank: Jōkōichi (a court rank of the time)', 'Family: Son of Emperor Tenmu and Empress Jitō. His wife was Empress Genmei', 'Note: Became crown prince but died without taking the throne'] },

  // ---------- Poets and others ----------
  '儀同三司母': { n: 'Takashina no Takako', tip: ['Mother of the Honorary Grand Minister (Gidō Sanshi no Haha)', 'Lived: Unknown–996', 'Rank: Junior Third Rank', 'Real name: Takashina no Takako', 'Family: Daughter of Takashina no Naritada. Wife of Fujiwara no Michitaka, and mother of Fujiwara no Korechika and Empress Teishi', 'Hyakunin Isshu: Poet of Poem 54, "Wasureji no..."'] },
  '清原深養父': { n: 'Kiyohara no Fukayabu', tip: ['Kiyohara no Fukayabu', 'Hyakunin Isshu: Poet of Poem 36, "Natsu no yo wa..."', 'Family: Grandfather of Kiyohara no Motosuke and great-grandfather of Sei Shōnagon', 'Note: A master of the koto. Friends with Fujiwara no Kanesuke, Ki no Tsurayuki, Ōshikōchi no Mitsune, and others'] },
  '清原春光': { n: 'Kiyohara no Harumitsu', tip: ['Kiyohara no Harumitsu', 'Rank: Junior Fifth Rank, Lower Grade', 'Family: Son of Kiyohara no Fukayabu'] },
  '清原元輔': { n: 'Kiyohara no Motosuke', tip: ['Kiyohara no Motosuke', 'Lived: 908–990', 'Family: Grandson of Kiyohara no Fukayabu and father of Sei Shōnagon', 'Hyakunin Isshu: Poet of Poem 42, "Chigiriki na..."', 'Note: As one of the Five Men of the Pear Pavilion, helped compile the Gosen Wakashū'] },
  '清少納言': { n: 'Sei Shōnagon', tip: ['Sei Shōnagon', 'Lived: c. 966–c. 1025', 'Family: Daughter of Kiyohara no Motosuke and great-granddaughter of Kiyohara no Fukayabu', 'Hyakunin Isshu: Poet of Poem 62, "Yo wo komete..."', 'Note: Married Tachibana no Norimitsu and had a son, Norinaga. From about 993 she served Empress Teishi and wrote The Pillow Book. She later married Fujiwara no Muneyo and had a daughter, Koma no Myōbu'] },
  '文屋康秀': { n: "Fun'ya no Yasuhide", tip: ["Fun'ya no Yasuhide", 'Lived: Unknown–c. 885', 'Rank: Senior Sixth Rank, Upper Grade', 'Hyakunin Isshu: Poet of Poem 22, "Fuku kara ni..."', 'Note: One of the Six Immortal Poets. His ancestors are not known, and his link to Prince Naga and Fun\'ya no Ōchi is unclear'] },
  '文屋朝康': { n: "Fun'ya no Asayasu", tip: ["Fun'ya no Asayasu", 'Lived: Unknown', 'Rank: Junior Sixth Rank, Lower Grade', "Family: Son of Fun'ya no Yasuhide", 'Hyakunin Isshu: Poet of Poem 37, "Shiratsuyu ni..."'] },
  '良岑安世': { n: 'Yoshimine no Yasuyo', tip: ['Yoshimine no Yasuyo', 'Lived: 785–830', 'Office: Upper Counselor', 'Rank: Senior Third Rank; given Junior Second Rank after death', 'Family: Son of Emperor Kanmu', 'Note: Given the family name Yoshimine and left the imperial family'] },
  '在原行平': { n: 'Ariwara no Yukihira', tip: ['Ariwara no Yukihira', 'Lived: 818–893', 'Office: Middle Counselor', 'Rank: Senior Third Rank', 'Hyakunin Isshu: Poet of Poem 16, "Tachiwakare..."', 'Note: In the Hyakunin Isshu he is called Middle Counselor Yukihira'] },
  '在原業平': { n: 'Ariwara no Narihira', tip: ['Ariwara no Narihira', 'Lived: 825–880', 'Rank: Junior Fourth Rank, Upper Grade', 'Hyakunin Isshu: Poet of Poem 17, "Chihayaburu..."'] },
  '素性': { n: 'Sosei', tip: ['Sosei', 'Lived: Unknown', 'Family: Son of Henjō', 'Hyakunin Isshu: Poet of Poem 21, "Ima komu to..."', 'Note: In the Hyakunin Isshu he is called Priest Sosei'] },
  '遍昭': { n: 'Henjō', tip: ['Henjō', 'Lived: 816–890', 'Rank: Junior Fifth Rank, Upper Grade (before becoming a monk)', 'Family: Grandson of Emperor Kanmu. His name before becoming a monk was Yoshimine no Munesada', 'Hyakunin Isshu: Poet of Poem 12, "Amatsukaze..."', 'Note: In the Hyakunin Isshu he is called High Priest Henjō (Sōjō Henjō).', 'He served Emperor Ninmyō as a Chamberlain and became a monk after the emperor died. One of the Six Immortal Poets'] },
};
