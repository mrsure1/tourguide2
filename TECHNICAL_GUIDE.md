# 📘 GuideMatch 기술 문서 (Technical Guide)

본 문서는 GuideMatch 서비스의 기술적 구조, 데이터베이스 설계, 주요 기능 구현 로직 및 유지보수를 위한 가이드라인입니다.

---

## 1. 시스템 아키텍처

- **Framework**: Next.js 16 (App Router)
- **Database/Auth**: Supabase
- **Internationalization**: 커스텀 i18n 시스템 (Middleware 기반 언어 감지)
- **State Management**: Zustand (사용자 상태 및 설정 관리)

---

## 2. 데이터베이스 설계

### 2.1 주요 테이블

1. `profiles`: 사용자 기본 정보 (UUID, full_name, role [guide/traveler], avatar_url)
2. `guides_detail`: 가이드 전문 정보 (location, languages, bio, hourly_rate, is_verified)
3. `tours`: 가이드가 등록한 투어 상품 정보 (title, description, price, duration, photo)
4. `bookings`: 예약 내역 및 상태 (traveler_id, guide_id, tour_id, status, price)
5. `availability`: 가이드의 일자별 예약 가능 여부

### 2.2 관계 설계 (Safety)
- 가이드 예약 시스템의 안정성을 위해 `bookings`는 상세 프로필이 활성화된 `guides_detail`과 연동됩니다.

---

## 3. 주요 기능 구현 로직

### 3.1 다국어 지원 (i18n)
- URL 경로(`/ko`, `/en`)를 통한 언어 구분을 기본으로 하며, `LocaleProvider`를 통해 전역적으로 번역 메시지를 관리합니다.
- `lib/i18n/display.ts` 등을 통해 지역명과 언어 목록을 동적으로 현지화합니다.

### 3.2 예약 프로세스
- 가이드의 `hourly_rate`와 예약 시간을 기반으로 실시간 가격을 계산합니다.
- 프로필 정보(지역, 요금, 소개, 언어)가 모두 갖춰진 가이드만 예약을 받을 수 있도록 서버/클라이언트 양단에서 검증합니다.

---

## 4. 파일 구조 가이드

- `app/guide/`: 가이드 대시보드, 일정 관리, 프로필 관리
- `app/traveler/`: 가이드/투어 탐색, 상세 보기, 예약, 마이페이지
- `components/home/`: 랜딩 페이지의 모듈화된 섹션 (Hero, SearchForm, Cards 등)
- `lib/supabase/`: 서버 및 클라이언트 사이드 Supabase 인스턴스 설정
- `messages/`: 한국어(`ko`) 및 영어(`en`) 번역 라이브러리

---

## 5. 유지보수 주의사항

- **스키마 변경**: DB 테이블 변경 시 `lib/db/` 내의 관련 SQL 스크립트를 업데이트하고 Supabase에 반영해야 합니다.
- **이미지 최적화**: `next/image`를 사용하며, 외부 이미지 소스는 `next.config.ts`에 허용된 도메인만 사용 가능합니다.
- **i18n 추가**: 새로운 텍스트 추가 시 `messages/` 폴더 내의 모든 언어 파일에 키를 추가해야 합니다.

---
*최종 업데이트: 2026-03-21*
