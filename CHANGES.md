# oneimg 客製版 v7

## 模板總覽 (7 個)

| 模板 | 說明 | 預設寬 |
|---|---|---|
| 简约科技风格 | 純色底 + 簡潔標題, 思源宋體 | 375 |
| **企劃書風格** ⭐ v7 大幅升級 | 一行 25 字, 獎盃裝飾, 多項可調設定 | 600 |
| 黑白苹果风格 | 蘋果風長圖 | 375 |
| 思源宋體 長圖 | 連貫長圖, 一行約 17 字 | 375 |
| 思源宋體 長圖（寬版・一行32字） | 寬版連貫長圖 | 800 |
| 書頁排版（思源宋體） | 自動分頁, 邊框貼緣 | 800 |
| 書頁排版（內凹邊框） | 自動分頁, 內凹邊框, 全可調 | 800 |

## v7 變更

### 1. 企劃書風格 — 左右留白可調
新增切換按鈕: 56px / 36px / 20px (位於頂部 menubar → 模版 → 「左右留白」)
透過 CSS variable `--proposal-padding-x` 動態注入到預覽容器。

### 2. 深藍 (鈷藍 holy #4a5d7a) 改成深底白字版
原本歸在淺底組, v7 改為深底組, 與黑/灰/深紅同樣是深底白字。
深底版本現在共 4 色: ink / stone / vermilion / holy

### 3. 深底字色: 米白 / 金色 切換
按鈕: 米白 / 金色 (位於頂部 menubar → 模版 → 「深底字色」, 僅深底色票顯示)

字色定義:
- 米白: #f0eee8 (預設, 紙感, 與宋體搭調)
- 金色: #b89c75 (比原色票金色 #a08866 微淺約 12%, 在深底上更亮但保留古銅韻)

獎盃顏色跟著文字色一起變 (用 CSS mask-image, 顏色由 background-color 決定)。

### 4. 獎盃 SVG 改 mask-image
原本用 backgroundImage data URL (顏色寫死在 SVG 內), 換色票時要重生 SVG。
v7 改用 CSS mask-image: 顏色由 background-color 控制, 切換立刻生效。

### 5. 連結整理
- ✅ GitHub 兩處連結改成 `https://github.com/NinaNeon/ONEIMG`
- ✅ 移除「反饋建議」(QQ)
- ✅ 移除「微信公眾號」與微信 QR
- ✅ 移除「TG 交流群」
- ✅ 移除「Follow us」(X)
- ✅ 移除「小紅書」
- ✅ user-guide 對話框移除影片連結, 改為純文字使用說明
- ✅ metadata oneimgai.com 改用環境變數 `NEXT_PUBLIC_SITE_URL` (Vercel/Cloudflare 部署時自動正確)

## 變更檔案 (v7 增量)

### 修改
- src/store/use-theme-store.ts — 加 proposalPadding, proposalHeavyTextColor
- src/theme/templates/proposal-template/proposal-template.ts — padding 用 CSS var, 獎盃用 mask-image
- src/theme/templates/proposal-template/proposal-colors.ts — holy 改深底, 文字色用 var
- src/app/page.tsx — 預覽容器注入 --proposal-padding-x / --proposal-heavy-text
- src/components/header/header.tsx — 加左右留白與深底字色按鈕, 清理外部連結
- src/app/layout.tsx — metadata 改用環境變數

## 部署

詳見 DEPLOY.md

---

## v7.1 hotfix

**修正**: 金色 `#b89c75` 字色切換失敗。

### 原因
`--proposal-heavy-text` 之前只注入到 preview wrapper div 的 inline style,
而 `--main-container-foreground: var(--proposal-heavy-text, #f0eee8)` 在 `:root` (GlobalStyles)。

雖然 CSS variable 規範上「var() 在使用點解析」,但在某些渲染時序下,
:root 的 token list 提前 resolve 為 fallback 值,導致永遠是米白。

### 修法
把 proposal 三個動態變數 (`--proposal-heavy-text`, `--proposal-heavy-text-dim`,
`--proposal-padding-x`) 也直接寫進 :root (透過 useEffect 監聽 store 變化),
跟其他色票變數同層,移除跨層 var 引用問題。

inline style 保留作為雙保險(優先順序更高)。

### 修改檔案
- src/app/page.tsx — useEffect 額外注入 proposal 動態變數到 :root

---

## v7.2

### 1. 企劃書新增深藍色 midnight (深普魯士藍)
- 色號: `#1c2540` (亮度約 0.14, 跟 stone #2a2c30 同級)
- 比原 holy (#4a5d7a) 深得多, 是企劃書封面正式深藍感
- 僅在企劃書模板出現 (page-style / page-frame 等書頁模板不變)
- 排序: ink → stone → midnight → vermilion → holy → steel → bronze → violet

### 2. holy 專屬: 金色更淺一階
- 一般深底 (ink/stone/midnight/vermilion) 切「金色」: `#b89c75` (原樣)
- **holy 切「金色」**: `#cdb38a` (亮度再 +10%, 淡金)
  原因: holy 深藍 (#4a5d7a) 比黑/灰淺,
  原金色對比不夠跳, 提亮後在深藍上更顯眼

只影響 holy, 其他色票金色維持原樣。

### 修改檔案
- src/theme/templates/proposal-template/proposal-colors.ts
- src/theme/index.ts
- src/components/header/header.tsx
- src/app/page.tsx
