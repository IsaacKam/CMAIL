'use client';

import { 
  HiOutlineCalendar, 
  HiOutlineClipboardList,
  HiOutlineUserCircle,
  HiOutlinePlus
} from 'react-icons/hi';

export default function RightSidebar() {
  const apps = [
    { icon: HiOutlineCalendar, label: 'Calendar', color: '#4285f4' },
    { icon: HiOutlineClipboardList, label: 'Keep', color: '#fbbc04' },
    { icon: HiOutlineUserCircle, label: 'Contacts', color: '#4285f4' },
  ];

  return (
    <aside className="right-sidebar">
      {apps.map((app, index) => (
        <button 
          key={index}
          className="right-sidebar-button"
          aria-label={app.label}
          title={app.label}
        >
          <app.icon size={20} />
        </button>
      ))}
      
      <div className="right-sidebar-divider" />
      
      <button 
        className="right-sidebar-button add-button"
        aria-label="Get add-ons"
        title="Get add-ons"
      >
        <HiOutlinePlus size={20} />
      </button>
    </aside>
  );
}

