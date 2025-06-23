// Tweak styles for Biel search button
// Have to access the CSS in this way because it's in the shadow DOM

// The transition should be transition: all var(--ifm-transition-fast) var(--ifm-transition-timing-default); but I can't seem to access the variables here
const bielButtonStyleTextHover = `
  a.hoverLink:hover {
    background: #1B1B1B;
    box-shadow: 0px 0px 6px 0px #33E88E !important;
  }
`;

document.addEventListener('DOMContentLoaded', async function () {
  console.log("ok")
  const bielButtonLink = await getBielButtonLink('biel-search-button', 'a.biel-search-button-content');
  bielButtonLink.style['box-shadow'] = '0px 0px 6px 0px rgba(51, 232, 142, 0.40)';
  bielButtonLink.style['transition'] = 'all 200ms cubic-bezier(0.08, 0.52, 0.52, 1)';

  const bielButtonStyle = document.createElement('style');
  bielButtonStyle.textContent = bielButtonStyleTextHover;
  const buttonShadowRoot = await getShadowRoot('biel-search-button');
  buttonShadowRoot.appendChild(bielButtonStyle);
  bielButtonLink.classList.add('hoverLink');

  const magnifyingGlassSpan = bielButtonLink.querySelector('span.biel-search-button-content-icon');
  magnifyingGlassSpan.style['padding-bottom'] = '5px';
  magnifyingGlassSpan.style['padding-right'] = '3px';
  const magnifyingGlassSVG = bielButtonLink.querySelector('svg.lucide-search');
  magnifyingGlassSVG.setAttribute('width', '18px');
  magnifyingGlassSVG.setAttribute('height', '18px');
  console.log("done");
});

const getShadowRoot = async (parentSelector) =>
  new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      if (document.querySelector(parentSelector)) {
        const bielButton = document.querySelector(parentSelector);
        if (bielButton && bielButton.shadowRoot) {
          observer.disconnect();
          resolve(bielButton.shadowRoot);
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
;

const getBielButtonLink = async (parentSelector, childSelector) =>
  new Promise((resolve) => {
    const bielFirstTry = document.querySelector(parentSelector);
    if (bielFirstTry) {
      const firstTry = bielFirstTry.shadowRoot.querySelector('a.biel-search-button-content');
      if (firstTry) {
        resolve(firstTry);
      }
    } else {
      // Wait for it to be initialized
      const observer = new MutationObserver(() => {
        if (document.querySelector(parentSelector)) {
          const bielButton = document.querySelector(parentSelector);
          if (bielButton && bielButton.shadowRoot && bielButton.shadowRoot.querySelector(childSelector)) {
            observer.disconnect();
            resolve(bielButton.shadowRoot.querySelector(childSelector));
          }
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  });

