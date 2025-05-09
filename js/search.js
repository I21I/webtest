// サイト内検索処理
function handleSiteSearch(e) {
    if (e.key === 'Enter') {
        const searchTerm = this.value.trim();
        if (searchTerm === '') return;
        
        performSiteSearch(searchTerm);
        this.blur();
    }
}

// サイト内検索の実行
function performSiteSearch(query) {
    const searchResultsContent = document.getElementById('search-results-content');
    const searchQuery = document.getElementById('search-query');
    
    searchQuery.textContent = query;
    query = query.toLowerCase();
    
    // 検索結果のフィルタリング
    const results = window.searchIndex.filter(item => {
        return item.title.toLowerCase().includes(query) || 
               item.content.toLowerCase().includes(query) || 
               item.tags.some(tag => tag.toLowerCase().includes(query));
    });
    
    if (results.length > 0) {
        let html = '<ul class="search-result-list">';
        
        results.forEach(result => {
            // 検索語のハイライト
            let highlightedContent = result.content;
            let highlightedTitle = result.title;
            
            // 簡易的なハイライト処理
            highlightedContent = highlightedContent.replace(
                new RegExp(query, 'gi'), 
                match => `<mark>${match}</mark>`
            );
            
            highlightedTitle = highlightedTitle.replace(
                new RegExp(query, 'gi'), 
                match => `<mark>${match}</mark>`
            );
            
            html += `
                <li class="search-result-item">
                    <h4 class="search-result-title"><a href="${result.url}">${highlightedTitle}</a></h4>
                    <p class="search-result-snippet">${highlightedContent}</p>
                    <p class="search-result-path">${result.path}</p>
                </li>
            `;
        });
        
        html += '</ul>';
        searchResultsContent.innerHTML = html;
    } else {
        searchResultsContent.innerHTML = '<div class="search-no-results">検索条件に一致する結果が見つかりませんでした。別のキーワードをお試しください。</div>';
    }
    
    // 検索結果を表示
    document.getElementById('search-results').classList.add('active');
    
    // モバイルメニューを閉じる
    document.getElementById('mobile-menu').classList.remove('active');
}

// 検索結果を閉じる
function closeSearchResults() {
    document.getElementById('search-results').classList.remove('active');
}

// イベントリスナーの設定
document.addEventListener('DOMContentLoaded', function() {
    const siteSearchInput = document.getElementById('site-search-input');
    const mobileSiteSearchInput = document.getElementById('mobile-site-search-input');
    const searchClose = document.getElementById('search-close');
    
    if (siteSearchInput) {
        siteSearchInput.addEventListener('keypress', handleSiteSearch);
    }
    
    if (mobileSiteSearchInput) {
        mobileSiteSearchInput.addEventListener('keypress', handleSiteSearch);
    }
    
    if (searchClose) {
        searchClose.addEventListener('click', closeSearchResults);
    }
    
    // 検索結果外クリックでの閉じる
    document.addEventListener('click', function(e) {
        const searchResults = document.getElementById('search-results');
        if (searchResults && searchResults.classList.contains('active') && 
            !searchResults.contains(e.target) && 
            e.target !== siteSearchInput && 
            e.target !== mobileSiteSearchInput) {
            closeSearchResults();
        }
    });
    
    // ESC キーでの閉じる
    document.addEventListener('keydown', function(e) {
        const searchResults = document.getElementById('search-results');
        if (e.key === 'Escape' && searchResults && searchResults.classList.contains('active')) {
            closeSearchResults();
        }
    });
});
