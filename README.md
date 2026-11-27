# 個別化數學學習路線（learn-path）

學生頁面：`index.html`，學生用座號和姓名登入。老師後台：`admin.html`。

## 檔案
| 檔案 | 用途 |
|---|---|
| index.html | 學生頁面：學習路線、觀念互動、三層練習、出場券 |
| admin.html | 老師後台：匯入學生、看學習進度與紀錄、列印個人講義 |
| modules.js | 模組庫：36 個觀念關卡（全部完成，涵蓋測驗 65 題）、路線產生規則 |
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
- `learn/progress/{座號}/{模組}`：三層練習的作答數與答對數、出場券次數、學習時間、完成時間；`_lvl` 是升級前測的狀態
- `learn/logs/{座號}/{自動編號}`：每一次登入、作答（學生的答案和正解）、通過練習、出場券

## 升級前測（逐年級往上開放）
- 學生把目前路線上的關卡全部完成後，首頁出現「○年級升級前測」（下一個年級 = 目前開放到的年級 + 1，一開始是起點年級 + 1）。
- 共 10 題：第 1～5 題從學生已完成的關卡隨機出題；第 6～10 題從下一個年級出題，優先考還沒學過、即將開放的關卡。
- 前 5 題答對 4 題以上才通過：下一個年級的關卡全部加入路線（已完成的不重複），第 6～10 題答錯的關卡排在最前面，之後照順序解鎖。
- 未通過：提示學生先複習答錯的關卡，可以隨時再挑戰（題目會換）。
- 通過後再完成新開放的關卡，就會出現下一個年級的升級前測，一路到九年級。
- 資料存在 `learn/progress/{座號}/_lvl`（目前年級、開放的關卡、每次前測成績），每題作答也記在學生紀錄。老師後台的進度、詳細資料和講義都會包含升級前測開放的關卡。

## 老師預覽（看所有關卡）
- 老師後台上方按「預覽所有關卡」，或直接開 `https://tyz0516.github.io/learn-path/?preview`。
- 36 個關卡全部開放，可以不照順序看；練習的基礎、進階、挑戰可以直接切換，出場券也不用先練習完才能開。
- 預覽時的作答不會儲存，也不會出現在任何學生的紀錄裡。
- Firebase 模式下只有老師能進：要先在老師後台用規則裡的 Google 帳號登入（同一個瀏覽器）。學生打開這個網址只會看到「只有老師可以使用」。
- 示範模式用 `?preview&demo`。

## 學習路線怎麼產生
- 測驗裡答錯、寫「不會」的題目，對應的關卡全部放進路線。
- 沒寫到的題目：題目的年級在起點年級以內（含起點）才放進路線；高於起點年級的空白題不放（速度測驗沒寫到不代表不會）。
- 路線由低年級排到高年級，同年級照 `CATALOG` 的順序，所以基礎缺口一定在前面（例如整數除法在小數除法之前）。
- 解鎖：起點以下的年級全部開放，可以不照順序練習（例如起點小五，小一到小四都開放，包括不在路線上的關卡）；起點和以上的年級要完成上一關才解鎖。
- 路線是老師「匯入學生」時算好存起來的。規則改了以後，要再匯入一次才會更新；同一個座號重新匯入，學習紀錄會保留。
- 示範模式（`?demo`）的模擬學生存在各自的瀏覽器裡。規則更新後，到 `admin.html?demo` 按「清空示範資料」，再重新打開學生頁，模擬學生就會用新規則重建。

## 新增模組
在 `modules.js` 的 `MOD` 裡加一個物件（goal、wrong、concept、widget、example、tiers），id 要和 `CATALOG` 裡的一樣。學生的路線不用重算，下次登入就會看到新關卡解鎖。

## 加到手機桌面（PWA）
- `manifest.webmanifest`、`sw.js`、`icon-192.png`、`icon-512.png`、`icon-maskable-512.png`、`apple-touch-icon.png` 讓學生頁面可以安裝到手機桌面，點圖示就以全螢幕開啟。
- Android（Chrome）：登入頁下方會出現「加到手機桌面」按鈕；沒有按鈕時，按右上角「⋮」→「加到主畫面」。
- iPhone（Safari）：按「分享」→「加入主畫面」。
- 在 LINE 裡開啟的網頁不能安裝，畫面會提示學生改用預設瀏覽器開啟。
- `sw.js` 一律先抓網路上的最新檔案，更新 modules.js 後學生馬上看到新版；沒網路時才用上次的版本。
- 登入狀態會記在學生自己的手機上，下次從桌面圖示打開不用重新輸入；按「登出」就會清除。
