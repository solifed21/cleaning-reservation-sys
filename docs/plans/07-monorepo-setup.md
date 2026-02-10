# Plan 07 - Monorepo Setup (pnpm workspace + Turborepo)

> 목표: **pnpm workspace + Turborepo** 기반으로
> `apps/mobile`, `apps/web`, `packages/shared`, `packages/ui` 를 한 레포에서 일관되게 개발/빌드/타입체크/린트할 수 있도록 모노레포를 설계한다.
>
> 범위: **모노레포 “설계 문서”** (스캐폴딩/실제 생성은 별도 플랜/태스크로 수행)

- Package manager: **pnpm**
- Task runner / Remote cache ready: **Turborepo**
- Language: **TypeScript**
- Web: **TanStack Start + React**
- Mobile: **Expo (React Native, Expo Router)**
- Styling: **Tailwind CSS (web)** + **NativeWind (mobile)**

---

## 0) TL;DR (결론)

- `packages/shared` = **도메인 타입/DTO/Zod/유틸**(비-UI) 공용 레이어 (모바일/웹/서버 공통)
- `packages/ui` = **웹 우선** 공용 UI 라이브러리(React + Tailwind)
  - 모바일 UI까지 한 패키지로 억지 공유하지 말고(번들러/스타일/플랫폼 차이), 필요 시 `packages/ui-native` 로 분리 확장
- 모든 워크스페이스는 동일한 task 이름 규약(`dev/build/typecheck/lint/test/clean`)을 가진다.
- 루트에서는 `turbo run <task>` 로 전체를 통제하고, 워크스페이스 의존성은 **workspace protocol**(`workspace:*`)로 연결한다.
- Expo(모바일)는 pnpm symlink + Metro 해석 문제가 잦으므로:
  - **기본값은 `@crs/shared` 를 dist 산출물 기반으로 소비**(빌드된 JS/types)
  - 필요 시 Metro 설정으로 workspace watch/resolver를 보강한다.

---

## 1) 목표 디렉토리 구조

```txt
cleaning-reservation-sys/
├── apps/
│   ├── mobile/                  # Expo RN + Expo Router
│   └── web/                     # TanStack Start (web + server)
├── packages/
│   ├── shared/                  # 타입/DTO/Zod/유틸 (플랫폼 독립)
│   └── ui/                      # 공용 UI (웹 우선)
├── tooling/                     # (권장) 설정 공유 패키지
│   ├── eslint-config/           # 공통 eslint preset (flat config)
│   └── tsconfig/                # 공통 tsconfig preset
├── docs/
│   └── plans/
├── package.json                 # 루트 스크립트 + dev deps
├── pnpm-workspace.yaml
├── turbo.json
├── .npmrc
├── .gitignore
├── .editorconfig                # (권장)
├── prettier.config.cjs          # (권장)
└── README.md
```

### 왜 `tooling/*` 가 필요한가?

- `tsconfig.json`, eslint 설정을 **복사/붙여넣기**로 관리하면 패키지 수가 늘수록 유지보수가 급격히 어려워진다.
- `tooling/tsconfig`, `tooling/eslint-config` 로 preset을 패키지화하면, 각 워크스페이스는 `extends` / `devDependencies` 만으로 규칙을 공유할 수 있다.

---

## 2) 패키지 역할 및 의존성 관계

### 2.1 역할

- `@crs/shared`
  - 도메인 타입, API DTO, Zod schema, 공용 유틸(date/money/validation 등)
  - **플랫폼 독립** (node/web/mobile 어디서든 동작)
- `@crs/ui`
  - 웹용 UI 컴포넌트(버튼/입력/모달/토큰), Tailwind preset, className 유틸
  - 원칙적으로 `@crs/shared` 만 의존
- `@crs/web`
  - TanStack Start 기반 웹 + 서버 API(Full-stack)
  - `@crs/shared`/`@crs/ui` 사용
- `@crs/mobile`
  - Expo Router 기반 RN 앱
  - **초기에는 `@crs/shared`만** 사용(모바일 UI 공유는 추후)

### 2.2 의존성 그래프 (원칙)

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
- `ui` 는 가능한 `shared` 에만 의존
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

### 3.2 루트 `package.json` (권장 스크립트 규약)

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

규칙:
- 팀 규약으로 **루트에서만** `pnpm dev/build/...` 를 실행하는 습관을 강제한다.
- 개별 패키지 실행은 `pnpm --filter ...` 로만 한다.

### 3.3 `.npmrc` (권장)

```ini
# 워크스페이스 내부는 pnpm symlink 기반으로 빠르게
node-linker=isolated

# peer dependency 충돌은 초기에 드러내기
strict-peer-dependencies=true

# 모노레포는 루트 lockfile 1개
shared-workspace-lockfile=true
```

> Expo/React Native 쪽은 환경에 따라 `strict-peer-dependencies=true` 가 초기에 빡셀 수 있다.
> 충돌이 잦다면 **일시적으로** false 로 낮추되, 안정화 후 다시 true 로 복구하는 것을 권장한다.

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

