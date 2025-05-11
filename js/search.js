// search.js - 最終修正版検索機能

/**
 * 確実にタブコンテンツを含む検索インデックスを生成する関数
 */
function generateSearchIndex() {
    console.log('検索インデックスを生成します...');
    const searchIndex = [];

    try {
        // タブコンテンツを確実に取得するための特別な処理
        forceActivateAllTabs();
        
        // ツールカードの処理
        document.querySelectorAll('.tool-card').forEach(function(card) {
            const title = card.querySelector('.tool-name')?.textContent?.trim() || '';
            const version = card.querySelector('.tool-version')?.textContent?.trim() || '';
            const description = card.querySelector('.tool-description')?.textContent?.trim() || '';
            const tags = card.getAttribute('data-tags')?.split(',') || [];
            
            // 主な機能と動作環境も検索対象に含める
            const features = [];
            card.querySelectorAll('.tool-specs ul li').forEach(function(item) {
                features.push(item.textContent?.trim() || '');
            });
            
            searchIndex.push({
                title: title,
                url: "#tools-section",
                content: description,
                tags: tags,
                path: "ツール",
                version: version,
                features: features.join(' ')
            });
        });
        
        // セクションタイトルの処理
        document.querySelectorAll('.section-title').forEach(function(section) {
            const title = section.textContent?.trim() || '';
            const sectionId = section.closest('section')?.id || '';
            
            if (sectionId) {
                searchIndex.push({
                    title: title,
                    url: "#" + sectionId,
                    content: "セクション: " + title,
                    path: "セクション"
                });
            }
        });
        
        // タブコンテンツの処理
        document.querySelectorAll('.tab-content').forEach(function(tabContent) {
            const tabId = tabContent.id || '';
            if (!tabId) return;
            
            // タブ名を取得（例: vcc-tab → VCC）
            const tabName = tabId.replace('-tab', '').toUpperCase();
            
            // タブ内のすべてのテキストコンテンツを取得
            const fullText = tabContent.textContent?.trim() || '';
            
            // タブ内の手順リスト
            const steps = [];
            tabContent.querySelectorAll('li').forEach(function(step) {
                const stepText = step.textContent?.trim() || '';
                if (stepText) steps.push(stepText);
            });
            
            // コードブロック（URL等）
            const codeBlock = tabContent.querySelector('pre')?.textContent?.trim() || '';
            
            // タブ内容をインデックスに追加
            searchIndex.push({
                title: tabName + " インストール方法",
                url: "#install-section",
                content: steps.join(' ') + ' ' + codeBlock,
                fullContent: fullText,
                path: "インストール方法",
                tabId: tabId
            });
            
            console.log('タブコンテンツを登録:', tabName, 'ステップ数:', steps.length);
        });
        
        // インストールセクションの処理
        const installNote = document.querySelector('#install-section .install-note')?.textContent?.trim() || '';
        if (installNote) {
            searchIndex.push({
                title: "インストール方法の注意事項",
                url: "#install-section",
                content: installNote,
                path: "インストール方法"
            });
        }
        
        // お問い合わせセクションの処理
        const contactContent = document.querySelector('#contact-section .info-content p')?.textContent?.trim() || '';
        const contactLinks = [];
        document.querySelectorAll('#contact-section .social-links a').forEach(function(link) {
            contactLinks.push(link.textContent?.trim() + ': ' + link.getAttribute('href'));
        });
        
        searchIndex.push({
            title: "お問い合わせ",
            url: "#contact-section",
            content: contactContent,
            tags: ["お問い合わせ", "Twitter", "Booth"],
            path: "お問い合わせ",
            links: contactLinks.join(' ')
        });
        
        // メインタイトルの処理
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
        
        return searchIndex;
    } catch (error) {
        console.error('検索インデックス生成中にエラーが発生しました:', error);
    } finally {
        // 元のタブ状態を復元
        resetTabsState();
    }
}

/**
 * すべてのタブを一時的にアクティブにしてコンテンツを読み込む
 */
function forceActivateAllTabs() {
    console.log('すべてのタブを一時的にアクティブにします...');
    
    // 元のアクティブタブを記憶
    window._originalActiveTabs = [];
    document.querySelectorAll('.tab.active').forEach(tab => {
        window._originalActiveTabs.push(tab);
    });
    
    // すべてのタブを一時的にアクティブにする
    document.querySelectorAll('.tab').forEach(tab => {
        // クリックではなくdisplayプロパティで直接制御
        const tabId = tab.getAttribute('data-tab');
        if (tabId) {
            const tabContent = document.getElementById(tabId + '-tab');
            if (tabContent) {
                // 一時的に表示して内容を確実に読み込む
                tabContent.style.display = 'block';
                console.log('タブ内容を読み込み:', tabId, tabContent.textContent.slice(0, 20) + '...');
            }
        }
    });
}

/**
 * タブの状態を元に戻す
 */
