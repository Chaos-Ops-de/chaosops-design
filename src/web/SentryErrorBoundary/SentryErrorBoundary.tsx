import * as Sentry from '@sentry/react'
import { useState, type ReactNode } from 'react'
import { isCloudflareError, type CloudflareError } from '../../utils/errors'

export interface ErrorReportDetails {
  message: string
  stack?: string
}

// Plain <img> rather than the React Native <Gremlin /> primitive — this file
// is part of the web-only `./web` entry and must not pull in react-native.
function GremlinMascot({ src, size = 128 }: { src: string; size?: number }) {
  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  )
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
}

// Shared "sticker" button used by both fallbacks. Feedback starts on
// pointer-down rather than waiting for click (Apple HIG: respond on press,
// not release), and the hover lift is skipped for prefers-reduced-motion —
// the color/shadow change still communicates state without the transform.
function ActionButton({ children, onClick, primary = true }: { children: ReactNode; onClick: () => void; primary?: boolean }) {
  const reduced = prefersReducedMotion()

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '0.75rem 1.75rem',
        border: '2px solid var(--chaos-ink, #181818)',
        borderRadius: 'var(--chaos-radius-md, 8px)',
        fontSize: '1rem',
        fontWeight: '700',
        fontFamily: '"Inter", "Roboto", Arial, sans-serif',
        backgroundColor: primary ? 'var(--chaos-amber, #fbbf24)' : 'var(--chaos-surface-elevated, #fff)',
        color: 'var(--chaos-ink, #181818)',
        cursor: 'pointer',
        boxShadow: 'var(--chaos-shadow-offset-ink-md, 3px 5px 0 #181818)',
        transition: reduced
          ? 'background-color var(--chaos-duration-fast, 120ms) var(--chaos-ease-standard, ease)'
          : 'transform var(--chaos-duration-fast, 120ms) var(--chaos-ease-standard, ease), box-shadow var(--chaos-duration-fast, 120ms) var(--chaos-ease-standard, ease)',
      }}
      onMouseEnter={(e) => {
        if (reduced) return
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = 'var(--chaos-shadow-offset-ink-md-hover, 4px 7px 0 #181818)'
      }}
      onMouseLeave={(e) => {
        if (reduced) return
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'var(--chaos-shadow-offset-ink-md, 3px 5px 0 #181818)'
      }}
      onPointerDown={(e) => {
        // Feedback on press, not on release — the tactile "sticker being
        // pushed in" cue should land the instant the finger/cursor commits.
        e.currentTarget.style.transform = reduced ? 'none' : 'translateY(1px) scale(0.98)'
        e.currentTarget.style.boxShadow = 'var(--chaos-shadow-offset-ink-press, 1px 2px 0 #181818)'
      }}
      onPointerUp={(e) => {
        e.currentTarget.style.transform = reduced ? 'none' : 'translateY(-2px)'
        e.currentTarget.style.boxShadow = 'var(--chaos-shadow-offset-ink-md-hover, 4px 7px 0 #181818)'
      }}
    >
      {children}
    </button>
  )
}

