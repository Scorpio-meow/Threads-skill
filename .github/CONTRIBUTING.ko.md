# 기여하기

[繁體中文](/.github/CONTRIBUTING.md) | [English](/.github/CONTRIBUTING.en.md) | [日本語](/.github/CONTRIBUTING.ja.md) | **한국어**

도와주셔서 고맙습니다. 이 프로젝트는 AI 어시스턴트용 스킬(`threads-api/SKILL.md`), 평가 데이터, 소개 사이트의 세 부분으로 이루어져 있습니다. 참여하기 전에 [행동 강령](/.github/i18n/CODE_OF_CONDUCT.ko.md)을 읽어 주세요.

## 도울 수 있는 방법

| 하고 싶은 일 | 창구 |
|---|---|
| 스킬 내용이 Meta 공식 문서나 API의 실제 동작과 다르거나, 규칙이 빠져 있음 | issue를 열고 "규칙 오류·누락·오래된 정보"를 선택 |
| 설치에 실패했거나, 스킬이 활성화되지 않거나, 스킬을 설치했는데도 AI 어시스턴트가 틀림 | issue를 열고 "스킬 사용 문제"를 선택. 이런 제보는 새 평가 문제로 이어지는 경우가 많습니다 |
| 소개 사이트의 오타, 번역, 레이아웃, 접근성 문제 | issue를 열고 "사이트 문제"를 선택 |
| 사용법 질문, 새 기능 아이디어 | [Discussions](https://github.com/Scorpio-meow/Threads-skill/discussions) |
| 보안 문제 | 공개하지 말고 [보안 정책](/.github/SECURITY.ko.md)에 따라 비공개로 제보 |

issue와 PR은 번체 중국어, 영어, 일본어, 한국어 중 어느 언어로 써도 됩니다. 어디에 글을 쓰든 토큰, App 시크릿, 개인 정보는 (본인 것을 포함해) 올리지 마세요.

## 저장소 구성

| 경로 | 내용 |
|---|---|
| [`threads-api/SKILL.md`](/threads-api/SKILL.md) | 스킬 본체. 영어, 총 14개 섹션 |
| [`evals/evals.json`](/evals/evals.json) | 평가 문제와 체크 항목 |
| `evals/BENCHMARK*.md`, [`evals/benchmark.json`](/evals/benchmark.json) | 평가 요약(4개 언어)과 항목별 판정 |
| [`docs/`](/docs/) | 소개 사이트. `main`의 `/docs`에서 GitHub Pages로 게시 |
| `README*.md` | 프로젝트 설명(4개 언어) |
| [`CHANGELOG*.md`](/CHANGELOG.ko.md) | 변경 이력(4개 언어) |
| [`.github/`](/.github/) | 커뮤니티 파일(이 가이드, 행동 강령, 보안 정책, 접근성 선언문, 각각 4개 언어), issue 양식과 PR 템플릿. `.github/`에 행동 강령이 여러 개 있으면 GitHub가 번체 중국어 버전을 보여 준다는 보장이 없어서, 행동 강령의 영어·일본어·한국어 버전은 `i18n/`에 둠 |

## 스킬 수정하기

- `threads-api/SKILL.md`를 직접 수정하고, 영어로 작성하세요.
- 공식 문서에 근거한 내용은 원래 의미대로 적으세요. 문서에 없는 엔지니어링 경험에 따른 권장 사항에는 *(practice)*를, 문서에는 없지만 실제 테스트에서 확인한 동작에는 *(observed)*를 붙이고 확인한 연월도 적어 주세요.
- 공식 문서끼리 서로 맞지 않거나 분명하지 않은 부분은 추측으로 채우지 말고 그대로 적으세요.
- 14절의 참고 클라이언트 `threads_client.py`는 Python 표준 라이브러리만 사용하며, Python 3.8 이상에서 동작해야 합니다.
- 사이트의 "보내기 전에 먼저 검사"는 `check()`를 JS로 옮긴 것([`docs/assets/js/client.js`](/docs/assets/js/client.js))입니다. `check()`를 바꾸면 JS 버전도 함께 수정하고, 같은 spec에 대해 오류, 경고, 글자 수, 링크 수가 양쪽에서 같게 나오는지 확인하세요.
- 스킬 내용을 바꾸면 SKILL.md 프런트매터의 `metadata.version`을 올리세요(예: 1.1 → 1.2). 변경 이력과 Agensi에서도 같은 번호를 씁니다.

## 평가 다시 실행하기

- 스킬 내용을 바꾼 뒤에는 Anthropic의 skill-creator 스킬로 `evals/evals.json`에 따라 "스킬 있음 vs 스킬 없음" 비교를 다시 실행해 성능이 떨어지지 않았는지 확인하고, `evals/BENCHMARK*.md`와 `evals/benchmark.json`을 업데이트하세요.
- 새로 실수하기 쉬운 지점을 발견하면 `evals/evals.json`에 문제를 추가할 수 있습니다. 통과 여부를 하나씩 판정할 수 있는 체크 항목도 함께 적어 주세요.
- 테스트 결과가 바뀌면 README의 "테스트 결과"와 사이트의 평가 수치도 업데이트하세요.

## 사이트 수정하기

- 빌드 단계가 없는 정적 사이트입니다. 브라우저에서 `docs/index.html`을 바로 열면 미리 볼 수 있고, 로컬 서버가 필요하면 저장소 루트에서 `bunx serve docs`를 실행하세요.
- 번체 중국어 텍스트는 `docs/index.html`에 직접 들어 있고, 영어·일본어·한국어 텍스트는 `docs/assets/js/lang/{en,ja,ko}.js`에 `data-i18n` 키로 대응되어 있습니다. 스크립트가 만드는 번체 중국어 메시지는 `docs/assets/js/lang/zh.js`에 있습니다.
- 사이트에도 테스트 결과, 문서 스냅샷 날짜, 각 섹션의 주요 수치가 실려 있으니 이 내용이 바뀌면 사이트도 함께 업데이트하세요.
- 사이트를 수정할 때 [ACCESSIBILITY.md](/.github/ACCESSIBILITY.ko.md)에 적힌 지원 항목이 후퇴하지 않게 해 주세요.

## 문서와 번역

- README, benchmark 요약, 변경 이력, 이 가이드, 행동 강령, 보안 정책, 접근성 선언문, issue 양식, PR 템플릿은 번체 중국어, 영어, 일본어, 한국어 네 가지 버전이 있으니 수정할 때 모두 업데이트해 주세요. 쓸 수 없는 언어가 있으면 PR에 적어 주시면 메인테이너가 번역을 돕겠습니다.
- 변경 사항은 [CHANGELOG.ko.md](/CHANGELOG.ko.md)의 "미출시" 항목에 기록하고, 다른 3개 언어 버전도 함께 업데이트하세요.
- 문서를 추가하거나 옮기면 [`docs/llms.txt`](/docs/llms.txt)의 링크도 업데이트하세요.

## 풀 리퀘스트 보내기

1. 저장소를 fork하고 `main`에서 새 브랜치를 만드세요.
2. PR 하나에는 변경 하나만 담아 주세요. 스킬 내용을 바꿀 때는 공식 문서나 changelog 링크를 PR에 첨부하고, 실측 결과라면 토큰을 지운 요청과 응답을 첨부하세요.
3. 커밋 메시지는 [Conventional Commits](https://www.conventionalcommits.org/ko/v1.0.0/) 형식을 따르세요. 예: `docs: 설치 안내 업데이트`, `feat(site): 일본어 전환 추가`.
4. PR 템플릿의 체크리스트를 하나씩 확인한 뒤 보내 주세요.

## 라이선스

기여한 내용은 이 프로젝트의 [MIT 라이선스](/LICENSE)로 공개됩니다.
