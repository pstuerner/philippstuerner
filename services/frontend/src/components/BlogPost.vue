<template>
  <component :is="component" v-if="component" />
</template>
  
<script>
  import { markRaw } from "vue";

  export default {
    data() {
      return {
        component: null,
      };
    },
    async created() {
      const { name } = this.$route.params;

      try {
        const module = await import(`./posts/${name}/${name}.vue`);
        this.component = markRaw(module.default);
      } catch (error) {
        const module = await import(`./NotFound.vue`);
        this.component = markRaw(module.default);
      }
    },
  };
</script>
  