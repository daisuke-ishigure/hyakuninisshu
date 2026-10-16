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

// Poet introductions shown in each card's card-outline (English version of INTRO_BY_NUMBER in js/zukan.js;
// replaces the short one-line outline on the card. The outline is still used for search.)
const INTRO_BY_NUMBER_EN = {
    1: "As Prince Naka no Ōe, he overthrew the Soga clan with Nakatomi no Kamatari (the Isshi Incident) and carried out the Taika Reforms. After the defeat at the Battle of Baekgang, he moved the capital to Ōmi Ōtsu-no-miya and took the throne in 668. With the Kōgo family register and the Ōmi Code, he laid the foundations of the ritsuryō state.",
    2: "Daughter of Emperor Tenji; her personal name was Uno no Sarara. At 13 she married Prince Ōama (Emperor Tenmu) and won the Jinshin War alongside him. After her husband's death, and the early death of her son Prince Kusakabe, she took the throne in 690. She put the Asuka Kiyomihara Code into effect and moved the capital to Fujiwara-kyō.",
    3: "He served at court, composing hymns in praise of emperors and elegies for princes. A master of lyric poetry, he was called a \"Saint of Poetry\" together with Yamabe no Akahito and revered as a god of waka. Much of his life, including his dates, is unclear; he is said to have died in Iwami Province around 708, but whether he collapsed on the road or was executed is uncertain.",
    4: "A Man'yōshū poet of the Nara period who served Emperor Shōmu. Though a low-ranking official, he had a gift for depicting nature and left many poems of the landscapes he saw while accompanying imperial journeys. Ranked with Kakinomoto no Hitomaro as a \"Saint of Poetry,\" he is one of the Thirty-Six Immortal Poets. His datable poems span the years 724–736.",
    5: "No dates or details of his life were recorded, and nothing concrete is known of his background or achievements, so he is called a legendary poet. He is thought to have lived in the late Nara or early Heian period; his name appears in the Chinese preface to the Kokin Wakashū, and he is counted among the Thirty-Six Immortal Poets.",
    6: "Son of Ōtomo no Tabito and a Nara-period poet believed to have compiled the Man'yōshū. He became Middle Counselor in 783, but after his death in 785 he was implicated in the assassination of Fujiwara no Tanetsugu and stripped of his status, and his remains were banished to Oki. He was pardoned in 806 and his rank was restored.",
    7: "Eldest son of Abe no Funamori, he crossed to Tang China with an envoy mission in his late teens. He passed the imperial examinations, served Emperor Xuanzong, and befriended the poets Wang Wei and Li Bai. Valued for his talent, he was not allowed to go home, and the ship he finally boarded in 753 was wrecked and drifted to Vietnam. He died in China in 770.",
    8: "One of the Six Immortal Poets, yet almost nothing is recorded of his life or origins, and he may have been handed down more as a literary symbol than as a real person. Only two poems attributed to him survive, and only one, in the Kokin Wakashū, is reliably his.",
    9: "An early Heian poet said to be the daughter of Ono no Yoshizane, a district official in Dewa, though her birth and life are shrouded in mystery. She is thought to have served in the inner palaces of Emperors Ninmyō and Montoku, showing her talent for waka at court. One of the Six Immortal Poets and the Thirty-Six Immortal Poets, she inspired many legends as a woman of peerless beauty.",
    10: "Said to be the fourth son of Emperor Daigo, he is reported to have been abandoned on Mount Ōsaka because he was blind. He then made his living as a biwa-playing minstrel, and one theory holds that his name comes from his singing voice, which recalled the cry of cicadas (semi). Legend says he died at the foot of Mount Ōsaka.",
    11: "His real name was Ono no Takamura, and he was the grandfather of Ono no Komachi. Appointed deputy envoy to Tang China in 834, he refused to board when ordered to exchange his ship for a leaking one, and he was exiled to Oki for criticizing the missions in his Chinese poem \"Saidōyō.\" Pardoned in 840, he returned to the capital and became Councillor in 847.",
    12: "His lay name was Yoshimine no Munesada. A grandson of Emperor Kanmu born in 816, he served Emperor Ninmyō as Head Chamberlain. Feeling the impermanence of the world when the emperor died in 850, he took the tonsure; he became High Priest in 885 and died in 890. One of the Six Immortal Poets and the Thirty-Six Immortal Poets.",
    13: "Son of Emperor Seiwa, he took the throne at nine but is said to have abdicated at 17 because of mental illness (some say it was engineered by Fujiwara no Mototsune). He then held the status of retired emperor for more than 60 years, the longest in history, and died in 949.",
    14: "His real name was Minamoto no Tōru. A son of Emperor Saga, he was made a commoner because his mother was of low rank. He became Minister of the Left in 872 and hoped to take the throne himself when Yōzei abdicated, but was blocked by Fujiwara no Mototsune. He built the lavish Kawara-no-in mansion on Rokujō in the capital and is said to be a model for Hikaru Genji.",
    15: "Son of Emperor Ninmyō; after Yōzei abdicated, he took the throne in 884 at the age of 55 on the recommendation of Fujiwara no Mototsune. He reigned for only three years, with real power largely in Mototsune's hands. The Nihon Sandai Jitsuroku describes him as modest, gentle and compassionate, a character that shows in his poetry.",
    16: "Ariwara no Yukihira. Second son of Prince Abo, a son of Emperor Heizei, and elder half-brother of Ariwara no Narihira. After serving as Governor of Harima and Head Chamberlain, he became Middle Counselor in 882. In 881 he founded the Shōgakuin, a school for the Ariwara clan, and was devoted to education. He died in 893.",
    17: "Ariwara no Narihira. A son of Prince Abo, himself a son of Emperor Heizei, he was made a commoner. Free-spirited and gifted at waka, he is regarded as the hero of The Tales of Ise. He served as Provisional Middle Captain of the Right Inner Palace Guards and Head Chamberlain, and died in 880. One of the Six Immortal Poets and the Thirty-Six Immortal Poets.",
    18: "Fujiwara no Toshiyuki. A fine calligrapher, he copied many Lotus Sutras at others' request; the Uji Shūi Monogatari tells how he fell into hell for copying them while ritually impure. In 897 he was made Senior Fourth Rank, Upper Grade and Captain of the Right Military Guards, and he died in 901. One of the Thirty-Six Immortal Poets.",
    19: "A leading poet of the Kokin Wakashū era and daughter of Fujiwara no Tsugukage. She served Empress Onshi, consort of Emperor Uda, and bore the emperor a prince, earning the name \"Ise no Miyasudokoro.\" With Prince Atsuyoshi she had a daughter, Nakatsukasa, who also became a poet. She died around 938.",
    20: "Eldest son of Retired Emperor Yōzei, born in 890 after his father's abdication. The greatest lover of his day, he took a different woman almost every night and was nicknamed \"the lord who makes the rounds each night.\" Ki no Tsurayuki composed folding-screen poems for his 40th-birthday celebration. He died in 943; 20 of his poems appear in imperial anthologies.",
    21: "Great-grandson of Emperor Kanmu and son of High Priest Henjō. After rising to Lieutenant of the Left Inner Palace Guards, he took the tonsure young, lived at Urin-in, and later moved to Ryōin-in at Isonokami in Yamato. Even as a monk he was active at court poetry gatherings, and he became Provisional Master of Discipline in 896. His dates are unknown. One of the Thirty-Six Immortal Poets.",
    22: "Father of Fun'ya no Asayasu and a leading Heian poet, one of the Six Immortal Poets. When he was posted to Mikawa as a provincial official, he is said to have invited fellow Immortal Ono no Komachi to come along, and the two are known for their literary exchanges. He became Middle Judge of the Ministry of Justice in 860 and died around 885.",
    23: "Son of Councillor Ōe no Otondo, he was born into a family of scholars, was well versed in the Chinese classics and excelled at waka. In 897 he presented Emperor Uda with the Kudai Waka, waka on lines of Chinese poetry, making him a symbol of the shift from Chinese verse to waka. His rank stopped at Senior Secretary of the Ministry of War, a minor post.",
    24: "Sugawara no Michizane. Talented at waka and Chinese poetry from childhood, he rose with exceptional speed for a scholar and became Minister of the Right in 899. Slandered by Fujiwara no Tokihira, he was demoted to Dazaifu in 901 and died there in 903. In 993 he was posthumously granted Senior First Rank and the title of Chancellor of the Realm.",
    25: "His real name was Fujiwara no Sadakata. Son of Fujiwara no Takafuji and father of Middle Counselor Asatada, he was called the Minister of the Right of Sanjō because his residence was in Sanjō and he became Minister of the Right. A maternal relative of the emperor, he was promoted to that post in 924. He recognized and supported Ki no Tsurayuki and Ōshikōchi no Mitsune. He died in 932.",
    26: "His real name was Fujiwara no Tadahira. Youngest son of Fujiwara no Mototsune and grandfather of Kentoku-kō. A gentle man, he stayed on friendly terms with Sugawara no Michizane even after his brother Tokihira had Michizane exiled. He became Regent in 930 and Kampaku in 941, helping to build the glory of the Fujiwara clan. He died in 949 and was given the posthumous name Teishin-kō.",
    27: "His real name was Fujiwara no Kanesuke. Great-grandfather of Murasaki Shikibu, he recognized and supported Ki no Tsurayuki and Ōshikōchi no Mitsune. Because his mansion stood near the Kamo River embankment, he was called the \"Embankment Middle Counselor,\" and he became Middle Counselor in 930. He was born in 877 and died in 933. One of the Thirty-Six Immortal Poets.",
    28: "Minamoto no Muneyuki. Though of noble birth as a grandson of Emperor Kōkō, he became a commoner in 894 when granted the surname Minamoto no Ason. He presented waka to Emperor Uda and was recognized for his talent, but had little luck in rank: he was made Senior Fourth Rank, Lower Grade in 939 and died in 940. One of the Thirty-Six Immortal Poets.",
    29: "Though his rank was not high, he showed an outstanding gift for poems describing scenery and was one of the finest poets of his day, ranked alongside Ki no Tsurayuki. In 905 he became a compiler of the Kokin Wakashū with Tsurayuki and others, and in 916 he accompanied Cloistered Emperor Uda on his visit to Ishiyama-dera and composed poems. One of the Thirty-Six Immortal Poets.",
    30: "Father of Mibu no Tadami. A low-ranking military officer in charge of guard duty, he was blessed with poetic talent and often took part in court poetry gatherings. A master of waka, he was chosen in 905 as a compiler of the Kokin Wakashū together with Ki no Tsurayuki and others, and he died around 920. One of the Thirty-Six Immortal Poets.",
    31: "A descendant of the shogun Sakanoue no Tamuramaro. Having served in Nara as a provincial official of Yamato, he was probably familiar with Yoshino. He was also a master of kemari (court football): in 905 he kicked the ball 206 times in a row at the palace and was rewarded with silk. He died in 930. One of the Thirty-Six Immortal Poets.",
    32: "A descendant of the Mononobe, a powerful clan of ancient times. He became a student of letters in 910 and was appointed Governor of Iki, but fell ill on the way to his post and died in 920. He left no personal collection and is little known as a poet, yet Fujiwara no Sadaie seems to have liked this poem so much that he used it as the basis of a poem of his own (honkadori).",
    33: "Cousin of Ki no Tsurayuki, known for the Tosa Diary and the kana preface to the Kokin Wakashū. He became one of the anthology's compilers in 905 but died in 907, before it was completed. His poetic talent was highly regarded; many of his poems were included in imperial anthologies, and he was chosen as one of the Thirty-Six Immortal Poets.",
    34: "Though not of high status, he was highly regarded as a poet and left a personal collection, the Okikaze-shū. A master of the koto, he is said to have excelled at music as well. He has 38 poems in imperial anthologies from the Kokin Wakashū on and is one of the Thirty-Six Immortal Poets. He became a provincial official of Sagami in 900 and of Shimōsa in 914.",
    35: "He wrote the kana preface to the Kokin Wakashū and compiled the anthology at the command of Emperor Daigo in 905. Appointed Governor of Tosa in 930, he wrote the Tosa Diary about his journey back to the capital around 935, in kana and from a woman's point of view, greatly influencing later women writers. He died around 945.",
    36: "A descendant of Emperor Tenmu and great-grandfather of Sei Shōnagon. Never fortunate in rank, he was made Junior Fifth Rank, Lower Grade in 930. He associated with Fujiwara no Kanesuke, Ki no Tsurayuki and Ōshikōchi no Mitsune, and was a master of the koto. In his later years he is said to have founded Fudaraku-ji in Iwakura and lived there in seclusion.",
    37: "Son of Fun'ya no Yasuhide. Never fortunate in rank, he was nevertheless known as a poet. He became a provincial official of Suruga in 892 and Senior Secretary of the Bureau of Palace Attendants in 902. He composed for the Kanpyō Empress's Poetry Contest and Prince Koresada's Poetry Contest, and three of his poems appear in imperial anthologies.",
    38: "A lady-in-waiting to Empress Onshi, consort of Emperor Daigo. Her name comes from her father's post as Lesser Captain of the Right Inner Palace Guards. The Yamato Monogatari shows her falling in love with various men, revealing her as a woman of many romances. She composed for the Tentoku Palace Poetry Contest of 960 and other events.",
    39: "His real name was Minamoto no Hitoshi. A great-grandson of Emperor Saga, he became a commoner with the surname Minamoto. After a series of provincial posts, including Governor of Mikawa and of Tanba, he became Councillor in 947 and joined the ranks of the senior nobles. He was made Senior Fourth Rank, Lower Grade in 951 and died some time later. Only four of his poems appear, in the Gosen Wakashū.",
    40: "A great-great-grandson of Emperor Kōkō, he became a commoner in 950 when granted the surname Taira no Ason; his line was separate from Kiyomori's Ise Taira. He competed against Mibu no Tadami at the Tentoku Palace Poetry Contest of 960 and became Governor of Suruga in 979. One theory holds that he was the father of Akazome Emon. He died in 991. One of the Thirty-Six Immortal Poets.",
    41: "Son of Mibu no Tadamine. A low-ranking official under Emperor Murakami, he inherited his father's gift for poetry and excelled from childhood, being summoned to the palace to work in the imperial kitchen office. He became a provincial official of Settsu in 958 and competed against Taira no Kanemori at the Tentoku Palace Poetry Contest of 960. He has 36 poems in imperial anthologies. One of the Thirty-Six Immortal Poets.",
    42: "Grandson of Kiyohara no Fukayabu and father of Sei Shōnagon. In 951 he worked on compiling the Gosen Wakashū as one of the Five Men of the Pear Chamber. He became Governor of Higo in 986 and died there in 990. Sei Shōnagon is said to have avoided composing waka so as not to tarnish her father's name.",
    43: "His real name was Fujiwara no Atsutada. Third son of Minister of the Left Fujiwara no Tokihira, he was gifted at waka and the biwa. He became Acting Middle Counselor in 942 but died of illness in 943 at the age of 38. Because his father had brought about Sugawara no Michizane's downfall, rumor spread that his death was the curse of Michizane's vengeful spirit. One of the Thirty-Six Immortal Poets.",
    44: "His real name was Fujiwara no Asatada. Fifth son of Sadakata, the Minister of the Right of Sanjō, he was known for his waka and as a master of the shō (mouth organ). He became Councillor in 952 and Middle Counselor in 963, rising to Junior Third Rank. His granddaughter was Rinshi, wife of Michinaga. He died in 967. One of the Thirty-Six Immortal Poets.",
    45: "The posthumous name of Fujiwara no Koretada. Grandson of Teishin-kō and son of Minister of the Right Morosuke, he ignored his father's dying instructions and lived in luxury. In 951 he became Director of the Bureau of Poetry and led the Five Men of the Pear Chamber; he became Regent in 970 and Chancellor of the Realm in 971, and died the following year at 49. Father of Fujiwara no Yoshitaka.",
    46: "A pioneer who brought old words from the Man'yōshū into his verse and originated the hundred-poem sequence. His novel style was not understood by the aristocracy, and he was regarded as an eccentric. In 985 he turned up uninvited at Retired Emperor En'yū's Day of the Rat outing in the New Year and was thrown out. He was later highly regarded and has more poems than anyone else in the Shika Wakashū.",
    47: "A monk said to have been a lecturer at the provincial temple of Harima. A friend of the priest Anpō, who lived at the Kawara-no-in, he often visited the mansion. He became active in poetry contests and other events from around 962, and in 986 he accompanied Retired Emperor Kazan on his pilgrimage to Kumano.",
    48: "A great-grandson of Emperor Seiwa. While moving from one provincial post to another, he composed waka and presented Emperor Reizei with a hundred-poem sequence, the Shigeyuki Hyakushu. He was also a friend of Sone no Yoshitada. Around 995 he went down to Mutsu Province with Fujiwara no Sanekata, who had been appointed Governor of Mutsu, and died there in 1000.",
    49: "Ōnakatomi no Yoshinobu. From the Nakatomi clan, which shared its ancestry with Nakatomi no Kamatari, he served as chief priest of Ise Shrine. He was one of the Five Men of the Pear Chamber who worked on the Gosen Wakashū at the command of Emperor Murakami. Grandfather of Ise no Taifu, he died in 991. One of the Thirty-Six Immortal Poets.",
    50: "Son of Kentoku-kō (Fujiwara no Koretada), he was blessed with good looks and talent. Deeply devoted to Buddhism, he is said never to have eaten meat or fish. Though he composed a poem wishing for a long life, he died of smallpox in 974 at the age of 21. His eldest son was Fujiwara no Yukinari, one of the Sanseki, the three great calligraphers.",
    51: "Fujiwara no Sanekata. A great-grandson of Teishin-kō, he was born into a distinguished family and great things were expected of him. According to the Kojidan, he quarreled with Fujiwara no Yukinari at court and threw away Yukinari's eboshi cap, angering Emperor Ichijō, who sent him off to Mutsu with the words \"Go and see the utamakura.\" He died in Mutsu Province in 999.",
    52: "Fujiwara no Michinobu. Son of Fujiwara no Tamemitsu, he was raised as the adopted son of his uncle, Regent Fujiwara no Kaneie. The Ōkagami records him as a skilled poet, and he is said to have been modest and kind-hearted. He became Middle Captain of the Left Inner Palace Guards in 991 but died young of smallpox in 994, at 23.",
    53: "Daughter of Fujiwara no Tomoyasu, she became a secondary wife of Fujiwara no Kaneie, later Kampaku, and bore Michitsuna in 955. Her Kagerō Diary, completed around 974, reveals both her anguish over her husband's infidelity and the proud spirit with which she lived through adversity. She is counted among the Three Beauties of Japan. Died 995.",
    54: "Her real name was Takashina no Takako. A noble lady of outstanding talent in Chinese poetry, she bore Fujiwara no Michitaka a son, Korechika, and a daughter, Teishi, who became empress to Emperor Ichijō. Her husband died in 995, and in 996, as Korechika and Takaie were demoted in the Chōtoku Incident, she died the same year.",
    55: "His real name was Fujiwara no Kintō. A learned man of culture who excelled at Chinese poetry, waka and music, he was praised for his \"talent for all three boats.\" When his elder sister Junshi became empress to Emperor En'yū, he made a careless jibe at the consort Senshi and earned her resentment, showing a rash side. Late in life, dissatisfied with his rank, he withdrew from politics into seclusion.",
    56: "After having a daughter, Koshikibu no Naishi, with Tachibana no Michisada, she had affairs with Prince Tametaka and Prince Atsumichi. Her romance with Atsumichi is told in the Izumi Shikibu Diary. Around 1009 she entered the service of Empress Shōshi and later remarried, to Fujiwara no Yasumasa. Murasaki Shikibu praised her literary talent and her allure.",
    57: "Daughter of Fujiwara no Tametoki. Clever from childhood, she is said to have learned Chinese poetry faster than her younger brother. She married Fujiwara no Nobutaka around 998 and bore a daughter, Kenshi (Daini no Sanmi). After her husband's death she began writing The Tale of Genji and, chosen by Michinaga, entered the service of Empress Shōshi around 1005.",
    58: "Her real name was Kenshi. Daughter of Murasaki Shikibu, she followed her mother into the service of Empress Shōshi. She became wet nurse to Emperor Go-Reizei and was made Junior Third Rank in 1054. Her name combines the post of her second husband, Takashina no Nariakira, as Senior Assistant Governor-General (daini) of Dazaifu, with her own rank of Junior Third Rank (sanmi). She died around 1082.",
    59: "Her name comes from her father's post in the Right Gate Guards. Around 976 she married Ōe no Masahira, and in 1001 she went with him to Owari Province. She served Rinshi, principal wife of Fujiwara no Michinaga, and Rinshi's daughter Empress Shōshi, and associated with Murasaki Shikibu and Izumi Shikibu. She is also known as the author of the main part of the Eiga Monogatari.",
    60: "Called by a court name taken from her mother Izumi Shikibu's, she served Empress Shōshi alongside her mother from around 1009. In 1016 she bore Fujiwara no Norimichi a son (Jōen), and in 1025 she died after childbirth while still in her twenties. The Izumi Shikibu Collection contains elegies mourning the daughter who died so young.",
    61: "Granddaughter of Ōnakatomi no Yoshinobu; her name comes from her father's post as Senior Assistant Head of the Department of Divinities (taifu). From around 1008 she served Empress Shōshi and associated with Izumi Shikibu and Murasaki Shikibu. She composed for many poetry contests and in later life helped raise Emperor Shirakawa. She is known to have been alive until around 1060.",
    62: "Great-granddaughter of Kiyohara no Fukayabu and daughter of Kiyohara no Motosuke. She married Tachibana no Norimitsu around 981 and entered the service of Empress Teishi in 993. When Teishi died in 1000, she left court service. The author of The Pillow Book, Japan's oldest collection of essays, she died around 1025.",
    63: "His real name was Fujiwara no Michimasa. Eldest son of Fujiwara no Korechika, his family fell from power in the Chōtoku Incident. He became Junior Third Rank in 1016 but had no political influence, and in his despair his conduct worsened until he was called the \"Wild Third Rank\" and the \"Wicked Third Rank.\" He took the tonsure and died in 1054.",
    64: "His real name was Fujiwara no Sadayori. Son of Fujiwara no Kintō, he inherited his father's skill at waka and music and was also a fine calligrapher. He became Acting Middle Counselor in 1029, took the tonsure because of illness in 1044, and died the following year. An anecdote tells how Koshikibu no Naishi bested him with a poem, suggesting he had a careless side.",
    65: "Her name comes from her marriage to Ōe no Kinsuke, Governor of Sagami, though they parted around 1025. Serving Princess Shūshi, she had many free-spirited love affairs and was highly regarded as a poet, with 40 poems in the Goshūi Wakashū. She was the adopted daughter of Minamoto no Yorimitsu.",
    66: "A great-grandson of Retired Emperor Sanjō. He lost his father at ten and at 12 took the tonsure at Onjō-ji, becoming a Tendai monk. After ascetic training as a mountain ascetic (yamabushi), he became chief abbot of Onjō-ji in 1116 and head of the Tendai sect in 1123, though he soon resigned. He became Senior High Priest at 71 and died in 1135.",
    67: "Her real name was Taira no Nakako, and her court name comes from her father's post as Governor of Suō. A court poet who served four emperors—Go-Reizei, Go-Sanjō, Shirakawa and Horikawa—she has 35 poems in imperial anthologies from the Goshūi Wakashū on. She took the tonsure because of illness around 1108 and died around 1111.",
    68: "Second son of Emperor Reizei, he took the throne in 1011 at the age of 36, but his reign lasted only five years. During it the palace burned down twice, and he suffered from an eye disease. He abdicated in favor of Emperor Go-Ichijō in 1016, took the tonsure in 1017, and died.",
    69: "His real name was Tachibana no Nagayasu. A student of letters, he took the tonsure in 1013 and called himself Nōin. Deeply interested in utamakura, he was an aesthete who traveled throughout Japan composing poems. Legends tell how he tanned his face to pretend he had written a poem on the road, and how his poem brought rain. He died in 1050 or 1058.",
    70: "A monk of Enryaku-ji on Mount Hiei, he served as administrator of the Gion Shrine and is said to have then lived quietly in the village of Ōhara. Some say he spent his last years at Urin-in. He composed for the 1038 poetry contest held at the house of Acting Upper Counselor Morofusa and other events, and one theory holds that he died in the Kōhei era (1058–1065).",
    71: "His real name was Minamoto no Tsunenobu. A great-grandson of Prince Atsumi, he was a man of many talents in Chinese poetry, waka and music. He showed his versatility at a boating party on the Ōi River and, like Kintō, was praised for his \"talent for all three boats.\" He became Upper Counselor in 1091, went to Dazaifu as Provisional Governor-General in 1094, and died there in 1097.",
    72: "A lady-in-waiting to Princess Yūshi, third daughter of Emperor Go-Suzaku, she was active as a poet for many years. Some sources say she was the younger sister or the wife of Fujiwara no Shigetsune, Governor of Kii, whose post is thought to be the source of her name. She composed for the Horikawa-in Love Letter Contest in 1102 and joined the Horikawa Hundred-Poem Sequences around 1105.",
    73: "His real name was Ōe no Masafusa. A great-grandson of Akazome Emon, he was born into a family of scholars and became an advanced student of letters at 16. Well versed in court precedent and protocol, he tutored three emperors: Go-Sanjō, Shirakawa and Horikawa. He became Acting Middle Counselor in 1094 and died in 1111.",
    74: "Son of Minamoto no Tsunenobu. Known for his innovative style, he and the traditionalist Fujiwara no Mototoshi were the two great figures of the poetry world in the age of cloistered rule. Though of low rank, he compiled the Kin'yō Wakashū at the command of Retired Emperor Shirakawa. He served as poet and judge at many gatherings and led the poetry world until his death in 1129.",
    75: "A great-grandson of Fujiwara no Michinaga, he ended his career in the minor rank of Junior Fifth Rank, Upper Grade. Valuing traditional style, he clashed with the innovative Minamoto no Toshiyori, and the two were regarded as the twin pillars of poetry in the age of cloistered rule. Late in life he took Fujiwara no Toshinari as a pupil; he took the tonsure in 1138 and died in 1142.",
    76: "His real name was Fujiwara no Tadamichi. Eldest son of Fujiwara no Tadazane, he became Kampaku in 1121. His feud with his half-brother Yorinaga led to the Hōgen Rebellion, in which he sided with Emperor Go-Shirakawa in 1156 and won. Also a fine calligrapher, he is known as the founder of the Hosshō-ji school of calligraphy. He died in 1164.",
    77: "Eldest son of Emperor Toba, he took the throne in 1123 at the age of five, but, disliked by Retired Emperor Toba, he abdicated in favor of Emperor Konoe in 1141. Defeated in the Hōgen Rebellion of 1156, he was exiled to Sanuki Province and died there in 1164 without ever returning to the capital.",
    78: "A descendant of Emperor Uda, he rose no higher than Junior Fifth Rank, Lower Grade, a minor rank. He showed his talent as a poet and was one of the authors of the Eikyū Hundred-Poem Sequences, compiled in 1116 at the command of Emperor Toba. He also composed for the poetry contest at Lord Kuninobu's house in 1100 and other events.",
    79: "His real name was Fujiwara no Akisuke. Son of Fujiwara no Akisue, founder of the Rokujō Fujiwara house, he was born into a distinguished family of poets. He compiled the Shika Wakashū at the command of Retired Emperor Sutoku and presented it in 1151. He did not include a single poem by his son Kiyosuke, who had helped him—a sign of the rift between them. He died in 1155.",
    80: "She served Empress Taiken (Taikenmon-in Tamako), mother of Retired Emperor Sutoku, and was active as a poet in Sutoku's time. In 1142 she took the tonsure along with Empress Taiken and spent her last years at Ninna-ji. Empress Taiken died in 1145, and in 1150 Horikawa contributed a hundred poems to the Kyūan Hundred-Poem Sequences.",
    81: "His real name was Fujiwara no Sanesada. A cousin of Fujiwara no Sadaie, he excelled at waka and was also a master musician. Because his grandfather Saneyoshi was called the \"Tokudaiji Minister of the Left,\" he was called the \"Later Tokudaiji Minister of the Left.\" He became Minister of the Left in 1189, took the tonsure in 1191 and died the following year.",
    82: "His lay name was Fujiwara no Atsuyori. He served as Assistant Director of the Right Bureau of Horses and reached Junior Fifth Rank, Upper Grade. Longing to compose fine poems, he walked every month from Kyoto to Sumiyoshi Shrine to pray. Even after taking the tonsure in 1172 he attended poetry gatherings past the age of 90, and he died around 1182.",
    83: "His real name was Fujiwara no Toshinari; he was the father of Fujiwara no Sadaie. He judged many poetry contests and valued aesthetic ideals such as yūgen (mysterious depth) and en (elegant charm). In 1188 he presented the Senzai Wakashū, compiled at the command of Retired Emperor Go-Shirakawa. In 1203 he was honored with a banquet for his 90th year, and he died in 1204.",
    84: "Son of Fujiwara no Akisuke. Because of the rift with his father, not one of his poems was included in the Shika Wakashū. He became head of the Rokujō Fujiwara house in 1155 and compiled the Shoku Shika Wakashū at the command of Emperor Nijō, but the emperor's death meant it never became an imperial anthology. He died in 1177.",
    85: "Son of Minamoto no Toshiyori, he lost his father at 17 and became a monk at Tōdai-ji. Around 1150 he named his quarters in Shirakawa the Karin'en (\"Garden in the Forest of Poems\") and held poetry gatherings there, inviting many poets. His pupils included Kamo no Chōmei, author of the Hōjōki. He died around 1191.",
    86: "His lay name was Satō Norikiyo. A guard of the North Quarters under Retired Emperor Toba and Lieutenant of the Left Military Guards, he took the tonsure in 1140—one theory says to cut off his love for Empress Taiken. A wandering poet, he traveled to Tōhoku, Shikoku and other regions, composing many poems along the way. He died at Hirokawa-dera in 1190.",
    87: "The adopted son of Fujiwara no Toshinari, he is said to have taken the tonsure so that Toshinari's own son, Sadaie, could become heir. After training on Mount Kōya, he wandered through the provinces and settled in Saga. In 1201 he was chosen as a compiler of the Shin Kokin Wakashū with Sadaie and others, but he died the following year, 1202.",
    88: "She served Empress Kōka (Fujiwara no Kiyoko), consort of Retired Emperor Sutoku, as her chief attendant (bettō). She composed for the 1175 poetry contest at the house of Minister of the Right Kanezane and the Minister of the Right's hundred-poem sequence of 1178. By 1182, when Empress Kōka died, she had already taken the tonsure.",
    89: "Third daughter of Retired Emperor Go-Shirakawa. Appointed High Priestess of the Kamo Shrines in 1159, she was denied freedom in love all her life. After stepping down she lost one family member after another and was even suspected of laying a curse, living a turbulent life. She has 49 poems in the Shin Kokin Wakashū, more than any other woman poet. She died in 1201.",
    90: "Daughter of Fujiwara no Nobunari, she served Empress Inpu (Inpumon-in), a daughter of Emperor Go-Shirakawa. She was called \"Thousand-Poem Taifu\" because she composed so many poems. She joined the Juei Hundred-Poem Sequences in 1182 and took the tonsure in 1192 along with Empress Inpu. She died around 1200.",
    91: "His real name was Kujō Yoshitsune. Grandson of Fujiwara no Tadamichi and second son of Kujō Kanezane, he became head of the Kujō house after his elder brother died young. He became Regent to Emperor Tsuchimikado in 1202 and Chancellor of the Realm in 1204, but died in 1206 at 38, before his father. One theory says he was assassinated.",
    92: "Daughter of Minamoto no Yorimasa, she served Retired Emperor Nijō and then Gishūmon-in, empress of Emperor Go-Toba. A master of waka, she was ranked alongside Princess Shikishi. In 1180 she lost her father and elder brother, who had joined Prince Mochihito's uprising, and took the tonsure. She died around 1217.",
    93: "His real name was Minamoto no Sanetomo. Son of Minamoto no Yoritomo and Hōjō Masako, he became the third shogun of the Kamakura shogunate in 1203 at the age of 12. He loved waka and wished for a peaceful world. His Kinkai Wakashū was compiled around 1213, and he became Minister of the Right in 1218. In 1219 he was assassinated by his nephew Kugyō.",
    94: "His real name was Fujiwara no Masatsune. A master of kemari, he founded the Asukai school of the game. He studied waka under Fujiwara no Toshinari, became a fellow of the Bureau of Poetry in 1201, and was chosen as one of the compilers of the Shin Kokin Wakashū. He became Councillor in 1220 and died in 1221.",
    95: "Sixth son of Fujiwara no Tadamichi, he entered Shōren-in in 1167 and took the tonsure. He became head of the Tendai sect in 1192 and held the post four times in his life. Around 1220 he wrote the historical treatise Gukanshō, which is thought to have been meant to dissuade Retired Emperor Go-Toba from taking up arms. He died in 1225.",
    96: "His real name was Saionji Kintsune. He married a niece of Minamoto no Yoritomo and was closely tied to the Kamakura shogunate. In the Jōkyū War he secretly reported Retired Emperor Go-Toba's plans to the shogunate, and he became Chancellor of the Realm in 1222. He built the Saionji temple in Kitayama, reaching the height of prosperity, and died in 1244.",
    97: "His real name was Fujiwara no Sadaie (also read Teika). Son of Fujiwara no Toshinari, he is the poet who compiled the Hyakunin Isshu. He was chosen as a compiler of the Shin Kokin Wakashū in 1201 and completed the Shin Chokusen Wakashū in 1235. He also copied The Tale of Genji and other works, passing them down to later generations. He died in 1241.",
    98: "His real name was Fujiwara no Ietaka. He studied waka under Fujiwara no Toshinari and, with Fujiwara no Sadaie, was a leading figure of the poetry world. He was chosen as a compiler of the Shin Kokin Wakashū in 1201. Even after Retired Emperor Go-Toba was exiled to Oki following the Jōkyū War, he kept writing to him and continued to support him. He died in 1237.",
    99: "Son of Emperor Takakura, he took the throne without the Three Sacred Treasures. As if to make up for this, he became accomplished in many fields, waka among them. In 1201 he ordered the compilation of the Shin Kokin Wakashū. Defeated in the Jōkyū War of 1221, he was exiled to Oki and died there.",
    100: "Third son of Retired Emperor Go-Toba, he took the throne in 1210 at the age of 14. He recorded the ceremonies and customs of the court in the Kinpishō, seeking to show the significance of the imperial court. Defeated with his father in the Jōkyū War of 1221, he was exiled to Sado and died there in 1242.",
};

