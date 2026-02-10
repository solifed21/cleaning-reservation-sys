# Plan 06: UI/UX 테마 & 디자인 시스템

- 문서 버전: **v2**
- 마지막 업데이트: **2026-02-11**

본 문서는 **청소 예약 서비스**에 어울리는 “깔끔함(청결)”과 “신뢰감(전문성)”을 중심으로, Web(TanStack Start) + Mobile(Expo RN)에서 일관되게 사용할 **UI/UX 테마 및 디자인 시스템**을 정의합니다.

> 목표
> - 같은 토큰/규칙으로 Web·Mobile을 동시에 설계/구현
> - 예약/가격/상태처럼 ‘신뢰가 중요한 정보’를 흔들림 없이 표현
> - 과장된 장식 대신 **여백·정렬·대비·문구의 명확성**으로 “깔끔함”을 만든다

---

## 1) 브랜드 방향 (Brand Direction)

### 1.1 키워드
- **Clean**: 흰 배경, 규칙적인 간격, 얇은 border, 절제된 그림자
- **Trust**: 상태/가격/정책 표기의 일관성, 오류 메시지의 해결 안내, 신뢰 장치(후기/인증)
- **Helpful**: 사용자가 망설이는 지점에 예시/가이드 제공(주소, 요청사항, 예약 상태 등)

### 1.2 톤 & 매너 (UX Writing)
- 문장: 짧고 단정하게(“~해요”체의 정중한 구어체 권장)
- 표현: 애매한 단어 지양(“아마”, “대략”), **확정/대기/취소** 같은 상태를 명확히
- 기준
  - ✅ “예약이 접수됐어요. 제공자가 확인하면 알려드릴게요.”
  - ✅ “취소가 완료됐어요. 환불은 영업일 1~3일 내 처리돼요.”
  - ❌ “예약이 된 것 같아요.”

### 1.3 시각적 성격
- Primary(브랜드): **차분한 블루** → 신뢰/안정
- Success(청결/완료): **그린/민트 계열** → 완료/성공/청결
- UI는 “선명한 대비 + 절제된 색 사용(컬러 남발 금지)”

---

## 2) 디자인 원칙 (Design Principles)

1. **규칙성 = 신뢰**: 동일한 상태/행동은 동일한 색/라벨/위치로 제공
2. **핵심 먼저, 상세는 접기**: 예약 카드에는 ‘날짜/지역/가격/상태’만 우선 노출
3. **실패를 친절하게**: 오류는 입력 근처에, 해결 방법을 함께
4. **피드백은 즉시**: 클릭/터치 → pressed/로딩/완료를 1초 안에 체감
5. **모바일 우선 조작성**: CTA는 하단 고정 영역(필요 시), 터치 타겟 44px 이상

---

## 3) 디자인 토큰 (Design Tokens)

> 단일 소스: `packages/ui`에서 토큰을 관리하고 Web/Tailwind, RN(NativeWind/StyleSheet)에 배포합니다.

### 3.1 토큰 네이밍 규칙
- **역할 기반(role-based)** 토큰을 우선 사용
  - 예: `text.primary`, `surface.elevated`, `border.default`, `brand.primary`, `status.success`
- 컴포넌트에서 직접 raw hex를 쓰지 않기

### 3.2 Color Tokens (Light)

#### Brand
- `brand.primary`: **#2563EB** (Blue 600) — 메인 CTA, 링크 강조
- `brand.primaryHover`: #1D4ED8 (Blue 700)
- `brand.primarySoft`: #EFF6FF (Blue 50) — 배경 하이라이트

#### Neutral / Surface
- `bg.default`: #FFFFFF
- `bg.subtle`: #F9FAFB (Gray 50)
- `surface.default`: #FFFFFF
- `surface.elevated`: #FFFFFF
- `border.default`: #E5E7EB (Gray 200)
- `border.strong`: #D1D5DB (Gray 300)
- `text.primary`: #111827 (Gray 900)
- `text.secondary`: #6B7280 (Gray 500)
- `text.tertiary`: #9CA3AF (Gray 400)

#### Status (Semantic)
- `status.success`: #10B981 (Green 500)
- `status.successSoft`: #ECFDF5 (Green 50)
- `status.warning`: #F59E0B (Amber 500)
- `status.warningSoft`: #FFFBEB (Amber 50)
- `status.danger`: #EF4444 (Red 500)
- `status.dangerSoft`: #FEF2F2 (Red 50)
- `status.info`: #3B82F6 (Blue 500)
- `status.infoSoft`: #EFF6FF (Blue 50)

