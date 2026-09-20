/**
 * Smart Plain-Language News Explainer
 * 
 * Converts complex geopolitical, economic, and technical news into simple,
 * jargon-free everyday explanations ("What this means for you").
 * Supports: English, Tamil (தமிழ்), Hindi (हिंदी), Telugu (తెలుగు), Bengali (বাংলা), Marathi (मराठी).
 */

// Categorized domain keywords and simplified everyday impacts
const IMPACT_PATTERNS = [
  {
    category: 'fuel_energy',
    keywords: ['petrol', 'diesel', 'fuel', 'oil price', 'lpg', 'gasoline', 'crude oil', 'cng', 'electricity tariff', 'power cut', 'blackout', 'power grid'],
    en: {
      explanation: 'Fuel or energy costs have changed.',
      impact: 'You may spend more or less money on daily travel, bike or car fuel, and transport costs.'
    },
    hi: {
      explanation: 'ईंधन या बिजली की कीमतों में बदलाव हुआ है।',
      impact: 'आपके दैनिक यात्रा, पेट्रोल-डीजल और परिवहन खर्चों पर इसका असर पड़ सकता है।'
    },
    ta: {
      explanation: 'பெட்ரோல், டீசல் அல்லது மின்சார கட்டணத்தில் மாற்றம் ஏற்பட்டுள்ளது.',
      impact: 'உங்கள் தினசரி பயண செலவு மற்றும் வாகன எரிபொருள் செலவு அதிகரிக்கலாம் அல்லது குறையலாம்.'
    },
    te: {
      explanation: 'పెట్రోల్, డీజిల్ లేదా విద్యుత్ ఛార్జీలలో మార్పు వచ్చింది.',
      impact: 'మీ రోజువారీ ప్రయాణ మరియు ఇంధన ఖర్చులపై ప్రభావం పడవచ్చు.'
    },
    bn: {
      explanation: 'পেট্রোল, ডিজেল বা বিদ্যুতের দামে পরিবর্তন এসেছে।',
      impact: 'আপনার দৈনন্দিন যাতায়াত এবং জ্বালানি খরচে এর প্রভাব পড়তে পারে।'
    },
    mr: {
      explanation: 'पेट्रोल, डिझेल किंवा वीज दरांमध्ये बदल झाला आहे.',
      impact: 'तुमच्या रोजच्या प्रवासाचा आणि इंधनाचा खर्च वाढू किंवा कमी होऊ शकतो.'
    }
  },
  {
    category: 'weather_disaster',
    keywords: ['heavy rain', 'rain', 'cyclone', 'flood', 'storm', 'red alert', 'orange alert', 'monsoon', 'waterlogging', 'earthquake', 'tsunami', 'heatwave', 'landslide'],
    en: {
      explanation: 'Severe weather or rain alert in this region.',
      impact: 'Stay indoors if possible, keep an umbrella handy, and avoid flooded roads or underpasses.'
    },
    hi: {
      explanation: 'इस इलाके में भारी बारिश या खराब मौसम की चेतावनी है।',
      impact: 'जरूरत न हो तो घर से बाहर न निकलें, छाता साथ रखें और जलभराव वाले रास्तों से बचें।'
    },
    ta: {
      explanation: 'கனமழை அல்லது தீவிர வானிலை எச்சரிக்கை விடுக்கப்பட்டுள்ளது.',
      impact: 'தேவை இல்லாமல் வெளியே செல்வதைத் தவிர்க்கவும், குடை எடுத்துச் செல்லவும், மழைநீர் தேங்கிய சாலைகளைத் தவிர்க்கவும்.'
    },
    te: {
      explanation: 'భారీ వర్షం లేదా తీవ్ర వాతావరణ హెచ్చరిక జారీ చేయబడింది.',
      impact: 'అవసరం లేకుండా బయటకు వెళ్లకండి, గొడుగు దగ్గర ఉంచుకోండి మరియు నీరు నిలిచిన రోడ్లకు దూరంగా ఉండండి.'
    },
    bn: {
      explanation: 'ভারী বৃষ্টিপাত বা দুর্যোগপূর্ণ আবহাওয়ার সতর্কতা জারি করা হয়েছে।',
      impact: 'প্রয়োজন ছাড়া বাইরে বের হবেন না, ছাতা সাথে রাখুন এবং জলাবদ্ধ রাস্তা এড়িয়ে চলুন।'
    },
    mr: {
      explanation: 'मुसळधार पाऊस किंवा वादळाचा इशारा देण्यात आला आहे.',
      impact: 'गरज नसल्यास घराबाहेर पडू नका, छत्री सोबत ठेवा आणि पाणी साचलेल्या रस्त्यांवर जाणे टाळा.'
    }
  },
  {
    category: 'food_inflation',
    keywords: ['inflation', 'vegetable', 'tomato', 'onion', 'food price', 'ration', 'grocery', 'milk price', 'rice price', 'wheat', 'market price'],
    en: {
      explanation: 'Food or essential grocery prices are fluctuating.',
      impact: 'Your monthly kitchen budget and vegetable market expenses may be affected.'
    },
    hi: {
      explanation: 'सब्जियों और खाद्य पदार्थों की कीमतों में बदलाव आया है।',
      impact: 'आपके घर के मासिक राशन और सब्जी बाजार के खर्च में थोड़ा बदलाव आ सकता है।'
    },
    ta: {
      explanation: 'காய்கறிகள் மற்றும் மளிகைப் பொருட்களின் விலையில் மாற்றம் ஏற்பட்டுள்ளது.',
      impact: 'உங்கள் மாதாந்திர சமையலறை மற்றும் சந்தை செலவுகள் பாதிக்கப்படலாம்.'
    },
    te: {
      explanation: 'కూరగాయలు మరియు నిత్యావసర వస్తువుల ధరలలో మార్పు వచ్చింది.',
      impact: 'మీ నెలవారీ వంటింటి బడ్జెట్ మరియు మార్కెట్ ఖర్చులపై ప్రభావం ఉండవచ్చు.'
    },
    bn: {
      explanation: 'নিত্যপ্রয়োজনীয় খাদ্যদ্রব্য বা শাকসবজির দামে পরিবর্তন এসেছে।',
      impact: 'আপনার মাসিক রান্নাঘরের বাজেট ও বাজার খরচে এর প্রভাব পড়তে পারে।'
    },
    mr: {
      explanation: 'भाजीपाला आणि जीवनावश्यक वस्तूंच्या भावात बदल झाला आहे.',
      impact: 'तुमच्या घरच्या मासिक खर्चावर आणि भाजी बाजाराच्या बजेटवर परिणाम होऊ शकतो.'
    }
  },
  {
    category: 'transport_travel',
    keywords: ['metro', 'train', 'bus', 'flight', 'railway', 'traffic', 'strike', 'bandh', 'highway', 'toll', 'fare hike', 'airport'],
    en: {
      explanation: 'Public transport, road, or travel updates reported.',
      impact: 'Check travel schedules before leaving home. Buses, trains, or traffic may face delays.'
    },
    hi: {
      explanation: 'परिवहन, बस, ट्रेन या सड़क यात्रा से जुड़ी महत्वपूर्ण सूचना है।',
      impact: 'घर से निकलने से पहले समय सारिणी जांचें। यातायात या बस-ट्रेन में देरी हो सकती है।'
    },
    ta: {
      explanation: 'பேருந்து, ரயில் அல்லது போக்குவரத்து சேவை குறித்த முக்கிய செய்தி.',
      impact: 'பயணம் செய்வதற்கு முன் நேரத்தை சரிபார்க்கவும். தாமதம் அல்லது வழித்தட மாற்றம் இருக்கலாம்.'
    },
    te: {
      explanation: 'బస్సు, రైలు లేదా రవాణా సేవల గురించిన సమాచారం.',
      impact: 'బయలుదేరే ముందు సమయాలను సరిచూసుకోండి. ఆలస్యం లేదా మార్గాల మార్పు ఉండవచ్చు.'
    },
    bn: {
      explanation: 'বাস, ট্রেন বা সাধারণ যাতায়াত সম্পর্কিত গুরুত্বপূর্ণ খবর।',
      impact: 'বাইরে বের হওয়ার আগে সময়সূচী দেখে নিন। যানজট বা দেরির সম্ভাবনা থাকতে পারে।'
    },
    mr: {
      explanation: 'बस, रेल्वे किंवा वाहतूक सेवेबाबत महत्त्वाची माहिती आहे.',
      impact: 'घराबाहेर पडण्यापूर्वी वेळापत्रक तपासा. वाहतूक कोंडी किंवा विलंब होऊ शकतो.'
    }
  },
  {
    category: 'conflict_security',
    keywords: ['war', 'missile', 'airstrike', 'military', 'invasion', 'curfew', 'police', 'arrest', 'protest', 'riot', 'violence', 'clashes', 'drone'],
    en: {
      explanation: 'Security, law enforcement, or defense operation reported.',
      impact: 'Heightened police or security presence. Follow official government instructions and stay alert.'
    },
    hi: {
      explanation: 'सुरक्षा या कानून व्यवस्था से जुड़ी गंभीर खबर है।',
      impact: 'सुरक्षा बल सतर्क हैं। सरकारी निर्देशों का पालन करें और अफवाहों पर ध्यान न दें।'
    },
    ta: {
      explanation: 'பாதுகாப்பு அல்லது சட்ட ஒழுங்கு தொடர்பான முக்கிய நிகழ்வு.',
      impact: 'பாதுகாப்பு பலப்படுத்தப்பட்டுள்ளது. அரசு வழிகாட்டுதல்களைப் பின்பற்றி கவனமாக இருக்கவும்.'
    },
    te: {
      explanation: 'భద్రత లేదా శాంతిభద్రతలకు సంబంధించిన అత్యవసర సమాచారం.',
      impact: 'భద్రతా బలగాలు అప్రమత్తంగా ఉన్నాయి. ప్రభుత్వ ఆదేశాలను పాటించి జాగ్రత్తగా ఉండండి.'
    },
    bn: {
      explanation: 'নিরাপত্তা বা আইন-শৃঙ্খলা সংক্রান্ত গুরুত্বপূর্ণ তথ্য।',
      impact: 'নিরাপত্তা ব্যবস্থা জোরদার করা হয়েছে। সরকারি নির্দেশ মেনে চলুন ও সতর্ক থাকুন।'
    },
    mr: {
      explanation: 'सुरक्षा किंवा कायदा व सुव्यवस्थेशी संबंधित गंभीर बातमी आहे.',
      impact: 'सुरक्षा व्यवस्था कडक करण्यात आली आहे. प्रशासनाच्या सूचनांचे पालन करा.'
    }
  },
  {
    category: 'jobs_economy',
    keywords: ['jobs', 'salary', 'hiring', 'layoff', 'bonus', 'pension', 'tax', 'budget', 'interest rate', 'bank', 'loan', 'emi', 'provident fund', 'epfo'],
    en: {
      explanation: 'Update on banking, taxes, pensions, or job market.',
      impact: 'This could influence your savings, bank loan EMI, or retirement and salary benefits.'
    },
    hi: {
      explanation: 'बैंक, ब्याज दर, पेंशन या रोजगार से जुड़ा समाचार है।',
      impact: 'इसका असर आपकी बचत, बैंक लोन की ईएमआई या भविष्य निधि पर पड़ सकता है।'
    },
    ta: {
      explanation: 'வங்கி, வரி, ஓய்வூதியம் அல்லது வேலைவாய்ப்பு தொடர்பான அறிவிப்பு.',
      impact: 'இது உங்கள் சேமிப்பு, வங்கி கடன் தவணை (EMI) அல்லது மாத ஊதியத்தில் தாக்கத்தை ஏற்படுத்தலாம்.'
    },
    te: {
      explanation: 'బ్యాంకు, వడ్డీ రేట్లు, పెన్షన్ లేదా ఉద్యోగాలకు సంబంధించిన వార్త.',
      impact: 'ఇది మీ పొదుపు, బ్యాంకు లోన్ ఈఎంఐ లేదా జీత భత్యాలపై ప్రభావం చూపవచ్చు.'
    },
    bn: {
      explanation: 'ব্যাংক, কর, পেনশন বা চাকরির বাজার সম্পর্কিত খবর।',
      impact: 'এটি আপনার সঞ্চয়, ব্যাংকের ইএমআই বা বেতনের ওপর প্রভাব ফেলতে পারে।'
    },
    mr: {
      explanation: 'बँक, व्याजदर, पेन्शन किंवा नोकरी संदर्भातील माहिती आहे.',
      impact: 'याचा तुमच्या बचतीवर, बँकेच्या ईएमआयवर किंवा पगारावर परिणाम होऊ शकतो.'
    }
  },
  {
    category: 'health_medical',
    keywords: ['health', 'hospital', 'disease', 'dengue', 'fever', 'vaccine', 'virus', 'medicine', 'doctors', 'ayushman', 'epidemic'],
    en: {
      explanation: 'Public health or medical advisory issued.',
      impact: 'Take necessary health precautions, drink clean water, and consult a doctor if you feel unwell.'
    },
    hi: {
      explanation: 'स्वास्थ्य और चिकित्सा से जुड़ी सलाह जारी की गई है।',
      impact: 'साफ पानी पिएं, स्वास्थ्य का ध्यान रखें और अस्वस्थ महसूस होने पर तुरंत डॉक्टर से मिलें।'
    },
    ta: {
      explanation: 'பொது சுகாதாரம் மற்றும் மருத்துவம் சார்ந்த முக்கிய அறிவிப்பு.',
      impact: 'சுத்தமான குடிநீரைப் பருகவும், உடல் நலக்குறைவு ஏற்பட்டால் உடனே மருத்துவரை அணுகவும்.'
    },
    te: {
      explanation: 'ఆరోగ్యం మరియు వైద్య జాగ్రత్తలకు సంబంధించిన ప్రకటన.',
      impact: 'మంచి నీరు త్రాగండి, ఆరోగ్యాన్ని జాగ్రత్తగా చూసుకోండి మరియు అవసరమైతే వైద్యుడిని సంప్రదించండి.'
    },
    bn: {
      explanation: 'জনস্বাস্থ্য ও চিকিৎসা সংক্রান্ত গুরুত্বপূর্ণ পরামর্শ।',
      impact: 'পরিস্কার জল পান করুন এবং শরীর খারাপ লাগলে চিকিৎসকের পরামর্শ নিন।'
    },
    mr: {
      explanation: 'सार्वजनिक आरोग्य आणि वैद्यकीय उपचारांशी संबंधित सल्ला आहे.',
      impact: 'स्वच्छ पाणी प्या, आरोग्याची काळजी घ्या आणि तब्येत बिघडल्यास डॉक्टरांचा सल्ला घ्या.'
    }
  },
  {
    category: 'tech_scam',
    keywords: ['cyber', 'scam', 'fraud', 'otp', 'hacked', 'whatsapp scam', 'ai', 'phone call', 'phishing', 'bank fraud'],
    en: {
      explanation: 'Digital security or online fraud alert.',
      impact: 'Never share bank OTP, PIN, or passwords with anyone on phone calls or messages.'
    },
    hi: {
      explanation: 'ऑनलाइन फ्रॉड या डिजिटल धोखाधड़ी की चेतावनी है।',
      impact: 'किसी को भी फोन या मैसेज पर अपना बैंक ओटीपी, पासवर्ड या पिन न बताएं।'
    },
    ta: {
      explanation: 'சைபர் மோசடி அல்லது ஆன்லைன் ஏமாற்று வேலைகள் குறித்த எச்சரிக்கை.',
      impact: 'உங்கள் வங்கி OTP, பாஸ்வேர்ட் அல்லது PIN எண்ணை யாருடனும் தொலைபேசியில் பகிர வேண்டாம்.'
    },
    te: {
      explanation: 'సైబర్ మోసాలు లేదా ఆన్‌లైన్ దొంగతనాల హెచ్చరిక.',
      impact: 'మీ బ్యాంక్ ఓటీపీ, పాస్‌వర్డ్ లేదా పిన్ ఎవరితోనూ ఫోన్‌లో చెప్పవద్దు.'
    },
    bn: {
      explanation: 'অনলাইন প্রতারণা বা সাইবার অপরাধের বিষয়ে সতর্কতা।',
      impact: 'ফোনে বা মেসেজে কাউকে আপনার ব্যাংকের ওটিপি বা পাসওয়ার্ড দেবেন না।'
    },
    mr: {
      explanation: 'सायबर फसवणूक किंवा ऑनलाईन घोटाळ्याचा इशारा आहे.',
      impact: 'कोणालाही फोन किंवा मेसेजवर आपला बँक ओटीपी अथवा पासवर्ड सांगू नका.'
    }
  }
];

