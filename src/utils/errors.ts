export class CloudflareError extends Error {
  readonly rayId: string | null
  readonly status: number

  constructor(status: number, rayId: string | null = null) {
    super(`Cloudflare error ${status}${rayId ? ` (Ray ID: ${rayId})` : ''}`)
    this.name = 'CloudflareError'
    this.status = status
    this.rayId = rayId
    // Restore prototype chain (required when extending built-ins in TypeScript)
    Object.setPrototypeOf(this, CloudflareError.prototype)
  }
}

export function isCloudflareError(e: unknown): e is CloudflareError {
  return e instanceof CloudflareError
}
