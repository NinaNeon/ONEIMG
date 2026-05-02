# 部署教學

oneimg 是純前端應用 (內容存在瀏覽器 IndexedDB),不需要後端、不需要資料庫。
任何能跑 Next.js 14 的靜態託管都能用。

下面三種方法擇一,推薦從上往下。**Vercel** 最簡單, 5 分鐘上線。

---

## 方法 A：Vercel 一鍵部署 (最推薦)

### 為什麼選 Vercel
- Vercel 是 Next.js 的官方公司, 最相容
- 個人專案完全免費 (頻寬與運算配額充足)
- 支援自動 HTTPS 與自定網域
- 推 GitHub 自動部署

### 步驟

**1. 把專案推上 GitHub**

```bash
# 解壓專案
unzip oneimg-page-style-v7.zip
cd oneimg-modified

# 初始化 git (若尚未)
git init
git add .
git commit -m "initial commit"

# 連到你的 GitHub repo
git branch -M main
git remote add origin https://github.com/NinaNeon/ONEIMG.git
git push -u origin main
```

如果不熟 git, 也可以直接到 https://github.com/NinaNeon/ONEIMG 點 "Add file → Upload files", 把整個 oneimg-modified 拖進去 (要拖目錄裡的內容, 不要拖整個目錄)。

**2. 到 Vercel 部署**

1. 開啟 https://vercel.com, 用 GitHub 帳號登入
2. 點右上 "Add New..." → "Project"
3. 找到 NinaNeon/ONEIMG 倉庫, 點 "Import"
4. 設定畫面:
   - Framework Preset: **Next.js** (應自動偵測)
   - Root Directory: 留空或 `.`
   - Build Command: `pnpm run build` (預設正確)
   - Output Directory: 留預設
5. 環境變數區 (Optional):
   - `NEXT_PUBLIC_SITE_URL` = 你的網域 (例如 `https://oneimg.vercel.app`),
     若不填, Vercel 會用自動產生的網域
6. 點 "Deploy"

約 1-3 分鐘後, Vercel 會給你一個網址 (例如 https://oneimg-xxx.vercel.app), 打開就能用。

**3. 綁定自定網域 (選擇性)**

1. 在 Vercel 專案頁面 → "Settings" → "Domains"
2. 輸入你的網域 (例如 `book.example.com`)
3. 按指示到網域註冊商 (Cloudflare / Gandi / Namecheap...) 設 CNAME 紀錄到 Vercel
4. Vercel 自動申請 Let's Encrypt 憑證 (自動 HTTPS)

**自動部署流程**

之後每次 push 到 GitHub main, Vercel 會自動重新部署。preview 分支會有獨立預覽網址。

---

## 方法 B：Cloudflare Pages

### 為什麼選 Cloudflare
- 全球邊緣節點 (亞洲訪問速度快)
- 完全免費
- 流量無上限

### 步驟

**1. 推上 GitHub** (同方法 A)

**2. 到 Cloudflare Pages**

1. 開啟 https://dash.cloudflare.com → "Workers & Pages"
2. 點 "Create application" → "Pages" 標籤 → "Connect to Git"
3. 授權 GitHub, 選擇 NinaNeon/ONEIMG 倉庫
4. 設定:
   - Framework preset: **Next.js**
   - Build command: `pnpm run pages:build`
   - Build output directory: `.vercel/output/static`
   - Node version (在 Environment variables 設): `NODE_VERSION = 20`
5. 點 "Save and Deploy"

**注意**: oneimg 用 edge runtime, Cloudflare Pages 完全相容, 但首次 build 可能因 Node 版本問題出錯, 確定 NODE_VERSION 設 20 就 OK。

---

## 方法 C：本機跑 / 自己的伺服器

### 環境要求
- Node.js 18.17 或更新 (建議 20 LTS)
- pnpm 8+

### 本機

```bash
unzip oneimg-page-style-v7.zip
cd oneimg-modified

# 第一次安裝 pnpm
npm install -g pnpm

# 安裝套件
pnpm install

# 開發模式 (有 hot reload)
pnpm dev
# → http://localhost:3000
```

### 自己的 VPS (Ubuntu 範例)

```bash
# 安裝 Node 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pnpm

# 取得程式碼
git clone https://github.com/NinaNeon/ONEIMG.git
cd ONEIMG

# 編譯與啟動
pnpm install
pnpm build
pnpm start  # 預設跑在 :3000

# 用 nginx 反代到 80/443 + Let's Encrypt 取得 HTTPS
# (需要另外設 nginx config + certbot)
```

進階用法: 用 PM2 守護程序

```bash
sudo npm install -g pm2
pm2 start "pnpm start" --name oneimg
pm2 save
pm2 startup    # 跟著系統開機自動啟動
```

---

## 更新部署

### Vercel / Cloudflare Pages
推 GitHub commit, 自動觸發重新部署。

### 自架
```bash
cd ONEIMG
git pull
pnpm install
pnpm build
pm2 restart oneimg
```

---

## 常見問題

**Q: 部署後字體沒載入,變成預設無襯線?**
A: Next.js 用 `next/font/google` 載 Noto Serif TC,
要確定建置時能連 fonts.googleapis.com。
首次 build 在沒網路環境會失敗 (例如某些 CI 環境)。
解法: 改用本地字體檔, 或確保 build 時有外網。

**Q: 我想隱藏 GitHub 連結讓網站看起來像獨立產品?**
A: 編輯 `src/components/header/header.tsx`,
搜尋兩處 `github.com/NinaNeon/ONEIMG` 移除即可。

**Q: 我能限制只有特定人能用嗎?**
A: oneimg 是純前端, 無帳號系統。要做存取控制, 三選一:
   1. 用 Vercel 的 Password Protection (付費功能)
   2. 用 Cloudflare Access (免費, 適合 5 人以下)
   3. 自架時在 nginx 設 Basic Auth

**Q: 內容會跑去伺服器嗎?**
A: 不會。所有內容都存在瀏覽器 IndexedDB, 換瀏覽器 / 換裝置看不到。
要備份就用「保存到...」匯出 JSON 檔。
