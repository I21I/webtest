// search.js - 最終完全修正版検索機能

/**
 * 検索インデックスを生成する関数
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
 * ブラウザバックボタンやタブ閉じる際の検出
 */
window.addEventListener('popstate', function(event) {
    // 検索タブが開いている場合は閉じる
    const searchResults = document.getElementById('search-results');
    if (searchResults && searchResults.classList.contains('active')) {
        closeSearchResults();
    }
});

// グローバル変数 - 検索ダイアログが開いているかどうか
window.isSearchDialogOpen = false;

/**
 * サイト内検索フィールドをクリックしたときの処理
 */
function handleSearchFieldClick(e) {
    // イベントの即時停止 (バブリングと既定の動作を両方停止)
    if (e && e.preventDefault) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // すでに検索ダイアログが開いている場合は何もしない
    if (window.isSearchDialogOpen) {
        return;
    }
    
    // 検索ダイアログを作成
    createSearchDialog();
    
    // 検索ダイアログを表示
    openSearchDialog();
    
    // 検索タブ内のフィールドにフォーカス
    setTimeout(() => {
        const searchQueryDisplay = document.getElementById('search-query-display');
        if (searchQueryDisplay) {
            searchQueryDisplay.focus();
        }
    }, 50);
}

/**
 * 検索ダイアログを開く
 */
function openSearchDialog() {
    // すでに開いている場合は何もしない
    if (window.isSearchDialogOpen) {
        return;
    }
    
    // 検索タブを表示
    const searchResults = document.getElementById('search-results');
    if (!searchResults) return;
    
    // まずオーバーレイを表示して検索モードをアクティブ化
    document.body.classList.add('search-open');
    
    // 検索ダイアログを表示位置に配置して表示
    searchResults.style.display = 'flex';
    
    // レイアウトの再計算を強制して、アニメーションが確実に実行されるようにする
    window.getComputedStyle(searchResults).getPropertyValue('opacity');
    
    // アクティブクラスを追加してアニメーション開始
    searchResults.classList.add('active');
    
    // 検索ダイアログが開いていることをフラグに記録
    window.isSearchDialogOpen = true;
    
    // 開いた直後は外側クリック判定を一時的に無効化
    window._ignoreOutsideClick = true;
    setTimeout(() => {
        window._ignoreOutsideClick = false;
    }, 700); // 十分な時間待機
    
    // モバイルメニューを閉じる
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
    }
    
    // デバイスサイズに合わせた表示
    handleWindowResize();
}

/**
 * 検索入力をクリアする
 */
