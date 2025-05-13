// 検索アイコンのクリックイベントを修正
function handleSearchFieldClick(e) {
    if (e && e.preventDefault) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    if (window.isSearchDialogOpen) {
        return;
    }
    
    createSearchDialog();
    openSearchDialog();
    
    setTimeout(() => {
        const searchQueryDisplay = document.getElementById('search-query-display');
        if (searchQueryDisplay) {
            searchQueryDisplay.focus();
        }
    }, 50);
}

// モバイル表示時のサイト内検索アイコンのイベントハンドラ
document.addEventListener('DOMContentLoaded', function() {
    const mobileSearchToggle = document.getElementById('mobile-search-toggle');
    if (mobileSearchToggle) {
        // すでに設定されている可能性のあるイベントリスナーをクリア
        const newMobileSearchToggle = mobileSearchToggle.cloneNode(true);
        mobileSearchToggle.parentNode.replaceChild(newMobileSearchToggle, mobileSearchToggle);
        
        // 新しいイベントリスナーを設定
        newMobileSearchToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // メニューが開いていれば閉じる
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
            }
            
            // 検索ダイアログを表示
            handleSearchFieldClick(e);
        });
    }
    
    // 既存のサイト検索フィールドのイベントリスナーも強化
    const siteSearchInput = document.getElementById('site-search-input');
    if (siteSearchInput) {
        const newSiteSearchInput = siteSearchInput.cloneNode(true);
        siteSearchInput.parentNode.replaceChild(newSiteSearchInput, siteSearchInput);
        
        newSiteSearchInput.addEventListener('click', handleSearchFieldClick);
        newSiteSearchInput.addEventListener('focus', function(e) {
            e.preventDefault();
            handleSearchFieldClick(e);
        });
        
        newSiteSearchInput.readOnly = true;
        newSiteSearchInput.placeholder = 'サイト内検索...';
    }
});
