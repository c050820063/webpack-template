<template>
  <div class="test-wrap">
    <div>test</div>
    <cell></cell>
    <cells></cells>
  </div>
</template>
<script>
import cell from '@/components/cell'
import cells from '@/components/cells'
export default {
  name: '',
  components: {
    cell,
    cells,
  },
  data () {
    return {}
  },
}
</script>
<style lang='less'>
@import '../static/less/test.css';
</style>