function resetTabsState() {
    console.log('タブの状態を元に戻します...');
    
    // すべてのタブコンテンツを非表示に
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });
    
    // 元々アクティブだったタブだけを表示
    if (window._originalActiveTabs) {
        window._originalActiveTabs.forEach(tab => {
            const tabId = tab.getAttribute('data-tab');
            if (tabId) {
                const tabContent = document.getElementById(tabId + '-tab');
                if (tabContent) {
                    tabContent.style.display = 'block';
                }
            }
        });
        
        // 不要になった変数をクリア
        delete window._originalActiveTabs;
    }
}

/**
 * サイト内検索処理
 */
function handleSiteSearch(e) {
    if (e.key === 'Enter') {
        const searchTerm = this.value.trim();
        if (searchTerm === '') return;
        
        performSiteSearch(searchTerm);
        this.blur();
    }
}

/**
 * 検索入力をクリアする
 */
function clearSearchInput(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        input.value = '';
        input.focus();
    }
}

/**
 * サイト内検索の実行
 */
function performSiteSearch(query) {
    const searchResultsContent = document.getElementById('search-results-content');
    const searchQueryDisplay = document.getElementById('search-query-display');
    
    if (!searchResultsContent) {
        console.error('検索結果要素が見つかりません');
        return;
    }
    
    // まだ検索インデックスが生成されていない場合は生成
    if (!window.searchIndex) {
        window.searchIndex = generateSearchIndex();
    }
    
    // 検索クエリを表示
    if (searchQueryDisplay) {
        searchQueryDisplay.value = query;
    }
    
    const queryLower = query.toLowerCase();
    
    // 検索結果のフィルタリング
    const results = window.searchIndex.filter(item => {
        return (
            // 基本検索
            (item.title && item.title.toLowerCase().includes(queryLower)) || 
            (item.content && item.content.toLowerCase().includes(queryLower)) || 
            
            // タグ検索
            (item.tags && item.tags.some(tag => 
                typeof tag === 'string' && tag.toLowerCase().includes(queryLower)
            )) ||
            
            // 全テキスト検索
            (item.fullContent && item.fullContent.toLowerCase().includes(queryLower)) ||
            
            // 機能リスト検索
            (item.features && item.features.toLowerCase().includes(queryLower)) ||
            
            // リンク検索
            (item.links && item.links.toLowerCase().includes(queryLower))
        );
    });
    
    // 検索結果をパスでグループ化
    const groupedResults = {};
    results.forEach(result => {
        const path = result.path || 'その他';
        if (!groupedResults[path]) {
            groupedResults[path] = [];
        }
        groupedResults[path].push(result);
    });
    
    if (results.length > 0) {
        let html = '<div class="search-results-count">検索結果: ' + results.length + '件</div>';
        
        // パス別に結果を表示
        Object.keys(groupedResults).forEach(path => {
            html += `<div class="search-section"><h3 class="search-section-title">${path}</h3>`;
            html += '<ul class="search-result-list">';
            
            groupedResults[path].forEach(result => {
                // 検索語のハイライト
                let highlightedContent = result.content || '';
                let highlightedTitle = result.title || '';
                
                const highlightText = (text) => {
                    if (!text || typeof text !== 'string') return '';
                    return text.replace(
                        new RegExp(queryLower, 'gi'), 
                        match => `<mark>${match}</mark>`
                    );
                };
                
                highlightedContent = highlightText(highlightedContent);
                highlightedTitle = highlightText(highlightedTitle);
                
                // 検索結果アイテムの生成 - アイテム全体をクリック可能に
                html += `
                    <li class="search-result-item" onclick="handleResultClick('${result.url}')">
                        <h4 class="search-result-title">
                            ${highlightedTitle}
                            ${result.version ? `<span class="result-version">${result.version}</span>` : ''}
                        </h4>
                        <p class="search-result-snippet">${highlightedContent}</p>
                        <p class="search-result-path">${result.path || ''}</p>
                    </li>
                `;
            });
            
            html += '</ul></div>';
        });
        
        searchResultsContent.innerHTML = html;
    } else {
        searchResultsContent.innerHTML = '<div class="search-no-results">検索条件に一致する結果が見つかりませんでした。別のキーワードをお試しください。</div>';
    }
    
    // 表示モードの設定
    const searchResults = document.getElementById('search-results');
    if (searchResults) {
        searchResults.classList.add('active');
        document.body.classList.add('search-open');
    }
    
    // モバイルメニューを閉じる
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
    }
}

/**
 * 検索結果アイテムクリック時の処理
 */
function handleResultClick(url) {
    // 検索結果を閉じる
    closeSearchResults();
    
    // リンク先に移動
    window.location.href = url;
}

/**
 * 検索結果の表示モードを切り替え（コンパクト/拡大）
 */
