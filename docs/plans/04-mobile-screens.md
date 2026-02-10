# 04. 모바일 앱 화면 설계

Expo React Native 기반의 모바일 앱 화면 구성 및 네비게이션 흐름 설계

## 📱 개요

- **Platform**: iOS, Android (Expo React Native)
- **Routing**: Expo Router (File-based routing)
- **Styling**: NativeWind (Tailwind CSS)
- **UI Components**: `packages/ui` (Shared Component)
- **State Management**: TanStack Query (Server) + Zustand (Client)
- **Form Handling**: React Hook Form + Zod

## 🎯 설계 원칙

1. **역할 기반 네비게이션**: 요청자(Customer)와 제공자(Cleaner)는 서로 다른 탭 구조
2. **선언적 UI**: 상태에 따른 UI 렌더링 (로딩/에러/성공)
3. **오프라인 우선**: 네트워크 실패 시 캐시된 데이터 표시
4. **접근성**: 스크린 리더 지원, 최소 터치 영역 44pt

---

## 🧭 네비게이션 구조 (Navigation)

### 루트 구조 (Root Layout)
```
app/
├── _layout.tsx           # 전역 Provider (Auth, Query, Theme)
├── index.tsx             # 스플래시/진입점 (Redirect logic)
├── (auth)/               # 인증 그룹 (Stack)
│   ├── login.tsx         # 로그인
│   ├── signup.tsx        # 회원가입
│   └── _layout.tsx       # Headerless Stack
├── (customer)/           # 요청자 그룹 (Tabs)
│   ├── (tabs)/
│   │   ├── index.tsx     # 홈 (내 예약)
│   │   ├── explore.tsx   # 청소 요청하기 (메인 액션)
│   │   ├── chat.tsx      # 채팅 목록
│   │   └── profile.tsx   # 내 정보
│   └── _layout.tsx
├── (cleaner)/            # 제공자 그룹 (Tabs)
│   ├── (tabs)/
│   │   ├── index.tsx     # 홈 (요청 대기 목록)
│   │   ├── schedule.tsx  # 내 일정 (예약 확정)
│   │   ├── chat.tsx      # 채팅 목록
│   │   └── profile.tsx   # 내 정보
│   └── _layout.tsx
├── booking/              # 예약 상세/공통 (Stack - Modal/Push)
│   ├── [id].tsx          # 예약 상세 (공통)
│   ├── new.tsx           # 새 예약 작성 (Customer)
│   └── review.tsx        # 리뷰 작성 (공통)
└── chat/                 # 채팅방 (Stack)
    └── [id].tsx          # 채팅방 상세
```

---

## 🎨 화면 상세 설계

### 1. 인증 (Auth)

**`login.tsx` (로그인)**
- **UI 요소**:
  - 로고 및 서비스 슬로건
  - "카카오로 계속하기" 버튼 (노란색)
  - "네이버로 계속하기" 버튼 (초록색)
  - "이메일로 로그인" (보조 텍스트 버튼)
- **기능**:
  - OAuth 인증 후 토큰 저장
  - 역할(Role) 확인 후 `(customer)` 또는 `(cleaner)`로 리다이렉트
  - 역할 미설정 시 회원가입 화면으로 이동

**`signup.tsx` (회원가입/역할선택)**
- **UI 요소**:
  - 역할 선택 카드 (요청자 vs 제공자)
  - 기본 정보 입력 폼 (이름, 전화번호)
  - (제공자 선택 시) 활동 지역 선택, 간단 소개
- **기능**:
  - 회원 정보 업데이트 및 역할 부여
  - 가입 완료 후 메인 홈으로 이동

---

### 2. 요청자 (Customer)

**`(tabs)/index.tsx` (홈 - 내 예약)**
- **UI 요소**:
  - **상단**: "안녕하세요, [이름]님!" 인사말 + 알림 아이콘
  - **진행 중인 예약 카드**: 가장 가까운 확정된 예약 1개 (강조)
    - 상태 뱃지 (확정/진행중), 날짜, 시간, 제공자 정보
  - **예약 내역 리스트**: 과거/취소된 예약 목록 (무한 스크롤)
    - [예약 날짜] | [상태] | [주소 요약]
- **Empty State**: "아직 예약이 없어요. 청소를 요청해보세요!" + CTA 버튼

**`(tabs)/explore.tsx` (청소 요청하기)**
- **UI 요소**:
  - **서비스 선택**: 원룸 / 투룸 / 오피스텔 (아이콘 그리드)
  - **최근 주소**: 이전에 입력한 주소 칩(Chip)
  - **인기 옵션**: "이사 청소", "부분 청소" 등 퀵 메뉴
