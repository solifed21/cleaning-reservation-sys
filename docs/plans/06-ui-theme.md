# Plan 06: UI/UX 테마 & 디자인 시스템

- 문서 버전: **v8**
- 마지막 업데이트: **2026-02-11**

본 문서는 **청소 예약 서비스**에 어울리는 “깔끔함(청결)”과 “신뢰감(전문성)”을 중심으로, Web(TanStack Start) + Mobile(Expo React Native)에서 **동일한 토큰/규칙/컴포넌트 언어**로 구현하기 위한 **UI/UX 테마 및 디자인 시스템**을 정의합니다.

> 목표
> - Web·Mobile에서 같은 의미를 같은 스타일로 표현(토큰/컴포넌트 공유)
> - 예약/가격/상태처럼 ‘신뢰가 중요한 정보’를 흔들림 없이 표준화
> - 과장된 장식 대신 **여백·정렬·대비·문구의 명확성**으로 “깔끔함”을 만든다

---

## 0) 범위 & 핵심 원칙

### 0.1 적용 범위
- 브랜드 방향(톤/메시지/시각 성격)
- 디자인 토큰(색상/타이포/간격/라운드/그림자/모션)
- 핵심 컴포넌트 규격(Button, Input, Card, Badge, Toast, Modal…)
- 도메인 UX 패턴(예약 플로우, 상태, 취소/환불)
- 접근성/품질 기준

### 0.2 철학 (Clean × Trust)
1) **규칙성 = 신뢰**: 동일한 의미는 동일한 라벨/위치/색으로 고정
2) **정렬 = 청결**: 금액/날짜/상태는 표준 포맷 + 정렬 규칙으로 통일
3) **불확실 표현 금지**: “대충/아마/근처” 같은 모호함을 UI에서 제거
4) **Border > Shadow**: 구조는 테두리/레이아웃으로 만들고 그림자는 최소
5) **컬러는 의미에만**: 장식 컬러 금지(상태/행동/링크 등 semantic/brand에만)
6) **모바일 조작성 우선**: 터치 영역/키보드/세이프에리어/하단 CTA 우선
7) **증거 기반 UI**: 가격/정책/상태는 ‘추정’이 아니라 **표준 문구 + 표준 위치 + 표준 포맷**으로 표시

### 0.3 UX Writing(문구) 원칙
- 문장: 짧고 단정하게(정중한 구어체 “~해요/주세요” 권장)
- 안내: **왜(원인) + 다음 행동(해결)**를 함께 제공
- 버튼 라벨: **동사 + 목적어** (예: “예약 요청하기”, “예약 취소하기”)
- 정책/금액/시간 표현은 ‘확정/예상’ 구분을 반드시 노출

예시
- ✅ “예약이 접수됐어요. 제공자가 확인하면 알려드릴게요.”
- ✅ “취소가 완료됐어요. 환불은 영업일 1~3일 내 처리돼요.”
- ✅ “주소가 정확하지 않아요. ‘동/호수’까지 입력해 주세요.”
- ❌ “예약이 된 것 같아요.”

---

## 1) 브랜드 방향 (Brand Direction)

### 1.1 브랜드 키워드
- **Clean**: 흰 배경, 일정한 간격, 얇은 border, 절제된 그림자
- **Trust**: 가격·정책·상태 표기의 일관성, 오류 메시지의 해결 안내
- **Calm**: 과장 없는 모션/피드백(바운스/강한 강조 최소)
- **Helpful**: 망설이는 지점(주소/요청사항/취소/환불)에 예시·가이드 제공

### 1.2 컬러 성격
- Primary(브랜드): **차분한 블루**(신뢰/안정)
- Fresh accent(보조, 제한적): **민트/그린**(청결/상쾌) — 성공/완료의 의미 외에는 남용 금지
- Warning/Danger: 상태 의미에만 사용(장식 금지)

### 1.3 시각 언어(비주얼 톤)
- 배경은 기본적으로 **무채색(white/gray)**
- 섹션 구분은 색 블록이 아니라 **여백 + Divider + Card**
- 아이콘은 선(line) 스타일 통일, 일러스트는 MVP에서 최소화

---

## 2) 디자인 토큰 (Design Tokens)

> 단일 소스(권장): `packages/ui`에서 토큰을 관리하고 Web(Tailwind), Mobile(NativeWind/StyleSheet)에 배포합니다.

### 2.1 토큰 네이밍 규칙
- **역할 기반(role-based)** 토큰 우선
  - 예: `text.primary`, `surface.elevated`, `border.default`, `brand.primary`, `status.success`
