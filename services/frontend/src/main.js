import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createMetaManager, Meta } from 'vue-meta'
import './assets/styles.css';    
import './assets/index-styles.css';  
import './assets/stackoverflow-dark.css';  

const app = createApp(App)
    .use(router)
    .use(createMetaManager())

await router.isReady()
app.mount('#app')