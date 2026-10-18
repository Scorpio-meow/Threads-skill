# 參與貢獻

**繁體中文** | [English](CONTRIBUTING.en.md) | [日本語](CONTRIBUTING.ja.md) | [한국어](CONTRIBUTING.ko.md)

謝謝你願意幫忙。這個專案由三部分組成：給 AI 助理用的技能（`threads-api/SKILL.md`）、評測資料，以及介紹網站。參與前請先讀[行為準則](CODE_OF_CONDUCT.md)。

## 可以怎麼幫忙

| 想做的事 | 去哪裡 |
|---|---|
| 技能寫的和 Meta 官方文件或 API 的實際行為不一致，或漏了規則 | 開 issue，選「規則有誤、過時或缺漏」 |
| 安裝失敗、技能沒有啟用，或裝了技能 AI 助理還是出錯 | 開 issue，選「使用問題」；這類回報常常能變成新的評測題 |
| 介紹網站的錯字、翻譯、版面或無障礙問題 | 開 issue，選「網站問題」 |
| 用法問題、新功能的想法 | [Discussions](https://github.com/Scorpio-meow/Threads-skill/discussions) |
| 資安問題 | 不要公開，照[資安政策](SECURITY.md)私下通報 |

issue 和 PR 用繁中、英文、日文、韓文都可以。不論在哪裡發言，都不要貼出 token、App secret 或任何私人資料，包括你自己的。

## Repo 結構

| 路徑 | 內容 |
|---|---|
| [`threads-api/SKILL.md`](../threads-api/SKILL.md) | 技能本體，英文，共 14 節 |
| [`evals/evals.json`](../evals/evals.json) | 評測題目與檢查項目 |
| `evals/BENCHMARK*.md`、[`evals/benchmark.json`](../evals/benchmark.json) | 評測摘要（四語）與逐條判定 |
| [`docs/`](../docs/) | 介紹網站，GitHub Pages 從 `main` 的 `/docs` 發佈 |
| `README*.md` | 專案說明（四語） |
| [`CHANGELOG*.md`](../CHANGELOG.md) | 變更記錄（四語） |
| [`.github/`](./) | 社群檔案（這份貢獻指南、行為準則、資安政策、無障礙聲明，各有四語）、issue 表單與 PR 範本 |

## 修改技能

- 直接修改 `threads-api/SKILL.md`，內容用英文寫。
- 出自官方文件的內容照原意寫。文件沒寫、屬於工程經驗的建議標成 *(practice)*；文件沒寫、實際測試得到的行為標成 *(observed)*，並寫上觀察的年月。
- 官方文件互相矛盾或沒說清楚時，照實寫出來，不要自行假設。
- 第 14 節的參考用戶端 `threads_client.py` 只用 Python 標準函式庫，要能在 Python 3.8 以上執行。
- 網站的「送出前先檢查」是 `check()` 的 JS 移植版（[`docs/assets/js/client.js`](../docs/assets/js/client.js)）。改了 `check()` 要一起改 JS 版，並確認兩邊對同一組 spec 給出一樣的錯誤、警告、字數和連結數。

## 重跑評測

- 改了技能內容後，用 Anthropic 的 skill-creator 技能，照 `evals/evals.json` 重跑「有技能 vs 沒技能」的比較，確認沒有退步，再更新 `evals/BENCHMARK*.md` 和 `evals/benchmark.json`。
- 發現新的易錯點時，可以在 `evals/evals.json` 加一題，附上能逐條判定通過與否的檢查項目。
- 測試結果有變時，README 的「測試結果」和網站上的評測數字也要更新。

## 修改網站

- 純靜態網站，沒有建置步驟。直接用瀏覽器開 `docs/index.html` 就能預覽，或在 repo 根目錄執行 `bunx serve docs` 開本機伺服器。
- 繁中文字直接寫在 `docs/index.html`；英、日、韓文在 `docs/assets/js/lang/{en,ja,ko}.js`，用 `data-i18n` 的 key 對應。腳本產生的繁中訊息在 `docs/assets/js/lang/zh.js`。
- 網站也列了測試結果、文件快照日期和各節的重點數字，這些內容改了要一起更新。
- 修改網站時，不要讓 [ACCESSIBILITY.md](ACCESSIBILITY.md) 列出的支援項目退步。

## 文件與翻譯

- README、benchmark 摘要、變更記錄、這份貢獻指南、行為準則、資安政策、無障礙聲明，以及 issue 表單和 PR 範本，都有繁中、英文、日文、韓文四個版本，修改時請一併更新。不會寫某個語言的話，在 PR 裡說明，維護者會協助翻譯。
- 把變動記在 [CHANGELOG.md](../CHANGELOG.md) 的「未發布」區塊，英、日、韓文版也要一起更新。
- 新增或搬移文件時，一併更新 [`docs/llms.txt`](../docs/llms.txt) 的連結。

## 送出 PR

1. Fork 這個 repo，從 `main` 開一個新分支。
2. 一個 PR 只處理一件事。改技能內容時，在 PR 附上官方文件或 changelog 的連結；實測結果附上請求與回應，並移除 token。
3. commit 訊息沿用 [Conventional Commits](https://www.conventionalcommits.org/zh-hant/v1.0.0/) 格式，例如 `docs: 更新安裝說明`、`feat(site): 新增日文切換`。
4. 照 PR 範本的檢查清單逐項確認後送出。

## 授權

你貢獻的內容會以本專案的 [MIT 授權](../LICENSE)釋出。
