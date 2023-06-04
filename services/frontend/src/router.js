import { createRouter, createWebHistory } from 'vue-router';

// Import components for routing
import Home from './components/Home.vue';
import About from './components/About.vue';
import BlogPost from './components/BlogPost.vue';
import DonConjugator from './components/posts/don_conjugator/don_conjugator_app.vue';
import DonConjugatorPractice from './components/posts/don_conjugator/don_conjugator_practice.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/about',
        name: 'About',
        component: About,
    },
    {
        path: '/posts/:name',
        name: 'BlogPost',
        component: BlogPost,
    },
    {
        path: '/posts/don_conjugator/practice/:mode/:verbs',
        name: 'DonConjugatorPractice',
        component: DonConjugatorPractice,
    },
    {
        path: '/apps/don_conjugator',
        name: 'DonConjugator',
        component: DonConjugator,
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: routes,
    scrollBehavior() {
        return { x: 0, y: 0 }
    }
});

export default router;
