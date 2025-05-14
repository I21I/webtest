function generateSearchIndex() {
    const searchIndex = [];

    try {
        forceActivateAllTabs();
        
        document.querySelectorAll('.tool-card').forEach(function(card) {
            const title = card.querySelector('.tool-name')?.textContent?.trim() || '';
            const version = card.querySelector('.tool-version')?.textContent?.trim() || '';
            const description = card.querySelector('.tool-description')?.textContent?.trim() || '';
            const tags = card.getAttribute('data-tags')?.split(',') || [];
            
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
        
        document.querySelectorAll('.tab-content').forEach(function(tabContent) {
            const tabId = tabContent.id || '';
            if (!tabId) return;
            
            const tabName = tabId.replace('-tab', '').toUpperCase();
            
            const fullText = tabContent.textContent?.trim() || '';
            
            const steps = [];
            tabContent.querySelectorAll('li').forEach(function(step) {
                const stepText = step.textContent?.trim() || '';
                if (stepText) steps.push(stepText);
            });
            
            const codeBlock = tabContent.querySelector('pre')?.textContent?.trim() || '';
            
            searchIndex.push({
                title: tabName + " インストール方法",
                url: "#install-section",
                content: steps.join(' ') + ' ' + codeBlock,
                fullContent: fullText,
                path: "インストール方法",
                tabId: tabId
            });
        });
        
        const installNote = document.querySelector('#install-section .install-note')?.textContent?.trim() || '';
        if (installNote) {
            searchIndex.push({
                title: "インストール方法の注意事項",
                url: "#install-section",
                content: installNote,
                path: "インストール方法"
            });
        }
        
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
        
        searchIndex.push({
            title: "二十一世紀症候群 VRChatツール",
            url: "#",
            content: document.querySelector('h1')?.textContent + ' - ' + document.querySelector('.subtitle')?.textContent,
            tags: ["VRChat", "ツール", "アバター改変", "最適化"],
            path: "ホーム"
        });
        
        window.searchIndex = searchIndex;
        
        return searchIndex;
    } catch (error) {
    } finally {
        resetTabsState();
    }
}

function forceActivateAllTabs() {
    window._originalActiveTabs = [];
    document.querySelectorAll('.tab.active').forEach(tab => {
        window._originalActiveTabs.push(tab);
    });
    
    document.querySelectorAll('.tab').forEach(tab => {
        const tabId = tab.getAttribute('data-tab');
        if (tabId) {
            const tabContent = document.getElementById(tabId + '-tab');
            if (tabContent) {
                tabContent.style.display = 'block';
            }
        }
    });
}

function resetTabsState() {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });
    
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
        
        delete window._originalActiveTabs;
    }
}

// グローバル状態管理 - 重要
window.searchState = {
    isDialogOpen: false,
    currentQuery: '', // 現在の検索クエリを明示的に保持
    debounceTimeout: null // debounceタイマーを管理
};

window.addEventListener('popstate', function(event) {
    const searchResults = document.getElementById('search-results');
    if (searchResults && searchResults.classList.contains('active')) {
        closeSearchResults();
    }
});

/**
 * 検索フィールドクリック処理
 */
function handleSearchFieldClick(e) {
    if (e && e.preventDefault) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    if (window.searchState.isDialogOpen) {
        return;
    }
    
    // メニューが開いていれば閉じる
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
    }
    
    // 検索ダイアログを作成して開く
    createAndOpenSearchDialog();
}

/**
 * 検索ダイアログを作成して開く (一度に実行)
 */
