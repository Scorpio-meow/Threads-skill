# Threads API Skill

**繁體中文** | [English](README.en.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

讓 AI 助理熟悉 Meta Threads API 的技能（skill）：幫你寫、檢查、除錯串接程式，也能用你的 token 直接發文、回覆、查數據，或把 Threads 貼文嵌入你的網站。

- 採用 [Agent Skills](https://agentskills.io) 格式（一個資料夾加一份 `SKILL.md`），Claude Code、Claude 應用程式、ChatGPT、OpenAI Codex、GitHub Copilot、Cursor、Gemini CLI、Devin Desktop（原 Windsurf）、OpenCode 等十多種工具都能安裝。
- 內容整理自 Meta 官方文件，涵蓋到 2026-08-18 的 changelog。嵌入貼文的部分另外參考 2026 年 10 月實際讀取的 embed.js 程式碼和實測結果。
- 技能本身用英文撰寫，AI 助理會用你使用的語言回覆。下文以 Claude 為例說明。
- 非 Meta 官方專案。
- 介紹網站：<https://scorpio-meow.github.io/Threads-skill/>，可以直接在瀏覽器試用「送出前先檢查」。

## 快速開始

用 [`skills`](https://github.com/vercel-labs/skills) 指令一行安裝，它會偵測你電腦上的 AI 工具並放到對應的資料夾：

```bash
bunx skills add Scorpio-meow/Threads-skill --skill threads-api -g
```

- `-g` 裝到個人目錄（所有專案都能用）；拿掉 `-g` 則只裝到目前的專案。
- 只裝給特定工具，加上 `-a`，例如 `-a claude-code -a codex`；各工具的值見[下一節的表格](#各工具的技能資料夾)。
- 沒有 [Bun](https://bun.sh) 的話，把 `bunx` 換成 `npx` 也可以。

裝好後問一句跟 Threads API 有關的事就會自動啟用，例如：

> 我的 keyword_search 只搜得到自己的貼文，是哪裡寫錯？

各工具的手動安裝和其他安裝方式見下一節。

## 安裝

### 各工具的技能資料夾

手動安裝就是把 `threads-api` 資料夾複製到工具讀取的技能資料夾，讓 `SKILL.md` 落在 `<技能資料夾>/threads-api/SKILL.md`。個人資料夾給這台電腦上的所有專案用；專案資料夾放在專案根目錄下，可以 commit 給團隊一起用。

| 工具 | `-a` 參數 | 個人資料夾 | 專案資料夾 | 手動叫用 |
|---|---|---|---|---|
| Claude Code | `claude-code` | `~/.claude/skills/` | `.claude/skills/` | `/threads-api` |
| OpenAI Codex（CLI、IDE 擴充套件、ChatGPT 桌面版） | `codex` | `~/.agents/skills/` | `.agents/skills/` | `/skills` 或 `$threads-api` |
| GitHub Copilot（VS Code、Copilot CLI、JetBrains） | `github-copilot` | `~/.copilot/skills/` | `.github/skills/` | `/threads-api` |
| Cursor | `cursor` | `~/.cursor/skills/` | `.cursor/skills/` | 在 Agent 對話輸入 `/` 選擇 |
| Gemini CLI | `gemini-cli` | `~/.gemini/skills/` | `.gemini/skills/` | `/skills list` 可確認是否載入 |
| Google Antigravity | `antigravity` | `~/.gemini/config/skills/` | `.agents/skills/` | — |
| Devin Desktop（原 Windsurf） | `devin` | `~/.config/devin/skills/` | `.devin/skills/` | `@threads-api` |
| OpenCode | `opencode` | `~/.config/opencode/skills/` | `.opencode/skills/` | — |
| Cline | `cline` | `~/.cline/skills/` | `.cline/skills/` | `/threads-api` |
| Kiro | `kiro-cli` | `~/.kiro/skills/` | `.kiro/skills/` | 輸入 `/` 選擇 |
| JetBrains Junie | `junie` | `~/.junie/skills/` | `.junie/skills/` | `/threads-api` 或 `$threads-api` |
| Roo Code | `roo` | `~/.roo/skills/` | `.roo/skills/` | — |

`~` 在 Windows 是使用者資料夾（`%USERPROFILE%`）。所有工具都會在對話相關時自動使用技能，「手動叫用」欄只是指定使用的方式。

- Codex、Copilot、Cursor、Gemini CLI、OpenCode、Devin Desktop、Junie、Roo Code 也會讀 `~/.agents/skills/`，同時用好幾種工具的話，放一份在這裡就能共用。Claude Code 只讀 `~/.claude/skills/`。
- `bunx skills` 會把技能放在共用的 `.agents/skills/`（加 `-g` 時是 `~/.agents/skills/`），再替其他工具建立連結。裝完工具沒讀到的話，改用下面的手動安裝，放到表中的資料夾。
- 表上沒有的工具（Amp、Goose、Kilo Code、Trae、Qwen Code 等）也能用 `bunx skills` 安裝，`-a` 的值見 [skills 的說明](https://github.com/vercel-labs/skills)。
- Devin Desktop 也還讀得到 Windsurf 時期的 `~/.codeium/windsurf/skills/` 和 `.windsurf/skills/`。

以複製到 `~/.agents/skills/` 為例，換成其他工具時，把 `TARGET` 改成上表的路徑。

macOS／Linux：

```bash
git clone --depth 1 https://github.com/Scorpio-meow/Threads-skill.git
TARGET=~/.agents/skills
mkdir -p "$TARGET"
cp -r Threads-skill/threads-api "$TARGET/"
```

Windows PowerShell：

```powershell
git clone --depth 1 https://github.com/Scorpio-meow/Threads-skill.git
$TARGET = "$HOME\.agents\skills"
New-Item -ItemType Directory -Force $TARGET | Out-Null
Copy-Item -Recurse -Force Threads-skill\threads-api "$TARGET\"
```

工具若沒有偵測到新技能，重新啟動一次即可。

### 其他安裝方式

有些工具有自己的安裝指令：

- **GitHub CLI**（2.90 以上，`gh skill` 目前是 public preview）：`--agent` 的值和上表的 `-a` 相同。

  ```bash
  gh skill install Scorpio-meow/Threads-skill threads-api --agent claude-code --scope user
  ```

- **OpenAI Codex**：在 Codex 輸入

  ```text
  $skill-installer install https://github.com/Scorpio-meow/Threads-skill/tree/main/threads-api
  ```

  安裝器會放到 `~/.codex/skills/threads-api`（有設定 `CODEX_HOME` 時是 `$CODEX_HOME/skills/`），不是上表的 `~/.agents/skills/`。Codex 兩個位置都會讀，但官方文件列的個人資料夾只有 `~/.agents/skills/`，Codex 原始碼則把 `~/.codex/skills/` 標為已淘汰、為了相容才保留的位置；想放在 `~/.agents/skills/` 的話，改用 `bunx skills` 或手動複製。兩個位置不要各放一份：Codex 不會合併同名技能，兩個都會出現在選單裡。

  Codex 預設在沙箱裡執行指令、不開網路，代操作要連到 Threads API 時會先請你核准。想一律允許，在 `~/.codex/config.toml` 加上：

  ```toml
  [sandbox_workspace_write]
  network_access = true
  ```

- **GitHub Copilot CLI**：clone 之後執行 `copilot skill add Threads-skill/threads-api`；工作階段中途加入的，用 `/skills reload` 載入。加入資料夾只會登記位置、不會複製，clone 下來的資料夾要留著。放在 repo 的 `.github/skills/` 並 commit 的話，雲端的 Copilot cloud agent 也會用到。
- **Gemini CLI**：預設裝到個人範圍，加上 `--scope workspace` 只裝到目前專案。

  ```bash
  gemini skills install https://github.com/Scorpio-meow/Threads-skill.git --path threads-api
  ```

- **Kiro**：Kiro 面板的 **Agent Steering & Skills** → **+** → **Import a skill** → **GitHub**，網址要指到技能所在的子資料夾：`https://github.com/Scorpio-meow/Threads-skill/tree/main/threads-api`。Kiro 的文件沒說匯入時會不會帶上子資料夾，匯入後請確認技能資料夾裡有 `scripts/threads_client.py`，沒有的話改用手動複製整個 `threads-api` 資料夾。
- **Devin Desktop**：Cascade 面板右上角的 **⋯** → **Skills** 可以管理技能。
- **Cline**：新技能預設啟用，可以在 Cline 面板底部的 **Skills** 分頁切換。

### Claude 應用程式（網頁版／桌面版）

1. 開啟程式碼執行：Pro、Max 方案到 **Settings > Capabilities** 開啟「Code execution and file creation」；Team、Enterprise 方案由組織擁有者在組織設定裡開啟「Code execution and file creation」和「Skills」。
2. 把 `threads-api` 資料夾**單獨**壓成 ZIP，ZIP 最上層要是 `threads-api/` 資料夾。GitHub 的「Download ZIP」下載的是整個 repo（最上層是 `Threads-skill-main/`），不能直接上傳。
   - macOS／Linux：在 `Threads-skill` 資料夾執行 `zip -r ../threads-api.zip threads-api -x '*.DS_Store'`。
   - Windows：在檔案總管對 `threads-api` 資料夾按右鍵 →「壓縮成 ZIP 檔案」（Windows 10 是「傳送到 → 壓縮的 (zipped) 資料夾」）。
3. 到 **Customize > Skills**，按 **+** → **Create skill** → **Upload a skill**，上傳 ZIP。介面如果是 **Settings > Capabilities**，就在 Skills 區塊按 **Upload skill**。

上傳的技能只有你的帳號能用，要給整個組織得由組織擁有者佈建。App 的程式碼執行環境預設連不到 Threads API，代操作要在自己的電腦上執行。介面如有變動，以[官方說明](https://support.claude.com/en/articles/12512180-using-skills-in-claude)為準。

### ChatGPT

依[官方說明](https://help.openai.com/en/articles/20001066-skills-in-chatgpt)，ChatGPT 的技能目前開放給 Business、Enterprise、Healthcare、Edu 方案中符合資格的使用者，能不能上傳由工作區設定決定。

1. 照上一節的方式把 `threads-api` 資料夾壓成 ZIP。
2. 在側邊欄的 **Plugins** → **Skills** 分頁按 **Create** → **Upload from your computer**，上傳 ZIP。
3. 對話中輸入 `@` 選擇 `threads-api`，或讓 ChatGPT 自動判斷。

ChatGPT 和 Codex 的技能目前不會同步，用 Codex 的話要另外安裝。

### Agensi

這個技能也免費上架在 [Agensi](https://agensi.io/skills/threads-api)。在技能頁面按「Copy prompt to install」，把複製的提示貼給你的 AI 助理，它會連上 Agensi 並安裝技能。已經連接 Agensi connector 的助理，每次使用都會從 Agensi 載入最新版本。

Agensi 不會把技能存到你的電腦，它的授權也不允許存檔，所以代操作要執行的 `scripts/threads_client.py` 不在本機。這時技能會請 AI 助理向 Agensi 取得這個檔案，從標準輸入（stdin）交給 Python 執行，不另外存檔。要穩定使用代操作的話，建議改用前面的方式安裝。

這個 repo 的更新要等 Agensi 審核通過才會出現在 Agensi 上，最新內容以這個 repo 為準。

### 更新與移除

| 安裝方式 | 更新 | 移除 |
|---|---|---|
| `bunx skills` | `bunx skills update threads-api` | `bunx skills remove threads-api` |
| `gh skill` | `gh skill update` | 刪除 `threads-api` 資料夾 |
| Codex（`$skill-installer`） | 刪除 `~/.codex/skills/threads-api` 資料夾，再安裝一次（資料夾已存在時安裝器會中止） | 刪除 `~/.codex/skills/threads-api` 資料夾 |
| Copilot CLI（`copilot skill add`） | 在 `Threads-skill` 資料夾執行 `git pull`；工作階段進行中的話，再執行 `/skills reload` | `copilot skill remove` 加上 `threads-api` 資料夾的路徑（只取消登記，檔案會留著） |
| Gemini CLI | 移除後重新安裝 | `gemini skills uninstall threads-api` |
| Kiro | 刪除技能資料夾裡的 `threads-api`，再匯入一次 | 刪除技能資料夾裡的 `threads-api` |
| 手動複製 | 在 `Threads-skill` 資料夾執行 `git pull`，再複製一次 | 刪除 `threads-api` 資料夾 |
| Claude 應用程式、ChatGPT | 刪掉舊的，再上傳新的 ZIP | 在 Skills 頁面刪除 |
| Agensi | 不用手動更新，每次使用都會從 Agensi 載入最新版本 | 沒有存到電腦，不用移除 |

Kiro 的文件沒寫怎麼更新或移除；匯入的技能會複製到技能資料夾（`~/.kiro/skills/` 或 `.kiro/skills/`），所以上表用刪除資料夾的方式。

### 各工具官方說明

路徑或介面如有變動，以官方文件為準：[Claude Code](https://code.claude.com/docs/en/skills)・[Claude 應用程式](https://support.claude.com/en/articles/12512180-using-skills-in-claude)・[ChatGPT](https://help.openai.com/en/articles/20001066-skills-in-chatgpt)・[OpenAI Codex](https://learn.chatgpt.com/docs/build-skills)・[GitHub Copilot](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills)・[VS Code](https://code.visualstudio.com/docs/agent-customization/agent-skills)・[Cursor](https://cursor.com/docs/skills)・[Gemini CLI](https://geminicli.com/docs/cli/skills/)・[Google Antigravity](https://antigravity.google/docs/skills)・[Devin Desktop](https://docs.devin.ai/desktop/cascade/skills)・[OpenCode](https://opencode.ai/docs/skills)・[Cline](https://docs.cline.bot/customization/skills)・[Kiro](https://kiro.dev/docs/skills/)・[JetBrains Junie](https://junie.jetbrains.com/docs/agent-skills.html)・[Roo Code](https://roocodeinc.github.io/Roo-Code/features/skills/)・[skills](https://github.com/vercel-labs/skills)・[gh skill](https://cli.github.com/manual/gh_skill_install)

## 功能

### 開發模式：寫程式、查問題

- 「幫我用 TypeScript 寫一個每天抓 Threads 貼文數據的排程，token 要能自動續期。」
- 「幫我寫一個 Python 腳本，每 10 分鐘把貼文底下含廣告關鍵字的留言隱藏起來。」

Claude 會沿用專案現有的語言和寫法（Node.js/TypeScript、Python、C#、Go 等；沒有專案時用 Python），並把文件的規則直接寫進程式：

- token 和 App secret 從環境變數或密鑰管理服務讀取，不寫死在程式裡，也不寫進 log。
- 發文走完整流程：建立 container → 等處理完成（處理失敗、過期、逾時都有處理）→ 發佈 → 取得貼文網址。
- 送出前先在本機檢查字數、連結數和功能衝突，不浪費 API 配額。
- 用 cursor 翻頁；4xx 錯誤不盲目重試，遇到流量限制就延後再試。

### 代操作模式：直接操作你的帳號

- 「幫我發一則 Threads：『週末限定！新品咖啡豆 9 折』，附一個投票問大家喜歡淺焙還是深焙。」
- 「我最近 5 篇貼文的瀏覽數和按讚數各是多少？」
- 「把我最新一篇貼文底下提到『加賴』的留言隱藏起來。」

Claude 會依序：

1. **找 token**：先看環境變數 `THREADS_ACCESS_TOKEN`，再看專案資料夾裡的 `.env`，都沒有就請你設定（見[設定](#設定)）。
2. **確認帳號**：呼叫 `GET /me`，告訴你接下來要操作哪個帳號。
3. **檢查內容**：字數、連結數、功能衝突（例如限時貼文不能附投票）。也會提醒可能讓貼文達不到目的的地方，例如週二發的 24 小時限時貼文，撐不到它要宣傳的週末。
4. **等你確認**：發文、回覆、轉發、刪文、隱藏留言之前，先列出帳號、完整內文、媒體網址和每個參數，等你明確同意。只是查資料就不需要確認。
5. **執行並回報**：用技能內建的 Python 用戶端執行，回報貼文 ID 和網址；失敗時說明原因和修正方式，不會盲目重試。

代操作需要電腦上有 Python 3.8 以上。Claude 應用程式的程式碼執行環境預設只連得到套件來源，連不到 Threads API，所以在 App 裡代操作時，Claude 會把指令和參數準備好，交給你在自己的電腦上執行。

### 嵌入貼文：把 Threads 貼文放上網站

- 「我用 innerHTML 把 Threads 嵌入碼塞進網頁，結果都只顯示『在 Threads 查看』的連結框，要怎麼修？」
- 「幫我做一面 60 則精選貼文的展示牆，並每週自動檢查哪些貼文已經被刪掉。」

Claude 會：

- 用 oEmbed 取得嵌入碼（2026 年 3 月起不需要 token），或從驗證過的貼文網址組出嵌入標記，不把存下來的 HTML 直接用 innerHTML 塞進頁面。
- 整頁只載入一次 embed.js，新增貼文後呼叫 `window.instgrm.Embeds.process()`；也會提醒 CSP 要允許 `https://www.threads.com` 的 script 和 iframe。
- 一頁放很多則時分頁或依序載入，避免被 Threads 限流；依實際載入結果判斷成敗，失敗的貼文換成連到原文的備援卡片，連續失敗就暫停一段時間再繼續。
- 定期檢查貼文是否還在時用 oEmbed，只在回 `code 24`（Media Not Found）時移除，其他錯誤都當成暫時性問題。

embed.js 的載入方式官方沒有文件，這部分來自 2026 年 10 月實際讀取的 embed.js 程式碼，以及實際上線的貼文展示網站的經驗，Meta 之後可能改變。

### 裝了有什麼差別

Claude 本身就懂 Threads API 的基本用法，但不少規則藏在文件細節或近期的 changelog 裡。測試時，沒裝技能的 Claude 犯過下面這些錯，裝了技能後都沒有出現：

- 不確定限時貼文（ghost post）能不能附投票，還提供「直接送出去試試看」的選項。文件寫明限時貼文唯一支援的附加功能是文字防雷（text spoiler），不能附投票。
- 說 `profile_lookup` 只查得到粉絲 1,000 人以上的帳號，或完全沒提門檻。這個門檻在 2025 年 11 月已經降到 100。
- 先對巢狀回覆本身呼叫隱藏，失敗才改處理上層留言。API 只能隱藏第一層留言，而且會連同底下整串一起隱藏。
- 翻頁只看 `paging.next`。文件寫明貼文列表的回應不會有這個欄位，照文件的說法這樣只會抓到第一頁。
- 續期 token 時沒檢查文件規定的條件：token 要發出滿 24 小時、而且還沒過期才能續期。
- 以為 embed.js 只會在載入時掃描一次頁面，於是把每則貼文各包進一個 iframe 頁面。其實新增貼文後呼叫 `window.instgrm.Embeds.process()`，embed.js 就會重新掃描。
- 以為要檢查貼文是否被刪就得有 Meta App 和 token，改去爬 threads.com 的頁面。oEmbed 從 2026 年 3 月起不需要 token，貼文不存在時會回明確的 `code 24`。

技能也會指出官方範例裡不能照抄的錯誤（例如 GET 請求用 `curl -F` 送出）；遇到文件沒寫清楚或互相矛盾的地方，會照實說明，不會自行假設。

## 設定

### 環境變數

| 變數 | 用途 | 預設值 |
|---|---|---|
| `THREADS_ACCESS_TOKEN` | 代操作和參考用戶端使用的 Threads 使用者 token；也可以寫在專案資料夾的 `.env` | 無，代操作時必填 |
| `THREADS_APP_ID`、`THREADS_APP_SECRET` | 開發模式產生的 OAuth、token 交換程式讀取的 Threads App ID 與密鑰（不是 Facebook 那一組） | 無 |
| `THREADS_API_BASE` | 參考用戶端呼叫的 API 位址 | `https://graph.threads.net/v1.0` |

設定 token（擇一）：

- macOS／Linux：啟動 AI 工具前先執行 `export THREADS_ACCESS_TOKEN="<你的 token>"`
- Windows PowerShell：啟動 AI 工具前先執行 `$env:THREADS_ACCESS_TOKEN="<你的 token>"`
- 在專案資料夾的 `.env` 寫一行 `THREADS_ACCESS_TOKEN=<你的 token>`，並把 `.env` 加進 `.gitignore`

技能會要求 Claude 只透過環境變數把 token 交給要執行的指令，不寫進對話、程式或 commit。

### 取得 token 與權限

還沒有 token 的話，直接問 Claude「怎麼取得 Threads API 的 access token」，它會帶你建立 Meta App（使用案例選「Access the Threads API」）、把帳號加成 Threads 測試人員、走 OAuth 流程，再換成效期約 60 天的長效 token；測試階段也可以用 Graph API Explorer 產生。

token 要有對應的權限：

| 操作 | 權限 |
|---|---|
| 所有呼叫 | `threads_basic` |
| 發文 | `threads_content_publish` |
| 回覆、隱藏留言、審核回覆 | `threads_manage_replies`（發回覆還要 `threads_content_publish`） |
| 讀取留言 | `threads_read_replies` |
| 查數據 | `threads_manage_insights` |
| 刪文 | `threads_delete` |
| 關鍵字與主題標籤搜尋 | `threads_keyword_search` |
| 提及 | `threads_manage_mentions` |
| 地點搜尋與標記 | `threads_location_tagging` |
| 查詢公開帳號 | `threads_profile_discovery` |
| 同步分享到 Instagram 限時動態 | `threads_share_to_instagram` |

權限在 App Review 通過前只能用在自己和測試人員的帳號，部分功能的結果也會受限（例如關鍵字搜尋只找得到自己的貼文）。

## 文件

技能本體是 [`threads-api/SKILL.md`](threads-api/SKILL.md)，共 14 節：

| 節 | 內容 |
|---|---|
| 1 | 核心觀念：API 位址、兩步驟發文、container ID 和 media ID 的差別、寫入與讀取用的列舉值不同 |
| 2–3 | 開發模式、代操作模式的工作流程 |
| 4 | 發文：各類貼文的流程、參數表、功能相容性、字數與媒體規格、container 狀態 |
| 5 | 讀取與搜尋：個人檔案、貼文、提及、公開帳號、關鍵字與主題標籤搜尋、地點、翻頁 |
| 6 | 回覆與留言管理：讀取、隱藏、回覆審核 |
| 7 | 數據（Insights）：單篇貼文與帳號層級指標 |
| 8 | 權限、App Review、OAuth、token 續期 |
| 9 | 配額與流量限制 |
| 10 | Webhook |
| 11 | 嵌入貼文：oEmbed、embed.js 的載入方式、大量嵌入時的節流與失敗處理；Web Intents |
| 12 | 疑難排解：常見錯誤的原因和修法 |
| 13 | 官方範例裡不能照抄的錯誤 |
| 14 | 參考用戶端 [`scripts/threads_client.py`](threads-api/scripts/threads_client.py) 的用法與 spec 範例 |

除了標成 *(practice)* 的工程建議，以及標成 *(observed)* 的實測結果，其餘內容都出自官方文件。

歷次變動記錄在 [CHANGELOG.md](CHANGELOG.md)。

### 參考用戶端

參考用戶端是 [`threads-api/scripts/threads_client.py`](threads-api/scripts/threads_client.py)，只用 Python 標準函式庫（3.8 以上），不必安裝套件，用法寫在 SKILL.md 第 14 節。代操作時 Claude 直接執行它呼叫 API；開發模式則讀它的邏輯，改寫成你專案的語言。想自己用的話，直接執行這個檔案，token 從環境變數 `THREADS_ACCESS_TOKEN` 或目前資料夾的 `.env` 讀取。下面的例子在 repo 根目錄執行，裝在技能資料夾的話換成那裡的路徑（Windows 把 `python3` 換成 `python`）：

```bash
python3 threads-api/scripts/threads_client.py get me fields=id,username   # 確認帳號
python3 threads-api/scripts/threads_client.py check spec.json             # 只在本機檢查內容，不呼叫 API
python3 threads-api/scripts/threads_client.py publish spec.json           # 檢查 → 建立 container → 等處理完成 → 發佈 → 印出網址
python3 threads-api/scripts/threads_client.py delete <media-id>           # 刪文，無法復原
```

`spec.json` 放 container 的參數，例如一則附投票的貼文：

```json
{"media_type": "TEXT", "text": "淺焙還是深焙？", "poll_attachment": {"option_a": "淺焙", "option_b": "深焙"}}
```

## 測試結果

用同一個模型比較「有技能」和「沒技能」：每題在兩種設定下各跑一次，再由沒參與作答的評分者，依事先寫好的檢查項目逐條判定。每輪之間依評分意見修改技能，共跑七輪；第 4 輪是技能加入嵌入貼文的內容後，只測新增的第 6 題，第 5 輪只測新增的第 7–10 題，第 6 輪重跑第 2、4、7、8 題，驗證 webhook 去重和 `debug_token` 的修改，第 7 輪則在參考用戶端搬到 `scripts/threads_client.py` 之後重跑全部 10 題。題目和檢查項目在 [`evals/evals.json`](evals/evals.json)。

每格是通過的檢查項目數，格式為「有技能 vs 沒技能」：

| 題目 | 第 1 輪 | 第 2 輪 | 第 3 輪 | 第 4 輪 | 第 5 輪 | 第 6 輪 | 第 7 輪 |
|---|---|---|---|---|---|---|---|
| 1. Python 輪播貼文（兩張圖＋一支影片） | 8/8 vs 8/8 | — | — | — | — | — | 8/8 vs 8/8 |
| 2. TypeScript 每日數據排程與 token 續期 | 9/9 vs 7/9 | 9/9 vs 7/9 | 9/9 vs 9/9 | — | — | 9/9 vs 8/9 | 9/9 vs 7/9 |
| 3. 代發附投票的限時貼文 | 6/6 vs 3/6 | 7/7 vs 4/7 | 7/7 vs 5/7 | — | — | — | 7/7 vs 6/7 |
| 4. 搜尋、地點、查帳號結果異常的原因 | — | 6/6 vs 5/6 | 6/6 vs 5/6 | — | — | 6/6 vs 5/6 | 7/7 vs 5/7 |
| 5. 自動隱藏含關鍵字的留言 | — | 7/7 vs 6/7 | 7/7 vs 6/7 | — | — | — | 7/7 vs 6/7 |
| 6. 60 則貼文牆與每週檢查被刪貼文 | — | — | — | 8/8 vs 2/8 | — | — | 8/8 vs 3/8 |
| 7. FastAPI 接收留言與提及的 webhook | — | — | — | — | 8/8 vs 8/8 | 8/8 vs 6/8 | 8/8 vs 6/8 |
| 8. Express 的 OAuth 登入與長期 token 續期 | — | — | — | — | 8/8 vs 7/8 | 8/8 vs 7/8 | 8/8 vs 7/8 |
| 9. 審查一段出錯的 Python 發文程式 | — | — | — | — | 8/8 vs 6/8 | — | 8/8 vs 6/8 |
| 10. 隔天早上 8 點代發含 emoji 的串文 | — | — | — | — | 7/7 vs 6/7 | — | 7/7 vs 5/7 |
| **平均通過率** | **100% vs 76%** | **100% vs 76%** | **100% vs 85%** | **100% vs 25%** | **100% vs 87%** | **100% vs 84%** | **100% vs 77%** |

- 平均通過率是各題通過率的平均。第 1 題兩邊都拿滿分、分不出差別，所以第 2 輪起改用第 2–5 題；第 3 題從第 2 輪起多了一個檢查項目。第 4 題從第 7 輪起多了第 7 個檢查項目。
- 每題每種設定只跑一次，樣本很小，數字只能看方向。例如第 2 題沒技能的版本前兩輪都在翻頁和 token 續期上失分，第 3 輪卻拿到滿分。
- 沒技能時的失分幾乎都是不知道文件裡的規則，而不是程式寫不出來；「裝了有什麼差別」列的例子都來自這些測試。第 5 輪沒技能的設定可以上網查官方文件，也實際查了，差距因此縮小到 100% vs 87%。第 6 輪兩種設定都不能上網，有技能 31 項全部通過。第 7 輪同樣不能上網，重跑全部 10 題，有技能 77 項全部通過，沒技能平均 77%；參考用戶端搬出 SKILL.md 之後，沒有任何一題退步。

各輪的評測設定、耗時與 token 用量、每個失分項目的原因，見 [benchmark 摘要](evals/BENCHMARK.md)；逐條判定和評分者附的證據在 [evals/benchmark.json](evals/benchmark.json)。

## 已知限制

- 內建用戶端只在模擬的 API 上測過，還沒有對真實帳號實際發文。
- 測試只在 Claude 上跑過，其他工具應該能照同樣的流程運作，但沒有實測。
- Claude 應用程式預設連不到 Threads API，代操作要在自己的電腦上執行。代操作也需要工具能執行終端機指令。
- 官方文件有幾處互相矛盾或沒說清楚，例如地點搜尋要用 `q` 還是 `query`、限時貼文加上不支援的功能時 API 會報錯還是直接忽略、webhook 需不需要 App Review。技能遇到時會照實說明，不會自行假設。
- embed.js 的載入行為（一次最多載入 3 則、`instgrm.Embeds.process()`、`data-theme` 等）官方沒有文件，是 2026 年 10 月觀察到的，Meta 可能隨時改變。
- 文件快照到 2026-08-18，之後的變動請以[官方 changelog](https://developers.facebook.com/documentation/threads/changelog) 為準。
- 不涵蓋 Threads 廣告（屬於 Marketing API）。

## 參與貢獻

歡迎回報規則錯誤、補充易錯點或改善網站。

- 流程、repo 結構與修改時要一起更新的地方：[參與貢獻指南](.github/CONTRIBUTING.md)
- [行為準則](.github/CODE_OF_CONDUCT.md)
- 資安問題請照[資安政策](.github/SECURITY.md)私下通報，不要開公開 issue。
- 介紹網站的無障礙狀況：[無障礙聲明](.github/ACCESSIBILITY.md)

## 授權

[MIT](LICENSE)
