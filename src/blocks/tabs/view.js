/**
 * Tabs Block View Script
 * Handles accessible tab functionality including keyboard navigation and ARIA attributes
 */

window.addEventListener('DOMContentLoaded', function () {
  const tabContainers = document.querySelectorAll('[data-tab-component="true"]');

  if (!tabContainers.length) {
    return;
  }

  tabContainers.forEach((container) => {
    initializeTabs(container);
  });

  /**
   * Initialize a single tabs component
   * @param {HTMLElement} container The tabs container element
   */
  function initializeTabs(container) {
    // Collect all tab items (li elements) and panels (section elements)
    const tabItems = Array.from(container.querySelectorAll('.tab-item'));
    const tabPanels = Array.from(container.querySelectorAll('.tab-panel'));

    if (tabItems.length === 0 || tabPanels.length === 0) {
      return;
    }

    // Assign indices and IDs to all elements
    tabItems.forEach((item, index) => {
      item.setAttribute('data-tab-index', index);
      const link = item.querySelector('.tab-link');
      if (link) {
        link.href = `#section-${index}`;
      }
    });

    tabPanels.forEach((panel, index) => {
      panel.id = `section-${index}`;
      panel.setAttribute('data-tab-index', index);
    });

    // Create tab list wrapper if it doesn't exist
    let tabList = container.querySelector('.tab-list');
    if (!tabList) {
      tabList = document.createElement('ul');
      tabList.className = 'tab-list';
      tabList.setAttribute('role', 'tablist');

      // Move all tab items into the list
      tabItems.forEach((item) => {
        tabList.appendChild(item);
      });

      // Insert tab list at the beginning of the container
      container.insertBefore(tabList, container.firstChild);
    }

    // Set up ARIA roles and attributes
    setupAriaAttributes(tabList, tabPanels);

    // Set initial active tab
    setActiveTab(0, tabList, tabPanels);

    // Add event listeners for tab clicks
    tabList.addEventListener('click', (e) => {
      const link = e.target.closest('.tab-link');
      if (!link) return;

      e.preventDefault();
      const tabItem = link.closest('.tab-item');
      const index = parseInt(tabItem.getAttribute('data-tab-index'), 10);
      setActiveTab(index, tabList, tabPanels);
      link.focus();
    });

    // Add keyboard navigation
    tabList.addEventListener('keydown', (e) => {
      const currentLink = e.target.closest('.tab-link');
      if (!currentLink) return;

      let nextIndex;
      const tabLinks = Array.from(tabList.querySelectorAll('.tab-link'));
      const currentIndex = tabLinks.indexOf(currentLink);
      const orientation = container.getAttribute('data-tab-orientation') || 'horizontal';

      // Determine which key triggers navigation based on orientation
      const isHorizontal = orientation === 'horizontal';
      const leftKey = 'ArrowLeft';
      const rightKey = 'ArrowRight';
      const upKey = 'ArrowUp';
      const downKey = 'ArrowDown';

      if (isHorizontal && (e.key === leftKey || e.key === rightKey)) {
        e.preventDefault();
        if (e.key === leftKey) {
          nextIndex = currentIndex === 0 ? tabLinks.length - 1 : currentIndex - 1;
        } else {
          nextIndex = currentIndex === tabLinks.length - 1 ? 0 : currentIndex + 1;
        }
        setActiveTab(nextIndex, tabList, tabPanels);
        tabLinks[nextIndex].focus();
      } else if (!isHorizontal && (e.key === upKey || e.key === downKey)) {
        e.preventDefault();
        if (e.key === upKey) {
          nextIndex = currentIndex === 0 ? tabLinks.length - 1 : currentIndex - 1;
        } else {
          nextIndex = currentIndex === tabLinks.length - 1 ? 0 : currentIndex + 1;
        }
        setActiveTab(nextIndex, tabList, tabPanels);
        tabLinks[nextIndex].focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        setActiveTab(0, tabList, tabPanels);
        tabLinks[0].focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        const lastIndex = tabLinks.length - 1;
        setActiveTab(lastIndex, tabList, tabPanels);
        tabLinks[lastIndex].focus();
      }
    });
  }

  /**
   * Set up ARIA roles and attributes for accessibility
   * @param {HTMLElement} tabList The ul.tab-list element
   * @param {Array<HTMLElement>} tabPanels Array of section.tab-panel elements
   */
  function setupAriaAttributes(tabList, tabPanels) {
    const tabItems = tabList.querySelectorAll('.tab-item');

    tabItems.forEach((item, index) => {
      item.setAttribute('role', 'presentation');

      const link = item.querySelector('.tab-link');
      if (link) {
        link.setAttribute('role', 'tab');
        link.setAttribute('aria-selected', 'false');
        link.setAttribute('aria-controls', `section-${index}`);
        link.setAttribute('tabindex', '-1');
      }
    });

    tabPanels.forEach((panel, index) => {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', `tab-${index}`);
      panel.setAttribute('aria-hidden', 'true');
    });
  }

  /**
   * Set the active tab and update all ARIA attributes
   * @param {number} index The index of the tab to activate
   * @param {HTMLElement} tabList The ul.tab-list element
   * @param {Array<HTMLElement>} tabPanels Array of section.tab-panel elements
   */
  function setActiveTab(index, tabList, tabPanels) {
    const tabItems = tabList.querySelectorAll('.tab-item');
    const tabLinks = tabList.querySelectorAll('.tab-link');

    // Remove active state from all items
    tabItems.forEach((item) => {
      item.removeAttribute('data-tab-active');
    });

    tabLinks.forEach((link) => {
      link.setAttribute('aria-selected', 'false');
      link.setAttribute('tabindex', '-1');
    });

    tabPanels.forEach((panel) => {
      panel.setAttribute('aria-hidden', 'true');
    });

    // Set active state on selected tab
    const activeItem = tabItems[index];
    if (activeItem) {
      activeItem.setAttribute('data-tab-active', '');
      const activeLink = activeItem.querySelector('.tab-link');
      if (activeLink) {
        activeLink.setAttribute('aria-selected', 'true');
        activeLink.setAttribute('tabindex', '0');
      }
    }

    // Show selected panel
    if (tabPanels[index]) {
      tabPanels[index].setAttribute('aria-hidden', 'false');
    }
  }
});
