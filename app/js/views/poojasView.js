/**
 * Poojas View — All Sevas, Categorized & Searchable
 */

import { templeStore } from '../services/store.js';

export function renderPoojasView(selectedCategory = 'all', searchQuery = '') {
  let sevas = templeStore.getSevas();

  if (selectedCategory !== 'all') {
    sevas = sevas.filter(s => s.category === selectedCategory);
  }

  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase();
    sevas = sevas.filter(s => 
      s.name.toLowerCase().includes(q) || 
      (s.kannadaName && s.kannadaName.toLowerCase().includes(q)) ||
      s.description.toLowerCase().includes(q)
    );
  }

  const categories = [
    { id: 'all', label: 'All Sevas (21)' },
    { id: 'homa', label: 'Homas 🔥' },
    { id: 'abhisheka', label: 'Abhisheka 🥛' },
    { id: 'archana', label: 'Archana 🌺' },
    { id: 'vahana', label: 'Vehicle Pooja 🚗' },
    { id: 'special', label: 'Special Rituals 🪔' }
  ];

  return `
    <div class="view-poojas">
      <div style="margin-bottom: 12px;">
        <h2 style="font-family: var(--font-serif); font-size: 1.35rem; color: var(--color-primary); font-weight: 700;">
          Temple Sevas & Homas
        </h2>
        <p style="font-size: 0.85rem; color: var(--color-text-soft);">
          Authentic offerings at Sri Durga Parameshwari Sannidhi
        </p>
      </div>

      <!-- Search Input -->
      <div class="form-group" style="margin-bottom: 12px;">
        <input 
          type="text" 
          id="seva-search-input" 
          class="form-control" 
          placeholder="🔍 Search seva name (e.g. Durga Homa, Archana...)" 
          value="${searchQuery}"
          style="min-height: 46px; border-radius: var(--radius-pill); font-size: 0.9rem;"
        />
      </div>

      <!-- Category Filter Chips -->
      <div class="chips-row" style="margin-bottom: 16px;">
        ${categories.map(c => `
          <button 
            class="chip ${selectedCategory === c.id ? 'active' : ''}" 
            onclick="window.app.filterSevaCategory('${c.id}')"
          >
            ${c.label}
          </button>
        `).join('')}
      </div>

      <!-- Seva Count -->
      <div style="font-size: 0.8rem; color: var(--color-text-soft); margin-bottom: 10px; font-weight: 600;">
        Showing ${sevas.length} Sevas
      </div>

      <!-- Sevas Cards List -->
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${sevas.length === 0 ? `
          <div class="card" style="text-align: center; padding: 24px;">
            <p style="color: var(--color-text-muted);">No sevas found matching your search.</p>
            <button class="btn btn-secondary btn-sm" style="margin-top: 10px;" onclick="window.app.filterSevaCategory('all')">
              Reset Filters
            </button>
          </div>
        ` : sevas.map(s => `
          <div class="card" style="padding: 14px; cursor: pointer;" onclick="window.app.viewPooja('${s.id}')">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
              <span class="badge ${s.isSpecial ? 'badge-saffron' : 'badge-gold'}">
                ${s.badgeText || s.category.toUpperCase()}
              </span>
              <div class="num-tabular" style="font-size: 1.15rem; font-weight: 800; color: var(--color-primary);">
                ₹${s.kanike.toLocaleString('en-IN')}
              </div>
            </div>

            <h3 style="font-family: var(--font-serif); font-size: 1.1rem; color: var(--color-primary); font-weight: 700; margin-bottom: 2px;">
              ${s.name}
            </h3>
            <p style="font-size: 0.85rem; color: var(--color-gold-hover); font-weight: 600; margin-bottom: 6px;">
              ${s.kannadaName || ''}
            </p>
            <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 10px; line-height: 1.4;">
              ${s.description}
            </p>

            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--color-border-subtle); padding-top: 8px; font-size: 0.8rem; color: var(--color-text-soft);">
              <span>⏱️ ${s.durationMinutes} mins • 📍 ${s.sanctumLocation.split(' ')[0]}</span>
              <span style="color: var(--color-primary); font-weight: 700;">Details & Dates →</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
