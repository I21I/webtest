// ui.js - UI関連の機能
// モバイルメニュー切り替え
function toggleMobileMenu() {
    // 画面サイズのチェック
    if (window.innerWidth > 900) {
        return; // 大きい画面サイズでは何もしない
    }
    
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
}

// 画面リサイズ時にモバイルメニューを閉じる
function handleResize() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (window.innerWidth > 900 && mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
    }
}

// ツール検索処理
function handleToolSearch() {
    const searchTerm = this.value.toLowerCase();
    let hasResults = false;
    
    document.querySelectorAll('.tool-card').forEach(card => {
        const name = card.getAttribute('data-name').toLowerCase();
        const tags = card.getAttribute('data-tags').toLowerCase();
        const description = card.querySelector('.tool-description').textContent.toLowerCase();
        
        if (name.includes(searchTerm) || tags.includes(searchTerm) || description.includes(searchTerm)) {
            card.classList.remove('hidden');
            hasResults = true;
        } else {
            card.classList.add('hidden');
        }
    });
    
    if (!hasResults && searchTerm !== '') {
        document.getElementById('no-results-message').classList.remove('hidden');
    } else {
        document.getElementById('no-results-message').classList.add('hidden');
    }
}

// ツール検索の初期化
function initToolSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleToolSearch);
    }
}

// タブクリック処理
function handleTabClick() {
    if (this.classList.contains('active')) return;
    
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    this.classList.add('active');
    
    const tabId = this.getAttribute('data-tab');
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabId + '-tab').classList.add('active');
}

// ナビクリック処理
function handleNavClick(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        window.scrollTo({
            top: targetElement.offsetTop - 70,
            behavior: 'smooth'
        });
    }
    
    // モバイルメニューを閉じる
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
    }
}

// スクロールトップボタン
function initScrollTopButton() {
    const scrollTopButton = document.getElementById('scroll-top-button');
    
    if (scrollTopButton) {
        scrollTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// スクロール時の処理
function handleScroll() {
    checkScrollTopButton();
}

// スクロールトップボタンの表示・非表示を切り替え
function checkScrollTopButton() {
    const scrollTopButton = document.getElementById('scroll-top-button');
    
    if (scrollTopButton) {
        if (window.scrollY > 300) {
            scrollTopButton.style.opacity = '1';
            scrollTopButton.style.visibility = 'visible';
        } else {
            scrollTopButton.style.opacity = '0';
            scrollTopButton.style.visibility = 'hidden';
        }
    }
}

// サイト内検索処理
function handleSiteSearch(e) {
    let searchTerm;
    
    if (typeof e === 'string') {
        searchTerm = e;
    } else if (e.key === 'Enter') {
        searchTerm = this.value;
    } else {
        return;
    }
    
    if (!searchTerm || searchTerm.trim() === '') return;
    
    searchTerm = searchTerm.toLowerCase();
    const results = [];
    
    if (window.searchIndex) {
        window.searchIndex.forEach(item => {
            const titleMatch = item.title.toLowerCase().includes(searchTerm);
            const contentMatch = item.content.toLowerCase().includes(searchTerm);
            const tagsMatch = item.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            
            if (titleMatch || contentMatch || tagsMatch) {
                results.push(item);
            }
        });
    }
    
    // 検索結果を表示
    displaySearchResults(searchTerm, results);
}

// 検索結果の表示
function displaySearchResults(searchTerm, results) {
    const searchResults = document.getElementById('search-results');
    const searchResultsContent = document.getElementById('search-results-content');
    const searchQuery = document.getElementById('search-query');
    
    if (searchResults && searchResultsContent && searchQuery) {
        searchQuery.textContent = searchTerm;
        searchResultsContent.innerHTML = '';
        
        if (results.length > 0) {
            results.forEach(result => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                
                const title = document.createElement('h3');
                title.className = 'search-result-title';
                
                const link = document.createElement('a');
                link.href = result.url;
                link.textContent = result.title;
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    searchResults.classList.remove('active');
                    
                    const targetElement = document.querySelector(result.url);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 70,
                            behavior: 'smooth'
                        });
                    }
                });
                
                title.appendChild(link);
                
                const path = document.createElement('div');
                path.className = 'search-result-path';
                path.textContent = result.path;
                
                const snippet = document.createElement('div');
                snippet.className = 'search-result-snippet';
                snippet.textContent = result.content;
                
                resultItem.appendChild(title);
                resultItem.appendChild(path);
                resultItem.appendChild(snippet);
                
                searchResultsContent.appendChild(resultItem);
            });
        } else {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.textContent = '検索結果が見つかりませんでした。';
            searchResultsContent.appendChild(noResults);
        }
        
        searchResults.classList.add('active');
    }
}

// 検索結果を閉じる
function closeSearchResults() {
    const searchResults = document.getElementById('search-results');
    if (searchResults) {
        searchResults.classList.remove('active');
    }
}
