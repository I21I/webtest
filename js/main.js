// main.js - メインのJavaScript
document.addEventListener('DOMContentLoaded', function() {
    // 検索インデックスの初期化
    const searchIndex = [
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

    // 要素の取得
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const menuButton = document.getElementById('menu-button');
    const searchInput = document.getElementById('search-input');
    const siteSearchInput = document.getElementById('site-search-input');
    const mobileSiteSearchInput = document.getElementById('mobile-site-search-input');
    const searchClose = document.getElementById('search-close');
    const scrollTopButton = document.getElementById('scroll-top-button');
    const tabs = document.querySelectorAll('.tab');
    const navItems = document.querySelectorAll('.header-nav-item, .mobile-menu-nav-item');

    // 各モジュールの初期化
    // theme.jsの初期化
    if (typeof initTheme === 'function') {
        initTheme();
    }

    // イベントリスナーの設定
    // テーマ切替ボタンのイベントリスナー
    if (themeToggle && typeof toggleTheme === 'function') {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // モバイルテーマ切替ボタンのイベントリスナー
    if (mobileThemeToggle && typeof toggleTheme === 'function') {
        mobileThemeToggle.addEventListener('click', toggleTheme);
    }
    
    // ui.jsの機能のイベントリスナー
    if (menuButton && typeof toggleMobileMenu === 'function') {
        menuButton.addEventListener('click', toggleMobileMenu);
    }
    
    // タブのイベントリスナー（ui.js）
    tabs.forEach(tab => {
        if (typeof handleTabClick === 'function') {
            tab.addEventListener('click', handleTabClick);
        }
    });
    
    // ナビゲーションのイベントリスナー（ui.js）
    navItems.forEach(item => {
        if (typeof handleNavClick === 'function') {
            item.addEventListener('click', handleNavClick);
        }
    });
    
    // search.jsの機能のイベントリスナー
    if (searchInput && typeof handleToolSearch === 'function') {
        searchInput.addEventListener('input', handleToolSearch);
    }
    
    if (siteSearchInput && typeof handleSiteSearch === 'function') {
        siteSearchInput.addEventListener('keypress', handleSiteSearch);
    }
    
    if (mobileSiteSearchInput && typeof handleSiteSearch === 'function') {
        mobileSiteSearchInput.addEventListener('keypress', handleSiteSearch);
    }
    
    if (searchClose && typeof closeSearchResults === 'function') {
        searchClose.addEventListener('click', closeSearchResults);
    }
    
    // animation.jsの機能のイベントリスナー
    if (scrollTopButton && typeof scrollToTop === 'function') {
        scrollTopButton.addEventListener('click', scrollToTop);
    }
    
    window.addEventListener('scroll', function() {
        if (typeof handleScroll === 'function') {
            handleScroll();
        }
    });
    
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

    // モジュールの初期化関数を呼び出し
    if (typeof initToolSearch === 'function') {
        initToolSearch();
    }
    
    if (typeof initScrollTopButton === 'function') {
        initScrollTopButton();
    }
    
    if (typeof setupMutationObserver === 'function') {
        setupMutationObserver();
    }
    
    if (typeof checkScrollTopButton === 'function') {
        checkScrollTopButton();
    }
    
    if (typeof initFadeAnime === 'function') {
        initFadeAnime();
    }

    // グローバルにsearchIndexを公開
    window.searchIndex = searchIndex;
});
