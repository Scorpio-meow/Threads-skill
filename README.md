# Threads API Skill

讓 Claude 熟悉 Meta Threads API 的技能（skill）。它能幫你寫、檢查、除錯串接 Threads API 的程式，也能用你的 token 直接幫你發文、回覆、刪文、隱藏留言、抓洞察數據。

- 內容整理自 Meta 官方 Threads API 文件，涵蓋到 2026-08-12 的 changelog。
- 技能本身用英文撰寫，Claude 會用你使用的語言回覆。
- 非 Meta 官方專案。

## 能做什麼

- **開發模式**：依專案使用的語言產生程式（Node.js/TypeScript、Python、C#、Go 等；沒有專案時預設用 Python），內建正確的發文流程：建立 container → 等處理完成 → 發佈 → 取得貼文網址；也處理分頁、token 續期和錯誤。
- **代操作模式**：先確認 token 和要操作的帳號，檢查內容有沒有違反限制或功能衝突（字數、連結數、限時貼文（ghost post）不能附投票等），提醒可能讓貼文達不到目的的地方，再把實際要送出的參數列給你，等你同意才發。
- **參考資料**：發文參數與相容性、媒體規格、權限與 App Review、各項配額、洞察指標、webhook、oEmbed、Web Intents、常見錯誤，以及官方範例裡不能照抄的錯誤。
- **內建工具**：SKILL.md 第 14 節附一支 `threads_client.py`（Python 3.8 以上，只用標準函式庫），可以發文、查詢、刪除，發文前會先在本機檢查內容。

## 安裝

**Claude Code**

把 `threads-api` 資料夾複製到以下其中一個位置：

- 個人（這台電腦上的所有專案）：`~/.claude/skills/threads-api/`
- 單一專案（可以 commit 給團隊一起用）：`.claude/skills/threads-api/`

Claude 會在相關時自動使用，也可以輸入 `/threads-api` 直接叫用。

**Claude 應用程式（網頁版／桌面版）**

1. 把 `threads-api` 資料夾壓成 ZIP，ZIP 最上層要是這個資料夾。
2. 打開 **Customize > Skills**（claude.ai/customize/skills），按 **+** → **Create skill** → **Upload a skill**，上傳 ZIP。
3. 需要先開啟程式碼執行：Free、Pro、Max 方案在 **Settings > Capabilities** 開啟「Code execution and file creation」；Team、Enterprise 方案由組織擁有者在組織設定裡開啟。

## 使用範例

- 「幫我用 TypeScript 寫一個每天抓 Threads 貼文洞察的排程，token 要能自動續期。」
- 「我的 keyword_search 只搜得到自己的貼文，是哪裡寫錯？」
- 「幫我發一則 Threads：……」：先把 token 設成環境變數 `THREADS_ACCESS_TOKEN`，或寫進專案資料夾的 `.env`。Claude 會先確認帳號和內容，等你同意才發文。

## 測試結果

用同一個模型比較「有技能」和「沒技能」：每題兩種設定各跑一次，再由沒參與作答的評分者依事先寫好的檢查項目判定是否通過。

| 輪次 | 題數 | 有技能 | 沒技能 |
|---|---|---|---|
| 第 1 輪 | 3 | 100%（23/23） | 76%（18/23） |
| 第 2 輪 | 4 | 96.5%（28/29） | 79.5%（23/29） |
| 第 3 輪（最終版） | 4 | 100%（29/29） | 85%（25/29） |

百分比是各題通過率的平均，括號內是通過的檢查項目數。每題只跑一次，樣本很小，數字只能當參考。

沒技能時的失分多半來自不知道或不確定文件裡的規則，例如：

- 不敢肯定限時貼文不能附投票，還提議兩個都送出去試試看。
- 把 profile_lookup 的粉絲門檻說成舊的 1,000（2025 年 11 月已降到 100），或完全沒提。
- 先對巢狀回覆本身呼叫隱藏，失敗才改處理上層留言。
- 翻頁只看 `paging.next`，但文件明說回應裡不會有這個欄位，照文件的說法這樣只會抓到第一頁。

測試題目和檢查項目在 [`evals/evals.json`](evals/evals.json)。第 1 題（Python 輪播貼文）兩邊都拿滿分（8/8），分不出差別，所以第 2、3 輪改用第 2 到 5 題。之後修改技能時，可以用 Anthropic 的 skill-creator 技能照這批題目重跑比較。

## 已知限制

- 內建工具只在模擬的 API 上測過，還沒有對真實帳號實際發文。
- 官方文件有幾處互相矛盾或沒說清楚，例如地點搜尋要用 `q` 還是 `query`、限時貼文加上不支援的功能時 API 會報錯還是直接忽略。技能遇到時會照實說明，不會自行假設。
- 文件快照到 2026-08-12，之後的新功能請以[官方 changelog](https://developers.facebook.com/documentation/threads/changelog) 為準。

## English

A Claude skill for Meta's Threads API. It helps Claude write, review and debug code that calls the API, and lets it act on your own account (post, reply, delete, hide replies, pull insights) after showing you exactly what will be sent and waiting for your OK. The content is distilled from the official Threads API docs (changelog through 2026-08-12) and includes a dependency-free Python client.

Install it in Claude Code by copying `threads-api/` to `~/.claude/skills/` (or `.claude/skills/` in a project). In the Claude apps, zip the `threads-api` folder and upload it under Customize > Skills; code execution must be enabled.

In three rounds of with/without-skill comparisons, the final version passed 29/29 checks versus 25/29 without the skill. The bundled client has only been tested against a mock API. Not affiliated with Meta.
