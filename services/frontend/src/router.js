import { createRouter, createWebHistory } from 'vue-router';
import { createAuthGuard } from "@auth0/auth0-vue";

// Import components for routing
import Home from './components/Home.vue';
import About from './components/About.vue';
import Profile from './components/Profile.vue';
import BlogPost from './components/BlogPost.vue';
import Lookielookie from './components/posts/lookielookie/Lookielookie.vue';
import LookielookieOverview from './components/posts/lookielookie/LookielookieOverview.vue';
import LookielookieTicker from './components/posts/lookielookie/LookielookieTicker.vue';
import Everydays from './components/posts/everydays/everydays.vue';
import EverydaysDay from './components/posts/everydays/Day.vue';
import EverydaysCalendarWeek from './components/posts/everydays/CalendarWeek.vue';
import EverydaysYear from './components/posts/everydays/Year.vue';
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
        path: '/profile',
        name: 'Profile',
        component: Profile,
        beforeEnter: createAuthGuard(app)
    },
    {
        path: '/posts/:name',
        name: 'BlogPost',
        component: BlogPost,
    },
    {
        path: '/posts/everydays',
        name: 'Artwork',
        component: Everydays,
        children: [
            { path: ':year/:month/:day/day', name: 'EverydaysDay', component: EverydaysDay },
            { path: ':year/:month/:day/calendarweek', name: 'EverydaysCalendarWeek', component: EverydaysCalendarWeek },
            { path: ':year/:month/:day/year', name: 'EverydaysYear', component: EverydaysYear },
        ]
    },
    {
        path: '/posts/lookielookie',
        name: 'Lookielookie',
        component: Lookielookie,
        children: [
            { path: 'overview', name: 'LookielookieOverview', component: LookielookieOverview },
            { path: 'ticker/:ticker', name: 'LookielookieTicker', component: LookielookieTicker },
        ]
    },
    {
        path: '/e/:year/:month/:day',
        redirect: to => {
            return { name: 'EverydaysDay' }
        }
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
