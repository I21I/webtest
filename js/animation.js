// animation.js - アニメーション関連の機能
function initFadeAnime() {
    // フェードイン要素を検出
    const fadeElements = document.querySelectorAll('.fadeUp');
    
    // IntersectionObserverの設定
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    // 各要素を監視
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// セクションのフェードイン
function setupMutationObserver() {
    // DOM変更を監視して動的に追加された要素にアニメーションを適用
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element
                        const fadeElements = node.querySelectorAll('.fadeUp');
                        fadeElements.forEach(element => {
                            // 少し遅延させてクラスを適用
                            setTimeout(() => {
                                element.classList.add('visible');
                            }, 100);
                        });
                    }
                });
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}
