# 04. 모바일 앱 화면 설계

Expo React Native 기반의 모바일 앱 화면 구성 및 네비게이션 흐름 설계

## 📱 개요

- **Platform**: iOS, Android (Expo React Native)
- **Routing**: Expo Router (File-based routing)
- **Styling**: NativeWind (Tailwind CSS)
- **UI Components**: `packages/ui` (Shared Component)

---

## 🧭 네비게이션 구조 (Navigation)

### 루트 구조 (Root Layout)
```
app/
├── _layout.tsx           # 전역 Provider (Auth, Query, Theme)
├── index.tsx             # 스플래시/진입점 (Redirect logic)
├── (auth)/               # 인증 그룹 (Stack)
│   ├── login.tsx         # 로그인
│   ├── signup.tsx        # 회원가입
│   └── _layout.tsx       # Headerless Stack
├── (customer)/           # 요청자 그룹 (Tabs)
│   ├── (tabs)/
│   │   ├── index.tsx     # 홈 (내 예약)
│   │   ├── explore.tsx   # 청소 요청하기 (메인 액션)
│   │   ├── chat.tsx      # 채팅 목록
│   │   └── profile.tsx   # 내 정보
│   └── _layout.tsx
├── (cleaner)/            # 제공자 그룹 (Tabs)
│   ├── (tabs)/
│   │   ├── index.tsx     # 홈 (요청 대기 목록)
│   │   ├── schedule.tsx  # 내 일정 (예약 확정)
│   │   ├── chat.tsx      # 채팅 목록
│   │   └── profile.tsx   # 내 정보
│   └── _layout.tsx
├── booking/              # 예약 상세/공통 (Stack - Modal/Push)
│   ├── [id].tsx          # 예약 상세 (공통)
│   ├── new.tsx           # 새 예약 작성 (Customer)
│   └── review.tsx        # 리뷰 작성 (공통)
└── chat/                 # 채팅방 (Stack)
    └── [id].tsx          # 채팅방 상세
```

---

## 🎨 화면 상세 설계

### 1. 인증 (Auth)

**`login.tsx` (로그인)**
- **UI 요소**:
  - 로고 및 서비스 슬로건
  - "카카오로 계속하기" 버튼 (노란색)
  - "네이버로 계속하기" 버튼 (초록색)
  - "이메일로 로그인" (보조 텍스트 버튼)
- **기능**:
  - OAuth 인증 후 토큰 저장
  - 역할(Role) 확인 후 `(customer)` 또는 `(cleaner)`로 리다이렉트
  - 역할 미설정 시 회원가입 화면으로 이동

**`signup.tsx` (회원가입/역할선택)**
- **UI 요소**:
  - 역할 선택 카드 (요청자 vs 제공자)
  - 기본 정보 입력 폼 (이름, 전화번호)
  - (제공자 선택 시) 활동 지역 선택, 간단 소개
- **기능**:
  - 회원 정보 업데이트 및 역할 부여
  - 가입 완료 후 메인 홈으로 이동

---

### 2. 요청자 (Customer)

**`(tabs)/index.tsx` (홈 - 내 예약)**
- **UI 요소**:
  - **상단**: "안녕하세요, [이름]님!" 인사말 + 알림 아이콘
  - **진행 중인 예약 카드**: 가장 가까운 확정된 예약 1개 (강조)
    - 상태 뱃지 (확정/진행중), 날짜, 시간, 제공자 정보
  - **예약 내역 리스트**: 과거/취소된 예약 목록 (무한 스크롤)
    - [예약 날짜] | [상태] | [주소 요약]
- **Empty State**: "아직 예약이 없어요. 청소를 요청해보세요!" + CTA 버튼

**`(tabs)/explore.tsx` (청소 요청하기)**
- **UI 요소**:
  - **서비스 선택**: 원룸 / 투룸 / 오피스텔 (아이콘 그리드)
  - **최근 주소**: 이전에 입력한 주소 칩(Chip)
  - **인기 옵션**: "이사 청소", "부분 청소" 등 퀵 메뉴
- **플로우**: 서비스 선택 → `booking/new.tsx`로 이동

**`(tabs)/profile.tsx` (내 정보)**
- **UI 요소**:
  - 프로필 이미지, 이름, 등급(매너온도)
  - 메뉴: "주소 관리", "결제 수단", "공지사항", "고객센터", "로그아웃"

---

### 3. 제공자 (Cleaner)

