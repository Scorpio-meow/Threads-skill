# Threads API Skill

[繁體中文](README.md) | [English](README.en.md) | **日本語** | [한국어](README.ko.md)

AI アシスタントが Meta Threads API を使いこなせるようにするスキルです。連携コードの作成・レビュー・デバッグを手伝うほか、あなたのトークンを使って投稿、リプライ、インサイトの取得を直接行うこともできます。

- [Agent Skills](https://agentskills.io) 形式（フォルダ 1 つと `SKILL.md` 1 ファイル）なので、Claude Code、Claude アプリ、OpenAI Codex、Gemini CLI、GitHub Copilot、Cursor、Windsurf、OpenCode にインストールできます。
- 内容は Meta の公式ドキュメントをもとにまとめたもので、2026-08-12 までの changelog を反映しています。
- スキル本体は英語で書かれていますが、AI アシスタントはあなたが使っている言語で返答します。以下では Claude を例に説明します。
- Meta 公式のプロジェクトではありません。

## クイックスタート

[`skills`](https://github.com/vercel-labs/skills) コマンドを使えば 1 行でインストールできます。PC にある AI ツールを検出し、それぞれ対応するフォルダに配置してくれます。

```bash
bunx skills add Scorpio-meow/Threads-skill --skill threads-api -g
```

- `-g` を付けるとユーザーディレクトリにインストールされ、すべてのプロジェクトで使えます。`-g` を外すと現在のプロジェクトにだけインストールされます。
- 特定のツールにだけインストールしたい場合は `-a` を付けます（例：`-a claude-code -a codex`）。
- Bun がなければ、`bunx` を `npx` に置き換えても動きます。

インストール後、Threads API に関する質問をすると自動で有効になります。たとえば次のような質問です。

> keyword_search で自分の投稿しかヒットしないんだけど、どこが間違ってる？

各ツールでの手動インストール方法は次の節を参照してください。

## インストール

### 各ツールのスキルフォルダ

手動でインストールするには、`threads-api` フォルダをツールが読み込むスキルフォルダにコピーし、`SKILL.md` が `<スキルフォルダ>/threads-api/SKILL.md` に置かれるようにします。ユーザーフォルダはその PC 上のすべてのプロジェクトで使われます。プロジェクトフォルダはプロジェクトのルートに置くもので、commit すればチームで共有できます。

| ツール | ユーザーフォルダ | プロジェクトフォルダ | 手動呼び出し |
|---|---|---|---|
| Claude Code | `~/.claude/skills/` | `.claude/skills/` | `/threads-api` |
| OpenAI Codex（CLI、IDE 拡張機能） | `~/.agents/skills/` | `.agents/skills/` | `/skills` または `$threads-api` |
| Gemini CLI | `~/.gemini/skills/` または `~/.agents/skills/` | `.gemini/skills/` または `.agents/skills/` | `/skills list` で読み込まれているか確認できます |
| GitHub Copilot（VS Code、Copilot CLI） | `~/.copilot/skills/` または `~/.agents/skills/` | `.github/skills/` または `.agents/skills/` | `/threads-api` |
| Cursor | `~/.cursor/skills/` または `~/.agents/skills/` | `.cursor/skills/` または `.agents/skills/` | Agent のチャットで `/` を入力して選択 |
| Windsurf | `~/.codeium/windsurf/skills/` | `.windsurf/skills/` | `@threads-api` |
| OpenCode | `~/.config/opencode/skills/` | `.opencode/skills/` または `.agents/skills/` | — |

Windows では `~` はユーザーフォルダ（`%USERPROFILE%`）を指します。どのツールも会話の内容に関係があればスキルを自動で使います。「手動呼び出し」列は、明示的に使いたいときの方法です。Codex、Gemini CLI、Copilot、Cursor を併用している場合は、`~/.agents/skills/` に 1 つ置くだけで共有できます。

以下は `~/.agents/skills/` にコピーする例です。ほかのツールで使う場合は、`TARGET` を上の表のパスに置き換えてください。

macOS／Linux：

```bash
git clone https://github.com/Scorpio-meow/Threads-skill.git
TARGET=~/.agents/skills
mkdir -p "$TARGET"
cp -r Threads-skill/threads-api "$TARGET/"
```

Windows PowerShell：

```powershell
git clone https://github.com/Scorpio-meow/Threads-skill.git
$TARGET = "$HOME\.agents\skills"
New-Item -ItemType Directory -Force $TARGET | Out-Null
Copy-Item -Recurse -Force Threads-skill\threads-api "$TARGET\"
```

更新するときは、`Threads-skill` フォルダで `git pull` を実行してからもう一度コピーします。`skills` コマンドでインストールした場合は `bunx skills update` を実行してください。ツールが新しいスキルを認識しない場合は、一度再起動すれば反映されます。

### Claude アプリ（Web 版／デスクトップ版）

1. コード実行を有効にします。Free、Pro、Max プランでは **Settings > Capabilities** で「Code execution and file creation」をオンにします。Team、Enterprise プランでは、組織のオーナーが組織設定で「Code execution and file creation」と「Skills」をオンにする必要があります。
2. `threads-api` フォルダ**だけ**を ZIP に圧縮します。ZIP の最上位は `threads-api/` フォルダにしてください。GitHub の「Download ZIP」でダウンロードされるのはリポジトリ全体（最上位が `Threads-skill-main/`）なので、そのままではアップロードできません。
3. **Customize > Skills** で **+** → **Create skill** → **Upload a skill** の順に進み、ZIP をアップロードします。

画面が変わっている場合は[公式ヘルプ](https://support.claude.com/en/articles/12512180-using-skills-in-claude)を参照してください。

### 各ツールの公式ドキュメント

パスや画面が変わっている場合は、公式ドキュメントを優先してください：[Claude Code](https://code.claude.com/docs/en/skills)・[OpenAI Codex](https://learn.chatgpt.com/docs/build-skills)・[Gemini CLI](https://geminicli.com/docs/cli/skills/)・[GitHub Copilot](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills)・[VS Code](https://code.visualstudio.com/docs/agent-customization/agent-skills)・[Cursor](https://cursor.com/docs/skills)・[Windsurf](https://docs.devin.ai/desktop/cascade/skills)・[OpenCode](https://opencode.ai/docs/skills)

## 機能

### 開発モード：コードを書く・問題を調べる

- 「TypeScript で、Threads の投稿データを毎日取得するスケジュール処理を書いて。トークンは自動で延長されるようにしたい。」
- 「投稿についた広告キーワードを含むリプライを、10 分ごとに非表示にする Python スクリプトを書いて。」

Claude はプロジェクトで使われている言語や書き方（Node.js/TypeScript、Python、C#、Go など。プロジェクトがない場合は Python）に合わせ、ドキュメントのルールをそのままコードに落とし込みます。

- トークンと App secret は環境変数やシークレット管理サービスから読み込み、コードにハードコードしたりログに出力したりしません。
- 投稿は一連の手順をすべて踏みます：container を作成 → 処理の完了を待つ（処理失敗・期限切れ・タイムアウトにも対応）→ 公開 → 投稿の URL を取得。
- 送信前にローカルで文字数、リンク数、機能の競合をチェックし、API のクォータを無駄にしません。
- ページングには cursor を使います。4xx エラーはむやみにリトライせず、レート制限にかかったら時間をおいて再試行します。

### 代行操作モード：あなたのアカウントを直接操作する

- 「Threads に投稿して：『週末限定！新しいコーヒー豆が 10% オフ』。浅煎りと深煎りどっちが好きか聞くアンケートも付けて。」
- 「最近の投稿 5 件の閲覧数といいね数をそれぞれ教えて。」
- 「最新の投稿についたリプライのうち、『LINE 追加』に触れているものを非表示にして。」

Claude は次の順に進めます。

1. **トークンを探す**：まず環境変数 `THREADS_ACCESS_TOKEN` を確認し、次にプロジェクトフォルダの `.env` を確認します。どちらにもなければ設定をお願いします（[設定](#設定)を参照）。
2. **アカウントを確認する**：`GET /me` を呼び出し、これから操作するアカウントを伝えます。
3. **内容をチェックする**：文字数、リンク数、機能の競合（たとえばゴースト投稿にはアンケートを付けられない）を確認します。投稿の目的を果たせなくなりそうな点も指摘します。たとえば火曜日に 24 時間のゴースト投稿をしても、宣伝したい週末までは残りません。
4. **確認を待つ**：投稿、リプライ、リポスト、投稿の削除、リプライの非表示を行う前に、アカウント、本文全体、メディアの URL、各パラメータを一覧で示し、明確な同意を待ちます。データを取得するだけなら確認は不要です。
5. **実行して報告する**：スキルに組み込まれた Python クライアントで実行し、投稿 ID と URL を報告します。失敗した場合は原因と対処法を説明し、むやみにリトライはしません。

代行操作には、PC に Python 3.8 以上が必要です。Claude アプリのコード実行環境は、デフォルトではパッケージの取得元にしか接続できず、Threads API には接続できません。そのため、アプリで代行操作を頼んだ場合は、Claude がコマンドとパラメータを用意し、あなた自身の PC で実行してもらう形になります。

### 導入すると何が変わるか

Claude はもともと Threads API の基本的な使い方を知っていますが、ルールの多くはドキュメントの細部や最近の changelog に埋もれています。テストでは、スキルなしの Claude が次のようなミスをしましたが、スキルを導入した状態ではどれも起きませんでした。

- ゴースト投稿（ghost post）にアンケートを付けられるか自信がなく、「とりあえず送ってみる」という選択肢まで提示しました。ドキュメントには、ゴースト投稿で唯一使える追加機能はテキストのネタバレ防止（text spoiler）で、アンケートは付けられないと明記されています。
- `profile_lookup` で調べられるのはフォロワー 1,000 人以上のアカウントだけだと説明するか、条件にまったく触れませんでした。この条件は 2025 年 11 月に 100 人まで引き下げられています。
- まずネストされたリプライそのものに非表示を実行し、失敗してから上位のリプライを処理しました。API で非表示にできるのは最上位のリプライだけで、その下のスレッドもまとめて非表示になります。
- ページングで `paging.next` しか見ていませんでした。ドキュメントには投稿一覧のレスポンスにこのフィールドは含まれないと明記されており、ドキュメントどおりなら最初のページしか取得できません。
- トークンの延長時に、ドキュメントで定められた条件を確認していませんでした。延長できるのは、発行から 24 時間以上経過していて、まだ期限切れになっていないトークンだけです。

スキルは、公式サンプルのうちそのまま真似してはいけない誤り（たとえば GET リクエストを `curl -F` で送っている箇所）も指摘します。ドキュメントがあいまいな箇所や矛盾している箇所に当たったときは、勝手に推測せず、そのとおりに説明します。

## 設定

### 環境変数

| 変数 | 用途 | デフォルト値 |
|---|---|---|
| `THREADS_ACCESS_TOKEN` | 代行操作とリファレンスクライアントが使う Threads のユーザートークン。プロジェクトフォルダの `.env` に書くこともできます | なし（代行操作では必須） |
| `THREADS_APP_ID`、`THREADS_APP_SECRET` | 開発モードで生成する OAuth・トークン交換のコードが読み込む Threads の App ID とシークレット（Facebook 側のものではありません） | なし |
| `THREADS_API_BASE` | リファレンスクライアントが呼び出す API のベース URL | `https://graph.threads.net/v1.0` |

トークンの設定方法（いずれか 1 つ）：

- macOS／Linux：AI ツールを起動する前に `export THREADS_ACCESS_TOKEN="<あなたのトークン>"` を実行します
- Windows PowerShell：AI ツールを起動する前に `$env:THREADS_ACCESS_TOKEN="<あなたのトークン>"` を実行します
- プロジェクトフォルダの `.env` に `THREADS_ACCESS_TOKEN=<あなたのトークン>` と 1 行書き、`.env` を `.gitignore` に追加します

スキルは Claude に対し、トークンは環境変数経由でのみ実行するコマンドに渡し、会話、コード、commit には書き込まないよう求めています。

### トークンと権限の取得

まだトークンがない場合は、Claude に「Threads API のアクセストークンはどうやって取得するの？」と聞いてください。Meta App の作成（ユースケースは「Access the Threads API」を選択）、アカウントを Threads テスターとして追加、OAuth フロー、有効期間が約 60 日の長期トークンへの交換まで案内してくれます。テスト段階なら Graph API Explorer で生成することもできます。

トークンには、操作に応じた権限が必要です。

| 操作 | 権限 |
|---|---|
| すべての呼び出し | `threads_basic` |
| 投稿 | `threads_content_publish` |
| リプライ、リプライの非表示、リプライの承認 | `threads_manage_replies`（リプライを投稿するには `threads_content_publish` も必要） |
| リプライの取得 | `threads_read_replies` |
| インサイトの取得 | `threads_manage_insights` |
| 投稿の削除 | `threads_delete` |
| キーワード・ハッシュタグ検索 | `threads_keyword_search` |
| メンション | `threads_manage_mentions` |
| 場所の検索とタグ付け | `threads_location_tagging` |
| 公開アカウントの検索 | `threads_profile_discovery` |
| Instagram ストーリーズへの同時シェア | `threads_share_to_instagram` |

App Review を通過するまでは、権限は自分とテスターのアカウントにしか使えず、一部の機能は結果も制限されます（たとえばキーワード検索では自分の投稿しか見つかりません）。

## ドキュメント

スキル本体は [`threads-api/SKILL.md`](threads-api/SKILL.md) で、全 14 節あります。

| 節 | 内容 |
|---|---|
| 1 | 基本概念：API のベース URL、2 段階の投稿、container ID と media ID の違い、書き込み用と読み取り用で列挙値が異なること |
| 2–3 | 開発モード・代行操作モードのワークフロー |
| 4 | 投稿：投稿の種類ごとの手順、パラメータ一覧、機能の互換性、文字数とメディアの仕様、container のステータス |
| 5 | 取得と検索：プロフィール、投稿、メンション、公開アカウント、キーワード・ハッシュタグ検索、場所、ページング |
| 6 | リプライの管理：取得、非表示、リプライの承認 |
| 7 | インサイト（Insights）：投稿単位とアカウント単位の指標 |
| 8 | 権限、App Review、OAuth、トークンの延長 |
| 9 | クォータとレート制限 |
| 10–11 | Webhook、oEmbed、Web Intents |
| 12 | トラブルシューティング：よくあるエラーの原因と対処法 |
| 13 | 公式サンプルのうちそのまま真似してはいけない誤り |
| 14 | リファレンスクライアント `threads_client.py` |

*(practice)* と付いたエンジニアリング上の推奨事項を除き、内容はすべて公式ドキュメントに基づいています。

### リファレンスクライアント

第 14 節の `threads_client.py` は Python の標準ライブラリ（3.8 以上）だけで動くため、パッケージのインストールは不要です。代行操作では Claude がこれを使って API を呼び出し、開発モードではそのロジックを参考に、プロジェクトの言語で書き直します。自分で使いたい場合は、そのコードを `threads_client.py` として保存してください（Windows では `python3` を `python` に置き換えます）。

```bash
python3 threads_client.py get me fields=id,username   # アカウントを確認
python3 threads_client.py check spec.json             # ローカルで内容をチェックするだけで、API は呼び出さない
python3 threads_client.py publish spec.json           # チェック → container を作成 → 処理完了を待つ → 公開 → URL を表示
python3 threads_client.py delete <media-id>           # 投稿を削除（元に戻せない）
```

`spec.json` には container のパラメータを書きます。たとえばアンケート付きの投稿なら次のとおりです。

```json
{"media_type": "TEXT", "text": "浅煎りと深煎り、どっち？", "poll_attachment": {"option_a": "浅煎り", "option_b": "深煎り"}}
```

## テスト結果

同じモデルで「スキルあり」と「スキルなし」を比較しました。各問題を両方の設定で 1 回ずつ実行し、回答に関わっていない採点者が、あらかじめ用意したチェック項目に沿って 1 項目ずつ判定しています。ラウンドの合間に採点者の指摘をもとにスキルを修正し、計 3 ラウンド実施しました。問題とチェック項目は [`evals/evals.json`](evals/evals.json) にあります。

各セルは合格したチェック項目の数で、「スキルあり vs スキルなし」の形式です。

| 問題 | ラウンド 1 | ラウンド 2 | ラウンド 3 |
|---|---|---|---|
| 1. Python でカルーセル投稿（画像 2 枚＋動画 1 本） | 8/8 vs 8/8 | — | — |
| 2. TypeScript で毎日のインサイト取得スケジュールとトークン延長 | 9/9 vs 7/9 | 9/9 vs 7/9 | 9/9 vs 9/9 |
| 3. アンケート付きゴースト投稿の代行 | 6/6 vs 3/6 | 7/7 vs 4/7 | 7/7 vs 5/7 |
| 4. 検索・場所・アカウント検索で結果がおかしい原因 | — | 6/6 vs 5/6 | 6/6 vs 5/6 |
| 5. キーワードを含むリプライの自動非表示 | — | 7/7 vs 6/7 | 7/7 vs 6/7 |
| **平均合格率** | **100% vs 76%** | **100% vs 76%** | **100% vs 85%** |

- 平均合格率は、各問題の合格率の平均です。問題 1 は両方とも満点で差が出なかったため、ラウンド 2 からは問題 2–5 を使っています。問題 3 はラウンド 2 からチェック項目が 1 つ増えています。
- 各問題・各設定とも 1 回しか実行しておらずサンプルが少ないため、数字は傾向を見る程度にとどめてください。たとえば問題 2 のスキルなし版は、最初の 2 ラウンドではページングとトークン延長で失点しましたが、ラウンド 3 では満点でした。
- スキルなしでの失点はほぼすべて、コードが書けないからではなく、ドキュメントのルールを知らないことが原因でした。「導入すると何が変わるか」に挙げた例は、すべてこのテストから取っています。

各ラウンドの評価設定、所要時間とトークン使用量、失点した項目ごとの原因は [benchmark の概要](evals/BENCHMARK.ja.md)を、項目ごとの判定と採点者が添えた根拠は [evals/benchmark.json](evals/benchmark.json) を参照してください。

## 既知の制限

- 組み込みクライアントはモックの API でしかテストしておらず、実際のアカウントでの投稿はまだ試していません。
- テストは Claude でしか実行していません。ほかのツールでも同じ流れで動くはずですが、実際には検証していません。
- Claude アプリはデフォルトでは Threads API に接続できないため、代行操作は自分の PC で実行する必要があります。また、代行操作にはツールがターミナルのコマンドを実行できることが必要です。
- 公式ドキュメントには、互いに矛盾していたりあいまいだったりする箇所がいくつかあります。たとえば、場所の検索で `q` と `query` のどちらを使うのか、ゴースト投稿に非対応の機能を付けたときに API がエラーを返すのか無視するのか、webhook に App Review が必要かどうか、などです。スキルはこうした箇所に当たったとき、勝手に推測せず、そのとおりに説明します。
- ドキュメントは 2026-08-12 時点のスナップショットです。それ以降の変更は[公式 changelog](https://developers.facebook.com/documentation/threads/changelog) を参照してください。
- Threads 広告（Marketing API の範囲）は対象外です。

## コントリビューション

- ルールに誤りがある場合や公式ドキュメントが更新された場合は、`threads-api/SKILL.md` を直接修正してください。公式ドキュメントに基づく内容は原文の意図どおりに書き、ドキュメントに書かれていないエンジニアリング上の経験則には *(practice)* を付けてください。
- 修正後は、Anthropic の skill-creator スキルを使って `evals/evals.json` に沿って「スキルあり vs スキルなし」の比較を再実行し、デグレしていないことを確認してから evals/BENCHMARK.md と evals/benchmark.json を更新してください。
- 間違えやすい新しいポイントを見つけたら、`evals/evals.json` に問題を追加できます。1 項目ずつ判定できるチェック項目も添えてください。
- README と benchmark の概要には繁体字中国語、英語、日本語、韓国語の 4 つの版があります。修正するときはすべての版を更新してください。

## ライセンス

ライセンスはまだ指定していません。
