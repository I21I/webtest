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

window.addEventListener('popstate', function(event) {
    const searchResults = document.getElementById('search-results');
    if (searchResults && searchResults.classList.contains('active')) {
        closeSearchResults();
    }
});

window.isSearchDialogOpen = false;

/**
 * 検索フィールドクリック処理
 */
function handleSearchFieldClick(e) {
    if (e && e.preventDefault) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    if (window.isSearchDialogOpen) {
        return;
    }
    
    // メニューが開いていれば閉じる
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
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

/**
 * 検索ダイアログを作成する関数
 */
function createSearchDialog() {
    // 既存の検索ダイアログを削除
    const existingResults = document.getElementById('search-results');
    if (existingResults) {
        existingResults.parentNode.removeChild(existingResults);
    }
    
    // 既存のオーバーレイを削除
    const existingOverlay = document.getElementById('search-overlay');
    if (existingOverlay) {
        existingOverlay.parentNode.removeChild(existingOverlay);
    }
    
    // 新しい検索ダイアログを作成
    const searchDialog = document.createElement('div');
    searchDialog.id = 'search-results';
    searchDialog.style.display = 'none';
    
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
    document.body.appendChild(overlay);
    
    // オーバーレイクリックで閉じる処理
    overlay.addEventListener('click', function() {
        closeSearchResults();
    });
    
    // 検索入力欄の要素を取得
    const searchQueryDisplay = document.getElementById('search-query-display');
    const clearButton = document.getElementById('search-clear-button');
    const searchCloseButton = document.getElementById('search-close-button');
    
    // debounce関数がまだ定義されていない場合は定義
    if (!window.debouncedSearch) {
        window.debouncedSearch = debounce(performSiteSearch, 300);
    }
    
    // 入力欄のイベント設定 - 単純化
    if (searchQueryDisplay) {
        // 初期値を空に設定
        searchQueryDisplay.value = '';
        
        // カスタム入力イベント処理
        searchQueryDisplay.addEventListener('input', function() {
            // 現在の入力値を取得
            const query = this.value;
            
            // クリアボタンの表示/非表示を設定
            if (clearButton) {
                clearButton.classList.toggle('visible', query.length > 0);
            }
            
            // 入力値が空の場合のプレースホルダー表示
            if (query === '') {
                searchContent.innerHTML = '<div class="search-no-results">キーワードを入力して検索してください</div>';
                return;
            }
            
            // 検索を実行
            if (query.trim()) {
                window.debouncedSearch(query.trim());
            }
        });
        
        // Enterキーの処理
        searchQueryDisplay.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query) {
                    performSiteSearch(query);
                }
            }
        });
    }
    
    // クリアボタンのイベント処理
    if (clearButton) {
        clearButton.addEventListener('click', function() {
            // 一度イベントの伝播を停止
            event.stopPropagation();
            
            if (searchQueryDisplay) {
                // 直接値をクリア（新しい方法）
                searchQueryDisplay.value = '';
                clearButton.classList.remove('visible');
                searchContent.innerHTML = '<div class="search-no-results">キーワードを入力して検索してください</div>';
                
                // inputイベントを手動で発火させない
                
                // フォーカスを戻す
                searchQueryDisplay.focus();
            }
        });
    }
    
    // 閉じるボタンのイベント
    if (searchCloseButton) {
        searchCloseButton.addEventListener('click', function() {
            closeSearchResults();
        });
    }
    
    // バックスペースキー用の特別処理
    if (searchQueryDisplay) {
        searchQueryDisplay.addEventListener('keydown', function(e) {
            // バックスペースキーが押され、入力が1文字だけの場合
            if (e.key === 'Backspace' && this.value.length === 1) {
                // デフォルトのバックスペース動作をキャンセル
                e.preventDefault();
                
                // 表示中の値を完全に削除
                this.value = '';
                
                // クリアボタンの状態更新
                if (clearButton) {
                    clearButton.classList.remove('visible');
                }
                
                // 検索結果をクリア
                searchContent.innerHTML = '<div class="search-no-results">キーワードを入力して検索してください</div>';
                
                // 追加のinputイベントを発火させない
                return false;
            }
        });
    }
}

/**
 * 検索ダイアログを開く関数
 */
