# Plan 07: Monorepo Setup (pnpm + Turborepo)

이 플랜은 '청소 예약 시스템'의 효율적인 코드 관리와 공유를 위해 **pnpm workspace**와 **Turborepo**를 기반으로 한 모노레포 구조를 설계하고 구축하는 단계를 정의합니다.

## 1. 개요
- **목적**: `Web`과 `Mobile` 서비스 간의 비즈니스 로직 및 UI 컴포넌트 공유, 빌드 최적화.
- **도구**: 
  - 패키지 매니저: `pnpm`
  - 빌드 시스템: `Turborepo`
  - 공유 라이브러리: `shared` (로직), `ui` (디자인 시스템)

## 2. 모노레포 구조
```text
.
├── apps/
│   ├── web/                # Next.js 기반 웹 서비스
│   └── mobile/             # React Native (Expo) 기반 모바일 앱
├── packages/
│   ├── shared/             # 공통 API 정의, 유틸리티, 타입 (TS)
│   ├── ui/                 # React 기반 공통 UI 컴포넌트
│   ├── eslint-config/      # 공통 ESLint 설정
│   └── tsconfig/           # 공통 TypeScript 설정
├── turbo.json              # Turborepo 파이프라인 설정
├── pnpm-workspace.yaml     # pnpm 워크스페이스 정의
└── package.json            # 루트 의존성 및 스크립트
```

## 3. 핵심 설정 파일

### 3.1 `pnpm-workspace.yaml`
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### 3.2 `turbo.json`
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

## 4. 의존성 관계
- `apps/web` -> `packages/shared`, `packages/ui`
- `apps/mobile` -> `packages/shared`, `packages/ui`
- `packages/ui` -> `packages/shared` (필요 시)

## 5. 실행 스크립트 (Root `package.json`)
- `pnpm build`: 모든 프로젝트 빌드 (Turbo 사용)
- `pnpm dev`: 모든 프로젝트 개발 모드 실행
- `pnpm lint`: 전체 코드 린트 체크

## 6. 작업 단계
1. [ ] 루트 디렉토리 및 `pnpm-workspace.yaml` 설정
2. [ ] Turborepo (`turbo.json`) 초기화
3. [ ] `packages/shared` 생성 및 공통 타입/유틸 정의
4. [ ] `packages/ui` 생성 (React + Tailwind/Style-dictionary 등)
5. [ ] `apps/web` (Next.js) 생성 및 패키지 참조 설정
6. [ ] `apps/mobile` (Expo) 생성 및 패키지 참조 설정
7. [ ] CI/CD 파이프라인 연동 확인
