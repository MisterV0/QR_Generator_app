// QRExpress i18n - Subdirectory-Based Language Router
class I18n {
    constructor() {
        this.supportedLangs = ['en', 'ro', 'it', 'ru', 'uk'];
        this.currentLang = this.detectLanguage();
        this.translations = {};
        this.init();
    }

    init() {
        this.loadTranslations();
    }

    detectLanguage() {
        // Detect from URL path: /en/, /it/, /ro/, /ru/, /uk/
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        if (pathParts.length > 0 && this.supportedLangs.includes(pathParts[0])) {
            return pathParts[0];
        }
        
        // Fallback: check localStorage
        const stored = localStorage.getItem('qrexpress_lang');
        if (stored && this.supportedLangs.includes(stored)) {
            return stored;
        }
        
        // Default to English
        return 'en';
    }

    switchLanguage(lang) {
        if (this.supportedLangs.includes(lang)) {
            localStorage.setItem('qrexpress_lang', lang);
            window.location.href = '/' + lang + '/';
        }
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
        }
    }

    async loadTranslations() {
        try {
            const filePath = '/languages/' + this.currentLang + '.json';
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error('Failed to load ' + filePath + ' - Status: ' + response.status);
            }
            this.translations = await response.json();
            this.applyTranslations();
        } catch (error) {
            console.error('Error loading language ' + this.currentLang + ':', error);
            if (this.currentLang !== 'en') {
                this.currentLang = 'en';
                const response = await fetch('/languages/en.json');
                this.translations = await response.json();
                this.applyTranslations();
            }
        }
    }

    applyTranslations() {
        // Apply to all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const value = this.t(key);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = value;
            } else if (element.tagName === 'SELECT') {
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
        
        // Update language button
        this.updateLanguageButton();
        
        // Save preference
        localStorage.setItem('qrexpress_lang', this.currentLang);
    }

    t(key) {
        const value = this.translations[key];
        if (!value) {
            console.warn('Missing translation key: ' + key);
        }
        return value || key;
    }
}

// Initialize i18n
let i18n;

function initializeI18n() {
    i18n = new I18n();
    window.i18n = i18n;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeI18n);
} else {
    initializeI18n();
}
