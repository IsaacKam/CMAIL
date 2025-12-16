'use client';

import { useState } from 'react';
import { 
  HiOutlineStar, 
  HiStar,
  HiOutlineArchive,
  HiOutlineTrash,
  HiOutlineMailOpen,
  HiOutlineClock
} from 'react-icons/hi';
import { MdLabelImportantOutline, MdLabelImportant } from 'react-icons/md';
import { Email } from '../data/portfolioData';

interface EmailItemProps {
  email: Email;
  isSelected: boolean;
  onClick: () => void;
}

export default function EmailItem({ email, isSelected, onClick }: EmailItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isStarred, setIsStarred] = useState(email.starred);
  const [isImportant, setIsImportant] = useState(email.important);
  const [isChecked, setIsChecked] = useState(false);

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsStarred(!isStarred);
  };

  const handleImportantClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsImportant(!isImportant);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsChecked(!isChecked);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={`email-item ${!email.read ? 'unread' : ''} ${isSelected ? 'selected' : ''} ${isChecked ? 'checked' : ''}`}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="email-item-left">
        <div className="checkbox-wrapper" onClick={handleCheckboxClick}>
          <input 
            type="checkbox" 
            checked={isChecked} 
            onChange={() => {}} 
            className="email-checkbox"
          />
        </div>
        
        <button 
          className={`star-button ${isStarred ? 'starred' : ''}`}
          onClick={handleStarClick}
          aria-label={isStarred ? 'Unstar' : 'Star'}
        >
          {isStarred ? <HiStar size={20} /> : <HiOutlineStar size={20} />}
        </button>

        <button 
          className={`important-button ${isImportant ? 'important' : ''}`}
          onClick={handleImportantClick}
          aria-label={isImportant ? 'Not important' : 'Mark as important'}
        >
          {isImportant ? <MdLabelImportant size={20} /> : <MdLabelImportantOutline size={20} />}
        </button>
      </div>

      <div className="email-item-content" onClick={onClick}>
        <div className="email-sender">
          {email.sender}
        </div>
        
        <div className="email-subject-snippet">
          <span className="email-subject">{email.subject}</span>
          <span className="email-snippet-separator"> - </span>
          <span className="email-snippet">{email.snippet}</span>
        </div>

        {email.attachments && email.attachments.length > 0 && (
          <div className="email-attachments-preview">
            {email.attachments.map((att, i) => (
              <span key={i} className="attachment-chip">
                <span className="attachment-icon">📎</span>
                {att.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="email-item-right">
        {isHovered ? (
          <div className="email-actions">
            <button className="action-button" aria-label="Archive">
              <HiOutlineArchive size={18} />
            </button>
            <button className="action-button" aria-label="Delete">
              <HiOutlineTrash size={18} />
            </button>
            <button className="action-button" aria-label="Mark as read">
              <HiOutlineMailOpen size={18} />
            </button>
            <button className="action-button" aria-label="Snooze">
              <HiOutlineClock size={18} />
            </button>
          </div>
        ) : (
          <>
            {email.labels && email.labels.length > 0 && (
              <div className="email-labels">
                {email.labels.slice(0, 1).map((label) => (
                  <span key={label} className="email-label">{label}</span>
                ))}
              </div>
            )}
            <span className={`email-date ${!email.read ? 'unread' : ''}`}>
              {email.date}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

