function handleScroll() {
    setActiveNavItem();
    checkScrollTopButton();
    fadeAnime();
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
    if (!scrollTopButton) return;
    
    if (window.pageYOffset > 300) {
        scrollTopButton.classList.add('visible');
    } else {
        scrollTopButton.classList.remove('visible');
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function initScrollTopButton() {
    const scrollTopButton = document.getElementById('scroll-top-button');
    if (scrollTopButton) {
        scrollTopButton.addEventListener('click', scrollToTop);
    }
}

function initFadeAnime() {
    fadeAnime();
}

function fadeAnime() {
    document.querySelectorAll('section > *').forEach(function(element) {
        const elemPos = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elemPos < windowHeight - 50) {
            element.classList.add('fadeUp');
        }
    });
}

function setupMutationObserver() {
    const config = { childList: true, subtree: true };
    const observer = new MutationObserver(function(mutations) {
        fadeAnime();
    });
    
    const container = document.querySelector('.container');
    if (container) {
        observer.observe(container, config);
    }
}
