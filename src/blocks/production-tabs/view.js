/**
 * Front-end behavior for the Production Tabs block.
 *
 * Desktop: the tab headers sit in a row and clicking one swaps the visible
 * panel (via CSS flex `order`, see style.scss). Mobile: the same markup reads
 * as a vertical accordion where the active header's panel is the one shown.
 *
 * The active state is identical in both layouts — only one tab/panel is active
 * at a time — so a single click handler drives both.
 */
window.addEventListener('load', () => {
	const groups = document.querySelectorAll('.ct-production-tabs');

	for (const group of groups) {
		const items = Array.from(
			group.querySelectorAll(':scope > .ct-tab')
		);

		const parts = items
			.map((item) => ({
				header: item.querySelector('.ct-tab__header'),
				panel: item.querySelector('.ct-tab__panel'),
			}))
			.filter((part) => part.header && part.panel);

		if (!parts.length) {
			continue;
		}

		const activate = (index) => {
			parts.forEach((part, i) => {
				const isActive = i === index;
				part.header.classList.toggle('is-active', isActive);
				part.header.setAttribute(
					'aria-expanded',
					isActive ? 'true' : 'false'
				);
				part.panel.classList.toggle('is-active', isActive);
			});
		};

		parts.forEach((part, i) => {
			part.header.setAttribute('aria-expanded', 'false');
			part.header.addEventListener('click', () => activate(i));
		});

		// Hand control to JS: the CSS "first panel open" fallback stops
		// applying once this class is present, avoiding a flash of two panels.
		group.classList.add('is-ready');
		activate(0);
	}
});
