# 09. TDD 개발 워크플로우

- 상태: 초안
- 작성일: 2026-03-25
- 목적: 이 프로젝트의 구현 작업을 **테스트 우선(TDD)** 방식으로 진행하기 위한 공통 기준 정의

이 문서는 앞으로의 실제 개발 작업에서 따를 **기본 구현 원칙**을 정리합니다.
핵심은 다음 한 줄입니다.

> 기능 코드는 가능한 한 **실패하는 테스트를 먼저 작성한 뒤**, 그 테스트를 통과시키는 최소 구현을 만들고, 마지막에 구조를 정리한다.

---

## 0) 왜 TDD로 가는가

현재 프로젝트는 다음 특징을 가집니다.

- 도메인 규칙이 많다
  - 예약 상태 전이
  - 역할별 권한
  - 상호 리뷰 여부
  - 알림 생성 조건
- 문서는 꽤 상세하지만 실제 구현은 아직 초기 단계다
- 관리자/사용자/제공자 구분이 있어 회귀가 쉽게 발생할 수 있다

이런 종류의 프로젝트는 UI보다 **도메인 규칙**이 더 자주 깨집니다.
그래서 이 프로젝트에서 TDD는 선택이 아니라, 구현 속도를 늦추지 않으면서 품질을 유지하는 가장 현실적인 방법입니다.

---

## 1) 기본 원칙

### 1.1 Red → Green → Refactor

모든 기능 작업은 가능한 한 아래 순서를 따릅니다.

1. **Red**
   - 실패하는 테스트를 먼저 작성
   - 요구사항이 테스트 이름과 assertion으로 드러나야 함
2. **Green**
   - 테스트를 통과시키는 최소 구현 작성
   - 이 단계에서는 과한 추상화 금지
3. **Refactor**
   - 중복 제거
   - 이름 정리
   - 구조 개선
   - 테스트는 계속 통과해야 함

### 1.2 테스트 없는 새 도메인 로직은 기본적으로 미완성으로 본다

다음 항목은 테스트 없이 merge하지 않는 것을 원칙으로 합니다.

- 예약 상태 전이
- 권한 체크
- 입력 검증
- 리뷰 생성 규칙
- 알림 생성 규칙
- 관리자 액션

### 1.3 구현보다 테스트 명세가 먼저다

새 기능을 만들 때는 먼저 아래 둘 중 하나가 있어야 합니다.

- failing test
- 또는 테스트 케이스 목록이 포함된 문서/이슈

문서도 없고 테스트도 없는 상태에서 코드부터 쓰지 않습니다.

---

## 2) 테스트 계층

이 프로젝트는 다음 4층 테스트 구조를 기본으로 합니다.

### 2.1 Unit Test

대상:

- pure function
- formatter
- validator
- 상태 전이 함수
- DTO mapper

목적:

- 가장 빠르게 도메인 규칙을 고정
- 실패 원인 추적이 쉬움

예시:

- `canCancelBooking(status, actor)`
- `validateBookingInput(payload)`
- `getVisibleActions(role, bookingStatus)`

### 2.2 Integration Test

대상:

- route handler
- server action
- service layer
- DB 쿼리

목적:

- 권한, 입력, 트랜잭션, 응답 구조를 함께 검증

예시:

- customer는 본인 booking만 조회 가능
- cleaner는 `pending` booking만 수락 가능
- booking 완료 시 알림이 생성됨

### 2.3 Component Test

대상:

- form
- table
- dialog
- status badge
- page-level client component

목적:

- 실제 사용자 상호작용과 UI 상태 변화 검증

예시:

- 예약 생성 폼에서 필수값 누락 시 에러 메시지 표시
- 관리자 상태 변경 후 성공 토스트와 목록 갱신 확인

### 2.4 E2E Test

대상:

- 로그인
- 예약 생성
- 예약 수락
- 상태 변경
- 관리자 대시보드 핵심 플로우

목적:

- 실제 사용자 가치가 살아 있는지 최종 검증

E2E는 모든 화면에 붙이는 것이 아니라, **핵심 수익/운영 흐름**에만 우선 적용합니다.

---

## 3) 기능별 TDD 기준

### 3.1 백엔드

백엔드 기능은 아래 순서를 기본으로 합니다.

1. validator unit test
2. service unit/integration test
3. route handler test
4. 필요 시 E2E

예:

- `POST /api/v1/bookings`
  1. 예약 입력 validator 테스트
  2. booking 생성 service 테스트
  3. API 응답 테스트
  4. 예약 생성 E2E

### 3.2 프론트엔드

프론트 기능은 아래 순서를 기본으로 합니다.

1. acceptance 시나리오 정의
2. component test 작성
3. 최소 UI 구현
4. 필요 시 E2E 추가

예:

