'use client';

import { useState } from 'react';
import { 
  HiOutlineArrowLeft,
  HiOutlineArchive,
  HiOutlineExclamation,
  HiOutlineTrash,
  HiOutlineMailOpen,
  HiOutlineClock,
  HiOutlineDotsVertical,
  HiOutlineReply,
  HiOutlineArrowRight,
  HiOutlinePrinter,
  HiOutlineExternalLink,
  HiOutlineStar,
  HiStar
} from 'react-icons/hi';
import { MdLabelImportant, MdLabelImportantOutline } from 'react-icons/md';
import { Email } from '../data/portfolioData';

interface EmailViewerProps {
  email: Email;
  onBack: () => void;
}

export default function EmailViewer({ email, onBack }: EmailViewerProps) {
  const [isStarred, setIsStarred] = useState(email.starred);
  const [isImportant, setIsImportant] = useState(email.important);

  const getAvatarColor = (sender: string) => {
    const colors = [
      '#1a73e8', '#ea4335', '#34a853', '#fbbc04', 
      '#9334ea', '#f472b6', '#06b6d4', '#f97316'
    ];
    const index = sender.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getInitials = (sender: string) => {
    return sender.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="email-viewer">
      <div className="viewer-toolbar">
        <div className="toolbar-left">
          <button className="toolbar-button" onClick={onBack} aria-label="Back to inbox">
            <HiOutlineArrowLeft size={18} />
          </button>
          <button className="toolbar-button" aria-label="Archive">
            <HiOutlineArchive size={18} />
          </button>
          <button className="toolbar-button" aria-label="Report spam">
            <HiOutlineExclamation size={18} />
          </button>
          <button className="toolbar-button" aria-label="Delete">
            <HiOutlineTrash size={18} />
          </button>
          <div className="toolbar-divider" />
          <button className="toolbar-button" aria-label="Mark as unread">
            <HiOutlineMailOpen size={18} />
          </button>
          <button className="toolbar-button" aria-label="Snooze">
            <HiOutlineClock size={18} />
          </button>
          <button className="toolbar-button" aria-label="More">
            <HiOutlineDotsVertical size={18} />
          </button>
        </div>

        <div className="toolbar-right">
          <button className="toolbar-button" aria-label="Print">
            <HiOutlinePrinter size={18} />
          </button>
          <button className="toolbar-button" aria-label="Open in new window">
            <HiOutlineExternalLink size={18} />
          </button>
        </div>
      </div>

      <div className="email-content">
        <div className="email-header">
          <h1 className="email-title">{email.subject}</h1>
          
          <div className="email-labels-row">
            {email.labels?.map((label) => (
              <span key={label} className="email-label-tag">{label}</span>
            ))}
            <button 
              className={`important-toggle ${isImportant ? 'active' : ''}`}
              onClick={() => setIsImportant(!isImportant)}
            >
              {isImportant ? <MdLabelImportant size={20} /> : <MdLabelImportantOutline size={20} />}
            </button>
          </div>
        </div>

        <div className="email-message">
          <div className="message-header">
            <div 
              className="sender-avatar" 
              style={{ backgroundColor: getAvatarColor(email.sender) }}
            >
              {getInitials(email.sender)}
            </div>
            
            <div className="sender-info">
              <div className="sender-name-row">
                <span className="sender-name">{email.sender}</span>
                <span className="sender-email">&lt;{email.senderEmail}&gt;</span>
              </div>
              <div className="recipient-row">
                to me
              </div>
            </div>

            <div className="message-actions">
              <span className="message-date">{email.date}</span>
              <button 
                className={`star-button ${isStarred ? 'starred' : ''}`}
                onClick={() => setIsStarred(!isStarred)}
              >
                {isStarred ? <HiStar size={20} /> : <HiOutlineStar size={20} />}
              </button>
              <button className="reply-button">
                <HiOutlineReply size={20} />
              </button>
              <button className="more-button">
                <HiOutlineDotsVertical size={20} />
              </button>
            </div>
          </div>

          <div 
            className="message-body"
            dangerouslySetInnerHTML={{ __html: email.body }}
          />
        </div>

        <div className="reply-section">
          <button className="reply-btn">
            <HiOutlineReply size={18} />
            Reply
          </button>
          <button className="forward-btn">
            <HiOutlineArrowRight size={18} />
            Forward
          </button>
        </div>
      </div>
    </div>
  );
}

