/**
 * BusOnlineTicket — Main JavaScript (Vanilla JS)
 * Handles: Mobile nav, Modal, Route swap, Trip tabs, Form states, Toast
 */

(function () {
  'use strict';

  /* ============================
     DOM Utilities
     ============================ */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ============================
     Mobile Navigation
     ============================ */
  const menuToggle = $('.menu-toggle');
  const navLinks = $('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      navLinks.classList.toggle('is-open');
    });

    // Close menu when clicking a nav link
    $$('.nav-link', navLinks).forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('is-open');
      });
    });
  }

  /* ============================
     Modal System
     ============================ */
  const openModal = (id) => {
    const backdrop = $(`#${id}`);
    if (!backdrop) return;
    backdrop.classList.add('is-open');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    // Focus first focusable element inside modal
    const focusable = backdrop.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus();
  };

  const closeModal = (backdrop) => {
    backdrop.classList.remove('is-open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
  };

  $$('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.openModal));
  });

  $$('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const backdrop = btn.closest('.modal-backdrop');
      if (backdrop) closeModal(backdrop);
    });
  });

  // Close modal on backdrop click or Escape key
  $$('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal(backdrop);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const open = $('.modal-backdrop.is-open');
      if (open) closeModal(open);
    }
  });

  /* ============================
     Trip Type Tabs (One-way / Round-trip)
     ============================ */
  const tabBtns = $$('.tab-btn');
  const returnField = $('[data-return-field]');
  const returnInput = $('#return-date');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const type = btn.dataset.tripType;
      if (type === 'roundtrip') {
        returnInput && (returnInput.disabled = false);
        returnField && returnField.classList.remove('is-disabled');
      } else {
        returnInput && (returnInput.disabled = true, returnInput.value = '');
        returnField && returnField.classList.add('is-disabled');
      }
    });
  });

  /* ============================
     Route Swap (Origin <-> Destination)
     ============================ */
  const swapBtn = $('[data-swap-route]');
  const originSelect = $('#origin');
  const destSelect = $('#destination');

  if (swapBtn && originSelect && destSelect) {
    swapBtn.addEventListener('click', () => {
      const temp = originSelect.value;
      originSelect.value = destSelect.value;
      destSelect.value = temp;
      // Visual feedback
      swapBtn.style.transform = 'rotate(180deg)';
      setTimeout(() => swapBtn.style.transform = '', 250);
    });
  }

  /* ============================
     Form Validation & Feedback
     ============================ */
  const searchForm = $('.search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      const origin = $('#origin');
      const dest = $('#destination');
      const depart = $('#depart-date');

      if (!origin || !origin.value) {
        e.preventDefault();
        showToast('กรุณาเลือกต้นทาง', 'error');
        origin && origin.focus();
        return;
      }
      if (!dest || !dest.value) {
        e.preventDefault();
        showToast('กรุณาเลือกปลายทาง', 'error');
        dest && dest.focus();
        return;
      }
      if (origin && dest && origin.value === dest.value) {
        e.preventDefault();
        showToast('ต้นทางและปลายทางต้องไม่เหมือนกัน', 'error');
        return;
      }
      if (!depart || !depart.value) {
        e.preventDefault();
        showToast('กรุณาเลือกวันที่เดินทาง', 'error');
        depart && depart.focus();
        return;
      }

      // Simulate loading state on submit button
      const submitBtn = searchForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner" style="width:18px;height:18px;border-width:2px;margin-right:6px"></span> กำลังค้นหา...';
      }
    });
  }

  /* ============================
     Set Default Departure Date (tomorrow)
     ============================ */
  const departDate = $('#depart-date');
  if (departDate) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    departDate.value = tomorrow.toISOString().split('T')[0];
  }

  /* ============================
     Toast Notification System
     ============================ */
  const toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  toastContainer.setAttribute('aria-live', 'polite');
  toastContainer.setAttribute('aria-atomic', 'true');
  document.body.appendChild(toastContainer);

  window.showToast = function (message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  };

  /* ============================
     Copy to Clipboard Utility
     ============================ */
  window.copyToClipboard = function (text, label = 'คัดลอกสำเร็จ') {
    navigator.clipboard.writeText(text).then(() => {
      showToast(label, 'success');
    }).catch(() => {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast(label, 'success');
    });
  };

  /* ============================
     Smooth Scroll for Anchors
     ============================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
