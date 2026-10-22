# 安全政策

**繁體中文** | [English](https://github.com/Scorpio-meow/Threads-skill/blob/HEAD/.github/SECURITY_en.md) | [日本語](https://github.com/Scorpio-meow/Threads-skill/blob/HEAD/.github/SECURITY_ja.md) | [한국어](https://github.com/Scorpio-meow/Threads-skill/blob/HEAD/.github/SECURITY_ko.md)

## 支援的版本

本專案沒有發布版本號，只維護 `main` 分支的最新內容，修正會直接合併到 `main`。用 `skills` 指令安裝的話，執行 `bunx skills update` 就能取得修正；手動安裝的話，重新複製一次 `threads-api` 資料夾。

## 回報漏洞

**請不要在公開的 Issue、Pull Request 或討論區揭露漏洞細節。**

請擇一管道私下回報：

1. **GitHub 私下回報（建議）**：到本專案的 **Security** 分頁按 **Report a vulnerability**，或直接開啟[私下回報表單](https://github.com/Scorpio-meow/Threads-skill/security/advisories/new)。內容只有你和維護者看得到。
2. **電子郵件**：無法使用 GitHub 時，寄到 [yao921024@gmail.com](mailto:yao921024@gmail.com)，主旨開頭加上 `[Security] Threads-skill`。電子郵件不是端對端加密，信裡先簡述問題就好，細節等收到回覆後再提供。

回報時請盡量附上：

- 受影響的檔案與段落，例如 SKILL.md 第幾節
- 重現步驟：使用的 AI 工具、模型和你的提問
- 可能的影響
- 修正建議（選填）

需要示範時請用假的值，不要附上真實的 token、App secret 或他人的資料。

## 處理流程與時限

本專案由個人維護，沒有漏洞獎勵，但會遵守以下時限：

| 階段 | 時限 |
|---|---|
| 確認收到並首次回覆 | 收到回報後 14 天內 |
| 公開漏洞細節 | 修正發布時，最晚在回報後 90 天 |

1. **確認收到**：回覆已收到，並說明初步評估；之後的處理進度都會更新在同一則回報裡。
2. **評估**：確認是否屬於漏洞、影響範圍與嚴重程度，必要時向你詢問細節；不屬於漏洞時會說明原因。
3. **修正**：在私下的 GitHub Security Advisory 中與你討論修正方式，你也可以在其中的私人分支提交修正。
4. **發布**：把修正合併到 `main`、公開 Security Advisory，適用時透過 GitHub 申請 CVE 編號，並記錄在 [CHANGELOG.md](https://github.com/Scorpio-meow/Threads-skill/blob/HEAD/CHANGELOG.md)。
5. **致謝**：你願意的話，會在 Advisory 中列名致謝。

修正發布前請不要公開漏洞細節。90 天內來不及修正時，會在期限前向你說明原因，並協商新的公開日期。

## 範圍

### 範圍內

- 技能的指示可能讓 AI 助理洩漏 access token 或 App secret，例如寫進對話、程式碼、log 或 commit。
- 技能的流程可能讓 AI 助理在使用者沒有明確同意時發文、回覆、刪文或隱藏留言，包括被貼文、留言等外部內容誘導（prompt injection）。
- 參考用戶端 `threads-api/scripts/threads_client.py` 的漏洞，例如在錯誤訊息或 log 印出 token。
- 技能教的寫法本身有漏洞，例如把 App secret 放進前端程式，或把未驗證的嵌入 HTML 直接塞進網頁。
- 介紹網站（`docs/`）的漏洞，例如 XSS。

### 不在範圍內

- Meta 或 Threads API 本身的漏洞：請回報到 [Meta Bug Bounty](https://bugbounty.meta.com/)。
- AI 工具（Claude Code、Codex 等）本身的漏洞：請回報給該工具的開發者。
- 你自己的 token 或 App secret 已經外洩：這不是本專案的漏洞，請立即撤銷該 token 的授權並重新產生；App secret 外洩的話，到 Meta 的應用程式後台重設。
