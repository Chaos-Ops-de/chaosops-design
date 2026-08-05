import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface UnsavedChangesPromptProps {
  show: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const UnsavedChangesPrompt: React.FC<UnsavedChangesPromptProps> = ({
  show,
  title = 'Ungespeicherte Änderungen',
  message = 'Du hast ungespeicherte Änderungen. Wenn du jetzt schließt, gehen sie verloren.',
  confirmText = 'Verwerfen',
  cancelText = 'Weiterbearbeiten',
  onConfirm,
  onCancel,
}) => {
  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '2rem 1rem',
        backdropFilter: 'blur(2px)',
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '1rem',
          border: '3px solid #181818',
          boxShadow: '0 12px 32px rgba(0,0,0,0.25), 3px 6px 0 rgba(0,0,0,0.1)',
          maxWidth: '420px',
          width: '100%',
          padding: '1.75rem',
          transform: 'rotate(0.2deg)',
          animation: 'modalSlideIn 0.15s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <AlertTriangle size={24} color="#f59e0b" />
          <h3
            style={{
              fontFamily: '"Gloria Hallelujah", "Caveat", cursive, sans-serif',
              fontSize: '1.2rem',
              fontWeight: '700',
              color: '#0f172a',
              margin: 0,
            }}
          >
            {title}
          </h3>
        </div>

        <p
          style={{
            fontFamily: '"Inter", "Roboto", Arial, sans-serif',
            fontSize: '0.95rem',
            color: '#475569',
            lineHeight: '1.6',
            margin: '0 0 1.5rem',
          }}
        >
          {message}
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '0.65rem 1.25rem',
              border: '2px solid #64748b',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: '600',
              fontFamily: '"Inter", "Roboto", Arial, sans-serif',
              backgroundColor: '#fff',
              color: '#64748b',
              cursor: 'pointer',
              boxShadow: '2px 3px 0 #64748b',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '3px 5px 0 #64748b';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '2px 3px 0 #64748b';
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '0.65rem 1.25rem',
              border: '2px solid #181818',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: '600',
              fontFamily: '"Inter", "Roboto", Arial, sans-serif',
              backgroundColor: '#fbbf24',
              color: '#fff',
              cursor: 'pointer',
              boxShadow: '2px 3px 0 #181818',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '3px 5px 0 #181818';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '2px 3px 0 #181818';
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
