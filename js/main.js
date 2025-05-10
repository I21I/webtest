// main.js - メインのJavaScript
document.addEventListener('DOMContentLoaded', function() {
    // 各モジュールの初期化
    if (typeof initTheme === 'function') initTheme();
    if (typeof initToolSearch === 'function') initToolSearch();
    if (typeof initScrollTopButton === 'function') initScrollTopButton();
    if (typeof initFadeAnime === 'function') initFadeAnime();
    if (typeof setupMutationObserver === 'function') setupMutationObserver();
    
    // 検索インデックスのロード
    fetch('data/search-index.json')
        .then(response => response.json())
        .then(data => {
            window.searchIndex = data;
        })
        .catch(error => {
            console.error('検索インデックスの読み込みに失敗しました:', error);
            // フォールバック：ハードコードされたデータを使用
            window.searchIndex = [
                {
                    title: "AAO Merge Helper",
                    url: "#tools-section",
                    content: "Avatar OptimizerのMergeSkinnedMeshとMergePhysBoneを簡単に設定するツールです。オブジェクトのトグル制御にも対応し、アバター改変の軽量化作業を効率化します。",
                    tags: ["AAO", "Avatar Optimizer", "MergeSkinnedMesh", "MergePhysBone", "最適化"],
                    path: "ツール"
                },
                {
                    title: "インストール方法",
                    url: "#install-section",
                    content: "VCCやALCOMでのリポジトリの追加方法を解説しています。上部の「VCC/ALCOMに追加する」ボタンで簡単にリポジトリを追加できます。",
                    tags: ["VCC", "ALCOM", "インストール", "リポジトリ"],
                    path: "インストール方法"
                },
                {
                    title: "お問い合わせ",
                    url: "#contact-section",
                    content: "不具合や機能のリクエスト、その他のお問い合わせについては、以下のリンクからお願いします。",
                    tags: ["お問い合わせ", "Twitter", "Booth"],
                    path: "お問い合わせ"
                }
            ];
        });
    
    // イベントリスナーの設定
    // テーマトグルボタンのイベントリスナー
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    
    if (themeToggle && typeof toggleTheme === 'function') {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    if (mobileThemeToggle && typeof toggleTheme === 'function') {
        mobileThemeToggle.addEventListener('click', toggleTheme);
    }
    
    // メニューボタンのイベントリスナー
    const menuButton = document.getElementById('menu-button');
    if (menuButton && typeof toggleMobileMenu === 'function') {
        menuButton.addEventListener('click', toggleMobileMenu);
    }
    
    // タブのイベントリスナー
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        if (typeof handleTabClick === 'function') {
            tab.addEventListener('click', handleTabClick);
        }
    });
    
    // ナビゲーションのイベントリスナー
    const navItems = document.querySelectorAll('.header-nav-item, .mobile-menu-nav-item');
    navItems.forEach(item => {
        if (typeof handleNavClick === 'function') {
            item.addEventListener('click', handleNavClick);
        }
    });
    
    // 検索関連のイベントリスナー
    const searchInput = document.getElementById('search-input');
    if (searchInput && typeof handleToolSearch === 'function') {
        searchInput.addEventListener('input', handleToolSearch);
    }
    
    const siteSearchInput = document.getElementById('site-search-input');
    if (siteSearchInput && typeof handleSiteSearch === 'function') {
        siteSearchInput.addEventListener('keypress', handleSiteSearch);
    }
    
    const mobileSiteSearchInput = document.getElementById('mobile-site-search-input');
    if (mobileSiteSearchInput && typeof handleSiteSearch === 'function') {
        mobileSiteSearchInput.addEventListener('keypress', handleSiteSearch);
    }
    
    const searchClose = document.getElementById('search-close');
    if (searchClose && typeof closeSearchResults === 'function') {
        searchClose.addEventListener('click', closeSearchResults);
    }
    
    // 検索結果外クリックでの閉じる
    document.addEventListener('click', function(e) {
        const searchResults = document.getElementById('search-results');
        if (searchResults && searchResults.classList.contains('active') && 
            !searchResults.contains(e.target) && 
            e.target !== siteSearchInput && 
            (mobileSiteSearchInput ? e.target !== mobileSiteSearchInput : true) &&
            typeof closeSearchResults === 'function') {
            closeSearchResults();
        }
    });
    
    // ESC キーでの閉じる
    document.addEventListener('keydown', function(e) {
        const searchResults = document.getElementById('search-results');
        if (e.key === 'Escape' && searchResults && searchResults.classList.contains('active') &&
            typeof closeSearchResults === 'function') {
            closeSearchResults();
        }
    });
    
    // スクロールイベント
    window.addEventListener('scroll', function() {
        if (typeof handleScroll === 'function') {
            handleScroll();
        }
    });
    
    // スクロールトップボタンの初期チェック
    if (typeof checkScrollTopButton === 'function') {
        checkScrollTopButton();
    }
});
