import { randomUUID } from "crypto";

type MonitoringLevel = "error" | "warning" | "info";

type MonitoringContext = {
  source: string;
  level?: MonitoringLevel;
  request?: Request;
  tags?: Record<string, string | number | boolean | null | undefined>;
  extra?: Record<string, unknown>;
};

type MonitoringPayload = {
  id: string;
  timestamp: string;
  environment: string;
  release: string;
  source: string;
  level: MonitoringLevel;
  message: string;
  stack?: string;
  tags?: Record<string, string | number | boolean>;
  request?: Record<string, string>;
  extra?: Record<string, unknown>;
};

function compactRecord<T extends Record<string, unknown>>(value?: T): T | undefined {
  if (!value) return undefined;

  const entries = Object.entries(value).filter(([, item]) => item !== undefined && item !== null);
  if (entries.length === 0) return undefined;

  return Object.fromEntries(entries) as T;
}

function serializeError(error: unknown): { message: string; stack?: string } {
  if (error instanceof Error) {
    return {
      message: error.message || "Unknown error",
      stack: error.stack,
    };
  }

  if (typeof error === "string") {
    return { message: error };
  }

  try {
    return { message: JSON.stringify(error) };
  } catch {
    return { message: "Unknown non-serializable error" };
  }
}

function buildRequestContext(request?: Request): Record<string, string> | undefined {
  if (!request) return undefined;

  const forwardedFor = request.headers.get("x-forwarded-for");
  const clientIp = forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "";
  const userAgent = request.headers.get("user-agent") || "";

  return compactRecord({
    method: request.method,
    url: request.url,
    clientIp,
    userAgent,
  });
}

function buildPayload(message: string, context: MonitoringContext, stack?: string): MonitoringPayload {
  const environment = process.env.APP_ENV || process.env.VERCEL_ENV || process.env.NODE_ENV || "development";
  const release =
    process.env.APP_RELEASE ||
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.NEXT_PUBLIC_APP_RELEASE ||
    "local";

  return {
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    environment,
    release,
    source: context.source,
    level: context.level || "error",
    message,
    stack,
    tags: compactRecord(context.tags as Record<string, unknown>) as
      | Record<string, string | number | boolean>
      | undefined,
    request: buildRequestContext(context.request),
    extra: compactRecord(context.extra),
  };
}

async function postToWebhook(payload: MonitoringPayload) {
  const webhookUrl = process.env.MONITORING_WEBHOOK_URL || process.env.ERROR_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (webhookError) {
    console.error("[monitoring] webhook delivery failed", webhookError);
  }
}

export async function reportError(error: unknown, context: MonitoringContext) {
  const serialized = serializeError(error);
  const payload = buildPayload(serialized.message, context, serialized.stack);

  console.error("[monitoring]", payload);
  await postToWebhook(payload);
}

export async function reportMessage(message: string, context: MonitoringContext) {
  const payload = buildPayload(message, context);

  if (context.level === "warning") {
    console.warn("[monitoring]", payload);
  } else if (context.level === "info") {
    console.info("[monitoring]", payload);
  } else {
    console.error("[monitoring]", payload);
  }

  await postToWebhook(payload);
}

