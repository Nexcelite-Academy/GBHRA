// 語言管理器
class LanguageManager {
    constructor() {
        this.currentLanguage = 'zh-TW'; // 默認繁體中文
        this.languages = {
            'zh-TW': null,
            'zh-CN': null,
            'en': null
        };
        this.init();
    }

    async init() {
        try {
            // 動態加載語言檔案
            this.languages['zh-TW'] = await import('./languages/zh-TW.js');
            this.languages['zh-CN'] = await import('./languages/zh-CN.js');
            this.languages['en'] = await import('./languages/en.js');
            
            // 從 localStorage 讀取保存的語言設置
            const savedLanguage = localStorage.getItem('preferred-language');
            if (savedLanguage && this.languages[savedLanguage]) {
                this.currentLanguage = savedLanguage;
            }
            
            // 初始化頁面文字
            this.updatePageContent();
            
            // 設置初始字體
            this.updateFontFamily(this.currentLanguage);
            
            // 設置語言切換事件監聽器
            this.setupLanguageSwitcher();
            
        } catch (error) {
            console.error('Failed to load language files:', error);
        }
    }

    getText(path) {
        const lang = this.languages[this.currentLanguage];
        if (!lang) return path;
        
        const keys = path.split('.');
        let text = lang.default;
        
        for (const key of keys) {
            if (text && text[key]) {
                text = text[key];
            } else {
                return path; // 如果找不到對應的文字，返回原路徑
            }
        }
        
        return text;
    }

    changeLanguage(language) {
        if (this.languages[language]) {
            this.currentLanguage = language;
            localStorage.setItem('preferred-language', language);
            this.updatePageContent();
            
            // 更新 HTML lang 屬性
            document.documentElement.lang = language;
            
            // 更新字體
            this.updateFontFamily(language);
            
            // 顯示切換成功提示
            this.showLanguageChangeNotification(language);
        }
    }

    updatePageContent() {
        // 更新所有帶有 data-i18n 屬性的元素
        this.updateAllI18nElements();
        
        // 更新導航欄
        this.updateNavigation();
        
        // 更新頁面特定內容
        this.updatePageSpecificContent();
        
        // 更新頁腳
        this.updateFooter();
    }

