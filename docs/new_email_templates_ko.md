# Supabase 한글 이메일 템플릿 가이드

Supabase Auth에서 발송되는 기본 이메일들을 한글로 변경하려면 Supabase Dashboard에서 각 템플릿의 **Subject**와 **Body** 내용을 아래 내용으로 교체해 주세요.

---

## 1. 회원가입 확인 (Confirm Signup)
사용자가 회원가입 시 이메일 인증을 위해 발송되는 메일입니다.

**Subject:**
```text
[GuideMatch] 회원가입을 완료해 주세요
```

**Body:**
```html
<h2>GuideMatch 회원가입을 환영합니다!</h2>
<p>안녕하세요,</p>
<p>GuideMatch 서비스 이용을 위해 이메일 주소 인증이 필요합니다.</p>
<p>아래 버튼을 클릭하여 회원가입을 완료해 주세요:</p>
<p>
  <a href="{{ .ConfirmationURL }}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
    이메일 인증하기
  </a>
</p>
<p>버튼이 작동하지 않는 경우 아래 링크를 주소창에 복사해 주세요:</p>
<p>{{ .ConfirmationURL }}</p>
<br>
<p>감사합니다.<br>GuideMatch 팀 드림</p>
```

---

## 2. 비밀번호 재설정 (Reset Password)
사용자가 비밀번호를 잊어버려 재설정을 요청했을 때 발송되는 메일입니다.

**Subject:**
```text
[GuideMatch] 비밀번호 재설정 안내
```

**Body:**
```html
<h2>비밀번호 재설정 요청</h2>
<p>안녕하세요,</p>
<p>계정의 비밀번호를 재설정하시려면 아래 버튼을 클릭해 주세요.</p>
<p>본인이 요청하지 않은 경우 이 이메일을 무시하셔도 됩니다.</p>
<p>
  <a href="{{ .ConfirmationURL }}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
    비밀번호 재설정하기
  </a>
</p>
<p>버튼이 작동하지 않는 경우 아래 링크를 주소창에 복사해 주세요:</p>
<p>{{ .ConfirmationURL }}</p>
<br>
<p>감사합니다.<br>GuideMatch 팀 드림</p>
```

---

## 3. 이메일 주소 변경 (Change Email Address)
사용자가 자신의 이메일 주소를 수정할 때 인증을 위해 발송되는 메일입니다.

**Subject:**
```text
[GuideMatch] 이메일 주소 변경 확인
```

**Body:**
```html
<h2>이메일 주소 변경 확인</h2>
<p>안녕하세요,</p>
<p>이메일 주소 변경을 완료하시려면 아래 버튼을 클릭하여 인증해 주세요:</p>
<p>
  <a href="{{ .ConfirmationURL }}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
    변경 확인하기
  </a>
</p>
<p>감사합니다.<br>GuideMatch 팀 드림</p>
```

---

## 설정 방법
1. [Supabase Dashboard](https://supabase.com/dashboard)에 접속합니다.
2. 프로젝트를 선택한 후 왼쪽 메뉴에서 **Authentication > Email Templates**로 이동합니다.
3. 각 템플릿(Confirm Signup, Reset Password 등)을 클릭하고 위의 내용을 복사하여 붙여넣습니다.
4. **Save** 버튼을 클릭하여 저장합니다.
