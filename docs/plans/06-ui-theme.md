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
| `primary-500` | `#00C2C7` | **Mint Teal** | 메인 버튼, 활성 아이콘, 브랜드 로고 |
| `primary-600` | `#00A5A9` | **Deep Teal** | 메인 버튼(Hover/Press) |
| `secondary-500` | `#2D3748` | **Slate Navy** | 헤더 텍스트, 네비게이션, 강조 UI |
| `secondary-100` | `#F7FAFC` | **Pale Blue Gray** | 배경색, 카드 배경 |

### Functional Colors (기능성 컬러)

| Token Name | Hex Code | Description | Usage |
|---|---|---|---|
| `success` | `#38A169` | Green | 예약 확정, 결제 성공, 긍정적 리뷰 |
| `warning` | `#D69E2E` | Amber | 예약 대기, 주의 사항 |
| `error` | `#E53E3E` | Red | 예약 취소, 결제 실패, 오류 |
| `info` | `#3182CE` | Blue | 정보성 알림, 링크 |

### Neutral Colors (무채색)

| Token Name | Hex Code | Usage |
|---|---|---|
| `white` | `#FFFFFF` | 카드 배경, 메인 배경 |
| `gray-50` | `#F9FAFB` | 앱 전체 배경 (Subtle) |
| `gray-200` | `#E2E8F0` | 보더(Border), 디바이더 |
| `gray-400` | `#A0AEC0` | 비활성 텍스트, 플레이스홀더 |
| `gray-700` | `#4A5568` | 본문 텍스트 (Body) |
| `gray-900` | `#1A202C` | 제목 텍스트 (Heading) |

---

## 3. Typography (타이포그래피)

가독성이 높고 모던한 산세리프 서체를 사용합니다. 한글과 영문 혼용 시 이질감이 없는 폰트를 선정합니다.

- **Font Family**: `Pretendard` (System Font Fallback: `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`)
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
- **Shape**: Rounded-lg (8px) 또는 Full Rounded (Pill shape)
- **Primary**: `bg-primary-500` text-white font-semibold shadow-sm hover:bg-primary-600
- **Secondary**: `bg-white` border border-gray-200 text-gray-700 hover:bg-gray-50
- **Ghost**: bg-transparent text-gray-600 hover:bg-gray-100

### 4.2. Cards & Containers
- **Style**: Clean White Surface with soft shadow.
- **Tokens**: `bg-white rounded-xl shadow-sm border border-gray-100`
- **Usage**: 청소 리스트 아이템, 프로필 요약, 결제 내역

### 4.3. Inputs & Forms
- **Style**: 미니멀하고 입력 영역이 명확한 스타일.
- **Default**: `bg-white border border-gray-300 rounded-lg h-12 px-4 focus:ring-2 focus:ring-primary-500 focus:border-transparent`
- **Validation**: 에러 시 `border-error` 및 헬퍼 텍스트 노출

### 4.4. Icons
- **Library**: `Lucide React` (Web) / `Lucide React Native` (App)
- **Style**: Stroke Width 2px, Rounded Line Join/Cap (부드러운 느낌)

---

## 5. Layout & Spacing (레이아웃)

### Spacing System (4px Grid)
- 기본 단위: 4px (`rem` 기준 0.25rem)
- `gap-4` (16px): 컴포넌트 간 기본 간격
- `p-4` (16px) ~ `p-6` (24px): 모바일 컨테이너 패딩
- `max-w-screen-sm`: 모바일 뷰 최적화 (웹에서도 앱처럼 보이도록 중앙 정렬 레이아웃 옵션 고려)

### Navigation
- **Mobile**: 하단 탭 바 (Bottom Tab Bar) - 높이 60~64px
- **Web**: 상단 GNB (Global Navigation Bar) - 높이 64px, Sticky

---

## 6. Theme Strategy (테마 전략)

### 다크 모드 (Dark Mode)
- 초기 MVP 단계에서는 **Light Mode Only**로 진행 (청소 서비스의 '깨끗함' 강조를 위해 화이트 베이스 유지).
- 추후 시스템 설정에 따른 다크 모드 지원 시, `Slate-900` 계열의 다크 네이비 배경을 사용하여 눈의 피로를 줄임.

### 애니메이션 (Motion)
- **Micro-interactions**: 버튼 클릭, 탭 전환 시 즉각적이고 짧은 피드백 (Duration: 150ms~200ms).
- **Transitions**: 화면 전환 시 부드러운 Slide-in/out (React Native Stack Navigator 기본 활용).
