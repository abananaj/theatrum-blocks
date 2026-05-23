/**
 * Tabs block — frontend interactivity.
 *
 * Handles two modes based on a configurable breakpoint:
 *   Desktop  → ARIA tabs pattern (tablist nav + one visible panel at a time).
 *   Mobile   → Accordion pattern (inline headings toggle adjacent panels).
 *
 * The tablist is generated from the DOM so the server-side markup stays simple.
 */
(function () {
  'use strict';

  /**
   * Initialise one tabs container.
   *
   * @param {HTMLElement} container
   */
  function initTabs(container) {
    const autoclose =
      container.dataset.tabsAutoclose === 'true';
    const initialTab = parseInt(
      container.dataset.tabsInitial || '0',
      10
    );
    const breakpoint = parseInt(
      container.dataset.tabsBreakpoint || '768',
      10
    );

    /** @type {HTMLElement[]} */
    const items = Array.from(
      container.querySelectorAll(
        ':scope > .wp-block-chance-production-tab-item'
      )
    );

    if (!items.length) return;

    // --- Generate unique ID prefix for ARIA relationships ------------- //
    const uid =
      'ct-tabs-' + Math.random().toString(36).slice(2, 9);

    // Snapshot initial open-by-default state (set via save.js class).
    const openByDefault = items.map((item) =>
      item.classList.contains('is-open')
    );

    // --- Build the tab nav list --------------------------------------- //
    const tablist = document.createElement('div');
    tablist.className =
      'wp-block-chance-production-tabs__tablist';
    tablist.setAttribute('role', 'tablist');

    /** @type {HTMLButtonElement[]} */
    const tabBtns = [];

    items.forEach((item, i) => {
      const panelId = uid + '-panel-' + i;
      const navTabId = uid + '-nav-' + i;
      const headingToggleId = uid + '-heading-' + i;

      const toggle = item.querySelector(
        '.wp-block-chance-production-tab-item__toggle'
      );
      const panel = item.querySelector(
        '.wp-block-chance-production-tab-item__panel'
      );
      const titleEl = item.querySelector(
        '.wp-block-chance-production-tab-item__title'
      );

      if (!toggle || !panel) return;

      // Set stable IDs for ARIA.
      toggle.id = headingToggleId;
      panel.id = panelId;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('tabindex', '0');

      // Create nav-tab button.
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.id = navTabId;
      btn.className = 'wp-block-chance-production-tabs__tab';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-controls', panelId);
      btn.innerHTML = titleEl
        ? titleEl.innerHTML
        : 'Tab ' + (i + 1);

      tabBtns.push(btn);
      tablist.appendChild(btn);

      // Panel is labelled by its nav-tab button in tab mode;
      // by the accordion heading button in accordion mode.
      // We set aria-labelledby dynamically when switching modes.

      // Wire up accordion toggle.
      toggle.setAttribute('aria-controls', panelId);
      toggle.setAttribute('aria-expanded', 'false');
      toggle.addEventListener('click', () =>
        toggleAccordion(i)
      );

      // Wire up tab button.
      btn.addEventListener('click', () => activateTab(i));
    });

    // Keyboard navigation inside the tablist (ARIA tabs pattern).
    tablist.addEventListener('keydown', (e) => {
      if (isMobile) return;
      const focused = tabBtns.indexOf(
        document.activeElement
      );
      if (focused < 0) return;

      let target = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        target = (focused + 1) % tabBtns.length;
      } else if (
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowUp'
      ) {
        target =
          (focused - 1 + tabBtns.length) %
          tabBtns.length;
      } else if (e.key === 'Home') {
        target = 0;
      } else if (e.key === 'End') {
        target = tabBtns.length - 1;
      }

      if (target >= 0) {
        e.preventDefault();
        activateTab(target);
        tabBtns[target].focus();
      }
    });

    container.prepend(tablist);

    // ------------------------------------------------------------------ //
    // State
    // ------------------------------------------------------------------ //
    let isMobile = false;
    let activeIndex = Math.min(initialTab, items.length - 1);

    // ------------------------------------------------------------------ //
    // Tab mode helpers
    // ------------------------------------------------------------------ //

    /**
     * Activate one tab (desktop mode).
     *
     * @param {number} index
     */
    function activateTab(index) {
      activeIndex = index;
      items.forEach((item, i) => {
        const panel = item.querySelector(
          '.wp-block-chance-production-tab-item__panel'
        );
        const active = i === index;

        if (tabBtns[i]) {
          tabBtns[i].setAttribute(
            'aria-selected',
            active ? 'true' : 'false'
          );
          tabBtns[i].tabIndex = active ? 0 : -1;
          tabBtns[i].classList.toggle(
            'is-active',
            active
          );
        }

        item.classList.toggle('is-active', active);

        if (panel) {
          panel.classList.toggle('is-active', active);
          if (active) {
            panel.removeAttribute('hidden');
          } else {
            panel.setAttribute('hidden', '');
          }
        }
      });
    }

    // ------------------------------------------------------------------ //
    // Accordion mode helpers
    // ------------------------------------------------------------------ //

    /**
     * Toggle one accordion item (mobile mode).
     *
     * @param {number} index
     */
    function toggleAccordion(index) {
      const item = items[index];
      if (!item) return;

      const panel = item.querySelector(
        '.wp-block-chance-production-tab-item__panel'
      );
      const toggle = item.querySelector(
        '.wp-block-chance-production-tab-item__toggle'
      );
      const wasOpen = item.classList.contains('is-open');

      if (autoclose) {
        // Close all items first.
        items.forEach((it) => {
          const p = it.querySelector(
            '.wp-block-chance-production-tab-item__panel'
          );
          const t = it.querySelector(
            '.wp-block-chance-production-tab-item__toggle'
          );
          it.classList.remove('is-open');
          t?.setAttribute('aria-expanded', 'false');
          if (p) p.setAttribute('hidden', '');
        });

        // Open the clicked item only if it was closed.
        if (!wasOpen) {
          item.classList.add('is-open');
          toggle?.setAttribute('aria-expanded', 'true');
          if (panel) panel.removeAttribute('hidden');
        }
      } else {
        const open = !wasOpen;
        item.classList.toggle('is-open', open);
        toggle?.setAttribute(
          'aria-expanded',
          open ? 'true' : 'false'
        );
        if (panel) {
          if (open) {
            panel.removeAttribute('hidden');
          } else {
            panel.setAttribute('hidden', '');
          }
        }
      }
    }

    // ------------------------------------------------------------------ //
    // Mode switching
    // ------------------------------------------------------------------ //

    function enterTabMode() {
      isMobile = false;
      container.classList.remove('is-accordion-mode');
      container.classList.add('is-tab-mode');

      tablist.removeAttribute('hidden');
      tablist.removeAttribute('aria-hidden');

      // Hide accordion headings from assistive tech.
      items.forEach((item) => {
        const heading = item.querySelector(
          '.wp-block-chance-production-tab-item__heading'
        );
        const panel = item.querySelector(
          '.wp-block-chance-production-tab-item__panel'
        );
        heading?.setAttribute('aria-hidden', 'true');
        item.classList.remove('is-open');

        // Tab panel is labelled by the nav-tab button in this mode.
        if (panel) {
          panel.setAttribute(
            'aria-labelledby',
            uid + '-nav-' + items.indexOf(item)
          );
        }
      });

      activateTab(activeIndex);
    }

    function enterAccordionMode() {
      isMobile = true;
      container.classList.remove('is-tab-mode');
      container.classList.add('is-accordion-mode');

      tablist.setAttribute('hidden', '');
      tablist.setAttribute('aria-hidden', 'true');

      // Restore accordion headings and reset panel visibility.
      items.forEach((item, i) => {
        const heading = item.querySelector(
          '.wp-block-chance-production-tab-item__heading'
        );
        const panel = item.querySelector(
          '.wp-block-chance-production-tab-item__panel'
        );
        const toggle = item.querySelector(
          '.wp-block-chance-production-tab-item__toggle'
        );

        heading?.removeAttribute('aria-hidden');

        // Panel is labelled by its adjacent accordion heading.
        if (panel) {
          panel.setAttribute(
            'aria-labelledby',
            uid + '-heading-' + i
          );
        }

        item.classList.remove('is-active');
        panel?.classList.remove('is-active');

        // Restore per-item open-by-default state.
        const shouldOpen = openByDefault[i];
        item.classList.toggle('is-open', shouldOpen);
        toggle?.setAttribute(
          'aria-expanded',
          shouldOpen ? 'true' : 'false'
        );
        if (panel) {
          if (shouldOpen) {
            panel.removeAttribute('hidden');
          } else {
            panel.setAttribute('hidden', '');
          }
        }
      });
    }

    // ------------------------------------------------------------------ //
    // Media query listener
    // ------------------------------------------------------------------ //
    const mq = window.matchMedia(
      '(max-width: ' + breakpoint + 'px)'
    );

    function handleMQ(e) {
      if (e.matches) {
        enterAccordionMode();
      } else {
        enterTabMode();
      }
    }

    // Apply initial mode.
    handleMQ(mq);

    if (mq.addEventListener) {
      mq.addEventListener('change', handleMQ);
    } else {
      // Safari < 14 fallback.
      mq.addListener(handleMQ);
    }
  }

  // -------------------------------------------------------------------- //
  // Bootstrap
  // -------------------------------------------------------------------- //
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      document
        .querySelectorAll(
          '.wp-block-chance-production-tabs'
        )
        .forEach(initTabs);
    });
  } else {
    document
      .querySelectorAll('.wp-block-chance-production-tabs')
      .forEach(initTabs);
  }
})();