// Secondary action next to "Seite neu laden" — sends the error to the
// Product Control Center (audit log + ntfy push, see server/routes/errors.ts)
// so a user hitting a crash can proactively flag it instead of it only
// surfacing later in Sentry. Optional: only renders when a consumer app
// wires up `onReport` (it needs its own API base URL, so the design
// package can't hardcode the endpoint).
function ReportButton({ onReport }: { onReport: () => Promise<void> | void }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleClick() {
    if (status === 'sending' || status === 'sent') return
    setStatus('sending')
    try {
      await onReport()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  const label = status === 'sending' ? 'Sende…' : status === 'sent' ? 'Gemeldet ✓' : status === 'error' ? 'Fehlgeschlagen — erneut?' : 'Fehler melden'

  return (
    <ActionButton onClick={handleClick} primary={false}>
      {label}
    </ActionButton>
  )
}

function GenericErrorFallback({ error, downGremlinSrc, onReport }: { error: unknown; downGremlinSrc: string; onReport?: (details: ErrorReportDetails) => Promise<void> | void }) {
  const message = error instanceof Error ? error.message : String(error)

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'repeating-linear-gradient(0deg, var(--chaos-bg, #fffbe7) 0px, var(--chaos-bg, #fffbe7) 39px, var(--chaos-tab-bar-border, #e5e7eb) 40px, var(--chaos-bg, #fffbe7) 41px)',
        fontFamily: '"Inter", "Roboto", Arial, sans-serif',
      }}
    >
      <div
        role="alert"
        aria-live="assertive"
        style={{
          background: 'var(--chaos-surface-elevated, #fff)',
          borderRadius: 'var(--chaos-radius-card, 1.2rem 1.35rem 1.15rem 1.25rem)',
          border: '3px solid var(--chaos-ink, #181818)',
          boxShadow: '4px 8px 0 rgba(0,0,0,0.12)',
          maxWidth: '480px',
          width: '100%',
          padding: '2rem',
          transform: 'rotate(-0.3deg)',
          textAlign: 'center',
        }}
      >
        <div style={{ marginBottom: '1rem' }}>
          <GremlinMascot src={downGremlinSrc} size={128} />
        </div>

        <h2
          style={{
            fontFamily: '"Gloria Hallelujah", "Caveat", cursive, sans-serif',
            fontSize: '1.3rem',
            fontWeight: '700',
            letterSpacing: '-0.01em',
            color: 'var(--chaos-ink, #0f172a)',
            margin: '0 0 0.75rem',
          }}
        >
          Da ist etwas schiefgelaufen.
        </h2>

        <p
          style={{
            fontSize: '0.95rem',
            color: 'var(--chaos-ink-muted, #475569)',
            lineHeight: '1.6',
            margin: '0 0 1rem',
          }}
        >
          Der Gremlin hat wieder gewütet. Lade die Seite neu — meistens hilft das.
        </p>

        {message && (
          <p
            style={{
              fontFamily: 'monospace',
              fontSize: '0.78rem',
              color: 'var(--chaos-ink-muted, #94a3b8)',
              background: 'var(--chaos-chip-inactive-bg, #f8fafc)',
              border: '1px solid var(--chaos-input-border, #e2e8f0)',
              borderRadius: 'var(--chaos-radius-sm, 4px)',
              padding: '0.5rem 0.75rem',
              margin: '0 0 1.5rem',
              textAlign: 'left',
              wordBreak: 'break-word',
            }}
          >
            {message}
          </p>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <ActionButton onClick={() => window.location.reload()}>Seite neu laden</ActionButton>
          {onReport && <ReportButton onReport={() => onReport({ message, stack: error instanceof Error ? error.stack : undefined })} />}
        </div>
      </div>
    </div>
  )
}

export interface SentryErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  /** URL of the "down" gremlin mascot image (app-specific bundler resolves the path). */
  downGremlinSrc: string
  /**
   * Sends the caught error to the app's own backend (Control Center audit
   * log + ntfy push) when the user clicks "Fehler melden". Omit to hide
   * the button entirely — Sentry still captures every error regardless.
   */
  onReport?: (details: ErrorReportDetails) => Promise<void> | void
}

// Cloudflare brand orange
const CF_ORANGE = '#F48120'

