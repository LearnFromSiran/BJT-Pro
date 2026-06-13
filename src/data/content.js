// BJT Pro — Learning content
// Curated Business Japanese material used across the app's screens.

export const keigoLessons = [
  {
    id: 'sonkeigo',
    title: 'Sonkeigo 尊敬語',
    subtitle: 'Respectful language — elevating the listener',
    color: '#E63950',
    intro:
      'Sonkeigo raises the status of the person you are speaking about (usually the listener, a client, or a superior). Use it for the actions of others.',
    items: [
      { plain: 'する (to do)', keigo: 'なさる', romaji: 'nasaru' },
      { plain: '行く / 来る (to go / come)', keigo: 'いらっしゃる', romaji: 'irassharu' },
      { plain: '言う (to say)', keigo: 'おっしゃる', romaji: 'ossharu' },
      { plain: '見る (to see)', keigo: 'ご覧になる', romaji: 'goran ni naru' },
      { plain: '食べる / 飲む (to eat / drink)', keigo: '召し上がる', romaji: 'meshiagaru' },
      { plain: '知っている (to know)', keigo: 'ご存じだ', romaji: 'gozonji da' },
    ],
  },
  {
    id: 'kenjougo',
    title: 'Kenjougo 謙譲語',
    subtitle: 'Humble language — lowering yourself',
    color: '#36C5F0',
    intro:
      'Kenjougo lowers your own status to show respect to the listener. Use it for your own actions when speaking to clients or superiors.',
    items: [
      { plain: 'する (to do)', keigo: 'いたす', romaji: 'itasu' },
      { plain: '行く / 来る (to go / come)', keigo: '参る / 伺う', romaji: 'mairu / ukagau' },
      { plain: '言う (to say)', keigo: '申す / 申し上げる', romaji: 'mousu / moushiageru' },
      { plain: '見る (to see)', keigo: '拝見する', romaji: 'haiken suru' },
      { plain: '食べる / 飲む (to eat / drink)', keigo: 'いただく', romaji: 'itadaku' },
      { plain: '聞く / 訪ねる (to ask / visit)', keigo: '伺う', romaji: 'ukagau' },
    ],
  },
  {
    id: 'teineigo',
    title: 'Teineigo 丁寧語',
    subtitle: 'Polite language — the professional baseline',
    color: '#F2C14E',
    intro:
      'Teineigo is the standard polite form (です/ます). It is the safe, neutral register for most business interactions.',
    items: [
      { plain: 'だ (to be)', keigo: 'です', romaji: 'desu' },
      { plain: '〜する (verb)', keigo: '〜します', romaji: '~shimasu' },
      { plain: 'ある (there is)', keigo: 'あります', romaji: 'arimasu' },
      { plain: 'いい (good)', keigo: 'よろしい', romaji: 'yoroshii' },
      { plain: 'どう (how)', keigo: 'いかが', romaji: 'ikaga' },
      { plain: 'すみません', keigo: '申し訳ございません', romaji: 'moushiwake gozaimasen' },
    ],
  },
];

export const mockQuestions = [
  {
    id: 1,
    section: 'Keigo',
    question: 'A client is about to look at your proposal. Which is correct?',
    options: ['資料を拝見してください', '資料をご覧ください', '資料を見てあげてください', '資料を見させてください'],
    answer: 1,
    explain: 'ご覧ください (goran kudasai) is sonkeigo — correct for the client\'s action of viewing.',
  },
  {
    id: 2,
    section: 'Keigo',
    question: 'You want to say "I will visit your office tomorrow." (humble)',
    options: ['明日、御社にいらっしゃいます', '明日、御社に参ります', '明日、御社に来ます', '明日、御社におります'],
    answer: 1,
    explain: '参ります (mairimasu) is kenjougo — humble form of "to go/come", correct for your own action.',
  },
  {
    id: 3,
    section: 'Business Email',
    question: 'Which is the standard opening for a business email to a client?',
    options: ['こんにちは', 'お疲れ様です', 'いつもお世話になっております', 'よろしく'],
    answer: 2,
    explain: 'いつもお世話になっております is the universal polite opening to clients and partners.',
  },
  {
    id: 4,
    section: 'Vocabulary',
    question: '「御社」 (onsha) refers to:',
    options: ['Your own company', 'The listener\'s company', 'A government office', 'A subsidiary'],
    answer: 1,
    explain: '御社 is the respectful way to refer to the other party\'s company (spoken). 弊社 refers to your own.',
  },
  {
    id: 5,
    section: 'Phone',
    question: 'Answering an external call, a company employee typically says:',
    options: ['もしもし', 'はい、〇〇でございます', 'どちら様', 'ちょっと待って'],
    answer: 1,
    explain: 'On business calls you state the company name with でございます. もしもし is informal/internal.',
  },
  {
    id: 6,
    section: 'Keigo',
    question: '"Did the director say so?" — respectful form of 言う for the director:',
    options: ['申しましたか', 'おっしゃいましたか', '言われてあげましたか', 'いたしましたか'],
    answer: 1,
    explain: 'おっしゃる is sonkeigo for 言う, used to respect the director\'s action.',
  },
];

