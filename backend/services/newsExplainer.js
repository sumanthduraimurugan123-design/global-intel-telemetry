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
  const cleanTitle = (title || '').split(' - ')[0].trim();
  const fullText = (title + ' ' + (description || '')).toLowerCase();
  const lang = (language || 'en').toLowerCase();

  // Keyword flags
  const isAgri = /crop|farm|wheat|rice|mandi|paddy|soil|rain|flood|drought|monsoon|fertilizer|diesel|sugar|harvest|agri|kisan|grain|irrigation|cotton|livestock|vegetable|onion|potato|milk|land|loan|subsidy/i.test(fullText);
  const isWeather = /weather|rain|flood|storm|cyclone|heatwave|drought|monsoon|snow|temperature|cloud|wind|disaster|typhoon/i.test(fullText);
  const isEcon = /price|tax|market|inflation|cost|bank|rbi|rupee|dollar|economy|budget|trade|tariff|stock|share|loan|interest|gdp|finance|export|import/i.test(fullText);
  const isGeo = /war|strike|missile|military|army|defense|border|treaty|sanction|russia|ukraine|israel|gaza|iran|china|us|trump|biden|putin|modi|minister|election|politic|protest|security|un|nato/i.test(fullText);
  const isTech = /cyber|ai|hack|tech|chip|data|software|app|digital|cloud|google|apple|microsoft|openai|bot|internet|phone|network|battery/i.test(fullText);
  const isHealth = /health|hospital|disease|virus|fever|medical|doctor|vaccine|drug|ebola|dengue|cancer|covid|clinic|medicine/i.test(fullText);
  const isTransit = /traffic|road|bridge|metro|bus|train|flight|airline|airport|port|freight|shipping|ship|canal|railway|highway/i.test(fullText);

  // Short snippet of title for contextual injection
  const topicSnippet = cleanTitle.length > 55 ? cleanTitle.substring(0, 52) + '...' : cleanTitle;
  const pLower = (persona || '').toLowerCase();

  // 1. FARMER / KISAN PERSONA
  if (pLower.includes('farmer') || pLower.includes('kisan')) {
    let opinion = '';
    let keyTakeaway = '';
    let badge = lang === 'ta' ? '🌾 உழவர் வேளாண் ஆலோசனை' : (lang === 'hi' ? '🌾 किसान कृषि सलाह' : '🌾 Kisan Agrarian Advisory');

    if (isAgri || isWeather) {
      opinion = lang === 'ta' 
        ? `வேளாண் எச்சரிக்கை: "${topicSnippet}" விளைபொருட்கள், பாசன நீர் மற்றும் அறுவடை திட்டங்களை நேரடியாக பாதிக்கலாம்.`
        : (lang === 'hi'
          ? `कृषि अलर्ट: "${topicSnippet}" फसल कटाई, सिंचाई और मंडी भाव को प्रभावित कर सकता है।`
          : `Direct Agrarian Impact: "${topicSnippet}" may affect crop harvesting, soil moisture, or Mandi sales.`);
      keyTakeaway = lang === 'ta' ? 'வயல் வடிகால் மற்றும் அறுவடை தானியங்களை பாதுகாக்கவும்.' : (lang === 'hi' ? 'खेतों की जल निकासी और कटी फसल सुरक्षित करें।' : 'Check field drainage and store harvested grain safely.');
    } else if (isEcon) {
      opinion = lang === 'ta' 
        ? `சந்தை எச்சரிக்கை: "${topicSnippet}" உரம், டீசல் கட்டணம் மற்றும் உள்ளூர் மண்டி விலையில் மாற்றத்தை ஏற்படுத்தலாம்.`
        : (lang === 'hi'
          ? `बाजार अलर्ट: "${topicSnippet}" डीजल, खाद की लागत और मंडी में उपज के दामों को प्रभावित कर सकता है।`
          : `Input Cost Alert: "${topicSnippet}" could influence diesel prices, fertilizer rates, or regional crop valuation.`);
      keyTakeaway = lang === 'ta' ? 'கொள்முதல் விலைகளை ஒப்பிட்டு விளைபொருளை விற்கவும்.' : (lang === 'hi' ? 'मंडी भाव और सरकारी खरीद केंद्रों की तुलना करें।' : 'Compare local Mandi rates before selling your produce.');
    } else if (isGeo || isTransit) {
      opinion = lang === 'ta'
        ? `சரக்கு வழித்தடம்: "${topicSnippet}" சர்வதேச டீசல் மற்றும் உரம் இறக்குமதி செலவில் மறைமுக தாக்கம் தரலாம்.`
        : (lang === 'hi'
          ? `लॉजिस्टिक्स अपडेट: "${topicSnippet}" डीजल और आयातित खाद की आपूर्ति को प्रभावित कर सकता है।`
          : `Supply Corridor Brief: "${topicSnippet}" affects international fuel transit and fertilizer import logistics.`);
      keyTakeaway = lang === 'ta' ? 'டீசல் மற்றும் உரம் இருப்பை முன்கூட்டியே கவனியுங்கள்.' : (lang === 'hi' ? 'डीजल और उर्वरक आपूर्ति पर नजर रखें।' : 'Monitor regional fuel and fertilizer stock levels.');
    } else if (isTech) {
      opinion = lang === 'ta'
        ? `டிஜிட்டல் எச்சரிக்கை: "${topicSnippet}" ஆன்லைன் விவசாய போலி குறுஞ்செய்திகளிடம் எச்சரிக்கையாக இருங்கள்.`
        : (lang === 'hi'
          ? `डिजिटल सुरक्षा: "${topicSnippet}" कृषि योजनाओं के नाम पर आने वाले फर्जी मैसेज से सावधान रहें।`
          : `Digital Safety Brief: "${topicSnippet}" highlights the need to avoid agricultural subsidy phishing scams.`);
      keyTakeaway = lang === 'ta' ? 'அரசு வேளாண் உதவி மையங்களை மட்டும் நம்புங்கள்.' : (lang === 'hi' ? 'केवल आधिकारिक किसान पोर्टल का उपयोग करें।' : 'Rely only on verified Kisan Kendra portals.');
    } else {
      opinion = lang === 'ta'
        ? `பொது நிகழ்வு: "${topicSnippet}" செய்தி உழவர் குடும்பங்களின் அன்றாட வாழ்கைக்கு மறைமுக தகவலாகும்.`
        : (lang === 'hi'
          ? `सामान्य समाचार: "${topicSnippet}" का कृषि कार्यों पर सीधा प्रभाव नहीं है, लेकिन ग्रामीण जनजीवन से जुड़ा है।`
          : `General Rural Overview: "${topicSnippet}" has no immediate crop threat, but carries general rural interest.`);
      keyTakeaway = lang === 'ta' ? 'அன்றாட விவசாய பணிகளை வழக்கம் போல் தொடரவும்.' : (lang === 'hi' ? 'नियमित खेती-किसानी कार्य सुचारू रखें।' : 'Continue routine farm management as planned.');
    }

    return { persona: 'Farmer', badge, impactLevel: 'AGRICO', opinion, keyTakeaway, speechText: `${badge}: ${opinion} ${keyTakeaway}` };
  }

  // 2. STUDENT PERSONA
  if (pLower.includes('student')) {
    let opinion = '';
    let keyTakeaway = '';
    let badge = lang === 'ta' ? '🎓 மாணவர் கல்வி உளவு' : (lang === 'hi' ? '🎓 छात्र शैक्षणिक दृष्टिकोण' : '🎓 Student Perspective');

    if (isTech || isGeo) {
      opinion = lang === 'ta'
        ? `கல்விசார் குறிப்பு: "${topicSnippet}" போட்டித் தேர்வுகள் மற்றும் நடப்பு நிகழ்வுகளுக்கு முக்கிய தலைப்பாகும்.`
        : (lang === 'hi'
          ? `करेंट अफेयर्स बिंदु: "${topicSnippet}" प्रतियोगी परीक्षाओं और सामान्य अध्ययन के लिए महत्वपूर्ण टॉपिक है।`
          : `Academic Relevance: "${topicSnippet}" is a valuable case study for current affairs, competitive exams, and policy studies.`);
      keyTakeaway = lang === 'ta' ? 'தேர்வு குறிப்புகளில் இந்த நிகழ்வை குறித்துக் கொள்ளுங்கள்.' : (lang === 'hi' ? 'परीक्षा के दृष्टिकोण से मुख्य बिंदु नोट करें।' : 'Note key dates and geopolitical terms for exam prep.');
    } else if (isTransit || isWeather) {
      opinion = lang === 'ta'
        ? `பயண எச்சரிக்கை: "${topicSnippet}" கல்லூரி பேருந்துகள் மற்றும் தேர்வு நேர பயணத்தில் தாமதம் ஏற்படுத்தலாம்.`
        : (lang === 'hi'
          ? `कॉलेज यात्रा अलर्ट: "${topicSnippet}" कक्षाओं और परीक्षाओं के लिए यात्रा में देरी कर सकता है।`
          : `Campus Commute Advisory: "${topicSnippet}" may impact college bus routes, metro timing, or exam arrival.`);
      keyTakeaway = lang === 'ta' ? 'வகுப்புகளுக்கு 20 நிமிடங்கள் முன்னதாக புறப்படுங்கள்.' : (lang === 'hi' ? 'क्लास और एग्जाम के लिए 20 मिनट पहले निकलें।' : 'Leave 20 minutes early for campus exams or classes.');
    } else {
      opinion = lang === 'ta'
        ? `பொது அறிவியல்/சமூக செய்தி: "${topicSnippet}" பற்றிய விழிப்புணர்வு உங்களின் பொது அறிவை உயர்த்தும்.`
        : (lang === 'hi'
          ? `सामान्य ज्ञान: "${topicSnippet}" से अवगत रहने से आपकी व्यावहारिक समझ बढ़ेगी।`
          : `General Knowledge Brief: "${topicSnippet}" provides practical awareness for research and general discussions.`);
      keyTakeaway = lang === 'ta' ? 'நம்பகமான செய்திகளை மட்டும் வாசியுங்கள்.' : (lang === 'hi' ? 'सटीक तथ्यों से अपडेट रहें।' : 'Verify facts before using in academic discussions.');
    }

    return { persona: 'Student', badge, impactLevel: 'ACADEMIC', opinion, keyTakeaway, speechText: `${badge}: ${opinion} ${keyTakeaway}` };
  }

  // 3. BUSINESS PERSONA
  if (pLower.includes('business')) {
    let opinion = '';
    let keyTakeaway = '';
    let badge = lang === 'ta' ? '💼 நிறுவன வணிக உளவு' : (lang === 'hi' ? '💼 व्यापारिक जोखिम विश्लेषण' : '💼 Business Intel');

    if (isEcon || isTransit || isGeo) {
      opinion = lang === 'ta'
        ? `வர்த்தக தாக்கம்: "${topicSnippet}" விநியோக சங்கிலி, சரக்கு கட்டணம் மற்றும் செயல்பாட்டு செலவை பாதிக்கலாம்.`
        : (lang === 'hi'
          ? `व्यापारिक प्रभाव: "${topicSnippet}" सप्लाई चेन, फ्रेट दर और परिचालन लागत को प्रभावित कर सकता है।`
          : `Enterprise Impact: "${topicSnippet}" signals supply chain friction, freight surcharge risk, or input price shifts.`);
      keyTakeaway = lang === 'ta' ? 'சரக்கு இருப்பை திட்டமிட்டு விநியோக வழிகளை சரிபார்க்கவும்.' : (lang === 'hi' ? 'इन्वेंट्री बफर रखें और सप्लायर अनुबंध जांचें।' : 'Buffer inventory and review vendor lead-times.');
    } else {
      opinion = lang === 'ta'
        ? `சந்தை சூழல்: "${topicSnippet}" வணிக சூழல் மற்றும் கார்ப்பரேட் கொள்கைகளில் கவனிக்க வேண்டிய நிகழ்வாகும்.`
        : (lang === 'hi'
          ? `बाजार स्थिति: "${topicSnippet}" कॉर्पोरेट नीतियों और व्यावसायिक माहौल से जुड़ा घटनाक्रम है।`
          : `Market Context: "${topicSnippet}" presents low operational risk, but warrants policy monitoring.`);
      keyTakeaway = lang === 'ta' ? 'நிறுவன சட்டவிதி இணக்கங்களை சரிபார்க்கவும்.' : (lang === 'hi' ? 'व्यापारिक नियमों की समीक्षा करें।' : 'Maintain standard operational compliance posture.');
    }

    return { persona: 'Business', badge, impactLevel: 'COMMERCIAL', opinion, keyTakeaway, speechText: `${badge}: ${opinion} ${keyTakeaway}` };
  }

  // 4. ANALYST PERSONA
  if (pLower.includes('analyst')) {
    const badge = '🛡️ Strategic Intel Assessment';
    const opinion = `Strategic Telemetry: "${topicSnippet}" analyzed. Assessment indicates localized policy or geopolitical ripple vectors with monitored operational risk index.`;
    const keyTakeaway = `Monitored dispatch; threat vectors evaluated for systemic stability.`;
    return { persona: 'Analyst', badge, impactLevel: 'ELEVATED', opinion, keyTakeaway, speechText: `${badge}: ${opinion} ${keyTakeaway}` };
  }

  // 5. ACCESSIBILITY MODE
  if (pLower.includes('accessibility')) {
    const badge = lang === 'ta' ? '🔊 எளிய குரல் விளக்கம்' : (lang === 'hi' ? '🔊 सरल आवाज सलाह' : '🔊 Simple Voice Guidance');
    const opinion = lang === 'ta' ? `செய்தி சுருக்கம்: "${topicSnippet}". இது ஒரு முக்கியமான தகவல்.` : (lang === 'hi' ? `समाचार सारांश: "${topicSnippet}"। यह एक जरूरी जानकारी है।` : `News Summary: "${topicSnippet}". Important update for awareness.`);
    const keyTakeaway = lang === 'ta' ? 'பாதுகாப்பாக விழிப்புடன் இருங்கள்.' : (lang === 'hi' ? 'सतर्क और सुरक्षित रहें।' : 'Stay safe and informed.');
    return { persona: 'Accessibility mode', badge, impactLevel: 'CLEAR', opinion, keyTakeaway, speechText: `${badge}: ${opinion} ${keyTakeaway}` };
  }

  // 6. CASUAL USER / COMMON PERSON
  const badge = lang === 'ta' ? '🏡 பொதுமக்கள் பார்வை' : (lang === 'hi' ? '🏡 नागरिक एआई राय' : '🏡 Everyday Citizen Advice');
  const opinion = lang === 'ta' 
    ? `அன்றாட பார்வை: "${topicSnippet}" தகவல் குடும்ப செலவு, உள்ளூர் பயணம் அல்லது சமூக வாழ்க்கையை பாதிக்கலாம்.`
    : (lang === 'hi' 
      ? `नागरिक राय: "${topicSnippet}" आपकी दैनिक दिनचर्या, राशन खर्च या स्थानीय यात्रा को प्रभावित कर सकता है।`
      : `Citizen View: "${topicSnippet}" affects daily routine, local transit, or household budget decisions.`);
  const keyTakeaway = lang === 'ta' ? 'உள்ளூர் நேரலை தகவல்களை அறிந்து செயல்படுங்கள்.' : (lang === 'hi' ? 'स्थानीय अपडेट देखकर योजना बनाएं।' : 'Plan daily routine with verified local facts.');

  return { persona: 'Common person', badge, impactLevel: 'EVERYDAY', opinion, keyTakeaway, speechText: `${badge}: ${opinion} ${keyTakeaway}` };
}
