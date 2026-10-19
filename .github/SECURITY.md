# 資安政策

**繁體中文** | [English](/.github/SECURITY.en.md) | [日本語](/.github/SECURITY.ja.md) | [한국어](/.github/SECURITY.ko.md)

## 支援的版本

本專案沒有發布版本號，只維護 `main` 分支的最新內容，修正會直接合併到 `main`。用 `skills` 指令安裝的話，執行 `bunx skills update` 就能取得修正；手動安裝的話，重新複製一次 `threads-api` 資料夾。

## 通報範圍

- 技能的指示可能讓 AI 助理洩漏 access token 或 App secret，例如寫進對話、程式碼、log 或 commit。
- 技能的流程可能讓 AI 助理在使用者沒有明確同意時發文、回覆、刪文或隱藏留言，包括被貼文、留言等外部內容誘導（prompt injection）。
- 參考用戶端 `threads-api/scripts/threads_client.py` 的漏洞，例如在錯誤訊息或 log 印出 token。
- 技能教的寫法本身有漏洞，例如把 App secret 放進前端程式，或把未驗證的嵌入 HTML 直接塞進網頁。
- 介紹網站（`docs/`）的漏洞，例如 XSS。

## 不在範圍內

- Meta 或 Threads API 本身的漏洞：請通報到 [Meta Bug Bounty](https://bugbounty.meta.com/)。
- AI 工具（Claude Code、Codex 等）本身的漏洞：請通報給該工具的開發者。
- 你自己的 token 或 App secret 已經外洩：這不是本專案的漏洞，請立即撤銷該 token 的授權並重新產生；App secret 外洩的話，到 Meta 的應用程式後台重設。

## 如何通報

請不要開公開的 issue、PR 或 Discussion。

1. 到 repo 的 **Security** 分頁點選 **Report a vulnerability**，或直接開啟[私密通報表單](https://github.com/Scorpio-meow/Threads-skill/security/advisories/new)。通報內容只有你和維護者看得到。
2. 請附上受影響的檔案與段落（例如 SKILL.md 第幾節）、重現步驟（使用的 AI 工具、模型和你的提問）、可能的影響，修正建議可以選填。
3. 不要附上真實的 token、App secret 或他人的資料，需要示範時請用假的值。

## 處理流程

本專案由個人維護，會盡快回覆，處理進度都會更新在該則通報裡。確認問題後，會在 `main` 修正、發布 security advisory，並記錄在 [CHANGELOG.md](/CHANGELOG.md)。你同意的話，會在 advisory 裡致謝。
