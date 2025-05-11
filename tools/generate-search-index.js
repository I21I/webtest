const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// 設定
const indexFile = path.resolve(__dirname, '../index.html');
const outputFile = path.resolve(__dirname, '../data/search-index.json');

// 検索インデックスの作成 - 改善版
async function generateSearchIndex() {
  const searchIndex = [];
  
  try {
    // HTMLファイルの内容を読み込む
    const html = fs.readFileSync(indexFile, 'utf8');
    const $ = cheerio.load(html);
    
    // ツールセクションの処理 - 詳細情報も取得
    $('#tools-container .tool-card').each(function() {
      const title = $(this).find('.tool-name').text();
      const version = $(this).find('.tool-version').text();
      const description = $(this).find('.tool-description').text();
      const tags = $(this).attr('data-tags') ? $(this).attr('data-tags').split(',') : [];
      
      // 主な機能と動作環境も検索対象に含める
      const features = [];
      $(this).find('.tool-specs ul li').each(function() {
        features.push($(this).text());
      });
      
      // 詳細ページへのリンク
      const detailLink = $(this).find('.tool-footer a').attr('href') || "";
      
      searchIndex.push({
        title,
        url: "#tools-section",
        content: description,
        tags,
        path: "ツール",
        version,
        features: features.join(', '), // 機能をカンマ区切りで追加
        detailLink
      });
    });
    
    // インストールセクションの処理 - より詳細に
    const installContent = $('#install-section .install-note').text();
    const installStepsVCC = [];
    $('#vcc-tab .install-steps li').each(function() {
      installStepsVCC.push($(this).text());
    });
    
    const installStepsALCOM = [];
    $('#alcom-tab .install-steps li').each(function() {
      installStepsALCOM.push($(this).text());
    });
    
    searchIndex.push({
      title: "インストール方法",
      url: "#install-section",
      content: installContent,
      tags: ["VCC", "ALCOM", "インストール", "リポジトリ"],
      path: "インストール方法",
      additionalInfo: [
        "VCC: " + installStepsVCC.join(' '),
        "ALCOM: " + installStepsALCOM.join(' ')
      ].join(' ')
    });
    
    // お問い合わせセクションの処理 - リンク情報も含める
    const contactContent = $('#contact-section .info-content p').text();
    const contactLinks = [];
    $('#contact-section .social-links a').each(function() {
      contactLinks.push($(this).text() + ': ' + $(this).attr('href'));
    });
    
    searchIndex.push({
      title: "お問い合わせ",
      url: "#contact-section",
      content: contactContent,
      tags: ["お問い合わせ", "Twitter", "Booth"],
      path: "お問い合わせ",
      links: contactLinks
    });
    
    // 全体的な情報も索引に追加
    searchIndex.push({
      title: "二十一世紀症候群 VRChatツール",
      url: "#",
      content: $('h1').text() + ' - ' + $('.subtitle').text(),
      tags: ["VRChat", "ツール", "アバター改変", "最適化"],
      path: "ホーム"
    });
    
    // 検索インデックスをJSONファイルとして保存
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, JSON.stringify(searchIndex, null, 2));
    
    console.log(`検索インデックスが生成されました: ${outputFile}`);
    console.log(`インデックス化されたアイテム数: ${searchIndex.length}`);
  } catch (error) {
    console.error('検索インデックス生成エラー:', error);
  }
}

// 実行
generateSearchIndex();
