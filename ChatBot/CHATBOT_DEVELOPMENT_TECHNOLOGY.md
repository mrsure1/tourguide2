# 🤖 GuideMatch ChatBot — 기술 스택 및 아키텍처 가이드

GuideMatch 서비스의 고객지원 챗봇 시스템 기술 스택 정리입니다.  
기존 Python/Streamlit + TF-IDF 기반 FAQ 매칭 구조에서 **Next.js + TypeScript + Orchestrator-Worker RAG 아키텍처**로 전면 전환되었습니다.

---

## 1. 핵심 기술 스택 (Core Tech Stack)

| 구분 | 기술 | 비고 |
|------|------|------|
| **Language** | TypeScript 5.x | 전체 챗봇 로직을 타입 안전하게 구현 |
| **Framework** | Next.js 16.1.6 (App Router) | API Routes 기반 서버리스 백엔드 |
| **Runtime** | Node.js (Vercel Serverless) | `export const runtime = "nodejs"` |
| **LLM** | Google Gemini 2.0 Flash | `@google/genai` SDK (v1.46+) |
| **Database** | Supabase (PostgreSQL) | 대화 이력 영속화, 인증 연동 |
| **Rate Limiting** | Upstash Redis + In-Memory 폴백 | `@upstash/ratelimit` 기반 슬라이딩 윈도우 |
| **Email Alert** | Resend | 레이트리밋 임계 근접 시 운영자 알림 |
| **State Management** | Zustand | 프론트엔드 챗 UI 상태 관리 |
| **Styling** | Tailwind CSS 4.x | 챗봇 위젯 UI 스타일링 |
| **Deployment** | Vercel | 서버리스 자동 배포, Edge 네트워크 |

---

## 2. 아키텍처 개요 — Orchestrator-Worker 패턴

단일 FAQ 매칭이 아닌, **5대 전문 워커가 순차적으로 협업**하는 파이프라인 구조입니다.

```
[사용자 질문]
      ↓
[API Route]  POST /api/chatbot/chat
      ↓
[Orchestrator]  – 전체 흐름 제어 + Fallback 관리
      ↓
┌─────────────────────────────────────────┐
│  Worker 1: Query Understanding          │
│  - 스몰톡 판별 (인사/감사 분류)           │
│  - 키워드 기반 의도 분류                   │
│    (refund, payment, booking, account…) │
│  - 검색어 최적화                          │
├─────────────────────────────────────────┤
│  Worker 2: Retrieval (하이브리드 검색)    │
│  - FAQ 코퍼스 (ko/en 이중 번들)           │
│  - 사이트 코퍼스 (site-corpus.json)       │
│  - 키워드 + 2-gram 자카드 스코어링         │
│  - 자동 언어 감지 + 교차 로케일 검색       │
├─────────────────────────────────────────┤
│  Worker 3: Rerank (재정렬)               │
│  - 의도 기반 도메인 부스팅                 │
│  - FAQ: intentRe 매칭 시 ×1.3 부스트     │
│  - 사이트: intentRe 매칭 시 ×1.2 부스트   │
│  - 상위 5건 필터링                        │
├─────────────────────────────────────────┤
│  Worker 4: Answer (답변 생성)             │
│  - Gemini API 호출 (temperature: 0.38)  │
│  - System Prompt 기반 근거 답변 생성      │
│  - JSON/코드펜스 출력 자동 정리(sanitize) │
│  - RAG 누출 자동 제거(stripLeakage)       │
│  - LLM 실패 시 규칙 기반 폴백             │
├─────────────────────────────────────────┤
│  Worker 5: Eval & Logging (평가/로깅)    │
│  - 규칙 기반 5점 만점 평가                 │
│  - 구조화된 JSON 서버 로그 출력             │
│  - Vercel 로그 시스템 연동                 │
└─────────────────────────────────────────┘
      ↓
[최종 응답]  answer + intent + sources + evalScore
```

---

## 3. 프로젝트 파일 구조

### 3-1. 핵심 모듈 (`lib/chatbot/`)