#### Focus / Overlay
- `focus.ring`: rgba(37, 99, 235, 0.35)
- `overlay.scrim`: rgba(17, 24, 39, 0.40)

### 3.3 Color Tokens (Dark)

정책
- 기본은 **라이트 우선**(청결/신뢰 이미지). 다크는 시스템 설정 기반.

권장 토큰
- `bg.default`: #0B1220
- `surface.default`: #111827
- `border.default`: rgba(255,255,255,0.10)
- `text.primary`: #F9FAFB
- `text.secondary`: rgba(249,250,251,0.72)
- `brand.primary`: #3B82F6

### 3.4 Typography Tokens

- 기본 서체
  - Web: **Pretendard** 권장
  - RN: 시스템 폰트 기본(도입 가능 시 Pretendard 적용)

- 타입 스케일(권장)
  - `display`: 28 / 32 / 700
  - `h1`: 24 / 30 / 700
  - `h2`: 20 / 26 / 600
  - `h3`: 18 / 24 / 600
  - `body`: 16 / 24 / 400
  - `bodySm`: 14 / 20 / 400
  - `caption`: 12 / 16 / 400

- 숫자/가격
  - Web: `font-variant-numeric: tabular-nums;` 권장(가격, 시간)

### 3.5 Spacing / Radius
- Spacing: 4pt 기반 `0, 4, 8, 12, 16, 20, 24, 32, 40, 48`
- Radius
  - `sm`: 8
  - `md`: 12 (입력/버튼 기본)
  - `lg`: 16 (카드)
  - `pill`: 999 (칩/배지)

### 3.6 Shadow / Elevation
“깨끗함”을 위해 그림자는 약하게, 기본은 **border + soft shadow**.
- `elevation.1`: `0 1px 2px rgba(0,0,0,0.06)`
- `elevation.2`: `0 6px 16px rgba(0,0,0,0.08)`

---

## 4) 레이아웃 & 정보 구조

### 4.1 Web
- 최대 폭: 1200px(대시보드), 960px(콘텐츠)
- 기본 padding: 16~24px
- 카드 간격: 12~16px
- 표(테이블) 사용 시: 헤더 고정 + 행 hover(과한 stripe 금지)

### 4.2 Mobile
- Safe Area 준수
- 기본 horizontal padding: 16px
- 리스트 아이템 간격: 8~12px
- 주요 CTA는 하단 고정 영역 사용 가능(키보드/안전영역 대응)

---

## 5) 컴포넌트 시스템 (packages/ui 기준)

> 공통 원칙: “상태를 숨기지 않는다.”
> - disabled는 진짜 비활성(클릭 불가) + 이유를 주변 문구로 설명
> - loading은 버튼 너비 고정(레이아웃 점프 방지)

### 5.1 Button

Variant
- `primary`: 예약/확정/결제(핵심 CTA)
- `secondary`: 서브 행동
- `ghost`: 목록 내 보조(텍스트 느낌)
- `destructive`: 취소/삭제

State
- `default / hover(web) / pressed / disabled / loading`

권장 스펙
- 높이: 44 (mobile), 40~44 (web)
- radius: `md`
- 아이콘 버튼은 최소 44x44 hit area

### 5.2 Input / Form
- 라벨은 상단 고정(placeholder로 라벨 대체 금지)
- 오류는 필드 바로 아래 1줄 + 해결 힌트 포함
  - 예: “연락처 형식을 확인해 주세요. 예) 010-1234-5678”
- 필수 입력은 `*`로 표기(과다 사용 금지)

### 5.3 Card
- 기본: `surface.default` + `border.default` + `radius.lg`
- 클릭 가능 카드: hover/pressed 피드백 제공(전체가 눌리는 느낌)

### 5.4 Badge / Chip (상태 표현 핵심)

예약 상태 배지(Plan 02 enum 기준)
- `pending` → “요청됨” (`status.infoSoft` + `status.info`)
- `confirmed` → “확정” (`status.successSoft` + `status.success`)
- `in_progress` → “진행중” (`brand.primarySoft` + `brand.primary`)
- `completed` → “완료” (`bg.subtle` + `text.secondary`)
- `cancelled` → “취소됨” (`status.dangerSoft` + `status.danger`)

규칙
- 색만으로 구분 금지: **항상 텍스트 라벨 포함**

### 5.5 List Item (예약/일감 리스트)
- 좌: 핵심(날짜/시간, 지역, 가격)
- 우: 상태 배지 + Chevron
- 한 줄 요약(서비스/평수)은 secondary 텍스트로

