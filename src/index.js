/* global process, dpd */
import {Controller as Main} from './main-controller';
import {getShortcutObject, metaKey} from './_util';
import {shortcuts as aceDefaultShortcuts} from './_aceDefaultShortcuts';
import StartUp from './startup';
import {xhrGet} from './_external-deps/xhr.js';
import KataUrl from './kata-url.js';

import {encode as toQueryString, decode as fromQueryString} from './querystring.js';

const queryString = window.location.search.replace(/^\?/, '');
const kataUrl = KataUrl.fromQueryString(queryString);
console.log(kataUrl);

const query = fromQueryString(queryString);
const kataName = query.kata;
const kataId = query.id;

function onSave() {
  main.onSave();
  var data = {
    sourceCode: main.getEditorContent(),
    previousId: kataId
  };
  if (kataName) {
    data.kataName = kataName;
  }
  dpd.katas.post(data, function({id}) {
    const newQueryString = toQueryString({id: id});
    history.pushState(null, '', `?${newQueryString}`);
  });
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

const defaultKataName = 'es5/mocha+assert/assert-api';
export const DEFAULT_KATA_URL = `http://${process.env.KATAS_SERVICE_DOMAIN}/katas/${defaultKataName}.js`;
var xhrGetDefaultKata = xhrGet.bind(null, DEFAULT_KATA_URL);

const startUp = new StartUp(xhrGet, xhrGetDefaultKata);

startUp.loadSourceCode(kataUrl, withSourceCode);
