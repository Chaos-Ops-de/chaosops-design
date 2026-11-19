import React from 'react';
import './AuthScreen.css';

export interface AuthScreenProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/** Full-viewport shell for auth-flow pages (login, reset password, invitations): themed background, centered content. */
export const AuthScreen: React.FC<AuthScreenProps> = ({ children, className, style }) => (
  <main className={['chaos-auth-screen', className].filter(Boolean).join(' ')} style={style}>
    {children}
  </main>
);