/**
 * Clean and simplify text by removing technical jargon
 */
function cleanJargon(text = '') {
  return text
    .replace(/\b(allegedly|unprecedented|multilateral|bilateral|geopolitical|contingency|escalation|de-escalation)\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Generate a smart plain-language explanation and everyday impact
 * @param {string} title
 * @param {string} description
 * @param {string} language - 'en', 'hi', 'ta', 'te', 'bn', or 'mr'
 * @returns {object} { category, explanation, impact, simpleText, language }
 */
export function explainNews(title = '', description = '', language = 'en') {
  const combined = `${title} ${description}`.toLowerCase();
  const validLangs = ['hi', 'ta', 'te', 'bn', 'mr'];
  const langKey = validLangs.includes(language) ? language : 'en';

  // 1. Check for specific everyday impact domain
  let matchedDomain = null;
  for (const pattern of IMPACT_PATTERNS) {
    for (const kw of pattern.keywords) {
      if (combined.includes(kw)) {
        matchedDomain = pattern;
        break;
      }
    }
    if (matchedDomain) break;
  }

  // 2. Generate multi-lingual explanation
  if (matchedDomain) {
    const localized = matchedDomain[langKey] || matchedDomain['en'];
    const simpleTitle = cleanJargon(title.split(' - ')[0]);
    
    let simpleText = '';
    if (langKey === 'ta') {
      simpleText = `செய்தி சுருக்கம்: ${simpleTitle}. இதன் பொருள்: ${localized.explanation} இதனால் உங்களுக்கு என்ன பயன் அல்லது பாதிப்பு: ${localized.impact}`;
    } else if (langKey === 'hi') {
      simpleText = `सरल शब्दों में: ${simpleTitle}। इसका मतलब: ${localized.explanation} आपके लिए इसका क्या असर होगा: ${localized.impact}`;
    } else if (langKey === 'te') {
      simpleText = `సులభమైన మాటల్లో: ${simpleTitle}. అర్థం: ${localized.explanation} మీకు దీని వలన ప్రభావం: ${localized.impact}`;
    } else if (langKey === 'bn') {
      simpleText = `সহজ কথায়: ${simpleTitle}। এর অর্থ: ${localized.explanation} আপনার ওপর এর প্রভাব: ${localized.impact}`;
    } else if (langKey === 'mr') {
      simpleText = `सोप्या शब्दांत: ${simpleTitle}। याचा अर्थ: ${localized.explanation} तुमच्यावर याचा काय परिणाम होईल: ${localized.impact}`;
    } else {
      simpleText = `In simple words: ${simpleTitle}. Meaning: ${localized.explanation} What this means for you: ${localized.impact}`;
    }

    return {
      category: matchedDomain.category,
      explanation: localized.explanation,
      impact: localized.impact,
      simpleText,
      language: langKey
    };
  }

  // 3. Fallback generic plain-language breakdown
  const firstSentence = (description || title).split('.')[0].trim();
  const cleanSummary = cleanJargon(firstSentence || title);

  if (langKey === 'ta') {
    return {
      category: 'general',
      explanation: 'இது ஒரு பொதுவான அரசு அல்லது சர்வதேச முக்கிய நிகழ்வு செய்தி.',
      impact: 'இந்த செய்தி மூலம் நடப்பு நிகழ்வுகளை எளிதாக தெரிந்து கொள்ளலாம்.',
      simpleText: `எளிய விளக்கம்: ${cleanSummary}. இது நடப்பு முக்கிய நிகழ்வு பற்றிய செய்தி.`,
      language: 'ta'
    };
  } else if (langKey === 'hi') {
    return {
      category: 'general',
      explanation: 'यह एक महत्वपूर्ण राष्ट्रीय या अंतरराष्ट्रीय समाचार है।',
      impact: 'इससे आप देश और दुनिया के महत्वपूर्ण घटनाक्रमों से अवगत रह सकते हैं।',
      simpleText: `सरल शब्दों में: ${cleanSummary}। यह देश-दुनिया की मुख्य खबर है।`,
      language: 'hi'
    };
  } else if (langKey === 'te') {
    return {
      category: 'general',
      explanation: 'ఇది ఒక ముఖ్యమైన జాతీయ లేదా అంతర్జాతీయ వార్త.',
      impact: 'దీని ద్వారా తాజా పరిణామాలను సులభంగా అర్థం చేసుకోవచ్చు.',
      simpleText: `సులభ వివరణ: ${cleanSummary}. ఇది ముఖ్యమైన తాజా సమాచారం.`,
      language: 'te'
    };
  } else if (langKey === 'bn') {
    return {
      category: 'general',
      explanation: 'এটি একটি গুরুত্বপূর্ণ জাতীয় বা আন্তর্জাতিক সংবাদ।',
      impact: 'এর মাধ্যমে আপনি চলতি খবরাখবর সহজে জেনে নিতে পারেন।',
      simpleText: `সহজ কথায়: ${cleanSummary}। এটি একটি গুরুত্বপূর্ণ খবর।`,
      language: 'bn'
    };
  } else if (langKey === 'mr') {
    return {
      category: 'general',
      explanation: 'ही एक महत्त्वाची राष्ट्रीय किंवा आंतरराष्ट्रीय बातमी आहे.',
      impact: 'यामुळे तुम्हाला ताज्या घडामोडी समजण्यास मदत होईल.',
      simpleText: `सोप्या शब्दांत: ${cleanSummary}। ही आजची महत्त्वाची घडामोड आहे.`,
      language: 'mr'
    };
  } else {
    return {
      category: 'general',
      explanation: 'This is a notable regional or international development.',
      impact: 'Staying informed helps you understand current affairs and regional safety.',
      simpleText: `In simple words: ${cleanSummary}. This is an important current affairs update.`,
      language: 'en'
    };
  }
}

/**
 * Generate Personalized AI-Based Opinions
 * Adapts tone, depth, and actionable insights specifically for:
 * 1. Analyst: Strategic intelligence assessment, threat level, systemic & defense implications
 * 2. Casual user: Citizen AI perspective, everyday life impact, commute & household advice
 * 3. Accessibility mode: Simple, jargon-free spoken insight ready for voice playback
 */
export function generatePersonalizedOpinion(title = '', description = '', persona = 'Casual user', language = 'en') {
  const t = (title + ' ' + description).toLowerCase();
  const lang = (language || 'en').toLowerCase();

  // Determine domain theme
  let theme = 'general';
  if (t.includes('bridge') || t.includes('road') || t.includes('metro') || t.includes('traffic') || t.includes('waterlogging') || t.includes('power cut') || t.includes('shutdown') || t.includes('bus') || t.includes('train') || t.includes('flight') || t.includes('corporation') || t.includes('flyover') || t.includes('smart city')) {
    theme = 'civic_transit';
  } else if (t.includes('rain') || t.includes('flood') || t.includes('cyclone') || t.includes('storm') || t.includes('weather') || t.includes('alert') || t.includes('heatwave')) {
    theme = 'weather_safety';
  } else if (t.includes('robbed') || t.includes('murder') || t.includes('arrest') || t.includes('police') || t.includes('waylaid') || t.includes('crime') || t.includes('scam') || t.includes('cyber') || t.includes('fraud') || t.includes('cbi') || t.includes('custody')) {
    theme = 'crime_security';
  } else if (t.includes('petrol') || t.includes('diesel') || t.includes('gold') || t.includes('price') || t.includes('inflation') || t.includes('tax') || t.includes('market') || t.includes('rbi') || t.includes('bank') || t.includes('salary') || t.includes('gst')) {
    theme = 'economy_costs';
  } else if (t.includes('hospital') || t.includes('doctor') || t.includes('dengue') || t.includes('fever') || t.includes('health') || t.includes('medical') || t.includes('drug') || t.includes('vaccine')) {
    theme = 'health_public';
  } else if (t.includes('war') || t.includes('strike') || t.includes('missile') || t.includes('military') || t.includes('treaty') || t.includes('minister') || t.includes('election') || t.includes('border') || t.includes('defense') || t.includes('ceasefire')) {
    theme = 'geopolitics_defense';
  }

  // 1. ANALYST PERSONA (Strategic Intel Assessment)
  if (persona === 'Analyst') {
    const assessments = {
      civic_transit: {
        opinion: `Critical municipal infrastructure bottleneck identified. Arterial transit disruption affects localized commercial flow, workforce mobility, and logistics response times. Recommended advisory: Monitor alternative secondary arteries and urban transit load.`,
        keyTakeaway: 'Infrastructure strain on urban transit corridor; expect supply & commuter latency.',
        impactLevel: 'ELEVATED',
        badge: 'Strategic Intel Assessment'
      },
      weather_safety: {
        opinion: `Hydro-meteorological risk elevation detected. Threat to ground transport corridors, power substations, and supply-chain continuity. Heightened municipal disaster response and asset protection posture warranted.`,
        keyTakeaway: 'High severe weather disruption risk; critical services on alert.',
        impactLevel: 'HIGH',
        badge: 'Disaster Threat Assessment'
      },
      crime_security: {
        opinion: `Local security and law-enforcement vector active. Tactical response and investigative proceedings underway. Operational risk to nearby commercial establishments remains localized.`,
        keyTakeaway: 'Localized security incident; commercial asset vigilance advised.',
        impactLevel: 'ELEVATED',
        badge: 'Security Vector Analysis'
      },
      economy_costs: {
        opinion: `Fiscal volatility and macro-economic rate adjustments impacting consumer purchasing power and municipal trade indexes. Risk of downstream inflationary pressures across regional service sectors.`,
        keyTakeaway: 'Macro-economic cost volatility; pricing adjustments expected.',
        impactLevel: 'MODERATE',
        badge: 'Macro Economic Intel'
      },
      health_public: {
        opinion: `Epidemiological alert and public health infrastructure monitoring active. Capacity utilization in regional clinics and emergency healthcare supply networks under observation.`,
        keyTakeaway: 'Public health vigilance required; medical resources mobilised.',
        impactLevel: 'ELEVATED',
        badge: 'Biosecurity & Health Intel'
      },
      geopolitics_defense: {
        opinion: `Geopolitical sovereignty tension or strategic realignment observed. Direct influence on regional bilateral stability, defense readiness posture, and strategic international commerce corridors.`,
        keyTakeaway: 'Geopolitical realignment impacting regional defense and market stability.',
        impactLevel: 'HIGH',
        badge: 'Geopolitical Threat Assessment'
      },
      general: {
        opinion: `Significant regional dispatch under intelligence monitoring. Policy ramifications and municipal governance actions likely to influence localized stability and administrative timelines.`,
        keyTakeaway: 'Monitored administrative development with regional policy impact.',
        impactLevel: 'INFORMATIONAL',
        badge: 'Strategic Assessment'
      }
    };

    const sel = assessments[theme] || assessments.general;
    return {
      persona: 'Analyst',
      badge: sel.badge,
      impactLevel: sel.impactLevel,
      opinion: sel.opinion,
      keyTakeaway: sel.keyTakeaway,
      speechText: `Strategic intelligence assessment: ${sel.opinion} Key takeaway: ${sel.keyTakeaway}`
    };
  }

  // 2. CASUAL USER PERSONA (Citizen AI Perspective / Everyday Advice)
  if (persona === 'Casual user') {
    const citizenPerspectives = {
      civic_transit: {
        en: {
          opinion: `If you live or travel near this area, expect traffic delays, route diversions, or temporary power disruptions. Plan your travel 15-20 minutes earlier and check live map navigation before heading out.`,
          keyTakeaway: `Plan extra travel time and use alternative routes if commuting nearby.`,
          badge: `Citizen AI Perspective`
        },
        ta: {
          opinion: `இந்தப் பகுதியில் நீங்கள் பயணம் செய்தால் அல்லது வசித்தால், போக்குவரத்து நெரிசல் அல்லது மாற்றுப் பாதைகளை எதிர்பார்க்கலாம். புறப்படுவதற்கு முன் 15 நிமிடங்கள் முன்னதாக திட்டமிட்டு செல்லுங்கள்.`,
          keyTakeaway: `பயண நேரத்தை முன்கூட்டியே திட்டமிடுங்கள்; மாற்றுப் பாதைகளைப் பயன்படுத்துங்கள்.`,
          badge: `பொதுமக்கள் பார்வை`
        },
        hi: {
          opinion: `यदि आप इस इलाके में रहते हैं या यात्रा कर रहे हैं, तो ट्रैफिक जाम या डायवर्जन की संभावना है। निकलने से पहले थोड़ा अतिरिक्त समय लेकर चलें।`,
          keyTakeaway: `यात्रा के लिए 15-20 मिनट का अतिरिक्त समय लेकर चलें।`,
          badge: `नागरिक एआई राय`
        }
      },
      weather_safety: {
        en: {
          opinion: `Bad weather or rain alert in your area. Keep umbrellas and emergency lights ready, avoid parking vehicles under trees or in low-lying waterlogged streets.`,
          keyTakeaway: `Stay safe indoors if possible and avoid waterlogged roads.`,
          badge: `Weather Safety Advisory`
        },
        ta: {
          opinion: `உங்கள் பகுதியில் தீவிர வானிலை அல்லது மழை எச்சரிக்கை விடுக்கப்பட்டுள்ளது. தேவை இல்லாமல் வெளியே செல்ல வேண்டாம்; தாழ்வான பகுதிகளில் வாகனங்களை நிறுத்தாதீர்கள்.`,
          keyTakeaway: `பாதுகாப்பாக வீட்டில் இருங்கள்; மழைநீர் தேங்கிய இடங்களைத் தவிர்க்கவும்.`,
          badge: `வானிலை பாதுகாப்பு ஆலோசனை`
        },
        hi: {
          opinion: `मौसम विभाग ने बारिश या खराब मौसम की चेतावनी जारी की है। अनावश्यक रूप से बाहर न निकलें और जलभराव वाले रास्तों से बचें।`,
          keyTakeaway: `सुरक्षित रहें और जलभराव वाले रास्तों से बचें।`,
          badge: `मौसम सुरक्षा सलाह`
        }
      },
      crime_security: {
        en: {
          opinion: `Police and authorities are actively managing this situation. Residents in nearby neighborhoods are advised to be alert and report any suspicious activity to local police helplines.`,
          keyTakeaway: `Stay vigilant in local neighborhoods and keep emergency numbers handy.`,
          badge: `Community Safety Notice`
        },
        ta: {
          opinion: `காவல்துறையினர் தீவிர விசாரணை மேற்கொண்டு வருகின்றனர். அருகில் உள்ள பொதுமக்கள் விழிப்புடன் இருக்குமாறும், சந்தேகத்திற்கிடமான நடமாட்டங்களை காவல்துறையிடம் தெரிவிக்குமாறும் கேட்டுக் கொள்ளப்படுகிறார்கள்.`,
          keyTakeaway: `விழிப்புடன் இருங்கள்; அவசர உதவி எண்களை நினைவில் கொள்ளுங்கள்.`,
          badge: `சமூக பாதுகாப்பு குறிப்பு`
        },
        hi: {
          opinion: `पुलिस इस मामले पर कड़ी नजर रख रही है। आसपास के निवासियों को सतर्क रहने और किसी भी संदिग्ध गतिविधि की सूचना पुलिस को देने की सलाह दी जाती है।`,
          keyTakeaway: `आसपास सतर्क रहें और हेल्पलाइन नंबर पास रखें।`,
          badge: `सामुदायिक सुरक्षा सलाह`
        }
      },
      economy_costs: {
        en: {
          opinion: `This price change or economic news may directly impact your monthly grocery bill, fuel expenses, or savings. It is a good time to review your immediate weekly budget.`,
          keyTakeaway: `Keep an eye on household expenses and fuel costs this week.`,
          badge: `Household Budget Tip`
        },
        ta: {
          opinion: `இந்த விலை மாற்றம் உங்கள் மாதாந்திர மளிகை, காய்கறி அல்லது எரிபொருள் செலவுகளை பாதிக்கலாம். வரவிருக்கும் வாரத்திற்கான வரவு செலவு திட்டத்தை சரிபார்க்கவும்.`,
          keyTakeaway: `இந்த வாரம் குடும்ப செலவுகள் மற்றும் எரிபொருள் செலவுகளை கவனியுங்கள்.`,
          badge: `குடும்ப வரவு செலவு ஆலோசனை`
        },
        hi: {
          opinion: `इस मूल्य परिवर्तन से आपके मासिक राशन, पेट्रोल-डीजल या रसोई के बजट पर असर पड़ सकता है। इस सप्ताह अपने खर्चों पर ध्यान दें।`,
          keyTakeaway: `इस सप्ताह घरेलू बजट और यात्रा खर्च पर नजर रखें।`,
          badge: `घरेलू बजट सलाह`
        }
      },
      general: {
        en: {
          opinion: `An important local or national update. Knowing this helps you make informed choices about your work, travel, and community conversations today.`,
          keyTakeaway: `Stay informed with verified local facts.`,
          badge: `Citizen Insight`
        },
        ta: {
          opinion: `இது உங்கள் பகுதி அல்லது நாட்டின் முக்கியமான நடப்பு நிகழ்வு. இந்த தகவலை தெரிந்து கொள்வது உங்கள் அன்றாட முடிவுகளுக்கு உதவும்.`,
          keyTakeaway: `உண்மையான உள்ளூர் தகவல்களை அறிந்து விழிப்புடன் இருங்கள்.`,
          badge: `மக்களுக்கான தகவல்`
        },
        hi: {
          opinion: `यह आपके क्षेत्र का एक महत्वपूर्ण समाचार है। इससे अवगत रहने से आपको अपने दैनिक निर्णय लेने में मदद मिलेगी।`,
          keyTakeaway: `सटीक स्थानीय जानकारी से अपडेट रहें।`,
          badge: `नागरिक सूचना`
        }
      }
    };

    const selDict = citizenPerspectives[theme] || citizenPerspectives.general;
    const localized = selDict[lang] || selDict.en;
    return {
      persona: 'Casual user',
      badge: localized.badge,
      impactLevel: 'COMMUNITY',
      opinion: localized.opinion,
      keyTakeaway: localized.keyTakeaway,
      speechText: `${localized.badge}: ${localized.opinion} ${localized.keyTakeaway}`
    };
  }

  // 3. COMMON PERSON PERSONA
  if (persona === 'Common person' || persona === 'common_person') {
    const commonPerspectives = {
      civic_transit: {
        en: { opinion: 'Local bus, metro, or arterial roads may face delays. Plan 15 minutes ahead for daily transit.', takeaway: 'Check traffic maps and leave slightly earlier.', badge: 'Everyday Transit Advice' },
        ta: { opinion: 'உள்ளூர் பேருந்து, மெட்ரோ அல்லது முக்கிய சாலைகளில் தாமதம் ஏற்படலாம். 15 நிமிடங்கள் முன்னதாக புறப்படுங்கள்.', takeaway: 'போக்குவரத்தை சரிபார்த்து முன்கூட்டியே செல்லுங்கள்.', badge: 'அன்றாட பயண ஆலோசனை' },
        hi: { opinion: 'स्थानीय बस, मेट्रो या मुख्य सड़कों पर देरी हो सकती है। 15 मिनट पहले निकलने की योजना बनाएं।', takeaway: 'ट्रैफिक देखकर समय से पहले निकलें।', badge: 'दैनिक यात्रा सलाह' }
      },
      weather_safety: {
        en: { opinion: 'Weather disruption or rainfall alert. Keep essentials safe and avoid low-lying roads.', takeaway: 'Stay indoors if storm worsens and carry an umbrella.', badge: 'Weather Safety Advice' },
        ta: { opinion: 'மழை அல்லது புயல் எச்சரிக்கை. தாழ்வான பகுதிகளைத் தவிர்த்து அத்தியாவசிய பொருட்களை பாதுகாக்கவும்.', takeaway: 'மழை தீவிரமடைந்தால் பாதுகாப்பாக இருங்கள்.', badge: 'வானிலை பாதுகாப்பு குறிப்பு' },
        hi: { opinion: 'खराब मौसम या बारिश का अलर्ट। जरूरी चीजों को सुरक्षित रखें और जलभराव वाले रास्तों से बचें।', takeaway: 'मौसम बिगड़ने पर घर पर रहें।', badge: 'मौसम सुरक्षा सलाह' }
      },
      economy_costs: {
        en: { opinion: 'Price shifts on vegetables, groceries, or household energy. Review weekly kitchen budget.', takeaway: 'Keep an eye on grocery and cooking gas rates.', badge: 'Household Budget Tip' },
        ta: { opinion: 'காய்கறி, மளிகை அல்லது மின்சார கட்டணத்தில் மாற்றம். மாதாந்திர சமையலறை செலவை கவனியுங்கள்.', takeaway: 'மளிகை மற்றும் எரிபொருள் செலவுகளை கவனியுங்கள்.', badge: 'குடும்ப பட்ஜெட் குறிப்பு' },
        hi: { opinion: 'सब्जी, राशन या रसोई गैस की कीमतों में बदलाव। घरेलू बजट पर थोड़ा ध्यान दें।', takeaway: 'मासिक राशन खर्च पर नजर रखें।', badge: 'घरेलू बजट सलाह' }
      },
      general: {
        en: { opinion: 'Notable everyday community update. Keeping informed helps manage daily family routines.', takeaway: 'Stay updated on verified local developments.', badge: 'Citizen Daily Brief' },
        ta: { opinion: 'முக்கியமான பொது நிகழ்வு. இது உங்கள் அன்றாட குடும்ப திட்டமிடலுக்கு உதவும்.', takeaway: 'உண்மையான உள்ளூர் செய்திகளை கவனியுங்கள்.', badge: 'மக்களுக்கான சுருக்கம்' },
        hi: { opinion: 'महत्वपूर्ण सामाजिक समाचार। इससे दैनिक दिनचर्या बेहतर तरीके से नियोजित होगी।', takeaway: 'सटीक जानकारी से अपडेट रहें।', badge: 'नागरिक दैनिक जानकारी' }
      }
    };
    const sel = commonPerspectives[theme] || commonPerspectives.general;
    const loc = sel[lang] || sel.en;
    return {
      persona: 'Common person',
      badge: loc.badge,
      impactLevel: 'EVERYDAY',
      opinion: loc.opinion,
      keyTakeaway: loc.takeaway,
      speechText: `${loc.badge}: ${loc.opinion} ${loc.takeaway}`
    };
  }

  // 4. FARMER PERSONA (Kisan Agrarian Intel & Plain Language)
  if (persona === 'Farmer' || persona === 'farmer') {
    const farmerPerspectives = {
      weather_safety: {
        en: { opinion: 'Rain, wind, or storm alert for agriculture. Protect open harvested crops, clear field drainage channels, and secure livestock.', takeaway: 'Cover harvested grain and check soil drainage immediately.', badge: 'Kisan Weather Advisory' },
        ta: { opinion: 'விவசாயத்திற்கான மழை அல்லது புயல் எச்சரிக்கை. அறுவடை செய்த பயிர்களை மூடி வைக்கவும், கால்நடைகளை பாதுகாப்பான கொட்டகையில் கட்டவும்.', takeaway: 'வயல் வடிகால்களை சரிசெய்து விளைபொருளை பாதுகாக்கவும்.', badge: 'உழவர் வானிலை எச்சரிக்கை' },
        hi: { opinion: 'खेती के लिए बारिश या आंधी की चेतावनी। कटी हुई फसल को ढकें, खेतों की जल निकासी ठीक करें और पशुओं को सुरक्षित रखें।', takeaway: 'फसल को भीगने से बचाएं और जल निकासी दुरुस्त करें।', badge: 'किसान मौसम सलाह' }
      },
      economy_costs: {
        en: { opinion: 'Diesel tariff, fertilizer rates, or wholesale Mandi crop prices fluctuating. Check government procurement and Mandi rates before selling.', takeaway: 'Compare local Mandi prices and track diesel subsidies.', badge: 'Mandi & Input Cost Alert' },
        ta: { opinion: 'டீசல் விலை, உரம் அல்லது மண்டி பயிர் கொள்முதல் விலையில் மாற்றம். விளைபொருளை விற்பதற்கு முன் அரசு கொள்முதல் நிலைய விலையை சரிபார்க்கவும்.', takeaway: 'உள்ளூர் மண்டி விலையை ஒப்பிட்டு விற்கவும்.', badge: 'உழவர் சந்தை & உர விலை தகவல்' },
        hi: { opinion: 'डीजल, खाद या मंडी में फसल के भाव में उतार-चढ़ाव। बेचने से पहले सरकारी खरीद केंद्र और मंडी भाव जरूर जांच लें।', takeaway: 'मंडी भाव की तुलना करें और खाद दरों पर नजर रखें।', badge: 'मंडी भाव व कृषि लागत' }
      },
      general: {
        en: { opinion: 'Important agricultural and rural policy update. May affect local irrigation, water reservoir releases, or farming subsidies.', takeaway: 'Check with local village administrative office or Kisan Kendra.', badge: 'Agrarian Intel Brief' },
        ta: { opinion: 'முக்கியமான விவசாய மற்றும் ஊரக செய்தி. பாசன நீர் திறப்பு அல்லது விவசாய மானியங்களுக்கு இது உதவக்கூடும்.', takeaway: 'உள்ளூர் வேளாண் விரிவாக்க மையத்தை தொடர்பு கொள்ளவும்.', badge: 'விவசாய முன்னேற்ற குறிப்பு' },
        hi: { opinion: 'महत्वपूर्ण कृषि व ग्रामीण समाचार। सिंचाई, नहर के पानी या सरकारी योजनाओं से जुड़ा हो सकता है।', takeaway: 'निकटतम किसान सेवा केंद्र से जानकारी लें।', badge: 'कृषि समाचार' }
      }
    };
    const sel = farmerPerspectives[theme] || farmerPerspectives.general;
    const loc = sel[lang] || sel.en;
    return {
      persona: 'Farmer',
      badge: loc.badge,
      impactLevel: 'AGRICO',
      opinion: loc.opinion,
      keyTakeaway: loc.takeaway,
      speechText: `${loc.badge}: ${loc.opinion} ${loc.takeaway}`
    };
  }

  // 5. STUDENT PERSONA (Academic & Digital Campus)
  if (persona === 'Student' || persona === 'student') {
    const studentPerspectives = {
      civic_transit: {
        en: { opinion: 'Transit disruptions may affect college buses, metro lines, or exam commute. Plan extra travel time to avoid reaching campus late.', takeaway: 'Leave 20 minutes early for classes and exams.', badge: 'Student Transit Advisory' },
        ta: { opinion: 'கல்லூரி பேருந்து அல்லது மெட்ரோ ரயில்களில் தாமதம் ஏற்படலாம். வகுப்புகள் மற்றும் தேர்வுகளுக்கு முன்னதாக கிளம்பவும்.', takeaway: 'தேர்வுகளுக்கு 20 நிமிடங்கள் முன்னதாக புறப்படுங்கள்.', badge: 'மாணவர் பயண ஆலோசனை' },
        hi: { opinion: 'कॉलेज बस या मेट्रो में देरी संभव है। कक्षाओं और परीक्षाओं के लिए समय से 20 मिनट पहले निकलें।', takeaway: 'परीक्षा व क्लास के लिए समय पूर्व निकलें।', badge: 'छात्र यात्रा सलाह' }
      },
      crime_security: {
        en: { opinion: 'Cyber scam or campus digital phishing alert. Never share student IDs, OTPs, or campus portal passwords over suspicious links.', takeaway: 'Secure your student portal and change default passwords.', badge: 'Digital Campus Safety' },
        ta: { opinion: 'சைபர் மோசடி எச்சரிக்கை. மாணவர் அடையாள எண், கடவுச்சொல் அல்லது OTP-யை யாரிடமும் பகிர வேண்டாம்.', takeaway: 'மாணவர் இணைய கணக்குகளை பாதுகாப்பாக வையுங்கள்.', badge: 'மாணவர் டிஜிட்டல் பாதுகாப்பு' },
        hi: { opinion: 'डिजिटल फ्रॉड या साइबर अलर्ट। छात्र पोर्टल पासवर्ड या ओटीपी किसी भी अनजान लिंक पर साझा न करें।', takeaway: 'छात्र अकाउंट की सुरक्षा जांचें और पासवर्ड बदलें।', badge: 'छात्र साइबर सुरक्षा' }
      },
      general: {
        en: { opinion: 'Key educational, science, or technology dispatch. Useful for general knowledge, competitive exams, and research papers.', takeaway: 'Note key dates and terms for current affairs.', badge: 'Academic Knowledge Brief' },
        ta: { opinion: 'கல்வி மற்றும் அறிவியல் சார்ந்த முக்கிய நிகழ்வு. போட்டித் தேர்வுகள் மற்றும் பொது அறிவுக்கு இது பயனுள்ளதாக இருக்கும்.', takeaway: 'நடப்பு நிகழ்வு குறிப்புகளை குறித்துக் கொள்ளுங்கள்.', badge: 'கல்விசார் அறிவு சுருக்கம்' },
        hi: { opinion: 'शिक्षा व विज्ञान से जुड़ी महत्वपूर्ण खबर। प्रतियोगी परीक्षाओं और सामान्य ज्ञान के लिए उपयोगी।', takeaway: 'करेंट अफेयर्स के लिए मुख्य बिंदु नोट करें।', badge: 'शैक्षणिक ज्ञान जानकारी' }
      }
    };
    const sel = studentPerspectives[theme] || studentPerspectives.general;
    const loc = sel[lang] || sel.en;
    return {
      persona: 'Student',
      badge: loc.badge,
      impactLevel: 'ACADEMIC',
      opinion: loc.opinion,
      keyTakeaway: loc.takeaway,
      speechText: `${loc.badge}: ${loc.opinion} ${loc.takeaway}`
    };
  }

  // 6. BUSINESS PERSONA (Enterprise & Trade Intel)
  if (persona === 'Business' || persona === 'business') {
    const businessPerspectives = {
      economy_costs: {
        en: { opinion: 'Fiscal tariff, GST, or currency fluctuation impacting enterprise cost-of-goods and working capital. Review supplier invoicing and credit lines.', takeaway: 'Buffer inventory purchases and review vendor contracts.', badge: 'Enterprise Fiscal Intel' },
        ta: { opinion: 'வரி மற்றும் நாணய மாற்று விகித மாற்றங்கள் நிறுவன இயக்க செலவுகளை பாதிக்கலாம். சரக்கு இருப்பு மற்றும் விலை பட்டியலை மறுஆய்வு செய்யுங்கள்.', takeaway: 'சரக்கு இருப்பை திட்டமிட்டு மூலப்பொருள் செலவுகளை கவனியுங்கள்.', badge: 'வணிக நிதி உளவு' },
        hi: { opinion: 'टैक्स, ब्याज दर या मुद्रा में उतार-चढ़ाव से व्यापारिक लागत पर असर संभव है। सप्लायर बिलिंग और इन्वेंट्री की समीक्षा करें।', takeaway: 'इन्वेंट्री की अग्रिम योजना बनाएं और खर्चों पर नियंत्रण रखें।', badge: 'व्यापारिक वित्तीय सलाह' }
      },
      civic_transit: {
        en: { opinion: 'Commercial freight corridor latency or port congestion. Supply chain lead times may lengthen by 3-7 operational business days.', takeaway: 'Communicate with freight forwarders and explore secondary logistics routes.', badge: 'Supply Chain & Freight Alert' },
        ta: { opinion: 'சரக்கு போக்குவரத்து அல்லது துறைமுக நெரிசலால் சரக்கு வருகை தாமதமாகலாம். 3 முதல் 7 நாட்கள் கூடுதல் கால அவகாசம் தேவைப்படலாம்.', takeaway: 'சரக்கு அனுப்புநர்களுடன் பேசி மாற்று வழிகளை பரிசீலிக்கவும்.', badge: 'விநியோக சங்கிலி எச்சரிக்கை' },
        hi: { opinion: 'माल ढुलाई या पोर्ट पर भीड़ के कारण आपूर्ति में 3 से 7 दिन की देरी हो सकती है। सप्लायर्स से संपर्क बनाए रखें।', takeaway: 'वैकल्पिक लॉजिस्टिक्स मार्गों की योजना बनाएं।', badge: 'सप्लाई चेन व लॉजिस्टिक्स' }
      },
      general: {
        en: { opinion: 'Strategic regulatory or macro-market event. Compliance requirements and localized business continuity plans should be validated.', takeaway: 'Verify corporate operational readiness and compliance policies.', badge: 'Corporate Risk Brief' },
        ta: { opinion: 'அரசு கொள்கை மற்றும் ஒழுங்குமுறை மாற்றம். நிறுவனத்தின் சட்டவிதிகள் மற்றும் வர்த்தக தொடர்ச்சியை உறுதிப்படுத்தவும்.', takeaway: 'நிறுவன விதிமுறைகள் மற்றும் செயல்பாடுகளை சரிபார்க்கவும்.', badge: 'கார்ப்பரேட் இடர் குறிப்பு' },
        hi: { opinion: 'नियामक या बाजार से जुड़ा रणनीतिक घटनाक्रम। अनुपालन नीतियों और व्यावसायिक निरंतरता की समीक्षा करें।', takeaway: 'व्यापारिक नियमों और नीतियों की जांच करें।', badge: 'कॉर्पोरेट जोखिम सलाह' }
      }
    };
    const sel = businessPerspectives[theme] || businessPerspectives.general;
    const loc = sel[lang] || sel.en;
    return {
      persona: 'Business',
      badge: loc.badge,
      impactLevel: 'COMMERCIAL',
      opinion: loc.opinion,
      keyTakeaway: loc.takeaway,
      speechText: `${loc.badge}: ${loc.opinion} ${loc.takeaway}`
    };
  }

  // 7. ACCESSIBILITY MODE (Simple Spoken Guidance)
  const simpleGuide = explainNews(title, description, language);
  return {
    persona: 'Accessibility mode',
    badge: lang === 'ta' ? 'எளிய குரல் விளக்கம்' : (lang === 'hi' ? 'सरल आवाज सलाह' : 'Simple Voice Guidance'),
    impactLevel: 'CLEAR',
    opinion: simpleGuide.explanation,
    keyTakeaway: simpleGuide.impact,
    speechText: simpleGuide.simpleText
  };
}
