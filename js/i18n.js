// QRExpress i18n - Simple Hash-Based Language Router
class I18n {
    constructor() {
        this.supportedLangs = ['en', 'ro', 'it', 'ru', 'uk'];
        this.currentLang = this.detectLanguage();
        this.translations = {};
        this.init();
    }

    init() {
        this.setupHashListener();
        this.loadTranslations();
    }

    detectLanguage() {
        // Check hash (e.g., #en, #ro, #ru, etc.)
        const hash = window.location.hash.replace('#', '').toLowerCase();
        if (this.supportedLangs.includes(hash)) {
            return hash;
        }
        
        // Check localStorage
        const stored = localStorage.getItem('qrexpress_lang');
        if (stored && this.supportedLangs.includes(stored)) {
            return stored;
        }
        
        // Default to English
        return 'en';
    }

    setupHashListener() {
        // Listen for hash changes
        window.addEventListener('hashchange', () => {
            console.log('Hash changed, detecting new language...');
            const newLang = this.detectLanguage();
            console.log('Current lang:', this.currentLang, 'New lang:', newLang);
            if (newLang !== this.currentLang) {
                this.currentLang = newLang;
                console.log('Loading translations for:', newLang);
                this.loadTranslations();
            }
            this.updateLanguageButton();
        });

        // Set initial hash if not set
        if (!window.location.hash) {
            console.log('No hash, setting to:', this.currentLang);
            window.location.hash = `#${this.currentLang}`;
        }

        // Update flag and code immediately
        this.updateLanguageButton();
    }

    updateLanguageButton() {
        const codeMap = {
            'en': 'EN',
            'ro': 'RO',
            'it': 'IT',
            'ru': 'RU',
            'uk': 'UA'
        };
        
        const currentCode = document.getElementById('currentCode');
        
        if (currentCode) {
            currentCode.innerText = codeMap[this.currentLang];
            console.log('Updated language to:', this.currentLang);
        }
    }

