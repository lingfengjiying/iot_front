<template>
  <div>
    <NavTop :page-title="page_title"></NavTop>
    <!--搜索筛选-->
    <!--列表-->
    <div>
      <!--搜索筛选-->
      <el-form :inline="true" :model="formInline" class="user-search">
        <el-form-item :inline="true">
          <el-row>
            <el-col :span="8">
              <el-input
                v-model="formInline.device_name"
                placeholder="请输入设备名"
                clearable=""
              ></el-input>
            </el-col>
            <el-col :span="8">
              <el-input
                v-model="formInline.device_nickname"
                placeholder="请输入设备显示名称"
                clearable=""
              ></el-input>
            </el-col>
            <el-col :span="8">
              <el-input
                v-model="formInline.device_master_name"
                placeholder="出厂商家名称"
                clearable=""
              ></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="search"
            >搜索</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <el-table
      size="small"
      :data="listData"
      highlight-current-row
      v-loading="loading"
      border
      element-loading-text="拼命加载中..."
      style="width: 100%"
    >
      <el-table-column align="center" type="selection"> </el-table-column>
      <el-table-column sortable prop="device_name" label="设备名">
      </el-table-column>
      <el-table-column sortable prop="device_nickname" label="显示名称">
      </el-table-column>
      <el-table-column sortable prop="device_id" label="设备编号">
      </el-table-column>
      <el-table-column sortable prop="organization_name" label="出厂商家">
      </el-table-column>
      <el-table-column sortable align="tempareture" label="当前温度(摄氏度)">
        <template slot-scope="scope">{{
          scope.row.tempareture + "°"
        }}</template>
      </el-table-column>
      <el-table-column sortable align="humidity" label="当前湿度">
        <template slot-scope="scope">{{ scope.row.humidity + "%" }}</template>
      </el-table-column>
      <el-table-column sortable prop="update_date" label="数据更新时间">
      </el-table-column>
      <el-table-column sortable prop="switch_on" label="在线/离线">
        <template v-slot="scope">
          <el-switch
            v-model="scope.row.func_switch"
            class="switchStyle"
            :active-value="true"
            :inactive-value="false"
            active-text="在线"
            inactive-text="离线"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="change_switch($event, scope.row, scope.$index)"
          >
          </el-switch
        ></template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon=" el-icon-edit"
            size="mini"
            @click="
              handleEdit(scope.$index, scope.row);
              dialogFormEdit = true;
            "
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <Pagination
      v-bind:child-msg="pageparm"
      @callFather="callFather"
    ></Pagination>
    <!-- <el-dialog
      :close-on-click-modal="false"
      @close="closeDialog"
      :inline="true"
      title="设备数据详情"
      :visible.sync="dialogFormEdit"
    >
      <el-form v-model="form">
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备名称" :label-width="formLabelWidth">
              <el-col :span="18">
                <span> {{ form.device_name }}</span>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备编号" :label-width="formLabelWidth">
              <el-col :span="18">
                <span> {{ form.device_id }}</span>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="出厂商家" :label-width="formLabelWidth">
              <el-col :span="18">
                <span> {{ form.organization_name }}</span>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="当前温度" :label-width="formLabelWidth">
              <el-col :span="18">
                <span> {{ form.tempareture }}°</span>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="当前湿度" :label-width="formLabelWidth">
              <el-col :span="18">
                <span> {{ form.humidity }}%</span>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="更新时间" :label-width="formLabelWidth">
              <el-col :span="18">
                <span> {{ form.update_date }}</span>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
       
      </el-form>
    
    </el-dialog> -->
  </div>
</template>


<script>
import NavTop from "../../components/nav_top/nav_top.vue";
import Pagination from "../../components/pagination/pagination.vue";

