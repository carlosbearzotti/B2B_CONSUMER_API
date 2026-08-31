/**
 * Gerenciador de Modais
 */
export const modal = {
  open(modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.add('active');
  },

  close(modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.remove('active');
  },

  init() {
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-modal-close]') || e.target.classList.contains('modal-backdrop')) {
        const backdrop = e.target.closest('.modal-backdrop');
        if (backdrop) backdrop.classList.remove('active');
      }
    });
  }
};
