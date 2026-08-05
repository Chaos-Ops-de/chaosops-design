import React from "react";
import "./HelpChat.css";

export interface HelpChatProps {
  onClose?: () => void;
}

export const HelpChat: React.FC<HelpChatProps> = ({ onClose }) => {
  return (
    <div className="chaos-help-chat-widget">
      <div className="chaos-help-chat-header">
        <span>Help Chat</span>
        {onClose && (
          <button className="chaos-help-chat-close-btn" onClick={onClose} aria-label="Schließen">×</button>
        )}
      </div>
      <div className="chaos-help-chat-body">
        <p>Coming Soon...</p>
      </div>
    </div>
  );
};
