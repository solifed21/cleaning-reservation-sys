# Plan 07 - Monorepo Setup (pnpm workspace + Turborepo)

> 목표: **apps/mobile**, **apps/web**, **packages/shared**, **packages/ui** 를 하나의 레포에서 일관되게 개발/빌드/배포할 수 있도록 **pnpm workspace + Turborepo** 기반 모노레포를 설계한다.

- 패키지 매니저: **pnpm**
- 빌드 오케스트레이션/캐시: **Turborepo**
- 언어: **TypeScript (TS)**
- Web: **TanStack Start + React** (Full-stack)
- Mobile: **Expo (React Native)**

---

## 1) 모노레포 원칙 (Design Principles)

1. **공유 가능한 건 packages로 올린다**
   - 도메인 타입/DTO/Zod 스키마/공용 유틸 → `packages/shared`
   - 공용 UI 컴포넌트/토큰/테마 → `packages/ui`
2. **앱은 최대한 얇게**
   - 앱은 라우팅/화면 조합/런타임 설정에 집중
3. **빌드 단위를 명확히**
   - `shared`, `ui` 는 “라이브러리”로 빌드 산출물(dist)을 갖고
   - `web`, `mobile` 은 “앱”으로 dev/build/run 파이프라인을 가진다
4. **워크스페이스 의존성은 workspace protocol을 사용**
   - `"@crs/shared": "workspace:*"` 같은 형태
5. **React web / React Native의 UI 공유는 ‘현실적인 선’에서**
   - 초반에는 `packages/ui` 를 **web 우선**(Tailwind 기반)으로 잡고,
   - 모바일은 `packages/shared` 를 적극 활용 + UI는 추후 “ui-native” 분리 옵션을 둔다.

---

## 2) 목표 디렉토리 구조

```text
cleaning-reservation-sys/
├── apps/
│   ├── mobile/                    # Expo (React Native)
│   └── web/                       # TanStack Start (web + server)
├── packages/
│   ├── shared/                    # 타입, DTO, Zod 스키마, 유틸
│   └── ui/                        # 공용 UI (웹 우선)
├── tooling/
│   ├── eslint-config/             # 공통 ESLint preset
│   └── tsconfig/                  # 공통 TS 설정 preset
├── package.json                   # 루트 scripts + turbo/pnpm 설정
├── pnpm-workspace.yaml
├── turbo.json
├── .npmrc
└── README.md
```

> `tooling/*` 는 필수는 아니지만, 각 패키지에 설정을 복붙하지 않고 **공유**하기 위해 권장.

---

## 3) 루트(Repo) 설정

### 3.1 `pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "tooling/*"
```

### 3.2 루트 `package.json` (예시)

```jsonc
{
  "name": "cleaning-reservation-sys",
  "private": true,
  "packageManager": "pnpm@9.15.4",
  "engines": {
    "node": ">=20"
  },
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "typecheck": "turbo run typecheck",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "clean": "turbo run clean && rimraf node_modules",
    "format": "prettier -w ."
  },
  "devDependencies": {
    "turbo": "^2.5.0",
    "prettier": "^3.3.0",
    "rimraf": "^6.0.0"
  }
}
```

### 3.3 `.npmrc` (권장)

```ini
# workspace 내부는 pnpm symlink 기반으로 빠르게
node-linker=isolated

# peer dependency 충돌을 숨기지 말고 초기에 드러내기
strict-peer-dependencies=true

# 모노레포에서는 루트에 lockfile 1개
shared-workspace-lockfile=true
```

### 3.4 `turbo.json` (파이프라인 설계)

```jsonc
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": [
        "dist/**",
        ".expo/**",
        ".tanstack/**",
        ".next/**"
      ]
    },
    "typecheck": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "outputs": []
    },
    "clean": {
      "cache": false
    }
  }
}
```

> Web 번들러/프레임워크(TanStack Start) 산출물은 `.tanstack/` 등이 될 수 있으므로 실제 프로젝트 생성 후 outputs는 조정한다.

---

## 4) 공통 Tooling 패키지

### 4.1 `tooling/tsconfig`

**역할**: 모든 패키지/앱이 공통으로 extend 할 TS 베이스 설정 제공.

`tooling/tsconfig/package.json`

```jsonc
{
  "name": "@crs/tsconfig",
  "version": "0.0.0",
  "private": true,
  "files": ["*.json"],
  "license": "MIT"
}
```

예시 프리셋:

- `tooling/tsconfig/base.json`
- `tooling/tsconfig/react-library.json`
- `tooling/tsconfig/react-native.json`

`tooling/tsconfig/base.json`

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022"],
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,

    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,

    "resolveJsonModule": true,
    "esModuleInterop": true,
    "noEmit": false
  }
}
```