- 예약 생성 화면
  1. “필수값 없으면 제출 불가”
  2. “정상 제출 시 완료 화면 이동”
  3. “서버 에러 시 재시도 안내 표시”

### 3.3 디자인 시스템 / 공용 UI

공용 컴포넌트도 테스트 대상입니다.

- variant 렌더링
- disabled/loading/focus 상태
- 접근성 role/name
- keyboard interaction

디자인 토큰 변경은 시각 검토와 함께 테스트 또는 스냅샷 검증이 따라와야 합니다.

---

## 4) 도구 전략

현재 저장소에는 아직 테스트 스택이 설치되어 있지 않습니다.
도입 방향은 아래를 기준으로 합니다.

### 4.1 권장 도구

- Unit / Integration: `Vitest`
- React Component Test: `@testing-library/react`
- User interaction: `@testing-library/user-event`
- Network mocking: `MSW`
- E2E: `Playwright`

### 4.2 도입 원칙

- 처음부터 모든 도구를 한 번에 넣지 않는다
- 가장 먼저 `Vitest`와 Testing Library부터 도입
- 핵심 플로우가 살아난 뒤 `Playwright`를 추가

### 4.3 테스트 실행 규칙

도입 후 기본 커맨드는 아래 형태를 목표로 합니다.

```bash
pnpm test
pnpm --filter @crs/web test
pnpm --filter @crs/web test:e2e
```

---

## 5) Definition of Done

작업 완료의 최소 기준은 다음과 같습니다.

### 5.1 도메인 기능

- 요구사항이 테스트 케이스로 표현되어 있음
- 정상 흐름 테스트가 있음
- 실패 흐름 테스트가 있음
- 권한 또는 입력 검증 테스트가 있음
- 구현 후 리팩터링까지 끝남

### 5.2 UI 기능

- 로딩 상태가 있음
- 에러 상태가 있음
- 빈 상태가 있으면 empty state가 있음
- 사용자 상호작용 테스트가 있음

### 5.3 보안/권한 기능

- 허용 케이스 테스트
- 거부 케이스 테스트
- 경계 케이스 테스트

---

## 6) 이 프로젝트에서 먼저 테스트해야 할 것

초기 우선순위는 아래와 같습니다.

### 6.1 P1

- auth session 존재/부재 처리
- role 기반 접근 제어
- booking 상태 전이
- booking 생성 입력 검증
- review 생성 규칙

### 6.2 P2

- cleaner 검색 필터
- 관리자 사용자 목록 필터/정렬
- 메시지 폴링/읽음 처리
- 알림 생성 규칙

### 6.3 P3

- 공용 UI variant
- 시각 회귀
- 성능 예산 체크

---

## 7) 작업 단위 예시

좋은 작업 단위 예시:

- “booking 생성 validator와 service를 TDD로 구현”
- “admin users table의 필터/정렬을 component test부터 구현”
- “customer가 본인 booking만 조회 가능한지 integration test부터 구현”

나쁜 작업 단위 예시:

- “예약 기능 전부 만들기”
- “대시보드 전체 구현”

작업 단위는 반드시 **테스트 가능한 조각**으로 쪼갭니다.

---

## 8) Codex / OMX 작업 원칙

이 프로젝트에서 Codex/OMX를 이용한 구현도 같은 기준을 따릅니다.

1. 작업 시작 전:
   - 대상 기능의 테스트 범위를 먼저 정리
2. 구현 중:
   - failing test를 먼저 추가
3. 구현 후:
   - 테스트 통과 확인
   - 리팩터링
   - 문서/체크리스트 갱신

즉, 앞으로 “기능 먼저, 테스트 나중” 방식이 아니라,
**테스트를 먼저 고정하고 기능을 그에 맞춰 채우는 방식**으로 진행합니다.

---

## 9) 즉시 다음 단계

현재 저장소 기준으로는 아래 순서가 적절합니다.

1. `apps/web` 테스트 스택 도입
   - Vitest
   - Testing Library
   - 기본 설정 파일
2. 첫 번째 도메인 TDD 대상 선정
   - 권장: booking validator 또는 auth/RBAC
3. `test` 스크립트를 placeholder에서 실제 실행 커맨드로 교체
4. 첫 번째 Red-Green-Refactor 사이클 수행

---

## 10) 결론

이 프로젝트에서 TDD는 “테스트를 잘 챙기자” 수준의 선언이 아니라,
**도메인 규칙과 권한 경계를 안전하게 고정하기 위한 기본 개발 방식**입니다.

앞으로 새 기능 작업은 가능하면 아래 질문에 바로 답할 수 있어야 합니다.

- 이 기능의 실패 테스트는 무엇인가?
- 어떤 권한/검증 규칙을 고정하는가?
- 어떤 테스트가 통과되면 이 기능을 완료로 볼 수 있는가?

이 질문에 답이 없다면, 아직 구현을 시작할 단계가 아닙니다.
