function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
}

function handleResize() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuButton = document.getElementById('menu-button');
    
    if (window.innerWidth > 900) {
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
        }
    }
}

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

function initToolSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleToolSearch);
    }
}

function handleTabClick() {
    if (this.classList.contains('active')) return;
    
    const tabContainer = this.closest('.tabs');
    tabContainer.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    this.classList.add('active');
    
    const tabId = this.getAttribute('data-tab');
    
    const parentSection = this.closest('.info-box') || this.closest('section');
    
    if (parentSection) {
        parentSection.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const targetContent = parentSection.querySelector('#' + tabId + '-tab');
        if (targetContent) {
            targetContent.classList.add('active');
        }
    } else {
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const targetContent = document.getElementById(tabId + '-tab');
        if (targetContent) {
            targetContent.classList.add('active');
        }
    }
}

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
    
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
    }
}

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

function handleScroll() {
    checkScrollTopButton();
    setActiveNavItem();
}

function setActiveNavItem() {
    const scrollY = window.pageYOffset;
    
    document.querySelectorAll('section[id]').forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.header-nav-item, .mobile-menu-nav-item').forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === '#' + sectionId) {
                    item.classList.add('active');
                }
            });
        }
    });
}

function checkScrollTopButton() {
    const scrollTopButton = document.getElementById('scroll-top-button');
    
    if (scrollTopButton) {
        if (window.scrollY > 300) {
            scrollTopButton.classList.add('visible');
        } else {
            scrollTopButton.classList.remove('visible');
        }
    }
}

function handleSiteSearch(e) {
    if (typeof e === 'string') {
        performSiteSearch(e);
    } else if (e.key === 'Enter') {
        const searchTerm = this.value.trim();
        if (searchTerm === '') return;
        
        performSiteSearch(searchTerm);
        this.blur();
    }
}

function performSiteSearch(query) {
    const searchResultsContent = document.getElementById('search-results-content');
    const searchQuery = document.getElementById('search-query');
    
    if (!searchResultsContent || !searchQuery || !window.searchIndex) return;
    
    searchQuery.textContent = query;
    query = query.toLowerCase();
    
    const results = window.searchIndex.filter(item => {
        return item.title.toLowerCase().includes(query) || 
               item.content.toLowerCase().includes(query) || 
               (item.tags && item.tags.some(tag => typeof tag === 'string' && tag.toLowerCase().includes(query)));
    });
    
    if (results.length > 0) {
        let html = '<ul class="search-result-list">';
        
        results.forEach(result => {
            let highlightedContent = result.content;
            let highlightedTitle = result.title;
            
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
    
    document.getElementById('search-results').classList.add('active');
    
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
    }
}

function closeSearchResults() {
    const searchResults = document.getElementById('search-results');
    if (searchResults) {
        searchResults.classList.remove('active');
    }
}