    async loadTranslations() {
        try {
            const filePath = `./languages/${this.currentLang}.json`;
            console.log('Loading translations from:', filePath);
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Failed to load ${filePath} - Status: ${response.status}`);
            }
            this.translations = await response.json();
            console.log('Translations loaded:', Object.keys(this.translations).length, 'keys');
            this.applyTranslations();
        } catch (error) {
            console.error(`Error loading language ${this.currentLang}:`, error);
            if (this.currentLang !== 'en') {
                this.currentLang = 'en';
                const response = await fetch(`./languages/en.json`);
                this.translations = await response.json();
                this.applyTranslations();
            }
        }
    }

    applyTranslations() {
        console.log('Applying translations for:', this.currentLang);
        // Apply to all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const value = this.t(key);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = value;
            } else if (element.tagName === 'SELECT') {
                // For select options, update based on value attribute
                const options = element.querySelectorAll('option');
                options.forEach(option => {
                    const optionKey = option.getAttribute('data-i18n');
                    if (optionKey) {
                        option.innerText = this.t(optionKey);
                    }
                });
            } else {
                element.innerText = value;
            }
        });

        // Update HTML lang attribute
        document.documentElement.lang = this.currentLang;
        
        // Update SEO meta tags
        this.updateSEOMetaTags();
        
        console.log('Translations applied!');
    }

    updateSEOMetaTags() {
        const langSEO = {
            'en': {
                title: 'QRExpress | Free QR Code Generator - Create Custom QR Codes Online',
                description: 'Create beautiful, customizable QR codes for free. No registration required. Generate QR codes for URLs, WiFi, Email, SMS, Contacts, and more. Download in high quality PNG or vector SVG format.',
                keywords: 'QR code generator, free QR code, QR code maker, custom QR code, QR code creator, QR code online, QR code designer'
            },
            'it': {
                title: 'QRExpress | Generatore QR Code Gratuito - Crea QR Code Personalizzati Online',
                description: 'Crea bellissimi QR code personalizzabili gratuitamente. Nessuna registrazione richiesta. Genera QR code per URL, WiFi, Email, SMS, Contatti e altro ancora. Scarica in formato PNG ad alta qualità o vettoriale SVG.',
                keywords: 'generatore QR code, QR code gratuito, crea QR code, QR code personalizzato, generatore QR code online, designer QR code'
            },
            'ro': {
                title: 'QRExpress | Generator QR Code Gratuit - Creează QR Code Personalizate Online',
                description: 'Creează QR code-uri frumoase și personalizabile gratuit. Fără înregistrare necesară. Generează QR code-uri pentru URL-uri, WiFi, Email, SMS, Contacte și multe altele. Descarcă în format PNG de înaltă calitate sau vector SVG.',
                keywords: 'generator QR code, QR code gratuit, creator QR code, QR code personalizat, generator QR code online, designer QR code'
            },
            'ru': {
                title: 'QRExpress | Бесплатный Генератор QR Кодов - Создайте Персонализированные QR Коды Онлайн',
                description: 'Создавайте красивые, настраиваемые QR коды бесплатно. Регистрация не требуется. Генерируйте QR коды для URL, WiFi, Email, SMS, Контактов и многого другого. Скачивайте в высоком качестве PNG или векторном формате SVG.',
                keywords: 'генератор QR кодов, бесплатный QR код, создатель QR кодов, персонализированный QR код, генератор QR кодов онлайн, дизайнер QR кодов'
            },
            'uk': {
                title: 'QRExpress | Безкоштовний Генератор QR Кодів - Створіть Персоналізовані QR Коди Онлайн',
                description: 'Створюйте красиві, налаштовувані QR коди безкоштовно. Реєстрація не потрібна. Генеруйте QR коди для URL, WiFi, Email, SMS, Контактів та багато іншого. Завантажуйте у високій якості PNG або векторному форматі SVG.',
                keywords: 'генератор QR кодів, безкоштовний QR код, створювач QR кодів, персоналізований QR код, генератор QR кодів онлайн, дизайнер QR кодів'
            }
        };

        const seo = langSEO[this.currentLang] || langSEO['en'];
        
        // Update title
        document.title = seo.title;
        this.updateMetaTag('title', seo.title);
        this.updateMetaTag('property', 'og:title', seo.title);
        this.updateMetaTag('property', 'twitter:title', seo.title);
        
        // Update description
        this.updateMetaTag('name', 'description', seo.description);
        this.updateMetaTag('property', 'og:description', seo.description);
        this.updateMetaTag('property', 'twitter:description', seo.description);
        
        // Update keywords
        this.updateMetaTag('name', 'keywords', seo.keywords);
        
        // Update og:locale
        const localeMap = {
            'en': 'en_US',
            'it': 'it_IT',
            'ro': 'ro_RO',
            'ru': 'ru_RU',
            'uk': 'uk_UA'
        };
        this.updateMetaTag('property', 'og:locale', localeMap[this.currentLang] || 'en_US');
    }

    updateMetaTag(attr, name, content) {
        let meta = document.querySelector(`meta[${attr}="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute(attr, name);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    }

    t(key) {
        const value = this.translations[key];
        if (!value) {
            console.warn(`Missing translation key: ${key}`);
        }
        return value || key;
    }

    switchLanguage(langCode) {
        console.log('Switching to language:', langCode);
        if (!this.supportedLangs.includes(langCode)) {
            console.warn(`Language ${langCode} not supported, using en`);
            langCode = 'en';
        }
        
        localStorage.setItem('qrexpress_lang', langCode);
        
        // Change hash - this will trigger hashchange event
        window.location.hash = `#${langCode}`;
        console.log('Hash set to:', `#${langCode}`);
    }
}

// Initialize i18n immediately when script loads
console.log('i18n.js loading...');
let i18n;

function initializeI18n() {
    console.log('Initializing i18n...');
    i18n = new I18n();
    window.i18n = i18n;
    console.log('i18n initialized:', window.i18n);
}

// Initialize right away if DOM is ready
if (document.readyState === 'loading') {
    console.log('DOM still loading, waiting for DOMContentLoaded');
    document.addEventListener('DOMContentLoaded', initializeI18n);
} else {
    console.log('DOM ready, initializing immediately');
    initializeI18n();
}

// Fallback: initialize after a short delay
setTimeout(() => {
    if (!window.i18n) {
        console.log('Fallback init after 500ms');
        initializeI18n();
    }
}, 500);


