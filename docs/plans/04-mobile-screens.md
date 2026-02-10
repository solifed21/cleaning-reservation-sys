# 04. 모바일 앱 화면 설계

## 1. 개요
본 문서는 Expo Router를 기반으로 한 모바일 앱의 화면 구조와 네비게이션 플로우를 정의합니다.
NativeWind(Tailwind CSS)를 사용하여 스타일링하며, TanStack Query를 통해 서버 데이터를 관리합니다.

## 2. 라우팅 구조 (File-based Routing)

Expo Router의 규칙에 따라 `apps/mobile/app` 디렉토리 내의 파일 구조가 곧 URL 경로가 됩니다.

```
apps/mobile/app/
├── _layout.tsx              # Root Layout (Provider 설정 등)
├── index.tsx                # Splash / Entry (Auth 체크 후 리다이렉트)
│
├── (auth)/                  # 인증 그룹 (로그인 전)
│   ├── _layout.tsx          # Stack Navigator
│   ├── login.tsx            # 로그인 화면
│   ├── signup.tsx           # 회원가입 화면
│   └── role-select.tsx      # 역할 선택 (최초 가입 시)
│
├── (customer)/              # 요청자 그룹
│   ├── _layout.tsx          # Tab Navigator (홈, 내 예약, 채팅, 프로필)
│   ├── (tabs)/
│   │   ├── index.tsx        # 홈 (서비스 신청 메인)
│   │   ├── reservations.tsx # 내 예약 목록
│   │   ├── chat.tsx         # 채팅 목록
│   │   └── profile.tsx      # 내 정보
│   │
│   └── request/             # 예약 생성 플로우 (Stack)
│       ├── date.tsx         # 날짜/시간 선택
│       ├── address.tsx      # 주소 입력
│       ├── details.tsx      # 상세 정보 (평수, 요청사항)
│       └── confirm.tsx      # 최종 확인
│
├── (cleaner)/               # 제공자 그룹
│   ├── _layout.tsx          # Tab Navigator
│   ├── (tabs)/
│   │   ├── index.tsx        # 홈 (일감 찾기 - 대기 중인 예약)
│   │   ├── schedule.tsx     # 내 일정 (수락한 예약)
│   │   ├── chat.tsx         # 채팅 목록
│   │   └── profile.tsx      # 프로필/수익 관리
│   │
│   └── job/                 # 작업 상세 (Stack)
│       ├── [id].tsx         # 작업 상세 조회
│       └── complete.tsx     # 작업 완료 처리 (리뷰 등)
│
└── +not-found.tsx           # 404 페이지
```

## 3. 주요 화면 상세 설계

### 3.1 공통 (Auth)
*   **Login (`/login`)**:
    *   소셜 로그인 버튼 (카카오, 네이버)
    *   이메일 로그인 폼 (MVP)
*   **Role Select (`/role-select`)**:
    *   회원가입 직후 진입
    *   "청소를 요청할게요" vs "청소 일을 할게요" 선택 카드

### 3.2 요청자 (Customer)
*   **Home (`(customer)/(tabs)/index`)**:
    *   CTA: "새 청소 예약하기" (Floating Action Button or Main Card)
    *   Recent: 최근 예약 상태 요약 카드 (가장 가까운 예정된 청소)
    *   Banner: 공지사항 또는 프로모션
*   **Request Flow (`(customer)/request/*`)**:
    *   **Date**: 달력 컴포넌트, 시간 슬롯 선택 (오전/오후/저녁)
    *   **Address**: 도로명 주소 검색 (Daum Postcode 연동 또는 API), 상세 주소 입력
    *   **Details**: 방 개수, 평수(Slider), 추가 요청사항(Textarea)
    *   **Confirm**: 입력 정보 요약, 예상 금액 표시, "예약 요청" 버튼
*   **Reservations (`(customer)/(tabs)/reservations`)**:
    *   Filter: 전체 / 대기중 / 확정됨 / 완료
    *   List Item: 날짜, 시간, 상태 배지, 담당자(매칭된 경우)
    *   Detail Modal/Page: 취소 버튼(조건부), 리뷰 작성 버튼(완료 시)

### 3.3 제공자 (Cleaner)
*   **Job Board (`(cleaner)/(tabs)/index`)**:
    *   Filter: 거리순, 날짜순
    *   List Item: 지역(동 단위), 평수, 날짜, 예상 수입
    *   "수락하기" 전 상세 보기 유도
*   **Job Detail (`(cleaner)/job/[id]`)**:
    *   Map: 대략적인 위치 표시 (확정 전 상세 주소 마스킹 고려)
    *   Info: 요청 사항 상세
    *   Action: "수락하기" (Confirm Modal)
*   **Schedule (`(cleaner)/(tabs)/schedule`)**:
    *   Calendar View or List View
    *   오늘의 일정 하이라이트
    *   Action: "작업 시작", "작업 완료" 버튼 (상태 변경 API 호출)

## 4. 컴포넌트 구조 (Atomic Design 응용)

재사용성을 높이기 위해 `packages/ui` 또는 `apps/mobile/components`에 위치.

### Atoms (기본 요소)
*   `Typography`: Title, Body, Caption (Tailwind 클래스 조합)
*   `Button`: Primary(Brand Color), Secondary, Ghost, Danger
*   `Input`: TextInput with Label & Error message
*   `Badge`: Status 표시 (Pending=Yellow, Confirmed=Blue, Completed=Green)
*   `Avatar`: 사용자 프로필 이미지

### Molecules (조합)
*   `FormField`: Label + Input + Error
*   `IconText`: 아이콘과 텍스트가 결합된 형태 (예: 날짜/시간 표시)
*   `RatingStars`: 별점 표시/입력 컴포넌트

### Organisms (복합)
*   `ReservationCard`: 예약 정보 요약 카드 (날짜, 주소, 상태, 버튼 포함)
*   `CalendarPicker`: 날짜 선택 모듈
*   `AddressSearchModal`: 주소 검색 오버레이

### Templates/Layouts
*   `SafeAreaLayout`: 노치 영역 대응 래퍼
*   `KeyboardAvoidLayout`: 입력 폼을 위한 키보드 회피 뷰
*   `TabBarLayout`: 하단 탭바 레이아웃

## 5. 상태 관리 전략
*   **Server State (TanStack Query)**:
    *   예약 목록, 프로필 정보 등 서버 데이터 캐싱 및 동기화
    *   Optimistic Update 적용 (좋아요, 상태 변경 등 빠른 피드백 필요 시)
*   **Client State (Zustand or React Context)**:
    *   예약 생성 프로세스 중 임시 데이터(Form Wizard) 저장
    *   앱 설정 (테마, 알림 설정 등)

## 6. 테마 및 스타일링
*   **System**: NativeWind (Tailwind CSS for React Native)
*   **Colors**:
    *   Primary: Clean Blue (`#00A3FF`)
    *   Secondary: Mint (`#00D4BB`)
    *   Background: White / Light Gray (`#F5F5F5`)
    *   Text: Slate 900 (Main), Slate 500 (Sub)
