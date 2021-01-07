<template lang="pug">
  .bubble
    g2-bubble(
      :data="bubbleData"
    )
</template>

<script>
  export default {
    data() {
      return {
        bubbleData:[
          {
            x: 20,
            y: 5,
            size: 10,
            type: 'type1'
          },
          {
            x: 30,
            y: 10,
            size: 8,
            type: 'type2'
          },
          {
            x: 15,
            y: 20,
            size: 15,
            type: 'type3'
          },
        ]
      }
    },
    mounted() {

    },
    methods: {},
  }
</script>

<style scoped lang="stylus">

</style>
