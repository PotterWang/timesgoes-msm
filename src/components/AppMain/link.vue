<template>
  <el-breadcrumb separator="/" v-show="$route.path !== '/home' ? 1 : 0"
    ><!-- 面包屑 -->
    <el-breadcrumb-item class="linegreen" :to="{ path: $route.path }">{{
      $route.meta.title
    }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  data() {
    return {};
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  height: 10px;
  padding: 20px;
  margin: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba($color: #000000, $alpha: 0.1);
  .linegreen {
    border-left: 3px solid green;
    padding-left: 10px;
  }
}
</style>
