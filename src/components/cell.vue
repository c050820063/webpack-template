<template>
  <div class="cell-wrap">
    <slot>
      <div class="cell">123123</div>
    </slot>
  </div>
</template>
<script>
export default {
  name: '',
  data () {
    return {}
  },
}
</script>
<style lang='less' scoped>
@import '../static/less/cell.less';
.cell {
  // color: #ccc;
  color: @THEME_COLOR_BASE;
}
</style>