- 컴포넌트에서 raw hex 직접 사용 금지
- “컴포넌트 전용 토큰”은 최후의 수단
  - `button.primary.bg` 같은 파편화 지양 → `brand.primary` + 컴포넌트 variant로 해결

### 2.1.1 토큰 거버넌스(팀 규칙)
- 토큰 변경은 “의미 변화”로 간주 → PR에 **스크린샷 2장(전/후)** 첨부
- 새 색을 추가해야 한다면, 먼저 아래 중 어디에 속하는지 결정
  1) **Brand**(CTA/링크) 2) **Neutral/Surface**(배경/구조) 3) **Semantic Status**(성공/경고/위험/정보)
- 의미가 불명확한 색(예: `purple.500`)은 금지. 꼭 필요하면 `status.*` 또는 `brand.*`로만 도입
- “한 화면에 의미 없는 컬러 2개 이상”이 보이면 디자인 실패로 본다

### 2.2 Color Tokens (Light) — 기본

#### Brand
- `brand.primary`: **#2563EB** (Blue 600) — 핵심 CTA/링크
- `brand.primaryHover`: #1D4ED8 (Blue 700)
- `brand.primarySoft`: #EFF6FF (Blue 50)

보조 팔레트(옵션, 필요할 때만)
- `brand.primaryStrong`: #1E40AF (Blue 800) — 헤더/강조(남용 금지)
- `brand.accent`: #0EA5E9 (Sky 500) — 정보 강조(상태/info와 구분이 필요할 때만)

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
- `text.onBrand`: #FFFFFF

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

### 2.3 Color Tokens (Dark) — 옵션
정책
- 기본은 라이트 우선(청결/신뢰 이미지).
- 다크 모드는 **시스템 설정 기반**으로 제공(필수는 아님).

권장
- `bg.default`: #0B1220
- `surface.default`: #111827
- `border.default`: rgba(255,255,255,0.10)
- `text.primary`: #F9FAFB
- `text.secondary`: rgba(249,250,251,0.72)
- `brand.primary`: #3B82F6

### 2.4 Typography Tokens

#### 폰트
- Web: **Pretendard** 권장
- RN: 시스템 폰트 기본(도입 가능 시 Pretendard 적용)

#### 타입 스케일(권장)
> 표기: `fontSize / lineHeight / fontWeight`

- `display`: 28 / 32 / 700
- `h1`: 24 / 30 / 700
- `h2`: 20 / 26 / 600
- `h3`: 18 / 24 / 600
- `body`: 16 / 24 / 400
- `bodySm`: 14 /  20 / 400
- `caption`: 12 / 16 / 400

#### 숫자/가격(신뢰를 위한 정렬)
- Web: `font-variant-numeric: tabular-nums;` 적용
- 공통: 금액은 천 단위 구분 + 통화 단위 고정(예: `12,000원`)

### 2.5 Spacing / Radius
- Spacing: 4pt 기반 `0, 4, 8, 12, 16, 20, 24, 32, 40, 48`
- Radius
  - `sm`: 8
  - `md`: 12 (버튼/입력 기본)
  - `lg`: 16 (카드)
  - `pill`: 999 (칩/배지)

### 2.6 Shadow / Elevation
“깨끗함”을 위해 그림자는 약하게, 기본은 **border + soft shadow**.
- `elevation.1`: `0 1px 2px rgba(0,0,0,0.06)`
- `elevation.2`: `0 6px 16px rgba(0,0,0,0.08)`

### 2.7 Motion Tokens (권장)
- `motion.fast`: 150ms
- `motion.base`: 200ms
- `motion.slow`: 240ms
- easing: `cubic-bezier(0.2, 0.8,  0.2, 1)` (과한 바운스 금지)

### 2.8 토큰 단일 소스(예시)
권장: `packages/ui/src/tokens/tokens.ts`