- **플로우**: 서비스 선택 → `booking/new.tsx`로 이동

**`(tabs)/profile.tsx` (내 정보)**
- **UI 요소**:
  - 프로필 이미지, 이름, 등급(매너온도)
  - 메뉴: "주소 관리", "결제 수단", "공지사항", "고객센터", "로그아웃"

---

### 3. 제공자 (Cleaner)

**`(tabs)/index.tsx` (홈 - 일감 찾기)**
- **UI 요소**:
  - **상단**: 필터 (날짜, 지역, 청소유형)
  - **요청 리스트**: 수락 가능한 주변 요청 목록
    - 카드: [지역] [평수] [청소유형] [예상수입]
    - "제안하기" 또는 "수락하기" 버튼
- **Empty State**: "현재 조건에 맞는 요청이 없습니다. 필터를 변경해보세요."

**`(tabs)/schedule.tsx` (내 일정)**
- **UI 요소**:
  - **달력 뷰**: 예약된 날짜 표시 (점)
  - **일별 리스트**: 선택된 날짜의 예약 목록
    - 시간순 정렬
    - 카드: [시간] [고객명] [주소] [상태버튼(시작/완료)]

**`(tabs)/profile.tsx` (제공자 프로필)**
- **UI 요소**:
  - 프로필 관리 (소개글, 활동 지역 수정)
  - **수입 관리**: 이번 달 예상 수입, 정산 내역
  - **리뷰 관리**: 받은 리뷰 목록 및 평점

---

### 4. 공통 기능 (Common)

**`booking/new.tsx` (예약 요청 폼 - Wizard)**
- **Step 1: 기본 정보**
  - 주소 입력 (Daum 주소 API 모달 연동)
  - 건물 형태, 평수, 방 개수 선택
- **Step 2: 일정도**
  - 날짜 선택 (Calendar)
  - 시간 선택 (Time Picker)
- **Step 3: 옵션**
  - 추가 요청사항 (텍스트 에리어)
  - 체크박스: "창틀 청소", "냉장고 내부" 등
- **Step 4: 확인**
  - 요약 정보 및 예상 견적 확인
  - "요청 등록하기" 버튼

**`booking/[id].tsx` (예약 상세)**
- **헤더**: 상태 뱃지 (대기중/확정/진행중/완료)
- **정보 섹션**: 일시, 장소, 서비스 항목
- **지도 섹션**: 청소 위치 지도 표시
- **액션 버튼 (Sticky Bottom)**:
  - (요청자) 수정, 취소, 문의하기
  - (제공자) 수락/거절, 시작하기, 청소완료, 문의하기

**`chat/index.tsx` (채팅 목록)**
- **리스트 아이템**:
  - 상대방 프로필, 이름
  - 마지막 메시지 내용, 시간
  - 안 읽은 메시지 뱃지
- **기능**: 예약 상태와 연동 (예약 취소 시 채팅방 비활성화 표시)

**`chat/[id].tsx` (채팅방)**
- **상단**: 예약 요약 바 (날짜/시간 간단 표시) -> 탭하면 예약 상세로 이동
- **메시지 영역**: 말풍선 UI (내꺼 오른쪽, 상대 왼쪽)
- **입력 영역**: 텍스트 인풋, "+" 버튼(사진 전송, 상용구)
- **시스템 메시지**: "예약이 확정되었습니다.", "청소가 시작되었습니다." 등 자동 발송

---

## 🧩 주요 컴포넌트 (Shared UI)

`packages/ui/src/mobile/` 에 위치할 핵심 컴포넌트

### 기본 컴포넌트 (Atoms)

```
packages/ui/src/mobile/atoms/
├── Button.tsx              # 버튼 (Primary, Secondary, Outline, Ghost, Danger)
├── Input.tsx               # 텍스트 입력
├── TextArea.tsx            # 멀티라인 입력
├── Badge.tsx               # 상태 배지
├── Avatar.tsx              # 프로필 이미지
├── Icon.tsx                # 아이콘 래퍼
├── Skeleton.tsx            # 로딩 스켈레톤
├── Spinner.tsx             # 로딩 인디케이터
└── Typography.tsx          # 텍스트 스타일 (H1, H2, Body, Caption)
```

### 복합 컴포넌트 (Molecules)

