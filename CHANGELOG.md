# 變更記錄

**繁體中文** | [English](CHANGELOG_en.md) | [日本語](CHANGELOG_ja.md) | [한국어](CHANGELOG_ko.md)

本專案的重要變動都記在這裡，格式參考 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.1.0/)。版本號跟著 `threads-api/SKILL.md` 的 `metadata.version` 走，Agensi 上的版本也用同一個號碼；1.0 之前的變動依日期記錄。

## 未發布

### 變更

- 安全政策 `SECURITY*.md` 改用統一格式：新增 Email 回報管道，寫明 14 天內首次回覆、最晚在回報後 90 天公開，適用時申請 CVE；翻譯檔改名為 `SECURITY_en.md`、`SECURITY_ja.md`、`SECURITY_ko.md`，檔內連結改用完整網址。
- README、變更記錄、benchmark 摘要與 `.github/` 社群檔案的翻譯檔也改用 `_xx` 命名，例如 `README_en.md`、`CHANGELOG_ja.md`、`evals/BENCHMARK_ko.md`、`.github/i18n/CODE_OF_CONDUCT_en.md`；介紹網站與站內連結一併更新。

## 1.4 - 2026-10-19

### 新增

- 第 6 輪評測：用 1.3 版的技能重跑第 2、4、7、8 題，驗證 1.2 和 1.3 兩項還沒評測過的變更；這一輪兩種設定都不能上網。有技能 31 項全部通過，沒技能通過 26 項（各題平均 84%），有技能的分數沒有任何一題比前幾輪低。結果記在四語版 benchmark 摘要和 `evals/benchmark.json`，README 四語版的「測試結果」、介紹網站的評測數字和 `docs/llms.txt` 一併更新。
  - 第 10 節 webhook 去重的規則（1.2）：第 7 題有技能的版本改以 `(field, media_id)` 為唯一鍵。
  - 第 8 節 `debug_token` 可以用 App token（1.3）：第 2、8 題有技能的版本改用 App token 呼叫，90 天權限授權的檢查不再只限測試人員帳號；第 4 題有技能的回覆仍說 token 擁有者必須是測試人員，沒有檢查項目涵蓋這一點。
- `evals/evals.json` 第 4 題新增第 7 個檢查項目：建議用 `debug_token` 檢查 token 的 `scopes`，並說明 `access_token` 可以用 App token（不需要測試人員），且必須和 `input_token` 來自同一個 App。前幾輪的第 4 題都是用原本的 6 個檢查項目判定。
- 第 7 輪評測：用 1.4 版的技能重跑全部 10 題，確認把參考用戶端搬到 `scripts/threads_client.py` 之後沒有退步；技能以整個 `threads-api` 資料夾安裝，兩種設定都不能上網。有技能 77 項全部通過，沒技能通過 59 項（各題平均 77%），有技能的分數沒有任何一題比前幾輪低。結果記在四語版 benchmark 摘要和 `evals/benchmark.json`，README 四語版的「測試結果」、介紹網站的評測數字和 `docs/llms.txt` 一併更新。
  - 參考用戶端：10 題有技能的版本都在寫程式前先讀了 `scripts/threads_client.py`，開發模式的第 1、9 題照第 2 節移植了它的邏輯。代操作的第 3 題照第 3 節在工作資料夾用完整路徑執行用戶端，交給使用者的指令也用完整路徑；第 10 題則把用戶端複製到工作資料夾，由自己寫的串文腳本匯入，交出沒改過的複本。沒有任何一題把用戶端的程式碼另存成暫存檔。
  - 第 8.2 節的 App token 說明：第 4 題有技能的版本改用 App token 呼叫 `debug_token`，新增的第 7 個檢查項目通過；沒技能的版本沒有提到。
  - 這一輪的技能快照早於第 14 節新增「從標準輸入執行用戶端」的說明，這段說明還沒評測。翻頁沿用第 6 輪起的判定標準，這一輪也套用到第 5、9 題。
