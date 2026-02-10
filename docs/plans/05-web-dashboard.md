# 05. 웹 대시보드 설계 (Admin)

## 🎯 개요

이 문서는 `apps/web`에서 제공하는 **관리자 대시보드(Admin Dashboard)**의 화면 설계 및 기능 명세를 다룹니다.
모바일 앱이 일반 사용자(요청자/제공자)를 위한 것이라면, 웹 대시보드는 플랫폼 운영자가 시스템 전반을 관리하고 모니터링하기 위한 도구입니다.

### 주요 목표
- **현황 파악**: 실시간 예약 현황 및 사용자 가입 추이 확인
- **운영 관리**: 사용자 및 예약 데이터 조회/수정/삭제
- **중재**: 분쟁 발생 시 예약 상태 강제 변경 또는 리뷰 관리

### 대상 사용자
- 플랫폼 운영자 (Admin)
- 고객센터 담당자 (CS)
- 데이터 분석가 (조회 전용)

---

## 🗺️ 사이트맵 (Sitemap)

관리자 대시보드는 사이드바 내비게이션 구조를 가집니다.

### 전체 구조
```
/
├── Auth
│   └── /login                    # 관리자 로그인
│
└── Admin (Protected)
    ├── /admin                    # 대시보드 홈 (통계)
    │
    ├── Management
    │   ├── /admin/users          # 회원 관리
    │   │   └── /admin/users/:id  # 회원 상세
    │   ├── /admin/bookings       # 예약 관리
    │   │   └── /admin/bookings/:id # 예약 상세
    │   └── /admin/reviews        # 리뷰 관리
    │
    └── Settings (Post-MVP)
        ├── /admin/settings       # 시스템 설정
        └── /admin/announcements  # 공지사항 관리
```

---

## 💻 화면 상세 설계

### 1. 로그인 (Login)

**경로**: `/login`

**기능**:
- 관리자 계정 이메일/비밀번호 입력
- 2FA (2단계 인증) 지원 - Post-MVP
- 세션 타임아웃 (보안)

**UI 요소**:
| 요소 | 설명 |
|------|------|
| 로고 | 서비스 로고 + "관리자 대시보드" |
| 이메일 입력 | 이메일 형식 검증 |
| 비밀번호 입력 | 마스킹, 보기/숨기기 토글 |
| 로그인 버튼 | Primary 스타일 |
| 에러 메시지 | 로그인 실패 시 표시 |

**보안 고려사항**:
- 로그인 실패 5회 시 계정 잠금 (15분)
- IP 기반 접속 로그 기록
- HTTPS 필수

---

### 2. 대시보드 홈 (Dashboard)

**경로**: `/admin`

**기능**: 플랫폼 주요 지표 한눈에 확인

#### 주요 지표 카드 (Metrics Cards)

| 지표 | 설명 | 업데이트 주기 |
|------|------|--------------|
| 총 사용자 수 | 요청자/제공자 비율 포함 | 실시간 |
| 오늘의 예약 | 상태별 카운트 (대기/확정/진행중/완료) | 실시간 |
| 이번 달 거래액 | 예상/확정 구분 | 1시간 |
| 미처리 문의 | 고객센터 티켓 수 | 실시간 |

#### 차트 섹션

1. **가입자 추이 (Line Chart)**
   - 최근 30일 일별 가입자 수
   - 요청자/제공자 분리 표시

2. **예약 상태 분포 (Pie Chart)**
   - PENDING / CONFIRMED / COMPLETED / CANCELLED 비율

3. **거래액 추이 (Bar Chart)**
   - 최근 6개월 월별 거래액

4. **지역별 활동 (Heatmap)**
   - 창원 시 구/동별 예약 빈도

#### 최근 활동 피드
- 최근 20개 활동 로그 (실시간 업데이트)
  - "새 회원 가입: user@example.com"
  - "예약 #1234 완료"
  - "리뷰 신고 접수"

---

### 3. 회원 관리 (User Management)

**경로**: `/admin/users`

**기능**: 전체 회원 리스트 조회 및 상태 관리

#### 리스트 뷰 (Data Table)

**컬럼 구성**:
| 컬럼 | 너비 | 정렬 | 필터 |
|------|------|------|------|
| 체크박스 | 40px | - | - |
| ID | 80px | ✓ | - |
| 프로필 | 60px | - | - |
| 이름(닉네임) | 120px | ✓ | 검색 |
| 이메일 | 200px | - | 검색 |
| 역할 | 100px | ✓ | Customer/Cleaner |
| 가입일 | 120px | ✓ | 날짜 범위 |
| 상태 | 100px | ✓ | Active/Suspended |
| 액션 | 100px | - | - |

**필터 패널**:
- 역할: 전체 / 요청자 / 제공자
- 상태: 전체 / 활성 / 정지
- 가입일: 날짜 범위 선택기
- 검색: 이름, 이메일

**벌크 액션**:
- 선택 항목 이용 정지
- 선택 항목 내보내기 (CSV)

#### 상세 페이지 (`/admin/users/:id`)

