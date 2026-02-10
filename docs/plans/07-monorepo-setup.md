# 07. 모노레포 설계

## 📦 개요

pnpm workspace와 Turborepo를 활용한 모노레포 구조로, 모바일 앱(Expo)과 웹(TanStack Start) 간 코드 공유 및 개발 효율성을 극대화합니다.

### 모노레포 도입 이유

1. **코드 공유**: 타입, 유틸리티, UI 컴포넌트 재사용
2. **일관된 개발 경험**: 통합된 린트, 포맷팅, 테스트 설정
3. **빌드 최적화**: Turborepo의 캐싱과 병렬 빌드
4. **의존성 관리**: pnpm의 효율적인 디스크 사용과 호이스팅 제어

---

## 🏗️ 최종 폴더 구조

```
cleaning-reservation-sys/
├── apps/
│   ├── mobile/                    # Expo React Native
│   │   ├── app/                   # Expo Router
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── assets/
│   │   ├── app.json
│   │   ├── metro.config.js
│   │   ├── tailwind.config.js
│   │   └── package.json
│   │
│   └── web/                       # TanStack Start
│       ├── app/
│       │   ├── routes/
│       │   ├── components/
│       │   └── routeTree.gen.ts
│       ├── server/
│       │   ├── db/
│       │   ├── actions/
│       │   └── functions/
│       ├── public/
│       ├── app.config.ts
│       ├── tailwind.config.js
│       └── package.json
│
├── packages/
│   ├── shared/                    # 공유 코드
│   │   ├── src/
│   │   │   ├── types/
│   │   │   ├── constants/
│   │   │   ├── utils/
│   │   │   └── validators/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── ui/                        # 공유 UI 컴포넌트
│       ├── src/
│       │   ├── components/
│       │   ├── styles/
│       │   └── index.ts
│       ├── package.json
│       ├── tailwind.config.js
│       └── tsconfig.json
│
├── docs/
│   └── plans/
│
├── tooling/
│   ├── eslint/                    # 공유 ESLint 설정
│   │   ├── library.js
│   │   ├── next.js
│   │   └── react.js
│   │
│   └── typescript/                # 공유 TypeScript 설정
│       ├── base.json
│       ├── nextjs.json
│       └── react-library.json
│
├── package.json                   # 루트
├── pnpm-workspace.yaml
├── turbo.json
├── .gitignore
├── .npmrc
└── README.md
```

---

## ⚙️ 루트 설정 파일들

### 1. package.json (루트)

```json
{
  "name": "cleaning-reservation-sys",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "clean": "turbo run clean && rm -rf node_modules",
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,md}\"",
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "turbo run build && changeset publish"
  },
  "devDependencies": {
    "@changesets/cli": "^2.27.1",
    "@types/node": "^20.11.0",
    "eslint": "^8.56.0",
    "prettier": "^3.2.0",
    "turbo": "^2.0.0",
    "typescript": "^5.3.0"
  },
  "packageManager": "pnpm@8.15.0",
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=8.0.0"
  }
}
```

### 2. pnpm-workspace.yaml

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "tooling/*"
```

### 3. turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "globalEnv": ["NODE_ENV", "DATABASE_URL"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

### 4. .npmrc

```
shamefully-hoist=true
strict-peer-dependencies=false
auto-install-peers=true
```

### 5. .gitignore

```
# Dependencies
node_modules
.pnpm-store

# Build
dist
.next
.expo
*.tsbuildinfo

# Environment
.env
.env.local
.env.*.local

# Turbo
.turbo

# OS
.DS_Store

# IDE
.vscode
.idea

# Logs
*.log
npm-debug.log*
```

---

## 📱 apps/mobile 설정

### package.json

```json
{
  "name": "@cleaning-reservation/mobile",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "dev": "expo start",
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "build": "expo export",
    "lint": "expo lint",
    "test": "jest",
    "clean": "rm -rf .expo node_modules"
  },
  "dependencies": {
    "@cleaning-reservation/shared": "workspace:*",
    "@cleaning-reservation/ui": "workspace:*",
    "expo": "~51.0.0",
    "expo-router": "~3.5.0",
    "expo-status-bar": "~1.12.0",
    "nativewind": "^4.0.0",
    "react": "18.2.0",
    "react-native": "0.74.0",
    "react-native-safe-area-context": "4.10.1",
    "react-native-screens": "3.31.1",
    "@tanstack/react-query": "^5.17.0"
  },
  "devDependencies": {
    "@babel/core": "^7.24.0",
    "@types/react": "~18.2.45",
    "eslint": "^8.56.0",
    "eslint-config-expo": "^7.0.0",
    "jest": "^29.7.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.0"
  }
}
```

### app.json

```json
{
  "expo": {
    "name": "창원원룸 청소",
    "slug": "cleaning-reservation",
    "version": "1.0.0",
    "orientation": "portrait",
    "scheme": "cleaning-reservation",
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.cleaningreservation.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.cleaningreservation.app"
    },
    "plugins": [
      "expo-router"
    ]
  }
}
```

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "../../packages/ui/src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // 디자인 시스템에서 정의한 색상
      },
    },
  },
  plugins: [],
};
```