### 4.2 `tooling/eslint-config`

**역할**: 각 패키지가 같은 룰을 사용하도록 ESLint preset 제공.

`tooling/eslint-config/package.json`

```jsonc
{
  "name": "@crs/eslint-config",
  "version": "0.0.0",
  "private": true,
  "main": "index.cjs",
  "license": "MIT",
  "dependencies": {
    "@eslint/js": "^9.0.0",
    "typescript-eslint": "^8.0.0",
    "eslint": "^9.0.0"
  }
}
```

---

## 5) `packages/shared` 설계

### 5.1 역할

- **도메인 타입**(User/Cleaner/Booking…)
- **DTO/Request/Response 타입**
- **Zod 스키마** (서버/클라 공용 validation)
- **유틸 함수** (날짜/금액/주소 포맷 등)

> DB 스키마(Drizzle) 그대로를 공용으로 노출하기보다는, 앱이 사용하는 “API Contract 레이어”를 shared가 갖도록 한다.

### 5.2 파일 구조 (예시)

```text
packages/shared/
├── src/
│   ├── index.ts
│   ├── domain/
│   ├── dto/
│   ├── schema/          # zod
│   └── utils/
├── tsconfig.json
└── package.json
```

### 5.3 `packages/shared/package.json` (예시)

```jsonc
{
  "name": "@crs/shared",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "dev": "tsc -w -p tsconfig.json",
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "lint": "eslint .",
    "clean": "rimraf dist"
  },
  "dependencies": {
    "zod": "^3.24.0"
  },
  "devDependencies": {
    "@crs/tsconfig": "workspace:*",
    "@crs/eslint-config": "workspace:*",
    "typescript": "^5.7.0",
    "eslint": "^9.0.0",
    "rimraf": "^6.0.0"
  }
}
```

### 5.4 `packages/shared/tsconfig.json` (예시)