**섹션 구성**:
1. **프로필 헤더**
   - 프로필 이미지, 이름, 이메일, 가입일
   - 상태 토글 (활성/정지)

2. **기본 정보**
   - 전화번호, 역할, 매너온도
   - (제공자) 활동 지역, 소개글

3. **예약 이력**
   - 고객일 경우: 신청한 예약 목록
   - 제공자일 경우: 수락한 예약 목록
   - 페이지네이션 (10개씩)

4. **리뷰 내역**
   - 작성한 리뷰 / 받은 리뷰 탭

5. **활동 로그**
   - 계정 관련 활동 기록

---

### 4. 예약 관리 (Booking Management)

**경로**: `/admin/bookings`

**기능**: 모든 예약 건에 대한 모니터링 및 개입

#### 리스트 뷰 (Data Table)

**컬럼 구성**:
| 컬럼 | 설명 | 필터 |
|------|------|------|
| 예약 ID | #1234 형식 | 검색 |
| 요청자 | 이름 + ID | 검색 |
| 제공자 | 이름 + ID (없으면 "-") | 검색 |
| 일시 | YYYY-MM-DD HH:mm | 날짜 범위 |
| 주소 | 동까지만 표시 | 지역 |
| 상태 | Badge 컴포넌트 | 상태별 |
| 금액 | ₩XXX,XXX | - |
| 생성일 | YYYY-MM-DD | 날짜 범위 |
| 액션 | 버튼 그룹 | - |

**상태별 Badge 색상**:
- PENDING: Yellow (bg-yellow-100 text-yellow-800)
- CONFIRMED: Blue (bg-blue-100 text-blue-800)
- IN_PROGRESS: Purple (bg-purple-100 text-purple-800)
- COMPLETED: Green (bg-green-100 text-green-800)
- CANCELLED: Red (bg-red-100 text-red-800)

#### 상세 모달/페이지

**정보 탭**:
1. **기본 정보**: 예약 ID, 상태, 생성일
2. **참여자**: 요청자/제공자 정보 (클릭 시 회원 상세로 이동)
3. **서비스 정보**: 날짜, 시간, 주소(전체), 평수, 옵션
4. **결제 정보**: 금액, 결제 상태 (Post-MVP)
5. **메시지 로그**: 해당 예약의 메시지 내역
6. **변경 이력**: 상태 변경 로그

**관리자 액션**:
- 강제 취소 (사유 입력 필수)
- 강제 완료 (오류 수정용)
- 상태 변경 (드롭다운)
- 환불 처리 (Post-MVP)

---

### 5. 리뷰 관리 (Review Management)

**경로**: `/admin/reviews`

**기능**: 부적절한 리뷰 모니터링 및 블라인드 처리

#### 리스트 뷰

**컬럼 구성**:
| 컬럼 | 설명 |
|------|------|
| 리뷰 ID | #R001 형식 |
| 작성자 | 이름 + 역할 |
| 대상자 | 이름 + 역할 |
| 별점 | ⭐ 1-5 |
| 내용 | 50자 미리보기 + 더보기 |
| 예약 ID | 클릭 시 예약 상세로 |
| 작성일 | YYYY-MM-DD |
| 신고 수 | 0개 이상시 강조 |
| 상태 | 노출/블라인드 |
| 액션 | 삭제/복구 |

#### 우선 정렬
1. 신고 수 높은 순
2. 별점 낮은 순 (1점 → 5점)
3. 최신 순

#### 액션
- **블라인드 처리**: 리뷰 내용 숨김 (DB에는 유지)
- **삭제**: 완전 삭제 (Soft Delete)
- **신고 무시**: 신고 카운트 초기화

---

### 6. 설정 (Settings) - Post-MVP

**경로**: `/admin/settings`

**설정 항목**:
- 서비스 운영 시간
- 예약 관련 임계값 (자동 취소 시간 등)
- 알림 템플릿 관리
- 배너/공지사항 관리

---

## 🛠️ 기술 구현 사항

### UI 라이브러리 (packages/ui 활용)

#### 레이아웃 컴포넌트
```tsx
// Main Layout Structure
<Sidebar>
  <Logo />
  <NavMenu items={menuItems} />
  <UserMenu user={adminUser} />
</Sidebar>

<MainContent>
  <Header title={pageTitle} breadcrumbs={breadcrumbs} />
  <PageContent>{children}</PageContent>
</MainContent>
```

#### 핵심 컴포넌트
| 컴포넌트 | 용도 | 라이브러리 |
|----------|------|-----------|
| Table | 데이터 그리드 | TanStack Table |
| Pagination | 페이지 이동 | Custom |
| Badge | 상태 표시 | Custom |
| Dialog | 모달 | Radix UI |
| Sheet | 사이드 패널 | Radix UI |
| Card | 통계 카드 | Custom |
| Chart | 그래프 | Recharts |
| DatePicker | 날짜 선택 | React Day Picker |
| Select | 드롭다운 | Radix UI |

### 데이터 관리 (TanStack Query)