```ts
export const tokens = {
  color: {
    brand: { primary: '#2563EB', primaryHover: '#1D4ED8', primarySoft: '#EFF6FF' },
    bg: { default: '#FFFFFF', subtle: '#F9FAFB' },
    surface: { default: '#FFFFFF', elevated: '#FFFFFF' },
    text: { primary: '#111827', secondary: '#6B7280', tertiary: '#9CA3AF', onBrand: '#FFFFFF' },
    border: { default: '#E5E7EB', strong: '#D1D5DB' },
    status: {
      success: '#10B981', successSoft: '#ECFDF5',
      warning: '#F59E0B', warningSoft: '#FFFBEB',
      danger:  '#EF4444', dangerSoft:  '#FEF2F2',
      info:    '#3B82F6', infoSoft:    '#EFF6FF',
    },
    focus: { ring: 'rgba(37, 99, 235, 0.35)' },
    overlay: { scrim: 'rgba(17, 24, 39, 0.40)' },
  },
  type: {
    display: { size: 28, lineHeight: 32, weight: 700 },
    h1:      { size: 24, lineHeight: 30, weight: 700 },
    h2:      { size: 20, lineHeight: 26, weight: 600 },
    h3:      { size: 18, lineHeight: 24, weight: 600 },
    body:    { size: 16, lineHeight: 24, weight: 400 },
    bodySm:  { size: 14, lineHeight: 20, weight: 400 },
    caption: { size: 12, lineHeight: 16, weight: 400 },
  },
  space: { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48 },
  radius: { sm: 8, md: 12, lg: 16, pill: 999 },
  shadow: {
    1: '0 1px 2px rgba(0,0,0,0.06)',
    2: '0 6px 16px rgba(0,0,0,0.08)',
  },
  motion: {
    fast: 150,
    base: 200,
    slow: 240,
    easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  },
} as const
```

---

## 3) 레이아웃 & 정보 구조

### 3.1 Web 레이아웃(권장)
- 최대 폭: 1200px(대시보드), 960px(콘텐츠)
- 기본 padding: 16~24px
- 카드 간격: 12~16px
- 데이터 밀도가 높은 화면은 **정렬/타이포/간격 규칙**으로 “질서”를 만든다

테이블 사용 시(대시보드)
- 헤더 고정 + 행 hover
- 과한 stripe 금지
- 중요 숫자(금액/건수): tabular-nums + 우측 정렬

### 3.2 Mobile 레이아웃(권장)
- Safe Area 준수
- 기본 horizontal padding: 16px
- 리스트 아이템 간격: 8~12px
- 주요 CTA는 하단 고정 영역 사용 가능(키보드/안전영역 대응)

### 3.3 Breakpoints(권장)
- Web: `sm(640) / md(768) / lg(1024) / xl(1280)`
- Mobile: 1열 기본, 태블릿 이상에서 2~3열 그리드 허용

### 3.4 예약/금액 화면 정보 우선순위(공통)
1) **상태**(요청됨/확정/진행중/완료/취소됨)
2) **일시**(날짜+시간)
3) **장소**(지역/상세주소)
4) **금액**(예상/확정)
5) **서비스 요약**(평수/옵션)

---

## 4) 컴포넌트 시스템 (packages/ui 기준)

> 목표: 화면을 “그때그때 디자인”하지 않고, **예약 서비스에 필요한 UI 원형들을 조합**해서 만든다.

### 4.0 컴포넌트 인벤토리(우선순위)

**Core(필수)**
- Button, IconButton
- Text, Heading
- Input, TextArea, Field(라벨/헬퍼/에러), FormRow
- Select(단일), SegmentedControl
- Card
- Badge(상태), Chip(필터)
- Divider
- Toast/Snackbar
- Modal(Dialog), BottomSheet
- Skeleton, EmptyState
- Avatar(제공자), RatingStars

**Domain(예약/청소 전용)**
- BookingStatusBadge
- PriceBreakdown(항목/합계)
- BookingTimeline(상태 타임라인)
- AddressBlock(주소 표준 표시)
- CleanerSummaryCard(평점/후기/지역)

**Navigation(앱 공통)**
- TopBar(AppBar), Tabs, BottomTabs
- ListItem(예약/일감)

> 공통 원칙
> - 로딩 시 레이아웃 점프 금지(버튼 너비/높이 고정)
> - disabled는 진짜 비활성 + **이유를 주변 문구로 설명**
> - 상태는 숨기지 않는다(색+텍스트 동시 제공)

### 4.1 Button

Variant
- `primary`: 예약/확정/결제 등 핵심 CTA
- `secondary`: 서브 행동
- `ghost`: 목록 내 보조(텍스트 느낌)
- `destructive`: 취소/삭제

Size
- `sm / md / lg` (기본 md)

스펙(권장)
- 높이: Mobile 44, Web 40~44
- radius: `md`
- 아이콘 버튼: 최소 44×44 hit area

배치 규칙
- 한 화면의 primary는 1개가 원칙(동등한 primary 2개 금지)
- destructive는 primary 근처에 붙이지 않는다(거리/구분)

