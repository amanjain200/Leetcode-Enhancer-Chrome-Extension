import { createRoot } from 'react-dom/client';
import App from '@src/App';
import tailwindcssOutput from '../dist/tailwind-output.css?inline';
import reactToastify from '../node_modules/react-toastify/dist/ReactToastify.css?inline';


const root = document.createElement('div');
root.id = 'chrome-extension-boilerplate-react-vite-content-view-root';

document.body.append(root);

const rootIntoShadow = document.createElement('div');
rootIntoShadow.id = 'shadow-root';

const shadowRoot = root.attachShadow({ mode: 'open' });

if (navigator.userAgent.includes('Firefox')) {
  /**
   * In the firefox environment, adoptedStyleSheets cannot be used due to the bug
   * @url https://bugzilla.mozilla.org/show_bug.cgi?id=1770592
   *
   * Injecting styles into the document, this may cause style conflicts with the host page
   */
  const styleElement = document.createElement('style');
  styleElement.innerHTML = tailwindcssOutput;
  shadowRoot.appendChild(styleElement);
} else {
  /** Inject styles into shadow dom */
  const globalStyleSheet = new CSSStyleSheet();
  globalStyleSheet.replaceSync(tailwindcssOutput);
  // Include Toastify CSS into the Shadow DOM
const toastifyStyleSheet = new CSSStyleSheet();
toastifyStyleSheet.replaceSync(reactToastify);
// fetch(chrome.runtime.getURL('../node_modules/react-toastify/dist/ReactToastify.css'))
//   .then((response) => response.text())
//   .then((cssText) => toastifyStyleSheet.replaceSync(cssText))
//   .catch((error) => console.error('Failed to load Toastify CSS:', error));
  shadowRoot.adoptedStyleSheets = [globalStyleSheet, toastifyStyleSheet];
}


shadowRoot.appendChild(rootIntoShadow);
createRoot(rootIntoShadow).render(<App />);