function clearSearchInput(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        input.value = '';
        input.focus();
        
        // クリアボタンがあれば非表示に
        const parent = input.parentElement;
        if (parent) {
            const clearButton = parent.querySelector('.search-clear-button');
            if (clearButton) {
                clearButton.classList.remove('visible');
            }
        }
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
        
        // クリアボタンの表示状態を更新
        const clearButton = document.getElementById('search-clear-button');
        if (clearButton) {
            clearButton.classList.toggle('visible', query.length > 0);
        }
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
                
                // 検索結果アイテムの生成 - クリック可能だがテキスト選択も可能に
                html += `
                    <li class="search-result-item" data-url="${result.url}">
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
        
        // 検索結果アイテムにクリックイベントを設定（テキスト選択と分けるため）
        document.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', function(e) {
                // テキスト選択中は無視
                if (window.getSelection().toString()) return;
                
                const url = this.getAttribute('data-url');
                if (url) {
                    handleResultClick(url);
                }
            });
        });
    } else {
        searchResultsContent.innerHTML = '<div class="search-no-results">検索条件に一致する結果が見つかりませんでした。別のキーワードをお試しください。</div>';
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
 * 検索結果を閉じる
 */
function closeSearchResults() {
    // すでに閉じている場合は何もしない
    if (!window.isSearchDialogOpen) {
        return;
    }
    
    const searchResults = document.getElementById('search-results');
    if (!searchResults) return;
    
    // アクティブクラスを削除してアニメーション開始
    searchResults.classList.remove('active');
    document.body.classList.remove('search-open');
    
    // トランジション完了後に非表示にする
    setTimeout(() => {
        if (!searchResults.classList.contains('active')) {
            searchResults.style.display = 'none';
            // 検索ダイアログが閉じたことをフラグに記録
            window.isSearchDialogOpen = false;
        }
    }, 300); // CSSのトランジション時間に合わせる
}

/**
 * 検索結果ポップアップの外側クリックで閉じる処理
 */
function setupOutsideClickHandler() {
    document.addEventListener('click', function(e) {
        // 直後のクリックは無視するフラグがある場合は処理をスキップ
        if (window._ignoreOutsideClick) {
            return;
        }
        
        // 検索ダイアログが開いていない場合は何もしない
        if (!window.isSearchDialogOpen) {
            return;
        }
        
        const searchResults = document.getElementById('search-results');
        if (!searchResults) return;
        
        // サイト内検索フィールドがクリックされた場合は閉じない
        const siteSearchInput = document.getElementById('site-search-input');
        const mobileSiteSearchInput = document.getElementById('mobile-site-search-input');
        
        // 検索フィールドのクリックは無視
        if (siteSearchInput && (siteSearchInput === e.target || siteSearchInput.contains(e.target))) {
            return;
        }
        
        if (mobileSiteSearchInput && (mobileSiteSearchInput === e.target || mobileSiteSearchInput.contains(e.target))) {
            return;
        }
        
        // クリックされた要素が検索結果ポップアップの中にあるかチェック
        if (!searchResults.contains(e.target) && e.target.id !== 'search-overlay') {
            closeSearchResults();
        }
    });
}

/**
 * デバウンス関数 - 連続した呼び出しを遅延させる
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

/**
 * 検索クエリ入力欄変更時の処理 - リアルタイム検索
 */
function handleSearchQueryChange(e) {
    // 入力値が変わった時
    const query = this.value.trim();
    
    // クリアボタンの表示/非表示を切り替え
    const clearButton = document.getElementById('search-clear-button');
    if (clearButton) {
        clearButton.classList.toggle('visible', query.length > 0);
    }
    
    // 検索クエリが空の場合は検索しない
    if (query.length === 0) {
        document.getElementById('search-results-content').innerHTML = 
            '<div class="search-no-results">キーワードを入力して検索してください</div>';
        return;
    }
    
    // デバウンスされた検索実行（300ms後に実行）
    window.debouncedSearch(query);
}

/**
 * 検索ダイアログを作成
 */
function createSearchDialog() {
    // すでに存在する場合は削除して再作成
    const existingResults = document.getElementById('search-results');
    if (existingResults) {
        existingResults.parentNode.removeChild(existingResults);
    }
    
    const searchDialog = document.createElement('div');
    searchDialog.id = 'search-results';
    searchDialog.style.display = 'none'; // 初期状態は非表示
    
    // 検索ヘッダー部分
    const searchHeader = document.createElement('div');
    searchHeader.className = 'search-results-header';
    
    // 検索フィールド
    const searchField = document.createElement('div');
    searchField.className = 'search-field';
    searchField.innerHTML = `
        <div class="search-input-container">
            <span class="search-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm-8 6a8 8 0 1 1 14.32 4.906l5.387 5.387a1 1 0 0 1-1.414 1.414l-5.387-5.387A8 8 0 0 1 2 10z"></path>
                </svg>
            </span>
            <input type="text" id="search-query-display" class="search-query-input" placeholder="サイト内を検索...">
            <button type="button" id="search-clear-button" class="search-clear-button" aria-label="検索をクリア">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
            </button>
        </div>
    `;
    
    // 閉じるボタン追加
    const closeButton = document.createElement('button');
    closeButton.id = 'search-close-button';
    closeButton.className = 'search-close-button';
    closeButton.setAttribute('aria-label', '検索を閉じる');
    closeButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
    `;
    
    searchHeader.appendChild(searchField);
    searchHeader.appendChild(closeButton);
    searchDialog.appendChild(searchHeader);
    
    // 検索結果コンテンツ
    const searchContent = document.createElement('div');
    searchContent.id = 'search-results-content';
    searchContent.className = 'search-results-content';
    searchContent.innerHTML = '<div class="search-no-results">キーワードを入力して検索してください</div>';
    searchDialog.appendChild(searchContent);
    
    // ボディに追加
    document.body.appendChild(searchDialog);
    
    // 検索入力のイベントリスナー設定
    const searchQueryDisplay = document.getElementById('search-query-display');
    if (searchQueryDisplay) {
        // リアルタイム検索のためにinputイベントを監視
        searchQueryDisplay.addEventListener('input', handleSearchQueryChange);
        searchQueryDisplay.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query) {
                    performSiteSearch(query);
                }
            }
        });
    }
    
    // クリアボタンのイベントリスナー
    const clearButton = document.getElementById('search-clear-button');
    if (clearButton) {
        clearButton.addEventListener('click', function(e) {
            // イベント伝播を止める
            e.stopPropagation();
            
            const searchQueryDisplay = document.getElementById('search-query-display');
            if (searchQueryDisplay) {
                searchQueryDisplay.value = '';
                searchQueryDisplay.focus();
                this.classList.remove('visible');
                document.getElementById('search-results-content').innerHTML = 
                    '<div class="search-no-results">キーワードを入力して検索してください</div>';
            }
        });
    }
    
    // 閉じるボタンのイベントリスナー
    const searchCloseButton = document.getElementById('search-close-button');
    if (searchCloseButton) {
        searchCloseButton.addEventListener('click', function(e) {
            // イベント伝播を止める
            e.stopPropagation();
            closeSearchResults();
        });
    }
    
    console.log('検索ダイアログを作成しました');
}

