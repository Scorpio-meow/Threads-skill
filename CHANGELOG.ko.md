# 변경 이력

[繁體中文](CHANGELOG.md) | [English](CHANGELOG.en.md) | [日本語](CHANGELOG.ja.md) | **한국어**

이 프로젝트의 주요 변경 사항을 여기에 기록합니다. 형식은 [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/)를 참고했습니다. 버전 번호는 `threads-api/SKILL.md`의 `metadata.version`을 따르며, Agensi에서도 같은 번호를 씁니다. 1.0 이전 변경 사항은 날짜별로 정리합니다.

## 1.3 - 2026-10-19

### 변경

- SKILL.md 8절의 `debug_token` 설명을 Meta changelog의 2026-08-18 항목에 맞춰 갱신: `access_token`에는 Threads 테스터의 토큰 외에 앱 액세스 토큰(`TH|<APP_ID>|<APP_SECRET>`)도 쓸 수 있으며, 어느 쪽이든 `input_token`과 같은 앱의 토큰이어야 함. 다른 앱의 토큰을 넘겼을 때의 오류 메시지도 추가. 12절 `code 190` 행에 8절 참조를 넣고, 문서 스냅샷 날짜를 2026-08-18로 갱신(SKILL.md, 4개 언어 README, `docs/llms.txt`, 소개 사이트). `evals/benchmark.json`에서 1–3라운드 2번 문제의 스킬 있음 버전은 모두, 계정이 Threads 테스터가 아니면 `debug_token`으로 90일 권한 승인을 확인하는 단계를 건너뛴다고 적었음. 갱신한 뒤 아직 평가를 다시 실행하지 않음.
- `threads-api/SKILL.md`의 `metadata.version`을 1.3으로 올림.
- 설치 안내:
  - 4개 언어 README의 도구 표에 `bunx skills`의 `-a` 값을 넣고 Google Antigravity, Cline, Kiro, JetBrains Junie, Roo Code를 추가. Windsurf는 Devin Desktop으로 바꾸고 새 경로로 갱신.
  - README에 "그 밖의 설치 방법"(GitHub CLI의 `gh skill`, Codex, Copilot CLI, Gemini CLI, Kiro), "ChatGPT", "업데이트와 삭제" 세 절을 추가.
  - Claude 앱 안내는 대상을 Pro, Max 플랜으로 고치고, 운영체제별 ZIP 압축 방법과 Settings > Capabilities에서 업로드하는 위치도 추가.
  - 사이트의 도구 목록, "수동으로 설치하려면?"·"Claude 앱에서는 어떻게 쓰나요?", `docs/llms.txt`, 사용 문제 issue 양식도 함께 갱신.

## 1.2 - 2026-10-18

### 추가

- 7–10번 문제(답글과 멘션을 받는 FastAPI webhook, Express OAuth 로그인과 장기 토큰 갱신, 문제가 많은 Python 게시 코드 리뷰, 이모지가 들어간 스레드를 다음 날 오전 8시에 대리 게시)와 5라운드 평가 결과. 4개 언어 benchmark 요약과 `evals/benchmark.json`에 기록.

### 변경

- SKILL.md 10절에 *(practice)* 한 줄을 추가: 같은 webhook 이벤트가 여러 번 전달될 수 있으므로 처리를 멱등하게 만들고, 원본 body의 해시가 아니라 `values.field`와 media ID를 키로 씀. 추가한 뒤 아직 평가를 다시 실행하지 않음.
- `threads-api/SKILL.md`의 `metadata.version`을 1.2로 올림.

### 수정

- GitHub 저장소 페이지의 Contributing 등 탭은 커뮤니티 파일의 상대 링크를 저장소 루트 기준으로 해석해서 404가 났음. 저장소 루트부터 세는 `/`로 시작하는 경로로 바꿈.
- GitHub 저장소 페이지의 Code of conduct 탭에 영어 버전이 표시되었음. 행동 강령의 영어·일본어·한국어 버전을 `.github/i18n/`으로 옮겨, 탭에 번체 중국어 버전이 표시되도록 수정.

## 1.1 - 2026-10-18

### 추가