- `evals/evals.json` 依第 7 輪評分者的建議修改 8 題的檢查項目，收緊或補上兩種設定都通過、分不出差別的地方，檢查項目從 77 項增為 82 項。前幾輪都是用修改前的檢查項目判定；改完還沒重跑評測，第 7 輪的分數不能直接和新的檢查項目對照。
  - 第 1 題新增第 9 項：呼叫 API 前先在本機驗證內文長度（emoji 依 UTF-8 位元組計數）、最多 5 個連結、輪播 2–20 項。沒有加發文配額的檢查，因為 SKILL.md 只要求批次或排程發文前查 `threads_publishing_limit`，這題只發一則。
  - 第 2 題新增第 10 項：用 `debug_token` 讀 `data_access_expires_at`，在 90 天權限授權到期前提醒，並說明私人帳號每 90 天要重新授權。
  - 第 3 題：第 4 項明確接受在使用者說 token 已設定時，交出可在使用者 shell 執行的指令；第 6 項改成每一條交出去的發文路徑都要先確認帳號；第 7 項改成必須點出現在（例如週一）發出的 24 小時貼文會在週末前消失，或 `example.com` 是占位網址。
  - 第 7 題：第 1 項註明缺少 `hub.*` 參數時框架回的 422 也算「否則 403」；新增第 9 項：payload 沒有 `root_post`／`replied_to` 時，用 `GET /{media-id}` 查出事件屬於哪則貼文。
  - 第 8 題新增第 9 項：換 code 失敗時，能解析文件列出的扁平錯誤格式 `{error_type, code, error_message}` 並記錄訊息。
  - 第 2 題第 8 項、第 5 題第 5 項、第 9 題第 6 項：寫明要用 `paging.cursors.after` 自己組下一頁，只靠 `paging.next` 翻頁的迴圈不通過（第 6、7 輪已照這個標準判定，但只寫在評分說明裡）。
  - 第 10 題：第 7 項改成要讓使用者看到會發到哪個帳號，並在開始等待或排程前停下來等使用者確認；新增第 8 項：發文前用 `GET /me/threads_publishing_limit` 檢查發文配額，配額用完就不發。API 沒有排程功能，SKILL.md 要求排程發文前由程式自己檢查配額。

### 變更