function toggleSearchResultsView() {
    const searchResults = document.getElementById('search-results');
    if (!searchResults) return;
    
    // クラスの追加/削除
    if (searchResults.classList.contains('expanded')) {
        searchResults.classList.remove('expanded');
    } else {
        searchResults.classList.add('expanded');
    }
    
    // 切り替えボタンのテキストを更新
    const toggleButton = document.getElementById('search-view-toggle');
    if (toggleButton) {
        toggleButton.textContent = searchResults.classList.contains('expanded') 
            ? '結果を縮小' 
            : '結果を拡大';
    }
}

/**
 * 検索結果を閉じる
 */
function closeSearchResults() {
    const searchResults = document.getElementById('search-results');
    if (searchResults) {
        searchResults.classList.remove('active');
        document.body.classList.remove('search-open');
    }
}

/**
 * 検索結果ポップアップの外側クリックで閉じる処理
 */
function setupOutsideClickHandler() {
    document.addEventListener('click', function(e) {
        const searchResults = document.getElementById('search-results');
        // 検索結果が表示されている場合のみ処理
        if (!searchResults || !searchResults.classList.contains('active')) return;
        
        // クリックされた要素が検索結果ポップアップの中にあるかチェック
        if (!searchResults.contains(e.target) && e.target.id !== 'search-overlay') {
            closeSearchResults();
        }
    });
}

/**
 * 検索クエリ入力欄変更時の処理
 */
function handleSearchQueryChange(e) {
    // Enter キーが押されたら検索実行
    if (e.key === 'Enter') {
        const query = this.value.trim();
        if (query) {
            performSiteSearch(query);
        }
    }
}

// ページ読み込み時に検索インデックスを生成
document.addEventListener('DOMContentLoaded', function() {
    // 検索入力欄にクリアボタンを追加
    addClearButtonToSearch('site-search-input');
    addClearButtonToSearch('mobile-site-search-input');
    
    // 検索ボタンのイベントリスナー
    const siteSearchInput = document.getElementById('site-search-input');
    if (siteSearchInput) {
        siteSearchInput.addEventListener('keypress', handleSiteSearch);
    }
    
    const mobileSiteSearchInput = document.getElementById('mobile-site-search-input');
    if (mobileSiteSearchInput) {
        mobileSiteSearchInput.addEventListener('keypress', handleSiteSearch);
    }
    
    // 検索結果に検索クエリ表示欄を追加
    const searchResultsHeader = document.querySelector('.search-results-header');
    if (searchResultsHeader) {
        // 既存の内容を削除
        searchResultsHeader.innerHTML = '';
        
        // 検索フィールドを追加
        const searchField = document.createElement('div');
        searchField.className = 'search-field';
        searchField.innerHTML = `
            <input type="text" id="search-query-display" class="search-query-input" placeholder="検索...">
            <button id="search-view-toggle" class="search-view-toggle">結果を拡大</button>
        `;
        searchResultsHeader.appendChild(searchField);
        
        // 検索フィールドのイベントリスナー
        const searchQueryDisplay = document.getElementById('search-query-display');
        if (searchQueryDisplay) {
            searchQueryDisplay.addEventListener('keypress', handleSearchQueryChange);
        }
        
        // 表示モード切り替えボタンのイベントリスナー
        const viewToggleButton = document.getElementById('search-view-toggle');
        if (viewToggleButton) {
            viewToggleButton.addEventListener('click', toggleSearchResultsView);
        }
    }
    
    // 外側クリックで閉じる機能のセットアップ
    setupOutsideClickHandler();
    
    // オーバーレイ要素の追加
    const overlay = document.createElement('div');
    overlay.id = 'search-overlay';
    overlay.className = 'search-overlay';
    document.body.appendChild(overlay);
    
    // ページ読み込み完了後、少し遅延させて検索インデックスを生成
    setTimeout(() => {
        generateSearchIndex();
    }, 500);
});

/**
 * 検索入力欄にクリアボタンを追加
 */
function addClearButtonToSearch(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    // 親要素（相対位置指定のためのコンテナ）
    const parent = input.parentElement;
    if (!parent) return;
    
    // クリアボタンを作成
    const clearButton = document.createElement('button');
    clearButton.className = 'search-clear-button';
    clearButton.setAttribute('type', 'button');
    clearButton.setAttribute('aria-label', '検索をクリア');
    clearButton.innerHTML = '×';
    
    // クリアボタンのイベント
    clearButton.addEventListener('click', function() {
        input.value = '';
        input.focus();
        this.classList.remove('visible');
    });
    
    // 入力内容が変更されたらボタンの表示/非表示を切り替え
    input.addEventListener('input', function() {
        if (this.value.length > 0) {
            clearButton.classList.add('visible');
        } else {
            clearButton.classList.remove('visible');
        }
    });
    
    // 初期状態の設定
    if (input.value.length > 0) {
        clearButton.classList.add('visible');
    }
    
    // 親要素にボタンを追加
    parent.appendChild(clearButton);
}
