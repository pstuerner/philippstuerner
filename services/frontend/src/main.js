import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createMetaManager } from 'vue-meta';
import VueProgressiveImage from 'vue-progressive-image';
import "vue-progressive-image/dist/style.css";

const app = createApp(App)
    .use(router)
    .use(VueProgressiveImage)
    .use(createMetaManager())

await router.isReady()
app.mount('#app')