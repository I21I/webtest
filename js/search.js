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
    
    if (!searchResultsContent || !searchQuery || !window.searchIndex) return;
    
    searchQuery.textContent = query;
    query = query.toLowerCase();
    
    // 検索結果のフィルタリング - 検索範囲を拡大
    const results = window.searchIndex.filter(item => {
        // タイトル、コンテンツ、タグに加えて、オブジェクトが持つすべてのテキストプロパティを検索
        return (
            item.title.toLowerCase().includes(query) || 
            item.content.toLowerCase().includes(query) || 
            (item.tags && item.tags.some(tag => 
                typeof tag === 'string' && tag.toLowerCase().includes(query)
            )) ||
            // 他の可能性のあるフィールドも検索
            (item.description && typeof item.description === 'string' && 
                item.description.toLowerCase().includes(query)) ||
            (item.path && typeof item.path === 'string' && 
                item.path.toLowerCase().includes(query))
        );
    });
    
    if (results.length > 0) {
        let html = '<ul class="search-result-list">';
        
        results.forEach(result => {
            // 検索語のハイライト
            let highlightedContent = result.content;
            let highlightedTitle = result.title;
            
            // 簡易的なハイライト処理
            const highlightText = (text) => {
                if (!text || typeof text !== 'string') return '';
                return text.replace(
                    new RegExp(query, 'gi'), 
                    match => `<mark>${match}</mark>`
                );
            };
            
            highlightedContent = highlightText(highlightedContent);
            highlightedTitle = highlightText(highlightedTitle);
            
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
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
    }
}

// 検索結果を閉じる
function closeSearchResults() {
    const searchResults = document.getElementById('search-results');
    if (searchResults) {
        searchResults.classList.remove('active');
    }
}
