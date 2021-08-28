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
            <el-col :span="12">
              <el-input
                v-model="formInline.deptName"
              
                placeholder="请输入设备名称"
                clearable=""
              ></el-input>
            </el-col>
            <el-col :span="12">
              <el-input
                v-model="formInline.deptName"
             
                placeholder="输入公司名称"
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
      <el-table-column sortable prop="device_nickname" label="设备显示名称">
      </el-table-column>
      <el-table-column sortable prop="device_name" label="设备名">
      </el-table-column>
      <el-table-column sortable prop="device_master_name" label="所属公司/组织">
      </el-table-column>
      <el-table-column sortable prop="update_date" label="设备信息更新时间">
      </el-table-column>
      <!-- <el-table-column align="center" label="在线/离线"> </el-table-column> -->
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="
              transDevice(scope.$index, scope.row);
              dialogFormVisible = true;
            "
            >授权</el-button
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
      :inline="true"
      title="设备权限人员列表"
      :visible.sync="dialogFormVisible"
    >
      <div>
        <!--搜索筛选-->
        <el-form :inline="true" :model="formInline" class="user-search">
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="
                add_user_access();
                innerVisible = true;
              "
              >添加</el-button
            >
            <el-button
              type="primary"
              icon="el-icon-delete"
              @click="remove_access()"
              >移除</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <el-table
        ref="access_table"
        class="table-item"
        size="small"
        :data="listData_access"
        highlight-current-row
        v-loading="loading"
        border
        element-loading-text="拼命加载中..."
        style="width: 100%"
        @select="select_access"
      >
        <el-table-column align="center" type="selection"> </el-table-column>
        <el-table-column sortable prop="user_name" label="用户名">
        </el-table-column>
        <el-table-column sortable prop="nick_name" label="用户名称">
        </el-table-column>
        <el-table-column sortable prop="company_name" label="用户公司">
        </el-table-column>
        <el-table-column sortable prop="update_date" label="授权/更新时间">
        </el-table-column>
        <el-table-column sortable prop="update_user_id" label="授权用户id">
        </el-table-column>
      </el-table>
      <Pagination
        v-bind:child-msg="pageparm_access"
        @callFather="callFather_access"
      ></Pagination>
    </el-dialog>

    <el-dialog
      title="选择添加权限的人员"
      :close-on-click-modal="false"
      :inline="true"
      :visible.sync="innerVisible"
    >
      <div>
        <!--搜索筛选-->
        <el-form
          :inline="true"
          :model="formInline_user_list"
          class="user-search"
        >
          <el-form-item :inline="true">
            <el-row>
              <el-col :span="12">
                <el-input
                  v-model="formInline_user_list.nick_name"
                  
                  placeholder="请输入用户名"
                  clearable=""
                ></el-input>
              </el-col>
              <el-col :span="12">
                <el-input
                  v-model="formInline_user_list.company_name"
                 
                  placeholder="输入单位名称"
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
              @click="search_user"
              >搜索</el-button
            >
            <el-button
              size="small"
              type="primary"
              icon="el-icon-plus"
              @click="
                add_user();
                dialogFormEdit = true;
              "
              >添加</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <el-form v-model="form">
        <el-table
          ref="User_Table"
          class="table-item"
          size="small"
          :data="listData_user_list"
          highlight-current-row
          v-loading="loading"
          border
          element-loading-text="拼命加载中..."
          style="width: 100%"
          @select="select_user"
        >
          <el-table-column align="center" type="selection" />
          <el-table-column sortable prop="user_name" label="用户名">
          </el-table-column>
          <el-table-column sortable prop="nick_name" label="用户名称">
          </el-table-column>
          <el-table-column sortable prop="company_name" label="用户公司">
          </el-table-column>
          <el-table-column sortable prop="tel" label="联系方式">
          </el-table-column>
          <el-table-column sortable prop="address" label="家庭/单位地址">
          </el-table-column>
          <el-table-column
            sortable
            prop="register_date"
            align="center"
            label="注册时间"
          />
        </el-table>
        <Pagination
          v-bind:child-msg="pageparm_user_list"
          @callFather="callFather_user_list"
        ></Pagination>
      </el-form>
    </el-dialog>
  </div>
</template>


<script>
import NavTop from "../../components/nav_top/nav_top.vue";
import Pagination from "../../components/pagination/pagination.vue";

