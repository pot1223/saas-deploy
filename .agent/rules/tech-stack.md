---
description: 프로젝트 기술 스택(Next.js + Supabase) 및 마이그레이션 도구 관련 규칙 가이드
alwaysOn: true
---

# 프로젝트 기술 스택(Tech Stack) 규칙 및 가이드라인

이 프로젝트는 **Next.js (App Router)** 와 **Supabase** 를 핵심 기술 스택으로 사용합니다. 이 환경에서 개발할 때 준수해야 할 기술적 규칙과 설정 방식은 다음과 같습니다.

## 1. 프론트엔드 프레임워크: Next.js (App Router)
- **언어:** 엄격한 타입 체크를 위해 **TypeScript**를 기본으로 사용합니다. (`tsconfig.json` 확인)
- **스타일링:** 프로젝트 설정에 따라 Tailwind CSS(권장) 또는 CSS Modules, Styled-components 등을 일관되게 적용합니다.
- **렌더링:** `app/` 라우터를 사용하여 Server Components (RSC) 와 Client Components 의 역할을 명확히 구분합니다. (`nextjs-framework.md` 규칙 참조)
- **의존성:** 과도한 클라이언트 라이브러리 사용을 자제하고 브라우저 네이티브 API 및 서버 컴포넌트 생태계를 주로 활용합니다.

## 2. 백엔드 서비스(BaaS) 및 데이터베이스: Supabase
- **인증(Auth):** 사용자 회원가입, 로그인 등은 Supabase Auth를 사용하며 세션 관리와 토큰 처리는 제공되는 헬퍼 라이브러리(예: `@supabase/ssr` 또는 `@supabase/auth-helpers-nextjs`)를 따릅니다.
- **데이터 저장소(Database):** PostgreSQL 기반의 Supabase Database를 사용하여 관계형 데이터를 모델링합니다.
- **스토리지(Storage):** 이미지나 파일 업로드가 필요한 경우 Supabase Storage 버킷을 활용합니다.

## 3. 데이터베이스 스키마 및 마이그레이션 (`supabase/migrations/`)
- 이 프로젝트는 Supabase CLI를 통해 로컬 파이프라인(Local Development) 방식을 따릅니다.
- **마이그레이션 파일 위치:** 데이터베이스 스키마(테이블 생성, 수정 등)나 Row Level Security (RLS) 정책 등의 변경 사항은 **반드시 `supabase/migrations/` 폴더 내의 `.sql` 파일**에 기록해야 합니다.
- **수동 스키마 변경 금지:** Supabase 대시보드(GUI)에서 직접 테이블이나 정책을 수정하지 않고, 항상 `supabase db diff`나 빈 마이그레이션 파일(`supabase migration new ...`)을 생성하여 SQL 파일로 코드를 남긴 후 적용(`supabase db push` 등)해야 합니다.
- **RLS (Row Level Security):** 모든 테이블에는 기본적으로 RLS가 활성화되어야 하며, 데이터 접근 권한을 제어하는 세밀한 Policy 스크립트를 마이그레이션 파일에 포함해야 합니다.

## 4. 환경 변수 (Environment Variables)
- **로컬 설정:** `.env.local` 또는 `.env` 파일을 사용하여 API 키와 URL을 관리합니다. 이 파일들은 `.gitignore` 에 포함되어 저장소에 업로드되지 않아야 합니다.
- **필수 환경 변수 이름:**
  - `NEXT_PUBLIC_SUPABASE_URL`: 클라이언트 및 서버 모두에서 사용하는 프로젝트 URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: 접속을 위한 익명(Public) 공개 키
  - `SUPABASE_SERVICE_ROLE_KEY`: Admin 권한이 필요한 서버 전용 스크립트나 라우트에서만 사용하는 비밀 키 (클라이언트 노출 절대 금지)

## 5. 데이터 패칭 로직 격리
- Supabase 클라이언트를 초기화(Client/Server/Route Handler용)하는 코드는 `src/infrastructure/db/supabase/` 와 같은 인프라스트럭처 디렉터리 내부에 한 위치에 통일하여 관리합니다.
- (참조: `architecture.md`) 컴포넌트(`app/`)에서 직접 쿼리를 날리지 않고, Use-case와 Repository 계층을 통과하여 호출되도록 일관성을 유지합니다.
