const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const indexFile = path.resolve(__dirname, '../index.html');
const outputFile = path.resolve(__dirname, '../data/search-index.json');

async function generateSearchIndex() {
  const searchIndex = [];
  
  try {
    const html = fs.readFileSync(indexFile, 'utf8');
    const $ = cheerio.load(html);
    
    $('#tools-container .tool-card').each(function() {
      const title = $(this).find('.tool-name').text();
      const version = $(this).find('.tool-version').text();
      const description = $(this).find('.tool-description').text();
      const tags = $(this).attr('data-tags') ? $(this).attr('data-tags').split(',') : [];
      
      const features = [];
      $(this).find('.tool-specs ul li').each(function() {
        features.push($(this).text());
      });
      
      const detailLink = $(this).find('.tool-footer a').attr('href') || "";
      
      searchIndex.push({
        title,
        url: "#tools-section",
        content: description,
        tags,
        path: "ツール",
        version,
        features: features.join(', '),
        detailLink
      });
    });
    
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
    
    searchIndex.push({
      title: "二十一世紀症候群 VRChatツール",
      url: "#",
      content: $('h1').text() + ' - ' + $('.subtitle').text(),
      tags: ["VRChat", "ツール", "アバター改変", "最適化"],
      path: "ホーム"
    });
    
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, JSON.stringify(searchIndex, null, 2));
  } catch (error) {
    // エラーが発生した場合の簡易処理
  }
}

generateSearchIndex();
