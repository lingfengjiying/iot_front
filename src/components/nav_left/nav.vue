
<template>
  <el-menu
    default-active="33"
    :collapsed="collapse"
    collapse-transition
    router
    unique-opened
    class="el-menu-vertical-demo"
    background-color="rgb(84, 92, 100)"
    text-color="#fff"
    active-text-color="#ffaa33"
  >
    >
    <el-submenu
      v-for="menu in allmenu"
      :key="menu.menuid"
      :index="menu.menuname"
    >
      <template slot="title">
        <i class="el-icon-location" :class="menu.icon"></i>
        <span>{{ menu.menuname }}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item
          v-for="chmenu in menu.menus"
          :index="'/' + chmenu.url"
          :key="chmenu.menuid"
        >
          <i class="iconfont" :class="chmenu.icon"></i>
          <span>{{ chmenu.menuname }}</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      collapse: false,
      allmenu: [],
    };
  },
  mounted() {
    let res = {
      success: true,
      data: [
        {
          menuid: 1,
          icon: "el-icon-setting",
          menuname: "设备管理",
          hasThird: null,
          url: null,
          menus: [
             {
              menuid: 6,
              icon: "el-icon-goods",
              menuname: "产品管理",
              hasThird: "N",
              url: "device/product",
              menus: null,
            },
            
             {
              menuid: 3,
              icon: "el-icon-goods",
              menuname: "设备基本信息管理",
              hasThird: "N",
              url: "device/device_info",
              menus: null,
            },
            {
              menuid: 2,
              icon: "el-icon-goods",
              menuname: "设备权限管理",
              hasThird: "N",
              url: "device/device_access",
              menus: null,
            },
            {
              menuid: 1,
              icon: "el-icon-goods",
              menuname: "设备类别设置",
              hasThird: "N",
              url: "device/device_group",
              menus: null,
            },
             {
              menuid: 4,
              icon: "el-icon-goods",
              menuname: "设备绑定",
              hasThird: "N",
              url: "device/device_bind",
              menus: null,
            },
          ],
        },
        {
          menuid: 33,
          icon: "el-icon-tickets",
          menuname: "设备数据监控",
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 34,
              icon: "el-icon-edit",
              menuname: " 设备数据管理 ",
              hasThird: "N",
              url: "device_data/device_data_list",
              menus: null,
            },
            // {
            //   menuid: 35,
            //   icon: "el-icon-edit",
            //   menuname: " 异常设备管理 ",
            //   hasThird: "N",
            //   url: "device_data/device_catch_list",
            //   menus: null,
            // },
          ],
        },
        {
          menuid: 71,
          icon: "el-icon-s-grid",
          menuname: "用户管理",
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 72,
              icon: "el-icon-user",
              menuname: "用户管理",
              hasThird: "N",
              url: "user/user_list",
              menus: null,
            },
            {
              menuid: 174,
              icon: "el-icon-s-tools",
              menuname: "部门管理",
              hasThird: "N",
              url: "user/depart_list",
              menus: null,
            },
          ],
        },
        {
          menuid: 128,
          icon: "el-icon-s-finance",
          menuname: "设备策略管理",
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 129,
              icon: "el-icon-s-management",
              menuname: "策略管理",
              hasThird: "N",
              url: "policy/policy_list",
              menus: null,
            },
            {
              menuid: 175,
              icon: "el-icon-s-claim",
              menuname: "设备策略管理",
              hasThird: "N",
              url: "policy/devie_policy_list",
              menus: null,
            },
          ],
        },
        {
          menuid: 150,
          icon: "el-icon-pie-chart",
          menuname: "图表",
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 159,
              icon: "el-icon-data-line",
              menuname: "数据可视化",
              hasThird: "N",
              url: "data_count/data_count",
              menus: null,
            },
          ],
        },
      ],
    };
    this.allmenu = res.data;
    //监听
    this.$root.Bus.$on("toggle", (value) => {
      console.log(value);
      this.collapsed = !value;
    });
  }
  // methods: {
  //   handleOpen(key, keyPath) {
  //     console.log(key, keyPath);
  //   },
  //   handleClose(key, keyPath) {
  //     console.log(key, keyPath);
  //   },
  // },
};
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 240px;
  height: 100vh;
  min-height: 400px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: none;
  text-align: left;
}

.el-menu-item-group__title {
  padding: 0;
}

.el-menu-bg {
  background-color: #1f2d3d !important;
}

.el-menu {
  border: none;
}

.logobox {
  height: 40px;
  line-height: 40px;
  color: #9d9d9d;
  font-size: 20px;
  text-align: center;
  padding: 20px 0;
}

.logoimg {
  height: 40px;
}

.iconfont {
  margin-right: 10px;
}
</style>
