# Plan 06: UI/UX 테마 & 디자인 시스템

본 문서는 **청소 예약 서비스**에 어울리는 ‘깔끔함(청결)’과 ‘신뢰감(전문성)’을 핵심으로 하는 **UI/UX 테마 및 디자인 시스템**을 정의합니다.

- 목표: Web(TanStack Start) + Mobile(Expo RN)에서 **동일한 브랜드 경험**을 제공
- 적용 범위: 색/타이포/레이아웃/컴포넌트/상호작용/접근성/콘텐츠 톤 + 구현 가이드(Tailwind, RN)

---

## 1) 브랜드 방향 (Brand Direction)

### 핵심 가치
- **신뢰(Trust)**: 예약/결제/후기까지 ‘안전하고 확실하다’는 인상을 줌
- **청결(Clean)**: 흰 여백, 규칙적인 그리드, 과한 장식 제거
- **친절(Helpful)**: 사용자가 망설일 지점을 먼저 안내(가이드 문구, 예시, 검증)

### 톤 & 매너 (Tone of UI)
- 문장: 짧고 단정하게. “~해요”체의 **정중한 구어체** 권장
- 표현: 단정적/확정적. 애매한 단어(아마/대략) 지양
- 예시
  - ✅ “예약이 완료됐어요. 청소 제공자가 확인하면 알림을 보내드릴게요.”
  - ❌ “예약이 아마 완료된 것 같아요.”

---

## 2) 디자인 원칙 (Design Principles)

1. **고정된 규칙이 신뢰를 만든다**: 동일한 상황은 동일한 UI로(상태/색/용어 통일)
2. **작은 실패를 크게 보이게 하지 않는다**: 에러는 입력 근처 + 해결 방법 제시
3. **정보는 단계적으로**: 한 화면에 모든 걸 보여주기보다 ‘핵심 → 상세’
4. **터치/클릭은 확실하게**: 버튼과 링크를 시각적으로 구분하고 피드백을 즉시 제공

---

## 3) 디자인 토큰 (Design Tokens)

> 구현 시 `packages/ui`에서 **토큰을 단일 소스**로 관리하고 Web/Tailwind, RN 양쪽으로 배포합니다.

### 3.1 Color Tokens

#### Brand
- `brand/primary`: **#2563EB** (Blue 600) — 메인 CTA, 핵심 강조
- `brand/primary-hover`: #1D4ED8 (Blue 700)
- `brand/primary-soft`: #EFF6FF (Blue 50) — 배경 하이라이트

#### Neutral
- `bg/default`: #FFFFFF
- `bg/subtle`: #F9FAFB (Gray 50)
- `surface/default`: #FFFFFF
- `surface/elevated`: #FFFFFF
- `border/default`: #E5E7EB (Gray 200)
- `text/primary`: #111827 (Gray 900)
- `text/secondary`: #6B7280 (Gray 500)
- `text/tertiary`: #9CA3AF (Gray 400)

#### Semantic (Status)
- `success`: #10B981 (Green 500)
- `warning`: #F59E0B (Amber 500)
- `danger`: #EF4444 (Red 500)
- `info`: #3B82F6 (Blue 500)

#### Overlay / Focus
- `overlay/scrim`: rgba(17, 24, 39, 0.40)
- `focus/ring`: rgba(37, 99, 235, 0.35)

### 3.2 Typography Tokens

- 기본 서체
  - Web: **Pretendard** 권장
  - RN: 시스템 폰트(기본) + Pretendard 도입 가능 시 적용

- 타입 스케일(권장)
  - `display`: 28 / 32 / **700**
  - `h1`: 24 / 30 / **700**
  - `h2`: 20 / 26 / **600**
  - `h3`: 18 / 24 / **600**
  - `body`: 16 / 24 / **400**
  - `body-sm`: 14 / 20 / **400**
  - `caption`: 12 / 16 / **400**

- 숫자/가격 표기
  - 가격, 시간 등 핵심 숫자는 `tabular-nums`(Web) 또는 고정폭 유사 렌더링 고려

### 3.3 Spacing & Radius

- spacing scale (4pt 기반): `0, 4, 8, 12, 16, 20, 24, 32, 40, 48`
- radius
  - `sm`: 8
  - `md`: 12 (기본 카드/입력)
  - `lg`: 16 (메인 섹션 카드)
  - `pill`: 999 (칩/배지)

### 3.4 Shadow / Elevation

> “깨끗함”을 위해 그림자는 과하지 않게, 대신 **border + soft shadow** 조합.

- `elevation-1`: 0 1px 2px rgba(0,0,0,0.06)
- `elevation-2`: 0 6px 16px rgba(0,0,0,0.08)

---

## 4) 레이아웃 & 그리드

### Web
- 최대 폭: 1200px(대시보드), 960px(콘텐츠)
- 기본 여백: 페이지 padding 16~24px
- 카드 간격: 12~16px

### Mobile
- Safe Area 준수
- 기본 horizontal padding: 16px
- 리스트 아이템 간격: 8~12px

---

## 5) 컴포넌트 시스템 (packages/ui 기준)

### 5.1 Button

종류
- `Primary`: 예약/결제/확정 등 핵심 행동
- `Secondary`: 서브 행동
- `Tertiary/Ghost`: 리스트 내 보조 행동(텍스트 느낌)
- `Destructive`: 취소/삭제

상태
- `default / hover / pressed / disabled / loading`

권장 스타일(개념)
- Primary: `bg brand/primary` + `text white` + `radius md`
- Disabled: 배경 `Gray 200`, 텍스트 `Gray 400`
- Loading: 스피너 + 버튼 텍스트 유지(레이아웃 점프 방지)