function createAndOpenSearchDialog() {
    // 既存のダイアログ削除
    removeExistingSearchDialog();
    
    // ダイアログ作成
    const searchDialog = document.createElement('div');
    searchDialog.id = 'search-results';
    searchDialog.style.display = 'flex'; // 初めから表示
    searchDialog.style.opacity = '0'; // 初めは透明
    
    const searchHeader = document.createElement('div');
    searchHeader.className = 'search-results-header';
    
    const searchField = document.createElement('div');
    searchField.className = 'search-field';
    searchField.innerHTML = `
        <div class="search-input-container">
            <input type="text" id="search-query-display" class="search-query-input" placeholder="サイト内を検索...">
            <span class="search-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm-8 6a8 8 0 1 1 14.32 4.906l5.387 5.387a1 1 0 0 1-1.414 1.414l-5.387-5.387A8 8 0 0 1 2 10z"></path>
                </svg>
            </span>
            <button type="button" id="search-clear-button" class="search-clear-button" aria-label="検索をクリア">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
            </button>
        </div>
    `;
    
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
    
    const searchContent = document.createElement('div');
    searchContent.id = 'search-results-content';
    searchContent.className = 'search-results-content';
    searchContent.innerHTML = '<div class="search-no-results">キーワードを入力して検索してください</div>';
    searchDialog.appendChild(searchContent);
    
    document.body.appendChild(searchDialog);
    
    // 検索オーバーレイを追加
    const overlay = document.createElement('div');
    overlay.id = 'search-overlay';
    overlay.className = 'search-overlay';
    overlay.style.display = 'block';
    overlay.style.opacity = '0';
    document.body.appendChild(overlay);
    
    // オーバーレイクリックで閉じる処理
    overlay.addEventListener('click', closeSearchResults);
    
    // アニメーション用タイマー
    setTimeout(() => {
        // マウント完了後に表示
        searchDialog.classList.add('active');
        searchDialog.style.opacity = '1';
        overlay.style.opacity = '1';
        document.body.classList.add('search-open');
        
        // スマホ表示の場合のスタイル調整
        if (window.innerWidth <= 768) {
            searchDialog.classList.add('mobile-view');
        }
        
        window.searchState.isDialogOpen = true;
        
        // 入力欄にフォーカス
        const searchQueryDisplay = document.getElementById('search-query-display');
        if (searchQueryDisplay) {
            searchQueryDisplay.focus();
            
            // 重要: input欄の直接操作を一元管理する
            initializeSearchInput(searchQueryDisplay);
        }
        
        // クリアボタンの設定
        const clearButton = document.getElementById('search-clear-button');
        if (clearButton) {
            clearButton.addEventListener('click', handleClearButtonClick);
        }
        
        // 閉じるボタンの設定
        const closeButton = document.getElementById('search-close-button');
        if (closeButton) {
            closeButton.addEventListener('click', closeSearchResults);
        }
    }, 10);
}

/**
 * 既存の検索ダイアログを削除
 */
function removeExistingSearchDialog() {
    const existingResults = document.getElementById('search-results');
    if (existingResults) {
        existingResults.parentNode.removeChild(existingResults);
    }
    
    const existingOverlay = document.getElementById('search-overlay');
    if (existingOverlay) {
        existingOverlay.parentNode.removeChild(existingOverlay);
    }
}

/**
 * 検索入力欄の初期化 - 最小限の変更
 */
function initializeSearchInput(inputElement) {
    // カスタムキーダウン処理
    inputElement.addEventListener('keydown', function(e) {
        // 最後の1文字でバックスペースの場合のみ処理
        if (e.key === 'Backspace' && this.value.length === 1) {
            // デフォルトのイベント処理を停止
            e.preventDefault();
            
            // 値を即座に空にする
            this.value = '';
            window.searchState.currentQuery = '';
            
            // クリアボタンを更新
            const clearButton = document.getElementById('search-clear-button');
            if (clearButton) {
                clearButton.classList.remove('visible');
            }
            
            // 検索結果をクリア
            const searchResultsContent = document.getElementById('search-results-content');
            if (searchResultsContent) {
                searchResultsContent.innerHTML = '<div class="search-no-results">キーワードを入力して検索してください</div>';
            }
        }
        
        // Enterキーの処理
        if (e.key === 'Enter') {
            const query = this.value.trim();
            if (query) {
                performSiteSearch(query);
            }
        }
    });
    
    // 入力イベント処理
    inputElement.addEventListener('input', function() {
        const value = this.value;
        window.searchState.currentQuery = value;
        
        // クリアボタンの表示/非表示
        const clearButton = document.getElementById('search-clear-button');
        if (clearButton) {
            clearButton.classList.toggle('visible', value.length > 0);
        }
        
        // 値が空なら検索結果をクリア
        if (value === '') {
            const searchResultsContent = document.getElementById('search-results-content');
            if (searchResultsContent) {
                searchResultsContent.innerHTML = '<div class="search-no-results">キーワードを入力して検索してください</div>';
            }
            return;
        }
        
        // 検索実行
        if (window.searchState.debounceTimeout) {
            clearTimeout(window.searchState.debounceTimeout);
        }
        
        window.searchState.debounceTimeout = setTimeout(function() {
            performSiteSearch(value.trim());
        }, 300);
    });
}