- `threads-api/SKILL.md` 프런트매터에 `license`, `compatibility`(대행 모드에는 Python 3.8 이상, graph.threads.net 접속, 환경 변수나 `.env`의 토큰이 필요), `metadata.version`을 추가.
- 4개 언어 README에 "Agensi" 설치 방법을 추가하고, `docs/llms.txt`에 Agensi 페이지 링크를 추가.
- 변경 이력 `CHANGELOG*.md`(번체 중국어, 영어, 일본어, 한국어).
- `docs/llms.txt`: AI 어시스턴트와 크롤러를 위한 프로젝트 색인. SKILL.md, README, 평가 데이터를 안내합니다.
- 4개 언어 README에 소개 사이트 링크 추가.
- `.github/`에 GitHub 커뮤니티 파일 추가(각각 번체 중국어, 영어, 일본어, 한국어):
  - 기여 가이드 `CONTRIBUTING*.md`: 저장소 구성, 스킬과 사이트를 수정할 때의 규칙, 평가 다시 실행, 번역, PR 절차.
  - 행동 강령 `CODE_OF_CONDUCT*.md`: Contributor Covenant 3.0을 채택하고, 적용 범위와 이메일 또는 GitHub를 통한 신고 방법을 보충.
  - 보안 정책 `SECURITY*.md`: 제보 대상과 GitHub 비공개 취약점 제보를 통한 제보 절차.
  - 접근성 선언문 `ACCESSIBILITY*.md`: 소개 사이트의 지원 현황, 알려진 제한 사항, 장벽 신고 방법.
  - issue 양식: "규칙 오류·누락·오래된 정보", "스킬 사용 문제", "사이트 문제" 세 가지를 언어별로 하나씩 마련. 질문과 보안 제보는 Discussions와 비공개 취약점 제보로 안내합니다.
  - PR 템플릿: 기본은 번체 중국어이며, 영어·일본어·한국어 버전은 `PULL_REQUEST_TEMPLATE/`에 둠.
- 소개 사이트에 "테마" 버튼 추가. 시스템 설정 따름, 라이트, 다크 중에서 고를 수 있고, 선택한 설정은 기억되어 페이지를 그리기 전에 적용됩니다.

### 변경

- `threads-api/SKILL.md` 첫머리의 용도를 두 가지에서 세 가지로 바꾸고 "Embed"(게시물 임베드와 Web Intents)를 추가. 목록에서 절 번호를 빼서 Agensi 같은 스토어 페이지에서도 읽기 쉽게 함.
- 4개 언어 기여 가이드에 스킬 내용을 바꾸면 SKILL.md의 `metadata.version`을 올리고 Agensi에서도 같은 번호를 쓴다는 규칙을 추가.
- 4개 언어 README의 "기여하기"를 요약으로 바꾸고, 자세한 내용은 `.github/CONTRIBUTING*.md`로 옮김.
- 소개 사이트를 시스템 폰트로 변경. Fontshare와 Google Fonts에서 Switzer와 Noto Sans를 불러오지 않으므로, 방문자의 IP 주소가 더 이상 서드파티에 전달되지 않습니다. Segoe UI, Microsoft JhengHei 같은 시스템 폰트에는 500 굵기가 없어 보통 굵기로 표시되므로, 500으로 지정한 굵기를 600으로 변경.
- 언어 메뉴와 테마 메뉴가 `TAS.menu()`(`docs/assets/js/core.js`)를 함께 사용.

### 수정