### 5.2 Input / Form

- 라벨은 상단 고정(placeholder로 라벨 대체 금지)
- 오류는 **필드 바로 아래** 1줄, 해결 방법 포함
  - 예: “연락처 형식을 확인해 주세요. 예) 010-1234-5678”

### 5.3 Card

- 기본: `surface` + `border/default` + `radius lg`
- 카드 클릭 가능 시: 전체가 눌리는 피드백(hover/pressed) 제공

### 5.4 Badge / Chip

- 예약 상태 표시(필수)
  - `요청됨`(info-soft)
  - `확정`(success-soft)
  - `완료`(neutral)
  - `취소`(danger-soft)

### 5.5 List Item

- 좌: 핵심 정보(지역/날짜/가격)
- 우: 상태 배지 + Chevron(상세 진입)

### 5.6 Toast / Snackbar

- 성공/실패 즉시 피드백
- 실패 토스트는 “왜 + 다음 행동” 포함

### 5.7 Modal / Bottom Sheet

- Mobile: 바텀시트 우선(한 손 조작)
- Web: 모달은 핵심 결정(취소/확정)에서만 사용(남발 금지)

---

## 6) 예약/청소 도메인 UX 패턴

### 6.1 예약 플로우(권장 3-step)
1) **지역/날짜/시간**
2) **청소 상세(평수, 옵션, 사진/요청사항)**
3) **확인/결제/예약 생성**

원칙
- 단계 상단에 진행 상태 표시(stepper)
- 뒤로 가도 입력값 유지
- 가격은 가능한 빨리 노출(“나중에 공개” 금지)

### 6.2 신뢰 장치(Trust Builders)
- 제공자 프로필
  - 본인 인증/배지(있다면), 후기 수, 평균 평점, 최근 활동
- 가격 구성
  - 기본요금 + 옵션 + 교통비(있다면) 등 분해 표기
- 예약 상태
  - “요청됨 → 확인중 → 확정 → 완료” 등 상태를 일관되게

---

## 7) 아이콘 & 일러스트

- 아이콘: **Lucide**(web), `lucide-react-native`(mobile)
- 아이콘 스타일: 1.75px stroke 권장(일관성), 크기 18/20/24 중심

추천 아이콘 매핑
- 예약: `Calendar`
- 위치: `MapPin`
- 청소: `Sparkles`, `Brush`
- 채팅: `MessageSquare`
- 후기: `Star`
- 결제: `CreditCard`

---

## 8) 모션(Interaction & Motion)

- 목표: “빠르고 안정적” 느낌
- 애니메이션은 **짧게(150~220ms)**, 과한 탄성/바운스 지양
- 로딩
  - 페이지: 스켈레톤(리스트/카드)
  - 버튼: 인라인 스피너

---

## 9) 접근성(Accessibility) 체크리스트

- 대비(Contrast)
  - 본문 텍스트는 WCAG AA 수준(가능하면 4.5:1) 확보
- 터치 타겟
  - Mobile 최소 44x44
- 포커스
  - Web에서 키보드 탐색 시 포커스 링 표시(숨기지 않기)
- 상태 전달
  - 색만으로 상태를 구분하지 말고 텍스트/아이콘 병행(예: “취소됨” 배지)

---

## 10) 다크 모드 정책

- 기본은 **라이트 모드 우선**(청결/신뢰 이미지)
- 다크 모드는 시스템 설정 기반 지원

권장 다크 토큰
- `bg/default`: #0B1220 (유사 Gray 950)
- `surface/default`: #111827 (Gray 900)
- `border/default`: rgba(255,255,255,0.10)
- `text/primary`: #F9FAFB
- `brand/primary`: #3B82F6 (Blue 500)

---

## 11) 구현 가이드 (Web / Mobile)

### 11.1 Tailwind (Web)
- 토큰을 `tailwind.config`의 `theme.extend.colors`로 매핑
- 컴포넌트는 `packages/ui`에서 `class-variance-authority`(CVA) 스타일로 변형 관리 권장

예: 버튼(개념)
- `btn`, `btn-primary`, `btn-secondary`, `btn-destructive`
- 상태는 `data-state` 또는 `aria-disabled` 기반으로 스타일링

### 11.2 React Native (Mobile)
- 색/간격/타입 토큰을 `packages/ui`에서 JS 객체로 export
- 스타일링은
  - (선호) `nativewind` 도입 시 tailwind 토큰을 그대로 공유
  - (대안) `StyleSheet.create` + 토큰 참조

---

## 12) 용어(라벨) 표준화

- “청소 제공자” vs “클리너”: 사용자 화면에서는 **청소 제공자**(명확)
- “예약 요청” / “예약 확정” / “예약 완료” / “예약 취소” 용어 고정
- 금액: “예상 금액”(변동 가능 시), “확정 금액”(결제/확정 이후)

---

## 13) Done Criteria (적용 완료 기준)

- [ ] Web/Mobile 모두 동일한 토큰 집합을 참조
- [ ] 주요 컴포넌트(Button/Input/Card/Badge/Toast) 스펙이 문서와 일치
- [ ] 예약 상태 배지(텍스트/색) 완전 통일
- [ ] 접근성 체크리스트(대비/터치/포커스) 기본 충족

---

## 14) Next

- `packages/ui` 컴포넌트 구현 및 Storybook/Preview 환경 구축(선택)
- 상태 배지/토스트 메시지의 문구를 PRD/정책 문서와 동기화