```
packages/ui/src/mobile/molecules/
├── Card.tsx                # 카드 컨테이너
├── ListItem.tsx            # 리스트 아이템
├── SearchBar.tsx           # 검색 바
├── FilterChip.tsx          # 필터 칩
├── DatePicker.tsx          # 날짜 선택
├── TimePicker.tsx          # 시간 선택
├── BottomSheet.tsx         # 바텀 시트
├── Modal.tsx               # 모달
├── EmptyState.tsx          # 빈 상태
├── ErrorBoundary.tsx       # 에러 바운더리
└── Toast.tsx               # 토스트 알림
```

### 화면 컴포넌트 (Organisms)

```
packages/ui/src/mobile/organisms/
├── BookingCard.tsx         # 예약 카드
├── UserCard.tsx            # 사용자 카드
├── MessageBubble.tsx       # 메시지 버블
├── ReviewCard.tsx          # 리뷰 카드
├── CalendarStrip.tsx       # 캘린더 스트립
├── MapPreview.tsx          # 지도 미리보기
└── BottomActionBar.tsx     # 하단 액션 바
```

### 레이아웃 컴포넌트

```
packages/ui/src/mobile/layouts/
├── ScreenLayout.tsx        # SafeAreaView + 공통 패딩
├── TabBarLayout.tsx        # 탭 바 포함 레이아웃
├── ScrollLayout.tsx        # 스크롤 뷰 래퍼
└── FormLayout.tsx          # 폼 그룹 래퍼
```

---

## 🔄 데이터 흐름 & 상태 관리

### Server State (TanStack Query)

**쿼리 키 구조:**
```typescript
// apps/mobile/src/lib/query-keys.ts
export const queryKeys = {
  // 사용자
  me: ['user', 'me'] as const,
  user: (id: string) => ['user', id] as const,
  
  // 예약
  bookings: (filters: BookingFilters) => ['bookings', filters] as const,
  booking: (id: string) => ['booking', id] as const,
  availableBookings: (filters: AvailableFilters) => ['bookings', 'available', filters] as const,
  
  // 메시지
  messages: (bookingId: string) => ['messages', bookingId] as const,
  
  // 리뷰
  reviews: (userId: string) => ['reviews', userId] as const,
  
  // 지역
  areas: ['areas'] as const,
} as const;
```

**쿼리 훅 예시:**
```typescript
// apps/mobile/src/hooks/use-bookings.ts
export function useBookings(filters: BookingFilters) {
  return useQuery({
    queryKey: queryKeys.bookings(filters),
    queryFn: () => api.getBookings(filters),
    staleTime: 1000 * 60, // 1분
  });
}

export function useAcceptBooking() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (bookingId: string) => api.acceptBooking(bookingId),
    onSuccess: () => {
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
```

### Client State (Zustand)

**전역 스토어:**
```typescript
// apps/mobile/src/stores/app-store.ts
interface AppState {
  // 인증
  isAuthenticated: boolean;
  user: User | null;
  role: 'customer' | 'cleaner' | null;
  
  // 알림
  unreadNotifications: number;
  
  // 액션
  setUser: (user: User | null) => void;
  setRole: (role: 'customer' | 'cleaner') => void;
  incrementUnread: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  user: null,
  role: null,
  unreadNotifications: 0,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setRole: (role) => set({ role }),
  incrementUnread: () => set((s) => ({ unreadNotifications: s.unreadNotifications + 1 })),
}));
```

**폼 상태 (React Hook Form + Zod):**
```typescript
// apps/mobile/src/lib/validators/booking.ts
export const bookingSchema = z.object({
  subAreaId: z.string().min(1, '지역을 선택해주세요'),
  scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  scheduledTime: z.string().regex(/^\d{2}:\d{2}$/),
  duration: z.number().min(1).max(8),
  address: z.string().min(5, '주소를 입력해주세요'),
  roomType: z.enum(['oneRoom', 'twoRoom', 'threeRoom', 'studio', 'office']),
  services: z.array(z.string()).min(1, '서비스를 선택해주세요'),
});

// apps/mobile/src/screens/booking/new.tsx
export default function NewBookingScreen() {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: { ... },
  });
  
  const { mutate, isPending } = useCreateBooking();
  
  const onSubmit = handleSubmit((data) => {
    mutate(data, {
      onSuccess: (booking) => {
        router.push(`/booking/${booking.id}`);
      },
    });
  });
  
  return ( ... );
}
```

### 로딩 & 에러 처리

