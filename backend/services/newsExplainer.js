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

  const isAgri = /crop|farm|wheat|rice|mandi|paddy|soil|rain|flood|drought|monsoon|fertilizer|diesel|sugar|harvest|agri|kisan|grain|irrigation|cotton|livestock|vegetable|onion|potato|milk|land|loan|subsidy/i.test(fullText);
  const isWeather = /weather|rain|flood|storm|cyclone|heatwave|drought|monsoon|snow|temperature|cloud|wind|disaster|typhoon/i.test(fullText);
  const isEcon = /price|tax|market|inflation|cost|bank|rbi|rupee|dollar|economy|budget|trade|tariff|stock|share|loan|interest|gdp|finance|export|import/i.test(fullText);
  const isGeo = /war|strike|missile|military|army|defense|border|treaty|sanction|russia|ukraine|israel|gaza|iran|china|us|trump|biden|putin|modi|minister|election|politic|protest|security|un|nato/i.test(fullText);
  const isTech = /cyber|ai|hack|tech|chip|data|software|app|digital|cloud|google|apple|microsoft|openai|bot|internet|phone|network|battery/i.test(fullText);
  const isTransit = /traffic|road|bridge|metro|bus|train|flight|airline|airport|port|freight|shipping|ship|canal|railway|highway/i.test(fullText);
  const isPolicy = /law|policy|court|bill|act|parliament|government|rules|regulation|ban|order|verdict|supreme court/i.test(fullText);

  const topicSnippet = cleanTitle.length > 55 ? cleanTitle.substring(0, 52) + '...' : cleanTitle;
  const pLower = (persona || '').toLowerCase();

  // 1. FARMER / KISAN PERSONA
  if (pLower.includes('farmer') || pLower.includes('kisan')) {
    const badge = lang === 'ta' ? '🌾 உழவர் வேளாண் ஆலோசனை' : (lang === 'hi' ? '🌾 किसान कृषि सलाह' : '🌾 Kisan Agrarian Advisory');
    let opinion = '';
    let keyTakeaway = '';

    if (isAgri || isWeather) {
      opinion = lang === 'ta' 
        ? `வேளாண் எச்சரிக்கை: "${topicSnippet}" - பருவமழை, மண் ஈரப்பதம் மற்றும் அறுவடை திட்டங்களை நேரடியாக பாதிக்கலாம்.`
        : (lang === 'hi'
          ? `कृषि चेतावनी: "${topicSnippet}" - फसल कटाई, सिंचाई और मंडी आवक को प्रभावित कर सकता है।`
          : `Direct Agrarian Impact: "${topicSnippet}" - May directly affect field drainage, soil moisture, crop harvesting schedule, or Mandi arrivals.`);
      keyTakeaway = lang === 'ta' ? 'வயல் வடிகால் வசதியை சரிசெய்து, அறுவடை தானியங்களை உலர் சேமிப்பகத்தில் பாதுகாக்கவும்.' : (lang === 'hi' ? 'खेतों में जल निकासी सुनिश्चित करें और कटी फसल को शुष्क भंडारण में सुरक्षित रखें।' : 'Ensure field drainage, secure harvested produce in dry storage, and monitor local weather alerts.');
    } else if (isEcon) {
      opinion = lang === 'ta' 
        ? `சந்தை கட்டண மாற்றம்: "${topicSnippet}" - உரம், டீசல் விலை மற்றும் உள்ளூர் விளைபொருள் கொள்முதல் மண்டி விலையை பாதிக்கலாம்.`
        : (lang === 'hi'
          ? `बाजार मूल्य अलर्ट: "${topicSnippet}" - खाद, डीजल लागत और मंडी में फसलों के बिक्री भावों में फेरबदल कर सकता है।`
          : `Input Cost & Pricing Alert: "${topicSnippet}" - Influences fertilizer tariffs, diesel pump rates, and regional Mandi procurement prices.`);
      keyTakeaway = lang === 'ta' ? 'அரசு குறைந்தபட்ச ஆதரவு விலை (MSP) மற்றும் மண்டி விலைகளை ஒப்பிட்டு விற்கவும்.' : (lang === 'hi' ? 'सरकारी न्यूनतम समर्थन मूल्य (MSP) और स्थानीय मंडी भावों की तुलना करके उपज बेचें।' : 'Compare local Mandi rates with MSP benchmarks before executing crop sales.');
    } else if (isGeo || isTransit) {
      opinion = lang === 'ta'
        ? `சரக்கு வழித்தட செய்தி: "${topicSnippet}" - சர்வதேச கப்பல் நெரிசல் மற்றும் டீசல், உரம் இறக்குமதி விநியோகத்தை பாதிக்கலாம்.`
        : (lang === 'hi'
          ? `आपूर्ति मार्ग अपडेट: "${topicSnippet}" - अंतरराष्ट्रीय समुद्री परिवहन, डीजल और उर्वरक आयात लागत को प्रभावित कर सकता है।`
          : `Supply Logistics Brief: "${topicSnippet}" - Signals potential freight rate surcharges, diesel transport inflation, or fertilizer import delays.`);
      keyTakeaway = lang === 'ta' ? 'விவசாய தேவைக்கான உரம் மற்றும் டீசல் இருப்பை முன்கூட்டியே திட்டமிட்டு வைத்திருக்கவும்.' : (lang === 'hi' ? 'कृषि सीजन के लिए आवश्यक उर्वरक और ईंधन का अग्रिम स्टॉक सुनिश्चित करें।' : 'Pre-order essential farm inputs (fertilizer & fuel) to guard against regional transit delays.');
    } else if (isTech) {
      opinion = lang === 'ta'
        ? `டிஜிட்டல் விவசாய பாதுகாப்பு: "${topicSnippet}" - ஆன்லைன் விவசாய மானிய போலி லிங்குகள் மற்றும் தொலைபேசி மோசடிகளிடம் எச்சரிக்கை.`
        : (lang === 'hi'
          ? `डिजिटल कृषि सुरक्षा: "${topicSnippet}" - कृषि योजनाओं के नाम पर फर्जी व्हाट्सएप लिंक और ओटीपी फ्रॉड से सावधान रहें।`
          : `Agri-Tech & Scam Defense: "${topicSnippet}" - Be cautious of online agricultural subsidy phishing links or fake tractor loan calls.`);
      keyTakeaway = lang === 'ta' ? 'அரசு அதிகாரப்பூர்வ PM-Kisan அல்லது Krishi Vigyan மையங்களை மட்டும் அணுகவும்.' : (lang === 'hi' ? 'केवल आधिकारिक पीएम-किसान पोर्टल या नजदीकी कृषि विज्ञान केंद्र पर ही भरोसा करें।' : 'Rely exclusively on official PM-Kisan / Krishi Vigyan Kendra portals for financial aid.');
    } else {
      opinion = lang === 'ta'
        ? `கிராமப்புற பொது தகவல்: "${topicSnippet}" - விவசாயப்பணிகளுக்கு நேரடி அச்சுறுத்தல் இல்லை, கிராமப்புற சூழல் செய்தி.`
        : (lang === 'hi'
          ? `ग्रामीण जनजीवन अपडेट: "${topicSnippet}" - कृषि कार्यों पर कोई सीधा खतरा नहीं, सामान्य ग्रामीण जागरूकता खबर।`
          : `General Rural Context: "${topicSnippet}" - No immediate crop risk; presents general community awareness context.`);
      keyTakeaway = lang === 'ta' ? 'வழக்கமான விவசாய மற்றும் கால்நடை பராமரிப்பு பணிகளை தொடரவும்.' : (lang === 'hi' ? 'अपनी दैनिक खेती और पशुपालन गतिविधियों को सुचारू रूप से जारी रखें।' : 'Continue routine farm and livestock management as scheduled.');
    }

    return { persona: 'Farmer', badge, impactLevel: 'AGRICO', opinion, keyTakeaway, speechText: `${badge}: ${opinion} ${keyTakeaway}` };
  }

  // 2. STUDENT PERSONA
  if (pLower.includes('student')) {
    const badge = lang === 'ta' ? '🎓 மாணவர் கல்வி உளவு' : (lang === 'hi' ? '🎓 छात्र शैक्षणिक दृष्टिकोण' : '🎓 Student Academic Intel');
    let opinion = '';
    let keyTakeaway = '';

    if (isGeo || isPolicy) {
      opinion = lang === 'ta'
        ? `போட்டித் தேர்வு பகுப்பாய்வு: "${topicSnippet}" - யுபிஎஸ்சி, சர்வதேச உறவுகள் மற்றும் நடப்பு நிகழ்வுகள் தேர்வுகளுக்கு முக்கிய பாடம்.`
        : (lang === 'hi'
          ? `प्रतियोगी परीक्षा विश्लेषण: "${topicSnippet}" - यूपीएससी, अंतर्राष्ट्रीय संबंधों और सामान्य ज्ञान अध्ययन के लिए अति महत्वपूर्ण केस स्टडी।`
          : `Exam & Case Study Relevance: "${topicSnippet}" - Highly relevant for UPSC, GRE, international relations essays, and current affairs tests.`);
      keyTakeaway = lang === 'ta' ? 'முக்கிய தேதிகள், சர்வதேச அமைப்புகள் மற்றும் கொள்கை முடிவுகளை தேர்வு குறிப்பில் எழுதவும்.' : (lang === 'hi' ? 'अंतर्राष्ट्रीय संगठनों, तिथियों और नीतिगत बिंदुओं को अपने स्टडी नोट्स में दर्ज करें।' : 'Document treaty terms, dates, and participating nations for essay & interview prep.');
    } else if (isEcon) {
      opinion = lang === 'ta'
        ? `கல்வி நிதி & வேலைவாய்ப்பு: "${topicSnippet}" - கல்லூரி கட்டணம், மாணவர் கடன் வட்டி விகிதம் மற்றும் நிறுவன வளாக வேலைவாய்ப்பில் தாக்கம்.`
        : (lang === 'hi'
          ? `छात्र वित्त व प्लेसमेंट: "${topicSnippet}" - छात्र ऋण ब्याज दरों, तकनीकी गैजेट की लागत और कैंपस हायरिंग पर प्रभाव।`
          : `Education Finance & Career Outlook: "${topicSnippet}" - Impacts student loan interest rates, tech gadget pricing, and campus hiring trends.`);
      keyTakeaway = lang === 'ta' ? 'மாணவர் கடன்களுக்கான வட்டி சலுகைகள் மற்றும் கல்வி உதவித்தொகைகளை பரிசீலிக்கவும்.' : (lang === 'hi' ? 'एज्यूकेशन लोन सब्सिडी और स्कॉलरशिप अवसरों की सक्रियता से जांच करें।' : 'Track central bank interest rates and apply for institutional merit scholarships early.');
    } else if (isTech) {
      opinion = lang === 'ta'
        ? `டிஜிட்டல் & ஏஐ விழிப்புணர்வு: "${topicSnippet}" - இணைய பாதுகாப்பு, செயற்கை நுண்ணறிவு பயன்பாடு மற்றும் மாணவர் கணக்கு பாதுகாப்பு.`
        : (lang === 'hi'
          ? `डिजिटल व एआई सुरक्षा: "${topicSnippet}" - साइबर खतरों, ऑनलाइन स्टडी पोर्टल की सुरक्षा और एआई टूल्स के इस्तेमाल से संबंधित।`
          : `Tech & AI Literacy Brief: "${topicSnippet}" - Critical update on AI governance, cybersecurity hygiene, and institutional portal safety.`);
      keyTakeaway = lang === 'ta' ? 'கல்லூரி மின்னஞ்சல் கணக்குகளுக்கு இருபடி அங்கீகாரத்தை (2FA) செயல்படுத்தவும்.' : (lang === 'hi' ? 'अपने यूनिवर्सिटी और कॉलेज अकाउंट्स पर टू-फैक्टर ऑथेंटिकेशन (2FA) चालू रखें।' : 'Enable 2-Factor Authentication on university accounts and use verified AI data sources.');
    } else if (isTransit || isWeather) {
      opinion = lang === 'ta'
        ? `கல்லூரி பயண வழிகாட்டி: "${topicSnippet}" - மெட்ரோ/பேருந்து தாமதம், மழைநீர் தேக்கம் அல்லது தேர்வு மைய பயணத்தில் தாக்கம்.`
        : (lang === 'hi'
          ? `कॉलेज यात्रा सलाह: "${topicSnippet}" - भारी बारिश, ट्रैफिक या मेट्रो में देरी से परीक्षा केंद्र पहुंचने पर असर।`
          : `Campus Commute Advisory: "${topicSnippet}" - Severe weather or transit friction could impact exam arrival and lecture schedules.`);
      keyTakeaway = lang === 'ta' ? 'தேர்வு நாட்களில் வழக்கத்தை விட 30 நிமிடங்கள் முன்னதாக புறப்படவும்.' : (lang === 'hi' ? 'परीक्षा के दिनों में सामान्य समय से 30 मिनट पहले निकलने की योजना बनाएं।' : 'Allow a 30-minute arrival buffer for exams and verify live transit alerts before leaving.');
    } else {
      opinion = lang === 'ta'
        ? `பொது அறிவு பார்வை: "${topicSnippet}" - கல்வி விவாதங்கள் மற்றும் குழு விவாதங்களுக்கு பயனுள்ள உலகளாவிய செய்தி.`
        : (lang === 'hi'
          ? `सामान्य जागरूकता: "${topicSnippet}" - ग्रुप डिस्कशन और अकादमिक बहसों के लिए एक उपयोगी संदर्भ।`
          : `General Knowledge Brief: "${topicSnippet}" - Broadens academic perspective for seminar discussions and essays.`);
      keyTakeaway = lang === 'ta' ? 'நம்பகமான செய்தி ஆதாரங்களை ஒப்பிட்டு கருத்துக்களை உருவாக்கவும்.' : (lang === 'hi' ? 'तथ्यों की पुष्टि के लिए विश्वसनीय समाचार स्रोतों का संदर्भ लें।' : 'Cross-reference information with primary research papers before citing in assignments.');
    }

    return { persona: 'Student', badge, impactLevel: 'ACADEMIC', opinion, keyTakeaway, speechText: `${badge}: ${opinion} ${keyTakeaway}` };
  }

  // 3. BUSINESS PERSONA
  if (pLower.includes('business')) {
    const badge = lang === 'ta' ? '💼 நிறுவன வணிக உளவு' : (lang === 'hi' ? '💼 व्यापारिक जोखिम विश्लेषण' : '💼 Enterprise Risk & Business Intel');
    let opinion = '';
    let keyTakeaway = '';

    if (isGeo || isPolicy) {
      opinion = lang === 'ta'
        ? `புவிசார் இடர் பகுப்பாய்வு: "${topicSnippet}" - சர்வதேச வர்த்தக தடைகள், சுங்க வரி மாற்றங்கள் மற்றும் கார்ப்பரேட் கொள்கை தாக்கம்.`
        : (lang === 'hi'
          ? `भू-राजनीतिक जोखिम: "${topicSnippet}" - सीमा पार व्यापार प्रतिबंधों, टैरिफ दरों और कॉर्पोरेट अनुपालन पर असर।`
          : `Geopolitical & Policy Risk: "${topicSnippet}" - Cross-border sanctions, tariff shifts, and compliance exposure for enterprise operations.`);
      keyTakeaway = lang === 'ta' ? 'சட்ட ஆலோசகர்களுடன் நிறுவன இறக்குமதி/ஏற்றுமதி விதிகளை மறுஆய்வு செய்யுங்கள்.' : (lang === 'hi' ? 'विदेशी व्यापार नियमों और सप्लायर जोखिमों की कानूनी समीक्षा करें।' : 'Audit vendor compliance and explore alternative neutral-country sourcing channels.');
    } else if (isEcon) {
      opinion = lang === 'ta'
        ? `கார்ப்பரேட் நிதி & சந்தை: "${topicSnippet}" - பணவீக்கம், வட்டி விகித மாற்றங்கள் மற்றும் நிறுவன பணி மூலதனம் மீதான அழுத்தம்.`
        : (lang === 'hi'
          ? `कॉर्पोरेट वित्त व बाजार: "${topicSnippet}" - मुद्रास्फीति, क्रेडिट लागत और कार्यशील पूंजी (Working Capital) पर प्रभाव।`
          : `Fiscal & Working Capital Brief: "${topicSnippet}" - Currency fluctuations, debt refinancing costs, and gross margin margin compression.`);
      keyTakeaway = lang === 'ta' ? 'வங்கி கடன் வரம்புகளை மறுசீரமைத்து, பணப்புழக்கம் மற்றும் சரக்கு இருப்பை மேம்படுத்துங்கள்.' : (lang === 'hi' ? 'बैंक क्रेडिट लाइन्स पर फिर से बातचीत करें और इन्वेंट्री कैश फ्लो को संतुलित रखें।' : 'Re-negotiate short-term credit facilities and buffer operating cash reserves.');
    } else if (isTransit) {
      opinion = lang === 'ta'
        ? `விநியோக சங்கிலி இடர்: "${topicSnippet}" - துறைமுக நெரிசல், கடல்வழி சரக்கு கட்டண உயர்வு மற்றும் டெலிவரி காலதாமதம்.`
        : (lang === 'hi'
          ? `सप्लाई चेन व लॉजिस्टिक्स: "${topicSnippet}" - पोर्ट पर भीड़, माल ढुलाई दरों में बढ़ोतरी और डिलीवरी में देरी की संभावना।`
          : `Logistics & Freight Warning: "${topicSnippet}" - Maritime port congestion, container shortages, and ocean freight surcharges.`);
      keyTakeaway = lang === 'ta' ? 'சரக்கு டெலிவரி கால அவகாசத்தை 7-10 நாட்கள் நீட்டித்து மாற்று போக்குவரத்து வழிகளை தேர்வு செய்யவும்.' : (lang === 'hi' ? 'सप्लायर डिलीवरी समय 7-10 दिन बढ़ाएं और वैकल्पिक लॉजिस्टिक्स प्रदाताओं से संपर्क करें।' : 'Extend supply lead times by 7-10 business days and lock in freight forwarder contracts.');
    } else if (isTech) {
      opinion = lang === 'ta'
        ? `ஐடி & சைபர் பாதுகாப்பு: "${topicSnippet}" - நிறுவன ரோன்சம்வேர் அச்சுறுத்தல், மேகக்கணி தரவு விதிகள் மற்றும் ஏஐ தானியங்கி.`
        : (lang === 'hi'
          ? `आईटी व साइबर सुरक्षा: "${topicSnippet}" - कॉर्पोरेट डेटा सुरक्षा, रैंसमवेयर खतरों और एआई ऑटोमेशन से जुड़ा घटनाक्रम।`
          : `IT Infrastructure & Cyber Brief: "${topicSnippet}" - Threat advisory on enterprise ransomware, SaaS compliance, and AI operational integration.`);
      keyTakeaway = lang === 'ta' ? 'நிறுவன தரவு காப்புப்பிரதிகளை (Backups) சோதித்து, சைபர் காப்பீட்டை புதுப்பிக்கவும்.' : (lang === 'hi' ? 'कॉर्पोरेट डेटा बैकअप का परीक्षण करें और अपनी साइबर बीमा पॉलिसी की समीक्षा करें।' : 'Mandate zero-trust security controls and audit offline enterprise data backups.');
    } else {
      opinion = lang === 'ta'
        ? `கார்ப்பரேட் மேக்ரோ சூழல்: "${topicSnippet}" - உடனடி செயல்பாட்டு இடர் இல்லை, நிறுவன நீண்டகால கொள்கை கண்காணிப்பு.`
        : (lang === 'hi'
          ? `कारोबारी माहौल: "${topicSnippet}" - तात्कालिक परिचालन जोखिम कम है, पर दूरगामी नीतियों पर नजर जरूरी है।`
          : `Enterprise Macro Context: "${topicSnippet}" - Low immediate disruption risk; monitor standard industry policy trends.`);
      keyTakeaway = lang === 'ta' ? 'நிறுவன நிலையான செயல்பாட்டு விதிமுறைகளை (SOP) தொடரவும்.' : (lang === 'hi' ? 'मानक व्यावसायिक प्रक्रियाओं (SOP) का पालन जारी रखें।' : 'Maintain standard operational continuity SOPs and quarterly business goals.');
    }

    return { persona: 'Business', badge, impactLevel: 'COMMERCIAL', opinion, keyTakeaway, speechText: `${badge}: ${opinion} ${keyTakeaway}` };
  }

  // 4. STRATEGIC ANALYST PERSONA
  if (pLower.includes('analyst')) {
    const badge = '🛡️ Strategic Intel Assessment';
    let opinion = '';
    let keyTakeaway = '';

    if (isGeo) {
      opinion = `Strategic Telemetry: "${topicSnippet}" analyzed. High-order geopolitical ripple vectors detected across defense alliances, territorial buffer zones, and proxy force postures.`;
      keyTakeaway = `Elevate threat monitoring matrix; map secondary proxy spillover zones and prepare executive briefing.`;
    } else if (isEcon) {
      opinion = `Macroeconomic Stability Telemetry: "${topicSnippet}" evaluated. Currency weaponization, central bank reserve maneuvers, and sovereign credit default swap (CDS) volatility identified.`;
      keyTakeaway = `Model strategic commodity supply index and evaluate sovereign debt exposure risks.`;
    } else if (isTech) {
      opinion = `Cyber Threat Telemetry: "${topicSnippet}" analyzed. Indicates elevated risk to national critical infrastructure, SCADA networks, or state-sponsored APT campaigns.`;
      keyTakeaway = `Deploy immediate CISA/CERT IOC indicators and mandate air-gapped system isolation.`;
    } else if (isTransit) {
      opinion = `Chokepoint & Maritime Telemetry: "${topicSnippet}" processed. Operational friction detected at critical maritime straits or global supply transport nodes.`;
      keyTakeaway = `Re-route high-priority cargo assets and re-calculate war-risk insurance premiums.`;
    } else {
      opinion = `Operational Telemetry: "${topicSnippet}" logged into intelligence ledger. Assessment indicates localized policy movement within baseline risk thresholds.`;
      keyTakeaway = `Monitored dispatch; maintain continuous automated sensor telemetry tracking.`;
    }

    return { persona: 'Analyst', badge, impactLevel: 'ELEVATED', opinion, keyTakeaway, speechText: `${badge}: ${opinion} ${keyTakeaway}` };
  }

  // 5. ACCESSIBILITY MODE
  if (pLower.includes('accessibility')) {
    const badge = lang === 'ta' ? '🔊 எளிய குரல் விளக்கம்' : (lang === 'hi' ? '🔊 सरल आवाज सलाह' : '🔊 Simple Voice Guidance');
    let opinion = '';
    let keyTakeaway = '';

    if (isWeather || isAgri) {
      opinion = lang === 'ta' ? `மழை மற்றும் வானிலை தகவல்: "${topicSnippet}". உங்கள் பகுதியில் மழை அல்லது வானிலை மாற்றம் ஏற்படலாம்.` : (lang === 'hi' ? `मौसम व बारिश की जानकारी: "${topicSnippet}"। आपके क्षेत्र में मौसम या बारिश का असर हो सकता है।` : `Weather & Rain Advisory: "${topicSnippet}". Expect weather changes or rain in your local area.`);
      keyTakeaway = lang === 'ta' ? 'பாதுகாப்பாக வீட்டில் இருக்கவும், குடை மற்றும் அவசர மின் விளக்குகளை தயாராக வைக்கவும்.' : (lang === 'hi' ? 'सुरक्षित स्थान पर रहें, छाता साथ रखें और टॉर्च या लाइट चालू रखें।' : 'Stay safely indoors during heavy rain, keep an umbrella handy, and follow emergency news.');
    } else if (isTransit) {
      opinion = lang === 'ta' ? `போக்குவரத்து செய்தி: "${topicSnippet}". பேருந்து, ரயில் அல்லது சாலை பயணத்தில் மாற்றம் இருக்கலாம்.` : (lang === 'hi' ? `यातायात समाचार: "${topicSnippet}"। बस, ट्रेन या सड़क यात्रा में देरी हो सकती है।` : `Public Transport Guidance: "${topicSnippet}". Buses, trains, or road travel might experience delays.`);
      keyTakeaway = lang === 'ta' ? 'பயண புறப்பாட்டுக்கு முன் பேருந்து நிலைய அதிகாரிகளிடம் நேரத்தை கேட்டு அறியவும்.' : (lang === 'hi' ? 'यात्रा से पहले बस स्टेशन या रेलवे पूछताछ केंद्र से समय की जानकारी लें।' : 'Check travel timings with local station staff before leaving home.');
    } else if (isTech) {
      opinion = lang === 'ta' ? `தொலைபேசி மோசடி எச்சரிக்கை: "${topicSnippet}". போலி அழைப்புகள் மற்றும் வங்கி ஏமாற்று வேலைகள் குறித்து எச்சரிக்கை.` : (lang === 'hi' ? `फोन व बैंक फ्रॉड चेतावनी: "${topicSnippet}"। अनजान फोन कॉल और बैंक के नाम पर धोखाधड़ी से सावधान।` : `Phone Scam Advisory: "${topicSnippet}". Be careful of fake phone calls and online banking fraud.`);
      keyTakeaway = lang === 'ta' ? 'உங்கள் வங்கி OTP அல்லது கடவுச்சொல்லை யாருக்கும் சொல்ல வேண்டாம்.' : (lang === 'hi' ? 'अपना बैंक ओटीपी या पासवर्ड किसी को फोन पर न बताएं।' : 'Never share your bank OTP, PIN, or passwords over phone calls.');
    } else {
      opinion = lang === 'ta' ? `செய்தி சுருக்கம்: "${topicSnippet}". இது பொதுவான விழிப்புணர்வு தகவல்.` : (lang === 'hi' ? `समाचार सारांश: "${topicSnippet}"। यह एक जरूरी सार्वजनिक जानकारी है।` : `News Summary: "${topicSnippet}". Important update for general awareness.`);
      keyTakeaway = lang === 'ta' ? 'செய்திகளை கேட்டு விழிப்புடன் மற்றும் பாதுகாப்பாக இருங்கள்.' : (lang === 'hi' ? 'समाचार सुनते रहें और सतर्क व सुरक्षित रहें।' : 'Stay informed with daily audio updates and stay safe.');
    }

    return { persona: 'Accessibility mode', badge, impactLevel: 'CLEAR', opinion, keyTakeaway, speechText: `${badge}: ${opinion} ${keyTakeaway}` };
  }

  // 6. CASUAL USER / COMMON PERSON
  const badge = lang === 'ta' ? '🏡 பொதுமக்கள் பார்வை' : (lang === 'hi' ? '🏡 नागरिक एआई राय' : '🏡 Everyday Citizen Advice');
  let opinion = '';
  let keyTakeaway = '';

  if (isEcon) {
    opinion = lang === 'ta' ? `குடும்ப வரவு செலவு: "${topicSnippet}" - சமையல் மளிகை, எல்பிஜி கேஸ், பெட்ரோல் விலை மற்றும் வீட்டு பட்ஜெட்டில் தாக்கம்.` : (lang === 'hi' ? `घरेलू बजट सलाह: "${topicSnippet}" - रसोई के राशन, रसोई गैस, पेट्रोल दरों और परिवार के खर्च पर प्रभाव।` : `Household Budget Impact: "${topicSnippet}" - May affect monthly grocery bills, LPG cylinder prices, fuel costs, or home loan EMIs.`);
    keyTakeaway = lang === 'ta' ? 'மாதாந்திர குடும்ப செலவை திட்டமிட்டு, பெரிய தேவையில்லாத செலவுகளை தள்ளிப்போடுங்கள்.' : (lang === 'hi' ? 'मासिक घरेलू खर्चों की योजना बनाएं और अनावश्यक बड़े खर्चों को फिलहाल टालें।' : 'Plan monthly grocery purchases wisely and compare retail market prices before buying.');
  } else if (isWeather) {
    opinion = lang === 'ta' ? `அன்றாட பாதுகாப்பு: "${topicSnippet}" - உள்ளூர் மழை, வெப்ப அலை அல்லது சாலை நீர் தேக்கம் தொடர்பான செய்தி.` : (lang === 'hi' ? `दैनिक सुरक्षा अलर्ट: "${topicSnippet}" - स्थानीय बारिश, जलभराव या भीषण गर्मी से जुड़ा अपडेट।` : `Daily Safety & Commute: "${topicSnippet}" - Regional weather update affecting daily outdoor errands and local travel.`);
    keyTakeaway = lang === 'ta' ? 'பாதுகாப்பான நேரங்களில் வெளியே சென்று, குடிநீரை காய்ச்சி பருகவும்.' : (lang === 'hi' ? 'सुरक्षित समय पर ही बाहर निकलें, साफ उबला हुआ पानी पीएं और स्वास्थ्य का ध्यान रखें।' : 'Schedule outdoor errands during safe hours and keep clean drinking water stored.');
  } else if (isTransit) {
    opinion = lang === 'ta' ? `உள்ளூர் பயண எச்சரிக்கை: "${topicSnippet}" - வேலைக்கு செல்லும் பாதை, மெட்ரோ மற்றும் நகர பேருந்து பயணத்தில் தாமதம்.` : (lang === 'hi' ? `स्थानीय यात्रा अपडेट: "${topicSnippet}" - कार्यालय यात्रा, सिटी बस और मेट्रो मार्गों में संभावित देरी।` : `Local Commute Brief: "${topicSnippet}" - Signals potential road traffic delays, bus route diversions, or metro schedule shifts.`);
    keyTakeaway = lang === 'ta' ? 'பயணத்திற்கு முன் நேரலை போக்குவரத்து வரைபடத்தை (Live Traffic) சரிபார்க்கவும்.' : (lang === 'hi' ? 'घर से निकलने से पहले लाइव ट्रैफिक अपडेट या मैप्स की जांच करें।' : 'Check live traffic conditions before commuting to work or family events.');
  } else {
    opinion = lang === 'ta' ? `பொதுமக்கள் விழிப்புணர்வு: "${topicSnippet}" - சமூகம் மற்றும் அன்றாட வாழ்க்கையுடன் தொடர்புடைய செய்தி.` : (lang === 'hi' ? `नागरिक जागरूकता: "${topicSnippet}" - समाज और आम जनजीवन से जुड़ा महत्वपूर्ण घटनाक्रम।` : `Citizen Overview: "${topicSnippet}" - Relevant community update for general awareness and family safety.`);
    keyTakeaway = lang === 'ta' ? 'உள்ளூர் நேரலை தகவல்களை அறிந்து விழிப்புடன் செயல்படுங்கள்.' : (lang === 'hi' ? 'प्रमाणित समाचारों से अपडेट रहें और दैनिक दिनचर्या की सही योजना बनाएं।' : 'Stay updated with verified local news and plan daily routine with facts.');
  }

  return { persona: 'Common person', badge, impactLevel: 'EVERYDAY', opinion, keyTakeaway, speechText: `${badge}: ${opinion} ${keyTakeaway}` };
}
