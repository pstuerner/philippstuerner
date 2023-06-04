<template>
  <metainfo>
    <template v-slot:title="{ content }">{{ content ? `${content} | philippstuerner.com` : `philippstuerner.com` }}</template>
  </metainfo>
  <Navbar />
  <router-view></router-view>
  <Footer />
</template>

<script>
import { useMeta } from 'vue-meta'
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

export default {
  setup () {
    useMeta({
      title: '',
      htmlAttrs: { lang: 'en', amp: true },
    })
  },
  components: {
      Navbar,
      Footer
  }
};
</script>

<style scoped>
/* CSS styles for the App component */
</style>
