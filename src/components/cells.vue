<template>
  <div class="cells-wrap">
    <slot>
      <div class="cell">123</div>
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
<style lang='less'>
@import '../static/less/cell.less';
</style>
