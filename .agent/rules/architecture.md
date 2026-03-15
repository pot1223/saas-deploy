---
description: Next.js + Supabase 프로젝트를 위한 클린 아키텍처 가이드라인 (Clean Architecture Guidelines)
alwaysOn: true
---

# Next.js & Supabase 클린 아키텍처 규칙 (Clean Architecture Rules)

이 프로젝트는 UI(Framework)와 비즈니스 로직(Domain/Application), 외부 서비스(Infrastructure)를 명확하게 분리하기 위해 클린 아키텍처(Clean Architecture) 원칙을 따릅니다. 향후 모든 코드 작성 및 리팩토링 시 아래의 구조와 규칙을 엄격하게 준수해야 합니다.

## 📂 코어 폴더 구조

```text
antigravity_shopping/
├── app/                    # [Framework Layer] Next.js App Router (UI & Routing)
│   ├── (auth)/             
│   ├── products/           
│   └── api/                
│
├── src/                    # ✨ [Clean Architecture 핵심 영역]
│   │
│   ├── domain/             # [Domain Layer] 엔터프라이즈 비즈니스 규칙
│   │   ├── entities/       # 순수 TypeScript 타입/인터페이스 (프레임워크 비종속)
│   │   └── repositories/   # 의존성 역전을 위한 Repository 인터페이스
│   │
│   ├── use-cases/          # [Application Layer] 애플리케이션 비즈니스 규칙 (유즈케이스)
│   │   └── ...             # Repository 인터페이스를 활용한 비즈니스 로직 구현체
│   │
│   ├── infrastructure/     # [Infrastructure Layer] 프레임워크 및 외부 연동 (DB, API)
│   │   ├── db/             
│   │   │   ├── supabase/   # Supabase 클라이언트 설정
│   │   │   └── repositories/ # domain의 Repository 인터페이스에 대한 Supabase 구현체
│   │   └── external/       
│   │
│   └── presentation/       # [Presentation Layer] UI 로직 보조
│       ├── components/     
│       └── hooks/          
```

## 📐 핵심 준수 규칙 (Core Rules)

1. **의존성 역전 원칙 (Dependency Inversion)**
   - 안쪽 계층(`domain`, `use-cases`)은 바깥쪽 계층(`infrastructure`, `app`)의 존재를 알아서는 안 됩니다.
   - 안쪽 폴더에서 바깥쪽 폴더로의 `import`는 **절대 금지**됩니다.

2. **Framework Layer (`app/`) 제한 사항**
   - 오직 Next.js의 라우팅과 렌더링에만 집중합니다.
   - 컴포넌트 내부나 API 라우트에서 Supabase 클라이언트를 직접 호출하여 데이터를 가져오지 않습니다. 
   - 모든 데이터 관련 작업은 `src/use-cases/`의 함수를 호출하여 위임합니다.

3. **Domain Layer (`src/domain/`) 순수성 유지**
   - 오직 순수한 TypeScript 코드로만 구성합니다. `next/`나 `@supabase/supabase-js` 등의 라이브러리 `import`는 금지됩니다.
   - 비즈니스 모델(Entity)의 구조와 데이터 접근 규약(Repository Interface)만 정의합니다.

4. **Application Layer (`src/use-cases/`) 역할**
   - 구체적인 데이터베이스 환경(Supabase 등)에 종속되지 않고, 오직 Domain 계층의 인터페이스를 사용해 비즈니스의 흐름을 제어합니다.

5. **Infrastructure Layer (`src/infrastructure/`) 역할**
   - 가장 바깥 계층으로서 실제 Supabase 환경과 통신하는 코드를 위치시킵니다.
   - Domain Layer에서 정의한 Repository 인터페이스를 `implements`하여 구체적인 Data Access 로직을 구현합니다.
