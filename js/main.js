document.addEventListener('DOMContentLoaded', function() {
    if (typeof initTheme === 'function') initTheme();
    if (typeof initToolSearch === 'function') initToolSearch();
    if (typeof initScrollTopButton === 'function') initScrollTopButton();
    if (typeof initFadeAnime === 'function') initFadeAnime();
    if (typeof setupMutationObserver === 'function') setupMutationObserver();
    
    fetch('data/search-index.json')
        .then(response => response.json())
        .then(data => {
            window.searchIndex = data;
        })
        .catch(error => {
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
    
    // テーマ切替用関数
    function setupThemeToggles() {
        // ヘッダーのテーマ切替ボタン
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle && typeof toggleTheme === 'function') {
            themeToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleTheme();
            });
        }
        
        // モバイルメニュー内のテーマ切替ボタン
        const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
        if (mobileThemeToggle) {
            // 既存のイベントハンドラをクリアするため、要素を複製
            const newMobileThemeToggle = mobileThemeToggle.cloneNode(true);
            if (mobileThemeToggle.parentNode) {
                mobileThemeToggle.parentNode.replaceChild(newMobileThemeToggle, mobileThemeToggle);
            }
            
            // 新しいイベントリスナーを設定
            newMobileThemeToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (typeof toggleTheme === 'function') {
                    toggleTheme();
                }
            });
        }
    }
    
    // ページ読み込み後にイベント設定を実行
    setTimeout(setupThemeToggles, 500);
    
    const menuButton = document.getElementById('menu-button');
    if (menuButton && typeof toggleMobileMenu === 'function') {
        menuButton.addEventListener('click', toggleMobileMenu);
    }
    
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        if (typeof handleTabClick === 'function') {
            tab.addEventListener('click', handleTabClick);
        }
    });
    
    const navItems = document.querySelectorAll('.header-nav-item, .mobile-menu-nav-item');
    navItems.forEach(item => {
        if (typeof handleNavClick === 'function') {
            item.addEventListener('click', handleNavClick);
        }
    });
    
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
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const searchResults = document.getElementById('search-results');
            if (searchResults && searchResults.classList.contains('active') &&
                typeof closeSearchResults === 'function') {
                closeSearchResults();
            }
            
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
            }
        }
    });
    
    window.addEventListener('scroll', function() {
        if (typeof handleScroll === 'function') {
            handleScroll();
        }
    });
    
    if (typeof checkScrollTopButton === 'function') {
        checkScrollTopButton();
    }
    
    window.addEventListener('resize', function() {
        if (typeof handleResize === 'function') {
            handleResize();
        }
    });
    
    if (typeof setActiveNavItem === 'function') {
        setActiveNavItem();
    }
});
