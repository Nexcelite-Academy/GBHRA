// 大灣區醫療發展與研究協會網站 - 主要JavaScript文件

// 等待DOM加載完成
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== 確保漢堡按鈕正常工作 =====
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        // 確保 Bootstrap 的 collapse 功能正常工作
        navbarToggler.addEventListener('click', function(e) {
            console.log('漢堡按鈕被點擊');
            // 如果 Bootstrap 沒有正常工作，手動切換
            if (!window.bootstrap) {
                e.preventDefault();
                navbarCollapse.classList.toggle('show');
            }
        });
        
        // 點擊導航連結時自動收起選單（手機版）
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < 992) { // 手機版寬度
                    navbarCollapse.classList.remove('show');
                }
            });
        });
    }
    
    // ===== 導航欄滾動效果 =====
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 添加背景色和陰影
        if (scrollTop > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.backgroundColor = 'var(--white)';
            navbar.style.backdropFilter = 'none';
            navbar.style.boxShadow = 'var(--shadow-sm)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // ===== 平滑滾動到錨點 =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ===== 表單驗證 =====
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 基本驗證
            const emailInput = form.querySelector('input[type="email"]');
            if (emailInput && !isValidEmail(emailInput.value)) {
                showAlert('請輸入有效的電郵地址', 'error');
                return;
            }
            
            // 模擬表單提交
            showAlert('感謝您的提交！我們會盡快回覆您。', 'success');
            form.reset();
        });
    });
    
    // ===== 卡片懸停效果 =====
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // ===== 動畫效果 =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 觀察需要動畫的元素
    document.querySelectorAll('.feature-card, .card, .section-title, .section-subtitle').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // ===== 語言切換功能 =====
    const languageDropdown = document.querySelector('.dropdown-menu');
    if (languageDropdown) {
        languageDropdown.addEventListener('click', function(e) {
            if (e.target.classList.contains('dropdown-item')) {
                e.preventDefault();
                const language = e.target.textContent.trim();
                changeLanguage(language);
            }
        });
    }
    
    // ===== 搜尋功能 =====
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            performSearch(searchTerm);
        });
    }
    
    // ===== 返回頂部按鈕 =====
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-blue);
        color: white;
        border: none;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: var(--shadow-md);
    `;
    
    document.body.appendChild(backToTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ===== 工具函數 =====
    
    // 驗證電郵地址
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // 顯示提示訊息
    function showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} alert-dismissible fade show`;
        alertDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            box-shadow: var(--shadow-lg);
        `;
        
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // 自動移除提示
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
    
    // 語言切換
    function changeLanguage(language) {
        // 這裡可以實現多語言切換邏輯
        console.log(`切換到語言: ${language}`);
    }
    
    // 搜尋功能
    function performSearch(searchTerm) {
        // 這裡可以實現搜尋邏輯
        console.log(`搜尋: ${searchTerm}`);
    }
    
    // ===== 頁面載入動畫 =====
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
    
    // ===== 響應式導航欄 =====
    // 這裡的代碼已移至上方，確保在 DOMContentLoaded 時執行
    
    // ===== 圖片懶加載 =====
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // ===== 性能監控 =====
    window.addEventListener('load', function() {
        // 計算頁面載入時間
        const loadTime = performance.now();
        console.log(`頁面載入時間: ${loadTime.toFixed(2)}ms`);
        
        // 如果載入時間過長，可以顯示優化提示
        if (loadTime > 3000) {
            console.warn('頁面載入時間較長，建議優化');
        }
    });
    
    // ===== 錯誤處理 =====
    window.addEventListener('error', function(e) {
        console.error('頁面錯誤:', e.error);
        // 可以在這裡添加錯誤報告邏輯
    });
    
    // ===== 鍵盤快捷鍵 =====
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K 開啟搜尋
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // ESC 關閉模態框或下拉菜單
        if (e.key === 'Escape') {
            const dropdowns = document.querySelectorAll('.dropdown-menu.show');
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        }
    });
    
    console.log('大灣區醫療發展與研究協會網站已載入完成');
});

// ===== 全局函數 =====

// 格式化日期
function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(date).toLocaleDateString('zh-TW', options);
}

// 格式化數字
function formatNumber(num) {
    return new Intl.NumberFormat('zh-TW').format(num);
}

// 複製到剪貼板
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('已複製到剪貼板');
    }).catch(err => {
        console.error('複製失敗:', err);
    });
}

// 檢查設備類型
function isMobile() {
    return window.innerWidth <= 768;
}

function isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
}

function isDesktop() {
    return window.innerWidth > 1024;
} 