/**
 * クリアボタン表示/非表示の更新
 */
function updateClearButtonVisibility(value) {
    const clearButton = document.getElementById('search-clear-button');
    if (clearButton) {
        clearButton.classList.toggle('visible', value.length > 0);
    }
}

/**
 * クリアボタンのイベントハンドラ
 */
function handleClearButtonClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const searchQueryDisplay = document.getElementById('search-query-display');
    if (!searchQueryDisplay) return;
    
    // 値をクリア
    searchQueryDisplay.value = '';
    window.searchState.currentQuery = '';
    
    // クリアボタンを非表示
    this.classList.remove('visible');
    
    // 検索結果をクリア
    clearSearchResults();
    
    // フォーカスを戻す
    searchQueryDisplay.focus();
}

/**
 * 検索結果表示の初期状態に戻す
 */
function clearSearchResults() {
    const searchResultsContent = document.getElementById('search-results-content');
    if (searchResultsContent) {
        searchResultsContent.innerHTML = '<div class="search-no-results">キーワードを入力して検索してください</div>';
    }
}

/**
 * 検索結果ダイアログを閉じる
 */
function closeSearchResults() {
    if (!window.searchState.isDialogOpen) return;
    
    const searchResults = document.getElementById('search-results');
    const searchOverlay = document.getElementById('search-overlay');
    
    if (searchResults) {
        searchResults.classList.remove('active');
        searchResults.style.opacity = '0';
    }
    
    if (searchOverlay) {
        searchOverlay.style.opacity = '0';
    }
    
    document.body.classList.remove('search-open');
    
    // debounceタイマーをクリア
    if (window.searchState.debounceTimeout) {
        clearTimeout(window.searchState.debounceTimeout);
        window.searchState.debounceTimeout = null;
    }
    
    // 状態をリセット
    window.searchState.isDialogOpen = false;
    window.searchState.currentQuery = '';
    
    // 遅延してDOM要素を削除
    setTimeout(() => {
        removeExistingSearchDialog();
    }, 300);
}

/**
 * debounce処理された検索実行
 */
function debouncedSearch(query) {
    // 既存のタイマーをクリア
    if (window.searchState.debounceTimeout) {
        clearTimeout(window.searchState.debounceTimeout);
    }
    
    // 新しいタイマーを設定
    window.searchState.debounceTimeout = setTimeout(() => {
        performSiteSearch(query);
        window.searchState.debounceTimeout = null;
    }, 300);
}

/**
 * 実際の検索処理を実行
 */