export const businessTemplates = [
  {
    id: 'email-request',
    category: 'Email',
    title: 'Polite Request Email',
    japanese:
      'お世話になっております。\n△△株式会社の田中でございます。\n\n早速ですが、〇〇の件についてご相談がございます。\nお忙しいところ恐縮ですが、ご確認いただけますと幸いです。\n\n何卒よろしくお願い申し上げます。',
    english:
      'Thank you for your continued support. I am Tanaka from △△ Corporation. To get straight to the point, I would like to consult you regarding 〇〇. I apologize for troubling you while you are busy, and I would be grateful if you could review it. Thank you very much.',
  },
  {
    id: 'email-apology',
    category: 'Email',
    title: 'Apology for a Mistake',
    japanese:
      'この度は、私どもの不手際によりご迷惑をおかけし、誠に申し訳ございません。\n直ちに原因を確認し、再発防止に努めてまいります。\n何卒ご容赦くださいますようお願い申し上げます。',
    english:
      'We sincerely apologize for the inconvenience caused by our oversight. We will immediately verify the cause and work to prevent a recurrence. We humbly ask for your understanding.',
  },
  {
    id: 'phone-transfer',
    category: 'Phone',
    title: 'Transferring a Call',
    japanese:
      'お電話ありがとうございます。\n担当の者にお繋ぎいたしますので、少々お待ちくださいませ。',
    english:
      'Thank you for calling. I will connect you to the person in charge, so please wait a moment.',
  },
  {
    id: 'meeting-open',
    category: 'Meeting',
    title: 'Opening a Meeting',
    japanese:
      '本日はお忙しい中、お集まりいただきありがとうございます。\nそれでは、定刻になりましたので会議を始めさせていただきます。',
    english:
      'Thank you for gathering today despite your busy schedules. As it is now the appointed time, allow us to begin the meeting.',
  },
  {
    id: 'meeting-opinion',
    category: 'Meeting',
    title: 'Stating an Opinion Politely',
    japanese:
      '差し支えなければ、一点よろしいでしょうか。\n私としましては、〇〇の方向で進めるのが良いかと存じます。',
    english:
      'If it is not an inconvenience, may I add one point? In my view, I believe it would be best to proceed in the direction of 〇〇.',
  },
];

export const cultureTips = [
  {
    id: 'meishi',
    title: 'Exchanging Business Cards (名刺交換)',
    emoji: '🪪',
    body:
      'Present your card with both hands, text facing the recipient, while stating your company and name. Receive the other card with both hands, read it carefully, and place it on the table during the meeting — never write on it or shove it in your pocket.',
  },
  {
    id: 'seating',
    title: 'Seating Order (上座・下座)',
    emoji: '🪑',
    body:
      'The kamiza (seat of honor) is farthest from the door and is offered to clients and superiors. The shimoza (lowest seat) is nearest the door, taken by the most junior person, who often handles the door and service.',
  },
  {
    id: 'horenso',
    title: 'Hou-Ren-Sou (報連相)',
    emoji: '🔁',
    body:
      'Houkoku (report), Renraku (inform), Soudan (consult). This trio is the backbone of Japanese workplace communication — proactively keep your team informed rather than waiting to be asked.',
  },
  {
    id: 'nomikai',
    title: 'After-work Drinks (飲み会)',
    emoji: '🍶',
    body:
      'Nomikai build trust (本音 vs 建前). Pour drinks for others before yourself, hold your glass slightly lower than a superior\'s during kanpai, and wait for everyone before the first toast.',
  },
  {
    id: 'punctuality',
    title: 'Punctuality (時間厳守)',
    emoji: '⏱️',
    body:
      'Arriving "on time" means 5–10 minutes early. Being late, even by minutes, requires a prompt phone call and a sincere apology. Time discipline signals respect and reliability.',
  },
];

export const homeModules = [
  {
    id: 'keigo',
    route: '/keigo',
    title: 'Keigo Mastery',
    subtitle: 'Sonkeigo · Kenjougo · Teineigo',
    emoji: '🎌',
    accent: '#E63950',
  },
  {
    id: 'mock-test',
    route: '/mock-test',
    title: 'BJT Mock Test',
    subtitle: 'Timed practice questions',
    emoji: '📝',
    accent: '#36C5F0',
  },
  {
    id: 'business',
    route: '/business',
    title: 'Business Communication',
    subtitle: 'Email · Phone · Meetings',
    emoji: '💼',
    accent: '#F2C14E',
  },
  {
    id: 'culture',
    route: '/culture',
    title: 'Cultural Context',
    subtitle: 'Etiquette & corporate culture',
    emoji: '🏯',
    accent: '#3DD68C',
  },
];
