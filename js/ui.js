// ui.js - UI関連の機能
// モバイルメニュー切り替え
function toggleMobileMenu() {
    // 画面サイズのチェック - PCサイズでは何もしない
    if (window.innerWidth > 900) {
        return;
    }
    
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
}

// 画面リサイズ時にモバイルメニューを閉じる
function handleResize() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (window.innerWidth > 900 && mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
    }
}

// PCでのメニューボタン非表示を確認する
function checkMenuButtonVisibility() {
    const menuButton = document.getElementById('menu-button');
    if (menuButton) {
        if (window.innerWidth > 900) {
            menuButton.style.display = 'none';
            menuButton.setAttribute('aria-hidden', 'true');
            menuButton.style.visibility = 'hidden';
        } else {
            menuButton.style.display = 'block';
            menuButton.removeAttribute('aria-hidden');
            menuButton.style.visibility = 'visible';
        }
    }
}

// ツール検索処理
function handleToolSearch() {
    const searchTerm = this.value.toLowerCase();
    let hasResults = false;
    
    document.querySelectorAll('.tool-card').forEach(card => {
        const name = card.getAttribute('data-name').toLowerCase();
        const tags = card.getAttribute('data-tags').toLowerCase();
        const description = card.querySelector('.tool-description').textContent.toLowerCase();
        
        if (name.includes(searchTerm) || tags.includes(searchTerm) || description.includes(searchTerm)) {
            card.classList.remove('hidden');
            hasResults = true;
        } else {
            card.classList.add('hidden');
        }
    });
    
    const noResultsMessage = document.getElementById('no-results-message');
    if (noResultsMessage) {
        if (!hasResults && searchTerm !== '') {
            noResultsMessage.classList.remove('hidden');
        } else {
            noResultsMessage.classList.add('hidden');
        }
    }
}

// タブクリック処理
function handleTabClick() {
    if (this.classList.contains('active')) return;
    
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    this.classList.add('active');
    
    const tabId = this.getAttribute('data-tab');
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const targetTab = document.getElementById(tabId + '-tab');
    if (targetTab) {
        targetTab.classList.add('active');
    }
}

// ナビクリック処理
function handleNavClick(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        window.scrollTo({
            top: targetElement.offsetTop - 70,
            behavior: 'smooth'
        });
    }
    
    // モバイルメニューを閉じる
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
    }
}
