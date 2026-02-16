'use client';

import { 
  HiOutlineInbox, 
  HiOutlineStar, 
  HiOutlineClock,
  HiOutlineExclamation,
  HiOutlinePaperAirplane,
  HiOutlineDocumentText,
  HiOutlineChevronDown,
  HiOutlineChevronRight,
  HiOutlinePlus
} from 'react-icons/hi';
import { MdLabelImportantOutline, MdOutlineScheduleSend } from 'react-icons/md';
import { sidebarLabels, portfolioEmails } from '../data/portfolioData';

interface SidebarProps {
  isOpen: boolean;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function Sidebar({ isOpen, activeFilter, onFilterChange }: SidebarProps) {
  const inboxCount = portfolioEmails.filter(e => !e.read).length;
  const starredCount = portfolioEmails.filter(e => e.starred).length;

  const navItems = [
    { id: 'inbox', icon: HiOutlineInbox, label: 'Inbox', count: inboxCount },
    { id: 'starred', icon: HiOutlineStar, label: 'Starred', count: starredCount },
    { id: 'snoozed', icon: HiOutlineClock, label: 'Snoozed', count: null },
    { id: 'important', icon: MdLabelImportantOutline, label: 'Important', count: null },
    { id: 'sent', icon: HiOutlinePaperAirplane, label: 'Sent', count: null },
    { id: 'drafts', icon: HiOutlineDocumentText, label: 'Drafts', count: 24 },
  ];

  const moreItems = [
    { id: 'scheduled', icon: MdOutlineScheduleSend, label: 'Scheduled', count: null },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      <button className="compose-button">
        <HiOutlinePlus size={20} />
        {isOpen && <span>Compose</span>}
      </button>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeFilter === item.id ? 'active' : ''}`}
            onClick={() => onFilterChange(item.id)}
          >
            <item.icon size={20} />
            {isOpen && (
              <>
                <span className="nav-label">{item.label}</span>
                {item.count !== null && item.count > 0 && (
                  <span className="nav-count">{item.count}</span>
                )}
              </>
            )}
          </button>
        ))}

        <div className="nav-divider" />

        <button className="nav-item more-button">
          <HiOutlineChevronDown size={20} />
          {isOpen && <span className="nav-label">More</span>}
        </button>

        {isOpen && (
          <>
            <div className="nav-divider" />
            
            <div className="labels-section">
              <div className="labels-header">
                <span>Labels</span>
                <button className="labels-add-button">
                  <HiOutlinePlus size={16} />
                </button>
              </div>
              
              {sidebarLabels.map((label) => (
                <button
                  key={label.name}
                  className={`nav-item label-item ${activeFilter === label.name.toLowerCase() ? 'active' : ''}`}
                  onClick={() => onFilterChange(label.name.toLowerCase())}
                >
                  <span 
                    className="label-dot" 
                    style={{ backgroundColor: label.color }}
                  />
                  <span className="nav-label">{label.name}</span>
                  <span className="nav-count">{label.count}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </nav>
    </aside>
  );
}