- SKILL.md 第 14 節的 Python 參考用戶端（256 行）原樣搬到 `threads-api/scripts/threads_client.py`，SKILL.md 因此少了 245 行（1.3 版是 579 行），回到 [Agent Skills 規範](https://agentskills.io/specification)建議的 500 行以內。第 14 節保留用途、指令用法和 spec 範例，改為指向這個檔案，並補上輸出格式。開頭的目錄、前置資料的 `compatibility`、第 2 節第 3 步（開發模式先讀這個檔案，再移植它的邏輯）、第 3 節第 5 步（代操作在工作資料夾用完整路徑執行它，不再存成暫存檔）和第 7 步（連不到 API 時，連同用戶端的路徑或檔案一起交給使用者）一併改寫。搬移後模型要另外讀取這個檔案，載入技能內容的方式跟著改變；結構調整後的評測已在第 7 輪重跑（見「新增」）。
- SKILL.md 第 8.2 節（Before App Review）新增一條：要確認使用者授權了哪些權限，用 App token（`TH|<APP_ID>|<APP_SECRET>`）當 `access_token` 呼叫 `debug_token`，同一個 App 的使用者不論是不是測試人員都能查；`scopes` 只代表使用者的授權，不代表通過 App Review。第 12 節「權限錯誤或結果意外為空」那列補上同樣的確認方法，「keyword search 只找到自己的貼文」那列加上指向第 8.2 節的參照。這是第 6 輪第 4 題有技能的回覆漏掉的地方；第 7 輪第 4 題有技能的版本已改用 App token，新增的第 7 個檢查項目通過。
- `threads-api/SKILL.md` 的 `metadata.version` 調高為 1.4。
- README 四語版的「文件」「參考用戶端」、參與貢獻指南、資安政策、PR 範本、`docs/llms.txt`，以及介紹網站的參考用戶端標籤和 `check()` 原始碼連結，改為指向 `threads-api/scripts/threads_client.py`。
- 安裝說明：README 四語版的 Kiro 補上匯入後要確認 `scripts/threads_client.py` 有沒有跟著進來（Kiro 的文件沒寫）；Agensi 補上技能不會存到使用者的電腦、授權也不允許存檔，代操作要執行的用戶端得由 AI 助理另外向 Agensi 取得。其他方式（`bunx skills`、`gh skill`、Codex、Copilot CLI、Gemini CLI、手動複製、Claude 應用程式和 ChatGPT 的 ZIP）依原始碼或官方文件，都會用到整個 `threads-api` 資料夾。
- SKILL.md 第 14 節新增技能檔案不在磁碟上時的做法（有些平台只在要求時提供檔案、不允許存檔）：向載入技能的地方取得 `scripts/threads_client.py`，用 `python3 - <參數>` 從標準輸入交給 Python 執行，不另外存檔；第 3 節第 5 步加上指向第 14 節的參照。README 四語版的 Agensi 一節改成同樣的說法。修改後還沒重跑評測。
- 安裝說明（README 四語版）：Codex 的 `$skill-installer` 補上它會裝到 `~/.codex/skills/`（有設定 `CODEX_HOME` 時是 `$CODEX_HOME/skills/`），不是表格裡的 `~/.agents/skills/`；Codex 兩處都會讀，但原始碼把前者標為已淘汰、為了相容才保留的位置，所以提醒不要兩處各放一份。Copilot CLI 補上加入資料夾只會登記位置、不會複製。「更新與移除」表新增 Codex（目的地已存在時安裝器會中止，要先刪掉舊資料夾）、Copilot CLI、Kiro（文件沒寫，用刪除再匯入）、Agensi 四列。依據是 openai/codex 原始碼（2026-10-19 `main` 的 `host_roots.rs` 和 skill-installer 的 `install-skill-from-github.py`），以及 Codex、GitHub Copilot CLI、Kiro 的官方文件。

## 1.3 - 2026-10-19

### 變更

- SKILL.md 第 8 節的 `debug_token` 說明同步 Meta changelog 2026-08-18 的條目：`access_token` 除了 Threads 測試人員的 token，也可以用 App token（`TH|<APP_ID>|<APP_SECRET>`），不論哪一種都必須和 `input_token` 來自同一個 App；也補上 token 來自其他 App 時的錯誤訊息。第 12 節 `code 190` 那列加上指向第 8 節的參照，文件快照日期改為 2026-08-18（SKILL.md、README 四語版、`docs/llms.txt`、介紹網站）。`evals/benchmark.json` 裡，第 1–3 輪第 2 題有技能的版本都提到帳號不是測試人員時，會略過用 `debug_token` 檢查 90 天權限授權的步驟；加入後還沒重跑評測。
- `threads-api/SKILL.md` 的 `metadata.version` 調高為 1.3。
- 安裝說明：
  - README 四語版的工具表格加上 `bunx skills` 的 `-a` 參數，新增 Google Antigravity、Cline、Kiro、JetBrains Junie、Roo Code；Windsurf 改為 Devin Desktop 並更新路徑。
  - README 新增「其他安裝方式」（GitHub CLI 的 `gh skill`、Codex、Copilot CLI、Gemini CLI、Kiro）、「ChatGPT」和「更新與移除」三節。
  - Claude 應用程式的步驟改為 Pro、Max 方案，補上各系統壓縮 ZIP 的方法，以及從 Settings > Capabilities 上傳的位置。
  - 介紹網站的工具列表、「要怎麼手動安裝？」「在 Claude 應用程式怎麼用？」、`docs/llms.txt` 和「使用問題」issue 表單一併更新。

## 1.2 - 2026-10-18

### 新增

- 第 7–10 題（FastAPI 接收留言與提及的 webhook、Express 的 OAuth 登入與長期 token 續期、審查一段出錯的 Python 發文程式、隔天早上 8 點代發含 emoji 的串文）與第 5 輪評測結果，記在四語版 benchmark 摘要和 `evals/benchmark.json`。

### 變更

- SKILL.md 第 10 節新增一條 *(practice)*：同一個 webhook 事件可能送達不只一次，處理要做到冪等，以 `values.field` 加上 media ID 為鍵，不要用原始 body 的雜湊。加入後還沒重跑評測。
- `threads-api/SKILL.md` 的 `metadata.version` 調高為 1.2。

### 修正

- GitHub 首頁的 Contributing 等分頁會從 repo 根目錄解析社群檔案裡的相對連結，點了會 404；改用以 `/` 開頭、從 repo 根目錄算起的路徑。
- GitHub 首頁的 Code of conduct 分頁顯示的是英文版：行為準則的英、日、韓文版移到 `.github/i18n/`，分頁改為顯示繁中版。

## 1.1 - 2026-10-18

### 新增

- `threads-api/SKILL.md` 的前置資料加上 `license`、`compatibility`（代操作需要 Python 3.8 以上、能連到 graph.threads.net，並從環境變數或 `.env` 讀取 token）和 `metadata.version`。
- README 四語版新增「Agensi」安裝方式，`docs/llms.txt` 加上 Agensi 頁面的連結。
- 變更記錄 `CHANGELOG*.md`，有繁中、英文、日文、韓文版。
- `docs/llms.txt`：給 AI 助理和爬蟲讀的專案索引，指向 SKILL.md、README 和評測資料。
- README 四語版加入介紹網站的連結。
- GitHub 社群檔案，各有繁中、英文、日文、韓文版，放在 `.github/`：
  - 參與貢獻指南 `CONTRIBUTING*.md`：repo 結構、修改技能與網站的規則、重跑評測、翻譯與 PR 流程。
  - 行為準則 `CODE_OF_CONDUCT*.md`：採用 Contributor Covenant 3.0，補充適用範圍，以及透過 email 或 GitHub 通報的方式。
  - 資安政策 `SECURITY*.md`：通報範圍，以及透過 GitHub 私密漏洞通報回報的流程。
  - 無障礙聲明 `ACCESSIBILITY*.md`：介紹網站支援的環境、已知限制與回報方式。
  - issue 表單：「規則有誤、過時或缺漏」、「使用問題」、「網站問題」三種，四種語言各一份；問題與資安通報導向 Discussions 和私密漏洞通報。
  - PR 範本：預設為繁中，英、日、韓文版放在 `PULL_REQUEST_TEMPLATE/`。
- 介紹網站的「外觀」按鈕：可以在跟隨系統、淺色、深色之間切換，選擇會被記住，並在頁面繪製前套用。

### 變更

- `threads-api/SKILL.md` 開頭列出的用途從兩種改成三種，補上「Embed」（嵌入貼文和 Web Intents）；條列不再附章節編號，在 Agensi 等商店頁面上也讀得懂。
- 貢獻指南四語版加上規則：改了技能內容就調高 SKILL.md 的 `metadata.version`，Agensi 也用同一個版本號。
- README 四語版的「參與貢獻」改成摘要，細節移到 `.github/CONTRIBUTING*.md`。
- 介紹網站改用系統字型，不再從 Fontshare 和 Google Fonts 載入 Switzer 和 Noto Sans，訪客的 IP 位址不會再傳給第三方。原本 500 的字重改為 600，因為 Segoe UI、微軟正黑體等系統字型沒有 500，會顯示成一般粗細。
- 語言和外觀選單共用 `TAS.menu()`（`docs/assets/js/core.js`）。

### 修正

- README 四語版與介紹網站的常見問題，授權從「尚未指定」改為 MIT。
- benchmark 摘要日文版把第 3 題的失分輪次寫成「全部輪次」，改為「三輪都有」，和其他語言一致。
- 網站與 README 的英、日、韓文版有幾處和繁中原文不一致：主題標籤（topic tag）被譯成 hashtag，「觀察到的」（observed）被譯成「確認」，英文版也漏了「最多」「平均」「讓你決定」「照文件的說法」「建議」「自動」等字詞，都已改成和原文一致。
- 介紹網站的無障礙問題：
  - 「一個技能，三種工作」沒有聚焦的說明不再變淡，改用次要文字色（對比至少 4.5:1），旁邊的範例不再對螢幕閱讀器隱藏，用鍵盤聚焦時會切換到對應的範例。
  - 首屏評分面板的每個檢查項目加上「通過／未通過」的文字；「送出前先檢查」的錯誤和提醒加上文字標籤與不同形狀，狀態列同時報出兩者的數量。
  - 開關、輸入框、下拉選單和切換按鈕的邊界對比提高到 3:1 以上（新增色彩 token `--control-line`），內文連結的底線加深；修正讓部分欄位沿用瀏覽器預設樣式的選擇器錯誤；深色模式的「過期」標籤對比提高。
  - 支援強制色彩（Windows 高對比）；開啟減少動態效果時，展開、滑動、按壓等小動畫也一併停用。
  - 腳本載入失敗時內容不再停在隱藏狀態；列印時還沒捲到的區塊不會空白，「技能裡寫了什麼」的 8 個分頁會全部展開。
  - 需要捲動的程式碼和表格可以用鍵盤聚焦；操作過安裝指令產生器後，切換選項會播報新的指令；「已複製」訊息淡出後會移除；切換語言時不再重複播報檢查結果。
  - 標題和語言按鈕的文字不再被讀成連在一起；矮視窗裡分頁列不再固定在頂端；日文版在 320 px 寬時標題不再超出畫面。
  - 停用 JavaScript 時隱藏無法運作的控制項，改為顯示替代說明，並顯示「沒裝技能」的回覆。
  - 時間軸長條上放不下的標籤改為隱藏，不再被截斷。
  - 窄螢幕上頁首的連結放不下時移到第二行，不再疊在網站名稱上。

## 1.0 - 2026-10-18

### 新增

- 技能以 1.0 版免費上架到 [Agensi](https://agensi.io/skills/threads-api)，內容和 2026-10-14 的 `threads-api/SKILL.md` 相同。

## 2026-10-16

### 新增

- 介紹與展示網站 `docs/`，從 main 的 `/docs` 發佈到 GitHub Pages：
  - 首屏節錄第 3 輪評測第 3 題的真實回覆，可切換有技能／沒技能，並列出評分者的 7 個檢查項目。
  - 「送出前先檢查」：第 14 節 `check()` 的 JS 移植版，和 Python 版用 8 組 spec 比對過，錯誤、警告、字數、連結數都一致。
  - 三種用法、六個易錯點、四輪評測數字與逐題表、各節重點數字、安裝指令產生器與常見問題；深淺色與手機版排版。
- 網站語言切換：繁中、英文、日文、韓文。
- 網站 LOGO、favicon 與分享預覽圖。
- MIT 授權（`LICENSE`）。

### 變更

- 網站的樣式與腳本從 `docs/index.html` 拆到 `docs/assets/css/`、`docs/assets/js/`，圖檔移到 `docs/assets/img/`。

## 2026-10-14

### 新增

- `threads-api` 技能（`threads-api/SKILL.md`），整理自 Meta 官方文件，涵蓋到 2026-08-12 的 changelog。
- 評測題組 `evals/evals.json`、benchmark 摘要 `evals/BENCHMARK.md` 與評分資料 `evals/benchmark.json`。
- 第 6 題（60 則貼文牆與每週檢查被刪貼文）與第 4 輪評測結果。
- README 與 benchmark 摘要的英文、日文、韓文版。

### 變更

- SKILL.md 第 11 節從「oEmbed and Web Intents」擴充為嵌入貼文：oEmbed 不需要 token 與錯誤碼、embed.js 的載入行為、大量嵌入時的節流與失敗處理。
- SKILL.md 的 description 縮短為 196 字元。
- README 重寫：各工具的安裝方式、一行安裝的 `skills add` 指令、設定與權限對照表、參與貢獻說明。