- 4개 언어 README와 사이트의 자주 묻는 질문에서 라이선스를 "아직 지정하지 않음"에서 MIT로 수정.
- benchmark 요약 일본어판에서 3번 문제의 감점 라운드가 "모든 라운드"로 되어 있던 것을 "세 라운드 모두"로 고쳐 다른 언어와 맞춤.
- 사이트와 README의 영어·일본어·한국어 버전에서 번체 중국어 원문과 맞지 않던 부분을 수정: 토픽 태그(topic tag)를 "해시태그"로 옮긴 부분, "관찰한"(observed)을 "확인한"으로 옮긴 부분, 영어판에서 "최대", "평균", "결정을 맡김", "문서대로라면", "권장", "자동으로" 같은 말이 빠진 부분.
- 소개 사이트의 접근성 문제:
  - "스킬 하나, 세 가지 일"에서 포커스되지 않은 설명을 흐리게 하는 대신 보조 텍스트 색(대비 4.5:1 이상)으로 표시. 옆의 예시는 더 이상 스크린 리더에서 숨기지 않으며, 키보드로 포커스하면 해당 예시로 바뀝니다.
  - 첫 화면 채점 패널의 각 체크 항목에 "통과"/"미통과" 텍스트 추가. "보내기 전에 먼저 검사"의 오류와 주의할 점에 텍스트 레이블과 서로 다른 모양을 붙이고, 상태 줄에서 두 가지의 개수를 모두 알리도록 변경.
  - 스위치, 입력란, 드롭다운, 전환 버튼의 경계 대비를 3:1 이상으로 높임(색상 토큰 `--control-line` 추가). 본문 링크의 밑줄을 진하게 하고, 일부 필드에 브라우저 기본 스타일이 남던 선택자 버그를 수정. 다크 모드 "만료" 레이블의 대비를 높임.
  - 강제 색상(Windows 고대비) 지원. 동작 줄이기를 켜면 펼치기, 슬라이드, 누르기 같은 작은 애니메이션도 끄도록 변경.
  - 스크립트를 불러오지 못해도 내용이 숨겨진 채로 남지 않도록 수정. 인쇄할 때 아직 스크롤하지 않은 부분이 비어 있지 않고, "스킬에 담긴 내용"의 탭 8개가 모두 펼쳐지도록 변경.
  - 스크롤이 필요한 코드 블록과 표를 키보드로 포커스할 수 있도록 변경. 설치 명령 생성기를 한 번 조작한 뒤에는 옵션을 바꾸면 새 명령을 읽어 줍니다. 복사 완료 메시지는 사라진 뒤 제거하고, 언어를 바꿀 때 검사 결과를 다시 읽지 않도록 수정.
  - 제목과 언어 버튼의 텍스트가 붙어서 읽히지 않도록 수정. 낮은 창에서는 탭 막대를 화면 위쪽에 고정하지 않도록 변경. 일본어 버전을 너비 320px로 볼 때 제목이 화면 밖으로 넘어가지 않도록 수정.
  - JavaScript가 꺼져 있으면 동작하지 않는 컨트롤을 숨기고 대신 안내 문구를 표시하며, "스킬 없음" 답변도 보이도록 변경.
  - 타임라인 막대에 들어가지 않는 레이블은 잘려 보이는 대신 숨기도록 변경.
  - 좁은 화면에서 헤더의 링크가 다 들어가지 않으면 두 번째 줄로 내려 사이트 이름과 겹치지 않도록 수정.

## 1.0 - 2026-10-18

### 추가

- 스킬을 1.0 버전으로 [Agensi](https://agensi.io/skills/threads-api)에 무료로 공개. 내용은 2026-10-14 시점의 `threads-api/SKILL.md`와 같음.

## 2026-10-16

### 추가

- 소개·데모 사이트 `docs/`. main의 `/docs`에서 GitHub Pages로 게시:
  - 첫 화면에 3라운드 3번 문제의 실제 답변을 발췌. 스킬 있음/없음을 전환할 수 있고, 채점자의 체크 항목 7개도 보여 줌.
  - "보내기 전에 먼저 검사": 14절 `check()`를 JS로 옮긴 것. Python 버전과 spec 8개로 비교해 오류, 경고, 글자 수, 링크 수가 모두 같은지 확인.
  - 세 가지 사용법, 실수하기 쉬운 지점 6가지, 4개 라운드의 평가 수치와 문제별 표, 각 섹션의 주요 수치, 설치 명령 생성기, 자주 묻는 질문. 라이트/다크 테마와 모바일 레이아웃.
- 사이트 언어 전환: 번체 중국어, 영어, 일본어, 한국어.
- 사이트 로고, 파비콘, 공유용 미리보기 이미지.
- MIT 라이선스(`LICENSE`).

### 변경

- 사이트의 스타일과 스크립트를 `docs/index.html`에서 `docs/assets/css/`, `docs/assets/js/`로 나누고, 이미지를 `docs/assets/img/`로 옮김.

## 2026-10-14

### 추가

- `threads-api` 스킬(`threads-api/SKILL.md`). Meta 공식 문서를 정리했으며, 2026-08-12 changelog까지 반영.
- 평가 문제 `evals/evals.json`, benchmark 요약 `evals/BENCHMARK.md`, 채점 데이터 `evals/benchmark.json`.
- 6번 문제(게시물 60개를 모은 월과, 삭제된 게시물의 주간 확인)와 4라운드 평가 결과.
- README와 benchmark 요약의 영어·일본어·한국어 버전.

### 변경

- SKILL.md 11절을 "oEmbed and Web Intents"에서 게시물 임베드 전반으로 확장: 토큰이 필요 없는 oEmbed와 오류 코드, embed.js가 게시물을 불러오는 방식, 임베드가 많을 때의 속도 조절과 실패 처리.
- SKILL.md의 description을 196자로 줄임.
- README를 다시 작성: 도구별 설치 방법, 한 줄로 설치하는 `skills add` 명령, 설정과 권한 대응표, 기여 안내.
