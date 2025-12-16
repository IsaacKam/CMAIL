'use client';

import { useState, useMemo } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import EmailList from './components/EmailList';
import EmailViewer from './components/EmailViewer';
import RightSidebar from './components/RightSidebar';
import { portfolioEmails, Email } from './data/portfolioData';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('inbox');
  const [activeCategory, setActiveCategory] = useState('primary');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  const filteredEmails = useMemo(() => {
    let emails = [...portfolioEmails];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      emails = emails.filter(email => 
        email.sender.toLowerCase().includes(query) ||
        email.subject.toLowerCase().includes(query) ||
        email.snippet.toLowerCase().includes(query) ||
        email.body.toLowerCase().includes(query)
      );
    }

    // Apply sidebar filter
    switch (activeFilter) {
      case 'starred':
        emails = emails.filter(e => e.starred);
        break;
      case 'important':
        emails = emails.filter(e => e.important);
        break;
      case 'work':
        emails = emails.filter(e => e.labels?.includes('Work'));
        break;
      case 'projects':
        emails = emails.filter(e => e.labels?.includes('Projects'));
        break;
      case 'education':
        emails = emails.filter(e => e.labels?.includes('Education'));
        break;
      case 'skills':
        emails = emails.filter(e => e.labels?.includes('Skills'));
        break;
      case 'about':
        emails = emails.filter(e => e.labels?.includes('About'));
        break;
      case 'contact':
        emails = emails.filter(e => e.labels?.includes('Contact'));
        break;
      default:
        // inbox shows all
        break;
    }

    return emails;
  }, [searchQuery, activeFilter]);

  const handleEmailSelect = (email: Email) => {
    setSelectedEmail(email);
  };

  const handleBackToList = () => {
    setSelectedEmail(null);
  };

  return (
    <div className="app">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="main-container">
        <Sidebar 
          isOpen={sidebarOpen}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        
        <main className="main-content">
          {selectedEmail ? (
            <EmailViewer 
              email={selectedEmail}
              onBack={handleBackToList}
            />
          ) : (
            <EmailList 
              emails={filteredEmails}
              selectedEmailId={selectedEmail?.id || null}
              onEmailSelect={handleEmailSelect}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          )}
        </main>

        <RightSidebar />
      </div>
    </div>
  );
}
