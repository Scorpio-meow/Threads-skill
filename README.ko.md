# Threads API Skill

[繁體中文](README.md) | [English](README.en.md) | [日本語](README.ja.md) | **한국어**

AI 어시스턴트가 Meta Threads API를 제대로 다룰 수 있게 해 주는 스킬입니다. 연동 코드를 작성하고 검토하고 디버깅하는 것은 물론, 여러분의 토큰으로 직접 게시물 작성, 답글, 인사이트 조회까지 할 수 있습니다. Threads 게시물을 웹사이트에 임베드하는 작업도 도와줍니다.

- [Agent Skills](https://agentskills.io) 형식(폴더 하나와 `SKILL.md` 파일 하나)을 따르므로 Claude Code, Claude 앱, ChatGPT, OpenAI Codex, GitHub Copilot, Cursor, Gemini CLI, Devin Desktop(구 Windsurf), OpenCode 등 10가지가 넘는 도구에 설치할 수 있습니다.
- 내용은 Meta 공식 문서를 정리한 것으로, 2026-08-18 changelog까지 반영되어 있습니다. 게시물 임베드 부분은 2026년 10월에 실제 embed.js 코드를 읽고 직접 테스트한 결과도 반영했습니다.
- 스킬 자체는 영어로 작성되어 있지만, AI 어시스턴트는 여러분이 쓰는 언어로 답합니다. 아래에서는 Claude를 예로 들어 설명합니다.
- Meta 공식 프로젝트가 아닙니다.
- 소개 사이트: <https://scorpio-meow.github.io/Threads-skill/>. 브라우저에서 바로 "보내기 전에 먼저 검사"를 써 볼 수 있습니다.

## 빠른 시작

[`skills`](https://github.com/vercel-labs/skills) 명령어 한 줄로 설치할 수 있습니다. 컴퓨터에 설치된 AI 도구를 감지해 알맞은 폴더에 넣어 줍니다.

```bash
bunx skills add Scorpio-meow/Threads-skill --skill threads-api -g
```

- `-g`를 붙이면 개인 디렉터리에 설치되어 모든 프로젝트에서 쓸 수 있고, 빼면 현재 프로젝트에만 설치됩니다.
- 특정 도구에만 설치하려면 `-a`를 붙이세요. 예: `-a claude-code -a codex`. 도구별 값은 [다음 섹션의 표](#도구별-스킬-폴더)를 참고하세요.
- [Bun](https://bun.sh)이 없다면 `bunx` 대신 `npx`를 써도 됩니다.

설치한 뒤 Threads API 관련 질문을 하면 자동으로 활성화됩니다. 예를 들어:

> keyword_search로 검색하면 내 게시물만 나오는데, 어디가 잘못된 걸까요?

수동 설치와 그 밖의 설치 방법은 다음 섹션을 참고하세요.

## 설치

### 도구별 스킬 폴더

수동 설치는 `threads-api` 폴더를 도구가 읽는 스킬 폴더에 복사해서 `SKILL.md`가 `<스킬 폴더>/threads-api/SKILL.md` 위치에 오도록 하면 됩니다. 개인 폴더는 이 컴퓨터의 모든 프로젝트에서 쓰이고, 프로젝트 폴더는 프로젝트 루트 아래에 두므로 commit해서 팀과 함께 쓸 수 있습니다.

| 도구 | `-a` 값 | 개인 폴더 | 프로젝트 폴더 | 수동 호출 |
|---|---|---|---|---|
| Claude Code | `claude-code` | `~/.claude/skills/` | `.claude/skills/` | `/threads-api` |
| OpenAI Codex(CLI, IDE 확장, ChatGPT 데스크톱 앱) | `codex` | `~/.agents/skills/` | `.agents/skills/` | `/skills` 또는 `$threads-api` |
| GitHub Copilot(VS Code, Copilot CLI, JetBrains) | `github-copilot` | `~/.copilot/skills/` | `.github/skills/` | `/threads-api` |
| Cursor | `cursor` | `~/.cursor/skills/` | `.cursor/skills/` | Agent 채팅에서 `/` 입력 후 선택 |
| Gemini CLI | `gemini-cli` | `~/.gemini/skills/` | `.gemini/skills/` | `/skills list`로 로드 여부 확인 |
| Google Antigravity | `antigravity` | `~/.gemini/config/skills/` | `.agents/skills/` | — |
| Devin Desktop(구 Windsurf) | `devin` | `~/.config/devin/skills/` | `.devin/skills/` | `@threads-api` |
| OpenCode | `opencode` | `~/.config/opencode/skills/` | `.opencode/skills/` | — |
| Cline | `cline` | `~/.cline/skills/` | `.cline/skills/` | `/threads-api` |
| Kiro | `kiro-cli` | `~/.kiro/skills/` | `.kiro/skills/` | `/` 입력 후 선택 |
| JetBrains Junie | `junie` | `~/.junie/skills/` | `.junie/skills/` | `/threads-api` 또는 `$threads-api` |
| Roo Code | `roo` | `~/.roo/skills/` | `.roo/skills/` | — |

Windows에서 `~`는 사용자 폴더(`%USERPROFILE%`)입니다. 모든 도구는 대화 내용과 관련이 있으면 스킬을 자동으로 사용하며, '수동 호출' 열은 명시적으로 지정해서 쓰는 방법일 뿐입니다.

- Codex, Copilot, Cursor, Gemini CLI, OpenCode, Devin Desktop, Junie, Roo Code는 `~/.agents/skills/`도 읽으므로, 여러 도구를 함께 쓴다면 여기에 하나만 두면 공유됩니다. Claude Code는 `~/.claude/skills/`만 읽습니다.
- `bunx skills`는 공유 폴더인 `.agents/skills/`(`-g`를 붙이면 `~/.agents/skills/`)에 하나를 두고, 다른 도구에는 링크를 만듭니다. 설치 후 도구가 스킬을 인식하지 못하면 아래 수동 설치로 표의 폴더에 넣으세요.
- 표에 없는 도구(Amp, Goose, Kilo Code, Trae, Qwen Code 등)도 `bunx skills`로 설치할 수 있습니다. `-a` 값은 [skills README](https://github.com/vercel-labs/skills)를 참고하세요.
- Devin Desktop은 Windsurf 시절의 `~/.codeium/windsurf/skills/`와 `.windsurf/skills/`도 계속 읽습니다.

아래는 `~/.agents/skills/`에 복사하는 예시입니다. 다른 도구라면 `TARGET`을 위 표의 경로로 바꾸세요.

macOS/Linux:

```bash
git clone --depth 1 https://github.com/Scorpio-meow/Threads-skill.git
TARGET=~/.agents/skills
mkdir -p "$TARGET"
cp -r Threads-skill/threads-api "$TARGET/"
```

Windows PowerShell:

```powershell
git clone --depth 1 https://github.com/Scorpio-meow/Threads-skill.git
$TARGET = "$HOME\.agents\skills"
New-Item -ItemType Directory -Force $TARGET | Out-Null
Copy-Item -Recurse -Force Threads-skill\threads-api "$TARGET\"
```

도구가 새 스킬을 인식하지 못하면 한 번 재시작하세요.

### 그 밖의 설치 방법

자체 설치 명령어가 있는 도구도 있습니다.

- **GitHub CLI**(2.90 이상, `gh skill`은 현재 public preview): `--agent` 값은 표의 `-a`와 같습니다.

  ```bash
  gh skill install Scorpio-meow/Threads-skill threads-api --agent claude-code --scope user
  ```

- **OpenAI Codex**: Codex에서 다음을 입력합니다.

  ```text
  $skill-installer install https://github.com/Scorpio-meow/Threads-skill/tree/main/threads-api
  ```

  Codex는 기본적으로 샌드박스에서 명령어를 실행하고 네트워크를 쓰지 않으므로, 대행 모드가 Threads API에 접속할 때 먼저 승인을 요청합니다. 항상 허용하려면 `~/.codex/config.toml`에 다음을 추가하세요.

  ```toml
  [sandbox_workspace_write]
  network_access = true
  ```

- **GitHub Copilot CLI**: clone한 뒤 `copilot skill add Threads-skill/threads-api`를 실행합니다. 세션 중간에 추가했다면 `/skills reload`로 불러오세요. 저장소의 `.github/skills/`에 넣고 commit하면 클라우드의 Copilot cloud agent도 사용합니다.
- **Gemini CLI**: 기본적으로 개인 범위에 설치되며, `--scope workspace`를 붙이면 현재 프로젝트에만 설치됩니다.

  ```bash
  gemini skills install https://github.com/Scorpio-meow/Threads-skill.git --path threads-api
  ```

- **Kiro**: Kiro 패널에서 **Agent Steering & Skills** → **+** → **Import a skill** → **GitHub**를 선택하고, 스킬이 있는 하위 폴더를 가리키는 URL을 붙여 넣습니다: `https://github.com/Scorpio-meow/Threads-skill/tree/main/threads-api`
- **Devin Desktop**: Cascade 패널 오른쪽 위의 **⋯** → **Skills**에서 스킬을 관리할 수 있습니다.
- **Cline**: 새 스킬은 기본으로 켜져 있으며, Cline 패널 아래쪽의 **Skills** 탭에서 켜고 끌 수 있습니다.

### Claude 앱(웹/데스크톱)

1. 코드 실행을 켭니다. Pro, Max 플랜은 **Settings > Capabilities**에서 "Code execution and file creation"을 켜고, Team, Enterprise 플랜은 조직 소유자가 조직 설정에서 "Code execution and file creation"과 "Skills"를 켜야 합니다.
2. `threads-api` 폴더**만** 따로 ZIP으로 압축합니다. ZIP 최상위에 `threads-api/` 폴더가 있어야 합니다. GitHub의 "Download ZIP"으로 받으면 repo 전체(최상위가 `Threads-skill-main/`)가 내려받아지므로 그대로 업로드할 수 없습니다.
   - macOS/Linux: `Threads-skill` 폴더에서 `zip -r ../threads-api.zip threads-api -x '*.DS_Store'`를 실행합니다.
   - Windows: 파일 탐색기에서 `threads-api` 폴더를 마우스 오른쪽 버튼으로 클릭 → "ZIP 파일로 압축"(Windows 10은 "보내기 → 압축(ZIP) 폴더").
3. **Customize > Skills**에서 **+** → **Create skill** → **Upload a skill**을 눌러 ZIP을 업로드합니다. 화면이 **Settings > Capabilities**라면 Skills 섹션에서 **Upload skill**을 누르세요.

업로드한 스킬은 내 계정에서만 쓸 수 있으며, 조직 전체에서 쓰려면 조직 소유자가 배포해야 합니다. 앱의 코드 실행 환경은 기본적으로 Threads API에 접속할 수 없으므로, 대행 모드는 내 컴퓨터에서 실행하세요. UI가 바뀌었다면 [공식 안내](https://support.claude.com/en/articles/12512180-using-skills-in-claude)를 따르세요.

### ChatGPT

[공식 안내](https://help.openai.com/en/articles/20001066-skills-in-chatgpt)에 따르면 ChatGPT의 스킬은 현재 Business, Enterprise, Healthcare, Edu 플랜의 대상 사용자가 쓸 수 있고, 업로드 가능 여부는 워크스페이스 설정에 따라 다릅니다.

1. 앞 섹션의 방법으로 `threads-api` 폴더를 ZIP으로 압축합니다.
2. 사이드바의 **Plugins** → **Skills** 탭 → **Create** → **Upload from your computer**를 눌러 ZIP을 업로드합니다.
3. 대화에서 `@`를 입력해 `threads-api`를 고르거나, ChatGPT가 알아서 판단하게 둡니다.

ChatGPT와 Codex의 스킬은 아직 동기화되지 않으므로, Codex에는 따로 설치하세요.

### Agensi

이 스킬은 [Agensi](https://agensi.io/skills/threads-api)에도 무료로 올라가 있습니다. 스킬 페이지에서 "Copy prompt to install"을 누르고 복사한 프롬프트를 AI 어시스턴트에 붙여 넣으면, Agensi에 연결해 스킬을 설치합니다. Agensi 커넥터에 이미 연결된 어시스턴트는 사용할 때마다 Agensi에서 최신 버전을 불러옵니다.

이 저장소의 업데이트는 Agensi 심사를 통과한 뒤에야 Agensi에 반영되므로, 최신 내용은 이 저장소를 기준으로 하세요.

### 업데이트와 삭제

| 설치 방법 | 업데이트 | 삭제 |
|---|---|---|
| `bunx skills` | `bunx skills update threads-api` | `bunx skills remove threads-api` |
| `gh skill` | `gh skill update` | `threads-api` 폴더 삭제 |
| Gemini CLI | 삭제 후 다시 설치 | `gemini skills uninstall threads-api` |
| 수동 복사 | `Threads-skill` 폴더에서 `git pull`을 실행한 뒤 다시 복사 | `threads-api` 폴더 삭제 |
| Claude 앱, ChatGPT | 이전 것을 삭제하고 새 ZIP 업로드 | Skills 페이지에서 삭제 |

### 도구별 공식 문서

경로나 UI가 바뀌었다면 공식 문서를 따르세요: [Claude Code](https://code.claude.com/docs/en/skills)・[Claude 앱](https://support.claude.com/en/articles/12512180-using-skills-in-claude)・[ChatGPT](https://help.openai.com/en/articles/20001066-skills-in-chatgpt)・[OpenAI Codex](https://learn.chatgpt.com/docs/build-skills)・[GitHub Copilot](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills)・[VS Code](https://code.visualstudio.com/docs/agent-customization/agent-skills)・[Cursor](https://cursor.com/docs/skills)・[Gemini CLI](https://geminicli.com/docs/cli/skills/)・[Google Antigravity](https://antigravity.google/docs/skills)・[Devin Desktop](https://docs.devin.ai/desktop/cascade/skills)・[OpenCode](https://opencode.ai/docs/skills)・[Cline](https://docs.cline.bot/customization/skills)・[Kiro](https://kiro.dev/docs/skills/)・[JetBrains Junie](https://junie.jetbrains.com/docs/agent-skills.html)・[Roo Code](https://roocodeinc.github.io/Roo-Code/features/skills/)・[skills](https://github.com/vercel-labs/skills)・[gh skill](https://cli.github.com/manual/gh_skill_install)

## 기능

### 개발 모드: 코드 작성과 문제 해결

- "TypeScript로 매일 Threads 게시물 인사이트를 수집하는 스케줄러를 만들어 줘. 토큰은 자동으로 갱신되게 해 줘."
- "10분마다 게시물에 달린 답글 중 광고 키워드가 들어간 걸 숨기는 Python 스크립트를 짜 줘."

Claude는 프로젝트에서 이미 쓰고 있는 언어와 스타일(Node.js/TypeScript, Python, C#, Go 등, 프로젝트가 없으면 Python)을 그대로 따르고, 문서의 규칙을 코드에 직접 반영합니다.

- 토큰과 App secret은 환경 변수나 시크릿 관리 서비스에서 읽고, 코드에 하드코딩하거나 로그에 남기지 않습니다.
- 게시는 전체 흐름을 따릅니다: container 생성 → 처리 완료 대기(처리 실패, 만료, 타임아웃 모두 처리) → 게시 → 게시물 URL 가져오기.
- 전송 전에 글자 수, 링크 수, 기능 간 충돌을 로컬에서 먼저 확인해 API 할당량을 낭비하지 않습니다.
- 페이지네이션은 cursor로 하고, 4xx 오류는 무작정 재시도하지 않으며, 레이트 리밋에 걸리면 잠시 뒤 다시 시도합니다.

### 대행 모드: 내 계정을 직접 조작

- "Threads에 '주말 한정! 신상 원두 10% 할인'이라고 올려 줘. 라이트 로스트와 다크 로스트 중 뭐가 좋은지 묻는 투표도 붙여 줘."
- "최근 게시물 5개의 조회수와 좋아요 수가 각각 얼마야?"
- "가장 최근 게시물에 달린 답글 중 '카톡 추가'를 언급한 걸 숨겨 줘."

Claude는 다음 순서로 진행합니다.

1. **토큰 찾기**: 먼저 환경 변수 `THREADS_ACCESS_TOKEN`을 확인하고, 그다음 프로젝트 폴더의 `.env`를 확인합니다. 둘 다 없으면 설정을 요청합니다([설정](#설정) 참고).
2. **계정 확인**: `GET /me`를 호출해 어떤 계정으로 작업할지 알려 줍니다.
3. **내용 검사**: 글자 수, 링크 수, 기능 간 충돌(예: 고스트 게시물에는 투표를 붙일 수 없음)을 확인합니다. 게시물이 목적을 달성하지 못할 수 있는 부분도 짚어 줍니다. 예를 들어 화요일에 올린 24시간 고스트 게시물은 홍보하려는 주말까지 남아 있지 않습니다.
4. **확인 대기**: 게시, 답글, 리포스트, 삭제, 답글 숨기기 전에는 계정, 전체 본문, 미디어 URL, 모든 파라미터를 먼저 보여 주고 명확히 동의할 때까지 기다립니다. 단순 조회는 확인이 필요 없습니다.
5. **실행과 결과 보고**: 스킬에 내장된 Python 클라이언트로 실행하고 게시물 ID와 URL을 알려 줍니다. 실패하면 원인과 해결 방법을 설명하고, 무작정 재시도하지 않습니다.

대행 모드를 쓰려면 컴퓨터에 Python 3.8 이상이 있어야 합니다. Claude 앱의 코드 실행 환경은 기본적으로 패키지 저장소에만 접속할 수 있고 Threads API에는 접속할 수 없습니다. 그래서 앱에서 대행 모드를 쓰면 Claude가 명령어와 파라미터를 준비해 주고, 실행은 여러분의 컴퓨터에서 직접 하게 됩니다.

### 게시물 임베드: 웹사이트에 Threads 게시물 올리기

- "Threads 임베드 코드를 innerHTML로 넣었는데 게시물마다 'Threads에서 보기' 링크 상자만 보여요. 어떻게 고치죠?"
- "엄선한 게시물 60개를 보여 주는 페이지를 만들고, 삭제된 게시물이 있는지 매주 자동으로 확인해 줘."

Claude는 이렇게 처리합니다.

- 임베드 코드는 oEmbed로 가져오거나(2026년 3월부터 토큰 불필요), 검증된 게시물 URL로 임베드 마크업을 직접 만듭니다. 저장해 둔 HTML을 innerHTML로 그대로 넣지 않습니다.
- embed.js는 페이지에서 한 번만 로드하고, 게시물을 추가한 뒤 `window.instgrm.Embeds.process()`를 호출합니다. CSP에서 `https://www.threads.com`의 스크립트와 iframe을 허용해야 한다는 점도 알려 줍니다.
- 한 페이지에 게시물이 많으면 페이지를 나누거나 순서대로 불러와 Threads의 레이트 리밋을 피합니다. 실제로 표시됐는지로 성공 여부를 판단하고, 실패한 게시물은 원문 링크가 있는 대체 카드로 바꾸며, 실패가 이어지면 잠시 멈췄다가 다시 시작합니다.
- 게시물이 아직 있는지 주기적으로 확인할 때는 oEmbed를 쓰고, `code 24`(Media Not Found)가 돌아올 때만 삭제하며 다른 오류는 일시적인 문제로 처리합니다.

embed.js의 로딩 방식은 공식 문서에 없습니다. 이 부분은 2026년 10월에 실제 embed.js 코드를 읽고 확인한 내용과 실제로 운영 중인 게시물 갤러리의 경험을 바탕으로 하며, Meta가 앞으로 바꿀 수 있습니다.

### 설치하면 달라지는 점

Claude는 원래도 Threads API의 기본 사용법을 알고 있지만, 상당수 규칙은 문서의 세부 사항이나 최근 changelog에 숨어 있습니다. 테스트에서 스킬이 없는 Claude는 아래와 같은 실수를 했고, 스킬을 설치한 뒤에는 하나도 나타나지 않았습니다.

- 고스트 게시물(ghost post)에 투표를 붙일 수 있는지 확신하지 못하고, "일단 보내 보자"는 선택지까지 제시했습니다. 문서에는 고스트 게시물이 지원하는 유일한 부가 기능이 텍스트 스포일러(text spoiler)이며 투표는 붙일 수 없다고 명시되어 있습니다.
- `profile_lookup`은 팔로워 1,000명 이상인 계정만 조회할 수 있다고 하거나, 기준 자체를 언급하지 않았습니다. 이 기준은 2025년 11월에 100명으로 낮아졌습니다.
- 중첩 답글 자체에 숨기기를 먼저 호출하고, 실패한 뒤에야 상위 답글을 처리했습니다. API는 최상위 답글만 숨길 수 있으며, 숨기면 그 아래 스레드 전체가 함께 숨겨집니다.
- 페이지네이션에서 `paging.next`만 봤습니다. 문서에는 게시물 목록 응답에 이 필드가 없다고 명시되어 있어, 문서대로라면 첫 페이지만 가져오게 됩니다.
- 토큰을 갱신할 때 문서에 정해진 조건을 확인하지 않았습니다. 토큰은 발급된 지 24시간이 지났고 아직 만료되지 않았을 때만 갱신할 수 있습니다.
- embed.js가 로드될 때 페이지를 한 번만 훑는다고 생각해 게시물마다 별도의 iframe 페이지로 감쌌습니다. 실제로는 게시물을 추가한 뒤 `window.instgrm.Embeds.process()`를 호출하면 embed.js가 페이지를 다시 훑습니다.
- 삭제된 게시물을 확인하려면 Meta 앱과 토큰이 있어야 한다고 생각해 threads.com 페이지를 스크레이핑했습니다. oEmbed는 2026년 3월부터 토큰 없이 쓸 수 있고, 게시물이 없으면 `code 24`를 분명하게 반환합니다.

스킬은 공식 예제 중 그대로 따라 하면 안 되는 오류(예: GET 요청을 `curl -F`로 보내는 것)도 짚어 줍니다. 문서가 불분명하거나 서로 모순되는 부분은 임의로 가정하지 않고 사실대로 설명합니다.

## 설정

### 환경 변수

| 변수 | 용도 | 기본값 |
|---|---|---|
| `THREADS_ACCESS_TOKEN` | 대행 모드와 참조 클라이언트가 쓰는 Threads 사용자 토큰. 프로젝트 폴더의 `.env`에 적어도 됩니다 | 없음, 대행 모드에서는 필수 |
| `THREADS_APP_ID`, `THREADS_APP_SECRET` | 개발 모드에서 생성한 OAuth·토큰 교환 코드가 읽는 Threads App ID와 시크릿(Facebook 쪽 값이 아님) | 없음 |
| `THREADS_API_BASE` | 참조 클라이언트가 호출하는 API 주소 | `https://graph.threads.net/v1.0` |

토큰 설정(택 1):

- macOS/Linux: AI 도구를 실행하기 전에 `export THREADS_ACCESS_TOKEN="<토큰>"` 실행
- Windows PowerShell: AI 도구를 실행하기 전에 `$env:THREADS_ACCESS_TOKEN="<토큰>"` 실행
- 프로젝트 폴더의 `.env`에 `THREADS_ACCESS_TOKEN=<토큰>` 한 줄을 적고, `.env`를 `.gitignore`에 추가

스킬은 Claude가 토큰을 환경 변수를 통해서만 실행할 명령에 전달하도록 하며, 대화나 코드, commit에는 남기지 않게 합니다.

### 토큰과 권한 받기

아직 토큰이 없다면 Claude에게 "Threads API access token은 어떻게 받나요?"라고 물어보세요. Meta App 생성(사용 사례는 "Access the Threads API" 선택), 계정을 Threads 테스터로 추가, OAuth 흐름 진행, 유효 기간 약 60일의 장기 토큰으로 교환하는 과정까지 안내해 줍니다. 테스트 단계에서는 Graph API Explorer로 생성할 수도 있습니다.

토큰에는 해당 작업에 맞는 권한이 있어야 합니다.

| 작업 | 권한 |
|---|---|
| 모든 호출 | `threads_basic` |
| 게시 | `threads_content_publish` |
| 답글 작성, 답글 숨기기, 답글 검토 | `threads_manage_replies`(답글 작성에는 `threads_content_publish`도 필요) |
| 답글 읽기 | `threads_read_replies` |
| 인사이트 조회 | `threads_manage_insights` |
| 게시물 삭제 | `threads_delete` |
| 키워드·토픽 태그 검색 | `threads_keyword_search` |
| 멘션 | `threads_manage_mentions` |
| 위치 검색과 태그 | `threads_location_tagging` |
| 공개 계정 조회 | `threads_profile_discovery` |
| Instagram 스토리에 함께 공유 | `threads_share_to_instagram` |

App Review를 통과하기 전에는 권한을 본인과 테스터 계정에만 쓸 수 있고, 일부 기능은 결과도 제한됩니다(예: 키워드 검색 시 내 게시물만 검색됨).

## 문서

스킬 본체는 [`threads-api/SKILL.md`](threads-api/SKILL.md)이며, 총 14개 섹션으로 구성되어 있습니다.

| 섹션 | 내용 |
|---|---|
| 1 | 핵심 개념: API 주소, 2단계 게시, container ID와 media ID의 차이, 쓰기와 읽기에서 쓰는 열거값이 다른 점 |
| 2–3 | 개발 모드, 대행 모드의 작업 흐름 |
| 4 | 게시: 게시물 유형별 흐름, 파라미터 표, 기능 호환성, 글자 수와 미디어 사양, container 상태 |
| 5 | 읽기와 검색: 프로필, 게시물, 멘션, 공개 계정, 키워드·토픽 태그 검색, 위치, 페이지네이션 |
| 6 | 답글과 답글 관리: 읽기, 숨기기, 답글 검토 |
| 7 | 인사이트(Insights): 게시물 단위와 계정 단위 지표 |
| 8 | 권한, App Review, OAuth, 토큰 갱신 |
| 9 | 할당량과 레이트 리밋 |
| 10 | Webhook |
| 11 | 게시물 임베드: oEmbed, embed.js 로딩 방식, 대량 임베드 시 속도 조절과 실패 처리, Web Intents |
| 12 | 문제 해결: 자주 발생하는 오류의 원인과 해결 방법 |
| 13 | 공식 예제 중 그대로 따라 하면 안 되는 오류 |
| 14 | 참조 클라이언트 `threads_client.py` |

*(practice)*로 표시된 엔지니어링 권장 사항과 *(observed)*로 표시된 실측 결과를 제외한 나머지 내용은 모두 공식 문서에 근거합니다.

변경 이력은 [CHANGELOG.ko.md](CHANGELOG.ko.md)에 있습니다.

### 참조 클라이언트

14번 섹션의 `threads_client.py`는 Python 표준 라이브러리(3.8 이상)만 사용하므로 패키지를 설치할 필요가 없습니다. 대행 모드에서는 Claude가 이 클라이언트로 API를 호출하고, 개발 모드에서는 이 로직을 참고해 프로젝트의 언어로 다시 작성합니다. 직접 쓰고 싶다면 해당 코드를 `threads_client.py`로 저장하세요(Windows에서는 `python3` 대신 `python`).

```bash
python3 threads_client.py get me fields=id,username   # 계정 확인
python3 threads_client.py check spec.json             # 로컬에서 내용만 검사, API 호출 없음
python3 threads_client.py publish spec.json           # 검사 → container 생성 → 처리 완료 대기 → 게시 → URL 출력
python3 threads_client.py delete <media-id>           # 게시물 삭제, 되돌릴 수 없음
```

`spec.json`에는 container 파라미터를 넣습니다. 예를 들어 투표가 붙은 게시물은 다음과 같습니다.

```json
{"media_type": "TEXT", "text": "라이트 로스트 vs 다크 로스트?", "poll_attachment": {"option_a": "라이트", "option_b": "다크"}}
```

## 테스트 결과

같은 모델로 "스킬 있음"과 "스킬 없음"을 비교했습니다. 각 문제를 두 설정에서 한 번씩 실행하고, 답변에 참여하지 않은 채점자가 미리 정해 둔 체크 항목에 따라 하나씩 판정했습니다. 라운드 사이마다 채점 의견을 반영해 스킬을 수정했고, 총 다섯 라운드를 진행했습니다. 4라운드는 스킬에 게시물 임베드 내용을 추가한 뒤 새로 만든 6번 문제만, 5라운드는 새로 만든 7–10번 문제만 실행했습니다. 문제와 체크 항목은 [`evals/evals.json`](evals/evals.json)에 있습니다.

각 칸은 통과한 체크 항목 수이며, "스킬 있음 vs 스킬 없음" 형식입니다.

| 문제 | 1라운드 | 2라운드 | 3라운드 | 4라운드 | 5라운드 |
|---|---|---|---|---|---|
| 1. Python 캐러셀 게시물(이미지 2장 + 동영상 1개) | 8/8 vs 8/8 | — | — | — | — |
| 2. TypeScript 일일 인사이트 스케줄러와 토큰 갱신 | 9/9 vs 7/9 | 9/9 vs 7/9 | 9/9 vs 9/9 | — | — |
| 3. 투표가 붙은 고스트 게시물 대리 게시 | 6/6 vs 3/6 | 7/7 vs 4/7 | 7/7 vs 5/7 | — | — |
| 4. 검색, 위치, 계정 조회 결과가 이상한 원인 | — | 6/6 vs 5/6 | 6/6 vs 5/6 | — | — |
| 5. 키워드가 포함된 답글 자동 숨기기 | — | 7/7 vs 6/7 | 7/7 vs 6/7 | — | — |
| 6. 게시물 60개짜리 Threads 월과 삭제된 게시물 주간 점검 | — | — | — | 8/8 vs 2/8 | — |
| 7. 답글과 멘션을 받는 FastAPI webhook | — | — | — | — | 8/8 vs 8/8 |
| 8. Express OAuth 로그인과 장기 토큰 갱신 | — | — | — | — | 8/8 vs 7/8 |
| 9. 문제가 많은 Python 게시 코드 리뷰 | — | — | — | — | 8/8 vs 6/8 |
| 10. 이모지가 들어간 스레드를 다음 날 오전 8시에 대리 게시 | — | — | — | — | 7/7 vs 6/7 |
| **평균 통과율** | **100% vs 76%** | **100% vs 76%** | **100% vs 85%** | **100% vs 25%** | **100% vs 87%** |

- 평균 통과율은 문제별 통과율의 평균입니다. 1번 문제는 양쪽 모두 만점이라 차이를 가릴 수 없어서 2라운드부터는 2–5번 문제를 사용했습니다. 3번 문제는 2라운드부터 체크 항목이 하나 늘었습니다.
- 문제마다 설정별로 한 번씩만 실행해 표본이 매우 작으므로, 수치는 경향 정도로만 봐 주세요. 예를 들어 2번 문제의 스킬 없는 버전은 처음 두 라운드에서 페이지네이션과 토큰 갱신에서 감점됐지만, 3라운드에서는 만점을 받았습니다.
- 스킬이 없을 때의 감점은 거의 모두 코드를 못 짜서가 아니라 문서에 있는 규칙을 몰라서 생겼습니다. "설치하면 달라지는 점"에 나온 예시는 모두 이 테스트에서 나온 것입니다. 5라운드에서는 스킬 없음 설정도 웹에서 공식 문서를 검색할 수 있었고 실제로 찾아봤기 때문에, 차이가 100% vs 87%로 줄었습니다.

라운드별 평가 설정, 소요 시간과 토큰 사용량, 감점 항목별 원인은 [benchmark 요약](evals/BENCHMARK.ko.md)을, 항목별 판정과 채점자가 첨부한 근거는 [evals/benchmark.json](evals/benchmark.json)을 참고하세요.

## 알려진 제한 사항

- 내장 클라이언트는 모의 API에서만 테스트했고, 실제 계정으로 게시해 보지는 않았습니다.
- 테스트는 Claude에서만 진행했습니다. 다른 도구에서도 같은 흐름으로 동작할 것으로 보지만 실제로 검증하지는 않았습니다.
- Claude 앱은 기본적으로 Threads API에 접속할 수 없으므로, 대행 모드는 여러분의 컴퓨터에서 실행해야 합니다. 대행 모드에는 터미널 명령을 실행할 수 있는 도구도 필요합니다.
- 공식 문서에는 서로 모순되거나 불분명한 부분이 몇 군데 있습니다. 예를 들어 위치 검색에 `q`를 써야 하는지 `query`를 써야 하는지, 고스트 게시물에 지원하지 않는 기능을 붙이면 API가 오류를 내는지 그냥 무시하는지, webhook에 App Review가 필요한지 등입니다. 스킬은 이런 경우 임의로 가정하지 않고 사실대로 설명합니다.
- embed.js의 로딩 동작(한 번에 최대 3개 로드, `instgrm.Embeds.process()`, `data-theme` 등)은 공식 문서에 없으며 2026년 10월에 관찰한 내용입니다. Meta가 언제든 바꿀 수 있습니다.
- 문서 스냅샷은 2026-08-18 기준입니다. 이후 변경 사항은 [공식 changelog](https://developers.facebook.com/documentation/threads/changelog)를 따르세요.
- Threads 광고(Marketing API에 속함)는 다루지 않습니다.

## 기여하기

규칙 오류 제보, 실수하기 쉬운 지점 추가, 사이트 개선 모두 환영합니다.

- 절차, 저장소 구성, 함께 업데이트해야 할 부분: [기여 가이드](.github/CONTRIBUTING.ko.md)
- [행동 강령](.github/i18n/CODE_OF_CONDUCT.ko.md)
- 보안 문제는 공개 issue가 아니라 [보안 정책](.github/SECURITY.ko.md)에 따라 비공개로 제보해 주세요.
- 소개 사이트의 접근성: [접근성 선언문](.github/ACCESSIBILITY.ko.md)

## 라이선스

[MIT](LICENSE)
