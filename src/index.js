/* global process, dpd */
import {Controller as Main} from './main-controller';
import {getShortcutObject, metaKey} from './_util';
import {shortcuts as aceDefaultShortcuts} from './_aceDefaultShortcuts';
import StartUp from './startup';
import {xhrGet} from './_external-deps/xhr.js';
import KataUrl from './kata-url.js';

function onSave() {
  main.onSave();
  dpd.katas.post({sourceCode: main.getEditorContent()});
}

const shortcuts = aceDefaultShortcuts.concat([
  getShortcutObject([metaKey, 'S'], onSave, 'Save+Run')
]);

const appDomNode = document.getElementById('tddbin');
var main = new Main(appDomNode, {
  iframeSrcUrl: `./mocha/spec-runner.html`,
  shortcuts: shortcuts
});

const withSourceCode = (sourceCode) => {
  main.setEditorContent(sourceCode);
  setTimeout(onSave, 1000);
};

const kataName = 'es5/mocha+assert/assert-api';
export const DEFAULT_KATA_URL = `http://${process.env.KATAS_SERVICE_DOMAIN}/katas/${kataName}.js`;
var xhrGetDefaultKata = xhrGet.bind(null, DEFAULT_KATA_URL);

const startUp = new StartUp(xhrGet, xhrGetDefaultKata);

var kataUrl = KataUrl.fromQueryString(window.location.search);

startUp.loadSourceCode(kataUrl, withSourceCode);