### 4.2 Input / Form
- 라벨은 상단 고정(placeholder로 라벨 대체 금지)
- 오류는 필드 바로 아래 1줄 + 해결 힌트 포함
  - 예: “연락처 형식을 확인해 주세요. 예) 010-1234-5678”
- 필수 입력은 `*`로 표기(남용 금지)

폼 레이아웃
- Mobile: 필드 간 12~16px
- 제출 버튼: 하단 고정(옵션), 키보드 올라올 때 가림 방지

### 4.3 Select / DateTime (예약 핵심)
- Mobile: 네이티브 피커 또는 바텀시트
- Web: 캘린더 팝오버(키보드 접근 가능)
- 비활성 시간/불가 시간은 회색 처리 + 사유(“이미 예약됨”)

### 4.4 Card
- 기본: `surface.default` + `border.default` + `radius.lg`
- 클릭 가능 카드: hover/pressed 피드백 제공

카드 정보 계층(권장)
1) 날짜/시간
2) 위치(지역)
3) 금액
4) 서비스/옵션 요약

### 4.5 Badge / Chip (상태 표현)

예약 상태 배지(Plan 02 enum 기준)
- `pending` → “요청됨” (`status.infoSoft` + `status.info`)
- `confirmed` → “확정” (`status.successSoft` + `status.success`)
- `in_progress` → “진행중” (`brand.primarySoft` + `brand.primary`)
- `completed` → “완료” (`bg.subtle` + `text.secondary`)
- `cancelled` → “취소됨” (`status.dangerSoft` + `status.danger`)

규칙
- 색만으로 구분 금지: 항상 텍스트 라벨 포함
- 상태 라벨은 **동일 문구** 고정(변형/다른 번역 금지)

### 4.6 List Item (예약/일감 리스트)
- 좌: 핵심(날짜/시간, 지역, 가격)
- 우: 상태 배지 + Chevron
- 요약(서비스/평수)은 secondary 텍스트로 1줄 제한

### 4.7 Toast / Snackbar
- 성공: 짧게(“저장됐어요.”)
- 실패: “왜 + 다음 행동”
  - 예: “네트워크가 불안정해요. 잠시 후 다시 시도해 주세요.”
- 중복 토스트 폭주 방지(동일 에러 debounce)

### 4.8 Modal / Bottom Sheet
- Mobile: 바텀시트 우선(한 손 조작)
- Web: 모달은 결정이 필요한 순간에만(취소/확정)
- destructive 동작은 2-step 확인(모달/바텀시트)

### 4.9 Empty / Skeleton
- 빈 상태는 “왜 비었는지 + 다음 행동”
  - 예: “아직 예약이 없어요. 지금 예약을 만들어볼까요?”
- 로딩은 스켈레톤(리스트/카드)
- 스피너만 덩그러니 금지(무엇이 로딩 중인지 문맥 제공)

---

## 5) 예약/청소 도메인 UX 패턴

### 5.1 예약 생성 플로우(권장 3~5 step)
예시
1) 서비스/평수
2) 날짜/시간
3) 주소
4) 요청사항/예산(선택)
5) 확인

원칙
- stepper(진행 표시) 제공
- 뒤로 가도 입력 유지
- 가격/예산은 가능한 빨리 노출(“나중에 공개” 금지)

### 5.2 신뢰 장치(Trust Builders)
- 제공자 카드(요약)
  - 후기 수, 평균 평점, 최근 활동(가능하면)
  - 인증/배지(있다면)
- 가격 분해
  - 기본요금 + 옵션 + 추가(있다면)를 명시
- 상태 타임라인
  - “요청됨 → 확정 → 진행중 → 완료/취소”를 동일 순서/라벨로

### 5.3 취소/환불 UX(기본 규칙)
- 취소 사유 입력은 강제하지 않는다(선택)
- 환불/수수료가 있으면 **취소 확인 화면에서 먼저** 보여준다
- 결과 화면에 다음 행동을 제시
  - “새 예약 만들기”, “예약 목록으로”, “문의하기”

### 5.4 가격/정책 표현 규칙(신뢰 핵심)
- 가격은 항상 **숫자 + 원** 단위까지 표시(“약 1만원대” 금지)
- `예상 금액`과 `확정 금액`을 혼용하지 않는다
- 수수료/옵션이 있으면 “합계” 직전에 항목별 노출

### 5.5 주소(장소) 입력 UX (청소 도메인 필수)
원칙: 청소는 ‘장소 정확도’가 곧 품질/신뢰입니다.
- 주소 필드는 2단 분리 권장
  - 1) 검색/선택(도로명/지번) 2) 상세(동/호수/현관비번 등)