function performSiteSearch(query) {
    if (!query || query.trim() === '') return;
    
    const searchResultsContent = document.getElementById('search-results-content');
    if (!searchResultsContent) return;
    
    if (!window.searchIndex) {
        window.searchIndex = generateSearchIndex();
    }
    
    // 入力欄の値を設定（内部状態も同期）
    const searchQueryDisplay = document.getElementById('search-query-display');
    if (searchQueryDisplay) {
        searchQueryDisplay.value = query;
        window.searchState.currentQuery = query;
        
        // クリアボタンの状態更新
        updateClearButtonVisibility(query);
    }
    
    const queryLower = query.toLowerCase();
    
    const results = window.searchIndex.filter(item => {
        return (
            (item.title && item.title.toLowerCase().includes(queryLower)) || 
            (item.content && item.content.toLowerCase().includes(queryLower)) || 
            (item.tags && item.tags.some(tag => 
                typeof tag === 'string' && tag.toLowerCase().includes(queryLower)
            )) ||
            (item.fullContent && item.fullContent.toLowerCase().includes(queryLower)) ||
            (item.features && item.features.toLowerCase().includes(queryLower)) ||
            (item.links && item.links.toLowerCase().includes(queryLower))
        );
    });
    
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
        
        Object.keys(groupedResults).forEach(path => {
            html += `<div class="search-section"><h3 class="search-section-title">${path}</h3>`;
            html += '<ul class="search-result-list">';
            
            groupedResults[path].forEach(result => {
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
                
                const tabIdAttr = result.tabId ? ` data-tab-id="${result.tabId}"` : '';
                
                html += `
                    <li class="search-result-item" data-url="${result.url}"${tabIdAttr}>
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
        
        // 結果アイテムのクリックイベント設定
        document.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', function(e) {
                if (window.getSelection().toString()) return;
                
                const url = this.getAttribute('data-url');
                if (url) {
                    e.preventDefault();
                    handleResultClick(url, this);
                }
            });
        });
    } else {
        searchResultsContent.innerHTML = '<div class="search-no-results">検索条件に一致する結果が見つかりませんでした。別のキーワードをお試しください。</div>';
    }
}

function handleResultClick(url, resultItem) {
    const tabId = resultItem ? resultItem.getAttribute('data-tab-id') : null;
    
    if (tabId && url === '#install-section') {
        const tabName = tabId.replace('-tab', '');
        
        closeSearchResults();
        
        setTimeout(() => {
            window.location.href = url;
            
            setTimeout(() => {
                activateTabByName(tabName);
            }, 100);
        }, 100);
    } else {
        closeSearchResults();
        window.location.href = url;
    }
}

function activateTabByName(tabName) {
    if (!tabName) return false;
    
    const tab = document.querySelector(`.tab[data-tab="${tabName}"]`);
    if (tab) {
        tab.click();
        return true;
    }
    return false;
}

function handleUrlTabParam() {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    
    if (window.location.hash === '#install-section' && tabParam) {
        activateTabByName(tabParam);
    }
}

/**
 * 外部クリック検出
 */
function setupOutsideClickHandler() {
    document.addEventListener('click', function(e) {
        if (!window.searchState.isDialogOpen) return;
        
        const searchResults = document.getElementById('search-results');
        if (!searchResults) return;
        
        const siteSearchInput = document.getElementById('site-search-input');
        const mobileSiteSearchInput = document.getElementById('mobile-site-search-input');
        
        // 検索入力欄自体のクリックは無視
        if (siteSearchInput && (siteSearchInput === e.target || siteSearchInput.contains(e.target))) {
            return;
        }
        
        if (mobileSiteSearchInput && (mobileSiteSearchInput === e.target || mobileSiteSearchInput.contains(e.target))) {
            return;
        }
        
        // 検索結果外部のクリックで閉じる
        if (!searchResults.contains(e.target) && e.target.id !== 'search-overlay') {
            closeSearchResults();
        }
    });
}

/**
 * ツール検索機能の初期化
 */
function setupToolSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    const searchContainer = searchInput.closest('.search-container');
    if (!searchContainer) return;
    
    searchContainer.style.position = 'relative';
    
    // アイコン追加
    const existingIcon = searchContainer.querySelector('.search-icon');
    if (!existingIcon) {
        const iconElement = document.createElement('span');
        iconElement.className = 'search-icon';
        iconElement.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm-8 6a8 8 0 1 1 14.32 4.906l5.387 5.387a1 1 0 0 1-1.414 1.414l-5.387-5.387A8 8 0 0 1 2 10z"></path>
            </svg>
        `;
        searchContainer.appendChild(iconElement);
    }
    
    // クリアボタン追加
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
            e.preventDefault();
            e.stopPropagation();
            
            // 入力欄をクリア
            searchInput.value = '';
            
            // クリアボタンを非表示
            this.classList.remove('visible');
            
            // ツールフィルタをリセット
            filterTools('');
            
            // フォーカスを戻す
            searchInput.focus();
        });
    }
    
    // バックスペースキーの特別処理
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' && this.value.length === 1) {
            e.preventDefault();
            
            // 値をクリア
            this.value = '';
            
            // クリアボタンを非表示
            const clearButton = searchContainer.querySelector('.search-clear-button');
            if (clearButton) {
                clearButton.classList.remove('visible');
            }
            
            // フィルタをリセット
            filterTools('');
            
            return false;
        }
    });
    
    // 通常の入力処理
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        
        // クリアボタンの表示/非表示
        const clearButton = searchContainer.querySelector('.search-clear-button');
        if (clearButton) {
            clearButton.classList.toggle('visible', query.length > 0);
        }
        
        // debounce設定
        if (!window.debouncedFilterTools) {
            window.debouncedFilterTools = function(query) {
                clearTimeout(window._filterToolsTimeout);
                window._filterToolsTimeout = setTimeout(() => {
                    filterTools(query);
                }, 300);
            };
        }
        
        // 検索実行
        window.debouncedFilterTools(query);
    });
}

