# Webサイトセクション レイアウト改善案

## 現在の問題点
- 2カラムグリッドで5つ以上のアイテムがある場合、最後の行が1つだけになり不均等
- スクロールしないと全アイテムが見えない可能性

## レイアウト案

### 案1: 動的グリッドシステム
```css
.portfolio-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    max-height: 70vh;
    overflow-y: auto;
}
```
**メリット**：
- アイテム数に応じて自動的にカラム数が調整される
- 5個の場合：3-2の配置
- 6個の場合：3-3の配置
- レスポンシブ対応が容易

**デメリット**：
- アイテムサイズが変動する可能性

### 案2: 3カラムグリッド
```css
.portfolio-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
}

/* 7個目以降は次の行へ */
```
**メリット**：
- 均等な配置（3-3-3...）
- 見た目が整然としている

**デメリット**：
- アイテムが小さくなる
- モバイル対応で調整が必要

### 案3: カルーセル/スライダー方式
```css
.portfolio-grid {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 2rem;
}

.portfolio-grid-item {
    flex: 0 0 calc(50% - 1rem);
    scroll-snap-align: start;
}
```
**メリット**：
- 無限にアイテムを追加可能
- スペースを有効活用
- インタラクティブ

**デメリット**：
- 一覧性が低下
- 実装が複雑

### 案4: メイソンリーレイアウト
```css
.portfolio-grid {
    columns: 2;
    column-gap: 2rem;
}

.portfolio-grid-item {
    break-inside: avoid;
    margin-bottom: 2rem;
}
```
**メリット**：
- 異なる高さのアイテムに対応
- スペースの無駄が少ない

**デメリット**：
- 読み順が縦になる
- フィルタリング時の動きが複雑

### 案5: タブ切り替え方式
```html
<div class="portfolio-tabs">
    <button class="tab-button active" data-tab="recent">最新作品</button>
    <button class="tab-button" data-tab="lp">LP作品</button>
    <button class="tab-button" data-tab="store">店舗サイト</button>
</div>
<div class="portfolio-content">
    <!-- 各タブの内容 -->
</div>
```
**メリット**：
- カテゴリごとに整理
- 大量のアイテムに対応可能
- UIがすっきり

**デメリット**：
- 一覧性が低下
- 実装が複雑

### 案6: グリッド + ページネーション
```css
.portfolio-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
}

.pagination {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 3rem;
}
```
**メリット**：
- 常に均等な表示
- 大量のアイテムに対応
- パフォーマンスが良い

**デメリット**：
- 複数ページを見る必要がある
- 実装が必要

## 推奨案

**短期的な解決策**：案1（動的グリッドシステム）
- 実装が簡単
- 現在の構造を大きく変更しない
- レスポンシブ対応が容易

**長期的な解決策**：案3（カルーセル）または案5（タブ切り替え）
- スケーラビリティが高い
- ユーザー体験が向上
- モダンなUI

どの案を採用しますか？