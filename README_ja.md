# Threads API Skill

[繁體中文](README.md) | [English](README_en.md) | **日本語** | [한국어](README_ko.md)

AI アシスタントが Meta Threads API を使いこなせるようにするスキルです。連携コードの作成・レビュー・デバッグを手伝うほか、あなたのトークンを使って投稿、リプライ、インサイトの取得を直接行うこともできます。Threads の投稿を自分のサイトに埋め込む作業も手伝います。

- [Agent Skills](https://agentskills.io) 形式（フォルダ 1 つと `SKILL.md` 1 ファイル）なので、Claude Code、Claude アプリ、ChatGPT、OpenAI Codex、GitHub Copilot、Cursor、Gemini CLI、Devin Desktop（旧 Windsurf）、OpenCode など 10 種類以上のツールにインストールできます。
- 内容は Meta の公式ドキュメント（2026-10-23 に同期、2026-08-18 までの changelog を反映）をもとにまとめたものです。投稿の埋め込みについては、2026 年 10 月に実際の embed.js のコードを読んで確かめた内容、実測結果、2 つの実際のプロジェクトでの経験も取り入れています。
- スキル本体は英語で書かれていますが、AI アシスタントはあなたが使っている言語で返答します。以下では Claude を例に説明します。
- Meta 公式のプロジェクトではありません。
- 紹介サイト：<https://scorpio-meow.github.io/Threads-skill/>。「送信する前にチェック」をブラウザでそのまま試せます。

## クイックスタート

[`skills`](https://github.com/vercel-labs/skills) コマンドを使えば 1 行でインストールできます。PC にある AI ツールを検出し、それぞれ対応するフォルダに配置してくれます。

```bash
bunx skills add Scorpio-meow/Threads-skill --skill threads-api -g
```

- `-g` を付けるとユーザーディレクトリにインストールされ、すべてのプロジェクトで使えます。`-g` を外すと現在のプロジェクトにだけインストールされます。
- 特定のツールにだけインストールしたい場合は `-a` を付けます（例：`-a claude-code -a codex`）。各ツールの値は[次の節の表](#各ツールのスキルフォルダ)を参照してください。
- [Bun](https://bun.sh) がなければ、`bunx` を `npx` に置き換えても動きます。

インストール後、Threads API に関する質問をすると自動で有効になります。たとえば次のような質問です。

> keyword_search で自分の投稿しかヒットしないんだけど、どこが間違ってる？

手動インストールとそのほかのインストール方法は次の節を参照してください。

## インストール

### 各ツールのスキルフォルダ

手動でインストールするには、`threads-api` フォルダをツールが読み込むスキルフォルダにコピーし、`SKILL.md` が `<スキルフォルダ>/threads-api/SKILL.md` に置かれるようにします。ユーザーフォルダはその PC 上のすべてのプロジェクトで使われます。プロジェクトフォルダはプロジェクトのルートに置くもので、commit すればチームで共有できます。

| ツール | `-a` の値 | ユーザーフォルダ | プロジェクトフォルダ | 手動呼び出し |
|---|---|---|---|---|
| Claude Code | `claude-code` | `~/.claude/skills/` | `.claude/skills/` | `/threads-api` |
| OpenAI Codex（CLI、IDE 拡張機能、ChatGPT デスクトップ版） | `codex` | `~/.agents/skills/` | `.agents/skills/` | `/skills` または `$threads-api` |
| GitHub Copilot（VS Code、Copilot CLI、JetBrains） | `github-copilot` | `~/.copilot/skills/` | `.github/skills/` | `/threads-api` |
| Cursor | `cursor` | `~/.cursor/skills/` | `.cursor/skills/` | Agent のチャットで `/` を入力して選択 |
| Gemini CLI | `gemini-cli` | `~/.gemini/skills/` | `.gemini/skills/` | `/skills list` で読み込まれているか確認できます |
| Google Antigravity | `antigravity` | `~/.gemini/config/skills/` | `.agents/skills/` | — |
| Devin Desktop（旧 Windsurf） | `devin` | `~/.config/devin/skills/` | `.devin/skills/` | `@threads-api` |
| OpenCode | `opencode` | `~/.config/opencode/skills/` | `.opencode/skills/` | — |
| Cline | `cline` | `~/.cline/skills/` | `.cline/skills/` | `/threads-api` |
| Kiro | `kiro-cli` | `~/.kiro/skills/` | `.kiro/skills/` | `/` を入力して選択 |
| JetBrains Junie | `junie` | `~/.junie/skills/` | `.junie/skills/` | `/threads-api` または `$threads-api` |
| Roo Code | `roo` | `~/.roo/skills/` | `.roo/skills/` | — |

Windows では `~` はユーザーフォルダ（`%USERPROFILE%`）を指します。どのツールも会話の内容に関係があればスキルを自動で使います。「手動呼び出し」列は、明示的に使いたいときの方法です。

- Codex、Copilot、Cursor、Gemini CLI、OpenCode、Devin Desktop、Junie、Roo Code は `~/.agents/skills/` も読み込むので、複数のツールを併用している場合はここに 1 つ置くだけで共有できます。Claude Code が読み込むのは `~/.claude/skills/` だけです。
- `bunx skills` は共有の `.agents/skills/`（`-g` のときは `~/.agents/skills/`）に 1 つ置き、ほかのツールにはリンクを作ります。インストール後にツールがスキルを認識しない場合は、下の手動インストールで表のフォルダに置いてください。
- 表にないツール（Amp、Goose、Kilo Code、Trae、Qwen Code など）も `bunx skills` でインストールできます。`-a` の値は [skills の README](https://github.com/vercel-labs/skills) を参照してください。
- Devin Desktop は Windsurf 時代の `~/.codeium/windsurf/skills/` と `.windsurf/skills/` も引き続き読み込みます。

以下は `~/.agents/skills/` にコピーする例です。ほかのツールで使う場合は、`TARGET` を上の表のパスに置き換えてください。

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

ツールが新しいスキルを認識しない場合は、一度再起動すれば反映されます。

### そのほかのインストール方法

独自のインストールコマンドを持つツールもあります。

- **GitHub CLI**（2.90 以降。`gh skill` は現在 public preview）：`--agent` の値は表の `-a` と同じです。

  ```bash
  gh skill install Scorpio-meow/Threads-skill threads-api --agent claude-code --scope user
  ```

- **OpenAI Codex**：Codex で次のように入力します。

  ```text
  $skill-installer install https://github.com/Scorpio-meow/Threads-skill/tree/main/threads-api
  ```

  インストーラは `~/.codex/skills/threads-api`（`CODEX_HOME` を設定している場合は `$CODEX_HOME/skills/`）に置きます。表の `~/.agents/skills/` ではありません。Codex はどちらも読み込みますが、公式ドキュメントに載っている個人フォルダは `~/.agents/skills/` だけで、Codex のソースコードでは `~/.codex/skills/` は互換性のために残された非推奨の場所とされています。`~/.agents/skills/` に置きたい場合は、`bunx skills` か手動コピーでインストールしてください。両方に置かないでください。Codex は同じ名前のスキルをまとめず、どちらもスキルの選択肢に表示されます。

  Codex はデフォルトでサンドボックス内でコマンドを実行し、ネットワークを使いません。代行操作で Threads API に接続するときは事前に承認を求められます。常に許可したい場合は `~/.codex/config.toml` に次を追加します。

  ```toml
  [sandbox_workspace_write]
  network_access = true
  ```

- **GitHub Copilot CLI**：clone したあと `copilot skill add Threads-skill/threads-api` を実行します。セッションの途中で追加した場合は `/skills reload` で読み込みます。フォルダを追加すると、コピーではなく場所として登録されるため、clone したフォルダは残しておいてください。リポジトリの `.github/skills/` に置いて commit すれば、クラウドの Copilot cloud agent でも使われます。
- **Gemini CLI**：デフォルトではユーザー単位でインストールされます。`--scope workspace` を付けると現在のプロジェクトにだけインストールされます。

  ```bash
  gemini skills install https://github.com/Scorpio-meow/Threads-skill.git --path threads-api
  ```

- **Kiro**：Kiro パネルの **Agent Steering & Skills** → **+** → **Import a skill** → **GitHub** を選び、スキルのサブフォルダを指す URL を貼り付けます：`https://github.com/Scorpio-meow/Threads-skill/tree/main/threads-api`。Kiro のドキュメントにはインポート時にサブフォルダも取り込まれるかどうかが書かれていないため、インポート後にスキルフォルダに `scripts/threads_client.py` があるか確認してください。ない場合は `threads-api` フォルダごと手動でコピーしてください。
- **Devin Desktop**：Cascade パネル右上の **⋯** → **Skills** でスキルを管理できます。
- **Cline**：新しいスキルはデフォルトで有効です。Cline パネル下部の **Skills** タブで切り替えられます。

### Claude アプリ（Web 版／デスクトップ版）

1. コード実行を有効にします。Pro、Max プランでは **Settings > Capabilities** で「Code execution and file creation」をオンにします。Team、Enterprise プランでは、組織のオーナーが組織設定で「Code execution and file creation」と「Skills」をオンにする必要があります。
2. `threads-api` フォルダ**だけ**を ZIP に圧縮します。ZIP の最上位は `threads-api/` フォルダにしてください。GitHub の「Download ZIP」でダウンロードされるのはリポジトリ全体（最上位が `Threads-skill-main/`）なので、そのままではアップロードできません。
   - macOS／Linux：`Threads-skill` フォルダで `zip -r ../threads-api.zip threads-api -x '*.DS_Store'` を実行します。
   - Windows：エクスプローラーで `threads-api` フォルダを右クリック →「ZIP ファイルに圧縮する」（Windows 10 では「送る → 圧縮 (zip 形式) フォルダー」）。
3. **Customize > Skills** で **+** → **Create skill** → **Upload a skill** の順に進み、ZIP をアップロードします。画面が **Settings > Capabilities** の場合は、Skills セクションの **Upload skill** を押します。

アップロードしたスキルは自分のアカウントでしか使えません。組織全体で使うには、組織のオーナーが配布する必要があります。アプリのコード実行環境はデフォルトでは Threads API に接続できないため、代行操作は自分の PC で実行してください。画面が変わっている場合は[公式ヘルプ](https://support.claude.com/en/articles/12512180-using-skills-in-claude)を参照してください。

### ChatGPT

[公式ヘルプ](https://help.openai.com/en/articles/20001066-skills-in-chatgpt)によると、ChatGPT のスキルは現在、Business、Enterprise、Healthcare、Edu プランの対象ユーザーが利用でき、アップロードできるかどうかはワークスペースの設定で決まります。

1. 前の節の手順で `threads-api` フォルダを ZIP に圧縮します。
2. サイドバーの **Plugins** → **Skills** タブ → **Create** → **Upload from your computer** の順に進み、ZIP をアップロードします。
3. チャットで `@` を入力して `threads-api` を選ぶか、ChatGPT の判断に任せます。

ChatGPT と Codex のスキルはまだ同期されないため、Codex には別途インストールしてください。

### Agensi

このスキルは [Agensi](https://agensi.io/skills/threads-api) でも無料で公開しています。スキルのページで「Copy prompt to install」を押し、コピーしたプロンプトを AI アシスタントに貼り付けると、Agensi に接続してスキルをインストールします。Agensi コネクタに接続済みのアシスタントは、使うたびに Agensi から最新版を読み込みます。

Agensi はスキルを PC に保存せず、ライセンスでも保存は認められていません。そのため代行操作で実行する `scripts/threads_client.py` はローカルにありません。この場合、スキルの指示に従って AI アシスタントが Agensi からこのファイルを取得し、保存せずに標準入力（stdin）で Python に渡して実行します。代行操作を確実に使いたい場合は、上のいずれかの方法でインストールしてください。

このリポジトリの更新は Agensi の審査を通ってから Agensi に反映されるため、最新の内容はこのリポジトリを基準にしてください。

### 更新と削除

| インストール方法 | 更新 | 削除 |
|---|---|---|
| `bunx skills` | `bunx skills update threads-api` | `bunx skills remove threads-api` |
| `gh skill` | `gh skill update` | `threads-api` フォルダを削除 |
| Codex（`$skill-installer`） | `~/.codex/skills/threads-api` フォルダを削除してからもう一度インストール（フォルダがすでにあるとインストーラは中止します） | `~/.codex/skills/threads-api` フォルダを削除 |
| Copilot CLI（`copilot skill add`） | `Threads-skill` フォルダで `git pull` を実行。セッション中なら `/skills reload` も実行 | `copilot skill remove` に `threads-api` フォルダのパスを指定（登録を解除するだけで、ファイルは残ります） |
| Gemini CLI | 削除してからもう一度インストール | `gemini skills uninstall threads-api` |
| Kiro | スキルフォルダの `threads-api` を削除してからもう一度インポート | スキルフォルダの `threads-api` を削除 |
| 手動コピー | `Threads-skill` フォルダで `git pull` を実行してからもう一度コピー | `threads-api` フォルダを削除 |
| Claude アプリ、ChatGPT | 古いものを削除して新しい ZIP をアップロード | Skills ページで削除 |
| Agensi | 不要。使うたびに Agensi から最新版を読み込みます | PC に保存されないため不要 |

Kiro のドキュメントには更新と削除の方法が書かれていません。インポートしたスキルはスキルフォルダ（`~/.kiro/skills/` または `.kiro/skills/`）にコピーされるため、表ではそのフォルダを削除する方法にしています。

### 各ツールの公式ドキュメント

パスや画面が変わっている場合は、公式ドキュメントを優先してください：[Claude Code](https://code.claude.com/docs/en/skills)・[Claude アプリ](https://support.claude.com/en/articles/12512180-using-skills-in-claude)・[ChatGPT](https://help.openai.com/en/articles/20001066-skills-in-chatgpt)・[OpenAI Codex](https://learn.chatgpt.com/docs/build-skills)・[GitHub Copilot](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills)・[VS Code](https://code.visualstudio.com/docs/agent-customization/agent-skills)・[Cursor](https://cursor.com/docs/skills)・[Gemini CLI](https://geminicli.com/docs/cli/skills/)・[Google Antigravity](https://antigravity.google/docs/skills)・[Devin Desktop](https://docs.devin.ai/desktop/cascade/skills)・[OpenCode](https://opencode.ai/docs/skills)・[Cline](https://docs.cline.bot/customization/skills)・[Kiro](https://kiro.dev/docs/skills/)・[JetBrains Junie](https://junie.jetbrains.com/docs/agent-skills.html)・[Roo Code](https://roocodeinc.github.io/Roo-Code/features/skills/)・[skills](https://github.com/vercel-labs/skills)・[gh skill](https://cli.github.com/manual/gh_skill_install)

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

### 投稿の埋め込み：Threads の投稿をサイトに載せる

- 「innerHTML で Threads の埋め込みコードを入れているのに、どの投稿も『Threads で見る』のリンク枠しか表示されない。どう直せばいい？」
- 「厳選した投稿 60 件を並べるページを作って、削除された投稿がないか毎週自動でチェックしたい。」

Claude は次のように対応します。

- 埋め込みコードは oEmbed で取得するか（2026 年 3 月からトークン不要）、検証済みの投稿 URL から埋め込み用のマークアップを組み立てます（embed.js が代替リンクを取り除くのに使う `id` も含めます）。保存しておいた HTML を innerHTML でそのまま挿入することはしません。照合や重複排除には、元の URL ではなく投稿のショートコードを使います。
- embed.js はページで 1 回だけ読み込み、投稿を追加したら `window.instgrm.Embeds.process()` を呼びます。CSP で `https://www.threads.com` のスクリプトと iframe を許可する必要があることも伝えます。
- embed.js を読み込めない場所（厳しい CSP、Chrome 拡張機能のページ）では iframe で `/embed/` を直接埋め込み、埋め込みページが数値だけで報告する高さに合わせて iframe のサイズを調整します。ダークテーマには `?theme=dark` を付けます。
- 1 ページに多数の投稿を載せるときは、ページ分割や順番に読み込むことで Threads のレート制限を避けます。「最初に報告された高さが 0 より大きい」ことで成功と判定し、失敗した投稿は元の投稿へのリンク付きの代替カードに差し替え、失敗が続いたらしばらく待ってから再開します。
- 投稿がまだ存在するかの定期チェックには oEmbed を使い、`code 24`（Media Not Found）が返ったときだけ削除し、それ以外のエラーは一時的な問題として扱います。削除された投稿はページ上で「スレッドを表示できません」というカードになり、読み込みに成功したように見えるため、oEmbed でしか見つけられません。ログインしたユーザーにだけ公開されている投稿は逆で、oEmbed は通常どおり埋め込みコードを返しますが、Threads にログインしていない訪問者やサードパーティ Cookie をブロックしている訪問者には表示されません。スキルはその見分け方も説明します。

embed.js の読み込みの仕組みと埋め込みページの高さの報告は、公式ドキュメントに書かれていません。この部分は、2026 年 10 月に実際の embed.js のコードを読んで確かめた内容、テストページで本物の埋め込みを読み込んだ結果、2 つの実際のプロジェクト（投稿ギャラリーと Chrome 拡張機能）での経験に基づいており、Meta が今後変更する可能性があります。

### 導入すると何が変わるか

Claude はもともと Threads API の基本的な使い方を知っていますが、ルールの多くはドキュメントの細部や最近の changelog に埋もれています。テストでは、スキルなしの Claude が次のようなミスをしましたが、スキルを導入した状態ではどれも起きませんでした。

- ゴースト投稿（ghost post）にアンケートを付けられるか自信がなく、「とりあえず送ってみる」という選択肢まで提示しました。ドキュメントには、ゴースト投稿で唯一使える追加機能はテキストのネタバレ防止（text spoiler）で、アンケートは付けられないと明記されています。
- `profile_lookup` で調べられるのはフォロワー 1,000 人以上のアカウントだけだと説明するか、条件にまったく触れませんでした。この条件は 2025 年 11 月に 100 人まで引き下げられています。
- まずネストされたリプライそのものに非表示を実行し、失敗してから上位のリプライを処理しました。API で非表示にできるのは最上位のリプライだけで、その下のスレッドもまとめて非表示になります。
- ページングで `paging.next` しか見ていませんでした。ドキュメントには投稿一覧のレスポンスにこのフィールドは含まれないと明記されており、ドキュメントどおりなら最初のページしか取得できません。
- トークンの延長時に、ドキュメントで定められた条件を確認していませんでした。延長できるのは、発行から 24 時間以上経過していて、まだ期限切れになっていないトークンだけです。
- embed.js は読み込み時に一度しかページを走査しないと思い込み、投稿を 1 件ずつ別の iframe ページに入れていました。実際には、投稿を追加したあとに `window.instgrm.Embeds.process()` を呼べば、embed.js がページを走査し直します。
- 削除された投稿を調べるには Meta アプリとトークンが必要だと考え、threads.com のページをスクレイピングしていました。oEmbed は 2026 年 3 月からトークン不要で、投稿が存在しない場合ははっきりと `code 24` を返します。
- `/embed/` の高さは JSON 文字列形式の `MEASURE` メッセージで送られると説明し、書いたリスナーは本当の報告を 1 件も受け取れませんでした。埋め込みページが送るのは数値だけで、画像のある投稿では画像の読み込み後にさらに何度か送られます。
- Threads の埋め込みにはダークテーマのパラメータがなく、CSS フィルターで対処するしかないと説明しました。実際には、`/embed/` の URL に `?theme=dark` を付けるか、blockquote に `data-theme="dark"` を設定すれば済みます。
- 埋め込みコードの blockquote に `id` がないことに気づかず、投稿の下に残った「View on Threads」のリンクを embed.js の重複実行のせいにしました。embed.js はこの `id` を使って代替リンクを取り除いています。

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
| キーワード・トピックタグ検索 | `threads_keyword_search` |
| メンション | `threads_manage_mentions` |
| 場所の検索とタグ付け | `threads_location_tagging` |
| 公開アカウントの検索 | `threads_profile_discovery` |
| Instagram ストーリーズへの同時シェア | `threads_share_to_instagram` |

App Review を通過するまでは、権限は App のテスターのアカウントにしか使えず（自分のアカウントもテスターとして追加する必要があります）、一部の機能は結果も制限されます（たとえばキーワード検索では自分の投稿しか見つかりません）。

## ドキュメント

スキル本体は [`threads-api/SKILL.md`](threads-api/SKILL.md) で、全 14 節あります。

| 節 | 内容 |
|---|---|
| 1 | 基本概念：API のベース URL、2 段階の投稿、container ID と media ID の違い、書き込み用と読み取り用で列挙値が異なること |
| 2–3 | 開発モード・代行操作モードのワークフロー |
| 4 | 投稿：投稿の種類ごとの手順、パラメータ一覧、機能の互換性、文字数とメディアの仕様、container のステータス |
| 5 | 取得と検索：プロフィール、投稿、メンション、公開アカウント、キーワード・トピックタグ検索、場所、ページング |
| 6 | リプライの管理：取得、非表示、リプライの承認 |
| 7 | インサイト（Insights）：投稿単位とアカウント単位の指標 |
| 8 | 権限、App Review、OAuth、トークンの延長 |
| 9 | クォータとレート制限 |
| 10 | Webhook |
| 11 | 投稿の埋め込み：oEmbed、embed.js の読み込みの仕組み、埋め込みページの高さの報告、`/embed/` の直接埋め込み、大量に埋め込むときのペース調整と失敗時の処理、Web Intents |
| 12 | トラブルシューティング：よくあるエラーの原因と対処法 |
| 13 | 公式サンプルのうちそのまま真似してはいけない誤り |
| 14 | リファレンスクライアント [`scripts/threads_client.py`](threads-api/scripts/threads_client.py) の使い方と spec の例 |

*(practice)* と付いたエンジニアリング上の推奨事項と、*(observed)* と付いた実測結果を除き、内容はすべて公式ドキュメントに基づいています。

変更履歴は [CHANGELOG_ja.md](CHANGELOG_ja.md) にあります。

### リファレンスクライアント

リファレンスクライアントは [`threads-api/scripts/threads_client.py`](threads-api/scripts/threads_client.py) です。Python の標準ライブラリ（3.8 以上）だけで動くためパッケージのインストールは不要で、使い方は SKILL.md 第 14 節に書いてあります。代行操作では Claude がこれを直接実行して API を呼び出し、開発モードではそのロジックを読んで、プロジェクトの言語で書き直します。自分で使いたい場合は、このファイルをそのまま実行してください。トークンは `THREADS_ACCESS_TOKEN` か、カレントフォルダの `.env` から読み込みます。下の例はリポジトリのルートで実行する場合で、スキルフォルダにインストールした場合はそこのパスに置き換えます（Windows では `python3` を `python` に置き換えます）。

```bash
python3 threads-api/scripts/threads_client.py get me fields=id,username   # アカウントを確認
python3 threads-api/scripts/threads_client.py check spec.json             # ローカルで内容をチェックするだけで、API は呼び出さない
python3 threads-api/scripts/threads_client.py publish spec.json           # チェック → container を作成 → 処理完了を待つ → 公開 → URL を表示
python3 threads-api/scripts/threads_client.py delete <media-id>           # 投稿を削除（元に戻せない）
```

`spec.json` には container のパラメータを書きます。たとえばアンケート付きの投稿なら次のとおりです。

```json
{"media_type": "TEXT", "text": "浅煎りと深煎り、どっち？", "poll_attachment": {"option_a": "浅煎り", "option_b": "深煎り"}}
```

## テスト結果

同じモデルで「スキルあり」と「スキルなし」を比較しました。各問題を両方の設定で 1 回ずつ実行し、回答に関わっていない採点者が、あらかじめ用意したチェック項目に沿って 1 項目ずつ判定しています。ラウンドの合間に採点者の指摘をもとにスキルを修正し、計 10 ラウンド実施しました。ラウンド 4 は、スキルに投稿の埋め込みの内容を加えたあと、新しく追加した問題 6 だけを、ラウンド 5 は新しく追加した問題 7–10 だけを実行しています。ラウンド 6 では、webhook の重複排除と `debug_token` の修正を検証するため、問題 2、4、7、8 を再実行しました。ラウンド 7 では、リファレンスクライアントを `scripts/threads_client.py` に移したあとに全 10 問を再実行しています。ラウンド 8 は投稿の埋め込みの節を書き直したあとに問題 6 と新しく追加した問題 11、12 を実行し、ラウンド 9 はバージョン 1.5 でこの 3 問を再実行しました。ラウンド 10 はログインしたユーザーにだけ公開されている投稿を検証するため、新しく追加した問題 13 を実行し、問題 12 を再実行しました。問題とチェック項目は [`evals/evals.json`](evals/evals.json) にあります。

各セルは合格したチェック項目の数で、「スキルあり vs スキルなし」の形式です。

| 問題 | ラウンド 1 | ラウンド 2 | ラウンド 3 | ラウンド 4 | ラウンド 5 | ラウンド 6 | ラウンド 7 | ラウンド 8 | ラウンド 9 | ラウンド 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| 1. Python でカルーセル投稿（画像 2 枚＋動画 1 本） | 8/8 vs 8/8 | — | — | — | — | — | 8/8 vs 8/8 | — | — | — |
| 2. TypeScript で毎日のインサイト取得スケジュールとトークン延長 | 9/9 vs 7/9 | 9/9 vs 7/9 | 9/9 vs 9/9 | — | — | 9/9 vs 8/9 | 9/9 vs 7/9 | — | — | — |
| 3. アンケート付きゴースト投稿の代行 | 6/6 vs 3/6 | 7/7 vs 4/7 | 7/7 vs 5/7 | — | — | — | 7/7 vs 6/7 | — | — | — |
| 4. 検索・場所・アカウント検索で結果がおかしい原因 | — | 6/6 vs 5/6 | 6/6 vs 5/6 | — | — | 6/6 vs 5/6 | 7/7 vs 5/7 | — | — | — |
| 5. キーワードを含むリプライの自動非表示 | — | 7/7 vs 6/7 | 7/7 vs 6/7 | — | — | — | 7/7 vs 6/7 | — | — | — |
| 6. 60 件の Threads 投稿ウォールと削除済み投稿の毎週チェック | — | — | — | 8/8 vs 2/8 | — | — | 8/8 vs 3/8 | 8/8 vs 3/8 | 9/9 vs 4/9 | — |
| 7. FastAPI でリプライとメンションを受け取る webhook | — | — | — | — | 8/8 vs 8/8 | 8/8 vs 6/8 | 8/8 vs 6/8 | — | — | — |
| 8. Express での OAuth ログインと長期トークンの延長 | — | — | — | — | 8/8 vs 7/8 | 8/8 vs 7/8 | 8/8 vs 7/8 | — | — | — |
| 9. 不具合のある Python 投稿コードのレビュー | — | — | — | — | 8/8 vs 6/8 | — | 8/8 vs 6/8 | — | — | — |
| 10. 絵文字を含むスレッドを翌朝 8 時に代理投稿 | — | — | — | — | 7/7 vs 6/7 | — | 7/7 vs 5/7 | — | — | — |
| 11. Chrome 拡張機能で `/embed/` を直接埋め込むプレビュー | — | — | — | — | — | — | — | 8/8 vs 4/8 | 9/9 vs 4/9 | — |
| 12. React コンポーネント内の埋め込みカード | — | — | — | — | — | — | — | 8/8 vs 3/8 | 9/9 vs 3/9 | 9/9 vs 3/9 |
| 13. ログインしたユーザーにだけ公開されている投稿 | — | — | — | — | — | — | — | — | — | 8/8 vs 6/8 |
| **平均合格率** | **100% vs 76%** | **100% vs 76%** | **100% vs 85%** | **100% vs 25%** | **100% vs 87%** | **100% vs 84%** | **100% vs 77%** | **100% vs 42%** | **100% vs 41%** | **100% vs 54%** |

- 平均合格率は、各問題の合格率の平均です。問題 1 は両方とも満点で差が出なかったため、ラウンド 2 からは問題 2–5 を使っています。問題 3 はラウンド 2 からチェック項目が 1 つ増えています。問題 4 はラウンド 7 でチェック項目が 1 つ増えて 7 つに、問題 6、11、12 はラウンド 9 でそれぞれ 1 つ増えて 9 つになりました。問題 13 のチェック項目は 8 つです。
- 各問題・各設定とも 1 回しか実行しておらずサンプルが少ないため、数字は傾向を見る程度にとどめてください。たとえば問題 2 のスキルなし版は、最初の 2 ラウンドではページングとトークン延長で失点しましたが、ラウンド 3 では満点でした。
- スキルなしでの失点はほぼすべて、コードが書けないからではなく、ドキュメントのルールを知らないことが原因でした。「導入すると何が変わるか」に挙げた例は、すべてこのテストから取っています。ラウンド 5 ではスキルなしの設定でも Web で公式ドキュメントを検索でき、実際に調べていたため、差は 100% vs 87% に縮まりました。ラウンド 6 はどちらの設定も Web を使えず、スキルありは 31 項目すべてに合格しました。ラウンド 7 も Web を使えない条件で全 10 問を再実行し、スキルありは 77 項目すべてに合格、スキルなしは平均 77% でした。リファレンスクライアントを SKILL.md から移したあとも、点数が下がった問題はありません。ラウンド 8・9 の 3 問はどれも公式ドキュメントに書かれていない埋め込みの挙動を扱っており、スキルなし版の合格は平均で 4 割ほどにとどまりました。しかも両ラウンドとも、同じ誤った説明を自信たっぷりに述べていました。スキルありは両ラウンドともすべての項目に合格し、ラウンド 9 では、ラウンド 8 のあとに直した「高さの報告は 1 回だけではない」という点が反映されていることも確認できました。ラウンド 10 の問題 13 では、スキルなし版もログインとサードパーティ Cookie が必要なことを自分で推論できたため、差は比較的小さくなりました（スキルあり 8/8、スキルなし 6/8）。

各ラウンドの評価設定、所要時間とトークン使用量、失点した項目ごとの原因は [benchmark の概要](evals/BENCHMARK_ja.md)を、項目ごとの判定と採点者が添えた根拠は [evals/benchmark.json](evals/benchmark.json) を参照してください。

## 既知の制限

- 組み込みクライアントはモックの API でしかテストしておらず、実際のアカウントでの投稿はまだ試していません。
- テストは Claude でしか実行していません。ほかのツールでも同じ流れで動くはずですが、実際には検証していません。
- Claude アプリはデフォルトでは Threads API に接続できないため、代行操作は自分の PC で実行する必要があります。また、代行操作にはツールがターミナルのコマンドを実行できることが必要です。
- 公式ドキュメントには、互いに矛盾していたりあいまいだったりする箇所がいくつかあります。たとえば、場所の検索で `q` と `query` のどちらを使うのか、ゴースト投稿に非対応の機能を付けたときに API がエラーを返すのか無視するのか、webhook に App Review が必要かどうか、などです。スキルはこうした箇所に当たったとき、勝手に推測せず、そのとおりに説明します。
- embed.js の読み込みの挙動（同時に読み込むのは最大 3 件、`instgrm.Embeds.process()`、`data-theme`、埋め込みページの高さの報告など）は公式ドキュメントに書かれておらず、2026 年 10 月に観察したものです。Meta がいつ変更してもおかしくありません。埋め込みページがまれに高さ 0 を報告することがありますが、原因はまだわかっていません。
- 公式ドキュメントは 2026-10-23 に同期し直しており、changelog の最新の項目は 2026-08-18 のものです。それ以降の変更は[公式 changelog](https://developers.facebook.com/documentation/threads/changelog) を参照してください。
- Threads 広告（Marketing API の範囲）は対象外です。

## コントリビューション

ルールの誤りの報告、間違えやすいポイントの追加、サイトの改善を歓迎します。

- 手順、リポジトリの構成、あわせて更新が必要な箇所：[コントリビューションガイド](.github/CONTRIBUTING_ja.md)
- [行動規範](.github/i18n/CODE_OF_CONDUCT_ja.md)
- セキュリティの問題は公開の issue ではなく、[セキュリティポリシー](.github/SECURITY_ja.md)に沿って非公開で報告してください。
- 紹介サイトのアクセシビリティ：[アクセシビリティ方針](.github/ACCESSIBILITY_ja.md)

## ライセンス

[MIT](LICENSE)