/**
 * ツールカードのフィルタリング
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
    
    // 検索情報の表示
    const searchResults = document.getElementById('search-results-info');
    if (searchResults) {
        searchResults.innerHTML = query.trim() === '' ? '' : `検索結果: ${visibleCount}件のツールが見つかりました`;
    }
    
    // 検索結果なしメッセージの表示/非表示
    const noResultsMessage = document.getElementById('no-results-message');
    if (noResultsMessage) {
        noResultsMessage.classList.toggle('hidden', query.trim() === '' || visibleCount > 0);
    }
}

/**
 * モバイル検索機能のセットアップ
 */
function setupMobileSearch() {
    const mobileSiteSearchInput = document.getElementById('mobile-site-search-input');
    if (mobileSiteSearchInput) {
        const mobileSearchContainer = mobileSiteSearchInput.parentElement;
        if (mobileSearchContainer) {
            mobileSearchContainer.style.position = 'relative';
            
            // アイコン追加
            const existingIcon = mobileSearchContainer.querySelector('.mobile-search-icon') || 
                              mobileSearchContainer.querySelector('.search-icon');
            
            if (!existingIcon) {
                const iconElement = document.createElement('span');
                iconElement.className = 'search-icon';
                iconElement.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm-8 6a8 8 0 1 1 14.32 4.906l5.387 5.387a1 1 0 0 1-1.414 1.414l-5.387-5.387A8 8 0 0 1 2 10z"></path>
                    </svg>
                `;
                mobileSearchContainer.appendChild(iconElement);
            }
            
            // クリアボタン追加
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
        
        // イベント設定
        const newInput = document.createElement('input');
        newInput.type = 'text';
        newInput.className = mobileSiteSearchInput.className;
        newInput.id = mobileSiteSearchInput.id;
        newInput.placeholder = mobileSiteSearchInput.placeholder;
        newInput.readOnly = true;
        
        mobileSiteSearchInput.parentNode.replaceChild(newInput, mobileSiteSearchInput);
        
        newInput.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
            }
            
            handleSearchFieldClick(e);
        });
    }
    
    // モバイル検索トグル
    const mobileSearchToggle = document.getElementById('mobile-search-toggle');
    if (mobileSearchToggle) {
        const newToggle = document.createElement('button');
        newToggle.className = mobileSearchToggle.className;
        newToggle.id = mobileSearchToggle.id;
        newToggle.setAttribute('aria-label', mobileSearchToggle.getAttribute('aria-label'));
        newToggle.innerHTML = mobileSearchToggle.innerHTML;
        
        mobileSearchToggle.parentNode.replaceChild(newToggle, mobileSearchToggle);
        
        newToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
            }
            
            handleSearchFieldClick(e);
        });
    }
    
    // リサイズイベント
    window.addEventListener('resize', function() {
        const searchResults = document.getElementById('search-results');
        if (!searchResults) return;
        
        if (window.innerWidth <= 768) {
            searchResults.classList.add('mobile-view');
        } else {
            searchResults.classList.remove('mobile-view');
        }
    });
}

/**
 * タブ切り替え機能の初期化
 */
function fixTabSwitching() {
    document.querySelectorAll('.tabs .tab').forEach(tab => {
        const clone = tab.cloneNode(true);
        tab.parentNode.replaceChild(clone, tab);
        
        clone.addEventListener('click', function(e) {
            e.preventDefault();
            
            const tabId = this.getAttribute('data-tab');
            if (!tabId) return;
            
            const tabGroup = this.closest('.tabs');
            if (tabGroup) {
                tabGroup.querySelectorAll('.tab').forEach(t => {
                    t.classList.remove('active');
                });
                
                const tabContents = document.querySelectorAll('.tab-content');
                tabContents.forEach(content => {
                    content.style.display = 'none';
                });
            }
            
            this.classList.add('active');
            
            const targetContent = document.getElementById(tabId + '-tab');
            if (targetContent) {
                targetContent.style.display = 'block';
            }
        });
    });
}

/**
 * 初期タブの設定
 */
function setupInitialTabs() {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    
    if (window.location.hash === '#install-section' && tabParam) {
        const tabActivated = activateTabByName(tabParam);
        
        if (tabActivated) {
            return;
        }
    }
    
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
        const tabId = hash.substring(1);
        
        const tab = document.querySelector(`.tab[data-tab="${tabId}"]`);
        if (tab) {
            tab.click();
            return;
        }
    }
    
    document.querySelectorAll('.tabs').forEach(tabGroup => {
        const firstTab = tabGroup.querySelector('.tab');
        if (firstTab) {
            firstTab.click();
        }
    });
}

/**
 * ハッシュ変更イベントの設定
 */
function setupHashChangeHandler() {
    window.addEventListener('hashchange', function() {
        if (window.location.hash === '#install-section') {
            const urlParams = new URLSearchParams(window.location.search);
            const tabParam = urlParams.get('tab');
            
            if (tabParam) {
                setTimeout(() => {
                    activateTabByName(tabParam);
                }, 100);
            }
        }
    });
}

/**
 * サイト内検索機能の初期化
 */
function setupSiteSearch() {
    const siteSearchInput = document.getElementById('site-search-input');
    if (siteSearchInput) {
        const searchWrapper = siteSearchInput.closest('.site-search');
        if (searchWrapper) {
            searchWrapper.style.position = 'relative';
            
            // 検索アイコン
            const existingIcon = searchWrapper.querySelector('.site-search-icon') || 
                               searchWrapper.querySelector('.search-icon');
            
            if (!existingIcon) {
                const iconElement = document.createElement('span');
                iconElement.className = 'search-icon';
                iconElement.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm-8 6a8 8 0 1 1 14.32 4.906l5.387 5.387a1 1 0 0 1-1.414 1.414l-5.387-5.387A8 8 0 0 1 2 10z"></path>
                    </svg>
                `;
                searchWrapper.appendChild(iconElement);
            }
            
            // クリアボタン
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
        
        // 入力欄の作り直し
        const newInput = document.createElement('input');
        newInput.type = 'text';
        newInput.className = siteSearchInput.className;
        newInput.id = siteSearchInput.id;
        newInput.placeholder = '検索...';
        newInput.readOnly = true;
        
        siteSearchInput.parentNode.replaceChild(newInput, siteSearchInput);
        
        // イベント設定
        newInput.addEventListener('click', handleSearchFieldClick);
        newInput.addEventListener('focus', handleSearchFieldClick);
    }
}

/**
 * ドキュメント読み込み完了時の処理
 */
document.addEventListener('DOMContentLoaded', function() {
    // 各種機能の初期化
    setupSiteSearch();
    setupOutsideClickHandler();
    setupMobileSearch();
    setupToolSearch();
    fixTabSwitching();
    setupHashChangeHandler();
    setupInitialTabs();
    handleUrlTabParam();
    
    // ESCキーで検索ダイアログを閉じる
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && window.searchState.isDialogOpen) {
            closeSearchResults();
        }
    });
    
    // 検索インデックスの生成は遅延して実行
    setTimeout(() => {
        generateSearchIndex();
    }, 500);
});
