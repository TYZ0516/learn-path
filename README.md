# 個別化數學學習路線（learn-path）

學生頁面：`index.html`，學生用座號和姓名登入。老師後台：`admin.html`。

## 檔案
| 檔案 | 用途 |
|---|---|
| index.html | 學生頁面：學習路線、觀念互動、三層練習、出場券 |
| admin.html | 老師後台：匯入學生、看學習進度與紀錄、列印個人講義 |
| modules.js | 模組庫：35 個觀念關卡的目錄、路線產生規則，以及已完成的模組 |
| store.js | 資料層：示範模式（瀏覽器）或 Firebase |
| config.js | Firebase 設定（apiKey 是「請貼上」時就用示範模式） |
| mock.js | 5 位模擬學生 |
| style.css | 共用樣式 |

## 接上 Firebase（原民班專用的新專案）
原民班和學扶班分開用兩個 Firebase 專案。免費方案的流量與同時連線數是「每個專案」各自計算，分開就不會互搶。

1. 到 [Firebase 主控台](https://console.firebase.google.com) 按「新增專案」，名稱例如 `math-yuanmin`。Google Analytics 可以不啟用。
2. 左側「建構 → Realtime Database」→ 建立資料庫，位置選「新加坡（asia-southeast1）」，先用「鎖定模式」。
3. 「建構 → Authentication」→ 開始使用 →「登入方式」分頁，啟用「匿名」和「Google」。
4. Authentication →「設定」分頁 →「授權網域」，新增 `tyz0516.github.io`。
5. 專案總覽旁的齒輪 →「專案設定」→ 往下找「你的應用程式」→ 按 `</>` 新增網頁應用程式（不用勾 Hosting）。畫面上的 firebaseConfig 有 apiKey、authDomain、databaseURL、projectId、appId，把這五個值貼到 `config.js`。
   - 如果 firebaseConfig 裡沒有 databaseURL，到 Realtime Database 頁面最上方複製網址（`https://…asia-southeast1.firebasedatabase.app`）。
6. Realtime Database →「規則」分頁，整段換成下面的內容（老師信箱換成你的 Google 帳號），按「發布」：

```json
{
  "rules": {
    ".read": false,
    ".write": false,
    "learn": {
      ".read": "auth != null && auth.token.email == '老師的Gmail'",
      ".write": "auth != null && auth.token.email == '老師的Gmail'",
      "students": { "$seat": { ".read": "auth != null" } },
      "progress": { "$seat": { ".read": "auth != null", "$mid": { ".write": "auth != null" } } },
      "logs": { "$seat": { "$id": { ".write": "auth != null && !data.exists()" } } }
    }
  }
}
```

7. 在 GitHub 新增一個 repo（例如 `learn-path`），上傳這 8 個檔案，到 Settings → Pages 開啟 GitHub Pages（Branch 選 main）。
8. 學生網址：`https://tyz0516.github.io/learn-path/`；老師後台：`https://tyz0516.github.io/learn-path/admin.html`（用規則裡的那個 Google 帳號登入）。
9. 測試用網址：在網址後面加 `?demo`（例如 `https://tyz0516.github.io/learn-path/?demo`、`https://tyz0516.github.io/learn-path/admin.html?demo`），會用示範模式打開，可以點 5 位模擬學生直接進入。資料只存在這台裝置的瀏覽器，不會寫入 Firebase，也不會影響真正學生的資料。

### 免費方案的額度（每個專案各自計算）
Realtime Database 免費方案大約是：同時連線 100 個、儲存 1 GB、每月下載 10 GB。原民班一個班使用綽綽有餘：一筆作答紀錄大約 150 位元組，就算全班每人寫上千題，也只用到幾 MB。

## 資料路徑
- `learn/students/{座號}`：姓名、起點、學習路線、各年級通過情形（老師匯入時寫入）
- `learn/progress/{座號}/{模組}`：三層練習的作答數與答對數、出場券次數、學習時間、完成時間
- `learn/logs/{座號}/{自動編號}`：每一次登入、作答（學生的答案和正解）、通過練習、出場券

## 新增模組
在 `modules.js` 的 `MOD` 裡加一個物件（goal、wrong、concept、widget、example、tiers），id 要和 `CATALOG` 裡的一樣。學生的路線不用重算，下次登入就會看到新關卡解鎖。

## 加到手機桌面（PWA）
- `manifest.webmanifest`、`sw.js`、`icon-192.png`、`icon-512.png`、`icon-maskable-512.png`、`apple-touch-icon.png` 讓學生頁面可以安裝到手機桌面，點圖示就以全螢幕開啟。
- Android（Chrome）：登入頁下方會出現「加到手機桌面」按鈕；沒有按鈕時，按右上角「⋮」→「加到主畫面」。
- iPhone（Safari）：按「分享」→「加入主畫面」。
- 在 LINE 裡開啟的網頁不能安裝，畫面會提示學生改用預設瀏覽器開啟。
- `sw.js` 一律先抓網路上的最新檔案，更新 modules.js 後學生馬上看到新版；沒網路時才用上次的版本。
- 登入狀態會記在學生自己的手機上，下次從桌面圖示打開不用重新輸入；按「登出」就會清除。