function openSearchDialog() {
    if (window.isSearchDialogOpen) {
        return;
    }
    
    const searchResults = document.getElementById('search-results');
    if (!searchResults) return;
    
    const searchOverlay = document.getElementById('search-overlay');
    if (searchOverlay) {
        searchOverlay.style.display = 'block';
        
        // レイアウト計算の強制
        window.getComputedStyle(searchOverlay).getPropertyValue('opacity');
        
        document.body.classList.add('search-open');
    }
    
    searchResults.style.display = 'flex';
    
    // レイアウト計算の強制
    window.getComputedStyle(searchResults).getPropertyValue('opacity');
    
    searchResults.classList.add('active');
    window.isSearchDialogOpen = true;
    
    // スマホ表示の場合のスタイル調整
    if (window.innerWidth <= 768) {
        searchResults.classList.add('mobile-view');
    } else {
        searchResults.classList.remove('mobile-view');
    }
}

function performSiteSearch(query) {
    const searchResultsContent = document.getElementById('search-results-content');
    const searchQueryDisplay = document.getElementById('search-query-display');
    
    if (!searchResultsContent) {
        return;
    }
    
    if (!window.searchIndex) {
        window.searchIndex = generateSearchIndex();
    }
    
    if (searchQueryDisplay) {
        // 値をセット（通常のinputイベントを発火しないように注意）
        searchQueryDisplay.value = query;
        
        // クリアボタンの状態更新
        const clearButton = document.getElementById('search-clear-button');
        if (clearButton) {
            clearButton.classList.toggle('visible', query.length > 0);
        }
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
 * 検索ダイアログを閉じる関数
 */
function closeSearchResults() {
    if (!window.isSearchDialogOpen) {
        return;
    }
    
    const searchResults = document.getElementById('search-results');
    const searchOverlay = document.getElementById('search-overlay');
    
    if (!searchResults) return;
    
    searchResults.classList.remove('active');
    document.body.classList.remove('search-open');
    
    if (searchOverlay) {
        searchOverlay.style.opacity = '0';
    }
    
    setTimeout(() => {
        if (!searchResults.classList.contains('active')) {
            searchResults.style.display = 'none';
            
            if (searchOverlay) {
                searchOverlay.style.display = 'none';
            }
            
            window.isSearchDialogOpen = false;
        }
    }, 300);
}

function setupOutsideClickHandler() {
    document.addEventListener('click', function(e) {
        if (!window.isSearchDialogOpen) {
            return;
        }
        
        const searchResults = document.getElementById('search-results');
        if (!searchResults) return;
        
        const siteSearchInput = document.getElementById('site-search-input');
        const mobileSiteSearchInput = document.getElementById('mobile-site-search-input');
        
        if (siteSearchInput && (siteSearchInput === e.target || siteSearchInput.contains(e.target))) {
            return;
        }
        
        if (mobileSiteSearchInput && (mobileSiteSearchInput === e.target || mobileSiteSearchInput.contains(e.target))) {
            return;
        }
        
        if (!searchResults.contains(e.target) && e.target.id !== 'search-overlay') {
            closeSearchResults();
        }
    });
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

function setupToolSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    const searchContainer = searchInput.closest('.search-container');
    if (!searchContainer) return;
    
    searchContainer.style.position = 'relative';
    
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
        
        clearButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // 直接値をクリア
            searchInput.value = '';
            
            // クリアボタンを非表示
            this.classList.remove('visible');
            
            // ツールのフィルタリングをリセット
            filterTools('');
            
            // フォーカスを戻す
            searchInput.focus();
        });
    }
    
    // バックスペースキーの特別処理
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' && this.value.length === 1) {
            e.preventDefault();
            this.value = '';
            
            const clearButton = searchContainer.querySelector('.search-clear-button');
            if (clearButton) {
                clearButton.classList.remove('visible');
            }
            
            filterTools('');
            return false;
        }
    });
    
    // ツール検索の入力イベント
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        
        const clearButton = searchContainer.querySelector('.search-clear-button');
        if (clearButton) {
            clearButton.classList.toggle('visible', query.length > 0);
        }
        
        if (!window.debouncedFilterTools) {
            window.debouncedFilterTools = debounce(filterTools, 300);
        }
        
        window.debouncedFilterTools(query);
    });
}

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
    
    const searchResults = document.getElementById('search-results-info');
    if (searchResults) {
        if (query.trim() === '') {
            searchResults.innerHTML = '';
        } else {
            searchResults.innerHTML = `検索結果: ${visibleCount}件のツールが見つかりました`;
        }
    }
    
    const noResultsMessage = document.getElementById('no-results-message');
    if (noResultsMessage) {
        if (query.trim() === '' || visibleCount > 0) {
            noResultsMessage.classList.add('hidden');
        } else {
            noResultsMessage.classList.remove('hidden');
        }
    }
}

