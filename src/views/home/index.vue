<template>
  <div>
    <h1>{{ p_title }}</h1>
    <!-- <div class="echart"></div> -->
  </div>
</template>

<script>
// import echarts from "echarts";

export default {
  data() {
    return {
      p_title: "欢迎访问时光屋管理系统"
    };
  },
  mounted: function() {
    // this.getechats();
  },
  methods: {},
  components: {}
};
</script>

<style lang="scss" scoped>
h1 {
  text-align: center;
  color: black;
}
</style>
