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
            <el-col :span="5">
              <el-input
                v-model="formInline.device_name"
                placeholder="请输入设备名"
                clearable=""
              ></el-input>
            </el-col>
            <el-col :span="5">
              <el-input
                v-model="formInline.device_nickname"
                placeholder="请输入设备显示名称"
                clearable=""
              ></el-input>
            </el-col>
            <el-col :span="5">
              <el-input
                v-model="formInline.organization_name"
                placeholder="输入出厂商家名称"
                clearable=""
              ></el-input>
            </el-col>
            <el-col inline="true" :span="9">
              <el-col :span="12">
                <el-select v-model="formInline.group_id" placeholder="分类筛选">
                  <el-option
                    v-for="item in group_list"
                    :label="item.name"
                    :value="item.id"
                    :key="item.id"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="12">
                <el-input
                  v-model="formInline.group_value"
                  autocomplete="off"
                ></el-input>
              </el-col>
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
      :data="listData"
      highlight-current-row
      v-loading="loading"
      border
      element-loading-text="拼命加载中..."
      style="width: 100%"
    >
      <el-table-column align="center" type="selection"> </el-table-column>
      <el-table-column sortable prop="device_nickname" label="设备显示名称">
      </el-table-column>
      <el-table-column sortable prop="device_name" label="设备名称">
      </el-table-column>
      <el-table-column sortable prop="deviceId" label="设备id">
      </el-table-column>
      <el-table-column sortable prop="organization_name" label="出厂商家">
      </el-table-column>

      <el-table-column
        sortable
        prop="cpuid"
        label="绑定cpuid"
        :formatter="if_null"
      >
      </el-table-column>
      <el-table-column sortable prop="bind_user_name" :formatter="if_null_nick_name"  label="绑定人员">
      </el-table-column>
      <el-table-column sortable prop="bindDate"  :formatter="if_null_date" label="设备绑定时间">
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="
              handleEdit(scope.$index, scope.row, 'edit');
              dialogFormEdit = true;
            "
            >绑定</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="deleteDevice(scope.$index, scope.row)"
            >解绑</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <Pagination
      v-bind:child-msg="pageparm"
      @callFather="callFather"
    ></Pagination>
    <el-dialog
      :close-on-click-modal="false"
      @close="closeDialog"
      :inline="true"
      :title="dialog_tile"
      :visible.sync="dialogFormEdit"
    >
      <el-form v-model="editForm">
        <el-form-item label="设备显示名称" :label-width="formLabelWidth">
          <el-col :span="12">
            <span>{{ editForm.device_nickname }}</span>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备名称" :label-width="formLabelWidth">
              <el-col :span="18">
                <span>{{ editForm.device_name }}</span>
              </el-col>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="所属单位" :label-width="formLabelWidth">
          <el-col :span="12">
            <span>{{ editForm.organization_name }}</span>
          </el-col>
          <el-col :span="12">
            <el-form-item label="绑定人姓名" :label-width="formLabelWidth">
              <el-col :span="18">
                <span>{{ editForm.bind_user_name }}</span>
              </el-col>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="绑定CPUID" :label-width="formLabelWidth">
          <el-col :span="18">
            <el-input
              v-model="editForm.cpuid"
              placeholder="请输入您要绑定/修改绑定的设备的CPIUD"
              clearable=""
            ></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormEdit = false">取 消</el-button>
        <el-button type="primary" @click="submitForm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import NavTop from "../../components/nav_top/nav_top.vue";
import Pagination from "../../components/pagination/pagination.vue";

