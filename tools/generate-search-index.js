const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// 設定
const indexFile = path.resolve(__dirname, '../index.html');
const outputFile = path.resolve(__dirname, '../data/search-index.json');

// 検索インデックスの作成
async function generateSearchIndex() {
  const searchIndex = [];
  
  try {
    // HTMLファイルの内容を読み込む
    const html = fs.readFileSync(indexFile, 'utf8');
    const $ = cheerio.load(html);
    
    // ツールセクションの処理
    $('#tools-container .tool-card').each(function() {
      const title = $(this).find('.tool-name').text();
      const version = $(this).find('.tool-version').text();
      const content = $(this).find('.tool-description').text();
      const tags = $(this).attr('data-tags') ? $(this).attr('data-tags').split(',') : [];
      
      searchIndex.push({
        title,
        url: "#tools-section",
        content,
        tags,
        path: "ツール"
      });
    });
    
    // インストールセクションの処理
    searchIndex.push({
      title: "インストール方法",
      url: "#install-section",
      content: $('#install-section .install-note').text(),
      tags: ["VCC", "ALCOM", "インストール", "リポジトリ"],
      path: "インストール方法"
    });
    
    // お問い合わせセクションの処理
    searchIndex.push({
      title: "お問い合わせ",
      url: "#contact-section",
      content: $('#contact-section .info-content p').text(),
      tags: ["お問い合わせ", "Twitter", "Booth"],
      path: "お問い合わせ"
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
