"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle, FileUp, Loader2, Send } from "lucide-react";
import { InfoHeader } from "@/components/layout/InfoHeader";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/components/providers/LocaleProvider";
import { localizePath } from "@/lib/i18n/routing";

type Locale = "ko" | "en";

const COPY = {
  ko: {
    pageTitle: "1:1 문의하기",
    pageLead:
      "서비스 이용 중 불편한 점이나 궁금한 사항이 있으면 아래 양식을 남겨 주세요. 가능한 한 빠르게 확인해 드립니다.",
    successTitle: "문의가 접수되었습니다.",
    successBody: "입력하신 이메일로 답변을 보내드리겠습니다.",
    successNote: "일반적인 답변 시간: 영업일 기준 1~2일",
    backHome: "홈으로 돌아가기",
    askAgain: "다시 문의하기",
    formTitle: "문의 유형",
    formHelper:
      "예약 관련 문의는 예약 번호를 함께 적어 주시면 더 빠르게 확인할 수 있습니다. 결제나 환불 문의는 제목에 핵심 내용을 먼저 적어 주세요.",
    categories: ["예약/취소", "가이드/투어", "결제/환불", "기타"],
    labels: {
      name: "이름",
      email: "이메일",
      title: "문의 제목",
      message: "문의 내용",
      attachment: "파일 첨부",
      consent: "개인정보 수집 및 이용에 동의합니다.",
    },
    placeholders: {
      name: "성함을 입력해 주세요",
      email: "답변받을 이메일 주소를 입력해 주세요",
      title: "무엇이 궁금하신가요?",
      message:
        "문의하실 내용을 자세히 적어 주세요.\n\n[예약 번호]:\n[가이드 또는 투어명]:\n[상세 내용]:",
    },
    privacyLink: "개인정보 처리방침 보기",
    submit: "문의 접수하기",
    submitting: "전송 중...",
    cancel: "취소",
    fileHint: "클릭해서 파일을 추가해 주세요",
    fileSupport: "JPG, PNG, PDF 지원 / 최대 10MB",
    errors: {
      name: "이름을 입력해 주세요.",
      email: "올바른 이메일 주소를 입력해 주세요.",
      title: "문의 제목을 입력해 주세요.",
      message: "문의 내용은 최소 10자 이상 입력해 주세요.",
      consent: "개인정보 수집 및 이용에 동의해 주세요.",
      submit: "문의 접수에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    },
    uploadTitle: "파일을 첨부하면 더 빠르게 확인할 수 있어요.",
    badges: [
      "예약 문의는 예약 번호를 꼭 남겨 주세요.",
      "결제/환불 문의는 주문 정보와 함께 남겨 주세요.",
    ],
  },
  en: {
    pageTitle: "1:1 Support Inquiry",
    pageLead:
      "If you have a question or ran into an issue while using the service, send us the details below and we will review it as soon as possible.",
    successTitle: "Your inquiry has been received.",
    successBody: "We will reply to the email address you entered.",
    successNote: "Typical response time: 1 to 2 business days",
    backHome: "Back to home",
    askAgain: "Submit another inquiry",
    formTitle: "Inquiry type",
    formHelper:
      "For booking-related requests, include your reservation number so we can help faster. For payment or refund requests, put the main issue in the title first.",
    categories: ["Booking / Cancellation", "Guide / Tour", "Payment / Refund", "Other"],
    labels: {
      name: "Name",
      email: "Email",
      title: "Subject",
      message: "Message",
      attachment: "Attachment",
      consent: "I agree to the collection and use of my personal information.",
    },
    placeholders: {
      name: "Enter your name",
      email: "Enter the email address for the reply",
      title: "What would you like to ask?",
      message:
        "Please describe your inquiry in detail.\n\n[Reservation number]:\n[Guide or tour name]:\n[Details]:",
    },
    privacyLink: "View privacy policy",
    submit: "Send inquiry",
    submitting: "Sending...",
    cancel: "Cancel",
    fileHint: "Click to add a file",
    fileSupport: "JPG, PNG, PDF supported / up to 10MB",
    errors: {
      name: "Please enter your name.",
      email: "Please enter a valid email address.",
      title: "Please enter a subject.",
      message: "Please enter at least 10 characters for the message.",
      consent: "Please agree to the collection and use of personal information.",
      submit: "We could not submit your inquiry. Please try again in a moment.",
    },
    uploadTitle: "Attach a file for a faster review.",
    badges: [
      "For booking questions, include the reservation number.",
      "For payment or refund questions, include order details.",
    ],
  },
} as const;

const INITIAL_CATEGORIES = {
  ko: "예약/취소",
  en: "Booking / Cancellation",
} as const;

export default function InquiryPage() {
  const { locale } = useI18n();
  const copy = COPY[locale as Locale];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [category, setCategory] = useState<string>(INITIAL_CATEGORIES[locale as Locale]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [agreed, setAgreed] = useState(false);

  const resetForm = () => {
    setIsSuccess(false);
    setErrorMessage("");
    setCategory(INITIAL_CATEGORIES[locale as Locale]);
    setName("");
    setEmail("");
    setTitle("");
    setMessage("");
    setAgreed(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage(copy.errors.name);
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage(copy.errors.email);
      return;
    }
    if (!title.trim()) {
      setErrorMessage(copy.errors.title);
      return;
    }
    if (message.trim().length < 10) {
      setErrorMessage(copy.errors.message);
      return;
    }
    if (!agreed) {
      setErrorMessage(copy.errors.consent);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, name, email, title, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || copy.errors.submit);
      }

      setIsSuccess(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : copy.errors.submit);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <>
        <InfoHeader />
        <main className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle className="h-10 w-10 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{copy.successTitle}</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">{copy.successBody}</p>
            <p className="mt-2 text-sm text-slate-500">{copy.successNote}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-xl px-6 font-bold"
                onClick={() => (window.location.href = localizePath(locale, "/"))}
              >
                {copy.backHome}
              </Button>
              <Button
                type="button"
                className="h-12 rounded-xl bg-blue-600 px-6 font-bold text-white hover:bg-blue-700"
                onClick={resetForm}
              >
                {copy.askAgain}
              </Button>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <InfoHeader />
      <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{copy.pageTitle}</h1>
            <p className="mt-3 text-base leading-7 text-slate-600 sm:text-lg">{copy.pageLead}</p>
          </div>

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-blue-50/60 px-6 py-4 sm:px-8">
              <div className="flex gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                <div className="text-sm leading-7 text-slate-600">
                  <p className="font-bold text-slate-900">{copy.uploadTitle}</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    {copy.badges.map((badge) => (
                      <li key={badge}>{badge}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 px-6 py-8 sm:px-8">
              <div>
                <label className="mb-3 block text-sm font-bold text-slate-900">{copy.formTitle}</label>
                <p className="mb-4 text-sm leading-7 text-slate-500">{copy.formHelper}</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {copy.categories.map((item) => (
                    <label key={item} className="cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={item}
                        checked={category === item}
                        onChange={() => setCategory(item)}
                        className="peer sr-only"
                      />
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-semibold text-slate-600 transition-colors peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700">
                        {item}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-bold text-slate-900">
                    {copy.labels.name} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder={copy.placeholders.name}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-bold text-slate-900">
                    {copy.labels.email} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={copy.placeholders.email}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="title" className="mb-2 block text-sm font-bold text-slate-900">
                  {copy.labels.title} <span className="text-rose-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder={copy.placeholders.title}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-bold text-slate-900">
                  {copy.labels.message} <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="message"
                  rows={8}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder={copy.placeholders.message}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-relaxed outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  required
                />
                <p className="mt-2 text-right text-xs text-slate-400">{message.length}</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900">{copy.labels.attachment}</label>
                <div className="mt-2 cursor-pointer rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center transition hover:bg-slate-100">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                    <FileUp className="h-5 w-5 text-slate-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">{copy.fileHint}</p>
                  <p className="mt-1 text-xs text-slate-500">{copy.fileSupport}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(event) => setAgreed(event.target.checked)}
                    className="mt-0.5 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <span className="text-sm leading-7 text-slate-600">
                    {copy.labels.consent}{" "}
                    <Link
                      href={localizePath(locale, "/terms?type=privacy")}
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      {copy.privacyLink}
                    </Link>
                  </span>
                </label>
              </div>

              {errorMessage ? (
                <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
                  <p className="text-sm font-medium text-rose-700">{errorMessage}</p>
                </div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="h-14 flex-1 rounded-xl font-bold text-slate-600"
                  onClick={() => window.history.back()}
                  disabled={isSubmitting}
                >
                  {copy.cancel}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-14 flex-[2] items-center justify-center gap-2 rounded-xl bg-blue-600 font-bold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {copy.submitting}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      {copy.submit}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </>
  );
}
