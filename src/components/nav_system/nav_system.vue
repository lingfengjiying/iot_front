
<template>
  <el-menu
    class="el-menu-demo"
    mode="horizontal"
    background-color="rgb(84, 92, 100)"
    text-color="#fff"
    active-text-color="#fff"
  >
    <el-submenu index="2" style="" class="submenu">
      <template slot="title">超级管理员</template>
      <el-menu-item index="2-1">设置</el-menu-item>
      <el-menu-item @click="content()" index="2-2">个人中心</el-menu-item>
      <el-menu-item @click="exit()">退出</el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: "navcon",
  data() {
    return {
      collapsed: true,
      //   imgshow: require('../assets/img/show.png'),
      //   imgsq: require('../assets/img/sq.png')
    };
  },
  methods: {
    //退出登陆
    exit() {
      this.$confirm("退出登录，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store.commit("logout", "false");
          this.$router.push({ path: "/login" });
          this.$message({
            type: "success",
            message: "已退出登录!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    toggle(showtype) {
      this.collapsed = !showtype;
      this.$root.Bus.$emit("toggle", this.collapsed);
    },
     handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>

<style scoped>
.el-menu {
  width: 0rem;
  position: absolute;
  right: 10rem;
  top: 3rem;
 
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: node;
}

.el-submenu {
   border: 0;
  padding: 0;
  margin: 0;
}

.btn {
  margin-top: 5px;
  height: 50px;
  background-color: transparent;
  border: node;
  
}

.showimg {
  width: 5px;
  height: 26px;
  position: absolute;
  top: 17px;
  left: 17px;
  
}

.showimg:active {
  border: none;
}
</style>