| 파일 | 역할 |
|------|------|
| `orchestrator.ts` | 5대 워커 순차 실행 + 전체 Fallback 관리 |
| `workers.ts` | Query Understanding / Retrieval / Rerank / Answer / Eval 워커 구현 |
| `rag.ts` | 하이브리드 검색 엔진 (FAQ + 사이트 코퍼스), 폴백 답변. 스몰톡 판별 |
| `score.ts` | 텍스트 스코어링 (키워드 매칭 + 한글 2-gram 자카드 + 주제 게이트/부스트) |
| `generate-reply.ts` | 레이트리밋 시 FAQ-only 폴백 경로 + 레거시 Gemini 호출 경로 |
| `faq.ts` | FAQ 데이터 로더 (번들 JSON 우선 → 디스크 CSV 폴백 → ko/en 자동 선택) |
| `corpus.ts` | 사이트 코퍼스 로더 (`site-corpus.json` → 메모리 캐시) |
| `types.ts` | 공유 타입 정의 (`ChatMessage`, `FaqRow`, `SiteChunk`) |
| `persist-chat.ts` | Supabase 대화 이력 영속화 (conversation + messages 테이블) |
| `rate-limit.ts` | Upstash Redis 슬라이딩 윈도우 + 인메모리 폴백 레이트리밋 |
| `rate-limit-alert.ts` | Resend를 통한 레이트리밋 임계 근접 이메일 알림 |
| `open-dock-event.ts` | 챗봇 위젯 열기 이벤트 핸들링 |

### 3-2. API 엔드포인트

| 경로 | 메서드 | 설명 |
|------|--------|------|
| `/api/chatbot/chat` | POST | 메인 챗봇 대화 API (오케스트레이터 호출) |

### 3-3. 데이터 소스

| 파일 | 설명 |
|------|------|
| `faq-bundled-ko.json` | 한국어 FAQ (빌드 시 CSV에서 자동 생성) |
| `faq-bundled-en.json` | 영어 FAQ (빌드 시 CSV에서 자동 생성) |
| `site-corpus.json` | 사이트 전체 콘텐츠 코퍼스 (58KB, 번역/랜딩/고객센터 추출) |
| `ChatBot/faq_data.csv` | FAQ 원본 데이터 (한국어) |
| `ChatBot/faq_data_english.csv` | FAQ 원본 데이터 (영어) |

### 3-4. 빌드 스크립트

| 스크립트 | 실행 | 설명 |
|----------|------|------|
| `scripts/build-chatbot-corpus.mjs` | `npm run prebuild` | CSV → 번들 JSON 변환 (빌드 전 자동 실행) |

---

## 4. 검색 파이프라인 상세

### 4-1. 하이브리드 스코어링 (`score.ts`)

```
사용자 질문
    ↓
[키워드 추출]
  - 공백 분리 토큰 (2자 이상)
  - 한글 2자 이상 연속 추출
  - 영어 3자 이상 단어 추출
  - 한글 음절 2-gram 생성
    ↓
[스코어링 함수]
  ├─ scoreText()           : 키워드 매칭 + 완전 구문 매칭
  ├─ scoreFaqRelevance()   : 질의확장 + 한글 포함 판별 + 2-gram 자카드 + 주제 게이트
  ├─ scoreFaqLexicalOnly() : 게이트 없는 순수 어휘 매칭 (보조 신호)
  └─ expandQueryForRetrieval() : 도메인별 동의어/관련어 확장
    ↓
[복합 점수]  max(gated_score, lexical_score × 0.94)
```

### 4-2. 주제 게이트 및 부스트 메커니즘

| 메커니즘 | 설명 | 배율 |
|----------|------|------|
| `refundAndPaymentTopicGate` | 환불/결제 질문 시 해당 FAQ만 통과 | ×1.65 부스트 / ×0.1 페널티 |
| `guideDiscoveryBoost` | 가이드 매칭·검색 질문 시 관련 FAQ 부스트 | ×1.45 |
| `guideDiscoveryMismatchPenalty` | 검색 의도인데 연락 문제 FAQ가 섞이면 감소 | ×0.2 |
| `intentRe` 기반 Rerank | 의도와 FAQ/사이트 콘텐츠 매칭 시 부스트 | ×1.2~1.3 |

### 4-3. 질의 확장 (`expandQueryForRetrieval`)

사용자 질문에 도메인 관련 키워드를 자동 확장하여 검색 범위를 넓힙니다:

