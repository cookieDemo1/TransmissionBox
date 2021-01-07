<template>
  <div class="device_activity">
    <div class="header">
      <div class="title">
        <div class="icon">
          <svg-icon icon-class="emphasize"></svg-icon>
        </div>
        <span>传输箱实时报警</span>
      </div>
      <btn-group :btns="btns" @changeType="changeType"></btn-group>
    </div>
    <div class="body">
      <div class="list" v-if="list.length">
        <list-item v-for="(item,index) in list" :key="index" :item="item" :showStatus="true" @click="listItemClick(item)"></list-item>
      </div>
      <empty-content v-else></empty-content>
    </div>
  </div>
</template>

<script>
    import BtnGroup from '../components/BtnGroup'
    import ListItem from '../components/ListItem'
    import EmptyContent from '_components/EmptyContent'
    import {HttpGetMonitorWarning} from '_api/data_overview'

    export default {
      components:{BtnGroup,ListItem,EmptyContent},
      data() {
        return {
          type: '0',
          typeMap:  new Map([['1', 'prompt'], ['2', 'question']]),
          btns:  [
            {text:'全部',className: 'all'},
            {text:'恢复',className: 'prompt'},
            {text:'触发',className: 'question'},
          ],
          list: [],
        };
      },
      mounted() {
        this.getMonitorWarning();
      },
      methods: {
        getMonitorWarning(){
          let params = {}
          if (this.type !== '0'){
            params = {type: this.type}
          }
          HttpGetMonitorWarning(params).then((res) => {
            if (res.data.code === 200) {
              let list = res.data.data
              this.list = list.map((item) => {
                const { type, device_name, device_id, content } = item
                let className = this.typeMap.get(type)
                let text = `设备【${device_name}】(${device_id}）${content}`
                let status = type === '1'?'恢复':'触发'
                return { ...item, className, text, status }
              })
            } else {
              this.$message.error(res.data.msg)
            }
          }).catch(() => {
            this.$message.error(this.$t('data_acquisition_failed'))
          })
        },
        changeType(type){
          this.type = type+''
          this.getMonitorWarning()
        },
        listItemClick(item){
          const { device_id } = item
          this.$router.push({path: '/device/manage', query: {id: device_id}})
        }
      },
    };
</script>

<style scoped lang="stylus">
  .device_activity
    width 100%
    margin-bottom 20px
    display flex
    flex-direction column

    background rgba(255, 255, 255, 1)
    border 1px solid rgba(125, 189, 178, 0.2)
    box-shadow 0px 0px 8px 0px rgba(125, 189, 178, 0.2)
    border-radius 4px


    .header {
      margin 30px
      display flex
      justify-content space-between
      .title{
        display flex
        fc 18 #000
        .icon{
          wh 4px 20px
          mr 10
        }
      }
    }

    .body{
      margin 0 30px 30px
      flex 1
      .list{
        height 100%
        overflow-x hidden
        overflow-y auto
      }
    }



</style>
