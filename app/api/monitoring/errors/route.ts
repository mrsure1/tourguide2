import { NextResponse } from "next/server";
import { reportMessage } from "@/lib/monitoring/report";

type ClientErrorPayload = {
  source?: string;
  message?: string;
  stack?: string;
  digest?: string;
  url?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ClientErrorPayload;

    if (!body?.message) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    await reportMessage(body.message, {
      source: body.source || "client-error",
      request,
      level: "error",
      extra: {
        stack: body.stack,
        digest: body.digest,
        pageUrl: body.url,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to collect client error" },
      { status: 500 },
    );
  }
}

