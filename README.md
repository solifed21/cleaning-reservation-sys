# 🧹 창원원룸 청소 예약 시스템

원룸 청소가 필요한 사람과 청소를 제공하는 사람을 연결하는 C2C 플랫폼

## Tech Stack

- **Mobile**: Expo React Native (Expo Router)
- **Web**: TanStack Start + React
- **Styling**: Tailwind CSS + NativeWind
- **State**: TanStack Query
- **Backend**: TanStack Start (Full-stack)
- **Database**: PostgreSQL (Neon/Supabase)
- **ORM**: Drizzle ORM

## 프로젝트 구조

```
cleaning-reservation-sys/
├── apps/
│   ├── mobile/          # (예정) Expo React Native 앱 (Expo Router)
│   │   └── app/         # (예정) 라우트 그룹: (auth)/(customer)/(cleaner)/(shared)
│   └── web/             # TanStack Start 웹 + API
│       └── server/
│           └── db/
│               ├── schema/      # Drizzle ORM 스키마
│               └── migrations/  # DB 마이그레이션
├── packages/
│   ├── shared/          # 공유 타입, 유틸리티
│   └── ui/              # 공유 UI 컴포넌트
├── docs/
│   └── plans/           # 설계 문서
└── README.md
```

- 모바일 앱의 화면/라우팅 설계는 `docs/plans/04-mobile-screens.md`를 기준으로 구현합니다.
  - Expo Router 라우트 그룹: `(auth)`, `(customer)`, `(cleaner)`, `(shared)`
  - `index.tsx`에서 **Auth Gate(세션/role 기반 redirect)**
  - 역할별 **Tabs + Stack** 혼합 구조, 공통 화면(예약상세/채팅/리뷰/설정)은 `(shared)`로 재사용
  - 컴포넌트/feature/lib/store 권장 폴더 구조 포함
  - (용어) 서버/DB/API는 `bookings`로 통일(과거 `reservations` 표기는 legacy)하고, UI 문맥에서 “예약(booking)”으로 표기

## Database Schema

Drizzle ORM 기반 타입 안전 데이터베이스 설계

- 상세 설계/ERD: `docs/plans/02-database-schema.md`
- 용어: 구현/API 모두 `bookings`로 표기(legacy로 `reservations`가 등장할 수 있음)

### 주요 테이블

- **users**: 사용자 정보 (OAuth 지원)
- **cleaner_profiles**: 청소 제공자 프로필
- **available_times**: 제공자 가능 시간
- **areas / sub_areas**: 서비스 지역
- **cleaner_service_areas**: 제공자-지역 매핑
- **bookings**: 예약 정보
- **messages**: 예약 기반 메시지
- **reviews**: 상호 리뷰
- **notifications**: 알림

### 스키마 파일 위치

```
apps/web/server/db/schema/
├── users.ts
├── cleaner-profiles.ts
├── available-times.ts
├── areas.ts
├── cleaner-service-areas.ts
├── bookings.ts
├── messages.ts
├── reviews.ts
├── notifications.ts
├── relations.ts
└── index.ts
```

### 마이그레이션

```bash
# 스키마 변경 감지
pnpm drizzle-kit generate

# 마이그레이션 실행
pnpm drizzle-kit migrate

# 개발용 push
pnpm drizzle-kit push
```

## Plans

📋 설계 문서는 `docs/plans/` 디렉토리에서 확인하세요.

| # | 문서 | 상태 |
|---|------|------|
| 01 | [PRD & 아키텍처](docs/plans/01-prd-architecture.md) | ✅ 완료 |
| 02 | [DB 스키마 & 데이터 모델](docs/plans/02-database-schema.md) | ✅ 완료 (v3, 2026-02-11) |
| 03 | [API 엔드포인트](docs/plans/03-api-endpoints.md) | ✅ 완료 (v1, 2026-02-11) |
| 04 | [모바일 앱 화면 설계](docs/plans/04-mobile-screens.md) | ✅ 완료 (v3, 2026-02-11) |
| 05 | [웹 대시보드 설계](docs/plans/05-web-dashboard.md) | ✅ 완료 |
| 06 | [UI/UX 테마 & 디자인 시스템](docs/plans/06-ui-theme.md) | ✅ 완료 (v3, 2026-02-11) |
| 07 | [모노레포 설계](docs/plans/07-monorepo-setup.md) | ✅ 완료 (v4, 2026-02-11) |

## License

MIT
