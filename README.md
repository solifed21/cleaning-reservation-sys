# 🧹 창원원룸 청소 예약 시스템

원룸 청소가 필요한 사람과 청소를 제공하는 사람을 연결하는 C2C 플랫폼

## Tech Stack

- **Mobile**: Expo React Native
- **Web**: TanStack Start + React
- **Styling**: Tailwind CSS
- **Backend**: TanStack Start (Full-stack)

## 프로젝트 구조

```
cleaning-reservation-sys/
├── apps/
│   ├── mobile/          # Expo React Native 앱
│   └── web/             # TanStack Start 웹 + API
├── packages/
│   ├── shared/          # 공유 타입, 유틸리티
│   └── ui/              # 공유 UI 컴포넌트
├── docs/
│   └── plans/           # 설계 문서
└── README.md
```

## Plans

📋 설계 문서는 `docs/plans/` 디렉토리에서 확인하세요.

| # | 문서 | 상태 |
|---|------|------|
| 01 | [PRD & 아키텍처](docs/plans/01-prd-architecture.md) | ✅ 완료 |
| 02 | DB 스키마 & 데이터 모델 | ⏳ 대기 |
| 03 | [API 엔드포인트](docs/plans/03-api-endpoints.md) | ✅ 완료 |
| 04 | 모바일 앱 화면 설계 | ⏳ 대기 |
| 05 | 웹 대시보드 설계 | ⏳ 대기 |
| 06 | UI/UX 테마 & 디자인 시스템 | ⏳ 대기 |
| 07 | [모노레포 설계](docs/plans/07-monorepo-setup.md) | ✅ 완료 |

## License

MIT