/**
 * ツール検索のセットアップ
 */
function setupToolSearch() {
    // ツール検索フィールド
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    // 検索コンテナを取得
    const searchContainer = searchInput.closest('.search-container');
    if (!searchContainer) return;
    
    // 検索コンテナが絶対位置指定でないと子要素の絶対位置がずれる
    searchContainer.style.position = 'relative';
    
    // 虫眼鏡アイコンがない場合は追加
    if (!searchContainer.querySelector('.search-icon')) {
        const iconElement = document.createElement('span');
        iconElement.className = 'search-icon';
        iconElement.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm-8 6a8 8 0 1 1 14.32 4.906l5.387 5.387a1 1 0 0 1-1.414 1.414l-5.387-5.387A8 8 0 0 1 2 10z"></path>
            </svg>
        `;
        searchContainer.appendChild(iconElement);
    }
    
    // クリアボタンがない場合は追加
    if (!searchContainer.querySelector('.search-clear-button')) {
        const clearButton = document.createElement('button');
        clearButton.className = 'search-clear-button';
        clearButton.type = 'button';
        clearButton.setAttribute('aria-label', '検索をクリア');
        clearButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
        `;
        
        searchContainer.appendChild(clearButton);
        
        // クリアボタンのイベント
        clearButton.addEventListener('click', function(e) {
            e.stopPropagation();
            searchInput.value = '';
            searchInput.focus();
            this.classList.remove('visible');
            
            // ツール検索をクリア
            filterTools('');
        });
    }
    
    // 入力監視イベント
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        
        // クリアボタンの表示切替
        const clearButton = searchContainer.querySelector('.search-clear-button');
        if (clearButton) {
            clearButton.classList.toggle('visible', query.length > 0);
        }
        
        // リアルタイム検索を実行（デバウンス）
        window.debouncedFilterTools(query);
    });
    
    // リアルタイム検索のデバウンス関数
    window.debouncedFilterTools = debounce(filterTools, 300);
    
    console.log('ツール検索フィールドをセットアップしました');
}

/**
 * ツールのフィルタリング
 */
