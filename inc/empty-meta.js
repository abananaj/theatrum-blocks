const metavalue = document.querySelector( '.wp-block-chance-site-option' );
const metaheading = document.querySelector( '.chance-site-option-heading' );

// Select the first link
const optionValue = document.querySelector( '.first-link' );
const showChildrenBtn = document.getElementById( 'showChildrenBtn' );
const showSiblingsBtn = document.getElementById( 'showSiblingsBtn' );

// --- Access Parent Elements ---
console.log( 'Parent Element of firstLink:', firstLink.parentElement ); // <p>...</p>
console.log( 'Grandparent Element:', firstLink.parentElement.parentElement ); // <body>...</body>
console.log(
	'Great-grandparent Element:',
	firstLink.parentElement.parentElement.parentElement
); // <html>...</html>

// --- Access Children ---
showChildrenBtn.addEventListener( 'click', () => {
	const parent = firstLink.parentElement;

	// children returns only element nodes
	console.log( 'Element children:', parent.children );

	// childNodes returns all nodes including text nodes
	console.log( 'All child nodes (including text):', parent.childNodes );
} );

// --- Access Sibling Elements ---
showSiblingsBtn.addEventListener( 'click', () => {
	console.log( 'Next Element Sibling:', firstLink.nextElementSibling ); // <strong>
	console.log(
		'Next Next Element Sibling:',
		firstLink.nextElementSibling.nextElementSibling
	); // <a>HTML</a>
	console.log(
		'Previous Element Sibling:',
		firstLink.nextElementSibling.previousElementSibling
	); // firstLink itself

	// Sibling nodes (may include text)
	console.log( 'Next Sibling Node:', firstLink.nextSibling );
	console.log( 'Previous Sibling Node:', firstLink.previousSibling );
} );

// --- Inspecting Properties ---
console.dir( firstLink ); // Shows all properties of the element in the console
