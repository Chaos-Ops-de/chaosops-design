import React from 'react';
import { Home, Monitor } from 'lucide-react';
import './FooterAdmin.css';

export interface FooterAdminProps {
  icon?: 'home' | 'monitor';
  text: string;
  href?: string;
}

export const FooterAdmin: React.FC<FooterAdminProps> = ({ icon = 'home', text, href = '/' }) => (
  <a href={href} style={{
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
  }}>
    <footer className="chaos-admin-footer" style={{ cursor: 'pointer', width: '100%' }}>
      <span className="chaos-admin-footer-icon" aria-hidden="true">
        {icon === 'home' ? <Home size={16} /> : <Monitor size={16} />}
      </span>
      <span>{text}</span>
    </footer>
  </a>
);
