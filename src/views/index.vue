

<template>
  <div>
    <el-container
      style="
        height: 100%;
        background-color: white !important ;
        border: 1px solid #eee;
      "
    >
      <el-header style="backgroundcolor: rgb(84, 92, 100); height: 10rem">
        <!-- <el-row>
            <el-col
               ><h1>
                <font color="#FFBA61">物联网管理平台</font>
              </h1></el-col
            >
            <el-col style="right"> <navsystem></navsystem></el-col>
          
        </el-row> -->
        <el-row>
  <el-col :span="20"><div class="grid-content bg-purple"><h1>
                <font color="#FFBA61">物联网管理平台</font>
              </h1></div></el-col>
  <el-col :span="4"><div class="grid-content bg-purple-light"><navsystem></navsystem></div></el-col>
</el-row>
      </el-header>
      <el-container class="index-con">
        <el-aside width="20rem" :class="showclass">
          <leftnav></leftnav>
        </el-aside>
        <el-main><router-view /></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import leftnav from "./../components/nav_left/nav.vue";
import navsystem from "./../components/nav_system/nav_system.vue";

export default {
  name: "index",
  data() {
    return {
      showclass: "asideshow",
      showtype: false,
    };
  },
  components: {
    leftnav, //原本组件名为nav，但是和关键字冲突
    navsystem,
  },
  methods: {
    // handleOpen(key, keyPath) {
    //   console.log(key, keyPath);
    // },
    // handleClose(key, keyPath) {
    //   console.log(key, keyPath);
    // },
  },
  created() {
    console.log(this.$data.userid);
    this.$root.Bus.$on("toggle", (value) => {
      if (value) {
        console.log(value);
        this.showclass = "asideshow";
      } else {
        console.log("sdgasd");
        setTimeout(() => {
          this.showclass = "aside";
        }, 300);
      }
    });
  },
  beforeMount() {
    this.$message({
      message: "登陆成功",
      type: "success",
    });
  },
  beforeDestroy() {
    this.$root.Bus.$off("toggle");
  },
};
</script>

<style>
.el-header {
  background-color: rgb(84, 92, 100);
  color: #333;
  text-align: center;
  line-height: 7.5rem;
  height: 20rem;
}

.el-aside {
  width: 25%;
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 0rem;
  margin: 0;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 10rem;
}
h1 font {
  text-align: center;
  margin: 0;
}
h1 {
  color: rgb(84, 92, 100);
  background: rgb(84, 92, 100);
  position: relative;
  left:10rem;

}
</style>
