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
    
    <article data-toc data-toc-id="main-toc" data-toc-class="toc-custom" data-toc-parent-id="toc-parent" class="mb-4">
        <div id="master-container" class="col-12">
            <div class="container">
                <div class="row">
                    <div id="sidebar" class="col-lg-3 col-md-3 col-sm-12">
                        <Sidebar />
                    </div>
                    <div class="col-lg-9 col-md-9 col-sm-12">
                        <router-view  :key="$route.fullPath"/>
                    </div>
                </div>
            </div>
        </div>
    </article>

</template>

<script>
import { useMeta } from 'vue-meta'
import { onMounted, getCurrentInstance } from "vue";
import ToTopButton from '@/components/ToTopButton.vue';
import Sidebar from '@/components/posts/everydays/Sidebar.vue';

export default {
    data() {
        return {
            title: "Everydays",
            title_meta: "Everydays",
            subheading: "Combining OpenAI's GPT3.5 and Stable Diffusion to generate an interesting post every day.",
            img: "everydays_header.png",
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
        ToTopButton,
        Sidebar
    }
}
</script>

<style scoped>
.sidebar {
    margin-top: 0.5em;
    margin-bottom: 2em;
}
</style>
