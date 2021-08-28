<template>
     <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item >{{pageTitle}}</el-breadcrumb-item>
    </el-breadcrumb>

</template>
<script lang="ts">

export default ({
  name: "index",
  props:['pageTitle'],
  data() {
    return {
    };
  },
})

</script>
<style scoped>


</style>