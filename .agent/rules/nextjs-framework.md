---
description: Next.js 프레임워크(App Router) 관련 코딩 규칙 및 모범 사례 가이드
alwaysOn: true
---

# Next.js (App Router) 코딩 규칙 및 가이드라인

이 프로젝트는 **Next.js App Router** 기반으로 구축되며, 클린 아키텍처 원칙과 결합되어 사용됩니다. 아래 규칙들은 Next.js 고유의 기능들을 효율적이고 안정적으로 사용하기 위한 필수 지침입니다.

## 1. 서버 컴포넌트(Server Components) 기본화
- **기본(Default) 사용:** 모든 컴포넌트는 기본적으로 **서버 컴포넌트**로 작성합니다.
- **클라이언트 컴포넌트(`"use client"`) 사용 시점:**
  - 사용자 상호작용(예: `onClick`, `onChange` 이벤트 리스너)이 필요할 때
  - React 상태(`useState`, `useReducer`)나 생명주기(`useEffect`) 훅이 필요할 때
  - 브라우저 전용 API(예: `window`, `document`)에 직접 접근해야 할 때
- **최하단 배치(Push to the leaves):** 클라이언트 컴포넌트는 컴포넌트 트리의 최대한 아래(Leaf)에 배치하여 불필요한 클라이언트 측 자바스크립트 번들 크기를 줄입니다.
- 클라이언트 컴포넌트 내부에서 서버 컴포넌트를 직접 `import`하지 않고, `children`이나 `props`로 전달(Composition)하여 사용합니다.

## 2. 라우팅 및 폴더 구조 (`app/` 디렉터리)
- **로직 분리:** `app/` 라우트 내부(`page.tsx`, `layout.tsx`, `route.ts`)에는 직접적인 비즈니스 로직이나 데이터베이스 접근 로직(Supabase 쿼리 등)을 작성하지 않습니다. 반드시 `src/use-cases/`를 통해 간접적으로 호출합니다.
- **Route Groups (`(folderName)`):** URL 경로에 영향을 주지 않으면서 관련된 라우트들을 논리적으로 그룹화할 때 적극 사용합니다. (예: `(auth)`)
- **Private Folders (`_folderName`):** 라우팅에서 제외되어야 하는 내부 구현용 컴포넌트나 함수들은 언더스코어(`_`) 접두사를 사용하거나 아예 `src/` 디렉터리에 분리합니다.

## 3. 데이터 패칭 (Data Fetching)
- **서버 측 패칭 우선:** 가능하면 서버 컴포넌트 내부에서 데이터를 `await`로 비동기 호출합니다.
- **캐싱 및 재검증 제어:** Next.js의 내장된 `fetch` 확장 기능을 사용하여 캐싱(`force-cache`, `no-store`) 및 재검증(`revalidate`) 주기를 명시적으로 설정하여 데이터 신선도를 관리합니다.

## 4. 내장 최적화 컴포넌트 사용
- **이미지 최적화:** `<img>` 태그 대신 반드시 `next/image`의 `<Image>` 컴포넌트를 사용하여 이미지 최적화(리사이징, WebP 변환, Lazy Loading)를 적용합니다.
- **네비게이션:** `<a>` 태그 대신 `next/link`의 `<Link>` 컴포넌트를 사용하여 클라이언트 측 네비게이션과 프리패칭(Prefetching)의 이점을 얻습니다.

## 5. 서버 액션 (Server Actions) 및 API 라우트
- **데이터 변이(Mutation):** 폼 제출 등 클라이언트에서 서버로 데이터를 전송하고 변경해야 할 경우, 가급적 **서버 액션(`"use server"`)**을 우선적으로 고려합니다.
- **API 라우트(`app/api/.../route.ts`):** 외부 클라이언트(웹훅, 모바일 앱 등)에서 접근해야 하는 엔드포인트에 한하여 API 라우트를 설계합니다.
- 서버 액션과 API 라우트 내부에서도 직접적인 DB 호출 대신 `use-cases` 함수들을 활용하여 비즈니스 로직 흐름을 따릅니다.

## 6. 에러 및 로딩 처리
- **에러 바운더리:** `error.tsx` 파일을 적절한 라우트 레벨에 배치하여 예외 발생 시 애플리케이션 전체가 멈추지 않고 사용자 친화적인 에러 UI를 제공하도록 합니다.
- **서스펜스(Suspense):** 비동기 작업(데이터 로딩 등)이 필요한 영역은 `loading.tsx` 파일 또는 `<Suspense fallback={...}>`로 감싸서 로딩 UI(스켈레톤 등)를 점진적으로 보여줍니다.
