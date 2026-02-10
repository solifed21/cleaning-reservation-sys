# Plan 07 - Monorepo Setup (pnpm workspace + Turborepo)

- Status: ✅ 완료
- Version: v7
- Last updated: 2026-02-11

> 목표: **pnpm workspace + Turborepo** 기반으로
> `apps/mobile`, `apps/web`, `packages/shared`, `packages/ui`를 한 레포에서
> **일관된 스크립트/빌드/타입체크/린트** 규약으로 관리할 수 있는 모노레포 구조/설정을 설계한다.
>
> 범위: **설계 문서** (스캐폴딩/실제 파일 생성은 별도 태스크)

- Package manager: **pnpm**
- Task runner: **Turborepo**
- Language: **TypeScript**
- Web app: **TanStack Start + React**
- Mobile app: **Expo (React Native, Expo Router)**
- Styling: **Tailwind CSS (web)** + **NativeWind (mobile)**

---

## 0) TL;DR (결론)

- `packages/shared` = **도메인 타입/DTO/Zod/유틸(비-UI)** 공용 레이어 (플랫폼 독립)
- `packages/ui` = **웹 우선** 공용 UI 라이브러리(React + Tailwind)
  - RN까지 단일 `ui`로 억지 통합하면(번들러/스타일/플랫폼 차이) 난이도가 급상승하므로 **웹 우선으로 고정**
  - 모바일 UI 공유가 필요해지면 `packages/ui-native` 또는 `packages/ui-core`(headless)로 **추가 분리**하는 전략 권장