- **가이드 검색**: `가이드매칭 매칭진행 지역날짜인원 입력 조건 추천 선택 순차`
- **환불**: `환불 환급 취소 전액 부분 처리 기간 카드사 은행 승인 예약취소`
- **예약**: `예약 요청 확정 가능여부 일정 조율 마이페이지`
- **결제**: `결제 수단 카드 계좌이체 안내`
- **언어**: `언어 가능언어 맞춤 추천`
- **영어 차용어 정규화**: `search` → `검색`, `서치` → `검색`

---

## 5. LLM 답변 생성 전략

### 5-1. System Prompt 설계 원칙

1. **근거 기반 답변만 허용** — REFERENCE 블록에 없는 정보는 절대 생성하지 않음
2. **정책·환불·정산은 보수적으로** — 추측 금지, 불확실하면 고객센터 안내
3. **자연스러운 문체** — FAQ 원문 복붙 금지, 상담원이 말하듯 완전한 문장으로
4. **출력 형식 엄격 제어** — JSON, YAML, 코드블록, 마크다운 헤딩 금지
5. **자동 언어 전환** — 사용자 질문 언어에 맞춰 응답 언어 자동 전환

### 5-2. 답변 후처리 파이프라인

```
Gemini 원문 출력
    ↓
[sanitize]        JSON/코드펜스/키-값 형태 자동 변환 → 순수 텍스트
    ↓
[stripLeakage]    RAG 컨텍스트 누출 제거 (=== 제목, [FAQ N], Source: 경로 등)
    ↓
최종 답변
```

### 5-3. Fallback 전략 (다층 안전망)

```
[1순위]  Gemini LLM 답변 생성
    ↓ (실패 시)
[2순위]  FAQ 직접 매칭 답변 (점수 임계값 이상)
    ↓ (매칭 실패 시)
[3순위]  일반 안내 + 고객센터 연결 메시지
```

---

## 6. 보안 및 운영 기능

### 6-1. 레이트 리밋 (이중 계층)

| 계층 | 기술 | 동작 |
|------|------|------|
| **1차: Upstash Redis** | `@upstash/ratelimit` 슬라이딩 윈도우 | 프로덕션 환경 (Vercel KV 연동) |
| **2차: In-Memory** | 글로벌 Map 기반 슬라이딩 윈도우 | Redis 미설정 시 자동 폴백 |
| **기본값** | 30회 / 60초 | 환경변수로 조절 가능 (`CHATBOT_RL_LIMIT`, `CHATBOT_RL_WINDOW_SEC`) |

**레이트리밋 초과 시 동작:**
- LLM 호출 없이 FAQ-only 폴백 답변 반환 (비용 절감)
- HTTP 429 + `Retry-After` 헤더 반환
- 대화 이력은 정상 저장

### 6-2. 레이트리밋 알림 시스템

- **Resend API**를 통해 운영자에게 이메일 알림 자동 발송
- **경고 비율** 조절 가능 (`CHATBOT_RL_WARN_RATIO`, 기본 20%)
- **쿨다운** 설정으로 알림 폭주 방지 (`CHATBOT_RL_ALERT_COOLDOWN_MS`, 기본 10분)

### 6-3. 입력 검증 및 제한

| 항목 | 제한값 |
|------|--------|
| 요청 본문 크기 | 96KB |
| 단일 메시지 길이 | 3,000자 |
| 전체 대화 텍스트 합계 | 12,000자 |
| 대화 이력 슬라이싱 | 최근 10턴 |
| DB 저장 시 클리핑 | 12,000자 |

### 6-4. 대화 이력 영속화

- **Supabase PostgreSQL** 기반 `chatbot_conversations` + `chatbot_messages` 테이블
- 로그인 사용자만 대화 이력 저장, 비로그인 사용자는 저장 생략
- `conversationId` 기반 세션 연속성 유지
- `user_id` 소유권 검증을 통한 데이터 격리

---

## 7. 환경변수 목록

