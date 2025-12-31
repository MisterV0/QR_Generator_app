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
        const flagMap = {
            'en': 'gb',
            'ro': 'ro',
            'it': 'it',
            'ru': 'ru',
            'uk': 'ua'
        };
        
        const codeMap = {
            'en': 'EN',
            'ro': 'RO',
            'it': 'IT',
            'ru': 'RU',
            'uk': 'UA'
        };
        
        const currentFlag = document.getElementById('currentFlag');
        const currentCode = document.getElementById('currentCode');
        
        if (currentFlag && currentCode) {
            currentFlag.src = `https://flagcdn.com/w40/${flagMap[this.currentLang]}.png`;
            currentCode.innerText = codeMap[this.currentLang];
            console.log('Updated flag to:', this.currentLang);
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
        console.log('Translations applied!');
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