### 5.6 Toast / Snackbar
- 성공: 짧게(“저장됐어요.”)
- 실패: “왜 + 다음 행동”
  - 예: “네트워크가 불안정해요. 잠시 후 다시 시도해 주세요.”

### 5.7 Modal / Bottom Sheet
- Mobile: 바텀시트 우선(한 손 조작)
- Web: 모달은 결정이 필요한 순간에만(취소/확정)

---

## 6) 예약/청소 도메인 UX 패턴

### 6.1 예약 생성(권장 3~5 step)
- Step 예시
  1) 서비스/평수
  2) 날짜/시간
  3) 주소
  4) 요청사항/예산(선택)
  5) 확인

원칙
- stepper(진행 표시) 제공
- 뒤로 가도 입력 유지
- 가격/예산은 가능한 빨리 노출(“나중에 공개” 금지)

### 6.2 신뢰 장치(Trust Builders)
- 제공자 카드(요약)
  - 후기 수, 평균 평점, 최근 활동(가능하면)
  - 인증/배지(있다면)
- 가격 분해
  - 기본요금 + 옵션 + 추가(있다면)를 명시
- 상태 타임라인
  - “요청됨 → 확정 → 진행중 → 완료/취소”를 동일한 순서/라벨로

### 6.3 빈 상태(Empty) / 로딩(Skeleton)
- 빈 상태는 “왜 비었는지 + 다음 행동”
  - 예: “아직 예약이 없어요. 지금 예약을 만들어볼까요?”
- 로딩은 스켈레톤(리스트/카드)

---

## 7) 아이콘 & 일러스트

- 아이콘: **Lucide**
  - Web: `lucide-react`
  - Mobile: `lucide-react-native`

권장 아이콘 매핑
- 예약: `Calendar`
- 위치: `MapPin`
- 청소: `Sparkles` 또는 `Brush`
- 채팅: `MessageSquare`
- 후기: `Star`
- 결제/금액: `CreditCard`

일러스트 정책
- MVP에서는 최소화(아이콘 + 타이포 + 여백으로 ‘깔끔함’ 유지)
- 일러스트를 쓰더라도 단색/저채도 위주, 정보 전달을 방해하지 않기

---

## 8) 모션(Interaction & Motion)

- 목표: “빠르고 안정적”
- 애니메이션: 150~220ms (과한 바운스 지양)
- 로딩
  - 페이지: 스켈레톤
  - 버튼: 인라인 스피너(텍스트 자리 유지)

---

## 9) 접근성(Accessibility) 체크리스트

- 대비(Contrast): 본문 텍스트는 WCAG AA(가능하면 4.5:1)
- 터치 타겟: Mobile 최소 44x44
- 포커스: Web 키보드 탐색 시 포커스 링 표시(숨기지 않기)
- 상태 전달: 색 + 텍스트/아이콘 병행
- 입력 접근성: label 연결, 오류 메시지 읽히게(aria-describedby 등)

---

## 10) 구현 가이드 (Web / Mobile)

### 10.1 Tailwind (Web)
- 토큰을 `tailwind.config`의 `theme.extend.colors`로 매핑
- 컴포넌트 변형(variant/size)은 CVA(class-variance-authority) 권장

권장 운영 방식
- `packages/ui`에서
  - `tokens.ts` (source)
  - `tailwind-preset.ts` (web)
  - `native-theme.ts` (rn)
  를 생성해 일원화

### 10.2 React Native (Mobile)
- NativeWind 사용 시 Tailwind 토큰을 그대로 공유
- 미사용 시 StyleSheet + 토큰 참조

권장
- 색/간격/타입 토큰은 import해서 사용(하드코딩 금지)

---

## 11) 용어(라벨) 표준화

- 사용자 화면: “청소 제공자”(명확) / 내부 코드: cleaner
- 예약 상태 라벨 고정
  - “요청됨 / 확정 / 진행중 / 완료 / 취소됨”
- 금액
  - 변동 가능: “예상 금액”
  - 확정 이후: “확정 금액”

---

## 12) Done Criteria (적용 완료 기준)

- [ ] Web/Mobile 모두 동일한 토큰 집합을 참조
- [ ] Button/Input/Card/Badge/Toast 스펙이 문서와 일치
- [ ] 예약 상태 배지(텍스트/색) 완전 통일
- [ ] 접근성(대비/터치/포커스) 기본 기준 충족

---

## 13) Next

- `packages/ui`에 토큰/컴포넌트 구현 + 스토리(Storybook/Preview) 구축(선택)
- 상태 배지/토스트 문구를 정책(취소/환불/노쇼) 문서와 동기화