**선언적 상태 렌더링:**
```typescript
// apps/mobile/src/components/QueryState.tsx
type Props<T> = {
  query: UseQueryResult<T>;
  children: (data: T) => React.ReactNode;
  loadingFallback?: React.ReactNode;
  emptyFallback?: React.ReactNode;
};

export function QueryState<T>({ query, children, loadingFallback, emptyFallback }: Props<T>) {
  if (query.isLoading) {
    return loadingFallback || <Skeleton count={3} />;
  }
  
  if (query.isError) {
    return (
      <ErrorState
        message="데이터를 불러오지 못했습니다"
        onRetry={query.refetch}
      />
    );
  }
  
  if (!query.data || (Array.isArray(query.data) && query.data.length === 0)) {
    return emptyFallback || <EmptyState message="데이터가 없습니다" />;
  }
  
  return <>{children(query.data)}</>;
}

// 사용 예시
<QueryState query={bookingsQuery} emptyFallback={<EmptyBookings />}>
  {(bookings) => <BookingList bookings={bookings} />}
</QueryState>
```

**글로벌 에러 바운더리:**
```typescript
// apps/mobile/app/_layout.tsx
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary FallbackComponent={GlobalErrorFallback}>
        <Stack>
          <Stack.Screen name="index" />
          ...
        </Stack>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
```

---

## ✅ 체크리스트

- [x] Expo Router 기반 파일 구조 생성
- [x] NativeWind 설정 및 테마 컬러 정의
- [x] 공통 UI 컴포넌트 (Button, Input, Card) 구현
- [x] 인증 화면 (Login, Signup) 퍼블리싱
- [x] 탭 네비게이션 (Customer/Cleaner 분기) 구현

---

## ⚡ 성능 최적화 전략

### 1. 렌더링 최적화

```typescript
// FlatList 최적화
<FlatList
  data={bookings}
  keyExtractor={(item) => item.id}
  renderItem={useCallback(({ item }) => <BookingCard booking={item} />, [])}
  getItemLayout={(data, index) => ({
    length: CARD_HEIGHT,
    offset: CARD_HEIGHT * index,
    index,
  })}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={5}
  initialNumToRender={10}
/>
```

### 2. 이미지 최적화

```typescript
// apps/mobile/src/components/OptimizedImage.tsx
import { Image } from 'expo-image';

export function OptimizedImage({ uri, ...props }) {
  return (
    <Image
      source={{ uri, width: props.width, height: props.height }}
      contentFit="cover"
      transition={200}
      placeholder={require('@/assets/images/placeholder.png')}
      recyclingKey={uri}
      {...props}
    />
  );
}
```

### 3. 번들 최적화

```typescript
// apps/mobile/babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-worklets/compiler',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
          },
        },
      ],
    ],
  };
};
```

### 4. 폰트 최적화

```typescript
// apps/mobile/src/lib/load-fonts.ts
import { useFonts } from 'expo-font';

export function useLoadFonts() {
  const [loaded] = useFonts({
    // 시스템 폰트 우선 사용, 필요시 커스텀 폰트 로드
  });
  
  return loaded;
}
```

---

## ♿ 접근성 (Accessibility)

### 1. 스크린 리더 지원

```typescript
// Touchable 요소에 accessibility 레이블 추가
<TouchableOpacity
  accessible
  accessibilityLabel="예약 수락하기"
  accessibilityHint="이 예약을 수락합니다"
  accessibilityRole="button"
>
  <Text>수락</Text>
</TouchableOpacity>
```

### 2. 최소 터치 영역

```typescript
// 44pt 최소 터치 영역 보장
<Button className="min-h-[44px] min-w-[44px]">
  <Text>버튼</Text>
</Button>
```

### 3. 색상 대비

- 텍스트/배경: WCAG AA 기준 (4.5:1)
- 큰 텍스트: 3:1
- 포커스 표시: 명확한 아웃라인

### 4. 모션 감소

```typescript
import { ReduceMotion } from 'react-native-reanimated';

// 사용자 설정에 따른 애니메이션 비활성화
const shouldAnimate = useReducedMotion();

<Animated.View
  entering={shouldAnimate ? FadeIn : undefined}
>
  ...
</Animated.View>
```

---

## 🧪 테스트 전략

### 1. 컴포넌트 테스트 (Jest + React Native Testing Library)

```typescript
// apps/mobile/src/components/__tests__/Button.test.tsx
describe('Button', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText('Click me')).toBeTruthy();
  });
  
  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button onPress={onPress}>Click</Button>);
    fireEvent.press(getByText('Click'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
  
  it('shows loading state', () => {
    const { getByTestId } = render(<Button loading>Submit</Button>);
    expect(getByTestId('spinner')).toBeTruthy();
  });
});
```