```jsonc
{
  "extends": "@crs/tsconfig/base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

---

## 6) `packages/ui` 설계

### 6.1 역할

- 버튼/인풋/뱃지/카드/다이얼로그 등 공용 컴포넌트
- 디자인 토큰(색상/타이포/간격) 및 Tailwind preset

> **주의**: React Native는 Tailwind/DOM/CSS 개념이 다르므로, `packages/ui` 를 곧바로 100% 모바일 공유로 잡기 어렵다.
>
> 초기 전략:
> - `packages/ui` = **Web(UI) 중심**
> - Mobile은 `packages/shared` 로직 공유에 집중
> - 이후 필요 시 `packages/ui-native` 로 확장

### 6.2 파일 구조 (예시)

```text
packages/ui/
├── src/
│   ├── index.ts
│   ├── components/
│   └── styles/
├── tailwind.config.ts
├── postcss.config.cjs
├── tsconfig.json
└── package.json
```

### 6.3 `packages/ui/package.json` (예시)

```jsonc
{
  "name": "@crs/ui",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "dev": "tsc -w -p tsconfig.json",
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "lint": "eslint .",
    "clean": "rimraf dist"
  },
  "dependencies": {
    "react": "^19.0.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0"
  },
  "peerDependencies": {
    "react": ">=18"
  },
  "devDependencies": {
    "@crs/tsconfig": "workspace:*",
    "@crs/eslint-config": "workspace:*",
    "typescript": "^5.7.0",
    "eslint": "^9.0.0",
    "rimraf": "^6.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

---

## 7) `apps/web` (TanStack Start) 설계

### 7.1 역할

- 유저 예약 웹 + 클리너/관리 대시보드
- 서버 API (TanStack Start의 server functions / routes)
- DB 접근(Drizzle) 및 인증/권한

### 7.2 의존 관계

- `apps/web` → `@crs/shared`, `@crs/ui`
- (선택) 서버 전용 코드가 많아지면 `packages/server` 분리 고려

### 7.3 `apps/web/package.json` (예시)

```jsonc
{
  "name": "@crs/web",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tanstack start dev",
    "build": "tanstack start build",
    "start": "tanstack start start",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "lint": "eslint .",
    "clean": "rimraf dist .tanstack"
  },
  "dependencies": {
    "@crs/shared": "workspace:*",
    "@crs/ui": "workspace:*",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

> 실제 TanStack Start CLI/패키지 명은 프로젝트 생성 시점에 확정한다. (`@tanstack/start` 등)

### 7.4 `apps/web/tsconfig.json` (예시)

```jsonc
{
  "extends": "@crs/tsconfig/base.json",
  "compilerOptions": {
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src", "server", "app", "vite.config.*"]
}
```

---

## 8) `apps/mobile` (Expo) 설계

### 8.1 역할

- 고객용: 예약/결제/채팅/알림
- 클리너용: 일정/예약 관리, 서비스 지역/시간 설정

### 8.2 의존 관계

- `apps/mobile` → `@crs/shared`
- `apps/mobile` → `@crs/ui` 는 **초기엔 비권장** (UI 공유 난이도)

### 8.3 `apps/mobile/package.json` (예시)

```jsonc
{
  "name": "@crs/mobile",
  "private": true,
  "scripts": {
    "dev": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "build": "expo export",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "lint": "eslint .",
    "clean": "rimraf dist .expo"
  },
  "dependencies": {
    "@crs/shared": "workspace:*",
    "expo": "^52.0.0",
    "react": "^19.0.0",
    "react-native": "^0.76.0"
  }
}
```

### 8.4 Expo + workspace 주의사항

- Metro(React Native 번들러)가 workspace symlink를 따라가지 못하는 경우가 있어,
  - `expo-yarn-workspaces` 유사 설정,
  - `metro.config.js` 의 `watchFolders` / `resolver.nodeModulesPaths` 조정
  - 또는 `packages/shared` 를 빌드 산출물(dist)로 consume
  중 하나가 필요할 수 있다.

> 본 플랜에서는 **라이브러리(shared/ui)는 dist를 제공**하는 것으로 설계하여 mobile에서 안정적으로 import하는 방향을 기본값으로 둔다.

---

## 9) 의존성/빌드 그래프

```text
@crs/shared  (lib)
   ▲        \
   │         \
@crs/ui (lib) \   (ui는 shared를 사용할 수 있음)
   ▲           \
   │            \
@crs/web (app)  @crs/mobile (app)
```

- `@crs/shared` 는 **가장 바닥**(leaf)로 유지
- `@crs/ui` 는 가능하면 `shared` 에만 의존
- `web`/`mobile` 은 `shared`/`ui` 를 사용

---

## 10) 표준 스크립트 규약 (모든 패키지에 동일하게)

- `dev`: 개발 서버 or watch
- `build`: 프로덕션 빌드
- `typecheck`: 타입 검사만
- `lint`: 린트
- `test`: 테스트(도입 시)
- `clean`: 산출물 삭제

이 규약을 지키면 루트에서 아래가 항상 성립:

```bash
pnpm dev
pnpm build
pnpm typecheck
pnpm lint
```

---

## 11) 실행 순서(도입 단계)

1. 루트: `pnpm-workspace.yaml`, `turbo.json`, `.npmrc`, 루트 `package.json` 확정
2. `tooling/tsconfig`, `tooling/eslint-config` 구성
3. `packages/shared` 생성 + dist 기반 빌드 확인
4. `packages/ui` 생성 + web에서 import 확인
5. `apps/web` TanStack Start 프로젝트 생성 + workspace deps 연결
6. `apps/mobile` Expo 프로젝트 생성 + workspace deps(특히 shared) 연결
7. Turbo 파이프라인으로 `pnpm build` 전체 성공 확인

---

## 12) 산출물(Deliverables)

- 모노레포 구조 정의 문서(본 문서)
- 루트/패키지별 `package.json`, `tsconfig`, `turbo.json`, `pnpm-workspace.yaml` 설계
- 의존성 관계와 스크립트 규약 확정

---

## Appendix) 명령어 치트시트

```bash
# 전체 개발
pnpm dev

# 전체 빌드
pnpm build

# 특정 앱만
pnpm --filter @crs/web dev
pnpm --filter @crs/mobile dev

# 특정 패키지 빌드
pnpm --filter @crs/shared build
```