**`(tabs)/index.tsx` (홈 - 일감 찾기)**
- **UI 요소**:
  - **상단**: 필터 (날짜, 지역, 청소유형)
  - **요청 리스트**: 수락 가능한 주변 요청 목록
    - 카드: [지역] [평수] [청소유형] [예상수입]
    - "제안하기" 또는 "수락하기" 버튼
- **Empty State**: "현재 조건에 맞는 요청이 없습니다. 필터를 변경해보세요."

**`(tabs)/schedule.tsx` (내 일정)**
- **UI 요소**:
  - **달력 뷰**: 예약된 날짜 표시 (점)
  - **일별 리스트**: 선택된 날짜의 예약 목록
    - 시간순 정렬
    - 카드: [시간] [고객명] [주소] [상태버튼(시작/완료)]

**`(tabs)/profile.tsx` (제공자 프로필)**
- **UI 요소**:
  - 프로필 관리 (소개글, 활동 지역 수정)
  - **수입 관리**: 이번 달 예상 수입, 정산 내역
  - **리뷰 관리**: 받은 리뷰 목록 및 평점

---

### 4. 공통 기능 (Common)

**`booking/new.tsx` (예약 요청 폼 - Wizard)**
- **Step 1: 기본 정보**
  - 주소 입력 (Daum 주소 API 모달 연동)
  - 건물 형태, 평수, 방 개수 선택
- **Step 2: 일정도**
  - 날짜 선택 (Calendar)
  - 시간 선택 (Time Picker)
- **Step 3: 옵션**
  - 추가 요청사항 (텍스트 에리어)
  - 체크박스: "창틀 청소", "냉장고 내부" 등
- **Step 4: 확인**
  - 요약 정보 및 예상 견적 확인
  - "요청 등록하기" 버튼

**`booking/[id].tsx` (예약 상세)**
- **헤더**: 상태 뱃지 (대기중/확정/진행중/완료)
- **정보 섹션**: 일시, 장소, 서비스 항목
- **지도 섹션**: 청소 위치 지도 표시
- **액션 버튼 (Sticky Bottom)**:
  - (요청자) 수정, 취소, 문의하기
  - (제공자) 수락/거절, 시작하기, 청소완료, 문의하기

**`chat/index.tsx` (채팅 목록)**
- **리스트 아이템**:
  - 상대방 프로필, 이름
  - 마지막 메시지 내용, 시간
  - 안 읽은 메시지 뱃지
- **기능**: 예약 상태와 연동 (예약 취소 시 채팅방 비활성화 표시)

**`chat/[id].tsx` (채팅방)**
- **상단**: 예약 요약 바 (날짜/시간 간단 표시) -> 탭하면 예약 상세로 이동
- **메시지 영역**: 말풍선 UI (내꺼 오른쪽, 상대 왼쪽)
- **입력 영역**: 텍스트 인풋, "+" 버튼(사진 전송, 상용구)
- **시스템 메시지**: "예약이 확정되었습니다.", "청소가 시작되었습니다." 등 자동 발송

---

## 🧩 주요 컴포넌트 (Shared UI)

`packages/ui/src/mobile/` 에 위치할 핵심 컴포넌트

1.  **Button**: Primary(Brand Color), Secondary(Gray), Outline, Ghost
2.  **Input / TextArea**: 라벨, 에러 메시지 포함
3.  **Card**: 그림자, 라운드 처리가 된 컨테이너
4.  **Badge**: 상태 표시용 (Success, Warning, Info, Danger)
5.  **Avatar**: 사용자 프로필 이미지 (원형)
6.  **ScreenLayout**: SafeAreaView 처리 및 공통 패딩
7.  **BottomActionSheet**: 옵션 선택용 모달

---

## 🔄 데이터 흐름 & 상태 관리

- **Server State**: `TanStack Query`
  - 예약 목록, 상세 정보, 프로필 등 비동기 데이터 캐싱
  - `invalidateQueries`로 데이터 갱신 (예: 예약 수락 후 목록 갱신)
- **Client State**: `React Context` or `Zustand` (필요 시)
  - 앱 전역 설정 (테마, 알림 권한 상태)
  - 복잡한 폼 상태 (예약 요청 위자드)
- **Form Handling**: `React Hook Form` + `Zod`
  - 유효성 검사 로직 공유 (`packages/shared/validators`)

---

## ✅ 체크리스트

- [x] Expo Router 기반 파일 구조 생성
- [x] NativeWind 설정 및 테마 컬러 정의
- [x] 공통 UI 컴포넌트 (Button, Input, Card) 구현
- [x] 인증 화면 (Login, Signup) 퍼블리싱
- [x] 탭 네비게이션 (Customer/Cleaner 분기) 구현