function CloudflareErrorFallback({ error, downGremlinSrc, onReport }: { error: CloudflareError; downGremlinSrc: string; onReport?: (details: ErrorReportDetails) => Promise<void> | void }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'var(--chaos-bg, #f8fafc)',
        fontFamily: '"Inter", "Roboto", Arial, sans-serif',
      }}
    >
      <div
        role="alert"
        aria-live="assertive"
        style={{
          background: 'var(--chaos-surface-elevated, #fff)',
          borderRadius: 'var(--chaos-radius-card, 1.2rem 1.35rem 1.15rem 1.25rem)',
          border: '3px solid var(--chaos-ink, #181818)',
          boxShadow: '4px 8px 0 rgba(0,0,0,0.12)',
          maxWidth: '480px',
          width: '100%',
          padding: '2rem',
          transform: 'rotate(-0.3deg)',
          textAlign: 'center',
        }}
      >
        {/* Gremlin mascot */}
        <div style={{ marginBottom: '1rem' }}>
          <GremlinMascot src={downGremlinSrc} size={128} />
        </div>

        {/* Cloudflare attribution badge — brand color, stays fixed regardless of theme */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: CF_ORANGE,
            color: '#fff',
            borderRadius: 'var(--chaos-radius-sm, 4px)',
            padding: '0.35rem 0.75rem',
            fontSize: '0.85rem',
            fontWeight: '700',
            letterSpacing: '0.04em',
            marginBottom: '1.25rem',
            border: '2px solid var(--chaos-ink, #181818)',
            boxShadow: 'var(--chaos-shadow-offset-ink-sm, 2px 3px 0 #181818)',
          }}
        >
          {/* Cloudflare cloud icon (inline SVG) */}
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
            <path
              d="M14.25 5.1a.5.5 0 0 0-.03-.06A5.25 5.25 0 0 0 4.1 4.5a3 3 0 0 0 .4 5.97h9.3a2.25 2.25 0 0 0 .45-4.37z"
              fill="#fff"
            />
          </svg>
          Cloudflare-Fehler
        </div>

        {/* Status code badge */}
        <div style={{ marginBottom: '0.75rem' }}>
          <span
            style={{
              display: 'inline-block',
              background: 'color-mix(in srgb, var(--chaos-orange, #f97316) 16%, var(--chaos-surface-elevated, #fff))',
              color: 'var(--chaos-orange-ink, #c2410c)',
              border: '2px solid var(--chaos-orange, #f97316)',
              borderRadius: 'var(--chaos-radius-sm, 4px)',
              padding: '0.2rem 0.6rem',
              fontFamily: 'monospace',
              fontWeight: '700',
              fontSize: '0.9rem',
            }}
          >
            HTTP {error.status}
          </span>
        </div>

        {/* Heading */}
        <h2
          style={{
            fontFamily: '"Gloria Hallelujah", "Caveat", cursive, sans-serif',
            fontSize: '1.3rem',
            fontWeight: '700',
            letterSpacing: '-0.01em',
            color: 'var(--chaos-ink, #0f172a)',
            margin: '0 0 0.75rem',
          }}
        >
          Cloudflare kann unseren Server nicht erreichen
        </h2>

        {/* Sub-copy */}
        <p
          style={{
            fontSize: '0.95rem',
            color: 'var(--chaos-ink-muted, #475569)',
            lineHeight: '1.6',
            margin: '0 0 1.5rem',
          }}
        >
          Das Problem liegt bei Cloudflare, nicht in der App. Bitte versuche es in einem Moment erneut.
        </p>

        {/* Ray ID */}
        {error.rayId && (
          <p
            style={{
              fontFamily: 'monospace',
              fontSize: '0.78rem',
              color: 'var(--chaos-ink-muted, #94a3b8)',
              margin: '0 0 1.5rem',
            }}
          >
            Ray ID: {error.rayId}
          </p>
        )}

        {/* Retry button */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <ActionButton onClick={() => window.location.reload()}>Seite neu laden</ActionButton>
          {onReport && <ReportButton onReport={() => onReport({ message: error.message, stack: error.stack })} />}
        </div>
      </div>
    </div>
  )
}

export function SentryErrorBoundary({ children, fallback, downGremlinSrc, onReport }: SentryErrorBoundaryProps) {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error }) => {
        if (fallback) return <>{fallback}</>
        if (isCloudflareError(error)) return <CloudflareErrorFallback error={error} downGremlinSrc={downGremlinSrc} onReport={onReport} />
        return <GenericErrorFallback error={error} downGremlinSrc={downGremlinSrc} onReport={onReport} />
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  )
}
