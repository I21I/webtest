// モバイルメニュー切り替え
function toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('active');
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
    
    if (!hasResults && searchTerm !== '') {
        document.getElementById('no-results-message').classList.remove('hidden');
    } else {
        document.getElementById('no-results-message').classList.add('hidden');
    }
}

// ツール検索の初期化
function initToolSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleToolSearch);
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
    document.getElementById(tabId + '-tab').classList.add('active');
}

// ナビクリック処理
function handleNavClick(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    window.scrollTo({
        top: targetElement.offsetTop - 70,
        behavior: 'smooth'
    });
    
    // モバイルメニューを閉じる
    document.getElementById('mobile-menu').classList.remove('active');
}

// イベントリスナーの設定
document.addEventListener('DOMContentLoaded', function() {
    // メニューボタンのイベントリスナー
    const menuButton = document.getElementById('menu-button');
    if (menuButton) {
        menuButton.addEventListener('click', toggleMobileMenu);
    }
    
    // タブのイベントリスナー
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', handleTabClick);
    });
    
    // ナビゲーションのイベントリスナー
    document.querySelectorAll('.header-nav-item, .mobile-menu-nav-item').forEach(item => {
        item.addEventListener('click', handleNavClick);
    });
});

window.toggleMobileMenu = toggleMobileMenu;
window.handleTabClick = handleTabClick;
window.handleNavClick = handleNavClick;
window.handleScroll = handleScroll;
