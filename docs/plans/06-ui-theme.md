# Plan 06: UI/UX 테마 & 디자인 시스템

## 1. 개요
본 문서는 "창원원룸 청소 예약 시스템"의 시각적 정체성과 일관된 사용자 경험을 위한 디자인 가이드라인입니다.
청소 서비스의 핵심 가치인 **"청결함", "신뢰", "간편함"**을 시각적으로 전달하는 것을 목표로 합니다.

## 2. 디자인 원칙 (Design Principles)
1.  **Clean & Fresh**: 불필요한 장식을 배제하고, 여백을 충분히 활용하여 깨끗한 느낌을 줍니다.
2.  **Trustworthy**: 차분하고 안정적인 컬러를 사용하여 사용자에게 신뢰감을 줍니다.
3.  **Accessible**: 명확한 대비와 폰트 크기를 사용하여 누구나 쉽게 정보를 확인할 수 있도록 합니다.

## 3. 컬러 시스템 (Color System)
Tailwind CSS 기본 팔레트를 기반으로 확장하여 사용합니다.

### Primary (브랜드 컬러)
청결함과 전문성을 상징하는 블루 계열을 메인으로 사용합니다.
- **Primary Blue**: `#0EA5E9` (Sky-500) - 메인 버튼, 활성 상태, 강조 텍스트
- **Primary Dark**: `#0284C7` (Sky-600) - 버튼 호버, 텍스트 강조
- **Primary Light**: `#E0F2FE` (Sky-100) - 배경 강조, 선택된 아이템 배경

### Secondary (보조 컬러)
신선함과 친근함을 더해주는 민트/그린 계열을 사용합니다.
- **Mint**: `#14B8A6` (Teal-500) - 성공 메시지, 완료 상태 배지, 포인트 아이콘

### Neutrals (무채색)
가독성을 위한 그레이 스케일입니다.
- **Black**: `#0F172A` (Slate-900) - 메인 타이틀, 본문 텍스트
- **Dark Gray**: `#475569` (Slate-600) - 부가 설명, 비활성 텍스트
- **Light Gray**: `#94A3B8` (Slate-400) - 플레이스홀더, 아이콘
- **Border**: `#E2E8F0` (Slate-200) - 디바이더, 보더
- **Background**: `#F8FAFC` (Slate-50) - 앱 배경색
- **Surface**: `#FFFFFF` (White) - 카드, 모달, 입력창 배경

### Semantic (상태 컬러)
- **Success**: `#22C55E` (Green-500) - 예약 확정, 청소 완료
- **Warning**: `#F59E0B` (Amber-500) - 주의, 미확인 알림
- **Error**: `#EF4444` (Red-500) - 예약 취소, 결제 실패, 오류

## 4. 타이포그래피 (Typography)
가독성이 뛰어난 산세리프 폰트를 사용합니다. (한글: Pretendard 권장, 영문: Inter)

### Scale
- **H1 (Large Title)**: 24px (Bold) - 메인 화면 헤더
- **H2 (Title)**: 20px (Bold) - 섹션 타이틀
- **H3 (Subtitle)**: 18px (SemiBold) - 카드 타이틀
- **Body 1**: 16px (Regular/Medium) - 본문 기본
- **Body 2**: 14px (Regular) - 부가 정보, 리스트 아이템
- **Caption**: 12px (Regular) - 설명, 날짜, 태그 텍스트

## 5. UI 컴포넌트 스타일 (Component Style)

### 버튼 (Buttons)
- **Shape**: Rounded-lg (8px) 또는 Rounded-full (완전 둥글게)
- **Height**: 48px (모바일 터치 타겟 고려)
- **Styles**:
    - **Solid**: Primary Blue 배경 + 흰색 텍스트 (주요 액션)
    - **Outline**: Primary Blue 보더 + Primary Blue 텍스트 (보조 액션)
    - **Ghost**: 투명 배경 + Dark Gray 텍스트 (취소, 닫기 등)

### 카드 (Cards)
- **Background**: White
- **Shadow**: `shadow-sm` (미세한 그림자) -> 호버/터치 시 `shadow-md`
- **Border**: `border border-slate-100` (선택적)
- **Radius**: `rounded-2xl` (16px) - 부드러운 느낌 강조

### 입력 필드 (Inputs)
- **Background**: `bg-slate-50` 또는 White
- **Border**: `border-slate-200` -> 포커스 시 `border-sky-500`
- **Height**: 48px
- **Radius**: `rounded-lg`

### 아이콘 (Icons)
- **Library**: Lucide React / Lucide React Native
- **Style**: Stroke Width 2px (선명함 유지)
- **Color**: 텍스트 컬러와 맞추거나, Slate-400 사용

## 6. 레이아웃 & 스페이싱 (Spacing)
8pt 그리드 시스템을 기본으로 사용합니다.
- **Base Unit**: 4px
- **Spacing Scale**:
    - 4px (xs)
    - 8px (sm)
    - 16px (md) - 기본 패딩
    - 24px (lg) - 섹션 간격
    - 32px (xl)
    - 48px (2xl)

## 7. 테마 적용 계획
- **Tailwind Config**: `tailwind.config.js`에 위 컬러 팔레트와 폰트 설정을 커스텀 테마로 등록합니다.
- **Dark Mode**: 초기 단계에서는 Light Mode 우선 지원하되, 컬러 변수 사용을 통해 추후 다크 모드 확장이 용이하도록 구성합니다.
