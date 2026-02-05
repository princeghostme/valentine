
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "preload": [
      "chunk-UEJP2HK3.js"
    ],
    "route": "/"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-5KUVGFFV.js"
    ],
    "route": "/valentinesmagic"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 6053, hash: 'e208b125161b9e48512949226784d3f683eee58902d023313db042da68745c73', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1018, hash: '0445dbdc168758da8e5072ebbd21e24cb5e5f13c5151b8a7bed74f4ee5d07096', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'valentinesmagic/index.html': {size: 14589, hash: 'd90a4292f41ccf5dc80e0f6df475eb04a9a7691647785a619ec96adf77315ce2', text: () => import('./assets-chunks/valentinesmagic_index_html.mjs').then(m => m.default)},
    'index.html': {size: 11553, hash: 'd7da0be88602bf625fb2a22f2e9e71061a389069883e4565562382999f0c3f62', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-UYLQ7MP7.css': {size: 15180, hash: '/Z9+kScuP4U', text: () => import('./assets-chunks/styles-UYLQ7MP7_css.mjs').then(m => m.default)}
  },
};
