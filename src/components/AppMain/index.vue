<template>
  <div class="main">
    <link-vue></link-vue>
    <router-view></router-view>
  </div>
</template>

<script>
import linkVue from "./link.vue";

export default {
  data() {
    return {};
  },
  components: {
    linkVue
  }
};
</script>