의도:
- `build` 는 항상 하위 의존성(`^build`)부터 빌드한다.
- `typecheck` 는 빌드가 필요한 패키지(특히 dist 기반 소비)가 있으므로 `^build` 뒤에 수행한다.

### 3.5 `.gitignore` (핵심 포인트)

```gitignore
# deps
node_modules

# builds
dist
build

# turbo
.turbo

# web
.tanstack
.next

# expo
.expo
.expo-shared
*.jks

# misc
.DS_Store
.env
.env.*
```

### 3.6 `prettier.config.cjs` (권장)

```js
/** @type {import('prettier').Config} */
module.exports = {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
}
```

---

## 4) 공통 설정 패키지: `tooling/tsconfig`

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

### 4.2 preset 파일(권장)

- `tooling/tsconfig/base.json` (모든 패키지 공통)
- `tooling/tsconfig/library.json` (공유 라이브러리 빌드용)
- `tooling/tsconfig/react-library.json` (React UI 라이브러리)
- `tooling/tsconfig/app.json` (앱 공통)

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
    "esModuleInterop": true
  }
}
```

`tooling/tsconfig/library.json`

```jsonc
{
  "extends": "./base.json",
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noEmit": false
  }
}
```

---

## 5) 공통 설정 패키지: `tooling/eslint-config`

> ESLint v9 기준: **flat config** 를 권장한다.

### 5.1 `tooling/eslint-config/package.json` (예시)

```jsonc
{
  "name": "@crs/eslint-config",
  "version": "0.0.0",
  "private": true,
  "main": "index.js",
  "license": "MIT",
  "dependencies": {
    "@eslint/js": "^9.0.0",
    "eslint": "^9.0.0",
    "typescript-eslint": "^8.0.0"
  }
}
```

### 5.2 `tooling/eslint-config/index.js` (개념 예시)

```js
import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'no-console': 'off'
    }
  }
]
```

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
├── eslint.config.js
└── package.json
```

### 6.2 `packages/shared/package.json` (권장)

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

### 6.3 `packages/shared/tsconfig.json`

```jsonc
{
  "extends": "@crs/tsconfig/library.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

### 6.4 `packages/shared/eslint.config.js`

```js
import base from '@crs/eslint-config'

export default [
  ...base,
  {
    ignores: ['dist/**']
  }
]
```

설계 포인트:
- `shared` 는 모바일에서도 소비하므로, **dist 산출물 기반 소비**가 가장 안전하다.

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
├── eslint.config.js
├── tailwind.config.ts
├── postcss.config.cjs
└── package.json
```

### 7.2 `packages/ui/package.json` (권장)

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
    "@crs/shared": "workspace:*",
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

설계 포인트:
- `@crs/ui` 는 라이브러리이므로 `react` 는 보통 `peerDependencies` 가 맞다(앱이 실제 React를 제공).
- `@crs/ui` 가 `@crs/shared` 를 쓰면, `devDependencies` + 소스 import로도 충분하지만(로컬 개발), dist 소비 체계를 유지하면 더 안정적이다.

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

> TanStack Start의 실제 CLI/패키지명은 스캐폴딩 결과에 맞춰 조정한다.

### 8.3 웹(Tailwind)에서 `@crs/ui` 사용 시 주의점

- Tailwind content scan 경로에 `../../packages/ui/src/**/*.{ts,tsx}` 를 반드시 포함해야, UI 패키지의 클래스가 purge 되지 않는다.
- 가능하면 `@crs/ui` 쪽에 Tailwind preset을 만들고, `apps/web/tailwind.config.ts` 에서 preset을 consume 한다.

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

문제:
- Metro가 workspace symlink 모듈을 해석하지 못하거나, 감시(watch)가 안 되어 변경 반영이 늦는 이슈가 발생할 수 있다.

기본 전략(우선순위):
1) `@crs/shared` 를 **빌드 산출물(dist)** 로 소비하도록 유지 (이 플랜 기본값)
2) 그래도 문제가 있으면 Metro 설정에서 workspace 폴더를 watch/resolver에 추가

#### (참고) `apps/mobile/metro.config.js` 예시

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

## 11) 도입 순서(Implementation Order)

1. 루트: `pnpm-workspace.yaml`, `turbo.json`, `.npmrc`, 루트 `package.json`, prettier/eslint 기본 규약 확정
2. `tooling/tsconfig`, `tooling/eslint-config` 생성
3. `packages/shared` 생성 + `pnpm --filter @crs/shared build` 성공
4. `packages/ui` 생성 + `apps/web` 에서 import 성공
5. `apps/web` TanStack Start 스캐폴딩 + workspace deps 연결
6. `apps/mobile` Expo 스캐폴딩 + `@crs/shared` import 성공 (필요 시 metro 설정)
7. 루트에서 `pnpm build` / `pnpm typecheck` / `pnpm lint` 가 전체 성공하는지 확인

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
pnpm --filter @crs/ui build
```
