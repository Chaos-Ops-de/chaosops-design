import * as Sentry from '@sentry/react'
import type { ReactNode } from 'react'
import { isCloudflareError, type CloudflareError } from '../../utils/errors'
import { Gremlin } from '../../primitives/Gremlin'

function GenericErrorFallback({ error, downGremlinSrc }: { error: unknown; downGremlinSrc: string }) {
  const message = error instanceof Error ? error.message : String(error)

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'repeating-linear-gradient(0deg, #fffbe7 0px, #fffbe7 39px, #e5e7eb 40px, #fffbe7 41px)',
        fontFamily: '"Inter", "Roboto", Arial, sans-serif',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '1.2rem 1.35rem 1.15rem 1.25rem',
          border: '3px solid #181818',
          boxShadow: '4px 8px 0 rgba(0,0,0,0.12)',
          maxWidth: '480px',
          width: '100%',
          padding: '2rem',
          transform: 'rotate(-0.3deg)',
          textAlign: 'center',
        }}
      >
        <div style={{ marginBottom: '1rem' }}>
          <Gremlin source={{ uri: downGremlinSrc }} size={128} />
        </div>

        <h2
          style={{
            fontFamily: '"Gloria Hallelujah", "Caveat", cursive, sans-serif',
            fontSize: '1.3rem',
            fontWeight: '700',
            color: '#0f172a',
            margin: '0 0 0.75rem',
          }}
        >
          Da ist etwas schiefgelaufen.
        </h2>

        <p
          style={{
            fontSize: '0.95rem',
            color: '#475569',
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
              color: '#94a3b8',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              padding: '0.5rem 0.75rem',
              margin: '0 0 1.5rem',
              textAlign: 'left',
              wordBreak: 'break-word',
            }}
          >
            {message}
          </p>
        )}

        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '0.75rem 1.75rem',
            border: '2px solid #181818',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '700',
            fontFamily: '"Inter", "Roboto", Arial, sans-serif',
            backgroundColor: '#fbbf24',
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '3px 5px 0 #181818',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '4px 7px 0 #181818'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '3px 5px 0 #181818'
          }}
        >
          Seite neu laden
        </button>
      </div>
    </div>
  )
}

export interface SentryErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  /** URL of the "down" gremlin mascot image (app-specific bundler resolves the path). */
  downGremlinSrc: string
}

// Cloudflare brand orange
const CF_ORANGE = '#F48120'

function CloudflareErrorFallback({ error, downGremlinSrc }: { error: CloudflareError; downGremlinSrc: string }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: '#f8fafc',
        fontFamily: '"Inter", "Roboto", Arial, sans-serif',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '1.2rem 1.35rem 1.15rem 1.25rem',
          border: '3px solid #181818',
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
          <Gremlin source={{ uri: downGremlinSrc }} size={128} />
        </div>

        {/* Cloudflare attribution badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: CF_ORANGE,
            color: '#fff',
            borderRadius: '6px',
            padding: '0.35rem 0.75rem',
            fontSize: '0.85rem',
            fontWeight: '700',
            letterSpacing: '0.04em',
            marginBottom: '1.25rem',
            border: '2px solid #181818',
            boxShadow: '2px 3px 0 #181818',
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
              background: '#fef3c7',
              color: '#92400e',
              border: '2px solid #f59e0b',
              borderRadius: '6px',
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
            color: '#0f172a',
            margin: '0 0 0.75rem',
          }}
        >
          Cloudflare kann unseren Server nicht erreichen
        </h2>

        {/* Sub-copy */}
        <p
          style={{
            fontSize: '0.95rem',
            color: '#475569',
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
              color: '#94a3b8',
              margin: '0 0 1.5rem',
            }}
          >
            Ray ID: {error.rayId}
          </p>
        )}

        {/* Retry button */}
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '0.75rem 1.75rem',
            border: '2px solid #181818',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '700',
            fontFamily: '"Inter", "Roboto", Arial, sans-serif',
            backgroundColor: '#fbbf24',
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '3px 5px 0 #181818',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '4px 7px 0 #181818'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '3px 5px 0 #181818'
          }}
        >
          Seite neu laden
        </button>
      </div>
    </div>
  )
}

export function SentryErrorBoundary({ children, fallback, downGremlinSrc }: SentryErrorBoundaryProps) {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error }) => {
        if (fallback) return <>{fallback}</>
        if (isCloudflareError(error)) return <CloudflareErrorFallback error={error} downGremlinSrc={downGremlinSrc} />
        return <GenericErrorFallback error={error} downGremlinSrc={downGremlinSrc} />
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  )
}