### metro.config.js

```javascript
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
```

---

## 🌐 apps/web 설정

### package.json

```json
{
  "name": "@cleaning-reservation/web",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vinxi dev",
    "build": "vinxi build",
    "start": "vinxi start",
    "lint": "eslint .",
    "test": "vitest",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "clean": "rm -rf .next dist node_modules"
  },
  "dependencies": {
    "@cleaning-reservation/shared": "workspace:*",
    "@cleaning-reservation/ui": "workspace:*",
    "@tanstack/react-query": "^5.17.0",
    "@tanstack/start": "^1.0.0",
    "drizzle-orm": "^0.29.0",
    "better-auth": "^1.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "vinxi": "^0.2.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "drizzle-kit": "^0.20.0",
    "eslint": "^8.56.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
```

### app.config.ts

```typescript
import { defineConfig } from "@tanstack/start/config";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  vite: {
    plugins: [
      viteTsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
    ],
  },
});
```

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "../../packages/ui/src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 디자인 시스템에서 정의한 색상
      },
    },
  },
  plugins: [],
};
```

---

## 📦 packages/shared 설정

### package.json

```json
{
  "name": "@cleaning-reservation/shared",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "build": "tsc",
    "lint": "eslint src/",
    "test": "vitest",
    "clean": "rm -rf dist node_modules"
  },
  "dependencies": {
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "eslint": "^8.56.0",
    "typescript": "^5.3.0",
    "vitest": "^1.0.0"
  },
  "exports": {
    ".": "./src/index.ts",
    "./types": "./src/types/index.ts",
    "./constants": "./src/constants/index.ts",
    "./utils": "./src/utils/index.ts",
    "./validators": "./src/validators/index.ts"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022"],
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### src/index.ts

```typescript
// Types
export * from "./types";

// Constants
export * from "./constants";

// Utils
export * from "./utils";

// Validators
export * from "./validators";
```

---

## 🎨 packages/ui 설정

### package.json

```json
{
  "name": "@cleaning-reservation/ui",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "build": "tsc",
    "lint": "eslint src/",
    "test": "vitest",
    "clean": "rm -rf dist node_modules"
  },
  "dependencies": {
    "@cleaning-reservation/shared": "workspace:*",
    "react": "^18.2.0",
    "react-native": "^0.74.0",
    "nativewind": "^4.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "eslint": "^8.56.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.0",
    "vitest": "^1.0.0"
  },
  "exports": {
    ".": "./src/index.ts",
    "./components": "./src/components/index.ts",
    "./styles": "./src/styles/index.ts"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-native": "^0.74.0",
    "nativewind": "^4.0.0"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM"],
    "jsx": "react-native",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 공유 색상 팔레트
      },
    },
  },
  plugins: [],
};
```

### src/index.ts

```typescript
// Components
export * from "./components";

// Styles
export * from "./styles";
```

---

## 🔗 의존성 관계도

```
┌─────────────────────────────────────────────────────────┐
│                     Apps Layer                           │
├──────────────────────────┬──────────────────────────────┤
│   @cleaning-reservation/ │   @cleaning-reservation/      │
│         mobile           │           web                 │
│                          │                               │
│  Expo React Native       │  TanStack Start               │
│  NativeWind              │  Tailwind CSS                 │
└──────────────────────────┴──────────────────────────────┘
            │                           │
            └───────────┬───────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                   Packages Layer                         │
├──────────────────────────┬──────────────────────────────┤
│  @cleaning-reservation/  │  @cleaning-reservation/       │
│         shared           │           ui                  │
│                          │                               │
│  - Types                 │  - Button                     │
│  - Constants             │  - Input                      │
│  - Utils                 │  - Card                       │
│  - Validators            │  - Avatar                     │
└──────────────────────────┴──────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                 External Dependencies                    │
│                                                          │
│  zod, react, react-native, nativewind, tailwindcss      │
└─────────────────────────────────────────────────────────┘
```

### 의존성 규칙

1. **apps는 packages에 의존 가능**
   - `mobile` → `shared`, `ui`
   - `web` → `shared`, `ui`

2. **packages 간 의존 가능**
   - `ui` → `shared` (O)
   - `shared` → `ui` (X)

3. **순환 의존 금지**
   - 어떤 경우에도 순환 의존 허용 안됨

---

## 🛠️ 개발 워크플로우

### 초기 설정

```bash
# 의존성 설치
pnpm install

# 데이터베이스 설정 (web 앱)
cd apps/web
pnpm db:generate
pnpm db:push
```

### 개발 서버 실행

```bash
# 모든 앱 동시 실행
pnpm dev

# 특정 앱만 실행
pnpm --filter @cleaning-reservation/mobile dev
pnpm --filter @cleaning-reservation/web dev
```

### 빌드

```bash
# 모든 패키지 빌드
pnpm build

# 특정 앱만 빌드
pnpm --filter @cleaning-reservation/mobile build
pnpm --filter @cleaning-reservation/web build

# 의존성 포함 빌드 (Turborepo가 자동 처리)
turbo run build --filter=@cleaning-reservation/web
```

### 린트 & 테스트

```bash
# 전체 린트
pnpm lint

# 전체 테스트
pnpm test

# 특정 패키지만
pnpm --filter @cleaning-reservation/shared test
```

### 패키지 추가

```bash
# apps/mobile에 react-native-svg 추가
pnpm --filter @cleaning-reservation/mobile add react-native-svg

# packages/shared에 lodash 추가
pnpm --filter @cleaning-reservation/shared add lodash

# 루트에 turbo 추가 (devDependencies)
pnpm add -Dw turbo
```

---

## 🚀 CI/CD 파이프라인

### GitHub Actions 워크플로우

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      
      - run: pnpm install --frozen-lockfile
      
      - name: Lint
        run: pnpm lint
      
      - name: Test
        run: pnpm test
      
      - name: Build
        run: pnpm build

  deploy-web:
    needs: lint-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      
      - run: pnpm install --frozen-lockfile
      
      - name: Build Web
        run: pnpm --filter @cleaning-reservation/web build
      
      - name: Deploy to Vercel
        # Vercel 배포 설정
        run: echo "Deploy to Vercel"
```

### 캐싱 전략

Turborepo의 원격 캐싱을 활용:

```bash
# Turborepo 원격 캐싱 활성화
turbo login
turbo link

# CI에서 캐시 활용
turbo run build --remote-cache
```

---

## 📝 코드 공유 예시

### packages/shared/src/types/index.ts

```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  role: "customer" | "cleaner";
  createdAt: Date;
}

