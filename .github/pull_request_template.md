<!--
English / 日本語 / 한국어：在 PR 建立頁面的網址最後加上 &template=en.md、&template=ja.md 或 &template=ko.md（網址要有 ?quick_pull=1），就會換成對應語言的範本。
English: add &template=en.md to the end of the compare page URL (the URL needs ?quick_pull=1) to load the English template.
日本語：比較ページの URL の末尾に &template=ja.md を付けると（URL に ?quick_pull=1 が必要）、日本語のテンプレートになります。
한국어: 비교 페이지 URL 끝에 &template=ko.md를 붙이면(URL에 ?quick_pull=1 필요) 한국어 템플릿으로 바뀝니다.
-->

## 變更內容

<!-- 改了什麼、為什麼。有相關 issue 的話寫 Closes #編號。 -->

## 修改範圍

- [ ] 技能內容（`threads-api/SKILL.md`、`threads-api/scripts/`）
- [ ] 評測（`evals/`）
- [ ] 介紹網站（`docs/`）
- [ ] 說明文件（README、CHANGELOG、`.github/` 等）

## 依據

<!-- 改技能內容時，附上官方文件或 changelog 的連結；實測結果附上請求與回應，並移除 token。 -->

## 檢查清單

<!-- 不適用的項目請刪掉或寫明原因。 -->

- [ ] 出自官方文件的內容照原意寫；工程建議標成 *(practice)*，實測結果標成 *(observed)*
- [ ] 改了技能內容：已照 `evals/evals.json` 重跑「有技能 vs 沒技能」的比較，並更新 `evals/BENCHMARK*.md` 和 `evals/benchmark.json`
- [ ] 改了 `check()`：已同步修改 `docs/assets/js/client.js`，兩邊對同一組 spec 的結果一致
- [ ] 四種語言版本都已更新，或在上方註明需要協助翻譯的部分
- [ ] 已在四語版 `CHANGELOG*.md` 的「未發布」區塊記錄
- [ ] 新增或搬移文件時，已更新 `docs/llms.txt`
- [ ] 沒有附上 token、App secret 或其他私人資料