| 변수명 | 필수 | 설명 |
|--------|------|------|
| `GEMINI_API_KEY` | ✅ | Google Gemini API 키 |
| `GEMINI_CHAT_MODEL` | ❌ | 사용할 Gemini 모델 (기본: `gemini-2.0-flash`) |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase 익명 키 |
| `UPSTASH_REDIS_REST_URL` | ❌ | Upstash Redis URL (없으면 인메모리 폴백) |
| `UPSTASH_REDIS_REST_TOKEN` | ❌ | Upstash Redis 토큰 |
| `CHATBOT_RL_LIMIT` | ❌ | 레이트리밋 횟수 (기본: 30) |
| `CHATBOT_RL_WINDOW_SEC` | ❌ | 레이트리밋 윈도우 초 (기본: 60) |
| `CHATBOT_RL_WARN_RATIO` | ❌ | 레이트리밋 경고 비율 (기본: 0.2) |
| `CHATBOT_RL_ALERT_COOLDOWN_MS` | ❌ | 알림 쿨다운 밀리초 (기본: 600000) |
| `CHATBOT_RL_ALERT_EMAIL` | ❌ | 알림 수신 이메일 |
| `RESEND_API_KEY` | ❌ | Resend 이메일 API 키 |
| `CHATBOT_ALERT_FROM` | ❌ | 알림 발신 이메일 주소 |

---

## 8. 의존성 패키지

### 8-1. 프로덕션 의존성

| 패키지 | 버전 | 용도 |
|--------|------|------|
| `@google/genai` | ^1.46.0 | Gemini LLM API 호출 |
| `@supabase/ssr` | ^0.8.0 | 서버 사이드 Supabase 클라이언트 |
| `@supabase/supabase-js` | ^2.98.0 | Supabase SDK |
| `@upstash/ratelimit` | ^2.0.8 | 분산 레이트리밋 |
| `@upstash/redis` | ^1.37.0 | Redis 클라이언트 |
| `resend` | ^6.9.4 | 이메일 발송 (알림용) |
| `next` | 16.1.6 | 웹 프레임워크 + 서버리스 런타임 |
| `zustand` | ^5.0.11 | 클라이언트 상태 관리 |

### 8-2. 개발 의존성

| 패키지 | 버전 | 용도 |
|--------|------|------|
| `typescript` | ^5 | 타입 시스템 |
| `tailwindcss` | ^4 | CSS 프레임워크 |
| `eslint` | ^9 | 코드 린팅 |
| `eslint-config-next` | 16.1.6 | Next.js ESLint 규칙 |

---

## 9. 이전 스택과의 비교 (Migration Summary)

| 항목 | 이전 (v1) | 현재 (v2) |
|------|-----------|-----------|
| **언어** | Python 3.x | TypeScript 5.x |
| **프레임워크** | Streamlit | Next.js 16 (App Router) |
| **검색 엔진** | TF-IDF + 코사인 유사도 | 하이브리드 (키워드 + 2-gram 자카드 + 주제 게이트) |
| **답변 생성** | 규칙 기반 FAQ 매칭 | Gemini 2.0 Flash LLM + RAG |
| **아키텍처** | 단일 스크립트 | Orchestrator-Worker (5단계 파이프라인) |
| **데이터 저장** | CSV 파일 + JSONL 로그 | Supabase PostgreSQL + JSON 번들 |
| **배포** | 별도 Streamlit 서버 | Vercel 서버리스 (메인 사이트 통합) |
| **레이트리밋** | 없음 | Upstash Redis + In-Memory 이중 계층 |
| **모니터링** | 없음 | 구조화된 JSON 로그 + 이메일 알림 |
| **다국어** | 한국어 전용 | 한국어/영어 자동 전환 |
| **폴백** | 단순 "못 찾겠습니다" | 3단계 다층 폴백 (LLM → 직접매칭 → 일반안내) |

---

## 10. 향후 개선 로드맵

### Phase 1 — 벡터 검색 도입 (계획)
- Supabase `pgvector` 확장 활성화
- OpenAI/Gemini Embeddings 기반 의미 검색 추가
- 현재 키워드 검색과 벡터 검색의 하이브리드 merge

### Phase 2 — 지식베이스 확장 (계획)
- 정책 원문 MD → chunk 적재 시스템
- 문서 버전 관리
- 동의어 사전 DB화 (`synonym_dictionary`)

### Phase 3 — 운영 고도화 (계획)
- 사용자 피드백 버튼 (도움됨/틀림/애매함)
- 관리자 라벨링 대시보드
- 카테고리별 정확도 리포트
- 자동 재학습 루프

---

*최종 업데이트: 2026-04-07*
