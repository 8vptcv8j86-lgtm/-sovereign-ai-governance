export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function badRequest(message: string) {
  return new ApiError("BAD_REQUEST", message, 400);
}

export function json(value: unknown, init?: ResponseInit) {
  return Response.json(value, init);
}

export async function readJsonObject(request: Request): Promise<Record<string, unknown>> {
  const length = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(length) && length > 1_000_000) {
    throw new ApiError("PAYLOAD_TOO_LARGE", "Request payload is too large", 413);
  }
  let value: unknown;
  try {
    value = await request.json();
  } catch {
    throw badRequest("Request body must be valid JSON");
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw badRequest("Request body must be a JSON object");
  }
  return value as Record<string, unknown>;
}

export function errorResponse(error: unknown, operation: string) {
  if (error instanceof ApiError) {
    return json({ error: error.code, message: error.message, operation }, { status: error.status });
  }
  const message = error instanceof Error ? error.message : "Internal error";
  if (message === "AUTH_REQUIRED") return json({ error: message, operation }, { status: 401 });
  if (message === "ACCESS_DENIED") return json({ error: message, operation }, { status: 403 });
  if (message === "UNKNOWN_ACTION") return json({ error: message, operation }, { status: 400 });
  if (/required|invalid|must |cannot |not found|changed; refresh/i.test(message)) {
    return json({ error: message, operation }, { status: 400 });
  }
  console.error(operation, error);
  return json({ error: "INTERNAL_ERROR", operation }, { status: 500 });
}
