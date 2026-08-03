import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import { initSocket } from './socket';
import { pinia } from './stores';

import translationPlugin from './translation';

import {
	Alert,
	Badge,
	Button,
	Dialog,
	ErrorMessage,
	FormControl,
	Input,
	TextInput,
	frappeRequest,
	pageMetaPlugin,
	resourcesPlugin,
	setConfig,
} from 'frappe-ui';

import './index.css';
import './wiki-editor-content.css';

const globalComponents = {
	Button,
	TextInput,
	Input,
	FormControl,
	ErrorMessage,
	Dialog,
	Alert,
	Badge,
};

const app = createApp(App);

function loadFlowPanel() {
	const assets = window.flow_panel_assets;
	if (!assets?.js || document.querySelector('script[data-wiki-flow-panel]')) {
		return;
	}
	if (assets.css && !document.querySelector('link[data-wiki-flow-panel]')) {
		const stylesheet = document.createElement('link');
		stylesheet.rel = 'stylesheet';
		stylesheet.href = assets.css;
		stylesheet.dataset.wikiFlowPanel = 'true';
		document.head.appendChild(stylesheet);
	}
	const script = document.createElement('script');
	script.type = 'module';
	script.src = assets.js;
	script.dataset.wikiFlowPanel = 'true';
	document.body.appendChild(script);
}

setConfig('resourceFetcher', frappeRequest);

app.use(pinia);
app.use(router);
app.use(translationPlugin);
app.use(resourcesPlugin);
app.use(pageMetaPlugin);

const socket = initSocket();
app.config.globalProperties.$socket = socket;

for (const key in globalComponents) {
	app.component(key, globalComponents[key]);
}

app.mount('#app');
loadFlowPanel();
