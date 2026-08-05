import React from 'react';

export interface NotFoundPageProps {
  /** URL of the 404 gremlin mascot image (app-specific bundler resolves the path). */
  gremlinSrc: string;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ gremlinSrc }) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'repeating-linear-gradient(0deg, var(--chaos-bg) 0px, var(--chaos-bg) 39px, #e5e7eb 40px, var(--chaos-bg) 41px)',
      color: 'var(--chaos-ink)',
      boxSizing: 'border-box',
      fontFamily: '"Inter", "Roboto", Arial, sans-serif',
      textAlign: 'center',
      padding: '4rem 2rem',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '1.2rem',
        boxShadow: '2px 4px 0 #e5e7eb, 0 2px 8px 0 rgba(0,0,0,0.08)',
        padding: '3rem 2rem',
        border: '2px solid #181818',
        maxWidth: '500px',
        margin: '0 auto',
        transform: 'rotate(-0.5deg)',
      }}>
        <img
          src={gremlinSrc}
          alt="404 Gremlin"
          style={{
            width: '150px',
            height: '150px',
            objectFit: 'contain',
            marginBottom: '2rem',
          }}
        />

        <h1 style={{
          fontFamily: '"Gloria Hallelujah", "Caveat", "Comic Neue", cursive, sans-serif',
          fontSize: '2.5rem',
          color: '#181818',
          marginBottom: '1rem',
        }}>
          404 - Seite nicht gefunden
        </h1>

        <p style={{
          fontFamily: '"Inter", "Roboto", Arial, sans-serif',
          fontSize: '1.1rem',
          color: '#4a5568',
          marginBottom: '2rem',
        }}>
          Ups! Dieser Gremlin konnte die gesuchte Seite nicht finden.
        </p>

        <button
          onClick={() => window.history.back()}
          style={{
            padding: '1rem 2rem',
            border: '2px solid #181818',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            backgroundColor: '#fbbf24',
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '2px 4px 0 #181818',
          }}
        >
          Zurück
        </button>
      </div>
    </div>
  );
};
