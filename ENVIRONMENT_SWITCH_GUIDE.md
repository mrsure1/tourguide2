# 구이드매치(GuideMatch) 환경 전환 가이드 🔄 (로컬 ↔ Vercel)

로컬 테스트(`localhost:3000`)와 Vercel 배포 환경(`https://tourguide2-five.vercel.app`)을 오가며 테스트해야 할 때, 코드 자체를 수정할 필요는 없지만 **외부 연동 서비스(Supabase, OAuth 등)의 설정**은 반드시 변경해주어야 정상 작동합니다. 아래의 체크리스트를 확인하세요.

---

## 1. Supabase 로그인 및 인증 (Authentication) 설정 변경

로그인 후 올바른 주소로 돌아오게 하려면(리디렉션) Supabase 대시보드 설정을 바꿔야 합니다.

**경로:** `Supabase 대시보드 -> 해당 프로젝트 -> Authentication -> URL Configuration`

| 구분 | Site URL | Redirect URLs |
| :--- | :--- | :--- |
| **로컬 테스트 시** | `http://localhost:3000` | `http://localhost:3000/**` |
| **Vercel 테스트 시** | `https://tourguide2-five.vercel.app` | `https://tourguide2-five.vercel.app/**` |

*   **Tip:** `Redirect URLs`에는 로컬과 Vercel 주소를 **모두 추가**해 두고, `Site URL`만 기본 베이스 URL로 그때그때 변경해서 사용하는 방법도 있습니다.

---

## 2. 소셜 로그인 (OAuth) 설정 변경 (선택사항)

구글(Google), 카카오(Kakao) 등 소셜 로그인을 연동하여 사용 중이라면, 각 서비스의 개발자 콘솔에 접속하여 **"승인된 리디렉션 URI (Authorized redirect URIs)"**를 변경/추가 해야 합니다.

| 소셜 서비스 | 로컬 테스트용 URI | Vercel 배포용 URI | 설정 링크 |
| :--- | :--- | :--- | :--- |
| **Google** | `http://localhost:3000/auth/v1/callback` | `https://tourguide2-five.vercel.app/auth/v1/callback` | [Google Cloud Console (Credentials)](https://console.cloud.google.com/apis/credentials) |
| **Kakao 등** | `http://localhost:3000/auth/v1/callback` | `https://tourguide2-five.vercel.app/auth/v1/callback` | 카카오 디벨로퍼스 등 |

*   **Tip:** 보통 소셜 프로바이더 설정에는 리디렉션 URI를 여러 개 등록할 수 있으므로, **로컬용과 Vercel용 두 개를 모두 등록**해두면 설정 창을 계속 오가지 않아도 됩니다.

---

## 3. Vercel 환경 변수 (Environment Variables) 확인

Vercel은 로컬의 `.env.local` 파일을 읽지 못합니다. 따라서 로컬에서 추가하거나 바꾼 환경 변수가 있다면 Vercel 대시보드에도 동기화해주어야 합니다.

**경로:** `Vercel 대시보드 -> 프로젝트 선택 -> Settings -> Environment Variables`

*   `NEXT_PUBLIC_SUPABASE_URL` 등 `.env.local`의 값과 동일하게 세팅.
*   **권장 사항:** Vercel 환경 변수 패널에 `NEXT_PUBLIC_SITE_URL` 변수를 추가하고, 값으로 `https://tourguide2-five.vercel.app` 을 지정해 두면 사이트 주소를 참조하는 일부 로깅/리다이렉트 기능에서 더 안전하게 동작할 수 있습니다.

---

## 4. 토스 페이먼츠 / 페이팔 (결제 설정 관련)

다행히 결제 완료 후 돌아오는 페이지 URL 처리 로직 부분(`successUrl`, `failUrl`)은 현재 접속한 브라우저의 도메인을 알아서 읽어오게 수정되어 있습니다. **따라서 코드 수정 없이 동작합니다.**

다만 유의하실 점은 다음과 같습니다.
*   **테스트 환경 유지:** Vercel에서도 테스트 결제만 수행할 목적이면 환경 변수(`NEXT_PUBLIC_TOSS_CLIENT_KEY`, `NEXT_PUBLIC_PAYPAL_CLIENT_ID` 등)를 로컬과 동일하게 "테스트용 키"로 유지하세요.
*   **실제 상용(라이브) 오픈 시:** 개발자 센터에서 **실결제용 Live 키**들을 발급받아, **로컬 코드는 건드리지 말고 오직 Vercel 대시보드의 환경 변수 탭에서만** Live 키로 값을 덮어쓰기 해주시면 됩니다.
