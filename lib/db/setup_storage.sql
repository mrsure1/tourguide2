-- ==========================================
-- Supabase Storage 'avatars' 버킷 설정
-- ==========================================

-- 1. avatars 버킷 생성
-- public: true로 설정하여 누구나 이미지를 조회할 수 있게 합니다.
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. 기존 정책 삭제 (중복 생성 방지)
DROP POLICY IF EXISTS "Avatar upload for authenticated users" ON storage.objects;
DROP POLICY IF EXISTS "Avatar update for owners" ON storage.objects;
DROP POLICY IF EXISTS "Avatar delete for owners" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for avatars" ON storage.objects;

-- 3. 업로드 정책: 테스트를 위해 우선 'avatars' 버킷에 누구나 업로드 가능하도록 설정
-- (보안을 강화하려면 TO authenticated 로 변경하세요)
CREATE POLICY "Avatar upload for all users" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'avatars');

-- 4. 업데이트 정책: 누구나 수정 가능 (또는 auth.uid() = owner 로 제한 가능)
CREATE POLICY "Avatar update for all users" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'avatars');

-- 5. 삭제 정책: 누구나 삭제 가능
CREATE POLICY "Avatar delete for all users" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'avatars');

-- 6. 조회 정책: 모든 사용자가 조회 가능
CREATE POLICY "Public read access for avatars" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'avatars');
