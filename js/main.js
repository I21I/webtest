document.addEventListener('DOMContentLoaded', function() {
    // 検索インデックスの初期化
    const searchIndex = [
        {
            title: "AAO Merge Helper",
            url: "#tools-section",
            content: "Avatar OptimizerのMergeSkinnedMeshとMergePhysBoneを簡単に設定するツールです。オブジェクトのトグル制御にも対応し、アバター改変の軽量化作業を効率化します。",
            tags: ["AAO", "Avatar Optimizer", "MergeSkinnedMesh", "MergePhysBone", "最適化"],
            path: "ツール"
        },
        {
            title: "インストール方法",
            url: "#install-section",
            content: "VCCやALCOMでのリポジトリの追加方法を解説しています。上部の「VCC/ALCOMに追加する」ボタンで簡単にリポジトリを追加できます。",
            tags: ["VCC", "ALCOM", "インストール", "リポジトリ"],
            path: "インストール方法"
        },
        {
            title: "お問い合わせ",
            url: "#contact-section",
            content: "不具合や機能のリクエスト、その他のお問い合わせについては、以下のリンクからお願いします。",
            tags: ["お問い合わせ", "Twitter", "Booth"],
            path: "お問い合わせ"
        }
    ];

    // ツール検索の初期化
    initToolSearch();

    // スクロールトップボタンの初期化
    initScrollTopButton();

    // MutationObserverの設定
    setupMutationObserver();

    // 初期スクロールボタン表示チェック
    checkScrollTopButton();

    // グローバルにsearchIndexを公開
    window.searchIndex = searchIndex;
});
