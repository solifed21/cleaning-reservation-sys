# 05. 웹 대시보드 설계 (Admin)

## 🎯 개요

이 문서는 `apps/web`에서 제공하는 **관리자 대시보드(Admin Dashboard)**의 화면 설계 및 기능 명세를 다룹니다.
모바일 앱이 일반 사용자(요청자/제공자)를 위한 것이라면, 웹 대시보드는 플랫폼 운영자가 시스템 전반을 관리하고 모니터링하기 위한 도구입니다.

### 주요 목표
- **현황 파악**: 실시간 예약 현황 및 사용자 가입 추이 확인
- **운영 관리**: 사용자 및 예약 데이터 조회/수정/삭제
- **중재**: 분쟁 발생 시 예약 상태 강제 변경 또는 리뷰 관리

---

## 🗺️ 사이트맵 (Sitemap)

관리자 대시보드는 사이드바 내비게이션 구조를 가집니다.

- **Auth**
  - `/login` : 관리자 로그인
- **Dashboard**
  - `/admin` : 메인 대시보드 (통계)
- **Management**
  - `/admin/users` : 회원 관리 (목록/상세)
  - `/admin/bookings` : 예약 관리 (전체 예약 흐름 모니터링)
  - `/admin/reviews` : 리뷰 관리 (모니터링 및 삭제)
- **Settings** (Post-MVP)
  - `/admin/settings` : 시스템 설정 (배너, 공지사항 등)

---

## 💻 화면 상세 설계

### 1. 로그인 (Login)
- **경로**: `/login` (또는 `/admin/login`)
- **기능**:
  - 관리자 계정 이메일/비밀번호 입력
  - 소셜 로그인 없이 ID/PW 방식 권장 (보안 목적)
- **UI 요소**:
  - 로고
  - ID/PW 입력 폼
  - "로그인" 버튼

### 2. 대시보드 홈 (Dashboard)
- **경로**: `/admin`
- **기능**: 플랫폼 주요 지표 한눈에 확인
- **주요 지표 (Metrics)**:
  - **총 사용자 수**: (요청자 / 제공자 비율)
  - **오늘의 예약**: (대기 / 확정 / 진행중 / 완료)
  - **이번 달 거래액**: (예상)
- **차트 (Optional)**:
  - 최근 7일 가입자 추이 (Line Chart)
  - 예약 상태 분포 (Pie Chart)

### 3. 회원 관리 (User Management)
- **경로**: `/admin/users`
- **기능**: 전체 회원 리스트 조회 및 상태 관리
- **UI 요소 (Data Table)**:
  - **컬럼**: ID, 이름(닉네임), 이메일, 역할(Customer/Cleaner), 가입일, 상태(Active/Suspended)
  - **필터**: 역할별(Customer/Cleaner), 이름 검색
  - **액션**: 상세 보기, 강제 탈퇴, 이용 정지
- **상세 모달/페이지**:
  - 프로필 정보, 예약 이력(Bookings History), 작성한 리뷰 조회

### 4. 예약 관리 (Booking Management)
- **경로**: `/admin/bookings`
- **기능**: 모든 예약 건에 대한 모니터링 및 개입
- **UI 요소 (Data Table)**:
  - **컬럼**: 예약 ID, 요청자, 제공자, 날짜/시간, 주소(동까지만), 상태(PENDING/CONFIRMED/COMPLETED/CANCELLED), 생성일
  - **필터**: 날짜 범위, 상태별(Status), 사용자 검색
  - **액션**: 예약 상세 보기, 강제 취소(환불 처리 등), 강제 완료(오류 수정용)
- **주요 시나리오**:
  - "제공자가 노쇼(No-show) 했는데 상태가 안 바뀌어요" → 관리자가 강제 취소 처리

### 5. 리뷰 관리 (Review Management)
- **경로**: `/admin/reviews`
- **기능**: 부적절한 리뷰 모니터링 및 블라인드 처리
- **UI 요소 (List/Table)**:
  - **컬럼**: 리뷰 ID, 작성자, 대상자, 별점, 내용(일부), 작성일
  - **필터**: 별점 낮은 순, 최신 순
  - **액션**: 리뷰 삭제(블라인드)

---

## 🛠️ 기술 구현 사항

### UI 라이브러리 (packages/ui 활용)
- **Layout**: `Sidebar`, `Header`, `MainLayout`
- **Components**:
  - `Table` (TanStack Table 기반 데이터 그리드)
  - `Pagination`
  - `Badge` (상태 표시용: Green=Completed, Yellow=Pending, Red=Cancelled)
  - `Dialog` / `Sheet` (상세 정보 조회용 모달/드로어)
  - `Card` (대시보드 통계용)

### 데이터 관리 (TanStack Query)
- **Fetching**:
  - 서버 사이드 렌더링(SSR)을 통해 초기 데이터 로드 (TanStack Start `loader`)
  - 클라이언트 사이드에서 필터링/페이지네이션 시 `useQuery` 활용
- **Mutations**:
  - `useMutation`으로 상태 변경 (User Ban, Booking Cancel)
  - Optimistic Update 적용하여 빠른 반응성 제공

### 권한 체크 (Authorization)
- 미들웨어(`middleware`) 또는 `beforeLoad` 라우트 가드에서 `role === 'ADMIN'` 체크
- 일반 유저 접근 시 403 Forbidden 또는 홈으로 리다이렉트

---

## 📅 개발 우선순위

1. **P0**: 관리자 로그인 및 기본 레이아웃 (Shell)
2. **P0**: 예약 관리 (운영 필수 기능)
3. **P1**: 회원 관리 (조회 위주)
4. **P2**: 대시보드 통계 및 리뷰 관리
