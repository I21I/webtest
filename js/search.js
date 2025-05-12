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
 * サイト内検索フィールドをクリックしたときの処理
 */
function handleSearchFieldClick(e) {
    // クリックイベントの伝播を止める - 重要！
    e.preventDefault();
    e.stopPropagation();
    
    // 検索ダイアログを作成してから表示
    createSearchDialog();
    
    // 検索タブを表示
    openSearchDialog();
    
    // 検索タブ内のフィールドにフォーカス
    setTimeout(() => {
        const searchQueryDisplay = document.getElementById('search-query-display');
        if (searchQueryDisplay) {
            searchQueryDisplay.focus();
        }
    }, 100);
}

/**
 * サイト内検索処理（Enter押下時）
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
 * 検索ダイアログを開く
 */
function openSearchDialog() {
    // 検索タブを表示
    const searchResults = document.getElementById('search-results');
    if (searchResults) {
        // アニメーションのための遅延表示
        searchResults.style.display = 'flex';
        
        // レイアウトリフローを強制して、表示状態からアニメーション開始
        searchResults.offsetHeight;
        
        searchResults.classList.add('active');
        document.body.classList.add('search-open');
        
        // 開いた直後は外側クリック判定を一時的に無効化
        // これにより、検索フィールドのクリックが外側クリックと判定されることを防ぐ
        window._ignoreOutsideClick = true;
        setTimeout(() => {
            window._ignoreOutsideClick = false;
        }, 500); // 500ms後に外側クリック判定を有効化
    }
    
    // モバイルメニューを閉じる
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
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
    
    // 表示モードの設定 - 初期状態はコンパクトモード
    const searchResults = document.getElementById('search-results');
    if (searchResults) {
        searchResults.classList.add('active');
        
        // 前回の表示状態を維持するため、拡大モードは切り替えない
        // searchResults.classList.remove('expanded'); // これは削除
        
        document.body.classList.add('search-open');
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
    
    // 現在の状態を確認してトグル
    const isExpanded = searchResults.classList.contains('expanded');
    
    // クラスの追加/削除
    if (isExpanded) {
        searchResults.classList.remove('expanded');
    } else {
        searchResults.classList.add('expanded');
    }
    
    // 切り替えボタンのテキストを更新
    const toggleButton = document.getElementById('search-view-toggle');
    if (toggleButton) {
        toggleButton.textContent = isExpanded ? '結果を拡大' : '結果を縮小';
    }
    
    console.log('検索結果表示モード切替:', isExpanded ? 'コンパクト' : '拡大');
}

/**
 * 検索結果を閉じる
 */
function closeSearchResults() {
    const searchResults = document.getElementById('search-results');
    if (searchResults) {
        // アニメーションのためにまずクラスだけ外す
        searchResults.classList.remove('active');
        document.body.classList.remove('search-open');
        
        // トランジション完了後に非表示にする
        setTimeout(() => {
            if (!searchResults.classList.contains('active')) {
                searchResults.style.display = 'none';
            }
        }, 300); // CSSのトランジション時間に合わせる
    }
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
        
        const searchResults = document.getElementById('search-results');
        // 検索結果が表示されている場合のみ処理
        if (!searchResults || !searchResults.classList.contains('active')) return;
        
        // サイト内検索フィールドがクリックされた場合は閉じない
        const siteSearchInput = document.getElementById('site-search-input');
        const mobileSiteSearchInput = document.getElementById('mobile-site-search-input');
        
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
    // Enterキー押下時もしくは入力値が変わった時
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
            <button type="button" id="search-clear-button" class="search-clear-button" aria-label="検索をクリア">×</button>
        </div>
        <button id="search-view-toggle" class="search-view-toggle">結果を拡大</button>
    `;
    
    // 閉じるボタン追加
    const closeButton = document.createElement('button');
    closeButton.id = 'search-close-button';
    closeButton.className = 'search-close-button';
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
        clearButton.addEventListener('click', function() {
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
        searchCloseButton.addEventListener('click', closeSearchResults);
    }
    
    // 表示モード切り替えボタンのイベントリスナー
    const viewToggleButton = document.getElementById('search-view-toggle');
    if (viewToggleButton) {
        viewToggleButton.addEventListener('click', toggleSearchResultsView);
    }
    
    console.log('検索ダイアログを作成しました');
}

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

/**
 * ツール検索にもクリアボタンを適用
 */
function setupToolSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    addClearButtonToSearch('search-input');
    
    // リアルタイム検索の設定
    const debouncedFilterTools = debounce(filterTools, 300);
    searchInput.addEventListener('input', function() {
        debouncedFilterTools(this.value);
    });
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
        // モバイルメニューからの検索クリック時に特別な処理
        mobileSiteSearchInput.addEventListener('click', function(e) {
            // まずモバイルメニューを閉じる
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
            }
            
            // 少し遅延させて検索ダイアログを表示
            setTimeout(() => {
                handleSearchFieldClick(e);
            }, 100);
        });
    }
    
    // 画面サイズ変更時の処理
    window.addEventListener('resize', debounce(function() {
        // 小さい画面サイズでダイアログが表示されている場合の対応
        const searchResults = document.getElementById('search-results');
        if (window.innerWidth <= 768 && searchResults && searchResults.classList.contains('active')) {
            // モバイル表示では必ず中央に表示
            searchResults.style.position = 'fixed';
            searchResults.style.top = '50%';
            searchResults.style.left = '50%';
            searchResults.style.transform = 'translate(-50%, -50%)';
        }
    }, 200));
}

/**
 * VCC/ALCOMタブの修正
 */
function fixTabSwitching() {
    // タブクリックのイベントハンドラを再設定
    document.querySelectorAll('.tab').forEach(tab => {
        // 既存のクリックイベントを削除
        const clone = tab.cloneNode(true);
        tab.parentNode.replaceChild(clone, tab);
        
        // 新しいイベントを設定
        clone.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            if (!tabId) return;
            
            // 同じグループ内のタブを非アクティブ化
            const tabGroup = this.closest('.tabs');
            if (tabGroup) {
                tabGroup.querySelectorAll('.tab').forEach(t => {
                    t.classList.remove('active');
                });
                
                // 全てのタブコンテンツを非表示
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.style.display = 'none';
                });
            }
            
            // クリックされたタブをアクティブ化
            this.classList.add('active');
            
            // 対応するコンテンツを表示
            const tabContent = document.getElementById(tabId + '-tab');
            if (tabContent) {
                tabContent.style.display = 'block';
            }
            
            // URLハッシュを更新（オプション）
            if (tabId) {
                history.replaceState(null, null, '#' + tabId);
            }
        });
    });
}

// ページ読み込み時の初期化処理
document.addEventListener('DOMContentLoaded', function() {
    // リアルタイム検索のためのデバウンス関数を設定
    window.debouncedSearch = debounce(performSiteSearch, 300);
    
    // 右上の検索入力欄はクリックで検索ダイアログを開く
    const siteSearchInput = document.getElementById('site-search-input');
    if (siteSearchInput) {
        siteSearchInput.addEventListener('click', handleSearchFieldClick);
        siteSearchInput.addEventListener('focus', handleSearchFieldClick);
        siteSearchInput.readOnly = true; // 入力を無効化
        siteSearchInput.placeholder = 'サイト内検索...';
    }
    
    const mobileSiteSearchInput = document.getElementById('mobile-site-search-input');
    if (mobileSiteSearchInput) {
        mobileSiteSearchInput.addEventListener('click', handleSearchFieldClick);
        mobileSiteSearchInput.addEventListener('focus', handleSearchFieldClick);
        mobileSiteSearchInput.readOnly = true; // 入力を無効化
        mobileSiteSearchInput.placeholder = 'サイト内検索...';
    }
    
    // クリアボタンの追加
    addClearButtonToSearch('site-search-input');
    addClearButtonToSearch('mobile-site-search-input');
    
    // ツール検索にもクリアボタンを追加
    setupToolSearch();
    
    // モバイル検索の特別な処理
    setupMobileSearch();
    
    // タブ切り替え機能の修正
    fixTabSwitching();
    
    // 検索ダイアログは初期化時点では作成しない（クリック時に作成）
    
    // 外側クリックで閉じる機能のセットアップ
    setupOutsideClickHandler();
    
    // オーバーレイ要素の追加
    const overlay = document.createElement('div');
    overlay.id = 'search-overlay';
    overlay.className = 'search-overlay';
    overlay.addEventListener('click', closeSearchResults); // オーバーレイクリックでも閉じる
    document.body.appendChild(overlay);
    
    // ページ読み込み完了後、少し遅延させて検索インデックスを生成
    setTimeout(() => {
        generateSearchIndex();
    }, 500);
});
