import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'hi' | 'es' | 'fr' | 'de' | 'bn' | 'ta' | 'te' | 'mr';

export interface Translations {
  languageLabel: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  analyzeJob: string;
  exploreFeatures: string;
  scanScreenshotBtn: string;
  scannerNav: string;
  screenshotNav: string;
  recruiterNav: string;
  scamDnaNav: string;
  communityNav: string;
  learningNav: string;
  dashboardNav: string;
  adminNav: string;
  verifyJobCta: string;
  signInBtn: string;
  signOutBtn: string;
  quickThreatScanner: string;
  loadTestPresets: string;
  runAnalysisBtn: string;
  riskLow: string;
  riskMedium: string;
  riskHigh: string;
  goldenRule: string;
  downloadPdf: string;
  saveJob: string;
  savedSuccess: string;
  share: string;
  copied: string;
  scannerTitle: string;
  scannerSubtitle: string;
  recruiterTitle: string;
  recruiterSubtitle: string;
  screenshotTitle: string;
  screenshotSubtitle: string;
  communityTitle: string;
  communitySubtitle: string;
  learningTitle: string;
  learningSubtitle: string;
  dashboardTitle: string;
  dashboardSubtitle: string;
  adminTitle: string;
  askShieldBot: string;
}

const translations: Record<Language, Translations> = {
  en: {
    languageLabel: "English",
    tagline: "Don't Just Find Jobs. Verify Your Future.",
    heroHeadline: "Your Career Deserves Protection.",
    heroSubheadline: "AI-powered job and internship verification that protects your career from fraudulent opportunities, advance fee traps, and fake placement schemes.",
    analyzeJob: "Analyze a Job",
    exploreFeatures: "Explore Features",
    scanScreenshotBtn: "Scan WhatsApp / Offer Screenshot",
    scannerNav: "AI Scanner",
    screenshotNav: "Screenshot Scanner",
    recruiterNav: "Recruiter Check",
    scamDnaNav: "Scam DNA",
    communityNav: "Community Alerts",
    learningNav: "Learning Hub",
    dashboardNav: "Dashboard",
    adminNav: "Admin Portal",
    verifyJobCta: "Verify Job",
    signInBtn: "Sign In",
    signOutBtn: "Sign Out",
    quickThreatScanner: "Instant Threat Scanner",
    loadTestPresets: "Load Test Presets:",
    runAnalysisBtn: "Execute AI Fraud Analysis",
    riskLow: "LOW RISK (SAFE)",
    riskMedium: "MEDIUM RISK (CAUTION)",
    riskHigh: "HIGH RISK (CRITICAL)",
    goldenRule: "Golden Rule: Legitimate employers NEVER charge candidates for interviews, registration, or equipment.",
    downloadPdf: "Download PDF Report",
    saveJob: "Save Job",
    savedSuccess: "Saved to Dashboard ✓",
    share: "Share",
    copied: "Summary Copied!",
    scannerTitle: "AI Job & Internship Fraud Scanner",
    scannerSubtitle: "Detect hidden fee demands, telegram task redirection, fake placement guarantees, and free-mail impersonations.",
    recruiterTitle: "AI Recruiter Credibility Checker",
    recruiterSubtitle: "Evaluate recruiter email domains, cross-reference corporate identity, and expose fake recruiters hiding behind public free addresses.",
    screenshotTitle: "Screenshot-to-Scam Scanner",
    screenshotSubtitle: "Upload screenshots of WhatsApp chats, Telegram recruitment posters, fake offer letter PDFs, or Instagram messages.",
    communityTitle: "Community Scam Alert Network",
    communitySubtitle: "Live victim reports, verified fraudulent phone numbers, UPI handles, and recruitment traps reported by job seekers.",
    learningTitle: "Career Scam Awareness Learning Center",
    learningSubtitle: "Equip yourself with knowledge on recruitment laws, interactive offer verification checklists, and test your scam detection IQ.",
    dashboardTitle: "Career Safety Dashboard",
    dashboardSubtitle: "Your real-time employment verification overview, safety score, and saved analysis vault.",
    adminTitle: "Security Administration Console",
    askShieldBot: "Ask ShieldBot AI",
  },
  hi: {
    languageLabel: "हिन्दी",
    tagline: "सिर्फ नौकरी मत ढूंढिए। अपने भविष्य की पुष्टि कीजिए।",
    heroHeadline: "आपका करियर सुरक्षा का हकदार है।",
    heroSubheadline: "एआई-संचालित नौकरी और इंटर्नशिप सत्यापन जो छात्रों और फ्रेशर्स को फर्जी प्लेसमेंट, अग्रिम शुल्क धोखाधड़ी और व्हाट्सएप घोटालों से बचाता है।",
    analyzeJob: "नौकरी की जांच करें",
    exploreFeatures: "सुविधाएं देखें",
    scanScreenshotBtn: "स्क्रीनशॉट स्कैन करें",
    scannerNav: "एआई स्कैनर",
    screenshotNav: "स्क्रीनशॉट स्कैनर",
    recruiterNav: "रिक्रूटर जांच",
    scamDnaNav: "स्कैम डीएनए",
    communityNav: "कम्युनिटी अलर्ट",
    learningNav: "शिक्षा केंद्र",
    dashboardNav: "डैशबोर्ड",
    adminNav: "एडमिन पोर्टल",
    verifyJobCta: "नौकरी सत्यापित करें",
    signInBtn: "साइन इन करें",
    signOutBtn: "साइन आउट",
    quickThreatScanner: "त्वरित खतरा स्कैनर",
    loadTestPresets: "परीक्षण नमूने लोड करें:",
    runAnalysisBtn: "एआई धोखाधड़ी जांच शुरू करें",
    riskLow: "कम जोखिम (सुरक्षित)",
    riskMedium: "मध्यम जोखिम (सावधानी)",
    riskHigh: "उच्च जोखिम (खतरा)",
    goldenRule: "मुख्य नियम: वैध कंपनियां साक्षात्कार या नौकरी के लिए कभी भी पैसे नहीं मांगती हैं।",
    downloadPdf: "पीडीएफ रिपोर्ट डाउनलोड करें",
    saveJob: "नौकरी सहेजें",
    savedSuccess: "डैशबोर्ड में सहेजा गया ✓",
    share: "साझा करें",
    copied: "कॉपी किया गया!",
    scannerTitle: "एआई नौकरी एवं इंटर्नशिप धोखाधड़ी स्कैनर",
    scannerSubtitle: "छिपे शुल्क, टेलीग्राम टास्क धोखाधड़ी, फर्जी प्लेसमेंट और फर्जी ईमेल की तुरंत पहचान करें।",
    recruiterTitle: "रिक्रूटर विश्वसनीयता परीक्षक",
    recruiterSubtitle: "रिक्रूटर के ईमेल डोमेन की जांच करें और कॉर्पोरेट पहचान का सत्यापन करें।",
    screenshotTitle: "स्क्रीनशॉट धोखाधड़ी स्कैनर",
    screenshotSubtitle: "व्हाट्सएप चैट, टेलीग्राम पोस्टर या फर्जी ऑफर लेटर का स्क्रीनशॉट अपलोड करें।",
    communityTitle: "सामुदायिक धोखाधड़ी अलर्ट नेटवर्क",
    communitySubtitle: "छात्रों द्वारा रिपोर्ट किए गए फर्जी यूपीआई और संदिग्ध भर्तीकर्ताओं का लाइव फीड।",
    learningTitle: "करियर सुरक्षा जागरूकता केंद्र",
    learningSubtitle: "भर्ती नियमों, सुरक्षा चेकलिस्ट और धोखाधड़ी जागरूकता क्विज के साथ सीखें।",
    dashboardTitle: "करियर सुरक्षा डैशबोर्ड",
    dashboardSubtitle: "आपका व्यक्तिगत सुरक्षा स्कोर, सहेजी गई रिपोर्ट और गतिविधि का विश्लेषण।",
    adminTitle: "सुरक्षा प्रशासन कंसोल",
    askShieldBot: "शील्डबॉट से पूछें",
  },
  es: {
    languageLabel: "Español",
    tagline: "No solo busques empleo. Verifica tu futuro.",
    heroHeadline: "Tu carrera merece protección real.",
    heroSubheadline: "Verificación de ofertas de empleo y pasantías impulsada por IA que te protege de estafas, depósitos de seguridad y falsos reclutadores.",
    analyzeJob: "Analizar Oferta",
    exploreFeatures: "Explorar Funciones",
    scanScreenshotBtn: "Escanear Captura de WhatsApp / Oferta",
    scannerNav: "Escáner IA",
    screenshotNav: "Escáner de Capturas",
    recruiterNav: "Verificar Reclutador",
    scamDnaNav: "ADN de Estafa",
    communityNav: "Alertas Comunitarias",
    learningNav: "Centro de Aprendizaje",
    dashboardNav: "Panel de Control",
    adminNav: "Portal Administrador",
    verifyJobCta: "Verificar Oferta",
    signInBtn: "Iniciar Sesión",
    signOutBtn: "Cerrar Sesión",
    quickThreatScanner: "Escáner Instantáneo de Amenazas",
    loadTestPresets: "Cargar ejemplos de prueba:",
    runAnalysisBtn: "Ejecutar Análisis de Fraude con IA",
    riskLow: "BAJO RIESGO (SEGURO)",
    riskMedium: "RIESGO MEDIO (PRECAUCIÓN)",
    riskHigh: "ALTO RIESGO (PELIGROSO)",
    goldenRule: "Regla de oro: Las empresas legítimas NUNCA cobran a los candidatos por entrevistas, registro o equipos.",
    downloadPdf: "Descargar Informe PDF",
    saveJob: "Guardar Oferta",
    savedSuccess: "Guardado en el Panel ✓",
    share: "Compartir",
    copied: "¡Resumen Copiado!",
    scannerTitle: "Escáner de Fraude en Empleos y Pasantías con IA",
    scannerSubtitle: "Detecta demandas de pagos ocultos, tareas fraudulentas en Telegram, promesas irreales y suplantación de reclutadores.",
    recruiterTitle: "Verificador de Credibilidad de Reclutadores IA",
    recruiterSubtitle: "Evalúa dominios de correo electrónico, contrasta la identidad corporativa y expone reclutadores falsos que usan correos gratuitos.",
    screenshotTitle: "Escáner de Capturas a Fraude",
    screenshotSubtitle: "Sube capturas de pantalla de chats de WhatsApp, carteles de Telegram o cartas de oferta dudosas para análisis OCR.",
    communityTitle: "Red de Alertas Comunitarias de Estafas",
    communitySubtitle: "Informes en vivo de víctimas, números sospechosos y esquemas fraudulentos reportados por buscadores de empleo.",
    learningTitle: "Centro de Concientización sobre Fraude Laboral",
    learningSubtitle: "Aprende normativas de contratación, listas de verificación de seguridad y pon a prueba tus conocimientos contra estafas.",
    dashboardTitle: "Panel de Seguridad Profesional",
    dashboardSubtitle: "Tu resumen de verificación de empleo en tiempo real, puntuación de seguridad y archivo de análisis.",
    adminTitle: "Consola de Administración de Seguridad",
    askShieldBot: "Preguntar a ShieldBot IA",
  },
  fr: {
    languageLabel: "Français",
    tagline: "Ne cherchez pas seulement un emploi. Vérifiez votre avenir.",
    heroHeadline: "Votre carrière mérite une protection réelle.",
    heroSubheadline: "Vérification intelligente des offres d'emploi et de stages par IA pour protéger les étudiants et candidats contre la fraude et les fausses avances de frais.",
    analyzeJob: "Analyser une Offre",
    exploreFeatures: "Explorer les Fonctions",
    scanScreenshotBtn: "Scanner Capture WhatsApp / Offre",
    scannerNav: "Scanner IA",
    screenshotNav: "Scanner de Captures",
    recruiterNav: "Vérifier Recruteur",
    scamDnaNav: "ADN de Fraude",
    communityNav: "Alertes Communautaires",
    learningNav: "Centre de Formation",
    dashboardNav: "Tableau de Bord",
    adminNav: "Portail Admin",
    verifyJobCta: "Vérifier l'Offre",
    signInBtn: "Connexion",
    signOutBtn: "Déconnexion",
    quickThreatScanner: "Scanner de Menaces Instantané",
    loadTestPresets: "Charger exemples de test :",
    runAnalysisBtn: "Lancer l'Analyse Anti-Fraude IA",
    riskLow: "RISQUE FAIBLE (SÉCURISÉ)",
    riskMedium: "RISQUE MOYEN (ATTENTION)",
    riskHigh: "RISQUE ÉLEVÉ (DANGER)",
    goldenRule: "Règle d'or : Les employeurs légitimes ne demandent JAMAIS d'argent pour des entretiens, du matériel ou des inscriptions.",
    downloadPdf: "Télécharger le Rapport PDF",
    saveJob: "Enregistrer l'Offre",
    savedSuccess: "Enregistré au Tableau de Bord ✓",
    share: "Partager",
    copied: "Résumé Copié !",
    scannerTitle: "Scanner de Fraude à l'Emploi & aux Stages par IA",
    scannerSubtitle: "Détectez les demandes de frais cachés, les faux recrutements Telegram, les promesses irréalistes et les usurpations d'identité.",
    recruiterTitle: "Vérificateur de Crédibilité des Recruteurs IA",
    recruiterSubtitle: "Évaluez les noms de domaine des e-mails, confirmez l'identité corporative et démasquez les faux recruteurs utilisant des adresses publiques.",
    screenshotTitle: "Scanner de Captures d'Écran",
    screenshotSubtitle: "Téléversez des captures d'écran de discussions WhatsApp, Telegram ou fausses lettres d'embauche pour une détection OCR.",
    communityTitle: "Réseau d'Alertes Communautaires aux Arnaques",
    communitySubtitle: "Signalements en direct des victimes, numéros suspects et pièges de recrutement déclarés par la communauté.",
    learningTitle: "Centre de Sensibilisation aux Arnaques de l'Emploi",
    learningSubtitle: "Maîtrisez les lois sur le travail, les check-lists de sécurité et testez votre niveau de détection des arnaques.",
    dashboardTitle: "Tableau de Bord de Sécurité de Carrière",
    dashboardSubtitle: "Votre synthèse de vérification d'emploi en temps réel, score de sécurité et coffre-fort de rapports.",
    adminTitle: "Console d'Administration de Sécurité",
    askShieldBot: "Demander à ShieldBot IA",
  },
  de: {
    languageLabel: "Deutsch",
    tagline: "Suchen Sie nicht nur Jobs. Sichern Sie Ihre Zukunft.",
    heroHeadline: "Ihre Karriere verdient echten Schutz.",
    heroSubheadline: "KI-gestützte Verifizierung von Job- und Praktikumsangeboten zum Schutz vor betrügerischen Angeboten, Vorkasse-Fallen und Fake-Recruitern.",
    analyzeJob: "Job analysieren",
    exploreFeatures: "Funktionen ansehen",
    scanScreenshotBtn: "WhatsApp / Angebot Screenshot scannen",
    scannerNav: "KI-Scanner",
    screenshotNav: "Screenshot-Scanner",
    recruiterNav: "Recruiter-Check",
    scamDnaNav: "Scam-DNA",
    communityNav: "Community-Warnungen",
    learningNav: "Lernzentrum",
    dashboardNav: "Dashboard",
    adminNav: "Admin-Portal",
    verifyJobCta: "Job verifizieren",
    signInBtn: "Anmelden",
    signOutBtn: "Abmelden",
    quickThreatScanner: "Sofortiger Bedrohungsscanner",
    loadTestPresets: "Testvorlagen laden:",
    runAnalysisBtn: "KI-Betrugsanalyse starten",
    riskLow: "GERINGES RISIKO (SICHER)",
    riskMedium: "MITTLERES RISIKO (VORSICHT)",
    riskHigh: "HOHES RISIKO (GEFÄHRLICH)",
    goldenRule: "Goldene Regel: Seriöse Arbeitgeber verlangen NIEMALS Gebühren für Vorstellungsgespräche, Registrierung oder Arbeitsgeräte.",
    downloadPdf: "PDF-Bericht herunterladen",
    saveJob: "Job speichern",
    savedSuccess: "Im Dashboard gespeichert ✓",
    share: "Teilen",
    copied: "Zusammenfassung kopiert!",
    scannerTitle: "KI-Job & Praktikums-Betrugsscanner",
    scannerSubtitle: "Erkennen Sie versteckte Gebührenforderungen, Telegram-Aufgabenfallen, unrealistische Versprechen und Identitätsdiebstahl.",
    recruiterTitle: "KI-Glaubwürdigkeitsprüfung für Recruiter",
    recruiterSubtitle: "Analysieren Sie E-Mail-Domains, gleichen Sie Unternehmensdaten ab und entlarven Sie gefälschte Recruiter auf Freemail-Konten.",
    screenshotTitle: "Screenshot-Betrugsscanner",
    screenshotSubtitle: "Laden Sie Screenshots von WhatsApp-Chats, Telegram-Postern oder gefälschten Verträgen zur OCR-Analyse hoch.",
    communityTitle: "Community-Betrugswarnnetzwerk",
    communitySubtitle: "Live-Meldungen von Betroffenen, verdächtige Telefonnummern und gemeldete Rekrutierungsfallen.",
    learningTitle: "Aufklärungszentrum für Arbeitsplatzbetrug",
    learningSubtitle: "Lernen Sie Arbeitsrechtsrichtlinien, nutzen Sie Sicherheits-Checklisten und testen Sie Ihren Betrugserkennungs-IQ.",
    dashboardTitle: "Karriere-Sicherheits-Dashboard",
    dashboardSubtitle: "Ihre Echtzeit-Übersicht zur Beschäftigungsverifizierung, Ihr Sicherheits-Score und Ihre gespeicherten Analysen.",
    adminTitle: "Sicherheits-Administrationskonsole",
    askShieldBot: "ShieldBot KI fragen",
  },
  bn: {
    languageLabel: "বাংলা",
    tagline: "শুধু চাকরি খুঁজবেন না। নিজের ভবিষ্যৎ যাচাই করুন।",
    heroHeadline: "আপনার ক্যারিয়ার সত্যিকারের সুরক্ষার দাবিদার।",
    heroSubheadline: "এআই-চালিত চাকরি এবং ইন্টার্নশিপ যাচাইকরণ যা শিক্ষার্থী এবং চাকরিপ্রার্থীদের জাল নিয়োগ, অগ্রিম ফি ও ভুয়ো নিয়োগকর্তা থেকে রক্ষা করে।",
    analyzeJob: "চাকরি বিশ্লেষণ করুন",
    exploreFeatures: "সুবিধাসমূহ দেখুন",
    scanScreenshotBtn: "স্ক্রিনশট স্ক্যান করুন",
    scannerNav: "এআই স্ক্যানার",
    screenshotNav: "স্ক্রিনশট স্ক্যানার",
    recruiterNav: "নিয়োগকারী যাচাই",
    scamDnaNav: "স্ক্যাম ডিএনএ",
    communityNav: "কমিউনিটি সতর্কতা",
    learningNav: "লার্নিং হাব",
    dashboardNav: "ড্যাশবোর্ড",
    adminNav: "অ্যাডমিন পোর্টাল",
    verifyJobCta: "চাকরি যাচাই করুন",
    signInBtn: "সাইন ইন",
    signOutBtn: "সাইন আউট",
    quickThreatScanner: "তাৎক্ষণিক হুমকি স্ক্যানার",
    loadTestPresets: "নমুনা পরীক্ষা লোড করুন:",
    runAnalysisBtn: "এআই প্রতারণা বিশ্লেষণ চালান",
    riskLow: "কম ঝুঁকি (নিরাপদ)",
    riskMedium: "মাঝারি ঝুঁকি (সতর্কতা)",
    riskHigh: "উচ্চ ঝুঁকি (বিপদজনক)",
    goldenRule: "মূল নিয়ম: আসল কোম্পানি কখনোই ইন্টারভিউ বা চাকরির জন্য কোনো টাকা দাবি করে না।",
    downloadPdf: "পিডিএফ রিপোর্ট ডাউনলোড করুন",
    saveJob: "চাকরি সংরক্ষণ করুন",
    savedSuccess: "ড্যাশবোর্ডে সংরক্ষিত হয়েছে ✓",
    share: "শেয়ার করুন",
    copied: "কপি করা হয়েছে!",
    scannerTitle: "এআই চাকরি ও ইন্টার্নশিপ প্রতারণা স্ক্যানার",
    scannerSubtitle: "গোপন ফি, টেলিগ্রাম টাস্ক প্রতারণা, মিথ্যা প্লেসমেন্ট গ্যারান্টি এবং ভুয়া ইমেল শনাক্ত করুন।",
    recruiterTitle: "নিয়োগকারী নির্ভরযোগ্যতা পরীক্ষক",
    recruiterSubtitle: "নিয়োগকারীর ইমেল ডোমেন পরীক্ষা করুন এবং পাবলিক ইমেল ব্যবহারকারী ভুয়া নিয়োগকারীদের চিহ্নিত করুন।",
    screenshotTitle: "স্ক্রিনশট প্রতারণা স্ক্যানার",
    screenshotSubtitle: "হোয়াটসঅ্যাপ চ্যাট, টেলিগ্রাম বিজ্ঞাপন বা সন্দেহজনক নিয়োগপত্রের স্ক্রিনশট ওসিআর স্ক্যান করুন।",
    communityTitle: "কমিউনিটি প্রতারণা সতর্কতা নেটওয়ার্ক",
    communitySubtitle: "চাকরিপ্রার্থীদের দ্বারা রিপোর্ট করা ভুয়ো ফোন নম্বর, ইউপিআই আইডি এবং প্রতারণামূলক সংস্থাসমূহের লাইভ তালিকা।",
    learningTitle: "ক্যারিয়ার স্ক্যাম সচেতনতা কেন্দ্র",
    learningSubtitle: "নিয়োগ আইন, নিরাপত্তা চেকলিস্ট এবং সচেতনতামূলক কুইজের মাধ্যমে সুরক্ষিত থাকুন।",
    dashboardTitle: "ক্যারিয়ার সুরক্ষা ড্যাশবোর্ড",
    dashboardSubtitle: "আপনার রিয়েল-টাইম চাকরির যাচাইকরণ সারাংশ এবং সুরক্ষা স্কোর।",
    adminTitle: "নিরাপত্তা প্রশাসন কনসোল",
    askShieldBot: "শীন্ডবট এআই-কে জিজ্ঞাসা করুন",
  },
  ta: {
    languageLabel: "தமிழ்",
    tagline: "வேலைகளை மட்டும் தேடாதீர்கள். உங்கள் எதிர்காலத்தை உறுதிப்படுத்துங்கள்.",
    heroHeadline: "உங்கள் தொழில் வாழ்க்கை உண்மையான பாதுகாப்பிற்கு தகுதியானது.",
    heroSubheadline: "மாணவர்கள் மற்றும் வேலை தேடுபவர்களை போலி வேலைவாய்ப்புகள் மற்றும் முன்பண மோசடிகளிலிருந்து பாதுகாக்கும் AI சரிபார்ப்பு தளம்.",
    analyzeJob: "வேலையை பகுப்பாய்வு செய்க",
    exploreFeatures: "அம்சங்களை காண்க",
    scanScreenshotBtn: "ஸ்கிரீன்ஷாட்டை ஸ்கேன் செய்க",
    scannerNav: "AI ஸ்கேனர்",
    screenshotNav: "ஸ்கிரீன்ஷாட் ஸ்கேனர்",
    recruiterNav: "ஆட்சேர்ப்பாளர் சோதனை",
    scamDnaNav: "ஸ்கேம் DNA",
    communityNav: "சமூக எச்சரிக்கைகள்",
    learningNav: "கற்றல் மையம்",
    dashboardNav: "டாஷ்போர்டு",
    adminNav: "நிர்வாக போர்டல்",
    verifyJobCta: "வேலையை சரிபார்க்கவும்",
    signInBtn: "உள்நுழைக",
    signOutBtn: "வெளியேறுக",
    quickThreatScanner: "உடனடி அச்சுறுத்தல் ஸ்கேனர்",
    loadTestPresets: "மாதிரிகளை ஏற்றுக:",
    runAnalysisBtn: "AI மோசடி பகுப்பாய்வை இயக்குக",
    riskLow: "குறைந்த ஆபத்து (பாதுகாப்பானது)",
    riskMedium: "நடுத்தர ஆபத்து (எச்சரிக்கை)",
    riskHigh: "அதிக ஆபத்து (ஆபத்தானது)",
    goldenRule: "பொன் விதி: முறையான நிறுவனங்கள் ஒருபோதும் நேர்காணல் அல்லது பணிக்காக பணம் கேட்காது.",
    downloadPdf: "PDF அறிக்கையைப் பதிவிறக்குக",
    saveJob: "வேலையைச் சேமிக்கவும்",
    savedSuccess: "டாஷ்போர்டில் சேமிக்கப்பட்டது ✓",
    share: "பகிர்",
    copied: "நகலெடுக்கப்பட்டது!",
    scannerTitle: "AI வேலை & இன்டர்ன்ஷிப் மோசடி ஸ்கேனர்",
    scannerSubtitle: "மறைமுகக் கட்டணங்கள், டெலிகிராம் பணிகள் மற்றும் போலி ஆட்சேர்ப்பாளர்களை உடனே கண்டறியவும்.",
    recruiterTitle: "ஆட்சேர்ப்பாளர் நம்பகத்தன்மை சரிபார்ப்பு",
    recruiterSubtitle: "மின்னஞ்சல் டொமைன் மற்றும் நிறுவன அடையாளத்தை சரிபார்த்து போலி ஆட்சேர்ப்பாளர்களை வெளிப்படுத்துங்கள்.",
    screenshotTitle: "ஸ்கிரீன்ஷாட் மோசடி ஸ்கேனர்",
    screenshotSubtitle: "வாட்ஸ்அப் அரட்டைகள் அல்லது போலி ஆஃபர் கடிதங்களின் ஸ்கிரீன்ஷாட்களைப் பதிவேற்றி OCR மூலம் ஸ்கேன் செய்க.",
    communityTitle: "சமூக மோசடி எச்சரிக்கை நெட்வொர்க்",
    communitySubtitle: "வேலை தேடுபவர்களால் புகாரளிக்கப்பட்ட போலி எண்கள் மற்றும் மோசடி நிறுவனங்களின் நேரலை எச்சரிக்கைகள்.",
    learningTitle: "வேலை மோசடி விழிப்புணர்வு மையம்",
    learningSubtitle: "வேலைவாய்ப்பு சட்டங்கள் மற்றும் பாதுகாப்பு சரிபார்ப்பு பட்டியல்களுடன் உங்களைப் பாதுகாத்துக் கொள்ளுங்கள்.",
    dashboardTitle: "தொழில் பாதுகாப்பு டாஷ்போர்டு",
    dashboardSubtitle: "உங்கள் நிகழ்நேர சரிபார்ப்பு சுருக்கம் மற்றும் பாதுகாப்பு மதிப்பீடு.",
    adminTitle: "பாதுகாப்பு நிர்வாக மையம்",
    askShieldBot: "ShieldBot AI-யிடம் கேளுங்கள்",
  },
  te: {
    languageLabel: "తెలుగు",
    tagline: "ఉద్యోగాలను వెతకడమే కాదు. మీ భవిష్యత్తును ధృవీకరించుకోండి.",
    heroHeadline: "మీ కెరీర్ నిజమైన రక్షణకు అర్హమైనది.",
    heroSubheadline: "విద్యార్థులు మరియు ఉద్యోగార్ధులను నకిలీ ఉద్యోగాలు, రిజిస్ట్రేషన్ ఫీజుల మోసాల నుండి రక్షించే అత్యాధునిక AI ప్లాట్‌ఫారమ్.",
    analyzeJob: "ఉద్యోగాన్ని విశ్లేషించండి",
    exploreFeatures: "ఫీచర్లను అన్వేషించండి",
    scanScreenshotBtn: "స్క్రీన్‌షాట్‌ను స్కాన్ చేయండి",
    scannerNav: "AI స్కానర్",
    screenshotNav: "స్క్రీన్‌షాట్ స్కానర్",
    recruiterNav: "రిక్రూటర్ తనిఖీ",
    scamDnaNav: "స్కామ్ DNA",
    communityNav: "కమ్యూనిటీ హెచ్చరికలు",
    learningNav: "లెర్నింగ్ హబ్",
    dashboardNav: "డ్యాష్‌బోర్డ్",
    adminNav: "అడ్మిన్ పోర్టల్",
    verifyJobCta: "ఉద్యోగాన్ని ధృవీకరించండి",
    signInBtn: "సైన్ ఇన్",
    signOutBtn: "సైన్ అవుట్",
    quickThreatScanner: "తక్షణ ముప్పు స్కానర్",
    loadTestPresets: "పరీక్ష నమూనాలను లోడ్ చేయండి:",
    runAnalysisBtn: "AI మోసం విశ్లేషణను ప్రారంభించండి",
    riskLow: "తక్కువ ప్రమాదం (సురక్షితం)",
    riskMedium: "మధ్యస్థ ప్రమాదం (జాగ్రత్త)",
    riskHigh: "అధిక ప్రమాదం (ప్రమాదకరం)",
    goldenRule: "ముఖ్య నియమం: నిజమైన కంపెనీలు ఉద్యోగం లేదా ఇంటర్వ్యూ కోసం ఎప్పుడూ డబ్బు అడగవు.",
    downloadPdf: "PDF నివేదికను డౌన్‌లోడ్ చేయండి",
    saveJob: "ఉద్యోగాన్ని భద్రపరచండి",
    savedSuccess: "డ్యాష్‌బోర్డ్‌లో భద్రపరచబడింది ✓",
    share: "భాగస్వామ్యం చేయండి",
    copied: "కాపీ చేయబడింది!",
    scannerTitle: "AI ఉద్యోగ & ఇంటర్న్‌షిప్ మోసం స్కానర్",
    scannerSubtitle: "దాచిన రుసుములు, టెలిగ్రామ్ టాస్క్ మోసాలు మరియు నకిలీ రిక్రూటర్లను గుర్తించండి.",
    recruiterTitle: "రిక్రూటర్ విశ్వసనీయత తనిఖీ",
    recruiterSubtitle: "ఈమెయిల్ డొమైన్‌ను ధృవీకరించి ఉచిత ఇమెయిల్‌లను వాడే నకిలీ రిక్రూటర్లను బహిర్గతం చేయండి.",
    screenshotTitle: "స్క్రీన్‌షాట్ మోసం స్కానర్",
    screenshotSubtitle: "వాట్సాప్ చాట్‌లు లేదా నకిలీ ఆఫర్ లెటర్ల స్క్రీన్‌షాట్‌లను అప్‌లోడ్ చేసి OCR తనిఖీని పొందండి.",
    communityTitle: "కమ్యూనిటీ స్కామ్ హెచ్చరిక నెట్‌వర్క్",
    communitySubtitle: "ఉద్యోగార్థులు నివేదించిన నకిలీ ఫోన్ నంబర్లు, UPI మరియు మోసపూరిత ఏజెన్సీల జాబితా.",
    learningTitle: "కెరీర్ స్కామ్ అవగాహన కేంద్రం",
    learningSubtitle: "ఉపాధి చట్టాలు, భద్రతా చెక్‌లిస్ట్‌లతో మీ కెరీర్‌ను సురక్షితంగా ఉంచుకోండి.",
    dashboardTitle: "కెరీర్ భద్రత డ్యాష్‌బోర్డ్",
    dashboardSubtitle: "మీ ఉద్యోగ ధృవీకరణ వివరాలు మరియు భద్రతా స్కోరు సారాంశం.",
    adminTitle: "భద్రతా అడ్మిన్ కన్సోల్",
    askShieldBot: "ShieldBot AIని అడగండి",
  },
  mr: {
    languageLabel: "मराठी",
    tagline: "फक्त नोकरी शोधू नका. तुमचे भविष्य पडताळून पाहा.",
    heroHeadline: "तुमचे करिअर खऱ्या संरक्षणास पात्र आहे.",
    heroSubheadline: "विद्यार्थी आणि फ्रेशर्सना बनावट नोकऱ्या, आगाऊ शुल्क आणि फसव्या प्लेसमेंटपासून वाचवणारे एआय-सक्षम पडताळणी व्यासपीठ.",
    analyzeJob: "नोकरीचे विश्लेषण करा",
    exploreFeatures: "वैशिष्ट्ये पहा",
    scanScreenshotBtn: "स्क्रीनशॉट स्कॅन करा",
    scannerNav: "एआय स्कॅनर",
    screenshotNav: "स्क्रीनशॉट स्कॅनर",
    recruiterNav: "रिक्रूटर पडताळणी",
    scamDnaNav: "स्कॅम डीएनए",
    communityNav: "समुदाय सूचना",
    learningNav: "शिकण्याचे केंद्र",
    dashboardNav: "डॅशबोर्ड",
    adminNav: "अॅडमिन पोर्टल",
    verifyJobCta: "नोकरी तपासा",
    signInBtn: "साइन इन करा",
    signOutBtn: "साइन आउट करा",
    quickThreatScanner: "झटपट धोका स्कॅनर",
    loadTestPresets: "चाचणी नमुने लोड करा:",
    runAnalysisBtn: "एआय फसवणूक विश्लेषण सुरू करा",
    riskLow: "कमी धोका (सुरक्षित)",
    riskMedium: "मध्यम धोका (सावधगिरी)",
    riskHigh: "उच्च धोका (धोकादायक)",
    goldenRule: "सुवर्ण नियम: अधिकृत कंपन्या मुलाखत किंवा नोकरीसाठी उमेदवारांकडून कधीही पैसे मागत नाहीत.",
    downloadPdf: "पीडीएफ अहवाल डाउनलोड करा",
    saveJob: "नोकरी जतन करा",
    savedSuccess: "डॅशबोर्डमध्ये जतन केले ✓",
    share: "शेअर करा",
    copied: "कॉपी केले!",
    scannerTitle: "एआय नोकरी आणि इंटर्नशिप फसवणूक स्कॅनर",
    scannerSubtitle: "लपलेले शुल्क, टेलिग्राम टास्क घोटाळे, बनावट प्लेसमेंट आणि खोट्या ईमेल्स ओळखा.",
    recruiterTitle: "रिक्रूटर विश्वासार्हता तपासक",
    recruiterSubtitle: "ईमेल डोमेन तपासा आणि मोफत ईमेल्स वापरणाऱ्या बनावट रिक्रूटर्सना उघडे पाडा.",
    screenshotTitle: "स्क्रीनशॉट फसवणूक स्कॅनर",
    screenshotSubtitle: "व्हॉट्सअॅप चॅट्स किंवा बनावट ऑफर लेटर्सचे स्क्रीनशॉट्स अपलोड करून ओसीआर स्कॅन मिळवा.",
    communityTitle: "सामुदायिक घोटाळा सूचना नेटवर्क",
    communitySubtitle: "नोकरी शोधणाऱ्यांनी नोंदवलेले संशयास्पद संपर्क, यूपीआय आणि बनावट संस्थांची थेट माहिती.",
    learningTitle: "करियर फसवणूक जागरूकता केंद्र",
    learningSubtitle: "भरती नियम, सुरक्षितता पडताळणी सूची आणि जनजागृतीसह स्वतःचे रक्षण करा.",
    dashboardTitle: "करिअर सुरक्षितता डॅशबोर्ड",
    dashboardSubtitle: "तुमचा नोकरी पडताळणी अहवाल आणि सुरक्षा गुणांकन सारांश.",
    adminTitle: "सुरक्षा प्रशासन कन्सोल",
    askShieldBot: "शील्डबॉटला विचारा",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const VALID_LANGUAGES: Language[] = ['en', 'hi', 'es', 'fr', 'de', 'bn', 'ta', 'te', 'mr'];

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('jobshield_lang') as Language;
      if (saved && VALID_LANGUAGES.includes(saved)) {
        return saved;
      }
    } catch {
      // Fallback to English
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    if (!VALID_LANGUAGES.includes(lang)) return;
    setLanguageState(lang);
    try {
      localStorage.setItem('jobshield_lang', lang);
    } catch {
      // Ignore storage error
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] || translations.en }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
