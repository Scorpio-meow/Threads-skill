# 보안 정책

[繁體中文](/.github/SECURITY.md) | [English](/.github/SECURITY.en.md) | [日本語](/.github/SECURITY.ja.md) | **한국어**

## 지원 버전

이 프로젝트에는 버전 번호가 없으며, `main` 브랜치의 최신 내용만 유지 관리합니다. 수정 사항은 바로 `main`에 병합됩니다. `skills` 명령으로 설치했다면 `bunx skills update`로 수정 사항을 받을 수 있고, 직접 설치했다면 `threads-api` 폴더를 다시 복사하세요.

## 제보 대상

- AI 어시스턴트가 액세스 토큰이나 App 시크릿을 대화, 코드, 로그, 커밋 등에 노출할 수 있는 스킬의 지시.
- 게시물이나 답글 같은 외부 콘텐츠에 유도된 경우(프롬프트 인젝션)를 포함해, 사용자의 명확한 동의 없이 AI 어시스턴트가 게시, 답글, 삭제, 답글 숨기기를 할 수 있는 스킬의 절차.
- 14절 참고 클라이언트 `threads_client.py`의 취약점. 예를 들어 오류 메시지나 로그에 토큰을 출력하는 경우.
- 스킬이 알려 주는 작성 방식 자체의 취약점. 예를 들어 App 시크릿을 프런트엔드 코드에 넣거나, 검증하지 않은 임베드 HTML을 페이지에 그대로 넣는 경우.
- 소개 사이트(`docs/`)의 취약점. 예를 들어 XSS.

## 제보 대상이 아닌 것

- Meta나 Threads API 자체의 취약점: [Meta Bug Bounty](https://bugbounty.meta.com/)에 제보하세요.
- AI 도구(Claude Code, Codex 등) 자체의 취약점: 해당 도구의 개발사에 제보하세요.
- 본인의 토큰이나 App 시크릿이 유출된 경우: 이 프로젝트의 취약점이 아닙니다. 즉시 해당 토큰의 권한을 취소하고 새로 발급받으세요. App 시크릿이 유출됐다면 Meta 앱 대시보드에서 재설정하세요.

## 제보 방법

공개 issue, PR, Discussion은 만들지 마세요.

1. 저장소의 **Security** 탭에서 **Report a vulnerability**를 클릭하거나, [비공개 제보 양식](https://github.com/Scorpio-meow/Threads-skill/security/advisories/new)을 바로 여세요. 제보 내용은 제보자와 메인테이너만 볼 수 있습니다.
2. 영향을 받는 파일과 부분(SKILL.md의 몇 절인지 등), 재현 단계(사용한 AI 도구, 모델, 프롬프트), 예상되는 영향을 적어 주세요. 수정 제안은 선택 사항입니다.
3. 실제 토큰, App 시크릿, 다른 사람의 데이터는 넣지 마세요. 예시가 필요하면 가짜 값을 쓰세요.

## 처리 절차

이 프로젝트는 개인이 관리하며, 최대한 빨리 답하고 진행 상황은 해당 제보 안에서 업데이트합니다. 문제가 확인되면 `main`에서 수정하고, security advisory를 게시하고, [CHANGELOG.ko.md](/CHANGELOG.ko.md)에 기록합니다. 동의하시면 advisory에 감사의 말을 남깁니다.