- 상세주소 힌트/예시를 제공
  - 예: “101동 1203호, 공동현관 #1234(선택)”
- 고객에게 민감한 정보(현관 비번 등)는
  - “선택 입력”으로 두고, 입력 시 **비공개/공유 범위 안내** 문구 제공(추후 정책 확정 시 반영)

---

## 6) 아이콘 & 이미지 가이드

### 6.1 아이콘
- 아이콘: Lucide
  - Web: `lucide-react`
  - Mobile: `lucide-react-native`

권장 매핑
- 예약: `Calendar`
- 위치: `MapPin`
- 청소: `Sparkles` 또는 `Brush`
- 채팅: `MessageSquare`
- 후기: `Star`
- 결제/금액: `CreditCard`

규칙
- 기본 사이즈: 16(본문), 20(리스트), 24(주요)
- 스트로크는 일관되게(기본 2px)
- 아이콘만으로 의미 전달 금지(필수 행동은 텍스트 라벨 병행)

### 6.2 이미지/일러스트 정책
- MVP에서는 최소화(아이콘 + 타이포 + 여백으로 ‘깔끔함’ 유지)
- 이미지가 필요하다면
  - 고해상도/밝은 톤/저채도
  - 배경이 지저분한 사진 금지

---

## 7) 접근성(Accessibility) 체크리스트

- 대비(Contrast): 본문 텍스트는 WCAG AA(가능하면 4.5:1)
- 터치 타겟: Mobile 최소 44×44
- 포커스: Web 키보드 탐색 시 포커스 링 표시(숨기지 않기)
- 상태 전달: 색 + 텍스트/아이콘 병행
- 입력 접근성: label 연결, 오류 메시지 읽히게(aria-describedby)
- 스크린리더: 버튼/아이콘에 label 제공(“뒤로”, “예약 취소” 등)

---

## 8) 구현 가이드 (Web / Mobile)

### 8.1 Tailwind (Web)
- 토큰을 `tailwind.config`의 `theme.extend.colors`로 매핑
- 컴포넌트 변형(variant/size)은 CVA(class-variance-authority) 권장

권장 운영 방식
- `packages/ui`에서
  - `tokens.ts` (source)
  - `tailwind-preset.ts` (web)
  - `native-theme.ts` (rn)
  를 생성해 일원화

### 8.2 React Native (Mobile)
- NativeWind 사용 시 Tailwind 토큰을 그대로 공유
- 미사용 시 StyleSheet + 토큰 참조

원칙
- 색/간격/타입 토큰은 import해서 사용(하드코딩 금지)

### 8.3 상태(Booking Status) 단일 매핑
- 서버 enum(Plan 02) → UI 배지 라벨/색상은 본 문서 기준으로 고정
- Web/Mobile 모두 동일 매핑 함수 사용
  - 예: `getBookingStatusMeta(status)` → `{ label, fg, bg }`

### 8.4 날짜/시간/금액 포맷(공유)
신뢰를 위해 포맷은 화면마다 다르게 하지 말고 `packages/shared`로 고정합니다.
- 날짜: `YYYY.MM.DD (ddd)`
- 시간: `HH:mm`
- 합성: `2026.02.11 (수) 14:00`
- 금액: `12,000원` (소수점 없음)

---

## 9) 용어(라벨) 표준화

- 사용자 화면: “청소 제공자” / 내부 코드: `cleaner`
- 예약 상태 라벨 고정: “요청됨 / 확정 / 진행중 / 완료 / 취소됨”
- 금액
  - 변동 가능: “예상 금액”
  - 확정 이후: “확정 금액”

---

## 10) Done Criteria (적용 완료 기준)

- [ ] Web/Mobile 모두 동일한 토큰 집합을 참조
- [ ] Button/Input/Card/Badge/Toast 스펙이 문서와 일치
- [ ] 예약 상태 배지(텍스트/색) 완전 통일
- [ ] 가격/시간 표기 포맷이 화면 전반에서 동일
- [ ] 접근성(대비/터치/포커스) 기본 기준 충족

---

## 11) Next

- `packages/ui`에 토큰/컴포넌트 구현 + 프리뷰(Storybook/Playground) 구축(선택)
- 상태 배지/토스트 문구를 정책(취소/환불/노쇼) 문서와 동기화
- Dashboard용 Table/Filter 패턴을 `packages/ui`에 추가(필요 시)
