// 検索インデックスを生成する関数
function generateSearchIndex() {
    // 検索インデックスの配列を初期化
    const searchIndex = [];
    
    // ツールカードの処理
    document.querySelectorAll('.tool-card').forEach(function(card) {
        const title = card.querySelector('.tool-name')?.textContent || '';
        const version = card.querySelector('.tool-version')?.textContent || '';
        const description = card.querySelector('.tool-description')?.textContent || '';
        const tags = card.getAttribute('data-tags')?.split(',') || [];
        
        // 主な機能と動作環境も検索対象に含める
        const features = [];
        card.querySelectorAll('.tool-specs ul li').forEach(function(item) {
            features.push(item.textContent || '');
        });
        
        searchIndex.push({
            title: title,
            url: "#tools-section",
            content: description,
            tags: tags,
            path: "ツール",
            version: version,
            features: features.join(' ') // 機能情報を追加
        });
    });
    
    // セクションタイトルの処理（新規追加）
    document.querySelectorAll('.section-title').forEach(function(section) {
        const title = section.textContent || '';
        const sectionId = section.closest('section')?.id || '';
        
        if (sectionId) {
            searchIndex.push({
                title: title.trim(),
                url: "#" + sectionId,
                content: "セクション: " + title.trim(),
                path: "セクション"
            });
        }
    });
    
    // タブコンテンツの処理（新規追加）
    document.querySelectorAll('.tab-content').forEach(function(tabContent) {
        const tabId = tabContent.id || '';
        const tabName = tabId.replace('-tab', '').toUpperCase(); // vcc-tab → VCC
        
        if (tabId) {
            // タブの内容をキャプチャ
            const steps = [];
            tabContent.querySelectorAll('li').forEach(function(step) {
                steps.push(step.textContent || '');
            });
            
            // preタグの内容も取得（URLなど）
            const codeContent = tabContent.querySelector('pre')?.textContent || '';
            
            searchIndex.push({
                title: tabName + "インストール方法",
                url: "#install-section",
                content: steps.join(' '),
                additionalContent: codeContent,
                path: "インストール方法"
            });
        }
    });
    
    // インストールセクションの処理
    const installNote = document.querySelector('#install-section .install-note')?.textContent || '';
    if (installNote) {
        searchIndex.push({
            title: "インストール方法",
            url: "#install-section",
            content: installNote,
            tags: ["VCC", "ALCOM", "インストール", "リポジトリ"],
            path: "インストール方法"
        });
    }
    
    // お問い合わせセクションの処理
    const contactContent = document.querySelector('#contact-section .info-content p')?.textContent || '';
    const contactLinks = [];
    document.querySelectorAll('#contact-section .social-links a').forEach(function(link) {
        contactLinks.push(link.textContent + ': ' + link.getAttribute('href'));
    });
    
    if (contactContent) {
        searchIndex.push({
            title: "お問い合わせ",
            url: "#contact-section",
            content: contactContent,
            tags: ["お問い合わせ", "Twitter", "Booth"],
            path: "お問い合わせ",
            links: contactLinks.join(', ')
        });
    }
    
    // 全体的な情報も索引に追加
    searchIndex.push({
        title: "二十一世紀症候群 VRChatツール",
        url: "#",
        content: document.querySelector('h1')?.textContent + ' - ' + document.querySelector('.subtitle')?.textContent,
        tags: ["VRChat", "ツール", "アバター改変", "最適化"],
        path: "ホーム"
    });
    
    // 検索インデックスをグローバル変数に設定
    window.searchIndex = searchIndex;
    console.log('検索インデックスが生成されました。項目数:', searchIndex.length);
}

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
        return (
            // 基本検索
            (item.title && item.title.toLowerCase().includes(query)) || 
            (item.content && item.content.toLowerCase().includes(query)) || 
            
            // タグ検索
            (item.tags && item.tags.some(tag => 
                typeof tag === 'string' && tag.toLowerCase().includes(query)
            )) ||
            
            // 追加コンテンツ検索（タブ内容など）
            (item.additionalContent && 
                item.additionalContent.toLowerCase().includes(query)
            ) ||
            
            // 機能リスト検索
            (item.features && 
                item.features.toLowerCase().includes(query)
            ) ||
            
            // リンク検索
            (item.links && 
                item.links.toLowerCase().includes(query)
            ) ||
            
            // その他のフィールド
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

// ページ読み込み時に検索インデックスを生成
document.addEventListener('DOMContentLoaded', function() {
    // 検索インデックス生成
    generateSearchIndex();
});
