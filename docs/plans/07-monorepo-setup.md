# Plan 07: Monorepo Setup (pnpm + Turborepo)

이 플랜은 '청소 예약 시스템'의 확장성과 유지보수 효율을 위해 pnpm workspace와 Turborepo 기반의 모노레포 구조를 구축하는 과정을 다룹니다.

## 1. 개요
- **목적**: 코드 공유(shared), UI 일관성(ui), 그리고 다중 플랫폼(web, mobile) 지원을 위한 통합 관리 체계 구축.
- **도구**: 
  - 패키지 매니저: `pnpm`
  - 빌드 시스템: `Turborepo`
  - 언어: `TypeScript`

## 2. 모노레포 구조
```text
cleaning-reservation-sys/
├── apps/
│   ├── mobile/          # React Native / Expo (사용자/매니저 앱)
│   └── web/             # Next.js (관리자 웹 / 예약 웹)
├── packages/
│   ├── shared/          # 공통 로직, API 인터페이스, 유틸리티, 스키마
│   ├── ui/              # 공통 UI 컴포넌트 (React 기반)
│   ├── eslint-config/   # 공통 ESLint 설정
│   └── tsconfig/        # 공통 TypeScript 설정
├── turbo.json           # Turborepo 설정
├── pnpm-workspace.yaml  # pnpm 워크스페이스 정의
└── package.json         # 루트 설정 및 스크립트
```

## 3. 핵심 설정 파일

### 3.1 `pnpm-workspace.yaml`
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
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

### 3.3 루트 `package.json` 스크립트
```json
{
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,md}\""
  }
}
```

## 4. 패키지 상세

### 4.1 `packages/shared`
- **역할**: DTO 정의, Zod 스키마, 날짜 계산 유틸, API 통신 레이어.
- **의존성**: `zod`, `axios` (또는 fetch 유틸).

### 4.2 `packages/ui`
- **역할**: 버튼, 입력창, 모달 등 아토믹 디자인 기반 컴포넌트.
- **의존성**: `react`, `tailwind-merge`, `clsx`.

### 4.3 `apps/web` (Next.js)
- **역할**: 예약 웹사이트 및 관리 대시보드.
- **의존성**: `shared`, `ui` 패키지 참조.

### 4.4 `apps/mobile` (Expo)
- **역할**: 고객용 예약 앱, 클리너용 일정 관리 앱.
- **의존성**: `shared`, `ui` (React Native 호환 컴포넌트 중심).

## 5. 단계별 실행 계획
1. **Init**: 루트 디렉토리 생성 및 `pnpm init`.
2. **Configuration**: `pnpm-workspace.yaml`, `turbo.json`, 공통 `tsconfig` 설정.
3. **Packages**: `packages/shared`, `packages/ui` 기본 뼈대 구성.
4. **Apps**: `apps/web` (Next.js) 및 `apps/mobile` (Expo) 프로젝트 생성 및 워크스페이스 연결.
5. **Validation**: `turbo build`를 통한 전체 빌드 사이클 검증.
