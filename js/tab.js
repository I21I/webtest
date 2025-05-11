// tab.js - タブ機能の制御
// タブクリック処理
function handleTabClick() {
    if (this.classList.contains('active')) return;
    
    // 同じタブコンテナ内のタブのみ非アクティブにする
    const tabContainer = this.closest('.tabs');
    tabContainer.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    this.classList.add('active');
    
    // 親要素（インフォボックスなど）を取得
    const parentSection = this.closest('.info-box') || this.closest('section');
    
    // 該当セクション内のタブコンテンツのみを対象にする
    const tabId = this.getAttribute('data-tab');
    
    if (parentSection) {
        parentSection.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const targetContent = parentSection.querySelector('#' + tabId + '-tab');
        if (targetContent) {
            targetContent.classList.add('active');
        }
    } else {
        // 親要素が特定できない場合はドキュメント全体から探す（フォールバック）
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const targetContent = document.getElementById(tabId + '-tab');
        if (targetContent) {
            targetContent.classList.add('active');
        }
    }
}

// ページ読み込み時に最初のタブをアクティブにする
function initTabs() {
    document.querySelectorAll('.tabs').forEach(tabContainer => {
        // 各タブコンテナで最初のタブをアクティブに
        const firstTab = tabContainer.querySelector('.tab');
        if (firstTab && !firstTab.classList.contains('active')) {
            firstTab.click();
        }
    });
}
