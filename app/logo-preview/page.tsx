import { BrandLogo } from "@/components/brand/BrandLogo";

const variants = [
  {
    key: "signature" as const,
    title: "Signature",
    description: "현재 심볼과 가장 자연스럽게 붙는 메인 워드마크입니다.",
    tone: "dark" as const,
    surface: "bg-[#f7f4ef]",
  },
  {
    key: "capsule" as const,
    title: "Capsule",
    description: "앱 버튼이나 스플래시 화면에 잘 어울리는 라운드형 락업입니다.",
    tone: "light" as const,
    surface: "bg-[linear-gradient(135deg,#172554,#0f172a_55%,#111827)]",
  },
  {
    key: "editorial" as const,
    title: "Editorial",
    description: "프리미엄 여행 큐레이션 느낌이 강한 워드마크입니다.",
    tone: "dark" as const,
    surface: "bg-[#fffdf8]",
  },
  {
    key: "travel" as const,
    title: "Travel",
    description: "지역과 테마 탐색 서비스 성격을 가장 직접적으로 드러냅니다.",
    tone: "dark" as const,
    surface: "bg-[linear-gradient(135deg,#ecfeff,#f8fafc_45%,#fff7ed)]",
  },
  {
    key: "mono" as const,
    title: "Mono",
    description: "문서, 제안서, 파비콘 확장용으로 쓰기 좋은 절제형 시안입니다.",
    tone: "dark" as const,
    surface: "bg-[#f4f4f5]",
  },
];

export default function LogoPreviewPage() {
  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ff385c]">
            GuideMatch Logo System
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-slate-950 sm:text-5xl">
            현재 핀 심볼을 유지한 5개의 로고 시안
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            현재 로고 심볼은 그대로 두고, 워드마크 톤과 정보 밀도만 다르게 조합했습니다.
            메인 사이트에는 `Signature`를 적용했고, 아래에서 다른 대안도 바로 비교할 수
            있습니다.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {variants.map((variant, index) => (
            <section
              key={variant.key}
              className={`overflow-hidden rounded-[32px] border border-black/5 shadow-[0_24px_60px_rgba(15,23,42,0.06)] ${variant.surface}`}
            >
              <div className="flex items-center justify-between border-b border-black/5 px-6 py-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Option {index + 1}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-slate-950">
                    {variant.title}
                  </h2>
                </div>
                {variant.key === "signature" ? (
                  <span className="rounded-full bg-[#ff385c] px-3 py-1 text-xs font-semibold text-white">
                    Selected
                  </span>
                ) : null}
              </div>

              <div className="flex min-h-[220px] items-center px-8 py-10">
                <BrandLogo
                  variant={variant.key}
                  tone={variant.tone}
                  size="lg"
                  showTagline
                />
              </div>

              <div className="border-t border-black/5 px-6 py-5">
                <p className="text-sm leading-6 text-slate-600">{variant.description}</p>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
