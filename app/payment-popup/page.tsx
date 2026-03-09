import { Suspense } from "react";
import PaymentPopupResultClient from "./PaymentPopupResultClient";

export default function PaymentPopupPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#f6f4ef]" />}>
      <PaymentPopupResultClient />
    </Suspense>
  );
}
