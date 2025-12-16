'use client';

import { useState } from 'react';
import { 
  HiOutlineMenu, 
  HiOutlineSearch, 
  HiOutlineCog, 
  HiOutlineViewGrid,
  HiOutlineQuestionMarkCircle
} from 'react-icons/hi';
import { MdOutlineTune } from 'react-icons/md';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onMenuClick: () => void;
}

export default function Header({ searchQuery, onSearchChange, onMenuClick }: HeaderProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="header">
      <div className="header-left">
        <button 
          className="icon-button menu-button"
          onClick={onMenuClick}
          aria-label="Main menu"
        >
          <HiOutlineMenu size={20} />
        </button>
        
        <div className="logo">
          <svg viewBox="0 0 75 24" className="gmail-logo" preserveAspectRatio="xMidYMid meet">
            <g fill="none">
              <path fill="#EA4335" d="M0 5.5V18.5C0 19.88 1.12 21 2.5 21H4V8.71L9 12.36L9.03 12.38C9.28 12.57 9.59 12.68 9.92 12.68C10.25 12.68 10.56 12.57 10.81 12.38L10.84 12.36L15.84 8.71V21H17.34C18.72 21 19.84 19.88 19.84 18.5V5.5C19.84 3.57 17.77 2.4 16.13 3.41L9.92 7.93L3.71 3.41C2.07 2.4 0 3.57 0 5.5Z"/>
            </g>
          </svg>
          <span className="logo-text">Cmail</span>
        </div>
      </div>

      <div className={`search-container ${isSearchFocused ? 'focused' : ''}`}>
        <div className="search-box">
          <button className="search-icon-button" aria-label="Search">
            <HiOutlineSearch size={20} />
          </button>
          <input
            type="text"
            className="search-input"
            placeholder="Search portfolio"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          <button className="search-options-button" aria-label="Search options">
            <MdOutlineTune size={20} />
          </button>
        </div>
      </div>

      <div className="header-right">
        <button className="icon-button" aria-label="Support">
          <HiOutlineQuestionMarkCircle size={20} />
        </button>
        <button className="icon-button" aria-label="Settings">
          <HiOutlineCog size={20} />
        </button>
        <button className="icon-button" aria-label="Google apps">
          <HiOutlineViewGrid size={20} />
        </button>
        <button className="avatar-button" aria-label="Camila Spokojny">
          <div className="avatar">CS</div>
        </button>
      </div>
    </header>
  );
}