export default {
  data() {
    return {
      page_title: "设备数据管理",
      input: "",
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: "添加",
      editForm: {
        deptId: "",
        deptName: "",
        deptNo: "",
        token: localStorage.getItem("logintoken"),
      },
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogFormEdit: false,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      formLabelWidth: "120px",

      formInline: {
        page: 1,
        limit: 10,
        varLable: "",
        varName: "",
        token: localStorage.getItem("logintoken"),
      },
      // 删除部门
      seletedata: {
        ids: "",
        token: localStorage.getItem("logintoken"),
      },
      userparm: [], //搜索权限
      listData: [], //用户数据
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10,
      },
    };
  },
  // 注册组件
  components: {
    Pagination,
    NavTop,
  },
  // 创建完毕
  created() {
    this.getdata();
    // setInterval(() => {
    //   this.getdata();
    // }, 5000);
  },

  /**
   * 里面的方法只有被调用才会执行
   */
  methods: {
    clear_data() {
      this.listData = [];
    },
    // 获取数据
    getdata() {
      this.loading = true;
      let that = this;
      let device_name = this.formInline.device_name;
      let device_master_name = this.formInline.device_master_name;
      let device_nickname = this.formInline.device_nickname;
      let params = {
        page_no: this.formInline.page,
        page_size: this.formInline.limit,
      };
      if (device_name != "") {
        params.device_name = device_name;
      }
      if (device_master_name != "") {
        params.device_master_name = device_master_name;
      }
      if (device_nickname != "") {
        params.device_nickname = device_nickname;
      }
      this.$axios({
        method: "get",
        url: this.api.INTERFACES.getDeviceDataList,
        params: params,
        data: "",
      })
        .then((response) => {
          this.listData = response.data.data.rows; //数据放入listdata
          this.pageparm.total = response.data.data.total; //长度
        })
        .catch((error) => {
          console.log(error);
        });
      this.loading = false;
      this.pageparm.currentPage = this.formInline.page;
      this.pageparm.pageSize = this.formInline.limit;
    },
    // 分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage;
      this.formInline.limit = parm.pageSize;
      this.getdata(this.formInline);
    },
    // 搜索事件
    search() {
      this.getdata(this.formInline);
    },
    //查看设备信息详情页
    handleEdit: function (index, row) {
      this.form = row;
      this.$router.push({
        name: "device_data_detail",
        params: {
          form: row,
        },
      });
    },
    change_switch($event, row, index) {
      let device_id = row.device_id;
      let func_switch = row.func_switch; //保存点击之后v-modeld的值(true，false)
      row.func_switch = !row.func_switch; //保持switch点击前的状态
      let message;
      if (func_switch == 1) {
        message = "开启";
      } else {
        message = "关闭";
      }
      let data = {
        device_id: device_id,
        func_switch: func_switch,
      };
      this.$confirm("是否" + message + "此设备", "消息提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios({
            Headers: { "Content-Type": "application/json;charset=utf-8" },
            method: "post",
            url: this.api.INTERFACES.deviceTurn,
            data: this.$qs.stringify(data),
            async: true,
          })
            .then((response) => {
              if (response.data.code == "200") {
                this.$message({
                  message: "设备" + message + "成功",
                  type: "success",
                  duration: 3000,
                });
                row.func_switch = !row.func_switch;
              } else {
                this.$message({
                  message: "设备" + message + "失败，请联系管理员",
                  type: "error",
                  duration: 3000,
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            showClose: true,
            message: "已取消开关！",
          });
        });

      // this.$confirm("改变状态", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning",
      // })
      //   .then(() => {
      //     switch_on ? (row.switch_on = true) : (row.switch_on = false); // 这一步很重要，row.showState会根据flag的值开启或关闭开关
      //     this.$message({ type: "success", message: "修改成功!" });
      //   })
      //   .catch(() => {
      //     this.$message({
      //       type: "info",
      //       showClose: true,
      //       message: "已取消开关！",
      //     });
      //   });
    },

    // 关闭编辑、增加弹出框
    closeDialog() {
      this.editFormVisible = false;
      this.getdata(); //关闭以后刷新数据
    },
  },
};
</script>

<style  scoped>
.page-box {
  margin: 0.5rem;
}
.user-search {
  margin-top: 2rem;
  position: absolute;
  right: 2rem;
}
.userRole {
  width: 100%;
}
.el-table {
  margin-top: 6rem;
}
.el-dialog {
  max-height: calc(100% - 30px) !;
  max-width: calc(100% - 30px) !;
  text-align: left;
}
</style>