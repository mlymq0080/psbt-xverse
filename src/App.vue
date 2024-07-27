<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  width: 100%;
  padding: 0 !important;
  background: #ffffff !important;
  margin: 0 !important;
}

body,html {
  padding: 0 !important;
  width: 100%;
  margin: 0 !important;
}
</style>