### 2. 통합 테스트 (Detox)

```typescript
// apps/mobile/e2e/login.test.ts
describe('Login', () => {
  beforeAll(async () => {
    await device.launchApp();
  });
  
  it('should login with Kakao', async () => {
    await element(by.id('kakao-login-button')).tap();
    await expect(element(by.id('home-screen'))).toBeVisible();
  });
});
```

### 3. E2E 테스트 시나리오

| 시나리오 | 단계 | 예상 결과 |
|---------|------|----------|
| 회원가입 | 앱 시작 → 카카오 로그인 → 역할 선택 | 홈 화면 진입 |
| 예약 생성 | 홈 → 청소 요청 → 폼 작성 → 제출 | 예약 상세 화면 이동 |
| 예약 수락 | (제공자) 홈 → 요청 목록 → 수락 | 예약 확정 상태 |
| 채팅 | 예약 상세 → 채팅 → 메시지 전송 | 메시지 표시 |
| 리뷰 | 예약 완료 → 리뷰 작성 → 제출 | 리뷰 등록 완료 |

---

## 📦 구현 우선순위

### Phase 1: MVP Core (2주)

1. **프로젝트 설정**
   - Expo Router 설정
   - NativeWind 설정
   - TanStack Query 설정
   - 공통 컴포넌트 구현

2. **인증 플로우**
   - 카카오/네이버 OAuth
   - 역할 선택 화면
   - 인증 상태 관리

3. **예약 시스템 (기본)**
   - 요청자: 예약 생성
   - 제공자: 예약 수락/거절
   - 예약 상세 조회

### Phase 2: 핵심 기능 (2주)

4. **메시지 시스템**
   - 채팅 목록
   - 채팅방 (텍스트)
   - 폴링 기반 메시지

5. **리뷰 시스템**
   - 리뷰 작성
   - 리뷰 목록

6. **프로필 관리**
   - 요청자/제공자 프로필
   - 설정 화면

### Phase 3: 개선 (1주)

7. **성능 최적화**
   - 이미지 최적화
   - 리스트 가상화
   - 번들 최적화

8. **접근성**
   - 스크린 리더 지원
   - 색상 대비 개선
   - 모션 감소

9. **테스트**
   - 컴포넌트 테스트
   - E2E 테스트

---

## 📁 최종 파일 구조

```
apps/mobile/
├── app/                           # Expo Router
│   ├── _layout.tsx               # 루트 레이아웃
│   ├── index.tsx                 # 진입점
│   ├── (auth)/                   # 인증 그룹
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── (customer)/               # 요청자 그룹
│   │   ├── _layout.tsx
│   │   └── (tabs)/
│   │       ├── _layout.tsx
│   │       ├── index.tsx         # 홈
│   │       ├── explore.tsx       # 청소 요청
│   │       ├── chat.tsx          # 채팅 목록
│   │       └── profile.tsx       # 내 정보
│   ├── (cleaner)/                # 제공자 그룹
│   │   ├── _layout.tsx
│   │   └── (tabs)/
│   │       ├── _layout.tsx
│   │       ├── index.tsx         # 일감 찾기
│   │       ├── schedule.tsx      # 내 일정
│   │       ├── chat.tsx          # 채팅 목록
│   │       └── profile.tsx       # 내 정보
│   ├── booking/
│   │   ├── [id].tsx              # 예약 상세
│   │   ├── new.tsx               # 새 예약
│   │   └── review.tsx            # 리뷰 작성
│   └── chat/
│       └── [id].tsx              # 채팅방
├── src/
│   ├── components/               # 화면별 컴포넌트
│   ├── hooks/                    # 커스텀 훅
│   ├── lib/                      # 유틸리티
│   │   ├── api.ts               # API 클라이언트
│   │   ├── query-keys.ts        # Query 키
│   │   ├── storage.ts           # 로컬 스토리지
│   │   └── validators/          # Zod 스키마
│   ├── stores/                   # Zustand 스토어
│   └── types/                    # 타입 정의
├── assets/
│   ├── images/
│   └── fonts/
├── app.json
├── babel.config.js
├── metro.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🎨 디자인 토큰

```typescript
// packages/ui/src/tokens/index.ts
export const tokens = {
  colors: {
    brand: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
    },
    semantic: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    neutral: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
  },
} as const;
```

---

## 📝 다음 단계

- [ ] 05. 웹 대시보드 설계
- [ ] 06. UI/UX 테마 & 디자인 시스템
- [ ] 07. 구현 시작
