'use client';

import { useState } from 'react';
import { 
  HiOutlineRefresh, 
  HiOutlineDotsVertical,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineInbox,
  HiOutlineTag,
  HiOutlineUserGroup,
  HiOutlineInformationCircle
} from 'react-icons/hi';
import { Email, categoryTabs } from '../data/portfolioData';
import EmailItem from './EmailItem';

interface EmailListProps {
  emails: Email[];
  selectedEmailId: string | null;
  onEmailSelect: (email: Email) => void;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categoryIcons: Record<string, React.ComponentType<{ size: number; className?: string }>> = {
  primary: HiOutlineInbox,
  promotions: HiOutlineTag,
  social: HiOutlineUserGroup,
  updates: HiOutlineInformationCircle,
};

export default function EmailList({ 
  emails, 
  selectedEmailId, 
  onEmailSelect, 
  activeCategory,
  onCategoryChange 
}: EmailListProps) {
  const [isAllChecked, setIsAllChecked] = useState(false);

  const filteredEmails = activeCategory === 'all' 
    ? emails 
    : emails.filter(e => e.category === activeCategory);

  const unreadCounts: Record<string, number> = {
    primary: emails.filter(e => e.category === 'primary' && !e.read).length,
    promotions: emails.filter(e => e.category === 'promotions' && !e.read).length,
    social: emails.filter(e => e.category === 'social' && !e.read).length,
    updates: emails.filter(e => e.category === 'updates' && !e.read).length,
  };

  return (
    <div className="email-list-container">
      <div className="email-list-toolbar">
        <div className="toolbar-left">
          <div className="checkbox-dropdown">
            <input 
              type="checkbox" 
              checked={isAllChecked}
              onChange={(e) => setIsAllChecked(e.target.checked)}
              className="toolbar-checkbox"
            />
            <button className="dropdown-arrow">▾</button>
          </div>
          
          <button className="toolbar-button" aria-label="Refresh">
            <HiOutlineRefresh size={18} />
          </button>
          
          <button className="toolbar-button" aria-label="More">
            <HiOutlineDotsVertical size={18} />
          </button>
        </div>

        <div className="toolbar-right">
          <span className="pagination-info">
            1–{filteredEmails.length} of {emails.length}
          </span>
          <button className="toolbar-button" aria-label="Newer" disabled>
            <HiOutlineChevronLeft size={18} />
          </button>
          <button className="toolbar-button" aria-label="Older" disabled>
            <HiOutlineChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="category-tabs">
        {categoryTabs.map((tab) => {
          const IconComponent = categoryIcons[tab.id];
          const count = unreadCounts[tab.id];
          
          return (
            <button
              key={tab.id}
              className={`category-tab ${activeCategory === tab.id ? 'active' : ''}`}
              onClick={() => onCategoryChange(tab.id)}
            >
              <IconComponent size={18} className="tab-icon" />
              <span className="tab-label">{tab.name}</span>
              {count > 0 && (
                <span className="tab-count">{count} new</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="email-list">
        {filteredEmails.length === 0 ? (
          <div className="empty-state">
            <HiOutlineInbox size={48} />
            <p>No emails in this category</p>
          </div>
        ) : (
          filteredEmails.map((email) => (
            <EmailItem
              key={email.id}
              email={email}
              isSelected={selectedEmailId === email.id}
              onClick={() => onEmailSelect(email)}
            />
          ))
        )}
      </div>
    </div>
  );
}

