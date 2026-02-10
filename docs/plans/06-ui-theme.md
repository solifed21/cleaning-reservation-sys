# Plan 06 - UI Theme & Design System

## 1. 개요
청소 예약 서비스의 신뢰도와 전문성을 시각적으로 전달하기 위한 UI/UX 테마 및 디자인 시스템 정의.
"청결함", "신뢰", "편안함"을 핵심 키워드로 하여, 사용자가 직관적이고 쾌적하게 예약 과정을 진행할 수 있도록 설계한다.

## 2. 디자인 원칙 (Design Principles)
*   **Clean & Airy:** 여백을 충분히 활용하여 복잡하지 않고 시원한 느낌 제공.
*   **Trustworthy:** 차분하고 전문적인 색채 사용으로 사용자 신뢰 형성.
*   **User-Centric:** 예약 절차의 인지 부하를 최소화하는 직관적인 인터페이스.
*   **Accessible:** 다양한 연령층이 쉽게 사용할 수 있도록 가독성과 접근성 준수.

## 3. 컬러 팔레트 (Color Palette)

### Primary Colors (브랜드 아이덴티티)
*   **Mint Blue (Primary):** `#4ECDC4` - 청결함과 상쾌함을 상징. 주요 버튼 및 활성 상태에 사용.
*   **Deep Ocean (Secondary):** `#292F36` - 깊이감 있는 네이비/다크 그레이 톤. 헤더, 푸터, 중요 텍스트에 사용하여 무게감과 신뢰 전달.

### Secondary Colors (보조 및 강조)
*   **Soft Sky:** `#E0F7FA` - 배경이나 은은한 강조 영역에 사용.
*   **Sunny Clean:** `#FFE66D` - 알림, 뱃지, 프로모션 등 주의를 끌어야 하는 요소에 제한적으로 사용.

### Neutral Colors (배경 및 텍스트)
*   **Pure White:** `#FFFFFF` - 메인 배경, 카드 배경.
*   **Off White:** `#F7F9FC` - 섹션 구분 배경.
*   **Light Gray:** `#E3E5E8` - 보더, 비활성 요소.
*   **Dark Gray:** `#4A4A4A` - 본문 텍스트 (가독성 고려).

## 4. 타이포그래피 (Typography)

### Font Family
*   **한글/영문:** `Pretendard` (또는 Noto Sans KR) - 모바일 가독성이 뛰어나고 깔끔한 산세리프 서체.

### Scale & Style
*   **Headlines (H1, H2):** Bold, 가독성 높은 크기 (24px~32px). 페이지 타이틀 및 주요 섹션 헤더.
*   **Subtitles (H3, H4):** Semi-Bold, 중간 크기 (18px~20px). 카드 제목, 폼 레이블.
*   **Body Text:** Regular, 기본 크기 (14px~16px). 본문, 설명 텍스트.
*   **Caption/Small:** Regular/Medium, 작은 크기 (12px). 부가 설명, 타임스탬프.

## 5. UI 컴포넌트 스타일 (UI Components)

### Buttons
*   **Primary Button:** 배경색 Mint Blue, 텍스트 White. 둥근 모서리 (Rounded-lg, 8px~12px). 그림자(Shadow-sm)로 살짝 띄워 클릭 유도.
*   **Secondary Button:** 배경색 White, 보더 Mint Blue 또는 Deep Ocean.
*   **Disabled:** 배경색 Light Gray, 텍스트 Dark Gray (Opacity 조절).

### Cards & Containers
*   **Style:** Pure White 배경, 은은한 그림자 (Box-shadow soft), 둥근 모서리 (Border-radius 12px~16px).
*   **Usage:** 예약 내역, 청소 매니저 프로필, 리뷰 박스 등 정보를 그룹화할 때 사용.

### Forms & Inputs
*   **Input Fields:** 높이감 있는 입력창 (48px~56px)으로 터치 편의성 확보.
*   **State:**
    *   Default: Light Gray 보더.
    *   Focus: Mint Blue 보더 및 은은한 Glow.
    *   Error: Red 톤 보더 및 하단 메시지.
*   **Labels:** 명확하고 간결한 레이블, 필요 시 플레이스홀더로 예시 제공.

### Icons
*   **Style:** 얇고 심플한 라인 아이콘 (Feather Icons, Heroicons 등).
*   **Color:** Deep Ocean 또는 Dark Gray를 기본으로 하되, 활성 상태에서 Primary Color 사용.

## 6. 레이아웃 및 UX 패턴

### Mobile First
*   모바일 환경을 최우선으로 고려한 반응형 디자인.
*   하단 고정 내비게이션 바 (Bottom Navigation) 또는 햄버거 메뉴 활용.

### Reservation Flow (예약 흐름)
*   **Step-by-Step:** 긴 폼을 한 번에 보여주지 않고, 단계별(날짜 선택 -> 서비스 선택 -> 결제)로 나누어 진행 상황(Progress Bar) 표시.
*   **Sticky CTA:** '예약하기' 등 주요 액션 버튼은 화면 하단에 고정하여 언제든 접근 가능하게 함.

## 7. 다크 모드 고려 (Optional)
*   초기 버전은 라이트 모드 중심.
*   추후 다크 모드 도입 시, Deep Ocean을 배경색으로 반전하고 텍스트 대비를 조정하여 눈의 피로도 감소 유도.
