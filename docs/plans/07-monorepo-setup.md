# Plan 07 - Monorepo Setup (pnpm workspace + Turborepo)

> 목표: **pnpm workspace + Turborepo** 기반으로
> `apps/mobile`, `apps/web`, `packages/shared`, `packages/ui` 를 한 레포에서 일관되게 개발/빌드/테스트/배포할 수 있도록 모노레포를 설계한다.

- Package manager: **pnpm**
- Task runner / cache: **Turborepo**
- Language: **TypeScript**
- Web: **TanStack Start + React**
- Mobile: **Expo (React Native, Expo Router)**
- Styling: **Tailwind CSS (web)** + **NativeWind (mobile)**

---

## 0) TL;DR

- `packages/shared` = 도메인 타입/DTO/Zod/유틸(비-UI) 공용 레이어
- `packages/ui` = **웹 중심** 공용 UI 라이브러리(Tailwind 기반)
  - 모바일 UI 공유는 초기엔 무리하지 말고(번들러/스타일/플랫폼 차이), 필요 시 `packages/ui-native` 분리로 확장
- 모든 워크스페이스 패키지는 동일한 스크립트 규약(`dev/build/typecheck/lint/test/clean`)을 가진다.
- 루트에서는 `turbo run <task>` 로 전체를 통제하고, 워크스페이스 의존성은 **workspace protocol**(`workspace:*`)로 연결한다.

---

## 1) 목표 디렉토리 구조

```txt
cleaning-reservation-sys/
├── apps/
│   ├── mobile/                  # Expo RN + Expo Router
│   └── web/                     # TanStack Start (web + server)
├── packages/
│   ├── shared/                  # 타입/DTO/Zod/유틸
│   └── ui/                      # 공용 UI (웹 우선)
├── tooling/                     # (권장) 설정 공유 패키지
│   ├── eslint-config/
│   └── tsconfig/
├── docs/
│   └── plans/
├── package.json                 # 루트 스크립트 + dev deps
├── pnpm-workspace.yaml
├── turbo.json
├── .npmrc
├── .gitignore
└── README.md
```

### 왜 `tooling/*` 가 필요한가?

- `tsconfig.json`, eslint preset 등을 **복사/붙여넣기**로 관리하면 패키지 수가 늘수록 유지보수가 힘들어진다.
- `tooling/tsconfig`, `tooling/eslint-config` 를 만들면 각 패키지는 `extends` / `devDependencies` 만으로 일관된 규칙을 공유할 수 있다.

---

## 2) 패키지 역할 및 의존성 관계

### 2.1 역할

- `@crs/shared`
  - 도메인 타입, API DTO, Zod schema, date/money 등 util
  - **플랫폼 독립**(node/web/mobile 어디서든 동작)
- `@crs/ui`
  - 웹용 UI 컴포넌트(버튼/폼/모달/토큰)
  - Tailwind preset, className 유틸
- `@crs/web`
  - TanStack Start 기반 웹 + 서버 API(Full-stack)
  - `@crs/shared`/`@crs/ui` 사용
- `@crs/mobile`
  - Expo Router 기반 RN 앱
  - **초기엔 `@crs/shared`만** 사용(모바일 UI 공유는 추후)

### 2.2 의존성 그래프

```txt
@crs/shared (lib)
   ▲        \
   │         \
@crs/ui (lib) \
   ▲           \
   │            \
@crs/web (app)  @crs/mobile (app)
```

원칙:
- `shared` 는 가장 하위 레이어(최소 의존)
- `ui` 는 가능하면 `shared` 에만 의존
- 앱(`web`, `mobile`)은 `shared`/`ui` 를 소비

---

## 3) 루트(Repo) 설정 파일

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

> `pnpm -w <cmd>` 대신, 팀 규약으로 **루트에서 스크립트만 실행**하는 편이 실수(다른 폴더에서 실행)를 줄여준다.

### 3.3 `.npmrc` (권장)

```ini
# 워크스페이스 내부는 pnpm symlink 기반으로 빠르게
node-linker=isolated

# peer dependency 충돌은 초기에 드러내기
strict-peer-dependencies=true

# 모노레포는 루트 lockfile 1개
shared-workspace-lockfile=true
```

### 3.4 `turbo.json` (파이프라인)

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
        ".tanstack/**",
        ".next/**",
        ".expo/**",
        "build/**"
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

> 산출물 폴더는 실제 앱 생성 후 조정한다. Turbo에서 가장 중요한 건 **의존성 그래프(^build) + 캐시 키**를 안정적으로 잡는 것.

---

## 4) `tooling/tsconfig` (공통 TS preset)

### 4.1 `tooling/tsconfig/package.json`

```jsonc
{
  "name": "@crs/tsconfig",
  "version": "0.0.0",
  "private": true,
  "files": ["*.json"],
  "license": "MIT"
}
```

### 4.2 preset 예시

