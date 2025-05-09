// テーマ初期化関数（グローバルに公開）
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-theme');
    }
}

// テーマ切り替え関数（グローバルに公開）
function toggleTheme() {
    if (document.body.classList.contains('dark-theme')) {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    } else {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    }
}

// この部分がメインJSと競合している可能性があるため、コメントアウト
// document.addEventListener('DOMContentLoaded', function() {
//     initTheme();
//     
//     // テーマ切替ボタンのイベントリスナー
//     const themeToggle = document.getElementById('theme-toggle');
//     if (themeToggle) {
//         themeToggle.addEventListener('click', toggleTheme);
//     }
//     
//     // モバイルテーマ切替ボタンがあれば
//     const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
//     if (mobileThemeToggle) {
//         mobileThemeToggle.addEventListener('click', toggleTheme);
//     }
// });

// 代わりに、main.jsで呼び出せるように関数をグローバルに公開
window.themeModule = {
    initTheme: initTheme,
    toggleTheme: toggleTheme
};