// Highest court rank by poet number, from kajin-kanshoku.html. null when the rank is "―" or "unknown".
const RANK_BY_NUMBER = {
    1: null, 2: null, 3: null, 4: null, 5: null, 6: "Junior Third Rank", 7: null, 8: null, 9: null, 10: null,
    11: "Senior Third Rank", 12: null, 13: null, 14: "Senior Second Rank", 15: null, 16: "Senior Third Rank", 17: "Junior Fourth Rank, Upper Grade", 18: "Junior Fourth Rank, Upper Grade", 19: null, 20: "Sanpon (3rd Princely Rank)",
    21: null, 22: null, 23: "Junior Fifth Rank, Lower Grade", 24: "Junior Second Rank", 25: "Junior Second Rank", 26: "Senior First Rank", 27: "Junior Third Rank", 28: "Senior Fourth Rank, Lower Grade", 29: null, 30: "Senior Sixth Rank, Upper Grade",
    31: "Junior Fifth Rank, Lower Grade", 32: null, 33: null, 34: null, 35: "Junior Fifth Rank, Upper Grade", 36: "Junior Fifth Rank, Lower Grade", 37: "Junior Fifth Rank, Lower Grade", 38: null, 39: "Junior Fourth Rank, Upper Grade", 40: "Junior Fifth Rank, Upper Grade",
    41: null, 42: "Junior Fifth Rank, Upper Grade", 43: "Junior Third Rank", 44: "Junior Third Rank", 45: "Senior Second Rank", 46: null, 47: null, 48: "Junior Fifth Rank, Lower Grade", 49: "Junior Fourth Rank, Upper Grade", 50: "Junior Fifth Rank, Upper Grade",
    51: "Junior Fourth Rank, Upper Grade", 52: "Junior Fourth Rank, Upper Grade", 53: null, 54: "Junior Third Rank", 55: "Senior Second Rank", 56: null, 57: null, 58: "Junior Third Rank", 59: null, 60: null,
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
        .replace(/年または/g, ' or ')     // 1050年または1058年 → 1050 or 1058
        .replace(/(\d+)年以降/g, 'after $1') // 1061年以降 → after 1061
        .replace(/年頃/g, ' (approx.)')
        .replace(/年/g, '')
        .replace(/[～〜\-–]/g, '–');
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
        n: 1, name: '<ruby>天智天皇<rt>てんじてんのう</rt></ruby>', date: '626年～672年', theme: 'autumn',
        poem: '<ruby>秋<rt>あき</rt></ruby>の<ruby>田<rt>た</rt></ruby>の…', job: '天皇', source: '後撰集',
        outline: 'Emperor who drove the great Taika Reforms', img: 'img/z01.webp',
    },
    {
        n: 2, name: '<ruby>持統天皇<rt>じとうてんのう</rt></ruby>', date: '645年～703年', theme: 'summer',
        poem: '<ruby>春<rt>はる</rt></ruby><ruby>過<rt>す</rt></ruby>ぎて…', job: '天皇', source: '新古今集',
        outline: 'Empress who held the reins of power at court', img: 'img/z02.webp',
    },
    {
        n: 3, name: '<ruby>柿本人麻呂<rt>かきのもとひとまろ</rt></ruby>', date: '生年不詳～708年頃', era: 1, theme: 'love',
        poem: 'あしびきの…', job: '官人', source: '拾遺集',
        outline: 'Revered as the god of waka, who met a tragic end', img: 'img/z03.webp',
    },
    {
        n: 4, name: '<ruby>山部赤人<rt>やまべのあかひと</rt></ruby>', date: 'dates unknown', theme: 'winter',
        poem: '<ruby>田子<rt>たご</rt></ruby>の<ruby>浦<rt>うら</rt></ruby>に…', job: '官人', source: '新古今集',
        outline: 'Master of landscape poetry who sang of nature\'s beauty', img: 'img/z04.webp',
    },
    {
        n: 5, name: '<ruby>猿丸大夫<rt>さるまるだゆう</rt></ruby>', date: 'dates unknown', theme: 'autumn',
        poem: '<ruby>奥山<rt>おくやま</rt></ruby>に…', job: '伝説', source: '古今集',
        outline: 'A legendary poet shrouded in mystery', img: 'img/z05.webp',
    },
    {
        n: 6, name: '<ruby>中納言家持<rt>ちゅうなごんやかもち</rt></ruby>', date: '718年頃～785年', theme: 'winter',
        poem: 'かささぎの…', job: '公卿', source: '新古今集',
        outline: 'Central figure in compiling the Man\'yōshū', img: 'img/z06.webp',
    },
    {
        n: 7, name: '<ruby>阿倍仲麻呂<rt>あべのなかまろ</rt></ruby>', date: '698年～770年', theme: 'travel',
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
        n: 11, name: '<ruby>参議篁<rt>さんぎたかむら</rt></ruby>', date: '802年～853年', theme: 'travel',
        poem: 'わたの<ruby>原<rt>はら</rt></ruby><br><ruby>八十島<rt>やそしま</rt></ruby>かけて…', job: '公卿', source: '古今集',
        outline: 'A rebellious court official who was exiled for insubordination', img: 'img/z11.webp',
    },
    {
        n: 12, name: '<ruby>僧正遍昭<rt>そうじょうへんじょう</rt></ruby>', date: '816年～890年', theme: 'misc',
        poem: '<ruby>天<rt>あま</rt></ruby>つ<ruby>風<rt>かぜ</rt></ruby>…', job: '僧侶', source: '古今集',
        outline: 'A court official who renounced the world to become a Buddhist monk', img: 'img/z12.webp',
    },
    {
        n: 13, name: '<ruby>陽成院<rt>ようぜいいん</rt></ruby>', date: '869年～949年', theme: 'love',
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
        n: 18, name: '<ruby>藤原敏行朝臣<rt>ふじわらのとしゆきあそん</rt></ruby>', date: '生年不詳～901年', theme: 'love',
        poem: '<ruby>住<rt>すみ</rt></ruby>の<ruby>江<rt>え</rt></ruby>の…', job: '貴族', source: '古今集',
        outline: 'A gifted calligrapher who died young', img: 'img/z18.webp',
    },
    {
        n: 19, name: '<ruby>伊勢<rt>いせ</rt></ruby>', date: '872年頃～938年頃', theme: 'love',
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
        n: 22, name: '<ruby>文屋康秀<rt>ふんやのやすひで</rt></ruby>', date: '生年不詳～885年頃', theme: 'autumn',
        poem: '<ruby>吹<rt>ふ</rt></ruby>くからに…', job: '貴族', source: '古今集',
        outline: 'A witty member of the Six Poetry Immortals', img: 'img/z22.webp',
    },
    {
        n: 23, name: '<ruby>大江千里<rt>おおえのちさと</rt></ruby>', date: '850年頃～905年頃', theme: 'autumn',
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
        n: 28, name: '<ruby>源宗于朝臣<rt>みなもとのむねゆきあそん</rt></ruby>', date: '生年不詳～940年', theme: 'winter',
        poem: '<ruby>山里<rt>やまざと</rt></ruby>は…', job: '貴族', source: '古今集',
        outline: 'An imperial son demoted to commoner status', img: 'img/z28.webp',
    },
    {
        n: 29, name: '<ruby>凡河内躬恒<rt>おおしこうちのみつね</rt></ruby>', date: '859年頃～925年頃', theme: 'autumn',
        poem: '<ruby>心当<rt>こころあ</rt></ruby>てに…', job: '官人', source: '古今集',
        outline: 'One of the Thirty-six Poetry Immortals and a Kokinshū compiler', img: 'img/z29.webp',
    },
    {
        n: 30, name: '<ruby>壬生忠岑<rt>みぶのただみね</rt></ruby>', date: '860年頃～920年頃', theme: 'love',
        poem: '<ruby>有明<rt>ありあけ</rt></ruby>の…', job: '貴族', source: '古今集',
        outline: 'A poet highly praised by Fujiwara no Sadaie', img: 'img/z30.webp',
    },
    {
        n: 31, name: '<ruby>坂上是則<rt>さかのうえのこれのり</rt></ruby>', date: '生年不詳～930年', theme: 'winter',
        poem: '<ruby>朝<rt>あさ</rt></ruby>ぼらけ<br><ruby>有明<rt>ありあけ</rt></ruby>の<ruby>月<rt>つき</rt></ruby>と…', job: '貴族', source: '古今集',
        outline: 'A poet who also excelled at the court sport of kemari football', img: 'img/z31.webp',
    },
    {
        n: 32, name: '<ruby>春道列樹<rt>はるみちのつらき</rt></ruby>', date: '生年不詳～920年', theme: 'autumn',
        poem: '<ruby>山川<rt>やまがわ</rt></ruby>に…', job: '官人', source: '古今集',
        outline: 'A low-ranking official descended from an ancient clan', img: 'img/z32.webp',
    },
    {
        n: 33, name: '<ruby>紀友則<rt>きのとものり</rt></ruby>', date: '845年頃～907年', theme: 'spring',
        poem: '<ruby>久方<rt>ひさかた</rt></ruby>の…', job: '官人', source: '古今集',
        outline: 'A Kokinshū compiler who died before its completion', img: 'img/z33.webp',
    },
    {
        n: 34, name: '<ruby>藤原興風<rt>ふじわらのおきかぜ</rt></ruby>', date: 'dates unknown', theme: 'misc',
        poem: '<ruby>誰<rt>たれ</rt></ruby>をかも…', job: '官人', source: '古今集',
        outline: 'A poet who sang of the loneliness and isolation of old age', img: 'img/z34.webp',
    },
    {
        n: 35, name: '<ruby>紀貫之<rt>きのつらゆき</rt></ruby>', date: '868年頃～945年', theme: 'spring',
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
        n: 40, name: '<ruby>平兼盛<rt>たいらのかねもり</rt></ruby>', date: '生年不詳～991年', theme: 'love',
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
        n: 44, name: '<ruby>中納言朝忠<rt>ちゅうなごんあさただ</rt></ruby>', date: '910年～967年', theme: 'love',
        poem: '<ruby>逢<rt>あ</rt></ruby><ruby>ふ<rt>う</rt></ruby>ことの…', job: '公卿', source: '拾遺集',
        outline: 'A court poet accomplished at playing the shō mouth organ', img: 'img/z44.webp',
    },
    {
        n: 45, name: '<ruby>謙徳公<rt>けんとくこう</rt></ruby>', date: '924年～972年', theme: 'love',
        poem: 'あ<ruby>はれ<rt>われ</rt></ruby>とも…', job: '公卿', source: '拾遺集',
        outline: 'A powerful court noble whose love was never requited', img: 'img/z45.webp',
    },
    {
        n: 46, name: '<ruby>曽禰好忠<rt>そねのよしただ</rt></ruby>', date: '生没年不詳', theme: 'love',
        poem: '<ruby>由良<rt>ゆら</rt></ruby>のとを…', job: '官人', source: '新古今集',
        outline: 'A bold and unconventional up-and-coming poet', img: 'img/z46.webp',
    },
    {
        n: 47, name: '<ruby>恵慶法師<rt>えぎょうほうし</rt></ruby>', date: 'dates unknown', theme: 'autumn',
        poem: '<ruby>八重葎<rt>やえむぐら</rt></ruby>…', job: '僧侶', source: '拾遺集',
        outline: 'A monk who was active at the heart of the poetry world', img: 'img/z47.webp',
    },
    {
        n: 48, name: '<ruby>源重之<rt>みなもとのしげゆき</rt></ruby>', date: '生年不詳～1000年', theme: 'love',
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
        n: 51, name: '<ruby>藤原実方朝臣<rt>ふじわらのさねかたあそん</rt></ruby>', date: '生年不詳～999年', theme: 'love',
        poem: 'かくとだに…', job: '貴族', source: '後拾遺集',
        outline: 'A dashing courtier who was banished to the provinces', img: 'img/z51.webp',
    },
    {
        n: 52, name: '<ruby>藤原道信朝臣<rt>ふじわらのみちのぶあそん</rt></ruby>', date: '972年～994年', theme: 'love',
        poem: '明けぬれば…', job: '貴族', source: '後拾遺集',
        outline: 'A young court poet who died early', img: 'img/z52.webp',
    },
    {
        n: 53, name: '<ruby>右大将道綱母<rt>うだいしょうみちつなのはは</rt></ruby>', date: '936年頃～995年', theme: 'love',
        poem: '<ruby>嘆<rt>なげ</rt></ruby>きつつ…', job: 'その他', source: '拾遺集',
        outline: 'A female poet who chronicled the anguish of her married life', img: 'img/z53.webp',
    },
    {
        n: 54, name: '<ruby>儀同三司母<rt>ぎどうさんしのはは</rt></ruby>', date: '生年不詳～996年', theme: 'love',
        poem: '<ruby>忘<rt>わす</rt></ruby>れじの…', job: '内侍', source: '千載集',
        outline: 'A female poet who witnessed the rise and fall of the Nakanokwanpaku clan', img: 'img/z54.webp',
    },
    {
        n: 55, name: '<ruby>大納言公任<rt>だいなごんきんとう</rt></ruby>', date: '966年～1041年', theme: 'misc',
        poem: '<ruby>滝<rt>たき</rt></ruby>の<ruby>音<rt>おと</rt></ruby>は…', job: '公卿', source: '千載集',
        outline: 'A man of many talents and wide cultural learning', img: 'img/z55.webp',
    },
    {
        n: 56, name: '<ruby>和泉式部<rt>いずみしきぶ</rt></ruby>', date: '976年頃～没年不詳', theme: 'love',
        poem: 'あらざら<ruby>む<rt>ん</rt></ruby>…', job: '女房', source: '後拾遺集',
        outline: 'A naturally gifted poet known for her passionate loves', img: 'img/z56.webp',
    },
    {
        n: 57, name: '<ruby>紫式部<rt>むらさきしきぶ</rt></ruby>', date: '970年頃～1014年頃', theme: 'misc',
        poem: 'めぐり<ruby>逢<rt>あ</rt></ruby><ruby>ひ<rt>い</rt></ruby>て…', job: '女房', source: '新古今集',
        outline: 'Author of the world\'s oldest full-length novel written by a woman', img: 'img/z57.webp',
    },
    {
        n: 58, name: '<ruby>大弐三位<rt>だいにのさんみ</rt></ruby>', date: '999年頃～1082年頃', theme: 'love',
        poem: 'ありま<ruby>山<rt>やま</rt></ruby>…', job: '女房', source: '後拾遺集',
        outline: 'A female poet whose social standing rose dramatically', img: 'img/z58.webp',
    },
    {
        n: 59, name: '<ruby>赤染衛門<rt>あかぞめえもん</rt></ruby>', date: '956年頃～1041年頃', theme: 'love',
        poem: 'やすら<ruby>は<rt>わ</rt></ruby>で…', job: '女房', source: '後拾遺集',
        outline: 'A learned and refined female poet', img: 'img/z59.webp',
    },
    {
        n: 60, name: '<ruby>小式部内侍<rt>こしきぶのないし</rt></ruby>', date: '生年不詳～1025年', theme: 'misc',
        poem: '<ruby>大江山<rt>おおえやま</rt></ruby>…', job: '女房', source: '金葉集',
        outline: 'A quick-witted poet celebrated for her brilliant impromptu verse', img: 'img/z60.webp',
    },
    {
        n: 61, name: '<ruby>伊勢大輔<rt>いせのたいふ</rt></ruby>', date: '989年頃～没年不詳', theme: 'spring',
        poem: 'いにし<ruby>へ<rt>え</rt></ruby>の…', job: '女房', source: '詞花集',
        outline: 'A court lady who astonished the palace with her off-the-cuff verse', img: 'img/z61.webp',
    },
    {
        n: 62, name: '<ruby>清少納言<rt>せいしょうなごん</rt></ruby>', date: '966年頃～1025年頃', theme: 'misc',
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
        n: 65, name: '<ruby>相模<rt>さがみ</rt></ruby>', date: '998年頃～1061年以降', theme: 'love',
        poem: '<ruby>恨<rt>うら</rt></ruby>みわび…', job: '女房', source: '後拾遺集',
        outline: 'A female poet who stood at the forefront of the court poetry world', img: 'img/z65.webp',
    },
    {
        n: 66, name: '<ruby>前大僧正行尊<rt>さきのだいそうじょうぎょうそん</rt></ruby>', date: '1055年～1135年', theme: 'misc',
        poem: 'もろともに…', job: '僧侶', source: '金葉集',
        outline: 'A lofty hermit poet tempered by mountain ascetic practice', img: 'img/z66.webp',
    },
    {
        n: 67, name: '<ruby>周防内侍<rt>すおうのないし</rt></ruby>', date: '1037年頃～1111年頃', theme: 'misc',
        poem: '<ruby>春<rt>はる</rt></ruby>の<ruby>夜<rt>よ</rt></ruby>の…', job: '女房', source: '千載集',
        outline: 'A court lady who deflected amorous nobles with sharp-tongued wit', img: 'img/z67.webp',
    },
    {
        n: 68, name: '<ruby>三条院<rt>さんじょういん</rt></ruby>', date: '976年～1017年', theme: 'misc',
        poem: '<ruby>心<rt>こころ</rt></ruby>にも…', job: '天皇', source: '後拾遺集',
        outline: 'An emperor who stood firm against pressure from Fujiwara no Michinaga', img: 'img/z68.webp',
    },
    {
        n: 69, name: '<ruby>能因法師<rt>のういんほうし</rt></ruby>', date: '988年～1050年または1058年', theme: 'autumn',
        poem: '<ruby>嵐<rt>あらし</rt></ruby><ruby>吹<rt>ふ</rt></ruby>く…', job: '僧侶', source: '後拾遺集',
        outline: 'A wandering monk with a deep love of celebrated poetic places', img: 'img/z69.webp',
    },
    {
        n: 70, name: '<ruby>良暹法師<rt>りょうぜんほうし</rt></ruby>', date: '生没年不詳', theme: 'autumn',
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
        n: 81, name: '<ruby>後徳大寺左大臣<rt>ごとくだいじのさだいじん</rt></ruby>', date: '1139年～1192年', theme: 'summer',
        poem: 'ほととぎす…', job: '公卿', source: '千載集',
        outline: 'A court noble who loved refinement and excelled at music', img: 'img/z81.webp',
    },
    {
        n: 82, name: '<ruby>道因法師<rt>どういんほうし</rt></ruby>', date: '1090年～1182年頃', theme: 'love',
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
        n: 85, name: '<ruby>俊恵法師<rt>しゅんえほうし</rt></ruby>', date: '1113年～1191年頃', theme: 'love',
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
        n: 90, name: '<ruby>殷富門院大輔<rt>いんぷもんいんのたいふ</rt></ruby>', date: '1130年頃～1200年頃', theme: 'love',
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
        outline: 'A gentle poet who co-led the poetry world alongside Sadaie', img: 'img/z98.webp',
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

// (Same as js/zukan.js: the English page also shows the poem in Japanese, vertically.)
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
    // 各句の長さ（em）：通常の文字は1文字1.04em（1em＋letter-spacing .04em）、
    // ルビ付きの語は「親文字の長さ」と「ルビの長さ（rtは.55em＋字間で約.59em/字）」の
    // 長い方。ルビが親文字より長いとその分だけ句が伸びるため（例：衣手＝ころもで）。
    // 全100首でChromiumの実測値（height:max-content）以上・誤差0.73em以内を確認済み。
    const segmentLength = seg => {
        let len = 0;
        const re = /<ruby>(.*?)<rt>(.*?)<\/rt><\/ruby>|([^<])/g;
        let m;
        while ((m = re.exec(seg))) {
            if (m[3] !== undefined) {
                len += 1.04;
            } else {
                // サロゲートペア対応のためArray.fromで数える
                len += Math.max(Array.from(m[1]).length * 1.04, Array.from(m[2]).length * 0.59);
            }
        }
        return len;
    };
    const maxLength = Math.max(...segments.map(segmentLength));
    // 幅：句の数 × 行間（縦書きでは句と句の間隔＝1列分の幅）
    const widthEm = (numColumns * 2.2).toFixed(2);
    // 高さ：最長の句の長さ＋フォント差を吸収するわずかな余白。
    // 横並びのカード同士はsubgridで行の高さが揃うため、結果として
    // 各行で一番長い歌の高さに合わせて揃う
    const heightEm = (maxLength + 0.2).toFixed(2);
    return ` style="width:${widthEm}em;height:${heightEm}em;"`;
}

