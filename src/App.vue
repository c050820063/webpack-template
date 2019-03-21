<template>
  <div id="app">
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>
<style lang="less">
#app {
  width: 100vw;
}
</style>
