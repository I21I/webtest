// advanced-search.js - lilycalInventory風の高度な検索機能

/**
 * 検索インデックスを生成する関数
 * すべてのコンテンツを詳細に取得して検索対象化
 */
function generateAdvancedSearchIndex() {
    console.log('高度な検索インデックスを生成します...');

    // リッチな検索インデックスの配列を初期化
    const searchIndex = [];

    try {
        // まず、すべてのタブを表示状態にして内容を取得できるようにする
        // 元のアクティブタブを記憶
        const activeTabs = [];
        document.querySelectorAll('.tab.active').forEach(tab => {
            activeTabs.push(tab);
        });

        // すべてのタブを一時的にアクティブにしてコンテンツを展開
        document.querySelectorAll('.tab').forEach(tab => {
            // タブをクリックしてコンテンツを表示
            tab.click();
        });

        // ==================== ツールカードの処理 ====================
        document.querySelectorAll('.tool-card').forEach(function(card, index) {
            const title = card.querySelector('.tool-name')?.textContent?.trim() || '';
            const version = card.querySelector('.tool-version')?.textContent?.trim() || '';
            const description = card.querySelector('.tool-description')?.textContent?.trim() || '';
            const tags = card.getAttribute('data-tags')?.split(',').map(tag => tag.trim()) || [];
            
            // 主な機能と動作環境
            const featuresList = [];
            const envList = [];
            
            // 「主な機能」の項目を取得
            const featuresSection = Array.from(card.querySelectorAll('.tool-specs h4')).find(h4 => 
                h4.textContent?.includes('主な機能')
            );
            if (featuresSection) {
                const featureItems = featuresSection.nextElementSibling?.querySelectorAll('li') || [];
                featureItems.forEach(item => {
                    featuresList.push(item.textContent?.trim() || '');
                });
            }
            
            // 「動作環境」の項目を取得
            const envSection = Array.from(card.querySelectorAll('.tool-specs h4')).find(h4 => 
                h4.textContent?.includes('動作環境')
            );
            if (envSection) {
                const envItems = envSection.nextElementSibling?.querySelectorAll('li') || [];
                envItems.forEach(item => {
                    envList.push(item.textContent?.trim() || '');
                });
            }
            
            // ツール情報をインデックスに追加
            searchIndex.push({
                id: 'tool-' + index,
                title: title,
                url: "#tools-section",
                content: description,
                tags: tags,
                section: "ツール",
                icon: "🧰",
                version: version,
                features: featuresList,
                environment: envList,
                detailContent: `バージョン: ${version}\n\n${description}\n\n主な機能:\n${featuresList.map(f => `• ${f}`).join('\n')}\n\n動作環境:\n${envList.map(e => `• ${e}`).join('\n')}`
            });
        });

        // ==================== セクションタイトルの処理 ====================
        document.querySelectorAll('section').forEach(function(section, index) {
            const sectionId = section.id || '';
            if (!sectionId) return;
            
            const title = section.querySelector('.section-title')?.textContent?.trim() || '';
            const sectionContent = section.textContent?.trim().replace(title, '') || '';
            
            // セクション情報をインデックスに追加
            searchIndex.push({
                id: 'section-' + index,
                title: title,
                url: "#" + sectionId,
                content: sectionContent.slice(0, 150) + '...',  // 最初の150文字だけ
                section: "セクション",
                icon: "📑",
                type: "section"
            });
        });

        // ==================== タブコンテンツの処理（重要） ====================
        // VCCタブとALCOMタブの内容を詳細に取得
        document.querySelectorAll('.tab-content').forEach(function(tabContent, index) {
            const tabId = tabContent.id || '';
            if (!tabId) return;
            
            // タブ名を取得（例: vcc-tab → VCC）
            const tabName = tabId.replace('-tab', '').toUpperCase();
            
            // タブ内のすべてのテキストコンテンツ
            const fullContent = tabContent.textContent?.trim() || '';
            
            // タブ内の手順リスト
            const steps = [];
            tabContent.querySelectorAll('li').forEach(function(step) {
                steps.push(step.textContent?.trim() || '');
            });
            
            // コードブロック（URL等）
            const codeBlock = tabContent.querySelector('pre')?.textContent?.trim() || '';
            
            // タブ情報をインデックスに追加
            searchIndex.push({
                id: 'tab-' + index,
                title: tabName + "インストール方法",
                url: "#install-section",
                content: steps.join(' '),
                fullContent: fullContent,
                section: "インストール方法",
                icon: "💾",
                type: "tab",
                steps: steps,
                codeContent: codeBlock,
                detailContent: `${tabName}インストール手順:\n${steps.map((s, i) => `${i+1}. ${s}`).join('\n')}\n\n${codeBlock ? `使用するURL:\n${codeBlock}` : ''}`
            });
        });

        // ==================== インストールセクションの注意事項 ====================
        const installNote = document.querySelector('#install-section .install-note')?.textContent?.trim() || '';
        if (installNote) {
            searchIndex.push({
                id: 'install-note',
                title: "インストールに関する注意事項",
                url: "#install-section",
                content: installNote,
                section: "インストール方法",
                icon: "ℹ️",
                type: "note"
            });
        }

        // ==================== お問い合わせセクション ====================
        const contactSection = document.querySelector('#contact-section');
        if (contactSection) {
            const contactContent = contactSection.querySelector('.info-content p')?.textContent?.trim() || '';
            const contactLinks = [];
            
            contactSection.querySelectorAll('.social-links a').forEach(function(link) {
                const linkText = link.textContent?.trim() || '';
                const linkUrl = link.getAttribute('href') || '';
                contactLinks.push({ text: linkText, url: linkUrl });
            });
            
            searchIndex.push({
                id: 'contact',
                title: "お問い合わせ",
                url: "#contact-section",
                content: contactContent,
                section: "お問い合わせ",
                icon: "📩",
                links: contactLinks,
                detailContent: `${contactContent}\n\n${contactLinks.map(link => `• ${link.text}: ${link.url}`).join('\n')}`
            });
        }

        // ==================== メインセクション ====================
        const mainTitle = document.querySelector('h1')?.textContent?.trim() || '';
        const subtitle = document.querySelector('.subtitle')?.textContent?.trim() || '';
        
        searchIndex.push({
            id: 'main',
            title: mainTitle,
            url: "#",
            content: subtitle,
            section: "ホーム",
            icon: "🏠",
            detailContent: `${mainTitle}\n${subtitle}`
        });

        // 元のアクティブタブを復元
        activeTabs.forEach(tab => {
            tab.click();
        });

        // 検索インデックスをグローバル変数に設定
        window.searchIndex = searchIndex;
        console.log('検索インデックスが生成されました。項目数:', searchIndex.length);
        
        return searchIndex;
    } catch (error) {
        console.error('検索インデックス生成中にエラーが発生しました:', error);
        return [];
    }
}

