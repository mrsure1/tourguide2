# Pre-Launch TODOs (Guidematch)

기준 문서: `docs/PRE_LAUNCH_CHECKLIST.md`  
작성일: 2026-03-16

이 문서는 "런칭 전 반드시 처리할 일"을 우선순위/리스크 기준으로 정리한 실행 목록입니다.

---

## P0 (런칭 차단: 보안/결제)

- [ ] **[보안] 관리자 권한 상승(Privilege Escalation) 차단**
  - 현상: 클라이언트 입력(폼/쿼리/쿠키) 기반으로 `profiles.role`이 `admin`까지 설정될 수 있는 경로가 존재
  - 근거 파일:
    - `app/login/actions.ts` (selectedRole에 `admin` 허용, 특정 이메일 하드코딩)
    - `app/auth/callback/route.ts` (roleParam/cookieRole 사용, 특정 이메일 하드코딩)
  - 조치(권장):
    - `admin` 부여 로직을 서버 전용 allowlist로 제한(예: `ADMIN_EMAILS`, 혹은 별도 `admin_users` 테이블)
    - 클라이언트에서 전달되는 role은 `guide|traveler`만 허용
    - OAuth callback에서 role 파라미터/쿠키 입력은 "admin으로 승격"에 사용하지 않도록 차단
  - 완료 기준:
    - 임의 사용자가 `role=admin`을 전달해도 admin 승격 불가
    - admin 페이지 접근은 서버에서 검증된 allowlist/DB 기준으로만 가능

- [ ] **[결제] PayPal 결제 서버 검증 구현**
  - 현상: PayPal capture 라우트가 실제 PayPal API 검증 없이 `paid`로 업데이트 가능
  - 근거 파일: `app/api/payments/paypal/capture/route.ts`
  - 조치(필수):
    - PayPal Orders/Capture API로 서버-서버 검증
    - `bookingId`의 금액/통화/상태, PayPal 결제 상태 일치 여부 검증
    - 중복 처리 방지(이미 처리된 `payment_intent_id` 재처리 차단)
  - 완료 기준:
    - 결제 실패/위조 요청으로 `paid` 상태 변경 불가
    - 정상 결제만 `paid`로 변경

- [ ] **[결제] Toss 시크릿 키 하드코딩 제거 및 운영 키 미설정 시 실패 처리**
  - 현상: `TOSS_SECRET_KEY`가 없으면 코드에 내장된 테스트 키를 사용
  - 근거 파일: `app/api/payments/toss/success/route.ts`
  - 조치:
    - 운영 환경에서 키 미설정 시 즉시 에러 처리(redirect/error)
    - 테스트 키는 코드에 두지 않고 환경변수로만 주입
  - 완료 기준:
    - 저장소에 결제 시크릿/테스트 시크릿 하드코딩 없음
    - 운영 환경에서 키 누락 시 안전하게 실패

---

## P1 (검색/신뢰/UX 핵심)

- [ ] **[SEO] `robots.txt` 및 `sitemap.xml` 추가**
  - 현상: 관련 파일/라우트 부재
  - 조치:
    - `app/robots.ts`, `app/sitemap.ts` 또는 `public/robots.txt`, `public/sitemap.xml` 구현
  - 완료 기준:
    - 검색엔진 크롤링 정책 제어 가능
    - 주요 페이지가 sitemap에 포함

- [ ] **[SEO] Open Graph / Twitter 메타데이터 추가**
  - 현상: 전역 `title/description`만 존재, OG/Twitter 메타 없음
  - 근거 파일: `app/layout.tsx`
  - 조치:
    - `openGraph`, `twitter` 메타 설정
    - 주요 랜딩/상세 페이지별 메타 검토

- [ ] **[UX] 404/500 에러 페이지 추가**
  - 현상: `app/not-found.tsx`, `app/error.tsx` 미존재
  - 조치:
    - 커스텀 404/에러 페이지 구현(사용자 친화 메시지, 재시도/홈 이동)

---

## P2 (운영 가시성/마케팅)

- [ ] **[모니터링] 런타임 에러 모니터링 도입**
  - 현상: Sentry 등 도입 흔적 없음
  - 조치:
    - Sentry(또는 대체) 설정 + 소스맵 업로드/릴리즈 태깅
    - 주요 API route error capture

- [ ] **[분석] GA4/Pixel 삽입**
  - 현상: GA4/Pixel 코드 흔적 없음
  - 조치:
    - Next.js App Router에서 공식 방식으로 스크립트 삽입
    - 결제/예약 전환 이벤트 정의(최소: signup, booking_created, payment_success)

- [ ] **[결제] 중복 처리/상태 전이 강화**
  - 근거 파일: `app/api/payments/toss/success/route.ts`
  - 조치:
    - `bookings.status`가 이미 `paid` 이상이면 재처리 방지
    - `payment_intent_id` 유니크 제약 또는 서버단 idempotency 처리

---

## P3 (정리/품질)

- [ ] **[리포 정리] 백업 파일 제거 또는 제외**
  - 대상: `app/traveler/bookings/checkout/page.tsx.bak`
  - 조치: 삭제 또는 `.gitignore` 정책에 따라 제외

---

## 런칭 전 수동 점검(필수)

- [ ] **실결제/샌드박스 E2E**
  - Toss: 성공/실패/중복 호출/금액 변조 시나리오
  - PayPal: 성공/실패/취소/중복 호출/금액 변조 시나리오

- [ ] **이메일 플로우**
  - 가입 인증 메일, 비밀번호 재설정 메일, 수신/스팸/링크 유효성/redirect URL 확인

- [ ] **Supabase RLS/권한**
  - `profiles`, `bookings`, `reviews` 등 주요 테이블 RLS 정책 검증
  - 익명 사용자/타 사용자 접근 차단 검증

- [ ] **성능/품질**
  - `npm run build` 에러/경고 0
  - Lighthouse(Performance/Accessibility/SEO) 목표치 설정 후 측정

