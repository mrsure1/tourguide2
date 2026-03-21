# 🌏 GuideMatch Korea 🇰🇷

> 한국을 방문하는 여행자와 현지 전문 가이드를 연결하는 실시간 예약 플랫폼

## 🚀 프로젝트 개요

GuideMatch는 언어와 관심사가 일치하는 현지 전문가(가이드)를 여행자에게 매칭하고, 차별화된 로컬 투어 경험을 제공하는 실시간 예약 서비스입니다.

### 핵심 기능

1. **가이드 탐색 & 매칭**
   - 지역, 언어, 전문 분야별 가이드 검색
   - 가이드 상세 프로필(자기소개, 리뷰, 평점) 확인

2. **로컬 투어 예약**
   - 가이드가 직접 기획한 테마별 투어 상품 예약
   - 실시간 일정 확인 및 결제 프로세스

3. **양방향 대시보드**
   - **여행자**: 예약 현황 관리, 이용 내역 확인, 리뷰 작성
   - **가이드**: 투어 상품 등록, 예약 승인/관리, 일정(Availability) 설정

## 🛠 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Backend-as-a-Service**: Supabase (Auth, Database, Storage)
- **Styling**: Tailwind CSS + Vanilla CSS
- **State Management**: Zustand
- **Icons**: Lucide React

## 📂 프로젝트 구조

```
guidematch/
├── app/                        # Next.js App Router
│   ├── guide/                  # 가이드 전용 페이지 (대시보드, 투어 관리)
│   ├── traveler/               # 여행자 전용 페이지 (검색, 예약)
│   └── api/                    # 백엔드 API 라우트
├── components/                 # 재사용 가능한 UI 컴포넌트
│   ├── home/                   # 랜딩 페이지 섹션
│   ├── layout/                 # 네비게이션, 푸터 등 레이아웃
│   └── ui/                     # 기본 UI 요소 (버튼, 카드 등)
├── lib/                        # 외부 라이브러리 설정 및 유틸리티
│   ├── supabase/               # Supabase 클라이언트 설정
│   └── i18n/                   # 다국어(ko/en) 처리 로직
└── messages/                   # i18n 번역 사전 (JSON)
```

## 🚀 시작하기

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드 및 배포

```bash
npm run build
npm start
```

## 📘 기술 문서

자세한 시스템 설계 및 구현 방식은 [TECHNICAL_GUIDE.md](./TECHNICAL_GUIDE.md)를 참고하세요.

## 📄 라이선스

MIT License

---
**GuideMatch** - Make your Korea trip unforgettable.