function filterTools(query) {
    const toolCards = document.querySelectorAll('.tool-card');
    const queryLower = query.toLowerCase();
    let visibleCount = 0;
    
    toolCards.forEach(card => {
        const title = card.querySelector('.tool-name')?.textContent?.toLowerCase() || '';
        const description = card.querySelector('.tool-description')?.textContent?.toLowerCase() || '';
        const tags = card.getAttribute('data-tags')?.toLowerCase() || '';
        
        if (title.includes(queryLower) || description.includes(queryLower) || tags.includes(queryLower)) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // 検索結果の表示
    const searchResults = document.getElementById('search-results-info');
    if (searchResults) {
        if (query.trim() === '') {
            searchResults.innerHTML = '';
        } else {
            searchResults.innerHTML = `検索結果: ${visibleCount}件のツールが見つかりました`;
        }
    }
}

/**
 * モバイルメニューからの検索を処理
 */
function setupMobileSearch() {
    // モバイルメニュー内の検索フィールド
    const mobileSiteSearchInput = document.getElementById('mobile-site-search-input');
    if (mobileSiteSearchInput) {
        // モバイル検索フィールドの位置とスタイルを調整
        const mobileSearchContainer = mobileSiteSearchInput.parentElement;
        if (mobileSearchContainer) {
            mobileSearchContainer.style.position = 'relative';
            
            // 虫眼鏡アイコンがない場合は追加
            if (!mobileSearchContainer.querySelector('.search-icon')) {
                const iconElement = document.createElement('span');
                iconElement.className = 'search-icon';
                iconElement.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm-8 6a8 8 0 1 1 14.32 4.906l5.387 5.387a1 1 0 0 1-1.414 1.414l-5.387-5.387A8 8 0 0 1 2 10z"></path>
                    </svg>
                `;
                mobileSearchContainer.appendChild(iconElement);
            }
            
            // クリアボタンがない場合は追加
            if (!mobileSearchContainer.querySelector('.search-clear-button')) {
                const clearButton = document.createElement('button');
                clearButton.className = 'search-clear-button';
                clearButton.type = 'button';
                clearButton.setAttribute('aria-label', '検索をクリア');
                clearButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                `;
                mobileSearchContainer.appendChild(clearButton);
            }
        }
        
        // すべてのイベントハンドラを削除（クローン作成で）
        const clonedInput = mobileSiteSearchInput.cloneNode(true);
        mobileSiteSearchInput.parentNode.replaceChild(clonedInput, mobileSiteSearchInput);
        
        // モバイルメニューからの検索クリック時に特別な処理
        clonedInput.addEventListener('click', function(e) {
            // イベント伝播を止める
            e.preventDefault();
            e.stopPropagation();
            
            // まずモバイルメニューを閉じる
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
            }
            
            // 少し遅延させて検索ダイアログを表示
            setTimeout(() => {
                handleSearchFieldClick(e);
            }, 50);
        });
    }
    
    // 画面サイズ変更時の処理
    window.addEventListener('resize', debounce(handleWindowResize, 200));
    
    // 初期表示時にも一度チェック
    handleWindowResize();
}

/**
 * 画面サイズ変更時の処理
 */
function handleWindowResize() {
    // 小さい画面サイズでダイアログが表示されている場合の対応
    const searchResults = document.getElementById('search-results');
    if (!searchResults) return;
    
    if (window.innerWidth <= 768) {
        // モバイル表示では必ず中央に表示（絶対指定）
        searchResults.classList.add('mobile-view');
    } else {
        // PC表示では通常表示
        searchResults.classList.remove('mobile-view');
    }
}

/**
 * VCC/ALCOMタブの修正
 */
function fixTabSwitching() {
    // タブクリックのイベントハンドラを再設定
    document.querySelectorAll('.tabs .tab').forEach(tab => {
        // すべてのイベントリスナーをクリア
        const clone = tab.cloneNode(true);
        tab.parentNode.replaceChild(clone, tab);
        
        // 新しいイベントリスナーを設定
        clone.addEventListener('click', function(e) {
            e.preventDefault();
            
            // クリックされたタブのID取得
            const tabId = this.getAttribute('data-tab');
            if (!tabId) return;
            
            // 同じグループの全タブから.activeを削除
            const tabGroup = this.closest('.tabs');
            if (tabGroup) {
                // 同グループのタブを非アクティブ化
                tabGroup.querySelectorAll('.tab').forEach(t => {
                    t.classList.remove('active');
                });
                
                // 関連するタブコンテンツを全て非表示
                const tabContents = document.querySelectorAll('.tab-content');
                tabContents.forEach(content => {
                    content.style.display = 'none';
                });
            }
            
            // クリックされたタブをアクティブ化
            this.classList.add('active');
            
            // 対応するコンテンツを表示
            const targetContent = document.getElementById(tabId + '-tab');
            if (targetContent) {
                targetContent.style.display = 'block';
            }
            
            console.log('タブ切替：', tabId);
        });
    });
    
    console.log('タブ切り替え機能を修正しました');
}

/**
 * 初期表示タブの設定 - ページロード時
 */
function setupInitialTabs() {
    // URLハッシュに基づいてタブを表示
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
        const tabId = hash.substring(1); // #を除去
        
        // 対応するタブがあれば選択
        const tab = document.querySelector(`.tab[data-tab="${tabId}"]`);
        if (tab) {
            tab.click();
            return;
        }
    }
    
    // ハッシュがない場合は各タブグループの最初のタブをアクティブ化
    document.querySelectorAll('.tabs').forEach(tabGroup => {
        const firstTab = tabGroup.querySelector('.tab');
        if (firstTab) {
            firstTab.click();
        }
    });
}

