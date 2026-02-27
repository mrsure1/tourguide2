-- ==========================================
-- GuideMatch (투어가이드플랫폼) Supabase DB 스키마
-- ==========================================

-- 1. profiles 테이블 (회원 기본 정보)
-- 가이드, 일반 회원, 기업 회원 모두 관리
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL CHECK (role IN ('traveler', 'guide', 'agency')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. guides_detail 테이블 (가이드 전용 상세 프로필)
-- 가이드만 가지는 상세 정보 (지역, 언어, 소개 등)
CREATE TABLE IF NOT EXISTS public.guides_detail (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    location TEXT NOT NULL,
    languages TEXT[] DEFAULT '{}',
    bio TEXT,
    hourly_rate DECIMAL(10, 2), -- 시간당/일당 기본 요금
    rating DECIMAL(3, 2) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. availability 테이블 (가이드 스케줄 차단 관리)
-- 가이드가 근무 불가능한 날짜(범위) 지정
CREATE TABLE IF NOT EXISTS public.availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guide_id UUID NOT NULL REFERENCES public.guides_detail(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT valid_date_range CHECK (start_date <= end_date)
);

-- 4. bookings 테이블 (예약 및 결제 정보)
-- 수익 모델: 예약 체결에 따른 결제/수수료 발생의 핵심 테이블
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    traveler_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    guide_id UUID NOT NULL REFERENCES public.guides_detail(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'declined', 'paid', 'completed', 'cancelled')),
    payment_intent_id TEXT, -- PG사(포트원/토스) 고유 결제 ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT valid_booking_dates CHECK (start_date <= end_date)
);

-- 5. messages 테이블 (1:1 실시간 채팅)
-- Supabase Realtime을 이용한 채팅 기록 저장
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. subscriptions 테이블 (가이드 멤버십 구독)
-- 수익 모델: 월정액 프리미엄 멤버십 결제 내역
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guide_id UUID NOT NULL REFERENCES public.guides_detail(id) ON DELETE CASCADE,
    plan_tier TEXT NOT NULL CHECK (plan_tier IN ('free', 'pro', 'premium')),
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. promotions 테이블 (가이드 상단 노출 광고)
-- 수익 모델: 지역별 검색 최상단 노출 광고 입찰 기록
CREATE TABLE IF NOT EXISTS public.promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guide_id UUID NOT NULL REFERENCES public.guides_detail(id) ON DELETE CASCADE,
    target_location TEXT NOT NULL,
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ad_fee DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) 설정 (기본 세팅)
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guides_detail ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- 일단 테스트의 편의성을 위해 모든 테이블에 대해 Public 읽기/적기 허용 정책 추가
-- 향후 Production 배포 전에 반드시 권한을 제어해야 함!

-- Profiles 허용
CREATE POLICY "Allow public all access on profiles" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Allow public all access on guides_detail" ON public.guides_detail FOR ALL USING (true);
CREATE POLICY "Allow public all access on availability" ON public.availability FOR ALL USING (true);
CREATE POLICY "Allow public all access on bookings" ON public.bookings FOR ALL USING (true);
CREATE POLICY "Allow public all access on messages" ON public.messages FOR ALL USING (true);
CREATE POLICY "Allow public all access on subscriptions" ON public.subscriptions FOR ALL USING (true);
CREATE POLICY "Allow public all access on promotions" ON public.promotions FOR ALL USING (true);

-- 트리거(updated_at 자동 갱신) 추가
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;   
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_bookings_modtime BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
