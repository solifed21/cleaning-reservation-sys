# 04. 모바일 앱 화면 설계

이 문서는 Expo Router를 기반으로 한 모바일 앱의 화면 구조와 네비게이션 플로우를 정의합니다.

## 1. 개요

*   **Framework**: Expo SDK 50+
*   **Routing**: Expo Router v3 (File-based routing)
*   **Styling**: NativeWind (Tailwind CSS)
*   **Icons**: Lucide React Native / Expo Vector Icons

## 2. 디렉토리 구조 (Route Structure)

`apps/mobile/app/` 디렉토리의 구조입니다.

```
app/
├── _layout.tsx                  # Root Provider (QueryClient, AuthProvider 등)
├── index.tsx                    # Splash / Redirect Logic (Auth 체크 후 이동)
│
├── (auth)/                      # 인증 그룹 (Stack)
│   ├── _layout.tsx              # Stack Navigator
│   ├── login.tsx                # 로그인 화면
│   ├── signup.tsx               # 회원가입 화면
│   └── role-selection.tsx       # 역할 선택 (최초 가입 시)
│
├── (customer)/                  # 요청자 그룹 (Tabs + Stack)
│   ├── _layout.tsx              # Tab Navigator (Main) & Stack (Details)
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Bottom Tabs 설정
│   │   ├── index.tsx            # 홈 (내 예약 목록)
│   │   ├── book.tsx             # 새 예약 (FAB 또는 탭)
│   │   └── profile.tsx          # 내 정보
│   │
│   └── request/                 # 예약 관련 상세 (Stack)
│       ├── [id].tsx             # 예약 상세 조회
│       ├── create.tsx           # 예약 생성 폼 (Step wizard)
│       ├── payment.tsx          # 결제 화면
│       └── review.tsx           # 리뷰 작성
│
├── (cleaner)/                   # 제공자 그룹 (Tabs + Stack)
│   ├── _layout.tsx              # Tab Navigator & Stack
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx            # 홈 (수락 가능한 일감 목록)
│   │   ├── schedule.tsx         # 내 일정 (확정된 예약)
│   │   └── profile.tsx          # 내 정보 (수익, 지역 설정)
│   │
│   └── job/                     # 일감 관련 상세 (Stack)
│       ├── [id].tsx             # 일감 상세 조회
│       └── execute.tsx          # 청소 진행/완료 처리
│
└── +not-found.tsx               # 404 페이지
```

## 3. 화면 상세 설계

### 3.1. 공통 (Auth)
*   **Login (`/login`)**:
    *   소셜 로그인 버튼 (카카오, 네이버, 구글)
    *   이메일 로그인 폼 (MVP)
*   **Role Selection (`/role-selection`)**:
    *   "청소를 부탁하고 싶어요" (Customer) vs "청소를 하고 싶어요" (Cleaner) 선택
    *   선택 시 해당 프로필 초기 데이터 생성 후 메인으로 이동

### 3.2. 요청자 (Customer)
*   **Home (`(tabs)/index`)**:
    *   상단: 현재 진행 중인 예약 상태 요약 카드
    *   리스트: 과거 예약 이력 및 예정된 예약 리스트
    *   Action: "새 예약하기" 플로팅 버튼 (FAB)
*   **Book (`request/create`)**:
    *   Step 1: 청소 종류 선택 (일반/이사/특수)
    *   Step 2: 주소 입력 (Daum 주소 API 연동 팝업)
    *   Step 3: 날짜 및 시간 선택 (Calendar picker)
    *   Step 4: 평수 및 추가 요구사항 입력
    *   Step 5: 예상 견적 확인 및 등록
*   **Request Detail (`request/[id]`)**:
    *   예약 상태 표시 (대기중/확정/완료)
    *   매칭된 제공자 프로필 카드 (확정 시)
    *   채팅하기 버튼, 전화걸기 버튼
    *   결제하기 버튼 (결제 대기 시)
    *   리뷰 작성 버튼 (완료 시)

### 3.3. 제공자 (Cleaner)
*   **Marketplace (`(tabs)/index`)**:
    *   필터: 내 지역, 날짜별
    *   리스트: '대기중' 상태의 모든 예약 건 카드 리스트 (단가, 위치, 시간 표시)
*   **My Schedule (`(tabs)/schedule`)**:
    *   캘린더 뷰 또는 리스트 뷰
    *   내가 수락한 예약 목록
*   **Job Detail (`job/[id]`)**:
    *   상세 주소 (확정 전에는 동까지만 표시, 확정 후 전체 표시)
    *   요구사항 상세
    *   Action: 수락하기 / 거절하기 (대기 건)
    *   Action: 완료 요청 (진행 건)

## 4. 주요 컴포넌트 (UI Kit)

`packages/ui/components` 또는 `apps/mobile/components`에 구현될 재사용 컴포넌트입니다.

| 컴포넌트명 | 설명 | 사용처 |
| :--- | :--- | :--- |
| `Button` | Primary, Secondary, Ghost, Danger 스타일 | 전역 |
| `Input / FormField` | 라벨, 에러 메시지가 포함된 텍스트 입력 필드 | 로그인, 예약폼 |
| `Card` | 그림자와 라운드가 적용된 컨테이너 | 리스트 아이템 |
| `StatusBadge` | 예약 상태(대기, 확정, 완료)에 따른 색상 뱃지 | 리스트, 상세 |
| `Avatar` | 사용자 프로필 이미지 | 프로필, 상세 |
| `BottomModal` | 하단에서 올라오는 액션 시트 | 옵션 선택, 날짜 선택 |
| `LoadingSpinner` | 로딩 인디케이터 | 데이터 페칭 시 |

## 5. 데이터 연동 전략

*   **TanStack Query**: 서버 상태 관리 (`useQuery`, `useMutation`)
*   **Hooks**:
    *   `useAuth()`: 로그인 세션 관리
    *   `useMyReservations()`: 내 예약 목록 (Customer)
    *   `useOpenReservations()`: 열린 예약 목록 (Cleaner)
    *   `useReservation(id)`: 예약 상세
*   **Optimistic Updates**: 예약 수락/취소 시 UI 즉시 반영