/**
 * サイト内検索の初期化
 */
function setupSiteSearch() {
    // 右上の検索入力欄のセットアップ
    const siteSearchInput = document.getElementById('site-search-input');
    if (siteSearchInput) {
        // 検索コンテナの取得
        const searchWrapper = siteSearchInput.closest('.site-search-wrapper');
        if (searchWrapper) {
            // 位置を相対に設定
            searchWrapper.style.position = 'relative';
            
            // 虫眼鏡アイコンがない場合は追加
            if (!searchWrapper.querySelector('.search-icon')) {
                const iconElement = document.createElement('span');
                iconElement.className = 'search-icon';
                iconElement.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm-8 6a8 8 0 1 1 14.32 4.906l5.387 5.387a1 1 0 0 1-1.414 1.414l-5.387-5.387A8 8 0 0 1 2 10z"></path>
                    </svg>
                `;
                searchWrapper.appendChild(iconElement);
            }
            
            // クリアボタンがない場合は追加
            if (!searchWrapper.querySelector('.search-clear-button')) {
                const clearButton = document.createElement('button');
                clearButton.className = 'search-clear-button';
                clearButton.type = 'button';
                clearButton.setAttribute('aria-label', '検索をクリア');
                clearButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                `;
                searchWrapper.appendChild(clearButton);
            }
        }
        
        // サイト内検索のクリックイベントを登録
        siteSearchInput.addEventListener('click', handleSearchFieldClick);
        siteSearchInput.addEventListener('focus', function(e) {
            // フォーカスでも検索ダイアログを開く
            e.preventDefault();
            handleSearchFieldClick(e);
        });
        
        siteSearchInput.readOnly = true; // 入力を無効化
        siteSearchInput.placeholder = 'サイト内検索...';
    }
}

// ページ読み込み時の初期化処理
document.addEventListener('DOMContentLoaded', function() {
    // リアルタイム検索のためのデバウンス関数を設定
    window.debouncedSearch = debounce(performSiteSearch, 300);
    
    // 検索関連の処理を初期化
    setupSiteSearch();
    
    // 外側クリックで閉じる機能のセットアップ
    setupOutsideClickHandler();
    
    // オーバーレイ要素の追加
    const overlay = document.createElement('div');
    overlay.id = 'search-overlay';
    overlay.className = 'search-overlay';
    overlay.addEventListener('click', function(e) {
        // イベント伝播を止める
        e.stopPropagation();
        closeSearchResults();
    });
    document.body.appendChild(overlay);
    
    // モバイルメニュー用の検索処理
    setupMobileSearch();
    
    // ツール検索フィールドのセットアップ
    setupToolSearch();
    
    // タブ切り替え機能の修正
    fixTabSwitching();
    
    // 初期表示タブの設定
    setupInitialTabs();
    
    // 検索インデックスの生成（遅延実行）
    setTimeout(() => {
        generateSearchIndex();
    }, 500);
    
    console.log('検索機能の初期化が完了しました');
});
