<template>
  <div>
    <app-header></app-header>
    <app-navbar></app-navbar>
    <app-main></app-main>
  </div>
</template>

<script>
import AppHeader from "./AppHeader";
import AppNavbar from "./AppNavbar";
import AppMain from "./AppMain";

export default {
  data() {
    return {};
  },
  components: {
    AppHeader,
    AppNavbar,
    AppMain
  }
};
</script>

<style scoped>
.header {
  position: absolute;
  line-height: 50px;
  top: 0px;
  left: 0px;
  right: 0px;
  background-color: #2d3a4b;
}
.navbar {
  position: absolute;
  width: 230px;
  top: 50px;
  left: 0;
  bottom: 0px;
  background-color: #545c64;
  overflow-y: auto;
}
.main {
  position: absolute;
  top: 50px;
  left: 230px;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  background-color: #fff;
}
</style>
