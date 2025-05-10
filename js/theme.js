// theme.js - テーマ切り替え機能
// テーマの初期化
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-theme');
        updateThemeButtons(true);
    } else {
        updateThemeButtons(false);
    }
}

// テーマトグル処理
function toggleTheme() {
    const isDarkTheme = document.body.classList.toggle('dark-theme');
    updateThemeButtons(isDarkTheme);
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
}

// テーマボタンの表示を更新
function updateThemeButtons(isDarkTheme) {
    const sunIcons = document.querySelectorAll('.sun');
    const moonIcons = document.querySelectorAll('.moon');
    
    sunIcons.forEach(icon => {
        icon.style.display = isDarkTheme ? 'none' : 'block';
    });
    
    moonIcons.forEach(icon => {
        icon.style.display = isDarkTheme ? 'block' : 'none';
    });
}

// メディアクエリの変更検知
function setupMutationObserver() {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeMediaQuery.addEventListener('change', e => {
        // ユーザーが既に明示的にテーマを選択していない場合のみ自動変更
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.body.classList.add('dark-theme');
                updateThemeButtons(true);
            } else {
                document.body.classList.remove('dark-theme');
                updateThemeButtons(false);
            }
        }
    });
}
