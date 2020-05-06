<template>
  <div id="app">
    <el-button @click="start">start</el-button>
    <el-tabs v-model="activeName" type="card">
    <el-tab-pane label="tab-a" name="tab-a">
      <el-button type="primary" @click="requestOneMore">One More</el-button>
      <br>
      <img v-for="(value,key) in tabInfo['tab-a'].ans" :key="key" :src="value" width="200" height="200">
    </el-tab-pane>
    <el-tab-pane label="tab-b" name="tab-b">
      <img v-for="(value,key) in tabInfo['tab-b'].ans" :key="key" :src="value" width="200" height="200">
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import RequestPool from './util';
import {tabAImgUrls, tabBImgUrls} from './const';
export default {
  name: 'App',
  data(){
      return {
        activeName: 'tab-a',
        requester: new RequestPool(2),
        tabInfo: {
          'tab-a': {
            queue:[],
            ans: {},
            urls: tabAImgUrls
          },
          'tab-b': {
            queue: [],// 已经在队列里但是还未发送的请求
            ans: {}, // 请求的结果
            urls: tabBImgUrls // 需要请求的url
          }
        }
      }
  },
  watch: {
    activeName(newVal, oldVal){
      this.swithTab(newVal, oldVal);
    }
  },
  methods: {
    start(){
        // 首次渲染
        this.getImg(tabAImgUrls, this.tabInfo['tab-a'].ans);
    },
    getImg(imgs, ans){
      imgs.forEach((img)=>{
       this.requester.requestImg(img).then((res)=>{
         this.$set(ans, img, res);
       });
      });
      // "发出去"的请求要从urls中删除,防止再次发送
      imgs.splice(0)
    },
    swithTab(newTab, oldTab) {
        // 获取当前还未发送的url
        const pendingQueue = this.requester.getQueue()
        this.tabInfo[oldTab].queue = pendingQueue;
        this.requester.restart(this.tabInfo[newTab].queue);
        this.getImg(this.tabInfo[newTab].urls, this.tabInfo[newTab].ans);
    },
    requestOneMore(){
      this.tabInfo['tab-a'].urls.push('/static/11.jpg')
      this.getImg(this.tabInfo['tab-a'].urls, this.tabInfo['tab-a'].ans);
    }
  }
}
</script>
