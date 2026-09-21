interface Fetcher {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

interface D1Database {
  readonly __sentinelD1DatabaseBrand?: never;
}

declare module "cloudflare:workers" {
  export const env: Record<string, unknown>;
}
