// tab.js - タブ機能の制御
// タブクリック処理
function handleTabClick() {
    if (this.classList.contains('active')) return;
    
    // 同じタブコンテナ内のタブのみ非アクティブにする
    const tabContainer = this.closest('.tabs');
    tabContainer.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    this.classList.add('active');
    
    // 最も近い共通の親要素を探す
    const tabSection = this.closest('.tab-section');
    if (!tabSection) return;
    
    // 該当セクション内のタブコンテンツのみを対象にする
    const tabId = this.getAttribute('data-tab');
    tabSection.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const targetContent = tabSection.querySelector('#' + tabId + '-tab');
    if (targetContent) {
        targetContent.classList.add('active');
    }
}

// ページ読み込み時に最初のタブをアクティブにする
function initTabs() {
    document.querySelectorAll('.tab-section').forEach(section => {
        // 各セクションで最初のタブをアクティブに
        const firstTab = section.querySelector('.tab');
        if (firstTab && !firstTab.classList.contains('active')) {
            firstTab.click();
        }
    });
}
