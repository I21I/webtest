// main.js - メインのJavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    
    // 各モジュールの初期化
    if (typeof initTheme === 'function') initTheme();
    if (typeof initToolSearch === 'function') initToolSearch();
    if (typeof initScrollTopButton === 'function') initScrollTopButton();
    if (typeof initFadeAnime === 'function') initFadeAnime();
    if (typeof setupMutationObserver === 'function') setupMutationObserver();
    
    // PCサイズでメニューボタンを確実に非表示にする関数
    function forceHideMenuButtonOnPC() {
        const menuButton = document.getElementById('menu-button');
        if (menuButton) {
            if (window.innerWidth > 900) {
                menuButton.style.display = 'none';
                menuButton.setAttribute('aria-hidden', 'true');
                menuButton.style.visibility = 'hidden';
                menuButton.style.opacity = '0';
                menuButton.style.position = 'absolute';
                menuButton.style.pointerEvents = 'none';
            } else {
                menuButton.style.display = 'block';
                menuButton.removeAttribute('aria-hidden');
                menuButton.style.visibility = 'visible';
                menuButton.style.opacity = '1';
                menuButton.style.position = 'static';
                menuButton.style.pointerEvents = 'auto';
            }
        }
    }
    
    // 初期化時に実行
    forceHideMenuButtonOnPC();
    
    // PC表示をbodyクラスで管理
    if (window.innerWidth > 900) {
        document.body.classList.add('pc-view');
    } else {
        document.body.classList.add('mobile-view');
    }

                          // main.js - メインのJavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    
    // 各モジュールの初期化
    if (typeof initTheme === 'function') initTheme();
    if (typeof initToolSearch === 'function') initToolSearch();
    if (typeof initScrollTopButton === 'function') initScrollTopButton();
    if (typeof initFadeAnime === 'function') initFadeAnime();
    if (typeof setupMutationObserver === 'function') setupMutationObserver();
    
    // PCサイズでメニューボタンを確実に非表示にする関数
    function forceHideMenuButtonOnPC() {
        const menuButton = document.getElementById('menu-button');
        if (menuButton) {
            if (window.innerWidth > 900) {
                menuButton.style.display = 'none';
                menuButton.setAttribute('aria-hidden', 'true');
                menuButton.style.visibility = 'hidden';
                menuButton.style.opacity = '0';
                menuButton.style.position = 'absolute';
                menuButton.style.pointerEvents = 'none';
            } else {
                menuButton.style.display = 'block';
                menuButton.removeAttribute('aria-hidden');
                menuButton.style.visibility = 'visible';
                menuButton.style.opacity = '1';
                menuButton.style.position = 'static';
                menuButton.style.pointerEvents = 'auto';
            }
        }
    }
    
    // 初期化時に実行
    forceHideMenuButtonOnPC();
    
    // PC表示をbodyクラスで管理
    if (window.innerWidth > 900) {
        document.body.classList.add('pc-view');
    } else {
        document.body.classList.add('mobile-view');
    }
