# Plan 06: UI/UX Theme & Design System

## 1. 디자인 컨셉: "Pure & Trust"

청소 서비스의 핵심 가치인 **청결함(Cleanliness)**과 **신뢰(Trust)**를 시각적으로 전달하는 디자인 시스템을 구축합니다.

- **Clean (청결)**: 불필요한 장식을 배제하고, 여백(White Space)을 충분히 활용하여 시각적 피로도를 줄이고 깔끔한 인상을 줍니다.
- **Trust (신뢰)**: 안정감 있는 블루/틸 계열의 컬러와 일관된 레이아웃을 사용하여 전문적인 서비스임을 강조합니다.
- **Friendly (친근함)**: 둥근 모서리(Rounded Corners)와 부드러운 인터랙션을 통해 O2O 서비스의 딱딱함을 줄이고 접근성을 높입니다.

---

## 2. Color System (컬러 팔레트)

Tailwind CSS 기반의 컬러 토큰을 정의합니다.

### Primary Colors (브랜드 컬러)
청소의 상쾌함을 상징하는 **Mint/Teal**과 신뢰를 주는 **Deep Blue**를 조합합니다.

| Token Name | Hex Code | Description | Usage |
|---|---|---|---|
| `primary-500` | `#00C2C7` | **Mint Teal** | 메인 버튼, 활성 아이콘, 브랜드 로고, 강조 텍스트 |
| `primary-600` | `#00A5A9` | **Deep Teal** | 메인 버튼(Hover/Press), 포커스 링 |
| `secondary-500` | `#2D3748` | **Slate Navy** | 헤더 텍스트, 네비게이션, 강조 UI |
| `secondary-100` | `#F7FAFC` | **Pale Blue Gray** | 배경색, 카드 배경(Subtle) |

### Functional Colors (기능성 컬러)

| Token Name | Hex Code | Description | Usage |
|---|---|---|---|
| `success` | `#38A169` | Green | 예약 확정, 결제 성공, 긍정적 리뷰 |
| `warning` | `#D69E2E` | Amber | 예약 대기, 주의 사항, 필수 입력 누락 |
| `error` | `#E53E3E` | Red | 예약 취소, 결제 실패, 오류 메시지 |
| `info` | `#3182CE` | Blue | 정보성 알림, 링크, 도움말 |

### Neutral Colors (무채색)

| Token Name | Hex Code | Usage |
|---|---|---|
| `white` | `#FFFFFF` | 카드 배경, 메인 배경, 모달 배경 |
| `gray-50` | `#F9FAFB` | 앱 전체 배경 (Subtle), 섹션 구분 배경 |
| `gray-200` | `#E2E8F0` | 보더(Border), 디바이더, 비활성 버튼 라인 |
| `gray-400` | `#A0AEC0` | 비활성 텍스트, 아이콘, 플레이스홀더 |
| `gray-700` | `#4A5568` | 본문 텍스트 (Body), 서브 타이틀 |
| `gray-900` | `#1A202C` | 제목 텍스트 (Heading), 중요 강조 |

---

## 3. Typography (타이포그래피)

가독성이 높고 모던한 산세리프 서체를 사용합니다. 숫자 가독성이 중요한 서비스(가격, 시간)이므로 고정폭 숫자를 고려하거나 명확한 폰트를 사용합니다.

- **Font Family**: `Pretendard` (Web/App 공통 지향), Fallback: `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto`
- **Scale**:

| Role | Size (rem/px) | Weight | Line Height |
|---|---|---|---|
| **Display** | 1.875rem (30px) | Bold (700) | 1.2 |
| **H1 (Page Title)** | 1.5rem (24px) | Bold (700) | 1.3 |
| **H2 (Section)** | 1.25rem (20px) | SemiBold (600) | 1.4 |
| **H3 (Subsection)** | 1.125rem (18px) | SemiBold (600) | 1.4 |
| **Body 1** | 1rem (16px) | Regular (400) | 1.5 |
| **Body 2** | 0.875rem (14px) | Regular (400) | 1.5 |
| **Caption** | 0.75rem (12px) | Medium (500) | 1.4 |

---

## 4. UI Components (디자인 컴포넌트)

`packages/ui` 패키지에서 구현될 핵심 컴포넌트 스타일 가이드입니다.

### 4.1. Buttons
- **Shape**: Rounded-lg (8px) - 모던하고 부드러운 느낌
- **Height**: 48px (Touch Target 최적화)
- **Primary**: `bg-primary-500` text-white font-bold shadow-sm hover:bg-primary-600 active:scale-95 transition-all
- **Secondary**: `bg-white` border border-gray-200 text-gray-700 hover:bg-gray-50
- **Ghost**: bg-transparent text-gray-600 hover:bg-gray-100

### 4.2. Cards & Containers
- **Style**: Clean White Surface with soft shadow.
- **Tokens**: `bg-white rounded-xl shadow-sm border border-gray-100`
- **Usage**: 청소 서비스 목록, 예약 내역 카드, 리뷰 카드

### 4.3. Inputs & Forms
- **Style**: 입력 영역이 명확하고 편안한 스타일.
- **Default**: `bg-white border border-gray-300 rounded-lg h-12 px-4 focus:ring-2 focus:ring-primary-500 focus:border-transparent`
- **Error**: `border-error` focus:ring-error
- **Label**: `text-gray-700 text-sm font-medium mb-1 block`

### 4.4. Badges / Chips
- **Style**: 파스텔 톤 배경 + 진한 텍스트 (Soft UI)
- **Usage**: 예약 상태(확정/대기/취소), 지역 태그
- **Example**: `bg-primary-50 text-primary-700 rounded-full px-3 py-1 text-xs font-semibold`

---

## 5. Layout & Spacing (레이아웃)

### Spacing System (4px Grid)
- 기본 단위: 4px (`0.25rem`)
- **Container Padding**: Mobile `px-4` (16px) ~ `px-5` (20px) / Web `max-w-4xl mx-auto`
- **Section Gap**: `gap-8` (32px) ~ `gap-12` (48px)
- **Component Gap**: `gap-4` (16px)

### Navigation
- **Mobile**: Bottom Tab Bar (높이 60~64px, 아이콘+라벨)
- **Web**: Sticky GNB (높이 64px, 로고 좌측 + 메뉴 우측)

### Elevation & Shadows
- **Shadow-sm**: 카드, 버튼 (기본 깊이감)
- **Shadow-md**: 드롭다운, 토스트 메시지, 플로팅 버튼 (FAB)
- **Shadow-lg**: 모달 다이얼로그

---

## 6. Theme Strategy (테마 전략)

### 다크 모드 (Dark Mode)
- **초기 전략**: **Light Mode Only**. 청소 서비스 특성상 밝고 깨끗한 이미지가 중요하므로 MVP 단계에서는 라이트 모드에 집중합니다.
- **확장성**: 추후 도입 시 `Slate` 계열(`slate-900`)을 베이스로 하여 눈이 편안한 다크 모드를 지원하도록 Tailwind 클래스(`dark:`)를 예비해둡니다.

### 애니메이션 (Motion)
- **Micro-interactions**: 버튼 탭(`active:scale-95`), 토글 스위치 등에서 150ms 내외의 짧은 피드백 제공.
- **Transitions**: 화면 진입 시 부드러운 페이드/슬라이드 (`react-native-reanimated` / CSS Transition).
- **Loading**: 스켈레톤 UI (`pulse` 효과)를 사용하여 체감 대기 시간 단축.
