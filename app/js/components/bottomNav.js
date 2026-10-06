/**
 * Persistent 5-Tab Mobile Bottom Navigation Component
 */

export function renderBottomNav(activeTab = 'home') {
  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
    },
    {
      id: 'poojas',
      label: 'Poojas',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2c1.5 2 3.5 3.5 3.5 6a3.5 3.5 0 0 1-7 0c0-2.5 2-4 3.5-6z"/><path d="M5 16c0 3 3 5 7 5s7-2 7-5H5z"/></svg>`
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`
    },
    {
      id: 'panchanga',
      label: 'Panchanga',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
    },
    {
      id: 'more',
      label: 'Temple Desk',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>`
    }
  ];

  return `
    <nav class="bottom-nav" role="navigation" aria-label="Bottom Navigation">
      ${tabs.map(tab => `
        <button class="nav-item ${activeTab === tab.id ? 'active' : ''}" data-tab="${tab.id}" aria-label="${tab.label}">
          ${tab.icon}
          <span>${tab.label}</span>
        </button>
      `).join('')}
    </nav>
  `;
}
