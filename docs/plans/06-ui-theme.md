# Plan 06: UI/UX 테마 & 디자인 시스템

본 문서는 '창원원룸 청소 예약 시스템'의 시각적 정체성과 일관된 사용자 경험을 위한 디자인 시스템 가이드를 정의합니다.

## 1. 디자인 컨셉

### 핵심 키워드
- **신뢰 (Trust)**: 전문적인 청소 서비스로서의 신뢰성 구축
- **청결 (Cleanliness)**: 깨끗하고 정돈된 시각적 이미지
- **단순함 (Simplicity)**: 예약 과정의 복잡성을 최소화한 직관적 UI

### 무드보드 (Vibe)
- 화이트 공간을 충분히 활용한 여백의 미
- 포인트 컬러로 상쾌한 블루 계열 사용
- 둥근 모서리(Rounded corners)를 활용한 친근감

---

## 2. 컬러 시스템 (Color Palette)

청소 서비스에 어울리는 상쾌하고 깨끗한 블루 계열을 메인으로 사용합니다.

### Primary Colors
- **Main Blue**: `#3B82F6` (Blue 500) - 신뢰와 전문성
- **Light Blue**: `#EFF6FF` (Blue 50) - 배경 및 강조 보조
- **Dark Blue**: `#1E40AF` (Blue 800) - 텍스트 및 버튼 Hover

### Neutral Colors
- **White**: `#FFFFFF` - 기본 배경
- **Gray 50**: `#F9FAFB` - 카드 배경 및 구분선
- **Gray 500**: `#6B7280` - 보조 설명 텍스트
- **Gray 900**: `#111827` - 기본 텍스트 (Black 대신 사용)

### Status Colors
- **Success**: `#10B981` (Green 500) - 예약 완료, 결제 성공
- **Error**: `#EF4444` (Red 500) - 예약 취소, 입력 오류
- **Warning**: `#F59E0B` (Amber 500) - 대기 중, 주의 알림

---

## 3. 타이포그래피 (Typography)

플랫폼 간 일관성을 위해 시스템 폰트를 기본으로 사용하되, 가독성을 최우선으로 합니다.

- **Primary Font**: `Pretendard` (Web/Mobile 공통 권장)
- **Fallback**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`

### Hierarchy
- **Heading 1**: 24px / Bold / Line-height 1.3
- **Heading 2**: 20px / SemiBold / Line-height 1.3
- **Body 1 (Main)**: 16px / Regular / Line-height 1.5
- **Body 2 (Sub)**: 14px / Regular / Line-height 1.5
- **Caption**: 12px / Regular / Line-height 1.4

---

## 4. 컴포넌트 라이브러리 (Component System)

`packages/ui`에 구현될 핵심 컴포넌트 규격입니다. Tailwind CSS 클래스 기준으로 정의합니다.

### Buttons
- **Primary**: `bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600`
- **Secondary**: `bg-gray-100 text-gray-900 rounded-lg px-4 py-2 hover:bg-gray-200`
- **Outline**: `border border-blue-500 text-blue-500 rounded-lg px-4 py-2 hover:bg-blue-50`

### Input Fields
- **Default**: `border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md`
- **Error**: `border-red-500 focus:ring-red-500 focus:border-red-500 rounded-md`

### Cards
- `bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden`

---

## 5. 아이콘 (Iconography)

Lucide (React) / Lucide-ReactNative 아이콘 세트를 사용합니다.

- **예약**: `Calendar`
- **검색**: `Search`
- **청소도구**: `Sparkles`, `Brush`
- **채팅**: `MessageSquare`
- **사용자**: `User`
- **위치**: `MapPin`

---

## 6. UX 가이드라인

### 예약 플로우
1. **단계별 안내**: 복잡한 정보 입력은 3단계 내외의 Wizard 형식으로 분할 (예: 지역/날짜 -> 세부사항 -> 확인)
2. **즉각적 피드백**: 버튼 클릭 시 로딩 상태 표시 및 성공/실패 토스트 메시지

### 모바일 최적화
- **Bottom Navigation**: 엄지손가락이 닿기 쉬운 하단 바 배치
- **Safe Area**: 노치 및 하단 바 영역 고려
- **Touch Target**: 모든 클릭 가능 요소는 최소 44x44px 이상 확보

---

## 7. 다크 모드 (Dark Mode)

청소 서비스의 특성상 깨끗한 이미지를 강조하기 위해 **라이트 모드를 기본**으로 하되, 시스템 설정에 따른 다크 모드를 지원합니다.

- **Dark Background**: `#111827` (Gray 900)
- **Dark Surface**: `#1F2937` (Gray 800)
- **Primary Color**: 다크 모드에서도 Blue 500을 유지하되 대비가 낮은 경우 400으로 조정.