export default {
  data() {
    return {
      page_title: "设备绑定",
      input: "",
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: "添加",
      editForm: {
        deptId: "",
        deptName: "",
        deptNo: "",
        token: localStorage.getItem("logintoken"),
      },
      dialog_tile: "",
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogFormEdit: false,
      organization_list: [],
      form: {},
      formLabelWidth: "120px",

      formInline: {
        page: 1,
        limit: 10,
        device_name: "",
        device_nickname: "",
        organization_name: "",
        group_id: "",
        group_value: "",
        token: localStorage.getItem("logintoken"),
      },
      // 删除部门
      seletedata: {
        ids: "",
        token: localStorage.getItem("logintoken"),
      },
      userparm: [], //搜索权限
      listData: [], //用户数据
      group_list: [],
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
    this.getdata(this.formInline);
  },

  /**
   * 里面的方法只有被调用才会执行
   */
  methods: {
    // 获取公司列表
    getdata() {
      let that = this;
      this.loading = true;
      let device_name = this.formInline.device_name;
      let device_nickname = this.formInline.device_nickname;
      let organization_name = this.formInline.organization_name;
      let group_id = this.formInline.group_id;
      let group_value = this.formInline.group_value;
      let params = {
        page_no: this.formInline.page,
        page_size: this.formInline.limit,
      };
      if (device_name != "") {
        params.device_name = device_name;
      }

      if (device_nickname != "") {
        params.device_nickname = device_nickname;
      }
      if (organization_name != "") {
        params.organization_name = organization_name;
      }
      if (group_value != "") {
        params.group_value = group_value;
      }
      if (group_id != "") {
        params.group_id = group_id;
      }
      this.$axios({
        method: "get",
        url: this.api.INTERFACES.getDeviceBindList,
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
      this.$axios({
        method: "get",
        url: this.api.INTERFACES.getGroupSelectList,
        Headers: { "Content-Type": "application/json;charset=utf-8" },
        params: {},
        async: true,
      })
        .then((response) => {
          that.group_list = response.data.data; //数据放入listdata
          that.timer = new Date().getTime();
        })
        .catch((error) => {
          console.log(error);
        });
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
    //显示编辑界面
    handleEdit: function (index, row) {
      var that = this;
      this.$axios({
        method: "get",
        url: this.api.INTERFACES.getOrganizationSelectList,
        Headers: { "Content-Type": "application/json;charset=utf-8" },
        async: true,
      })
        .then((response) => {
          that.organization_list = response.data.data; //数据放入listdata
          that.timer = new Date().getTime();
        })
        .catch((error) => {
          console.log(error);
        });
      this.$axios({
        method: "get",
        url: this.api.INTERFACES.getUserSelectList,
        Headers: { "Content-Type": "application/json;charset=utf-8" },
        params: {},
        async: true,
      })
        .then((response) => {
          that.user_list = response.data.data; //数据放入listdata
          that.timer = new Date().getTime();
        })
        .catch((error) => {
          console.log(error);
        });
      this.$axios({
        method: "get",
        url: this.api.INTERFACES.getGroupSelectList,
        Headers: { "Content-Type": "application/json;charset=utf-8" },
        params: {},
        async: true,
      })
        .then((response) => {
          that.group_list = response.data.data; //数据放入listdata
          that.timer = new Date().getTime();
        })
        .catch((error) => {
          console.log(error);
        });
      that.editFormVisible = true;
      that.dialog_tile = "设备绑定";
      this.editForm = row;
      if (
        this.editForm.bind_user_name == "" ||
        this.editForm.bind_user_name == null
      ) {
        this.editForm.bind_user_name = "暂无绑定人";
      }
    },

    // 删除用户
    deleteDevice(index, row) {
      this.$confirm("确定解除该绑定信息吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios({
            Headers: { "Content-Type": "application/json;charset=utf-8" },
            method: "post",
            url: this.api.INTERFACES.delUserInfo,
            data: this.$qs.stringify({ id: row.id }),
            async: true,
          })
            .then((response) => {
              if (response.data.code == "200") {
                this.$message({
                  message: "用户信息删除成功",
                  type: "success",
                  duration: 3000,
                });

                this.getdata();
              } else {
                this.$message({
                  message: "组织机构信息修改失败，请联系管理员",
                  type: "error",
                  duration: 3000,
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
          //
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 关闭编辑、增加弹出框
    closeDialog() {
      this.getdata(); //关闭以后刷新数据
      this.editFormVisible = false;
    },
    //保存数据
    submitForm() {
      let that = this;
      let cpuid = that.editForm.cpuid;
      let device_id = that.editForm.deviceId;
      this.$confirm("确认绑定该CPU到指定设备吗？", "消息提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$axios({
          Headers: { "Content-Type": "application/json;charset=utf-8" },
          method: "post",
          url: this.api.INTERFACES.setDeviceBind,
          data: this.$qs.stringify({
            cpuid: cpuid,
            device_id: device_id,
          }),
          async: true,
        })
          .then((response) => {
            if (response.data.code == "200") {
              this.$message({
                message: "设备绑定成功",
                type: "success",
                duration: 3000,
              });
            } else {
              this.$message({
                message: "绑定设备失败，请联系管理员",
                type: "error",
                duration: 3000,
              });
              
            }
          })
          .catch((error) => {
             this.$message({
                message: "取消授权",
                type: "error",
                duration: 3000,
              });
          });
      });
    },
    if_null: function (row, column) {
      if (row.cpuid == null || row.cpuid == "") {
        return "暂未绑定设备";
      } else {
        return row.cpuid;
      }
    },
    if_null_date: function (row, column) {
      if (row.bindDate == null || row.bindDate == "") {
        return "暂无";
      } else {
        return row.bindDate;
      }
    },
    if_null_nick_name: function (row, column) {
      if (row.bind_user_name == null || row.bind_user_name == "") {
        return "暂无";
      } else {
        return row.bind_user_name;
      }
    },
  },
};
</script>

<style >
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