/**
 * サイト内検索処理
 */
function handleSiteSearch(e) {
    if (e.key === 'Enter') {
        const searchTerm = this.value.trim();
        if (searchTerm === '') return;
        
        performAdvancedSearch(searchTerm);
        this.blur();
    }
}

/**
 * 高度な検索の実行
 */
function performAdvancedSearch(query) {
    // 必要な要素を取得
    const searchResultsContent = document.getElementById('search-results-content');
    const searchQuery = document.getElementById('search-query');
    
    if (!searchResultsContent || !searchQuery) return;
    
    // まだ検索インデックスが生成されていない場合は生成
    if (!window.searchIndex) {
        window.searchIndex = generateAdvancedSearchIndex();
    }
    
    searchQuery.textContent = query;
    query = query.toLowerCase();
    
    // 検索結果のフィルタリング - 詳細な検索
    const results = window.searchIndex.filter(item => {
        // 基本的な項目の検索
        const basicSearch = (
            (item.title && item.title.toLowerCase().includes(query)) || 
            (item.content && item.content.toLowerCase().includes(query))
        );
        
        // タグの検索
        const tagSearch = item.tags && Array.isArray(item.tags) && 
            item.tags.some(tag => typeof tag === 'string' && tag.toLowerCase().includes(query));
        
        // 詳細コンテンツの検索
        const detailSearch = (
            (item.detailContent && item.detailContent.toLowerCase().includes(query)) ||
            (item.fullContent && item.fullContent.toLowerCase().includes(query))
        );
        
        // ステップの検索（タブ内の手順）
        const stepSearch = item.steps && Array.isArray(item.steps) &&
            item.steps.some(step => typeof step === 'string' && step.toLowerCase().includes(query));
        
        // コードコンテンツの検索
        const codeSearch = item.codeContent && item.codeContent.toLowerCase().includes(query);
        
        // 機能リストの検索
        const featureSearch = item.features && Array.isArray(item.features) &&
            item.features.some(feature => typeof feature === 'string' && feature.toLowerCase().includes(query));
        
        // 環境リストの検索
        const envSearch = item.environment && Array.isArray(item.environment) &&
            item.environment.some(env => typeof env === 'string' && env.toLowerCase().includes(query));
        
        return basicSearch || tagSearch || detailSearch || stepSearch || codeSearch || featureSearch || envSearch;
    });
    
    // 検索結果をセクション別にグループ化
    const groupedResults = {};
    results.forEach(result => {
        const section = result.section || 'その他';
        if (!groupedResults[section]) {
            groupedResults[section] = [];
        }
        groupedResults[section].push(result);
    });
    
    if (results.length > 0) {
        let html = '<div class="search-results-count">検索結果: ' + results.length + '件</div>';
        
        // セクション別に結果を表示
        Object.keys(groupedResults).forEach(section => {
            html += `<h3 class="search-section-title">${section}</h3>`;
            html += '<ul class="search-result-list">';
            
            groupedResults[section].forEach(result => {
                // 検索語のハイライト
                const highlightText = (text) => {
                    if (!text || typeof text !== 'string') return '';
                    return text.replace(
                        new RegExp(query, 'gi'), 
                        match => `<mark>${match}</mark>`
                    );
                };
                
                const highlightedTitle = highlightText(result.title);
                
                // 表示するコンテンツを決定（詳細またはシンプル）
                let displayContent = '';
                if (result.detailContent) {
                    // 詳細コンテンツから検索クエリを含む部分を抽出
                    const detailContent = result.detailContent;
                    const queryIndex = detailContent.toLowerCase().indexOf(query.toLowerCase());
                    
                    if (queryIndex >= 0) {
                        // クエリを含む前後のテキストを表示（最大150文字）
                        const start = Math.max(0, queryIndex - 50);
                        const end = Math.min(detailContent.length, queryIndex + query.length + 50);
                        displayContent = (start > 0 ? '...' : '') + 
                                       highlightText(detailContent.substring(start, end)) + 
                                       (end < detailContent.length ? '...' : '');
                    } else {
                        // クエリを含まない場合は最初の150文字
                        displayContent = highlightText(detailContent.substring(0, 150) + (detailContent.length > 150 ? '...' : ''));
                    }
                } else {
                    // 通常のコンテンツ
                    displayContent = highlightText(result.content);
                }
                
                // 検索結果アイテムの生成
                html += `
                    <li class="search-result-item">
                        <h4 class="search-result-title">
                            ${result.icon ? `<span class="result-icon">${result.icon}</span>` : ''}
                            <a href="${result.url}">${highlightedTitle}</a>
                            ${result.version ? `<span class="result-version">${result.version}</span>` : ''}
                        </h4>
                        <p class="search-result-snippet">${displayContent}</p>
                        <p class="search-result-path">${result.section || ''}</p>
                    </li>
                `;
            });
            
            html += '</ul>';
        });
        
        searchResultsContent.innerHTML = html;
    } else {
        searchResultsContent.innerHTML = '<div class="search-no-results">検索条件に一致する結果が見つかりませんでした。別のキーワードをお試しください。</div>';
    }
    
    // 検索結果を表示
    document.getElementById('search-results').classList.add('active');
    
    // モバイルメニューを閉じる
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
    }
}

/**
 * 検索結果を閉じる
 */
function closeSearchResults() {
    const searchResults = document.getElementById('search-results');
    if (searchResults) {
        searchResults.classList.remove('active');
    }
}

// ページ読み込み時に検索インデックスを生成
document.addEventListener('DOMContentLoaded', function() {
    // ページ読み込み完了後、少し遅延させて検索インデックスを生成
    // これによりタブコンテンツなども確実に取得できる
    setTimeout(() => {
        generateAdvancedSearchIndex();
    }, 500);
    
    // 検索入力欄のイベントリスナーを設定
    const siteSearchInput = document.getElementById('site-search-input');
    if (siteSearchInput) {
        siteSearchInput.addEventListener('keypress', handleSiteSearch);
    }
    
    const mobileSiteSearchInput = document.getElementById('mobile-site-search-input');
    if (mobileSiteSearchInput) {
        mobileSiteSearchInput.addEventListener('keypress', handleSiteSearch);
    }
    
    // 検索閉じるボタンのイベントリスナーを設定
    const searchClose = document.getElementById('search-close');
    if (searchClose) {
        searchClose.addEventListener('click', closeSearchResults);
    }
});