- 모든 워크스페이스는 동일한 task 이름 규약을 갖는다: `dev/build/typecheck/lint/test/clean`
- 루트에서는 항상 `turbo run <task>`로 통제한다.
- 워크스페이스 의존성은 `workspace:*`(workspace protocol)로 연결한다.
- Expo(모바일) + pnpm workspace는 Metro 이슈가 잦으므로:
  - 기본값은 **`@crs/shared`를 dist(빌드 산출물) 기반으로 소비**
  - 필요 시 `apps/mobile/metro.config.js` 보강

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
└── prettier.config.cjs          # (권장)
```

### 왜 `tooling/*`가 필요한가?

패키지 수가 늘수록 `tsconfig.json` / ESLint 규칙을 복붙으로 유지하면 관리가 무너진다.
`tooling/tsconfig`, `tooling/eslint-config`로 preset을 패키지화해 `extends` / `devDependencies`만으로 규칙을 공유한다.

---

## 2) 패키지 역할/의존성 관계

### 2.1 패키지 역할

- `@crs/shared`
  - 도메인 타입, API DTO, Zod schema, 공용 유틸(date/money/validation 등)
  - **플랫폼 독립** (node/web/mobile 어디서든 동작)
- `@crs/ui`
  - 웹용 공용 UI 컴포넌트(버튼/입력/모달), Tailwind preset, className 유틸
  - 원칙적으로 `@crs/shared`만 의존
- `@crs/web`
  - TanStack Start 기반 웹 + 서버 API
  - `@crs/shared`/`@crs/ui` 소비
- `@crs/mobile`
  - Expo Router 기반 RN 앱
  - 초기에는 `@crs/shared`만 소비

### 2.2 의존성 그래프(원칙)

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
- `shared`는 최하위 레이어(최소 의존)
- `ui`는 가능한 `shared`에만 의존
- 앱은 `shared`/`ui`를 소비
- 앱(`apps/*`)에서 다른 앱(`apps/*`)을 의존하지 않는다.

---

## 3) 루트(Repo) 설정 파일

### 3.1 `pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "tooling/*"
```

### 3.2 루트 `package.json`

핵심:
- **루트에서는 항상 Turbo**로 실행한다.
- 패키지 단위 실행은 `pnpm --filter <name>`로만 한다.

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

> 참고: `turbo`의 정확한 버전은 도입 시점에 맞춰 확정한다.

### 3.3 `.npmrc` (권장)

```ini
# pnpm workspace 기본
node-linker=isolated
shared-workspace-lockfile=true

# peer dependency 충돌은 초기에 드러내기
strict-peer-dependencies=true
```

- Expo/RN 환경에서 peer dep가 매우 자주 충돌하면 **일시적으로** `strict-peer-dependencies=false`로 완화할 수 있으나,
  안정화 후 다시 true로 복구하는 것을 권장한다.

### 3.4 `turbo.json` (pipeline)

설계 포인트:
- `build`는 항상 의존성부터(`^build`) 빌드
- 모바일이 `shared`의 dist를 소비하는 전략에서는 `typecheck`도 종종 `build` 후 수행이 안전

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

### 3.5 `.gitignore` (핵심)

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

### 4.2 preset 파일 구성(권장)

- `tooling/tsconfig/base.json` : 전 워크스페이스 공통
- `tooling/tsconfig/library.json` : 라이브러리(shared)
- `tooling/tsconfig/react-library.json` : React UI 라이브러리(ui)
- `tooling/tsconfig/app.json` : 앱(web/mobile)

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

`tooling/tsconfig/react-library.json` (예시)

```jsonc
{
  "extends": "./library.json",
  "compilerOptions": {
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx"
  }
}
```

`tooling/tsconfig/app.json` (예시)

```jsonc
{
  "extends": "./base.json",
  "compilerOptions": {
    "noEmit": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx"
  }
}
```

---

## 5) 공통 설정 패키지: `tooling/eslint-config`

> ESLint v9 기준: **flat config** 권장.

### 5.1 `tooling/eslint-config/package.json` (예시)

```jsonc
{
  "name": "@crs/eslint-config",
  "version": "0.0.0",
  "private": true,
  "type": "module",
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
      'no-console': 'off',
    },
  },
]
```

---

## 6) `packages/shared` (타입/DTO/Zod/유틸)

### 6.1 파일/폴더

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

핵심:
- **Expo가 안정적으로 소비**할 수 있도록 `dist` export를 명확히 한다.

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
    ignores: ['dist/**'],
  },
]
```

---

## 7) `packages/ui` (공용 UI - Web 우선)

### 7.1 파일/폴더

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

원칙:
- `react`/`react-dom`은 앱이 제공하므로 `peerDependencies`
- `ui`는 `shared`만 의존

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
    "@crs/shared": "workspace:*",
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

> 옵션: UI 패키지는 `tsc`만으로도 가능하지만, CSS/번들링이 필요해지면 `tsup`/`rollup` 도입을 고려한다.

### 7.3 `packages/ui/tsconfig.json`

```jsonc
{
  "extends": "@crs/tsconfig/react-library.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

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

> TanStack Start의 실제 커맨드/패키지명은 스캐폴딩 결과에 맞춰 조정한다.

### 8.3 `apps/web` 설정 파일(권장)

- `apps/web/tsconfig.json` → `@crs/tsconfig/app.json` 상속
- `apps/web/eslint.config.js` → `@crs/eslint-config` import
- `apps/web/tailwind.config.ts`
  - content scan 경로에 `../../packages/ui/src/**/*.{ts,tsx}` 포함
  - 가능하면 `@crs/ui`에서 Tailwind preset을 export하고 web에서 consume

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

### 9.3 Expo + pnpm workspace 이슈 및 대응

문제 패턴:
- Metro가 workspace symlink 모듈을 해석하지 못함
- watchFolders 미설정으로 HMR이 꼬임
- hoist/isolated linker 환경에서 resolver가 상위 `node_modules`를 못 찾음

기본 전략(우선순위):
1) `@crs/shared`는 **dist 기반 소비** 유지 (이 플랜 기본값)
2) 필요 시 Metro 설정에서 workspace 폴더를 watch/resolver에 추가

#### (참고) `apps/mobile/metro.config.js` 예시

```js
const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

config.watchFolders = [workspaceRoot]
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]

module.exports = config
```

---

## 10) 표준 스크립트 규약(전 워크스페이스 공통)

모든 워크스페이스에서 아래 task 이름을 **동일하게** 사용한다.

- `dev`: 개발 서버 or watch
- `build`: 프로덕션 빌드
- `typecheck`: 타입 검사만
- `lint`: 린트
- `test`: 테스트(도입 전에는 placeholder 가능)
- `clean`: 산출물 삭제

루트에서 항상 아래가 성립해야 한다.

```bash
pnpm dev
pnpm build
pnpm typecheck
pnpm lint
```

---

## 11) 도입 순서(Implementation Order)

1. 루트: `pnpm-workspace.yaml`, `turbo.json`, `.npmrc`, 루트 `package.json`, prettier/eslint 규약 확정
2. `tooling/tsconfig`, `tooling/eslint-config` 생성
3. `packages/shared` 생성 + `pnpm --filter @crs/shared build` 성공
4. `packages/ui` 생성 + `apps/web`에서 import 성공
5. `apps/web` TanStack Start 스캐폴딩 + workspace deps 연결
6. `apps/mobile` Expo 스캐폴딩 + `@crs/shared` import 성공 (필요 시 metro 설정)
7. 루트에서 `pnpm build` / `pnpm typecheck` / `pnpm lint` 전체 성공 확인

---

## Appendix A) 명령어 치트시트

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
