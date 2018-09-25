<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
    name: "app"
};
</script>

<style>
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
html,
body {
    margin: 0;
    padding: 0;
    width: 100%;
    min-width:1060px;
}
.el-container{
  padding:0 2%
  }

.el-main {
    min-height: calc(100vh - 120px);
}
</style>
