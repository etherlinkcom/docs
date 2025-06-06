// Tweak styles for Biel search button
// Have to access the CSS in this way because it's in the shadow DOM
document.addEventListener('DOMContentLoaded', async function () {
  const bielButtonLink = await getBielButtonLink('biel-search-button', 'a.biel-search-button-content');
  bielButtonLink.style['box-shadow'] = '0px 0px 6px 0px rgba(51, 232, 142, 0.40)';
  const magnifyingGlassSpan = bielButtonLink.querySelector('span.biel-search-button-content-icon');
  magnifyingGlassSpan.style['padding-bottom'] = '5px';
  magnifyingGlassSpan.style['padding-right'] = '3px';
  const magnifyingGlassSVG = bielButtonLink.querySelector('svg.lucide-search');
  magnifyingGlassSVG.setAttribute('width', '18px');
  magnifyingGlassSVG.setAttribute('height', '18px');
});

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