export interface Booking {
  id: string;
  customerId: string;
  cleanerId?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  scheduledAt: Date;
  address: string;
  notes?: string;
  createdAt: Date;
}
```

### packages/shared/src/validators/index.ts

```typescript
import { z } from "zod";

export const createBookingSchema = z.object({
  scheduledAt: z.date(),
  address: z.string().min(5, "주소를 입력해주세요"),
  notes: z.string().optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
```

### packages/ui/src/components/Button.tsx

```typescript
import { Pressable, Text } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";

const buttonStyles = cva("rounded-lg px-4 py-2", {
  variants: {
    variant: {
      primary: "bg-blue-500",
      secondary: "bg-gray-500",
      danger: "bg-red-500",
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

interface ButtonProps extends VariantProps<typeof buttonStyles> {
  children: string;
  onPress: () => void;
}

export function Button({ variant, size, children, onPress }: ButtonProps) {
  return (
    <Pressable onPress={onPress} className={buttonStyles({ variant, size })}>
      <Text className="text-white font-semibold">{children}</Text>
    </Pressable>
  );
}
```

### apps/mobile 사용 예시

```typescript
// app/(customer)/new-booking.tsx
import { CreateBookingInput, createBookingSchema } from "@cleaning-reservation/shared";
import { Button } from "@cleaning-reservation/ui";

export default function NewBookingScreen() {
  const handleSubmit = (data: CreateBookingInput) => {
    // 예약 생성 로직
  };

  return (
    <View>
      {/* 폼 필드들 */}
      <Button variant="primary" onPress={handleSubmit}>
        예약 요청
      </Button>
    </View>
  );
}
```

---

## ✅ 체크리스트

### 초기 설정
- [ ] pnpm 설치 및 버전 확인
- [ ] 루트 package.json 생성
- [ ] pnpm-workspace.yaml 설정
- [ ] turbo.json 설정
- [ ] .gitignore 추가

### 패키지 생성
- [ ] apps/mobile 구조 및 설정
- [ ] apps/web 구조 및 설정
- [ ] packages/shared 구조 및 설정
- [ ] packages/ui 구조 및 설정

### 개발 환경
- [ ] ESLint 설정
- [ ] Prettier 설정
- [ ] TypeScript 설정
- [ ] Tailwind CSS 설정

### CI/CD
- [ ] GitHub Actions 워크플로우
- [ ] Turborepo 원격 캐싱

---

## 📚 참고 자료

- [pnpm Workspace 문서](https://pnpm.io/workspaces)
- [Turborepo 문서](https://turbo.build/repo/docs)
- [Expo Router 문서](https://docs.expo.dev/router/introduction/)
- [TanStack Start 문서](https://tanstack.com/start/latest)
- [NativeWind 문서](https://www.nativewind.dev/)