    updateAllI18nElements() {
        // 更新所有帶有 data-i18n 屬性的元素
        const i18nElements = document.querySelectorAll('[data-i18n]');
        i18nElements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const text = this.getText(key);
            if (text && text !== key) {
                element.textContent = text;
            }
        });

        // 更新所有帶有 data-i18n-placeholder 屬性的元素
        const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
        placeholderElements.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const text = this.getText(key);
            if (text && text !== key) {
                element.placeholder = text;
            }
        });

        // 更新頁面標題
        const titleElement = document.querySelector('title[data-i18n]');
        if (titleElement) {
            const key = titleElement.getAttribute('data-i18n');
            const text = this.getText(key);
            if (text && text !== key) {
                titleElement.textContent = text;
            }
        }
    }

    updateNavigation() {
        // 更新導航連結文字（只處理導航欄中的連結，不包括返回按鈕等）
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                if (href.includes('index.html') || href === '../index.html' || href === './index.html') {
                    link.textContent = this.getText('nav.home');
                } else if (href.includes('about.html')) {
                    link.textContent = this.getText('nav.about');
                } else if (href.includes('programs.html')) {
                    link.textContent = this.getText('nav.programs');
                } else if (href.includes('events.html')) {
                    link.textContent = this.getText('nav.events');
                } else if (href.includes('contact.html')) {
                    link.textContent = this.getText('nav.contact');
                }
            }
        });

        // 更新語言下拉選單
        const languageDropdown = document.querySelector('.dropdown-toggle');
        if (languageDropdown) {
            languageDropdown.innerHTML = `<i class="fas fa-globe"></i> ${this.getText('nav.language')}`;
        }
    }

    updatePageSpecificContent() {
        const currentPage = this.getCurrentPage();
        
        switch (currentPage) {
            case 'home':
                this.updateHomePage();
                break;
            case 'about':
                this.updateAboutPage();
                break;
            case 'programs':
                this.updateProgramsPage();
                break;
            case 'events':
                this.updateEventsPage();
                break;
            case 'contact':
                this.updateContactPage();
                break;
        }
    }

    updateHomePage() {
        // 更新英雄區塊
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) heroTitle.textContent = this.getText('home.title');
        
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) heroSubtitle.textContent = this.getText('home.subtitle');
        
        // 更新按鈕
        const buttons = document.querySelectorAll('.hero-buttons .btn');
        buttons.forEach(btn => {
            if (btn.textContent.includes('了解協會') || btn.textContent.includes('了解协会') || btn.textContent.includes('Learn More')) {
                btn.innerHTML = `<i class="fas fa-info-circle me-2"></i>${this.getText('home.learnMore')}`;
            } else if (btn.textContent.includes('加入我們') || btn.textContent.includes('加入我们') || btn.textContent.includes('Join Us')) {
                btn.innerHTML = `<i class="fas fa-user-plus me-2"></i>${this.getText('home.joinUs')}`;
            }
        });
        
        // 更新使命區塊
        const missionTitle = document.querySelector('.section-title');
        if (missionTitle) missionTitle.textContent = this.getText('home.mission');
        
        const missionSubtitle = document.querySelector('.section-subtitle');
        if (missionSubtitle) missionSubtitle.textContent = this.getText('home.missionSubtitle');
        
        // 更新特色卡片
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            const title = card.querySelector('.feature-title');
            const desc = card.querySelector('.feature-description');
            
            if (index === 0) {
                if (title) title.textContent = this.getText('home.culture');
                if (desc) desc.textContent = this.getText('home.cultureDesc');
            } else if (index === 1) {
                if (title) title.textContent = this.getText('home.exchange');
                if (desc) desc.textContent = this.getText('home.exchangeDesc');
            } else if (index === 2) {
                if (title) title.textContent = this.getText('home.technology');
                if (desc) desc.textContent = this.getText('home.technologyDesc');
            }
        });
        
        // 更新最新動態
        const latestNewsTitle = document.querySelector('h2.section-title');
        if (latestNewsTitle) latestNewsTitle.textContent = this.getText('home.latestNews');
        
        const latestNewsSubtitle = document.querySelector('.section-subtitle');
        if (latestNewsSubtitle) latestNewsSubtitle.textContent = this.getText('home.latestNewsSubtitle');
        
        // 更新活動卡片
        const eventCards = document.querySelectorAll('.card');
        eventCards.forEach((card, index) => {
            const title = card.querySelector('.card-title');
            const desc = card.querySelector('.card-text');
            const btn = card.querySelector('.btn');
            
            if (index === 0) {
                if (title) title.textContent = this.getText('home.gd2hospital');
                if (desc) desc.textContent = this.getText('home.gd2hospitalDesc');
            } else if (index === 1) {
                if (title) title.textContent = this.getText('home.mentalHealth');
                if (desc) desc.textContent = this.getText('home.mentalHealthDesc');
            }
            
            if (btn) btn.textContent = this.getText('home.eventDetails');
        });
        
        // 更新合作夥伴
        const partnersTitle = document.querySelector('h2.section-title:last-of-type');
        if (partnersTitle) partnersTitle.textContent = this.getText('home.partners');
        
        const partnersSubtitle = document.querySelector('.section-subtitle:last-of-type');
        if (partnersSubtitle) partnersSubtitle.textContent = this.getText('home.partnersSubtitle');
    }

    updateAboutPage() {
        // 由於我們已經在 HTML 中添加了 data-i18n 屬性，
        // updateAllI18nElements() 方法會自動處理所有翻譯
        // 這裡只需要處理任何特殊的邏輯（如果有的話）
        
        // 更新頁面標題
        const titleElement = document.querySelector('title[data-i18n]');
        if (titleElement) {
            const key = titleElement.getAttribute('data-i18n');
            const text = this.getText(key);
            if (text && text !== key) {
                document.title = text;
            }
        }
    }

    updateProgramsPage() {
        const title = document.querySelector('.section-title');
        if (title) title.textContent = this.getText('programs.title');
        
        const subtitle = document.querySelector('.section-subtitle');
        if (subtitle) subtitle.textContent = this.getText('programs.subtitle');
    }

    updateEventsPage() {
        const title = document.querySelector('.section-title');
        if (title) title.textContent = this.getText('events.title');
        
        const subtitle = document.querySelector('.section-subtitle');
        if (subtitle) subtitle.textContent = this.getText('events.subtitle');
    }

    updateContactPage() {
        const title = document.querySelector('.section-title');
        if (title) title.textContent = this.getText('contact.title');
        
        const subtitle = document.querySelector('.section-subtitle');
        if (subtitle) subtitle.textContent = this.getText('contact.subtitle');
    }

    updateFooter() {
        // 更新頁腳內容
        const footerSections = document.querySelectorAll('.footer-section h3');
        footerSections.forEach((section, index) => {
            if (index === 0) {
                section.textContent = this.getText('footer.about');
            } else if (index === 1) {
                section.textContent = this.getText('footer.quickLinks');
            } else if (index === 2) {
                section.textContent = this.getText('footer.contactInfo');
            } else if (index === 3) {
                section.textContent = this.getText('footer.subscribe');
            }
        });
        
        // 更新版權信息
        const copyright = document.querySelector('.footer-bottom p');
        if (copyright) copyright.textContent = this.getText('footer.copyright');
    }

    setupLanguageSwitcher() {
        const languageDropdown = document.querySelector('.dropdown-menu');
        if (languageDropdown) {
            languageDropdown.addEventListener('click', (e) => {
                if (e.target.classList.contains('dropdown-item')) {
                    e.preventDefault();
                    const language = e.target.getAttribute('data-lang');
                    if (language) {
                        this.changeLanguage(language);
                    }
                }
            });
        }
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('index.html') || path === '/' || path === '') {
            return 'home';
        } else if (path.includes('about.html')) {
            return 'about';
        } else if (path.includes('programs.html')) {
            return 'programs';
        } else if (path.includes('events.html')) {
            return 'events';
        } else if (path.includes('contact.html')) {
            return 'contact';
        }
        return 'home';
    }

    updateFontFamily(language) {
        const body = document.body;
        
        switch (language) {
            case 'zh-TW':
                body.style.fontFamily = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
                break;
            case 'zh-CN':
                body.style.fontFamily = '"Noto Sans SC", "Hiragino Sans GB", "SimHei", "Microsoft YaHei", sans-serif';
                break;
            case 'en':
                body.style.fontFamily = '"Open Sans", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
                break;
            default:
                body.style.fontFamily = '"Noto Sans TC", "Noto Sans SC", "Microsoft JhengHei", "PingFang TC", "PingFang SC", "Hiragino Sans GB", "SimHei", sans-serif';
        }
    }

    showLanguageChangeNotification(language) {
        const languageNames = {
            'zh-TW': '繁體中文',
            'zh-CN': '简体中文',
            'en': 'English'
        };
        
        const notification = document.createElement('div');
        notification.className = 'language-notification';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--primary-blue);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: var(--shadow-md);
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = `已切換到 ${languageNames[language]}`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// 創建全局語言管理器實例
window.languageManager = new LanguageManager(); 