export default {
  data() {
    return {
      page_title: "设备权限转发",
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
      dialogFormVisible: false,
      innerVisible: false,
      form: {},
      formLabelWidth: "120px",
      formInline: {
        page: 1,
        limit: 10,
        varLable: "",
        varName: "",
        token: localStorage.getItem("logintoken"),
      },
      access_device_id: "",
      formInline_access: {
        page: 1,
        limit: 10,
      },
      formInline_user_list: {
        page: 1,
        limit: 10,
        nick_name: "",
        company_name: "",
      },
      // 删除部门
      seletedata: {
        ids: "",
        token: localStorage.getItem("logintoken"),
      },
      userparm: [], //搜索权限
      listData: [], //设备数据表
      listData_access: [], //用户权限分配表
      listData_user_list: [],
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10,
      },
      pageparm_access: {
        currentPage: 1,
        pageSize: 10,
        total: 10,
      },
      pageparm_user_list: {
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
      this.loading = true;
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
        url: this.api.INTERFACES.getDeviceInfoList,
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
    callFather_access(parm) {
      this.formInline_access.page = parm.currentPage;
      this.formInline_access.limit = parm.pageSize;
    },
    callFather_user_list(parm) {
      this.formInline_user_list.page = parm.currentPage;
      this.formInline_user_list.limit = parm.pageSize;
    },
    // 搜索事件
    search() {
      this.getdata(this.formInline);
    },
    //设备对应权限列表数据加载
    get_device_access_list(params) {
      this.$axios({
        method: "get",
        url: this.api.INTERFACES.getDeviceAccessList,
        params: params,
        data: "",
      })
        .then((response) => {
          this.listData_access = response.data.data.rows; //数据放入listdata
          this.pageparm_access.total = response.data.data.total; //长度
        })
        .catch((error) => {
          console.log(error);
        });
      this.loading = false;
      this.pageparm_access.currentPage = this.formInline_access.page;
      this.pageparm_access.pageSize = this.formInline_access.limit;
    },
    //设备权限授权页面打开
    transDevice(index, row) {
      this.form = row;
      this.access_device_id = row.device_id;
      let device_id = row.device_id;
      let params = {
        page_no: this.formInline_access.page,
        page_size: this.formInline_access.limit,
        device_id: device_id,
      };
      this.get_device_access_list(params);
    },
    //添加授权用户页面打开
    add_user_access() {
      this.innerVisible = true;
      this.get_data_user_list();
    },
    //获取用户列表-便于授权用户
    get_data_user_list() {
      this.loading = true;
      let nick_name = this.formInline_user_list.nick_name;
      let company_name = this.formInline_user_list.company_name;
      let params = {
        page_no: this.formInline.page,
        page_size: this.formInline.limit,
      };
      if (nick_name != "") {
        params.nick_name = nick_name;
      }
      if (company_name != "") {
        params.company_name = company_name;
      }
      this.$axios({
        method: "get",
        url: this.api.INTERFACES.getUserList,
        params: params,
        data: "",
      })
        .then((response) => {
          this.listData_user_list = response.data.data.rows; //数据放入listdata
          this.pageparm_user_list.total = response.data.data.total; //长度
        })
        .catch((error) => {
          console.log(error);
        });
      this.loading = false;
      this.pageparm_user_list.currentPage = this.formInline_user_list.page;
      this.pageparm_user_list.pageSize = this.formInline_user_list.limit;
    },
    //移除用户授权信息
    remove_access() {
      let id = this.$refs.access_table.selection[0].id;
      this.$confirm("确定移除该用户权限吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios({
            Headers: { "Content-Type": "application/json;charset=utf-8" },
            method: "post",
            url: this.api.INTERFACES.removeAccess,
            data: this.$qs.stringify({ id: id }),
            async: true,
          })
            .then((response) => {
              if (response.data.code == "200") {
                this.$message({
                  message: "用户信息删除成功",
                  type: "success",
                  duration: 3000,
                });
                let params = {
                  page_no: this.formInline_access.page,
                  page_size: this.formInline_access.limit,
                  device_id: this.formInline_access.access_device_id,
                };
                this.get_device_access_list(params);
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
    //添加用户授权信息
    add_user() {
      let device_id = this.access_device_id;
      let user_id = this.$refs.User_Table.selection[0].id;
      let data = {
        device_id: device_id,
        user_id: user_id,
      };
      this.$axios({
        method: "post",
        url: this.api.INTERFACES.setDeviceAccess,
        data: this.$qs.stringify(data),
      })
        .then((response) => {
          if (response.data.code == "200") {
            this.$message({
              message: "用户权限添加成功",
              type: "success",
              duration: 3000,
            });
            let params = {
              page_no: this.formInline_access.page,
              page_size: this.formInline_access.limit,
              device_id: this.formInline_access.access_device_id,
            };
            this.get_device_access_list(params);
          } else {
            this.$message({
              message: "用户权限添加失败，请联系管理员",
              type: "error",
              duration: 3000,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //搜索用户列表
    search_user() {
      this.get_data_user_list();
    },
    //选择userlist table中的用户
    select_user(selection, row) {
      this.$refs.User_Table.clearSelection(); //取消所有勾选
      this.$refs.User_Table.toggleRowSelection(row, true); //勾选当前选中
      //this.billId = row.id;
    },
    select_access(selection, row) {
      this.$refs.access_table.clearSelection(); //取消所有勾选
      this.$refs.access_table.toggleRowSelection(row, true); //勾选当前选中
      //this.billId = row.id;
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
/* .el-table__header-wrapper .el-checkbox {
    display:none;
} */
.table-item .el-table__header-wrapper .el-checkbox {
  display: none;
}
</style>