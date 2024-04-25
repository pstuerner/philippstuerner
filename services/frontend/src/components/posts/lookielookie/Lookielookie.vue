<template>
    <ToTopButton />
    
    <header class="masthead" :style="mastheadStyle">
        <div class="center" style="z-index: 1;">
            <div class="site-heading">
                <h1>{{ title }}</h1>
                <span class="subheading">{{ subheading }}</span>
            </div>
        </div>
    </header>

    <article data-toc data-toc-id="main-toc" data-toc-class="toc-custom" data-toc-parent-id="toc-parent">
        <div id="master-container" class="col-12">
            <div class="container">
                <div class="row">
                    <router-view :apiRedirect="apiRedirect" :websiteRedirect="websiteRedirect" :key="$route.fullPath"/>
                </div>
            </div>
        </div>
    </article>
</template>

<script>
import { useMeta } from 'vue-meta'
import { onMounted, getCurrentInstance } from "vue";
import ToTopButton from '@/components/ToTopButton.vue';

export default {
    data() {
        return {
            title: "LookieLookie 👀",
            title_meta: "Lookielookie",
            subheading: "Daily trading signals and filter options.",
            img: "lookielookie_header.jpg",
            apiRedirect: 'https://api.philippstuerner.com',
            websiteRedirect: 'https://philippstuerner.com'
        };
    },
    setup () {
        onMounted(() => {
            useMeta({
                title: getCurrentInstance().data.title,
            })
        })
    },
    computed: {
        mastheadStyle() {
            return {
                'background-image': 'url(' + require(`@/assets/img/${this.img}`) + ')',
                'height': 'calc(20rem + 57px)',
                'width': '100%'
            }
        },
    },
    methods: {
    },
    components: {
        ToTopButton
    }
}
</script>

<style scoped>
</style>