#### 쿼리 구조
```tsx
// hooks/useUsers.ts
export function useUsers(filters: UserFilters) {
  return useQuery({
    queryKey: ['admin', 'users', filters],
    queryFn: () => adminApi.getUsers(filters),
    staleTime: 30_000, // 30초
  });
}

// hooks/useUpdateUserStatus.ts
export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.updateUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}
```

#### SSR 설정
```tsx
// routes/admin/users.tsx
export const loader = async ({ request }: RouteContext) => {
  const users = await adminApi.getUsers({});
  return { users };
};
```

### 권한 체크 (Authorization)

#### 라우트 가드
```tsx
// routes/admin/_layout.tsx
export const beforeLoad = async ({ context }) => {
  const user = await getCurrentUser();
  
  if (!user || user.role !== 'ADMIN') {
    throw redirect({ to: '/login' });
  }
  
  return { user };
};
```

#### 권한 레벨
| 레벨 | 권한 |
|------|------|
| SUPER_ADMIN | 모든 기능 + 설정 변경 |
| ADMIN | 조회 + 수정 + 삭제 |
| CS_STAFF | 조회만 + 간단한 상태 변경 |

---

## 📱 반응형 디자인

### 브레이크포인트
| 이름 | 너비 | 레이아웃 |
|------|------|----------|
| Desktop | 1280px+ | 사이드바 + 메인 |
| Tablet | 768px - 1279px | 축소 사이드바 + 메인 |
| Mobile | < 768px | 햄버거 메뉴 + 전체 메인 |

### 모바일 최적화
- 테이블 → 카드 뷰 전환
- 필터 → Bottom Sheet
- 상세 정보 → 전체 페이지 (모달 대신)

---

## 🎨 디자인 가이드

### 색상 (Tailwind)
```css
/* Brand Colors */
--primary: #3B82F6;      /* blue-500 */
--primary-dark: #2563EB; /* blue-600 */

/* Status Colors */
--success: #22C55E;      /* green-500 */
--warning: #EAB308;      /* yellow-500 */
--danger: #EF4444;       /* red-500 */
--info: #6366F1;         /* indigo-500 */

/* Neutral */
--bg-main: #F9FAFB;      /* gray-50 */
--bg-card: #FFFFFF;
--text-main: #111827;    /* gray-900 */
--text-secondary: #6B7280; /* gray-500 */
```

### 다크모드 지원 (Post-MVP)
- `class` 전략 사용
- 시스템 설정 따르기 옵션
- 수동 토글

---

## 🔔 알림 & 피드백

### Toast 알림
| 타입 | 용도 | 지속 시간 |
|------|------|-----------|
| success | 작업 성공 | 3초 |
| error | 작업 실패 | 5초 |
| info | 정보 전달 | 3초 |
| warning | 주의 필요 | 4초 |

### 확인 다이얼로그
위험한 작업 전 확인:
- 회원 이용 정지
- 예약 강제 취소
- 리뷰 삭제

---

## 📊 성능 최적화

### 목표 지표
| 지표 | 목표값 |
|------|--------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Lighthouse Score | > 90 |

### 최적화 전략
1. **코드 스플리팅**: 페이지별 청크 분리
2. **이미지 최적화**: WebP + lazy loading
3. **테이블 가상화**: 대량 데이터 스크롤 최적화
4. **쿼리 캐싱**: TanStack Query 활용
5. **SSR/SSG**: 초기 로드 최적화

---

## 📅 개발 우선순위

### Phase 1 (MVP)
| 항목 | 우선순위 | 예상 공수 |
|------|----------|-----------|
| 관리자 로그인 + 레이아웃 | P0 | 2일 |
| 예약 관리 (CRUD) | P0 | 3일 |
| 회원 관리 (조회 + 상태변경) | P0 | 2일 |

### Phase 2
| 항목 | 우선순위 | 예상 공수 |
|------|----------|-----------|
| 대시보드 통계 | P1 | 3일 |
| 리뷰 관리 | P1 | 2일 |
| 필터/검색 고도화 | P1 | 2일 |

### Phase 3 (Post-MVP)
| 항목 | 우선순위 | 예상 공수 |
|------|----------|-----------|
| 시스템 설정 | P2 | 2일 |
| 공지사항 관리 | P2 | 1일 |
| 다크모드 | P2 | 1일 |
| 접근성 개선 | P2 | 2일 |

---

## ✅ 체크리스트

### 개발 전
- [ ] 디자인 시스템 컬러/타이포 확정
- [ ] 관리자 계정 DB 시딩 준비
- [ ] API 엔드포인트 문서 확인

### 개발 중
- [ ] 공통 레이아웃 컴포넌트 구현
- [ ] 권한 가드 미들웨어 구현
- [ ] Data Table 컴포넌트 구현
- [ ] 각 페이지 퍼블리싱
- [ ] API 연동

### 개발 후
- [ ] 반응형 테스트
- [ ] 접근성 테스트
- [ ] 성능 테스트
- [ ] 보안 점검