function buildCard(poet) {
    // The card itself is not a link; only the "Read more" button goes to the poem page (which also introduces the poet)
    const a = document.createElement('div');
    a.className = 'poet-card';
    a.dataset.number = poet.number;
    a.dataset.yomi = poet.yomi;
    a.dataset.theme = poet.theme;
    a.dataset.era = poet.eraNum;

    const theme = THEME_LABELS[poet.theme] || THEME_LABELS.misc;
    const jobText = JOB_LABELS_EN[poet.job] || poet.job || '—';
    const sourceText = SOURCE_DISPLAY[poet.source] || poet.source || '—';
    const outlineText = INTRO_BY_NUMBER_EN[poet.number] || poet.outline;
    const rank = RANK_BY_NUMBER[poet.number];
    const rankText = rank ? `, Rank: ${rank}` : '';

    const poemData = typeof poems !== 'undefined' ? poems[String(poet.number)] : null;

    a.innerHTML = `
    <span class="card-number">${poet.number}</span>
    <div class="card-img">${poet.img ? `<img src="${poet.img}" alt="${poet.name}" loading="lazy">` : ''}</div>
    <div class="card-body">
      <div class="card-name">${poet.nameHtml}${poet.nameEn ? `<span class="card-name-en">${poet.nameEn}</span>` : ''}</div>
      <div class="card-meta"><span class="card-job">Role: ${jobText}${rankText}</span></div>
      <div class="card-date">${poet.era}</div>
      <div class="card-date">${poet.date}</div>
      ${outlineText ? `<div class="card-outline">${outlineText}</div>` : ''}
      ${poemData ? `
      <div class="kokoro-panel">
        <div class="kokoro-panel-text">
          <h3 class="kokoro-panel-poem-title"><span class="card-poem"><span class="card-theme" data-theme="${poet.theme}">${theme.icon} ${theme.label}</span> (${sourceText})</span></h3>
          <div class="kokoro-panel-poem"${poemInlineStyle(poemData)}>${poemData.first}<br>${poemData.second}</div>
        </div>
      </div>` : ''}
      <a class="card-more-btn" href="/${poet.number}_en.html">Read more</a>
    </div>`;

    return a;
}

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
