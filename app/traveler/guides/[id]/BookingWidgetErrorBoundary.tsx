"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
};

// 예약 위젯에서 예외가 나도 상세 페이지 본문은 유지되도록 합니다.
export default class BookingWidgetErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("[BookingWidgetErrorBoundary] Booking widget failed:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5 text-center">
          <p className="text-sm font-bold text-amber-800">예약 위젯을 불러오지 못했습니다.</p>
          <p className="mt-1 text-xs leading-relaxed text-amber-700">
            가이드 상세 정보는 계속 볼 수 있습니다. 잠시 후 새로고침해 주세요.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
