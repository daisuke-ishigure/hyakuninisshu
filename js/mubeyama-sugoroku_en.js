/* ==========================================================
   Hyakunin Isshu Mubeyama Sugoroku (English version)
   English counterpart of js/mubeyama-sugoroku.js — keep game logic changes in sync
   ========================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     データ定義
  --------------------------------------------------------- */

  // True/false quizzes for all 100 Hyakunin Isshu poets (No. 1 to No. 100), translated from
  // js/mubeyama-sugoroku.js. The array is in poemNum order, so QUIZ_DB[poemNum-1] looks one up directly.
  // Square N asks the quiz for poet No. N; the player must answer correctly to move there.
  // poet = name_en in js/hyakunin.json (same as list_en.html).
  const QUIZ_DB = [
    {
      poemNum: 1, poet: "Emperor Tenji", quizzes: [
        { q: "Emperor Tenji granted Nakatomi no Kamatari the surname “Fujiwara.”", answer: true, explain: "Emperor Tenji is said to have granted Nakatomi no Kamatari the surname “Fujiwara.” His descendants, the Fujiwara clan, went on to hold great power, above all in the mid-Heian period, when they ruled as regents (sekkan politics)." },
      ]
    },
    {
      poemNum: 2, poet: "Empress Jitō", quizzes: [
        { q: "Empress Jitō completed the Fujiwara capital (Fujiwara-kyō).", answer: true, explain: "The “Asuka-Fujiwara” palace and capital sites, which include the Fujiwara capital completed by Empress Jitō, were inscribed as a World Heritage Site in 2026." },
      ]
    },
    {
      poemNum: 3, poet: "Kakinomoto no Hitomaro", quizzes: [
        { q: "Kakinomoto no Hitomaro is a leading poet of the Man'yōshū, also called a “Saint of Poetry” (kasei).", answer: true, explain: "Later generations honored Hitomaro as a “Saint of Poetry,” and he has long been revered as a great poet." },
      ]
    },
    {
      poemNum: 4, poet: "Yamabe no Akahito", quizzes: [
        { q: "Yamabe no Akahito is known as a poet who excelled at love poems.", answer: false, explain: "In fact, he is known for poems describing grand scenery such as Mount Fuji, and he was called a “Saint of Poetry” alongside Kakinomoto no Hitomaro." },
      ]
    },
    {
      poemNum: 5, poet: "Sarumaru Dayū", quizzes: [
        { q: "Sarumaru Dayū's dates of birth and death and his career are well documented.", answer: false, explain: "Almost no reliable records of Sarumaru Dayū's life survive, and his dates are unknown. Some even doubt that he really existed — he is a poet full of mystery." },
      ]
    },
    {
      poemNum: 6, poet: "Middle Counselor Yakamochi", quizzes: [
        { q: "Middle Counselor Yakamochi (Ōtomo no Yakamochi) is thought to have been involved in compiling the Man'yōshū.", answer: true, explain: "Yakamochi, a leading poet of the Nara period, is thought to have been deeply involved in the making of the Man'yōshū." },
      ]
    },
    {
      poemNum: 7, poet: "Abe no Nakamaro", quizzes: [
        { q: "Abe no Nakamaro was a Heian-period poet who spent most of his life in Kyoto.", answer: false, explain: "Nakamaro was a Nara-period poet. He went to Tang China with a Japanese envoy mission and lived for many years in the capital, Chang'an." },
      ]
    },
    {
      poemNum: 8, poet: "Priest Kisen", quizzes: [
        { q: "According to his Hyakunin Isshu poem, Priest Kisen lived on Mount Yoshino in Nara.", answer: false, explain: "Priest Kisen wrote “Waga io wa miyako no tatsumi shika zo sumu…” (My hut is southeast of the capital…), and he is said to have lived in a hut at Uji, southeast (tatsumi) of the Heian capital." },
      ]
    },
    {
      poemNum: 9, poet: "Ono no Komachi", quizzes: [
        { q: "Ono no Komachi is the woman poet with the most poems in the Kokinshū (Kokin Wakashū).", answer: false, explain: "The woman poet with the most poems in the Kokinshū is Ise, with 22. Ono no Komachi has 18, the second most." },
      ]
    },
    {
      poemNum: 10, poet: "Semimaru", quizzes: [
        { q: "Semimaru is said to have been a blind master of the biwa (Japanese lute).", answer: true, explain: "Semimaru became a figure of legend as a blind biwa-playing monk." },
      ]
    },
    {
      poemNum: 11, poet: "Councillor Takamura", quizzes: [
        { q: "Councillor Takamura (Ono no Takamura) was once sent into exile.", answer: true, explain: "Ono no Takamura was appointed vice-envoy to Tang China, but he refused to board the envoy ship and wrote a Chinese poem mocking the mission. This caused an uproar, and he was exiled to Oki Province." },
      ]
    },
    {
      poemNum: 12, poet: "High Priest Henjō", quizzes: [
        { q: "High Priest Henjō never became a monk and remained a layman poet all his life.", answer: false, explain: "In fact, he took holy orders and rose to the rank of sōjō (high priest). Before becoming a monk, he was known as a handsome young nobleman." },
      ]
    },
    {
      poemNum: 13, poet: "Retired Emperor Yōzei", quizzes: [
        { q: "Retired Emperor Yōzei was known for his gentle character and stayed on the throne until late in life.", answer: false, explain: "Emperor Yōzei is reported to have behaved violently at court, and he is said to have stepped down from the throne at the age of 17." },
      ]
    },
    {
      poemNum: 14, poet: "Minister of the Left of Kawara", quizzes: [
        { q: "The Minister of the Left of Kawara (Minamoto no Tōru) once put himself forward to become emperor when Emperor Yōzei stepped down.", answer: true, explain: "Minamoto no Tōru claimed that he was worthy to be a candidate for the throne. However, Fujiwara no Mototsune dismissed this, saying there was no precedent for someone who had left the imperial family to become a subject (shinseki kōka) taking the throne." },
      ]
    },
    {
      poemNum: 15, poet: "Emperor Kōkō", quizzes: [
        { q: "Emperor Kōkō came to the throne as a young child.", answer: false, explain: "In fact, he came to the throne at 55 — an advanced age for the time." },
      ]
    },
    {
      poemNum: 16, poet: "Middle Counselor Yukihira", quizzes: [
        { q: "Middle Counselor Yukihira (Ariwara no Yukihira) excelled only at waka and took little part in politics.", answer: false, explain: "Ariwara no Yukihira excelled not only at waka but also in scholarship and Chinese poetry, and he served actively as a provincial governor in Inaba Province. After returning to the capital he took part in national government and rose to Middle Counselor." },
      ]
    },
    {
      poemNum: 17, poet: "Ariwara no Narihira Ason", quizzes: [
        { q: "Ariwara no Narihira is thought to have been the model for the hero of The Tales of Ise (Ise Monogatari).", answer: true, explain: "The hero of The Tales of Ise, the “man of old” (mukashi otoko), is thought to be modeled on Ariwara no Narihira." },
      ]
    },
    {
      poemNum: 18, poet: "Fujiwara no Toshiyuki Ason", quizzes: [
        { q: "Fujiwara no Toshiyuki was good only at waka and was poor at calligraphy.", answer: false, explain: "Fujiwara no Toshiyuki was known not only for his waka but also as a master calligrapher, and he left his name in Heian history." },
      ]
    },
    {
      poemNum: 19, poet: "Ise", quizzes: [
        { q: "Ise has the most poems of any woman poet in the Kokinshū.", answer: true, explain: "Ise has 22 poems in the Kokinshū, the largest number of any woman poet." },
      ]
    },
    {
      poemNum: 20, poet: "Prince Motoyoshi", quizzes: [
        { q: "Prince Motoyoshi was the first son of Emperor Yōzei and was known for his many love affairs.", answer: true, explain: "Prince Motoyoshi, Emperor Yōzei's first son, left many passionate love poems. He is said to have visited a different woman every night, and was even called “the prince of the one-night rounds” (hitoyo meguri no kimi)." },
      ]
    },
    {
      poemNum: 21, poet: "Priest Sosei", quizzes: [
        { q: "Priest Sosei became a monk of his own free will.", answer: false, explain: "Priest Sosei is known to have been made to become a monk, half against his will, by his father, High Priest Henjō, whose poem is also in the Hyakunin Isshu as No. 12." },
      ]
    },
    {
      poemNum: 22, poet: "Fun'ya no Yasuhide", quizzes: [
        { q: "Fun'ya no Yasuhide once sent Ono no Komachi a poem inviting her to come with him when he left for Mikawa Province.", answer: true, explain: "The Kokinshū records that when Fun'ya no Yasuhide was leaving for Mikawa Province, he sent Ono no Komachi a poem inviting her to come along. Komachi replied with a poem of her own, but whether she actually went with him is not recorded." },
      ]
    },
    {
      poemNum: 23, poet: "Ōe no Chisato", quizzes: [
        { q: "Ōe no Chisato's Hyakunin Isshu poem describes the sadness of autumn felt while looking at the moon.", answer: true, explain: "“Tsuki mireba chiji ni mono koso kanashikere waga mi hitotsu no aki ni wa aranedo” means: when I look at the moon, a thousand things make me sad — though autumn has not come for me alone. Ōe no Chisato was also a scholar well versed in Chinese poetry and prose." },
      ]
    },
    {
      poemNum: 24, poet: "Kanke", quizzes: [
        { q: "Kanke (Sugawara no Michizane) was feared as a vengeful spirit after his death.", answer: true, explain: "Michizane met an unhappy end after losing a political struggle. Later, when disasters such as a lightning strike on the Seiryōden hall of the palace occurred, people feared they were the work of his vengeful spirit. He is counted as one of the “Three Great Vengeful Spirits” of Japan." },
      ]
    },
    {
      poemNum: 25, poet: "Minister of the Right of Sanjō", quizzes: [
        { q: "The Hyakunin Isshu poem of the Minister of the Right of Sanjō (Fujiwara no Sadakata) is a love poem.", answer: true, explain: "“Na ni shi owaba Ōsakayama no sanekazura…” is a love poem wishing there were a way to meet the one he loves without anyone knowing." },
      ]
    },
    {
      poemNum: 26, poet: "Teishin-kō", quizzes: [
        { q: "Teishin-kō (Fujiwara no Tadahira) was the man who had Sugawara no Michizane sent away to Dazaifu.", answer: false, explain: "It was Tadahira's older brother, Fujiwara no Tokihira, who had Michizane sent away. Tadahira is said to have been on friendly terms with Michizane. “Teishin-kō” is Tadahira's posthumous name (okurina) — an honorary name given after death to a person of high rank in praise of their life's achievements." },
      ]
    },
    {
      poemNum: 27, poet: "Middle Counselor Kanesuke", quizzes: [
        { q: "Middle Counselor Kanesuke (Fujiwara no Kanesuke) was the great-grandfather of Murasaki Shikibu.", answer: true, explain: "Fujiwara no Kanesuke was Murasaki Shikibu's great-grandfather. His descendants were active as scholars and poets for generations, and Murasaki Shikibu inherited that family line." },
      ]
    },
    {
      poemNum: 28, poet: "Minamoto no Muneyuki Ason", quizzes: [
        { q: "Minamoto no Muneyuki Ason was a grandson of Emperor Kōkō.", answer: true, explain: "Minamoto no Muneyuki was a grandson of Emperor Kōkō, but he left the imperial family to become a subject (shinseki kōka) and was given the surname “Minamoto.”" },
      ]
    },
    {
      poemNum: 29, poet: "Ōshikōchi no Mitsune", quizzes: [
        { q: "Ōshikōchi no Mitsune wrote the Tosa Diary (Tosa Nikki).", answer: false, explain: "The Tosa Diary was written by Ki no Tsurayuki (No. 35). Ōshikōchi no Mitsune was one of the compilers of the Kokinshū, together with Ki no Tsurayuki and others." },
      ]
    },
    {
      poemNum: 30, poet: "Mibu no Tadamine", quizzes: [
        { q: "Mibu no Tadamine was one of the compilers of the Shin Kokinshū.", answer: false, explain: "Mibu no Tadamine was a compiler of the Kokinshū, together with Ki no Tsurayuki, Ki no Tomonori and Ōshikōchi no Mitsune. He was the father of Mibu no Tadami." },
      ]
    },
    {
      poemNum: 31, poet: "Sakanoue no Korenori", quizzes: [
        { q: "Sakanoue no Korenori's Hyakunin Isshu poem is about the cherry blossoms of Yoshino.", answer: false, explain: "Korenori's poem is about snow, not cherry blossoms. “Asaborake ariake no tsuki to miru made ni Yoshino no sato ni fureru shirayuki” describes mistaking the white snow covering the village of Yoshino for the light of the moon at dawn. Today Yoshino is famous for its cherry blossoms, but in the Heian period it was also known for its snow." },
      ]
    },
    {
      poemNum: 32, poet: "Harumichi no Tsuraki", quizzes: [
        { q: "Harumichi no Tsuraki's Hyakunin Isshu poem is about spring.", answer: false, explain: "Harumichi no Tsuraki's poem is an autumn poem about colored autumn leaves." },
      ]
    },
    {
      poemNum: 33, poet: "Ki no Tomonori", quizzes: [
        { q: "Ki no Tomonori was chosen as a compiler of the Kokinshū but died before it was finished.", answer: true, explain: "Ki no Tomonori died partway through the work and did not live to see the Kokinshū completed." },
      ]
    },
    {
      poemNum: 34, poet: "Fujiwara no Okikaze", quizzes: [
        { q: "Fujiwara no Okikaze's Hyakunin Isshu poem celebrates the happiness of a long life.", answer: false, explain: "The poem does not rejoice in long life. It expresses the loneliness of having lived so long that close friends have all passed away, leaving the poet alone." },
      ]
    },
    {
      poemNum: 35, poet: "Ki no Tsurayuki", quizzes: [
        { q: "Ki no Tsurayuki wrote the Tosa Diary.", answer: true, explain: "Tsurayuki was a compiler of the Kokinshū and also the author of the Tosa Diary, a masterpiece of kana literature." },
      ]
    },
    {
      poemNum: 36, poet: "Kiyohara no Fukayabu", quizzes: [
        { q: "Kiyohara no Fukayabu's Hyakunin Isshu poem is about the short summer night.", answer: true, explain: "“Natsu no yo wa mada yoi nagara akenuru o kumo no izuko ni tsuki yadoruramu” says: the summer night is so short that dawn came while it still seemed evening — where in the clouds might the moon be lodging?" },
      ]
    },
    {
      poemNum: 37, poet: "Fun'ya no Asayasu", quizzes: [
        { q: "Fun'ya no Asayasu was the son of Fun'ya no Yasuhide, and both father and son are in the Hyakunin Isshu.", answer: true, explain: "Asayasu is said to be the son of Fun'ya no Yasuhide, one of the Six Poetic Immortals (Rokkasen), and father and son were both chosen for the Hyakunin Isshu." },
      ]
    },
    {
      poemNum: 38, poet: "Ukon", quizzes: [
        { q: "Ukon was a male court noble who served as regent and chancellor.", answer: false, explain: "Ukon was a woman poet who served at court as a lady-in-waiting (nyōbō). Her name comes from her father's post, Minor Captain of the Right Inner Palace Guards (Ukon'e no Shōshō)." },
      ]
    },
    {
      poemNum: 39, poet: "Councillor Hitoshi", quizzes: [
        { q: "Councillor Hitoshi's poem is a love poem about secret feelings of love that can no longer be held back.", answer: true, explain: "The poem “Asajiu no Ono no shinohara shinoburedo…” expresses a love he has kept hidden, yet can no longer contain." },
      ]
    },
    {
      poemNum: 40, poet: "Taira no Kanemori", quizzes: [
        { q: "Taira no Kanemori is said to have beaten Mibu no Tadami in a famous poetry contest.", answer: true, explain: "At the Imperial Palace Poetry Contest of Tentoku 4 (960), Taira no Kanemori's “Shinoburedo” was matched against Mibu no Tadami's “Koisu chō,” and the famous story goes that Kanemori's poem won." },
      ]
    },
    {
      poemNum: 41, poet: "Mibu no Tadami", quizzes: [
        { q: "Mibu no Tadami is said to have lost to Taira no Kanemori in a poetry contest.", answer: true, explain: "At the Tentoku Imperial Palace Poetry Contest, Tadami and Kanemori competed with poems on “love.” It is said that Kanemori won because Emperor Murakami murmured Kanemori's poem “Shinoburedo…” to himself." },
      ]
    },
    {
      poemNum: 42, poet: "Kiyohara no Motosuke", quizzes: [
        { q: "Kiyohara no Motosuke was the father of Sei Shōnagon.", answer: true, explain: "Sei Shōnagon is thought to have been born around 966, when her father Kiyohara no Motosuke was about 59." },
      ]
    },
    {
      poemNum: 43, poet: "Acting Middle Counselor Atsutada", quizzes: [
        { q: "Acting Middle Counselor Atsutada's poem says his longing grew stronger after he had been with his lover.", answer: true, explain: "“Aimite no nochi no kokoro ni kurabureba mukashi wa mono o omowazarikeri” means: compared with my heart after we were together, before then I had known no real longing at all." },
      ]
    },
    {
      poemNum: 44, poet: "Middle Counselor Asatada", quizzes: [
        { q: "Middle Counselor Asatada (Fujiwara no Asatada) was the son of the Minister of the Right of Sanjō (Fujiwara no Sadakata).", answer: true, explain: "Fujiwara no Asatada was the fifth son of Fujiwara no Sadakata, and father and son were both chosen for the Hyakunin Isshu." },
      ]
    },
    {
      poemNum: 45, poet: "Kentoku-kō", quizzes: [
        { q: "Kentoku-kō never received a high rank and died without any official post.", answer: false, explain: "Kentoku-kō is Fujiwara no Koretada, who in fact rose to become regent (sesshō)." },
      ]
    },
    {
      poemNum: 46, poet: "Sone no Yoshitada", quizzes: [
        { q: "Sone no Yoshitada's poem compares a love with an uncertain future to a boat that has lost its rudder.", answer: true, explain: "“Yura no to o wataru funabito kaji o tae…” compares his love, whose future he cannot see, to a boat that has lost its rudder and drifts with no idea where it is going." },
      ]
    },
    {
      poemNum: 47, poet: "Priest Egyō", quizzes: [
        { q: "Priest Egyō's poem describes autumn coming to a run-down house that no one visits.", answer: true, explain: "“Yaemugura shigereru yado no sabishiki ni hito koso miene aki wa kinikeri” means: to this lonely house overgrown with weeds, no one comes — yet autumn alone has arrived." },
      ]
    },
    {
      poemNum: 48, poet: "Minamoto no Shigeyuki", quizzes: [
        { q: "Minamoto no Shigeyuki was a poet who lived in various places far from the capital, such as Mutsu and Tsukushi.", answer: true, explain: "Serving as a provincial official, he was posted to various regions and lived in places such as Mutsu and Tsukushi. These experiences show in his poems about nature and travel." },
      ]
    },
    {
      poemNum: 49, poet: "Ōnakatomi no Yoshinobu Ason", quizzes: [
        { q: "Ōnakatomi no Yoshinobu Ason served as chief priest (saishu) of Ise Shrine.", answer: true, explain: "He came from a family that served as Shinto priests for generations, and he himself served as chief priest of Ise Shrine." },
      ]
    },
    {
      poemNum: 50, poet: "Fujiwara no Yoshitaka", quizzes: [
        { q: "Fujiwara no Yoshitaka died of illness at the young age of 21.", answer: true, explain: "Yoshitaka caught smallpox during an epidemic and died at just 21. His older brother is said to have died on the morning of the same day, and Yoshitaka in the evening." },
      ]
    },
    {
      poemNum: 51, poet: "Fujiwara no Sanekata Ason", quizzes: [
        { q: "Fujiwara no Sanekata Ason spent his whole life in the capital and was never posted to the provinces.", answer: false, explain: "After a quarrel at court, Fujiwara no Sanekata was sent away to Mutsu, and he is said to have died there after falling from his horse." },
      ]
    },
    {
      poemNum: 52, poet: "Fujiwara no Michinobu Ason", quizzes: [
        { q: "Fujiwara no Michinobu Ason is known as a young poet who died at 23.", answer: true, explain: "Fujiwara no Michinobu is said to have died at 23 and is known as a poet who died young." },
      ]
    },
    {
      poemNum: 53, poet: "Mother of the Right Captain Michitsuna", quizzes: [
        { q: "The Mother of the Right Captain Michitsuna wrote the Kagerō Diary (Kagerō Nikki).", answer: true, explain: "The Mother of the Right Captain Michitsuna was the author of the Kagerō Diary, which describes her married life with Fujiwara no Kaneie." },
      ]
    },
    {
      poemNum: 54, poet: "Mother of the Honorary Grand Minister", quizzes: [
        { q: "The Mother of the Honorary Grand Minister (Takashina no Takako) was the wife of Fujiwara no Michitaka and the mother of Korechika and Teishi.", answer: true, explain: "She was a central figure of the Naka no Kampaku family and the mother of Fujiwara no Korechika and Empress Teishi." },
      ]
    },
    {
      poemNum: 55, poet: "Upper Counselor Kintō", quizzes: [
        { q: "Upper Counselor Kintō (Fujiwara no Kintō) is known for the story of his “talent for three boats,” showing he excelled at waka, Chinese poetry and music.", answer: true, explain: "A famous story tells that at a boating party with three boats — for waka, Chinese poetry and music — Kintō was asked which boat he would board, because he excelled at all three." },
      ]
    },
    {
      poemNum: 56, poet: "Izumi Shikibu", quizzes: [
        { q: "Izumi Shikibu had no children and is said to have stayed single all her life.", answer: false, explain: "Izumi Shikibu had a daughter, Koshikibu no Naishi, and mother and daughter were both chosen for the Hyakunin Isshu." },
      ]
    },
    {
      poemNum: 57, poet: "Murasaki Shikibu", quizzes: [
        { q: "Murasaki Shikibu wrote The Tale of Genji.", answer: true, explain: "Murasaki Shikibu wrote The Tale of Genji, the great long tale that represents the Heian period." },
      ]
    },
    {
      poemNum: 58, poet: "Daini no Sanmi", quizzes: [
        { q: "Daini no Sanmi was the daughter of Murasaki Shikibu.", answer: true, explain: "Daini no Sanmi was the only daughter of Murasaki Shikibu, the author of The Tale of Genji." },
      ]
    },
    {
      poemNum: 59, poet: "Akazome Emon", quizzes: [
        { q: "Akazome Emon wrote only waka and is said to have had nothing to do with writing tales or histories.", answer: false, explain: "Akazome Emon is known as a fine poet, but she is also thought to have written 30 of the 40 volumes of A Tale of Flowering Fortunes (Eiga Monogatari), so she was a writer of tales as well as of waka." },
      ]
    },
    {
      poemNum: 60, poet: "Koshikibu no Naishi", quizzes: [
        { q: "Koshikibu no Naishi was the daughter of Izumi Shikibu.", answer: true, explain: "She was known for a poetic talent inherited from her mother, Izumi Shikibu, and witty anecdotes about her survive." },
      ]
    },
    {
      poemNum: 61, poet: "Ise no Taifu", quizzes: [
        { q: "Ise no Taifu's poem is about double-flowered cherry blossoms (yaezakura).", answer: true, explain: "“Inishie no Nara no miyako no yaezakura kyō kokonoe ni nioinuru kana” describes double-flowered cherry blossoms sent from Nara, blooming beautifully in the imperial palace (kokonoe)." },
      ]
    },
    {
      poemNum: 62, poet: "Sei Shōnagon", quizzes: [
        { q: "Sei Shōnagon was a lady-in-waiting who served Teishi, Empress of Emperor Ichijō.", answer: true, explain: "She served Empress Teishi, the daughter of Fujiwara no Michitaka, and vividly described life at court in The Pillow Book (Makura no Sōshi)." },
      ]
    },
    {
      poemNum: 63, poet: "Master of the Left Capital Michimasa", quizzes: [
        { q: "Master of the Left Capital Michimasa secretly became the lover of Princess Tōshi and lived happily with her.", answer: false, explain: "Michimasa secretly became the lover of Princess Tōshi, but their relationship was not allowed, and her father, Emperor Sanjō, forced them apart." },
      ]
    },
    {
      poemNum: 64, poet: "Acting Middle Counselor Sadayori", quizzes: [
        { q: "Acting Middle Counselor Sadayori (Fujiwara no Sadayori) once teased Koshikibu no Naishi and was put to shame by her poem.", answer: true, explain: "When Sadayori teased her by asking whether she had asked her mother, Izumi Shikibu, to write her poem for her, Koshikibu no Naishi instantly replied with “Ōeyama ikuno no michi no…,” and Sadayori is said to have fled without being able to answer." },
      ]
    },
    {
      poemNum: 65, poet: "Sagami", quizzes: [
        { q: "The name Sagami comes from “Sagami Province,” an old province around present-day Kanagawa Prefecture.", answer: true, explain: "The name Sagami is said to come from the province where her husband, Ōe no Kinsuke, served as governor (Sagami no kami). Sagami Province covered most of present-day Kanagawa Prefecture." },
      ]
    },
    {
      poemNum: 66, poet: "Senior High Priest Gyōson", quizzes: [
        { q: "Senior High Priest Gyōson was a monk of the Tendai school of Buddhism.", answer: true, explain: "Gyōson was a Tendai monk who served as Tendai Zasu, the highest office of Enryakuji Temple on Mount Hiei." },
      ]
    },
    {
      poemNum: 67, poet: "Suō no Naishi", quizzes: [
        { q: "Suō no Naishi was a male court noble with no connection to waka.", answer: false, explain: "Suō no Naishi was a lady-in-waiting who served at the imperial court and was known as a witty poet." },
      ]
    },
    {
      poemNum: 68, poet: "Retired Emperor Sanjō", quizzes: [
        { q: "Retired Emperor Sanjō came to the throne young and reigned for a long time.", answer: false, explain: "Emperor Sanjō came to the throne at 36 and reigned for only about five years. Suffering from an eye disease and in conflict with Fujiwara no Michinaga, he ended up giving up the throne." },
      ]
    },
    {
      poemNum: 69, poet: "Priest Nōin", quizzes: [
        { q: "Priest Nōin is said to have tanned himself on purpose before appearing in public, to make it look as if he had traveled to Mutsu.", answer: true, explain: "Priest Nōin wrote “Miyako o ba kasumi to tomo ni tachishikado akikaze zo fuku Shirakawa no seki” (I left the capital with the spring haze, yet now the autumn wind blows at the Shirakawa Barrier). A story tells that he tanned himself on purpose before appearing in public, to show that he had really visited the Shirakawa Barrier." },
      ]
    },
    {
      poemNum: 70, poet: "Priest Ryōzen", quizzes: [
        { q: "Priest Ryōzen's poem in the Hyakunin Isshu is famous for describing a summer evening.", answer: false, explain: "Priest Ryōzen's poem describes the loneliness of an autumn evening, not a summer one." },
      ]
    },
    {
      poemNum: 71, poet: "Upper Counselor Tsunenobu", quizzes: [
        { q: "Upper Counselor Tsunenobu (Minamoto no Tsunenobu) excelled at Chinese poetry, waka and music, and was praised for his “talent for three boats.”", answer: true, explain: "Minamoto no Tsunenobu was known for his talent in Chinese poetry, waka and music, and was praised for his “talent for three boats.” He was also very learned and especially famous as a master of the biwa." },
      ]
    },
    {
      poemNum: 72, poet: "Kii of Princess Yūshi's Household", quizzes: [
        { q: "Kii of Princess Yūshi's Household was a male poet.", answer: false, explain: "She was a lady-in-waiting who served Princess Yūshi, a daughter of Emperor Go-Suzaku, and was a woman poet." },
      ]
    },
    {
      poemNum: 73, poet: "Acting Middle Counselor Masafusa", quizzes: [
        { q: "Acting Middle Counselor Masafusa's poem is about cherry blossoms blooming on a high mountain peak.", answer: true, explain: "“Takasago no onoe no sakura sakinikeri toyama no kasumi tatazu mo aranamu” says: the cherry blossoms on the distant high peaks have bloomed — haze on the nearer hills, please don't rise and hide them." },
      ]
    },
    {
      poemNum: 74, poet: "Minamoto no Toshiyori Ason", quizzes: [
        { q: "Minamoto no Toshiyori Ason's poem describes cherry blossoms blooming on a mountain.", answer: false, explain: "Toshiyori's poem is not about cherry blossoms. It is a love poem lamenting that, although he prayed at Hatsuse (Hasedera Temple), the cold-hearted one only grew colder." },
      ]
    },
    {
      poemNum: 75, poet: "Fujiwara no Mototoshi", quizzes: [
        { q: "Fujiwara no Mototoshi's Hyakunin Isshu poem rejoices in his son's success.", answer: false, explain: "Fujiwara no Mototoshi's poem laments that his son Kōkaku, who had become a monk, failed to receive the appointment he hoped for. It is filled with a parent's love for his child." },
      ]
    },
    {
      poemNum: 76, poet: "Lay Novice of Hosshō-ji Temple, former Kampaku and Chancellor of the Realm", quizzes: [
        { q: "The name “Hosshōji Nyūdō Saki no Kampaku Daijō Daijin” (Lay Novice of Hosshō-ji Temple, former Kampaku and Chancellor of the Realm) is the longest poet name in the Hyakunin Isshu.", answer: true, explain: "Some poets in the Hyakunin Isshu are known by names that combine their official titles and the names they used after becoming monks. “Hosshōji Nyūdō Saki no Kampaku Daijō Daijin” is one of them; his real name was Fujiwara no Tadamichi." },
      ]
    },
    {
      poemNum: 77, poet: "Retired Emperor Sutoku", quizzes: [
        { q: "Retired Emperor Sutoku was feared as a vengeful spirit after his death.", answer: true, explain: "Defeated in the Hōgen Rebellion and exiled to Sanuki, Sutoku met a tragic end. After his death he came to be feared as a vengeful spirit bringing disaster to the court. He is counted as one of the “Three Great Vengeful Spirits” of Japan." },
      ]
    },
    {
      poemNum: 78, poet: "Minamoto no Kanemasa", quizzes: [
        { q: "Minamoto no Kanemasa's Hyakunin Isshu poem features the hototogisu (lesser cuckoo).", answer: false, explain: "The bird in Kanemasa's poem is not the hototogisu but the plover (chidori). “Awajishima kayou chidori no naku koe ni ikuyo nezamenu Suma no sekimori” asks how many nights the guard of the Suma Barrier has been woken by the cries of plovers flying over from Awaji Island." },
      ]
    },
    {
      poemNum: 79, poet: "Master of the Left Capital Akisuke", quizzes: [
        { q: "Master of the Left Capital Akisuke's poem describes moonlight shining through gaps in the clouds.", answer: true, explain: "“Akikaze ni tanabiku kumo no taema yori moreizuru tsuki no kage no sayakesa” describes the clear moonlight seen through breaks in the clouds drifting on the autumn wind." },
      ]
    },
    {
      poemNum: 80, poet: "Horikawa, attendant to Empress Taiken", quizzes: [
        { q: "The “black hair” poem by Horikawa, attendant to Empress Taiken, is said to have influenced Yosano Akiko, a leading modern poet.", answer: true, explain: "Horikawa's “Nagakaramu kokoro mo shirazu kurokami no…” has been loved by later generations, and Yosano Akiko also wrote works drawing on this “black hair” poem." },
      ]
    },
    {
      poemNum: 81, poet: "Later Tokudaiji Minister of the Left", quizzes: [
        { q: "In the poem by the Later Tokudaiji Minister of the Left, the poet clearly sees the hototogisu that has just sung.", answer: false, explain: "When he looks toward where the song came from, the hototogisu is nowhere to be seen — only the moon lingering in the dawn sky remains." },
      ]
    },
    {
      poemNum: 82, poet: "Priest Dōin", quizzes: [
        { q: "Priest Dōin lived a long life and never lost his passion for waka, even in old age.", answer: true, explain: "Even past 80 he still wished to improve his waka; one story tells that he walked all the way to Sumiyoshi Taisha Shrine in Osaka, worshipped as the home of a god of waka, to pray. He is known for his intense devotion to poetry." },
      ]
    },
    {
      poemNum: 83, poet: "Master of the Empress Dowager's Household Toshinari", quizzes: [
        { q: "Master of the Empress Dowager's Household Toshinari (Fujiwara no Toshinari) was the father of Fujiwara no Teika.", answer: true, explain: "Fujiwara no Toshinari was Teika's father, and father and son were both chosen for the Hyakunin Isshu." },
      ]
    },
    {
      poemNum: 84, poet: "Fujiwara no Kiyosuke Ason", quizzes: [
        { q: "Fujiwara no Kiyosuke Ason wrote The Pillow Book.", answer: false, explain: "The Pillow Book was written by Sei Shōnagon. What Fujiwara no Kiyosuke wrote was the Fukuro Zōshi, a book of poetic studies collecting theories and anecdotes about waka." },
      ]
    },
    {
      poemNum: 85, poet: "Priest Shun'e", quizzes: [
        { q: "Priest Shun'e gathered many poets at his monk's lodging, the “Karin'en,” and held poetry gatherings there.", answer: true, explain: "Shun'e called his lodging at Shirakawa in Kyoto the “Karin'en” (Garden in the Forest of Poems) and made it a place where many poets, monks and nobles alike, gathered to compose. Kamo no Chōmei, known for An Account of My Hut (Hōjōki), is also said to have studied waka with Shun'e." },
      ]
    },
    {
      poemNum: 86, poet: "Priest Saigyō", quizzes: [
        { q: "Priest Saigyō wished to “die in spring beneath the blossoms,” and is said to have died in cherry-blossom season, just as his poem hoped.", answer: true, explain: "Saigyō wrote “Negawaku wa hana no shita nite haru shinamu” (I pray I may die in spring beneath the blossoms), and he is said to have passed away on the 16th day of the 2nd lunar month, around the anniversary of the Buddha's death (nirvana)." },
      ]
    },
    {
      poemNum: 87, poet: "Priest Jakuren", quizzes: [
        { q: "Priest Jakuren was adopted by Fujiwara no Toshinari, but became a monk after Toshinari's own son, Teika, was born.", answer: true, explain: "Jakuren became Toshinari's adopted son, but he is said to have taken holy orders after Toshinari's own son Teika was born." },
      ]
    },
    {
      poemNum: 88, poet: "Attendant to Empress Kōka", quizzes: [
        { q: "The poem by the Attendant to Empress Kōka is a love poem asking whether she must go on loving with all her being for the sake of just one night together.", answer: true, explain: "“Naniwae no ashi no karine no hitoyo yue mi o tsukushite ya koiwataru beki” asks: for one brief night together — short as a joint of reed cut at Naniwa Bay — must I go on loving you with my whole being?" },
      ]
    },
    {
      poemNum: 89, poet: "Princess Shikishi", quizzes: [
        { q: "Princess Shikishi never married in her life.", answer: true, explain: "Princess Shikishi served as the High Priestess of the Kamo Shrines (Kamo no Saiin). Even after leaving that post she never married, and stayed single all her life." },
      ]
    },
    {
      poemNum: 90, poet: "Attendant to Empress Inpu", quizzes: [
        { q: "Ojima, the island in the poem by the Attendant to Empress Inpu, is in Matsushima in present-day Miyagi Prefecture.", answer: true, explain: "Ojima is an island in Matsushima, Miyagi Prefecture, famous as one of the Three Views of Japan." },
      ]
    },
    {
      poemNum: 91, poet: "Gokyōgoku Regent and former Chancellor of the Realm", quizzes: [
        { q: "The “kirigirisu” in the Hyakunin Isshu poem of the Gokyōgoku Regent (Fujiwara no Yoshitsune) is the insect called kirigirisu (katydid) today.", answer: false, explain: "The “kirigirisu” in this poem is thought to mean not today's kirigirisu (katydid) but the cricket (kōrogi). Insect names in the classics sometimes differ from today's: what we now call kirigirisu was called hataori, and what we now call kōrogi was called kirigirisu." },
      ]
    },
    {
      poemNum: 92, poet: "Sanuki, attendant to retired Emperor Nijō", quizzes: [
        { q: "Sanuki, attendant to Retired Emperor Nijō, came to be called “Sanuki of the Offshore Rock” after her poem “Waga sode wa shiohi ni mienu oki no ishi no…”", answer: true, explain: "After the “offshore rock” (oki no ishi) in her Hyakunin Isshu poem, later generations called her “Oki no Ishi no Sanuki.”" },
      ]
    },
    {
      poemNum: 93, poet: "Minister of the Right of Kamakura", quizzes: [
        { q: "The Minister of the Right of Kamakura (Minamoto no Sanetomo) was the third shogun of the Kamakura shogunate.", answer: true, explain: "The son of Minamoto no Yoritomo, he was active as a poet while serving as the third shogun of the Kamakura shogunate." },
      ]
    },
    {
      poemNum: 94, poet: "Councillor Masatsune", quizzes: [
        { q: "Councillor Masatsune (Fujiwara no Masatsune) was the founder of the Asukai family, famous for kemari (court football).", answer: true, explain: "His descendants continued for generations as the Asukai family, the head house of kemari." },
      ]
    },
    {
      poemNum: 95, poet: "Former Senior High Priest Jien", quizzes: [
        { q: "Former Senior High Priest Jien wrote the Gukanshō to warn about the politics of his day, as tension grew between the imperial court and the warriors.", answer: true, explain: "Jien is thought to have written the Gukanshō partly in the hope of stopping Retired Emperor Go-Toba's plan to overthrow the shogunate." },
      ]
    },
    {
      poemNum: 96, poet: "Lay Novice and former Chancellor of the Realm", quizzes: [
        { q: "The Lay Novice and former Chancellor of the Realm (Saionji Kintsune) tried to overthrow the Kamakura shogunate together with Retired Emperor Go-Toba.", answer: false, explain: "Saionji Kintsune is said to have informed the Kamakura shogunate of Go-Toba's plan to overthrow it. After the Jōkyū War he became a court noble who mediated between the court and the shogunate, and he rose to Chancellor of the Realm (Daijō Daijin)." },
      ]
    },
    {
      poemNum: 97, poet: "Acting Middle Counselor Sadaie", quizzes: [
        { q: "Acting Middle Counselor Sadaie (Fujiwara no Teika) is said to have compiled the Ogura Hyakunin Isshu.", answer: true, explain: "The Ogura Hyakunin Isshu is said to have been selected by Fujiwara no Teika at his mountain villa on Mount Ogura, one poem each from a hundred poets." },
      ]
    },
    {
      poemNum: 98, poet: "Junior Second Rank Ietaka", quizzes: [
        { q: "Junior Second Rank Ietaka (Fujiwara no Ietaka) was a poet ranked alongside Fujiwara no Teika.", answer: true, explain: "Fujiwara no Ietaka studied under Fujiwara no Toshinari and, together with Teika, was regarded as a leading poet of the Shin Kokinshū era. He was also one of the compilers of the Shin Kokinshū." },
      ]
    },
    {
      poemNum: 99, poet: "Retired Emperor Go-Toba", quizzes: [
        { q: "Retired Emperor Go-Toba loved swords so much that he forged blades himself.", answer: true, explain: "Go-Toba, who was well versed in waka and many other arts, also took a strong interest in swords, even inviting swordsmiths to court and forging blades himself." },
      ]
    },
    {
      poemNum: 100, poet: "Retired Emperor Juntoku", quizzes: [
        { q: "Retired Emperor Juntoku took no part in the Jōkyū War and lived a peaceful life in the capital.", answer: false, explain: "In fact, he took part in the Jōkyū War together with his father, Retired Emperor Go-Toba, and was exiled to Sado Island." },
      ]
    }
  ];

  // Poem text (upper/lower verse, Japanese with ruby HTML) copied from js/mubeyama-sugoroku.js,
  // romaji from the yomihuda in js/hyakunin.json (same conversion as js/list-rows_en.js),
  // and the English translation from modern_en in js/hyakunin.json.
  const POEM_DB = {
    1: { first: '<ruby>秋<rt>あき</rt></ruby>の<ruby>田<rt>た</rt></ruby>の<br>かりほの<ruby>庵<rt>いお</rt></ruby>の<br><ruby>苫<rt>とま</rt></ruby>をあらみ', second: '<ruby>我<rt>わ</rt></ruby>が<ruby>衣手<rt>ころもで</rt></ruby>は<br><ruby>露<rt>つゆ</rt></ruby>にぬれつつ', romaji: "akinotano karihonoihono tomaoarami\nwagakoromodeha tsuyuninuretsutsu", translation: "By the rice fields, in a makeshift hut with a loosely woven roof, my sleeves are wet with the night dew." },
    2: { first: '<ruby>春<rt>はる</rt></ruby><ruby>過<rt>す</rt></ruby>ぎて<br><ruby>夏<rt>なつ</rt></ruby><ruby>来<rt>き</rt></ruby>にけらし<br><ruby>白妙<rt>しろたえ</rt></ruby>の', second: '<ruby>衣<rt>ころも</rt></ruby>ほす<ruby>てふ<rt>ちょう</rt></ruby><br><ruby>天<rt>あま</rt></ruby>の<ruby>香具山<rt>かぐやま</rt></ruby>', romaji: "harusugite natsukinikerashi shirotaheno\nkoromohosutefu amanokaguyama", translation: "Spring has passed and summer seems to have come — white robes are said to be hung out to dry on the heavenly Mount Kagu." },
    3: { first: 'あしびきの<br><ruby>山鳥<rt>やまどり</rt></ruby>の<ruby>尾<rt>お</rt></ruby>の<br>しだり<ruby>尾<rt>お</rt></ruby>の', second: 'ながながし<ruby>夜<rt>よ</rt></ruby>を<br>ひとりかも<ruby>寝<rt>ね</rt></ruby><ruby>む<rt>ん</rt></ruby>', romaji: "ashibikino yamadorinoono shidariono\nnaganagashiyoo hitorikamonemu", translation: "As long as the trailing tail feathers of the mountain bird — through these long, long nights, must I sleep alone?" },
    4: { first: '<ruby>田子<rt>たご</rt></ruby>の<ruby>浦<rt>うら</rt></ruby>に<br>うちいでてみれば<br><ruby>白妙<rt>しろたえ</rt></ruby>の', second: '<ruby>富士<rt>ふじ</rt></ruby>の<ruby>高嶺<rt>たかね</rt></ruby>に<br><ruby>雪<rt>ゆき</rt></ruby>は<ruby>降<rt>ふ</rt></ruby>りつつ', romaji: "tagonourani uchiidetemireba shirotaheno\nfujinotakaneni yukihafuritsutsu", translation: "Going out to Tago Bay and looking around, I see snow falling ceaselessly on the high peak of Fuji, white as freshly woven cloth." },
    5: { first: '<ruby>奥山<rt>おくやま</rt></ruby>に<br><ruby>紅葉<rt>もみじ</rt></ruby><ruby>踏<rt>ふ</rt></ruby>み<ruby>分<rt>わ</rt></ruby>け<br><ruby>鳴<rt>な</rt></ruby>く<ruby>鹿<rt>しか</rt></ruby>の', second: '<ruby>声<rt>こえ</rt></ruby><ruby>聞<rt>き</rt></ruby>く<ruby>時<rt>とき</rt></ruby>ぞ<br><ruby>秋<rt>あき</rt></ruby>はかなしき', romaji: "okuyamani momijifumiwake nakushikano\nkoekikutokizo akihakanashiki", translation: "Deep in the mountains, treading through the scattered autumn leaves, I hear a deer cry. Listening to that voice, I feel the sadness of autumn all the more." },
    6: { first: 'かささぎの<br><ruby>渡<rt>わた</rt></ruby>せる<ruby>橋<rt>はし</rt></ruby>に<br>おく<ruby>霜<rt>しも</rt></ruby>の', second: '<ruby>白<rt>しろ</rt></ruby>きをみれば<br><ruby>夜<rt>よ</rt></ruby>ぞふけにける', romaji: "kasasagino wataseruhashini okushimono\nshirokiomireba yozofukenikeru", translation: "Looking up at the Milky Way that magpies wing across — its white shimmer seems to be scattered frost. The night deepens." },
    7: { first: '<ruby>天<rt>あま</rt></ruby>の<ruby>原<rt>はら</rt></ruby><br>ふりさけみれば<br><ruby>春日<rt>かすが</rt></ruby>なる', second: '<ruby>三笠<rt>みかさ</rt></ruby>の<ruby>山<rt>やま</rt></ruby>に<br><ruby>出<rt>い</rt></ruby>でし<ruby>月<rt>つき</rt></ruby>かも', romaji: "amanohara furisakemireba kasuganaru\nmikasanoyamani ideshitsukikamo", translation: "Looking up at the vast sky, I see the moon. Is that the same moon that rose over Mount Mikasa in Kasuga, so long ago?" },
    8: { first: 'わが<ruby>庵<rt>いお</rt></ruby>は<br><ruby>都<rt>みやこ</rt></ruby>の<ruby>辰巳<rt>たつみ</rt></ruby><br>しかぞすむ', second: '<ruby>世<rt>よ</rt></ruby>をう<ruby>ぢ<rt>じ</rt></ruby><ruby>山<rt>やま</rt></ruby>と<br><ruby>人<rt>ひと</rt></ruby>はい<ruby>ふ<rt>う</rt></ruby>なり', romaji: "wagaihoha miyakonotatsumi shikazosumu\nyooujiyamato hitohaifunari", translation: "My home is in the southeast of the capital, and I live here at peace. People say I moved to Mount Uji because I found the world hard to bear — but that is only what others say." },
    9: { first: '<ruby>花<rt>はな</rt></ruby>の<ruby>色<rt>いろ</rt></ruby>は<br>うつりにけりな<br>いた<ruby>づ<rt>ず</rt></ruby>らに', second: 'わが<ruby>身<rt>み</rt></ruby>よにふる<br>ながめせしまに', romaji: "hananoiroha utsurinikerina itazurani\nwagamiyonifuru nagameseshimani", translation: "How the beauty of the cherry blossoms faded away, soaked by the long spring rains. And just like them, my own looks have faded too, lost in a haze of endless longing." },
    10: { first: 'これやこの<br><ruby>行<rt>ゆ</rt></ruby>くも<ruby>帰<rt>かえ</rt></ruby>るも<br>わかれては', second: 'しるもしらぬも<br><ruby>逢坂<rt>おうさか</rt></ruby>の<ruby>関<rt>せき</rt></ruby>', romaji: "koreyakono yukumokaherumo wakareteha\nshirumoshiranumo afusakanoseki", translation: "So this is it — the Barrier of Ōsaka, where those who leave and those who return, those who know each other and those who do not, all meet and part." },
    11: { first: 'わたの<ruby>原<rt>はら</rt></ruby><br><ruby>八十島<rt>やそしま</rt></ruby>かけて<br><ruby>漕<rt>こ</rt></ruby>ぎ<ruby>出<rt>い</rt></ruby>でぬと', second: '<ruby>人<rt>ひと</rt></ruby>にはつげよ<br>あまのつり<ruby>舟<rt>ぶね</rt></ruby>', romaji: "watanohara yasoshimakakete kogiidenuto\nhitonihatsugeyo amanotsuribune", translation: "I have set out rowing across the vast sea, heading for the many islands far away. Tell the people back home." },
    12: { first: '<ruby>天<rt>あま</rt></ruby>つ<ruby>風<rt>かぜ</rt></ruby><br><ruby>雲<rt>くも</rt></ruby>のかよ<ruby>ひ<rt>い</rt></ruby><ruby>路<rt>じ</rt></ruby><br><ruby>吹<rt>ふ</rt></ruby>きと<ruby>ぢ<rt>じ</rt></ruby>よ', second: 'をとめの<ruby>姿<rt>すがた</rt></ruby><br>しばしとどめ<ruby>む<rt>ん</rt></ruby>', romaji: "amatsukaze kumonokayohiji fukitojiyo\notomenosugata shibashitodomemu", translation: "Heavenly wind, please close the path through the clouds! I want to keep the celestial maidens here a little longer." },
    13: { first: '<ruby>筑波嶺<rt>つくばね</rt></ruby>の<br><ruby>峰<rt>みね</rt></ruby>より<ruby>落<rt>お</rt></ruby>つる<br>みなの<ruby>川<rt>がわ</rt></ruby>', second: 'こひぞつもりて<br><ruby>淵<rt>ふち</rt></ruby>となりぬる', romaji: "tsukubaneno mineyoriotsuru minanogaha\nkohizotsumorite fuchitonarinuru", translation: "Just as the streams from the peak of Tsukuba flow down to fill the deep pools of the Mina River, so my love for you has gathered deep within me." },
    14: { first: '<ruby>陸奥<rt>みちのく</rt></ruby>の<br>しのぶも<ruby>ぢ<rt>じ</rt></ruby>ずり<br><ruby>誰<rt>たれ</rt></ruby>ゆ<ruby>ゑ<rt>え</rt></ruby>に', second: '<ruby>乱<rt>みだ</rt></ruby>れそめにし<br><ruby>我<rt>われ</rt></ruby>ならなくに', romaji: "michinokuno shinobumojizuri tareyueni\nmidaresomenishi warenaranakuni", translation: "For whose sake has my heart become as disordered as the tangled patterns of Shinobu-mojizuri cloth of Mutsu? It is certainly not my own doing." },
    15: { first: '<ruby>君<rt>きみ</rt></ruby>がため<br><ruby>春<rt>はる</rt></ruby>の<ruby>野<rt>の</rt></ruby>に<ruby>出<rt>い</rt></ruby>でて<br><ruby>若菜<rt>わかな</rt></ruby>つむ', second: 'わが<ruby>衣手<rt>ころもで</rt></ruby>に<br><ruby>雪<rt>ゆき</rt></ruby>は<ruby>降<rt>ふ</rt></ruby>りつつ', romaji: "kimigatame harunononiidete wakanatsumu\nwagakoromodeni yukihafuritsutsu", translation: "Going out into the spring fields to pick young greens for you — the snow falls on my sleeves." },
    16: { first: '<ruby>立<rt>た</rt></ruby>ち<ruby>別<rt>わか</rt></ruby>れ<br>いなばの<ruby>山<rt>やま</rt></ruby>の<br><ruby>峰<rt>みね</rt></ruby>に<ruby>生<rt>お</rt></ruby><ruby>ふ<rt>う</rt></ruby>る', second: 'まつとし<ruby>聞<rt>き</rt></ruby>かば<br><ruby>今<rt>いま</rt></ruby><ruby>帰<rt>かえ</rt></ruby>りこ<ruby>む<rt>ん</rt></ruby>', romaji: "tachiwakare inabanoyamano mineniofuru\nmatsutoshikikaba imakaherikomu", translation: "I am leaving for the province of Inaba, where the pines grow on the mountain peak. If I hear that you are waiting for me, I will come back right away." },
    17: { first: 'ちはやぶる<br><ruby>神代<rt>かみよ</rt></ruby>もきかず<br><ruby>竜田川<rt>たつたがわ</rt></ruby>', second: 'から<ruby>紅<rt>くれない</rt></ruby>に<br><ruby>水<rt>みず</rt></ruby>くくるとは', romaji: "chihayaburu kamiyomokikazu tatsutagaha\nkarakurenaini mizukukurutoha", translation: "Even the ancient gods never heard of this — the Tatsuta River, dyeing its waters a deep crimson with fallen maple leaves." },
    18: { first: '<ruby>住<rt>すみ</rt></ruby>の<ruby>江<rt>え</rt></ruby>の<br><ruby>岸<rt>きし</rt></ruby>による<ruby>波<rt>なみ</rt></ruby><br>よるさ<ruby>へ<rt>え</rt></ruby>や', second: '<ruby>夢<rt>ゆめ</rt></ruby>のかよひ<ruby>路<rt>じ</rt></ruby><br><ruby>人目<rt>ひとめ</rt></ruby>よくら<ruby>む<rt>ん</rt></ruby>', romaji: "suminoeno kishiniyorunami yorusaheya\nyumenokayohiji hitomeyokuramu", translation: "Even in my dreams, I find myself longing to go to you along the path of dreams — but do I hide from others' eyes even in the night?" },
    19: { first: '<ruby>難波潟<rt>なにわがた</rt></ruby><br>みじかき<ruby>葦<rt>あし</rt></ruby>の<br>ふしのまも', second: '<ruby>逢<rt>あ</rt></ruby><ruby>は<rt>わ</rt></ruby>でこの<ruby>世<rt>よ</rt></ruby>を<br><ruby>過<rt>す</rt></ruby>ぐしてよとや', romaji: "nanihagata mijikakiashino fushinomamo\nahadekonoyoo sugushiteyotoya", translation: "In this short life, even as brief as a joint of reed at Naniwa Bay, must I pass through this world without ever meeting you?" },
    20: { first: 'わびぬれば<br>いまはたおなじ<br><ruby>難波<rt>なにわ</rt></ruby>なる', second: 'みをつくしても<br><ruby>逢<rt>あ</rt></ruby><ruby>は<rt>わ</rt></ruby><ruby>む<rt>ん</rt></ruby>とぞ<ruby>思<rt>おも</rt></ruby><ruby>ふ<rt>う</rt></ruby>', romaji: "wabinureba imahataonaji nanihanaru\nmiotsukushitemo ahamutozoomofu", translation: "Since things have come to this, it no longer matters. Even if I must sacrifice everything, I still want to meet you." },
    21: { first: '<ruby>今<rt>いま</rt></ruby>こ<ruby>む<rt>ん</rt></ruby>と<br>い<ruby>ひ<rt>い</rt></ruby>しばかりに<br><ruby>長月<rt>ながつき</rt></ruby>の', second: '<ruby>有明<rt>ありあけ</rt></ruby>の<ruby>月<rt>つき</rt></ruby>を<br><ruby>待<rt>ま</rt></ruby>ち<ruby>出<rt>い</rt></ruby>でつるかな', romaji: "imakomuto ihishibakarini nagatsukino\nariakenotsukio machiidetsurukana", translation: "Just because you said \"I will come right away\" — I waited all night for you, watching the moon of the long autumn month until it set at dawn." },
    22: { first: '<ruby>吹<rt>ふ</rt></ruby>くからに<br><ruby>秋<rt>あき</rt></ruby>の<ruby>草木<rt>くさき</rt></ruby>の<br>しをるれば', second: 'むべ<ruby>山風<rt>やまかぜ</rt></ruby>を<br><ruby>嵐<rt>あらし</rt></ruby>とい<ruby>ふ<rt>う</rt></ruby>ら<ruby>む<rt>ん</rt></ruby>', romaji: "fukukarani akinokusakino shiorureba\nmubeyamakazeo arashitoifuramu", translation: "The moment the autumn wind blows, the grasses and trees wither. Now I understand why the mountain wind is called \"arashi\" — storm." },
    23: { first: '<ruby>月<rt>つき</rt></ruby>みれば<br>ちぢにものこそ<br><ruby>悲<rt>かな</rt></ruby>しけれ', second: 'わが<ruby>身<rt>み</rt></ruby><ruby>一<rt>ひと</rt></ruby>つの<br><ruby>秋<rt>あき</rt></ruby>にはあらねど', romaji: "tsukimireba chijinimonokoso kanashikere\nwagamihitotsuno akinihaaranedo", translation: "When I look at the moon, a thousand thoughts rise up and fill me with sadness. Yet this autumn is not mine alone." },
    24: { first: 'このたびは<br><ruby>幣<rt>ぬさ</rt></ruby>もとりあ<ruby>へ<rt>え</rt></ruby>ず<br><ruby>手向山<rt>たむけやま</rt></ruby>', second: 'もみぢのにしき<br><ruby>神<rt>かみ</rt></ruby>のまにまに', romaji: "konotabiha nusamotoriahezu tamukeyama\nmomijinonishiki kaminomanimani", translation: "This time I have no offerings ready, O Tamukeyama. Please, grant me safe passage — I leave it in the hands of the gods." },
    25: { first: '<ruby>名<rt>な</rt></ruby>にし<ruby>負<rt>お</rt></ruby>はば<br><ruby>逢坂山<rt>おうさかやま</rt></ruby>の<br>さねか<ruby>づ<rt>ず</rt></ruby>ら', second: '<ruby>人<rt>ひと</rt></ruby>にしられで<br>くるよしもがな', romaji: "nanishiohaba afusakayamano sanekazura\nhitonishirarede kuruyoshimogana", translation: "If the name of Ōsaka carries its meaning — then let me secretly follow the vine I draw toward me, and come to you unseen." },
    26: { first: '<ruby>小倉山<rt>おぐらやま</rt></ruby><br><ruby>峰<rt>みね</rt></ruby>のもみ<ruby>ぢ<rt>じ</rt></ruby><ruby>葉<rt>は</rt></ruby><br><ruby>心<rt>こころ</rt></ruby>あらば', second: '<ruby>今<rt>いま</rt></ruby>ひとたびの<br>みゆき<ruby>待<rt>ま</rt></ruby>たな<ruby>む<rt>ん</rt></ruby>', romaji: "ogurayama minenomomijiba kokoroaraba\nimahitotabino miyukimatanamu", translation: "O maple leaves of Ogura Mountain, if you have a heart — hold on a little longer, until the emperor's visit." },
    27: { first: 'みかの<ruby>原<rt>はら</rt></ruby><br>わきて<ruby>流<rt>なが</rt></ruby>るる<br>い<ruby>づ<rt>ず</rt></ruby>み<ruby>川<rt>がわ</rt></ruby>', second: 'いつ<ruby>見<rt>み</rt></ruby>きとてか<br><ruby>恋<rt>こい</rt></ruby>しかるら<ruby>む<rt>ん</rt></ruby>', romaji: "mikanohara wakitenagaruru izumigaha\nitsumikitoteka kohishikaruramu", translation: "Like the Izumi River that wells up and flows through Mika Plain — when did I first see you, that I should long for you so?" },
    28: { first: '<ruby>山里<rt>やまざと</rt></ruby>は<br><ruby>冬<rt>ふゆ</rt></ruby>ぞさびしさ<br>まさりける', second: '<ruby>人目<rt>ひとめ</rt></ruby>も<ruby>草<rt>くさ</rt></ruby>も<br>かれぬと<ruby>思<rt>おも</rt></ruby><ruby>へ<rt>え</rt></ruby>ば', romaji: "yamazatoha fuyuzosabishisa masarikeru\nhitomemokusamo karenutoomoheba", translation: "In a mountain village, loneliness deepens in winter. Not only people disappear — the grass too withers away." },
    29: { first: '<ruby>心当<rt>こころあ</rt></ruby>てに<br><ruby>折<rt>お</rt></ruby>らばや<ruby>折<rt>お</rt></ruby>ら<ruby>む<rt>ん</rt></ruby><br><ruby>初霜<rt>はつしも</rt></ruby>の', second: 'おきまど<ruby>は<rt>わ</rt></ruby>せる<br><ruby>白菊<rt>しらぎく</rt></ruby>の<ruby>花<rt>はな</rt></ruby>', romaji: "kokoroateni orabayaoramu hatsushimono\nokimadohaseru shiragikunohana", translation: "Shall I pick it or not? The white chrysanthemum lies hidden beneath the first frost, and I cannot tell them apart." },
    30: { first: '<ruby>有明<rt>ありあけ</rt></ruby>の<br>つれなく<ruby>見<rt>み</rt></ruby>えし<br><ruby>別<rt>わか</rt></ruby>れより', second: 'あかつきばかり<br><ruby>憂<rt>う</rt></ruby>きものはなし', romaji: "ariakeno tsurenakumieshi wakareyori\nakatsukibakari ukimonohanashi", translation: "Ever since that cold dawn when we parted, I have come to dread the break of day more than anything in the world." },
    31: { first: '<ruby>朝<rt>あさ</rt></ruby>ぼらけ<br><ruby>有明<rt>ありあけ</rt></ruby>の<ruby>月<rt>つき</rt></ruby>と<br><ruby>見<rt>み</rt></ruby>るまでに', second: '<ruby>吉野<rt>よしの</rt></ruby>の<ruby>里<rt>さと</rt></ruby>に<br><ruby>降<rt>ふ</rt></ruby>れる<ruby>白雪<rt>しらゆき</rt></ruby>', romaji: "asaborake ariakenotsukito mirumadeni\nyoshinonosatoni furerushirayuki", translation: "In the early morning light, the village of Yoshino is blanketed in white — it looks just like the pale glow of the dawn moon." },
    32: { first: '<ruby>山川<rt>やまがわ</rt></ruby>に<br><ruby>風<rt>かぜ</rt></ruby>のかけたる<br>しがらみは', second: '<ruby>流<rt>なが</rt></ruby>れもあ<ruby>へ<rt>え</rt></ruby>ぬ<br><ruby>紅葉<rt>もみじ</rt></ruby>なりけり', romaji: "yamagahani kazenokaketaru shigaramiha\nnagaremoahenu momijinarikeri", translation: "The weir of fallen maple leaves, caught by the mountain wind across the stream — the water cannot flow through." },
    33: { first: '<ruby>久方<rt>ひさかた</rt></ruby>の<br><ruby>光<rt>ひかり</rt></ruby>のどけき<br><ruby>春<rt>はる</rt></ruby>の<ruby>日<rt>ひ</rt></ruby>に', second: 'しづ<ruby>心<rt>こころ</rt></ruby>なく<br><ruby>花<rt>はな</rt></ruby>の<ruby>散<rt>ち</rt></ruby>るら<ruby>む<rt>ん</rt></ruby>', romaji: "hisakatano hikarinodokeki harunohini\nshizukokoronaku hananochiruramu", translation: "In the peaceful light of a spring day, why do the cherry blossoms scatter so restlessly?" },
    34: { first: '<ruby>誰<rt>たれ</rt></ruby>をかも<br><ruby>知<rt>し</rt></ruby>る<ruby>人<rt>ひと</rt></ruby>にせ<ruby>む<rt>ん</rt></ruby><br><ruby>高砂<rt>たかさご</rt></ruby>の', second: '<ruby>松<rt>まつ</rt></ruby>も<ruby>昔<rt>むかし</rt></ruby>の<br><ruby>友<rt>とも</rt></ruby>ならなくに', romaji: "tareokamo shiruhitonisemu takasagono\nmatsumomukashino tomonaranakuni", translation: "Who can I call a true friend now? Even the old pine of Takasago knew the friends of long ago no longer." },
    35: { first: '<ruby>人<rt>ひと</rt></ruby>はいさ<br><ruby>心<rt>こころ</rt></ruby>も<ruby>知<rt>し</rt></ruby>らず<br>ふるさとは', second: '<ruby>花<rt>はな</rt></ruby>ぞ<ruby>昔<rt>むかし</rt></ruby>の<br><ruby>香<rt>か</rt></ruby>に<ruby>匂<rt>にお</rt></ruby><ruby>ひ<rt>い</rt></ruby>ける', romaji: "hitohaisa kokoromoshirazu furusatoha\nhanazomukashino kaninihohikeru", translation: "I cannot know what is in your heart. But here in the old village, the plum blossoms still carry the same fragrance as before." },
    36: { first: '<ruby>夏<rt>なつ</rt></ruby>の<ruby>夜<rt>よ</rt></ruby>は<br>まだ<ruby>宵<rt>よい</rt></ruby>ながら<br>あけぬるを', second: '<ruby>雲<rt>くも</rt></ruby>のいづこに<br><ruby>月<rt>つき</rt></ruby>やどるら<ruby>む<rt>ん</rt></ruby>', romaji: "natsunoyoha madayohinagara akenuruo\nkumonoizukoni tsukiyadoruramu", translation: "On a summer night, the day has already dawned while it still feels like early evening. Where in the clouds is the moon hiding?" },
    37: { first: '<ruby>白露<rt>しらつゆ</rt></ruby>に<br><ruby>風<rt>かぜ</rt></ruby>の<ruby>吹<rt>ふ</rt></ruby>きしく<br><ruby>秋<rt>あき</rt></ruby>の<ruby>野<rt>の</rt></ruby>は', second: 'つらぬきとめぬ<br><ruby>玉<rt>たま</rt></ruby>ぞ<ruby>散<rt>ち</rt></ruby>りける', romaji: "shiratsuyuni kazenofukishiku akinonoha\ntsuranukitomenu tamazochirikeru", translation: "In the autumn fields lashed by the wind and dew, the scattered drops look like beads of jade that cannot be strung together." },
    38: { first: '<ruby>忘<rt>わす</rt></ruby>らるる<br><ruby>身<rt>み</rt></ruby>をば<ruby>思<rt>おも</rt></ruby>はず<br><ruby>誓<rt>ちか</rt></ruby>ひてし', second: '<ruby>人<rt>ひと</rt></ruby>の<ruby>命<rt>いのち</rt></ruby>の<br><ruby>惜<rt>お</rt></ruby>しくもあるかな', romaji: "wasuraruru miobaomohazu chikahiteshi\nhitonoinochino oshikumoarukana", translation: "I do not grieve for myself, though I am forgotten. But I worry for you — you who swore an oath. What will become of you?" },
    39: { first: '<ruby>浅茅生<rt>あさじう</rt></ruby>の<br><ruby>小野<rt>おの</rt></ruby>の<ruby>篠原<rt>しのはら</rt></ruby><br>しのぶれど', second: 'あまりてなどか<br><ruby>人<rt>ひと</rt></ruby>の<ruby>恋<rt>こい</rt></ruby>しき', romaji: "asajifuno ononoshinohara shinoburedo\namaritenadoka hitonokohishiki", translation: "Though I try to hide it, my longing spills over. Why is it that I cannot stop thinking of that person?" },
    40: { first: '<ruby>忍<rt>しの</rt></ruby>ぶれど<br><ruby>色<rt>いろ</rt></ruby>に<ruby>出<rt>い</rt></ruby>でにけり<br><ruby>我<rt>わ</rt></ruby>が<ruby>恋<rt>こい</rt></ruby>は', second: '<ruby>物<rt>もの</rt></ruby>や<ruby>思<rt>おも</rt></ruby>ふと<br><ruby>人<rt>ひと</rt></ruby>の<ruby>問<rt>と</rt></ruby><ruby>ふ<rt>う</rt></ruby>まで', romaji: "shinoburedo ironiidenikeri wagakohiha\nmonoyaomofuto hitonotofumade", translation: "Though I tried to keep it secret, my love showed itself on my face — to the point where people asked if something was on my mind." },
    41: { first: '<ruby>恋<rt>こい</rt></ruby>す<ruby>てふ<rt>ちょう</rt></ruby><br><ruby>我<rt>わ</rt></ruby>が<ruby>名<rt>な</rt></ruby>はまだき<br><ruby>立<rt>た</rt></ruby>ちにけり', second: '<ruby>人<rt>ひと</rt></ruby>しれずこそ<br><ruby>思<rt>おも</rt></ruby><ruby>ひ<rt>い</rt></ruby>そめしか', romaji: "kohisutefu waganahamadaki tachinikeri\nhitoshirezukoso omohisomeshika", translation: "They say my name as a lover is already known far and wide, even before the affair began. I had kept it so quietly in my heart." },
    42: { first: '<ruby>契<rt>ちぎ</rt></ruby>りきな<br>かたみに<ruby>袖<rt>そで</rt></ruby>を<br>しぼりつつ', second: '<ruby>末<rt>すえ</rt></ruby>の<ruby>松山<rt>まつやま</rt></ruby><br><ruby>波<rt>なみ</rt></ruby>こさじとは', romaji: "chigirikina kataminisodeo shiboritsutsu\nsuenomatsuyama namikosajitoha", translation: "We promised each other, wringing out our tear-soaked sleeves, that our love would last forever, never to be swept away like the waves beyond Suenomatsu." },
    43: { first: '<ruby>逢<rt>あ</rt></ruby><ruby>ひ<rt>い</rt></ruby><ruby>見<rt>み</rt></ruby>ての<br>のちの<ruby>心<rt>こころ</rt></ruby>に<br>くらぶれば', second: '<ruby>昔<rt>むかし</rt></ruby>は<ruby>物<rt>もの</rt></ruby>を<br><ruby>思<rt>おも</rt></ruby><ruby>は<rt>わ</rt></ruby>ざりけり', romaji: "ahimiteno nochinokokoroni kurabureba\nmukashihamonoo omohazarikeri", translation: "Compared to this feeling after meeting you, the longing I felt before seems like nothing at all." },
    44: { first: '<ruby>逢<rt>あ</rt></ruby><ruby>ふ<rt>う</rt></ruby>ことの<br><ruby>絶<rt>た</rt></ruby>えてしなくは<br>なかなかに', second: '<ruby>人<rt>ひと</rt></ruby>をも<ruby>身<rt>み</rt></ruby>をも<br><ruby>恨<rt>うら</rt></ruby>みざらまし', romaji: "afukotono taeteshinakuha nakanakani\nhitoomomiomo uramizaramashi", translation: "If there were no meetings at all, I would not have to suffer. It is because we meet that parting brings such pain." },
    45: { first: 'あ<ruby>は<rt>わ</rt></ruby>れとも<br>い<ruby>ふ<rt>う</rt></ruby>べき人は<br><ruby>思<rt>おも</rt></ruby><ruby>ほ<rt>お</rt></ruby>えで', second: '<ruby>身<rt>み</rt></ruby>のいた<ruby>づ<rt>ず</rt></ruby>らに<br>なりぬべきかな', romaji: "aharetomo ifubekihitoha omohoede\nminoitazurani narinubekikana", translation: "There is no one who might show even a little compassion. I feel as though my life will simply fade away, just like that." },
    46: { first: '<ruby>由良<rt>ゆら</rt></ruby>のとを<br><ruby>渡<rt>わた</rt></ruby>る<ruby>舟人<rt>ふなびと</rt></ruby><br>か<ruby>ぢ<rt>じ</rt></ruby>を<ruby>絶<rt>た</rt></ruby>え', second: 'ゆくへも<ruby>知<rt>し</rt></ruby>らぬ<br><ruby>恋<rt>こい</rt></ruby>の<ruby>道<rt>みち</rt></ruby>かな', romaji: "yuranotoo watarufunabito kajiotae\nyukuhemoshiranu kohinomichikana", translation: "Like a boatman who has lost his oar on the swift straits of Yura — I drift, not knowing where my love is taking me." },
    47: { first: '<ruby>八重葎<rt>やえむぐら</rt></ruby><br>しげれる<ruby>宿<rt>やど</rt></ruby>の<br>さびしきに', second: '<ruby>人<rt>ひと</rt></ruby>こそ<ruby>見<rt>み</rt></ruby>えね<br><ruby>秋<rt>あき</rt></ruby>は<ruby>来<rt>き</rt></ruby>にけり', romaji: "yahemugura shigereruyadono sabishikini\nhitokosomiene akihakinikeri", translation: "Weeds grow thick around the deserted house. No one comes to visit. And yet — autumn has arrived." },
    48: { first: '<ruby>風<rt>かぜ</rt></ruby>をいたみ<br><ruby>岩<rt>いわ</rt></ruby>うつ<ruby>波<rt>なみ</rt></ruby>の<br>おのれのみ', second: 'くだけて<ruby>物<rt>もの</rt></ruby>を<br><ruby>思<rt>おも</rt></ruby><ruby>ふ<rt>う</rt></ruby>ころかな', romaji: "kazeoitami ihautsunamino onorenomi\nkudaketemonoo omofukorokana", translation: "Like the waves crashing against the rocks in the fierce wind, I alone am broken to pieces by this sorrow." },
    49: { first: '<ruby>御垣守<rt>みかきもり</rt></ruby><br><ruby>衛士<rt>えじ</rt></ruby>のたく<ruby>火<rt>ひ</rt></ruby>の<br><ruby>夜<rt>よる</rt></ruby>はもえ', second: '<ruby>昼<rt>ひる</rt></ruby>は<ruby>消<rt>き</rt></ruby>えつつ<br><ruby>物<rt>もの</rt></ruby>をこそ<ruby>思<rt>おも</rt></ruby><ruby>へ<rt>え</rt></ruby>', romaji: "mikakimori ejinotakuhino yoruhamoe\nhiruhakietsutsu monookosoomohe", translation: "Like the fire tended by the palace guards, I burn at night and fade in the day — lost in endless longing." },
    50: { first: '<ruby>君<rt>きみ</rt></ruby>がため<br><ruby>惜<rt>お</rt></ruby>しからざりし<br>いのちさ<ruby>へ<rt>え</rt></ruby>', second: '<ruby>長<rt>なが</rt></ruby>くもがなと<br><ruby>思<rt>おも</rt></ruby><ruby>ひ<rt>い</rt></ruby>けるかな', romaji: "kimigatame oshikarazarishi inochisahe\nnagakumoganato omohikerukana", translation: "A life I once did not mind losing — now, for your sake, I wish it would last forever." },
    51: { first: 'かくとだに<br>えやはいぶきの<br>さしも<ruby>草<rt>ぐさ</rt></ruby>', second: 'さしも<ruby>知<rt>し</rt></ruby>らじな<br>もゆる<ruby>思<rt>おも</rt></ruby><ruby>ひ<rt>い</rt></ruby>を', romaji: "kakutodani eyahaibukino sashimogusa\nsashimoshirajina moyuruomohio", translation: "I cannot even tell you how I feel — like the smoldering fire of ibuki wormwood, my hidden love quietly burns." },
    52: { first: '明けぬれば<br><ruby>暮<rt>く</rt></ruby>るるものとは<br><ruby>知<rt>く</rt></ruby>りながら', second: 'な<ruby>ほ<rt>お</rt></ruby>うらめしき<br><ruby>朝<rt>あさ</rt></ruby>ぼらけかな', romaji: "akenureba kururumonotoha shirinagara\nnahourameshiki asaborakekana", translation: "I know that after dawn comes dusk — and yet how I resent this pale morning sky." },
    53: { first: '<ruby>嘆<rt>なげ</rt></ruby>きつつ<br>ひとり<ruby>寝<rt>ぬ</rt></ruby>る<ruby>夜<rt>よ</rt></ruby>の<br><ruby>明<rt>あ</rt></ruby>くる<ruby>間<rt>ま</rt></ruby>は', second: 'いかに<ruby>久<rt>ひさ</rt></ruby>しき<br>ものとかは<ruby>知<rt>し</rt></ruby>る', romaji: "nagekitsutsu hitorinuruyono akurumaha\nikanihisashiki monotokahashiru", translation: "Lying alone, waiting for the long night to end — how endless it feels. Does the person who left me even know?" },
    54: { first: '<ruby>忘<rt>わす</rt></ruby>れじの<br>ゆく<ruby>末<rt>すえ</rt></ruby>までは<br>かたければ', second: '<ruby>今日<rt>きょう</rt></ruby>を<ruby>限<rt>かぎ</rt></ruby>りの<br><ruby>命<rt>いのち</rt></ruby>ともがな', romaji: "wasurejino yukusuemadeha katakereba\nkefuokagirino inochitomogana", translation: "The promise that you would never forget me — that is too much to ask forever. I only wish my life would end today, while the vow still holds." },
    55: { first: '<ruby>滝<rt>たき</rt></ruby>の<ruby>音<rt>おと</rt></ruby>は<br>たえて<ruby>久<rt>ひさ</rt></ruby>しく<br>なりぬれど', second: '<ruby>名<rt>な</rt></ruby>こそ<ruby>流<rt>なが</rt></ruby>れて<br>な<ruby>ほ<rt>お</rt></ruby><ruby>聞<rt>き</rt></ruby>こえけれ', romaji: "takinootoha taetehisashiku narinuredo\nnakosonagarete nahokikoekere", translation: "The sound of the waterfall has long since faded, but its name flows on and is still heard by the world." },
    56: { first: 'あらざら<ruby>む<rt>ん</rt></ruby><br>この<ruby>世<rt>よ</rt></ruby>のほかの<br><ruby>思<rt>おも</rt></ruby><ruby>ひ<rt>い</rt></ruby><ruby>出<rt>で</rt></ruby>に', second: 'いまひとたびの<br><ruby>逢<rt>お</rt></ruby><ruby>ふ<rt>う</rt></ruby>こともがな', romaji: "arazaramu konoyonohokano omohideni\nimahitotabino afukotomogana", translation: "I may not be long for this world. As a memory to take beyond — let me meet you just one more time." },
    57: { first: 'めぐり<ruby>逢<rt>あ</rt></ruby><ruby>ひ<rt>い</rt></ruby>て<br><ruby>見<rt>み</rt></ruby>しやそれとも<br>わかぬ<ruby>間<rt>ま</rt></ruby>に', second: '<ruby>雲隠<rt>くもがく</rt></ruby>れにし<br><ruby>夜半<rt>よわ</rt></ruby>の<ruby>月<rt>つき</rt></ruby>かな', romaji: "meguriahite mishiyasoretomo wakanumani\nkumogakurenishi yohanotsukikana", translation: "We met for just a moment, yet I could not be sure it was really you — and then you vanished behind the clouds, like the midnight moon." },
    58: { first: 'ありま<ruby>山<rt>やま</rt></ruby><br><ruby>猪名<rt>いな</rt></ruby>の<ruby>笹原<rt>ささはら</rt></ruby><br><ruby>風<rt>かぜ</rt></ruby><ruby>吹<rt>ふ</rt></ruby>けば', second: 'いでそよ<ruby>人<rt>ひと</rt></ruby>を<br><ruby>忘<rt>わす</rt></ruby>れやはする', romaji: "arimayama inanosasahara kazefukeba\nidesoyohitoo wasureyahasuru", translation: "When the wind blows through the bamboo groves of Arima and Ina — of course I have not forgotten you." },
    59: { first: 'やすら<ruby>は<rt>わ</rt></ruby>で<br><ruby>寝<rt>ね</rt></ruby>なましものを<br><ruby>小夜<rt>さよ</rt></ruby><ruby>更<rt>ふ</rt></ruby>けて', second: 'かたぶくまでの<br><ruby>月<rt>つき</rt></ruby>を<ruby>見<rt>み</rt></ruby>しかな', romaji: "yasurahade nenamashimonoo sayofukete\nkatabukumadeno tsukiomishikana", translation: "I waited and waited without sleep, watching the moon sink slowly toward the horizon in the deepening night. How I regret it." },
    60: { first: '<ruby>大江山<rt>おおえやま</rt></ruby><br>いく<ruby>野<rt>の</rt></ruby>の<ruby>道<rt>みち</rt></ruby>の<br><ruby>遠<rt>とお</rt></ruby>ければ', second: 'まだふみもみず<br><ruby>天<rt>あま</rt></ruby>の<ruby>橋立<rt>はしだて</rt></ruby>', romaji: "ohoeyama ikunonomichino tohokereba\nmadafumimomizu amanohashidate", translation: "The road to Oe Mountain and Ikuno is so long and far — I have not yet set foot on it, nor received a letter from my mother." },
    61: { first: 'いにし<ruby>へ<rt>え</rt></ruby>の<br><ruby>奈良<rt>なら</rt></ruby>の<ruby>都<rt>みやこ</rt></ruby>の<br><ruby>八重桜<rt>やえざくら</rt></ruby>', second: '<ruby>けふ<rt>きょう</rt></ruby><ruby>九重<rt>ここのえ</rt></ruby>に<br><ruby>匂<rt>にお</rt></ruby><ruby>ひ<rt>い</rt></ruby>ぬるかな', romaji: "inishiheno naranomiyakono yahezakura\nkefukokonoheni nihohinurukana", translation: "The ancient eightfold cherry blossoms of Nara — today they bloom gloriously in the ninefold imperial palace." },
    62: { first: '<ruby>夜<rt>よ</rt></ruby>をこめて<br><ruby>鳥<rt>とり</rt></ruby>のそらねは<br>はかるとも', second: 'よに<ruby>逢坂<rt>おうさか</rt></ruby>の<br><ruby>関<rt>せき</rt></ruby>は<ruby>許<rt>ゆる</rt></ruby>さじ', romaji: "yookomete torinosoraneha hakarutomo\nyoniafusakano sekihayurusaji", translation: "Even if you try to fool me with a crowing rooster in the night — I will not open the Barrier of Ōsaka for you." },
    63: { first: 'いまはただ<br><ruby>思<rt>おも</rt></ruby>ひ<ruby>絶<rt>た</rt></ruby>えな<ruby>む<rt>ん</rt></ruby><br>とばかりを', second: '<ruby>人<rt>ひと</rt></ruby>づてならで<br><ruby>言<rt>い</rt></ruby><ruby>ふ<rt>う</rt></ruby>よしもがな', romaji: "imahatada omohitaenamu tobakario\nhitozutenarade ifuyoshimogana", translation: "If only I could say it directly: all I want is to end this love. But there is no way to tell you in person." },
    64: { first: '<ruby>朝<rt>あさ</rt></ruby>ぼらけ<br><ruby>宇治<rt>うじ</rt></ruby>の<ruby>川霧<rt>かわぎり</rt></ruby><br><ruby>絶<rt>た</rt></ruby>え<ruby>絶<rt>だ</rt></ruby>えに', second: 'あら<ruby>は<rt>わ</rt></ruby>れわたる<br><ruby>瀬々<rt>せぜ</rt></ruby>の<ruby>網代木<rt>あじろぎ</rt></ruby>', romaji: "asaborake ujinokahagiri taedaeni\naraharewataru sezenoajirogi", translation: "In the early dawn mist over the Uji River, here and there the wooden stakes of fish weirs begin to appear through the haze." },
    65: { first: '<ruby>恨<rt>うら</rt></ruby>みわび<br>ほさぬ<ruby>袖<rt>そで</rt></ruby>だに<br>あるものを', second: '<ruby>恋<rt>こい</rt></ruby>にくちな<ruby>む<rt>ん</rt></ruby><br><ruby>名<rt>な</rt></ruby>こそをしけれ', romaji: "uramiwabi hosanusodedani arumonoo\nkohinikuchinamu nakosooshikere", translation: "My sleeves are never dry — and I grieve not for myself, but that my name as a lover will be ruined before it is known." },
    66: { first: 'もろともに<br>あ<ruby>は<rt>わ</rt></ruby>れと<ruby>思<rt>おも</rt></ruby><ruby>へ<rt>え</rt></ruby><br><ruby>山桜<rt>やまざくら</rt></ruby>', second: '<ruby>花<rt>はな</rt></ruby>よりほかに<br><ruby>知<rt>し</rt></ruby>る<ruby>人<rt>ひと</rt></ruby>もなし', romaji: "morotomoni aharetoomohe yamazakura\nhanayorihokani shiruhitomonashi", translation: "O mountain cherry — feel moved together with me. There is no one else here who knows me but you." },
    67: { first: '<ruby>春<rt>はる</rt></ruby>の<ruby>夜<rt>よ</rt></ruby>の<br><ruby>夢<rt>ゆめ</rt></ruby>ばかりなる<br><ruby>手枕<rt>たまくら</rt></ruby>に', second: 'か<ruby>ひ<rt>い</rt></ruby>なく<ruby>立<rt>た</rt></ruby>た<ruby>む<rt>ん</rt></ruby><br><ruby>名<rt>な</rt></ruby>こそをしけれ', romaji: "harunoyono yumebakarinaru tamakurani\nkahinakutatamu nakosooshikere", translation: "In the spring night, resting my head on an arm for just a brief dream — how I grieve that my name might spread for such a fleeting thing." },
    68: { first: '<ruby>心<rt>こころ</rt></ruby>にも<br>あらで<ruby>憂<rt>う</rt></ruby>き<ruby>世<rt>よ</rt></ruby>に<br>ながら<ruby>へ<rt>え</rt></ruby>ば', second: '<ruby>恋<rt>こい</rt></ruby>しかるべき<br><ruby>夜半<rt>よわ</rt></ruby>の<ruby>月<rt>つき</rt></ruby>かな', romaji: "kokoronimo aradeukiyoni nagaraheba\nkohishikarubeki yohanotsukikana", translation: "If I live on in this painful world without purpose, I am sure I will come to miss this night and its lonely moon." },
    69: { first: '<ruby>嵐<rt>あらし</rt></ruby><ruby>吹<rt>ふ</rt></ruby>く<br><ruby>三室<rt>みむろ</rt></ruby>の<ruby>山<rt>やま</rt></ruby>の<br><ruby>紅葉<rt>もみじ</rt></ruby><ruby>葉<rt>ば</rt></ruby>は', second: '<ruby>竜田<rt>たつた</rt></ruby>の<ruby>川<rt>かわ</rt></ruby>の<br><ruby>錦<rt>にしき</rt></ruby>なりけり', romaji: "arashifuku mimuronoyamano momijibaha\ntatsutanokahano nishikinarikeri", translation: "The storm blows through Mimuro Mountain, and the scattered maple leaves become a brocade on the Tatsuta River." },
    70: { first: 'さびしさに<br><ruby>宿<rt>やど</rt></ruby>を<ruby>立<rt>た</rt></ruby>ち<ruby>出<rt>い</rt></ruby>でて<br>ながむれば', second: 'い<ruby>づ<rt>ず</rt></ruby>くも<ruby>同<rt>おな</rt></ruby>じ<br><ruby>秋<rt>あき</rt></ruby>の<ruby>夕<rt>ゆう</rt></ruby><ruby>暮<rt>ぐれ</rt></ruby>', romaji: "sabishisani yadootachiidete nagamureba\nizukumoonaji akinoyufugure", translation: "Feeling lonely, I stepped outside to gaze at the view — and everywhere I looked, it was the same twilight of autumn." },
    71: { first: '<ruby>夕<rt>ゆう</rt></ruby>されば<br><ruby>門田<rt>かどた</rt></ruby>の<ruby>稲葉<rt>いなば</rt></ruby><br>おと<ruby>づ<rt>ず</rt></ruby>れて', second: '<ruby>蘆<rt>あし</rt></ruby>のまろやに<br><ruby>秋風<rt>あきかぜ</rt></ruby>ぞ<ruby>吹<rt>ふ</rt></ruby>く', romaji: "yufusareba kadotanoinaba otozurete\nashinomaroyani akikazezofuku", translation: "As evening falls, the breeze comes rustling through the rice stalks by the gate, and the autumn wind blows through the reed-thatched hut." },
    72: { first: '<ruby>音<rt>おと</rt></ruby>に<ruby>聞<rt>き</rt></ruby>く<br><ruby>高師<rt>たかし</rt></ruby>の<ruby>浜<rt>はま</rt></ruby>の<br>あだ<ruby>波<rt>なみ</rt></ruby>は', second: 'かけじや<ruby>袖<rt>そで</rt></ruby>の<br>ぬれもこそすれ', romaji: "otonikiku takashinohamano adanamiha\nkakejiyasodeno nuremokososure", translation: "I have heard how fickle the waves at Takashi Beach are. I will not let them wet my sleeves — I will keep my heart guarded." },
    73: { first: '<ruby>高砂<rt>たかさご</rt></ruby>の<br><ruby>尾<rt>お</rt></ruby>の<ruby>上<rt>へ</rt></ruby>の<ruby>桜<rt>さくら</rt></ruby><br><ruby>咲<rt>さ</rt></ruby>きにけり', second: '<ruby>外山<rt>とやま</rt></ruby>の<ruby>霞<rt>かすみ</rt></ruby><br><ruby>立<rt>た</rt></ruby>たずもあらな<ruby>む<rt>ん</rt></ruby>', romaji: "takasagono onohenosakura sakinikeri\ntoyamanokasumi tatazumoaranamu", translation: "The cherry blossoms on the high peaks of Takasago have already bloomed. Let the mist not rise over the foothills and hide them from view." },
    74: { first: '<ruby>憂<rt>う</rt></ruby>かりける<br><ruby>人<rt>ひと</rt></ruby>を<ruby>初瀬<rt>はつせ</rt></ruby>の<br><ruby>山<rt>やま</rt></ruby>おろしよ', second: 'はげしかれとは<br><ruby>祈<rt>いの</rt></ruby>らぬものを', romaji: "ukarikeru hitoohatsuseno yamaoroshiyo\nhageshikaretoha inoranumonoo", translation: "I prayed to the storm wind of Hatsuse — but I never prayed for it to grow fiercer. Why has this person become so cold to me?" },
    75: { first: '<ruby>契<rt>ちぎ</rt></ruby>りおきし<br>させもが<ruby>露<rt>つゆ</rt></ruby>を<br>いのちにて', second: 'あ<ruby>は<rt>わ</rt></ruby>れ<ruby>今年<rt>ことし</rt></ruby>の<br><ruby>秋<rt>あき</rt></ruby>もいぬめり', romaji: "chigiriokishi sasemogatsuyuo inochinite\naharekotoshino akimoinumeri", translation: "You promised me, and I staked my life on it like the morning dew on the wormwood. But another autumn is passing, alas." },
    76: { first: 'わたの<ruby>原<rt>はら</rt></ruby><br>こぎいでてみれば<br><ruby>久方<rt>ひさかた</rt></ruby>の', second: '<ruby>雲<rt>くも</rt></ruby><ruby>居<rt>い</rt></ruby>にま<ruby>が<rt>ご</rt></ruby><ruby>ふ<rt>う</rt></ruby><br><ruby>沖<rt>おき</rt></ruby>つ<ruby>白波<rt>しらなみ</rt></ruby>', romaji: "watanohara kogiidetemireba hisakatano\nkumoinimagafu okitsushiranami", translation: "Rowing out onto the open sea and looking around — the white waves far off on the water seem to blur into the clouds." },
    77: { first: '<ruby>瀬<rt>せ</rt></ruby>をはやみ<br><ruby>岩<rt>いわ</rt></ruby>にせかるる<br><ruby>滝川<rt>たきがわ</rt></ruby>の', second: 'われても<ruby>末<rt>すえ</rt></ruby>に<br>あ<ruby>は<rt>わ</rt></ruby><ruby>む<rt>ん</rt></ruby>とぞ<ruby>思<rt>おも</rt></ruby><ruby>ふ<rt>う</rt></ruby>', romaji: "seohayami ihanisekaruru takigahano\nwaretemosueni ahamutozoomofu", translation: "Like the river that is split by rocks and flows apart — though we are separated now, I believe we will meet again in the end." },
    78: { first: '<ruby>淡路島<rt>あわじしま</rt></ruby><br>かよ<ruby>ふ<rt>う</rt></ruby><ruby>千鳥<rt>ちどり</rt></ruby>の<br><ruby>鳴<rt>な</rt></ruby>く<ruby>声<rt>こえ</rt></ruby>に', second: '<ruby>幾夜<rt></rt></ruby><ruby>寝覚<rt>ねざ</rt></ruby>めぬ<br><ruby>須磨<rt>すま</rt></ruby>の<ruby>関守<rt>せきもり</rt></ruby>', romaji: "ahajishima kayofuchidorino nakukoeni\nikuyonezamenu sumanosekimori", translation: "The cry of the plovers flying between Awaji Island — how many nights have I lain awake listening to them at the Suma Barrier?" },
    79: { first: '<ruby>秋風<rt>あきかぜ</rt></ruby>に<br>たなびく<ruby>雲<rt>くも</rt></ruby>の<br>たえ<ruby>間<rt>ま</rt></ruby>より', second: 'もれい<ruby>づ<rt>ず</rt></ruby>る<ruby>月<rt>つき</rt></ruby>の<br><ruby>影<rt>かげ</rt></ruby>のさやけさ', romaji: "akikazeni tanabikukumono taemayori\nmoreizurutsukino kagenosayakesa", translation: "Through the gaps in the clouds trailing in the autumn wind, the moonlight filters through, so clear and still." },
    80: { first: '<ruby>長<rt>なが</rt></ruby>から<ruby>む<rt>ん</rt></ruby><br><ruby>心<rt>こころ</rt></ruby>もしらず<br><ruby>黒髪<rt>くろがみ</rt></ruby>の', second: 'みだれてけさは<br><ruby>物<rt>もの</rt></ruby>をこそ<ruby>思<rt>おも</rt></ruby><ruby>へ<rt>え</rt></ruby>', romaji: "nagakaramu kokoromoshirazu kurokamino\nmidaretekesaha monookosoomohe", translation: "Not knowing whether your heart will last — I woke this morning with my long black hair in tangles, lost in thought." },
    81: { first: 'ほととぎす<br><ruby>鳴<rt>な</rt></ruby>きつる<ruby>方<rt>かた </rt></ruby>を<br>ながむれば', second: 'ただ<ruby>有明<rt>ありあけ</rt></ruby>の<br><ruby>月<rt>つき</rt></ruby>ぞ<ruby>残<rt>のこ</rt></ruby>れる', romaji: "hototogisu nakitsurukatao nagamureba\ntadaariakeno tsukizonokoreru", translation: "I looked toward where the cuckoo had just called — and all that remained was the pale moon at dawn." },
    82: { first: '<ruby>思<rt>おも</rt></ruby><ruby>ひ<rt>い</rt></ruby>わび<br>さても<ruby>命<rt>いのち</rt></ruby>は<br>あるものを', second: '<ruby>憂<rt>う</rt></ruby>きにた<ruby>へ<rt>え</rt></ruby>ぬは<br><ruby>涙<rt>なみだ</rt></ruby>なりけり', romaji: "omohiwabi satemoinochiha arumonoo\nukinitahenuha namidanarikeri", translation: "I am exhausted with sorrow, yet somehow I am still alive. What cannot endure is not my life — but my tears." },
    83: { first: '<ruby>世<rt>よ</rt></ruby>の<ruby>中<rt>なか</rt></ruby>よ<br><ruby>道<rt>みち</rt></ruby>こそなけれ<br><ruby>思<rt>おも</rt></ruby><ruby>ひ<rt>い</rt></ruby><ruby>入<rt>い</rt></ruby>る', second: '<ruby>山<rt>やま</rt></ruby>の<ruby>奥<rt>おく</rt></ruby>にも<br><ruby>鹿<rt>しか</rt></ruby>ぞ<ruby>鳴<rt>な</rt></ruby>くなる', romaji: "yononakayo michikosonakere omohiiru\nyamanookunimo shikazonakunaru", translation: "There is no escape from this world. Even deep in the mountains, the deer cry out." },
    84: { first: '<ruby>長<rt>なが</rt></ruby>ら<ruby>へ<rt>え</rt></ruby>ば<br>またこのごろや<br>しのばれ<ruby>む<rt>ん</rt></ruby>', second: '<ruby>憂<rt>う</rt></ruby>しと<ruby>見<rt>み</rt></ruby>し<ruby>世<rt>よ</rt></ruby>ぞ<br><ruby>今<rt>いま</rt></ruby>は<ruby>恋<rt>こい</rt></ruby>しき', romaji: "nagaraheba matakonogoroya shinobaremu\nushitomishiyozo imahakohishiki", translation: "If I live on long enough, perhaps even these painful days will become dear to me, as something I once longed to leave behind." },
    85: { first: '<ruby>夜<rt>よ</rt></ruby>もすがら<br><ruby>物<rt>もの</rt></ruby><ruby>思<rt>おも</rt></ruby><ruby>ふ<rt>う</rt></ruby>ころは<br><ruby>明<rt>あ</rt></ruby>けやらで', second: '<ruby>閨<rt>ねや</rt></ruby>のひまさ<ruby>へ<rt>え</rt></ruby><br>つれなかりけり', romaji: "yomosugara monoomofukoroha akeyarade\nneyanohimasahe tsurenakarikeri", translation: "All through the night, lost in thought, the dawn will not come. Even the crack of light through the bedroom door seems cold and distant." },
    86: { first: '<ruby>嘆<rt>なげ</rt></ruby>けとて<br><ruby>月<rt>つき</rt></ruby>やは<ruby>物<rt>もの</rt></ruby>を<br><ruby>思<rt>おも</rt></ruby><ruby>は<rt>わ</rt></ruby>する', second: 'かこち<ruby>顔<rt>がお</rt></ruby>なる<br>わが<ruby>涙<rt>なみだ</rt></ruby>かな', romaji: "nageketote tsukiyahamonoo omohasuru\nkakochigahonaru waganamidakana", translation: "Did the moon ask me to grieve? These tears on my face — it is as if I am blaming the moon for making me feel this way." },
    87: { first: '<ruby>村雨<rt>むらさめ</rt></ruby>の<br><ruby>露<rt>つゆ</rt></ruby>もまだひぬ<br>まきの<ruby>葉<rt>は</rt></ruby>に', second: '<ruby>霧<rt>きり</rt></ruby>たちのぼる<br><ruby>秋<rt>あき</rt></ruby>の<ruby>夕<rt>ゆう</rt></ruby><ruby>暮<rt>ぐれ</rt></ruby>', romaji: "murasameno tsuyumomadahinu makinohani\nkiritachinoboru akinoyufugure", translation: "After the passing shower, the mist rises slowly through the rain-drenched leaves of the cedar. An autumn evening." },
    88: { first: '<ruby>難波江<rt>なにわえ</rt></ruby>の<br><ruby>葦<rt>あし</rt></ruby>のかりねの<br>ひとよゆ<ruby>ゑ<rt>え</rt></ruby>', second: 'みをつくしてや<br><ruby>恋<rt>こ</rt></ruby><ruby>ひ<rt>い</rt></ruby>わたるべき', romaji: "nanihaeno ashinokarineno hitoyoyue\nmiotsukushiteya kohiwatarubeki", translation: "For just one brief night together, like the cut end of a reed at Naniwa — must I go on longing for you forever?" },
    89: { first: '<ruby>玉<rt>たま</rt></ruby>の<ruby>緒<rt>お</rt></ruby>よ<br><ruby>絶<rt>た</rt></ruby>えなば<ruby>絶<rt>た</rt></ruby>えね<br>ながら<ruby>へ<rt>え</rt></ruby>ば', second: '<ruby>忍<rt>しの</rt></ruby>ぶることの<br><ruby>弱<rt>よわ</rt></ruby>りもぞする', romaji: "tamanooyo taenabataene nagaraheba\nshinoburukotono yowarimozosuru", translation: "Let my life end now, if it must. For if I go on living, my power to endure this secret love may weaken." },
    90: { first: '<ruby>見<rt>み</rt></ruby>せばやな<br><ruby>雄島<rt>おじま</rt></ruby>のあまの<br><ruby>袖<rt>そで</rt></ruby>だにも', second: 'ぬれにぞぬれし<br><ruby>色<rt>いろ</rt></ruby>はか<ruby>は<rt>わ</rt></ruby>らず', romaji: "misebayana ojimanoamano sodedanimo\nnurenizonureshi irohakaharazu", translation: "I wish I could show you — these sleeves of mine, soaked through and through with tears that never change color, never dry." },
    91: { first: 'きりぎりす<br><ruby>鳴<rt>な</rt></ruby>くや<ruby>霜夜<rt>しもよ</rt></ruby>の<br>さむしろに', second: '<ruby>衣<rt>ころも</rt></ruby>かたしき<br>ひとりかも<ruby>寝<rt>ね</rt></ruby><ruby>む<rt>ん</rt></ruby>', romaji: "kirigirisu nakuyashimoyono samushironi\nkoromokatashiki hitorikamonemu", translation: "On a cold, frosty night, the cricket cries. Lying alone with one sleeve folded beneath me — how lonely it is." },
    92: { first: 'わが<ruby>袖<rt>そで</rt></ruby>は<br><ruby>潮干<rt>しおひ</rt></ruby>に<ruby>見<rt>み</rt></ruby>えぬ<br><ruby>沖<rt>おき</rt></ruby>の<ruby>石<rt>いし</rt></ruby>の', second: '<ruby>人<rt>ひと</rt></ruby>こそ<ruby>知<rt>し</rt></ruby>らね<br>かわくまもなし', romaji: "wagasodeha shihohinimienu okinoishino\nhitokososhirane kawakumamonashi", translation: "My sleeves are like a rock hidden beneath the tides — unseen by others, they are never dry." },
    93: { first: '<ruby>世<rt>よ</rt></ruby>の<ruby>中<rt>なか</rt></ruby>は<br>つねにもがもな<br><ruby>渚<rt>なぎさ</rt></ruby>こぐ', second: 'あまの<ruby>小舟<rt>こぶね</rt></ruby>の<br><ruby>綱手<rt>つなで</rt></ruby>かなしも', romaji: "yononakaha tsunenimogamona nagisakogu\namanoobuneno tsunadekanashimo", translation: "I wish the world could stay just as it is forever. How moving it is to watch the small fishing boats being towed along the shore." },
    94: { first: 'み<ruby>吉野<rt>よしの</rt></ruby>の<br><ruby>山<rt>やま</rt></ruby>の<ruby>秋風<rt>あきかぜ</rt></ruby><br>さ<ruby>夜<rt>よ</rt></ruby>ふけて', second: 'ふるさと<ruby>寒<rt>さむ</rt></ruby>く<br><ruby>衣<rt>ころも</rt></ruby>うつなり', romaji: "miyoshinono yamanoakikaze sayofukete\nfurusatosamuku koromoutsunari", translation: "On an autumn night, the mountain wind of Yoshino blows cold. In the old village, I can hear the sound of someone beating cloth." },
    95: { first: 'お<ruby>ほ<rt>お</rt></ruby>けなく<br><ruby>憂<rt>う</rt></ruby>き<ruby>世<rt>よ</rt></ruby>の<ruby>民<rt>たみ</rt></ruby>に<br>お<ruby>ほ<rt>お</rt></ruby><ruby>ふ<rt>う</rt></ruby>かな', second: 'わがたつ<ruby>杣<rt>そま</rt></ruby>に<br><ruby>墨染<rt>すみぞめ</rt></ruby>の<ruby>袖<rt>そで</rt></ruby>', romaji: "ohokenaku ukiyonotamini ohofukana\nwagatatsusomani sumizomenosode", translation: "How bold it is of me — yet I spread my ink-black sleeves to shelter the people of this troubled world." },
    96: { first: '<ruby>花<rt>はな</rt></ruby>さそ<ruby>ふ<rt>う</rt></ruby><br><ruby>嵐<rt>あらし</rt></ruby>の<ruby>庭<rt>にわ</rt></ruby>の<br><ruby>雪<rt>ゆき</rt></ruby>ならで', second: 'ふりゆくものは<br>わが<ruby>身<rt>み</rt></ruby>なりけり', romaji: "hanasasofu arashinonihano yukinarade\nfuriyukumonoha wagaminarikeri", translation: "It is not the snow of blossoms scattered by the storm in the garden — it is I myself who am fading with the years." },
    97: { first: '<ruby>来<rt>こ</rt></ruby>ぬ<ruby>人<rt>ひと</rt></ruby>を<br><ruby>松帆<rt>まつほ</rt></ruby>の<ruby>浦<rt>うら</rt></ruby>の<br><ruby>夕<rt>ゆう</rt></ruby>なぎに', second: '<ruby>焼<rt>や</rt></ruby>くやもしほの<br><ruby>身<rt>み</rt></ruby>もこがれつつ', romaji: "konuhitoo matsuhonourano yuunagini\nyakuyamoshihono mimokogaretsutsu", translation: "Waiting for someone who will not come, at the quiet evening shore — like salt burned from the seaweed, I too am consumed by longing." },
    98: { first: '<ruby>風<rt>かぜ</rt></ruby>そよぐ<br>ならの<ruby>小川<rt>おがわ</rt></ruby>の<br><ruby>夕<rt></rt></ruby><ruby>暮<rt>ぐれ</rt></ruby>は', second: 'みそぎぞ<ruby>夏<rt>なつ</rt></ruby>の<br>しるしなりける', romaji: "kazesoyogu naranoogahano yufugureha\nmisogizonatsuno shirushinarikeru", translation: "The breeze rustles through the leaves of the sacred oak trees by the river at dusk. The purification rite is the only sign that summer is here." },
    99: { first: '<ruby>人<rt>ひと</rt></ruby>もをし<br><ruby>人<rt>ひと</rt></ruby>もうらめし<br>あ<ruby>ぢ<rt>じ</rt></ruby>きなく', second: '<ruby>世<rt>よ</rt></ruby>を<ruby>思<rt>おも</rt></ruby><ruby>ふ<rt>う</rt></ruby>ゆ<ruby>ゑ<rt>え</rt></ruby>に<br><ruby>物<rt>も</rt></ruby><ruby>思<rt>おも</rt></ruby><ruby>ふ<rt>う</rt></ruby><ruby>身<rt>み</rt></ruby>は', romaji: "hitomooshi hitomourameshi ajikinaku\nyooomofuyueeni monoomofumiha", translation: "I find people both dear and hateful. It is because I care so deeply about this troubled world that I am always lost in thought." },
    100: { first: 'ももしきや<br>ふるき<ruby>軒<rt>のき</rt></ruby>ばの<br>しのぶにも', second: 'な<ruby>ほ<rt>お</rt></ruby>あまりある<br><ruby>昔<rt>むかし</rt></ruby>なりけり', romaji: "momoshikiya furukinokibano shinobunimo\nnahoamariaru mukashinarikeri", translation: "Even the ancient ferns on the old eaves of the palace — there is more than enough of the past that they call to mind." }
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
      poemRomaji: document.getElementById('sgr-poem-romaji'),
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
  // English wording helpers (singular/plural, 1st/2nd/3rd...)
  function squaresText(n) { return n + (n === 1 ? ' square' : ' squares'); }
  function turnsText(n) { return n + (n === 1 ? ' turn' : ' turns'); }
  function ordinal(n) {
    const s = (n % 100 >= 11 && n % 100 <= 13) ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] || 'th');
    return n + s;
  }

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
      ? ('🏅 Personal best: reached the goal in ' + turnsText(best.turns))
      : 'No record yet';
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
        '<span class="sgr-player-pos">📍Square <b id="sgr-pos-p' + idx + '">' + p.pos + '</b></span>' +
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
      el.poemSource.textContent = 'No. ' + sq.index + ' ' + quiz.poet;
      // 句の中の改行（<br>区切り）は半角スペースにして1行にし、上の句と下の句の間で改行する
      const flatten = (html) => html.replace(/<br>/g, ' ');
      el.poemText.innerHTML = flatten(poem.first) + '<br>' + flatten(poem.second);
      el.poemRomaji.textContent = poem.romaji;
      el.poemTranslation.textContent = poem.translation;
      el.poemTranslationLabel.classList.remove('sgr-hidden');
    } else if (sq.type === 'goal') {
      el.poemSource.textContent = '⛰️ Agari (Goal)';
      el.poemText.innerHTML = 'The goal picture shows Fujiwara no Teika at his mountain villa on Mount Ogura.';
      el.poemRomaji.textContent = '';
      el.poemTranslation.textContent = '';
      el.poemTranslationLabel.classList.add('sgr-hidden');
    } else {
      el.poemSource.textContent = '🚩 Start';
      el.poemText.textContent = 'Roll the die and set off on your Hyakunin Isshu journey!';
      el.poemRomaji.textContent = '';
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
          toast('✕', 'Wrong… You can’t move this turn. Try again on your next turn.');
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
    el.turnIndicator.innerHTML = prefix + '🌀 Special square 22!<br>Roll the die again';
    toast('🌀', 'Special square 22! Roll the die again');
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
      el.turnIndicator.textContent = 'Move ' + squaresText(value);
      attemptMoveTo(player, target, { instant: false });
      return;
    }
    const target = Math.min(state.rangeEnd, Math.max(state.rangeStart, warpTo));
    el.turnIndicator.textContent = '🌀 You rolled a ' + value + '! Warp to square ' + warpTo + '!';
    toast('🌀', 'You rolled a ' + value + '! Warp to square ' + warpTo + '!');
    attemptMoveTo(player, target, { instant: true });
  }

  function handleGoal(player) {
    player.finished = true;
    state.finishedCount++;
    player.finishOrder = state.finishedCount;
    toast('🏔️', player.name + ' reached the goal!');
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
    el.quizOkBtn.textContent = 'Next';
    el.quizOkBtn.classList.remove('sgr-hidden');
    el.quizTrueBtn.disabled = false;
    el.quizFalseBtn.disabled = false;
    el.quizSource.textContent = quiz.poemNum ? ('Quiz: No. ' + quiz.poemNum + ' ' + quiz.poet) : 'Quiz: Hyakunin Isshu';
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
      el.quizResultText.textContent = choice === null ? '⏰ Time’s up…' : (correct ? '⭕ Correct!' : '✕ Wrong…');
      el.quizExplain.innerHTML = 'Explanation: ' + quiz.explain;
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
      ? ('🔁 Try the quiz for square ' + player.pendingTarget + ' again')
      : 'Roll the die!');
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
        ? (prefix + 'Warp to square ' + player.pendingTarget + '!')
        : (prefix + 'Move ' + squaresText(player.pendingTarget - player.pos));
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
    el.turnIndicator.textContent = prefix + 'Move ' + squaresText(value);
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
      statusLine = opts.showTurns ? ('Reached the goal in ' + turnsText(state.turnCount) + '!') : 'Reached the goal!';
    } else {
      statusLine = 'Turn limit reached (did not finish)';
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
        el.resultBanner.textContent = '⏰ Turn limit reached… (not cleared)';
      } else if (isNewBest) {
        el.resultBanner.textContent = '🎉 New personal best!';
      } else {
        el.resultBanner.textContent = '🏔️ Goal!';
      }

      el.resultCols.innerHTML = buildColHTML(player, { isWinner: isNewBest, rankLabel: null, showTurns: true });

      if (!player.finished) {
        el.resultBest.textContent = 'You didn’t reach the goal, so this game doesn’t count toward your personal best. Try again!';
      } else if (isNewBest) {
        el.resultBest.textContent = 'You beat your previous personal best!';
      } else if (!isFullCourse) {
        el.resultBest.textContent = 'Only games started from square 0 (the start) count toward your personal best.'
          + (best ? ' (Current personal best: ' + turnsText(best.turns) + ')' : '');
      } else if (best) {
        el.resultBest.textContent = 'Personal best: reached the goal in ' + turnsText(best.turns);
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
      el.resultBanner.textContent = anyFinished ? '🏯 Results! In the order players reached the goal' : '⏰ Turn limit reached… (no one finished)';
      el.resultCols.innerHTML = sorted.map((p) =>
        buildColHTML(p, { isWinner: p.finished && p.finishOrder === 1, rankLabel: p.finished ? ordinal(p.finishOrder) : '―', showTurns: false })
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
      btn.textContent = zoomed ? 'Fit to screen' : 'Zoom in on the board';
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
