# 🌏 MrSure TourGuide 서비스 기술 문서 (Technical Guide)

본 문서는 MrSure TourGuide 서비스의 기술적 구조, 데이터베이스 설계, 주요 기능 구현 로직 및 유지보수를 위한 가이드라인을 담고 있습니다. 프로젝트의 구조적 무결성을 유지하고 향후 개발 시 참고하기 위해 작성되었습니다.

---

## 1. 프로젝트 개요 및 아키텍처

- **Framework**: Next.js 14 (App Router)
- **Backend-as-a-Service**: Supabase (Auth, Database, Storage)
- **Styling**: Vanilla CSS + Tailwind CSS (Hybrid)
- **Key Concepts**: 
    - **가이드-여행자 이원화 시스템**: 역할(Role) 기반의 사용자 경험 제공
    - **실시간 예약 및 일정 관리**: 가이드의 가용성(Availability)에 따른 예약 제어

---

## 2. 데이터베이스 설계 (ERD & Flow)

### 2.1 주요 테이블 구조

#### 1) `profiles` (공통)
- 각 사용자의 기본 계정 정보 (Auth 연동)
- `id` (UUID), `full_name`, `email`, `role` (guide/traveler), `avatar_url`

#### 2) `guides_detail` (가이드 전용 상세 정보)
- 가이드 활동을 위한 전문 정보
- `id` (FK to profiles.id), `location`, `languages` (Array), `bio`, `hourly_rate`, `rate_type` (daily/hourly), `is_verified` (Boolean)

#### 3) `availability` (일정 관리)
- 가이드의 휴무 및 예약 가능 여부
- `guide_id` (FK to profiles.id), `date`, `is_available`, `reason`

#### 4) `bookings` (예약 데이터)
- 여행자와 가이드 간의 예약 내역
- `id`, `traveler_id` (FK), `guide_id` (FK to **guides_detail.id** - *안전 장치*), `start_date`, `end_date`, `total_price`, `status`

### 2.2 관계 및 제약 조건 (Safety)
- **강력한 외래 키 제약**: `bookings` 테이블의 `guide_id`는 단순히 `profiles`가 아닌 `guides_detail`을 참조합니다. 이는 **상세 프로필이 없는 가이드는 기술적으로 예약을 받을 수 없음**을 보장합니다.

---

## 3. 핵심 기능 구현 로직

### 3.1 예약 안전 장치 (Booking Safety)
- **`isProfileComplete` 로직**: 다음 4가지 항목이 모두 존재해야 예약 버튼이 활성화됩니다.
    1. 활동 지역 (`location`)
    2. 유효한 요금 (`hourly_rate` > 0)
    3. 자기소개 (`bio`)
    4. 지원 언어 (`languages`)
- **UI 제어**: 조건 미달 시 `BookingWidgetClient`에서 "프로필 준비 중"으로 표시 및 상호작용 차단.

### 3.2 유연한 요금 체계 (Flexible Pricing)
- **Rate Type**: `daily`(일당)와 `hourly`(시간당)를 모두 지원합니다.
- **자동 계산**: 가이드가 설정한 `rate_type`에 따라 예약 위젯에서 자동으로 총액을 계산하며, 시간당 요금의 경우 '시간 선택 슬라이더'가 활성화됩니다.

---

## 4. 유지보수 및 오류 수정 내역 (History)

### ✅ 해결된 주요 이슈
1. **DB 스키마 불일치**: `availability` 테이블에 `reason` 컬럼이 누락되어 일정 저장 시 에러 발생 -> 컬럼 추가 완료.
2. **외래 키 순환 참조 및 제약**: 초기에는 프로필 없이도 예약이 들어가 보안 문제가 있었으나, `bookings` FK를 `guides_detail`로 다시 묶어 강제성 부여.
3. **요금 단위 표시 오류**: 리스트에서 설정과 관계없이 '/시간'으로 출력되던 현상을 `rate_type` 기반 동적 출력으로 수정.

### ⚠️ 향후 수정 시 주의사항
- **DB 컬럼 추가 시**: `lib/db` 폴더 내의 관련 SQL 스크립트를 먼저 확인하고, Supabase Dashboard에서 실행 후 `page.tsx` 또는 API 라우트의 Select 쿼리에 해당 필드를 명시적으로 추가해야 합니다.
- **이미지 업로드**: `profiles`와 `guides_detail` 각각에 이미지가 들어갈 수 있으므로, 경로 설정 시 `storage` 버킷 권한(RLS)을 확인하십시오.

---

## 5. 프로젝트 파일 구조 (Key Areas)

- `app/guide/`: 가이드 전용 페이지 (프로필 수정, 일정 관리)
- `app/traveler/`: 여행자 전용 페이지 (검색, 가이드 상세, 예약)
- `app/api/bookings/`: 예약 처리 백엔드 로직
- `lib/db/`: DB 스키마 및 초기화 SQL 스크립트 모음
- `components/ui/`: 공통 UI 컴포넌트

---
*본 문서는 기술적 변경 사항이 있을 때마다 업데이트됩니다.*
