# 보안 정책

[繁體中文](https://github.com/Scorpio-meow/Threads-skill/blob/HEAD/.github/SECURITY.md) | [English](https://github.com/Scorpio-meow/Threads-skill/blob/HEAD/.github/SECURITY_en.md) | [日本語](https://github.com/Scorpio-meow/Threads-skill/blob/HEAD/.github/SECURITY_ja.md) | **한국어**

## 지원 버전

이 프로젝트에는 버전 번호가 없으며, `main` 브랜치의 최신 내용만 유지 관리합니다. 수정 사항은 바로 `main`에 병합됩니다. `skills` 명령으로 설치했다면 `bunx skills update`로 수정 사항을 받을 수 있고, 직접 설치했다면 `threads-api` 폴더를 다시 복사하세요.

## 취약점 제보

**공개 issue, Pull Request, 토론에 취약점 세부 내용을 공개하지 마세요.**

다음 중 한 가지 방법으로 비공개 제보해 주세요.

1. **GitHub 비공개 제보(권장)**: 저장소의 **Security** 탭에서 **Report a vulnerability**를 클릭하거나, [비공개 제보 양식](https://github.com/Scorpio-meow/Threads-skill/security/advisories/new)을 바로 여세요. 제보 내용은 제보자와 메인테이너만 볼 수 있습니다.
2. **이메일**: GitHub를 쓸 수 없다면 [yao921024@gmail.com](mailto:yao921024@gmail.com)으로 보내고 제목 앞에 `[Security] Threads-skill`을 붙여 주세요. 이메일은 종단 간 암호화되지 않으므로, 먼저 문제를 간단히 요약해 보내고 세부 내용은 답장을 받은 뒤에 보내 주세요.

다음 내용을 가능한 한 포함해 주세요.

- 영향을 받는 파일과 부분(SKILL.md의 몇 절인지 등)
- 재현 단계: 사용한 AI 도구, 모델, 프롬프트
- 예상되는 영향
- 수정 제안(선택)

예시가 필요하면 가짜 값을 쓰고, 실제 토큰, App 시크릿, 다른 사람의 데이터는 넣지 마세요.

## 처리 절차와 기한

개인이 관리하는 프로젝트라 버그 바운티는 없지만, 다음 기한을 지킵니다.

| 단계 | 기한 |
|---|---|
| 접수 확인과 첫 답변 | 제보를 받은 뒤 14일 이내 |
| 취약점 세부 내용 공개 | 수정 배포 시점, 늦어도 제보 후 90일 |

1. **접수 확인**: 제보를 받았음을 알리고 초기 평가를 공유합니다. 이후 진행 상황은 같은 제보 안에서 업데이트합니다.
2. **평가**: 취약점인지, 영향 범위와 심각도를 확인하고, 필요하면 세부 내용을 문의합니다. 취약점이 아니라고 판단하면 이유를 설명합니다.
3. **수정**: 비공개 GitHub Security Advisory에서 수정 방법을 함께 논의합니다. 그 안의 비공개 포크에서 수정을 제출하실 수도 있습니다.
4. **공개**: 수정을 `main`에 병합하고 Security Advisory를 공개합니다. 해당하는 경우 GitHub를 통해 CVE 번호를 신청하고, [CHANGELOG_ko.md](https://github.com/Scorpio-meow/Threads-skill/blob/HEAD/CHANGELOG_ko.md)에 기록합니다.
5. **감사 인사**: 원하시면 Advisory에 감사의 말을 남깁니다.

수정이 배포되기 전에는 취약점의 세부 내용을 공개하지 마세요. 90일 안에 수정하기 어려우면 기한 전에 이유를 설명하고 새 공개 날짜를 함께 정합니다.

## 범위

### 제보 대상

- AI 어시스턴트가 액세스 토큰이나 App 시크릿을 대화, 코드, 로그, 커밋 등에 노출할 수 있는 스킬의 지시.
- 게시물이나 답글 같은 외부 콘텐츠에 유도된 경우(프롬프트 인젝션)를 포함해, 사용자의 명확한 동의 없이 AI 어시스턴트가 게시, 답글, 삭제, 답글 숨기기를 할 수 있는 스킬의 절차.
- 참고 클라이언트 `threads-api/scripts/threads_client.py`의 취약점. 예를 들어 오류 메시지나 로그에 토큰을 출력하는 경우.
- 스킬이 알려 주는 작성 방식 자체의 취약점. 예를 들어 App 시크릿을 프런트엔드 코드에 넣거나, 검증하지 않은 임베드 HTML을 페이지에 그대로 넣는 경우.
- 소개 사이트(`docs/`)의 취약점. 예를 들어 XSS.

### 제보 대상이 아닌 것

- Meta나 Threads API 자체의 취약점: [Meta Bug Bounty](https://bugbounty.meta.com/)에 제보하세요.
- AI 도구(Claude Code, Codex 등) 자체의 취약점: 해당 도구의 개발사에 제보하세요.
- 본인의 토큰이나 App 시크릿이 유출된 경우: 이 프로젝트의 취약점이 아닙니다. 즉시 해당 토큰의 권한을 취소하고 새로 발급받으세요. App 시크릿이 유출됐다면 Meta 앱 대시보드에서 재설정하세요.