function setupMobileSearch() {
    const mobileSiteSearchInput = document.getElementById('mobile-site-search-input');
    if (mobileSiteSearchInput) {
        const mobileSearchContainer = mobileSiteSearchInput.parentElement;
        if (mobileSearchContainer) {
            mobileSearchContainer.style.position = 'relative';
            
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
        
        // 既存の要素のクローンを作成し、イベントをクリア
        const clonedInput = mobileSiteSearchInput.cloneNode(true);
        mobileSiteSearchInput.parentNode.replaceChild(clonedInput, mobileSiteSearchInput);
        
        // 新しいイベントハンドラを設定
        clonedInput.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
            }
            
            setTimeout(() => {
                handleSearchFieldClick(e);
            }, 50);
        });
    }
    
    // モバイル検索トグルボタンの処理
    const mobileSearchToggle = document.getElementById('mobile-search-toggle');
    if (mobileSearchToggle) {
        // 既存のイベントをクリア
        const clonedToggle = mobileSearchToggle.cloneNode(true);
        mobileSearchToggle.parentNode.replaceChild(clonedToggle, mobileSearchToggle);
        
        // 新しいイベントハンドラを設定
        clonedToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
            }
            
            setTimeout(() => {
                handleSearchFieldClick(e);
            }, 50);
        });
    }
    
    window.addEventListener('resize', debounce(handleWindowResize, 200));
    
    handleWindowResize();
}

function handleWindowResize() {
    const searchResults = document.getElementById('search-results');
    if (!searchResults) return;
    
    if (window.innerWidth <= 768) {
        searchResults.classList.add('mobile-view');
    } else {
        searchResults.classList.remove('mobile-view');
    }
}

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

function setupSiteSearch() {
    const siteSearchInput = document.getElementById('site-search-input');
    if (siteSearchInput) {
        const searchWrapper = siteSearchInput.closest('.site-search');
        if (searchWrapper) {
            searchWrapper.style.position = 'relative';
            
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
        
        // 既存の要素のクローンを作成し、イベントをクリア
        const clonedInput = siteSearchInput.cloneNode(true);
        siteSearchInput.parentNode.replaceChild(clonedInput, siteSearchInput);
        
        // 新しいイベントハンドラを設定
        clonedInput.addEventListener('click', function(e) {
            e.preventDefault();
            handleSearchFieldClick(e);
        });
        
        clonedInput.addEventListener('focus', function(e) {
            e.preventDefault();
            handleSearchFieldClick(e);
        });
        
        clonedInput.readOnly = true;
        clonedInput.placeholder = 'サイト内検索...';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    window.debouncedSearch = debounce(performSiteSearch, 300);
    
    setupSiteSearch();
    
    setupOutsideClickHandler();
    
    const overlay = document.createElement('div');
    overlay.id = 'search-overlay';
    overlay.className = 'search-overlay';
    overlay.addEventListener('click', function(e) {
        e.stopPropagation();
        closeSearchResults();
    });
    document.body.appendChild(overlay);
    
    setupMobileSearch();
    
    setupToolSearch();
    
    fixTabSwitching();
    
    setupHashChangeHandler();
    
    setupInitialTabs();
    
    handleUrlTabParam();
    
    setTimeout(() => {
        generateSearchIndex();
    }, 500);
});

/**
 * サイト内検索のイベントリスナーを確実に設定
 */
document.addEventListener('DOMContentLoaded', function() {
    // サイト内検索のイベント設定
    function setupSearchEvents() {
        // デスクトップでのサイト内検索
        const siteSearchInput = document.getElementById('site-search-input');
        if (siteSearchInput) {
            // 既存のイベントハンドラをクリア
            const clonedInput = siteSearchInput.cloneNode(true);
            siteSearchInput.parentNode.replaceChild(clonedInput, siteSearchInput);
            
            // 新しいイベントハンドラを設定
            clonedInput.addEventListener('click', handleSearchFieldClick);
        }
        
        // モバイルでのサイト内検索
        const mobileSearchToggle = document.getElementById('mobile-search-toggle');
        if (mobileSearchToggle) {
            // 既存のイベントハンドラをクリア
            const clonedToggle = mobileSearchToggle.cloneNode(true);
            mobileSearchToggle.parentNode.replaceChild(clonedToggle, mobileSearchToggle);
            
            // 新しいイベントハンドラを設定
            clonedToggle.addEventListener('click', handleSearchFieldClick);
        }
        
        // ESCキーで検索ダイアログを閉じる
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && window.isSearchDialogOpen) {
                closeSearchResults();
            }
        });
    }
    
    // ページ読み込み完了後に実行
    setTimeout(setupSearchEvents, 500);
});
