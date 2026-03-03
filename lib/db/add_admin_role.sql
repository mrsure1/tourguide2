-- 1. profiles 테이블의 role 제약조건 확인 및 업데이트
-- 현재 role은 'traveler', 'guide', 'agency' 만 허용됨. 
-- 이를 'admin' 도 허용하도록 변경해야 합니다.

DO $$
BEGIN
    -- 먼저 기존에 체크 제약조건이 있다면 삭제합니다.
    -- (Supabase 생성 방식에 따라 제약 조건 이름이 다를 수 있지만 일반적으로 system name이거나 명시적 이름이 존재합니다.
    -- 만약 아래 제약 조건 이름이 실패하면 수동으로 테이블 속성에서 편집해야 합니다.)
    BEGIN
        ALTER TABLE public.profiles DROP CONSTRAINT profiles_role_check;
    EXCEPTION
        WHEN undefined_object THEN
            -- 무시
    END;
END $$;

-- 'admin' 역할을 포함하는 새로운 제약 조건 추가 (테이블이 이미 존재하므로 덮어쓰거나 수동 설정 필요)
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('traveler', 'guide', 'agency', 'admin'));

-- 2. leeyob@gmail.com 계정을 admin 권한으로 업데이트
-- public.profiles 테이블에는 문자열 email 컬럼이 없고 대신 auth.users 에 있습니다.
-- 따라서 auth.users 와 조인하여 업데이트 합니다.
UPDATE public.profiles
SET role = 'admin'
FROM auth.users
WHERE public.profiles.id = auth.users.id
AND auth.users.email = 'leeyob@gmail.com';
