/**
 * Accessible Toast Notifications Component
 */

export function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  if (type === 'success') {
    toast.style.background = 'var(--color-primary)';
    toast.style.borderColor = 'var(--color-gold)';
  } else if (type === 'warning') {
    toast.style.background = 'var(--color-warning)';
  }

  toast.innerHTML = `
    <span>${type === 'success' ? '🙏' : '🔔'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
