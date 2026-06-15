import type { UiLang } from './types';

// Centralized UI copy in Nepali / Japanese / English.
// Nepali is the primary audience language; Japanese & English are provided
// for bilingual users and for showing source-language labels.

type Dict = Record<string, Record<UiLang, string>>;

export const t: Dict = {
  appName: { ne: 'BJT Pro', ja: 'BJT Pro', en: 'BJT Pro' },
  tagline: {
    ne: 'जापानी पत्रलाई नेपालीमा सजिलै बुझ्नुहोस्',
    ja: '日本の手紙をネパール語でやさしく理解',
    en: 'Understand Japanese letters in plain Nepali',
  },
  heroPromise: {
    ne: 'कुनै पनि जापानी पत्र अपलोड गर्नुहोस्। एक मिनेटभित्र अर्थ, गर्नुपर्ने काम, अन्तिम मिति, जोखिम र वैकल्पिक जापानी जवाफ पाउनुहोस्।',
    ja: '日本の手紙をアップロードすると、意味・やること・期限・リスク・任意の返信文を1分以内に表示します。',
    en: 'Upload any Japanese letter. In under a minute, get the meaning, what to do, by when, the risk, and an optional Japanese reply.',
  },
  takePhoto: { ne: 'तस्बिर खिच्नुहोस्', ja: '写真を撮る', en: 'Take Photo' },
  uploadFile: { ne: 'फाइल अपलोड गर्नुहोस्', ja: 'ファイルをアップロード', en: 'Upload Image / PDF' },
  language: { ne: 'भाषा', ja: '言語', en: 'Language' },
  notLegalAdvice: {
    ne: 'यो कानुनी सल्लाह होइन। महत्त्वपूर्ण कागजातका लागि आधिकारिक कार्यालयमा पुष्टि गर्नुहोस्।',
    ja: 'これは法的助言ではありません。重要な書類は公的機関で確認してください。',
    en: 'This is not legal advice. Verify important documents with the official office.',
  },
  privacyNote: {
    ne: 'तपाईंको कागजात विश्लेषणका लागि मात्र प्रयोग हुन्छ र छोटो समयमा हट्छ। अपलोड गरेर तपाईं सहमति दिनुहुन्छ।',
    ja: '書類は解析のためだけに使用され、短期間で削除されます。アップロードで同意したものとみなします。',
    en: 'Your document is used only for analysis and deleted after a short retention period. Uploading means you consent.',
  },
  // Review screen
  reviewTitle: { ne: 'प्रक्रिया अघि जाँच गर्नुहोस्', ja: '処理前に確認', en: 'Review before processing' },
  reviewHint: {
    ne: 'धमिलो वा अँध्यारो पृष्ठ हटाउनुहोस्। राम्रो फोटोले राम्रो नतिजा दिन्छ।',
    ja: 'ぼやけた・暗いページは削除してください。良い写真ほど結果が正確です。',
    en: 'Remove blurry or dark pages. A clearer photo gives a better result.',
  },
  analyze: { ne: 'विश्लेषण गर्नुहोस्', ja: '解析する', en: 'Analyze' },
  addPage: { ne: 'पृष्ठ थप्नुहोस्', ja: 'ページを追加', en: 'Add page' },
  remove: { ne: 'हटाउनुहोस्', ja: '削除', en: 'Remove' },
  back: { ne: 'पछाडि', ja: '戻る', en: 'Back' },
  // Processing
  processing: { ne: 'तपाईंको कागज बुझ्दैछौं…', ja: '書類を解析しています…', en: 'Analyzing your document…' },
  stepOcr: { ne: 'पाठ पढ्दै (OCR)', ja: '文字認識 (OCR)', en: 'Reading text (OCR)' },
  stepClassify: { ne: 'कागजको प्रकार पत्ता लगाउँदै', ja: '書類の種類を判定', en: 'Detecting document type' },
  stepExtract: { ne: 'मुख्य तथ्य निकाल्दै', ja: '重要な情報を抽出', en: 'Extracting key facts' },
  stepExplain: { ne: 'नेपालीमा व्याख्या गर्दै', ja: 'ネパール語で説明', en: 'Explaining in Nepali' },
  stepConfidence: { ne: 'विश्वसनीयता जाँच्दै', ja: '信頼度を評価', en: 'Scoring confidence' },
  // Result
  result: { ne: 'नतिजा', ja: '結果', en: 'Result' },
  confidence: { ne: 'विश्वसनीयता', ja: '信頼度', en: 'Confidence' },
  docType: { ne: 'प्रकार', ja: '種類', en: 'Type' },
  meaningNp: { ne: 'मुख्य अर्थ', ja: '要点', en: 'Summary' },
  actions: { ne: 'अब के गर्नु पर्ने?', ja: '次にやること', en: 'Action items' },
  deadline: { ne: 'अन्तिम मिति', ja: '期限', en: 'Deadline' },
  risk: { ne: 'जोखिम', ja: 'リスク', en: 'Risk' },
  questions: { ne: 'अस्पष्ट भए सोध्ने प्रश्न', ja: '不明な点の質問', en: 'Questions to ask if unclear' },
  viewJapanese: { ne: 'जापानी फिल्डहरू हेर्नुहोस्', ja: '日本語の項目を見る', en: 'View Japanese fields' },
  generateReply: { ne: 'जापानी जवाफ बनाउनुहोस्', ja: '日本語の返信を作成', en: 'Generate Japanese reply' },
  humanReview: { ne: 'मान्छेले जाँच गरिदिनुहोस्', ja: '人に確認してもらう', en: 'Request human review' },
  notDetected: { ne: 'पत्ता लागेन — मूल कागज जाँच्नुहोस्', ja: '検出できません — 原本を確認', en: 'Not detected — check the original' },
  sourceSnippet: { ne: 'मूल जापानी', ja: '原文', en: 'Source (Japanese)' },
  issuer: { ne: 'जारीकर्ता', ja: '差出人', en: 'Issuer' },
  amount: { ne: 'रकम', ja: '金額', en: 'Amount' },
  // Confidence banners
  lowConfidence: {
    ne: 'यो नतिजा पूर्ण रूपमा विश्वसनीय नहुन सक्छ। राम्रो फोटो वा मान्छेको जाँच सिफारिस गर्छौं।',
    ja: 'この結果は完全には信頼できない可能性があります。再撮影または人による確認をおすすめします。',
    en: 'This result may not be fully reliable. We recommend a clearer photo or human review.',
  },
  amberConfidence: {
    ne: 'केही फिल्ड अनिश्चित छन्। तल "मूल जापानी" मिलाएर पुष्टि गर्नुहोस्।',
    ja: '一部の項目は不確かです。下の「原文」と照合して確認してください。',
    en: 'Some fields are uncertain. Please verify against the Japanese source below.',
  },
  // Reply
  replyTitle: { ne: 'जापानी जवाफको ड्राफ्ट', ja: '日本語の返信ドラフト', en: 'Japanese Reply Draft' },
  tone: { ne: 'शैली', ja: 'トーン', en: 'Tone' },
  tonePolite: { ne: 'विनम्र', ja: '丁寧', en: 'Polite' },
  toneVeryPolite: { ne: 'धेरै विनम्र', ja: 'とても丁寧', en: 'Very polite' },
  confirmFacts: {
    ne: 'जवाफ बनाउनु अघि माथिका तथ्य सही छन् भनी पुष्टि गर्नुहोस्।',
    ja: '返信を作成する前に、上記の事実が正しいことを確認してください。',
    en: 'Confirm the facts above are correct before generating a reply.',
  },
  confirmAndGenerate: { ne: 'पुष्टि गरी जवाफ बनाउनुहोस्', ja: '確認して作成', en: 'Confirm & generate' },
  copy: { ne: 'कपी गर्नुहोस्', ja: 'コピー', en: 'Copy' },
  copied: { ne: 'कपी भयो', ja: 'コピーしました', en: 'Copied' },
  replyDisclaimer: {
    ne: 'पठाउनु अघि यो ड्राफ्ट आफैं पढेर मिलाउनुहोस्। यो स्वचालित रूपमा बनेको हो।',
    ja: '送信前にこのドラフトを必ず確認・修正してください。自動生成です。',
    en: 'Review and edit this draft yourself before sending. It is auto-generated.',
  },
  // History
  history: { ne: 'इतिहास', ja: '履歴', en: 'History' },
  noHistory: { ne: 'अहिलेसम्म कुनै कागजात छैन।', ja: 'まだ書類がありません。', en: 'No documents yet.' },
  deleteForever: { ne: 'सधैंका लागि हटाउनुहोस्', ja: '完全に削除', en: 'Delete forever' },
  open: { ne: 'खोल्नुहोस्', ja: '開く', en: 'Open' },
  newDoc: { ne: 'नयाँ कागजात', ja: '新しい書類', en: 'New document' },
  // Human review
  humanReviewTitle: { ne: 'मानवीय जाँच अनुरोध', ja: '人による確認の依頼', en: 'Human review request' },
  humanReviewBody: {
    ne: 'हाम्रो टोलीले तपाईंको कागजात (मास्क गरिएको) जाँच गर्नेछ। यो उच्च-जोखिम पत्रका लागि सिफारिस गरिन्छ।',
    ja: '当社チームが書類（マスク済み）を確認します。高リスクの手紙におすすめです。',
    en: 'Our team will check your (masked) document. Recommended for high-risk letters.',
  },
  consentHuman: {
    ne: 'म मानवीय समीक्षकलाई मेरो कागजात हेर्न अनुमति दिन्छु।',
    ja: '人によるレビュー担当者が書類を見ることに同意します。',
    en: 'I allow a human reviewer to view my document.',
  },
  submit: { ne: 'पठाउनुहोस्', ja: '送信', en: 'Submit' },
  reviewRequested: {
    ne: 'अनुरोध पठाइयो। हामी चाँडै सम्पर्क गर्नेछौं।',
    ja: '依頼を送信しました。追ってご連絡します。',
    en: 'Request submitted. We will get back to you soon.',
  },
  demoBadge: { ne: 'डेमो', ja: 'デモ', en: 'Demo' },
  demoNote: {
    ne: 'डेमो मोड: नमुना नतिजा देखाइँदै छ। वास्तविक OCR + AI का लागि API कुञ्जी थप्नुहोस्।',
    ja: 'デモモード: サンプル結果を表示中。実際の解析にはAPIキーを設定してください。',
    en: 'Demo mode: showing sample analysis. Add API keys for real OCR + AI.',
  },
  tryDemo: { ne: 'नमुना पत्रहरू प्रयास गर्नुहोस्', ja: 'サンプルの手紙を試す', en: 'Try a sample letter' },
  error: { ne: 'केही गडबड भयो। फेरि प्रयास गर्नुहोस्।', ja: 'エラーが発生しました。もう一度お試しください。', en: 'Something went wrong. Please try again.' },
};

export function tr(key: keyof typeof t, lang: UiLang): string {
  return t[key]?.[lang] ?? t[key]?.en ?? key;
}

export const LANG_LABEL: Record<UiLang, string> = {
  ne: 'नेपाली',
  ja: '日本語',
  en: 'English',
};
