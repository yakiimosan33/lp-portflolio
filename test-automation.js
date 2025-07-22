// 自動テストスクリプト
// コンソールで実行してテスト結果を確認

const testResults = {
    passed: 0,
    failed: 0,
    tests: []
};

function test(name, condition) {
    if (condition) {
        testResults.passed++;
        testResults.tests.push({name, status: 'PASS'});
        console.log(`✅ ${name}`);
    } else {
        testResults.failed++;
        testResults.tests.push({name, status: 'FAIL'});
        console.error(`❌ ${name}`);
    }
}

// 1. 基本的なページ読み込みテスト
console.log('\n=== 1. 基本的なページ読み込みテスト ===');

test('ローディング画面要素が存在', document.getElementById('loading') !== null);
test('ヘッダー要素が存在', document.querySelector('.header') !== null);
test('メインコンテナが存在', document.querySelector('.main-container') !== null);
test('スクロールインジケータが存在', document.querySelector('.scroll-indicator') !== null);

// 必要なリソースの確認
test('jQuery読み込み確認', typeof jQuery !== 'undefined');
test('GSAP読み込み確認', typeof gsap !== 'undefined');
test('imagesLoaded読み込み確認', typeof imagesLoaded !== 'undefined');

// 2. ナビゲーションテスト
console.log('\n=== 2. ナビゲーションテスト ===');

test('ロゴリンクが存在', document.querySelector('.logo') !== null);
test('WORKSリンクが存在', document.querySelector('a[href="#works"]') !== null);
test('ABOUTリンクが存在', document.querySelector('a[href="about.html"]') !== null);
test('CONTACTリンクが存在', document.querySelector('a[href="contact.html"]') !== null);
test('Xリンクが存在し新規タブで開く設定', 
    document.querySelector('.social-link') !== null && 
    document.querySelector('.social-link').getAttribute('target') === '_blank'
);

// 3. フィルタリング機能テスト
console.log('\n=== 3. フィルタリング機能テスト ===');

const filterButtons = document.querySelectorAll('.filter-tag');
const portfolioItems = document.querySelectorAll('.portfolio-grid-item');

test('フィルターボタンが存在', filterButtons.length > 0);
test('ポートフォリオアイテムが存在', portfolioItems.length > 0);

// Webサイトセクションのフィルター
const websiteFilters = document.querySelector('[data-category="website"]');
if (websiteFilters) {
    const websiteFilterButtons = websiteFilters.querySelectorAll('.filter-tag');
    test('Webサイトフィルターボタンが5個存在', websiteFilterButtons.length === 5);
}

// Webアプリセクションのフィルター
const webappFilters = document.querySelector('[data-category="webapp"]');
if (webappFilters) {
    const webappFilterButtons = webappFilters.querySelectorAll('.filter-tag');
    test('Webアプリフィルターボタンが6個存在', webappFilterButtons.length === 6);
}

// 4. ポートフォリオアイテムテスト
console.log('\n=== 4. ポートフォリオアイテムテスト ===');

const externalLinks = document.querySelectorAll('.portfolio-grid-item[href]');
let allHaveNoopener = true;
let allHaveTarget = true;

externalLinks.forEach(link => {
    if (link.getAttribute('rel') !== 'noopener noreferrer') allHaveNoopener = false;
    if (link.getAttribute('target') !== '_blank') allHaveTarget = false;
});

test('全ての外部リンクにnoopener noreferrerが設定', allHaveNoopener);
test('全ての外部リンクが新規タブで開く設定', allHaveTarget);

// data-tags属性の確認
let allItemsHaveTags = true;
portfolioItems.forEach(item => {
    if (!item.getAttribute('data-tags')) allItemsHaveTags = false;
});
test('全てのポートフォリオアイテムにdata-tags属性が設定', allItemsHaveTags);

// 5. レスポンシブデザインテスト
console.log('\n=== 5. レスポンシブデザインテスト ===');

const viewport = window.innerWidth;
const isMobile = viewport < 768;
const isTablet = viewport >= 768 && viewport < 900;
const isDesktop = viewport >= 900;

if (isMobile) {
    test('モバイルでカスタムカーソルが非表示', 
        getComputedStyle(document.querySelector('.cursor-dot')).display === 'none'
    );
}

if (isDesktop) {
    test('デスクトップでカスタムカーソルが表示', 
        document.querySelector('.cursor-dot') !== null
    );
}

// 6. セキュリティヘッダーテスト（メタタグ）
console.log('\n=== 6. セキュリティテスト ===');

test('X-Content-Type-Optionsメタタグが存在', 
    document.querySelector('meta[http-equiv="X-Content-Type-Options"]') !== null
);
test('X-Frame-Optionsメタタグが存在', 
    document.querySelector('meta[http-equiv="X-Frame-Options"]') !== null
);
test('Referrer-Policyメタタグが存在', 
    document.querySelector('meta[http-equiv="Referrer-Policy"]') !== null
);

// 7. 画像の代替テキストテスト
console.log('\n=== 7. アクセシビリティテスト ===');

const images = document.querySelectorAll('img');
let allImagesHaveAlt = true;
images.forEach(img => {
    if (!img.getAttribute('alt')) allImagesHaveAlt = false;
});
test('全ての画像にalt属性が設定', allImagesHaveAlt);

// テスト結果サマリー
console.log('\n=== テスト結果サマリー ===');
console.log(`総テスト数: ${testResults.passed + testResults.failed}`);
console.log(`✅ 成功: ${testResults.passed}`);
console.log(`❌ 失敗: ${testResults.failed}`);
console.log(`成功率: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);

// グローバルに結果を保存
window.testResults = testResults;