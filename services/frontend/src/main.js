import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createAuth0 } from "@auth0/auth0-vue";
import authConfig from "../auth_config.json";
import { createMetaManager } from 'vue-meta';
import VueProgressiveImage from 'vue-progressive-image';
import "vue-progressive-image/dist/style.css";

const app = createApp(App)
    .use(router)
    .use(
        createAuth0({
            domain: authConfig.domain,
            clientId: authConfig.clientId,
            authorizationParams: {
                redirect_uri: window.location.origin,
            }
        })
    )
    .use(VueProgressiveImage)
    .use(createMetaManager())

await router.isReady()
app.mount('#app')