- `tooling/tsconfig/base.json` (공통)
- `tooling/tsconfig/react-library.json` (UI 라이브러리)
- `tooling/tsconfig/react-native.json` (모바일)

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

    "resolveJsonModule": true,
    "esModuleInterop": true,

    // 라이브러리 패키지들이 dist를 만들 수 있게 기본값은 emit 허용
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noEmit": false
  }
}
```

---

## 5) `tooling/eslint-config` (공통 ESLint preset)

### 5.1 `tooling/eslint-config/package.json` (예시)

```jsonc
{
  "name": "@crs/eslint-config",
  "version": "0.0.0",
  "private": true,
  "main": "index.cjs",
  "license": "MIT",
  "dependencies": {
    "@eslint/js": "^9.0.0",
    "eslint": "^9.0.0",
    "typescript-eslint": "^8.0.0"
  }
}
```

> 실제 룰셋은 프로젝트 합의에 따라 확정. 중요한 건 **preset을 패키지로 뽑아서** 모든 워크스페이스가 같은 기준을 쓰게 하는 것.

---

## 6) `packages/shared` (타입/DTO/Zod/유틸)

### 6.1 디렉토리

```txt
packages/shared/
├── src/
│   ├── index.ts
│   ├── domain/
│   ├── dto/
│   ├── schema/         # zod schemas
│   └── utils/
├── tsconfig.json
└── package.json
```

### 6.2 `packages/shared/package.json` (예시)

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
    "test": "echo 'no tests yet'",
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

### 6.3 `packages/shared/tsconfig.json` (예시)

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

> `shared` 는 모바일에서도 소비해야 하므로, **dist 산출물 기반 소비**(빌드된 JS+types)를 기본값으로 한다.

---

## 7) `packages/ui` (공용 UI - Web 우선)

### 7.1 디렉토리

```txt
packages/ui/
├── src/
│   ├── index.ts
│   ├── components/
│   └── styles/
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.cjs
└── package.json
```

### 7.2 `packages/ui/package.json` (예시)

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
    "test": "echo 'no tests yet'",
    "clean": "rimraf dist"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0"
  },
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18"
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

> `@crs/ui` 가 `react` 를 dependencies에 넣으면 앱과 중복 설치될 수 있어, 일반적으로 `peerDependencies` 가 맞다(라이브러리 관점).

---

## 8) `apps/web` (TanStack Start)

### 8.1 의존 관계

- `@crs/web` → `@crs/shared`, `@crs/ui`

### 8.2 `apps/web/package.json` (예시)

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
    "test": "echo 'no tests yet'",
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

> TanStack Start 관련 실제 패키지/CLI명은 프로젝트 스캐폴딩 결과에 맞춰 조정한다.

---

## 9) `apps/mobile` (Expo + Expo Router)

### 9.1 의존 관계

- `@crs/mobile` → `@crs/shared` (초기 필수)
- `@crs/mobile` → `@crs/ui` (초기 비권장)

### 9.2 `apps/mobile/package.json` (예시)

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
    "test": "echo 'no tests yet'",
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

### 9.3 Expo + pnpm workspace에서 자주 발생하는 이슈와 기본 대응

- Metro가 workspace symlink 모듈을 해석하지 못하는 케이스가 있다.
- 해결 전략은 크게 2가지:
  1) `@crs/shared` 를 **빌드 산출물(dist)** 로 소비하도록 유지(이 플랜의 기본)
  2) 또는 Metro 설정에서 workspace 폴더를 watch/resolver에 추가

#### (참고 예시) `apps/mobile/metro.config.js`

```js
const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

// workspace 패키지들을 Metro watch 대상으로 포함
config.watchFolders = [workspaceRoot]

// pnpm 구조에서 모듈 해석 안정화(필요 시)
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]

module.exports = config
```

> 실제로는 NativeWind, Expo SDK, RN 버전에 따라 조정이 필요할 수 있다. 핵심은 “모노레포에서 mobile이 shared를 안정적으로 가져온다”는 목표를 config로 보장하는 것.

---

## 10) 표준 스크립트 규약 (모든 패키지 공통)

모든 워크스페이스 패키지에서 아래 task 이름을 **동일하게** 사용한다.

- `dev`: 개발 서버 or watch
- `build`: 프로덕션 빌드
- `typecheck`: 타입 검사만
- `lint`: 린트
- `test`: 테스트(도입 전에는 placeholder 가능)
- `clean`: 산출물 삭제

그러면 루트에서 항상 아래가 성립:

```bash
pnpm dev
pnpm build
pnpm typecheck
pnpm lint
```

---

## 11) 도입 순서(implementation order)

1. 루트: `pnpm-workspace.yaml`, `turbo.json`, `.npmrc`, 루트 `package.json` 확정
2. `tooling/tsconfig`, `tooling/eslint-config` 생성
3. `packages/shared` 생성 + `pnpm --filter @crs/shared build` 성공
4. `packages/ui` 생성 + `apps/web` 에서 import 성공
5. `apps/web` TanStack Start 스캐폴딩 + workspace deps 연결
6. `apps/mobile` Expo 스캐폴딩 + `@crs/shared` import 성공(필요 시 metro 설정)
7. 루트에서 `pnpm build` / `pnpm typecheck` 가 전체 성공하는지 확인

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
